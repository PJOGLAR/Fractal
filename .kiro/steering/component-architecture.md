---
inclusion: manual
---

# Reglas de Arquitectura de Componentes — Fractal DS

> Usar este steering cuando se revise la construcción de un componente (capas, propiedades, naming, estructura). Los fundamentos (naming rápido de componentes/capas, gap vs padding, escala/contextos/familias) viven en `AGENTS.md` y se cargan siempre. Este archivo asume ese contexto y agrega la regla fina.

---

## Auto Layout (obligatorio)

- **Todos** los componentes deben usar Auto Layout.
- No se permiten frames estáticos dentro de component sets.
- No wrappear un Auto Layout dentro de otro sin propósito estructural.
- Evitar wrappers innecesarios.
- Cada Auto Layout debe tener una función estructural clara.
- Auto Layout debe definirse de forma homogénea (no usar un formato en un lado y otro en otro).

| Audit | Resultado |
|---|---|
| Frame sin layout dentro de componente | ❌ Fail |
| Auto Layout anidado sin cambio de dirección, spacing o agrupación booleana | ⚠️ Warning |

---

## Naming de capas

### Formato

- **Sentence case con espacios**: primera palabra con mayúscula, espacio entre palabras, resto en minúscula.
- Ejemplos: `Hover layer`, `Supporting text`, `Input wrapper`, `Checkbox`.
- **Prohibido**: nombres genéricos (`Frame 23`, `Group 12`, `Rectangle 3`).
- **Prohibido**: duplicados dentro del mismo scope de componente.

| Formato | ✅ Correcto | ❌ Incorrecto |
|---|---|---|
| Sentence case | `Hover layer`, `Focus ring` | `Hover-layer`, `hover layer` |

### Naming semántico (por rol)

Los nombres describen **rol**, no posición física.

| ✅ Permitido | ❌ Prohibido |
|---|---|
| Leading | Left |
| Content | Right |
| Trailing | TopIcon |
| Heading | IconLeft |

**Si el nombre contiene Left/Right → ❌ Fail.**

### Prefijo `---> ` para slots intercambiables

Solo en capas que tienen una **propiedad de swap expuesta** al consumidor.

| Audit | Resultado |
|---|---|
| `---> ` con propiedad de swap expuesta | ✅ Pass |
| `---> ` sin propiedad de swap | ⚠️ Warning — falta exponer la propiedad |

---

## Naming de componentes — detalle

El formato básico (`Nombre-componente`, mayúscula inicial, guión ASCII, minúscula) vive en `AGENTS.md`. Acá va el detalle:

### Building blocks

Prefijo `.⛔️` o `⛔️` + nombre del padre + `_` + parte.

| Formato | Ejemplo |
|---|---|
| `.⛔️ [Padre]_[parte]` | `.⛔️ Text-area_scroll-bar` |
| `.⛔️ [Padre]_[parte]_[sub-parte]` | `.⛔️ Row-item_leading-content_item` |

- Separador entre padre y parte: `_` (underscore).
- Separador entre palabras dentro de cada parte: `-` (hyphen).
- No se publican, no se incluyen en tokens de componente.
- Empiezan con `.` para aparecer primero en el listado.

---

## Propiedades y variantes

### Nombres de propiedades

**Sentence case** (igual que layers): `Horizontal padding`, `Has icon`, `Style`, `State`, `Size`.

### Valores de propiedades

**Todo en minúscula**: `default`, `hover`, `pressed`, `solid`, `ghost`.

### Booleanos

| Tipo | Formato | Ejemplos |
|---|---|---|
| Presencia (¿tiene?) | `Has ` + resto en minúscula | `Has icon`, `Has label`, `Has button primary` |
| Estado (¿está en?) | Sin `Has`, sentence case | `Selected`, `Expanded`, `Open` |

### Orden obligatorio de variantes

El orden vertical en el panel de propiedades debe respetar:

1. Size
2. Type / Style
3. Hierarchy
4. State
5. Appearance

Criterio para ordenar:

1. Reconocibilidad visual (lo que más cambia la apariencia va primero).
2. Uso predictible.
3. Consistencia entre familias.

### Congruencia entre propiedades y variantes

