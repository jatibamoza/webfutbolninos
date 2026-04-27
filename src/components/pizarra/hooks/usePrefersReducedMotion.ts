import { useEffect, useState } from 'preact/hooks';

// Suscripción reactiva a `prefers-reduced-motion: reduce`. Si el sistema
// (o el toggle del SO) lo cambia en caliente, el componente se rerendea.
// SSR-safe: en server devuelve false, no rompe el render inicial.
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

// Detección de pointer "coarse" para alternar UX mobile (drag clásico vs
// nudge pad con flechas). Usa la misma técnica de matchMedia.
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(pointer: coarse)');
    setCoarse(query.matches);

    const onChange = (e: MediaQueryListEvent) => setCoarse(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return coarse;
}
