#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * O PORTÃO DA LÍNGUA · o que é português numa página inglesa diz que o é
 * ---------------------------------------------------------------------------
 *
 * Duas linhas de `design/especime-v3/ISSUES.md` fecham aqui, e são a mesma
 * pergunta feita sobre duas espécies de cadeia:
 *
 *   · **I91, segunda metade** — o título de um documento é um NOME. Não se
 *     traduz; diz em que língua está. A tabela é
 *     `src/i18n/lingua-dos-titulos.mjs`, e o mesmo vale para o nome de uma lei
 *     portuguesa citada numa frase inglesa e para o título de um estudo
 *     português.
 *   · **I92** — a unidade de uma linha é um RÓTULO. Traduz-se onde há um facto
 *     de dicionário (`src/i18n/unidades.mjs`), e onde não há rende-se em
 *     português com a marca da língua.
 *
 * ---------------------------------------------------------------------------
 * SETE CONFERÊNCIAS, E AS DUAS PRIMEIRAS SÃO AS QUE IMPEDEM O SILÊNCIO
 * ---------------------------------------------------------------------------
 *   L1 · toda a unidade do livro-razão tem entrada no dicionário OU na lista
 *        das que ficam em português, e nenhuma tem as duas. Uma unidade nova
 *        fecha a construção em vez de se render em português por omissão;
 *   L2 · todo o `document.title` do livro-razão tem língua declarada. Um título
 *        novo fecha a construção em vez de ficar sem marca em silêncio;
 *   L3 · em `dist/en`, nenhuma unidade em português sem `lang="pt-PT"`;
 *   L4 · nas duas edições, nenhum título de documento na língua errada e sem a
 *        marca da sua;
 *   L5 · em `dist/en`, nenhum nome de lei portuguesa em prosa da casa sem a
 *        marca. Os nomes que aparecem DENTRO de um texto transcrito — um campo
 *        do livro-razão (`data-linha-campo`), uma nota do registo da agenda
 *        (`data-agenda`), um bloco de um documento (`data-registo`) — contam-se
 *        à parte e imprimem-se, porque a casa não edita o que transcreve.
 *        **Um campo transcrito marca-se INTEIRO, na língua do campo**: é o que o
 *        localizador faz, porque é português de uma ponta à outra. Uma
 *        `derivation_en` é prosa inglesa com o nome de uma lei portuguesa lá
 *        dentro, e marcar esse pedaço obrigava a casa a partir uma cadeia que
 *        ela transcreve carácter a carácter. O número fica impresso: escondê-lo
 *        seria pior do que não o poder baixar;
 *   L6 · em `dist/en`, nenhum título de estudo português sem a marca — **à
 *        vista e no oculto**. O texto oculto de um selo de proveniência (`.vh`)
 *        é o que um leitor de ecrã ouve, e repetia o título português do estudo
 *        sem dizer em que língua ele está: uma superfície não deixa de ser
 *        superfície por não se ver;
 *   L8 · nenhum elemento com o MESMO atributo escrito duas vezes. Nasceu de uma
 *        leitura do lugar de direção que viu «lang="pt-PT" lang="pt-PT"» numa
 *        página de área; era um falso positivo — a cadeia procurada é também o
 *        fim de «hreflang="pt-PT" lang="pt-PT"», que é o par certo de um
 *        comutador de língua (a língua da página ligada e a língua do texto da
 *        ligação). A régua fica na mesma, e a razão é a regra da casa: um
 *        atributo repetido é silencioso, o navegador fica com o primeiro e
 *        deita o segundo fora, e uma marca de língua duplicada por um gabarito
 *        que a acrescenta duas vezes passava despercebida. Vale para qualquer
 *        nome de atributo, e não só para `lang`: é mais barato e apanha mais;
 *   L7 · nenhum localizador de documento numa linha cujo documento seja inglês.
 *        O localizador está na língua do documento que localiza, e é dele que
 *        recebe a marca: no dia em que houver um localizador dentro de um
 *        documento inglês, a regra deixa de valer e a construção fecha, em vez
 *        de marcar inglês como português.
 *
 * As tabelas não podem engordar sozinhas: uma entrada do dicionário ou da
 * declaração que nenhuma linha do livro-razão usa fecha a construção também. É
 * a mesma regra do inventário das frases — uma declaração que não se rende não
 * é uma sentinela, é uma linha morta.
 *
 * ---------------------------------------------------------------------------
 * O POSITIVO CONHECIDO (regra 14 da casa)
 * ---------------------------------------------------------------------------
 * Um zero só conta depois de a régua ter visto um vermelho. As duas portas do
 * estrago plantado são variáveis de ambiente, como o `OEDP_DIRECAO` do portão
 * da voz e pela mesma razão — planta-se numa CÓPIA, e nunca no que a construção
 * publica:
 *
 *   · `OEDP_LEDGER_DIR` — um livro-razão de mentira, com uma unidade inventada
 *     ou um título novo, para ver L1 e L2 vermelhas;
 *   · `OEDP_DIST` — uma cópia de `dist/` com uma marca tirada, para ver L3 a L6.
 *
 * Uso:  node scripts/check-lingua.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse, NodeType } from 'node-html-parser';

