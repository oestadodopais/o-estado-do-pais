#!/usr/bin/env node
/**
 * Portão (a) e (c): varrimento do HTML construído.
 *
 * Corre DEPOIS do astro build, sobre dist/. Falha se encontrar, numa página,
 * texto com algarismos que não venha do livro-razão nem de um contexto
 * declarado. Os limites honestos deste varrimento estão em DECISIONS.md e
 * repetidos no fim deste ficheiro.
 *
 * Origens legítimas para um algarismo numa página:
 *   1. data-claim="<id>"        — veio do livro-razão. O portão confere os
 *                                 algarismos renderizados contra o valor publicado.
 *   2. data-verbatim="<chave>"  — citação transcrita. O portão exige igualdade
 *                                 carácter a carácter com src/data/verbatim.mjs.
 *   3. data-nonledger="<motivo>"— contexto estrutural, com motivo em ledger/allowlist.yml.
 *   4. token/padrão em ledger/allowlist.yml — nomes próprios com algarismos.
 *   5. data-correcao-*          — uma entrada do registo de correções, conferida
 *                                 campo a campo contra a afirmação.
 *   6. data-linha-*             — um campo de uma linha do livro-razão, na página
 *                                 dessa linha, conferido carácter a carácter
 *                                 contra o campo da própria afirmação.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';
import { parse, NodeType } from 'node-html-parser';

import {
  loadClaims,
  digitsOf,
  parsePtNumber,
  motivoDaEntrada,
  derivacaoDaLinha,
  notaDeBandeira,
  provenienciaIncompleta,
} from '../src/lib/ledger.mjs';
import { VERBATIM, normalizeWhitespace } from '../src/data/verbatim.mjs';
import { EDITIONS, workById } from '../src/data/studies.mjs';
import { temLeitura } from '../src/data/leituras.mjs';
import { tituloDaLinha, descricaoDaLinha } from '../src/lib/livro.mjs';
import { matchPath, routePath, HREFLANG, LANGS } from '../src/lib/routes.mjs';
import { documentoDaEdicao, documentoServido } from '../src/lib/documentos.mjs';
import { renderizacoesAceites } from '../src/data/correcoes.mjs';
import { SITE_HOST, SITE_NAME, AUTHORSHIP_LINE, EDITION } from '../site.config.mjs';
import { ENDERECO_CORRECOES } from '../src/data/metodo.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const DIST = path.join(ROOT, 'dist');
const ALLOWLIST = path.join(ROOT, 'ledger', 'allowlist.yml');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const amarelo = (s) => `\x1b[33m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

/* ------------------------------------------------------------------ entrada */

if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  PORTÃO DE HTML — não existe dist/. Corra o build primeiro.\n'));
  process.exit(1);
}

const claims = loadClaims();
const allow = load(fs.readFileSync(ALLOWLIST, 'utf8')) ?? {};
const CONTEXTOS = new Set((allow.contexts ?? []).map((c) => c.id));
const TOKENS = (allow.tokens ?? []).map((t) => ({ ...t, scope: t.scope ?? 'any' }));
const PATTERNS = (allow.patterns ?? []).map((p) => ({
  ...p,
  scope: p.scope ?? 'any',
  re: new RegExp(p.pattern),
}));

/**
 * Cadeias estruturais toleradas no <head>: títulos de estudos, nome do sítio,
 * data de edição. No <head> não há markup onde pendurar data-nonledger, por
 * isso a excepção é por cadeia exacta, tirada do registo — não escrita à mão.
 */
const CADEIAS_HEAD = [
  ...EDITIONS.map((e) => e.title),
  SITE_NAME,
  EDITION.display,
  EDITION.iso,
].sort((a, b) => b.length - a.length);

/** De <html lang="pt-PT"> para a língua da edição. Derivado da tabela de rotas. */
const LINGUA_POR_HREFLANG = Object.fromEntries(
  Object.entries(HREFLANG).map(([lang, hreflang]) => [hreflang, lang]),
);

const erros = [];
const avisos = [];
/**
 * Afirmações citadas por uma página que NÃO seja a do próprio livro-razão.
 *
 * A página de uma linha cita sempre a sua linha, e o índice cita todas: contá-las
 * aqui apagaria para sempre o aviso «esta afirmação não é citada por nenhuma
 * página», que é o que diz quanto do livro-razão está mesmo a ser usado. O
 * livro-razão publica-se; não conta como quem o cita.
 */
const idsUsados = new Set();
/** Páginas de linha construídas, por «língua:id» — para conferir que existem todas. */
const linhasConstruidas = new Set();
let ficheiros = 0;
let documentos = 0;
let paginasDoLivro = 0;

/* ------------------------------------------------------------------ auxiliares */

const NOMEADAS = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ensp: ' ', emsp: ' ',
  thinsp: ' ', hellip: '…', mdash: '—', ndash: '–', laquo: '«', raquo: '»',
  ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', middot: '·', times: '×', minus: '−',
  deg: '°', ordm: 'º', ordf: 'ª', euro: '€', copy: '©', shy: '­',
};

function decodeEntities(s) {
  return String(s).replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z][a-zA-Z0-9]*);/g, (m, g) => {
    try {
      if (g[0] === '#') {
        const code = g[1] === 'x' || g[1] === 'X' ? parseInt(g.slice(2), 16) : parseInt(g.slice(1), 10);
        if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return m;
        return String.fromCodePoint(code);
      }
      return Object.prototype.hasOwnProperty.call(NOMEADAS, g) ? NOMEADAS[g] : m;
    } catch {
      return m;
    }
  });
}

