# Deuda de tokens — auditoría

> Auditoría de la extracción del **3-ago-2026**. Cruza los 81 tokens semánticos definidos en `Color` contra los bindings reales de Components (137), Templates (15) y Custom (8).
>
> Se separó de `semanticos.md` porque es una lista de trabajo, no documentación de uso.

---

## Resumen

| Hallazgo | Cantidad | Severidad |
|---|---|---|
| Tokens aplicados que no existen | 24 | 🔴 Alta |
| Colisiones de estado críticas | 2 | 🔴 Alta |
| Colisiones de estado a revisar | 6 | 🟡 Media |
| `brand/secondary` apuntando a purple | 1 | 🟡 Media |
| Tokens definidos sin uso | 3 | 🟢 Baja |
| Valores hardcodeados | 29 | 🟡 Media |
| Variables sin descripción | 818 | 🟡 Media |

**Sin desvíos de escala:** los 81 tokens respetan los rangos de primitivo esperados (`strong`=950, `bold`=700-950, `medium`=500-600, `subtle`=100-400, `quiet`=25-50).

---

## 1. Tokens aplicados que no existen (24)

Nombres bindeados en componentes que **no están definidos** en la colección `Color`. Agrupados por causa.

### 1.a — Focus ring: tres nombres para lo mismo (18 usos)

El caso de mayor impacto.

| Token aplicado | Usos | Componentes |
|---|---|---|
| `interactive/border/brand/main/focus/medium` | 10 | Banner-sm/md/lg/xl, Video-card, Button-card, Shortcut-asset, Shortcut-brand… |
| `interactive/border/brand/focus` | 5 | Button-icon, Button-row, Chip, `.⛔️ Shortcut_button`, `.⛔️ Tabs_option` |
| `interactive/border/brand/focus-medium` | 3 | Accordion, Row-item, Button-toggle |

**Nombre correcto:** `interactive/border/brand/primary/focus/medium` (existe y tiene 28 usos).

Nótese que `main` no es una sub-familia válida: la correcta es `primary`.

### 1.b — Escalas `secondary` / `tertiary` (naming derogado, 18 usos)

La escala vigente es `strong > bold > medium > subtle > quiet`. Estos nombres son de una nomenclatura anterior.

| Token aplicado | Usos | Debería ser |
|---|---|---|
| `static/foreground/neutral/tertiary-subtle` | 11 | `static/foreground/neutral/subtle` |
| `static/foreground/neutral/tertiary/subtle` | 5 | `static/foreground/neutral/subtle` |
| `static/foreground/neutral/secondary` | 1 | `static/foreground/neutral/medium` |
| `static/foreground/neutral/secondary/medium` | 1 | `static/foreground/neutral/medium` |

Los dos primeros son el mismo concepto escrito de dos formas (guión vs. slash).

### 1.c — `neutral/primary` en background (10 usos)

| Token aplicado | Usos | Componentes |
|---|---|---|
| `static/background/neutral/primary-medium` | 5 | Card-container y sus internos, Notification (custom) |
| `static/background/neutral/primary/medium` | 4 | Asset-container_asset-background, Stories (templates) |
| `static/background/neutral/primary` | 1 | Onboarding-screen (templates) |

Tres variantes del mismo nombre. Además, `neutral` no lleva sub-familia por definición: `primary` no corresponde acá.

### 1.d — Familias de color inexistentes (5 usos)

| Token aplicado | Usos | Problema |
|---|---|---|
| `static/background/pink` | 1 | `pink` no es familia semántica (existe solo en `expressive`) |
| `static/background/sky` | 1 | `sky` no existe en el sistema |
| `static/foreground/sky` | 1 | ídem |
| `expressive/illustration/purple/medium` | 1 | `purple` no es familia de ilustración |
| `expressive/illustration/purple/quiet` | 1 | ídem |

