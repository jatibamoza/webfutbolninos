import type { Team } from './types';

/**
 * Mapa ISO 3166-1 alpha-3 → alpha-2 para flagcdn.com.
 * Caso especial: `gb-eng` (Inglaterra) — Escocia/Gales/Irlanda Norte tienen su propio
 * subdivision code en flagcdn.
 *
 * Cubre todas las selecciones con posibilidad real de clasificarse al Mundial 2026.
 * Si una selección no aparece, ampliar aquí — `<Flag>` ya cae a un chip con código si
 * el iso2 falta o el SVG falla en cargar.
 */
export const ISO3_TO_ISO2: Readonly<Record<string, string>> = {
  // Anfitriones
  USA: 'us', MEX: 'mx', CAN: 'ca',
  // UEFA
  ESP: 'es', FRA: 'fr', ENG: 'gb-eng', GER: 'de', ITA: 'it', NED: 'nl', POR: 'pt',
  BEL: 'be', CRO: 'hr', SUI: 'ch', DEN: 'dk', AUT: 'at', POL: 'pl', NOR: 'no',
  CZE: 'cz', TUR: 'tr', SWE: 'se', SRB: 'rs', UKR: 'ua', SCO: 'gb-sct', HUN: 'hu',
  WAL: 'gb-wls', SVK: 'sk',
  // CONMEBOL
  ARG: 'ar', BRA: 'br', URU: 'uy', COL: 'co', ECU: 'ec', PAR: 'py', VEN: 've', BOL: 'bo',
  // AFC
  JPN: 'jp', KOR: 'kr', IRN: 'ir', KSA: 'sa', AUS: 'au', QAT: 'qa', IRQ: 'iq',
  UAE: 'ae', UZB: 'uz', JOR: 'jo',
  // CAF
  MAR: 'ma', SEN: 'sn', EGY: 'eg', NGA: 'ng', ALG: 'dz', TUN: 'tn', CMR: 'cm',
  GHA: 'gh', CIV: 'ci', RSA: 'za', MLI: 'ml',
  // CONCACAF
  CRC: 'cr', PAN: 'pa', JAM: 'jm', HON: 'hn',
  // OFC
  NZL: 'nz',
};

/**
 * Catálogo de equipos. `color` se usa solo para el chip de fallback cuando
 * flagcdn.com no carga (red móvil flaky), nunca como decoración primaria —
 * la bandera es la identidad.
 *
 * Lista exhaustiva de todas las selecciones con metadata, NO lista de
 * clasificadas. El sorteo de 12 grupos × 4 vive en `grupos.ts`.
 */
