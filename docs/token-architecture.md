# Arquitectura de Tokens — Fractal Design System

## Estructura de 3 niveles

```
Primitivo → Semántico → Componente
```

| Nivel | Ejemplo | Responde a |
|---|---|---|
| Primitivo | `core/purple/500` | ¿Qué valor tiene? |
| Semántico | `interactive/background/brand/primary/default/medium` | ¿Para qué se usa? |
| Componente | `button/background/solid/default` | ¿Dónde se aplica? |

---

## 1. Tokens Primitivos

Son los valores crudos. No se aplican directamente a componentes.

### Colecciones primitivas:
- **Global color** — Paleta completa (purple, cyan, neutral, red, orange, green, blue + expresivos)
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

| Slot | Cuándo aparece |
|---|---|
| `[contexto]` | Siempre (`static`, `interactive`, `expressive`) |
| `[elemento]` | Siempre (`background`, `foreground`, `border`, `opacity`) |
| `[familia]` | Siempre (`neutral`, `brand`, `feedback`) |
| `[sub-familia]` | Solo cuando la familia se subdivide (`brand/primary`, `feedback/error`) |
| `[variante]` | Solo en `interactive` (estado: `default`, `hover`, `pressed`, `focus`, `active`, `disabled`, `selected`) |
| `[escala]` | Casi siempre (`strong`, `bold`, `medium`, `subtle`, `quiet`) |

---

### Contextos

#### ◆ Static
Color **estable** que **no cambia** con la interacción. Comunica estructura, jerarquía o información.

#### ◆ Interactive
Color que **responde a la interacción** del usuario. Comunica estado, acción o disponibilidad.

#### ◆ Expressive
Colores **decorativos o ilustrativos** que no comunican estado ni jerarquía funcional.

### Regla rápida

> **Si el usuario puede interactuar → interactive.**
> **Si no puede → static.**
> **Si es decorativo → expressive.**

---

### Asimetría intencional entre contextos

| Contexto | Slot de variante | Por qué |
|---|---|---|
| `static` | — (sin variante) | No responde a interacción. La prominencia se expresa solo con la escala |
| `interactive` | Estado (`default`, `hover`, `pressed`, `focus`, `active`, `disabled`, `selected`) | Reacciona al usuario |
| `expressive` | — (sin variante) | Solo decorativo |

---

### Familias y sub-familias

| Familia | Sub-familia | Ejemplo |
|---|---|---|
| `brand` | `primary` / `secondary` | `brand/primary` (purple), `brand/secondary` (cyan) |
| `feedback` | `info` / `success` / `warning` / `error` | `feedback/error` |
| `neutral` | — (es cross) | `neutral` |

---

### Escala de intensidades

Las intensidades describen **prominencia visual relativa al contexto**, no un valor absoluto.

| Intensidad | Rango primitivo | Aplica a | Cuándo usar |
|---|---|---|---|
| `strong` | 950 | Solo neutral | Máxima prominencia. Texto principal en foreground. |
| `bold` | 700-900 (neutral) / 700-950 (otros) | Todos | Muy prominente. Fondos de feedback, CTAs, borders fuertes. |
| `medium` | 500-600 | Todos | Valor principal del contexto (default). |
| `subtle` | 100-400 | Todos | Versión suave. Fondos tenues, bordes decorativos, texto secundario. |
| `quiet` | 25-50 | Todos | Apenas visible. Overlays, separadores, fondos casi transparentes. |

**Regla de orden:**
```
strong > bold > medium > subtle > quiet
```

**Las escalas son contextuales.** `medium` en foreground apunta a un primitivo oscuro (para que se lea sobre fondo claro) y `medium` en background apunta a un primitivo claro. El rol es el mismo en cada uno: "el valor principal del contexto".

---

### Ejemplos de tokens semánticos

```
static/foreground/neutral/strong                  ← texto principal (950)
static/foreground/neutral/bold                    ← texto enfatizado (700-900)
static/foreground/neutral/medium                  ← texto secundario (500-600)
static/foreground/neutral/subtle                  ← texto auxiliar (100-400)
static/foreground/neutral/quiet                   ← texto inverse / disabled (25-50)

static/foreground/brand/primary/medium            ← texto en marca primary
static/foreground/brand/primary/bold              ← texto marca enfatizado
static/foreground/feedback/info/bold              ← texto de feedback info
static/foreground/feedback/error/bold             ← texto de error

static/background/neutral/bold                    ← fondo prominente
static/background/neutral/quiet                   ← fondo principal (blanco/claro)
static/background/brand/primary/medium            ← fondo de marca
static/background/brand/primary/subtle            ← fondo suave de marca
static/background/feedback/error/bold             ← fondo de alerta error
static/background/feedback/error/subtle           ← fondo suave de error

interactive/background/brand/primary/default/medium  ← fondo botón primary
interactive/background/brand/primary/hover/bold      ← fondo botón hover
interactive/background/neutral/default/quiet         ← fondo componente neutral
interactive/foreground/neutral/default/bold          ← texto botón sobre fondo lleno
interactive/foreground/neutral/disabled/medium       ← texto disabled
interactive/border/brand/primary/focus/medium        ← borde focus
interactive/border/neutral/default/medium            ← borde default
```

