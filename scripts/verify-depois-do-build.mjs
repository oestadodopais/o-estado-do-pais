#!/usr/bin/env node
/**
 * =============================================================================
 * O VERIFY DEPOIS DO BUILD · bloco CI1, 28.09.2026
 * =============================================================================
 *
 * O QUE FAZ. Corre, sobre o `dist/` que o `npm run build` acabou de fazer, as
 * conferências do `npm run verify` que o `build` não correu com o mesmo
 * comando, lado a lado, e fecha com três células. É o que a corrida «portão»
 * corre depois do `build`, no lugar do `npm run verify` inteiro.
 *
 * PORQUÊ. O `verify` tinha 33 passos, e 17 deles eram exatamente os mesmos
 * comandos que o `build` acabara de correr, na mesma árvore e sobre o mesmo
 * `dist/` (o §0 do brief CI1, medido por `design/observatorio/medidas/BRIEF-CI1.py`):
 * na corrida de `main` de 28.09.2026 eram 3,0 minutos a conferir outra vez o que
 * já estava conferido, e as três conferências mais lentas corriam em série. O
 * `npm run verify` que se corre à mão não muda: continua a ser a cadeia inteira.
 *
 * AS DUAS CADEIAS LEEM-SE DO `package.json`, e não de uma lista escrita aqui:
 * um passo do `verify` que não seja, carácter a carácter, um passo do `build`
 * corre aqui. Uma conferência nova que entre no `verify` entra sozinha.
 *
 * AS TRÊS CÉLULAS, cada uma com a sua leitura e nenhuma a confiar na escolha:
 *
 *   U  a união. Cada passo do `verify` é um passo do `build` ou correu aqui e
 *      saiu com 0. Lê as duas cadeias com um leitor próprio (não chama
 *      `restantesDoVerify()`) e lê o que correu no registo dos processos
 *      lançados, e não na lista que a escolha devolveu: uma conferência que a
 *      escolha deixasse cair, por engano ou por mão, fecha a corrida.
 *   D  o que as conferências leem não foi escrito enquanto elas corriam. Antes
 *      de a primeira começar e depois de a última acabar, lê-se de cada
 *      ficheiro de `dist/` o sha256, a hora de escrita (em nanossegundos), o
 *      inode e o tamanho, e de cada ficheiro da árvore que o `git` segue a hora
 *      de escrita, o inode e o tamanho. Uma conferência que escrevesse num
 *      desses ficheiros mudava o que as outras, ao lado, estavam a ler, e
 *      fecha a corrida com o ficheiro nomeado, MESMO QUE O TENHA REPOSTO: os
 *      bytes voltam, a hora de escrita não (passagem CI1b, 28.09.2026, achado 6
 *      da leitura a frio). O que a D não vê, e diz-se: uma escrita que reponha
 *      também a hora de escrita no mesmo inode (`utimes`), que é apagar o rasto
 *      de propósito; e o que se escreve fora de `dist/` e dos ficheiros
 *      seguidos (as pastas temporárias de cada conferência, que têm nome
 *      único, e as pastas ignoradas, como `design-system/`). A hora de mudança
 *      do inode (`ctime`) apanharia também a primeira, e não serve: o
 *      `check:palavras` copia `dist/` com ligações duras, e cada ligação nova
 *      muda o `ctime` de cada ficheiro sem lhe tocar no conteúdo.
 *   C  a construção é desta cabeça. `dist/version.json` e `dist/prova.json`
 *      dizem o commit que o `git` diz, e `dist/prova.json` e `dist/cadeia.json`
 *      foram escritos depois do carimbo desta construção (a hora de escrita de
 *      cada um é igual ou posterior ao `construido_em` do `version.json`, com
 *      dois segundos de folga pelo relógio grosso com que o Linux data as
 *      escritas): o `gate:html` só escreve a prova quando passa, o
 *      `check:cadeia` só escreve a cadeia quando passa, e os dois correm no
 *      `build` depois do carimbo. O `cadeia.json` não traz o commit, e é pela
 *      hora de escrita que se lhe prova a cabeça (achado 7). Um `dist/` velho,
 *      ou um ficheiro de prova de outra construção, não se confere como se
 *      fosse de hoje.
 *
 * O CONHECIDO-POSITIVO CORRE PRIMEIRO, em cada corrida e em cerca de um
 * segundo: numa cadeia sintética, numa pasta temporária, doze plantas têm de
 * morder (uma conferência nova só no `verify` corre; uma tirada da escolha
 * fecha a U; uma vermelha fecha a corrida e as outras acabam na mesma; uma que
 * escreve no `dist/` fecha a D; uma que escreve no `dist/` e repõe os bytes
 * fecha a D; uma que troca um ficheiro do `dist/` por uma cópia com os mesmos
 * bytes e a mesma hora de escrita fecha a D; uma que escreve um ficheiro
 * seguido da árvore e o repõe fecha a D; um `dist/` de outra cabeça fecha a C; um `cadeia.json` de outra
 * construção fecha a C; um passo vazio não passa pela contagem; uma
 * conferência que escreve na árvore corre sozinha depois do grupo) e a cadeia
 * limpa tem de passar. Se uma planta não morder, a corrida fecha antes de
 * lançar uma única conferência.
 *
 * O QUE CORRE AO MESMO TEMPO, E PORQUE PODE. Medido pelo bloco CI1 com uma
 * sonda em cada processo (`design/especime-v3/medicoes/ci1-2026-09-28/`): as
 * conferências que abrem um servidor pedem uma porta efémera (`listen(0)`),
 * as que abrem um Chromium abrem cada uma o seu, e as que escrevem fazem-no em
 * pastas temporárias com nome único (`mkdtemp`), menos uma: o `design:feixe`
 * apaga e refaz `design-system/`, na árvore. Nenhuma escreve em `dist/` nem
 * num ficheiro que o `git` segue, e a célula D prova-o em cada corrida. As
 * outras correm num fundo de `--paralelo` processos (por omissão, os núcleos
 * da máquina), as mais lentas primeiro; as que escrevem na árvore correm
 * depois, sozinhas, uma de cada vez (`DEPOIS_DO_GRUPO`). A sonda da passagem
 * CI1b regista também as leituras e não viu nenhuma outra conferência ler
 * `design-system/`; correr o feixe depois do grupo não depende disso.
 *
 * O QUE NÃO FAZ. Não guarda resultado nenhum de uma corrida para outra, não
 * salta conferência nenhuma por caminho de ficheiros, e não para as outras
 * quando uma cai: todas acabam, e o relatório diz todas as vermelhas de uma vez.
 *
 * Uso:  node scripts/verify-depois-do-build.mjs [--paralelo N] [--json <ficheiro>]
 *       node scripts/verify-depois-do-build.mjs --prova      (só as plantas)
 *       node scripts/verify-depois-do-build.mjs --a-seco     (diz o que correria)
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* AS MAIS LENTAS PRIMEIRO, pelos tempos da corrida de `main` de 28.09.2026 (a
   36412381787, lidos no registo pelo bloco CI1). É mobília: só muda a ordem em
   que as conferências começam, e uma conferência que não esteja aqui corre na
   mesma, pela ordem do `verify`, depois destas. */
