#!/usr/bin/env node
/**
 * A L1 DA PASSAGEM R4-b (06.10.2026), COM AS VEZES CONTADAS: a medida que a leitura a frio do Codex Astra (o achado 10)
 * pediu em vez da do R4 (`medir-l1-r4.mjs`, que comparava, por página, só o número de destinos repetidos e um exemplo).
 *
 * Lê três contagens feitas pela mesma cópia da regra da régua (`contar-destinos-l1.mjs`, que recusa escrever se o seu
 * número de páginas não for o da régua da mesma árvore): a da construção da cabeça de partida (557844fe,
 * `l1-destinos-557844fe.json`, com a proveniência em `l1-base-557844fe-r4b.json`), a da cabeça do R4 (57d81ea6,
 * `l1-destinos-57d81ea6.json`) e a desta construção, que corre aqui. Compara página a página e destino a destino, com as
 * vezes: uma página é nova, saiu, foi agravada (um destino que se repete mais vezes, ou um destino que passou a
 * repetir-se) ou ficou igual.
 *
 * OS CONHECIDOS-POSITIVOS: (1) uma entrada tirada à lista da régua deixa de reconciliar com a contagem dela; (2) A
 * OMISSÃO DAS VEZES: uma página da contagem desta construção com um destino a repetir-se mais uma vez, em memória, é
 * vista como agravada pela comparação com as vezes e passa calada na comparação do R4 (o conjunto das páginas e o
 * número de destinos repetidos de cada uma), que é a prova de que a medida antiga não via o que esta vê.
 *
 * Escreve `l1-r4b.json` ao lado, que o registo dos tetos (`scripts/lugar-tetos-b1.json`) aponta, e
 * `l1-destinos-<cabeça>.json` com a contagem desta construção.
 *
 * Uso, a partir da raiz do sítio, com a construção desta cabeça em `dist/`:
 *   node design/especime-v3/medicoes/r4-2026-10-05/medir-l1-r4b.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..', '..');
const limpa = (/** @type {string} */ s) => s.replace(/\x1b\[[0-9;]*m/g, '').replaceAll(RAIZ, '<sitio>').replace(new RegExp('/' + 'Users' + '/[^/\\s]+', 'g'), '<pasta-local>');
const cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: RAIZ, encoding: 'utf8' }).trim();
const estado = execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], { cwd: RAIZ, encoding: 'utf8' });
const versao = JSON.parse(fs.readFileSync(path.join(RAIZ, 'dist', 'version.json'), 'utf8'));
assert.equal(versao.commit, cabeca, 'a L1 mede-se na construção da cabeça que está a ser medida');

/* A RÉGUA DESTA CONSTRUÇÃO, com a lista inteira. */
const r = spawnSync(process.execPath, ['scripts/check-lugar.mjs'], { cwd: RAIZ, encoding: 'utf8', maxBuffer: 512 * 1024 * 1024, env: { ...process.env, AMOSTRA: '100000' } });
assert([0, 1].includes(r.status ?? -1), 'a régua não correu');
const log = limpa(`${r.stdout}${r.stderr}`);
fs.writeFileSync(path.join(AQUI, 'l1-r4b-check-lugar.log'), log);
const total = log.match(/L1 · páginas com dois destinos iguais fora da mobília\s+(\d+)/);
assert(total, 'o registo da régua não traz a contagem da L1');
const paginasDaRegua = Number(total[1]);
/** A lista inteira das páginas no registo da régua. @param {string} texto */
const listaDaRegua = (texto) => {
  const urls = [];
  for (const l of texto.split('\n')) { const m = l.match(/^\s+· (\S+) · (\d+) destinos repetidos/); if (m) urls.push(m[1]); }
  const t = texto.match(/L1 · páginas com dois destinos iguais fora da mobília\s+(\d+)/);
  assert(t && urls.length === Number(t[1]), 'a amostra tem de conter a lista inteira');
  return urls;
};
const urlsDaRegua = listaDaRegua(log);

