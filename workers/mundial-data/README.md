# mundial-data · Worker

Backend que sirve **partidos, tablas y goleadores** del Mundial 2026 a la página
`/mundial-2026/` (componente `<ResultadosLive />` en `src/components/mundial/`).

Aísla el frontend de la API de [football-data.org](https://www.football-data.org/):
- Cachea respuestas en KV para no consumir cuota.
- Si la API cae o el token expira, devuelve datos mock embebidos.
- CORS configurado por allowlist.

## Endpoints

| Método | Ruta | Respuesta |
|---|---|---|
| `GET /` | — | `{ partidos, tablas, goleadores, lastUpdate, source }` |
| `GET /partidos` | — | solo partidos |
| `GET /tablas` | — | solo tablas |
| `GET /goleadores` | — | solo goleadores |

`source` es `"football-data"` (datos reales) o `"mock"` (fallback). El
frontend muestra una etiqueta "DATOS DE PRUEBA" si `source === 'mock'` para
que nunca veas marcadores inventados sin advertencia.

## Setup inicial — UNA VEZ

```bash
cd workers/mundial-data
pnpm install
pnpm exec wrangler whoami   # debe responder con tu cuenta de Cloudflare

# Crear el KV namespace y pegar el id devuelto en wrangler.toml
pnpm exec wrangler kv namespace create MUNDIAL_DATA_CACHE
```

Sustituir `REEMPLAZAR_TRAS_CREAR_KV` en `wrangler.toml` por el `id` devuelto.

## Deploy (modo mock — funciona ya, sin token)

```bash
pnpm deploy
```

El worker se publica con `DATA_SOURCE="mock"` y devuelve datos mock. Útil
para validar la UI end-to-end sin tocar football-data.org.

**Configurar la URL en el frontend** (variable de entorno de Cloudflare
Workers Settings del proyecto principal, igual que `PUBLIC_ENCUESTA_API_URL`):

```
PUBLIC_MUNDIAL_API_URL=https://minigolclub-mundial-data.<tu-subdominio>.workers.dev
```

## Activar datos reales (cuando tengas el token de football-data.org)

1. Registra una cuenta gratuita en https://www.football-data.org/client/register.
2. Te llega el token por email en 1-3 días.
3. Guárdalo como secret del Worker (NO en wrangler.toml — no se commitea):

   ```bash
   pnpm secret:token
   # se abre el prompt → pega el token
   ```

4. Cambia `DATA_SOURCE` en `wrangler.toml` a `"football-data"`.
5. Re-deploy:

   ```bash
   pnpm deploy
   ```

A partir de ese momento el Worker hace fetch real cada vez que el cache KV
expira (60s default). Si la API responde error/timeout, fallback automático
al mock — el frontend nunca se rompe.

## Verificar

```bash
# Smoke test
curl https://minigolclub-mundial-data.<sub>.workers.dev/
# Debería devolver JSON con partidos, tablas, goleadores y lastUpdate.

# Verificar cache headers
curl -I https://minigolclub-mundial-data.<sub>.workers.dev/
# Cache-Control: public, max-age=60, s-maxage=60
```

## Cuota de football-data.org (free tier)

- **10 req/min**, **100 req/día**.
- Con TTL 60s tenemos como máximo 1 req/min al backend → cabe 10× holgado.
- Si en algún momento subes el TTL a 30s, sigues dentro de 2 req/min × 60min ×
  24h = 2.880 req/día → **EXCEDE el límite diario**. NO bajar de 60s en free
  tier salvo que pagues plan.

## Decisiones de diseño

- **TTL único de 60s para simplicidad.** En el futuro se podría refinar:
  TTL más corto (15-30s) durante partidos live, TTL más largo (5min) entre
  jornadas. Bajaría latencia percibida durante live. Posponer hasta que
  vea uso real.
- **Sin polling server-side.** El frontend polea cada 30s cuando hay live
  matches. El Worker no necesita scheduler — todas las requests son
  on-demand a través de KV cache.
- **Mock siempre disponible como fallback.** Filosofía: la página de niños
  no se rompe nunca por un servicio externo. Si veo el badge "DATOS DE
  PRUEBA" en producción durante el torneo, es señal de que hay que
  investigar el Worker (token expirado, cuota agotada, etc.).
- **Tipos del worker espejo de `src/lib/mundial/types.ts`** — no comparto
  paquete entre worker y frontend porque añadiría un build step. Si cambia
  un tipo en uno, actualizar el otro a mano.
