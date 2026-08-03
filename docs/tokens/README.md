# Tokens — Fractal DS

Documentación de la librería **Foundations** y de cómo se aplican sus tokens en el sistema.

Datos de la extracción del **3-ago-2026**: Foundations (818 variables), Components (137), Templates (15), Custom (8).

---

## Documentos

| | Qué contiene | Para qué |
|---|---|---|
| **[semanticos.md](./semanticos.md)** | Qué es Foundations, cómo alimenta al resto, anatomía de los nombres y el uso real de cada token inferido de dónde está aplicado | Entender el sistema y elegir el token correcto |
| **[catalogo.md](./catalogo.md)** | Las 494 variables semánticas con su primitivo y valor final resuelto, por colección | Consultar un valor o buscar el token de un color |
| **[auditoria-tokens.md](./auditoria-tokens.md)** | Estado verificado del sistema y observaciones abiertas | Saber qué está pendiente y qué ya se descartó |

---

## Estado en una línea

**El sistema está sano.** Los 322 tokens aplicados resuelven a una variable existente y a un valor correcto. Cero bindings rotos.

Lo que queda abierto: 29 colores sin token (26 son blanco puro, que no existe en el sistema), 18 nombres desactualizados en cache de librería, y 20 variables cuyo archivo de origen falta identificar. Detalle en la [auditoría](./auditoria-tokens.md).

---

## ⚠️ Antes de reportar un problema de tokens

> Esta sección existe porque una auditoría anterior reportó 26 problemas de los cuales **24 no existían**. Revisar estas cuatro cosas ahorra el trabajo de investigar algo que está bien.

### 1. Que dos tokens compartan el mismo color NO es un problema

Es el propósito de la capa semántica. `core/purple/500` alimenta legítimamente a cuatro tokens distintos:

```
core/purple/500
├── interactive/border/brand/primary/default/medium
├── interactive/border/brand/primary/focus/medium
├── interactive/background/brand/default/medium
└── static/foreground/brand/primary/medium
```

Cada nombre describe un contexto o estado distinto y puede evolucionar por separado. El día que el focus tenga que ser más oscuro, se cambia solo ese token sin tocar los otros tres.

**Lo que importa es la dirección:**

| Estructura | Lectura |
|---|---|
| **dos** semánticos → **un** primitivo | ✅ Correcto por diseño |
| **un** semántico → **dos** variables | ⚠️ Duplicación, revisar |

### 2. Que `focus` y `default` tengan el mismo color no significa que el foco sea invisible

El cambio de estado puede resolverse con una capa de overlay, un stroke adicional, un cambio de weight o de posición. En este sistema ese mecanismo existe: los tokens de `interactive/opacity` se aplican en capas llamadas `Hover layer`, `Pressed layer` y `Disabled layer`.

Verificarlo requiere abrir el componente. No se puede concluir desde la tabla de tokens.

### 3. Un token que "no existe" probablemente sea un nombre viejo

Los archivos consumidores guardan el **nombre** que tenía la variable al momento del binding, hasta que se refresca la librería. El `key` en cambio no cambia nunca.

```
key b5a951495b65…
  Foundations dice : interactive/border/brand/primary/focus/medium
  bindings dicen   : primary/focus/medium · main/focus/medium · focus · focus-medium
                     ↑ los cuatro son LA MISMA variable, bien aplicada
```

**Antes de reportar un token como inexistente:** buscar su `key` entre las variables de Foundations. Si aparece con otro nombre, es cache desactualizado. Se arregla refrescando la librería, sin tocar un solo binding.

Renames conocidos que todavía circulan como nombre viejo:

| Nombre viejo | Nombre actual |
|---|---|
| `main/*` | `primary/*` |
| `tertiary-subtle` · `tertiary/subtle` | `subtle` |
| `secondary` · `secondary/medium` | `bold` |
| `illustration/purple/*` | `illustration/violet/*` |

### 4. Descontar los componentes placeholder antes de contar usos

`Swap-content` es un slot de documentación anidado en 16 componentes, con bindings idénticos en todos. Aporta 68 de los 120 usos de un token sin representar 68 decisiones ni llegar a producción.

Antes de dimensionar cualquier trabajo, desglosar por `layerName` y separar los placeholders.

---

## Orden de verificación

```
1. ¿El key existe en Foundations?
     sí, con otro nombre  → cache desactualizado, NO es un problema
     sí, mismo nombre     → está bien aplicado
     no                   → seguir en 2

2. ¿Existe en otra colección o librería?
     sí  → verificar el origen antes de clasificar
     no  → binding roto (esto sí es un problema)

3. ¿Cuántos de esos usos vienen de placeholders?
     → descontarlos del total

4. ¿Se aplica a las mismas propiedades que su equivalente?
     sí  → duplicación
     no  → posiblemente sean semánticas distintas, verificar en el componente
```

**Regla cero:** si no se puede determinar el origen o la intención de un token, el hallazgo es *pendiente de verificar*, no *deuda*. Presentar el hecho y dejar la clasificación abierta.

---

## Herramientas

Los tres documentos se apoyan en scripts que se pueden volver a correr con cada extracción nueva:

```bash
node scripts/audit-tokens.js            # aplica el orden de verificación de arriba
node scripts/analyze-token-usage.js     # dónde se aplica cada token (usos, componentes, capas)
node scripts/generate-token-catalog.js  # regenera catalogo.md
```

El plugin **DS Extractor** genera los datos. Desde esta revisión captura también el archivo de origen de cada variable (`foundations.libraries` en el output), que es lo que faltaba para cerrar la observación de las 20 variables.
