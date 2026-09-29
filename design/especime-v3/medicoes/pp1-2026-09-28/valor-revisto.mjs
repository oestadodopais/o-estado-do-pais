#!/usr/bin/env node
/**
 * PP1 · A PRIMEIRA PÁGINA SEM VALORES PRESOS: UM VALOR REVISTO NUMA CÓPIA DO LIVRO (o §2, ponto 3, do
 * brief, 28.09.2026).
 *
 * A leitura do país prendia nove valores: `LeituraDoPais.astro` parava a construção quando um deles
 * mudava («B1 leitura do país: <linha> mudou; parar a frase e comunicar à direção»). Este guião constrói
 * cópias da árvore, extraídas com `git archive` para pastas temporárias fora do repositório, cada uma com
 * uma revisão de `precos-da-habitacao-2025`, uma das nove linhas que a leitura prendia (o valor e o
 * excerto revistos do mesmo modo). São plantas: não são valores publicados, vivem só nas pastas
 * temporárias, e as pastas apagam-se no fim.
 *
 *   · A · 17,6 passa a 12,4: continua acima dos 5,5 da União e do limiar da Comissão (9 %), e nenhuma
 *     condição nem nenhuma contagem muda. Na cabeça de partida a construção para no Astro, com a frase
 *     da leitura do país (o conhecido-positivo); na cabeça do bloco a cadeia inteira da construção passa.
 *     É a medida do brief: a revisão de rotina de um valor que a primeira página prendia já não parte a
 *     construção.
 *   · B · 17,6 passa a 4,9: fica abaixo dos 5,5 da União e do limiar. Na cabeça do bloco, a peça dos
 *     preços das casas sai da primeira página e o guião dos sinais nomeia-a; e o registo diz em que passo
 *     a construção fica, e porquê, para o lugar de direção ler.
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
const PUBLICADO = { valor: '17,6', excerto: '2025: 17.6"' };
const REVISOES = {
  A: { valor: '12,4', excerto: '2025: 12.4"' },
  B: { valor: '4,9', excerto: '2025: 4.9"' },
};

/** Extrai a árvore de uma cabeça para uma pasta temporária e revê a linha. @param {string} cabeca @param {{ valor: string, excerto: string }} rev */
function copia(cabeca, rev) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-valor-revisto-'));
  const arquivo = spawnSync('git', ['archive', '--format=tar', cabeca], { cwd: RAIZ, maxBuffer: 2 * 1024 * 1024 * 1024 });
  if (arquivo.status !== 0) throw new Error(`git archive ${cabeca} falhou`);
  const tar = spawnSync('tar', ['-x', '-C', tmp], { input: arquivo.stdout, maxBuffer: 64 * 1024 * 1024 });
  if (tar.status !== 0) throw new Error('tar falhou');
  fs.symlinkSync(path.join(RAIZ, 'node_modules'), path.join(tmp, 'node_modules'));
  const f = path.join(tmp, 'ledger', 'claims', `${LINHA}.yml`);
  let y = fs.readFileSync(f, 'utf8');
  if (y.split(`value: "${PUBLICADO.valor}"`).length !== 2 || y.split(PUBLICADO.excerto).length !== 2) throw new Error(`${cabeca}: a linha ${LINHA} não tem o valor e o excerto esperados`);
  y = y.replace(`value: "${PUBLICADO.valor}"`, `value: "${rev.valor}"`).replace(PUBLICADO.excerto, rev.excerto);
  fs.writeFileSync(f, y);
  return tmp;
}
/** @param {string} dir @param {string[]} args */
function corre(dir, args) {
  const t0 = Date.now();
  const r = spawnSync(args[0], args.slice(1), { cwd: dir, encoding: 'utf8', maxBuffer: 1024 * 1024 * 1024, env: { ...process.env, FORCE_COLOR: '0' } });
  return { codigo: r.status, segundos: Math.round((Date.now() - t0) / 1000), saida: `${r.stdout ?? ''}${r.stderr ?? ''}` };
}
/** As últimas linhas de uma saída, sem os caminhos da máquina (a cópia, a árvore, a pasta temporária, a casa do utilizador). @param {string} saida @param {string} dir */
function cauda(saida, dir) {
  const troca = [[fs.realpathSync(dir), '<cópia>'], [dir, '<cópia>'], [fs.realpathSync(RAIZ), '<worktree do sítio>'], [RAIZ, '<worktree do sítio>'], [fs.realpathSync(os.tmpdir()), '<tmp>'], [os.tmpdir(), '<tmp>'], [os.homedir(), '~']];
  let t = saida;
  for (const [de, para] of troca) t = t.split(de).join(para);
  return t.replace(/\x1b\[[0-9;]*m/g, '').split('\n').filter((l) => l.trim()).slice(-25);
}
/** O último passo da cadeia que correu, pela linha que o npm escreve antes de cada um. @param {string} saida */
const ultimoPasso = (saida) => (saida.match(/> o-estado-do-pais@[^\n]*\n> ([^\n]+)/g) ?? []).slice(-1)[0]?.split('\n')[1]?.replace(/^> /, '') ?? null;

const registo = /** @type {any} */ ({
  o_que_e: 'Um valor revisto numa cópia do livro-razão, construído na cabeça de partida e na cabeça do bloco PP1, com duas revisões.',
  comando: 'node design/especime-v3/medicoes/pp1-2026-09-28/valor-revisto.mjs <cabeça de partida> <cabeça do bloco>',
  linha: LINHA, valor_publicado: PUBLICADO.valor, revisoes: REVISOES,
  partida: {}, bloco_A: {}, bloco_B: {},
});
/* 1 · A CABEÇA DE PARTIDA, com a revisão A: a cadeia inteira, que para no Astro, onde a leitura prendia os valores. */
{
  const dir = copia(partida, REVISOES.A);
  try {
    const r = corre(dir, ['npm', 'run', 'build']);
    const erro = /B1 leitura do país: [^\n;]+mudou[^\n]*/.exec(r.saida)?.[0] ?? null;
    registo.partida = { cabeca: git('rev-parse', partida), revisao: 'A', comando: 'npm run build', codigo: r.codigo, segundos: r.segundos, passo: ultimoPasso(r.saida), erro, mordeu: r.codigo !== 0 && erro !== null && erro.includes(LINHA), cauda: r.codigo === 0 ? [] : cauda(r.saida, dir) };
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}
/* 2 · A CABEÇA DO BLOCO, com cada revisão: a cadeia inteira, e depois os sinais e as páginas. */
for (const nome of /** @type {const} */ (['A', 'B'])) {
  const rev = REVISOES[nome];
  const dir = copia(doBloco, rev);
  try {
    const r = corre(dir, ['npm', 'run', 'build']);
    const s = corre(dir, [process.execPath, 'scripts/sinais-da-primeira-pagina.mjs']);
    const ler = (/** @type {string} */ f) => (fs.existsSync(path.join(dir, f)) ? fs.readFileSync(path.join(dir, f), 'utf8') : '');
    const sinais = ler('.sinais/primeira-pagina.json') ? JSON.parse(ler('.sinais/primeira-pagina.json')) : null;
    const pt = ler('dist/index.html');
    const casa = ler('dist/a-minha-casa/index.html');
    registo[`bloco_${nome}`] = {
      cabeca: git('rev-parse', doBloco), revisao: nome, comando: 'npm run build', codigo: r.codigo, segundos: r.segundos, passo: ultimoPasso(r.saida), cauda: r.codigo === 0 ? [] : cauda(r.saida, dir),
      sinais: { comando: 'node scripts/sinais-da-primeira-pagina.mjs', codigo: s.codigo, blocos_mostrados: sinais?.blocos_mostrados ?? null, saidas: sinais?.saidas ?? null },
      primeira_pagina: { blocos: (pt.match(/data-bloco="[a-z-]+"/g) ?? []).length, peca_dos_precos_das_casas_presente: pt.includes('data-bloco-peca="precos-das-casas"') },
      /* O valor revisto chega ao cartão da entrada da casa, com o seu recibo. */
      valor_da_planta_no_cartao_da_entrada_da_casa: casa.includes(`data-claim="${LINHA}"`) && casa.includes(`>${rev.valor}<`),
    };
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}
const A = registo.bloco_A, B = registo.bloco_B;
registo.bloco_A.passou = A.codigo === 0 && A.sinais.codigo === 0 && A.sinais.saidas?.length === 0 && A.primeira_pagina.peca_dos_precos_das_casas_presente && A.valor_da_planta_no_cartao_da_entrada_da_casa;
registo.bloco_B.a_peca_saiu_com_o_sinal = B.sinais.codigo === 0 && Boolean(B.sinais.saidas?.some((/** @type {any} */ x) => x.bloco === 'casa' && x.peca === 'precos-das-casas')) && !B.primeira_pagina.peca_dos_precos_das_casas_presente;
fs.writeFileSync(path.join(AQUI, 'valor-revisto.json'), JSON.stringify(registo, null, 2) + '\n');
console.log(JSON.stringify({ partida: { codigo: registo.partida.codigo, mordeu: registo.partida.mordeu }, bloco_A: { codigo: A.codigo, passou: A.passou }, bloco_B: { codigo: B.codigo, passo: B.passo, a_peca_saiu_com_o_sinal: B.a_peca_saiu_com_o_sinal } }));
if (!registo.partida.mordeu || !A.passou || !B.a_peca_saiu_com_o_sinal) process.exitCode = 1;
