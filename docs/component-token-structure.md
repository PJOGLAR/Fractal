# Estructura de Tokens de Componente

## Regla principal

> **Si hay UN solo valor → va directo en la carpeta padre.**
> **Si hay MÁS DE UNO → se crean subcarpetas.**
> **Si mañana entra un valor nuevo, se agrega subcarpeta sin romper lo anterior.**

---

## Estructura base

```
[componente]/
├── background/
│   └── [división principal o directo]
├── foreground/
│   ├── typography/
│   │   └── [rol o size o directo]/
│   │       ├── font-size, font-family, font-weight, letter-spacing, line-height
│   │       └── color/ (si múltiples) o color (si uno solo)
│   └── icon/
│       ├── color (o color/[diferenciador] si múltiples)
│       └── size (o size/[diferenciador] si múltiples)
├── border/
│   ├── corner (o corner/[posición] si múltiples)
│   ├── width (o width/[nombre] si múltiples)
│   └── color/ (o color si uno solo)
└── spacing/
    ├── padding (o padding/[dirección o size] si múltiples)
    └── gap (o gap/[nombre] si múltiples)
```

---

## Regla de subcarpetas

| Caso | Resultado |
|---|---|
| 1 solo corner | `border/corner` |
| 2+ corners distintos | `border/corner/top-left`, `border/corner/bottom-right` |
| 1 solo width | `border/width` |
| 2 distintos | `border/width/primary`, `border/width/emphasis` |
| 1 solo padding | `spacing/padding` |
| 2 paddings (H ≠ V) | `spacing/padding/vertical`, `spacing/padding/horizontal` |
| Padding por size | `spacing/padding/sm`, `spacing/padding/md`, `spacing/padding/lg` |
| 1 solo gap | `spacing/gap` |
| 2+ gaps | `spacing/gap/content`, `spacing/gap/items` |
| 1 solo color de texto | `foreground/typography/color` |
| Múltiples colores | `foreground/typography/color/default`, `/error`, `/disabled` |

---

## División principal (background y border color)

La **prop que genera el cambio más estructural** define la primera carpeta:

| Componente | Prop principal | Subcarpetas | Luego |
|---|---|---|---|
| Pill | Style | solid, outline | type (info, success, error...) |
| Chip-filter | Selected | selected, unselected | state (default, hover, pressed) |
| Label | Style | solid, gradient | color (orange, green, magenta) |
| Button | Style | solid, ghost, outline, neutral, link | state + appearance |
| Text-field | — (cross) | — | state en border/color |
| Badge | Type | info, error, neutral... | — |
| Alert | Type + Hierarchy | info/bold, info/subtle... | — |
| Avatar | State | default, hover, pressed, disabled | — |

---

## Typography

### Cross (misma tipografía en todas las variantes)

```
badge/foreground/typography/font-family
badge/foreground/typography/font-size
badge/foreground/typography/font-weight
badge/foreground/typography/letter-spacing
badge/foreground/typography/line-height
badge/foreground/typography/color
```

### Con roles distintos

```
text-field/foreground/typography/label/font-family
text-field/foreground/typography/label/font-size
text-field/foreground/typography/label/font-weight
text-field/foreground/typography/label/letter-spacing
text-field/foreground/typography/label/line-height
text-field/foreground/typography/label/color/default
text-field/foreground/typography/label/color/disabled
text-field/foreground/typography/placeholder/font-family
text-field/foreground/typography/placeholder/font-size
text-field/foreground/typography/placeholder/color/default
text-field/foreground/typography/placeholder/color/disabled
text-field/foreground/typography/supporting-text/font-family
text-field/foreground/typography/supporting-text/color/default
text-field/foreground/typography/supporting-text/color/error
```

### Por tamaño (varía con prop Size)

```
chip-filter/foreground/typography/sm/font-family
chip-filter/foreground/typography/sm/font-size
chip-filter/foreground/typography/sm/font-weight
chip-filter/foreground/typography/md/font-family
chip-filter/foreground/typography/md/font-size
chip-filter/foreground/typography/lg/font-family
chip-filter/foreground/typography/lg/font-size
chip-filter/foreground/typography/color/selected
chip-filter/foreground/typography/color/unselected
```

### Color de texto con subcarpetas

El color de texto se subdivide por la **categoría que genera el cambio**:

| Caso | Subcarpeta |
|---|---|
| Cambia por estado del componente | `color/default`, `color/disabled`, `color/error` |
| Cambia por tipo de feedback | `color/info`, `color/success`, `color/error` |
| Cambia por estilo | `color/solid`, `color/outline` |
| Cambia por selección | `color/selected`, `color/unselected` |

---

## Ejemplos completos

### Badge (todo cross)

```
badge/
├── background/info
├── background/error
├── border/corner
├── border/width
├── border/color
├── foreground/typography/font-family
├── foreground/typography/font-size
├── foreground/typography/font-weight
├── foreground/typography/letter-spacing
├── foreground/typography/line-height
├── foreground/typography/color
└── spacing/
    ├── padding/horizontal
    └── padding/vertical
```

### Pill (Style + Type)

```
pill/
├── background/
│   ├── solid/
│   │   ├── info
│   │   ├── success
│   │   ├── warning
│   │   ├── error
│   │   └── neutral
│   └── outline/
│       ├── info
│       ├── success
│       ├── warning
│       ├── error
│       └── brand
├── foreground/
│   └── typography/
│       ├── font-family
│       ├── font-size
│       ├── font-weight
│       ├── letter-spacing
│       ├── line-height
│       └── color/
│           ├── solid/quiet
│           └── outline/
│               ├── info
│               ├── success
│               ├── warning
│               ├── error
│               └── neutral
├── border/
│   ├── corner
│   ├── width
│   └── color/
│       ├── info
│       ├── success
│       ├── warning
│       ├── error
│       └── medium
└── spacing/
    ├── padding/horizontal
    ├── padding/vertical
    └── gap
```

