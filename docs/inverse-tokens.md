# Tokens Inverse — propuesta de unificación

> Documento exploratorio. Resume el problema detectado con tokens "on-color" (foregrounds, backgrounds y bordes que van sobre superficies inverse) y propone formalizarlos bajo un slot `inverse`.

---

## El problema

En la nomenclatura actual hay **dos lógicas mezcladas** dentro del mismo nivel de la jerarquía de tokens.

### Lógica A — escala de prominencia (la mayoría de los tokens)

```
interactive/foreground/brand/primary/default/medium
interactive/background/brand/default/bold
interactive/border/neutral/default/subtle
```

`medium`, `bold`, `subtle` describen **prominencia visual** dentro del contexto.

### Lógica B — implícitamente "on-something"

```
interactive/foreground/neutral/default/quiet  → #FCFCFC
```

Este token es claro porque va sobre fondos saturados (purple, brand). Pero el nombre `quiet` ("apenas visible") **dice lo contrario**: sobre purple, ese blanco es lo más visible posible (máximo contraste).

**El nombre miente sobre el uso.** Es coherente con la escala (es el valor cromático más claro), pero el rol semántico es opuesto al que sugiere "quiet".

### Caso visual concreto

Cuatro botones sobre fondo purple. Los foregrounds y backgrounds aplicados:

```
Botón 1 (fondo purple lleno, label blanco):
  foreground: interactive/foreground/neutral/default/quiet  → #FCFCFC

Botón 2 (fondo blanco, label purple):
  foreground: interactive/foreground/brand/primary/default/medium → purple
  background: interactive/background/neutral/default/medium       → #FCFCFC

Botón 3 (outline, label purple):
  foreground: interactive/foreground/brand/primary/default/medium
  border:     interactive/border/neutral/default/subtle

Botón 4 (fondo purple bold, label blanco):
  background: interactive/background/brand/default/bold        → purple oscuro
  foreground: interactive/foreground/neutral/default/quiet     → #FCFCFC
```

El "label blanco sobre purple" se nombra `quiet`. Pero el blanco **es el foreground más prominente posible** sobre ese fondo. La escala no comunica el rol real.

---

## La propuesta — slot `inverse`

Agregar un slot intermedio `inverse` antes de la escala, que diferencia tokens **default** (sobre superficies claras) de **inverse** (sobre superficies oscuras o saturadas).

### Estructura

```
[contexto]/[elemento]/[familia]/[default | inverse]/[escala]
```

`inverse` no reemplaza la escala, es un **slot intermedio**. Cada slot tiene su propia escala completa de prominencia.

### Aplica a foreground, background y border

#### Foreground

```
Sobre superficies claras:
  static/foreground/neutral/default/bold     → #171717
  static/foreground/neutral/default/medium   → #404040  (default principal)
  static/foreground/neutral/default/subtle   → #676767
  static/foreground/neutral/default/quiet    → #A9A9A9

Sobre superficies inverse:
  static/foreground/neutral/inverse/medium   → #FCFCFC  (default sobre inverse)
  static/foreground/neutral/inverse/subtle   → #DADADA  (reservado, agregar si aparece caso)
  static/foreground/neutral/inverse/quiet    → #858585  (reservado)
```

#### Background

Aplicable cuando un fondo decorativo o de marca aparece sobre una superficie inverse y se necesita un valor distinto al que se usa sobre superficies claras.

```
Fondos sobre superficies claras:
  static/background/brand/primary/medium             → core/purple/500
  static/background/brand/primary/subtle             → core/purple/100
  static/background/brand/primary/quiet              → core/purple/50

Fondos sobre superficies inverse:
  static/background/brand/primary/inverse/medium     → core/purple/300  (más claro)
  static/background/brand/primary/inverse/subtle     → core/purple/100  (mismo hex, otro rol)
```

#### Border

```
Bordes sobre superficies claras:
  static/border/neutral/default/medium    → core/neutral/300
  static/border/neutral/default/subtle    → core/neutral/200

Bordes sobre superficies inverse:
  static/border/neutral/inverse/medium    → core/neutral/200  (puede coincidir hex)
  static/border/neutral/inverse/subtle    → core/neutral/100
```

---

## Concepto clave — la escala es contextual al slot

