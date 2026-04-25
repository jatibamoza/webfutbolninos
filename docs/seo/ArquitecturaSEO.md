# Arquitectura SEO — MiniGol Club
## Silos, URLs, Internal Linking y Schema Markup

> Documento vivo de referencia para toda publicación de contenido. Revisa antes de abrir cada artículo.

---

## 1. Modelo de Silos — Hub & Spoke × Edad

El sitio se organiza en **2 dimensiones entrecruzadas:**
- **Pilares temáticos (6)** — según `KeywordResearch.md` §1
- **Segmentación por edad (3)** — 4-6, 7-9, 10-12 años (schema `edadMin`/`edadMax` en frontmatter)

**Resultado:** 6 silos primarios + silos secundarios por edad + sub-clusters temáticos.

---

## 2. Los 6 Pilares — Hub Pages + Clusters

### PILAR 1: Ejercicios de Fútbol Infantil (35% tráfico esperado)

**Hub Page Principal:**
- **URL:** `/articulos/ejercicios/` (listado categoría dinámico)
- **H1:** "Ejercicios de Fútbol Infantil por Edad"
- **Intent:** Navegacional + informacional (padre busca "¿qué ejercicio para mi hijo?")
- **Longitud:** 2500-3500 palabras
- **Rol:** Puerta de entrada al pilar; lista de clusters enlazados; sirve como puerta a subcategorías por edad

**Clusters principales (mínimo 5 per edad × 3 = 15 artículos):**

#### Cluster 1.1: Por Edad de Iniciación (4-6 años)
- **Hub Cluster:** `/articulos/ejercicios/iniciacion-4-6-anos/`
- **H1:** "Ejercicios Fútbol Niños de 4 a 6 Años — Guía Padre"
- **Keyword:** "ejercicios fútbol niños 4 años" (P0)
- **Longitud:** 2000 palabras
- **Artículos satélite (spokes):**
  1. `/articulos/ejercicios/conduccion-balon-4-anos/` — "Conducción de Balón: Ejercicios para 4 Años"
  2. `/articulos/ejercicios/coordinacion-motriz-5-anos/` — "Coordinación Motriz: 5 Ejercicios Fútbol 5 Años"
  3. `/articulos/ejercicios/pase-balon-6-anos/` — "Pase y Control: Ejercicios para 6 Años"
  4. `/articulos/ejercicios/juegos-sin-material-4-6/` — "Juegos Fútbol sin Material para 4-6 Años"
  5. `/articulos/ejercicios/coordinacion-equilibrio-6-anos/` — "Equilibrio y Coordinación: 6 Ejercicios 6 Años"

#### Cluster 1.2: Nivel Intermedio (7-9 años)
- **Hub Cluster:** `/articulos/ejercicios/intermedio-7-9-anos/`
- **H1:** "Ejercicios Fútbol Niños 7-9 Años — Progresión y Técnica"
- **Keyword:** "ejercicios fútbol niños 7 años" (P0)
- **Artículos satélite:**
  1. `/articulos/ejercicios/regate-basico-7-anos/` — "Primeros Regates: Ejercicios 7 Años"
  2. `/articulos/ejercicios/tiro-gol-8-anos/` — "Ejercicios de Tiro y Gol para 8 Años"
  3. `/articulos/ejercicios/defensa-infantil-9-anos/` — "Defensa Básica: Ejercicios 9 Años"
  4. `/articulos/ejercicios/pase-largo-control-7-9/` — "Pase Largo y Control: 7-9 Años"
  5. `/articulos/ejercicios/presion-tactica-8-anos/` — "Presión Táctica Básica: 8 Años"

#### Cluster 1.3: Nivel Avanzado (10-12 años)
- **Hub Cluster:** `/articulos/ejercicios/avanzado-10-12-anos/`
- **H1:** "Ejercicios Fútbol Niños 10-12 Años — Técnica Avanzada"
- **Keyword:** "ejercicios fútbol niños 10 años" (P0)
- **Artículos satélite:**
  1. `/articulos/ejercicios/regate-avanzado-10-anos/` — "Regates Avanzados y Feints para 10 Años"
  2. `/articulos/ejercicios/posicionamiento-tactico-11-anos/` — "Posicionamiento Táctico: 11 Años"
  3. `/articulos/ejercicios/tiro-potencia-presicion-12/` — "Tiro Potencia y Precisión: 12 Años"
  4. `/articulos/ejercicios/transicion-ataque-defensa-10-12/` — "Transición Ataque-Defensa: 10-12 Años"
  5. `/articulos/ejercicios/cobros-saques-10-anos/` — "Cobros y Saques Esquina: 10 Años"

#### Cluster 1.4: Sin Material / En Casa
- **Hub Cluster:** `/articulos/ejercicios/sin-material/`
- **H1:** "Ejercicios Fútbol Sin Balón ni Material — Para Jugar en Casa"
- **Keyword:** "ejercicios fútbol niños sin balón" (P0)
- **Artículos satélite:**
  1. `/articulos/ejercicios/coordinacion-sin-balon-4-6/` — "Coordinación sin Balón: 4-6 Años"
  2. `/articulos/ejercicios/movilidad-sin-material-7-9/` — "Movilidad y Flexibilidad sin Equipo: 7-9 Años"
  3. `/articulos/ejercicios/fuerza-basica-niños-10-12/` — "Fuerza Básica sin Peso: 10-12 Años"
  4. `/articulos/ejercicios/espacio-reducido-pequeño-patio/` — "Ejercicios en Espacio Reducido: Patio Pequeño"
  5. `/articulos/ejercicios/entrenamiento-apartamento/` — "Plan Entrenamiento en Apartamento (Padre Ocupado)"

#### Cluster 1.5: Circuitos Temáticos
- **Hub Cluster:** `/articulos/ejercicios/circuitos/`
- **H1:** "Circuitos de Entrenamiento Fútbol Infantil — Sesiones Prácticas"
- **Keyword:** "circuitos entrenamiento fútbol niños"
- **Artículos satélite:**
  1. `/articulos/ejercicios/circuito-tecnico-20-min/` — "Circuito Técnico 20 Minutos (Cualquier Edad)"
  2. `/articulos/ejercicios/circuito-resistencia-7-9/` — "Circuito Resistencia: 7-9 Años"
  3. `/articulos/ejercicios/circuito-coordinacion-4-6/` — "Circuito Coordinación: 4-6 Años"
  4. `/articulos/ejercicios/sesion-mixta-30-minutos/` — "Sesión Mixta 30 Minutos: Técnica + Juego"
  5. `/articulos/ejercicios/programa-4-semanas-iniciacion/` — "Programa 4 Semanas: Iniciación Completa"

**Diagrama Pilar 1 — Hub & Spoke:**
```
                    ┌─── Hub Principal: /articulos/ejercicios/
                    │
        ┌───────────┼───────────┐
        │           │           │
    Cluster 1.1   Cluster 1.2  Cluster 1.3  ... Cluster 1.5
  (4-6 años)   (7-9 años)  (10-12 años)     (Sin material)
        │           │           │
     Spoke 1-5   Spoke 1-5   Spoke 1-5        Spoke 1-5
```

---

### PILAR 2: Juegos y Diversión (20% tráfico esperado)

**Hub Page Principal:**
- **URL:** `/articulos/juegos/`
- **H1:** "Juegos Fútbol Infantil — Divertirse Jugando"
- **Intent:** Informacional + diversión
- **Longitud:** 2000-2500 palabras
- **Rol:** Catálogo de juegos por contexto; internal linking a ejercicios

**Clusters principales (mínimo 5):**

#### Cluster 2.1: Parque y Aire Libre
- **Hub:** `/articulos/juegos/parque/`
- **H1:** "Juegos Fútbol Parque — Sin Estructura, Máxima Diversión"
- **Keyword:** "juegos fútbol parque niños" (P0)
- **Artículos satélite:**
  1. `/articulos/juegos/juegos-2-niños-parque/` — "Juegos Fútbol para 2 Niños en el Parque"
  2. `/articulos/juegos/juegos-3-4-niños-parque/` — "Juegos para 3-4 Niños sin Equipos"
  3. `/articulos/juegos/meta-relevos-perseguirse/` — "Meta, Relevos y Persecución: 5 Juegos"
  4. `/articulos/juegos/pilla-pilla-balon-espacio-abierto/` — "Pilla-Pilla con Balón: Adaptaciones"
  5. `/articulos/juegos/juegos-colosales-grandes-grupos/` — "Juegos para Grupos Grandes (Cumpleaños)"

