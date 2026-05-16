import { useState } from 'preact/hooks';
import { SELECCIONES } from '@/lib/mundial/selecciones';

/**
 * Versión Preact de <Flag/> para usar dentro de islas client-side.
 * Mantiene el mismo contrato: img + fallback a chip de color si falla.
 *
 * El componente Astro de banderas (`Flag.astro`) no se puede importar dentro
 * de archivos .tsx (Astro no expone los .astro como módulos JS al cliente).
 * Por eso vive este gemelo en TSX. Mantener los dos en sync visualmente.
 */

interface Props {
  code: string;
  size?: number;
  rounded?: boolean;
  style?: Record<string, string | number>;
}

export function Flag({ code, size = 24, rounded = true, style }: Props) {
  const team = SELECCIONES[code];
  const [errored, setErrored] = useState(false);
  if (!team) return null;

  const w = size;
  const h = Math.round(size * 0.72);
  const radius = rounded ? Math.max(2, Math.round(size * 0.1)) : 0;

  const common: Record<string, string | number> = {
    display: 'inline-block',
    verticalAlign: 'middle',
    width: w,
    height: h,
    flexShrink: 0,
    borderRadius: radius,
    boxShadow: '0 0 0 1px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.15)',
    ...(style ?? {}),
  };

  if (errored) {
    return (
      <span
        style={{
          ...common,
          background: team.color,
          color: '#fff',
          fontFamily: 'var(--font-mono)',
          fontSize: Math.max(8, Math.round(w * 0.32)),
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label={team.nombre}
      >
        {code}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/${team.iso2}.svg`}
      width={w}
      height={h}
      alt={team.nombre}
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
      style={{ ...common, objectFit: 'cover' }}
    />
  );
}
