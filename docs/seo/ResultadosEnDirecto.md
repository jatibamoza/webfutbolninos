# Resultados en directo — Análisis y plan

> **Estado:** idea aprobada, **post-MVP**. Documento exploratorio para evaluar viabilidad técnica, de producto y de monetización antes de comprometer sprint.
>
> **Fecha:** 2026-04-25
> **Owner:** Javier
> **Última revisión:** —

---

## 1. Visión

Que padres e hijos puedan consultar en MiniGol Club los resultados de las competiciones que ven juntos en TV, **con la misma facilidad e interactividad que la tarjeta de Google** ("LaLiga clasificación", "Champions resultados") pero **diseñada para niños**: tipos grandes, escudos reconocibles, lenguaje simple, brackets visuales fáciles de seguir cuando avanza la fase eliminatoria.

**Empieza por:** Mundial 2026 (pico de tráfico junio-julio 2026, alineado con Pilar 6 estacional de [KeywordResearch.md](KeywordResearch.md)).

**Evoluciona a:** LaLiga · Champions League · Copa del Rey · Eurocopa · Liga MX (cuando entre LatAm).

---

## 2. Por qué encaja con la estrategia

| Encaje | Detalle |
|--------|---------|
| **Pilar 6 (Estacional)** | El Mundial 2026 es ya prioridad en [KeywordResearch.md](KeywordResearch.md). Esta feature multiplica el tráfico estacional y lo retiene. |
| **Tráfico recurrente** | A diferencia de un artículo evergreen, los resultados generan **visitas diarias** durante competiciones — los padres entran cada mañana después de un partido. |
| **Engagement** | Aumenta tiempo en sitio, profundidad de visita y vuelve al usuario en habitual → señal positiva de Google → mejora rankings de TODO el sitio. |
| **Diferenciación** | Ningún competidor en el nicho "fútbol infantil para padres" ofrece resultados en directo. Marca + utilidad. |
| **Backlinks naturales** | Una herramienta útil con bracket Mundial bien diseñado se comparte en grupos de WhatsApp de padres y aulas → links orgánicos. |
| **Monetización** | Páginas de competición = inventario AdSense recurrente premium + cross-sell Amazon (camiseta selección, mini-portería para "jugar el Mundial en casa"). |

---

## 3. Riesgos y bloqueantes a anticipar

| Riesgo | Mitigación |
|--------|------------|
| **Coste API en directo** | Las APIs serias cobran por llamada. Evaluar tier gratuito + cache agresivo (ver §5). |
| **Derechos de marca / imagen** | No se pueden usar logos oficiales LaLiga/UEFA/FIFA sin licencia. Usar nuestros propios escudos ilustrados estilo MiniGol (oportunidad de marca consistente con [DisenoUI.md](../DisenoUI.md)). |
| **Términos de uso APIs** | Algunas prohíben mostrar datos sin atribución, otras prohíben uso comercial. Validar **antes** de implementar. |
| **Latencia y fiabilidad** | Un widget que falla mientras el partido va en directo = peor que no tenerlo. SSR + ISR con fallback estático obligatorio. |
| **Scope creep** | Empezar por Mundial 2026 con alcance acotado (1 competición, 1 fase). NO arrancar con LaLiga + Champions + Copa simultáneamente. |
| **Mantenimiento editorial** | Si la API cambia o falla, alguien tiene que arreglarlo el mismo día — diseñar circuit breaker que muestre mensaje amable al niño en lugar de error técnico. |

---

## 4. APIs candidatas (a validar antes de comprometer)

> ⚠️ **No verificadas en esta investigación.** Antes de elegir, hacer prueba real con cada una: tier gratuito real, latencia, cobertura de Mundial 2026, términos de uso para sitio comercial, calidad del JSON.

