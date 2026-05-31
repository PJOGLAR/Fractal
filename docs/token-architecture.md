# Arquitectura de Tokens — Fractal Design System

## Estructura de 3 niveles

```
Primitivo → Semántico → Componente
```

| Nivel | Ejemplo | Responde a |
|---|---|---|
| Primitivo | `core/purple/500` | ¿Qué valor tiene? |
| Semántico | `interactive/background/brand/main/medium` | ¿Para qué se usa? |
| Componente | `button-card/background/default` | ¿Dónde se aplica? |

---

## 1. Tokens Primitivos

Son los valores crudos. No se aplican directamente a componentes.

### Colecciones primitivas:
- **Global color** — Paleta completa (purple, cyan, neutral, red, orange, green, blue, pink + expresivos)
- **Global dimension** — Spacing, corner radius, widths, asset sizes
- **Global typography** — Font families, sizes, weights, line-heights

### Nomenclatura:
```
core/[color]/[escala]          → core/purple/500, core/neutral/950
spacing/[valor]                → spacing/200, spacing/600
corner/[valor]                 → corner/150, corner/400
font/size/[valor]              → font/size/350, font/size/400
font/weight/[nombre]           → font/weight/semibold, font/weight/bold
```

---

## 2. Tokens Semánticos

Definen el **propósito** del valor. Referencian a un primitivo via alias.

### Estructura:
```
[contexto]/[elemento]/[familia]/[sub-familia?]/[variante?]/[escala]
```

Cada slot es opcional según el caso:

| Slot | Cuándo aparece |
|---|---|
| `[contexto]` | Siempre (`static`, `interactive`, `expressive`) |
| `[elemento]` | Siempre (`background`, `foreground`, `border`, `opacity`) |
| `[familia]` | Siempre (`neutral`, `brand`, `feedback`, `expressive`) |
| `[sub-familia]` | Solo cuando la familia se subdivide (`brand/primary`, `feedback/error`) |
| `[variante]` | Solo en `interactive` (estado: `hover`, `pressed`, etc.) |
| `[escala]` | Casi siempre (`bold`, `medium`, `subtle`, `quiet`) |

### Asimetría intencional entre contextos

Cada contexto usa los slots que tienen sentido para su uso, no más:

| Contexto | Slot de variante | Por qué |
|---|---|---|
| `static` | — (sin variante) | Los static no responden a interacción. La prominencia se expresa solo con la escala (`bold/medium/subtle/quiet`) |
| `interactive` | Estado (`default`, `hover`, `pressed`, `focus`, `active`, `disabled`, `selected`) | El componente reacciona al usuario y necesita expresar estado |
| `expressive` | — (sin variante) | Solo decorativo, no comunica jerarquía ni interacción |

> **No forzamos un mismo vocabulario en todos los contextos.** Lo que funciona en interactive (estado) no aplica en static. La asimetría es diseño intencional: cada contexto usa lo que necesita.

### Familias y sub-familias

| Familia | Sub-familia | Ejemplo |
|---|---|---|
| `brand` | `primary` / `secondary` | `brand/primary` |
| `feedback` | `info` / `success` / `warning` / `error` | `feedback/error` |
| `neutral` | — (es cross) | `neutral` |
| `expressive` | `purple` / `sapphire` / `magenta` / etc. | `expressive/sapphire` |

**Ejemplos:**
```
static/foreground/neutral/medium                ← contexto/elem/familia/escala
static/foreground/brand/primary/medium          ← contexto/elem/familia/sub-fam/escala
static/background/feedback/error/bold           ← contexto/elem/familia/sub-fam/escala
interactive/background/brand/primary/hover/medium ← contexto/elem/familia/sub-fam/variante/escala
```

---

### Contextos

#### ◆ Static tokens

**¿Qué es un static token?**
Un static token representa un color **estable**, que **no cambia** cuando el usuario interactúa.
Su función es comunicar **estructura, jerarquía o información**, no acción.

**Cuándo usar static tokens:**
- Cuando el elemento **no es interactivo** (no tiene estados)
- Cuando el color **no cambia** en hover / focus / pressed
- Cuando el elemento **informa o estructura**, pero no responde
- Cuando el componente **no recibe foco**

#### ◆ Interactive tokens

**¿Qué es un interactive token?**
Un interactive token representa un color que **responde a la interacción del usuario**.
Su función es comunicar **estado, acción o disponibilidad**.

**Cuándo usar interactive tokens:**
- Cuando el usuario **puede interactuar** (tiene estados)
- Cuando hay estados: hover, focus, pressed, disabled
- Cuando el elemento **recibe foco**
- Cuando el color indica **acción o feedback inmediato**

