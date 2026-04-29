#!/usr/bin/env node
/**
 * generate-image.mjs
 *
 * Genera imágenes sociales (1080x1080 feed, 1000x1500 pinterest,
 * 1080x1920 reel cover) desde el frontmatter de un artículo MDX.
 * Diseño "Cuaderno de Campo" con cover de fondo + overlay branded.
 *
 * Uso:
 *   pnpm social:image -- --slug=ejercicios-futbol-6-anos --format=feed --locale=es
 *   pnpm social:image -- --slug=exercicis-futbol-6-anys --format=pinterest --locale=ca
 *
 * Outputs a: public/social/<slug>/<format>.jpg
 *
 * Requiere fuentes TTF en src/assets/fonts/:
 *   - Fredoka-Bold.ttf  (display)
 *   - Nunito-Regular.ttf (body)
 *
 * Diseño:
 *   - Background: cover original difuminado + oscurecido
 *   - Marker amarillo lateral izquierdo (acento de marca)
 *   - Top: stamp categoría (sobre marker amarillo) + edad badge
 *   - Bottom: título grande + footer brand "MiniGol Club · minigolclub.com"
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import matter from 'gray-matter';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

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

const FORMATS = {
  feed: { width: 1080, height: 1080, titleSize: 72 },
  pinterest: { width: 1000, height: 1500, titleSize: 80 },
  'reel-cover': { width: 1080, height: 1920, titleSize: 96 },
};

if (!FORMATS[format]) {
  console.error(`❌ --format inválido. Opciones: ${Object.keys(FORMATS).join(', ')}`);
  process.exit(1);
}

const { width, height, titleSize } = FORMATS[format];

// --- Encontrar el MDX ---
const collectionDir = locale === 'ca' ? 'articulos-ca' : 'articulos';
function findMdx(dir, targetSlug) {
  const root = resolve(process.cwd(), dir);
  if (!existsSync(root)) return null;
  for (const cat of readdirSync(root)) {
    const candidate = join(root, cat, `${targetSlug}.mdx`);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}
const mdxPath = findMdx(`src/content/${collectionDir}`, slug);
if (!mdxPath) {
  console.error(`❌ No encuentro ${slug}.mdx en src/content/${collectionDir}/`);
  process.exit(1);
}

const { data: fm } = matter(readFileSync(mdxPath, 'utf8'));

// --- Fuentes ---
const FREDOKA_TTF = resolve(process.cwd(), 'src/assets/fonts/Fredoka-Bold.ttf');
const NUNITO_TTF = resolve(process.cwd(), 'src/assets/fonts/Nunito-Regular.ttf');

if (!existsSync(FREDOKA_TTF) || !existsSync(NUNITO_TTF)) {
  console.error('❌ Faltan fuentes en src/assets/fonts/. Bájalas con:');
  console.error('   curl -sL -o src/assets/fonts/Fredoka-Bold.ttf "https://github.com/google/fonts/raw/main/ofl/fredoka/Fredoka%5Bwdth%2Cwght%5D.ttf"');
  console.error('   curl -sL -o src/assets/fonts/Nunito-Regular.ttf "https://github.com/google/fonts/raw/main/ofl/nunito/Nunito%5Bwght%5D.ttf"');
  process.exit(1);
}

const fonts = [
  { name: 'Fredoka', data: readFileSync(FREDOKA_TTF), weight: 700, style: 'normal' },
  { name: 'Nunito', data: readFileSync(NUNITO_TTF), weight: 400, style: 'normal' },
];

// --- Cover difuminado de fondo ---
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
} else {
  console.warn(`⚠ Cover no encontrado en ${coverPath} — fondo sólido`);
}

const TOKENS = {
  paper: '#FFFCF1',
  foreground: '#1a1f2c',
  marker: '#FACC15',
  primary: '#2563EB',
};

const ageLabel = (locale === 'ca' ? 'anys' : 'años');
const ageBadge = fm.edadMin && fm.edadMax ? `${fm.edadMin}–${fm.edadMax} ${ageLabel}` : null;
const categoria = (fm.categoria ?? '').toString().toUpperCase();
const title = fm.title ?? slug;

// --- Composición JSX (Satori syntax) ---
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
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
          },
        },
      },
      // Strip marker lateral izquierda (capa por encima del cover)
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
      // Capa de contenido (encima del cover)
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
            // Top row: stamp categoría + edad badge
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                },
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
            // Bottom: título + footer
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                },
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

const outDir = resolve(process.cwd(), `public/social/${slug}`);
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, `${format}.jpg`);
writeFileSync(outPath, jpeg);

console.log(`✅ ${outPath} (${width}×${height}, ${(jpeg.length / 1024).toFixed(1)} KB)`);
