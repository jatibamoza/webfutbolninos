/**
 * Tipos del dominio "Mundial" — diseñados para reutilizar en torneos futuros
 * (Mundial femenino 2027, Copa América, etc). El `tournament` viene de dates.ts
 * por separado para no acoplar los datos a un campeonato concreto.
 */

export type MatchStatus = 'scheduled' | 'live' | 'finished';

export type Confederation = 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'AFC' | 'CAF' | 'OFC';

export type Team = {
  /** ISO 3166-1 alpha-3 — `ESP`, `ARG`, `BRA`… (clave primaria) */
  code: string;
  /** ISO 3166-1 alpha-2 — para flagcdn.com. `gb-eng` para Inglaterra. */
  iso2: string;
  nombre: string;
  /** Color brand del equipo, hex sin `#`-tag tokens (se usa para fallback de bandera). */
  color: string;
  confederation: Confederation;
};

export type Grupo = {
  /** Letra del grupo: 'A', 'B', …, 'L'. 12 grupos en el formato de 48 selecciones. */
  letra: string;
  /** Códigos ISO3 de las 4 selecciones del grupo. */
  equipos: [string, string, string, string];
};

export type Match = {
  id: string;
  /** "Grupos · J1" | "Octavos" | "Cuartos" | "Semifinal" | "Final" */
  fase: string;
  /** Letra del grupo. Solo en fase de grupos. */
  grupo?: string;
  /** ISO3 */
  home: string;
  /** ISO3 */
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  /** ISO UTC */
  kickoff: string;
  venue?: string;
  /** Solo cuando `status === 'live'`. */
  minute?: number;
};

export type Standing = {
  /** ISO3 */
  team: string;
  pj: number;
  g: number;
  e: number;
  p: number;
  gf: number;
  gc: number;
  pts: number;
};

export type Scorer = {
  player: string;
  /** ISO3 */
  team: string;
  goles: number;
  /** Dato curioso manuscrito ("jugador #9", "extremo izq.", "capitán"). */
  curiosidad: string;
};

/** Voto de la encuesta "¿quién crees que ganará?" — se guarda en localStorage. */
export type Vote = {
  /** ISO3 elegido por el usuario. Solo se permite un voto por dispositivo. */
  team: string;
  /** Timestamp UTC para auditoría local. */
  at: string;
};
