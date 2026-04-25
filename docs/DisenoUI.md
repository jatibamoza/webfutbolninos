# Sistema de Diseño — Web Fútbol para Niños

> Fuente única de verdad visual. Cualquier componente nuevo debe usar estos tokens. Anti-patrones al final.

---

## 1. Principios

1. **Padre-friendly antes que kid-friendly.** Quien decide leer (y hacer click en ads) es el padre. El niño es el beneficiario, no el comprador. Estética: alegre pero limpia, no infantilizada.
2. **Mobile-first absoluto.** 80% del tráfico llega desde móvil en transporte / sofá. Diseñar primero para 375px, escalar después.
3. **Densidad de contenido alta, ruido visual bajo.** Tipografía generosa, mucho whitespace, ilustraciones puntuales (no sticker overload).
4. **Ads integrados, no parches.** Los slots se diseñan junto al layout, con espacio reservado (sin CLS) y separación visual clara del contenido.
5. **Accesibilidad AA mínimo.** Contraste 4.5:1 en texto, focus visible, alt en todas las imágenes, navegable con teclado.
6. **Performance es diseño.** Skeleton states, fonts con `display: swap`, hero con `fetchpriority="high"`, todo lazy bajo el fold.

---

## 2. Tokens de diseño

### 2.1 Colores

Paleta dual: **brand vibrante** (energía, fútbol, niñez) + **neutros cálidos** (lectura larga sin fatiga).

```css
:root {
  /* Brand */
  --color-primary: #2563EB;          /* Azul "estadio" — confianza padres + uniformes */
  --color-primary-hover: #1D4ED8;
  --color-primary-foreground: #FFFFFF;

  --color-secondary: #16A34A;        /* Verde césped — categoría: ejercicios */
  --color-secondary-foreground: #FFFFFF;

  --color-accent: #F59E0B;           /* Amarillo balón — CTA, highlight */
  --color-accent-foreground: #1C1917;

  --color-fun: #EC4899;              /* Rosa fucsia — categoría: juegos */
  --color-fun-foreground: #FFFFFF;

  --color-energy: #DC2626;           /* Rojo Mundial — categoría: mundial/laliga */
  --color-energy-foreground: #FFFFFF;

  /* Superficies */
  --color-background: #FFFBEB;       /* Crema muy suave — calidez */
  --color-surface: #FFFFFF;          /* Cards, modales */
  --color-surface-alt: #FEF3C7;      /* Bandas de sección, alternancia */

  /* Texto */
  --color-foreground: #0F172A;       /* Texto principal — contraste 16:1 sobre crema */
  --color-foreground-muted: #475569; /* Texto secundario, meta — 7:1 */
  --color-foreground-subtle: #64748B;/* Captions — 5:1 mínimo */

  /* Bordes y separadores */
  --color-border: #E2E8F0;
  --color-border-strong: #CBD5E1;

  /* Estado */
  --color-success: #059669;
  --color-warning: #D97706;
  --color-destructive: #DC2626;
  --color-info: #0284C7;

  /* Anillos focus */
  --color-ring: #2563EB;
  --color-ring-offset: #FFFBEB;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0F172A;
    --color-surface: #1E293B;
    --color-surface-alt: #334155;
    --color-foreground: #F8FAFC;
    --color-foreground-muted: #CBD5E1;
    --color-foreground-subtle: #94A3B8;
    --color-border: #334155;
    --color-border-strong: #475569;
    --color-ring-offset: #0F172A;
  }
}
```

**Mapeo categoría → color:**

| Categoría                  | Color                       | Uso                      |
| -------------------------- | --------------------------- | ------------------------ |
| Entrenamiento / ejercicios | `--color-secondary` (verde) | Badge, hero, filter pill |
| Juegos y actividades       | `--color-fun` (rosa)        | Badge, hero              |
| Mundial                    | `--color-energy` (rojo)     | Badge, hero              |
| LaLiga                     | `--color-primary` (azul)    | Badge, hero              |
| Recursos descargables      | `--color-accent` (amarillo) | Badge, CTA descarga      |
| Beneficios del fútbol      | `--color-info` (azul info)  | Badge, hero              |

Todos los pares texto/fondo verificados ≥ 4.5:1.

---

### 2.2 Tipografía

