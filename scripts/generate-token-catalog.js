/**
 * Genera docs/tokens/catalogo.md: todas las variables semánticas de Foundations
 * con su primitivo y su valor final resuelto.
 *
 * Uso: node scripts/generate-token-catalog.js
 */
import fs from 'fs';

const fnd = JSON.parse(fs.readFileSync('./src/data/foundations-data.json', 'utf8'));

const byId = new Map(fnd.variables.map(v => [v.id, v]));
const modeOf = v => Object.keys(v.valuesByMode)[0];

/** El export trae los colores ya como hex string, pero algunos modos pueden venir como {r,g,b,a}. */
const toHex = c => {
  if (typeof c === 'string') return c.toUpperCase();
  if (!c || typeof c !== 'object' || !('r' in c)) return null;
  const h = n => Math.round(n * 255).toString(16).padStart(2, '0');
  const base = `#${h(c.r)}${h(c.g)}${h(c.b)}`.toUpperCase();
  return c.a !== undefined && c.a < 1 ? `${base} · ${Math.round(c.a * 100)}%` : base;
};

/** Sigue la cadena de alias hasta el valor crudo. Devuelve { valor, primitivo, cadena }. */
function resolve(v, depth = 0) {
  const raw = v.valuesByMode[modeOf(v)];
  if (depth > 6 || raw == null) return { valor: null, primitivo: null, cadena: [] };

  if (raw.type === 'alias' || raw.alias) {
    const target = byId.get(raw.alias?.id || raw.value);
    if (!target) return { valor: null, primitivo: raw.alias?.name || null, cadena: [] };
    const sub = resolve(target, depth + 1);
    return {
      valor: sub.valor,
      primitivo: raw.alias?.name || target.name,
      cadena: [target.name, ...sub.cadena],
    };
  }

  const val = typeof raw === 'object' && 'value' in raw ? raw.value : raw;
  if (v.resolvedType === 'COLOR') return { valor: toHex(val), primitivo: null, cadena: [] };
  return { valor: val, primitivo: null, cadena: [] };
}

const SEMANTICAS = ['Color', 'Typography', 'Spacing', 'Border', 'Asset', 'Screen size', 'Density mode'];
const conteo = new Map(fnd.collections.map(c => [c.name, c.variableCount]));

const vars = fnd.variables.filter(v => SEMANTICAS.includes(v.collection));
const out = [];

out.push('# Catálogo de tokens semánticos');
out.push('');
out.push(`> Todas las variables de las colecciones semánticas de Foundations, con su primitivo y valor final resuelto.`);
out.push('>');
out.push(`> Extracción del 3-ago-2026 · ${vars.length} variables en ${SEMANTICAS.length} colecciones`);
out.push('');
out.push('Guía de uso en **[semanticos.md](./semanticos.md)** · estado del sistema en **[auditoria-tokens.md](./auditoria-tokens.md)**');
out.push('');
out.push('## Índice');
out.push('');
SEMANTICAS.forEach(c => {
  const n = vars.filter(v => v.collection === c).length;
  out.push(`- [${c}](#${c.toLowerCase().replace(/ /g, '-')}) — ${n} variables`);
});
out.push('');
out.push('---');
out.push('');

// ---------- Color: agrupado por prefijo ----------
const colores = vars.filter(v => v.collection === 'Color');
out.push(`## Color`);
out.push('');
out.push(`${colores.length} variables. El valor es el hex final tras resolver la cadena de alias.`);
out.push('');

const grupoDe = n => {
  const p = n.split('/');
  if (p[0] === 'expressive') return p[1] === 'illustration' ? 'expressive/illustration' : 'expressive';
  return `${p[0]}/${p[1]}`;
};
const grupos = [...new Set(colores.map(v => grupoDe(v.name)))].sort((a, b) => {
  const ord = n => (n.startsWith('static') ? 0 : n.startsWith('interactive') ? 1 : 2);
  return ord(a) - ord(b) || a.localeCompare(b);
});

