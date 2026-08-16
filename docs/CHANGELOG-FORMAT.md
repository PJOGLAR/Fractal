# Formato del Changelog Detallado

El sistema de changelog automático genera reportes diarios de cambios en las librerías de Figma (Components, Templates, Assets, Custom, Foundations).

## Mejoras Implementadas (Agosto 2026)

### Antes
- Solo nombres de componentes modificados
- Sin detalles de qué cambió específicamente
- Difícil para desarrolladores entender el impacto

### Después
- **Desglose por propiedad**: Qué tokens cambiaron (fills, strokes, spacing, etc.)
- **Desglose por variante**: Si un componente tiene variantes, se muestra cuál fue afectada
- **Categorización visual**: Tokens, Spacing, Tipografía, Colores, Layout
- **Valores antes/después**: `paddingLeft: 16 → 20`
- **Información de capa**: `Button/Background → color/primary`

## Estructura del Changelog

### Formato JSON

```json
{
  "id": "msdcpzdo",
  "timestamp": "2026-08-16T14:14:00.000Z",
  "fileKey": "0GIm2SB5mdvDF7ojlXkjV3",
  "fileName": "Components",
  "fileLabel": "components",
  "summary": "3 nuevos · 6 iterados",
  "changes": [
    {
      "type": "component_added",
      "component": "Button-new",
      "nodeId": "123:456",
      "details": "Button-new"
    },
    {
      "type": "binding_changed",
      "component": "Button",
      "nodeId": "789:012",
      "details": "Background.fills → color/primary-new",
      "variant": "Button=State:Pressed,Size:Medium",
      "property": "fills",
      "layerName": "Background",
      "oldValue": "color/primary",
      "newValue": "color/primary-new",
      "tokenName": "color/primary-new"
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
                "to": "color/primary-new"
              }
            ],
            "added": [],
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
          "tokens": {
            "changed": [...],
            "added": [...],
            "removed": [...]
          },
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
    "componentsAdded": 3,
    "componentsRemoved": 0,
    "variantsAdded": 1,
    "bindingsChanged": 12,
    "propertiesChanged": 45
  }
}
```

## Tipos de Cambios

### Nivel Componente
- `component_added`: Componente completamente nuevo
- `component_removed`: Componente eliminado
- `component_renamed`: Componente renombrado
- `component_deprecated`: Componente marcado como deprecado (⛔)
- `variant_added`: Nueva variante en un set existente
- `variant_removed`: Variante eliminada de un set

### Nivel Token
- `binding_added`: Token nuevo aplicado a una propiedad
- `binding_removed`: Token removido de una propiedad
- `binding_changed`: Token reemplazado por otro

### Nivel Propiedad Visual
- `property_changed`: Valor hardcodeado modificado (spacing, size, opacity, etc.)
- `component_prop_added`: Nueva propiedad de componente (Boolean, Text, Instance Swap)
- `component_prop_removed`: Propiedad de componente eliminada

## Propiedades Visuales Trackeadas

### Spacing
- `paddingLeft`, `paddingRight`, `paddingTop`, `paddingBottom`
- `itemSpacing`
- `minWidth`, `maxWidth`, `minHeight`, `maxHeight`

### Tamaño
- `width`, `height`
- `size.width`, `size.height` (absoluteBoundingBox)

### Bordes
- `topLeftRadius`, `topRightRadius`, `bottomLeftRadius`, `bottomRightRadius`
- `strokeWeight`

### Tipografía
- `fontSize`, `fontWeight`, `fontFamily`
- `lineHeight`, `letterSpacing`
- `characters` (contenido de texto, truncado a 100 chars)

### Layout (Auto Layout)
- `layoutMode` (HORIZONTAL/VERTICAL/NONE)
- `primaryAxisAlignItems`, `counterAxisAlignItems`
- `layoutWrap`
- `primaryAxisSizingMode`, `counterAxisSizingMode`

### Visual
- `opacity`
- `visible`
- `blendMode`
- `clipsContent`
- `effects` (shadows, blurs)

### Color
- `fill[0].color`, `fill[1].color` (hex values)
- `fill[0].opacity`, `fill[1].opacity`
- `stroke[0].color`, `stroke[1].color`

## Uso para Desarrolladores

### Ver changelog en consola
```bash
# Ver últimas 10 entradas
npm run view-changelog

# Ver últimas 20 entradas
npm run view-changelog -- 20

# Filtrar por librería
npm run view-changelog -- components
npm run view-changelog -- assets
```

### Generar nuevo diff
```bash
# Comparar con snapshot anterior
npm run diff -- components
npm run diff -- assets
npm run diff -- templates
```

### Leer changelog programáticamente
```typescript
import changelog from './src/data/changelog.json'

// Obtener cambios recientes en Button
const buttonChanges = changelog
  .filter(entry => entry.fileLabel === 'components')
  .flatMap(entry => Object.entries(entry.detailed || {})
    .filter(([name]) => name === 'Button')
    .map(([_, detail]) => detail)
  )

// Listar tokens cambiados en última semana
const lastWeek = Date.now() - 7 * 24 * 60 * 60 * 1000
const recentTokenChanges = changelog
  .filter(e => new Date(e.timestamp).getTime() > lastWeek)
  .filter(e => e.stats.bindingsChanged > 0)
```

## Uso para Diseñadores (UX)

El changelog permite:
1. **Auditar cambios**: Ver qué componentes fueron modificados entre versiones
2. **Entender impacto**: Cuántos tokens/propiedades cambiaron
3. **Detectar inconsistencias**: Variantes que no usan los mismos tokens
4. **Revisar deprecaciones**: Componentes marcados para eliminación (⛔)
5. **Validar migraciones**: Confirmar que un token fue reemplazado en todos los componentes

### Ejemplo de lectura
```
📅 16 de ago de 2026, 11:14 a. m. — Components
   3 nuevos · 6 iterados

   ✨ Componentes nuevos (3):
      + Card2
      + Pill2

   🔄 Componentes con cambios (6):
      • Button
        🎨 Tokens:
          • fills (2 cambios):
            Background → color/primary ➜ color/primary-600
            Icon → color/on-primary ➜ color/surface-inverse
        📐 Propiedades visuales:
          • Spacing (3 cambios):
            Button → paddingLeft: 16 ➜ 20
            Button → paddingRight: 16 ➜ 20
            Button → itemSpacing: 8 ➜ 12
```

## Workflow Recomendado

### Para desarrolladores
1. Revisar changelog diario en CI/CD
2. Si hay `bindingsChanged > 0` → revisar implementación de código
3. Si hay `variantsAdded > 0` → agregar soporte en componente React Native
4. Si hay `component_deprecated` → planificar migración

### Para diseñadores
1. Revisar `detailed` para entender cambios específicos
2. Validar que variantes sean consistentes (mismos tokens)
3. Confirmar que deprecaciones estén marcadas correctamente
4. Usar stats para comunicar alcance de cambios al equipo

## Automatización (GitHub Actions)

El workflow `.github/workflows/changelog.yml` ejecuta:
- **Diariamente a las 9:00 AM Argentina** (12:00 UTC)
- Genera diff para todas las librerías (components, templates, assets, custom)
- Commitea cambios automáticamente si hay diferencias
- Mantiene histórico de últimas 100 entradas

## Roadmap

- [ ] Generar reporte HTML/Markdown del changelog
- [ ] Integración con Slack/Discord para notificaciones
- [ ] Dashboard visual de tendencias de cambios
- [ ] Alertas cuando un componente tiene >N cambios en una semana
- [ ] Exportar changelog a Confluence automáticamente