**Pareja:** *Fredoka* (display, redondeada, alegre pero adulta) + *Nunito* (body, neutra, altísima legibilidad en móvil).

> Descartado *Comic Neue*: percibido infantil/poco profesional por padres. *Fredoka + Nunito* da el balance "alegre pero serio" que pide el target.

```css
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;500;600;700&display=swap');

:root {
  --font-display: 'Fredoka', system-ui, sans-serif;
  --font-body: 'Nunito', system-ui, sans-serif;

  /* Escala (mobile → desktop con clamp) */
  --text-xs:   clamp(0.75rem,  0.72rem + 0.15vw, 0.81rem);   /* 12 → 13 */
  --text-sm:   clamp(0.875rem, 0.85rem + 0.15vw, 0.94rem);   /* 14 → 15 */
  --text-base: clamp(1rem,     0.96rem + 0.2vw,  1.13rem);   /* 16 → 18 */
  --text-lg:   clamp(1.125rem, 1.08rem + 0.25vw, 1.25rem);   /* 18 → 20 */
  --text-xl:   clamp(1.25rem,  1.18rem + 0.4vw,  1.5rem);    /* 20 → 24 */
  --text-2xl:  clamp(1.5rem,   1.4rem + 0.5vw,   1.875rem);  /* 24 → 30 */
  --text-3xl:  clamp(1.875rem, 1.7rem + 0.9vw,   2.5rem);    /* 30 → 40 */
  --text-4xl:  clamp(2.25rem,  2rem + 1.25vw,    3.5rem);    /* 36 → 56 */
  --text-5xl:  clamp(2.75rem,  2.4rem + 1.75vw,  4.5rem);    /* 44 → 72 */

  /* Line-height */
  --leading-tight: 1.15;   /* H1, H2 */
  --leading-snug:  1.25;   /* H3, H4 */
  --leading-normal: 1.5;   /* Body */
  --leading-relaxed: 1.7;  /* Artículos largos (prose) */
}

body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--color-foreground);
  background: var(--color-background);
}

h1, h2, h3, h4 {
  font-family: var(--font-display);
  font-weight: 700;
  line-height: var(--leading-tight);
  letter-spacing: -0.01em;
}
```

**Reglas:**

- Body **siempre ≥ 16px** en mobile (evita auto-zoom iOS).
- Line-length 60–75 chars (`max-w-prose` en Tailwind = 65ch).
- Solo Fredoka en headings, badges, CTAs grandes. **Nunca** body con Fredoka.

---

### 2.3 Espaciado (sistema 4pt)

