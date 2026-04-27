# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Idioma:** este proyecto se trabaja en **español**. Toda comunicación, contenido publicado, naming de variables editoriales (categorías, tags, slugs cuando sean human-readable) y documentación va en español. Código (variables JS/TS, funciones, tipos) en inglés.

---

## 1. Qué es MiniGol Club

**Marca:** MiniGol Club · **Dominio:** `minigolclub.com`

Sitio de contenido SEO sobre fútbol infantil para padres con hijos de 4 a 12 años. Monetización: AdSense + Amazon Afiliados + recursos descargables PDF (futuro lead-magnet).

**Tres documentos que NO se inventan, se leen:**
- [docs/Arquitectura.md](docs/Arquitectura.md) — stack, estructura de carpetas, ADRs, content collections
- [docs/DisenoUI.md](docs/DisenoUI.md) — tokens de diseño, componentes, layouts, anti-patrones visuales
- [docs/MarcaPosicionamiento.md](docs/MarcaPosicionamiento.md) — voz, tono, audiencia, posicionamiento

**Estrategia SEO (definida por el equipo de agentes el 2026-04-25, vinculante):**
- [docs/seo/README.md](docs/seo/README.md) — índice ejecutivo: 6 pilares, primeros 5 artículos, líneas rojas, próximos pasos
- [docs/seo/KeywordResearch.md](docs/seo/KeywordResearch.md) — 60+ keywords priorizadas P0/P1/P2, 6 pilares temáticos, 20 money keywords Amazon
- [docs/seo/AnalisisCompetencia.md](docs/seo/AnalisisCompetencia.md) — top competidores SERP español, gaps, 20 PAA, ángulos de diferenciación
- [docs/seo/ArquitecturaSEO.md](docs/seo/ArquitecturaSEO.md) — silos, URLs, internal linking, schema markup, anti-canibalización
- [docs/seo/PlanContenidos.md](docs/seo/PlanContenidos.md) — calendario editorial mayo→julio 2026, briefs de los 10 primeros artículos
- [docs/seo/EstrategiaEEAT.md](docs/seo/EstrategiaEEAT.md) — mapa YMYL, autores, página /sobre/, link earning, roadmap E-E-A-T 6 meses
- [docs/seo/ResultadosEnDirecto.md](docs/seo/ResultadosEnDirecto.md) — **post-MVP.** Widget resultados Mundial 2026 → LaLiga → Champions → Copa del Rey

**Estado vivo:**
- [docs/PlanTrabajo.md](docs/PlanTrabajo.md) — backlog en sprints
- [docs/FlujoTrabajo.md](docs/FlujoTrabajo.md) — qué se está haciendo ahora

**Análisis externo de referencia (no editar, solo consultar):**
- [docs/AnalisisWebFutbolparaNiños_ChatGPT.md](docs/AnalisisWebFutbolparaNiños_ChatGPT.md)

**Regla de uso:** todos los docs anteriores son vinculantes para CUALQUIER decisión técnica, editorial, de diseño o de producto. Antes de proponer una solución, leer los relevantes. Si hay conflicto entre lo pedido y lo documentado, marcarlo explícitamente y proponer actualización del doc en lugar de saltárselo.

---

## 2. Stack y comandos

**Stack confirmado:** Astro 6 · TypeScript strict · Tailwind 4 · MDX · Pagefind · Cloudflare Workers (modelo unificado, no Pages legacy) · Node ≥22.12.

**Fuentes self-host** vía `@fontsource-variable/{fredoka,nunito,caveat,jetbrains-mono}` (variable fonts, latin subset, preload de Fredoka + Nunito en BaseLayout). NO cargar desde fonts.googleapis.com.

**Comandos:**

```bash
pnpm install              # instalar dependencias
pnpm dev                  # dev server (localhost:4321)
pnpm build                # build producción → dist/ + pagefind
pnpm preview              # preview del build local
pnpm typecheck            # astro check (TS strict)
pnpm lint                 # eslint
pnpm format               # prettier
```

**Workflow de contenido nuevo:**

