# Reestructuración de Tokens Semánticos

> Plan para escalar la capa semántica sin volver a tocar nombres.
> Regla de oro: **lo que se nombra hoy, no se renombra mañana. Solo se agrega.**

---

## Por qué hacemos este cambio

### Contexto del proyecto

Estamos pasando a un modelo de **tokens por componente**. Cada componente va a tener sus propios tokens específicos, que apuntan como alias a los semánticos. Esto hace posible:

- Actualizar la apariencia de un componente sin release de la app.
- Que cada equipo construya componentes propios usando los semánticos como base.
- Mantener consistencia mientras damos flexibilidad para casos puntuales.

Como vamos a tener muchos más tokens en este nuevo modelo, **necesitamos que la capa semántica sea predecible, escalable y consistente.**

### Problemas detectados en la nomenclatura actual

Auditando el sistema actual encontramos varios problemas:

1. **Slots vacíos.** Tokens como `static/border/neutral/primary/medium` usan el slot `primary` pero **nunca aparece `secondary` o `tertiary` acompañándolo**. El slot está ahí sin representar nada.

2. **Doble vocabulario para lo mismo.** Tenemos `bold/medium/subtle/quiet` (escala de prominencia) y `primary/secondary/tertiary` (jerarquía). En la práctica, la jerarquía solo se usa de verdad en foreground neutral. En el resto, el slot existe sin propósito.

3. **Colisión de conceptos.** Si renombramos `brand/main` → `brand/primary`, y mantenemos el slot de jerarquía, terminamos con tokens absurdos como `static/foreground/brand/primary/primary/medium`. Dos `primary` en el mismo path con significados distintos (marca vs jerarquía).

4. **Inconsistencias entre tokens.** Hay tokens duplicados con guión (`primary-medium`) y con barra (`primary/medium`). Hay backgrounds con `primary` que nunca tienen acompañantes.

5. **Marca como jerarquía.** `brand/main` y `brand/accent` no se usan igual entre static e interactive — `accent` casi no aparece en interactive. La nomenclatura sugiere jerarquía cuando en realidad son **identidades de marca distintas**.

### Decisión

**Unificar todo bajo una sola escala de prominencia (`bold > medium > subtle > quiet`)** y eliminar el slot de jerarquía donde no representa nada real.

Esto resuelve todos los problemas de arriba con una sola decisión:

- `bold/medium/subtle/quiet` significa lo mismo en todos lados: prominencia.
- Donde hoy se usaba `primary` como jerarquía visual (texto principal vs apoyo vs auxiliar), ahora se mapea a la escala (`medium` = principal, `subtle` = apoyo, `quiet` = auxiliar).
- El slot de marca (`brand/primary`, `brand/secondary`) queda libre de colisión.
- Los tokens donde el slot estaba vacío se simplifican.

### Cómo llegamos a esto

Pensamos cuatro caminos antes de decidir:

| Camino | Resultado |
|---|---|
| Mantener todo igual | No resuelve los problemas, solo los pospone |
| Renombrar marca y mantener jerarquía | Genera colisiones (`primary/primary`) |
| Renombrar marca y sacar jerarquía solo donde no aplica | Mejora pero deja dos vocabularios distintos para foreground |
| **Unificar todo bajo escala** | Una lógica única, predecible, sin slots vacíos |

El cuarto camino requiere documentar bien que `bold` no significa "font-weight bold" sino "más prominente del contexto". Es el único punto que necesita reforzarse en el equipo.

---

## Decisiones tomadas

1. **Unificar todo static bajo escala** (`bold > medium > subtle > quiet`). Eliminar el slot de jerarquía (`primary/secondary/tertiary`) donde no representa capas reales.
2. **Mantener escala de 4 niveles.** `strong` y `soft` quedan como **slots de emergencia** documentados, no para uso normal.
3. **Rename de marca:** `brand/main` → `brand/primary`, `brand/accent` → `brand/secondary`.
4. **Tematización:** modes nativos de Figma en primitivos. Semánticos sin modes.
5. **Estructura semántica precisa:** se documenta correctamente la presencia de sub-familia.

---

## Estructura semántica precisa

```
[contexto]/[elemento]/[familia]/[sub-familia?]/[variante?]/[escala]
```

