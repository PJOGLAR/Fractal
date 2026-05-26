import { useState, useMemo } from 'react'
import { DashboardData, TokenBinding } from '../types'
import './ComponentIndex.css'

interface ComponentIndexProps {
  data: DashboardData
}

function getTokenMainCategory(tokenName: string): string {
  const parts = tokenName.split('/')
  if (parts[0] === 'static' || parts[0] === 'interactive' || parts[0] === 'expressive') return 'color'
  if (parts[0] === 'gap' || parts[0] === 'padding' || parts[0] === 'vertical-padding') return 'spacing'
  if (parts[0] === 'border') return 'border'
  if (parts[0] === 'body' || parts[0] === 'heading' || parts[0] === 'display' || parts[0] === 'caption') return 'typography'
  if (parts[0] === 'icon' || parts[0] === 'pictogram' || parts[0] === 'illustration' || parts[0] === 'asset') return 'asset'
  return parts[0]
}

function getTokenSubCategory(tokenName: string): string {
  const parts = tokenName.split('/')
  // For color tokens: return "interactive", "static", "expressive"
  if (parts[0] === 'static' || parts[0] === 'interactive' || parts[0] === 'expressive') {
    return parts[0]
  }
  // For others, return first segment
  return parts[0]
}

function getTokenThirdLevel(tokenName: string): string | null {
  const parts = tokenName.split('/')
  // For color tokens: return "foreground", "background", "border", "opacity"
  if ((parts[0] === 'static' || parts[0] === 'interactive' || parts[0] === 'expressive') && parts.length >= 2) {
    return parts[1]
  }
  return null
}

function getMainCategoryGroups(bindings: TokenBinding[]): { group: string; count: number }[] {
  const map: Record<string, number> = {}
  for (const b of bindings) {
    if (b.tokenName) {
      const cat = getTokenMainCategory(b.tokenName)
      map[cat] = (map[cat] || 0) + 1
    }
  }
  return Object.entries(map)
    .map(([group, count]) => ({ group, count }))
    .sort((a, b) => b.count - a.count)
}

export function ComponentIndex({ data }: ComponentIndexProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null)
  const [propertyFilter, setPropertyFilter] = useState<string | null>(null)
  const [subFilter, setSubFilter] = useState<string | null>(null)
  const [thirdFilter, setThirdFilter] = useState<string | null>(null)

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
          const propGroups = isExpanded ? getMainCategoryGroups(comp.bindings) : []
          
          // Sub-filter groups (e.g., interactive, static, expressive within color)
          const subFilterGroups = isExpanded && propertyFilter ? (() => {
            const filtered = comp.bindings.filter(b => b.tokenName && getTokenMainCategory(b.tokenName) === propertyFilter)
            const map: Record<string, number> = {}
            for (const b of filtered) {
              if (b.tokenName) {
                const sub = getTokenSubCategory(b.tokenName)
                map[sub] = (map[sub] || 0) + 1
              }
            }
            const entries = Object.entries(map).sort((a, b) => b[1] - a[1])
            return entries.length > 1 ? entries : []
          })() : []

          // Third level groups (e.g., foreground, background within interactive)
          const thirdFilterGroups = isExpanded && propertyFilter && subFilter ? (() => {
            const filtered = comp.bindings.filter(b => b.tokenName && getTokenMainCategory(b.tokenName) === propertyFilter && getTokenSubCategory(b.tokenName) === subFilter)
            const map: Record<string, number> = {}
            for (const b of filtered) {
              if (b.tokenName) {
                const third = getTokenThirdLevel(b.tokenName)
                if (third) map[third] = (map[third] || 0) + 1
              }
            }
            const entries = Object.entries(map).sort((a, b) => b[1] - a[1])
            return entries.length > 1 ? entries : []
          })() : []

          // Apply all filters
          let filteredBindings = comp.bindings
          if (propertyFilter) {
            filteredBindings = filteredBindings.filter(b => b.tokenName && getTokenMainCategory(b.tokenName) === propertyFilter)
          }
          if (subFilter) {
            filteredBindings = filteredBindings.filter(b => b.tokenName && getTokenSubCategory(b.tokenName) === subFilter)
          }
          if (thirdFilter) {
            filteredBindings = filteredBindings.filter(b => b.tokenName && getTokenThirdLevel(b.tokenName) === thirdFilter)
          }

          return (
            <div key={comp.componentId} className="component-card">
              <button
                className="component-header"
                onClick={() => {
                  setExpandedComponent(isExpanded ? null : comp.componentId)
                  setPropertyFilter(null)
                  setSubFilter(null)
                  setThirdFilter(null)
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
                  {/* Main category filters */}
                  <div className="binding-filters">
                    <button
                      className={`binding-filter-chip ${propertyFilter === null ? 'active' : ''}`}
                      onClick={() => { setPropertyFilter(null); setSubFilter(null); setThirdFilter(null) }}
                    >
                      Todos ({comp.bindings.length})
                    </button>
                    {propGroups.map(({ group, count }) => (
                      <button
                        key={group}
                        className={`binding-filter-chip ${propertyFilter === group ? 'active' : ''}`}
                        onClick={() => { setPropertyFilter(group); setSubFilter(null); setThirdFilter(null) }}
                      >
                        {group} ({count})
                      </button>
                    ))}
                  </div>

                  {/* Sub-filter (interactive, static, expressive) */}
                  {subFilterGroups.length > 0 && (
                    <div className="binding-filters sub-level">
                      <button
                        className={`binding-filter-chip ${subFilter === null ? 'active' : ''}`}
                        onClick={() => { setSubFilter(null); setThirdFilter(null) }}
                      >
                        Todos
                      </button>
                      {subFilterGroups.map(([sub, count]) => (
                        <button
                          key={sub}
                          className={`binding-filter-chip ${subFilter === sub ? 'active' : ''}`}
                          onClick={() => { setSubFilter(sub); setThirdFilter(null) }}
                        >
                          {sub} ({count})
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Third level (foreground, background, border, opacity) */}
                  {thirdFilterGroups.length > 0 && (
                    <div className="binding-filters sub-level">
                      <button
                        className={`binding-filter-chip ${thirdFilter === null ? 'active' : ''}`}
                        onClick={() => setThirdFilter(null)}
                      >
                        Todos
                      </button>
                      {thirdFilterGroups.map(([level, count]) => (
                        <button
                          key={level}
                          className={`binding-filter-chip ${thirdFilter === level ? 'active' : ''}`}
                          onClick={() => setThirdFilter(level)}
                        >
                          {level} ({count})
                        </button>
                      ))}
                    </div>
                  )}

                  <table className="bindings-table">
                    <thead>
                      <tr>
                        <th>Token</th>
                        <th>Propiedad</th>
                        <th>Capa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBindings.map((binding, i) => {
                        const isVariant = binding.layerName.includes('=')
                        return (
                          <tr key={i} className={isVariant ? 'variant-row' : ''}>
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
                            <td className="layer-name">
                              {isVariant ? (
                                <span className="variant-name">{binding.layerName}</span>
                              ) : (
                                binding.layerName
                              )}
                            </td>
                          </tr>
                        )
                      })}
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
