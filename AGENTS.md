# Fractal DS — Contexto para agentes

Este archivo se carga automáticamente en cada conversación del workspace y contiene todo el contexto ambiental que necesita un agente para trabajar en el proyecto.

---

## Objetivo del proyecto

**Fractal DS** es el Design System de Telecom Personal Pay. Este workspace es la **herramienta interna del equipo de diseño del DS** para:

1. Ver el estado de salud del DS (dashboard).
2. Auditar componentes de Figma (arquitectura y tokenización).
3. Detectar cambios diarios en las librerías de Figma (changelog automático).
4. Explorar tokens, componentes, huérfanos y valores hardcodeados.

**Quién lo usa:** el equipo de diseño de Fractal. No los desarrolladores que consumen la librería.

**Qué NO es:**
- No es documentación pública del DS.
- No es un tutorial de cómo consumir `@ppay-mobile/fractal-ui` desde código.
- No es un lugar para escribir código de aplicaciones.

Cualquier "reglas para agentes" en este archivo se refiere al agente que trabaja acá con el mantenedor del DS, no a un agente que ayuda a un dev a escribir una pantalla con la librería.

---

## Cómo trabajar acá

### Auditorías (uso principal)

Cuando el mantenedor pide revisar un componente, hay dos ejes que se auditan por separado. Los dos tienen su propio steering manual en `.kiro/steering/`:

| Foco | Cuándo invocarlo | Steering |
|---|---|---|
| Arquitectura (capas, naming, props, variantes) | Al revisar cómo está construido un componente | `#component-architecture` |
| Tokenización (tokens aplicados, escalas, errores) | Al revisar qué tokens usa un componente | `#tokenization-rules` |

Los dos steering solo se cargan cuando se invocan (`inclusion: manual`). Este archivo (auto) trae el contexto que aplica siempre.

### Herramientas disponibles

- **MCP de Figma** (`figma-developer-mcp`): lee archivos de Figma directamente cuando el archivo está abierto en Dev Mode. Usar para auditorías on-demand por file key + node-id.
- **Dashboard local** (`npm run dev`): visualiza el estado extraído.
- **Plugins de Figma** (en `personal/`): generan los JSONs que consume el dashboard.
- **Diff manual** (`npm run diff -- <librería>`): compara el estado actual contra el último snapshot.

### Reporting de hallazgos

- Siempre incluir el `node-id` cuando se reporta un componente.
- Separar hallazgos de arquitectura de hallazgos de tokenización.
- **Regla cero**: no clasificar como problema lo que no está verificado. Si no se puede determinar el origen o la intención de un token, el hallazgo es "pendiente de verificar", no "deuda".

---

## Estructura del proyecto

```
/src/                          ← dashboard React
  App.tsx                      ← mergea Components/Templates/Custom y rutea vistas
  /components/
    Header.tsx                 ← navegación + indicador de frescura
    Overview.tsx               ← resumen de salud, cobertura, top tokens
    ComponentIndex.tsx         ← índice de componentes con bindings
    TokenExplorer.tsx          ← explorador de tokens
    OrphanTokens.tsx           ← tokens de Foundations que no aplica ningún componente
    AssetTokens.tsx            ← assets con sus tokens de color
    Changelog.tsx              ← historial de cambios detectados en Figma
    DSChat.tsx                 ← asistente de voz (Gemini Live)
  /data/
    component-data.json        ← generado por DS Extractor sobre la librería Components
    template-data.json         ← generado por DS Extractor sobre Templates
    custom-data.json           ← generado por DS Extractor sobre Custom Components
    asset-data.json            ← generado por DS Extractor sobre Assets
    foundations-data.json      ← generado por Foundations Export
    changelog.json             ← historial de diffs automáticos
    /snapshots/                ← snapshots que usa el diff diario
      latest-components.json
      latest-templates.json
      latest-assets.json
      latest-custom.json

/api/
  live-token.ts                ← Edge function que emite el token efímero de Gemini Live

/scripts/                      ← scripts productivos (usados por CI o npm)
  diff-changelog.ts            ← diff diario (usado por el workflow)
  view-changelog.ts            ← visor CLI del changelog
  extract-flows.ts             ← extractor de uso de DS en flujos

/.github/workflows/
  changelog.yml                ← corre 9 AM Argentina, detecta cambios en Figma

/personal/                     ← GITIGNORADO — herramientas locales del mantenedor
  /ds-extractor/               ← Plugin DS Extractor
  /figma-plugin-foundations-export/  ← Plugin Foundations Export
  /figma-plugin-generator-v2/  ← Autoría de componentes (NO alimenta al dashboard)
  /scripts/                    ← extract-figma-data.ts y análisis varios

/docs/                         ← documentación humana
  CHANGELOG-GUIDE.md           ← cómo funciona el changelog
  CHANGELOG-FORMAT.md          ← schema del JSON
  accesibilidad-fractal.md
  gobernanza-pedidos.md
  /tokens/                     ← auditorías y catálogo de tokens
  /components/                 ← doc por componente
```