---

### Otras colecciones semánticas

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

| Tipo | Convención | Disponibilidad |
|---|---|---|
| **Componente público** | Nombre limpio (`Button`, `Card`, `Pill`) | Disponible en la librería |
| **Building block** | Prefijo `⛔️` o `.⛔️` + nombre del padre + `_` + parte | Privado, no se disponibiliza |

Building blocks **no se incluyen** en tokens de componente ni en el generador. Heredan del padre.

---

### Estructura de tokens de componente

```
[componente]/
├── background/
│   └── [división principal] o directo si es cross
├── foreground/
│   ├── typography/
│   │   └── [rol o size]/
│   │       ├── font-size, font-family, font-weight, letter-spacing, line-height
│   │       └── color/ (si hay múltiples)
│   └── icon/
│       ├── color
│       └── size
├── border/
│   ├── corner
│   ├── width
│   └── color/
│       └── [estado o división]
└── spacing/
    ├── padding/ (si hay múltiples)
    └── gap
```

---

### Regla de carpetas y subcarpetas

> **Si hay UN solo valor → va directo en la carpeta padre (sin subcarpeta).**
> **Si hay MÁS DE UNO → se crean subcarpetas para diferenciar.**

```
UN solo corner:        comp/border/corner
MÚLTIPLES corners:     comp/border/corner/top-left
                       comp/border/corner/bottom-right

UN solo width:         comp/border/width
DOS distintos:         comp/border/width/primary
                       comp/border/width/emphasis

UN solo padding:       comp/spacing/padding
DOS distintos:         comp/spacing/padding/vertical
                       comp/spacing/padding/horizontal

UN solo gap:           comp/spacing/gap
MÚLTIPLES:             comp/spacing/gap/content
                       comp/spacing/gap/items
```

**Escalabilidad:** si mañana un componente pasa de 1 valor a 2, se renombra el existente agregando subcarpeta. Es un rename acotado y localizado.

---

### División principal (background y border color)

La **primera subdivisión** bajo `background/` y `border/color/` es la **prop que genera el cambio más estructural de color** en el componente:

| Prop principal | Valores | Ejemplo |
|---|---|---|
| Style | solid, ghost, outline, gradient, neutral, link | `pill/background/solid/info` |
| Selected | selected, unselected | `chip-filter/background/selected/default` |
| Type | info, success, warning, error, neutral | `alert/background/info/bold` |
| State (sin otra prop) | default, hover, pressed, focus, disabled | `avatar/background/hover` |

**Dentro de la división principal** se subdivide por estado o escala:

```
pill/background/solid/info           ← style + type
chip-filter/background/selected/hover ← selected + state
text-field/background/default        ← solo estado (cross)
```

---

### Typography: roles y colores

#### Cuando la tipografía es la misma en todas las variantes (cross)

Props de typografía van **directo** sin carpeta de rol:

```
badge/foreground/typography/font-family
badge/foreground/typography/font-size
badge/foreground/typography/font-weight
badge/foreground/typography/letter-spacing
badge/foreground/typography/line-height
badge/foreground/typography/color         ← un solo color, directo
```

#### Cuando hay roles distintos (label, placeholder, supporting-text)

Carpeta por rol. El color va **dentro** del rol:

```
text-field/foreground/typography/label/font-family
text-field/foreground/typography/label/font-size
text-field/foreground/typography/label/color/default
text-field/foreground/typography/label/color/disabled
text-field/foreground/typography/placeholder/font-family
text-field/foreground/typography/placeholder/color/default
text-field/foreground/typography/placeholder/color/disabled
text-field/foreground/typography/supporting-text/color/default
text-field/foreground/typography/supporting-text/color/error
```

#### Cuando varía por tamaño (sm, md, lg)

Carpeta por size:

```
chip-filter/foreground/typography/sm/font-family
chip-filter/foreground/typography/sm/font-size
chip-filter/foreground/typography/md/font-family
chip-filter/foreground/typography/md/font-size
chip-filter/foreground/typography/lg/font-family
chip-filter/foreground/typography/lg/font-size
chip-filter/foreground/typography/color/selected    ← color cross al size, separado
chip-filter/foreground/typography/color/unselected
```

