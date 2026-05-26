import { useState, useMemo } from 'react'
import { DashboardData, TokenData } from '../types'
import './Overview.css'

interface OverviewProps {
  data: DashboardData
}

export function Overview({ data }: OverviewProps) {
  const [showAllTokens, setShowAllTokens] = useState(false)
  const [impactSearch, setImpactSearch] = useState('')
  const [selectedToken, setSelectedToken] = useState<TokenData | null>(null)

  const stats = useMemo(() => {
    const allTokens = [...data.foundations.primitiveTokens, ...data.foundations.semanticTokens]
    const totalTokens = allTokens.length

    const semanticTokens = allTokens.filter(t => t.aliasOf)
    const primitiveTokens = allTokens.filter(t => !t.aliasOf)

    const mainComponents = data.components.filter(c => !c.componentName.includes('⛔'))

    const usedTokenNames = new Set<string>()
    for (const comp of data.components) {
      for (const binding of comp.bindings) {
        if (binding.tokenName) usedTokenNames.add(binding.tokenName)
      }
    }
    const usedCount = usedTokenNames.size

    const unusedTokens = allTokens.filter(t => !usedTokenNames.has(t.name))
    const unusedCount = unusedTokens.length

    const coverage = totalTokens > 0 ? Math.round((usedCount / totalTokens) * 100) : 0

    const bindingsPerType: Record<string, number> = {}
    for (const comp of data.components) {
      for (const binding of comp.bindings) {
        const prop = normalizePropertyType(binding.property)
        bindingsPerType[prop] = (bindingsPerType[prop] || 0) + 1
      }
    }

    // ALL tokens sorted by usage (not just top 10)
    const tokenComponentCount: Record<string, Set<string>> = {}
    for (const comp of data.components) {
      for (const binding of comp.bindings) {
        if (binding.tokenName) {
          if (!tokenComponentCount[binding.tokenName]) {
            tokenComponentCount[binding.tokenName] = new Set()
          }
          tokenComponentCount[binding.tokenName].add(comp.componentName)
        }
      }
    }
    const allTokensSorted = Object.entries(tokenComponentCount)
      .map(([name, comps]) => ({ name, componentCount: comps.size }))
      .sort((a, b) => b.componentCount - a.componentCount)

    const categories = [...new Set(mainComponents.map(c => c.category))]

    return { totalTokens, semanticCount: semanticTokens.length, primitiveCount: primitiveTokens.length, usedCount, unusedCount, coverage, bindingsPerType, allTokensSorted, categories, mainComponentCount: mainComponents.length }
  }, [data])

  // Impact analysis
  const allTokens = useMemo(
    () => [...data.foundations.primitiveTokens, ...data.foundations.semanticTokens],
    [data]
  )

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

  const impactResults = useMemo(() => {
    if (!impactSearch || impactSearch.length < 2) return []
    const q = impactSearch.toLowerCase()
    return allTokens.filter(t => t.name.toLowerCase().includes(q)).slice(0, 15)
  }, [allTokens, impactSearch])

  const impactData = useMemo(() => {
    if (!selectedToken) return null
    const usages = usageMap[selectedToken.name] || []
    const uniqueComponents = [...new Set(usages.map(u => u.componentName))]
    const byProperty: Record<string, string[]> = {}
    for (const u of usages) {
      if (!byProperty[u.property]) byProperty[u.property] = []
      if (!byProperty[u.property].includes(u.componentName)) {
        byProperty[u.property].push(u.componentName)
      }
    }
    return { blastRadius: uniqueComponents.length, uniqueComponents, byProperty }
  }, [selectedToken, usageMap])

  const displayedTokens = showAllTokens ? stats.allTokensSorted : stats.allTokensSorted.slice(0, 10)

  return (
    <div className="overview">
      <h2 className="page-title">Overview</h2>
      <p className="page-description">Resumen de salud del Design System</p>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.mainComponentCount}</span>
          <span className="stat-label">Componentes</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.semanticCount}</span>
          <span className="stat-label">Tokens semánticos</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.primitiveCount}</span>
          <span className="stat-label">Tokens primitivos</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.usedCount}</span>
          <span className="stat-label">Tokens en uso</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.unusedCount}</span>
          <span className="stat-label">Sin uso</span>
        </div>
        <div className="stat-card highlight">
          <span className="stat-value">{stats.coverage}%</span>
          <span className="stat-label">Cobertura</span>
        </div>
      </div>

      <div className="overview-sections">
        {/* Impact Analysis */}
        <section className="overview-section">
          <h3>🎯 Análisis de impacto</h3>
          <p className="section-description">Buscá un token para ver qué componentes se afectan si lo cambiás</p>
          <div className="impact-search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar token por nombre..."
              value={impactSearch}
              onChange={e => {
                setImpactSearch(e.target.value)
                if (e.target.value.length < 2) setSelectedToken(null)
              }}
            />
            {impactResults.length > 0 && !selectedToken && (
              <div className="impact-dropdown">
                {impactResults.map(token => (
                  <button
                    key={token.id}
                    className="impact-dropdown-item"
                    onClick={() => { setSelectedToken(token); setImpactSearch(token.name) }}
                  >
                    {token.hex && <span className="color-dot" style={{ background: token.hex }} />}
                    <span className="impact-dropdown-name">{token.name}</span>
                    <span className="impact-dropdown-meta">{token.collection}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedToken && impactData && (
            <div className="impact-result-card">
              <div className="impact-result-header">
                <div className="impact-result-token">
                  {selectedToken.hex && <span className="color-dot large" style={{ background: selectedToken.hex }} />}
                  <div>
                    <strong>{selectedToken.name}</strong>
                    {selectedToken.aliasName && (
                      <span className="impact-alias">→ {selectedToken.aliasName}</span>
                    )}
                  </div>
                </div>
                <div className="blast-radius-badge">
                  <span className="blast-number">{impactData.blastRadius}</span>
                  <span className="blast-label">componentes</span>
                </div>
              </div>
              {impactData.blastRadius > 0 && (
                <div className="impact-components">
                  {impactData.uniqueComponents.map(comp => (
                    <span key={comp} className="impact-chip">{comp}</span>
                  ))}
                </div>
              )}
              {impactData.blastRadius === 0 && (
                <p className="impact-empty">Este token no se usa en ningún componente.</p>
              )}
            </div>
          )}
        </section>

        {/* Top tokens */}
        <section className="overview-section">
          <h3>Top tokens más usados</h3>
          <div className="top-tokens-list">
            {displayedTokens.map((token, i) => (
              <div key={token.name} className="top-token-row">
                <span className="top-token-rank">#{i + 1}</span>
                <span className="top-token-name">{token.name}</span>
                <span className="top-token-count">{token.componentCount} componentes</span>
              </div>
            ))}
          </div>
          {stats.allTokensSorted.length > 10 && (
            <button
              className="show-more-btn"
              onClick={() => setShowAllTokens(!showAllTokens)}
            >
              {showAllTokens ? 'Ver menos' : `Ver más (${stats.allTokensSorted.length - 10} tokens más)`}
            </button>
          )}
        </section>

        {/* Usage by property */}
        <section className="overview-section">
          <h3>Uso por tipo de propiedad</h3>
          <div className="type-bars">
            {Object.entries(stats.bindingsPerType)
              .sort((a, b) => b[1] - a[1])
              .map(([type, count]) => {
                const max = Math.max(...Object.values(stats.bindingsPerType))
                return (
                  <div key={type} className="type-bar-row">
                    <span className="type-label">{type}</span>
                    <div className="type-bar-track">
                      <div
                        className="type-bar-fill"
                        style={{ width: `${Math.min(100, (count / max) * 100)}%` }}
                      />
                    </div>
                    <span className="type-count">{count} usos</span>
                  </div>
                )
              })}
          </div>
        </section>

        <section className="overview-section">
          <h3>Categorías de componentes</h3>
          <div className="category-chips">
            {stats.categories.map(cat => {
              const count = data.components.filter(c => c.category === cat).length
              return (
                <span key={cat} className="category-chip">
                  {cat} <strong>{count}</strong>
                </span>
              )
            })}
          </div>
        </section>

        <section className="overview-section">
          <h3>Colecciones</h3>
          <div className="category-chips">
            {data.foundations.collections.map(col => (
              <span key={col} className="category-chip">{col}</span>
            ))}
          </div>
        </section>

        {stats.unusedCount > 0 && (
          <section className="overview-section warning-section">
            <h3>⚠️ Tokens huérfanos</h3>
            <p>{stats.unusedCount} tokens definidos pero no aplicados en ningún componente.</p>
          </section>
        )}
      </div>
    </div>
  )
}

function normalizePropertyType(property: string): string {
  if (property.startsWith('padding')) return 'padding'
  if (property.includes('Radius') || property === 'cornerRadius') return 'borderRadius'
  if (property.includes('stroke') || property === 'strokeWeight') return 'stroke'
  if (property === 'itemSpacing') return 'itemSpacing'
  if (property === 'fills' || property === 'textRangeFills') return 'fills'
  if (property === 'strokes') return 'strokes'
  if (property === 'fontSize') return 'fontSize'
  if (property === 'fontFamily') return 'fontFamily'
  if (property === 'fontWeight') return 'fontWeight'
  if (property === 'lineHeight') return 'lineHeight'
  if (property === 'letterSpacing') return 'letterSpacing'
  if (property === 'width' || property === 'height') return 'size'
  return property
}
