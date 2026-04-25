# Flujo de Trabajo — Estado actual

> Documento vivo. Actualizar al cierre de cada sprint o al cambiar de fase.
> Backlog completo en `PlanTrabajo.md`.

---

## 📍 Estado actual

- **Fecha:** 2026-04-25
- **Fase:** 0 — Pre-bootstrap (planificación cerrada, código sin empezar)
- **Sprint activo:** ninguno (próximo: **Sprint 1 — Bootstrap**, arranca al confirmar plan)
- **Bloqueantes:** ninguno

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

---

## 🎯 Próximos pasos inmediatos (top 5)

1. **Comprar dominio** `futbolparaninos.club` en Hostinger o Cloudflare Registrar
2. **Crear repo GitHub** `webfutbolninos` (privado al inicio, público al lanzar)
3. **Inicializar Astro 5 + Tailwind 4** con tokens de `DisenoUI.md`
4. **Diseñar logo MiniGol Club** (2-3 propuestas, decidir antes de fin de sprint 1)
5. **Conectar repo a Cloudflare Pages** y obtener primer deploy verde

---

## 📊 Métricas (actualizar mensual)

| Métrica | Objetivo año 1 | Actual | Última medición |
|---------|----------------|--------|-----------------|
| Artículos publicados | 50 | 0 | — |
| Visitas/mes (GA4) | 30.000 | 0 | — |
| Suscriptores newsletter | 1.000 | 0 | — |
| Ingresos AdSense ($) | 200/mes | 0 | — |
| Conversiones Amazon (clicks → ventas) | 50/mes | 0 | — |
| Backlinks dofollow DA>30 | 10 | 0 | — |
| CWV "Good" en CrUX | 100% URLs | n/a | — |

---

## 🔄 Sprint actual — (sin sprint activo)

> Cuando empiece Sprint 1, sustituir esta sección con el detalle del sprint en curso usando el template inferior.

### Template de sprint en curso

```
## 🔄 Sprint N — [nombre] (semanas X-Y)

### Objetivo
[1 frase]

### En progreso
- [ ] N.X tarea (PR #XX) — owner

### Cerradas en este sprint
- [x] N.X tarea (PR #XX, mergeado YYYY-MM-DD)

### Bloqueadas / paradas
- N.X — motivo

### Notas / aprendizajes
- ...

### Siguiente sprint planificado
[Link a sección PlanTrabajo.md]
```

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

---

## ⚠️ Riesgos abiertos

| Riesgo | Mitigación | Estado |
|--------|------------|--------|
| AdSense rechazo inicial (contenido insuficiente) | Tener 10+ artículos antes de solicitar | Plan en sprint 3 |
| Mundial 2026 (jun-jul) — perdemos pico si no llegamos a tiempo | Bloque 3 (5 artículos Mundial) prioritario en sprints 4-5 | Tracking |
| Identidad de autor pendiente — afecta E-E-A-T | Decidir en sprint 1 (persona real recomendada) | Abierto |
| Dependencia única de SEO orgánico | Pinterest activo desde mes 2, newsletter desde mes 5 | Plan |

---

## 📝 Cómo actualizar este documento

- **Al cerrar sprint:** mover tareas de "En progreso" → "Cerradas", añadir aprendizajes, actualizar métricas si toca
- **Al iniciar sprint:** copiar tareas seleccionadas de `PlanTrabajo.md`, marcar owner si aplica
- **Al tomar decisión arquitectónica:** registrar ADR en `Arquitectura.md` §13 + añadir fila aquí
- **Mensual:** actualizar tabla de métricas con datos GA4/GSC/AdSense
- **Trimestral:** revisar `MarcaPosicionamiento.md` con datos reales
