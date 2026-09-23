#!/usr/bin/env node
/**
 * A L1 DO BLOCO R1, PÁGINA A PÁGINA (23.09.2026).
 *
 *   node design/especime-v3/medicoes/r1-2026-09-23/medir-l1-r1.mjs
 *
 * Corre a régua da casa (`scripts/check-lugar.mjs`) sobre o `dist/` desta árvore
 * com `AMOSTRA` alta, para que ela escreva TODAS as páginas da L1 e não seis; lê
 * a mesma lista da construção da cabeça de partida (`cbe87016`), guardada em
 * `l1-antes-check-lugar.txt` pela mesma régua, e compara as duas. Não conta
 * melhor do que a régua: conta a MESMA coisa, e diz que páginas entraram e
 * porquê. Escreve `l1-r1.json` ao lado, que é o ficheiro que
 * `scripts/lugar-tetos-b1.json` aponta como medição do teto.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { matchPath } from '../../../../src/lib/routes.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '../../../..');
const r = spawnSync(process.execPath, ['scripts/check-lugar.mjs'], {
  cwd: RAIZ, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, env: { ...process.env, AMOSTRA: '100000' },
});
const semCor = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');
const lista = (texto) => {
  const fora = new Map();
  for (const l of semCor(texto).split('\n')) {
    const m = l.match(/^\s+· (\S+) · (\d+) destinos repetidos \(ex\.: (\S+) ×(\d+)\)/);
    if (m) fora.set(m[1], { destinos: Number(m[2]), exemplo: m[3], vezes: Number(m[4]) });
  }
  return fora;
};
const depois = lista(r.stdout + r.stderr);
const antes = lista(fs.readFileSync(path.join(AQUI, 'l1-antes-check-lugar.txt'), 'utf8'));
const familia = (url) => matchPath(url)?.key ?? '(sem rota)';
const porFamilia = (m) => {
  const f = {};
  for (const url of m.keys()) f[familia(url)] = (f[familia(url)] ?? 0) + 1;
  return Object.fromEntries(Object.entries(f).sort());
};
const entraram = [...depois.keys()].filter((u) => !antes.has(u)).sort().map((u) => ({ url: u, familia: familia(u), ...depois.get(u) }));
const sairam = [...antes.keys()].filter((u) => !depois.has(u)).sort();
const mudaram = [...depois.keys()].filter((u) => antes.has(u) && antes.get(u).destinos !== depois.get(u).destinos).sort()
  .map((u) => ({ url: u, antes: antes.get(u).destinos, depois: depois.get(u).destinos }));
const versao = JSON.parse(fs.readFileSync(path.join(RAIZ, 'dist', 'version.json'), 'utf8'));
const saida = {
  cabeca: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: RAIZ, encoding: 'utf8' }).trim(),
  dist_construido_de: versao.commit,
  dist_construido_em: versao.construido_em,
  regua: 'node scripts/check-lugar.mjs, com AMOSTRA=100000',
  contagens: { estudos: depois.size, antes: antes.size, entraram: entraram.length, sairam: sairam.length },
  familias: { depois: porFamilia(depois), antes: porFamilia(antes) },
  entraram,
  sairam,
  paginas_que_ja_contavam_e_mudaram_de_destinos: mudaram,
};
fs.writeFileSync(path.join(AQUI, 'l1-r1.json'), JSON.stringify(saida, null, 2) + '\n');
console.log(`L1: ${antes.size} antes, ${depois.size} depois; entraram ${entraram.length}, saíram ${sairam.length}.`);
for (const e of entraram) console.log(`  + ${e.url} (${e.familia}) · ${e.destinos} destino(s) repetido(s), ex.: ${e.exemplo} ×${e.vezes}`);
