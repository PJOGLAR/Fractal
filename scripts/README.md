# Scripts del Sistema de Changelog

Esta carpeta contiene los scripts principales para el sistema de changelog automático del Design System Fractal.

## Scripts Disponibles

### `diff-changelog.ts`
Genera diffs entre snapshots de Figma y actualiza el changelog.

```bash
npm run diff -- components
npm run diff -- assets
npm run diff -- templates
npm run diff -- custom
```

### `view-changelog.ts`
Visualiza el changelog con formato mejorado.

```bash
npm run view-changelog
npm run view-changelog -- 20
npm run view-changelog -- components
```

## Documentación Completa

📖 **Ver la guía completa**: [`docs/CHANGELOG-GUIDE.md`](../docs/CHANGELOG-GUIDE.md)

Incluye:
- Cómo funciona el sistema
- Mejoras implementadas
- Casos de uso prácticos
- Referencia técnica completa
- Troubleshooting

## Quick Start

```bash
# 1. Hacer cambios en Figma
# 2. Ejecutar diff
npm run diff -- components

# 3. Ver resultado
npm run view-changelog

# 4. Consultar JSON
cat src/data/changelog.json | jq '.[0]'
```

## Automatización

El changelog se genera automáticamente todos los días a las 9:00 AM vía GitHub Actions.

Ver workflow: [`.github/workflows/changelog.yml`](../.github/workflows/changelog.yml)