import { loadClaims, POR_VERIFICAR } from '../src/lib/ledger.mjs';
import { UNIDADES, UNIDADES_EM_PORTUGUES, unidadeDaLinha } from '../src/i18n/unidades.mjs';
import {
  LINGUA_DOS_TITULOS,
  linguaDoTituloDoDocumento,
  LINGUA_DOS_ROTULOS,
  linguaDoRotuloDaFonte,
} from '../src/i18n/lingua-dos-titulos.mjs';
import { WORKS, linguaDoTitulo } from '../src/data/studies.mjs';
import { matchPath } from '../src/lib/routes.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = process.env.OEDP_DIST ?? path.join(RAIZ, 'dist');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

const erros = [];

/* ===================================================================== L1 · */
/* as unidades do livro-razão, contra as duas tabelas                         */

const claims = [...loadClaims().values()];

const unidadesDoLivro = new Map();
for (const c of claims) {
  const u = c.unit === null || c.unit === undefined ? '' : String(c.unit);
  /* O marcador não é uma unidade: é a ausência de uma, e tem forma própria. */
  if (u === POR_VERIFICAR) continue;
  unidadesDoLivro.set(u, (unidadesDoLivro.get(u) ?? 0) + 1);
}

const semEntrada = [];
for (const [u] of unidadesDoLivro) {
  const noDicionario = Object.prototype.hasOwnProperty.call(UNIDADES, u);
  const emPortugues = Object.prototype.hasOwnProperty.call(UNIDADES_EM_PORTUGUES, u);
  if (noDicionario && emPortugues) {
    erros.push(
      `a unidade «${u}» está no dicionário E na lista das que ficam em português. ` +
        `Uma unidade traduz-se ou não se traduz; as duas coisas ao mesmo tempo dizem ` +
        `que ninguém decidiu.`,
    );
    continue;
  }
  if (!noDicionario && !emPortugues) semEntrada.push(u);
}
for (const u of semEntrada) {
  erros.push(
    `a unidade «${u}» (${unidadesDoLivro.get(u)} linha(s)) não tem entrada em ` +
      `src/i18n/unidades.mjs.\n` +
      `      Ou entra no dicionário, com o facto de dicionário ou o inglês que a casa já ` +
      `escreve para a mesma coisa,\n      ou entra em UNIDADES_EM_PORTUGUES com a razão pela ` +
      `qual fica em português. Uma unidade nova não se traduz sozinha.`,
  );
}
for (const u of Object.keys(UNIDADES)) {
  if (!unidadesDoLivro.has(u)) {
    erros.push(
      `o dicionário traduz a unidade «${u}», que nenhuma linha do livro-razão usa. ` +
        `Uma entrada que não se rende não é uma sentinela: é uma linha morta, e a tabela engorda.`,
    );
  }
}
for (const u of Object.keys(UNIDADES_EM_PORTUGUES)) {
  if (!unidadesDoLivro.has(u)) {
    erros.push(
      `UNIDADES_EM_PORTUGUES declara «${u}», que nenhuma linha do livro-razão usa. ` +
        `A lista das que ficam é uma lista do que existe, não do que já existiu.`,
    );
  }
}

