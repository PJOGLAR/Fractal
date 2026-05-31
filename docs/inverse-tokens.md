# Tokens Inverse — propuesta de unificación

> Documento exploratorio. Resume el problema detectado con tokens "on-color" (foregrounds que van sobre fondos oscuros o saturados) y propone formalizarlos bajo un slot `inverse`.

---

## El problema

En la nomenclatura actual hay **dos lógicas mezcladas** dentro del mismo nivel de la jerarquía de tokens.

### Lógica A — escala de prominencia (la mayoría de los tokens)

```
interactive/foreground/brand/main/default/medium
interactive/background/brand/default/bold
interactive/border/neutral/default/subtle
```

`medium`, `bold`, `subtle` describen **prominencia visual** dentro del contexto.

### Lógica B — implícitamente "on-something"

```
interactive/foreground/neutral/default/quiet  → #FCFCFC
```

Este token es claro porque va sobre fondos saturados (purple, brand). Pero el nombre `quiet` ("apenas visible") **dice lo contrario**: sobre purple, ese blanco es lo más visible posible (máximo contraste).

**El nombre miente sobre el uso.** Es coherente con la escala (es el valor cromático más claro), pero el rol semántico es opuesto al que sugiere "quiet".

### Caso visual concreto

Cuatro botones sobre fondo purple. Los foregrounds y backgrounds aplicados:

```
Botón 1 (fondo purple lleno, label blanco):
  foreground: interactive/foreground/neutral/default/quiet  → #FCFCFC

Botón 2 (fondo blanco, label purple):
  foreground: interactive/foreground/brand/main/default/medium → purple
  background: interactive/background/neutral/default/medium    → #FCFCFC

Botón 3 (outline, label purple):
  foreground: interactive/foreground/brand/main/default/medium
  border:     interactive/border/neutral/default/subtle

Botón 4 (fondo purple bold, label blanco):
  background: interactive/background/brand/default/bold        → purple oscuro
  foreground: interactive/foreground/neutral/default/quiet     → #FCFCFC
```

El "label blanco sobre purple" se nombra `quiet`. Pero el blanco **es el foreground más prominente posible** sobre ese fondo. La escala no comunica el rol real.

---

## Por qué pasa esto

Hoy en la nomenclatura, los foregrounds claros (los que van sobre fondos oscuros) caen en la escala `quiet` porque son "el valor más claro de la paleta". Pero en uso semántico, son **el opuesto al default**, no una versión "apenas visible".

Es un caso de **tokens contextuales mal nombrados**. El equipo lo usa correctamente por intuición, pero el nombre no ayuda y se vuelve trampa cuando entra gente nueva.

---

## La propuesta — slot `inverse`

Agregar un slot intermedio `inverse` antes de la escala, que diferencia foregrounds **default** (sobre fondos claros) de **inverse** (sobre fondos oscuros o saturados).

### Estructura

```
[contexto]/[elemento]/[familia]/[default | inverse]/[escala]
```

### Cómo se ven los tokens

```
Foreground neutral sobre fondos normales (claros):
  interactive/foreground/neutral/default/bold     → #171717
  interactive/foreground/neutral/default/medium   → #404040  (default principal)
  interactive/foreground/neutral/default/subtle   → #676767
  interactive/foreground/neutral/default/quiet    → #A9A9A9  (apenas visible sobre claro)

Foreground neutral sobre fondos inverse (oscuros/saturados):
  interactive/foreground/neutral/inverse/bold     → #FFFFFF  (blanco puro, máximo contraste)
  interactive/foreground/neutral/inverse/medium   → #FCFCFC  (default sobre inverse)
  interactive/foreground/neutral/inverse/subtle   → #DADADA
  interactive/foreground/neutral/inverse/quiet    → #858585  (apenas visible sobre inverse)
```

**Cada slot tiene su propia escala completa.** La regla `bold > medium > subtle > quiet` significa lo mismo en ambos: prominencia relativa al contexto.

---

## Concepto clave — la escala es contextual

> `quiet` siempre significa "apenas visible en el contexto", no un valor cromático absoluto.

| Slot | `quiet` significa |
|---|---|
| `default` (sobre fondo claro) | Un gris claro, que se confunde con el fondo |
| `inverse` (sobre fondo oscuro) | Un gris oscuro, que se confunde con el fondo |

No es el valor cromático lo que define el slot. Es **la prominencia visual relativa al fondo**.

```
default/quiet    → #A9A9A9  (gris claro, apenas se ve sobre fondo claro)
inverse/quiet    → #858585  (gris oscuro, apenas se ve sobre fondo oscuro)
```

Mismo rol semántico, valores cromáticos opuestos. Es exactamente lo que ya hacemos con `medium`:

```
foreground/neutral/default/medium  → 700  (oscuro, sobre fondo claro)
background/neutral/default/medium  → 25   (claro, sobre fondo claro)
```

---

