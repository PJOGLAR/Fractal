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
  instances?: Array<{ name: string; componentId: string }>  // instancias anidadas (para detectar anidación)
}

interface Snapshot {
  takenAt: string
  fileKey: string
  fileName: string
  components: SnapshotComponent[]
  stats: { totalComponents: number; totalBindings: number; totalProperties: number }
}

interface DiffEntry {
  type: 'component_added' | 'component_removed' | 'component_renamed' | 'component_deprecated'
      | 'binding_added' | 'binding_removed' | 'binding_changed' | 'binding_unbound'
      | 'property_changed' | 'component_props_initial'
      | 'component_prop_added' | 'component_prop_removed'
      | 'component_nested' | 'component_unnested'
      | 'variant_added' | 'variant_removed'
  component: string
  nodeId: string
  details: string
  parentName?: string  // nombre del COMPONENT_SET padre, si aplica
  // Campos expandidos para changelog detallado
  variant?: string     // nombre de la variante afectada (ej: "State=Pressed")
  property?: string    // nombre de la propiedad (ej: "paddingLeft", "fontSize")
  layerName?: string   // capa dentro del componente
  oldValue?: string    // valor anterior
  newValue?: string    // valor nuevo
  tokenName?: string   // nombre del token (si aplica)
}

interface ChangelogEntry {
  id: string
  timestamp: string
  fileKey: string
  fileName: string
  fileLabel: string
  summary: string
  changes: DiffEntry[]
  detailed: Record<string, any>  // Información detallada por componente
  stats: Record<string, number>
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
      // Don't recurse into nested COMPONENT/COMPONENT_SET — they are tracked separately,
      // so recursing here would double-count a set's bindings with its variants'.
      if (child.type === 'COMPONENT' || child.type === 'COMPONENT_SET') continue
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
  // Capture name + type (BOOLEAN, TEXT, INSTANCE_SWAP, VARIANT)
  if (node.componentPropertyDefinitions) {
    const defs = node.componentPropertyDefinitions
    // Format: "name#id:TYPE" pairs, sorted by name
    const propEntries = Object.keys(defs).sort().map(key => {
      const type = defs[key]?.type || 'UNKNOWN'
      return `${key}:${type}`
    })
    props.push({ layerName: node.name, property: '__componentProps__', value: propEntries.join(',') })
  }

  // Track layer name itself (for rename detection)
  props.push({ layerName: node.name, property: '__layerName__', value: node.name })

  if (node.children) {
    for (const child of node.children) {
      // Don't recurse into nested COMPONENT/COMPONENT_SET — tracked separately (avoid double-count)
      if (child.type === 'COMPONENT' || child.type === 'COMPONENT_SET') continue
      props.push(...extractProperties(child))
    }
  }
  return props
}

/** Extract nested INSTANCE nodes (references to other components) inside a component */
function extractInstances(node: any, isRoot = true): Array<{ name: string; componentId: string }> {
  const instances: Array<{ name: string; componentId: string }> = []
  if (!isRoot && node.type === 'INSTANCE' && node.componentId) {
    instances.push({ name: node.name, componentId: node.componentId })
  }
  if (node.children) {
    for (const child of node.children) {
      instances.push(...extractInstances(child, false))
    }
  }
  return instances
}

