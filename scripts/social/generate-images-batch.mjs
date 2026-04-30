#!/usr/bin/env node
/**
 * generate-images-batch.mjs
 *
 * Batch del generador de imágenes sociales con 3 modos:
 *
 * 1. CALENDAR (default) — escanea content/social/calendar.json y genera
 *    todas las imágenes faltantes. Mapea cada post a un formato según
 *    el campo `format` del calendario:
 *      - 'single_image' / 'carousel' → feed (1080×1080)
 *      - 'reel' / 'video' → reel-cover (1080×1920)
 *      - 'story' → reel-cover (1080×1920)
 *      - cualquier otro → feed
 *
 *    El path generado se compara con el media[0].path del post — si
 *    coinciden se genera ahí; si no, avisa pero no genera (el editor
 *    eligió un path manual y lo subirá él).
 *
 * 2. SLUG — un slug, los 3 formatos. Útil al lanzar un artículo a
 *    Pinterest + Instagram + Reel a la vez.
 *
 * 3. ALL — todos los artículos publicados (no draft) en una colección,
 *    un único formato. Útil para sembrar Pinterest masivamente.
 *
 * USO:
 *   pnpm social:images:batch                                 # modo CALENDAR
 *   pnpm social:images:batch -- --slug=X --locale=ca         # modo SLUG (3 formatos)
 *   pnpm social:images:batch -- --all --locale=ca --format=pinterest  # modo ALL
 *   pnpm social:images:batch -- --force                      # regenera incluso si existen
 *
 * Flags:
 *   --slug=<slug>      modo SLUG: produce feed + pinterest + reel-cover
 *   --all              modo ALL: todos los artículos de la colección
 *   --locale=es|ca     default es. Aplica a SLUG y ALL.
 *   --format=<format>  default feed (modo ALL). Ignorado en CALENDAR.
 *   --force            regenera incluso si la imagen ya existe
 *   --dry-run          solo loggea qué se generaría
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join, basename } from 'node:path';
import matter from 'gray-matter';
import { generateImage, FORMATS } from './generate-image.mjs';

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  }),
);

const FORCE = args.force === true;
const DRY = args['dry-run'] === true;
const LOCALE = args.locale ?? 'es';

function log(msg) { console.log(`[batch] ${msg}`); }
function err(msg) { console.error(`[batch] ❌ ${msg}`); }

/**
 * Mapea el `format` del calendar al formato de imagen apropiado.
 */
function calendarFormatToImageFormat(calFormat) {
  switch (calFormat) {
    case 'single_image':
    case 'carousel':
    case 'text':
      return 'feed';
    case 'reel':
    case 'video':
    case 'story':
      return 'reel-cover';
    default:
      return 'feed';
  }
}

/**
 * Modo SLUG: 3 formatos para un slug.
 */
async function runSlugMode(slug) {
  log(`Modo SLUG: ${slug} (${LOCALE}) → 3 formatos`);
  const formats = Object.keys(FORMATS);
  let ok = 0, skipped = 0, failed = 0;

  for (const format of formats) {
    try {
      if (DRY) {
        log(`  [DRY] ${slug}/${format}.jpg`);
        ok++;
        continue;
      }
      const result = await generateImage({ slug, format, locale: LOCALE, skipExisting: !FORCE });
      if (result.skipped) {
        log(`  ⏭  ${format} ya existe (--force para regenerar)`);
        skipped++;
      } else {
        log(`  ✅ ${format} (${result.sizeKB.toFixed(1)} KB)`);
        ok++;
      }
    } catch (e) {
      err(`  fallo en ${format}: ${e.message}`);
      failed++;
    }
  }
  log(`Resumen: ok=${ok} skipped=${skipped} failed=${failed}`);
  if (failed > 0) process.exit(1);
}

/**
 * Modo ALL: todos los artículos publicados en una colección, un formato.
 */