#### Cluster 2.2: Cumpleaños y Eventos
- **Hub:** `/articulos/juegos/cumpleaños/`
- **H1:** "Juegos Fútbol para Cumpleaños — Fiesta sin Estrés"
- **Keyword:** "juegos fútbol cumpleaños niños" (P0)
- **Artículos satélite:**
  1. `/articulos/juegos/torneo-amistoso-cuadrillas/` — "Torneo Amistoso: Organización Paso a Paso"
  2. `/articulos/juegos/circuito-estaciones-cumpleaños/` — "Circuito de Estaciones: 10 Juegos Rotatorios"
  3. `/articulos/juegos/tiro-a-porteria-distancia/` — "Competición Tiro a Portería: Diversas Distancias"
  4. `/articulos/juegos/relevos-balon-equipo/` — "Relevos Fútbol: Equipos Vencedores"
  5. `/articulos/juegos/premios-baile-gol-celebracion/` — "Ceremonias y Celebración: Ideas"

#### Cluster 2.3: Juegos Cooperativos
- **Hub:** `/articulos/juegos/cooperativos/`
- **H1:** "Juegos Cooperativos Fútbol — Trabajo en Equipo sin Ganador"
- **Keyword:** "juegos cooperativos fútbol niños"
- **Artículos satélite:**
  1. `/articulos/juegos/todos-anotan-objetivo-colectivo/` — "Juegos Donde Todos Anotan (No Hay Perdedor)"
  2. `/articulos/juegos/pase-cadena-coordinacion/` — "Pase en Cadena: Ejercicio Cooperativo"
  3. `/articulos/juegos/defensa-colaborativa/` — "Defensa Colaborativa: Todos Defienden"
  4. `/articulos/juegos/construccion-por-equipos/` — "Construcción de Jugadas por Equipos"
  5. `/articulos/juegos/desafios-pareja-complementarios/` — "Desafíos en Parejas Complementarias"

#### Cluster 2.4: Estacional (Playa, Piscina, Nieve)
- **Hub:** `/articulos/juegos/estacional/`
- **H1:** "Juegos Fútbol por Estación — Adapta el Balón al Clima"
- **Keyword:** "juegos fútbol playa verano niños"
- **Artículos satélite:**
  1. `/articulos/juegos/futbol-playa-verano/` — "Fútbol Playa: Reglas y Divertimento Verano"
  2. `/articulos/juegos/futbol-piscina-agua-calda/` — "Juegos Agua con Balón: Piscina Segura"
  3. `/articulos/juegos/futbol-nieve-invierno/` — "Fútbol Nieve: Propuestas Invierno"
  4. `/articulos/juegos/futbol-otoño-lluvia/` — "Fútbol Otoño: Juegos Charcos Permitidos"
  5. `/articulos/juegos/futbol-interior-gimnasio/` — "Fútbol Interior: Gimnasio Lluvioso"

#### Cluster 2.5: Entrenamientos Lúdicos
- **Hub:** `/articulos/juegos/entrenamientos-ludicos/`
- **H1:** "Entrenamientos Lúdicos — Técnica Disfrazada de Juego"
- **Keyword:** "dinámicas fútbol entrenamiento infantil" (P1)
- **Artículos satélite:**
  1. `/articulos/juegos/juego-conduccion-slalom/` — "Juego Slalom: Conducción Técnica Oculta"
  2. `/articulos/juegos/juego-pase-circulo/` — "Pase en Círculo: Precisión Técnica"
  3. `/articulos/juegos/juego-regate-obstaculos/` — "Regate Obstáculos: Velocidad + Control"
  4. `/articulos/juegos/competicion-tiro-variado/` — "Competición Tiro: Múltiples Ángulos"
  5. `/articulos/juegos/juego-defensa-cazador/` — "Cazador y Cazado: Defensa Dinámico"

---

### PILAR 3: Equipamiento y Afiliados (15% tráfico — transaccional)

**Hub Page Principal:**
- **URL:** `/articulos/equipamiento/`
- **H1:** "Equipamiento Fútbol Infantil — Guía de Compra"
- **Intent:** Transaccional (comparativas, reviews, Amazon)
- **Longitud:** 2000-2500 palabras
- **Rol:** Central de comparativas; enlaza a guías de tallas, marcas, tipos

**Clusters principales (mínimo 5):**

#### Cluster 3.1: Balones por Edad
- **Hub:** `/articulos/equipamiento/balones/`
- **H1:** "Balones Fútbol Infantil — Talla y Edad: Guía Definitiva"
- **Keyword:** "mejor balón fútbol niños 5 años" (P0)
- **Artículos satélite:**
  1. `/articulos/equipamiento/balon-talla-3-4-6-anos/` — "Balón Talla 3: Edad, PU/PVC, Marcas Recomendadas"
  2. `/articulos/equipamiento/balon-talla-4-7-12-anos/` — "Balón Talla 4: Transición Infantil a Oficial"
  3. `/articulos/equipamiento/balon-sala-futsal/` — "Balón Futsal: Mejor Control, Espacio Reducido"
  4. `/articulos/equipamiento/balon-playa-pvc/` — "Balón Playa: Resistencia y Flotación"
  5. `/articulos/equipamiento/comparativa-balones-marcas-precio/` — "Comparativa: Nike, Adidas, Puma, Decathlon (Talla 3-4)"

#### Cluster 3.2: Botas y Calzado
- **Hub:** `/articulos/equipamiento/botas/`
- **H1:** "Botas Fútbol Niños — Tallas 30-33: Marcas y Fit"
- **Keyword:** "botas fútbol niños talla 30" (P0)
- **Artículos satélite:**
  1. `/articulos/equipamiento/botas-talla-30-guia-marca-fit/` — "Talla 30: Nike, Adidas, Joma (Medidas Reales)"
  2. `/articulos/equipamiento/botas-talla-31-32-ninos/` — "Talla 31-32: Transición 7-9 Años"
  3. `/articulos/equipamiento/botas-talla-33-preadolescente/` — "Talla 33: Preadolescentes 10-12"
  4. `/articulos/equipamiento/botines-sg-ag-terreno/` — "SG vs AG: Tipo Terreno y Suelas"
  5. `/articulos/equipamiento/botas-amazon-decathlon-baratas/` — "Botas Baratas: Amazon Afiliados vs Decathlon"

#### Cluster 3.3: Material de Entrenamiento
- **Hub:** `/articulos/equipamiento/material-entrenamiento/`
- **H1:** "Material de Entrenamiento — Conos, Petos, Arcos"
- **Keyword:** "conos fútbol infantil entrenamiento" (P1)
- **Artículos satélite:**
  1. `/articulos/equipamiento/conos-marcadores-decathlon-amazon/` — "Conos vs Platos vs Marcadores: Comparativa"
  2. `/articulos/equipamiento/petos-entrenamiento-colores/` — "Petos Entrenamiento: Tallas y Combos"
  3. `/articulos/equipamiento/arco-porteria-transportable/` — "Arco Portería Transportable: Medidas y Marcas"
  4. `/articulos/equipamiento/escalera-coordinacion-agilidad/` — "Escalera Coordinación: Ejercicios + Producto"
  5. `/articulos/equipamiento/aros-discos-entrenamiento/` — "Aros y Discos: Entrenamiento Técnico Barato"

#### Cluster 3.4: Protecciones y Accesorios
- **Hub:** `/articulos/equipamiento/protecciones/`
- **H1:** "Protecciones Fútbol — Espinilleras, Muñequeras, Guantes"
- **Keyword:** "espinilleras niños fútbol" (P1)
- **Artículos satélite:**
  1. `/articulos/equipamiento/espinilleras-tibia-proteccion/` — "Espinilleras: Talla, Ajuste, Marcas Seguras"
  2. `/articulos/equipamiento/guantes-portero-ninos/` — "Guantes Portero: Talla 4-6 Infantil"
  3. `/articulos/equipamiento/muñequeras-tobilleras/` — "Muñequeras y Tobilleras: Apoyo Articulaciones"
  4. `/articulos/equipamiento/casco-protector-cabeza-opcional/` — "Protector Cabeza: Cuándo es Necesario"
  5. `/articulos/equipamiento/bolsa-mochila-balon-transportable/` — "Bolsa de Balón: Organización y Transporte"

