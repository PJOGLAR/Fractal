# Fractal Bridge — UX ↔ Development

Esta es la documentación puente entre el trabajo de UX en Figma y la implementación con Fractal UI.

## ¿Qué es Fractal Bridge?

Un conjunto de guías, mapeos y workflows que conectan:
- **Figma** (diseños y prototipos)
- **Este repositorio** (documentación y reglas)  
- **Storybook** (componentes vivos)
- **Código** (implementación real)

## Flujo típico

```
Diseño en Figma → Consultar guides → Crear spec → Validar en Storybook → Implementar
```

## Complete File Structure Created

### 🚀 Getting Started
- **[Getting Started](guides/getting-started.md)** — Tutorial completo con ejemplos reales del flujo de transferencias de Personal Pay. Incluye setup, primer componente, y patterns básicos.
- **[Figma to Code](guides/figma-to-code.md)** — Guía definitiva para traducir elementos de Figma a código Fractal. Mapeo de componentes, estados, spacing, y troubleshooting.

### 📋 Implementation Guides  
- **[Composition Patterns](guides/composition-patterns.md)** — 5 patrones reales de pantallas extraídos del flujo de transferencias: búsqueda, input de monto, confirmación, onboarding. Layout base y spacing rules.
- **[Business Context](guides/business-context.md)** — Contexto específico de Personal Pay: mental models del usuario, reglas de negocio, validaciones, microcopy guidelines, y consideraciones argentinas.
- **[Agent Guidelines](guides/agent-guidelines.md)** — Reglas específicas para agentes IA: decision framework, context switching protocol, common mistakes, y best practices para prompting.

### 📖 Component & Token References
- **[Component API Mapping](mappings/component-api-mapping.json)** — Mapeo completo de 10 componentes reales con variantes de Figma, props de código, y contexto de negocio específico de Personal Pay.
- **[Token Usage Examples](mappings/token-usage-examples.md)** — Ejemplos reales de uso de tokens en pantallas típicas: spacing hierarchy, typography patterns, color usage, y componentes responsivos completos.

### 🔄 Process Workflows
- **[Design Handoff](workflows/design-handoff.md)** — Proceso completo de 6 fases desde diseño en Figma hasta producción: review, mapping, spec técnica, development review, QA, y sign-off.
- **[Validation Checklist](workflows/validation-checklist.md)** — Checklist comprensivo para validar implementaciones: code quality, visual validation, cross-platform testing, accessibility, y performance.

## Para Agentes IA

Esta documentación está optimizada para que agentes puedan:
- Entender el contexto de negocio de Personal Pay
- Mapear componentes de Figma a código correcto
- Tomar decisiones de implementación consistentes con el DS
- Generar specs de pantalla válidas

Ver [Agent Guidelines](guides/agent-guidelines.md) para reglas específicas.

## Casos de Uso por Archivo

### 📋 ¿Necesito implementar una pantalla nueva?
1. **Start:** [Getting Started](guides/getting-started.md) → setup básico
2. **Design:** [Figma to Code](guides/figma-to-code.md) → mapear elementos visuales
3. **Pattern:** [Composition Patterns](guides/composition-patterns.md) → encontrar pattern similar
4. **Context:** [Business Context](guides/business-context.md) → aplicar reglas de Personal Pay

### 🔍 ¿Necesito información específica de un componente?
- **Props y variantes:** [Component API Mapping](mappings/component-api-mapping.json)
- **Ejemplos reales:** [Token Usage Examples](mappings/token-usage-examples.md)
- **Business rules:** [Business Context](guides/business-context.md)

### 🚀 ¿Soy un agente IA trabajando con Fractal?
1. **FIRST:** [Agent Guidelines](guides/agent-guidelines.md) → protocolo obligatorio
2. **Components:** [Component API Mapping](mappings/component-api-mapping.json) → API reference
3. **Patterns:** [Composition Patterns](guides/composition-patterns.md) → layouts establecidos
4. **Rules:** [Business Context](guides/business-context.md) → decisiones contextuales

### 📐 ¿Estoy en un proceso de handoff diseño → desarrollo?
1. **Process:** [Design Handoff](workflows/design-handoff.md) → workflow paso a paso
2. **Quality:** [Validation Checklist](workflows/validation-checklist.md) → asegurar calidad
3. **Mapping:** [Figma to Code](guides/figma-to-code.md) → traducir elementos

