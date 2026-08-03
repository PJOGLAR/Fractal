# Tokens semánticos — Fractal DS

> Guía de la librería **Foundations**: qué es, cómo alimenta al resto del sistema y cómo elegir un token.
>
> El uso de cada token no está inventado: se infirió de **dónde está efectivamente aplicado** en Components (137), Templates (15) y Custom (8). Extracción del 3-ago-2026.

---

## Para qué sirve Foundations

Foundations es el **único archivo que define valores** en el sistema. Components, Templates y Custom Components no definen nada: consumen de acá.

```
┌─────────────────┐
│   FOUNDATIONS   │  ← el único lugar donde se define un valor
│                 │
│  Global color   │  primitivos: "los colores que existen"
│  Global dimension│
│  Global typography│
│        ↓        │
│  Color          │  semánticos: "para qué sirve cada color"
│  Typography     │
│  Spacing        │
│  Border · Asset │
└────────┬────────┘
         │ publica
    ┌────┴────┬──────────┐
    ▼         ▼          ▼
Components  Templates  Custom
```

**Por qué existe esta separación.** Si el morado de marca cambia, se toca un primitivo en Foundations y todo el sistema se actualiza solo. Si los componentes apuntaran directo al color, habría que revisar 137 componentes a mano.

La capa semántica agrega una segunda ventaja: permite que dos usos del mismo color evolucionen por separado. Hoy el borde de un botón y su fondo pueden ser el mismo morado; el día que el borde tenga que ser más oscuro, se cambia solo ese token.

### Las 10 colecciones

| Colección | Vars | Capa | Contiene |
|---|---|---|---|
| `Global color` | 233 | primitiva | La paleta cruda: `core/purple/500`, `core/neutral/950` |
| `Global dimension` | 53 | primitiva | Números: `spacing/100`, `corner/300`, `width/100` |
| `Global typography` | 38 | primitiva | Familias, pesos, tamaños base |
| `Color` | 253 | **semántica** | Lo que se aplica a componentes |
| `Typography` | 160 | **semántica** | Estilos completos por rol |
| `Spacing` | 48 | **semántica** | `gap/*` y `padding/*` |
| `Border` | 15 | **semántica** | `border/corner/*` y `border/width/*` |
| `Asset` | 15 | **semántica** | Tamaños de iconos, ilustraciones, pictogramas |
| `Screen size` | 2 | semántica | Breakpoints |
| `Density mode` | 1 | semántica | Padding vertical según densidad |

**Regla:** a un componente se le aplican tokens de las colecciones semánticas. Nunca un `Global/*`.

---

## Anatomía del nombre

```
[contexto] / [elemento] / [familia] / [sub-familia?] / [estado?] / [escala]
```

```
interactive / background / brand    / —     / hover / bold
static      / foreground / neutral  / —     / —     / strong
static      / border     / feedback / error / —     / bold
```

Los segmentos opcionales aparecen solo cuando la familia los pide. `neutral` no lleva sub-familia; `feedback` sí (`error`, `warning`, `success`, `info`).

### Los tres contextos

| Contexto | Cuándo | Pregunta |
|---|---|---|
| `static` | El color no cambia por interacción | ¿Se ve igual siempre? |
| `interactive` | El color responde a estados | ¿Cambia al tocar, hover, deshabilitar? |
| `expressive` | Decorativo o ilustrativo | ¿Es parte de una ilustración o gradiente? |

El error más común es usar `static` en un elemento que sí cambia con la interacción. Si el componente tiene variantes `State=`, sus colores van en `interactive`.

### Elementos

| Elemento | Propiedad de Figma | Se aplica en |
|---|---|---|
| `background` | `fills` de frames | Fondos de contenedores |
| `foreground` | `fills` de texto y vectores | Texto e iconos |
| `border` | `strokes` | Bordes y divisores |
| `opacity` | `fills` / `effects` de capa overlay | Capas de estado |

### Familias