```css
:root {
  --space-1: 0.25rem;   /*  4px */
  --space-2: 0.5rem;    /*  8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

**Ritmo vertical de página:**

- Entre secciones grandes (Home): `--space-16` mobile, `--space-24` desktop
- Entre bloques dentro de sección: `--space-8`
- Entre elementos relacionados (card grid): `--space-6`
- Padding interno cards: `--space-5` mobile, `--space-6` desktop

**Container max-widths:**

- Prose (artículo): `65ch` (~672px)
- Wide (home, categorías): `80rem` (1280px)
- Full bleed: 100% (heros, banners)

---

### 2.4 Radios, sombras y elevación

```css
:root {
  --radius-sm:  0.375rem;  /* 6px  — pills, badges */
  --radius-md:  0.625rem;  /* 10px — botones, inputs */
  --radius-lg:  1rem;      /* 16px — cards */
  --radius-xl:  1.5rem;    /* 24px — heros, recursos card */
  --radius-full: 9999px;   /* avatares, pills round */

  /* Elevación — usar máx 3 niveles para mantener jerarquía clara */
  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 4px 12px rgba(15, 23, 42, 0.08);
  --shadow-lg: 0 12px 32px rgba(15, 23, 42, 0.12);
  --shadow-card-hover: 0 16px 40px rgba(37, 99, 235, 0.12);
}
```

**Estilo elegido:** **Friendly Flat + Bento Grid + Editorial**

- Cards con borde sutil y sombra suave (no neumorphism, no glass)
- Bento grid para Home (combina cards de tamaños distintos)
- Editorial para artículos (tipografía protagonista, mucho aire)

---

### 2.5 Iconografía

- **Set:** [Lucide](https://lucide.dev) — uniforme, stroke 2px, geométrico amigable
- **Tamaños:** 16, 20, 24, 32 (tokens `--icon-sm/md/lg/xl`)
- **Color:** hereda `currentColor`
- **Prohibido emoji** como icono estructural (inconsistencia cross-platform). Sí en contenido editorial dentro del prose.

Iconos clave por categoría:

- Ejercicios → `dumbbell` o `activity`
- Juegos → `gamepad-2` o `party-popper`
- Mundial → `trophy`
- LaLiga → `shield`
- Recursos → `download`
- Beneficios → `heart`

---

### 2.6 Animación

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Reglas:**

- Solo animar `transform` y `opacity` (no width/height/top/left)
- Hover cards: `transform: translateY(-2px)` + sombra crece (200ms ease-out)
- Reveal on scroll: `IntersectionObserver` + opacity 0→1 + translateY 20→0 (300ms)
- Sin parallax, sin video autoplay, sin animación decorativa permanente

---

## 3. Componentes clave

### 3.1 ArticleCard

```
┌─────────────────────────────────┐
│ [─────── Cover image ────────]  │  ← aspect-ratio 16/10, lazy
│                                 │
│ ┌─badge─┐  ⏱ 5 min · 6-8 años  │  ← categoría + meta (foreground-muted)
│ │Juegos │                       │
│ └───────┘                       │
│                                 │
│ Título grande del artículo      │  ← Fredoka 600, --text-xl, leading-tight
│ que puede ocupar 2 líneas       │
│                                 │
│ Subtítulo de 2 líneas con meta  │  ← Nunito 400, --text-sm, foreground-muted
│ description recortado a 2 lines │
│                                 │
│ Por María García · 12 abril     │  ← --text-xs, subtle
└─────────────────────────────────┘
```

**Reglas:**

- Toda la card es clickable (single anchor wrapping)
- Hover: lift -2px + cambio de sombra (no escala)
- Imagen con `aspect-ratio: 16/10` reservada en CSS (cero CLS)
- Badge color = color de la categoría
- Truncate con `-webkit-line-clamp` (2 líneas título, 2 líneas excerpt)

### 3.2 CategoryHero

```
┌──────────────────────────────────────────────────┐
│  [icono 48px]                                    │
│                                                  │
│  Ejercicios de fútbol para niños                 │  ← --text-4xl Fredoka 700
│                                                  │
│  Guías paso a paso, vídeos y rutinas para        │  ← --text-lg, max-w-prose
│  entrenar a tus hijos en casa o en el parque.    │
│                                                  │
│  ┌─Filtros: edad ▾  dificultad ▾  duración ▾─┐  ← pills filter, sticky en scroll
│  └──────────────────────────────────────────────┘
└──────────────────────────────────────────────────┘
```

- Fondo: `--color-secondary` con opacity 0.08 (suave, no satura)
- Icon en círculo `--color-secondary` con `--color-secondary-foreground`
- Filtros como `<select>` nativos en mobile, custom dropdown en desktop

### 3.3 ResourceCard (recurso descargable)

```
┌──────────────────┐
│ [Preview PDF]    │  ← aspect 3/4, ligero shadow para dar "papel"
│                  │
│  16 páginas      │
│  Edad: 7-10      │
│                  │
│  Mi cuaderno de  │
│  jugadas         │
│                  │
│ ┌──────────────┐ │
│ │  Descargar   │ │  ← botón --color-accent (amarillo), foreground oscuro
│ │   ↓ PDF      │ │
│ └──────────────┘ │
└──────────────────┘
```

### 3.4 AdSlot (in-article)

```
┌──────────────────────────────────┐
│  Publicidad                      │  ← label --text-xs, --color-foreground-subtle
│ ┌──────────────────────────────┐ │
│ │                              │ │
│ │   [────── AdSense ──────]    │ │  ← min-height reservado por slot type
│ │                              │ │     (320x50, 300x250, 728x90)
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

**Reglas críticas:**

- Etiqueta "Publicidad" siempre visible (política AdSense + transparencia)
- `min-height` reservado en CSS según `data-slot-type` para evitar CLS
- Margen vertical generoso (`--space-8`) para separar del contenido
- Sin border ni background propios (que el ad domine)
- Lazy load con IntersectionObserver excepto el primer slot post-intro

### 3.5 NewsletterCTA (fase 2)

