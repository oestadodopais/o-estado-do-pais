/* Onde é que cada palavra proibida se rende, com o contexto. Uma página por rota. */
import fs from 'node:fs';
import path from 'node:path';
import { parse, NodeType } from 'node-html-parser';
import { matchPath } from '../../../../src/lib/routes.mjs';

const DIST = process.argv[2];
const ORIGEM =
  '[data-claim],[data-linha-claim],[data-correcao-claim],[data-verbatim],[data-nonledger],' +
  '[data-agenda],[data-registo],[data-registo-unidade],[data-registo-linha],[data-registo-conta],' +
  '[data-lugar],[data-nome],[data-medida-nome],[data-medida-unidade]';
const FORA = new Set(['documento', 'texto']);
function* html(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* html(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}
const rotaDe = (rel) => {
  let p = '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '');
  if (p === '/') return { key: 'home' };
  return matchPath(p) ?? null;
};
function casa(root) {
  const corpo = root.querySelector('body');
  if (!corpo) return [];
  const marcados = new Set();
  for (const el of root.querySelectorAll(ORIGEM)) {
    marcados.add(el);
    for (const d of el.querySelectorAll('*')) marcados.add(d);
  }
  const out = [];
  const anda = (n) => {
    if (!n) return;
    if (n.nodeType === NodeType.TEXT_NODE) {
      const t = n.rawText.replace(/\s+/g, ' ').trim();
      if (t) out.push(t);
      return;
    }
    const tag = String(n.rawTagName ?? '').toLowerCase();
    if (tag === 'script' || tag === 'style') return;
    if (marcados.has(n)) return;
    for (const f of n.childNodes ?? []) anda(f);
  };
  anda(corpo);
  return out;
}
const RE = /munic[íi]pi|indicador|peças?\b|trabalhos?\b|Relance|Leitura breve|pain[eé]/i;
const porRota = new Map();
for (const f of html(DIST)) {
  const cru = fs.readFileSync(f, 'utf8');
  if (!RE.test(cru)) continue;
  const rel = path.relative(DIST, f);
  const r = rotaDe(rel);
  const key = r ? `${r.key} [${rel.startsWith("en/") ? "en" : "pt"}]` : `(fora da tabela) ${rel}`;
  if (r && FORA.has(r.key)) continue;
  if (porRota.has(key)) continue;
  const frag = casa(parse(cru)).filter((t) => RE.test(t));
  porRota.set(key, { rel, frag: [...new Set(frag)] });
}
for (const [k, v] of [...porRota].sort()) {
  console.log(`\n### ${k}  (${v.rel})`);
  for (const t of v.frag) console.log(`  · ${t.slice(0, 160)}`);
}
