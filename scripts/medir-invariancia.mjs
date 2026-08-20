#!/usr/bin/env node
/**
 * A RÉGUA DA INVARIÂNCIA — o que mudou, rota a rota, entre duas construções.
 *
 * ---------------------------------------------------------------------------
 * É UM CONSELHEIRO, E NUNCA UM PORTÃO (resposta 1 da direcção, 20.08.2026)
 * ---------------------------------------------------------------------------
 * Imprime e não falha. Sai sempre com código 0, não entra no `npm run build`, e
 * o que ele diz é para ser LIDO, não obedecido: uma etapa que muda a primeira
 * página tem de fazer esta régua imprimir diferenças na primeira página, e o que
 * a leitura tem de confirmar é que não imprime nas outras.
 *
 * A alternativa — fazer disto um portão — foi recusada pela direcção com a razão
 * escrita: uma comparação de texto entre duas construções transforma qualquer
 * mudança editorial num erro de construção, e o sítio deixaria de poder mudar de
 * palavras sem mudar de portão.
 *
 *   node scripts/medir-invariancia.mjs <distA> <distB>
 *   node scripts/medir-invariancia.mjs <distA> <distB> --json <ficheiro>
 *   node scripts/medir-invariancia.mjs --chaves
 *
 * `--chaves` não compara construções: lê `src/i18n/strings.mjs` e imprime todas
 * as chaves cujo português e inglês são a MESMA cadeia. `assertKeyParity()`
 * compara caminhos de chaves e não valores, e por isso deixa passar português
 * copiado para inglês (ISSUES I9); esta lista é o que ela não vê. As
 * identidades aceites estão em `design/especime-v3/CHAVES-EN.md` e são nomes
 * próprios, códigos e siglas.
 *
 * A COMPARAÇÃO É DE BLOCOS DE TEXTO, com a mesma disciplina de
 * `medir-defeitos.mjs`: `script` e `style` fora, espaço em branco normalizado,
 * um bloco por elemento que não contenha outro elemento de bloco. Não compara
 * marcação: uma `<div>` que passa a `<section>` não é uma diferença de conteúdo,
 * e é conteúdo que esta régua mede.
 */

import fs from 'node:fs';
import path from 'node:path';
import { parse, NodeType } from 'node-html-parser';

import { STRINGS } from '../src/i18n/strings.mjs';