Los tres primeros están todos en `.⛔ Asset-container_asset-background`. Los dos de `purple` en `Card-Personal-Pay` (custom) — las familias de ilustración válidas son amber, bourbon, coral, emerald, lavender, magenta, melon, sapphire, teal y violet.

### 1.e — Estados y escalas inexistentes (9 usos)

| Token aplicado | Usos | Problema |
|---|---|---|
| `interactive/background/neutral/default` | 3 | Falta la escala |
| `interactive/foreground/brand/default` | 2 | Falta sub-familia y escala |
| `interactive/background/brand/default` | 1 | Falta la escala |
| `interactive/background/brand/hover/medium` | 1 | No existe `hover/medium` |
| `interactive/background/brand/hover/subtle` | 1 | No existe `hover/subtle` en brand |
| `interactive/border/brand/main/hover/subtle` | 1 | `main` inválido |
| `interactive/border/brand/main/pressed/medium` | 1 | `main` inválido |
| `interactive/border/neutral/disabled/medium` | 1 | No existe esa escala en disabled |
| `interactive/foreground/neutral/default-subtle` | 1 | Guión en vez de slash |

**`Toggle-number` (custom) concentra 4 de estos.** Es el componente con más tokens inválidos del sistema; conviene revisarlo completo.

---

## 2. Colisiones de estado

Tokens de **estados distintos** que apuntan al **mismo primitivo**, es decir: el cambio de estado no produce cambio visual.

### 🔴 Críticas

**disabled = hover**

```
core/neutral/100
├── interactive/background/neutral/disabled/subtle   (14 usos)
└── interactive/background/neutral/hover/subtle       (9 usos)
```

Un elemento deshabilitado se ve igual que uno en hover. Conecta directo con la señal de *taps sobre elementos disabled* del plan de métricas: si el token no diferencia, es esperable que la gente intente tocar botones deshabilitados.

**focus = default**

```
core/purple/500
├── interactive/border/brand/primary/default/medium   (15 usos)
└── interactive/border/brand/primary/focus/medium     (28 usos)
```

El focus ring no se distingue del borde por defecto. Afecta navegación por teclado y cumplimiento de accesibilidad. Y es el token de focus más usado del sistema (28 usos), así que el impacto es amplio.

### 🟡 A revisar

| Primitivo | Tokens | Usos |
|---|---|---|
| `core/purple/200` | `border/brand/primary/` default/subtle · hover/subtle · pressed/subtle | 4 · 6 · 6 |
| `core/purple/900` | `border/brand/primary/` hover/bold · pressed/bold | 6 · 8 |
| `core/purple/900` | `foreground/brand/primary/` default/bold · pressed/bold | 10 · 5 |
| `core/purple/700` | `background/brand/` default/bold · hover/bold | 3 · 12 |
| `core/purple/50` | `background/brand/` default/quiet · hover/quiet | 12 · 12 |
| `core/neutral/600` | `foreground/neutral/` default/medium · hover/medium | 8 · 1 |

**Matiz importante:** compartir primitivo no es necesariamente un error. Es válido cuando el cambio de estado se resuelve con una capa de `opacity` encima en lugar del color de fondo. Hay que verificar componente por componente si esa capa de overlay existe; donde no exista, es un bug real.

Los dos casos críticos no admiten esa justificación: en `disabled` no hay overlay que lo explique, y el focus ring por definición debe ser distinguible.

---

## 3. `static/border/brand/secondary` apunta a purple

```
static/border/brand/secondary  →  core/purple/200
```

`brand/secondary` es cyan en los otros 5 tokens de la familia:

| Token | Primitivo |
|---|---|
| `interactive/foreground/brand/secondary/default/bold` | `core/cyan/900` ✓ |
| `interactive/foreground/brand/secondary/default/medium` | `core/cyan/600` ✓ |
| `interactive/border/brand/secondary/active/medium` | `core/cyan/500` ✓ |
| `static/background/brand/secondary/medium` | `core/cyan/600` ✓ |
| `static/background/brand/secondary/subtle` | `core/cyan/100` ✓ |