> `quiet` siempre significa "apenas visible en el contexto", no un valor cromático absoluto.

| Slot | `quiet` significa |
|---|---|
| `default` (sobre fondo claro) | Un gris claro, que se confunde con el fondo |
| `inverse` (sobre fondo oscuro) | Un gris oscuro, que se confunde con el fondo |

No es el valor cromático lo que define el slot. Es **la prominencia visual relativa al fondo**.

```
default/quiet    → #A9A9A9  (gris claro, apenas se ve sobre fondo claro)
inverse/quiet    → #858585  (gris oscuro, apenas se ve sobre fondo oscuro)
```

Mismo rol semántico, valores cromáticos opuestos. Es exactamente lo que ya hacemos con `medium`:

```
foreground/neutral/default/medium  → 700  (oscuro, sobre fondo claro)
background/neutral/default/medium  → 25   (claro, sobre fondo claro)
```

---

## Sobre la duplicación de tokens (mismo hex, distinto rol)

En algunos casos, `default/X` e `inverse/Y` van a apuntar al mismo primitivo en light mode.

```
static/background/brand/primary/subtle          → core/purple/100  (#E0E4F5)
static/background/brand/primary/inverse/subtle  → core/purple/100  (#E0E4F5)
```

**Se justifica tener los dos tokens.** El hex coincide hoy en light, pero los roles son distintos:

| Token | Rol |
|---|---|
| `default/subtle` | Fondo decorativo suave en superficies claras |
| `inverse/subtle` | Fondo decorativo suave en superficies inverse |

### Por qué vale la duplicación

#### 1. Para dark mode (cada uno se separa naturalmente)

```
Light mode:
  static/background/brand/primary/subtle          → core/purple/100  (#E0E4F5)
  static/background/brand/primary/inverse/subtle  → core/purple/100  (#E0E4F5)

Dark mode:
  static/background/brand/primary/subtle          → core/purple/800  (purple oscuro)
  static/background/brand/primary/inverse/subtle  → core/purple/200  (purple claro pero suave)
```

Si fueran un solo token, en dark no se podrían diferenciar.

#### 2. Para auditar uso real

```
static/background/brand/primary/subtle          → usado en 8 componentes
static/background/brand/primary/inverse/subtle  → usado en 3 componentes
```

Saber dónde se aplica cada uno es información valiosa.

#### 3. Para futuras decisiones de marca

Si mañana se decide que los fondos subtle sobre inverse deben ser más saturados que sobre claro:

```
static/background/brand/primary/subtle          → core/purple/100  (sin cambio)
static/background/brand/primary/inverse/subtle  → core/purple/200  (más saturado)
```

#### 4. Para que el equipo sepa cuándo aplicar cada uno

El nombre del token comunica la intención. Reduce errores de aplicación.

---

## Ejemplos concretos

### Ejemplo 1 — Card decorativa con foreground

#### Card sobre fondo claro
```
static/background/brand/primary/subtle           → core/purple/100  (fondo lavanda)
static/foreground/neutral/default/medium         → core/neutral/700 (texto oscuro)
static/foreground/neutral/default/subtle         → core/neutral/500 (caption)
static/border/neutral/default/subtle             → core/neutral/200 (borde)
```

#### Card sobre fondo inverse (ej: sección purple lleno)
```
static/background/brand/primary/inverse/subtle   → core/purple/600  (fondo levemente más oscuro)
static/foreground/neutral/inverse/medium         → core/neutral/25  (texto blanco)
static/foreground/neutral/inverse/subtle         → core/neutral/200 (caption claro)
static/border/neutral/inverse/subtle             → core/neutral/700 (borde sutil oscuro)
```

### Ejemplo 2 — Banner de feedback

#### Banner sobre fondo claro
```
static/background/feedback/info/subtle           → core/blue/50
static/foreground/feedback/info/medium           → core/blue/700
static/border/feedback/info/medium               → core/blue/700
```

#### Banner inverse (sobre sección oscura)
```
static/background/feedback/info/inverse/subtle   → core/blue/900
static/foreground/feedback/info/inverse/medium   → core/blue/200
static/border/feedback/info/inverse/medium       → core/blue/300
```

---

## Caso 1 — Dark mode

Cuando se active dark mode, los modes viven en la **capa semántica** (los primitivos no cambian).

