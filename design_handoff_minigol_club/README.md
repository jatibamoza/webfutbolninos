# Handoff: MiniGol Club v2 — sitio editorial de fútbol para padres

## Overview
**MiniGol Club** es un sitio editorial dirigido a padres y madres con hijos que practican fútbol base (4–12 años). El objetivo es ofrecer artículos prácticos sobre ejercicios, nutrición, psicología deportiva, equipamiento y desarrollo, con un tono cálido, honesto y no aspiracional.

Este paquete contiene:
- El **logotipo final** (escudo + monograma M + estrellas + EST·2026).
- Las **3 plantillas principales** del sitio: Home, Categoría, Artículo (mobile 390px + desktop 1280px).
- Sistema visual completo (cuaderno de campo): tokens de color, tipografía, espaciado, sombras y componentes.

---

## About the Design Files
Los archivos en `design_files/` son **referencias de diseño creadas en HTML/JSX (React + Babel inline)** — prototipos que muestran el aspecto y comportamiento previsto, **no código de producción para copiar tal cual**.

La tarea es **recrear estos diseños en el entorno objetivo** (el plan original era **Astro + Tailwind**, pero si el desarrollador prefiere otro stack — Next.js, SvelteKit, Eleventy — debería elegir el más adecuado y trasladar el sistema). Lo que importa es respetar fielmente:

- los **tokens** de diseño (colores, tipografías, radios, sombras),
- la **jerarquía visual** y el ritmo editorial,
- los **componentes firmados** (dorsales, marcador manuscrito, pizarra táctica, AdSlot dashed, badge de edad, cronómetro de lectura),
- el **tono "cuaderno de campo"** — papel crema, líneas de campo sutiles, sin gradientes saturados.

## Fidelity
**High-fidelity (hifi)** — los mockups tienen colores finales, tipografías reales (Fredoka + Nunito + Caveat + JetBrains Mono cargadas desde Google Fonts), espaciado decidido, estados de hover y comportamiento de filtros/TOC implementado. Reproducir pixel-perfect aplicando el sistema de la base de código destino.

---

## Logotipo

**Archivo de referencia:** `design_files/Logo A refinado.html`

### Estructura del escudo
- Forma: escudo redondeado superior, base curva inferior con punta central. Dimensiones del path: viewBox `0 0 100 100`.
- Path: `M50 6 L88 16 L88 50 C88 74 72 88 50 94 C28 88 12 74 12 50 L12 16 Z`
- Fill: `#1A1F2C` (tinta azul-negra).

### Capas internas
1. **Líneas de campo** (decoración tras la M, opacidad .50 sobre fondo oscuro / .42 sobre claro):
   - rect `x=22 y=20 w=56 h=48 rx=3` stroke `#FFFCF1` w 1.2
   - line `x1=50 y1=20 x2=50 y2=68` stroke `#FFFCF1` w 1.2
   - circle `cx=50 cy=44 r=9` stroke `#FFFCF1` w 1.2
2. **M monograma**: Fredoka 700, font-size 36, fill `#F59E0B`, posición `x=50 y=57 text-anchor=middle`.
3. **★ CLUB ★**:
   - Estrella izq: `x=34 y=79.5` size 5.5 fill `#F59E0B` opacity .90
   - Texto CLUB: `x=51 y=79` JetBrains Mono 600, size 6, fill `#FFFCF1`, letter-spacing 2.5, opacity .95
   - Estrella der: `x=66 y=79.5` size 5.5 fill `#F59E0B` opacity .90
4. **EST·2026**: `x=51 y=86` JetBrains Mono, size 3.2, fill `#FFFCF1`, letter-spacing 1.2, opacity .55.

### Variantes a producir
| Tamaño | Recomendado | Detalles incluidos |
|---|---|---|
| 32 px (favicon) | M + escudo | Sin líneas de campo (no se leen) |
| 64 px | + círculo central | Sin CLUB ni EST |
| 128 px | + cinta CLUB | Sin EST·2026 |
| 240+ px | Completo | Todos los elementos |

### Aplicación sobre fondos
- **Light/Cream**: escudo navy `#1A1F2C` con líneas y CLUB en `#FFFCF1`, M y estrellas en `#F59E0B`.
- **Dark** (sobre `#1A1F2C`): invertir — escudo en `#FFFCF1`, líneas y CLUB en `#1A1F2C`, M y estrellas se mantienen en `#F59E0B`.