const cinza = (s) => `\x1b[90m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const amarelo = (s) => `\x1b[33m${s}\x1b[0m`;

const argv = process.argv.slice(2);
const opcao = (nome) => {
  const i = argv.indexOf(nome);
  return i >= 0 ? (argv[i + 1] ?? true) : null;
};
const FICHEIRO_JSON = opcao('--json');
const posicionais = argv.filter((a, i) => !a.startsWith('--') && !String(argv[i - 1] ?? '').startsWith('--'));

/* ----------------------------------------------------------------- as chaves */

function chavesIguais() {
  const iguais = [];
  const anda = (pt, en, caminho) => {
    for (const [k, v] of Object.entries(pt)) {
      const aqui = caminho ? `${caminho}.${k}` : k;
      const outro = en?.[k];
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        anda(v, outro ?? {}, aqui);
        continue;
      }
      const a = Array.isArray(v) ? JSON.stringify(v) : String(v);
      const b = Array.isArray(outro) ? JSON.stringify(outro) : String(outro);
      if (a === b) iguais.push({ chave: aqui, valor: a });
    }
  };
  anda(STRINGS.pt, STRINGS.en, '');
  return iguais;
}

if (argv.includes('--chaves')) {
  const iguais = chavesIguais();
  console.log('');
  console.log(cinza(`  chaves com o mesmo valor nas duas edições · ${iguais.length}`));
  console.log('');
  for (const i of iguais) {
    console.log(`  ${i.chave}`);
    console.log(cinza(`     «${i.valor.slice(0, 110)}»`));
  }
  console.log('');
  console.log(
    cinza(
      '  As que forem nomes próprios, códigos, siglas ou palavras que se escrevem\n' +
        '  igual nas duas línguas estão listadas em design/especime-v3/CHAVES-EN.md,\n' +
        '  em «Identidades aceites». As que não estiverem lá são erro.',
    ),
  );
  console.log('');
  process.exit(0);
}

/* ------------------------------------------------------- as duas construções */

const [DIR_A, DIR_B] = posicionais;
if (!DIR_A || !DIR_B) {
  console.error('uso: node scripts/medir-invariancia.mjs <distA> <distB> [--json <ficheiro>]');
  console.error('     node scripts/medir-invariancia.mjs --chaves');
  process.exit(2);
}
for (const d of [DIR_A, DIR_B]) {
  if (!fs.existsSync(d)) {
    console.error(`não existe "${d}".`);
    process.exit(2);
  }
}

const BLOCOS = 'p,li,dd,dt,h1,h2,h3,h4,figcaption,summary,blockquote,td,th,caption,div,span,a,button,label';
const norm = (s) => String(s).replace(/\s+/g, ' ').trim();

function textoDe(no) {
  const partes = [];
  const anda = (n) => {
    if (!n) return;
    if (n.nodeType === NodeType.TEXT_NODE) return void partes.push(n.rawText);
    const tag = String(n.rawTagName ?? '').toLowerCase();
    if (tag === 'script' || tag === 'style') return;
    for (const f of n.childNodes ?? []) anda(f);
  };
  anda(no);
  return partes.join(' ');
}

function blocosDe(html) {
  const raiz = parse(html, { comment: false, blockTextElements: { script: true, style: true } });
  const corpo = raiz.querySelector('body') ?? raiz;
  const fora = [];
  for (const el of corpo.querySelectorAll(BLOCOS)) {
    if (el.querySelector(BLOCOS)) continue;
    const t = norm(textoDe(el));
    if (t) fora.push(t);
  }
  return fora;
}

function rotas(dir) {
  const out = new Map();
  const anda = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) anda(full);
      else if (e.name.endsWith('.html')) {
        const rel = '/' + path.relative(dir, full).split(path.sep).join('/');
        out.set(rel.replace(/index\.html$/, '').replace(/\.html$/, '') || '/', full);
      }
    }
  };
  anda(dir);
  return out;
}

const A = rotas(DIR_A);
const B = rotas(DIR_B);
const todas = [...new Set([...A.keys(), ...B.keys()])].sort();

const diferencas = [];
let iguais = 0;
for (const rota of todas) {
  if (!A.has(rota)) {
    diferencas.push({ rota, estado: 'nova', acrescentados: [], retirados: [], mais: 0, menos: 0 });
    continue;
  }
  if (!B.has(rota)) {
    diferencas.push({ rota, estado: 'saiu', acrescentados: [], retirados: [], mais: 0, menos: 0 });
    continue;
  }
  const a = blocosDe(fs.readFileSync(A.get(rota), 'utf8'));
  const b = blocosDe(fs.readFileSync(B.get(rota), 'utf8'));
  const contaA = new Map();
  for (const t of a) contaA.set(t, (contaA.get(t) ?? 0) + 1);
  const contaB = new Map();
  for (const t of b) contaB.set(t, (contaB.get(t) ?? 0) + 1);
  const acrescentados = [];
  const retirados = [];
  for (const [t, n] of contaB) {
    const d = n - (contaA.get(t) ?? 0);
    for (let i = 0; i < d; i++) acrescentados.push(t);
  }
  for (const [t, n] of contaA) {
    const d = n - (contaB.get(t) ?? 0);
    for (let i = 0; i < d; i++) retirados.push(t);
  }
  if (!acrescentados.length && !retirados.length) {
    iguais++;
    continue;
  }
  diferencas.push({
    rota,
    estado: 'difere',
    mais: acrescentados.length,
    menos: retirados.length,
    acrescentados: acrescentados.slice(0, 5),
    retirados: retirados.slice(0, 5),
  });
}

if (FICHEIRO_JSON && typeof FICHEIRO_JSON === 'string') {
  fs.writeFileSync(
    FICHEIRO_JSON,
    JSON.stringify({ a: DIR_A, b: DIR_B, rotas: todas.length, iguais, diferencas }, null, 2),
  );
}

console.log('');
console.log(cinza(`  invariância · ${DIR_A}  →  ${DIR_B}`));
console.log(
  cinza(
    `  ${todas.length} rotas · ${verde(String(iguais))}${cinza(' idênticas em texto')} · ` +
      `${diferencas.length ? amarelo(String(diferencas.length)) : '0'}${cinza(' com diferenças')}`,
  ),
);
console.log('');
for (const d of diferencas) {
  if (d.estado !== 'difere') {
    console.log(`  ${d.rota}  ${amarelo(d.estado)}`);
    continue;
  }
  console.log(`  ${d.rota}  ${amarelo(`+${d.mais} −${d.menos}`)}`);
  for (const t of d.acrescentados) console.log(cinza(`    + ${t.slice(0, 110)}`));
  for (const t of d.retirados) console.log(cinza(`    − ${t.slice(0, 110)}`));
}
console.log('');
console.log(cinza('  Esta régua imprime e não falha: o que ela diz lê-se, não se obedece.'));
console.log('');
