# Plan de Trabajo — Web Fútbol para Niños

> Backlog priorizado en sprints de 2 semanas. Estado actual en `FlujoTrabajo.md`.

---

## Convenciones

- **Sprint = 2 semanas.**
- **Issue = task GitHub.** Labels: `tipo/feat`, `tipo/content`, `tipo/seo`, `tipo/infra`, `tipo/design`, `tipo/bug` + `prio/alta|media|baja` + `sprint/N`.
- **Definition of Done genérica:**
  - PR mergeado a `main`
  - Lighthouse CI pasa (Perf ≥90, A11y ≥95, SEO=100)
  - Type-check + lint sin errores
  - Si toca contenido: revisado SEO (title, meta, H1 único, alt text, internal linking)
  - Documentación actualizada si cambia stack o convenciones

---

## Roadmap a 6 meses

| Fase | Sprints | Objetivo |
|------|---------|----------|
| **0 — Bootstrap** | S1 | Repo, Astro inicializado, deploy Cloudflare, CI verde, dominio |
| **1 — Esqueleto** | S2-S3 | Layouts base, content collections, primer artículo de prueba publicado, AdSense aprobado |
| **2 — Lanzamiento** | S4-S6 | 10 artículos publicados, GSC verificado, sitemap indexado, tracking funcionando |
| **3 — Crecimiento** | S7-S10 | 30 artículos, comparativas Amazon, primeros recursos descargables, Pinterest activo |
| **4 — Monetización plena** | S11-S12 | Newsletter activo, optimización slots ad, A/B test CTAs |

---

## Sprint 1 — Bootstrap (semanas 1-2)

**Objetivo:** Tener el proyecto desplegado en producción con un "hello world" navegable, dominio apuntando, CI verde.

| # | Issue | Prioridad | Estimación |
|---|-------|-----------|------------|
| 1.1 | Crear repo GitHub `webfutbolninos`, branch protection en `main` | alta | 1h |
| 1.2 | Inicializar Astro 5 + Tailwind 4 + TS strict | alta | 2h |
| 1.3 | Configurar `tsconfig` paths `@/`, eslint, prettier | alta | 1h |
| 1.4 | Crear `astro.config.mjs` con `@astrojs/sitemap`, `@astrojs/mdx`, `@astrojs/tailwind` | alta | 1h |
| 1.5 | Crear `src/styles/global.css` con tokens de DisenoUI.md | alta | 2h |
| 1.6 | Implementar `BaseLayout.astro` con head SEO, meta básicos, fonts preload | alta | 2h |
| 1.7 | Página `index.astro` con hero placeholder | alta | 1h |
| 1.8 | Página `404.astro` | alta | 30min |
| 1.9 | Workflow `ci.yml`: typecheck + lint + build en PR | alta | 1h |
| 1.10 | Conectar repo a Cloudflare Pages, primer deploy verde | alta | 1h |
| 1.11 | Comprar dominio `futbolparaninos.club` (decisión cerrada en MarcaPosicionamiento §4.3) | alta | 30min |
| 1.12 | Apuntar dominio a Cloudflare Pages, HTTPS activo | alta | 1h |
| 1.16 | (Opcional) Comprar dominios defensivos `minigolclub.com` y `minigol.club` con redirect 301 | baja | 30min |
| 1.13 | Crear páginas legales: privacidad, cookies, aviso legal, contacto | alta | 3h |
| 1.14 | Setup `_headers` con CSP básica + cache rules | media | 1h |
| 1.15 | Workflow `lighthouse.yml` con gates configurados | media | 1h |

**Salida del sprint:** dominio.com responde con home + 404 + páginas legales, deploy automático en `main`, CI verde.

---

## Sprint 2 — Layouts y content collections (semanas 3-4)

**Objetivo:** Sistema editorial funcionando. Crear un artículo de prueba debe ser solo crear un `.mdx`.