### Cómo se resuelven los tokens en dark

```
Light mode:
  static/foreground/neutral/default/medium         → core/neutral/700  (#404040)
  static/foreground/neutral/inverse/medium         → core/neutral/25   (#FCFCFC)

Dark mode:
  static/foreground/neutral/default/medium         → core/neutral/200  (gris claro)
  static/foreground/neutral/inverse/medium         → core/neutral/950  (texto oscuro sobre fondo claro inverse)
```

Cada slot mantiene su rol:
- `default` → texto principal sobre superficies "primarias" del mode
- `inverse` → texto sobre superficies "inverse" del mode

En dark, las superficies "primarias" pasan a ser oscuras y las "inverse" pasan a ser claras. El slot sigue describiendo el mismo rol.

### Configuración de cada slot

```
static/foreground/neutral/default/medium
  Light → core/neutral/700  (oscuro sobre claro)
  Dark  → core/neutral/200  (claro sobre oscuro)

static/foreground/neutral/inverse/medium
  Light → core/neutral/25   (claro sobre oscuro)
  Dark  → core/neutral/950  (oscuro sobre claro)
```

**Lo importante:** los nombres no cambian. El equipo aprende una vez la lógica `default vs inverse` y funciona en cualquier mode.

---

## Caso 2 — Tematización (white-label)

El mismo principio sirve para casos donde se necesita aplicar el sistema a otra marca o submarca con paleta distinta.

### Setup

Imaginá que se necesita aplicar el DS a una segunda marca con paleta verde:

```
PRIMITIVOS (siempre fijos):
  core/purple/500     → #5A50F9  (marca Fractal)
  core/purple/300     → #A5B4FC
  core/green/500      → #15803D  (marca alterna)
  core/green/300      → #86EFAC
```

### Tematización en semánticos

Se agrega un mode `Brand-alt`:

```
Collection: Semantic color
├── Mode: Light (Fractal)
├── Mode: Dark (Fractal)
├── Mode: Light (Brand-alt)
└── Mode: Dark (Brand-alt)

static/foreground/brand/primary/medium
  Light Fractal     → core/purple/500
  Dark Fractal      → core/purple/300
  Light Brand-alt   → core/green/500
  Dark Brand-alt    → core/green/300
```

### Aplicación en componentes

**Los componentes no cambian.** Siguen usando el mismo token:

```
button-card/foreground/medium → static/foreground/brand/primary/medium
```

Cuando un frame está en mode `Light Brand-alt`, el botón usa green automáticamente. Sin tocar el componente.

### Cómo afecta `inverse` en tematización

`inverse` se mantiene coherente:

```
static/foreground/neutral/inverse/medium
  Light Fractal     → core/neutral/25
  Dark Fractal      → core/neutral/950
  Light Brand-alt   → core/neutral/25     (mismo concepto)
  Dark Brand-alt    → core/neutral/950
```

El concepto "el foreground que va sobre superficies inverse" no cambia entre marcas. Lo que cambia es cuál es la superficie inverse de cada marca, pero eso lo resuelven los semánticos de background.

---

## Tokens afectados (a auditar)

> **Datos extraídos del sistema actual.** La auditoría visual va a confirmar caso por caso si cada token clasifica como rename, crear nuevo o quedarse como está.

### Tres patrones detectados

Al cruzar los tokens claros (`#FCFCFC`, `#EBEBEB`) con los componentes que los usan, aparecieron 3 patrones de uso. Cada uno requiere un tratamiento distinto.

#### Patrón 1 — Doble rol (default + inverse)

El token se usa **legítimamente como default** en la mayoría de los casos, **pero también aparece en componentes con Appearance=inverse** donde cumple un rol inverse.

| Tratamiento | Crear token nuevo `inverse/X` + re-vincular SOLO las capas inverse. Dejar el token default intacto para los usos legítimos. |
|---|---|

```
Ejemplo:
  interactive/background/neutral/default/medium  → #FCFCFC
  
  Usos:
    25 componentes lo usan como fondo blanco "normal" (rol default legítimo)
     2 componentes con Appearance=inverse lo usan como fondo blanco sobre superficie inverse
  
  Acción:
    - Crear interactive/background/neutral/inverse/medium (token nuevo)
    - Re-vincular SOLO las 2 capas con Appearance=inverse
    - Token default queda con sus 25 usos
```

