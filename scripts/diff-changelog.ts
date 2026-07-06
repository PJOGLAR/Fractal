/**
 * Diff Changelog — compares current component structure with last snapshot.
 * 
 * Usage:
 *   npm run diff -- foundations
 *   npm run diff -- components
 *   npm run diff -- token-test-component
 *   npm run diff -- <file_key>
 * 
 * Uses the file content API + dashboard-data.json as name resolver.
 * The plugin extractor resolves variable names — this script uses that data.
 * 
 * Flow:
 * 1. Takes a new snapshot via Figma API (components + bound variable IDs)
 * 2. Loads previous snapshot for comparison
 * 3. Resolves variable IDs to names using dashboard-data.json
 * 4. Generates human-readable changelog
 */

import 'dotenv/config'
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const FIGMA_TOKEN = process.env.FIGMA_TOKEN!

if (!FIGMA_TOKEN) {
  console.error('❌ Falta FIGMA_TOKEN en .env')
  process.exit(1)
}

// Known file aliases
const FILE_ALIASES: Record<string, string> = {
  foundations: process.env.FIGMA_FOUNDATIONS_FILE_KEY || '',
  components: process.env.FIGMA_COMPONENTS_FILE_KEY || '',
  templates: process.env.FIGMA_TEMPLATES_FILE_KEY || '',
  assets: process.env.FIGMA_ASSETS_FILE_KEY || '',
  custom: process.env.FIGMA_CUSTOM_COMPONENTS_FILE_KEY || '',
}

// Parse argument
const arg = process.argv[2]
if (!arg) {
  console.error('❌ Indicá qué archivo comparar:')
  console.error('   npm run diff -- foundations')
  console.error('   npm run diff -- components')
  console.error('   npm run diff -- token-test-component')
  console.error('   npm run diff -- <figma_file_key>')
  console.error('')
  const available = Object.keys(FILE_ALIASES).filter(k => FILE_ALIASES[k])
  console.error('Aliases disponibles:', available.join(', '))
  process.exit(1)
}

const FILE_KEY = FILE_ALIASES[arg.toLowerCase()] || arg
const FILE_LABEL = FILE_ALIASES[arg.toLowerCase()] ? arg.toLowerCase() : FILE_KEY.slice(0, 8)

if (!FILE_KEY) {
  console.error(`❌ No se encontró file key para "${arg}".`)
  process.exit(1)
}

const headers = { 'X-Figma-Token': FIGMA_TOKEN }

// --- Name resolver (from plugin export) ---

function loadNameResolver(): Map<string, string> {
  const nameMap = new Map<string, string>()
  const dataPath = join(process.cwd(), 'src', 'data', 'component-data.json')
  
  if (!existsSync(dataPath)) {
    console.log('  ⚠️  No se encontró component-data.json — los nombres de variables no se van a resolver.')
    console.log('     Corré el plugin DS Extractor para generar el archivo.\n')
    return nameMap
  }

  try {
    const data = JSON.parse(readFileSync(dataPath, 'utf-8'))
    
    // Index semantic tokens
    if (data.foundations?.semanticTokens) {
      for (const t of data.foundations.semanticTokens) {
        if (t.id && t.name) nameMap.set(t.id, t.name)
      }
    }
    // Index primitive tokens
    if (data.foundations?.primitiveTokens) {
      for (const t of data.foundations.primitiveTokens) {
        if (t.id && t.name) nameMap.set(t.id, t.name)
      }
    }
    // Index from component bindings (tokenId → tokenName)
    if (data.components) {
      for (const comp of data.components) {
        for (const b of comp.bindings || []) {
          if (b.tokenId && b.tokenName) nameMap.set(b.tokenId, b.tokenName)
        }
      }
    }
    
    console.log(`  📖 Diccionario de nombres cargado: ${nameMap.size} variables`)
  } catch (e) {
    console.log('  ⚠️  Error leyendo dashboard-data.json')
  }
  
  return nameMap
}

// --- Types ---

interface PropertyValue {
  layerName: string
  property: string
  value: any
}

interface SnapshotComponent {
  id: string
  name: string
  type: string
  parentId?: string   // id del COMPONENT_SET padre si es variante
  bindings: Array<{ property: string; variableId: string; layerName: string }>
  properties: PropertyValue[]
}

interface Snapshot {
  takenAt: string
  fileKey: string
  fileName: string
  components: SnapshotComponent[]
  stats: { totalComponents: number; totalBindings: number; totalProperties: number }
}

