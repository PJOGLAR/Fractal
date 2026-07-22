import { useState, useMemo } from 'react'
import changelogData from '../data/changelog.json'
import './Changelog.css'

interface DiffEntry {
  type: string
  component: string
  nodeId?: string
  details: string
  parentName?: string
}

interface ChangelogEntry {
  id: string
  timestamp: string
  fileKey: string
  fileName: string
  fileLabel: string
  summary: string
  changes: DiffEntry[]
  stats?: {
    componentsAdded: number
    componentsRemoved: number
    bindingsAdded: number
    bindingsRemoved: number
    bindingsChanged: number
    propertiesChanged?: number
  }
}

// "Style=filled, Size=xl, Shape=circle, Asset type=pictogram" → "filled/xl/circle/pictogram"
function shortVariant(name: string): string {
  if (!name.includes('=')) return name
  return name.split(',').map(p => p.split('=')[1]?.trim() || p.trim()).join('/')
}

// "static/background/brand/primary/subtle" → "background/brand/primary/subtle"
function cleanToken(token: string): string {
  return token.replace(/^static\//, '').replace(/^semantic\//, '')
}

// "padding/padding-100" → "padding-100", "gap/gap-0" → "gap-0"
function shortToken(token: string): string {
  const clean = cleanToken(token)
  const parts = clean.split('/')
  // If last segment is repeated info, just use last 2
  return parts.length > 3 ? parts.slice(-2).join('/') : clean
}

// Humanize a Figma component property type
function humanPropType(type: string): string {
  const map: Record<string, string> = {
    BOOLEAN: 'Boolean prop',
    TEXT: 'Text prop',
    INSTANCE_SWAP: 'Instance swap prop',
    VARIANT: 'Variant prop',
  }
  return map[type] || `${type} prop`
}

// Parse a binding_added detail: "Frame 1.fills → interactive/background/brand/default/bold"
// Returns { layer, prop, token }
function parseBinding(details: string): { layer: string; prop: string; token: string } | null {
  const arrowIdx = details.indexOf(' → ')
  if (arrowIdx === -1) return null
  const subject = details.slice(0, arrowIdx)
  const token = details.slice(arrowIdx + 3).trim()
  const lastDot = subject.lastIndexOf('.')
  return {
    layer: lastDot !== -1 ? subject.slice(0, lastDot).trim() : subject.trim(),
    prop: lastDot !== -1 ? subject.slice(lastDot + 1).trim() : '',
    token,
  }
}

// Humanize a CSS property name
function humanProp(prop: string): string {
  const map: Record<string, string> = {
    fills: 'fill',
    strokes: 'stroke',
    strokeWeight: 'stroke width',
    itemSpacing: 'gap',
    paddingLeft: 'padding left',
    paddingRight: 'padding right',
    paddingTop: 'padding top',
    paddingBottom: 'padding bottom',
    'size.width': 'width',
    'size.height': 'height',
    opacity: 'opacity',
    fontSize: 'font size',
    fontWeight: 'font weight',
    topLeftRadius: 'radius ↖',
    topRightRadius: 'radius ↗',
    bottomLeftRadius: 'radius ↙',
    bottomRightRadius: 'radius ↘',
  }
  return map[prop] || prop
}

// Parse "LayerName.property: before → after" or "LayerName.property (era: token)"
function parseDetail(details: string) {
  if (details.includes(' → ')) {
    const arrowIdx = details.indexOf(' → ')
    const colonIdx = details.lastIndexOf(': ', arrowIdx)
    if (colonIdx === -1) return null
    const subject = details.slice(0, colonIdx)
    const before = details.slice(colonIdx + 2, arrowIdx)
    const after = details.slice(arrowIdx + 3)
    const lastDot = subject.lastIndexOf('.')
    return {
      layer: lastDot !== -1 ? subject.slice(0, lastDot) : subject,
      prop: lastDot !== -1 ? subject.slice(lastDot + 1) : '',
      before,
      after,
    }
  }
  if (details.includes('(era: ')) {
    const eraIdx = details.indexOf('(era: ')
    const subject = details.slice(0, eraIdx).trim().replace(/\.$/, '')
    const era = details.slice(eraIdx + 6, -1)
    const lastDot = subject.lastIndexOf('.')
    return {
      layer: lastDot !== -1 ? subject.slice(0, lastDot) : subject,
      prop: lastDot !== -1 ? subject.slice(lastDot + 1) : '',
      before: era,
      after: null,
    }
  }
  return null
}

export function Changelog() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterFile, setFilterFile] = useState<string>('all')
  const [showInfo, setShowInfo] = useState(false)

  const entries = changelogData as unknown as ChangelogEntry[]

  const fileLabels = useMemo(() => {
    const labels = new Set<string>(['components', 'templates', 'assets', 'custom'])
    for (const e of entries) if (e.fileLabel) labels.add(e.fileLabel)
    return [...labels].sort()
  }, [entries])

  const filtered = useMemo(() => {
    if (filterFile === 'all') return entries
    return entries.filter(e => e.fileLabel === filterFile)
  }, [entries, filterFile])

  return (
    <div className="changelog">
      <h2 className="page-title">Changelog</h2>
      <p className="page-description">Historial de cambios detectados en los archivos de Figma</p>

      <div className="changelog-controls">
        <div className="changelog-filter">
          <label htmlFor="file-filter">Archivo:</label>
          <select id="file-filter" value={filterFile} onChange={e => setFilterFile(e.target.value)}>
            <option value="all">Todos</option>
            {fileLabels.map(label => (
              <option key={label} value={label}>{label}</option>
            ))}
          </select>
        </div>
        <span className="changelog-count">{filtered.length} entradas</span>
        <button className="info-toggle" onClick={() => setShowInfo(!showInfo)} aria-expanded={showInfo}>
          {showInfo ? 'Ocultar info' : '¿Cómo funciona?'}
        </button>
      </div>

      {showInfo && <ChangelogInfo />}

      {filtered.length === 0 && (
        <div className="changelog-empty">
          <p>No hay cambios registrados todavía.</p>
          <p className="changelog-empty-hint">Los cambios se detectan automáticamente cada día a las 9 AM.</p>
        </div>
      )}

      <div className="changelog-list">
        {filtered.map(entry => (
          <article key={entry.id} className="changelog-entry">
            <button
              className="changelog-entry-header"
              onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              aria-expanded={expandedId === entry.id}
            >
              <div className="changelog-entry-meta">
                <time className="changelog-date">
                  {new Date(entry.timestamp).toLocaleDateString('es-AR', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </time>
                <span className="changelog-file-badge">{entry.fileLabel}</span>
              </div>
              <p className="changelog-summary">{entry.summary}</p>
            </button>

            {expandedId === entry.id && (
              <div className="changelog-entry-details">
                <CleanChangelog changes={entry.changes} />
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

function CleanChangelog({ changes }: { changes: DiffEntry[] }) {
  // Filter out internal ⛔ entries
  const filtered = changes.filter(c => !c.component.includes('⛔') && !c.details.includes('⛔'))

  const removed = filtered.filter(c => c.type === 'component_removed')
  const added = filtered.filter(c => c.type === 'component_added')
  const renamed = filtered.filter(c => c.type === 'component_renamed')
  const deprecated = filtered.filter(c => c.type === 'component_deprecated')
  const variantsAdded = filtered.filter(c => c.type === 'variant_added')
  const variantsRemoved = filtered.filter(c => c.type === 'variant_removed')
  const propsAdded = filtered.filter(c => c.type === 'component_prop_added')
  const propsRemoved = filtered.filter(c => c.type === 'component_prop_removed')
  const nested = filtered.filter(c => c.type === 'component_nested')
  const unnested = filtered.filter(c => c.type === 'component_unnested')

  // Group binding/property changes by parent component
  const componentChanges = useMemo(() => {
    const map = new Map<string, {
      tokensChanged: DiffEntry[]
      tokensAdded: DiffEntry[]
      tokensRemoved: DiffEntry[]
      propsChanged: DiffEntry[]
      componentProps: DiffEntry[]
      isNew: boolean
    }>()
    // Names of ALL newly-added components (sets, variants, standalone).
    // For new components we only show the name in the "Componentes nuevos" section —
    // no token/property breakdown — so we skip their change-blocks entirely.
    const addedNames = new Set(added.map(a => a.component))

    const componentLevelTypes = [
      'component_added', 'component_removed', 'component_renamed', 'component_deprecated',
      'variant_added', 'variant_removed', 'component_prop_added', 'component_prop_removed',
      'component_nested', 'component_unnested',
    ]
    for (const c of filtered) {
      if (componentLevelTypes.includes(c.type)) continue
      const key = c.component
      // Skip any change-block belonging to a newly-added component
      if (addedNames.has(key)) continue
      if (!map.has(key)) map.set(key, { tokensChanged: [], tokensAdded: [], tokensRemoved: [], propsChanged: [], componentProps: [], isNew: false })
      const g = map.get(key)!
      if (c.type === 'binding_changed') g.tokensChanged.push(c)
      else if (c.type === 'binding_added') g.tokensAdded.push(c)
      else if (c.type === 'binding_removed') g.tokensRemoved.push(c)
      else if (c.type === 'property_changed') g.propsChanged.push(c)
      else if (c.type === 'component_props_initial') g.componentProps.push(c)
    }
    return map
  }, [filtered, added])

  return (
    <div className="clean-changelog">

      {/* Componentes/variantes eliminados */}
      {removed.length > 0 && (
        <section className="cl-section">
          <h4 className="cl-section-title">
            <span className="cl-badge cl-badge--removed">−</span>
            {removed.some(r => !r.component.includes('=')) ? 'Componentes eliminados' : 'Variantes eliminadas'}
          </h4>
          <VariantList variants={removed} type="removed" />
        </section>
      )}

      {/* Componentes/variantes nuevos */}
      {added.length > 0 && (
        <section className="cl-section">
          <h4 className="cl-section-title">
            <span className="cl-badge cl-badge--added">+</span>
            {added.some(a => !a.component.includes('=')) ? 'Componentes nuevos' : 'Variantes nuevas'}
          </h4>
          <VariantList variants={added} type="added" />
        </section>
      )}

      {/* Renombrados */}
      {renamed.length > 0 && (
        <section className="cl-section">
          <h4 className="cl-section-title">
            <span className="cl-badge cl-badge--changed">↪</span>
            Renombrados
          </h4>
          <ul className="cl-list">
            {renamed.map((d, i) => <li key={i}>{d.details}</li>)}
          </ul>
        </section>
      )}

      {/* Deprecados */}
      {deprecated.length > 0 && (
        <section className="cl-section">
          <h4 className="cl-section-title">
            <span className="cl-badge cl-badge--removed">⛔</span>
            Deprecados
          </h4>
          <ul className="cl-list">
            {deprecated.map((d, i) => <li key={i}>{d.details}</li>)}
          </ul>
        </section>
      )}

      {/* Variantes nuevas en sets existentes */}
      {variantsAdded.length > 0 && (
        <section className="cl-section">
          <h4 className="cl-section-title">
            <span className="cl-badge cl-badge--added">+</span>
            Variantes nuevas
          </h4>
          <ul className="cl-list cl-list--added">
            {variantsAdded.map((d, i) => (
              <li key={i}>
                <span className="variant-item-name">{d.parentName}</span>
                <span className="variant-item-detail"> › {shortVariant(d.component)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Variantes eliminadas de sets existentes */}
      {variantsRemoved.length > 0 && (
        <section className="cl-section">
          <h4 className="cl-section-title">
            <span className="cl-badge cl-badge--removed">−</span>
            Variantes eliminadas
          </h4>
          <ul className="cl-list cl-list--removed">
            {variantsRemoved.map((d, i) => (
              <li key={i}>
                <span className="variant-item-name">{d.parentName}</span>
                <span className="variant-item-detail"> › {shortVariant(d.component)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Propiedades agregadas */}
      {propsAdded.length > 0 && (
        <section className="cl-section">
          <h4 className="cl-section-title">
            <span className="cl-badge cl-badge--added">+</span>
            Propiedades agregadas
          </h4>
          <PropChangeList entries={propsAdded} />
        </section>
      )}

      {/* Propiedades eliminadas */}
      {propsRemoved.length > 0 && (
        <section className="cl-section">
          <h4 className="cl-section-title">
            <span className="cl-badge cl-badge--removed">−</span>
            Propiedades eliminadas
          </h4>
          <PropChangeList entries={propsRemoved} />
        </section>
      )}

      {/* Componentes anidados */}
      {nested.length > 0 && (
        <section className="cl-section">
          <h4 className="cl-section-title">
            <span className="cl-badge cl-badge--added">⤵</span>
            Componentes anidados
          </h4>
          <ul className="cl-list">
            {nested.map((d, i) => (
              <li key={i}>
                <span className="variant-item-name">{shortVariant(d.component)}</span>
                <span className="variant-item-detail"> ← {d.details}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Componentes des-anidados */}
      {unnested.length > 0 && (
        <section className="cl-section">
          <h4 className="cl-section-title">
            <span className="cl-badge cl-badge--removed">⤴</span>
            Componentes des-anidados
          </h4>
          <ul className="cl-list">
            {unnested.map((d, i) => (
              <li key={i}>
                <span className="variant-item-name">{shortVariant(d.component)}</span>
                <span className="variant-item-detail"> ⤫ {d.details}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Cambios por componente */}
      {[...componentChanges.entries()].map(([compName, g]) => (
        <ComponentChangeBlock key={compName} name={compName} {...g} />
      ))}
    </div>
  )
}

// Render component property additions/removals: "Componente: propName (Tipo)"
function PropChangeList({ entries }: { entries: DiffEntry[] }) {
  // Group by component
  const byComponent = useMemo(() => {
    const map = new Map<string, Array<{ name: string; type: string }>>()
    for (const d of entries) {
      const [rawName, type] = d.details.split('|')
      const name = rawName.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\s]+/u, '').trim() || rawName.trim()
      const comp = shortVariant(d.component)
      if (!map.has(comp)) map.set(comp, [])
      map.get(comp)!.push({ name, type: type || '' })
    }
    return map
  }, [entries])

  return (
    <div className="cl-prop-change-list">
      {[...byComponent.entries()].map(([comp, props], i) => (
        <div key={i} className="cl-prop-change-row">
          <span className="variant-item-name">{comp}</span>
          <div className="cl-props-tags">
            {props.map((p, j) => (
              <span key={j} className="cl-prop-tag">
                {p.name}
                {p.type && <span className="cl-prop-tag-type"> · {humanPropType(p.type)}</span>}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Render a list of variants, grouped intelligently:
// - If a full COMPONENT_SET was added/removed (set + all its variants), show only the set name
// - If individual variants were added/removed without their set, show "SetName → variant"
function VariantList({ variants, type }: { variants: DiffEntry[]; type: 'added' | 'removed' }) {
  const groups = useMemo(() => {
    // Separate sets (no "=" in name) from variants (have "=" in name)
    const sets = variants.filter(v => !v.component.includes('='))
    const individualVariants = variants.filter(v => v.component.includes('='))

    // Filter out internal ⛔ sets — they are sub-components, not user-facing
    const publicSets = sets.filter(s => !s.component.includes('⛔'))
    const internalSets = sets.filter(s => s.component.includes('⛔'))

    // Determine which variants belong to a removed/added set (full set operation)
    // A variant "belongs" to a set if:
    // 1. Its parentName matches a set's component name, OR
    // 2. It has no parentName but appears in same batch as sets (legacy data heuristic)
    const orphanVariants: DiffEntry[] = []

    for (const v of individualVariants) {
      const hasKnownParent = v.parentName
        ? [...sets].some(s => s.component === v.parentName || s.component.replace(/^\.⛔️\s*/, '') === v.parentName)
        : false

      if (hasKnownParent) {
        // This variant's parent set was also removed/added → it's a full set operation
        continue // don't show individually
      } else if (!v.parentName && sets.length > 0) {
        // Legacy data: no parentName, but we have sets in same batch → assume it belongs to a set
        continue // don't show individually
      } else {
        orphanVariants.push(v)
      }
    }

    // Build display groups
    const result: Array<{ label: string; detail?: string; isSet: boolean; variantCount?: number }> = []

    // Full set operations: show just the public set name + total variant count
    for (const s of publicSets) {
      // Count direct child variants
      const directChildren = individualVariants.filter(v =>
        v.parentName === s.component
      ).length

      // Count variants from related internal sub-sets
      const relatedInternalSets = internalSets.filter(is => {
        const cleanName = is.component.replace(/^\.⛔️\s*/, '')
        return cleanName.startsWith(s.component)
      })
      const internalChildren = individualVariants.filter(v =>
        relatedInternalSets.some(is => v.parentName === is.component)
      ).length

      // If no parentName data (legacy), count all variants + internal sets as belonging here
      const legacyCount = !individualVariants.some(v => v.parentName)
        ? individualVariants.length + internalSets.length
        : 0

      const totalVariants = directChildren + internalChildren + relatedInternalSets.length + legacyCount

      result.push({
        label: s.component,
        isSet: true,
        variantCount: totalVariants > 0 ? totalVariants : undefined
      })
    }

    // If there are only internal sets but no public sets, show a condensed version
    if (publicSets.length === 0 && internalSets.length > 0) {
      for (const s of internalSets) {
        const cleanName = s.component.replace(/^\.⛔️\s*/, '')
        const childCount = individualVariants.filter(v => v.parentName === s.component).length
        result.push({
          label: cleanName,
          isSet: true,
          variantCount: childCount > 0 ? childCount : undefined
        })
      }
    }

    // Orphan variants: show "ParentName → variant"
    const orphansByParent = new Map<string, DiffEntry[]>()
    for (const v of orphanVariants) {
      const parent = v.parentName || 'Componente'
      if (!orphansByParent.has(parent)) orphansByParent.set(parent, [])
      orphansByParent.get(parent)!.push(v)
    }

    for (const [parent, items] of orphansByParent) {
      for (const item of items) {
        result.push({
          label: parent,
          detail: shortVariant(item.component),
          isSet: false
        })
      }
    }

    return result
  }, [variants])

  if (groups.length === 0) return null

  return (
    <div className="variant-list-block">
      <ul className={`cl-list cl-list--${type}`}>
        {groups.map((g, i) => (
          <li key={i} className={g.isSet ? 'variant-set-item' : 'variant-individual-item'}>
            <span className="variant-item-name">{g.label}</span>
            {g.isSet && g.variantCount && (
              <span className="variant-item-count">({g.variantCount} variantes)</span>
            )}
            {!g.isSet && g.detail && (
              <span className="variant-item-detail"> → {g.detail}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ComponentChangeBlock({
  name, tokensChanged, tokensAdded, tokensRemoved, propsChanged, componentProps, isNew
}: {
  name: string
  tokensChanged: DiffEntry[]
  tokensAdded: DiffEntry[]
  tokensRemoved: DiffEntry[]
  propsChanged: DiffEntry[]
  componentProps: DiffEntry[]
  isNew: boolean
}) {
  const hasContent = tokensChanged.length + tokensAdded.length + tokensRemoved.length + propsChanged.length + componentProps.length > 0
  if (!hasContent) return null

  // Size/dimension changes
  const sizeChanges = propsChanged.filter(d => {
    const p = parseDetail(d.details)
    return p && ['size.width', 'size.height', 'width', 'height'].includes(p.prop)
  })
  const otherPropChanges = propsChanged.filter(d => !sizeChanges.includes(d))

  return (
    <section className="cl-section">
      <h4 className="cl-section-title cl-component-title">
        {shortVariant(name)}
        {isNew && <span className="cl-badge cl-badge--new">nuevo</span>}
      </h4>

      {/* Component properties (boolean, text, instance swap) grouped by type */}
      {componentProps.length > 0 && (
        <div className="cl-subsection">
          <span className="cl-sublabel">Propiedades del componente</span>
          <ComponentPropsList entries={componentProps} />
        </div>
      )}

      {/* Token changes → table */}
      {tokensChanged.length > 0 && (
        <div className="cl-subsection">
          <span className="cl-sublabel">Tokens cambiados</span>
          <table className="cl-table">
            <thead>
              <tr><th>Variante / Capa</th><th>Propiedad</th><th>Antes</th><th>Después</th></tr>
            </thead>
            <tbody>
              {tokensChanged.map((d, i) => {
                const p = parseDetail(d.details)
                if (!p || !p.after) return null
                return (
                  <tr key={i}>
                    <td className="td-variant">{shortVariant(p.layer)}</td>
                    <td>{humanProp(p.prop)}</td>
                    <td><code>{shortToken(p.before)}</code></td>
                    <td><code>{shortToken(p.after)}</code></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tokens removed — grouped by token name */}
      {tokensRemoved.length > 0 && (
        <div className="cl-subsection">
          <span className="cl-sublabel">Tokens eliminados</span>
          <GroupedTokenList entries={tokensRemoved} />
        </div>
      )}

      {/* Tokens added — grouped by token, showing layer + property */}
      {tokensAdded.length > 0 && (
        <div className="cl-subsection">
          <span className="cl-sublabel">Tokens aplicados</span>
          <AppliedTokensList entries={tokensAdded} />
        </div>
      )}

      {/* Size changes */}
      {sizeChanges.length > 0 && (
        <div className="cl-subsection">
          <span className="cl-sublabel">Tamaños ajustados</span>
          <table className="cl-table">
            <thead>
              <tr><th>Capa</th><th>Propiedad</th><th>Antes</th><th>Después</th></tr>
            </thead>
            <tbody>
              {sizeChanges.map((d, i) => {
                const p = parseDetail(d.details)
                if (!p || !p.after) return null
                return (
                  <tr key={i}>
                    <td>{p.layer}</td>
                    <td>{humanProp(p.prop)}</td>
                    <td><code>{p.before}</code></td>
                    <td><code>{p.after}</code></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Other prop changes */}
      {otherPropChanges.length > 0 && (
        <div className="cl-subsection">
          <span className="cl-sublabel">Propiedades ajustadas</span>
          <table className="cl-table">
            <thead>
              <tr><th>Capa</th><th>Propiedad</th><th>Antes</th><th>Después</th></tr>
            </thead>
            <tbody>
              {otherPropChanges.map((d, i) => {
                const p = parseDetail(d.details)
                if (!p || !p.after) return null
                return (
                  <tr key={i}>
                    <td>{p.layer}</td>
                    <td>{humanProp(p.prop)}</td>
                    <td><code>{p.before}</code></td>
                    <td><code>{p.after}</code></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

// Component properties list — grouped by type (Boolean prop, Text prop, etc.)
function ComponentPropsList({ entries }: { entries: DiffEntry[] }) {
  // Each entry.details is "name|TYPE, name|TYPE, ..."
  const byType = useMemo(() => {
    const map = new Map<string, string[]>() // humanType → [names]
    for (const d of entries) {
      for (const pair of d.details.split(', ')) {
        const [name, type] = pair.split('|')
        if (!name) continue
        // Strip leading Figma convention emojis (✏️ text, 👁️ boolean, 🔄/🔁 swap) — type is shown explicitly
        const cleanName = name.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\s]+/u, '').trim()
        const human = humanPropType(type || 'UNKNOWN')
        if (!map.has(human)) map.set(human, [])
        map.get(human)!.push(cleanName || name.trim())
      }
    }
    return map
  }, [entries])

  return (
    <div className="cl-props-list">
      {[...byType.entries()].map(([type, names], i) => (
        <div key={i} className="cl-prop-type-row">
          <span className="cl-prop-type-label">{type}</span>
          <div className="cl-props-tags">
            {names.map((n, j) => <span key={j} className="cl-prop-tag">{n}</span>)}
          </div>
        </div>
      ))}
    </div>
  )
}

// Applied tokens list — grouped by token name, showing each layer + property where it's applied
function AppliedTokensList({ entries }: { entries: DiffEntry[] }) {
  const byToken = useMemo(() => {
    const map = new Map<string, Array<{ layer: string; prop: string }>>()
    for (const d of entries) {
      const b = parseBinding(d.details)
      if (!b) continue
      if (!map.has(b.token)) map.set(b.token, [])
      map.get(b.token)!.push({ layer: b.layer, prop: b.prop })
    }
    return map
  }, [entries])

  return (
    <div className="cl-applied-tokens">
      {[...byToken.entries()].map(([token, usages], i) => (
        <div key={i} className="cl-token-group">
          <div className="cl-token-header">
            <code className="cl-token-name">{cleanToken(token)}</code>
            {usages.length > 1 && (
              <span className="cl-token-usage-count">{usages.length} usos</span>
            )}
          </div>
          <table className="cl-table cl-token-usage-table">
            <thead>
              <tr><th>Capa</th><th>Se aplica en</th></tr>
            </thead>
            <tbody>
              {usages.map((u, j) => (
                <tr key={j}>
                  <td className="td-variant">{u.layer}</td>
                  <td>{humanProp(u.prop)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

// Group token removals: show token name + how many variants lost it
function GroupedTokenList({ entries }: { entries: DiffEntry[] }) {
  const grouped = useMemo(() => {
    const map = new Map<string, string[]>() // tokenKey → [variantNames]
    for (const d of entries) {
      const p = parseDetail(d.details)
      const tokenKey = p ? `${humanProp(p.prop)}: ${shortToken(p.before)}` : d.details
      const variantLabel = p ? shortVariant(p.layer) : d.component
      if (!map.has(tokenKey)) map.set(tokenKey, [])
      map.get(tokenKey)!.push(variantLabel)
    }
    return map
  }, [entries])

  return (
    <ul className="cl-list cl-list--removed">
      {[...grouped.entries()].slice(0, 12).map(([tokenKey, variants], i) => (
        <li key={i}>
          <span className="token-key">{tokenKey}</span>
          {variants.length > 1 && (
            <span className="token-variants"> — {variants.length} variantes</span>
          )}
        </li>
      ))}
      {grouped.size > 12 && <li className="cl-more">+{grouped.size - 12} más</li>}
    </ul>
  )
}

function ChangelogInfo() {
  return (
    <div className="changelog-info">
      <h3 className="info-title">¿Cómo funciona este Changelog?</h3>

      <div className="info-grid">
        <section className="info-section">
          <h4>Proceso automático</h4>
          <p>
            Todos los días a las <strong>9:00 AM (Argentina)</strong> un workflow de GitHub Actions
            consulta la API de Figma, compara el estado actual de cada archivo contra el snapshot
            guardado del día anterior, y si detecta diferencias genera una entrada nueva en el
            changelog. El resultado se commitea automáticamente al repositorio y Vercel redeploya
            este dashboard.
          </p>
          <p>
            También se puede disparar manualmente desde la pestaña <strong>Actions</strong> del
            repositorio → "Daily Changelog" → "Run workflow".
          </p>
        </section>

        <section className="info-section">
          <h4>Archivos monitoreados</h4>
          <ul className="info-list">
            <li>
              <span className="info-badge">Components</span>
              Librería principal de componentes del Design System
            </li>
            <li>
              <span className="info-badge">Templates</span>
              Librería de templates y layouts
            </li>
            <li>
              <span className="info-badge">Assets</span>
              Librería de assets, íconos y pictogramas
            </li>
          </ul>
        </section>

        <section className="info-section">
          <h4>Qué detecta</h4>
          <ul className="info-list">
            <li><strong>Componentes/variantes nuevos o eliminados</strong> — cuando se agrega o quita un COMPONENT o COMPONENT_SET</li>
            <li><strong>Tokens cambiados</strong> — cuando una variable de Figma vinculada a una propiedad cambia (fill, stroke, gap, padding, border radius, etc.)</li>
            <li><strong>Tokens agregados o eliminados</strong> — cuando se vincula o desvincula un token de una propiedad</li>
            <li><strong>Tamaños ajustados</strong> — cuando cambia el width/height de layers dentro de un componente</li>
            <li><strong>Propiedades ajustadas</strong> — cambios en opacidad, font size, font weight, efectos, etc.</li>
          </ul>
        </section>

        <section className="info-section">
          <h4>Propiedades trackeadas</h4>
          <div className="info-tags">
            {[
              'fills', 'strokes', 'strokeWeight',
              'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
              'itemSpacing (gap)',
              'topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius',
              'opacity', 'width', 'height',
              'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing',
              'visible', 'blendMode', 'effects (sombras/blurs)',
              'minWidth', 'maxWidth', 'minHeight', 'maxHeight',
            ].map(p => <span key={p} className="info-tag">{p}</span>)}
          </div>
        </section>

        <section className="info-section">
          <h4>Procedimiento técnico</h4>
          <ol className="info-list info-list--ordered">
            <li>El script lee el archivo de Figma via API con profundidad 8 niveles</li>
            <li>Extrae todos los COMPONENT y COMPONENT_SET con sus bindings de variables y propiedades visuales</li>
            <li>Compara contra el snapshot guardado en <code>src/data/snapshots/latest-[archivo].json</code></li>
            <li>Genera un diff estructurado y lo agrega a <code>src/data/changelog.json</code></li>
            <li>Si hay cambios, el bot commitea con el mensaje <code>changelog: auto-update YYYY-MM-DD</code></li>
            <li>Vercel detecta el push y redeploya el dashboard automáticamente</li>
          </ol>
        </section>

        <section className="info-section">
          <h4>Lo que no detecta</h4>
          <ul className="info-list">
            <li>Cambios de posición en el canvas (mover frames)</li>
            <li>Cambios en descripciones o anotaciones</li>
            <li>Cambios en componentes externos (instancias de otras librerías)</li>
            <li>Colores no vinculados a tokens (hard-coded)</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
