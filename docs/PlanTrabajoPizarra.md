# Plan de Trabajo — Pizarra Táctica

> Backlog vivo del producto Pizarra Táctica. Las decisiones de fondo viven en
> [docs/ArquitecturaPizarra.md](ArquitecturaPizarra.md). Aquí solo está el "qué hacer y en qué orden".
>
> **Status:** Pendiente de aprobación final del cliente para iniciar Fase 2.

---

## Resumen ejecutivo

| Fase | Alcance | Estimación | Estado |
|---|---|---|---|
| **Fase 2** | MVP gratis, sin pagos, sin cuentas | ≈ 24 h netas en 1 PR | Pendiente de aprobación |
| **Fase 2.5** | Páginas evergreen `/pizarra/<preset>/` | ≈ 8 h en 1 PR | En backlog |
| **Fase 3a** | Cuentas + biblioteca cloud (sin pagos) | ≈ 12 h | En backlog |
| **Fase 3b** | Pagos Lemon Squeezy + paywall activo | ≈ 10 h | En backlog |
| **Fase 3c** | PDF + URLs cortas + oEmbed | ≈ 8 h | En backlog |

**Total Fase 2 + 2.5:** ≈ 32 h. **Total Fase 3 completa:** ≈ 30 h adicionales.

---

## Fase 2 — Pizarra MVP gratis

**Objetivo:** página `/pizarra/` viva, embed en artículo, share por URL, export PNG con marca de agua. Sin paywall, sin persistencia cloud, sin PDF, sin cuentas.

**Entregable:** un único PR a `main`.

**Criterios de aceptación globales:**
- ✅ `pnpm typecheck && pnpm lint && pnpm build` verde.
- ✅ Lighthouse: `/pizarra/` ≥ 80 perf, ≥ 95 a11y, 100 SEO, ≥ 90 best practices.
- ✅ Funciona en mobile real (iPhone Safari + Android Chrome).
- ✅ Share URL → otra pestaña → pizarra idéntica (round-trip serialización).
- ✅ Export PNG visible con marca de agua "minigolclub.com" en esquina inferior.
- ✅ Drag con teclado funcional (tab + flechas).
- ✅ `prefers-reduced-motion` respetado.

### Tareas con dependencias

```
F2.1 ──► F2.2 ──► F2.3
              ├─► F2.4 ──► F2.5 ──► F2.6 ──┬─► F2.7
                                            ├─► F2.8
                                            ├─► F2.9
                                            ├─► F2.10
                                            └─► F2.11 ──► F2.12 ──► F2.13
                                                                         └─► F2.14 ──► F2.15
                                                                                            └─► F2.16
```

| ID | Tarea | Complejidad | Depende de |
|---|---|---|---|
| ✅ F2.1 | ~~Instalar `@astrojs/preact` + `preact` + alias `preact/compat`. Registrar integración en `astro.config.mjs`. Verificar que el build sigue verde.~~ — PR #20 (commit `2d9e3d9`) | baja | — |
| ✅ F2.2 | ~~`core/types.ts` + `core/serialize.ts` (base64-url-safe + Zod) + `core/tween.ts` + `core/geometry.ts`. Tests vitest del round-trip.~~ — 27 tests verdes | media | F2.1 |
| ✅ F2.3 | ~~`core/presets.ts` con los 6 presets del mockup, IDs estables hardcodeados. Schema Zod del preset.~~ — 7 tests verdes incluyendo round-trip serializable | media | F2.2 |
| F2.4 | `primitives/{Field,Player,FieldObject,Arrow,Note}.tsx`. Corregir bug de `FIELD_TYPES.ratio` invertido del mockup. | media | F2.2 |
| F2.5 | `hooks/{useSvgDrag,useUrlHash,useKeyboardNudge,usePrefersReducedMotion}.ts`. Pointer events con CTM inverse. Clamp 0-100. | media | F2.4 |
| F2.6 | `Board.tsx` orquestador (estado de frames, tool, selected, mutadores). Corrige stale closure del play loop del mockup. | alta | F2.3 + F2.4 + F2.5 |
| F2.7 | `ui/Toolbar.tsx` + `ui/TopBar.tsx`. Aria-labels, aria-pressed, iconos lucide. | media | F2.6 |
| F2.8 | `ui/Timeline.tsx` con play/pause via `requestAnimationFrame`. Frame increment correcto. Live region para a11y. | alta | F2.6 |
| F2.9 | `ui/NoteEditor.tsx` + `ui/ShareToast.tsx`. Modal sin focus-trap (Esc + click fuera). | media | F2.6 |
| F2.10 | `ui/Watermark.tsx` + export PNG con fuentes Caveat/Fredoka inlineadas como base64 en `<defs>`. | media | F2.6 |
| F2.11 | `ui/NudgePad.tsx` mobile (botones flotantes ↑↓←→) + detección `(pointer: coarse)`. | media | F2.7 |
| F2.12 | `PizarraEmbed.astro` MDX wrapper con `client:visible`. Prop opcional `readonly`. | baja | F2.6 |
| F2.13 | `src/pages/pizarra/index.astro` con SEO: title, description, OG, Twitter card, JSON-LD `SoftwareApplication`. | baja | F2.6 |
| F2.14 | `src/content/pizarras/*.json` (mover los 6 presets a content collection). Schema Zod en `content.config.ts`. | baja | F2.13 |
| F2.15 | Fallback `<noscript>` con primer frame del preset como SVG estático. | media | F2.13 |
| F2.16 | Audit final: Lighthouse, axe-core, prueba en iPhone real, Android real, navegación 100 % por teclado. | alta | todo lo anterior |

