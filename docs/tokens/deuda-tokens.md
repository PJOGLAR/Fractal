# Deuda de tokens — auditoría

> Extracción del **3-ago-2026**. Cruza las 686 variables de `Foundations` contra los 322 tokens efectivamente bindeados en Components (137), Templates (15) y Custom (8).
>
> **Método:** la comparación se hace por `key` de variable, no por nombre. El `key` es el identificador estable de Figma y no cambia al renombrar, así que permite distinguir un token mal aplicado de un token bien aplicado cuyo nombre quedó viejo en el cache del archivo consumidor.

---

## Resumen

| Hallazgo | Nombres | Usos | Severidad |
|---|---|---|---|
| Tokens aplicados que no existen | 0 | 0 | ✅ — |
| Valores hardcodeados | 0 | 0 | ✅ — |
| Variables de una librería paralela | 20 | 370 | 🟡 Media |
| Nombre viejo en cache de librería | 18 | 57 | 🟢 Cosmético |
| Variables sin descripción | 686 | — | 🟡 Media |

**Los 322 tokens aplicados resuelven a una variable existente y a un valor correcto.** No hay bindings rotos ni colores escritos a mano. Nada de lo listado acá produce un defecto visual hoy; es deuda de gobernanza.

---

## 1. Librería paralela (deuda real) — 20 variables, 370 usos

### El origen: colecciones que no están en Foundations

Foundations publica 10 colecciones: `Global color`, `Global typography`, `Border`, `Asset`, `Color`, `Typography`, `Global dimension`, `Screen size`, `Spacing`, `Density mode`.

Los archivos de librería consumen además estas 6, que **no existen en Foundations**:

`Dimension` · `Semantic dimension` · `Semantic color` · `Primitives` · `Expressive` · `🔢 Units`

Y como capa primitiva, `_Global dimension` (con guión bajo), distinta de la `Global dimension` de Foundations.

Es una librería anterior que sigue publicada y en uso. De ahí salen los 370 usos.

### Por qué importa si el valor es el mismo

El caso de `border/with/thin`:

```
Foundations   border/width/thin  [Border]              → width/100         [Global dimension]   = 1px
Paralela      border/with/thin   [Semantic dimension]  → border/width/100  [_Global dimension]  = 1px
```

Mismo resultado visual, **dos variables independientes**. Hoy coinciden; nada garantiza que sigan coincidiendo. Un cambio de grosor de borde en Foundations no alcanza a los 120 usos de la variable paralela, y ahí aparece inconsistencia entre componentes que hoy se ven iguales.

El segundo punto es que estas variables son **la minoría de un patrón ya resuelto**:

| Concepto | Variable paralela | Usos | Equivalente en Foundations | Usos |
|---|---|---|---|---|
| borde 1px | `border/with/thin` | 120 | `border/width/thin` | 792 |
| radio 0 | `border/radius/none` | 112 | `border/corner/corner-0` | 798 |
| spacing 4px | `Spacing/SM/space-4` | 28 | `gap/gap-100` | 589 |
| spacing 0 | `space/0x` | 27 | `padding/padding-0` | 1603 |
| radio full | `border/radius/full` | 16 | `border/corner/corner-2000` | 2306 |
| radio 4px | `border/radius/xxs` | 8 | `border/corner/corner-100` | 245 |

No son una decisión de diseño distinta: son lo que quedó sin migrar. El 87% de los bordes de 1px ya usa el token de Foundations.

### Dimensión y spacing — 344 usos

| Variable | Usos | Colección | Destino |
|---|---|---|---|
| `border/with/thin` | 120 | Semantic dimension | `border/width/thin` — nótese el typo **with** |
| `border/radius/none` | 112 | Semantic dimension | `border/corner/corner-0` |
| `Spacing/SM/space-4` | 28 | Primitives | `gap/gap-100` / `padding/padding-100` según propiedad |
| `space/0x` | 27 | Semantic dimension | `padding/padding-0` / `gap/gap-0` |
| `border/radius/full` | 16 | Dimension | `border/corner/corner-2000` |
| `Spacing/SM/space-2` | 12 | Primitives | revisar — no hay `gap/gap-50` |
| `border/radius/xxs` | 8 | Dimension | `border/corner/corner-100` |
| `border/width/100` | 8 | Dimension | `border/width/thin` |
| `size/200` | 8 | Dimension | revisar destino |
| `size/50` | 4 | Dimension | revisar destino — `.Checkbox` |
| `space/3x` | 4 | Semantic dimension | `padding/padding-300` — `Backdrop` |
| `space/2,5x` | 3 | Semantic dimension | revisar — la coma en el nombre es otra señal de creación manual |
| `Radius/0px` | 1 | 🔢 Units | `border/corner/corner-0` — `Story-item` |

