/**
 * Os documentos dos estudos: obras já publicadas, alojadas aqui INTACTAS.
 *
 * Um estudo migrado tem duas coisas neste sítio:
 *
 *   /estudos/<slug>            — a página do observatório sobre o estudo,
 *                                escrita por nós, com a disciplina da casa;
 *   /estudos/<slug>/documento  — o documento original, tal como foi publicado.
 *
 * Este módulo trata do segundo. A regra é uma só e não tem excepções:
 *
 *   ****  O DOCUMENTO NÃO É REESCRITO. ABAIXO DA FAIXA NÃO SE MEXE UM BYTE:  ****
 *   ****  nem estilos, nem scripts, nem uma vírgula. ACIMA DELA entram as três ****
 *   ****  marcas da casa, e mais nada.                                         ****
 *
 * AS TRÊS MARCAS, E PORQUE SUBIRAM ACIMA DA FAIXA (03.09.2026, bloco F0.7).
 *
 * Até aqui a faixa era a única coisa que a casa acrescentava, e o `<head>` do
 * documento ficava intacto. A auditoria de 02.09.2026 (§4) mediu o que isso
 * custava: os dezasseis documentos alojados não diziam a língua em que estão,
 * não pediam aos motores de busca que não os indexassem, e não levavam o rótulo
 * de IA que a §1.89 diz estar em todas as páginas. São textos gerados por IA, de
 * até 1 062 254 bytes, ligados das páginas dos estudos e portanto rastreáveis.
 *
 *   1. `lang` no `<html>`, com a etiqueta EXACTA da edição («pt-PT» ou «en»).
 *      Medidos os dezasseis a 03.09.2026: oito não declaravam língua nenhuma,
 *      cinco já declaravam a etiqueta exacta, e três diziam «pt» onde a casa
 *      escreve «pt-PT». Aos oito acrescenta-se; aos três normaliza-se a forma
 *      da mesma língua; qualquer outra coisa (vazia, ou de outra língua) é
 *      RECUSADA e pára a construção. A primeira passagem preservava o «pt» do
 *      autor e o portão exigia a raiz; a leitura a frio mostrou que isso era
 *      um contrato a duas vozes, e a segunda passagem fecha-o do lado estrito:
 *      a etiqueta é exacta nos dezasseis, e o que não couber diz-se em vez de
 *      se acomodar;
 *   2. `<meta name="robots" content="noindex, follow">` no `<head>`. É o
 *      recuo seguro enquanto o advogado não responder à pergunta 11 da
 *      `DILIGENCIA-LEGAL.md`: `noindex` tira o documento dos motores de busca,
 *      `follow` deixa as suas ligações contarem. Nenhum dos dezasseis trazia
 *      uma marca `robots` própria, portanto nada se sobrepõe;
 *   3. o RÓTULO DE IA, na faixa, com o mesmo texto do rodapé de todas as outras
 *      páginas (`src/data/politica-ia.mjs`). O artigo 50.º, n.º 5 do
 *      Regulamento (UE) 2024/1689 quer a divulgação «o mais tardar no momento
 *      da primeira interação ou exposição», e para quem chega a um documento
 *      por um motor de busca a primeira exposição é o documento.
 *
 * NENHUMA DAS TRÊS TOCA NO CORPO. As duas primeiras vivem acima do `<body>`; a
 * terceira vive dentro da faixa, que já é markup nosso e entra no `esperado` que
 * o portão recalcula dos dois lados da igualdade. A comparação carácter a
 * carácter do `verificaDocumento()` continua exacta, e o portão passou a exigir
 * as três: um documento sem elas fica vermelho.
 *
 * O que a faixa é: a marca do observatório, ligada de volta à página do estudo,
 * o rótulo que diz o que o leitor está a ver, a porta para o Sobre e a porta de
 * volta. CSS embebido, nenhum pedido para fora deste domínio, e (regra imposta
 * pelo portão) **nenhum algarismo no seu texto**. A faixa é moldura; os
 * algarismos que o leitor vir abaixo dela são do documento, não nossos.
 *
 * Desde 22.08.2026 a faixa é a mobília v3, e nenhum dos seus valores é escrito
 * aqui: as cores, as pilhas de tipos e os dois `@font-face` saem de
 * `src/styles/tokens.css`, e a composição da marca e do rótulo sai de
 * `src/styles/site.css`, lidas na construção. Ver `estiloDaFaixa()`.
 *
 * COMO SE PÕE UM DOCUMENTO NO SÍTIO (o processo inteiro):
 *
 *   1. `studies-src/<slug>/pt.html` — o ficheiro auto-contido, tal e qual;
 *      `en.html` para a edição inglesa. O `<slug>` tem de ser o de um trabalho
 *      de src/data/studies.mjs, e a língua tem de ser uma edição desse trabalho;
 *   2. `npm run build`.
 *
 * Não há passo 3. A rota, a ligação na página do estudo e a verificação do
 * portão saem daí sozinhas — se o ficheiro existe, o endereço existe.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { WORKS, workById } from '../data/studies.mjs';
import {
  ANCORA_DA_POLITICA,
  LINGUA_DO_RESPONSAVEL,
  RESPONSAVEL_EDITORIAL,
  ROTULO,
} from '../data/politica-ia.mjs';
import { routePath, LANGS } from './routes.mjs';
import { temRegisto } from './registos.mjs';
import { SITE_NAME } from '../../site.config.mjs';

import { t } from '../i18n/strings.mjs';

/** O nome do ficheiro de cada edição, dentro de `studies-src/<slug>/`. */
export const FICHEIRO_DA_EDICAO = { pt: 'pt.html', en: 'en.html' };

/**
 * Onde estão os documentos de origem.
 *
 * Procura-se a subir, como o livro-razão faz e pela mesma razão: no build este
 * módulo é empacotado para dentro de dist/, e um caminho relativo a este
 * ficheiro passaria a apontar para o sítio errado.
 */
function encontraOrigem() {
  const candidatos = [];
  if (process.env.OEDP_STUDIES_DIR) candidatos.push(process.env.OEDP_STUDIES_DIR);

  const subir = (inicio) => {
    let dir = inicio;
    for (let i = 0; i < 8; i++) {
      candidatos.push(path.join(dir, 'studies-src'));
      const acima = path.dirname(dir);
      if (acima === dir) break;
      dir = acima;
    }
  };

  subir(process.cwd());
  subir(path.dirname(fileURLToPath(import.meta.url)));

  for (const c of candidatos) {
    try {
      if (fs.statSync(c).isDirectory()) return c;
    } catch {
      /* segue */
    }
  }
  return null;
}

