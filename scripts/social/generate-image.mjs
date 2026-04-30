#!/usr/bin/env node
/**
 * generate-image.mjs
 *
 * Genera imágenes sociales (1080x1080 feed, 1000x1500 pinterest,
 * 1080x1920 reel cover) desde el frontmatter de un artículo MDX.
 * Diseño "Cuaderno de Campo" con cover de fondo + overlay branded.
 *
 * USO CLI:
 *   pnpm social:image -- --slug=ejercicios-futbol-6-anos --format=feed --locale=es
 *
 * USO MÓDULO:
 *   import { generateImage, FORMATS } from './generate-image.mjs';
 *   await generateImage({ slug, format: 'feed', locale: 'es' });
 *
 * Outputs a: public/social/<slug>/<format>.jpg
 *
 * Requiere fuentes TTF en src/assets/fonts/:
 *   - Fredoka-Bold.ttf  (display)
 *   - Nunito-Regular.ttf (body)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import matter from 'gray-matter';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

export const FORMATS = {
  feed: { width: 1080, height: 1080, titleSize: 72 },
  pinterest: { width: 1000, height: 1500, titleSize: 80 },
  'reel-cover': { width: 1080, height: 1920, titleSize: 96 },
};

const TOKENS = {
  paper: '#FFFCF1',
  foreground: '#1a1f2c',
  marker: '#FACC15',
  primary: '#2563EB',
};

const FREDOKA_TTF = resolve(process.cwd(), 'src/assets/fonts/Fredoka-Bold.ttf');
const NUNITO_TTF = resolve(process.cwd(), 'src/assets/fonts/Nunito-Regular.ttf');

let cachedFonts = null;
function loadFonts() {
  if (cachedFonts) return cachedFonts;
  if (!existsSync(FREDOKA_TTF) || !existsSync(NUNITO_TTF)) {
    throw new Error(
      'Faltan fuentes en src/assets/fonts/. Bájalas con:\n' +
        '  curl -sL -o src/assets/fonts/Fredoka-Bold.ttf "https://r2.fontsource.org/fonts/fredoka@latest/latin-700-normal.ttf"\n' +
        '  curl -sL -o src/assets/fonts/Nunito-Regular.ttf "https://r2.fontsource.org/fonts/nunito@latest/latin-400-normal.ttf"',
    );
  }
  cachedFonts = [
    { name: 'Fredoka', data: readFileSync(FREDOKA_TTF), weight: 700, style: 'normal' },
    { name: 'Nunito', data: readFileSync(NUNITO_TTF), weight: 400, style: 'normal' },
  ];
  return cachedFonts;
}

function findMdx(collectionDir, targetSlug) {
  const root = resolve(process.cwd(), `src/content/${collectionDir}`);
  if (!existsSync(root)) return null;
  for (const cat of readdirSync(root)) {
    const candidate = join(root, cat, `${targetSlug}.mdx`);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

/**
 * Genera una imagen social y la escribe en public/social/<slug>/<format>.jpg.
 *
 * @param {Object} opts
 * @param {string} opts.slug
 * @param {'feed'|'pinterest'|'reel-cover'} opts.format
 * @param {'es'|'ca'} opts.locale
 * @param {boolean} [opts.skipExisting=false] - si true, no regenera si ya existe
 * @returns {Promise<{ outPath: string, sizeKB: number, skipped: boolean }>}
 */