#### Cluster 3.5: Ropa Deportiva
- **Hub:** `/articulos/equipamiento/ropa-deportiva/`
- **H1:** "Equipación y Ropa Fútbol — Jersey, Shorts, Medias"
- **Keyword:** "primera equipacion fútbol niño" (P2)
- **Artículos satélite:**
  1. `/articulos/equipamiento/jersey-camiseta-talla-ninos/` — "Jersey Fútbol: Tallas Reales vs Edad"
  2. `/articulos/equipamiento/short-pantalon-deportivo/` — "Shorts: Largo, Tela, Bolsillos"
  3. `/articulos/equipamiento/medias-calcetines-deportivos/` — "Medias Deportivas: Algodón vs Sintético"
  4. `/articulos/equipamiento/chandal-abrigo-deportivo/` — "Chandal: Abrigo Pre/Post Entrenamiento"
  5. `/articulos/equipamiento/kit-completo-equipacion/` — "Kit Completo: Calcular Presupuesto Año"

---

### PILAR 4: Iniciación y Primeros Pasos (10% tráfico)

**Hub Page Principal:**
- **URL:** `/articulos/iniciacion/`
- **H1:** "Iniciación Fútbol Infantil — Guía Padre Principiante"
- **Intent:** Informacional (padre nuevato)
- **Longitud:** 2500-3000 palabras
- **Rol:** Puerta educativa; sitio para padre inseguro

**Clusters principales (mínimo 5):**

#### Cluster 4.1: Edad de Iniciación
- **Hub:** `/articulos/iniciacion/edad-inicio/`
- **H1:** "¿A Qué Edad Empezar Fútbol? Guía por Edad"
- **Keyword:** "a qué edad empezar fútbol niños" (P0) + "primer balón 3 años" (P0)
- **Longitud:** 2000 palabras
- **Artículos satélite:**
  1. `/articulos/iniciacion/futbol-3-anos-primer-contacto/` — "Fútbol desde los 3 Años: Primer Balón"
  2. `/articulos/iniciacion/futbol-4-anos-iniciacion-real/` — "Fútbol 4 Años: Cuándo Empieza de Verdad"
  3. `/articulos/iniciacion/futbol-5-6-anos-escuela/` — "Fútbol 5-6 Años: ¿Escuela o Casa?"
  4. `/articulos/iniciacion/futbol-7-anos-competicion/` — "Fútbol 7 Años: Introducción a Competir"
  5. `/articulos/iniciacion/desarrollo-motor-edad-fases/` — "Fases Desarrollo Motor: Qué Esperar cada Año"

#### Cluster 4.2: Cómo Enseñar sin Experiencia
- **Hub:** `/articulos/iniciacion/padre-sin-experiencia/`
- **H1:** "Cómo Enseñar Fútbol a tu Hijo (Sin Saber Jugar)"
- **Keyword:** "cómo enseñar fútbol niño desde cero" (P0)
- **Artículos satélite:**
  1. `/articulos/iniciacion/padre-futbolista-inseguridad/` — "Papá no Jugó Federado: Cómo Superar la Inseguridad"
  2. `/articulos/iniciacion/no-saber-reglas-fútbol-padre/` — "Si No Sabes las Reglas: Aprende Rápido"
  3. `/articulos/iniciacion/enseñanza-practica-padre-coach/` — "Rol del Padre Coach: Instrucciones Claras"
  4. `/articulos/iniciacion/errores-comunes-papas-primeriza/` — "5 Errores Tipicos Padres Primerizos"
  5. `/articulos/iniciacion/aprovechar-escuela-fútbol-casa/` — "Escuela + Casa: Cómo Complementar"

#### Cluster 4.3: Primera Escuela de Fútbol
- **Hub:** `/articulos/iniciacion/escuela-futbol/`
- **H1:** "Elegir Escuela Fútbol Infantil — Criterios de Calidad"
- **Keyword:** "elegir escuela fútbol infantil"
- **Artículos satélite:**
  1. `/articulos/iniciacion/que-esperar-primera-sesion/` — "Primer Día en Escuela: Qué Esperar, Cómo Ayudar"
  2. `/articulos/iniciacion/entrenador-pediagógico-vs-militar/` — "Tipos Entrenador: Lúdico vs Competitivo"
  3. `/articulos/iniciacion/requisitos-equipacion-basica/` — "Equipación Mínima: Qué Comprar Antes"
  4. `/articulos/iniciacion/comunicacion-entrenador-padre/` — "Hablar con el Entrenador: Guía Constructiva"
  5. `/articulos/iniciacion/intensidad-frecuencia-entrenos/` — "¿Cuántas Sesiones? Intensidad Recomendada Edad"

#### Cluster 4.4: Miedo e Inseguridad
- **Hub:** `/articulos/iniciacion/miedo-inseguridad/`
- **H1:** "Mi Hijo Tiene Miedo al Fútbol — Cómo Ayudar"
- **Keyword:** "miedo fútbol inseguridad niño"
- **Artículos satélite:**
  1. `/articulos/iniciacion/fobia-balon-timidez/` — "Miedo al Balón: Exposición Gradual"
  2. `/articulos/iniciacion/bloqueo-psicologico-competicion/` — "Bloqueo en Competición: Técnicas Padre"
  3. `/articulos/iniciacion/nino-no-quiere-jugar-presion/` — "Mi Hijo NO Quiere Jugar: Cómo Actuar"
  4. `/articulos/iniciacion/comparacion-companeros-autoestima/` — "Comparación con Otros: Gestionar Baja Autoestima"
  5. `/articulos/iniciacion/dejar-o-perseguir-señales/` — "¿Dejar el Fútbol o Insistir? Señales Claras"

#### Cluster 4.5: Coordinación y Fundamentos
- **Hub:** `/articulos/iniciacion/fundamentos-base/`
- **H1:** "Fundamentos Técnicos Básicos — 4 Semanas Iniciación"
- **Keyword:** "ejercicios coordinación fútbol niños" (P0)
- **Artículos satélite:**
  1. `/articulos/iniciacion/como-controlar-balon-basico/` — "Control de Balón: Primeros Toques"
  2. `/articulos/iniciacion/conduccion-primer-ejercicio/` — "Conducción: Primera Actividad"
  3. `/articulos/iniciacion/pase-recepcion-basica/` — "Pase y Recepción: Fundamento 2"
  4. `/articulos/iniciacion/tiro-gol-enfoque-basico/` — "Tiro a Gol: Primeras Tentativas"
  5. `/articulos/iniciacion/defensa-elemental-tapar-balon/` — "Defensa Elemental: Tapar, No Cargar"

---

### PILAR 5: Beneficios y Educación (12% tráfico)

**Hub Page Principal:**
- **URL:** `/articulos/beneficios/`
- **H1:** "Beneficios del Fútbol en Niños — Desarrollo Integral"
- **Intent:** Informacional (autoridad E-E-A-T, padre busca justificación educativa)
- **Longitud:** 2500-3000 palabras
- **Rol:** Referencia de autoridad; lead-magnet para newsletter

**Clusters principales (mínimo 5):**

#### Cluster 5.1: Beneficios Físicos
- **Hub:** `/articulos/beneficios/beneficios-fisicos/`
- **H1:** "Beneficios Físicos del Fútbol — Desarrollo Motor y Salud"
- **Keyword:** "beneficios fútbol niños salud" (P0)
- **Artículos satélite:**
  1. `/articulos/beneficios/desarrollo-motor-coordinacion/` — "Desarrollo Psicomotor: Qué Mejora con Fútbol"
  2. `/articulos/beneficios/resistencia-cardiovascular/` — "Resistencia Cardiovascular: Deporte Aeróbico"
  3. `/articulos/beneficios/fuerza-osea-densidad/` — "Fortalecimiento Óseo: Salud a Largo Plazo"
  4. `/articulos/beneficios/flexibilidad-equilibrio-balon/` — "Flexibilidad y Equilibrio: Habilidades Permanentes"
  5. `/articulos/beneficios/crecimiento-estatura-deporte-regular/` — "¿Crece Más Jugando? Sí, Dentro de Límites Genéticos"

