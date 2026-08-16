# Ejemplos de Uso — Confluence Sync

## Casos de Uso Comunes

### 1. Consultar Guía de Componente

```
👤 Usuario en Kiro:
"Consulta la guía de uso del componente Button desde Confluence"

🤖 Kiro:
[Usa MCP de Confluence para buscar la página]
[Extrae contenido relevante]
[Lo presenta formateado con contexto del bridge]
```

### 2. Sincronizar Documentación de Gobernanza

```
👤 Usuario en Kiro:
"Sincroniza el proceso de pedidos de cambios desde Confluence"

🤖 Kiro:
[Conecta a Confluence via MCP]
[Busca página específica]
[Exporta contenido a markdown]
[Guarda en fractal-bridge/docs-sources/confluence/GOBERNANZA/]
```

### 3. Validar Implementación vs Documentación

```
👤 Usuario en Kiro:
"Verifica si mi implementación del formulario cumple con las guidelines de Confluence"

🤖 Kiro:
[Lee implementación actual]
[Consulta guidelines desde Confluence]
[Compara y reporta discrepancias]
[Sugiere correcciones]
```

### 4. Crear Spec desde Confluence

```
👤 Usuario en Kiro:
"Crea una spec para implementar el flujo de transferencias según la documentación de Confluence"

🤖 Kiro:
[Busca docs relacionadas en Confluence]
[Combina con component-api-mapping.json del bridge]
[Genera spec estructurada]
```

## Páginas Clave a Sincronizar

### Design System
- `/wiki/spaces/DS/pages/123456/Button+Component+Guidelines`
- `/wiki/spaces/DS/pages/789012/Form+Validation+Patterns`
- `/wiki/spaces/DS/pages/345678/Color+Usage+Guidelines`

### Gobernanza
- `/wiki/spaces/GOB/pages/901234/Change+Request+Process`
- `/wiki/spaces/GOB/pages/567890/Design+Review+Criteria`

### Producto
- `/wiki/spaces/PPAY/pages/111222/Transfer+Flow+Requirements`
- `/wiki/spaces/PPAY/pages/333444/Payment+Business+Rules`

## Comandos Útiles

### Listar Espacios
```
"Lista los espacios de Confluence disponibles"
```

### Buscar Páginas
```
"Busca páginas en Confluence sobre 'componentes'"
"Busca en el space DS páginas sobre 'button'"
```

### Obtener Contenido
```
"Obtén el contenido de la página 'Button Guidelines'"
"Lee la página de Confluence con ID 123456"
```

### Sincronizar a Archivo
```
"Sincroniza la página 'Button Guidelines' al bridge"
"Exporta las guidelines de formularios desde Confluence"
```

## Flujo Recomendado

### Primera Vez (Setup)
1. ✅ Obtener token de Confluence
2. ✅ Configurar variables en `.env`
3. ✅ Verificar MCP server conectado
4. 📋 Identificar páginas clave
5. 🔄 Sincronizar documentación inicial

### Uso Regular
1. 💬 Consultar docs on-demand desde Kiro
2. 🔄 Sincronizar al inicio de sprint
3. ✅ Validar implementaciones contra docs
4. 📝 Actualizar mapping cuando cambie Confluence

### Mantenimiento
- **Semanal:** Verificar cambios en páginas clave
- **Sprint:** Sincronizar antes de planning
- **Release:** Validar consistencia docs ↔ código
