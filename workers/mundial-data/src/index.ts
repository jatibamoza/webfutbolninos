/**
 * mundial-data Worker
 *
 * Proxy + cache de los datos en vivo del Mundial 2026 (partidos, tablas y
 * goleadores). Aísla el frontend de la API de football-data.org: si la cuota
 * se agota o el token expira, devolvemos datos mock embebidos en lugar de
 * romper la página.
 *
 * Endpoints:
 *   GET /         → { partidos, tablas, goleadores, lastUpdate, source }
 *   GET /partidos → solo partidos
 *   GET /tablas   → solo tablas por grupo
 *   GET /goleadores → solo goleadores
 *
 * Modos de operación (`DATA_SOURCE`):
 *   "mock"          → siempre devuelve datos mock embebidos. Útil hasta que
 *                     llegue el token de football-data.org.
 *   "football-data" → fetch a https://api.football-data.org/v4/competitions/WC
 *                     con cache KV. Fallback al mock si la API falla.
 *
 * Cache: KV con TTL `CACHE_TTL_SECONDS` (60s default). En la práctica los
 * usuarios ven datos como mucho 60s viejos durante partidos en vivo —
 * suficiente para una página educativa para niños.
 */

interface Env {
  MUNDIAL_DATA_CACHE: KVNamespace;
  ALLOWED_ORIGINS: string;
  DATA_SOURCE: string;
  CACHE_TTL_SECONDS: string;
  FOOTBALL_DATA_TOKEN?: string;
}

// ─── Tipos del dominio (espejo de src/lib/mundial/types.ts) ─────────────────

type MatchStatus = 'scheduled' | 'live' | 'finished';

interface Match {
  id: string;
  fase: string;
  grupo?: string;
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  kickoff: string;
  venue?: string;
  minute?: number;
}

interface Standing {
  team: string;
  pj: number;
  g: number;
  e: number;
  p: number;
  gf: number;
  gc: number;
  pts: number;
}

interface Scorer {
  player: string;
  team: string;
  goles: number;
  curiosidad: string;
}

interface MundialPayload {
  partidos: Match[];
  tablas: Record<string, Standing[]>;
  goleadores: Scorer[];
  lastUpdate: string;
  source: 'football-data' | 'mock';
}

// ─── Mock embebido — fuente de verdad cuando DATA_SOURCE=mock ───────────────
//
// Kickoffs RELATIVOS a `Date.now()` para que en cualquier momento haya algo
// "en vivo" y algo "próximo". Pensado para validar la UI antes y durante el
// torneo. Mantener sincronizado con `src/lib/mundial/mock.ts` del frontend
// (mismo formato).

function buildMockPayload(): MundialPayload {
  const inMin = (m: number) => new Date(Date.now() + m * 60_000).toISOString();
  return {
    partidos: [
      { id: 'm1', fase: 'Grupos · J1', grupo: 'A', home: 'MEX', away: 'RSA', homeScore: 2, awayScore: 1, status: 'finished', kickoff: inMin(-180), venue: 'Azteca, CDMX', minute: 90 },
      { id: 'm2', fase: 'Grupos · J1', grupo: 'C', home: 'BRA', away: 'MAR', homeScore: 1, awayScore: 1, status: 'live',     kickoff: inMin(-65),  venue: 'MetLife, NJ', minute: 67 },
      { id: 'm3', fase: 'Grupos · J1', grupo: 'H', home: 'ESP', away: 'URU', homeScore: 0, awayScore: 0, status: 'live',     kickoff: inMin(-12),  venue: 'SoFi, LA',    minute: 14 },
      { id: 'm4', fase: 'Grupos · J1', grupo: 'J', home: 'ARG', away: 'ALG', homeScore: null, awayScore: null, status: 'scheduled', kickoff: inMin(125),  venue: 'Estadio BBVA, MTY' },
      { id: 'm5', fase: 'Grupos · J1', grupo: 'L', home: 'ENG', away: 'CRO', homeScore: null, awayScore: null, status: 'scheduled', kickoff: inMin(280),  venue: 'AT&T, Dallas' },
      { id: 'm6', fase: 'Grupos · J1', grupo: 'I', home: 'FRA', away: 'SEN', homeScore: null, awayScore: null, status: 'scheduled', kickoff: inMin(425),  venue: 'Mercedes-Benz, ATL' },
      { id: 'm7', fase: 'Grupos · J1', grupo: 'B', home: 'CAN', away: 'BIH', homeScore: null, awayScore: null, status: 'scheduled', kickoff: inMin(1440), venue: 'BMO Field, Toronto' },
      { id: 'm8', fase: 'Grupos · J1', grupo: 'D', home: 'USA', away: 'PAR', homeScore: null, awayScore: null, status: 'scheduled', kickoff: inMin(1580), venue: "Levi's, SF" },
    ],
    tablas: {
      A: [
        { team: 'MEX', pj: 1, g: 1, e: 0, p: 0, gf: 2, gc: 1, pts: 3 },
        { team: 'KOR', pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 },
        { team: 'CZE', pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 },
        { team: 'RSA', pj: 1, g: 0, e: 0, p: 1, gf: 1, gc: 2, pts: 0 },
      ],
      C: [
        { team: 'BRA', pj: 1, g: 0, e: 1, p: 0, gf: 1, gc: 1, pts: 1 },
        { team: 'MAR', pj: 1, g: 0, e: 1, p: 0, gf: 1, gc: 1, pts: 1 },
        { team: 'SCO', pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 },
        { team: 'HAI', pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 },
      ],
      H: [
        { team: 'ESP', pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 },
        { team: 'URU', pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 },
        { team: 'KSA', pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 },
        { team: 'CPV', pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 },
      ],
    },
    goleadores: [
      { player: 'Santi Giménez',  team: 'MEX', goles: 2, curiosidad: 'lleva el dorsal 9, como Hugo Sánchez' },
      { player: 'Vinicius Jr.',   team: 'BRA', goles: 1, curiosidad: 'extremo izquierdo, juega en el Real Madrid' },
      { player: 'Nico Williams',  team: 'ESP', goles: 1, curiosidad: 'extremo derecho, hermano menor de Iñaki' },
      { player: 'Achraf Hakimi',  team: 'MAR', goles: 1, curiosidad: 'lateral derecho, capitán de Marruecos' },
    ],
    lastUpdate: new Date().toISOString(),
    source: 'mock',
  };
}

