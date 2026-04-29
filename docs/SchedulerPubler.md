# Scheduler Publer — guía de uso

> Sistema de publicación programada a redes sociales. Source of truth: `content/social/calendar.json`.
> Inspirado en el repo `victorialozano0/LOVEYOURSELFJOURNAL` adaptado a nuestro stack
> (GitHub Actions + JSON versionado en Git, sin app local con `localStorage`).

---

## Arquitectura

```
content/social/calendar.json   ← editor (humano) escribe aquí, status: draft → approved
        │
        ▼
.github/workflows/social-scheduler.yml
        │  cada 30 min
        ▼
scripts/social/scheduler.mjs
        │  filtra approved con scheduled_at en ventana
        ▼
scripts/social/publer-client.mjs
        │  POST /api/v1/posts/schedule/publish
        ▼
Publer API → distribuye a Instagram/TikTok/Pinterest/...
        │
        ▼
git commit "chore(social): scheduler ... — actualizar status"
        (status: approved → published / failed)
```

**Decisiones clave:**
- **JSON en Git como source of truth.** No `localStorage`, no DB. Cada cambio audita por git log y revisa por PR.
- **Aprobación humana = merge a main.** No hay toggle "publish now" — un post solo se publica si está `status: approved` y mergeado.
- **Publer como capa de publicación.** Evita meses de aprobación oficial Meta/TikTok. ~15€/mes.
- **Assets en el repo + raw GitHub.** Mientras no haya CDN propio, las imágenes/vídeos del calendar viven en `public/social/...` y Publer las descarga vía `raw.githubusercontent.com`.

---

## Setup inicial (una vez)

### 1. Crear cuenta Publer y conectar redes

