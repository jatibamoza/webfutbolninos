# Arquitectura — Pizarra Táctica

> Documento autoritativo del producto **Pizarra Táctica interactiva** de MiniGol Club.
> Cualquier decisión técnica, de UX o de negocio sobre la pizarra debe partir de aquí.
> Cuando este documento entre en conflicto con un mockup, gana este documento.
>
> **Status:** Proposed · 2026-04-27 · Pendiente de aprobación final del cliente.

---

## 1. Contexto y requisitos

| Dimensión | Valor |
|---|---|
| Producto | Herramienta táctica interactiva (drag jugadores/balón/conos, flechas, frames animados, export PNG/PDF, share URL) |
| Objetivo de negocio | (a) tráfico SEO long-tail, (b) lead-magnet email, (c) freemium PRO recurrente |
| Estado del repo | Astro 6 estático, sin React/Preact, deploy en Cloudflare Workers, sin backend hoy |
| Presupuesto inicial | < 10 €/mes hasta tener ≥ 500 visitas/mes orgánicas a `/pizarra/` |
| Equipo | 1 dev (Javier) |
| Compliance | RGPD España, datos de menores prohibidos (CLAUDE.md §7), AdSense pendiente |
| Volumen objetivo 6 m | < 5.000 sesiones/mes en `/pizarra/`, < 500 cuentas, < 50 PRO |

**Dónde vive la pizarra:**

1. Página standalone `/pizarra/` (landing SEO + herramienta).
2. Embebida en artículos MDX vía `<PizarraEmbed preset="rondo-4v1" />`.
3. Páginas evergreen `/pizarra/<preset>/` por preset (Fase 2.5, ataque SEO long-tail).

---

## 2. Patrón arquitectónico — Static-first + Edge Backend

El sitio sigue siendo **estático Astro** (ADR-001 vigente). La pizarra es **una isla cliente Preact** sobre ese sitio. El backend se añade SOLO en Fase 3 y vive 100 % en el edge de Cloudflare (Workers + D1 + KV). Sin servidor tradicional, sin Supabase, sin Node host.

**Por qué:**
- Mantiene el modelo de coste y deploy actual.
- Evita lock-in de Supabase y un proveedor de auth extra.
- Aprovecha que el dominio ya está en Cloudflare (Registrar) y el deploy en Workers.
- La latencia edge es perfecta para una herramienta interactiva.

---

## 3. Decisiones cerradas

### D1 — Framework de isla: Preact con `preact/compat`

- `@astrojs/preact` + `preact` + alias `preact/compat` → React-compatible al 99 %.
- Bundle ≈ **12 KB gzip** vs ≈ 45 KB de React 18.
- El código del mockup no usa APIs React-only (`useTransition`, `useId`, `Suspense` real).
- Excepción: si en el futuro se quiere `react-three-fiber` o `framer-motion`, reevaluar. No es el caso.

### D2 — Línea freemium: "todo el motor gratis, los entregables PRO"

Después de pesar SEO vs conversión vs soporte, descartamos las variantes "frames limitados", "presets limitados" y "skins limitados" porque mutilan el wow factor. La línea óptima:

| Feature | Free | PRO (4,90 €/mes · 39 €/año) |
|---|---|---|
| Drag jugadores/balón/conos/porterías | ✅ | ✅ |
| Flechas (3 tipos) con endpoints arrastrables | ✅ | ✅ |
| Frames discretos | ✅ **ilimitados** | ✅ ilimitados |
| Tween + play/pause | ✅ | ✅ |
| Notas manuscritas (Caveat) | ✅ | ✅ |
| Tipos de campo (3) | ✅ todos | ✅ todos |
| Skins | ✅ chalk + paper | ✅ + grass premium |
| Presets editoriales (6) | ✅ los 6 | ✅ + presets firmados del coach |
| Compartir URL | ✅ hash largo `#pz=...` | ✅ + URL corta `/p/abc123` |
| Export PNG | ✅ con marca de agua "minigolclub.com" | ✅ sin marca |
| Export PDF imprimible A4 | ❌ | ✅ |
| Biblioteca personal de pizarras | ❌ (solo localStorage local) | ✅ guarda en la nube + cross-device |
| oEmbed en blogs externos | ❌ | ✅ |
| Plantillas en blanco para crear desde cero | ✅ | ✅ |

