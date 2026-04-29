# trending-detector — Cloudflare Worker Cron

Vigila tendencias relevantes para fútbol infantil (Google Trends ES + RSS de federaciones) y notifica al editor por Discord cuando aparece algo nuevo.

> Inspirado en `bts-trending` del repo de Victoria, pero **100% gratis** — sin RapidAPI, sin SMTP, sin servicios de pago.

## Coste

- **Cloudflare Workers free tier:** 100k requests/día (necesitamos ~1/día → margen brutal)
- **Cloudflare KV free tier:** 100k lecturas/día, 1k escrituras/día (suficiente)
- **Discord webhook:** gratis ilimitado (rate limit 30 req/min)
- **Google Trends RSS:** público, sin auth
- **RSS de federaciones:** público

**Total: 0€/mes.**

## Setup (5 minutos)

### 1. Discord webhook

1. En tu servidor de Discord (o el privado que sea), edita un canal → Integraciones → Webhooks → New webhook → copia URL
2. Si no tienes Discord, créate cuenta gratis y un servidor personal (1 click)

### 2. Instalar dependencias

```bash
cd workers/trending-detector
pnpm install
```

### 3. Crear KV namespace

```bash
npx wrangler login   # primer uso
npx wrangler kv namespace create SEEN_TRENDS
npx wrangler kv namespace create SEEN_TRENDS --preview
```

Copia los IDs devueltos a `wrangler.toml` reemplazando `REEMPLAZAR_TRAS_CREAR_KV` y `REEMPLAZAR_TRAS_CREAR_KV_PREVIEW`.

### 4. Configurar Discord webhook como secret

```bash
npx wrangler secret put DISCORD_WEBHOOK_URL
# Pegas la URL cuando lo pida
```

### 5. Deploy

```bash
pnpm deploy
```

Cron arranca solo (cada día a las 09:00 UTC = 10:00 invierno / 11:00 verano Madrid).

### 6. Test inmediato (sin esperar al cron)

```bash
curl https://minigolclub-trending.<TU-SUBDOMAIN>.workers.dev/
pnpm tail   # ver logs en directo
```

## Configuración

### Editar feeds RSS o queries

Editar `wrangler.toml`:

```toml
[vars]
RSS_FEEDS = '["https://www.rfef.es/rss/news","https://www.fcf.cat/feed/","..."]'
TRENDS_QUERIES = '["fútbol infantil","Mundial 2026","..."]'
```

Después: `pnpm deploy`.

### Cambiar frecuencia del cron

`wrangler.toml`:

```toml
[triggers]
crons = ["0 9 * * *"]      # diario 09:00 UTC (default)
# crons = ["0 9,18 * * *"] # 2 veces al día
# crons = ["0 */6 * * *"]  # cada 6 horas
```

### Ajustar palabras clave de relevancia

`src/index.ts` → constante `RELEVANT_TERMS`. Filtro positivo: si el título RSS contiene alguna palabra, se considera relevante para nuestro nicho.

## Cómo funciona

```
[Cron diario 09:00 UTC]
       │
       ├─ fetch Google Trends RSS España
       ├─ fetch cada RSS feed configurado
       ├─ filtra items por palabras clave (fútbol infantil)
       ├─ comprueba KV: ¿ya notificado en últimos 30 días?
       ├─ envía 1 mensaje Discord con embeds (1 por fuente)
       └─ marca items como vistos en KV (TTL 30d)
```

## Anti-spam

- KV `SEEN_TRENDS` con TTL 30 días: si el mismo trend reaparece, NO se re-notifica (excepto si pasaron 30 días)
- Filtro `RELEVANT_TERMS`: ignora items off-topic (tenis, política, etc)
- 1 solo mensaje Discord por ejecución, agrupado por fuente con embeds (no spam de N mensajes)

## Troubleshooting

**No llegan mensajes**
- Verifica el webhook con `curl`: `curl -X POST -H 'content-type: application/json' -d '{"content":"test"}' "$DISCORD_WEBHOOK_URL"`
- Mira logs: `pnpm tail`

**Demasiados items irrelevantes**
- Restringir `RELEVANT_TERMS` o añadir un filtro negativo (`IGNORE_TERMS`)

**El cron no corre**
- En Cloudflare dashboard → Workers → tu worker → Triggers → ver "next scheduled invocation"
- En repos sin actividad >60 días los crons se pausan; cualquier deploy los reactiva

**RSS feed cambia formato**
- `fast-xml-parser` es flexible; si un feed devuelve formato raro, mira el output con `wrangler tail` y ajusta el parsing en `fetchRss`

## Roadmap futuro (no en v1)

- Detector de hashtags trending Instagram (requiere RapidAPI ~30€/mes — hold)
- Análisis de cuentas Twitter/X de federaciones via Nitter RSS (gratis pero inestable)
- LLM ranking de items por relevancia/oportunidad de contenido (Claude API)
- Generación automática de borrador de post en `calendar.json` para items top
