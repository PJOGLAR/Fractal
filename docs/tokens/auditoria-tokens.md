# Auditoría de tokens — estado del sistema

> Extracción del **3-ago-2026**. Cruza las 818 variables de `Foundations` contra los 322 tokens efectivamente bindeados en Components (137), Templates (15) y Custom (8).
>
> **Método:** la comparación se hace por `key` de variable, no por nombre. El `key` es el identificador estable de Figma y no cambia al renombrar, lo que permite distinguir un token mal aplicado de uno bien aplicado cuyo nombre quedó viejo en el cache del archivo consumidor.

---

## Resultado

**El sistema de tokens está sano.**

| Verificación | Resultado |
|---|---|
| Tokens aplicados que no existen | **0** |
| Bindings rotos | **0** |
| Tokens que resuelven a una variable y valor correctos | **322 de 322** |
| Bindings totales analizados | 23.561 |

No hay ningún defecto visual atribuible a la tokenización.

Observaciones abiertas:

| Observación | Alcance | Naturaleza |
|---|---|---|
| Colores aplicados sin token | 29 usos | 26 son blanco puro, que **no existe como token**. Ver §3 |
| Nombres desactualizados en el cache de la librería | 18 nombres, 57 usos | Cosmética. Se resuelve refrescando la librería |
| Variables de colecciones que no están en Foundations | 20 variables, 302 usos | **Pendiente de identificar el origen** |
| Variables sin descripción en Figma | 818 de 818 | Oportunidad de mejora |

---

## 1. Nombres desactualizados en el cache

El binding apunta a la variable correcta de Foundations. Lo que está viejo es el **nombre** que guarda el archivo consumidor, porque no refrescó la librería después de un rename en Foundations.

**No hay que rebindear nada.** Se resuelve actualizando la librería en Components, Templates y Custom.

Cómo se comprueba que es cosmético: los cuatro nombres siguientes tienen el mismo `key`, o sea, son la misma variable.

```
key b5a951495b65…
  Foundations dice : interactive/border/brand/primary/focus/medium
  bindings dicen   : primary/focus/medium · main/focus/medium · focus · focus-medium
```

### Iteración `main` → `primary` (14 usos)

| Nombre en cache | Usos | Nombre actual |
|---|---|---|
| `interactive/border/brand/main/focus/medium` | 12 | `interactive/border/brand/primary/focus/medium` |
| `interactive/border/brand/main/hover/subtle` | 1 | `interactive/border/brand/primary/hover/subtle` |
| `interactive/border/brand/main/pressed/medium` | 1 | `interactive/border/brand/primary/pressed/bold` |

### Nombres previos del token de focus (8 usos)

| Nombre en cache | Usos | Nombre actual |
|---|---|---|
| `interactive/border/brand/focus` | 5 | `interactive/border/brand/primary/focus/medium` |
| `interactive/border/brand/focus-medium` | 3 | `interactive/border/brand/primary/focus/medium` |

### Iteración `tertiary` / `secondary` → escala vigente (19 usos)

| Nombre en cache | Usos | Nombre actual |
|---|---|---|
| `static/foreground/neutral/tertiary-subtle` | 12 | `static/foreground/neutral/subtle` |
| `static/foreground/neutral/tertiary/subtle` | 5 | `static/foreground/neutral/subtle` |
| `static/foreground/neutral/secondary/medium` | 1 | `static/foreground/neutral/bold` |
| `static/foreground/neutral/secondary` | 1 | `static/foreground/neutral/bold` |

### Escalas agregadas después del binding (12 usos)

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

## 2. Variables de colecciones ajenas a Foundations

### El hecho

Foundations es **un solo archivo** con 10 colecciones y 818 variables. Las que empiezan con `Global` son primitivos; el resto, semánticos.

| Colección | Vars | Capa |
|---|---|---|
| `Color` | 253 | semántica |
| `Typography` | 160 | semántica |
| `Spacing` | 48 | semántica |
| `Border` | 15 | semántica |
| `Asset` | 15 | semántica |
| `Screen size` | 2 | semántica |
| `Density mode` | 1 | semántica |
| `Global color` | 233 | primitiva |
| `Global dimension` | 53 | primitiva |
| `Global typography` | 38 | primitiva |

