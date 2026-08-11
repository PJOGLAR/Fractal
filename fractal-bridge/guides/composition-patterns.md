# Composition Patterns — Personal Pay

Layouts y patrones de pantalla reales del flujo de transferencias usando componentes de Fractal.

## Layout Base

Toda pantalla en Personal Pay sigue esta estructura estándar:

```tsx
import { ScrollView, View, Text } from '@ppay-mobile/fractal-ui';

export function BaseLayout({ title, children, hasButtonGroup = false }) {
  return (
    <View style={{ flex: 1, backgroundColor: '$color-background-quiet' }}>
      {/* Content header con status bar y top bar */}
      <View style={{ width: '100%' }}>
        {/* Status bar */}
        <View style={{ 
          backgroundColor: '$color-brand-main-medium', 
          height: 32, 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          paddingHorizontal: '$spacing-md' 
        }}>
          <Text variant="body-sm-medium" color="$color-foreground-neutral-subtle">
            12:30
          </Text>
          {/* Iconos de estado: celular, wifi, batería */}
        </View>
        
        {/* Top bar */}
        <View style={{ 
          backgroundColor: '$color-brand-default-medium',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: '$spacing-xs',
          paddingVertical: '$spacing-xs'
        }}>
          {/* Botón de back */}
          <View style={{ padding: '$spacing-sm' }}>
            {/* Arrow back icon */}
          </View>
          <Text variant="body-lg-semibold" color="$color-foreground-neutral-subtle" style={{ flex: 1, textAlign: 'center' }}>
            {title}
          </Text>
          <View style={{ width: 40, height: 40 }} />
        </View>
      </View>
      
      {/* Design area */}
      <View style={{ 
        flex: 1, 
        paddingHorizontal: '$spacing-lg', 
        paddingVertical: '$spacing-lg',
        gap: '$gap-lg'
      }}>
        {children}
      </View>
      
      {/* Button group si es necesario */}
      {hasButtonGroup && (
        <View style={{ 
          paddingHorizontal: '$spacing-lg',
          paddingTop: '$spacing-lg',
          paddingBottom: '$spacing-md',
          backgroundColor: '$color-background-quiet'
        }}>
          {/* Botones de acción */}
        </View>
      )}
    </View>
  );
}
```

## 1. Pantalla de Búsqueda/Input (Primera pantalla del flujo)

**Usado para:** buscar destinatarios, ingresar CBU/alias, empty states

```tsx
import { View, Text, TextInput, Alert, EmptyState } from '@ppay-mobile/fractal-ui';

export function TransferSearchScreen() {
  return (
    <BaseLayout title="Transferir" hasButtonGroup={false}>
      
      {/* Campo de búsqueda principal */}
      <TextInput
        label="¿A quien le querés transferir?"
        placeholder="Ingresá alias, CBU/CVU o contacto"
        style={{ width: '100%' }}
      />
      
      {/* Alert informativo */}
      <Alert 
        variant="info"
        title="Demora en transferencias"
        message="Mientras resolvemos esta situación, podés seguir enviando dinero a cuentas de Personal Pay."
        dismissible
        style={{ width: '100%' }}
      />
      
      {/* Empty state con ilustración */}
      <View style={{ 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
        paddingTop: '$spacing-xl'
      }}>
        <EmptyState
          illustration="looking-contact"
          title="Buscá un contacto para empezar"
          description="Ingresá el alias, CBU/CVU o seleccioná un contacto de tu agenda."
        />
      </View>
      
    </BaseLayout>
  );
}
```

## 2. Pantalla de Ingreso de Monto

**Usado para:** capturar monto de transferencia con saldo disponible

