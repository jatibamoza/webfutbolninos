#!/usr/bin/env node
/**
 * scheduler.mjs
 *
 * Lee content/social/calendar.json, encuentra posts approved cuyo
 * scheduled_at ya llegó (con tolerancia ±15min), los envía a Publer
 * para programar/publicar, y actualiza el estado en el JSON.
 *
 * Pensado para ejecutarse desde GitHub Actions cada 30 minutos.
 *
 * ENV requerido:
 *   PUBLER_API_KEY        — Bearer-API token (Settings → Access & Login → Manage API Keys en Publer)
 *   PUBLER_WORKSPACE_ID   — Workspace UUID
 *   PUBLER_ACCOUNT_INSTAGRAM — Account ID de la cuenta @minigolclub
 *   PUBLER_ACCOUNT_TIKTOK    — opcional, para TikTok
 *   PUBLER_ACCOUNT_PINTEREST — opcional
 *   ASSETS_BASE_URL       — URL pública desde donde Publer descarga los assets
 *                           (ej. raw.githubusercontent.com/.../main o CDN propio).
 *                           Por defecto: raw GitHub del repo actual.
 *   GITHUB_REPOSITORY     — auto-inyectado en GH Actions ('owner/repo')
 *   GITHUB_REF_NAME       — auto-inyectado, default 'main'
 *
 * Flags:
 *   --dry-run    — no llama Publer ni modifica calendar.json. Solo loggea.
 *   --window=N   — minutos hacia atrás considerados "ahora ya". Default 120.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createPublerClient, PublerError } from './publer-client.mjs';

const CAL_PATH = resolve(process.cwd(), 'content/social/calendar.json');

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const windowArg = [...args].find((a) => a.startsWith('--window='));
// Window debe ser >> intervalo del cron para tolerar saltos de runs.
// GitHub Actions cron puede saltarse 1-2 runs en horas pico.
// Cron cada 30min + window 120min = tolera 4 runs perdidos.
const WINDOW_MIN = windowArg ? Number(windowArg.split('=')[1]) : 120;

function log(msg) { console.log(`[scheduler] ${msg}`); }
function err(msg) { console.error(`[scheduler] ❌ ${msg}`); }

function readCalendar() {
  const raw = readFileSync(CAL_PATH, 'utf8');
  return JSON.parse(raw);
}

function writeCalendar(cal) {
  cal.generated_at = new Date().toISOString();
  // 2 espacios + newline final → diffs limpios
  writeFileSync(CAL_PATH, JSON.stringify(cal, null, 2) + '\n', 'utf8');
}

function platformsKey(post) {
  return [...post.platforms].sort().join('+');
}

/**
 * Construye URL pública de un asset relativo del repo.
 * Publer necesita URLs HTTPS accesibles desde fuera para descargar
 * imágenes/vídeos. La estrategia más simple sin CDN propio: raw.githubusercontent.
 */
function buildAssetUrl(relativePath, { repo, branch, baseOverride }) {
  if (baseOverride) {
    const clean = relativePath.replace(/^\/+/, '');
    return `${baseOverride.replace(/\/$/, '')}/${clean}`;
  }
  if (!repo) throw new Error('GITHUB_REPOSITORY o ASSETS_BASE_URL requerido');
  const clean = relativePath.replace(/^\/+/, '');
  return `https://raw.githubusercontent.com/${repo}/${branch}/${clean}`;
}

function buildText(post) {
  const tags = (post.hashtags ?? []).map((h) => `#${h}`).join(' ');
  const parts = [post.caption];
  if (post.target_url) parts.push(`\n${post.target_url}`);
  if (tags) parts.push(`\n${tags}`);
  return parts.filter(Boolean).join('\n');
}