**Razonamiento:**

- **Frames ilimitados gratis.** Son la magia del producto. Si los limitamos, los compartidos en Twitter/WhatsApp serán triviales y el SEO se desangra.
- **Marca de agua en PNG gratis** = único growth-loop fuerte. Cada pizarra exportada lleva el dominio.
- **PDF + biblioteca cloud + URL corta** son features de "uso recurrente del padre serio". Aquí está la conversión.
- **Skin "grass" PRO** es decoración, no bloquea funcionalidad.

### D3 — Persistencia y cuentas — modelo gradual

**Fase 2 (hoy):**
- localStorage anónimo: `mg.pizarra.last` (autoguardado de la sesión actual) + `mg.pizarra.bib[]` (biblioteca local hasta 10 pizarras).
- Sin cuentas. Sin backend. Sin RGPD complicado: los datos no salen del dispositivo, no es "tratamiento" en sentido RGPD.

**Fase 3:**
- Cuenta opcional vía **Cloudflare Workers + D1 + magic-link email** (Postmark). NO Supabase.
- Al login: migración 1-shot de `mg.pizarra.bib` → cuenta. localStorage queda como cache.
- **Nunca** se piden datos del menor (nombre, edad). El campo "edad recomendada" es del ejercicio, no del niño. Esto nos mantiene fuera del régimen LOPDGDD para menores.

**Por qué no cuenta obligatoria desde día 1:** mata conversión. Pedir registro antes del wow es el motivo #1 de abandono. SEO también sufriría: el bot de Google no se registra.

### D4 — Pagos: Lemon Squeezy sobre Stripe

| Criterio | Stripe | Lemon Squeezy |
|---|---|---|
| Merchant of Record (gestiona IVA UE) | ❌ tú declaras IVA OSS | ✅ ellos son MoR |
| Comisión | 1,5 % + 0,25 € EU | 5 % + 0,50 $ |
| Setup España + autónomo | Complejo (alta OSS, 349 trimestral) | Trivial |
| Subscription billing | ✅ | ✅ |
| Checkout hosted | ✅ | ✅ |
| Webhooks edge-friendly | ✅ | ✅ |
| Portal de cancelación cliente | ✅ | ✅ |

**Decisión: Lemon Squeezy.** La comisión adicional (≈ 9 €/mes con 50 PRO) compensa el cero overhead administrativo. **Reevaluar a 500 PRO** (≈ 2.500 €/mes): a ese volumen, migrar a Stripe ahorra ≈ 90 €/mes y justifica gestionar OSS.

### D5 — Backend: Cloudflare-only

```
Auth:    Workers + D1 (tabla users) + cookie httponly + magic-link Postmark
Storage: D1 (cuentas/pizarras), KV (URLs cortas /p/<id>)
Pagos:   Lemon Squeezy hosted checkout + webhook → D1.users.plan
Email:   Postmark (transactional, magic links, recibos) — 10 $/mes 10k emails
PDFs:    Worker que renderiza SVG → PDF con `pdf-lib` (sin headless Chrome)
```

**Coste estimado Fase 3 estable (≤ 500 cuentas, ≤ 50 PRO):**

| Servicio | Coste/mes |
|---|---|
| Cloudflare Workers Paid (incluye D1 5GB, KV) | 5 $ |
| Postmark | 10 $ |
| Lemon Squeezy | 5 % + 0,50 $ por venta — variable |
| Dominio | ≈ 10 €/año |
| **Total fijo** | **≈ 14 $/mes ≈ 13 €/mes** |

Vs Supabase Pro (25 $) + Stripe (1,5 %) + Postmark (10 $) ≈ 35 $/mes. Diferencia → contenido SEO.