| Familia | Color | Uso |
|---|---|---|
| `brand/primary` | purple | Acción principal, identidad |
| `brand/secondary` | cyan | Acento secundario |
| `neutral` | grises | Texto, fondos, bordes por defecto |
| `feedback/info` · `success` · `warning` · `error` | blue · green · orange · red | Estados del sistema |

### Escala

```
strong  >  bold  >  medium  >  subtle  >  quiet
```

| Escala | Rango primitivo | Disponible en |
|---|---|---|
| `strong` | 950 | solo `neutral` |
| `bold` | 700–950 | todas |
| `medium` | 500–600 | todas |
| `subtle` | 100–400 | todas |
| `quiet` | 25–50 | todas |

Las escalas son **contextuales, no absolutas**: `medium` en foreground y `medium` en background no son el mismo color. Cada uno es "el valor por defecto de su contexto".

---

# Catálogo con uso real

La columna **Uso** describe dónde está aplicado hoy, con la cantidad de usos y las capas donde aparece. Es descripción, no prescripción: refleja el estado del sistema al 3-ago-2026.

## static/foreground — texto e iconos que no cambian

| Token | Usos | Uso inferido |
|---|---|---|
| `static/foreground/neutral/strong` | 163 | **El token de texto más usado del sistema.** Títulos y contenido principal. Capas `Title`, `Label`, `Description`, `Currency`. Presente en Card-amount, Feedback-screen, Onboarding-screen, Summary-screen |
| `static/foreground/neutral/bold` | 94 | Texto de cuerpo e iconos. Capas `Headline`, `Description`, `Vector`. Card_challenge, Card-container, Stepper, Alert |
| `static/foreground/neutral/quiet` | 86 | **Texto sobre fondo oscuro o de color.** Capas `Label`, `Title`, `Status`. Card-Personal-Pay, Payment-card, Banner-sm/md |
| `static/foreground/brand/primary/medium` | 62 | Iconos de marca. Capa `Vector` mayormente. Accordion, Asset-container, Card, Carrousel |
| `static/foreground/neutral/medium` | 32 | **Placeholder y metadata de inputs.** Capas `Placeholder`, `Status`, `Detail`. Text-area, Input-amount, Input-phone, Text-field, Select |
| `static/foreground/feedback/error/bold` | 22 | Mensajes de error de formulario. Capas `Supporting text`, `Error message`. Todos los inputs |
| `static/foreground/neutral/subtle` | 15 | **Supporting text de inputs** y jerarquía mínima. Capas `Supporting text`, `Handle`. Select, Text-area, Search |
| `static/foreground/feedback/success/bold` | 13 | Texto e iconos de confirmación. Pill, Alert, Snackbar |
| `static/foreground/feedback/info/bold` | 5 | Texto e iconos informativos. Pill, Alert, Snackbar |
| `static/foreground/feedback/warning/bold` | 3 | Texto e iconos de advertencia. Pill, Alert, Snackbar |

**Jerarquía de texto que se desprende de los datos:** `strong` para títulos → `bold` para cuerpo → `medium` para placeholder y metadata → `subtle` para supporting text. `quiet` no es parte de la escala descendente: es el inverso, para fondos oscuros.

## static/background — fondos que no cambian

| Token | Usos | Uso inferido |
|---|---|---|
| `static/background/neutral/quiet` | 119 | **Fondo base de todas las superficies.** Capas `Background`, `Asset-container`. Card-container, Pop-up, Backdrop |
| `static/background/brand/primary/subtle` | 82 | Contenedores de asset y **skeletons**. Capas `Skeleton-component`, `Leading content`, `Progress-bar_indicator` |
| `static/background/feedback/error/bold` | 50 | **Badges y notificaciones.** Capas `Badge`, `Content=number, Variant=notification`. Es el patrón de "punto rojo" |
| `static/background/brand/primary/medium` | 35 | Fondo de marca pleno. Label, Banner-lg, Loader, Tooltip-contextual |
| `static/background/brand/primary/quiet` | 32 | **Skeletons de carga** y fondos muy sutiles. Skeleton-content-asset, Skeleton-content-text |
| `static/background/feedback/info/bold` | 10 | Badges informativos. Badge, Pill, Alert |
| `static/background/feedback/success/bold` | 10 | Badges de éxito y progreso completado. Progress-bar, Pill |
| `static/background/neutral/bold` | 8 | Contraste alto. Carrousel (dots), Stepper-dot |
| `static/background/feedback/*/quiet` | 3–7 | **Fondo de mensajes** en Alert y Snackbar, con texto oscuro encima |
| `static/background/brand/secondary/medium` | 3 | Progress-bar en estado "balance ok" |
| `static/background/brand/secondary/subtle` | 2 | Push-notification |

