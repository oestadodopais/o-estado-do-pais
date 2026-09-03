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
 *   ****  O DOCUMENTO NÃO É REESCRITO. NEM UM BYTE DELE MUDA, NEM SE MOVE  ****
 *   ****  DE ORDEM: nem estilos, nem scripts, nem uma vírgula. O que a casa ****
 *   ****  faz é ACRESCENTAR markup seu à volta, e a prova das fatias        ****
 *   ****  subtrai-o e compara byte a byte o que fica.                       ****
 *
 * A REGRA MUDOU DE PALAVRAS E NÃO DE SENTIDO (03.09.2026, bloco F1.8). Até aqui
 * dizia «abaixo da faixa não se mexe um byte», porque a faixa era a última coisa
 * que a casa inseria. Com a moldura, o corpo do documento passa a estar DENTRO
 * de um elemento da casa, e a frase antiga passaria a ser falsa à letra e
 * verdadeira na intenção. O que se promete, e o que o provador confere, é o que
 * está escrito acima: os bytes do documento são os mesmos, na mesma ordem, e o
 * que a casa acrescenta é uma abertura e um fecho de comprimento conhecido.
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
  /** @type {string[]} */
  const candidatos = [];
  if (process.env.OEDP_STUDIES_DIR) candidatos.push(process.env.OEDP_STUDIES_DIR);

  /** @param {string} inicio */
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
  /** @type {{ slug: string, lang: string, ficheiro: string, rota: string }[]} */
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
      /* `nomesValidos` é `Object.values(FICHEIRO_DA_EDICAO)` e a conferência de cima já
         atirou se o nome não for um deles: aqui a edição existe sempre. */
      const lang = /** @type {Lingua} */ (LANGS.find((l) => FICHEIRO_DA_EDICAO[l] === ficheiro));
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

/**
 * Os documentos de um estudo. É isto que a página do estudo pergunta.
 *
 * @param {string} slug
 */
export function documentosDoEstudo(slug) {
  return todosOsDocumentos().filter((d) => d.slug === slug);
}

/**
 * O documento de uma edição, ou null.
 *
 * @param {string} slug
 * @param {string} lang
 */
export function documentoDaEdicao(slug, lang) {
  return todosOsDocumentos().find((d) => d.slug === slug && d.lang === lang) ?? null;
}

/* ------------------------------------------------------------------- faixa */

/**
 * Escape de atributo. Os slugs são [a-z0-9-], mas nada aqui confia nisso.
 *
 * @param {unknown} s
 */