### Tests obligatorios Fase 2

**Unit (vitest):**
- `serialize.ts`: `deserialize(serialize(board)) === board` para varios fixtures.
- `serialize.ts`: caracteres con tildes y emojis no rompen la URL.
- `tween.ts`: `tweenFrames(a, undefined, t) === a` para todo `t`.
- `tween.ts`: con `id` que no matchea, devuelve la posición de A.
- `geometry.ts`: `clamp(-5, 0, 100) === 0`, `clamp(150, 0, 100) === 100`.

**E2E manual antes de merge:**
- [ ] Drag de jugador en iPhone Safari real, no emulador.
- [ ] Drag con teclado: tab al jugador → flecha derecha 5 veces → posición x = +5 %.
- [ ] Share URL en Chrome → abrir en Firefox → estado idéntico.
- [ ] Export PNG → verificar fuente Caveat presente en la imagen.
- [ ] `prefers-reduced-motion: reduce` → play salta directo a frames sin tween.
- [ ] Lector de pantalla NVDA: navegar toolbar y anuncia cada herramienta.

### Fuera de alcance Fase 2 (rechazar si entran en PR)

- ❌ Paywall activo
- ❌ localStorage / cuentas / Supabase / D1
- ❌ Export PDF
- ❌ Onboarding overlay
- ❌ Stripe / Lemon Squeezy
- ❌ Pizarras destacadas firmadas del coach
- ❌ URLs evergreen `/pizarra/<preset>/` (eso es F2.5)

---

## Fase 2.5 — Páginas evergreen por preset

**Objetivo:** atacar long-tail SEO con una URL por preset (`/pizarra/rondo-4v1/`, `/pizarra/conduccion-zigzag/`, etc.) que cargue el preset y lo acompañe de copy editorial 600-900 palabras + `HowTo` schema.

**Pre-requisito:** Fase 2 mergeada.

| ID | Tarea | Complejidad | Depende de |
|---|---|---|---|
| F2.5.1 | `src/pages/pizarra/[preset]/index.astro` con `getStaticPaths` desde `content/pizarras/`. | media | F2.14 |
| F2.5.2 | Plantilla MDX por preset: descripción, edad, material, paso a paso, pizarra embebida. | baja | F2.5.1 |
| F2.5.3 | Schema `HowTo` con un `step` por frame del preset. | media | F2.5.1 |
| F2.5.4 | Copy editorial real para los 3 presets free (rondo, zigzag, pase y va). 600-900 palabras cada uno. | alta | F2.5.2 |
| F2.5.5 | Internal linking desde artículos de la categoría "ejercicios" hacia las URLs evergreen. | baja | F2.5.4 |
| F2.5.6 | Sitemap include + verificar indexación en Google Search Console. | baja | F2.5.4 |

**Estimación:** ≈ 8 h de código + 6-10 h de copy editorial (no incluido en estimación dev).

---

## Fase 3a — Persistencia local + cuentas

**Objetivo:** infraestructura de cuentas funcionando con magic-link, tabla `users` en D1, biblioteca cloud. Sin pagos: todos los usuarios siguen siendo `plan='free'`.

**Pre-requisito:** Fase 2 estable en producción ≥ 4 semanas, con métricas mínimas:
- ≥ 200 visitas/mes orgánicas a `/pizarra/`.
- ≥ 5 % de visitantes hacen al menos un share URL.
- ≥ 1 % usan export PNG.

