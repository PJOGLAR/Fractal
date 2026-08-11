# Token Usage Examples — Real World Patterns

Ejemplos reales de cómo usar tokens de Fractal en pantallas típicas de Personal Pay.

## Spacing Hierarchy

### Screen Padding
```tsx
// Pantallas principales - espaciado generoso
<ScrollView style={{ padding: '$spacing-lg' }}> {/* 24px */}

// Listas densas - espaciado moderado  
<ScrollView style={{ padding: '$spacing-md' }}> {/* 16px */}

// Modals y overlays - espaciado mínimo
<Modal style={{ padding: '$spacing-sm' }}> {/* 8px */}
```

### Component Spacing
```tsx
// Entre secciones principales (header, content, buttons)
<View style={{ gap: '$gap-xl' }}> {/* 32px */}

// Entre componentes relacionados (form fields, cards)
<View style={{ gap: '$gap-lg' }}> {/* 24px */}

// Entre elementos de un componente (label + input)
<View style={{ gap: '$gap-md' }}> {/* 16px */}

// Entre items de una lista
<View style={{ gap: '$gap-sm' }}> {/* 8px */}

// Entre texto y subtexto muy relacionado
<View style={{ gap: '$gap-xs' }}> {/* 4px */}
```

## Typography Patterns

### Pantalla de Transfer
```tsx
// Título principal de pantalla
<Text variant="heading-lg">Transferir</Text>

// Subtítulo o descripción
<Text variant="heading-md" color="$color-foreground-neutral-secondary">
  Enviá dinero al instante
</Text>

// Cuerpo principal - instrucciones
<Text variant="body-md">
  Ingresá el alias, CBU/CVU o seleccioná un contacto.
</Text>

// Metadata - saldo, fechas, etc
<Text variant="body-sm" color="$color-foreground-neutral-subtle">
  Disponible $15.420
</Text>

// Captionsa muy pequeños - ayuda contextual
<Text variant="caption-md" color="$color-foreground-neutral-subtle">
  Monto mínimo $100
</Text>
```

### Jerarquía en Cards
```tsx
<Card>
  {/* Título de card */}
  <Text variant="body-md-semibold">Mariano Castro</Text>
  
  {/* Subtítulo */}
  <Text variant="body-sm" color="$color-foreground-neutral-secondary">
    Personal Pay
  </Text>
  
  {/* Monto destacado */}
  <Text variant="heading-lg" color="$color-semantic-success-medium">
    $25.000
  </Text>
  
  {/* Metadata temporal */}
  <Text variant="caption-md" color="$color-neutral-medium">
    Hace 2 minutos
  </Text>
</Card>
```

## Color Usage Patterns

### Semantic Colors
```tsx
// Success - montos positivos, confirmaciones
<Text color="$color-semantic-success-medium">+ $5.000</Text>

// Error - fallos, montos negativos  
<Text color="$color-semantic-error-medium">Error al procesar</Text>

// Warning - alertas, límites
<Alert variant="warning" /> // usa $color-semantic-warning automáticamente

// Info - notificaciones neutrales
<Alert variant="info" /> // usa $color-semantic-info automáticamente
```

### Interactive Colors
```tsx
// Primary actions - botones principales
<Button variant="solid" /> // usa $color-brand-main automáticamente

// Links y acciones secundarias  
<Button 
  variant="ghost" 
  label="Editar" 
  // color se maneja automáticamente por variant
/>

// Estados disabled
<Button variant="solid" disabled /> // opacity automática
```

### Neutral Scale
```tsx
// Texto principal
<Text color="$color-foreground-neutral-primary">
  Título importante
</Text>

// Texto secundario  
<Text color="$color-foreground-neutral-secondary">
  Descripción o subtítulo
</Text>

// Texto sutil - metadata
<Text color="$color-foreground-neutral-subtle">
  Información adicional
</Text>

// Fondos y containers
<View style={{ backgroundColor: '$color-background-neutral-quiet' }}>
  {/* Área de contenido */}
</View>

<Card style={{ backgroundColor: '$color-background-neutral-surface' }}>
  {/* Card destacada */}
</Card>
```

## Border Radius Patterns

### Component Corners
```tsx
// Buttons y inputs - bordes suaves
<Button style={{ borderRadius: '$border-radius-md' }} /> // 8px

// Cards - bordes más pronunciados
<Card style={{ borderRadius: '$border-radius-lg' }} /> // 12px

// Chips y badges - muy redondeados
<Chip style={{ borderRadius: '$border-radius-xl' }} /> // 16px

// Avatars - completamente redondos
<Avatar style={{ borderRadius: '$border-radius-round' }} /> // 50%
```

### Container Hierarchy
```tsx
// Modal principal
<Modal style={{ borderRadius: '$border-radius-xl' }}> {/* 16px */}

// Cards dentro del modal
<Card style={{ borderRadius: '$border-radius-md' }}> {/* 8px */}

// Elementos dentro de cards
<Chip style={{ borderRadius: '$border-radius-sm' }}> {/* 4px */}
```

## Shadow Usage

