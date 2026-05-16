import { useState } from 'preact/hooks';
import { memo } from 'preact/compat';
import type { Match } from '@/lib/mundial/types';
import { SELECCIONES } from '@/lib/mundial/selecciones';
import { fmtCountdown, fmtTime } from '@/lib/mundial/format';
import { Flag } from './FlagPreact';

/**
 * Ticker estilo "bolsa de valores" — barra superior negra con scroll horizontal
 * continuo (CSS animation 60s linear infinite). Reconocible para padres.
 *
 * Diseñado para ser puesto encima del Header global durante el torneo. NO se
 * mueve por JS (CSS animation es más eficiente y no compite con scroll del
 * usuario). Pausa cuando el usuario tiene `prefers-reduced-motion: reduce`.
 *
 * `memo` para que un cambio de `minute` en un partido individual no fuerce
 * re-render del DOM completo (el ticker dibuja 16 elementos × 2 duplicados).
 */

interface Props {
  partidos: ReadonlyArray<Match>;
  dismissable?: boolean;
}

function TickerBolsaImpl({ partidos, dismissable = true }: Props) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed || partidos.length === 0) return null;

  const items = [...partidos, ...partidos];
  const anyLive = partidos.some((p) => p.status === 'live');

  return (
    <div class="tickerb" aria-live={anyLive ? 'polite' : 'off'} aria-label="Marcador del Mundial en vivo">
      <div class="tickerb__inner">
        <div class="tickerb__pill" aria-hidden="true">
          <span class="tickerb__dot"></span>
          <span class="tickerb__pill-text">MUNDIAL 26 · EN VIVO</span>
        </div>

        <div class="tickerb__track">
          <div class="tickerb__scroller">
            {items.map((p, i) => {
              const home = SELECCIONES[p.home];
              const away = SELECCIONES[p.away];
              if (!home || !away) return null;
              const isLive = p.status === 'live';
              const isFinished = p.status === 'finished';
              return (
                <span class="tickerb__item" key={`${p.id}-${i}`}>
                  {isLive && <span class="tickerb__dot tickerb__dot--green" aria-hidden="true"></span>}
                  <Flag code={p.home} size={20} />
                  <span class="tickerb__code">{p.home}</span>
                  <span class={isLive ? 'tickerb__score tickerb__score--live' : 'tickerb__score'}>
                    {p.homeScore ?? '–'} : {p.awayScore ?? '–'}
                  </span>
                  <span class="tickerb__code">{p.away}</span>
                  <Flag code={p.away} size={20} />
                  {isLive && <span class="tickerb__minute">{p.minute}'</span>}
                  {isFinished && <span class="tickerb__fin">FIN</span>}
                  {p.status === 'scheduled' && (
                    <span class="tickerb__countdown">
                      {fmtCountdown(p.kickoff) ?? fmtTime(p.kickoff)}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>

        {dismissable && (
          <button
            type="button"
            class="tickerb__close"
            onClick={() => setDismissed(true)}
            aria-label="Cerrar barra del marcador"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export const TickerBolsa = memo(TickerBolsaImpl);
export default TickerBolsa;
