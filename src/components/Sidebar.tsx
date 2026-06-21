import { useMemo } from 'react'
import { DashboardData } from '../types'
import './Sidebar.css'

type View = 'overview' | 'components' | 'tokens' | 'assets' | 'changelog'

interface SidebarProps {
  currentView: View
  onViewChange: (view: View) => void
  data: DashboardData
}

export function Sidebar({ currentView, onViewChange, data }: SidebarProps) {
  const counts = useMemo(() => {
    const allTokens = [...data.foundations.primitiveTokens, ...data.foundations.semanticTokens]
    return {
      components: data.components.filter(c => !c.componentName.includes('⛔')).length,
      tokens: allTokens.length,
    }
  }, [data])

  const navItems: { id: View; label: string; count?: number }[] = [
    { id: 'overview',    label: 'Overview' },
    { id: 'components',  label: 'Componentes', count: counts.components },
    { id: 'tokens',      label: 'Tokens', count: counts.tokens },
    { id: 'assets',      label: 'Assets' },
    { id: 'changelog',   label: 'Changelog' },
  ]

  const extractedAt = data.extractedAt
    ? new Date(data.extractedAt).toLocaleDateString('es', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : null

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-mark">F</div>
          <span className="sidebar-title">Fractal DS</span>
        </div>
        <p className="sidebar-subtitle">Token Health</p>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Vistas</span>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <span className="nav-label">{item.label}</span>
            {item.count !== undefined && (
              <span className="nav-count">{item.count}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {extractedAt ? (
          <p className="extract-date">Última extracción:<br />{extractedAt}</p>
        ) : (
          <p className="extract-date extract-date--empty">Sin datos extraídos</p>
        )}
      </div>
    </aside>
  )
}
