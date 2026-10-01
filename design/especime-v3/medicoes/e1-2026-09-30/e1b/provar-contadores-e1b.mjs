/**
 * AS PLANTAS DOS DOIS CONTADORES DO ARQUIVO (passagem E1b, 01.10.2026).
 *
 *     node design/especime-v3/medicoes/e1-2026-09-30/e1b/provar-contadores-e1b.mjs [--json <ficheiro>]
 *
 * Corre da raiz do sítio, depois de uma construção (o check-pais lê o `dist/`). Cada planta
 * corre o PORTÃO REAL num processo à parte, com um estrago feito só em memória (o módulo
 * importado e mudado antes de o portão o ler, ou o `fs.readFileSync` do processo a devolver
 * outros bytes para um ficheiro), e exige o código 1 e a queixa esperada. Nenhum ficheiro
 * da árvore é escrito. É a forma das plantas da célula do E0 (`tests/inicio/linhas-da-casa.mjs`).
 *
 * O que as plantas provam, para `estudos-publicados` e `edicoes-publicadas`:
 *   A3   sem a declaração em lugar-das-linhas.mjs, a mudança fica sem lugar e o registo recusa-a;
 *   A1   declarada de Portugal, a declaração discorda do lugar derivado;
 *   A1b  sem a expressão verificada que a segunda leitura reconhece, a declaração não deriva lugar;
 *   R    sem a declaração, o resolvedor das mudanças recusa a linha;
 *   H    sem a história selada, o ledger:check recusa a lista de correções;
 *   V    com o valor antigo, o ledger:check recusa a aritmética contra o arquivo.
 * E o conhecido-negativo: os dois portões, sem estrago, saem com 0.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const env = { ...process.env, OEDP_DIST: path.resolve('dist'), NO_COLOR: '1' };
delete env.FORCE_COLOR;
const redigir = (s) => s.replaceAll(process.cwd(), '[repositorio]').replaceAll(os.homedir(), '[pasta-pessoal]').replaceAll(os.userInfo().username, '[utilizador]');
function correr(nome, codigo, mordida, esperado = 1) {
  const r = spawnSync('node', ['--input-type=module', '-e', codigo], { encoding: 'utf8', env, maxBuffer: 64 * 1024 * 1024 });
  const saida = redigir((r.stdout ?? '') + (r.stderr ?? ''));
  const queixa = mordida ? saida.split('\n').find((l) => mordida.test(l)) ?? null : null;
  const mordeu = esperado === 0 ? r.status === 0 : r.status === esperado && Boolean(queixa);
  return { nome, codigo: r.status, esperado, mordida: mordida?.source ?? null, queixa, mordeu, memoria_isolada: true };
}
const lerOutro = (sufixo, troca) =>
  `import fs from "node:fs"; const ler=fs.readFileSync; fs.readFileSync=function(f,...a){const b=ler.call(this,f,...a); return String(f).endsWith(${JSON.stringify(sufixo)}) ? (${troca})(String(b)) : b;};`;

const plantas = [];
plantas.push(correr('limpo: check-pais', 'await import("./scripts/check-pais.mjs");', null, 0));
plantas.push(correr('limpo: ledger:check', 'await import("./scripts/check-ledger.mjs");', null, 0));
for (const id of ['estudos-publicados', 'edicoes-publicadas']) {
  plantas.push(correr(`A3: ${id} sem declaração`,
    `import {LUGAR_DECLARADO_DAS_LINHAS as l} from "./src/data/lugar-das-linhas.mjs"; delete l[${JSON.stringify(id)}]; await import("./scripts/check-pais.mjs");`,
    /A3: .*uma linha do registo sem lugar/));
  plantas.push(correr(`A1: ${id} declarada de Portugal`,
    `import {LUGAR_DECLARADO_DAS_LINHAS as l} from "./src/data/lugar-das-linhas.mjs"; l[${JSON.stringify(id)}]="portugal"; await import("./scripts/check-pais.mjs");`,
    new RegExp(`A1: ${id} é declarado de «portugal» e deriva de «o-estado-do-pais»`)));
  plantas.push(correr(`A1b: ${id} sem a expressão verificada do arquivo`,
    lerOutro(`ledger/claims/${id}.yml`, `(t) => t.replace(/^check: "[^"]+"/m, 'check: "outra_contagem"')`) + 'await import("./scripts/check-pais.mjs");',
    new RegExp(`A1: ${id} está em lugar-das-linhas.mjs e não deriva lugar nenhum`)));
  plantas.push(correr(`R: ${id} sem declaração no resolvedor`,
    `import {LUGAR_DECLARADO_DAS_LINHAS as l} from "./src/data/lugar-das-linhas.mjs"; import {mudancasDoRegisto} from "./src/lib/mudancas.mjs"; delete l[${JSON.stringify(id)}]; try { mudancasDoRegisto("pt"); } catch (e) { console.log(e.message); process.exitCode = 1; }`,
    new RegExp(`${id}.*nenhuma declaração diz de que lugar é`)));
  plantas.push(correr(`H: ${id} sem a história selada`,
    lerOutro('ledger/historias-valores.json', `(t) => { const h = JSON.parse(t); delete h[${JSON.stringify(id)}]; return JSON.stringify(h); }`) + 'await import("./scripts/check-ledger.mjs");',
    new RegExp(`${id}\\.yml.*história do valor: a lista tem 1 entradas e o registo sela 0`)));
  const antigo = id === 'estudos-publicados' ? '13' : '18';
  plantas.push(correr(`V: ${id} com o valor antigo`,
    lerOutro(`ledger/claims/${id}.yml`, `(t) => t.replace(/^value: "[^"]+"/m, 'value: "${antigo}"')`) + 'await import("./scripts/check-ledger.mjs");',
    new RegExp(`\\[${id}\\.yml\\] a aritmética não bate certo`)));
}
const saida = { plantas, mordidas: plantas.filter((p) => p.mordeu).length, total: plantas.length };
const j = process.argv.indexOf('--json');
if (j >= 0) fs.writeFileSync(process.argv[j + 1], JSON.stringify(saida, null, 1) + '\n');
console.log(JSON.stringify(saida, null, 1));
process.exitCode = saida.mordidas === saida.total ? 0 : 1;
