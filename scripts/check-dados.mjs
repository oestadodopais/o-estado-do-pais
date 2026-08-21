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
 *   5. as duas edições da página DE CADA FICHEIRO ligam para o seu ficheiro, e
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
import {
  allClaims,
  getClaim,
  parsePtNumber,
  CAMPOS_PUBLICADOS,
  CAMPOS_DO_DOCUMENTO,
} from '../src/lib/ledger.mjs';
import { LICENCA, CONJUNTO } from '../src/data/licenca.mjs';
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

/**
 * ---------------------------------------------------------------------------
 * ONDE A PORTA DE CADA FICHEIRO VIVE, E PORQUE É UMA DECLARAÇÃO (21.08.2026)
 * ---------------------------------------------------------------------------
 * Até aqui esta conferência exigia que **a primeira página** ligasse os dois
 * ficheiros, porque era lá que os dois instrumentos viviam. A Emenda 15 tirou da
 * primeira página a camada de aparelho do mapa, e a porta do CSV dos 308 ia com
 * ela; a Emenda 17 mandou a contagem por parcelas da CAOP para `/municipios`. A
 * porta segue a lista que o ficheiro publica: quem quer os 308 em ficheiro está
 * na página dos 308, e não na primeira (ISSUES I34; decisão 3 da direção).
 *
 * A promessa não afrouxa: continua a ser «nas duas edições, ou não são». O que
 * muda é que a rota deixa de estar escrita dentro do laço e passa a ser uma
 * DECLARAÇÃO, ficheiro a ficheiro. Uma declaração é o que se pode ler antes de
 * correr, e é o que impede que a porta desapareça em silêncio: um ficheiro sem
 * rota declarada fecha a construção, em vez de deixar de ser conferido.
 *
 * Uma porta a mais noutra página não é um erro: o que esta conferência impõe é o
 * mínimo, e a conferência de cima já garante que nenhuma ligação `/dados/…`
 * aponta para um ficheiro que não foi construído.
 *
 * **21.08.2026, commit 4-0:** a porta do CSV da convergência desce da primeira
 * página para `/livro-razao`, ao pé do bloco do conjunto de dados (relocação
 * R13). O registo de relocações já dizia que o aparelho do Instrumento n.º 1
 * tinha saído da primeira página e a construção ainda rendia esta porta lá; a
 * direção decidiu qual das duas coisas se corrige. A declaração desce no mesmo
 * commit que a porta: é isso que faz a conferência seguir o desenho em vez de o
 * travar.
 */
const PORTA_DOS_DADOS = {
  convergencia: 'livro',
  municipios: 'municipios',
};

