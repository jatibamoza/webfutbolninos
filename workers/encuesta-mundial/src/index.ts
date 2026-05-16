/**
 * encuesta-mundial Worker
 *
 * Backend de la encuesta "¿quién crees que ganará el Mundial 2026?".
 *
 * Endpoints:
 *   GET  /            → { counts: { ISO3: número }, total: número }
 *   POST /            body { team: "ISO3" } → registra voto y devuelve counts actualizados
 *   OPTIONS /         → CORS preflight
 *
 * Storage (KV namespace `ENCUESTA_MUNDIAL`):
 *   count:<ISO3>     → string, contador de votos para esa selección
 *   voter:<hash>     → string ISO3, registro del voto de un dispositivo (TTL configurable)
 *
 * Anti-spam:
 *   - Un voto por dispositivo (hash de IP + User-Agent). Si vota otra vez,
 *     se decrementa el contador del anterior y se incrementa el nuevo.
 *   - Sin auth, sin captcha. Bypass posible con VPN/incognito — aceptable
 *     para una encuesta lúdica de fútbol infantil.
 *
 * Race conditions:
 *   Cloudflare KV no es atómico. Reads-then-writes pueden colisionar.
 *   Para nuestro volumen esperado (~cientos de votos/día) es aceptable.
 *   Si en algún momento la encuesta se vuelve viral, migrar a Durable Objects.
 */

interface Env {
  ENCUESTA_MUNDIAL: KVNamespace;
  ALLOWED_ORIGINS: string;
  VOTER_TTL_DAYS: string;
}

/**
 * Las 48 selecciones del Mundial 2026 — debe coincidir EXACTAMENTE con
 * `src/lib/mundial/grupos.ts` (SELECCIONES_DEL_TORNEO).
 * Si cambia el sorteo, actualizar también aquí. Worker rechaza votos por
 * códigos fuera de esta lista para evitar polución de KV.
 */
const TOURNAMENT_TEAMS: ReadonlySet<string> = new Set([
  'MEX', 'RSA', 'KOR', 'CZE',
  'CAN', 'BIH', 'SUI', 'QAT',
  'BRA', 'MAR', 'SCO', 'HAI',
  'USA', 'PAR', 'AUS', 'TUR',
  'GER', 'CUW', 'CIV', 'ECU',
  'NED', 'JPN', 'SWE', 'TUN',
  'BEL', 'EGY', 'IRN', 'NZL',
  'ESP', 'CPV', 'KSA', 'URU',
  'FRA', 'SEN', 'IRQ', 'NOR',
  'ARG', 'ALG', 'AUT', 'JOR',
  'POR', 'COD', 'UZB', 'COL',
  'ENG', 'CRO', 'GHA', 'PAN',
]);

/**
 * Seed inicial. Debe coincidir con `INITIAL_COUNTS` de
 * `src/components/mundial/EncuestaCampeon.tsx`. Se usa solo si KV está vacía
 * para esa clave — permite que la encuesta arranque con un escenario realista
 * en lugar de "0 votos para todos". Tras el primer voto real de un país, el
 * KV manda y el seed deja de aplicarse a ese país.
 */
const INITIAL_COUNTS: Readonly<Record<string, number>> = {
  ARG: 195, BRA: 145, FRA: 105, ESP: 90,
  ENG: 80, GER: 70, POR: 65, NED: 55,
  MEX: 50, USA: 45, BEL: 28, URU: 28, CRO: 25, COL: 24,
  JPN: 22, KOR: 18, MAR: 15, SEN: 14, ECU: 12, AUS: 11, SUI: 10, NOR: 8,
  CAN: 12, RSA: 8, AUT: 7, TUR: 7, EGY: 7, SWE: 7, CIV: 6, GHA: 6, ALG: 6,
  CZE: 5, SCO: 5, IRN: 5, TUN: 4, KSA: 4, PAR: 4, IRQ: 4, QAT: 4, UZB: 4,
  JOR: 3, BIH: 3, HAI: 3, CUW: 3, CPV: 3, COD: 3, PAN: 3, NZL: 2,
};

// ─── CORS ─────────────────────────────────────────────────────────────────