### D6 — Estado en URL: híbrido

- **Free:** hash base64 largo (`/pizarra/#pz=eyJmaWVsZFR5cGUi...`). Cero backend, cero coste, funciona para SEO y compartir.
- **PRO:** URL corta `/p/<id>` que lee del KV (`{ id, board, owner, createdAt }`). Más limpio en redes y permite analytics futuros.

**Detalle técnico:** sustituir `btoa(unescape(encodeURIComponent(...)))` del mockup por `TextEncoder` + base64-url-safe (`-_` en vez de `+/`) para evitar romper la URL al copiar/pegar.

### D7 — Schema markup SEO

| URL | Schema |
|---|---|
| `/pizarra/` | `SoftwareApplication` (categoría: SportsApplication) + `BreadcrumbList` |
| `/pizarra/<preset>/` | `HowTo` con un `step` por frame + `SoftwareApplication` anidada + `BreadcrumbList` |
| Artículo MDX con `<PizarraEmbed>` | mantiene `Article` actual (la pizarra no añade schema) |

**No `VideoObject`** — Google penaliza forzar schemas inaplicables. La animación SVG no es vídeo.

**`HowTo` en preset pages:** cada frame es un step con `name`, `text` (la nota Caveat) y opcionalmente `image` (snapshot PNG generado en build). Es la apuesta SEO más fuerte del producto.

### D8 — Mobile UX: dual mode con auto-detección

- **Desktop / pointer fino:** drag puro como el mockup.
- **Mobile / coarse pointer:** **tap-to-select + nudge** — jugador seleccionado se mueve con 4 botones flotantes `↑↓←→`. Drag tradicional disponible pero con `touch-action: none` cuidadoso.

**Detección:** `(pointer: coarse)` + `(hover: none)`. NO sniffing de userAgent.

**Toolbar mobile:** drawer inferior tipo bottom sheet, no sidebar lateral (el sidebar de 56 px roba ancho útil del campo a 375 px).

### D9 — A11y, lista cerrada

- ✅ `aria-pressed` en cada tool de toolbar.
- ✅ `aria-label` descriptivo en cada jugador (`"Jugador azul 3, posición 45 % 70 %, seleccionado"`).
- ✅ Drag con teclado: tab para llegar, flechas mueven 1 %, shift+flechas mueve 5 %.
- ✅ `prefers-reduced-motion` salta el tween y muestra frames como diapositivas.
- ➕ `<section aria-label="Pizarra táctica interactiva">` envuelve la isla.
- ➕ Live region en el timeline: anunciar cambio de frame leyendo la nota.
- ➕ Skip link "Saltar herramienta y ver descripción" → ancla al texto explicativo.
- ➕ Color no es información: las flechas pase/filtro/movimiento se distinguen también por dasharray.

### D10 — Topología de carpetas

