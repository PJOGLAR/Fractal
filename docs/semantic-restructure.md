# Reestructuración de Tokens Semánticos

> Plan para escalar la capa semántica sin volver a tocar nombres.
> Regla de oro: **lo que se nombra hoy, no se renombra mañana. Solo se agrega.**

---

## Decisiones tomadas

1. **Rename de marca:** `brand/main` → `brand/primary`, `brand/accent` → `brand/secondary`
2. **Escala de intensidades:** se mantiene `bold > medium > subtle > quiet`. Se reservan slots para agregar `strong` y `soft` en el futuro sin renombrar.
3. **Tematización:** modes nativos de Figma en primitivos, semánticos sin modes
4. **Slots predecibles:** cada nivel tiene un rango de primitivo definido por (elemento × marca)
5. **Estructura semántica precisa:** se documenta correctamente la presencia de sub-familia (la doc actual la simplifica como "marca")

---

## Estructura semántica precisa

La nomenclatura real del sistema es:

```
[contexto]/[elemento]/[familia]/[sub-familia?]/[variante]/[intensidad]
```

`[sub-familia]` es **opcional**. Solo aparece cuando la familia se subdivide.

### Familias del sistema

| Familia | Sub-familia | Ejemplo |
|---|---|---|
| `brand` | `primary` / `secondary` | `brand/primary` |
| `feedback` | `info` / `success` / `warning` / `error` | `feedback/error` |
| `neutral` | — (es cross) | `neutral` |
| `expressive` | `purple` / `sapphire` / `magenta` / etc. | `expressive/sapphire` |

### Por qué tiene sentido

- **brand** es una familia compuesta — tiene marcas dentro (`primary`, `secondary`)
- **feedback** es una familia compuesta — tiene tipos dentro (`info`, `success`, `warning`, `error`)
- **expressive** es una familia compuesta — tiene paletas decorativas dentro
- **neutral** es una familia simple — no se subdivide, es cross al sistema

`neutral` se "salta" el slot de sub-familia porque no tiene variantes. Va directo a la `variante` semántica (primary, secondary, tertiary).

### Comparativa de tokens reales

```
static/foreground/brand/primary/primary/medium   ← contexto/elem/familia/sub-fam/variante/intensidad
static/foreground/neutral/primary/medium         ← contexto/elem/familia/         variante/intensidad
static/background/feedback/info/bold             ← contexto/elem/familia/sub-fam/         intensidad
```

> La documentación actual simplifica este slot como "marca" y eso confunde. Lo correcto es entenderlo como `familia/sub-familia` para que el equipo no piense que `neutral` es una marca o que `feedback` es una intensidad.

---

## Cambio 1 — Rename de marcas

### Mapeo

| Antes | Después |
|---|---|
| `brand/main` | `brand/primary` |
| `brand/accent` | `brand/secondary` |

**Razón:** `main` y `accent` no se usan igual en static y interactive. `primary`/`secondary` son universales, no se confunden con intensidades, y dejan libre `accent` para usos futuros.

### Tokens afectados

#### `brand/main` → `brand/primary` (17 tokens)

| Antes | Después |
|---|---|
| `static/foreground/brand/main/primary/medium` | `static/foreground/brand/primary/medium` |
| `static/foreground/brand/main/primary/bold` | `static/foreground/brand/primary/bold` |
| `static/background/brand/main/medium` | `static/background/brand/primary/medium` |
| `static/background/brand/main/subtle` | `static/background/brand/primary/subtle` |
| `static/background/brand/main/quiet` | `static/background/brand/primary/quiet` |
| `static/background/brand/main/primary/quiet` | `static/background/brand/primary/quiet` *(merge)* |
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

#### `brand/accent` → `brand/secondary` (7 tokens)

| Antes | Después |
|---|---|
| `static/background/brand/accent/medium` | `static/background/brand/secondary/medium` |
| `static/background/brand/accent/subtle` | `static/background/brand/secondary/subtle` |
| `static/foreground/brand/accent/primary/medium` | `static/foreground/brand/secondary/medium` |
| `static/foreground/brand/accent/primary/bold` | `static/foreground/brand/secondary/bold` |
| `interactive/foreground/brand/accent/default/medium` | `interactive/foreground/brand/secondary/default/medium` |
| `interactive/foreground/brand/accent/default/bold` | `interactive/foreground/brand/secondary/default/bold` |
| `interactive/border/brand/accent/active/medium` | `interactive/border/brand/secondary/active/medium` |

> **Duplicados detectados:** `static/background/brand/main/quiet` y `static/background/brand/main/primary/quiet` apuntan al mismo concepto. Aprovechar el rename para consolidar a `static/background/brand/primary/quiet`.