export async function generateImage({ slug, format, locale, skipExisting = false }) {
  if (!slug) throw new Error('slug requerido');
  const cfg = FORMATS[format];
  if (!cfg) throw new Error(`format inválido: ${format}. Opciones: ${Object.keys(FORMATS).join(', ')}`);
  if (!['es', 'ca'].includes(locale)) throw new Error(`locale inválido: ${locale}`);

  const outDir = resolve(process.cwd(), `public/social/${slug}`);
  const outPath = join(outDir, `${format}.jpg`);

  if (skipExisting && existsSync(outPath)) {
    return { outPath, sizeKB: 0, skipped: true };
  }

  const collectionDir = locale === 'ca' ? 'articulos-ca' : 'articulos';
  const mdxPath = findMdx(collectionDir, slug);
  if (!mdxPath) throw new Error(`No encuentro ${slug}.mdx en src/content/${collectionDir}/`);

  const { data: fm } = matter(readFileSync(mdxPath, 'utf8'));
  const fonts = loadFonts();
  const { width, height, titleSize } = cfg;

  // Cover difuminado de fondo
  const coverPath = resolve(dirname(mdxPath), fm.cover);
  let coverDataUrl = null;
  if (existsSync(coverPath)) {
    const blurred = await sharp(coverPath)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .blur(8)
      .modulate({ brightness: 0.5 })
      .jpeg({ quality: 80 })
      .toBuffer();
    coverDataUrl = `data:image/jpeg;base64,${blurred.toString('base64')}`;
  }

  const ageLabel = locale === 'ca' ? 'anys' : 'años';
  const ageBadge = fm.edadMin && fm.edadMax ? `${fm.edadMin}–${fm.edadMax} ${ageLabel}` : null;
  const categoria = (fm.categoria ?? '').toString().toUpperCase();
  const title = fm.title ?? slug;

  const node = {
    type: 'div',
    props: {
      style: {
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: TOKENS.foreground,
        fontFamily: 'Fredoka',
        color: TOKENS.paper,
      },
      children: [
        coverDataUrl && {
          type: 'img',
          props: {
            src: coverDataUrl,
            width,
            height,
            style: { position: 'absolute', top: 0, left: 0 },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: 18,
              backgroundColor: TOKENS.marker,
              display: 'flex',
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'relative',
              width,
              height,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '60px 60px 60px 80px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontSize: 22,
                          fontWeight: 700,
                          backgroundColor: TOKENS.marker,
                          color: TOKENS.foreground,
                          padding: '14px 22px',
                          borderRadius: 6,
                          letterSpacing: 4,
                        },
                        children: categoria,
                      },
                    },
                    ageBadge && {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontSize: 22,
                          fontWeight: 700,
                          border: `3px solid ${TOKENS.paper}`,
                          padding: '12px 20px',
                          borderRadius: 999,
                          letterSpacing: 2,
                        },
                        children: ageBadge,
                      },
                    },
                  ].filter(Boolean),
                },
              },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column' },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          fontSize: titleSize,
                          fontWeight: 700,
                          lineHeight: 1.05,
                          letterSpacing: -1,
                          color: TOKENS.paper,
                          marginBottom: 32,
                        },
                        children: title,
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderTop: `2px solid rgba(255,252,241,0.4)`,
                          paddingTop: 22,
                        },
                        children: [
                          {
                            type: 'div',
                            props: {
                              style: { display: 'flex', fontSize: 30, fontWeight: 700 },
                              children: [
                                { type: 'span', props: { children: 'MiniGol ' } },
                                {
                                  type: 'span',
                                  props: { style: { color: TOKENS.marker }, children: 'Club' },
                                },
                              ],
                            },
                          },
                          {
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                fontFamily: 'Nunito',
                                fontSize: 22,
                                opacity: 0.9,
                              },
                              children: 'minigolclub.com',
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ].filter(Boolean),
    },
  };

  const svg = await satori(node, { width, height, fonts });
  const png = new Resvg(svg).render().asPng();
  const jpeg = await sharp(png).jpeg({ quality: 88, mozjpeg: true }).toBuffer();

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, jpeg);

  return { outPath, sizeKB: jpeg.length / 1024, skipped: false };
}

// ----------------------------------------------------------------------------
// CLI
// ----------------------------------------------------------------------------

if (process.argv[1]?.endsWith('generate-image.mjs')) {
  const args = Object.fromEntries(
    process.argv.slice(2).map((a) => {
      const [k, v] = a.replace(/^--/, '').split('=');
      return [k, v ?? true];
    }),
  );

  const slug = args.slug;
  const format = args.format ?? 'feed';
  const locale = args.locale ?? 'es';

  if (!slug) {
    console.error('❌ --slug requerido. Ej: --slug=ejercicios-futbol-6-anos');
    process.exit(1);
  }

  try {
    const { outPath, sizeKB } = await generateImage({ slug, format, locale });
    console.log(`✅ ${outPath} (${FORMATS[format].width}×${FORMATS[format].height}, ${sizeKB.toFixed(1)} KB)`);
  } catch (e) {
    console.error(`❌ ${e.message}`);
    process.exit(1);
  }
}
