# Accesibilidad en Fractal Design System

## Contexto y Obligatoriedad

### Marco Legal Argentina

Fractal, como Design System de una billetera digital que involucra bancos, opera bajo las siguientes regulaciones:

#### Leyes Aplicables

| Norma | Alcance | Obligatoriedad |
|-------|---------|----------------|
| **Ley 26.653** (2010) | Accesibilidad web - servicios públicos y prestadoras | ✅ **Obligatorio** |
| **Decreto 656/2019** | Reglamentación - Estándar WCAG 2.0 AA | ✅ **Obligatorio** |
| **Disposición ONTI 06/2019** | Pautas técnicas WCAG 2.0 | ✅ **Obligatorio** |
| **Ley 27.044** | No discriminación - rango constitucional | ✅ **Obligatorio** |
| **Ley 26.378** | Convención ONU Personas con Discapacidad | ✅ **Rango constitucional** |
| **Normativa BCRA** | Inclusión financiera digital | ✅ **Obligatorio** |

#### Interpretación Legal

**Sitios Web:** Obligatoriedad explícita bajo Ley 26.653.

**Aplicaciones Móviles:** Existe un **gris legal técnico** (la ley menciona "páginas web"), pero:
- **Leyes anti-discriminación (27.044, 26.378) SÍ aplican** a cualquier servicio digital
- **Riesgo de demanda y sanciones es alto**
- **Tendencia judicial** es hacia interpretación amplia
- **W3C WCAG2ICT** establece que WCAG aplica a apps móviles nativas

**Consecuencias del Incumplimiento:**
- 🚫 Imposibilidad de contratar con el Estado
- 💰 Multas de $10,000 a $1,000,000 ARS
- ⚖️ Demandas por discriminación
- 📱 Riesgo de rechazo/marcado en App Stores
- 💔 Daño reputacional y pérdida de mercado

### Marco Legal Paraguay

**Ley 6767/2021 - Transformación Digital:**
- Exige WCAG 2.1 AA para servicios del Estado
- **Sector privado: recomendado pero no obligatorio**
- Fiscalización limitada

**Ley 5136/2013 - Inclusión:**
- Prohíbe discriminación, pero sin especificaciones técnicas

**Realidad:** Menos riesgo legal que Argentina, pero mismas expectativas de mercado.

---

## Estándar Adoptado

### WCAG 2.1 Nivel AA

**Decisión estratégica:** Adoptar **WCAG 2.1 Level AA** como estándar mínimo para Fractal.

**Razones:**
1. ✅ Cumple requerimientos legales Argentina (supera WCAG 2.0)
2. ✅ Estándar internacional reconocido
3. ✅ Aplicable a web Y mobile (WCAG2ICT)
4. ✅ Balance entre accesibilidad robusta y viabilidad técnica
5. ✅ Ventaja competitiva y reputacional

### Alcance

| Plataforma | Estándar | Estado |
|------------|----------|--------|
| **React Native (iOS/Android)** | WCAG 2.1 AA | 🎯 Objetivo |
| **Web (react-native-web)** | WCAG 2.1 AA | 🎯 Objetivo |
| **Tokens de diseño** | WCAG 2.1 AA | 🎯 Objetivo |
| **Componentes base** | WCAG 2.1 AA | 🎯 Objetivo |
| **Documentación** | WCAG 2.1 AA | 🎯 Objetivo |

---

## Principios WCAG 2.1

Los 4 principios fundamentales que guían toda decisión de accesibilidad en Fractal:

### 1. Perceptible
La información y componentes de la interfaz deben poder ser percibidos por todos los usuarios.

**En Fractal:**
- Ratios de contraste mínimos (4.5:1 texto normal, 3:1 texto grande)
- Alternativas textuales para contenido no textual
- Contenido adaptable a diferentes presentaciones
- Distinciones no solo por color

### 2. Operable
Los componentes de la interfaz y la navegación deben ser operables.

**En Fractal:**
- Navegación completa por teclado/lector de pantalla
- Tiempo suficiente para interactuar
- Áreas de toque/tap mínimas (44x44 puntos iOS, 48x48dp Android)
- Títulos y labels descriptivos
- Orden de foco lógico