### Chip-filter (Selected + Size + State)

```
chip-filter/
├── background/
│   ├── selected/
│   │   ├── default (o medium)
│   │   └── hover
│   ├── unselected/
│   │   ├── quiet
│   │   └── hover
│   ├── pressed
│   └── disabled
├── foreground/
│   ├── typography/
│   │   ├── sm/ (font-family, font-size, font-weight, letter-spacing, line-height)
│   │   ├── md/ (idem)
│   │   ├── lg/ (idem)
│   │   └── color/
│   │       ├── selected
│   │       ├── unselected
│   │       └── disabled
│   └── icon/
│       ├── color/
│       │   ├── selected
│       │   └── unselected
│       └── size
├── border/
│   ├── corner
│   ├── width
│   └── color/
│       ├── focus
│       └── unselected/
│           ├── default
│           └── hover
└── spacing/
    ├── padding/
    │   ├── sm/horizontal
    │   ├── sm/vertical
    │   ├── md/horizontal
    │   ├── md/vertical
    │   ├── lg/horizontal
    │   └── lg/vertical
    └── gap
```

### Text-field (State + Roles)

```
text-field/
├── background/default
├── foreground/
│   ├── typography/
│   │   ├── label/
│   │   │   ├── font-family, font-size, font-weight, letter-spacing, line-height
│   │   │   └── color/
│   │   │       ├── default
│   │   │       └── disabled
│   │   ├── placeholder/
│   │   │   ├── font-family, font-size, font-weight, letter-spacing, line-height
│   │   │   └── color/
│   │   │       ├── default
│   │   │       └── disabled
│   │   └── supporting-text/
│   │       ├── font-family, font-size, font-weight, letter-spacing, line-height
│   │       └── color/
│   │           ├── default
│   │           └── error
│   └── icon/
│       ├── color
│       └── size
├── border/
│   ├── corner
│   ├── width/primary
│   ├── width/emphasis
│   └── color/
│       ├── default
│       ├── hover
│       ├── focus
│       ├── disabled
│       └── error
└── spacing/
    ├── padding/horizontal
    ├── padding/vertical
    └── gap/
        ├── horizontal
        └── supporting-text
```

### Button-row (Size en padding)

```
button-row/
├── background/
│   ├── hover
│   └── disabled
├── foreground/
│   └── typography/
│       ├── font-family
│       ├── font-size
│       ├── font-weight
│       ├── letter-spacing
│       ├── line-height
│       └── color/
│           ├── brand
│           └── neutral
├── border/
│   ├── corner/top
│   ├── corner/bottom
│   ├── width
│   └── color/pressed
└── spacing/
    ├── padding/
    │   ├── vertical
    │   └── horizontal/
    │       ├── xs
    │       ├── sm
    │       ├── md
    │       └── lg
    └── gap
```

### Avatar (Typography por size)

```
avatar/
├── background/
│   ├── default
│   ├── hover
│   ├── pressed
│   └── disabled
├── foreground/
│   ├── typography/
│   │   ├── label/sm/ (font-family, font-size, font-weight, letter-spacing, line-height)
│   │   ├── label/md/ (idem)
│   │   └── color/
│   │       ├── primary
│   │       └── secondary
│   └── overlay/
│       ├── hover
│       ├── pressed
│       └── disabled
├── border/
│   ├── corner
│   └── width
└── spacing/padding
```

---

## Naming de estados en componentes

Los tokens de componente usan **nombres de estado** aunque el semántico al que apunten sea `static`.

La capa de componente describe **cuándo/dónde** se aplica el color, no su naturaleza:

```
Semántico:    "¿Este color ES interactivo o estático?"
Componente:   "¿CUÁNDO se aplica este color?"
```

Ejemplo:
```
text-field/foreground/typography/placeholder/color/disabled
  → apunta a: interactive/foreground/neutral/disabled/medium

  "disabled" en el componente = la condición de aplicación.
  "interactive/disabled" en el semántico = el contexto al que pertenece.
  Ambos están alineados.
```

---

## Patrones de variación

| Patrón | Componentes | Qué cambia | Subcarpeta por |
|---|---|---|---|
| **State** | Button, Chip-filter, Text-field, Avatar... | fills, strokes, opacity | default, hover, pressed, focus, disabled |
| **Size** | Button, Chip-filter, Avatar, Button-row... | padding, gap, radius, typography | xs, sm, md, lg, xl |
| **Type** | Pill, Alert, Badge, Snackbar... | fills, strokes | info, error, success, warning, neutral |
| **Style** | Button, Pill, Label, Tabs... | fills, strokes, padding | solid, ghost, outline, gradient, neutral, link |
| **Selected** | Chip-filter, Chip-input, Accordion, Row-item | fills, strokes | selected, unselected |
| **Appearance** | Button, Button-icon, Status-bar | fills invierte | default, inverse |
| **Hierarchy** | Alert, Pill | fills | bold, subtle |

### Combinación de patrones

Cuando un componente combina múltiples patrones, el orden de prioridad para la primera carpeta es:

1. **Style** (si aplica)
2. **Selected** (si aplica)
3. **Type/Hierarchy** (si aplica)
4. **State** (siempre aplica como última capa)

Size siempre va en su propia rama (spacing, corner, typography) porque no afecta colores.
