# Tokens semánticos — Fractal DS

> Los tokens semánticos son la capa que se aplica a los componentes. Describen **el propósito** de un valor, no el valor en sí.
>
> Datos de la colección `Color` de Foundations · extracción del **3-ago-2026** · 81 tokens semánticos + 40 de ilustración
> Uso verificado contra los bindings reales de Components (137), Templates (15) y Custom (8).

---

## Qué es un token semántico

En la cadena de alias del DS, el semántico es la capa intermedia:

```
Primitivo          →   Semántico                              →   Componente
core/purple/500        interactive/background/brand/default/medium   button/background/solid/default
"el color"             "para qué sirve"                             "dónde se aplica"
```

**Regla base:** nunca apliques un primitivo directo a un componente. Si necesitás un color, existe un semántico que lo expresa; si no existe, hay que crearlo.

**Por qué importa:** si mañana el morado de marca cambia, se toca un primitivo y todo el sistema se actualiza. Si los componentes apuntaran a primitivos, habría que revisar cada uno.

---

## Anatomía del nombre

```
[contexto] / [elemento] / [familia] / [sub-familia?] / [estado?] / [escala]
```

```
interactive / background / brand / — / hover / bold
static      / foreground / neutral / — / —    / strong
static      / border     / feedback / error  / —    / bold
```

Los segmentos opcionales aparecen solo cuando la familia los requiere. `neutral` no tiene sub-familia; `feedback` sí (`error`, `warning`, `success`, `info`).

---

## Los tres contextos

La primera decisión y la más importante.

| Contexto | Cuándo usarlo | Pregunta clave |
|---|---|---|
| `static` | El color no cambia por interacción | ¿Se ve igual siempre? |
| `interactive` | El color responde a estados | ¿Cambia al tocar, hover, deshabilitar? |
| `expressive` | Decorativo o ilustrativo | ¿Es parte de una ilustración o gráfico? |

**El error más común:** usar `static` en un elemento que sí cambia con la interacción. Si el componente tiene estados (`hover`, `pressed`, `disabled`), sus colores deben ser `interactive`.

El inverso también es error: un texto que nunca cambia no necesita `interactive`.

---

## Elementos

| Elemento | Se aplica en | Propiedad de Figma |
|---|---|---|
| `background` | Fondos de contenedores | `fills` de frames |
| `foreground` | Texto e iconos | `fills` de texto y vectores |
| `border` | Bordes y divisores | `strokes` |
| `opacity` | Capas de overlay | `fills` de capa overlay |

**Cuidado con `opacity`:** va en una capa de overlay dedicada, no en el componente directamente.

---

## Familias

| Familia | Color base | Uso |
|---|---|---|
| `brand/primary` | purple | Acción principal, identidad |
| `brand/secondary` | cyan | Acento secundario |
| `neutral` | grises | Texto, fondos, bordes por defecto |
| `feedback/info` | blue | Información |
| `feedback/success` | green | Confirmación |
| `feedback/warning` | orange | Advertencia |
| `feedback/error` | red | Error, destructivo |

`neutral` es cross: no lleva sub-familia.

---

## Escala de intensidades

```
strong  >  bold  >  medium  >  subtle  >  quiet
```

| Escala | Rango primitivo | Disponible en |
|---|---|---|
| `strong` | 950 | Solo `neutral` |
| `bold` | 700–950 | Todas |
| `medium` | 500–600 | Todas |
| `subtle` | 100–400 | Todas |
| `quiet` | 25–50 | Todas |

**Las escalas son contextuales, no absolutas.** `medium` en foreground y `medium` en background no son el mismo color: cada uno es "el valor por defecto de su contexto".

---

# Catálogo

## static/background (15)

Fondos que no cambian con la interacción.

