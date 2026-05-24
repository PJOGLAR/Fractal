import { useState, useMemo } from 'react'
import { DashboardData, TokenData } from '../types'
import './ImpactAnalysis.css'

interface ImpactAnalysisProps {
  data: DashboardData
}

export function ImpactAnalysis({ data }: ImpactAnalysisProps) {
  const [search, setSearch] = useState('')
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null)

  const allTokens = useMemo(
    () => [...data.foundations.primitiveTokens, ...data.foundations.semanticTokens],
    [data]
  )

  // Build usage map by tokenName
  const usageMap = useMemo(() => {
    const map: Record<string, { componentName: string; property: string; layerName: string }[]> = {}
    for (const comp of data.components) {
      for (const binding of comp.bindings) {
        if (binding.tokenName) {
          if (!map[binding.tokenName]) map[binding.tokenName] = []
          map[binding.tokenName].push({
            componentName: comp.componentName,
            property: binding.property,
            layerName: binding.layerName,
          })
        }
      }
    }
    return map
  }, [data])

  const searchResults = useMemo(() => {
    if (!search || search.length < 2) return []
    const q = search.toLowerCase()
    return allTokens
      .filter(t => t.name.toLowerCase().includes(q))
      .slice(0, 20)
  }, [allTokens, search])

  const impactData = useMemo(() => {
    if (!selectedToken) return null
    const usages = usageMap[selectedToken.name] || []

    // Group by property type
    const byProperty: Record<string, { componentName: string; layerName: string }[]> = {}
    for (const u of usages) {
      if (!byProperty[u.property]) byProperty[u.property] = []
      byProperty[u.property].push({ componentName: u.componentName, layerName: u.layerName })
    }

    // Unique components affected
    const uniqueComponents = new Set(usages.map(u => u.componentName))

    return { usages, byProperty, blastRadius: uniqueComponents.size, uniqueComponents: [...uniqueComponents] }
  }, [selectedToken, usageMap])

  return (
    <div className="impact-analysis">
      <h2 className="page-title">Análisis de impacto</h2>
      <p className="page-description">
        Selecciona un token para ver qué componentes se verían afectados si lo cambias
      </p>

      <div className="impact-search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar token por nombre..."
          value={search}
          onChange={e => {
            setSearch(e.target.value)
            if (e.target.value.length < 2) setSelectedToken(null)
          }}
        />

        {searchResults.length > 0 && !selectedToken && (
          <div className="search-results-dropdown">
            {searchResults.map(token => (
              <button
                key={token.id}
                className="search-result-item"
                onClick={() => {
                  setSelectedToken(token)
                  setSearch(token.name)
                }}
              >
                <span className="search-result-name">{token.name}</span>
                <span className="search-result-meta">
                  {token.collection} · {token.type}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedToken && impactData && (
        <div className="impact-results">
          <div className="impact-header">
            <div className="impact-token-info">
              {selectedToken.hex && (
                <span className="color-swatch large" style={{ background: selectedToken.hex }} />
              )}
              <div>
                <h3 className="impact-token-name">{selectedToken.name}</h3>
                <p className="impact-token-meta">
                  {selectedToken.collection} · {selectedToken.type}
                </p>
              </div>
            </div>
            <div className="blast-radius">
              <span className="blast-radius-number">{impactData.blastRadius}</span>
              <span className="blast-radius-label">componentes afectados</span>
            </div>
          </div>

          {selectedToken.aliasName && (
            <div className="alias-chain">
              <h4>Cadena de alias</h4>
              <div className="alias-chain-visual">
                <span className="alias-chain-token">{selectedToken.name}</span>
                <span className="alias-chain-arrow">→</span>
                <span className="alias-chain-token">{selectedToken.aliasName}</span>
                {selectedToken.aliasCollection && (
                  <span className="alias-chain-collection">({selectedToken.aliasCollection})</span>
                )}
              </div>
            </div>
          )}

          {impactData.blastRadius === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <p>Este token no se usa en ningún componente.</p>
            </div>
          ) : (
            <div className="impact-groups">
              <h4 className="impact-groups-title">
                Uso agrupado por propiedad ({Object.keys(impactData.byProperty).length} tipos)
              </h4>
              {Object.entries(impactData.byProperty)
                .sort((a, b) => b[1].length - a[1].length)
                .map(([property, items]) => {
                  const uniqueComps = [...new Set(items.map(i => i.componentName))]
                  return (
                    <div key={property} className="impact-group">
                      <div className="impact-group-header">
                        <code className="impact-group-property">{property}</code>
                        <span className="impact-group-count">{uniqueComps.length} componentes</span>
                      </div>
                      <div className="impact-group-components">
                        {uniqueComps.map(comp => (
                          <span key={comp} className="impact-component-chip">{comp}</span>
                        ))}
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      )}

      {!selectedToken && !search && (
        <div className="empty-state">
          <span className="empty-icon">🎯</span>
          <p>Escribe el nombre de un token para analizar su impacto en el sistema.</p>
        </div>
      )}
    </div>
  )
}