1. Crear `src/content/articulos/<categoria>/<slug>.mdx`
2. Frontmatter completo según schema Zod en `src/content.config.ts` (atención: NO `src/content/config.ts`, cambió en Astro 6)
3. Campos obligatorios: title, description, keyword, categoria, autor, pubDate, cover, coverAlt, edadMin, edadMax, **nivel** (`facil`/`media`/`reto`)
4. Cover image en `public/articulos/<categoria>/<slug>.jpg` (1200×750, generador en `scripts/generate-article-cover.mjs`)
5. `pnpm dev` para previsualizar
6. PR → preview deploy automático Cloudflare Workers → CI (typecheck + lint + build + Lighthouse) → merge a `main` → producción

---

## 3. Convenciones de código y commits

- **TypeScript strict.** No usar `any`. No `// @ts-ignore`. Validar todo con Zod en boundaries.
- **Componentes Astro** con script TS en `---` y estilos scoped (no Tailwind dentro de `<style>`, salvo necesidad clara).
- **Naming:**
  - Componentes: `PascalCase.astro` (ej. `ArticleCard.astro`)
  - Helpers: `camelCase.ts` (ej. `getRelatedArticles.ts`)
  - Slugs: `kebab-case` en español (ej. `ejercicios-fundamental-balon-6-anos`)
- **Imports:** alias `@/` para `src/`. Sin imports relativos largos `../../../`.
- **Commits:** Conventional Commits en español. Ejemplos: `feat: añadir componente ArticleCard`, `content: publicar guía ejercicios 4-6 años`, `fix: corregir CLS en hero móvil`.
- **Branches:** `feat/`, `fix/`, `content/`, `seo/`, `infra/`. Trunk-based, branches cortas.

---

## 4. Reglas de contenido (no negociables)

Estas reglas las verifica también Lighthouse CI; mejor cumplirlas en el origen que arreglarlas después.

- **Frontmatter completo:** title (≤70), description (120–160), edadMin/Max, categoría, autor, cover, coverAlt, keyword. Sin estos campos, el build falla.
- **H1 único** = título del artículo. Resto de jerarquía sin saltos (H2 → H3, no H2 → H4).
- **Imágenes:** SIEMPRE `<Image />` de Astro. SIEMPRE alt descriptivo. SIEMPRE width/height (= cero CLS).
- **Internal linking:** mínimo 2 links a otros artículos del sitio por pieza.
- **Meta description única** por URL. No duplicar entre artículos similares.
- **Long-tail keyword en:** title, H1, primer párrafo, slug, alt de cover.
- **Lectura mobile primero:** párrafos cortos (≤4 líneas), listas frecuentes, subtítulos cada 200–300 palabras.

---

## 5. Reglas de UI/UX (no negociables)

> Identidad visual: **"Cuaderno de Campo"** — papel crema, dorsales numéricos, marker amarillo, manuscritos azules. Detalle completo en `docs/DisenoUI.md`.

**Tipografía** (4 familias variable, self-host):
- **Fredoka** (display: H1-H6, hero, dorsales)
- **Nunito** (body: párrafos, UI)
- **Caveat** (manuscrito: anotaciones, etiquetas tipo "¡no le grites!")
- **JetBrains Mono** (mono: timestamps, dorsales pequeños, etiquetas técnicas)

**Paleta cuaderno** (tokens en `src/styles/global.css`):
- `--color-paper` crema, `--color-marker` amarillo, `--color-handwritten` azul tinta
- 6 colores de marca por categoría (primary blue, secondary green, accent amber, fun pink, energy red, info cyan)
- Dark mode automático: brand 600-series → 400-series para WCAG
- Texto sobre badge/dorsal de color → SIEMPRE `var(--color-on-brand)` (negro fijo, WCAG-safe en ambos modos)

**Nunca se viola:**
- ❌ **No emoji como icono estructural.** Lucide via `astro-icon`.
- ❌ **No Comic Sans / Comic Neue / Inter para display.**
- ❌ **No `text-white` sobre bg de marca** (rompe WCAG en dark mode brand-400). Usar `--color-on-brand` o `.btn .btn-primary`.
- ❌ **No popups intersticiales** (penaliza Google, viola política AdSense).
- ❌ **No animaciones decorativas** ni autoplay de vídeo/audio.
- ❌ **No más de 3 ads en pantalla** simultánea ni ad sobre el H1.
- ❌ **No cargar fuentes desde Google Fonts.** Self-host via `@fontsource-variable/*`.
- ✅ Todo `<AdSlot>` con label "Publicidad" + min-height reservado.
- ✅ **Touch targets ≥ 44px en mobile.** `.btn` y `.cat-filters__chip` ya cumplen — al crear nuevo interactivo, partir de esa base.
- ✅ Contraste ≥ 4.5:1 verificado en `prefers-color-scheme: light` Y `dark`.
- ✅ `prefers-reduced-motion` respetado.
- ✅ Focus visible (ring 3px) en todo elemento interactivo.

