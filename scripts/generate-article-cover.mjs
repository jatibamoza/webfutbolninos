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

// Word-wrap manual para que el título quepa en máximo 3 líneas a 50pt
function wrapTitle(text, maxCharsPerLine = 32) {
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
// Centramos verticalmente el bloque de título según el número de líneas para
// repartir el espacio entre la cabecera y el footer y eliminar el "vacío" inferior.
const titleStartY = 380 - (titleLines.length - 1) * 30;
const titleSvg = titleLines
  .map((line, i) => `<text x="80" y="${titleStartY + i * 60}" font-family="'Fredoka','Trebuchet MS',sans-serif" font-size="50" font-weight="700" fill="#1A1F2C" letter-spacing="-0.02em">${line.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>`)
  .join('\n  ');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FAF6E8"/>
      <stop offset="100%" stop-color="#F4EBC8"/>
    </linearGradient>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M32 0H0V32" fill="none" stroke="#E8DEC0" stroke-width="0.8"/>
    </pattern>
  </defs>

  <rect width="1200" height="750" fill="url(#bg)"/>
  <rect width="1200" height="750" fill="url(#grid)" opacity="0.55"/>

  <!-- Línea roja del cuaderno (margen izquierdo) -->
  <line x1="56" y1="0" x2="56" y2="750" stroke="#DC3C3C" stroke-width="1.5" opacity="0.32"/>

  <!-- Logo (escudo navy + M amarilla) -->
  <g transform="translate(80, 80) scale(0.96)">
    <path d="M50 6 L88 16 L88 50 C88 74 72 88 50 94 C28 88 12 74 12 50 L12 16 Z" fill="#1A1F2C"/>
    <g stroke="#FFFCF1" stroke-width="1.2" fill="none" opacity="0.5">
      <rect x="22" y="20" width="56" height="48" rx="3"/>
      <line x1="50" y1="20" x2="50" y2="68"/>
      <circle cx="50" cy="44" r="9"/>
    </g>
    <text x="50" y="57" text-anchor="middle" font-family="'Fredoka',system-ui,sans-serif" font-weight="700" font-size="36" fill="#F59E0B">M</text>
  </g>

  <text x="190" y="135" font-family="'Fredoka','Trebuchet MS',sans-serif" font-size="32" font-weight="700" fill="#1A1F2C" letter-spacing="-0.02em">
    MiniGol <tspan fill="#F59E0B">Club</tspan>
  </text>
  <text x="190" y="160" font-family="'JetBrains Mono',ui-monospace,monospace" font-size="13" font-weight="500" fill="#4D5468" letter-spacing="0.18em">FÚTBOL · PARA · PADRES</text>

  <!-- Dorsal decorativo -->
  <text x="1130" y="270" text-anchor="end" font-family="'Fredoka',system-ui,sans-serif" font-size="200" font-weight="700" fill="${accentColor}" opacity="0.10" letter-spacing="-0.04em">${String(Math.floor(Math.random() * 99) + 1).padStart(2, '0')}</text>

  <!-- Categoría chip mono -->
  <g transform="translate(80, 290)">
    <rect x="0" y="0" width="28" height="4" rx="2" fill="${accentColor}"/>
    <text x="40" y="4" font-family="'JetBrains Mono',ui-monospace,monospace" font-size="14" font-weight="500" fill="#1A1F2C" letter-spacing="0.12em">${categoryLabel}</text>
  </g>

  <!-- Título -->
  ${titleSvg}

  <!-- Marker amarillo decorativo en bottom -->
  <rect x="80" y="635" width="180" height="14" fill="#FFD45E" opacity="0.85"/>

  <!-- Dominio mono -->
  <text x="80" y="688" font-family="'JetBrains Mono',ui-monospace,monospace" font-size="16" font-weight="500" fill="#1A1F2C" letter-spacing="0.15em">MINIGOLCLUB.COM</text>

  <!-- Sello bottom-right rotado -->
  <g transform="translate(1010, 660) rotate(-2)">
    <rect x="0" y="0" width="100" height="28" rx="4" fill="none" stroke="#C9BC91" stroke-width="1.5"/>
    <text x="50" y="18" text-anchor="middle" font-family="'JetBrains Mono',ui-monospace,monospace" font-size="10" letter-spacing="0.18em" fill="#4D5468">EST · 2026</text>
  </g>
</svg>`;

const outDir = resolve(here, '..', 'public', 'articulos', categoria);
mkdirSync(outDir, { recursive: true });
const out = resolve(outDir, `${slug}.jpg`);

const buffer = await sharp(Buffer.from(svg))
  .jpeg({ quality: 85, mozjpeg: true })
  .toBuffer();

writeFileSync(out, buffer);
console.log(`Cover generada: ${out} (${(buffer.length / 1024).toFixed(1)} KB)`);