#### Cluster 5.2: Beneficios Psicológicos
- **Hub:** `/articulos/beneficios/beneficios-psicologicos/`
- **H1:** "Beneficios Psicológicos del Fútbol — Autoestima y Confianza"
- **Keyword:** "autoestima confianza fútbol niños" (P2)
- **Artículos satélite:**
  1. `/articulos/beneficios/autoestima-confianza-logros/` — "Autoestima a Través del Logro: Pasos Motivacionales"
  2. `/articulos/beneficios/gestion-frustacion-derrota/` — "Gestión de Frustración: Aprender del Error"
  3. `/articulos/beneficios/resilencia-capacidad-recuperacion/` — "Resiliencia: Caer y Levantarse"
  4. `/articulos/beneficios/manejo-ansiedad-competencia/` — "Ansiedad Competitiva: Técnicas Pre-Partido"
  5. `/articulos/beneficios/reduccion-estres-ejercicio/` — "Reducción Estrés: Ejercicio Como Válvula"

#### Cluster 5.3: Valores y Habilidades Sociales
- **Hub:** `/articulos/beneficios/valores-educacion/`
- **H1:** "Valores en el Fútbol — Trabajo en Equipo, Disciplina, Respeto"
- **Keyword:** "trabajo en equipo fútbol infantil" (P1)
- **Artículos satélite:**
  1. `/articulos/beneficios/trabajo-equipo-compañerismo/` — "Trabajo en Equipo: Más que Ganar"
  2. `/articulos/beneficios/disciplina-esfuerzo-compromiso/` — "Disciplina: Mostrarse Sin Desculpas"
  3. `/articulos/beneficios/respeto-arbitro-reglas/` — "Respeto a Árbitro y Reglas: No Negocia"
  4. `/articulos/beneficios/inclusion-diversidad-genero/` — "Inclusión: Niñas en Fútbol Mixto"
  5. `/articulos/beneficios/empatia-comprension-contrincante/` — "Empatía: Entender al Rival"

#### Cluster 5.4: Psicología Parental
- **Hub:** `/articulos/beneficios/psicologia-parental/`
- **H1:** "Psicología Deportiva Parental — Sin Presión Competitiva"
- **Keyword:** "presión competencia niños deporte" (P2)
- **Artículos satélite:**
  1. `/articulos/beneficios/ser-espectador-constructivo/` — "Ser Espectador Constructivo: Guía Padre Afición"
  2. `/articulos/beneficios/presion-padres-infantil-rendimiento/` — "Cómo NO Presionar: Límites Saludables"
  3. `/articulos/beneficios/comunicacion-padre-entrenador/` — "Triada Padre-Entrenador-Hijo: Comunicación"
  4. `/articulos/beneficios/acompañar-sin-exigencia/` — "Acompañar sin Exigencia: Rol Padre"
  5. `/articulos/beneficios/ambicion-sana-vs-obsesion/` — "Ambición Sana vs Obsesión: Señales de Alarma"

#### Cluster 5.5: Desarrollo Educativo General
- **Hub:** `/articulos/beneficios/educacion-integral/`
- **H1:** "Desarrollo Educativo Integral — Fútbol Complementa Escuela"
- **Keyword:** "desarrollo integral fútbol"
- **Artículos satélite:**
  1. `/articulos/beneficios/concentracion-memoria-estrategia/` — "Concentración y Memoria: Ventajas Cognitivas"
  2. `/articulos/beneficios/toma-decisiones-rapidez/` — "Toma de Decisiones: Pensamiento Rápido"
  3. `/articulos/beneficios/aprendizaje-liderazgo-infantil/` — "Liderazgo Inicial: Roles en Equipo"
  4. `/articulos/beneficios/inteligencia-emocional-deporte/` — "Inteligencia Emocional: Gestión Emocional"
  5. `/articulos/beneficios/disciplina-escuela-trasvaso/` — "Trasvase a Escuela: Disciplina Transferible"

---

### PILAR 6: Contenido Estacional y Eventos (8% tráfico + viral)

**Hub Page Principal:**
- **URL:** `/articulos/eventos/`
- **H1:** "Fútbol Infantil: Eventos, Mundiales, LaLiga — Guía Padre"
- **Intent:** Informacional + narrativo + trending
- **Longitud:** 1500-2000 palabras (actualizable)
- **Rol:** Entrada a contenido estacional; tráfico viral pre-evento

**Clusters principales (mínimo 5):**

#### Cluster 6.1: Mundial 2026 (Estacional, junio-julio)
- **Hub:** `/articulos/eventos/mundial-2026/`
- **H1:** "Mundial 2026 para Niños — Cómo Explicar y Disfrutar"
- **Keyword:** "explicación mundial fútbol para niños" (P1) + "calendario mundial 2026 niños" (P2)
- **Publicación:** Abril-mayo 2026 (4-8 semanas antes)
- **Artículos satélite:**
  1. `/articulos/eventos/que-es-mundial-como-funciona/` — "¿Qué es el Mundial? Torneo Explicado Fácil"
  2. `/articulos/eventos/selecciones-mejores-mundial-2026/` — "Selecciones Candidatas: Favoritas y Sorpresas"
  3. `/articulos/eventos/calendarios-horas-españa-mundial/` — "Calendario 2026: Horas de Partidos España"
  4. `/articulos/eventos/actividades-mundial-en-casa/` — "Actividades Casa: Ver el Mundial Juntos"
  5. `/articulos/eventos/jugadores-famosos-mundial-para-niños/` — "Jugadores Estrellas: Historias Inspiradoras"

#### Cluster 6.2: LaLiga y Campeonatos
- **Hub:** `/articulos/eventos/laliga/`
- **H1:** "LaLiga para Niños — Explicación Sencilla"
- **Keyword:** "explicación LaLiga niños" (P2)
- **Artículos satélite:**
  1. `/articulos/eventos/como-funciona-laliga-jornadas/` — "¿Cómo Funciona LaLiga? Sistema de Puntos"
  2. `/articulos/eventos/equipos-laliga-explicados-niños/` — "Los 20 Equipos: Colores, Historias Rápidas"
  3. `/articulos/eventos/champions-league-ninos/` — "Champions League: ¿Qué es? ¿Por Qué Mola?"
  4. `/articulos/eventos/mejores-jugadores-laliga-2026/` — "Mejores Jugadores: Perfiles Estrellas"
  5. `/articulos/eventos/ver-partidos-en-familia/` — "Ver LaLiga en Familia: Aprender Disfrutando"

#### Cluster 6.3: Ídolos y Figuras
- **Hub:** `/articulos/eventos/idolos/`
- **H1:** "Jugadores Famosos para Niños — Historias Inspiradoras"
- **Keyword:** "ronaldo historia para niños" (P2) + "messi vida carrera niños" (P2)
- **Artículos satélite:**
  1. `/articulos/eventos/cristiano-ronaldo-vida-niños/` — "Cristiano Ronaldo: De la Pobreza al Éxito"
  2. `/articulos/eventos/leo-messi-carrera-historia/` — "Leo Messi: El Pequeño Grande"
  3. `/articulos/eventos/futbolistas-españoles-famosos/` — "Futbolistas Españoles: Referentes Nacionales"
  4. `/articulos/eventos/mujeres-futbolistas-famosas/` — "Jugadoras Mujeres: Referentes Fútbol Femenino"
  5. `/articulos/eventos/historias-superacion-jugadores/` — "Historias de Superación: Ídolos Reales"