### 3. Comprensible
La información y operación de la interfaz deben ser comprensibles.

**En Fractal:**
- Lenguaje claro y directo
- Navegación predecible y consistente
- Ayuda para prevenir y corregir errores
- Labels e instrucciones claras

### 4. Robusto
El contenido debe ser robusto para ser interpretado por diferentes tecnologías asistivas.

**En Fractal:**
- Roles y propiedades semánticas correctas
- Compatibilidad con lectores de pantalla (VoiceOver, TalkBack)
- Estados comunicados programáticamente
- Estructura semántica clara

---

## Criterios Críticos para Fractal

### Nivel A (Mínimo indispensable)

#### 1.1.1 Contenido No Textual
**Qué significa:** Todo contenido no textual tiene alternativa textual.

**En Fractal:**
```tsx
// ✅ Correcto
<Icon name="check" accessibilityLabel="Confirmado" />
<Image source={logo} accessible={true} accessibilityLabel="Logo Personal Pay" />

// ❌ Incorrecto
<Icon name="check" />
<Image source={logo} />
```

**Responsabilidad:**
- 🎨 Diseño: Definir qué debe comunicarse
- 💻 Componente: Requerir prop `accessibilityLabel`
- 📝 Documentación: Ejemplos y guías

---

#### 1.3.1 Información y Relaciones
**Qué significa:** Estructura y relaciones deben estar disponibles programáticamente.

**En Fractal:**
```tsx
// ✅ Correcto - estructura semántica
<View accessibilityRole="form">
  <TextInput 
    label="Email"
    accessibilityLabel="Correo electrónico"
    accessibilityHint="Ingrese su email para continuar"
  />
</View>

// ❌ Incorrecto - sin estructura
<View>
  <Text>Email</Text>
  <TextInput />
</View>
```

**Responsabilidad:**
- 💻 Componente: Props de accesibilidad obligatorios
- 🎨 Diseño: Jerarquía visual = jerarquía semántica

---

#### 1.4.3 Contraste Mínimo (AA)
**Qué significa:** Texto tiene ratio de contraste mínimo 4.5:1 (3:1 para texto grande).

**En Fractal:**
```typescript
// Tokens de color validados
$color-text-primary: '#1A1A1A'      // sobre blanco: 16.94:1 ✅
$color-text-secondary: '#666666'    // sobre blanco: 5.74:1 ✅
$color-text-tertiary: '#999999'     // sobre blanco: 2.85:1 ❌ (solo decorativo)

// Validar en diseño
const contrastRatio = calculateContrast(foreground, background);
if (contrastRatio < 4.5) {
  throw new Error('Contraste insuficiente');
}
```

**Responsabilidad:**
- 🎨 Diseño: Validar contrastes en Figma
- 🏗️ Tokens: Documentar ratios de contraste
- 🧪 Testing: Auditorías automáticas

---

#### 2.1.1 Teclado
**Qué significa:** Toda funcionalidad disponible por teclado/lector de pantalla.

**En Fractal:**
```tsx
// ✅ Correcto - componentes nativos accesibles
<Button label="Confirmar" onPress={handleConfirm} />

// ✅ Correcto - custom con accesibilidad
<Pressable 
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Confirmar operación"
  onPress={handleConfirm}
>
  <Text>Confirmar</Text>
</Pressable>

// ❌ Incorrecto - solo responde a gestos
<View onTouchStart={handleConfirm}>
  <Text>Confirmar</Text>
</View>
```

**Responsabilidad:**
- 💻 Componente: Usar componentes RN accesibles por defecto
- 🧪 Testing: Probar con VoiceOver/TalkBack

---

#### 2.4.3 Orden del Foco
**Qué significa:** El orden de navegación es lógico y significativo.