```
src/components/pizarra/
├── core/                       ← lógica pura, testable, sin DOM ni Preact
│   ├── types.ts                ← Player, FieldObject, Arrow, Note, Frame, Board, Skin, FieldType
│   ├── presets.ts              ← PRESETS readonly, IDs estables (no uid() runtime)
│   ├── tween.ts                ← lerp, tweenFrames
│   ├── serialize.ts            ← base64-url-safe + validación Zod del Board
│   ├── geometry.ts             ← clamp 0-100, distancia, intersección con campo
│   └── __tests__/              ← vitest
├── hooks/
│   ├── useSvgDrag.ts           ← pointer events sobre SVG con CTM inverse
│   ├── useUrlHash.ts           ← read/write location.hash con debounce
│   ├── useKeyboardNudge.ts     ← flechas + shift, respeta selección
│   ├── usePrefersReducedMotion.ts
│   └── useShortUrl.ts          ← FASE 3: POST /api/p → KV
├── primitives/
│   ├── Field.tsx               ← FieldLines + viewBox 100×100 (corrige bug ratio del mockup)
│   ├── Player.tsx
│   ├── FieldObject.tsx
│   ├── Arrow.tsx
│   └── Note.tsx
├── ui/
│   ├── Toolbar.tsx             ← lateral en desktop, drawer en mobile
│   ├── TopBar.tsx              ← presets, fieldType, skin, share, export
│   ├── Timeline.tsx            ← frames, play/pause con rAF (corrige stale closure mockup)
│   ├── NudgePad.tsx            ← FASE 2 mobile: ↑↓←→ flotantes
│   ├── NoteEditor.tsx
│   ├── ShareToast.tsx
│   └── Watermark.tsx           ← marca minigolclub.com en export PNG free
├── pro/                        ← FASE 3, dynamic import sólo si user.plan === 'pro'
│   ├── Paywall.tsx
│   ├── Library.tsx             ← biblioteca cloud
│   ├── exportPdf.ts            ← pdf-lib
│   └── OEmbed.tsx
└── Board.tsx                   ← orquestador raíz, expone <Board initialPreset readonly?/>

src/components/PizarraEmbed.astro
                                ← wrapper Astro: monta Board con client:visible
src/pages/pizarra/
├── index.astro                 ← landing principal
└── [preset]/index.astro        ← FASE 2.5 evergreen URLs (rondo-4v1, etc.)

src/content/pizarras/           ← NUEVO content collection (presets editables sin TS)
├── rondo-4v1.json
├── conduccion-zigzag.json
└── ...

src/pages/api/                  ← FASE 3, Astro endpoints o Workers
├── p/[id].ts                   ← GET pizarra corta
├── pizarras/index.ts           ← GET/POST biblioteca
├── auth/magic.ts               ← envío magic link
├── auth/verify.ts              ← consume token, set cookie
└── webhooks/lemonsqueezy.ts    ← actualiza plan en D1
```

**Justificación:**
- Separación `core/` (puro) vs `hooks/` (Preact) vs `primitives/` (SVG) vs `ui/` (chrome). Permite testar `core` con vitest sin DOM.
- `pro/` aislado con dynamic import en runtime: el bundle gratis nunca carga `pdf-lib` (≈ 50 KB) ni la lógica de biblioteca cloud.
- `pizarras/` content collection: cada preset es JSON validado por Zod, igual que `categorias/`. Editable sin tocar TS.
- `[preset]/index.astro` para los evergreen SEO `/pizarra/rondo-4v1/` — es donde gana el `HowTo` schema.

---

## 4. Diagramas de bloques