## Por qué slot `inverse` y no `on-bold` / `on-something`

Material 3 e IBM Carbon usan `on-` para indicar "sobre qué fondo va". Ejemplo: `on-primary`, `on-surface`.

Decidimos no adoptarlo por dos razones:

1. **`on-` requiere especificar la superficie.** `on-bold` o `on-primary` o `on-feedback`. Eso multiplica los tokens y obliga a memorizar pares.

2. **`inverse` mantiene la escala intacta.** Solo agrega un slot que diferencia "default vs inverse". No multiplica vocabulario.

Coincide con la lógica de **Appearance** que ya tienen algunos componentes (`Button`, `Button-icon`, `Status-bar`):
- `Appearance=default` → fondo claro
- `Appearance=inverse` → fondo oscuro

---

## Por qué ahora y no en el futuro

Estamos haciendo un rename de la capa semántica que apunta a:
- Eliminar slots vacíos
- Unificar bajo escala
- Renombrar marca

**El desfasaje con `quiet` que en realidad es `inverse` cae dentro del mismo problema.** Si lo dejamos para después, vamos a tener dos rondas de migración. Si lo incluimos ahora, queda todo coherente desde el primer release.

---

## Beneficios

### 1. El nombre comunica el uso
Un diseñador que ve `inverse/medium` sabe inmediatamente que va sobre fondo inverse. No tiene que recordar que `quiet` es la versión "para purple".

### 2. Difícil equivocarse
Aplicar `inverse/medium` sobre un fondo claro es visualmente obvio que está mal (texto blanco sobre fondo blanco). Hoy se aplica `quiet` y "casi se ve" pero no comunica que está mal aplicado.

### 3. Escalable
Si mañana se necesita una variante "más prominente" sobre fondo inverse, ya tiene su slot:
```
inverse/bold → #FFFFFF (blanco puro, máximo contraste)
```
Sin renombrar nada.

### 4. Compatible con dark mode
Cuando se configure el mode Dark en primitivos:
- `default/medium` apuntará a un primitivo claro en dark
- `inverse/medium` apuntará a un primitivo oscuro en dark
Los nombres siguen siendo coherentes en cualquier mode.

### 5. Espacio paralelo para crecer
El slot `inverse` abre un espacio que puede crecer sin afectar la escala normal:
```
interactive/foreground/neutral/inverse/medium       → default sobre inverse
interactive/foreground/brand/main/inverse/medium    → marca con tinte para inverse (futuro)
interactive/foreground/feedback/error/inverse/medium → feedback sobre inverse (futuro)
```

---

## Ejemplo de migración

### Antes

```
interactive/foreground/neutral/default/quiet  → #FCFCFC (mal nombrado)
```

### Después

```
interactive/foreground/neutral/inverse/medium → #FCFCFC (bien nombrado)
```

**Mismo `id`, mismo valor, mismo componente consumidor.** Solo cambia el nombre. Cero cambio visual.

Y queda libre `default/quiet` para su uso real:

```
interactive/foreground/neutral/default/quiet → un gris claro real (apenas visible sobre claro)
```

---

## Tokens afectados (a auditar)

Esta es la lista preliminar de tokens que apuntan a primitivos claros y deberían pasar al slot `inverse`. La auditoría final confirmará uno por uno.

| Token actual | Hex | Token propuesto |
|---|---|---|
| `interactive/foreground/neutral/default/quiet` | `#FCFCFC` | `interactive/foreground/neutral/inverse/medium` |
| `static/foreground/neutral/primary/subtle` | `#FCFCFC` | `static/foreground/neutral/inverse/medium` |
| `interactive/border/neutral/default/subtle` | `#FCFCFC` | revisar — ¿es border inverse o decorativo? |

Tokens en otras categorías que también podrían entrar en `inverse` (a evaluar):
- Foregrounds de feedback que van sobre fondos `feedback/bold`
- Foregrounds que se aplican sobre `brand/main/medium` o `brand/main/bold`

---

## Decisiones tomadas

1. **Slot `inverse` con escala completa propia** (`bold > medium > subtle > quiet`). No es un solo token, es un espacio paralelo a `default`.
2. **El concepto de prominencia es contextual.** `quiet` significa "apenas visible en el contexto", no un valor cromático absoluto.
3. **Se incluye en el rename actual**, no se posterga, porque es el mismo tipo de problema (tokens mal nombrados que se solucionan reorganizando slots).
4. **Cero cambio visual.** Los tokens mantienen su `id` y su valor, solo cambia el nombre.

---

## Pendiente

- [ ] Auditoría completa de tokens claros que están con escala normal y deberían ir a `inverse`
- [ ] Decidir si los foregrounds de feedback que van sobre `feedback/bold` también pasan a `inverse`
- [ ] Actualizar `semantic-restructure.md` con la lista final de renames a `inverse`
- [ ] Actualizar `token-architecture.md` con la sección de "Slot inverse" como parte oficial de la nomenclatura
