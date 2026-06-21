import { useState, useMemo } from 'react'
import componentData from './data/component-data.json'
import templateData from './data/template-data.json'
import { DashboardData } from './types'
import { Header } from './components/Header'
import { ComponentIndex } from './components/ComponentIndex'
import { TokenExplorer } from './components/TokenExplorer'
import { Overview } from './components/Overview'
import { Changelog } from './components/Changelog'
import { AssetTokens } from './components/AssetTokens'
import './App.css'

type View = 'overview' | 'components' | 'tokens' | 'assets' | 'changelog'

function mergeLibraries(libraries: { id: string; label: string; data: DashboardData }[]): DashboardData {
  const merged: DashboardData = {
    extractedAt: libraries.map(l => l.data.extractedAt).filter(Boolean).sort().reverse()[0] || '',
    foundations: { collections: [], primitiveTokens: [], semanticTokens: [] },
    components: [],
    orphanTokens: [],
    hardcodedValues: [],
  }
  const seenTokenIds = new Set<string>()
  const seenCompIds = new Set<string>()

  for (const lib of libraries) {
    const d = lib.data
    if (!d.extractedAt) continue
    for (const col of d.foundations.collections) {
      if (!merged.foundations.collections.includes(col)) merged.foundations.collections.push(col)
    }
    for (const t of d.foundations.primitiveTokens) {
      if (!seenTokenIds.has(t.id)) { seenTokenIds.add(t.id); merged.foundations.primitiveTokens.push(t) }
    }
    for (const t of d.foundations.semanticTokens) {
      if (!seenTokenIds.has(t.id)) { seenTokenIds.add(t.id); merged.foundations.semanticTokens.push(t) }
    }
    for (const c of d.components) {
      if (!seenCompIds.has(c.componentId)) {
        seenCompIds.add(c.componentId)
        // tag with source library for filtering
        merged.components.push({ ...c, _library: lib.id } as any)
      }
    }
    for (const t of (d.orphanTokens || [])) {
      if (!seenTokenIds.has(t.id)) { seenTokenIds.add(t.id); merged.orphanTokens!.push(t) }
    }
    merged.hardcodedValues!.push(...(d.hardcodedValues || []))
  }
  return merged
}

export default function App() {
  const [view, setView] = useState<View>('overview')

  const libraries = useMemo(() => [
    { id: 'components', label: 'Componentes', data: componentData as unknown as DashboardData },
    { id: 'templates', label: 'Templates', data: templateData as unknown as DashboardData },
  ], [])

  const mergedData = useMemo(() => mergeLibraries(libraries), [libraries])

  return (
    <div className="app-shell">
      <Header currentView={view} onViewChange={setView} data={mergedData} />
      <main className="main-content">
        <div className="content-container">
          {view === 'overview'   && <Overview data={mergedData} />}
          {view === 'components' && <ComponentIndex data={mergedData} libraries={libraries} />}
          {view === 'tokens'     && <TokenExplorer data={mergedData} />}
          {view === 'assets'     && <AssetTokens />}
          {view === 'changelog'  && <Changelog />}
        </div>
      </main>
    </div>
  )
}