#### Patrón 2 — Mal nombrado (rol siempre inverse implícito)

El token tiene un nombre que miente sobre su uso. **Todos sus usos son sobre fondos saturados u oscuros**, aunque el nombre sugiera otra cosa (`quiet`, `subtle`).

| Tratamiento | Renombrar el token completo a `inverse/X`. Mantiene `id`, todos los componentes se actualizan automáticamente. |
|---|---|

```
Ejemplo:
  interactive/foreground/neutral/default/quiet  → #FCFCFC
  
  Usos:
    18 componentes, ninguno con Appearance=inverse explícito
    Pero todos aplicados como foreground sobre fondos saturados
    (alert vector, payment-card vector, switch handle sobre fondo activo, etc.)
  
  El nombre "quiet" miente: el blanco sobre purple no es "apenas visible",
  es el foreground más prominente posible.
  
  Acción:
    - Renombrar a interactive/foreground/neutral/inverse/medium
    - Mantiene id, los 18 componentes se actualizan automáticamente
```

#### Patrón 3 — Default puro

El token se usa **siempre sobre superficies claras**, sin uso inverse. El nombre y el rol coinciden.

| Tratamiento | Queda como está. No requiere cambio. |
|---|---|

```
Ejemplo:
  interactive/background/neutral/hover/medium  → #EBEBEB
  
  Usos:
    7 componentes, ninguno inverse
    Todos como hover sobre fondos claros
  
  Acción:
    Ninguna. El token está bien nombrado.
```

---

### Inventario completo

#### Patrón 1 — Doble rol (crear nuevo + re-vincular)

| Token actual | Hex | Total usos | Inverse | Default | Token nuevo a crear |
|---|---|---|---|---|---|
| `interactive/background/neutral/default/medium` | `#FCFCFC` | 27 | 2 | 25 | `interactive/background/neutral/inverse/medium` |
| `interactive/background/neutral/disabled` | `#EBEBEB` | 14 | 2 | 12 | `interactive/background/neutral/inverse/disabled` |
| `interactive/border/neutral/default/subtle` | `#FCFCFC` | 3 | 2 | 1 | `interactive/border/neutral/inverse/subtle` |

**Componentes a re-vincular:** Button (Appearance=inverse), Button-icon (Appearance=inverse), Status-bar.
**Total de capas a tocar:** ~6 capas distribuidas en 3 componentes.

#### Patrón 2 — Mal nombrado (rename completo)

| Token actual | Hex | Total usos | Token después del rename |
|---|---|---|---|
| `interactive/foreground/neutral/default/quiet` | `#FCFCFC` | 18 | `interactive/foreground/neutral/inverse/medium` |
| `static/foreground/neutral/primary/subtle` | `#FCFCFC` | 26 | `static/foreground/neutral/inverse/medium` |

**Riesgo:** cero. El `id` se mantiene, los 44 componentes se actualizan automáticamente al refrescar la librería.

**A auditar todavía** (necesitan revisión manual de en qué fondo se aplican):

| Token actual | Hex | Total usos | Posible patrón |
|---|---|---|---|
| `static/background/neutral/quiet` | `#FCFCFC` | 19 | Patrón 2 o 3, depende del uso |
| `static/border/neutral/primary/quiet` | `#FCFCFC` | 23 | Patrón 2 o 3, depende del uso |

#### Patrón 3 — Default puro (sin acción)

| Token actual | Hex | Total usos |
|---|---|---|
| `interactive/background/neutral/hover/medium` | `#EBEBEB` | 7 |
| `static/background/neutral/primary/medium` | `#FCFCFC` | 17 |
| `interactive/background/neutral/default` (legacy sin escala) | `#FCFCFC` | 2 |
| `static/background/neutral/primary-medium` (legacy con guión) | `#FCFCFC` | 3 |

**Sobre los legacy:** los dos últimos son duplicados viejos del rename anterior (sin escala o con guión). Aprovechar la migración para limpiarlos.

---

### Resumen de acciones por patrón

| Patrón | Tokens afectados | Tokens nuevos a crear | Capas a re-vincular | Renames |
|---|---|---|---|---|
| 1 - Doble rol | 3 | 3 | ~6 | 0 |
| 2 - Mal nombrado | 2-4 | 0 | 0 | 2-4 |
| 3 - Default puro | 4+ | 0 | 0 | 0 |
| **Total** | **9-11** | **3** | **~6** | **2-4** |

