import { useEffect, useRef, useState } from 'preact/hooks';
import { isMundialActive, daysToKickoff, MUNDIAL_2026 } from '@/lib/mundial/dates';
import { SELECCIONES } from '@/lib/mundial/selecciones';
import { fmtCountdown, fmtTime, fmtDateTime } from '@/lib/mundial/format';
import { fetchMundialPayload, hasLiveMatches, type MundialPayload } from '@/lib/mundial/api';
import type { Match, Standing, Scorer } from '@/lib/mundial/types';
import { Flag } from './FlagPreact';
import TickerSlide from './TickerSlide';

/**
 * Cara "live" del Mundial — se monta siempre, pero decide qué mostrar según
 * la fecha actual:
 *
 *  - **Antes de la previa (>7 días al kickoff)**: nada (la página queda 100%
 *    educativa, esta sección es invisible).
 *  - **Previa (7 días antes → kickoff)**: panel de countdown "el Mundial
 *    empieza en X días" + datos de los primeros partidos si están disponibles.
 *  - **Torneo activo**: pestañas con Live · Próximos · Tablas · Goleadores.
 *    Polling cada 30s mientras haya partidos `status: live`.
 *  - **Post-final + 2 días**: panel "el Mundial ha terminado" con campeón.
 *
 * Decisión: el gate `isMundialActive()` se evalúa **client-side** en cada
 * mount. Esto evita tener que re-deployar el sitio el 4-jun. La página
 * estática se sirve siempre igual; el island enciende/apaga la sección.
 *
 * Fallback: si `MUNDIAL_API_URL` no está set o el Worker falla, no se
 * renderiza nada (la sección queda invisible para no enseñar mock en prod).
 */

const POLL_LIVE_MS = 30_000;        // refresh cada 30s con partidos en vivo
const POLL_BETWEEN_MS = 5 * 60_000; // 5min entre jornadas (mata polling agresivo)

type Tab = 'partidos' | 'tablas' | 'goleadores';

export function ResultadosLive() {
  const [now] = useState(() => new Date());
  const [payload, setPayload] = useState<MundialPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  const torneoActivo = isMundialActive(now);
  const dias = daysToKickoff(now);
  const enPrevia = !torneoActivo && dias > 0 && dias <= MUNDIAL_2026.previaDias;

  // Fetch inicial + polling adaptativo. Solo si vamos a renderizar algo del
  // backend — durante la previa o el torneo. Antes de la previa no hace falta.
  useEffect(() => {
    if (!torneoActivo && !enPrevia) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function refresh() {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      const fresh = await fetchMundialPayload(ac.signal);
      if (cancelled) return;
      setPayload(fresh);
      setLoading(false);
    }

    void refresh();
    const intervalMs = hasLiveMatches(payload) ? POLL_LIVE_MS : POLL_BETWEEN_MS;
    const id = setInterval(refresh, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
      abortRef.current?.abort();
    };
    // Re-arma el interval cuando cambia hasLiveMatches → ajusta cadencia.
  }, [torneoActivo, enPrevia, payload && hasLiveMatches(payload)]);

  // Antes de la previa: no renderizar nada. La página se mantiene como
  // estaba (Hero + secciones educativas) sin un hueco visual vacío.
  if (!torneoActivo && !enPrevia) return null;

  if (loading) {
    return (
      <section class="rlive rlive--loading" aria-busy="true">
        <div class="rlive__skeleton" />
      </section>
    );
  }

  // En previa, si todavía no hay datos del backend, mostramos solo countdown.
  if (enPrevia && !payload) {
    return <PreviaPanel diasRestantes={dias} />;
  }

  if (!payload) {
    // Torneo activo pero el Worker no responde — degradar a "no disponible".
    return (
      <section class="rlive rlive--offline" aria-label="Resultados del Mundial no disponibles">
        <p class="hand rlive__offline-text">
          No podemos cargar los resultados ahora mismo. Vuelve en un rato.
        </p>
      </section>
    );
  }

  return <ResultadosFull payload={payload} enPrevia={enPrevia} diasRestantes={dias} />;
}

// ─── Subcomponentes ────────────────────────────────────────────────────────

function PreviaPanel({ diasRestantes }: { diasRestantes: number }) {
  return (
    <section class="rlive rlive--previa" aria-labelledby="rlive-previa-titulo">
      <span class="mono rlive__eyebrow">EN VIVO · PREVIA</span>
      <h2 id="rlive-previa-titulo" class="display rlive__titulo">
        El Mundial empieza en <span class="rlive__dias">{diasRestantes}</span>{' '}
        {diasRestantes === 1 ? 'día' : 'días'}
      </h2>
      <p class="hand rlive__previa-hand">¡prepara las palomitas!</p>
    </section>
  );
}

