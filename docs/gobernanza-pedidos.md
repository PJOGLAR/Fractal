# Plan: Gobernanza de pedidos al Design System

## Visión

Un proceso claro, medible y con bajo esfuerzo para que cualquier UX pueda solicitar cambios, nuevos assets o soporte al equipo de DS, y que el equipo de DS pueda priorizar, resolver y comunicar de forma eficiente.

---

## Canales de entrada

| Situación | Canal |
|---|---|
| Pedido formal (nuevo, iteración, bug) | Formulario `/request` |
| Duda rápida de uso | Ops Therapy 💫 o Slack |
| Propuesta que necesita discusión grupal | Ops Therapy 💫 |
| Issue que afecta a varios equipos | Ops Therapy + Formulario para tracking |

---

## Ops Therapy 💫 (sesión semanal)

Bloque DS dentro de la sesión (15-20 min):

1. **Resoluciones de la semana** — qué se publicó, qué se iteró (2 min)
2. **Pedidos en cola** — qué hay pendiente y prioridades (3 min)
3. **Consultas abiertas** — los equipos traen dudas, validaciones, fricciones (10 min)
4. **Patterns emergentes** — ¿alguien resolvió algo que debería oficializarse? (5 min)

### Flujo combinado

```
Equipo tiene una necesidad
│
├── Es urgente o formal → Completa el FORMULARIO (/request)
│     → DS team lo revisa en la semana
│     → Si necesita discusión → se lleva a Ops Therapy
│
├── Es una duda o validación rápida → Lo trae a OPS THERAPY
│     → Se resuelve en la sesión
│     → Si requiere trabajo → se crea ticket desde ahí
│
└── Es un hallazgo o pattern nuevo → Lo comparte en OPS THERAPY
      → El DS team evalúa si oficializarlo
      → Si sí → se crea pedido interno y se documenta
```

---

## Árbol de decisiones

### Entrada: Pedido al Design System

```
PASO 1 — ¿Qué tipo de consulta es?
├── Nuevo componente/asset
├── Iteración
├── Bug / Inconsistencia
├── Soporte de uso
└── Documentación
```

Si es **Nuevo componente/asset** → se pregunta tipo de asset:
```
├── Componente
├── Ícono
├── Ilustración
├── Brand / Logo
├── Token
└── Otro
```

---

### Flujo: Nuevo componente

```
¿Existe ya un componente en la librería que cumpla esta función?
│
├── SÍ → ¿Cuál es tu situación?
│         │
│         ├── "No sé cómo usarlo" → SOPORTE DE USO
│         │     → Derivar a documentación / sesión con el DS team
│         │     → Registrar como gap de documentación
│         │
│         ├── "Lo usé pero no cubre mi caso exacto" → ITERACIÓN
│         │     → ¿Qué le falta? (variante, prop, estado, contenido)
│         │     → Pedido de modificación con caso de uso concreto
│         │
│         ├── "Lo usé pero tiene un bug o inconsistencia" → REPORTE DE ISSUE
│         │     → Link a la pantalla + descripción del problema
│         │     → Priorizar según impacto (¿afecta a más equipos?)
│         │
│         ├── "Necesito combinarlo de una forma no prevista" → PATTERN / COMPOSICIÓN
│         │     → ¿Otros equipos lo necesitarían igual?
│         │     → Si sí: documentar como pattern oficial
│         │     → Si no: resolver localmente con guía del DS team
│         │
│         └── "No estoy seguro de si es el correcto" → VALIDACIÓN
│               → Revisión rápida con el DS team
│               → Si es correcto: cerrar con guía de uso
│               → Si no: redirigir al flujo de "NO existe"
│
└── NO → ¿Es reutilizable para otras áreas del producto?
          ├── SÍ → Pedido de NUEVO COMPONENTE al DS
          │         → Requisitos para el solicitante:
          │           • Propuesta diseñada en Figma (con tokens del DS aplicados)
          │           • Benchmark: al menos 2-3 referencias de cómo lo resuelven otros productos
          │           • Contexto: pantallas donde se usa + problema que resuelve
          │         → ¿Se puede resolver componiendo componentes existentes?
          │           ├── SÍ → Composición documentada (pattern, no componente nuevo)
          │           └── NO → Componente nuevo (requiere diseño + tokens + doc)
          │
          └── NO → Componente CUSTOM (queda en la tribu, no entra al DS)
                    → Vive en la librería Custom Components (MF)
                    → Requisitos para el solicitante:
                      • Propuesta diseñada en Figma (con tokens del DS aplicados)
                      • Benchmark: al menos 2-3 referencias de cómo lo resuelven otros productos
                      • Contexto: pantalla donde se usa + problema que resuelve
                    → Documentar igualmente para evitar duplicados futuros
```

---

### Flujo: Ícono

