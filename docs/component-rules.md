# Reglas de Construcción y Tokenización de Componentes

> Guía para el equipo sobre cómo construir componentes en Figma y cómo aplicar tokens correctamente.

---

## Parte 1 — Arquitectura de Componentes

### Auto Layout (obligatorio)

- **Todos** los componentes deben usar Auto Layout.
- No wrappear un Auto Layout dentro de otro sin propósito estructural.
- Evitar wrappers innecesarios.
- Cada Auto Layout debe tener una función estructural clara.

---

### Naming de capas

**Formato:** Sentence case con espacios.

| ✅ Correcto | ❌ Incorrecto |
|------------|--------------|
| `Hover layer` | `Hover-layer` |
| `Focus ring` | `Focus Ring` |
| `Supporting text` | `Frame 23`, `Group 12` |

**Naming semántico (por rol, no por posición):**

| ✅ Permitido | ❌ Prohibido |
|-------------|-------------|
| Leading | Left |
| Content | Right |
| Trailing | TopIcon |

> **Nota:** Renombrar las capas con instancias anidadas con `---> ` + nombre descriptivo que permita identificar mejor la estructura al configurar el componente en el flujo.
> Ejemplo: `---> Button`, `---> Trailing content`

---

### Naming de componentes

**Formato:** `Nombre-componente` — mayúscula inicial, guión `-`, segmentos siguientes en minúscula. Sin espacios.

- ✅ `Button-icon`, `Progress-bar`, `Text-field`
- ❌ `Button-Icon`, `button-icon`, `Button Icon`

**Building blocks:** `.⛔️ [Padre]_[parte]` con `_` entre padre y parte, `-` entre palabras.

```
.⛔️ Text-area_scroll-bar
.⛔️ Row-item_leading-content_item
⛔️ Button-toggle
```

> Los building blocks solo se utilizan dentro de los componentes para los que fueron creados. No se publican, no se tokenizan directamente.

---

### Propiedades y variantes

**Nombres de propiedades:** Sentence case (`Horizontal padding`, `Has icon`, `Style`, `State`).

**Valores:** todo en minúscula (`default`, `hover`, `solid`, `ghost`).

**Booleanos:**

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Presencia | `Has ` + resto | `Has icon`, `Has label` |
| Estado | Sin `Has` | `Selected`, `Expanded` |

**Orden de variantes en el panel:**
1. Size
2. Type/Style
3. Hierarchy
4. State
5. Appearance

> Agregar un ejemplo o lista de las propiedades más utilizadas según los componentes y una breve descripción de el para que se usa.

---

### Component Set root

El set root (padre de todas las variantes) tiene propiedades visuales que las variantes **heredan**: corner radius, stroke, padding, gap. Se definen una vez ahí, las variantes solo overridean lo que cambia (fills, colores de texto).

---

### Slots de placeholder

La capa interior de `.⛔ Placeholder-icon_slot` y similares debe llamarse **Vector**. Es por diseño (override de fill). El padding fijo (3px) en estos slots no es error de tokens.

---

### Reglas adicionales

- **Variantes exhaustivas:** si existe `hover`, deben existir todos los estados (default, hover, pressed, focus, disabled).
- **Auto-contenido:** un componente público no depende de elementos externos.
- **Una responsabilidad:** un componente hace una cosa. Si tiene dos funciones, separar o usar prop Style.
- **Instancias anidadas:** no se incluyen en los tokens del padre.

---

## Parte 2 — Reglas de Tokenización (tokens de tercer nivel)

> Los tokens de componente son el **tercer nivel** de la cadena. Referencian a un semántico via alias.

### Cadena de alias

```
Primitivo → Semántico → Componente (tercer nivel)
```

| Nivel | Ejemplo | Función |
|---|---|---|
| Primitivo | `core/purple/500` | Valor crudo |
| Semántico | `static/foreground/neutral/medium` | Propósito del valor |
| Componente | `button/background/solid/default` | Dónde se aplica |

---

### Tokens semánticos — estructura

```
[contexto]/[elemento]/[familia]/[sub-familia?]/[variante?]/[escala]
```

**Contextos:**
- `static` — no cambia con interacción
- `interactive` — responde a estados
- `expressive` — decorativo