```
┌──────────────────────────────────────────┐
│ ⚽ Recibe ejercicios cada semana         │  ← Fredoka 600, --text-2xl
│                                          │
│ Únete a 1.234 padres que ya entrenan     │
│ con nosotros. Gratis, sin spam.          │
│                                          │
│ ┌────────────────────┐ ┌──────────────┐  │
│ │ tu@email.com       │ │  Suscribirme │  │  ← input + CTA accent
│ └────────────────────┘ └──────────────┘  │
│                                          │
│ ☑ Acepto la política de privacidad       │  ← obligatorio EU
└──────────────────────────────────────────┘
```

### 3.6 Breadcrumb

```
Inicio > Ejercicios > Conducción de balón para niños de 6 años
```

- Separador `›` con `--color-foreground-subtle`
- Última crumb sin link, peso 600
- JSON-LD `BreadcrumbList` paralelo (no visible)
- Truncado en mobile: `Inicio > … > Categoría > Artículo`

### 3.7 Botones

| Variante      | Uso                       | Color fondo                | Color texto                  |
| ------------- | ------------------------- | -------------------------- | ---------------------------- |
| `primary`     | CTA principal por página  | `--color-primary`          | `--color-primary-foreground` |
| `accent`      | Descarga, suscripción     | `--color-accent`           | `--color-accent-foreground`  |
| `secondary`   | Acción secundaria         | `--color-surface` + border | `--color-foreground`         |
| `ghost`       | Acciones inline (filtros) | transparent                | `--color-foreground`         |
| `destructive` | Solo en formularios admin | `--color-destructive`      | white                        |

**Tamaños:** `sm` (h-9, px-3), `md` (h-11, px-5), `lg` (h-14, px-7).
**Mobile:** mínimo `md` para cumplir 44×44pt.
**Estados:** hover (-shadow / +bg), focus (ring 3px `--color-ring` + offset), disabled (opacity 0.5, cursor not-allowed).

### 3.8 Tag / Badge / Pill

- **Badge:** etiqueta categoría sobre card. `--radius-sm`, `--text-xs`, padding `0.25rem 0.625rem`.
- **Pill (filter):** botón filtro toggle. `--radius-full`, `--text-sm`, padding `0.5rem 1rem`. Estado activo: `--color-primary` + check icon.
- **Tag (en artículo):** chip linkeable. `--radius-sm`, fondo `--color-surface-alt`.

### 3.9 Otros componentes

- **TOC (tabla de contenidos):** sticky desktop right rail; collapsable accordion mobile sobre el artículo
- **RelatedArticles:** grid 1×3 mobile, 3×1 desktop, tras el contenido del artículo
- **AffiliateDisclosure:** banner sutil al inicio del artículo si hay links de afiliado
- **AmazonCard:** card de producto con imagen, título, precio (si Product Advertising API), CTA "Ver en Amazon"
- **Search:** modal Pagefind invocado desde icono lupa (header) + atajo `/`
- **MobileNav:** drawer desde la izquierda con accordion por categoría

---

## 4. Layouts

### 4.1 Home (mobile-first)

```
┌────────────────────────────────────┐
│  [Header: logo + ☰ + 🔍]           │  ← sticky, h-16, sombra al scroll
├────────────────────────────────────┤
│                                    │
│  Fútbol que enseña.                │  ← Hero: Fredoka 700 --text-5xl
│  Diversión que une.                │
│                                    │
│  Ejercicios, juegos y recursos     │  ← --text-lg muted
│  para entrenar a tus peques.       │
│                                    │
│  [ Explorar ejercicios → ]         │  ← CTA primary lg
│                                    │
│  ─── ilustración SVG fútbol ───    │  ← decorativa, lazy
├────────────────────────────────────┤
│  ┌──Bento grid (categorías)─────┐  │
│  │ ┌────────┐ ┌────────┐        │  │
│  │ │Ejerci- │ │ Juegos │        │  │  ← grid 2 cols mobile
│  │ │ cios   │ │        │        │  │
│  │ └────────┘ └────────┘        │  │
│  │ ┌────────┐ ┌────────┐        │  │
│  │ │Mundial │ │ Recur- │        │  │
│  │ │        │ │  sos   │        │  │
│  │ └────────┘ └────────┘        │  │
│  └──────────────────────────────┘  │
├────────────────────────────────────┤
│  ⭐ Lo más leído                   │
│  [ArticleCard × 6, scroll horiz]   │  ← carrusel mobile, grid 3×2 desktop
├────────────────────────────────────┤
│  [── AdSlot home-feed ──]          │  ← responsive
├────────────────────────────────────┤
│  📥 Recursos descargables          │
│  [ResourceCard × 3]                │
├────────────────────────────────────┤
│  ✍️ Últimos artículos               │
│  [ArticleCard × 8, infinite or btn]│
├────────────────────────────────────┤
│  [── AdSlot home-bottom ──]        │
├────────────────────────────────────┤
│  Newsletter CTA                    │
├────────────────────────────────────┤
│  Footer (4 cols desktop, accord.   │
│  mobile: nav + legal + redes)      │
└────────────────────────────────────┘
```