Los bindings referencian además estas colecciones, que no están en ese archivo:

`Semantic dimension` · `_Global dimension` · `Dimension` · `Primitives` · `Semantic color` · `Expressive`

### Lo que no sé

**De dónde vienen.** La extracción no guardaba el campo `remote` de cada variable ni el archivo de origen, así que no puedo determinar si son de otra librería publicada o locales de algún archivo. Sin ese dato no corresponde clasificarlas como problema: podrían ser parte legítima del sistema.

El extractor ya quedó instrumentado para resolverlo. La próxima corrida incluye `foundations.libraries` con el archivo de cada colección, y la UI del plugin muestra el desglose.

### Lo que sí sé

Las variables resuelven correctamente y el valor final coincide con su equivalente de Foundations. Ejemplo:

```
Foundations   border/width/thin  [Border]              → width/100         [Global dimension]   = 1px
Otra          border/with/thin   [Semantic dimension]  → border/width/100  [_Global dimension]  = 1px
```

Mismo resultado visual. La observación es que son dos entradas para el mismo valor y no hay nada que las mantenga sincronizadas si una cambia.

`Semantic dimension` tiene 5 variables, y son exactamente las que aparecen acá:

| Variable | Usos | Dónde se aplica |
|---|---|---|
| `border/with/thin` | 120 (52 sin contar placeholder) | `.Checkbox`, `.Switch`, `Snackbar` |
| `border/radius/none` | 112 | `Status-bar` y sus internos, `Top-bar`, `Action`, `.⛔️ Backdrop_handle` |
| `space/0x` | 27 | `Action`, variantes `Layout=*` |
| `space/3x` | 4 | variantes `Layout=*` |
| `space/2,5x` | 3 | `Action` |

Y el resto, por colección:

| Colección | Variables | Usos |
|---|---|---|
| `Dimension` | `border/radius/full` (16), `border/radius/xxs` (8), `border/width/100` (8), `size/200` (8), `size/50` (4) | 44 |
| `Primitives` | `Spacing/SM/space-4` (28), `Spacing/SM/space-2` (12) | 40 |
| `Color` | 3 variantes de `static/background/neutral/primary*` | 15 |
| `Expressive` | `static/foreground/sky`, `static/background/sky`, `static/background/pink` | 3 |
| `Semantic color` | `color/background/neutral/low-disabled` | 1 |
| `🔢 Units` | `Radius/0px` | 1 |

> **Nota de conteo.** De los 120 usos de `border/with/thin`, 68 vienen de la capa `Swap-content`, un componente placeholder anidado en 16 componentes con bindings idénticos. Es andamio de documentación y no llega a producción, así que conviene descontarlo al dimensionar cualquier trabajo.

---

## 3. Colores aplicados sin token — 29 usos

| Valor | Usos | Dónde | Lectura |
|---|---|---|---|
| `#FFFFFF` | 26 | Capas `Vector` de `Status-bar` (6), `Feedback-screen` (10), `Summary-screen` (4), `Stories` (2), `Onboarding-screen` (2), `Splash` (1), `.⛔️ Stories-template_logo-onboarding` (1) | **No hay token de blanco puro en Foundations.** El más claro es `core/neutral/25` = `#FCFCFC` |
| `#5A50F7` | 2 | `Stories`, `.⛔️ Stories-template_logo-onboarding` — capas `Vector` | ⚠️ **No coincide con ningún primitivo.** El morado de marca es `#5A50F9` |
| `#5A50F9` | 1 | `Summary-screen` — capa `Logo` | Es el morado de marca correcto, pero sin token. Existe como `core/purple/500` |

**Los 26 de `#FFFFFF` son un hueco del sistema, no un error de aplicación.** Se verificó: ninguna variable de Foundations resuelve a blanco puro. Si los logos e iconos necesitan blanco exacto, hace falta el token; si `#FCFCFC` alcanza, se pueden migrar a `static/foreground/neutral/quiet`. Es una decisión de diseño, no un fix mecánico.