/* ===================================================================== L2 · */
/* os títulos de documento do livro-razão, contra a declaração de língua       */

const titulosDoLivro = new Map();
for (const c of claims) {
  const t = c.document?.title;
  if (t === null || t === undefined) continue;
  const s = String(t);
  /* O marcador não é um título: declarar a língua de um buraco não diz nada. */
  if (s === POR_VERIFICAR) continue;
  titulosDoLivro.set(s, (titulosDoLivro.get(s) ?? 0) + 1);
}
for (const [t] of titulosDoLivro) {
  if (!Object.prototype.hasOwnProperty.call(LINGUA_DOS_TITULOS, t)) {
    erros.push(
      `o título «${t.slice(0, 90)}» (${titulosDoLivro.get(t)} linha(s)) não tem língua ` +
        `declarada em src/i18n/lingua-dos-titulos.mjs.\n` +
        `      A língua de um nome não se adivinha por acentos nem por palavras: escreve-se, ` +
        `uma vez, por quem olhou para ele.`,
    );
  }
}
for (const t of Object.keys(LINGUA_DOS_TITULOS)) {
  if (!titulosDoLivro.has(t)) {
    erros.push(
      `a declaração de língua nomeia o título «${t.slice(0, 90)}», que nenhuma linha do ` +
        `livro-razão traz. A tabela declara o que existe.`,
    );
  }
}

/* ==================================================================== L2b · */
/* os rótulos da fonte do livro-razão, contra a declaração de língua          */

const rotulosDoLivro = new Map();
for (const c of claims) {
  const n = c.name;
  if (n === null || n === undefined || String(n) === '') continue;
  const r = String(n);
  rotulosDoLivro.set(r, (rotulosDoLivro.get(r) ?? 0) + 1);
}
for (const [r] of rotulosDoLivro) {
  if (!Object.prototype.hasOwnProperty.call(LINGUA_DOS_ROTULOS, r)) {
    erros.push(
      `o rótulo da fonte «${r.slice(0, 90)}» (${rotulosDoLivro.get(r)} linha(s)) não tem língua ` +
        `declarada em src/i18n/lingua-dos-titulos.mjs.\n` +
        `      Um rótulo é um nome: não se traduz, e diz em que língua está. «Total» é a palavra ` +
        `que o IEFP imprime na folha portuguesa dele, e adivinhá-la pelo aspecto dava inglês.`,
    );
  }
}
for (const r of Object.keys(LINGUA_DOS_ROTULOS)) {
  if (!rotulosDoLivro.has(r)) {
    erros.push(
      `a declaração de língua nomeia o rótulo «${r.slice(0, 90)}», que nenhuma linha do ` +
        `livro-razão traz. A tabela declara o que existe.`,
    );
  }
}

/* ===================================================================== L7 · */
/* o localizador está na língua do documento que localiza                     */

let comLocalizador = 0;
for (const c of claims) {
  const loc = c.document?.locator;
  if (loc === null || loc === undefined) continue;
  comLocalizador++;
  const titulo = c.document?.title ?? null;
  const declarada =
    titulo === null || String(titulo) === POR_VERIFICAR
      ? null
      : (LINGUA_DOS_TITULOS[String(titulo)] ?? null);
  if (declarada !== 'pt') {
    erros.push(
      `a linha "${c.id}" tem "document.locator" e o seu documento não está declarado português ` +
        `(${declarada === null ? 'sem declaração' : `«${declarada}»`}).\n` +
        `      O localizador recebe a marca de língua do título do documento, porque é na língua ` +
        `dele que está escrito. Um localizador dentro de um documento inglês quebra essa regra: ` +
        `ou ele leva a sua própria declaração, ou o documento é português e a tabela di-lo.`,
    );
  }
}

