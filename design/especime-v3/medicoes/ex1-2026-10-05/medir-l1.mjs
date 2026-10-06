#!/usr/bin/env node
/**
 * EX1 (05.10.2026): a L1 do `check:lugar` cresce só pelas duas páginas da explicação, e mede-se, não se presume.
 *
 * O QUE COMPARA. A lista inteira das páginas com destinos repetidos na construção da cabeça de partida do bloco
 * (3664b90d, medida numa worktree à parte com `AMOSTRA=100000 node scripts/check-lugar.mjs`, guardada em
 * `l1-base-3664b90d.log` com os caminhos da máquina tirados) contra a da construção desta cabeça, com a mesma régua e a
 * mesma amostra. Exige: as entradas são exatamente as páginas das explicações declaradas, nas duas edições; nenhuma
 * página sai; nenhuma página antiga muda (os destinos repetidos, o exemplo e as vezes, iguais um a um); e os destinos
 * repetidos de cada página nova são exatamente os recibos das linhas que uma figura desenha E que o texto cita com o
 * selo, duas vezes cada (o selo da frase e a porta da lista dos números da figura, que é a legenda dos selos do
 * desenho). É a mesma mobília que a primeira página e as entradas trazem desde o PP1 («a lista dos números repete a
 * porta do recibo de um número que a frase já cita»).
 *
 * ESCREVE `l1-ex1.json`, com `contagens.estudos` (o nome histórico do campo que a régua lê; conta páginas), e corre as
 * plantas: uma página a mais fora das explicações, uma página antiga agravada, uma entrada em falta, um destino
 * repetido que não é um recibo de uma linha desenhada e citada, e a contagem do registo trocada em memória, que a régua
 * do teto tem de recusar.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { EXPLICACOES } from '../../../../src/data/explicacoes/index.mjs';
import { routePath, LANGS } from '../../../../src/lib/routes.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '../../../..');
const limpa = (/** @type {string} */ s) => s.replace(/\x1b\[[0-9;]*m/g, '').replaceAll(RAIZ, '<sitio>');

/** @param {string} texto */
function lista(texto) {
  /** @type {Map<string, { destinos: number, exemplo: string, vezes: number }>} */
  const out = new Map();
  for (const l of limpa(texto).split('\n')) {
    const m = l.match(/^\s+· (\S+) · (\d+) destinos repetidos \(ex\.: (\S+) ×(\d+)\)/);
    if (m) { assert(!out.has(m[1])); out.set(m[1], { destinos: Number(m[2]), exemplo: m[3], vezes: Number(m[4]) }); }
  }
  const total = limpa(texto).match(/L1 · páginas com dois destinos iguais fora da mobília\s+(\d+)/);
  assert(total && out.size === Number(total[1]), 'A amostra tem de conter a lista inteira.');
  return out;
}

const antes = lista(fs.readFileSync(path.join(AQUI, 'l1-base-3664b90d.log'), 'utf8'));
const corrida = spawnSync(process.execPath, ['scripts/check-lugar.mjs'], { cwd: RAIZ, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, env: { ...process.env, AMOSTRA: '100000' } });
assert([0, 1].includes(corrida.status ?? -1));
const log = limpa((corrida.stdout ?? '') + (corrida.stderr ?? ''));
fs.writeFileSync(path.join(AQUI, 'l1-ex1-check-lugar.log'), log);
const depois = lista(log);
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: RAIZ, encoding: 'utf8' }).trim();
const carimbo = JSON.parse(fs.readFileSync(path.join(RAIZ, 'dist/version.json'), 'utf8'));
assert.equal(carimbo.commit, cabeca, 'A L1 mede-se na construção da cabeça que está a ser medida.');

const esperadas = new Set(EXPLICACOES.flatMap((e) => LANGS.map((lang) => routePath('explicacao', lang, { slug: e.slug }))));

/** Os destinos que uma página nova pode repetir: os recibos das linhas desenhadas numa figura e citadas no texto. @param {string} url */
function destinosEsperados(url) {
  const html = fs.readFileSync(path.join(RAIZ, 'dist', url.slice(1), 'index.html'), 'utf8');
  const root = parse(html);
  const lang = url.startsWith('/en/') ? 'en' : 'pt';
  const desenhadas = new Set(root.querySelectorAll('figure[data-forma="barras-do-livro"] li[data-barra]').map((li) => li.getAttribute('data-barra')));
  const citadas = new Set(root.querySelectorAll('[data-explicacao-paragrafo] [data-claim]').map((c) => c.getAttribute('data-claim')));
  return new Set([...desenhadas].filter((l) => citadas.has(l)).map((l) => routePath('linha', lang, { slug: String(l) })));
}
/** Os destinos repetidos de uma página, lidos do HTML pela regra da L1 (fora do cabeçalho e do rodapé). @param {string} url */
function destinosRepetidos(url) {
  const root = parse(fs.readFileSync(path.join(RAIZ, 'dist', url.slice(1), 'index.html'), 'utf8'));
  const mobilia = new Set();
  for (const el of [root.querySelector('header'), root.querySelector('footer')].filter(Boolean)) { mobilia.add(el); for (const d of /** @type {any} */ (el).querySelectorAll('*')) mobilia.add(d); }
  /** @type {Map<string, number>} */
  const por = new Map();
  for (const a of root.querySelector('body').querySelectorAll('a[href]')) {
    if (mobilia.has(a)) continue;
    const href = a.getAttribute('href') ?? '';
    if (!href || href.startsWith('#') || href.startsWith('mailto:')) continue;
    if (a.closest('[data-rotulo-ia="topo"]')) continue;
    const chave = href.split('#')[0].replace(/\/$/, '') || '/';
    por.set(chave, (por.get(chave) ?? 0) + 1);
  }
  return new Map([...por].filter(([, n]) => n > 1));
}