#### Cluster 6.4: Fútbol Femenino
- **Hub:** `/articulos/eventos/futbol-femenino/`
- **H1:** "Fútbol Femenino para Niñas — Referencias y Oportunidades"
- **Keyword:** "fútbol femenino para niñas" (P2) + "jugadoras famosas mundiales" (P2)
- **Artículos satélite:**
  1. `/articulos/eventos/futbol-niñas-mismo-valor/` — "Fútbol Niñas: Igual de Emocionante"
  2. `/articulos/eventos/campeonato-mundial-femenino/` — "Mundial Femenino: Próximas Ediciones"
  3. `/articulos/eventos/ligas-femeninas-españa/` — "Liga Femenina Española: Equipos y Estrellas"
  4. `/articulos/eventos/mujeres-futbol-rompen-barreras/` — "Historia: Mujeres en Fútbol (Desde el Veto)"
  5. `/articulos/eventos/igualdad-genero-balon-juntos/` — "Igualdad: Entrenar Juntos sin Diferencia"

#### Cluster 6.5: Regalos y Navidad
- **Hub:** `/articulos/eventos/regalos-navidad/`
- **H1:** "Regalos Fútbol Navidad — Balones, Botas, Experiencias"
- **Keyword:** "regalos fútbol navidad niños" (P2)
- **Publicación:** Octubre-noviembre
- **Artículos satélite:**
  1. `/articulos/eventos/mejor-regalo-balon-edad/` — "Mejor Regalo Balón: Qué Funciona Cada Edad"
  2. `/articulos/eventos/botas-regalo-reyes-magos/` — "Botas Fútbol: Regalo Estrella Navidad"
  3. `/articulos/eventos/experiencias-regalo-escuela-futbol/` — "Regalo Experiencia: Clase en Escuela"
  4. `/articulos/eventos/accesorios-regalos-baratos/` — "Regalos Baratos: Accesorios <30€"
  5. `/articulos/eventos/pack-regalo-balon-botas-petos/` — "Pack Navidad: Combo Inicio Fútbol"

---

## 3. Estructura de URLs — Patrón Definitivo

### 3.1 Patrón Canónico

```
/articulos/<categoria>/<slug>/
```

**Justificación:**
- **`/articulos/`** — Prefijo identificador (vs `/blog/`, `/recursos/`, `/guia/`)
- **`<categoria>`** — De `categorias` collection (ejercicios, juegos, equipamiento, iniciacion, beneficios, eventos)
- **`<slug>`** — Kebab-case en español, contiene keyword principal
- **Trailing slash obligatorio** — Astro genera así por defecto

**Ejemplos válidos:**
- `/articulos/ejercicios/conduccion-balon-4-anos/`
- `/articulos/juegos/parque/` (hub cluster)
- `/articulos/equipamiento/balon-talla-3/`
- `/articulos/beneficios/beneficios-fisicos/` (hub cluster secundario)

### 3.2 URLs de Páginas de Soporte

| Página | URL | Tipo | Índex | Notas |
|--------|-----|------|-------|-------|
| Home | `/` | Página | ✅ | Canonical + schema WebSite |
| Sobre nosotros | `/sobre-nosotros/` | Página | ✅ | E-E-A-T crítico |
| Autor: {nombre} | `/autores/{autor-slug}/` | Páginas colección | ✅ | Perfil autor, schema Person |
| Política privacidad | `/politica-privacidad/` | Página | ✅ | Obligatoria AdSense |
| Política cookies | `/politica-cookies/` | Página | ✅ | RGPD obligatorio |
| Aviso legal | `/aviso-legal/` | Página | ✅ | Nombre titular, contacto |
| Contacto | `/contacto/` | Página | ✅ | Formulario simple |
| Búsqueda (Pagefind) | `/buscar/` | Página | ✅ | UI Pagefind integrada |
| Categoría: {cat} (listado) | `/articulos/{categoria}/` | Dinámico | ✅ | Listado paginado (ver §3.3) |
| Recursos descargables | `/recursos/` | Página | ✅ | Hub descargables |
| Recurso: {pdf} | `/recursos/{slug}/` | Dinámico | ✅ | Landing descargable (lead magnet) |
| 404 | `/404/` | Página | ❌ | Noindex automático |
| RSS feed | `/rss.xml` | Feed | ✅ | Dinámico Astro |
| Sitemap Index | `/sitemap-index.xml` | Índice | ✅ | Particionado por tipo |

### 3.3 Paginación y Filtros

**Patrón:**
```
/articulos/{categoria}/              # Página 1
/articulos/{categoria}/?page=2       # Página 2+
```

**Política Noindex:**
- `/articulos/{categoria}/?page=2+` → **noindex, follow**
  - Razón: Contenido duplicado, pages subsecuentes bajo valor
- `/articulos/{categoria}/` (página 1) → **index, follow**
  - Rol: Hub de categoría, entrada SEO legítima

**Filtros por edad:**
```
/articulos/{categoria}/?edad=4-6    # Filtro URL (noindex)
```
- Tratamiento: **noindex, follow** (contenido filtrado = vista derivada)
- Lógica: Un artículo pertenece a categoría + rango edad (no necesita URL filtrada)

**Búsqueda interna (Pagefind):**
```
/buscar/?q=ejercicios+regate
```
- Tratamiento: **noindex, follow** (variable dinámico)

### 3.4 Slugs en Español — Kebab-case + Keyword

**Regla obligatoria:**
1. Slug = Keyword principal en kebab-case español
2. Máximo 60 caracteres (largo pero legible)
3. Contiene variantes LSI si caben naturales

**Ejemplos válidos:**
- `conduccion-balon-4-anos` ← "conducción balón" + edad
- `mejor-balon-futbol-niños-5-anos` ← money keyword completa
- `juegos-fútbol-parque-niños` ← keyword + contexto
- `cómo-enseñar-fútbol-sin-saber` ← query frase entera

**Ejemplos INVÁLIDOS:**
- `ejercicio-1` ← sin keyword
- `conduccion_balon_4` ← guiones bajos (ASCII incorrecto)
- `conduccion-de-balon-para-ninos-de-cuatro-anos-paso-a-paso` ← sobredimensionado
- `futbol-niños-españa-aprender-tecnicas` ← demasiadas keywords (canibalización)

### 3.5 Manejo de URLs Similares — Evitar Canibalización

**Caso: Múltiples artículos edad 4-6 años**

❌ **PROBLEMA (canibalización):**
```
/articulos/ejercicios/ejercicios-4-anos/
/articulos/ejercicios/ejercicios-ninos-4-anos/
/articulos/ejercicios/ninos-4-anos-futbol/
```
→ Google confundido; CTR disperso

✅ **SOLUCIÓN (clustering):**
```
/articulos/ejercicios/iniciacion-4-6-anos/                    [HUB cluster]
  ├─ /articulos/ejercicios/conduccion-balon-4-anos/           [spoke: técnica]
  ├─ /articulos/ejercicios/coordinacion-motriz-5-anos/        [spoke: habilidad]
  ├─ /articulos/ejercicios/pase-balon-6-anos/                 [spoke: habilidad]
  └─ /articulos/ejercicios/juegos-sin-material-4-6/           [spoke: contexto]
```

**Canonical claro:**
- Cada artículo tiene su propia URL canónica (nunca self-canonical salvo necesidad)
- Hub apunta a spokes via internal links (anchor text keyword satélite)
- Spokes enlazan atrás a hub (breadcrumb + "volver a iniciación")

---

## 4. Estrategia de Internal Linking

### 4.1 Estructura por Nivel

**Nivel 1: Hub → Cluster Hub**
- Home → `/articulos/` → `/articulos/ejercicios/` → `/articulos/ejercicios/iniciacion-4-6-anos/`

**Nivel 2: Cluster Hub → Spokes**
- `/articulos/ejercicios/iniciacion-4-6-anos/` → 5 spokes técnicos

**Nivel 3: Spoke → Spoke (Peer)**
- `/articulos/ejercicios/conduccion-balon-4-anos/` → Enlace a `/articulos/ejercicios/coordinacion-motriz-5-anos/` (complementarios)

**Nivel 4: Inter-Pilar (Cross-Silo)**
- `/articulos/ejercicios/conduccion-balon-4-anos/` → `/articulos/equipamiento/balon-talla-3-4-6-anos/` (recomendación material)
- `/articulos/iniciacion/miedo-inseguridad/` → `/articulos/beneficios/beneficios-psicologicos/` (autoridad E-E-A-T)

### 4.2 Reglas Concretas