function corsHeaders(origin: string | null, env: Env): Record<string, string> {
  const allowed = env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
  const allowOrigin = origin && allowed.includes(origin) ? origin : allowed[0] ?? '*';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function json(body: unknown, init: ResponseInit & { headers: Record<string, string> }): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { ...init.headers, 'Content-Type': 'application/json; charset=utf-8' },
  });
}

// ─── Voter ID (hash IP + UA) ──────────────────────────────────────────────

async function hashVoterId(req: Request): Promise<string> {
  const ip = req.headers.get('cf-connecting-ip') ?? 'unknown-ip';
  const ua = req.headers.get('user-agent') ?? 'unknown-ua';
  const data = new TextEncoder().encode(`${ip}|${ua}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32);
}

// ─── Counts (read & write) ────────────────────────────────────────────────

async function getCountFor(env: Env, code: string): Promise<number> {
  const stored = await env.ENCUESTA_MUNDIAL.get(`count:${code}`);
  if (stored !== null) return Number.parseInt(stored, 10);
  return INITIAL_COUNTS[code] ?? 0;
}

async function setCountFor(env: Env, code: string, value: number): Promise<void> {
  await env.ENCUESTA_MUNDIAL.put(`count:${code}`, String(Math.max(0, value)));
}

async function readAllCounts(env: Env): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  await Promise.all(
    Array.from(TOURNAMENT_TEAMS).map(async (code) => {
      counts[code] = await getCountFor(env, code);
    }),
  );
  return counts;
}

// ─── Vote logic ───────────────────────────────────────────────────────────

async function registerVote(env: Env, team: string, voterId: string): Promise<{ changed: boolean }> {
  const previousTeam = await env.ENCUESTA_MUNDIAL.get(`voter:${voterId}`);
  if (previousTeam === team) return { changed: false };

  if (previousTeam && TOURNAMENT_TEAMS.has(previousTeam)) {
    const prev = await getCountFor(env, previousTeam);
    await setCountFor(env, previousTeam, prev - 1);
  }

  const curr = await getCountFor(env, team);
  await setCountFor(env, team, curr + 1);

  const ttlSeconds = Number.parseInt(env.VOTER_TTL_DAYS, 10) * 24 * 60 * 60;
  await env.ENCUESTA_MUNDIAL.put(`voter:${voterId}`, team, { expirationTtl: ttlSeconds });

  return { changed: true };
}

// ─── HTTP handlers ────────────────────────────────────────────────────────

async function handleGet(env: Env, cors: Record<string, string>): Promise<Response> {
  const counts = await readAllCounts(env);
  const total = Object.values(counts).reduce((s, n) => s + n, 0);
  return json({ counts, total }, { headers: { ...cors, 'Cache-Control': 'public, max-age=10' } });
}

async function handlePost(req: Request, env: Env, cors: Record<string, string>): Promise<Response> {
  let body: { team?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'JSON inválido' }, { status: 400, headers: cors });
  }

  const team = typeof body.team === 'string' ? body.team.toUpperCase() : '';
  if (!team || !TOURNAMENT_TEAMS.has(team)) {
    return json({ error: `Equipo no válido: ${team || '(vacío)'}` }, { status: 400, headers: cors });
  }

  const voterId = await hashVoterId(req);
  const { changed } = await registerVote(env, team, voterId);

  // Tras un voto, devolvemos counts frescos para que el frontend pinte el
  // nuevo podium sin un segundo round-trip.
  const counts = await readAllCounts(env);
  const total = Object.values(counts).reduce((s, n) => s + n, 0);
  return json(
    { changed, vote: team, counts, total },
    { headers: { ...cors, 'Cache-Control': 'no-store' } },
  );
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(req.headers.get('origin'), env);

    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (req.method === 'GET') {
      return handleGet(env, cors);
    }
    if (req.method === 'POST') {
      return handlePost(req, env, cors);
    }
    return json({ error: 'Método no permitido' }, { status: 405, headers: { ...cors, Allow: 'GET, POST, OPTIONS' } });
  },
} satisfies ExportedHandler<Env>;