| ID | Tarea | Complejidad | Depende de |
|---|---|---|---|
| F3a.1 | Crear cuenta Cloudflare Workers Paid. Provisionar D1 database. Schema inicial: `users(id, email UNIQUE, plan='free', createdAt, updatedAt)`. | media | — |
| F3a.2 | Cuenta Postmark. Verificar dominio (DKIM + SPF + Return-Path). Plantilla magic-link en español. | media | — |
| F3a.3 | Worker `/api/auth/magic` (POST email → genera token, guarda en KV con TTL 15 min, envía email). | alta | F3a.1 + F3a.2 |
| F3a.4 | Worker `/api/auth/verify` (GET token → consume KV, set cookie httponly Secure SameSite=Lax, redirige). | alta | F3a.3 |
| F3a.5 | Middleware Worker que lee cookie, valida sesión, expone `request.user` a endpoints. | media | F3a.4 |
| F3a.6 | `hooks/useAuth.ts` en isla. Estado `{ user, loading, login, logout }`. | media | F3a.5 |
| F3a.7 | Schema `pizarras(id, userId, nombre, board JSON, createdAt, updatedAt)`. CRUD endpoints `/api/pizarras`. | media | F3a.5 |
| F3a.8 | `pro/Library.tsx` (modal de biblioteca + guardar/cargar/borrar). Visible para todo `user`, sin gating. | media | F3a.7 |
| F3a.9 | Migración 1-shot al login: si `mg.pizarra.bib` tiene contenido y la cuenta está vacía, subir todas. | media | F3a.6 + F3a.8 |
| F3a.10 | Página `/cuenta/` con email, plan, listado de pizarras, botón "cerrar sesión". | baja | F3a.6 |

**Tests críticos Fase 3a:**
- Magic link expirado devuelve error claro, no crash.
- Cookie no presente → `/api/pizarras` devuelve 401, no 500.
- Migración localStorage → cuenta es idempotente (re-login no duplica).
- Logout limpia cookie y `useAuth` actualiza estado.

---

## Fase 3b — Pagos y paywall

**Objetivo:** activar PRO real. Pago via Lemon Squeezy hosted checkout. Webhook actualiza plan en D1. Gating real de PDF, biblioteca cloud unlimited, URL corta, sin watermark.

**Pre-requisito:** Fase 3a estable ≥ 4 semanas + decisión legal de identidad del titular tomada (LOPDGDD/RGPD).

| ID | Tarea | Complejidad | Depende de |
|---|---|---|---|
| F3b.1 | Cuenta Lemon Squeezy. Producto "MiniGol PRO" con variantes mensual (4,90 €) y anual (39 €). Página de checkout custom. | media | — |
| F3b.2 | Worker `/api/webhooks/lemonsqueezy` con verificación HMAC SHA-256. Eventos: `subscription_created`, `subscription_updated`, `subscription_cancelled`. | alta | F3b.1 + F3a.1 |
| F3b.3 | Actualizar `users.plan` en D1 según evento. Logging para auditoría. | media | F3b.2 |
| F3b.4 | `pro/Paywall.tsx` activo. Triggered por: intento de export PDF, intento de save > 10 pizarras, click en skin "grass". | media | F3a.6 |
| F3b.5 | Botón "Hacerme Pro" en `Paywall` → redirige a Lemon Squeezy checkout con `userId` en metadata. | baja | F3b.1 |
| F3b.6 | Página `/cuenta/` añade botón "Gestionar suscripción" → portal Lemon Squeezy. | baja | F3b.1 |
| F3b.7 | Endpoint `/api/account/refresh-plan` que reconsulta LS API si webhook falló. | media | F3b.2 |
| F3b.8 | Flag `PUBLIC_PRO_ENABLED=true` solo en producción cuando LS esté en live mode. | baja | F3b.7 |

**Tests críticos Fase 3b:**
- Webhook con firma incorrecta → 401, no actualiza nada.
- Webhook duplicado (LS reintenta) → no duplica el upgrade (idempotencia).
- Cancelación → `plan='free'` al final del periodo, no inmediato.
- Reembolso → `plan='free'` inmediato.

**Riesgos legales obligatorios antes de cobrar el primer euro:**
- [ ] Política de privacidad actualizada con sección "Pagos vía Lemon Squeezy".
- [ ] Términos y condiciones que mencionen periodo de reembolso (recomendado 14 días por normativa UE).
- [ ] Página de aviso legal con identidad del titular.

