import { useMemo } from 'react'
import { DashboardData } from '../types'
import changelogData from '../data/changelog.json'
import './Header.css'

type View = 'overview' | 'components' | 'tokens' | 'assets' | 'changelog'

interface HeaderProps {
  currentView: View
  onViewChange: (view: View) => void
  data: DashboardData
}

export function Header({ currentView, onViewChange, data }: HeaderProps) {
  const counts = useMemo(() => {
    const allTokens = [...data.foundations.primitiveTokens, ...data.foundations.semanticTokens]
    return {
      components: data.components.filter(c => !c.componentName.includes('⛔')).length,
      tokens: allTokens.length,
    }
  }, [data])

  const navItems: { id: View; label: string; count?: number }[] = [
    { id: 'overview',   label: 'Overview' },
    { id: 'components', label: 'Componentes', count: counts.components },
    { id: 'tokens',     label: 'Tokens', count: counts.tokens },
    { id: 'assets',     label: 'Assets' },
    { id: 'changelog',  label: 'Changelog' },
  ]

  // Freshness indicator
  const freshness = useMemo(() => {
    if (!data.extractedAt) return null
    const extractDate = new Date(data.extractedAt)
    const now = new Date()
    const diffMs = now.getTime() - extractDate.getTime()
    const daysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    // Count changelog entries since extraction
    const entries = changelogData as unknown as { timestamp: string }[]
    const changesSince = entries.filter(e => new Date(e.timestamp) > extractDate).length

    const dateStr = extractDate.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })

    let status: 'fresh' | 'aging' | 'stale' = 'fresh'
    if (daysAgo > 7 || changesSince > 3) status = 'stale'
    else if (daysAgo > 3 || changesSince > 0) status = 'aging'

    return { dateStr, daysAgo, changesSince, status }
  }, [data])

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand */}
        <div className="header-brand">
          <div className="header-logo-mark">F</div>
          <div className="header-brand-text">
            <span className="header-title">Fractal DS</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="header-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`header-nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onViewChange(item.id)}
            >
              {item.label}
              {item.count !== undefined && <span className="header-nav-count">{item.count}</span>}
            </button>
          ))}
        </nav>

        {/* Right meta — freshness */}
        <div className="header-meta">
          {freshness && (
            <div className={`header-freshness header-freshness--${freshness.status}`}>
              <span className={`freshness-dot freshness-dot--${freshness.status}`} />
              <div className="freshness-info">
                <span className="freshness-date">Extracción: {freshness.dateStr}</span>
                <span className="freshness-detail">
                  {freshness.daysAgo === 0 ? 'Hoy' : `Hace ${freshness.daysAgo} día${freshness.daysAgo !== 1 ? 's' : ''}`}
                  {freshness.changesSince > 0 && ` · ${freshness.changesSince} cambio${freshness.changesSince !== 1 ? 's' : ''} detectado${freshness.changesSince !== 1 ? 's' : ''} desde entonces`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