Cada slot es opcional según el caso:

| Slot | Cuándo aparece |
|---|---|
| `[contexto]` | Siempre (`static`, `interactive`, `expressive`) |
| `[elemento]` | Siempre (`background`, `foreground`, `border`, `opacity`) |
| `[familia]` | Siempre (`neutral`, `brand`, `feedback`, `expressive`) |
| `[sub-familia]` | Solo cuando la familia se subdivide (`brand/primary`, `feedback/error`) |
| `[variante]` | Solo en `interactive` (estado: `hover`, `pressed`, etc.) |
| `[escala]` | Casi siempre (`bold`, `medium`, `subtle`, `quiet`) |

### Familias del sistema

| Familia | Sub-familia | Ejemplo |
|---|---|---|
| `brand` | `primary` / `secondary` | `brand/primary` |
| `feedback` | `info` / `success` / `warning` / `error` | `feedback/error` |
| `neutral` | — (es cross) | `neutral` |
| `expressive` | `purple` / `sapphire` / `magenta` / etc. | `expressive/sapphire` |

### Por qué hay sub-familia en algunos casos y no en otros

- **brand** es una familia compuesta — tiene marcas dentro (`primary`, `secondary`)
- **feedback** es una familia compuesta — tiene tipos dentro (`info`, `success`, `warning`, `error`)
- **expressive** es una familia compuesta — tiene paletas decorativas dentro
- **neutral** es una familia simple — no se subdivide, es cross al sistema

---

## Estructura final propuesta

### Static foreground (texto, iconos, pictogramas)

```
static/foreground/
│
├── neutral/                      ← familia simple, sin sub-familia
│   ├── bold                      → texto enfatizado
│   ├── medium                    → texto principal (default)
│   ├── subtle                    → texto secundario / apoyo
│   └── quiet                     → texto auxiliar / disabled
│
├── brand/
│   ├── primary/                  ← marca principal (purple)
│   │   ├── bold
│   │   ├── medium
│   │   └── subtle
│   └── secondary/                ← marca secundaria (cyan)
│       ├── bold
│       ├── medium
│       └── subtle
│
└── feedback/
    ├── info/
    │   └── medium
    ├── success/
    │   └── medium
    ├── warning/
    │   └── medium
    └── error/
        └── medium
```

### Static background (fondos)

```
static/background/
│
├── neutral/
│   ├── medium                    → fondo principal
│   ├── subtle                    → fondo más suave
│   └── quiet                     → fondo casi invisible
│
├── brand/
│   ├── primary/
│   │   ├── medium                → fondo en marca primary
│   │   ├── subtle
│   │   └── quiet
│   └── secondary/
│       ├── medium
│       └── subtle
│
└── feedback/
    ├── info/
    │   ├── bold                  → banner de info destacado
    │   └── subtle                → fondo suave informativo
    ├── success/
    │   ├── bold
    │   └── subtle
    ├── warning/
    │   ├── bold
    │   └── subtle
    └── error/
        ├── bold
        └── subtle
```

### Static border

```
static/border/
│
├── neutral/
│   ├── medium                    → borde principal
│   ├── subtle                    → borde decorativo
│   └── quiet                     → borde casi invisible
│
├── brand/
│   ├── primary/
│   │   └── medium
│   └── secondary/
│       └── medium
│
└── feedback/
    ├── info/
    │   └── medium
    ├── success/
    │   └── medium
    ├── warning/
    │   └── medium
    └── error/
        └── medium
```

### Interactive (con estado)

```
interactive/background/
│
├── neutral/
│   ├── default/medium
│   ├── hover/medium
│   ├── pressed/medium
│   ├── focus/medium
│   └── disabled
│
├── brand/
│   ├── primary/
│   │   ├── default/medium
│   │   ├── hover/medium
│   │   ├── pressed/medium
│   │   └── focus/medium
│   └── secondary/
│       └── default/medium
```

```
interactive/foreground/
│
├── neutral/
│   ├── default/medium
│   ├── disabled/bold
│   └── disabled/medium
│
└── brand/
    ├── primary/
    │   ├── default/medium
    │   ├── default/bold
    │   └── pressed/medium
    └── secondary/
        ├── default/medium
        └── default/bold
```

