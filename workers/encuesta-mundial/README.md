# encuesta-mundial · Worker

Backend de la encuesta "¿quién crees que ganará el Mundial 2026?" que vive
en `src/components/mundial/EncuestaCampeon.tsx`. Cloudflare Worker + KV.

## Endpoints

| Método | Body | Respuesta |
|---|---|---|
| `GET /` | — | `{ counts: { ISO3: número }, total: número }` |
| `POST /` | `{ "team": "ISO3" }` | `{ changed: bool, vote: ISO3, counts, total }` |
| `OPTIONS /` | — | CORS preflight |

Solo acepta los 48 ISO3 del torneo (lista en `src/index.ts`). Cualquier
otro código devuelve `400`.

## Anti-spam

Hash `SHA-256(IP|User-Agent)` truncado a 16 bytes. Un voto por dispositivo.
Si vota de nuevo, el contador del equipo anterior se decrementa y el del
nuevo se incrementa (cambio de pronóstico). TTL del registro de votante:
`VOTER_TTL_DAYS` (default 90 días).

## Setup inicial — UNA VEZ

```bash
cd workers/encuesta-mundial
pnpm install

# Login en Cloudflare (si no lo estás)
pnpm exec wrangler login

# Crear el KV namespace y anotar el `id` devuelto
pnpm exec wrangler kv namespace create ENCUESTA_MUNDIAL
# Salida ejemplo:
#   [[kv_namespaces]]
#   binding = "ENCUESTA_MUNDIAL"
#   id = "abc123def456..."

# Pegar el `id` en wrangler.toml sustituyendo `REEMPLAZAR_TRAS_CREAR_KV`
```

## Deploy

```bash
pnpm deploy
# Wrangler imprime la URL del worker, p.ej.:
#   https://minigolclub-encuesta-mundial.<tu-subdominio>.workers.dev/
```

## Configurar el frontend

Añadir a `.env` (local dev) o a las variables de entorno del despliegue de
Astro la URL del Worker desplegado:

```
PUBLIC_ENCUESTA_API_URL=https://minigolclub-encuesta-mundial.<tu-subdominio>.workers.dev
```

Si la variable está vacía o el Worker no responde, el componente cae en
modo **offline** (localStorage + seed counts mock). Ningún breaking change.

### Opcional: dominio propio

Para evitar CORS y servir desde `minigolclub.com/api/encuesta-campeon`:

1. Descomentar el bloque `[[routes]]` en `wrangler.toml`.
2. Re-deploy.
3. Cambiar `PUBLIC_ENCUESTA_API_URL` a `https://minigolclub.com/api/encuesta-campeon`.

## Verificar

```bash
# GET counts (debería devolver los seed counts hasta el primer voto real)
curl https://minigolclub-encuesta-mundial.<sub>.workers.dev/

# POST voto
curl -X POST -H "Content-Type: application/json" \
  -d '{"team":"ARG"}' \
  https://minigolclub-encuesta-mundial.<sub>.workers.dev/
```

## Mantener en sync

Tres constantes deben coincidir entre Worker y frontend. Si cambias una,
cambia las otras:

| Worker | Frontend |
|---|---|
| `TOURNAMENT_TEAMS` en `src/index.ts` | `SELECCIONES_DEL_TORNEO` (derivado de `src/lib/mundial/grupos.ts`) |
| `INITIAL_COUNTS` en `src/index.ts` | `INITIAL_COUNTS` en `src/components/mundial/EncuestaCampeon.tsx` |

## Decisiones de diseño

- **KV en vez de Durable Objects:** simplicidad. KV no es atómico para
  read-then-write, así que dos votos simultáneos al mismo equipo pueden
  perder uno. Para nuestro volumen esperado (~cientos/día) es aceptable.
  Migrar a DO si se vuelve viral.
- **Seed hardcoded en KV-less reads:** si KV no tiene una key, el GET
  devuelve el valor de `INITIAL_COUNTS`. Esto evita "0 votos para todos"
  cuando se despliega y arranca la encuesta. Tras el primer voto a un
  país, KV manda.
- **Sin auth, sin captcha:** es una encuesta lúdica de fútbol infantil.
  Bypass posible con VPN/incognito — coste-beneficio claramente a favor
  de la simplicidad.
- **CORS por allowlist** — no `*`. Si añades dominios (preview deploys
  con .pages.dev, etc.) los listas en `ALLOWED_ORIGINS` en `wrangler.toml`.
