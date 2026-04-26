// Genera /public/og-default.jpg (1200×630) con la marca MiniGol Club v2.
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
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FAF6E8"/>
      <stop offset="100%" stop-color="#F4EBC8"/>
    </linearGradient>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M32 0H0V32" fill="none" stroke="#E8DEC0" stroke-width="0.8"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)" opacity="0.6"/>

  <!-- Línea roja del cuaderno (margen) -->
  <line x1="200" y1="0" x2="200" y2="630" stroke="#DC3C3C" stroke-width="1.5" opacity="0.35"/>

  <!-- Escudo logo (240px) -->
  <g transform="translate(80, 200) scale(2.4)">
    <path d="M50 6 L88 16 L88 50 C88 74 72 88 50 94 C28 88 12 74 12 50 L12 16 Z" fill="#1A1F2C"/>
    <g stroke="#FFFCF1" stroke-width="1.2" fill="none" opacity="0.5">
      <rect x="22" y="20" width="56" height="48" rx="3"/>
      <line x1="50" y1="20" x2="50" y2="68"/>
      <circle cx="50" cy="44" r="9"/>
    </g>
    <text x="50" y="57" text-anchor="middle" font-family="'Fredoka',system-ui,sans-serif" font-weight="700" font-size="36" fill="#F59E0B">M</text>
    <text x="34" y="83.5" text-anchor="middle" font-size="6.5" fill="#F59E0B" opacity="0.9">★</text>
    <text x="51" y="82" text-anchor="middle" font-family="'JetBrains Mono',ui-monospace,monospace" font-weight="600" font-size="6" letter-spacing="2.5" fill="#FFFCF1" opacity="0.95">CLUB</text>
    <text x="66" y="83.5" text-anchor="middle" font-size="6.5" fill="#F59E0B" opacity="0.9">★</text>
    <text x="51" y="89" text-anchor="middle" font-family="'JetBrains Mono',ui-monospace,monospace" font-size="3.2" letter-spacing="1.2" fill="#FFFCF1" opacity="0.55">EST · 2026</text>
  </g>

  <!-- Marca wordmark -->
  <text x="370" y="280" font-family="'Fredoka',system-ui,sans-serif" font-size="96" font-weight="700" fill="#1A1F2C" letter-spacing="-0.025em">
    MiniGol <tspan fill="#F59E0B">Club</tspan>
  </text>

  <!-- Sub-tag mono mayúsculas -->
  <text x="370" y="325" font-family="'JetBrains Mono',ui-monospace,monospace" font-size="18" font-weight="500" fill="#4D5468" letter-spacing="0.25em">
    FÚTBOL · PARA · PADRES
  </text>

  <!-- Tagline -->
  <text x="370" y="410" font-family="'Nunito',system-ui,sans-serif" font-size="38" font-weight="700" fill="#1F3F8E">
    Fútbol para niños,
  </text>
  <text x="370" y="455" font-family="'Nunito',system-ui,sans-serif" font-size="38" font-weight="700" fill="#1F3F8E">
    explicado para padres
  </text>

  <!-- Marker amarillo bajo subtítulo -->
  <rect x="370" y="495" width="640" height="20" fill="#FFD45E" opacity="0.9"/>
  <text x="370" y="510" font-family="'Nunito',sans-serif" font-size="20" font-weight="700" fill="#1A1F2C">
    Ejercicios · juegos · equipamiento · 4–12 años
  </text>

  <!-- Dominio mono abajo -->
  <text x="80" y="580" font-family="'JetBrains Mono',ui-monospace,monospace" font-size="20" font-weight="500" fill="#1A1F2C" letter-spacing="0.15em">
    MINIGOLCLUB.COM
  </text>

  <!-- Sello rotado bottom-right -->
  <g transform="translate(1010, 540) rotate(-3)">
    <rect x="0" y="0" width="120" height="32" rx="4" fill="none" stroke="#C9BC91" stroke-width="1.5"/>
    <text x="60" y="20" text-anchor="middle" font-family="'JetBrains Mono',ui-monospace,monospace" font-size="11" letter-spacing="0.18em" fill="#4D5468">EST · 2026</text>
  </g>
</svg>`;

const buffer = await sharp(Buffer.from(svg))
  .jpeg({ quality: 88, mozjpeg: true })
  .toBuffer();

writeFileSync(out, buffer);
console.log(`OG image generada: ${out} (${(buffer.length / 1024).toFixed(1)} KB)`);
