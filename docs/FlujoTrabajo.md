# Flujo de Trabajo — Estado actual

> Documento vivo. Actualizar al cierre de cada sprint o al cambiar de fase.
> Backlog completo en `PlanTrabajo.md`.

---

## 📍 Estado actual

- **Fecha:** 2026-04-25
- **Fase:** 1 — Esqueleto (sistema editorial en marcha)
- **Sprint activo:** **Sprint 2 — Content collections + primer artículo** (PR #10, pendiente de CI verde)
- **Bloqueantes:** CI pasando (pnpm fix aplicado), falta merge de PR #10 a main

---

## ✅ Hitos completados

| Fecha | Hito |
|-------|------|
| 2026-04-25 | Brief de producto inicial (CLAUDE.md original) |
| 2026-04-25 | Análisis ChatGPT consolidado (`AnalisisWebFutbolparaNiños_ChatGPT.md`) |
| 2026-04-25 | Decisión de marca: **MiniGol Club** |
| 2026-04-25 | Decisión de dominio: **futbolparaninos.club** |
| 2026-04-25 | Decisión de stack: **Astro 5 + Tailwind 4 + Cloudflare Pages** (ADR-001, ADR-002) |
| 2026-04-25 | Sistema de diseño v1 definido (`DisenoUI.md`) |
| 2026-04-25 | Posicionamiento de marca v1 definido (`MarcaPosicionamiento.md`) |
| 2026-04-25 | Backlog 6 meses + 20 artículos núcleo (`PlanTrabajo.md`) |
| 2026-04-25 | **Sprint 1 cerrado:** bootstrap Astro 5 + Tailwind 4, CI + Lighthouse, repo GitHub público, branch protection, labels, milestones |
| 2026-04-25 | **Sprint 2 en PR #10:** sistema editorial completo (ver detalle abajo) |

---

## 🎯 Próximos pasos inmediatos (top 5)

1. **Esperar CI verde** en PR #10 → mergear a `main`
2. **Conectar repo a Cloudflare Pages** (tarea 1.10 aplazada del Sprint 1)
3. **Comprar dominio** `futbolparaninos.club`
4. **Diseñar logo MiniGol Club** (afecta E-E-A-T y branding)
5. **Publicar OG image por defecto** `/og-default.jpg` (referenciada en BaseLayout, aún falta el asset)

---

## 📊 Métricas (actualizar mensual)

| Métrica | Objetivo año 1 | Actual | Última medición |
|---------|----------------|--------|-----------------|
| Artículos publicados | 50 | 1 (en PR) | 2026-04-25 |
| Visitas/mes (GA4) | 30.000 | 0 | — |
| Suscriptores newsletter | 1.000 | 0 | — |
| Ingresos AdSense ($) | 200/mes | 0 | — |
| Conversiones Amazon (clicks → ventas) | 50/mes | 0 | — |
| Backlinks dofollow DA>30 | 10 | 0 | — |
| CWV "Good" en CrUX | 100% URLs | n/a | — |

---

## 🔄 Sprint actual — Sprint 2 (semanas 3-4)

### Objetivo
Sistema editorial funcionando: crear un `.mdx` = artículo publicado con SEO completo.

### Cerradas en este sprint
- [x] 2.1 `content/config.ts` — schemas Zod (PR #10)
- [x] 2.2 Seed 6 categorías (PR #10)
- [x] 2.3 Seed 1 autor (PR #10)
- [x] 2.4 `<ArticleCard>` (PR #10)
- [x] 2.6 `<Breadcrumb>` con JSON-LD BreadcrumbList (PR #10)
- [x] 2.7 `<Header>` — logo, nav desktop, drawer mobile (PR #10)
- [x] 2.8 `<Footer>` (PR #10)
- [x] 2.9 `ArticleLayout` con prose + TOC sticky desktop + accordion mobile (PR #10)
- [x] 2.10 `CategoryLayout` con hero + grid + paginación (PR #10)
- [x] 2.11 Página `[categoria]/index.astro` (PR #10)
- [x] 2.12 Página `[categoria]/[slug].astro` (PR #10)
- [x] 2.13 `lib/seo.ts` — JSON-LD Article + BreadcrumbList + Organization (PR #10)
- [x] 2.15 RSS `/rss.xml.ts` (PR #10)
- [x] 2.16 `<RelatedArticles>` (PR #10)
- [x] 2.17 Artículo de prueba: *5 ejercicios de fútbol para niños de 6 años* (PR #10)

### Diferidas a Sprint 3
- [ ] 2.5 `<CategoryHero>` como componente independiente — inline en `CategoryLayout` es suficiente por ahora
- [ ] 2.14 OG image dinámica (Satori) — prioridad media, complejidad alta; entra en Sprint 3

### Bloqueantes actuales
- PR #10 pendiente de CI verde (fix de pnpm ya pusheado, esperando re-run)

### Notas / aprendizajes
- Astro 5 cambió la API de render: `render(entry)` importado desde `astro:content`, no `entry.render()`
- `pnpm/action-setup@v4` no acepta `version` si `packageManager` está en `package.json` — usar sin `version`
- En TypeScript strict, los callbacks de `getCollection` necesitan tipo explícito `CollectionEntry<'nombre'>`

### Siguiente sprint planificado
Sprint 3 — SEO técnico + AdSense submit (ver `PlanTrabajo.md`)

---

## 🧠 ADRs y decisiones recientes

> Lista resumen — el detalle de cada ADR vive en `Arquitectura.md` §13.

| ADR | Decisión | Fecha |
|-----|----------|-------|
| ADR-001 | Astro sobre Next.js / WordPress | 2026-04-25 |
| ADR-002 | Cloudflare Pages sobre Vercel/Hostinger | 2026-04-25 |
| ADR-003 | Markdown + content collections sobre headless CMS | 2026-04-25 |
| ADR-004 | Pagefind sobre Algolia | 2026-04-25 |
| ADR-005 | TypeScript strict desde día 1 | 2026-04-25 |
| ADR-006 | Repo público desde el inicio (desbloquea branch protection sin GitHub Pro) | 2026-04-25 |

---

## ⚠️ Riesgos abiertos

| Riesgo | Mitigación | Estado |
|--------|------------|--------|
| AdSense rechazo inicial (contenido insuficiente) | Tener 10+ artículos antes de solicitar | Plan en sprint 3 |
| Mundial 2026 (jun-jul) — perdemos pico si no llegamos a tiempo | Bloque 3 (5 artículos Mundial) prioritario en sprints 4-5 | Tracking |
| Imagen OG por defecto `/og-default.jpg` no existe aún | Crear asset o placeholder antes de deploy | Abierto |
| Logo MiniGol Club sin diseñar — afecta E-E-A-T | Decidir antes de lanzamiento público | Abierto |
| 3 vulnerabilidades moderadas en dependencias (Dependabot alerts) | Revisar y mergear PRs de Dependabot | Abierto |

---

## 📝 Cómo actualizar este documento

- **Al cerrar sprint:** mover tareas de "En progreso" → "Cerradas", añadir aprendizajes, actualizar métricas si toca
- **Al iniciar sprint:** copiar tareas seleccionadas de `PlanTrabajo.md`, marcar owner si aplica
- **Al tomar decisión arquitectónica:** registrar ADR en `Arquitectura.md` §13 + añadir fila aquí
- **Mensual:** actualizar tabla de métricas con datos GA4/GSC/AdSense
- **Trimestral:** revisar `MarcaPosicionamiento.md` con datos reales
