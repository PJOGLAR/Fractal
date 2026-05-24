import { useState, useMemo } from 'react'
import { DashboardData, TokenBinding } from '../types'
import './ComponentIndex.css'

interface ComponentIndexProps {
  data: DashboardData
}

function normalizeProperty(property: string): string {
  if (property === 'fills' || property === 'textRangeFills') return 'background'
  if (property === 'strokes' || property.startsWith('stroke')) return 'border'
  if (property.startsWith('padding')) return 'padding'
  if (property === 'itemSpacing') return 'spacing'
  if (property.includes('Radius') || property.includes('radius')) return 'border-radius'
  if (property === 'fontSize' || property === 'fontFamily' || property === 'fontWeight' || property === 'lineHeight' || property === 'letterSpacing') return 'typography'
  if (property === 'width' || property === 'height') return 'size'
  return property
}

function getPropertyGroups(bindings: TokenBinding[]): { group: string; count: number }[] {
  const map: Record<string, number> = {}
  for (const b of bindings) {
    const group = normalizeProperty(b.property)
    map[group] = (map[group] || 0) + 1
  }
  return Object.entries(map)
    .map(([group, count]) => ({ group, count }))
    .sort((a, b) => b.count - a.count)
}

export function ComponentIndex({ data }: ComponentIndexProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null)
  const [propertyFilter, setPropertyFilter] = useState<string | null>(null)

  const categories = useMemo(
    () => [...new Set(data.components.map(c => c.category))].sort(),
    [data]
  )

  // Lookup token hex by name
  const tokenHexMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const t of [...data.foundations.primitiveTokens, ...data.foundations.semanticTokens]) {
      if (t.hex) map[t.name] = t.hex
      else if (typeof t.value === 'string' && t.value.startsWith('#')) map[t.name] = t.value
    }
    return map
  }, [data])

  // Lookup token aliasName by name
  const tokenAliasMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const t of [...data.foundations.primitiveTokens, ...data.foundations.semanticTokens]) {
      if (t.aliasName) map[t.name] = t.aliasName
    }
    return map
  }, [data])

  const filteredComponents = useMemo(
    () =>
      selectedCategory
        ? data.components.filter(c => c.category === selectedCategory)
        : data.components,
    [data, selectedCategory]
  )

  return (
    <div className="component-index">
      <h2 className="page-title">Componentes</h2>
      <p className="page-description">Índice de componentes con sus tokens aplicados</p>

      <div className="filter-bar">
        <button
          className={`filter-chip ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          Todos ({data.components.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat} ({data.components.filter(c => c.category === cat).length})
          </button>
        ))}
      </div>

      <div className="component-list">
        {filteredComponents.map(comp => {
          const isExpanded = expandedComponent === comp.componentId
          const propGroups = isExpanded ? getPropertyGroups(comp.bindings) : []
          const filteredBindings = propertyFilter
            ? comp.bindings.filter(b => normalizeProperty(b.property) === propertyFilter)
            : comp.bindings

          return (
            <div key={comp.componentId} className="component-card">
              <button
                className="component-header"
                onClick={() => {
                  setExpandedComponent(isExpanded ? null : comp.componentId)
                  setPropertyFilter(null)
                }}
                aria-expanded={isExpanded}
              >
                <div className="component-info">
                  <span className="component-name">{comp.componentName}</span>
                  <span className="component-category">{comp.category}</span>
                </div>
                <div className="component-meta">
                  <span className="binding-count">{comp.bindings.length} tokens</span>
                  <span className="expand-icon">
                    {isExpanded ? '−' : '+'}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="component-bindings">
                  {/* Property type filters */}
                  <div className="binding-filters">
                    <button
                      className={`binding-filter-chip ${propertyFilter === null ? 'active' : ''}`}
                      onClick={() => setPropertyFilter(null)}
                    >
                      Todos ({comp.bindings.length})
                    </button>
                    {propGroups.map(({ group, count }) => (
                      <button
                        key={group}
                        className={`binding-filter-chip ${propertyFilter === group ? 'active' : ''}`}
                        onClick={() => setPropertyFilter(group)}
                      >
                        {group} ({count})
                      </button>
                    ))}
                  </div>

                  <table className="bindings-table">
                    <thead>
                      <tr>
                        <th>Token</th>
                        <th>Propiedad</th>
                        <th>Capa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBindings.map((binding, i) => (
                        <tr key={i}>
                          <td>
                            <div className="token-cell">
                              {binding.tokenName && tokenHexMap[binding.tokenName] ? (
                                <span
                                  className="color-swatch-inline"
                                  style={{ background: tokenHexMap[binding.tokenName] }}
                                />
                              ) : (
                                <span className="color-swatch-inline empty" />
                              )}
                              <div className="token-cell-text">
                                <span className="token-badge">
                                  {binding.tokenName || binding.tokenId}
                                </span>
                                {binding.tokenName && tokenAliasMap[binding.tokenName] && (
                                  <span className="token-alias-inline">
                                    → {tokenAliasMap[binding.tokenName]}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <code className="property-name">{binding.property}</code>
                          </td>
                          <td className="layer-name">{binding.layerName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