interface DiffEntry {
  type: 'component_added' | 'component_removed' | 'component_renamed' | 'binding_added' | 'binding_removed' | 'binding_changed' | 'property_changed'
  component: string
  nodeId: string
  details: string
  parentName?: string  // nombre del COMPONENT_SET padre, si aplica
}

interface ChangelogEntry {
  id: string
  timestamp: string
  fileKey: string
  fileName: string
  fileLabel: string
  summary: string
  changes: DiffEntry[]
  stats: {
    componentsAdded: number
    componentsRemoved: number
    bindingsAdded: number
    bindingsRemoved: number
    bindingsChanged: number
  }
}

// --- API ---

async function figmaGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`Figma API error ${res.status}: ${await res.text()}`)
  return res.json() as Promise<T>
}

function extractBindings(node: any, _path: string = ''): Array<{ property: string; variableId: string; layerName: string }> {
  const bindings: Array<{ property: string; variableId: string; layerName: string }> = []

  if (node.boundVariables) {
    for (const [property, binding] of Object.entries(node.boundVariables)) {
      if (!binding) continue
      if (Array.isArray(binding)) {
        for (const b of binding as any[]) {
          if (b && b.id) bindings.push({ property, variableId: b.id, layerName: node.name })
        }
      } else if (typeof binding === 'object' && (binding as any).id) {
        bindings.push({ property, variableId: (binding as any).id, layerName: node.name })
      }
    }
  }

  if (node.children) {
    for (const child of node.children) {
      bindings.push(...extractBindings(child, node.name))
    }
  }
  return bindings
}

/** Extract key numeric/visual properties from all layers */
const TRACKED_PROPS = [
  // Size
  'width', 'height',
  // Spacing
  'itemSpacing', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
  // Border
  'topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius',
  'opacity', 'strokeWeight',
  // Auto Layout alignment
  'layoutMode', 'primaryAxisAlignItems', 'counterAxisAlignItems', 'layoutWrap',
  'primaryAxisSizingMode', 'counterAxisSizingMode',
  // Text properties
  'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing', 'characters',
  // Visibility
  'visible',
  // Constraints
  'minWidth', 'maxWidth', 'minHeight', 'maxHeight',
  // Clipping
  'clipsContent',
  // Blend mode
  'blendMode',
]

function extractProperties(node: any): PropertyValue[] {
  const props: PropertyValue[] = []

  for (const prop of TRACKED_PROPS) {
    if (node[prop] !== undefined && node[prop] !== null) {
      // For text content, truncate to 100 chars
      const value = prop === 'characters' ? String(node[prop]).slice(0, 100) : node[prop]
      props.push({ layerName: node.name, property: prop, value })
    }
  }
  
  // Track absoluteBoundingBox size for instances
  if (node.absoluteBoundingBox) {
    const { width, height } = node.absoluteBoundingBox
    if (width !== undefined) props.push({ layerName: node.name, property: 'size.width', value: Math.round(width) })
    if (height !== undefined) props.push({ layerName: node.name, property: 'size.height', value: Math.round(height) })
  }

  // Track fills (resolved color hex)
  if (node.fills && Array.isArray(node.fills)) {
    for (let i = 0; i < node.fills.length; i++) {
      const fill = node.fills[i]
      if (fill.type === 'SOLID' && fill.color) {
        const r = Math.round(fill.color.r * 255)
        const g = Math.round(fill.color.g * 255)
        const b = Math.round(fill.color.b * 255)
        const hex = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`.toUpperCase()
        props.push({ layerName: node.name, property: `fill[${i}].color`, value: hex })
        if (fill.opacity !== undefined && fill.opacity !== 1) {
          props.push({ layerName: node.name, property: `fill[${i}].opacity`, value: fill.opacity })
        }
      }
    }
  }

  // Track strokes (resolved color hex)
  if (node.strokes && Array.isArray(node.strokes)) {
    for (let i = 0; i < node.strokes.length; i++) {
      const stroke = node.strokes[i]
      if (stroke.type === 'SOLID' && stroke.color) {
        const r = Math.round(stroke.color.r * 255)
        const g = Math.round(stroke.color.g * 255)
        const b = Math.round(stroke.color.b * 255)
        const hex = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`.toUpperCase()
        props.push({ layerName: node.name, property: `stroke[${i}].color`, value: hex })
      }
    }
  }

  // Track effects (shadows, blurs)
  if (node.effects && Array.isArray(node.effects) && node.effects.length > 0) {
    const effectsSummary = node.effects.map((e: any) => `${e.type}${e.visible === false ? '(hidden)' : ''}`).join(',')
    props.push({ layerName: node.name, property: 'effects', value: effectsSummary })
  }

  // Track component properties (for COMPONENT_SET and COMPONENT)
  if (node.componentPropertyDefinitions) {
    const propNames = Object.keys(node.componentPropertyDefinitions).sort().join(',')
    props.push({ layerName: node.name, property: '__componentProps__', value: propNames })
  }

  // Track layer name itself (for rename detection)
  props.push({ layerName: node.name, property: '__layerName__', value: node.name })

  if (node.children) {
    for (const child of node.children) {
      props.push(...extractProperties(child))
    }
  }
  return props
}