/* ================================================================ dist/ · */

if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  PORTÃO DA LÍNGUA · não existe dist/. Corra o build primeiro.\n'));
  process.exit(1);
}

/** Os títulos de estudo cuja cadeia é portuguesa: os que têm edição em `pt`. */
const TITULOS_DE_ESTUDO_PT = new Set();
for (const w of WORKS) {
  for (const e of w.editions) if (e.lang === 'pt') TITULOS_DE_ESTUDO_PT.add(e.title);
}

/** O inglês que o dicionário produz, para reconhecer uma unidade já traduzida. */
const INGLES_DAS_UNIDADES = new Set(Object.values(UNIDADES));

/**
 * O NOME DE UMA LEI PORTUGUESA, tal como a casa e as fontes o escrevem: «Lei
 * n.º 73/2013», «Decreto-Lei n.º 87-A/2025». A expressão é local a esta régua
 * de propósito — se ela lesse a cadeia de `src/data/areas.mjs`, confirmava a
 * cadeia e não a página.
 */
const NOME_DE_LEI = /(?:Decreto-Lei|Lei)\s+n\.º\s*\d+[-\w]*\/\d{4}/g;

/**
 * As marcas que declaram um texto TRANSCRITO, e não escrito pela casa: um campo
 * do livro-razão, uma nota do registo da agenda, um bloco de um documento, uma
 * citação. A casa não edita o que transcreve.
 */
const TRANSCRICAO =
  '[data-linha-campo],[data-agenda],[data-verbatim],' +
  /* As quatro marcas do registo de conteúdo, na mesma lista que
     `scripts/medir-defeitos.mjs` usa, mais a do bloco: o corpo de uma página de
     leitura é um documento transcrito, e a casa não lhe mete markup por dentro. */
  '[data-registo],[data-registo-unidade],[data-registo-bloco],[data-registo-linha],' +
  '[data-registo-conta]';