**En Fractal:**
```tsx
// ✅ Correcto - orden visual = orden de código
<View>
  <TextInput label="Nombre" />      {/* Foco 1 */}
  <TextInput label="Email" />       {/* Foco 2 */}
  <Button label="Enviar" />         {/* Foco 3 */}
</View>

// ⚠️ Si el orden visual difiere del DOM, usar:
<View accessibilityElementsHidden={false}>
  <TextInput accessibilityLabel="Campo 1" tabIndex={1} />
  <TextInput accessibilityLabel="Campo 2" tabIndex={2} />
</View>
```

---

#### 2.5.5 Tamaño del Objetivo
**Qué significa:** Áreas táctiles mínimas de 44x44 puntos.

**En Fractal:**
```typescript
// Tokens de spacing para áreas táctiles
$spacing-touch-min: 44  // 44pt iOS / 48dp Android

// Componentes garantizan tamaño mínimo
<ButtonIcon 
  icon="close"
  size="sm"  // 24x24 visual, pero 44x44 táctil
/>
```

**Implementación:**
```tsx
const styles = StyleSheet.create({
  touchTarget: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

---

#### 3.2.4 Identificación Consistente
**Qué significa:** Componentes con misma función tienen misma identificación.

**En Fractal:**
```tsx
// ✅ Correcto - iconos consistentes
<Button icon="add" label="Agregar contacto" />
<Button icon="add" label="Agregar tarjeta" />

// ❌ Incorrecto - iconos inconsistentes para misma acción
<Button icon="add" label="Agregar contacto" />
<Button icon="plus" label="Agregar tarjeta" />
```

---

#### 4.1.2 Nombre, Función, Valor
**Qué significa:** Todos los componentes UI tienen nombre, función y estado disponibles programáticamente.

**En Fractal:**
```tsx
// ✅ Correcto - todas las props de a11y
<Switch
  value={enabled}
  onValueChange={setEnabled}
  accessibilityLabel="Notificaciones activadas"
  accessibilityRole="switch"
  accessibilityState={{ checked: enabled }}
/>

// ❌ Incorrecto
<Switch value={enabled} onValueChange={setEnabled} />
```

---

### Nivel AA (Objetivo de Fractal)

#### 1.4.11 Contraste No Textual (AA)
**Qué significa:** Componentes UI e información gráfica tienen contraste mínimo 3:1.

**En Fractal:**
```typescript
// Bordes, iconos, estados
$color-border-default: '#CCCCCC'   // sobre blanco: 3.5:1 ✅
$color-icon-primary: '#5A50F9'     // sobre blanco: 4.96:1 ✅
```

---

#### 1.4.12 Espaciado de Texto
**Qué significa:** El contenido no pierde información con espaciado personalizado.

**En Fractal:**
- Line-height mínimo: 1.5x el tamaño de fuente
- Espaciado entre párrafos: 2x el tamaño de fuente
- Letter-spacing ajustable sin overflow

```typescript
$lineHeight-body: 1.5
$lineHeight-heading: 1.2
```

---

#### 1.4.13 Contenido en Hover o Foco
**Qué significa:** Contenido adicional que aparece al hover/foco es descartable, persistente y puede ser visto.

**En Fractal:**
```tsx
// Tooltips y popovers
<Tooltip 
  content="Ayuda contextual"
  dismissible={true}
  persistent={true}
>
  <Button label="Info" />
</Tooltip>
```

---

#### 2.4.7 Foco Visible
**Qué significa:** El indicador de foco es visible.

**En Fractal:**
```typescript
// Estados de foco visualmente claros
$color-focus-ring: '#5A50F9'
$borderWidth-focus: 2

// En componentes
<Button 
  style={({ focused }) => focused && styles.focused}
