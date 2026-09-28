#!/usr/bin/env node
/**
 * OS SINAIS DA PRIMEIRA PÁGINA (bloco PP1, 28.09.2026; o §2, ponto 5, do brief).
 *
 * Um bloco de «O que se passa» é uma declaração com condições, e uma atualização dos dados nunca faz
 * falhar a construção: um bloco cujas condições deixam de ser verdadeiras sai da página e deixa um
 * sinal, e o lugar de direção reescreve-o (o §5.2 do brief). Este guião é o sinal. Avalia cada bloco
 * e cada peça pelo mesmo resolvedor que a página usa (`sinaisDaPrimeiraPagina()`, em
 * `src/lib/primeira-pagina.mjs`), escreve o que sai e porquê em `.sinais/primeira-pagina.json` (fora
 * de `dist/` e fora do Git, pelo `.gitignore`; `OEDP_SINAIS` aponta outro ficheiro), e imprime-o como
 * aviso.
 *
 * A CONSTRUÇÃO SÓ FALHA SE A PRIMEIRA PÁGINA MOSTRAR MENOS DE TRÊS BLOCOS: cinco histórias mudadas de
 * uma vez é mais provavelmente uma avaria do resolvedor do que o país.
 *
 * `--prova` corre as duas plantas do brief, cada uma num processo filho, sem tocar em ficheiro nenhum:
 * uma condição falsa numa cópia das declarações (o bloco sai, o sinal nomeia-o, o código é 0) e um
 * resolvedor que recusa tudo (o código é 1).
 *
 * Uso: node scripts/sinais-da-primeira-pagina.mjs [--prova] [--json saída das plantas]
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { sinaisDaPrimeiraPagina } from '../src/lib/primeira-pagina.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ALVO = process.env.OEDP_SINAIS ?? path.join(RAIZ, '.sinais', 'primeira-pagina.json');
/** O mínimo de blocos que a primeira página tem de mostrar. */
export const MINIMO_DE_BLOCOS = 3;

const sinais = sinaisDaPrimeiraPagina();
const mostrados = sinais.filter((s) => s.mostra);
const saidas = sinais.flatMap((s) => [
  ...(s.mostra ? [] : [{ bloco: s.bloco, peca: null, porque: s.falhas }]),
  ...(s.mostra ? s.pecas.filter((p) => !p.mostra).map((p) => ({ bloco: s.bloco, peca: p.peca, porque: p.falhas })) : []),
]);
const registo = {
  o_que_e: 'Os blocos e as peças de «O que se passa» que as condições tiraram da primeira página, e porquê. Escrito por scripts/sinais-da-primeira-pagina.mjs a cada corrida do verify, para o lugar de direção.',
  escrito_em: new Date().toISOString(),
  blocos_declarados: sinais.length,
  blocos_mostrados: mostrados.length,
  minimo: MINIMO_DE_BLOCOS,
  saidas,
  blocos: sinais,
};
fs.mkdirSync(path.dirname(ALVO), { recursive: true });
fs.writeFileSync(ALVO, JSON.stringify(registo, null, 2) + '\n');
for (const s of saidas) {
  console.warn(`  SINAL · ${s.peca ? `a peça «${s.peca}» do bloco` : 'o bloco'} «${s.bloco}» saiu da página: ${s.porque.join('; ')}`);
}
console.log(`sinais · ${mostrados.length} de ${sinais.length} blocos na primeira página, ${saidas.length} saída(s); o registo está em ${path.relative(RAIZ, ALVO)}.`);
let codigo = mostrados.length < MINIMO_DE_BLOCOS ? 1 : 0;
if (codigo) console.error(`sinais · a primeira página mostra ${mostrados.length} blocos, e o mínimo é ${MINIMO_DE_BLOCOS}: é mais provável uma avaria do resolvedor do que ${sinais.length - mostrados.length} histórias mudadas de uma vez.`);