**Patrón de feedback confirmado:** `quiet` para el fondo del mensaje (Alert, Snackbar), `bold` para badges e indicadores. Los dos no se mezclan.

## static/border

| Token | Usos | Uso inferido |
|---|---|---|
| `static/border/neutral/quiet` | 58 | **Borde apenas perceptible y divisores.** Label, Alert, Badge, Banner-md |
| `static/border/brand/secondary` | 43 | **Bordes de contenedores de asset.** Asset-container, Card-container, Payment-card. Ver nota de deuda: apunta a purple, no cyan |
| `static/border/brand/primary` | 27 | Bordes de marca. Segmented-control, Stepper-vertical, Accordion |
| `static/border/neutral/medium` | 6 | Contraste medio. Card-amount, Pill outline |
| `static/border/feedback/*/bold` | 3–5 | Bordes de estado en Pill, Alert, Snackbar, Text-area |
| `static/border/neutral/subtle` | 1 | Card en estado default |

## static/opacity

| Token | Usos | Uso inferido |
|---|---|---|
| `static/opacity/brand/bold` | 27 | **Sombras y elevación de marca.** Propiedad `effects`. Card-container, Pop-up, Snackbar, Tooltip |
| `static/opacity/neutral/subtle` | 15 | Sombras neutras. Pop-up, Snackbar, Backdrop |
| `static/opacity/brand/medium` | 1 | Nav-bar (custom) |

Nótese que se aplican como `effects`, no como `fills`: son sombras, no capas de overlay.

## interactive/background — fondos con estado

| Token | Usos | Uso inferido |
|---|---|---|
| `interactive/background/brand/default/medium` | 113 | **El fondo del botón primario.** Button, Button-icon, Chip, Chip-select, Banner-md |
| `interactive/background/neutral/hover/subtle` | 95 | **Hover de botones neutrales.** Capas `State=hover, Style=neutral`. Button, Button-icon, Button-toggle, Progress-bar |
| `interactive/background/neutral/default/quiet` | 90 | Fondo por defecto de botones ghost e inputs. Capas `Input wrapper`, `Button-icon` |
| `interactive/background/brand/hover/quiet` | 73 | **Hover de botones ghost y solid inverse.** Capas `State=hover, Style=ghost` / `Style=solid, Appearance=inverse` |
| `interactive/background/neutral/disabled/subtle` | 61 | **Fondo de deshabilitado.** Capas `State=disabled, Style=solid`. Button, Chip, Avatar |
| `interactive/background/brand/default/quiet` | 59 | **Botones tonal.** Capas `Style=tonal, Appearance=default` |
| `interactive/background/brand/default/bold` | 43 | Botones tonal inverse. Capas `Style=tonal, Appearance=inverse` |
| `interactive/background/brand/hover/bold` | 34 | Hover de botones solid. Capas `State=hover, Style=solid` |
| `interactive/background/brand/default/subtle` | 27 | **Avatares de monograma** e indicadores. Avatar, Input-OTP, Segmented-control |
| `interactive/background/brand/pressed/bold` | 20 | Pressed de chips y pins. Chip, Chip-select, Map-pin |
| `interactive/background/neutral/hover/bold` | 16 | Hover neutral inverse |
| `interactive/background/brand/pressed/subtle` | 10 | Pressed de avatar y cards |

