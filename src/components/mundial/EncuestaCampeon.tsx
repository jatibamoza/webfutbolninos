import { useEffect, useMemo, useState } from 'preact/hooks';
import { SELECCIONES } from '@/lib/mundial/selecciones';
import { SELECCIONES_DEL_TORNEO } from '@/lib/mundial/grupos';
import { ENCUESTA_API_URL } from '@/consts';
import type { Vote } from '@/lib/mundial/types';
import { Flag } from './FlagPreact';

/**
 * Encuesta "¿quién crees que ganará el Mundial 2026?".
 *
 * Modo online (recomendado): si `ENCUESTA_API_URL` está configurada, los
 * counts agregados vienen del Worker `workers/encuesta-mundial/`. Los votos
 * se suman en KV y todos los usuarios ven el mismo podium en tiempo real.
 *
 * Modo offline (fallback): si la API no responde o no está configurada,
 * la encuesta sigue funcionando contra `INITIAL_COUNTS` (mock local) y
 * localStorage. El usuario ve su voto reflejado en SU vista, pero no se
 * agrega entre dispositivos.
 *
 * Vista A (sin voto): grid con las 48 selecciones, clic para elegir.
 * Vista B (con voto): podium top 3 + ranking completo con barras + "cambiar voto".
 */

const LS_KEY = 'mg.mundial.encuesta-campeon';

/**
 * Seed inicial — mismo objeto debe estar en `workers/encuesta-mundial/src/index.ts`.
 * Se usa cuando el backend no responde (modo offline) o como base inicial
 * antes del primer fetch. Distribución por favoritismo histórico + anfitriones.
 */
const INITIAL_COUNTS: Record<string, number> = {
  // Favoritos absolutos
  ARG: 195, BRA: 145, FRA: 105, ESP: 90,
  // Favoritos
  ENG: 80, GER: 70, POR: 65, NED: 55,
  // Anfitriones + competitivos
  MEX: 50, USA: 45, BEL: 28, URU: 28, CRO: 25, COL: 24,
  // Competitivos
  JPN: 22, KOR: 18, MAR: 15, SEN: 14, ECU: 12, AUS: 11, SUI: 10, NOR: 8,
  // Resto del torneo (las 48 selecciones cubiertas)
  CAN: 12, RSA: 8, AUT: 7, TUR: 7, EGY: 7, SWE: 7, CIV: 6, GHA: 6, ALG: 6,
  CZE: 5, SCO: 5, IRN: 5, TUN: 4, KSA: 4, PAR: 4, IRQ: 4, QAT: 4, UZB: 4,
  JOR: 3, BIH: 3, HAI: 3, CUW: 3, CPV: 3, COD: 3, PAN: 3, NZL: 2,
};

type CountsBy = Record<string, number>;

/** GET counts del backend. Devuelve null si la API no está configurada o falla. */
async function fetchCounts(): Promise<CountsBy | null> {
  if (!ENCUESTA_API_URL) return null;
  try {
    const r = await fetch(ENCUESTA_API_URL, { method: 'GET' });
    if (!r.ok) return null;
    const data = (await r.json()) as { counts?: CountsBy };
    return data.counts ?? null;
  } catch {
    return null;
  }
}

/** POST voto al backend. Devuelve los counts actualizados o null si falla. */
async function postVote(team: string): Promise<CountsBy | null> {
  if (!ENCUESTA_API_URL) return null;
  try {
    const r = await fetch(ENCUESTA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team }),
    });
    if (!r.ok) return null;
    const data = (await r.json()) as { counts?: CountsBy };
    return data.counts ?? null;
  } catch {
    return null;
  }
}

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
  /**
   * Counts agregados desde el backend. `null` mientras no hayan llegado del
   * servidor o si la API falla. El render combina estos con el seed local
   * y con el voto del usuario para reflejar su elección al instante.
   */
  const [serverCounts, setServerCounts] = useState<CountsBy | null>(null);

  // Cargar voto local + fetch inicial de counts. Side effects client-only.
  useEffect(() => {
    setVoto(loadVote());
    setHidratado(true);
    void fetchCounts().then(setServerCounts);
  }, []);

  async function elegir(team: string) {
    const v: Vote = { team, at: new Date().toISOString() };
    setVoto(v);
    saveVote(v);
    // POST en background: si funciona, refrescamos counts del servidor.
    // Si falla, el voto sigue guardado localmente — el podium se calcula
    // con seed + voto, así que la UX no se rompe.
    const fresh = await postVote(team);
    if (fresh) setServerCounts(fresh);
  }

  function cambiar() {
    setVoto(null);
    saveVote(null);
    // No mandamos POST para "revertir voto" — el siguiente voto del usuario
    // hará que el backend decremente el anterior y sume el nuevo en una
    // sola operación. Mientras tanto su counter del antiguo queda intacto
    // en el servidor (visible para otros), lo cual es aceptable.
  }

  /**
   * Counts a mostrar: prioridad serverCounts (si hay) sobre INITIAL_COUNTS.
   * Si el voto del usuario aún no se ha confirmado por el backend (POST en
   * vuelo o falló), añadimos +1 client-side al equipo elegido — pero NO si
   * el server ya refleja el voto (evita doble conteo cuando el POST vuelve).
   */
  const counts = useMemo(() => {
    const base = serverCounts ?? null;
    const c: Record<string, number> = {};
    for (const code of SELECCIONES_DEL_TORNEO) {
      c[code] = base ? (base[code] ?? 0) : (INITIAL_COUNTS[code] ?? 0);
    }
    if (voto && !base) {
      // Sin server (offline o pending): sumar voto local al podium.
      c[voto.team] = (c[voto.team] ?? 0) + 1;
    }
    return c;
  }, [voto, serverCounts]);

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

function SinVoto({ onElegir }: { onElegir: (code: string) => void | Promise<void> }) {
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
