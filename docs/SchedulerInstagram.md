# Scheduler Instagram Graph API — guía de uso

> Sistema de publicación programada a Instagram. Source of truth: `content/social/calendar.json`.
> Migrado desde Publer (ver historia git) tras fallos persistentes con la API de Publer; ahora publicamos directo contra **Instagram Graph API** de Meta para tener errores claros y eliminar intermediarios de pago.

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
        │  filtra approved con scheduled_at en window (120min)
        ▼
scripts/social/instagram-graph-client.mjs
        │  POST /{ig-user-id}/media           (crear container)
        │  GET  /{container-id}?fields=status  (polling para vídeo)
        │  POST /{ig-user-id}/media_publish    (publicar)
        ▼
Instagram (cuenta @minigolclub) — post aparece en feed/reels
        │
        ▼
git commit "chore(social): scheduler ... — actualizar status"
        (status: approved → published / failed)
```

**Decisiones clave:**
- **JSON en Git como source of truth.** No `localStorage`, no DB. Cada cambio audita por git log y revisa por PR.
- **Aprobación humana = merge a main.** Un post solo se publica si está `status: approved` y mergeado.
- **Instagram Graph API directa.** Sin intermediarios. Errores con `code`/`subcode`/`fbtrace_id`. Gratis.
- **Solo Instagram por ahora.** Para TikTok/Pinterest/X habría que añadir clientes separados. La estrategia social actual es IG-only.
- **Assets vía raw GitHub.** Las imágenes/vídeos viven en `public/social/...` y Meta los descarga vía `raw.githubusercontent.com/<repo>/main/...`.

---

## Setup inicial (una vez)

### 1. Cuenta IG Business + Facebook Page

Requisito ineludible de Instagram Graph API:

1. **@minigolclub debe ser Business o Creator.** En la app IG → Configuración → Cuenta → Cambiar a cuenta profesional → Business (recomendado) o Creator.
2. **Vincularla a una Página de Facebook.** En IG → Configuración → Centro de Cuentas → Cuentas → Añadir cuenta de Facebook → seleccionar/crear una Página (no perfil personal). Si no tienes Página, créala — puede ser una página "fantasma" si solo la usas como intermediario.

### 2. Crear app de Meta

1. Ve a https://developers.facebook.com/apps y crea una nueva app:
   - Tipo: **Business**.
   - Nombre: ej. "MiniGol Club Scheduler".
2. En el panel de la app → **Add Product** → "Instagram Graph API" → Configurar.
3. **Roles:** asegúrate de que tu cuenta Meta esté como Admin/Developer/Tester de la app. Mientras la app esté en modo desarrollo, solo los roles pueden usarla — pero para publicar a tu propia IG Business eso es suficiente; **no necesitas App Review** (Meta solo lo exige cuando publicas a cuentas IG de terceros).

### 3. Obtener el Access Token

1. Ve a **Tools → Graph API Explorer** (en el menú lateral del panel de la app).
2. Selecciona tu app en el dropdown superior.
3. Pulsa "Generate Access Token" → marca estos permisos:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_show_list`
   - `pages_read_engagement`
4. Autoriza el flujo. Te dará un **User Access Token corto** (~1h).
5. **Conviértelo a long-lived (60 días)** con un curl:

```bash
curl -G "https://graph.facebook.com/v21.0/oauth/access_token" \
  -d "grant_type=fb_exchange_token" \
  -d "client_id={APP_ID}" \
  -d "client_secret={APP_SECRET}" \
  -d "fb_exchange_token={SHORT_TOKEN}"
```

Te devuelve `{ access_token: "EAA...", expires_in: 5183999 }` — ese es el long-lived (válido 60 días).

> **Opcional (recomendado a medio plazo):** generar un **System User Token** desde Business Manager. No expira nunca, pero requiere Business Manager activo. Mientras tanto, refrescaremos el long-lived cada ~50 días.

### 4. Obtener el IG Business Account ID

No es el username ni el ID de la Página. Es un ID interno de Instagram. Para descubrirlo:

```bash
# 1. Lista las Páginas que tu usuario administra
curl "https://graph.facebook.com/v21.0/me/accounts?access_token={LONG_LIVED_TOKEN}"

# Output: { data: [{ id: "1234567890", name: "MiniGol Club", ... }] }

# 2. Pide el IG Business Account vinculado a esa Página
curl "https://graph.facebook.com/v21.0/{PAGE_ID}?fields=instagram_business_account&access_token={LONG_LIVED_TOKEN}"

# Output: { instagram_business_account: { id: "17841400000000000" }, id: "1234567890" }
```

El `instagram_business_account.id` (formato `17841...`) es tu `IG_BUSINESS_ACCOUNT_ID`.

### 5. Configurar secrets en GitHub

En `Settings → Secrets and variables → Actions → Repository secrets` añade:

