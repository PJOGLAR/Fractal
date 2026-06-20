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
  stats: {
    componentsAdded: number
    componentsRemoved: number
    bindingsAdded: number
    bindingsRemoved: number
    bindingsChanged: number
    propertiesChanged?: number
  }
}

const TYPE_LABELS: Record<string, string> = {
  component_added: 'Componente agregado',
  component_removed: 'Componente eliminado',
  component_renamed: 'Componente renombrado',
  binding_added: 'Token agregado',
  binding_removed: 'Token eliminado',
  binding_changed: 'Token cambiado',
  property_changed: 'Propiedad cambiada',
}

const TYPE_ICONS: Record<string, string> = {
  component_added: '➕',
  component_removed: '🗑️',
  component_renamed: '✏️',
  binding_added: '🔗',
  binding_removed: '⛓️‍💥',
  binding_changed: '🔄',
  property_changed: '📐',
}

export function Changelog() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterFile, setFilterFile] = useState<string>('all')

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
          <select
            id="file-filter"
            value={filterFile}
            onChange={e => setFilterFile(e.target.value)}
          >
            <option value="all">Todos</option>
            {fileLabels.map(label => (
              <option key={label} value={label}>{label}</option>
            ))}
          </select>
        </div>
        <span className="changelog-count">{filtered.length} entradas</span>
      </div>

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
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
                <span className="changelog-file-badge">{entry.fileLabel}</span>
              </div>
              <p className="changelog-summary">{entry.summary}</p>
              <div className="changelog-stats-row">
                {entry.stats.componentsAdded > 0 && (
                  <span className="stat-pill added">+{entry.stats.componentsAdded} comp</span>
                )}
                {entry.stats.componentsRemoved > 0 && (
                  <span className="stat-pill removed">-{entry.stats.componentsRemoved} comp</span>
                )}
                {entry.stats.bindingsChanged > 0 && (
                  <span className="stat-pill changed">{entry.stats.bindingsChanged} tokens</span>
                )}
                {entry.stats.bindingsRemoved > 0 && (
                  <span className="stat-pill removed">-{entry.stats.bindingsRemoved} bindings</span>
                )}
                {entry.stats.bindingsAdded > 0 && (
                  <span className="stat-pill added">+{entry.stats.bindingsAdded} bindings</span>
                )}
                {(entry.stats.propertiesChanged || 0) > 0 && (
                  <span className="stat-pill changed">{entry.stats.propertiesChanged} props</span>
                )}
              </div>
            </button>

            {expandedId === entry.id && (
              <div className="changelog-entry-details">
                <ChangeList changes={entry.changes} />
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

function ChangeList({ changes }: { changes: DiffEntry[] }) {
  const grouped = useMemo(() => {
    const map: Record<string, DiffEntry[]> = {}
    for (const c of changes) {
      const key = c.type
      if (!map[key]) map[key] = []
      map[key].push(c)
    }
    return map
  }, [changes])

  return (
    <div className="change-list">
      {Object.entries(grouped).map(([type, items]) => (
        <div key={type} className="change-group">
          <h4 className="change-group-title">
            <span className="change-icon">{TYPE_ICONS[type] || '•'}</span>
            {TYPE_LABELS[type] || type} ({items.length})
          </h4>
          <ul className="change-items">
            {items.slice(0, 20).map((item, i) => (
              <li key={i} className="change-item">
                <span className="change-component">{item.component}</span>
                {item.details !== item.component && (
                  <span className="change-detail">{item.details}</span>
                )}
              </li>
            ))}
            {items.length > 20 && (
              <li className="change-item more">...y {items.length - 20} más</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  )
}
