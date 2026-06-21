import { useState, useMemo } from 'react'
import assetData from '../data/asset-tokens.json'
import './AssetTokens.css'

interface ColorToken {
  tokenId: string
  tokenName: string
  tokenCollection: string
  hex?: string
  aliasOf?: string
  aliasName?: string
}

interface ColorBinding {
  layerName: string
  layerType: string
  property: 'fill' | 'stroke'
  token: ColorToken
}

interface AssetComponent {
  id: string
  name: string
  type: string
  category: string
  colorBindings: ColorBinding[]
  uniqueTokenCount: number
}

interface TokenUsage {
  tokenId: string
  tokenName: string
  tokenCollection: string
  hex?: string
  aliasOf?: string
  aliasName?: string
  usedInComponents: string[]
  usedInProperties: string[]
  count: number
}

interface AssetData {
  extractedAt: string
  fileName: string
  scope: string
  components: AssetComponent[]
  tokenSummary: TokenUsage[]
  stats: {
    totalComponents: number
    totalColorBindings: number
    uniqueTokens: number
  }
}

type TabView = 'components' | 'tokens'

export function AssetTokens() {
  const data = assetData as unknown as AssetData
  const [tab, setTab] = useState<TabView>('tokens')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedComponent, setSelectedComponent] = useState<AssetComponent | null>(null)

  const isEmpty = !data.extractedAt

  // All categories from components
  const categories = useMemo(() => {
    const cats = new Set<string>()
    for (const c of data.components) if (c.category) cats.add(c.category)
    return [...cats].sort()
  }, [data.components])

  // Components filtered by category + search
  const filteredComponents = useMemo(() => {
    let comps = data.components
    if (activeCategory !== 'all') comps = comps.filter(c => c.category === activeCategory)
    if (search) {
      const q = search.toLowerCase()
      comps = comps.filter(c => c.name.toLowerCase().includes(q))
    }
    return comps
  }, [data.components, activeCategory, search])

  // Token summary filtered by active category (only tokens used in filtered components)
  const filteredTokens = useMemo(() => {
    if (activeCategory === 'all' && !search) return data.tokenSummary
    const compNames = new Set(filteredComponents.map(c => c.name))
    return data.tokenSummary.filter(t =>
      t.usedInComponents.some(n => compNames.has(n)) &&
      (!search || t.tokenName.toLowerCase().includes(search.toLowerCase()))
    )
  }, [data.tokenSummary, filteredComponents, activeCategory, search])

  // Group tokens by collection
  const tokensByCollection = useMemo(() => {
    const map = new Map<string, TokenUsage[]>()
    for (const t of filteredTokens) {
      const col = t.tokenCollection || 'Sin colección'
      if (!map.has(col)) map.set(col, [])
      map.get(col)!.push(t)
    }
    return map
  }, [filteredTokens])

  if (isEmpty) {
    return (
      <div className="asset-tokens">
        <h2 className="page-title">Assets</h2>
        <p className="page-description">Tokens de color aplicados en ilustraciones y assets</p>
        <div className="asset-empty">
          <p className="asset-empty-icon">🎨</p>
          <p className="asset-empty-title">Sin datos todavía</p>
          <p className="asset-empty-desc">
            Corré el plugin <strong>Asset Extractor</strong> en el archivo de Assets de Figma
            y guardá el JSON resultante en <code>src/data/asset-tokens.json</code>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="asset-tokens">
      <h2 className="page-title">Assets</h2>
      <p className="page-description">
        Tokens de color aplicados en ilustraciones y assets
        {data.fileName && ` — ${data.fileName}`}
      </p>

      {/* Stats */}
      <div className="asset-stats">
        <div className="asset-stat">
          <span className="asset-stat-value">{data.stats.totalComponents}</span>
          <span className="asset-stat-label">Componentes</span>
        </div>
        <div className="asset-stat">
          <span className="asset-stat-value">{data.stats.uniqueTokens}</span>
          <span className="asset-stat-label">Tokens únicos</span>
        </div>
        <div className="asset-stat">
          <span className="asset-stat-value">{data.stats.totalColorBindings}</span>
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
            onClick={() => { setActiveCategory('all'); setSelectedComponent(null) }}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => { setActiveCategory(cat); setSelectedComponent(null) }}
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
            onClick={() => { setTab('tokens'); setSelectedComponent(null) }}
          >
            Tokens
          </button>
          <button
            className={`asset-tab ${tab === 'components' ? 'active' : ''}`}
            onClick={() => { setTab('components'); setSelectedComponent(null) }}
          >
            Componentes
          </button>
        </div>
        <input
          type="text"
          className="asset-search"
          placeholder="Buscar..."
          value={search}
          onChange={e => { setSearch(e.target.value); setSelectedComponent(null) }}
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
          {filteredComponents
            .sort((a, b) => b.uniqueTokenCount - a.uniqueTokenCount)
            .map(comp => (
              <button
                key={comp.id}
                className="component-row"
                onClick={() => setSelectedComponent(comp)}
              >
                <div className="component-row-swatches">
                  {[...new Map(comp.colorBindings.map(b => [b.token.tokenId, b.token])).values()]
                    .slice(0, 6)
                    .map(t => (
                      <span
                        key={t.tokenId}
                        className="mini-swatch"
                        style={{ background: t.hex || '#ccc' }}
                        title={t.tokenName}
                      />
                    ))}
                </div>
                <div className="component-row-info">
                  <span className="component-row-name">{comp.name}</span>
                  <span className="component-row-meta">{comp.uniqueTokenCount} tokens · {comp.category}</span>
                </div>
                <span className="component-row-arrow">›</span>
              </button>
            ))}
        </div>
      )}

      {/* Component detail */}
      {tab === 'components' && selectedComponent && (
        <div className="asset-content">
          <button className="detail-back-btn" onClick={() => setSelectedComponent(null)}>
            ← Volver
          </button>
          <h3 className="detail-comp-name">{selectedComponent.name}</h3>
          <p className="detail-comp-meta">{selectedComponent.category} · {selectedComponent.uniqueTokenCount} tokens únicos</p>

          <div className="detail-bindings">
            {[...new Map(
              selectedComponent.colorBindings.map(b => [b.token.tokenId + '|' + b.property + '|' + b.layerName, b])
            ).values()]
              .sort((a, b) => a.token.tokenName.localeCompare(b.token.tokenName))
              .map((b, i) => (
                <div key={i} className="detail-binding-row">
                  <div
                    className="binding-swatch"
                    style={{ background: b.token.hex || 'transparent' }}
                  />
                  <div className="binding-info">
                    <span className="binding-token-name">{b.token.tokenName}</span>
                    {b.token.aliasName && (
                      <span className="binding-alias">→ {b.token.aliasName}</span>
                    )}
                    <span className="binding-layer">{b.layerName}</span>
                  </div>
                  <span className="binding-prop">{b.property}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
