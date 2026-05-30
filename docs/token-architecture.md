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

La tematización (dark mode, alto contraste, etc.) se resuelve con **modes nativos de Figma en la capa de primitivos**. Los semánticos y los componentes no se enteran del cambio de mode.

### Principio

```
Primitivos → tienen modes (Light, Dark, ...)
Semánticos → sin modes (un solo alias al primitivo)
Componentes → sin modes (alias al semántico)
```

Cuando un frame cambia de mode, Figma resuelve la cadena de alias usando el valor del primitivo en el mode activo. Los semánticos y componentes no se modifican.

### Cómo se resuelve un token

```
Frame en Light:
  button-card/foreground/regular
    → static/foreground/brand/primary/regular
      → core/purple/500 (Light) = #8B5CF6

Frame en Dark:
  button-card/foreground/regular
    → static/foreground/brand/primary/regular
      → core/purple/500 (Dark) = #B89BFF
```

Una sola cadena de alias. El mode solo afecta el valor final del primitivo.

### Estructura de la colección de primitivos

```
core (collection)
├── Mode: Light
├── Mode: Dark
│
├── core/purple/500
│   ├── Light → #8B5CF6
│   └── Dark  → valor para dark
│
├── core/neutral/950
│   ├── Light → #0A0A0A
│   └── Dark  → valor para dark
```

### Tres formas de definir el valor Dark

#### 1. Mismo valor (caso más común)

Si el primitivo funciona en ambos modes, repetís el valor.

```
core/purple/500
  Light → #8B5CF6
  Dark  → #8B5CF6
```

#### 2. Valor ajustado (cuando no da contraste)

Si el primitivo en dark no contrasta bien sobre fondos oscuros, le asignás un valor distinto solo en el mode Dark. **El nombre del primitivo no cambia.**

```
core/purple/500
  Light → #8B5CF6
  Dark  → #B89BFF   ← más claro/saturado para destacar sobre fondos oscuros
```

Esta es la forma de **alterar valores primitivos individuales** sin tocar el resto del sistema.

#### 3. Primitivo nuevo (último recurso)

Cuando ninguno de los valores existentes en la escala (5–950) sirve para dark, se agrega un primitivo nuevo.

**Forma simple — escala extendida:**
```
core/neutral/15           ← primitivo nuevo, útil para dark
  Light → #F8F8F8         (placeholder; si no se usa en light, repetir el más cercano)
  Dark  → #1A1A1A
```

**Forma dedicada — rama `core/dark/` para casos cromáticamente distintos:**
```
core/dark/purple/extra-bright
  Light → #B89BFF (placeholder)
  Dark  → #C9B0FF
```

Solo usar la rama `core/dark/` si necesitás muchos valores especiales y querés tenerlos visualmente separados en el árbol de Figma.

### Flujo de decisión

```
¿El primitivo existente funciona en dark?
├── Sí → mismo valor en ambos modes
└── No → ¿Puedo ajustar el valor del mode Dark del primitivo existente?
         ├── Sí → ajusto solo el valor Dark (Forma 2)
         └── No → ¿El valor que necesito encaja en la escala normal?
                  ├── Sí → agrego primitivo nuevo en core/[color]/[nivel] (Forma 3 simple)
                  └── No → agrego en core/dark/[color]/[nombre] (Forma 3 dedicada)
```

### Por qué esto y no `core` + `core-dark` separados

| Enfoque | Pro | Contra |
|---|---|---|
| Modes en primitivos | Una sola colección, semánticos y componentes no cambian | Requiere configurar modes en Figma |
| Colección `core-dark` separada | Visualmente explícito qué es dark | Doble mantenimiento, los semánticos terminan con lógica de modo, nombres duplicados |

La estrategia de modes es estándar en Material 3, IBM Carbon, Polaris.

### Aplicable a otros modes

El mismo principio sirve para cualquier mode futuro:
- High contrast
- Print
- Marca alterna (white-label)
- Modo accesibilidad

Cada mode nuevo se configura en la colección de primitivos. Semánticos y componentes no cambian.

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
