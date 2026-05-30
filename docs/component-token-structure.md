# Estructura de Tokens de Componente

## Regla principal de escalabilidad

> **Siempre usar subcarpeta con nombre de valor, incluso si hoy es 1 solo.**
> Agregar es solo agregar, nunca renombrar.

Esto garantiza que si mañana el componente crece (nuevo tamaño, nuevo estado, nuevo elemento), solo se agrega un token nuevo sin tocar los existentes.

---

## Estructura base

```
[componente]/
├── background/
│   └── [estado o variante]/     ← siempre subcarpeta
├── foreground/
│   ├── typography/
│   │   └── [rol o tamaño]/      ← siempre subcarpeta
│   │       ├── font-size
│   │       ├── font-weight
│   │       ├── font-family
│   │       ├── line-height
│   │       ├── letter-spacing
│   │       └── color
│   └── asset/
│       └── [tipo]/              ← icon, pictogram, illustration
│           ├── color
│           └── size
├── border/
│   ├── corner/
│   │   └── [parte]/            ← container, image, indicator
│   ├── width/
│   │   └── [nombre]/           ← default, thick, etc.
│   └── color/
│       └── [estado]/           ← default, hover, focus, etc.
└── spacing/
    ├── padding/
    │   └── [dirección o tamaño]/ ← horizontal, vertical, sm, md, lg
    └── gap/
        └── [nombre]/            ← default, items, sections
```

---

## Ejemplo: Chip-filter

```
chip-filter/
│
├── background/
│   ├── default/             → interactive/background/neutral/default/medium
│   ├── hover/               → interactive/background/neutral/hover/medium
│   ├── pressed/             → interactive/opacity/brand/pressed
│   ├── selected/            → interactive/background/brand/default/medium
│   └── disabled/            → interactive/background/neutral/disabled
│
├── foreground/
│   ├── typography/
│   │   ├── sm/
│   │   │   ├── font-size        → caption/sm/semibold/font-size
│   │   │   ├── font-weight      → caption/sm/semibold/font-weight
│   │   │   ├── font-family      → caption/sm/semibold/font-family
│   │   │   ├── line-height      → caption/sm/semibold/line-height
│   │   │   ├── letter-spacing   → caption/sm/semibold/letter-spacing
│   │   │   └── color            → static/foreground/neutral/primary/medium
│   │   ├── md/
│   │   │   ├── font-size        → body/sm/semibold/font-size
│   │   │   ├── font-weight      → body/sm/semibold/font-weight
│   │   │   ├── font-family      → body/sm/semibold/font-family
│   │   │   ├── line-height      → body/sm/semibold/line-height
│   │   │   ├── letter-spacing   → body/sm/semibold/letter-spacing
│   │   │   └── color            → static/foreground/neutral/primary/medium
│   │   └── lg/
│   │       ├── font-size        → body/md/semibold/font-size
│   │       ├── font-weight      → body/md/semibold/font-weight
│   │       ├── font-family      → body/md/semibold/font-family
│   │       ├── line-height      → body/md/semibold/line-height
│   │       ├── letter-spacing   → body/md/semibold/letter-spacing
│   │       └── color            → static/foreground/neutral/primary/medium
│   │
│   └── asset/
│       └── icon/
│           ├── size             → icon/sm
│           └── color            → static/foreground/neutral/primary/medium
│
├── border/
│   ├── corner/
│   │   └── container/           → border/corner/corner-2000
│   ├── width/
│   │   └── default/             → border/width/thin
│   └── color/
│       ├── default/             → interactive/border/neutral/default/medium
│       ├── hover/               → interactive/border/neutral/hover/medium
│       ├── focus/               → interactive/border/brand/main/focus/medium
│       ├── selected/            → interactive/border/brand/main/default/medium
│       └── disabled/            → interactive/border/neutral/disabled/medium
│
└── spacing/
    ├── padding/
    │   ├── sm/                  → padding/padding-200
    │   ├── md/                  → padding/padding-300
    │   └── lg/                  → padding/padding-400
    └── gap/
        └── default/             → gap/gap-100
```

**Si mañana se agrega un tamaño xl:**
```
chip-filter/foreground/typography/xl/font-size   ← solo se agrega
chip-filter/spacing/padding/xl/                  ← solo se agrega
```
No se toca nada existente.

---

## Ejemplo: Button-card

