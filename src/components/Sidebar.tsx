import { useMemo } from 'react'
import { DashboardData, LibraryId } from '../types'
import './Sidebar.css'

type View = 'overview' | 'components' | 'tokens' | 'orphans' | 'assets' | 'changelog'

interface LibraryOption {
  id: LibraryId
  label: string
  data: DashboardData
}

interface SidebarProps {
  currentView: View
  onViewChange: (view: View) => void
  data: DashboardData
  libraries: LibraryOption[]
  activeLibrary: LibraryId
  onLibraryChange: (lib: LibraryId) => void
}

export function Sidebar({ currentView, onViewChange, data, libraries, activeLibrary, onLibraryChange }: SidebarProps) {
  const counts = useMemo(() => {
    const allTokens = [...data.foundations.primitiveTokens, ...data.foundations.semanticTokens]
    const usedTokenNames = new Set<string>()
    for (const comp of data.components) {
      for (const binding of comp.bindings) {
        if (binding.tokenName) usedTokenNames.add(binding.tokenName)
      }
    }
    const orphanCount = (() => {
      const orphanNames = new Set<string>()
      for (const t of allTokens) { if (!usedTokenNames.has(t.name)) orphanNames.add(t.name) }
      for (const t of (data.orphanTokens || [])) { if (!usedTokenNames.has(t.name)) orphanNames.add(t.name) }
      return orphanNames.size
    })()
    return { tokens: allTokens.length, orphans: orphanCount }
  }, [data])

  const navItems: { id: View; label: string; count?: number }[] = [
    { id: 'overview',    label: 'Overview' },
    { id: 'components',  label: 'Componentes', count: data.components.filter(c => !c.componentName.includes('⛔')).length },
    { id: 'tokens',      label: 'Tokens', count: counts.tokens },
    { id: 'orphans',     label: 'Huérfanos', count: counts.orphans },
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
        <h1 className="sidebar-title">DS Dashboard</h1>
        <p className="sidebar-subtitle">Token Health</p>
      </div>

      {/* Library selector */}
      <div className="library-selector">
        <button
          className={`lib-btn ${activeLibrary === 'all' ? 'active' : ''}`}
          onClick={() => onLibraryChange('all')}
        >
          Todas
        </button>
        {libraries.map(lib => (
          <button
            key={lib.id}
            className={`lib-btn ${activeLibrary === lib.id ? 'active' : ''}`}
            onClick={() => onLibraryChange(lib.id)}
          >
            {lib.label}
          </button>
        ))}
      </div>

      <nav className="sidebar-nav">
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
          <p className="extract-date">
            Última extracción:<br />{extractedAt}
          </p>
        ) : (
          <p className="extract-date extract-date--empty">Sin datos extraídos</p>
        )}
      </div>
    </aside>
  )
}
