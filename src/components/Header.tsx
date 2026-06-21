import { useMemo } from 'react'
import { DashboardData } from '../types'
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

  const extractedAt = data.extractedAt
    ? new Date(data.extractedAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Brand */}
        <div className="header-brand">
          <div className="header-logo-mark">F</div>
          <div className="header-brand-text">
            <span className="header-title">Fractal DS</span>
            <span className="header-subtitle">Token Health</span>
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

        {/* Right meta */}
        <div className="header-meta">
          {extractedAt && (
            <span className="header-extract-date">
              <span className="header-extract-dot" />
              Actualizado {extractedAt}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