async function takeSnapshot(): Promise<Snapshot> {
  console.log('  Leyendo archivo de Figma (deep mode)...')
  const fileData = await figmaGet<{ name: string; document: any }>(`https://api.figma.com/v1/files/${FILE_KEY}?depth=8`)

  const components: SnapshotComponent[] = []
  // The Figma REST API does NOT give nodes a `.parent` back-reference, so we track the
  // parent COMPONENT_SET id explicitly while traversing the tree.
  function findComponents(node: any, parentSetId?: string) {
    if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
      const parentId = node.type === 'COMPONENT' ? parentSetId : undefined
      components.push({ id: node.id, name: node.name, type: node.type, parentId, bindings: extractBindings(node), properties: extractProperties(node), instances: extractInstances(node) })
    }
    if (node.children) {
      // If this node is a COMPONENT_SET, its children are variants → pass its id down as parent
      const childParentSetId = node.type === 'COMPONENT_SET' ? node.id : parentSetId
      for (const child of node.children) findComponents(child, childParentSetId)
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
      // Distinguish: a variant added to a PRE-EXISTING set vs. a brand-new component/set.
      // If this is a variant (has parent) and the parent set already existed before → variant_added.
      const parentExistedBefore = comp.parentId ? beforeMap.has(comp.parentId) : false
      if (parentExistedBefore && parentName) {
        diffs.push({ type: 'variant_added', component: comp.name, nodeId: id, details: comp.name, parentName })
      } else {
        // Brand-new component or set → only the name (no breakdown)
        diffs.push({ type: 'component_added', component: comp.name, nodeId: id, details: `${comp.name} (${comp.type})`, ...(parentName ? { parentName } : {}) })
      }
    }
  }
  for (const [id, comp] of beforeMap) {
    if (!afterMap.has(id)) {
      // Resolve parent name: for variants (COMPONENT inside a COMPONENT_SET), find the set name
      let parentName: string | undefined
      if (comp.parentId) {
        parentName = beforeMap.get(comp.parentId)?.name || afterMap.get(comp.parentId)?.name
      }
      // If no parentId but name has "=" (it's a variant), try to find the set by looking at siblings
      if (!parentName && comp.name.includes('=') && comp.type === 'COMPONENT') {
        // Find a COMPONENT_SET that was also removed and could be the parent
        for (const [, otherComp] of beforeMap) {
          if (otherComp.type === 'COMPONENT_SET' && !afterMap.has(otherComp.id)) {
            // Check if this variant's parentId matches
            if (comp.parentId === otherComp.id) {
              parentName = otherComp.name
              break
            }
          }
        }
      }
      // Distinguish: variant removed from a set that STILL exists vs. whole set/component removed
      const parentStillExists = comp.parentId ? afterMap.has(comp.parentId) : false
      if (parentStillExists && parentName) {
        diffs.push({ type: 'variant_removed', component: comp.name, nodeId: id, details: comp.name, parentName })
      } else {
        diffs.push({ type: 'component_removed', component: comp.name, nodeId: id, details: comp.name, ...(parentName ? { parentName } : {}) })
      }
    }
  }

  // Compare existing components
  for (const [id, beforeComp] of beforeMap) {
    const afterComp = afterMap.get(id)
    if (!afterComp) continue

    // Rename detection — flag as deprecation if the new name gains the ⛔ marker
    if (beforeComp.name !== afterComp.name) {
      const gainedDeprecation = !beforeComp.name.includes('⛔') && afterComp.name.includes('⛔')
      if (gainedDeprecation) {
        diffs.push({ type: 'component_deprecated', component: afterComp.name, nodeId: id, details: `${beforeComp.name} → ${afterComp.name}` })
      } else {
        diffs.push({ type: 'component_renamed', component: afterComp.name, nodeId: id, details: `${beforeComp.name} → ${afterComp.name}` })
      }
    }

    // --- Component property add/remove (Boolean/Text/Instance swap/Variant) ---
    // Compare by NAME so it works across snapshot formats (old = names only, new = name:TYPE)
    const parsePropNames = (comp: SnapshotComponent) => {
      const entry = comp.properties.find(p => p.property === '__componentProps__')
      const map = new Map<string, string>() // name → type (type may be '' for old format)
      if (entry?.value) {
        for (const seg of String(entry.value).split(',')) {
          const m = seg.match(/:(BOOLEAN|TEXT|INSTANCE_SWAP|VARIANT)$/)
          const type = m ? m[1] : ''
          const rawName = m ? seg.slice(0, seg.length - m[0].length) : seg
          const name = rawName.split('#')[0].trim()
          if (name) map.set(name, type)
        }
      }
      return map
    }
    const beforeProps = parsePropNames(beforeComp)
    const afterProps = parsePropNames(afterComp)
    for (const [name, type] of afterProps) {
      if (!beforeProps.has(name)) {
        diffs.push({ type: 'component_prop_added', component: afterComp.name, nodeId: id, details: type ? `${name}|${type}` : name })
      }
    }
    for (const [name, type] of beforeProps) {
      if (!afterProps.has(name)) {
        diffs.push({ type: 'component_prop_removed', component: afterComp.name, nodeId: id, details: type ? `${name}|${type}` : name })
      }
    }

    // --- Nesting detection DESACTIVADA ---
    // La detección de instancias anidadas generaba mucho ruido (falsos positivos por
    // reordenamiento/duplicados) y no aporta al changelog simplificado. Se omite.

    const beforeBindings = new Map(beforeComp.bindings.map(b => [`${b.layerName}|${b.property}`, b]))
    const afterBindings = new Map(afterComp.bindings.map(b => [`${b.layerName}|${b.property}`, b]))

    for (const [key, binding] of afterBindings) {
      const prev = beforeBindings.get(key)
      if (!prev) {
        const tokenName = names.get(binding.variableId) || binding.variableId.slice(-12)
        diffs.push({ 
          type: 'binding_added', 
          component: afterComp.name, 
          nodeId: id, 
          details: `${binding.layerName}.${binding.property} → ${tokenName}`,
          variant: afterComp.name.includes('=') ? afterComp.name : undefined,
          property: binding.property,
          layerName: binding.layerName,
          tokenName
        })
      } else if (prev.variableId !== binding.variableId) {
        const prevName = names.get(prev.variableId) || prev.variableId.slice(-12)
        const newName = names.get(binding.variableId) || binding.variableId.slice(-12)
        diffs.push({ 
          type: 'binding_changed', 
          component: afterComp.name, 
          nodeId: id, 
          details: `${binding.layerName}.${binding.property}: ${prevName} → ${newName}`,
          variant: afterComp.name.includes('=') ? afterComp.name : undefined,
          property: binding.property,
          layerName: binding.layerName,
          oldValue: prevName,
          newValue: newName,
          tokenName: newName
        })
      }
    }

    for (const [key, binding] of beforeBindings) {
      if (!afterBindings.has(key)) {
        const tokenName = names.get(binding.variableId) || binding.variableId.slice(-12)
        diffs.push({ 
          type: 'binding_removed', 
          component: beforeComp.name, 
          nodeId: id, 
          details: `${binding.layerName}.${binding.property} (era: ${tokenName})`,
          variant: beforeComp.name.includes('=') ? beforeComp.name : undefined,
          property: binding.property,
          layerName: binding.layerName,
          oldValue: tokenName,
          tokenName
        })
      }
    }

    // Compare properties (numeric values)
    const beforePropVals = new Map(beforeComp.properties.map(p => [`${p.layerName}|${p.property}`, p]))
    const afterPropVals = new Map(afterComp.properties.map(p => [`${p.layerName}|${p.property}`, p]))

    for (const [key, prop] of afterPropVals) {
      // Skip internal tracking markers — they are used for other detections, not property diffs
      if (prop.property === '__componentProps__' || prop.property === '__layerName__') continue
      const prev = beforePropVals.get(key)
      if (prev && prev.value !== prop.value) {
        diffs.push({ 
          type: 'property_changed', 
          component: afterComp.name, 
          nodeId: id, 
          details: `${prop.layerName}.${prop.property}: ${prev.value} → ${prop.value}`,
          variant: afterComp.name.includes('=') ? afterComp.name : undefined,
          property: prop.property,
          layerName: prop.layerName,
          oldValue: String(prev.value),
          newValue: String(prop.value)
        })
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

  // Names of newly-added components — their bindings/props are not counted in the summary,
  // since new components are reported by name only (no breakdown).
  const addedComponentNames = new Set(
    diffs.filter(d => d.type === 'component_added').map(d => d.component)
  )
  const isFromNewComponent = (d: DiffEntry) => addedComponentNames.has(d.component)

  const stats = {
    componentsAdded: diffs.filter(d => d.type === 'component_added').length,
    componentsRemoved: diffs.filter(d => d.type === 'component_removed').length,
    componentsDeprecated: diffs.filter(d => d.type === 'component_deprecated').length,
    componentsRenamed: diffs.filter(d => d.type === 'component_renamed').length,
    variantsAdded: diffs.filter(d => d.type === 'variant_added').length,
    variantsRemoved: diffs.filter(d => d.type === 'variant_removed').length,
    propsAdded: diffs.filter(d => d.type === 'component_prop_added').length,
    propsRemoved: diffs.filter(d => d.type === 'component_prop_removed').length,
    nested: diffs.filter(d => d.type === 'component_nested').length,
    unnested: diffs.filter(d => d.type === 'component_unnested').length,
    bindingsAdded: diffs.filter(d => d.type === 'binding_added' && !isFromNewComponent(d)).length,
    bindingsRemoved: diffs.filter(d => d.type === 'binding_removed' && !isFromNewComponent(d)).length,
    bindingsChanged: diffs.filter(d => d.type === 'binding_changed' && !isFromNewComponent(d)).length,
    propertiesChanged: diffs.filter(d => d.type === 'property_changed' && !isFromNewComponent(d)).length,
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

  const printSimple = (title: string, type: DiffEntry['type'], fmt: (d: DiffEntry) => string) => {
    const items = diffs.filter(d => d.type === type)
    if (items.length === 0) return
    console.log(`### ${title}`)
    for (const d of items) console.log(`  ${fmt(d)}`)
    console.log('')
  }
  printSimple('Deprecados', 'component_deprecated', d => d.details)
  printSimple('Variantes nuevas (set existente)', 'variant_added', d => `+ ${d.parentName} › ${d.component}`)
  printSimple('Variantes eliminadas (set existente)', 'variant_removed', d => `- ${d.parentName} › ${d.component}`)
  printSimple('Propiedades agregadas', 'component_prop_added', d => `+ ${d.component}: ${d.details}`)
  printSimple('Propiedades eliminadas', 'component_prop_removed', d => `- ${d.component}: ${d.details}`)
  printSimple('Componentes anidados', 'component_nested', d => `${d.component} ← ${d.details}`)
  printSimple('Componentes des-anidados', 'component_unnested', d => `${d.component} ⤫ ${d.details}`)

  const COMPONENT_LEVEL_TYPES = new Set<DiffEntry['type']>([
    'component_added', 'component_removed', 'component_renamed', 'component_deprecated',
    'variant_added', 'variant_removed', 'component_prop_added', 'component_prop_removed',
    'component_nested', 'component_unnested',
  ])

  // Group remaining changes by component
  const changedComponents = new Map<string, { 
    name: string; 
    nodeId: string; 
    isVariant: boolean;
    parentName?: string;
    tokens: DiffEntry[]; 
    properties: DiffEntry[] 
  }>()
  
  for (const d of diffs) {
    if (COMPONENT_LEVEL_TYPES.has(d.type)) continue
    const key = `${d.component}|${d.nodeId}`
    if (!changedComponents.has(key)) {
      changedComponents.set(key, { 
        name: d.component, 
        nodeId: d.nodeId,
        isVariant: d.component.includes('='),
        parentName: d.parentName,
        tokens: [], 
        properties: [] 
      })
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
      // Header del componente
      const componentHeader = comp.isVariant 
        ? `**${comp.name}**` 
        : `**${comp.name}**`
      
      console.log(`${componentHeader}`)
      
      // Agrupar tokens por propiedad para mejor lectura
      const tokensByProperty = new Map<string, DiffEntry[]>()
      for (const t of comp.tokens) {
        const propKey = t.property || 'other'
        if (!tokensByProperty.has(propKey)) tokensByProperty.set(propKey, [])
        tokensByProperty.get(propKey)!.push(t)
      }
      
      // Mostrar cambios de tokens agrupados
      if (tokensByProperty.size > 0) {
        console.log('  🎨 Tokens:')
        for (const [propName, changes] of tokensByProperty) {
          const changed = changes.filter(d => d.type === 'binding_changed')
          const added = changes.filter(d => d.type === 'binding_added')
          const removed = changes.filter(d => d.type === 'binding_removed')
          
          if (changed.length > 0) {
            console.log(`    • ${propName} (${changed.length} cambios):`)
            for (const d of changed.slice(0, 5)) {
              const layer = d.layerName ? `${d.layerName} → ` : ''
              console.log(`      ${layer}${d.oldValue} ➜ ${d.newValue}`)
            }
            if (changed.length > 5) console.log(`      ... y ${changed.length - 5} más`)
          }
          
          if (added.length > 0) {
            console.log(`    • ${propName} (+${added.length} nuevos):`)
            for (const d of added.slice(0, 3)) {
              const layer = d.layerName ? `${d.layerName} → ` : ''
              console.log(`      + ${layer}${d.tokenName}`)
            }
            if (added.length > 3) console.log(`      ... y ${added.length - 3} más`)
          }
          
          if (removed.length > 0) {
            console.log(`    • ${propName} (-${removed.length} eliminados):`)
            for (const d of removed.slice(0, 3)) {
              const layer = d.layerName ? `${d.layerName} → ` : ''
              console.log(`      - ${layer}${d.oldValue}`)
            }
            if (removed.length > 3) console.log(`      ... y ${removed.length - 3} más`)
          }
        }
      }
      
      // Agrupar propiedades visuales por tipo
      const propsByType = new Map<string, DiffEntry[]>()
      const PROP_CATEGORIES: Record<string, string[]> = {
        'Spacing': ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'itemSpacing'],
        'Tamaño': ['width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight', 'size.width', 'size.height'],
        'Bordes': ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius', 'strokeWeight'],
        'Tipografía': ['fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing', 'characters'],
        'Layout': ['layoutMode', 'primaryAxisAlignItems', 'counterAxisAlignItems', 'layoutWrap', 'primaryAxisSizingMode', 'counterAxisSizingMode'],
        'Visual': ['opacity', 'visible', 'blendMode', 'clipsContent', 'effects'],
        'Color': ['fill[0].color', 'fill[1].color', 'stroke[0].color', 'fill[0].opacity']
      }
      
      for (const prop of comp.properties) {
        let category = 'Otros'
        for (const [cat, props] of Object.entries(PROP_CATEGORIES)) {
          if (props.some(p => prop.property?.includes(p))) {
            category = cat
            break
          }
        }
        if (!propsByType.has(category)) propsByType.set(category, [])
        propsByType.get(category)!.push(prop)
      }
      
      if (propsByType.size > 0) {
        console.log('  📐 Propiedades visuales:')
        for (const [category, props] of propsByType) {
          if (props.length > 0) {
            console.log(`    • ${category} (${props.length} cambios):`)
            for (const d of props.slice(0, 5)) {
              const layer = d.layerName !== d.component ? `${d.layerName} → ` : ''
              const propName = d.property?.replace('size.', '').replace('[0].', ' ').replace('[1].', ' ')
              console.log(`      ${layer}${propName}: ${d.oldValue} ➜ ${d.newValue}`)
            }
            if (props.length > 5) console.log(`      ... y ${props.length - 5} más`)
          }
        }
      }
      
      console.log('')
    }
  }

  // Summary — count sets (public components), not the individual variants of a new set
  const addedSets = diffs.filter(d => d.type === 'component_added' && !d.component.includes('=') && !d.component.includes('⛔'))
  const removedSets = diffs.filter(d => d.type === 'component_removed' && !d.component.includes('=') && !d.component.includes('⛔'))

  const plural = (n: number, sing: string, plu: string) => `${n} ${n > 1 ? plu : sing}`

  const summaryParts: string[] = []
  if (addedSets.length > 0) summaryParts.push(plural(addedSets.length, 'componente nuevo', 'componentes nuevos'))
  if (removedSets.length > 0) summaryParts.push(plural(removedSets.length, 'componente eliminado', 'componentes eliminados'))
  if (stats.componentsDeprecated > 0) summaryParts.push(plural(stats.componentsDeprecated, 'componente deprecado', 'componentes deprecados'))
  if (stats.componentsRenamed > 0) summaryParts.push(plural(stats.componentsRenamed, 'renombrado', 'renombrados'))
  if (stats.variantsAdded > 0) summaryParts.push(plural(stats.variantsAdded, 'variante nueva', 'variantes nuevas'))
  if (stats.variantsRemoved > 0) summaryParts.push(plural(stats.variantsRemoved, 'variante eliminada', 'variantes eliminadas'))
  if (stats.propsAdded > 0) summaryParts.push(plural(stats.propsAdded, 'propiedad agregada', 'propiedades agregadas'))
  if (stats.propsRemoved > 0) summaryParts.push(plural(stats.propsRemoved, 'propiedad eliminada', 'propiedades eliminadas'))
  if (stats.nested > 0) summaryParts.push(plural(stats.nested, 'componente anidado', 'componentes anidados'))
  if (stats.unnested > 0) summaryParts.push(plural(stats.unnested, 'componente des-anidado', 'componentes des-anidados'))
  if (stats.bindingsAdded > 0) summaryParts.push(plural(stats.bindingsAdded, 'token nuevo', 'tokens nuevos'))
  if (stats.bindingsRemoved > 0) summaryParts.push(plural(stats.bindingsRemoved, 'token desvinculado', 'tokens desvinculados'))
  if (stats.bindingsChanged > 0) summaryParts.push(plural(stats.bindingsChanged, 'token cambiado', 'tokens cambiados'))
  if (stats.propertiesChanged > 0) summaryParts.push(plural(stats.propertiesChanged, 'propiedad cambiada', 'propiedades cambiadas'))

  // Colapsar los cambios crudos a 3 buckets de nombres de componente y guardar compacto.
  // El detalle interno (tokens, propiedades, variantes, anidación) se resume como "iteración".
  const isReal = (n?: string): n is string => !!n && !n.includes('=') && !n.includes('⛔')
  const nuevos = new Set<string>(), eliminados = new Set<string>(), iterados = new Set<string>()
  for (const ch of diffs) {
    const comp = ch.component || '', parent = ch.parentName
    switch (ch.type) {
      case 'component_added': if (isReal(comp)) nuevos.add(comp); else if (isReal(parent)) iterados.add(parent); break
      case 'component_removed': if (isReal(comp)) eliminados.add(comp); else if (isReal(parent)) iterados.add(parent); break
      case 'component_deprecated': { const o = ch.details.split('→')[0].trim(); if (isReal(o)) eliminados.add(o); else if (isReal(comp)) eliminados.add(comp); break }
      case 'component_renamed': { const nw = ch.details.split('→')[1]?.trim() || comp; if (isReal(nw)) iterados.add(nw); break }
      case 'variant_added': case 'variant_removed': if (isReal(parent)) iterados.add(parent); else if (isReal(comp)) iterados.add(comp); break
      default: if (isReal(comp)) iterados.add(comp); else if (isReal(parent)) iterados.add(parent)
    }
  }
  for (const n of nuevos) iterados.delete(n)
  for (const n of eliminados) iterados.delete(n)

  // Generar changelog detallado por componente
  const detailedChanges: Record<string, any> = {}
  
  for (const [, comp] of changedComponents) {
    const compName = comp.name.includes('=') ? comp.name.split('=')[0] : comp.name
    
    if (!detailedChanges[compName]) {
      detailedChanges[compName] = {
        name: compName,
        isVariant: comp.isVariant,
        variants: {},
        summary: {
          tokensChanged: 0,
          tokensAdded: 0,
          tokensRemoved: 0,
          propertiesChanged: 0
        }
      }
    }
    
    const variantKey = comp.isVariant ? comp.name : '_base'
    detailedChanges[compName].variants[variantKey] = {
      tokens: {
        changed: comp.tokens.filter(d => d.type === 'binding_changed').map(d => ({
          property: d.property,
          layer: d.layerName,
          from: d.oldValue,
          to: d.newValue
        })),
        added: comp.tokens.filter(d => d.type === 'binding_added').map(d => ({
          property: d.property,
          layer: d.layerName,
          token: d.tokenName
        })),
        removed: comp.tokens.filter(d => d.type === 'binding_removed').map(d => ({
          property: d.property,
          layer: d.layerName,
          token: d.oldValue
        }))
      },
      properties: comp.properties.map(d => ({
        property: d.property,
        layer: d.layerName,
        from: d.oldValue,
        to: d.newValue
      }))
    }
    
    // Update summary
    detailedChanges[compName].summary.tokensChanged += comp.tokens.filter(d => d.type === 'binding_changed').length
    detailedChanges[compName].summary.tokensAdded += comp.tokens.filter(d => d.type === 'binding_added').length
    detailedChanges[compName].summary.tokensRemoved += comp.tokens.filter(d => d.type === 'binding_removed').length
    detailedChanges[compName].summary.propertiesChanged += comp.properties.length
  }

  const compactChanges: DiffEntry[] = [
    ...[...nuevos].sort().map(n => ({ type: 'component_added' as const, component: n, nodeId: '', details: n })),
    ...[...eliminados].sort().map(n => ({ type: 'component_removed' as const, component: n, nodeId: '', details: n })),
    ...[...iterados].sort().map(n => ({ type: 'binding_changed' as const, component: n, nodeId: '', details: '' })),
  ]

  const compactSummaryParts: string[] = []
  if (nuevos.size) compactSummaryParts.push(plural(nuevos.size, 'nuevo', 'nuevos'))
  if (eliminados.size) compactSummaryParts.push(plural(eliminados.size, 'eliminado', 'eliminados'))
  if (iterados.size) compactSummaryParts.push(plural(iterados.size, 'iterado', 'iterados'))
  const compactSummary = compactSummaryParts.join(' · ') || 'Sin cambios de componentes'

  const entry: ChangelogEntry = {
    id: Date.now().toString(36),
    timestamp: new Date().toISOString(),
    fileKey: FILE_KEY,
    fileName: current.fileName,
    fileLabel: FILE_LABEL,
    summary: compactSummary,
    changes: compactChanges,
    detailed: detailedChanges,
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
  console.log(`Resumen: ${compactSummary}`)
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