function decodeEntities(s) {
  return String(s)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

const norm = (s) => decodeEntities(String(s)).replace(/\s+/g, ' ').trim();

/** A língua efectiva de um nó: o `lang` do ancestral mais próximo que o tenha. */
function langDe(no) {
  let n = no;
  while (n) {
    const l = n.getAttribute?.('lang');
    if (l) return l;
    n = n.parentNode;
  }
  return null;
}

/**
 * OS NOMES DE ATRIBUTO DE UMA ETIQUETA DE ABERTURA, PELA ORDEM EM QUE ESTÃO.
 *
 * Tokenizador próprio, e é de propósito: `parse()` normaliza os atributos num
 * mapa e **apaga a repetição em silêncio**, que é exactamente o defeito que L8
 * procura. Uma régua que lesse o mapa dizia sempre zero.
 */
function atributosDaEtiqueta(tag) {
  const nomes = [];
  let i = 0;
  /* saltar «<nome» */
  while (i < tag.length && !/\s/.test(tag[i]) && tag[i] !== '>' && tag[i] !== '/') i++;
  while (i < tag.length) {
    while (i < tag.length && /\s/.test(tag[i])) i++;
    if (i >= tag.length || tag[i] === '>' || tag[i] === '/') break;
    const inicio = i;
    while (i < tag.length && !/[\s=>/]/.test(tag[i])) i++;
    const nome = tag.slice(inicio, i);
    if (nome) nomes.push(nome.toLowerCase());
    while (i < tag.length && /\s/.test(tag[i])) i++;
    if (tag[i] === '=') {
      i++;
      while (i < tag.length && /\s/.test(tag[i])) i++;
      const aspa = tag[i];
      if (aspa === '"' || aspa === "'") {
        i++;
        while (i < tag.length && tag[i] !== aspa) i++;
        i++;
      } else {
        while (i < tag.length && !/[\s>]/.test(tag[i])) i++;
      }
    }
  }
  return nomes;
}

/**
 * Os elementos de um documento com um atributo repetido.
 *
 * O CONTEÚDO DE `<script>` E `<style>` SAI PRIMEIRO, e não é um detalhe: sem
 * isso, `for(var i=0;i<b.length-1;i++)` dentro de um script parece a etiqueta
 * `<b.length-1;i++)…` com «var» escrito duas vezes, e a régua acusa dez
 * elementos que não existem em nenhuma página. Foi medido.
 */
function atributosRepetidos(html) {
  const semCodigo = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, (m) =>
    m.slice(0, m.indexOf('>') + 1),
  );
  const out = [];
  const re = /<([A-Za-z][-\w:]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
  let m;
  while ((m = re.exec(semCodigo)) !== null) {
    const vistos = new Set();
    const dup = new Set();
    for (const n of atributosDaEtiqueta(m[0])) {
      if (vistos.has(n)) dup.add(n);
      vistos.add(n);
    }
    if (dup.size) out.push({ tag: m[0].slice(0, 120), dup: [...dup] });
  }
  return out;
}

function paginasDe(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...paginasDe(p));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const contas = {
  paginas: 0,
  unidades_en: 0,
  unidades_en_traduzidas: 0,
  unidades_en_em_portugues: 0,
  unidades_en_sem_marca: 0,
  titulos: 0,
  titulos_com_marca: 0,
  titulos_sem_marca: 0,
  rotulos: 0,
  rotulos_com_marca: 0,
  rotulos_sem_marca: 0,
  localizadores: 0,
  localizadores_en_com_marca: 0,
  localizadores_en_sem_marca: 0,
  leis_en: 0,
  leis_en_com_marca: 0,
  leis_en_sem_marca: 0,
  leis_en_em_transcricao: 0,
  estudos_pt_en: 0,
  estudos_pt_en_sem_marca: 0,
  estudos_pt_ocultos: 0,
  estudos_pt_ocultos_sem_marca: 0,
  elementos_com_atributo_repetido: 0,
  repetidos_em_documento_alojado: 0,
};
const achados = {
  repetidos: new Map(),
  ocultos: new Map(),
  unidades: new Map(),
  titulos: new Map(),
  rotulos: new Map(),
  localizadores: new Map(),
  leis: new Map(),
  estudos: new Map(),
};
const anota = (mapa, chave, caminho) => {
  const x = mapa.get(chave) ?? { n: 0, onde: caminho };
  x.n++;
  mapa.set(chave, x);
};

for (const ficheiro of paginasDe(DIST)) {
  /**
   * O DOCUMENTO ORIGINAL DE UM ESTUDO NÃO É UMA PÁGINA DESTE SÍTIO.
   *
   * `/en/studies/<slug>/document` serve o ficheiro do estudo tal como ele foi
   * publicado (`src/lib/routes.mjs`: «não é uma página deste sítio: é o estudo
   * original, alojado tal como está»). A casa não escreve uma linha dele, e
   * marcar por dentro dele um nome de lei seria editar o documento que ela
   * aloja para que uma régua sua ficasse verde. Fica de fora da varredura, com
   * a razão escrita, e não por uma omissão silenciosa.
   */
  const caminho = '/' + path.relative(DIST, ficheiro).split(path.sep).join('/');
  const rota = matchPath(caminho.replace(/index\.html$/, ''));
  const cru = fs.readFileSync(ficheiro, 'utf8');
  const rel0 = path.relative(RAIZ, ficheiro);

  /* --- L8 · um atributo escrito duas vezes no mesmo elemento --- */
  for (const r of atributosRepetidos(cru)) {
    contas.elementos_com_atributo_repetido++;
    if (rota?.key === 'documento') {
      /* Num documento alojado tal como está, um atributo repetido é do
         documento e não da casa: conta-se e imprime-se, e não fecha nada. */
      contas.repetidos_em_documento_alojado++;
      continue;
    }
    const chave = `${r.dup.join(', ')} · ${r.tag}`;
    const x = achados.repetidos.get(chave) ?? { n: 0, onde: rel0 };
    x.n++;
    achados.repetidos.set(chave, x);
  }

  if (rota?.key === 'documento') continue;

  const root = parse(cru);
  const html = root.querySelector('html');
  const lingua = html?.getAttribute('lang') ?? '';
  /* A edição, lida do documento e não do caminho: é o `lang` do `<html>` que o
     leitor de ecrã usa, e é contra ele que tudo aqui se mede. */
  const lang = lingua.startsWith('pt') ? 'pt' : lingua.startsWith('en') ? 'en' : null;
  if (!lang) continue;
  contas.paginas++;
  const rel = path.relative(RAIZ, ficheiro);

  /* --- L3 · as unidades, na edição inglesa --- */
  if (lang === 'en') {
    for (const el of root.querySelectorAll('[data-linha-campo="unit"]')) {
      const texto = norm(el.text);
      contas.unidades_en++;
      if (INGLES_DAS_UNIDADES.has(texto)) {
        contas.unidades_en_traduzidas++;
        continue;
      }
      contas.unidades_en_em_portugues++;
      if (langDe(el) !== 'pt-PT') {
        contas.unidades_en_sem_marca++;
        anota(achados.unidades, texto, rel);
      }
    }
  }

  /* --- L4 · os títulos de documento, nas duas edições --- */
  for (const el of root.querySelectorAll('[data-linha-campo="document.title"]')) {
    const texto = norm(el.text);
    if (texto === POR_VERIFICAR) continue;
    contas.titulos++;
    const esperada = linguaDoTituloDoDocumento(texto, lang);
    if (esperada === null) continue;
    if (langDe(el) === esperada) contas.titulos_com_marca++;
    else {
      contas.titulos_sem_marca++;
      anota(achados.titulos, `${esperada} · ${texto}`, rel);
    }
  }

  /* --- L4c · o rótulo da fonte, nas duas edições --- */
  for (const el of root.querySelectorAll('[data-linha-campo="name"]')) {
    const texto = norm(el.text);
    contas.rotulos++;
    const esperada = linguaDoRotuloDaFonte(texto, lang);
    if (esperada === null) continue;
    if (langDe(el) === esperada) contas.rotulos_com_marca++;
    else {
      contas.rotulos_sem_marca++;
      anota(achados.rotulos, `${esperada} · ${texto}`, rel);
    }
  }

  /* --- L4b · o localizador, que fala a língua do seu documento --- */
  for (const el of root.querySelectorAll('[data-linha-campo="document.locator"]')) {
    const texto = norm(el.text);
    if (texto === POR_VERIFICAR) continue;
    contas.localizadores++;
    if (lang !== 'en') continue;
    if (langDe(el) === 'pt-PT') contas.localizadores_en_com_marca++;
    else {
      contas.localizadores_en_sem_marca++;
      anota(achados.localizadores, texto.slice(0, 70), rel);
    }
  }

  /* --- L6b · o mesmo título, no texto que só um leitor de ecrã ouve --- */
  if (lang === 'en') {
    for (const el of root.querySelectorAll('.vh')) {
      const anda = (n) => {
        if (!n) return;
        if (n.nodeType === NodeType.TEXT_NODE) {
          const t = norm(n.rawText);
          if (!t) return;
          for (const titulo of TITULOS_DE_ESTUDO_PT) {
            if (!t.includes(titulo)) continue;
            contas.estudos_pt_ocultos++;
            if (langDe(n.parentNode) !== 'pt-PT') {
              contas.estudos_pt_ocultos_sem_marca++;
              anota(achados.ocultos, titulo, rel);
            }
          }
          return;
        }
        for (const f of n.childNodes ?? []) anda(f);
      };
      anda(el);
    }
  }

  /* --- L6 · os títulos de estudo portugueses, na edição inglesa --- */
  if (lang === 'en') {
    for (const el of root.querySelectorAll('[data-nonledger="titulo-de-estudo"]')) {
      const texto = norm(el.text);
      if (!TITULOS_DE_ESTUDO_PT.has(texto)) continue;
      contas.estudos_pt_en++;
      if (langDe(el) !== 'pt-PT') {
        contas.estudos_pt_en_sem_marca++;
        anota(achados.estudos, texto, rel);
      }
      /* E a função que decide tem de dizer o mesmo que a página mostra. */
      if (linguaDoTitulo(texto, 'en') !== 'pt-PT') {
        erros.push(
          `linguaDoTitulo() não marca «${texto}» como português numa página inglesa ` +
            `(${rel}), e a cadeia é o título de uma edição portuguesa.`,
        );
      }
    }
  }

  /* --- L5 · os nomes de lei, na edição inglesa --- */
  if (lang === 'en') {
    const emTranscricao = new Set();
    for (const el of root.querySelectorAll(TRANSCRICAO)) {
      emTranscricao.add(el);
      for (const d of el.querySelectorAll('*')) emTranscricao.add(d);
    }
    const anda = (n, dentroDeTranscricao) => {
      if (!n) return;
      if (n.nodeType === NodeType.TEXT_NODE) {
        const t = decodeEntities(n.rawText);
        const ms = [...t.matchAll(NOME_DE_LEI)];
        if (!ms.length) return;
        const marcado = langDe(n.parentNode) === 'pt-PT';
        for (const m of ms) {
          contas.leis_en++;
          /* A ORDEM IMPORTA: um campo transcrito PODE estar marcado inteiro, e
             quando está é uma lei com marca, e não uma lei fora do alcance. */
          if (marcado) contas.leis_en_com_marca++;
          else if (dentroDeTranscricao) contas.leis_en_em_transcricao++;
          else {
            contas.leis_en_sem_marca++;
            anota(achados.leis, m[0], rel);
          }
        }
        return;
      }
      const tag = String(n.rawTagName ?? '').toLowerCase();
      if (tag === 'script' || tag === 'style') return;
      const dentro = dentroDeTranscricao || emTranscricao.has(n);
      for (const f of n.childNodes ?? []) anda(f, dentro);
    };
    anda(root.querySelector('body') ?? root, false);
  }
}

if (contas.paginas === 0) {
  erros.push(
    `nenhuma página lida em ${DIST}: sem páginas, todos os zeros abaixo são zeros de ` +
      `uma varredura que não aconteceu.`,
  );
}

for (const [texto, x] of achados.unidades) {
  erros.push(
    `unidade em português sem lang="pt-PT" na edição inglesa: «${texto}» ` +
      `(${x.n} ocorrência(s), ex.: ${x.onde}).`,
  );
}
for (const [chave, x] of achados.titulos) {
  erros.push(`título sem a marca da sua língua: ${chave} (${x.n} ocorrência(s), ex.: ${x.onde}).`);
}
for (const [chave, x] of achados.rotulos) {
  erros.push(
    `rótulo da fonte sem a marca da sua língua: ${chave} (${x.n} ocorrência(s), ex.: ${x.onde}).`,
  );
}
for (const [chave, x] of achados.repetidos) {
  erros.push(
    `elemento com o mesmo atributo escrito duas vezes: ${chave}\n` +
      `      (${x.n} ocorrência(s), ex.: ${x.onde}). O navegador fica com o primeiro e deita o ` +
      `segundo fora, em silêncio: ou o gabarito acrescenta a marca a um elemento que já a tinha, ` +
      `ou o elemento recebe o atributo estático e o calculado.`,
  );
}
for (const [texto, x] of achados.localizadores) {
  erros.push(
    `localizador em português sem lang="pt-PT" na edição inglesa: «${texto}…» ` +
      `(${x.n} ocorrência(s), ex.: ${x.onde}).`,
  );
}
for (const [texto, x] of achados.leis) {
  erros.push(
    `nome de lei portuguesa sem lang="pt-PT" na edição inglesa: «${texto}» ` +
      `(${x.n} ocorrência(s), ex.: ${x.onde}).`,
  );
}
for (const [texto, x] of achados.ocultos) {
  erros.push(
    `título de estudo português sem lang="pt-PT" no TEXTO OCULTO de um selo, na edição ` +
      `inglesa: «${texto}» (${x.n} ocorrência(s), ex.: ${x.onde}).\n` +
      `      É o que um leitor de ecrã ouve, e uma superfície não deixa de ser superfície por ` +
      `não se ver.`,
  );
}
for (const [texto, x] of achados.estudos) {
  erros.push(
    `título de estudo português sem lang="pt-PT" na edição inglesa: «${texto}» ` +
      `(${x.n} ocorrência(s), ex.: ${x.onde}).`,
  );
}

/* O positivo conhecido da varredura: se nenhuma unidade traduzida se rendeu, a
   régua está a olhar para um sítio onde a tradução não chegou, e o zero de L3
   não vale nada. */
if (contas.unidades_en > 0 && contas.unidades_en_traduzidas === 0) {
  erros.push(
    `a edição inglesa rende ${contas.unidades_en} unidade(s) e nenhuma traduzida. ` +
      `O dicionário não está a ser aplicado, e o zero das que ficaram sem marca não prova nada.`,
  );
}

console.log('');
if (erros.length) {
  console.error(vermelho(`  PORTÃO DA LÍNGUA · ${erros.length} problema(s)\n`));
  for (const e of erros.slice(0, 40)) console.error(vermelho('    · ') + e);
  if (erros.length > 40) console.error(cinza(`    … e mais ${erros.length - 40}`));
  console.error('');
  process.exit(1);
}

console.log(
  verde('  língua ✓ ') +
    `${unidadesDoLivro.size} unidade(s) do livro-razão: ${Object.keys(UNIDADES).length} traduzida(s), ` +
    `${Object.keys(UNIDADES_EM_PORTUGUES).length} em português com razão escrita · ` +
    `${comLocalizador} localizador(es), todos dentro de documento português · ` +
    `${titulosDoLivro.size} título(s) de documento com língua declarada ` +
    `(${Object.values(LINGUA_DOS_TITULOS).filter((l) => l === 'pt').length} pt, ` +
    `${Object.values(LINGUA_DOS_TITULOS).filter((l) => l === 'en').length} en) · ` +
    `${rotulosDoLivro.size} rótulo(s) da fonte com língua declarada ` +
    `(${Object.values(LINGUA_DOS_ROTULOS).filter((l) => l === 'pt').length} pt, ` +
    `${Object.values(LINGUA_DOS_ROTULOS).filter((l) => l === 'en').length} en)`,
);
console.log(
  cinza(
    `        ${contas.paginas} página(s) lidas · unidades em «en»: ${contas.unidades_en} ` +
      `(${contas.unidades_en_traduzidas} traduzidas, ${contas.unidades_en_em_portugues} em português, ` +
      `todas com marca) · títulos com marca de língua: ${contas.titulos_com_marca} de ` +
      `${contas.titulos} rendidos · rótulos da fonte com marca de língua: ` +
      `${contas.rotulos_com_marca} de ${contas.rotulos} rendidos · localizadores em «en»: ` +
      `${contas.localizadores_en_com_marca} com marca · ` +
      `leis em «en»: ${contas.leis_en_com_marca} com marca, ` +
      `${contas.leis_en_em_transcricao} dentro de transcrição do motor · ` +
      `títulos de estudo portugueses em «en»: ${contas.estudos_pt_en} à vista e ` +
      `${contas.estudos_pt_ocultos} no oculto, todos com marca · ` +
      `atributos repetidos: nenhum`,
  ),
);
if (contas.repetidos_em_documento_alojado > 0) {
  console.log(
    cinza(
      `        ${contas.repetidos_em_documento_alojado} elemento(s) com atributo repetido dentro ` +
        `de um documento de estudo alojado tal como está: é do documento, e não da casa.`,
    ),
  );
}
if (contas.leis_en_em_transcricao > 0) {
  console.log(
    cinza(
      `        ${contas.leis_en_em_transcricao} nome(s) de lei dentro de texto transcrito ` +
        `(uma «derivation_en» do livro-razão, uma nota do registo da agenda): a casa não edita ` +
        `o que transcreve, e um campo transcrito só se marca inteiro, na língua do campo.`,
    ),
  );
}
console.log('');