### 🎨 ¿Necesito entender spacing y tokens?
- **Examples:** [Token Usage Examples](mappings/token-usage-examples.md) → patrones reales
- **Rules:** [Composition Patterns](guides/composition-patterns.md) → spacing hierarchy
- **Context:** [Business Context](guides/business-context.md) → cuándo usar qué

## Contenido Detallado

### Getting Started (Tutorial - 15min read)
- Setup de FractalUIProvider  
- Primer componente Button con variantes
- TextInput con validation
- Layout básico con tokens
- Ejemplo completo: pantalla de búsqueda con EmptyState

### Figma to Code (Reference Guide - 20min read)
- Process overview: Figma → Pattern → Fractal → Business Rules
- Component identification y anatomía
- Mapeo de estados (default, focus, error, disabled)  
- Translation de spacing, colors, typography
- Debug checklist y troubleshooting
- Component composition patterns

### Composition Patterns (Pattern Library - 25min read)
- **BaseLayout:** Estructura estándar de pantallas Personal Pay
- **5 Patterns reales:**
  - Pantalla de búsqueda/input con empty state
  - Input de monto con saldo y chips rápidos  
  - Confirmación con card detallada
  - Pantalla de confirmación con avatar y resumen
  - Onboarding/wizard con progress bar
- Spacing rules y estados comunes

### Business Context (Context Guide - 20min read)
- Mental models del usuario (confianza, simplicidad)
- Component usage por contexto (transferencias, pagos, errores)
- Content & copy guidelines (tono, microcopy, labels)
- Business rules (límites, validaciones, navegación)
- Argentina context y Personal Pay ecosystem

### Agent Guidelines (Agent Protocol - 15min read)
- Context switching protocol (qué leer primero)
- Decision framework (¿necesito componente? ¿qué variante?)
- Personal Pay context patterns por flujo
- Common mistakes y best practices
- Error recovery y resource links

### Component API Mapping (JSON Reference)
**10 componentes reales:**
- **TextInput:** Size, State, HasLabel variants → props + business context
- **InputAmount:** Currency, HasDecimal → validation rules transferencias  
- **Row:** Leading/trailing content → patterns summaries y listas
- **Alert:** Info/success/warning/error → delays, limits, inline rules
- **EmptyState:** Illustrations → search patterns, guidance
- **Chip:** Variants, selection → amounts, filters, horizontal groups
- **Avatar:** Initials, sizes → contacts, recipients
- **Button:** Solid/outline/ghost → primary/secondary actions
- **Card:** Default/outlined variants → content grouping
- **Divider:** Orientation → sections separation

### Token Usage Examples (Examples Guide - 30min read)
- **Spacing hierarchy:** Screen padding, component spacing, element gaps
- **Typography patterns:** Por tipo de pantalla (transfer, confirmation)
- **Color usage:** Semantic, interactive, neutral scale
- **Border radius patterns:** Component corners, container hierarchy  
- **Real screen examples:** AmountScreen y ConfirmationScreen completas
- **Performance tips:** Consistent token usage

### Design Handoff (Process Workflow - 25min read)
**6-Phase process:**
1. **Design Review:** Pre-handoff checklist, review template
2. **Component Mapping:** 30min session agenda, mapping output
3. **Technical Specification:** Spec document template, API integration
4. **Development Review:** Pre-implementation checklist, Q&A típicas  
5. **Implementation & QA:** Guidelines, QA checklist, cross-device testing
6. **Validation & Sign-off:** Final review, criteria, handoff assets

### Validation Checklist (QA Reference - 35min read)
- **Pre-implementation:** DS alignment, business compliance
- **Implementation:** Code quality, imports, token usage
- **Visual:** Typography, spacing, colors
- **Cross-platform:** Mobile, tablet, responsive breakpoints
- **Functional:** Form validation, loading states, error handling
- **Personal Pay specific:** Transfer flow, UI patterns, content
- **Performance:** Component performance, loading performance
- **Accessibility:** Screen reader, visual, motor accessibility
- **Final sign-off:** UX, Dev, QA, Product Owner reviews

## Herramientas necesarias

- **Figma** — acceso al DS de Personal Pay
- **Este repo** — documentación y reglas  
- **Storybook** — [Link al Storybook](URL_STORYBOOK)
- **Código** — `@ppay-mobile/fractal-ui`

---

*Mantenido por el equipo de Design System — Telecom Personal Pay*