| Elemento | Mínimo | Máximo | Notas |
|----------|--------|--------|-------|
| **Links salientes por artículo** | 3 | 7 | Interno solo; externos en caso especial (fuente científica) |
| **Links entrantes a hub (objetivo)** | 10 | 20 | Desde spokes + artículos hermanos + cross-pilar |
| **Anchor text exact-match** | 0 | 2 por artículo | Evitar sobre-optimización; variar (phrase + genérico + branded) |
| **Links desde intro/H1** | 0 | 1 | Máx 1 link contextual en párrafo intro (no ad-hoc) |
| **Links desde H2/H3** | 1 | 2 | Naturales, dentro sección temática |
| **Links al final (related)** | 3 | 5 | Componente `<RelatedArticles>` dinámico por tags |

**Anchor text — variaciones permitidas:**

Keyword: "ejercicios fútbol 4 años"

✅ **Permitidas:**
- "ejercicios para niños de 4 años" ← long-tail variante
- "iniciación fútbol infantil" ← sinonimia
- "aprende a jugar fútbol" ← genérico
- "descubre aquí" ← genérico sin keyword
- "nuestro artículo sobre iniciación" ← marca

❌ **Prohibidas (sobre-optimización):**
- "ejercicios fútbol 4 años" × 3 en mismo artículo ← repetición exact-match
- "ejercicios fútbol niños 4 años fútbol" ← keyword stuffing

### 4.3 Matriz de Internal Linking por Pilar

```
Pilar 1 (Ejercicios) — 70 artículos esperados
├─ Hub principal: /articulos/ejercicios/
│  ├─ Cluster 1.1-1.5 (5 hubs secundarios): 5 links internos mínimo
│  └─ Spokes (25-30): enlazados desde hub cluster
└─ Cross-links:
   ├─ Hacia Pilar 3 (equipamiento): 1-2 links por spoke (recomendación balón)
   ├─ Hacia Pilar 4 (iniciación): 1 link desde spokes avanzados
   └─ Hacia Pilar 5 (beneficios): 1 link desde cluster 1.1 iniciación
```

### 4.4 Componentes de Linking

**1. Breadcrumb (obligatorio en cada artículo)**
```html
Home > Ejercicios > Iniciación 4-6 años > Conducción Balón 4 Años
```
- JSON-LD: `BreadcrumbList` schema
- Visible en página (pie o sidebar)
- Último item NO enlazado (current page)

**2. Related Articles (dinámico)**
```
<RelatedArticles 
  tags={article.tags}
  category={article.category}
  limit={3}
/>
```
- Query: Otros artículos misma categoría + tags
- Mostrar 3-5 títulos + thumbnails
- Ubicación: Antes de comentarios / footer

**3. Sidebar — "Ver También" (opcional, desktop)**
- 3-4 artículos relacionados sticky
- Actualizarse dinámicamente por fecha publicación
- NO en mobile (reduce UX)

**4. Tabla de Contenidos Interactiva**
- Genera automática desde H2/H3
- Enlaces internos dentro del artículo (jump links `#seccion`)
- JSON-LD para featured snippet

---

## 5. Breadcrumbs

### 5.1 Estructura por Tipo de Página

**Tipo 1: Artículo (mayoría)**
```
Home 
  > Categoría: Ejercicios
  > Cluster: Iniciación 4-6 años  [OPCIONAL si hay cluster]
  > Artículo: Conducción Balón 4 Años [ACTUAL, sin enlace]
```

**JSON-LD:**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://futbolparaninos.club/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Ejercicios",
      "item": "https://futbolparaninos.club/articulos/ejercicios/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Iniciación 4-6 Años",
      "item": "https://futbolparaninos.club/articulos/ejercicios/iniciacion-4-6-anos/"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Conducción de Balón para 4 Años",
      "item": "https://futbolparaninos.club/articulos/ejercicios/conduccion-balon-4-anos/"
    }
  ]
}
```

**Tipo 2: Hub Categoría**
```
Home > Ejercicios [ACTUAL]
```

**Tipo 3: Cluster Hub**
```
Home > Ejercicios > Iniciación 4-6 Años [ACTUAL]
```

**Tipo 4: Página de Soporte (About, Contacto)**
```
Home > Sobre Nosotros [ACTUAL]
```

### 5.2 Implementación Técnica

**Componente `<Breadcrumb>`:**
```astro
---
// src/components/Breadcrumb.astro
interface Props {
  breadcrumbs: Array<{ name: string; url?: string }>;
}

const { breadcrumbs } = Astro.props;
const structuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((item, idx) => ({
    "@type": "ListItem",
    "position": idx + 1,
    "name": item.name,
    "item": item.url ? `${import.meta.env.SITE_URL}${item.url}` : undefined,
  })),
};
---

<nav aria-label="breadcrumb">
  <ol>
    {breadcrumbs.map((item, idx) => (
      <li>
        {item.url ? <a href={item.url}>{item.name}</a> : <span>{item.name}</span>}
        {idx < breadcrumbs.length - 1 && <span> / </span>}
      </li>
    ))}
  </ol>
</nav>

<script type="application/ld+json" set:html={JSON.stringify(structuredData)} />
```

---

## 6. Schema Markup Global

### 6.1 Schemas Obligatorios por Página

#### Home (`/`)
- ✅ **WebSite** — raíz del sitio, metadata global
- ✅ **Organization** — brand identity
- ✅ **SearchAction** — búsqueda interna

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "MiniGol Club",
  "url": "https://futbolparaninos.club/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://futbolparaninos.club/buscar/?q={search_term_string}"
    }
  }
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MiniGol Club",
  "url": "https://futbolparaninos.club/",
  "logo": "https://futbolparaninos.club/logo.png",
  "description": "Fútbol infantil para padres: ejercicios, juegos y recursos prácticos por edad",
  "sameAs": [
    "https://www.instagram.com/minigolclub",
    "https://www.pinterest.com/minigolclub",
    "https://www.tiktok.com/@minigolclub"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "email": "contacto@futbolparaninos.club"
  }
}
```

#### Artículo (`/articulos/{categoria}/{slug}/`)
- ✅ **Article** / **BlogPosting** — contenido principal
- ✅ **BreadcrumbList** — navegación
- ✅ **FAQPage** — si hay sección FAQ (opcional)
- ✅ **HowTo** — si artículo es guía paso-a-paso (ejercicios)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Conducción de Balón: Ejercicios para 4 Años",
  "description": "5 ejercicios de conducción de balón adaptados para niños de 4 años sin materiales. Practica en casa o parque en 10 minutos.",
  "image": "https://futbolparaninos.club/og/conduccion-balon-4-anos.png",
  "datePublished": "2026-05-01T09:00:00Z",
  "dateModified": "2026-05-15T14:30:00Z",
  "author": {
    "@type": "Person",
    "name": "Javier Tibamoza",
    "url": "https://futbolparaninos.club/autores/javier-tibamoza/"
  },
  "publisher": {
    "@type": "Organization",
    "name": "MiniGol Club",
    "logo": "https://futbolparaninos.club/logo.png"
  },
  "mainEntity": {
    "@type": "HowTo",
    "name": "Conducción de Balón para Niños de 4 Años",
    "description": "Guía paso-a-paso de 5 ejercicios progresivos",
    "steps": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Ejercicio 1: Toque Libre (Calentamiento)",
        "text": "Dale el balón a tu peque y déjale tocar libremente 2 minutos..."
      }
      // ... más pasos
    ]
  }
}
```

**Nota:** Si el artículo es listado (p. ej., "10 Ejercicios"), usar `Article` con múltiples `HowToStep` o `itemListElement`.

#### Hub de Categoría (`/articulos/{categoria}/`)
- ✅ **CollectionPage** — contenedor
- ✅ **BreadcrumbList**

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Ejercicios de Fútbol Infantil por Edad",
  "description": "Guías de ejercicios de fútbol infantil por edad...",
  "url": "https://futbolparaninos.club/articulos/ejercicios/",
  "mainEntity": {
    "@type": "ItemList",
    "name": "Ejercicios por Edad",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Iniciación 4-6 Años",
        "url": "https://futbolparaninos.club/articulos/ejercicios/iniciacion-4-6-anos/"
      }
      // ... más items
    ]
  }
}
```

