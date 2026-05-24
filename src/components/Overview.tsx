import { useMemo } from 'react'
import { DashboardData } from '../types'
import './Overview.css'

interface OverviewProps {
  data: DashboardData
}

export function Overview({ data }: OverviewProps) {
  const stats = useMemo(() => {
    const allTokens = [...data.foundations.primitiveTokens, ...data.foundations.semanticTokens]
    const totalTokens = allTokens.length

    // Classify: tokens with aliasOf are semantic, without are primitive
    const semanticTokens = allTokens.filter(t => t.aliasOf)
    const primitiveTokens = allTokens.filter(t => !t.aliasOf)

    // Filter out building blocks (⛔) from component count
    const mainComponents = data.components.filter(c => !c.componentName.includes('⛔'))

    // Unique tokenNames used across all bindings
    const usedTokenNames = new Set<string>()
    for (const comp of data.components) {
      for (const binding of comp.bindings) {
        if (binding.tokenName) usedTokenNames.add(binding.tokenName)
      }
    }
    const usedCount = usedTokenNames.size

    // Tokens defined in foundations whose name doesn't appear in any binding
    const unusedTokens = allTokens.filter(t => !usedTokenNames.has(t.name))
    const unusedCount = unusedTokens.length

    const coverage = totalTokens > 0 ? Math.round((usedCount / totalTokens) * 100) : 0

    // Group bindings by property type
    const bindingsPerType: Record<string, number> = {}
    for (const comp of data.components) {
      for (const binding of comp.bindings) {
        const prop = normalizePropertyType(binding.property)
        bindingsPerType[prop] = (bindingsPerType[prop] || 0) + 1
      }
    }

    // Top 10 tokens used in most components
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
    const topTokens = Object.entries(tokenComponentCount)
      .map(([name, comps]) => ({ name, componentCount: comps.size }))
      .sort((a, b) => b.componentCount - a.componentCount)
      .slice(0, 10)

    const categories = [...new Set(mainComponents.map(c => c.category))]

    return { totalTokens, semanticCount: semanticTokens.length, primitiveCount: primitiveTokens.length, usedCount, unusedCount, coverage, bindingsPerType, topTokens, categories, mainComponentCount: mainComponents.length }
  }, [data])

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
          <h3>Top tokens más usados</h3>
          <div className="top-tokens-list">
            {stats.topTokens.map((token, i) => (
              <div key={token.name} className="top-token-row">
                <span className="top-token-rank">#{i + 1}</span>
                <span className="top-token-name">{token.name}</span>
                <span className="top-token-count">{token.componentCount} componentes</span>
              </div>
            ))}
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