**El caso de `#5A50F7` sí merece atención.** Difiere del morado de marca en el último byte (`F7` vs `F9`). No existe como variable en ninguna colección. Probablemente sea un valor viejo o un error de tipeo que quedó fijo en dos capas de Stories. Ahí el fix es claro: bindear a `static/foreground/brand/primary/medium`.

---

## 4. Sobre tokens que comparten primitivo

Varios pares de tokens semánticos resuelven al mismo primitivo. `core/purple/500` alimenta a `interactive/border/brand/primary/default/medium`, `…/focus/medium`, `interactive/background/brand/default/medium` y `static/foreground/brand/primary/medium`.

**Esto no es un problema.** Es el propósito de la capa semántica: el mismo valor se nombra distinto según contexto y estado, para que cada uno pueda evolucionar por separado.

Que `focus` y `default` compartan color no implica que el foco sea invisible. El cambio de estado puede resolverse con una capa de overlay, un stroke adicional, un cambio de weight o de posición. En este sistema ese mecanismo existe y está documentado: los tokens de `interactive/opacity` se aplican en capas llamadas `Hover layer`, `Pressed layer` y `Disabled layer`.

### Cómo distinguirlo de una duplicación

La pregunta no es si dos tokens comparten valor, sino en qué dirección:

| Estructura | Lectura |
|---|---|
| **dos** semánticos → **un** primitivo | Correcto por diseño |
| **un** semántico → **dos** variables | Duplicación |

---

## 5. Variables sin descripción

**0 de 818** tienen el campo `description` completo en Figma. Es el texto que aparece al elegir una variable desde el panel, o sea, justo en el momento en que alguien duda cuál aplicar.

No es un defecto: es la mejora de mayor impacto disponible sobre la experiencia de aplicar tokens.

---

## 6. Huecos del sistema

Casos de uso sin token disponible:

- **No hay token de blanco puro (`#FFFFFF`).** El valor más claro del sistema es `core/neutral/25` = `#FCFCFC`. Explica los 26 usos hardcodeados de §3.
- **No hay `interactive/background/feedback/*`.** Los feedback existen solo como `static`. Un input en error cuyo fondo cambie con la interacción no tiene token.
- **`interactive/background/neutral` no tiene `pressed`.** Están `default`, `hover` y `disabled`.
- **`static/opacity` no tiene familia `feedback`.**
- **`pictogram` no tiene `sm`, `xs` ni `xl`.** La escala salta de `md` (24px) a `2xl` (40px).

---

## Próximos pasos sugeridos

Ordenados por relación entre esfuerzo e impacto:

1. **Corregir `#5A50F7` en Stories** → 2 usos, fix claro: bindear a `static/foreground/brand/primary/medium`. Es el único valor aplicado que no coincide con ningún primitivo del sistema.
2. **Refrescar la librería** en Components, Templates y Custom → resuelve los 18 nombres desactualizados sin tocar bindings, y limpia el ruido de las próximas auditorías.
3. **Correr el extractor actualizado** → identifica el origen de las 6 colecciones. Es lo que falta para saber si hay algo que hacer con esas 20 variables o si son parte legítima del sistema.
4. **Decidir qué pasa con el blanco puro** → crear el token o migrar los 26 usos a `neutral/quiet`. Requiere decisión de diseño.
5. **Completar descripciones** en Figma → es la mejora de mayor impacto sobre la experiencia de elegir un token, y no toca ningún componente.
6. **Evaluar los huecos**, sobre todo `interactive/background/feedback/*`.

---

## Nota metodológica

Una versión anterior de este documento reportaba 24 tokens inexistentes y 2 colisiones de estado críticas. Ambos eran errores de método:

- Los "inexistentes" resultaron ser 18 nombres viejos en cache (variable correcta) y 20 variables de otras colecciones (existen y resuelven bien). Comparar por nombre en lugar de por `key` no permite distinguirlos.
- Las "colisiones" eran tokens semánticos distintos compartiendo primitivo, que es el comportamiento esperado.

De ahí que este documento compare por `key`, separe explícitamente las situaciones y no clasifique como problema lo que no está verificado.
