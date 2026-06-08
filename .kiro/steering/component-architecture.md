---
inclusion: manual
---

# Reglas de Arquitectura de Componentes — Fractal DS

> Usar este steering cuando se revise la construcción de un componente (capas, propiedades, naming, estructura).

---

## Auto Layout (obligatorio)

- **Todos** los componentes deben usar Auto Layout.
- No se permiten frames estáticos dentro de component sets.
- No wrappear un Auto Layout dentro de otro sin propósito estructural.
- Evitar wrappers innecesarios.
- Cada Auto Layout debe tener una función estructural clara.
- Auto Layout debe definir de forma homogénea (no usar un formato en un lado y otro formato en otro lugar).

| Audit | Resultado |
|-------|-----------|
| Frame sin layout dentro de componente | ❌ Fail |
| Auto Layout anidado sin cambio de dirección, spacing o agrupación booleana | ⚠️ Warning |

---

## Naming de capas

### Formato

- **Sentence case con espacios**: primera palabra con mayúscula, espacio entre palabras, resto en minúscula.
- Ejemplos: `Hover layer`, `Supporting text`, `Input wrapper`, `Checkbox`.
- **Prohibido**: nombres genéricos (Frame 23, Group 12, Rectangle 3).
- **Prohibido**: duplicados dentro del mismo scope de componente.

| Formato | ✅ Correcto | ❌ Incorrecto |
|---------|------------|--------------|
| Sentence case | `Hover layer`, `Focus ring` | `Hover-layer`, `hover layer` |

### Naming semántico (por rol)

Los nombres describen **rol**, no posición física.

| ✅ Permitido | ❌ Prohibido |
|-------------|-------------|
| Leading | Left |
| Content | Right |
| Trailing | TopIcon |
| Heading | IconLeft |

**Si el nombre contiene Left/Right → ❌ Fail.**

### Prefijo `---> ` para slots intercambiables

Solo en capas que tienen una **propiedad de swap expuesta** al consumidor.

| Audit | Resultado |
|-------|-----------|
| `---> ` con propiedad de swap expuesta | ✅ Pass |
| `---> ` sin propiedad de swap | ⚠️ Warning — falta exponer la propiedad |

---

## Naming de componentes

### Formato

**`Nombre-componente`** — primer segmento con mayúscula inicial, guión ASCII `-`, segmentos siguientes en minúscula. Sin espacios.

- ✅ `Swap-content`, `Button-icon`, `Progress-bar`, `Text-field`
- ❌ `button-icon` (sin mayúscula), `Button Icon` (con espacio)

### Building blocks

Prefijo `.⛔️` o `⛔️` + nombre del padre + `_` + parte.

| Formato | Ejemplo |
|---------|---------|
| `.⛔️ [Padre]_[parte]` | `.⛔️ Text-area_scroll-bar` |
| `.⛔️ [Padre]_[parte]_[sub-parte]` | `.⛔️ Row-item_leading-content_item` |

- Separador entre padre y parte: `_` (underscore)
- Separador entre palabras dentro de cada parte: `-` (hyphen)
- No se publican, no se incluyen en tokens de componente
- Empiezan con `.` para aparecer primero en el listado

---

## Propiedades y variantes

### Nombres de propiedades

**Sentence case** (igual que layers): `Horizontal padding`, `Has icon`, `Style`, `State`, `Size`.

### Valores de propiedades

**Todo en minúscula**: `default`, `hover`, `pressed`, `solid`, `ghost`.

### Booleanos

| Tipo | Formato | Ejemplos |
|------|---------|----------|
| Presencia (¿tiene?) | `Has ` + resto en minúscula | `Has icon`, `Has label`, `Has button primary` |
| Estado (¿está en?) | Sin `Has`, sentence case | `Selected`, `Expanded`, `Open` |

### Orden obligatorio de variantes

El orden vertical en el panel de propiedades debe respetar:

**Orden dentro del DS:**
1. Size
2. Type/Style
3. Hierarchy
4. State
5. Appearance

**Criterio para ordenar:**
1. Reconocibilidad visual (lo que más cambia la apariencia va primero)
2. Uso predictible
3. Consistencia entre familias

### Mantener congruencia entre propiedades y variantes

Las propiedades son props del componente. Las variantes son los valores posibles. No mezclar: un estado NO es una variante del componente sino un valor de la propiedad State.

---

## Zonas semánticas (Leading / Content / Trailing)

| Zona | Rol |
|------|-----|
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
|-------------|-------------|
| Usar nombre | Lorem ipsum |
| Sentencias reales | Label |
| Frases contextual | Text |

---

## Instancias anidadas

- Los tokens de instancias anidadas (building blocks) **no se incluyen** en la colección del componente padre.
- El componente padre solo tokeniza sus propias capas.
- Los building blocks heredan tokens del componente que los contiene.

---

## Reglas inferidas de la arquitectura actual

### Variantes deben ser exhaustivas
Si un componente tiene State (default, hover, pressed, focus, disabled), TODAS las combinaciones deben existir como variantes. No puede faltar `focus` si existe `hover`.

### Props que generan cambio visual de color = variante explícita
Si una prop (Style, Selected, Appearance) cambia el color del componente, debe ser una variante con sus valores en el component set, no un override manual.

### Componentes deben ser auto-contenidos
Un componente público no debe depender de elementos fuera de su component set para funcionar. Todo lo que necesita está dentro (o es un building block referenciado).

### No mezclar responsabilidades
Un componente hace UNA cosa. Si tiene dos funciones distintas (ej: es botón Y es link), separar en dos componentes o usar una prop Style que los diferencie.
