---
inclusion: auto
---

# Fractal DS Agent — Contexto general

> Este archivo se carga automáticamente en todas las conversaciones del workspace.

---

## Qué es este proyecto

**Fractal** es el Design System de Telecom Personal Pay. Este workspace contiene:
- Dashboard de salud del DS (React + Vite, deployado en Vercel)
- Scripts de automatización (diff/changelog diario, extracción de datos)
- Plugin de Figma **DS Extractor** (en `personal/`, gitignoreado) que genera los datos del dashboard
- Workflow de GitHub Actions que detecta cambios en Figma y actualiza el changelog automáticamente

---

## Estructura del proyecto

```
/src/                        ← dashboard React
  /components/
    Overview.tsx             ← resumen de salud, cobertura, top tokens
    ComponentIndex.tsx       ← índice de componentes con bindings
    TokenExplorer.tsx        ← explorador de tokens semánticos/primitivos
    OrphanTokens.tsx         ← tokens definidos pero no aplicados
    Changelog.tsx            ← historial de cambios detectados en Figma
    Sidebar.tsx              ← navegación
  /data/
    dashboard-data.json      ← generado por DS Extractor (no editar a mano)
    changelog.json           ← historial de diffs automáticos
    snapshots/               ← snapshots para comparación diaria
      latest-components.json
      latest-templates.json
      latest-assets.json

/scripts/
  diff-changelog.ts          ← script productivo de diff (usado por el workflow)

/.github/workflows/
  changelog.yml              ← corre a las 9 AM Argentina, detecta cambios en Figma

/personal/                   ← gitignoreado, herramientas locales
  /ds-extractor/             ← Plugin de Figma "DS Extractor"
  /figma-plugin-generator-v2/
  /figma-plugin-foundations-export/
  /scripts/                  ← scripts de análisis y exploración
```

---

## DS Extractor (Plugin de Figma)

Ubicado en `personal/ds-extractor/`. Se carga localmente en Figma como plugin de desarrollo.

**Qué extrae:**
- Todos los COMPONENT y COMPONENT_SET del archivo abierto
- Bindings de variables (tokens) por propiedad y layer
- Tokens primitivos y semánticos con alias chains resueltos, hex para colores
- Valores hardcodeados (fills/strokes sin token asignado)
- Tokens huérfanos (definidos pero no aplicados en ningún componente)
- Colecciones de variables
- Categorías inferidas de los nombres de páginas (prefijo `▶️`)

**Output:** `dashboard-data.json` — se guarda manualmente en `src/data/` y se commitea para que Vercel redesploy el dashboard.

---

## Archivos monitoreados por el changelog automático

| Alias | Archivo de Figma | Secret en GitHub |
|---|---|---|
| `components` | Librería de componentes | `FIGMA_COMPONENTS_FILE_KEY` |
| `templates` | Librería de templates | `FIGMA_TEMPLATES_FILE_KEY` |
| `assets` | Librería de assets/íconos | `FIGMA_ASSETS_FILE_KEY` |
| `foundations` | Foundations (tokens) | `FIGMA_FOUNDATIONS_FILE_KEY` |

---

## Archivos clave en `.env`

```
FIGMA_TOKEN                  ← token personal de Figma (API REST)
FIGMA_FOUNDATIONS_FILE_KEY   ← archivo de Foundations
FIGMA_COMPONENTS_FILE_KEY    ← archivo de Componentes
FIGMA_TEMPLATES_FILE_KEY     ← archivo de Templates
FIGMA_ASSETS_FILE_KEY        ← archivo de Assets
```

---

## Comandos disponibles

```bash
npm run diff -- components    # diff manual del archivo de componentes
npm run diff -- templates     # diff manual del archivo de templates
npm run diff -- foundations   # diff manual del archivo de foundations
npm run diff -- assets        # diff manual del archivo de assets
npm run extract               # regenerar dashboard-data.json (usa personal/scripts/)
npm run dev                   # ver dashboard local
npm run build                 # compilar dashboard
```