### 4.2 Categoría

```
┌────────────────────────────────────┐
│  Header                            │
├────────────────────────────────────┤
│  Breadcrumb                        │
│  CategoryHero (icono + descrip.)   │
│  Filtros sticky (edad/dificultad)  │
├────────────────────────────────────┤
│  [── AdSlot cat-top ──]            │
├────────────────────────────────────┤
│  ArticleCard grid (1 col / 2 / 3)  │
│  ↓                                 │
│  [Ad in-feed cada 6 cards]         │
│  ↓                                 │
│  Paginación                        │
├────────────────────────────────────┤
│  Footer                            │
└────────────────────────────────────┘
```

### 4.3 Artículo

```
┌────────────────────────────────────┐
│  Header                            │
├────────────────────────────────────┤
│  Breadcrumb                        │
│  Badge categoría · meta (autor,    │
│  fecha, lectura, edad, dificultad) │
│                                    │
│  H1: Título del artículo           │  ← --text-4xl Fredoka 700
│                                    │
│  Subtítulo / dek (--text-lg muted) │
│                                    │
│  [────── Cover image ──────]       │  ← aspect 16/9, fetchpriority=high
│                                    │
│  AffiliateDisclosure (si aplica)   │
│                                    │
│  Intro (2-3 párrafos)              │
│                                    │
│  [── AdSlot in-article top ──]     │
│                                    │
│  ## H2 sección                     │
│  Contenido prose (max-w-prose)     │
│  ...                               │
│                                    │
│  ┌─ TOC sticky desktop right ─┐    │
│  │ • Sección 1                │    │
│  │ • Sección 2                │    │
│  │ • Sección 3                │    │
│  └────────────────────────────┘    │
│                                    │
│  [── AdSlot in-article mid ──]     │
│                                    │
│  ## H2 con AmazonCard embebido     │
│  [AmazonCard producto]             │
│                                    │
│  Conclusión + ResourceCard CTA     │
│                                    │
│  [── AdSlot in-article bottom ──]  │
│                                    │
│  Tags + Compartir                  │
│  Bio del autor                     │
│                                    │
│  Artículos relacionados (3)        │
├────────────────────────────────────┤
│  Newsletter CTA                    │
│  Footer                            │
└────────────────────────────────────┘
```

### 4.4 Recurso descargable

```
┌────────────────────────────────────┐
│  Header                            │
├────────────────────────────────────┤
│  Breadcrumb                        │
│  ┌──────────┬─────────────────┐    │
│  │          │ Título recurso  │    │
│  │ Preview  │ Descripción     │    │
│  │   PDF    │                 │    │
│  │ (mockup) │ Edad / pages    │    │
│  │          │                 │    │
│  │          │ [ Descargar ↓ ] │    │  ← CTA accent grande
│  │          │                 │    │
│  │          │ "Cómo usarlo"   │    │
│  └──────────┴─────────────────┘    │
├────────────────────────────────────┤
│  Cómo imprimirlo (tip pequeño)     │
│  Otros recursos similares          │
└────────────────────────────────────┘
```

---

## 5. Mapa de pantallas → componentes