**Lo que muestran los datos:** el sistema de botones usa una matriz `Style` × `Appearance` × `State`. `solid`/`ghost`/`tonal`/`neutral`/`link` × `default`/`inverse`. Esa combinatoria explica los volúmenes altos.

## interactive/foreground — texto e iconos con estado

| Token | Usos | Uso inferido |
|---|---|---|
| `interactive/foreground/brand/primary/default/medium` | 76 | **Texto e iconos de acción de marca.** Capas `Label`, `Vector`. Banner-xl/lg, Card, Nav-bar |
| `interactive/foreground/neutral/default/strong` | 51 | **Iconos y labels de máximo contraste.** Alert, Card-amount, Button, Chip-select, Button-group |
| `interactive/foreground/neutral/default/quiet` | 50 | **Texto sobre botón primario** (fondo de color). Video-card, Button, Chip |
| `interactive/foreground/neutral/disabled/bold` | 20 | Texto deshabilitado, variante de más contraste |
| `interactive/foreground/neutral/disabled/subtle` | 17 | Texto y placeholder deshabilitado. Button, Select, Currency-converter |
| `interactive/foreground/brand/primary/default/bold` | 13 | Acción de marca con más peso |
| `interactive/foreground/neutral/default/medium` | 10 | Labels secundarios interactivos |
| `interactive/foreground/brand/primary/pressed/bold` | 7 | Pressed de acción de marca (solo en componentes privados) |
| `interactive/foreground/neutral/hover/medium` | 1 | Hover de label. Prácticamente sin adopción |

## interactive/border — bordes con estado

| Token | Usos | Uso inferido |
|---|---|---|
| `interactive/border/brand/primary/pressed/bold` | 73 | **Borde de botón en pressed.** Capas `State=pressed, Style=solid` |
| `interactive/border/brand/primary/pressed/subtle` | 52 | Pressed de outline y ghost |
| `interactive/border/brand/primary/default/medium` | 48 | **Borde de botón secundario.** Capas `Secondary button`, `Switch wrapper`, `Style=outline` |
| `interactive/border/neutral/default/medium` | 36 | **Borde de inputs.** Capas `Input wrapper`, `Support line`. Todos los campos de formulario |
| `interactive/border/brand/primary/focus/medium` | 29 | **Focus ring.** Capa `.⛔️ Focus-ring` en 28 componentes. Es el token de foco del sistema |
| `interactive/border/neutral/default/quiet` | 29 | Borde de botón outline inverse |
| `interactive/border/neutral/disabled/subtle` | 29 | Borde deshabilitado |
| `interactive/border/feedback/error/bold` | 17 | **Input en error.** Capas `Input wrapper`, `State=error` |
| `interactive/border/brand/primary/hover/bold` | 16 | Hover de outline default |
| `interactive/border/brand/primary/hover/subtle` | 14 | Hover de outline inverse |
| `interactive/border/brand/secondary/active/medium` | 12 | **Estado seleccionado de Accordion y Row-item.** Capas `Selected=true` |
| `interactive/border/feedback/error/subtle` | 8 | Focus ring en estado de error |
| `interactive/border/brand/primary/default/subtle` | 7 | Cards elevadas. Button-card, Shortcut-asset |
| `interactive/border/neutral/hover/bold` | 5 | Hover de inputs |
| `interactive/border/brand/primary/focus/subtle` | 3 | Focus ring atenuado |

**Nota sobre feedback en `interactive/border`:** el tipo (`error`) funciona como estado. No lleva slot de estado adicional.

## interactive/opacity — capas de estado

| Token | Usos | Uso inferido |
|---|---|---|
| `interactive/opacity/brand/hover` | 20 | **Capa `Hover layer`** sobre banners y avatares |
| `interactive/opacity/brand/pressed` | 19 | **Capa `Pressed layer`** / `Layer pressed` |
| `interactive/opacity/neutral/disabled` | 7 | **Capa `Disabled layer`** |
| `interactive/opacity/neutral/default/medium` | 2 | Fondo de overlay. Button-toggle, Stories |
| `interactive/opacity/neutral/default/bold` | 1 | Overlay intenso |

