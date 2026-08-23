# Fractal Design System Dashboard

Dashboard web para visualizar y auditar el Design System Fractal de Telecom Personal Pay.

---

## Project Architecture

Flujo de datos: **Figma → plugins/scripts → JSONs estáticos en `src/data/` → dashboard React → Vercel**.

### 1. Fuentes de datos en Figma

El DS vive en cinco archivos de Figma. Cada archivo alimenta un JSON del dashboard, y cada JSON se genera **corriendo el script una vez por archivo**, cambiando la variable de entorno correspondiente en `.env`.

| Librería | Variable en `.env` | Contenido |
|---|---|---|
| Foundations | `FIGMA_FOUNDATIONS_FILE_KEY` | Tokens primitivos y semánticos, colecciones, alias |
| Components | `FIGMA_COMPONENTS_FILE_KEY` | Componentes principales del DS |
| Templates | `FIGMA_TEMPLATES_FILE_KEY` | Plantillas y layouts |
| Assets | `FIGMA_ASSETS_FILE_KEY` | Íconos, ilustraciones, logos |
| Custom | `FIGMA_CUSTOM_COMPONENTS_FILE_KEY` | Componentes específicos (no publicados como DS) |

### 2. Plugins de Figma

Viven en `personal/` (gitignorado). Se cargan localmente en Figma como plugins de desarrollo.

| Plugin | Ubicación | Rol |
|---|---|---|
| **Foundations Export** | `personal/figma-plugin-foundations-export/` | Se corre en el archivo de Foundations. Exporta el inventario de tokens con valores por modo y alias resueltos. |
| **DS Extractor** | `personal/ds-extractor/` | Se corre en cada archivo de componentes. Extrae bindings de tokens por capa, componentes, propiedades hardcodeadas y tokens huérfanos. |

Para auditar el DS al día hay que correr Foundations Export una vez y DS Extractor en cada librería antes de regenerar los JSONs.

> En `personal/figma-plugin-generator-v2/` vive el **Token Component Generator**, una herramienta de autoría para crear componentes en Figma con los bindings ya aplicados. No participa del flujo de datos del dashboard.

### 3. Generación de los JSONs

El comando `npm run extract` (que corre `personal/scripts/extract-figma-data.ts`) lee la API de Figma para el archivo apuntado por `FIGMA_..._FILE_KEY`, lo combina con la data del plugin, y escribe **un único JSON** en `src/data/`.

**Flujo por librería**: setear la variable correspondiente en `.env`, correr `npm run extract`, y **renombrar el output** al archivo final que consume el dashboard.

| Librería | Variable a usar | Renombrar el output a |
|---|---|---|
| Foundations | `FIGMA_FOUNDATIONS_FILE_KEY` | `src/data/foundations-data.json` |
| Components | `FIGMA_COMPONENTS_FILE_KEY` | `src/data/component-data.json` |
| Templates | `FIGMA_TEMPLATES_FILE_KEY` | `src/data/template-data.json` |
| Assets | `FIGMA_ASSETS_FILE_KEY` | `src/data/asset-data.json` |
| Custom | `FIGMA_CUSTOM_COMPONENTS_FILE_KEY` | `src/data/custom-data.json` |

> El script escribe siempre a `src/data/dashboard-data.json`. Después de cada corrida hay que renombrar ese archivo al nombre final de la tabla, si no la siguiente extracción lo pisa.

### 4. JSONs consumidos por el dashboard

Todos viven en `src/data/`. Los importa la app o algún componente puntual.

| Archivo | Lo consume | Vista/función |
|---|---|---|
| `component-data.json` | `App.tsx` | Overview, Components, Tokens |
| `template-data.json` | `App.tsx` | Overview, Components, Tokens |
| `custom-data.json` | `App.tsx` | Overview, Components, Tokens |
| `foundations-data.json` | `OrphanTokens.tsx` | Tokens huérfanos |
| `asset-data.json` | `AssetTokens.tsx` | Assets |
| `changelog.json` | `Changelog.tsx`, `Header.tsx` | Changelog + badge de novedades |

`App.tsx` mergea `component-data`, `template-data` y `custom-data` deduplicando por `componentId` y taggeando cada componente con la librería de origen para poder filtrar.

### 5. Snapshots y changelog

- `src/data/snapshots/latest-<librería>.json` — snapshot completo de la última extracción de cada archivo. Se usa como base de comparación en el próximo diff.
- `src/data/changelog.json` — historial de diffs. Últimas 100 entradas.
- Ver [`docs/CHANGELOG-GUIDE.md`](./docs/CHANGELOG-GUIDE.md) para el detalle.

### 6. Deploy

Push a `main` → Vercel detecta el cambio y redeploya el dashboard. El workflow diario en `.github/workflows/changelog.yml` corre a las 9 AM Argentina, ejecuta los diffs, commitea los cambios de `changelog.json` y snapshots, y Vercel redeploya solo.

---

## Comandos

