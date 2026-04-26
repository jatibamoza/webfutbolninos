// Genera cover placeholder para un artículo (1200×750) con título y categoría.
// Uso: node scripts/generate-article-cover.mjs <slug> <categoria> <title>
// Ejemplo: node scripts/generate-article-cover.mjs como-ensenar-futbol iniciacion "Cómo enseñar fútbol desde cero"
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

// Map categoría → color marca
const categoryColors = {
  entrenamiento: '#16A34A',
  juegos: '#EC4899',
  equipamiento: '#F59E0B',
  iniciacion: '#2563EB',
  recursos: '#0891B2',
  'mundial-2026': '#DC2626',
};

const categoryLabels = {
  entrenamiento: 'ENTRENAMIENTO',
  juegos: 'JUEGOS',
  equipamiento: 'EQUIPAMIENTO',
  iniciacion: 'INICIACIÓN',
  recursos: 'RECURSOS',
  'mundial-2026': 'MUNDIAL 2026',
};

const [, , slug, categoria, ...titleParts] = process.argv;
const title = titleParts.join(' ');

if (!slug || !categoria || !title) {
  console.error('Uso: node scripts/generate-article-cover.mjs <slug> <categoria> <title>');
  process.exit(1);
}

const accentColor = categoryColors[categoria] ?? '#2563EB';
const categoryLabel = categoryLabels[categoria] ?? categoria.toUpperCase();

// Word-wrap manual para que el título quepa en máximo 3 líneas a 56pt
function wrapTitle(text, maxCharsPerLine = 30) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length <= maxCharsPerLine) {
      current = (current + ' ' + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

const titleLines = wrapTitle(title);
const titleSvg = titleLines
  .map((line, i) => `<text x="80" y="${380 + i * 80}" font-family="'Fredoka','Trebuchet MS',sans-serif" font-size="64" font-weight="700" fill="#0F172A">${line.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>`)
  .join('\n  ');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFBEB"/>
      <stop offset="100%" stop-color="#FEF3C7"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="750" fill="url(#bg)"/>

  <!-- Banda lateral con color de categoría -->
  <rect x="0" y="0" width="16" height="750" fill="${accentColor}"/>

  <!-- Logo -->
  <g transform="translate(80, 100)">
    <circle cx="60" cy="60" r="58" fill="#2563EB"/>
    <circle cx="60" cy="60" r="42" fill="#FFFBEB"/>
    <path d="M60 28l10 16h-20l10-16zM92 60l-16 10v-20l16 10zM60 92l-10-16h20l-10 16zM28 60l16-10v20l-16-10z" fill="#0F172A"/>
    <circle cx="60" cy="60" r="8" fill="#0F172A"/>
  </g>

  <text x="170" y="170" font-family="'Fredoka','Trebuchet MS',sans-serif" font-size="36" font-weight="700" fill="#0F172A">MiniGol Club</text>

  <!-- Categoría badge -->
  <rect x="80" y="280" rx="6" ry="6" width="${categoryLabel.length * 14 + 40}" height="44" fill="${accentColor}"/>
  <text x="100" y="310" font-family="'Nunito','Trebuchet MS',sans-serif" font-size="22" font-weight="700" fill="#FFFFFF">${categoryLabel}</text>

  <!-- Título -->
  ${titleSvg}

  <!-- Dominio -->
  <text x="80" y="690" font-family="'Nunito','Trebuchet MS',sans-serif" font-size="22" font-weight="600" fill="#475569">minigolclub.com</text>
</svg>`;

const outDir = resolve(here, '..', 'public', 'articulos', categoria);
mkdirSync(outDir, { recursive: true });
const out = resolve(outDir, `${slug}.jpg`);

const buffer = await sharp(Buffer.from(svg))
  .jpeg({ quality: 85, mozjpeg: true })
  .toBuffer();

writeFileSync(out, buffer);
console.log(`Cover generada: ${out} (${(buffer.length / 1024).toFixed(1)} KB)`);
