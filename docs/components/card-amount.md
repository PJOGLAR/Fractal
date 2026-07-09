# Card-amount

**Categoria:** Content / Data display  
**Tokens aplicados:** 92  
**Bindings totales:** 390  

## Variantes

| Prop | Valores |
|---|---|
| State | default, empty, loading |

## Tokens aplicados

### Border radius

| Token | Propiedad | Capa |
|---|---|---|
| `border/corner/corner-300` | topLeftRadius | default |
| `border/corner/corner-300` | topRightRadius | default |
| `border/corner/corner-300` | bottomLeftRadius | default |
| `border/corner/corner-300` | bottomRightRadius | default |
| `border/corner/corner-400` | topLeftRadius | ⛔️ Row-item_content |
| `border/corner/corner-400` | topRightRadius | ⛔️ Row-item_content |
| `border/corner/corner-400` | bottomLeftRadius | ⛔️ Row-item_content |
| `border/corner/corner-400` | bottomRightRadius | ⛔️ Row-item_content |
| `border/corner/corner-0` | topLeftRadius | ---> Title |
| `border/corner/corner-0` | topRightRadius | ---> Title |
| `border/corner/corner-0` | bottomLeftRadius | ---> Title |
| `border/corner/corner-0` | bottomRightRadius | ---> Title |
| `border/corner/corner-150` | topLeftRadius | Pill |
| `border/corner/corner-150` | topRightRadius | Pill |
| `border/corner/corner-150` | bottomLeftRadius | Pill |
| `border/corner/corner-150` | bottomRightRadius | Pill |
| `border/corner/corner-2000` | topLeftRadius | Badge |
| `border/corner/corner-2000` | topRightRadius | Badge |
| `border/corner/corner-2000` | bottomLeftRadius | Badge |
| `border/corner/corner-2000` | bottomRightRadius | Badge |
| ... | | +8 mas |

### Color (fills)

| Token | Propiedad | Capa |
|---|---|---|
| `static/background/neutral/quiet` | fills | default |
| `interactive/background/brand/default/quiet` | fills | Row-item |
| `static/foreground/neutral/strong` | fills | Vector |
| `static/foreground/neutral/bold` | fills | Headline |
| `static/foreground/neutral/medium` | fills | Status |
| `static/foreground/brand/primary/medium` | fills | Vector |
| `interactive/foreground/neutral/default/strong` | fills | Vector |
| `static/foreground/neutral/tertiary-subtle` | fills | Vector |
| `static/background/feedback/error/bold` | fills | Badge |
| `static/background/feedback/success/bold` | fills | ---> Trailing content pill |
| `static/foreground/neutral/quiet` | fills | Status |
| `interactive/background/brand/default/medium` | fills | Button-icon |
| `interactive/foreground/neutral/default/quiet` | fills | Vector |
| `interactive/foreground/brand/primary/default/bold` | fills | Vector |
| `expressive/violet/50` | fills | ---> Mini-banner 1 |
| `interactive/foreground/brand/primary/default/medium` | fills | Vector |
| `static/background/brand/primary/subtle` | fills | Swap-content |
| `static/background/brand/primary/quiet` | fills | Skeleton-component |

### Color (strokes)

| Token | Propiedad | Capa |
|---|---|---|
| `static/border/brand/secondary` | strokes | default |
| `static/border/neutral/medium` | strokes | Pill |
| `static/border/neutral/quiet` | strokes | Badge |
| `expressive/violet/200` | strokes | ---> Mini-banner 1 |
| `static/border/brand/primary` | strokes | Swap-content |

### Sizing

| Token | Propiedad | Capa |
|---|---|---|
| `icon/md` | width | .⛔ Placeholder-icon_slot |
| `icon/xs` | width | ⛔ Placeholder-icon_slot |
| `illustration/xs` | width | ⛔ Placeholder-illustration_slot |

### Spacing (gap)

| Token | Propiedad | Capa |
|---|---|---|
| `gap/gap-0` | itemSpacing | default |
| `gap/gap-200` | itemSpacing | Row-item |
| `gap/gap-100` | itemSpacing | ⛔️ Row-item_content |
| `gap/gap-50` | itemSpacing | ---> Button icon |
| `gap/gap-400` | itemSpacing | Content-wrapper |
| `gap/gap-150` | itemSpacing | Button-icon |
| `gap/gap-300` | itemSpacing | ---> Banners |
| `space/0x` | itemSpacing | Placeholder-Illustration |
| `padding/padding-200` | itemSpacing | Content |

### Spacing (padding)

