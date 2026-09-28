#!/usr/bin/env node
/**
 * PP1 · A PRIMEIRA PÁGINA SEM VALORES PRESOS: UM VALOR REVISTO NUMA CÓPIA DO LIVRO (o §2, ponto 3, do
 * brief, 28.09.2026).
 *
 * A leitura do país prendia nove valores: `LeituraDoPais.astro` parava a construção quando um deles
 * mudava («B1 leitura do país: <linha> mudou; parar a frase e comunicar à direção»). Este guião mostra
 * as duas coisas, cada uma numa cópia da árvore extraída com `git archive` para uma pasta temporária
 * fora do repositório, com a mesma revisão de uma linha do livro:
 *
 *   · na cabeça de partida, a construção para no Astro, com a frase da leitura do país (é o
 *     conhecido-positivo: a planta morde onde a página prendia o valor);
 *   · na cabeça do bloco, a construção inteira passa (`npm run build`, com todos os portões da cadeia),
 *     a peça que o valor revisto deixa de sustentar sai da página, e o guião dos sinais nomeia-a.
 *
 * A REVISÃO: `precos-da-habitacao-2025`, uma das nove linhas que a leitura prendia, passa de 17,6 para
 * 4,9 (abaixo dos 5,5 da União e do limiar da Comissão), com o excerto revisto do mesmo modo. É uma
 * planta: não é um valor publicado, vive só na pasta temporária, e a pasta apaga-se no fim.
 *
 * Uso: node design/especime-v3/medicoes/pp1-2026-09-28/valor-revisto.mjs <cabeça de partida> <cabeça do bloco>
 * Escreve design/especime-v3/medicoes/pp1-2026-09-28/valor-revisto.json, sem caminhos da máquina.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '..', '..', '..', '..');
const [partida, doBloco] = process.argv.slice(2);
if (!partida || !doBloco) { console.error('uso: valor-revisto.mjs <cabeça de partida> <cabeça do bloco>'); process.exit(2); }
const git = (...a) => execFileSync('git', a, { cwd: RAIZ, encoding: 'utf8' }).trim();
const LINHA = 'precos-da-habitacao-2025';
const ANTES = { valor: '17,6', excerto: '2025: 17.6"' };
const DEPOIS = { valor: '4,9', excerto: '2025: 4.9"' };

/** Extrai a árvore de uma cabeça para uma pasta temporária e revê a linha. @param {string} cabeca */
function copia(cabeca) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-valor-revisto-'));
  const arquivo = spawnSync('git', ['archive', '--format=tar', cabeca], { cwd: RAIZ, maxBuffer: 2 * 1024 * 1024 * 1024 });
  if (arquivo.status !== 0) throw new Error(`git archive ${cabeca} falhou`);
  const tar = spawnSync('tar', ['-x', '-C', tmp], { input: arquivo.stdout, maxBuffer: 64 * 1024 * 1024 });
  if (tar.status !== 0) throw new Error('tar falhou');
  fs.symlinkSync(path.join(RAIZ, 'node_modules'), path.join(tmp, 'node_modules'));
  const f = path.join(tmp, 'ledger', 'claims', `${LINHA}.yml`);
  let y = fs.readFileSync(f, 'utf8');
  if (y.split(`value: "${ANTES.valor}"`).length !== 2 || y.split(ANTES.excerto).length !== 2) throw new Error(`${cabeca}: a linha ${LINHA} não tem o valor e o excerto esperados`);
  y = y.replace(`value: "${ANTES.valor}"`, `value: "${DEPOIS.valor}"`).replace(ANTES.excerto, DEPOIS.excerto);
  fs.writeFileSync(f, y);
  return tmp;
}
/** @param {string} dir @param {string[]} args */
function corre(dir, args) {
  const t0 = Date.now();
  const r = spawnSync(args[0], args.slice(1), { cwd: dir, encoding: 'utf8', maxBuffer: 1024 * 1024 * 1024, env: { ...process.env, FORCE_COLOR: '0' } });
  return { codigo: r.status, segundos: Math.round((Date.now() - t0) / 1000), saida: `${r.stdout ?? ''}${r.stderr ?? ''}` };
}
/** As últimas linhas de uma saída, sem os caminhos da máquina: a cópia, a árvore, a pasta temporária e a casa do utilizador. @param {string} saida @param {string} dir */
function cauda(saida, dir) {
  const troca = [[dir, '<cópia>'], [fs.realpathSync(dir), '<cópia>'], [RAIZ, '<worktree do sítio>'], [os.tmpdir(), '<tmp>'], [os.homedir(), '~']];
  let t = saida;
  for (const [de, para] of troca) t = t.split(de).join(para);
  return t.replace(/\x1b\[[0-9;]*m/g, '').split('\n').filter((l) => l.trim()).slice(-25);
}
const registo = {
  o_que_e: 'Um valor revisto numa cópia do livro-razão, construído na cabeça de partida e na cabeça do bloco PP1.',
  comando: 'node design/especime-v3/medicoes/pp1-2026-09-28/valor-revisto.mjs <cabeça de partida> <cabeça do bloco>',
  linha: LINHA, valor_publicado: ANTES.valor, valor_da_planta: DEPOIS.valor,
  partida: /** @type {any} */ ({}), bloco: /** @type {any} */ ({}),
};
/* 1 · A CABEÇA DE PARTIDA: a construção do Astro, que é onde a leitura do país prendia os valores. */
{
  const dir = copia(partida);
  try {
    const r = corre(dir, ['npm', 'run', 'build']);
    const erro = /B1 leitura do país: [^\n;]+mudou[^\n]*/.exec(r.saida)?.[0] ?? null;
    registo.partida = { cabeca: git('rev-parse', partida), comando: 'npm run build', codigo: r.codigo, segundos: r.segundos, erro, mordeu: r.codigo !== 0 && erro !== null && erro.includes(LINHA), cauda: r.codigo === 0 ? [] : cauda(r.saida, dir) };
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}
/* 2 · A CABEÇA DO BLOCO: a cadeia inteira da construção, e depois os sinais e a página. */
{
  const dir = copia(doBloco);
  try {
    const r = corre(dir, ['npm', 'run', 'build']);
    const s = corre(dir, [process.execPath, 'scripts/sinais-da-primeira-pagina.mjs']);
    const sinais = fs.existsSync(path.join(dir, '.sinais', 'primeira-pagina.json')) ? JSON.parse(fs.readFileSync(path.join(dir, '.sinais', 'primeira-pagina.json'), 'utf8')) : null;
    const pt = fs.existsSync(path.join(dir, 'dist', 'index.html')) ? fs.readFileSync(path.join(dir, 'dist', 'index.html'), 'utf8') : '';
    const casa = fs.existsSync(path.join(dir, 'dist', 'a-minha-casa', 'index.html')) ? fs.readFileSync(path.join(dir, 'dist', 'a-minha-casa', 'index.html'), 'utf8') : '';
    const falhou = r.codigo === 0 ? null : (r.saida.match(/> o-estado-do-pais@[^\n]*\n> ([^\n]+)/g) ?? []).slice(-1)[0] ?? null;
    registo.bloco = {
      cabeca: git('rev-parse', doBloco), comando: 'npm run build', codigo: r.codigo, segundos: r.segundos, ultimo_passo_se_falhou: falhou, cauda: r.codigo === 0 ? [] : cauda(r.saida, dir),
      sinais: { comando: 'node scripts/sinais-da-primeira-pagina.mjs', codigo: s.codigo, blocos_mostrados: sinais?.blocos_mostrados ?? null, saidas: sinais?.saidas ?? null },
      primeira_pagina: {
        blocos: (pt.match(/data-bloco="[a-z-]+"/g) ?? []).length,
        peca_dos_precos_das_casas_presente: pt.includes('data-bloco-peca="precos-das-casas"'),
      },
      /* O valor revisto chega ao cartão da entrada da casa, com o seu recibo. */
      valor_da_planta_no_cartao_da_entrada_da_casa: casa.includes(`data-claim="${LINHA}"`) && casa.includes(`>${DEPOIS.valor}<`),
    };
    registo.bloco.passou = r.codigo === 0 && s.codigo === 0 && Boolean(sinais?.saidas?.some((/** @type {any} */ x) => x.bloco === 'casa' && x.peca === 'precos-das-casas')) && !registo.bloco.primeira_pagina.peca_dos_precos_das_casas_presente && registo.bloco.valor_da_planta_no_cartao_da_entrada_da_casa;
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}
fs.writeFileSync(path.join(AQUI, 'valor-revisto.json'), JSON.stringify(registo, null, 2) + '\n');
console.log(JSON.stringify({ partida: { codigo: registo.partida.codigo, mordeu: registo.partida.mordeu }, bloco: { codigo: registo.bloco.codigo, passou: registo.bloco.passou } }));
if (!registo.partida.mordeu || !registo.bloco.passou) process.exitCode = 1;
