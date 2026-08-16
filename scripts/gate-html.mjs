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
 *   7. data-prova="<chave>"     — um número do sítio sobre si próprio (linhas
 *                                 publicadas, correções, cobertura). O portão
 *                                 RECALCULA a chave por conta própria, do seu
 *                                 ponto de observação, e compara. Não é uma
 *                                 dispensa: é uma origem conferida, como a 6.
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
import { SITE_HOST, SITE_NAME } from '../site.config.mjs';
import { ENDERECO_CORRECOES } from '../src/data/metodo.mjs';
import { SOBRE } from '../src/data/sobre.mjs';
import { VERIFICACAO } from '../src/data/verificacao.mjs';
import { prova, CAMINHO_DA_PROVA } from '../src/lib/prova.mjs';
import {
  carregaFormas,
  comparador,
  procura,
  procuraTravessoes,
  emCitacao,
} from './ortografia.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const DIST = path.join(ROOT, 'dist');
const ALLOWLIST = path.join(ROOT, 'ledger', 'allowlist.yml');
const RESTANTES = path.join(ROOT, 'ortografia', 'restantes.yml');

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

/**
 * A prova, nas duas edições. As chaves e os valores são os mesmos; o que muda
 * é a PORTA, que é uma rota e por isso tem edição. O portão precisa das duas:
 * a porta que exige numa página inglesa é a inglesa.
 *
 * Isto NÃO é a conta contra a qual os números são conferidos — essa é a do
 * próprio portão, em contasDoPortao(). Isto é o que se compara com ela.
 */
const PROVA_POR_LINGUA = { pt: prova('pt'), en: prova('en') };
const PROVA = PROVA_POR_LINGUA.pt;

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
const CADEIAS_HEAD = [...EDITIONS.map((e) => e.title), SITE_NAME].sort(
  (a, b) => b.length - a.length,
);

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
/** Valores auditados pela regra do selo, e quantos ficaram sem ele (sempre 0: falha). */
let valoresAuditados = 0;
let valoresSemSelo = 0;
/** Ligações internas conferidas contra os ficheiros construídos. */
let ligacoesConferidas = 0;
/** Cada `href` interno encontrado, com a página onde está. */
const ligacoesInternas = [];

/**
 * As ocorrências de `data-prova` de TODAS as páginas, guardadas para depois.
 *
 * A comparação não pode acontecer durante o varrimento: metade das contas do
 * portão só existem quando ele acabou de contar as páginas construídas. Cada
 * ocorrência guarda o que basta para a mensagem de erro dizer onde está.
 */
const ocorrenciasDaProva = [];

/**
 * Os itens e os acontecimentos que cada edição da página da agenda rendeu.
 *
 * Guardados aqui e conferidos no fim, contra o registo da travessia
 * (`ledger/cruzamentos/agenda.json`): as contagens do registo estão lá para
 * serem comparadas com o que a página conta, e um item que exista no registo e
 * não na página é a maneira mais silenciosa de uma coisa sair desta agenda.
 */
const agendaRenderizada = new Map();

/**
 * As páginas construídas de cada rota lógica, para o portão poder contar do seu
 * próprio ponto de observação — páginas, e não os módulos de onde elas saíram.
 */
const paginasPorRota = new Map();
/** Páginas de linha construídas SEM `noindex`, por edição. */
const linhasIndexaveis = new Set();

/**
 * O restante da ortografia: por rota e por palavra, quantas ocorrências podem
 * ficar, e porquê. Lista fechada — o que não estiver aqui pára a construção, e
 * o que aqui estiver e já não ocorra é um aviso, para que a lista encolha.
 */
const restantesCru = load(fs.readFileSync(RESTANTES, 'utf8')) ?? {};
const RESTANTE = new Map();
for (const r of restantesCru.restantes ?? []) {
  const chave = `${r.rota} ${r.palavra}`;
  RESTANTE.set(chave, {
    ...r,
    resta: Number(r.ocorrencias ?? 1),
    usadas: 0,
  });
}
let ocorrenciasRestantes = 0;

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
 * A ORTOGRAFIA E OS TRAVESSÕES — a regra escrita, agora imposta.
 * ---------------------------------------------------------------------------
 *
 * `IDENTIDADE.md` §9: a superfície pública segue o Acordo Ortográfico de 1990
 * tal como é aplicado em Portugal, e não leva travessões em nenhuma das duas
 * edições. A regra estava decidida e não estava conferida; passa a estar aqui,
 * e não num portão novo (a moratória de 2026-08-15 continua de pé).
 *
 * A lista das formas é UMA SÓ e vive em `ortografia/formas.yml`: a mesma que
 * `scripts/ortografia.mjs` usa para converter. Duas listas divergiriam à
 * primeira palavra acrescentada.
 *
 * O QUE NÃO É PROSA DA CASA, e por isso sai do varrimento:
 *   · `<blockquote>`, `<q>`, `<cite>` — citação, pela própria etiqueta;
 *   · `data-verbatim` — transcrição conferida carácter a carácter;
 *   · `data-linha-campo` — um campo do livro-razão, conferido contra a linha;
 *   · `data-nonledger="titulo-de-estudo"` — o título de um trabalho publicado,
 *     que se cita pelas palavras exactas: «Évora — Os Pelouros, Quem Os Teve,
 *     O Que Fizeram» tem um travessão a sério e fica com ele;
 *   · `data-nonledger="proveniencia"` — a etiqueta do selo, que o
 *     `allowlist.yml` declara como texto gerado do próprio registo (nome do
 *     estudo) e não escrito à mão;
 *   · o que estiver dentro de «…» — a aspa da casa marca citação, e o que se
 *     cita não se converte.
 *
 * O QUE FICA POR VER, e é honesto dizê-lo: dentro de um elemento transcrito não
 * se vê nada, e é aí que vivem os campos das linhas cruzadas. Esses contam-se
 * do lado da fonte, com `node scripts/ortografia.mjs --verificar`.
 */
const TAGS_CITADAS = new Set(['blockquote', 'q', 'cite', 'script', 'style', 'template']);
const NONLEDGER_CITADO = new Set(['titulo-de-estudo', 'proveniencia']);

function eCitado(no) {
  const tag = String(no.rawTagName ?? '').toLowerCase();
  if (TAGS_CITADAS.has(tag)) return true;
  const attrs = no.attributes ?? {};
  if ('data-verbatim' in attrs) return true;
  if ('data-linha-campo' in attrs) return true;
  return NONLEDGER_CITADO.has(attrs['data-nonledger'] ?? '');
}