### Observación importante sobre `Appearance=inverse`

Los componentes con prop `Appearance=inverse` (Button, Button-icon, Status-bar) **no aplican los foregrounds claros del sistema en sus capas inverse**. Los tokens que usan en variants inverse son de spacing, border y backgrounds.

Esto tiene dos interpretaciones posibles a verificar en la auditoría:

1. **El foreground inverse podría estar en building blocks anidados** (con `⛔️`) que no se vinculan en el componente padre.
2. **Las variants `Appearance=inverse` podrían no tener su foreground bien tokenizado** y estar usando hardcoded values.

La auditoría visual del paso 1 del plan de migración va a confirmar cuál es el caso real.

---

## Diferencia entre rename y crear nuevo

Es importante distinguir las dos acciones porque el riesgo es distinto:

### Rename (mantiene id)

```
Token antes:
  default/quiet  [id=ABC123]  → core/neutral/25

Token después del rename:
  inverse/medium  [id=ABC123]  → core/neutral/25
                          ↑
                       mismo id

Componentes consumidores:
  Siguen apuntando a id=ABC123
  Figma resuelve automáticamente al nombre nuevo
  Cero acción manual en componentes
```

### Crear nuevo + re-vincular

```
Token nuevo (id distinto):
  inverse/medium  [id=NEW999]  → core/neutral/25

Token viejo (sigue existiendo):
  default/medium  [id=ABC123]  → core/neutral/25

Componentes a re-vincular manualmente:
  Capa "fills" que usaba [id=ABC123] → cambiar a [id=NEW999]
  Cada componente requiere acción manual en Figma
```

**Por qué la diferencia importa:**
- En el rename, el riesgo es cero porque los `id` no cambian.
- En crear nuevo + re-vincular, hay que tocar cada componente que se quiera mover al token nuevo. Eso introduce posibilidad de error humano.

### Mitigación del riesgo

1. **Hacer la re-vinculación en la librería borrador** (no en producción).
2. **Validar visualmente cada componente** después de re-vincular: el color tiene que verse igual (mismo hex).
3. **Usar el plugin de Foundations Export** para comparar los binding antes y después.
4. **Re-vincular en lotes pequeños** (5-10 capas), no todos juntos.

---

## Decisiones tomadas

1. **Slot `inverse` con escala completa propia** (`bold > medium > subtle > quiet`). Es un espacio paralelo a `default`, no un solo token.
2. **El concepto de prominencia es contextual al slot.** `quiet` significa "apenas visible en el contexto", no un valor cromático absoluto.
3. **Aplica a foreground, background y border.** No solo a foregrounds.
4. **Se justifica duplicar tokens aunque hoy compartan hex.** Los roles son distintos y en dark / tematización divergen naturalmente.
5. **Se incluye en el rename actual**, no se posterga, porque es el mismo tipo de problema (tokens mal nombrados que se solucionan reorganizando slots).
6. **Cero cambio visual.** Los tokens existentes mantienen su `id` y su valor, solo cambia el nombre. Los tokens nuevos (versiones inverse de cosas que no existían) se crean recién cuando hay caso de uso.
7. **Compatible con dark mode y tematización.** El slot `inverse` mantiene su rol coherente en cualquier mode futuro.

---

## Pendiente

- [ ] **Auditoría visual** componente por componente para confirmar la categorización (rename vs crear nuevo vs queda igual)
- [ ] Verificar si los Button / Button-icon / Status-bar con `Appearance=inverse` tienen foregrounds bien tokenizados o usan hardcoded
- [ ] Identificar foregrounds en building blocks anidados (`⛔️`) que puedan necesitar inverse
- [ ] Decidir el destino de los tokens originales después de re-vincular: eliminar o cambiar valor a "quiet legítimo"
- [ ] Decidir si los foregrounds de feedback que van sobre `feedback/bold` también pasan a `inverse`
- [ ] Actualizar `semantic-restructure.md` con la lista final de cambios separada en categorías A, B y C
- [ ] Actualizar `token-architecture.md` con la sección de "Slot inverse" como parte oficial de la nomenclatura
