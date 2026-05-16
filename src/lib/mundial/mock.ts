import type { Match, Standing, Scorer } from './types';

/**
 * ⚠ DATOS MOCK — NO EXPONER EN PRODUCCIÓN HASTA QUE EMPIECE EL TORNEO.
 *
 * Este módulo solo se importa desde componentes que comprueban
 * `isMundialActive()` y/o desde tests/dev preview. Sirve para validar UI
 * de live/tablas/goleadores antes del 11 jun 2026.
 *
 * Cuando la API real esté lista (`src/lib/mundial/api.ts`, Fase 6):
 * - en dev → seguir usando este mock por defecto.
 * - en prod → fetch a football-data.org con cache, fallback al mock si falla.
 *
 * Los `kickoff` son relativos a `Date.now()` (no fechas duras) para que la
 * demo siempre tenga 2 partidos "en vivo" y 4 "próximos" al cargar.
 */

const inMin = (m: number) => new Date(Date.now() + m * 60_000).toISOString();

export const PARTIDOS_MOCK: ReadonlyArray<Match> = [
  { id: 'm1', fase: 'Grupos · J1', grupo: 'A', home: 'MEX', away: 'POL', homeScore: 2, awayScore: 1, status: 'finished', kickoff: inMin(-180), venue: 'Azteca, CDMX',         minute: 90 },
  { id: 'm2', fase: 'Grupos · J1', grupo: 'C', home: 'USA', away: 'NED', homeScore: 1, awayScore: 1, status: 'live',     kickoff: inMin(-65),  venue: 'MetLife, NJ',         minute: 67 },
  { id: 'm3', fase: 'Grupos · J1', grupo: 'F', home: 'ESP', away: 'GER', homeScore: 0, awayScore: 0, status: 'live',     kickoff: inMin(-12),  venue: 'SoFi, LA',            minute: 14 },
  { id: 'm4', fase: 'Grupos · J1', grupo: 'D', home: 'ARG', away: 'CRO', homeScore: null, awayScore: null, status: 'scheduled', kickoff: inMin(125),  venue: 'Estadio BBVA, MTY' },
  { id: 'm5', fase: 'Grupos · J1', grupo: 'E', home: 'BRA', away: 'ENG', homeScore: null, awayScore: null, status: 'scheduled', kickoff: inMin(280),  venue: 'AT&T, Dallas' },
  { id: 'm6', fase: 'Grupos · J1', grupo: 'G', home: 'FRA', away: 'ITA', homeScore: null, awayScore: null, status: 'scheduled', kickoff: inMin(425),  venue: 'Mercedes-Benz, ATL' },
  { id: 'm7', fase: 'Grupos · J1', grupo: 'B', home: 'CAN', away: 'BEL', homeScore: null, awayScore: null, status: 'scheduled', kickoff: inMin(1440), venue: 'BMO Field, Toronto' },
  { id: 'm8', fase: 'Grupos · J1', grupo: 'A', home: 'POR', away: 'NZL', homeScore: null, awayScore: null, status: 'scheduled', kickoff: inMin(1580), venue: "Levi's, SF" },
];

export const TABLAS_MOCK: Readonly<Record<string, ReadonlyArray<Standing>>> = {
  A: [
    { team: 'MEX', pj: 1, g: 1, e: 0, p: 0, gf: 2, gc: 1, pts: 3 },
    { team: 'POR', pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 },
    { team: 'POL', pj: 1, g: 0, e: 0, p: 1, gf: 1, gc: 2, pts: 0 },
    { team: 'NZL', pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 },
  ],
  C: [
    { team: 'USA', pj: 1, g: 0, e: 1, p: 0, gf: 1, gc: 1, pts: 1 },
    { team: 'NED', pj: 1, g: 0, e: 1, p: 0, gf: 1, gc: 1, pts: 1 },
    { team: 'AUS', pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 },
    { team: 'PAN', pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 },
  ],
  F: [
    { team: 'ESP', pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 },
    { team: 'GER', pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 },
    { team: 'IRN', pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 },
    { team: 'PAR', pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 },
  ],
};

export const GOLEADORES_MOCK: ReadonlyArray<Scorer> = [
  { player: 'Santi Giménez',     team: 'MEX', goles: 2, curiosidad: 'lleva el dorsal 9, como Hugo Sánchez' },
  { player: 'Robert Lewandowski', team: 'POL', goles: 1, curiosidad: 'tiene 37 años — el goleador más mayor del torneo' },
  { player: 'Christian Pulisic', team: 'USA', goles: 1, curiosidad: 'capitán de su selección con solo 27 años' },
  { player: 'Cody Gakpo',        team: 'NED', goles: 1, curiosidad: 'extremo izquierdo, marcó en el Mundial 2022' },
];
