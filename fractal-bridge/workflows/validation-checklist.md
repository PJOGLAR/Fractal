# Validation Checklist — Implementation Quality

Checklist comprensivo para validar que la implementación respeta el Design System Fractal.

## Pre-implementation Validation

### Design System Alignment
- [ ] **Todos los componentes existen en Fractal:** No hay elementos custom innecesarios
- [ ] **Variantes correctas:** `solid/outline/ghost`, `sm/md/lg`, etc están bien usadas
- [ ] **Tokens aplicados:** No hay valores hardcodeados (16px → `$spacing-md`)
- [ ] **Composición válida:** Sigue patterns documentados en `composition-patterns.md`

### Business Context Compliance  
- [ ] **Personal Pay conventions:** Saldos, montos, confirmaciones siguen las reglas
- [ ] **Copy guidelines:** Tono de voz, microcopy, labels correctos
- [ ] **User flows:** Entry/exit points claros, navegación consistente
- [ ] **Validation rules:** Límites, formatos, restricciones implementadas

---

## Implementation Validation

### Code Quality

#### Import & Setup
```tsx
// ✅ Imports correctos
import { Button, Card, TextInput, Alert } from '@ppay-mobile/fractal-ui';

// ✅ Provider presente en root
<FractalUIProvider>
  <App />
</FractalUIProvider>

// ❌ Evitar imports custom innecesarios
import { CustomButton } from '../components'; // Si ya existe Button
```

#### Component Usage
- [ ] **Props válidas:** Todas las props existen en el componente real
- [ ] **Variantes existentes:** `variant="solid"` vs `variant="primary"` (que no existe)
- [ ] **Children apropiados:** Componentes reciben el tipo de children correcto
- [ ] **Event handlers:** `onPress`, `onChangeText`, etc implementados

#### Token System
```tsx
// ✅ Tokens correctos
style={{ 
  padding: '$spacing-lg',          // 24px
  gap: '$gap-md',                  // 16px
  backgroundColor: '$color-background-neutral-surface',
  borderRadius: '$border-radius-md'  // 8px
}}

// ❌ Valores hardcodeados
style={{ 
  padding: 24,                     
  gap: 16,                        
  backgroundColor: '#F8F9FA',
  borderRadius: 8
}}
```

### Visual Validation

#### Typography Hierarchy
- [ ] **Heading consistency:** `heading-lg` > `heading-md` > `body-lg` > `body-md`
- [ ] **Semibold usage:** Títulos importantes usan `-semibold` suffix
- [ ] **Color semantic:** Success/error/warning colors aplicados correctamente
- [ ] **Line height:** Automático del sistema (no overridden)

#### Spacing System
- [ ] **Screen padding:** `$spacing-lg` (24px) para pantallas principales  
- [ ] **Section gaps:** `$gap-xl` (32px) entre secciones principales
- [ ] **Component gaps:** `$gap-md` (16px) entre componentes relacionados
- [ ] **Element gaps:** `$gap-sm` (8px) entre elementos de lista

#### Color Usage
- [ ] **Semantic colors:** Success verde, error rojo, warning naranja
- [ ] **Neutral scale:** Primary, secondary, subtle para jerarquía de texto
- [ ] **Brand colors:** Usado solo en CTAs principales y branding elements
- [ ] **Interactive states:** Hover/focus/pressed manejados automáticamente

---

## Cross-Platform Validation  

### Mobile (Primary)
- [ ] **Touch targets:** Mínimo 44px para elementos interactivos
- [ ] **Thumb reach:** Botones principales accesibles con pulgar
- [ ] **Scroll behavior:** Smooth scrolling, bounce effects apropiados
- [ ] **Keyboard:** Input focus, scroll automático, teclado apropiado (numeric, email)

### Tablet/Desktop
- [ ] **Layout adaptation:** Cards en grid, no solo stack vertical
- [ ] **Button sizing:** Pueden ser menores que full-width
- [ ] **Hover states:** Funcionan en dispositivos con mouse
- [ ] **Keyboard navigation:** Tab order lógico

### Responsive Breakpoints
```tsx
// Mobile first approach
<View style={{ 
  flexDirection: width > 768 ? 'row' : 'column',
  gap: width > 768 ? '$gap-lg' : '$gap-md'
}} />
```

---

## Functional Validation

### Form Validation
- [ ] **Real-time validation:** Error states se muestran apropiadamente
- [ ] **Error messages:** User-friendly, específicos, accionables
- [ ] **Required fields:** Claramente marcados e implementados
- [ ] **Submit states:** Loading, success, error manejados

### Loading States
```tsx
// ✅ Loading implementations
<Button variant="solid" label="Procesando..." loading disabled />

<TextInput 
  label="Destinatario"
  placeholder="Buscando..."
  disabled={loading}
  rightIcon={loading ? "loading" : "search"}
/>
```