// ─── Integración football-data.org ───────────────────────────────────────────
//
// API v4: https://api.football-data.org/v4/competitions/WC/{matches,standings,scorers}
// Free tier: 10 req/min, 100/día. Token en `FOOTBALL_DATA_TOKEN` (secret).
//
// Mapeos: la API devuelve `team.tla` (3-letter abbreviation) que coincide con
// nuestros ISO3 en la mayoría de los casos, pero hay excepciones (ENG en vez
// de GBR para Inglaterra). Aceptamos `tla` tal cual — si el código no está en
// nuestro catálogo, el frontend muestra el chip de fallback.

const FD_BASE = 'https://api.football-data.org/v4/competitions/WC';

async function fetchFromFootballData(env: Env): Promise<MundialPayload | null> {
  if (!env.FOOTBALL_DATA_TOKEN) return null;
  const headers = { 'X-Auth-Token': env.FOOTBALL_DATA_TOKEN };

  try {
    const [matchesRes, standingsRes, scorersRes] = await Promise.all([
      fetch(`${FD_BASE}/matches`, { headers }),
      fetch(`${FD_BASE}/standings`, { headers }),
      fetch(`${FD_BASE}/scorers?limit=15`, { headers }),
    ]);
    if (!matchesRes.ok || !standingsRes.ok || !scorersRes.ok) return null;

    const matchesData = (await matchesRes.json()) as FdMatchesResponse;
    const standingsData = (await standingsRes.json()) as FdStandingsResponse;
    const scorersData = (await scorersRes.json()) as FdScorersResponse;

    return {
      partidos: matchesData.matches.map(mapMatch),
      tablas: mapStandings(standingsData),
      goleadores: scorersData.scorers.slice(0, 15).map(mapScorer),
      lastUpdate: new Date().toISOString(),
      source: 'football-data',
    };
  } catch {
    return null;
  }
}

// Tipos mínimos de la respuesta de football-data.org — solo los campos que usamos.
interface FdMatchesResponse {
  matches: ReadonlyArray<{
    id: number;
    utcDate: string;
    status: string;
    minute?: number | null;
    stage?: string;
    group?: string | null;
    venue?: string;
    homeTeam: { tla: string };
    awayTeam: { tla: string };
    score: {
      fullTime: { home: number | null; away: number | null };
      halfTime?: { home: number | null; away: number | null };
    };
  }>;
}
interface FdStandingsResponse {
  standings: ReadonlyArray<{
    group?: string | null;
    type: string;
    table: ReadonlyArray<{
      team: { tla: string };
      playedGames: number;
      won: number;
      draw: number;
      lost: number;
      goalsFor: number;
      goalsAgainst: number;
      points: number;
    }>;
  }>;
}
interface FdScorersResponse {
  scorers: ReadonlyArray<{
    player: { name: string };
    team: { tla: string };
    goals: number;
  }>;
}

