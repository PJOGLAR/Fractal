# Fuentes de Documentación del Bridge

Este directorio contiene documentación sincronizada desde fuentes externas que alimentan el fractal-bridge.

## Estructura

```
docs-sources/
├── confluence/          # Docs sincronizados desde Confluence
│   ├── DS/             # Space del Design System
│   ├── GOBERNANZA/     # Procesos y workflows
│   └── PRODUCT/        # Contexto de negocio
├── figma-specs/        # Especificaciones exportadas desde Figma
└── api-docs/           # Documentación de APIs internas
```

## Sincronización

Cada fuente tiene su propio mecanismo de sincronización:

- **Confluence:** Ver `confluence-sync.md`
- **Figma:** Scripts en `/personal/scripts/`
- **APIs:** Swagger/OpenAPI imports

## Uso

Los agentes de Kiro pueden acceder directamente a estos documentos para:
- Responder preguntas sobre el Design System
- Generar código siguiendo patrones documentados
- Validar implementaciones contra specs oficiales
- Mantener consistencia con la fuente de verdad

## No Editables

⚠️ **No edites manualmente los archivos en `confluence/` y `figma-specs/`**  
Estos archivos son generados automáticamente y se sobrescriben en cada sincronización.

Para hacer cambios:
1. Edita en la fuente original (Confluence, Figma)
2. Re-ejecuta el script de sincronización
