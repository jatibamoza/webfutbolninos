/**
 * trending-detector Worker
 *
 * Cron diario que vigila tendencias relevantes para fútbol infantil
 * y notifica al editor por Discord cuando aparece algo nuevo.
 *
 * FUENTES (todo gratis):
 * 1. Google Trends Daily Trends RSS — top búsquedas del día en España
 * 2. Feeds RSS de federaciones (RFEF, FCF, UEFA Champions...)
 *
 * NOTIFICACIÓN: Discord webhook (gratis, 30 mensajes/min límite).
 *
 * ANTI-SPAM: KV `SEEN_TRENDS` guarda IDs ya notificados (TTL 30 días).
 *
 * NO requiere APIs de pago. NO requiere SMTP. NO requiere apenas auth.
 */

import { XMLParser } from 'fast-xml-parser';

interface Env {
  DISCORD_WEBHOOK_URL: string;
  TRENDS_QUERIES: string;
  RSS_FEEDS: string;
  TRENDS_THRESHOLD: string;
  SEEN_TRENDS: KVNamespace;
}

interface TrendItem {
  source: 'google-trends' | 'rss';
  feedName: string;
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
  // Hash estable para deduplicación
  id: string;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@',
  textNodeName: '#text',
});

// Palabras clave que SÍ nos interesan (filtro positivo) — si el item las
// contiene en el título, lo consideramos relevante para fútbol infantil.
const RELEVANT_TERMS = [
  'niño', 'niña', 'infantil', 'cantera', 'base',
  'sub-', 'sub ', 'juvenil', 'mundial', 'champions', 'laliga',
  'futbol', 'fútbol', 'balón', 'pelota', 'cadete', 'alevín', 'benjamín',
  'escuela', 'pequeño', 'pequena', 'pequeños',
];

function isRelevant(text: string): boolean {
  const lower = text.toLowerCase();
  return RELEVANT_TERMS.some((t) => lower.includes(t));
}

/**
 * SHA-256 hex del input — para IDs estables sin coleccionar.
 */
async function hash(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Google Trends — feed diario top de búsquedas de España.
 * URL pública sin auth: trends.google.com/trends/trendingsearches/daily/rss?geo=ES
 */
async function fetchGoogleTrendsES(): Promise<TrendItem[]> {
  const url = 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=ES';
  const out: TrendItem[] = [];
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': 'minigolclub-trending-bot/1.0 (+https://minigolclub.com)' },
      cf: { cacheTtl: 1800 },
    });
    if (!res.ok) {
      console.warn(`Google Trends ${res.status}`);
      return out;
    }
    const xml = await res.text();
    const data = parser.parse(xml);
    const items = data?.rss?.channel?.item ?? [];
    const arr = Array.isArray(items) ? items : [items];
    for (const it of arr) {
      const title = (it.title ?? '').toString().trim();
      if (!title || !isRelevant(title)) continue;
      const description = (it.description ?? '').toString().slice(0, 280);
      const link = (it.link ?? '').toString();
      const id = await hash(`gt:${title}`);
      out.push({
        source: 'google-trends',
        feedName: 'Google Trends ES',
        title,
        link: link || `https://www.google.com/search?q=${encodeURIComponent(title)}&gl=es`,
        description,
        pubDate: it.pubDate?.toString(),
        id,
      });
    }
  } catch (e) {
    console.error('Google Trends error', e);
  }
  return out;
}

/**
 * Feed RSS genérico (federación, liga, web oficial). Filtra por relevancia.
 */
async function fetchRss(feedUrl: string): Promise<TrendItem[]> {
  const out: TrendItem[] = [];
  try {
    const res = await fetch(feedUrl, {
      headers: { 'user-agent': 'minigolclub-trending-bot/1.0 (+https://minigolclub.com)' },
      cf: { cacheTtl: 3600 },
    });
    if (!res.ok) {
      console.warn(`RSS ${feedUrl} ${res.status}`);
      return out;
    }
    const xml = await res.text();
    const data = parser.parse(xml);
    const items = data?.rss?.channel?.item ?? data?.feed?.entry ?? [];
    const arr = Array.isArray(items) ? items : [items];
    const feedName = data?.rss?.channel?.title ?? data?.feed?.title ?? new URL(feedUrl).hostname;

    for (const it of arr.slice(0, 20)) {
      const title = (it.title?.['#text'] ?? it.title ?? '').toString().trim();
      if (!title || !isRelevant(title)) continue;
      const link = (it.link?.['@href'] ?? it.link ?? '').toString();
      const desc = (it.description ?? it.summary?.['#text'] ?? it.summary ?? '').toString().slice(0, 280);
      const id = await hash(`rss:${feedUrl}:${title}`);
      out.push({
        source: 'rss',
        feedName: feedName.toString(),
        title,
        link,
        description: desc,
        pubDate: it.pubDate?.toString() ?? it.published?.toString(),
        id,
      });
    }
  } catch (e) {
    console.error(`RSS ${feedUrl}`, e);
  }
  return out;
}

