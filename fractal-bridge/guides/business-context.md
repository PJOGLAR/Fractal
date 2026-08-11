# Business Context — Personal Pay

Contexto de negocio y reglas específicas de Personal Pay para tomar decisiones de UX y componentes.

## Personal Pay Overview

**Producto:** Billetera digital y servicios financieros de Telecom Argentina  
**Usuarios:** Clientes Personal que manejan dinero, hacen transferencias, pagan servicios  
**Contexto:** Argentina, pesos argentinos, regulaciones BCRA, alta inflación

## User Mental Models

### 1. Confianza y Seguridad
Los usuarios de Personal Pay están **muy preocupados por seguridad** en temas de dinero:

- **Siempre confirmar acciones críticas** (transferencias, pagos grandes)
- **Mostrar información clara** en resúmenes antes de ejecutar
- **Estados de loading explícitos** para dar confianza de que algo está pasando
- **Feedback inmediato** cuando se completa una acción

```tsx
// ✅ Buena práctica - confirmación clara
<Card variant="outlined">
  <Text variant="caption-md">Vas a transferir</Text>
  <Text variant="heading-lg" color="$color-success">${amount}</Text>
  <Text variant="body-sm">a {recipient.name}</Text>
</Card>
<Button variant="solid" label="Confirmar transferencia" />

// ❌ Evitar - acción ambigua
<Button variant="solid" label="OK" />
```

### 2. Simplicidad en Flujos Críticos  
Los usuarios necesitan hacer transferencias **rápido y sin errores**:

- **Minimizar steps** en flujos frecuentes (enviar dinero, consultar saldo)
- **Defaults inteligentes** (monto recent, destinatarios frecuentes)  
- **Shortcuts** para acciones comunes
- **Estado del saldo siempre visible**

```tsx
// ✅ Mostrar saldo disponible upfront
<Row leadingContent={<PersonalPayLogo />}>
  <Text variant="body-sm">
    Disponible <Text variant="semibold">${availableBalance}</Text>
  </Text>
</Row>

// ✅ Montos rápidos para acelerar input
<View style={{ flexDirection: 'row', gap: '$gap-sm' }}>
  <Chip label="$5.000" onPress={() => setAmount('5000')} />
  <Chip label="$10.000" onPress={() => setAmount('10000')} />
  <Chip label="$50.000" onPress={() => setAmount('50000')} />
</View>
```

## Component Usage by Context

### Transferencias y Pagos

**Destinatarios:**
- `Avatar` size="sm" para listas de contactos
- `Row` con avatar + nombre + banco/tipo cuenta  
- Siempre mostrar **tipo de cuenta** (Personal Pay, CBU, otro banco)

**Montos:**
- `InputAmount` **centrado** en pantalla para ingreso
- Validación de **monto mínimo $100**
- Montos rápidos con `Chip variant="outline"`
- Formato siempre con separadores de miles: $1.000, $15.500

**Confirmaciones:**
- `Card variant="outlined"` para resúmenes críticos
- Iconografía consistente: persona, peso, calendario, refresh
- `Alert variant="warning"` para recordar que "no se puede cancelar"

### Estados y Errores

**Demoras de servicio:**
```tsx
<Alert 
  variant="info" 
  title="Demora en transferencias"
  message="Mientras resolvemos esta situación, podés seguir enviando dinero a cuentas de Personal Pay."
  dismissible
/>
```

**Empty states:**
- `EmptyState illustration="looking-contact"` para búsquedas sin resultado
- Siempre incluir **próximo paso claro** (qué hacer para resolver)
- Centrado con padding top generoso

**Errores de conectividad:**
```tsx
<Alert 
  variant="error"
  message="Sin conexión. Revisá tu internet e intentá de nuevo."
  actionLabel="Reintentar"
  onAction={retry}
/>
```

## Content & Copy Guidelines

### Tono de voz
- **Cercano y confiable**, no corporativo frío
- **Vos** en lugar de "usted" 
- **Explicativo** cuando hay limitaciones técnicas o regulatorias

### Microcopy crítico

**Labels de campos:**
- "¿A quién le querés transferir?" (no "Destinatario")
- "¿Cuánto querés enviar?" (no "Monto")  
- "Motivo (opcional)" (no "Concepto")

**Botones de acción:**
- "Transferir ahora" (no "Ejecutar")
- "Programar" para acciones futuras
- "Confirmar" cuando ya vio el resumen

**Estados de loading:**
- "Procesando transferencia..." (no "Loading...")
- "Buscando contactos..." 
- "Validando datos..."

## Responsive & Device Patterns

### Mobile-first (Principal)
- **Input de monto centrado** y grande para fácil input táctil
- **Botones full-width** en bottom sticky para alcance del pulgar
- **Cards con tap targets** de min 44px
- **Scroll vertical** para la mayoría de contenido

### Tablet/Desktop (Secundario)
- Mismos componentes, **diferente layout**
- Cards en grid 2-3 columnas en lugar de stack vertical
- Botones pueden ser menores que full-width
- Sidebar navigation donde tiene sentido

## Business Rules to Implement

### Límites y Validaciones

**Transferencias:**
- Monto mínimo: $100
- Monto máximo: depende de verificación KYC del usuario
- Límite diario: mostrar cuánto queda disponible
- Horario: 24hs para Personal Pay, 6-22hs para otros bancos

**Campos obligatorios:**
- Email para nuevos usuarios
- CBU/Alias para destinatarios nuevos  
- Motivo para montos > $100.000

### Navegación y Flujo

**Entry points principales:**
1. Home → "Transferir" → Búsqueda destinatario
2. Contacts → Select → Monto  
3. Recent transfers → "Repetir"

**Exit points claros:**
- "X" vuelve al step anterior hasta Home
- "Cancelar" en confirmaciones vuelve a Home directamente
- Success state siempre tiene "Volver al inicio"

## Platform-Specific Considerations

### Argentina Context
- **Pesos argentinos only** ($ARS)
- Separador de miles con puntos: $1.000.000
- Horarios en UTC-3 (Buenos Aires)
- Regulaciones BCRA (algunos límites cambian)

### Personal Pay Ecosystem
- Integra con **líneas telefónicas Personal**
- **Descuentos** en servicios Telecom si usás Personal Pay
- **QR** para pagos en comercios afiliados
- **Tarjetas** físicas y virtuales disponibles

## Error Handling Philosophy

**Fallos técnicos:**
- Nunca culpar al usuario ("Error del usuario")
- Explicar qué pasó en lenguaje simple
- Ofrecer próximo paso claro
- Contacto a soporte si es necesario

**Validaciones de negocio:**
- Explicar **por qué** no se puede (regulación, límite, etc)
- Ofrecer **alternativa** cuando es posible
- Ser **específico**: "Máximo $50.000 por día" en lugar de "Monto inválido"

---

*Este contexto debe consultarse en cada decisión de UX para mantener consistencia con el producto*