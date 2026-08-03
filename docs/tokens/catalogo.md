# Catálogo de tokens semánticos

> Todas las variables de las colecciones semánticas de Foundations, con su primitivo y valor final resuelto.
>
> Extracción del 3-ago-2026 · 494 variables en 7 colecciones

Guía de uso en **[semanticos.md](./semanticos.md)** · estado del sistema en **[auditoria-tokens.md](./auditoria-tokens.md)**

## Índice

- [Color](#color) — 253 variables
- [Typography](#typography) — 160 variables
- [Spacing](#spacing) — 48 variables
- [Border](#border) — 15 variables
- [Asset](#asset) — 15 variables
- [Screen size](#screen-size) — 2 variables
- [Density mode](#density-mode) — 1 variable

---

## Color

253 variables. El valor es el hex final tras resolver la cadena de alias.

### static/background (15)

| Token | Primitivo | Valor |
|---|---|---|
| `static/background/brand/primary/medium` | `core/purple/500` | #5A50F9 |
| `static/background/brand/primary/quiet` | `core/purple/50` | #EEF2FF |
| `static/background/brand/primary/subtle` | `core/purple/100` | #E0E4F5 |
| `static/background/brand/secondary/medium` | `core/cyan/600` | #0076C7 |
| `static/background/brand/secondary/subtle` | `core/cyan/100` | #C8EEFF |
| `static/background/feedback/error/bold` | `core/red/700` | #B91C1C |
| `static/background/feedback/error/quiet` | `core/red/50` | #FEF2F2 |
| `static/background/feedback/info/bold` | `core/blue/700` | #1D4ED8 |
| `static/background/feedback/info/quiet` | `core/blue/50` | #EFF6FF |
| `static/background/feedback/success/bold` | `core/green/700` | #15803D |
| `static/background/feedback/success/quiet` | `core/green/50` | #F0FDF4 |
| `static/background/feedback/warning/bold` | `core/orange/700` | #C2410C |
| `static/background/feedback/warning/quiet` | `core/orange/50` | #FFF7ED |
| `static/background/neutral/bold` | `core/neutral/700` | #525252 |
| `static/background/neutral/quiet` | `core/neutral/25` | #FCFCFC |

### static/border (9)

| Token | Primitivo | Valor |
|---|---|---|
| `static/border/brand/primary` | `core/purple/500` | #5A50F9 |
| `static/border/brand/secondary` | `core/purple/200` | #C7D2FE |
| `static/border/feedback/error/bold` | `core/red/700` | #B91C1C |
| `static/border/feedback/info/bold` | `core/blue/700` | #1D4ED8 |
| `static/border/feedback/success/bold` | `core/green/700` | #15803D |
| `static/border/feedback/warning/bold` | `core/orange/700` | #C2410C |
| `static/border/neutral/medium` | `core/neutral/600` | #676767 |
| `static/border/neutral/quiet` | `core/neutral/25` | #FCFCFC |
| `static/border/neutral/subtle` | `core/neutral/400` | #A9A9A9 |

### static/foreground (11)

| Token | Primitivo | Valor |
|---|---|---|
| `static/foreground/brand/primary/bold` | `core/purple/900` | #312E81 |
| `static/foreground/brand/primary/medium` | `core/purple/500` | #5A50F9 |
| `static/foreground/feedback/error/bold` | `core/red/700` | #B91C1C |
| `static/foreground/feedback/info/bold` | `core/blue/700` | #1D4ED8 |
| `static/foreground/feedback/success/bold` | `core/green/700` | #15803D |
| `static/foreground/feedback/warning/bold` | `core/orange/700` | #C2410C |
| `static/foreground/neutral/bold` | `core/neutral/800` | #404040 |
| `static/foreground/neutral/medium` | `core/neutral/600` | #676767 |
| `static/foreground/neutral/quiet` | `core/neutral/25` | #FCFCFC |
| `static/foreground/neutral/strong` | `core/neutral/950` | #171717 |
| `static/foreground/neutral/subtle` | `core/neutral/400` | #A9A9A9 |

### static/opacity (3)

| Token | Primitivo | Valor |
|---|---|---|
| `static/opacity/brand/bold` | `opacity/purple/800` | #3730A366 |
| `static/opacity/brand/medium` | `opacity/purple/600` | #4F46E533 |
| `static/opacity/neutral/subtle` | `opacity/gray/400` | #A9A9A933 |

### interactive/background (12)

| Token | Primitivo | Valor |
|---|---|---|
| `interactive/background/brand/default/bold` | `core/purple/700` | #4338CA |
| `interactive/background/brand/default/medium` | `core/purple/500` | #5A50F9 |
| `interactive/background/brand/default/quiet` | `core/purple/50` | #EEF2FF |
| `interactive/background/brand/default/subtle` | `core/purple/100` | #E0E4F5 |
| `interactive/background/brand/hover/bold` | `core/purple/700` | #4338CA |
| `interactive/background/brand/hover/quiet` | `core/purple/50` | #EEF2FF |
| `interactive/background/brand/pressed/bold` | `core/purple/900` | #312E81 |
| `interactive/background/brand/pressed/subtle` | `core/purple/300` | #A5B4FC |
| `interactive/background/neutral/default/quiet` | `core/neutral/25` | #FCFCFC |
| `interactive/background/neutral/disabled/subtle` | `core/neutral/100` | #EBEBEB |
| `interactive/background/neutral/hover/bold` | `core/neutral/700` | #525252 |
| `interactive/background/neutral/hover/subtle` | `core/neutral/100` | #EBEBEB |

### interactive/border (15)

| Token | Primitivo | Valor |
|---|---|---|
| `interactive/border/brand/primary/default/medium` | `core/purple/500` | #5A50F9 |
| `interactive/border/brand/primary/default/subtle` | `core/purple/200` | #C7D2FE |
| `interactive/border/brand/primary/focus/medium` | `core/purple/500` | #5A50F9 |
| `interactive/border/brand/primary/focus/subtle` | `core/purple/100` | #E0E4F5 |
| `interactive/border/brand/primary/hover/bold` | `core/purple/900` | #312E81 |
| `interactive/border/brand/primary/hover/subtle` | `core/purple/200` | #C7D2FE |
| `interactive/border/brand/primary/pressed/bold` | `core/purple/900` | #312E81 |
| `interactive/border/brand/primary/pressed/subtle` | `core/purple/200` | #C7D2FE |
| `interactive/border/brand/secondary/active/medium` | `core/cyan/500` | #199AE0 |
| `interactive/border/feedback/error/bold` | `core/red/700` | #B91C1C |
| `interactive/border/feedback/error/subtle` | `core/red/200` | #FFC7C7 |
| `interactive/border/neutral/default/medium` | `core/neutral/600` | #676767 |
| `interactive/border/neutral/default/quiet` | `core/neutral/25` | #FCFCFC |
| `interactive/border/neutral/disabled/subtle` | `core/neutral/400` | #A9A9A9 |
| `interactive/border/neutral/hover/bold` | `core/neutral/700` | #525252 |

### interactive/foreground (11)

| Token | Primitivo | Valor |
|---|---|---|
| `interactive/foreground/brand/primary/default/bold` | `core/purple/900` | #312E81 |
| `interactive/foreground/brand/primary/default/medium` | `core/purple/500` | #5A50F9 |
| `interactive/foreground/brand/primary/pressed/bold` | `core/purple/900` | #312E81 |
| `interactive/foreground/brand/secondary/default/bold` | `core/cyan/900` | #052C50 |
| `interactive/foreground/brand/secondary/default/medium` | `core/cyan/600` | #0076C7 |
| `interactive/foreground/neutral/default/medium` | `core/neutral/600` | #676767 |
| `interactive/foreground/neutral/default/quiet` | `core/neutral/25` | #FCFCFC |
| `interactive/foreground/neutral/default/strong` | `core/neutral/950` | #171717 |
| `interactive/foreground/neutral/disabled/bold` | `core/neutral/800` | #404040 |
| `interactive/foreground/neutral/disabled/subtle` | `core/neutral/400` | #A9A9A9 |
| `interactive/foreground/neutral/hover/medium` | `core/neutral/600` | #676767 |

### interactive/opacity (5)

| Token | Primitivo | Valor |
|---|---|---|
| `interactive/opacity/brand/hover` | `opacity/purple/700` | #4338CA33 |
| `interactive/opacity/brand/pressed` | `opacity/purple/900` | #312E8133 |
| `interactive/opacity/neutral/default/bold` | `opacity/gray/900` | #262626B2 |
| `interactive/opacity/neutral/default/medium` | `opacity/gray/500` | #85858533 |
| `interactive/opacity/neutral/disabled` | `opacity/gray/50` | #F5F5F580 |

### expressive (132)

| Token | Primitivo | Valor |
|---|---|---|
| `expressive/amber/100` | `expressive/amber/100` | #FEEFC7 |
| `expressive/amber/200` | `expressive/amber/200` | #FDDD8A |
| `expressive/amber/300` | `expressive/amber/300` | #FCC54D |
| `expressive/amber/400` | `expressive/amber/400` | #FBAE24 |
| `expressive/amber/50` | `expressive/amber/50` | #FFF8E6 |
| `expressive/amber/500` | `expressive/amber/500` | #F58B0B |
| `expressive/amber/600` | `expressive/amber/600` | #D96606 |
| `expressive/amber/700` | `expressive/amber/700` | #B44509 |
| `expressive/amber/800` | `expressive/amber/800` | #92350E |
| `expressive/amber/900` | `expressive/amber/900` | #782D0F |
| `expressive/amber/950` | `expressive/amber/950` | #451503 |
| `expressive/bourbon/100` | `expressive/bourbon/100` | #F6EBCB |
| `expressive/bourbon/200` | `expressive/bourbon/200` | #EED59A |
| `expressive/bourbon/300` | `expressive/bourbon/300` | #E4B860 |
| `expressive/bourbon/400` | `expressive/bourbon/400` | #DA9C35 |
| `expressive/bourbon/50` | `expressive/bourbon/50` | #FBF7EB |
| `expressive/bourbon/500` | `expressive/bourbon/500` | #CB8627 |
| `expressive/bourbon/600` | `expressive/bourbon/600` | #B76C21 |
| `expressive/bourbon/700` | `expressive/bourbon/700` | #8C4A1C |
| `expressive/bourbon/800` | `expressive/bourbon/800` | #743D1F |
| `expressive/bourbon/900` | `expressive/bourbon/900` | #64331F |
| `expressive/bourbon/950` | `expressive/bourbon/950` | #3A190E |
| `expressive/coral/100` | `expressive/coral/100` | #FFE1E3 |
| `expressive/coral/200` | `expressive/coral/200` | #FFC8CB |
| `expressive/coral/300` | `expressive/coral/300` | #FF9DA3 |
| `expressive/coral/400` | `expressive/coral/400` | #FD6C75 |
| `expressive/coral/50` | `expressive/coral/50` | #FEF2F3 |
| `expressive/coral/500` | `expressive/coral/500` | #F53E49 |
| `expressive/coral/600` | `expressive/coral/600` | #E2202C |
| `expressive/coral/700` | `expressive/coral/700` | #BE1721 |
| `expressive/coral/800` | `expressive/coral/800` | #9D171F |
| `expressive/coral/900` | `expressive/coral/900` | #821A20 |
| `expressive/coral/950` | `expressive/coral/950` | #47080C |
| `expressive/emerald/100` | `expressive/emerald/100` | #D2F9DD |
| `expressive/emerald/200` | `expressive/emerald/200` | #A8F2C0 |
| `expressive/emerald/300` | `expressive/emerald/300` | #70E59E |
| `expressive/emerald/400` | `expressive/emerald/400` | #36D178 |
| `expressive/emerald/50` | `expressive/emerald/50` | #E6FCED |
| `expressive/emerald/500` | `expressive/emerald/500` | #12B75D |
| `expressive/emerald/600` | `expressive/emerald/600` | #07944A |
| `expressive/emerald/700` | `expressive/emerald/700` | #06763E |
| `expressive/emerald/800` | `expressive/emerald/800` | #075E33 |
| `expressive/emerald/900` | `expressive/emerald/900` | #074D2C |
| `expressive/emerald/950` | `expressive/emerald/950` | #032B19 |
| `expressive/iron/100` | `expressive/iron/100` | #F5F5F5 |
| `expressive/iron/200` | `expressive/iron/200` | #E6E6E6 |
| `expressive/iron/300` | `expressive/iron/300` | #CFCFCF |
| `expressive/iron/400` | `expressive/iron/400` | #A3A3A3 |
| `expressive/iron/50` | `expressive/iron/50` | #FAFAFA |
| `expressive/iron/500` | `expressive/iron/500` | #727272 |
| `expressive/iron/600` | `expressive/iron/600` | #535353 |
| `expressive/iron/700` | `expressive/iron/700` | #404040 |
| `expressive/iron/800` | `expressive/iron/800` | #272727 |
| `expressive/iron/900` | `expressive/iron/900` | #1A1A1A |
| `expressive/iron/950` | `expressive/iron/950` | #0B0B0B |
| `expressive/lavender/100` | `expressive/lavender/100` | #EEE8FF |
| `expressive/lavender/200` | `expressive/lavender/200` | #DFD5FF |
| `expressive/lavender/300` | `expressive/lavender/300` | #C7B3FF |
| `expressive/lavender/400` | `expressive/lavender/400` | #AC88FD |
| `expressive/lavender/50` | `expressive/lavender/50` | #F6F3FF |
| `expressive/lavender/500` | `expressive/lavender/500` | #9358FA |
| `expressive/lavender/600` | `expressive/lavender/600` | #8535F2 |
| `expressive/lavender/700` | `expressive/lavender/700` | #7623DE |
| `expressive/lavender/800` | `expressive/lavender/800` | #631DBA |
| `expressive/lavender/900` | `expressive/lavender/900` | #521A98 |
| `expressive/lavender/950` | `expressive/lavender/950` | #320E67 |
| `expressive/magenta/100` | `expressive/magenta/100` | #FEE9FE |
| `expressive/magenta/200` | `expressive/magenta/200` | #FDD1FC |
| `expressive/magenta/300` | `expressive/magenta/300` | #FAADF5 |
| `expressive/magenta/400` | `expressive/magenta/400` | #F67CEC |
| `expressive/magenta/50` | `expressive/magenta/50` | #FFF4FF |
| `expressive/magenta/500` | `expressive/magenta/500` | #EA4BDC |
| `expressive/magenta/600` | `expressive/magenta/600` | #CE2BBC |
| `expressive/magenta/700` | `expressive/magenta/700` | #AB2099 |
| `expressive/magenta/800` | `expressive/magenta/800` | #8C1C7C |
| `expressive/magenta/900` | `expressive/magenta/900` | #731C65 |
| `expressive/magenta/950` | `expressive/magenta/950` | #4C0641 |
| `expressive/melon/100` | `expressive/melon/100` | #FBE7E5 |
| `expressive/melon/200` | `expressive/melon/200` | #F9D3CF |
| `expressive/melon/300` | `expressive/melon/300` | #F4B6B0 |
| `expressive/melon/400` | `expressive/melon/400` | #EB887E |
| `expressive/melon/50` | `expressive/melon/50` | #FDF4F3 |
| `expressive/melon/500` | `expressive/melon/500` | #DF6054 |
| `expressive/melon/600` | `expressive/melon/600` | #CA4538 |
| `expressive/melon/700` | `expressive/melon/700` | #AA362B |
| `expressive/melon/800` | `expressive/melon/800` | #8D3027 |
| `expressive/melon/900` | `expressive/melon/900` | #762D26 |
| `expressive/melon/950` | `expressive/melon/950` | #3F1410 |
| `expressive/pink/100` | `expressive/pink/100` | #FCE7F3 |
| `expressive/pink/200` | `expressive/pink/200` | #FBCFE8 |
| `expressive/pink/300` | `expressive/pink/300` | #F9A8D4 |
| `expressive/pink/400` | `expressive/pink/400` | #F472B6 |
| `expressive/pink/50` | `expressive/pink/50` | #FDF2F8 |
| `expressive/pink/500` | `expressive/pink/500` | #EC4899 |
| `expressive/pink/600` | `expressive/pink/600` | #DB2777 |
| `expressive/pink/700` | `expressive/pink/700` | #BE185D |
| `expressive/pink/800` | `expressive/pink/800` | #9D174D |
| `expressive/pink/900` | `expressive/pink/900` | #831843 |
| `expressive/pink/950` | `expressive/pink/950` | #500724 |
| `expressive/sapphire/100` | `expressive/sapphire/100` | #C8EEFF |
| `expressive/sapphire/200` | `expressive/sapphire/200` | #94DEFF |
| `expressive/sapphire/300` | `expressive/sapphire/300` | #4EC5FF |
| `expressive/sapphire/400` | `expressive/sapphire/400` | #1EB2F5 |
| `expressive/sapphire/50` | `expressive/sapphire/50` | #E8F8FF |
| `expressive/sapphire/500` | `expressive/sapphire/500` | #199AE0 |
| `expressive/sapphire/600` | `expressive/sapphire/600` | #0076C7 |
| `expressive/sapphire/700` | `expressive/sapphire/700` | #015FB2 |
| `expressive/sapphire/800` | `expressive/sapphire/800` | #084D8B |
| `expressive/sapphire/900` | `expressive/sapphire/900` | #0C3E6E |
| `expressive/sapphire/950` | `expressive/sapphire/950` | #082749 |
| `expressive/teal/100` | `expressive/teal/100` | #CEF9F5 |
| `expressive/teal/200` | `expressive/teal/200` | #9EF1EA |
| `expressive/teal/300` | `expressive/teal/300` | #65E3DD |
| `expressive/teal/400` | `expressive/teal/400` | #35CCCA |
| `expressive/teal/50` | `expressive/teal/50` | #F1FCFB |
| `expressive/teal/500` | `expressive/teal/500` | #1CB0B0 |
| `expressive/teal/600` | `expressive/teal/600` | #148A8D |
| `expressive/teal/700` | `expressive/teal/700` | #146E71 |
| `expressive/teal/800` | `expressive/teal/800` | #15575A |
| `expressive/teal/900` | `expressive/teal/900` | #16494B |
| `expressive/teal/950` | `expressive/teal/950` | #062A2D |
| `expressive/violet/100` | `expressive/violet/100` | #E0E4F5 |
| `expressive/violet/200` | `expressive/violet/200` | #C7D2FE |
| `expressive/violet/300` | `expressive/violet/300` | #A5B4FC |
| `expressive/violet/400` | `expressive/violet/400` | #818CF8 |
| `expressive/violet/50` | `expressive/violet/50` | #EEF2FF |
| `expressive/violet/500` | `expressive/violet/500` | #5A50F9 |
| `expressive/violet/600` | `expressive/violet/600` | #4F46E5 |
| `expressive/violet/700` | `expressive/violet/700` | #4338CA |
| `expressive/violet/800` | `expressive/violet/800` | #3730A3 |
| `expressive/violet/900` | `expressive/violet/900` | #312E81 |
| `expressive/violet/950` | `expressive/violet/950` | #1E1B4B |

### expressive/illustration (40)

| Token | Primitivo | Valor |
|---|---|---|
| `expressive/illustration/amber/bold` | `expressive/amber/900` | #782D0F |
| `expressive/illustration/amber/medium` | `expressive/amber/500` | #F58B0B |
| `expressive/illustration/amber/quiet` | `expressive/amber/50` | #FFF8E6 |
| `expressive/illustration/amber/subtle` | `expressive/amber/200` | #FDDD8A |
| `expressive/illustration/bourbon/bold` | `expressive/bourbon/500` | #CB8627 |
| `expressive/illustration/bourbon/medium` | `expressive/bourbon/300` | #E4B860 |
| `expressive/illustration/bourbon/quiet` | `expressive/bourbon/50` | #FBF7EB |
| `expressive/illustration/bourbon/subtle` | `expressive/bourbon/200` | #EED59A |
| `expressive/illustration/coral/bold` | `expressive/coral/800` | #9D171F |
| `expressive/illustration/coral/medium` | `expressive/coral/600` | #E2202C |
| `expressive/illustration/coral/quiet` | `expressive/coral/50` | #FEF2F3 |
| `expressive/illustration/coral/subtle` | `expressive/coral/200` | #FFC8CB |
| `expressive/illustration/emerald/bold` | `expressive/emerald/700` | #06763E |
| `expressive/illustration/emerald/medium` | `expressive/emerald/400` | #36D178 |
| `expressive/illustration/emerald/quiet` | `expressive/emerald/50` | #E6FCED |
| `expressive/illustration/emerald/subtle` | `expressive/emerald/100` | #D2F9DD |
| `expressive/illustration/lavender/bold` | `expressive/lavender/900` | #521A98 |
| `expressive/illustration/lavender/medium` | `expressive/lavender/500` | #9358FA |
| `expressive/illustration/lavender/quiet` | `expressive/lavender/50` | #F6F3FF |
| `expressive/illustration/lavender/subtle` | `expressive/lavender/300` | #C7B3FF |
| `expressive/illustration/magenta/bold` | `expressive/magenta/900` | #731C65 |
| `expressive/illustration/magenta/medium` | `expressive/magenta/500` | #EA4BDC |
| `expressive/illustration/magenta/quiet` | `expressive/magenta/50` | #FFF4FF |
| `expressive/illustration/magenta/subtle` | `expressive/magenta/100` | #FEE9FE |
| `expressive/illustration/melon/bold` | `expressive/melon/400` | #EB887E |
| `expressive/illustration/melon/medium` | `expressive/melon/300` | #F4B6B0 |
| `expressive/illustration/melon/quiet` | `expressive/melon/50` | #FDF4F3 |
| `expressive/illustration/melon/subtle` | `expressive/melon/200` | #F9D3CF |
| `expressive/illustration/sapphire/bold` | `expressive/sapphire/950` | #082749 |
| `expressive/illustration/sapphire/medium` | `expressive/sapphire/400` | #1EB2F5 |
| `expressive/illustration/sapphire/quiet` | `expressive/sapphire/50` | #E8F8FF |
| `expressive/illustration/sapphire/subtle` | `expressive/sapphire/100` | #C8EEFF |
| `expressive/illustration/teal/bold` | `expressive/teal/900` | #16494B |
| `expressive/illustration/teal/medium` | `expressive/teal/400` | #35CCCA |
| `expressive/illustration/teal/quiet` | `expressive/teal/50` | #F1FCFB |
| `expressive/illustration/teal/subtle` | `expressive/teal/200` | #9EF1EA |
| `expressive/illustration/violet/bold` | `expressive/violet/900` | #312E81 |
| `expressive/illustration/violet/medium` | `expressive/violet/500` | #5A50F9 |
| `expressive/illustration/violet/quiet` | `expressive/violet/50` | #EEF2FF |
| `expressive/illustration/violet/subtle` | `expressive/violet/200` | #C7D2FE |

---

## Typography

160 variables agrupadas en 32 estilos. Cada estilo define cinco propiedades: `font-family`, `font-size`, `font-weight`, `line-height` y `letter-spacing`.

El nombre del token es el estilo más la propiedad. Por ejemplo, la fila `body/md/semibold` corresponde a `body/md/semibold/font-size`, `body/md/semibold/font-weight` y así con las cinco.

### body (12 estilos)

| Estilo | Tamaño | Peso | Line height | Letter spacing | Familia |
|---|---|---|---|---|---|
| `body/lg/bold` | 18px | 700 | 24px | 0 | Red Hat Text |
| `body/lg/medium` | 18px | 500 | 24px | 0 | Red Hat Text |
| `body/lg/regular` | 18px | 400 | 24px | 0 | Red Hat Text |
| `body/lg/semibold` | 18px | 600 | 24px | 0 | Red Hat Text |
| `body/md/bold` | 16px | 700 | 24px | 0 | Red Hat Text |
| `body/md/medium` | 16px | 500 | 24px | 0 | Red Hat Text |
| `body/md/regular` | 16px | 400 | 24px | 0 | Red Hat Text |
| `body/md/semibold` | 16px | 600 | 24px | 0 | Red Hat Text |
| `body/sm/bold` | 14px | 700 | 20px | 0 | Red Hat Text |
| `body/sm/medium` | 14px | 500 | 20px | 0 | Red Hat Text |
| `body/sm/regular` | 14px | 400 | 20px | 0 | Red Hat Text |
| `body/sm/semibold` | 14px | 600 | 20px | 0 | Red Hat Text |

### caption (6 estilos)

| Estilo | Tamaño | Peso | Line height | Letter spacing | Familia |
|---|---|---|---|---|---|
| `caption/md/medium` | 12px | 500 | 16px | 0 | Red Hat Text |
| `caption/md/regular` | 12px | 400 | 16px | 0 | Red Hat Text |
| `caption/md/semibold` | 12px | 600 | 16px | 0 | Red Hat Text |
| `caption/sm/medium` | 10px | 500 | 14px | 0 | Red Hat Text |
| `caption/sm/regular` | 10px | 400 | 14px | 0 | Red Hat Text |
| `caption/sm/semibold` | 10px | 600 | 14px | 0 | Red Hat Text |

### display (6 estilos)

| Estilo | Tamaño | Peso | Line height | Letter spacing | Familia |
|---|---|---|---|---|---|
| `display/lg/bold` | 56px | 700 | 64px | 1 | Red Hat Display |
| `display/lg/semibold` | 56px | 600 | 64px | 1 | Red Hat Display |
| `display/md/bold` | 48px | 700 | 56px | 1 | Red Hat Display |
| `display/md/semibold` | 48px | 600 | 56px | 1 | Red Hat Display |
| `display/sm/bold` | 40px | 700 | 48px | 1 | Red Hat Display |
| `display/sm/semibold` | 40px | 600 | 48px | 1 | Red Hat Display |

### heading (8 estilos)

| Estilo | Tamaño | Peso | Line height | Letter spacing | Familia |
|---|---|---|---|---|---|
| `heading/lg/bold` | 28px | 700 | 36px | 1 | Red Hat Text |
| `heading/lg/semibold` | 28px | 600 | 36px | 1 | Red Hat Text |
| `heading/md/bold` | 24px | 700 | 32px | 1 | Red Hat Text |
| `heading/md/semibold` | 24px | 600 | 32px | 1 | Red Hat Text |
| `heading/sm/bold` | 20px | 700 | 28px | 0 | Red Hat Text |
| `heading/sm/semibold` | 20px | 600 | 28px | 0 | Red Hat Text |
| `heading/xl/bold` | 32px | 700 | 40px | 1 | Red Hat Text |
| `heading/xl/semibold` | 32px | 600 | 40px | 1 | Red Hat Text |

---

## Spacing

48 variables.

| Token | Primitivo | Valor |
|---|---|---|
| `gap/gap-0` | `spacing/0` | 0px |
| `gap/gap-50` | `spacing/50` | 2px |
| `gap/gap-100` | `spacing/100` | 4px |
| `gap/gap-150` | `spacing/150` | 6px |
| `gap/gap-200` | `spacing/200` | 8px |
| `gap/gap-300` | `spacing/300` | 12px |
| `gap/gap-400` | `spacing/400` | 16px |
| `gap/gap-600` | `spacing/600` | 24px |
| `gap/gap-900` | `spacing/900` | 28px |
| `gap/gap-1000` | `spacing/1000` | 32px |
| `gap/gap-1100` | `spacing/1100` | 36px |
| `gap/gap-1200` | `spacing/1200` | 40px |
| `gap/gap-1300` | `spacing/1300` | 48px |
| `gap/gap-1400` | `spacing/1400` | 56px |
| `gap/gap-1600` | `spacing/1600` | 64px |
| `gap/gap-1800` | `spacing/1800` | 72px |
| `gap/gap-2000` | `spacing/2000` | 80px |
| `gap/gap-2200` | `spacing/2200` | 88px |
| `gap/gap-2400` | `spacing/2400` | 96px |
| `gap/gap-2800` | `spacing/2800` | 112px |
| `gap/gap-3200` | `spacing/3200` | 128px |
| `gap/gap-3600` | `spacing/3600` | 144px |
| `gap/gap-4000` | `spacing/4000` | 160px |
| `padding/padding-0` | `spacing/0` | 0px |
| `padding/padding-50` | `spacing/50` | 2px |
| `padding/padding-100` | `spacing/100` | 4px |
| `padding/padding-150` | `spacing/150` | 6px |
| `padding/padding-200` | `spacing/200` | 8px |
| `padding/padding-250` | `spacing/250` | 10px |
| `padding/padding-300` | `spacing/300` | 12px |
| `padding/padding-400` | `spacing/400` | 16px |
| `padding/padding-500` | `spacing/500` | 20px |
| `padding/padding-600` | `spacing/600` | 24px |
| `padding/padding-900` | `spacing/900` | 28px |
| `padding/padding-1000` | `spacing/1000` | 32px |
| `padding/padding-1100` | `spacing/1100` | 36px |
| `padding/padding-1200` | `spacing/1200` | 40px |
| `padding/padding-1300` | `spacing/1300` | 48px |
| `padding/padding-1400` | `spacing/1400` | 56px |
| `padding/padding-1600` | `spacing/1600` | 64px |
| `padding/padding-1800` | `spacing/1800` | 72px |
| `padding/padding-2000` | `spacing/2000` | 80px |
| `padding/padding-2200` | `spacing/2200` | 88px |
| `padding/padding-2400` | `spacing/2400` | 96px |
| `padding/padding-2800` | `spacing/2800` | 112px |
| `padding/padding-3200` | `spacing/3200` | 128px |
| `padding/padding-3600` | `spacing/3600` | 144px |
| `padding/padding-4000` | `spacing/4000` | 160px |

---

## Border

15 variables.

| Token | Primitivo | Valor |
|---|---|---|
| `border/corner/corner-0` | `corner/0` | 0px |
| `border/corner/corner-100` | `corner/100` | 4px |
| `border/corner/corner-150` | `corner/150` | 6px |
| `border/corner/corner-200` | `corner/200` | 8px |
| `border/corner/corner-250` | `corner/250` | 10px |
| `border/corner/corner-300` | `corner/300` | 12px |
| `border/corner/corner-350` | `corner/350` | 14px |
| `border/corner/corner-400` | `corner/400` | 16px |
| `border/corner/corner-500` | `corner/500` | 20px |
| `border/corner/corner-600` | `corner/600` | 24px |
| `border/corner/corner-1000` | `corner/1000` | 32px |
| `border/corner/corner-2000` | `corner/2000` | 999px |
| `border/width/medium` | `width/200` | 2px |
| `border/width/strong` | `width/300` | 3px |
| `border/width/thin` | `width/100` | 1px |

---

## Asset

15 variables.

| Token | Primitivo | Valor |
|---|---|---|
| `icon/lg` | `asset/200` | 32px |
| `icon/md` | `asset/100` | 24px |
| `icon/sm` | `asset/75` | 20px |
| `icon/xs` | `asset/50` | 16px |
| `illustration/lg` | `asset/800` | 96px |
| `illustration/md` | `asset/700` | 80px |
| `illustration/sm` | `asset/600` | 64px |
| `illustration/xl` | `asset/900` | 120px |
| `illustration/xs` | `asset/500` | 56px |
| `illustration/2xl` | `asset/1000` | 160px |
| `illustration/3xl` | `asset/1100` | 232px |
| `pictogram/lg` | `asset/200` | 32px |
| `pictogram/md` | `asset/100` | 24px |
| `pictogram/2xl` | `asset/300` | 40px |
| `pictogram/3xl` | `asset/400` | 48px |

---

## Screen size

2 variables.

| Token | Primitivo | Valor |
|---|---|---|
| `max-width` | — | 428px |
| `min-width` | — | 320px |

---

## Density mode

1 variables.

| Token | Primitivo | Valor |
|---|---|---|
| `vertical-padding` | `padding/padding-300` | 12px |

---
