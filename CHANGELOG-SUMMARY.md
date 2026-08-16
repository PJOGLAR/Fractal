# ✅ Sistema de Changelog Mejorado — Resumen de Implementación

## Qué se hizo

Se mejoró el sistema de changelog automático del Design System Fractal para proporcionar **información detallada y accionable** sobre cambios en componentes.

### Antes → Después

**❌ Antes:**
```
• Chip: iterado
```
Sin detalles de qué cambió.

**✅ Después:**
```
• Chip
  🎨 Tokens:
    • fills (2 cambios):
      Background → color/neutral-100 ➜ color/surface-secondary
      Border → color/border-subtle ➜ color/border-medium
  📐 Propiedades visuales:
    • Spacing (2 cambios):
      paddingLeft: 12 ➜ 16
      paddingRight: 12 ➜ 16
```

---

## Archivos Modificados

### Nuevos Archivos

1. **`scripts/view-changelog.ts`**
   - Visor mejorado de changelog con formato legible
   - Filtros por librería y cantidad de entradas
   - Muestra información detallada si está disponible

2. **`docs/CHANGELOG-GUIDE.md`** ⭐
   - **Guía completa** del sistema de changelog
   - Cómo funciona, casos de uso, comandos
   - Referencia técnica completa

3. **`docs/CHANGELOG-FORMAT.md`**
   - Documentación técnica del formato JSON
   - Estructura de datos detallada
   - Referencia de tipos de cambios

4. **`scripts/README.md`**
   - README breve de la carpeta scripts
   - Apunta a la documentación principal

### Archivos Modificados

5. **`scripts/diff-changelog.ts`**
   - Agregado campo `detailed` con información estructurada
   - Mejorado formato de consola con categorías
   - Agrupación de cambios por propiedad y variante
   - Desglose de tokens (changed/added/removed)
   - Categorización de propiedades visuales

6. **`package.json`**
   - Nuevo script: `"view-changelog": "tsx scripts/view-changelog.ts"`

7. **`README.md`**
   - Agregada sección sobre el sistema de changelog
   - Comandos disponibles
   - Link a documentación completa

---

## Nuevas Funcionalidades

### 1. Desglose Detallado por Propiedad

Ahora sabés exactamente qué propiedad cambió:
- **Tokens**: `fills`, `strokes`, `spacing`, `effects`
- **Visual**: `paddingLeft`, `fontSize`, `strokeWeight`, etc.

### 2. Valores Before/After

Cada cambio incluye:
- Valor anterior
- Valor nuevo
- Nombre del token (si aplica)

### 3. Información de Variantes

Para componentes con variantes:
- Muestra cuántas fueron afectadas
- Detalla cambios por variante específica
- Permite detectar inconsistencias

### 4. Categorización Visual

Propiedades agrupadas en:
- 🔳 Spacing (padding, itemSpacing, etc.)
- 📏 Tamaño (width, height)
- 🔲 Bordes (radius, strokeWeight)
- 🔤 Tipografía (fontSize, fontWeight, etc.)
- 📐 Layout (Auto Layout configs)
- 👁️ Visual (opacity, visible, effects)
- 🎨 Color (fill/stroke colors)

### 5. Campo `detailed` en JSON

Nuevo campo estructurado para procesamiento programático:

```json
{
  "detailed": {
    "Button": {
      "variants": {
        "_base": { "tokens": {...}, "properties": [...] },
        "State=Pressed": { "tokens": {...}, "properties": [...] }
      },
      "summary": {
        "tokensChanged": 4,
        "tokensAdded": 1,
        "tokensRemoved": 0,
        "propertiesChanged": 8
      }
    }
  }
}
```

---

## Comandos Disponibles

### Generar Diff

```bash
# Por librería
npm run diff -- components
npm run diff -- assets
npm run diff -- templates
npm run diff -- custom
```

### Ver Changelog

```bash
# Últimas 10 entradas
npm run view-changelog

# Últimas 20 entradas
npm run view-changelog -- 20

# Filtrar por librería
npm run view-changelog -- components
npm run view-changelog -- assets
```

### Consultar JSON

```bash
# Ver última entrada
cat src/data/changelog.json | jq '.[0]'

# Ver campo detailed
cat src/data/changelog.json | jq '.[0].detailed'

# Buscar componente específico
cat src/data/changelog.json | jq '.[] | select(.detailed.Button != null)'
```

---

## Cómo Probar

### Opción 1: Hacer cambio en Figma

1. Abrí la librería de Components en Figma
2. Hacé un cambio simple (ej: cambiar token de color en Button)
3. Ejecutá: `npm run diff -- components`
4. Verificá el output mejorado en consola
5. Revisá `src/data/changelog.json` — última entrada tendrá campo `detailed`

### Opción 2: Ver changelog existente

```bash
# Ver con visor mejorado
npm run view-changelog -- components

# Ver JSON directamente
cat src/data/changelog.json | jq '.[0]' | less
```

**Nota**: Las entradas antiguas no tienen el campo `detailed` (fueron generadas antes de esta mejora). Solo las nuevas entradas lo incluirán.

---

## Beneficios

### Para Desarrolladores

✅ **Sabés qué actualizar** sin abrir Figma  
✅ **Migraciones de tokens** más rápidas y seguras  
✅ **Detección de hardcoded** en propiedades visuales  
✅ **Stats automáticos** para reportar cambios

### Para Diseñadores (UX)

✅ **Auditoría de consistencia** entre variantes  
✅ **Detección de deprecaciones** clara  
✅ **Comunicación al equipo** con datos concretos  
✅ **Validación de cambios** sin revisar componente por componente

---

## Documentación

📖 **Guía principal**: [`docs/CHANGELOG-GUIDE.md`](./docs/CHANGELOG-GUIDE.md)

Incluye:
- Explicación completa de cómo funciona
- Casos de uso con ejemplos reales
- Referencia técnica de propiedades
- Troubleshooting y FAQ
- Comandos y workflows

📋 **Otras referencias**:
- [`docs/CHANGELOG-FORMAT.md`](./docs/CHANGELOG-FORMAT.md) — Formato JSON detallado
- [`scripts/README.md`](./scripts/README.md) — README de scripts
- [`.github/workflows/changelog.yml`](./.github/workflows/changelog.yml) — Automatización

---

## Siguiente Paso

**¡Probalo ahora!**

```bash
# 1. Hacer un cambio en Figma (Components)
# 2. Ejecutar diff
npm run diff -- components

# 3. Ver resultado
npm run view-changelog
```

El nuevo formato te mostrará **exactamente** qué cambió, en qué propiedad, y con qué valores.

---

## Estado de Implementación

- [x] Lógica de extracción detallada
- [x] Formato JSON estructurado
- [x] Output de consola mejorado
- [x] Visor con filtros
- [x] Documentación completa
- [x] Integración con GitHub Actions
- [x] Actualización del README principal

**Estado**: ✅ **Completo y listo para usar**

---

**Implementado**: Agosto 2026  
**Equipo**: Design Systems — Fractal DS
