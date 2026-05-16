/**
 * Fechas y banderas temporales del Mundial 2026. Centralizadas para que
 * cualquier componente / endpoint decida si renderizar la cara "previa"
 * (educativa) o la cara "live" (resultados) sin acoplarse a fechas duras.
 *
 * Si el día de mañana hay un Mundial femenino 2027, se duplica este
 * archivo a `dates-fem-2027.ts` y los componentes reciben el objeto
 * `Tournament` por prop. NO hay fechas hardcoded fuera de este módulo.
 */

export type Tournament = {
  slug: string;
  nombre: string;
  edicion: string;
  /** Inauguración (kickoff del primer partido) — ISO UTC. */
  inauguracion: Date;
  /** Final — ISO UTC. */
  final: Date;
  /** Cuándo enciende el "modo live" en la página (días antes de la inauguración). */
  previaDias: number;
  /** Cuándo apaga el "modo live" (días después de la final). */
  postFinalDias: number;
  /** Hitos editoriales del torneo, en orden cronológico. */
  hitos: ReadonlyArray<{
    fecha: Date;
    nombre: string;
    /** Microcopy manuscrito para niños. */
    descripcion: string;
  }>;
};

/**
 * Constantes del Mundial 2026 (Canadá · México · Estados Unidos).
 * Fuente: calendario oficial FIFA. Inauguración 11 jun, final 19 jul.
 */
export const MUNDIAL_2026: Tournament = {
  slug: 'mundial-2026',
  nombre: 'Mundial',
  edicion: '2026',
  inauguracion: new Date('2026-06-11T20:00:00Z'),
  final: new Date('2026-07-19T19:00:00Z'),
  previaDias: 7,
  postFinalDias: 2,
  hitos: [
    {
      fecha: new Date('2026-06-11T20:00:00Z'),
      nombre: 'Inauguración',
      descripcion: 'México juega el primer partido en el Estadio Azteca.',
    },
    {
      fecha: new Date('2026-06-27T20:00:00Z'),
      nombre: 'Fin de la fase de grupos',
      descripcion: 'Los 32 mejores siguen. Los demás se van a casa.',
    },
    {
      fecha: new Date('2026-06-29T20:00:00Z'),
      nombre: 'Dieciseisavos de final',
      descripcion: 'Por primera vez en la historia: 32 equipos en eliminatorias.',
    },
    {
      fecha: new Date('2026-07-04T20:00:00Z'),
      nombre: 'Octavos de final',
      descripcion: 'A partir de aquí, si pierdes te vas. Sin segundas oportunidades.',
    },
    {
      fecha: new Date('2026-07-09T20:00:00Z'),
      nombre: 'Cuartos de final',
      descripcion: 'Quedan los 8 mejores del mundo.',
    },
    {
      fecha: new Date('2026-07-14T20:00:00Z'),
      nombre: 'Semifinales',
      descripcion: 'Solo 4 selecciones siguen vivas.',
    },
    {
      fecha: new Date('2026-07-18T20:00:00Z'),
      nombre: 'Partido por el tercer puesto',
      descripcion: 'Los dos que perdieron en semifinales juegan por la medalla de bronce.',
    },
    {
      fecha: new Date('2026-07-19T19:00:00Z'),
      nombre: 'Final',
      descripcion: 'Estadio MetLife, Nueva Jersey. El partido más esperado del año.',
    },
  ],
};

const MS_DAY = 24 * 60 * 60 * 1000;

/**
 * `true` si la página debe mostrar la cara "live" (resultados/tablas/goleadores).
 * `false` si debe mostrar la cara "previa" (educativa).
 */
export function isMundialActive(now: Date = new Date(), t: Tournament = MUNDIAL_2026): boolean {
  const start = new Date(t.inauguracion.getTime() - t.previaDias * MS_DAY);
  const end = new Date(t.final.getTime() + t.postFinalDias * MS_DAY);
  return now >= start && now <= end;
}

/** Días enteros que faltan para la inauguración. `0` si ya empezó, negativo si ya terminó. */
export function daysToKickoff(now: Date = new Date(), t: Tournament = MUNDIAL_2026): number {
  return Math.ceil((t.inauguracion.getTime() - now.getTime()) / MS_DAY);
}

/** Días enteros que faltan para la final. */
export function daysToFinal(now: Date = new Date(), t: Tournament = MUNDIAL_2026): number {
  return Math.ceil((t.final.getTime() - now.getTime()) / MS_DAY);
}

/** Devuelve el próximo hito futuro o `null` si el torneo terminó. */
export function nextHito(now: Date = new Date(), t: Tournament = MUNDIAL_2026) {
  return t.hitos.find(h => h.fecha.getTime() > now.getTime()) ?? null;
}