**Checklist antes de PR de UI nueva:**
1. ¿Touch ≥44px en cada `<button>`/`<a>` interactivo? Verificar también en chips, badges-link, close buttons.
2. ¿Texto contrasta ≥4.5:1 en light Y dark? (La trampa: tokens brand idénticos en ambos modos — siempre verificar dark si toca color de marca).
3. ¿Usa tokens existentes (`--color-*`) en lugar de hardcodear hex?
4. `pnpm lighthouse` local antes de pushear (ver §6).

---

## 6. SEO técnico (gates en CI)

Lighthouse CI corre en `pull_request` Y en `push: main` (regresion guard). Bloquea (error) PRs que rompan estos umbrales:

| Métrica | Umbral CI | Aspiracional |
|---------|-----------|--------------|
| Performance | ≥85 | ≥90 |
| Accessibility | ≥95 | 100 |
| SEO | 100 | 100 |
| Best Practices | ≥90 | 100 |
| LCP | ≤4000ms (warn) | <2500ms |
| CLS | <0.1 (error) | <0.1 |
| INP | <200ms | <200ms |

LCP está en warn @4000ms (frontera Good/Needs-Improvement) por la realidad de CI emulado con throttling Slow 4G + GTM/AdSense scripts. Real-world LCP es ~1.8s. Aspiracional <2500ms cuando se mueva GTM a post-consent.

Cada artículo debe tener: canonical, OG completo, Twitter card, JSON-LD `Article` + `BreadcrumbList`, breadcrumbs visibles, links internos, sitemap entry.

**Para correr Lighthouse local antes de pushear:**
```bash
pnpm build
npx -y @lhci/cli@0.14.x autorun
```

---

## 7. Monetización — política

- **AdSense:** sólo slots planificados en `docs/Arquitectura.md` §9. No usar Auto Ads sin revisión.
- **Amazon Afiliados:** componente `<AmazonCard>` + `<AffiliateDisclosure>` obligatorio al inicio del artículo si hay enlaces afiliados.
- **Política privacidad + cookies + aviso legal** publicadas ANTES de activar cualquier ad.
- **Consent Mode v2** (Google) implementado. Cookies con banner conforme RGPD.
- **Datos de menores:** prohibido recoger. Newsletter solo para >18 declarado en checkbox.

---

## 8. Stack de Claude Code recomendado para este proyecto

Skills externas que aceleran el trabajo (instalar manualmente bajo `~/.claude/agents/` o `~/.claude/skills/`):

### 8.1 Agents instalados localmente (`~/.claude/agents/`)

