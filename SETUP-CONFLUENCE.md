# Setup Rápido — Confluence MCP

## Pasos para Activar

### 1. Obtener API Token

1. Ve a: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click **"Create API token"**
3. Nombre: `fractal-bridge-kiro`
4. Copia el token (se muestra una sola vez)

### 2. Configurar Variables

Edita `.env` en la raíz del proyecto:

```bash
# Confluence API Configuration
CONFLUENCE_URL=https://tu-dominio.atlassian.net
CONFLUENCE_EMAIL=tu-email@empresa.com
CONFLUENCE_API_TOKEN=token_que_copiaste_aqui
```

**Ejemplo real:**
```bash
CONFLUENCE_URL=https://personalpay.atlassian.net
CONFLUENCE_EMAIL=maria.garcia@telecom.com.ar
CONFLUENCE_API_TOKEN=ATATT3xFfGF0...tu_token_real...xyz123
```

### 3. Verificar Instalación

#### Opción A: Verificar desde Kiro

1. Abre Kiro
2. En el chat, escribe:
   ```
   Lista los espacios de Confluence disponibles
   ```
3. Si funciona, verás los espacios configurados (DS, GOBERNANZA, etc.)

#### Opción B: Verificar MCP Server

1. Abre Command Palette: `Cmd+Shift+P`
2. Busca: `MCP`
3. Selecciona: `View MCP Servers`
4. Verifica que `confluence` esté conectado y activo

### 4. Primer Uso

Prueba estos comandos en Kiro:

```
"¿Qué espacios tengo en Confluence?"
"Busca páginas sobre componentes"
"Muéstrame la página de Button Guidelines"
```

## Troubleshooting

### Error: "Confluence MCP server not connected"

**Solución:**
1. Verifica que `.env` tenga las 3 variables configuradas
2. Reinicia Kiro
3. Revisa `.kiro/settings/mcp.json` existe

### Error: "401 Unauthorized"

**Causas comunes:**
- Token incorrecto o expirado
- Email no coincide con la cuenta de Confluence
- URL del dominio incorrecta

**Solución:**
- Regenera el token en Atlassian
- Verifica que el email sea exactamente el de tu cuenta
- Confirma la URL (ej: `https://personalpay.atlassian.net`)

### El MCP existe pero no responde

**Solución:**
1. Command Palette → `Reload MCP Servers`
2. O reinicia Kiro completamente

### "uvx not found"

**Solución:**
Instala `uv` (package manager de Python):

```bash
# macOS con Homebrew
brew install uv

# O con curl
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Luego reinicia la terminal y Kiro.

## Siguiente Paso

Una vez configurado, lee:
- `fractal-bridge/docs-sources/confluence-sync.md` — proceso de sincronización
- `fractal-bridge/docs-sources/confluence-examples.md` — ejemplos de uso

---

**¿Necesitas ayuda?** Escribe en el chat de Kiro:
```
"Ayúdame a configurar Confluence"
```