/>
```

---

#### 2.5.8 Tamaño del Objetivo Mejorado (AAA, pero recomendado)
**Qué significa:** Áreas táctiles mínimas de 48x48 puntos (mejor que 44x44).

**En Fractal:** Apuntar a 48x48 cuando sea posible, mínimo 44x44.

---

## Estrategia de Implementación

### Fase 1: Fundamentos (Mes 1-2)
**Objetivo:** Establecer base técnica y gobierno.

#### 1.1 Auditoría Inicial
- [ ] Auditar tokens de color (ratios de contraste)
- [ ] Auditar componentes existentes (props de a11y)
- [ ] Documentar gaps y deuda técnica
- [ ] Priorizar por impacto y uso

#### 1.2 Tokens Accesibles
- [ ] Validar/ajustar colores para contraste mínimo
- [ ] Documentar ratios de contraste en tokens
- [ ] Crear pares de colores seguros (foreground/background)
- [ ] Definir tokens de spacing para áreas táctiles

#### 1.3 Gobierno
- [ ] Crear este documento como guía oficial
- [ ] Definir checklist de accesibilidad para componentes
- [ ] Establecer proceso de revisión
- [ ] Configurar herramientas de testing

---

### Fase 2: Componentes Base (Mes 2-4)
**Objetivo:** Hacer componentes fundamentales 100% accesibles.

#### 2.1 Componentes Críticos
Prioridad por frecuencia de uso:
1. **Button** - Acción principal
2. **TextInput** - Entrada de datos
3. **Card** - Contenedor de información
4. **Switch/Checkbox/Radio** - Controles de selección
5. **Modal/BottomSheet** - Contenido superpuesto

#### 2.2 Props Obligatorias
Cada componente debe requerir:
```typescript
interface AccessibilityProps {
  accessibilityLabel: string;        // Obligatorio
  accessibilityHint?: string;        // Opcional pero recomendado
  accessibilityRole: AccessibilityRole; // Obligatorio
  accessibilityState?: AccessibilityState;
}
```

#### 2.3 Testing
- [ ] Tests automatizados con `@testing-library/react-native`
- [ ] Tests manuales con VoiceOver (iOS)
- [ ] Tests manuales con TalkBack (Android)
- [ ] Documentar resultados y issues

---

### Fase 3: Documentación (Mes 3-5)
**Objetivo:** Capacitar equipo y usuarios del DS.

#### 3.1 Docs por Componente
Cada componente debe documentar:
- ✅ Props de accesibilidad obligatorias
- ✅ Ejemplos de uso accesible
- ✅ Casos de edge y errores comunes
- ✅ Resultado de auditorías (WCAG compliance)

**Ejemplo:**
```markdown
## Button - Accesibilidad

### Props Requeridas
- `label`: Texto del botón (visual y para lectores)
- `accessibilityHint`: Describe el resultado de la acción

### Ejemplo
\`\`\`tsx
<Button 
  label="Transferir"
  accessibilityHint="Abre pantalla para realizar una transferencia"
  onPress={handleTransfer}
/>
\`\`\`

### WCAG Compliance
- ✅ 1.4.3 Contraste Mínimo (AA)
- ✅ 2.1.1 Teclado (A)
- ✅ 2.5.5 Tamaño del Objetivo (A)
- ✅ 4.1.2 Nombre, Función, Valor (A)
```

#### 3.2 Guías de Uso
- [ ] Guía de accesibilidad para diseñadores (Figma)
- [ ] Guía de accesibilidad para developers
- [ ] Checklist pre-commit
- [ ] Ejemplos de patrones accesibles

---

### Fase 4: Validación y Certificación (Mes 5-6)
**Objetivo:** Validar cumplimiento con usuarios reales.

#### 4.1 Testing con Usuarios
- [ ] Reclutar usuarios con diferentes discapacidades
- [ ] Sesiones de testing moderado
- [ ] Documentar hallazgos y pain points
- [ ] Iterar componentes según feedback

#### 4.2 Auditoría Externa
- [ ] Contratar auditoría de accesibilidad profesional
- [ ] Obtener reporte de cumplimiento WCAG 2.1 AA
- [ ] Corregir issues críticos
- [ ] Documentar certificación

#### 4.3 Monitoreo Continuo
- [ ] Configurar tests automáticos en CI/CD
- [ ] Integrar linters de accesibilidad
- [ ] Revisión de accesibilidad en code reviews
- [ ] Auditorías trimestrales

---

## Herramientas y Testing

### Herramientas de Diseño (Figma)

#### Plugins Recomendados
1. **Stark** - Validación de contraste y simulación de daltonismo
2. **A11y - Color Contrast Checker** - Validación rápida de colores
3. **Able - Friction free accessibility** - Chequeos completos de a11y

