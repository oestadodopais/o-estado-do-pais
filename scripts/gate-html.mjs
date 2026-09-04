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
 *                                 campo a campo, e com o selo da sua linha por porta
 *                                 campo a campo contra a afirmação.
 *   6. data-linha-*             — um campo de uma linha do livro-razão, na página
 *                                 dessa linha, conferido carácter a carácter
 *                                 contra o campo da própria afirmação.
 *   7. data-prova="<chave>"     — um número do sítio sobre si próprio (linhas
 *                                 publicadas, correções, cobertura). O portão
 *                                 RECALCULA a chave por conta própria, do seu
 *                                 ponto de observação, e compara. Não é uma
 *                                 dispensa: é uma origem conferida, como a 6.
 *   8. data-agenda="<id>.<campo>" — um campo do registo da agenda ou do
 *                                 calendário das fontes, na página da agenda,
 *                                 comparado carácter a carácter contra o
 *                                 registo que atravessou (§1.40).
 *   9. data-registo*            — o registo de conteúdo do motor, na página que
 *                                 o transcreve (`/estudos/<slug>/texto`). São
 *                                 quatro marcas e todas são comparadas: a
 *                                 edição, a sequência de blocos, o texto de
 *                                 cada unidade pela leitura do olho, e o
 *                                 `printed` de cada figura — nunca o `value`.
 *                                 Ver verificaTexto() e DECISIONS §1.64.
 *
 * E, desde a etapa 5 do redesenho v3, uma conferência que não é sobre o HTML de
 * uma página mas sobre a imagem que ela oferece a quem a partilha:
 *
 *   9. os CARTÕES DE PARTILHA. Cada página tem de nomear, em `og:image` e em
 *      `twitter:image`, o cartão que lhe toca: o da SUA rota e da SUA edição,
 *      ou, se for uma página de linha de um ESTUDO DE DADOS, o do seu estudo
 *      (DECISIONS §1.68). A regra da escolha é uma só, e é a função que o
 *      `Base.astro` chama para escrever a etiqueta e que este portão chama para
 *      a conferir. Cada cartão escreveu um registo em `dist/cartoes/` com a
 *      cópia visível e a origem de cada valor; e o portão relê esse registo,
 *      recalcula cada valor do livro-razão ou da prova, compara-o como CADEIA
 *      pela regra do `data-claim`, confere que a cópia visível não tem um
 *      algarismo que não seja um desses valores, e mede as dimensões do PNG no
 *      próprio ficheiro. A conferência dos valores é dos cartões que TRAZEM
 *      valores; a dos algarismos é de todos, e um cartão sem valores só a passa
 *      se não tiver algarismo nenhum. Não é um portão novo: é este, a olhar para
 *      outra superfície do mesmo sítio.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';
import { parse, NodeType } from 'node-html-parser';

import { t } from '../src/i18n/strings.mjs';
import { unidadeDaLinha } from '../src/i18n/unidades.mjs';
import {
  loadClaims,
  digitsOf,
  parsePtNumber,
  motivoDaEntrada,
  derivacaoDaLinha,
  notaDeBandeira,
  provenienciaIncompleta,
  eDerivada,
  POR_VERIFICAR,
} from '../src/lib/ledger.mjs';
import { VERBATIM, normalizeWhitespace } from '../src/data/verbatim.mjs';
import { FIGURAS_PDM, FIGURAS_SOCIAL } from '../src/data/figuras.mjs';
import { EDITIONS, workById, studyLabel } from '../src/data/studies.mjs';
import { LEITURAS } from '../src/data/leituras.mjs';
import { MUNICIPIOS_COM_PAGINA } from '../src/data/municipios.mjs';
/* A LISTA DA CARTA, PARA RECONTAR AS 29 UNIDADES E OS SEUS CONCELHOS (Emenda 20).
   O ponto de observação do portão não é o artefacto do mapa: é a lista de 308
   pares (concelho, unidade) que o sítio já tem em `caop-centroids.mjs`, e a
   função de slug da casa. Duas contas da mesma coisa, cada uma de um sítio. */
import { MUNICIPIOS, DISTRITOS } from '../src/data/caop-centroids.mjs';
/* A lista das regiões, para a recontagem de `regioes_total`. O portão lê a lista
   DECLARADA e conta as páginas construídas; a prova lê a lista e o livro-razão.
   São duas contas de coisas diferentes sobre a mesma afirmação, que é o que faz
   a comparação valer alguma coisa (a disciplina da §1.24). */
import { REGIOES } from '../src/data/regioes.mjs';
/* A lista das áreas declaradas, para as chaves de `areas_pecas_*`. O portão lê a
   lista DECLARADA e conta as peças que cada página construída rendeu; a prova lê
   a lista e o livro-razão. Duas contas de sítios diferentes sobre a mesma
   afirmação, que é a disciplina da §1.24. */
import { AREAS } from '../src/data/areas.mjs';
import { CHAVE_DAS_PECAS } from '../src/lib/prova.mjs';
import { slugDeConcelho } from '../src/lib/inicio.mjs';
import { tituloDaLinha, descricaoDaLinha } from '../src/lib/livro.mjs';
import { matchPath, routePath, HREFLANG, LANGS, PRIMARY_LANG } from '../src/lib/routes.mjs';
import {
  DIMENSOES as MEDIDAS_DO_CARTAO,
  PASTA as PASTA_DOS_CARTOES,
  cartaoDaPagina,
  nomeDoCartao,
} from '../src/lib/cartoes.mjs';
import {
  documentoDaEdicao,
  documentoServido,
  provaDosBytes,
  regiaoDaCabeca,
  MARCA_DOS_ROBOS,
  MOLDURA,
} from '../src/lib/documentos.mjs';
import { leBlocos, Texto } from '../src/lib/eyetext.mjs';
import { renderizacoesAceites } from '../src/data/correcoes.mjs';
import {
  SITE_HOST,
  SITE_NAME,
  SITE_SHORT_NAME,
  PAPEL_CLARO,
  PAPEL_ESCURO,
  canonicalUrl,
} from '../site.config.mjs';
import { ENDERECO_CORRECOES, REGRAS as REGRAS_DO_METODO } from '../src/data/metodo.mjs';
import { SOBRE } from '../src/data/sobre.mjs';
import {
  ANCORA_DA_POLITICA,
  FICHA_DA_PRIMEIRA_PAGINA,
  FRASE as FRASE_DA_POLITICA,
  LINGUA_DO_RESPONSAVEL,
  RESPONSAVEL_EDITORIAL,
  ROTULO as ROTULO_DA_CASA,
  textoDoRotulo,
} from '../src/data/politica-ia.mjs';
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

/**
 * ---------------------------------------------------------------------------
 * O ORÁCULO DOS TEXTOS APROVADOS (segunda passagem, 01.09.2026)
 * ---------------------------------------------------------------------------
 * Lido de um ficheiro que só o portão lê. `src/data/politica-ia.mjs` não o
 * importa, e é isso que faz dele um oráculo: uma cadeia mudada de um lado fica
 * diferente do outro, e a construção fecha. A razão inteira está escrita dentro
 * do próprio ficheiro.
 */
const TEXTOS_APROVADOS = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'scripts', 'textos-aprovados.json'), 'utf8'),
);
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
 *   8. data-agenda="<id>.<campo>" — um campo do registo da agenda ou do
 *                                 calendário das fontes, na página da agenda,
 *                                 comparado carácter a carácter contra o
 *                                 registo que atravessou (§1.40).
 *
 * Isto NÃO é a conta contra a qual os números são conferidos — essa é a do
 * próprio portão, em contasDoPortao(). Isto é o que se compara com ela.
 */
const PROVA_POR_LINGUA = { pt: prova('pt'), en: prova('en') };
const PROVA = PROVA_POR_LINGUA.pt;

const allow = load(fs.readFileSync(ALLOWLIST, 'utf8')) ?? {};
const CONTEXTOS = new Set((allow.contexts ?? []).map((c) => c.id));

/**
 * ---------------------------------------------------------------------------
 * UMA EXCEPÇÃO QUE NÃO DISPENSA NADA (03.09.2026, bloco F0.7)
 * ---------------------------------------------------------------------------
 * A `allowlist` era conferida numa direcção só: todo o motivo que uma página
 * rende tem de estar declarado aqui. O contrário nunca era perguntado, e por
 * isso `data-de-edicao` sobreviveu quatro semanas a não dispensar coisa nenhuma
 * (a auditoria de 02.09.2026 §4 chamou-lhe «a excepção órfã»). Uma lista de
 * excepções que só cresce deixa de ser uma decisão e passa a ser um hábito, que
 * é exactamente o que a cabeça deste ficheiro diz que ela não pode ser.
 *
 * Estes três contadores contam os USOS de facto, sobre o `dist/` inteiro, e o
 * relatório recusa a construção quando algum fica a zero. É a mesma disciplina
 * das duas varreduras vizinhas (o restante da ortografia, as linhas que ninguém
 * cita), com uma diferença que é deliberada: aquelas avisam, esta FECHA. Uma
 * entrada de ortografia a mais não dispensa nada; uma excepção a mais é uma
 * porta aberta no portão dos algarismos, e o custo de a deixar aberta é o custo
 * de um número por conferir numa página.
 *
 * O QUE UM TOKEN SEM ALGARISMOS NUNCA PODE FAZER, dito aqui porque a mensagem
 * sozinha seria um enigma: `tokensProibidos()` só pergunta pela lista quando o
 * token TEM um algarismo. Uma entrada sem algarismos nenhuns nunca é consultada,
 * e por isso nunca dispensa nada, por muito que a página a renda. O `CAOP` era
 * uma dessas e saiu a 03.09.2026, com a sua clareza mudada para o motivo
 * `fonte-da-carta`, que é onde a sigla aparece com a edição atrás («CAOP 2025»).
 */
const USOS = {
  contextos: new Map((allow.contexts ?? []).map((c) => [c.id, 0])),
  tokens: new Map(),
  padroes: new Map(),
};

/**
 * DUAS ENTRADAS COM O MESMO NOME SÃO UMA ENTRADA A MENOS (segunda passagem).
 *
 * Os contadores vivem em `Map`, e os motivos em `Set`: duas declarações com a
 * mesma chave colapsam numa só, em silêncio. A segunda ficaria com a razão que
 * ninguém lê e o contador da primeira, e a régua das órfãs nunca a veria.
 * Recusa-se no carregamento, que é onde o ficheiro ainda é uma lista e não um
 * mapa.
 */
function recusaRepetidos(itens, chaveDe, oQue) {
  const vistos = new Map();
  for (const it of itens) {
    const chave = chaveDe(it);
    vistos.set(chave, (vistos.get(chave) ?? 0) + 1);
  }
  const repetidos = [...vistos].filter(([, n]) => n > 1);
  if (repetidos.length) {
    console.error(
      `\n  PORTÃO DE HTML · ledger/allowlist.yml declara ${oQue} repetido(s): ` +
        repetidos.map(([k, n]) => `"${k}" ${n} vezes`).join(', ') +
        `\n  Duas entradas com o mesmo nome colapsam numa só e a segunda deixa de ser lida.\n`,
    );
    process.exit(1);
  }
}
recusaRepetidos(allow.contexts ?? [], (c) => c.id, 'motivo(s)');
const chaveDoToken = (t) => `${t.token} (scope: ${t.scope ?? 'any'})`;
const chaveDoPadrao = (p) => `${p.pattern} (scope: ${p.scope ?? 'any'})`;
const usou = (mapa, chave) => mapa.set(chave, (mapa.get(chave) ?? 0) + 1);
const TOKENS = (allow.tokens ?? []).map((t) => ({ ...t, scope: t.scope ?? 'any' }));
const PATTERNS = (allow.patterns ?? []).map((p) => ({
  ...p,
  scope: p.scope ?? 'any',
  re: new RegExp(p.pattern),
}));
recusaRepetidos(TOKENS, chaveDoToken, 'token(s)');
recusaRepetidos(PATTERNS, chaveDoPadrao, 'padrão(ões)');
for (const t of TOKENS) USOS.tokens.set(chaveDoToken(t), 0);
for (const p of PATTERNS) USOS.padroes.set(chaveDoPadrao(p), 0);

/** Um token sem algarismos nunca chega a `tokenPermitido()`: ver a nota acima. */
const TOKENS_SEM_ALGARISMOS = TOKENS.filter((t) => !/\d/.test(t.token)).map(chaveDoToken);

/**
 * Cadeias estruturais toleradas no <head>: títulos de estudos, nome do sítio,
 * e as citações registadas. No <head> não há markup onde pendurar
 * data-nonledger, por isso a excepção é por cadeia exacta, tirada do registo —
 * não escrita à mão.
 *
 * As citações entraram a 16.08.2026 (§1.40): a descrição de dois trabalhos
 * passou a ser a frase de abertura do próprio documento, transcrita, e uma
 * delas traz a data da recolha. No corpo da página essa frase vai marcada
 * `data-verbatim` e é comparada carácter a carácter; no `<head>` não há onde
 * pendurar a marca, e a cadeia exacta do registo é a mesma prova por outro
 * caminho. Uma frase que não esteja em `verbatim.mjs` continua a fechar o
 * portão.
 */
/**
 * A pasta dos registos de conteúdo, com a mesma convenção de
 * `src/lib/registos.mjs`: `OEDP_REGISTOS_DIR` aponta para outra pasta.
 *
 * Existe para uma coisa só, e é a que a regra 14 exige: **plantar um estrago
 * num registo sem tocar num byte de `registos/`**. Uma figura com a linha do
 * motor apagada, ou com o resumo de origem tirado, escreve-se numa CÓPIA da
 * pasta, e o portão e o `check:cadeia` leem-na com esta variável. Sem ela, a
 * única maneira de provar essas duas conferências era editar o que o motor
 * atravessou, que é a coisa que a P1 fechou por resumo.
 */
const DIR_DOS_REGISTOS = process.env.OEDP_REGISTOS_DIR ?? path.join(ROOT, 'registos');

/** O separador de uma lista numa cadeia só. O portão tem a sua própria cópia. */
const SEPARADOR_DO_REGISTO = ' · ';

/** Os cinco motivos da lista fechada do motor (publisher/REGISTOS.md). */
const MOTIVOS_DO_REGISTO = new Set([
  'derivado',
  'api-viva',
  'raw-sem-manifesto',
  'pdf-sem-resumo',
  'portal-estatico',
]);

const TRAVESSIA_DOS_REGISTOS = (() => {
  try {
    const doc = JSON.parse(fs.readFileSync(path.join(DIR_DOS_REGISTOS, 'manifest.json'), 'utf8'));
    return doc?.registos ?? null;
  } catch {
    return null;
  }
})();

/**
 * O portão tem o SEU leitor do registo de travessia, e é por ele que sabe se
 * uma edição tem página de leitura. Não importa `src/lib/registos.mjs`, pela
 * mesma razão de sempre: uma conferência que usasse o código das páginas
 * confirmava-se a si própria.
 */
function temRegistoNoPortao(slug, lang) {
  return Boolean(TRAVESSIA_DOS_REGISTOS && TRAVESSIA_DOS_REGISTOS[`${slug}/${lang}`]);
}

const REGISTOS_LIDOS = new Map();
function registoDoPortao(slug, lang) {
  const chave = `${slug}/${lang}`;
  if (REGISTOS_LIDOS.has(chave)) return REGISTOS_LIDOS.get(chave);
  let registo = null;
  try {
    registo = JSON.parse(
      fs.readFileSync(path.join(DIR_DOS_REGISTOS, slug, `${lang}.record.json`), 'utf8'),
    );
  } catch {
    registo = null;
  }
  REGISTOS_LIDOS.set(chave, registo);
  return registo;
}

/**
 * O TÍTULO DE UMA PÁGINA DE LEITURA É O BLOCO 0 DO SEU REGISTO, e entra aqui
 * pela mesma razão que as citações: no `<head>` não há onde pendurar a marca, e
 * a cadeia exata do registo é a mesma prova por outro caminho. O portão lê os
 * registos do disco com o seu próprio leitor e retira do `<head>` exatamente
 * essas cadeias; um título que não seja o do registo não é retirado e o
 * varrimento apanha-o. **Medido**: das oito, duas trazem algarismos no título do
 * documento e nenhuma delas coincide com um título de edição do arquivo.
 */
const TITULOS_DOS_REGISTOS = (() => {
  const saida = [];
  for (const chave of Object.keys(TRAVESSIA_DOS_REGISTOS ?? {})) {
    const slug = chave.slice(0, chave.lastIndexOf('/'));
    const lang = chave.slice(chave.lastIndexOf('/') + 1);
    const registo = registoDoPortao(slug, lang);
    const titulo = registo?.blocks?.[0]?.text;
    if (titulo) saida.push(titulo);
  }
  return saida;
})();

const CADEIAS_HEAD = [
  ...EDITIONS.map((e) => e.title),
  ...TITULOS_DOS_REGISTOS,
  ...Object.values(VERBATIM).map((v) => v.text),
  SITE_NAME,
].sort(
  (a, b) => b.length - a.length,
);

/* ===========================================================================
 * O SÍTIO NO ECRÃ PRINCIPAL (28.08.2026, `design/marca/BRIEF-app.md`)
 * ===========================================================================
 * O que o portão reconhece na cabeça de cada página, e o que ele confere uma
 * vez no fim, sobre os dois manifestos construídos.
 * ======================================================================== */

/** O manifesto de cada edição. É por edição porque o `start_url` é por edição. */
const MANIFESTO_DA_EDICAO = { pt: '/manifest.webmanifest', en: '/en/manifest.webmanifest' };

/** As três ligações de ícone, com o ficheiro de cada uma. */
const LIGACOES_DO_APP = [
  {
    selector: 'link[rel="icon"][href="/favicon.ico"]',
    href: '/favicon.ico',
    sizes: '32x32',
    oQueE: 'favicon do cliente velho',
  },
  {
    selector: 'link[rel="icon"][type="image/svg+xml"]',
    href: '/favicon.svg',
    sizes: null,
    oQueE: 'favicon vetorial',
  },
  {
    selector: 'link[rel="apple-touch-icon"]',
    href: '/apple-touch-icon.png',
    sizes: null,
    oQueE: 'ícone do iPhone',
  },
];

/**
 * O QUE UM MANIFESTO TEM DE DIZER, campo a campo.
 *
 * Um manifesto é um ficheiro DATILOGRAFADO — não há gabarito que o componha, e
 * não é uma página que este portão varra. É por isso que ele é conferido aqui
 * contra a fonte de verdade de cada campo: o nome e o nome curto contra
 * `site.config.mjs`, as duas cores contra o papel dos tokens, e cada ícone
 * contra o ficheiro que está em `dist/` e o tamanho que a cabeça do PNG declara.
 * A alternativa era um ficheiro que ninguém confere, e esses ficam errados no
 * commit seguinte sem ninguém dar por isso (IDENTIDADE.md §10).
 */
const MANIFESTOS = [
  { lang: 'pt', caminho: '/manifest.webmanifest', lingua: 'pt-PT', inicio: '/' },
  { lang: 'en', caminho: '/en/manifest.webmanifest', lingua: 'en', inicio: '/en/' },
];

/** Os ícones que um manifesto declara, com o tamanho e o propósito de cada um. */
const ICONES_DO_MANIFESTO = [
  { src: '/icon-192.png', sizes: '192x192', px: 192, purpose: 'any' },
  { src: '/icon-512.png', sizes: '512x512', px: 512, purpose: 'any' },
  { src: '/icon-512-maskable.png', sizes: '512x512', px: 512, purpose: 'maskable' },
];

/**
 * O TAMANHO DE UM ÍCONE LÊ-SE DA CABEÇA DO PNG, E NÃO DO NOME DELE.
 *
 * Quem o lê é `medidasDoPng()`, que já existe neste ficheiro para os cartões de
 * partilha: um ficheiro chamado `icon-512.png` com 192 px lá dentro passaria em
 * qualquer conferência que olhasse para o nome, e é a mesma pergunta nas duas
 * superfícies. Fica dito aqui para quem ler esta secção primeiro.
 */

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
/** O rótulo de IA, contado pelo lado da página: rodapé, topo, ficha e frase. */
const ROTULO_DE_IA = { rodape: 0, topo: 0, ficha: 0, frase: 0 };
let paginasDoLivro = 0;
/** Valores auditados pela regra do selo, e quantos ficaram sem ele (sempre 0: falha). */
let valoresAuditados = 0;
let valoresSemSelo = 0;
/** Ligações internas conferidas contra os ficheiros construídos. */
let ligacoesConferidas = 0;
/** Manifestos e ícones conferidos campo a campo contra as fontes de verdade. */
const manifestosConferidos = { ficheiros: 0, icones: 0 };
/** Recortes conferidos: o ficheiro construído contra o resumo da linha. */
let recortesConferidos = 0;
/** Ficheiros alojados conferidos: a porta da página contra o campo da linha. */
let alojadosConferidos = 0;
/** Linhas calculadas sobre ficheiros que o sítio não aloja, conferidas. */
let calculadosConferidos = 0;
/** Portas para cópias arquivadas, conferidas contra o campo da linha. */
let arquivadasConferidas = 0;
/** Páginas humanas de séries conferidas contra o campo da linha. */
let paginasDeSerieConferidas = 0;
/**
 * Cada `href` interno encontrado, com a página onde está e a base contra a
 * qual um endereço relativo se resolve.
 *
 * Até 16.08.2026 só entravam aqui os `href` que começavam por `/`: «agenda» e
 * «../sobre» eram invisíveis à conferência, e uma âncora que não existisse na
 * página de destino também (revisão cruzada, #11). Passa a entrar tudo o que
 * não seja um endereço com esquema, e a âncora é conferida contra os `id` da
 * página para onde aponta.
 */
const ligacoesInternas = [];
/** Os `id` de cada página construída, para conferir as âncoras. */
const idsPorPagina = new Map();
/** Quantas ligações relativas e quantas âncoras foram conferidas. */
let ligacoesRelativas = 0;
let ancorasConferidas = 0;
/** Ocorrências dispensadas por estarem entre «…»: contadas para não crescerem em silêncio. */
let excluidasPorCitacao = 0;

/**
 * As ocorrências de `data-prova` de TODAS as páginas, guardadas para depois.
 *
 * A comparação não pode acontecer durante o varrimento: metade das contas do
 * portão só existem quando ele acabou de contar as páginas construídas. Cada
 * ocorrência guarda o que basta para a mensagem de erro dizer onde está.
 */
const ocorrenciasDaProva = [];

/**
 * ---------------------------------------------------------------------------
 * UMA CONTAGEM PODE APARECER COMO UMA LISTA DE NOMES, E TAMBÉM SE RECONTA
 * ---------------------------------------------------------------------------
 * Extensão do bloco acima (etapa 2m, brief §2). A manchete da primeira página
 * diz «Portugal ultrapassa 4 limiares», e o 4 é um `data-prova` que o portão
 * reconta. A LEDE dizia a mesma contagem por extenso — «Fora do limiar: dívida
 * pública, posição de investimento internacional, custo unitário do trabalho e
 * preços da habitação» — e essa não era conferida por ninguém: no dia em que
 * uma quinta medida atravessasse o limiar, a manchete dizia 5 e a lede
 * continuava a nomear quatro.
 *
 * `data-prova-lista="<chave>"` marca o elemento que TEM a lista, e o portão
 * conta-lhe os itens partindo o texto pelos separadores da edição. É a mesma
 * disciplina do `data-prova`: não se importa a função que compôs a frase — o
 * portão parte a cadeia com a sua própria leitura, e as duas contas têm de bater
 * certo.
 *
 * OS SEPARADORES SÃO DECLARADOS, POR EDIÇÃO, e são estes e mais nenhum. Um nome
 * de medida que trouxesse uma vírgula ou um « e » solto dentro dele partiria em
 * dois e a contagem fecharia a construção — o que é o modo certo de falhar:
 * ruidoso e no sítio, em vez de uma lista que se lê mal em silêncio. Nenhum dos
 * treze nomes do Procedimento tem um, nas duas línguas (medido).
 */
const SEPARADORES_DA_LISTA = {
  pt: /,\s+|\s+e\s+/g,
  en: /,\s+|\s+and\s+/g,
};

/** As ocorrências de `data-prova-lista`, conferidas no fim como as outras. */
const ocorrenciasDaLista = [];

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
/**
 * AS PEÇAS QUE CADA PÁGINA DE ÁREA RENDEU, por «língua:slug».
 *
 * É o ponto de observação do portão para `areas_pecas_*`: a prova conta-as na
 * lista de dados e no livro-razão, e o portão conta o que a PÁGINA CONSTRUÍDA
 * tem marcado `data-area-peca`. Uma peça que o mapa dá e a página não rende, ou
 * uma que a página rende e o mapa não dá, dá dois números diferentes e a
 * construção fecha.
 */
const pecasDeArea = new Map();
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
/** Quantas páginas de leitura o varrimento viu. Entra no relatório do portão. */
let paginasDeTexto = 0;

/**
 * ---------------------------------------------------------------------------
 * AS MARCAS DAS PÁGINAS DE LEITURA, CONTADAS NO `dist/` E MAIS NADA
 * ---------------------------------------------------------------------------
 *
 * SEIS das oito chaves `registos_*` contam-se aqui, sobre o que foi construído:
 * as páginas de leitura que existem, as marcas `data-registo-bloco`, as marcas
 * `data-registo`, os selos colados às figuras, e as saídas que nomeiam a linha
 * do motor de cada figura.
 *
 * **`registos_resolvidos` e `registos_por_resolver` passaram para aqui a
 * 24.08.2026** (ronda de correções 1), e a razão é uma coisa que mudou na
 * página: até então, as 42 figuras que estão dentro de uma ligação do documento
 * não tinham saída nenhuma (a porta estava só na entrada da linha), e o
 * `dist/` não sabia nomear a linha do motor que as resolve. Com a porta a ir
 * imediatamente depois da ligação, cada figura tem no `dist/` uma saída que
 * nomeia a sua linha, e as duas chaves deixaram a vista `registos` (uma segunda
 * leitura dos mesmos ficheiros) pela vista `dist` (o que foi construído).
 *
 * **Não é o passeio do `verificaTexto()`, e é de propósito.** Aquele percorre o
 * registo e vai buscar à página o que o registo diz que lá deve estar; este
 * conta o que a página TEM, sem perguntar ao registo. Se fossem o mesmo
 * passeio, um erro nele contava-se a si próprio, e a comparação com
 * `src/lib/prova.mjs` deixava de ser entre dois pontos de observação.
 */
const MARCAS_DO_TEXTO = { paginas: 0, blocos: 0, figuras: 0, selos: 0, portas: 0, portasSemLinha: 0 };

function contaAsMarcasDoTexto(root) {
  const artigo = root.querySelector('[data-registo-edicao]');
  if (!artigo) return;
  MARCAS_DO_TEXTO.paginas++;
  MARCAS_DO_TEXTO.blocos += artigo.querySelectorAll('[data-registo-bloco]').length;
  MARCAS_DO_TEXTO.figuras += artigo.querySelectorAll('[data-registo]').length;
  /* Dentro do corpo transcrito o selo é a única mobília com texto, e vai
     sempre ao lado de uma figura com linha do sítio (o L6 confere-o um a um);
     contá-los é contar essas figuras, sem lhes perguntar a linha. */
  MARCAS_DO_TEXTO.selos += artigo.querySelectorAll('a.src-chip').length;
  /* As portas do corpo transcrito, as duas formas: a figura que é ela própria a
     âncora, e a que vai a seguir a uma ligação do documento. Uma porta que abre
     `#linha-` e mais nada é uma figura cuja linha do motor está vazia, e é o que
     o `check:cadeia` nomeia no passo 2, contado aqui pelo lado da página. */
  for (const porta of artigo.querySelectorAll('a[href^="#linha-"]')) {
    const href = decodeEntities(porta.getAttribute('href') ?? '');
    if (href === '#linha-') MARCAS_DO_TEXTO.portasSemLinha++;
    else MARCAS_DO_TEXTO.portas++;
  }
}

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
    if (t.token === token) {
      usou(USOS.tokens, chaveDoToken(t));
      return true;
    }
  }
  for (const p of PATTERNS) {
    if (p.scope !== 'any' && p.scope !== scope) continue;
    if (p.re.test(token)) {
      usou(USOS.padroes, chaveDoPadrao(p));
      return true;
    }
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
 * A FORMA DA CASA DE UMA DATA: a cópia própria do portão (bloco F1.4).
 *
 * A regra é a da §1.91 e vive em `src/lib/datas.mjs`: dd.mm.aaaa, e o que não é
 * uma data completa passa como está (um ano é um ano). Está escrita OUTRA VEZ
 * aqui, e é de propósito: um portão que recompusesse a data pela mesma função
 * que o gabarito usa confirmava a função e não o registo. É a mesma razão do
 * separador de `attributed_to` (§1.31) e da página do `#page=`.
 *
 * @param {string} valor
 */
function dataDaCasaGate(valor) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : valor;
}

/**
 * A FORMA DE UM VALOR — a cópia própria do portão, e o que ela normaliza.
 *
 * Bloco T, T4. Até 18.08.2026 um `data-claim` era conferido por `digitsOf`, que
 * deita fora tudo o que não é algarismo: o sinal menos, a vírgula decimal, o
 * espaço dos milhares e qualquer símbolo metido dentro do elemento. Medido com
 * dois estragos plantados de propósito (§1.44, e a §4.1 registou-os): «96%»
 * onde o livro-razão diz «96» passava, e a posição de investimento
 * internacional sem o sinal menos rendia «50,2» na primeira página sem um único
 * erro nessa página.
 *
 * Passa a comparar-se a CADEIA. Esta função diz, exactamente, o que é a mesma
 * escrita e o que é outro número. Vive aqui, e não em `src/lib/`, porque um
 * portão que normalize pela mesma função que o gabarito usa confirma a função e
 * não o livro-razão (a mesma razão do separador de `attributed_to`, §1.31, e
 * dos rótulos das reconferências, §1.47 T1). O gabarito não normaliza nada: ele
 * escreve o valor tal e qual, e é isso que esta função existe para provar.
 *
 * O QUE É NORMALIZADO, e porquê:
 *
 *   · U+2212 (−) passa a U+002D (-). São o mesmo sinal para quem lê: o
 *     livro-razão escreve o tipográfico, um teclado escreve o outro. O que NÃO
 *     se normaliza é a PRESENÇA do sinal: sem ele o número é outro, e é
 *     exactamente o estrago que fechou esta conferência;
 *   · U+202F (espaço fino inquebrável), U+00A0 (espaço inquebrável) e U+2009
 *     (espaço fino) passam a U+0020. Os quatro são o separador dos milhares na
 *     tipografia portuguesa, e o próprio livro-razão usa dois deles: a maioria
 *     dos valores leva U+202F e «−34 100» leva U+0020. O mesmo separador escrito
 *     noutro ponto de código é o mesmo separador;
 *   · corridas de espaço em branco passam a um só espaço, e as pontas caem. O
 *     espaço em branco do HTML é indentação do gabarito e não conteúdo.
 *
 * O QUE NÃO É NORMALIZADO, e é o que faz a conferência valer alguma coisa:
 *
 *   · a vírgula decimal. «50,2» e «50.2» são números diferentes: em português o
 *     ponto separa milhares, e trocá-los muda o valor por três ordens de
 *     grandeza;
 *   · tudo o resto. Um «%», um «€», uma palavra ou uma letra dentro do elemento
 *     `data-claim` fazem as cadeias diferir, e é assim que se impõe a regra que
 *     o `Claim.astro` já segue: dentro do elemento vai o valor do livro-razão e
 *     mais nada, e o símbolo da unidade fica fora dele.
 *
 * @param {string} s
 */