/** O ficheiro construído de uma rota. `/` é `index.html`; o resto é `<rota>/index.html`. */
function ficheiroDaRota(rota) {
  return path.join(DIST, rota === '/' ? 'index.html' : rota.replace(/^\//, '') + '/index.html');
}

for (const [chave, alvo] of Object.entries(DADOS)) {
  const destino = PORTA_DOS_DADOS[chave];
  if (!destino) {
    err(
      `o ficheiro "${alvo}" não declara em que rota vive a sua porta (PORTA_DOS_DADOS, ` +
        `scripts/check-dados.mjs). Um ficheiro que ninguém oferece é um ficheiro que ninguém ` +
        `pediu: declare a rota, ou não o construa.`,
    );
    continue;
  }
  for (const lang of ['pt', 'en']) {
    const rota = routePath(destino, lang);
    const ficheiro = ficheiroDaRota(rota);
    if (!fs.existsSync(ficheiro)) {
      err(`não encontrei a página "${rota}" da edição "${lang}" em ${ficheiro}.`);
      continue;
    }
    const html = fs.readFileSync(ficheiro, 'utf8');
    if (!html.includes(`href="${alvo}"`)) {
      err(
        `a página "${rota}" (edição "${lang}") não liga para "${alvo}". ` +
          `Os dados por trás de cada instrumento são descarregáveis nas duas edições, ou não são.`,
      );
    }
  }
}

/* -------------------------------------- o livro-razão como conjunto de dados
 *
 * Bloco T, T4. Os três ficheiros são gerados na construção, e por isso não
 * podem divergir do livro-razão por descuido de edição — só por defeito do
 * gerador, que é exactamente a classe que os dois ficheiros de cima já são
 * conferidos para apanhar. Lidos do dist/, confrontados com `ledger/claims/`,
 * e nunca com uma segunda chamada ao gerador: seria uma tautologia.
 *
 * E confere-se a comutação da licença, que é o que a §2.6 do BRIEF-bloco-T
 * mandou construir: com `LICENCA` a `null`, NENHUMA página construída liga
 * estes ficheiros; com ela preenchida, o índice liga os dois nas duas edições e
 * cada página de linha liga o seu. Sem isto, a promessa «nada se publica sob
 * licença nenhuma» era uma frase, e não um estado.
 */

/** Leitor RFC 4180 suficiente para este ficheiro: aspas, vírgulas e CRLF. */
function lerRfc4180(texto) {
  const registos = [];
  let campo = '';
  let registo = [];
  let dentro = false;
  for (let i = 0; i < texto.length; i++) {
    const ch = texto[i];
    if (dentro) {
      if (ch === '"') {
        if (texto[i + 1] === '"') {
          campo += '"';
          i++;
        } else dentro = false;
      } else campo += ch;
      continue;
    }
    if (ch === '"') dentro = true;
    else if (ch === ',') {
      registo.push(campo);
      campo = '';
    } else if (ch === '\r' && texto[i + 1] === '\n') {
      registo.push(campo);
      registos.push(registo);
      registo = [];
      campo = '';
      i++;
    } else campo += ch;
  }
  if (campo !== '' || registo.length) {
    registo.push(campo);
    registos.push(registo);
  }
  return registos;
}

/** As colunas que o ficheiro tem de ter, compostas AQUI a partir do formato. */
const colunasEsperadas = [];
for (const c of CAMPOS_PUBLICADOS) {
  if (c === 'document') for (const k of CAMPOS_DO_DOCUMENTO) colunasEsperadas.push(`document_${k}`);
  else colunasEsperadas.push(c);
}

const linhasDoLivro = allClaims();
let conjuntoConferido = 0;

const brutoConjunto = leDoDist(CONJUNTO.csv);
if (brutoConjunto) {
  const registos = lerRfc4180(brutoConjunto);
  const cabecalho = registos[0] ?? [];
  const dados = registos.slice(1);
  if (cabecalho.join(',') !== colunasEsperadas.join(',')) {
    err(
      `${CONJUNTO.csv}: o cabeçalho não é o do formato.\n` +
        `      esperado:   ${colunasEsperadas.join(',')}\n` +
        `      construído: ${cabecalho.join(',')}`,
    );
  }
  if (cabecalho.includes('note')) {
    err(`${CONJUNTO.csv}: traz uma coluna "note". O campo "note" não é publicado (ledger/README.md).`);
  }
  if (dados.length !== linhasDoLivro.length) {
    err(
      `${CONJUNTO.csv}: tem ${dados.length} registos e o livro-razão tem ${linhasDoLivro.length} ` +
        `linhas. O conjunto é o livro-razão inteiro, ou não é o conjunto.`,
    );
  } else {
    const iId = cabecalho.indexOf('id');
    const iValor = cabecalho.indexOf('value');
    const iLido = cabecalho.indexOf('access_date');
    for (let n = 0; n < dados.length; n++) {
      const c = linhasDoLivro[n];
      const r = dados[n];
      for (const [coluna, i, esperado] of [
        ['id', iId, c.id],
        ['value', iValor, c.value],
        ['access_date', iLido, c.access_date ?? null],
      ]) {
        if (i < 0) continue;
        const noFicheiro = r[i] ?? '';
        const daLinha = esperado === null || esperado === undefined ? '' : String(esperado);
        if (noFicheiro !== daLinha) {
          err(
            `${CONJUNTO.csv}, registo ${n + 1}: "${coluna}" é "${noFicheiro}" e a linha ` +
              `"${c.id}" diz "${daLinha}". O conjunto publica o livro-razão, não uma cópia dele.`,
          );
        }
      }
      conjuntoConferido++;
    }
  }
}

const brutoJson = leDoDist(CONJUNTO.json);
if (brutoJson) {
  let doc = null;
  try {
    doc = JSON.parse(brutoJson);
  } catch (e) {
    err(`${CONJUNTO.json} não é JSON válido: ${e.message}`);
  }
  if (doc) {
    if (JSON.stringify(doc.licenca ?? null) !== JSON.stringify(LICENCA ?? null)) {
      err(`${CONJUNTO.json}: a licença que o ficheiro declara não é a de src/data/licenca.mjs.`);
    }
    const linhas = Array.isArray(doc.linhas) ? doc.linhas : [];
    if (linhas.length !== linhasDoLivro.length) {
      err(
        `${CONJUNTO.json}: tem ${linhas.length} linhas e o livro-razão tem ${linhasDoLivro.length}.`,
      );
    } else {
      for (let n = 0; n < linhas.length; n++) {
        const c = linhasDoLivro[n];
        const l = linhas[n];
        if ('note' in l) err(`${CONJUNTO.json}: a linha "${c.id}" traz "note", que não é publicada.`);
        if (l.id !== c.id || String(l.value) !== String(c.value)) {
          err(
            `${CONJUNTO.json}, linha ${n + 1}: diz "${l.id}" = "${l.value}" e o livro-razão diz ` +
              `"${c.id}" = "${c.value}".`,
          );
        }
        const chaves = Object.keys(l).join(',');
        if (chaves !== CAMPOS_PUBLICADOS.join(',')) {
          err(
            `${CONJUNTO.json}: a linha "${c.id}" não traz os campos do formato.\n` +
              `      esperado:   ${CAMPOS_PUBLICADOS.join(',')}\n` +
              `      construído: ${chaves}`,
          );
        }
      }
    }
  }
}

let porLinhaConferidas = 0;
for (const c of linhasDoLivro) {
  const bruto = leDoDist(CONJUNTO.linha(c.id));
  if (!bruto) continue;
  try {
    const doc = JSON.parse(bruto);
    if (doc?.linha?.id !== c.id || String(doc?.linha?.value) !== String(c.value)) {
      err(
        `${CONJUNTO.linha(c.id)}: diz "${doc?.linha?.id}" = "${doc?.linha?.value}" e o ` +
          `livro-razão diz "${c.id}" = "${c.value}".`,
      );
    } else porLinhaConferidas++;
  } catch (e) {
    err(`${CONJUNTO.linha(c.id)} não é JSON válido: ${e.message}`);
  }
}

/* A comutação da licença, sobre as páginas construídas. */
const paginasQueLigam = new Map();
for (const file of ficheirosHtml(DIST)) {
  const html = fs.readFileSync(file, 'utf8');
  for (const m of html.matchAll(/href="(\/livro-razao(?:\.csv|\.json|\/[a-z0-9-]+\.json))"/g)) {
    const rel = '/' + path.relative(DIST, file);
    if (!paginasQueLigam.has(m[1])) paginasQueLigam.set(m[1], new Set());
    paginasQueLigam.get(m[1]).add(rel);
  }
}
if (!LICENCA) {
  if (paginasQueLigam.size) {
    err(
      `a licença do conjunto não está decidida (LICENCA = null em src/data/licenca.mjs) e ` +
        `${paginasQueLigam.size} endereço(s) do conjunto estão ligados de páginas construídas ` +
        `(${[...paginasQueLigam.keys()].slice(0, 3).join(', ')}).\n` +
        `      Até a direção decidir, nada se oferece sob licença nenhuma (BRIEF-bloco-T §2.6).`,
    );
  }
} else {
  for (const lang of ['pt', 'en']) {
    const rota = routePath('livro', lang);
    const ficheiro = path.join(DIST, rota.replace(/^\//, '') + '/index.html');
    if (!fs.existsSync(ficheiro)) {
      err(`não encontrei o índice do livro-razão da edição "${lang}" em ${ficheiro}.`);
      continue;
    }
    const html = fs.readFileSync(ficheiro, 'utf8');
    for (const alvo of [CONJUNTO.csv, CONJUNTO.json]) {
      if (!html.includes(`href="${alvo}"`)) {
        err(
          `o índice do livro-razão da edição "${lang}" não liga para "${alvo}". Com licença ` +
            `decidida, o conjunto oferece-se nas duas edições, ou não se oferece.`,
        );
      }
    }
  }
}

/* ------------------------------------------------------------- relatório */

console.log('');
console.log(cinza(`  dados descarregáveis · ${Object.keys(DADOS).length} ficheiros · ${ligacoes.size} endereços ligados`));
console.log(cinza(`  ficheiros alojados · ${alojadas.length} linha(s) com document.hosted · ${recontadas} recontada(s)`));
console.log(
  cinza(
    `  conjunto de dados · ${conjuntoConferido} registos no CSV · ${porLinhaConferidas} ficheiros de linha · ` +
      `licença ${LICENCA ? LICENCA.nome : 'por decidir'} · ${paginasQueLigam.size} endereço(s) ligado(s)`,
  ),
);

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
