import { useState, useMemo } from 'react'
import assetData from '../data/asset-data.json'
import type { DashboardData } from '../types'
import './AssetTokens.css'

type TabView = 'components' | 'tokens'

// Resultado de resolver un tokenId contra foundations (para pintar swatches y ver alias).
interface ResolvedToken {
  tokenId: string
  tokenName: string
  tokenCollection: string
  hex?: string
  aliasName?: string
}

// Resumen de uso de un token a lo largo de todos los assets.
interface TokenUsage extends ResolvedToken {
  usedInComponents: string[]
  usedInProperties: string[]
  count: number
}

export function AssetTokens() {
  const data = assetData as unknown as DashboardData
  const [tab, setTab] = useState<TabView>('tokens')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)

  const isEmpty = !data.extractedAt

  // Índice tokenId → metadata (hex, alias, colección). Cubre semánticos y primitivos.
  const tokenIndex = useMemo(() => {
    const map = new Map<string, ResolvedToken>()
    const addAll = (list: DashboardData['foundations']['semanticTokens']) => {
      for (const t of list) {
        if (!map.has(t.id)) {
          map.set(t.id, {
            tokenId: t.id,
            tokenName: t.name,
            tokenCollection: t.collection,
            hex: t.hex,
            aliasName: t.aliasName,
          })
        }
      }
    }
    addAll(data.foundations.semanticTokens)
    addAll(data.foundations.primitiveTokens)
    return map
  }, [data.foundations])

  // Resumen de uso: recorre todas las bindings de todos los componentes y agrupa por token.
  const tokenSummary = useMemo(() => {
    const map = new Map<string, TokenUsage>()
    for (const comp of data.components) {
      for (const b of comp.bindings) {
        const resolved = tokenIndex.get(b.tokenId)
        let usage = map.get(b.tokenId)
        if (!usage) {
          usage = {
            tokenId: b.tokenId,
            tokenName: b.tokenName || resolved?.tokenName || b.tokenId,
            tokenCollection: resolved?.tokenCollection || 'Sin colección',
            hex: resolved?.hex,
            aliasName: resolved?.aliasName,
            usedInComponents: [],
            usedInProperties: [],
            count: 0,
          }
          map.set(b.tokenId, usage)
        }
        usage.count++
        if (!usage.usedInComponents.includes(comp.componentName)) {
          usage.usedInComponents.push(comp.componentName)
        }
        if (!usage.usedInProperties.includes(b.property)) {
          usage.usedInProperties.push(b.property)
        }
      }
    }
    return [...map.values()]
  }, [data.components, tokenIndex])

  const stats = useMemo(() => ({
    totalComponents: data.components.length,
    totalBindings: data.components.reduce((sum, c) => sum + c.bindings.length, 0),
    uniqueTokens: tokenSummary.length,
  }), [data.components, tokenSummary])

  const categories = useMemo(() => {
    const cats = new Set<string>()
    for (const c of data.components) if (c.category) cats.add(c.category)
    return [...cats].sort()
  }, [data.components])

  // Cache de "tokens únicos por componente" para no recalcular en cada render.
  const uniqueTokenCountByComp = useMemo(() => {
    const map = new Map<string, number>()
    for (const c of data.components) {
      map.set(c.componentId, new Set(c.bindings.map(b => b.tokenId)).size)
    }
    return map
  }, [data.components])

  const filteredComponents = useMemo(() => {
    let comps = data.components
    if (activeCategory !== 'all') comps = comps.filter(c => c.category === activeCategory)
    if (search) {
      const q = search.toLowerCase()
      comps = comps.filter(c => c.componentName.toLowerCase().includes(q))
    }
    return comps
  }, [data.components, activeCategory, search])

  const filteredTokens = useMemo(() => {
    if (activeCategory === 'all' && !search) return tokenSummary
    const compNames = new Set(filteredComponents.map(c => c.componentName))
    const q = search.toLowerCase()
    return tokenSummary.filter(t =>
      t.usedInComponents.some(n => compNames.has(n)) &&
      (!search || t.tokenName.toLowerCase().includes(q))
    )
  }, [tokenSummary, filteredComponents, activeCategory, search])

  const tokensByCollection = useMemo(() => {
    const map = new Map<string, TokenUsage[]>()
    for (const t of filteredTokens) {
      const col = t.tokenCollection || 'Sin colección'
      if (!map.has(col)) map.set(col, [])
      map.get(col)!.push(t)
    }
    return map
  }, [filteredTokens])

  const selectedComponent = useMemo(() => {
    if (!selectedComponentId) return null
    return data.components.find(c => c.componentId === selectedComponentId) || null
  }, [selectedComponentId, data.components])

  if (isEmpty) {
    return (
      <div className="asset-tokens">
        <h2 className="page-title">Assets</h2>
        <p className="page-description">Tokens aplicados en ilustraciones y assets</p>
        <div className="asset-empty">
          <p className="asset-empty-icon">🎨</p>
          <p className="asset-empty-title">Sin datos de assets</p>
          <p className="asset-empty-desc">
            Ejecutar <code>npm run extract</code> con <code>FIGMA_ASSETS_FILE_KEY</code> configurada
            para generar <code>src/data/asset-data.json</code>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="asset-tokens">
      <h2 className="page-title">Assets</h2>
      <p className="page-description">Tokens aplicados en ilustraciones y assets</p>

      {/* Stats */}
      <div className="asset-stats">
        <div className="asset-stat">
          <span className="asset-stat-value">{stats.totalComponents}</span>
          <span className="asset-stat-label">Componentes</span>
        </div>
        <div className="asset-stat">
          <span className="asset-stat-value">{stats.uniqueTokens}</span>
          <span className="asset-stat-label">Tokens únicos</span>
        </div>
        <div className="asset-stat">
          <span className="asset-stat-value">{stats.totalBindings}</span>
          <span className="asset-stat-label">Bindings totales</span>
        </div>
        {data.extractedAt && (
          <div className="asset-stat asset-stat--date">
            <span className="asset-stat-label">Extraído</span>
            <span className="asset-stat-date">
              {new Date(data.extractedAt).toLocaleDateString('es-AR', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </span>
          </div>
        )}
      </div>

      {/* Category filters */}
      {categories.length > 1 && (
        <div className="asset-categories">
          <button
            className={`category-chip ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('all'); setSelectedComponentId(null) }}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => { setActiveCategory(cat); setSelectedComponentId(null) }}
            >
              {cat}
              <span className="category-chip-count">
                {data.components.filter(c => c.category === cat).length}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Tabs + search */}
      <div className="asset-controls">
        <div className="asset-tabs">
          <button
            className={`asset-tab ${tab === 'tokens' ? 'active' : ''}`}
            onClick={() => { setTab('tokens'); setSelectedComponentId(null) }}
          >
            Tokens
          </button>
          <button
            className={`asset-tab ${tab === 'components' ? 'active' : ''}`}
            onClick={() => { setTab('components'); setSelectedComponentId(null) }}
          >
            Componentes
          </button>
        </div>
        <input
          type="text"
          className="asset-search"
          placeholder="Buscar..."
          value={search}
          onChange={e => { setSearch(e.target.value); setSelectedComponentId(null) }}
        />
      </div>

      {/* Tokens tab */}
      {tab === 'tokens' && (
        <div className="asset-content">
          {filteredTokens.length === 0 && (
            <p className="asset-no-results">Sin resultados para "{search}"</p>
          )}
          {[...tokensByCollection.entries()].sort().map(([col, tokens]) => (
            <div key={col} className="token-collection-group">
              <h4 className="token-collection-title">
                {col} <span className="token-collection-count">{tokens.length}</span>
              </h4>
              <div className="token-grid">
                {tokens.map(t => (
                  <div key={t.tokenId} className="token-card">
                    <div
                      className="token-swatch"
                      style={{ background: t.hex || 'transparent' }}
                    />
                    <div className="token-card-info">
                      <span className="token-card-name">{t.tokenName}</span>
                      {t.aliasName && (
                        <span className="token-card-alias">→ {t.aliasName}</span>
                      )}
                      <span className="token-card-meta">
                        {t.count} uso{t.count !== 1 ? 's' : ''} · {t.usedInComponents.length} componente{t.usedInComponents.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Components tab */}
      {tab === 'components' && !selectedComponent && (
        <div className="asset-content">
          {filteredComponents.length === 0 && (
            <p className="asset-no-results">Sin resultados para "{search}"</p>
          )}
          {[...filteredComponents]
            .sort((a, b) =>
              (uniqueTokenCountByComp.get(b.componentId) || 0) -
              (uniqueTokenCountByComp.get(a.componentId) || 0)
            )
            .map(comp => {
              const uniqueCount = uniqueTokenCountByComp.get(comp.componentId) || 0
              const uniqueTokenIds = [...new Set(comp.bindings.map(b => b.tokenId))]
              return (
                <button
                  key={comp.componentId}
                  className="component-row"
                  onClick={() => setSelectedComponentId(comp.componentId)}
                >
                  <div className="component-row-swatches">
                    {uniqueTokenIds.slice(0, 6).map(tid => {
                      const t = tokenIndex.get(tid)
                      return (
                        <span
                          key={tid}
                          className="mini-swatch"
                          style={{ background: t?.hex || '#ccc' }}
                          title={t?.tokenName || tid}
                        />
                      )
                    })}
                  </div>
                  <div className="component-row-info">
                    <span className="component-row-name">{comp.componentName}</span>
                    <span className="component-row-meta">{uniqueCount} tokens · {comp.category}</span>
                  </div>
                  <span className="component-row-arrow">›</span>
                </button>
              )
            })}
        </div>
      )}

      {/* Component detail */}
      {tab === 'components' && selectedComponent && (
        <div className="asset-content">
          <button className="detail-back-btn" onClick={() => setSelectedComponentId(null)}>
            ← Volver
          </button>
          <h3 className="detail-comp-name">{selectedComponent.componentName}</h3>
          <p className="detail-comp-meta">
            {selectedComponent.category} · {uniqueTokenCountByComp.get(selectedComponent.componentId) || 0} tokens únicos
          </p>

          <div className="detail-bindings">
            {[...new Map(
              selectedComponent.bindings.map(b => [b.tokenId + '|' + b.property + '|' + b.layerName, b])
            ).values()]
              .sort((a, b) => (a.tokenName || '').localeCompare(b.tokenName || ''))
              .map((b, i) => {
                const t = tokenIndex.get(b.tokenId)
                return (
                  <div key={i} className="detail-binding-row">
                    <div
                      className="binding-swatch"
                      style={{ background: t?.hex || 'transparent' }}
                    />
                    <div className="binding-info">
                      <span className="binding-token-name">{b.tokenName || t?.tokenName || b.tokenId}</span>
                      {t?.aliasName && (
                        <span className="binding-alias">→ {t.aliasName}</span>
                      )}
                      <span className="binding-layer">{b.layerName}</span>
                    </div>
                    <span className="binding-prop">{b.property}</span>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
