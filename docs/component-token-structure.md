# Estructura de Tokens de Componente

## Chip-filter

```
chip-filter/
│
├── background/
│   ├── default              → interactive/background/neutral/default/medium
│   ├── hover                → interactive/background/neutral/hover/medium
│   ├── pressed              → interactive/opacity/brand/pressed
│   ├── selected             → interactive/background/brand/default/medium
│   └── disabled             → interactive/background/neutral/disabled
│
├── foreground/
│   ├── typography/
│   │   ├── sm/
│   │   │   ├── font-size        → caption/sm/semibold/font-size
│   │   │   ├── font-weight      → caption/sm/semibold/font-weight
│   │   │   ├── font-family      → caption/sm/semibold/font-family
│   │   │   ├── line-height      → caption/sm/semibold/line-height
│   │   │   └── letter-spacing   → caption/sm/semibold/letter-spacing
│   │   ├── md/
│   │   │   ├── font-size        → body/sm/semibold/font-size
│   │   │   ├── font-weight      → body/sm/semibold/font-weight
│   │   │   ├── font-family      → body/sm/semibold/font-family
│   │   │   ├── line-height      → body/sm/semibold/line-height
│   │   │   └── letter-spacing   → body/sm/semibold/letter-spacing
│   │   └── lg/
│   │       ├── font-size        → body/md/semibold/font-size
│   │       ├── font-weight      → body/md/semibold/font-weight
│   │       ├── font-family      → body/md/semibold/font-family
│   │       ├── line-height      → body/md/semibold/line-height
│   │       └── letter-spacing   → body/md/semibold/letter-spacing
│   │
│   ├── color/
│   │   ├── default          → static/foreground/neutral/primary/medium
│   │   ├── selected         → static/foreground/neutral/primary/subtle
│   │   └── disabled         → interactive/foreground/neutral/disabled/medium
│   │
│   └── asset/
│       └── icon/
│           ├── size         → icon/sm
│           └── color        → static/foreground/neutral/primary/medium
│
├── border/
│   ├── corner               → border/corner/corner-2000
│   ├── width                → border/width/thin
│   └── color/
│       ├── default          → interactive/border/neutral/default/medium
│       ├── hover            → interactive/border/neutral/hover/medium
│       ├── focus            → interactive/border/brand/main/focus/medium
│       ├── selected         → interactive/border/brand/main/default/medium
│       └── disabled         → interactive/border/neutral/disabled/medium
│
└── spacing/
    ├── gap                  → gap/gap-100
    └── padding/
        ├── sm               → padding/padding-200
        ├── md               → padding/padding-300
        └── lg               → padding/padding-400
```

---

## Button-card

```
button-card/
│
├── background/
│   ├── default              → interactive/background/neutral/default/medium
│   ├── hover                → interactive/background/brand/hover/subtle
│   ├── pressed              → interactive/opacity/brand/pressed
│   ├── focus                → interactive/background/neutral/default/medium
│   └── disabled             → interactive/background/neutral/default/medium
│
├── foreground/
│   ├── typography/
│   │   ├── title/
│   │   │   ├── font-size        → body/md/semibold/font-size
│   │   │   ├── font-weight      → body/md/semibold/font-weight
│   │   │   ├── font-family      → body/md/semibold/font-family
│   │   │   ├── line-height      → body/md/semibold/line-height
│   │   │   └── letter-spacing   → body/md/semibold/letter-spacing
│   │   └── description/
│   │       ├── font-size        → caption/md/medium/font-size
│   │       ├── font-weight      → caption/md/medium/font-weight
│   │       ├── font-family      → caption/md/medium/font-family
│   │       ├── line-height      → caption/md/medium/line-height
│   │       └── letter-spacing   → caption/md/medium/letter-spacing
│   │
│   ├── color/
│   │   ├── title            → static/foreground/neutral/primary/medium
│   │   └── description      → static/foreground/neutral/secondary/medium
│   │
│   └── asset/
│       └── pictogram/
│           ├── size         → pictogram/lg
│           └── color        → static/foreground/brand/main/primary/medium
│
├── border/
│   ├── corner/
│   │   ├── container        → border/corner/corner-300
│   │   └── image            → border/corner/corner-250
│   ├── width                → border/width/thin
│   └── color/
│       ├── default          → interactive/border/neutral/default/medium
│       ├── hover            → interactive/border/brand/main/hover/subtle
│       ├── focus            → interactive/border/brand/main/focus/medium
│       └── disabled         → interactive/border/neutral/disabled/medium
│
└── spacing/
    ├── gap                  → gap/gap-200
    └── padding/
        ├── horizontal       → padding/padding-300
        └── vertical         → padding/padding-400
```

---

## Pill

```
pill/
│
├── background/
│   ├── info                 → static/background/feedback/info/bold
│   ├── success              → static/background/feedback/success/bold
│   ├── warning              → static/background/feedback/warning/bold
│   ├── error                → static/background/feedback/error/bold
│   ├── error-subtle         → static/background/feedback/error/subtle
│   ├── success-subtle       → static/background/feedback/success/subtle
│   ├── warning-subtle       → static/background/feedback/warning/subtle
│   ├── brand                → static/background/brand/main/subtle
│   └── neutral              → static/background/neutral/primary/bold
│
├── foreground/
│   ├── typography/
│   │   ├── font-size            → caption/md/medium/font-size
│   │   ├── font-weight          → caption/md/medium/font-weight
│   │   ├── font-family          → caption/md/medium/font-family
│   │   ├── line-height          → caption/md/medium/line-height
│   │   └── letter-spacing       → caption/md/medium/letter-spacing
│   │
│   └── color/
│       ├── info             → static/foreground/feedback/info
│       ├── success          → static/foreground/feedback/success
│       ├── warning          → static/foreground/feedback/warning
│       ├── error            → static/foreground/feedback/error
│       ├── neutral          → static/foreground/neutral/tertiary/medium
│       └── on-bold          → static/foreground/neutral/primary/subtle
│
├── border/
│   ├── corner               → border/corner/corner-150
│   ├── width                → border/width/thin
│   └── color/
│       ├── info             → static/border/feedback/info
│       ├── success          → static/border/feedback/success
│       ├── warning          → static/border/feedback/warning
│       ├── error            → static/border/feedback/error
│       └── neutral          → static/border/neutral/primary/medium
│
└── spacing/
    ├── gap                  → gap/gap-150
    └── padding              → padding/padding-200
```

---

## Reglas de naming

| Situación | Naming | Ejemplo |
|---|---|---|
| 1 sola tipografía | Directo sin subcarpeta de rol | `pill/foreground/typography/font-size` |
| 2+ tipografías por rol | Subcarpeta por rol | `button-card/foreground/typography/title/font-size` |
| 2+ tipografías por tamaño | Subcarpeta por tamaño | `chip-filter/foreground/typography/sm/font-size` |
| 1 solo corner | Directo | `pill/border/corner` |
| 2+ corners | Subcarpeta por parte | `button-card/border/corner/container` |
| 1 solo padding | Directo | `pill/spacing/padding` |
| 2+ paddings por tamaño | Subcarpeta por tamaño | `chip-filter/spacing/padding/sm` |
| 2+ paddings por dirección | Subcarpeta por dirección | `button-card/spacing/padding/horizontal` |
| Colores por estado | Subcarpeta por estado | `chip-filter/border/color/hover` |
| Colores por variante | Subcarpeta por variante | `pill/background/info` |