---

## Plugins de Figma

Dos plugins alimentan al dashboard. El tercero es autoría y queda fuera del flujo de datos.

| Plugin | Ubicación | Rol |
|---|---|---|
| **Foundations Export** | `personal/figma-plugin-foundations-export/` | Se corre en el archivo de Foundations. Exporta el inventario completo de tokens con valores por modo y alias resueltos → `foundations-data.json`. |
| **DS Extractor** | `personal/ds-extractor/` | Se corre en cada archivo de componentes. Extrae bindings, hardcoded, huérfanos. Un dropdown en la UI del plugin decide el nombre del archivo destino (`component-data.json` / `template-data.json` / `asset-data.json` / `custom-data.json`). |

> `personal/figma-plugin-generator-v2/` (Token Component Generator) es una herramienta de autoría de componentes en Figma. **No participa del flujo de datos del dashboard.**

### Flujo de datos

```
Figma Foundations
        ↓
Foundations Export → foundations-data.json
        ↓
Figma Components / Templates / Assets / Custom
        ↓
DS Extractor (una corrida por archivo, dropdown selecciona destino)
        ↓
component-data.json · template-data.json · asset-data.json · custom-data.json
        ↓
Dashboard React (src/App.tsx mergea Components + Templates + Custom)
```

### Qué JSON consume cada componente del dashboard

| Archivo | Lo consume | Vista |
|---|---|---|
| `component-data.json` | `App.tsx` (merge) | Overview, Components, Tokens |
| `template-data.json` | `App.tsx` (merge) | Overview, Components, Tokens |
| `custom-data.json` | `App.tsx` (merge) | Overview, Components, Tokens |
| `foundations-data.json` | `OrphanTokens.tsx` | Huérfanos |
| `asset-data.json` | `AssetTokens.tsx` | Assets |
| `changelog.json` | `Changelog.tsx`, `Header.tsx` | Changelog + badge de novedades |

### CLI de extracción (alternativa)

`npm run extract` corre `personal/scripts/extract-figma-data.ts`. Siempre escribe a `src/data/dashboard-data.json` — hay que **renombrarlo** al archivo destino después de cada corrida. La opción recomendada es correr el plugin en Figma, que ya elige el nombre correcto.

---

## Changelog automático

- Workflow en `.github/workflows/changelog.yml`. Corre todos los días a las **9:00 AM Argentina** (12:00 UTC).
- Llama a `scripts/diff-changelog.ts` para cada librería (`components`, `templates`, `assets`, `custom`).
- Compara Figma contra el snapshot guardado en `src/data/snapshots/latest-<librería>.json`.
- Si hay cambios reales, commitea `changelog.json` y snapshots actualizados con mensaje `changelog: auto-update YYYY-MM-DD`.
- Vercel detecta el push y redeploya el dashboard.
- Trigger manual: GitHub → Actions → "Daily Changelog" → "Run workflow".

**Qué detecta:**
- Componentes/variantes agregados o eliminados.
- Renombres, deprecaciones (`⛔`), cambios de arquitectura de props.
- Tokens vinculados que cambian, se agregan o se quitan (binding_changed / added / removed).
- Cambios en propiedades visuales: fills, strokes, gaps, paddings, radii, opacity, font-size/weight, tamaños.

**Qué NO detecta:**
- Movimientos de posición en el canvas.
- Cambios en descripciones o anotaciones.
- Colores hardcodeados (sin token).

### Archivos monitoreados

| Alias | Archivo Figma | Secret en GitHub |
|---|---|---|
| `components` | Librería de componentes | `FIGMA_COMPONENTS_FILE_KEY` |
| `templates` | Librería de templates | `FIGMA_TEMPLATES_FILE_KEY` |
| `assets` | Librería de assets/íconos | `FIGMA_ASSETS_FILE_KEY` |
| `custom` | Componentes custom | `FIGMA_CUSTOM_COMPONENTS_FILE_KEY` |
| `foundations` | Foundations (tokens) | `FIGMA_FOUNDATIONS_FILE_KEY` |

