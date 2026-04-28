import type { Skin } from '../core/types';

interface WatermarkProps {
  skin: Skin;
}

// Color elegido por legibilidad sin tapar elementos del campo
const FILL: Record<Skin, string> = {
  chalk: 'rgba(255,255,255,0.35)',
  paper: 'rgba(0,0,0,0.25)',
  grass: 'rgba(255,255,255,0.35)',
};

export function Watermark({ skin }: WatermarkProps) {
  return (
    <text
      x="98"
      y="98"
      text-anchor="end"
      dominant-baseline="auto"
      font-family="'Caveat Variable', Caveat, cursive"
      font-size="3"
      font-weight="600"
      fill={FILL[skin]}
      aria-hidden="true"
    >
      minigolclub.com
    </text>
  );
}