if (process.argv.includes('--prova') && !process.env.OEDP_SINAIS_PLANTA) {
  const temporaria = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-sinais-'));
  const guiao = pathToFileURL(fileURLToPath(import.meta.url)).href;
  const declaracoes = pathToFileURL(path.join(RAIZ, 'src', 'data', 'primeira-pagina.mjs')).href;
  const resolvedor = pathToFileURL(path.join(RAIZ, 'src', 'lib', 'primeira-pagina.mjs')).href;
  /** @param {string} antes */
  const filho = (antes) => spawnSync(process.execPath, ['--input-type=module', '-e', `${antes}\nawait import(${JSON.stringify(guiao)});`], {
    encoding: 'utf8', cwd: RAIZ, env: { ...process.env, OEDP_SINAIS: path.join(temporaria, 'sinais.json'), OEDP_SINAIS_PLANTA: '1' },
  });
  const plantas = [];
  /* 1 · UMA CONDIÇÃO FALSA NUMA CÓPIA: a declaração do bloco dos preços ganha, na memória do filho, uma
     condição que os valores não sustentam; o bloco sai, o sinal nomeia-o, e o código é 0. */
  const falsa = filho(`import { BLOCOS_DA_PRIMEIRA_PAGINA } from ${JSON.stringify(declaracoes)};
    BLOCOS_DA_PRIMEIRA_PAGINA.find((b) => b.id === 'precos').condicao.push({ a: 'ipc-variacao-homologa', op: '<', valor: 0 });`);
  const escrito = fs.existsSync(path.join(temporaria, 'sinais.json')) ? JSON.parse(fs.readFileSync(path.join(temporaria, 'sinais.json'), 'utf8')) : null;
  plantas.push({
    nome: 'uma condição falsa numa cópia das declarações',
    passou: falsa.status === 0 && /SINAL · o bloco «precos» saiu da página: condição falsa: ipc-variacao-homologa/.test(falsa.stderr) && Boolean(escrito?.saidas?.some((s) => s.bloco === 'precos')),
    codigo: falsa.status,
  });
  /* 2 · UM RESOLVEDOR QUE RECUSA TUDO: um gancho do carregador troca, no filho, o resolvedor por um que
     diz que nenhum bloco se mostra; a primeira página ficava sem blocos, e o código é 1. */
  const gancho = `export async function load(url, ctx, next) {
    if (url === ${JSON.stringify(resolvedor)}) {
      return { format: 'module', shortCircuit: true, source:
        "import * as m from '" + url + "?inteiro'; export * from '" + url + "?inteiro';" +
        " export function sinaisDaPrimeiraPagina() { return m.sinaisDaPrimeiraPagina().map((s) => ({ ...s, mostra: false, falhas: ['o resolvedor plantado recusa tudo'] })); }" };
    }
    return next(url, ctx);
  }`;
  const recusa = filho(`import { register } from 'node:module';
    register('data:text/javascript,' + encodeURIComponent(${JSON.stringify(gancho)}));`);
  plantas.push({
    nome: 'um resolvedor que recusa tudo',
    passou: recusa.status === 1 && /a primeira página mostra 0 blocos, e o mínimo é 3/.test(recusa.stderr),
    codigo: recusa.status,
  });
  fs.rmSync(temporaria, { recursive: true, force: true });
  for (const p of plantas) console.log(`  ${p.passou ? 'mordeu' : 'NÃO MORDEU'} · ${p.nome} (código ${p.codigo})`);
  if (plantas.some((p) => !p.passou)) codigo = 1;
  /* `--json <ficheiro>` escreve as duas plantas, para o relatório do bloco que as mede. */
  const j = process.argv.indexOf('--json');
  if (j !== -1) fs.writeFileSync(process.argv[j + 1], JSON.stringify({ blocos_mostrados: mostrados.length, saidas: saidas.length, plantas }, null, 2) + '\n');
}
process.exitCode = codigo;
