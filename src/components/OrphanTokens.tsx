import { useState, useMemo } from 'react'
import { DashboardData } from '../types'
import './OrphanTokens.css'

interface OrphanTokensProps {
  data: DashboardData
}

export function OrphanTokens({ data }: OrphanTokensProps) {
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [collectionFilter, setCollectionFilter] = useState<string | null>(null)

  // Calculate orphan tokens: combine dynamically calculated + pre-calculated from library cross-reference
  const orphanTokens = useMemo(() => {
    const usedTokenNames = new Set<string>()
    for (const comp of data.components) {
      for (const binding of comp.bindings) {
        if (binding.tokenName) usedTokenNames.add(binding.tokenName)
      }
    }
    // Tokens in foundations not used
    const allTokens = [...data.foundations.primitiveTokens, ...data.foundations.semanticTokens]
    const fromFoundations = allTokens.filter(t => !usedTokenNames.has(t.name))
    
    // Tokens from orphanTokens array (library cross-reference)
    const fromLibrary = (data.orphanTokens || []).filter(t => !usedTokenNames.has(t.name))
    
    // Merge, deduplicate by name
    const seen = new Set<string>()
    const merged = []
    for (const t of [...fromFoundations, ...fromLibrary]) {
      if (!seen.has(t.name)) {
        seen.add(t.name)
        merged.push(t)
      }
    }
    return merged
  }, [data])

  const tokenTypes = useMemo(
    () => [...new Set(orphanTokens.map(t => t.type))].sort(),
    [orphanTokens]
  )

  const tokenCollections = useMemo(
    () => [...new Set(orphanTokens.map(t => t.collection))].sort(),
    [orphanTokens]
  )

  const filteredOrphans = useMemo(() => {
    let tokens = orphanTokens
    if (typeFilter) tokens = tokens.filter(t => t.type === typeFilter)
    if (collectionFilter) tokens = tokens.filter(t => t.collection === collectionFilter)
    return tokens
  }, [orphanTokens, typeFilter, collectionFilter])

  const allTokensCount = data.foundations.primitiveTokens.length + data.foundations.semanticTokens.length

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
                onClick={() => setCollectionFilter(null)}
              >
                Todas las colecciones
              </button>
              {tokenCollections.map(col => (
                <button
                  key={col}
                  className={`filter-chip ${collectionFilter === col ? 'active' : ''}`}
                  onClick={() => setCollectionFilter(col)}
                >
                  {col}
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