#### Proceso en Figma
1. Diseñar componente con variantes
2. Validar contraste con Stark
3. Definir jerarquía semántica (headings, labels)
4. Documentar estados (focus, hover, disabled)
5. Especificar labels y hints para developers

---

### Herramientas de Desarrollo

#### Testing Automatizado
```bash
# Dependencias
npm install --save-dev @testing-library/react-native
npm install --save-dev jest-axe  # Si aplica para web
```

```typescript
// Ejemplo de test
import { render, screen } from '@testing-library/react-native';
import { Button } from '@ppay-mobile/fractal-ui';

describe('Button - Accessibility', () => {
  it('tiene accessibilityLabel', () => {
    render(<Button label="Transferir" onPress={() => {}} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAccessibilityLabel('Transferir');
  });

  it('tiene accessibilityRole correcto', () => {
    render(<Button label="Transferir" onPress={() => {}} />);
    const button = screen.getByRole('button');
    expect(button.props.accessibilityRole).toBe('button');
  });
});
```

#### Linters
```javascript
// .eslintrc.js
module.exports = {
  plugins: ['react-native-a11y'],
  rules: {
    'react-native-a11y/has-accessibility-label': 'error',
    'react-native-a11y/has-valid-accessibility-role': 'error',
  },
};
```

---

### Testing Manual

#### iOS - VoiceOver
1. Activar: Settings > Accessibility > VoiceOver
2. Navegar: Swipe derecha/izquierda
3. Activar: Double tap
4. Verificar:
   - ✅ Todos los elementos son anunciados
   - ✅ Orden de navegación es lógico
   - ✅ Labels son descriptivos
   - ✅ Estados son comunicados

#### Android - TalkBack
1. Activar: Settings > Accessibility > TalkBack
2. Navegar: Swipe derecha/izquierda
3. Activar: Double tap
4. Verificar:
   - ✅ Todos los elementos son anunciados
   - ✅ Orden de navegación es lógico
   - ✅ Labels son descriptivos
   - ✅ Estados son comunicados

#### Checklist de Testing
- [ ] Navegación completa solo con lector de pantalla
- [ ] Completar flujo principal sin visión
- [ ] Verificar anuncios de errores y validaciones
- [ ] Probar con zoom 200% (visión baja)
- [ ] Probar con texto grande (configuración sistema)

---

## Roles y Responsabilidades

### Diseño UX/UI
**Responsabilidades:**
- ✅ Validar contraste de colores en Figma
- ✅ Definir jerarquía semántica (H1, H2, labels)
- ✅ Diseñar estados visuales (focus, hover, disabled)
- ✅ Especificar labels y hints para lectores de pantalla
- ✅ Considerar áreas táctiles mínimas (44x44 o 48x48)
- ✅ Documentar intención de accesibilidad en specs

**Entregables:**
- Componentes con estados de accesibilidad
- Especificaciones de labels/hints
- Validación de contraste documentada

---

### Desarrollo (React Native)
**Responsabilidades:**
- ✅ Implementar props de accesibilidad obligatorias
- ✅ Usar componentes nativos accesibles (Button, TextInput)
- ✅ Probar con VoiceOver y TalkBack
- ✅ Escribir tests automatizados de a11y
- ✅ Documentar uso accesible en Storybook
- ✅ Revisar accesibilidad en code reviews

**Entregables:**
- Componentes con props a11y implementadas
- Tests automatizados pasando
- Documentación de uso accesible

---

### QA/Testing
**Responsabilidades:**
- ✅ Ejecutar checklist de accesibilidad manual
- ✅ Probar con lectores de pantalla (VoiceOver, TalkBack)
- ✅ Validar contraste en builds
- ✅ Reportar issues de accesibilidad como críticos
- ✅ Participar en sesiones con usuarios

**Entregables:**
- Reporte de testing de accesibilidad por release
- Issues documentados con prioridad

---