/**
 * Filtrar items ya notificados (los buscamos en KV).
 */
async function filterUnseen(items: TrendItem[], kv: KVNamespace): Promise<TrendItem[]> {
  const fresh: TrendItem[] = [];
  for (const it of items) {
    const seen = await kv.get(`seen:${it.id}`);
    if (!seen) fresh.push(it);
  }
  return fresh;
}

/**
 * Marca items como vistos (TTL 30 días → si reaparecen tras 30d, re-notifican).
 */
async function markSeen(items: TrendItem[], kv: KVNamespace): Promise<void> {
  const ttl = 60 * 60 * 24 * 30; // 30 días
  await Promise.all(
    items.map((it) => kv.put(`seen:${it.id}`, '1', { expirationTtl: ttl })),
  );
}

/**
 * Notifica a Discord. Formato compacto, 1 mensaje por batch (no spammeamos
 * con 1 por item — reducimos rate limit risk).
 */
async function notifyDiscord(webhook: string, items: TrendItem[]): Promise<void> {
  if (items.length === 0) return;
  if (!webhook) {
    console.warn('DISCORD_WEBHOOK_URL no configurado, skip notify');
    return;
  }

  // Discord embed: 1 embed = 1 fuente, fields = items
  const bySource = new Map<string, TrendItem[]>();
  for (const it of items) {
    const key = `${it.source}::${it.feedName}`;
    if (!bySource.has(key)) bySource.set(key, []);
    bySource.get(key)!.push(it);
  }

  const embeds = Array.from(bySource.entries()).slice(0, 10).map(([key, arr]) => ({
    title: `🔥 ${arr[0]?.feedName ?? key}`,
    color: arr[0]?.source === 'google-trends' ? 0xfacc15 : 0x2563eb,
    fields: arr.slice(0, 25).map((it) => ({
      name: it.title.slice(0, 256),
      value: `[abrir](${it.link}) · ${(it.description ?? '').slice(0, 100)}`.slice(0, 1024),
    })),
    footer: { text: 'minigolclub.com · trending detector' },
    timestamp: new Date().toISOString(),
  }));

  const body = {
    content: `**Nuevas tendencias detectadas** — ${items.length} items relevantes para fútbol infantil`,
    embeds,
  };

  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error(`Discord webhook ${res.status}`, await res.text());
  }
}

export default {
  // Cron entrypoint (definido en wrangler.toml)
  async scheduled(_controller: ScheduledController, env: Env, _ctx: ExecutionContext) {
    const startedAt = Date.now();
    const allItems: TrendItem[] = [];

    // 1. Google Trends ES
    allItems.push(...(await fetchGoogleTrendsES()));

    // 2. Feeds RSS configurados
    const feeds = JSON.parse(env.RSS_FEEDS ?? '[]') as string[];
    const rssResults = await Promise.all(feeds.map((f) => fetchRss(f)));
    for (const arr of rssResults) allItems.push(...arr);

    console.log(`Detected ${allItems.length} relevant items in ${Date.now() - startedAt}ms`);

    // 3. Filtrar ya vistos
    const fresh = await filterUnseen(allItems, env.SEEN_TRENDS);
    console.log(`Fresh: ${fresh.length}`);

    if (fresh.length === 0) return;

    // 4. Notificar a Discord
    await notifyDiscord(env.DISCORD_WEBHOOK_URL, fresh);

    // 5. Marcar como vistos
    await markSeen(fresh, env.SEEN_TRENDS);
  },

  // Entry HTTP para test manual: GET / → ejecuta el scan en directo
  async fetch(_req: Request, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(this.scheduled({} as ScheduledController, env, ctx));
    return new Response('Scan iniciado en background. Mira los logs con `wrangler tail`.', {
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  },
};