Doc completa: [`docs/CHANGELOG-GUIDE.md`](./docs/CHANGELOG-GUIDE.md).

---

## Comandos

```bash
npm run dev                     # dashboard local
npm run build                   # build para prod

npm run extract                 # extrae la librería apuntada por .env → dashboard-data.json
                                # (renombrar al archivo destino después)
npm run diff -- components      # diff manual de la librería components
npm run diff -- templates
npm run diff -- assets
npm run diff -- custom
npm run diff -- foundations
npm run view-changelog          # visor CLI del changelog
```

### `.env` requerido

```
FIGMA_TOKEN                     # token personal de Figma
FIGMA_FOUNDATIONS_FILE_KEY
FIGMA_COMPONENTS_FILE_KEY
FIGMA_TEMPLATES_FILE_KEY
FIGMA_ASSETS_FILE_KEY
FIGMA_CUSTOM_COMPONENTS_FILE_KEY
GEMINI_API_KEY                  # solo si se usa el chat de voz
```

---

## Fundamentos del DS

Estas nociones aplican a todo el sistema. Los steering `#tokenization-rules` y `#component-architecture` amplían con reglas específicas.

### Cadena de tokens

```
Primitivo → Semántico → Componente
```

- **Primitivo**: valor crudo (`core/purple/500`). No se aplica a componentes directamente.
- **Semántico**: propósito del valor (`static/foreground/neutral/medium`). Es lo que consumen los componentes.
- **Componente**: alias específico (`button/background/solid/default`). Apunta a un semántico.

### Estructura de un semántico

```
[contexto]/[elemento]/[familia]/[sub-familia?]/[variante?]/[escala]
```

### Contextos

- `static` — no cambia con interacción.
- `interactive` — responde a estados (default, hover, pressed, focus, disabled, selected, error).
- `expressive` — decorativo/ilustrativo.

En `interactive/border/feedback/` y `interactive/foreground/feedback/`, el tipo de feedback (`error`, `warning`, `success`, `info`) **funciona como estado**: el borde cambia cuando el componente entra en ese estado, sin necesidad de un slot de estado adicional.

### Elementos

- `background`, `foreground`, `border`, `opacity`.

### Familias

- `brand/primary` (purple), `brand/secondary` (cyan).
- `neutral` (cross, sin sub-familia).
- `feedback/info`, `feedback/success`, `feedback/warning`, `feedback/error`.

### Escala de intensidades

```
strong > bold > medium > subtle > quiet
```

| Intensidad | Rango primitivo | Aplica a |
|---|---|---|
| `strong` | 950 | Solo neutral |
| `bold` | 700-950 | Todos |
| `medium` | 500-600 | Todos |
| `subtle` | 100-400 | Todos |
| `quiet` | 25-50 | Todos |

Las escalas son **contextuales**: `medium` de foreground ≠ `medium` de background en valor absoluto. Cada uno es "el default de su contexto".

### Estructura de Foundations

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

Foundations alimenta a Components, Templates y Custom Components. Esas tres librerías **no deben definir variables propias**: consumen de Foundations.

Si aparecen colecciones fuera de esta lista (`Semantic dimension`, `_Global dimension`, `Dimension`, `Primitives`, `Semantic color`, `Expressive`, `🔢 Units`), no son de Foundations. Correr el extractor actualizado para ver el `libraryName` y determinar el origen.

### Naming rápido

- **Componentes:** Mayúscula-guión-minúscula (`Button-icon`, `Progress-bar`). Siglas en mayúscula (`NFC`, `PIN`). Brands de terceros respetan la grafía oficial (`Mercado-Pago`, `La-Caja`).
- **Capas:** Sentence case con espacios (`Hover layer`, `Supporting text`).
- **Building blocks:** prefijo `.⛔️` o `⛔️`, no se publican.

Detalle completo en `#component-architecture`.

### Gap vs Padding

| Token | Propiedad Figma | Qué controla |
|---|---|---|
| `gap/gap-X` | `itemSpacing` | Espacio entre elementos hijos de un auto layout |
| `padding/padding-X` | `paddingTop/Bottom/Left/Right` | Espacio interno entre el borde del contenedor y su contenido |

Un token de `gap/` **solo** va en `itemSpacing`. Un token de `padding/` **solo** va en `padding*`. Si están cruzados es un error de aplicación.

---

## Cómo auditar tokens sin generar falsos positivos

