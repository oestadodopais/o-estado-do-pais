#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * A COMPOSIÇÃO DA L1, POR PADRÃO (F1.10, segunda passagem, 09.09.2026)
 * ---------------------------------------------------------------------------
 *
 * A leitura a frio de 09.09.2026 abriu o Blocking 3: a L1 diz «nenhum ecrã com
 * duas ligações para o mesmo destino», o relatório registou 6 580 páginas com
 * dois destinos iguais e a régua fechou 6 580 como teto. A emenda de 09.09 ao
 * §5 do brief manda medir a COMPOSIÇÃO antes de tocar em qualquer padrão, para
 * que o que se corrige seja o maior e não o mais fácil.
 *
 * O QUE ELE FAZ. Lê o mesmo `dist/` que `scripts/check-lugar.mjs`, com o mesmo
 * corte (fora do `<header>` e do `<footer>`, o fragmento fora da chave), e
 * agrupa cada par repetido por FAMÍLIA DE PÁGINA (a rota) e por PAR DE PORTAS
 * (a cadeia de três níveis de cada âncora: a etiqueta, a primeira classe e a
 * primeira marca `data-`). Não conta melhor do que a régua: conta a MESMA coisa
 * e diz onde ela está.
 *
 *   node design/especime-v3/medicoes/lugar-2026-09-04/l1-composicao.mjs dist
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { matchPath } from '../../../../src/lib/routes.mjs';

const DIST = process.argv[2];
function paginasDe(dir) {
  const fora = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) fora.push(...paginasDe(p));
    else if (e.name.endsWith('.html')) fora.push(p);
  }
  return fora;
}
const cadeiaDe = (el) => {
  const partes = [];
  let n = el;
  while (n && n.tagName) {
    const cls = (n.getAttribute?.('class') ?? '').trim().split(/\s+/).filter(Boolean);
    const dados = Object.keys(n.attributes ?? {}).filter((a) => a.startsWith('data-'));
    partes.push(`${n.tagName.toLowerCase()}${cls.length ? '.' + cls[0] : ''}${dados.length ? '[' + dados[0] + ']' : ''}`);
    n = n.parentNode;
    if (partes.length >= 3) break;
  }
  return partes.join('<');
};
const porFamilia = new Map();
const porPar = new Map();
let paginasComRepetido = 0;
for (const f of paginasDe(DIST)) {
  const rel = path.relative(DIST, f).replace(/index\.html$/, '').replace(/\/$/, '');
  const url = '/' + rel;
  const raiz = parse(fs.readFileSync(f, 'utf8'));
  const corpo = raiz.querySelector('body');
  if (!corpo) continue;
  const mob = new Set();
  for (const m of [raiz.querySelector('header'), raiz.querySelector('footer')]) {
    if (!m) continue;
    mob.add(m);
    for (const d of m.querySelectorAll('*')) mob.add(d);
  }
  const porDestino = new Map();
  for (const a of corpo.querySelectorAll('a[href]')) {
    if (mob.has(a)) continue;
    const href = a.getAttribute('href') ?? '';
    if (!href || href.startsWith('#') || href.startsWith('mailto:')) continue;
    const chave = href.split('#')[0];
    if (!chave) continue;
    if (!porDestino.has(chave)) porDestino.set(chave, []);
    porDestino.get(chave).push(a);
  }
  const reps = [...porDestino.entries()].filter(([, v]) => v.length > 1);
  if (!reps.length) continue;
  paginasComRepetido++;
  const m = matchPath(url === '/' ? '/' : url);
  const familia = m?.key ?? (url.startsWith('/en') ? 'en:?' : '?');
  porFamilia.set(familia, (porFamilia.get(familia) ?? 0) + 1);
  for (const [, els] of reps) {
    const chaves = els.map(cadeiaDe).sort();
    const par = `${familia} :: ${[...new Set(chaves)].join('  ||  ')}`;
    porPar.set(par, (porPar.get(par) ?? 0) + 1);
  }
}
console.log(`páginas com dois destinos iguais: ${paginasComRepetido}`);
console.log('\npor família de página:');
for (const [k, v] of [...porFamilia.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(6)}  ${k}`);
console.log('\npor par de portas (top 30, contando pares repetidos):');
for (const [k, v] of [...porPar.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30)) console.log(`  ${String(v).padStart(6)}  ${k}`);
