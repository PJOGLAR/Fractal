import { useState, useMemo } from 'react'
import { DashboardData } from '../types'
import './PropExplorer.css'

interface PropExplorerProps {
  data: DashboardData
}

interface PropInfo {
  name: string
  values: Set<string>
  components: Set<string>
}

export function PropExplorer({ data }: PropExplorerProps) {
  const [search, setSearch] = useState('')
  const [selectedProp, setSelectedProp] = useState<string | null>(null)
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  // Parse all variant names to extract props
  const allProps = useMemo(() => {
    const propMap: Record<string, PropInfo> = {}

    for (const comp of data.components) {
      if (comp.componentName.includes('⛔')) continue

      for (const binding of comp.bindings) {
        const layerName = binding.layerName
        if (!layerName.includes('=')) continue

        // Parse "Size=lg, State=default, Style=solid"
        const pairs = layerName.split(',').map(s => s.trim())
        for (const pair of pairs) {
          const [key, value] = pair.split('=').map(s => s.trim())
          if (!key || !value) continue

          if (!propMap[key]) {
            propMap[key] = { name: key, values: new Set(), components: new Set() }
          }
          propMap[key].values.add(value)
          propMap[key].components.add(comp.componentName)
        }
      }
    }

    return Object.values(propMap).sort((a, b) => b.components.size - a.components.size)
  }, [data])

  // Filter props by search
  const filteredProps = useMemo(() => {
    if (!search) return allProps
    const q = search.toLowerCase()
    return allProps.filter(p =>
      p.name.toLowerCase().includes(q) ||
      [...p.values].some(v => v.toLowerCase().includes(q))
    )
  }, [allProps, search])

  // Get components for selected prop + value
  const matchingComponents = useMemo(() => {
    if (!selectedProp) return []

    const results: { component: string; values: string[] }[] = []

    for (const comp of data.components) {
      if (comp.componentName.includes('⛔')) continue

      const compValues = new Set<string>()
      for (const binding of comp.bindings) {
        if (!binding.layerName.includes('=')) continue
        const pairs = binding.layerName.split(',').map(s => s.trim())
        for (const pair of pairs) {
          const [key, value] = pair.split('=').map(s => s.trim())
          if (key === selectedProp) {
            if (!selectedValue || value === selectedValue) {
              compValues.add(value)
            }
          }
        }
      }

      if (compValues.size > 0) {
        results.push({ component: comp.componentName, values: [...compValues].sort() })
      }
    }

    return results.sort((a, b) => a.component.localeCompare(b.component))
  }, [data, selectedProp, selectedValue])

  // Get values for selected prop
  const propValues = useMemo(() => {
    if (!selectedProp) return []
    const prop = allProps.find(p => p.name === selectedProp)
    return prop ? [...prop.values].sort() : []
  }, [allProps, selectedProp])

  return (
    <div className="prop-explorer">
      <h2 className="page-title">Props de componentes</h2>
      <p className="page-description">Explorá las propiedades y variantes de los componentes</p>

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar prop o valor (ej: Size, lg, State, hover...)"
          value={search}
          onChange={e => { setSearch(e.target.value); setSelectedProp(null); setSelectedValue(null) }}
        />
      </div>

      <div className="prop-layout">
        {/* Props list */}
        <div className="prop-list">
          <h3 className="prop-list-title">Propiedades ({filteredProps.length})</h3>
          {filteredProps.map(prop => (
            <button
              key={prop.name}
              className={`prop-item ${selectedProp === prop.name ? 'active' : ''}`}
              onClick={() => { setSelectedProp(prop.name); setSelectedValue(null) }}
            >
              <span className="prop-name">{prop.name}</span>
              <span className="prop-meta">{prop.components.size} comp · {prop.values.size} valores</span>
            </button>
          ))}
        </div>

        {/* Values + Components */}
        <div className="prop-detail">
          {selectedProp && (
            <>
              <h3 className="prop-detail-title">{selectedProp}</h3>

              {/* Value filter chips */}
              <div className="prop-values">
                <button
                  className={`filter-chip ${selectedValue === null ? 'active' : ''}`}
                  onClick={() => setSelectedValue(null)}
                >
                  Todos ({matchingComponents.length})
                </button>
                {propValues.map(val => (
                  <button
                    key={val}
                    className={`filter-chip ${selectedValue === val ? 'active' : ''}`}
                    onClick={() => setSelectedValue(val)}
                  >
                    {val}
                  </button>
                ))}
              </div>

              {/* Matching components */}
              <div className="prop-components">
                {matchingComponents.map(({ component, values }) => (
                  <div key={component} className="prop-component-item">
                    <span className="prop-component-name">{component}</span>
                    <span className="prop-component-values">{values.join(', ')}</span>
                  </div>
                ))}
                {matchingComponents.length === 0 && (
                  <p className="prop-empty">No se encontraron componentes</p>
                )}
              </div>
            </>
          )}

          {!selectedProp && (
            <div className="prop-empty-state">
              <p>Seleccioná una propiedad para ver sus valores y componentes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