```
interactive/border/
│
├── neutral/
│   ├── default/medium
│   └── disabled/medium
│
└── brand/
    ├── primary/
    │   ├── default/medium
    │   ├── default/subtle
    │   ├── hover/medium
    │   ├── hover/subtle
    │   ├── pressed/medium
    │   ├── pressed/subtle
    │   ├── focus/medium
    │   └── focus/subtle
    └── secondary/
        └── active/medium
```

### Expressive (decorativo)

```
expressive/
│
├── purple/
│   ├── medium
│   └── subtle
├── sapphire/
│   ├── medium
│   └── subtle
├── magenta/
│   ├── medium
│   └── subtle
└── illustration/
    ├── purple/
    │   ├── medium
    │   └── subtle
    └── sapphire/
        ├── medium
        ├── bold
        └── subtle
```

---

## Ejemplos de uso

### Texto en una card
```
Title         → static/foreground/neutral/medium    (default, principal)
Description   → static/foreground/neutral/subtle    (apoyo)
Caption       → static/foreground/neutral/quiet     (auxiliar)
```

### Texto enfatizado en marca
```
Highlight     → static/foreground/brand/primary/medium
CTA label     → static/foreground/brand/primary/bold
```

### Banner de feedback
```
Fondo         → static/background/feedback/info/bold
Borde         → static/border/feedback/info/medium
Texto         → static/foreground/feedback/info/medium
Icono         → static/foreground/feedback/info/medium
```

### Card neutral con borde
```
Fondo         → static/background/neutral/medium
Borde         → static/border/neutral/subtle
Title         → static/foreground/neutral/medium
Description   → static/foreground/neutral/subtle
```

### Botón primary
```
Fondo default  → interactive/background/brand/primary/default/medium
Fondo hover    → interactive/background/brand/primary/hover/medium
Fondo pressed  → interactive/background/brand/primary/pressed/medium
Borde focus    → interactive/border/brand/primary/focus/medium
Texto          → interactive/foreground/brand/primary/default/bold
Texto disabled → interactive/foreground/neutral/disabled/medium
```

### Card decorativa
```
Fondo           → expressive/sapphire/subtle
Ilustración     → expressive/illustration/sapphire/medium
Title           → static/foreground/neutral/medium
Description     → static/foreground/neutral/subtle
```

---

## Cambios principales

### 1. Eliminar slot de jerarquía donde no representa capas reales

| Antes | Después |
|---|---|
| `static/foreground/neutral/primary/medium` | `static/foreground/neutral/medium` |
| `static/foreground/neutral/secondary/medium` | `static/foreground/neutral/subtle` |
| `static/foreground/neutral/tertiary/medium` | `static/foreground/neutral/quiet` |
| `static/foreground/neutral/tertiary/subtle` | `static/foreground/neutral/quiet` *(merge)* |
| `static/foreground/neutral/primary/subtle` | `static/foreground/neutral/subtle` *(merge)* |
| `static/foreground/neutral/secondary` | `static/foreground/neutral/subtle` *(merge)* |
| `static/foreground/neutral/tertiary-subtle` | borrar (duplicado viejo) |
| `static/background/neutral/primary/medium` | `static/background/neutral/medium` |
| `static/background/neutral/primary/bold` | revisar valor (parece foreground mal aplicado) |
| `static/background/neutral/primary-medium` | borrar (duplicado viejo) |
| `static/border/neutral/primary/medium` | `static/border/neutral/medium` |
| `static/border/neutral/primary/subtle` | `static/border/neutral/subtle` |
| `static/border/neutral/primary/quiet` | `static/border/neutral/quiet` |

### 2. Rename de marcas

`brand/main` → `brand/primary`:

| Antes | Después |
|---|---|
| `static/foreground/brand/main/primary/medium` | `static/foreground/brand/primary/medium` |
| `static/foreground/brand/main/primary/bold` | `static/foreground/brand/primary/bold` |
| `static/background/brand/main/medium` | `static/background/brand/primary/medium` |
| `static/background/brand/main/subtle` | `static/background/brand/primary/subtle` |
| `static/background/brand/main/quiet` | `static/background/brand/primary/quiet` |
| `static/background/brand/main/primary/quiet` | `static/background/brand/primary/quiet` *(merge)* |
| `static/border/brand/primary` | `static/border/brand/primary/medium` |
| `interactive/foreground/brand/main/default/medium` | `interactive/foreground/brand/primary/default/medium` |
| `interactive/foreground/brand/main/default/bold` | `interactive/foreground/brand/primary/default/bold` |
| `interactive/foreground/brand/main/pressed/medium` | `interactive/foreground/brand/primary/pressed/medium` |
| `interactive/border/brand/main/default/medium` | `interactive/border/brand/primary/default/medium` |
| `interactive/border/brand/main/default/subtle` | `interactive/border/brand/primary/default/subtle` |
| `interactive/border/brand/main/hover/medium` | `interactive/border/brand/primary/hover/medium` |
| `interactive/border/brand/main/hover/subtle` | `interactive/border/brand/primary/hover/subtle` |
| `interactive/border/brand/main/pressed/medium` | `interactive/border/brand/primary/pressed/medium` |
| `interactive/border/brand/main/pressed/subtle` | `interactive/border/brand/primary/pressed/subtle` |
| `interactive/border/brand/main/focus/medium` | `interactive/border/brand/primary/focus/medium` |
| `interactive/border/brand/main/focus/subtle` | `interactive/border/brand/primary/focus/subtle` |

`brand/accent` → `brand/secondary`:

| Antes | Después |
|---|---|
| `static/background/brand/accent/medium` | `static/background/brand/secondary/medium` |
| `static/background/brand/accent/subtle` | `static/background/brand/secondary/subtle` |
| `static/foreground/brand/accent/primary/medium` | `static/foreground/brand/secondary/medium` |
| `static/foreground/brand/accent/primary/bold` | `static/foreground/brand/secondary/bold` |
| `static/border/brand/secondary` | `static/border/brand/secondary/medium` |
| `interactive/foreground/brand/accent/default/medium` | `interactive/foreground/brand/secondary/default/medium` |
| `interactive/foreground/brand/accent/default/bold` | `interactive/foreground/brand/secondary/default/bold` |
| `interactive/border/brand/accent/active/medium` | `interactive/border/brand/secondary/active/medium` |

### 3. Agregar slot de escala donde falta

Tokens de feedback que hoy no tienen escala (un solo nivel):

| Antes | Después |
|---|---|
| `static/foreground/feedback/error` | `static/foreground/feedback/error/medium` |
| `static/foreground/feedback/info` | `static/foreground/feedback/info/medium` |
| `static/foreground/feedback/success` | `static/foreground/feedback/success/medium` |
| `static/foreground/feedback/warning` | `static/foreground/feedback/warning/medium` |
| `static/border/feedback/error` | `static/border/feedback/error/medium` |
| `static/border/feedback/info` | `static/border/feedback/info/medium` |
| `static/border/feedback/success` | `static/border/feedback/success/medium` |
| `static/border/feedback/warning` | `static/border/feedback/warning/medium` |

---

## Escala de intensidades

### Escala definitiva (4 niveles)

```
bold > medium > subtle > quiet
```

### Definición

| Intensidad | Significado | Cuándo usar |
|---|---|---|
| `bold` | El más prominente del contexto | Texto enfatizado, fondos de feedback fuertes, CTAs |
| `medium` | El valor principal del contexto (default) | Uso diario |
| `subtle` | Versión suave/secundaria | Texto de apoyo, fondos tenues, bordes decorativos |
| `quiet` | Apenas visible | Texto auxiliar / disabled, overlays, separadores |

### Slots reservados de emergencia

```
bold > [strong]* > medium > [soft]* > subtle > quiet

* solo agregar si aparece un caso real que la escala de 4 no cubre
```

`strong` y `soft` quedan documentados como **slots de emergencia**, no parte del set normal de uso. Solo se agregan cuando un caso concreto no se resuelve con los 4 niveles. Si se agregan, ya tienen su slot reservado en la escala (entre `bold`/`medium` y entre `medium`/`subtle`).

### Escalas son contextuales

Las intensidades son **contextuales** — describen prominencia visual dentro de su contexto, no un valor absoluto en la paleta primitiva.