| # | Issue | Prioridad | Estimación |
|---|-------|-----------|------------|
| 2.1 | `src/content/config.ts` con schemas Zod (articulos, categorias, recursos, autores) | alta | 3h |
| 2.2 | Seed 6 categorías en `src/content/categorias/` con metadata + imagen cover | alta | 2h |
| 2.3 | Seed 1 autor en `src/content/autores/` | alta | 30min |
| 2.4 | Componente `<ArticleCard>` con todas las variantes responsive | alta | 3h |
| 2.5 | Componente `<CategoryHero>` | alta | 2h |
| 2.6 | Componente `<Breadcrumb>` con JSON-LD `BreadcrumbList` | alta | 2h |
| 2.7 | Componente `<Header>` (logo, nav desktop, drawer mobile, search trigger) | alta | 4h |
| 2.8 | Componente `<Footer>` (4 cols desktop, accordion mobile, links legales) | alta | 2h |
| 2.9 | Layout `ArticleLayout.astro` con prose + TOC sticky desktop | alta | 4h |
| 2.10 | Layout `CategoryLayout.astro` con grid + paginación | alta | 3h |
| 2.11 | Página `[categoria]/index.astro` (listado dinámico) | alta | 2h |
| 2.12 | Página `[categoria]/[slug].astro` (artículo dinámico) | alta | 2h |
| 2.13 | Helper `lib/seo.ts` para JSON-LD `Article` + OG tags | alta | 2h |
| 2.14 | Setup OG image dinámica `/og/[slug].png.ts` (Satori) | media | 4h |
| 2.15 | Generación RSS `/rss.xml.ts` | media | 1h |
| 2.16 | Componente `<RelatedArticles>` (por tags + categoría) | media | 2h |
| 2.17 | Publicar artículo de prueba real "5 ejercicios fútbol niños 6 años" | alta | 2h |

**Salida del sprint:** crear un `.mdx` nuevo + cover image = artículo publicado con SEO completo.

---

## Sprint 3 — SEO técnico + AdSense submit (semanas 5-6)

**Objetivo:** Sitio listo para crawl + solicitud AdSense enviada (proceso de aprobación tarda 2-4 semanas).

| # | Issue | Prioridad | Estimación |
|---|-------|-----------|------------|
| 3.1 | Verificar dominio en Google Search Console + Bing Webmaster | alta | 1h |
| 3.2 | Submit sitemap.xml en GSC + Bing | alta | 30min |
| 3.3 | Configurar GA4 + Cloudflare Web Analytics | alta | 2h |
| 3.4 | Banner consentimiento cookies (klaro o cookieconsent v3) con Consent Mode v2 | alta | 4h |
| 3.5 | Implementar componente `<AdSlot>` con label "Publicidad" + placeholder reservado | alta | 3h |
| 3.6 | Implementar `<InArticleAd position="top|mid|bottom">` | alta | 2h |
| 3.7 | Solicitar AdSense con sitio + 10 artículos publicados | alta | 1h |
| 3.8 | Solicitar Amazon Afiliados España (3 ventas en 180 días para mantener) | alta | 1h |
| 3.9 | Componente `<AmazonCard>` con imagen + título + CTA + tag tracking | alta | 3h |
| 3.10 | Componente `<AffiliateDisclosure>` | alta | 30min |
| 3.11 | Search interna con Pagefind + página `/buscar` | media | 3h |
| 3.12 | Publicar 5 artículos más (total 6) | alta | 12h |
| 3.13 | About/Sobre nosotros con foto autor + bio (E-E-A-T) | alta | 1h |
| 3.14 | Auditoría SEO inicial: schema validator, Mobile-Friendly Test, PageSpeed Insights | alta | 2h |

**Salida del sprint:** ≥10 artículos publicados, AdSense submitted, GSC indexando, tracking activo.

---

## Sprint 4-6 — Volumen de contenido + iteración (semanas 7-12)

**Objetivo:** Llegar a 20 artículos lanzados (núcleo según análisis ChatGPT) + primeros 2 recursos descargables, aprobar AdSense, primeras conversiones afiliados.

**Cadencia:** 2 artículos/semana = 12 nuevos en 6 semanas (ya hay 10 de sprint 2-3 → 22 totales).

