/**
 * Auditoría real de tokens huérfanos
 * Cruza foundations-data.json (fuente de verdad) con component-data.json (bindings)
 * 
 * Uso: node scripts/audit-real-orphans.js
 */
import fs from 'fs';

const foundationsData = JSON.parse(fs.readFileSync('./src/data/foundations-data.json', 'utf8'));
const componentData = JSON.parse(fs.readFileSync('./src/data/component-data.json', 'utf8'));

console.log('🔍 Auditando orphan tokens reales...\n');

// Extraer todos los nombres de tokens usados en bindings
const usedTokenNames = new Set();
let totalBindings = 0;

componentData.components.forEach(component => {
  component.bindings.forEach(binding => {
    if (binding.tokenName) {
      usedTokenNames.add(binding.tokenName);
      totalBindings++;
    }
  });
});

console.log(`📊 Estadísticas de uso:`);
console.log(`   Bindings totales: ${totalBindings}`);
console.log(`   Tokens únicos usados: ${usedTokenNames.size}`);

// Tokens de Foundations (fuente de verdad)
const allTokens = foundationsData.variables || [];
console.log(`   Tokens en Foundations: ${allTokens.length}`);

// Separar por colección y buscar huérfanos
const orphansByCollection = {};
const usedByCollection = {};
let totalOrphans = 0;

allTokens.forEach(token => {
  const collection = token.collection || 'Sin colección';
  
  if (!orphansByCollection[collection]) orphansByCollection[collection] = [];
  if (!usedByCollection[collection]) usedByCollection[collection] = [];

  if (usedTokenNames.has(token.name)) {
    usedByCollection[collection].push(token);
  } else {
    orphansByCollection[collection].push(token);
    totalOrphans++;
  }
});

console.log(`\n❌ Tokens huérfanos: ${totalOrphans} de ${allTokens.length} (${(totalOrphans/allTokens.length*100).toFixed(1)}%)`);

// Reporte por colección
Object.keys(orphansByCollection).sort().forEach(collection => {
  const orphans = orphansByCollection[collection];
  const used = usedByCollection[collection] || [];
  const total = orphans.length + used.length;
  
  if (total === 0) return;
  
  console.log(`\n📁 ${collection}:`);
  console.log(`   Total: ${total} | Usados: ${used.length} | Huérfanos: ${orphans.length}`);
  
  if (orphans.length > 0) {
    console.log(`   💀 Huérfanos:`);
    orphans.slice(0, 5).forEach(token => {
      console.log(`      - ${token.name} (${token.resolvedType || token.type})`);
    });
    if (orphans.length > 5) {
      console.log(`      ... y ${orphans.length - 5} más`);
    }
  }
});

// Casos específicos a investigar
console.log(`\n🔍 Investigación específica:`);

// Tokens que suenan como deberían estar en uso
const suspiciousOrphans = allTokens.filter(token => 
  !usedTokenNames.has(token.name) && 
  (token.name.includes('/primary/') || 
   token.name.includes('/medium') || 
   token.name.includes('padding-') ||
   token.name.includes('gap-'))
);

if (suspiciousOrphans.length > 0) {
  console.log(`❓ Tokens que parecen importantes pero no están en uso: ${suspiciousOrphans.length}`);
  suspiciousOrphans.slice(0, 10).forEach(token => {
    console.log(`   - ${token.name} (${token.collection})`);
  });
}

// Verificar si hay tokens con nombres similares en uso
const potentialNameMismatches = [];
[...usedTokenNames].forEach(usedName => {
  const foundInFoundations = allTokens.find(t => t.name === usedName);
  if (!foundInFoundations) {
    potentialNameMismatches.push(usedName);
  }
});

if (potentialNameMismatches.length > 0) {
  console.log(`\n⚠️ Tokens usados en bindings pero no encontrados en Foundations: ${potentialNameMismatches.length}`);
  potentialNameMismatches.slice(0, 10).forEach(name => {
    console.log(`   - ${name}`);
  });
}

// Generar JSON de output para el dashboard
const orphansOutput = {
  totalTokens: allTokens.length,
  usedTokens: usedTokenNames.size,
  orphanTokens: totalOrphans,
  orphansByCollection: Object.keys(orphansByCollection).map(collection => ({
    collection,
    totalTokens: (orphansByCollection[collection] || []).length + (usedByCollection[collection] || []).length,
    usedTokens: (usedByCollection[collection] || []).length,
    orphanTokens: (orphansByCollection[collection] || []).length,
    orphans: orphansByCollection[collection].map(token => ({
      id: token.id,
      name: token.name,
      type: token.resolvedType || token.type,
      collection: token.collection
    }))
  })),
  auditedAt: new Date().toISOString()
};

fs.writeFileSync('./src/data/real-orphan-audit.json', JSON.stringify(orphansOutput, null, 2));
console.log(`\n💾 Reporte completo guardado en src/data/real-orphan-audit.json`);