/* A CONTAGEM DESTA CONSTRUÇÃO, pela cópia da regra, que recusa escrever sem bater com a régua. */
const ficheiroAgora = path.join(AQUI, `l1-destinos-${cabeca.slice(0, 8)}.json`);
const c = spawnSync(process.execPath, [path.join(AQUI, 'contar-destinos-l1.mjs'), RAIZ, ficheiroAgora, String(paginasDaRegua)], { cwd: RAIZ, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
assert.equal(c.status, 0, `a contagem das vezes não bate com a régua: ${c.stdout}${c.stderr}`);
const ler = (/** @type {string} */ f) => JSON.parse(fs.readFileSync(path.join(AQUI, f), 'utf8')).repetidos_por_pagina;
const base = ler('l1-destinos-557844fe.json');
const r4 = ler('l1-destinos-57d81ea6.json');
const agora = JSON.parse(fs.readFileSync(ficheiroAgora, 'utf8')).repetidos_por_pagina;
assert.deepEqual(Object.keys(agora).sort(), [...urlsDaRegua].sort(), 'as páginas da contagem são as da régua');

/**
 * A comparação com as vezes.
 * @param {Record<string, Record<string, number>>} a @param {Record<string, Record<string, number>>} b
 */
function comVezes(a, b) {
  const novas = Object.keys(b).filter((u) => !(u in a)).sort();
  const sairam = Object.keys(a).filter((u) => !(u in b)).sort();
  const agravadas = [];
  const aliviadas = [];
  let iguais = 0;
  for (const u of Object.keys(b)) {
    if (!(u in a)) continue;
    const pior = Object.entries(b[u]).some(([d, n]) => n > (a[u][d] ?? 0));
    const melhor = Object.entries(a[u]).some(([d, n]) => n > (b[u][d] ?? 0));
    if (pior) agravadas.push(u); else if (melhor) aliviadas.push(u); else iguais++;
  }
  return { novas, sairam, agravadas: agravadas.sort(), aliviadas: aliviadas.sort(), iguais };
}
/** A comparação do R4: o conjunto das páginas e o número de destinos repetidos de cada uma, sem as vezes. */
function semVezes(/** @type {Record<string, Record<string, number>>} */ a, /** @type {Record<string, Record<string, number>>} */ b) {
  const novas = Object.keys(b).filter((u) => !(u in a));
  const agravadas = Object.keys(b).filter((u) => u in a && Object.keys(b[u]).length > Object.keys(a[u]).length);
  return { novas: novas.length, agravadas: agravadas.length };
}
const r4bContraBase = comVezes(base, agora);
const r4ContraBase = comVezes(base, r4);
const r4ContraBaseSemVezes = semVezes(base, r4);

/* O CONHECIDO-POSITIVO DA OMISSÃO DAS VEZES. */
const alvo = Object.keys(agora).find((u) => Object.keys(agora[u]).length === 1);
assert(alvo, 'o conhecido-positivo precisa de uma página com um destino repetido');
const plantada = structuredClone(agora);
const destino = Object.keys(plantada[alvo])[0];
plantada[alvo][destino] += 1;
const comAsVezes = comVezes(agora, plantada);
const semAsVezes = semVezes(agora, plantada);
const vezesMorde = comAsVezes.agravadas.includes(alvo);
const semVezesCala = semAsVezes.agravadas === 0 && semAsVezes.novas === 0;
assert(vezesMorde && semVezesCala, 'a planta da omissão das vezes tem de morder com as vezes e passar calada sem elas');

/* O CONHECIDO-POSITIVO DA LISTA DA RÉGUA. */
const linhasDoLog = log.split('\n');
const i = linhasDoLog.findIndex((l) => /^\s+· \S+ · \d+ destinos repetidos/.test(l));
let listaMorde = false;
try { listaDaRegua(linhasDoLog.filter((_, k) => k !== i).join('\n')); } catch (e) { listaMorde = /lista inteira/.test(String(e)); }
assert(listaMorde, 'a lista adulterada tem de ser recusada');

const teto = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts', 'lugar-tetos-b1.json'), 'utf8'));
const dados = {
  o_que_e: 'R4-b: a L1 desta construção contra a da cabeça de partida (557844fe) e a da cabeça do R4 (57d81ea6), com as vezes de cada destino repetido contadas página a página; a régua sem mudança no que conta, com o marcador da frase por confirmar e o selo de um valor numa explicação conferida pela V1-R4 descontados como as outras portas obrigatórias.',
  data: new Date().toISOString(),
  cabeca,
  estado_seguido: estado,
  construcao: versao.commit,
  base: { cabeca: '557844fe', contagem: 'l1-destinos-557844fe.json', proveniencia: 'l1-base-557844fe-r4b.json' },
  r4: { cabeca: '57d81ea6', contagem: 'l1-destinos-57d81ea6.json' },
  origem: 'design/especime-v3/medicoes/r4-2026-10-05/l1-r4b-check-lugar.log',
  codigo_da_regua: r.status,
  /* «estudos» é o nome histórico do campo que check-lugar lê; conta páginas. */
  contagens: {
    estudos: paginasDaRegua,
    l1_paginas: paginasDaRegua,
    teto_lido: teto.l1_paginas,
    base: Object.keys(base).length,
    r4: Object.keys(r4).length,
    agora: Object.keys(agora).length,
    r4b_novas: r4bContraBase.novas.length,
    r4b_sairam: r4bContraBase.sairam.length,
    r4b_agravadas: r4bContraBase.agravadas.length,
    r4b_aliviadas: r4bContraBase.aliviadas.length,
    r4b_iguais: r4bContraBase.iguais,
    r4_novas: r4ContraBase.novas.length,
    r4_agravadas_com_vezes: r4ContraBase.agravadas.length,
    r4_agravadas_sem_vezes: r4ContraBaseSemVezes.agravadas,
  },
  r4_agravadas_exemplo: r4ContraBase.agravadas.slice(0, 5).map((u) => ({ pagina: u, antes: base[u], r4: r4[u] })),
  conhecidos_positivos: [
    { nome: 'Uma entrada retirada da lista deixa de reconciliar com a contagem da régua', mordeu: listaMorde },
    { nome: `A omissão das vezes: um destino de ${alvo} a repetir-se mais uma vez, em memória, é agravado com as vezes e passa calado na comparação do R4`, mordeu: vezesMorde && semVezesCala },
  ],
};
fs.writeFileSync(path.join(AQUI, 'l1-r4b.json'), `${JSON.stringify(dados, null, 2)}\n`);
console.log(JSON.stringify({ cabeca, contagens: dados.contagens, conhecidos_positivos: dados.conhecidos_positivos.map((x) => x.mordeu) }, null, 2));
