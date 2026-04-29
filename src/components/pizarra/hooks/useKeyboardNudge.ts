import { useEffect } from 'preact/hooks';
import type { SelectedItem } from '../core/types';

export type NudgeDirection = 'up' | 'down' | 'left' | 'right';

export interface NudgeOptions {
  // Movimiento normal en % del campo (default 1%).
  step?: number;
  // Movimiento con shift en % del campo (default 5%).
  bigStep?: number;
  // Solo se activa si el target del evento NO es input/textarea/select.
  // Permite escribir en NoteEditor sin que las flechas muevan jugadores.
  ignoreInForms?: boolean;
}

// Hook que escucha flechas de teclado y mueve el item seleccionado.
// El consumidor recibe (selected, direction, distance) y decide cómo aplicar
// el nudge a su estado. Esto mantiene el hook libre de acoplamiento al store.
export function useKeyboardNudge(
  selected: SelectedItem,
  onNudge: (selected: NonNullable<SelectedItem>, dx: number, dy: number) => void,
  { step = 1, bigStep = 5, ignoreInForms = true }: NudgeOptions = {},
) {
  useEffect(() => {
    if (!selected) return;

    const handler = (e: KeyboardEvent) => {
      if (ignoreInForms) {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
        if (target?.isContentEditable) return;
      }

      const distance = e.shiftKey ? bigStep : step;
      let dx = 0;
      let dy = 0;
      switch (e.key) {
        case 'ArrowUp':
          dy = -distance;
          break;
        case 'ArrowDown':
          dy = distance;
          break;
        case 'ArrowLeft':
          dx = -distance;
          break;
        case 'ArrowRight':
          dx = distance;
          break;
        default:
          return;
      }

      e.preventDefault();
      onNudge(selected, dx, dy);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selected, onNudge, step, bigStep, ignoreInForms]);
}