export const SELECCIONES: Readonly<Record<string, Team>> = {
  // ─── Anfitriones ────────────────────────────────────────────
  USA: { code: 'USA', iso2: 'us', nombre: 'Estados Unidos', color: '#bf0a30', confederation: 'CONCACAF' },
  MEX: { code: 'MEX', iso2: 'mx', nombre: 'México',         color: '#006847', confederation: 'CONCACAF' },
  CAN: { code: 'CAN', iso2: 'ca', nombre: 'Canadá',         color: '#d52b1e', confederation: 'CONCACAF' },

  // ─── UEFA ───────────────────────────────────────────────────
  ESP: { code: 'ESP', iso2: 'es',     nombre: 'España',           color: '#c60b1e', confederation: 'UEFA' },
  FRA: { code: 'FRA', iso2: 'fr',     nombre: 'Francia',          color: '#0055a4', confederation: 'UEFA' },
  ENG: { code: 'ENG', iso2: 'gb-eng', nombre: 'Inglaterra',       color: '#cf102d', confederation: 'UEFA' },
  GER: { code: 'GER', iso2: 'de',     nombre: 'Alemania',         color: '#1a1a1a', confederation: 'UEFA' },
  ITA: { code: 'ITA', iso2: 'it',     nombre: 'Italia',           color: '#008c45', confederation: 'UEFA' },
  NED: { code: 'NED', iso2: 'nl',     nombre: 'Países Bajos',     color: '#ae1c28', confederation: 'UEFA' },
  POR: { code: 'POR', iso2: 'pt',     nombre: 'Portugal',         color: '#006633', confederation: 'UEFA' },
  BEL: { code: 'BEL', iso2: 'be',     nombre: 'Bélgica',          color: '#fdda24', confederation: 'UEFA' },
  CRO: { code: 'CRO', iso2: 'hr',     nombre: 'Croacia',          color: '#171796', confederation: 'UEFA' },
  SUI: { code: 'SUI', iso2: 'ch',     nombre: 'Suiza',            color: '#dc2626', confederation: 'UEFA' },
  DEN: { code: 'DEN', iso2: 'dk',     nombre: 'Dinamarca',        color: '#c8102e', confederation: 'UEFA' },
  AUT: { code: 'AUT', iso2: 'at',     nombre: 'Austria',          color: '#ed2939', confederation: 'UEFA' },
  POL: { code: 'POL', iso2: 'pl',     nombre: 'Polonia',          color: '#dc143c', confederation: 'UEFA' },
  NOR: { code: 'NOR', iso2: 'no',     nombre: 'Noruega',          color: '#ba0c2f', confederation: 'UEFA' },
  CZE: { code: 'CZE', iso2: 'cz',     nombre: 'Chequia',          color: '#11457e', confederation: 'UEFA' },
  TUR: { code: 'TUR', iso2: 'tr',     nombre: 'Turquía',          color: '#e30a17', confederation: 'UEFA' },
  SWE: { code: 'SWE', iso2: 'se',     nombre: 'Suecia',           color: '#006aa7', confederation: 'UEFA' },
  SRB: { code: 'SRB', iso2: 'rs',     nombre: 'Serbia',           color: '#c6363c', confederation: 'UEFA' },
  UKR: { code: 'UKR', iso2: 'ua',     nombre: 'Ucrania',          color: '#005bbb', confederation: 'UEFA' },
  SCO: { code: 'SCO', iso2: 'gb-sct', nombre: 'Escocia',          color: '#0065bd', confederation: 'UEFA' },
  HUN: { code: 'HUN', iso2: 'hu',     nombre: 'Hungría',          color: '#477050', confederation: 'UEFA' },
  WAL: { code: 'WAL', iso2: 'gb-wls', nombre: 'Gales',            color: '#d30731', confederation: 'UEFA' },
  SVK: { code: 'SVK', iso2: 'sk',     nombre: 'Eslovaquia',       color: '#0b4ea2', confederation: 'UEFA' },

  // ─── CONMEBOL ───────────────────────────────────────────────
  ARG: { code: 'ARG', iso2: 'ar', nombre: 'Argentina',  color: '#74acdf', confederation: 'CONMEBOL' },
  BRA: { code: 'BRA', iso2: 'br', nombre: 'Brasil',     color: '#fedf00', confederation: 'CONMEBOL' },
  URU: { code: 'URU', iso2: 'uy', nombre: 'Uruguay',    color: '#7b9eff', confederation: 'CONMEBOL' },
  COL: { code: 'COL', iso2: 'co', nombre: 'Colombia',   color: '#fcd116', confederation: 'CONMEBOL' },
  ECU: { code: 'ECU', iso2: 'ec', nombre: 'Ecuador',    color: '#ffd700', confederation: 'CONMEBOL' },
  PAR: { code: 'PAR', iso2: 'py', nombre: 'Paraguay',   color: '#d52b1e', confederation: 'CONMEBOL' },
  VEN: { code: 'VEN', iso2: 've', nombre: 'Venezuela',  color: '#7b1e3a', confederation: 'CONMEBOL' },
  BOL: { code: 'BOL', iso2: 'bo', nombre: 'Bolivia',    color: '#007934', confederation: 'CONMEBOL' },

  // ─── AFC ────────────────────────────────────────────────────
  JPN: { code: 'JPN', iso2: 'jp', nombre: 'Japón',           color: '#bc002d', confederation: 'AFC' },
  KOR: { code: 'KOR', iso2: 'kr', nombre: 'Corea del Sur',   color: '#0047a0', confederation: 'AFC' },
  IRN: { code: 'IRN', iso2: 'ir', nombre: 'Irán',            color: '#239f40', confederation: 'AFC' },
  KSA: { code: 'KSA', iso2: 'sa', nombre: 'Arabia Saudí',    color: '#006c35', confederation: 'AFC' },
  AUS: { code: 'AUS', iso2: 'au', nombre: 'Australia',       color: '#ffc72c', confederation: 'AFC' },
  QAT: { code: 'QAT', iso2: 'qa', nombre: 'Catar',           color: '#8a1538', confederation: 'AFC' },
  IRQ: { code: 'IRQ', iso2: 'iq', nombre: 'Irak',            color: '#cd1126', confederation: 'AFC' },
  UAE: { code: 'UAE', iso2: 'ae', nombre: 'Emiratos Árabes', color: '#00732f', confederation: 'AFC' },
  UZB: { code: 'UZB', iso2: 'uz', nombre: 'Uzbekistán',      color: '#0099b5', confederation: 'AFC' },
  JOR: { code: 'JOR', iso2: 'jo', nombre: 'Jordania',        color: '#007a3d', confederation: 'AFC' },

  // ─── CAF ────────────────────────────────────────────────────
  MAR: { code: 'MAR', iso2: 'ma', nombre: 'Marruecos',     color: '#c1272d', confederation: 'CAF' },
  SEN: { code: 'SEN', iso2: 'sn', nombre: 'Senegal',       color: '#00853f', confederation: 'CAF' },
  EGY: { code: 'EGY', iso2: 'eg', nombre: 'Egipto',        color: '#c8102e', confederation: 'CAF' },
  NGA: { code: 'NGA', iso2: 'ng', nombre: 'Nigeria',       color: '#008751', confederation: 'CAF' },
  ALG: { code: 'ALG', iso2: 'dz', nombre: 'Argelia',       color: '#006633', confederation: 'CAF' },
  TUN: { code: 'TUN', iso2: 'tn', nombre: 'Túnez',         color: '#e70013', confederation: 'CAF' },
  CMR: { code: 'CMR', iso2: 'cm', nombre: 'Camerún',       color: '#007a5e', confederation: 'CAF' },
  GHA: { code: 'GHA', iso2: 'gh', nombre: 'Ghana',         color: '#006b3f', confederation: 'CAF' },
  CIV: { code: 'CIV', iso2: 'ci', nombre: 'Costa de Marfil', color: '#ff8200', confederation: 'CAF' },
  RSA: { code: 'RSA', iso2: 'za', nombre: 'Sudáfrica',     color: '#007a4d', confederation: 'CAF' },
  MLI: { code: 'MLI', iso2: 'ml', nombre: 'Malí',          color: '#fcd116', confederation: 'CAF' },

  // ─── CONCACAF (no anfitriones) ──────────────────────────────
  CRC: { code: 'CRC', iso2: 'cr', nombre: 'Costa Rica',     color: '#002b7f', confederation: 'CONCACAF' },
  PAN: { code: 'PAN', iso2: 'pa', nombre: 'Panamá',         color: '#005aa7', confederation: 'CONCACAF' },
  JAM: { code: 'JAM', iso2: 'jm', nombre: 'Jamaica',        color: '#009b3a', confederation: 'CONCACAF' },
  HON: { code: 'HON', iso2: 'hn', nombre: 'Honduras',       color: '#0073cf', confederation: 'CONCACAF' },

  // ─── OFC ────────────────────────────────────────────────────
  NZL: { code: 'NZL', iso2: 'nz', nombre: 'Nueva Zelanda',  color: '#012169', confederation: 'OFC' },
};

/** Helper para obtener equipo o `null` si el código no existe. */
export function getTeam(code: string): Team | null {
  return SELECCIONES[code] ?? null;
}