Instalados desde [wshobson/agents](https://github.com/wshobson/agents) el 2026-04-25:

**SEO content creation:**
- `seo-content-planner` — planifica estructura del artículo (H1/H2/H3, intent, internal linking)
- `seo-content-writer` — redacta el artículo con buenas prácticas SEO on-page
- `seo-content-auditor` — audita un artículo ya escrito (gaps SEO, mejoras)

**SEO technical optimization:**
- `seo-keyword-strategist` — keyword research y validación long-tail
- `seo-meta-optimizer` — title, meta description, OG tags
- `seo-snippet-hunter` — optimiza para featured snippets
- `seo-structure-architect` — estructura site, silos, internal linking

**SEO analysis & monitoring:**
- `seo-authority-builder` — link building y E-E-A-T
- `seo-cannibalization-detector` — detecta canibalización entre URLs
- `seo-content-refresher` — actualizar contenido viejo

**Content marketing:**
- `content-marketer` — estrategia editorial general
- `search-specialist` — búsquedas web especializadas

### 8.2 Skills locales del usuario (Claude Code built-in)

- `ui-ux-pro-max` — sistema de diseño (ya usado para `DisenoUI.md`)
- `system-architect` — arquitectura (ya usado para `Arquitectura.md`)
- `web-developer` — proyecto Astro (activar proactivamente al editar `.astro`)
- `progress-tracker` — sincroniza `PlanTrabajo.md` y `FlujoTrabajo.md` al cerrar sprint
- `database-architect`, `api-designer`, `team-manager`, etc. — disponibles si el alcance crece

### 8.3 Workflow recomendado por artículo

1. `seo-keyword-strategist` — validar keyword principal + secundarias del artículo
2. `seo-content-planner` — estructura H1/H2/H3 + intent + internal links
3. `seo-content-writer` — borrador
4. `seo-meta-optimizer` — title + meta description + OG
5. `seo-snippet-hunter` — pasada para featured snippets si la keyword lo permite
6. `seo-content-auditor` — auditoría final antes de PR
7. (Mensual) `seo-cannibalization-detector` y `seo-content-refresher` para mantenimiento

---

## 9. Cuándo actualizar qué documento

| Si cambia... | Actualizar |
|--------------|------------|
| Stack, librería, hosting, decisión técnica | `Arquitectura.md` §13 (nuevo ADR) + `FlujoTrabajo.md` |
| Token de diseño, componente nuevo, anti-patrón | `DisenoUI.md` |
| Voz, tono, persona, naming, identidad | `MarcaPosicionamiento.md` |
| Tarea concreta del backlog | `PlanTrabajo.md` (mover) + crear issue GitHub |
| Sprint cerrado, tarea cerrada, métrica mensual | `FlujoTrabajo.md` |
| Keyword research, pilares, money keywords | `docs/seo/KeywordResearch.md` |
| SERP, competidores, PAA, gaps detectados | `docs/seo/AnalisisCompetencia.md` |
| Silos, URLs, internal linking, schema, anti-canibalización | `docs/seo/ArquitecturaSEO.md` |
| Calendario editorial, briefs, lead-magnets | `docs/seo/PlanContenidos.md` |
| YMYL, autores, página /sobre/, link earning | `docs/seo/EstrategiaEEAT.md` |
| Widget resultados en directo (Mundial/LaLiga/Champions) | `docs/seo/ResultadosEnDirecto.md` |

**Regla:** si hay conflicto entre código y doc, gana el doc — y el PR debe ajustar el código. Si el doc está obsoleto, el PR debe ajustar el doc.

---

## 10. Modelo Claude por tipo de tarea

**Regla general:** Opus para decisiones estratégicas irrepetibles; Sonnet para implementación; Haiku para tareas mecánicas repetitivas.

Cambiar modelo antes de invocar un skill: `/model haiku`, `/model sonnet`, `/model opus`.

| Tipo de tarea | Skill | Modelo |
|---------------|-------|--------|
| Bootstrap infra, CI, deploy, componentes UI | `web-developer` | Sonnet |
| Setup GitHub, branch protection, workflows | `github-expert` | Sonnet |
| Schemas Zod, content collections, rutas Astro | `web-developer` | Sonnet |
| Diseño de componentes nuevos | `ui-ux-pro-max` + `web-developer` | Sonnet |
| **Redactar cada artículo nuevo** (brief claro) | `seo-content-writer` | **Haiku** |
| Keyword validation por artículo | `seo-keyword-strategist` | Haiku |
| Meta title + description por artículo | `seo-meta-optimizer` | Haiku |
| Featured snippets por artículo | `seo-snippet-hunter` | Haiku |
| Auditoría SEO pre-PR de cada artículo | `seo-content-auditor` | Haiku |
| Refresh de artículos viejos | `seo-content-refresher` | Haiku |
| Auditoría SEO completa del sitio | `seo-content-auditor` | Sonnet |
| Internal linking y silos del sitio | `seo-structure-architect` | Sonnet |
| Revisión de canibalización (mensual) | `seo-cannibalization-detector` | Sonnet |
| Implementación AdSense, consent, MonetIzación | `web-developer` | Sonnet |
| **Cambio de stack, ADR nuevo** | `system-architect` | **Opus** |
| **Estrategia de contenido nueva, pivote editorial** | `content-marketer` | **Opus** |
| **Decisión de producto de alto impacto** | — | **Opus** |

> Haiku es 20× más barato que Opus y suficiente para tareas con brief bien definido. La mayoría del trabajo de contenido (redactar, auditar, optimizar meta) es Haiku.
