import type { FieldType, Skin } from '../core/types';

interface FieldLinesProps {
  type: FieldType;
  skin: Skin;
}

const STROKE_BY_SKIN: Record<Skin, string> = {
  chalk: '#FFFCF1',
  paper: '#1e293b',
  grass: '#FFFCF1',
};

const OPACITY_BY_SKIN: Record<Skin, number> = {
  chalk: 0.85,
  paper: 0.90,
  grass: 0.85,
};

export function FieldLines({ type, skin }: FieldLinesProps) {
  const stroke = STROKE_BY_SKIN[skin];
  const strokeWidth = 0.4;
  const fill = 'none';
  const opacity = OPACITY_BY_SKIN[skin];

  const paperGrid = skin === 'paper' ? (
    <>
      <defs>
        <pattern id="pz-paper-grid" width="5" height="5" patternUnits="userSpaceOnUse">
          <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(0,100,200,0.13)" stroke-width="0.25" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#pz-paper-grid)" />
    </>
  ) : null;

  if (type === 'full') {
    return (
      <>
        {paperGrid}
        <g stroke={stroke} stroke-width={strokeWidth} fill={fill} opacity={opacity}>
          {/* Borde y línea de medio campo */}
          <rect x="2" y="2" width="96" height="96" />
          <line x1="50" y1="2" x2="50" y2="98" />
          <circle cx="50" cy="50" r="11" />
          <circle cx="50" cy="50" r="0.6" fill={stroke} stroke-width="0" />
          {/* Áreas grandes */}
          <rect x="2" y="28" width="14" height="44" />
          <rect x="84" y="28" width="14" height="44" />
          {/* Áreas pequeñas */}
          <rect x="2" y="40" width="6" height="20" />
          <rect x="92" y="40" width="6" height="20" />
          {/* Puntos de penalti */}
          <circle cx="11" cy="50" r="0.5" fill={stroke} stroke-width="0" />
          <circle cx="89" cy="50" r="0.5" fill={stroke} stroke-width="0" />
        </g>
      </>
    );
  }

  if (type === 'half') {
    return (
      <>
        {paperGrid}
        <g stroke={stroke} stroke-width={strokeWidth} fill={fill} opacity={opacity}>
          <rect x="2" y="2" width="96" height="96" />
          {/* Línea de medio campo abajo (por convención: portería arriba) */}
          <line x1="2" y1="98" x2="98" y2="98" stroke-dasharray="2 2" />
          <circle cx="50" cy="98" r="11" />
          <rect x="22" y="2" width="56" height="20" />
          <rect x="38" y="2" width="24" height="8" />
          <circle cx="50" cy="14" r="0.6" fill={stroke} stroke-width="0" />
        </g>
      </>
    );
  }

  // mini
  return (
    <>
      {paperGrid}
      <g stroke={stroke} stroke-width={strokeWidth} fill={fill} opacity={opacity}>
        <rect x="2" y="2" width="96" height="96" />
        <circle cx="50" cy="50" r="9" />
        <line x1="50" y1="2" x2="50" y2="98" stroke-dasharray="2 2" />
      </g>
    </>
  );
}
