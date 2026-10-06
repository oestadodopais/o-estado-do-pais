#!/usr/bin/env node
/**
 * A L1 DO BLOCO R4 (05.10.2026): mede o que a frase «o que é» das séries fez à catraca das páginas com dois destinos
 * iguais, contra a construção da cabeça de partida, sem mudar a régua.
 *
 * A frase «o que é» de uma série com linha é a frase da linha (a decisão 1 do brief R4: a frase é uma, e é a do
 * cartão). Quando a linha tem cartão nacional, a frase diz o valor da linha, e o valor leva o seu selo (a regra do
 * portão de HTML: «onde aparece um valor, aparece o selo»); o selo abre o recibo da linha, que a lista «As linhas que
 * são pontos desta série», no mesmo recibo, já abria. Este guião confere que é só isso:
 *   · a lista inteira das páginas da L1 da cabeça de partida (o registo `l1-base-557844fe.log`, corrido pela régua
 *     dessa cabeça sobre a construção dela, numa worktree à parte) e a desta construção;
 *   · as páginas novas são exatamente recibos de séries cujo par repetido é o recibo da linha da frase;
 *   · nenhuma página antiga ficou com mais destinos repetidos, e nenhuma saiu sem se dizer;
 *   · o conhecido-positivo: uma entrada tirada da lista deixa de reconciliar com a contagem da régua.
 * Escreve `l1-r4.json` ao lado, que o registo dos tetos (`scripts/lugar-tetos-b1.json`) aponta.
 *
 * Uso, a partir da raiz do sítio, com a construção desta cabeça em `dist/`:
 *   node design/especime-v3/medicoes/r4-2026-10-05/medir-l1-r4.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..', '..');
const limpa = (/** @type {string} */ s) => s.replace(/\x1b\[[0-9;]*m/g, '').replaceAll(RAIZ, '<sitio>').replace(/\/Users\/[^/\s]+/g, '<pasta-local>');
/** A lista inteira das páginas da L1 num registo da régua corrida com AMOSTRA alta. @param {string} texto */
function lista(texto) {
  /** @type {Map<string, { destinos: number, exemplo: string, vezes: number }>} */
  const r = new Map();
  for (const l of limpa(texto).split('\n')) {
    const m = l.match(/^\s+· (\S+) · (\d+) destinos repetidos \(ex\.: (\S+) ×(\d+)\)/);
    if (m) { assert(!r.has(m[1]), `a página ${m[1]} aparece duas vezes`); r.set(m[1], { destinos: Number(m[2]), exemplo: m[3], vezes: Number(m[4]) }); }
  }
  const total = limpa(texto).match(/L1 · páginas com dois destinos iguais fora da mobília\s+(\d+)/);
  assert(total && r.size === Number(total[1]), 'a amostra tem de conter a lista inteira');
  return r;
}

const base = path.join(AQUI, 'l1-base-557844fe.log');
assert(fs.existsSync(base), 'falta o registo da régua na construção de partida (l1-base-557844fe.log)');
const antes = lista(fs.readFileSync(base, 'utf8'));
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: RAIZ, encoding: 'utf8' }).trim();
const versao = JSON.parse(fs.readFileSync(path.join(RAIZ, 'dist', 'version.json'), 'utf8'));
assert.equal(versao.commit, cabeca, 'a L1 mede-se na construção da cabeça que está a ser medida');
const r = spawnSync(process.execPath, ['scripts/check-lugar.mjs'], { cwd: RAIZ, encoding: 'utf8', maxBuffer: 512 * 1024 * 1024, env: { ...process.env, AMOSTRA: '100000' } });
assert([0, 1].includes(r.status ?? -1), 'a régua não correu');
const log = limpa(`${r.stdout}${r.stderr}`);
fs.writeFileSync(path.join(AQUI, 'l1-r4-check-lugar.log'), log);
const depois = lista(log);

/* AS PÁGINAS NOVAS: cada uma é um recibo de série, e o par repetido é o recibo da linha da frase «o que é». */
const novas = [...depois.keys()].filter((u) => !antes.has(u)).sort();
const sairam = [...antes.keys()].filter((u) => !depois.has(u)).sort();
const agravadas = [...depois.keys()].filter((u) => antes.has(u) && depois.get(u).destinos > antes.get(u).destinos).sort();
for (const u of novas) {
  const m = /^\/(?:en\/ledger|livro-razao)\/series\/([a-z0-9-]+)$/.exec(u);
  assert(m, `uma página nova que não é um recibo de série: ${u}`);
  const root = parse(fs.readFileSync(path.join(RAIZ, 'dist', u.slice(1), 'index.html'), 'utf8'));
  const frase = root.querySelector('[data-o-que-e-da-serie]');
  const linha = frase?.getAttribute('data-o-que-e-linha');
  assert(linha && frase.getAttribute('data-o-que-e-origem') === 'linha', `${u}: a frase não vem de uma linha`);
  const exemplo = depois.get(u).exemplo;
  assert(exemplo.endsWith(`/${linha}`), `${u}: o destino repetido (${exemplo}) não é o recibo da linha da frase (${linha})`);
  assert(frase.querySelectorAll('a.src-chip').some((a) => a.getAttribute('href') === exemplo), `${u}: o selo da frase não abre o destino repetido`);
}
assert.deepEqual(agravadas, [], 'nenhuma página antiga fica com mais destinos repetidos');

/* O CONHECIDO-POSITIVO: uma entrada tirada da lista deixa de reconciliar com a contagem da régua. */
const linhasDoLog = log.split('\n');
const i = linhasDoLog.findIndex((l) => /^\s+· \S+ · \d+ destinos repetidos/.test(l));
assert(i >= 0, 'o conhecido-positivo exige uma entrada contada');
let mordeu = false;
try { lista(linhasDoLog.filter((_, k) => k !== i).join('\n')); } catch (e) { mordeu = /lista inteira/.test(String(e)); }
assert(mordeu, 'a lista adulterada tem de ser recusada');

const teto = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts', 'lugar-tetos-b1.json'), 'utf8'));
const dados = {
  o_que_e: 'R4: a L1 desta construção contra a da cabeça de partida (557844fe), a régua sem mudança; as páginas novas são os recibos das séries cuja frase «o que é» é a frase de uma linha com cartão, onde o selo do valor abre o recibo da linha que a lista das linhas da série já abria.',
  data: new Date().toISOString(),
  cabeca,
  construcao: versao.commit,
  base: { cabeca: '557844fe', registo: 'design/especime-v3/medicoes/r4-2026-10-05/l1-base-557844fe.log' },
  origem: 'design/especime-v3/medicoes/r4-2026-10-05/l1-r4-check-lugar.log',
  codigo_da_regua: r.status,
  /* «estudos» é o nome histórico do campo que check-lugar lê; conta páginas. */
  contagens: { estudos: depois.size, l1_paginas: depois.size, teto_lido: teto.l1_paginas, antes: antes.size, depois: depois.size, novas: novas.length, sairam: sairam.length, agravadas: agravadas.length },
  novas,
  sairam,
  conhecidos_positivos: [{ nome: 'Uma entrada retirada da lista deixa de reconciliar com a contagem da régua', mordeu }],
  paginas: Object.fromEntries(depois),
};
fs.writeFileSync(path.join(AQUI, 'l1-r4.json'), `${JSON.stringify(dados, null, 2)}\n`);
console.log(JSON.stringify({ cabeca, contagens: dados.contagens, novas: novas.length, sairam }, null, 2));