export const STUDIES_SRC_DIR = encontraOrigem();

/**
 * Todos os documentos que existem em disco, com a rota onde vão ser servidos.
 *
 * Falha — e o build pára — se encontrar um documento que o arquivo não conhece:
 * uma pasta com um slug que não é de nenhum trabalho, um ficheiro numa língua
 * em que o trabalho não tem edição, ou um nome de ficheiro que não é `pt.html`
 * nem `en.html`. Um documento órfão é um engano, não uma funcionalidade.
 *
 * @returns {{ slug: string, lang: string, ficheiro: string, rota: string }[]}
 */
export function todosOsDocumentos() {
  if (!STUDIES_SRC_DIR) return [];
  const out = [];
  const nomesValidos = new Set(Object.values(FICHEIRO_DA_EDICAO));

  for (const entrada of fs.readdirSync(STUDIES_SRC_DIR, { withFileTypes: true })) {
    if (!entrada.isDirectory()) continue; // o README e o manifesto, e mais nada
    const slug = entrada.name;
    /* Pastas com `_` à cabeça não são trabalhos: são a oficina. Hoje há uma só,
       `_raw/`, onde ficam os bytes tal como foram descarregados, que são a prova
       de `sha256_raw` no manifesto — ver studies-src/manifest.yml. A regra é por
       prefixo e não por nome porque um slug enganado nunca começa por `_`, e
       assim continua a valer a severidade de baixo: uma pasta com um nome que
       parece um slug e não é de nenhum trabalho continua a parar o build. */
    if (slug.startsWith('_')) continue;
    const work = WORKS.find((w) => w.slug === slug);
    if (!work) {
      throw new Error(
        `documentos: "studies-src/${slug}/" não corresponde a nenhum trabalho de ` +
          `src/data/studies.mjs.\n  Slugs aceites: ${WORKS.map((w) => w.slug).join(', ')}`,
      );
    }

    for (const ficheiro of fs.readdirSync(path.join(STUDIES_SRC_DIR, slug))) {
      if (ficheiro.startsWith('.')) continue;
      if (!nomesValidos.has(ficheiro)) {
        throw new Error(
          `documentos: "studies-src/${slug}/${ficheiro}" não é um nome de documento. ` +
            `Só ${[...nomesValidos].join(' e ')} — um ficheiro por edição.`,
        );
      }
      const lang = LANGS.find((l) => FICHEIRO_DA_EDICAO[l] === ficheiro);
      if (!work.editions.some((e) => e.lang === lang)) {
        throw new Error(
          `documentos: "studies-src/${slug}/${ficheiro}" é a edição "${lang}" de um trabalho ` +
            `que não tem essa edição no arquivo. Ou o arquivo está incompleto, ou o ficheiro ` +
            `está na pasta errada.`,
        );
      }
      out.push({
        slug,
        lang,
        ficheiro: path.join(STUDIES_SRC_DIR, slug, ficheiro),
        rota: routePath('documento', lang, { slug }),
      });
    }
  }

  return out.sort((a, b) => (a.slug + a.lang).localeCompare(b.slug + b.lang));
}

/** Os documentos de um estudo. É isto que a página do estudo pergunta. */
export function documentosDoEstudo(slug) {
  return todosOsDocumentos().filter((d) => d.slug === slug);
}

/** O documento de uma edição, ou null. */
export function documentoDaEdicao(slug, lang) {
  return todosOsDocumentos().find((d) => d.slug === slug && d.lang === lang) ?? null;
}

/* ------------------------------------------------------------------- faixa */

