# Flujo de Trabajo — Estado actual

> Documento vivo. Actualizar al cierre de cada sprint o al cambiar de fase.
> Backlog completo en `PlanTrabajo.md`.

---

## 📍 Estado actual

- **Fecha:** 2026-04-28
- **Fase:** 2 — Lanzamiento (identidad visual + monetización)
- **Sprint activo:** **Sprint 10 — Bloque 3 en progreso.** Bloque 1 cerrado (Publicar endpoint + tests E2E + Dependabot). Bloque 2 pendiente (4 artículos → 25 total). Bloque 3 activo (EstrategiaSocialVideo.md + FlujoTrabajo.md + fix Playwright tests).
- **Bloqueantes:** ninguno técnico — esperando aprobación AdSense + indexación SEO (4-8 semanas desde 2026-04-26).

---

## ✅ Hitos completados

| Fecha | Hito |
|-------|------|
| 2026-04-25 | Brief de producto inicial (CLAUDE.md original) |
| 2026-04-25 | Análisis ChatGPT consolidado (`AnalisisWebFutbolparaNiños_ChatGPT.md`) |
| 2026-04-25 | Decisión de marca: **MiniGol Club** |
| 2026-04-26 | Decisión de dominio final: **minigolclub.com** (comprado) |
| 2026-04-25 | Decisión de stack: **Astro 6 + Tailwind 4 + Cloudflare Workers** (ADR-001, ADR-002) |
| 2026-04-25 | Sistema de diseño v1 definido (`DisenoUI.md`) |
| 2026-04-25 | Posicionamiento de marca v1 definido (`MarcaPosicionamiento.md`) |
| 2026-04-25 | Backlog 6 meses + 20 artículos núcleo (`PlanTrabajo.md`) |
| 2026-04-25 | **Sprint 1 cerrado:** bootstrap Astro 5 + Tailwind 4, CI + Lighthouse, repo GitHub público, branch protection |
| 2026-04-25 | **Sprint 2 cerrado (PR #10):** sistema editorial completo — content collections, layouts, componentes, 1 artículo, Lighthouse CI verde |
| 2026-04-26 | **Sprint 3 cerrado:** dominio + Cloudflare Workers + GA4 + cookie banner + 6 artículos + /sobre/ + Astro 6 |
| 2026-04-26 | **Sprint 4 cerrado:** Diseño v2 "Cuaderno de Campo" + páginas legales + Pagefind + 10 artículos + GuiaMonetizacion.md |
| 2026-04-26 | **Sprint 5 cerrado:** Amazon afiliados (tag minigolclub-21) + AdSense script verificación + entrenamiento→ejercicios + CategoryLayout v2 + auditoría SEO + GSC dado de alta |
| 2026-04-27 | **Sprint 6 cerrado:** fix Lighthouse a11y/perf + nivel filter activo + Dependabot TS6 + ESLint10 + CLAUDE.md actualizado + Lighthouse en push main |
| 2026-04-27 | **Sprint 7 cerrado:** theme toggle + GTM/AdSense post-consent + yaml CVE fix + cover migrado a Astro image() + 4 artículos (14 total) |
| 2026-04-27 | **Sprint 8 cerrado (PR #19):** Content Manager Fase 1 + 6 artículos (20 total) + página /autores/ E-E-A-T + PlanTrabajo sincronizado — 8 agentes en paralelo, -55% tokens |
| 2026-04-28 | **Sprint 9 cerrado (PR #23):** Content Manager Fase 2 — wizard 4 pasos + auto-PR draft + delete artículo. 21 artículos. 6 squads paralelos. |
| 2026-04-28 | **Sprint 10 Bloque 1 cerrado:** botón Publicar EditPage + endpoint `/publicar` auto-PR + Playwright E2E base + Dependabot #17/#18 (Vite+esbuild) + conducción-balón mergeado |

---

## 🎯 Próximos pasos inmediatos (top 5)

1. **[Bloque 2 pendiente]** 4 artículos → 25 total: `talla-balon-futbol-segun-edad`, `ejercicios-futbol-ninos-5-anos`, `calentamiento-futbol-ninos-10-minutos`, `juegos-futbol-conos-ninos`
2. **Crear cuenta @minigolclub en Instagram** — primer Reel apunta a artículo ya publicado
3. **Esperar aprobación AdSense** → me da slot IDs → los pego en `<AdSlot>` (acción manual usuario)
4. **Bloque 2 Sprint 11** — completar backlog 20 restante (10 artículos pendientes)
5. **Pizarra Táctica MVP** — isla Preact + backend Cloudflare-only (según `docs/PlanTrabajoPizarra.md` Fase 2)

---

## 📊 Métricas (actualizar mensual)

| Métrica | Objetivo año 1 | Actual | Última medición |
|---------|----------------|--------|-----------------|
| Artículos publicados | 50 | **21** | 2026-04-28 |
| Visitas/mes (GA4) | 30.000 | 0 | — (indexación pendiente) |
| Suscriptores newsletter | 1.000 | 0 | — |
| Ingresos AdSense ($) | 200/mes | 0 | — (aprobación pendiente) |
| Conversiones Amazon (clicks → ventas) | 50/mes | 0 | — |
| Backlinks dofollow DA>30 | 10 | 0 | — |
| CWV "Good" en CrUX | 100% URLs | n/a | — |
| Seguidores Instagram @minigolclub | 500 (mes 3) | 0 | — (cuenta por crear) |

---

## ✅ Sprint 5 cerrado (2026-04-26)

### Objetivo
Monetización operativa + rename categoría + primera auditoría SEO.

### Cerradas
- [x] Amazon Afiliados España activo (tag `minigolclub-21`) + `<AmazonCard>` + `<ComparisonTable>` operativos
- [x] AdSense script en `<head>` para verificación de cuenta
- [x] Rename categoría `entrenamiento` → `ejercicios` (9 ficheros, 301 redirects en `wrangler.toml`)
- [x] CategoryLayout v2 con filtros nivel/edad funcionales
- [x] Auditoría SEO on-page de los 10 artículos existentes
- [x] GSC verificado + sitemap enviado

---

## ✅ Sprint 6 cerrado (2026-04-27)

### Objetivo
Cerrar deuda técnica acumulada (Lighthouse + Dependabot) + CI en push a main.

### Causa raíz
Lighthouse fallaba desde Sprint 5 en main pero solo corría en `pull_request` — fallos invisibles hasta que llegó el primer PR.

### Cerradas
- [x] Fix touch targets <44px (Header, CategoryLayout chips, AmazonCard, StickyNewsletter)
- [x] Fix color contrast WCAG AA en dark mode — tokens brand 600→400-series + `--color-on-brand`
- [x] LCP home 5.9s → 2.9s (self-host fuentes @fontsource-variable, preload selectivo, preconnect GTM/GA/AdSense)
- [x] Schema `nivel: z.enum(['facil','media','reto'])` obligatorio + filter activo en CategoryLayout
- [x] Dependabot PR #6 (TypeScript 5.9→6.0) + PR #8 (ESLint 9→10) mergeados
- [x] CI workflows: Node 20 → 22 (Astro 6 requiere ≥22.12)
- [x] Lighthouse en `push: main` añadido (prevención regresión)
- [x] CLAUDE.md alineado al stack actual (§2 stack, §5 UI/UX, §6 umbrales CI)

---

## ✅ Sprint 7 cerrado (2026-04-27)

### Objetivo
5 prioridades independientes cerradas en una sesión.

### Cerradas
- [x] **P0** Theme toggle claro/oscuro/sistema (PR #12) — anti-FOUC en `<head>`, 3 estados cíclicos, 44×44px
- [x] **P1** GTM/AdSense post-consent (PR #14) — scripts cargados solo tras aceptar cookies; LCP home 3974→2942ms, perf 0.83→0.93
- [x] **P2** Vulnerabilidad yaml CVE-2026-33532 (PR #13) — `pnpm.overrides` `"yaml": ">=2.8.3"`
- [x] **P3** 4 artículos nuevos (PR #16) — ejercicios-futbol-7-anos, juegos-futbol-2-ninos, mejor-balon-futbol-7-anos, espinilleras-ninos-futbol (total 14)
- [x] **P4** Cover migrado a Astro `image()` (PR #15) — covers a `src/assets/`, WebP + responsive srcset; LCP artículo 2563→2412ms (<2500ms aspiracional alcanzado)

---

## ✅ Sprint 8 cerrado (2026-04-27, PR #19)

### Objetivo
Content Manager Fase 1 + 6 artículos (threshold AdSense) + E-E-A-T autor.

### Squads ejecutados (8 agentes en paralelo, -55% tokens)

| Squad | Entrega |
|-------|---------|
| D (mockup) | `admin-mockup/Dashboard.html` + `EditPage.html` — tokens "Cuaderno de Campo" |
| A (Sonnet) | `admin/` completo — React 19 + Vite + Tailwind + react-router + gray-matter, 22 archivos, 3 middlewares API |
| B×6 (Haiku) | 6 artículos del backlog 20: beneficios-futbol-ninos-salud, calendario-mundial-2026-ninos, mejores-selecciones-mundial-ninos, 10-juegos-futbol-divertidos-faciles, ejercicios-futbol-ninos-en-casa, dinamicas-grupo-entrenamientos-futbol-infantil |
| C (Sonnet) | `/autores/[slug].astro` dinámica + JSON-LD Person + ArticleLayout → autor link |
| B-audit×2 (Haiku) | Auditorías retroactivas Batch 1 — 9/10 ambos; fix fechas Mundial |

### Artículos al cierre: **20** (dentro del threshold AdSense 15-20)

---

## ✅ Sprint 9 cerrado (2026-04-28, PR #23)

### Objetivo
Content Manager Fase 2 — wizard de creación con auto-PR.

### Squads ejecutados (6 squads en 3 batches)

| Batch | Squad | Entrega |
|-------|-------|---------|
| 1 (paralelo) | D mockup + E cover endpoint | Mockup `WizardCrear.html` + `POST /api/articulos/cover` exportable |
| 2 (paralelo) | A1 crear endpoint + A2 UI wizard | `POST /crear` con .mdx draft + cover; wizard 4 pasos React con dnd-kit + react-hook-form+zod + localStorage |
| 3 (serial) | A3 auto-PR | `POST /api/articulos/pr` con worktree temp + `gh pr create --draft` + UI Step4 success |
| 4 (serial) | F tests E2E | 4 specs Playwright: 4/10 pasan, 6 con selectores `getByLabel` frágiles (sin `htmlFor`) |

### Contratos API admin tras Sprint 9
- `POST /api/articulos/cover` → `{ ok, path, sizeKB }`
- `POST /api/articulos/crear` → `{ ok, filePath, coverPath, slug, categoria }`
- `POST /api/articulos/pr` → `{ ok, branch, prUrl, prNumber }`
- `DELETE /api/articulos/:slug` → `{ ok, coverDeleted }`
- `POST /api/articulos/:slug/publicar` → `{ ok, branch, prUrl, prNumber }` ← añadido en Sprint 10

### Bugs resueltos en línea
- Paso 4 en blanco: `ZodEffects.merge()` no existe — `step2Base` separado sin `.refine()`, refine al final del schema completo
- Delete artículo faltante: añadido botón Trash2 en dashboard + `DELETE` endpoint

### Artículos al cierre: **21** (conduccion-balon mergeado en Sprint 10 Bloque 1)

---

## 🔄 Sprint actual — Sprint 10 (2026-04-28)

### Objetivo
Deuda técnica admin + documentación estratégica + fix tests + 4 artículos → 25.

### Bloque 1 ✅ Cerrado

- [x] Botón "Publicar" en `EditPage` — guarda + abre PR draft desde el editor (`POST /api/articulos/:slug/publicar`)
- [x] Fix TypeCheck CI ts(1308) — endpoint `/publicar` usando IIFE async para evitar await en callback síncrono
- [x] Dependabot PR #17 (Vite) + PR #18 (esbuild) mergeados con `--admin` flag
- [x] PR #29 conducción-balón mergeado (artículo "conducción de balón fútbol niños", limpio desde main)

### Bloque 2 ⏳ Pendiente

- [ ] `talla-balon-futbol-segun-edad` (equipamiento, money keyword hub, ~2000w)
- [ ] `ejercicios-futbol-ninos-5-anos` (ejercicios, age silo 5-6-7 cluster, ~1800w)
- [ ] `calentamiento-futbol-ninos-10-minutos` (ejercicios, high search volume, ~1700w)
- [ ] `juegos-futbol-conos-ninos` (juegos, viral Pinterest, ~1800w)

### Bloque 3 🔄 En progreso

- [x] `docs/seo/EstrategiaSocialVideo.md` — Instagram Reels, in-house + freelance, @minigolclub
- [x] `docs/FlujoTrabajo.md` — actualizado Sprints 5-10
- [x] Fix Playwright tests — `Field` con `htmlFor` + `id` para que `getByLabel()` funcione

### Pendientes (acciones manuales del usuario)

- [ ] **3.7** Solicitar Google AdSense — checklist en `docs/GuiaMonetizacion.md §1`
- [ ] **Crear cuenta @minigolclub** en Instagram — primer Reel apunta a artículo existente
- [ ] **Forzar reindex GSC** para 5 URLs prioritarias

---

## 🧠 ADRs y decisiones recientes

> Lista resumen — el detalle de cada ADR vive en `Arquitectura.md` §13.

| ADR | Decisión | Fecha |
|-----|----------|-------|
| ADR-001 | Astro sobre Next.js / WordPress | 2026-04-25 |
| ADR-002 | Cloudflare Workers sobre Vercel/Hostinger | 2026-04-25 |
| ADR-003 | Markdown + content collections sobre headless CMS | 2026-04-25 |
| ADR-004 | Pagefind sobre Algolia | 2026-04-25 |
| ADR-005 | TypeScript strict desde día 1 | 2026-04-25 |
| ADR-006 | Repo público desde el inicio (desbloquea branch protection sin GitHub Pro) | 2026-04-25 |
| — | Admin en Vite middleware (no servidor separado) — comparte puerto 4322 con dev Vite, accede al filesystem del repo desde `__dirname` | 2026-04-27 |
| — | Auto-PR: `git worktree add ../mg-pr-tmp` fuera del repo para no contaminar el working tree activo | 2026-04-28 |
| — | Canal social: Instagram Reels únicamente (no TikTok en fase 1). Evaluar en mes 3 con datos. | 2026-04-28 |

---

## ⚠️ Riesgos abiertos

| Riesgo | Mitigación | Estado |
|--------|------------|--------|
| AdSense aprobación pendiente | 21 artículos publicados, contenido de calidad — dentro del umbral | Esperando respuesta |
| Indexación SEO lenta (4-8 semanas) | Sitemaps enviados a GSC; forzar reindex de 5 URLs prioritarias | En progreso |
| Mundial 2026 (jun-jul) — perdemos pico si no llegamos indexados a tiempo | 3 artículos Mundial publicados; 2 más en backlog | Tracking activo |
| Playwright tests 6/10 fallan (getByLabel sin htmlFor) | Fix en Sprint 10 Bloque 3 | En proceso → cerrado en este sprint |
| Logo MiniGol Club sin diseñar — afecta E-E-A-T | Decidir antes de campaña social media | Abierto |
| Pizarra Táctica MVP pendiente — motor de creatividades para Reels | Fase 2 en `docs/PlanTrabajoPizarra.md` | Backlog sprint 11+ |

---

## 📝 Cómo actualizar este documento

- **Al cerrar sprint:** mover tareas de "En progreso" → "Cerradas", añadir aprendizajes, actualizar métricas si toca
- **Al iniciar sprint:** copiar tareas seleccionadas de `PlanTrabajo.md`, marcar owner si aplica
- **Al tomar decisión arquitectónica:** registrar ADR en `Arquitectura.md` §13 + añadir fila aquí
- **Mensual:** actualizar tabla de métricas con datos GA4/GSC/AdSense
- **Trimestral:** revisar `MarcaPosicionamiento.md` con datos reales
