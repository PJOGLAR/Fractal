# Fractal Design System Dashboard

Dashboard web para visualizar y auditar el Design System Fractal de Telecom Personal Pay.

## Arquitectura

### Stack Técnico
- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** CSS modules + design tokens
- **Deploy:** Vercel con SPA routing
- **Datos:** JSON estático generado desde Figma

### Extracción de Datos

El dashboard consume datos de Figma mediante **tres plugins complementarios**:

#### 1. Foundations Export Plugin
- **Ubicación:** `personal/figma-plugin-foundations-export/`
- **Plugin ID:** `foundations-export-fractal`
- **Propósito:** Extrae inventario completo de tokens y variables
- **Datos exportados:**
  - Colecciones de tokens
  - Variables con valores por modo (light/dark)
  - Relaciones de alias entre tokens
  - Metadata y estadísticas

#### 2. DS Extractor Plugin  
- **Ubicación:** `personal/ds-extractor/`
- **Plugin ID:** `token-extractor-fractal`
- **Propósito:** Mapea uso de tokens en componentes
- **Datos exportados:**
  - Bindings token→componente
  - Propiedades que usan cada token
  - Identificación de tokens huérfanos

#### 3. Token Component Generator V2
- **Ubicación:** `personal/figma-plugin-generator-v2/`
- **Plugin ID:** `token-component-generator-v2-fractal`
- **Propósito:** Genera componentes automáticamente usando tokens
- **Funcionalidad:**
  - Crea componentes con bindings correctos
  - Aplica tokens según convenciones del sistema
  - Automatiza la creación consistente de componentes

## Flujo de Trabajo

### 1. Preparación de Datos
```bash
# En Figma:
# 1. Ejecutar "Foundations Export" en archivo de Foundations
# 2. Ejecutar "DS Extractor" en archivo específico (Components/Templates/Assets/Custom)

# En terminal - extraer cada librería:
# Componentes principales
FIGMA_COMPONENTS_FILE_KEY=component_file_id npm run extract

# Templates y layouts  
FIGMA_TEMPLATES_FILE_KEY=template_file_id npm run extract

# Assets e iconos
FIGMA_ASSETS_FILE_KEY=assets_file_id npm run extract

# Componentes custom
FIGMA_CUSTOM_COMPONENTS_FILE_KEY=custom_file_id npm run extract
```

### 2. Desarrollo Local
```bash
npm install
npm run dev
```

### 3. Deploy
```bash
npm run build
# Deploy automático en Vercel
```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build para producción |  
| `npm run preview` | Preview del build |
| `npm run extract` | Extrae datos de Figma API |
| `npm run diff` | Genera changelog entre versiones |
| `npm run view-changelog` | Visualiza changelog con formato mejorado |

### Sistema de Changelog Automático

El proyecto incluye un **sistema de changelog detallado** que monitorea cambios en las librerías de Figma:

- **Automatización:** Se ejecuta diariamente a las 9:00 AM (GitHub Actions)
- **Librerías monitoreadas:** Components, Templates, Assets, Custom
- **Output:** `src/data/changelog.json` con histórico de cambios
- **Visor:** `npm run view-changelog` para navegación interactiva

**Información que detecta:**
- 🎨 Cambios en tokens (qué token cambió en qué propiedad)
- 📐 Cambios en propiedades visuales (spacing, tamaños, colores)
- 🔄 Variantes nuevas o modificadas
- ✨ Componentes nuevos/eliminados/renombrados
- 📊 Stats detallados de impacto

**Ver guía completa:** [`docs/CHANGELOG-GUIDE.md`](./docs/CHANGELOG-GUIDE.md)

**Uso rápido:**
```bash
# Generar diff manual
npm run diff -- components

# Ver últimos cambios
npm run view-changelog

# Filtrar por librería
npm run view-changelog -- assets
```

## Variables de Entorno

Crear `.env` con:
```bash
FIGMA_TOKEN=your_figma_token

# Librerías del Design System (cambiar según qué extraer)
FIGMA_FOUNDATIONS_FILE_KEY=figma_foundations_file_id
FIGMA_COMPONENTS_FILE_KEY=figma_components_file_id  
FIGMA_TEMPLATES_FILE_KEY=figma_templates_file_id
FIGMA_ASSETS_FILE_KEY=figma_assets_file_id
FIGMA_CUSTOM_COMPONENTS_FILE_KEY=figma_custom_file_id

# Confluence API (opcional - para sincronizar documentación)
CONFLUENCE_URL=https://tu-dominio.atlassian.net
CONFLUENCE_EMAIL=tu-email@empresa.com
CONFLUENCE_API_TOKEN=tu_confluence_token

# Configuración
COMPONENT_LIMIT=0  # 0 = todos los componentes
```

### Confluence Sync (Opcional)

Para alimentar el **Fractal Bridge** con documentación desde Confluence:
1. Ver [SETUP-CONFLUENCE.md](./SETUP-CONFLUENCE.md) para configuración completa
2. Configurar las 3 variables de Confluence en `.env`
3. El MCP server permite consultar docs on-demand desde Kiro
4. Docs de uso en `fractal-bridge/docs-sources/`