```tsx
import { View, Text, Row, InputAmount, Chip, Button, Avatar } from '@ppay-mobile/fractal-ui';

export function AmountInputScreen({ recipient, availableBalance }) {
  const [amount, setAmount] = useState('0');
  
  return (
    <BaseLayout title="Ingresar monto" hasButtonGroup>
      
      {/* Saldo disponible */}
      <Row 
        leadingContent={
          <View style={{ 
            backgroundColor: '$color-brand-default-quiet',
            padding: '$spacing-xs',
            borderRadius: '$border-radius-md'
          }}>
            {/* Logo Personal Pay */}
          </View>
        }
        style={{ 
          backgroundColor: '$color-brand-default-quiet',
          padding: '$spacing-md',
          borderRadius: '$border-radius-md'
        }}
      >
        <Text variant="body-sm-regular">
          Disponible <Text variant="body-sm-semibold">${availableBalance}</Text>
        </Text>
      </Row>
      
      {/* Destinatario seleccionado */}
      <Row
        leadingContent={
          <Avatar size="sm" initials="MC" />
        }
        style={{ paddingVertical: '$spacing-md' }}
      >
        <View>
          <Text variant="body-sm-semibold">{recipient.name}</Text>
          <Text variant="caption-md-regular" color="$color-neutral-secondary">
            Personal Pay
          </Text>
        </View>
      </Row>
      
      {/* Input de monto centrado */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: '$gap-lg' }}>
        
        <View style={{ gap: '$gap-md', alignItems: 'center' }}>
          <InputAmount
            value={amount}
            onChangeText={setAmount}
            currency="peso"
            placeholder="0"
          />
          <Text variant="body-sm-regular" color="$color-neutral-secondary" style={{ textAlign: 'center' }}>
            Monto mínimo $100
          </Text>
        </View>
        
        {/* Montos rápidos */}
        <View style={{ flexDirection: 'row', gap: '$gap-sm', justifyContent: 'center' }}>
          <Chip label="$5.000" variant="outline" />
          <Chip label="$10.000" variant="outline" />
          <Chip label="$100.000" variant="outline" />
        </View>
        
        {/* Motivo */}
        <Button 
          variant="ghost" 
          label="Motivo: Varios"
          leftIcon="edit"
          style={{ alignSelf: 'center' }}
        />
        
      </View>
      
      {/* Button group */}
      <Button 
        variant="solid" 
        label="Continuar" 
        disabled={!amount || parseFloat(amount) < 100}
        style={{ width: '100%' }}
      />
      
    </BaseLayout>
  );
}
```

## 3. Pantalla de Confirmación/Resumen

**Usado para:** revisar datos antes de confirmar transferencia