### Fase 2 — sin backend

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLOUDFLARE CDN (edge)                       │
│                                                                 │
│   /pizarra/             /pizarra/rondo-4v1/     /<artículo>/    │
│   index.astro           [preset]/index.astro    layout MDX      │
│        │                       │                       │        │
│        └──── monta ────────────┴──── monta ────────────┘        │
│                                │                                │
│                                ▼                                │
│              ┌─────────────────────────────────┐                │
│              │  ISLA Preact <Board/>           │                │
│              │  - core (puro)                  │                │
│              │  - hooks (drag, urlhash, kb)    │                │
│              │  - primitives SVG               │                │
│              │  - ui (toolbar, timeline)       │                │
│              │  - Watermark en export PNG      │                │
│              └────┬────────────┬───────────────┘                │
│                   │            │                                │
│                   ▼            ▼                                │
│              localStorage   location.hash#pz=...                │
│              (mg.pizarra.*) (compartir URL)                     │
└─────────────────────────────────────────────────────────────────┘
```

### Fase 3 — backend edge completo

```
┌─────────────────── CLOUDFLARE EDGE ─────────────────────────────┐
│                                                                 │
│   Static (Workers Sites)                                        │
│   ──────────────────────                                        │
│   /pizarra/ · /pizarra/<preset>/ · /<artículo>/                 │
│        │                                                        │
│        ▼                                                        │
│   Isla Preact <Board/>                                          │
│   ├── core (puro)                                               │
│   ├── ui                                                        │
│   └── pro/* (dynamic import si user.plan==='pro')               │
│        │                                                        │
│        │ fetch /api/...                                         │
│        ▼                                                        │
│   ┌──────────── Worker /api/* ──────────┐                       │
│   │  - auth/magic, auth/verify          │                       │
│   │  - p/[id]   (URLs cortas)           │                       │
│   │  - pizarras (biblioteca CRUD)       │                       │
│   │  - webhooks/lemonsqueezy            │                       │
│   │  - pdf       (renderiza pdf-lib)    │                       │
│   └────┬──────────┬─────────────┬───────┘                       │
│        │          │             │                               │
│        ▼          ▼             ▼                               │
│      D1        KV         Cookie httponly                       │
│   (users,    (URLs       (sesión)                               │
│   pizarras,   cortas)                                           │
│   plans)                                                        │
└────────────────────────┬────────────────────────────────────────┘
                         │ webhook
                         ▼
              ┌──────────────────────┐
              │  Lemon Squeezy       │  Postmark
              │  (checkout + MoR)    │  (magic links + recibos)
              └──────────────────────┘
```

---

## 5. Bugs detectados en el handoff que hay que corregir al portar

| Bug | Ubicación en mockup | Fix al portar |
|---|---|---|
| `useEffect(..., [playing])` captura `activeFrame` y `frames.length` en stale closure → play se queda atascado | `pizarra.jsx:207-233` | Usar `useRef` para `activeFrame`, o redepender de `[playing, activeFrame, frames.length]` con cleanup correcto |
| `FIELD_TYPES.full.ratio = 68/105` y `half.ratio = 105/68` invertidos respecto a `aspectRatio: '100 / (100 * ratio)'` | `pizarra-svg.jsx:11-15` | Usar ratio = ancho/alto, no alto/ancho |
| `btoa(unescape(encodeURIComponent(...)))` con `unescape` deprecated y `+/=` rompen URL | `pizarra-data.jsx:250-262` | `TextEncoder` + base64-url-safe (`-_` en vez de `+/`) |
| `exportPNG` no inlinea fuentes web → PNG con fuente fallback | `pizarra.jsx:257-278` | Embeber Caveat + Fredoka como `<defs><style>@font-face{src:url(data:...)}` o usar `html-to-image` |
| Skin "paper" tiene `invertText: true` declarado pero ignorado | `pizarra.jsx:292-296` | Implementar inversión de color en flechas/notas o eliminar el skin paper hasta rediseño |
| Tween 1.5 s en código vs 1.6 s en README | `pizarra.jsx:211` | Constante `FRAME_MS = 1500` exportada y configurable |

---

## 6. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Cliente con JS desactivado → pizarra no funciona | SSR estático del primer frame del preset como `<img>` fallback dentro de `<noscript>` |
| localStorage lleno (cuota 5 MB) → autoguardado falla silencioso | Contador en UI + LRU sobre `mg.pizarra.bib` con máximo 10 entradas en Free |
| Webhook Lemon Squeezy falla → usuario paga pero plan no se actualiza | Endpoint `/api/account/refresh-plan` que reconsulta LS API on-demand |
| Drag iOS Safari < 16.4 con `touch-action: none` mal aplicado | Aplicar `touch-action: none` solo al `<svg>`, no al wrapper. Probar en dispositivo real |
| `getScreenCTM().inverse()` puede ser `null` si SVG no montado | Guard del mockup ya lo hace; añadir test |
| Bundle Preact crece si usamos librerías React-only | Validar bundle size en CI con `size-limit` (warn > 80 KB gzip total isla) |
| Lemon Squeezy free tier limita ventas/mes → bloqueo súbito | Migrar a Stripe a 500 PRO según plan D4 |

---

## 7. ADR-006 (borrador) para `docs/Arquitectura.md` §13

```markdown
### ADR-006 — Pizarra Táctica como isla Preact con backend edge

**Status:** Proposed · 2026-04-27

**Context:** El producto requiere una herramienta interactiva con drag-and-drop, animación
y exportación, embebible en artículos y como página standalone. El sitio es estático Astro
sin runtime cliente. Se quiere modelo freemium con conversión a PRO recurrente.

**Decision:**
1. Integrar Preact (no React) vía `@astrojs/preact` con alias `preact/compat`.
2. Aislar la lógica en `src/components/pizarra/{core,hooks,primitives,ui,pro}` con `core/`
   puro y testeable sin DOM.
3. Backend Fase 3 100 % en Cloudflare (Workers + D1 + KV), sin Supabase ni Node tradicional.
4. Pagos vía Lemon Squeezy (Merchant of Record) sobre Stripe directo.
5. Email transaccional vía Postmark.
6. Persistencia anónima en localStorage en Fase 2; cuenta opcional con magic-link en Fase 3.
7. Línea freemium: motor completo gratis + watermark en PNG; PRO desbloquea PDF, biblioteca
   cloud, URL corta, oEmbed y skin "grass".

**Consequences:**

✅ Bundle de la isla ≈ 12 KB gzip (Preact) en lugar de ≈ 45 KB (React).
✅ El bundle "free" no carga `pdf-lib` ni código PRO (dynamic import por plan).
✅ Coste de infra Fase 3 ≈ 13 €/mes hasta ~500 cuentas (vs ≈ 33 €/mes con Supabase).
✅ Cero gestión de IVA UE manual gracias al MoR de Lemon Squeezy.
✅ Frames ilimitados gratis maximizan SEO compartido y wow factor.
✅ Watermark en PNG = growth loop natural.

⚠️ Lemon Squeezy cobra 5 % (vs ≈ 1,5 % Stripe). Reevaluar a 500 PRO.
⚠️ Preact tiene ≈ 1 % incompatibilidades vs React si en el futuro queremos `react-three-fiber`
   o librerías que dependan de React internals. Bajo riesgo dado el alcance.
⚠️ D1 está en GA pero menos maduro que Postgres. Migrar solo si superamos límites
   (5 GB, 50 k writes/día gratis).
⚠️ La isla obliga a hidratación cliente — penaliza Performance ≈ 1 punto Lighthouse en
   `/pizarra/`. Aceptable porque esa página no es contenido editorial crítico.

**Risks & mitigations:** ver sección 6 de docs/ArquitecturaPizarra.md.
```

---

## 8. Decisiones aún pendientes con el cliente

- [ ] **Validar línea freemium definitiva (sección 3 D2).** En particular: ¿la marca de agua en PNG free es aceptable o preferimos que sea sin marca y bloquear otra cosa?
- [ ] **Confirmar precio**: 4,90 €/mes · 39 €/año (mockup) vs benchmarks. Validar con benchmark de TacticalPad / CoachTactic (típicamente 8-15 €/mes).
- [ ] **¿Mantener "presets firmados del coach Javier" como hook PRO** (D2) o como contenido editorial gratuito que aporte E-E-A-T? Decisión afecta a [docs/seo/EstrategiaEEAT.md](seo/EstrategiaEEAT.md).
- [ ] **¿Lanzar `/pizarra/<preset>/` evergreen en Fase 2** o esperar a F2.5? Cada uno requiere copy editorial.
- [ ] **Identidad legal del titular** para política de privacidad (heredada de `Arquitectura.md` §14).
- [ ] **Provider DNS para Postmark** (verificación dominio para envío de magic links).

---

## 9. Cuándo actualizar este documento

| Si cambia... | Actualizar sección |
|---|---|
| La línea freemium (qué es free vs PRO) | §3 D2 |
| El proveedor de pagos | §3 D4 + §7 ADR |
| El stack de backend (D1 → Postgres, etc.) | §3 D5 + §4 diagrama Fase 3 + §7 ADR |
| Una decisión de UX mobile | §3 D8 |
| Aparece un nuevo bug del mockup detectado al portar | §5 |
| Aparece un nuevo riesgo en producción | §6 |

**Regla:** si hay conflicto entre código y este doc, gana el doc — y el PR debe ajustar el código. Si el doc está obsoleto, el PR debe ajustar el doc.