#### Caso A — Dentro de la misma escala

Foreground neutral, todos los `medium` apuntan a primitivos cercanos (rango acotado):

```
static/foreground/neutral/medium   → core/neutral/700   #404040
static/foreground/neutral/subtle   → core/neutral/500   #676767
static/foreground/neutral/quiet    → core/neutral/300   ~#C0C0C0
```

Hay coherencia interna. La diferencia entre niveles es predecible.

#### Caso B — Entre escalas distintas

Mismo nombre `medium`, distinto elemento:

```
static/foreground/neutral/medium   → core/neutral/700   #404040   ← oscuro
static/background/neutral/medium   → core/neutral/25    #FCFCFC   ← claro
static/border/neutral/medium       → core/neutral/300   ~#C0C0C0  ← medio
```

Los valores absolutos cambian. **Pero el rol es el mismo en cada escala**: "el default del contexto". El primitivo cambia porque el contexto visual cambia.

> **Para el equipo:** `medium` no significa "este hex específico". Significa "el valor principal de uso para este elemento". Es esperable que un `medium` de foreground sea oscuro y un `medium` de background sea claro.

---

## Tablas de rango por (elemento × familia)

Cada combinación tiene su rango de primitivo predecible.

### Neutral

#### Foreground
| Intensidad | Primitivo |
|---|---|
| `bold` | core/neutral/950 |
| `medium` | core/neutral/700 |
| `subtle` | core/neutral/500 |
| `quiet` | core/neutral/300 |

#### Background
| Intensidad | Primitivo |
|---|---|
| `medium` | core/neutral/50 |
| `subtle` | core/neutral/25 |
| `quiet` | core/neutral/10 |

#### Border
| Intensidad | Primitivo |
|---|---|
| `medium` | core/neutral/300 |
| `subtle` | core/neutral/200 |
| `quiet` | core/neutral/100 |

### Brand primary (purple)

#### Foreground
| Intensidad | Primitivo |
|---|---|
| `bold` | core/purple/900 |
| `medium` | core/purple/500 |
| `subtle` | core/purple/300 |

#### Background
| Intensidad | Primitivo |
|---|---|
| `medium` | core/purple/500 |
| `subtle` | core/purple/200 |
| `quiet` | core/purple/50 |

#### Border
| Intensidad | Primitivo |
|---|---|
| `medium` | core/purple/500 |

### Brand secondary (cyan)
*Misma estructura que Brand primary, sustituyendo `purple` por `cyan`.*

### Feedback (error, success, warning, info)

#### Foreground / Border
| Intensidad | Primitivo |
|---|---|
| `medium` | core/[color]/600 |

#### Background
| Intensidad | Primitivo |
|---|---|
| `bold` | core/[color]/600 |
| `subtle` | core/[color]/100 |

> **Nota:** estos rangos son sugerencias iniciales. La auditoría va a confirmar exactamente qué primitivo apunta cada token y ajustar donde haga falta.

---

## Dark mode con modes en primitivos

(Detalle completo en `token-architecture.md` → sección "Modos de color")

**Resumen:**
- Una sola colección `core` con modes `Light` y `Dark`
- Semánticos sin modes (un solo alias)
- Componentes sin modes (alias al semántico)
- Tres formas de definir el valor Dark: mismo valor / valor ajustado / primitivo nuevo
- `core/dark/` solo como rama de excepción

---

## Plan de migración

> **Estrategia general:** trabajar siempre en una librería borrador. Validar con un archivo de componentes copia. Solo después aplicar en producción. Comparar JSONs antes y después para detectar cualquier referencia rota.

### Paso 1 — Foundations borrador

1. **Duplicar la librería real** en Figma → renombrar a "Foundations Borrador".
2. **Eliminar slots de jerarquía** donde no aplica (foreground neutral pasa a usar solo escala, backgrounds y borders neutral pierden el slot `primary`).
3. **Renombrar las marcas** (`brand/main` → `brand/primary`, `brand/accent` → `brand/secondary`).
4. **Agregar el slot de escala** donde falta (feedbacks que hoy son un solo nivel pasan a `/medium`).
5. **Construir tablas de rango por (elemento × familia)** con los primitivos exactos de la paleta.
6. **Auditar tokens** y ajustar primitivos si están fuera del rango definido.
7. **Configurar mode `Dark`** en los primitivos (puede hacerse después).
8. **Publicar Foundations Borrador** como librería separada.