#### ◆ Expressive tokens

**¿Qué es un expressive token?**
Un expressive token representa colores **decorativos o ilustrativos** que no comunican estado ni jerarquía funcional.
Su función es aportar **personalidad visual, identidad de marca o diferenciación**.

**Cuándo usar expressive tokens:**
- Elementos decorativos en cards, banners o secciones destacadas
- Ilustraciones e iconografía expresiva
- Fondos de categorías o secciones temáticas
- Elementos que aportan identidad visual sin función interactiva

**Nomenclatura:**
```
expressive/[paleta]/[intensidad]
expressive/illustration/[paleta]/[intensidad]
```

**Ejemplos:**
```
expressive/amber/medium              → color decorativo amber
expressive/lavender/subtle           → color decorativo lavender suave
expressive/illustration/purple/medium → ilustración en purple
expressive/illustration/sapphire/bold → ilustración en sapphire intenso
```

---

### Regla simple para decidir rápido

> **Si el usuario puede interactuar con el elemento → usa un interactive token.**
> **Si no puede interactuar → usa un static token.**
> **Si es decorativo o ilustrativo → usa un expressive token.**

### Tabla de usos

| Caso | Visualmente | Token correcto |
|---|---|---|
| Texto informativo | Texto plano | Static |
| Icono decorativo | No responde | Static |
| Ilustración en card | Decorativo | Expressive |
| Fondo de categoría | Decorativo | Expressive |
| Button | Cambia al interactuar | Interactive |
| Link | Hover / focus | Interactive |
| Alert informativa | No accionable | Static |
| Toggle | Cambia estado | Interactive |

---

### Elementos:
- **background** — Fondos de contenedores, cards, botones
- **foreground** — Color de texto e iconos
- **border** — Color de bordes
- **opacity** — Capas de opacidad para estados (evita proliferación de variantes)

### Familias:
- **brand** — Familia compuesta. Se subdivide en `brand/main` (purple, marca principal) y `brand/accent` (cyan, marca madre/secundaria)
- **neutral** — Familia simple, sin sub-familia. Cross a todo el sistema (grises y neutros)
- **feedback** — Familia compuesta. Se subdivide en `info`, `success`, `warning`, `error`
- **expressive** — Familia compuesta para decorativos. Se subdivide por paleta (`purple`, `sapphire`, `magenta`, etc.)

### Intensidades

Las intensidades son **contextuales** — describen la prominencia visual dentro de su contexto, no un valor absoluto en la escala cromática.

| Intensidad | Significado | Ejemplo |
|---|---|---|
| `bold` | El más prominente/intenso del contexto | Fondo destacado, texto principal |
| `medium` | El valor principal del contexto | El "default" de ese uso |
| `subtle` | Versión suave/secundaria | Fondos tenues, bordes suaves |
| `quiet` | Apenas visible | Fondos casi transparentes |

**Importante:** `medium` en foreground puede ser 950 (oscuro) y en background puede ser 25 (claro). Ambos son "el valor principal" de su contexto. Esto es correcto y necesario para tematización (dark mode).

**Regla de orden:** Dentro del mismo grupo, siempre se cumple:
```
bold > medium > subtle > quiet (en prominencia visual)
```

---

### Ejemplos de aplicación

#### Texto en un input:
```
Label y supporting text son estáticos porque no cambian con la interacción.
El fondo del input es interactivo porque tiene hover/focus/disabled.
```
```
Label         → static/foreground/neutral/primary/medium
Placeholder   → static/foreground/neutral/tertiary/medium
Supporting    → static/foreground/neutral/secondary/medium
Input fondo   → interactive/background/neutral/default/medium
Input borde   → interactive/border/neutral/default/medium
Input focus   → interactive/border/brand/main/focus/medium
```

#### Accordion con estados:
```
Title es estático porque no cambia de color.
El fondo del row es interactivo porque tiene hover/pressed.
Se aplica un overlay con el token de opacidad para el estado.
```
```
Title         → static/foreground/neutral/primary/medium
Fondo default → (sin color / transparente)
Fondo hover   → interactive/opacity/brand/hover
Fondo pressed → interactive/opacity/brand/pressed
Borde         → static/border/neutral/primary/subtle
```

#### Card con elementos expresivos:
```
El fondo decorativo de la card usa expressive.
Los textos usan static. Los botones usan interactive.
```
```
Fondo decorativo → expressive/illustration/sapphire/subtle
Título           → static/foreground/neutral/primary/medium
Descripción      → static/foreground/neutral/secondary/medium
Botón fondo      → interactive/background/brand/main/medium
Botón hover      → interactive/background/brand/main/hover
```

---