async function main() {
  log(`window=${WINDOW_MIN}min · dryRun=${DRY_RUN}`);

  const cal = readCalendar();
  const now = Date.now();
  const cutoff = now - WINDOW_MIN * 60 * 1000;

  const due = cal.posts.filter(
    (p) =>
      p.status === 'approved' &&
      Date.parse(p.scheduled_at) <= now &&
      Date.parse(p.scheduled_at) >= cutoff,
  );

  // Posts aprobados cuyo scheduled_at ya pasó hace MUCHO — no los publicamos
  // (puede que el operador los olvidó). Solo los marcamos failed con motivo.
  const stale = cal.posts.filter(
    (p) => p.status === 'approved' && Date.parse(p.scheduled_at) < cutoff,
  );

  log(`due=${due.length} stale=${stale.length} totalApproved=${due.length + stale.length}`);

  if (due.length === 0 && stale.length === 0) {
    log('Nada que hacer.');
    return;
  }

  // Marca stale como failed para que el editor decida (re-aprobar nuevo schedule)
  if (stale.length > 0) {
    for (const p of stale) {
      err(`stale post ${p.id} (scheduled ${p.scheduled_at}) — marcando failed`);
      p.status = 'failed';
      p.error = `Skipped: scheduled_at más de ${WINDOW_MIN}min en el pasado al evaluar`;
    }
  }

  if (due.length === 0) {
    if (!DRY_RUN) writeCalendar(cal);
    return;
  }

  // Init Publer
  const apiKey = process.env.PUBLER_API_KEY;
  const workspaceId = process.env.PUBLER_WORKSPACE_ID;
  const accountIds = {
    instagram: process.env.PUBLER_ACCOUNT_INSTAGRAM,
    tiktok: process.env.PUBLER_ACCOUNT_TIKTOK,
    pinterest: process.env.PUBLER_ACCOUNT_PINTEREST,
    facebook: process.env.PUBLER_ACCOUNT_FACEBOOK,
    x: process.env.PUBLER_ACCOUNT_X,
    linkedin: process.env.PUBLER_ACCOUNT_LINKEDIN,
    youtube: process.env.PUBLER_ACCOUNT_YOUTUBE,
  };

  const repo = process.env.GITHUB_REPOSITORY;
  const branch = process.env.GITHUB_REF_NAME ?? 'main';
  const baseOverride = process.env.ASSETS_BASE_URL;

  let client = null;
  if (!DRY_RUN) {
    if (!apiKey || !workspaceId) {
      err('PUBLER_API_KEY o PUBLER_WORKSPACE_ID no configurados');
      process.exit(1);
    }
    client = createPublerClient({ apiKey, workspaceId, accountIds });
  }

  let okCount = 0;
  let failCount = 0;

  for (const post of due) {
    try {
      const text = buildText(post);
      const media = post.media.map((m) => ({
        type: m.type,
        url: buildAssetUrl(m.path, { repo, branch, baseOverride }),
        alt: m.alt,
      }));

      log(`→ ${post.id} (${platformsKey(post)}) ${DRY_RUN ? '[DRY]' : ''}`);
      log(`  text: ${text.slice(0, 80)}${text.length > 80 ? '...' : ''}`);
      log(`  media: ${media.map((m) => `${m.type}:${m.url}`).join(', ')}`);

      if (!DRY_RUN) {
        const { jobId } = await client.schedulePost({
          platforms: post.platforms,
          text,
          scheduledAt: post.scheduled_at,
          media,
        });
        post.status = 'published';
        post.published_at = new Date().toISOString();
        post.publer_post_id = jobId;
        post.error = null;
        log(`  ✅ jobId=${jobId}`);
      }
      okCount++;
    } catch (e) {
      failCount++;
      post.status = 'failed';
      post.error = e instanceof PublerError
        ? `${e.message} body=${JSON.stringify(e.body).slice(0, 200)}`
        : e.message;
      err(`  fallo en ${post.id}: ${post.error}`);
    }
  }

  log(`Resumen: ok=${okCount} fail=${failCount}`);

  if (!DRY_RUN) writeCalendar(cal);

  if (failCount > 0 && okCount === 0) process.exit(1); // todo falló → fail CI
}

main().catch((e) => {
  err(`fatal: ${e.stack ?? e.message}`);
  process.exit(1);
});