### Mapeo de Librerías
| Variable ENV | Output File | Propósito |
|--------------|-------------|-----------|
| `FIGMA_FOUNDATIONS_FILE_KEY` | `foundations-data.json` | Tokens y foundations |
| `FIGMA_COMPONENTS_FILE_KEY` | `component-data.json` | Componentes principales |
| `FIGMA_TEMPLATES_FILE_KEY` | `template-data.json` | Templates y layouts |
| `FIGMA_ASSETS_FILE_KEY` | `asset-data.json` | Icons y assets |
| `FIGMA_CUSTOM_COMPONENTS_FILE_KEY` | `custom-data.json` | Componentes custom |

## Estructura del Proyecto

```
├── src/
│   ├── components/         # Componentes del dashboard
│   ├── data/              # JSONs estáticos generados
│   ├── pages/             # Vistas principales
│   └── types.ts           # Tipos TypeScript
├── personal/
│   ├── ds-extractor/      # Plugin de extracción de componentes
│   ├── figma-plugin-foundations-export/  # Plugin de tokens
│   └── scripts/           # Scripts de procesamiento
└── scripts/               # Utilidades de análisis
```

## Datos Exportados

El dashboard consume `src/data/dashboard-data.json` con estructura:

```typescript
interface DashboardData {
  extractedAt: string
  foundations: {
    collections: string[]
    primitiveTokens: TokenData[]
    semanticTokens: TokenData[]
  }
  components: ComponentTokenBinding[]
  orphanTokens: TokenData[]        // Tokens no usados
  hardcodedValues: string[]        // Valores hardcodeados detectados
}
```

## Vistas del Dashboard

- **Overview:** Estadísticas generales del design system
- **Components:** Catálogo de componentes con tokens vinculados  
- **Tokens:** Explorador de tokens primitivos y semánticos
- **Assets:** Gestión de assets y recursos
- **Changelog:** Historial de cambios entre versiones
- **Chat Assistant:** 💬 Asistente IA para preguntas sobre el DS

## Chat Assistant de Voz (Gemini 3.1 Flash Live)

El dashboard incluye un **asistente de voz en tiempo real** que responde preguntas sobre el Design System hablando, usando [Gemini 3.1 Flash Live](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-live-preview).

### Arquitectura:
- **Modelo:** `gemini-3.1-flash-live-preview` (audio-a-audio, baja latencia)
- **Protocolo:** WebSocket directo cliente → Gemini (no pasa por nuestro backend, mejor latencia)
- **Seguridad:** El navegador nunca ve la API key real. El backend (`/api/live-token`) genera un **token efímero** de un solo uso (1 min para conectar, 30 min de sesión) que el cliente usa para conectarse directamente.
- **Contexto:** El system prompt con datos del Design System (componentes, tokens, templates) se inyecta en el servidor al crear el token, no en el cliente.

### Funcionalidades:
- 🎙️ **Conversación por voz** en tiempo real (no chat de texto)
- 📝 **Transcripción en vivo** de lo que decís y de la respuesta del asistente
- 🔊 **Voz nativa en español** (voz "Kore")
- 🛑 **Interrupciones:** podés hablar mientras el asistente responde

### Setup:
1. Obtener API key en [Google AI Studio](https://aistudio.google.com/apikey)
2. Agregar `GEMINI_API_KEY=your_key` al `.env` (y a las variables de entorno de Vercel)
3. Deploy en Vercel

### Archivos clave:
| Archivo | Rol |
|---------|-----|
| `api/live-token.ts` | Edge Function que genera el token efímero con el contexto del DS |
| `src/lib/audioUtils.ts` | Captura de micrófono (PCM 16kHz) y reproducción de audio (PCM 24kHz) |
| `src/components/DSChat.tsx` | UI de la llamada de voz + conexión WebSocket vía `@google/genai` |

### Acceso:
- **Botón flotante** (🎙️) en la esquina inferior derecha
- Al abrir, tocar **"Iniciar conversación"** (pide permiso de micrófono)
- El navegador debe soportar `AudioContext` y `getUserMedia` (Chrome/Edge/Safari recientes)

### Notas de seguridad:
- El endpoint `/api/live-token` requiere que `GEMINI_API_KEY` esté configurada solo en el servidor (Vercel env vars), nunca en código de cliente.
- Este endpoint no tiene autenticación de usuario propia — cualquiera con acceso al dashboard puede generar tokens. Si el dashboard es público, considerar agregar un chequeo de sesión/autenticación antes de emitir tokens.

## Mantenimiento

### Actualizar Datos
1. Ejecutar ambos plugins en Figma
2. Correr `npm run extract` 
3. Commit y deploy automático

### Troubleshooting
- **Error 429:** Rate limit de Figma API - el script incluye delays automáticos
- **Tokens faltantes:** Verificar que Foundations Export se ejecutó correctamente
- **Componentes sin datos:** Verificar FIGMA_COMPONENTS_FILE_KEY en .env

---

Para reglas de desarrollo con Fractal UI, ver [AGENTS.md](./AGENTS.md).