const MAIS_LENTAS_PRIMEIRO = [
  'npm run check:alvos',
  'npm run check:palavras',
  'npm run check:moldura',
  'npm run check:lugar',
  'npm run check:indice',
  'npm run check:cartao',
  'npm run check:cabeca',
  'npm run check:css',
  'npm run check:alcance',
];

/* AS QUE ESCREVEM NA ÁRVORE CORREM DEPOIS DO GRUPO, sozinhas, uma de cada vez
   (passagem CI1b, 28.09.2026, achado 6 da leitura a frio). Medido pelo
   inventário do bloco: o `design:feixe` é a única conferência do `verify` que
   escreve fora de `dist/` e das pastas temporárias com nome único (apaga e
   refaz `design-system/`). Uma conferência nova que escreva na árvore entra
   aqui quando o inventário a vir; até lá, se escrever num ficheiro que o
   `git` segue, a célula D fecha a corrida. */
export const DEPOIS_DO_GRUPO = ['npm run design:feixe'];

/* ------------------------------------------------------------------ a escolha */

/** Os passos de uma cadeia do `package.json`, partidos em `&&`, como o §0 do brief. */
export function passosDe(cadeia) {
  return String(cadeia ?? '')
    .split('&&')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Os passos do `verify` que não são, carácter a carácter, um passo do `build`. */
export function restantesDoVerify(scripts) {
  const doBuild = new Set(passosDe(scripts.build));
  return passosDe(scripts.verify).filter((p) => !doBuild.has(p));
}

/**
 * A ordem de arranque: no grupo, as mais lentas primeiro e as outras pela
 * ordem do `verify`; depois do grupo, as que escrevem na árvore, pela ordem do
 * `verify`.
 * @param {string[]} restantes @param {string[]} depoisDoGrupo
 */
function ordemDeArranque(restantes, depoisDoGrupo = DEPOIS_DO_GRUPO) {
  const depois = restantes.filter((p) => depoisDoGrupo.includes(p));
  const grupo = restantes.filter((p) => !depois.includes(p));
  const primeiro = MAIS_LENTAS_PRIMEIRO.filter((p) => grupo.includes(p));
  return { grupo: [...primeiro, ...grupo.filter((p) => !primeiro.includes(p))], depois };
}

/* ------------------------------------------------------------------ as células */

/**
 * U · A UNIÃO. Leitor próprio das duas cadeias (uma expressão regular, e não
 * `passosDe()`), e o que correu lido do registo dos processos lançados.
 * @param {{build?: string, verify?: string}} scripts
 * @param {{passo: string, codigo: number|null}[]} corridos
 */
export function celulaDaUniao(scripts, corridos) {
  const parte = (s) => String(s ?? '').split(/\s*&&\s*/).map((x) => x.trim()).filter((x) => x.length > 0);
  const verify = parte(scripts.verify);
  const build = new Set(parte(scripts.build));
  /* A contagem por outra via: tantos passos quantos `&&` mais um. Um leitor
     que perdesse um passo pelo caminho não passa daqui. */
  const esperados = (String(scripts.verify ?? '').match(/&&/g) ?? []).length + 1;
  const falhas = [];
  if (verify.length === 0) falhas.push('U: o verify do package.json não tem passos');
  if (verify.length !== esperados) falhas.push(`U: o verify tem ${esperados} passos pelos &&, e o leitor leu ${verify.length}`);
  const verdes = new Set(corridos.filter((c) => c.codigo === 0).map((c) => c.passo));
  const vermelhos = new Set(corridos.filter((c) => c.codigo !== 0).map((c) => c.passo));
  let doBuild = 0;
  let daqui = 0;
  for (const p of verify) {
    if (build.has(p)) doBuild++;
    else if (verdes.has(p)) daqui++;
    else if (vermelhos.has(p)) falhas.push(`U: «${p}» correu e não saiu com 0`);
    else falhas.push(`U: «${p}» está no verify, não é um passo do build e não correu aqui`);
  }
  return { ok: falhas.length === 0, falhas, passos_do_verify: verify.length, cobertos_pelo_build: doBuild, corridos_aqui: daqui };
}

/**
 * O estado de um ficheiro: a hora de escrita em nanossegundos, o inode e o
 * tamanho, e o sha256 quando `comResumo`. Lido sem seguir ligações.
 * @param {string} p @param {boolean} comResumo
 */
function estadoDoFicheiro(p, comResumo) {
  let st;
  try {
    st = fs.lstatSync(p, { bigint: true });
  } catch {
    return null;
  }
  const e = { escrito: String(st.mtimeNs), inode: String(st.ino), tamanho: String(st.size) };
  if (st.isSymbolicLink()) return { ...e, resumo: `ligacao:${fs.readlinkSync(p)}` };
  if (comResumo && st.isFile()) return { ...e, resumo: crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex') };
  return e;
}

/** Cada ficheiro de uma pasta, com o seu estado e o sha256, por caminho relativo. */
function estadoDaPasta(pasta) {
  const mapa = new Map();
  const anda = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) anda(p);
      else mapa.set(path.relative(pasta, p), estadoDoFicheiro(p, true));
    }
  };
  anda(pasta);
  return mapa;
}

