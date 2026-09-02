#!/usr/bin/env node
/**
 * As duas provas da leitura do olho do lado do sítio (`src/lib/eyetext.mjs`).
 *
 * Regra 14 da casa: um leitor só se acredita depois de um conhecido-positivo o
 * fazer falhar. E, antes disso, uma leitura portada de outro sistema só vale se
 * ler o que o sistema de origem lê. São por isso três provas, e as três correm
 * aqui:
 *
 * E CORREM DENTRO DO `npm run verify` desde 02.09.2026 (bloco F0.5). Até esse
 * dia este guião existia, era bom, e não estava nem no `build` nem no `verify`:
 * a única prova cruzada entre o motor e o sítio não era corrida por nada, e
 * bastava uma linha do `package.json` para o ser (auditoria de 02.09, §5). Mede
 * 0,15 s sobre as cinco edições.
 *
 *   1. CONTRA O MOTOR. Nas cinco edições cujos bytes alojados são os do motor e
 *      cuja prova é `edicao-html` (06 pt, 07 pt, 07 en, 08 pt, 09 pt), a leitura
 *      de `studies-src/<slug>/<lingua>.html` dá, unidade a unidade, exatamente
 *      os `text` do registo, com os géneros, os níveis e os `header` a bater.
 *
 *      COM UMA RESSALVA MEDIDA, E É O QUE FAZ ESTA PROVA SER HONESTA. O registo
 *      não é a leitura do olho da edição: é `transform(eyetext(edição))`, onde
 *      `transform` são as operações da passagem de voz que o diretor aprovou e
 *      que viajam ao lado do registo em `<lingua>.cortes.json` (o D3 prende-lhes
 *      os bytes). Num bloco que uma operação tocou, a leitura e o registo TÊM de
 *      divergir, e uma prova que exigisse igualdade ali estaria a exigir que a
 *      passagem de voz não tivesse acontecido. Por isso:
 *
 *        · os blocos que nenhuma operação tocou comparam-se carácter a carácter;
 *        · os blocos que uma operação tocou comparam-se de outra maneira: a
 *          frase cortada tem de estar na LEITURA e não estar no REGISTO, e o
 *          `depois` de uma substituição tem de estar no registo. É a mesma
 *          afirmação por outro caminho, e fecha o buraco que a exclusão abriria.
 *
 *   2. CONHECIDO-POSITIVO. As formas cuja resposta certa não está em dúvida (as
 *      do `core/eyetext_test.py` do motor), mais os dois estragos plantados numa
 *      cópia em memória de um registo real: um bloco deitado fora e um espaço
 *      fantasma numa junta apertada. Os dois têm de fazer a comparação falhar.
 *
 *   3. A CLASSE DE ESPAÇO EM BRANCO, CRUZADA. Os seis pontos de código em que o
 *      `str.isspace()` do Python e o `\s` do JavaScript discordavam, com a
 *      mesma pergunta que o `core/eyetext_test.py` faz do outro lado.
 *
 *   node scripts/provar-eyetext.mjs
 *   node scripts/provar-eyetext.mjs --detalhe    (nomeia cada bloco excluído)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  registoDoHtml,
  leBlocos,
  unidades,
  Texto,
  Falha,
  le,
  tituloDoHtml,
  ESPACOS,
} from '../src/lib/eyetext.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DETALHE = process.argv.includes('--detalhe');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const falhas = [];
let conferencias = 0;

/* ========================================================================== */
/* 1 · CONTRA O MOTOR                                                          */
/* ========================================================================== */

const manifesto = JSON.parse(fs.readFileSync(path.join(RAIZ, 'registos', 'manifest.json'), 'utf8'));
const manifestoDosDocumentos = fs.readFileSync(path.join(RAIZ, 'studies-src', 'manifest.yml'), 'utf8');

/** As edições cujos bytes alojados são os do motor: `origin: researchhub`. */
function bytesDoMotor(slug, lang) {
  const bloco = manifestoDosDocumentos
    .split(/\n(?=\s*-\s+slug:)/)
    .find((b) => new RegExp(`slug:\\s*${slug}\\s*$`, 'm').test(b) && new RegExp(`lang:\\s*${lang}\\s*$`, 'm').test(b));
  return Boolean(bloco && /^\s*origin:\s*researchhub\s*$/m.test(bloco));
}

