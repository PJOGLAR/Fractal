# Guía Completa del Sistema de Changelog Automático

## 📋 Índice

1. [Qué es el Changelog](#qué-es-el-changelog)
2. [Mejoras Implementadas](#mejoras-implementadas)
3. [Cómo Funciona](#cómo-funciona)
4. [Uso Diario](#uso-diario)
5. [Formato del Output](#formato-del-output)
6. [Casos de Uso](#casos-de-uso)
7. [Referencia Técnica](#referencia-técnica)

---

## Qué es el Changelog

El **sistema de changelog automático** compara snapshots diarios de las librerías de Figma (Components, Templates, Assets, Custom) y genera reportes detallados de todos los cambios detectados.

### Librerías Monitoreadas

| Librería | Variable ENV | Descripción |
|----------|--------------|-------------|
| **Components** | `FIGMA_COMPONENTS_FILE_KEY` | Componentes principales del DS |
| **Templates** | `FIGMA_TEMPLATES_FILE_KEY` | Plantillas y layouts |
| **Assets** | `FIGMA_ASSETS_FILE_KEY` | Iconos, ilustraciones, logos |
| **Custom** | `FIGMA_CUSTOM_COMPONENTS_FILE_KEY` | Componentes específicos del proyecto |

### Automatización

- **Frecuencia**: Diariamente a las 9:00 AM Argentina (12:00 UTC)
- **Workflow**: `.github/workflows/changelog.yml`
- **Output**: `src/data/changelog.json` (últimas 100 entradas)
- **Snapshots**: `src/data/snapshots/latest-{libreria}.json`

---

## Mejoras Implementadas

### ❌ Antes (Formato Anterior)

```
📅 28 de jul de 2026 — Components
   1 iterado

   🔄 Componentes con cambios (1):
      • Chip
```

**Problema**: No sabías **qué** cambió exactamente. ¿Tokens? ¿Spacing? ¿En qué variante?

### ✅ Después (Formato Mejorado)

```
📅 16 de ago de 2026 — Components
   1 iterado

   📊 Stats: 4 tokens cambiados | 8 props cambiadas

   🔄 Componentes con cambios (1):
      • Chip
        🎨 Tokens:
          • fills (2 cambios):
            Background → color/neutral-100 ➜ color/surface-secondary
            Border → color/border-subtle ➜ color/border-medium
          • strokes (1 cambio):
            Container → stroke/default ➜ stroke/emphasis
        
        📐 Propiedades visuales:
          • Spacing (2 cambios):
            Chip → paddingLeft: 12 ➜ 16
            Chip → paddingRight: 12 ➜ 16
          • Bordes (1 cambio):
            Container → strokeWeight: 1 ➜ 1.5
```

### Qué Aporta

✅ **Especificidad**: Sabés exactamente qué tokens o propiedades cambiaron  
✅ **Valores concretos**: Ves el before/after (`12 ➜ 16`)  
✅ **Contexto**: Sabés en qué capa del componente ocurrió el cambio  
✅ **Categorización**: Tokens y propiedades agrupadas por tipo  
✅ **Variantes**: Si hay variantes, ves cuáles fueron afectadas  
✅ **Accionable**: La info es suficiente para actualizar código sin abrir Figma

---

## Cómo Funciona

### 1. Toma de Snapshot

El script consulta la API de Figma y extrae:
- Todos los componentes y variantes
- Bindings de tokens (qué token está aplicado a qué propiedad)
- Propiedades visuales (spacing, tamaños, colores, tipografía)
- Metadata (nombre, tipo, jerarquía)

```typescript
// Snapshot almacenado en src/data/snapshots/latest-components.json
{
  "takenAt": "2026-08-16T14:14:00.000Z",
  "fileKey": "0GIm2SB5mdvDF7ojlXkjV3",
  "fileName": "Components",
  "components": [
    {
      "id": "123:456",
      "name": "Button",
      "type": "COMPONENT_SET",
      "bindings": [
        {
          "property": "fills",
          "variableId": "VariableID:xyz/123",
          "layerName": "Background"
        }
      ],
      "properties": [
        {
          "layerName": "Button",
          "property": "paddingLeft",
          "value": 16
        }
      ]
    }
  ]
}
```

### 2. Comparación

El script compara el snapshot actual con el anterior y detecta:

#### A Nivel Componente
- **Componentes nuevos**: Aparecen en snapshot nuevo pero no en el anterior
- **Componentes eliminados**: Aparecen en snapshot anterior pero no en el nuevo
- **Componentes renombrados**: Mismo ID, distinto nombre
- **Componentes deprecados**: Nombre ganó el marcador `⛔`
- **Variantes agregadas/eliminadas**: En un COMPONENT_SET existente

#### A Nivel Token
- **Token agregado**: Nueva propiedad vinculada a un token
- **Token cambiado**: Propiedad que cambió de un token a otro
- **Token removido**: Propiedad que ya no está vinculada a ningún token

#### A Nivel Propiedad Visual
- **Propiedad cambiada**: Valor hardcodeado que se modificó (ej: `paddingLeft: 16 → 20`)

### 3. Resolución de Nombres

El script usa `src/data/component-data.json` (generado por el plugin DS Extractor) como diccionario para convertir IDs de variables a nombres legibles:

```
VariableID:xyz/123 → color/primary-600
```

### 4. Generación del Changelog

El script genera dos outputs:

#### A. Consola (para desarrolladores)
Formato legible con emojis, categorías y agrupación inteligente.

#### B. JSON (para procesamiento)
Archivo `src/data/changelog.json` con estructura completa:

```json
{
  "id": "unique-id",
  "timestamp": "2026-08-16T14:14:00.000Z",
  "fileLabel": "components",
  "summary": "3 nuevos · 6 iterados",
  "changes": [...],
  "detailed": {
    "Button": {
      "variants": {...},
      "summary": {...}
    }
  },
  "stats": {...}
}
```

---

## Uso Diario

### Comandos Disponibles

#### 1. Generar Diff Manual

```bash
# Por librería específica
npm run diff -- components
npm run diff -- assets
npm run diff -- templates
npm run diff -- custom

# Por file key directo
npm run diff -- 0GIm2SB5mdvDF7ojlXkjV3
```

**Cuándo usar**: Después de hacer cambios en Figma y querés ver el impacto inmediatamente.

#### 2. Ver Changelog

```bash
# Ver últimas 10 entradas (default)
npm run view-changelog

# Ver más entradas
npm run view-changelog -- 20
npm run view-changelog -- 50

# Filtrar por librería
npm run view-changelog -- components
npm run view-changelog -- assets
```

**Cuándo usar**: Para revisar histórico de cambios o buscar cuándo se modificó algo.

#### 3. Consultar JSON

```bash
# Ver última entrada completa
cat src/data/changelog.json | jq '.[0]'

# Ver campo detailed
cat src/data/changelog.json | jq '.[0].detailed'

# Ver stats de últimas 5 entradas
cat src/data/changelog.json | jq '.[0:5] | .[].stats'

# Buscar cambios en componente específico
cat src/data/changelog.json | jq '.[] | select(.detailed.Button != null)'

# Filtrar por fecha
cat src/data/changelog.json | jq '.[] | select(.timestamp | startswith("2026-08-16"))'
```

**Cuándo usar**: Para análisis programático, reportes automatizados o debugging.

### Workflows Recomendados

#### 👨‍💻 Para Desarrolladores

**Workflow diario:**
1. GitHub Actions ejecuta automáticamente a las 9:00 AM
2. Revisás el commit automático si hay cambios
3. Si hay `bindingsChanged > 0` → revisás qué tokens cambiaron
4. Actualizás componentes React Native según corresponda

**Durante desarrollo activo:**
1. Hacés cambios en Figma
2. Ejecutás `npm run diff -- components`
3. Revisás el output para validar cambios
4. Iterás hasta que el cambio sea el deseado

**Ejemplo - Migración de tokens:**
```bash
# Ver qué componentes usan un token específico
npm run diff -- components | grep "color/primary"

# Ver detalles en JSON
cat src/data/changelog.json | jq '.[0].detailed | to_entries[] | select(.value.variants._base.tokens.changed[].from == "color/primary")'
```

#### 🎨 Para Diseñadores (UX)

**Auditoría de consistencia:**
1. Ejecutás `npm run view-changelog -- components`
2. Buscás componentes con muchos cambios de tokens
3. Revisás que las variantes usen los mismos tokens
4. Corregís inconsistencias en Figma

**Comunicación de cambios:**
1. Consultás stats para ver alcance: `jq '.[0].stats'`
2. Generás resumen para el equipo
3. Documentás cambios importantes en Confluence

**Ejemplo - Detectar hardcoded:**
```bash
# Ver componentes con cambios en propiedades visuales (potencialmente hardcoded)
npm run view-changelog | grep "Propiedades visuales"
```

---

## Formato del Output

### Consola (Human-Readable)

```
=======================================================
  CHANGELOG — components — 2026-08-16
=======================================================

### Componentes nuevos
  + Card2
  + Pill2

### Variantes nuevas (set existente)
  + Button › State=Loading

### Cambios en componentes

**Button**

  🎨 Tokens:
    • fills (2 cambios):
      Background → color/primary ➜ color/primary-600
      Icon → color/on-primary ➜ color/surface-inverse
    • spacing (+1 nuevo):
      + itemSpacing → spacing/sm

  📐 Propiedades visuales:
    • Spacing (3 cambios):
      Button → paddingLeft: 16 ➜ 20
      Button → paddingRight: 16 ➜ 20
      Button → itemSpacing: 8 ➜ 12
    • Bordes (1 cambio):
      Container → strokeWeight: 1 ➜ 1.5

**Card** (6 variantes afectadas)

  🎨 Tokens:
    • fills (4 cambios en variantes):
      › Elevation=Raised
        Background → color/surface ➜ color/surface-raised
      › Elevation=Sunken
        Background → color/surface ➜ color/surface-sunken
      ... y 4 variantes más

=======================================================
Changelog guardado en: src/data/changelog.json
Resumen: 2 nuevos · 4 iterados
```

### JSON (Machine-Readable)

```json
{
  "id": "msdcpzdo",
  "timestamp": "2026-08-16T14:14:00.000Z",
  "fileKey": "0GIm2SB5mdvDF7ojlXkjV3",
  "fileName": "Components",
  "fileLabel": "components",
  "summary": "2 nuevos · 4 iterados",
  
  "changes": [
    {
      "type": "component_added",
      "component": "Card2",
      "nodeId": "123:456",
      "details": "Card2"
    },
    {
      "type": "binding_changed",
      "component": "Button",
      "nodeId": "789:012",
      "details": "Background.fills → color/primary-600",
      "variant": "Button=State:Pressed",
      "property": "fills",
      "layerName": "Background",
      "oldValue": "color/primary",
      "newValue": "color/primary-600",
      "tokenName": "color/primary-600"
    }
  ],
  
  "detailed": {
    "Button": {
      "name": "Button",
      "isVariant": false,
      "variants": {
        "_base": {
          "tokens": {
            "changed": [
              {
                "property": "fills",
                "layer": "Background",
                "from": "color/primary",
                "to": "color/primary-600"
              }
            ],
            "added": [
              {
                "property": "spacing",
                "layer": "itemSpacing",
                "token": "spacing/sm"
              }
            ],
            "removed": []
          },
          "properties": [
            {
              "property": "paddingLeft",
              "layer": "Button",
              "from": "16",
              "to": "20"
            }
          ]
        },
        "Button=State:Pressed": {
          "tokens": {...},
          "properties": [...]
        }
      },
      "summary": {
        "tokensChanged": 2,
        "tokensAdded": 1,
        "tokensRemoved": 0,
        "propertiesChanged": 3
      }
    }
  },
  
  "stats": {
    "componentsAdded": 2,
    "componentsRemoved": 0,
    "componentsDeprecated": 0,
    "componentsRenamed": 0,
    "variantsAdded": 1,
    "variantsRemoved": 0,
    "propsAdded": 0,
    "propsRemoved": 0,
    "nested": 0,
    "unnested": 0,
    "bindingsAdded": 5,
    "bindingsRemoved": 2,
    "bindingsChanged": 12,
    "propertiesChanged": 8
  }
}
```

---

## Casos de Uso

### 🔧 Caso 1: Migración de Tokens

**Escenario**: Renombraste `color/primary` → `color/primary-600` en todos los componentes.

**Workflow**:
1. Ejecutás `npm run diff -- components`
2. Ves en el output:
   ```
   • Button
     🎨 Tokens:
       • fills (1 cambio):
         Background → color/primary ➜ color/primary-600
   • Card
     🎨 Tokens:
       • fills (1 cambio):
         Container → color/primary ➜ color/primary-600
   ```
3. En el código React Native buscás `color/primary` y reemplazás por `color/primary-600`
4. Ejecutás tests para validar que todo funcione

**Beneficio**: No tenés que revisar manualmente cada componente en Figma.

---

### 🎨 Caso 2: Nueva Variante

**Escenario**: Agregaste variante "Size=XLarge" al Button.

**Workflow**:
1. El changelog automático detecta:
   ```
   ### Variantes nuevas (set existente)
     + Button › State=Default, Size=XLarge
   ```
2. En el código agregás soporte:
   ```typescript
   interface ButtonProps {
     size?: 'sm' | 'md' | 'lg' | 'xlarge' // ← nuevo
   }
   ```
3. Verificás que el componente renderice correctamente

**Beneficio**: No te perdés de nuevas variantes que necesitan implementación.

---

### 📐 Caso 3: Cambio de Spacing

**Escenario**: Aumentaste el padding interno del Button.

**Workflow**:
1. El changelog muestra:
   ```
   • Button
     📐 Propiedades visuales:
       • Spacing (4 cambios):
         Button → paddingLeft: 16 ➜ 20
         Button → paddingRight: 16 ➜ 20
         Button → paddingTop: 12 ➜ 14
         Button → paddingBottom: 12 ➜ 14
   ```
2. Verificás que tu implementación respete los tokens y no tenga valores hardcodeados
3. Si está hardcodeado, lo actualizás manualmente

**Beneficio**: Detectás cuándo el spacing cambió y necesita ajuste en código.

---

### 🔍 Caso 4: Auditoría de Consistencia

**Escenario**: Querés verificar que todas las variantes de Card usen los mismos tokens.

**Workflow**:
1. Ejecutás `npm run view-changelog -- components`
2. Buscás cambios en Card
3. Revisás el campo `detailed`:
   ```json
   "Card": {
     "variants": {
       "Elevation=Raised": {
         "tokens": {
           "changed": [{
             "property": "fills",
             "from": "color/surface",
             "to": "color/surface-raised"
           }]
         }
       },
       "Elevation=Sunken": {
         "tokens": {
           "changed": [{
             "property": "fills",
             "from": "#FFFFFF",  // ❌ Hardcoded!
             "to": "color/surface-sunken"
           }]
         }
       }
     }
   }
   ```
4. Detectás que "Elevation=Sunken" tenía color hardcodeado
5. Corregís en Figma

**Beneficio**: Detectás inconsistencias que podrían generar bugs visuales.

---

### 🗑️ Caso 5: Deprecación

**Escenario**: Marcaste un componente viejo como deprecado (`⛔ Avatar-Old`).

**Workflow**:
1. El changelog detecta:
   ```
   ### Deprecados
     Avatar-Old → ⛔ Avatar-Old
   ```
2. Comunicás al equipo que migren a `Avatar` nuevo
3. Planeás eliminación completa en próxima versión

**Beneficio**: Comunicación clara de deprecaciones al equipo.

---

## Referencia Técnica

### Propiedades Trackeadas

#### 🎨 Tokens (Bindings a Variables de Figma)

Todas las propiedades que pueden estar vinculadas a tokens:
- `fills` → Colores de relleno
- `strokes` → Colores de borde
- `effects` → Sombras y efectos
- `topLeftRadius`, `topRightRadius`, `bottomLeftRadius`, `bottomRightRadius`
- `fontSize`, `fontWeight`, `fontFamily`, `lineHeight`, `letterSpacing`
- `itemSpacing`, `paddingLeft`, `paddingRight`, `paddingTop`, `paddingBottom`
- `layoutMode`, `primaryAxisAlignItems`, `counterAxisAlignItems`, etc.

#### 📐 Propiedades Visuales (Valores Hardcodeados)

Organizadas en categorías:

**Spacing**
- `paddingLeft`, `paddingRight`, `paddingTop`, `paddingBottom`
- `itemSpacing`
- `minWidth`, `maxWidth`, `minHeight`, `maxHeight`

**Tamaño**
- `width`, `height`
- `size.width`, `size.height` (de absoluteBoundingBox)

**Bordes**
- `topLeftRadius`, `topRightRadius`, `bottomLeftRadius`, `bottomRightRadius`
- `strokeWeight`

**Tipografía**
- `fontSize`, `fontWeight`, `fontFamily`
- `lineHeight`, `letterSpacing`
- `characters` (contenido de texto, truncado a 100 chars)

**Layout (Auto Layout)**
- `layoutMode` (HORIZONTAL/VERTICAL/NONE)
- `primaryAxisAlignItems`, `counterAxisAlignItems`
- `layoutWrap`
- `primaryAxisSizingMode`, `counterAxisSizingMode`

**Visual**
- `opacity`
- `visible`
- `blendMode`
- `clipsContent`
- `effects` (resumen de efectos aplicados)

**Color**
- `fill[0].color`, `fill[1].color` (valores hex)
- `fill[0].opacity`, `fill[1].opacity`
- `stroke[0].color`, `stroke[1].color` (valores hex)

### Tipos de Cambios

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `component_added` | Componente nuevo | `+ Button-new` |
| `component_removed` | Componente eliminado | `- Button-old` |
| `component_renamed` | Componente renombrado | `Button → Button-v2` |
| `component_deprecated` | Componente deprecado | `Button → ⛔ Button` |
| `variant_added` | Nueva variante en set existente | `+ Button › Size=XL` |
| `variant_removed` | Variante eliminada de set | `- Button › Size=XS` |
| `binding_added` | Token aplicado a propiedad | `+ fills → color/primary` |
| `binding_removed` | Token removido de propiedad | `- fills (era: color/primary)` |
| `binding_changed` | Token reemplazado | `color/primary → color/primary-600` |
| `property_changed` | Valor hardcodeado modificado | `paddingLeft: 16 → 20` |
| `component_prop_added` | Nueva prop de componente | `+ Disabled:BOOLEAN` |
| `component_prop_removed` | Prop de componente eliminada | `- ShowIcon:BOOLEAN` |

### Stats Disponibles

```typescript
interface ChangelogStats {
  componentsAdded: number        // Componentes nuevos
  componentsRemoved: number      // Componentes eliminados
  componentsDeprecated: number   // Componentes marcados ⛔
  componentsRenamed: number      // Componentes renombrados
  variantsAdded: number          // Nuevas variantes
  variantsRemoved: number        // Variantes eliminadas
  propsAdded: number             // Props de componente nuevas
  propsRemoved: number           // Props de componente eliminadas
  nested: number                 // Componentes anidados (instancias)
  unnested: number               // Componentes des-anidados
  bindingsAdded: number          // Tokens nuevos aplicados
  bindingsRemoved: number        // Tokens removidos
  bindingsChanged: number        // Tokens reemplazados
  propertiesChanged: number      // Props visuales cambiadas
}
```

### Archivos y Estructura

```
src/
├── data/
│   ├── changelog.json          # Histórico de cambios (últimas 100)
│   ├── component-data.json     # Diccionario de nombres (del plugin)
│   └── snapshots/
│       ├── latest-components.json
│       ├── latest-assets.json
│       ├── latest-templates.json
│       └── latest-custom.json

scripts/
├── diff-changelog.ts           # Generador principal (usado por el workflow diario)
├── view-changelog.ts           # Visor CLI
└── README.md                   # Índice de scripts

.github/
└── workflows/
    └── changelog.yml           # Automatización diaria
```

### Limitaciones Conocidas

1. **Rate Limiting**: La API de Figma tiene límites, el script espera 1.5s entre requests
2. **Tiempo de ejecución**: Para Components (1700+ componentes) puede tardar 5-10 minutos
3. **Snapshots grandes**: El archivo de Components pesa ~23 MB
4. **No detecta reordenamiento**: Si movés un componente de página, no se detecta
5. **Instancias anidadas**: La detección de nesting está desactivada (generaba falsos positivos)

### Variables de Entorno

```bash
# Requeridas
FIGMA_TOKEN=figd_xxx                    # Token de acceso personal de Figma

# Librerías
FIGMA_COMPONENTS_FILE_KEY=0GIm2...      # File key de Components
FIGMA_TEMPLATES_FILE_KEY=htvGL...       # File key de Templates
FIGMA_ASSETS_FILE_KEY=exvAa...          # File key de Assets
FIGMA_CUSTOM_COMPONENTS_FILE_KEY=Y81Mq... # File key de Custom

# Opcional (para testing)
COMPONENT_LIMIT=10                       # Limitar componentes procesados
```

---

## Troubleshooting

### Error: "Falta FIGMA_TOKEN"
**Solución**: Verificá que `.env` exista y tenga la variable `FIGMA_TOKEN`.

### Error: "No hay snapshot previo"
**Solución**: Es esperado la primera vez. Ejecutá el comando nuevamente después de hacer cambios en Figma.

### "Sin cambios detectados"
**Posibles causas**:
- Los cambios en Figma no se guardaron
- La API tarda en reflejar cambios (esperá 1 minuto)
- El snapshot es muy reciente y no hay cambios reales

### El diff tarda mucho
**Explicación**: Es normal. El proceso:
1. Consulta estructura del archivo (1 request)
2. Consulta cada página (~50 requests para Components)
3. Espera 1.5s entre requests (rate limiting)

**Total**: 5-10 minutos para Components.

**Workaround para testing**:
```bash
COMPONENT_LIMIT=5 npm run diff -- components
```

### No veo el campo `detailed` en changelog
**Explicación**: Las entradas existentes fueron generadas con la versión anterior. El campo `detailed` solo aparecerá en nuevos diffs después de esta actualización.

**Solución**: Ejecutá `npm run diff -- components` para generar una entrada nueva.

---

## Próximos Pasos

### Implementado ✅
- [x] Desglose detallado por propiedad y token
- [x] Información de variantes afectadas
- [x] Categorización visual de propiedades
- [x] Campo `detailed` en JSON
- [x] Visor mejorado con filtros
- [x] Automatización diaria vía GitHub Actions

### Pendiente ⏳
- [ ] Generar reporte HTML/Markdown del changelog
- [ ] Integración con Slack/Discord para notificaciones
- [ ] Dashboard visual de tendencias de cambios
- [ ] Alertas cuando un componente tiene >N cambios en una semana
- [ ] Export automático a Confluence
- [ ] Comparación entre dos fechas específicas
- [ ] Filtrado por tipo de cambio (solo tokens, solo spacing, etc.)

---

## Contacto y Feedback

Para sugerencias, bugs o consultas sobre el sistema de changelog:
- **Equipo**: Design Systems — Fractal DS
- **Documentación adicional**:
  - [`docs/CHANGELOG-FORMAT.md`](./CHANGELOG-FORMAT.md) — Schema del JSON
  - [`scripts/README.md`](../scripts/README.md) — Índice de scripts productivos

**Última actualización**: Agosto 2026