/** Os ficheiros que o `git` segue, com o seu estado (sem o sha256: a hora de escrita basta). */
function estadoDaArvore(raiz, lista) {
  const mapa = new Map();
  for (const rel of lista) mapa.set(rel, estadoDoFicheiro(path.join(raiz, rel), false));
  return mapa;
}

/** Os ficheiros que o `git` segue, pela lista do próprio `git`; `null` se ele não a der. */
function ficheirosSeguidos(raiz) {
  try {
    return execFileSync('git', ['ls-files', '-z'], { cwd: raiz, encoding: 'utf8', maxBuffer: 64 * 2 ** 20, stdio: ['ignore', 'pipe', 'ignore'] })
      .split('\0')
      .filter(Boolean);
  } catch {
    return null;
  }
}

/**
 * D · O QUE AS CONFERÊNCIAS LEEM NÃO FOI ESCRITO ENQUANTO ELAS CORRIAM.
 * @param {{dist: Map<string, any>, arvore: Map<string, any>|null}} antes
 * @param {{dist: Map<string, any>, arvore: Map<string, any>|null}} depois
 */
export function celulaDoDist(antes, depois) {
  const falhas = [];
  /** @param {Map<string, any>} a @param {Map<string, any>} b @param {string} onde */
  const compara = (a, b, onde) => {
    for (const [k, x] of a) {
      const y = b.get(k);
      if (x === null && (y === null || y === undefined)) continue;
      if (y === null || y === undefined) falhas.push(`D: ${onde}${k} desapareceu durante as conferências`);
      else if (x === null) falhas.push(`D: ${onde}${k} apareceu durante as conferências`);
      else if (x.resumo !== undefined && x.resumo !== y.resumo) falhas.push(`D: ${onde}${k} mudou de bytes durante as conferências`);
      else if (x.inode !== y.inode) falhas.push(`D: ${onde}${k} foi substituído por outro ficheiro durante as conferências (o inode mudou)`);
      else if (x.escrito !== y.escrito || x.tamanho !== y.tamanho) falhas.push(`D: ${onde}${k} foi escrito durante as conferências (os bytes podem ter voltado, a hora de escrita não)`);
    }
    for (const k of b.keys()) if (!a.has(k)) falhas.push(`D: ${onde}${k} apareceu durante as conferências`);
  };
  compara(antes.dist, depois.dist, 'dist/');
  if (antes.arvore === null || depois.arvore === null) falhas.push('D: o git não listou os ficheiros da árvore, e a árvore ficou por conferir');
  else compara(antes.arvore, depois.arvore, '');
  return {
    ok: falhas.length === 0,
    falhas: falhas.slice(0, 20),
    diferencas: falhas.length,
    ficheiros: antes.dist.size,
    ficheiros_da_arvore: antes.arvore?.size ?? null,
  };
}

