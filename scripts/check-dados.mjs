#!/usr/bin/env node
/**
 * Os dados descarregáveis existem, e batem certo com as suas origens.
 *
 * Corre DEPOIS do astro build, sobre dist/. O Método promete que «os dados por
 * trás de cada gráfico são descarregáveis»; esta verificação é o que impede que
 * a promessa volte a ser falsa por descuido — um ficheiro que deixou de ser
 * gerado, uma ligação que aponta para um endereço que não existe, ou um
 * ficheiro que ficou para trás quando a origem mudou.
 *
 * O que confere, e contra o quê:
 *
 *   1. os dois ficheiros existem em dist/, no endereço que as páginas usam;
 *   2. `municipios-308.csv` tem uma linha por município, e essa contagem bate
 *      certo com o LIVRO-RAZÃO (não com o módulo de onde o ficheiro foi
 *      gerado): 308 no total, e a repartição por Continente, Açores e Madeira;
 *   3. cada linha desse ficheiro reproduz nome, distrito e posição do módulo
 *      das coordenadas — um ficheiro editado à mão não passa;
 *   4. `convergencia.csv` tem uma linha por região activa da régua, e cada
 *      linha bate certo, campo a campo, com a afirmação que ela própria nomeia;
 *   5. as duas edições da primeira página ligam para os dois ficheiros, e
 *      nenhuma ligação /dados/… aponta para um ficheiro que não foi construído;
 *   6. cada linha com `document.hosted` é RECONTADA sobre o ficheiro que a
 *      construção pôs em dist/: o número de linhas de dados é o valor que a
 *      linha publica, e os bytes construídos dão o resumo que ela declara. É a
 *      terceira perna da porta estreita do `excerpt: null` (DECISIONS §1.47,
 *      T3): o validador prende os bytes, e a conta faz-se aqui.
 *
 * Repare-se no que NÃO é feito: o ficheiro construído não é comparado com uma
 * segunda chamada ao gerador. Isso seria uma tautologia. É lido do disco e
 * confrontado com o livro-razão e com as coordenadas.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import crypto from 'node:crypto';

import { DADOS, lerCsv, linhasDaConvergencia } from '../src/lib/dados.mjs';
import { allClaims, getClaim, parsePtNumber } from '../src/lib/ledger.mjs';
import { REGIOES } from '../src/data/regioes.mjs';
import { MUNICIPIOS, DISTRITOS, regiaoDe } from '../src/data/caop-centroids.mjs';
import { routePath } from '../src/lib/routes.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const DIST = path.join(ROOT, 'dist');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const erros = [];
const err = (msg) => erros.push(msg);

if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  DADOS DESCARREGÁVEIS — não existe dist/. Corra o build primeiro.\n'));
  process.exit(1);
}

/** Lê um ficheiro de dados construído. Falha (e não devolve nada) se faltar. */
function leDoDist(rota) {
  const ficheiro = path.join(DIST, rota.replace(/^\//, ''));
  if (!fs.existsSync(ficheiro)) {
    err(
      `${rota} não foi construído. O Método promete que os dados são descarregáveis; ` +
        `sem este ficheiro, a promessa é falsa.`,
    );
    return null;
  }
  return fs.readFileSync(ficheiro, 'utf8');
}

/* ---------------------------------------------------------- os municípios */

const brutoMunicipios = leDoDist(DADOS.municipios);
if (brutoMunicipios) {
  const { cabecalho, linhas, comentarios } = lerCsv(brutoMunicipios);
  const esperado = ['municipio', 'distrito', 'regiao', 'x', 'y'];
  if (cabecalho.join(',') !== esperado.join(',')) {
    err(`${DADOS.municipios}: cabeçalho "${cabecalho.join(',')}" — esperado "${esperado.join(',')}".`);
  }

  /* A contagem confronta-se com o livro-razão, que é a outra origem: se as
     coordenadas e o número publicado deixarem de concordar, isto pára. */
  const totalPublicado = parsePtNumber(getClaim('municipios-portugal-caop-2025').value);
  if (linhas.length !== totalPublicado) {
    err(
      `${DADOS.municipios}: tem ${linhas.length} linhas de dados, mas o livro-razão ` +
        `publica ${totalPublicado} municípios (municipios-portugal-caop-2025).`,
    );
  }
  if (linhas.length !== MUNICIPIOS.length) {
    err(
      `${DADOS.municipios}: tem ${linhas.length} linhas de dados, mas o módulo das ` +
        `coordenadas tem ${MUNICIPIOS.length} municípios.`,
    );
  }

  const porRegiao = { continente: 0, acores: 0, madeira: 0 };
  let divergentes = 0;
  linhas.forEach((l, i) => {
    const m = MUNICIPIOS[i];
    if (!m) return;
    const devia = [m[0], DISTRITOS[m[1]], regiaoDe(m[1]), String(m[2]), String(m[3])];
    if (l.join('|') !== devia.join('|') && divergentes++ < 5) {
      err(
        `${DADOS.municipios}, linha ${i + 1}: "${l.join(',')}" não é o que o módulo das ` +
          `coordenadas diz ("${devia.join(',')}").`,
      );
    }
    if (Object.prototype.hasOwnProperty.call(porRegiao, l[2])) porRegiao[l[2]]++;
    else err(`${DADOS.municipios}, linha ${i + 1}: região "${l[2]}" não é uma das três.`);
  });

  for (const [regiao, id] of [
    ['continente', 'municipios-continente-caop-2025'],
    ['acores', 'municipios-acores-caop-2025'],
    ['madeira', 'municipios-madeira-caop-2025'],
  ]) {
    const publicado = parsePtNumber(getClaim(id).value);
    if (porRegiao[regiao] !== publicado) {
      err(
        `${DADOS.municipios}: ${porRegiao[regiao]} linhas em "${regiao}", mas o ` +
          `livro-razão publica ${publicado} (${id}).`,
      );
    }
  }

  /* A citação da CAOP e a data de acesso têm de viajar com o ficheiro. */
  const cabeca = comentarios.join('\n');
  if (!cabeca.includes('Carta Administrativa Oficial de Portugal')) {
    err(`${DADOS.municipios}: o cabeçalho não traz a citação da CAOP.`);
  }
  if (!/Acedido a /.test(cabeca)) {
    err(`${DADOS.municipios}: o cabeçalho não traz a data de acesso.`);
  }
}

/* -------------------------------------------------------- a convergência */

const brutoConvergencia = leDoDist(DADOS.convergencia);
if (brutoConvergencia) {
  const { cabecalho, linhas, comentarios } = lerCsv(brutoConvergencia);
  const esperado = ['regiao', 'valor', 'ano', 'unidade', 'estudo', 'afirmacao'];
  if (cabecalho.join(',') !== esperado.join(',')) {
    err(`${DADOS.convergencia}: cabeçalho "${cabecalho.join(',')}" — esperado "${esperado.join(',')}".`);
  }

  const devidas = linhasDaConvergencia();
  if (linhas.length !== devidas.length) {
    err(
      `${DADOS.convergencia}: tem ${linhas.length} linhas de dados, mas a régua publica ` +
        `${devidas.length} (uma por região activa, mais as leituras históricas).`,
    );
  }

  const idsNoFicheiro = new Set(linhas.map((l) => l[5]));
  for (const r of REGIOES) {
    if (!idsNoFicheiro.has(r.valor)) {
      err(`${DADOS.convergencia}: falta a região "${r.nome.pt}" (afirmação ${r.valor}).`);
    }
  }

  /* Cada linha é confrontada com a afirmação que ela própria nomeia. */
  for (const [i, l] of linhas.entries()) {
    const [regiao, valor, ano, unidade, estudo, id] = l;
    let claim;
    try {
      claim = getClaim(id);
    } catch {
      err(`${DADOS.convergencia}, linha ${i + 1}: a afirmação "${id}" não existe no livro-razão.`);
      continue;
    }
    if (valor !== String(claim.value)) {
      err(`${DADOS.convergencia}, linha ${i + 1} (${id}): valor "${valor}", publicado "${claim.value}".`);
    }
    if (ano !== String(claim.reference_date)) {
      err(`${DADOS.convergencia}, linha ${i + 1} (${id}): ano "${ano}", reference_date "${claim.reference_date}".`);
    }
    if (unidade !== String(claim.unit)) {
      err(`${DADOS.convergencia}, linha ${i + 1} (${id}): unidade "${unidade}", publicada "${claim.unit}".`);
    }
    if (estudo !== String(claim.study)) {
      err(`${DADOS.convergencia}, linha ${i + 1} (${id}): estudo "${estudo}", registado "${claim.study}".`);
    }
    if (!regiao) err(`${DADOS.convergencia}, linha ${i + 1}: sem nome de região.`);
  }

  if (!comentarios.join('\n').includes('ledger/claims/')) {
    err(`${DADOS.convergencia}: o cabeçalho não diz onde está a linha do livro-razão de cada valor.`);
  }
}

/* ------------------------------- os ficheiros alojados, e a sua recontagem
 *
 * A terceira perna da porta estreita do `excerpt: null` (DECISIONS §1.47, T3;
 * BRIEF-bloco-T.md §2.4). O validador prende os BYTES do ficheiro alojado: o
 * resumo da linha contra o ficheiro em `public/`. O que ele não pode fazer é a
 * conta: aqui, sobre o ficheiro que a construção pôs em `dist/`, o número de
 * linhas de dados é recontado e comparado com o valor que a linha publica.
 *
 * Uma linha a mais no CSV fecha a construção. É o que separa «o sítio aloja um
 * ficheiro» de «o número que o sítio publica é o número de linhas desse
 * ficheiro»: sem a recontagem, o campo seria uma promessa com um anexo.
 *
 * O resumo é conferido outra vez, agora sobre os bytes construídos: entre
 * `public/` e `dist/` há uma cópia, e uma cópia é um sítio por onde um ficheiro
 * pode mudar sem que ninguém escreva nada.
 */
const alojadas = allClaims().filter((c) => c.document?.hosted);
let recontadas = 0;
const nomesAlojados = new Set();

for (const claim of alojadas) {
  const h = claim.document.hosted;
  const rota = `/${h.asset}`;
  const bruto = leDoDist(rota);
  if (!bruto) continue;

  const octetos = fs.readFileSync(path.join(DIST, h.asset));
  const resumo = crypto.createHash('sha256').update(octetos).digest('hex');
  if (resumo !== h.sha256) {
    err(
      `${rota}: os bytes construídos não são os que "${claim.id}" declara.\n` +
        `      no livro-razão: ${h.sha256}\n` +
        `      em dist/:       ${resumo}`,
    );
    continue;
  }

  const { cabecalho, linhas } = lerCsv(bruto);
  if (cabecalho.length === 0) {
    err(`${rota}: não tem linha de cabeçalho, e sem ela não se sabe o que cada coluna é.`);
    continue;
  }
  const publicado = parsePtNumber(claim.value);
  if (linhas.length !== publicado) {
    err(
      `${rota}: tem ${linhas.length} linhas de dados e a linha "${claim.id}" publica ` +
        `${claim.value}. O valor de uma linha contada sobre um ficheiro alojado é o número ` +
        `de linhas desse ficheiro, recontado aqui a cada construção.`,
    );
  } else {
    recontadas++;
  }
  /* O nome do município é a segunda coluna, e é a coluna pela qual o mapa e a
     contagem se podem comparar. Guardada aqui, comparada abaixo. */
  const iNome = cabecalho.indexOf('municipio');
  if (iNome >= 0) for (const l of linhas) nomesAlojados.add(l[iNome]);
}

/* As duas origens dos 308 nunca se tinham comparado. O mapa desenha-se de
   `src/data/caop-centroids.mjs` e a contagem faz-se dos ficheiros da DGT: se as
   duas discordarem num nome, o sítio conta um município que não desenha, ou
   desenha um que não conta. */
if (nomesAlojados.size) {
  const noModulo = new Set(MUNICIPIOS.map((m) => m[0]));
  const soNoFicheiro = [...nomesAlojados].filter((n) => !noModulo.has(n));
  const soNoModulo = [...noModulo].filter((n) => !nomesAlojados.has(n));
  if (soNoFicheiro.length || soNoModulo.length) {
    err(
      `os ficheiros alojados da CAOP e src/data/caop-centroids.mjs não nomeiam os mesmos ` +
        `municípios.\n      só nos ficheiros: ${soNoFicheiro.slice(0, 8).join(', ') || 'nenhum'}` +
        `\n      só no módulo:     ${soNoModulo.slice(0, 8).join(', ') || 'nenhum'}`,
    );
  }
}

/* ------------------------------------------- as ligações das duas edições */

/** Todos os ficheiros HTML construídos. */
function ficheirosHtml(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...ficheirosHtml(full));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const ligacoes = new Map();
for (const file of ficheirosHtml(DIST)) {
  const html = fs.readFileSync(file, 'utf8');
  for (const m of html.matchAll(/href="(\/dados\/[^"]+)"/g)) {
    if (!ligacoes.has(m[1])) ligacoes.set(m[1], new Set());
    ligacoes.get(m[1]).add('/' + path.relative(DIST, file));
  }
}
for (const [rota, onde] of ligacoes) {
  if (!fs.existsSync(path.join(DIST, rota.replace(/^\//, '')))) {
    err(`ligação para "${rota}" em ${[...onde].join(', ')}, mas esse ficheiro não foi construído.`);
  }
}

/* As duas edições da primeira página têm de oferecer os dois instrumentos. */
for (const lang of ['pt', 'en']) {
  const rota = routePath('home', lang);
  const ficheiro = path.join(DIST, rota === '/' ? 'index.html' : rota.replace(/^\//, '') + '/index.html');
  if (!fs.existsSync(ficheiro)) {
    err(`não encontrei a primeira página da edição "${lang}" em ${ficheiro}.`);
    continue;
  }
  const html = fs.readFileSync(ficheiro, 'utf8');
  for (const alvo of Object.values(DADOS)) {
    if (!html.includes(`href="${alvo}"`)) {
      err(
        `a primeira página da edição "${lang}" não liga para "${alvo}". ` +
          `Os dados por trás de cada instrumento são descarregáveis nas duas edições, ou não são.`,
      );
    }
  }
}

/* ------------------------------------------------------------- relatório */

console.log('');
console.log(cinza(`  dados descarregáveis · ${Object.keys(DADOS).length} ficheiros · ${ligacoes.size} endereços ligados`));
console.log(cinza(`  ficheiros alojados · ${alojadas.length} linha(s) com document.hosted · ${recontadas} recontada(s)`));

if (erros.length) {
  console.log('');
  console.error(vermelho(`  OS DADOS NÃO BATEM CERTO — ${erros.length} erro(s):`));
  console.error('');
  for (const e of erros) console.error('    ' + vermelho('✗') + ' ' + e);
  console.error('');
  process.exit(1);
}

console.log('');
console.log('  ' + verde('✓') + ' os ficheiros existem, batem certo com as origens e estão ligados nas duas edições.');
console.log('');