function atributo(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

/** @param {unknown} s */
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

/**
 * @param {string} porque
 * @returns {never}
 */
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
 *
 * @param {string} relativo
 */
function encontraNoRepositorio(relativo) {
  /** @type {string[]} */
  const candidatos = [];
  /** @param {string} inicio */
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

/** @param {string} css */
const semComentarios = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/**
 * Os nomes de ficha de um bloco de CSS passam ao prefixo da faixa, e mais nada.
 *
 * @param {string} valor
 */
const comPrefixo = (valor) => valor.replace(/var\(\s*--([a-z0-9-]+)\s*\)/g, 'var(--oedp-$1)');

/**
 * As fichas de um bloco: `--nome` para valor, tal como estão escritas.
 *
 * @param {string} bloco
 */
function fichasDe(bloco) {
  /** @type {Map<string, string>} */
  const mapa = new Map();
  for (const [, nome, valor] of bloco.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    mapa.set(nome, valor.trim());
  }
  return mapa;
}

/**
 * O corpo de uma regra, pelo selector exacto e não por um que o contenha.
 *
 * @param {string} css
 * @param {string} selector
 * @param {string} onde
 */
function regraDe(css, selector, onde) {
  const escapado = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = css.match(new RegExp(`(?:^|\\})\\s*${escapado}\\s*\\{([^{}]*)\\}`));
  if (!m) morre(`não encontrei a regra \`${selector}\` em \`${onde}\`.`);
  return m[1];
}

/**
 * Uma declaração de uma regra, com os nomes de ficha já prefixados.
 *
 * @param {string} bloco
 * @param {string} propriedade
 * @param {string} selector
 * @param {string} onde
 */
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
 *
 * @param {string} css
 * @param {string} familia
 * @param {string} peso
 * @param {string} onde
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
 *
 * @param {string} css
 * @param {Map<string, string>} raiz
 */
function fichasNecessarias(css, raiz) {
  /** @type {Map<string, string>} */
  const necessarias = new Map();
  const porVer = [...css.matchAll(/var\(\s*--oedp-([a-z0-9-]+)\s*\)/g)].map((m) => m[1]);
  while (porVer.length) {
    /* O `while` acima só entra com a lista não vazia: aqui há sempre nome. */
    const nome = /** @type {string} */ (porVer.pop());
    if (necessarias.has(nome)) continue;
    if (!raiz.has(nome)) {
      morre(`a faixa pede \`--${nome}\` e o \`:root\` de \`${FOLHA_TOKENS}\` não o declara.`);
    }
    const valor = comPrefixo(/** @type {string} */ (raiz.get(nome)));
    necessarias.set(nome, valor);
    for (const m of valor.matchAll(/var\(\s*--oedp-([a-z0-9-]+)\s*\)/g)) porVer.push(m[1]);
  }
  return necessarias;
}

/** @param {string[][]} pares */
const declaracoes = (pares) => pares.map(([p, v]) => `${p}:${v}`).join(';');

/** @type {string | null} */
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
  /** @param {string} p */
  const daMarca = (p) => declaracaoDe(marca, p, '.wordmark', FOLHA_SITE);
  /** @param {string} p */
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
 *
 * @param {string} slug
 * @param {Lingua} lang
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

/**
 * Os intervalos `[inicio, fim)` que não são markup.
 *
 * @param {string} texto
 * @returns {Array<[number, number]>}
 */
function zonasOpacas(texto) {
  /** @type {Array<[number, number]>} */
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

/**
 * @param {Array<[number, number]>} zonas
 * @param {number} i
 */
const dentroDe = (zonas, i) => zonas.some(([de, ate]) => i >= de && i < ate);

/**
 * A primeira ocorrência REAL de uma etiqueta de abertura.
 *
 * @param {string} texto
 * @param {string} nome
 * @param {Array<[number, number]>} zonas
 * @param {{ ate?: number, antesDe?: number }} [limites]
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
 * A primeira ocorrência REAL de uma etiqueta de fecho, com a mesma disciplina
 * da de abertura: fora de comentário, de guião e de folha.
 *
 * Existe para a moldura (bloco F1.8): o `</main>` da casa entra ANTES do
 * primeiro `</body>` de verdade, que é onde o corpo do documento acaba para
 * quem o lê. Não se procura o ÚLTIMO, e a razão está medida: três dos dezasseis
 * documentos trazem `</body></html>` repetido no fim (o `agua-nao-faturada/en`
 * e o `onde-esta-a-agua/en` duas vezes, o `onde-esta-a-agua/pt` três), e um
 * deles tem um segundo `<!doctype html>` inteiro dentro do corpo do primeiro.
 * O analisador do navegador fecha o corpo no primeiro fecho e trata o resto
 * como erro recuperável; a casa fecha a moldura no mesmo sítio.
 *
 * @param {string} texto
 * @param {string} nome
 * @param {Array<[number, number]>} zonas
 * @param {{ desde?: number }} [limites]
 * @returns {{ inicio: number, fim: number } | null}
 */
function fechoReal(texto, nome, zonas, { desde = 0 } = {}) {
  for (const m of texto.matchAll(new RegExp(`</${nome}\\s*>`, 'gi'))) {
    if (m.index < desde) continue;
    if (dentroDe(zonas, m.index)) continue;
    return { inicio: m.index, fim: m.index + m[0].length };
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

/**
 * Uma declaração e não uma seta: só uma declaração deixa o verificador de tipos
 * saber que a chamada não regressa, e é isso que faz as guardas de baixo lerem-se
 * como o que são. Nada mais muda: é privada, não é reatribuída e não usa `this`.
 *
 * @param {string} slug
 * @param {string} lang
 * @param {string} porque
 * @returns {never}
 */
function recusa(slug, lang, porque) {
  throw new Error(`documentos: o documento "${slug}" (${lang}) ${porque}`);
}

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
 * @param {{ slug: string, lang: Lingua }} onde
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
    /* `valor` só deixa de ser nulo quando houve correspondência, e um `match` sem
       `g` traz sempre o índice: os dois moldes dizem isso e nada muda no que corre. */
    const decl = /** @type {RegExpMatchArray} */ (declarada);
    const indiceDeclarado = /** @type {number} */ (decl.index);
    saida =
      bruto.slice(0, html.inicio) +
      `<html${html.atributos.slice(0, indiceDeclarado)}lang="${atributo(s.lang)}"` +
      `${html.atributos.slice(indiceDeclarado + decl[0].length)}>` +
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
  const onde = charset
    ? cabeca.fim + /** @type {number} */ (charset.index) + charset[0].length
    : cabeca.fim;
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
/** @param {string} texto */
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
 * ===========================================================================
 * A MOLDURA (bloco F1.8, 03.09.2026)
 * ===========================================================================
 *
 * A faixa diz o que o leitor está a ver. A MOLDURA é o que fica à volta do que
 * ele lê, e entrou porque a auditoria de 02.09.2026 mediu quatro coisas que a
 * faixa sozinha não conserta:
 *
 *   · o documento não tem `<main>`, e quem usa um leitor de ecrã não tem para
 *     onde saltar: treze dos dezasseis não trazem nenhum, e a faixa da casa
 *     ficava a ser a primeira coisa que se ouve, sempre;
 *   · o texto das tabelas mede abaixo de 4,5:1 (o pior, medido, 2,13:1 em treze
 *     células de `evora-quinze-anos-cinco-mandatos`, que é o número que a
 *     auditoria escreveu);
 *   · as caixas que se deslocam de lado não se focam, e portanto não se
 *     deslocam com o teclado (quarenta e oito nós, nos dois temas);
 *   · e um filete de cor fora da paleta da casa, medido `#16556E` em claro e
 *     `#6FB3CC` em escuro, no fio por baixo do `<h1>`, na barra do `h2::before`
 *     e no topo de duas classes de célula.
 *
 * O QUE A MOLDURA É, EM MARKUP. Três coisas, todas ACIMA do corpo, e um fecho:
 *
 *   <body>  [a faixa]  <style>a folha</style><script>o guião</script>
 *           <main data-oedp-moldura>   … o documento, byte a byte …   </main>
 *           </body>
 *
 * NENHUM BYTE DO DOCUMENTO SE MOVE. O corpo entra inteiro entre a abertura e o
 * fecho, e é isso que a prova das fatias confere: quatro subtracções de sufixo,
 * a última das quais compara os bytes do corpo do original com os bytes do
 * corpo do construído. Um carácter mudado no meio do documento faz essa
 * comparação cair, e é o conhecido-positivo que a régua planta.
 *
 * PORQUE É UM `<div>` EM TRÊS DELES. Três documentos já trazem um `<main>` seu
 * (`evora-economia-investidores-portas-abertas-2026/pt`, `alentejo-algarve/en`
 * e `which-door-is-yours/en`). Um `<main>` dentro de outro é markup inválido e
 * dois marcos principais numa página são um defeito, não uma melhoria: nesses,
 * a moldura é um `<div>` com a mesma marca, o marco continua a ser o do autor,
 * e a folha da casa tem na mesma onde se agarrar. A escolha lê-se do documento
 * de origem e o provador refá-la por si, sem passar pelo transformador.
 *
 * O QUE A FOLHA MUDA, E O QUE NÃO MUDA. Muda quatro coisas medidas: a cor dos
 * filetes da grelha das tabelas e da caixa que envolve uma tabela, a cor do
 * texto das células, o fio do `<h1>` e a barra do `h2::before`. Não toca nas
 * cores com que a obra citada codifica os seus dados: as barras dos gráficos,
 * os selos, as etiquetas de tipo de fonte e os fios de severidade das notas
 * ficam como o autor os escreveu, porque recolori-los era a casa a reescrever o
 * que cita. O que ficou por corrigir está contado no relatório do bloco.
 *
 * A REGRA DE CIMA GANHOU UMA EXCEPÇÃO, MEDIDA (segunda passagem, 03.09.2026,
 * Blocking 4). Corrigido tudo o resto, sobravam 1 111 nós `color-contrast`
 * graves nos dezasseis, todos do texto das PRÓPRIAS obras contra o fundo que
 * elas próprias compõem — nunca as barras dos gráficos, nunca os fios de
 * severidade, só o texto. Achatar essas cores para a tinta da casa apagava o
 * código com que uma obra distingue tipos de fonte e níveis; a decisão do
 * lugar de direção foi outra: onde uma cor do texto falha 4,5:1 (ou um objeto
 * de interface falha 3:1), substitui-se pela sombra mais próxima da MESMA
 * matiz e saturação que passa, mais escura em claro e mais clara em escuro —
 * nunca por uma cor nova, sempre pela mesma obra, só legível. Ver
 * `AJUSTES_DE_COR` e `estiloDosAjustesDeCor()`, logo a seguir a esta função.
 *
 * `!important` E PORQUÊ. As folhas dos dezasseis declaram os seus filetes por
 * classe (`.table-shell td`, `.tablewrap`), e uma corrida de especificidade
 * contra dezasseis folhas de outra gente é uma corrida que se perde no
 * documento décimo sétimo. A moldura declara-se autoritária nas quatro
 * propriedades que mede, e em mais nenhuma.
 */

/**
 * As duas formas da moldura. A abertura leva a marca; o fecho é a etiqueta nua,
 * e é por isso que os dois são cadeias fixas: o provador subtrai-as por bytes.
 */
export const MOLDURA = {
  /** O documento não traz `<main>`: a casa põe o seu. */
  propria: { abre: '<main data-oedp-moldura>', fecha: '</main>' },
  /** O documento já traz `<main>`: a casa envolve sem duplicar o marco. */
  aninhada: { abre: '<div data-oedp-moldura>', fecha: '</div>' },
};

/**
 * Qual das duas formas serve este documento, lido do documento e de mais nada.
 *
 * @param {string} bruto
 * @returns {{ abre: string, fecha: string }}
 */
export function molduraDe(bruto) {
  return etiquetaReal(bruto, 'main', zonasOpacas(bruto)) ? MOLDURA.aninhada : MOLDURA.propria;
}

/**
 * O LIMIAR DOS OBJETOS DE INTERFACE, e porque o filete NÃO é `--g3`.
 *
 * A folha da casa nomeia dois cinzentos para fios: `--rule` (que é `--g3`) e
 * `--rule-strong` (que é `--g2`). Medidos contra o papel da casa: `--g3` dá
 * 1,28:1 em claro e 1,67:1 em escuro, e a própria `tokens.css` os anota como
 * «decoração»; `--g2` dá 3,47:1 em claro e 5,80:1 em escuro. A medida de
 * aceitação deste bloco pede pelo menos 3:1 nos filetes, que é o que a WCAG
 * 2.1 §1.4.11 pede a um objeto de interface, e por isso o filete da moldura é
 * `--rule-strong` e não `--rule`. É a mesma escolha, pela mesma razão, que o
 * F0.7 fez no fio da faixa quando mediu `--g3` a 1,28:1 e passou à tinta.
 */
const FICHA_DO_FILETE = 'rule-strong';

/** A ficha da tinta, para o texto das células. */
const FICHA_DA_TINTA = 'ink';

/** @type {string | null} */
let ESTILO_DA_MOLDURA = null;

/**
 * A folha da moldura, composta uma vez por construção.
 *
 * A MOLDURA SEGUE O TEMA DO DOCUMENTO, e a faixa não. Não é uma incoerência: a
 * faixa declara o seu papel e a sua tinta e lê-se contra qualquer fundo, e a
 * Emenda 12 fixa o claro para as páginas DA CASA. A moldura escreve por cima
 * das cores de uma obra que segue `prefers-color-scheme` (medido: os dezasseis
 * escurecem por essa consulta, sete deles com a guarda `[data-theme="light"]`).
 * Uma moldura que pintasse tinta escura por cima de um documento escuro tirava
 * a leitura a quem a tem; a guarda é a mesma que os documentos usam, para que
 * as duas folhas nunca digam coisas diferentes ao mesmo leitor.
 *
 * As cores saem de `tokens.css`, do `:root` claro e do `:root[data-theme='dark']`
 * escuro, e nenhuma é escrita aqui: se uma ficha desaparecer da folha da casa, a
 * construção pára.
 */
function estiloDaMoldura() {
  if (ESTILO_DA_MOLDURA) return ESTILO_DA_MOLDURA;

  const tokens = semComentarios(fs.readFileSync(encontraNoRepositorio(FOLHA_TOKENS), 'utf8'));
  const claro = fichasDe(regraDe(tokens, ':root', FOLHA_TOKENS));
  const escuro = fichasDe(regraDe(tokens, ":root[data-theme='dark']", FOLHA_TOKENS));
  for (const nome of [FICHA_DO_FILETE, FICHA_DA_TINTA]) {
    if (!claro.has(nome)) morre(`\`--${nome}\` já não existe no \`:root\` de \`${FOLHA_TOKENS}\`.`);
  }

  const filete = `var(--oedp-${FICHA_DO_FILETE})`;
  const tinta = `var(--oedp-${FICHA_DA_TINTA})`;

  const regras = [
    /* A grelha das tabelas e a caixa que envolve uma tabela. O `:has()` fica em
       regra própria de propósito: num motor que não o conheça, a regra cai
       sozinha e a grelha continua corrigida, em vez de levar as duas atrás. */
    `[data-oedp-moldura] table,[data-oedp-moldura] thead,[data-oedp-moldura] tbody,` +
      `[data-oedp-moldura] tfoot,[data-oedp-moldura] tr,[data-oedp-moldura] th,` +
      `[data-oedp-moldura] td{border-color:${filete}!important}`,
    `[data-oedp-moldura] :has(>table){border-color:${filete}!important}`,
    /* O texto da célula, e SÓ o da célula: um filho que declare a sua cor fica
       com ela, porque nas dezasseis folhas é por aí que a obra citada codifica
       o que os seus selos e etiquetas querem dizer. */
    `[data-oedp-moldura] th,[data-oedp-moldura] td{color:${tinta}!important}`,
    /* O filete de cor. Medido: o fio por baixo do `<h1>` em sete documentos e a
       barra do `h2::before` nos mesmos sete, os dois em `#16556E`. Um
       pseudo-elemento sem `content` não gera caixa nenhuma, e por isso esta
       regra é inerte nos outros nove. */
    `[data-oedp-moldura] h1{border-color:${filete}!important}`,
    `[data-oedp-moldura] h2::before{background-color:${filete}!important}`,
    /* O anel de foco das caixas que o guião torna focáveis. Sem ele, quem chega
       de teclado a uma caixa que se desloca não vê onde está. */
    `[data-oedp-moldura] [tabindex="0"]:focus-visible{outline:2px solid ${tinta};outline-offset:2px}`,
  ].join('\n');

  const necessarias = fichasNecessarias(regras, claro);
  /** @param {Map<string, string>} mapa */
  const escreve = (mapa) =>
    [...mapa]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([nome, valor]) => `--oedp-${nome}:${valor}`)
      .join(';');

  /* As mesmas fichas, com o valor do bloco escuro onde ele as redeclara. Uma
     ficha que o escuro não redeclara herda a do claro, que é o que
     `tokens.css` faz (o `--rule-strong` escuro vem do `--g2` escuro). */
  /** @type {Map<string, string>} */
  const noEscuro = new Map();
  for (const nome of necessarias.keys()) {
    const valor = escuro.get(nome);
    if (valor !== undefined) noEscuro.set(nome, comPrefixo(valor));
  }
  if (noEscuro.size === 0) {
    morre(`o bloco \`:root[data-theme='dark']\` de \`${FOLHA_TOKENS}\` não redeclara nenhuma ficha da moldura.`);
  }

  ESTILO_DA_MOLDURA = [
    `[data-oedp-moldura]{${escreve(necessarias)}}`,
    `@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) [data-oedp-moldura]{${escreve(noEscuro)}}}`,
    regras,
  ].join('\n');
  return ESTILO_DA_MOLDURA;
}

/**
 * ===========================================================================
 * OS AJUSTES DE COR DENTRO DAS OBRAS (Blocking 4, segunda passagem, 03.09.2026)
 * ===========================================================================
 *
 * O relatório do construtor mediu, depois de tudo o que a folha por si só
 * resolve, 1 111 nós `color-contrast` graves nos dezasseis: todos do texto das
 * PRÓPRIAS obras, contra o fundo que elas próprias compõem. Duas hipóteses
 * chegaram ao lugar de direção — reescrever a ficha de cor de cada documento, à
 * mão, ou achatar toda a cor do texto para a tinta da casa — e as duas
 * apagavam o código de cor com que uma obra distingue tipos de fonte, níveis e
 * ligações dentro das suas próprias tabelas.
 *
 * A DECISÃO: nenhuma das duas. Onde uma cor do texto falha 4,5:1 (ou um objeto
 * de interface falha 3:1), a moldura substitui-a pela sombra mais próxima da
 * MESMA matiz e saturação que passa — mais escura em claro, mais clara em
 * escuro — para que a obra continue a distinguir as suas próprias cores, só
 * que todas legíveis. Nunca uma cor nova; sempre a mesma, deslocada o menos
 * que chegue.
 *
 * ONDE A SUBSTITUIÇÃO ENTRA, E PORQUE NÃO PODE PARTIR AS OUTRAS QUINZE. As
 * nove obras com violações compõem o seu texto por uma meia dúzia de FICHAS
 * CSS próprias (`--ink-3`, `--teal`, `--blue`…, cada uma no seu `:root`), não
 * por uma cor escrita em cada nó: `.tag.src{color:var(--teal)}`,
 * `.psub{color:var(--ink-3)}`, e por aí fora — medido ficha a ficha, na fonte,
 * antes de se escrever este código, nunca adivinhado do nome da classe (ver
 * `design/especime-v3/medicoes/moldura-construtor.md`, segunda passagem, §C1).
 * Substituir a FICHA no elemento que a moldura já envolve
 * (`[data-oedp-moldura]`) chega a todos os que a usam — tabela ou não, com
 * classe ou herdada — sem tocar num selector da obra. E como cada documento é
 * o SEU PRÓPRIO ficheiro construído, uma regra escrita para
 * `agua-nao-faturada` simplesmente não existe no ficheiro de
 * `evora-quinze-anos-cinco-mandatos`: o âmbito é o ficheiro que a serve, e não
 * precisa de um atributo novo para o dizer.
 *
 * A DIRECÇÃO É A DO TEMA, NUNCA A PERGUNTA A CADA PAR DE CORES: claro escurece,
 * escuro aclara, sempre. As duas metades só entram quando ESSE tema de facto
 * falha NESSA ficha — a que já passa (o `--olive` escuro da água, o
 * `--algarve` escuro do Alentejo) fica exactamente como a obra a escreveu, dos
 * dois lados, porque o `@media` de cada metade só declara a ficha que precisa
 * dela.
 *
 * OS FUNDOS SÃO OS MEDIDOS, NÃO OS DECLARADOS. Uma mesma ficha aparece contra
 * vários fundos na mesma obra (o papel, um painel, o interior de uma célula); o
 * que está em `AJUSTES_DE_COR` é o PIOR fundo que o axe-core mediu entre os nós
 * que de facto falharam. Passar contra o pior garante passar contra todos os
 * melhores.
 */

/**
 * A meta de contraste do texto (WCAG 2.1 §1.4.3), com uma margem pequena para
 * o arredondamento do axe-core e para o deslize mínimo de um fundo composto
 * por `color-mix()` quando a ficha que o alimenta também muda (`.tag.src`, por
 * exemplo, tem o seu PRÓPRIO fundo tingido de `--teal`).
 */
const ALVO_TEXTO_DA_OBRA = 4.5 + 0.05;

/**
 * Uma correcção medida: a ficha CSS da obra, o tema em que ela falha, a cor
 * original e o PIOR fundo medido para essa cor nesse tema. `alvo` é 4,5 por
 * omissão (texto); uma entrada de objecto de interface pediria 3.
 *
 * `misturaFundo` é A EXCEPÇÃO MEDIDA, E PORQUE O ALVO SOZINHO NÃO CHEGA: os
 * selos `.tag.*` da água (`tag src`, `tag inf`, `tag prs`) pintam o seu PRÓPRIO
 * fundo com `color-mix(in srgb,var(--teal|--blue|--orange) 16%,transparent)`
 * — a MESMA ficha que dá a cor do texto. Escurecer `--teal` também escurece
 * (16% do deslocamento) o fundo do seu próprio selo, e um alvo medido contra o
 * fundo ANTIGO fica curto contra o fundo NOVO (medido: 0,15 a 0,3 pontos
 * curto, 03.09.2026). Uma entrada com `misturaFundo` diz «este fundo é
 * `misturaFundo` desta MESMA ficha composta sobre um pano por trás», e
 * `ajustaParaContraste()` recompõe o fundo a cada passo, contra o pano e não
 * contra o número antigo.
 * @typedef {{ ficha: string, tema: 'light'|'dark', original: string, fundo: string, alvo?: number, misturaFundo?: number }} AjusteDeCor
 */

/**
 * `agua-nao-faturada` e `onde-esta-a-agua` são a mesma folha (medido: os
 * mesmos pares de cor, exactos, nas duas obras), e por isso a mesma lista de
 * correcções serve as duas.
 * @type {AjusteDeCor[]}
 */
const AJUSTE_AGUA_NAO_FATURADA = [
  { ficha: 'ink-3', tema: 'light', original: '#7a8895', fundo: '#f1f3f5' },
  { ficha: 'ink-3', tema: 'dark', original: '#6e808d', fundo: '#1c262d' },
  /* O pior fundo medido de --teal, --blue e --orange é sempre o do seu PRÓPRIO
     selo `.tag.*` (color-mix a 16% consigo mesma): ver `misturaFundo`, acima. */
  { ficha: 'teal', tema: 'light', original: '#009aa6', fundo: '#cfe9ec', misturaFundo: 0.16 },
  { ficha: 'teal', tema: 'dark', original: '#189ca8', fundo: '#163239', misturaFundo: 0.16 },
  { ficha: 'blue', tema: 'light', original: '#3f62b0', fundo: '#dae0ed', misturaFundo: 0.16 },
  { ficha: 'blue', tema: 'dark', original: '#6486ce', fundo: '#222f3f', misturaFundo: 0.16 },
  { ficha: 'orange', tema: 'light', original: '#c85c15', fundo: '#efdfd5', misturaFundo: 0.16 },
  { ficha: 'orange', tema: 'dark', original: '#de7433', fundo: '#362c26', misturaFundo: 0.16 },
  /* O `--olive` escuro (`#7ba332`) já passa: nenhuma entrada `dark` aqui. O
     pior fundo do `--olive` claro é o `.stype.a` (sem `color-mix`): nenhuma
     `misturaFundo` aqui. */
  { ficha: 'olive', tema: 'light', original: '#6e9e1f', fundo: '#f7f8f9' },
];

/**
 * As correcções medidas, por trabalho. Um slug ausente daqui não tinha
 * nenhuma violação de `color-contrast` no texto: as outras sete obras não
 * entram porque não precisam.
 * @type {Record<string, AjusteDeCor[]>}
 */
const AJUSTES_DE_COR = {
  'agua-nao-faturada': AJUSTE_AGUA_NAO_FATURADA,
  'onde-esta-a-agua': AJUSTE_AGUA_NAO_FATURADA,
  'evolucao-de-portugal-desde-1981': [
    /* O `--ink-3` escuro (`#8b939c`) já passa: só a entrada `light`. */
    { ficha: 'ink-3', tema: 'light', original: '#828a93', fundo: '#f2f4f7' },
  ],
  'alentejo-algarve': [
    { ficha: 'ink-3', tema: 'light', original: '#8a877e', fundo: '#f5f4f1' },
    { ficha: 'ink-3', tema: 'dark', original: '#807d74', fundo: '#232322' },
    /* `--algarve` e `--alentejo` escuros já passam: só as entradas `light`. */
    { ficha: 'algarve', tema: 'light', original: '#0e7fa3', fundo: '#fcfcfb' },
    { ficha: 'alentejo', tema: 'light', original: '#a9741a', fundo: '#fcfcfb' },
  ],
  'evora-prometido-pago-auditado-2026': [
    /* O `--chip-2` escuro (`#7e9099`) já passa: só a entrada `light`. */
    { ficha: 'chip-2', tema: 'light', original: '#7a8a91', fundo: '#fafbf9' },
  ],
  'which-door-is-yours': [
    /* `--muted` e `--soon` escuros já passam: só as entradas `light`. */
    { ficha: 'muted', tema: 'light', original: '#5a6b70', fundo: '#e3e7e2' },
    { ficha: 'soon', tema: 'light', original: '#9a6212', fundo: '#f6ebd4' },
  ],
};

/** @param {string} hex */
function hexParaRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** @param {number[]} rgb */
function rgbParaHex(rgb) {
  return (
    '#' +
    rgb.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')
  );
}

/** A luminância relativa (WCAG 2.1 §1.4.3), a mesma fórmula da régua do bloco. @param {number[]} rgb */
function luminancia(rgb) {
  const c = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

/** @param {number[]} a @param {number[]} b */
function razaoDeContraste(a, b) {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** @param {number[]} rgb */
function rgbParaHsl(rgb) {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, s * 100, l * 100];
}

/** @param {number[]} hsl */
function hslParaRgb(hsl) {
  const h = hsl[0];
  const s = hsl[1] / 100;
  const l = hsl[2] / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let rgb;
  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return rgb.map((v) => (v + m) * 255);
}

/**
 * A sombra mais próxima da MESMA matiz e saturação que passa o alvo contra o
 * fundo medido: um passo de 0,1% de luminosidade de cada vez, mais escura em
 * `light`, mais clara em `dark`, até passar ou esgotar a escala (e nesse caso
 * a construção pára: um alvo que a escala de 0 a 100% não alcança é uma
 * entrada medida a rever, não um valor a forçar).
 *
 * @param {AjusteDeCor} ajuste
 */
function ajustaParaContraste(ajuste) {
  const { ficha, tema, original, fundo, alvo, misturaFundo } = ajuste;
  const rgbOriginal = hexParaRgb(original);
  const rgbFundoMedido = hexParaRgb(fundo);
  /* O PANO POR TRÁS DO PRÓPRIO SELO, recuperado do fundo medido: se o fundo é
     `misturaFundo` desta MESMA ficha composta sobre um pano estático (o selo
     `.tag.*` sobre o papel ou o painel), o pano é o que sobra depois de se
     tirar essa parcela: `medido = m·original + (1-m)·pano`. */
  const m = misturaFundo;
  const rgbPano = m !== undefined ? rgbFundoMedido.map((c, i) => (c - m * rgbOriginal[i]) / (1 - m)) : null;
  const hsl = rgbParaHsl(rgbOriginal);
  const h = hsl[0];
  const s = hsl[1];
  const meta = alvo ?? ALVO_TEXTO_DA_OBRA;
  const passo = tema === 'dark' ? 0.1 : -0.1;
  let l = hsl[2];
  for (let i = 0; i <= 1000; i++) {
    const rgb = hslParaRgb([h, s, l]);
    /* O FUNDO EFECTIVO SEGUE A COR A CADA PASSO quando é a própria cor que o
       compõe: escurecer `--teal` escurece também os 16% do fundo do seu selo,
       e é contra ESSE fundo, recomposto, que o contraste se mede — não contra
       o número medido antes do ajuste, que já não vai ser o de facto servido. */
    const rgbFundoEfetivo =
      rgbPano !== null && m !== undefined ? rgb.map((c, i) => m * c + (1 - m) * rgbPano[i]) : rgbFundoMedido;
    if (razaoDeContraste(rgb, rgbFundoEfetivo) >= meta) return rgbParaHex(rgb);
    const seguinte = l + passo;
    if (seguinte < 0 || seguinte > 100) break;
    l = seguinte;
  }
  return morre(
    `não consegui ajustar \`--${ficha}\` (${tema}, ${original} sobre ${fundo}) até ${meta}:1 sem sair ` +
      `de 0 a 100% de luminosidade.`,
  );
}

/** @type {Map<string, string>} */
const ESTILOS_DOS_AJUSTES = new Map();

/**
 * O CSS dos ajustes de cor para UM documento, ou a cadeia vazia se o seu slug
 * não está em `AJUSTES_DE_COR`. Cada metade (`light`, `dark`) só declara a
 * ficha que falha NESSE tema: a que já passa fica fora dos dois blocos, e por
 * isso continua exactamente a da obra, nos dois lados.
 *
 * @param {string} slug
 */
function estiloDosAjustesDeCor(slug) {
  const emCache = ESTILOS_DOS_AJUSTES.get(slug);
  if (emCache !== undefined) return emCache;

  const ajustes = AJUSTES_DE_COR[slug];
  let estilo = '';
  if (ajustes && ajustes.length > 0) {
    /** @param {AjusteDeCor[]} lista */
    const declara = (lista) => lista.map((a) => `--${a.ficha}:${ajustaParaContraste(a)}`).join(';');
    const claras = ajustes.filter((a) => a.tema === 'light');
    const escuras = ajustes.filter((a) => a.tema === 'dark');
    /** @type {string[]} */
    const blocos = [];
    if (claras.length > 0) {
      blocos.push(`@media (prefers-color-scheme:light){[data-oedp-moldura]{${declara(claras)}}}`);
    }
    if (escuras.length > 0) {
      blocos.push(
        `@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) ` +
          `[data-oedp-moldura]{${declara(escuras)}}}`,
      );
    }
    estilo = blocos.join('\n');
  }
  ESTILOS_DOS_AJUSTES.set(slug, estilo);
  return estilo;
}

/**
 * ONDE `--rule-strong` NÃO CHEGA, MEDIDO (Major 7, segunda passagem). O
 * filete da moldura é `--rule-strong` porque passa 3:1 contra o PAPEL DA
 * CASA — mas o que o rodeia, dentro de cada obra, não é o papel da casa: é o
 * fundo que essa célula tem, com a `opacity` que ela própria declara (Major 7
 * mede os dois fundos DE FACTO compostos, `opacity` incluída: ver
 * `filetEfetivo()` em `tests/documentos/moldura.mjs`). Medidos os dois lados
 * de cada filete nos dezasseis, dois sítios em duas obras ficam abaixo de 3:1
 * mesmo com `--rule-strong`:
 *
 *   · a fileira que assinala um mandato em `evora-quinze-anos-cinco-mandatos`
 *     (fundo `--series-1-soft` a `opacity:.85`, uma cor de série de gráfico,
 *     não da casa): 1,57:1 em claro, 2,33:1 em escuro;
 *   · o cabeçalho de `which-door-is-yours` (fundo `--surface-2`, quase o
 *     papel): 2,98:1, não 3.
 *
 * NESTES DOIS SELECTORES, E SÓ NELES, o filete sobe ao degrau mais escuro da
 * casa, `--ink` — o mesmo que o F0.7 escolheu quando `--g3` não chegava ao fio
 * da faixa. Medido depois: 5,97:1 e 5,84:1 no primeiro (claro e escuro), 5,36:1
 * no segundo. Continua paleta da casa; só sobe um degrau onde o de baixo não
 * chegava, e só onde a medição o exige.
 * @type {Record<string, string[]>}
 */
const FILETE_REFORCADO = {
  'evora-quinze-anos-cinco-mandatos': ['tr.boundary td'],
  'which-door-is-yours': ['table thead th'],
};

/** @type {Map<string, string>} */
const ESTILOS_DO_FILETE_REFORCADO = new Map();

/**
 * O CSS do filete reforçado para UM documento, ou a cadeia vazia se o seu
 * slug não está em `FILETE_REFORCADO`. `--oedp-ink` já está declarado nos
 * dois temas por `estiloDaMoldura()` (é a ficha do texto das células): esta
 * regra só o reaproveita, e por isso não precisa da sua própria metade escura.
 *
 * @param {string} slug
 */
function estiloDoFileteReforcado(slug) {
  const emCache = ESTILOS_DO_FILETE_REFORCADO.get(slug);
  if (emCache !== undefined) return emCache;

  const selectores = FILETE_REFORCADO[slug];
  const estilo =
    selectores && selectores.length > 0
      ? `${selectores.map((s) => `[data-oedp-moldura] ${s}`).join(',')}{border-color:var(--oedp-${FICHA_DA_TINTA})!important}`
      : '';
  ESTILOS_DO_FILETE_REFORCADO.set(slug, estilo);
  return estilo;
}

/**
 * O GUIÃO DA MOLDURA, e o que ele NÃO faz.
 *
 * `tabindex`, `role` e `aria-label` são atributos, e um atributo só entra numa
 * caixa do documento mexendo nos bytes dela. É a única coisa deste bloco que
 * não se resolve pela folha, e por isso é a única que leva guião.
 *
 * O ESSENCIAL NÃO DEPENDE DELE. Sem guião, o documento lê-se inteiro, com a
 * moldura, os filetes corrigidos e as tabelas onde estão; o que falta é chegar
 * de teclado a uma caixa que se desloca de lado. É a linha que o brief traça
 * («sem guião novo para o essencial») e é a razão por que este guião não escreve
 * nem apaga uma única palavra da página.
 *
 * Corre em duas passagens (`DOMContentLoaded` e `load`) porque as folhas dos
 * documentos desenham gráficos na primeira e o que se desloca só se sabe depois
 * do desenho, e volta a correr depois de uma mudança de largura, com espera:
 * uma caixa que cabia a 1 280 deixa de caber a 390.
 *
 * @param {Lingua} lang
 */
function guiaoDaMoldura(lang) {
  const s = t(lang);
  /* `</` escapado: uma cadeia com `</script` dentro de um `<script>` fecha o
     elemento a meio, e o rótulo é texto de tradução que ninguém volta a ler
     daqui. */
  const rotulo = JSON.stringify(s.estudos.documentoDeslocamento).replace(/<\//g, '<\\/');
  return (
    `(function(){var R=${rotulo};` +
    `function nome(c){var t=c.querySelector("table"),l=t&&t.querySelector("caption"),x=l?l.textContent:"";` +
    `if(!x){var a=c.previousElementSibling;while(a&&!/^H[1-6]$/.test(a.tagName))a=a.previousElementSibling;x=a?a.textContent:"";}` +
    `x=(x||"").replace(/\\s+/g," ").trim();return x?R+": "+x.slice(0,80):R;}` +
    `function passa(){var m=document.querySelector("[data-oedp-moldura]");if(!m)return;` +
    /* Duas passagens: uma que só LÊ (medir a caixa depois de escrever nela
       obrigava o navegador a refazer o cálculo a cada elemento), e outra que só
       escreve. A leitura barata vem primeiro e o estilo calculado só se pede às
       poucas que a leitura barata deixou passar. */
    `var todos=m.querySelectorAll("*"),corre=[],i,el,cs,x,y;` +
    `for(i=0;i<todos.length;i++){el=todos[i];` +
    `x=el.scrollWidth-el.clientWidth>1;y=el.scrollHeight-el.clientHeight>1;if(!x&&!y)continue;` +
    `cs=getComputedStyle(el);` +
    `if(!(x&&/auto|scroll/.test(cs.overflowX))&&!(y&&/auto|scroll/.test(cs.overflowY)))continue;corre.push(el);}` +
    /* OS NOMES SÃO ÚNICOS NA PÁGINA, e não por gosto: dois marcos com o mesmo
       nome mandam quem ouve escolher entre coisas que soam iguais, e o axe
       chama-lhe `landmark-unique`. Medidas as dezasseis páginas: seis têm
       caixas que caem no mesmo nome (as de `onde-esta-a-agua`, que não têm
       legenda nem título por cima, e três tabelas de pessoas que se repetem em
       `evora-os-pelouros`). Onde há repetição, todas as do grupo levam a sua
       ordem, e não só a segunda: «(1)» e «(2)» dizem-se um ao outro, e um nome
       nu ao lado de um «(2)» não diz nada. */
    `var nomes=[],conta={},k;` +
    `for(i=0;i<corre.length;i++){k=nome(corre[i]);nomes.push(k);conta[k]=(conta[k]||0)+1;}` +
    `var vistos={};` +
    `for(i=0;i<corre.length;i++){el=corre[i];k=nomes[i];` +
    `if(conta[k]>1){vistos[k]=(vistos[k]||0)+1;k=k+" ("+vistos[k]+")";}` +
    `if(!el.hasAttribute("tabindex"))el.setAttribute("tabindex","0");` +
    `if(!el.hasAttribute("role"))el.setAttribute("role","region");` +
    `if(!el.getAttribute("aria-label")&&!el.getAttribute("aria-labelledby"))el.setAttribute("aria-label",k);}}` +
    `if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",passa);else passa();` +
    `window.addEventListener("load",passa);` +
    `var e;window.addEventListener("resize",function(){clearTimeout(e);e=setTimeout(passa,200);});})();`
  );
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
 * A GEOMETRIA MUDOU COM A MOLDURA (bloco F1.8, 03.09.2026). Até aqui a faixa
 * era a última coisa que a casa inseria e o construído TERMINAVA com a cauda do
 * original, e por isso bastava uma subtracção de comprimentos. Agora o corpo do
 * documento entra dentro de um elemento da casa, e a prova passa a descascar o
 * construído pelo fim, por sufixos, quatro vezes:
 *
 *   1. a CAUDA: do primeiro `</body>` de verdade do original até ao fim do
 *      ficheiro, byte a byte;
 *   2. o FECHO da moldura (`</main>` ou `</div>`), a cadeia fixa que a casa lá
 *      pôs;
 *   3. o CORPO: os bytes do original entre o `<body>` e esse `</body>`, byte a
 *      byte. É esta fatia que apanha um carácter mudado no meio do documento, e
 *      é sobre ela que a régua do bloco planta o conhecido-positivo;
 *   4. a ABERTURA da moldura, a outra cadeia fixa.
 *
 * O que fica acima da abertura é markup da casa (a faixa, a folha e o guião) e
 * não se confere aqui: confere-se no portão, campo a campo, contra o que ele
 * espera encontrar. O provador não sabe compor nada da casa, e é por isso que
 * continua a ser uma prova e não um espelho: as três cadeias que conhece
 * (`MARCA_DOS_ROBOS` e as duas da moldura) são fixas e não dependem da língua.
 *
 *   · a cabeça: tirar do construído a única ocorrência de `MARCA_DOS_ROBOS`
 *     devolve, entre o `<head>` e o `<body>`, exactamente os bytes do original
 *     entre os seus.
 *
 * Devolve `null` quando está bem, ou a frase do que falhou.
 *
 * @param {string} bruto
 * @param {string} construido
 * @returns {string | null}
 */
export function provaDosBytes(bruto, construido) {
  const bufO = Buffer.from(bruto, 'utf8');
  const bufC = Buffer.from(construido, 'utf8');
  /**
   * @param {string} texto
   * @param {number} i
   */
  const bytesAte = (texto, i) => Buffer.byteLength(texto.slice(0, i), 'utf8');

  const zonasO = zonasOpacas(bruto);
  const corpoO = etiquetaReal(bruto, 'body', zonasO);
  if (!corpoO) return 'o original não tem um `<body>` de verdade.';
  const fechoO = fechoReal(bruto, 'body', zonasO, { desde: corpoO.fim });
  const fimDoCorpo = fechoO ? fechoO.inicio : bruto.length;
  const moldura = molduraDe(bruto);

  /* AS QUATRO FATIAS, DESCASCADAS PELO FIM. */
  let fim = bufC.length;
  /**
   * @param {Buffer} esperado
   * @param {string} nome
   * @returns {string | null}
   */
  const descasca = (esperado, nome) => {
    if (fim < esperado.length) {
      return (
        `o construído acaba antes de ${nome}: faltam ${esperado.length - fim} dos ` +
        `${esperado.length} bytes que se esperavam.`
      );
    }
    const visto = bufC.subarray(fim - esperado.length, fim);
    if (Buffer.compare(esperado, visto) !== 0) {
      let i = 0;
      while (i < esperado.length && esperado[i] === visto[i]) i++;
      return (
        `${nome} não são os bytes do original: diferem no byte ${i} de ${esperado.length} ` +
        `(original ${esperado[i]}, construído ${visto[i]}).`
      );
    }
    fim -= esperado.length;
    return null;
  };

  /** @type {Array<[Buffer, string]>} */
  const fatias = [
    [bufO.subarray(bytesAte(bruto, fimDoCorpo)), 'a cauda, do `</body>` ao fim do ficheiro,'],
    [Buffer.from(moldura.fecha, 'utf8'), `o fecho da moldura (\`${moldura.fecha}\`)`],
    [
      bufO.subarray(bytesAte(bruto, corpoO.fim), bytesAte(bruto, fimDoCorpo)),
      'os bytes do corpo do documento',
    ],
    [Buffer.from(moldura.abre, 'utf8'), `a abertura da moldura (\`${moldura.abre}\`)`],
  ];
  for (const [esperado, nome] of fatias) {
    const falha = descasca(esperado, nome);
    if (falha) return falha;
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
  /* O `<body>` do construído: a linha de cima já contava com a sua ausência
     (`corpoR ? corpoR.inicio : Infinity`) e a de baixo lia-o na mesma. Um
     documento construído sem `<body>` de verdade fazia este provador atirar um
     TypeError em vez de devolver a frase do que falhou, que é o que ele promete
     ao portão (achado do bloco F0.4). */
  if (!corpoR) return 'o construído não tem um `<body>` de verdade.';
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
 * O documento com a faixa por cima e a moldura à volta.
 *
 * A faixa entra logo a seguir ao `<body>`, que é o único sítio onde não
 * atravessa nada: acima dela fica o `<head>` do documento, intacto. A seguir à
 * faixa entram a folha e o guião da moldura, e depois a abertura; o fecho entra
 * antes do primeiro `</body>` de verdade. Entre a abertura e o fecho vai o
 * documento inteiro, byte a byte.
 *
 * A FAIXA FICA FORA DA MOLDURA, e é essa a razão de ela entrar primeiro: quem
 * usa um leitor de ecrã salta para o marco principal e cai no documento, e não
 * na mobília da casa. A folha e o guião ficam também fora, porque não são
 * conteúdo: um `<style>` e um `<script>` não desenham caixa nenhuma.
 *
 * @param {string} bruto o ficheiro tal como está em studies-src/
 * @param {{ slug: string, lang: Lingua }} onde
 */
export function comFaixa(bruto, { slug, lang }) {
  const marca = faixa(slug, lang);

  /* O `<body>` DE VERDADE, e sem recuo para o `</head>`. A primeira passagem
     aceitava um documento sem `<body>` e punha a faixa a seguir ao `</head>`,
     onde ela fica fora do corpo e a prova da cauda deixa de ter âncora. Os
     dezasseis têm `<body>`; um que não tenha é um ficheiro que ninguém
     conferiu, e diz-se em vez de se remendar. */
  const zonas = zonasOpacas(bruto);
  const corpo = etiquetaReal(bruto, 'body', zonas);
  if (!corpo) {
    throw new Error(
      `documentos: o documento "${slug}" (${lang}) não tem um <body> de verdade, e a faixa não ` +
        `sabe onde entrar. Um documento de estudo é um ficheiro HTML completo e auto-contido.`,
    );
  }

  const moldura = molduraDe(bruto);
  const fecho = fechoReal(bruto, 'body', zonas, { desde: corpo.fim });
  const fimDoCorpo = fecho ? fecho.inicio : bruto.length;

  return (
    bruto.slice(0, corpo.fim) +
    marca +
    `<style>${estiloDaMoldura()}${estiloDosAjustesDeCor(slug)}${estiloDoFileteReforcado(slug)}</style>` +
    `<script>${guiaoDaMoldura(lang)}</script>` +
    moldura.abre +
    bruto.slice(corpo.fim, fimDoCorpo) +
    moldura.fecha +
    bruto.slice(fimDoCorpo)
  );
}

/**
 * O que é servido em `/estudos/<slug>/documento`.
 * É também o que o portão recalcula para conferir que o que foi construído é o
 * documento de origem mais a faixa, e nada mais.
 *
 * @param {string} slug
 * @param {Lingua} lang
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
