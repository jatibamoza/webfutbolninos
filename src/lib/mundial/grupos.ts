import type { Grupo } from './types';

/**
 * Grupos OFICIALES del Mundial 2026 — sorteo FIFA del 5 dic 2025 en
 * Washington D.C., con los repechajes de UEFA e Intercontinental ya resueltos
 * (marzo 2026). Verificado contra dos fuentes independientes
 * (mundial-2026.com.mx y alairelibre.cl) el 16 may 2026.
 *
 * Formato 2026: 12 grupos × 4 selecciones = 48 equipos. Avanzan a la fase
 * final 32: los 2 primeros de cada grupo (24) + los 8 mejores terceros.
 */
export const GRUPOS: readonly Grupo[] = [
  { letra: 'A', equipos: ['MEX', 'RSA', 'KOR', 'CZE'] }, // anfitrión 1: México
  { letra: 'B', equipos: ['CAN', 'BIH', 'SUI', 'QAT'] }, // anfitrión 2: Canadá
  { letra: 'C', equipos: ['BRA', 'MAR', 'SCO', 'HAI'] },
  { letra: 'D', equipos: ['USA', 'PAR', 'AUS', 'TUR'] }, // anfitrión 3: EE.UU.
  { letra: 'E', equipos: ['GER', 'CUW', 'CIV', 'ECU'] },
  { letra: 'F', equipos: ['NED', 'JPN', 'SWE', 'TUN'] },
  { letra: 'G', equipos: ['BEL', 'EGY', 'IRN', 'NZL'] },
  { letra: 'H', equipos: ['ESP', 'CPV', 'KSA', 'URU'] },
  { letra: 'I', equipos: ['FRA', 'SEN', 'IRQ', 'NOR'] },
  { letra: 'J', equipos: ['ARG', 'ALG', 'AUT', 'JOR'] },
  { letra: 'K', equipos: ['POR', 'COD', 'UZB', 'COL'] },
  { letra: 'L', equipos: ['ENG', 'CRO', 'GHA', 'PAN'] },
] as const;

/** Lookup por letra. */
export function getGrupo(letra: string): Grupo | null {
  return GRUPOS.find(g => g.letra === letra) ?? null;
}

/** Devuelve la letra del grupo en el que está un equipo, o `null`. */
export function grupoDeEquipo(code: string): string | null {
  return GRUPOS.find(g => g.equipos.includes(code))?.letra ?? null;
}

/** Las 48 selecciones del torneo en un array plano (para listados, encuestas, etc). */
export const SELECCIONES_DEL_TORNEO: readonly string[] = GRUPOS.flatMap(g => g.equipos);