### Lockup (logo + wordmark)
- "MiniGol" en Fredoka 700, font-size 88px, letter-spacing -0.03em, color `--color-foreground`.
- Tagline: "fútbol · para padres" en JetBrains Mono, 14px, letter-spacing .25em, uppercase, color `--color-foreground-subtle`, margin-top 14px.

---

## Screens / Views

### 1. Home (`page-home.jsx`)
- **Propósito**: presentar el sitio, dirigir a categorías y artículos destacados.
- **Estructura mobile (390px)** y **desktop (1280px)**:
  1. **Header sticky** con logo + nav (Inicio, Ejercicios, Nutrición, Psicología, Equipamiento, Sobre).
  2. **Hero**: ilustración de cuaderno con plan táctico + post-it, headline en Fredoka 64px, sub en Nunito 18px, **selector de edad opcional discreto** (4-6 / 7-8 / 9-10 / 11-12) — chips redondeados, persistible en localStorage como `mg.age`.
  3. **Bento de 6 categorías**: cada una con dorsal numérico grande (Fredoka 700, opacidad .15 como decoración de fondo) + nombre + descripción + barra de color de 4px.
  4. **Lo más leído**: lista numerada (01–05) con título + meta (categoría · cronómetro lectura ⏱ 5:30).
  5. **Recursos PDF descargables**: cards con icono PDF + título + tamaño.
  6. **Últimos artículos**: grid de cards con cover placeholder + categoría + título + autor + cronómetro.
  7. **Newsletter inline** (no sticky).
  8. **Footer**: enlaces + créditos + sello de honestidad editorial.

### 2. Categoría (`page-category.jsx`)
- **Propósito**: explorar artículos de una categoría (ej. `/ejercicios/`).
- **Estructura**:
  1. **Header**.
  2. **Title block**: dorsal gigante de la categoría (Fredoka 700, 360px en desktop, opacidad .08 como fondo decorativo) + nombre + descripción + total de artículos.
  3. **Filtros sticky**: edad (chips), nivel (principiante/intermedio/avanzado), orden (recientes/populares).
  4. **Grid de artículos**: 2 col mobile / 3 col desktop.
  5. **Ad in-feed cada 6 cards**: caja con borde dashed + label "Publicidad" + relleno hatched.
  6. **Paginación**: prev/next + página X de Y.
  7. **Footer**.

### 3. Artículo (`page-article.jsx`)
- **Propósito**: lectura larga de un artículo.
- **Estructura desktop**: 3 columnas — TOC sticky right rail (200px), contenido principal (720px), espacio.
- **Bloques**:
  1. Breadcrumb + categoría con dorsal pequeño.
  2. Título Fredoka 56px, subtitle Nunito 22px.
  3. Bloque autor con avatar, nombre, credenciales (E-E-A-T), fecha, badge de edad como dato grande, cronómetro `⏱ 8:30` mono.
  4. Cover placeholder con sello manuscrito Caveat ("plan de la sesión #03").
  5. **TOC** con dorsales numerados (01, 02, 03…) y cronómetro de tiempo restante por sección. En mobile, acordeón colapsable.
  6. Contenido: H2 con dorsal grande al lado, párrafos Nunito 18px line-height 1.7, blockquote tipo "nota de coach" en Caveat 28px sobre fondo crema (`--color-surface-alt`), pizarra táctica embebida (SVG con cancha + flechas) para ejercicios, listas con checkbox redondos, marcador manuscrito amarillo (`--color-marker`) sobre keywords (`background: linear-gradient(transparent 60%, var(--color-marker) 60%)`).
  7. AdSlot mid-article cada 800–1000px de scroll.
  8. CTA final: artículos relacionados (3 cards) + newsletter inline.

### Newsletter sticky bottom mobile
- Banner sutil cerrable, recordable (localStorage `mg.newsletter.dismissed = timestamp`, reaparece tras 14 días).
- Solo en mobile, no en desktop.

---

## Interactions & Behavior

- **Selector de edad**: chip activo persistible en localStorage. Filtra contenido recomendado.
- **Tweaks panel** (desktop devtool, no producción): cambia tema light/dark, densidad, toggle pizarra táctica. Solo es referencia — el sitio final tiene tema fijo light con dark mode automático por `prefers-color-scheme`.
- **TOC**: scroll-spy resalta sección activa. Click hace scroll suave (no usar `scrollIntoView` con cuidado, mejor `window.scrollTo` con offset por header sticky).
- **Filtros categoría**: cambiar chip recarga grid sin recargar página (client-side filter o query string).
- **Newsletter sticky**: dismiss icon (×) oculta el banner.
- **Marcador manuscrito**: solo visual, no animado.
- **Pizarra táctica**: SVG estático en este pase. En el futuro puede ser interactivo.
- **Header sticky**: shadow aparece tras scroll de 8px.