/** As unidades de um bloco, em ordem de documento. As duas formas são a mesma. */
function unidadesDoBloco(bloco) {
  if (bloco.kind === 'heading' || bloco.kind === 'paragraph') return [bloco];
  if (bloco.kind === 'list') return bloco.items;
  if (bloco.kind === 'table') return bloco.rows.flat();
  return [];
}

/** A forma de um bloco, sem o texto: género, nível, ordenação e quantas unidades tem. */
const forma = (b) => `${b.kind}/${b.level ?? ''}/${b.ordered ?? ''}/${unidadesDoBloco(b).length}`;

/** Dois blocos são o mesmo bloco: a forma e, unidade a unidade, o texto e o `header`. */
function saoIguais(a, b) {
  if (forma(a) !== forma(b)) return false;
  const ua = unidadesDoBloco(a);
  const ub = unidadesDoBloco(b);
  return ua.every((u, k) => u.text === ub[k].text && Boolean(u.header) === Boolean(ub[k].header));
}

const textoDoBloco = (b) => unidadesDoBloco(b).map((u) => u.text).join('\n');

/** O texto sem as marcas de markdown do rascunho, e sem espaço a mais. */
const semMarcas = (s) => String(s).replace(/[*`]/g, '').replace(/\s+/g, ' ').trim();

let totalUnidades = 0;
let totalIguais = 0;
let totalIsentas = 0;
let totalEditados = 0;
let totalRemovidos = 0;
let totalOperacoes = 0;
let totalBlocos = 0;
let edicoesProvadas = 0;
const linhasDaProva = [];

for (const chave of Object.keys(manifesto.registos)) {
  const slug = chave.slice(0, chave.lastIndexOf('/'));
  const lang = chave.slice(chave.lastIndexOf('/') + 1);
  const entrada = manifesto.registos[chave];
  if (entrada.prova !== 'edicao-html') continue;
  if (!bytesDoMotor(slug, lang)) continue;

  const html = fs.readFileSync(path.join(RAIZ, 'studies-src', slug, `${lang}.html`), 'utf8');
  const registo = JSON.parse(
    fs.readFileSync(path.join(RAIZ, 'registos', slug, `${lang}.record.json`), 'utf8'),
  );
  const cortes = JSON.parse(
    fs.readFileSync(path.join(RAIZ, 'registos', slug, `${lang}.cortes.json`), 'utf8'),
  );

  /* As frases que a passagem de voz declara ter tirado ou trocado, tal como
     estavam ANTES. É por elas, e não por coordenadas, que um bloco se diz
     tocado: as coordenadas do ficheiro de operações são do rascunho e de
     estados intermédios, e um alinhamento por índice sairia de passo à primeira
     operação que apaga um bloco inteiro (medido: onze blocos nas cinco). */
  const frasesTiradas = [];
  for (const op of cortes.operacoes ?? []) {
    if (op.op === 'nenhuma') continue;
    totalOperacoes++;
    const antes = String(op.antes_no_registo ?? '').trim();
    if (antes) frasesTiradas.push(antes);
  }
  const tocado = (b) => frasesTiradas.some((f) => textoDoBloco(b).includes(f));

  const lidos = registoDoHtml(html);
  totalBlocos += lidos.length;
  edicoesProvadas++;
  conferencias++;

  let i = 0;
  let j = 0;
  let iguais = 0;
  let isentas = 0;
  let editados = 0;
  let removidos = 0;
  let parou = false;

  while (j < registo.blocks.length && i < lidos.length) {
    const lido = lidos[i];
    const bloco = registo.blocks[j];

    /* (a) o caso normal: o bloco é o mesmo bloco, carácter a carácter. */
    if (saoIguais(lido, bloco)) {
      iguais += unidadesDoBloco(lido).length;
      i++;
      j++;
      continue;
    }

    /* (b) divergem e nada o explica: é a falha que esta prova existe para dar. */
    if (!tocado(lido)) {
      falhas.push(
        `${chave}: a leitura do bloco ${i} não é o registo do bloco ${j}, e nenhuma operação da ` +
          `passagem de voz o explica\n` +
          `      leitura: ${JSON.stringify(textoDoBloco(lido)).slice(0, 170)}\n` +
          `      registo: ${JSON.stringify(textoDoBloco(bloco)).slice(0, 170)}`,
      );
      parou = true;
      break;
    }

    /* (c) um ou mais blocos que a voz apagou por inteiro: o bloco do registo
       reaparece mais à frente na leitura, igual, e todos os que ficam pelo
       caminho estão declarados. */
    let salto = 0;
    for (let d = 1; d <= 4 && i + d < lidos.length; d++) {
      if (saoIguais(lidos[i + d], bloco)) {
        salto = d;
        break;
      }
    }
    if (salto > 0) {
      let todosDeclarados = true;
      for (let k = 0; k < salto; k++) if (!tocado(lidos[i + k])) todosDeclarados = false;
      if (todosDeclarados) {
        if (DETALHE) {
          for (let k = 0; k < salto; k++) {
            console.log(cinza(`      · ${chave}: a voz apagou o bloco ${i + k} inteiro`));
          }
        }
        removidos += salto;
        i += salto;
        continue;
      }
    }

    /* (d) um bloco que a voz editou: as unidades ficam isentas da comparação
       carácter a carácter, e o bloco é conferido pelo outro caminho abaixo. */
    if (lido.kind === bloco.kind && (lido.level ?? null) === (bloco.level ?? null)) {
      isentas += unidadesDoBloco(bloco).length;
      editados++;
      if (DETALHE) console.log(cinza(`      · ${chave}: a voz editou o bloco ${i}`));
      i++;
      j++;
      continue;
    }
    removidos++;
    i++;
  }

  if (!parou) {
    while (i < lidos.length) {
      if (!tocado(lidos[i])) {
        falhas.push(
          `${chave}: a leitura tem o bloco ${i} a mais e nenhuma operação o explica: ` +
            `${JSON.stringify(textoDoBloco(lidos[i])).slice(0, 140)}`,
        );
      } else removidos++;
      i++;
    }
    if (j < registo.blocks.length) {
      falhas.push(
        `${chave}: o registo tem ${registo.blocks.length - j} bloco(s) que a leitura da edição ` +
          `alojada não deu.`,
      );
    }
  }

  /* Os blocos que a voz tocou, provados pelo outro caminho: o que foi cortado
     está na leitura e não está no registo; o que substituiu está no registo. */
  const naLeitura = lidos.map((b) => textoDoBloco(b)).join('\n');
  const noRegisto = registo.blocks.map((b) => textoDoBloco(b)).join('\n');
  for (const op of cortes.operacoes ?? []) {
    if (op.op === 'nenhuma') continue;
    const antes = String(op.antes_no_registo ?? '').trim();
    if (antes) {
      conferencias++;
      if (!naLeitura.includes(antes)) {
        falhas.push(
          `${chave}: a passagem de voz diz ter tirado uma frase que a leitura da edição alojada ` +
            `não tem: ${JSON.stringify(antes).slice(0, 140)}`,
        );
      }
      if (op.op === 'corte' && noRegisto.includes(antes)) {
        falhas.push(
          `${chave}: a passagem de voz diz ter cortado uma frase que o registo continua a ter: ` +
            `${JSON.stringify(antes).slice(0, 140)}`,
        );
      }
    }
    if (op.op === 'substituicao' && op.depois) {
      conferencias++;
      /* O `depois` de uma substituição vem no espaço de coordenadas do rascunho,
         com as marcas de markdown que o registo não guarda (medido: cinco das
         substituições trazem `*` ou crases). A comparação tira as marcas dos
         dois lados, e mais nada: o que se prova continua a ser que a frase nova
         está no registo. */
      if (!semMarcas(noRegisto).includes(semMarcas(String(op.depois)))) {
        falhas.push(
          `${chave}: a substituição da passagem de voz não está no registo: ` +
            `${JSON.stringify(op.depois).slice(0, 140)}`,
        );
      }
    }
  }

  totalUnidades += iguais + isentas;
  totalIguais += iguais;
  totalIsentas += isentas;
  totalEditados += editados;
  totalRemovidos += removidos;
  linhasDaProva.push(
    `  ${chave.padEnd(48)} ${String(lidos.length).padStart(4)} blocos lidos · ` +
      `${String(registo.blocks.length).padStart(4)} no registo · ${String(iguais).padStart(4)} unidades iguais · ` +
      `${String(isentas).padStart(2)} isentas em ${editados} bloco(s) editado(s) · ${removidos} apagado(s)`,
  );
}

conferencias++;
if (edicoesProvadas !== 5) {
  falhas.push(
    `esta prova corre sobre 5 edições (as que têm prova "edicao-html" e bytes alojados do motor) ` +
      `e correu sobre ${edicoesProvadas}. Se o âmbito mudou, a prova tem de ser relida.`,
  );
}

/* ========================================================================== */
/* 2 · O CONHECIDO-POSITIVO                                                    */
/* ========================================================================== */

function caso(nome, html, esperado) {
  conferencias++;
  const lido = le(html);
  if (JSON.stringify(lido) !== JSON.stringify(esperado)) {
    falhas.push(`${nome}: leu ${JSON.stringify(lido)}, esperava ${JSON.stringify(esperado)}`);
  }
}

/* A fronteira de elemento de linha não põe espaço nenhum. É o caso que motivou
   este módulo, e o motor tem-no com as mesmas palavras. */
caso('uma fronteira de linha dentro de uma palavra', '<p><em>a</em>.</p>', ['a.']);
caso('dois parágrafos são dois blocos', '<p>a</p><p>b</p>', ['a', 'b']);
caso('um espaço da fonte é um espaço', '<p>x <b>y</b> z</p>', ['x y z']);
caso('uma corrida de espaço vale um espaço', '<p>x   \n\t y</p>', ['x y']);
caso('o bloco é aparado', '<p>\n  x  \n</p>', ['x']);
caso(
  'um título, uma célula e um item são unidades',
  '<h2>T</h2><table><tr><th>a</th><td>b</td></tr></table><ul><li>i</li></ul>',
  ['T', 'a', 'b', 'i'],
);
caso('um filete não carrega texto', '<p>a</p><hr><p>b</p>', ['a', 'b']);
caso(
  'elementos de linha aninhados não partem o bloco',
  '<p>o <strong>par é <span>marcado</span></strong>, e fica.</p>',
  ['o par é marcado, e fica.'],
);
caso(
  'script e style não são texto',
  '<p>a</p><script>var x = 1;</script><style>p{color:red}</style><p>b</p>',
  ['a', 'b'],
);
caso('o título do ficheiro não é um bloco', '<title>T</title><p>a</p>', ['a']);
caso('a declaração de tipo não é um bloco', '<!doctype html><p>a</p>', ['a']);

/* A extensão declarada, e é a única: o selo sai inteiro, sem deixar fronteira. */
caso(
  'o selo sai inteiro e não deixa marca',
  '<p>de <span>€167 372 756</span><a class="src-chip" href="/livro-razao/x">' +
    '<span class="src-chip-texto">fonte</span><span class="vh"> · Estudo</span></a> aprovados</p>',
  ['de €167 372 756 aprovados'],
);

conferencias++;
if (tituloDoHtml('<title>T &amp; U</title><p>a</p>') !== 'T & U') {
  falhas.push('tituloDoHtml() não desescapou nem aparou o título');
}

/* A recusa: uma estrutura onde o texto não tem sítio pára a leitura. */
for (const [nome, html, mencao] of [
  ['um <li> fora de qualquer lista', '<body><li>x</li></body>', 'fora de qualquer lista'],
  ['uma célula fora de qualquer linha', '<body><td>x</td></body>', 'fora de qualquer linha'],
]) {
  conferencias++;
  try {
    leBlocos(html);
    falhas.push(`${nome}: a leitura aceitou-o`);
  } catch (erro) {
    if (!(erro instanceof Falha)) falhas.push(`${nome}: atirou outra coisa: ${erro.message}`);
    else if (!String(erro.message).includes(mencao)) {
      falhas.push(`${nome}: recusou pela razão errada: ${erro.message}`);
    }
  }
}

/* O endereço fica na âncora que o trouxe, e não na seguinte. É o defeito que o
   motor corrigiu a 24.08 e sem o qual as ligações do documento se perdem. */
conferencias++;
{
  const documento = '<p>ver o <a href="https://exemplo.pt/a">relatório</a> e o <em>resto</em></p>';
  const blocos = leBlocos(documento);
  const texto = new Texto(blocos[0].unidade);
  const achados = blocos[0].unidade.intervalos.map((iv) => {
    const [a, b] = texto.intervaloDePedacos(iv.inicio, iv.fim);
    return [iv.tag, iv.href, texto.texto.slice(a, b)];
  });
  const esperado = [
    ['a', 'https://exemplo.pt/a', 'relatório'],
    ['em', null, 'resto'],
  ];
  if (JSON.stringify(achados.slice().sort()) !== JSON.stringify(esperado.slice().sort())) {
    falhas.push(`o endereço não ficou na sua própria âncora: ${JSON.stringify(achados)}`);
  }
}

/* E o mapa de posições sobrevive ao aperto do espaço em branco. */
conferencias++;
{
  const blocos = leBlocos('<p>  o <strong>valor</strong>  aqui  </p>');
  const texto = new Texto(blocos[0].unidade);
  if (texto.texto !== 'o valor aqui') {
    falhas.push(`o mapa do aperto produziu ${JSON.stringify(texto.texto)}`);
  } else {
    const iv = blocos[0].unidade.intervalos[0];
    const [a, b] = texto.intervaloDePedacos(iv.inicio, iv.fim);
    if (iv.tag !== 'strong' || texto.texto.slice(a, b) !== 'valor') {
      falhas.push(`o intervalo de ênfase caiu em ${JSON.stringify(texto.texto.slice(a, b))}`);
    }
  }
}

/**
 * OS DOIS ESTRAGOS PLANTADOS, sobre uma cópia em memória de um registo real.
 *
 * Sem eles esta prova é uma saída vazia, e uma saída vazia não prova nada
 * (regra 14). Cada um é a forma de um defeito que a P2 podia mesmo cometer.
 */
{
  const chave = 'evora-orcamentado-pago-devido-2025/pt';
  const [slug, lang] = [chave.slice(0, chave.lastIndexOf('/')), chave.slice(chave.lastIndexOf('/') + 1)];
  const html = fs.readFileSync(path.join(RAIZ, 'studies-src', slug, `${lang}.html`), 'utf8');
  const lidos = registoDoHtml(html);

  const compara = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  conferencias++;
  if (!compara(lidos, registoDoHtml(html))) {
    falhas.push('a leitura não é determinista: duas corridas sobre os mesmos bytes deram blocos diferentes');
  }

  conferencias++;
  const semUmBloco = lidos.slice(0, -1);
  if (compara(lidos, semUmBloco)) {
    falhas.push('o estrago plantado (um bloco deitado fora) não fez a comparação falhar');
  }

  conferencias++;
  const comEspacoFantasma = JSON.parse(JSON.stringify(lidos));
  const alvo = comEspacoFantasma.find((b) => b.kind === 'paragraph' && /\S\./.test(b.text ?? ''));
  if (!alvo) {
    falhas.push('não encontrei um parágrafo com uma junta apertada para plantar o espaço fantasma');
  } else {
    alvo.text = alvo.text.replace(/(\S)\./, '$1 .');
    if (compara(lidos, comEspacoFantasma)) {
      falhas.push('o estrago plantado (um espaço fantasma numa junta apertada) não fez a comparação falhar');
    }
  }

  /* E a junta apertada existe mesmo, medida e não afirmada: sem ela o estrago
     acima seria uma planta sobre uma forma que este documento não tem. */
  conferencias++;
  let apertadas = 0;
  let fantasmas = 0;
  for (const unidade of unidades(leBlocos(html))) {
    const [a, f] = new Texto(unidade).juntas();
    apertadas += a;
    fantasmas += f;
  }
  if (apertadas === 0) {
    falhas.push('esta edição não tem juntas apertadas: o conhecido-positivo do espaço fantasma está velho');
  }
  if (fantasmas !== 0) {
    falhas.push(`a leitura imprime ${fantasmas} espaço(s) fantasma numa junta apertada, e tem de imprimir zero`);
  }
  linhasDaProva.push(
    `  ${'juntas apertadas na 07 pt'.padEnd(48)} ${String(apertadas).padStart(4)} · ` +
      `${fantasmas} imprimem um espaço`,
  );
}

/* ==========================================================================
 * A CLASSE DE ESPAÇO EM BRANCO, A MESMA DOS DOIS LADOS (bloco F0.5, 02.09.2026)
 * ==========================================================================
 *
 * Este módulo dizia `\s` e o `core/eyetext.py` do motor dizia `str.isspace()`,
 * e as duas classes discordam em seis pontos de código. A classe está agora
 * escrita por extenso em `ESPACOS`, dos dois lados, e estes são os seis: cinco
 * que o Python chamava espaço e o JavaScript não, e um que o JavaScript chamava
 * espaço e o Python não. O caso é CRUZADO: o `core/eyetext_test.py` faz a mesma
 * pergunta do outro lado, com os mesmos seis códigos.
 */
{
  const SEIS = [
    [0x001c, 'separador de ficheiro', 'era espaço só para o Python'],
    [0x001d, 'separador de grupo', 'era espaço só para o Python'],
    [0x001e, 'separador de registo', 'era espaço só para o Python'],
    [0x001f, 'separador de unidade', 'era espaço só para o Python'],
    [0x0085, 'mudança de linha do Unicode', 'era espaço só para o Python'],
    [0xfeff, 'espaço de largura zero', 'era espaço só para o JavaScript'],
  ];
  for (const [codigo, nome, historia] of SEIS) {
    conferencias++;
    const c = String.fromCodePoint(codigo);
    const codigoEscrito = `U+${codigo.toString(16).toUpperCase().padStart(4, '0')}`;
    if (ESPACOS.has(c)) {
      falhas.push(
        `${codigoEscrito} (${nome}) está na classe de espaço da leitura do olho, e a decisão ` +
          `da casa é que não está: ${historia}, e os dois lados só concordam sem ele`,
      );
      continue;
    }
    /* E a decisão tem de valer na LEITURA, e não só no conjunto. */
    const lido = le(`<p>a${c}b</p>`);
    if (lido.length !== 1 || lido[0] !== `a${c}b`) {
      falhas.push(`${codigoEscrito} (${nome}) foi apertado a um espaço na leitura: ${JSON.stringify(lido)}`);
    }
    const aparado = le(`<p>${c}a${c}</p>`);
    if (aparado.length !== 1 || aparado[0] !== `${c}a${c}`) {
      falhas.push(`${codigoEscrito} (${nome}) foi aparado da ponta do bloco: ${JSON.stringify(aparado)}`);
    }
    /* E o JavaScript ainda diz o que dizia: sem isto, o caso deixava de medir a
       diferença que existe para medir no dia em que o motor de JS mudasse. */
    if (codigo === 0xfeff && !/\s/.test(c)) {
      falhas.push(`${codigoEscrito} deixou de ser espaço para o próprio \\s do JavaScript`);
    }
    if (codigo !== 0xfeff && /\s/.test(c)) {
      falhas.push(`${codigoEscrito} passou a ser espaço para o \\s do JavaScript`);
    }
  }

  /* E o positivo do outro sentido, para que a lista acima não seja uma lista de
     ausências: os caracteres que ESTÃO na classe apertam-se mesmo. */
  for (const [codigo, nome] of [
    [0x0009, 'tabulação'],
    [0x00a0, 'espaço inquebrável'],
    [0x2003, 'quadratim'],
    [0x2028, 'separador de linha'],
    [0x3000, 'espaço ideográfico'],
  ]) {
    conferencias++;
    const c = String.fromCodePoint(codigo);
    const codigoEscrito = `U+${codigo.toString(16).toUpperCase().padStart(4, '0')}`;
    if (!ESPACOS.has(c)) {
      falhas.push(`${codigoEscrito} (${nome}) devia estar na classe de espaço`);
      continue;
    }
    const lido = le(`<p>a${c}${c}b</p>`);
    if (lido.length !== 1 || lido[0] !== 'a b') {
      falhas.push(`${codigoEscrito} (${nome}) não foi apertado a um espaço: ${JSON.stringify(lido)}`);
    }
  }

  conferencias++;
  if (ESPACOS.size !== 24) {
    falhas.push(
      `a classe de espaço tem ${ESPACOS.size} caracteres e a decisão da casa são 24. ` +
        `Se mudou de propósito, muda nos dois lados e nos dois testes.`,
    );
  }
}

/* ========================================================================== */

console.log('');
console.log('A leitura do olho, provada contra o motor:');
for (const linha of linhasDaProva) console.log(linha);
console.log('');
console.log(
  `  ${edicoesProvadas} edições · ${totalBlocos} blocos lidos · ${totalUnidades} unidades · ` +
    `${totalIguais} iguais carácter a carácter · ${totalIsentas} isentas`,
);
console.log(
  `  ${totalOperacoes} operações da passagem de voz: ${totalEditados} blocos editados e ` +
    `${totalRemovidos} apagados, cada um conferido pelo outro caminho (a frase tirada está na ` +
    `leitura e não no registo)`,
);
console.log('');

if (falhas.length) {
  console.error(vermelho(`EYETEXT: FALHA — ${falhas.length} problema(s) em ${conferencias} conferências`));
  for (const f of falhas.slice(0, 40)) console.error(' -', f);
  if (falhas.length > 40) console.error(` … e mais ${falhas.length - 40}`);
  process.exit(1);
}
console.log(verde(`EYETEXT: PASSA — ${conferencias} conferências`));
process.exit(0);
