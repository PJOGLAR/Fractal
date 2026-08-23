import { useMemo, useState } from 'react'
import changelogData from '../data/changelog.json'
import './Changelog.css'

interface DiffEntry {
  type: string
  component: string
  nodeId?: string
  details: string
  parentName?: string
}

interface DetailedChange {
  property?: string
  layer?: string
  from?: string
  to?: string
  token?: string
}

interface DetailedVariant {
  tokens: {
    changed: DetailedChange[]
    added: DetailedChange[]
    removed: DetailedChange[]
  }
  properties: DetailedChange[]
}

interface DetailedComponent {
  name: string
  isVariant: boolean
  variants: Record<string, DetailedVariant>
  summary: {
    tokensChanged: number
    tokensAdded: number
    tokensRemoved: number
    propertiesChanged: number
  }
}

interface ChangelogEntry {
  id: string
  timestamp: string
  fileKey: string
  fileName: string
  fileLabel: string
  summary: string
  changes: DiffEntry[]
  detailed?: Record<string, DetailedComponent>
}

interface CollapsedChanges {
  nuevos: string[]
  eliminados: string[]
  iterados: string[]
}

// A "real" component name: not a variant (no "="), not an internal/deprecated node (no "⛔").
function isRealComponent(name?: string): name is string {
  return !!name && !name.includes('=') && !name.includes('⛔')
}

// Collapse ALL raw diff entries of an entry into three simple buckets of component names:
// Nuevos (agregados), Eliminados (removidos), Iterados (cualquier otro cambio).
// Todo se resuelve al componente de nivel superior; los detalles internos se descartan.
function collapseChanges(changes: DiffEntry[]): CollapsedChanges {
  const nuevos = new Set<string>()
  const eliminados = new Set<string>()
  const iterados = new Set<string>()

  for (const ch of changes) {
    const comp = ch.component || ''
    const parent = ch.parentName

    switch (ch.type) {
      case 'component_added':
        if (isRealComponent(comp)) nuevos.add(comp)
        else if (isRealComponent(parent)) iterados.add(parent)
        break
      case 'component_removed':
        if (isRealComponent(comp)) eliminados.add(comp)
        else if (isRealComponent(parent)) iterados.add(parent)
        break
      case 'component_deprecated': {
        const oldName = ch.details.split('→')[0].trim()
        if (isRealComponent(oldName)) eliminados.add(oldName)
        else if (isRealComponent(comp)) eliminados.add(comp)
        break
      }
      case 'component_renamed': {
        const newName = ch.details.split('→')[1]?.trim() || comp
        if (isRealComponent(newName)) iterados.add(newName)
        break
      }
      case 'variant_added':
      case 'variant_removed':
        // Una variante nueva/eliminada = el set existente fue iterado
        if (isRealComponent(parent)) iterados.add(parent)
        else if (isRealComponent(comp)) iterados.add(comp)
        break
      default:
        // binding/property/prop/anidación/etc. → el componente fue iterado
        if (isRealComponent(comp)) iterados.add(comp)
        else if (isRealComponent(parent)) iterados.add(parent)
    }
  }

  // Un componente no puede estar en dos buckets a la vez
  for (const n of nuevos) iterados.delete(n)
  for (const n of eliminados) iterados.delete(n)

  return {
    nuevos: [...nuevos].sort(),
    eliminados: [...eliminados].sort(),
    iterados: [...iterados].sort(),
  }
}

