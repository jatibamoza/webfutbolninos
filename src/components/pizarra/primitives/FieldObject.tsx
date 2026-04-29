import type { JSX } from 'preact';
import type { FieldObject as FieldObjectModel } from '../core/types';

interface FieldObjectProps {
  object: FieldObjectModel;
  selected: boolean;
  onPointerDown: (e: JSX.TargetedPointerEvent<SVGGElement>) => void;
}

const LABEL_BY_KIND = {
  ball: 'Balón',
  cone: 'Cono',
  goal: 'Portería',
} as const;

export function FieldObject({ object, selected, onPointerDown }: FieldObjectProps) {
  const ariaLabel = `${LABEL_BY_KIND[object.kind]} en ${Math.round(object.x)} % ${Math.round(
    object.y,
  )} %${selected ? ', seleccionado' : ''}`;

  return (
    <g
      transform={`translate(${object.x} ${object.y})`}
      onPointerDown={onPointerDown}
      style={{ cursor: 'grab', touchAction: 'none' }}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-pressed={selected}
    >
      {selected && (
        <circle
          r="2.4"
          fill="none"
          stroke="#fbbf24"
          stroke-width="0.4"
          stroke-dasharray="0.8 0.8"
        />
      )}

      {object.kind === 'ball' && (
        <>
          <circle r="1.4" fill="#FFFCF1" stroke="#0a0d14" stroke-width="0.3" />
          <path
            d="M 0 -1.2 L 0.9 -0.5 L 0.5 0.7 L -0.5 0.7 L -0.9 -0.5 Z"
            fill="#0a0d14"
            pointer-events="none"
          />
        </>
      )}

      {object.kind === 'cone' && (
        <>
          <path
            d="M -1.4 1.2 L 1.4 1.2 L 0.5 -1.6 L -0.5 -1.6 Z"
            fill="#f59e0b"
            stroke="#0a0d14"
            stroke-width="0.3"
          />
          <line x1="-1" y1="0.2" x2="1" y2="0.2" stroke="#FFFCF1" stroke-width="0.3" />
        </>
      )}

      {object.kind === 'goal' && (
        <>
          <rect
            x="-4.5"
            y="-1.6"
            width="9"
            height="3.2"
            fill="rgba(255,252,241,0.06)"
            stroke="#FFFCF1"
            stroke-width="0.5"
          />
          <line x1="-4.5" y1="-1.6" x2="-4.5" y2="1.6" stroke="#FFFCF1" stroke-width="0.6" />
          <line x1="4.5" y1="-1.6" x2="4.5" y2="1.6" stroke="#FFFCF1" stroke-width="0.6" />
        </>
      )}
    </g>
  );
}