### Product Owner / PM
**Responsabilidades:**
- ✅ Priorizar accesibilidad en roadmap
- ✅ Definir criterios de aceptación con a11y
- ✅ Aprobar inversión en auditorías y certificaciones
- ✅ Comunicar compromiso de accesibilidad
- ✅ Coordinar testing con usuarios con discapacidad

**Entregables:**
- Historias de usuario con criterios de a11y
- Budget para auditorías y certificaciones

---

### Governance (Design System Team)
**Responsabilidades:**
- ✅ Mantener este documento actualizado
- ✅ Revisar PRs de componentes (checklist a11y)
- ✅ Coordinar auditorías periódicas
- ✅ Capacitar equipos consumidores
- ✅ Publicar métricas de cumplimiento

**Entregables:**
- Documentación de accesibilidad
- Checklist de revisión
- Reportes de cumplimiento

---

## Métricas de Éxito

### KPIs de Accesibilidad

| Métrica | Objetivo | Medición |
|---------|----------|----------|
| **Componentes conformes WCAG 2.1 AA** | 100% | Auditoría trimestral |
| **Tokens con contraste válido** | 100% | Validación automática |
| **Tests a11y automatizados** | >80% cobertura | CI/CD |
| **Issues críticos de a11y** | 0 en producción | Tracking en backlog |
| **Usuarios con discapacidad satisfechos** | >85% | NPS en testing |
| **Tiempo de remediación issues a11y** | <2 sprints | Tracking de issues |

---

### Reporte Trimestral
Dashboard de accesibilidad debe incluir:
- 📊 % componentes certificados WCAG 2.1 AA
- 🐛 Issues abiertos vs cerrados
- 🧪 Cobertura de tests automáticos
- 👥 Feedback de usuarios con discapacidad
- 📈 Tendencia de mejora

---

## Casos de Uso Específicos

### Flujo de Login
**Componentes involucrados:** TextInput, Button, Link

**Requisitos de accesibilidad:**
```tsx
<View accessibilityRole="form">
  <TextInput
    label="Email"
    accessibilityLabel="Correo electrónico"
    accessibilityHint="Ingrese su email registrado"
    keyboardType="email-address"
    autoComplete="email"
  />
  <TextInput
    label="Contraseña"
    accessibilityLabel="Contraseña"
    accessibilityHint="Ingrese su contraseña"
    secureTextEntry
    autoComplete="password"
  />
  <Button
    label="Ingresar"
    accessibilityHint="Iniciar sesión con las credenciales ingresadas"
    onPress={handleLogin}
  />
  <Link
    text="¿Olvidaste tu contraseña?"
    accessibilityRole="link"
    accessibilityHint="Abre pantalla de recuperación de contraseña"
  />
</View>
```

**Testing:**
- ✅ Orden de foco: Email → Contraseña → Botón → Link
- ✅ Errores de validación son anunciados
- ✅ Loading state es comunicado

---

### Flujo de Transferencia
**Componentes involucrados:** Card, TextInput (amount), Button

**Requisitos de accesibilidad:**
```tsx
<Card>
  <Text 
    accessibilityRole="header"
    accessibilityLevel={2}
  >
    Transferir a Juan Pérez
  </Text>
  
  <InputAmount
    label="Monto"
    accessibilityLabel="Monto a transferir"
    accessibilityHint="Ingrese el monto en pesos argentinos"
    value={amount}
    onChangeText={setAmount}
  />
  
  <Text accessibilityLiveRegion="polite">
    Disponible: ${balance.toFixed(2)}
  </Text>
  
  <Button
    label="Confirmar"
    accessibilityHint="Confirmar transferencia de ${amount} a Juan Pérez"
    disabled={!isValid}
    onPress={handleTransfer}
  />
</Card>
```

**Testing:**
- ✅ Balance actualizado es anunciado (liveRegion)
- ✅ Validación en tiempo real es comunicada
- ✅ Estado disabled del botón es anunciado

---

### Modal de Confirmación
**Componentes involucrados:** Modal, Button