const PONTUACAO_FORA = /^[\s"'“”‘’«»(\[{,.;:!?/|·—–…]+|[\s"'“”‘’«»)\]},.;:!?/|·—–…]+$/g;

function limpaToken(t) {
  return t.replace(PONTUACAO_FORA, '');
}

function tokenPermitido(token, scope) {
  for (const t of TOKENS) {
    if (t.scope !== 'any' && t.scope !== scope) continue;
    if (t.token === token) return true;
  }
  for (const p of PATTERNS) {
    if (p.scope !== 'any' && p.scope !== scope) continue;
    if (p.re.test(token)) return true;
  }
  return false;
}

function contexto(texto, token) {
  const i = texto.indexOf(token);
  if (i < 0) return '';
  const de = Math.max(0, i - 55);
  const ate = Math.min(texto.length, i + token.length + 55);
  return (de > 0 ? '…' : '') + texto.slice(de, ate).replace(/\s+/g, ' ') + (ate < texto.length ? '…' : '');
}

/** Varre um texto e devolve os tokens com algarismos que não são permitidos. */
function tokensProibidos(texto, scope) {
  const encontrados = [];
  for (const bruto of texto.split(/\s+/)) {
    if (!bruto || !/\d/.test(bruto)) continue;
    const token = limpaToken(bruto);
    if (!token || !/\d/.test(token)) continue;
    if (tokenPermitido(token, scope)) continue;
    encontrados.push(token);
  }
  return encontrados;
}

/**
 * Texto de uma subárvore.
 *
 * `separador: ' '` — o varrimento do corpo. Sem ele, "…da UE-27" seguido de
 * "PIB per capita…" num elemento vizinho colava num único token "UE-27PIB" e o
 * portão dava um falso positivo.
 *
 * `separador: ''` — a comparação de uma cadeia transcrita. É o que o leitor vê:
 * `12<i>340</i>` são "12340" no ecrã. Com o separador a espaço, essa cadeia
 * comparava igual a "12 340" no livro-razão — a fronteira entre elementos
 * passava a valer um espaço, e o agrupamento dos milhares mostrado ao leitor
 * deixava de ter de bater certo com o registado. Os espaços que existem no DOM
 * continuam lá; o que se deixa de fazer é inventar um.
 */
function textoDe(no, { semEstilo = false, separador = ' ' } = {}) {
  const partes = [];
  const anda = (n) => {
    if (!n) return;
    if (n.nodeType === NodeType.TEXT_NODE) {
      partes.push(n.rawText);
      return;
    }
    if (semEstilo) {
      const tag = String(n.rawTagName ?? '').toLowerCase();
      if (tag === 'style' || tag === 'script') return;
    }
    for (const filho of n.childNodes ?? []) anda(filho);
  };
  anda(no);
  return partes.join(separador);
}

/** O texto de um elemento como o leitor o vê, para comparar com uma transcrição. */
function textoTranscrito(el) {
  return normalizeWhitespace(decodeEntities(textoDe(el, { separador: '' })));
}

/**
 * ---------------------------------------------------------------------------
 * DOCUMENTOS DE ESTUDO — a única classe de página com regra própria.
 * ---------------------------------------------------------------------------
 *
 * `/estudos/<slug>/documento` não é uma página deste sítio: é uma obra JÁ
 * PUBLICADA, alojada aqui intacta, com uma faixa nossa por cima. Os algarismos
 * que lá estão são do documento — têm a proveniência que o documento lhes deu,
 * no dia em que foi publicado. Passá-los pelo varrimento seria exigir que uma
 * obra citada se reescrevesse para caber nas regras de quem a cita.
 *
 * A dispensa é POR ISSO, e é estreita. Aplica-se a um ficheiro construído só se
 * TUDO isto for verdade:
 *
 *   1. o endereço é o de um documento de estudo (tabela de rotas);
 *   2. o slug é o de um trabalho do arquivo;
 *   3. existe o ficheiro de origem em studies-src/<slug>/<lingua>.html;
 *   4. o ficheiro construído é, CARÁCTER A CARÁCTER, «origem + faixa» — isto é
 *      o que prova que o documento foi alojado intacto e que nada nosso entrou
 *      abaixo da faixa;
 *   5. a faixa existe uma só vez, liga para a página do estudo, e **o seu texto
 *      não tem um único algarismo**.
 *
 * O que continua a ser conferido: que o documento é auto-contido (não carrega
 * nada de fora — a promessa de «nenhum pedido de rede» não tem excepção para
 * documentos). E as páginas de estudo — /estudos/<slug> — continuam varridas por
 * inteiro, como qualquer outra página. A dispensa é do corpo do documento, e de
 * mais nada.
 *
 * O que NÃO é conferido, e é honesto dizê-lo: que os números do documento
 * estejam certos. Não estão no livro-razão e não vão estar — a sua proveniência
 * é a do próprio documento. Ver DECISIONS §1.19.
 */
function verificaDocumento({ rota, html, root, err }) {
  const { slug } = rota.params;
  const lang = rota.lang;

  if (!workById(slug)) {
    err(`documento de um estudo que não existe no arquivo: "${slug}".`);
    return;
  }
  const origem = documentoDaEdicao(slug, lang);
  if (!origem) {
    err(
      `há um documento construído para "${slug}" (${lang}), mas não há ficheiro de origem em ` +
        `studies-src/${slug}/. Um documento sem origem não pode ser conferido.`,
    );
    return;
  }

  /* 4 — o construído é a origem mais a faixa, e nada mais. */
  let esperado;
  try {
    esperado = documentoServido(slug, lang);
  } catch (e) {
    err(`não foi possível reconstruir o documento "${slug}" (${lang}): ${e.message}`);
    return;
  }
  if (esperado !== html) {
    err(
      `o documento construído não é o documento de origem mais a faixa.\n` +
        `      origem:     ${path.relative(ROOT, origem.ficheiro)}\n` +
        `      construído: ${html.length} carácteres · origem + faixa: ${esperado.length}\n` +
        `      Um documento de estudo é alojado intacto: acrescenta-se-lhe a faixa e mais nada.`,
    );
  }

  /* 5 — a faixa: uma só, a ligar para a página do estudo, sem algarismos. */
  const faixas = root.querySelectorAll('[data-oedp-faixa]');
  if (faixas.length !== 1) {
    err(`o documento tem ${faixas.length} faixas do observatório; tem de ter exactamente uma.`);
    return;
  }
  const faixa = faixas[0];

  const textoDaFaixa = decodeEntities(textoDe(faixa, { semEstilo: true }));
  const algarismos = textoDaFaixa.match(/\d/g);
  if (algarismos) {
    err(
      `a faixa do observatório tem algarismos no texto ("${algarismos.join('')}"): ` +
        `"${normalizeWhitespace(textoDaFaixa).slice(0, 120)}".\n` +
        `      O corpo do documento está dispensado do varrimento porque é obra citada. ` +
        `A faixa é nossa, e por isso não pode trazer números nenhuns.`,
    );
  }

  const destino = routePath('estudo', lang, { slug });
  const marca = faixa.querySelector('[data-oedp-marca]');
  if (!marca) {
    err('a faixa do observatório não traz a marca do sítio.');
  } else if (marca.getAttribute('href') !== destino) {
    err(
      `a marca da faixa liga para "${marca.getAttribute('href')}" e devia ligar para ` +
        `"${destino}", a página deste estudo.`,
    );
  }
  if (!textoDaFaixa.includes(SITE_NAME)) {
    err(`a faixa do observatório não diz o nome do sítio.`);
  }

  /* Auto-contido: a promessa de «nenhum pedido de rede» não abre excepção para
     documentos. Âncoras para fora são legítimas (um estudo cita fontes); o que
     não é legítimo é CARREGAR alguma coisa de fora. */
  const externos = [
    ...html.matchAll(/\s(?:src|srcset|poster)\s*=\s*["']?(https?:)?\/\/[^"'\s>]+/gi),
    ...html.matchAll(/<link\b[^>]*\bhref\s*=\s*["']?(https?:)?\/\/[^"'\s>]+/gi),
    ...html.matchAll(/url\(\s*["']?(?:https?:)?\/\/[^)"']+/gi),
    ...html.matchAll(/@import\s+(?:url\()?\s*["'](?:https?:)?\/\/[^"']+/gi),
  ];
  if (externos.length) {
    const amostra = externos.slice(0, 3).map((m) => m[0].trim().slice(0, 90));
    err(
      `o documento carrega ${externos.length} recurso(s) de fora do domínio: ${amostra.join(' · ')}\n` +
        `      Um documento de estudo tem de ser auto-contido. Ligações para fora são ` +
        `legítimas; pedidos de rede não.`,
    );
  }
}

/**
 * ---------------------------------------------------------------------------
 * OS CAMPOS DE UMA LINHA, NA PÁGINA DESSA LINHA — a sexta origem.
 * ---------------------------------------------------------------------------
 *
 * Uma página do livro-razão é quase só algarismos: o valor, a data de acesso,
 * a data dos dados, o código da edição do documento, o endereço da fonte e —
 * sobretudo — o excerto, que é a prova. Dispensar essas cadeias com
 * `data-nonledger` seria esvaziar o portão exactamente na página onde ele mais
 * importa: bastaria escrever um excerto plausível para o portão o deixar passar.
 *
 * Por isso não há aqui dispensa nenhuma. Cada campo vai marcado e é conferido
 * contra o campo da própria afirmação, carácter a carácter (espaços
 * normalizados) — a mesma disciplina do registo de correções, que já fazia isto
 * um nível abaixo, no campo `corrections`.
 *
 * O valor NÃO está nesta tabela de propósito: um valor entra por <Claim/>, que
 * põe data-claim e é conferido pelos algarismos. Marcar um valor como campo de
 * linha seria uma segunda porta para a mesma coisa.
 */
const CAMPOS_DA_LINHA = new Set([
  'unit',
  'source',
  'document.title',
  'document.edition',
  'document.locator',
  'source_url',
  /**
   * A página do PDF, tal como o próprio endereço a fixa (`…pdf#page=119`).
   *
   * Não é um campo novo do livro-razão: é uma leitura do campo `source_url`,
   * feita aqui com a **cópia local** da regra — como o separador de
   * `attributed_to` (§1.31). Se o gabarito lesse o número por uma função e o
   * portão pela mesma, o portão confirmava a função; assim confirma a linha.
   * Um rótulo «Abrir o documento na página 42» sobre um endereço que fixa a
   * página 24 pára a construção.
   */
  'source_url.page',
  'access_date',
  'reference_date',
  'excerpt',
  'source_flag',
  'source_flag_note',
  'derivation',
  'derived_from',
  'attributed_to',
  'check',
  'id',
]);

/**
 * O separador com que a página escreve `attributed_to` numa linha só.
 *
 * É uma **segunda cópia** da constante que está em src/lib/ledger.mjs, e é de
 * propósito. Se este portão lesse a constante do gabarito, confirmaria a
 * constante e não o livro-razão — o mesmo erro que `campo="study"` cometia
 * antes de sair desta tabela (§1.24). Assim, trocar o separador no gabarito
 * pára o build, que é o que se quer de uma rendição que se diz determinista.
 */
const SEPARADOR_ATRIBUICAO = ' · ';

/** Os campos cuja versão depende da língua da edição. */
const CAMPOS_DA_LINHA_POR_LINGUA = new Set(['derivation', 'source_flag_note']);

/**
 * `derived_from` é uma lista, e o gabarito desenha-a como uma lista de
 * elementos. É o único campo cujas fronteiras entre elementos valem um espaço;
 * todos os outros são uma cadeia só e comparam-se como o leitor os vê.
 */
const CAMPOS_DA_LINHA_EM_LISTA = new Set(['derived_from']);

/**
 * `study` NÃO está na tabela, e é uma correcção a este ficheiro.
 *
 * O que a linha guarda é o **id** do estudo; o que a página mostra é o título,
 * que vem de `src/data/studies.mjs` pela mesma função que a página chamou. Um
 * portão que compare `studyLabel(...)` com `studyLabel(...)` confirma a função,
 * não o livro-razão — era exactamente o que o comentário abaixo proíbe. E os
 * títulos trazem algarismos ("… 2026"), por isso a comparação parecia estar a
 * fazer trabalho. O título de um estudo é uma citação, tem motivo declarado em
 * `allowlist.yml` desde o primeiro dia, e é assim que a página o marca.
 */

/**
 * O que a linha diz naquele campo, lido DIRECTAMENTE da afirmação.
 *
 * Não passa pelos auxiliares que o gabarito usa para compor a página: se o
 * portão lesse o campo pela mesma função que o escreve, confirmaria a função e
 * não o livro-razão.
 */
function campoDaLinha(claim, campo, lang) {
  switch (campo) {
    case 'document.title':
      return claim.document?.title ?? null;
    case 'document.edition':
      return claim.document?.edition ?? null;
    case 'document.locator':
      return claim.document?.locator ?? null;
    case 'source_url.page': {
      /* A cópia local da regra — ver o comentário em CAMPOS_DA_LINHA. */
      const m = String(claim.source_url ?? '').match(/#page=(\d+)$/);
      return m ? m[1] : null;
    }
    case 'attributed_to':
      /* Uma lista escrita numa cadeia só, com a cópia local do separador.
         Não passa por atribuicaoDaLinha() de propósito — ver acima. */
      return Array.isArray(claim.attributed_to) && claim.attributed_to.length
        ? claim.attributed_to.join(SEPARADOR_ATRIBUICAO)
        : null;
    case 'derivation':
      return derivacaoDaLinha(claim, lang);
    case 'source_flag_note':
      return notaDeBandeira(claim, lang);
    case 'derived_from':
      return Array.isArray(claim.derived_from) && claim.derived_from.length
        ? claim.derived_from.join(' ')
        : null;
    case 'id':
      return claim.id;
    default:
      return claim[campo] ?? null;
  }
}

/**
 * ---------------------------------------------------------------------------
 * O SELO EM CADA VALOR — a auditoria que era feita à mão.
 * ---------------------------------------------------------------------------
 *
 * `IDENTIDADE.md` §5.3: «onde aparece um valor, aparece o selo. Sem excepção de
 * página.» A promessa estava escrita e não estava imposta: a 15.08.2026 a
 * primeira página tinha 18 afirmações distintas sem selo nenhum, e os seis
 * selos da leitura breve apontavam para a linha do PAI e não para a do valor
 * mostrado — um leitor que clicasse no «18» aterrava na linha do «82».
 *
 * A regra, em duas partes:
 *
 *   1. **fora de um `<svg>`** — tem de existir uma âncora `.src-chip` cujo
 *      `href` é o caminho da linha DAQUELE id, e ela tem de estar ao pé do
 *      valor: procura-se a subir, e a procura pára ao atravessar um elemento de
 *      secção. É isto que dá corpo a «ao lado»: um selo no fim da página, ou na
 *      secção seguinte, não é uma porta ao pé do número;
 *
 *   2. **dentro de um `<svg>`** — vale o mesmo, e é a mesma procura: um `<a>`
 *      dentro de um desenho não se lê como porta, por isso o selo dos valores
 *      desenhados vive na legenda do próprio instrumento, que é o primeiro
 *      antepassado comum (DECISIONS §1.34, ponto 2).
 *
 * O que esta auditoria NÃO faz: não decide se o selo está bonito nem se está
 * visível. Confere que existe, e que abre a linha do valor que está ao lado.
 *
 * As páginas do próprio livro-razão estão fora: a página de uma linha É a
 * linha, e um selo para si própria seria uma porta para a divisão onde já se
 * está.
 */
const TAGS_SVG = new Set(['svg', 'g', 'text', 'tspan', 'title', 'desc']);

function dentroDeSvg(el) {
  let p = el.parentNode;
  while (p) {
    if (String(p.rawTagName ?? '').toLowerCase() === 'svg') return true;
    p = p.parentNode;
  }
  return false;
}

/** O primeiro antepassado que é o próprio instrumento, ou a secção que o contém. */
function raizDoInstrumento(el) {
  let p = el.parentNode;
  let seccao = null;
  while (p) {
    const attrs = p.attributes ?? {};
    if ('data-instrumento' in attrs) return p;
    const tag = String(p.rawTagName ?? '').toLowerCase();
    if (!seccao && (tag === 'section' || tag === 'article')) seccao = p;
    p = p.parentNode;
  }
  return seccao;
}

function temChipPara(no, alvos) {
  for (const a of no?.querySelectorAll?.('.src-chip') ?? []) {
    if (String(a.rawTagName ?? '').toLowerCase() !== 'a') continue;
    if (alvos.includes(decodeEntities(a.getAttribute('href') ?? ''))) return true;
  }
  return false;
}

function auditaSelo(el, id, lang, err) {
  /* A linha daquele id, em qualquer das duas edições. Quase sempre é a da
     página; o bloco «a mesma frase na outra edição», nas páginas de leitura,
     é escrito na outra língua de propósito e o seu selo leva à linha na outra
     edição — o que continua a ser a porta para a linha DAQUELE valor. */
  const alvos = LANGS.map((l) => routePath('linha', l, { slug: id }));
  const alvo = routePath('linha', lang, { slug: id });

  if (dentroDeSvg(el)) {
    /* Um <a> dentro de um desenho não se lê como porta: o selo de um valor
       desenhado vive na LEGENDA do instrumento — e tem de ser essa legenda,
       marcada com data-legenda-selos, e não um selo qualquer que por acaso
       esteja na mesma secção. */
    const raiz = raizDoInstrumento(el);
    const legendas = raiz?.querySelectorAll?.('[data-legenda-selos]') ?? [];
    for (const legenda of legendas) {
      if (temChipPara(legenda, alvos)) return;
    }
    err(
      `o valor da afirmação "${id}" está desenhado dentro de um <svg> e não tem selo na ` +
        `legenda do seu instrumento.\n` +
        `      esperava-se <a class="src-chip" href="${alvo}"> dentro de um ` +
        `[data-legenda-selos] deste instrumento` +
        (legendas.length ? '' : ' — e este instrumento não tem legenda de selos nenhuma') +
        `.\n      É a convenção do §1.34: um <a> dentro de um desenho não é uma porta que se veja.`,
    );
    return;
  }

  /* Fora de um desenho, o selo é do VALOR e não da secção: tem de estar dentro
     do elemento que embrulha o número — a frase, o mosaico, a célula. Procurar
     mais acima deixava passar um selo na secção seguinte. */
  const pai = el.parentNode;
  if (pai && temChipPara(pai, alvos)) return;

  err(
    `o valor da afirmação "${id}" aparece sem selo para a sua própria linha.\n` +
      `      esperava-se <a class="src-chip" href="${alvo}"> dentro do mesmo elemento que ` +
      `embrulha o número — a frase, o mosaico ou a célula, e não a secção.\n` +
      `      Use <Claim id="${id}" chip/>, ou <Frase … selos/> quando o valor vai numa frase.\n` +
      `      Um selo que aponte para a linha do PAI não conta: a porta tem de abrir a linha do ` +
      `número que está à vista.`,
  );
}

function ficheirosHtml(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...ficheirosHtml(full));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/* ------------------------------------------------------------------ varrimento */

for (const file of ficheirosHtml(DIST)) {
  ficheiros++;
  const rel = path.relative(DIST, file);
  const html = fs.readFileSync(file, 'utf8');
  const root = parse(html, {
    comment: false,
    blockTextElements: { script: true, style: true, noscript: false },
  });

  const err = (msg) => erros.push({ rel, msg });

  /* A língua desta edição, lida da própria página. É ela que decide qual das
     duas versões do motivo de uma correção tem de estar renderizada. */
  const linguaPagina = LINGUA_POR_HREFLANG[root.querySelector('html')?.getAttribute('lang') ?? ''] ?? null;

  const caminho = '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '');
  const rota = matchPath(caminho);

  /* --- 0. documentos de estudo: obra citada, regra própria, e sai daqui --- */
  if (rota?.key === 'documento') {
    documentos++;
    verificaDocumento({ rota, html, root, err });
    continue;
  }

  /* As páginas do próprio livro-razão: o índice e a página de cada linha. */
  const paginaDoLivro = rota?.key === 'linha' || rota?.key === 'livro';
  let claimDaPagina = null;
  if (rota?.key === 'livro') paginasDoLivro++;
  if (rota?.key === 'linha') {
    claimDaPagina = claims.get(rota.params.slug) ?? null;
    if (!claimDaPagina) {
      err(
        `há uma página de linha para "${rota.params.slug}", que não é nenhuma afirmação do ` +
          `livro-razão. Uma porta tem de dar para alguma divisão.`,
      );
    } else {
      linhasConstruidas.add(`${rota.lang}:${claimDaPagina.id}`);
    }
  }

  /* O endereço diz de que língua é a página; o <html lang> tem de concordar.
     Sem isto, uma edição inglesa construída com as palavras portuguesas passava
     despercebida — e é a língua da página que decide que motivo de correção e
     que aritmética são conferidos. */
  if (rota && linguaPagina && linguaPagina !== rota.lang) {
    err(
      `esta página está no endereço da edição "${rota.lang}" mas declara <html lang> de ` +
        `"${linguaPagina}".`,
    );
  }

  /* --- 1. ilhas de dados do livro-razão, antes de as remover --- */
  for (const el of root.querySelectorAll('script[data-ledger-json]')) {
    let dados;
    try {
      dados = JSON.parse(decodeEntities(el.rawText ?? el.text ?? ''));
    } catch (e) {
      err(`ilha de dados data-ledger-json com JSON inválido: ${e.message}`);
      continue;
    }
    /**
     * Convenção das ilhas de dados — tudo o que lá está tem origem declarada:
     *   <x>            número  → tem de existir <x>_claim, e o valor bate certo
     *   <x>_texto      cadeia  → tem de ser IGUAL ao value publicado dessa afirmação
     *   <x>_ref        cadeia  → tem de ser IGUAL ao reference_date dessa afirmação
     *   <x>_claim      cadeia  → o id
     *   estrutura      objecto → geometria e escala do instrumento, dispensadas
     *                            da regra mediante "estrutura_motivo" declarado
     *   qualquer outra cadeia   → sem algarismos (fora os tokens da lista)
     */
    const raiz = { ...dados };
    if ('estrutura' in raiz) {
      const motivo = raiz.estrutura_motivo;
      if (!motivo || !CONTEXTOS.has(motivo)) {
        err(
          `ilha de dados: tem "estrutura" mas não declara um "estrutura_motivo" válido. ` +
            `Motivos aceites: ${[...CONTEXTOS].join(', ')}.`,
        );
      } else {
        delete raiz.estrutura;
        delete raiz.estrutura_motivo;
      }
    }

    const resolve = (no, base, aqui) => {
      const id = no[`${base}_claim`];
      if (!id) {
        err(`ilha de dados: "${aqui}" não tem o "${base}_claim" que declara a sua origem.`);
        return null;
      }
      idsUsados.add(id);
      const claim = claims.get(id);
      if (!claim) {
        err(`ilha de dados: "${aqui}" aponta para a afirmação "${id}", que não existe.`);
        return null;
      }
      return claim;
    };

    const visita = (no, caminho) => {
      if (Array.isArray(no)) return no.forEach((v, i) => visita(v, `${caminho}[${i}]`));
      if (!no || typeof no !== 'object') return;
      for (const [k, v] of Object.entries(no)) {
        const aqui = caminho ? `${caminho}.${k}` : k;

        if (typeof v === 'number') {
          const claim = resolve(no, k, aqui);
          if (!claim) continue;
          const esperado = parsePtNumber(claim.value);
          if (esperado === null || Math.abs(esperado - v) > 1e-9) {
            err(`ilha de dados: "${aqui}" tem ${v}, mas o livro-razão diz "${claim.value}".`);
          }
          continue;
        }

        if (typeof v === 'string') {
          if (k.endsWith('_claim')) continue;
          if (k.endsWith('_texto')) {
            const claim = resolve(no, k.slice(0, -'_texto'.length), aqui);
            if (claim && String(claim.value) !== v) {
              err(`ilha de dados: "${aqui}" é "${v}", mas o valor publicado é "${claim.value}".`);
            }
            continue;
          }
          if (k.endsWith('_ref')) {
            const claim = resolve(no, k.slice(0, -'_ref'.length), aqui);
            if (claim && String(claim.reference_date) !== v) {
              err(
                `ilha de dados: "${aqui}" é "${v}", mas o reference_date da afirmação é "${claim.reference_date}".`,
              );
            }
            continue;
          }
          for (const token of tokensProibidos(v, 'body')) {
            err(
              `ilha de dados: a cadeia em "${aqui}" tem o token "${token}", com algarismos e sem origem. ` +
                `As frases compõem-se no HTML, a partir de <Claim/>; as ilhas levam só valores do livro-razão.`,
            );
          }
          continue;
        }

        visita(v, aqui);
      }
    };
    visita(raiz, '');
  }

  /* --- 2. <head>: título e descrição --- */
  const titulo = root.querySelector('head title');
  const descricao = root.querySelector('head meta[name="description"]');
  let textoHead = '';
  if (titulo) textoHead += ' ' + decodeEntities(titulo.text);
  if (descricao) textoHead += ' ' + decodeEntities(descricao.getAttribute('content') ?? '');

  /**
   * O <head> de uma página de linha é COMPOSTO da própria linha, não escrito.
   *
   * No <head> não há markup onde pendurar as marcas, e o título de uma linha é
   * quase todo algarismos («89,7 % do PIB — …»). Em vez de uma dispensa, uma
   * reprodução: o portão recompõe o título e a descrição a partir do
   * livro-razão e exige que sejam iguais aos construídos.
   */
  if (claimDaPagina) {
    const tituloEsperado = tituloDaLinha(claimDaPagina, rota.lang);
    const descricaoEsperada = descricaoDaLinha(claimDaPagina, rota.lang);
    const conteudoDe = (prop) =>
      normalizeWhitespace(
        decodeEntities(root.querySelector(`head meta[property="${prop}"]`)?.getAttribute('content') ?? ''),
      );
    /* og: repete o título e a descrição. Hoje é a mesma variável no gabarito, e
       por isso bate certo por construção — que é precisamente a razão para
       conferir: «por construção» é uma garantia que ninguém verificou. */
    const paresHead = [
      ['<title>', normalizeWhitespace(decodeEntities(titulo?.text ?? '')), tituloEsperado],
      [
        '<meta name="description">',
        normalizeWhitespace(decodeEntities(descricao?.getAttribute('content') ?? '')),
        descricaoEsperada,
      ],
      ['<meta property="og:title">', conteudoDe('og:title'), tituloEsperado],
      ['<meta property="og:description">', conteudoDe('og:description'), descricaoEsperada],
    ];
    for (const [onde, lido, esperado] of paresHead) {
      if (lido !== normalizeWhitespace(esperado)) {
        err(
          `o ${onde} desta página de linha não é o que a linha compõe.\n` +
            `      esperado:    ${normalizeWhitespace(esperado).slice(0, 150)}\n` +
            `      construído:  ${lido.slice(0, 150)}`,
        );
      }
      textoHead = textoHead.split(esperado).join(' ');
    }
  }

  for (const cadeia of CADEIAS_HEAD) textoHead = textoHead.split(cadeia).join(' ');
  for (const token of tokensProibidos(textoHead, 'head')) {
    err(
      `<head>: o token "${token}" tem algarismos e não é nem um título de estudo ` +
        `registado nem uma excepção declarada.\n      contexto: ${contexto(textoHead, token)}`,
    );
  }

  /* --- 3. invariantes de identidade --- */
  const canonical = root.querySelector('head link[rel="canonical"]');
  if (!canonical) err('falta <link rel="canonical">.');
  else {
    const href = canonical.getAttribute('href') ?? '';
    if (!href.startsWith(`https://${SITE_HOST}/`) && href !== `https://${SITE_HOST}`) {
      err(`o canonical não está no domínio canónico: "${href}" (esperado https://${SITE_HOST}/…).`);
    }
  }
  if (!html.includes(AUTHORSHIP_LINE)) {
    err(`falta a linha de autoria no rodapé: "${AUTHORSHIP_LINE}".`);
  }

  /**
   * A PORTA DAS CORRECÇÕES — exactamente uma por página construída.
   *
   * Medido a 15.08.2026: existia em 2 páginas de 296. A chegada mais provável
   * de quem quer contestar um número sobre si próprio é a página da linha desse
   * número, vinda de um motor de busca — e era precisamente aí que não havia
   * nenhuma maneira de o dizer. Uma publicação que promete que nada é apagado
   * tem de pôr a porta onde o erro é visto.
   *
   * Exactamente uma, e não «pelo menos uma»: duas portas na mesma página são
   * duas respostas para a mesma pergunta, e o leitor não tem como saber qual é
   * a certa. E não basta existir: tem de dizer o endereço para onde se escreve,
   * e não pode estar escondida — `hidden`, `aria-hidden="true"` ou a classe
   * `.vh`, nela ou em qualquer antepassado.
   *
   * **OS DOCUMENTOS DE ESTUDO ESTÃO FORA DESTA CONTA, POR DESENHO.** Um
   * documento em `/estudos/<slug>/documento` é obra JÁ PUBLICADA, alojada
   * intacta e conferida carácter a carácter contra a origem: acrescentar-lhe
   * uma caixa nossa quebrava essa igualdade, que é a garantia mais forte que o
   * sítio dá sobre eles. Quem quiser corrigir um documento chega à porta pela
   * página do estudo, que tem a sua. Ver DECISIONS §1.36, item 1.
   */
  const portas = root.querySelectorAll('[data-porta-correccoes]');
  if (portas.length !== 1) {
    err(
      `esta página tem ${portas.length} porta(s) de correcções; tem de ter exactamente uma.\n` +
        `      <PortaDeCorreccoes/> entra pelo invólucro (Base.astro) em todas as páginas; ` +
        `uma página que a ponha no seu próprio aparelho passa portaNoRodape={false}.`,
    );
  } else {
    /* Uma porta que não se lê não é uma porta. Um elemento vazio, ou escondido
       de olhos ou de leitores de ecrã, passava a contagem e não servia a
       ninguém — e era isso que a contagem sozinha não via. */
    const porta = portas[0];
    const textoDaPorta = decodeEntities(textoDe(porta, { semEstilo: true }));
    if (!textoDaPorta.includes(ENDERECO_CORRECOES)) {
      err(
        `a porta de correcções não diz o endereço para onde se escreve ` +
          `("${ENDERECO_CORRECOES}").\n      Uma porta que não diz para onde vai não é uma porta.`,
      );
    }
    const escondido = (() => {
      let no = porta;
      while (no && no.nodeType !== undefined) {
        const attrs = no.attributes ?? {};
        if ('hidden' in attrs) return 'hidden';
        if ((attrs['aria-hidden'] ?? '') === 'true') return 'aria-hidden="true"';
        const klass = String(attrs['class'] ?? '');
        if (/(^|\s)vh(\s|$)/.test(klass)) return 'class="vh"';
        no = no.parentNode;
      }
      return null;
    })();
    if (escondido) {
      err(
        `a porta de correcções está escondida por ${escondido} (nela ou num antepassado). ` +
          `Estar na página e não ser vista é o mesmo que não estar.`,
      );
    }
  }

  /* --- 4. corpo: retirar o que é legítimo, e ver o que sobra --- */
  const body = root.querySelector('body') ?? root;
  for (const el of body.querySelectorAll('script, style')) el.remove();

  const aRemover = [];

  for (const el of body.querySelectorAll('[data-claim]')) {
    const id = el.getAttribute('data-claim');
    if (!paginaDoLivro) idsUsados.add(id);
    const claim = claims.get(id);
    if (!claim) {
      err(
        `a página cita a afirmação "${id}", que não existe no livro-razão. ` +
          `Crie ledger/claims/${id}.yml ou corrija o id.`,
      );
      aRemover.push(el);
      continue;
    }
    const renderizado = decodeEntities(textoDe(el));
    if (digitsOf(renderizado) !== digitsOf(claim.value)) {
      err(
        `a afirmação "${id}" foi renderizada como "${renderizado.trim()}" mas o ` +
          `livro-razão diz "${claim.value}".`,
      );
    }
    if (rota && !paginaDoLivro) auditaSelo(el, id, rota.lang, err);
    aRemover.push(el);
  }

  /**
   * O registo de correções.
   *
   * Nada aqui é excepção: cada pedaço — data, valor antigo, valor novo, motivo
   * e id da afirmação — é conferido contra o campo corrections da própria
   * afirmação. O motivo é prosa livre e pode citar números («o valor 4 vinha
   * do colofão…»); por isso é comparado por igualdade de texto, não dispensado.
   * Reescrever a história de uma correção falha o build.
   *
   * O motivo é o único campo com duas versões: `reason` em português e
   * `reason_en` em inglês. O portão confere o motivo **da língua daquela
   * edição** — a edição inglesa a mostrar o motivo português falha o build,
   * tal como falha a portuguesa a mostrar o inglês.
   */
  const CAMPOS_CORRECAO = {
    date: 'exacto',
    kind: 'natureza',
    /* Numa revisão de proveniência, `field` diz qual o campo que mudou, e
       `old_value`/`new_value` são os valores DESSE campo — endereços, por
       exemplo. Comparam-se como texto e não por algarismos: dois endereços
       podem ter os mesmos algarismos e ser sítios diferentes. */
    field: 'exacto',
    old_value: 'algarismos',
    new_value: 'algarismos',
    reason: 'motivo',
    id: 'exacto',
  };
  for (const el of body.querySelectorAll('[data-correcao-claim]')) {
    const id = el.getAttribute('data-correcao-claim');
    const n = Number(el.getAttribute('data-correcao-n'));
    const campo = el.getAttribute('data-correcao-campo');
    aRemover.push(el);

    const modo = CAMPOS_CORRECAO[campo];
    if (!modo) {
      err(
        `data-correcao-campo="${campo}" não existe. ` +
          `Aceites: ${Object.keys(CAMPOS_CORRECAO).join(', ')}.`,
      );
      continue;
    }
    const claim = claims.get(id);
    if (!claim) {
      err(`o registo de correções cita a afirmação "${id}", que não existe no livro-razão.`);
      continue;
    }
    if (!paginaDoLivro) idsUsados.add(id);

    const renderizado = textoTranscrito(el);
    if (campo === 'id') {
      if (renderizado !== String(claim.id)) {
        err(`no registo de correções, o id foi renderizado como "${renderizado.trim()}" mas a afirmação é "${claim.id}".`);
      }
      continue;
    }

    const corr = (claim.corrections ?? [])[n];
    if (!corr) {
      err(`o registo de correções cita a correção #${n + 1} de "${id}", que não existe.`);
      continue;
    }
    /* O motivo resolve-se pela língua da edição, e não há recurso à outra:
       mostrar o motivo português numa página inglesa é o defeito que o campo
       reason_en veio fechar. Sem língua legível na página, não se confere nada
       — falha-se. */
    if (modo === 'motivo') {
      if (!linguaPagina) {
        err(
          `o registo de correções aparece numa página sem <html lang> reconhecido; ` +
            `sem saber a língua da edição não é possível conferir o motivo.`,
        );
        continue;
      }
      const motivo = motivoDaEntrada(corr, linguaPagina);
      if (motivo === null) {
        err(
          `a correção #${n + 1} de "${id}" não tem motivo escrito em "${linguaPagina}". ` +
            `O motivo tem de existir nas duas línguas (reason e reason_en).`,
        );
        continue;
      }
      if (renderizado !== normalizeWhitespace(motivo)) {
        err(
          `no registo, o motivo da correção #${n + 1} de "${id}" não é o da edição ` +
            `"${linguaPagina}".\n` +
            `      esperado:    ${normalizeWhitespace(motivo).slice(0, 120)}\n` +
            `      renderizado: ${normalizeWhitespace(renderizado).slice(0, 120)}`,
        );
      }
      continue;
    }

    const esperado = String(corr[campo]);

    /* Um endereço é texto, não uma sequência de algarismos: numa revisão de
       proveniência os dois valores comparam-se carácter a carácter. */
    if (corr.kind === 'proveniencia' && (campo === 'old_value' || campo === 'new_value')) {
      if (renderizado !== normalizeWhitespace(esperado)) {
        err(
          `no registo, "${campo}" da revisão de proveniência #${n + 1} de "${id}" não é o do ` +
            `livro-razão.\n      esperado:    ${normalizeWhitespace(esperado).slice(0, 120)}\n` +
            `      renderizado: ${renderizado.slice(0, 120)}`,
        );
      }
      continue;
    }

    /* A natureza da entrada pode aparecer como identificador ou como um dos
       seus rótulos traduzidos — e mais nada. Uma entrada rotulada
       «atualização» com kind "correcao" no livro-razão não passa: era assim
       que se reclassificava uma confissão em silêncio. */
    if (modo === 'natureza') {
      const aceites = renderizacoesAceites(esperado).map(normalizeWhitespace);
      if (!aceites.includes(renderizado)) {
        err(
          `no registo, a natureza da correção #${n + 1} de "${id}" foi renderizada como ` +
            `"${renderizado.trim()}", mas no livro-razão é "${esperado}" ` +
            `(aceite: ${aceites.join(', ')}).`,
        );
      }
      continue;
    }

    const bate =
      modo === 'algarismos'
        ? digitsOf(renderizado) === digitsOf(esperado)
        : renderizado === normalizeWhitespace(esperado);
    if (!bate) {
      err(
        `no registo de correções, "${campo}" de "${id}" foi renderizado como ` +
          `"${renderizado.trim().slice(0, 120)}" mas o livro-razão diz ` +
          `"${esperado.slice(0, 120)}".`,
      );
    }
  }

  /* --- os campos de uma linha do livro-razão, na página dessa linha --- */
  const camposRenderizados = new Set();
  for (const el of body.querySelectorAll('[data-linha-claim]')) {
    const id = el.getAttribute('data-linha-claim');
    const campo = el.getAttribute('data-linha-campo');
    camposRenderizados.add(`${id}:${campo}`);
    aRemover.push(el);

    /**
     * Onde é que esta marca vale — e a regra estava escrita e não imposta.
     *
     * `data-linha-*` é a marca de um campo do livro-razão **na página do
     * livro-razão**: no índice, ou na página daquela linha. Sem esta guarda,
     * qualquer página podia citar qualquer campo de qualquer linha e passar —
     * uma segunda porta para pôr texto do livro-razão em prosa corrente, a
     * contornar o registo de citações (`data-verbatim`) e a disciplina de que
     * um valor entra por <Claim/> e por mais lado nenhum.
     */
    if (!paginaDoLivro) {
      err(
        `data-linha-claim="${id}" numa página que não é do livro-razão. ` +
          `Esta marca é dos campos de uma linha, na página dessa linha ou no índice.\n` +
          `      Noutra página: um valor entra por <Claim id="…"/>, e uma citação por data-verbatim.`,
      );
      continue;
    }
    if (claimDaPagina && id !== claimDaPagina.id) {
      err(
        `a página da linha "${claimDaPagina.id}" renderiza o campo "${campo}" da linha "${id}". ` +
          `Uma página de linha só mostra os campos da sua própria linha.`,
      );
      continue;
    }

    if (!CAMPOS_DA_LINHA.has(campo)) {
      err(
        `data-linha-campo="${campo}" não existe. ` +
          `Aceites: ${[...CAMPOS_DA_LINHA].join(', ')}.\n` +
          `      O valor de uma afirmação não entra por aqui: entra por <Claim id="…"/>.`,
      );
      continue;
    }
    const claim = claims.get(id);
    if (!claim) {
      err(`a página cita o campo "${campo}" da afirmação "${id}", que não existe no livro-razão.`);
      continue;
    }
    if (CAMPOS_DA_LINHA_POR_LINGUA.has(campo) && !linguaPagina) {
      err(
        `o campo "${campo}" de "${id}" aparece numa página sem <html lang> reconhecido; ` +
          `sem saber a língua da edição não é possível conferi-lo.`,
      );
      continue;
    }

    const esperado = campoDaLinha(claim, campo, linguaPagina);
    if (esperado === null || esperado === undefined) {
      err(
        `a página renderiza o campo "${campo}" de "${id}", mas a linha não tem esse campo` +
          (CAMPOS_DA_LINHA_POR_LINGUA.has(campo) ? ` na edição "${linguaPagina}"` : '') +
          `.\n      Um campo que a linha não tem não se mostra — nem vazio, nem com um valor plausível.`,
      );
      continue;
    }

    const renderizado = CAMPOS_DA_LINHA_EM_LISTA.has(campo)
      ? normalizeWhitespace(decodeEntities(textoDe(el)))
      : textoTranscrito(el);
    if (renderizado !== normalizeWhitespace(String(esperado))) {
      err(
        `o campo "${campo}" de "${id}" não foi transcrito fielmente do livro-razão.\n` +
          `      no livro-razão: ${normalizeWhitespace(String(esperado)).slice(0, 150)}\n` +
          `      renderizado:    ${renderizado.slice(0, 150)}`,
      );
    }

    /**
     * O endereço é o único campo cujo destino o leitor segue sem o ler.
     *
     * O portão não varre atributos (limite 2) — mas aqui o atributo É a
     * afirmação: uma ligação rotulada com o endereço da fonte e a apontar para
     * outro sítio seria uma mentira que nenhum outro varrimento apanha. É a
     * única excepção, e é estreita: só o href da âncora que embrulha o campo.
     */
    if (campo === 'source_url') {
      const ancora = el.parentNode?.rawTagName?.toLowerCase() === 'a' ? el.parentNode : null;
      const destino = ancora?.getAttribute('href') ?? null;
      if (destino !== null && decodeEntities(destino) !== String(esperado)) {
        err(
          `o endereço de "${id}" está escrito como "${String(esperado).slice(0, 90)}" mas a ` +
            `ligação aponta para "${decodeEntities(destino).slice(0, 90)}".`,
        );
      }
    }
  }

  /**
   * Um endereço que fixa a página tem de DIZER a página.
   *
   * A conferência de `source_url.page` apanha um rótulo que discorda do
   * endereço; não apanhava um rótulo que não existe. Um endereço
   * `…pdf#page=119` sem «Abrir o documento na página 119» manda o leitor para
   * a página certa e não lhe diz que o faz — e uma ligação que não anuncia o
   * que abre é a mesma opacidade que o `#page=` veio fechar.
   */
  if (claimDaPagina) {
    const pagina = campoDaLinha(claimDaPagina, 'source_url.page', linguaPagina);
    if (pagina && !camposRenderizados.has(`${claimDaPagina.id}:source_url.page`)) {
      err(
        `o endereço de "${claimDaPagina.id}" fixa a página ${pagina} (\`#page=\`) e esta página ` +
          `não a diz.\n      Falta o rótulo com data-linha-campo="source_url.page" ao pé da ligação.`,
      );
    }
  }

  for (const el of body.querySelectorAll('[data-verbatim]')) {
    const chave = el.getAttribute('data-verbatim');
    const registado = VERBATIM[chave];
    if (!registado) {
      err(`data-verbatim="${chave}" não corresponde a nenhuma citação em src/data/verbatim.mjs.`);
      aRemover.push(el);
      continue;
    }
    const renderizado = textoTranscrito(el);
    const esperado = normalizeWhitespace(registado.text);
    if (renderizado !== esperado) {
      err(
        `a citação "${chave}" não foi transcrita fielmente.\n` +
          `      registado:   ${esperado.slice(0, 120)}…\n` +
          `      renderizado: ${renderizado.slice(0, 120)}…`,
      );
    }
    aRemover.push(el);
  }

  for (const el of body.querySelectorAll('[data-nonledger]')) {
    const motivo = el.getAttribute('data-nonledger');
    if (!CONTEXTOS.has(motivo)) {
      err(
        `data-nonledger="${motivo}" não é um motivo declarado. ` +
          `Motivos aceites: ${[...CONTEXTOS].join(', ')} (ver ledger/allowlist.yml).`,
      );
    }
    aRemover.push(el);
  }

  for (const el of aRemover) {
    try {
      el.remove();
    } catch {
      /* já removido com um antepassado */
    }
  }

  const textoCorpo = decodeEntities(textoDe(body));
  for (const token of tokensProibidos(textoCorpo, 'body')) {
    err(
      `algarismos fora do livro-razão: "${token}"\n` +
        `      contexto: ${contexto(textoCorpo, token)}\n` +
        `      Se é uma medição, faça dela uma linha do livro-razão e cite-a com <Claim id="…"/>.\n` +
        `      Se é estrutura (data, título, escala), embrulhe-a em data-nonledger="…".`,
    );
  }
}

/* ------------------------------------------------------------------ relatório */

for (const [id] of claims) {
  if (!idsUsados.has(id)) {
    avisos.push(
      `a afirmação "${id}" está no livro-razão e tem página própria, mas nenhuma outra página a cita.`,
    );
  }
}

/**
 * Uma página por linha, nas duas edições, da mesma construção.
 *
 * É a promessa desta secção do sítio, e é o que a torna endereçável: cada selo
 * aponta para uma destas páginas. Se uma faltar, o selo dessa linha aponta para
 * um 404 — e é melhor falhar a construção do que publicar uma porta que não abre.
 */
for (const [id] of claims) {
  for (const lang of LANGS) {
    if (!linhasConstruidas.has(`${lang}:${id}`)) {
      erros.push({
        rel: routePath('linha', lang, { slug: id }),
        msg:
          `a afirmação "${id}" não tem página construída na edição "${lang}". ` +
          `Todo o selo de proveniência aponta para aqui.`,
      });
    }
  }
}
if (paginasDoLivro !== LANGS.length) {
  erros.push({
    rel: routePath('livro', 'pt'),
    msg: `o índice do livro-razão foi construído ${paginasDoLivro} vez(es); esperava-se uma por edição (${LANGS.length}).`,
  });
}

console.log('');
console.log(
  cinza(
    `  portão de HTML · ${ficheiros} páginas · ${idsUsados.size}/${claims.size} afirmações citadas ` +
      `fora do livro-razão · ${linhasConstruidas.size} páginas de linha` +
      (documentos ? ` · ${documentos} documento(s) de estudo, conferidos contra a origem` : ''),
  ),
);

if (avisos.length) {
  console.log('');
  console.log(amarelo(`  ${avisos.length} aviso(s):`));
  for (const a of avisos) console.log(cinza('    · ' + a));
}

if (erros.length) {
  console.log('');
  console.error(vermelho(`  O PORTÃO DE HTML FECHOU — ${erros.length} erro(s):`));
  const porFicheiro = new Map();
  for (const e of erros) {
    if (!porFicheiro.has(e.rel)) porFicheiro.set(e.rel, []);
    porFicheiro.get(e.rel).push(e.msg);
  }
  for (const [rel, msgs] of porFicheiro) {
    console.error('');
    console.error('  ' + vermelho(rel));
    for (const m of msgs) console.error('    ' + vermelho('✗') + ' ' + m);
  }
  console.error('');
  process.exit(1);
}

console.log('');
console.log('  ' + verde('✓') + ' nenhum algarismo sem proveniência nas páginas construídas.');
console.log('');

/* =============================================================================
 * LIMITES DESTE VARRIMENTO — ler antes de confiar nele.
 *
 * 1. Só vê texto. Números dentro de <script> e <style> não são varridos, com
 *    uma excepção: as ilhas <script data-ledger-json>, essas são conferidas
 *    valor a valor contra o livro-razão.
 * 2. Não vê atributos (title, alt, aria-label, conteúdo gerado por CSS).
 * 3. As coordenadas da CAOP são dados geométricos, não afirmações: a sua
 *    proveniência é a citação transcrita, não uma linha do livro-razão.
 * 4. data-nonledger é uma afirmação de confiança de quem escreve o gabarito.
 *    O portão confere que o motivo é um dos declarados; não confere que o
 *    número lá dentro seja mesmo estrutural. É por isso que a lista de motivos
 *    é curta e cada um tem de justificar-se em ledger/allowlist.yml.
 * 5. Um número escrito por extenso ("vinte e seis por cento") passa incólume.
 * 6. O CORPO DE UM DOCUMENTO DE ESTUDO não é varrido — é obra já publicada,
 *    com proveniência própria. Em troca, esse ficheiro é conferido de outra
 *    maneira, mais apertada: tem de ser, carácter a carácter, o ficheiro de
 *    origem mais a faixa do observatório, e a faixa não pode ter um único
 *    algarismo. Ver verificaDocumento() e DECISIONS §1.19.
 * 7. O <head> de uma página de linha é conferido por reprodução: o portão
 *    recompõe o título e a descrição com as MESMAS funções que a página usou
 *    (src/lib/livro.mjs). Isso apanha um cabeçalho escrito à mão, um cabeçalho
 *    da linha errada e um cabeçalho da língua errada; não pode apanhar uma
 *    frase mal composta, porque é a mesma composição dos dois lados. A
 *    alternativa — a mesma frase escrita em dois sítios — divergiria na
 *    primeira alteração e daria uma falsa garantia pior do que esta.
 * 8. `data-linha-*` NÃO É UMA DISPENSA: é o contrário. Confere o texto
 *    renderizado contra o campo da própria afirmação, carácter a carácter. O
 *    que ele não pode conferir é se o campo do livro-razão está certo — isso é
 *    a verificação contra a fonte, e é trabalho de quem não escreveu a linha.
 * ========================================================================== */