/** C · A CONSTRUÇÃO É DESTA CABEÇA. */
export function celulaDaCabeca(dist, cabeca) {
  const falhas = [];
  const le = (f) => {
    try {
      return JSON.parse(fs.readFileSync(path.join(dist, f), 'utf8'));
    } catch {
      return null;
    }
  };
  if (!cabeca) falhas.push('C: o git não disse a cabeça desta árvore');
  const versao = le('version.json');
  const prova = le('prova.json');
  if (!versao) falhas.push('C: não há dist/version.json (o stamp:version do build não correu)');
  else if (versao.commit !== cabeca) falhas.push(`C: dist/version.json é de ${versao.commit} e a árvore está em ${cabeca}`);
  if (!prova) falhas.push('C: não há dist/prova.json (o gate:html do build não passou)');
  else if (prova.commit !== cabeca) falhas.push(`C: dist/prova.json é de ${prova.commit} e a árvore está em ${cabeca}`);
  if (!fs.existsSync(path.join(dist, 'cadeia.json'))) falhas.push('C: não há dist/cadeia.json (o check:cadeia do build não passou)');
  /* A HORA DE ESCRITA DOS DOIS FICHEIROS DE PROVA, contra o carimbo desta
     construção: os dois escrevem-se no `build` depois do `stamp:version`. */
  const carimbo = Date.parse(String(versao?.construido_em ?? ''));
  const horas = {};
  if (Number.isNaN(carimbo)) falhas.push('C: dist/version.json não diz quando a construção foi carimbada (construido_em)');
  else {
    for (const f of ['prova.json', 'cadeia.json']) {
      let escrito = null;
      try {
        escrito = fs.statSync(path.join(dist, f)).mtimeMs;
      } catch {
        continue;
      }
      horas[f] = new Date(escrito).toISOString();
      if (escrito < carimbo - FOLGA_DO_RELOGIO_MS) {
        falhas.push(`C: dist/${f} foi escrito a ${new Date(escrito).toISOString()}, antes do carimbo desta construção (${versao.construido_em}): é de outra construção`);
      }
    }
  }
  return { ok: falhas.length === 0, falhas, cabeca, carimbo: versao?.construido_em ?? null, escritos: horas };
}

/* A FOLGA DO RELÓGIO: o Linux data as escritas com um relógio grosso, que pode
   ficar alguns milissegundos atrás do que o `Date` do Node leu um pouco antes.
   Dois segundos cobrem-no com margem; uma prova de outra construção é mais
   velha do que uma construção inteira. */
const FOLGA_DO_RELOGIO_MS = 2000;

/* ------------------------------------------------------------------ o motor */

/**
 * Corre os passos num fundo de `paralelo` processos. Cada passo corre como o
 * `npm run verify` o correria: `sh -c <passo>`, na raiz, com o ambiente de quem
 * chama. A saída de cada um guarda-se e escreve-se inteira quando ele acaba,
 * para o registo não ficar às fatias.
 */