### Error Handling
- [ ] **Network errors:** Retry automático, mensaje claro
- [ ] **Validation errors:** Inline, contextual, no blocking modals  
- [ ] **Business rule errors:** Explicación del por qué, próximos pasos
- [ ] **Fallback states:** Graceful degradation cuando algo falla

---

## Personal Pay Specific Validation

### Transfer Flow
- [ ] **Saldo visible:** Siempre mostrar balance disponible upfront
- [ ] **Monto mínimo:** $100 validado, mensaje claro si menor
- [ ] **Confirmación clara:** Resumen completo antes de ejecutar
- [ ] **Estados críticos:** "No se puede cancelar" warnings apropiados

### UI Patterns
- [ ] **Avatar usage:** Initials para contactos sin foto, tamaño correcto
- [ ] **Row components:** Leading/trailing content usado correctamente
- [ ] **Card elevation:** Default vs outlined vs elevated apropiado
- [ ] **Alert placement:** Inline en el flujo, no modals intrusivos

### Content Validation
- [ ] **Tone of voice:** "Vos" en lugar de "usted", cercano y confiable
- [ ] **Microcopy:** Labels específicos ("¿A quién le querés transferir?" not "Destinatario")
- [ ] **Button labels:** "Transferir ahora", "Confirmar", descriptivos
- [ ] **Help text:** Contextual, útil, no obvio

---

## Technical Performance

### Component Performance
- [ ] **Re-renders:** Memoización apropiada para listas largas
- [ ] **Bundle size:** Solo importar componentes usados
- [ ] **Token resolution:** No computed styles innecesarios
- [ ] **Animation performance:** 60fps en interactions críticas

### Loading Performance  
- [ ] **Skeleton states:** Para contenido que tarda en cargar
- [ ] **Progressive loading:** Mostrar UI básico → completar con datos
- [ ] **Error boundaries:** Crashes no rompen toda la app
- [ ] **Offline handling:** Graceful degradation sin conexión

---

## Accessibility Validation

### Screen Reader
- [ ] **Semantic elements:** Buttons, inputs, headers correctos
- [ ] **Labels:** Todos los inputs tienen labels asociados
- [ ] **Descriptions:** Supporting text conectado apropiadamente  
- [ ] **Focus management:** Orden lógico, focus visible

### Visual Accessibility
- [ ] **Color contrast:** Mínimo 4.5:1 para texto normal, 3:1 para texto grande
- [ ] **Focus indicators:** Claramente visibles en navegación por teclado
- [ ] **Text scaling:** Respeta configuración de accessibility del sistema
- [ ] **Motion:** Respeta `prefers-reduced-motion` si aplicable

### Motor Accessibility
- [ ] **Touch targets:** Mínimo 44px, separados apropiadamente
- [ ] **Interaction alternatives:** Swipe + tap alternatives donde sea posible
- [ ] **Timeout handling:** Suficiente tiempo para completar acciones
- [ ] **Error recovery:** Fácil recovery de errores de input

---

## Final Sign-off Checklist

### UX Designer Review
- [ ] Visual fidelity al design original (95%+ match)
- [ ] Micro-interactions y animations apropiadas
- [ ] User flow completo funciona end-to-end
- [ ] Edge cases manejados gracefully

### Frontend Developer Review  
- [ ] Code quality: limpio, mantenible, documentado
- [ ] Performance: no lag perceptible
- [ ] Error handling: todos los casos cubiertos
- [ ] Tests: unit tests para lógica crítica

### QA Review
- [ ] Functional testing: todas las features funcionan
- [ ] Cross-device testing: mobile, tablet, desktop
- [ ] Edge case testing: network issues, validation errors
- [ ] Regression testing: no rompe funcionalidad existente

### Product Owner Review
- [ ] Business requirements cumplidos
- [ ] User stories completadas
- [ ] Acceptance criteria satisfied
- [ ] Ready for production deployment

---

## Validation Tools

### Automated Checks
```bash
# Linting tokens y componentes
npm run fractal-lint

# Accessibility checks  
npm run a11y-check

# Visual regression
npm run visual-test
```

### Manual Testing Devices
- **iPhone SE** (320px width) - minimum mobile
- **iPhone 14** (390px width) - standard mobile  
- **iPad** (768px width) - tablet
- **Desktop** (1024px+ width) - large screens

### Browser Testing Matrix
- **iOS Safari** (primary mobile)
- **Android Chrome** (primary android)
- **Desktop Chrome** (development)
- **Desktop Safari** (Mac users)

---

*Esta checklist debe completarse antes de cualquier merge a main/production*