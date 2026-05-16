import { MUNDIAL_API_URL } from '@/consts';
import type { Match, Standing, Scorer } from './types';

/**
 * Cliente del Worker `workers/mundial-data` (resultados live del Mundial).
 *
 * Si `PUBLIC_MUNDIAL_API_URL` no está set o el Worker falla, las funciones
 * devuelven `null` y el componente de UI debe degradar gracefully (mostrar
 * "torneo no empezado" o skeleton).
 */

export interface MundialPayload {
  partidos: ReadonlyArray<Match>;
  tablas: Readonly<Record<string, ReadonlyArray<Standing>>>;
  goleadores: ReadonlyArray<Scorer>;
  lastUpdate: string;
  source: 'football-data' | 'mock';
}

/** GET completo. Devuelve null si la API no está configurada o falla. */
export async function fetchMundialPayload(signal?: AbortSignal): Promise<MundialPayload | null> {
  if (!MUNDIAL_API_URL) return null;
  try {
    const r = await fetch(MUNDIAL_API_URL, { signal });
    if (!r.ok) return null;
    return (await r.json()) as MundialPayload;
  } catch {
    return null;
  }
}

/**
 * `true` si hay al menos un partido en vivo en el payload. Útil para decidir
 * la cadencia de polling (30s con live, sin polling sin live).
 */
export function hasLiveMatches(payload: MundialPayload | null): boolean {
  return Boolean(payload?.partidos.some((p) => p.status === 'live'));
}
