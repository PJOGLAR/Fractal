# Agent Guidelines — Fractal Design System

Reglas específicas para agentes IA trabajando con el Design System Fractal de Personal Pay.

## Context Switching Protocol

Cuando un agente trabaja con Fractal, debe:

1. **Leer este archivo primero** para entender el contexto
2. **Consultar `/AGENTS.md`** para reglas técnicas de implementación  
3. **Verificar API real** en `mappings/component-api-mapping.json`
4. **Seguir patterns** documentados en `guides/composition-patterns.md`

## Decision Framework

### ¿Necesito un componente?
```
¿Existe en Fractal? 
  ├─ SÍ → Usar importación + variantes correctas
  └─ NO → ¿Es composible con componentes existentes?
       ├─ SÍ → Componer, no crear custom
       └─ NO → Documentar gap y usar fallback mínimo
```

### ¿Qué variante usar?
Siempre consultar `business-context.md` para contexto de Personal Pay:
- **Buttons:** `solid` para acciones primarias, `outline` para secundarias
- **Cards:** default para contenido, `elevated` para elementos destacados
- **Typography:** seguir jerarquía `heading-lg` > `heading-md` > `body-md`

### ¿Cómo espaciar?
- **Entre componentes:** usar `gap: '$gap-sm'` (8px), `'$gap-md'` (16px)  
- **Padding containers:** `'$spacing-md'` (16px), `'$spacing-lg'` (24px)
- **No hardcodear** valores numéricos

## Personal Pay Context

### Flujos típicos y sus componentes

**Onboarding/Registro:**
```tsx
<ScrollView style={{ padding: '$spacing-lg', gap: '$gap-lg' }}>
  <Text variant="heading-lg">Título del paso</Text>
  <Text variant="body-md">Explicación</Text>
  <TextInput label="Campo obligatorio" required />
  <Button variant="solid" label="Continuar" />
  <Button variant="ghost" label="Saltar por ahora" />
</ScrollView>
```

**Pantalla de lista (movimientos, tarjetas):**
```tsx
<ScrollView style={{ padding: '$spacing-md' }}>
  <Text variant="heading-lg">Mis Movimientos</Text>
  <View style={{ gap: '$gap-sm' }}>
    {items.map(item => (
      <Card key={item.id} onPress={() => navigate(item)}>
        <View style={{ gap: '$gap-xs' }}>
          <Text variant="body-md-semibold">{item.title}</Text>
          <Text variant="body-sm" color="$color-neutral-medium">
            {item.subtitle}
          </Text>
          <Text variant="body-lg-semibold" color="$color-success">
            {item.amount}
          </Text>
        </View>
      </Card>
    ))}
  </View>
</ScrollView>
```

**Confirmación de acción:**
```tsx
<View style={{ padding: '$spacing-lg', gap: '$gap-lg' }}>
  <Text variant="heading-md">Confirmar transferencia</Text>
  
  <Card>
    <View style={{ gap: '$gap-sm' }}>
      <Text variant="body-sm" color="$color-neutral-medium">Para</Text>
      <Text variant="body-md-semibold">{recipient}</Text>
      <Text variant="body-sm" color="$color-neutral-medium">Monto</Text>
      <Text variant="heading-lg" color="$color-success">{amount}</Text>
    </View>
  </Card>
  
  <View style={{ gap: '$gap-md' }}>
    <Button variant="solid" label="Confirmar" />
    <Button variant="outline" label="Cancelar" />
  </View>
</View>
```

### Estados comunes

**Loading state:**
```tsx
<Button variant="solid" label="Procesando..." loading disabled />
```

**Error state:**
```tsx
<View style={{ gap: '$gap-sm' }}>
  <Text variant="body-md" color="$color-error">
    Error al procesar la solicitud
  </Text>
  <Button variant="outline" label="Reintentar" />
</View>
```

**Empty state:**
```tsx
<View style={{ padding: '$spacing-xl', alignItems: 'center', gap: '$gap-md' }}>
  <Text variant="heading-md" color="$color-neutral-medium">
    No hay movimientos
  </Text>
  <Text variant="body-md" color="$color-neutral-medium">
    Cuando realices tu primera transacción aparecerá aquí
  </Text>
  <Button variant="solid" label="Hacer transferencia" />
</View>
```

## Common Mistakes to Avoid

### ❌ Don't
```tsx
// No crear componentes custom innecesarios
const CustomButton = ({ title }) => (
  <TouchableOpacity style={{ backgroundColor: '#5A50F9' }}>
    <Text>{title}</Text>
  </TouchableOpacity>
);

// No hardcodear valores
<View style={{ padding: 16, marginTop: 24 }}>

// No usar variantes incorrectas  
<Button variant="primary" /> // No existe "primary"
```

### ✅ Do
```tsx
// Usar componentes de la librería
import { Button } from '@ppay-mobile/fractal-ui';

// Usar tokens del sistema
<View style={{ padding: '$spacing-md', marginTop: '$spacing-lg' }}>

// Usar variantes correctas
<Button variant="solid" size="md" appearance="default" />
```

## Agent Prompting Best Practices

Cuando necesites crear una pantalla:

1. **Identifica el flujo:** "Es una pantalla de lista/detalle/formulario/confirmación"
2. **Consulta patterns:** Lee `composition-patterns.md` para el layout base
3. **Mapea componentes:** Usa `component-api-mapping.json` para props exactas  
4. **Aplica context:** Considera reglas de Personal Pay de `business-context.md`
5. **Valida tokens:** Verificar que spacing y colores usen sistema de tokens

## Error Recovery

Si un componente no funciona:
1. Verificar que `FractalUIProvider` envuelve la app
2. Confirmar variantes en `component-api-mapping.json`
3. Revisar imports desde `@ppay-mobile/fractal-ui`
4. Validar tokens con `$` prefix

## Resources for Agents

- `docs/components/*.md` — documentación detallada por componente
- `docs/tokens/*.md` — sistema de tokens completo  
- `/AGENTS.md` — reglas técnicas de implementación
- `mappings/component-api-mapping.json` — API reference rápida

---

*Este archivo debe ser leído por todo agente antes de trabajar con Fractal*