/** O texto de uma página tirando o que é citação. */
function textoPublico(no) {
  const partes = [];
  const anda = (n) => {
    if (!n) return;
    if (n.nodeType === NodeType.TEXT_NODE) {
      partes.push(n.rawText);
      return;
    }
    if (n.nodeType === NodeType.ELEMENT_NODE && eCitado(n)) return;
    for (const filho of n.childNodes ?? []) anda(filho);
  };
  anda(no);
  return partes.join(' ');
}

const FORMAS = carregaFormas();
const COMPARADOR = comparador(FORMAS, 'acordo');

/**
 * O que uma página traz fora da grafia da casa.
 * `lingua` decide só a ortografia: o travessão é regra das duas edições.
 */
function ocorrenciasDaPagina(raiz, lingua) {
  const texto = decodeEntities(textoPublico(raiz));
  const saida = [];
  if (lingua === 'pt') {
    for (const o of procura(texto, COMPARADOR)) {
      if (emCitacao(texto, o.inicio)) continue;
      saida.push({ palavra: o.forma, troca: o.troca, ctx: contexto(texto, o.forma) });
    }
  }
  for (const o of procuraTravessoes(texto)) {
    if (emCitacao(texto, o.inicio)) continue;
    saida.push({
      palavra: o.forma,
      troca: null,
      ctx: texto.slice(Math.max(0, o.inicio - 55), o.fim + 55).replace(/\s+/g, ' '),
    });
  }
  return saida;
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
 * `data-agenda` — UM CAMPO DO REGISTO DA AGENDA, NA PÁGINA DA AGENDA
 * ---------------------------------------------------------------------------
 *
 * É a origem 6 aplicada um nível acima. Ali o portão compara um campo de uma
 * linha do livro-razão com a página dessa linha; aqui compara um campo dos dois
 * registos que atravessaram do motor (`src/data/agenda.json` e
 * `src/data/calendario.json`) com a página que os renderiza, carácter a
 * carácter. Não é uma dispensa: é a única maneira de um estado ou uma data do
 * registo chegarem a uma página deste sítio.
 *
 * A marca é `data-agenda="<id>.<campo>"` para um item, e
 * `data-agenda="evento:<id>.<campo>"` para um acontecimento do calendário: um
 * item da agenda e um acontecimento podem ter o mesmo id, e têm
 * (`dgal-endividamento-2025` é os dois).
 *
 * VALE SÓ NA PÁGINA DA AGENDA, pela mesma razão que `data-linha-*` vale só nas
 * páginas do livro-razão: noutro sítio seria uma segunda porta para pôr texto
 * de um registo em prosa corrente.
 *
 * OS FICHEIROS SÃO LIDOS AQUI, com o leitor deste portão. Se este ficheiro
 * chamasse `src/lib/agenda.mjs` — o módulo que a página usa — confirmava o
 * módulo e não o registo, que é o erro que `campo="study"` cometia até §1.24.
 */
const FICHEIRO_DA_AGENDA_GATE = path.join(ROOT, 'src', 'data', 'agenda.json');
const FICHEIRO_DO_CALENDARIO_GATE = path.join(ROOT, 'src', 'data', 'calendario.json');

function leRegisto(ficheiro) {
  try {
    if (!fs.existsSync(ficheiro)) return null;
    return JSON.parse(fs.readFileSync(ficheiro, 'utf8'));
  } catch {
    return null;
  }
}

const AGENDA_REGISTO = leRegisto(FICHEIRO_DA_AGENDA_GATE);
const CALENDARIO_REGISTO = leRegisto(FICHEIRO_DO_CALENDARIO_GATE);

const ITENS_DA_AGENDA = new Map(
  (AGENDA_REGISTO?.itens ?? []).map((i) => [i?.id, i]),
);
const EVENTOS_DO_CALENDARIO = new Map(
  (CALENDARIO_REGISTO?.eventos ?? []).map((e) => [e?.id, e]),
);

/**
 * Os rótulos dos quatro estados, nas duas edições.
 *
 * É uma SEGUNDA CÓPIA da tabela que está em `src/i18n/strings.mjs`, e é de
 * propósito — a mesma disciplina de `SEPARADOR_ATRIBUICAO`. Se o portão lesse
 * os rótulos do gabarito, confirmava o gabarito; assim confirma o registo.
 * Trocar «Em curso» por «A seguir» no gabarito pára a construção.
 */
const ROTULO_DO_ESTADO = {
  pt: { em_curso: 'Em curso', a_seguir: 'A seguir', concluido: 'Concluído', retirado: 'Retirado' },
  en: { em_curso: 'Under way', a_seguir: 'Next', concluido: 'Concluded', retirado: 'Withdrawn' },
};

/** O separador com que a página escreve uma lista de linhas afectadas. */
const SEPARADOR_DA_AGENDA = ' · ';

/**
 * O que o registo diz naquele campo, lido DIRECTAMENTE do JSON.
 *
 * Devolve `{ texto }` quando resolve, `{ erro }` quando a marca não faz
 * sentido. Nunca devolve uma cadeia vazia por conveniência: um campo que o
 * registo não tem não se renderiza.
 */
function campoDaAgenda(chave, lang) {
  const lingua = lang === 'en' ? 'en' : 'pt';
  const eEvento = chave.startsWith('evento:');
  const cru = eEvento ? chave.slice('evento:'.length) : chave;
  const ponto = cru.indexOf('.');
  if (ponto < 1) return { erro: `data-agenda="${chave}" não tem a forma "<id>.<campo>".` };
  const id = cru.slice(0, ponto);
  const campo = cru.slice(ponto + 1);

  const fonte = eEvento ? EVENTOS_DO_CALENDARIO.get(id) : ITENS_DA_AGENDA.get(id);
  if (!fonte) {
    return {
      erro:
        `data-agenda="${chave}" nomeia ${eEvento ? 'um acontecimento' : 'um item'} "${id}" que ` +
        `não existe em ${eEvento ? 'src/data/calendario.json' : 'src/data/agenda.json'}.`,
    };
  }

  /* O estado renderiza-se pelo rótulo da edição, e o portão traz o seu. */
  if (!eEvento && campo === 'estado') {
    const rotulo = ROTULO_DO_ESTADO[lingua][fonte.estado];
    if (!rotulo) return { erro: `data-agenda="${chave}": estado "${fonte.estado}" desconhecido.` };
    return { texto: rotulo };
  }

  /* Um caminho dentro do registo: `criterios[0].nota`, `janela.inicio`,
     `historico[2].motivo`. Resolve-se aqui, sem passar por nenhum auxiliar do
     gabarito. */
  let no = fonte;
  for (const passo of campo.split('.')) {
    const m = passo.match(/^([a-z_]+)(?:\[(\d+)\])?$/);
    if (!m) return { erro: `data-agenda="${chave}": campo "${campo}" não é um caminho do registo.` };
    no = no?.[m[1]];
    if (m[2] !== undefined) no = Array.isArray(no) ? no[Number(m[2])] : undefined;
    if (no === undefined) break;
  }
  if (no === undefined || no === null) {
    return {
      erro:
        `a página renderiza "${campo}" de "${id}", e o registo não tem esse campo.\n` +
        `      Um campo que o registo não tem não se mostra: nem vazio, nem com um valor plausível.`,
    };
  }
  /* Um par de edições resolve-se na língua da página, como o `derivation` de
     uma linha (origem 6). */
  if (typeof no === 'object' && !Array.isArray(no) && ('pt' in no || 'en' in no)) {
    const v = no[lingua];
    if (typeof v !== 'string') {
      return { erro: `data-agenda="${chave}" não tem edição "${lingua}" no registo.` };
    }
    return { texto: v };
  }
  if (Array.isArray(no)) return { texto: no.join(SEPARADOR_DA_AGENDA) };
  if (typeof no === 'object') {
    return { erro: `data-agenda="${chave}" aponta para um objecto, não para um texto.` };
  }
  return { texto: String(no) };
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

/**
 * ---------------------------------------------------------------------------
 * A PROVA DA CONFERÊNCIA — corre a cada construção, sobre páginas de mentira.
 * ---------------------------------------------------------------------------
 *
 * Uma conferência que nunca disparou não se sabe se funciona. Estes seis casos
 * são a prova mínima, e são o que separa a lista `iguais` de um comentário: se
 * alguém puser «facto» em `pares`, este bloco fecha o build antes de a página
 * chegar a ser construída.
 *
 * Não é uma dispensa nem uma amostra do sítio: são cadeias escritas aqui, que
 * não existem em lado nenhum e não entram em `dist/`.
 */
function provaDaOrtografia() {
  const pagina = (lang, corpo) =>
    parse(`<!doctype html><html lang="${lang}"><body>${corpo}</body></html>`, { comment: false });
  const casos = [
    { nome: 'palavra de «iguais»', lang: 'pt', corpo: '<p>É um facto, e uma secção do contacto.</p>', espera: 0 },
    { nome: 'forma anterior ao Acordo', lang: 'pt', corpo: '<p>Uma correcção.</p>', espera: 1 },
    { nome: 'forma anterior dentro de citação', lang: 'pt', corpo: '<blockquote>Uma correcção.</blockquote>', espera: 0 },
    { nome: 'forma anterior num campo de linha', lang: 'pt', corpo: '<span data-linha-campo="derivation">Uma correcção.</span>', espera: 0 },
    { nome: 'travessão na edição portuguesa', lang: 'pt', corpo: '<p>Uma coisa — outra.</p>', espera: 1 },
    { nome: 'travessão na edição inglesa', lang: 'en', corpo: '<p>One thing — another.</p>', espera: 1 },
  ];
  for (const c of casos) {
    const lingua = LINGUA_POR_HREFLANG[c.lang === 'pt' ? HREFLANG.pt : HREFLANG.en] ?? c.lang;
    const achado = ocorrenciasDaPagina(pagina(c.lang === 'pt' ? HREFLANG.pt : HREFLANG.en, c.corpo), lingua);
    if (achado.length !== c.espera) {
      erros.push({
        rel: 'ortografia/formas.yml',
        msg:
          `a prova da conferência de ortografia falhou no caso "${c.nome}": ` +
          `esperavam-se ${c.espera} ocorrência(s) e encontraram-se ${achado.length}` +
          (achado.length ? ` (${achado.map((a) => a.palavra).join(', ')})` : '') +
          `.\n      A lista mudou de maneira que a conferência deixou de valer. Ver ortografia/formas.yml.`,
      });
    }
  }
}

/**
 * ---------------------------------------------------------------------------
 * A SÉTIMA ORIGEM: `data-prova` — o número que o sítio diz sobre si próprio
 * ---------------------------------------------------------------------------
 *
 * `src/lib/prova.mjs` calcula, na construção, tudo o que o Método diz sobre o
 * estado do sítio. Uma página que rende um desses números marca-o
 * `data-prova="<chave>"`, como um valor do livro-razão se marca `data-claim`.
 *
 * O QUE ESTE PORTÃO NÃO FAZ, E É O PONTO: não chama `prova()` e compara o
 * resultado consigo próprio. Isso seria confirmar uma função contra ela
 * própria, que foi o defeito que `campo="study"` cometia até §1.24. Aqui há
 * duas contas para cada chave:
 *
 *   A. a conta do portão, feita do SEU ponto de observação, contra `prova()`;
 *   B. a conta do portão contra os ALGARISMOS que a página rendeu.
 *
 * O ponto de observação do portão é o `dist/` construído: as páginas de linha
 * que existem, as que levam `noindex`, as páginas de estudo, as de município,
 * o mapa do sítio, os ficheiros de dados. Onde não há segundo ponto de
 * observação — as chaves que só se podem contar sobre os mesmos ficheiros do
 * livro-razão — a conta é uma SEGUNDA IMPLEMENTAÇÃO sobre a mesma fonte, e
 * isso está declarado chave a chave na tabela abaixo, na coluna `vista`:
 *
 *   'dist'     conta feita sobre o que foi construído. Independente.
 *   'ledger'   segunda leitura dos mesmos ficheiros do livro-razão. Apanha um
 *              erro de qualquer um dos dois lados; não apanha um livro-razão
 *              errado, que é trabalho da verificação contra a fonte.
 *   'modulo'   o mesmo módulo dos dois lados (a data da verificação, o endereço
 *              das correções). A conta é a mesma; o que fica conferido é que a
 *              página rendeu o que o módulo diz, e mais nada.
 */
const PROVA_VISTA = {};

/** Uma conta do portão, com a vista de onde foi feita. */
function conta(chave, valor, vista) {
  PROVA_VISTA[chave] = vista;
  return [chave, valor];
}

/**
 * O que o portão conta, por conta própria, no fim do varrimento.
 * @param {Map<string, any>} claims
 */
function contasDoPortao(claims) {
  const linhas = [...claims.values()];
  const paginasDeLinhaPt = [...linhasConstruidas].filter((k) => k.startsWith('pt:')).length;
  const indexaveisPt = [...linhasIndexaveis].filter((k) => k.startsWith('pt:')).length;

  /* As correções, contadas aqui e não por entradasDoRegisto(): é a segunda
     implementação sobre os mesmos ficheiros. */
  const porNatureza = { correcao: 0, atualizacao: 0, proveniencia: 0 };
  for (const c of linhas) {
    for (const corr of c.corrections ?? []) {
      if (corr.kind in porNatureza) porNatureza[corr.kind]++;
    }
  }

  /* O registo da travessia, lido aqui com o seu próprio leitor. */
  let cruzadas = 0;
  const dirCruzamentos = path.join(ROOT, 'ledger', 'cruzamentos');
  if (fs.existsSync(dirCruzamentos)) {
    for (const f of fs.readdirSync(dirCruzamentos)) {
      if (!f.endsWith('.json')) continue;
      const manifesto = JSON.parse(fs.readFileSync(path.join(dirCruzamentos, f), 'utf8'));
      cruzadas += Object.keys(manifesto?.rows ?? {}).length;
    }
  }

  /* Os concelhos, contados nas linhas do ficheiro que o sítio serve. */
  let municipiosNoCsv = null;
  const csv = path.join(DIST, 'dados', 'municipios-308.csv');
  if (fs.existsSync(csv)) {
    const linhasCsv = fs
      .readFileSync(csv, 'utf8')
      .split('\n')
      .filter((l) => l.trim() !== '' && !l.startsWith('#'));
    municipiosNoCsv = Math.max(0, linhasCsv.length - 1); // menos o cabeçalho
  }

  /* Os trabalhos com leitura escrita: são os únicos `estudo` que entram no mapa
     do sítio, pelo mesmo filtro que a página usa para levantar o `noindex`. */
  let leiturasNoMapa = null;
  const mapa = path.join(DIST, 'sitemap-0.xml');
  if (fs.existsSync(mapa)) {
    const xml = fs.readFileSync(mapa, 'utf8');
    const enderecos = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    leiturasNoMapa = enderecos.filter((u) => matchPath(u.replace(/^https?:\/\/[^/]+/, ''))?.key === 'estudo' &&
      matchPath(u.replace(/^https?:\/\/[^/]+/, ''))?.lang === 'pt').length;
  }

  /* A data da verificação, com a aritmética do portão e não a da prova. */
  const diasDaVerificacao = Math.round(
    (Date.parse(`${new Date().toISOString().slice(0, 10)}T00:00:00Z`) -
      Date.parse(`${VERIFICACAO.verificadoEm}T00:00:00Z`)) / 86400000,
  );

  /* A agenda, lida aqui com o seu próprio leitor. Ausente é `null`. */
  let agendaTotal = null;
  const ficheiroAgenda = path.join(ROOT, 'src', 'data', 'agenda.json');
  if (fs.existsSync(ficheiroAgenda)) {
    try {
      const cru = JSON.parse(fs.readFileSync(ficheiroAgenda, 'utf8'));
      const itens = Array.isArray(cru?.itens) ? cru.itens : Array.isArray(cru) ? cru : null;
      if (itens) agendaTotal = itens.length;
    } catch {
      agendaTotal = null;
    }
  }
  const porEstadoDaAgenda = (estado) => {
    if (agendaTotal === null) return null;
    try {
      const cru = JSON.parse(fs.readFileSync(ficheiroAgenda, 'utf8'));
      const itens = Array.isArray(cru?.itens) ? cru.itens : cru;
      return itens.filter((i) => i?.estado === estado).length;
    } catch {
      return null;
    }
  };

  return Object.fromEntries([
    conta('afirmacoes', paginasDeLinhaPt, 'dist'),
    conta('indexaveis', indexaveisPt, 'dist'),
    conta('divida', paginasDeLinhaPt - indexaveisPt, 'dist'),
    conta('derivadas', linhas.filter((c) => (c.derived_from ?? []).length > 0).length, 'ledger'),
    conta(
      'aritmetica_reavaliada',
      linhas.filter((c) => typeof c.check === 'string' && c.check.trim() !== '').length,
      'ledger',
    ),
    conta(
      'valores_creditados',
      linhas.filter((c) => (c.attributed_to ?? []).length > 0).length,
      'ledger',
    ),
    conta('fontes', new Set(linhas.map((c) => c.source).filter(Boolean)).size, 'ledger'),
    conta(
      'tipos_de_documento',
      linhas.filter((c) => typeof c.document?.kind === 'string' && c.document.kind !== '').length,
      'ledger',
    ),
    conta('linhas_cruzadas', cruzadas, 'ledger'),
    conta('estudos', (paginasPorRota.get('pt:estudo') ?? 0), 'dist'),
    conta('edicoes', EDITIONS.length, 'modulo'),
    conta('leituras', leiturasNoMapa, 'dist'),
    conta('municipios_com_pagina', (paginasPorRota.get('pt:municipio') ?? 0), 'dist'),
    conta('municipios_total', municipiosNoCsv, 'dist'),
    conta(
      'releituras_registadas',
      linhas.reduce((n, c) => n + (Array.isArray(c.verifications) ? c.verifications.length : 0), 0),
      'ledger',
    ),
    conta('painel_reconferido_em', VERIFICACAO.verificadoEm, 'modulo'),
    conta('correcoes', porNatureza.correcao, 'ledger'),
    conta('atualizacoes', porNatureza.atualizacao, 'ledger'),
    conta('revisoes_de_proveniencia', porNatureza.proveniencia, 'ledger'),
    conta('endereco_correcoes', ENDERECO_CORRECOES, 'modulo'),
    conta('agenda_total', agendaTotal, 'dist'),
    conta('agenda_em_curso', porEstadoDaAgenda('em_curso'), 'dist'),
    conta('agenda_a_seguir', porEstadoDaAgenda('a_seguir'), 'dist'),
    conta('agenda_concluido', porEstadoDaAgenda('concluido'), 'dist'),
    conta('agenda_retirado', porEstadoDaAgenda('retirado'), 'dist'),
    ['_dias_da_verificacao', diasDaVerificacao],
  ]);
}

/**
 * A legenda de portas de um instrumento — o irmão de `data-legenda-selos`.
 *
 * Um número desenhado dentro de um `<svg>` não pode ser embrulhado numa
 * ligação que se leia como porta (§1.34), e por isso a porta vive na legenda
 * do próprio instrumento, marcada `data-legenda-prova`. É a mesma disciplina
 * do selo, aplicada a um número que não é do livro-razão.
 */
function temPortaPara(no, destino) {
  for (const a of no?.querySelectorAll?.('a') ?? []) {
    if (decodeEntities(a.getAttribute('href') ?? '') === destino) return true;
  }
  return false;
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
  if (rota) {
    const chaveDaRota = `${rota.lang}:${rota.key}`;
    paginasPorRota.set(chaveDaRota, (paginasPorRota.get(chaveDaRota) ?? 0) + 1);
  }
  if (rota?.key === 'linha') {
    /* Uma linha incompleta leva `noindex` e sai do mapa do sítio. É essa marca,
       na página construída, que o portão conta para a dívida de proveniência —
       e não a mesma leitura do livro-razão que a página fez. Duas vistas. */
    const robots = root.querySelector('head meta[name="robots"]')?.getAttribute('content') ?? '';
    if (!/noindex/i.test(robots)) linhasIndexaveis.add(`${rota.lang}:${rota.params.slug}`);
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
  /* O corpo, antes de lhe tirar seja o que for: as invariantes leem-no inteiro. */
  const body0 = root.querySelector('body') ?? root;

  const canonical = root.querySelector('head link[rel="canonical"]');
  if (!canonical) err('falta <link rel="canonical">.');
  else {
    const href = canonical.getAttribute('href') ?? '';
    if (!href.startsWith(`https://${SITE_HOST}/`) && href !== `https://${SITE_HOST}`) {
      err(`o canonical não está no domínio canónico: "${href}" (esperado https://${SITE_HOST}/…).`);
    }
  }
  /**
   * ---------------------------------------------------------------------
   * A AUTORIA TEM CASA, E TODAS AS PÁGINAS TÊM A PORTA PARA LÁ
   * ---------------------------------------------------------------------
   *
   * Até 16.08.2026 este portão exigia a linha «Escrito por IA, dirigido por
   * uma pessoa» no rodapé de todas as páginas. A linha saiu (§1.39): a
   * autoria passou a estar dita no Sobre, nas palavras da direção, e o que
   * todas as páginas levam é a porta para lá. A invariante trocou de objecto,
   * não desapareceu — e ficou mais forte, porque uma porta pode ser seguida e
   * uma frase de rodapé não.
   *
   * Os documentos de estudo estão fora, como sempre: são obra alojada
   * intacta, conferida carácter a carácter contra a origem, e saem deste
   * varrimento antes de aqui chegar.
   */
  if (rota) {
    const portaDoSobre = routePath('sobre', rota.lang);
    const temPorta = body0
      .querySelectorAll('a[href]')
      .some((a) => decodeEntities(a.getAttribute('href') ?? '') === portaDoSobre);
    if (!temPorta) {
      err(
        `esta página não tem ligação para "${portaDoSobre}".\n` +
          `      A autoria deste sítio está dita no Sobre, e todas as páginas construídas têm de ` +
          `levar lá. A ligação entra pela navegação do rodapé (SiteFooter.astro).`,
      );
    }
  }

  /**
   * ---------------------------------------------------------------------
   * O TEXTO DO SOBRE, CARÁCTER A CARÁCTER
   * ---------------------------------------------------------------------
   *
   * O Sobre não é uma transcrição de uma fonte: é prosa da casa, escrita pela
   * direção, e vive em `src/data/sobre.mjs`. Por isso não leva `data-verbatim`
   * — mas leva a mesma disciplina. A marca `data-sobre="<lingua>"` não é uma
   * dispensa de nada: é uma comparação, e a construção fecha à primeira
   * palavra que difira do ficheiro.
   *
   * A página tem de trazer a marca. Sem esta segunda metade, apagar o
   * atributo apagava a conferência.
   */
  if (rota?.key === 'sobre') {
    const blocos = body0.querySelectorAll('[data-sobre]');
    if (blocos.length !== 1) {
      err(
        `a página do Sobre tem ${blocos.length} blocos marcados data-sobre; tem de ter ` +
          `exactamente um, com o texto decidido.`,
      );
    }
    for (const bloco of blocos) {
      const lingua = bloco.getAttribute('data-sobre');
      const registado = SOBRE[lingua]?.texto;
      if (!registado) {
        err(`data-sobre="${lingua}" não é uma edição de src/data/sobre.mjs.`);
        continue;
      }
      if (lingua !== rota.lang) {
        err(
          `a página do Sobre da edição "${rota.lang}" rende o texto de "${lingua}".`,
        );
        continue;
      }
      const renderizado = textoTranscrito(bloco);
      const esperado = normalizeWhitespace(registado);
      if (renderizado !== esperado) {
        err(
          `o texto do Sobre não é o que está decidido em src/data/sobre.mjs.\n` +
            `      decidido:    ${esperado.slice(0, 150)}\n` +
            `      renderizado: ${renderizado.slice(0, 150)}\n` +
            `      Este texto é da direção. Muda por decisão, e no ficheiro.`,
        );
      }
    }
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

  /**
   * ---------------------------------------------------------------------
   * AS LIGAÇÕES INTERNAS APONTAM PARA ALGUMA COISA
   * ---------------------------------------------------------------------
   *
   * O sítio promete que o selo é uma porta e que a porta abre. Isso estava
   * conferido para os selos (que apontam para páginas de linha, e essas são
   * contadas) e para mais nada: uma ligação da navegação para uma rota que
   * deixou de ser construída dava 404 e passava.
   *
   * Confere-se o destino, não o texto: cada `href` que comece por `/` tem de
   * corresponder a um ficheiro construído em `dist/` — uma página, um ponto
   * final de dados, ou um ficheiro que o portão escreve. A âncora (`#`) é
   * cortada: uma âncora que não existe não é uma ligação partida.
   */
  for (const a of body0.querySelectorAll('a[href]')) {
    const href = decodeEntities(a.getAttribute('href') ?? '');
    if (!href.startsWith('/')) continue;
    ligacoesInternas.push({ rel, href });
  }

  /* --- 4. corpo: retirar o que é legítimo, e ver o que sobra --- */
  const body = body0;
  for (const el of body.querySelectorAll('script, style')) el.remove();

  /* A grafia da casa, antes de retirar seja o que for: a conferência precisa do
     corpo inteiro, e sai dela pela sua própria lista de citações. */
  for (const o of ocorrenciasDaPagina(body, linguaPagina)) {
    const entrada = RESTANTE.get(`${caminho} ${o.palavra}`);
    if (entrada && entrada.resta > 0) {
      entrada.resta--;
      entrada.usadas++;
      ocorrenciasRestantes++;
      continue;
    }
    const eTravessao = o.palavra === '—' || o.palavra === '–';
    err(
      eTravessao
        ? `travessão no texto renderizado: "${o.palavra}".\n` +
            `      contexto: ${o.ctx}\n` +
            `      A casa não usa travessão em nenhuma das duas edições (IDENTIDADE.md §9). ` +
            `Reescreva a frase com vírgula, dois pontos, parênteses ou «·».\n` +
            `      Se for uma citação, cite-a entre «…» ou marque o elemento como transcrito.`
        : `grafia anterior ao Acordo: "${o.palavra}" (a forma da casa é "${o.troca}").\n` +
            `      contexto: ${o.ctx}\n` +
            `      A superfície pública segue o Acordo de 1990 tal como é aplicado em Portugal ` +
            `(IDENTIDADE.md §9).\n` +
            `      Corra "node scripts/ortografia.mjs --aplicar --sentido=acordo". ` +
            `Se a palavra é a forma certa em Portugal, acrescente-a a "iguais" em ortografia/formas.yml.`,
    );
  }

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
    if (rota && !paginaDoLivro) {
      valoresAuditados++;
      const antes = erros.length;
      auditaSelo(el, id, rota.lang, err);
      if (erros.length > antes) valoresSemSelo++;
    }
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

  /* --- os campos do registo da agenda, na página da agenda (origem 8) --- */
  for (const el of body.querySelectorAll('[data-agenda]')) {
    const chave = el.getAttribute('data-agenda');
    aRemover.push(el);

    if (rota?.key !== 'agenda') {
      err(
        `data-agenda="${chave}" numa página que não é a agenda. ` +
          `Esta marca é dos campos do registo da agenda, na página que o renderiza.\n` +
          `      Noutra página: um valor entra por <Claim id="…"/>, e uma citação por data-verbatim.`,
      );
      continue;
    }
    if (!AGENDA_REGISTO || !CALENDARIO_REGISTO) {
      err(
        `a página da agenda rende data-agenda="${chave}" e não há registo em src/data/ para ` +
          `conferir. Corra o exportador do motor: python3 publisher/export_agenda.py.`,
      );
      continue;
    }

    const resolvido = campoDaAgenda(chave, linguaPagina ?? 'pt');
    if (resolvido.erro) {
      err(resolvido.erro);
      continue;
    }

    const renderizado = textoTranscrito(el);
    const esperado = normalizeWhitespace(String(resolvido.texto));
    if (renderizado !== esperado) {
      err(
        `o campo "${chave}" não foi transcrito fielmente do registo da agenda.\n` +
          `      no registo:  ${esperado.slice(0, 150)}\n` +
          `      renderizado: ${renderizado.slice(0, 150)}`,
      );
    }

    const [alvo] = chave.split('.');
    if (!agendaRenderizada.has(rel)) {
      agendaRenderizada.set(rel, { itens: new Set(), eventos: new Set(), lang: linguaPagina });
    }
    const visto = agendaRenderizada.get(rel);
    if (alvo.startsWith('evento:')) visto.eventos.add(alvo.slice('evento:'.length));
    else visto.itens.add(alvo);
  }

  /**
   * ---------------------------------------------------------------------
   * `data-prova` — a sétima origem, recolhida aqui e conferida no fim
   * ---------------------------------------------------------------------
   *
   * Aqui confere-se o que se pode conferir com a página à frente: que a chave
   * existe, que traz algarismos, e que é uma porta. A comparação com o número
   * fica para o fim do varrimento, quando o portão já contou as páginas
   * construídas — que é metade do seu ponto de observação.
   */
  for (const el of body.querySelectorAll('[data-prova]')) {
    const chave = el.getAttribute('data-prova');
    aRemover.push(el);

    if (!(chave in PROVA)) {
      err(
        `data-prova="${chave}" não é uma chave de src/lib/prova.mjs. ` +
          `Chaves: ${Object.keys(PROVA).join(', ')}.`,
      );
      continue;
    }

    const renderizado = textoTranscrito(el);
    if (!/\d/.test(renderizado)) {
      err(
        `data-prova="${chave}" não rende nenhum algarismo ("${renderizado.slice(0, 60)}").\n` +
          `      A marca é a origem de um NÚMERO do próprio sítio. Um estado vazio diz-se por ` +
          `palavras, sem marca e sem porta.`,
      );
      continue;
    }

    /**
     * A porta. Fora de um desenho, a marca vai na própria âncora ou dentro
     * dela; dentro de um `<svg>` vale a legenda do instrumento, marcada
     * `data-legenda-prova` — a mesma convenção do selo (§1.34), aplicada a um
     * número que não é do livro-razão.
     */
    const destino = PROVA_POR_LINGUA[linguaPagina ?? 'pt'][chave].porta;
    let temPorta = false;
    if (dentroDeSvg(el)) {
      const raiz = raizDoInstrumento(el);
      for (const legenda of raiz?.querySelectorAll?.('[data-legenda-prova]') ?? []) {
        if (temPortaPara(legenda, destino)) temPorta = true;
      }
      if (!temPorta) {
        err(
          `o número da prova "${chave}" está desenhado dentro de um <svg> e não tem porta na ` +
            `legenda do seu instrumento.\n` +
            `      esperava-se <a href="${destino}"> dentro de um [data-legenda-prova] deste ` +
            `instrumento.`,
        );
      }
    } else {
      let no = el;
      while (no && !temPorta) {
        if (String(no.rawTagName ?? '').toLowerCase() === 'a') {
          temPorta = decodeEntities(no.getAttribute('href') ?? '') === destino;
          break;
        }
        no = no.parentNode;
      }
      if (!temPorta) {
        err(
          `o número da prova "${chave}" aparece sem a sua porta.\n` +
            `      esperava-se que fosse, ou estivesse dentro de, <a href="${destino}">. ` +
            `Onde aparece um valor, aparece a porta.`,
        );
      }
    }

    ocorrenciasDaProva.push({ rel, chave, digitos: digitsOf(renderizado), texto: renderizado });
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

/* --------------------------------------------------- depois do varrimento */

/**
 * As ligações internas, conferidas contra o que foi construído.
 *
 * `dist/prova.json` ainda não existe quando isto corre — é escrito no fim, e é
 * escrito por este portão. Vai na lista do que se aceita, com a garantia de
 * que é mesmo escrito: a última conferência deste ficheiro reabre-o e falha
 * se não estiver lá.
 */
const CONSTRUIDOS = new Set();
{
  const anda = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) anda(full);
      else CONSTRUIDOS.add('/' + path.relative(DIST, full).split(path.sep).join('/'));
    }
  };
  anda(DIST);
}
function existeConstruido(caminho) {
  if (caminho === CAMINHO_DA_PROVA) return true; // escrito no fim deste varrimento
  if (CONSTRUIDOS.has(caminho)) return true;
  const limpo = caminho.replace(/\/$/, '');
  return (
    CONSTRUIDOS.has(limpo + '.html') ||
    CONSTRUIDOS.has(limpo + '/index.html') ||
    (limpo === '' && CONSTRUIDOS.has('/index.html'))
  );
}
for (const { rel, href } of ligacoesInternas) {
  const semAncora = href.split('#')[0].split('?')[0];
  if (semAncora === '') continue; // ligação só de âncora, na própria página
  ligacoesConferidas++;
  if (!existeConstruido(semAncora)) {
    erros.push({
      rel,
      msg:
        `a ligação interna "${href}" não corresponde a nada construído em dist/.\n` +
        `      Uma porta que não abre é pior do que não haver porta.`,
    });
  }
}

/**
 * ---------------------------------------------------------------------------
 * A AGENDA: O QUE A PÁGINA CONTOU CONTRA O QUE O REGISTO DIZ
 * ---------------------------------------------------------------------------
 *
 * O registo da travessia (`ledger/cruzamentos/agenda.json`) traz `counts`, e o
 * contrato do motor é claro: as contagens estão lá para serem comparadas com o
 * que a página conta, não para serem a fonte da página. É o que se faz aqui.
 *
 * E confere-se a coisa que nenhuma contagem apanha sozinha: que TODOS os itens
 * do registo estão na página. Um item que exista no registo e não na página é a
 * maneira mais silenciosa de uma coisa sair desta agenda, e a regra 8 do Método
 * promete exactamente o contrário.
 */
{
  const registoDaTravessia = leRegisto(
    path.join(ROOT, 'ledger', 'cruzamentos', 'agenda.json'),
  );
  const paginasDaAgenda = [...agendaRenderizada.entries()];

  if (AGENDA_REGISTO && !paginasDaAgenda.length) {
    erros.push({
      rel: 'dist/',
      msg:
        'a agenda atravessou do motor e nenhuma página construída a rende. ' +
        'Um registo que chega e não aparece é pior do que não chegar.',
    });
  }

  if (registoDaTravessia?.counts && paginasDaAgenda.length) {
    const esperadoItens = Number(registoDaTravessia.counts.itens);
    const esperadoEventos = Number(registoDaTravessia.counts.eventos);
    const porEstado = registoDaTravessia.counts.itens_por_estado ?? {};

    for (const [rel, visto] of paginasDaAgenda) {
      if (visto.itens.size !== esperadoItens) {
        erros.push({
          rel,
          msg:
            `a página rende ${visto.itens.size} item(ns) da agenda e o registo da travessia ` +
            `conta ${esperadoItens}.\n` +
            `      O registo é ledger/cruzamentos/agenda.json, e as suas contagens estão lá ` +
            `para serem comparadas com o que a página conta.`,
        });
      }
      if (visto.eventos.size !== esperadoEventos) {
        erros.push({
          rel,
          msg:
            `a página rende ${visto.eventos.size} acontecimento(s) do calendário e o registo ` +
            `da travessia conta ${esperadoEventos}.`,
        });
      }
      /* Cada item do registo, nomeado. Uma contagem certa com o item errado
         passaria; isto não. */
      for (const id of ITENS_DA_AGENDA.keys()) {
        if (!visto.itens.has(id)) {
          erros.push({
            rel,
            msg:
              `o item "${id}" está no registo da agenda e não está nesta página.\n` +
              `      A página rende todos, ou o que ela mostra deixa de ser a agenda.`,
          });
        }
      }
      for (const id of EVENTOS_DO_CALENDARIO.keys()) {
        if (!visto.eventos.has(id)) {
          erros.push({
            rel,
            msg: `o acontecimento "${id}" está no calendário das fontes e não está nesta página.`,
          });
        }
      }
      /* E os quatro estados, um a um: o registo diz quantos itens estão em
         cada um, e a página põe cada item na sua secção. */
      const lingua = visto.lang === 'en' ? 'en' : 'pt';
      for (const [estado, quantos] of Object.entries(porEstado)) {
        const naPagina = [...visto.itens].filter(
          (id) => ITENS_DA_AGENDA.get(id)?.estado === estado,
        ).length;
        if (naPagina !== Number(quantos)) {
          erros.push({
            rel,
            msg:
              `a página rende ${naPagina} item(ns) em "${ROTULO_DO_ESTADO[lingua][estado] ?? estado}" ` +
              `e o registo da travessia conta ${quantos}.`,
          });
        }
      }
    }
  }
}

/**
 * ---------------------------------------------------------------------------
 * A PROVA: duas contas, e nenhuma delas compara uma função consigo própria
 * ---------------------------------------------------------------------------
 *
 *   A. a conta do portão contra `prova()` — duas implementações, e onde a
 *      vista é a mesma isso está declarado em PROVA_VISTA;
 *   B. a conta do portão contra os algarismos que cada página rendeu.
 *
 * A ordem importa: se A falhar, B falharia pela mesma razão e diria a coisa
 * errada, por isso A é dita primeiro e com o seu próprio nome.
 */
const CONTAS = contasDoPortao(claims);
const provaFinal = {};

for (const [chave, item] of Object.entries(PROVA)) {
  const meu = CONTAS[chave];
  const dela = item.valor;
  provaFinal[chave] = { valor: dela, vista: PROVA_VISTA[chave] ?? 'modulo' };
  if (meu === undefined) {
    erros.push({
      rel: 'src/lib/prova.mjs',
      msg:
        `a chave "${chave}" existe na prova e o portão não a sabe contar. ` +
        `Uma chave que o portão não confere é uma dispensa, e a marca data-prova não é isso.`,
    });
    continue;
  }
  if (meu === null && dela === null) continue;
  if (String(meu) !== String(dela)) {
    erros.push({
      rel: 'src/lib/prova.mjs',
      msg:
        `a prova diz que "${chave}" é ${JSON.stringify(dela)} e o portão conta ` +
        `${JSON.stringify(meu)} (vista: ${PROVA_VISTA[chave] ?? 'modulo'}).\n` +
        `      Não é um desacordo de rendição: são duas contas da mesma coisa, e discordam.`,
    });
  }
}

for (const o of ocorrenciasDaProva) {
  const esperado = CONTAS[o.chave];
  if (esperado === undefined || esperado === null) continue; // já dito acima
  if (digitsOf(String(esperado)) !== o.digitos) {
    erros.push({
      rel: o.rel,
      msg:
        `o número da prova "${o.chave}" foi renderizado como "${o.texto.slice(0, 40)}" e o ` +
        `portão conta ${JSON.stringify(esperado)}.`,
    });
  }
}

/* ------------------------------------------------------------------ relatório */

provaDaOrtografia();

/* Uma entrada do restante que já não ocorre é um aviso, e não um erro: a lista
   tem de encolher à medida que o motor converte as linhas cruzadas, e uma
   entrada morta que ninguém remove torna a lista num hábito. */
for (const [chave, r] of RESTANTE) {
  if (r.resta > 0) {
    avisos.push(
      `o restante da ortografia guarda ${r.resta} ocorrência(s) de "${r.palavra}" em "${r.rota}" ` +
        `que já não existem. Retire a entrada de ortografia/restantes.yml (${chave}).`,
    );
  }
}

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
console.log(
  cinza(
    `  ortografia · Acordo de 1990 como se aplica em Portugal · ${FORMAS.pares.length} pares, ` +
      `${FORMAS.iguais.length} iguais · restante: ${ocorrenciasRestantes} ocorrência(s) em ` +
      `${[...RESTANTE.values()].filter((r) => r.usadas > 0).length} rota(s), todas de linhas cruzadas`,
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

/**
 * ---------------------------------------------------------------------------
 * `dist/prova.json` — a prova desta construção, para quem não lê páginas
 * ---------------------------------------------------------------------------
 *
 * Escrito AQUI, e não antes: metade destas contas só existe depois de o
 * varrimento acabar (páginas construídas, valores auditados, ligações
 * conferidas). Só se escreve depois de o varrimento passar: um ficheiro de
 * prova escrito por uma construção que falhou seria uma prova de nada.
 *
 * É JSON e não uma página, como `version.json`, e por isso está fora do
 * varrimento de algarismos — não precisa de dispensa nenhuma, porque nunca
 * passa à frente do portão. O Método liga-o uma vez, como porta da prova da
 * regra da construção.
 *
 * O carimbo da construção NÃO é recalculado aqui: lê-se de `version.json`,
 * que é onde ele é escrito. Duas fontes para o mesmo commit divergiriam.
 */
const versao = (() => {
  try {
    return JSON.parse(fs.readFileSync(path.join(DIST, 'version.json'), 'utf8'));
  } catch {
    return null;
  }
})();

const documentoDaProva = {
  _: [
    'A prova desta construção. FICHEIRO GERADO por scripts/gate-html.mjs, no fim',
    'de um varrimento sem erros. Cada chave de `prova` traz o valor e a vista de',
    'onde o portão a recontou: dist (o que foi construído), ledger (segunda',
    'leitura dos mesmos ficheiros do livro-razão) ou modulo (o mesmo módulo dos',
    'dois lados). Ver DECISIONS.md §1.39 e §2.2, origem 7.',
  ],
  commit: versao?.commit ?? null,
  construido_em: versao?.construido_em ?? null,
  prova: provaFinal,
  portao: {
    paginas_construidas: ficheiros,
    paginas_de_linha: linhasConstruidas.size,
    documentos_conferidos: documentos,
    valores_auditados: valoresAuditados,
    valores_sem_selo: valoresSemSelo,
    ligacoes_internas_conferidas: ligacoesConferidas,
    restantes_ortografia: ocorrenciasRestantes,
    afirmacoes_citadas_fora_do_livro: idsUsados.size,
    avisos: avisos.length,
  },
};

const FICHEIRO_DA_PROVA = path.join(DIST, CAMINHO_DA_PROVA.replace(/^\//, ''));
fs.writeFileSync(FICHEIRO_DA_PROVA, JSON.stringify(documentoDaProva, null, 2) + '\n', 'utf8');

/**
 * E relê-se. Um ficheiro que se escreve e não se volta a abrir é uma
 * suposição: o Método liga-o, e uma porta que não abre é o defeito que este
 * bloco existe para fechar.
 */
try {
  const relido = JSON.parse(fs.readFileSync(FICHEIRO_DA_PROVA, 'utf8'));
  const chavesEscritas = Object.keys(relido.prova ?? {});
  if (chavesEscritas.length !== Object.keys(PROVA).length) {
    console.error(
      vermelho(
        `\n  ${CAMINHO_DA_PROVA} foi escrito com ${chavesEscritas.length} chaves; ` +
          `esperavam-se ${Object.keys(PROVA).length}.\n`,
      ),
    );
    process.exit(1);
  }
} catch (e) {
  console.error(vermelho(`\n  ${CAMINHO_DA_PROVA} não existe ou não é JSON válido: ${e.message}\n`));
  process.exit(1);
}

console.log('');
console.log('  ' + verde('✓') + ' nenhum algarismo sem proveniência nas páginas construídas.');
console.log(
  cinza(
    `    prova · ${Object.keys(PROVA).length} chaves reconferidas pelo portão · ` +
      `${ocorrenciasDaProva.length} números marcados nas páginas · ` +
      `${ligacoesConferidas} ligações internas · escrito em ${CAMINHO_DA_PROVA}`,
  ),
);
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