---

## Cambio 2 — Escala de intensidades (con slots reservados)

### Escala actual (sin cambios)

```
bold > medium > subtle > quiet
```

### Escala completa con slots reservados

```
bold > [strong]* > medium > [soft]* > subtle > quiet
       ↑                    ↑
    nuevo intermedio    nuevo intermedio
    a agregar cuando    a agregar cuando
    se necesite          se necesite

* slots reservados — se agregan, nunca se renombran los existentes
```

### Definición de cada nivel

| Intensidad | Estado | Significado | Cuándo usar |
|---|---|---|---|
| `bold` | actual | El más prominente del contexto | Fondos de feedback, CTAs principales, foreground oscuro fuerte |
| `strong` | reservado | Más intenso que medium pero menos que bold | Hover sobre estados ya prominentes, secundarios fuertes |
| `medium` | actual | Valor principal del contexto (default) | Uso diario |
| `soft` | reservado | Más suave que medium pero menos que subtle | Cards informativas, separadores semi-visibles |
| `subtle` | actual | Versión suave/secundaria | Fondos tenues, bordes decorativos |
| `quiet` | actual | Apenas visible | Overlays, separadores casi imperceptibles |

### Regla de orden (constante en todo el sistema)

```
bold > strong > medium > soft > subtle > quiet
```

Esto es lo único que el equipo necesita memorizar.

### Cómo agregar un slot reservado

Si mañana se necesita `strong`:

1. Buscás el rango de primitivo definido para `strong` en la tabla del contexto correspondiente.
2. Creás el semántico con ese primitivo.
3. **No tocás ningún token existente.**

---

## Tablas de rango por (elemento × marca)

> **Fuente de verdad técnica.** Cada nivel actual y reservado tiene un rango predecible.
> Cuando entre `strong` o `soft`, ya tienen su slot definido y solo se agregan.

### Neutral

#### Foreground (texto, iconos)
| Intensidad | Estado | Rango primitivo |
|---|---|---|
| `bold` | actual | core/neutral/900-950 |
| `strong` | reservado | core/neutral/800 |
| `medium` | actual | core/neutral/600-700 |
| `soft` | reservado | core/neutral/400-500 |
| `subtle` | actual | core/neutral/200-300 |
| `quiet` | actual | core/neutral/25-100 |

#### Background (fondos)
| Intensidad | Estado | Rango primitivo |
|---|---|---|
| `bold` | actual | core/neutral/75-100 |
| `strong` | reservado | core/neutral/50 |
| `medium` | actual | core/neutral/25 |
| `soft` | reservado | core/neutral/15-20 |
| `subtle` | actual | core/neutral/10 |
| `quiet` | actual | core/neutral/5 |

#### Border
| Intensidad | Estado | Rango primitivo |
|---|---|---|
| `bold` | actual | core/neutral/600-700 |
| `strong` | reservado | core/neutral/400-500 |
| `medium` | actual | core/neutral/300 |
| `soft` | reservado | core/neutral/200 |
| `subtle` | actual | core/neutral/100 |
| `quiet` | actual | core/neutral/25-50 |

### Brand primary (purple)

#### Foreground
| Intensidad | Estado | Rango primitivo |
|---|---|---|
| `bold` | actual | core/purple/900-950 |
| `strong` | reservado | core/purple/700-800 |
| `medium` | actual | core/purple/500-600 |
| `soft` | reservado | core/purple/400 |
| `subtle` | actual | core/purple/200-300 |
| `quiet` | actual | core/purple/50-100 |

#### Background
| Intensidad | Estado | Rango primitivo |
|---|---|---|
| `bold` | actual | core/purple/600-700 |
| `strong` | reservado | core/purple/500 |
| `medium` | actual | core/purple/400 |
| `soft` | reservado | core/purple/200-300 |
| `subtle` | actual | core/purple/100 |
| `quiet` | actual | core/purple/25-50 |

#### Border
| Intensidad | Estado | Rango primitivo |
|---|---|---|
| `bold` | actual | core/purple/600-700 |
| `strong` | reservado | core/purple/400-500 |
| `medium` | actual | core/purple/300 |
| `soft` | reservado | core/purple/200 |
| `subtle` | actual | core/purple/100 |
| `quiet` | actual | core/purple/25-50 |

### Brand secondary (cyan)
*Misma estructura que Brand primary, sustituyendo `purple` por `cyan`.*

### Feedback (error, success, warning, info)
*Misma estructura que Brand primary, una tabla por color de feedback.*