/** @param {Map<string, any>} a @param {Map<string, any>} d @param {(url: string) => Map<string, number>} [repetidosDe] */
function confere(a, d, repetidosDe = destinosRepetidos) {
  for (const [url, v] of a) assert.deepEqual(d.get(url), v, `Página antiga alterada ou saída: ${url}`);
  const entradas = [...d.keys()].filter((u) => !a.has(u)).sort();
  assert.deepEqual(entradas, [...esperadas].sort(), 'As entradas têm de ser exatamente as páginas das explicações.');
  for (const url of entradas) {
    const repetidos = repetidosDe(url);
    const devem = destinosEsperados(url);
    assert.equal(repetidos.size, d.get(url).destinos, `A composição diverge da régua em ${url}.`);
    assert.deepEqual([...repetidos.keys()].sort(), [...devem].sort(), `Os destinos repetidos de ${url} não são os recibos das linhas desenhadas e citadas.`);
    for (const [, n] of repetidos) assert.equal(n, 2, `Um recibo aparece mais de duas vezes em ${url}.`);
  }
  return entradas;
}

const entradas = confere(antes, depois);
/** @type {{ nome: string, mordeu: boolean }[]} */
const plantas = [];
/** @param {string} nome @param {() => void} fn */
function planta(nome, fn) { let mordeu = false; try { fn(); } catch { mordeu = true; } assert(mordeu, nome); plantas.push({ nome, mordeu }); }
planta('Uma página a mais fora das explicações é recusada', () => { const d = new Map(depois); d.set('/planta-ex1-fora-das-explicacoes', { destinos: 1, exemplo: '/', vezes: 2 }); confere(antes, d); });
planta('Uma página antiga agravada é recusada', () => { const d = new Map(depois); const u = [...antes.keys()][0]; d.set(u, { ...d.get(u), destinos: d.get(u).destinos + 1 }); confere(antes, d); });
planta('Uma página das explicações em falta é recusada', () => { const d = new Map(depois); d.delete(entradas[0]); confere(antes, d); });
planta('Um destino repetido que não é um recibo desenhado e citado é recusado', () => {
  const d = new Map(depois);
  const u = entradas[0];
  d.set(u, { ...d.get(u), destinos: d.get(u).destinos + 1 });
  confere(antes, d, (url) => { const m = destinosRepetidos(url); if (url === u) m.set('/sobre', 2); return m; });
});

const teto = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts/lugar-tetos-b1.json'), 'utf8'));
const dados = {
  o_que_e: 'EX1: a contagem L1 cresce só pelas duas páginas da primeira explicação, nas duas edições. A lista da cabeça de partida (3664b90d) fica igual página a página (destinos, exemplo e vezes), e os destinos repetidos de cada página nova são os recibos das linhas que uma figura desenha e que o texto cita com o selo, duas vezes cada. A régua não muda; muda a medição que o teto aponta.',
  data: new Date().toISOString(),
  cabeca,
  construcao: carimbo.commit,
  origem_anterior: 'design/especime-v3/medicoes/ex1-2026-10-05/l1-base-3664b90d.log',
  cabeca_anterior: '3664b90d',
  origem: 'design/especime-v3/medicoes/ex1-2026-10-05/l1-ex1-check-lugar.log',
  comando: 'AMOSTRA=100000 node scripts/check-lugar.mjs',
  codigo_da_regua: corrida.status,
  teto_lido: teto.l1_paginas,
  // «estudos» é o nome histórico do campo que check-lugar lê; conta páginas.
  contagens: { estudos: depois.size, l1_paginas: depois.size, antes: antes.size, entradas: entradas.length, saidas: 0, antigas_alteradas: 0 },
  entradas: entradas.map((url) => ({ url, ...depois.get(url), destinos_repetidos: [...destinosRepetidos(url).keys()].sort() })),
  conhecidos_positivos: plantas,
};
fs.writeFileSync(path.join(AQUI, 'l1-ex1.json'), JSON.stringify(dados, null, 2) + '\n');
/* A régua do teto recusa a contagem do registo trocada em memória, quando o teto já aponta esta medição. */
if (teto.medicao === 'design/especime-v3/medicoes/ex1-2026-10-05/l1-ex1.json') {
  assert.equal(corrida.status, 0, 'Com o teto a apontar esta medição, a régua tem de passar.');
  const codigo = `import fs from 'node:fs';
const ler = fs.readFileSync;
fs.readFileSync = function (f, ...a) {
  const corpo = ler.call(this, f, ...a);
  if (String(f).endsWith('/${teto.medicao}')) { const c = JSON.parse(String(corpo)); c.contagens.estudos += 1; return JSON.stringify(c); }
  return corpo;
};
await import('./scripts/check-lugar.mjs');`;
  const plantada = spawnSync(process.execPath, ['--input-type=module', '-e', codigo], { cwd: RAIZ, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  assert.equal(plantada.status, 1, 'A contagem trocada tem de ser recusada pela régua do teto.');
  assert(((plantada.stdout ?? '') + (plantada.stderr ?? '')).includes('B1 L1: o teto tem de ser o número inteiro medido no registo.'), 'A planta exige a queixa do teto e do registo.');
  dados.conhecidos_positivos.push({ nome: 'A contagem do registo trocada em memória é recusada pela régua do teto', mordeu: true });
  fs.writeFileSync(path.join(AQUI, 'l1-ex1.json'), JSON.stringify(dados, null, 2) + '\n');
}
console.log(JSON.stringify({ cabeca, contagens: dados.contagens, entradas: dados.entradas.map((e) => [e.url, e.destinos]), conhecidos_positivos: dados.conhecidos_positivos }, null, 2));
