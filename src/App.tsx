import { useState, useMemo } from 'react'
import componentData from './data/component-data.json'
import templateData from './data/template-data.json'
import { DashboardData, LibraryId } from './types'
import { Sidebar } from './components/Sidebar'
import { ComponentIndex } from './components/ComponentIndex'
import { TokenExplorer } from './components/TokenExplorer'
import { OrphanTokens } from './components/OrphanTokens'
import { Overview } from './components/Overview'
import { Changelog } from './components/Changelog'
import { AssetTokens } from './components/AssetTokens'
import './App.css'

type View = 'overview' | 'components' | 'tokens' | 'orphans' | 'assets' | 'changelog'

const emptyData: DashboardData = {
  extractedAt: '',
  foundations: { collections: [], primitiveTokens: [], semanticTokens: [] },
  components: [],
  orphanTokens: [],
  hardcodedValues: [],
}

function mergeLibraries(libraries: { id: LibraryId; data: DashboardData }[]): DashboardData {
  const merged: DashboardData = {
    extractedAt: libraries.map(l => l.data.extractedAt).filter(Boolean).sort().reverse()[0] || '',
    foundations: {
      collections: [],
      primitiveTokens: [],
      semanticTokens: [],
    },
    components: [],
    orphanTokens: [],
    hardcodedValues: [],
  }

  const seenTokenIds = new Set<string>()
  const seenCompIds = new Set<string>()

  for (const lib of libraries) {
    const d = lib.data
    if (!d.extractedAt) continue

    // Merge collections
    for (const col of d.foundations.collections) {
      if (!merged.foundations.collections.includes(col)) {
        merged.foundations.collections.push(col)
      }
    }

    // Merge tokens (deduplicate by id)
    for (const t of d.foundations.primitiveTokens) {
      if (!seenTokenIds.has(t.id)) { seenTokenIds.add(t.id); merged.foundations.primitiveTokens.push(t) }
    }
    for (const t of d.foundations.semanticTokens) {
      if (!seenTokenIds.has(t.id)) { seenTokenIds.add(t.id); merged.foundations.semanticTokens.push(t) }
    }

    // Merge components (deduplicate by id)
    for (const c of d.components) {
      if (!seenCompIds.has(c.componentId)) {
        seenCompIds.add(c.componentId)
        merged.components.push(c)
      }
    }

    // Merge orphans
    for (const t of (d.orphanTokens || [])) {
      if (!seenTokenIds.has(t.id)) { seenTokenIds.add(t.id); merged.orphanTokens!.push(t) }
    }

    // Merge hardcoded
    merged.hardcodedValues!.push(...(d.hardcodedValues || []))
  }

  return merged
}

export default function App() {
  const [view, setView] = useState<View>('overview')
  const [activeLibrary, setActiveLibrary] = useState<LibraryId>('all')

  const libraries = useMemo(() => [
    { id: 'components' as LibraryId, label: 'Componentes', data: componentData as unknown as DashboardData },
    { id: 'templates' as LibraryId, label: 'Templates', data: templateData as unknown as DashboardData },
  ], [])

  const activeData = useMemo((): DashboardData => {
    if (activeLibrary === 'all') return mergeLibraries(libraries)
    const lib = libraries.find(l => l.id === activeLibrary)
    return lib?.data?.extractedAt ? lib.data : emptyData
  }, [activeLibrary, libraries])

  return (
    <div className="app-layout">
      <Sidebar
        currentView={view}
        onViewChange={setView}
        data={activeData}
        libraries={libraries}
        activeLibrary={activeLibrary}
        onLibraryChange={setActiveLibrary}
      />
      <main className="main-content">
        {view === 'overview'    && <Overview data={activeData} />}
        {view === 'components'  && <ComponentIndex data={activeData} />}
        {view === 'tokens'      && <TokenExplorer data={activeData} />}
        {view === 'orphans'     && <OrphanTokens data={activeData} />}
        {view === 'assets'      && <AssetTokens />}
        {view === 'changelog'   && <Changelog />}
      </main>
    </div>
  )
}