Las propiedades son props del componente. Las variantes son los valores posibles. No mezclar: un estado NO es una variante del componente sino un valor de la propiedad `State`.

### Naming semántico de props: `Orientation` vs `Alignment`

Son dos conceptos distintos y no deben mezclarse.

| Prop | Qué controla | Valores válidos |
|---|---|---|
| `Orientation` | Dirección/eje del layout del componente | `horizontal`, `vertical` |
| `Alignment` | Posición del contenido dentro del contenedor | `left`, `center`, `right` (o `start`, `center`, `end`) |

**Regla:** si un componente tiene una prop que define si sus elementos se disponen en fila o en columna, la prop se llama **`Orientation`** con valores `horizontal` / `vertical`. Nunca `Alignment` para eso.

`Alignment` queda reservado para posicionar contenido (texto, íconos, elementos hijos) respecto de su contenedor.

| ✅ Correcto | ❌ Incorrecto |
|---|---|
| `Orientation: horizontal / vertical` | `Alignment: horizontal / vertical` |
| `Alignment: left / center / right` | `Orientation: left / center / right` |

Aplica retroactivamente: componentes existentes que hoy usan `Alignment` con valores `horizontal` / `vertical` (por ejemplo `Empty state`, `Button card`) deben migrarse a `Orientation`.

---

## Zonas semánticas (Leading / Content / Trailing)

| Zona | Rol |
|---|---|
| Leading | Elemento antes del contenido principal |
| Content | Información primaria |
| Trailing | Acción secundaria o indicador |

**Prohibido:** Left / Right como nombres de zona.

---

## Slots de placeholder (icon / picto / brand / illustration)

Slots como `.⛔ Placeholder-icon_slot` deben tener la capa interior nombrada **Vector**.

- Es por diseño: todos se llaman igual para override de fill/stroke.
- **No flaggear** "Vector" como nombre genérico en estos slots.
- **Sí flaggear** si tiene otro nombre (ej. `add_box`, `play_arrow`) → renombrar a **Vector**.

### Padding en slots de placeholder

El padding fijo (ej. 3px) en el contenedor del slot **no es error de tokens**. Es intencional para alinear el contenido swappeado.

---

## Texto por default (obligatorio)

- **Prohibido**: Lorem ipsum.
- **Prohibido**: texto genérico (`Label`, `Text`, `Title`).
- El texto debe ser **realista, contextual, accesible y claro**.

| ✅ Permitido | ❌ Prohibido |
|---|---|
| Usar nombre | Lorem ipsum |
| Sentencias reales | Label |
| Frase contextual | Text |

---

## Component Set root

El **Component Set** (el nodo padre que contiene todas las variantes) **tiene propiedades visuales propias** que las variantes heredan:

- Corner radius.
- Stroke (color y width).
- Padding.
- Gap.

Esto es intencional: los valores cross (que no cambian entre variantes) se definen una vez en el set root. Las variantes solo overridean lo distinto (fills, colores de texto, etc.).

**No flaggear** el set root por tener bounds/strokes/fills. Solo flaggear si una variante tiene un valor que contradice lo heredado sin razón.

---

## Instancias anidadas

- Los tokens de instancias anidadas (building blocks) **no se incluyen** en la colección del componente padre.
- El componente padre solo tokeniza sus propias capas.
- Los building blocks heredan tokens del componente que los contiene.

---

## Reglas inferidas de la arquitectura actual

### Variantes deben ser exhaustivas

Si un componente tiene `State` (default, hover, pressed, focus, disabled), TODAS las combinaciones deben existir como variantes. No puede faltar `focus` si existe `hover`.

### Props que generan cambio visual de color = variante explícita

Si una prop (`Style`, `Selected`, `Appearance`) cambia el color del componente, debe ser una variante con sus valores en el component set, no un override manual.

### Componentes deben ser auto-contenidos

Un componente público no debe depender de elementos fuera de su component set para funcionar. Todo lo que necesita está dentro (o es un building block referenciado).

### No mezclar responsabilidades

Un componente hace UNA cosa. Si tiene dos funciones distintas (por ej. es botón Y es link), separar en dos componentes o usar una prop `Style` que los diferencie.