grupos.forEach(g => {
  const rows = colores.filter(v => grupoDe(v.name) === g).sort((a, b) => a.name.localeCompare(b.name));
  out.push(`### ${g} (${rows.length})`);
  out.push('');
  out.push('| Token | Primitivo | Valor |');
  out.push('|---|---|---|');
  rows.forEach(v => {
    const r = resolve(v);
    out.push(`| \`${v.name}\` | ${r.primitivo ? `\`${r.primitivo}\`` : '—'} | ${r.valor || '—'} |`);
  });
  out.push('');
});
out.push('---');
out.push('');

// ---------- Typography: una fila por estilo ----------
const tipo = vars.filter(v => v.collection === 'Typography');
const estilos = new Map();
tipo.forEach(v => {
  const partes = v.name.split('/');
  const prop = partes[partes.length - 1];
  const estilo = partes.slice(0, -1).join('/');
  if (!estilos.has(estilo)) estilos.set(estilo, {});
  estilos.get(estilo)[prop] = resolve(v);
});

out.push(`## Typography`);
out.push('');
out.push(`${tipo.length} variables agrupadas en ${estilos.size} estilos. Cada estilo define cinco propiedades: \`font-family\`, \`font-size\`, \`font-weight\`, \`line-height\` y \`letter-spacing\`.`);
out.push('');
out.push('El nombre del token es el estilo más la propiedad. Por ejemplo, la fila `body/md/semibold` corresponde a `body/md/semibold/font-size`, `body/md/semibold/font-weight` y así con las cinco.');
out.push('');

const familias = [...new Set([...estilos.keys()].map(e => e.split('/')[0]))].sort();
familias.forEach(fam => {
  const items = [...estilos.entries()].filter(([e]) => e.startsWith(fam + '/')).sort();
  out.push(`### ${fam} (${items.length} estilos)`);
  out.push('');
  out.push('| Estilo | Tamaño | Peso | Line height | Letter spacing | Familia |');
  out.push('|---|---|---|---|---|---|');
  items.forEach(([estilo, props]) => {
    const val = (p, unidad = '') => {
      const r = props[p];
      if (!r || r.valor === null || r.valor === undefined) return '—';
      return `${r.valor}${unidad}`;
    };
    out.push(`| \`${estilo}\` | ${val('font-size', 'px')} | ${val('font-weight')} | ${val('line-height', 'px')} | ${val('letter-spacing')} | ${val('font-family')} |`);
  });
  out.push('');
});
out.push('---');
out.push('');

// ---------- Resto: tabla simple ----------
['Spacing', 'Border', 'Asset', 'Screen size', 'Density mode'].forEach(col => {
  const rows = vars.filter(v => v.collection === col).sort((a, b) => {
    const num = s => { const m = s.match(/(\d+)/); return m ? parseInt(m[1]) : -1; };
    return a.name.split('/').slice(0, -1).join('/').localeCompare(b.name.split('/').slice(0, -1).join('/'))
      || num(a.name) - num(b.name)
      || a.name.localeCompare(b.name);
  });
  if (!rows.length) return;
  out.push(`## ${col}`);
  out.push('');
  out.push(`${rows.length} variables.`);
  out.push('');
  out.push('| Token | Primitivo | Valor |');
  out.push('|---|---|---|');
  rows.forEach(v => {
    const r = resolve(v);
    const unidad = v.resolvedType === 'FLOAT' && r.valor !== null ? `${r.valor}px` : (r.valor ?? '—');
    out.push(`| \`${v.name}\` | ${r.primitivo ? `\`${r.primitivo}\`` : '—'} | ${unidad} |`);
  });
  out.push('');
  out.push('---');
  out.push('');
});

fs.writeFileSync('./docs/tokens/catalogo.md', out.join('\n'));
console.log(`✅ docs/tokens/catalogo.md — ${vars.length} variables`);
SEMANTICAS.forEach(c => {
  const n = vars.filter(v => v.collection === c).length;
  const decl = conteo.get(c);
  console.log(`   ${c.padEnd(14)} ${String(n).padStart(3)}${decl !== n ? `  (colección declara ${decl})` : ''}`);
});
