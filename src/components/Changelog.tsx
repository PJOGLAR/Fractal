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
                <span className="changelog-file-name">{entry.fileName}</span>
              </div>
              <p className="changelog-summary">{entry.summary}</p>
            </button>

            {expandedId === entry.id && (
              <div className="changelog-entry-details">
                <FormattedChanges changes={entry.changes} />
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

/** Renders changes grouped by section like the dev script output */
function FormattedChanges({ changes }: { changes: DiffEntry[] }) {
  const componentAdded = changes.filter(d => d.type === 'component_added')
  const componentRemoved = changes.filter(d => d.type === 'component_removed')
  const componentRenamed = changes.filter(d => d.type === 'component_renamed')

  // Group remaining changes by component
  const changedComponents = useMemo(() => {
    const map = new Map<string, { name: string; nodeId: string; tokens: DiffEntry[]; properties: DiffEntry[] }>()
    for (const d of changes) {
      if (d.type === 'component_added' || d.type === 'component_removed' || d.type === 'component_renamed') continue
      const key = `${d.component}|${d.nodeId || ''}`
      if (!map.has(key)) {
        map.set(key, { name: d.component, nodeId: d.nodeId || '', tokens: [], properties: [] })
      }
      const entry = map.get(key)!
      if (d.type === 'property_changed') {
        entry.properties.push(d)
      } else {
        entry.tokens.push(d)
      }
    }
    return map
  }, [changes])

  return (
    <div className="formatted-changes">
      {/* Componentes nuevos */}
      {componentAdded.length > 0 && (
        <section className="change-section">
          <h4 className="change-section-title">Componentes nuevos</h4>
          <ul className="change-list-items">
            {componentAdded.filter(d => !d.component.includes('=')).map((d, i) => {
              const variants = componentAdded.filter(v => v.component.includes('='))
              return (
                <li key={i} className="change-item-added">
                  + {d.component}{variants.length > 0 && ` (${variants.length} variantes)`}
                </li>
              )
            })}
            {componentAdded.filter(d => !d.component.includes('=')).length === 0 &&
              componentAdded.filter(d => d.component.includes('=')).map((d, i) => (
                <li key={i} className="change-item-added">+ Variante: {d.component}</li>
              ))
            }
          </ul>
        </section>
      )}

      {/* Componentes eliminados */}
      {componentRemoved.length > 0 && (
        <section className="change-section">
          <h4 className="change-section-title">Variantes/componentes eliminados</h4>
          <ul className="change-list-items">
            {componentRemoved.filter(d => !d.component.includes('=')).map((d, i) => {
              const variants = componentRemoved.filter(v => v.component.includes('='))
              return (
                <li key={i} className="change-item-removed">
                  - {d.component}{variants.length > 0 && ` (${variants.length} variantes)`}
                </li>
              )
            })}
            {componentRemoved.filter(d => !d.component.includes('=')).length === 0 &&
              componentRemoved.filter(d => d.component.includes('=')).map((d, i) => (
                <li key={i} className="change-item-removed">- {d.component}</li>
              ))
            }
          </ul>
        </section>
      )}

      {/* Renombrados */}
      {componentRenamed.length > 0 && (
        <section className="change-section">
          <h4 className="change-section-title">Renombrados</h4>
          <ul className="change-list-items">
            {componentRenamed.map((d, i) => (
              <li key={i} className="change-item-renamed">{d.details}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Cambios en componentes (agrupados) */}
      {changedComponents.size > 0 && (
        <section className="change-section">
          <h4 className="change-section-title">Cambios en componentes</h4>
          {[...changedComponents.values()].map((comp, i) => {
            const tokenChanges = comp.tokens.filter(d => d.type === 'binding_changed')
            const tokenAdded = comp.tokens.filter(d => d.type === 'binding_added')
            const tokenRemoved = comp.tokens.filter(d => d.type === 'binding_removed')

            return (
              <div key={i} className="component-change-block">
                <h5 className="component-change-name">{comp.name}</h5>

                {tokenChanges.length > 0 && (
                  <div className="token-change-group">
                    <span className="token-group-label">Tokens cambiados:</span>
                    <ul>
                      {tokenChanges.slice(0, 10).map((d, j) => {
                        const parts = d.details.split(': ')
                        return <li key={j}>{parts[0]}: <span className="token-value">{parts.slice(1).join(': ')}</span></li>
                      })}
                      {tokenChanges.length > 10 && <li className="more">...+{tokenChanges.length - 10} más</li>}
                    </ul>
                  </div>
                )}

                {tokenAdded.length > 0 && (
                  <div className="token-change-group">
                    <span className="token-group-label">Tokens agregados:</span>
                    <ul>
                      {tokenAdded.slice(0, 10).map((d, j) => (
                        <li key={j} className="change-item-added">+ {d.details}</li>
                      ))}
                      {tokenAdded.length > 10 && <li className="more">...+{tokenAdded.length - 10} más</li>}
                    </ul>
                  </div>
                )}

                {tokenRemoved.length > 0 && (
                  <div className="token-change-group">
                    <span className="token-group-label">Tokens eliminados:</span>
                    <ul>
                      {tokenRemoved.slice(0, 10).map((d, j) => (
                        <li key={j} className="change-item-removed">- {d.details}</li>
                      ))}
                      {tokenRemoved.length > 10 && <li className="more">...+{tokenRemoved.length - 10} más</li>}
                    </ul>
                  </div>
                )}

                {comp.properties.length > 0 && (
                  <div className="token-change-group">
                    <span className="token-group-label">Propiedades:</span>
                    <ul>
                      {comp.properties.slice(0, 10).map((d, j) => {
                        const parts = d.details.split(': ')
                        return <li key={j}>{parts[0]}: <span className="token-value">{parts.slice(1).join(': ')}</span></li>
                      })}
                      {comp.properties.length > 10 && <li className="more">...+{comp.properties.length - 10} más</li>}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </section>
      )}
    </div>
  )
}