### Backlog de contenido — Lanzamiento (los 20 imprescindibles)

> Plan consolidado con `docs/AnalisisWebFutbolparaNiños_ChatGPT.md`. Reordenar tras keyword research real con Ahrefs/GSC.

#### 🟢 BLOQUE 1 — Ejercicios (tráfico + monetización) — 7 artículos

1. Ejercicios de fútbol para niños de 4 a 6 años (guía completa)
2. Ejercicios de fútbol para niños de 7 a 10 años
3. 10 ejercicios de fútbol para hacer en casa con niños
4. Ejercicios de fútbol sin balón para niños
5. Entrenamiento de fútbol infantil para principiantes
6. Cómo enseñar fútbol a un niño desde cero
7. Ejercicios de coordinación para niños en fútbol

#### 🟣 BLOQUE 2 — Juegos (viral + engagement) — 4 artículos

8. 10 juegos de fútbol para niños divertidos y fáciles
9. Juegos de fútbol para niños en casa (sin material)
10. Juegos de fútbol para cumpleaños infantiles
11. Dinámicas de grupo para entrenamientos de fútbol infantil

#### 🔴 BLOQUE 3 — Mundial (pico de tráfico) — 5 artículos

12. Explicación del Mundial de fútbol para niños
13. Calendario del Mundial para niños (descargable)
14. Las mejores selecciones del Mundial explicadas para niños
15. Jugadores famosos del Mundial para niños
16. Actividades del Mundial para hacer en casa con niños

#### 🟡 BLOQUE 4 — Descargables (monetización futura) — 2 artículos

17. Plantillas de fútbol para niños (PDF gratis)
18. Dibujos de fútbol para colorear (descarga gratis)

#### 🔵 BLOQUE 5 — Contenido para padres (SEO fuerte) — 2 artículos

19. Beneficios del fútbol en niños (físicos y mentales)
20. A qué edad empezar fútbol los niños

### Backlog de features (Sprints 4-6)

| # | Issue | Prioridad |
|---|-------|-----------|
| 4.1 | Filtros sticky en categoría (edad, dificultad) | alta |
| 4.2 | Componente `<ResourceCard>` + página `/recursos` | alta |
| 4.3 | Primer recurso descargable: "Cuaderno de jugadas 7-9 años" (PDF) | alta |
| 4.4 | Componente `<ComparisonTable>` para reviews Amazon | media |
| 4.5 | Schema `Product` + reviews para artículos comparativa | media |
| 4.6 | Lazy load images con blur placeholder | media |
| 4.7 | Newsletter capture (Buttondown free tier) — preparar para fase posterior | baja |
| 4.8 | Pinterest meta tags + plugin auto-share images | media |
| 4.9 | Optimización CWV post-deploy (audit real con datos GSC) | alta |
| 4.10 | A/B test posición ads (top vs después intro) | baja |

---

## Sprint 7-10 — Crecimiento (semanas 13-20)

**Objetivo:** Llegar a 40-50 artículos, primer mes con > 1000 visitas, 5+ conversiones afiliado/semana, Pinterest activo (mes 2 según plan ChatGPT).

### Funcionalidades nuevas

| # | Issue | Prioridad |
|---|-------|-----------|
| 7.1 | Comentarios con Giscus (GitHub Discussions backend) | media |
| 7.2 | Sistema de tags + páginas `/tag/[slug]` | media |
| 7.3 | Página de autor `/autores/[slug]` | media |
| 7.4 | Sticky footer ad mobile (A/B test) | baja |
| 7.5 | Web Stories AMP para Google Discover | media |
| 7.6 | Decap CMS (Netlify CMS fork) si entra editor no-técnico | baja |
| 7.7 | Dashboard interno (página privada) con métricas resumen | baja |
| 7.8 | Pinterest auto-pins desde RSS (Tailwind/Buffer) | alta |
| 7.9 | Templates Canva (10) para Pinterest según diseño visual | alta |

### Backlog contenido continuo (post 20 iniciales)