/** Escape de atributo. Os slugs são [a-z0-9-], mas nada aqui confia nisso. */
function atributo(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function texto(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ------------------------------------------------- a folha da casa, na faixa */

/**
 * A FAIXA NÃO ESCREVE UM VALOR DE RAIZ (v3, 22.08.2026; ISSUES I11).
 *
 * Até aqui esta folha era a única superfície do sítio fora da letra da
 * constituição: pilhas de tipos do sistema em literal, e duas cores escritas à
 * mão. Passa a ler tudo o que usa, na construção:
 *
 *   `src/styles/tokens.css`   a paleta clara do `:root` (`--paper`, `--ink`,
 *                             `--g1`, `--g3`), as pilhas de recuo (`--f-prosa`,
 *                             `--f-versal`) e as duas fichas `@font-face` das
 *                             letras que a faixa de facto usa;
 *   `src/styles/site.css`     a composição da marca (`.wordmark`, com o corpo
 *                             da cabeça interior de `.masthead-compact
 *                             .wordmark`) e a da sobrancelha (`.eyebrow`).
 *
 * Se uma ficha mudar de nome, o parser morre e a construção pára: é essa a
 * diferença entre ler e copiar. O que aqui se escreve é a FORMA da faixa (uma
 * linha, caixa flexível, a porta de volta à direita), e nunca um valor da casa.
 *
 * OS TIPOS SÃO PEDIDOS A ESTE DOMÍNIO, e a promessa muda de palavra sem mudar
 * de sentido: era «nenhum pedido de rede», passa a «nenhum pedido para fora
 * deste domínio». Os dois `@font-face` apontam para `/tipos/…`, que é o mesmo
 * anfitrião que serve o documento, e a conferência do portão (que procura `//`)
 * continua a dar zero. `font-display: swap` vem das fichas e é conferido aqui:
 * enquanto o ficheiro não chega, lê-se pela pilha de recuo.
 */
const FOLHA_TOKENS = 'src/styles/tokens.css';
const FOLHA_SITE = 'src/styles/site.css';

/**
 * O PESO DO RÓTULO, e porque é que não é o da sobrancelha da casa.
 *
 * `.eyebrow` compõe-se em Spectral SC 600, e a faixa leva só a ficha Regular
 * dessa família: uma terceira letra é peso que o leitor de um documento paga
 * por nada. Pedir 600 sem a ficha de 600 seria pedir ao navegador que engordasse
 * o 400 por conta própria, que é exactamente o que a ficha de Spectral 700 em
 * `tokens.css` existe para impedir. O rótulo fica no peso da letra que a faixa
 * carrega, e o resto da forma da sobrancelha (corpo, entreletra, versaletes,
 * cor) é lido dela.
 */
const PESO_DO_ROTULO = '400';

function morre(porque) {
  throw new Error(
    `documentos: ${porque}\n` +
      `      A faixa não escreve um valor de raiz: lê as cores, as letras e a composição da\n` +
      `      folha da casa, na construção. Se a folha mudou, muda-se aqui o NOME que se lhe\n` +
      `      pede, e nunca o valor.`,
  );
}

/**
 * Onde está um ficheiro do repositório, visto de dentro da construção.
 * A mesma subida de `encontraOrigem()`, e pela mesma razão.
 */
function encontraNoRepositorio(relativo) {
  const candidatos = [];
  const subir = (inicio) => {
    let dir = inicio;
    for (let i = 0; i < 8; i++) {
      candidatos.push(path.join(dir, relativo));
      const acima = path.dirname(dir);
      if (acima === dir) break;
      dir = acima;
    }
  };
  subir(process.cwd());
  subir(path.dirname(fileURLToPath(import.meta.url)));
  for (const c of candidatos) {
    try {
      if (fs.statSync(c).isFile()) return c;
    } catch {
      /* segue */
    }
  }
  return morre(`não encontrei \`${relativo}\` a subir de ${process.cwd()}.`);
}

const semComentarios = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** Os nomes de ficha de um bloco de CSS passam ao prefixo da faixa, e mais nada. */
const comPrefixo = (valor) => valor.replace(/var\(\s*--([a-z0-9-]+)\s*\)/g, 'var(--oedp-$1)');

/** As fichas de um bloco: `--nome` para valor, tal como estão escritas. */
function fichasDe(bloco) {
  const mapa = new Map();
  for (const [, nome, valor] of bloco.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    mapa.set(nome, valor.trim());
  }
  return mapa;
}

/** O corpo de uma regra, pelo selector exacto e não por um que o contenha. */
function regraDe(css, selector, onde) {
  const escapado = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = css.match(new RegExp(`(?:^|\\})\\s*${escapado}\\s*\\{([^{}]*)\\}`));
  if (!m) morre(`não encontrei a regra \`${selector}\` em \`${onde}\`.`);
  return m[1];
}

/** Uma declaração de uma regra, com os nomes de ficha já prefixados. */
function declaracaoDe(bloco, propriedade, selector, onde) {
  const m = bloco.match(new RegExp(`(?:^|;)\\s*${propriedade}\\s*:\\s*([^;]+)`));
  if (!m) morre(`\`${selector}\` (\`${onde}\`) já não declara \`${propriedade}\`.`);
  return comPrefixo(m[1].trim());
}

/**
 * A ficha `@font-face` de uma letra, lida e não reescrita.
 *
 * O endereço do ficheiro sai da própria ficha: retipá-lo era abrir a porta a
 * uma faixa que pede uma letra que já não está no sítio.
 */
function faceDe(css, familia, peso, onde) {
  for (const m of css.matchAll(/@font-face\s*\{([^{}]*)\}/g)) {
    const corpo = m[1].replace(/\s+/g, ' ').trim();
    if ((corpo.match(/font-family\s*:\s*'([^']+)'/) ?? [])[1] !== familia) continue;
    if ((corpo.match(/font-weight\s*:\s*([^;]+)/) ?? [])[1]?.trim() !== peso) continue;
    if ((corpo.match(/font-style\s*:\s*([^;]+)/) ?? [])[1]?.trim() !== 'normal') continue;
    if (!/font-display\s*:\s*swap/.test(corpo)) {
      morre(`a ficha @font-face de "${familia}" ${peso} em \`${onde}\` já não diz \`swap\`.`);
    }
    if (/\/\//.test(corpo)) {
      morre(`a ficha @font-face de "${familia}" ${peso} em \`${onde}\` aponta para fora do domínio.`);
    }
    return `@font-face{${corpo}}`;
  }
  return morre(`não encontrei em \`${onde}\` a ficha @font-face de "${familia}" ${peso} normal.`);
}

/**
 * As fichas que a faixa precisa de declarar, apuradas do que ela de facto pede.
 *
 * Fecha-se sobre si própria: `--muted` é `var(--g1)` em `tokens.css`, e por isso
 * pedir a cor da sobrancelha traz o cinzento atrás. Uma ficha pedida que o
 * `:root` não declara pára a construção.
 */
function fichasNecessarias(css, raiz) {
  const necessarias = new Map();
  const porVer = [...css.matchAll(/var\(\s*--oedp-([a-z0-9-]+)\s*\)/g)].map((m) => m[1]);
  while (porVer.length) {
    const nome = porVer.pop();
    if (necessarias.has(nome)) continue;
    if (!raiz.has(nome)) {
      morre(`a faixa pede \`--${nome}\` e o \`:root\` de \`${FOLHA_TOKENS}\` não o declara.`);
    }
    const valor = comPrefixo(raiz.get(nome));
    necessarias.set(nome, valor);
    for (const m of valor.matchAll(/var\(\s*--oedp-([a-z0-9-]+)\s*\)/g)) porVer.push(m[1]);
  }
  return necessarias;
}

const declaracoes = (pares) => pares.map(([p, v]) => `${p}:${v}`).join(';');

let ESTILO = null;

/**
 * O CSS da faixa, composto uma vez por construção.
 *
 * Selectores por atributo, com o prefixo `oedp-`, para não colidirem com o que
 * quer que o documento tenha; as fichas também, porque um documento pode
 * declarar `--paper` e `--ink` no seu próprio `:root` e declara (o de
 * «Évora, orçamentado, pago, devido» declara os dois).
 *
 * A FAIXA É DE PAPEL, E NÃO SEGUE TEMA NENHUM. A v2 fazia-a escura em qualquer
 * tema, para «se ler contra qualquer fundo». A razão mudou de forma: a página
 * de um documento não carrega `public/js/tema.js`, e por isso a escolha do
 * leitor não é conhecida ali; pela Emenda 12 o sítio é claro para todos até essa
 * escolha; e o papel com o seu fio de tinta lê-se contra os documentos escuros
 * tão bem como a banda escura se lia contra os claros. Não há variante escura,
 * e a sua ausência é uma decisão e não um esquecimento.
 */
function estiloDaFaixa() {
  if (ESTILO) return ESTILO;

  const tokens = semComentarios(fs.readFileSync(encontraNoRepositorio(FOLHA_TOKENS), 'utf8'));
  const site = semComentarios(fs.readFileSync(encontraNoRepositorio(FOLHA_SITE), 'utf8'));

  /* A paleta da faixa, pelo brief: `--paper`, `--ink`, `--g1` e `--g3`. Três
     estão em uso (o cinzento entra pelo `--muted` da sobrancelha); a quarta é
     conferida na mesma, porque o fio passou à tinta com a medição e a hairline
     de `--g3` fica a uma palavra de distância. Uma ficha que desapareça de
     `tokens.css` pára a construção, esteja ou não a ser usada hoje. */
  const raiz = fichasDe(regraDe(tokens, ':root', FOLHA_TOKENS));
  for (const nome of ['paper', 'ink', 'g1', 'g3']) {
    if (!raiz.has(nome)) morre(`\`--${nome}\` já não existe no \`:root\` de \`${FOLHA_TOKENS}\`.`);
  }

  const marca = regraDe(site, '.wordmark', FOLHA_SITE);
  const marcaCompacta = regraDe(site, '.masthead-compact .wordmark', FOLHA_SITE);
  const sobrancelha = regraDe(site, '.eyebrow', FOLHA_SITE);
  const daMarca = (p) => declaracaoDe(marca, p, '.wordmark', FOLHA_SITE);
  const daSobrancelha = (p) => declaracaoDe(sobrancelha, p, '.eyebrow', FOLHA_SITE);

  const corpo = [
    /* A FORMA: uma linha, em caixa flexível, com a porta de volta à direita e,
       abaixo de 640px, em linha própria. Estes são os números da faixa, e os
       únicos escritos aqui: a v2 tinha-os todos e não mudam com a mobília. O
       único número novo em toda a folha é o `flex-basis: 100%` da regra de baixo
       de 640px, que é o que põe a porta de volta em linha própria. */
    ['box-sizing', 'border-box'],
    ['display', 'flex'],
    ['flex-wrap', 'wrap'],
    ['align-items', 'baseline'],
    ['gap', '4px 18px'],
    ['margin', '0'],
    ['padding', '9px 20px'],
    ['line-height', '1.5'],
    /* PAPEL, TINTA, E UM FIO DE TINTA POR BAIXO. Nenhuma cor: a cor da casa é o
       estado de um valor contra um limiar publicado, e isto é mobília.

       O FIO É DE TINTA E NÃO DE `--g3`, E FOI A MEDIÇÃO QUE O DECIDIU. O brief
       da B1 escreve as duas coisas: «a 1px `--g3` rule under the banner» na
       forma, e «the paper band with its ink rule, which reads against the
       documents» na razão. Medidos os quinze documentos alojados: em claro, que
       é o que a Emenda 12 fixa para todos, o papel da faixa contra o fundo do
       documento mede de 1,01:1 a 1,08:1, e um fio de `--g3` sobre papel mede
       1,28:1. Com esse fio, a fronteira entre a moldura da casa e a obra citada
       não existe para quem a tem de ver. Tinta sobre papel mede 16,39:1, e é
       ela que desenha a fronteira, pela mesma razão que o contorno do marcador
       âmbar é uma medição e não desenho (`IDENTIDADE.md` §2). 1px é o fio que a
       faixa já tinha na v2, e é o do aparelho da primeira página
       (`inicio.css`). Assinalado ao lugar de direção: voltar à hairline é uma
       palavra. */
    ['border', '0'],
    ['border-bottom', `1px solid var(--oedp-ink)`],
    ['background', 'var(--oedp-paper)'],
    ['color', 'var(--oedp-ink)'],
    /* A letra da prosa, no corpo da sobrancelha: é a mobília da faixa, e a
       mobília não cresce. */
    ['font-family', daMarca('font-family')],
    ['font-size', daSobrancelha('font-size')],
  ];

  const regras = [
    faceDe(tokens, 'Spectral', daMarca('font-weight'), FOLHA_TOKENS),
    faceDe(tokens, 'Spectral SC', PESO_DO_ROTULO, FOLHA_TOKENS),
    `[data-oedp-faixa]{@@fichas@@${declaracoes(corpo)}}`,
    /* A ISOLAÇÃO QUE A MEDIÇÃO PEDIU, E SÓ ELA.
       Comparado o estilo calculado dos cinco elementos da faixa em cada um dos
       quinze documentos alojados, a 1280 e a 390, contra o mesmo markup numa
       página de controlo, entram três propriedades da folha do documento:
       `box-sizing` (14 dos 15), `text-underline-offset` (6) e `color-scheme`
       (15). As duas primeiras repõem-se aqui; a terceira é herdada do `:root`
       do documento e foi medida sem efeito nenhum sobre a faixa, que declara o
       fundo, a tinta e o fio. Ver `notas/pos-fusao.md` §B1. */
    `[data-oedp-faixa] *{box-sizing:border-box}`,
    `[data-oedp-faixa] a{${declaracoes([
      ['color', 'var(--oedp-ink)'],
      ['background', 'none'],
      ['border', '0'],
      ['padding', '0'],
      ['text-decoration', 'none'],
      ['text-underline-offset', '3px'],
    ])}}`,
    `[data-oedp-faixa] a:hover{text-decoration:underline}`,
    `[data-oedp-faixa] a:focus-visible{outline:2px solid var(--oedp-ink);outline-offset:3px}`,
    `[data-oedp-faixa] span{background:none;border:0;padding:0;margin:0}`,
    /* A marca e o rótulo depois das regras de `a` e de `span`, e com a mesma
       especificidade: o que ganha é a ordem, e é a que aqui está escrita. */
    `[data-oedp-faixa] [data-oedp-marca]{${declaracoes([
      ['font-family', daMarca('font-family')],
      ['font-size', declaracaoDe(marcaCompacta, 'font-size', '.masthead-compact .wordmark', FOLHA_SITE)],
      ['font-weight', daMarca('font-weight')],
      ['line-height', daMarca('line-height')],
      ['letter-spacing', daMarca('letter-spacing')],
      ['font-feature-settings', daMarca('font-feature-settings')],
      ['color', daMarca('color')],
    ])}}`,
    `[data-oedp-faixa] [data-oedp-rotulo]{${declaracoes([
      ['font-family', daSobrancelha('font-family')],
      ['font-size', daSobrancelha('font-size')],
      ['font-weight', PESO_DO_ROTULO],
      ['letter-spacing', daSobrancelha('letter-spacing')],
      ['text-transform', daSobrancelha('text-transform')],
      ['color', daSobrancelha('color')],
    ])}}`,
    `[data-oedp-faixa] [data-oedp-voltar]{margin-left:auto}`,
    `@media (max-width:640px){[data-oedp-faixa] [data-oedp-voltar]{margin-left:0;flex-basis:100%}}`,
  ].join('\n');

  const fichas = fichasNecessarias(regras, raiz);
  const composto = regras.replace(
    '@@fichas@@',
    [...fichas]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([nome, valor]) => `--oedp-${nome}:${valor}`)
      .join(';') + ';',
  );

  /**
   * AS LETRAS DA FAIXA MUDAM DE NOME (segunda passagem, 03.09.2026).
   *
   * A faixa declara dois `@font-face` com os nomes de família da casa,
   * «Spectral» e «Spectral SC», dentro de um documento de outra pessoa. Um
   * documento que declare uma família com o mesmo nome, ou que a peça, fica com
   * duas fichas a disputar o nome, e ganha a última que o navegador ler: a
   * moldura da casa passaria a mexer na letra da obra citada, ou ao contrário.
   * A leitura a frio apontou-o (Blocking 3, «unscoped @font-face rules»).
   *
   * As famílias passam a `oedp-Spectral` e `oedp-Spectral SC`, e o nome muda nos
   * dois sítios ao mesmo tempo, porque a substituição corre sobre a folha já
   * composta: dentro das fichas `@font-face` e dentro das pilhas de tipos que as
   * fichas `--oedp-f-*` trazem. Os nomes de recuo (Georgia, Times New Roman) não
   * se tocam: são famílias do sistema, não são declaradas aqui, e renomeá-las
   * era pedir uma letra que não existe.
   */
  ESTILO = composto
    .replace(/'Spectral SC'/g, "'oedp-Spectral SC'")
    .replace(/'Spectral'/g, "'oedp-Spectral'");
  return ESTILO;
}

/**
 * A faixa, para um estudo e uma língua.
 *
 * NENHUM ALGARISMO no texto: o portão de HTML confere-o, e é essa regra que
 * permite dispensar o corpo do documento do varrimento sem abrir uma porta.
 * Os algarismos do CSS são estilo, não texto, e o portão não os conta.
 *
 * O QUE A FAIXA DIZ, E O QUE DEIXOU DE DIZER (22.08.2026).
 *
 * A linha de autoria («Escrito por IA, dirigido por uma pessoa.») saiu daqui. É
 * a Emenda 11 lida à letra, «o sítio não se explica na mobília», com o teste da
 * Emenda 15: uma frase sobrevive se a sua remoção fizesse um leitor ler mal um
 * número, e esta é autorreferência, não ressalva. O que ela dizia continua dito
 * onde pode ser provado, no Sobre.
 *
 * A PORTA PARA O SOBRE FICA, e não é a mesma coisa. A regra 9 do Método é texto
 * governado e diz que «todas as páginas construídas levam a porta para lá»; o
 * portão confere-a nesta faixa, porque o ramo dos documentos devolve antes da
 * conferência geral (`gate-html.mjs`, «A PORTA PARA O SOBRE, TAMBÉM AQUI»). Uma
 * porta é navegação, uma frase sobre a casa é mobília a explicar-se: sai a
 * segunda e fica a primeira. A faixa é markup nosso e não entra na comparação
 * com a origem: entra no `esperado` que o portão recalcula, dos dois lados da
 * igualdade, e por isso nada disto toca num byte do documento.
 *
 * O `lang` da faixa é o da edição, e o `aria-label` é o rótulo: assim quem ouve
 * a página ouve a faixa nomeada, e não uma tira de ligações sem dono.
 */
export function faixa(slug, lang) {
  const s = t(lang);
  const destino = routePath('estudo', lang, { slug });
  const rotulo = s.estudos.documentoFaixa;
  /**
   * A PORTA DA LEITURA NO SÍTIO (bloco B, item B2; achado C4 e Codex 10).
   *
   * Quem escolhe «Ler o documento →» cai aqui e encontra a edição de registo,
   * que é outra letra, outra cabeça e o vocabulário da produção antes do
   * assunto. A faixa dizia de onde voltar e não dizia que o mesmo documento
   * existe composto no sítio. Passa a dizê-lo, quando existe: há registo de
   * conteúdo para oito edições, e onde não há não há página — a porta não se
   * rende, pela mesma regra da página do estudo («a ausência diz-se por
   * ausência, não por uma frase»).
   */
  const rotaDoTexto = temRegisto(slug, lang) ? routePath('texto', lang, { slug }) : null;
  /**
   * O RÓTULO DE IA, com o texto aprovado e a porta para a política.
   *
   * É a MESMA cadeia que `RotuloDeIA.astro` rende no rodapé de todas as outras
   * páginas, lida do mesmo ficheiro e não retipada aqui: `textoDoRotulo()`
   * compõe-na dos três pedaços, e o portão compara-a carácter a carácter dos
   * dois lados. O nome de quem responde é português e leva a sua marca de
   * língua nas edições inglesas, pela regra da §1.82.
   *
   * NÃO TRAZ UM ÚNICO ALGARISMO, e é por isso que cabe aqui: a regra da faixa
   * («nenhum algarismo no seu texto») é o que permite dispensar o corpo do
   * documento do varrimento, e o rótulo não a toca.
   */
  const r = ROTULO[lang];
  const politica = `${routePath('metodo', lang)}#${ANCORA_DA_POLITICA}`;
  const linguaDoNome = lang === 'pt' ? '' : ` lang="${atributo(LINGUA_DO_RESPONSAVEL)}"`;

  return [
    `<div data-oedp-faixa lang="${atributo(s.lang)}" aria-label="${atributo(rotulo)}">`,
    `<style>${estiloDaFaixa()}</style>`,
    `<a data-oedp-marca href="${atributo(destino)}">${texto(SITE_NAME)}</a>`,
    `<span data-oedp-rotulo>${texto(rotulo)}</span>`,
    `<span data-oedp-rotulo-ia>${texto(r.antes)}` +
      `<a href="${atributo(politica)}">${texto(r.porta)}</a>${texto(r.depois)}` +
      `<span data-oedp-rotulo-nome${linguaDoNome}>${texto(RESPONSAVEL_EDITORIAL)}</span></span>`,
    ...(rotaDoTexto
      ? [`<a data-oedp-texto href="${atributo(rotaDoTexto)}">${texto(s.estudos.textoLink)} →</a>`]
      : []),
    `<a data-oedp-sobre href="${atributo(routePath('sobre', lang))}">${texto(s.nav.sobre)}</a>`,
    `<a data-oedp-voltar href="${atributo(destino)}">${texto(s.estudos.documentoVoltar)} ↑</a>`,
    '</div>',
  ].join('');
}

/**
 * A MARCA DOS ROBÔS, escrita uma vez e comparada pelo portão.
 *
 * `noindex` tira o documento dos motores de busca; `follow` deixa que as
 * ligações que ele traz continuem a contar, porque o que aqui se recusa é a
 * indexação DESTE ficheiro e não a existência das fontes que ele cita.
 */
export const MARCA_DOS_ROBOS = '<meta name="robots" content="noindex, follow">';

/**
 * ---------------------------------------------------------------------------
 * ONDE UMA ETIQUETA É UMA ETIQUETA (segunda passagem, 03.09.2026)
 * ---------------------------------------------------------------------------
 * A primeira passagem procurava `<html`, `<head` e `<body` com uma expressão
 * regular sobre o ficheiro inteiro, e a leitura a frio mostrou o que isso
 * abria: texto com forma de etiqueta dentro de um comentário, de um `<script>`
 * ou de um `<style>` escolhe o ponto de inserção, e a marca da casa vai parar
 * ao meio de outra coisa. Um dos dezasseis documentos tem mesmo um segundo
 * `<html lang="pt-PT">` na linha 3, que não é a raiz.
 *
 * Estas duas funções resolvem-no sem trazer um analisador: marcam as zonas
 * OPACAS (comentário, guião, folha) e recusam qualquer correspondência que caia
 * lá dentro. A etiqueta tem ainda de estar nos primeiros 4 KB e antes do
 * primeiro `<body`, que é onde a raiz e a cabeça de um documento HTML vivem.
 */
const LIMITE_DA_CABECA = 4096;

/** Os intervalos `[inicio, fim)` que não são markup. */
function zonasOpacas(texto) {
  const zonas = [];
  const padroes = [
    /<!--[\s\S]*?(?:-->|$)/g,
    /<script\b[^>]*>[\s\S]*?(?:<\/script\s*>|$)/gi,
    /<style\b[^>]*>[\s\S]*?(?:<\/style\s*>|$)/gi,
  ];
  for (const re of padroes) {
    for (const m of texto.matchAll(re)) zonas.push([m.index, m.index + m[0].length]);
  }
  return zonas;
}

const dentroDe = (zonas, i) => zonas.some(([de, ate]) => i >= de && i < ate);

/**
 * A primeira ocorrência REAL de uma etiqueta de abertura.
 * @returns {{ inicio: number, fim: number, atributos: string } | null}
 */
function etiquetaReal(texto, nome, zonas, { ate = Infinity, antesDe = Infinity } = {}) {
  for (const m of texto.matchAll(new RegExp(`<${nome}\\b([^>]*)>`, 'gi'))) {
    if (m.index >= ate || m.index >= antesDe) return null;
    if (dentroDe(zonas, m.index)) continue;
    return { inicio: m.index, fim: m.index + m[0].length, atributos: m[1] };
  }
  return null;
}

/**
 * Uma marca `robots` do autor, em QUALQUER grafia: aspas duplas, simples ou
 * nenhumas, e espaço à volta do `=`. A primeira passagem procurou só
 * `name="robots"` e disse que nenhum dos dezasseis trazia uma, o que era uma
 * conclusão tirada de uma busca estreita.
 */
const ROBOS_DO_AUTOR =
  /<meta\b[^>]*\bname\s*=\s*(?:"\s*robots\s*"|'\s*robots\s*'|robots(?=[\s/>]))[^>]*>/i;

/** Uma declaração de codificação do autor, a seguir à qual a casa escreve. */
const CHARSET_DO_AUTOR =
  /<meta\b[^>]*(?:\bcharset\s*=|\bhttp-equiv\s*=\s*['"]?\s*content-type)[^>]*>/i;

const recusa = (slug, lang, porque) => {
  throw new Error(`documentos: o documento "${slug}" (${lang}) ${porque}`);
};

/**
 * As duas marcas que vivem ACIMA do `<body>`: a língua do `<html>` e a marca
 * dos robôs no `<head>`.
 *
 * A LÍNGUA FICA EXACTA, e as três saídas estão escritas na cabeça do ficheiro:
 * acrescenta-se onde falta, normaliza-se a forma da mesma língua, recusa-se o
 * resto. Uma etiqueta vazia (`lang=""`) é uma declaração que não declara nada e
 * é recusada; uma de outra língua diz que o ficheiro não é o que o arquivo diz
 * que é, e também.
 *
 * A MARCA DOS ROBÔS ENTRA A SEGUIR AO CHARSET DO AUTOR, quando ele existe. A
 * norma manda a declaração de codificação caber nos primeiros 1 024 bytes do
 * ficheiro, e enfiar a nossa marca antes dela empurra-a para a frente: com
 * documentos de até 1 MB isso é mexer na maneira como o ficheiro se descodifica,
 * que é a coisa que estas páginas mais têm de proteger. Sem charset declarado, a
 * marca vai logo a seguir ao `<head>`.
 *
 * E UM DOCUMENTO QUE JÁ TRAGA A SUA MARCA `robots` É RECUSADO, não duplicado:
 * duas marcas numa página são ambíguas para um rastreador, e escolher por ele
 * qual vale seria a casa a decidir uma coisa do autor.
 *
 * @param {string} bruto o ficheiro tal como está em studies-src/
 * @param {{ slug: string, lang: string }} onde
 */
export function comMarcasDaCasa(bruto, { slug, lang }) {
  const s = t(lang);
  const zonas = zonasOpacas(bruto);
  const corpo = etiquetaReal(bruto, 'body', zonas);
  const ate = Math.min(LIMITE_DA_CABECA, bruto.length);
  const antesDe = corpo ? corpo.inicio : Infinity;

  const html = etiquetaReal(bruto, 'html', zonas, { ate, antesDe });
  if (!html) {
    recusa(slug, lang, 'não tem um `<html>` de verdade nos primeiros 4 KB, antes do `<body>`.');
  }

  /* A língua: acrescentar, normalizar, ou recusar. */
  let saida = bruto;
  const declarada = html.atributos.match(/\blang\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i);
  const valor = declarada ? (declarada[1] ?? declarada[2] ?? declarada[3] ?? '').trim() : null;
  if (valor === null) {
    saida =
      bruto.slice(0, html.inicio) +
      `<html lang="${atributo(s.lang)}"${html.atributos}>` +
      bruto.slice(html.fim);
  } else if (valor !== s.lang) {
    if (!valor || valor.split('-')[0].toLowerCase() !== s.lang.split('-')[0].toLowerCase()) {
      recusa(
        slug,
        lang,
        `declara \`lang="${valor}"\` e é a edição "${lang}", que a casa escreve "${s.lang}".\n` +
          `      Uma etiqueta vazia não declara nada, e uma de outra língua diz que este ficheiro ` +
          `não é o que o arquivo diz que é. Nenhuma das duas se conserta em passagem: ou o ` +
          `documento está na pasta errada, ou a etiqueta dele está errada.`,
      );
    }
    /* A MESMA LÍNGUA, NOUTRA FORMA: normaliza-se, e diz-se porquê. «pt» e
       «pt-PT» dizem português, e o portão exige a etiqueta exacta da edição nos
       dezasseis. Preservar a forma do autor e exigir a raiz no portão era um
       contrato a duas vozes (leitura a frio de 03.09, Major 5). Fecha-se do
       lado estrito, e o que se muda é a FORMA de uma etiqueta de metadados,
       acima do `<head>`: nenhum byte do corpo se move. */
    saida =
      bruto.slice(0, html.inicio) +
      `<html${html.atributos.slice(0, declarada.index)}lang="${atributo(s.lang)}"` +
      `${html.atributos.slice(declarada.index + declarada[0].length)}>` +
      bruto.slice(html.fim);
  }

  /* A marca dos robôs. As zonas recalculam-se: a língua pode ter mudado o
     comprimento da etiqueta e todos os índices com ela. */
  const zonas2 = zonasOpacas(saida);
  const corpo2 = etiquetaReal(saida, 'body', zonas2);
  const cabeca = etiquetaReal(saida, 'head', zonas2, {
    ate: Math.min(LIMITE_DA_CABECA, saida.length),
    antesDe: corpo2 ? corpo2.inicio : Infinity,
  });
  if (!cabeca) {
    recusa(slug, lang, 'não tem um `<head>` de verdade nos primeiros 4 KB, antes do `<body>`.');
  }

  const daCabeca = saida.slice(cabeca.fim, corpo2 ? corpo2.inicio : saida.length);
  const jaTem = daCabeca.match(ROBOS_DO_AUTOR) ?? saida.match(ROBOS_DO_AUTOR);
  if (jaTem) {
    recusa(
      slug,
      lang,
      `já traz uma marca \`robots\` sua: ${JSON.stringify(jaTem[0].slice(0, 120))}.\n` +
        `      A casa não lhe acrescenta uma segunda: duas marcas \`robots\` numa página são ` +
        `ambíguas para um rastreador, e escolher por ele qual vale era decidir uma coisa do autor.`,
    );
  }

  const charset = daCabeca.match(CHARSET_DO_AUTOR);
  const onde = charset ? cabeca.fim + charset.index + charset[0].length : cabeca.fim;
  return saida.slice(0, onde) + MARCA_DOS_ROBOS + saida.slice(onde);
}

/**
 * A região do `<head>` de um ficheiro construído, em índices de cadeia.
 *
 * O portão precisa dela para exigir que a marca dos robôs esteja DENTRO da
 * cabeça e não em qualquer sítio do documento. Pergunta-se por posição e não à
 * árvore do analisador: um documento alojado pode ter markup que um analisador
 * arrume de outra maneira, e o que aqui se quer saber é onde a marca está no
 * ficheiro que o rastreador vai ler.
 *
 * @returns {{ de: number, ate: number } | null}
 */
export function regiaoDaCabeca(texto) {
  const zonas = zonasOpacas(texto);
  const corpo = etiquetaReal(texto, 'body', zonas);
  const cabeca = etiquetaReal(texto, 'head', zonas, {
    ate: Math.min(LIMITE_DA_CABECA, texto.length),
    antesDe: corpo ? corpo.inicio : Infinity,
  });
  if (!cabeca) return null;
  return { de: cabeca.fim, ate: corpo ? corpo.inicio : texto.length };
}

/**
 * ---------------------------------------------------------------------------
 * A PROVA DOS BYTES, POR FATIAS E NÃO POR RECÁLCULO (segunda passagem)
 * ---------------------------------------------------------------------------
 * O portão comparava o construído com `documentoServido()`, e a leitura a frio
 * apontou o que essa igualdade prova de facto: que o transformador é
 * DETERMINÍSTICO. Se ele corromper um documento, corrompe os dois lados da
 * igualdade e a comparação continua verde.
 *
 * Esta prova é independente porque não passa pelo transformador: lê os bytes do
 * ficheiro de origem, lê os bytes do ficheiro construído, e compara FATIAS.
 *
 *   · a cauda: os bytes do construído a seguir à faixa têm de ser, byte a byte,
 *     os bytes do original a seguir ao seu `<body>`. Como a faixa é a última
 *     coisa que a casa insere e nada se acrescenta abaixo dela, o construído
 *     TERMINA com essa cauda, e a comparação é uma subtracção de comprimentos;
 *   · a cabeça: tirar do construído a única ocorrência de `MARCA_DOS_ROBOS`
 *     devolve, entre o `<head>` e o `<body>`, exactamente os bytes do original
 *     entre os seus.
 *
 * Devolve `null` quando está bem, ou a frase do que falhou.
 */
export function provaDosBytes(bruto, construido) {
  const bufO = Buffer.from(bruto, 'utf8');
  const bufC = Buffer.from(construido, 'utf8');
  const bytesAte = (texto, i) => Buffer.byteLength(texto.slice(0, i), 'utf8');

  const corpoO = etiquetaReal(bruto, 'body', zonasOpacas(bruto));
  if (!corpoO) return 'o original não tem um `<body>` de verdade.';

  /* A cauda. */
  const cauda = bufO.subarray(bytesAte(bruto, corpoO.fim));
  if (bufC.length < cauda.length) {
    return `o construído (${bufC.length} bytes) é mais curto do que a cauda do original (${cauda.length}).`;
  }
  const caudaC = bufC.subarray(bufC.length - cauda.length);
  if (Buffer.compare(cauda, caudaC) !== 0) {
    let i = 0;
    while (i < cauda.length && cauda[i] === caudaC[i]) i++;
    return (
      `os bytes abaixo da faixa não são os do original: diferem no byte ${i} da cauda ` +
      `(original ${cauda[i]}, construído ${caudaC[i]}).`
    );
  }

  /* A cabeça. */
  const semRobos = construido.split(MARCA_DOS_ROBOS);
  if (semRobos.length !== 2) {
    return `esperava exactamente uma marca dos robôs no construído e encontrei ${semRobos.length - 1}.`;
  }
  const reposto = semRobos.join('');
  const cabecaO = etiquetaReal(bruto, 'head', zonasOpacas(bruto), { antesDe: corpoO.inicio });
  const zonasR = zonasOpacas(reposto);
  const corpoR = etiquetaReal(reposto, 'body', zonasR);
  const cabecaR = etiquetaReal(reposto, 'head', zonasR, { antesDe: corpoR ? corpoR.inicio : Infinity });
  if (!cabecaO || !cabecaR) return 'não encontrei o `<head>` dos dois lados para comparar.';
  const entreO = bufO.subarray(bytesAte(bruto, cabecaO.fim), bytesAte(bruto, corpoO.inicio));
  const bufR = Buffer.from(reposto, 'utf8');
  const entreR = bufR.subarray(bytesAte(reposto, cabecaR.fim), bytesAte(reposto, corpoR.inicio));
  if (Buffer.compare(entreO, entreR) !== 0) {
    return `os bytes entre o \`<head>\` e o \`<body>\` não são os do original depois de tirar a marca dos robôs.`;
  }
  return null;
}

/**
 * O documento com a faixa por cima.
 *
 * A faixa entra logo a seguir ao `<body>`, que é o único sítio onde não
 * atravessa nada: acima dela fica o `<head>` do documento, intacto; abaixo,
 * o documento inteiro, byte a byte.
 *
 * @param {string} bruto o ficheiro tal como está em studies-src/
 * @param {{ slug: string, lang: string }} onde
 */
export function comFaixa(bruto, { slug, lang }) {
  const marca = faixa(slug, lang);

  /* O `<body>` DE VERDADE, e sem recuo para o `</head>`. A primeira passagem
     aceitava um documento sem `<body>` e punha a faixa a seguir ao `</head>`,
     onde ela fica fora do corpo e a prova da cauda deixa de ter âncora. Os
     dezasseis têm `<body>`; um que não tenha é um ficheiro que ninguém
     conferiu, e diz-se em vez de se remendar. */
  const corpo = etiquetaReal(bruto, 'body', zonasOpacas(bruto));
  if (corpo) {
    return bruto.slice(0, corpo.fim) + marca + bruto.slice(corpo.fim);
  }

  throw new Error(
    `documentos: o documento "${slug}" (${lang}) não tem um <body> de verdade, e a faixa não ` +
      `sabe onde entrar. Um documento de estudo é um ficheiro HTML completo e auto-contido.`,
  );
}

/**
 * O que é servido em `/estudos/<slug>/documento`.
 * É também o que o portão recalcula para conferir que o que foi construído é o
 * documento de origem mais a faixa, e nada mais.
 */
export function documentoServido(slug, lang) {
  const doc = documentoDaEdicao(slug, lang);
  if (!doc) {
    throw new Error(`documentos: não há documento para "${slug}" na edição "${lang}".`);
  }
  if (!workById(slug)) {
    throw new Error(`documentos: "${slug}" não é um trabalho do arquivo.`);
  }
  /**
   * A IDA E VOLTA DOS BYTES, ANTES DE TOCAR EM NADA (segunda passagem).
   *
   * Tudo o que se segue trata o documento como uma cadeia de JavaScript, isto é,
   * como UTF-8 descodificado. Para um ficheiro que não seja UTF-8 válido, ou que
   * esteja noutra codificação, essa descodificação já perdeu bytes antes de
   * qualquer inserção, e a prova das fatias compararia o estrago consigo próprio.
   * Lê-se o ficheiro duas vezes, em bytes e em texto, e exige-se que o texto
   * reescrito dê os MESMOS bytes. Um documento que não faça a volta é recusado,
   * e nunca transformado.
   */
  const bytes = fs.readFileSync(doc.ficheiro);
  const bruto = bytes.toString('utf8');
  if (Buffer.compare(Buffer.from(bruto, 'utf8'), bytes) !== 0) {
    throw new Error(
      `documentos: o documento "${slug}" (${lang}) não sobrevive à ida e volta por UTF-8: ` +
        `${bytes.length} bytes lidos, ${Buffer.byteLength(bruto, 'utf8')} bytes reescritos.\n` +
        `      Ou não é UTF-8, ou traz bytes que não são UTF-8 válido. A casa não o transforma: ` +
        `qualquer marca que lhe acrescentasse viajaria com o resto do ficheiro já alterado.`,
    );
  }

  const construido = comFaixa(comMarcasDaCasa(bruto, { slug, lang }), { slug, lang });

  const falha = provaDosBytes(bruto, construido);
  if (falha) {
    throw new Error(
      `documentos: a transformação de "${slug}" (${lang}) não preservou os bytes do original.\n` +
        `      ${falha}`,
    );
  }
  return construido;
}
