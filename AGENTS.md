# Fractal Design System — Agent Context

Este archivo contiene las reglas operacionales para agentes que trabajan con el Design System Fractal de Telecom Personal Pay.

## Stack y Tecnología

**Fractal está implementado** como paquete React Native con soporte web:
- **Librería:** `@ppay-mobile/fractal-ui`
- **Tokens:** `@ppay-mobile/fractal-tokens` (incluido automáticamente)
- **Framework:** Tamagui para sistema de variantes
- **Plataformas:** React Native + Web (react-native-web)

## Instalación

```bash
npm install @ppay-mobile/fractal-ui react-native-reanimated react-native-svg react-native-safe-area-context
```

Configurar registry privado en `.npmrc`:
```
@ppay-mobile:registry=https://gitlab.com/api/v4/projects/70809357/packages/npm/
//gitlab.com/api/v4/projects/70809357/packages/npm/:_authToken=${GITLAB_PERSONAL_TOKEN}
```

## Reglas Fundamentales

### 1. NO reimplementes componentes
**Siempre importar de la librería:**
```tsx
import { Button, Card, TextInput } from '@ppay-mobile/fractal-ui';
```

**Nunca hacer:**
```tsx
// ❌ NO hagas esto
const CustomButton = ({ children }) => (
  <TouchableOpacity style={{ backgroundColor: '#5A50F9' }}>
    <Text>{children}</Text>
  </TouchableOpacity>
);
```

### 2. Envolver en FractalUIProvider
Toda aplicación debe envolver el root en el provider:
```tsx
import { FractalUIProvider } from '@ppay-mobile/fractal-ui';

export default function App() {
  return (
    <FractalUIProvider>
      {/* Tu app aquí */}
    </FractalUIProvider>
  );
}
```

### 3. Usar variantes del sistema
Los componentes tienen variantes predefinidas:
```tsx
<Button variant="solid" size="md" appearance="default" />
<Button variant="outline" size="lg" />
<Button variant="ghost" size="sm" />
```

### 4. No hardcodear valores
**Usar tokens del sistema:**
```tsx
// ✅ Correcto - usar spacing del sistema
<View style={{ padding: '$spacing-md', gap: '$gap-sm' }} />

// ❌ Incorrecto - valores hardcodeados  
<View style={{ padding: 16, gap: 8 }} />
```

## Componentes Principales

### Button
```tsx
<Button 
  label="Confirmar" 
  variant="solid" 
  size="md" 
  onPress={() => {}} 
/>
```

### Card
```tsx
<Card>
  <Text>Contenido de la card</Text>
</Card>
```

### TextInput  
```tsx
<TextInput
  label="Email"
  placeholder="tu@email.com"
  value={email}
  onChangeText={setEmail}
/>
```

## Estados y Variantes

Cada componente maneja sus estados internamente:
- **default:** Estado inicial
- **hover:** Solo web, automático
- **pressed:** Al hacer tap/click
- **focus:** Al recibir foco
- **disabled:** Componente inactivo
- **loading:** Para botones con carga

## Tokens Disponibles

Los tokens están disponibles vía Tamagui como `$token-name`:
- **Colores:** `$color-primary`, `$color-neutral-medium`
- **Spacing:** `$spacing-sm`, `$spacing-md`, `$spacing-lg`  
- **Tipografía:** `$fontSize-body-md`, `$fontWeight-semibold`
- **Border radius:** `$borderRadius-sm`, `$borderRadius-md`

## Patterns de Composición

### Pantalla de Lista
```tsx
<ScrollView style={{ padding: '$spacing-md' }}>
  <Text variant="heading-lg">Título</Text>
  <View style={{ gap: '$gap-sm' }}>
    {items.map(item => (
      <Card key={item.id}>
        <Text>{item.title}</Text>
      </Card>
    ))}
  </View>
</ScrollView>
```

### Formulario
```tsx
<View style={{ padding: '$spacing-lg', gap: '$gap-md' }}>
  <TextInput label="Campo 1" />
  <TextInput label="Campo 2" />
  <Button label="Enviar" variant="solid" />
</View>
```

## Do's and Don'ts para Agentes

**Do:**
- Importar componentes de `@ppay-mobile/fractal-ui`
- Usar variantes predefinidas (`variant`, `size`, `appearance`)
- Aplicar tokens del sistema (`$spacing-md`, `$color-primary`)
- Envolver en `FractalUIProvider`
- Consultar la documentación de componentes específicos

**Don't:**
- Crear componentes custom que repliquen funcionalidad existente
- Hardcodear colores, spacing o tipografía
- Usar estilos CSS planos sin tokens
- Olvidar el provider en el root
- Asumir APIs - verificar props disponibles en cada componente

## Debugging

Si un componente no se ve correctamente:
1. Verificar que `FractalUIProvider` envuelve la app
2. Confirmar que las variantes existen (`variant="solid"` vs `variant="primary"`)
3. Revisar que los tokens estén bien referenciados (`$spacing-md` no `spacing-md`)

Para más detalles, consultar la documentación completa en Storybook del proyecto.

## Plugins de Figma para Dashboard

El dashboard consume datos extraídos mediante **DOS plugins de Figma complementarios**:

### 1. Foundations Export
- **Plugin:** `personal/figma-plugin-foundations-export/`
- **ID:** `foundations-export-fractal`
- **Propósito:** Extrae inventario completo de tokens/variables
- **Output:** JSON con colecciones, variables, valores por modo, alias
- **Uso:** Ejecutar en archivo de Foundations para obtener snapshot de tokens

