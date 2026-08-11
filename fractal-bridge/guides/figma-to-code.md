# Figma to Code — Implementation Guide

Cómo traducir elementos de Figma a código usando Fractal UI de Personal Pay.

## Process Overview

```
Figma Component → Identify Pattern → Map to Fractal → Apply Business Rules → Implement
```

## Component Identification

### 1. Análisis del Frame
Al recibir un diseño en Figma, identificar:

```tsx
// ¿Qué tipo de pantalla es?
TransferSearchScreen     → Empty state + input
AmountInputScreen        → Centered input + chips
ConfirmationScreen       → Card summary + buttons
ListScreen              → ScrollView + repeated cards
OnboardingScreen        → Progress + content + navigation
```

### 2. Anatomía de Componentes

**Ejemplo: Campo de texto con ícono**

Figma:
- Rectangle (container)
- Text layer (label)  
- Text layer (placeholder)
- Icon (search/edit)
- Text layer (supporting text)

Código Fractal:
```tsx
<TextInput
  label="¿A quien le querés transferir?"
  placeholder="Ingresá alias, CBU/CVU o contacto"
  rightIcon="search"
  supportingText="Podés usar alias o CBU completo"
/>
```

### 3. Mapeo de Estados

| Figma Layer Name | Fractal State | Implementation |
|-----------------|---------------|----------------|
| `Default` | default | No props adicionales |
| `Focus` | focus | Manejado automáticamente |
| `Error` | error | `error={true}` o `error="Mensaje"` |
| `Disabled` | disabled | `disabled={true}` |
| `Loading` | loading | `loading={true}` (solo buttons) |

## Component Mapping Guide

### Buttons
**Identificar variante por:**
- Color de fondo → `solid` (azul), `outline` (borde), `ghost` (transparente)
- Uso en pantalla → Primario = `solid`, Secundario = `outline`, Terciario = `ghost`

```tsx
// Figma: Button azul sólido con "Continuar"
<Button variant="solid" label="Continuar" onPress={handleNext} />

// Figma: Button con borde para "Cancelar"
<Button variant="outline" label="Cancelar" onPress={handleCancel} />

// Figma: Link o texto clickeable
<Button variant="ghost" label="Editar monto" leftIcon="edit" />
```

### Layout Containers

**Figma Frames → React Structure:**

```tsx
// Frame principal de pantalla
<ScrollView style={{ padding: '$spacing-lg' }}>
  
  // Frame de header
  <View style={{ gap: '$gap-md' }}>
    <Text variant="heading-lg">Título</Text>
    <Text variant="body-md">Descripción</Text>
  </View>
  
  // Frame de contenido principal
  <View style={{ gap: '$gap-lg' }}>
    {/* Componentes */}
  </View>
  
  // Frame de botones (si aplica)
  <View style={{ gap: '$gap-md' }}>
    <Button variant="solid" label="Acción principal" />
    <Button variant="ghost" label="Acción secundaria" />
  </View>
  
</ScrollView>
```

### Spacing Translation

**Figma Distance → Fractal Token:**
- 4px → `'$gap-xs'` o `'$spacing-xs'`
- 8px → `'$gap-sm'` o `'$spacing-sm'`  
- 16px → `'$gap-md'` o `'$spacing-md'`
- 24px → `'$gap-lg'` o `'$spacing-lg'`
- 32px → `'$gap-xl'` o `'$spacing-xl'`

**Regla:** usar `gap` para espaciado entre elementos hermanos, `padding` para espaciado interno.

### Colors & Typography

**No copiar valores HEX directamente**. Usar tokens semánticos:

```tsx
// ❌ No hacer
<Text style={{ color: '#1A1B23' }}>Título</Text>

// ✅ Usar tokens
<Text variant="heading-lg" color="$color-foreground-neutral-primary">
  Título
</Text>
```

**Mapeo de typography:**
- Figma "Heading/Large" → `variant="heading-lg"`
- Figma "Body/Medium/Regular" → `variant="body-md"`  
- Figma "Caption/Medium" → `variant="caption-md"`

Ver `docs/tokens/semanticos.md` para lista completa.

## Business Logic Integration

### Personal Pay Patterns

**Transferencias:**
```tsx
// Siempre mostrar saldo disponible al principio
<Row leadingContent={<PersonalPayLogo />}>
  <Text>Disponible <Text variant="semibold">${balance}</Text></Text>
</Row>

// Monto centrado en pantalla
<View style={{ flex: 1, justifyContent: 'center' }}>
  <InputAmount value={amount} currency="peso" />
</View>
```

**Confirmaciones:**
```tsx
// Card con border para resúmenes críticos
<Card variant="outlined">
  {summary.map(item => (
    <Row key={item.field} leadingContent={<Icon />} trailingContent={<EditIcon />}>
      <DetailField label={item.label} value={item.value} />
    </Row>
  ))}
</Card>
```

### Validation Rules

**Montos:**
```tsx
const isValidAmount = parseFloat(amount) >= 100;
<Button 
  variant="solid" 
  label="Continuar"
  disabled={!isValidAmount}
/>
```

**Required fields:**
```tsx
<TextInput 
  label="Email"
  placeholder="tu@email.com"
  error={!email && submitted ? "Campo obligatorio" : undefined}
/>
```

## Common Figma → Code Issues

### ❌ Problemas frecuentes

1. **Hardcodear medidas del Figma**
```tsx
// No copiar valores exactos
<View style={{ marginTop: 23.7, paddingLeft: 15.2 }} />
```

2. **Crear componentes custom innecesarios**
```tsx
// No reinventar la rueda
const MyButton = () => <TouchableOpacity>...
```

3. **Ignorar estados interactivos**
```tsx
// Falta disabled, loading, error states
<Button label="Submit" />
```

### ✅ Soluciones

1. **Usar tokens del sistema**
```tsx
<View style={{ marginTop: '$spacing-lg', padding: '$spacing-md' }} />
```

2. **Aprovechar componentes existentes**
```tsx
<Button variant="solid" size="md" label="Submit" />
```

3. **Implementar todos los estados**
```tsx
<Button 
  variant="solid" 
  label={loading ? "Procesando..." : "Submit"}
  disabled={!isValid}
  loading={loading}
/>
```

## Debug Checklist

Cuando el resultado no se ve como Figma:

- [ ] ¿Está importado desde `@ppay-mobile/fractal-ui`?
- [ ] ¿Tiene `FractalUIProvider` en el root?
- [ ] ¿Las variantes existen en el componente?
- [ ] ¿Los tokens están bien referenciados con `$`?
- [ ] ¿El spacing sigue la grilla 4/8/16/24px?
- [ ] ¿Los colores son tokens, no valores HEX?

## Advanced: Component Composition

Para elementos que no son un componente único:

```tsx
// Figma: Card complejo con avatar, texto, chip y acción
export function ContactCard({ contact }) {
  return (
    <Card onPress={() => selectContact(contact)}>
      <Row 
        leadingContent={<Avatar size="sm" initials={contact.initials} />}
        trailingContent={<Chip label={contact.bank} size="sm" />}
      >
        <View>
          <Text variant="body-md-semibold">{contact.name}</Text>
          <Text variant="caption-md" color="$color-neutral-medium">
            {contact.accountType}
          </Text>
        </View>
      </Row>
    </Card>
  );
}
```

**Regla:** Si necesitas más de 3 niveles de nesting, considera si hay un patrón que se pueda componentizar.

---

*Para dudas específicas sobre componentes, consultar `mappings/component-api-mapping.json`*