function ResultadosFull({
  payload,
  enPrevia,
  diasRestantes,
}: {
  payload: MundialPayload;
  enPrevia: boolean;
  diasRestantes: number;
}) {
  const [tab, setTab] = useState<Tab>('partidos');

  const live = payload.partidos.filter((p) => p.status === 'live');
  const upcoming = payload.partidos.filter((p) => p.status === 'scheduled').slice(0, 6);
  const finished = payload.partidos.filter((p) => p.status === 'finished').slice(0, 6);
  const tablas = Object.entries(payload.tablas).sort(([a], [b]) => a.localeCompare(b));

  return (
    <section class="rlive" aria-labelledby="rlive-titulo">
      <header class="rlive__header">
        <span class="mono rlive__eyebrow">
          {enPrevia ? 'EN VIVO · PREVIA' : '00 · EN DIRECTO'}
        </span>
        <h2 id="rlive-titulo" class="display rlive__titulo">
          {enPrevia ? (
            <>
              El Mundial empieza en <span class="rlive__dias">{diasRestantes}</span>{' '}
              {diasRestantes === 1 ? 'día' : 'días'}
            </>
          ) : live.length > 0 ? (
            <>
              Hay <span class="marker">{live.length}</span>{' '}
              {live.length === 1 ? 'partido' : 'partidos'} en vivo
            </>
          ) : (
            <>El Mundial <span class="marker">en directo</span></>
          )}
        </h2>
        {payload.source === 'mock' && (
          <span class="mono rlive__mock-badge" title="Estos datos son de demostración">
            DATOS DE PRUEBA
          </span>
        )}
      </header>

      {live.length > 0 && (
        <div class="rlive__live-cards">
          {live.map((p) => (
            <TickerSlide key={p.id} partidos={[p]} />
          ))}
        </div>
      )}

      <nav class="rlive__tabs" aria-label="Secciones de resultados">
        {(['partidos', 'tablas', 'goleadores'] as const).map((t) => (
          <button
            key={t}
            type="button"
            class={t === tab ? 'rlive__tab rlive__tab--active' : 'rlive__tab'}
            onClick={() => setTab(t)}
            aria-current={t === tab ? 'page' : undefined}
          >
            {t === 'partidos' ? 'Partidos' : t === 'tablas' ? 'Tablas' : 'Goleadores'}
          </button>
        ))}
      </nav>

      {tab === 'partidos' && (
        <PartidosPanel upcoming={upcoming} finished={finished} />
      )}
      {tab === 'tablas' && <TablasPanel tablas={tablas} />}
      {tab === 'goleadores' && <GoleadoresPanel scorers={payload.goleadores} />}
    </section>
  );
}