---

### Naming de estados en tokens de componente

Los tokens de componente usan **nombres de estado** (`default`, `hover`, `pressed`, `focus`, `disabled`, `error`, `selected`) para diferenciar colores que cambian según la condición del componente.

> **Esto aplica aunque el token semántico al que apuntan sea `static`.** La capa de componente describe **cuándo/dónde** se aplica el color, no su naturaleza. Son niveles distintos con reglas distintas.

```
Semántico:    define si el color responde a interacción o no (static vs interactive)
Componente:   define CUÁNDO se aplica ese color dentro del componente
```

Ejemplo:
```
text-field/foreground/typography/placeholder/color/disabled
  → apunta a: interactive/foreground/neutral/disabled/medium
  
  El token de componente se llama "disabled" porque es la condición de aplicación.
  El semántico se llama "interactive/disabled" porque es un color que existe en contexto interactivo.
  Ambos están alineados.
```

---

### Reglas de nomenclatura (resumen)

| Regla | Descripción |
|---|---|
| **Sin subcarpeta** | Cuando hay 1 solo valor del tipo |
| **Con subcarpeta** | Cuando hay 2+ valores del tipo |
| **Nombre por rol** | Typography: label, placeholder, supporting-text, title, description |
| **Nombre por tamaño** | Cuando el mismo rol varía por size: sm, md, lg |
| **Nombre por estado** | Background/border: default, hover, pressed, focus, disabled, selected |
| **Nombre por tipo** | Cuando hay variantes semánticas: info, success, error, warning |
| **Nombre por estilo** | Cuando la prop Style diferencia: solid, ghost, outline, gradient |
| **Nombre por dirección** | Padding: vertical, horizontal |
| **Nombre por posición** | Corner: top-left, top-right, bottom-left, bottom-right |
| **No incluye instancias** | No toma tokens de building blocks anidados |
| **Dedup** | 4 paddings iguales = 1 token, 4 corners iguales = 1 token |
| **Orden de carpetas** | background → foreground → border → spacing |

---

## Modos de color (tematización)

> Los modes (Light / Dark / etc.) viven en la **capa semántica**, no en primitivos.

### Principio

```
Primitivos     → sin modes (valores fijos)
Semánticos     → CON modes (Light, Dark, ...)
Componentes    → sin modes (alias al semántico)
```

Cuando un frame cambia de mode, **el alias del semántico cambia** y apunta a otro primitivo.

### Cómo se resuelve

```
Frame en Light:
  button/background/solid/default
    → interactive/background/brand/primary/default/medium
      → (Light) core/purple/500 = #5A50F9

Frame en Dark:
  button/background/solid/default
    → interactive/background/brand/primary/default/medium
      → (Dark) core/purple/400 = #818CF8
```

El componente no sabe del mode. El semántico sí. El primitivo no cambia.

### Aplicable a otros modes

- Dark mode
- High contrast
- Print
- Marca alterna (white-label)
- Modo accesibilidad

Cada mode nuevo se configura en la colección de semánticos. Primitivos y componentes no cambian.

---

## Flujo de cambio sin release

### Cambio global de marca
```
Editás: core/purple/500 → nuevo valor
Resultado: se propaga a todos los semánticos y componentes automáticamente
```

### Cambio de decisión de diseño
```
Editás: interactive/background/brand/primary/hover → ahora apunta a core/purple/800
Resultado: todos los componentes que usan ese semántico cambian
```

### Cambio específico de un componente
```
Editás: button/background/solid/hover → ahora apunta a otro semántico
Resultado: solo Button cambia, el resto queda igual
```

---

## Herramientas

### Plugin-tokens (extractor)
- Extrae todos los tokens aplicados en el documento
- Genera JSON para el dashboard

### Token Component Generator V2
- Escanea un componente seleccionado
- Genera la colección de tokens específicos como alias de los semánticos
- Detecta patrones (Style, Selected, Size, Type, State)
- Aplica las reglas de subcarpetas automáticamente

### Dashboard (Vercel)
- Visualiza la salud del DS
- Muestra cobertura, tokens huérfanos, impacto de cambios
- Filtros por categoría, colección y tipo

### Snapshot + Diff (local)
- `npm run snapshot` — toma un snapshot de las variables actuales via API
- `npm run diff` — compara con el snapshot anterior y genera changelog

---

## Criterios de salud

| Métrica | Bueno | Atención | Problema |
|---|---|---|---|
| Cobertura de tokens | >90% | 70-90% | <70% |
| Tokens huérfanos | <5% | 5-15% | >15% |
| Hardcoded values | 0 | <10 | >10 |
| Tokens sin uso | <10 | 10-30 | >30 |