```
¿Existe ya un ícono en la librería que represente este concepto?
│
├── SÍ → ¿Funciona para tu caso?
│         ├── SÍ → Fin (usar el existente)
│         └── NO → ¿Es un problema de tamaño/variante o de forma?
│                   ├── Tamaño → Pedido de nueva variante de tamaño
│                   └── Forma → Pedido de nuevo ícono (rediseño)
│
└── NO → ¿El concepto es genérico (lo usarían otros equipos)?
          ├── SÍ → Pedido de NUEVO ÍCONO al DS
          │         → Proveer: contexto de uso, referencia visual, tamaños necesarios
          └── NO → Ícono custom (usar un asset genérico o crear localmente)
```

---

### Flujo: Ilustración

```
¿Existe ya una ilustración que comunique este mensaje?
│
├── SÍ → ¿Funciona para tu caso?
│         ├── SÍ → Fin
│         └── NO → ¿Es un problema de concepto o de estilo?
│                   ├── Estilo → Pedido de ajuste de color/composición
│                   └── Concepto → Pedido de nueva ilustración
│
└── NO → ¿El concepto es genérico o específico de una campaña?
          ├── Genérico → Pedido de NUEVA ILUSTRACIÓN al DS
          │              → Proveer: mensaje a comunicar, pantalla donde va, tono
          └── Campaña/temporal → Crear fuera del DS (no publicar en librería)
```

---

### Flujo: Brand/Logo

```
¿Necesitás agregar una marca nueva a la librería?
│
├── SÍ → Proveer:
│         - Logo en SVG (o PNG alta resolución)
│         - Nombre oficial de la marca (respetar grafía original)
│         - Categoría (billetera, banco, servicio, comercio, transporte, etc.)
│         → Revisión de nomenclatura antes de publicar
│
└── NO → ¿Es una actualización de un logo existente?
          → Proveer: logo nuevo + nombre del componente actual
```

---

## Formulario de solicitud (`/request`)

### Estructura del form (por pasos)

**Paso 1 — Tipo de consulta**
- Nuevo componente/asset
- Iteración
- Bug / Inconsistencia
- Soporte de uso
- Documentación

**Paso 2 — Tipo de asset** (solo si eligió "Nuevo")
- Componente
- Ícono
- Ilustración
- Brand / Logo
- Token
- Otro

**Paso 3 — Solicitante**
- Nombre
- Tribu / Producto

**Paso 4 — Contexto**
- ¿Qué problema estás intentando resolver?
- Pantallas o flujos donde se necesita (links Figma)

**Paso 5 — Investigación previa**
- ☐ ¿Probaste con componentes existentes? → detalle
- ☐ ¿Tenés referencias de otros productos? → links benchmark
- ☐ ¿Tenés una propuesta diseñada? → link Figma

**Paso 6 — Urgencia**
- Alta / Media / Baja

---

## Tracker (`/tracker`)

Vista para el DS team con:
- Cards de métricas: total, pendientes, resueltos, por tipo
- Filtros por estado y tipo de consulta
- Lista de pedidos con detalle expandible
- Selector de estado para marcar resueltos

---

## Plataforma

| Qué | Dónde |
|---|---|
| Form de solicitud | Vercel → `/request` |
| Tracker | Vercel → `/tracker` |
| Storage (ahora) | localStorage |
| Storage (futuro) | Vercel KV, Google Sheets o Supabase |

---

## Métricas de gobernanza

### Volumen y distribución
- Pedidos por mes (tendencia)
- Distribución por tipo de consulta (% nuevo vs iteración vs soporte vs bug)
- Distribución por tipo de asset
- Pedidos por tribu/equipo

### Calidad del sistema
- % de "Soporte de uso" → indica problemas de documentación
- % de "Bug" → indica deuda técnica
- % que terminan en "Custom" → indica gaps en la librería
- Componentes con más iteraciones → candidatos a refactor

### Eficiencia del equipo DS
- Tiempo promedio de resolución
- % resueltos en la misma semana
- Pedidos rechazados y por qué
- Backlog acumulado

### Insights accionables
- "El 40% de los pedidos son soporte → invertir en documentación"
- "El componente Card tiene 8 iteraciones en 2 meses → refactor"
- "La tribu X nunca pidió nada → no usa el DS o no sabe del proceso"
- "Los pedidos de íconos se duplicaron → falta una categoría"

---

## Cómo marcar los resueltos

1. En el tracker: cambiar estado a "Resuelto"
2. Agregar link al componente/asset publicado
3. El changelog automático captura la publicación
4. El solicitante recibe confirmación (futura notificación)

---

## Próximos pasos

1. [x] Definir árbol de decisiones completo
2. [x] Armar formulario `/request`
3. [x] Armar tracker `/tracker`
4. [ ] Deployar y compartir URL con el equipo de UX
5. [ ] Comunicar el proceso en Ops Therapy
6. [ ] Primera semana de uso real → ajustar preguntas si hace falta
7. [ ] Migrar storage a solución persistente (cuando haya Pro)
8. [ ] Integrar métricas al dashboard principal