### Paso 2 — Validación con componentes copia

1. **Duplicar el archivo de componentes** que usa Foundations Real → "Componentes Test".
2. En Componentes Test, abrir **Assets → Libraries**.
3. Hacer **Swap** de Foundations Real → Foundations Borrador.
4. Figma reemplaza las referencias automáticamente. Los `id` se mantienen durante el rename, así que los componentes encuentran sus tokens aunque tengan nombres distintos.

**Qué validar:**
- Ningún componente con tokens en rojo (referencia rota).
- Los colores se ven igual que antes.
- Los estados (hover, focus, pressed) se ven correctos.

### Paso 3 — Validación con diff de JSONs

#### Plugin "Foundations Export" (`figma-plugin-foundations-export/`)
- Corre sobre la librería actual (no necesita selección).
- Lee inventario completo de variables: `id`, nombre, colección, valor en cada mode, alias.
- Descarga un JSON con todo el inventario.

#### Herramienta de diff (`tools/foundations-diff/index.html`)
- HTML standalone en el navegador.
- Cargás dos JSONs y compará por `id`.
- Muestra: Sin cambios / Renombrados / Valor cambiado / Solo en A / Solo en B / Conflicto de ID.

#### Flujo

```
1. Antes del rename:
   Foundations Real → Plugin Foundations Export → real-antes.json

2. Después del rename en Foundations Borrador:
   Foundations Borrador → Plugin Foundations Export → borrador.json

3. Foundations Diff:
   - JSON A: real-antes.json
   - JSON B: borrador.json
   - Verificar:
     ✓ Renombrados visibles y esperados
     ✓ 0 tokens en "Conflicto de ID"
     ✓ 0 tokens en "Solo en A" inesperados
     ✓ Valores cambiados solo donde se hizo auditoría
```

### Paso 4 — Rename en producción

Solo después de validar borrador + componentes copia + diff JSON.

1. **Exportar el estado actual** de Foundations Real con el plugin → `real-pre-rename.json` (respaldo).
2. **Aplicar los renames manuales** en Foundations Real (los mismos cambios que se hicieron en borrador).
3. **Republicar** la librería.
4. **Volver a exportar** → `real-post-rename.json`.
5. **Diff final** entre `real-pre-rename.json` y `real-post-rename.json`. Debe verse igual al diff que hicimos en el paso 3.
6. Los equipos consumidores aceptan la nueva versión al actualizar Figma.

> **Por qué hacemos los cambios manuales dos veces (borrador + real) en vez de copiar Borrador a Real:** porque Foundations Real ya está publicada y consumida por componentes en producción. Reemplazarla con un archivo distinto rompería las referencias. La única forma segura es renombrar in-place sobre el archivo real, manteniendo el `id`.

### Paso 5 — Actualizar herramientas y docs

- `figma-plugin-generator/src/code.ts` — actualizar referencias a nombres viejos.
- `docs/token-architecture.md` — actualizar tabla de marcas y la sección de jerarquía/escala.
- `src/components/Documentation.tsx` — refrescar contenido del dashboard.
- Mensaje al equipo consumidor con el changelog.

---

## Resumen ejecutivo

| Cambio | Tokens afectados | Tipo |
|---|---|---|
| Eliminar slot `primary/secondary/tertiary` en static foreground neutral | ~7 | Rename + merge |
| Eliminar slot `primary` en static backgrounds neutrales | ~3 | Rename |
| Eliminar slot `primary` en static borders neutrales | ~3 | Rename |
| `brand/main` → `brand/primary` | 17 | Rename |
| `brand/accent` → `brand/secondary` | 7 | Rename |
| Agregar slot `/medium` en feedbacks sin escala | ~8 | Rename |
| Borrar duplicados con guión | 2 | Cleanup |
| Tablas de rango por (elemento × familia) | Todo el sistema | Auditoría |
| Modes Light/Dark en primitivos | Toda la paleta core | Configuración |

**Total estimado de tokens renombrados:** ~50.
**La escala de 4 niveles se mantiene.**
