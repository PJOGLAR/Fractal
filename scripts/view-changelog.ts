/**
 * Script para visualizar el changelog con formato mejorado y detallado.
 * 
 * Uso:
 *   npm run view-changelog
 *   npm run view-changelog -- components
 *   npm run view-changelog -- 5  (mostrar últimas 5 entradas)
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const changelogPath = join(process.cwd(), 'src', 'data', 'changelog.json')

if (!existsSync(changelogPath)) {
  console.error('❌ No se encontró el archivo changelog.json')
  process.exit(1)
}

interface ChangelogEntry {
  id: string
  timestamp: string
  fileKey: string
  fileName: string
  fileLabel: string
  summary: string
  changes: Array<{
    type: string
    component: string
    nodeId: string
    details: string
    variant?: string
    property?: string
    layerName?: string
    oldValue?: string
    newValue?: string
    tokenName?: string
  }>
  detailed?: Record<string, any>
  stats: Record<string, number>
}

const changelog: ChangelogEntry[] = JSON.parse(readFileSync(changelogPath, 'utf-8'))

// Parse arguments
const arg = process.argv[2]
const limit = arg && /^\d+$/.test(arg) ? parseInt(arg, 10) : 10
const filter = arg && !/^\d+$/.test(arg) ? arg.toLowerCase() : null

console.log('='.repeat(70))
console.log(`  CHANGELOG DETALLADO - Últimas ${limit} entradas`)
console.log('='.repeat(70))
console.log('')

let shown = 0
for (const entry of changelog) {
  if (shown >= limit) break
  if (filter && entry.fileLabel !== filter) continue
  
  shown++
  
  // Header
  const date = new Date(entry.timestamp).toLocaleString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  console.log(`📅 ${date} — ${entry.fileName} (${entry.fileLabel})`)
  console.log(`   ${entry.summary}`)
  console.log('')
  
  // Stats summary
  if (entry.stats) {
    const relevantStats = []
    if (entry.stats.componentsAdded > 0) relevantStats.push(`+${entry.stats.componentsAdded} nuevos`)
    if (entry.stats.componentsRemoved > 0) relevantStats.push(`-${entry.stats.componentsRemoved} eliminados`)
    if (entry.stats.variantsAdded > 0) relevantStats.push(`+${entry.stats.variantsAdded} variantes`)
    if (entry.stats.variantsRemoved > 0) relevantStats.push(`-${entry.stats.variantsRemoved} variantes`)
    if (entry.stats.bindingsChanged > 0) relevantStats.push(`${entry.stats.bindingsChanged} tokens cambiados`)
    if (entry.stats.bindingsAdded > 0) relevantStats.push(`+${entry.stats.bindingsAdded} tokens nuevos`)
    if (entry.stats.bindingsRemoved > 0) relevantStats.push(`-${entry.stats.bindingsRemoved} tokens eliminados`)
    if (entry.stats.propertiesChanged > 0) relevantStats.push(`${entry.stats.propertiesChanged} props cambiadas`)
    
    if (relevantStats.length > 0) {
      console.log(`   📊 Stats: ${relevantStats.join(' | ')}`)
      console.log('')
    }
  }
  
  // Components added/removed
  const added = entry.changes.filter(c => c.type === 'component_added')
  const removed = entry.changes.filter(c => c.type === 'component_removed')
  const iterated = entry.changes.filter(c => c.type === 'binding_changed')
  
  if (added.length > 0) {
    console.log(`   ✨ Componentes nuevos (${added.length}):`)
    for (const comp of added.slice(0, 5)) {
      console.log(`      + ${comp.component}`)
    }
    if (added.length > 5) {
      console.log(`      ... y ${added.length - 5} más`)
    }
    console.log('')
  }
  
  if (removed.length > 0) {
    console.log(`   🗑  Componentes eliminados (${removed.length}):`)
    for (const comp of removed.slice(0, 5)) {
      console.log(`      - ${comp.component}`)
    }
    if (removed.length > 5) {
      console.log(`      ... y ${removed.length - 5} más`)
    }
    console.log('')
  }
  
  if (iterated.length > 0) {
    console.log(`   🔄 Componentes con cambios (${iterated.length}):`)
    for (const comp of iterated.slice(0, 10)) {
      console.log(`      • ${comp.component}`)
      
      // Si hay información detallada, mostrarla
      if (entry.detailed && entry.detailed[comp.component]) {
        const detail = entry.detailed[comp.component]
        const summary = detail.summary
        
        if (summary) {
          const changes = []
          if (summary.tokensChanged > 0) changes.push(`${summary.tokensChanged} tokens ≠`)
          if (summary.tokensAdded > 0) changes.push(`+${summary.tokensAdded} tokens`)
          if (summary.tokensRemoved > 0) changes.push(`-${summary.tokensRemoved} tokens`)
          if (summary.propertiesChanged > 0) changes.push(`${summary.propertiesChanged} props ≠`)
          
          if (changes.length > 0) {
            console.log(`        ${changes.join(' | ')}`)
          }
        }
        
        // Mostrar detalles de variantes
        if (detail.variants) {
          const variantCount = Object.keys(detail.variants).length
          if (variantCount > 1) {
            console.log(`        ${variantCount} variantes afectadas`)
          }
          
          // Mostrar algunos ejemplos de cambios
          for (const [variantName, variantData] of Object.entries(detail.variants)) {
            if (variantName === '_base') continue
            
            const vData = variantData as any
            const tokenChanges = vData.tokens?.changed || []
            const propChanges = vData.properties || []
            
            if (tokenChanges.length > 0 || propChanges.length > 0) {
              const variantLabel = variantName.split('=').slice(1).join(', ')
              console.log(`        › ${variantLabel}`)
              
              // Mostrar primeros cambios de tokens
              for (const tc of tokenChanges.slice(0, 2)) {
                console.log(`          ${tc.property}: ${tc.from} → ${tc.to}`)
              }
              
              // Mostrar primeros cambios de propiedades
              for (const pc of propChanges.slice(0, 2)) {
                console.log(`          ${pc.property}: ${pc.from} → ${pc.to}`)
              }
              
              if (tokenChanges.length + propChanges.length > 4) {
                console.log(`          ... y ${tokenChanges.length + propChanges.length - 4} cambios más`)
              }
            }
          }
        }
      }
    }
    if (iterated.length > 10) {
      console.log(`      ... y ${iterated.length - 10} más`)
    }
    console.log('')
  }
  
  console.log('─'.repeat(70))
  console.log('')
}

if (shown === 0) {
  console.log('No se encontraron entradas para mostrar.')
  if (filter) {
    console.log(`Filtro aplicado: ${filter}`)
    console.log('Librerías disponibles:', [...new Set(changelog.map(e => e.fileLabel))].join(', '))
  }
}
