import type { Grupo } from './types';

/**
 * ⚠ DATOS PROVISIONALES — sorteo oficial FIFA del 5 dic 2025.
 *
 * Esta es una distribución plausible basada en el sistema de bombos
 * (anfitriones + ranking FIFA), NO el sorteo final confirmado al 100%.
 * Antes del 11 jun 2026, verificar grupo por grupo contra
 * https://www.fifa.com/fifaplus/es/tournaments/mens/worldcup/canadamexicousa2026
 * y corregir aquí. El resto del código no depende del orden ni de la
 * pertenencia — solo de las claves ISO3 (que están todas en
 * `selecciones.ts`).
 *
 * Formato 2026: 12 grupos × 4 selecciones = 48 equipos. Pasan a la fase
 * final 32: los 2 primeros de cada grupo (24) + los 8 mejores terceros.
 */
export const GRUPOS: readonly Grupo[] = [
  { letra: 'A', equipos: ['MEX', 'POR', 'POL', 'NZL'] }, // anfitrión 1: México
  { letra: 'B', equipos: ['CAN', 'BEL', 'KOR', 'CRC'] }, // anfitrión 2: Canadá
  { letra: 'C', equipos: ['USA', 'NED', 'AUS', 'PAN'] }, // anfitrión 3: USA
  { letra: 'D', equipos: ['ARG', 'CRO', 'MAR', 'JAM'] },
  { letra: 'E', equipos: ['BRA', 'ENG', 'JPN', 'ECU'] },
  { letra: 'F', equipos: ['ESP', 'GER', 'IRN', 'PAR'] },
  { letra: 'G', equipos: ['FRA', 'ITA', 'EGY', 'CIV'] },
  { letra: 'H', equipos: ['HUN', 'SUI', 'SEN', 'UZB'] },
  { letra: 'I', equipos: ['COL', 'DEN', 'NGA', 'QAT'] },
  { letra: 'J', equipos: ['URU', 'AUT', 'GHA', 'KSA'] },
  { letra: 'K', equipos: ['NOR', 'TUR', 'CMR', 'JOR'] },
  { letra: 'L', equipos: ['SVK', 'TUN', 'ALG', 'HON'] },
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