```tsx
import { View, Text, Row, Button, TextInput, Card } from '@ppay-mobile/fractal-ui';

export function TransferConfirmationScreen({ recipient, amount, schedule }) {
  return (
    <BaseLayout title="Programar transferencia" hasButtonGroup>
      
      {/* Campo opcional para nombre del evento */}
      <TextInput
        label="Nombre del evento (opcional)"
        placeholder="Nombre del evento"
        rightIcon="edit"
        supportingText="Son hasta 20 dígitos."
        style={{ width: '100%' }}
      />
      
      {/* Card de resumen con todos los detalles */}
      <Card style={{ 
        borderWidth: 1,
        borderColor: '$color-border-neutral-primary-subtle',
        backgroundColor: '$color-background-neutral-quiet'
      }}>
        
        {/* Destinatario */}
        <Row
          leadingContent={
            <View style={{ 
              backgroundColor: '$color-brand-main-subtle',
              padding: '$spacing-xs',
              borderRadius: '$border-radius-xs'
            }}>
              {/* Person icon */}
            </View>
          }
          style={{ paddingVertical: '$spacing-md' }}
        >
          <View>
            <Text variant="caption-md-regular" color="$color-neutral-secondary">
              Destinatario
            </Text>
            <Text variant="body-sm-semibold">
              {recipient.name}
            </Text>
          </View>
        </Row>
        
        <Divider />
        
        {/* Monto */}
        <Row
          leadingContent={
            <View style={{ 
              backgroundColor: '$color-brand-main-subtle',
              padding: '$spacing-xs',
              borderRadius: '$border-radius-xs'
            }}>
              {/* Peso money icon */}
            </View>
          }
          trailingContent={
            {/* Edit icon */}
          }
          style={{ paddingVertical: '$spacing-md' }}
        >
          <View>
            <Text variant="caption-md-regular" color="$color-neutral-secondary">
              Monto
            </Text>
            <Text variant="body-sm-semibold">
              ${amount}
            </Text>
          </View>
        </Row>
        
        <Divider />
        
        {/* Próxima ejecución */}
        <Row
          leadingContent={
            <View style={{ 
              backgroundColor: '$color-brand-main-subtle',
              padding: '$spacing-xs',
              borderRadius: '$border-radius-xs'
            }}>
              {/* Calendar icon */}
            </View>
          }
          trailingContent={
            {/* Edit icon */}
          }
          style={{ paddingVertical: '$spacing-md' }}
        >
          <View>
            <Text variant="caption-md-regular" color="$color-neutral-secondary">
              Próxima ejecución
            </Text>
            <Text variant="body-sm-semibold">
              {schedule.nextExecution}
            </Text>
          </View>
        </Row>
        
        <Divider />
        
        {/* Frecuencia */}
        <Row
          leadingContent={
            <View style={{ 
              backgroundColor: '$color-brand-main-subtle',
              padding: '$spacing-xs',
              borderRadius: '$border-radius-xs'
            }}>
              {/* Refresh icon */}
            </View>
          }
          trailingContent={
            {/* Edit icon */}
          }
          style={{ paddingVertical: '$spacing-md' }}
        >
          <View>
            <Text variant="caption-md-regular" color="$color-neutral-secondary">
              Frecuencia
            </Text>
            <Text variant="body-sm-semibold">
              {schedule.frequency}
            </Text>
          </View>
        </Row>
        
      </Card>
      
      {/* Button group con divider */}
      <View style={{ gap: '$gap-md' }}>
        <Divider />
        <Button variant="solid" label="Programar" style={{ width: '100%' }} />
        <Button variant="ghost" label="Cancelar" style={{ width: '100%' }} />
      </View>
      
    </BaseLayout>
  );
}
```

## 4. Pantalla de Confirmación

**Usado para:** confirmar transferencias, pagos, cambios importantes

```tsx
import { ScrollView, View, Text, Card, Button, Alert, Avatar } from '@ppay-mobile/fractal-ui';

export function TransferConfirmation({ transfer, onConfirm, onCancel }) {
  const [loading, setLoading] = useState(false);
  
  return (
    <ScrollView style={{ padding: '$spacing-lg' }}>
      <View style={{ gap: '$gap-lg' }}>
        
        <Text variant="heading-lg">Confirmar Transferencia</Text>
        
        {/* Información del destinatario */}
        <Card variant="elevated">
          <View style={{ alignItems: 'center', gap: '$gap-md' }}>
            <Avatar size="lg" initials={transfer.recipient.initials} />
            <View style={{ alignItems: 'center' }}>
              <Text variant="body-md-semibold">{transfer.recipient.name}</Text>
              <Text variant="body-sm" color="$color-neutral-medium">
                {transfer.recipient.bank}
              </Text>
            </View>
          </View>
        </Card>

        {/* Detalle de la operación */}
        <Card>
          <View style={{ gap: '$gap-md' }}>
            <View style={{ alignItems: 'center' }}>
              <Text variant="body-sm" color="$color-neutral-medium">Vas a transferir</Text>
              <Text variant="heading-xl" color="$color-primary">
                {transfer.formattedAmount}
              </Text>
            </View>
            
            <View style={{ gap: '$gap-sm' }}>
              <Row>
                <View>
                  <Text variant="caption-md" color="$color-neutral-medium">Desde</Text>
                  <Text variant="body-sm-semibold">Mi cuenta Personal Pay</Text>
                </View>
              </Row>
              <Row>
                <View>
                  <Text variant="caption-md" color="$color-neutral-medium">Hacia</Text>
                  <Text variant="body-sm-semibold">{transfer.recipient.account}</Text>
                </View>
              </Row>
              <Row>
                <View>
                  <Text variant="caption-md" color="$color-neutral-medium">Descripción</Text>
                  <Text variant="body-sm-semibold">{transfer.description || "Sin descripción"}</Text>
                </View>
              </Row>
              <Row>
                <View>
                  <Text variant="caption-md" color="$color-neutral-medium">Fecha</Text>
                  <Text variant="body-sm-semibold">Inmediata</Text>
                </View>
              </Row>
            </View>
          </View>
        </Card>

        {/* Alert de seguridad */}
        <Alert 
          variant="warning"
          message="Verificá que los datos sean correctos. Las transferencias no se pueden cancelar."
        />

        {/* Acciones */}
        <View style={{ gap: '$gap-md' }}>
          <Button 
            variant="solid" 
            label={loading ? "Procesando..." : "Confirmar transferencia"}
            loading={loading}
            onPress={() => onConfirm(transfer)}
          />
          <Button 
            variant="outline" 
            label="Revisar datos" 
            onPress={onCancel}
          />
        </View>

      </View>
    </ScrollView>
  );
}
```