function mapMatch(m: FdMatchesResponse['matches'][number]): Match {
  const status: MatchStatus =
    m.status === 'IN_PLAY' || m.status === 'PAUSED' ? 'live' :
    m.status === 'FINISHED' ? 'finished' : 'scheduled';
  const fase = (m.stage ?? '').replace('GROUP_STAGE', 'Grupos').replace(/_/g, ' ');
  return {
    id: String(m.id),
    fase: fase || 'Grupos',
    grupo: m.group?.replace('GROUP_', '') ?? undefined,
    home: m.homeTeam.tla,
    away: m.awayTeam.tla,
    homeScore: m.score.fullTime.home,
    awayScore: m.score.fullTime.away,
    status,
    kickoff: m.utcDate,
    venue: m.venue,
    minute: m.minute ?? undefined,
  };
}

function mapStandings(s: FdStandingsResponse): Record<string, Standing[]> {
  const out: Record<string, Standing[]> = {};
  for (const standing of s.standings) {
    if (standing.type !== 'TOTAL' || !standing.group) continue;
    const letter = standing.group.replace('GROUP_', '');
    out[letter] = standing.table.map((row) => ({
      team: row.team.tla,
      pj: row.playedGames,
      g: row.won,
      e: row.draw,
      p: row.lost,
      gf: row.goalsFor,
      gc: row.goalsAgainst,
      pts: row.points,
    }));
  }
  return out;
}

function mapScorer(s: FdScorersResponse['scorers'][number]): Scorer {
  return {
    player: s.player.name,
    team: s.team.tla,
    goles: s.goals,
    // football-data.org no incluye datos curiosos. Texto vacío → frontend
    // simplemente no renderiza la nota. Si queremos curiosidades en prod,
    // tendríamos que tener un side-table local indexado por nombre/equipo.
    curiosidad: '',
  };
}

// ─── Cache ──────────────────────────────────────────────────────────────────

const CACHE_KEY = 'payload:current';

async function getCachedPayload(env: Env): Promise<MundialPayload | null> {
  const raw = await env.MUNDIAL_DATA_CACHE.get(CACHE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MundialPayload;
  } catch {
    return null;
  }
}

async function setCachedPayload(env: Env, payload: MundialPayload): Promise<void> {
  const ttl = Math.max(30, Number.parseInt(env.CACHE_TTL_SECONDS, 10));
  await env.MUNDIAL_DATA_CACHE.put(CACHE_KEY, JSON.stringify(payload), { expirationTtl: ttl });
}

async function getPayload(env: Env): Promise<MundialPayload> {
  // Modo mock — no cache (los kickoffs relativos a Date.now() requieren
  // generación fresca para que la demo siempre tenga partidos en vivo).
  if (env.DATA_SOURCE !== 'football-data') {
    return buildMockPayload();
  }

  const cached = await getCachedPayload(env);
  if (cached) return cached;

  const fresh = await fetchFromFootballData(env);
  if (fresh) {
    await setCachedPayload(env, fresh);
    return fresh;
  }

  // API caída o token inválido → fallback al mock para no romper el frontend.
  return buildMockPayload();
}

// ─── CORS ───────────────────────────────────────────────────────────────────

function corsHeaders(origin: string | null, env: Env): Record<string, string> {
  const allowed = env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
  const allowOrigin = origin && allowed.includes(origin) ? origin : allowed[0] ?? '*';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function json(body: unknown, init: { status?: number; headers: Record<string, string> }): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { ...init.headers, 'Content-Type': 'application/json; charset=utf-8' },
  });
}

// ─── HTTP handler ───────────────────────────────────────────────────────────

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(req.headers.get('origin'), env);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'GET') {
      return json({ error: 'Método no permitido' }, { status: 405, headers: { ...cors, Allow: 'GET, OPTIONS' } });
    }

    const url = new URL(req.url);
    const payload = await getPayload(env);

    // El Cache-Control público permite que Cloudflare CDN también cache el
    // resultado para hosts ajenos a la app. Mismo TTL que el KV interno.
    const ttl = env.CACHE_TTL_SECONDS;
    const cacheHeader = { 'Cache-Control': `public, max-age=${ttl}, s-maxage=${ttl}` };

    if (url.pathname.endsWith('/partidos')) {
      return json({ partidos: payload.partidos, lastUpdate: payload.lastUpdate, source: payload.source }, { headers: { ...cors, ...cacheHeader } });
    }
    if (url.pathname.endsWith('/tablas')) {
      return json({ tablas: payload.tablas, lastUpdate: payload.lastUpdate, source: payload.source }, { headers: { ...cors, ...cacheHeader } });
    }
    if (url.pathname.endsWith('/goleadores')) {
      return json({ goleadores: payload.goleadores, lastUpdate: payload.lastUpdate, source: payload.source }, { headers: { ...cors, ...cacheHeader } });
    }

    return json(payload, { headers: { ...cors, ...cacheHeader } });
  },
} satisfies ExportedHandler<Env>;
