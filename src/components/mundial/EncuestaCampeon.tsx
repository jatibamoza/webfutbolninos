import { useEffect, useMemo, useState } from 'preact/hooks';
import { SELECCIONES } from '@/lib/mundial/selecciones';
import { SELECCIONES_DEL_TORNEO } from '@/lib/mundial/grupos';
import type { Vote } from '@/lib/mundial/types';
import { Flag } from './FlagPreact';

/**
 * Encuesta "¿quién crees que ganará el Mundial 2026?".
 *
 * Estado:
 * - Cada usuario vota UNA vez (cambiable). Persistido en localStorage.
 * - Los counts agregados son MOCK por ahora — distribución plausible que
 *   favorece a las grandes potencias. Cuando exista backend (Fase 6),
 *   sustituir `INITIAL_COUNTS` por un fetch a `/api/encuesta-campeon`.
 * - El voto del usuario se suma client-side a los counts visibles para que
 *   "su" voto se refleje en el podium inmediatamente.
 *
 * Vista A (sin voto): grid con las 48 selecciones, clic para elegir.
 * Vista B (con voto): podium top 3 + ranking completo con barras + "cambiar voto".
 */

const LS_KEY = 'mg.mundial.encuesta-campeon';

/**
 * Mock de votos pre-cargados — escenario realista que el usuario verá la primera
 * vez que entre. Total ~1200 votos. Distribución basada en favoritismo histórico
 * + países anfitriones. Sustituir por fetch real en Fase 6.
 */
const INITIAL_COUNTS: Record<string, number> = {
  ARG: 187, BRA: 152, FRA: 124, ESP: 118, ENG: 96, GER: 84, POR: 71, NED: 58,
  MEX: 54, USA: 47, ITA: 42, URU: 38, COL: 35, BEL: 31, CRO: 28, JPN: 24,
  MAR: 22, KOR: 19, CAN: 18, SUI: 16, DEN: 14, AUS: 13, SEN: 11, NOR: 10,
  POL: 9,  AUT: 8,  ECU: 8,  TUR: 7, EGY: 7, NGA: 6, IRN: 6, KSA: 5,
  PAR: 5,  CIV: 4,  GHA: 4,  ALG: 4, TUN: 3, CMR: 3, JAM: 3, QAT: 3,
  CRC: 2,  PAN: 2,  HON: 2,  HUN: 2, SVK: 2, UZB: 1, NZL: 1, IRQ: 1,
};

function loadVote(): Vote | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Vote;
    if (typeof parsed?.team !== 'string' || !SELECCIONES[parsed.team]) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveVote(v: Vote | null) {
  try {
    if (v) localStorage.setItem(LS_KEY, JSON.stringify(v));
    else localStorage.removeItem(LS_KEY);
  } catch {
    // sin storage (navegador en modo privado): el voto solo dura la sesión.
  }
}

export function EncuestaCampeon() {
  const [voto, setVoto] = useState<Vote | null>(null);
  const [hidratado, setHidratado] = useState(false);

  // Cargar voto desde localStorage en mount (no en SSR — el componente es client-only).
  useEffect(() => {
    setVoto(loadVote());
    setHidratado(true);
  }, []);

  function elegir(team: string) {
    const v: Vote = { team, at: new Date().toISOString() };
    setVoto(v);
    saveVote(v);
  }

  function cambiar() {
    setVoto(null);
    saveVote(null);
  }

  // Counts agregados = mock + 1 al voto del usuario.
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const code of SELECCIONES_DEL_TORNEO) {
      c[code] = INITIAL_COUNTS[code] ?? 0;
    }
    if (voto) c[voto.team] = (c[voto.team] ?? 0) + 1;
    return c;
  }, [voto]);

  const ranking = useMemo(() => {
    return SELECCIONES_DEL_TORNEO
      .map((code) => ({ code, votos: counts[code] ?? 0 }))
      .sort((a, b) => b.votos - a.votos);
  }, [counts]);

  const total = useMemo(() => Object.values(counts).reduce((s, n) => s + n, 0), [counts]);

  // Antes de hidratar evitamos parpadeo: render del skeleton (server-friendly).
  if (!hidratado) {
    return (
      <div class="encuesta encuesta--loading" aria-busy="true">
        <div class="encuesta__skeleton" />
      </div>
    );
  }

  if (!voto) return <SinVoto onElegir={elegir} />;
  return <ConVoto voto={voto} ranking={ranking} total={total} onCambiar={cambiar} />;
}

// ───────────────────────────── Vista A: sin voto ─────────────────────────────