async function correPassos(passos, { raiz, paralelo, escreve, fase = 'grupo', t0 = Date.now() }) {
  const corridos = [];
  const fila = [...passos];
  const noCi = process.env.GITHUB_ACTIONS === 'true';
  async function trabalhador() {
    while (fila.length > 0) {
      const passo = fila.shift();
      const inicio = Date.now();
      escreve(`▶ ${passo} · começou aos ${((inicio - t0) / 1000).toFixed(1)} s${fase === 'depois' ? ', depois do grupo, sozinho' : ''}\n`);
      const registo = { passo, fase, codigo: /** @type {number|null} */ (null), segundos: 0, inicio_s: (inicio - t0) / 1000, fim_s: 0, saida: '' };
      corridos.push(registo);
      const partes = [];
      const codigo = await new Promise((resolve) => {
        const filho = spawn('sh', ['-c', passo], { cwd: raiz, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] });
        filho.stdout.on('data', (d) => partes.push(d));
        filho.stderr.on('data', (d) => partes.push(d));
        filho.on('error', (e) => {
          partes.push(Buffer.from(`\n(não arrancou: ${e.message})\n`));
          resolve(127);
        });
        filho.on('close', (c, sinal) => resolve(c ?? (sinal ? 128 : 1)));
      });
      registo.codigo = codigo;
      registo.segundos = (Date.now() - inicio) / 1000;
      registo.fim_s = (Date.now() - t0) / 1000;
      registo.saida = Buffer.concat(partes).toString('utf8');
      const cabecalho = `${codigo === 0 ? '✓' : '✗'} ${passo} · ${registo.segundos.toFixed(1)} s · código ${codigo}`;
      if (noCi && codigo === 0) escreve(`::group::${cabecalho}\n${registo.saida}\n::endgroup::\n`);
      else if (noCi) escreve(`::error::${cabecalho}\n${cabecalho}\n${registo.saida}\n`);
      else escreve(`${cabecalho}\n${registo.saida.replace(/^/gm, '    ')}\n`);
    }
  }
  const n = Math.max(1, Math.min(paralelo, passos.length));
  await Promise.all(Array.from({ length: n }, trabalhador));
  return corridos;
}

/**
 * Uma corrida inteira: a escolha, o estado antes, o grupo lado a lado, as que
 * escrevem na árvore sozinhas, o estado depois, e as três células.
 * @param {{raiz: string, scripts: {build?: string, verify?: string}, dist: string, cabeca: string|null,
 *   paralelo: number, escolher?: (s: object) => string[], escreve?: (s: string) => void,
 *   depoisDoGrupo?: string[], arvore?: () => string[]|null}} o
 */
export async function correr(o) {
  const escolher = o.escolher ?? restantesDoVerify;
  const escreve = o.escreve ?? ((s) => process.stdout.write(s));
  if (!fs.existsSync(o.dist)) {
    return { ok: false, corridos: [], celulas: { U: null, D: null, C: { ok: false, falhas: [`C: não existe ${path.basename(o.dist)}/. Corra o build primeiro.`] } } };
  }
  const { grupo, depois: sozinhas } = ordemDeArranque(escolher(o.scripts), o.depoisDoGrupo ?? DEPOIS_DO_GRUPO);
  const listaDaArvore = (o.arvore ?? (() => ficheirosSeguidos(o.raiz)))();
  const retrato = () => ({ dist: estadoDaPasta(o.dist), arvore: listaDaArvore === null ? null : estadoDaArvore(o.raiz, listaDaArvore) });
  const antes = retrato();
  const t0 = Date.now();
  const doGrupo = await correPassos(grupo, { raiz: o.raiz, paralelo: o.paralelo, escreve, t0 });
  const depoisDoGrupo = await correPassos(sozinhas, { raiz: o.raiz, paralelo: 1, escreve, fase: 'depois', t0 });
  const corridos = [...doGrupo, ...depoisDoGrupo];
  const depois = retrato();
  const U = celulaDaUniao(o.scripts, corridos);
  const D = celulaDoDist(antes, depois);
  const C = celulaDaCabeca(o.dist, o.cabeca);
  const vermelhos = corridos.filter((c) => c.codigo !== 0).map((c) => c.passo);
  return { ok: U.ok && D.ok && C.ok && vermelhos.length === 0, corridos, vermelhos, celulas: { U, D, C } };
}

/* ------------------------------------------------------------------ as plantas */

/**
 * O CONHECIDO-POSITIVO: uma cadeia sintética numa pasta temporária, com um
 * `dist/` de brincar e passos de uma linha de `node`. Cada planta tem de
 * morder pelo motivo certo, e a cadeia limpa tem de passar.
 */
