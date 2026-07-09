# Card-container

**Categoria:** Content / Data display  
**Tokens aplicados:** 56  
**Bindings totales:** 253  

## Variantes

| Prop | Valores |
|---|---|
| Alignement | horizontal, vertical |
| State | default, hover, loading, pressed |
| Type | image, pictogram |

## Tokens aplicados

### Border radius

| Token | Propiedad | Capa |
|---|---|---|
| `border/corner/corner-300` | topLeftRadius | image/horizontal/default |
| `border/corner/corner-300` | topRightRadius | image/horizontal/default |
| `border/corner/corner-300` | bottomLeftRadius | image/horizontal/default |
| `border/corner/corner-300` | bottomRightRadius | image/horizontal/default |
| `border/corner/corner-2000` | topLeftRadius | Asset-container |
| `border/corner/corner-2000` | topRightRadius | Asset-container |
| `border/corner/corner-2000` | bottomLeftRadius | Asset-container |
| `border/corner/corner-2000` | bottomRightRadius | Asset-container |
| `border/corner/corner-100` | topRightRadius | Label |
| `border/corner/corner-100` | bottomLeftRadius | Label |
| `border/corner/corner-400` | topLeftRadius | ---> Content |
| `border/corner/corner-400` | topRightRadius | ---> Content |
| `border/corner/corner-400` | bottomLeftRadius | ---> Content |
| `border/corner/corner-400` | bottomRightRadius | ---> Content |
| `border/corner/corner-0` | topLeftRadius | ---> Title |
| `border/corner/corner-0` | topRightRadius | ---> Title |
| `border/corner/corner-0` | bottomLeftRadius | ---> Title |
| `border/corner/corner-0` | bottomRightRadius | ---> Title |

### Color (fills)

| Token | Propiedad | Capa |
|---|---|---|
| `static/background/neutral/quiet` | fills | image/horizontal/default |
| `static/background/feedback/error/bold` | fills | Badge |
| `static/foreground/brand/primary/medium` | fills | Vector |
| `static/background/brand/primary/medium` | fills | Label |
| `static/foreground/neutral/quiet` | fills | Label |
| `static/foreground/neutral/bold` | fills | Headline |
| `static/foreground/neutral/strong` | fills | Title (2 lines max) |
| `static/background/neutral/primary-medium` | fills | Asset-container |
| `interactive/opacity/brand/pressed` | fills | Pressed layer |
| `interactive/opacity/brand/hover` | fills | Hover layer |
| `static/background/brand/primary/subtle` | fills | Skeleton-component |
| `static/background/brand/primary/quiet` | fills | Skeleton-component |
| `expressive/illustration/violet/subtle` | fills | Asset background |

### Color (strokes)

| Token | Propiedad | Capa |
|---|---|---|
| `static/border/brand/secondary` | strokes | Asset-container |
| `static/border/neutral/quiet` | strokes | Badge |

### Sizing

| Token | Propiedad | Capa |
|---|---|---|
| `pictogram/2xl` | width | Asset-container |
| `icon/md` | width | ⛔ Placeholder-icon_slot |
| `icon/sm` | width | ⛔ Placeholder-icon_slot |
| `pictogram/3xl` | width | ⛔ Placeholder-pictogram_slot |

### Spacing (gap)

| Token | Propiedad | Capa |
|---|---|---|
| `gap/gap-0` | itemSpacing | Asset-container |
| `gap/gap-300` | itemSpacing | ---> Content |
| `gap/gap-50` | itemSpacing | Content |
| `gap/gap-100` | itemSpacing | ---> Description |

### Spacing (padding)