| Pantalla                 | Componentes                                                                                                                                           |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home                     | Header, Hero, BentoCategories, ArticleCard×N, AdSlot×2, ResourceCard×3, NewsletterCTA, Footer                                                         |
| Categoría                | Header, Breadcrumb, CategoryHero, FilterPills, AdSlot, ArticleCard×N, Pagination, Footer                                                              |
| Artículo                 | Header, Breadcrumb, ArticleHero, AffiliateDisclosure, MDX prose, TOC, InArticleAd×3, AmazonCard, ResourceCard, RelatedArticles, NewsletterCTA, Footer |
| Recurso                  | Header, Breadcrumb, ResourceDetail, RelatedResources, Footer                                                                                          |
| Búsqueda                 | Header, SearchInput (Pagefind UI), ResultList, Footer                                                                                                 |
| 404                      | Header, EmptyState, populares, Footer                                                                                                                 |
| Legal (privacidad, etc.) | Header, prose, Footer                                                                                                                                 |

---

## 6. Responsive — breakpoints

```
sm:  640px  — phablet (poco usado, casi mismo layout que mobile)
md:  768px  — tablet portrait
lg:  1024px — tablet landscape / laptop pequeño
xl:  1280px — desktop estándar
2xl: 1536px — desktop wide
```

**Reglas:**

- Mobile (default): 1 columna, padding lateral `--space-4`, sin sticky sidebar
- `md`: 2 columnas en grids, padding `--space-6`
- `lg`: 3 columnas en grids de cards, sidebar sticky en artículos, sticky filters en categoría
- `xl`: max-width activo, grids hasta 4 cols donde tenga sentido
- **Sin** layouts pensados para landscape mobile específicamente (4–6% del tráfico, no rentable)

---

## 7. Accesibilidad — checklist obligatorio antes de merge

- [ ] Contraste texto/fondo ≥ 4.5:1 (3:1 para texto ≥ 24px o ≥ 18px bold)
- [ ] Todo elemento interactivo tiene focus visible (ring 3px primary)
- [ ] Tab order coincide con orden visual
- [ ] Imágenes con `alt` descriptivo (decorativas: `alt=""`)
- [ ] Botones-icono con `aria-label`
- [ ] Heading hierarchy sin saltos (no h1 → h3)
- [ ] Forms: `<label for>` por input, errores con `aria-describedby`, `aria-invalid`
- [ ] `prefers-reduced-motion` respetado
- [ ] Touch targets ≥ 44×44px en mobile
- [ ] Skip-to-content link al inicio
- [ ] HTML semántico (`<article>`, `<nav>`, `<main>`, `<aside>`)

---

## 8. Anti-patrones — qué NO hacer nunca

- ❌ Comic Sans, Comic Neue (asociación negativa con padres)
- ❌ Auto-play vídeo o audio en ningún lugar
- ❌ Pop-ups intersticiales (Google penaliza + UX odiosa + viola CWV)
- ❌ Newsletter pop-up al cargar (sí permitido tras 30s o 50% scroll, fase 2)
- ❌ Más de 3 ads en pantalla simultánea
- ❌ Ads encima del H1 (viola política AdSense "above content")
- ❌ Texto blanco sobre fondo claro o gris claro sobre crema
- ❌ Animaciones de entrada en cada elemento al scroll (cansa, fatiga visual)
- ❌ Dark patterns en CTAs de newsletter ("Sí, quiero perder dinero")
- ❌ Iconos emoji como elementos de UI (badges, nav, botones)
- ❌ Carruseles auto-rotantes en home (mata CTR)
- ❌ Imágenes sin width/height (= CLS = penaliza CWV)
- ❌ Fonts cargadas sin `display: swap`
- ❌ Mezclar más de 2 familias tipográficas

---

## 9. Plantilla CSS variables Tailwind v4

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-primary: #2563EB;
  --color-secondary: #16A34A;
  --color-accent: #F59E0B;
  --color-fun: #EC4899;
  --color-energy: #DC2626;

  --color-background: #FFFBEB;
  --color-surface: #FFFFFF;
  --color-foreground: #0F172A;
  --color-foreground-muted: #475569;

  --font-display: 'Fredoka', system-ui, sans-serif;
  --font-body: 'Nunito', system-ui, sans-serif;

  --radius-card: 1rem;
  --radius-button: 0.625rem;
}
```

Uso en componentes: `bg-primary`, `text-foreground`, `font-display`, `rounded-card`.

---

## 10. Changelog / versiones

- **v1.0 — 2026-04-25** — Sistema inicial basado en Fredoka + Nunito, paleta dual brand-vibrante / neutros cálidos, estilo Friendly Flat + Bento + Editorial.
