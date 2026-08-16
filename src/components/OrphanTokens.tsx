import { useState, useMemo } from 'react'
import { DashboardData } from '../types'
import foundationsData from '../data/foundations-data.json'
import './OrphanTokens.css'

interface OrphanTokensProps {
  data: DashboardData
}

export function OrphanTokens({ data }: OrphanTokensProps) {
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [collectionFilter, setCollectionFilter] = useState<string | null>(null)
  const [groupFilter, setGroupFilter] = useState<string | null>(null)

  // Calculate orphan tokens: use foundations-data.json (source of truth) vs component bindings
  const orphanTokens = useMemo(() => {
    const usedTokenNames = new Set<string>()
    for (const comp of data.components) {
      for (const binding of comp.bindings) {
        if (binding.tokenName) usedTokenNames.add(binding.tokenName)
      }
    }
    
    // Use foundations-data.json as source of truth, but only semantic tokens that should be applied to components
    // Exclude: Global* (primitives), Expressive (illustrations), Screen size (layout)
    const semanticCollections = ['Color', 'Typography', 'Spacing', 'Border', 'Asset', 'Density mode']
    const allTokens = foundationsData.variables || []
    const semanticTokens = allTokens.filter(token => semanticCollections.includes(token.collection))
    const orphans = semanticTokens.filter(token => !usedTokenNames.has(token.name))
    
    // Convert to expected format
    return orphans.map(token => {
      // Handle both old and new data formats
      const tokenType = (token as any).resolvedType || (token as any).type || 'UNKNOWN'
      const tokenValue = (token as any).value
      const tokenAlias = (token as any).aliasName
      
      return {
        id: token.id,
        name: token.name,
        collection: token.collection,
        type: tokenType,
        aliasName: tokenAlias,
        // Add hex for colors if available
        hex: tokenType === 'COLOR' && typeof tokenValue === 'string' ? tokenValue : undefined
      }
    })
  }, [data])

  const tokenTypes = useMemo(
    () => [...new Set(orphanTokens.map(t => t.type))].sort(),
    [orphanTokens]
  )

  const tokenCollections = useMemo(
    () => [...new Set(orphanTokens.map(t => t.collection))].sort(),
    [orphanTokens]
  )

  // Groups based on first segment of token name (static, interactive, expressive, etc.)
  // Only show groups relevant to current collection filter
  const tokenGroups = useMemo(() => {
    const base = collectionFilter 
      ? orphanTokens.filter(t => t.collection === collectionFilter)
      : orphanTokens
    const map: Record<string, number> = {}
    for (const t of base) {
      const group = t.name.split('/')[0]
      map[group] = (map[group] || 0) + 1
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [orphanTokens, collectionFilter])

  const filteredOrphans = useMemo(() => {
    let tokens = orphanTokens
    if (typeFilter) tokens = tokens.filter(t => t.type === typeFilter)
    if (collectionFilter) tokens = tokens.filter(t => t.collection === collectionFilter)
    if (groupFilter) tokens = tokens.filter(t => t.name.split('/')[0] === groupFilter)
    return tokens
  }, [orphanTokens, typeFilter, collectionFilter, groupFilter])

  // Only count semantic tokens that should be applied to components
  const semanticCollections = ['Color', 'Typography', 'Spacing', 'Border', 'Asset', 'Density mode']
  const allTokensCount = foundationsData.variables?.filter(token => 
    semanticCollections.includes(token.collection)
  ).length || 0

  return (
    <div className="orphan-tokens">
      <h2 className="page-title">Tokens huérfanos</h2>
      <p className="page-description">
        Tokens definidos en Foundations que no están aplicados en ningún componente
      </p>

      {orphanTokens.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">✓</span>
          <p>Todos los tokens están en uso.</p>
        </div>
      ) : (
        <>
          <div className="orphan-summary">
            <span className="orphan-count">{orphanTokens.length}</span>
            <span className="orphan-label">
              de {allTokensCount} tokens no se usan en ningún componente
            </span>
          </div>

          {tokenTypes.length > 1 && (
            <div className="token-type-filters">
              <button
                className={`filter-chip ${typeFilter === null ? 'active' : ''}`}
                onClick={() => setTypeFilter(null)}
              >
                Todos los tipos ({orphanTokens.length})
              </button>
              {tokenTypes.map(type => (
                <button
                  key={type}
                  className={`filter-chip ${typeFilter === type ? 'active' : ''}`}
                  onClick={() => setTypeFilter(type)}
                >
                  {type} ({orphanTokens.filter(t => t.type === type).length})
                </button>
              ))}
            </div>
          )}

          {tokenCollections.length > 1 && (
            <div className="token-type-filters">
              <button
                className={`filter-chip ${collectionFilter === null ? 'active' : ''}`}
                onClick={() => { setCollectionFilter(null); setGroupFilter(null) }}
              >
                Todas las colecciones
              </button>
              {tokenCollections.map(col => (
                <button
                  key={col}
                  className={`filter-chip ${collectionFilter === col ? 'active' : ''}`}
                  onClick={() => { setCollectionFilter(col); setGroupFilter(null) }}
                >
                  {col}
                </button>
              ))}
            </div>
          )}

          {tokenGroups.length > 1 && (
            <div className="token-type-filters">
              <button
                className={`filter-chip ${groupFilter === null ? 'active' : ''}`}
                onClick={() => setGroupFilter(null)}
              >
                Todas las categorías
              </button>
              {tokenGroups.map(([group, count]) => (
                <button
                  key={group}
                  className={`filter-chip ${groupFilter === group ? 'active' : ''}`}
                  onClick={() => setGroupFilter(group)}
                >
                  {group} ({count})
                </button>
              ))}
            </div>
          )}

          <div className="orphan-list">
            {filteredOrphans.map(token => (
              <div key={token.id} className="orphan-card">
                <div className="orphan-card-header">
                  <div className="orphan-name-row">
                    {token.hex && (
                      <span className="color-swatch" style={{ background: token.hex }} />
                    )}
                    <span className="orphan-name">{token.name}</span>
                  </div>
                  <span className="orphan-type">{token.type}</span>
                </div>
                <div className="orphan-card-meta">
                  <span className="orphan-collection">{token.collection}</span>
                  {token.aliasName && (
                    <span className="orphan-alias">→ {token.aliasName}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