## 5. Onboarding/Wizard

**Usado para:** registro, configuración inicial, tutoriales

```tsx
import { ScrollView, View, Text, Button, ProgressBar } from '@ppay-mobile/fractal-ui';

export function OnboardingStep({ step, totalSteps, title, description, children, onNext, onPrev }) {
  return (
    <ScrollView style={{ padding: '$spacing-lg' }}>
      <View style={{ gap: '$gap-lg' }}>
        
        {/* Progress */}
        <View style={{ gap: '$gap-sm' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="body-sm" color="$color-neutral-medium">
              Paso {step} de {totalSteps}
            </Text>
            <Text variant="body-sm" color="$color-neutral-medium">
              {Math.round((step / totalSteps) * 100)}%
            </Text>
          </View>
          <ProgressBar progress={step / totalSteps} />
        </View>

        {/* Content */}
        <View style={{ gap: '$gap-md' }}>
          <Text variant="heading-lg">{title}</Text>
          <Text variant="body-md" color="$color-neutral-medium">
            {description}
          </Text>
        </View>

        {/* Step content */}
        <View style={{ gap: '$gap-md' }}>
          {children}
        </View>

        {/* Actions */}
        <View style={{ gap: '$gap-md' }}>
          <Button variant="solid" label="Continuar" onPress={onNext} />
          {step > 1 && (
            <Button variant="ghost" label="Anterior" onPress={onPrev} />
          )}
          <Button variant="ghost" label="Saltar por ahora" onPress={onSkip} />
        </View>

      </View>
    </ScrollView>
  );
}
```

## Reglas de Spacing

### Entre secciones principales
```tsx
<View style={{ gap: '$gap-lg' }}> {/* 24px */}
```

### Entre componentes relacionados  
```tsx
<View style={{ gap: '$gap-md' }}> {/* 16px */}
```

### Entre elementos de un componente
```tsx
<View style={{ gap: '$gap-sm' }}> {/* 8px */}
```

### Entre metadatos o detalles
```tsx
<View style={{ gap: '$gap-xs' }}> {/* 4px */}
```

### Padding de pantalla
```tsx
// Pantallas principales
style={{ padding: '$spacing-lg' }} {/* 24px */}

// Listas y contenido denso
style={{ padding: '$spacing-md' }} {/* 16px */}

// Componentes internos
style={{ padding: '$spacing-sm' }} {/* 8px */}
```

## Estados Comunes

### Loading State
```tsx
<Button variant="solid" label="Cargando..." loading disabled />
```

### Error State  
```tsx
<Alert 
  variant="error"
  message="Error al procesar la solicitud"
  dismissible
  onDismiss={clearError}
/>
```

### Empty State
```tsx
<View style={{ padding: '$spacing-xl', alignItems: 'center', gap: '$gap-md' }}>
  <Text variant="heading-md" color="$color-neutral-medium">
    No hay datos
  </Text>
  <Text variant="body-md" color="$color-neutral-medium">
    Descripción de por qué está vacío
  </Text>
  <Button variant="solid" label="Acción para resolver" />
</View>
```

Estos patrones cubren el 90% de las pantallas en Personal Pay. Combiná y adaptá según necesidades específicas.