import { useEffect, useRef } from 'preact/hooks';
import type { Board } from '../core/types';
import { buildHashForBoard, readBoardFromHash } from '../core/serialize';

interface UseUrlHashOptions {
  // Debounce en ms para no saturar history.replaceState mientras se arrastra.
  debounceMs?: number;
}

// Hook que mantiene el `location.hash` sincronizado con el board actual.
// El primer render NO escribe (solo lee), así no pisamos hashes entrantes
// del usuario antes de que el componente padre tenga oportunidad de
// hidratar desde la URL.
export function useUrlHash(
  board: Board,
  enabled: boolean,
  { debounceMs = 350 }: UseUrlHashOptions = {},
) {
  const firstRunRef = useRef(true);

  useEffect(() => {
    if (!enabled) return;
    if (firstRunRef.current) {
      firstRunRef.current = false;
      return;
    }

    const timer = window.setTimeout(() => {
      const hash = buildHashForBoard(board);
      // Mantenemos pathname y query, sólo actualizamos hash.
      const url = `${window.location.pathname}${window.location.search}${hash}`;
      window.history.replaceState(null, '', url);
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [board, enabled, debounceMs]);
}

// Helper imperativo (no hook) para leer una sola vez al montar el componente.
// Lo separamos para que la lógica del Board pueda decidir si la pizarra
// arranca de un preset o de un hash compartido.
export function readInitialBoardFromHash(): Board | null {
  if (typeof window === 'undefined') return null;
  return readBoardFromHash(window.location.hash);
}