export async function plantas() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'oedp-verify-depois-'));
  const node = JSON.stringify(process.execPath);
  const marca = (nome) => `${node} -e "require('fs').writeFileSync(require('path').join('marcas','${nome}'),'')"`;
  const dist = path.join(base, 'dist');
  const cabeca = 'c'.repeat(40);
  const fonte = path.join(base, 'fonte.txt');
  const prepara = (commit = cabeca) => {
    fs.rmSync(dist, { recursive: true, force: true });
    fs.rmSync(path.join(base, 'marcas'), { recursive: true, force: true });
    fs.mkdirSync(path.join(base, 'marcas'), { recursive: true });
    fs.mkdirSync(path.join(dist, 'x'), { recursive: true });
    fs.writeFileSync(path.join(dist, 'x', 'index.html'), '<p>uma página</p>\n');
    const construidoEm = new Date(Date.now() - 60_000).toISOString();
    fs.writeFileSync(path.join(dist, 'version.json'), JSON.stringify({ commit, construido_em: construidoEm }));
    fs.writeFileSync(path.join(dist, 'prova.json'), JSON.stringify({ commit, construido_em: construidoEm }));
    fs.writeFileSync(path.join(dist, 'cadeia.json'), '{}');
    fs.writeFileSync(fonte, 'uma fonte que o git seguiria\n');
    /* A hora de escrita da fonte fica no passado, para uma escrita a meio da
       corrida a mudar de certeza, mesmo num relógio grosso. */
    const passado = new Date(Date.now() - 3_600_000);
    fs.utimesSync(fonte, passado, passado);
    fs.utimesSync(path.join(dist, 'x', 'index.html'), passado, passado);
  };
  /* Um passo que espera antes de deixar a marca, para a ordem ser visível. */
  const marcaDevagar = (nome, ms) => `${node} -e "setTimeout(()=>require('fs').writeFileSync(require('path').join('marcas','${nome}'),''),${ms})"`;
  /* Um passo que só passa se todas as do grupo já tiverem acabado. */
  const soDepoisDe = (nomes, marcaFinal) =>
    `${node} -e "const fs=require('fs'),p=require('path');if(!${JSON.stringify(nomes).replace(/"/g, "'")}.every(n=>fs.existsSync(p.join('marcas',n))))process.exit(4);fs.writeFileSync(p.join('marcas','${marcaFinal}'),'')"`;
  /* Um passo que escreve um ficheiro e o repõe com os mesmos bytes. */
  const escreveERepoe = (rel) =>
    `${node} -e "const fs=require('fs');const f=${JSON.stringify(rel).replace(/"/g, "'")};const o=fs.readFileSync(f);fs.writeFileSync(f,Buffer.concat([o,Buffer.from('!')]));fs.writeFileSync(f,o)"`;
  const build = [marca('b1'), marca('b2')].join(' && ');
  const limpa = { build, verify: [marca('b1'), marca('v1'), marca('b2'), marca('v2')].join(' && ') };
  const casos = [];
  const silencio = () => {};
  const corre = (scripts, extra = {}) =>
    correr({ raiz: base, scripts, dist, cabeca, paralelo: 2, escreve: silencio, depoisDoGrupo: [], arvore: () => ['fonte.txt'], ...extra });
  const existe = (nome) => fs.existsSync(path.join(base, 'marcas', nome));
  try {
    prepara();
    let r = await corre(limpa);
    casos.push({ planta: 'a cadeia limpa passa, e o que o build já correu não corre outra vez', mordeu: r.ok && existe('v1') && existe('v2') && !existe('b1') && !existe('b2') && r.celulas.U.cobertos_pelo_build === 2 && r.celulas.U.corridos_aqui === 2 });

    prepara();
    r = await corre({ build, verify: `${limpa.verify} && ${marca('nova')}` });
    casos.push({ planta: 'uma conferência nova só no verify corre sozinha', mordeu: r.ok && existe('nova') && r.celulas.U.corridos_aqui === 3 });

    prepara();
    r = await corre(limpa, { escolher: (s) => restantesDoVerify(s).filter((p) => !p.includes("'v2'")) });
    casos.push({ planta: 'uma conferência tirada da escolha fecha a célula U', mordeu: !r.ok && !existe('v2') && r.celulas.U.falhas.some((f) => f.includes("'v2'") && f.includes('não correu aqui')) });

    prepara();
    r = await corre({ build, verify: `${limpa.verify} && ${node} -e "process.exit(3)"` });
    casos.push({ planta: 'uma conferência vermelha fecha a corrida, e as outras acabam', mordeu: !r.ok && r.vermelhos.length === 1 && r.corridos.find((c) => c.codigo !== 0)?.codigo === 3 && existe('v1') && existe('v2') && r.celulas.U.falhas.some((f) => f.includes('não saiu com 0')) });

    prepara();
    r = await corre({ build, verify: `${limpa.verify} && ${node} -e "require('fs').appendFileSync('dist/x/index.html','!')"` });
    casos.push({ planta: 'uma conferência que escreve no dist/ fecha a célula D', mordeu: !r.ok && r.celulas.D.falhas.some((f) => f.includes('x/index.html') && f.includes('mudou')) });

    prepara('d'.repeat(40));
    r = await corre(limpa);
    casos.push({ planta: 'um dist/ de outra cabeça fecha a célula C', mordeu: !r.ok && r.celulas.C.falhas.some((f) => f.includes('version.json')) && r.celulas.C.falhas.some((f) => f.includes('prova.json')) });

    prepara();
    r = await corre({ build, verify: limpa.verify.replace(/ && /, ' &&  && ') });
    casos.push({ planta: 'um passo vazio na cadeia não passa despercebido à contagem', mordeu: !r.ok && r.celulas.U.falhas.some((f) => f.includes('passos pelos &&')) });

    prepara();
    r = await corre({ build, verify: `${limpa.verify} && ${escreveERepoe('dist/x/index.html')}` });
    casos.push({ planta: 'uma conferência que escreve no dist/ e repõe os bytes fecha a célula D', mordeu: !r.ok && r.celulas.D.falhas.some((f) => f.includes('dist/x/index.html') && f.includes('foi escrito')) });

    prepara();
    /* H2, I194: os && da redação anterior eram separadores de CONFERÊNCIAS.
       cp, touch e mv podiam correr em paralelo, e não na ordem escrita.
       Um só processo executa agora as três operações síncronas. `touch -r`
       conserva os nanossegundos que um Date do JavaScript arredondaria.
       A planta mede as suas premissas e exige a mordida pelo inode, não
       apenas um vermelho provocado por uma operação que não chegou a correr. */
    fs.writeFileSync(path.join(base, 'trocar.cjs'), `
      const fs = require('node:fs');
      const { execFileSync } = require('node:child_process');
      fs.copyFileSync('dist/x/index.html', 'dist/x/.copia');
      execFileSync('touch', ['-r', 'dist/x/index.html', 'dist/x/.copia']);
      fs.renameSync('dist/x/.copia', 'dist/x/index.html');
    `);
    const antesDaTroca = estadoDoFicheiro(path.join(dist, 'x/index.html'), true);
    const passoDaTroca = `${node} trocar.cjs`;
    r = await corre({ build, verify: `${limpa.verify} && ${passoDaTroca}` });
    const depoisDaTroca = estadoDoFicheiro(path.join(dist, 'x/index.html'), true);
    const trocas = r.corridos.filter(c => c.passo === passoDaTroca);
    const premissas = antesDaTroca.resumo === depoisDaTroca.resumo
      && antesDaTroca.escrito === depoisDaTroca.escrito
      && antesDaTroca.inode !== depoisDaTroca.inode;
    casos.push({ planta: 'uma conferência que troca um ficheiro do dist/ por uma cópia com os mesmos bytes e a mesma hora de escrita fecha a célula D',
      antes: antesDaTroca, depois: depoisDaTroca, passos_da_troca: trocas.length,
      codigo_da_troca: trocas[0]?.codigo, falhas: r.celulas.D.falhas,
      mordeu: premissas && trocas.length === 1 && trocas[0].codigo === 0
        && !r.ok && r.celulas.D.falhas.some((f) => f.includes('dist/x/index.html') && f.includes('substituído')) });

    prepara();
    r = await corre({ build, verify: `${limpa.verify} && ${escreveERepoe('fonte.txt')}` });
    casos.push({ planta: 'uma conferência que escreve um ficheiro seguido da árvore e o repõe fecha a célula D', mordeu: !r.ok && r.celulas.D.falhas.some((f) => f.startsWith('D: fonte.txt') && f.includes('foi escrito')) });

    prepara();
    {
      const velho = new Date(Date.now() - 3_600_000);
      fs.utimesSync(path.join(dist, 'cadeia.json'), velho, velho);
    }
    r = await corre(limpa);
    casos.push({ planta: 'um cadeia.json de outra construção fecha a célula C', mordeu: !r.ok && r.celulas.C.falhas.some((f) => f.includes('cadeia.json') && f.includes('antes do carimbo')) && !r.celulas.C.falhas.some((f) => f.includes('prova.json')) });

    prepara();
    {
      const comFeixe = { build, verify: `${marca('b1')} && ${marcaDevagar('v1', 400)} && ${marca('b2')} && ${marca('v2')} && ${soDepoisDe(['v1', 'v2'], 'feixe')}` };
      const passoDoFeixe = comFeixe.verify.split(' && ').at(-1);
      r = await corre(comFeixe, { depoisDoGrupo: [passoDoFeixe] });
      const feixe = r.corridos.find((c) => c.passo === passoDoFeixe);
      const fimDoGrupo = Math.max(...r.corridos.filter((c) => c.fase === 'grupo').map((c) => c.fim_s));
      casos.push({ planta: 'uma conferência que escreve na árvore corre sozinha, depois do grupo', mordeu: r.ok && existe('feixe') && feixe?.fase === 'depois' && feixe.inicio_s >= fimDoGrupo });
    }
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
  return { ok: casos.every((c) => c.mordeu), casos };
}