| API | Cobertura | Tier free | Notas |
|-----|-----------|-----------|-------|
| **API-Football (api-sports.io)** | Mundial, LaLiga, Champions, Copa Rey, +1100 ligas | 100 reqs/día | La más completa del mercado de pago. Bracket eliminatorias incluido. |
| **Football-Data.org** | Mundial, top ligas europeas | 10 reqs/min | Open-source friendly. Cobertura más limitada en torneos copa. |
| **TheSportsDB** | Amplia (incluye amateur) | Free | Calidad de datos variable. Útil como complemento. |
| **SofaScore (no oficial)** | Todo, en tiempo real | Sin API pública | Solo scraping → riesgo legal y técnico. **Descartar.** |
| **OpenFoot** | Datos abiertos selección Mundial | Free | Posible para Mundial 2026 si tier serio falla. |
| **RapidAPI marketplace** | Múltiples proveedores | Variable | Útil para comparar tiers en un sitio. |

**Criterios de selección (ponderar al validar):**

1. Cobertura confirmada Mundial 2026 (incluyendo bracket eliminatorias actualizado en cuanto se decide).
2. Datos en español (nombres jugadores, equipos) o fácilmente mapeables.
3. Latencia < 30s desde gol/cambio.
4. Términos permiten uso comercial con ads.
5. Tier que aguante picos de tráfico de partido (5-10× tráfico normal en ese momento).

---

## 5. Arquitectura técnica propuesta

### 5.1 Patrón: ISR + edge cache + revalidación inteligente

Cloudflare Pages + Workers permite revalidar bajo demanda. Estrategia:

```
Usuario → Cloudflare Edge (cache) → Worker (decide TTL) → API externa
                                          │
                                          └─ TTL adaptativo:
                                             - Sin partido en directo: 1 hora
                                             - Día con partidos: 5 min
                                             - Partido en juego (00-90'): 30 segundos
                                             - Final del partido: 5 min y luego 1 hora
```

### 5.2 Capas

| Capa | Responsabilidad |
|------|-----------------|
| **API externa** | Single source of truth. No la consultamos desde el cliente. |
| **Worker / endpoint Astro** | Llama a la API, normaliza al schema interno, cachea con TTL adaptativo. |
| **Schema interno** | `Match`, `Team`, `Group`, `Bracket` definidos con Zod (consistente con [Arquitectura.md](../Arquitectura.md)). Independiente del proveedor → cambiar API no rompe la UI. |
| **Componentes UI** | `<MatchCard>`, `<GroupTable>`, `<BracketTree>`, `<LiveBadge>`. Reutilizables entre Mundial / LaLiga / Champions. |
| **Páginas** | `/competiciones/mundial-2026/`, `/competiciones/mundial-2026/grupo-a/`, `/competiciones/mundial-2026/eliminatorias/`. SSG donde se pueda, SSR en directo solo en partidos activos. |

### 5.3 Componente clave: `<BracketTree>` para eliminatorias

Lo más complicado del enunciado: que cuando avance la fase **sea fácil de entender**. Diseño:

- **Mobile (default):** scroll horizontal entre fases (octavos → cuartos → semis → final). Snap por columna.
- **Desktop:** árbol completo visible, líneas de avance animadas (con `prefers-reduced-motion` respetado).
- **Estado del partido:**
  - Pendiente → escudos en gris, fecha y hora.
  - En juego → badge `🔴 EN VIVO` (sin emoji decorativo, icono Lucide), pulse animation suave.
  - Finalizado → resultado en fuente Fredoka grande, ganador resaltado.
- **Interactivo:** tap/click en partido abre detalle (formación, goleadores, resumen para niños).
- **Estilo:** consistente con [DisenoUI.md](../DisenoUI.md) — esquinas suaves, paleta corporativa, escudos ilustrados propios.

### 5.4 Componentes reutilizables

```ts
type Match = {
  id: string;
  competition: 'mundial-2026' | 'laliga' | 'champions' | 'copa-del-rey';
  phase: 'group' | 'round-of-16' | 'quarter' | 'semi' | 'final' | 'regular-season';
  status: 'scheduled' | 'live' | 'finished' | 'postponed';
  kickoffAt: string; // ISO
  home: Team;
  away: Team;
  score: { home: number; away: number } | null;
  minute: number | null;
  // ...
};
```

Mismo schema sirve para Mundial, LaLiga, Champions, Copa → migración trivial entre fases.

---

## 6. Roadmap de implementación (cuando se priorice)

### Fase 1 — Mundial 2026 (post-MVP, alcance acotado)