async function runAllMode() {
  const format = args.format ?? 'feed';
  if (!FORMATS[format]) {
    err(`format inválido: ${format}. Opciones: ${Object.keys(FORMATS).join(', ')}`);
    process.exit(1);
  }

  const collectionDir = LOCALE === 'ca' ? 'articulos-ca' : 'articulos';
  const root = resolve(process.cwd(), `src/content/${collectionDir}`);

  const slugs = [];
  for (const cat of readdirSync(root)) {
    const catDir = join(root, cat);
    for (const file of readdirSync(catDir)) {
      if (!file.endsWith('.mdx')) continue;
      const slug = file.replace(/\.mdx$/, '');
      const fm = matter(readFileSync(join(catDir, file), 'utf8')).data;
      if (fm.draft) continue;
      slugs.push(slug);
    }
  }

  log(`Modo ALL: ${slugs.length} artículos publicados (${LOCALE}) × formato ${format}`);
  let ok = 0, skipped = 0, failed = 0;

  for (const slug of slugs) {
    try {
      if (DRY) {
        log(`  [DRY] ${slug}/${format}.jpg`);
        ok++;
        continue;
      }
      const result = await generateImage({ slug, format, locale: LOCALE, skipExisting: !FORCE });
      if (result.skipped) {
        log(`  ⏭  ${slug}`);
        skipped++;
      } else {
        log(`  ✅ ${slug} (${result.sizeKB.toFixed(1)} KB)`);
        ok++;
      }
    } catch (e) {
      err(`  fallo en ${slug}: ${e.message}`);
      failed++;
    }
  }
  log(`Resumen: ok=${ok} skipped=${skipped} failed=${failed}`);
  if (failed > 0) process.exit(1);
}

/**
 * Modo CALENDAR: lee calendar.json, genera lo que falta.
 */
async function runCalendarMode() {
  const calPath = resolve(process.cwd(), 'content/social/calendar.json');
  if (!existsSync(calPath)) {
    err('content/social/calendar.json no existe — nada que hacer');
    process.exit(1);
  }
  const cal = JSON.parse(readFileSync(calPath, 'utf8'));

  log(`Modo CALENDAR: ${cal.posts.length} posts en calendar`);
  let ok = 0, skipped = 0, failed = 0, manual = 0;

  for (const post of cal.posts) {
    if (post.status === 'archived') continue;
    if (!post.article_slug) {
      log(`  ⏭  ${post.id} sin article_slug — skip`);
      continue;
    }
    if (!Array.isArray(post.media) || post.media.length === 0) continue;

    const expectedFormat = calendarFormatToImageFormat(post.format);
    const expectedPath = `public/social/${post.article_slug}/${expectedFormat}.jpg`;
    const declaredPath = post.media[0].path;

    if (declaredPath !== expectedPath) {
      log(`  ⚠  ${post.id} → media path manual (${declaredPath}) — saltado, lo gestiona el editor`);
      manual++;
      continue;
    }

    try {
      if (DRY) {
        log(`  [DRY] ${post.id} → ${expectedPath}`);
        ok++;
        continue;
      }
      const result = await generateImage({
        slug: post.article_slug,
        format: expectedFormat,
        locale: post.locale ?? 'es',
        skipExisting: !FORCE,
      });
      if (result.skipped) {
        log(`  ⏭  ${post.id} ya existe`);
        skipped++;
      } else {
        log(`  ✅ ${post.id} → ${basename(result.outPath)} (${result.sizeKB.toFixed(1)} KB)`);
        ok++;
      }
    } catch (e) {
      err(`  fallo en ${post.id}: ${e.message}`);
      failed++;
    }
  }
  log(`Resumen: ok=${ok} skipped=${skipped} manual=${manual} failed=${failed}`);
  if (failed > 0) process.exit(1);
}

// --- Entry point ---
if (args.slug) {
  await runSlugMode(args.slug);
} else if (args.all) {
  await runAllMode();
} else {
  await runCalendarMode();
}