function formaDoValor(s) {
  return String(s)
    .replace(/−/g, '-')
    .replace(/[   ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * O texto que um leitor COM VISTA vê: o mesmo, menos o que está escondido para
 * leitores de ecrã (`.vh`). São duas superfícies diferentes e a v2 precisa de
 * as separar: o selo carrega a etiqueta do estudo no texto oculto e a palavra
 * «fonte» à vista, e cada uma tem a sua conferência.
 */
function textoVisivel(el) {
  const partes = [];
  const anda = (n) => {
    if (!n) return;
    if (n.nodeType === NodeType.TEXT_NODE) return void partes.push(n.rawText);
    const classes = String(n.getAttribute?.('class') ?? '').split(/\s+/);
    if (classes.includes('vh')) return;
    for (const filho of n.childNodes ?? []) anda(filho);
  };
  anda(el);
  return normalizeWhitespace(decodeEntities(partes.join('')));
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
/**
 * `identificador-tecnico` entrou aqui a 24.08.2026, com a página de leitura: o
 * `origin_ref` de um registo de conteúdo é o caminho de um ficheiro do motor
 * mais o commit de onde ele saiu («content/04 Évora Public Money/Évora —
 * Prometido, Pago, Auditado 2026 (pt-PT).record.json @ …»), e o travessão que
 * ele traz é do NOME DO FICHEIRO. A §9 da constituição diz que o que é
 * transcrito nunca se converte, e um nome de ficheiro que se reescrevesse
 * deixava de poder ser copiado. É a mesma razão do `titulo-de-estudo`, que já
 * cá estava.
 */
const NONLEDGER_CITADO = new Set(['titulo-de-estudo', 'proveniencia', 'identificador-tecnico']);

function eCitado(no) {
  const tag = String(no.rawTagName ?? '').toLowerCase();
  if (TAGS_CITADAS.has(tag)) return true;
  const attrs = no.attributes ?? {};
  if ('data-verbatim' in attrs) return true;
  if ('data-linha-campo' in attrs) return true;
  /* Uma unidade da página de leitura é o texto de um documento fixado, e é
     comparada carácter a carácter com ele (a nona origem, L2). A grafia dela
     não é da casa: converter um travessão que o documento imprime seria a
     página a deixar de ser o documento. É a mesma isenção do `data-verbatim`,
     pela mesma razão e com a mesma comparação por trás. */
  if ('data-registo-unidade' in attrs) return true;
  /* Uma entrada do índice «Nesta página» é o título de um bloco do mesmo
     registo, comparado carácter a carácter no L8. Mesma razão, mesma isenção. */
  if ('data-registo-indice' in attrs) return true;
  return NONLEDGER_CITADO.has(attrs['data-nonledger'] ?? '');
}

/**
 * OS ESTADOS DE ESPÉCIME que uma página construída não pode render (§6).
 *
 * São os três que a constituição nomeia (caixa de exemplo, espécime, nota de
 * protótipo), nas duas edições, e as suas flexões regulares. A lista é curta de
 * propósito: cada palavra a mais é uma palavra portuguesa a menos que a prosa
 * da casa pode usar. `placeholder` NÃO está aqui, e é uma decisão: é o nome de
 * uma classe que este sítio usa para o ESTADO EDITORIAL de uma página do
 * arquivo («Rascunho · sem conteúdo»), que se diz por palavras e leva a lado
 * nenhum sem prometer prova. Está em `DECISIONS.md` §4.1, para o juízo da
 * direção.
 */
const ESTADOS_DE_ESPECIME = new Set([
  'exemplo',
  'exemplos',
  'prototipo',
  'prototipos',
  'especime',
  'especimes',
  'example',
  'examples',
  'prototype',
  'prototypes',
  'specimen',
  'specimens',
]);

/** Sem acentos e em minúsculas: «Protótipo», «PROTOTIPO» e «protótipos» são o mesmo estado. */
function normalizaEstado(s) {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/** Este nó, ou algum antepassado, é citação? A palavra citada não se julga. */
function dentroDeCitacao(no) {
  for (let n = no; n; n = n.parentNode) {
    if (n.nodeType !== NodeType.ELEMENT_NODE) continue;
    if (eCitado(n)) return true;
  }
  return false;
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
      if (emCitacao(texto, o.inicio)) {
        excluidasPorCitacao++;
        continue;
      }
      saida.push({ palavra: o.forma, troca: o.troca, ctx: contexto(texto, o.forma) });
    }
  }
  for (const o of procuraTravessoes(texto)) {
    if (emCitacao(texto, o.inicio)) {
      excluidasPorCitacao++;
      continue;
    }
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
 * A OCULTAÇÃO ESCRITA NO PRÓPRIO DOCUMENTO (segunda passagem, 01.09.2026)
 * ---------------------------------------------------------------------------
 * Devolve o nome do que esconde um elemento, ou `null`. Olha para ele e para
 * todos os antepassados, e conhece quatro formas: `hidden`, `aria-hidden="true"`,
 * a classe `.vh` da casa, e um `style` em linha com `display:none` ou
 * `visibility:hidden`.
 *
 * A QUARTA ENTROU NA SEGUNDA PASSAGEM. A porta das correções conhecia três, e a
 * leitura a frio notou que a mais barata de todas faltava: um `style` no próprio
 * documento não precisa de folha nenhuma para apagar um bloco.
 *
 * **E O QUE ELA NÃO ALCANÇA, DITO E NÃO ESCONDIDO**: uma regra numa folha de
 * estilos. Este é um portão estático, lê HTML e não corre CSS. Quem apanha a
 * ocultação por folha é a régua do navegador, `tests/inicio/rotulo.mjs`, que
 * mede a caixa de facto e tem o estrago plantado que o prova.
 */
const ESTILO_QUE_ESCONDE = /(^|;)\s*(display\s*:\s*none|visibility\s*:\s*hidden)\s*(;|$)/i;

function escondidoNoDocumento(el) {
  let no = el;
  while (no && no.nodeType !== undefined) {
    const attrs = no.attributes ?? {};
    if ('hidden' in attrs) return 'hidden';
    if ((attrs['aria-hidden'] ?? '') === 'true') return 'aria-hidden="true"';
    if (/(^|\s)vh(\s|$)/.test(String(attrs['class'] ?? ''))) return 'class="vh"';
    const estilo = String(attrs['style'] ?? '');
    if (ESTILO_QUE_ESCONDE.test(estilo)) return `style="${estilo.slice(0, 60)}"`;
    no = no.parentNode;
  }
  return null;
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
 *      não tem um único algarismo**;
 *   6. o `<html>` DECLARA A SUA LÍNGUA, e a raiz da etiqueta é a da edição;
 *   7. o `<head>` traz UMA marca `robots` e ela diz `noindex, follow`;
 *   8. a faixa traz o RÓTULO DE IA, com o texto aprovado carácter a carácter, a
 *      porta para a política, e o nome de quem responde com a marca de língua
 *      que a edição inglesa exige.
 *
 * AS TRÊS ÚLTIMAS ENTRARAM A 03.09.2026 (bloco F0.7). Não bastava acrescentá-las
 * em `src/lib/documentos.mjs`: o ponto 4 compara o construído com o que aquele
 * módulo produz, e por isso uma marca tirada de lá mudava os DOIS lados da
 * igualdade e passava em silêncio. Estas três leem o ficheiro construído e
 * exigem a marca por si, que é o que as torna um portão e não um espelho.
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
/**
 * O LEITOR DE ETIQUETAS DESTE PORTÃO, e porque não é o do módulo.
 *
 * `src/lib/documentos.mjs` tem o seu (`zonasOpacas` e `etiquetaReal`) e é com
 * ele que a casa DECIDE onde escrever. Um portão que o importasse para conferir
 * o que ele escreveu confirmava-se a si próprio: o mesmo defeito nos dois lados
 * da igualdade passava verde. Este é outro código, escrito aqui, com a mesma
 * regra e nada mais: uma etiqueta dentro de um comentário, de um `<script>` ou
 * de um `<style>` não é uma etiqueta.
 *
 * Devolve todas as etiquetas de ABERTURA reais, por ordem no ficheiro.
 *
 * @param {string} texto
 * @returns {{ nome: string, texto: string, inicio: number }[]}
 */
function etiquetasReais(texto) {
  const opacas = [];
  for (const re of [
    /<!--[\s\S]*?(?:-->|$)/g,
    /<script\b[^>]*>[\s\S]*?(?:<\/script\s*>|$)/gi,
    /<style\b[^>]*>[\s\S]*?(?:<\/style\s*>|$)/gi,
  ]) {
    for (const m of texto.matchAll(re)) opacas.push([m.index, m.index + m[0].length]);
  }
  const saida = [];
  for (const m of texto.matchAll(/<([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*>/g)) {
    if (opacas.some(([de, ate]) => m.index >= de && m.index < ate)) continue;
    saida.push({ nome: m[1].toLowerCase(), texto: m[0], inicio: m.index });
  }
  return saida;
}

/**
 * UM SINAL DE ESCONDER, NA PRÓPRIA ETIQUETA (Minor 11, segunda passagem, para
 * o `<h1>`, abaixo). `hidden`, `aria-hidden="true"` (com aspas simples,
 * duplas ou nenhumas), ou um `display:none`/`visibility:hidden` DENTRO do
 * valor do `style` em linha (e só dentro dele: um `style="color:red"` não é
 * um sinal de esconder, e por isso o valor extrai-se antes de se procurar
 * `display`/`visibility` lá dentro). Não apanha uma regra de folha que
 * escondesse a etiqueta por selector: isto é um varrimento de texto, sem
 * motor de CSS.
 *
 * @param {string} etiqueta a etiqueta de abertura, ex. `<h1 class="x">`
 */
function h1EscondidoNaEtiqueta(etiqueta) {
  if (/\bhidden\b/i.test(etiqueta)) return true;
  if (/\baria-hidden\s*=\s*(?:"true"|'true'|true\b)/i.test(etiqueta)) return true;
  const estilo = etiqueta.match(/\bstyle\s*=\s*"([^"]*)"/i) ?? etiqueta.match(/\bstyle\s*=\s*'([^']*)'/i);
  const valorDoEstilo = estilo ? estilo[1] : '';
  return /display\s*:\s*none|visibility\s*:\s*hidden/i.test(valorDoEstilo);
}

function verificaDocumento({ rota, rel, caminho, html, root, err }) {
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

  /**
   * 4b — A PROVA DOS BYTES, INDEPENDENTE DO TRANSFORMADOR (segunda passagem).
   *
   * O ponto 4 acima compara o construído com `documentoServido()` e prova uma
   * coisa mais estreita do que a primeira passagem escreveu: prova que o
   * transformador é DETERMINÍSTICO. Se ele corromper um documento, corrompe os
   * dois lados da igualdade, e a comparação continua verde. Foi o que a leitura
   * a frio apontou (Blocking 3).
   *
   * Esta prova não passa pelo transformador. Lê os BYTES do ficheiro de origem,
   * lê os bytes do construído, e compara fatias: a cauda do construído tem de
   * ser, byte a byte, a cauda do original a seguir ao seu `<body>`; e tirar do
   * construído a única marca dos robôs tem de devolver, entre o `<head>` e o
   * `<body>`, os bytes do original entre os seus.
   */
  const falhaDosBytes = provaDosBytes(fs.readFileSync(origem.ficheiro, 'utf8'), html);
  if (falhaDosBytes) {
    err(
      `o documento construído não preserva os bytes do original.\n` +
        `      ${falhaDosBytes}\n` +
        `      origem: ${path.relative(ROOT, origem.ficheiro)}`,
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

  /**
   * A PORTA PARA O SOBRE, TAMBÉM AQUI.
   *
   * A regra 9 do Método diz «todas as páginas construídas levam a porta para
   * lá», e até 16.08.2026 não era verdade: este ramo devolve antes de a
   * conferência geral correr, e as quinze páginas de documento saíam sem ela.
   * A conferência não podia simplesmente estender-se ao ficheiro inteiro: o
   * corpo do documento é obra citada e não se lhe acrescenta nada. Estende-se
   * à FAIXA, que é markup nosso e já é conferida aqui campo a campo.
   */
  const portaDoSobre = routePath('sobre', lang);
  const temSobre = (faixa.querySelectorAll('a[href]') ?? []).some(
    (a) => decodeEntities(a.getAttribute('href') ?? '') === portaDoSobre,
  );
  if (!temSobre) {
    err(
      `a faixa do observatório não tem ligação para "${portaDoSobre}".\n` +
        `      A autoria deste sítio está dita no Sobre, e todas as páginas construídas levam ` +
        `lá. Num documento a porta vai na faixa: o corpo é obra citada e não se lhe acrescenta ` +
        `nada (src/lib/documentos.mjs).`,
    );
  }

  /**
   * A PORTA DA LEITURA NO SÍTIO, quando ela existe (bloco B, item B2).
   *
   * A faixa é markup nosso e por isso é conferida campo a campo; esta é a
   * conferência do campo novo. A regra é a mesma que a página do estudo segue:
   * onde há registo de conteúdo há página de leitura e a porta rende-se; onde
   * não há, não há porta nenhuma, e uma porta a mais seria uma que dá 404.
   */
  const portaDoTexto = temRegistoNoPortao(slug, lang) ? routePath('texto', lang, { slug }) : null;
  const aDoTexto = faixa.querySelector('[data-oedp-texto]');
  if (portaDoTexto && !aDoTexto) {
    err(
      `a faixa do observatório não tem a porta da leitura no sítio.\n` +
        `      esperava-se um <a data-oedp-texto href="${portaDoTexto}">.\n` +
        `      Esta edição tem registo de conteúdo e por isso tem página de leitura: quem chega ` +
        `à edição de registo tem de poder ir para lá (bloco B, item B2).`,
    );
  } else if (!portaDoTexto && aDoTexto) {
    err(
      `a faixa do observatório tem a porta da leitura no sítio e esta edição não tem registo ` +
        `de conteúdo: a porta abriria uma página que não é construída.`,
    );
  } else if (portaDoTexto && decodeEntities(aDoTexto.getAttribute('href') ?? '') !== portaDoTexto) {
    err(
      `a porta da leitura no sítio abre "${aDoTexto.getAttribute('href')}" e devia abrir ` +
        `"${portaDoTexto}", a página de leitura desta edição.`,
    );
  }

  /**
   * 9 · A MOLDURA, E O MARCO PRINCIPAL A UM (bloco F1.8, 03.09.2026).
   *
   * O ponto 4 compara o construído com `documentoServido()` e por isso não
   * prova nada sobre a moldura: uma moldura tirada do módulo desaparecia dos
   * dois lados da igualdade e passava em silêncio, que é exactamente a falha
   * que o F0.7 encontrou nas três marcas da casa. Estas conferências leem o
   * ficheiro CONSTRUÍDO e exigem a moldura por si.
   *
   * Três coisas, e cada uma é a medida de aceitação de uma linha do brief:
   *
   *   · UM marco principal por página. Treze documentos não tinham nenhum e
   *     três tinham o seu; depois da moldura são dezasseis com um, e nunca dois
   *     (um `<main>` dentro de outro é markup inválido, e dois marcos numa
   *     página mandam quem ouve escolher entre eles);
   *   · UMA moldura, e a FAIXA FORA DELA. É a razão de a moldura existir: quem
   *     salta para o marco principal tem de cair no documento e não na mobília
   *     da casa. Uma faixa dentro da moldura passava a fazer parte do que se
   *     salta para ler;
   *   · UM `<h1>`. Se o documento traz o seu, a casa não acrescenta outro; e a
   *     faixa não é um título.
   *
   * POR POSIÇÃO NO FICHEIRO, E NÃO À ÁRVORE, que é a mesma escolha do ponto 7, e
   * aqui foi uma medição que a impôs. `studies-src/onde-esta-a-agua/pt.html` é
   * dois documentos HTML concatenados: um `<!doctype html><html><head></head>
   * <body>` inteiro dentro do corpo do primeiro. O Chromium 148 monta a árvore
   * certa (`body > [faixa, folha, guião, main[moldura]]`, um `<main>` só,
   * medido), e o `node-html-parser` deste portão perde o elemento nesse
   * ficheiro e só nesse. Um portão que perguntasse à árvore chumbava um
   * documento que está bem, e o que ele quer saber é o que o LEITOR vai
   * receber. Conta-se no ficheiro, com o leitor de etiquetas deste portão, que
   * não é o do módulo: uma conferência que usasse o código do módulo
   * confirmava-se a si própria.
   */
  const etiquetas = etiquetasReais(html);
  const abertura = `${MOLDURA.propria.abre}|${MOLDURA.aninhada.abre}`;
  const molduras = etiquetas.filter((e) => e.texto === MOLDURA.propria.abre || e.texto === MOLDURA.aninhada.abre);
  if (molduras.length !== 1) {
    err(
      `o documento tem ${molduras.length} molduras da casa; tem de ter exactamente uma.\n` +
        `      Esperava-se \`${abertura}\` uma vez. A moldura envolve o corpo do documento e ` +
        `deixa a faixa de fora. Ver src/lib/documentos.mjs, \`comFaixa()\`.`,
    );
  }

  const marcos = etiquetas.filter((e) => e.nome === 'main');
  if (marcos.length !== 1) {
    err(
      `o documento tem ${marcos.length} elemento(s) \`<main>\`; tem de ter exactamente um.\n` +
        `      Treze dos dezasseis não traziam nenhum e a moldura põe o seu; nos três que já o ` +
        `tinham, a moldura é um \`<div>\` para não duplicar o marco.`,
    );
  }

  /* A FAIXA FORA DA MOLDURA, medida pela ordem no ficheiro: a moldura é UM
     elemento aberto num ponto, e uma faixa que comece antes desse ponto não
     pode estar lá dentro. */
  const faixasNoFicheiro = etiquetas.filter((e) => e.texto.startsWith('<div data-oedp-faixa'));
  if (molduras.length === 1 && faixasNoFicheiro.length === 1 && faixasNoFicheiro[0].inicio > molduras[0].inicio) {
    err(
      `a faixa do observatório está DENTRO da moldura (a faixa abre no símbolo ` +
        `${faixasNoFicheiro[0].inicio} e a moldura no ${molduras[0].inicio}).\n` +
        `      A moldura existe para que quem salta para o marco principal caia no documento; ` +
        `com a faixa lá dentro, salta para a mobília da casa.`,
    );
  }

  const titulos = etiquetas.filter((e) => e.nome === 'h1');
  if (titulos.length !== 1) {
    err(
      `o documento tem ${titulos.length} \`<h1>\`; tem de ter exactamente um.\n` +
        `      A faixa da casa não acrescenta título nenhum: o título é o do documento.`,
    );
  } else if (h1EscondidoNaEtiqueta(titulos[0].texto)) {
    /**
     * UM `<h1>` COM UM SINAL DE SE ESCONDER NA PRÓPRIA ETIQUETA NÃO É UM
     * TÍTULO VISÍVEL (Minor 11, segunda passagem). A conferência de cima só
     * contava a etiqueta; um `hidden`, um `aria-hidden="true"` ou um
     * `display:none`/`visibility:hidden` em linha, na PRÓPRIA etiqueta,
     * passavam como se fosse um título normal. Isto é um varrimento ESTÁTICO,
     * sem motor de CSS: apanha o que está na etiqueta, não uma regra de folha
     * algures que a escondesse por selector — essa conferência, completa
     * (estilo calculado, `getClientRects`), é da régua em navegador
     * (`tests/documentos/moldura.mjs`, célula C4).
     */
    err(
      `o \`<h1>\` do documento tem, na própria etiqueta, um sinal de se esconder ` +
        `(\`hidden\`, \`aria-hidden="true"\` ou \`display:none\`/\`visibility:hidden\` em linha): ` +
        `${JSON.stringify(titulos[0].texto.slice(0, 160))}.\n` +
        `      A faixa da casa não acrescenta título nenhum: o título tem de ser o do documento, e visível.`,
    );
  }

  /* ------------------------------------------- 6, 7 e 8: as marcas da casa */

  /* 6 — A LÍNGUA, EXACTA (segunda passagem, 03.09.2026). A primeira forma
     comparava a RAIZ da etiqueta e deixava passar «pt» numa edição que a casa
     escreve «pt-PT». Isso era um contrato a duas vozes: o módulo preservava a
     forma do autor e o portão fingia que qualquer forma servia, e nenhum dos
     dois dizia qual era a etiqueta certa. Passa a ser a da edição, carácter a
     carácter, e é `comMarcasDaCasa()` que a põe lá: acrescenta onde falta,
     normaliza a forma da mesma língua, e recusa o resto. */
  const esperadaNoHtml = HREFLANG[lang];
  const elHtml = root.querySelector('html');
  const langDeclarado = elHtml?.getAttribute('lang') ?? null;
  if (langDeclarado !== esperadaNoHtml) {
    err(
      `o documento declara \`lang=${JSON.stringify(langDeclarado)}\` e tem de declarar ` +
        `${JSON.stringify(esperadaNoHtml)}, a etiqueta desta edição.\n` +
        `      Um leitor de ecrã lê um documento sem língua com a fonética da página anterior, e ` +
        `um rastreador não sabe em que língua o indexar. Ver src/lib/documentos.mjs, ` +
        `\`comMarcasDaCasa()\`.`,
    );
  }

  /* 7 — A MARCA DOS ROBÔS, E DENTRO DA CABEÇA. Uma só, porque duas marcas
     `robots` numa página são ambíguas para um rastreador; e dentro do `<head>`,
     porque uma marca no corpo não é uma directiva: o rastreador lê-a como
     texto. A primeira forma contava-as em qualquer sítio do documento, o que
     deixava passar exactamente esse caso. Pergunta-se por POSIÇÃO no ficheiro e
     não à árvore do analisador, que é o que o rastreador faz. */
  const robos = [...html.matchAll(/<meta\b[^>]*\bname\s*=\s*["']?robots["']?[^>]*>/gi)];
  if (robos.length !== 1) {
    err(
      `o documento tem ${robos.length} marca(s) \`<meta name="robots">\`; tem de ter exactamente uma.\n` +
        `      Esperava-se ${JSON.stringify(MARCA_DOS_ROBOS)} no \`<head>\`.`,
    );
  } else {
    if (robos[0][0] !== MARCA_DOS_ROBOS) {
      err(
        `a marca dos robôs é ${JSON.stringify(robos[0][0].slice(0, 120))} e tem de ser ` +
          `${JSON.stringify(MARCA_DOS_ROBOS)}, carácter a carácter.`,
      );
    }
    const cabeca = regiaoDaCabeca(html);
    if (!cabeca) {
      err('o documento construído não tem um `<head>` de verdade onde a marca dos robôs viva.');
    } else if (robos[0].index < cabeca.de || robos[0].index >= cabeca.ate) {
      err(
        `a marca dos robôs está fora do \`<head>\` (no símbolo ${robos[0].index}; a cabeça vai ` +
          `de ${cabeca.de} a ${cabeca.ate}).\n` +
          `      Uma marca \`robots\` no corpo não é uma directiva: o rastreador lê-a como texto.`,
      );
    }
  }

  /* 8 — O RÓTULO DE IA, com o texto aprovado. A mesma conferência que as outras
     páginas levam no rodapé (a comparação com `textoDoRotulo()`), aplicada aqui
     à faixa, porque nos documentos é na faixa que ele vive: o corpo é obra
     citada e não se lhe acrescenta nada. */
  const rotuloIA = faixa.querySelector('[data-oedp-rotulo-ia]');
  if (!rotuloIA) {
    err(
      `a faixa do observatório não traz o rótulo de IA.\n` +
        `      Esperava-se um \`<span data-oedp-rotulo-ia>\` com ` +
        `${JSON.stringify(textoDoRotulo(lang))}.\n` +
        `      O artigo 50.º, n.º 5 do Regulamento (UE) 2024/1689 quer a divulgação no momento da ` +
        `primeira exposição, e quem chega a um documento por um motor de busca nunca passa pelo ` +
        `rodapé de outra página.`,
    );
  } else {
    /* O ORÁCULO É `scripts/textos-aprovados.json`, E NÃO `politica-ia.mjs`
       (segunda passagem). A primeira forma comparava o rótulo do documento com
       `textoDoRotulo()`, que é o MESMO ficheiro que o rende: mudar a cópia
       mudava a saída e o oráculo ao mesmo tempo. É exactamente a falha que a
       leitura a frio de 01.09 já tinha provado no rótulo do rodapé, com uma
       planta que tirava o «the» de «under the house policy» e passava verde, e
       que este ramo repetiu no ramo dos documentos.

       E SEM NORMALIZAR NADA: nem entidades decodificadas, nem espaços
       colapsados, nem pontas aparadas. É a disciplina da comparação do rodapé,
       e a razão é a mesma: um espaço a mais no texto do diretor é uma diferença
       e não um detalhe de composição. */
    const dito = textoDe(rotuloIA, { semEstilo: true, separador: '' });
    const esperadoRotulo = TEXTOS_APROVADOS.rotulo[lang];
    if (dito !== esperadoRotulo) {
      err(
        `o rótulo de IA da faixa não diz o texto aprovado.\n` +
          `      esperado: ${JSON.stringify(esperadoRotulo)}\n` +
          `      dito:     ${JSON.stringify(dito)}`,
      );
    }

    const portaDaPolitica = `${routePath('metodo', lang)}#${TEXTOS_APROVADOS.ancora_da_politica}`;
    const aDaPolitica = rotuloIA.querySelector('a[href]');
    if (!aDaPolitica) {
      err(`o rótulo de IA da faixa não tem a porta para a política da casa.`);
    } else {
      if (decodeEntities(aDaPolitica.getAttribute('href') ?? '') !== portaDaPolitica) {
        err(
          `a porta da política abre "${aDaPolitica.getAttribute('href')}" e devia abrir ` +
            `"${portaDaPolitica}".`,
        );
      }
      const palavras = textoDe(aDaPolitica, { semEstilo: true, separador: '' });
      if (palavras !== TEXTOS_APROVADOS.porta[lang]) {
        err(
          `as palavras ligadas do rótulo de IA são ${JSON.stringify(palavras)} e têm de ser ` +
            `${JSON.stringify(TEXTOS_APROVADOS.porta[lang])}.`,
        );
      }
    }

    /* O NOME É PORTUGUÊS, e numa edição inglesa leva a sua marca de língua: a
       mesma regra da §1.82 que `check-lingua.mjs` aplica ao rodapé das outras
       páginas. Aqui é este portão que a aplica, porque um documento sai do
       varrimento geral antes de lá chegar. */
    const nomes = rotuloIA.querySelectorAll('[data-oedp-rotulo-nome]');
    if (nomes.length !== 1) {
      err(
        `o rótulo de IA da faixa tem ${nomes.length} nome(s) de quem responde; tem de ter um.`,
      );
    } else {
      const nome = nomes[0];
      const dizNome = textoDe(nome, { semEstilo: true, separador: '' });
      if (dizNome !== TEXTOS_APROVADOS.responsavel) {
        err(
          `o nome de quem responde diz ${JSON.stringify(dizNome)} e tem de dizer ` +
            `${JSON.stringify(TEXTOS_APROVADOS.responsavel)}.`,
        );
      }
      const marcaDoNome = nome.getAttribute('lang') ?? '';
      const esperadaNoNome = lang === 'pt' ? '' : TEXTOS_APROVADOS.lingua_do_responsavel;
      if (marcaDoNome !== esperadaNoNome) {
        err(
          `o nome de quem responde tem \`lang="${marcaDoNome}"\` e devia ter ` +
            `${esperadaNoNome ? `\`lang="${esperadaNoNome}"\`` : 'a língua da página, sem marca'}.\n` +
            `      Numa página inglesa um nome português sem marca é lido com fonética inglesa; ` +
            `numa portuguesa a marca a mais é o mesmo defeito ao contrário.`,
        );
      }
    }
  }

  /* As ligações da faixa entram na conferência das ligações internas, como as
     de qualquer página: uma porta para o Sobre que dê 404 é pior do que não a
     haver. As do corpo do documento não entram: são de obra citada. */
  for (const a of faixa.querySelectorAll('a[href]') ?? []) {
    const href = decodeEntities(a.getAttribute('href') ?? '');
    if (!eLigacaoInterna(href)) continue;
    ligacoesInternas.push({ rel, base: baseDeResolucao(rel, caminho), href });
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
 * A PÁGINA DE LEITURA — a nona origem, e as sete conferências L1 a L7.
 * ---------------------------------------------------------------------------
 *
 * `/estudos/<slug>/texto` é o documento de um estudo composto no gabarito da
 * casa a partir do REGISTO DE CONTEÚDO que o motor escreve, e de mais nada. Não
 * é uma composição da casa: é uma **transcrição de um documento fixado**, e a
 * §0.3 do plano da parte 3 mediu porquê — das 2 601 figuras das oito edições,
 * 2 405 não têm linha no livro-razão deste sítio (9 delas de linhas que o motor
 * excluiu da travessia, com a razão escrita no seu manifesto), e das 196 que
 * têm, 119 imprimem no documento uma cadeia diferente da que a linha guarda.
 *
 * Por isso cada algarismo entra pela NONA ORIGEM, `data-registo`, com a forma da
 * oitava: o portão compara o texto renderizado com o `printed` daquela figura,
 * carácter a carácter, e a marca **só vale nesta rota**. Não é uma dispensa — é
 * comparação, e a coisa contra a qual compara é um ficheiro fixado por resumo
 * que o D1 do `check:documentos` já conferiu.
 *
 * O QUE ESTE RAMO NÃO FAZ: não dispensa a página do resto do varrimento. A
 * página continua a ser varrida como qualquer outra (a porta para o Sobre, a
 * porta das correções, as ligações internas, os cartões, o `data-nonledger`); o
 * que muda é que o corpo transcrito tem a sua própria origem, conferida aqui.
 *
 * O PORTÃO TEM O SEU PRÓPRIO LEITOR do manifesto, do registo e do registo de
 * travessia das linhas: não importa `src/lib/registos.mjs`, `registo-html.mjs`
 * nem `cruzamento.mjs`, porque uma conferência que usasse o código das páginas
 * confirmava-se a si própria. Importa `src/lib/eyetext.mjs`, que é a LEITURA e
 * não o gabarito, e que é provada à parte contra os registos do motor
 * (`node scripts/provar-eyetext.mjs`).
 */

/**
 * `"<rh_study> <rh_id>" → <id da linha do sítio>`, lido do registo de travessia
 * das linhas com o leitor do portão. É por ele que uma figura do motor se liga a
 * uma linha deste livro-razão, e é o `row` escolhido que decide, nunca `others`.
 */
const LINHA_DO_SITIO = new Map();
{
  const dir = path.join(ROOT, 'ledger', 'cruzamentos');
  if (fs.existsSync(dir)) {
    for (const ficheiro of fs.readdirSync(dir).sort()) {
      if (!ficheiro.endsWith('.json')) continue;
      let doc;
      try {
        doc = JSON.parse(fs.readFileSync(path.join(dir, ficheiro), 'utf8'));
      } catch {
        continue;
      }
      for (const [siteId, linha] of Object.entries(doc?.rows ?? {})) {
        if (linha?.rh_study && linha?.rh_id) LINHA_DO_SITIO.set(`${linha.rh_study} ${linha.rh_id}`, siteId);
      }
    }
  }
}

/** As unidades de um bloco do registo, com a coordenada da sua marca. */
function unidadesDoRegisto(bloco) {
  if (bloco.kind === 'heading' || bloco.kind === 'paragraph') return [{ unidade: bloco, coordenada: '' }];
  if (bloco.kind === 'list') return (bloco.items ?? []).map((u, i) => ({ unidade: u, coordenada: `.${i}` }));
  if (bloco.kind === 'table') {
    const saida = [];
    (bloco.rows ?? []).forEach((linha, r) => {
      linha.forEach((celula, c) => saida.push({ unidade: celula, coordenada: `.${r}.${c}` }));
    });
    return saida;
  }
  return [];
}

/**
 * O passeio do portão dentro de uma unidade: os pedaços de texto pela ordem em
 * que o leitor os vê, e o intervalo de pedaços de cada elemento.
 *
 * Existe porque a comparação precisa de saber ONDE, no texto da unidade, está
 * cada elemento — e a leitura do olho devolve o texto, não a identidade dos
 * elementos. Salta `.src-chip` inteiro, que é a única extensão declarada da
 * leitura, e o texto que não é texto (`script`, `style`). O resultado é
 * conferido contra a leitura de `src/lib/eyetext.mjs` em cada unidade: se os
 * dois passeios divergirem, a conferência fecha em vez de acreditar neste.
 */
function pedacosDaUnidade(el) {
  const pedacos = [];
  const elementos = [];
  const anda = (n) => {
    if (!n) return;
    if (n.nodeType === NodeType.TEXT_NODE) {
      pedacos.push(n.text);
      return;
    }
    if (n.nodeType !== NodeType.ELEMENT_NODE) return;
    const tag = String(n.rawTagName ?? '').toLowerCase();
    const classes = String(n.getAttribute('class') ?? '').split(/\s+/);
    if (classes.includes('src-chip')) return;
    const inicio = pedacos.length;
    if (tag !== 'script' && tag !== 'style') for (const filho of n.childNodes ?? []) anda(filho);
    elementos.push({ el: n, tag, inicio, fim: pedacos.length });
  };
  for (const filho of el.childNodes ?? []) anda(filho);
  return { pedacos, elementos };
}

/** O nó de elemento seguinte, sem saltar por cima de texto: é a regra do colado. */
function irmaoColado(el) {
  const pai = el.parentNode;
  if (!pai) return { irmao: null, texto: null };
  const filhos = pai.childNodes ?? [];
  const i = filhos.indexOf(el);
  for (let k = i + 1; k < filhos.length; k++) {
    const n = filhos[k];
    if (n.nodeType === NodeType.TEXT_NODE) {
      if (n.rawText === '') continue;
      return { irmao: null, texto: n.rawText };
    }
    if (n.nodeType === NodeType.ELEMENT_NODE) return { irmao: n, texto: null };
  }
  return { irmao: null, texto: null };
}

/** As classes de um elemento, como lista. */
const classesDe = (n) => String(n?.getAttribute?.('class') ?? '').split(/\s+/);

const eSelo = (n) =>
  n && String(n.rawTagName ?? '').toLowerCase() === 'a' && classesDe(n).includes('src-chip');

/**
 * A porta que vai a seguir a uma ligação do documento: a saída de uma figura
 * que está dentro de uma ligação e por isso não pode ser ela própria a âncora.
 * Não tem texto (o glifo é da folha), e por isso é invisível à leitura do
 * olho e à comparação da unidade.
 */
const ePortaAposALigacao = (n) =>
  n &&
  String(n.rawTagName ?? '').toLowerCase() === 'a' &&
  classesDe(n).includes('texto-figura-porta-apos');

/**
 * Os elementos irmãos COLADOS a este, em ordem, e o primeiro nó de texto que os
 * interrompe. Uma ligação do documento pode ter várias figuras lá dentro, e as
 * suas saídas vêm todas a seguir a ela, na ordem das figuras: é esta corrida que
 * o L6 percorre para saber qual saída é de qual figura.
 */
function irmaosColados(el) {
  const pai = el?.parentNode;
  if (!pai) return { irmaos: [], texto: null };
  const filhos = pai.childNodes ?? [];
  const irmaos = [];
  for (let k = filhos.indexOf(el) + 1; k < filhos.length; k++) {
    const n = filhos[k];
    if (n.nodeType === NodeType.TEXT_NODE) {
      if (n.rawText === '') continue;
      return { irmaos, texto: n.rawText };
    }
    if (n.nodeType === NodeType.ELEMENT_NODE) irmaos.push(n);
  }
  return { irmaos, texto: null };
}

function verificaTexto({ rota, root, err }) {
  const { slug } = rota.params;
  const lang = rota.lang;
  const chave = `${slug}/${lang}`;

  if (!TRAVESSIA_DOS_REGISTOS) {
    err(
      `há uma página de leitura para "${chave}" e não consegui ler registos/manifest.json. ` +
        `Escreve-o o exportador do motor: python3 publisher/export_records_site.py --write.`,
    );
    return;
  }
  const entrada = TRAVESSIA_DOS_REGISTOS[chave];
  if (!entrada) {
    err(
      `L1 ${chave}: há uma página de leitura para uma edição que o registo de travessia não ` +
        `declara. Só existem páginas de leitura para as edições com registo de conteúdo.`,
    );
    return;
  }
  const registo = registoDoPortao(slug, lang);
  if (!registo) {
    err(`L1 ${chave}: o registo de travessia declara esta edição e não consegui ler o seu registo.`);
    return;
  }

  const artigos = root.querySelectorAll('[data-registo-edicao]');
  if (artigos.length !== 1) {
    err(
      `L1 ${chave}: a página tem ${artigos.length} elementos com data-registo-edicao, e tem de ` +
        `ter exatamente um: é o localizador do corpo transcrito.`,
    );
    return;
  }
  const artigo = artigos[0];
  const declarada = decodeEntities(artigo.getAttribute('data-registo-edicao') ?? '');
  if (declarada !== chave) {
    err(
      `L1: o corpo transcrito desta página declara data-registo-edicao="${declarada}" e a rota é ` +
        `de "${chave}".`,
    );
    return;
  }

  const linhaDoSitio = (row) => LINHA_DO_SITIO.get(`${entrada.rh_study} ${row}`) ?? null;

  /* ---------------------------------------------------------------- L1 ---
     A sequência de blocos: índice, género, nível, ordenação e contagens. */
  const blocosNaPagina = artigo.querySelectorAll('[data-registo-bloco]');
  if (blocosNaPagina.length !== registo.blocks.length) {
    err(
      `L1 ${chave}: a página rende ${blocosNaPagina.length} blocos e o registo tem ` +
        `${registo.blocks.length}.`,
    );
    return;
  }

  const TAG_DO_GENERO = { paragraph: 'p', rule: 'hr', table: 'table' };
  let figurasNaPagina = 0;
  const figurasPorLinha = new Map();

  for (let b = 0; b < registo.blocks.length; b++) {
    const bloco = registo.blocks[b];
    const el = blocosNaPagina[b];
    const marca = decodeEntities(el.getAttribute('data-registo-bloco') ?? '');
    const tag = String(el.rawTagName ?? '').toLowerCase();
    if (marca !== String(bloco.i)) {
      err(`L1 ${chave}: o bloco na posição ${b} declara data-registo-bloco="${marca}" e o registo diz "${bloco.i}".`);
      continue;
    }
    const esperada =
      bloco.kind === 'heading'
        ? `h${bloco.level}`
        : bloco.kind === 'list'
          ? bloco.ordered
            ? 'ol'
            : 'ul'
          : TAG_DO_GENERO[bloco.kind];
    if (tag !== esperada) {
      err(
        `L1 ${chave} bloco ${bloco.i}: rendido como <${tag}> e o registo diz "${bloco.kind}"` +
          `${bloco.kind === 'heading' ? ` de nível ${bloco.level}` : ''}, que se rende <${esperada}>.`,
      );
      continue;
    }

    /* As unidades da página, na ordem do documento, pela estrutura do género. */
    let unidadesNaPagina;
    if (bloco.kind === 'rule') unidadesNaPagina = [];
    else if (bloco.kind === 'heading' || bloco.kind === 'paragraph') unidadesNaPagina = [el];
    else if (bloco.kind === 'list') unidadesNaPagina = el.querySelectorAll('li');
    else {
      unidadesNaPagina = [];
      const linhasDaTabela = el.querySelectorAll('tr');
      if (linhasDaTabela.length !== (bloco.rows ?? []).length) {
        err(
          `L1 ${chave} bloco ${bloco.i}: a tabela rende ${linhasDaTabela.length} linhas e o ` +
            `registo tem ${(bloco.rows ?? []).length}.`,
        );
        continue;
      }
      let mau = false;
      linhasDaTabela.forEach((tr, r) => {
        const celulas = tr.querySelectorAll('td, th');
        if (celulas.length !== bloco.rows[r].length) {
          err(
            `L1 ${chave} bloco ${bloco.i} linha ${r}: a página rende ${celulas.length} células e o ` +
              `registo tem ${bloco.rows[r].length}.`,
          );
          mau = true;
          return;
        }
        for (const c of celulas) unidadesNaPagina.push(c);
      });
      if (mau) continue;
    }

    const unidadesDoBloco = unidadesDoRegisto(bloco);
    if (unidadesNaPagina.length !== unidadesDoBloco.length) {
      err(
        `L1 ${chave} bloco ${bloco.i}: a página rende ${unidadesNaPagina.length} unidades e o ` +
          `registo tem ${unidadesDoBloco.length}.`,
      );
      continue;
    }

    for (let u = 0; u < unidadesDoBloco.length; u++) {
      const { unidade, coordenada } = unidadesDoBloco[u];
      const alvo = unidadesNaPagina[u];
      const marcaDaUnidade = `${chave}#${bloco.i}${coordenada}`;
      const declaradaUnidade = decodeEntities(alvo.getAttribute('data-registo-unidade') ?? '');
      if (declaradaUnidade !== marcaDaUnidade) {
        err(
          `L2 ${chave}: a unidade do bloco ${bloco.i} na posição ${u} declara ` +
            `data-registo-unidade="${declaradaUnidade || '(nenhuma)'}" e devia declarar ` +
            `"${marcaDaUnidade}".`,
        );
        continue;
      }

      /* ------------------------------------------------------------ L7 ---
         `<th>` exatamente onde o registo tem `header: true`. */
      if (bloco.kind === 'table') {
        const eCabecalho = String(alvo.rawTagName ?? '').toLowerCase() === 'th';
        if (eCabecalho !== Boolean(unidade.header)) {
          err(
            `L7 ${marcaDaUnidade}: a célula é <${eCabecalho ? 'th' : 'td'}> e o registo diz ` +
              `header: ${Boolean(unidade.header)}.`,
          );
        }
      }

      /* ------------------------------------------------------------ L2 ---
         O texto pela leitura do olho, carácter a carácter. */
      let lidos;
      try {
        lidos = leBlocos(`<p>${alvo.innerHTML}</p>`);
      } catch (erro) {
        err(`L2 ${marcaDaUnidade}: a leitura do olho recusou esta unidade: ${erro.message}`);
        continue;
      }
      if (lidos.length !== 1 || lidos[0].kind !== 'paragraph') {
        err(
          `L2 ${marcaDaUnidade}: a unidade rende ${lidos.length} bloco(s) para a leitura do olho, ` +
            `e uma unidade é um bloco só. Um elemento de bloco dentro de uma unidade parte o texto.`,
        );
        continue;
      }
      const textoLido = new Texto(lidos[0].unidade).texto;
      const textoDoRegisto = String(unidade.text ?? '');
      /**
       * O TEXTO DIVERGENTE NÃO PÁRA A UNIDADE, e a razão vale a linha: trocar o
       * `printed` de uma figura pelo `value` da linha muda o texto da unidade
       * TAMBÉM, e uma conferência que parasse no L2 nunca chegava a dizer
       * porquê. O L2 fecha, e as conferências que não dependem das posições
       * continuam a correr; as que dependem (o L3 e a metade das coordenadas do
       * L4) ficam de fora, porque comparar posições contra outro texto seria
       * inventar uma segunda queixa a partir da primeira.
       */
      const textoDivergente = textoLido !== textoDoRegisto;
      if (textoDivergente) {
        err(
          `L2 ${marcaDaUnidade}: o texto rendido não é o do registo.\n` +
            `      no registo:  ${JSON.stringify(textoDoRegisto).slice(0, 170)}\n` +
            `      renderizado: ${JSON.stringify(textoLido).slice(0, 170)}`,
        );
      }

      /* O passeio do portão, e a guarda que o prende à leitura provada. */
      const { pedacos, elementos } = pedacosDaUnidade(alvo);
      const texto = new Texto({ pedacos, intervalos: [] });
      if (texto.texto !== textoLido) {
        err(
          `L2 ${marcaDaUnidade}: o passeio deste portão e a leitura do olho não dão o mesmo texto. ` +
            `Uma das duas leituras está errada, e a conferência pára aqui em vez de escolher.`,
        );
        continue;
      }
      const emTexto = (e) =>
        e.fim > e.inicio ? texto.intervaloDePedacos(e.inicio, e.fim) : [null, null];

      /* ------------------------------------------------- L3, L4, L6 ---
         Cada elemento dentro da unidade é uma de três coisas: uma figura, um
         intervalo de ênfase, ou uma ligação do documento. Mais nada nossa
         entra numa unidade: o único elemento com texto próprio permitido é o
         selo, e o passeio salta-o por regra declarada. */
      const enfaseRendida = [];
      const ligacoesRendidas = [];
      const figurasRendidas = [];
      const portasRendidas = [];
      for (const e of elementos) {
        /* A PORTA QUE VAI A SEGUIR A UMA LIGAÇÃO é a saída de uma figura, e não
           uma ligação do documento: não tem texto nenhum, e por isso não pode
           entrar na comparação dos intervalos do L3 (um intervalo vazio não
           existe no registo). É conferida no L6, figura a figura. */
        if (e.tag === 'a' && classesDe(e.el).includes('texto-figura-porta-apos')) {
          if (e.fim > e.inicio) {
            err(
              `L6 ${marcaDaUnidade}: a porta que vai a seguir a uma ligação do documento tem ` +
                `texto lá dentro, e não pode ter: o texto de uma unidade é o do documento, e o ` +
                `glifo desta porta é da folha de estilos.`,
            );
          }
          portasRendidas.push({ ...e, href: decodeEntities(e.el.getAttribute('href') ?? '') });
          continue;
        }
        const marcaDaFigura = decodeEntities(e.el.getAttribute('data-registo') ?? '');
        if (marcaDaFigura) {
          figurasRendidas.push({ ...e, marca: marcaDaFigura });
          continue;
        }
        if (e.tag === 'strong' || e.tag === 'em' || e.tag === 'code') {
          const [inicio, fim] = emTexto(e);
          enfaseRendida.push({ kind: e.tag, start: inicio, end: fim });
          continue;
        }
        if (e.tag === 'a') {
          const [inicio, fim] = emTexto(e);
          ligacoesRendidas.push({
            start: inicio,
            end: fim,
            href: decodeEntities(e.el.getAttribute('href') ?? ''),
          });
          continue;
        }
        err(
          `L2 ${marcaDaUnidade}: a unidade tem um <${e.tag}> que não é uma figura, nem uma ênfase, ` +
            `nem uma ligação do documento. Dentro de uma unidade só entra texto do registo e o selo.`,
        );
      }

      const emOrdem = (a, b) => a.start - b.start || a.end - b.end;
      const enfaseDoRegisto = (unidade.emphasis ?? []).map((x) => ({
        kind: x.kind,
        start: x.start,
        end: x.end,
      }));
      const ligacoesDoRegisto = (unidade.links ?? []).map((x) => ({
        start: x.start,
        end: x.end,
        href: x.href,
      }));
      const comoCadeia = (lista) => JSON.stringify(lista.slice().sort(emOrdem));
      if (!textoDivergente && comoCadeia(enfaseRendida) !== comoCadeia(enfaseDoRegisto)) {
        err(
          `L3 ${marcaDaUnidade}: os intervalos de ênfase rendidos não são os do registo.\n` +
            `      no registo:  ${comoCadeia(enfaseDoRegisto).slice(0, 200)}\n` +
            `      renderizado: ${comoCadeia(enfaseRendida).slice(0, 200)}`,
        );
      }
      if (!textoDivergente && comoCadeia(ligacoesRendidas) !== comoCadeia(ligacoesDoRegisto)) {
        err(
          `L3 ${marcaDaUnidade}: as ligações rendidas não são as do registo.\n` +
            `      no registo:  ${comoCadeia(ligacoesDoRegisto).slice(0, 220)}\n` +
            `      renderizado: ${comoCadeia(ligacoesRendidas).slice(0, 220)}`,
        );
      }

      /* ------------------------------------------------------------ L4 ---
         Cada figura tem a sua marca, o texto dentro dela é o `printed`, a
         marca resolve numa figura do registo, e as posições batem. */
      const figurasDoRegisto = unidade.figures ?? [];
      if (figurasRendidas.length !== figurasDoRegisto.length) {
        err(
          `L4 ${marcaDaUnidade}: a página rende ${figurasRendidas.length} figuras e o registo tem ` +
            `${figurasDoRegisto.length}.`,
        );
      }

      /* As figuras que cada ligação do documento contém, na ordem do documento.
         É por esta lista que o L6 sabe qual das saídas coladas à ligação é a
         desta figura: uma por figura, na ordem das figuras. */
      const figurasDaLigacao = new Map();
      for (const r of figurasRendidas) {
        let n = r.el.parentNode;
        r.ligacao = null;
        while (n && n !== alvo) {
          if (String(n.rawTagName ?? '').toLowerCase() === 'a' && !ePortaAposALigacao(n)) {
            r.ligacao = n;
            break;
          }
          n = n.parentNode;
        }
        if (!r.ligacao) continue;
        if (!figurasDaLigacao.has(r.ligacao)) figurasDaLigacao.set(r.ligacao, []);
        figurasDaLigacao.get(r.ligacao).push(r);
      }
      /** As portas desta unidade que já foram casadas com a sua figura. */
      const portasCasadas = new Set();

      for (const rendida of figurasRendidas) {
        figurasNaPagina++;
        const sufixo = rendida.marca.startsWith(`${marcaDaUnidade}.`)
          ? rendida.marca.slice(marcaDaUnidade.length + 1)
          : null;
        const f = sufixo !== null && /^\d+$/.test(sufixo) ? Number(sufixo) : -1;
        const figura = figurasDoRegisto[f];
        if (!figura) {
          err(
            `L4 ${marcaDaUnidade}: a marca data-registo="${rendida.marca}" não resolve numa figura ` +
              `desta unidade do registo.`,
          );
          continue;
        }
        const impresso = new Texto({
          pedacos: pedacosDaUnidade(rendida.el).pedacos,
          intervalos: [],
        }).texto;
        if (impresso !== figura.printed) {
          err(
            `L4 ${rendida.marca}: a figura imprime ${JSON.stringify(impresso)} e o registo diz que ` +
              `este documento imprime ${JSON.stringify(figura.printed)}` +
              (impresso === figura.value
                ? ` (imprimiu o "value" da linha, e não o "printed" do documento: a página de ` +
                  `leitura é o documento, não a composição da casa).`
                : '.'),
          );
        }
        const [inicio, fim] = emTexto(rendida);
        if (!textoDivergente && (inicio !== figura.start || fim !== figura.end)) {
          err(
            `L4 ${rendida.marca}: a figura cobre [${inicio}, ${fim}) no texto da unidade e o ` +
              `registo diz [${figura.start}, ${figura.end}).`,
          );
        }

        /* --------------------------------------------------------- L6 ---
           O selo é do livro-razão e de mais nada. Uma figura com linha do
           sítio leva o selo colado; uma sem linha leva a porta e nunca o selo.
        */
        const siteId = linhaDoSitio(figura.row);
        if (!figurasPorLinha.has(figura.row)) {
          figurasPorLinha.set(figura.row, {
            row: figura.row,
            valor: figura.value,
            impressos: [],
            origem: figura.source_sha256 ?? figura.source_digest_kind ?? null,
            siteId,
          });
        }
        const registoDaLinha = figurasPorLinha.get(figura.row);
        if (!registoDaLinha.impressos.includes(figura.printed)) {
          registoDaLinha.impressos.push(figura.printed);
        }

        /* A SAÍDA DESTA FIGURA, E ONDE ELA TEM DE ESTAR.
           Fora de uma ligação do documento, colada à própria figura. Dentro de
           uma ligação, a seguir à ligação e na ordem das figuras: a k-ésima
           saída colada à ligação é a da k-ésima figura que ela contém, selos e
           portas intercalados. */
        const dentroDeLigacao = rendida.ligacao;
        let irmao = null;
        let textoColado = null;
        if (dentroDeLigacao) {
          const k = (figurasDaLigacao.get(dentroDeLigacao) ?? []).indexOf(rendida);
          const { irmaos, texto } = irmaosColados(dentroDeLigacao);
          irmao = irmaos[k] ?? null;
          textoColado = irmao === null ? texto : null;
        } else {
          ({ irmao, texto: textoColado } = irmaoColado(rendida.el));
        }

        if (siteId) {
          const portas = LANGS.map((l) => routePath('linha', l, { slug: siteId }));
          if (!eSelo(irmao)) {
            err(
              `L6 ${rendida.marca}: a figura tem linha no livro-razão ("${siteId}") e não tem selo ` +
                `colado a seguir` +
                (textoColado !== null
                  ? `: entre a figura e o que vem a seguir há um nó de texto ${JSON.stringify(textoColado)}.`
                  : '.'),
            );
          } else {
            const porta = decodeEntities(irmao.getAttribute('href') ?? '');
            if (!portas.includes(porta)) {
              err(
                `L6 ${rendida.marca}: o selo ao lado desta figura abre "${porta}" e a linha desta ` +
                  `figura é "${siteId}".`,
              );
            }
          }
        } else {
          if (eSelo(irmao)) {
            err(
              `L6 ${rendida.marca}: a figura NÃO tem linha no livro-razão deste sítio e leva um ` +
                `selo ao lado. Um selo ao lado de um valor sem linha promete uma linha que não ` +
                `existe (IDENTIDADE.md §10).`,
            );
          }
          const eAncora = String(rendida.el.rawTagName ?? '').toLowerCase() === 'a';
          const destino = `#linha-${figura.row}`;
          if (dentroDeLigacao) {
            /* A PORTA VAI IMEDIATAMENTE DEPOIS DA LIGAÇÃO, e é a gémea da regra
               do selo: uma âncora não aninha noutra, a ligação do documento
               manda sobre o seu texto, e a IDENTIDADE.md §5.3 e §10 não abrem
               exceção: onde aparece um valor, aparece a porta. */
            if (!ePortaAposALigacao(irmao)) {
              err(
                `L6 ${rendida.marca}: a figura está dentro de uma ligação do documento e não tem ` +
                  `a porta a seguir à ligação` +
                  (textoColado !== null
                    ? `: depois da ligação vem o nó de texto ${JSON.stringify(textoColado)}.`
                    : '.') +
                  ` Uma âncora não aninha noutra, e por isso a porta desta figura vai imediatamente ` +
                  `depois da ligação, como o selo (IDENTIDADE.md §5.3 e §10).`,
              );
            } else {
              portasCasadas.add(irmao);
              const href = decodeEntities(irmao.getAttribute('href') ?? '');
              if (href !== destino) {
                err(
                  `L6 ${rendida.marca}: a porta que vai a seguir à ligação abre "${href}" e a ` +
                    `linha desta figura é "${figura.row}", cuja entrada é "${destino}".`,
                );
              }
            }
          } else if (eAncora) {
            const href = decodeEntities(rendida.el.getAttribute('href') ?? '');
            if (href !== destino) {
              err(`L6 ${rendida.marca}: a porta da figura abre "${href}" e devia abrir "${destino}".`);
            }
          } else {
            err(
              `L6 ${rendida.marca}: a figura não tem linha no livro-razão e não tem porta nenhuma. ` +
                `Sem selo e sem porta, o algarismo não tem para onde levar o leitor.`,
            );
          }
        }
      }

      /* O outro sentido: uma porta a seguir a uma ligação que não é a saída de
         figura nenhuma. Sem isto, uma porta a mais abria a entrada de uma linha
         que este sítio da página não cita. */
      for (const porta of portasRendidas) {
        if (portasCasadas.has(porta.el)) continue;
        err(
          `L6 ${marcaDaUnidade}: esta unidade tem uma porta a seguir a uma ligação do documento ` +
            `que abre "${porta.href}" e não é a saída de nenhuma das figuras dessa ligação.`,
        );
      }
    }
  }

  /* ------------------------------------------------------------------ L6 ---
     «As linhas deste documento»: uma entrada por linha citada, na ordem da
     primeira citação, e cada campo igual ao que as figuras dessa linha dizem. */
  const seccao = root.querySelector('#linhas-do-documento');
  if (!seccao) {
    err(`L6 ${chave}: a página não tem a secção "As linhas deste documento" (id="linhas-do-documento").`);
  } else {
    const entradas = seccao.querySelectorAll('[id^="linha-"]');
    const esperadas = [...figurasPorLinha.values()];
    if (entradas.length !== esperadas.length) {
      err(
        `L6 ${chave}: "As linhas deste documento" tem ${entradas.length} entradas e o documento ` +
          `cita ${esperadas.length} linhas do motor.`,
      );
    }
    const porId = new Map();
    for (const e of entradas) porId.set(decodeEntities(e.getAttribute('id') ?? ''), e);
    esperadas.forEach((linha, i) => {
      const entradaNaPagina = porId.get(`linha-${linha.row}`);
      if (!entradaNaPagina) {
        err(`L6 ${chave}: a linha do motor "${linha.row}" é citada e não tem entrada em "As linhas deste documento".`);
        return;
      }
      if (entradas[i] !== entradaNaPagina) {
        err(
          `L6 ${chave}: a entrada da linha "${linha.row}" está na posição ${entradas.indexOf(entradaNaPagina)} ` +
            `e a primeira citação desta linha é a ${i}. A ordem é a da primeira citação.`,
        );
      }
      const campos = {
        valor: linha.valor,
        impresso: linha.impressos.join(SEPARADOR_DO_REGISTO),
        origem: linha.origem,
      };
      for (const [campo, esperado] of Object.entries(campos)) {
        const marca = `${chave}@${linha.row}.${campo}`;
        const el = entradaNaPagina.querySelector(`[data-registo-linha="${marca}"]`);
        if (!el) {
          err(`L6 ${chave}: a entrada da linha "${linha.row}" não tem o campo data-registo-linha="${marca}".`);
          continue;
        }
        const rendido = textoTranscrito(el);
        if (rendido !== String(esperado)) {
          err(
            `L6 ${marca}: o campo rendido não é o do registo.\n` +
              `      no registo:  ${JSON.stringify(esperado).slice(0, 150)}\n` +
              `      renderizado: ${JSON.stringify(rendido).slice(0, 150)}`,
          );
        }
        if (campo === 'origem') {
          const eResumo = /^[0-9a-f]{64}$/.test(String(esperado));
          if (!eResumo && !MOTIVOS_DO_REGISTO.has(String(esperado))) {
            err(
              `L6 ${marca}: o resumo de origem não é 64 hexadecimais nem um dos cinco motivos da ` +
                `lista fechada do motor: "${esperado}".`,
            );
          }
        }
      }
      if (linha.siteId) {
        const portas = LANGS.map((l) => routePath('linha', l, { slug: linha.siteId }));
        const abre = (entradaNaPagina.querySelectorAll('a[href]') ?? []).some((a) =>
          portas.includes(decodeEntities(a.getAttribute('href') ?? '')),
        );
        if (!abre) {
          err(
            `L6 ${chave}: a linha "${linha.row}" também tem linha no livro-razão ("${linha.siteId}") ` +
              `e a sua entrada não abre essa porta.`,
          );
        }
      }
    });
  }

  /* ------------------------------------------------------------------ L8 ---
     «Nesta página»: o índice do documento (bloco B, item B4).

     O índice é uma TRANSCRIÇÃO dos títulos de nível 2 e 3 do registo, e por
     isso entra pela nona origem e é comparado aqui, como o corpo: mesma
     contagem, mesma ordem, mesmo texto carácter a carácter, e cada âncora a
     abrir o bloco que ela nomeia. Sem esta comparação, a marca seria uma
     dispensa: seis dos títulos das oito edições trazem um ano escrito, e os
     algarismos deles sairiam do varrimento sem nada por trás.

     OS DE NÍVEL 3 ENTRARAM A 03.09.2026 (bloco F1.9a). O índice do bloco B
     levava só os de nível 2, e as oito edições têm entre 2 e 20 títulos de
     nível 3 sem porta nenhuma. A comparação é a mesma e a ordem é a do
     documento: uma travessia da lista aninhada da página dá a mesma sequência
     que a lista dos blocos do registo.

     E A PÁGINA DECLARA QUANTAS SECÇÕES TEM, que é o denominador da indicação
     de progresso («n/N» ao lado de cada título de nível 2, composto pela folha
     de estilos). A contagem RECONTA-SE aqui, como as três da faixa: um número
     do próprio sítio não se escreve, verifica-se. */
  {
    const titulosDoRegisto = registo.blocks.filter(
      (b) => b.kind === 'heading' && (Number(b.level) === 2 || Number(b.level) === 3),
    );
    const deNivel2 = titulosDoRegisto.filter((b) => Number(b.level) === 2).length;
    const corpos = root.querySelectorAll('[data-seccoes]');
    if (corpos.length !== 1) {
      err(
        `L8 ${chave}: a página tem ${corpos.length} elementos com data-seccoes, e tem de ter ` +
          `exatamente um: é o denominador da indicação de progresso.`,
      );
    } else {
      const declarado = decodeEntities(corpos[0].getAttribute('data-seccoes') ?? '');
      if (declarado !== String(deNivel2)) {
        err(
          `L8 ${chave}: a página declara data-seccoes="${declarado}" e o registo tem ` +
            `${deNivel2} títulos de nível 2.`,
        );
      }
    }
    const entradas = root.querySelectorAll('[data-registo-indice]');
    if (entradas.length !== titulosDoRegisto.length) {
      err(
        `L8 ${chave}: o índice «Nesta página» tem ${entradas.length} entradas e o registo tem ` +
          `${titulosDoRegisto.length} títulos de nível 2 e 3.`,
      );
    } else {
      titulosDoRegisto.forEach((bloco, i) => {
        const el = entradas[i];
        const marca = decodeEntities(el.getAttribute('data-registo-indice') ?? '');
        const esperada = `${chave}#${bloco.i}`;
        if (marca !== esperada) {
          err(
            `L8 ${chave}: a entrada ${i} do índice declara data-registo-indice="${marca}" e o ` +
              `título de nível ${bloco.level} nessa posição é o bloco ${bloco.i} ("${esperada}").`,
          );
          return;
        }
        const rendido = textoTranscrito(el);
        if (rendido !== String(bloco.text ?? '')) {
          err(
            `L8 ${esperada}: a entrada do índice não é o título do registo.
` +
              `      no registo:  ${JSON.stringify(String(bloco.text ?? '')).slice(0, 150)}
` +
              `      renderizado: ${JSON.stringify(rendido).slice(0, 150)}`,
          );
        }
        const href = decodeEntities(el.getAttribute('href') ?? '');
        if (href !== `#bloco-${bloco.i}`) {
          err(
            `L8 ${esperada}: a entrada do índice abre "${href}" e o bloco que ela nomeia é ` +
              `"#bloco-${bloco.i}".`,
          );
        }
        const destino = artigo.querySelector(`#bloco-${bloco.i}`);
        if (!destino) {
          err(
            `L8 ${esperada}: o índice abre "#bloco-${bloco.i}" e não há nenhum bloco com esse id ` +
              `dentro do corpo transcrito.`,
          );
        } else if (decodeEntities(destino.getAttribute('data-registo-bloco') ?? '') !== String(bloco.i)) {
          err(
            `L8 ${esperada}: o elemento com id="#bloco-${bloco.i}" não é o bloco ${bloco.i} do ` +
              `registo.`,
          );
        }
      });
    }

    /* A POSIÇÃO DE CADA SECÇÃO, TAMBÉM PARA QUEM NÃO VÊ (F1.9a, segunda
       passagem, 03.09.2026; Major 8 da leitura a frio do Codex). A frase
       «Secção n de N» vive num irmão do título («data-registo-posicao»,
       FORA do `<h2>`) e o título aponta para ela com `aria-labelledby`, ao
       lado de si próprio: é assim que o nome acessível passa a incluir a
       posição sem o corpo transcrito ganhar um carácter. As três coisas
       reconferem-se aqui, como a de cima: a contagem, o texto (contra o
       modelo do inventário da voz, na língua da página) e a referência. */
    {
      const titulosNivel2 = titulosDoRegisto.filter((b) => Number(b.level) === 2);
      const modeloPosicao = t(lang).estudos.textoPosicaoSeccaoModelo;
      const posicoes = artigo.querySelectorAll('[data-registo-posicao]');
      if (posicoes.length !== titulosNivel2.length) {
        err(
          `L8 ${chave}: o corpo tem ${posicoes.length} elemento(s) data-registo-posicao e o ` +
            `registo tem ${titulosNivel2.length} títulos de nível 2.`,
        );
      } else {
        titulosNivel2.forEach((bloco, i) => {
          const el = posicoes[i];
          const esperada = `${chave}#${bloco.i}`;
          const marca = decodeEntities(el.getAttribute('data-registo-posicao') ?? '');
          if (marca !== esperada) {
            err(
              `L8 ${esperada}: a posição na entrada ${i} declara data-registo-posicao="${marca}" ` +
                `e devia declarar "${esperada}".`,
            );
            return;
          }
          const esperadoTexto = modeloPosicao
            .replace('{n}', String(i + 1))
            .replace('{total}', String(titulosNivel2.length));
          const lido = textoTranscrito(el);
          if (lido !== esperadoTexto) {
            err(
              `L8 ${esperada}: a posição escreve "${lido}" e o modelo do inventário («${modeloPosicao}») ` +
                `com n=${i + 1} e total=${titulosNivel2.length} dá "${esperadoTexto}".`,
            );
          }
          const idPosicao = decodeEntities(el.getAttribute('id') ?? '');
          const idEsperado = `posicao-bloco-${bloco.i}`;
          if (idPosicao !== idEsperado) {
            err(
              `L8 ${esperada}: a posição tem id="${idPosicao}" e devia ter id="${idEsperado}", que ` +
                `é o id que o título tem de referir em aria-labelledby.`,
            );
            return;
          }
          const titulo = artigo.querySelector(`#bloco-${bloco.i}`);
          if (!titulo) return; // já reportado acima, na comparação do índice
          const aria = decodeEntities(titulo.getAttribute('aria-labelledby') ?? '');
          const ariaEsperado = `${idEsperado} bloco-${bloco.i}`;
          if (aria !== ariaEsperado) {
            err(
              `L8 ${esperada}: o título "bloco-${bloco.i}" declara aria-labelledby="${aria}" e ` +
                `devia declarar "${ariaEsperado}" — é essa referência que dá ao título um nome ` +
                `acessível com a posição lá dentro, sem lhe mudar um carácter do texto.`,
            );
          }
        });
      }
    }
  }

  /* ------------------------------------------------------------------ L5 ---
     As contagens: as do manifesto, e as três da faixa, recontadas aqui, cada
     uma com a porta do corpo. */
  if (figurasNaPagina !== entrada.referencias) {
    err(
      `L5 ${chave}: a página rende ${figurasNaPagina} figuras e o registo de travessia promete ` +
        `${entrada.referencias} referências.`,
    );
  }
  if (registo.blocks.length !== entrada.blocos) {
    err(
      `L5 ${chave}: o registo tem ${registo.blocks.length} blocos e o registo de travessia promete ` +
        `${entrada.blocos}.`,
    );
  }
  /* A recontagem do portão, do registo em disco e do registo de travessia das
     linhas. `com_linha_do_sitio` conta FIGURAS e não linhas do motor: é o que a
     faixa diz e é o que o leitor conta ao ver os selos na página. */
  const contasDoTexto = { blocos: registo.blocks.length, algarismos: 0, com_linha_do_sitio: 0 };
  for (const bloco of registo.blocks) {
    for (const { unidade } of unidadesDoRegisto(bloco)) {
      for (const figura of unidade.figures ?? []) {
        contasDoTexto.algarismos++;
        if (linhaDoSitio(figura.row)) contasDoTexto.com_linha_do_sitio++;
      }
    }
  }
  const naFaixa = root.querySelectorAll('[data-registo-conta]');
  if (naFaixa.length !== 3) {
    err(
      `L5 ${chave}: a página tem ${naFaixa.length} marcas data-registo-conta e a faixa tem três ` +
        `contagens: blocos, algarismos e com linha do livro-razão.`,
    );
  }
  /* A porta das três contagens é a mesma e é o corpo: `#documento`, o
     `<article>` desta página, onde cada bloco, cada figura marcada e cada selo
     estão à vista, uma marca por ocorrência. Conferida aqui na própria página,
     porque uma porta que não resolve não é porta nenhuma. */
  const portaDoCorpo = '#documento';
  if (!root.querySelector(portaDoCorpo)) {
    err(
      `L5 ${chave}: a página não tem o corpo com id="documento", que é a porta das três contagens ` +
        `da faixa.`,
    );
  }
  const vistas = new Set();
  for (const el of naFaixa) {
    const declaradaConta = decodeEntities(el.getAttribute('data-registo-conta') ?? '');
    const igual = declaradaConta.indexOf('=');
    const daEdicao = igual > 0 ? declaradaConta.slice(0, igual) : '';
    const nome = igual > 0 ? declaradaConta.slice(igual + 1) : '';
    if (daEdicao !== chave) {
      err(`L5: data-registo-conta="${declaradaConta}" não é desta edição, que é "${chave}".`);
      continue;
    }
    if (!(nome in contasDoTexto)) {
      err(
        `L5 ${chave}: data-registo-conta="${declaradaConta}" não é uma das três contagens ` +
          `(${Object.keys(contasDoTexto).join(', ')}).`,
      );
      continue;
    }
    vistas.add(nome);
    const rendido = textoTranscrito(el);
    if (rendido !== String(contasDoTexto[nome])) {
      err(
        `L5 ${declaradaConta}: a faixa diz "${rendido}" e o portão reconta ${contasDoTexto[nome]} ` +
          `do registo em disco. Uma contagem escrita à mão fica errada na construção seguinte.`,
      );
    }
    const porta = decodeEntities(el.getAttribute('href') ?? '');
    if (String(el.rawTagName ?? '').toLowerCase() !== 'a' || porta === '') {
      err(
        `L5 ${declaradaConta}: a contagem não tem porta. Um número do próprio sítio leva sempre a ` +
          `porta para onde se vê o que ele conta (IDENTIDADE.md §10).`,
      );
    } else if (porta !== portaDoCorpo) {
      err(
        `L5 ${declaradaConta}: a porta da contagem abre "${porta}" e tem de abrir ` +
          `"${portaDoCorpo}". As três contam OCORRÊNCIAS no corpo (blocos, figuras marcadas e ` +
          `selos), e é no corpo que elas se veem, uma marca por cada; "#linhas-do-documento" ` +
          `agrega numa entrada por linha do motor DISTINTA e por isso não mostra o que o número ` +
          `conta (IDENTIDADE.md §10).`,
      );
    }
  }
  for (const nome of Object.keys(contasDoTexto)) {
    if (!vistas.has(nome)) err(`L5 ${chave}: a faixa não rende a contagem "${nome}".`);
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
  /**
   * A data que o publicador carimba no que serve (01.09.2026, o corredor).
   *
   * A terceira das três datas do recibo. Confere-se como qualquer outro campo,
   * carácter a carácter contra o livro-razão: a página mostra a data que a
   * linha guarda, e o portão prova que é essa. O validador do livro-razão
   * garante a forma (AAAA-MM-DD, nunca no futuro, nunca antes do período que o
   * número mede); este garante a transcrição.
   */
  'published_at',
  /**
   * O rótulo com que a fonte publica a figura, e onde no ficheiro alojado ele
   * foi lido (29.08.2026).
   *
   * Confere-se como qualquer outro campo — carácter a carácter contra o
   * livro-razão — e é o que torna o campo publicável: a página mostra o nome
   * que a fonte imprime, e o portão prova que é esse e não outro. Não está em
   * `CAMPOS_DA_LINHA_POR_LINGUA`, e é de propósito: um rótulo está na língua da
   * FONTE e é o mesmo nas duas edições. O que muda com a edição é a marca de
   * língua que o embrulha, e essa é de `scripts/check-lingua.mjs`.
   */
  'name',
  'name_source',
  'document.title',
  'document.edition',
  'document.locator',
  /**
   * A página do documento onde está a frase que o excerto transcreve.
   *
   * Desde 18.08.2026 é um campo do livro-razão e é a ÚNICA origem da página: o
   * fragmento `#page=N` do endereço deriva dela, e o validador obriga as duas a
   * bater. A porta da prova escreve-a; esta conferência compara o número
   * renderizado com o campo, como compara qualquer outro.
   */
  'document.page',
  /**
   * A página de onde o recorte foi tirado.
   *
   * É um campo próprio e não uma segunda escrita de `document.page`: o
   * validador obriga os dois a bater, e a legenda do recorte diz o que o
   * recorte É, não o que o endereço abre. Quem trocar a legenda de um recorte
   * pela página de outra linha pára aqui.
   */
  'document.crop.page',
  /**
   * O ficheiro de dados que o sítio aloja, e de que a linha é contada (T3).
   *
   * Cinco campos escritos: o ficheiro, o seu tamanho, o resumo curto dos seus
   * bytes, a licença e a atribuição. O resumo curto é uma leitura do campo
   * `sha256` feita aqui com a **cópia local** da regra do encurtamento, como
   * `source_url.page` é do `#page=`: se o portão lesse o número de caracteres do
   * gabarito, confirmava o gabarito.
   */
  'document.hosted.asset',
  'document.hosted.bytes',
  'document.hosted.sha256.curto',
  'document.hosted.licence',
  'document.hosted.attribution',
  /**
   * A conta que foi feita sobre ficheiros que este sítio NÃO aloja (T3): a
   * coluna somada e o filtro aplicado. Os ficheiros em si vão na lista, com o
   * índice, como as reconferências e as origens de um extrato alojado.
   */
  'document.computed_over.column',
  'document.computed_over.filter',
  /**
   * A página humana de uma série: a porta principal, antes do pedido exato.
   * Como o `source_url`, o seu destino é seguido sem ser lido, e por isso o
   * `href` da âncora que a embrulha é conferido contra o campo.
   */
  'document.url',
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
 * `verifications.<n>.<campo>`: um campo de uma reconferência da linha.
 *
 * Não é um nome fixo: o índice é a posição da entrada na lista do livro-razão,
 * e a página marca-a com esse índice de propósito, para que o portão vá buscar
 * a entrada à posição que ela diz ser e não à ordem em que foi rendida. Os dois
 * campos escritos são a data e, numa entrada `diverge`, o valor encontrado.
 */
const CAMPO_DE_VERIFICACAO = /^verifications\.(\d+)\.(date|found)$/;

/**
 * `document.hosted.extracted_from.<n>.<campo>`: o ficheiro da fonte de onde o
 * extrato alojado saiu, e o resumo dos bytes desse ficheiro.
 *
 * O índice é a posição na lista da linha, como o das reconferências: a página
 * escreve-o, e o portão vai buscar a entrada a essa posição. Um extrato pode
 * sair de mais do que um ficheiro (a soma das três regiões, se um dia for
 * alojada), e por isso é uma lista e não um mapa.
 */
const CAMPO_DE_ALOJAMENTO =
  /^document\.hosted\.extracted_from\.(\d+)\.(file|sha256\.curto)$/;

/**
 * `document.computed_over.files.<n>.<campo>`: um dos ficheiros sobre que a soma
 * foi feita, o dia do instantâneo em que foi lido, e o resumo curto dos seus
 * bytes. Mesma regra do índice, e mesma cópia local do encurtamento.
 */
const CAMPO_DO_CALCULO =
  /^document\.computed_over\.files\.(\d+)\.(file|snapshot_date|sha256\.curto)$/;

/**
 * Quantos hexadecimais do resumo a página escreve. CÓPIA PRÓPRIA da constante
 * do gabarito, pela mesma razão que o separador de `attributed_to`: se as duas
 * divergirem, a construção pára, que é o que se quer.
 */
const RESUMO_CURTO_GATE = 12;

/**
 * Os rótulos de `by` e de `result`, nas duas edições.
 *
 * SEGUNDA CÓPIA da tabela de `src/i18n/strings.mjs`, e é de propósito: a mesma
 * disciplina de `ROTULO_DO_ESTADO` e de `SEPARADOR_ATRIBUICAO`. Se o portão
 * lesse os rótulos do gabarito, confirmava o gabarito; assim confirma o
 * livro-razão. Trocar «o mesmo valor» por «valor diferente:» no gabarito pára a
 * construção.
 */
const ROTULO_DE_QUEM_RELEU = {
  pt: {
    'leitura-independente': 'leitura independente',
    'painel-semanal': 'reconferência semanal do painel',
    'revisao-cruzada': 'revisão cruzada',
    /* O corredor diário confere o FICHEIRO da fonte, não o valor: o rótulo
       di-lo, para que uma reconferência dele não se leia como uma releitura do
       número. Ver AUTORES_DA_VERIFICACAO em src/lib/ledger.mjs. Esta tabela é a
       cópia do portão: se ele lesse a do gabarito, confirmava o gabarito. */
    'corredor-diario': 'conferência diária do ficheiro da fonte',
  },
  en: {
    'leitura-independente': 'independent reading',
    'painel-semanal': 'weekly panel re-check',
    'revisao-cruzada': 'cross-family review',
    'corredor-diario': 'daily check of the source file',
  },
};

const ROTULO_DO_RESULTADO = {
  pt: {
    igual: 'o mesmo valor',
    diverge: 'valor diferente:',
    inacessivel: 'fonte inacessível nesse dia',
  },
  en: {
    igual: 'the same value',
    diverge: 'a different value:',
    inacessivel: 'source unreachable that day',
  },
};

/** Quantas entradas a página mostra. Cópia própria, pela mesma razão. */
const VERIFICACOES_MOSTRADAS_GATE = 2;

/**
 * As entradas de uma linha, da mais nova para a mais velha, com o seu índice.
 *
 * Segunda implementação da ordenação que o gabarito faz, escrita aqui: o que
 * fica conferido é que o conjunto rendido são mesmo as mais recentes, e não que
 * duas funções concordam uma com a outra.
 */
function verificacoesOrdenadasGate(claim) {
  const lista = Array.isArray(claim?.verifications) ? claim.verifications : [];
  return lista
    .map((v, n) => ({ v, n }))
    .sort((a, b) => String(b.v.date).localeCompare(String(a.v.date)) || b.n - a.n);
}

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

/**
 * Os campos cuja versão depende da língua da edição.
 *
 * `unit` entrou a 29.08.2026 com a I92. A unidade de uma linha é um RÓTULO e
 * não uma citação: onde há um facto de dicionário a edição inglesa escreve-o em
 * inglês (`src/i18n/unidades.mjs`), e onde não há escreve a cadeia do
 * livro-razão com `lang="pt-PT"`. O portão continua a conferir carácter a
 * carácter — o que muda é o que ele espera, que passa a depender da edição,
 * como já dependia na `derivation` e na nota de bandeira.
 */
const CAMPOS_DA_LINHA_POR_LINGUA = new Set(['derivation', 'source_flag_note', 'unit']);

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
    case 'document.page':
      /* Inteiro no livro-razão, texto na página: comparam-se como texto, que é
         o que o leitor vê. */
      return claim.document?.page ?? null;
    case 'document.crop.page':
      return claim.document?.crop?.page ?? null;
    case 'document.hosted.asset':
      return claim.document?.hosted?.asset ?? null;
    case 'document.hosted.bytes':
      return claim.document?.hosted?.bytes ?? null;
    case 'document.hosted.licence':
      return claim.document?.hosted?.licence ?? null;
    case 'document.hosted.attribution':
      return claim.document?.hosted?.attribution ?? null;
    case 'document.url':
      return claim.document?.url ?? null;
    case 'document.computed_over.column':
      return claim.document?.computed_over?.column ?? null;
    case 'document.computed_over.filter':
      return claim.document?.computed_over?.filter ?? null;
    case 'document.hosted.sha256.curto': {
      /* A cópia local da regra do encurtamento; ver RESUMO_CURTO_GATE. */
      const h = claim.document?.hosted?.sha256;
      return typeof h === 'string' ? h.slice(0, RESUMO_CURTO_GATE) : null;
    }
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
    case 'unit':
      /* A MESMA FUNÇÃO QUE O GABARITO CHAMA, e é a mesma escolha que a
         `derivation` já fazia: o que se confere aqui é a TRANSCRIÇÃO da unidade
         daquela linha naquela edição, e a tabela de tradução é prosa da casa,
         conferida contra o livro-razão por `scripts/check-lingua.mjs` — que é
         quem obriga toda a unidade do livro-razão a ter entrada ou marca. */
      return unidadeDaLinha(claim.unit, lang).texto;
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
    default: {
      const v = campo.match(CAMPO_DE_VERIFICACAO);
      if (v) {
        const entrada = (claim.verifications ?? [])[Number(v[1])];
        return entrada ? (entrada[v[2]] ?? null) : null;
      }
      const k = campo.match(CAMPO_DO_CALCULO);
      if (k) {
        const f = (claim.document?.computed_over?.files ?? [])[Number(k[1])];
        if (!f) return null;
        if (k[2] === 'sha256.curto') {
          return typeof f.sha256 === 'string' ? f.sha256.slice(0, RESUMO_CURTO_GATE) : null;
        }
        return f[k[2]] ?? null;
      }
      const a = campo.match(CAMPO_DE_ALOJAMENTO);
      if (a) {
        const origem = (claim.document?.hosted?.extracted_from ?? [])[Number(a[1])];
        if (!origem) return null;
        if (a[2] === 'file') return origem.file ?? null;
        return typeof origem.sha256 === 'string'
          ? origem.sha256.slice(0, RESUMO_CURTO_GATE)
          : null;
      }
      return claim[campo] ?? null;
    }
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
 * OS VALORES DO LIVRO-RAZÃO, PARA OS RECONHECER EM PROSA
 * ---------------------------------------------------------------------------
 *
 * A chave é `digitsOf(value)`, a MESMA normalização com que a origem 1 confere
 * um `data-claim`. Assim «17,6» na prosa e «17,6» na linha são a mesma coisa
 * para esta conferência, tal como já eram para aquela.
 */
const VALORES_DO_LIVRO = new Map();
for (const [id, c] of claims) {
  const d = digitsOf(c.value);
  if (!d) continue;
  if (!VALORES_DO_LIVRO.has(d)) VALORES_DO_LIVRO.set(d, id);
}

const ISO_NA_PROSA = /\d{4}-\d{2}-\d{2}/g;
const TEM_LETRA = /[A-Za-zÀ-ÖØ-öø-ÿ]/;
const ORDINAL = /[ºª]$/;

/**
 * Os campos dos dois registos que são TRANSCRIÇÃO de uma fonte, e por isso
 * saem desta conferência.
 *
 * Dois: `origem_da_data.excerto`, que é a frase da fonte que diz a data,
 * citada palavra por palavra, renderizada em `<blockquote>` e comparada
 * carácter a carácter contra o registo; e `limiar.origem.excerto`, a frase
 * do quadro institucional que publica o limiar, da mesma natureza e mostrada
 * ao lado do limiar desde 16.08.2026 (revisão cruzada 3, T09). Reescrever
 * qualquer uma para lhe tirar um algarismo seria reescrever a prova. O
 * limite fica registado em DECISIONS §1.41: um valor escondido dentro de um
 * excerto passa por aqui.
 */
const CAMPOS_TRANSCRITOS_DA_AGENDA = ['origem_da_data.excerto', 'limiar.origem.excerto'];

/**
 * O número que um símbolo da prosa carrega, ou `null` quando não carrega nenhum.
 *
 * A regra é a ORDEM DAS LETRAS, e é o que a primeira versão desta conferência
 * não olhava: qualquer letra no símbolo punha-o de fora, e «17,6pp» passava a
 * publicar um valor do livro-razão sem selo (revisão cruzada 2, #2). Um símbolo
 * que COMEÇA por algarismo e acaba numa unidade colada («9%», «17,6pp», «6,3%»)
 * é um número com a sua unidade; um símbolo que COMEÇA por letra é um código
 * («tipsgo10», «edat_lfse_14») e continua de fora, porque a sequência de
 * algarismos de um código não é uma medição.
 */
const UNIDADE_COLADA = /[%A-Za-zÀ-ÖØ-öø-ÿ]+$/;

/**
 * O ordinal inglês, que também começa por algarismo: «2nd quarter», «1st
 * series». É a mesma classe que `ORDINAL` já tira na edição portuguesa («2.º»),
 * escrita para a outra língua: quatro sufixos, sobre o símbolo inteiro. O preço
 * é o mesmo que aquela paga, e está registado em DECISIONS §1.42: um valor do
 * livro-razão que por acaso seja o número de um ordinal escapa aqui.
 */
const ORDINAL_EN = /^\d+(st|nd|rd|th)$/i;

function numeroDoSimbolo(token) {
  if (!/^\d/.test(token)) return null;
  if (ORDINAL_EN.test(token)) return null;
  const semUnidade = token.replace(UNIDADE_COLADA, '');
  if (!semUnidade || !/\d/.test(semUnidade)) return null;
  if (TEM_LETRA.test(semUnidade)) return null;
  return semUnidade;
}

/**
 * Os números da prosa que são, tal e qual, um valor do livro-razão.
 *
 * O que NÃO é apanhado, de propósito: uma data ISO (é uma data do registo, e a
 * marca `data-nonledger="data-da-agenda"` já a declara), um código de conjunto
 * de dados («tipsgo10», «edat_lfse_14», que começam por letra), um ordinal
 * («2.º», «1.ª»), e um número que não coincida com nenhum valor publicado. Ver
 * DECISIONS §1.41 e §1.42.
 */
function valoresDoLivroEmProsa(texto, chave, idsDaPagina) {
  if (CAMPOS_TRANSCRITOS_DA_AGENDA.some((c) => chave.endsWith(c))) return [];
  const achados = [];
  const limpo = String(texto).replace(ISO_NA_PROSA, ' ');
  const vistos = new Set();
  for (const bruto of limpo.split(/\s+/)) {
    if (!bruto || !/\d/.test(bruto)) continue;
    const token = limpaToken(bruto);
    if (!token || !/\d/.test(token)) continue;
    if (ORDINAL.test(token)) continue;
    const numero = numeroDoSimbolo(token);
    if (!numero) continue;
    const d = digitsOf(numero);
    /**
     * A COMPARAÇÃO É COM AS LINHAS QUE ESTA PÁGINA RENDE, E NÃO COM O LIVRO INTEIRO.
     *
     * A regra está escrita acima e é sobre a mesma página: «um valor que tem
     * linha e selo NOUTRO SÍTIO DA MESMA PÁGINA». Comparada com o livro-razão
     * inteiro, ela era mais larga do que a regra que serve, e com 2 552 linhas
     * deixou de distinguir coisa nenhuma: o espaço dos valores passou a cobrir
     * quase todos os inteiros pequenos, e a agenda fechou a construção doze
     * vezes por coincidência. As doze foram lidas uma a uma, e nenhuma era uma
     * medição sem selo: «9» é o limiar de preços da habitação que a Comissão
     * publica, com o seu excerto e o seu endereço, e é o prazo de pagamento de
     * Alijó; «222» é o número do documento SWD(2026) 222, e é o índice de dívida
     * de Salvaterra de Magos; «2022» é um ano numa lista de datas, e é o número
     * de empresas de Coruche; «76» é o artigo 76.º da lei, e é o desemprego
     * registado de Barrancos; «20» é um dia, e é o prazo de pagamento de Cascais.
     *
     * O que a regra existe para apanhar continua apanhado, e com a mesma força:
     * a agenda rende as linhas dos seus critérios com selo, e uma nota que
     * repita o valor de uma dessas linhas continua a fechar a construção. O que
     * deixa de fechar é a coincidência com uma linha que a página não mostra e
     * que o leitor não tem como confundir com aquele número.
     */
    const id = VALORES_DO_LIVRO.get(d);
    if (!id || vistos.has(d)) continue;
    if (idsDaPagina && !idsDaPagina.has(id)) continue;
    vistos.add(d);
    achados.push({ token, id });
  }
  return achados;
}

/**
 * Os campos que a página TEM de renderizar de um item, lidos do registo.
 *
 * Não é uma lista escrita à mão: sai do próprio item, campo a campo, e cresce
 * com ele. Os campos de cada critério e de cada entrada do histórico saíram
 * daqui para as duas funções abaixo, porque a exigência mudou de sítio: não
 * basta que a chave esteja NA PÁGINA, tem de estar DENTRO do critério ou da
 * entrada a que pertence. Esvaziar um critério e deixar a marca passava
 * (revisão cruzada 2, #5).
 */
function camposObrigatoriosDoItem(item) {
  const id = item.id;
  const chaves = [
    `${id}.titulo`,
    `${id}.estado`,
    `${id}.porque`,
    `${id}.proposto_em`,
    `${id}.entrada`,
    `${id}.ultima_alteracao`,
  ];
  if (item.pergunta) chaves.push(`${id}.pergunta`);
  if (item.registo_previo_estado) chaves.push(`${id}.registo_previo_em`);
  if (item.decidido_em) chaves.push(`${id}.decidido_em`);
  return chaves;
}

/** O que um critério tem de mostrar, dentro do seu próprio elemento. */
function camposDoCriterio(item, n, criterio) {
  const chaves = [];
  if (criterio?.quadro) chaves.push(`${item.id}.criterios[${n}].quadro`);
  if (criterio?.limiar) {
    chaves.push(`${item.id}.criterios[${n}].limiar.valor`);
    chaves.push(`${item.id}.criterios[${n}].limiar.unidade`);
  }
  if (criterio?.tipo === 'calendario_das_fontes' && criterio?.evento) {
    chaves.push(`evento:${criterio.evento}.titulo`);
  }
  if (criterio?.nota) chaves.push(`${item.id}.criterios[${n}].nota`);
  return chaves;
}

/** O que uma entrada do histórico tem de mostrar, dentro do seu elemento. */
function camposDaEntrada(item, n, entrada) {
  const chaves = [`${item.id}.historico[${n}].data`];
  if (entrada?.motivo) chaves.push(`${item.id}.historico[${n}].motivo`);
  return chaves;
}

/**
 * As frases da casa que dizem um ESTADO do registo, e que o registo não escreve.
 *
 * Terceira cópia da mesma disciplina de `ROTULO_DO_ESTADO`: se o portão lesse
 * estas frases do gabarito, confirmava o gabarito. Assim confirma o registo, e
 * trocar «iniciado» por «selado», ou «não foi lida» por «não publica data»,
 * fecha a construção.
 */
const ROTULO_DO_REGISTO_PREVIO = {
  pt: { iniciado: 'Registo prévio iniciado a', selado: 'Registo prévio selado a' },
  en: { iniciado: 'Pre-registration started on', selado: 'Pre-registration sealed on' },
};

const PREFIXO_DA_TRANSICAO = { pt: 'passa a', en: 'moves to' };

/**
 * E a frase da entrada que NÃO é uma transição: sai de um estado e chega ao
 * mesmo. Uma `alteracao` de mesmo estado regista uma decisão sem mover o item,
 * e escrita com a seta («Em curso → Em curso») anunciava uma mudança que não
 * houve. Cópia do portão, como as outras: se lesse a cadeia do gabarito,
 * confirmava o gabarito.
 *
 * A primeira redacção era «mantém-se em Em curso», e lia-se mal: o rótulo do
 * estado já é um nome, e a preposição punha duas coisas a concordar que não
 * concordam. «Estado mantido: Em curso» diz o mesmo e lê-se de uma vez.
 */
const PREFIXO_DE_MANUTENCAO = { pt: 'estado mantido:', en: 'state unchanged:' };

const MOTIVO_SEM_DATA_RENDIDO = {
  pt: { nao_publica: 'a fonte não publica data', nao_lida: 'a fonte não foi lida' },
  en: { nao_publica: 'the source publishes no date', nao_lida: 'the source was not read' },
};

/**
 * ---------------------------------------------------------------------------
 * O SELO EM CADA VALOR — a auditoria que era feita à mão.
 * ---------------------------------------------------------------------------
 *
 * `IDENTIDADE.md` §5.3, v2: «onde aparece um valor, aparece o selo. Sem exceção
 * de página.» A promessa estava escrita e não estava imposta: a 15.08.2026 a
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
  /* A LINHA DAQUELE ID, NA EDIÇÃO DA PÁGINA, E SÓ NELA (bloco «A grelha da
     voz», 26.08.2026). A folga existia por uma razão só: o bloco «a mesma frase
     na outra edição», nas páginas de leitura, era escrito na outra língua de
     propósito e o seu selo levava à linha na outra edição. Esse bloco saiu com a
     Emenda 15, e a folga saiu com ele: um selo que abra a linha na outra edição
     manda o leitor para fora da sua edição, e agora fecha a construção. */
  const alvos = [routePath('linha', lang, { slug: id })];
  const alvo = alvos[0];

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
 * AS RENDIÇÕES LEGÍTIMAS DA ETIQUETA DO SELO
 * ---------------------------------------------------------------------------
 *
 * Lidas dos dois componentes que põem a marca, e de mais lado nenhum:
 *
 *   src/components/Provenance.astro       «<selo> · [calculado · ]<trabalho>[<marcador>]»
 *   src/components/InstrumentoConvergencia.astro  «<trabalho>»
 *
 * O nome do trabalho vem de `studyLabel()`, que é o registo. Isto NÃO é o
 * portão a comparar `studyLabel` consigo próprio: o que se confere é que a
 * etiqueta é UMA das rendições que o registo permite, e não prosa qualquer.
 * O defeito que fecha é «texto arbitrário dentro da marca», não «título de
 * trabalho errado», que é trabalho do arquivo.
 *
 * A comparação ignora espaços: entre dois elementos vizinhos o gabarito pode
 * pôr um espaço ou nenhum, e isso é composição e não conteúdo.
 */
/**
 * O endereço de uma linha, ao contrário: da porta para o id e a edição.
 *
 * É isto que amarra a etiqueta À SUA afirmação. Comparar contra o conjunto de
 * todas as etiquetas legítimas provava que a etiqueta era UMA delas, e uma
 * etiqueta válida de outro trabalho passava: o selo de «6,3» podia dizer «Água
 * Não Faturada» (revisão cruzada 2, #6). O `href` do selo diz de que linha ele
 * é a porta, e `auditaSelo()` já obriga esse `href` a ser o da linha do valor
 * que está ao lado. Uma amarra fecha a outra: o selo abre a linha daquele
 * número, e a etiqueta é a daquela linha.
 */
const LINHA_POR_PORTA = new Map();
for (const [id] of claims) {
  for (const lang of LANGS) {
    LINHA_POR_PORTA.set(routePath('linha', lang, { slug: id }), { id, lang });
  }
}

/**
 * O SELO DAQUELA LINHA, peça a peça (v2, IDENTIDADE.md §5.4 e §5.5).
 *
 * O selo deixou de ser uma cadeia só. São três superfícies, e cada uma tem a
 * sua conferência, porque cada uma pode mentir de maneira diferente:
 *
 *   etiqueta: o que `data-selo-etiqueta` declara e o `title` mostra. É a
 *              etiqueta DAQUELA linha, e é aqui que a amarra da §1.42 passa a
 *              viver: comparava-se o texto visível, e o texto visível deixou
 *              de a levar;
 *   visivel:  o que um leitor com vista lê, a palavra da edição («fonte» /
 *              «source») e, quando falta um campo, o marcador. Mais nada:
 *              prosa dentro do selo é uma segunda porta a dizer outra coisa;
 *   inteiro:  tudo, com o texto oculto. Continua a ser comparado carácter a
 *              carácter porque `data-nonledger` dispensa este elemento do
 *              varrimento dos algarismos e do da ortografia, e uma dispensa
 *              sem comparação é um buraco (revisão cruzada, #8).
 */
function seloDaLinha(id, lang) {
  const claim = claims.get(id);
  if (!claim) return null;
  const s = t(lang);
  const trabalho = studyLabel(claim.study, lang);
  const calculado = eDerivada(claim) ? `${s.prov.calculado} · ` : '';
  /* Sem espaço antes do marcador: o gabarito põe-no no elemento a seguir e o
     DOM não traz espaço nenhum entre os dois, e é o DOM que o leitor vê. */
  const marcador = provenienciaIncompleta(claim) ? POR_VERIFICAR : '';
  const etiqueta = normalizeWhitespace(`${calculado}${trabalho}`);
  return {
    etiqueta,
    palavra: s.prov.selo,
    visivel: normalizeWhitespace(`${s.prov.selo}${marcador}`),
    inteiro: normalizeWhitespace(`${s.prov.selo} · ${etiqueta}${marcador}`),
  };
}

/**
 * As rendições legítimas para uma etiqueta que NÃO é a porta de uma linha: a
 * legenda de proveniência de um instrumento, que nomeia o trabalho e mais nada.
 * Sem `href` não há linha a que a amarrar, e o que resta é o conjunto finito.
 */
const PROVENIENCIAS_ACEITES = new Set();
{
  const ids = [...new Set([...claims.values()].map((c) => c.study).filter(Boolean))];
  for (const lang of LANGS) {
    for (const id of ids) PROVENIENCIAS_ACEITES.add(normalizeWhitespace(studyLabel(id, lang)));
  }
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
 *   'registos' segunda leitura dos ficheiros de `registos/`, com o leitor deste
 *              portão. A mesma força da vista `ledger`, sobre a outra pasta que
 *              atravessa do motor: apanha um erro de qualquer um dos dois lados
 *              e não apanha um registo errado, que é o que o D1 prende por
 *              resumo. Entrou a 24.08.2026 com as oito chaves `registos_*`
 *              (parte 3, P3): os resumos de origem de uma figura não existem no
 *              `dist/` — a página transcreve o documento, não a proveniência de
 *              cada linha do motor — e por isso não há segundo ponto de
 *              observação para eles. **Eram quatro chaves e são duas** desde a
 *              ronda de correções 1 do mesmo dia: com a porta a ir a seguir a
 *              uma ligação do documento, cada figura passou a ter no `dist/`
 *              uma saída que nomeia a sua linha do motor, e `registos_resolvidos`
 *              e `registos_por_resolver` passaram à vista `dist`.
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

  /* Todas as entradas de reconferência, numa lista só. */
  const releituras = [];
  for (const c of linhas) {
    for (const v of c.verifications ?? []) releituras.push(v);
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

  /**
   * OS REGISTOS DE CONTEÚDO, LIDOS OUTRA VEZ COM O LEITOR DESTE PORTÃO.
   *
   * DUAS das oito chaves `registos_*` não têm segundo ponto de observação: o
   * resumo de origem de uma figura não está no `dist/`: a página de leitura
   * transcreve o DOCUMENTO, e a proveniência de cada linha do motor vive no
   * registo. Estas duas são por isso uma segunda implementação sobre os mesmos
   * ficheiros, com a vista `registos`, que é a mesma disciplina (e a mesma
   * força) da vista `ledger`.
   *
   * **Eram quatro até 24.08.2026** (ronda de correções 1): a linha do motor que
   * resolve uma figura também não estava no `dist/` enquanto as 42 figuras
   * dentro de uma ligação do documento ficavam sem saída própria. Com a porta a
   * ir imediatamente depois da ligação, cada figura passou a ter no `dist/` uma
   * saída que nomeia a sua linha, e `registos_resolvidos` e
   * `registos_por_resolver` passaram a contar-se lá, em
   * `contaAsMarcasDoTexto()`.
   *
   * As outras seis contam-se no `dist/`.
   */
  const dosRegistos = { com_resumo: 0, sem_resumo: 0 };
  for (const chave of Object.keys(TRAVESSIA_DOS_REGISTOS ?? {})) {
    const corte = chave.lastIndexOf('/');
    const registo = registoDoPortao(chave.slice(0, corte), chave.slice(corte + 1));
    for (const bloco of registo?.blocks ?? []) {
      for (const { unidade } of unidadesDoRegisto(bloco)) {
        for (const figura of unidade.figures ?? []) {
          if (/^[0-9a-f]{64}$/.test(String(figura.source_sha256 ?? ''))) dosRegistos.com_resumo++;
          else if (MOTIVOS_DO_REGISTO.has(figura.source_digest_kind)) dosRegistos.sem_resumo++;
        }
      }
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

  /* AS LINHAS DOS CONCELHOS, contadas do lado do livro-razão, e os grupos da
     página do conjunto, contados do lado do `dist/`. São dois pontos de
     observação diferentes de propósito: uma linha que exista e não seja
     agrupada por nenhum concelho não aparece na segunda conta, e é isso que a
     comparação com `concelhos_no_livro` da prova apanha. */
  const linhasDosConcelhos = linhas.filter((c) => c.study === 'concelhos-2026');
  /* A CONTA MUDOU DE SÍTIO COM A FORMA (26.08.2026). Os grupos viviam todos na
     página do conjunto; com uma página de livro-razão por concelho, cada um leva
     o seu, e a marca só se rende onde há linhas. Conta-se quantas páginas de
     concelho a construção escreveu com um grupo dentro. */
  let gruposDeConcelho = null;
  const dirDosConcelhos = path.join(DIST, 'livro-razao', 'concelhos');
  if (fs.existsSync(dirDosConcelhos)) {
    gruposDeConcelho = 0;
    for (const entrada of fs.readdirSync(dirDosConcelhos, { withFileTypes: true })) {
      if (!entrada.isDirectory()) continue;
      const f = path.join(dirDosConcelhos, entrada.name, 'index.html');
      if (!fs.existsSync(f)) continue;
      if (/data-concelho-grupo=/.test(fs.readFileSync(f, 'utf8'))) gruposDeConcelho += 1;
    }
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

  /**
   * O PAINEL DA PRIMEIRA PÁGINA, CONTADO AQUI COM A REGRA ESCRITA AQUI.
   *
   * `src/lib/estado.mjs` classifica cada medida para a página; este bloco não o
   * chama. Importar a função punha a mesma regra dos dois lados da comparação e
   * o portão passava a confirmar `estadoDaMedida()` contra si própria — o
   * defeito que a §1.24 fechou no campo `study`. O que o portão partilha é a
   * lista das medidas e o livro-razão; a REGRA está escrita nestas nove linhas,
   * e um dia em que as duas discordem é um dia em que a construção fecha.
   *
   * A convenção é a mesma, e é dita para que a divergência seja de propósito e
   * não por descuido: `superior` é um teto e estar acima dele é estar fora;
   * `inferior` é um chão e estar abaixo dele é estar fora; **dois lados
   * declarados são uma banda, e estar dentro é estar entre eles**; a igualdade
   * conta como dentro; um limiar sem lado declarado não classifica nada.
   */
  /* A LEITURA DA DECLARAÇÃO É DO PORTÃO, e não a de `ladosDoLimiar()`. Uma
     banda de dois lados (o saldo da balança corrente, a taxa de câmbio efetiva
     real) declara `inferior` e `superior`; um teto declara `lado: 'superior'`;
     um chão, `lado: 'inferior'`. Importar a função que a casa usa punha a
     mesma leitura dos dois lados da conta, que é o defeito que a §1.24 fechou.
     Devolve `null` onde não há comparação possível, e um `null` não conta para
     nenhuma das duas contagens. */
  const doisLados = (limiar) => {
    if (!limiar) return null;
    const numero = (l) => (l ? parsePtNumber(`${l.sinal === '−' ? '−' : ''}${l.nl}`) : null);
    if (limiar.inferior || limiar.superior) {
      return { inf: numero(limiar.inferior), sup: numero(limiar.superior) };
    }
    const um = parsePtNumber(`${limiar.sinal ?? ''}${limiar.nl}`);
    if (limiar.lado === 'superior') return { inf: null, sup: um };
    if (limiar.lado === 'inferior') return { inf: um, sup: null };
    return null;
  };
  const estadoDaFigura = (figura) => {
    if (!figura.limiar) return 'sem';
    const v = parsePtNumber(claims.get(figura.claim)?.value);
    if (v === null) return null;
    const l = doisLados(figura.limiar);
    if (!l) return null;
    if (l.inf === null && l.sup === null) return null;
    if (l.sup !== null && v > l.sup) return 'fora';
    if (l.inf !== null && v < l.inf) return 'fora';
    return 'dentro';
  };

  return Object.fromEntries([
    conta('painel_total', FIGURAS_PDM.length, 'ledger'),
    conta('painel_com_limiar', FIGURAS_PDM.filter((f) => Boolean(f.limiar)).length, 'ledger'),
    conta('painel_fora_do_limiar', FIGURAS_PDM.filter((f) => estadoDaFigura(f) === 'fora').length, 'ledger'),
    conta(
      'painel_dentro_do_limiar',
      FIGURAS_PDM.filter((f) => estadoDaFigura(f) === 'dentro').length,
      'ledger',
    ),
    conta('painel_social_total', FIGURAS_SOCIAL.length, 'ledger'),
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
    /* O marcador não é um organismo, e a cópia própria do portão diz isso
       sozinha. `POR_VERIFICAR` vem do módulo do marcador (nunca se escreve o
       texto à mão, §1.40): o que o portão não partilha é a REGRA, e a regra
       está escrita aqui. Segunda leitura cruzada de 20.08.2026, achado 4. */
    conta(
      'fontes',
      new Set(linhas.map((c) => c.source).filter((f) => f && f !== POR_VERIFICAR)).size,
      'ledger',
    ),
    conta(
      'tipos_de_documento',
      linhas.filter((c) => typeof c.document?.kind === 'string' && c.document.kind !== '').length,
      'ledger',
    ),
    conta('linhas_cruzadas', cruzadas, 'ledger'),
    /* As linhas publicadas menos as que têm registo de travessia. A vista é a
       mais fraca das duas parcelas: a contagem das páginas é do `dist`, a do
       registo é uma segunda leitura dos mesmos ficheiros, e é essa que manda. */
    conta('linhas_anteriores_ao_tubo', paginasDeLinhaPt - cruzadas, 'ledger'),
    conta('estudos', (paginasPorRota.get('pt:estudo') ?? 0), 'dist'),
    conta('edicoes', EDITIONS.length, 'modulo'),
    conta('leituras', leiturasNoMapa, 'dist'),
    conta('municipios_com_pagina', (paginasPorRota.get('pt:municipio') ?? 0), 'dist'),
    conta('municipios_total', municipiosNoCsv, 'dist'),
    /* AS 30 CHAVES DO MAPA POR DISTRITOS (Emenda 20, 27.08.2026). A prova conta-as
       no artefacto que o motor atravessou (`mapa/`); o portão conta-as na lista
       da Carta que o sítio guarda em `caop-centroids.mjs`, que é o outro lado.
       Um concelho a menos num ficheiro de distrito, ou uma unidade a mais, dá
       dois números diferentes e a construção fecha. A vista é `modulo` porque
       nenhuma das duas é o `dist/`: são duas leituras de dois registos. */
    conta('mapa_unidades', DISTRITOS.length, 'modulo'),
    /* AS DUAS CHAVES DAS REGIÕES (Emenda 21, 27.08.2026). A prova conta-as na
       lista de dados e no livro-razão; o portão conta-as noutro sítio, que é o
       ponto todo: `regioes_total` na lista de dados menos a referência, e
       `regioes_com_linha` nas PÁGINAS construídas. Uma região sem linhas que
       ganhasse página, ou uma com linhas que a perdesse, dá dois números
       diferentes e a construção fecha. */
    conta('regioes_total', REGIOES.filter((r) => !r.referencia).length, 'modulo'),
    conta('regioes_com_linha', (paginasPorRota.get('pt:regiao') ?? 0), 'dist'),
    /* AS CHAVES DAS ÁREAS DE GOVERNO (decisão 6 de 25.08.2026). Uma por área
       declarada, contada nas PEÇAS QUE A PÁGINA RENDEU. Uma área declarada sem
       página construída conta zero, que é o que a prova também lhe dá quando não
       tem peças: as duas contas encontram-se no zero, e é aí que uma área
       declarada e nunca construída se vê. */
    ...AREAS.map((a) =>
      conta(CHAVE_DAS_PECAS(a.slug), pecasDeArea.get(`pt:${a.slug}`) ?? 0, 'dist'),
    ),
    ...DISTRITOS.map((nome, i) =>
      conta(
        `mapa_concelhos_${slugDeConcelho(nome)}`,
        MUNICIPIOS.filter((m) => m[1] === i).length,
        'modulo',
      ),
    ),
    /* AS TRÊS CHAVES DA PÁGINA DO CONJUNTO DOS CONCELHOS (decisão D6,
       26.08.2026). Duas contam-se no livro-razão que este portão leu por conta
       própria; a dos concelhos conta-se na página construída, que é o outro
       ponto de observação. */
    conta('concelhos_linhas', linhasDosConcelhos.length, 'ledger'),
    conta('concelhos_no_livro', gruposDeConcelho, 'dist'),
    conta(
      'concelhos_linhas_completas',
      linhasDosConcelhos.filter((c) => !provenienciaIncompleta(c)).length,
      'ledger',
    ),
    /* As reconferências, contadas aqui e não por prova(): é a segunda
       implementação sobre os mesmos ficheiros, como as correções. */
    conta('releituras_registadas', releituras.length, 'ledger'),
    conta(
      'linhas_reconferidas',
      linhas.filter((c) => (c.verifications ?? []).length > 0).length,
      'ledger',
    ),
    conta(
      'releituras_divergentes',
      releituras.filter((v) => v?.result === 'diverge').length,
      'ledger',
    ),
    conta('painel_reconferido_em', VERIFICACAO.verificadoEm, 'modulo'),
    conta('correcoes', porNatureza.correcao, 'ledger'),
    conta('atualizacoes', porNatureza.atualizacao, 'ledger'),
    conta('revisoes_de_proveniencia', porNatureza.proveniencia, 'ledger'),
    conta('endereco_correcoes', ENDERECO_CORRECOES, 'modulo'),
    /* AS OITO CHAVES DOS REGISTOS DE CONTEÚDO (parte 3, P3).
       Seis sobre o `dist/` construído e duas numa segunda leitura dos ficheiros
       de `registos/`. Nenhuma página as rende hoje: o que a comparação A
       confere é que as duas contas da mesma coisa dão o mesmo número, e a
       comparação B fica sem trabalho até haver um `data-prova` para elas. Ver
       `DECISIONS.md` §1.64, P3 e a ronda de correções 1. */
    conta('registos_edicoes', MARCAS_DO_TEXTO.paginas, 'dist'),
    conta('registos_blocos', MARCAS_DO_TEXTO.blocos, 'dist'),
    conta('registos_algarismos', MARCAS_DO_TEXTO.figuras, 'dist'),
    /* Uma figura resolvida é uma figura com uma saída que nomeia a sua linha do
       motor: o selo, que só existe onde há linha do sítio e, com ela, linha do
       motor; ou a porta, que abre a entrada dessa linha. Uma porta que abre
       `#linha-` e mais nada é a figura cuja linha do motor está vazia. */
    conta('registos_resolvidos', MARCAS_DO_TEXTO.selos + MARCAS_DO_TEXTO.portas, 'dist'),
    conta('registos_por_resolver', MARCAS_DO_TEXTO.portasSemLinha, 'dist'),
    conta('registos_com_linha_do_sitio', MARCAS_DO_TEXTO.selos, 'dist'),
    conta('registos_com_resumo_de_origem', dosRegistos.com_resumo, 'registos'),
    conta('registos_sem_resumo_de_origem', dosRegistos.sem_resumo, 'registos'),
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
function temPortaPara(no, destino, base = null) {
  for (const a of no?.querySelectorAll?.('a') ?? []) {
    const href = decodeEntities(a.getAttribute('href') ?? '');
    if (href === destino) return true;
    if (base && mesmaPorta(base, href, destino)) return true;
  }
  return false;
}

/**
 * ---------------------------------------------------------------------------
 * A PORTA DE UM `data-prova` PODE SER UMA ÂNCORA NA PRÓPRIA PÁGINA (v2)
 * ---------------------------------------------------------------------------
 *
 * `IDENTIDADE.md` §10, v2: «a porta pode ser uma âncora na própria página.
 * Quando o que o número conta se vê ali mesmo, o destino é a secção que o
 * mostra». O quadro de estados da agenda conta quatro coisas que se veem mais
 * abaixo na mesma página, e é para lá que cada contagem abre.
 *
 * DUAS COISAS MUDAM NESTA CONFERÊNCIA, e as duas são a mesma disciplina que a
 * conferência das ligações internas já tem:
 *
 *   1. a porta compara-se RESOLVIDA, e não carácter a carácter. `#estado-em_curso`
 *      escrito na página da agenda e `/agenda#estado-em_curso` escrito no
 *      cabeçalho de outra página são a mesma porta, e a comparação de cadeias
 *      dizia que não. É a base que resolve, como o navegador resolve;
 *   2. quando a porta traz âncora, essa âncora TEM DE EXISTIR no destino. Uma
 *      porta que aponta para uma secção que não existe leva o leitor ao topo de
 *      uma página e não dá erro nenhum: é a maneira mais silenciosa de uma porta
 *      não abrir, e aqui ela é ainda mais silenciosa do que numa ligação
 *      qualquer, porque quem a escreveu foi `src/lib/prova.mjs` e não o
 *      gabarito. A mensagem diz a chave, para que se saiba onde a corrigir.
 */
function portaResolvida(base, href) {
  const r = resolveLigacao(base, href);
  if (!r) return null;
  return `${normalizaCaminho(r.caminho)}${r.ancora ? `#${r.ancora}` : ''}`;
}

function mesmaPorta(base, href, destino) {
  const a = portaResolvida(base, href);
  const b = portaResolvida(base, destino);
  return a !== null && a === b;
}

/** As portas de `data-prova` com âncora, conferidas no fim contra os `id`. */
const ancorasDaProva = [];

/**
 * ---------------------------------------------------------------------------
 * AS LIGAÇÕES INTERNAS: RELATIVAS, E COM ÂNCORA
 * ---------------------------------------------------------------------------
 *
 * Um `href` é interno quando não traz esquema (`https:`, `mailto:`, `tel:`,
 * `data:`) nem começa por `//`. Tudo o resto é deste sítio, seja absoluto
 * (`/agenda`), relativo (`agenda`, `../sobre`) ou só âncora (`#calendario`).
 *
 * A base contra a qual um relativo se resolve é a que o navegador usa: uma
 * página servida de `<dir>/index.html` resolve contra `<dir>/`, e uma servida
 * de `<nome>.html` resolve contra o endereço dessa página. Sem esta distinção,
 * «agenda» numa página de directório apontava um nível acima do que aponta.
 */
function eLigacaoInterna(href) {
  if (!href) return false;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return false; // https:, mailto:, tel:, data:
  if (href.startsWith('//')) return false; // relativo ao protocolo: é para fora
  return true;
}

function baseDeResolucao(rel, caminho) {
  if (!rel.endsWith('index.html')) return caminho;
  return caminho.endsWith('/') ? caminho : `${caminho}/`;
}

/** O endereço absoluto e a âncora de uma ligação, resolvidos contra a base. */
function resolveLigacao(base, href) {
  try {
    const u = new URL(href, `https://ligacao.interna${base.startsWith('/') ? base : `/${base}`}`);
    return { caminho: decodeURIComponent(u.pathname), ancora: u.hash.replace(/^#/, '') };
  } catch {
    return null;
  }
}

/** A forma canónica de um endereço de página, para o comparar com `caminho`. */
function normalizaCaminho(p) {
  if (p === '/' || p === '') return '/';
  return p.replace(/\/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '') || '/';
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

/* ---------------------------------------------------------------- os cartões */

const DIR_DOS_CARTOES = path.join(DIST, PASTA_DOS_CARTOES);

/** Os registos dos cartões, lidos uma vez e guardados pelo nome do PNG. */
const REGISTOS_DOS_CARTOES = new Map();
if (fs.existsSync(DIR_DOS_CARTOES)) {
  for (const nome of fs.readdirSync(DIR_DOS_CARTOES)) {
    if (!nome.endsWith('.json')) continue;
    let registo;
    try {
      registo = JSON.parse(fs.readFileSync(path.join(DIR_DOS_CARTOES, nome), 'utf8'));
    } catch (e) {
      erros.push({ rel: `dist/${PASTA_DOS_CARTOES}/${nome}`, msg: `registo ilegível: ${e.message}` });
      continue;
    }
    REGISTOS_DOS_CARTOES.set(nome.replace(/\.json$/, '.png'), registo);
  }
}
const registoDoCartao = (nomePng) => REGISTOS_DOS_CARTOES.get(nomePng) ?? null;

/** Os cartões que alguma página nomeou. Um cartão que ninguém nomeia é um aviso. */
const cartoesUsados = new Set();

/**
 * ---------------------------------------------------------------------------
 * UMA PESSOA, UM NOME, E UM ORÁCULO (01.09.2026; alargado na segunda passagem)
 * ---------------------------------------------------------------------------
 * O rótulo de todas as páginas nomeia quem detém a responsabilidade editorial, e
 * a regra 9 do Método já nomeava quem dirige. São a mesma pessoa, e por isso têm
 * de ser a mesma cadeia: duas grafias do nome são duas pessoas para quem lê, e a
 * divulgação do artigo 50.º deixa de identificar ninguém.
 *
 * A CONFERÊNCIA É SOBRE OS FICHEIROS e não sobre as páginas, e corre uma vez. O
 * oráculo é `scripts/textos-aprovados.json`, e é contra ele que os dois textos
 * governados se medem: o nome tem de estar, carácter a carácter, num pedaço
 * `{ forte: … }` das dez regras de `src/data/metodo.mjs` E em
 * `src/data/politica-ia.mjs`. Sem o segundo braço, o oráculo e o ficheiro que
 * rende podiam divergir sem que nada o dissesse até alguém olhar para uma
 * página.
 *
 * E OS TEXTOS TAMBÉM SE MEDEM AQUI, não só na página: o rótulo composto de
 * `politica-ia.mjs` tem de ser o do oráculo, e a frase da política também. A
 * comparação da página apanha o mesmo defeito, e esta apanha-o com o nome do
 * ficheiro em vez de com o nome de seis mil páginas.
 */
{
  const fortes = [];
  const anda = (v) => {
    if (Array.isArray(v)) return void v.forEach(anda);
    if (v && typeof v === 'object') {
      if (typeof v.forte === 'string') fortes.push(v.forte);
      return void Object.values(v).forEach(anda);
    }
  };
  anda(REGRAS_DO_METODO);
  const nome = TEXTOS_APROVADOS.responsavel;
  if (!fortes.includes(nome)) {
    erros.push({
      rel: 'scripts/textos-aprovados.json',
      msg:
        `o responsável editorial é ${JSON.stringify(nome)} e nenhuma das dez regras do Método ` +
        `imprime esse nome (imprime ${fortes.length ? fortes.map((f) => JSON.stringify(f)).join(', ') : 'nenhum'}).\n` +
        `      O rótulo de todas as páginas e a regra 9 nomeiam a mesma pessoa: ou é a mesma ` +
        `cadeia nos dois ficheiros, ou o sítio diz dois nomes.`,
    });
  }
  if (RESPONSAVEL_EDITORIAL !== nome) {
    erros.push({
      rel: 'src/data/politica-ia.mjs',
      msg:
        `o responsável editorial é ${JSON.stringify(RESPONSAVEL_EDITORIAL)} e o oráculo diz ` +
        `${JSON.stringify(nome)}.`,
    });
  }
  if (LINGUA_DO_RESPONSAVEL !== TEXTOS_APROVADOS.lingua_do_responsavel) {
    erros.push({
      rel: 'src/data/politica-ia.mjs',
      msg:
        `a língua do responsável é ${JSON.stringify(LINGUA_DO_RESPONSAVEL)} e o oráculo diz ` +
        `${JSON.stringify(TEXTOS_APROVADOS.lingua_do_responsavel)}.`,
    });
  }
  if (ANCORA_DA_POLITICA !== TEXTOS_APROVADOS.ancora_da_politica) {
    erros.push({
      rel: 'src/data/politica-ia.mjs',
      msg:
        `a âncora da política é ${JSON.stringify(ANCORA_DA_POLITICA)} e o oráculo diz ` +
        `${JSON.stringify(TEXTOS_APROVADOS.ancora_da_politica)}.`,
    });
  }
  for (const l of ['pt', 'en']) {
    if (textoDoRotulo(l) !== TEXTOS_APROVADOS.rotulo[l]) {
      erros.push({
        rel: 'src/data/politica-ia.mjs',
        msg:
          `o rótulo composto da edição "${l}" não é o texto aprovado.\n` +
          `      aprovado: ${JSON.stringify(TEXTOS_APROVADOS.rotulo[l])}\n` +
          `      composto: ${JSON.stringify(textoDoRotulo(l))}`,
      });
    }
    if (ROTULO_DA_CASA[l]?.porta !== TEXTOS_APROVADOS.porta[l]) {
      erros.push({
        rel: 'src/data/politica-ia.mjs',
        msg:
          `as palavras ligadas da edição "${l}" são ${JSON.stringify(ROTULO_DA_CASA[l]?.porta)} ` +
          `e o oráculo diz ${JSON.stringify(TEXTOS_APROVADOS.porta[l])}.`,
      });
    }
    if (FRASE_DA_POLITICA[l] !== TEXTOS_APROVADOS.frase[l]) {
      erros.push({
        rel: 'src/data/politica-ia.mjs',
        msg:
          `a frase da política da edição "${l}" não é o texto aprovado.\n` +
          `      aprovado: ${JSON.stringify(TEXTOS_APROVADOS.frase[l].slice(0, 120))}\n` +
          `      escrito:  ${JSON.stringify(FRASE_DA_POLITICA[l].slice(0, 120))}`,
      });
    }
    const ficha = FICHA_DA_PRIMEIRA_PAGINA[l];
    const composta = `${ficha.diretorK} ${RESPONSAVEL_EDITORIAL} · ${ficha.gratuito}`;
    if (composta !== TEXTOS_APROVADOS.ficha[l]) {
      erros.push({
        rel: 'src/data/politica-ia.mjs',
        msg:
          `a ficha da primeira página da edição "${l}" não é a cadeia decidida.\n` +
          `      decidida: ${JSON.stringify(TEXTOS_APROVADOS.ficha[l])}\n` +
          `      composta: ${JSON.stringify(composta)}`,
      });
    }
  }
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

  /* Os `id` desta página, guardados antes de tudo o resto: é contra eles que
     uma âncora de outra página é conferida no fim do varrimento. Guardados
     também para os documentos, que saem daqui a seguir mas continuam a ser
     endereços deste sítio. */
  idsPorPagina.set(
    normalizaCaminho(caminho),
    new Set(root.querySelectorAll('[id]').map((e) => e.getAttribute('id')).filter(Boolean)),
  );

  /* --- 0. documentos de estudo: obra citada, regra própria, e sai daqui --- */
  if (rota?.key === 'documento') {
    documentos++;
    verificaDocumento({ rota, rel, caminho, html, root, err });
    continue;
  }

  /* --- 0b. a página de leitura: as sete conferências, ANTES do resto ------
     e sem dispensar nada. Ao contrário do documento alojado, esta página é
     nossa: continua a ser varrida por inteiro a seguir. */
  if (rota?.key === 'texto') {
    paginasDeTexto++;
    contaAsMarcasDoTexto(root);
    verificaTexto({ rota, root, err });
  }

  /**
   * As páginas do próprio livro-razão: os índices e a página de cada linha.
   *
   * SÃO TRÊS ROTAS E NÃO DUAS desde a decisão D6 (26.08.2026). A página do
   * conjunto dos concelhos, `/livro-razao/concelhos` · `/en/ledger/municipalities`,
   * É um índice do livro-razão: é para lá que as linhas do estudo dos concelhos
   * saíram do índice principal, e ela lista-as com a mesma linha-espécime, os
   * mesmos campos marcados `data-linha-*` e o selo da própria linha em cada uma.
   * Sem esta rota na lista, o portão recusava 4 832 marcas legítimas («numa
   * página que não é do livro-razão») e, do outro lado, exigia-lhes um selo de
   * auditoria que na página de um índice não faz sentido, porque cada linha já
   * traz o seu.
   *
   * O que a guarda protege continua protegido: `data-linha-*` continua a ser
   * proibido em qualquer página que não seja do livro-razão, que é o que a
   * impede de ser uma segunda porta para meter texto do livro-razão em prosa.
   * O que muda é a lista das páginas do livro-razão, que cresceu com a página
   * que a direção mandou criar.
   *
   * SÃO QUATRO desde 26.08.2026: a página do conjunto passou a ser o ÍNDICE dos
   * 308 (`livroConcelhos`) e cada concelho ganhou a sua página de livro-razão
   * (`livroConcelho`), porque a do conjunto media 227 008 px de altura e o
   * problema que a decisão D6 resolveu no índice principal tinha reaparecido lá
   * dentro. As duas são páginas do livro-razão pela mesma razão.
   *
   * `paginasDoLivro`, que exige um índice por edição, continua a contar só a
   * rota `livro`: é o índice principal que tem de existir nas duas edições, e
   * a contagem da página do conjunto vive nas suas três chaves da prova.
   */
  /**
   * SÃO CINCO DESDE 28.08.2026, com a página de uma área de governo.
   *
   * A página de uma área LISTA linhas do livro-razão, com a linha-espécime
   * inteira e o selo de cada uma, exatamente como o índice dos 308: usa o mesmo
   * componente, `src/components/ItemDoLivro.astro`, que é literalmente a mesma
   * forma e não uma cópia dela. Sem esta rota na lista, o portão recusava as
   * marcas legítimas de 125 medidas e a página tinha de render de cada uma só o
   * valor e o identificador, que foi o que a leitura cruzada do lugar de
   * direção mediu: «um leitor não consegue dizer o que é 1 409».
   *
   * O que a guarda protege continua protegido, e é o mesmo argumento da decisão
   * D6: `data-linha-*` continua proibido em qualquer página que não seja uma
   * página do livro-razão, e o que a guarda impede é que uma página qualquer
   * cite um campo de uma linha em prosa corrente. Uma lista de linhas com a
   * linha-espécime não é prosa corrente, e o que a guarda dá em troca é mais
   * conferência e não menos: cada campo rendido é comparado, carácter a
   * carácter, com o campo da linha de que ele saiu.
   */
  const paginaDoLivro =
    rota?.key === 'linha' ||
    rota?.key === 'livro' ||
    rota?.key === 'livroConcelhos' ||
    rota?.key === 'livroConcelho' ||
    rota?.key === 'area' ||
    /* A PÁGINA DE UM DOMÍNIO ENTRA A 03.09.2026, E PELO MESMO ARGUMENTO DA DAS
       ÁREAS. A leitura breve de uma medida tem de dizer «a fonte com o nome do
       publicador como a linha o diz» e as três datas (brief F1.2 §2, item 5), e
       essas são campos da linha: rendê-los sem a marca era pô-los na página sem
       ninguém os comparar com nada. Com a marca, o portão confere cada um,
       carácter a carácter, contra o campo da linha de que ele saiu — que é MAIS
       conferência e não menos, que foi o que a decisão da página de área já
       tinha pesado. A guarda continua a impedir o que ela existe para impedir:
       uma página qualquer a citar um campo de uma linha em prosa corrente. */
    rota?.key === 'dominio';
  /* As linhas que ESTA página cita com <Claim/>, para a conferência da prosa da
     agenda: é contra elas, e não contra o livro-razão inteiro, que se recusa um
     valor repetido em prosa. Ver `valoresDoLivroEmProsa()`. */
  const claimsDaPagina = new Set();
  let claimDaPagina = null;
  if (rota?.key === 'livro') paginasDoLivro++;
  if (rota) {
    const chaveDaRota = `${rota.lang}:${rota.key}`;
    paginasPorRota.set(chaveDaRota, (paginasPorRota.get(chaveDaRota) ?? 0) + 1);
  }
  if (rota?.key === 'area') {
    pecasDeArea.set(
      `${rota.lang}:${rota.params.slug}`,
      root.querySelectorAll('[data-area-peca]').length,
    );
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
        /* Mesma regra da marca `data-nonledger`: o motivo só se conta usado se a
           estrutura que ele dispensa trouxer um algarismo. */
        if (/\d/.test(JSON.stringify(raiz.estrutura ?? null))) usou(USOS.contextos, motivo);
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

  /* --------------------------------------------------------------------
     2b. O CARTÃO DE PARTILHA DESTA PÁGINA (etapa 5)
     --------------------------------------------------------------------
     Uma imagem de partilha é a única superfície da casa que viaja sem a
     página: quem a vê não tem o livro-razão ao lado nem um selo em que
     clicar. Por isso as etiquetas não podem ser escritas à mão e não podem
     apontar para um ficheiro que não exista.

     O QUE ESTA CONFERÊNCIA PROVA, e o que não prova. O endereço esperado é
     composto pela mesma função que o `Base.astro` chama (`cartaoDaPagina()`),
     e por isso esta parte não prova que a REGRA de escolha esteja certa — é o
     mesmo limite honesto do `tituloDaLinha()` mais acima. O que ela prova é
     tudo o resto, e é o que apanha um cartão trocado: que o ficheiro existe,
     que o REGISTO desse ficheiro declara a rota e a edição desta página, e
     que o resumo do PNG bate certo com o que o registo diz. Um cartão da
     edição errada tem, no seu registo, a edição errada escrita, e é aí que
     ele cai — mesmo que a função de escolha esteja plantada.

     A REGRA, desde 27.08.2026 (DECISIONS §1.68): uma página nomeia o cartão da
     sua rota e da sua edição, OU, sendo uma página de linha de um estudo de
     dados, o cartão do seu estudo. A regra vive inteira em `cartaoDaPagina()`,
     que é o que faz esta conferência morder as duas: uma página de linha dos
     concelhos que nomeasse um cartão por linha nomeia um ficheiro que já não
     existe, e é aqui que ela cai.
     -------------------------------------------------------------------- */
  if (rota?.key !== 'documento') {
    const linguaDoCartao = linguaPagina ?? rota?.lang ?? PRIMARY_LANG;
    const escolha = cartaoDaPagina(caminho, linguaDoCartao);
    const etiquetas = [
      { onde: 'og:image', selector: 'head meta[property="og:image"]', medida: MEDIDAS_DO_CARTAO[0] },
      { onde: 'twitter:image', selector: 'head meta[name="twitter:image"]', medida: MEDIDAS_DO_CARTAO[1] },
    ];
    for (const { onde, selector, medida } of etiquetas) {
      const nome = nomeDoCartao({ ...escolha, ...medida });
      const esperado = canonicalUrl(`/${PASTA_DOS_CARTOES}/${nome}`);
      const lido = decodeEntities(
        root.querySelector(selector)?.getAttribute('content') ?? '',
      );
      if (lido !== esperado) {
        err(
          `o <meta ${onde}> desta página não nomeia o cartão da sua rota e da sua edição.\n` +
            `      esperado:   ${esperado}\n` +
            `      construído: ${lido || '(nenhum)'}`,
        );
        continue;
      }
      const registo = registoDoCartao(nome);
      if (!registo) {
        err(
          `o <meta ${onde}> nomeia "${nome}" e não há registo desse cartão em ` +
            `dist/${PASTA_DOS_CARTOES}/. Um cartão que não foi construído é um endereço morto ` +
            `em todos os sítios onde esta página for partilhada.`,
        );
        continue;
      }
      if (registo.edicao !== linguaDoCartao) {
        err(
          `o <meta ${onde}> desta página, que é da edição "${linguaDoCartao}", nomeia um cartão ` +
            `cujo registo diz ser da edição "${registo.edicao}".`,
        );
      }
      const rotaEsperada = escolha.rota;
      if (normalizaCaminho(registo.rota) !== normalizaCaminho(rotaEsperada)) {
        err(
          `o <meta ${onde}> nomeia um cartão cujo registo diz ser da rota "${registo.rota}", ` +
            `e esta página precisa do cartão de "${rotaEsperada}".`,
        );
      }
      if (!(registo.cobre ?? []).includes(caminho)) {
        err(
          `o cartão "${nome}" não declara cobrir esta página. O registo lista ` +
            `${(registo.cobre ?? []).length} rota(s), e "${caminho}" não é uma delas: ou a página ` +
            `é nova depois de os cartões terem sido desenhados, ou a escolha do cartão mudou.`,
        );
      }
      cartoesUsados.add(nome);
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
   * O SÍTIO NO ECRÃ PRINCIPAL: AS LIGAÇÕES DA CABEÇA (28.08.2026)
   * ---------------------------------------------------------------------
   *
   * O `BRIEF-app.md` §3 diz uma frase que é a razão deste bloco existir: «o
   * portão de HTML e o `check:cadeia` aceitam as ligações novas porque as
   * RECONHECEM, não porque se lhes abre uma exceção». Nenhuma destas etiquetas
   * ia partir alguma coisa se ninguém lhes mexesse — a varredura dos algarismos
   * do `<head>` lê o título e a descrição, e não atributos —, e é justamente por
   * isso que valia a pena escrevê-lo: uma ligação que ninguém confere é uma
   * ligação que fica partida no dia em que o ficheiro mudar de nome, e um
   * manifesto ligado da edição errada põe o leitor inglês na primeira página
   * portuguesa sempre que ele abrir o ícone que ele próprio instalou.
   *
   * O DESTINO ENTRA NA CONFERÊNCIA DAS LIGAÇÕES INTERNAS, que é a que já mede
   * «uma porta que não abre é pior do que não haver porta»: até hoje ela só
   * olhava para os `a[href]` do corpo. Um ícone que não existe em `dist/` é uma
   * porta que não abre, com a diferença de ninguém a ver a abrir-se.
   */
  {
    const manifesto = root.querySelector('head link[rel="manifest"]');
    if (!manifesto) {
      err(
        `falta <link rel="manifest">.\n` +
          `      É o que faz do sítio uma aplicação de ecrã principal, e é por edição.`,
      );
    } else if (rota) {
      const esperado = MANIFESTO_DA_EDICAO[rota.lang];
      const href = decodeEntities(manifesto.getAttribute('href') ?? '');
      if (!esperado) {
        err(`a edição "${rota.lang}" não tem manifesto declarado em MANIFESTO_DA_EDICAO.`);
      } else if (href !== esperado) {
        err(
          `esta página é da edição "${rota.lang}" e liga o manifesto "${href}"; ` +
            `o dela é "${esperado}".\n` +
            `      Um manifesto da outra edição abre a aplicação na primeira página errada.`,
        );
      }
      ligacoesInternas.push({ rel, base: baseDeResolucao(rel, caminho), href });
    }

    /* Os três ícones, cada um com o seu `rel` e o seu ficheiro. O `sizes` do ICO
       fica na lista porque é o que diz ao cliente o que está lá dentro sem ele
       ter de abrir o ficheiro, e um `sizes` que não bata com o ICO é pior do que
       nenhum. `tests/inicio/app.mjs` abre o ICO e confere os dois tamanhos. */
    for (const { selector, href: esperado, sizes, oQueE } of LIGACOES_DO_APP) {
      const el = root.querySelector(`head ${selector}`);
      if (!el) {
        err(`falta <link ${selector.replace(/^link/, '').trim()}> (${oQueE}).`);
        continue;
      }
      const href = decodeEntities(el.getAttribute('href') ?? '');
      if (href !== esperado) {
        err(`o ${oQueE} aponta para "${href}" e o ficheiro da casa é "${esperado}".`);
        continue;
      }
      if (sizes && (el.getAttribute('sizes') ?? '') !== sizes) {
        err(
          `o ${oQueE} declara sizes="${el.getAttribute('sizes') ?? ''}" e o ficheiro tem ` +
            `"${sizes}" lá dentro.`,
        );
      }
      ligacoesInternas.push({ rel, base: baseDeResolucao(rel, caminho), href });
    }

    /* A cor da mobília do navegador é a do papel desta página, e é UMA só.
       A razão de não serem duas com `media` está escrita em `Base.astro` e é a
       Emenda 12: neste sítio a preferência do sistema não decide o tema, e uma
       etiqueta que a lesse prometia uma barra escura por cima de uma página
       clara. Quem troca a cor é `public/js/tema.js`, com a escolha do leitor. */
    const cores = root.querySelectorAll('head meta[name="theme-color"]');
    if (cores.length !== 1) {
      err(
        `o <head> tem ${cores.length} etiqueta(s) <meta name="theme-color"> e devia ter uma.\n` +
          `      Uma por esquema do sistema mentiria: desde a Emenda 12 o escuro deste sítio é ` +
          `uma escolha do leitor, não a preferência do aparelho dele.`,
      );
    } else if ((cores[0].getAttribute('content') ?? '').toLowerCase() !== PAPEL_CLARO) {
      err(
        `o <meta name="theme-color"> diz "${cores[0].getAttribute('content')}" e o papel claro ` +
          `dos tokens é "${PAPEL_CLARO}".`,
      );
    }

    const titulo = root.querySelector('head meta[name="apple-mobile-web-app-title"]');
    if (!titulo) err('falta <meta name="apple-mobile-web-app-title">, que é o nome sob o ícone.');
    else if (decodeEntities(titulo.getAttribute('content') ?? '') !== SITE_SHORT_NAME) {
      err(
        `o <meta name="apple-mobile-web-app-title"> diz ` +
          `"${titulo.getAttribute('content')}" e o nome curto da casa é "${SITE_SHORT_NAME}".`,
      );
    }

    /* E a etiqueta que NÃO pode estar. Está obsoleta desde que o WebKit lê o
       manifesto (iOS 15.4), e o `BRIEF-app.md` §3 di-lo à letra. Uma proibição
       sem quem a confira é uma frase num ficheiro de texto. */
    if (root.querySelector('head meta[name="apple-mobile-web-app-capable"]')) {
      err(
        `o <head> traz <meta name="apple-mobile-web-app-capable">, que está obsoleta e que o ` +
          `BRIEF-app.md exclui: quem faz este trabalho é o `.concat(
            '`display: standalone` do manifesto.',
          ),
      );
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

    /**
     * -------------------------------------------------------------------
     * E DENTRO DE UM MARCO (bloco F1.7, item 1, 04.09.2026)
     * -------------------------------------------------------------------
     * Existir e ser vista não chegava. Medido a 04.09.2026 sobre `dist/`: 739
     * das 7 237 páginas tinham a porta no vão entre o `</main>` e o
     * `<footer>`, isto é, dentro de marco nenhum. Quem lê uma página que não
     * conhece com um leitor de ecrã salta de marco em marco: o `main` acabava
     * antes da porta e o `contentinfo` começava depois dela, e a porta ficava
     * numa terra de ninguém que só se encontra lendo a página de cima a baixo.
     * A auditoria de 02.09 contou 19 nas suas 30 páginas.
     *
     * Os marcos que servem: o `<main>` (as páginas que a põem no seu próprio
     * aparelho), o `<footer>` (o invólucro, desde este bloco) e um `<nav>` com
     * nome. Um `<div>` não serve, e uma `<section>` sem nome também não: uma
     * `section` só é marco quando tem nome acessível, e uma `region` anónima
     * não aparece na lista de marcos de ninguém.
     */
    const marco = porta.closest(
      'footer,main,[role="contentinfo"],[role="main"],nav[aria-label],nav[aria-labelledby]',
    );
    if (!marco) {
      err(
        `a porta de correcções não está dentro de nenhum marco.\n` +
          `      Tem de estar dentro do <main>, do <footer> ou de um <nav> com nome: quem ` +
          `navega por marcos passa por cima do que está entre eles.`,
      );
    }
  }

  /**
   * ---------------------------------------------------------------------
   * UM SÓ `<h1>` POR PÁGINA (bloco F1.7, item 3, 04.09.2026)
   * ---------------------------------------------------------------------
   * A regra já existia para os documentos alojados (`verificaDocumento()`) e
   * não existia para as páginas da casa. Medido a 04.09.2026: 7 235 das 7 237
   * páginas tinham exactamente um, e as duas que não tinham eram as duas
   * primeiras páginas, com o nome do sítio em `<h1>` no cabeçalho e a manchete
   * em `<h1>` no corpo. Um documento com dois `<h1>` não diz de que trata.
   *
   * A regra é a contagem e mais nada: qual dos dois desce de nível é uma
   * decisão de desenho, e está escrita onde ela se toma
   * (`src/components/Masthead.astro`). O que este portão garante é que a
   * pergunta não volte a ficar sem resposta numa vista nova.
   */
  const titulosDaPagina = body0.querySelectorAll('h1');
  if (titulosDaPagina.length !== 1) {
    err(
      `esta página tem ${titulosDaPagina.length} \`<h1>\`; tem de ter exactamente um.\n` +
        `      ${titulosDaPagina
          .map((h) => `«${normalizeWhitespace(decodeEntities(textoDe(h))).slice(0, 60)}»`)
          .join(' · ') || '(nenhum)'}`,
    );
  }

  /**
   * ---------------------------------------------------------------------
   * `aria-expanded` SÓ ONDE O GUIÃO O ACOMPANHA (bloco F1.7, item 10)
   * ---------------------------------------------------------------------
   * Um `aria-expanded` escrito no HTML servido diz «fechado» para sempre a
   * quem lê o DOM, a menos que alguma coisa o mude quando o estado muda. A
   * casa tem exactamente um sítio assim, e tem-no com a razão medida e
   * escrita: um `<summary>` cujo `<details>` abre um IRMÃO e não um filho
   * (`src/components/Masthead.astro`, `public/js/tema.js`), onde a associação
   * de árvore se perde e se recupera por `aria-controls`. O guião acompanha o
   * atributo em todo o `details > summary[aria-controls]`, e é essa a forma
   * que esta regra deixa passar.
   *
   * MEDIDO ANTES DE ESCRITO (04.09.2026, `dist/` fora dos documentos
   * alojados): 7 221 ocorrências, todas nessa forma, zero fora dela. A regra
   * não corrige nada hoje; fecha a porta a um `aria-expanded` posto à mão numa
   * vista nova, que é o feitio do defeito que a auditoria de 02.09 nomeou.
   *
   * Os documentos alojados não passam por aqui (o ramo devolve antes): o que
   * está lá dentro é deles, com o guião deles, e a casa não lhes toca.
   */
  for (const el of body0.querySelectorAll('[aria-expanded]')) {
    const etiqueta = String(el.rawTagName ?? '').toLowerCase();
    const doGuiao =
      etiqueta === 'summary' &&
      el.hasAttribute('aria-controls') &&
      String(el.parentNode?.rawTagName ?? '').toLowerCase() === 'details';
    if (!doGuiao) {
      err(
        `um <${etiqueta}> leva \`aria-expanded\` e o guião da casa não o acompanha.\n` +
          `      O guião só acompanha \`details > summary[aria-controls]\` ` +
          `(public/js/tema.js). Um <details> nativo não precisa do atributo, e um comando ` +
          `que precise dele tem de o ter acompanhado: um atributo parado mente sobre o estado.`,
      );
    }
  }

  /**
   * ---------------------------------------------------------------------
   * O RÓTULO DE IA · em todas as páginas construídas (01.09.2026)
   * ---------------------------------------------------------------------
   *
   * O artigo 50.º, n.º 4, segundo parágrafo, do Regulamento (UE) 2024/1689
   * obriga quem publica texto gerado por IA para informar o público sobre
   * matérias de interesse público a divulgá-lo, e o n.º 5 manda dá-lo «o mais
   * tardar no momento da primeira interação ou exposição». A casa escolheu a
   * via B (rotular tudo) a 30.08.2026. Uma obrigação que depende de alguém se
   * lembrar de pôr uma linha numa vista nova não é uma obrigação cumprida: é
   * esta conferência que a torna uma condição da construção.
   *
   * O ORÁCULO NÃO É O FICHEIRO QUE RENDE (segunda passagem, 01.09.2026). A
   * primeira forma desta regra comparava a página com `src/data/politica-ia.mjs`,
   * que é o mesmo ficheiro de onde a página sai: mudar a cadeia mudava a saída e
   * a expectativa ao mesmo tempo, e a leitura a frio provou-o com uma planta que
   * tirava o «the» de «under the house policy» e passava verde. O oráculo passa a
   * ser `scripts/textos-aprovados.json`, copiado da ordem de construção §3 e que
   * nenhum ficheiro de `src/` importa. **E a comparação é EXATA**: sem colapsar
   * espaços e sem aparar as pontas, porque um espaço a mais numa divulgação
   * obrigatória é uma diferença e não um detalhe de composição.
   *
   * **OS DOCUMENTOS DE ESTUDO NÃO PASSAM POR AQUI, E DESDE 03.09.2026 LEVAM O
   * RÓTULO NA MESMA.** Este ramo continua a não correr para eles
   * (`verificaDocumento()` devolve antes), porque o bloco que ele procura é o
   * do rodapé da casa e um documento alojado não tem rodapé nosso. O que mudou
   * foi o lugar: o rótulo passou a ir na FAIXA, que já é markup nosso e entra
   * no `esperado` que o portão recalcula dos dois lados da igualdade, e por
   * isso não quebra o carácter a carácter da §1.19. Quem o confere é o ponto 8
   * de `verificaDocumento()`, com a mesma comparação de texto que aqui se faz.
   * A contagem de baixo continua a ser das páginas fora dos documentos.
   *
   * O QUE SE CONFERE EM CADA BLOCO DE RÓTULO, e é o mesmo no rodapé e no topo
   * (segunda passagem: a primeira forma conferia o topo só pela contagem do
   * marcador, e uma página de leitura com o rótulo de outra língua passava):
   *
   *   1. **diz o texto aprovado**, carácter a carácter, na língua da edição;
   *   2. **a porta abre a política**, e as palavras ligadas são exactamente
   *      «a política da casa» / «the house policy»: uma ligação com o texto
   *      errado é outra promessa;
   *   3. **o nome de quem responde** aparece exactamente uma vez, com o texto
   *      certo, e com `lang="pt-PT"` próprio nas páginas inglesas;
   *   4. **vê-se**: nem `hidden`, nem `aria-hidden`, nem `.vh`, nem um `style`
   *      em linha com `display:none` ou `visibility:hidden`, nele ou num
   *      antepassado.
   *
   * **O LIMITE DESTA REGRA, DITO E NÃO ESCONDIDO.** É um portão estático: lê o
   * HTML, e não corre folhas de estilo. Uma regra de CSS que esconda `.rotulo-ia`
   * numa folha passa por aqui, e quem a apanha é a régua do navegador
   * (`tests/inicio/rotulo.mjs`, célula M1, com o estrago plantado que a prova).
   * O que este portão fecha é a ocultação escrita no próprio documento.
   */
  {
    const rotulos = root.querySelectorAll('[data-rotulo-ia]');
    const noRodape = rotulos.filter((e) => e.getAttribute('data-rotulo-ia') === 'rodape');
    const noTopo = rotulos.filter((e) => e.getAttribute('data-rotulo-ia') === 'topo');
    ROTULO_DE_IA.rodape += noRodape.length;
    ROTULO_DE_IA.topo += noTopo.length;

    /* A LÍNGUA DA PÁGINA É UMA CONDIÇÃO, E NÃO UMA COMODIDADE (segunda
       passagem). A primeira forma escrevia `else if (linguaPagina)`: uma página
       sem `<html lang>`, ou com um valor que a tabela de rotas não conhece,
       saltava a conferência inteira em silêncio, que é o modo mais barato de a
       desligar. Passa a ser vermelha. */
    if (!linguaPagina) {
      err(
        `esta página não diz a sua língua num «<html lang>» que a casa conheça ` +
          `(leu "${root.querySelector('html')?.getAttribute('lang') ?? '(nenhum)'}").\n` +
          `      O rótulo de IA, a marca do nome de quem responde e a frase da política ` +
          `conferem-se todos contra a língua da edição: sem ela não há nada contra que ` +
          `comparar, e uma conferência que não corre não é uma conferência.`,
      );
    }

    if (noRodape.length !== 1) {
      err(
        `esta página tem ${noRodape.length} rótulo(s) de IA no rodapé; tem de ter exactamente um.\n` +
          `      <RotuloDeIA/> entra pelo rodapé (SiteFooter.astro) em todas as páginas ` +
          `construídas. A divulgação do artigo 50.º, n.º 4 do Regulamento (UE) 2024/1689 é de ` +
          `cada página, à primeira exposição, e não só do Sobre.`,
      );
    }

    /* O topo das páginas de leitura: lá tem de estar, e em mais lado nenhum. */
    const esperadoNoTopo = rota?.key === 'texto' ? 1 : 0;
    if (noTopo.length !== esperadoNoTopo) {
      err(
        `esta página tem ${noTopo.length} rótulo(s) de IA no topo e devia ter ${esperadoNoTopo}.\n` +
          `      O topo é das páginas de leitura, que são texto longo e onde o rodapé chega ` +
          `tarde para o «momento da primeira exposição» do n.º 5 do artigo 50.º.`,
      );
    }

    /**
     * A MESMA CONFERÊNCIA NOS DOIS SÍTIOS (segunda passagem).
     *
     * O rodapé e o topo são o mesmo bloco, e a divulgação é a mesma: o que se
     * confere num confere-se no outro. A primeira forma conferia o texto só no
     * rodapé, e o topo passava com a contagem do marcador.
     */
    if (linguaPagina) {
      for (const rotulo of rotulos) {
        const onde = rotulo.getAttribute('data-rotulo-ia');
        if (onde !== 'rodape' && onde !== 'topo') {
          err(`«data-rotulo-ia="${onde}"» não é um dos dois lugares do rótulo ("rodape" ou "topo").`);
          continue;
        }

        /* 1 · o texto aprovado, carácter a carácter e sem normalizar nada. A
           ficha da primeira página vive dentro do mesmo bloco e não faz parte do
           texto aprovado do rótulo: compara-se a LINHA. */
        const linha = rotulo.querySelector('.rotulo-ia-linha');
        if (!linha) {
          err(`o rótulo de IA (${onde}) não tem a linha «.rotulo-ia-linha», que é o que se compara.`);
          continue;
        }
        const esperado = TEXTOS_APROVADOS.rotulo[linguaPagina];
        const rendido = decodeEntities(textoDe(linha, { semEstilo: true, separador: '' }));
        if (rendido !== esperado) {
          err(
            `o rótulo de IA (${onde}) não é o texto aprovado.\n` +
              `      aprovado:    ${JSON.stringify(esperado)}\n` +
              `      renderizado: ${JSON.stringify(rendido.slice(0, 200))}\n` +
              `      Este texto é do diretor (ordem de 01.09.2026 §3) e o oráculo é ` +
              `scripts/textos-aprovados.json. Muda por decisão, e nos dois ficheiros.`,
          );
        }

        /* 2 · a porta abre a política, e as palavras ligadas são as aprovadas. */
        const destinoDaPolitica = `${routePath('metodo', linguaPagina)}#${TEXTOS_APROVADOS.ancora_da_politica}`;
        const portas = linha
          .querySelectorAll('a[href]')
          .filter((a) => decodeEntities(a.getAttribute('href') ?? '') === destinoDaPolitica);
        if (portas.length !== 1) {
          err(
            `o rótulo de IA (${onde}) tem ${portas.length} porta(s) para a política ` +
              `("${destinoDaPolitica}") e tem de ter exactamente uma.\n` +
              `      Uma divulgação cuja política não se alcança é meia divulgação.`,
          );
        } else {
          const texto = decodeEntities(textoDe(portas[0], { semEstilo: true, separador: '' }));
          const palavras = TEXTOS_APROVADOS.porta[linguaPagina];
          if (texto !== palavras) {
            err(
              `a porta da política diz ${JSON.stringify(texto)} e as palavras ligadas têm de ser ` +
                `${JSON.stringify(palavras)}.\n` +
                `      O texto aprovado põe a ligação naquelas palavras e não noutras: uma porta ` +
                `com outro texto é outra promessa.`,
            );
          }
        }

        /* 3 · o nome de quem responde: uma vez, com o texto certo, e com a
           marca de língua própria numa página inglesa. */
        const nomes = rotulo.querySelectorAll('[data-rotulo-nome]');
        /* UM POR CADA SÍTIO ONDE O NOME SE DIZ, e não «pelo menos um»: a linha
           tem exactamente um, a ficha da primeira página tem exactamente um, e
           não há nenhum solto no bloco. Dois nomes na mesma linha são duas
           pessoas para quem ouve a página. */
        const naLinha = linha.querySelectorAll('[data-rotulo-nome]').length;
        const fichaDoBloco = rotulo.querySelector('[data-ficha-primeira-pagina]');
        const naFicha = fichaDoBloco
          ? fichaDoBloco.querySelectorAll('[data-rotulo-nome]').length
          : 0;
        if (naLinha !== 1) {
          err(
            `a linha do rótulo de IA (${onde}) tem ${naLinha} «data-rotulo-nome» e tem de ter ` +
              `exactamente um.`,
          );
        }
        if (fichaDoBloco && naFicha !== 1) {
          err(
            `a ficha da primeira página tem ${naFicha} «data-rotulo-nome» e tem de ter ` +
              `exactamente um.`,
          );
        }
        if (nomes.length !== naLinha + naFicha) {
          err(
            `o rótulo de IA (${onde}) tem ${nomes.length - naLinha - naFicha} «data-rotulo-nome» ` +
              `fora da linha e da ficha. O nome diz-se onde está escrito que se diz, e em mais ` +
              `lado nenhum.`,
          );
        }
        for (const nome of nomes) {
          const t = decodeEntities(textoDe(nome, { semEstilo: true, separador: '' }));
          if (t !== TEXTOS_APROVADOS.responsavel) {
            err(
              `um «data-rotulo-nome» diz ${JSON.stringify(t.slice(0, 80))} e o responsável ` +
                `editorial é ${JSON.stringify(TEXTOS_APROVADOS.responsavel)}. A marca é do nome, ` +
                `e de mais nada.`,
            );
          }
          const propria = nome.getAttribute('lang') ?? null;
          if (linguaPagina === 'en' && propria !== TEXTOS_APROVADOS.lingua_do_responsavel) {
            err(
              `numa página inglesa o nome de quem responde tem de levar ` +
                `lang="${TEXTOS_APROVADOS.lingua_do_responsavel}" e leva "${propria ?? '(nenhum)'}". ` +
                `É um nome português, e sem a marca um leitor de ecrã lê-o com fonética inglesa.`,
            );
          }
          if (linguaPagina === 'pt' && propria !== null) {
            err(
              `numa página portuguesa o nome de quem responde não leva marca de língua nenhuma ` +
                `e leva lang="${propria}". A marca a mais é o mesmo defeito da marca em falta.`,
            );
          }
        }

        /* 4 · vê-se. */
        const tapado = escondidoNoDocumento(rotulo);
        if (tapado) {
          err(
            `o rótulo de IA (${onde}) está escondido por ${tapado} (nele ou num antepassado). ` +
              `O n.º 5 do artigo 50.º pede-o «de forma clara e percetível».`,
          );
        }
      }
    }

    /**
     * O BLOCO DO RODAPÉ VIVE DENTRO DE UM `<footer>` (segunda passagem).
     *
     * A classe `.rotulo-ia-rodape` e o atributo `data-rotulo-ia="rodape"` são
     * cadeias: dizem onde o bloco DEVIA estar, e não onde está. A conferência é
     * de ANTEPASSADO REAL, porque é isso que faz a linha ser o `contentinfo` da
     * página, que é o marco onde um leitor de ecrã procura quem responde por
     * ela.
     */
    for (const rotulo of noRodape) {
      let no = rotulo.parentNode;
      let dentro = false;
      while (no && no.nodeType !== undefined) {
        if (String(no.rawTagName ?? '').toLowerCase() === 'footer') { dentro = true; break; }
        no = no.parentNode;
      }
      if (!dentro) {
        err(
          `o rótulo de IA do rodapé não está dentro de um «<footer>».\n` +
            `      O nome da classe diz onde ele devia estar; esta conferência diz onde ele ` +
            `está. A autoria e quem responde são o que um leitor de ecrã procura no ` +
            `«contentinfo» da página.`,
        );
      }
    }

    /**
     * A FICHA DA PRIMEIRA PÁGINA · o artigo 15.º, n.º 1 da Lei de Imprensa.
     *
     * «As publicações periódicas devem conter, na primeira página de cada
     * edição, o título, a data, o período de tempo a que respeitam, o nome do
     * director e o preço por unidade ou a menção da sua gratuitidade» (Lei
     * n.º 2/99, consolidada; `design/observatorio/DILIGENCIA-LEGAL.md` §2.1). O
     * título e a data já lá estavam; o nome e a gratuitidade são desta ordem.
     *
     * A LEITURA QUE SE FEZ está escrita em `src/data/politica-ia.mjs`: «a
     * primeira página de cada edição» lê-se como a página inicial de cada uma
     * das duas edições construídas. É uma leitura, e não a resposta do
     * advogado: se ele ler de outra maneira, muda-se a condição num sítio só.
     */
    const fichas = root.querySelectorAll('[data-ficha-primeira-pagina]');
    ROTULO_DE_IA.ficha += fichas.length;
    const esperadaFicha = rota?.key === 'home' ? 1 : 0;
    if (fichas.length !== esperadaFicha) {
      err(
        `esta página tem ${fichas.length} ficha(s) da primeira página e devia ter ` +
          `${esperadaFicha}. O artigo 15.º, n.º 1 da Lei de Imprensa pede o nome do diretor e a ` +
          `menção de gratuitidade na primeira página de cada edição, e ali só.`,
      );
    } else if (fichas.length === 1 && linguaPagina) {
      const t = decodeEntities(textoDe(fichas[0], { semEstilo: true, separador: '' }));
      const esperado = TEXTOS_APROVADOS.ficha[linguaPagina];
      if (t !== esperado) {
        err(
          `a ficha da primeira página não é a cadeia decidida.\n` +
            `      decidida:    ${JSON.stringify(esperado)}\n` +
            `      renderizada: ${JSON.stringify(t.slice(0, 200))}`,
        );
      }
    }

    /**
     * A FRASE DA POLÍTICA · no Sobre e no Método, e em mais lado nenhum.
     *
     * É texto do diretor, aprovado carácter a carácter, e por isso é comparado
     * como o do Sobre. As duas rotas são as que a ordem nomeia: a página do
     * leitor leva o rótulo, que é uma linha e uma porta; a frase inteira vive
     * onde há sítio para ela.
     *
     * E O ATRIBUTO TEM DE DIZER A LÍNGUA DA ROTA (segunda passagem): a primeira
     * forma comparava a frase com a língua que o próprio atributo declarava, e
     * uma frase inglesa numa página portuguesa passava por estar declarada
     * inglesa. O atributo é do gabarito e não é prova de nada.
     */
    const frases = root.querySelectorAll('[data-frase-da-politica]');
    ROTULO_DE_IA.frase += frases.length;
    const esperadasFrases = rota?.key === 'sobre' || rota?.key === 'metodo' ? 1 : 0;
    if (frases.length !== esperadasFrases) {
      err(
        `esta página rende ${frases.length} frase(s) da política e devia render ` +
          `${esperadasFrases}. A frase vive no Sobre e no Método; as páginas do leitor levam o ` +
          `rótulo e a porta.`,
      );
    } else if (frases.length === 1 && linguaPagina) {
      const declarada = frases[0].getAttribute('data-frase-da-politica');
      if (declarada !== linguaPagina) {
        err(
          `«data-frase-da-politica="${declarada}"» e a página é da edição "${linguaPagina}". ` +
            `A marca diz de que edição é a frase, e tem de ser a da rota.`,
        );
      }
      const t = decodeEntities(textoDe(frases[0], { semEstilo: true, separador: '' }));
      const esperada = TEXTOS_APROVADOS.frase[linguaPagina];
      if (t !== esperada) {
        err(
          `a frase da política não é o texto aprovado.\n` +
            `      aprovado:    ${JSON.stringify(esperada.slice(0, 160))}\n` +
            `      renderizado: ${JSON.stringify(t.slice(0, 160))}`,
        );
      }
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
    if (!eLigacaoInterna(href)) continue;
    ligacoesInternas.push({ rel, base: baseDeResolucao(rel, caminho), href });
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
    claimsDaPagina.add(id);
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
    } else if (formaDoValor(textoTranscrito(el)) !== formaDoValor(claim.value)) {
      /* Os algarismos batem e a escrita não: o sinal, a vírgula ou um símbolo
         metido dentro do elemento. Ver formaDoValor(), que diz o que é a mesma
         escrita e o que é outro número. */
      err(
        `a afirmação "${id}" foi renderizada como "${textoTranscrito(el).slice(0, 60)}" e o ` +
          `livro-razão diz "${claim.value}".\n` +
          `      Os algarismos batem certo e a forma não. Não é só o valor: um sinal, uma ` +
          `vírgula ou um símbolo de unidade dentro do elemento são um número diferente.\n` +
          `      Dentro de [data-claim] vai o valor da linha e mais nada; o símbolo da ` +
          `unidade vai ao lado, fora dele (src/components/Claim.astro, "sufixo").`,
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
  /**
   * A ENTRADA A QUE UM CAMPO PERTENCE.
   *
   * Sobe até ao primeiro antepassado marcado `data-correcao-entrada`, que é o
   * elemento que o gabarito declara como sendo UMA entrada do registo. Sem ele
   * não há onde exigir a porta: os campos são irmãos soltos, e um registo podia
   * perder o selo de todas as entradas sem que nada fechasse.
   */
  const entradaDoRegisto = (el) => {
    let p = el.parentNode;
    while (p) {
      if ('data-correcao-entrada' in (p.attributes ?? {})) return p;
      p = p.parentNode;
    }
    return null;
  };

  const CAMPOS_CORRECAO = {
    /* A DATA DE UMA ENTRADA ESCREVE-SE NA FORMA DA CASA (bloco F1.4,
       04.09.2026). O registo guarda-a em ISO, como o livro-razão guarda as
       suas, e a superfície escreve-a dd.mm.aaaa pela regra única da §1.91. O
       portão recompõe-a por conta própria (a cópia local da regra está em
       `dataDaCasaGate`, mais abaixo) e compara-a carácter a carácter: continua a
       provar a transcrição, e passa a provar também a forma. */
    date: 'data',
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

    /* Cada campo vive dentro da entrada que o declara, e a entrada é da linha
       daquele campo. Sem esta amarra, `data-correcao-entrada` seria opcional e a
       conferência da porta, mais abaixo, não conferia nada: bastava não pôr a
       marca.

       FORA DAS PÁGINAS DO LIVRO-RAZÃO, e é a mesma razão de `auditaSelo()`: na
       página de uma linha, a história daquela linha É a linha, e um selo ali
       seria uma porta para a divisão onde já se está. A decisão (c) é sobre o
       REGISTO de correções, que é a página que junta as histórias de linhas
       diferentes e onde a porta é a única maneira de saber de qual. */
    const entrada = paginaDoLivro ? null : entradaDoRegisto(el);
    if (paginaDoLivro) {
      /* nada a exigir: ver acima */
    } else if (!entrada) {
      err(
        `o campo "${campo}" da correção #${n + 1} de "${id}" está fora de uma entrada declarada.\n` +
          `      Cada entrada do registo leva data-correcao-entrada="<id da linha>" no elemento que a ` +
          `embrulha; é nele que o portão exige o selo daquela linha (decisão c, 20.08.2026).`,
      );
    } else if (entrada.getAttribute('data-correcao-entrada') !== id) {
      err(
        `o campo "${campo}" da correção #${n + 1} de "${id}" está dentro de uma entrada declarada da ` +
          `linha "${entrada.getAttribute('data-correcao-entrada')}".\n` +
          `      Uma entrada do registo é de uma linha só: é dela que a porta tem de ser.`,
      );
    }

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
        : modo === 'data'
          ? renderizado === dataDaCasaGate(normalizeWhitespace(esperado))
          : renderizado === normalizeWhitespace(esperado);
    if (!bate) {
      err(
        `no registo de correções, "${campo}" de "${id}" foi renderizado como ` +
          `"${renderizado.trim().slice(0, 120)}" mas o livro-razão diz ` +
          `"${esperado.slice(0, 120)}".`,
      );
    }
  }

  /**
   * -------------------------------------------------------------------------
   * A PORTA DE CADA ENTRADA DO REGISTO — o selo da linha (decisão c, 20.08.2026)
   * -------------------------------------------------------------------------
   * «Cada entrada mantém a comparação campo a campo contra o `corrections[]` da
   * linha e **ganha o selo da linha como porta**, ao pé do par, para que um
   * leitor possa abrir a linha onde a história vive.»
   *
   * A conferência é a mesma de `auditaSelo()` reduzida ao que aqui importa:
   * dentro da entrada tem de existir uma âncora `.src-chip` cujo `href` seja o
   * caminho da linha DAQUELA entrada, numa das duas edições. É extensão da
   * conferência que já existia sobre `data-correcao-*` e não um portão novo: a
   * marca é a mesma família, o laço é o mesmo, e a moratória de 2026-08-15 fica
   * respeitada.
   *
   * Uma entrada com selo para OUTRA linha não passa, e a mensagem di-lo por
   * extenso: a etiqueta desse selo pode estar perfeitamente certa — é a etiqueta
   * da linha que ele abre — e a conferência de `data-nonledger="proveniencia"`,
   * mais abaixo, deixa-a passar. O que falha é a porta estar noutra parede.
   */
  for (const el of body.querySelectorAll('[data-correcao-entrada]')) {
    const id = el.getAttribute('data-correcao-entrada');
    if (!claims.has(id)) {
      err(
        `uma entrada do registo de correções declara-se da linha "${id}", que não existe no livro-razão.`,
      );
      continue;
    }
    const alvos = LANGS.map((l) => routePath('linha', l, { slug: id }));
    if (temChipPara(el, alvos)) continue;

    const outras = [
      ...new Set(
        [...(el.querySelectorAll('.src-chip') ?? [])]
          .map((a) => LINHA_POR_PORTA.get(decodeEntities(a.getAttribute('href') ?? '').split('#')[0]))
          .filter(Boolean)
          .map((x) => x.id),
      ),
    ];
    err(
      `a entrada do registo de correções da linha "${id}" não tem o selo dessa linha por porta.\n` +
        `      esperava-se <a class="src-chip" href="${routePath('linha', linguaPagina ?? 'pt', { slug: id })}"> ` +
        `dentro da própria entrada, ao pé do par de valores.\n` +
        (outras.length
          ? `      A entrada tem selo, e ele abre a linha "${outras.join('", "')}". Uma porta que abre ` +
            `outra linha não é a porta desta entrada: quem clica quer a história DESTE valor.\n`
          : `      A entrada não tem selo nenhum.\n`) +
        `      É a decisão (c) da direção, de 20.08.2026: a comparação campo a campo fica, e a entrada ` +
        `ganha a porta.`,
    );
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

    if (
      !CAMPOS_DA_LINHA.has(campo) &&
      !CAMPO_DE_VERIFICACAO.test(campo) &&
      !CAMPO_DE_ALOJAMENTO.test(campo) &&
      !CAMPO_DO_CALCULO.test(campo)
    ) {
      err(
        `data-linha-campo="${campo}" não existe. ` +
          `Aceites: ${[...CAMPOS_DA_LINHA].join(', ')}, verifications.<n>.date, ` +
          `verifications.<n>.found, document.hosted.extracted_from.<n>.file, ` +
          `document.hosted.extracted_from.<n>.sha256.curto, ` +
          `document.computed_over.files.<n>.{file,snapshot_date,sha256.curto}.\n` +
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
    if (campo === 'source_url' || campo === 'document.url') {
      const ancora = el.parentNode?.rawTagName?.toLowerCase() === 'a' ? el.parentNode : null;
      const destino = ancora?.getAttribute('href') ?? null;
      if (destino !== null && decodeEntities(destino) !== String(esperado)) {
        err(
          `o endereço de "${id}" (${campo}) está escrito como ` +
            `"${String(esperado).slice(0, 90)}" mas a ligação aponta para ` +
            `"${decodeEntities(destino).slice(0, 90)}".`,
        );
      }
    }

    /**
     * O TÍTULO DE UM DOCUMENTO, QUANDO ABRE, ABRE O DOCUMENTO (bloco F1.4,
     * 04.09.2026).
     *
     * O bloco F1.4 pôs o título do documento a abrir o `document.url` da linha,
     * que é a porta que o leitor procura no primeiro sítio onde olha. Uma porta
     * é a única coisa desta página que se segue sem se ler, e por isso vale aqui
     * a mesma excepção estreita que o endereço já tinha: o `href` da âncora que
     * embrulha o título tem de ser, carácter a carácter, o `document.url` DESTA
     * linha. Um título a abrir outro documento seria uma atribuição errada com a
     * forma de uma comodidade, e nenhum outro varrimento a apanha.
     *
     * A GUARDA É NOS DOIS SENTIDOS: uma âncora à volta do título numa linha que
     * não declara `document.url` também fecha a construção, porque não há
     * endereço nenhum contra que a conferir.
     */
    if (campo === 'document.title') {
      const ancora = el.parentNode?.rawTagName?.toLowerCase() === 'a' ? el.parentNode : null;
      const destino = ancora?.getAttribute('href') ?? null;
      /**
       * A PORTA É EXIGIDA, E NÃO SÓ CONFERIDA (leitura a frio do F1.4, Major 9).
       *
       * A primeira passagem conferia o destino QUANDO havia âncora, e não exigia
       * a âncora: o título da frase de atribuição ficou em texto morto e o da
       * ficha ficou clicável, o mesmo nome duas vezes na mesma página com duas
       * naturezas. Passa a ser um erro render o título de uma linha que declara
       * `document.url` SEM a porta.
       *
       * NA PÁGINA DA LINHA, E SÓ AÍ. No índice do livro-razão e nas páginas de
       * área o título é o NOME da medida numa lista de nomes (a escada do
       * `src/lib/nomes.mjs`), e uma lista de nomes não é uma lista de portas: a
       * porta de cada entrada é o selo, que abre a linha. Exigir ali a porta do
       * documento punha o leitor a sair do sítio a partir de um índice.
       */
      if (destino === null && claimDaPagina && claimDaPagina.id === id) {
        const url = campoDaLinha(claim, 'document.url', linguaPagina);
        if (url !== null && url !== undefined) {
          err(
            `o título do documento de "${id}" está sem porta, e a linha declara ` +
              `"document.url" ("${String(url).slice(0, 90)}").\n` +
              `      Na página de uma linha, um título cujo documento tem endereço abre-o: ` +
              `envolva o campo numa <a class="ligacao-externa" href="…">.`,
          );
        }
      }
      if (destino !== null) {
        const url = campoDaLinha(claim, 'document.url', linguaPagina);
        if (url === null || url === undefined) {
          err(
            `o título do documento de "${id}" é uma ligação para ` +
              `"${decodeEntities(destino).slice(0, 90)}" e a linha não declara "document.url". ` +
              `Um título só abre o documento quando a linha diz onde ele está.`,
          );
        } else if (decodeEntities(destino) !== String(url)) {
          err(
            `o título do documento de "${id}" abre "${decodeEntities(destino).slice(0, 90)}" e o ` +
              `"document.url" da linha é "${String(url).slice(0, 90)}".`,
          );
        }
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

  /* --- o recorte da linha impressa, na página dessa linha (bloco T2) -------
   *
   * Um recorte é a coisa mais convincente que este sítio publica: uma
   * fotografia da linha impressa, com toda a autoridade de uma fotografia.
   * Mostrado ao lado da linha errada, ou trocado depois da travessia, seria um
   * recibo falso que nenhuma conferência de texto apanha, porque não há texto
   * nenhum a mudar.
   *
   * O que se confere aqui, sobre o HTML construído e os bytes em `dist/`:
   *
   *   · uma imagem de `/recortes/` só aparece na página de uma linha, e só na
   *     da linha que ela prova;
   *   · o `src` é exactamente `/recortes/<id>.webp`, que é o `asset` que a
   *     linha declara, com a cópia própria da regra do nome, para conferir o
   *     livro-razão e não o gabarito;
   *   · o ficheiro foi construído para `dist/` e os seus bytes dão o resumo que
   *     a linha declara;
   *   · uma página não mostra um recorte que a sua linha não tem;
   *   · e uma linha que TEM recorte mostra-o: uma prova que existe e não se vê
   *     é a mesma opacidade que este bloco veio fechar, e é o argumento do
   *     rótulo obrigatório de `source_url.page`, um campo ao lado.
   *
   * A legenda («página N») é conferida pela marca de campo, como qualquer
   * outro campo: `data-linha-campo="document.crop.page"`.
   */
  {
    const recortes = body.querySelectorAll('img[src]').filter((el) =>
      decodeEntities(el.getAttribute('src') ?? '').startsWith('/recortes/'),
    );
    if (recortes.length && !claimDaPagina) {
      err(
        `uma imagem de "/recortes/" numa página que não é a de uma linha. Um recorte é a ` +
          `prova de uma linha, e mostra-se na página dessa linha e em mais lado nenhum.`,
      );
    } else if (claimDaPagina) {
      const recorte = claimDaPagina.document?.crop ?? null;
      if (recortes.length > 1) {
        err(
          `a página de "${claimDaPagina.id}" mostra ${recortes.length} recortes. Uma linha tem ` +
            `um recorte: o da página onde está a frase que o seu excerto transcreve.`,
        );
      }
      if (!recorte && recortes.length) {
        err(
          `a página de "${claimDaPagina.id}" mostra o recorte ` +
            `"${decodeEntities(recortes[0].getAttribute('src'))}" e a linha não tem ` +
            `"document.crop". Uma prova que a linha não guarda não se desenha.`,
        );
      }
      if (recorte && !recortes.length) {
        err(
          `a linha "${claimDaPagina.id}" traz o recorte "${recorte.asset}" e a página não o ` +
            `mostra.\n      Uma prova que existe e não se vê deixa o leitor com a ` +
            `transcrição, que é o que o recorte veio substituir.`,
        );
      }
      for (const img of recortes) {
        const src = decodeEntities(img.getAttribute('src') ?? '');
        /* A cópia própria da regra do nome: um recorte por linha, com o nome
           da linha. Se este portão lesse o `asset` do livro-razão para saber o
           que esperar, conferia que a página copia o campo, e não que o campo
           é o que tem de ser. */
        const esperado = `/recortes/${claimDaPagina.id}.webp`;
        if (src !== esperado) {
          err(
            `a página de "${claimDaPagina.id}" mostra "${src}" e o recorte desta linha é ` +
              `"${esperado}". Um recorte por linha, com o nome da linha.`,
          );
          continue;
        }
        if (!recorte) continue;                 // já dito acima
        if (`/${recorte.asset}` !== esperado) {
          err(
            `a linha "${claimDaPagina.id}" declara o recorte "${recorte.asset}" e o nome de um ` +
              `recorte é "recortes/${claimDaPagina.id}.webp".`,
          );
          continue;
        }
        const ficheiro = path.join(DIST, 'recortes', `${claimDaPagina.id}.webp`);
        if (!fs.existsSync(ficheiro)) {
          err(
            `a página de "${claimDaPagina.id}" mostra "${src}" e não há ficheiro em ` +
              `dist${src}. Uma imagem que a construção não produziu é uma porta que não abre.`,
          );
          continue;
        }
        const resumo = crypto.createHash('sha256').update(fs.readFileSync(ficheiro)).digest('hex');
        if (resumo !== recorte.sha256) {
          err(
            `o recorte de "${claimDaPagina.id}" que foi construído não é o que a linha declara.\n` +
              `      no livro-razão: ${recorte.sha256}\n` +
              `      em dist/:       ${resumo}`,
          );
        }
        recortesConferidos++;
      }
      /* A legenda diz a página do recorte, e diz-la é a única maneira de o
         leitor saber de que página é a imagem que está a ver. */
      if (recorte && !camposRenderizados.has(`${claimDaPagina.id}:document.crop.page`)) {
        err(
          `o recorte de "${claimDaPagina.id}" é da página ${recorte.page} e a página não a ` +
            `diz.\n      Falta a legenda com data-linha-campo="document.crop.page".`,
        );
      }
    }
  }

  /* --- o ficheiro alojado, na página da linha contada sobre ele (bloco T3) --
   *
   * Uma linha que publica uma contagem sobre um ficheiro alojado troca o
   * excerto pelo ficheiro: é ele a prova, e se a página não o der o leitor
   * fica com um número e uma promessa. Por isso a porta é obrigatória onde o
   * campo existe, e proibida onde ele não existe.
   *
   * A regra do nome é COPIADA e não lida: a porta de uma linha alojada é
   * `/<asset>` da PRÓPRIA linha. Uma página de linha que ofereça outro ficheiro
   * de `/dados/` está a dar ao leitor um conjunto que não é o desta conta.
   */
  if (claimDaPagina) {
    const alojado = claimDaPagina.document?.hosted ?? null;
    const portas = body
      .querySelectorAll('a[href]')
      .filter((el) => decodeEntities(el.getAttribute('href') ?? '').startsWith('/dados/'));
    const esperado = alojado ? `/${alojado.asset}` : null;

    for (const a of portas) {
      const destino = decodeEntities(a.getAttribute('href') ?? '');
      if (!alojado) {
        err(
          `a página de "${claimDaPagina.id}" oferece o ficheiro "${destino}" e a linha não tem ` +
            `"document.hosted". Um conjunto de dados que a linha não declara não é a prova ` +
            `desta conta.`,
        );
      } else if (destino !== esperado) {
        err(
          `a página de "${claimDaPagina.id}" oferece "${destino}" e o ficheiro desta linha é ` +
            `"${esperado}". A conta desta linha faz-se sobre o ficheiro que ela declara.`,
        );
      }
    }
    if (alojado) {
      if (!portas.length) {
        err(
          `a linha "${claimDaPagina.id}" é contada sobre "${alojado.asset}" e a página não o ` +
            `oferece.\n      Sem o ficheiro, a contagem é um número com uma promessa: o ` +
            `excerto saiu daqui precisamente porque o ficheiro entrou.`,
        );
      }
      /* A licença e a atribuição são a obrigação que a fonte impõe a quem
         redistribui. Um ficheiro alojado sem elas à vista é uma reutilização
         que este sítio não pode defender, e nenhuma marca de campo apanha uma
         linha que simplesmente não foi escrita. */
      for (const campo of ['asset', 'licence', 'attribution']) {
        if (!camposRenderizados.has(`${claimDaPagina.id}:document.hosted.${campo}`)) {
          err(
            `a linha "${claimDaPagina.id}" aloja "${alojado.asset}" e a página não escreve ` +
              `"document.hosted.${campo}".\n      A licença e a atribuição que a fonte pede ` +
              `publicam-se ao pé do ficheiro, ou o ficheiro não se aloja.`,
          );
        }
      }
      alojadosConferidos++;
    }
  }

  /* --- a página humana de uma série, na página dessa linha (bloco T3) -------
   *
   * O campo existe para ser a porta principal. Uma linha que o tenha e não o
   * mostre deixa o leitor com o pedido a uma API, que é o endereço de uma
   * máquina, e foi por isso que o campo entrou no formato.
   */
  if (claimDaPagina) {
    const humana = claimDaPagina.document?.url ?? null;
    const rendida = camposRenderizados.has(`${claimDaPagina.id}:document.url`);
    if (humana && !rendida) {
      err(
        `a linha "${claimDaPagina.id}" tem a página da série "${humana}" e a página não a ` +
          `mostra.\n      É a porta principal desta linha: sem ela, o leitor fica com o ` +
          `pedido a uma API.`,
      );
    }
    if (humana) paginasDeSerieConferidas++;
  }

  /* --- os ficheiros de que a conta foi feita, e que o sítio não aloja -------
   *
   * O mesmo argumento do bloco acima, do outro lado: uma linha que diz sobre
   * que ficheiros foi calculada tem de o dizer NA PÁGINA, ou o campo é um
   * registo que só quem lê o YAML vê. E a página não pode dizer que a conta foi
   * feita sobre ficheiros que a linha não nomeia.
   */
  if (claimDaPagina) {
    const calc = claimDaPagina.document?.computed_over ?? null;
    const marcados = [...camposRenderizados].filter((k) =>
      k.startsWith(`${claimDaPagina.id}:document.computed_over.`),
    );
    if (calc) {
      const faltam = ['column', 'filter'].filter(
        (campo) => !camposRenderizados.has(`${claimDaPagina.id}:document.computed_over.${campo}`),
      );
      const ficheirosRendidos = calc.files.filter((_, n) =>
        camposRenderizados.has(`${claimDaPagina.id}:document.computed_over.files.${n}.file`),
      ).length;
      if (faltam.length) {
        err(
          `a linha "${claimDaPagina.id}" foi calculada sobre ficheiros que este sítio não ` +
            `aloja e a página não escreve ${faltam.map((f) => `"${f}"`).join(' nem ')}.\n` +
            `      Sem a coluna e o filtro, «calculado sobre» diz onde e não diz o quê.`,
        );
      }
      if (ficheirosRendidos !== calc.files.length) {
        err(
          `a linha "${claimDaPagina.id}" foi calculada sobre ${calc.files.length} ficheiro(s) e ` +
            `a página nomeia ${ficheirosRendidos}. Um ficheiro que entrou na conta e não ` +
            `aparece é uma parte da soma que o leitor não pode pedir.`,
        );
      }

      /* A porta para a cópia arquivada, conferida contra o campo, nos dois
         sentidos. É a mesma disciplina do ficheiro alojado, acima: uma porta
         que a linha não declara é uma porta para um ficheiro que este sítio não
         diz ter contado, e um campo que abre porta e não a mostra é um registo
         que só quem lê o YAML vê. `digest_match` falso não abre porta: a
         captura existe e não é a dos bytes contados. */
      const arquivadasEsperadas = calc.files
        .filter((f) => f.archived?.digest_match === true)
        .map((f) => f.archived.url);
      const portasArquivo = body
        .querySelectorAll('a[href]')
        .map((el) => decodeEntities(el.getAttribute('href') ?? ''))
        .filter((h) => h.startsWith('https://web.archive.org/'));
      for (const destino of portasArquivo) {
        if (!arquivadasEsperadas.includes(destino)) {
          err(
            `a página de "${claimDaPagina.id}" abre a porta "${destino}" e nenhum ficheiro ` +
              `desta linha declara essa cópia arquivada com o resumo a bater certo.\n` +
              `      Uma captura só é porta quando "archived.digest_match" é verdadeiro: sem ` +
              `isso, é uma porta para outro ficheiro.`,
          );
        }
      }
      for (const esperada of arquivadasEsperadas) {
        if (!portasArquivo.includes(esperada)) {
          err(
            `a linha "${claimDaPagina.id}" tem a cópia arquivada "${esperada}" com o resumo a ` +
              `bater certo e a página não a oferece.\n      É a única maneira de o leitor ` +
              `pedir os bytes que foram contados: o publicador substitui o ficheiro todos os ` +
              `dias e não arquiva o anterior.`,
          );
        }
      }
      arquivadasConferidas += arquivadasEsperadas.length;

      calculadosConferidos++;
    } else if (marcados.length) {
      err(
        `a página de "${claimDaPagina.id}" escreve "calculado sobre" e a linha não tem ` +
          `"document.computed_over". Uma conta que a linha não regista não se desenha.`,
      );
    }
  }

  /* --- as reconferências de uma linha, na página dessa linha ---------------
   *
   * É a origem 6 aplicada a uma lista: ali um campo da linha, aqui uma entrada
   * da lista de reconferências, com o seu índice, os seus atributos crus e os
   * seus dois rótulos. Os campos escritos (a data, e o valor encontrado numa
   * entrada `diverge`) já passaram pela conferência de cima, marcados
   * `verifications.<n>.<campo>`; o que se confere aqui é o que a marca de campo
   * não pode conferir: que a entrada rendida é a entrada que ela diz ser, que
   * os rótulos são os que aquele `by` e aquele `result` escrevem, e que o
   * conjunto rendido são exactamente as duas mais recentes.
   */
  {
    const rendidas = body.querySelectorAll('[data-linha-verificacao]');
    if (rendidas.length && !claimDaPagina) {
      err(
        `data-linha-verificacao numa página que não é a de uma linha. Uma reconferência ` +
          `mostra-se na página da linha que foi relida, e em mais lado nenhum.`,
      );
    } else if (claimDaPagina) {
      const lingua = linguaPagina === 'en' ? 'en' : 'pt';
      const ordenadas = verificacoesOrdenadasGate(claimDaPagina);
      const esperadas = ordenadas.slice(0, VERIFICACOES_MOSTRADAS_GATE);
      const lidos = rendidas.map((el) => el.getAttribute('data-linha-verificacao'));

      /* O conjunto, e a ordem. Uma página que mostre a penúltima no lugar da
         última diz ao leitor que a linha foi relida há mais tempo do que foi,
         ou há menos; as duas são falsas, e nenhuma marca de campo as apanha. */
      const esperados = esperadas.map((e) => String(e.n));
      if (lidos.join(',') !== esperados.join(',')) {
        err(
          `a página de "${claimDaPagina.id}" rende as reconferências ` +
            `[${lidos.join(', ') || '(nenhuma)'}] e o livro-razão manda render ` +
            `[${esperados.join(', ') || '(nenhuma)'}], da mais recente para a mais antiga.\n` +
            `      A linha tem ${ordenadas.length} entrada(s); a página mostra as ` +
            `${VERIFICACOES_MOSTRADAS_GATE} mais recentes, nem uma a mais, nem a mais velha no ` +
            `lugar da mais nova.`,
        );
      }

      for (const el of rendidas) {
        const cru = el.getAttribute('data-linha-verificacao');
        const n = Number(cru);
        const entrada = (claimDaPagina.verifications ?? [])[n];
        if (!Number.isInteger(n) || !entrada) {
          err(
            `a página de "${claimDaPagina.id}" rende a reconferência "${cru}", que a linha não ` +
              `tem. O índice é a posição da entrada na lista do livro-razão.`,
          );
          continue;
        }
        for (const [attr, campo] of [['data-por', 'by'], ['data-resultado', 'result']]) {
          const lido = el.getAttribute(attr);
          if (lido !== String(entrada[campo])) {
            err(
              `a reconferência ${n} de "${claimDaPagina.id}" leva ${attr}="${lido ?? '(nada)'}" ` +
                `e o livro-razão diz "${entrada[campo]}".`,
            );
          }
        }
        const marcaPor = el.querySelector('[data-linha-verificacao-por]');
        const esperadoPor = ROTULO_DE_QUEM_RELEU[lingua][entrada.by];
        const lidoPor = marcaPor ? normalizeWhitespace(textoTranscrito(marcaPor)) : null;
        if (!esperadoPor) {
          err(
            `a reconferência ${n} de "${claimDaPagina.id}" diz by="${entrada.by}", que o portão ` +
              `não sabe escrever.`,
          );
        } else if (lidoPor !== esperadoPor) {
          err(
            `a reconferência ${n} de "${claimDaPagina.id}" escreve quem releu como ` +
              `"${lidoPor ?? '(nada)'}" e o registo diz "${entrada.by}", que se escreve ` +
              `"${esperadoPor}".`,
          );
        }
        const marcaResultado = el.querySelector('[data-linha-verificacao-resultado]');
        const base = ROTULO_DO_RESULTADO[lingua][entrada.result];
        /* Numa divergência o rótulo leva o valor encontrado: o leitor tem de
           ver o que a fonte imprimiu, e não só que imprimiu outra coisa. */
        const esperadoResultado =
          entrada.result === 'diverge' ? `${base} ${entrada.found}` : base;
        const lidoResultado = marcaResultado
          ? normalizeWhitespace(textoTranscrito(marcaResultado))
          : null;
        if (!base) {
          err(
            `a reconferência ${n} de "${claimDaPagina.id}" diz result="${entrada.result}", que o ` +
              `portão não sabe escrever.`,
          );
        } else if (lidoResultado !== normalizeWhitespace(esperadoResultado)) {
          err(
            `a reconferência ${n} de "${claimDaPagina.id}" escreve o resultado como ` +
              `"${lidoResultado ?? '(nada)'}" e o registo diz "${entrada.result}", que se escreve ` +
              `"${esperadoResultado}".`,
          );
        }
      }
    }
  }

  /* --- o registo de conteúdo, na página de leitura (origem 9) -------------
     As oito marcas saem do varrimento dos algarismos e do da ortografia
     porque foram TODAS comparadas em `verificaTexto()`, carácter a carácter,
     contra um ficheiro fixado por resumo. Aqui fica a outra metade da regra: a
     marca **só vale nesta rota**. Noutra página seria uma segunda porta para
     pôr texto de um registo em prosa corrente, que é a mesma disciplina das
     origens 6 e 8.

     `data-registo-posicao` ENTROU A 03.09.2026 (F1.9a, segunda passagem,
     Major 8 da leitura a frio do Codex): a frase «Secção n de N», irmã de
     cada título de nível 2 e nunca filha dele, que dá ao título um nome
     acessível com a posição lá dentro. O texto tem algarismos (o «n» e o
     «N»), e por isso precisa da mesma dispensa que as outras sete; a
     verificação que a justifica é a de `verificaTexto()`, mais abaixo. */
  for (const el of body.querySelectorAll(
    '[data-registo-edicao], [data-registo-bloco], [data-registo-unidade], [data-registo], ' +
      '[data-registo-linha], [data-registo-conta], [data-registo-indice], [data-registo-posicao]',
  )) {
    aRemover.push(el);
    if (rota?.key !== 'texto') {
      const qual = ['data-registo-edicao', 'data-registo-bloco', 'data-registo-unidade',
        'data-registo', 'data-registo-linha', 'data-registo-conta', 'data-registo-indice',
        'data-registo-posicao']
        .find((m) => m in (el.attributes ?? {}));
      err(
        `${qual}="${decodeEntities(el.getAttribute(qual) ?? '')}" numa página que não é a de ` +
          `leitura de uma edição. Esta marca é a nona origem, e é do registo de conteúdo na página ` +
          `que o transcreve.\n` +
          `      Noutra página: um valor entra por <Claim id="…"/>, e uma citação por data-verbatim.`,
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
    /**
     * UM CAMPO QUE É UMA DATA ESCREVE-SE NA FORMA DA CASA (bloco F1.4,
     * 04.09.2026).
     *
     * O registo guarda as datas em ISO, como o livro-razão guarda as suas, e a
     * superfície escreve-as dd.mm.aaaa pela regra única da §1.91. A conferência
     * não afrouxa: o portão recompõe a data por conta própria e continua a
     * comparar carácter a carácter, e por isso passa a provar duas coisas onde
     * provava uma: que o texto é o do registo, e que está na forma da casa.
     *
     * SÓ QUANDO O CAMPO É A DATA INTEIRA. Uma data dentro de uma frase do
     * registo («A direção leu a pergunta a 2026-08-18…») fica como o registo a
     * escreveu: a casa não edita o que transcreve.
     */
    const esperadoNaPagina = /^\d{4}-\d{2}-\d{2}$/.test(esperado)
      ? dataDaCasaGate(esperado)
      : esperado;
    if (renderizado !== esperadoNaPagina) {
      err(
        `o campo "${chave}" não foi transcrito fielmente do registo da agenda.\n` +
          `      no registo:  ${esperado.slice(0, 150)}` +
          (esperadoNaPagina === esperado ? '' : ` · na forma da casa: ${esperadoNaPagina}`) +
          `\n      renderizado: ${renderizado.slice(0, 150)}`,
      );
    }

    /**
     * ---------------------------------------------------------------------
     * A PROSA DA AGENDA NÃO REPETE UMA MEDIÇÃO
     * ---------------------------------------------------------------------
     *
     * A origem 8 provava que o texto é o do registo; não provava que o registo
     * não trouxesse, em prosa corrente, um valor que tem linha e selo noutro
     * sítio da mesma página (revisão cruzada, #1; F11, F13). «A linha publica
     * 17,6» é uma medição sem selo, e o facto de ter atravessado fielmente não
     * lhe dá proveniência.
     *
     * O que se recusa é ESTREITO e é dito em voz alta: um número da prosa cuja
     * sequência de algarismos seja a de um VALOR do livro-razão. A mesma
     * normalização da origem 1 (`digitsOf`), para que a mesma medição seja a
     * mesma coisa dos dois lados.
     */
    if (!('data-claim' in (el.attributes ?? {}))) {
      for (const achado of valoresDoLivroEmProsa(renderizado, chave, claimsDaPagina)) {
        err(
          `a prosa da agenda repete um valor do livro-razão: "${achado.token}" é o valor da ` +
            `linha "${achado.id}".\n      campo: ${chave}\n` +
            `      Uma medição chega ao leitor por <Claim id="…"/>, com o selo que abre a sua ` +
            `linha. Um critério mostra as suas linhas em \`criterios[].linhas\`; a nota diz o ` +
            `que elas não dizem, e não as repete.`,
        );
      }
    }

    const [alvo] = chave.split('.');
    if (!agendaRenderizada.has(rel)) {
      agendaRenderizada.set(rel, {
        itens: new Set(), eventos: new Set(), campos: new Set(), lang: linguaPagina,
      });
    }
    const visto = agendaRenderizada.get(rel);
    visto.campos.add(chave);
    if (alvo.startsWith('evento:')) visto.eventos.add(alvo.slice('evento:'.length));
    else visto.itens.add(alvo);
  }

  /**
   * ---------------------------------------------------------------------
   * CADA ITEM, INTEIRO, E DEBAIXO DA SUA SECÇÃO
   * ---------------------------------------------------------------------
   *
   * Renderizar UM campo de um item dava o item por presente: apagar o bloco do
   * histórico inteiro deixava a contagem certa e passava (revisão cruzada, #5).
   * E a secção era calculada do REGISTO, não do DOM: um item posto debaixo do
   * cabeçalho errado passava, desde que o seu rótulo de estado estivesse certo.
   *
   * Estas duas conferências leem a página: os campos que cada item rendeu, e a
   * secção onde o item está mesmo.
   */
  if (rota?.key === 'agenda' && AGENDA_REGISTO) {
    const lingua = linguaPagina ?? 'pt';
    const rotulos = ROTULO_DO_ESTADO[lingua];
    const chavesDe = (no) =>
      new Set(no.querySelectorAll('[data-agenda]').map((e) => e.getAttribute('data-agenda')));

    /* As quatro secções, e o cabeçalho de cada uma. A marca dizia o estado e a
       frase visível podia dizer outro: trocar «Em curso» por «A seguir» no
       cabeçalho passava (revisão cruzada 2, #5). */
    const seccoes = body.querySelectorAll('[data-agenda-seccao]');
    const estadosVistos = new Set();
    for (const seccao of seccoes) {
      const estado = seccao.getAttribute('data-agenda-seccao');
      estadosVistos.add(estado);
      const esperado = rotulos[estado];
      if (!esperado) {
        err(`data-agenda-seccao="${estado}" não é um dos quatro estados da agenda.`);
        continue;
      }
      const cabeca = seccao.querySelector('h2');
      const lido = cabeca ? textoTranscrito(cabeca) : null;
      if (lido !== esperado) {
        err(
          `a secção "${estado}" tem o cabeçalho "${lido ?? '(nenhum)'}" e o estado que ela ` +
            `guarda escreve-se "${esperado}".\n      O cabeçalho é o que o leitor lê como ` +
            `estado: a marca e a frase dizem a mesma coisa, ou a página mente a uma delas.`,
        );
      }
    }
    for (const estado of Object.keys(rotulos)) {
      if (!estadosVistos.has(estado)) {
        err(`a página da agenda não tem secção para o estado "${estado}".`);
      }
    }

    const artigos = body.querySelectorAll('[data-agenda-item]');
    const itensRendidos = new Set();
    for (const artigo of artigos) {
      const id = artigo.getAttribute('data-agenda-item');
      const item = ITENS_DA_AGENDA.get(id);
      if (!item) {
        err(`a página rende um item "${id}" que não está em src/data/agenda.json.`);
        continue;
      }
      itensRendidos.add(id);

      /* A secção, lida a subir no DOM. */
      let seccao = null;
      for (let no = artigo.parentNode; no; no = no.parentNode) {
        const estadoDaSeccao = (no.attributes ?? {})['data-agenda-seccao'];
        if (estadoDaSeccao) {
          seccao = estadoDaSeccao;
          break;
        }
      }
      if (seccao === null) {
        err(`o item "${id}" não está dentro de nenhuma secção de estado da agenda.`);
      } else if (seccao !== item.estado) {
        err(
          `o item "${id}" está na secção "${seccao}" e o registo põe-no em "${item.estado}".\n` +
            `      A secção é lida do DOM, não do registo: um item debaixo do cabeçalho errado ` +
            `com o rótulo certo é exactamente o defeito que isto fecha.`,
        );
      }

      /* Os critérios: um elemento por critério, e cada um com o que é SEU. */
      const elementosDeCriterio = artigo.querySelectorAll('[data-agenda-criterio]');
      const esperadosCriterios = (item.criterios ?? []).length;
      if (elementosDeCriterio.length !== esperadosCriterios) {
        err(
          `o item "${id}" rende ${elementosDeCriterio.length} critério(s) e o registo tem ` +
            `${esperadosCriterios}.`,
        );
      }
      for (const [n, criterio] of (item.criterios ?? []).entries()) {
        const elemento = elementosDeCriterio.find(
          (e) => e.getAttribute('data-agenda-criterio') === String(n),
        );
        if (!elemento) {
          err(`o item "${id}" não rende o critério ${n} do registo.`);
          continue;
        }
        const dentro = chavesDe(elemento);
        for (const chave of camposDoCriterio(item, n, criterio)) {
          if (!dentro.has(chave)) {
            err(
              `o critério ${n} de "${id}" não rende "${chave}", que o registo tem.\n` +
                `      A conferência é DENTRO do critério: um critério esvaziado com a marca ` +
                `intacta contava como presente.`,
            );
          }
        }
      }

      /* O estado do registo prévio: a marca contra o registo, e a frase visível
         contra a cópia do portão. */
      if (item.registo_previo_estado) {
        const marca = artigo.querySelector('[data-agenda-registo-previo]');
        const lido = marca?.getAttribute('data-agenda-registo-previo') ?? null;
        if (lido !== item.registo_previo_estado) {
          err(
            `o item "${id}" rende o registo prévio como "${lido ?? '(nada)'}" e o registo diz ` +
              `"${item.registo_previo_estado}".`,
          );
        } else {
          const esperado = ROTULO_DO_REGISTO_PREVIO[lingua][item.registo_previo_estado];
          if (!textoTranscrito(marca).startsWith(esperado)) {
            err(
              `o item "${id}" diz o registo prévio com "${textoTranscrito(marca).slice(0, 60)}" ` +
                `e o estado "${item.registo_previo_estado}" escreve-se "${esperado}".\n` +
                `      Um registo por selar anunciado como selado é a promessa que a página não ` +
                `pode fazer.`,
            );
          }
        }
      }

      /* O histórico: uma entrada por entrada, com a sua transição e o seu motivo. */
      const entradas = artigo.querySelectorAll('[data-agenda-historico]');
      const esperadasEntradas = (item.historico ?? []).length;
      if (entradas.length !== esperadasEntradas) {
        err(
          `o item "${id}" rende ${entradas.length} entrada(s) de histórico e o registo tem ` +
            `${esperadasEntradas}.`,
        );
      }
      for (const [n, entrada] of (item.historico ?? []).entries()) {
        const elemento = entradas.find(
          (e) => e.getAttribute('data-agenda-historico') === String(n),
        );
        if (!elemento) {
          err(`o item "${id}" não rende a entrada ${n} do histórico.`);
          continue;
        }
        const dentro = chavesDe(elemento);
        for (const chave of camposDaEntrada(item, n, entrada)) {
          if (!dentro.has(chave)) {
            err(`a entrada ${n} do histórico de "${id}" não rende "${chave}".`);
          }
        }
        const marca = elemento.querySelector('[data-agenda-transicao]');
        const esperadaMarca = `${entrada.de ?? ''}>${entrada.para}`;
        const lidaMarca = marca?.getAttribute('data-agenda-transicao') ?? null;
        if (lidaMarca !== esperadaMarca) {
          err(
            `a entrada ${n} do histórico de "${id}" rende a transição "${lidaMarca ?? '(nada)'}" ` +
              `e o registo diz "${esperadaMarca}".`,
          );
          continue;
        }
        const esperadaFrase = !entrada.de
          ? `${PREFIXO_DA_TRANSICAO[lingua]} ${rotulos[entrada.para]}`
          : entrada.de === entrada.para
            ? `${PREFIXO_DE_MANUTENCAO[lingua]} ${rotulos[entrada.para]}`
            : `${rotulos[entrada.de]} → ${rotulos[entrada.para]}`;
        const lidaFrase = normalizeWhitespace(textoTranscrito(marca));
        if (lidaFrase !== esperadaFrase) {
          err(
            `a entrada ${n} do histórico de "${id}" escreve a transição "${lidaFrase}" e o ` +
              `registo leva-a de "${entrada.de ?? '(nada)'}" a "${entrada.para}", que se ` +
              `escreve "${esperadaFrase}".`,
          );
        }
      }

      /* E cada campo que a página existe para mostrar. */
      const rendidos = chavesDe(artigo);
      for (const chave of camposObrigatoriosDoItem(item)) {
        if (!rendidos.has(chave)) {
          err(
            `o item "${id}" não rende "${chave}", que o registo tem.\n` +
              `      A página mostra o item inteiro, ou o que ela mostra deixa de ser o registo.`,
          );
        }
      }
    }

    for (const id of ITENS_DA_AGENDA.keys()) {
      if (!itensRendidos.has(id)) {
        err(`o item "${id}" está no registo e a página não o rende.`);
      }
    }

    /* A razão de um acontecimento não ter data: a marca contra o registo, e a
       frase visível contra a cópia do portão. Uma fonte que não respondeu e uma
       fonte que não publica calendário são factos diferentes, e trocar um pelo
       outro passava (revisão cruzada 2, #5). */
    for (const marca of body.querySelectorAll('[data-agenda-sem-data]')) {
      const motivo = marca.getAttribute('data-agenda-sem-data');
      const marcador = marca.querySelector('[data-agenda]');
      const chave = marcador?.getAttribute('data-agenda') ?? '';
      const ident = chave.startsWith('evento:') ? chave.slice('evento:'.length).split('.')[0] : null;
      const evento = ident ? EVENTOS_DO_CALENDARIO.get(ident) : null;
      if (!evento) {
        err(`um acontecimento sem data rende a marca "${motivo}" e não se sabe qual é.`);
        continue;
      }
      if (motivo !== evento.motivo_sem_data) {
        err(
          `o acontecimento "${ident}" rende o motivo "${motivo}" e o registo diz ` +
            `"${evento.motivo_sem_data}".`,
        );
        continue;
      }
      const esperado = MOTIVO_SEM_DATA_RENDIDO[lingua][motivo];
      if (!esperado) {
        err(`o acontecimento "${ident}" traz motivo_sem_data "${motivo}", que não é um dos dois.`);
        continue;
      }
      if (!textoTranscrito(marca).endsWith(esperado)) {
        err(
          `o acontecimento "${ident}" diz "${textoTranscrito(marca).slice(0, 80)}" e o motivo ` +
            `"${motivo}" escreve-se "${esperado}".\n      Dizer que uma fonte não publica data ` +
            `quando ela não foi lida é afirmar mais do que se sabe.`,
        );
      }
    }
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
    const base = baseDeResolucao(rel, caminho);
    /* A âncora da porta, guardada para o fim: é contra os `id` do destino que
       ela se confere, e os `id` de todas as páginas só existem quando o
       varrimento acabar. */
    const daPorta = resolveLigacao(base, destino);
    if (daPorta?.ancora) {
      ancorasDaProva.push({ rel, chave, destino, caminho: daPorta.caminho, ancora: daPorta.ancora });
    }
    let temPorta = false;
    if (dentroDeSvg(el)) {
      const raiz = raizDoInstrumento(el);
      for (const legenda of raiz?.querySelectorAll?.('[data-legenda-prova]') ?? []) {
        if (temPortaPara(legenda, destino, base)) temPorta = true;
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
          const href = decodeEntities(no.getAttribute('href') ?? '');
          /* Resolvida, e não carácter a carácter: uma âncora na própria página
             («#estado-em_curso») e o caminho inteiro («/agenda#estado-em_curso»)
             são a mesma porta (§10, v2). */
          temPorta = href === destino || mesmaPorta(base, href, destino);
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

    ocorrenciasDaProva.push({ rel, chave, texto: renderizado });
  }

  /* A lista por extenso da mesma contagem. Não é uma origem nova: é a MESMA
     chave, contada de outra maneira, e por isso o elemento não sai do
     varrimento de prosa — o que ele tem são nomes de medida e palavras de
     gramática, sem um algarismo. */
  for (const el of body.querySelectorAll('[data-prova-lista]')) {
    const chave = el.getAttribute('data-prova-lista');

    if (!(chave in PROVA)) {
      err(
        `data-prova-lista="${chave}" não é uma chave de src/lib/prova.mjs. ` +
          `Chaves: ${Object.keys(PROVA).join(', ')}.`,
      );
      continue;
    }

    const lingua = linguaPagina ?? 'pt';
    const separadores = SEPARADORES_DA_LISTA[lingua];
    if (!separadores) {
      err(
        `data-prova-lista="${chave}" está numa página da edição "${lingua}" e o portão não ` +
          `declara os separadores de lista dessa edição.\n` +
          `      Uma lista que o portão não sabe partir é uma lista que ele não confere.`,
      );
      continue;
    }

    const renderizado = textoTranscrito(el);
    const itens = renderizado
      .split(new RegExp(separadores.source, 'g'))
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (itens.length === 0) {
      err(
        `data-prova-lista="${chave}" não rende nome nenhum ("${renderizado.slice(0, 60)}").\n` +
          `      Uma lista vazia não é uma contagem: um estado sem itens diz-se por palavras, ` +
          `sem marca.`,
      );
      continue;
    }

    ocorrenciasDaLista.push({ rel, chave, itens: itens.length, texto: renderizado });
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

  /**
   * ---------------------------------------------------------------------
   * UMA AUSÊNCIA NUNCA SE DESENHA (v2, IDENTIDADE.md §6)
   * ---------------------------------------------------------------------
   *
   * «A única língua pública para "esta prova não está aqui" é o marcador, com o
   * seu motivo tipado e o caminho para a correção. Uma página construída que
   * renda `data-exemplo`, ou qualquer estado "exemplo" ou "protótipo", é
   * recusada pelo portão.» As três direções de desenho renderizaram `EXEMPLO` e
   * `PROTÓTIPO` ao lado de `[a verificar]`, e a crítica cruzada apanhou as três:
   * o que a v2 acrescenta é que deixa de ser preciso alguém as apanhar.
   *
   * TRÊS SUPERFÍCIES, porque um espécime pode entrar por qualquer uma:
   *
   *   a marca      `data-exemplo`, `data-prototipo`, ou uma marca qualquer cujo
   *                VALOR seja um destes estados (`data-estado="exemplo"`);
   *   a classe     `exemplo`, `exemplo-k`, `prototipo-nota`, que é como os
   *                protótipos as escreveram;
   *   o texto      um rótulo que DIZ o estado: «Exemplo», «Exemplo:», «Protótipo
   *                ·», e não a palavra no meio de uma frase.
   *
   * O QUE NÃO FECHA, E É METADE DA REGRA. A palavra «exemplo» é uma palavra
   * portuguesa. «uma fonte que muda de endereço, por exemplo» é prosa legítima
   * do Método, e um documento transcrito que comece por «Exemplo da falta de
   * civismo…» é o que a fonte escreveu. Por isso a conferência do texto só olha
   * para rótulos (a palavra no PRINCÍPIO, seguida de fim, de dois pontos ou do
   * separador da casa) e nunca dentro de uma citação: `blockquote`, `q`, `cite`,
   * `data-verbatim`, um campo transcrito de uma linha, ou qualquer descendente
   * deles. Reescrever a prova para lhe tirar uma palavra seria pior do que o
   * defeito que isto fecha.
   */
  for (const el of body.querySelectorAll('*')) {
    const attrs = el.attributes ?? {};
    for (const [nome, valor] of Object.entries(attrs)) {
      const n = nome.toLowerCase();
      const raiz = n.startsWith('data-') ? n.slice('data-'.length).split('-')[0] : null;
      if (raiz && ESTADOS_DE_ESPECIME.has(raiz)) {
        err(
          `a página rende a marca "${nome}", que declara um estado de espécime.\n` +
            `      IDENTIDADE.md §6: uma ausência de dados nunca se desenha, nem como caixa de ` +
            `exemplo, nem como espécime, nem como nota de protótipo.\n` +
            `      A única língua pública para «esta prova não está aqui» é «${POR_VERIFICAR}», ` +
            `com o seu motivo tipado e o caminho para a correção.`,
        );
        continue;
      }
      if (n.startsWith('data-') && ESTADOS_DE_ESPECIME.has(normalizaEstado(valor))) {
        err(
          `a marca "${nome}" desta página vale "${valor}", que é um estado de espécime.\n` +
            `      IDENTIDADE.md §6: uma ausência de dados nunca se desenha. O que falta diz-se ` +
            `com «${POR_VERIFICAR}», e mais nada.`,
        );
      }
    }

    for (const classe of String(el.getAttribute('class') ?? '').trim().split(/\s+/)) {
      if (!classe) continue;
      if (ESTADOS_DE_ESPECIME.has(normalizaEstado(classe.split('-')[0]))) {
        err(
          `a página rende a classe "${classe}", que desenha um estado de espécime.\n` +
            `      IDENTIDADE.md §6: nem caixa de exemplo, nem espécime, nem nota de protótipo. ` +
            `O que falta leva «${POR_VERIFICAR}».`,
        );
        break;
      }
    }

    /* O texto: só um rótulo, e nunca dentro de uma citação. */
    if (el.childNodes?.some?.((n) => n.nodeType === NodeType.ELEMENT_NODE)) continue;
    if (dentroDeCitacao(el)) continue;
    const rotulo = normalizeWhitespace(decodeEntities(textoDe(el)));
    const m = rotulo.match(/^([\p{L}]+)\s*(?:[:·]|$)/u);
    if (m && ESTADOS_DE_ESPECIME.has(normalizaEstado(m[1]))) {
      err(
        `a página escreve o rótulo "${rotulo.slice(0, 60)}", que anuncia um estado de espécime.\n` +
          `      IDENTIDADE.md §6: uma ausência de dados nunca se desenha, nem como caixa de ` +
          `exemplo, nem como espécime, nem como nota de protótipo.\n` +
          `      Diga o que falta com «${POR_VERIFICAR}» e o seu motivo, ou não desenhe o lugar.`,
      );
    }
  }

  for (const el of body.querySelectorAll('[data-nonledger]')) {
    const motivo = el.getAttribute('data-nonledger');
    if (!CONTEXTOS.has(motivo)) {
      err(
        `data-nonledger="${motivo}" não é um motivo declarado. ` +
          `Motivos aceites: ${[...CONTEXTOS].join(', ')} (ver ledger/allowlist.yml).`,
      );
    } else if (/\d/.test(textoDe(el, { semEstilo: true }))) {
      /* SÓ CONTA QUANDO HÁ ALGARISMO PARA DISPENSAR (segunda passagem,
         03.09.2026). A primeira forma contava um uso sempre que o motivo era
         rendido, e a leitura a frio mostrou o buraco: uma marca inerte sobre
         markup sem números punha o contador acima de zero e a excepção passava
         a parecer viva sem dispensar coisa nenhuma. É precisamente a classe de
         defeito que esta régua existe para apanhar, e ela era cega a si própria.
         O que conta um uso é o motivo a fazer o seu trabalho: haver um algarismo
         no elemento que ele isenta. */
      usou(USOS.contextos, motivo);
    }
    /**
     * `proveniencia` deixa de ser uma dispensa e passa a ser uma comparação.
     *
     * O motivo declarado diz que a etiqueta do selo é «gerada a partir do
     * próprio livro-razão», e o portão acreditava nessa frase: qualquer prosa
     * embrulhada nela escapava ao varrimento de algarismos E ao da ortografia
     * (revisão cruzada, #8). O conjunto de rendições legítimas é finito e
     * calcula-se do registo dos trabalhos; o que não estiver nele fecha o
     * portão. Ver PROVENIENCIAS_ACEITES.
     */
    if (motivo === 'proveniencia') {
      const lido = normalizeWhitespace(textoTranscrito(el));
      /* A porta de um selo pode ser uma ÂNCORA na própria página: é o caso do
         selo ao lado do valor de cabeça, na página da sua própria linha, que
         abre o bloco da prova em vez de recarregar a página onde já se está
         (IDENTIDADE.md §5.3 e §10, v2; `design/DECISAO.md`, «abertura do
         recibo»). O fragmento não muda de que linha o selo é porta, e é isso
         que esta comparação verifica. */
      const porta = decodeEntities(el.getAttribute('href') ?? '').split('#')[0];
      const alvo = LINHA_POR_PORTA.get(porta);
      if (alvo) {
        const selo = seloDaLinha(alvo.id, alvo.lang);
        const declarada = el.getAttribute('data-selo-etiqueta');

        /* (1) A etiqueta é declarada. Sem o atributo não há o que comparar, e
           o selo volta a ser uma marca em que se acredita. */
        if (declarada === null || declarada === undefined) {
          err(
            `o selo que abre a linha "${alvo.id}" não declara a sua etiqueta.\n` +
              `      esperava-se data-selo-etiqueta="${selo.etiqueta}".\n` +
              `      Desde a v2 a etiqueta do estudo saiu do texto visível (IDENTIDADE.md §5.5) e ` +
              `passou a viver no atributo, no title e no texto oculto. É o atributo que o portão ` +
              `compara: sem ele, a amarra da §1.42 deixa de existir.`,
          );
        } else if (normalizeWhitespace(decodeEntities(declarada)) !== selo.etiqueta) {
          /* (2) E é a etiqueta DAQUELA linha, e não uma legítima qualquer. */
          err(
            `a etiqueta declarada no selo que abre a linha "${alvo.id}" não é a etiqueta dessa linha.\n` +
              `      no registo:  ${selo.etiqueta}\n` +
              `      declarada:   ${normalizeWhitespace(decodeEntities(declarada))}\n` +
              `      A etiqueta diz o trabalho DAQUELA linha e «calculado» quando aquela linha é ` +
              `calculada. Uma etiqueta legítima de outro trabalho é uma proveniência falsa.`,
          );
        }

        /* (3) À vista, o selo escreve a palavra da edição e mais nada, e o
           marcador, quando aquela linha tem proveniência por confirmar. */
        const visivel = textoVisivel(el);
        if (visivel !== selo.visivel) {
          err(
            `o selo que abre a linha "${alvo.id}" não escreve a palavra desta edição.\n` +
              `      à vista, esperava-se: ${selo.visivel}\n` +
              `      à vista, está:        ${visivel}\n` +
              `      O selo escreve «${selo.palavra}» (IDENTIDADE.md §5.4), sublinhado, e o ` +
              `marcador só quando falta um campo. Prosa dentro do selo é uma segunda língua para ` +
              `a mesma porta.`,
          );
        }

        /* (4) E tudo, com o oculto: a marca dispensa este elemento do
           varrimento dos algarismos e do da ortografia, e uma dispensa sem
           comparação é um buraco. */
        if (lido !== selo.inteiro) {
          err(
            `o texto do selo que abre a linha "${alvo.id}" não é o que o registo escreve.\n` +
              `      no registo:  ${selo.inteiro}\n` +
              `      renderizado: ${lido}\n` +
              `      Conta o texto oculto: é ele que um leitor de ecrã ouve, e é dentro dele que ` +
              `prosa qualquer escaparia ao varrimento inteiro.`,
          );
        }
      } else if (!PROVENIENCIAS_ACEITES.has(lido)) {
        err(
          `data-nonledger="proveniencia" sem porta para uma linha e com texto que a etiqueta ` +
            `não sabe escrever: "${lido.slice(0, 120)}".\n` +
            `      Fora de um selo, esta marca só nomeia um trabalho do arquivo. Prosa embrulhada ` +
            `nela escapava ao varrimento inteiro.`,
        );
      }
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
for (const { rel, base, href } of ligacoesInternas) {
  const resolvido = resolveLigacao(base, href);
  if (!resolvido) {
    erros.push({ rel, msg: `a ligação interna "${href}" não é um endereço que se possa resolver.` });
    continue;
  }
  ligacoesConferidas++;
  if (!href.startsWith('/') && !href.startsWith('#')) ligacoesRelativas++;

  if (!existeConstruido(resolvido.caminho)) {
    erros.push({
      rel,
      msg:
        `a ligação interna "${href}" não corresponde a nada construído em dist/` +
        (href.startsWith('/') ? '' : ` (resolvida contra "${base}" dá "${resolvido.caminho}")`) +
        `.\n      Uma porta que não abre é pior do que não haver porta.`,
    });
    continue;
  }

  /**
   * A âncora. Uma ligação que aponta para uma divisão que não existe leva o
   * leitor ao topo de uma página que não é a que lhe foi prometida, e não dá
   * erro nenhum: é a maneira mais silenciosa de uma porta não abrir.
   */
  if (!resolvido.ancora) continue;
  const ids = idsPorPagina.get(normalizaCaminho(resolvido.caminho));
  if (!ids) continue; // o destino não é uma página construída (um ficheiro de dados)
  ancorasConferidas++;
  if (!ids.has(resolvido.ancora)) {
    erros.push({
      rel,
      msg:
        `a ligação interna "${href}" aponta para a âncora "#${resolvido.ancora}", que não existe ` +
        `em "${normalizaCaminho(resolvido.caminho)}".\n` +
        `      Uma porta que abre a página errada, ou o topo dela, é uma porta que não abre.`,
    });
  }
}

/**
 * ---------------------------------------------------------------------------
 * OS DOIS MANIFESTOS, CONFERIDOS CAMPO A CAMPO (28.08.2026)
 * ---------------------------------------------------------------------------
 *
 * Corre uma vez, sobre o que foi construído, e não por página. O que ele
 * compara está escrito ao lado de `MANIFESTOS`, e a razão de existir é a mesma
 * do bloco dos cartões de partilha: o manifesto é a superfície do sítio num
 * sítio onde não há gabarito nem varrimento, e um ficheiro assim fica errado
 * sem ninguém dar por isso.
 *
 * E COMEÇA PELO PAPEL, porque o resto depende dele. Duas cores do sítio saem
 * hoje de `tokens.css` para dentro de ficheiros que o CSS não alcança — os
 * manifestos e a etiqueta `theme-color` —, e `site.config.mjs` guarda-as em
 * cadeia. Não é uma segunda fonte de verdade enquanto alguém confere que as
 * duas dizem a mesma coisa; é o que esta primeira conferência faz.
 */
{
  const rel = 'src/styles/tokens.css';
  const cru = fs.readFileSync(path.join(ROOT, 'src', 'styles', 'tokens.css'), 'utf8');
  const papel = (dentro) => {
    const m = /--paper:\s*(#[0-9a-fA-F]{6})/.exec(dentro);
    return m ? m[1].toLowerCase() : null;
  };
  const escuroBloco = /:root\[data-theme='dark'\]\s*\{([\s\S]*?)\}/.exec(cru);
  const claro = papel(cru);
  const escuro = escuroBloco ? papel(escuroBloco[1]) : null;
  if (claro !== PAPEL_CLARO) {
    erros.push({
      rel,
      msg:
        `o papel claro dos tokens é "${claro}" e site.config.mjs diz "${PAPEL_CLARO}".\n` +
        `      A cadeia de site.config.mjs é a que vai para os manifestos e para a etiqueta ` +
        `theme-color, e o CSS não alcança nenhum dos dois.`,
    });
  }
  if (escuro !== PAPEL_ESCURO) {
    erros.push({
      rel,
      msg: `o papel escuro dos tokens é "${escuro}" e site.config.mjs diz "${PAPEL_ESCURO}".`,
    });
  }
  /* E a terceira cópia: a que `public/js/tema.js` escreve na etiqueta quando o
     leitor carrega no botão. É JavaScript servido tal e qual, e por isso lê-se
     do ficheiro e não se importa. */
  const relTema = 'public/js/tema.js';
  const tema = fs.readFileSync(path.join(ROOT, 'public', 'js', 'tema.js'), 'utf8');
  const naEscolha = /var PAPEL = \{\s*light:\s*'(#[0-9a-fA-F]{6})',\s*dark:\s*'(#[0-9a-fA-F]{6})'/.exec(
    tema,
  );
  if (!naEscolha) {
    erros.push({
      rel: relTema,
      msg:
        `não encontrei os dois papéis (var PAPEL = { light: '…', dark: '…' }).\n` +
        `      É o que troca a cor da mobília do navegador quando o leitor escolhe o escuro; ` +
        `sem eles a barra fica a dizer o papel claro por cima de uma página escura.`,
    });
  } else if (naEscolha[1].toLowerCase() !== PAPEL_CLARO || naEscolha[2].toLowerCase() !== PAPEL_ESCURO) {
    erros.push({
      rel: relTema,
      msg:
        `os papéis do controlo do tema são "${naEscolha[1]}" e "${naEscolha[2]}", e os tokens ` +
        `dizem "${PAPEL_CLARO}" e "${PAPEL_ESCURO}".`,
    });
  }
}

for (const m of MANIFESTOS) {
  const rel = `dist${m.caminho}`;
  const ficheiro = path.join(DIST, m.caminho.replace(/^\//, ''));
  if (!fs.existsSync(ficheiro)) {
    erros.push({ rel, msg: `o manifesto da edição "${m.lang}" não foi construído.` });
    continue;
  }
  let doc;
  try {
    doc = JSON.parse(fs.readFileSync(ficheiro, 'utf8'));
  } catch (e) {
    erros.push({ rel, msg: `não é JSON legível: ${e.message}` });
    continue;
  }
  const campo = (nome, esperado) => {
    if (doc[nome] !== esperado) {
      erros.push({ rel, msg: `"${nome}" é ${JSON.stringify(doc[nome])} e devia ser ${JSON.stringify(esperado)}.` });
    }
  };
  campo('name', SITE_NAME);
  campo('short_name', SITE_SHORT_NAME);
  campo('lang', m.lingua);
  campo('id', m.inicio);
  campo('start_url', m.inicio);
  campo('display', 'standalone');
  campo('background_color', PAPEL_CLARO);
  campo('theme_color', PAPEL_CLARO);
  /* O `display` é `standalone` e não `fullscreen` nem `minimal-ui`: o BRIEF
     escreve-o, e é a diferença entre uma aplicação sem a moldura do navegador e
     uma aplicação sem a barra de estado do telemóvel. */

  const icones = Array.isArray(doc.icons) ? doc.icons : [];
  if (icones.length !== ICONES_DO_MANIFESTO.length) {
    erros.push({
      rel,
      msg: `declara ${icones.length} ícone(s) e a casa tem ${ICONES_DO_MANIFESTO.length}.`,
    });
  }
  for (const esperado of ICONES_DO_MANIFESTO) {
    const declarado = icones.find((i) => i?.src === esperado.src);
    if (!declarado) {
      erros.push({ rel, msg: `não declara o ícone "${esperado.src}".` });
      continue;
    }
    if (declarado.sizes !== esperado.sizes) {
      erros.push({
        rel,
        msg: `o ícone "${esperado.src}" declara sizes "${declarado.sizes}" e devia declarar "${esperado.sizes}".`,
      });
    }
    if (declarado.purpose !== esperado.purpose) {
      erros.push({
        rel,
        msg: `o ícone "${esperado.src}" declara purpose "${declarado.purpose}" e devia declarar "${esperado.purpose}".`,
      });
    }
    if (declarado.type !== 'image/png') {
      erros.push({ rel, msg: `o ícone "${esperado.src}" declara type "${declarado.type}".` });
    }
    const noDisco = path.join(DIST, esperado.src.replace(/^\//, ''));
    if (!fs.existsSync(noDisco)) {
      erros.push({ rel, msg: `o ícone "${esperado.src}" não existe em dist/.` });
      continue;
    }
    const medidas = medidasDoPng(fs.readFileSync(noDisco));
    if (!medidas) {
      erros.push({ rel, msg: `o ícone "${esperado.src}" não é um PNG legível.` });
    } else if (medidas.largura !== esperado.px || medidas.altura !== esperado.px) {
      erros.push({
        rel,
        msg:
          `o ícone "${esperado.src}" declara ${esperado.sizes} e o ficheiro tem ` +
          `${medidas.largura}×${medidas.altura} na cabeça do PNG.`,
      });
    }
    manifestosConferidos.icones++;
  }
  manifestosConferidos.ficheiros++;
}

/* E os dois ficheiros que não estão em nenhum manifesto e a cabeça liga: o
   ícone do iPhone (180, opaco) e os dois favicons. O tamanho lê-se aqui; a
   opacidade e a zona segura medem-se em `tests/inicio/app.mjs`, que é onde a
   régua tem os casos plantados. */
for (const { caminho, px } of [{ caminho: '/apple-touch-icon.png', px: 180 }]) {
  const rel = `dist${caminho}`;
  const noDisco = path.join(DIST, caminho.replace(/^\//, ''));
  if (!fs.existsSync(noDisco)) {
    erros.push({ rel, msg: 'a cabeça de todas as páginas liga este ficheiro e ele não está em dist/.' });
    continue;
  }
  const medidas = medidasDoPng(fs.readFileSync(noDisco));
  if (!medidas || medidas.largura !== px || medidas.altura !== px) {
    erros.push({
      rel,
      msg: `a cabeça do PNG diz ${medidas ? `${medidas.largura}×${medidas.altura}` : 'ilegível'} e o iOS quer ${px}×${px}.`,
    });
  } else manifestosConferidos.icones++;
}

/**
 * A ÂNCORA DA PORTA DE UM NÚMERO DO SÍTIO (v2, IDENTIDADE.md §10).
 *
 * Um `data-prova` pode ter como porta uma âncora na própria página, quando é
 * ali que se vê o que ele conta. A âncora tem de existir: quem a escreveu foi
 * `src/lib/prova.mjs` e não o gabarito, e por isso a mensagem diz a CHAVE, para
 * que se saiba onde a corrigir. A conferência das ligações internas apanha a
 * mesma coisa pelo lado da ligação; esta apanha-a pelo lado da prova, que é
 * onde a porta é decidida.
 */
for (const { rel, chave, destino, caminho, ancora } of ancorasDaProva) {
  const ids = idsPorPagina.get(normalizaCaminho(caminho));
  if (!ids) {
    erros.push({
      rel,
      msg:
        `a porta do número da prova "${chave}" é "${destino}", e "${normalizaCaminho(caminho)}" ` +
        `não é uma página construída.`,
    });
    continue;
  }
  if (!ids.has(ancora)) {
    erros.push({
      rel,
      msg:
        `a porta do número da prova "${chave}" aponta para a âncora "#${ancora}", que não existe ` +
        `em "${normalizaCaminho(caminho)}".\n` +
        `      A porta de um número do sítio pode ser uma âncora na própria página (§10, v2), e ` +
        `então é essa secção que tem de existir.\n` +
        `      Corrija a porta em src/lib/prova.mjs, ou dê à secção o "id" que a porta nomeia.`,
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

/**
 * A COMPARAÇÃO É DO TEXTO RENDERIZADO, NÃO DA SEQUÊNCIA DE ALGARISMOS.
 *
 * Até 16.08.2026 comparavam-se os algarismos (`digitsOf`), e por isso «1,32»,
 * «-132» ou «132 e picos» comparavam iguais a `132` (revisão cruzada, #9). O
 * defeito plantado que a §1.39 registou (132 → 133) falhava; a vírgula, o
 * sinal e a escala não. Passa a comparar-se o texto que o leitor vê com o que
 * o portão conta, escrito como o sítio o escreve: um número é o seu valor em
 * cadeia, uma data é ISO, um endereço é ele próprio.
 */
for (const o of ocorrenciasDaProva) {
  const esperado = CONTAS[o.chave];
  if (esperado === undefined || esperado === null) continue; // já dito acima
  /**
   * UMA CHAVE DA PROVA QUE É UMA DATA ESCREVE-SE NA FORMA DA CASA (bloco F1.4,
   * 04.09.2026).
   *
   * O comentário acima dizia «uma data é ISO», e era a regra até aqui: a única
   * chave com valor de data (`painel_reconferido_em`) saía em ISO na página do
   * Método, e era a última data ISO à vista do sítio. A regra da §1.91 é uma só,
   * e passa a valer também aqui.
   *
   * A CONFERÊNCIA NÃO AFROUXA: o portão recompõe a data com a SUA cópia da regra
   * (`dataDaCasaGate`, no topo deste ficheiro) e continua a comparar carácter a
   * carácter. O que ele passa a provar são duas coisas onde provava uma: que o
   * valor é o que o portão conta, e que está escrito na forma da casa. Uma
   * chave que não seja uma data completa não é tocada, e por isso as contagens
   * comparam-se exactamente como antes.
   */
  const cru = String(esperado);
  const naForma = /^\d{4}-\d{2}-\d{2}$/.test(cru) ? dataDaCasaGate(cru) : cru;
  if (o.texto !== naForma) {
    erros.push({
      rel: o.rel,
      msg:
        `o número da prova "${o.chave}" foi renderizado como "${o.texto.slice(0, 60)}" e o ` +
        `portão escreve-o "${naForma}"` +
        (naForma === cru ? '' : ` (o registo diz "${cru}")`) +
        `.\n` +
        `      Não é só o valor que tem de bater certo: é a forma. Uma vírgula, um sinal ou ` +
        `uma escala trocados são um número diferente.`,
    });
  }
}

/* A LISTA POR EXTENSO, contra a mesma conta do portão. A mensagem diz o texto,
   e não só o número: quem a lê tem de poder ver QUAL o nome que sobra ou falta,
   sem abrir a página. */
for (const o of ocorrenciasDaLista) {
  const esperado = CONTAS[o.chave];
  if (esperado === undefined || esperado === null) continue; // já dito acima
  if (o.itens !== esperado) {
    erros.push({
      rel: o.rel,
      msg:
        `a lista da prova "${o.chave}" nomeia ${o.itens} medida(s) e o portão conta ` +
        `${String(esperado)}.\n` +
        `      lista renderizada: «${o.texto.slice(0, 160)}»\n` +
        `      A contagem e os nomes dizem a mesma coisa. Uma frase que nomeia medidas a mais ou ` +
        `a menos do que a manchete conta deixou de ser verdadeira.`,
    });
  }
}

/* =============================================================================
 * OS CARTÕES DE PARTILHA, REGISTO A REGISTO (etapa 5)
 * =============================================================================
 *
 * Acima confere-se que cada PÁGINA nomeia o cartão certo. Aqui confere-se o
 * CARTÃO: que o ficheiro é o que o registo diz, que mede o que diz medir, e que
 * cada número que ele mostra vem de uma linha do livro-razão ou de uma chave da
 * prova — recalculado aqui, do disco, e comparado como CADEIA pela mesma regra
 * do `data-claim` (`formaDoValor`).
 *
 * A CONFERÊNCIA MAIS DURA É A DOS ALGARISMOS DA CÓPIA. Um cartão pode dizer
 * palavras; não pode mostrar um algarismo que ninguém consiga reconduzir a uma
 * origem. Tira-se da cópia visível, do mais comprido para o mais curto, cada
 * valor declarado, e o que sobrar não pode ter um algarismo. É a versão para
 * píxeis da regra que governa o resto do sítio: nenhum algarismo sem
 * proveniência.
 *
 * Não é um portão novo. É este portão a olhar para a superfície que ele ainda
 * não olhava.
 */

/** As dimensões reais de um PNG, lidas do cabeçalho IHDR do próprio ficheiro. */
function medidasDoPng(buf) {
  if (buf.length < 24) return null;
  if (buf.readUInt32BE(0) !== 0x89504e47 || buf.readUInt32BE(4) !== 0x0d0a1a0a) return null;
  if (buf.toString('latin1', 12, 16) !== 'IHDR') return null;
  return { largura: buf.readUInt32BE(16), altura: buf.readUInt32BE(20) };
}

let cartoesConferidos = 0;
let valoresDeCartao = 0;

if (REGISTOS_DOS_CARTOES.size === 0) {
  erros.push({
    rel: `dist/${PASTA_DOS_CARTOES}/`,
    msg:
      'não há um único cartão de partilha construído. O passo `npm run cartoes` corre entre o ' +
      '`astro build` e este portão; sem ele, todas as páginas apontam `og:image` para ficheiros ' +
      'que não existem.',
  });
}

for (const [nomePng, registo] of REGISTOS_DOS_CARTOES) {
  const rel = `dist/${PASTA_DOS_CARTOES}/${nomePng}`;
  const errC = (msg) => erros.push({ rel, msg });
  cartoesConferidos++;

  /* 1 — o ficheiro existe e é o que o registo diz que é. */
  const ficheiro = path.join(DIR_DOS_CARTOES, nomePng);
  if (!fs.existsSync(ficheiro)) {
    errC('há um registo de cartão e não há o PNG dele.');
    continue;
  }
  const bytes = fs.readFileSync(ficheiro);
  const resumo = `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
  if (resumo !== registo.resumo) {
    errC(
      `o resumo do PNG não é o que o registo declara.\n` +
        `      registo:  ${registo.resumo}\n` +
        `      ficheiro: ${resumo}`,
    );
  }

  /* 2 — as dimensões, medidas no ficheiro, contra o registo E contra o nome. */
  const medido = medidasDoPng(bytes);
  const noNome = nomePng.match(/\.(\d+)x(\d+)\.png$/);
  if (!medido) {
    errC('o ficheiro não é um PNG legível: não tem cabeçalho IHDR.');
  } else if (
    medido.largura !== registo.dimensoes?.largura ||
    medido.altura !== registo.dimensoes?.altura
  ) {
    errC(
      `as dimensões do PNG não são as do registo.\n` +
        `      registo:  ${registo.dimensoes?.largura}×${registo.dimensoes?.altura}\n` +
        `      ficheiro: ${medido.largura}×${medido.altura}`,
    );
  } else if (
    !noNome ||
    Number(noNome[1]) !== medido.largura ||
    Number(noNome[2]) !== medido.altura
  ) {
    errC(
      `o nome do ficheiro diz ${noNome ? `${noNome[1]}×${noNome[2]}` : '(nada)'} e o PNG mede ` +
        `${medido.largura}×${medido.altura}. O nome é o que a página nomeia: um nome que mente ` +
        `sobre a medida serve uma imagem do tamanho errado a quem a partilha.`,
    );
  }

  /* 3 — a rota e a edição do registo batem certo com o nome do ficheiro. */
  const nomeEsperado = nomeDoCartao({
    rota: registo.rota,
    lang: registo.edicao,
    largura: registo.dimensoes?.largura,
    altura: registo.dimensoes?.altura,
    extensao: 'png',
  });
  if (nomeEsperado !== nomePng) {
    errC(
      `o registo diz rota "${registo.rota}" e edição "${registo.edicao}", que dão o nome ` +
        `"${nomeEsperado}", e o ficheiro chama-se "${nomePng}".`,
    );
  }
  if (!LANGS.includes(registo.edicao)) {
    errC(`a edição declarada, "${registo.edicao}", não é uma das edições do sítio.`);
  }
  if ((registo.cobre ?? []).length === 0) {
    errC('este cartão não cobre rota nenhuma: foi desenhado para ninguém.');
  }

  /* 4 — cada valor, recalculado da sua origem e comparado como cadeia. */
  for (const v of registo.valores ?? []) {
    valoresDeCartao++;
    if (v.origem === 'linha') {
      const claim = claims.get(v.linha);
      if (!claim) {
        errC(`o valor "${v.texto}" diz vir da linha "${v.linha}", que não está no livro-razão.`);
        continue;
      }
      const doDisco = claim[v.campo];
      if (doDisco === undefined || doDisco === null) {
        errC(`o valor "${v.texto}" diz vir do campo "${v.campo}" de "${v.linha}", que está vazio.`);
        continue;
      }
      /**
       * ---------------------------------------------------------------------
       * DUAS CADEIAS, DUAS CONFERÊNCIAS (I96, bloco F1.7, 04.09.2026)
       * ---------------------------------------------------------------------
       * `livro` é o campo tal como o livro-razão o guarda, e `texto` é o que o
       * cartão DESENHOU. Para todos os campos menos um são a mesma cadeia; a
       * UNIDADE, na edição inglesa, é a da tabela da casa
       * (`src/i18n/unidades.mjs`), porque a página ao lado já escreve «people»
       * e um cartão que escrevesse «pessoas» dizia noutra língua o que a página
       * diz.
       *
       * As duas conferências são precisas, e uma sozinha não chegava:
       *
       *   · `livro` contra o disco, carácter a carácter — é a conferência que
       *     já existia, e é ela que impede um cartão de mentir sobre a linha;
       *   · `texto` contra o que a tabela manda para AQUELA edição, recalculado
       *     aqui pelo portão. Sem ela, `texto` podia ser qualquer coisa: a
       *     única cadeia conferida seria uma que já não estava no cartão.
       *
       * `livro` pode faltar num registo antigo, e aí vale `texto`, que era o
       * que esse registo tinha: um portão que rebentasse com um registo de uma
       * construção anterior fechava a porta a si próprio.
       */
      const doRegisto = v.livro ?? v.texto;
      if (formaDoValor(String(doDisco)) !== formaDoValor(String(doRegisto))) {
        errC(
          `um valor do cartão não é o da sua linha.\n` +
            `      cartão:      "${doRegisto}"\n` +
            `      ${v.linha}.${v.campo}: "${String(doDisco)}"\n` +
            `      Um cartão viaja sem a página: um número velho nele fica velho para sempre.`,
        );
      }
      const desenhado =
        v.campo === 'unit'
          ? unidadeDaLinha(claim.unit, registo.edicao).texto
          : String(doDisco);
      if (formaDoValor(desenhado) !== formaDoValor(String(v.texto))) {
        errC(
          `o cartão desenhou "${v.texto}" onde a casa manda escrever "${desenhado}" na edição ` +
            `"${registo.edicao}".\n` +
            `      A unidade de uma linha é um rótulo, e a tabela de src/i18n/unidades.mjs diz ` +
            `qual é em cada edição (I92, I96).`,
        );
      }
      if ((v.unidade ?? null) !== (claim.unit ?? null)) {
        errC(
          `o valor "${v.texto}" viaja com a unidade "${v.unidade ?? '(nenhuma)'}" e a linha ` +
            `"${v.linha}" tem "${claim.unit ?? '(nenhuma)'}".`,
        );
      }
      if ((v.periodo ?? null) !== (claim.reference_date ?? null)) {
        errC(
          `o valor "${v.texto}" viaja com o período "${v.periodo ?? '(nenhum)'}" e a linha ` +
            `"${v.linha}" tem "${claim.reference_date ?? '(nenhum)'}".`,
        );
      }
    } else if (v.origem === 'prova') {
      const contado = CONTAS[v.chave];
      if (contado === undefined) {
        errC(`o valor "${v.texto}" diz vir da chave da prova "${v.chave}", que o portão não conta.`);
        continue;
      }
      /* A MESMA REGRA DA DATA, DO LADO DO CARTÃO (bloco F1.4, 04.09.2026).
         Um cartão de partilha é a mesma coisa vista de fora, e a data de uma
         chave da prova escreve-se lá como se escreve na página: dd.mm.aaaa. O
         portão recompõe-a com a sua cópia da regra e continua a comparar
         carácter a carácter. */
      const cruDoCartao = String(contado);
      const contadoNaForma = /^\d{4}-\d{2}-\d{2}$/.test(cruDoCartao)
        ? dataDaCasaGate(cruDoCartao)
        : cruDoCartao;
      if (contadoNaForma !== String(v.texto)) {
        errC(
          `um valor do cartão não é o que o portão conta.\n` +
            `      cartão: "${v.texto}"\n` +
            `      portão: "${contadoNaForma}"` +
            (contadoNaForma === cruDoCartao ? '' : ` (o registo diz "${cruDoCartao}")`) +
            ` (chave "${v.chave}")`,
        );
      }
    } else {
      errC(`o valor "${v.texto}" não declara origem conhecida ("${v.origem}").`);
    }
  }

  /* 5 — nenhum algarismo na cópia visível que não seja um dos valores. */
  let sobra = (registo.copia ?? []).join(' · ');
  const declarados = [...(registo.valores ?? [])]
    .map((v) => String(v.texto))
    .sort((a, b) => b.length - a.length);
  for (const t of declarados) sobra = sobra.split(t).join(' ');
  const orfaos = sobra.match(/\d/g);
  if (orfaos) {
    errC(
      `a cópia visível do cartão tem algarismos sem origem ("${orfaos.join('')}").\n` +
        `      o que sobra depois de tirar os valores declarados: «${sobra.replace(/\s+/g, ' ').trim().slice(0, 160)}»\n` +
        `      Um algarismo num cartão tem de vir de uma linha ou de uma chave da prova.`,
    );
  }

  /* 6 — a fila de quadrados, recontada pelo portão. */
  if (registo.quadrados) {
    const fora = CONTAS.painel_fora_do_limiar;
    const dentro = CONTAS.painel_dentro_do_limiar;
    const sem = CONTAS.painel_total - fora - dentro;
    const meu = { fora, dentro, sem };
    for (const chave of ['fora', 'dentro', 'sem']) {
      if (registo.quadrados[chave] !== meu[chave]) {
        errC(
          `a fila de estados do cartão desenha ${registo.quadrados[chave]} quadrado(s) ` +
            `"${chave}" e o portão conta ${meu[chave]}.`,
        );
      }
    }
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

/* A EXCEPÇÃO ÓRFÃ, VERMELHA. Ver a nota em «UMA EXCEPÇÃO QUE NÃO DISPENSA
   NADA», ao pé do carregamento da lista. */
for (const [id, n] of USOS.contextos) {
  if (n === 0) {
    erros.push({
      rel: 'ledger/allowlist.yml',
      msg:
        `o motivo "${id}" está declarado e não dispensa nada: nenhuma página de dist/ o rende.\n` +
        `      Uma excepção que não excepciona é uma porta aberta que ninguém decidiu abrir. ` +
        `Tire-a da lista, ou renda o motivo onde ele faz falta.`,
    });
  }
}
for (const [chave, n] of USOS.tokens) {
  if (n > 0) continue;
  const semAlgarismos = TOKENS_SEM_ALGARISMOS.includes(chave);
  erros.push({
    rel: 'ledger/allowlist.yml',
    msg: semAlgarismos
      ? `o token "${chave}" não tem um algarismo, e por isso NUNCA é consultado: o varrimento ` +
        `só pergunta pela lista quando o token traz algarismos.\n` +
        `      Não é uma excepção, é uma nota. Tire-a da lista de regras e escreva o que ela ` +
        `esclarece no motivo onde a palavra aparece com algarismos.`
      : `o token "${chave}" está declarado e não dispensa nada: nenhuma página de dist/ o traz.\n` +
        `      Tire-o da lista, ou renda-o onde ele faz falta.`,
  });
}
for (const [chave, n] of USOS.padroes) {
  if (n === 0) {
    erros.push({
      rel: 'ledger/allowlist.yml',
      msg: `o padrão "${chave}" está declarado e não corresponde a nada em dist/. Tire-o da lista.`,
    });
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
      (documentos ? ` · ${documentos} documento(s) de estudo, conferidos contra a origem` : '') +
      (paginasDeTexto
        ? ` · ${paginasDeTexto} página(s) de leitura, conferidas contra o seu registo de conteúdo`
        : ''),
  ),
);
console.log(
  cinza(
    `  allowlist · ${USOS.contextos.size} motivo(s) e ${USOS.tokens.size} token(s), com os usos ` +
      `que os provam vivos: ${[...USOS.contextos].map(([k, n]) => `${k} ${n}`).join(' · ')} · ` +
      `${[...USOS.tokens].map(([k, n]) => `${k} ${n}`).join(' · ')}\n` +
    `  rótulo de IA · ${ROTULO_DE_IA.rodape} no rodapé (de ${ficheiros - documentos} páginas fora ` +
      `dos documentos alojados) · ${ROTULO_DE_IA.topo} no topo das páginas de leitura · ` +
      `${ROTULO_DE_IA.ficha} ficha(s) da primeira página · ${ROTULO_DE_IA.frase} frase(s) da ` +
      `política, comparadas com o texto aprovado`,
  ),
);
console.log(
  cinza(
    `  ortografia · Acordo de 1990 como se aplica em Portugal · ${FORMAS.pares.length} pares, ` +
      `${FORMAS.iguais.length} iguais · restante: ${ocorrenciasRestantes} ocorrência(s) em ` +
      `${[...RESTANTE.values()].filter((r) => r.usadas > 0).length} rota(s), todas de linhas cruzadas` +
      ` · ${excluidasPorCitacao} dispensada(s) por estarem entre «…»`,
  ),
);

/* =============================================================================
 * UM FACTO POR VERIFICAR LEVA O MARCADOR ONDE ELE SE RENDE (I77, 27.08.2026)
 * =============================================================================
 * A `IDENTIDADE.md` §6 fixa o marcador `[a verificar]` como a única língua
 * pública para «isto não está confirmado», e a Emenda 15 tirou da página do
 * leitor o parágrafo que o explicava. As duas regras juntas só se sustentam se o
 * marcador estiver ONDE o facto se rende: uma incerteza dita num parágrafo à
 * parte sai com o parágrafo, e foi o que aconteceu ao nome legal do presidente
 * interino de 2013, cujas duas fontes oficiais dão formas diferentes.
 *
 * Um campo dos dados de um concelho declarado `<campo>PorVerificar` tem de
 * render, na sua página e nas duas edições, o marcador com a porta da página
 * dele. Quem tirar o marcador fecha a construção; quem quiser tirar a incerteza
 * tira a declaração, e aí o portão deixa de a exigir.
 *
 * A conferência lê as páginas construídas, e não a árvore de dados: é o que o
 * leitor recebe que tem de levar o marcador.
 * ========================================================================== */
/** A âncora de um mandato. O portão tem a sua própria cópia, como do separador. */
const ancoraDoMandatoNoPortao = (periodo) =>
  `mandato-${String(periodo).replace(/[–-]+$/, '').replace(/[–-]/g, '-')}`;

{
  let camposConferidos = 0;
  for (const m of MUNICIPIOS_COM_PAGINA) {
    for (const mandato of m.tempo?.mandatos ?? []) {
      if (!mandato.quemPorVerificar) continue;
      for (const l of LANGS) {
        const rota = routePath('municipio', l, { slug: m.slug });
        const rel = path.join(rota.replace(/^\//, ''), 'index.html');
        const ficheiro = path.join(DIST, rel);
        if (!fs.existsSync(ficheiro)) {
          erros.push({ rel, msg: `não existe a página do concelho "${m.slug}" na edição "${l}".` });
          continue;
        }
        const raiz = parse(fs.readFileSync(ficheiro, 'utf8'), { comment: false });
        const bloco = raiz.querySelector(`#${ancoraDoMandatoNoPortao(mandato.periodo)}`);
        const quem = bloco?.querySelector('.mun-mandato-quem');
        const marca = quem?.querySelector('a.marcador');
        const porta = routePath('marcador', l);
        camposConferidos++;
        if (!quem) {
          erros.push({
            rel,
            msg:
              `o mandato "${mandato.periodo}" declara o nome por verificar e a página não tem o ` +
              `campo onde ele se rende (.mun-mandato-quem dentro de #${ancoraDoMandatoNoPortao(mandato.periodo)}).`,
          });
          continue;
        }
        if (!marca) {
          erros.push({
            rel,
            msg:
              `o nome do mandato "${mandato.periodo}" está declarado por verificar e rende-se SEM o ` +
              `marcador.\n` +
              `      esperava-se <a class="marcador" href="${porta}"> ao pé do nome, dentro de ` +
              `.mun-mandato-quem.\n` +
              `      É a regra da IDENTIDADE §6: a única língua pública para «isto não está ` +
              `confirmado» é o marcador, e ele vive onde o facto se rende, não num parágrafo à parte.`,
          });
          continue;
        }
        const href = decodeEntities(marca.getAttribute('href') ?? '');
        if (href !== porta) {
          erros.push({
            rel,
            msg: `o marcador do mandato "${mandato.periodo}" abre "${href}" e devia abrir "${porta}", a página do marcador nesta edição.`,
          });
        }
      }
    }
  }
  console.log(
    cinza(`  factos por verificar · ${camposConferidos} campo(s) declarados, com o marcador na página e a porta da edição certa`),
  );
}

/* =============================================================================
 * AS DUAS EDIÇÕES DA MESMA FRASE (bloco «A grelha da voz», 26.08.2026)
 * =============================================================================
 * Até hoje a página do trabalho IMPRIMIA a frase da outra edição por baixo da
 * sua, com o rótulo «A mesma frase na outra edição». Era o sítio a provar ao
 * leitor que as duas edições dizem o mesmo, numa página do leitor, que é a
 * classe que a Emenda 15 tira de lá. A prova não se perde: muda de sítio, de uma
 * página para um portão.
 *
 * O que se pode conferir por máquina é a ESPINHA da frase: as afirmações que ela
 * cita, e a ordem por que as cita. Duas edições que citem os mesmos ids na mesma
 * ordem dizem a mesma coisa sobre os mesmos números; uma tradução que perca um
 * valor, que troque dois, ou que cite outro, fecha a construção aqui. O que um
 * portão não pode conferir é se a tradução está bem escrita, e isso continua a
 * ser trabalho de quem lê, como sempre foi.
 *
 * Vale para as três coisas da página de leitura que existem nas duas edições: a
 * frase da leitura breve, o nome de cada medida do relance, e a nota das
 * medidas.
 * ========================================================================== */
function idsDaFrase(partes) {
  const ids = [];
  for (const parte of partes ?? []) {
    /* A nota das medidas é uma LISTA DE PARÁGRAFOS desde o I75, e cada parágrafo
       é uma lista de pedaços: desce-se um nível para que a conferência continue
       a ver os ids que a peça cita, em vez de contar zero em silêncio. */
    if (Array.isArray(parte)) {
      ids.push(...idsDaFrase(parte));
      continue;
    }
    if (parte && typeof parte === 'object' && typeof parte.claim === 'string') ids.push(parte.claim);
  }
  return ids;
}

{
  let paresConferidos = 0;
  const rel = 'src/data/leituras.mjs';
  for (const [slug, leitura] of Object.entries(LEITURAS)) {
    const pecas = [['frase', leitura.frase]];
    if (leitura.medidasNota) pecas.push(['medidasNota', leitura.medidasNota]);
    for (const [i, med] of (leitura.medidas ?? []).entries()) {
      pecas.push([`medidas[${i}].nome`, med.nome]);
    }
    for (const [i, r] of (leitura.metodo ?? []).entries()) {
      if (r?.v) pecas.push([`metodo[${i}].v`, r.v]);
    }
    for (const [onde, peca] of pecas) {
      if (!peca) continue;
      for (const l of LANGS) {
        if (!Array.isArray(peca[l])) {
          erros.push({ rel, msg: `${slug} · ${onde}: falta a edição "${l}".` });
        }
      }
      if (!Array.isArray(peca.pt) || !Array.isArray(peca.en)) continue;
      const pt = idsDaFrase(peca.pt);
      const en = idsDaFrase(peca.en);
      paresConferidos++;
      if (pt.join('|') === en.join('|')) continue;
      erros.push({
        rel,
        msg:
          `${slug} · ${onde}: as duas edições não citam as mesmas afirmações pela mesma ordem.\n` +
          `      pt: ${pt.join(' · ') || '(nenhuma)'}\n` +
          `      en: ${en.join(' · ') || '(nenhuma)'}\n` +
          `      A página do trabalho deixou de imprimir a frase da outra edição por baixo da sua ` +
          `(Emenda 15): a conferência é aqui.`,
      });
    }
  }
  console.log(
    cinza(`  as duas edições · ${paresConferidos} peça(s) de página de leitura com os mesmos ids pela mesma ordem`),
  );
}

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
    'leitura dos mesmos ficheiros do livro-razão), registos (segunda leitura dos',
    'registos de conteúdo do motor) ou modulo (o mesmo módulo dos dois lados).',
    'Ver DECISIONS.md §1.39, §1.64 e §2.2, origem 7.',
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
    manifestos_conferidos: manifestosConferidos.ficheiros,
    icones_conferidos: manifestosConferidos.icones,
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
/**
 * O documento inteiro, e não só o bloco `prova`.
 *
 * Reler `prova` chave a chave apanhava um valor do livro-razão alterado depois
 * de escrito e deixava passar `portao.valores_sem_selo` posto a 999 (revisão
 * cruzada 2, #9). O ficheiro é a prova desta construção para quem não lê
 * páginas: relê-se por inteiro contra o que o varrimento acabou de calcular.
 *
 * `construido_em` é a única excepção, e é dita: é a data do carimbo, lida de
 * `version.json`, e não uma conta deste varrimento.
 */
function comparavel(doc) {
  const copia = JSON.parse(JSON.stringify(doc));
  delete copia.construido_em;
  return copia;
}

/** Onde dois documentos diferem, caminho a caminho. */
function diferencas(escrito, calculado, caminho = '') {
  const onde = caminho || '(raiz)';
  if (escrito === null || calculado === null || typeof escrito !== 'object' ||
      typeof calculado !== 'object') {
    return JSON.stringify(escrito) === JSON.stringify(calculado)
      ? []
      : [`${onde}: escrito ${JSON.stringify(escrito)}, calculado ${JSON.stringify(calculado)}`];
  }
  if (Array.isArray(escrito) || Array.isArray(calculado)) {
    return JSON.stringify(escrito) === JSON.stringify(calculado)
      ? []
      : [`${onde}: a lista escrita não é a calculada`];
  }
  const saida = [];
  for (const chave of Object.keys(calculado)) {
    if (!(chave in escrito)) saida.push(`${onde}: falta "${chave}"`);
    else saida.push(...diferencas(escrito[chave], calculado[chave], caminho ? `${caminho}.${chave}` : chave));
  }
  for (const chave of Object.keys(escrito)) {
    if (!(chave in calculado)) saida.push(`${onde}: chave a mais "${chave}"`);
  }
  return saida;
}

try {
  const relido = JSON.parse(fs.readFileSync(FICHEIRO_DA_PROVA, 'utf8'));
  const problemas = diferencas(comparavel(relido), comparavel(documentoDaProva));
  if (problemas.length) {
    console.error(
      vermelho(
        `\n  ${CAMINHO_DA_PROVA} não é o que esta construção calculou ` +
          `(${problemas.length} diferença(s)):\n    ` +
          problemas.slice(0, 10).join('\n    ') +
          `\n`,
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
      `${ocorrenciasDaLista.length} lista(s) de nomes recontada(s) · ` +
      `${ligacoesConferidas} ligações internas (${ligacoesRelativas} relativas, ` +
      `${ancorasConferidas} âncoras) · ${recortesConferidos} recortes · ` +
      `${alojadosConferidos} ficheiros alojados · ` +
      `${calculadosConferidos} contas sobre ficheiros não alojados ` +
      `(${arquivadasConferidas} com cópia arquivada) · ` +
      `${paginasDeSerieConferidas} páginas de série · ` +
      `${cartoesConferidos} cartões de partilha (${valoresDeCartao} valores recalculados, ` +
      `${cartoesUsados.size} nomeados por páginas) · ` +
      `${manifestosConferidos.ficheiros} manifestos (${manifestosConferidos.icones} ícones ` +
      `medidos na cabeça do PNG) · ` +
      `escrito em ${CAMINHO_DA_PROVA}`,
  ),
);
console.log('');

/* =============================================================================
 * LIMITES DESTE VARRIMENTO — ler antes de confiar nele.
 *
 * 1. Só vê texto. Números dentro de <script> e <style> não são varridos, com
 *    uma excepção: as ilhas <script data-ledger-json>, essas são conferidas
 *    valor a valor contra o livro-razão.
 * 2. Não vê atributos (title, alt, aria-label, conteúdo gerado por CSS), com
 *    duas excepções, as duas onde o atributo É a afirmação: o `href` da âncora
 *    que embrulha `source_url`, e o `src` de um recorte, que é conferido contra
 *    o `document.crop` da linha e contra os bytes construídos em dist/.
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
