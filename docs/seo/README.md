# Estrategia SEO — MiniGol Club

> Definida por el equipo de agentes SEO el 2026-04-25. Estos 5 documentos forman la base sobre la que se construye el sitio. **Si hay conflicto entre código y estos docs, gana el doc** — el PR debe ajustar el código (regla CLAUDE.md §9).

---

## 📚 Documentos de la estrategia

| # | Documento | Propósito |
|---|-----------|-----------|
| 1 | [KeywordResearch.md](KeywordResearch.md) | Universo de keywords, 6 pilares temáticos, 60+ keywords priorizadas P0/P1/P2, 20 money keywords Amazon |
| 2 | [AnalisisCompetencia.md](AnalisisCompetencia.md) | Top competidores en SERP español, gaps detectados, 20 PAA recurrentes, oportunidades de diferenciación |
| 3 | [ArquitecturaSEO.md](ArquitecturaSEO.md) | Modelo de silos, URLs, internal linking, schema markup, breadcrumbs, anti-canibalización |
| 4 | [PlanContenidos.md](PlanContenidos.md) | Calendario editorial mayo→julio 2026 (25-40 artículos), briefs de los primeros 10, lead-magnet roadmap |
| 5 | [EstrategiaEEAT.md](EstrategiaEEAT.md) | Mapa YMYL, estrategia de autores, página /sobre/, link earning honesto, roadmap 6 meses |
| 6 | [ResultadosEnDirecto.md](ResultadosEnDirecto.md) | **Idea post-MVP.** Widget de resultados en directo (Mundial 2026 → LaLiga → Champions → Copa del Rey). APIs candidatas, arquitectura, roadmap por fases. |

---

## 🎯 Los 6 pilares temáticos (acordados)

| # | Pilar | % Tráfico esperado | Rol estratégico |
|---|-------|--------------------|-----------------|
| 1 | Ejercicios fútbol niños | 35% | Autoridad rápida + tráfico evergreen |
| 2 | Juegos y diversión | 20% | Viralidad Pinterest/RRSS |
| 3 | Equipamiento y material | 15% | Amazon Afiliados (revenue mes 1) |
| 4 | Iniciación y primeros pasos | 10% | Captación padres novatos (top funnel) |
| 5 | Beneficios, valores y desarrollo | 12% | E-E-A-T + diferenciador vs competencia |
| 6 | Estacional / actualidad | 8% | Mundial 2026, vuelta cole, Black Friday |

---

## ✅ 5 acciones que deben estar hechas ANTES del primer artículo

1. **Página `/sobre/`** con foto real, nombre completo, historia honesta y proceso editorial declarado *(bloquea aprobación AdSense)*.
2. **Páginas legales** (privacidad, cookies, aviso legal) con datos del responsable legal y email respondido *(bloquea Amazon Associates)*.
3. **Página de autor** de Javier con schema `Person`, bio E-E-A-T y `<AuthorBio />` linkado en cada artículo.
4. **Disclosure de afiliados Amazon** en footer + componente `<AffiliateDisclosure />` al inicio de cada money post.
5. **Implementación técnica SEO base:** sitemap.xml, robots.txt, schema `Organization` + `WebSite`, breadcrumbs `BreadcrumbList`, canonical en cada URL.

---

## 🚀 Los primeros 5 artículos (en orden)

| # | Fecha | Título | Pilar | Tipo | Por qué este orden |
|---|-------|--------|-------|------|--------------------|
| 1 | 2026-05-06 | Ejercicios fútbol niños 6 años | 1 (Ejercicios) | Hub | Autoridad rápida, long-tail baja competencia |
| 2 | 2026-05-08 | Mejor balón fútbol niños 5 años | 3 (Equipamiento) | Money | Revenue Amazon desde día 1 |
| 3 | 2026-05-13 | Cómo enseñar fútbol desde cero | 4 (Iniciación) | Pillar | Featured snippet + top funnel |
| 4 | 2026-05-15 | Ejercicios 4 años sin material | 1 (Ejercicios) | Cluster | Gap real (4-6 infra-atendido) |
| 5 | 2026-05-20 | Juegos fútbol parque niños | 2 (Juegos) | Cluster | Viralidad Pinterest, mix de pilar |

---

## 🧭 5 ángulos de diferenciación vs competencia

1. **Voz "padre cercano, no entrenador profesional"** — nadie en SERP español lo hace.
2. **Segmentación clara por edad** (4-6, 7-9, 10-12) frente a contenido genérico de la competencia.
3. **Edad 4-6 años infra-atendida** (70% de la competencia se enfoca a 7-12).
4. **Diseño/UX premium** sobre webs lentas y pesadas de la competencia (Astro + Tailwind = ventaja técnica).
5. **Recursos descargables imprimibles bien diseñados** vs PDFs feos detrás de muros de email agresivos.

---

## ⚠️ Líneas rojas

- ❌ Auto Ads de AdSense — solo slots planificados.
- ❌ Contenido YMYL (lesiones, nutrición, salud mental infantil) sin revisión experta declarada.
- ❌ Recoger datos de menores de 18 años.
- ❌ Link building agresivo (PBN, comprados, intercambios masivos).
- ❌ Más de 3 ads simultáneos en pantalla, ninguno sobre el H1.

---

## 📅 Próximos pasos sugeridos

1. **Revisar estos 5 docs** con calma y validar/objetar decisiones de cada agente.
2. **Crear issues en GitHub** ([repo](https://github.com/jatibamoza/webfutbolninos)) para los hitos de Sprint 1: setup técnico SEO + páginas legales + página /sobre/ + página de autor.
3. **Ejecutar Sprint 1** según `docs/PlanTrabajo.md`, alineado con el roadmap E-E-A-T mes 1 de [EstrategiaEEAT.md](EstrategiaEEAT.md).
4. **Reservar primer slot editorial** para 2026-05-06 con el primer artículo del calendario.
5. **Identificar y contactar primer revisor experto** (entrenador titulado o fisioterapeuta deportivo infantil) antes del mes 2.
