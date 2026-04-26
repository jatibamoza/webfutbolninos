// Genera /public/og-default.jpg (1200×630) con la marca MiniGol Club.
// Ejecutar manualmente cuando cambien la marca o el tagline:
//   node scripts/generate-og-default.mjs
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '..', 'public', 'og-default.jpg');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFFBEB"/>
      <stop offset="100%" stop-color="#FEF3C7"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Logo -->
  <g transform="translate(100, 120)">
    <circle cx="80" cy="80" r="78" fill="#2563EB"/>
    <circle cx="80" cy="80" r="58" fill="#FFFBEB"/>
    <path d="M80 38l13 21h-26l13-21zM122 80l-21 13v-26l21 13zM80 122l-13-21h26l-13 21zM38 80l21-13v26l-21-13z" fill="#0F172A"/>
    <circle cx="80" cy="80" r="10" fill="#0F172A"/>
  </g>

  <!-- Marca -->
  <text x="100" y="380" font-family="'Fredoka','Trebuchet MS',sans-serif" font-size="92" font-weight="700" fill="#0F172A">
    MiniGol Club
  </text>

  <!-- Tagline -->
  <text x="100" y="450" font-family="'Nunito','Trebuchet MS',sans-serif" font-size="40" font-weight="600" fill="#2563EB">
    Fútbol para niños, explicado para padres
  </text>

  <!-- Subtítulo -->
  <text x="100" y="510" font-family="'Nunito','Trebuchet MS',sans-serif" font-size="28" font-weight="400" fill="#475569">
    Guías, ejercicios y consejos para hijos de 4 a 12 años
  </text>

  <!-- Dominio -->
  <text x="100" y="580" font-family="'Nunito','Trebuchet MS',sans-serif" font-size="24" font-weight="700" fill="#0F172A">
    minigolclub.com
  </text>
</svg>`;

const buffer = await sharp(Buffer.from(svg))
  .jpeg({ quality: 88, mozjpeg: true })
  .toBuffer();

writeFileSync(out, buffer);
console.log(`OG image generada: ${out} (${(buffer.length / 1024).toFixed(1)} KB)`);