// Resumen de una línea a partir de los buckets colapsados.
function collapsedSummary(c: CollapsedChanges): string {
  const parts: string[] = []
  if (c.nuevos.length) parts.push(`${c.nuevos.length} nuevo${c.nuevos.length > 1 ? 's' : ''}`)
  if (c.eliminados.length) parts.push(`${c.eliminados.length} eliminado${c.eliminados.length > 1 ? 's' : ''}`)
  if (c.iterados.length) parts.push(`${c.iterados.length} iterado${c.iterados.length > 1 ? 's' : ''}`)
  return parts.length ? parts.join(' · ') : 'Sin cambios de componentes'
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

  // Colapsar cada entrada una sola vez
  const collapsedByEntry = useMemo(() => {
    const m = new Map<string, CollapsedChanges>()
    for (const e of entries) m.set(e.id, collapseChanges(e.changes))
    return m
  }, [entries])

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
        {filtered.map(entry => {
          const collapsed = collapsedByEntry.get(entry.id)!
          return (
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
                <p className="changelog-summary">{collapsedSummary(collapsed)}</p>
              </button>

              {expandedId === entry.id && (
                <div className="changelog-entry-details">
                  <CleanChangelog collapsed={collapsed} detailed={entry.detailed} />
                </div>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}

// Vista simplificada: tres listas de componentes.
// Para "iterados", si la entrada tiene `detailed` con desglose por capa, se muestran las capas afectadas.
function CleanChangelog({
  collapsed,
  detailed,
}: {
  collapsed: CollapsedChanges
  detailed?: Record<string, DetailedComponent>
}) {
  const { nuevos, eliminados, iterados } = collapsed

  if (!nuevos.length && !eliminados.length && !iterados.length) {
    return <p className="cl-empty-detail">Sin cambios a nivel de componente.</p>
  }

  return (
    <div className="clean-changelog">
      {nuevos.length > 0 && (
        <section className="cl-section">
          <h4 className="cl-section-title">
            <span className="cl-badge cl-badge--added">+</span>
            Componentes nuevos ({nuevos.length})
          </h4>
          <ul className="cl-name-list cl-name-list--added">
            {nuevos.map(n => <li key={n}>{n}</li>)}
          </ul>
        </section>
      )}

      {eliminados.length > 0 && (
        <section className="cl-section">
          <h4 className="cl-section-title">
            <span className="cl-badge cl-badge--removed">−</span>
            Componentes eliminados ({eliminados.length})
          </h4>
          <ul className="cl-name-list cl-name-list--removed">
            {eliminados.map(n => <li key={n}>{n}</li>)}
          </ul>
        </section>
      )}

      {iterados.length > 0 && (
        <section className="cl-section">
          <h4 className="cl-section-title">
            <span className="cl-badge cl-badge--changed">↻</span>
            Componentes iterados ({iterados.length})
          </h4>
          <IteratedList names={iterados} detailed={detailed} />
        </section>
      )}
    </div>
  )
}

// Lista de componentes iterados. Si la entrada tiene `detailed`, muestra un desglose por capa.
// Si no (entradas viejas), cae al listado plano de nombres.
function IteratedList({
  names,
  detailed,
}: {
  names: string[]
  detailed?: Record<string, DetailedComponent>
}) {
  // Componentes que tienen desglose disponible
  const withDetail = detailed ? names.filter(n => detailed[n]) : []
  const withoutDetail = detailed ? names.filter(n => !detailed[n]) : names

  return (
    <>
      {withDetail.length > 0 && (
        <div className="cl-iterated-detailed">
          {withDetail.map(name => (
            <IteratedComponent key={name} name={name} detail={detailed![name]} />
          ))}
        </div>
      )}

      {withoutDetail.length > 0 && (
        <ul className="cl-name-list cl-name-list--changed">
          {withoutDetail.map(n => <li key={n}>{n}</li>)}
        </ul>
      )}
    </>
  )
}

// Un componente iterado con su desglose por capa y variante.
function IteratedComponent({ name, detail }: { name: string; detail: DetailedComponent }) {
  // Aplanar cambios de todas las variantes, marcando la variante en cada fila
  type Row = {
    variant: string
    layer: string
    property: string
    kind: 'token-changed' | 'token-added' | 'token-removed' | 'property-changed'
    from?: string
    to?: string
    token?: string
  }

  const rows: Row[] = []
  for (const [variantKey, variant] of Object.entries(detail.variants)) {
    const variantLabel = variantKey === '_base' ? '' : variantKey
    for (const c of variant.tokens.changed) {
      rows.push({
        variant: variantLabel,
        layer: c.layer || '',
        property: c.property || '',
        kind: 'token-changed',
        from: c.from,
        to: c.to,
      })
    }
    for (const c of variant.tokens.added) {
      rows.push({
        variant: variantLabel,
        layer: c.layer || '',
        property: c.property || '',
        kind: 'token-added',
        token: c.token,
      })
    }
    for (const c of variant.tokens.removed) {
      rows.push({
        variant: variantLabel,
        layer: c.layer || '',
        property: c.property || '',
        kind: 'token-removed',
        token: c.token,
      })
    }
    for (const c of variant.properties) {
      rows.push({
        variant: variantLabel,
        layer: c.layer || '',
        property: c.property || '',
        kind: 'property-changed',
        from: c.from,
        to: c.to,
      })
    }
  }

  if (rows.length === 0) {
    // Componente en `iterados` pero sin filas de detalle: mostrarlo como tag simple
    return (
      <div className="cl-iterated-item">
        <div className="cl-iterated-name">{name}</div>
      </div>
    )
  }

  const hasVariants = rows.some(r => r.variant !== '')
  const MAX_ROWS = 20
  const visibleRows = rows.slice(0, MAX_ROWS)
  const hiddenCount = rows.length - visibleRows.length

  return (
    <div className="cl-iterated-item">
      <div className="cl-iterated-name">
        {name}
        <span className="cl-iterated-count">{rows.length} cambio{rows.length > 1 ? 's' : ''}</span>
      </div>
      <table className="cl-table cl-iterated-table">
        <thead>
          <tr>
            {hasVariants && <th>Variante</th>}
            <th>Capa</th>
            <th>Propiedad</th>
            <th>Cambio</th>
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((r, i) => (
            <tr key={i}>
              {hasVariants && <td className="td-variant">{r.variant || '—'}</td>}
              <td>{r.layer || '—'}</td>
              <td><code>{r.property || '—'}</code></td>
              <td><ChangeCell row={r} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      {hiddenCount > 0 && (
        <p className="cl-iterated-more">y {hiddenCount} cambio{hiddenCount > 1 ? 's' : ''} más</p>
      )}
    </div>
  )
}

function ChangeCell({ row }: { row: { kind: string; from?: string; to?: string; token?: string } }) {
  switch (row.kind) {
    case 'token-added':
      return <span className="cl-change-added">+ {row.token || '—'}</span>
    case 'token-removed':
      return <span className="cl-change-removed">− {row.token || '—'}</span>
    case 'token-changed':
    case 'property-changed':
      return (
        <span className="cl-change-diff">
          <span className="cl-diff-from">{row.from ?? '—'}</span>
          <span className="cl-diff-arrow">→</span>
          <span className="cl-diff-to">{row.to ?? '—'}</span>
        </span>
      )
    default:
      return <span>—</span>
  }
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
          <h4>Qué muestra</h4>
          <ul className="info-list">
            <li><strong>Componentes nuevos</strong> — un COMPONENT o COMPONENT_SET que no existía antes</li>
            <li><strong>Componentes eliminados</strong> — un componente que se quitó o se deprecó</li>
            <li><strong>Componentes iterados</strong> — cualquier cambio interno (tokens, propiedades, variantes, tamaños) se resume como una iteración del componente, sin el detalle</li>
          </ul>
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