> Cuando entre una marca o color nuevo, se replica esta estructura. Los **rangos** son el patrón.

---

## Auditoría necesaria

Antes de aplicar el rename, hay que verificar que cada token actual encaje en su rango definido.

**Si un token actual apunta a un primitivo fuera del rango de su nivel:**
- Si encaja en otro slot existente (ej. era `medium` pero por su valor parece `bold`), se renombra a ese slot.
- Si encaja en un slot reservado (`strong` o `soft`), se aprovecha la migración para ya crearlo con el nombre correcto.
- Si no encaja en ningún slot, se ajusta el valor del primitivo o se evalúa si la tabla necesita revisión.

Esto se hace **una sola vez** en la migración. Después, los rangos son la verdad y los tokens nuevos los respetan.

---

## Cambio 3 — Dark mode con modes en primitivos

(Detalle completo en `token-architecture.md` → sección "Modos de color")

**Resumen:**
- Una sola colección `core` con modes `Light` y `Dark`
- Semánticos sin modes (un solo alias)
- Componentes sin modes (alias al semántico)
- Tres formas de definir el valor Dark: mismo valor / valor ajustado / primitivo nuevo
- `core/dark/` solo como rama de excepción

---

## Estructura final

```
[contexto]/[elemento]/[marca]/[variante]/[intensidad]
```

### Contextos
- `static` — no cambia con interacción
- `interactive` — responde a estados
- `expressive` — decorativo / ilustrativo

### Familias
- `brand/primary` — marca principal (purple)
- `brand/secondary` — marca madre/secundaria (cyan)
- `neutral` — familia simple, sin sub-familia
- `feedback` — `info`, `success`, `warning`, `error`
- `expressive` — paletas decorativas (purple, sapphire, magenta, etc.)

### Intensidades (escala completa)
```
bold > [strong] > medium > [soft] > subtle > quiet

[ ] = slots reservados, se agregan cuando se necesiten
```

### Estados de interactive
`default`, `hover`, `pressed`, `focus`, `active`, `disabled`, `selected`

---

## ¿Qué pasa si se necesita más granularidad en el futuro?

Improbable, pero contemplado. Hay rutas que **no requieren renombrar:**

### Ruta 1 — Sufijo entre niveles
Si necesitás algo entre dos niveles existentes:
```
bold-strong   ← entre bold y strong
medium-soft   ← entre medium y soft
```

### Ruta 2 — Nivel nuevo con nombre propio
Si el caso es muy específico y representa un concepto:
```
loud      → más intenso que bold (extremadamente raro)
faint     → entre subtle y quiet (caso especial)
```

Solo se usa cuando los slots actuales + sufijos no representan el caso. Documentado como excepción.

---

## Plan de migración

> **Estrategia general:** trabajar siempre en una librería borrador. Validar con un archivo de componentes copia. Solo después aplicar en producción. Comparar JSONs antes y después para detectar cualquier referencia rota.

### Paso 1 — Foundations borrador

El objetivo es preparar todos los cambios en una librería separada, sin tocar la real.

1. **Duplicar la librería real** en Figma: clickear el archivo de Foundations Real → Duplicate → renombrar a "Foundations Borrador".
2. **Renombrar las marcas** en Foundations Borrador:
   - Variables panel → seleccionar el variable → click derecho → Rename → escribir el nombre nuevo.
   - 24 tokens en total (17 de `brand/main` + 7 de `brand/accent`).
   - Figma mantiene el `id` del variable, así que las referencias internas se preservan.
3. **Construir las tablas de rango por (elemento × marca)** con los primitivos exactos de la paleta. Esto es trabajo de definición, no de ejecución.
4. **Auditar cada token** y ajustar su primitivo si está fuera del rango definido. Esto sí cambia valores, no nombres.
5. **Configurar mode `Dark`** en todos los primitivos (puede hacerse después, no bloquea el rename).
6. **Publicar Foundations Borrador** como librería separada (no reemplaza a la real).

### Paso 2 — Validación con componentes copia

El punto delicado: ¿cómo probamos que los componentes siguen funcionando si están conectados a la librería real?

**Solución: Swap library de Figma.**

1. **Duplicar el archivo de componentes** que usa Foundations Real → renombrar a "Componentes Test".
2. En Componentes Test, abrir el panel **Assets → Libraries**.
3. Hacer **Swap** de Foundations Real → Foundations Borrador.
4. Figma reemplaza las referencias automáticamente. Como mantuvimos los `id` durante el rename, los componentes encuentran sus tokens aunque tengan nombres distintos.

