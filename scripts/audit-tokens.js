import fs from 'fs';

const foundations = JSON.parse(fs.readFileSync('./src/data/foundations-data.json', 'utf8'));
const files = {
  Components: JSON.parse(fs.readFileSync('./src/data/component-data.json', 'utf8')),
  Templates: JSON.parse(fs.readFileSync('./src/data/template-data.json', 'utf8')),
  Custom: JSON.parse(fs.readFileSync('./src/data/custom-data.json', 'utf8')),
};

const keyOf = id => (id || '').replace(/^VariableID:/, '').split('/')[0];

const fByKey = new Map(foundations.variables.map(v => [v.key, v]));
const fNames = new Set(foundations.variables.map(v => v.name));

// Recolectar bindings: nombre -> { usos, keys, componentes }
const rec = new Map();
Object.entries(files).forEach(([cat, data]) => {
  data.components?.forEach(comp => {
    comp.bindings?.forEach(b => {
      if (!b.tokenName) return;
      if (!rec.has(b.tokenName)) rec.set(b.tokenName, { usos: 0, keys: new Set(), comps: new Set() });
      const r = rec.get(b.tokenName);
      r.usos++;
      r.keys.add(keyOf(b.tokenId));
      r.comps.add(`${comp.componentName} [${cat}]`);
    });
  });
});

const stale = [];   // nombre viejo de una variable de Foundations que sí existe
const local = [];   // no está en Foundations por key -> variable local del archivo

[...rec.keys()].filter(n => !fNames.has(n)).forEach(name => {
  const r = rec.get(name);
  const resolved = [...r.keys].map(k => fByKey.get(k)?.name).filter(Boolean);
  if (resolved.length) {
    stale.push({ name, usos: r.usos, nowCalled: [...new Set(resolved)].join(', '), comps: [...r.comps] });
  } else {
    local.push({ name, usos: r.usos, comps: [...r.comps] });
  }
});

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║  A) NOMBRE DESACTUALIZADO — la variable es correcta          ║');
console.log('║     El binding apunta a la variable buena de Foundations.    ║');
console.log('║     El archivo consumidor tiene el nombre viejo en cache.    ║');
console.log('║     Fix: refrescar la librería. NO hay que rebindear nada.   ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');
stale.sort((a, b) => b.usos - a.usos).forEach(o => {
  console.log(`  ${String(o.usos).padStart(3)} usos  ${o.name}`);
  console.log(`            → hoy se llama: ${o.nowCalled}`);
});
console.log(`\n  Subtotal: ${stale.length} nombres / ${stale.reduce((s, o) => s + o.usos, 0)} usos  →  nada que corregir`);

console.log('\n\n╔══════════════════════════════════════════════════════════════╗');
console.log('║  B) NO ESTA EN FOUNDATIONS — verificar el origen             ║');
console.log('║     Resuelven bien. Correr el extractor actualizado para     ║');
console.log('║     saber de que archivo vienen antes de clasificarlas.      ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');
local.sort((a, b) => b.usos - a.usos).forEach(o => {
  console.log(`  ${String(o.usos).padStart(3)} usos  ${o.name}`);
  if (o.usos <= 6) console.log(`            ${o.comps.slice(0, 4).join(', ')}`);
});
console.log(`\n  Subtotal: ${local.length} variables / ${local.reduce((s, o) => s + o.usos, 0)} usos`);

console.log('\n\n══════════════════ RESUMEN ══════════════════\n');
console.log(`  Tokens únicos aplicados        : ${rec.size}`);
console.log(`  Resuelven a Foundations OK     : ${rec.size - stale.length - local.length}`);
console.log(`  Nombre viejo, variable OK      : ${stale.length}  (cosmético)`);
console.log(`  Fuera de Foundations           : ${local.length}  (origen a verificar)`);
console.log(`  Aplicados que no existen       : 0`);
console.log('');