Los nombres de capa (`Hover layer`, `Pressed layer`, `Disabled layer`) confirman el patrón: estos tokens van en una capa dedicada encima del componente, no en el componente. Es el mecanismo que permite que dos estados compartan color de fondo y se distingan igual.

## expressive — decorativo

Hay **dos estructuras distintas**, con propósitos separados:

### `expressive/[color]/[número]` — gradientes y fondos de marca

| Token | Usos | Uso inferido |
|---|---|---|
| `expressive/violet/500` | 15 | Gradientes de banner y Label. Capas `Style=gradient, Color=…` |
| `expressive/violet/50` | 12 | Mini-banners. Card-amount, Feedback-screen |
| `expressive/pink/600` | 10 | Gradientes magenta. Banner-sm/md/xl, Label |
| `expressive/violet/200` | 8 | Bordes y fondos de mini-banner |
| `expressive/emerald/500` · `amber/600` · `teal/900` · `coral/900` | 5–6 | Gradientes por color en Label |
| `expressive/iron/500` · `iron/300` | 1–2 | Estados `paused` y `pending` en Card-Personal-Pay |
| `expressive/violet/900` · `700` · `100` | 2–4 | Estados de Card-Personal-Pay |

Escala numérica, igual que los primitivos. Se usa para **gradientes y estados de tarjeta**, no para UI funcional.

### `expressive/illustration/[familia]/[escala]` — ilustraciones

Familias: `amber` · `bourbon` · `coral` · `emerald` · `lavender` · `magenta` · `melon` · `sapphire` · `teal` · `violet` × 4 intensidades (`quiet`, `subtle`, `medium`, `bold`).

En uso hoy: `violet/medium` (5), `violet/quiet` (4), `sapphire/bold` (4), `violet/bold` (2), `violet/subtle`, `emerald/bold`, `coral/medium`, `amber/medium` (1 cada uno).

**No usar en UI funcional:** no están pensados para garantizar contraste de texto.

---

## Tokens definidos sin uso: 143

Casi todos son de `expressive` (la paleta está completa pero se usa una fracción). Los tres de UI que no tienen adopción:

| Token | Nota |
|---|---|
| `interactive/foreground/brand/secondary/default/bold` | La familia cyan está definida pero no adoptada |
| `interactive/foreground/brand/secondary/default/medium` | ídem |
| `static/foreground/brand/primary/bold` | Sin uso |

Decidir si se aplican o se deprecan.

---

# Cómo elegir un token

```
1. ¿El color cambia con la interacción?
   NO  → static
   SÍ  → interactive
   Es decorativo / gradiente / ilustración → expressive

2. ¿Qué parte del componente es?
   Fondo de contenedor → background
   Texto o icono       → foreground
   Borde o divisor     → border
   Capa de estado      → opacity

3. ¿Qué comunica?
   Acción principal / identidad → brand/primary
   Acento                       → brand/secondary
   Neutro / por defecto         → neutral
   Estado del sistema           → feedback/[tipo]

4. ¿Cuánto peso visual necesita?
   Máximo contraste (solo neutral) → strong
   Alto                            → bold
   Por defecto                     → medium
   Bajo                            → subtle
   Mínimo / inverso                → quiet
```

## Casos resueltos

