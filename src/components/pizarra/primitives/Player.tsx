import type { JSX } from 'preact';
import type { Player as PlayerModel } from '../core/types';

interface PlayerProps {
  player: PlayerModel;
  selected: boolean;
  onPointerDown: (e: JSX.TargetedPointerEvent<SVGGElement>) => void;
}

const FILL_BY_KIND = {
  player_blue: '#3b82f6',
  player_red: '#ef4444',
  gk: '#fbbf24',
} as const;

export function Player({ player, selected, onPointerDown }: PlayerProps) {
  const fill = FILL_BY_KIND[player.kind];
  const ariaLabel = `Jugador ${
    player.kind === 'gk' ? 'portero' : player.kind === 'player_blue' ? 'azul' : 'rojo'
  } ${player.num}, posición ${Math.round(player.x)} % ${Math.round(player.y)} %${
    selected ? ', seleccionado' : ''
  }`;

  return (
    <g
      transform={`translate(${player.x} ${player.y})`}
      onPointerDown={onPointerDown}
      style={{ cursor: 'grab', touchAction: 'none' }}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-pressed={selected}
    >
      {selected && (
        <circle
          r="3.6"
          fill="none"
          stroke="#fbbf24"
          stroke-width="0.4"
          stroke-dasharray="0.8 0.8"
        />
      )}
      <circle r="2.6" fill={fill} stroke="#FFFCF1" stroke-width="0.4" />
      <text
        text-anchor="middle"
        y="0.9"
        font-family="Fredoka Variable, Fredoka, sans-serif"
        font-size="2.6"
        font-weight="700"
        fill="#FFFCF1"
        pointer-events="none"
      >
        {player.num}
      </text>
    </g>
  );
}