| Secret | Valor |
|---|---|
| `IG_ACCESS_TOKEN` | El long-lived token del paso 3 |
| `IG_BUSINESS_ACCOUNT_ID` | El ID del paso 4 |
| `BOT_PAT` | Ya existe — fine-grained PAT del owner con Contents:write |

Los secrets de Publer (`PUBLER_API_KEY`, `PUBLER_WORKSPACE_ID`, `PUBLER_ACCOUNT_*`) pueden borrarse — ya no se usan.

### 6. Validar localmente antes de mergear

```powershell
$env:IG_ACCESS_TOKEN="EAA..."
$env:IG_BUSINESS_ACCOUNT_ID="17841..."
pnpm social:validate-ig
```

Debe imprimir:
- ✅ Cuenta IG accesible (username, name, followers, media count)
- ✅ Token info (scopes, expiración, app_id)
- 🎉 Configuración válida

Si algo falla, te dice exactamente qué (ej. "falta permiso instagram_content_publish" o "cuenta no es Business").

---

## Workflow editorial diario

1. Editar `content/social/calendar.json` (o desde admin local, pestaña Social Calendar).
2. Para cada post: ajustar `caption`, `hashtags`, `scheduled_at`, `media[].path`.
3. Cambiar `status` a `approved` cuando esté listo.
4. Click "Commitear" en el admin → PR auto-creado y auto-mergeado cuando CI pase.
5. El cron de cada 30min ve los posts due y publica vía Graph API.
6. El cron commitea el calendar actualizado (`status: published`, `instagram_media_id` rellenado).

---

## Formatos soportados

| `format` del post | Comportamiento |
|---|---|
| `single_image` | POST media (image_url) → POST media_publish. Inmediato. |
| `carousel` (2-10 items) | POST N child containers → POST carousel container → publish. Si solo hay 1 media, cae a single_image. |
| `reel` o `video` | POST media (REELS, video_url) → polling status_code hasta FINISHED → publish. `share_to_feed=true` por defecto (también aparece en feed). |
| `story` | No soportado por Graph API para apps Business sin permisos extra. Pendiente. |
| `text` | Instagram no acepta texto sin media. Rechazado. |

---

## Troubleshooting

**`OAuthException code=190 (subcode=460)` — Token expirado**
- El long-lived caducó (60 días). Regenera siguiendo el paso 3.

**`code=200 subcode=2207003` — Permission missing**
- El token no tiene `instagram_content_publish`. Regenera con el permiso marcado.

**`code=100` — Invalid parameter**
- La imagen no cumple requisitos IG: ratio (1:1, 4:5 o 1.91:1), tamaño máx 8MB, formato JPEG.
- O la URL del asset no es accesible públicamente (404, redirect, etc.). Prueba `curl -I` la URL.

**`Container ... status=ERROR: ...` durante reel**
- Vídeo no cumple requisitos: ≤90s para Reels, MP4/MOV, codec H.264, audio AAC.
- IG devuelve mensaje específico en `error_message` del status; queda en `post.error`.

**`scheduled_at más de 120min en el pasado al evaluar`**
- El operador aprobó un post cuyo `scheduled_at` ya pasó hace más de 120min y el cron no llegó a tiempo. Re-aprobar con nueva fecha.

**El cron commitea pero no publica nada**
- Significa que el step de `Ejecutar scheduler` falló y el step de commit (con `always()`) persiste el calendar con `status: failed` y el `error` específico.
- Mira el log del run en Actions.

---

## Token refresh (manual por ahora)

Cada ~50 días, regenerar el long-lived:

```bash
curl -G "https://graph.facebook.com/v21.0/oauth/access_token" \
  -d "grant_type=fb_exchange_token" \
  -d "client_id={APP_ID}" \
  -d "client_secret={APP_SECRET}" \
  -d "fb_exchange_token={CURRENT_LONG_LIVED}"
```

Y actualizar el secret `IG_ACCESS_TOKEN` en GitHub.

> **TODO futuro:** workflow `social-token-refresh.yml` que corra cada 50 días, refresque y rote el secret automáticamente vía API de GitHub. O migrar a System User Token (no expira).

---

## Comparativa con setup anterior (Publer)

| Aspecto | Publer (anterior) | Graph API (actual) |
|---|---|---|
| Coste | ~15€/mes | Gratis |
| Errores | 500 genérico opaco | `code/subcode/message/fbtrace_id` |
| Setup | API key + Workspace + per-account IDs | App Meta + Token + IG Business Account ID |
| Multi-red | IG/TikTok/Pinterest/FB/X en una llamada | Solo IG (otras redes = otros clientes) |
| Token TTL | Sin TTL explícito (auth Bearer-API) | 60 días (long-lived) o nunca (system user) |
| Dependencia externa | Sí (servicio de terceros) | Solo Meta (oficial) |