| Necesito | Token | Respaldo |
|---|---|---|
| Título de una card | `static/foreground/neutral/strong` | 163 usos, capa `Title` |
| Texto de cuerpo | `static/foreground/neutral/bold` | 94 usos, capa `Description` |
| Placeholder de un input | `static/foreground/neutral/medium` | 32 usos, capa `Placeholder` |
| Supporting text de un input | `static/foreground/neutral/subtle` | 15 usos, capa `Supporting text` |
| Texto sobre fondo oscuro | `static/foreground/neutral/quiet` | 86 usos |
| Fondo de superficie | `static/background/neutral/quiet` | 119 usos, capa `Background` |
| Fondo de botón primario | `interactive/background/brand/default/medium` | 113 usos |
| Texto sobre botón primario | `interactive/foreground/neutral/default/quiet` | 50 usos |
| Icono de botón ghost | `interactive/foreground/neutral/default/strong` | 51 usos |
| Hover de botón neutral | `interactive/background/neutral/hover/subtle` | 95 usos |
| Fondo deshabilitado | `interactive/background/neutral/disabled/subtle` | 61 usos |
| Borde de un input | `interactive/border/neutral/default/medium` | 36 usos, capa `Input wrapper` |
| Focus ring | `interactive/border/brand/primary/focus/medium` | 29 usos, capa `.⛔️ Focus-ring` |
| Input en error | `interactive/border/feedback/error/bold` | 17 usos |
| Fondo de mensaje de error | `static/background/feedback/error/quiet` | Alert, Snackbar |
| Badge de notificación | `static/background/feedback/error/bold` | 50 usos, capa `Badge` |
| Skeleton de carga | `static/background/brand/primary/quiet` | 32 usos |
| Sombra de elevación | `static/opacity/brand/bold` | 27 usos, `effects` |
| Capa de hover | `interactive/opacity/brand/hover` | 20 usos, capa `Hover layer` |
| Divisor | `static/border/neutral/quiet` | 58 usos |

---

# Errores comunes

| Error | Por qué está mal | Correcto |
|---|---|---|
| Aplicar un primitivo (`core/purple/500`) directo | Rompe la cadena de alias | El semántico equivalente |
| `static` en algo que cambia por estado | El componente no puede reflejar estados | `interactive/...` |
| `interactive` en algo que nunca cambia | Sugiere interactividad inexistente | `static/...` |
| Token de `foreground` en un fill de contenedor | Los rangos de contraste no coinciden | `background/...` |
| Token de `background` en un `stroke` | ídem | `border/...` |
| `opacity` aplicado al componente | Va en capa dedicada | Crear `Hover layer` / `Pressed layer` |
| `expressive` en UI funcional | No garantiza contraste de texto | `static` o `interactive` |
| Token de `gap` en un padding | Son propiedades distintas | `gap/` solo en `itemSpacing` |
| Definir una variable en el archivo de componentes | Duplica la fuente de verdad | Pedirla en Foundations |

---

# Deuda conocida

La auditoría completa está en **[deuda-tokens.md](./deuda-tokens.md)**. Estado al 3-ago-2026:

**Lo que está bien:** los 322 tokens aplicados resuelven a una variable existente y a un valor correcto. No hay bindings rotos ni colores hardcodeados.

**Lo que conviene saber antes de aplicar:**

- **Nombres desactualizados en cache (57 usos).** Varios componentes muestran nombres viejos (`main/focus/medium`, `tertiary-subtle`) que apuntan a la variable correcta. Se resuelve refrescando la librería, no rebindeando. Los nombres vigentes son `primary/*` y la escala `strong > bold > medium > subtle > quiet`.
- **`static/border/brand/secondary` apunta a purple** cuando el resto de la familia `brand/secondary` es cyan. Verificar antes de usarlo.
- **20 variables vienen de colecciones ajenas a Foundations** (`Semantic dimension`, `Dimension`, `Primitives`…), sobre todo en dimensión y spacing. No son seleccionables desde el panel. Pendiente identificar el archivo de origen.

**Lo que no es deuda,** aunque a veces se reporta como tal: que dos tokens semánticos compartan primitivo. `focus` y `default` pueden ser el mismo morado y distinguirse por una capa de overlay o un stroke extra. Ver la sección de `interactive/opacity` arriba: los nombres de capa (`Hover layer`, `Pressed layer`) muestran ese mecanismo funcionando.