function PartidosPanel({
  upcoming,
  finished,
}: {
  upcoming: ReadonlyArray<Match>;
  finished: ReadonlyArray<Match>;
}) {
  return (
    <div class="rlive__partidos">
      <div>
        <h3 class="display rlive__col-title">Próximos</h3>
        {upcoming.length === 0 ? (
          <p class="hand rlive__empty">aún no hay partidos próximos</p>
        ) : (
          <div class="rlive__col">
            {upcoming.map((p) => (
              <PartidoFila key={p.id} partido={p} />
            ))}
          </div>
        )}
      </div>
      <div>
        <h3 class="display rlive__col-title">Terminados</h3>
        {finished.length === 0 ? (
          <p class="hand rlive__empty">todavía no se ha jugado nada</p>
        ) : (
          <div class="rlive__col">
            {finished.map((p) => (
              <PartidoFila key={p.id} partido={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PartidoFila({ partido: p }: { partido: Match }) {
  const home = SELECCIONES[p.home];
  const away = SELECCIONES[p.away];
  const isLive = p.status === 'live';
  const isFin = p.status === 'finished';
  const cuenta = !isLive && !isFin ? (fmtCountdown(p.kickoff) ?? fmtTime(p.kickoff)) : null;

  return (
    <article class="rlive__fila card-paper" data-status={p.status}>
      <div class="rlive__fila-lado rlive__fila-lado--home">
        <Flag code={p.home} size={28} />
        <span class="display rlive__fila-nombre">{home?.nombre ?? p.home}</span>
      </div>
      <div class="rlive__fila-centro">
        {p.homeScore !== null && p.awayScore !== null ? (
          <div class={isLive ? 'display rlive__fila-marcador rlive__fila-marcador--live' : 'display rlive__fila-marcador'}>
            {p.homeScore}<span class="rlive__sep">·</span>{p.awayScore}
          </div>
        ) : (
          <div class="mono rlive__fila-cuenta">{cuenta}</div>
        )}
        <div class="mono rlive__fila-estado">
          {isLive ? `● ${p.minute ?? '?'}'` : isFin ? 'FINAL' : fmtDateTime(p.kickoff)}
        </div>
      </div>
      <div class="rlive__fila-lado">
        <span class="display rlive__fila-nombre">{away?.nombre ?? p.away}</span>
        <Flag code={p.away} size={28} />
      </div>
    </article>
  );
}

function TablasPanel({ tablas }: { tablas: Array<[string, ReadonlyArray<Standing>]> }) {
  if (tablas.length === 0) {
    return <p class="hand rlive__empty">las tablas se llenarán cuando empiecen los partidos</p>;
  }
  return (
    <div class="rlive__tablas">
      {tablas.map(([letra, rows]) => {
        const sinJugar = rows.every((r) => r.pj === 0);
        return (
          <div key={letra} class="rlive__tabla card-paper">
            <header class="rlive__tabla-header">
              <span class="display rlive__tabla-titulo">Grupo {letra}</span>
              <span class="mono rlive__tabla-jornada">
                {sinJugar ? 'POR JUGAR' : `JORNADA ${Math.max(...rows.map((r) => r.pj))}/3`}
              </span>
            </header>
            <table class="rlive__tabla-tabla">
              <thead>
                <tr>
                  {['#', 'Equipo', 'PJ', 'G', 'E', 'P', 'GF', 'GC', 'PTS'].map((h) => (
                    <th key={h} class="mono rlive__tabla-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const t = SELECCIONES[row.team];
                  const clasifica = i < 2;
                  return (
                    <tr key={row.team} data-clasifica={clasifica ? 'true' : 'false'}>
                      <td class="mono rlive__tabla-num">{i + 1}</td>
                      <td class="rlive__tabla-equipo">
                        <Flag code={row.team} size={20} />
                        <span class="display">{t?.nombre ?? row.team}</span>
                      </td>
                      <td class="mono">{sinJugar ? '–' : row.pj}</td>
                      <td class="mono">{sinJugar ? '–' : row.g}</td>
                      <td class="mono">{sinJugar ? '–' : row.e}</td>
                      <td class="mono">{sinJugar ? '–' : row.p}</td>
                      <td class="mono">{sinJugar ? '–' : row.gf}</td>
                      <td class="mono">{sinJugar ? '–' : row.gc}</td>
                      <td class="display rlive__tabla-pts">{sinJugar ? '–' : row.pts}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

function GoleadoresPanel({ scorers }: { scorers: ReadonlyArray<Scorer> }) {
  if (scorers.length === 0) {
    return <p class="hand rlive__empty">aún no se ha marcado ningún gol</p>;
  }
  return (
    <div class="rlive__goleadores card-paper">
      <header class="rlive__gol-header">
        <span class="display rlive__gol-titulo">Bota de oro</span>
        <span class="hand rlive__gol-sub">¿quién mete más goles?</span>
      </header>
      <ol class="rlive__gol-lista">
        {scorers.map((g, i) => {
          const t = SELECCIONES[g.team];
          const isPodium = i < 3;
          const medalColor = i === 0 ? '#facc15' : i === 1 ? '#cbd5e1' : '#f97316';
          return (
            <li key={`${g.player}-${g.team}`} class="rlive__gol-item" data-podium={isPodium ? 'true' : 'false'}>
              <span
                class="display rlive__gol-pos"
                style={isPodium ? { color: medalColor } : undefined}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div class="rlive__gol-info">
                <div class="rlive__gol-row">
                  <Flag code={g.team} size={22} />
                  <span class="display rlive__gol-nombre">{g.player}</span>
                </div>
                {g.curiosidad && (
                  <p class="hand rlive__gol-curio">{g.curiosidad}</p>
                )}
                <span class="mono rlive__gol-pais">{t?.nombre ?? g.team}</span>
              </div>
              <div class="rlive__gol-cifra-box">
                <span class="display rlive__gol-cifra">{g.goles}</span>
                <span class="mono rlive__gol-unidad">{g.goles === 1 ? 'GOL' : 'GOLES'}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default ResultadosLive;
