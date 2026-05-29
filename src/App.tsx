import { useState } from 'react'
import data from './data/dashboard-data.json'
import { DashboardData } from './types'
import { Sidebar } from './components/Sidebar'
import { ComponentIndex } from './components/ComponentIndex'
import { TokenExplorer } from './components/TokenExplorer'
import { OrphanTokens } from './components/OrphanTokens'
import { Overview } from './components/Overview'
import { PropExplorer } from './components/PropExplorer'
import './App.css'

type View = 'overview' | 'components' | 'tokens' | 'orphans' | 'props'

function App() {
  const [view, setView] = useState<View>('overview')
  const dashboardData = data as unknown as DashboardData

  return (
    <div className="app-layout">
      <Sidebar currentView={view} onViewChange={setView} data={dashboardData} />
      <main className="main-content">
        {view === 'overview' && <Overview data={dashboardData} />}
        {view === 'components' && <ComponentIndex data={dashboardData} />}
        {view === 'tokens' && <TokenExplorer data={dashboardData} />}
        {view === 'orphans' && <OrphanTokens data={dashboardData} />}
        {view === 'props' && <PropExplorer data={dashboardData} />}
      </main>
    </div>
  )
}

export default App
