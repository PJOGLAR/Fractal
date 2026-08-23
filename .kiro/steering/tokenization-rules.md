---
inclusion: manual
---

# Reglas de Tokenización — Fractal DS

> Usar este steering cuando se revise la aplicación de tokens a un componente o se genere una colección de tokens de componente. Los fundamentos (cadena primitivo→semántico→componente, contextos, familias, escala, gap vs padding) viven en `AGENTS.md` y se cargan siempre. Este archivo asume ese contexto y agrega la regla fina.

---

## Estructura del token de componente

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

**Orden de carpetas:** background → foreground → border → spacing.

---

## Regla de subcarpetas

> **1 solo valor → directo en la carpeta padre (sin subcarpeta).**
> **2+ valores → subcarpetas para diferenciar.**

```
1 corner:     comp/border/corner
2+ corners:   comp/border/corner/top-left, comp/border/corner/bottom-right

1 width:      comp/border/width
2 widths:     comp/border/width/primary, comp/border/width/emphasis

1 padding:    comp/spacing/padding
2 paddings:   comp/spacing/padding/vertical, comp/spacing/padding/horizontal

1 gap:        comp/spacing/gap
2 gaps:       comp/spacing/gap/content, comp/spacing/gap/items

1 color texto:  comp/foreground/typography/color
2+ colores:     comp/foreground/typography/color/default, comp/foreground/typography/color/error
```

---

## División principal (background y border/color)

La **prop que genera el cambio más estructural de color** define la primera carpeta:

| Prioridad | Prop | Valores típicos |
|---|---|---|
| 1 | Style | solid, ghost, outline, gradient, neutral, link |
| 2 | Selected | selected, unselected |
| 3 | Type | info, success, warning, error, neutral |
| 4 | State | default, hover, pressed, focus, disabled |

**Dentro** de la división principal se subdivide por estado o escala.

```
pill/background/solid/info              ← style + type
chip-filter/background/selected/hover   ← selected + state
avatar/background/hover                 ← solo state (sin prop principal)
text-field/background/default           ← cross (un solo valor)
```

---

## Typography

### Cross (misma tipografía en todas las variantes)

Props van directo sin carpeta de rol:

```
comp/foreground/typography/font-family
comp/foreground/typography/font-size
comp/foreground/typography/color
```

### Con roles distintos (label, placeholder, supporting-text)

Carpeta por rol. Color dentro del rol:

```
comp/foreground/typography/label/font-family
comp/foreground/typography/label/color/default
comp/foreground/typography/label/color/disabled
comp/foreground/typography/placeholder/font-family
comp/foreground/typography/placeholder/color/default
```

### Por tamaño (sm, md, lg)

Carpeta por size:

```
comp/foreground/typography/sm/font-family
comp/foreground/typography/md/font-family
comp/foreground/typography/lg/font-family
comp/foreground/typography/color/selected    ← color cross al size
```

---

## Naming de estados en componentes

Los tokens de componente usan **nombres de estado** (default, hover, disabled, error, selected) para subcarpetas de color, **aunque el token semántico al que apuntan sea `static`**.

```
Semántico:    "¿Este color ES interactivo o estático?"
Componente:   "¿CUÁNDO se aplica este color?"
```

Ejemplo válido:

```
text-field/foreground/typography/placeholder/color/disabled
  → apunta a: interactive/foreground/neutral/disabled/medium
```

---

## Feedback como estado en interactive

En `interactive/border/feedback/` y `interactive/foreground/feedback/`, el tipo de feedback (`error`, `warning`, `success`, `info`) **funciona como estado**. No necesita un slot de estado adicional. El borde cambia cuando el componente entra en ese estado.

---

## Las escalas son contextuales

`medium` de foreground ≠ `medium` de background en valor absoluto. Ambos son "el default de su contexto". No comparar valores hex entre escalas de contextos distintos para inferir errores.

---

## Dedup

- 4 paddings con el mismo token → 1 solo token de componente.
- 4 corners con el mismo token → 1 solo token de componente.
- Si mismo `proposedName` + mismo `variableId` → se colapsa a uno.

---

## Qué NO tokenizar

- Tokens de **instancias anidadas** (building blocks) — pertenecen al hijo, no al padre.
- **Grid/layout properties** internas (`counterAxisSpacing`, `primaryAxisSpacing`, etc.).
- Propiedades del **Component Set root** (structural).
- **Hardcoded values** en slots de placeholder (padding de alineación 3px en `.⛔ Placeholder-icon_slot`).

---

## Qué SÍ debe estar tokenizado

Todo valor visual aplicable a una capa del componente que sea:

- Un **color** (fill, stroke).
- Un **spacing** (padding, gap).
- Un **border** (corner radius, width).
- **Tipografía** (font-size, font-weight, font-family, letter-spacing, line-height).
- Un **asset size** (width/height de iconos/pictogramas).

Si una capa tiene un valor visual que NO es token → es un **hardcoded value** y debe tokenizarse.

---

## Validación de tokens aplicados

### Color correcto por contexto

| Elemento del componente | Debe usar token de tipo |
|---|---|
| Fondo que cambia con interacción | `interactive/background/...` |
| Fondo estático (no cambia) | `static/background/...` |
| Texto/icono que no cambia | `static/foreground/...` |
| Borde que cambia con estado | `interactive/border/...` |
| Overlay de estado (hover/pressed) | `interactive/opacity/...` |
| Decorativo (ilustración, brand) | `expressive/...` |

### Escala correcta

| Si el valor resuelve a primitivo | Debería ser escala |
|---|---|
| 950 (neutral) | `strong` |
| 700-900 | `bold` |
| 500-600 | `medium` |
| 100-400 | `subtle` |
| 25-50 | `quiet` |

### Errores comunes

| Error | Descripción |
|---|---|
| Foreground token aplicado como background | Token de `foreground` usado en un fill de contenedor |
| Background token aplicado como stroke | Token de `background` usado en strokes |
| Static token en componente interactivo con estados | Debería ser `interactive` si cambia por estado |
| Interactive token en componente sin estados | No tiene sentido — usar `static` |
| Token de opacidad sin overlay layer | Opacity tokens van en capas de overlay, no en el componente directamente |
| **Gap aplicado como padding** | Token `gap/gap-X` usado en una propiedad de padding |
| **Padding aplicado como gap** | Token `padding/padding-X` usado en una propiedad de `itemSpacing` (gap) |

---

## Focus

- El borde de focus tiene su propio token: `comp/border/color/focus`.
- Aplica como **cross** (no depende de style, selected ni type en la mayoría de componentes).
- Apunta a: `interactive/border/brand/primary/focus/medium` o similar.
- Si un componente tiene focus ring separado (`.⛔️ Focus-ring`), el token va en esa capa.

---

## Icon y Pictogram

```
comp/foreground/icon/color              ← un solo color
comp/foreground/icon/color/selected     ← si cambia por selección
comp/foreground/icon/color/disabled     ← si cambia por estado
comp/foreground/icon/size               ← tamaño del icono
```

Si el icono es una **instancia anidada**, no se tokeniza en el padre. Sus tokens los tiene el componente hijo.