**Qué validar después del swap:**
- Ningún componente tiene tokens en rojo (referencia rota).
- Los colores se ven igual que antes (los valores no cambiaron, solo los nombres).
- Los estilos de tipografía siguen aplicando.
- Los estados (hover, focus, pressed) se ven correctos.

Si algo se rompe acá, lo detectás sin haber tocado producción.

### Paso 3 — Validación con diff de JSONs

Para tener una prueba **objetiva y auditable** de que los renames se aplicaron correctamente, comparamos el inventario de variables antes y después.

Herramientas que dejamos preparadas:

#### Plugin "Foundations Export" (`figma-plugin-foundations-export/`)
- Corre sobre la librería actual (no necesita selección).
- Lee el inventario completo de variables: `id`, nombre, colección, valor en cada mode, alias.
- Descarga un JSON con todo el inventario.

#### Herramienta de diff (`tools/foundations-diff/index.html`)
- HTML standalone que abrís en el navegador.
- Cargás dos JSONs (borrador y real) y compará por `id`.
- Muestra:
  - **Sin cambios** — token con mismo id, mismo nombre, mismo valor.
  - **Renombrados** — mismo id, nombre distinto. Esperado en los 24 tokens de marca.
  - **Valor cambiado** — mismo id, mismo nombre, valor distinto. Detecta ajustes de auditoría.
  - **Solo en A** / **Solo en B** — variables que existen en uno y no en el otro.
  - **Conflicto de ID** — mismo nombre con id distinto. **Esto es la alarma:** indica que se perdió la referencia (en vez de renombrar, se creó un variable nuevo con el nombre correcto).
- Filtros, búsqueda y exportación del diff completo a JSON.

#### Flujo de comparación

```
1. Antes del rename:
   Foundations Real → Plugin Foundations Export → real-antes.json

2. Después de hacer los renames en Foundations Borrador:
   Foundations Borrador → Plugin Foundations Export → borrador.json

3. Foundations Diff (HTML):
   - JSON A: real-antes.json
   - JSON B: borrador.json
   - Verificar:
     ✓ 24 tokens en "Renombrados" (las marcas)
     ✓ 0 tokens en "Conflicto de ID"
     ✓ 0 tokens en "Solo en A" inesperados
     ✓ Valores cambiados solo donde se hizo auditoría
```

Si todo se ve correcto → la librería borrador está lista para promover a producción.

### Paso 4 — Rename en producción

Solo después de validar borrador + componentes copia + diff JSON.

1. **Antes de tocar la real, exportar su estado actual** con el plugin Foundations Export → guardar `real-pre-rename.json`. Esto sirve como respaldo y como "antes" para el diff final.
2. **Aplicar los renames manuales** en Foundations Real (los mismos 24 que se hicieron en borrador).
3. **Republicar** la librería real.
4. **Volver a exportar** el inventario con el plugin → `real-post-rename.json`.
5. **Hacer un diff final** entre `real-pre-rename.json` y `real-post-rename.json`. Debe verse igual que el diff que hicimos en el paso 3 (24 renombrados, 0 conflictos).
6. Los equipos consumidores aceptan la nueva versión de la librería al actualizar Figma.

> **Por qué hacemos los cambios manuales dos veces (borrador + real) en vez de copiar Borrador a Real:** porque Foundations Real ya está publicada y consumida por componentes en producción. Reemplazarla con un archivo distinto rompería las referencias. La única forma segura es renombrar in-place sobre el archivo real, manteniendo el `id`.

### Paso 5 — Actualizar herramientas y docs

Una vez que producción está sana:

- `figma-plugin-generator/src/code.ts` — actualizar referencias hardcoded a `brand/main` / `brand/accent`.
- `docs/token-architecture.md` — actualizar tabla de marcas (`primary` / `secondary`).
- `src/components/Documentation.tsx` — refrescar contenido del dashboard.
- Mensaje al equipo consumidor con el changelog de los renames.

---

## Resumen ejecutivo

| Cambio | Tokens afectados | Tipo |
|---|---|---|
| `brand/main` → `brand/primary` | 17 | Rename (id se mantiene) |
| `brand/accent` → `brand/secondary` | 7 | Rename |
| Tablas de rango por (elemento × marca) | Todo el sistema | Auditoría + ajuste |
| Slots reservados `strong`, `soft` | Ninguno hoy | Aditivo (cuando se necesite) |
| Modes Light/Dark en primitivos | Toda la paleta core | Configuración |
| Consolidar duplicado `quiet` | 2 → 1 | Cleanup |

**Cambios de nomenclatura totales:** 24 tokens (solo marcas).
**La escala de intensidades no se renombra.**