**Requisitos de accesibilidad:**
```tsx
<Modal
  visible={showModal}
  accessibilityViewIsModal={true}  // Importante: bloquea contenido detrás
  onRequestClose={handleClose}
>
  <View accessibilityRole="alert">
    <Text 
      accessibilityRole="header"
      accessibilityLevel={1}
    >
      ¿Confirmar operación?
    </Text>
    
    <Text>La transferencia de $1,000 a Juan Pérez no puede deshacerse.</Text>
    
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Button
        label="Cancelar"
        variant="outline"
        accessibilityHint="Cancelar y volver atrás"
        onPress={handleClose}
      />
      <Button
        label="Confirmar"
        variant="solid"
        accessibilityHint="Confirmar y ejecutar transferencia"
        onPress={handleConfirm}
      />
    </View>
  </View>
</Modal>
```

**Testing:**
- ✅ Al abrir modal, foco va al contenido del modal
- ✅ Contenido detrás del modal no es navegable
- ✅ Al cerrar modal, foco vuelve al trigger
- ✅ ESC/back cierra el modal

---

## Recursos y Referencias

### Documentación Oficial
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Referencia completa
- [WCAG2ICT](https://www.w3.org/TR/wcag2ict/) - Aplicación a apps móviles
- [React Native Accessibility](https://reactnative.dev/docs/accessibility) - Docs oficiales
- [iOS VoiceOver Programming Guide](https://developer.apple.com/accessibility/ios/) - Apple
- [Android Accessibility](https://developer.android.com/guide/topics/ui/accessibility) - Google

### Herramientas
- [Stark - Figma Plugin](https://www.figma.com/community/plugin/732603254453395948/Stark)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Axe DevTools](https://www.deque.com/axe/devtools/) - Auditoría automatizada
- [React Native A11y ESLint](https://github.com/FormidableLabs/eslint-plugin-react-native-a11y)

### Aprendizaje
- [Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/) - Recursos y tutoriales
- [Deque University](https://dequeuniversity.com/) - Cursos de accesibilidad
- [A11ycasts - Google Chrome](https://www.youtube.com/playlist?list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g) - Videos

### Legislación Argentina
- [Ley 26.653 - Texto completo](https://www.argentina.gob.ar/normativa/nacional/ley-26653-175694)
- [Decreto 656/2019](https://www.boletinoficial.gob.ar/detalleAviso/primera/217660/20190930)
- [Observatorio de Accesibilidad Digital](https://www.argentina.gob.ar/jefatura/innovacion-ciencia-y-tecnologia/tics/onti/observatorio-de-accesibilidad-digital)

---

## Próximos Pasos

### Inmediatos (Semana 1-2)
1. ✅ **Este documento creado** - Base de conocimiento establecida
2. [ ] Socializar documento con equipo de Fractal
3. [ ] Presentar a stakeholders (diseño, desarrollo, PM)
4. [ ] Auditoría inicial de tokens y componentes base
5. [ ] Definir ownership y asignación de tareas

### Corto Plazo (Mes 1)
1. [ ] Validar y corregir tokens de color (contraste)
2. [ ] Crear checklist de accesibilidad para componentes
3. [ ] Configurar linters y tests automáticos
4. [ ] Priorizar componentes para remediation

### Mediano Plazo (Mes 2-4)
1. [ ] Remediar componentes base (Button, Input, Card)
2. [ ] Documentar uso accesible en Storybook
3. [ ] Capacitar equipos en accesibilidad
4. [ ] Testing manual con VoiceOver/TalkBack

### Largo Plazo (Mes 5-6)
1. [ ] Testing con usuarios con discapacidad
2. [ ] Auditoría externa y certificación
3. [ ] Publicar reporte de cumplimiento
4. [ ] Establecer monitoreo continuo

---

## Contacto y Soporte

**Dudas sobre accesibilidad en Fractal:**
- 📧 Slack: #fractal-design-system
- 📖 Documentación: [Fractal Bridge](../fractal-bridge/)
- 🐛 Issues: GitHub Issues con label `accessibility`

**Auditorías y certificaciones:**
- Coordinar con equipo de governance de Fractal

---

**Versión:** 1.0  
**Última actualización:** Agosto 2026  
**Mantenido por:** Fractal Design System Team  
**Estado:** 🟡 En progreso - Fase de implementación