---

## Fase 3c — PDF, URLs cortas, oEmbed

**Objetivo:** completar el paquete PRO con las features pendientes. Cada una se puede mergear por separado.

| ID | Tarea | Complejidad | Depende de |
|---|---|---|---|
| F3c.1 | Worker `/api/pdf` (POST board JSON → PDF A4 con `pdf-lib`, sin headless Chrome). Header del coach + numeración de frames. | alta | F3a.5 |
| F3c.2 | `pro/exportPdf.ts` cliente que llama al endpoint si `user.plan === 'pro'`. | baja | F3c.1 + F3b.4 |
| F3c.3 | KV namespace `SHORT_URLS`. Worker `/api/p` POST (board → id corto). Worker `/api/p/[id]` GET (id → board). | media | F3a.5 |
| F3c.4 | `hooks/useShortUrl.ts` con gating `user.plan === 'pro'`. UI en TopBar muestra URL corta junto al hash largo. | media | F3c.3 |
| F3c.5 | Página `/p/[id]` que carga el board del KV y monta `<Board readonly />`. | media | F3c.3 |
| F3c.6 | Endpoint oEmbed `/api/oembed?url=<pizarra>` que devuelve JSON con iframe HTML para Substack/WordPress. | alta | F3c.5 |
| F3c.7 | `pro/OEmbed.tsx` muestra el snippet oEmbed para copiar. | baja | F3c.6 |

**Tests críticos Fase 3c:**
- PDF render con pizarra de 8 frames pesa < 500 KB.
- URL corta colisión: 6 caracteres alfanuméricos = 56 mil millones de combinaciones, retry on collision con backoff.
- Página `/p/[id]` no permite edición ni guardar.

---

## Métricas de éxito por fase

### Fase 2 (a 30 días tras lanzamiento)
- ≥ 200 visitas únicas a `/pizarra/`
- ≥ 10 % bounce rate sub-30 segundos (señal de uso real, no rebote)
- ≥ 5 shares de URL en redes sociales orgánico (búsqueda en X/Reddit/WhatsApp)
- 0 errores reportados en Sentry/console

### Fase 2.5 (a 60 días tras lanzamiento)
- ≥ 3 de los 6 presets indexados en Google Search Console
- ≥ 1 preset con posición media < 30 para su long-tail
- Internal links efectivos: ≥ 5 % de tráfico a `/pizarra/<preset>/` viene de artículos del sitio

### Fase 3a (a 30 días tras lanzamiento)
- ≥ 50 cuentas creadas
- ≥ 30 % de cuentas guardan al menos 1 pizarra
- < 5 % de tickets de soporte sobre login

### Fase 3b (a 60 días tras lanzamiento)
- ≥ 5 PRO activos
- Conversión cuenta → PRO ≥ 2 %
- Churn mensual < 10 %

### Fase 3c
- ≥ 20 % de PRO usan PDF
- ≥ 10 oEmbed activos en blogs externos

---

## Criterios para avanzar de fase

| De → A | Disparador |
|---|---|
| Fase 2 → Fase 2.5 | F2.16 verde + 4 semanas en producción sin bugs críticos |
| Fase 2.5 → Fase 3a | ≥ 200 visitas/mes orgánicas a `/pizarra/` |
| Fase 3a → Fase 3b | ≥ 50 cuentas activas + decisión legal de titular |
| Fase 3b → Fase 3c | ≥ 5 PRO activos durante ≥ 30 días |

**Si no se cumple el disparador, NO avanzamos de fase.** Es preferible quedarse en Fase 2 con la herramienta gratis viralizando, que activar pagos sin demanda y meter overhead de soporte.

---

## Cuándo actualizar este documento

| Evento | Acción |
|---|---|
| Tarea completada | Marcar checkbox o mover a "completadas" al final del documento |
| Aparece nuevo bug a resolver | Añadir como F2.x.bug-N en la fase correspondiente |
| Se acepta una decisión pendiente del cliente | Mover de [docs/ArquitecturaPizarra.md](ArquitecturaPizarra.md) §8 a la fase que corresponda |
| Cambia la estimación de horas | Actualizar tabla resumen ejecutivo |
| Cambia la línea freemium | Actualizar este doc + `ArquitecturaPizarra.md` §3 D2 |

---

## Tareas completadas

_(Se mueven aquí cuando se mergean.)_

- _ninguna por ahora_