```
button-card/
│
├── background/
│   ├── default/             → interactive/background/neutral/default/medium
│   ├── hover/               → interactive/background/brand/hover/subtle
│   ├── pressed/             → interactive/opacity/brand/pressed
│   ├── focus/               → interactive/background/neutral/default/medium
│   └── disabled/            → interactive/background/neutral/default/medium
│
├── foreground/
│   ├── typography/
│   │   ├── title/
│   │   │   ├── font-size        → body/md/semibold/font-size
│   │   │   ├── font-weight      → body/md/semibold/font-weight
│   │   │   ├── font-family      → body/md/semibold/font-family
│   │   │   ├── line-height      → body/md/semibold/line-height
│   │   │   ├── letter-spacing   → body/md/semibold/letter-spacing
│   │   │   └── color            → static/foreground/neutral/primary/medium
│   │   └── description/
│   │       ├── font-size        → caption/md/medium/font-size
│   │       ├── font-weight      → caption/md/medium/font-weight
│   │       ├── font-family      → caption/md/medium/font-family
│   │       ├── line-height      → caption/md/medium/line-height
│   │       ├── letter-spacing   → caption/md/medium/letter-spacing
│   │       └── color            → static/foreground/neutral/secondary/medium
│   │
│   └── asset/
│       └── pictogram/
│           ├── size             → pictogram/lg
│           └── color            → static/foreground/brand/main/primary/medium
│
├── border/
│   ├── corner/
│   │   ├── container/           → border/corner/corner-300
│   │   └── image/               → border/corner/corner-250
│   ├── width/
│   │   └── default/             → border/width/thin
│   └── color/
│       ├── default/             → interactive/border/neutral/default/medium
│       ├── hover/               → interactive/border/brand/main/hover/subtle
│       ├── focus/               → interactive/border/brand/main/focus/medium
│       └── disabled/            → interactive/border/neutral/disabled/medium
│
└── spacing/
    ├── padding/
    │   ├── horizontal/          → padding/padding-300
    │   └── vertical/            → padding/padding-400
    └── gap/
        └── default/             → gap/gap-200
```

---

## Ejemplo: Pill

```
pill/
│
├── background/
│   ├── info/                → static/background/feedback/info/bold
│   ├── success/             → static/background/feedback/success/bold
│   ├── warning/             → static/background/feedback/warning/bold
│   ├── error/               → static/background/feedback/error/bold
│   ├── error-subtle/        → static/background/feedback/error/subtle
│   ├── success-subtle/      → static/background/feedback/success/subtle
│   ├── warning-subtle/      → static/background/feedback/warning/subtle
│   ├── brand/               → static/background/brand/main/subtle
│   └── neutral/             → static/background/neutral/primary/bold
│
├── foreground/
│   ├── typography/
│   │   └── label/
│   │       ├── font-size        → caption/md/medium/font-size
│   │       ├── font-weight      → caption/md/medium/font-weight
│   │       ├── font-family      → caption/md/medium/font-family
│   │       ├── line-height      → caption/md/medium/line-height
│   │       ├── letter-spacing   → caption/md/medium/letter-spacing
│   │       └── color/
│   │           ├── info         → static/foreground/feedback/info
│   │           ├── success      → static/foreground/feedback/success
│   │           ├── warning      → static/foreground/feedback/warning
│   │           ├── error        → static/foreground/feedback/error
│   │           ├── neutral      → static/foreground/neutral/tertiary/medium
│   │           └── on-bold      → static/foreground/neutral/primary/subtle
│   │
│   └── asset/
│       └── icon/
│           └── size             → icon/sm
│
├── border/
│   ├── corner/
│   │   └── default/             → border/corner/corner-150
│   ├── width/
│   │   └── default/             → border/width/thin
│   └── color/
│       ├── info/                → static/border/feedback/info
│       ├── success/             → static/border/feedback/success
│       ├── warning/             → static/border/feedback/warning
│       ├── error/               → static/border/feedback/error
│       └── neutral/             → static/border/neutral/primary/medium
│
└── spacing/
    ├── padding/
    │   └── default/             → padding/padding-200
    └── gap/
        └── default/             → gap/gap-150
```

---

## Reglas de naming

| Regla | Descripción |
|---|---|
| **Siempre subcarpeta** | Incluso con 1 solo valor, usar subcarpeta con nombre descriptivo |
| **Nombre por rol** | typography: title, description, label, counter |
| **Nombre por tamaño** | Cuando el mismo rol varía por size: sm, md, lg |
| **Nombre por estado** | background/border: default, hover, pressed, focus, disabled |
| **Nombre por variante** | Cuando hay variantes semánticas: info, success, error, brand |
| **Nombre por parte** | corner: container, image, indicator |
| **Nombre por dirección** | padding: horizontal, vertical |
| **`default` como fallback** | Cuando hay 1 solo valor y no hay nombre más descriptivo |

### ¿Por qué siempre subcarpeta?

```
❌ Antes (no escalable):
  border/corner              ← si mañana agrego otro, tengo que renombrar

✅ Ahora (escalable):
  border/corner/container    ← si mañana agrego otro, solo agrego
  border/corner/image        ← nuevo, sin tocar el anterior
```

### Orden de carpetas:
1. background
2. foreground
3. border
4. spacing
5. asset