function SinVoto({ onElegir }: { onElegir: (code: string) => void }) {
  return (
    <section class="encuesta encuesta--sin-voto" aria-labelledby="enc-titulo">
      <header class="encuesta__header">
        <span class="mono encuesta__eyebrow">06 · TU PRONÓSTICO</span>
        <h2 id="enc-titulo" class="display encuesta__titulo">
          ¿Quién crees que <span class="marker">ganará</span>?
        </h2>
        <p class="encuesta__intro">
          Vota con tu peque. Pueden elegir entre las <strong>48 selecciones</strong>. Después verás el
          podium de las más votadas por el resto de aficionados. <strong>Un voto por dispositivo</strong> —
          puedes cambiarlo cuando quieras.
        </p>
      </header>

      <ul class="encuesta__grid" role="list">
        {SELECCIONES_DEL_TORNEO.map((code) => {
          const t = SELECCIONES[code];
          if (!t) return null;
          return (
            <li key={code}>
              <button
                type="button"
                class="encuesta__opcion card-paper"
                onClick={() => onElegir(code)}
                aria-label={`Votar por ${t.nombre}`}
              >
                <Flag code={code} size={36} />
                <span class="display encuesta__opcion-nombre">{t.nombre}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ───────────────────────────── Vista B: con voto ─────────────────────────────

function ConVoto({
  voto,
  ranking,
  total,
  onCambiar,
}: {
  voto: Vote;
  ranking: ReadonlyArray<{ code: string; votos: number }>;
  total: number;
  onCambiar: () => void;
}) {
  const elegido = SELECCIONES[voto.team];
  const top3 = ranking.slice(0, 3);
  const resto = ranking.slice(3);

  // Para el podium: orden visual es [2°, 1°, 3°] de izquierda a derecha.
  const podiumOrden = [top3[1], top3[0], top3[2]].filter(Boolean) as typeof top3;

  return (
    <section class="encuesta encuesta--con-voto" aria-labelledby="enc-titulo">
      <header class="encuesta__header">
        <span class="mono encuesta__eyebrow">06 · TU PRONÓSTICO</span>
        <h2 id="enc-titulo" class="display encuesta__titulo">
          Tu pronóstico: <span class="marker">{elegido?.nombre ?? voto.team}</span>
        </h2>
        <p class="encuesta__intro">
          Has votado por <strong>{elegido?.nombre ?? voto.team}</strong>. Así va el podium de la
          afición de MiniGol Club <span class="mono encuesta__total">({total.toLocaleString('es-ES')} votos)</span>.
        </p>
      </header>

      <div class="encuesta__podium" aria-label="Podium de selecciones más votadas">
        {podiumOrden.map((row) => {
          if (!row) return null;
          const t = SELECCIONES[row.code];
          if (!t) return null;
          const pos = ranking.findIndex((r) => r.code === row.code) + 1;
          const pct = total > 0 ? Math.round((row.votos / total) * 100) : 0;
          return (
            <div
              key={row.code}
              class="encuesta__paso"
              data-pos={pos}
              data-mio={voto.team === row.code ? 'true' : 'false'}
            >
              <span class="display encuesta__paso-medalla" aria-hidden="true">{pos}°</span>
              <div class="encuesta__paso-bandera">
                <Flag code={row.code} size={pos === 1 ? 64 : 52} />
              </div>
              <span class="display encuesta__paso-nombre">{t.nombre}</span>
              <span class="mono encuesta__paso-votos">{row.votos.toLocaleString('es-ES')} · {pct}%</span>
              <div class="encuesta__paso-base" aria-hidden="true"></div>
            </div>
          );
        })}
      </div>

      <details class="encuesta__detalles">
        <summary class="mono encuesta__resumen">Ver ranking completo de las 48 selecciones</summary>
        <ol class="encuesta__lista" role="list">
          {resto.map((row, i) => {
            const t = SELECCIONES[row.code];
            if (!t) return null;
            const pct = total > 0 ? Math.round((row.votos / total) * 100) : 0;
            const pctBar = total > 0 ? (row.votos / (ranking[0]?.votos ?? 1)) * 100 : 0;
            const esMio = voto.team === row.code;
            return (
              <li key={row.code} class="encuesta__row" data-mio={esMio ? 'true' : 'false'}>
                <span class="mono encuesta__row-pos">{i + 4}</span>
                <div class="encuesta__row-info">
                  <Flag code={row.code} size={20} />
                  <span class="display encuesta__row-nombre">{t.nombre}</span>
                  {esMio && <span class="hand encuesta__row-mio">tú</span>}
                </div>
                <div class="encuesta__row-bar" aria-hidden="true">
                  <span class="encuesta__row-bar-fill" style={{ width: `${pctBar}%` }}></span>
                </div>
                <span class="mono encuesta__row-pct">{pct}%</span>
              </li>
            );
          })}
        </ol>
      </details>

      <button type="button" class="btn btn-ghost encuesta__cambiar" onClick={onCambiar}>
        Cambiar mi voto
      </button>
    </section>
  );
}

export default EncuestaCampeon;