El typo `with` y la coma de `2,5x` confirman que estas variables se crearon a mano, sin pasar por la nomenclatura del sistema.

**Componentes con más usos:** `Snackbar` (16), `.Switch` (12), `Status-bar` (16), `Summary-screen` (16), `Stories` / `Onboarding-screen` / `Feedback-screen` (12 cada uno), `Card-Personal-Pay` (8, custom).

### Color — 26 usos

| Variable | Usos | Colección | Nota |
|---|---|---|---|
| `static/background/neutral/primary/medium` | 8 | Color | `neutral` no lleva sub-familia |
| `static/background/neutral/primary-medium` | 6 | Color | misma idea, con guión |
| `static/background/neutral/primary` | 1 | Color | tercera variante — `Onboarding-screen` |
| `static/foreground/sky` | 1 | Expressive | `sky` no es familia del sistema |
| `static/background/sky` | 1 | Expressive | ídem |
| `static/background/pink` | 1 | Expressive | `pink` existe solo en `expressive` |
| `color/background/neutral/low-disabled` | 1 | Semantic color | nomenclatura de otra generación |

Las tres variantes de `neutral/primary*` son el mismo concepto escrito de tres formas. Los tres de `sky`/`pink` están todos en `.⛔ Asset-container_asset-background`.

---

## 2. Nombre viejo en cache (cosmético) — 18 nombres, 57 usos

El binding apunta a la variable correcta de Foundations. Lo que está desactualizado es el **nombre** que guarda el archivo consumidor, porque no refrescó la librería después de que Foundations renombrara la variable.

**No hay que rebindear nada.** Se resuelve actualizando la librería en Components / Templates / Custom.

### Iteración `main` → `primary` (14 usos)

| Nombre en cache | Usos | Nombre actual |
|---|---|---|
| `interactive/border/brand/main/focus/medium` | 12 | `interactive/border/brand/primary/focus/medium` |
| `interactive/border/brand/main/hover/subtle` | 1 | `interactive/border/brand/primary/hover/subtle` |
| `interactive/border/brand/main/pressed/medium` | 1 | `interactive/border/brand/primary/pressed/bold` |

### Nombres previos del mismo token de focus (8 usos)

| Nombre en cache | Usos | Nombre actual |
|---|---|---|
| `interactive/border/brand/focus` | 5 | `interactive/border/brand/primary/focus/medium` |
| `interactive/border/brand/focus-medium` | 3 | `interactive/border/brand/primary/focus/medium` |

Sumando la fila de `main/focus/medium` de arriba: **20 usos apuntan al token de focus con tres nombres históricos distintos**. Todos son la variable `b5a951495b65…`, es decir, están bien aplicados.

### Iteración `tertiary` / `secondary` → escala vigente (19 usos)

| Nombre en cache | Usos | Nombre actual |
|---|---|---|
| `static/foreground/neutral/tertiary-subtle` | 12 | `static/foreground/neutral/subtle` |
| `static/foreground/neutral/tertiary/subtle` | 5 | `static/foreground/neutral/subtle` |
| `static/foreground/neutral/secondary/medium` | 1 | `static/foreground/neutral/bold` |
| `static/foreground/neutral/secondary` | 1 | `static/foreground/neutral/bold` |

### Escalas que se agregaron después (12 usos)