**Objetivo:** Tener el widget funcionando 4 semanas antes del Mundial (2026-05 si Mundial empieza en junio 2026).

- [ ] Validar API definitiva (3 días: spike técnico con 2-3 candidatas)
- [ ] Definir schema interno + adapter de la API elegida
- [ ] Diseñar escudos ilustrados de las 32 selecciones (consistencia visual MiniGol)
- [ ] `<MatchCard>`, `<GroupTable>`, `<BracketTree>` (mobile-first)
- [ ] Página `/competiciones/mundial-2026/` con grupos + bracket vacío + countdown
- [ ] Worker de cache + TTL adaptativo
- [ ] Páginas por grupo `/competiciones/mundial-2026/grupo-[a-h]/`
- [ ] Página de cada partido con detalle "para niños"
- [ ] Schema markup `SportsEvent` + `SportsTeam`
- [ ] Plan de contenido editorial complementario (5-7 artículos cluster del Pilar 6)
- [ ] Ad slots planificados (no auto-ads) con respeto a §7 de CLAUDE.md
- [ ] Cross-sell Amazon (camiseta selección, balón Mundial, álbum) en ad slot lateral

### Fase 2 — LaLiga (España, septiembre 2026 con inicio temporada)

- [ ] Reutilizar componentes Fase 1
- [ ] Adaptar a formato liga regular: clasificación, jornada actual, calendario
- [ ] Página `/competiciones/laliga/` + `/competiciones/laliga/clasificacion/` + `/competiciones/laliga/jornada-actual/`
- [ ] **Decisión:** ¿incluir LaLiga 2 / Primera Federación? (cobertura de hijo en cantera local de pueblo)

### Fase 3 — Champions League + Copa del Rey

- [ ] Champions: bracket idéntico a Mundial pero recurrente (cada temporada)
- [ ] Copa del Rey: bracket asimétrico (eliminatoria desde primera ronda)

### Fase 4 — Internacional (LatAm)

- [ ] Liga MX, Copa Libertadores, Copa América (cuando entre LatAm)
- [ ] Solo si la audiencia LatAm está consolidada en GA4

---

## 7. Decisiones que diferimos (a tomar antes de Sprint X)

1. **API definitiva** — se valida con spike de 3 días, no antes.
2. **Coste mensual API** — depende del tier elegido. Si pasa 30€/mes, validar ROI con datos reales de tráfico.
3. **Logos oficiales vs ilustrados propios** — en principio, **ilustrados propios** (consistencia marca + cero riesgo legal). Confirmar con [DisenoUI.md](../DisenoUI.md) y [MarcaPosicionamiento.md](../MarcaPosicionamiento.md).
4. **¿Widget también embebible en otros sitios?** — futurible, no Fase 1.
5. **¿PWA con notificaciones push de gol?** — tentador, pero post-Fase 3.

---

## 8. KPIs de éxito (cuando se lance)

| Métrica | Objetivo Fase 1 (Mundial 2026) |
|---------|--------------------------------|
| Tráfico día partido vs día sin partido | ≥ 3× |
| Tiempo medio en página competición | ≥ 90s |
| Profundidad de visita usuarios mundial | ≥ 2.5 páginas |
| % usuarios que vuelven en 7 días | ≥ 25% |
| Conversión Amazon (camiseta selección) | ≥ 5 pedidos/semana durante torneo |
| Backlinks orgánicos a /mundial-2026/ | ≥ 10 dominios únicos en 60 días |
| Lighthouse Performance página competición | ≥ 90 (no romper gates de [CLAUDE.md §6](../../CLAUDE.md)) |

---

## 9. Próxima acción concreta

**Antes del Sprint 6** (o cuando se decida priorizar):

1. Spike técnico de 3 días: probar API-Football, Football-Data.org y TheSportsDB con cuentas free.
2. Validar términos de uso para sitio con AdSense + Amazon Afiliados.
3. Tomar decisión go/no-go con Javier.
4. Si **go** → crear sprint de implementación de 4 semanas para Fase 1.
5. Actualizar [PlanTrabajo.md](../PlanTrabajo.md) sacando esta entrada del icebox y asignándola a sprint concreto.