async function takeSnapshot(): Promise<Snapshot> {
  console.log('  Leyendo archivo de Figma (deep mode)...')
  const fileData = await figmaGet<{ name: string; document: any }>(`https://api.figma.com/v1/files/${FILE_KEY}?depth=8`)

  const components: SnapshotComponent[] = []
  function findComponents(node: any) {
    if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
      const parentId = node.type === 'COMPONENT' && node.parent?.type === 'COMPONENT_SET'
        ? node.parent.id
        : undefined
      components.push({ id: node.id, name: node.name, type: node.type, parentId, bindings: extractBindings(node), properties: extractProperties(node) })
    }
    if (node.children) {
      for (const child of node.children) findComponents(child)
    }
  }
  if (fileData.document?.children) {
    for (const page of fileData.document.children) findComponents(page)
  }

  const totalBindings = components.reduce((sum, c) => sum + c.bindings.length, 0)
  const totalProperties = components.reduce((sum, c) => sum + c.properties.length, 0)
  return { takenAt: new Date().toISOString(), fileKey: FILE_KEY, fileName: fileData.name, components, stats: { totalComponents: components.length, totalBindings, totalProperties } }
}

// --- Diff ---

function computeDiff(before: Snapshot, after: Snapshot, names: Map<string, string>): DiffEntry[] {
  const diffs: DiffEntry[] = []
  const beforeMap = new Map(before.components.map(c => [c.id, c]))
  const afterMap = new Map(after.components.map(c => [c.id, c]))

  // Components added/removed
  for (const [id, comp] of afterMap) {
    if (!beforeMap.has(id)) {
      const parentName = comp.parentId ? beforeMap.get(comp.parentId)?.name || afterMap.get(comp.parentId)?.name : undefined
      diffs.push({ type: 'component_added', component: comp.name, nodeId: id, details: `${comp.name} (${comp.type})`, ...(parentName ? { parentName } : {}) })
    }
  }
  for (const [id, comp] of beforeMap) {
    if (!afterMap.has(id)) {
      const parentName = comp.parentId ? beforeMap.get(comp.parentId)?.name || afterMap.get(comp.parentId)?.name : undefined
      diffs.push({ type: 'component_removed', component: comp.name, nodeId: id, details: comp.name, ...(parentName ? { parentName } : {}) })
    }
  }

  // Compare existing components
  for (const [id, beforeComp] of beforeMap) {
    const afterComp = afterMap.get(id)
    if (!afterComp) continue

    if (beforeComp.name !== afterComp.name) {
      diffs.push({ type: 'component_renamed', component: afterComp.name, nodeId: id, details: `${beforeComp.name} → ${afterComp.name}` })
    }

    const beforeBindings = new Map(beforeComp.bindings.map(b => [`${b.layerName}|${b.property}`, b]))
    const afterBindings = new Map(afterComp.bindings.map(b => [`${b.layerName}|${b.property}`, b]))

    for (const [key, binding] of afterBindings) {
      const prev = beforeBindings.get(key)
      if (!prev) {
        const tokenName = names.get(binding.variableId) || binding.variableId.slice(-12)
        diffs.push({ type: 'binding_added', component: afterComp.name, nodeId: id, details: `${binding.layerName}.${binding.property} → ${tokenName}` })
      } else if (prev.variableId !== binding.variableId) {
        const prevName = names.get(prev.variableId) || prev.variableId.slice(-12)
        const newName = names.get(binding.variableId) || binding.variableId.slice(-12)
        diffs.push({ type: 'binding_changed', component: afterComp.name, nodeId: id, details: `${binding.layerName}.${binding.property}: ${prevName} → ${newName}` })
      }
    }

    for (const [key, binding] of beforeBindings) {
      if (!afterBindings.has(key)) {
        const tokenName = names.get(binding.variableId) || binding.variableId.slice(-12)
        diffs.push({ type: 'binding_removed', component: beforeComp.name, nodeId: id, details: `${binding.layerName}.${binding.property} (era: ${tokenName})` })
      }
    }

    // Compare properties (numeric values)
    const beforeProps = new Map(beforeComp.properties.map(p => [`${p.layerName}|${p.property}`, p]))
    const afterProps = new Map(afterComp.properties.map(p => [`${p.layerName}|${p.property}`, p]))

    for (const [key, prop] of afterProps) {
      const prev = beforeProps.get(key)
      if (prev && prev.value !== prop.value) {
        diffs.push({ type: 'property_changed', component: afterComp.name, nodeId: id, details: `${prop.layerName}.${prop.property}: ${prev.value} → ${prop.value}` })
      }
    }
  }

  return diffs
}