| Token | Primitivo | Uso |
|---|---|---|
| `static/background/neutral/quiet` | `core/neutral/25` | Fondo base de superficies y cards |
| `static/background/neutral/bold` | `core/neutral/700` | Fondo de contraste alto (overlays sólidos) |
| `static/background/brand/primary/quiet` | `core/purple/50` | Fondo de marca muy sutil |
| `static/background/brand/primary/subtle` | `core/purple/100` | Fondo de marca sutil, contenedores de asset |
| `static/background/brand/primary/medium` | `core/purple/500` | Fondo de marca pleno |
| `static/background/brand/secondary/subtle` | `core/cyan/100` | Fondo acento sutil |
| `static/background/brand/secondary/medium` | `core/cyan/600` | Fondo acento pleno |
| `static/background/feedback/error/quiet` | `core/red/50` | Fondo de mensaje de error |
| `static/background/feedback/error/bold` | `core/red/700` | Badge / indicador de error |
| `static/background/feedback/info/quiet` | `core/blue/50` | Fondo de mensaje informativo |
| `static/background/feedback/info/bold` | `core/blue/700` | Badge informativo |
| `static/background/feedback/success/quiet` | `core/green/50` | Fondo de mensaje de éxito |
| `static/background/feedback/success/bold` | `core/green/700` | Badge de éxito |
| `static/background/feedback/warning/quiet` | `core/orange/50` | Fondo de advertencia |
| `static/background/feedback/warning/bold` | `core/orange/700` | Badge de advertencia |

**Patrón de feedback:** `quiet` para el fondo del mensaje (con texto oscuro encima), `bold` para badges e indicadores (con texto claro encima).

## static/foreground (11)

Texto e iconos que no cambian con la interacción.

| Token | Primitivo | Uso |
|---|---|---|
| `static/foreground/neutral/strong` | `core/neutral/950` | **Títulos y texto principal** |
| `static/foreground/neutral/bold` | `core/neutral/800` | Texto de cuerpo, iconos |
| `static/foreground/neutral/medium` | `core/neutral/600` | Texto secundario, metadata, timestamps |
| `static/foreground/neutral/subtle` | `core/neutral/400` | Texto deshabilitado o de muy baja jerarquía |
| `static/foreground/neutral/quiet` | `core/neutral/25` | Texto sobre fondo oscuro (inverso) |
| `static/foreground/brand/primary/medium` | `core/purple/500` | Iconos de marca |
| `static/foreground/brand/primary/bold` | `core/purple/900` | Texto de marca de alto contraste |
| `static/foreground/feedback/error/bold` | `core/red/700` | Texto y iconos de error |
| `static/foreground/feedback/info/bold` | `core/blue/700` | Texto y iconos informativos |
| `static/foreground/feedback/success/bold` | `core/green/700` | Texto y iconos de éxito |
| `static/foreground/feedback/warning/bold` | `core/orange/700` | Texto y iconos de advertencia |

**Jerarquía tipográfica:** `strong` para títulos → `bold` para cuerpo → `medium` para secundario → `subtle` para terciario.

## static/border (9)

| Token | Primitivo | Uso |
|---|---|---|
| `static/border/neutral/quiet` | `core/neutral/25` | Borde apenas perceptible, divisores suaves |
| `static/border/neutral/subtle` | `core/neutral/400` | Borde sutil |
| `static/border/neutral/medium` | `core/neutral/600` | Borde de contraste medio |
| `static/border/brand/primary` | `core/purple/500` | Borde de marca |
| `static/border/brand/secondary` | `core/purple/200` | ⚠️ Ver deuda conocida |
| `static/border/feedback/error/bold` | `core/red/700` | Borde de error |
| `static/border/feedback/info/bold` | `core/blue/700` | Borde informativo |
| `static/border/feedback/success/bold` | `core/green/700` | Borde de éxito |
| `static/border/feedback/warning/bold` | `core/orange/700` | Borde de advertencia |

## static/opacity (3)

| Token | Primitivo | Uso |
|---|---|---|
| `static/opacity/brand/medium` | `opacity/purple/600` | Overlay de marca medio |
| `static/opacity/brand/bold` | `opacity/purple/800` | Overlay de marca |
| `static/opacity/neutral/subtle` | `opacity/gray/400` | Overlay neutro sutil |

## interactive/background (12)