| Token | Propiedad | Capa |
|---|---|---|
| `padding/padding-0` | paddingTop | default |
| `padding/padding-200` | paddingBottom | default |
| `padding/padding-0` | paddingLeft | Header |
| `padding/padding-0` | paddingRight | Header |
| `padding/padding-0` | paddingBottom | Header |
| `padding/padding-400` | paddingLeft | Row-item |
| `vertical-padding` | paddingTop | Row-item |
| `padding/padding-400` | paddingRight | Row-item |
| `vertical-padding` | paddingBottom | Row-item |
| `padding/padding-50` | paddingTop | ---> Title |
| `padding/padding-50` | paddingBottom | ---> Title |
| `padding/padding-200` | paddingLeft | Pill |
| `padding/padding-200` | paddingRight | Pill |
| `padding/padding-300` | paddingTop | Content wrapper |
| `padding/padding-100` | paddingLeft | ---> Button icon |
| `padding/padding-100` | paddingTop | ---> Button icon |
| `padding/padding-100` | paddingRight | ---> Button icon |
| `padding/padding-100` | paddingBottom | ---> Button icon |
| `padding/padding-200` | paddingTop | Content-wrapper |
| `padding/padding-300` | paddingLeft | ---> Content currency |
| ... | | +20 mas |

### Typography

| Token | Propiedad | Capa |
|---|---|---|
| `caption/md/regular/letter-spacing` | letterSpacing | Headline |
| `caption/md/regular/font-size` | fontSize | Headline |
| `caption/md/regular/font-family` | fontFamily | Headline |
| `caption/md/regular/line-height` | lineHeight | Headline |
| `body/md/regular/font-weight` | fontWeight | Headline |
| `body/sm/semibold/letter-spacing` | letterSpacing | Title |
| `body/sm/semibold/font-size` | fontSize | Title |
| `body/sm/semibold/font-family` | fontFamily | Title |
| `body/sm/semibold/line-height` | lineHeight | Title |
| `body/sm/semibold/font-weight` | fontWeight | Title |
| `caption/md/medium/letter-spacing` | letterSpacing | Status |
| `caption/md/medium/font-size` | fontSize | Status |
| `caption/md/medium/font-family` | fontFamily | Status |
| `caption/md/medium/line-height` | lineHeight | Status |
| `caption/md/medium/font-weight` | fontWeight | Status |
| `heading/md/semibold/letter-spacing` | letterSpacing | Currency |
| `heading/md/semibold/font-size` | fontSize | Currency |
| `heading/md/semibold/font-family` | fontFamily | Currency |
| `heading/md/semibold/line-height` | lineHeight | Currency |
| `heading/md/semibold/font-weight` | fontWeight | Currency |
| ... | | +19 mas |

### strokeBottomWeight

| Token | Propiedad | Capa |
|---|---|---|
| `border/width/strong` | strokeBottomWeight | default |
| `border/width/thin` | strokeBottomWeight | ⛔️ Row-item_content |
| `border/with/thin` | strokeBottomWeight | Swap-content |

### strokeLeftWeight

| Token | Propiedad | Capa |
|---|---|---|
| `border/width/thin` | strokeLeftWeight | ⛔️ Row-item_content |
| `border/with/thin` | strokeLeftWeight | Swap-content |

### strokeRightWeight

| Token | Propiedad | Capa |
|---|---|---|
| `border/width/thin` | strokeRightWeight | ⛔️ Row-item_content |
| `border/with/thin` | strokeRightWeight | Swap-content |

### strokeTopWeight

| Token | Propiedad | Capa |
|---|---|---|
| `border/width/thin` | strokeTopWeight | ⛔️ Row-item_content |
| `border/with/thin` | strokeTopWeight | Swap-content |

## Resumen de tokens

```
body/lg/semibold/font-family
body/lg/semibold/font-size
body/lg/semibold/font-weight
body/lg/semibold/letter-spacing
body/lg/semibold/line-height
body/md/regular/font-family
body/md/regular/font-size
body/md/regular/font-weight
body/md/regular/letter-spacing
body/md/regular/line-height
body/md/semibold/font-family
body/md/semibold/font-size
body/md/semibold/font-weight
body/md/semibold/letter-spacing
body/md/semibold/line-height
body/sm/semibold/font-family
body/sm/semibold/font-size
body/sm/semibold/font-weight
body/sm/semibold/letter-spacing
body/sm/semibold/line-height
border/corner/corner-0
border/corner/corner-150
border/corner/corner-2000
border/corner/corner-250
border/corner/corner-300
border/corner/corner-400
border/radius/none
border/width/strong
border/width/thin
border/with/thin
... +62 mas
```
