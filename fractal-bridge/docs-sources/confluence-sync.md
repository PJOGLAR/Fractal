# Sincronización con Confluence

Este documento detalla cómo sincronizar automáticamente documentación desde Confluence hacia el fractal-bridge.

## Configuración Inicial

### 1. Obtener Credenciales

**API Token de Confluence:**
1. Ve a: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click en "Create API token"
3. Dale un nombre: `fractal-bridge-sync`
4. Copia el token generado

### 2. Configurar Variables de Entorno

Edita `.env` en la raíz del proyecto:

```bash
CONFLUENCE_URL=https://tu-dominio.atlassian.net
CONFLUENCE_EMAIL=tu-email@empresa.com
CONFLUENCE_API_TOKEN=tu_token_aqui
```

### 3. Verificar MCP Server

El MCP server de Confluence está configurado en `.kiro/settings/mcp.json`.

Para verificar que funciona:
```bash
# Desde Kiro, pregunta:
"Lista los espacios de Confluence disponibles"
```

## Páginas a Sincronizar

Define aquí las páginas clave de Confluence que alimentan el bridge:

### Design System Documentation
- **Space:** `DS` o `FRACTAL`
- **Páginas:**
  - Guías de uso de componentes
  - Patrones de diseño
  - Mejores prácticas
  - Casos de uso reales

### Gobernanza y Procesos
- **Space:** `GOBERNANZA`
- **Páginas:**
  - Proceso de solicitud de cambios
  - Workflow de aprobación
  - Criterios de validación

### Business Context
- **Space:** `PPAY` o `PRODUCT`
- **Páginas:**
  - Contexto del negocio Telecom
  - User personas
  - Flujos de usuario críticos

## Script de Sincronización

```bash
# Ejecutar sincronización manual
npm run sync:confluence

# Sincronización automática (futuro)
npm run sync:confluence:watch
```

## Estructura de Salida

Los documentos sincronizados se guardan en:

```
fractal-bridge/
  docs-sources/
    confluence/
      {space-key}/
        {page-title}.md
```

Ejemplo:
```
fractal-bridge/
  docs-sources/
    confluence/
      DS/
        button-guidelines.md
        card-patterns.md
      GOBERNANZA/
        change-request-process.md
```

## Mapeo de Páginas

| Página Confluence | Archivo Bridge | Propósito |
|-------------------|----------------|-----------|
| "Button - Guía de Uso" | `guides/components/button.md` | Documenta uso del componente Button |
| "Patrones de Composición" | `guides/composition-patterns.md` | Patrones de layout |
| "Proceso de Pedidos" | `workflows/change-requests.md` | Gobernanza de cambios |

## Uso en Kiro

Una vez sincronizado, Kiro puede acceder a la documentación:

```
# En chat de Kiro:
"Consulta la guía de uso del componente Button desde Confluence"
"¿Cuál es el proceso de gobernanza según Confluence?"
```

## Mantenimiento

- **Frecuencia de sync:** Semanal o al inicio de cada sprint
- **Responsable:** Design System Lead
- **Notificaciones:** Avisar al equipo cuando se actualice documentación crítica