Fondos que responden a estados.

| Token | Primitivo | Estado |
|---|---|---|
| `interactive/background/brand/default/quiet` | `core/purple/50` | default |
| `interactive/background/brand/default/subtle` | `core/purple/100` | default |
| `interactive/background/brand/default/medium` | `core/purple/500` | **default — botón primario** |
| `interactive/background/brand/default/bold` | `core/purple/700` | default |
| `interactive/background/brand/hover/quiet` | `core/purple/50` | hover |
| `interactive/background/brand/hover/bold` | `core/purple/700` | hover |
| `interactive/background/brand/pressed/subtle` | `core/purple/300` | pressed |
| `interactive/background/brand/pressed/bold` | `core/purple/900` | pressed |
| `interactive/background/neutral/default/quiet` | `core/neutral/25` | default |
| `interactive/background/neutral/hover/subtle` | `core/neutral/100` | hover |
| `interactive/background/neutral/hover/bold` | `core/neutral/700` | hover |
| `interactive/background/neutral/disabled/subtle` | `core/neutral/100` | disabled |

## interactive/foreground (11)

| Token | Primitivo | Estado |
|---|---|---|
| `interactive/foreground/neutral/default/strong` | `core/neutral/950` | **default — iconos y labels** |
| `interactive/foreground/neutral/default/medium` | `core/neutral/600` | default |
| `interactive/foreground/neutral/default/quiet` | `core/neutral/25` | default inverso (sobre fondo oscuro) |
| `interactive/foreground/neutral/hover/medium` | `core/neutral/600` | hover |
| `interactive/foreground/neutral/disabled/bold` | `core/neutral/800` | disabled |
| `interactive/foreground/neutral/disabled/subtle` | `core/neutral/400` | disabled |
| `interactive/foreground/brand/primary/default/medium` | `core/purple/500` | **default — acción de marca** |
| `interactive/foreground/brand/primary/default/bold` | `core/purple/900` | default |
| `interactive/foreground/brand/primary/pressed/bold` | `core/purple/900` | pressed |
| `interactive/foreground/brand/secondary/default/medium` | `core/cyan/600` | default |
| `interactive/foreground/brand/secondary/default/bold` | `core/cyan/900` | default |

## interactive/border (15)

| Token | Primitivo | Estado |
|---|---|---|
| `interactive/border/neutral/default/quiet` | `core/neutral/25` | default |
| `interactive/border/neutral/default/medium` | `core/neutral/600` | default — inputs |
| `interactive/border/neutral/hover/bold` | `core/neutral/700` | hover |
| `interactive/border/neutral/disabled/subtle` | `core/neutral/400` | disabled |
| `interactive/border/brand/primary/default/subtle` | `core/purple/200` | default |
| `interactive/border/brand/primary/default/medium` | `core/purple/500` | default |
| `interactive/border/brand/primary/hover/subtle` | `core/purple/200` | hover |
| `interactive/border/brand/primary/hover/bold` | `core/purple/900` | hover |
| `interactive/border/brand/primary/pressed/subtle` | `core/purple/200` | pressed |
| `interactive/border/brand/primary/pressed/bold` | `core/purple/900` | pressed |
| `interactive/border/brand/primary/focus/subtle` | `core/purple/100` | focus |
| `interactive/border/brand/primary/focus/medium` | `core/purple/500` | **focus — focus ring** |
| `interactive/border/brand/secondary/active/medium` | `core/cyan/500` | active |
| `interactive/border/feedback/error/subtle` | `core/red/200` | error |
| `interactive/border/feedback/error/bold` | `core/red/700` | error |

**Nota sobre feedback en `interactive`:** en `interactive/border/feedback/` el tipo de feedback (`error`) **funciona como estado**. No lleva slot de estado adicional.

## interactive/opacity (5)

Capas de overlay para estados.