**Familias:**
- `brand/primary` (purple), `brand/secondary` (cyan)
- `neutral` (cross, sin sub-familia)
- `feedback/info`, `feedback/success`, `feedback/warning`, `feedback/error`

**Escala:**

| Intensidad | Rango primitivo | Aplica a |
|---|---|---|
| `strong` | 950 | Solo neutral |
| `bold` | 700-900 (neutral) / 700-950 (otros) | Todos |
| `medium` | 500-600 | Todos |
| `subtle` | 100-400 | Todos |
| `quiet` | 25-50 | Todos |

```
strong > bold > medium > subtle > quiet
```

Las escalas son contextuales: `medium` foreground ≠ `medium` background en valor absoluto.

---

### Tokens de componente — estructura

```
[componente]/
├── background/
├── foreground/
│   ├── typography/
│   └── icon/
├── border/
│   ├── corner
│   ├── width
│   └── color/
└── spacing/
    ├── padding
    └── gap
```

**Orden:** background → foreground → border → spacing

---

### Regla de subcarpetas

> **1 solo valor → directo en la carpeta.**
> **2+ valores → subcarpetas.**

```
1 corner:    comp/border/corner
2+ corners:  comp/border/corner/top-left, comp/border/corner/bottom-right

1 padding:   comp/spacing/padding
2 paddings:  comp/spacing/padding/vertical, comp/spacing/padding/horizontal
```

---

### División principal (background y border/color)

La prop que genera el cambio más estructural define la primera carpeta:

| Prioridad | Prop | Valores |
|---|---|---|
| 1 | Style | solid, ghost, outline, gradient |
| 2 | Selected | selected, unselected |
| 3 | Type | info, success, warning, error |
| 4 | State | default, hover, pressed, focus, disabled |

Ejemplos:
```
pill/background/solid/info
chip-filter/background/selected/hover
text-field/background/default
```

---

### Typography

**Cross (misma en todas las variantes):**
```
comp/foreground/typography/font-family
comp/foreground/typography/font-size
comp/foreground/typography/color
```

**Con roles distintos:**
```
comp/foreground/typography/label/font-family
comp/foreground/typography/label/color/default
comp/foreground/typography/placeholder/font-family
comp/foreground/typography/placeholder/color/disabled
```

**Por tamaño:**
```
comp/foreground/typography/sm/font-family
comp/foreground/typography/md/font-family
comp/foreground/typography/color/selected
```

---

### Naming de estados en componentes

Los tokens de componente usan **nombres de estado** (default, hover, disabled, error) para subcarpetas, **aunque el semántico al que apuntan sea `static`**.

La capa de componente describe **cuándo** se aplica el color, no su naturaleza.

```
text-field/foreground/typography/placeholder/color/disabled
  → apunta a: interactive/foreground/neutral/disabled/medium
```

---

### Errores comunes

| Error | Descripción |
|---|---|
| Foreground como background | Token de `foreground` en un fill de contenedor |
| Background como stroke | Token de `background` en strokes |
| Gap como padding | Token `gap/gap-X` en propiedad de padding |
| Padding como gap | Token `padding/padding-X` en itemSpacing |
| Static en interactivo | Debería ser `interactive` si cambia por estado |
| Interactive en estático | Debería ser `static` si no tiene estados |

**Diferencia gap vs padding:**

| Token | Propiedad | Controla |
|---|---|---|
| `gap/gap-X` | `itemSpacing` | Espacio **entre** hijos |
| `padding/padding-X` | `paddingTop/Bottom/Left/Right` | Espacio **interno** |

---

### Qué SÍ tokenizar

Todo valor visual: color (fill/stroke), spacing (padding/gap), border (corner/width), tipografía (size/weight/family/line-height/letter-spacing), asset size (icon/pictogram).

---

### Focus

- Token propio: `comp/border/color/focus`
- Cross (no depende de style, selected ni type)
- Apunta a: `interactive/border/brand/primary/focus/medium`

### Icon

```
comp/foreground/icon/color
comp/foreground/icon/size
```

Si el icono es instancia anidada → no se tokeniza en el padre.

---

### Dedup

- 4 paddings iguales = 1 token
- 4 corners iguales = 1 token
- Mismo nombre + mismo ID = se colapsa