| Nombre en cache | Usos | Nombre actual |
|---|---|---|
| `interactive/background/neutral/default` | 6 | `interactive/background/neutral/default/quiet` |
| `interactive/foreground/brand/default` | 2 | `interactive/foreground/brand/primary/default/medium` |
| `interactive/background/brand/default` | 1 | `interactive/background/brand/default/medium` |
| `interactive/foreground/neutral/default-subtle` | 1 | `interactive/foreground/neutral/default/medium` |
| `interactive/background/brand/hover/medium` | 1 | `interactive/background/brand/hover/bold` |
| `interactive/background/brand/hover/subtle` | 1 | `interactive/background/brand/hover/quiet` |
| `interactive/border/neutral/disabled/medium` | 1 | `interactive/border/neutral/disabled/subtle` |

### Iteración `purple` → `violet` en ilustración (3 usos)

| Nombre en cache | Usos | Nombre actual |
|---|---|---|
| `expressive/illustration/purple/quiet` | 2 | `expressive/illustration/violet/quiet` |
| `expressive/illustration/purple/medium` | 1 | `expressive/illustration/violet/medium` |

---

## 3. Sobre tokens que comparten primitivo

Varios pares de tokens semánticos resuelven al mismo primitivo. Por ejemplo, `core/purple/500` alimenta a `interactive/border/brand/primary/default/medium`, `interactive/border/brand/primary/focus/medium`, `interactive/background/brand/default/medium` y `static/foreground/brand/primary/medium`.

**Esto no es deuda.** Es el comportamiento esperado de una capa semántica: el mismo valor se nombra distinto según el contexto de uso (borde vs. fondo vs. texto) y según el estado, para que cada uno pueda evolucionar por separado sin tocar los demás.

Solo sería un problema si dos estados del mismo contexto no se distinguieran visualmente **por ningún medio**. Verificarlo requiere mirar el componente, no la tabla de tokens: el cambio de estado puede resolverse con un overlay de opacidad, un stroke adicional, un cambio de weight o de posición, no necesariamente con el color.

---

## 4. Sin descripciones

**0 de 686 variables** tienen el campo `description` completo en Figma. Es el texto que aparece al elegir una variable desde el panel, o sea, justo en el momento en que alguien duda cuál aplicar.

---

## 5. Huecos del sistema

- **No hay `interactive/background/feedback/*`.** Los feedback existen solo como `static`. Un input en error cuyo fondo cambie con la interacción no tiene token.
- **`interactive/background/neutral` no tiene `pressed`.** Están `default`, `hover` y `disabled`.
- **`static/opacity` no tiene familia `feedback`.**

---

## Orden de trabajo sugerido

1. **Refrescar la librería** en Components, Templates y Custom → resuelve los 18 nombres viejos (57 usos) sin tocar un solo binding. Es lo más rápido y limpia el ruido de las próximas auditorías.
2. **Migrar `border/with/thin` y `border/radius/none`** a sus equivalentes de Foundations → 232 usos, el 63% de la deuda real en dos cambios. Ambos ya tienen el token destino con ~790 usos, así que es alinear la minoría con lo que ya es el estándar.
3. **Migrar el resto de dimensión y spacing** → 112 usos, cambio mecánico.
4. **Decidir el futuro de la librería paralela.** Mientras las 6 colecciones sigan publicadas, la deuda se puede volver a introducir. Despublicarlas o marcarlas como deprecadas es lo que cierra el problema de raíz.
5. **Consolidar las tres variantes de `static/background/neutral/primary*`** → 15 usos.
6. **Resolver `sky` / `pink` en `.⛔ Asset-container_asset-background`** → 3 usos, decidir familia válida.
7. **Completar descripciones** en Figma.
8. **Evaluar los huecos**, sobre todo `interactive/background/feedback/*`.

---

## Nota metodológica

La auditoría anterior (documentada antes de esta revisión) reportaba 24 tokens inexistentes y 2 colisiones de estado críticas. Ambos eran falsos positivos:

- Los "inexistentes" resultaron ser 18 nombres viejos en cache (variable correcta) + 20 variables locales (existen, en otra colección). Comparar por nombre en lugar de por `key` no permite distinguirlos.
- Las "colisiones" eran tokens semánticos distintos compartiendo primitivo, que es el comportamiento esperado.

De ahí que este documento compare por `key` y separe explícitamente las tres situaciones.
