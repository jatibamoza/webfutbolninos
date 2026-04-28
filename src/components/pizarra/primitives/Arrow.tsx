import type { JSX } from 'preact';
import type { Arrow as ArrowModel, ArrowKind } from '../core/types';

interface ArrowProps {
  arrow: ArrowModel;
  selected: boolean;
  onPointerDown: (e: JSX.TargetedPointerEvent<SVGPathElement>) => void;
  onPointerDownEndpoint?: (
    e: JSX.TargetedPointerEvent<SVGCircleElement>,
    which: 1 | 2,
  ) => void;
  onPointerDownControl?: (e: JSX.TargetedPointerEvent<SVGCircleElement>) => void;
}

const STROKE_BY_KIND: Record<ArrowKind, string> = {
  pass: '#fbbf24',
  filtro: '#fbbf24',
  move: '#ef4444',
};

const DASH_BY_KIND: Record<ArrowKind, string | undefined> = {
  pass: undefined,
  filtro: '1.6 1.2',
  move: '1.2 1.2',
};

const LABEL_BY_KIND: Record<ArrowKind, string> = {
  pass: 'Pase',
  filtro: 'Pase filtrado',
  move: 'Movimiento',
};

export function Arrow({
  arrow,
  selected,
  onPointerDown,
  onPointerDownEndpoint,
  onPointerDownControl,
}: ArrowProps) {
  const stroke = STROKE_BY_KIND[arrow.kind];
  const dash = DASH_BY_KIND[arrow.kind];
  const d = `M ${arrow.x1} ${arrow.y1} Q ${arrow.cx} ${arrow.cy}, ${arrow.x2} ${arrow.y2}`;
  const markerId = `pizarra-arrowhead-${arrow.kind}`;
  const ariaLabel = `${LABEL_BY_KIND[arrow.kind]} de ${Math.round(arrow.x1)} ${Math.round(
    arrow.y1,
  )} a ${Math.round(arrow.x2)} ${Math.round(arrow.y2)}${selected ? ', seleccionada' : ''}`;

  return (
    <g role="img" aria-label={ariaLabel}>
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="3"
          markerHeight="3"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={stroke} />
        </marker>
      </defs>

      {/* Hit area gruesa transparente para captar pointerdown sin recortar el trazo visible. */}
      <path
        d={d}
        stroke="transparent"
        stroke-width="3"
        fill="none"
        onPointerDown={onPointerDown}
        style={{ cursor: 'pointer' }}
      />
      <path
        d={d}
        stroke={stroke}
        stroke-width="0.6"
        stroke-dasharray={dash}
        fill="none"
        marker-end={`url(#${markerId})`}
        pointer-events="none"
      />

      {selected && (
        <g>
          <circle
            cx={arrow.x1}
            cy={arrow.y1}
            r="1.4"
            fill="#0a0d14"
            stroke="#fbbf24"
            stroke-width="0.4"
            style={{ cursor: 'grab', touchAction: 'none' }}
            onPointerDown={(e) => onPointerDownEndpoint?.(e, 1)}
          />
          <circle
            cx={arrow.x2}
            cy={arrow.y2}
            r="1.4"
            fill="#0a0d14"
            stroke="#fbbf24"
            stroke-width="0.4"
            style={{ cursor: 'grab', touchAction: 'none' }}
            onPointerDown={(e) => onPointerDownEndpoint?.(e, 2)}
          />
          <circle
            cx={arrow.cx}
            cy={arrow.cy}
            r="1.2"
            fill="#fbbf24"
            stroke="#0a0d14"
            stroke-width="0.3"
            style={{ cursor: 'grab', touchAction: 'none' }}
            onPointerDown={onPointerDownControl}
          />
          <line
            x1={arrow.x1}
            y1={arrow.y1}
            x2={arrow.cx}
            y2={arrow.cy}
            stroke="#fbbf24"
            stroke-width="0.2"
            stroke-dasharray="0.6 0.6"
          />
          <line
            x1={arrow.x2}
            y1={arrow.y2}
            x2={arrow.cx}
            y2={arrow.cy}
            stroke="#fbbf24"
            stroke-width="0.2"
            stroke-dasharray="0.6 0.6"
          />
        </g>
      )}
    </g>
  );
}