**Ampliación BLOQUE 1 — Ejercicios:**
- Ejercicios de portero para niños 8-10 años
- Conducción de balón para principiantes
- Cómo enseñar a chutar paso a paso
- Calentamiento 10 min para niños
- Plan entrenamiento 4 semanas
- Circuito completo niños 7-9
- Ejercicios cabeceo seguro
- Velocidad y agilidad para futbolistas niños

**Ampliación BLOQUE 2 — Juegos:**
- Juegos con globos para 4-6 años
- Juegos en piscina (verano)
- Juegos con conos: 8 ideas
- Juegos cooperativos (sin competición)
- Juegos para días de lluvia
- Juegos para niños tímidos

**Nuevo BLOQUE 6 — LaLiga (categoría original CLAUDE.md):**
- Calendario LaLiga explicado para niños
- Equipos de LaLiga para conocer con tus hijos
- Estadios de LaLiga: ranking visual
- Jugadores LaLiga modelos a seguir

**Comparativas Amazon (alta conversión):**
- Mejores balones de fútbol para niños 2026
- Mejores porterías plegables para jardín
- Mejores conos / setas / picas para entrenamiento
- Mejor equipación niño 6-12 años
- Mejores botas fútbol niño según superficie

---

## Sprint 11-12 — Monetización plena (semanas 21-24)

**Objetivo:** Ingresos sostenibles AdSense + Amazon. Newsletter > 200 subs.

| # | Issue | Prioridad |
|---|-------|-----------|
| 11.1 | Lead magnet "10 mejores ejercicios PDF" gated por email | alta |
| 11.2 | Welcome email automation (Buttondown) | alta |
| 11.3 | Newsletter semanal — primera campaña | alta |
| 11.4 | Optimización ad slots con datos reales (heatmap + GA4) | alta |
| 11.5 | Refactor accessibility audit completo (axe, manual screen reader) | alta |
| 11.6 | Audit performance: bundle analysis, third-party scripts | media |
| 11.7 | Plan i18n para fase 2026 H2 (es-MX, es-AR) | baja |

---

## Backlog "icebox" (sin sprint asignado)

Ideas y mejoras a evaluar más adelante. **No empezar sin priorizar primero.**

- **Resultados en directo de competiciones (Mundial 2026 → LaLiga → Champions → Copa del Rey)** — widget interactivo tipo "tarjeta Google" para ver fixtures, resultados, clasificación y bracket de eliminatorias. Diseño kid-friendly. Empieza por Mundial 2026 como pico de tráfico, luego se extiende a LaLiga/Champions. Análisis técnico y de producto en [docs/seo/ResultadosEnDirecto.md](seo/ResultadosEnDirecto.md). **No es MVP** — evaluar para fase post-lanzamiento (Sprint 7+ candidato).
- Calculadora "¿en qué categoría jugaría mi hijo?" (interactiva)
- Quiz "¿qué jugador eres?" para niños (viralidad)
- Vídeo embebido propio (canal YouTube)
- App móvil PWA con notificaciones de ejercicios
- Marketplace de entrenadores
- Comunidad cerrada de pago (Discord/Circle)
- Producto físico (cuaderno impreso vendido)
- Curso online de pago para padres

---

## Métricas y revisión

- **Daily standup:** no aplica (solo dev). Revisión personal 5 min/día.
- **Sprint review (cada 2 semanas):** actualizar `FlujoTrabajo.md` con qué cerró, qué quedó, qué entra.
- **Trimestral:** revisar `MarcaPosicionamiento.md` con datos reales de audiencia.
- **Mensual:** review de KPIs en GSC + GA4 + AdSense + Amazon.

---

## Cómo crear un issue desde este plan

```bash
gh issue create \
  --title "[S2] 2.4 Componente ArticleCard" \
  --label "sprint/2,tipo/feat,prio/alta" \
  --body "Ver docs/PlanTrabajo.md sprint 2 task 2.4. DoD: ver convenciones en cabecera del doc."
```

(Cuando exista repo GitHub configurado.)