---

## Cómo funciona el changelog automático

1. GitHub Actions corre todos los días a las **9 AM Argentina (12:00 UTC)**
2. Llama a `scripts/diff-changelog.ts` para cada archivo (components, templates, assets)
3. Compara el estado actual de Figma contra el snapshot guardado en `src/data/snapshots/`
4. Si hay cambios, commitea `changelog.json` y los snapshots actualizados con mensaje `changelog: auto-update YYYY-MM-DD`
5. Vercel detecta el push y redeploya el dashboard automáticamente
6. Se puede disparar manualmente desde GitHub → Actions → "Daily Changelog" → "Run workflow"

**Qué detecta el diff:**
- Componentes/variantes agregados o eliminados
- Tokens vinculados que cambian (binding_changed)
- Tokens que se agregan o quitan de una propiedad
- Cambios en propiedades visuales: fills, strokes, gaps, paddings, radii, opacity, font size/weight, tamaños

**Qué NO detecta:**
- Movimientos de posición en el canvas
- Cambios en descripciones o anotaciones
- Colores hardcodeados (sin token)

---

## Cómo auditar un componente

### Arquitectura (capas, naming, props)
Invocar con `#component-architecture`. Leer el componente por API de Figma usando el file key y node-id.

### Tokenización (tokens aplicados, escalas, errores)
Invocar con `#tokenization-rules`. Leer los bindings del componente y cruzar con `dashboard-data.json` para resolver nombres.

---

## Escala de tokens semánticos

```
strong > bold > medium > subtle > quiet
```

| Intensidad | Rango | Aplica a |
|---|---|---|
| strong | 950 | Solo neutral |
| bold | 700-950 | Todos |
| medium | 500-600 | Todos |
| subtle | 100-400 | Todos |
| quiet | 25-50 | Todos |

---

## Familias

- `brand/primary` (purple), `brand/secondary` (cyan)
- `neutral` (cross, sin sub-familia)
- `feedback/info`, `feedback/success`, `feedback/warning`, `feedback/error`

---

## Reglas clave del DS

- **Subcarpetas:** 1 valor = directo. 2+ = subcarpeta.
- **División principal:** style > selected > type > state
- **Estados en componentes:** usan nombres de estado aunque apunten a static
- **Instancias anidadas:** no se tokenizan en el padre
- **Building blocks:** `.⛔️` prefix, no se publican
- **Auto Layout:** obligatorio en todo
- **Naming capas:** Sentence case con espacios
- **Naming componentes:** Mayúscula-guión-minúscula (`Button-icon`). Siglas en mayúscula (`NFC`, `PIN`). Brands de terceros respetan la grafía oficial de la marca (`Mercado-Pago`, `La-Caja`).
- **Gap vs Padding:** gap = itemSpacing, padding = paddingLeft/Right/Top/Bottom. No cruzar.
- **Focus:** cross, no depende de style/selected/type
- **Feedback border en interactive:** el tipo (error) funciona como estado

---

## Contextos

- `static` — no cambia con interacción
- `interactive` — responde a estados (default, hover, pressed, focus, disabled, selected, error)
- `expressive` — decorativo/ilustrativo

---

## MCP de Figma

Configurado como MCP server local (`figma-developer-mcp`). Permite leer archivos de Figma directamente cuando está en Dev Mode. Usar para auditorías on-demand de componentes.

---

## Convenciones de trabajo

- No subir nada del `personal/` a Git (está en .gitignore)
- El plugin DS Extractor es local, no va online
- `dashboard-data.json` se actualiza manualmente con el plugin, luego se commitea
- `changelog.json` y snapshots los actualiza el bot automáticamente — no editar a mano
- Cuando se audita, separar arquitectura (capas/naming) de tokenización (tokens aplicados)
- Siempre mostrar node-id cuando se reportan componentes para referencia
- El dashboard se deploya automáticamente con cada push a main (Vercel)