### 2. DS Extractor  
- **Plugin:** `personal/ds-extractor/`
- **ID:** `token-extractor-fractal`
- **Propósito:** Extrae bindings de tokens en componentes
- **Output:** Mapeo de qué tokens usa cada componente
- **Uso:** Ejecutar en archivo de Components para obtener usage mapping

### 3. Token Component Generator V2
- **Plugin:** `personal/figma-plugin-generator-v2/`
- **ID:** `token-component-generator-v2-fractal`
- **Propósito:** Genera componentes automáticamente usando tokens
- **Output:** Componentes de Figma con bindings correctos
- **Uso:** Crear nuevos componentes siguiendo el sistema de tokens

## Flujo de Datos del Dashboard
```
Figma Foundations File
        ↓
Foundations Export Plugin → tokens inventory JSON
        ↓
extract-figma-data.ts (combina con componente bindings)
        ↓
dashboard-data.json (datos estáticos)
        ↓
React Dashboard (src/App.tsx)

Token Component Generator V2 ← para crear nuevos componentes
```

## Sincronización con Confluence

El bridge puede consumir documentación desde Confluence vía MCP server:

### Setup
1. Obtener API token: https://id.atlassian.com/manage-profile/security/api-tokens
2. Configurar en `.env`:
```bash
CONFLUENCE_URL=https://tu-dominio.atlassian.net
CONFLUENCE_EMAIL=tu-email@empresa.com
CONFLUENCE_API_TOKEN=tu_token
```
3. MCP server está en `.kiro/settings/mcp.json`

### Uso en Kiro
```
"Lista los espacios de Confluence disponibles"
"Busca páginas sobre componentes Button"
"Sincroniza la página de guidelines al bridge"
```

### Documentación
- Ver `SETUP-CONFLUENCE.md` para configuración paso a paso
- Ver `fractal-bridge/docs-sources/confluence-sync.md` para sincronización
- Ver `fractal-bridge/docs-sources/confluence-examples.md` para ejemplos

### Scripts de Extracción
- **Comando:** `npm run extract` 
- **Script:** `personal/scripts/extract-figma-data.ts`
- **Variables requeridas:** `FIGMA_TOKEN`, `FIGMA_COMPONENTS_FILE_KEY` en `.env`
- **Output:** `src/data/dashboard-data.json`

**Importante:** Siempre ejecutar ambos plugins antes de generar el dashboard para tener datos completos y actualizados.

## Librerías Extraídas por el Plugin

El extractor maneja **5 librerías principales** de Figma, cada una genera su propio archivo JSON:

### Variables de Entorno (.env)
```bash
FIGMA_TOKEN=your_figma_token
FIGMA_FOUNDATIONS_FILE_KEY=foundations_file_id    # → foundations-data.json
FIGMA_COMPONENTS_FILE_KEY=components_file_id      # → component-data.json  
FIGMA_TEMPLATES_FILE_KEY=templates_file_id        # → template-data.json
FIGMA_ASSETS_FILE_KEY=assets_file_id             # → asset-data.json
FIGMA_CUSTOM_COMPONENTS_FILE_KEY=custom_file_id   # → custom-data.json
```

### Archivos Generados
| Librería | Variable ENV | Archivo Output | Propósito |
|----------|--------------|----------------|-----------|
| **Foundations** | `FIGMA_FOUNDATIONS_FILE_KEY` | `foundations-data.json` | Tokens primitivos y semánticos |
| **Components** | `FIGMA_COMPONENTS_FILE_KEY` | `component-data.json` | Componentes principales del DS |
| **Templates** | `FIGMA_TEMPLATES_FILE_KEY` | `template-data.json` | Plantillas y layouts |
| **Assets** | `FIGMA_ASSETS_FILE_KEY` | `asset-data.json` | Iconos, ilustraciones, assets |
| **Custom** | `FIGMA_CUSTOM_COMPONENTS_FILE_KEY` | `custom-data.json` | Componentes custom/específicos |

### Convención de Nombres en Figma

Para que el extractor funcione correctamente, las páginas deben seguir esta nomenclatura:

#### Categorías (Separadores)
- **Formato:** `▶️ Nombre de Categoría`
- **Ejemplos:** 
  - `▶️ Form Controls`
  - `▶️ Navigation`
  - `▶️ Data Display`

#### Componentes
- **Formato:** `↪︎ Nombre del Componente`
- **Ejemplos:**
  - `↪︎ Button`
  - `↪︎ Text Input`
  - `↪︎ Card`

#### Páginas Excluidas
El extractor **ignora** automáticamente:
- Páginas que inician con `---` (separadores)
- Páginas que contienen `Cover` (portadas)
- Páginas que inician con `-` (borradores)

### Flujo de Extracción por Librería

```bash
# 1. Modificar .env con el archivo específico
FIGMA_COMPONENTS_FILE_KEY=0GIm2SB5mdvDF7ojlXkjV3

# 2. Ejecutar extracción (genera component-data.json)
npm run extract

# 3. Cambiar para templates
FIGMA_TEMPLATES_FILE_KEY=htvGLaEUzJTF7QPd4LkGy0

# 4. Ejecutar nuevamente (genera template-data.json) 
npm run extract
```

### Dashboard Merge
El dashboard (`src/App.tsx`) **combina automáticamente** múltiples librerías:
```typescript
const libraries = [
  { id: 'components', label: 'Componentes', data: componentData },
  { id: 'templates', label: 'Templates', data: templateData },
  // Se pueden agregar más librerías aquí
]
```