| Comando | Uso |
|---|---|
| `npm run dev` | Servidor local en `localhost:5173` |
| `npm run build` | Compila para producción |
| `npm run preview` | Preview del build |
| `npm run extract` | Extrae la librería apuntada por `.env` a `src/data/dashboard-data.json` |
| `npm run diff -- <librería>` | Corre el diff manual (components, templates, assets, foundations, custom) |
| `npm run view-changelog` | Visor CLI del changelog |

---

## Sistema de changelog

Detecta y documenta automáticamente los cambios en las librerías de Figma.

- [Guía de uso](./docs/CHANGELOG-GUIDE.md) — cómo funciona, comandos, casos de uso.
- [Formato del JSON](./docs/CHANGELOG-FORMAT.md) — schema de `changelog.json` y del campo `detailed`.

---

## Chat Assistant de voz (Gemini 3.1 Flash Live)

Asistente por voz en tiempo real que responde preguntas sobre el DS. Usa el modelo `gemini-3.1-flash-live-preview`.

**Arquitectura**
- Conexión WebSocket directa cliente → Gemini (mejor latencia).
- El navegador **no** ve la API key real. `api/live-token.ts` (Vercel Edge Function) genera un token efímero (1 min para conectar, 30 min de sesión) con el system prompt del DS inyectado del lado del servidor.
- Voz nativa en español (`Kore`), transcripción en vivo, interrupciones soportadas.

**Setup**
1. API key en [Google AI Studio](https://aistudio.google.com/apikey).
2. `GEMINI_API_KEY` en `.env` local **y** en las env vars de Vercel.
3. Deploy.

**Archivos clave**

| Archivo | Rol |
|---|---|
| `api/live-token.ts` | Edge Function que emite el token efímero con contexto del DS |
| `src/lib/audioUtils.ts` | Captura de micrófono (PCM 16 kHz) y reproducción (PCM 24 kHz) |
| `src/components/DSChat.tsx` | UI de la llamada + conexión WebSocket vía `@google/genai` |

**Acceso**: botón flotante 🎙️ abajo a la derecha. Requiere permiso de micrófono.

**Nota de seguridad**: `/api/live-token` no tiene autenticación de usuario. Si el dashboard se hace público, agregar chequeo de sesión antes de emitir el token.

---

## Variables de entorno

`.env` en la raíz:

```bash
# Figma
FIGMA_TOKEN=your_figma_token
FIGMA_FOUNDATIONS_FILE_KEY=...
FIGMA_COMPONENTS_FILE_KEY=...
FIGMA_TEMPLATES_FILE_KEY=...
FIGMA_ASSETS_FILE_KEY=...
FIGMA_CUSTOM_COMPONENTS_FILE_KEY=...

# Chat assistant
GEMINI_API_KEY=...

# Confluence (opcional, para fractal-bridge)
CONFLUENCE_URL=https://tu-dominio.atlassian.net
CONFLUENCE_EMAIL=tu-email@empresa.com
CONFLUENCE_API_TOKEN=...

# Extracción
COMPONENT_LIMIT=0   # 0 = sin límite
```

Ver [`SETUP-CONFLUENCE.md`](./SETUP-CONFLUENCE.md) para el setup de Confluence.

---

## Estructura del proyecto

```
├── src/
│   ├── components/          # UI del dashboard (Overview, ComponentIndex, TokenExplorer, ...)
│   ├── data/                # JSONs estáticos generados desde Figma
│   │   └── snapshots/       # Snapshots por librería, base del diff diario
│   ├── lib/                 # Utilidades (audio del chat, helpers)
│   ├── App.tsx              # Merge de librerías y ruteo por vista
│   └── types.ts             # DashboardData y tipos compartidos
├── api/
│   └── live-token.ts        # Edge function para el token efímero de Gemini
├── scripts/
│   ├── diff-changelog.ts    # Diff productivo (usado por el workflow diario)
│   └── view-changelog.ts    # Visor CLI del changelog
├── personal/                # Gitignorado — plugins de Figma y scripts locales
│   ├── ds-extractor/
│   ├── figma-plugin-foundations-export/
│   ├── figma-plugin-generator-v2/
│   └── scripts/             # extract-figma-data.ts y utilidades
├── docs/
│   ├── CHANGELOG-GUIDE.md
│   ├── CHANGELOG-FORMAT.md
│   ├── components/          # Docs por componente
│   └── tokens/              # Catálogo y auditoría de tokens
└── .github/workflows/
    └── changelog.yml        # Cron diario 9 AM Argentina
```

---

## Troubleshooting

- **Rate limit 429 de Figma**: el script tiene delays; correr de nuevo suele bastar.
- **Tokens faltantes en el dashboard**: verificar que Foundations Export se corrió antes que el DS Extractor.
- **Componentes vacíos**: revisar la `FIGMA_..._FILE_KEY` correspondiente en `.env`.
- **El dashboard no muestra cambios nuevos**: chequear que después de `npm run extract` renombraste `dashboard-data.json` al archivo destino de la tabla.

---

Para reglas de desarrollo con Fractal UI, ver [`AGENTS.md`](./AGENTS.md).