| Token | Propiedad | Capa |
|---|---|---|
| `padding/padding-100` | paddingLeft | Asset-container |
| `padding/padding-100` | paddingTop | Asset-container |
| `padding/padding-100` | paddingRight | Asset-container |
| `padding/padding-100` | paddingBottom | Asset-container |
| `padding/padding-300` | paddingLeft | Label |
| `padding/padding-50` | paddingTop | Label |
| `padding/padding-300` | paddingRight | Label |
| `padding/padding-50` | paddingBottom | Label |
| `padding/padding-300` | paddingTop | ---> Content |
| `padding/padding-300` | paddingBottom | ---> Content |
| `padding/padding-0` | paddingLeft | ---> Title |
| `padding/padding-0` | paddingRight | ---> Title |
| `padding/padding-0` | paddingTop | ---> Description |
| `padding/padding-0` | paddingBottom | ---> Description |
| `Spacing/SM/space-2` | paddingLeft | Asset-container |
| `Spacing/SM/space-2` | paddingTop | Asset-container |
| `Spacing/SM/space-2` | paddingRight | Asset-container |
| `Spacing/SM/space-2` | paddingBottom | Asset-container |
| `gap/gap-300` | paddingLeft | Asset wrapper |
| `gap/gap-300` | paddingTop | Asset wrapper |
| ... | | +6 mas |

### Typography

| Token | Propiedad | Capa |
|---|---|---|
| `caption/sm/semibold/letter-spacing` | letterSpacing | Label |
| `caption/sm/semibold/font-size` | fontSize | Label |
| `caption/sm/semibold/font-family` | fontFamily | Label |
| `caption/sm/semibold/line-height` | lineHeight | Label |
| `caption/sm/semibold/font-weight` | fontWeight | Label |
| `caption/md/regular/letter-spacing` | letterSpacing | Headline |
| `caption/md/regular/font-size` | fontSize | Headline |
| `caption/md/regular/font-family` | fontFamily | Headline |
| `caption/md/regular/line-height` | lineHeight | Headline |
| `body/md/regular/font-weight` | fontWeight | Headline |
| `body/md/semibold/letter-spacing` | letterSpacing | Title (2 lines max) |
| `body/md/semibold/font-size` | fontSize | Title (2 lines max) |
| `body/md/semibold/font-family` | fontFamily | Title (2 lines max) |
| `body/md/semibold/line-height` | lineHeight | Title (2 lines max) |
| `body/md/semibold/font-weight` | fontWeight | Title (2 lines max) |
| `caption/md/semibold/letter-spacing` | letterSpacing | Subheadline |
| `caption/md/semibold/font-size` | fontSize | Subheadline |
| `caption/md/semibold/font-family` | fontFamily | Subheadline |
| `caption/md/semibold/line-height` | lineHeight | Subheadline |
| `caption/md/semibold/font-weight` | fontWeight | Subheadline |

### effects

| Token | Propiedad | Capa |
|---|---|---|
| `static/opacity/brand/bold` | effects | image/horizontal/default |

### strokeBottomWeight

| Token | Propiedad | Capa |
|---|---|---|
| `border/width/thin` | strokeBottomWeight | Asset-container |

### strokeLeftWeight

| Token | Propiedad | Capa |
|---|---|---|
| `border/width/thin` | strokeLeftWeight | Asset-container |

### strokeRightWeight

| Token | Propiedad | Capa |
|---|---|---|
| `border/width/thin` | strokeRightWeight | Asset-container |

### strokeTopWeight

| Token | Propiedad | Capa |
|---|---|---|
| `border/width/thin` | strokeTopWeight | Asset-container |

## Resumen de tokens

```
Spacing/SM/space-2
body/md/regular/font-weight
body/md/semibold/font-family
body/md/semibold/font-size
body/md/semibold/font-weight
body/md/semibold/letter-spacing
body/md/semibold/line-height
border/corner/corner-0
border/corner/corner-100
border/corner/corner-2000
border/corner/corner-300
border/corner/corner-400
border/width/thin
caption/md/regular/font-family
caption/md/regular/font-size
caption/md/regular/letter-spacing
caption/md/regular/line-height
caption/md/semibold/font-family
caption/md/semibold/font-size
caption/md/semibold/font-weight
caption/md/semibold/letter-spacing
caption/md/semibold/line-height
caption/sm/semibold/font-family
caption/sm/semibold/font-size
caption/sm/semibold/font-weight
caption/sm/semibold/letter-spacing
caption/sm/semibold/line-height
expressive/illustration/violet/subtle
gap/gap-0
gap/gap-100
... +26 mas
```