// --- Main ---

async function main() {
  const snapshotDir = join(process.cwd(), 'src', 'data', 'snapshots')
  const changelogPath = join(process.cwd(), 'src', 'data', 'changelog.json')
  const latestPath = join(snapshotDir, `latest-${FILE_LABEL}.json`)

  if (!existsSync(snapshotDir)) mkdirSync(snapshotDir, { recursive: true })

  // Load name resolver
  const names = loadNameResolver()

  const hasPrevious = existsSync(latestPath)
  if (!hasPrevious) {
    console.log(`\n📸 No hay snapshot previo para "${FILE_LABEL}". Tomando el primero...\n`)
    const snapshot = await takeSnapshot()
    writeFileSync(latestPath, JSON.stringify(snapshot, null, 2))
    console.log(`\n✅ Primer snapshot guardado: ${snapshot.stats.totalComponents} componentes, ${snapshot.stats.totalBindings} bindings`)
    console.log(`   Correlo de nuevo después de hacer cambios para generar el diff.`)
    return
  }

  const previous: Snapshot = JSON.parse(readFileSync(latestPath, 'utf-8'))
  console.log(`\n📋 Snapshot anterior (${FILE_LABEL}): ${previous.takenAt.slice(0, 16)}`)
  console.log(`   ${previous.stats.totalComponents} componentes, ${previous.stats.totalBindings} bindings\n`)

  console.log('📸 Tomando snapshot actual...')
  const current = await takeSnapshot()
  console.log(`   ${current.fileName}: ${current.stats.totalComponents} componentes, ${current.stats.totalBindings} bindings, ${current.stats.totalProperties} propiedades\n`)

  const diffs = computeDiff(previous, current, names)

  const stats = {
    componentsAdded: diffs.filter(d => d.type === 'component_added').length,
    componentsRemoved: diffs.filter(d => d.type === 'component_removed').length,
    bindingsAdded: diffs.filter(d => d.type === 'binding_added').length,
    bindingsRemoved: diffs.filter(d => d.type === 'binding_removed').length,
    bindingsChanged: diffs.filter(d => d.type === 'binding_changed').length,
    propertiesChanged: diffs.filter(d => d.type === 'property_changed').length,
  }

  if (diffs.length === 0) {
    console.log('✅ Sin cambios detectados desde el último snapshot.')
    return
  }


  // --- Print (formato limpio para dev) ---
  console.log('')
  console.log('='.repeat(55))
  console.log(`  CHANGELOG — ${FILE_LABEL} — ${new Date().toISOString().slice(0, 10)}`)
  console.log('='.repeat(55))
  console.log('')

  // Component-level changes
  const componentAdded = diffs.filter(d => d.type === 'component_added')
  const componentRemoved = diffs.filter(d => d.type === 'component_removed')
  const componentRenamed = diffs.filter(d => d.type === 'component_renamed')

  if (componentAdded.length > 0) {
    const sets = componentAdded.filter(d => !d.component.includes('='))
    const variants = componentAdded.filter(d => d.component.includes('='))
    console.log('### Componentes nuevos')
    for (const s of sets) {
      console.log(`  + ${s.component}${variants.length > 0 ? ` (${variants.length} variantes)` : ''}`)
    }
    if (sets.length === 0) {
      for (const v of variants) console.log(`  + Variante: ${v.component}`)
    }
    console.log('')
  }

  if (componentRemoved.length > 0) {
    const sets = componentRemoved.filter(d => !d.component.includes('='))
    const variants = componentRemoved.filter(d => d.component.includes('='))
    console.log('### Variantes/componentes eliminados')
    for (const s of sets) {
      console.log(`  - ${s.component}${variants.length > 0 ? ` (${variants.length} variantes)` : ''}`)
    }
    if (sets.length === 0) {
      for (const v of variants) console.log(`  - ${v.component}`)
    }
    console.log('')
  }

  if (componentRenamed.length > 0) {
    console.log('### Renombrados')
    for (const d of componentRenamed) console.log(`  ${d.details}`)
    console.log('')
  }

  // Group remaining changes by component
  const changedComponents = new Map<string, { name: string; nodeId: string; tokens: DiffEntry[]; properties: DiffEntry[] }>()
  
  for (const d of diffs) {
    if (d.type === 'component_added' || d.type === 'component_removed' || d.type === 'component_renamed') continue
    const key = `${d.component}|${d.nodeId}`
    if (!changedComponents.has(key)) {
      changedComponents.set(key, { name: d.component, nodeId: d.nodeId, tokens: [], properties: [] })
    }
    const entry = changedComponents.get(key)!
    if (d.type === 'property_changed') {
      entry.properties.push(d)
    } else {
      entry.tokens.push(d)
    }
  }

  if (changedComponents.size > 0) {
    console.log('### Cambios en componentes')
    console.log('')
    
    for (const [, comp] of changedComponents) {
      console.log(`**${comp.name}** (node: ${comp.nodeId})`)
      
      const tokenChanges = comp.tokens.filter(d => d.type === 'binding_changed')
      const tokenAdded = comp.tokens.filter(d => d.type === 'binding_added')
      const tokenRemoved = comp.tokens.filter(d => d.type === 'binding_removed')
      
      if (tokenChanges.length > 0) {
        console.log('  Tokens cambiados:')
        for (const d of tokenChanges) {
          const parts = d.details.split(': ')
          console.log(`    ${parts[0]}: ${parts.slice(1).join(': ')}`)
        }
      }
      
      if (tokenAdded.length > 0) {
        console.log('  Tokens agregados:')
        for (const d of tokenAdded.slice(0, 10)) console.log(`    + ${d.details}`)
        if (tokenAdded.length > 10) console.log(`    ... +${tokenAdded.length - 10} mas`)
      }
      
      if (tokenRemoved.length > 0) {
        console.log('  Tokens eliminados:')
        for (const d of tokenRemoved.slice(0, 10)) console.log(`    - ${d.details}`)
        if (tokenRemoved.length > 10) console.log(`    ... +${tokenRemoved.length - 10} mas`)
      }
      
      if (comp.properties.length > 0) {
        console.log('  Propiedades:')
        for (const d of comp.properties.slice(0, 10)) {
          const parts = d.details.split(': ')
          console.log(`    ${parts[0]}: ${parts.slice(1).join(': ')}`)
        }
        if (comp.properties.length > 10) console.log(`    ... +${comp.properties.length - 10} mas`)
      }
      
      console.log('')
    }
  }

  // Summary
  const summaryParts: string[] = []
  if (stats.componentsAdded > 0) summaryParts.push(`${stats.componentsAdded} componentes nuevos`)
  if (stats.componentsRemoved > 0) summaryParts.push(`${stats.componentsRemoved} eliminados`)
  if (componentRenamed.length > 0) summaryParts.push(`${componentRenamed.length} renombrados`)
  if (stats.bindingsAdded > 0) summaryParts.push(`${stats.bindingsAdded} tokens nuevos`)
  if (stats.bindingsRemoved > 0) summaryParts.push(`${stats.bindingsRemoved} tokens eliminados`)
  if (stats.bindingsChanged > 0) summaryParts.push(`${stats.bindingsChanged} tokens cambiados`)
  if (stats.propertiesChanged > 0) summaryParts.push(`${stats.propertiesChanged} propiedades cambiadas`)

  const entry: ChangelogEntry = {
    id: Date.now().toString(36),
    timestamp: new Date().toISOString(),
    fileKey: FILE_KEY,
    fileName: current.fileName,
    fileLabel: FILE_LABEL,
    summary: summaryParts.join(', '),
    changes: diffs,
    stats,
  }

  let changelog: ChangelogEntry[] = []
  if (existsSync(changelogPath)) {
    try { changelog = JSON.parse(readFileSync(changelogPath, 'utf-8')) } catch { /* empty */ }
  }
  changelog.unshift(entry)
  if (changelog.length > 100) changelog.length = 100
  writeFileSync(changelogPath, JSON.stringify(changelog, null, 2))

  writeFileSync(latestPath, JSON.stringify(current, null, 2))

  console.log('='.repeat(55))
  console.log(`Changelog guardado en: src/data/changelog.json`)
  console.log(`Snapshot actualizado: latest-${FILE_LABEL}.json`)
  console.log(`Resumen: ${summaryParts.join(', ')}`)
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
