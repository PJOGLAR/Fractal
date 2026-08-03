/**
 * extract-flows.ts
 * 
 * Extrae qué componentes del DS se usan en cada flujo de diseño UX.
 * 
 * Estrategia de resolución:
 *   - Los componentId de las instancias apuntan al archivo de la librería del DS,
 *     con IDs distintos a los del snapshot local. No se puede cruzar por ID.
 *   - En cambio, el NOMBRE del nodo INSTANCE siempre es el nombre del componente DS.
 *   - Los componentes locales usan el prefijo "[LOCAL]" por convención del equipo.
 *   - La page "🧪 Local Components" define los componentes locales, cada uno hecho
 *     con instancias del DS.
 * 
 * Output: src/data/flows-data.json
 * 
 * Usage:
 *   npm run extract-flows
 */

import 'dotenv/config'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

const TOKEN = process.env.FIGMA_TOKEN!
if (!TOKEN) { console.error('❌ Falta FIGMA_TOKEN'); process.exit(1) }
const headers = { 'X-Figma-Token': TOKEN }

// ---------------------------------------------------------------------------
// Config: flujos a analizar
// Agregar más flujos acá cuando sea necesario.
// ---------------------------------------------------------------------------
const FLOWS: Array<{
  fileKey: string
  label: string
  localComponentsPageId: string
  pages: Array<{ id: string; label: string }>
}> = [
  {
    fileKey: 'RIXLL0YdQa31zycjO6zvDz',
    label: 'Beneficios AR',
    localComponentsPageId: '4002:29067',
    pages: [
      { id: '126:16753', label: 'Home de beneficios V1' },
      { id: '4090:29301', label: 'Búsqueda de beneficios V1' },
      { id: '4757:98883', label: 'Listas de beneficios V1' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function figmaNodes(fileKey: string, ids: string[]): Promise<any> {
  const url = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(ids.join(','))}&depth=8`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`Figma API error ${res.status}: ${await res.text()}`)
  return res.json()
}

/** Build a Set of known DS component names from the snapshot */
function buildDSNameSet(snapPath: string): Set<string> {
  if (!existsSync(snapPath)) {
    console.warn('  ⚠️  No se encontró snapshot DS. Resolución de nombres parcial.')
    return new Set()
  }
  const snap = JSON.parse(readFileSync(snapPath, 'utf-8'))
  const names = new Set<string>()
  for (const c of snap.components || []) {
    // Only top-level (COMPONENT_SET or standalone COMPONENT)
    if (c.type === 'COMPONENT_SET' || !c.parentId) {
      names.add(c.name)
    }
  }
  return names
}

/** Walk a node tree and collect INSTANCE names */
function collectInstances(node: any): Map<string, number> {
  // name → count
  const counts = new Map<string, number>()
  function walk(n: any) {
    if (n.type === 'INSTANCE') {
      const name = n.name || ''
      counts.set(name, (counts.get(name) || 0) + 1)
    }
    if (n.children) for (const c of n.children) walk(c)
  }
  walk(node)
  return counts
}

/**
 * Given the instance name map, separate DS components from local ones.
 * DS components are those whose name matches a known DS component name.
 * Local components have the [LOCAL] prefix.
 */
function classifyInstances(
  instanceCounts: Map<string, number>,
  dsNames: Set<string>,
  localCompMap: Map<string, { name: string; dsNames: string[] }>
): {
  direct: Array<{ name: string; count: number }>
  viaLocal: Array<{ localName: string; dsComponents: string[] }>
  unresolved: string[]
} {
  const direct = new Map<string, number>()
  const viaLocalMap = new Map<string, Set<string>>()
  const unresolved: string[] = []

  for (const [name, count] of instanceCounts) {
    if (dsNames.has(name)) {
      // Direct DS component
      direct.set(name, (direct.get(name) || 0) + count)
    } else if (name.startsWith('[LOCAL]') || localCompMap.has(name)) {
      // Local component — resolve its DS components
      const localKey = name.startsWith('[LOCAL]') ? name : name
      const localInfo = localCompMap.get(localKey)
      if (localInfo && localInfo.dsNames.length > 0) {
        if (!viaLocalMap.has(localKey)) viaLocalMap.set(localKey, new Set())
        for (const ds of localInfo.dsNames) viaLocalMap.get(localKey)!.add(ds)
      } else {
        unresolved.push(name)
      }
    } else {
      // Could be a variant or unrecognized — try stripping variant suffix
      // e.g. "Button-icon" from "Button-icon" (already clean)
      // Instances in Figma sometimes keep the component name clean
      if (!name.includes('⛔') && name.length > 0) {
        unresolved.push(name)
      }
    }
  }

  return {
    direct: [...direct.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    viaLocal: [...viaLocalMap.entries()].map(([localName, ds]) => ({ localName, dsComponents: [...ds].sort() })),
    unresolved: [...new Set(unresolved)].filter(n => !n.includes('=')).sort(),
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface FlowPageResult {
  pageId: string
  label: string
  directDS: Array<{ name: string; count: number }>
  viaLocal: Array<{ localName: string; dsComponents: string[] }>
  unresolved: string[]
  totalInstances: number
  uniqueDS: number
}

interface FlowResult {
  fileKey: string
  label: string
  extractedAt: string
  pages: FlowPageResult[]
}

async function processFlow(flow: typeof FLOWS[0], dsNames: Set<string>): Promise<FlowResult> {
  console.log(`\n📐 Flujo: ${flow.label}`)

  // 1. Build local component map
  console.log('  Leyendo Local Components...')
  const localJson = await figmaNodes(flow.fileKey, [flow.localComponentsPageId])
  const localRoot = localJson.nodes?.[flow.localComponentsPageId]?.document

  const localCompMap = new Map<string, { name: string; dsNames: string[] }>()
  if (localRoot) {
    function walkLocal(node: any) {
      if ((node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') && !node.name.includes('=')) {
        const instances = collectInstances(node)
        const dsUsed: string[] = []
        for (const [iName] of instances) {
          if (dsNames.has(iName)) dsUsed.push(iName)
        }
        localCompMap.set(node.name, { name: node.name, dsNames: [...new Set(dsUsed)].sort() })
      }
      if (node.children) for (const c of node.children) walkLocal(c)
    }
    walkLocal(localRoot)
    console.log(`  → ${localCompMap.size} componentes locales indexados`)
    const withDS = [...localCompMap.values()].filter(c => c.dsNames.length > 0)
    console.log(`  → ${withDS.length} resueltos con componentes DS`)
  } else {
    console.warn('  ⚠️  No se pudo leer Local Components')
  }

  // 2. Process each page
  console.log('  Leyendo páginas Ready for dev...')
  const pageIds = flow.pages.map(p => p.id)
  const pagesJson = await figmaNodes(flow.fileKey, pageIds)

  const pageResults: FlowPageResult[] = []
  for (const page of flow.pages) {
    const nodeData = pagesJson.nodes?.[page.id]?.document
    if (!nodeData) {
      console.warn(`  ⚠️  Page "${page.label}" no encontrada`)
      continue
    }
    const instanceCounts = collectInstances(nodeData)
    const classified = classifyInstances(instanceCounts, dsNames, localCompMap)
    const totalInstances = [...instanceCounts.values()].reduce((a, b) => a + b, 0)
    const uniqueDS = new Set([
      ...classified.direct.map(d => d.name),
      ...classified.viaLocal.flatMap(v => v.dsComponents),
    ]).size

    console.log(`  ✓ ${page.label}: ${classified.direct.length} DS directos, ${classified.viaLocal.length} locales, ${classified.unresolved.length} sin resolver`)
    pageResults.push({
      pageId: page.id,
      label: page.label,
      directDS: classified.direct,
      viaLocal: classified.viaLocal,
      unresolved: classified.unresolved,
      totalInstances,
      uniqueDS,
    })
  }

  return { fileKey: flow.fileKey, label: flow.label, extractedAt: new Date().toISOString(), pages: pageResults }
}

async function main() {
  const snapPath = join(process.cwd(), 'src', 'data', 'snapshots', 'latest-components.json')
  const outputPath = join(process.cwd(), 'src', 'data', 'flows-data.json')

  console.log('📖 Construyendo índice DS...')
  const dsNames = buildDSNameSet(snapPath)
  console.log(`   ${dsNames.size} nombres de componentes DS indexados`)

  const results: FlowResult[] = []
  for (const flow of FLOWS) {
    const result = await processFlow(flow, dsNames)
    results.push(result)
  }

  writeFileSync(outputPath, JSON.stringify(results, null, 2))
  console.log(`\n✅ Guardado en: ${outputPath}`)

  // Summary
  for (const r of results) {
    console.log(`\n${r.label}:`)
    for (const p of r.pages) {
      const allDS = new Set([...p.directDS.map(d => d.name), ...p.viaLocal.flatMap(v => v.dsComponents)])
      console.log(`  📦 ${p.label}: ${allDS.size} componentes DS únicos`)
    }
  }
}

main().catch(err => { console.error('Error:', err.message); process.exit(1) })
