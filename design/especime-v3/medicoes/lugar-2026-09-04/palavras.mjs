/* Contagem exploratória: palavras do vocabulário fechado no texto da CASA
   (fora de toda a origem declarada) em dist/. */
import fs from 'node:fs';
import path from 'node:path';
import { parse, NodeType } from 'node-html-parser';

const DIST = process.argv[2];
const ORIGEM =
  '[data-claim],[data-linha-claim],[data-correcao-claim],[data-verbatim],[data-nonledger],' +
  '[data-agenda],[data-registo],[data-registo-unidade],[data-registo-linha],[data-registo-conta],' +
  '[data-lugar],[data-nome],[data-medida-nome],[data-medida-unidade]';
function* html(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* html(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}
function casa(root) {
  const corpo = root.querySelector('body');
  if (!corpo) return '';
  const marcados = new Set();
  for (const el of root.querySelectorAll(ORIGEM)) {
    marcados.add(el);
    for (const d of el.querySelectorAll('*')) marcados.add(d);
  }
  const partes = [];
  const anda = (n) => {
    if (!n) return;
    if (n.nodeType === NodeType.TEXT_NODE) return void partes.push(n.rawText);
    const tag = String(n.rawTagName ?? '').toLowerCase();
    if (tag === 'script' || tag === 'style') return;
    if (marcados.has(n)) return;
    for (const f of n.childNodes ?? []) anda(f);
  };
  anda(corpo);
  return partes.join(' ').replace(/\s+/g, ' ');
}
const PALAVRAS = [
  'município', 'Município', 'municípios', 'Municípios',
  'indicador', 'Indicador', 'indicadores', 'Indicadores',
  'peça', 'peças', 'trabalho', 'Trabalho', 'trabalhos', 'Trabalhos',
  'Relance', 'Leitura breve', 'painel', 'Painel', 'painéis', 'Painéis',
];
const conta = new Map(PALAVRAS.map((p) => [p, { n: 0, rotas: new Map() }]));
let paginas = 0;
for (const f of html(DIST)) {
  paginas++;
  const cru = fs.readFileSync(f, 'utf8');
  const rapido = PALAVRAS.filter((p) => cru.includes(p));
  if (!rapido.length) continue;
  const txt = casa(parse(cru));
  const rel = path.relative(DIST, f);
  for (const p of rapido) {
    let i = 0, n = 0;
    while ((i = txt.indexOf(p, i)) >= 0) { n++; i += p.length; }
    if (!n) continue;
    const c = conta.get(p);
    c.n += n;
    c.rotas.set(rel, n);
  }
}
console.log(`${paginas} páginas`);
for (const [p, c] of conta) {
  if (!c.n) { console.log(`  ${p.padEnd(16)} 0`); continue; }
  const amostra = [...c.rotas.entries()].slice(0, 6).map(([r, n]) => `${r} (${n})`);
  console.log(`  ${p.padEnd(16)} ${String(c.n).padStart(7)} em ${c.rotas.size} páginas · ${amostra.join(' · ')}`);
}