/* ------------------------------------------------------------------ a corrida */

async function principal() {
  const args = process.argv.slice(2);
  const valor = (nome) => (args.includes(nome) ? args[args.indexOf(nome) + 1] : null);
  const paralelo = Number(valor('--paralelo') ?? (os.availableParallelism?.() ?? os.cpus().length));
  const json = valor('--json');
  if (!Number.isInteger(paralelo) || paralelo < 1) {
    console.error('--paralelo precisa de um inteiro positivo');
    process.exit(2);
  }

  const t0 = Date.now();
  const p = await plantas();
  for (const c of p.casos) console.log(`  ${c.mordeu ? '✓' : '✗'} planta · ${c.planta}`);
  if (!p.ok) {
    console.error('\n  VERIFY DEPOIS DO BUILD · uma planta não mordeu: as células não provam o que dizem. Nenhuma conferência correu.\n');
    process.exit(1);
  }
  console.log(`  as ${p.casos.length} plantas morderam em ${((Date.now() - t0) / 1000).toFixed(1)} s\n`);
  if (args.includes('--prova')) {
    if (json) fs.writeFileSync(json, JSON.stringify(p, null, 2) + '\n');
    process.exit(0);
  }

  const scripts = JSON.parse(fs.readFileSync(path.join(RAIZ, 'package.json'), 'utf8')).scripts ?? {};
  if (args.includes('--a-seco')) {
    const { grupo, depois } = ordemDeArranque(restantesDoVerify(scripts));
    const n = passosDe(scripts.verify).length;
    console.log(`${n} passos no verify, ${n - grupo.length - depois.length} já corridos pelo build, ${grupo.length + depois.length} a correr aqui:`);
    for (const r of grupo) console.log(`  lado a lado  ${r}`);
    for (const r of depois) console.log(`  depois, só   ${r}`);
    process.exit(0);
  }
  let cabeca = null;
  try {
    cabeca = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: RAIZ, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    cabeca = null;
  }
  console.log(`  ${paralelo} processo(s) lado a lado · cabeça ${cabeca ?? '(não lida)'}\n`);
  const r = await correr({ raiz: RAIZ, scripts, dist: path.join(RAIZ, 'dist'), cabeca, paralelo });
  const segundos = (Date.now() - t0) / 1000;

  console.log('\n  O VERIFY DEPOIS DO BUILD');
  for (const c of [...r.corridos].sort((a, b) => b.segundos - a.segundos)) {
    console.log(`    ${c.codigo === 0 ? '✓' : '✗'} ${c.passo.padEnd(40)} ${c.segundos.toFixed(1).padStart(7)} s  código ${c.codigo}`);
  }
  const { U, D, C } = r.celulas;
  if (U) console.log(`  U ${U.ok ? '✓' : '✗'} ${U.passos_do_verify} passos no verify: ${U.cobertos_pelo_build} corridos pelo build, ${U.corridos_aqui} corridos aqui e verdes`);
  if (D) console.log(`  D ${D.ok ? '✓' : '✗'} nenhuma escrita durante as conferências nos ${D.ficheiros} ficheiros do dist/ (bytes, hora de escrita e inode) nem nos ${D.ficheiros_da_arvore ?? '(não lidos)'} ficheiros que o git segue (hora de escrita, inode e tamanho)`);
  if (C) console.log(`  C ${C.ok ? '✓' : '✗'} a construção é da cabeça ${C.cabeca ?? '(não lida)'}, carimbada a ${C.carimbo ?? '(não lido)'}; prova.json escrito a ${C.escritos?.['prova.json'] ?? '(não lido)'}, cadeia.json a ${C.escritos?.['cadeia.json'] ?? '(não lido)'}`);
  for (const f of [...(U?.falhas ?? []), ...(D?.falhas ?? []), ...(C?.falhas ?? [])]) console.error(`    ${f}`);
  console.log(`  ${segundos.toFixed(1)} s ao todo\n`);
  if (json) {
    fs.writeFileSync(json, JSON.stringify({
      cabeca, paralelo, segundos, ok: r.ok,
      plantas: p.casos,
      corridos: r.corridos.map(({ passo, fase, codigo, segundos: s, inicio_s, fim_s }) => ({ passo, fase, codigo, segundos: s, inicio_s, fim_s })),
      celulas: r.celulas,
    }, null, 1) + '\n');
  }
  if (!r.ok) {
    console.error(`  VERIFY DEPOIS DO BUILD · FECHOU${r.vermelhos?.length ? `: ${r.vermelhos.join(', ')}` : ''}\n`);
    process.exit(1);
  }
}

if (path.resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) await principal();