#### Página Autor (`/autores/{slug}/`)
- ✅ **Person** — autor profile
- ✅ **WebPage** — contexto

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Javier Tibamoza",
  "jobTitle": "Especialista en Fútbol Infantil",
  "description": "Educador deportivo especializado en fútbol para padres sin experiencia...",
  "url": "https://futbolparaninos.club/autores/javier-tibamoza/",
  "image": "https://futbolparaninos.club/avatares/javier-tibamoza.jpg",
  "sameAs": [
    "https://twitter.com/jtibamoza",
    "https://linkedin.com/in/javier-tibamoza"
  ]
}
```

#### Página Soporte (Sobre, Privacidad, Contacto)
- ✅ **WebPage** — estándar
- ✅ **BreadcrumbList**
- ✅ **LocalBusiness** (si hay ubicación física, futuro)

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Sobre MiniGol Club",
  "description": "Quiénes somos, qué hacemos, por qué...",
  "url": "https://futbolparaninos.club/sobre-nosotros/",
  "isPartOf": {
    "@type": "WebSite",
    "name": "MiniGol Club",
    "url": "https://futbolparaninos.club/"
  }
}
```

### 6.2 Cuándo Usar HowTo vs Article

| Tipo | Usar HowTo | Usar Article | Notas |
|------|-----------|--------------|-------|
| **Ejercicios paso-a-paso** | ✅ | (puede llevar ambos) | HowTo como `mainEntity` |
| **Juegos con instrucciones** | ✅ | ✅ | Primario: HowTo |
| **Artículo informativo puro** | ❌ | ✅ | Sin pasos secuenciales |
| **Reseña de producto** | ❌ | ✅ | Usar `Product` si hay reseña |
| **Guía sin pasos numéricos** | ❌ | ✅ | P. ej., "Beneficios del Fútbol" |

### 6.3 Validación Schema