### Otras colecciones semánticas:
```
# Spacing
padding/padding-[valor]     → spacing/[valor]
gap/gap-[valor]             → spacing/[valor]

# Border
border/corner/corner-[valor] → corner/[valor]
border/width/[nombre]        → width/[valor]

# Typography
body/sm/semibold/font-size       → font/size/350
caption/md/medium/font-family    → font/family/body
heading/lg/bold/font-weight      → font/weight/bold

# Asset
icon/md                     → asset/100
pictogram/lg                → asset/200
```

---

## 3. Tokens de Componente

Específicos de cada componente. Referencian a un semántico via alias.

### Componentes públicos vs building blocks

El sistema distingue dos tipos de componentes:

| Tipo | Convención de nombre | Disponibilidad | Ejemplo |
|---|---|---|---|
| **Componente público** | Nombre limpio (Button, Card, Pill) | Disponible en la librería para todos los equipos | `Button`, `Card`, `Pill` |
| **Building block** | Prefijo `⛔️` o `.⛔️` + nombre del componente padre + `_` + parte | Privado del componente que lo usa, **no se disponibiliza** en la librería | `.⛔️ Card_header`, `⛔️ Button-toggle` |

#### Convenciones de nomenclatura para building blocks

```
.⛔️ [Componente-padre]_[parte]
.⛔️ [Componente-padre]_[parte]_[sub-parte]
⛔️ [Componente-padre]_[parte]
```

**Ejemplos:**
- `.⛔️ Card_header` — el header dentro del componente Card
- `.⛔️ Card_content_banner-mini` — un mini banner dentro del content del Card
- `.⛔️ Row-item_leading-content_item` — sub-elemento del leading content de un Row-item
- `⛔️ Button-toggle` — building block que usa el componente Button
- `.⛔️ Tabs_option` — la opción individual dentro del componente Tabs

#### Por qué tienen el prefijo

- Indican que **no son consumibles directamente** por equipos externos.
- Solo existen para **componer** otros componentes públicos.
- Empiezan con `.` para que aparezcan al principio del listado en Figma.
- El `⛔️` es un signo visual claro de "no usar suelto".

#### Building blocks NO se incluyen en

- Listados de componentes públicos del DS.
- Análisis de patrones de variación (un building block no es un componente, es una pieza).
- Tokens de componente en colecciones de generador (heredan los tokens del padre).

#### Cómo cuenta el sistema

Cuando se reportan métricas como "componentes con prop X":
- Se cuentan **solo componentes públicos**.
- Si un building block aparece en el conteo, su prop generalmente proviene del componente padre que lo usa.

---

### Estructura de la colección:
```
[componente]/
├── background/
│   ├── default
│   ├── hover
│   ├── pressed
│   └── ...
├── foreground/
│   ├── typography/
│   │   └── [rol]/          ← nombre del layer (title, description, label)
│   │       ├── font-size
│   │       ├── font-weight
│   │       ├── font-family
│   │       ├── line-height
│   │       ├── letter-spacing
│   │       └── color
│   └── asset/
│       └── icon/
│           ├── color
│           └── size
├── spacing/
│   ├── padding (o padding/[valores] si hay múltiples)
│   └── gap
└── border/
    ├── corner (o corner/[valores] si hay múltiples)
    ├── width
    └── color/
        ├── default
        ├── hover
        └── ...
```

### Reglas de nomenclatura:
1. **Nombre de colección** = nombre del componente
2. **Sin subcarpeta** cuando hay 1 solo valor del tipo
3. **Con subcarpeta** cuando hay 2+ valores del tipo
4. **Tipografía** usa el nombre del layer como rol (title, description, label)
5. **Tipografía por tamaño** usa sm/md/lg cuando el mismo rol tiene variantes de tamaño
6. **No incluye** tokens de instancias anidadas (building blocks)
7. **No repite** tokens con el mismo valor (4 paddings iguales = 1 token)
8. **Orden de carpetas:** background → foreground → border → spacing → asset

---

## Modos de color (tematización)

> **Estrategia confirmada:** los modes (Light / Dark / etc.) viven en la **capa semántica**, no en primitivos. Esta sección documenta la decisión y el razonamiento para cuando se implemente dark mode más adelante.

### Principio

```
Primitivos     → sin modes (valores fijos)
Semánticos     → CON modes (Light, Dark, ...)
Componentes    → sin modes (alias al semántico)
```

Cuando un frame cambia de mode, **el alias del semántico cambia** y apunta a otro primitivo. El valor del primitivo en sí no cambia.

### Cómo se resuelve un token