### Elevation Hierarchy
```tsx
// Botones principales - sombra sutil
<Button variant="solid" style={{ elevation: '$elevation-sm' }} />

// Cards de contenido
<Card style={{ elevation: '$elevation-md' }} />

// Modals y overlays - máxima elevación
<Modal style={{ elevation: '$elevation-lg' }} />

// Sheets y bottom modals
<BottomSheet style={{ elevation: '$elevation-xl' }} />
```

## Real Screen Examples

### Transfer Amount Screen
```tsx
export function AmountScreen() {
  return (
    <ScrollView style={{ 
      padding: '$spacing-lg',           // 24px pantalla principal
      gap: '$gap-xl'                    // 32px entre secciones
    }}>
      
      {/* Header */}
      <View style={{ gap: '$gap-md' }}>  {/* 16px entre relacionados */}
        <Text variant="heading-lg">Ingresar monto</Text>
        <Text variant="body-md" color="$color-foreground-neutral-secondary">
          ¿Cuánto querés transferir?
        </Text>
      </View>
      
      {/* Balance info */}
      <Card style={{ 
        backgroundColor: '$color-background-brand-subtle',
        borderRadius: '$border-radius-md',
        padding: '$spacing-md'          // 16px interno
      }}>
        <Text variant="body-sm" color="$color-foreground-neutral-subtle">
          Disponible 
        </Text>
        <Text variant="body-sm-semibold">$25.420</Text>
      </Card>
      
      {/* Amount input - centrado */}
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        gap: '$gap-lg'                  // 24px entre input y chips
      }}>
        <InputAmount 
          value={amount}
          placeholder="$0"
          currency="peso"
        />
        
        {/* Quick amounts */}
        <View style={{ 
          flexDirection: 'row', 
          gap: '$gap-sm',               // 8px entre chips
          justifyContent: 'center' 
        }}>
          <Chip label="$5.000" variant="outline" />
          <Chip label="$10.000" variant="outline" />
          <Chip label="$50.000" variant="outline" />
        </View>
      </View>
      
      {/* Actions */}
      <Button 
        variant="solid" 
        label="Continuar"
        disabled={!amount}
      />
      
    </ScrollView>
  );
}
```

### Confirmation Summary
```tsx
export function ConfirmationScreen() {
  return (
    <ScrollView style={{ 
      padding: '$spacing-lg',
      gap: '$gap-lg'
    }}>
      
      <Text variant="heading-lg">Confirmar transferencia</Text>
      
      {/* Summary card */}
      <Card 
        variant="outlined" 
        style={{ 
          borderRadius: '$border-radius-lg',
          padding: '$spacing-md'
        }}
      >
        <View style={{ gap: '$gap-md' }}>
          
          {/* Recipient */}
          <Row 
            leadingContent={<Avatar size="sm" initials="MC" />}
            style={{ gap: '$gap-sm' }}
          >
            <View style={{ gap: '$gap-xs' }}>
              <Text variant="body-sm-semibold">Mariano Castro</Text>
              <Text variant="caption-md" color="$color-foreground-neutral-subtle">
                Personal Pay
              </Text>
            </View>
          </Row>
          
          <Divider />
          
          {/* Amount */}
          <View style={{ alignItems: 'center', gap: '$gap-xs' }}>
            <Text variant="body-sm" color="$color-foreground-neutral-subtle">
              Vas a transferir
            </Text>
            <Text variant="heading-xl" color="$color-semantic-success-medium">
              $25.000
            </Text>
          </View>
          
        </View>
      </Card>
      
      {/* Warning */}
      <Alert 
        variant="warning"
        message="Verificá que los datos sean correctos. Las transferencias no se pueden cancelar."
      />
      
      {/* Actions */}
      <View style={{ gap: '$gap-md' }}>
        <Button variant="solid" label="Confirmar transferencia" />
        <Button variant="ghost" label="Revisar datos" />
      </View>
      
    </ScrollView>
  );
}
```

## Dark Mode Considerations

Los tokens de Fractal **automáticamente** manejan dark mode:

```tsx
// ✅ Se adapta automáticamente
<View style={{ backgroundColor: '$color-background-neutral-surface' }}>
  <Text color="$color-foreground-neutral-primary">Texto</Text>
</View>

// ❌ No se adapta - evitar
<View style={{ backgroundColor: '#FFFFFF' }}>
  <Text style={{ color: '#000000' }}>Texto</Text>
</View>
```

## Performance Tips

### Consistent Token Usage
```tsx
// ✅ Reutilizar tokens para consistency
const styles = {
  screenPadding: { padding: '$spacing-lg' },
  sectionGap: { gap: '$gap-lg' },
  cardStyle: { 
    borderRadius: '$border-radius-md',
    backgroundColor: '$color-background-neutral-surface'
  }
}

// ❌ Evitar valores hardcodeados
const styles = {
  screenPadding: { padding: 24 },
  sectionGap: { gap: 20 },  // inconsistente!
  cardStyle: { borderRadius: 8, backgroundColor: '#F8F9FA' }
}
```

---

*Estos ejemplos cubren 90% de los casos. Para casos edge, consultar `docs/tokens/` completo*