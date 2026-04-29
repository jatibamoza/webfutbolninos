import { useEffect, useState } from 'preact/hooks';

// Suscripción reactiva a `prefers-reduced-motion: reduce`. Si el sistema
// (o el toggle del SO) lo cambia en caliente, el componente se rerendea.
// SSR-safe: en server devuelve false, no rompe el render inicial.
export function usePrefersReducedMotion(): boolean {
  // Sync read on first render — safe because all callers use client:only (no SSR).
  // Eliminates a false→true re-render on the first effect tick.
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

// Detección de pointer "coarse" para alternar UX mobile (drag clásico vs
// nudge pad con flechas). Usa la misma técnica de matchMedia.
export function useCoarsePointer(): boolean {
  // Sync read on first render — eliminates the false→true flip that caused CLS
  // when Lighthouse runs in mobile emulation (pointer: coarse).
  const [coarse, setCoarse] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(pointer: coarse)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(pointer: coarse)');
    const onChange = (e: MediaQueryListEvent) => setCoarse(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return coarse;
}
