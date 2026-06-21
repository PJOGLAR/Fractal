import { useState, useMemo } from 'react'
import changelogData from '../data/changelog.json'
import './Changelog.css'

interface DiffEntry {
  type: string
  component: string
  nodeId?: string
  details: string
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
    const labels = new Set<string>()
    for (const e of entries) labels.add(e.fileLabel)
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

  // Group binding/property changes by parent component
  const componentChanges = useMemo(() => {
    const map = new Map<string, {
      tokensChanged: DiffEntry[]
      tokensAdded: DiffEntry[]
      tokensRemoved: DiffEntry[]
      propsChanged: DiffEntry[]
    }>()
    for (const c of filtered) {
      if (['component_added', 'component_removed', 'component_renamed'].includes(c.type)) continue
      const key = c.component
      if (!map.has(key)) map.set(key, { tokensChanged: [], tokensAdded: [], tokensRemoved: [], propsChanged: [] })
      const g = map.get(key)!
      if (c.type === 'binding_changed') g.tokensChanged.push(c)
      else if (c.type === 'binding_added') g.tokensAdded.push(c)
      else if (c.type === 'binding_removed') g.tokensRemoved.push(c)
      else if (c.type === 'property_changed') g.propsChanged.push(c)
    }
    return map
  }, [filtered])

  return (
    <div className="clean-changelog">

      {/* Variantes eliminadas */}
      {removed.length > 0 && (
        <section className="cl-section">
          <h4 className="cl-section-title">
            <span className="cl-badge cl-badge--removed">−</span>
            Variantes eliminadas ({removed.length})
          </h4>
          <VariantList variants={removed.map(d => d.component)} type="removed" />
        </section>
      )}

      {/* Variantes nuevas */}
      {added.length > 0 && (
        <section className="cl-section">
          <h4 className="cl-section-title">
            <span className="cl-badge cl-badge--added">+</span>
            Variantes nuevas ({added.length})
          </h4>
          <VariantList variants={added.map(d => d.component)} type="added" />
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

      {/* Cambios por componente */}
      {[...componentChanges.entries()].map(([compName, g]) => (
        <ComponentChangeBlock key={compName} name={compName} {...g} />
      ))}
    </div>
  )
}

// Render a list of variants, grouped by common properties
function VariantList({ variants, type }: { variants: string[]; type: 'added' | 'removed' }) {
  const withProps = variants.filter(v => v.includes('='))
  const plain = variants.filter(v => !v.includes('='))

  // Find common props across variant names
  const parsePropMap = (name: string) => {
    const map: Record<string, string> = {}
    for (const p of name.split(',')) {
      const [k, v] = p.split('=').map(s => s.trim())
      if (k && v) map[k] = v
    }
    return map
  }

  const propMaps = withProps.map(parsePropMap)
  const firstMap = propMaps[0] || {}
  const commonProps = Object.entries(firstMap).filter(([k, v]) => propMaps.every(m => m[k] === v))
  const commonKeys = new Set(commonProps.map(([k]) => k))

  return (
    <div className="variant-list-block">
      {commonProps.length > 0 && (
        <p className="cl-hint">
          {commonProps.map(([k, v]) => `${k}: ${v}`).join(' · ')}
        </p>
      )}
      <ul className={`cl-list cl-list--${type}`}>
        {withProps.map((v, i) => {
          // Show only the non-common props
          const propMap = parsePropMap(v)
          const diffProps = Object.entries(propMap).filter(([k]) => !commonKeys.has(k))
          const label = diffProps.length > 0
            ? diffProps.map(([, val]) => val).join(' / ')
            : shortVariant(v)
          return <li key={i}>{label}</li>
        })}
        {plain.map((v, i) => <li key={i}>{v}</li>)}
      </ul>
    </div>
  )
}

function ComponentChangeBlock({
  name, tokensChanged, tokensAdded, tokensRemoved, propsChanged
}: {
  name: string
  tokensChanged: DiffEntry[]
  tokensAdded: DiffEntry[]
  tokensRemoved: DiffEntry[]
  propsChanged: DiffEntry[]
}) {
  const hasContent = tokensChanged.length + tokensAdded.length + tokensRemoved.length + propsChanged.length > 0
  if (!hasContent) return null

  // Size/dimension changes
  const sizeChanges = propsChanged.filter(d => {
    const p = parseDetail(d.details)
    return p && ['size.width', 'size.height', 'width', 'height'].includes(p.prop)
  })
  const otherPropChanges = propsChanged.filter(d => !sizeChanges.includes(d))

  return (
    <section className="cl-section">
      <h4 className="cl-section-title cl-component-title">{shortVariant(name)}</h4>

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

      {/* Tokens added */}
      {tokensAdded.length > 0 && (
        <div className="cl-subsection">
          <span className="cl-sublabel">Tokens aplicados</span>
          <ul className="cl-list cl-list--added">
            {tokensAdded.slice(0, 8).map((d, i) => {
              const p = parseDetail(d.details)
              return <li key={i}>{p ? `${shortVariant(p.layer)} · ${humanProp(p.prop)}` : d.details}</li>
            })}
            {tokensAdded.length > 8 && <li className="cl-more">+{tokensAdded.length - 8} más</li>}
          </ul>
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
