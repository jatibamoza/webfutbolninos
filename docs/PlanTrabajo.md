# Plan de Trabajo — MiniGol Club

> Backlog priorizado en sprints. Estado actual en `FlujoTrabajo.md`.
> **Última sincronización con realidad: 2026-04-27.**

---

## Convenciones

- **Sprint = sesión enfocada** (no calendario rígido — el ritmo lo marca el bloqueo de tiempo del usuario).
- **Issue = task GitHub.** Labels: `tipo/feat`, `tipo/content`, `tipo/seo`, `tipo/infra`, `tipo/design`, `tipo/bug` + `prio/alta|media|baja` + `sprint/N`.
- **Definition of Done genérica:**
  - PR mergeado a `main` (no push directo)
  - Lighthouse CI pasa (Perf ≥0.90, A11y ≥0.95, SEO=1.0, Best Practices ≥0.90, LCP warn ≤3500ms)
  - Type-check + lint sin errores
  - Si toca contenido: revisado SEO (title, meta, H1 único, alt, ≥2 internal links, frontmatter completo con `nivel`)
  - Documentación actualizada si cambia stack o convenciones

---

## Roadmap

| Fase | Sprints | Objetivo | Estado |
|------|---------|----------|--------|
| **0 — Bootstrap** | S1 | Repo, Astro, deploy Cloudflare, CI verde, dominio | ✅ COMPLETO |
| **1 — Esqueleto** | S2-S3 | Layouts, content collections, 10 artículos, AdSense submitted | ✅ COMPLETO |
| **2 — Identidad y monetización** | S4-S5 | Diseño 'Cuaderno de Campo', Pagefind, AmazonCard, AdSense script | ✅ COMPLETO |
| **3 — Estabilización técnica** | S6 | Fix Lighthouse a11y/perf, schema nivel, CLAUDE.md alineado, Dependabot | ✅ COMPLETO |
| **4 — UX + perf real** | S7 | Theme toggle, GTM/AdSense post-consent, cover image(), 4 artículos nuevos, vuln yaml | ✅ COMPLETO |
| **5 — Content Manager Fase 1** | S8 | Admin local edit, 6 artículos backlog 20, página /autores/ E-E-A-T | ✅ COMPLETO |
| **5b — Content Manager Fase 2** | **S9** | **Wizard creación 4 pasos + auto-PR draft + delete artículo (PR #23)** | ✅ COMPLETO |
| **6 — Crecimiento** | S10-S12 | Pipeline social vídeo TikTok+Instagram, llegar a 30+ artículos, Pinterest, newsletter | ⏳ |
| **7 — Monetización plena** | S12+ | Lead-magnet gated, A/B test ads, comparativas Amazon completas | ⏳ |

---

## Sprint 1 — Bootstrap ✅ COMPLETO

Astro 6 + Tailwind 4 + TS strict + Cloudflare Workers + dominio `minigolclub.com` + CI + páginas legales (privacidad, cookies, aviso legal, contacto). Workflows `ci.yml` y `lighthouse.yml`.

---

## Sprint 2 — Layouts y content collections ✅ COMPLETO

Schemas Zod (articulos, categorias, recursos, autores), 6 categorías seed, ArticleCard, Breadcrumb con JSON-LD, Header, Footer, ArticleLayout con TOC, CategoryLayout con grid, helper `lib/seo.ts`, RSS, RelatedArticles.

---

## Sprint 3 — SEO técnico + AdSense + Amazon ✅ COMPLETO

GSC + Bing verificados, GA4, banner cookies (vanilla-cookieconsent v3), AdSlot, AffiliateDisclosure pattern (blockquote), Amazon Afiliados (`minigolclub-21`) con AmazonCard + ComparisonTable, Pagefind búsqueda interna, página /sobre/.

**Pendiente acción manual del usuario:** AdSense aprobación (sitio ya con script de verificación + 14 artículos cumple los requisitos).

---

## Sprint 4-5 — Identidad visual + monetización ✅ COMPLETO

Identidad "Cuaderno de Campo" (Fredoka + Nunito + Caveat + JetBrains Mono, paleta papel crema, dorsales, marker amarillo), 10 artículos publicados, AmazonCard text-only, ComparisonTable, AdSense script verificación en `<head>`, rename `entrenamiento → ejercicios`, CategoryLayout v2 con dorsal numérico + filtros edad.

---

## Sprint 6 — Estabilización técnica (2026-04-27) ✅ COMPLETO

Fix Lighthouse a11y/perf de raíz: touch targets 44px, tokens brand 400-series en dark mode + `--color-on-brand`, self-host fontsource-variable, preconnect GA/AdSense. Schema `nivel` activo + filtro real. Dependabot #6 (TypeScript 6) + #8 (ESLint 10) mergeados. CLAUDE.md alineado al stack actual (Astro 6, Workers, content.config.ts). Lighthouse en push a main como guard de regresión.

---

## Sprint 7 — UX + perf real (2026-04-27) ✅ COMPLETO

P0 theme toggle claro/oscuro/sistema (#12), P1 GTM/AdSense post-consent (#14, LCP 3.97s→2.94s), P2 vulnerabilidad yaml CVE-2026-33532 (#13), P3 4 artículos nuevos (#16: ejercicios-7-anos, balón-7-años, espinilleras, juegos-2-niños), P4 cover→Astro `image()` (#15, LCP artículo 2.41s ✅ Good).

**Métricas finales:** perf 0.95-0.96, a11y 1.0, color-contrast 1.0, modern-image-formats 1.0, LCP artículo 2.41s, **14 artículos publicados**.

---

## Sprint 8 — Content Manager + cierre backlog 🔴 EN CURSO

**Objetivo:** desbloquear creación de contenido vía admin local, cerrar los 6 artículos del backlog 20 pendientes, página /autores/ para E-E-A-T, primer lead-magnet PDF.

### Squads en paralelo

| Squad | Foco | Skills/Agentes | Modelo | Estimado |
|---|---|---|---|---|
| **D** | Mockup visual Content Manager | `ui-ux-pro-max` | Sonnet | 30 min |
| **A** | Admin Fase 1 (Edit existente) | `web-developer` | Sonnet | 6-8h |
| **A2** | Admin Fase 2 (Wizard creación) | `web-developer` | Sonnet | 6-8h |
| **B** | 6 artículos backlog 20 | `seo-content-writer` ×6 paralelo | **Haiku** | 2h orquestación + N agentes |
| **B-audit** | Auditoría SEO pre-PR de cada artículo | `seo-content-auditor` ×6 | **Haiku** | 1h |
| **C** | Página `/autores/javier-tibamoza/` + JSON-LD Person | `web-developer` | Sonnet | 1-2h |
| **F** | Lead-magnet PDF "Cuaderno ejercicios 4 semanas" | `web-developer` (genera PDF script) | Sonnet | 3-4h |
| **G** | Coordinación + tracking | `team-manager` | Sonnet | continuo |
| **Arch** | Decisión auth/DB para futura Fase 5 (VPS Hetzner) | `system-architect` | **Opus** | solo si surge ADR |

### Backlog 20 — pendiente (6 artículos)

| # | Slug | Pilar | Edad | Tipo | Prio |
|---|---|---|---|---|---|
| 1 | `beneficios-futbol-ninos-salud` | 5 Padres | 4-12 | cluster | 🔴 P0 (E-E-A-T + Pilar 5) |
| 2 | `calendario-mundial-2026-ninos` | 6 Mundial | 6-12 | estacional | 🔴 P0 (pico tráfico junio) |
| 3 | `mejores-selecciones-mundial-ninos` | 6 Mundial | 6-12 | estacional | 🟠 P1 |
| 4 | `10-juegos-futbol-divertidos-faciles` | 2 Juegos | 4-12 | cluster | 🟠 P1 (viral Pinterest) |
| 5 | `ejercicios-futbol-niños-en-casa` | 1 Ejercicios | 4-12 | cluster | 🟠 P1 |
| 6 | `dinamicas-grupo-entrenamientos-futbol-infantil` | 1 Ejercicios | 6-12 | cluster | 🟡 P2 |

### Content Manager — Plan Fase a Fase

**Fase 1 (6-8h)** — Edit existente: form de frontmatter + MDX editor + preview + guardar al disco. Sin git ops.
**Fase 2 (6-8h)** — Wizard creación 5 pasos (Brief → Generate → Edit → Cover → Commit con PR auto).
**Fase 3 (3-4h)** — Auditoría desde UI + validaciones CLAUDE.md §4 + Lighthouse local opcional.
**Fase 4 (2-3h)** — Quality of life: history, search, dark mode, atajos.
**Fase 5 (futura)** — Deploy a VPS Hetzner con auth básica.

### Stack admin

- **React 19 + Vite 8 + Tailwind 4** (mismo patrón que Content Manager de referencia)
- **react-router-dom 7** + Lucide React
- **IndexedDB** sesión wizard + **localStorage** flags + **JSON files** backup durable
- **Vite middlewares** = mini backend (`/api/articulos`, `/api/generate-article`, `/api/generate-cover`, `/api/git/*`)
- **Bridge `toast()`** para errores fuera de React
- **Look&feel "Cuaderno de Campo"** (mismos tokens que web/)

---

## Backlog feature pendiente (no asignado a sprint todavía)

| # | Tarea | Origen | Prio |
|---|---|---|---|
| 4.1 | Filtros sticky en categoría (mobile) | Sprint 4 | 🟡 |
| 4.5 | Schema `Product` + reviews para comparativas Amazon | Sprint 4 | 🟡 |
| 4.7 | Newsletter capture (Buttondown / ConvertKit) integrado | Sprint 4 | 🟡 |
| 4.8 | Pinterest meta tags + auto-share | Sprint 4 | 🟢 |
| 7.1 | Comentarios con Giscus | Sprint 7 | 🟢 |
| 7.2 | Sistema de tags + páginas `/tag/[slug]` | Sprint 7 | 🟡 |
| 7.4 | Sticky footer ad mobile (A/B test) | Sprint 7 | 🟢 |
| 7.5 | Web Stories AMP para Discover | Sprint 7 | 🟢 |
| 7.7 | Dashboard interno métricas | Sprint 7 | 🟢 |
| 7.8 | Pinterest auto-pins desde RSS | Sprint 7 | 🟠 |
| 7.9 | Templates Canva Pinterest | Sprint 7 | 🟠 |
| 11.1 | Lead-magnet PDF gated por email | Sprint 11 | 🟠 (después Sprint 8 F) |
| 11.2 | Welcome email automation | Sprint 11 | 🟡 |
| 11.4 | Optimización ad slots con datos reales | Sprint 11 | 🟡 (depende de aprobación AdSense) |
| 11.5 | Audit accessibility manual con screen reader | Sprint 11 | 🟡 |

---

## Backlog contenido continuo (post backlog 20)

### Bloque 1 — Ejercicios (ampliación)
- Ejercicios de portero para niños 8-10 años
- Conducción de balón para principiantes
- Cómo enseñar a chutar paso a paso
- Calentamiento 10 min para niños
- Plan entrenamiento 4 semanas
- Ejercicios cabeceo seguro
- Velocidad y agilidad para futbolistas niños
- Ejercicios fútbol niños 5 años (silo edad)
- Ejercicios fútbol niños 8 años
- Ejercicios fútbol niños 9 años
- Pase y control balón niños
- Fútbol sala niños

### Bloque 2 — Juegos (ampliación)
- Juegos con globos para 4-6 años
- Juegos en piscina (verano)
- Juegos con conos: 8 ideas
- Juegos cooperativos (sin competición)
- Juegos para días de lluvia
- Juegos para niños tímidos
- Juegos fútbol pequeño espacio (casa/apartamento)
- Juegos fútbol playa verano

### Bloque 3 — Equipamiento money keywords (ampliación)
- Talla balón fútbol edad (hub Pilar 3)
- Mejores porterías plegables jardín
- Mejores conos / setas / picas entrenamiento
- Mejor equipación niño 6-12 años
- Mejores botas según superficie
- Mochila portabalón
- Botas talla 33-35

### Bloque 6 — LaLiga (categoría futura)
- Calendario LaLiga explicado para niños
- Equipos de LaLiga para conocer con tus hijos
- Estadios de LaLiga: ranking visual
- Jugadores LaLiga modelos a seguir

---

## Pipeline social vídeo — TikTok + Instagram (post-Sprint-9)

Decisión del usuario 2026-04-27: producir vídeos cortos para redes sociales como canal de tráfico complementario al SEO orgánico. **NO empezar antes de cerrar Sprint 9 (Content Manager Fase 2).**

**Restricciones no negociables:**
- Sin caras de menores ni padres reales. Solo ilustraciones, diagramas, animaciones de la Pizarra Táctica, voiceover IA.
- CTA en cada vídeo apunta a un artículo concreto del sitio (no la home). El landing debe estar publicado antes del vídeo.
- Tracking UTM `?utm_source=tiktok&utm_medium=reel&utm_campaign=<slug>` siempre.

**Sprint dedicado a planificar (Sprint 10 candidato):**
1. Definir formato base (15-30s vertical 9:16, 3 bloques: hook → ejercicio/dato → CTA)
2. Cadencia mínima 3 vídeos/semana por plataforma
3. Toolchain: CapCut o ffmpeg + plantillas SVG/Lottie reutilizables del propio sitio
4. Pipeline reaprovechamiento: cada artículo del backlog 20 → 2-3 vídeos cortos
5. Integración Pizarra Táctica como motor de creatividades visuales
6. Doc nuevo: `docs/seo/EstrategiaSocialVideo.md`

**Decisiones pendientes del usuario:** producción in-house vs freelance · TikTok+Reels vs incluir Shorts día 1 · cuenta @minigolclub nueva vs perfil personal.

Memoria asociada: `project_social_video_strategy.md`.

---

## Backlog "icebox" (sin sprint asignado)

Ideas y mejoras a evaluar más adelante. **No empezar sin priorizar primero.**

- **Resultados en directo de competiciones** (Mundial 2026 → LaLiga → Champions). Análisis en `docs/seo/ResultadosEnDirecto.md`. Evaluar Sprint 9+ candidato.
- Calculadora "¿en qué categoría jugaría mi hijo?"
- Quiz "¿qué jugador eres?" para niños (viralidad)
- Canal YouTube propio (deriva del pipeline social vídeo)
- App móvil PWA con notificaciones de ejercicios
- Marketplace de entrenadores
- Comunidad cerrada de pago
- Producto físico (cuaderno impreso vendido)
- Curso online de pago para padres

---

## Acciones manuales del usuario (fuera del repo)

1. **Aprobación Google AdSense** — sitio ya con script de verificación + 14 artículos. Tras aprobación: crear ad units → pasar slot IDs → pegar en `<AdSlot>`.
2. **Indexación SEO** — GSC sitemap reenviado 2026-04-26. Indexación realista 4-8 semanas.
3. **Forzar reindex** en GSC > Inspección de URL para 5 URLs prioritarias (home, /ejercicios/, balón, botas, /sobre/) — tope ~10/día.
4. **Decidir VPS Hetzner deploy** — para Fase 5 del Content Manager (acceso remoto + auth).

---

## Métricas y revisión

- **Sprint review (cada sesión cerrada):** actualizar `FlujoTrabajo.md` + memoria sprint con qué cerró, qué quedó, qué entra.
- **Trimestral:** revisar `MarcaPosicionamiento.md` con datos reales de audiencia.
- **Mensual:** review KPIs en GSC + GA4 + AdSense + Amazon.

---

## Cómo crear un issue desde este plan

```bash
gh issue create \
  --title "[S8] Squad B: artículo beneficios-futbol-ninos-salud" \
  --label "sprint/8,tipo/content,prio/alta" \
  --body "Ver docs/PlanTrabajo.md sprint 8 squad B item #1. DoD: ver convenciones."
```