> Estas reglas salen de una auditoría que reportó 26 problemas de los cuales 24 no existían.
>
> **Regla cero: no clasificar como problema lo que no está verificado.** Presentar el hecho y dejar la clasificación abierta si no hay certeza.

### 1. Comparar por `key`, nunca por nombre

El `key` es el identificador estable de una variable en Figma y no cambia al renombrar. El **nombre sí cambia**, y los archivos consumidores guardan el nombre que tenía la variable al momento del binding hasta que se refresca la librería.

Consecuencia: un token que "no existe" puede ser el nombre viejo de un token que sí existe.

```
key b5a951495b65…
  Foundations dice : interactive/border/brand/primary/focus/medium
  bindings dicen   : primary/focus/medium · main/focus/medium · focus · focus-medium
  → los 4 son LA MISMA variable, bien aplicada
```

Antes de reportar un token como inexistente: buscar su `key` entre las variables de Foundations. Si aparece con otro nombre, es cache stale, no deuda. Se arregla refrescando la librería, sin tocar bindings.

### 2. Dos semánticos con el mismo primitivo NO es deuda

Es el propósito de la capa semántica: el mismo valor se nombra distinto según contexto y estado, para que cada uno pueda evolucionar por separado.

`core/purple/500` alimenta legítimamente a `interactive/border/brand/primary/default/medium`, `…/focus/medium`, `interactive/background/brand/default/medium` y `static/foreground/brand/primary/medium`.

| Estructura | Veredicto |
|---|---|
| **dos** semánticos → **un** primitivo | ✅ correcto por diseño |
| **un** semántico → **dos** variables | ❌ duplicación real |

Señales de duplicación real: las dos variables se aplican a las mismas propiedades, hay componentes que usan ambas indistintamente, y los componentes nuevos usan solo una.

### 3. Que dos estados compartan valor no es un bug de accesibilidad por sí solo

El cambio de estado puede resolverse con un overlay, un stroke adicional, un cambio de weight o de posición. Verificarlo requiere abrir el componente, no leer la tabla de tokens.

### 4. Descontar los placeholders antes de contar usos

`Swap-content` es un slot de documentación anidado en 16 componentes con bindings idénticos. Aporta 68 de los 120 usos de un token sin representar 68 decisiones ni llegar a producción.

Antes de dimensionar deuda, desglosar por `layerName` y separar los placeholders. Aplica a cualquier capa que sea un slot de documentación.

### 5. Verificar el origen de la variable

`variable.remote` + `libraryName` (el extractor los guarda en `foundations.libraries`). Sirve para distinguir una variable de Foundations de una local del archivo o de otra librería. **No inferir el origen del formato del ID**, no es confiable.

### 6. Orden de verificación recomendado

```
1. ¿El key existe en Foundations?           → no  → seguir en 2
                                              sí  → ¿mismo nombre? no = cache stale, NO es deuda
2. ¿Existe en otra colección/librería?      → sí  → verificar origen antes de clasificar
                                              no  → binding roto (esto sí es un problema)
3. ¿Cuántos usos son de placeholders?       → descontarlos del total
4. ¿Se aplica a las mismas propiedades
   que su equivalente?                      → sí  → duplicación
                                              no  → posiblemente semántica distinta
```

Script disponible: `node scripts/audit-tokens.js` aplica este orden y separa las tres situaciones.

---

## Documentación de tokens

Vive en `docs/tokens/`. Punto de entrada: `README.md`.

| Archivo | Contenido |
|---|---|
| `README.md` | Índice, estado del sistema, checklist antifalsos-positivos |
| `semanticos.md` | Uso real de cada token inferido de los bindings |
| `catalogo.md` | Las 494 variables semánticas con primitivo y valor final (generado) |
| `auditoria-tokens.md` | Estado verificado y observaciones abiertas |

Regenerar con `node scripts/generate-token-catalog.js`, `audit-tokens.js` y `analyze-token-usage.js`.

---

## Convenciones de trabajo

- No commitear nada de `personal/` (está en `.gitignore`).
- Los JSONs de librerías (`component-data.json`, `template-data.json`, `asset-data.json`, `custom-data.json`, `foundations-data.json`) se regeneran manualmente con los plugins y se commitean.
- `changelog.json` y snapshots los mantiene el bot automáticamente. No editarlos a mano.
- En una auditoría, separar arquitectura (capas/naming) de tokenización (tokens aplicados). Los dos ejes tienen su steering.
- Reportar siempre con `node-id` para que se pueda abrir el componente en Figma.
- El dashboard se deploya solo con cada push a `main` (Vercel).