| Token | Primitivo | Uso |
|---|---|---|
| `interactive/opacity/brand/hover` | `opacity/purple/700` | Overlay hover de marca |
| `interactive/opacity/brand/pressed` | `opacity/purple/900` | Overlay pressed de marca |
| `interactive/opacity/neutral/disabled` | `opacity/gray/50` | Overlay de deshabilitado |
| `interactive/opacity/neutral/default/medium` | `opacity/gray/500` | Overlay neutro |
| `interactive/opacity/neutral/default/bold` | `opacity/gray/900` | Overlay neutro intenso |

## expressive/illustration (40)

Paleta decorativa para ilustraciones. 10 familias × 4 intensidades (`quiet`, `subtle`, `medium`, `bold`).

Familias: `amber` · `bourbon` · `coral` · `emerald` · `lavender` · `magenta` · `melon` · `sapphire` · `teal` · `violet`

```
expressive/illustration/[familia]/[quiet|subtle|medium|bold]
```

**Uso exclusivo en ilustraciones y gráficos decorativos.** No usar para UI funcional: no están pensados para garantizar contraste de texto.

---

# Cómo elegir un token

```
1. ¿El color cambia con la interacción?
   NO  → static
   SÍ  → interactive
   Es decorativo/ilustración → expressive

2. ¿Qué parte del componente es?
   Fondo de contenedor → background
   Texto o icono       → foreground
   Borde o divisor     → border
   Capa de overlay     → opacity

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

## Ejemplos resueltos

| Necesito | Token |
|---|---|
| Título de una card | `static/foreground/neutral/strong` |
| Texto secundario / fecha | `static/foreground/neutral/medium` |
| Fondo de botón primario | `interactive/background/brand/default/medium` |
| Texto sobre botón primario | `interactive/foreground/neutral/default/quiet` |
| Icono de un botón ghost | `interactive/foreground/neutral/default/strong` |
| Borde de un input | `interactive/border/neutral/default/medium` |
| Focus ring | `interactive/border/brand/primary/focus/medium` |
| Input en error | `interactive/border/feedback/error/bold` |
| Fondo de mensaje de error | `static/background/feedback/error/quiet` |
| Badge de notificación | `static/background/feedback/error/bold` |
| Texto de un elemento deshabilitado | `interactive/foreground/neutral/disabled/subtle` |
| Divisor | `static/border/neutral/quiet` |

---

# Errores comunes

| Error | Por qué está mal | Correcto |
|---|---|---|
| Usar un primitivo (`core/purple/500`) directo | Rompe la cadena de alias | Usar el semántico equivalente |
| `static` en algo que cambia por estado | El componente no puede reflejar estados | `interactive/...` |
| `interactive` en algo que nunca cambia | Sugiere interactividad inexistente | `static/...` |
| Token de `foreground` en un fill de contenedor | Los rangos de contraste no coinciden | `background/...` |
| Token de `background` en un `stroke` | Ídem | `border/...` |
| `opacity` aplicado al componente | Debe ir en capa de overlay | Crear capa de overlay |
| `expressive` en UI funcional | No garantiza contraste de texto | Usar `static` o `interactive` |
| Token de `gap` en un padding (o viceversa) | Son propiedades distintas | `gap/` solo en `itemSpacing` |

---

# Deuda conocida

La auditoría de los tokens aplicados contra los definidos está en **[deuda-tokens.md](./deuda-tokens.md)**.

Lo que conviene saber antes de aplicar tokens hoy:

- **Focus ring:** hay tres nombres circulando (`interactive/border/brand/focus`, `focus-medium`, `main/focus/medium`) y ninguno existe. Usá `interactive/border/brand/primary/focus/medium`.
- **Escalas `secondary` / `tertiary`:** son nomenclatura derogada. La escala vigente es `strong > bold > medium > subtle > quiet`.
- **`main` no es sub-familia válida.** La correcta es `primary`.
- **`neutral` no lleva sub-familia.** `static/background/neutral/primary-medium` no es válido.
- **`static/border/brand/secondary`** apunta a purple cuando debería ser cyan. Verificar antes de usarlo.
- **Dos colisiones de estado sin resolver:** `disabled` = `hover` en background neutral, y `focus` = `default` en border de marca.
