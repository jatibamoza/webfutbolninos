import { useCallback } from 'preact/hooks';
import type { RefObject } from 'preact';
import type { JSX } from 'preact';
import { clamp } from '../core/geometry';

export interface DragPoint {
  x: number;
  y: number;
}

type DragMoveHandler = (point: DragPoint) => void;
type DragEndHandler = () => void;

export type StartDrag = (
  event: JSX.TargetedPointerEvent<SVGElement>,
  onMove: DragMoveHandler,
  onEnd?: DragEndHandler,
) => void;

// Hook que convierte coordenadas de pointermove globales a coordenadas
// internas del SVG (viewBox 0–100). Devuelve una función `startDrag` que se
// invoca desde el `onPointerDown` del item arrastrable.
//
// Defensas contra bugs conocidos del mockup:
// - getScreenCTM() puede ser null si el SVG está en display:none o aún no
//   se montó: se aborta sin lanzar.
// - Las coordenadas se clampan a [0,100] aquí, no en cada mutador.
// - Los listeners se registran en `window` para no perder el drag si el
//   pointer sale del SVG.
export function useSvgDrag(svgRef: RefObject<SVGSVGElement | null>): StartDrag {
  return useCallback<StartDrag>(
    (event, onMove, onEnd) => {
      event.preventDefault();
      event.stopPropagation();

      const svg = svgRef.current;
      if (!svg) return;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const inverseCtm = ctm.inverse();
      const point = svg.createSVGPoint();

      const toLocal = (clientX: number, clientY: number): DragPoint => {
        point.x = clientX;
        point.y = clientY;
        const local = point.matrixTransform(inverseCtm);
        return { x: clamp(local.x), y: clamp(local.y) };
      };

      const handleMove = (ev: PointerEvent) => {
        onMove(toLocal(ev.clientX, ev.clientY));
      };
      const handleUp = () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
        window.removeEventListener('pointercancel', handleUp);
        onEnd?.();
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
      window.addEventListener('pointercancel', handleUp);
    },
    [svgRef],
  );
}
