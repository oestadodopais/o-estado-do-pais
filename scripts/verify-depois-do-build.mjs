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
 *   D  o `dist/` que as conferências leram é o que o `build` fez. O sha256 de
 *      cada ficheiro antes de a primeira conferência começar e depois de a
 *      última acabar: uma conferência que escrevesse em `dist/` mudava o que as
 *      outras, ao lado, estavam a ler, e fecha a corrida com o ficheiro nomeado.
 *   C  a construção é desta cabeça. `dist/version.json` e `dist/prova.json`
 *      dizem o commit que o `git` diz, e `dist/cadeia.json` existe: o
 *      `gate:html` só escreve a prova quando passa, e o `check:cadeia` só
 *      escreve a cadeia quando passa. Um `dist/` velho não se confere como se
 *      fosse de hoje.
 *
 * O CONHECIDO-POSITIVO CORRE PRIMEIRO, em cada corrida e em menos de um
 * segundo: numa cadeia sintética, numa pasta temporária, cinco plantas têm de
 * morder (uma conferência nova só no `verify` corre; uma conferência tirada da
 * escolha fecha a U; uma conferência vermelha fecha a corrida e as outras
 * acabam na mesma; uma conferência que escreve no `dist/` fecha a D; um
 * `dist/` de outra cabeça fecha a C) e uma cadeia limpa tem de passar. Se uma
 * planta não morder, a corrida fecha antes de lançar uma única conferência.
 *
 * O QUE CORRE AO MESMO TEMPO, E PORQUE PODE. Medido pelo bloco CI1 com uma
 * sonda em cada processo (`design/especime-v3/medicoes/ci1-2026-09-28/`): as
 * conferências que abrem um servidor pedem uma porta efémera (`listen(0)`),
 * as que abrem um Chromium abrem cada uma o seu, e as que escrevem fazem-no em
 * pastas temporárias com nome único (`mkdtemp`) ou na sua própria pasta
 * (`design-system/`, só do `design:feixe`). Nenhuma escreve em `dist/`, e a
 * célula D prova-o em cada corrida. Correm num fundo de `--paralelo` processos
 * (por omissão, os núcleos da máquina), as mais lentas primeiro.
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

/** A ordem de arranque: as mais lentas primeiro, as outras pela ordem do `verify`. */
function ordemDeArranque(restantes) {
  const primeiro = MAIS_LENTAS_PRIMEIRO.filter((p) => restantes.includes(p));
  return [...primeiro, ...restantes.filter((p) => !primeiro.includes(p))];
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

/** O sha256 de cada ficheiro de uma pasta, por caminho relativo. */
function resumosDe(pasta) {
  const mapa = new Map();
  const anda = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) anda(p);
      else if (e.isSymbolicLink()) mapa.set(path.relative(pasta, p), `ligacao:${fs.readlinkSync(p)}`);
      else if (e.isFile()) mapa.set(path.relative(pasta, p), crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'));
    }
  };
  anda(pasta);
  return mapa;
}

/** D · O `dist/` DEPOIS É O `dist/` ANTES, ficheiro a ficheiro. */
export function celulaDoDist(antes, depois) {
  const falhas = [];
  for (const [k, h] of antes) {
    if (!depois.has(k)) falhas.push(`D: ${k} desapareceu do dist/ durante as conferências`);
    else if (depois.get(k) !== h) falhas.push(`D: ${k} mudou durante as conferências`);
  }
  for (const k of depois.keys()) if (!antes.has(k)) falhas.push(`D: ${k} apareceu no dist/ durante as conferências`);
  return { ok: falhas.length === 0, falhas: falhas.slice(0, 20), ficheiros: antes.size, diferencas: falhas.length };
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
  return { ok: falhas.length === 0, falhas, cabeca };
}

/* ------------------------------------------------------------------ o motor */

/**
 * Corre os passos num fundo de `paralelo` processos. Cada passo corre como o
 * `npm run verify` o correria: `sh -c <passo>`, na raiz, com o ambiente de quem
 * chama. A saída de cada um guarda-se e escreve-se inteira quando ele acaba,
 * para o registo não ficar às fatias.
 */