O el valor está mal, o el token debería llamarse `static/border/brand/primary/subtle`.

---

## 4. Tokens definidos sin uso (3)

| Token | Primitivo |
|---|---|
| `interactive/foreground/brand/secondary/default/bold` | `core/cyan/900` |
| `interactive/foreground/brand/secondary/default/medium` | `core/cyan/600` |
| `static/foreground/brand/primary/bold` | `core/purple/900` |

Los dos de `secondary` sugieren que la familia cyan está definida pero no adoptada. Decidir si se aplican o se deprecan.

---

## 5. Valores hardcodeados (29)

Colores aplicados sin token.

### Components (6)

Todos son `#FFFFFF` en vectores de `Status-bar` y sus internos (`_wifi`, `_celular`, `_battery`).

### Templates (23)

| Componente | Valor | Nota |
|---|---|---|
| `.⛔️ Stories-template_logo-onboarding` | `#5A50F7` | **Morado de marca hardcodeado** |
| `Stories` | `#5A50F7` | ídem |
| `Stories`, `Splash`, `Onboarding-screen` | `#FFFFFF` | Vectores |

El caso de `#5A50F7` es el más relevante: es el color de marca escrito a mano. Si el primitivo de marca cambia, estos no se actualizan.

### Custom (0)

Sin hardcodeados. 👍

---

## 6. Sin descripciones

**0 de 818 variables** tienen el campo `description` completo en Figma. Llenarlo haría que el propósito de cada token sea visible al aplicarlo desde el panel de variables, que es justo el momento en que alguien duda cuál elegir.

---

## 7. Huecos del sistema

- **No hay `interactive/background/feedback/*`.** Los feedback existen solo como `static`. Un input en error cuyo fondo cambie con la interacción no tiene token. Explica los intentos de usar `interactive/background/brand/hover/subtle` y similares.
- **`interactive/background/neutral` no tiene `pressed`.** Están `default`, `hover` y `disabled`.
- **`static/opacity` no tiene familia `feedback`.**

---

## Progreso desde la auditoría anterior (21-jun → 3-ago)

Tres cosas se resolvieron:

| Antes | Ahora |
|---|---|
| `static/opacity/brand/medium` — aplicado pero no definido | ✅ Definido → `opacity/purple/600` |
| `static/opacity/neutral/subtle` — aplicado pero no definido | ✅ Definido → `opacity/gray/400` |
| `static/opacity/brand/strong` — definido sin uso | ✅ Eliminado |

También cambió un valor: `interactive/opacity/neutral/disabled` pasó de `opacity/gray/200` a `opacity/gray/50`.

Los huérfanos totales subieron de 11 a 24, pero **no por regresión**: esta auditoría incluye Templates y Custom, que antes no se revisaban. De los 24, hay 11 que vienen de esos dos archivos.

---

## Orden de trabajo sugerido

1. **Unificar el focus ring** → 18 usos en 14 componentes hacia `interactive/border/brand/primary/focus/medium`. Un solo cambio, el mayor impacto.
2. **Separar el valor de `focus` del de `default`** → hoy el focus ring es invisible. Es un tema de accesibilidad.
3. **Separar `disabled` de `hover`** en background neutral → 23 usos afectados.
4. **Migrar `tertiary` / `secondary`** a la escala vigente → 18 usos, cambio mecánico.
5. **Consolidar `neutral/primary-medium`** en sus tres variantes → 10 usos.
6. **Revisar `Toggle-number`** (custom) → concentra 4 tokens inválidos.
7. **Tokenizar `#5A50F7`** en Templates → riesgo si cambia el color de marca.
8. **Resolver `static/border/brand/secondary`** → decidir si es valor o nombre.
9. **Completar descripciones** en Figma → mejora la elección en el momento de aplicar.
10. **Evaluar los huecos** → sobre todo `interactive/background/feedback/*`.
