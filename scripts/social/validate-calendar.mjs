#!/usr/bin/env node
/**
 * validate-calendar.mjs
 *
 * Valida content/social/calendar.json contra su schema. Uso:
 *   node scripts/social/validate-calendar.mjs
 *
 * Falla con exit 1 si hay errores. Pensado para correr en CI antes
 * del scheduler real, y localmente vía `pnpm social:validate`.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CAL_PATH = resolve(process.cwd(), 'content/social/calendar.json');

function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exit(1);
}

function ok(msg) {
  console.log(`✅ ${msg}`);
}

let raw;
try {
  raw = readFileSync(CAL_PATH, 'utf8');
} catch {
  fail(`No puedo leer ${CAL_PATH}`);
}

let cal;
try {
  cal = JSON.parse(raw);
} catch (e) {
  fail(`calendar.json no es JSON válido: ${e.message}`);
}

// --- Estructura mínima ---
if (cal.version !== 1) fail(`version debe ser 1, es ${cal.version}`);
if (!Array.isArray(cal.posts)) fail('posts debe ser array');

const VALID_PLATFORMS = new Set([
  'instagram', 'facebook', 'tiktok', 'x', 'linkedin', 'pinterest', 'youtube',
]);
const VALID_FORMATS = new Set([
  'single_image', 'carousel', 'reel', 'story', 'video', 'text',
]);
const VALID_STATUSES = new Set([
  'draft', 'approved', 'published', 'failed', 'archived',
]);
const VALID_LOCALES = new Set(['es', 'ca']);
const VALID_MEDIA = new Set(['image', 'video']);

const ID_RE = /^[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-z]{2,5}-[a-z0-9-]+$/;

const ids = new Set();
let errors = 0;

for (const [i, p] of cal.posts.entries()) {
  const ctx = `posts[${i}] (id=${p?.id ?? '?'})`;
  const pushErr = (m) => { errors++; console.error(`  ❌ ${ctx}: ${m}`); };

  if (!p.id || !ID_RE.test(p.id)) pushErr(`id inválido (debe ser YYYY-MM-DD-platform-slug)`);
  if (ids.has(p.id)) pushErr(`id duplicado`);
  ids.add(p.id);

  if (!Array.isArray(p.platforms) || p.platforms.length === 0) pushErr(`platforms vacío`);
  for (const pl of p.platforms ?? []) if (!VALID_PLATFORMS.has(pl)) pushErr(`platform inválida: ${pl}`);

  if (!VALID_FORMATS.has(p.format)) pushErr(`format inválido: ${p.format}`);
  if (!VALID_STATUSES.has(p.status)) pushErr(`status inválido: ${p.status}`);
  if (!VALID_LOCALES.has(p.locale)) pushErr(`locale inválido: ${p.locale}`);

  if (!p.scheduled_at) pushErr(`scheduled_at vacío`);
  else if (Number.isNaN(Date.parse(p.scheduled_at))) pushErr(`scheduled_at no parseable: ${p.scheduled_at}`);

  if (!p.caption || typeof p.caption !== 'string') pushErr(`caption vacío`);
  else if (p.caption.length > 2200) pushErr(`caption excede 2200 chars (${p.caption.length})`);

  if (Array.isArray(p.hashtags) && p.hashtags.length > 30) pushErr(`hashtags excede 30 (${p.hashtags.length})`);

  if (!Array.isArray(p.media) || p.media.length === 0) pushErr(`media vacío`);
  else if (p.media.length > 10) pushErr(`media excede 10`);
  else {
    for (const [j, m] of p.media.entries()) {
      if (!VALID_MEDIA.has(m.type)) pushErr(`media[${j}].type inválido: ${m.type}`);
      if (!m.path || typeof m.path !== 'string') pushErr(`media[${j}].path vacío`);
    }
  }

  if (p.target_url && typeof p.target_url === 'string') {
    try { new URL(p.target_url); } catch { pushErr(`target_url no es URL válida: ${p.target_url}`); }
  }
}

if (errors > 0) fail(`${errors} error(es) en calendar.json`);

ok(`calendar.json válido — ${cal.posts.length} post(s).`);

// Resumen por status
const byStatus = {};
for (const p of cal.posts) {
  byStatus[p.status] = (byStatus[p.status] ?? 0) + 1;
}
console.log(`   Resumen: ${Object.entries(byStatus).map(([k, v]) => `${k}=${v}`).join(' · ')}`);

// Próximos approved
const nowMs = Date.now();
const upcoming = cal.posts
  .filter((p) => p.status === 'approved' && Date.parse(p.scheduled_at) > nowMs)
  .sort((a, b) => Date.parse(a.scheduled_at) - Date.parse(b.scheduled_at))
  .slice(0, 3);

if (upcoming.length > 0) {
  console.log(`\n   Próximos approved:`);
  for (const p of upcoming) console.log(`   • ${p.scheduled_at} → ${p.id}`);
}