- Usar [Schema.org Validator](https://validator.schema.org/) antes de publicar
- Testing con Lighthouse (auditoría SEO)
- Evitar warnings sobre `missing recommended property`

---

## 7. Sitemap y Robots.txt

### 7.1 Sitemap Particionado

**Estructura esperada (Astro @astrojs/sitemap):**

```xml
<!-- /sitemap-index.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://futbolparaninos.club/sitemap-articulos.xml</loc>
    <lastmod>2026-05-20</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://futbolparaninos.club/sitemap-paginas.xml</loc>
    <lastmod>2026-05-20</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://futbolparaninos.club/sitemap-recursos.xml</loc>
    <lastmod>2026-05-20</lastmod>
  </sitemap>
</sitemapindex>
```

**Contenido:**
- **sitemap-articulos.xml** — `/articulos/**` (priority 0.8, changefreq: weekly)
- **sitemap-paginas.xml** — Home, Sobre, Contacto, etc. (priority 0.7, changefreq: monthly)
- **sitemap-recursos.xml** — `/recursos/**` (priority 0.6, changefreq: never)

### 7.2 Robots.txt

```
User-agent: *
Allow: /
Disallow: /buscar/
Disallow: /articulos/*?page=
Disallow: /articulos/*?edad=
Disallow: /admin/
Disallow: /*.json$

Sitemap: https://futbolparaninos.club/sitemap-index.xml
```

**Excepciones:**
- **Noindex pero allow crawl:** Paginación, filtros (deja que Googlebot explore pero no indexe)

### 7.3 Meta Robots (en Head)

```html
<!-- Artículo normal -->
<meta name="robots" content="index, follow">

<!-- Página 2+ de listado -->
<meta name="robots" content="noindex, follow">

<!-- Filtro dinámico -->
<meta name="robots" content="noindex, follow">

<!-- 404 (automático en Astro) -->
<meta name="robots" content="noindex, nofollow">
```

---

## 8. Estrategia Anti-Canibalización

### 8.1 Reglas Claras por Pilar

**Pilar 1 — Ejercicios:**
- ✅ **Una URL por edad + técnica.** Ej. `/conduccion-balon-4-anos/` es única para edad 4.
- ❌ NO crear `/ejercicios-ninos-4-anos/` + `/ejercicios-4-anos-futbol/` (duplicadas, ambiguas)
- **Diferenciación:** Por edad (4, 5, 6, 7... explícito) + técnica específica (conducción, pase, tiro)

**Pilar 3 — Equipamiento:**
- ✅ **Una URL por producto tipo + edad.** Ej. `/balon-talla-3-4-6-anos/` agrupa edad; `/botas-talla-30/` muy específico.
- ❌ NO `/mejor-balon-niños/` + `/balon-recomendado-infantil/` (mismo tema, diferente ángulo confunde Google)
- **Diferenciación:** Por tipo producto (balón, botas, conos) + especificación técnica (talla, edad)

**Pilar 4 — Iniciación:**
- ✅ **Una URL por "pregunta padre."** Ej. `/cómo-enseñar-sin-saber/`, `/miedo-inseguridad/`, `/primera-escuela/`
- ❌ NO `/padre-sin-experiencia/` + `/padre-inexperto-futbol/` (sinonimia mata ranking)
- **Diferenciación:** Por contexto psicológico/emocional (miedo, inseguridad, inexperiencia) NO por variación léxica

### 8.2 Canonical y Redirects

**Canonical interno (mismo contenido, URLs similares):**
- Usar canonical explícito si content es 99% idéntico
- Ejemplo: `/articulos/juegos/para-2-niños/` duplica `/juegos-2-ninos/` → canonical a la más corta

**Redirects 301 (URL vieja → nueva):**
- Si republicas artículo con título nuevo, redirect 301 de slug viejo
- Mantener 6 meses mínimo antes de remover

**Caso especial — Hreflang (para futuro multiidioma):**
```html
<!-- Spanish Spain (preferido) -->
<link rel="alternate" hreflang="es-ES" href="https://futbolparaninos.club/articulos/ejercicios/..." />

<!-- Future: Spanish Mexico -->
<link rel="alternate" hreflang="es-MX" href="https://mx.futbolparaninos.club/articulos/ejercicios/..." />

<!-- Default -->
<link rel="alternate" hreflang="x-default" href="https://futbolparaninos.club/articulos/ejercicios/..." />
```
(Implementar en Sprint 3 si aplica expansión LatAm)

---

## 9. Páginas de Soporte y E-E-A-T

### 9.1 Impacto SEO de Páginas de Soporte

| Página | Rol SEO | Tratamiento | Notas |
|--------|---------|-----------|-------|
| **Sobre Nosotros** | Crítico (E-E-A-T) | Index, featured | Foto autor, bio, credenciales, tono personal |
| **Autor Perfil** | Crítico (Person schema) | Index, featured | Cada autor: bio, foto, especialidad, RRSS |
| **Privacidad** | Legal, no SEO | Index (sí) | Requiere RGPD, AdSense, Google Analytics |
| **Cookies** | Legal, no SEO | Index (sí) | Consent Mode v2 implementado |
| **Aviso Legal** | Legal, no SEO | Index (sí) | Nombre titular, contacto, disclaimer afiliados |
| **Contacto** | Lead gen | Index | Formulario simple, no CAPTCHA complejo |
| **Búsqueda** | UX, no tráfico SEO | Noindex, follow | Internal search, dinámico, herramienta |

### 9.2 Estructura Autor — E-E-A-T Crítico

**URL:** `/autores/{slug}/`

**Campos obligatorios:**
- Nombre
- Foto profesional (200×200px min)
- Bio (200-300 palabras) indicando:
  - Experiencia en fútbol/educación infantil
  - Por qué escribe para MiniGol Club
  - Credenciales (cursos, certificaciones, si aplica)
  - Redes sociales (Twitter, LinkedIn)
  - Email para contacto (opcional)

**Schema Person:**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Javier Tibamoza",
  "jobTitle": "Especialista en Fútbol Infantil y Educación Deportiva",
  "image": "https://futbolparaninos.club/avatares/javier.jpg",
  "email": "javier@futbolparaninos.club",
  "url": "https://futbolparaninos.club/autores/javier-tibamoza/",
  "sameAs": ["https://twitter.com/jtibamoza", "https://linkedin.com/in/javier-tibamoza"],
  "description": "Educador con 15+ años en desarrollo de contenido deportivo infantil..."
}
```

**Página autor debe tener:**
- ✅ Lista de artículos propios
- ✅ Bio + credenciales claras
- ✅ Foto de perfil profesional
- ✅ Links a RRSS verificados

---

## 10. Roadmap Implementación Técnica SEO

### 10.1 Sprint 1 (Semanas 1-4) — Cimientos

| Tarea | Responsable | Fecha | Status |
|------|-------------|-------|--------|
| [ ] Setup Astro + @astrojs/sitemap | Dev | W1 | — |
| [ ] Crear componente `<Breadcrumb>` | Dev | W1 | — |
| [ ] Schema Organization + WebSite global | Dev | W2 | — |
| [ ] Robots.txt + sitemap-index base | Dev | W2 | — |
| [ ] Plantilla ArticleLayout con Article schema | Dev | W2 | — |
| [ ] Validar breadcrumbs + schema en 3 artículos test | QA | W3 | — |
| [ ] Lighthouse CI pipeline (SEO gate 100) | Dev | W3 | — |
| [ ] Google Search Console setup | Growth | W4 | — |
| [ ] Enviar sitemap-index a GSC | Growth | W4 | — |

### 10.2 Sprint 2 (Semanas 5-8) — Contenido + Linking

| Tarea | Responsable | Fecha | Status |
|------|-------------|-------|--------|
| [ ] Publicar primeros 10 artículos con internal links completos | Content | W5-6 | — |
| [ ] Mapear internal links matriz (hubs → spokes) | SEO | W6 | — |
| [ ] Auditar duplicate content / canibalización | SEO | W7 | — |
| [ ] Implementar `<RelatedArticles>` dinámico | Dev | W7 | — |
| [ ] Validar breadcrumb en todos los artículos | QA | W8 | — |
| [ ] Verificar en Search Console: URLs indexadas, cobertura | Growth | W8 | — |

### 10.3 Sprint 3 (Semanas 9-12) — Optimizaciones

| Tarea | Responsable | Fecha | Status |
|------|-------------|-------|--------|
| [ ] Crear hubs de cluster secundario | Content | W9 | — |
| [ ] Ajustar densidad ad slots (Lighthouse CLS) | Dev | W10 | — |
| [ ] FAQPage schema en 5 artículos top (featured snippet targets) | Dev | W10 | — |
| [ ] Validar todas las OG images generadas | QA | W11 | — |
| [ ] Análisis GSC: impresiones, CTR por keyword | Growth | W11 | — |
| [ ] Plan links externos / guest posts (estrategia linkbuilding) | Growth | W12 | — |

---

## 11. Decisiones que Requieren Confirmación

### 11.1 Conflicto: Categorías vs Silos por Edad

**En `Arquitectura.md` §6:**
```typescript
categoria: reference('categorias'),  // obligatorio
edadMin: z.number(),                  // filtro UX
edadMax: z.number(),
```

**Pregunta:** ¿Necesitamos URLs de "**edad**" como silo primario?

**Opción A (PROPUESTA ACTUAL):**
- Silos = **6 pilares temáticos** (ejercicios, juegos, equipamiento, etc.)
- Edad = **atributo en frontmatter** (filtro UI, NO URL)
- **Ventaja:** Claridad máxima, sin fragmentación
- **Desventaja:** Padre buscando "fútbol 7 años" entra por `/articulos/ejercicios/` general, no hub edad

**Opción B (Alternativa):**
- Crear silos **secundarios por edad:** `/edades/7-9-anos/` (listado dinámico artículos de edad)
- **Ventaja:** Padre busca "fútbol 7 años" → URL de edad directa
- **Desventaja:** Canibalización con clusters temáticos; índice inflado; menos autoridad por URL

**RECOMENDACIÓN:** Mantener **Opción A** (actual). Edad es atributo de filtro, no silo primario. Spokes ya están segmentados por edad en slug (ej. `/conduccion-balon-7-anos/`).

### 11.2 Conflicto: Tipos de Schema para Artículos

**En `Arquitectura.md` §8:**
> JSON-LD por tipo: ... Artículo: `Article` + `BreadcrumbList` + `Person` (autor)

**Pregunta:** ¿Usar `Article`, `BlogPosting`, o `NewsArticle`?

**Recomendación:**
- **Article** = genérico, mejor para guías educativas (nuestro caso)
- **BlogPosting** = menos formal, mejor si tono conversacional domina
- **NewsArticle** = para contenido de actualidad (Mundial, LaLiga) solamente

**DECISIÓN:** Usar **`Article`** para 95% contenido. **`NewsArticle`** solo para Pilar 6 (Eventos estacionales, dentro de 2 meses de publicación).

### 11.3 Conflicto: Facetado dinámico vs URL estática

**Problema:** `/articulos/ejercicios/?edad=7-9` es dinámico, Google la penaliza (parámetro URL).

**Opciones:**
- **A)** Noindex parámetros dinámicos, mantener URLs limpias (actual)
- **B)** Crear URLs estáticas `/ejercicios/edad-7-9-anos/` = listado filtrado
- **C)** Hybrid: URL estática pero sin crear URL nueva (redirigir a cluster hub)

**DECISIÓN:** **Opción A** (Noindex dinámico). Razón: Clusters temáticos (`/ejercicios/intermedio-7-9-anos/`) ya son hubs age-segmented. No duplicar creando `/edad-7-9/`.

---

## 12. Checklist Pre-Publicación (Cada Artículo)

Antes de publicar un artículo, validar:

- [ ] **Slug válido:** Kebab-case, contiene keyword principal, <60 caracteres
- [ ] **H1 único:** Coincide con title, contiene keyword exacta
- [ ] **H2/H3 hierarchy:** Sin saltos (H1 → H2, nunca H1 → H3)
- [ ] **Meta description:** 120-160 caracteres, keyword secunda implícita
- [ ] **Imagen cover:** 1200×750 min, WebP, alt descriptivo
- [ ] **Internal links:** Mínimo 3, máximo 7, anchor text variado
- [ ] **Related articles:** Componente `<RelatedArticles>` renderiza 3-5
- [ ] **Breadcrumb:** JSON-LD + visual, sin enlace en current page
- [ ] **Schema:** Article + HowTo (si aplica), validado en Schema.org
- [ ] **Age tags:** `edadMin`/`edadMax` rellenados
- [ ] **Categoría:** Asignada a uno de 6 pilares
- [ ] **Keyword:** Rellenado en frontmatter
- [ ] **Lighthouse:** Performance ≥90, Accessibility ≥95, SEO = 100
- [ ] **Mobile preview:** Texto legible, imágenes responsivas, sin CLS
- [ ] **Canibalización check:** ¿Existe URL similar? Si sí, enlazar hub o redirect 301

---

## 13. Monitoreo y KPIs SEO (Trimestral)

**Dashboard recomendado:**
- Google Search Console (impresiones, CTR, posición promedio por keyword)
- Ahrefs Webmaster Tools free (backlinks, DA, referral traffic)
- Lighthouse CI (degradación Core Web Vitals)
- GA4 (páginas vistas, sesión duración, bounce rate por pilar)

**Objetivos Año 1:**

| Hito | Mes | KPI |
|------|-----|-----|
| **M3** | Junio | 5-10 keywords P0 en ranking <20 |
| **M6** | Sept | 20-30 keywords en ranking <10 |
| **M9** | Dic | 50+ keywords posición 1-3 |
| **M12** | Marzo 2027 | 100+ keywords ranking, 15k sesiones/mes |

---

## Próxima Revisión

**Trimestral:** 2026-07-25

**Ajustes esperados:**
- Añadir nuevos clusters según volumen real de tráfico
- Validar canibalización detectada en GSC
- Actualizar target URLs en función de featured snippets ganadas
- Expandir si tráfico > 20k/mes (Pilar 2 y 3 ganando mucho volumen)

---

**Documento preparado:** 2026-04-25  
**Validación Lighthouse:** Pendiente (post Sprint 1)  
**Aprobación:** Requerida antes de publicar artículo #1