### Animaciones
- Transiciones de hover en cards: `transform: translateY(-2px)` y `box-shadow` aumenta. Duración `--duration-base` (220ms), easing `--ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Sin gradientes animados, sin parallax, sin partículas. **Sobriedad editorial**.

---

## State Management

- `mg.age` (localStorage): edad seleccionada del peque. Valores: `4-6` | `7-8` | `9-10` | `11-12` | `null`.
- `mg.theme` (localStorage): `light` | `dark` | `auto` (default `auto`).
- `mg.newsletter.dismissed` (localStorage): timestamp ISO. Si `now - dismissed > 14d`, mostrar de nuevo.
- `mg.toc.collapsed` (mobile only, sessionStorage): boolean.

Sin backend en este pase. Newsletter envía POST a un endpoint placeholder (`/api/subscribe`) — el dev decide proveedor (ConvertKit, MailerLite, Buttondown).

---

## Design Tokens

Todos en `design_files/styles.css`. Resumen:

### Colores (light)
```
--color-background:        #FAF6E8   /* papel envejecido */
--color-paper:             #FFFCF1   /* cards */
--color-surface:           #FFFFFF
--color-surface-alt:       #F4EBC8   /* banda destacada */
--color-rule:              #E8DEC0   /* líneas de cuaderno */
--color-rule-strong:       #D4C691
--color-foreground:        #1A1F2C   /* tinta */
--color-foreground-muted:  #4D5468
--color-foreground-subtle: #6B7280
--color-handwritten:       #1F3F8E   /* azul Bic */
--color-marker:            #FFD45E   /* subrayado */
--color-border:            #E5DCC0
--color-border-strong:     #C9BC91
```

### Colores por categoría (uso editorial: solo punto/barra, no fondo)
```
--color-primary:    #2563EB   /* psicología */
--color-secondary:  #16A34A   /* ejercicios */
--color-accent:     #F59E0B   /* equipamiento + brand */
--color-fun:        #EC4899   /* desarrollo */
--color-energy:     #DC2626   /* nutrición */
--color-info:       #0891B2   /* organización */
```

### Colores (dark — auto por `prefers-color-scheme`)
```
--color-background: #11151E
--color-paper:      #181E2B
--color-surface:    #1B2230
--color-foreground: #ECEFF6
/* etc. — ver styles.css */
```

### Tipografía
```
--font-display: 'Fredoka', system-ui, sans-serif    /* H1, H2, números */
--font-body:    'Nunito', system-ui, sans-serif      /* texto corrido */
--font-hand:    'Caveat', cursive                    /* anotaciones, sellos */
--font-mono:    'JetBrains Mono', ui-monospace       /* metadata, AdSlot, EST·2026 */
```

Escala (mobile / desktop):
- H1 título artículo: 40 / 56
- H1 hero home: 44 / 64
- H2: 28 / 36
- H3: 22 / 26
- Body: 16 / 18 (line-height 1.65 / 1.7)
- Meta: 12 / 13 (uppercase, letter-spacing .12em, mono)
- Dorsales decorativos: 120 / 240+

### Radios
```
--radius-sm: 6px
--radius-md: 10px
--radius-lg: 14px
--radius-xl: 22px
--radius-full: 9999px
```

### Sombras
```
--shadow-sm:    0 1px 2px rgba(26,31,44,0.06)
--shadow-md:    0 4px 12px rgba(26,31,44,0.07)
--shadow-lg:    0 12px 28px rgba(26,31,44,0.10)
--shadow-paper: 0 1px 0 rgba(26,31,44,.04), 0 8px 22px -10px rgba(26,31,44,.18)
```

### Espaciado
Múltiplos de 4px. Containers max-width:
- Mobile: padding lateral 20px.
- Desktop home/categoría: 1200px.
- Artículo (lectura): 720px columna principal.

---

## Componentes firmados (reutilizables)

Definidos en `design_files/components.jsx`. Para cada uno, el dev debe portarlo al stack destino.

- **`<Logo>`**: SVG inline parametrizable (size, theme).
- **`<Header>`**: sticky, transparente arriba, blur al scroll.
- **`<Footer>`**: 3 columnas desktop, stacked mobile.
- **`<ArticleCard>`**: cover placeholder + categoría + título + meta. Variante featured (más grande con descripción).
- **`<CategoryBadge>`**: chip pequeño con punto de color de la categoría + nombre uppercase mono.
- **`<AgeBadge>`**: badge grande con label "EDAD" arriba mono y rango debajo Fredoka. Para hero artículo.
- **`<ReadTimer>`**: icono ⏱ + duración en mono. Formato `M:SS`.
- **`<DorsalNumber>`**: número grande Fredoka 700 con outline o fill plano. Decorativo.
- **`<MarkerHighlight>`**: span con background gradient amarillo simulando marcador.
- **`<TacticalBoard>`**: SVG cancha + flechas para ilustrar ejercicios.
- **`<TOC>`**: lista numerada con dorsales + cronómetro restante por sección, sticky desktop / acordeón mobile.
- **`<AdSlot>`**: caja con borde dashed `1px` color `--color-border-strong`, label "Publicidad" mono uppercase arriba, fondo hatched (`repeating-linear-gradient(135deg, transparent, transparent 8px, var(--color-rule) 8px, var(--color-rule) 9px)`).
- **`<NewsletterBanner>`**: sticky bottom mobile, cerrable.
- **`<FieldLines>`**: SVG decorativo de líneas de campo, opacity .04, posicionable absoluto.

---

## Assets

- **Fuentes**: Google Fonts (Fredoka, Nunito, Caveat, JetBrains Mono). Self-host recomendado en producción.
- **Logo**: SVG inline en componente `<Logo>` (no archivo externo). Path completo en sección "Logotipo" arriba.
- **Imágenes**: **no hay imagen real**. Todos los covers son placeholders editoriales: caja con bandas + label monoespaciado tipo `cover artículo · 1200x750`. El cliente proveerá fotos reales antes del lanzamiento.
- **Ilustración hero home**: SVG inline simplificado de cuaderno + post-it. Sustituible por ilustración custom.
- **Iconos**: minimalistas, inline SVG. No usar librerías pesadas (Lucide recomendado si se necesita una). Cronómetro = ⏱ emoji o SVG simple.

---

## Files

```
design_files/
├── Logo A refinado.html      ← logo final con todas las variantes y aplicaciones
├── MiniGol v2.html           ← canvas con las 3 plantillas (mobile + desktop)
├── styles.css                ← tokens y utilidades base (cuaderno de campo)
├── components.jsx            ← componentes compartidos (Header, ArticleCard, etc.)
├── layout.jsx                ← scaffolding general
├── page-home.jsx             ← plantilla Home
├── page-category.jsx         ← plantilla Categoría
├── page-article.jsx          ← plantilla Artículo
├── design-canvas.jsx         ← shell del canvas (no portar)
└── tweaks-panel.jsx          ← panel de tweaks (no portar — es devtool)
```

### Cómo abrir las referencias
Abrir `design_files/MiniGol v2.html` directamente en navegador. El canvas permite hacer zoom, panear y abrir cada artboard a pantalla completa con doble clic.

`design_files/Logo A refinado.html` muestra el logo en todas las escalas y fondos.

---

## Notas finales para el desarrollador

1. **Contenido placeholder**: todos los textos son provisionales. El cliente proveerá copy final antes de publicar.
2. **SEO**: el sitio prioriza keywords como "ejercicios fútbol niños 8 años", "qué comer antes de un partido infantil". Cada artículo necesita meta description, OG image (placeholder por ahora), schema Article + Person para el autor (E-E-A-T).
3. **Performance**: target Lighthouse ≥ 95 en mobile. Self-host fuentes, lazy-load imágenes, no JS pesado en home/categoría.
4. **Accesibilidad**: contraste AAA en texto principal, AA en meta. Todos los botones con focus ring visible (outline 2px `--color-accent` + offset 2px). Skip-to-content link en header.
5. **Internacionalización**: solo español por ahora. Diseñar URLs y components con prefijo `/es/` para futura expansión.
6. **No portar** `design-canvas.jsx` ni `tweaks-panel.jsx` — son herramientas de presentación de los mockups, no parte del producto.

¿Dudas? Los mockups responden preguntas que esta documentación no cubra. Cuando haya conflicto, **el mockup manda** sobre el README.
