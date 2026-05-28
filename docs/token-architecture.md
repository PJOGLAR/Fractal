# Arquitectura de Tokens — Fractal Design System

## Estructura de 3 niveles

```
Primitivo → Semántico → Componente
```

| Nivel | Ejemplo | Responde a |
|---|---|---|
| Primitivo | `core/purple/500` | ¿Qué valor tiene? |
| Semántico | `interactive/background/brand/main/default` | ¿Para qué se usa? |
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
[contexto]/[elemento]/[marca]/[variante]/[intensidad]
```

### Contextos:
- **static** — Valores que no cambian con interacción (textos, fondos estáticos, bordes decorativos)
- **interactive** — Valores que responden a estados de interacción (hover, pressed, focus, disabled)

### Elementos:
- **background** — Fondos de contenedores, cards, botones
- **foreground** — Color de texto e iconos
- **border** — Color de bordes
- **opacity** — Capas de opacidad para estados

### Marcas:
- **brand/main** — Marca principal (purple)
- **brand/accent** — Marca madre/secundaria (cyan)
- **neutral** — Grises y neutros
- **feedback** — Estados de feedback (error, warning, success, info)

### Intensidades:
| Intensidad | Uso | Rango típico |
|---|---|---|
| `strong` (bold) | El más intenso/prominente | 700-950 |
| `default` (medium) | Valor principal del contexto | Varía por contexto |
| `subtle` | Versión suave/secundaria | 100-300 |
| `muted` (quiet) | Apenas visible | 25-50 |

### Ejemplos completos:
```
static/background/brand/main/default        → core/purple/500
static/background/brand/main/subtle         → core/purple/100
static/background/brand/main/muted          → core/purple/50
static/background/feedback/error/strong     → core/red/700
static/background/feedback/error/subtle     → core/red/50

interactive/background/brand/main/hover     → core/purple/700
interactive/background/brand/main/pressed   → core/purple/900
interactive/background/neutral/disabled     → core/neutral/100

static/foreground/neutral/primary/default   → core/neutral/950
static/foreground/neutral/secondary/default → core/neutral/800
static/foreground/neutral/tertiary/default  → core/neutral/600

interactive/border/brand/main/focus         → core/purple/500
interactive/border/neutral/disabled         → core/neutral/400
```

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
1. **Nombre de colección** = nombre del componente (ej: `Pill`, `Button-card`)
2. **Sin subcarpeta** cuando hay 1 solo valor del tipo (ej: `border/corner`, `border/width`)
3. **Con subcarpeta** cuando hay 2+ valores del tipo (ej: `border/color/info`, `border/color/error`)
4. **Tipografía** usa el nombre del layer como rol (ej: `typography/title/font-size`)
5. **No incluye** tokens de instancias anidadas (building blocks)
6. **No repite** tokens con el mismo valor (4 paddings iguales = 1 token)

### Ejemplo: Pill
```
Pill/
├── spacing/
│   ├── gap
│   └── padding/
│       ├── padding-0
│       └── padding-200
├── border/
│   ├── corner
│   ├── width
│   └── color/
│       ├── feedback-info
│       ├── feedback-success
│       ├── feedback-warning
│       ├── feedback-error
│       └── neutral-primary-medium
├── background/
│   └── static/
│       ├── brand-main-subtle
│       ├── feedback-info-bold
│       ├── feedback-error-bold
│       ├── feedback-error-subtle
│       └── neutral-primary-bold
└── foreground/
    └── typography/
        └── label/
            ├── font-size
            ├── font-family
            ├── font-weight
            ├── line-height
            ├── letter-spacing
            └── color
```

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