1. Cuenta **Business** en [publer.com](https://publer.com) — el plan Professional NO incluye API access. Hay trial gratis 14 días.
2. **Workspace ID:** consíguelo via API (ver paso 2 abajo) o desde la URL del workspace en la UI.
3. **Accounts** — conectar `@minigolclub` Instagram (debe ser cuenta Creator o Business, no Personal). Publer redirige a Facebook OAuth porque Instagram requiere conexión via Facebook Page.
4. **Settings → Access & Login → Manage API Keys → Generate API Key** — scopes: Workspaces, Accounts, Posts (write), Media (write). Copia la key INMEDIATAMENTE (solo se muestra 1 vez).

### 2. Descubrir account IDs

Cada red social conectada tiene un Account ID interno de Publer. Para descubrirlos:

```bash
PUBLER_API_KEY=tu_token PUBLER_WORKSPACE_ID=tu_workspace_id pnpm social:accounts
```

Salida esperada:

```
  • [instagram ] @minigolclub  →  64a1f9...
  • [tiktok    ] @minigolclub  →  64a200...
  • [pinterest ] minigolclub   →  64a201...
```

### 3. Configurar secrets en GitHub

`Settings → Secrets and variables → Actions → New repository secret`:

| Secret | Valor |
|--------|-------|
| `PUBLER_API_KEY` | El token Bearer-API del paso 1 |
| `PUBLER_WORKSPACE_ID` | El UUID del workspace |
| `PUBLER_ACCOUNT_INSTAGRAM` | Account ID de @minigolclub |
| `PUBLER_ACCOUNT_TIKTOK` | (opcional) Account ID TikTok |
| `PUBLER_ACCOUNT_PINTEREST` | (opcional) |
| `PUBLER_ACCOUNT_FACEBOOK` | (opcional) |
| `PUBLER_ACCOUNT_X` | (opcional) |
| `PUBLER_ACCOUNT_LINKEDIN` | (opcional) |
| `PUBLER_ACCOUNT_YOUTUBE` | (opcional) |

`Variables` (públicas, no secretos):

| Variable | Valor por defecto | Uso |
|----------|-------------------|-----|
| `ASSETS_BASE_URL` | (vacío → usa raw.githubusercontent) | Si tienes CDN propio (Cloudflare R2, Bunny CDN), pon aquí la URL base de los assets |

### 4. Verificar local (opcional)

```bash
pnpm social:validate              # valida calendar.json contra schema
pnpm social:dry                   # corre el scheduler sin tocar Publer ni JSON
```

---

## Flujo editorial diario

### Crear un nuevo post

1. Genera o sube el asset a `public/social/<slug-articulo>/<archivo>.{jpg,mp4}`
2. Edita `content/social/calendar.json` añadiendo un objeto al array `posts`:

```json
{
  "id": "2026-05-10-ig-jocs-aniversaris",
  "platforms": ["instagram"],
  "format": "carousel",
  "scheduled_at": "2026-05-10T19:00:00+02:00",
  "status": "draft",
  "locale": "ca",
  "article_slug": "jocs-futbol-aniversaris-nens",
  "target_url": "https://minigolclub.com/ca/juegos/jocs-futbol-aniversaris-nens/?utm_source=instagram&utm_medium=carousel&utm_campaign=jocs-aniversaris",
  "caption": "10 jocs de futbol per a l'aniversari del teu fill — sense crits, sense pares competint, només divertir-se.\n\nLlista completa al link de la bio 👆",
  "hashtags": ["futbolinfantil", "aniversari", "festainfantil", "futbolcatalunya", "pares"],
  "media": [
    { "type": "image", "path": "public/social/jocs-aniversaris/slide-1.jpg", "alt": "10 jocs aniversari" }
  ],
  "notes": "Carrusel 10 slides, uno por joc. Color marca naranja.",
  "published_at": null,
  "publer_post_id": null
}
```

3. **Convención de `id`:** `YYYY-MM-DD-<plataforma>-<slug-corto>` — único, kebab-case.
4. **`scheduled_at`:** ISO 8601 con timezone (`+02:00` Madrid en verano, `+01:00` invierno).
5. **`status: "draft"`** — el scheduler IGNORA los drafts. Solo publica `approved`.
6. Valida en local: `pnpm social:validate`.

### Aprobar y publicar

1. Cuando esté listo, cambia `"status": "draft"` → `"status": "approved"`.
2. Commit + PR + merge a `main`.
3. En el siguiente cron (max 30min) el workflow lo programará en Publer.
4. Tras éxito, el bot commiteará el cambio: `status: approved` → `published`, con `published_at` y `publer_post_id` rellenados.
5. Si falla, `status: failed` con `error` describiendo el motivo. Editor revisa, corrige y re-aprueba.

### Cancelar un post programado

1. En GitHub, edita el JSON: `status` → `archived`.
2. Si Publer YA tiene el post programado (`publer_post_id` existe), bórralo manualmente desde el dashboard de Publer.

### Forzar ejecución del scheduler

Sin esperar al cron:

`Actions → Social Scheduler → Run workflow → branch: main → Run workflow`

Marca `dry_run: true` si solo quieres loggear sin tocar Publer.

---

## Estrategia horaria (adaptada del POSTING_STRATEGY de LYJ)

Audiencia objetivo: padres 30-45 en España y LATAM.

| Plataforma | Mejores ventanas (Madrid TZ) | Frecuencia recomendada inicio |
|------------|------------------------------|-------------------------------|
| Instagram Reels | Mar/Jue/Sáb 19:00–21:00 | 1-2/semana |
| Instagram Carousel | Lun/Mié/Vie 18:00–20:00 | 1/semana |
| Instagram Story | Diario 09:00 ó 21:00 | 3-5/semana |
| TikTok | Mar/Jue 20:00–22:00 | 1-2/semana |
| Pinterest | Sáb/Dom mañana 10:00–12:00 | 2-3/semana |

Ajustar tras 4 semanas con datos reales del Insights de cada plataforma.

---

## Costes

| Item | Coste mensual |
|------|---------------|
| Publer Business (3 cuentas, posts ilimitados) | ~15€ |
| GitHub Actions minutos (estimado <30 min/mes) | gratis (free tier 2000 min/mes) |
| Cloudflare Workers (futuro: trending detector) | gratis (100k req/día free tier) |
| Storage assets (raw GitHub) | gratis hasta volumen alto |

---

## Próximas iteraciones

- **Validación CI en PR**: añadir `pnpm social:validate` al workflow `ci.yml` para que cada PR que toque `calendar.json` valide schema antes de mergear.
- **Generador de imágenes sociales con Satori**: script `scripts/social/generate-image.mjs` que toma un slug de artículo y genera la imagen 1080×1080 con cover + título + branding.
- **Worker Cron de tendencias**: replicar `bts-trending` de LYJ para detectar trending hashtags de futbol infantil y notificar al editor.
- **Vista web del calendar**: página interna `/admin/social/` que renderiza el JSON como timeline visual (no necesario para v1).

---

## Troubleshooting

**"Publer schedulePost: no jobId en respuesta"**
La API devolvió 200 pero sin job ID — probablemente la cuenta de Publer no tiene permisos para esa plataforma o el account ID es incorrecto. Verifica con `pnpm social:accounts`.

**"stale post ... — marcando failed"**
El post quedó `approved` con `scheduled_at` >30min en el pasado al evaluar. Posible causa: workflow desactivado por GitHub (los crons en repos públicos sin actividad >60 días se pausan automáticamente). Solución: re-aprobar con nueva fecha futura, o ajustar `--window` si hay outage prolongado.

**Workflow no ejecuta automáticamente**
GitHub pausa crons en repos sin commits durante 60 días. Cualquier commit a main lo reactiva. Para repos privados con plan free tampoco corren workflows si superas la cuota mensual de minutos.
