/**
 * Analiza dónde se aplica cada token semántico para poder inferir su uso real.
 * Cruza los bindings de Components, Templates y Custom contra Foundations.
 *
 * Uso: node scripts/analyze-token-usage.js [filtro]
 */
import fs from 'fs';

const files = {
  Components: JSON.parse(fs.readFileSync('./src/data/component-data.json', 'utf8')),
  Templates: JSON.parse(fs.readFileSync('./src/data/template-data.json', 'utf8')),
  Custom: JSON.parse(fs.readFileSync('./src/data/custom-data.json', 'utf8')),
};

const filtro = process.argv[2] || '';

// Recolectar todos los bindings
const usage = new Map(); // tokenName -> { usos, comps:Map, props:Map, layers:Map }

Object.entries(files).forEach(([cat, data]) => {
  data.components?.forEach(comp => {
    comp.bindings?.forEach(b => {
      if (!b.tokenName) return;
      if (!usage.has(b.tokenName)) {
        usage.set(b.tokenName, { usos: 0, comps: new Map(), props: new Map(), layers: new Map() });
      }
      const u = usage.get(b.tokenName);
      u.usos++;
      const compKey = `${comp.componentName}${cat === 'Components' ? '' : ` [${cat}]`}`;
      u.comps.set(compKey, (u.comps.get(compKey) || 0) + 1);
      u.props.set(b.property, (u.props.get(b.property) || 0) + 1);
      if (b.layerName) u.layers.set(b.layerName, (u.layers.get(b.layerName) || 0) + 1);
    });
  });
});

// Los componentes públicos son los que importan para inferir uso
const esPublico = n => !n.startsWith('.') && !n.startsWith('⛔');

const rows = [...usage.entries()]
  .filter(([name]) => !filtro || name.includes(filtro))
  .map(([name, u]) => {
    const publicos = [...u.comps.entries()].filter(([c]) => esPublico(c));
    return {
      name,
      usos: u.usos,
      nComps: u.comps.size,
      nPublicos: publicos.length,
      topComps: publicos.sort((a, b) => b[1] - a[1]).slice(0, 6).map(([c, n]) => `${c} (${n})`),
      props: [...u.props.entries()].sort((a, b) => b[1] - a[1]).map(([p, n]) => `${p}:${n}`),
      topLayers: [...u.layers.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([l]) => l),
    };
  })
  .sort((a, b) => b.usos - a.usos);

console.log(`\n${rows.length} tokens${filtro ? ` que contienen "${filtro}"` : ''}\n`);

rows.forEach(r => {
  console.log(`${'─'.repeat(76)}`);
  console.log(`${r.name}`);
  console.log(`   ${r.usos} usos · ${r.nComps} componentes (${r.nPublicos} públicos)`);
  console.log(`   propiedades: ${r.props.slice(0, 6).join(', ')}`);
  if (r.topComps.length) console.log(`   componentes: ${r.topComps.join(', ')}`);
  if (r.topLayers.length) console.log(`   capas típicas: ${r.topLayers.map(l => `"${l}"`).join(', ')}`);
});

console.log(`\n${'─'.repeat(76)}`);
console.log(`Total: ${rows.reduce((s, r) => s + r.usos, 0)} usos en ${rows.length} tokens\n`);
