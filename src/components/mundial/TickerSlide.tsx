import { useEffect, useState } from 'preact/hooks';
import type { Match } from '@/lib/mundial/types';
import { SELECCIONES } from '@/lib/mundial/selecciones';
import { fmtCountdown, fmtTime } from '@/lib/mundial/format';
import { Flag } from './FlagPreact';

/**
 * Card autoplay con dots (4.5s entre slides) para destacar 1 o más partidos
 * "en vivo" en la home/sidebar. Banderas grandes (68px) + marcador display 38px.
 *
 * Si `prefers-reduced-motion: reduce`, no autoplay — el usuario navega con dots.
 * Si solo hay 1 partido, no aparecen dots.
 */

interface Props {
  partidos: ReadonlyArray<Match>;
  intervalMs?: number;
}

export function TickerSlide({ partidos, intervalMs = 4500 }: Props) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (partidos.length < 2) return;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const t = setInterval(() => setIdx((i) => (i + 1) % partidos.length), intervalMs);
    return () => clearInterval(t);
  }, [partidos.length, intervalMs]);

  if (partidos.length === 0) return null;
  const p = partidos[Math.min(idx, partidos.length - 1)];
  if (!p) return null;
  const home = SELECCIONES[p.home];
  const away = SELECCIONES[p.away];
  if (!home || !away) return null;
  const isLive = p.status === 'live';
  const isFin = p.status === 'finished';

  return (
    <article class="tickers card-paper" aria-live={isLive ? 'polite' : 'off'}>
      <header class="tickers__header">
        {isLive ? (
          <span class="tickers__live mono">
            <span class="tickers__live-dot" aria-hidden="true"></span>
            EN VIVO
          </span>
        ) : (
          <span class="tickers__fase mono">{p.fase.toUpperCase()}</span>
        )}
        {p.grupo && <span class="tickers__grupo mono">GRUPO {p.grupo}</span>}
      </header>

      <div class="tickers__partido">
        <div class="tickers__lado">
          <Flag code={p.home} size={68} rounded={true} style={{ borderRadius: '8px' }} />
          <div class="tickers__nombre display">{home.nombre}</div>
        </div>
        <div class="tickers__centro">
          {p.homeScore !== null && p.awayScore !== null ? (
            <div class={isLive ? 'tickers__score tickers__score--live display' : 'tickers__score display'}>
              {p.homeScore}<span class="tickers__sep">:</span>{p.awayScore}
            </div>
          ) : (
            <div class="tickers__vs display">vs</div>
          )}
          <div class="tickers__estado mono">
            {isLive ? `${p.minute}'` : isFin ? 'FINAL' : (fmtCountdown(p.kickoff) ?? fmtTime(p.kickoff))}
          </div>
        </div>
        <div class="tickers__lado">
          <Flag code={p.away} size={68} rounded={true} style={{ borderRadius: '8px' }} />
          <div class="tickers__nombre display">{away.nombre}</div>
        </div>
      </div>

      {partidos.length > 1 && (
        <nav class="tickers__dots" aria-label="Cambiar partido">
          {partidos.map((mp, i) => (
            <button
              type="button"
              key={mp.id}
              class={i === idx ? 'tickers__dot tickers__dot--active' : 'tickers__dot'}
              onClick={() => setIdx(i)}
              aria-label={`Ir al partido ${i + 1} de ${partidos.length}`}
              aria-current={i === idx ? 'true' : 'false'}
            />
          ))}
        </nav>
      )}
    </article>
  );
}

export default TickerSlide;