async function correPassos(passos, { raiz, paralelo, escreve }) {
  const corridos = [];
  const fila = [...passos];
  const noCi = process.env.GITHUB_ACTIONS === 'true';
  const t0 = Date.now();
  async function trabalhador() {
    while (fila.length > 0) {
      const passo = fila.shift();
      const inicio = Date.now();
      escreve(`▶ ${passo} · começou aos ${((inicio - t0) / 1000).toFixed(1)} s\n`);
      const registo = { passo, codigo: /** @type {number|null} */ (null), segundos: 0, saida: '' };
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
 * Uma corrida inteira: a escolha, o `dist/` antes, os passos, o `dist/`
 * depois, e as três células.
 * @param {{raiz: string, scripts: {build?: string, verify?: string}, dist: string, cabeca: string|null,
 *   paralelo: number, escolher?: (s: object) => string[], escreve?: (s: string) => void}} o
 */
export async function correr(o) {
  const escolher = o.escolher ?? restantesDoVerify;
  const escreve = o.escreve ?? ((s) => process.stdout.write(s));
  if (!fs.existsSync(o.dist)) {
    return { ok: false, corridos: [], celulas: { U: null, D: null, C: { ok: false, falhas: [`C: não existe ${path.basename(o.dist)}/. Corra o build primeiro.`] } } };
  }
  const passos = ordemDeArranque(escolher(o.scripts));
  const antes = resumosDe(o.dist);
  const corridos = await correPassos(passos, { raiz: o.raiz, paralelo: o.paralelo, escreve });
  const depois = resumosDe(o.dist);
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
  const prepara = (commit = cabeca) => {
    fs.rmSync(dist, { recursive: true, force: true });
    fs.rmSync(path.join(base, 'marcas'), { recursive: true, force: true });
    fs.mkdirSync(path.join(base, 'marcas'), { recursive: true });
    fs.mkdirSync(path.join(dist, 'x'), { recursive: true });
    fs.writeFileSync(path.join(dist, 'x', 'index.html'), '<p>uma página</p>\n');
    fs.writeFileSync(path.join(dist, 'version.json'), JSON.stringify({ commit }));
    fs.writeFileSync(path.join(dist, 'prova.json'), JSON.stringify({ commit }));
    fs.writeFileSync(path.join(dist, 'cadeia.json'), '{}');
  };
  const build = [marca('b1'), marca('b2')].join(' && ');
  const limpa = { build, verify: [marca('b1'), marca('v1'), marca('b2'), marca('v2')].join(' && ') };
  const casos = [];
  const silencio = () => {};
  const corre = (scripts, extra = {}) => correr({ raiz: base, scripts, dist, cabeca, paralelo: 2, escreve: silencio, ...extra });
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
  if (args.includes('--prova')) process.exit(0);

  const scripts = JSON.parse(fs.readFileSync(path.join(RAIZ, 'package.json'), 'utf8')).scripts ?? {};
  if (args.includes('--a-seco')) {
    const restantes = ordemDeArranque(restantesDoVerify(scripts));
    console.log(`${passosDe(scripts.verify).length} passos no verify, ${passosDe(scripts.verify).length - restantes.length} já corridos pelo build, ${restantes.length} a correr aqui:`);
    for (const r of restantes) console.log(`  ${r}`);
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
  if (D) console.log(`  D ${D.ok ? '✓' : '✗'} o dist/ tem os mesmos ${D.ficheiros} ficheiros, com os mesmos bytes, antes e depois das conferências`);
  if (C) console.log(`  C ${C.ok ? '✓' : '✗'} a construção é da cabeça ${C.cabeca ?? '(não lida)'}`);
  for (const f of [...(U?.falhas ?? []), ...(D?.falhas ?? []), ...(C?.falhas ?? [])]) console.error(`    ${f}`);
  console.log(`  ${segundos.toFixed(1)} s ao todo\n`);
  if (json) {
    fs.writeFileSync(json, JSON.stringify({
      cabeca, paralelo, segundos, ok: r.ok,
      plantas: p.casos,
      corridos: r.corridos.map(({ passo, codigo, segundos: s }) => ({ passo, codigo, segundos: s })),
      celulas: r.celulas,
    }, null, 1) + '\n');
  }
  if (!r.ok) {
    console.error(`  VERIFY DEPOIS DO BUILD · FECHOU${r.vermelhos?.length ? `: ${r.vermelhos.join(', ')}` : ''}\n`);
    process.exit(1);
  }
}

if (path.resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) await principal();
