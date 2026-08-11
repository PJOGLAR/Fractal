const fs = require('fs');
const path = require('path');

const TOKEN_NAME = 'interactive/foreground/neutral/default/strong';

function findComponentsUsingToken(filePath, fileType) {
  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(rawData);
    
    const components = new Set();
    
    if (data.components && Array.isArray(data.components)) {
      data.components.forEach(component => {
        if (component.bindings && Array.isArray(component.bindings)) {
          const usesToken = component.bindings.some(binding => 
            binding.tokenName === TOKEN_NAME
          );
          
          if (usesToken) {
            components.add(component.name);
          }
        }
      });
    }
    
    return Array.from(components).sort();
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return [];
  }
}

// Analyze all component data files
const dataDir = path.join(__dirname, '../src/data');
const files = [
  { path: path.join(dataDir, 'component-data.json'), type: 'Components' },
  { path: path.join(dataDir, 'template-data.json'), type: 'Templates' },
  { path: path.join(dataDir, 'custom-data.json'), type: 'Custom Components' }
];

console.log(`\n🔍 Componentes que usan el token: "${TOKEN_NAME}"\n`);
console.log('='.repeat(80));

let totalComponents = 0;

files.forEach(({ path: filePath, type }) => {
  if (fs.existsSync(filePath)) {
    const components = findComponentsUsingToken(filePath, type);
    
    if (components.length > 0) {
      console.log(`\n📦 ${type} (${components.length} componentes):`);
      console.log('-'.repeat(80));
      components.forEach(comp => {
        console.log(`  • ${comp}`);
      });
      totalComponents += components.length;
    } else {
      console.log(`\n📦 ${type}: No se encontraron componentes con este token`);
    }
  } else {
    console.log(`\n⚠️  ${type}: Archivo no encontrado`);
  }
});

console.log('\n' + '='.repeat(80));
console.log(`\n✅ Total: ${totalComponents} componentes usando este token\n`);