```
Frame en Light:
  button-card/foreground/medium
    → static/foreground/brand/primary/medium
      → (Light) core/purple/500 = #5A50F9

Frame en Dark:
  button-card/foreground/medium
    → static/foreground/brand/primary/medium
      → (Dark) core/purple/300 = #A5B4FC   ← apunta a otro primitivo
```

El componente no sabe del mode. El semántico sí. El primitivo no cambia su valor.

### Por qué los modes están en semánticos y no en primitivos

#### Razón 1 — Flexibilidad por uso

Cada uso del sistema puede decidir su propio dark sin afectar a otros usos.

```
Light:
  static/foreground/brand/primary/medium  → core/purple/500
  static/background/brand/primary/medium  → core/purple/500

Dark:
  static/foreground/brand/primary/medium  → core/purple/300  (más claro para contraste)
  static/background/brand/primary/medium  → core/purple/700  (más saturado para destacar)
```

Si los modes vivieran en primitivos, no se podría hacer esto sin duplicar primitivos.

#### Razón 2 — Acceder a paletas distintas en dark

Si un primitivo no sirve para dark, el semántico simplemente apunta a otro primitivo (de la misma paleta o de otra). No hay que crear primitivos nuevos ni alterar los existentes.

```
static/foreground/feedback/error/medium
  Light → core/red/700
  Dark  → core/red/400   ← más claro porque sobre fondo oscuro red/700 no contrasta
```

#### Razón 3 — Coincide con cómo se piensa la tematización

Cuando se diseña dark mode, las decisiones se toman a nivel de **uso** ("el foreground brand en dark se ve así"), no a nivel de **valor crudo** ("el purple cambia"). Que los modes vivan donde está el uso refleja mejor esa lógica.

#### Razón 4 — Es lo que hace la industria

Material 3, IBM Carbon y Shopify Polaris ponen los modes en semánticos. La práctica está validada.

### Cómo se ven los semánticos con modes

```
Collection: Semantic color
├── Mode: Light
├── Mode: Dark
│
├── static/foreground/neutral/default/medium
│   ├── Light → core/neutral/700
│   └── Dark  → core/neutral/300
│
├── static/foreground/neutral/inverse/medium
│   ├── Light → core/neutral/25
│   └── Dark  → core/neutral/950
│
├── static/foreground/brand/primary/medium
│   ├── Light → core/purple/500
│   └── Dark  → core/purple/300
```

Los primitivos (`core/...`) se mantienen con sus valores fijos. Solo los alias cambian según el mode.

### Costos de esta estrategia

Esta flexibilidad tiene su costo:

| Costo | Mitigación |
|---|---|
| Cada semántico declara su valor en cada mode (más configuración inicial) | Configuración una sola vez, después es estable |
| Pierde propagación automática (un cambio global toca varios semánticos) | Documentar las relaciones entre semánticos similares |
| Riesgo de inconsistencia entre semánticos parecidos | Tabla de rangos por (elemento × familia) ayuda a mantener coherencia |

### Aplicable a otros modes

El mismo principio sirve para cualquier mode futuro:
- High contrast
- Print
- Marca alterna (white-label)
- Modo accesibilidad

Cada mode nuevo se configura en la colección de semánticos. Primitivos y componentes no cambian.

### Cuándo se va a implementar

**Fuera del scope del rename actual.** Se planificará por separado cuando se decida activar dark mode. La capa semántica reorganizada queda preparada para soportarlo.

---

## Flujo de cambio sin release

### Cambio global de marca
```
Editás: core/purple/500 → nuevo valor
Resultado: se propaga a todos los semánticos y componentes automáticamente
```

### Cambio de decisión de diseño
```
Editás: interactive/background/brand/main/hover → ahora apunta a core/purple/800
Resultado: todos los componentes que usan ese semántico cambian
```

### Cambio específico de un componente
```
Editás: button-card/background/hover → ahora apunta a otro semántico
Resultado: solo Button-card cambia, el resto queda igual
```

---

## Herramientas

### Plugin-tokens (extractor)
- Extrae todos los tokens aplicados en el documento
- Genera JSON para el dashboard de salud

### Token Component Generator
- Escanea un componente seleccionado
- Genera la colección de tokens específicos como alias de los semánticos
- Vincula los tokens generados al componente

### Dashboard (Vercel)
- Visualiza la salud del DS
- Muestra cobertura, tokens huérfanos, impacto de cambios
- Filtros por categoría, colección y tipo

---

## Criterios de salud

| Métrica | Bueno | Atención | Problema |
|---|---|---|---|
| Cobertura de tokens | >90% | 70-90% | <70% |
| Tokens huérfanos | <5% | 5-15% | >15% |
| Hardcoded values | 0 | <10 | >10 |
| Tokens sin uso | <10 | 10-30 | >30 |
