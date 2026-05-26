import { useState, useMemo } from 'react'
import { DashboardData } from '../types'
import './TokenExplorer.css'

interface TokenExplorerProps {
  data: DashboardData
}

// Ordered categories for display
const CATEGORY_ORDER = ['Color', 'Typography', 'Spacing', 'Border', 'Asset', 'Dimension', 'Semantic dimension', 'Global dimension', 'Expressive', 'Primitives', 'Density mode', 'Semantic color']

export function TokenExplorer({ data }: TokenExplorerProps) {
  const [search, setSearch] = useState('')
  const [collectionFilter, setCollectionFilter] = useState<string | null>(null)
  const [subGroupFilter, setSubGroupFilter] = useState<string | null>(null)
  const [thirdLevelFilter, setThirdLevelFilter] = useState<string | null>(null)
  const [expandedToken, setExpandedToken] = useState<string | null>(null)

  // Combine all tokens
  const allTokens = useMemo(
    () => [...data.foundations.primitiveTokens, ...data.foundations.semanticTokens],
    [data]
  )

  // Collections with counts, ordered
  const collections = useMemo(() => {
    const map: Record<string, number> = {}
    for (const t of allTokens) {
      map[t.collection] = (map[t.collection] || 0) + 1
    }
    // Sort by predefined order, then alphabetically for any extras
    return Object.entries(map).sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a[0])
      const ib = CATEGORY_ORDER.indexOf(b[0])
      if (ia === -1 && ib === -1) return a[0].localeCompare(b[0])
      if (ia === -1) return 1
      if (ib === -1) return -1
      return ia - ib
    })
  }, [allTokens])

  // Sub-groups: first segment of token name within selected collection
  const subGroups = useMemo(() => {
    if (!collectionFilter) return []
    const subMap: Record<string, number> = {}
    for (const t of allTokens) {
      if (t.collection === collectionFilter) {
        const parts = t.name.split('/')
        const sub = parts[0]
        subMap[sub] = (subMap[sub] || 0) + 1
      }
    }
    const entries = Object.entries(subMap).sort((a, b) => b[1] - a[1])
    return entries.length > 1 ? entries : []
  }, [allTokens, collectionFilter])

  // Third level: second segment of token name (foreground, background, border, opacity)
  const thirdLevelGroups = useMemo(() => {
    if (!collectionFilter || !subGroupFilter) return []
    const map: Record<string, number> = {}
    for (const t of allTokens) {
      if (t.collection === collectionFilter) {
        const parts = t.name.split('/')
        if (parts[0] === subGroupFilter && parts.length >= 2) {
          map[parts[1]] = (map[parts[1]] || 0) + 1
        }
      }
    }
    const entries = Object.entries(map).sort((a, b) => b[1] - a[1])
    return entries.length > 1 ? entries : []
  }, [allTokens, collectionFilter, subGroupFilter])

  // Build usage map by tokenName - include property for grouping
  const usageMap = useMemo(() => {
    const map: Record<string, { componentName: string; property: string }[]> = {}
    for (const comp of data.components) {
      for (const binding of comp.bindings) {
        if (binding.tokenName) {
          if (!map[binding.tokenName]) map[binding.tokenName] = []
          map[binding.tokenName].push({ componentName: comp.componentName, property: binding.property })
        }
      }
    }
    return map
  }, [data])

  const filteredTokens = useMemo(() => {
    let tokens = allTokens

    if (collectionFilter) {
      tokens = tokens.filter(t => t.collection === collectionFilter)
    }

    if (subGroupFilter && collectionFilter) {
      tokens = tokens.filter(t => t.name.split('/')[0] === subGroupFilter)
    }

    if (thirdLevelFilter && subGroupFilter) {
      tokens = tokens.filter(t => t.name.split('/')[1] === thirdLevelFilter)
    }

    if (search) {
      const q = search.toLowerCase()
      tokens = tokens.filter(t => t.name.toLowerCase().includes(q))
    }

    return tokens
  }, [allTokens, collectionFilter, subGroupFilter, thirdLevelFilter, search])

  return (
    <div className="token-explorer">
      <h2 className="page-title">Tokens</h2>
      <p className="page-description">Explora todos los tokens del sistema y dónde se aplican</p>

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar token por nombre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Collection filter (main categories) */}
      <div className="token-type-filters">
        <button
          className={`filter-chip ${collectionFilter === null ? 'active' : ''}`}
          onClick={() => { setCollectionFilter(null); setSubGroupFilter(null); setThirdLevelFilter(null) }}
        >
          Todos ({allTokens.length})
        </button>
        {collections.map(([col, count]) => (
          <button
            key={col}
            className={`filter-chip ${collectionFilter === col ? 'active' : ''}`}
            onClick={() => { setCollectionFilter(col); setSubGroupFilter(null); setThirdLevelFilter(null) }}
          >
            {col} ({count})
          </button>
        ))}
      </div>

      {/* Sub-group filter */}
      {subGroups.length > 0 && (
        <div className="token-type-filters sub-filters">
          <button
            className={`filter-chip ${subGroupFilter === null ? 'active' : ''}`}
            onClick={() => { setSubGroupFilter(null); setThirdLevelFilter(null) }}
          >
            Todos
          </button>
          {subGroups.map(([sub, count]) => (
            <button
              key={sub}
              className={`filter-chip ${subGroupFilter === sub ? 'active' : ''}`}
              onClick={() => { setSubGroupFilter(sub); setThirdLevelFilter(null) }}
            >
              {sub} ({count})
            </button>
          ))}
        </div>
      )}

      {/* Third level filter (foreground, background, border, etc.) */}
      {thirdLevelGroups.length > 0 && (
        <div className="token-type-filters sub-filters">
          <button
            className={`filter-chip ${thirdLevelFilter === null ? 'active' : ''}`}
            onClick={() => setThirdLevelFilter(null)}
          >
            Todos
          </button>
          {thirdLevelGroups.map(([level, count]) => (
            <button
              key={level}
              className={`filter-chip ${thirdLevelFilter === level ? 'active' : ''}`}
              onClick={() => setThirdLevelFilter(level)}
            >
              {level} ({count})
            </button>
          ))}
        </div>
      )}

      <p className="results-count">{filteredTokens.length} tokens</p>

      <div className="token-list">
        {filteredTokens.map(token => {
          const usages = usageMap[token.name] || []
          const uniqueComponents = [...new Set(usages.map(u => u.componentName))]
          const componentCount = uniqueComponents.length

          // Group usages by property type
          const byProperty: Record<string, string[]> = {}
          for (const u of usages) {
            const prop = u.property
            if (!byProperty[prop]) byProperty[prop] = []
            if (!byProperty[prop].includes(u.componentName)) {
              byProperty[prop].push(u.componentName)
            }
          }

          return (
            <div key={token.id} className="token-row">
              <button
                className="token-row-header"
                onClick={() => setExpandedToken(expandedToken === token.id ? null : token.id)}
                aria-expanded={expandedToken === token.id}
              >
                <div className="token-row-left">
                  <span
                    className="color-swatch"
                    style={{
                      background: token.hex || (typeof token.value === 'string' && token.value.startsWith('#') ? token.value : 'transparent'),
                      border: token.hex || (typeof token.value === 'string' && token.value.startsWith('#')) ? undefined : '1px dashed var(--color-border)',
                    }}
                  />
                  <div className="token-name-group">
                    <span className="token-name">{token.name}</span>
                    {token.aliasName && (
                      <span className="token-alias-ref">→ {token.aliasName}</span>
                    )}
                  </div>
                </div>
                {token.hex && (
                  <span className="token-hex-value">{token.hex}</span>
                )}
                <span className={`token-type-badge ${token.aliasOf ? 'semantic' : 'primitive'}`}>
                  {token.aliasOf ? 'semántico' : 'primitivo'}
                </span>
                <span className={`token-usage-count ${componentCount === 0 ? 'unused' : ''}`}>
                  {componentCount > 0 ? `${componentCount} comp.` : 'sin uso'}
                </span>
              </button>

              {expandedToken === token.id && (
                <div className="token-detail">
                  {token.hex && (
                    <div className="token-detail-section">
                      <h4>Valor</h4>
                      <p className="token-value-display">{token.hex}</p>
                    </div>
                  )}

                  {token.aliasName && (
                    <div className="token-detail-section">
                      <h4>Alias de</h4>
                      <p className="alias-info">
                        <strong>{token.aliasName}</strong>
                        {token.aliasCollection && (
                          <span className="alias-collection"> ({token.aliasCollection})</span>
                        )}
                      </p>
                    </div>
                  )}

                  <div className="token-detail-section">
                    <h4>Impacto — {componentCount} componentes afectados</h4>
                    {componentCount > 0 ? (
                      <div className="usage-by-property">
                        {Object.entries(byProperty)
                          .sort((a, b) => b[1].length - a[1].length)
                          .map(([property, comps]) => (
                            <details key={property} className="property-group">
                              <summary className="property-group-header">
                                <code className="property-group-name">{property}</code>
                                <span className="property-group-count">{comps.length} componentes</span>
                              </summary>
                              <div className="property-group-components">
                                {comps.map(comp => (
                                  <span key={comp} className="usage-component-chip">{comp}</span>
                                ))}
                              </div>
                            </details>
                          ))}
                      </div>
                    ) : (
                      <p className="no-usage">No se usa en ningún componente</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
