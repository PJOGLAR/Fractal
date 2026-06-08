# Herramientas — Fractal Design System

> Documentación centralizada de todas las herramientas del DS: plugins, scripts, dashboard y steering files.

---

## Plugins de Figma

### Plugin-tokens (extractor)
**Ubicación:** `personal/figma-plugin/`

- Extrae todos los tokens aplicados en un documento de Figma
- Genera JSON con componentes, bindings, huérfanos, hardcoded values
- Alimenta el dashboard de salud
- No requiere selección — escanea toda la página o documento

**Uso:** Correr dentro de Figma en el archivo de componentes. Exporta `dashboard-data.json`.

---

### Token Component Generator V2
**Ubicación:** `personal/figma-plugin-generator-v2/`

- Escanea un componente seleccionado (Component o Component Set)
- Genera la colección de tokens específicos como alias de los semánticos
- Detecta patrones automáticamente (Style, Selected, Size, Type, State)
- Aplica las reglas de subcarpetas (1 valor = directo, 2+ = subfolder)
- Vincula los tokens generados al componente

**Uso:**
1. Seleccionar un componente en el canvas
2. Click "Escanear"
3. Revisar la estructura propuesta
4. Click "Generar colección" → crea las variables
5. Click "Vincular" → aplica las variables al componente

---

### Foundations Export
**Ubicación:** `personal/figma-plugin-foundations-export/`

- Exporta el inventario completo de variables de una librería
- Incluye: id, nombre, colección, valor en cada mode, alias
- No requiere selección — lee todo el archivo
- Genera JSON para comparación pre/post migración

**Uso:** Correr en el archivo de Foundations antes y después de un cambio. Usar el diff tool para comparar.

---

### Dark Mode Configurator
**Ubicación:** `personal/figma-plugin-dark-mode/`

- Lee un JSON de propuesta de dark mode
- Crea el mode "Dark" en la colección de semánticos
- Asigna alias distintos a cada token en mode Dark
- Preview (dry-run) antes de aplicar

**Uso:**
1. Cargar el JSON de propuesta (`dark-mode-proposal.json`)
2. Click "Preview" para verificar matches
3. Click "Aplicar" para configurar los modes

---

## Scripts locales (terminal)

### `npm run extract`
**Script:** `personal/scripts/extract-figma-data.ts`

Lee la API de Figma y genera `src/data/dashboard-data.json` con todos los datos de componentes y tokens. Alimenta el dashboard.

```bash
cd ~/Desktop/Kiro\ -\ Fractal && npm run extract
```

---

### `npm run diff -- [archivo]`
**Script:** `personal/scripts/diff-changelog.ts`

Toma un snapshot del archivo via API de Figma, lo compara con el anterior, y genera un changelog con cambios detectados.

```bash
npm run diff -- foundations
npm run diff -- components
npm run diff -- token-test-component
npm run diff -- <file_key>
```

**Qué detecta:**
- Componentes nuevos / eliminados / renombrados
- Bindings de tokens agregados / eliminados / cambiados
- Agrupa por componente y muestra detalle

**Aliases disponibles** (configurados en `.env`):
- `foundations` → archivo de Foundations
- `components` → archivo de Componentes
- `token-test-component` → archivo de pruebas

---

### `npm run snapshot -- [archivo]`
**Script:** `personal/scripts/snapshot.ts`

Toma un snapshot sin hacer diff. Útil para establecer un punto de referencia.

```bash
npm run snapshot -- foundations
```

---

### `npm run changelog`
**Script:** `personal/scripts/changelog.ts`

Lee las versiones publicadas del archivo de Figma y genera entries de changelog basados en el historial de versiones.

```bash
npm run changelog
```

---

## Dashboard (Vercel)

**URL:** desplegado en Vercel (auto-deploy con cada push a main)

### Vistas
- **Overview** — métricas de salud, análisis de impacto, top tokens
- **Component Index** — filtros por categoría de token
- **Token Explorer** — filtros jerárquicos por colección
- **Orphan Tokens** — tokens sin uso
- **Props Explorer** — búsqueda por props de componentes
- **Documentation** — arquitectura y estructura de tokens

### API endpoints
- `GET /api/changelog` — historial de publicaciones (webhook)
- `POST /api/webhook-figma` — recibe webhooks de Figma al publicar

---

## Herramienta de Diff (HTML standalone)

**Ubicación:** `personal/tools/foundations-diff/index.html`

- Abrí en cualquier navegador
- Cargá dos JSONs (export de Foundations antes y después)
- Compara por ID de variable
- Muestra: sin cambios, renombrados, valor cambiado, solo en A, solo en B, conflicto de ID
- Filtros, búsqueda y exportación del diff

---

## Steering files (reglas para el agente)

### `#component-architecture`
**Ubicación:** `.kiro/steering/component-architecture.md`

Reglas para revisar la construcción de componentes:
- Auto Layout obligatorio
- Naming de capas (sentence case, semántico)
- Naming de componentes (mayúscula-guión-minúscula)
- Building blocks (`.⛔️` prefix)
- Propiedades y variantes (sentence case, booleanos con `Has`)
- Orden de variantes (Size → Style → Hierarchy → State → Appearance)
- Zonas semánticas (Leading/Content/Trailing)
- Slots de placeholder, texto por default
- Component Set root con propiedades heredables

**Invocar:** escribir `#component-architecture` en el chat.

---

### `#tokenization-rules`
**Ubicación:** `.kiro/steering/tokenization-rules.md`

Reglas para revisar la tokenización:
- Cadena Primitivo → Semántico → Componente
- Escala: strong > bold > medium > subtle > quiet (con rangos)
- Regla de subcarpetas (1=directo, 2+=subfolder)
- División principal: style > selected > type > state
- Typography: cross, roles, sizes
- Estados en componentes (pueden apuntar a static)
- Errores comunes (foreground/background cruzados, gap/padding cruzados)
- Focus como cross, icon/pictogram

**Invocar:** escribir `#tokenization-rules` en el chat.

---

## Configuración (.env)

| Variable | Qué es |
|---|---|
| `FIGMA_TOKEN` | Token personal de Figma (con permisos de lectura) |
| `FIGMA_FOUNDATIONS_FILE_KEY` | File key del archivo de Foundations |
| `FIGMA_COMPONENTS_FILE_KEY` | File key del archivo de Componentes |
| `FIGMA_TOKEN_TEST_FILE_KEY` | File key para pruebas de tokens |
| `FIGMA_TOKEN_TEST_COMPONENT` | File key para pruebas de componentes |
| `FIGMA_WEBHOOK_PASSCODE` | Passcode para verificar webhooks |

---

## Criterios de salud del DS

| Métrica | Bueno | Atención | Problema |
|---|---|---|---|
| Cobertura de tokens | >90% | 70-90% | <70% |
| Tokens huérfanos | <5% | 5-15% | >15% |
| Hardcoded values | 0 | <10 | >10 |
| Tokens sin uso | <10 | 10-30 | >30 |
