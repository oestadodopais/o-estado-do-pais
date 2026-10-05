#!/usr/bin/env node
/**
 * O PORTÃO DAS FORMAS · o que um desenho da casa pode desenhar, e o que não.
 *
 * Corre DEPOIS do `astro build`, sobre `dist/`, no `build` e no `verify`.
 *
 * ---------------------------------------------------------------------------
 * PORQUE NÃO CHEGA O `gate:html`
 * ---------------------------------------------------------------------------
 * O portão de HTML já recusa um algarismo sem origem declarada, e já exige o
 * selo de um valor desenhado dentro de um `<svg>`. O que ele NÃO sabe é o que o
 * `BRIEF-forma-dos-dominios.md` §3 fixou: que as formas gráficas admitidas são
 * quatro e mais nenhuma, que são SVG estático sem guião e sem animação, que a
 * frase da fronteira se imprime uma vez, e que as três datas de uma medida se
 * escrevem na forma da casa **sem deixarem de ser o campo da linha**.
 *
 * ---------------------------------------------------------------------------
 * AS OITO CONFERÊNCIAS
 * ---------------------------------------------------------------------------
 *   F1 · **a data da linha, recomposta.** Cada `[data-nonledger="data-da-linha"]`
 *        diz de que linha e de que campo saiu; este portão vai buscar o campo à
 *        linha, aplica-lhe `dataDaCasa()` por conta própria, e compara-o carácter
 *        a carácter com o que a página imprimiu. É o que faz da marca uma origem
 *        conferida e não uma dispensa.
 *   F2 · **nenhum número solto num desenho.** Dentro de um `<svg>` de uma forma,
 *        todo o texto com algarismos tem de estar num `[data-claim]` ou num
 *        `[data-nonledger]`. Um número escrito à mão num desenho é a planta que a
 *        régua deste bloco vê vermelha.
 *   F3 · **as quatro formas, e mais nenhuma.** Um `[data-forma]` com um nome que
 *        não é dos quatro fecha a construção. E dentro de uma forma não há
 *        `<script>`, `<animate>`, `<animateTransform>`, `<set>` nem `<foreignObject>`.
 *   F4 · **a frase da fronteira, uma vez por página, com id.**
 *   F5 · **as três datas no RECIBO de cada linha com leitura breve** (bloco P3,
 *        16.09.2026; decisão do diretor de 16.09). Eram medidas na dobra da
 *        leitura breve, onde a carta as mandava escrever; a carta passou a
 *        dizer «Três datas por medida, sempre, no recibo da linha» e a
 *        exigência mudou de lugar com ela. O conjunto das linhas medidas é o
 *        mesmo de sempre, lido do `dist/` e não de uma lista escrita aqui: toda
 *        a linha que uma leitura breve cita. A força não muda: eram três datas
 *        por leitura breve, são três datas por recibo de linha com leitura
 *        breve, e o recibo é onde a norma §2.1 as põe.
 *   F6 · **as linhas alcançáveis.** Todas as linhas que a página do domínio cita
 *        existem; e as 308 de cada medida de concelho são alcançáveis pela porta
 *        que o mapa leva.
 *   F7 · **as 308 páginas de concelho**, nas duas edições, com a medida nova e
 *        com o controlo positivo que prova que a busca não está cega. O total se
 *        lê de `MUNICIPIOS_COM_PAGINA.length` (`src/data/municipios.mjs`), nunca
 *        da própria contagem descoberta: as duas edições podiam faltar a mesma
 *        página e continuar a bater uma com a outra.
 *   F8 · **a ausência não tem número.** Um cartão de ausência com um algarismo
 *        deixa de ser uma ausência.
 *
 * ---------------------------------------------------------------------------
 * AS QUATRO CONFERÊNCIAS DO ATRASO (bloco F1.6, 04.09.2026)
 * ---------------------------------------------------------------------------
 *   F13 · **o período da fonte é o da série declarada.** Cada
 *        `[data-nonledger="periodo-da-fonte"]` diz de que série saiu
 *        (`data-de-serie`); este portão vai buscar a série a
 *        `src/data/frescura.mjs` e compara o período carácter a carácter. Sem
 *        isto, o motivo novo do `allowlist.yml` seria uma dispensa.
 *   F14 · **a série declarada bate certo com a origem que ela nomeia.** A série
 *        diz o ficheiro, o registo e o campo de onde o período foi lido; este
 *        portão abre esse ficheiro por conta própria, tira o período do que a
 *        folha da fonte imprime («Ano Mês: 202607») e compara-o com o declarado.
 *        Duas contas do mesmo facto, feitas de sítios diferentes.
 *   F15 · **a frase do atraso está em TODAS as páginas das linhas atrasadas**,
 *        nas duas edições. O total lê-se do livro-razão e não da própria
 *        varredura: as duas edições podiam faltar a mesma página e continuar a
 *        bater uma com a outra, que é a razão escrita em F7.
 *   F17 · **a frase da frescura no cartão de um concelho, se e só se a fonte
 *        já publicou um período mais recente** (bloco R1, 23.09.2026, I146). Em
 *        cada página de concelho, um cartão cuja linha está numa série atrasada
 *        (a regra de pertença escrita aqui outra vez, e o período da fonte depois
 *        do da linha) tem exactamente uma frase, com a série certa, o período da
 *        fonte por extenso (a tabela dos meses é deste guião) e a data em que ele
 *        se leu (`origem.lidoEm`, na forma da casa); um cartão cuja linha não está
 *        atrasada não tem frase nenhuma. A conta das frases vistas tem de ser a
 *        das linhas atrasadas rendidas em cartões, e maior do que zero.
 *   F16 · **a contagem por extenso da frase do Painel Social, lida da página
 *        construída.** A frase diz «Oito das medidas principais», e a régua dos
 *        algarismos não vê palavras. A palavra recompõe-se aqui de
 *        `FIGURAS_SOCIAL.length` e procura-se no `dist/`. Não se lê a declaração
 *        da frase: era esse o buraco que a leitura a frio mediu (Major 10),
 *        porque comparar a frase com o campo com que ela foi construída deixa
 *        passar as duas mudadas ao mesmo tempo. **Eram duas contagens até
 *        14.09.2026**, e o denominador saiu da frase com o achado 2 da leitura
 *        cruzada do inventário.
 *
 * ---------------------------------------------------------------------------
 * TRÊS CONFERÊNCIAS NOVAS (segunda passagem, 03.09.2026, leitura a frio)
 * ---------------------------------------------------------------------------
 * A leitura a frio do Codex mediu que F2 e F8 aceitavam QUALQUER motivo em
 * `data-nonledger`, sem perguntar se aquele motivo faz sentido ONDE aparece: um
 * número escrito à mão dentro de um `<svg>` passava se levasse um motivo
 * qualquer da lista geral do sítio, e um valor escondido no cartão de T4a
 * passava pela mesma porta. As três conferências novas fecham essa lacuna:
 *
 *   F9  · **o motivo de cada `data-nonledger`, contra uma lista fechada por
 *        contexto.** Dentro do `<svg>` de uma forma, só `escala-de-instrumento`
 *        é motivo de um algarismo (F2 continua a aceitar `data-claim`, sempre).
 *        Dentro de um cartão de ausência, só `identificador-tecnico`. Fora
 *        destes dois contextos, numa página de domínio, o motivo tem de estar na
 *        lista das seis que a página usa. Um motivo genuinamente novo entra
 *        nesta lista com a sua razão, como entra em `ledger/allowlist.yml`.
 *   F10 · **nenhuma data ISO na página do domínio.** A regra da casa é uma só,
 *        dd.mm.aaaa; uma data ISO visível é a marca de uma leitura que se
 *        esqueceu de passar por `dataDaCasa()`. O portão de HTML tira as datas
 *        ISO da sua própria varredura antes de contar (são a forma de um id, de
 *        um endereço), e por isso não apanha uma que escape na PROSA.
 *   F11 · **as classes do mapa, reconciliadas com as linhas.** Um `<use>` cuja
 *        classe é uma cor da escala tem de ter, do outro lado, uma linha cujo
 *        valor é um número; um `<use>` em falta tem de estar em `sem-valor`. As
 *        duas contas são independentes: uma lê a classe do HTML construído, a
 *        outra lê o valor do livro-razão pelo mesmo slug.
 *
 * ---------------------------------------------------------------------------
 * O CONHECIDO-POSITIVO (regra 14 da casa)
 * ---------------------------------------------------------------------------
 * Um portão que lê `dist/` e conta zero tem duas explicações e só uma é boa. Por
 * isso cada conferência declara o que TEM de encontrar antes de o seu zero valer
 * alguma coisa: as duas edições da página do domínio, pelo menos uma forma
 * desenhada, pelo menos uma data de linha, e as 308 páginas de concelho. A
 * ausência de qualquer uma delas fecha a construção antes de qualquer contagem.
 *
 * `OEDP_DIST` aponta para outra pasta: é como `tests/dominio/pagina.mjs` planta
 * estragos numa cópia e vê este portão vermelho antes de o ver verde.
 *
 * Uso:  node scripts/check-formas.mjs
 */

import fs from 'node:fs';
import { conferirSerie, plantasDaSerie, provasDoModulo, regraDaPagina, plantasDaRegraDaPagina, plantasDaLeitura, plantasDaLegenda } from '../tests/formas/serie-do-pais.mjs';
import { FIGURAS_INDEXADAS } from '../src/data/series-no-tempo.mjs';
import { documentoDosAssuntos } from '../tests/inicio/paginas-dos-assuntos.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

import { loadClaims, getClaim, eValorTextual, parsePtNumber } from '../src/lib/ledger.mjs';
import { dataDaCasa } from '../src/lib/datas.mjs';
import { matchPath, routePath, LANGS } from '../src/lib/routes.mjs';
import { slugsDosDominios, medidasDoDominio } from '../src/data/dominios.mjs';
import { FIGURAS } from '../src/data/figuras.mjs';
import { MEDIDAS_DO_CONCELHO } from '../src/data/concelhos.mjs';
import { MUNICIPIOS_COM_PAGINA } from '../src/data/municipios.mjs';
import { linhasPorConcelho, ultimaConferencia } from '../src/lib/dominios.mjs';
import {
  FIGURAS_SOCIAL,
  numeralPorExtenso,
} from '../src/data/figuras.mjs';
import { SERIES_ATRASADAS } from '../src/data/frescura.mjs';
import { conferirCalendario, plantasDoCalendario } from '../tests/municipio/calendario.mjs';
import { FORMAS_DOS_BLOCOS } from '../src/lib/primeira-pagina.mjs';
import { lerSeriesDoPortao, lerPaisesDoPortao, contaDaFaixa } from './series-do-portao.mjs';
import { conferirFaixas, plantasDaFaixa, conferirPalavrasDaFaixa, plantasDasPalavrasDaFaixa, plantasDosEmpates } from '../tests/cartao/faixa.mjs';
import { conferirSeccaoDosPaises, plantasDaSeccao, plantaDaTabela } from '../tests/uniao/paises.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = process.env.OEDP_DIST ?? path.join(RAIZ, 'dist');

const vermelho = (s) => `\x1b[31m${s}\x1b[0m`;
const verde = (s) => `\x1b[32m${s}\x1b[0m`;
const cinza = (s) => `\x1b[90m${s}\x1b[0m`;

/** @type {string[]} */
const erros = [];
/** @param {string} m */
const err = (m) => erros.push(m);

if (!fs.existsSync(DIST)) {
  console.error(vermelho('\n  PORTÃO DAS FORMAS · não existe dist/. Corra o build primeiro.\n'));
  process.exit(1);
}

/** RP1c: recompõe a preposição do período sem importar o cartão. */
function preposicaoDoPeriodo(el, bruto, lang) {
  const periodo = el.closest('.cartao-medida-periodo');
  // O cartão das câmaras usa outro componente; a data dele continua na F1 abaixo.
  if (!periodo || el.closest('[data-cartao-camaras]')) return null;
  const trimestral = /^\d{4}-T[1-4]$/.test(String(bruto));
  const esperado = lang === 'en' ? (trimestral ? 'in the' : 'in') : (trimestral ? 'no' : 'em');
  return periodo.querySelector('.cartao-medida-em')?.textContent.trim() === esperado ? null : `F1 · preposição do período: esperado «${esperado}»`;
}
// O mesmo detetor recebe o caso íntegro e a preposição errada, nas duas edições.
for (const lang of ['pt', 'en']) {
  const root = parse(`<span class="cartao-medida-periodo"><span class="cartao-medida-em">${lang === 'pt' ? 'no' : 'in the'}</span><span data-nonledger="data-da-linha">${lang === 'pt' ? '2.º trimestre de 2026' : '2nd quarter of 2026'}</span></span>`);
  const el = root.querySelector('[data-nonledger]');
  if (preposicaoDoPeriodo(el, '2026-T2', lang)) throw Error('F1: o trimestre íntegro foi recusado');
  root.querySelector('.cartao-medida-em').set_content(lang === 'pt' ? 'em' : 'in');
  if (!preposicaoDoPeriodo(el, '2026-T2', lang)) throw Error('F1: a planta da preposição passou');
}
console.log('F1 · plantas «em 2.º trimestre» e «in 2nd quarter» recusadas; controlos íntegros aceites.');

/** As quatro formas do §3, e mais nenhuma. */
const FORMAS_DOS_DOMINIOS = [
  'serie-do-pais',
  'faixa-entre-27',
  'barra-concelho-pais',
  'mapa-por-concelho',
];
/* E AS QUATRO FORMAS DOS BLOCOS DE «O QUE SE PASSA» (bloco PP1, 28.09.2026; o §2, ponto 2, do brief:
   «as quatro formas declaradas (`barras`, `paineis`, `pares`, `colunas`)»). A lista continua fechada: um
   nome que não seja destes oito fecha a construção, e a F2 e a F9 continuam a exigir, dentro do `<svg>`
   de cada uma, que cada algarismo seja uma linha ou a marca da escala de um instrumento. A lista lê-se
   da declaração do resolvedor, e não se escreve aqui outra vez: as duas não podem divergir. */
const FORMAS = new Set([...FORMAS_DOS_DOMINIOS, ...FORMAS_DOS_BLOCOS]);
/* O conhecido-positivo da lista fechada: o mesmo teste recusa um nome que não é nenhum dos oito. */
if (FORMAS.has('barras-empilhadas') || !FORMAS.has('colunas') || !FORMAS.has('serie-do-pais') || FORMAS.size !== 8) {
  throw new Error('check:formas: a lista das formas não é a das quatro dos domínios e das quatro dos blocos.');
}

/** O que um desenho estático não pode ter lá dentro. */
const PROIBIDOS_NUM_DESENHO = ['script', 'animate', 'animatetransform', 'animatemotion', 'set', 'foreignobject'];

/**
 * O ÚNICO MOTIVO DE UM ALGARISMO DESENHADO NUM DESENHO ESTÁTICO (F2, F9).
 *
 * `data-claim` é sempre aceite (é uma linha do livro-razão); de `data-nonledger`
 * só a marca da régua de um instrumento, e mais nenhuma: um limiar, uma data,
 * um identificador técnico não são a escala de uma forma, e um algarismo
 * escrito à mão que levasse um desses motivos passava a F2 de antes desta
 * conferência (leitura a frio do Codex, Major 6).
 */
const MOTIVO_DE_ESCALA = 'escala-de-instrumento';

/**
 * O ÚNICO MOTIVO DENTRO DE UM CARTÃO DE AUSÊNCIA (F8, F9).
 *
 * A regra dos vazios (Emenda 14) só admite, dentro de um `[data-ausencia]`, o
 * identificador técnico do indicador que se procurou («0012661»); qualquer
 * outro `data-nonledger` ali dentro não é a razão que o brief da forma dos
 * domínios pede, e um valor disfarçado com um desses motivos passava a F8 de
 * antes desta conferência (leitura a frio do Codex, Major 6).
 */
const MOTIVO_DE_AUSENCIA = 'identificador-tecnico';

/**
 * A LISTA FECHADA DE `data-nonledger` DA MANCHETE E DA LEITURA BREVE (F9).
 *
 * As sete que a manchete (`.cabeca-h1`) e a secção `#leitura` de
 * `src/views/DominioView.astro` usam hoje, medidas no `dist/` construído e não
 * escritas de memória: cada uma tem a sua razão em `ledger/allowlist.yml`. O
 * ESCOPO É SÓ ESTE CONTEÚDO, e não a página inteira: a cabeça comum e o rodapé
 * são mobília de outros blocos (o sinal do corredor diário, os cartões da
 * faixa com o seu período), já cobertos pelo fecho geral do `gate:html` contra
 * `ledger/allowlist.yml`, e uma lista fechada aqui sobre esse território
 * apanharia um motivo alheio válido como se fosse um erro deste bloco. Um
 * motivo novo NESTE conteúdo entra nesta lista com a sua razão, como entra
 * naquele ficheiro: as duas listas mudam juntas ou divergem em silêncio.
 */
const MOTIVOS_DO_DOMINIO = new Set([
  'data-da-linha',
  MOTIVO_DE_ESCALA,
  'limiar-do-quadro',
  'objetivo-institucional',
  'ambito-da-medida',
  MOTIVO_DE_AUSENCIA,
  'proveniencia',
  'fonte-da-carta',
  /* A DATA EM QUE A CASA LEU A DESCRIÇÃO DE ONDE SAIU UMA DEFINIÇÃO (F1.10,
     segunda passagem, 09.09.2026). A página do domínio passou a render a
     definição em palavras das medidas cuja linha tem uma declarada, com a
     origem que a prova: o publicador, o documento como porta, a data de leitura
     e o excerto (decisão 24 da releitura do leitor de primeira vez). A data é
     um `data-nonledger` novo, e entra nas duas listas ao mesmo tempo, como o
     cabeçalho acima manda: aqui e em `ledger/allowlist.yml`. */
  'data-de-leitura-de-uma-definicao',
]);

const provasRP4 = provasDoModulo();
const plantasRP4 = [];
/* RP4-c: as plantas da F2 no desenho das séries, e as da leitura e da legenda da unidade na F21, uma vez por edição. */
const plantasF2 = [];
const plantasDaLeituraRP4C = [];
let desenhosRP4 = 0;
const recibosRP4 = new Set();
/* RP4-m: os dois controlos das plantas da regra da página, o primeiro de cada um que a corrida vê. */
const controlosDaRegra = { figura: null, comum: null };
const claims = loadClaims();
/** UE1: as linhas de série, pelo leitor próprio dos portões (F1 e F19). */
const SERIES_DO_PORTAO = lerSeriesDoPortao();
/* RP3 (04.10.2026): as contagens da faixa e da secção dos países (F19, F20) são das
   séries de países; as séries no tempo não têm faixa. */
const SERIES_DE_PAISES = new Map([...SERIES_DO_PORTAO].filter(([, s]) => s.eixo === 'pais'));

/**
 * O CAMPO DE DATA DE UMA SÉRIE QUE UMA DATA DIZ MOSTRAR, pelo caminho do campo
 * (bloco RP3, 04.10.2026). Numa série de países: o período, a data da leitura e a
 * da publicação, como no UE1. Numa série no tempo, também o primeiro e o último
 * período, o período de cada ponto (`pontos.<n>.periodo`), a hora, o primeiro e o
 * último ponto de cada pedido (`pedidos.<n>.lido_em`, `.primeiro`, `.ultimo`), o
 * período de cada lacuna e o período e a data de cada correção. `null` para um
 * caminho que não é um destes, que a F1 recusa.
 *
 * @param {any} serie @param {string} campo
 * @returns {string | null}
 */
function campoDeDataDaSerie(serie, campo) {
  const topo = serie.eixo === 'periodo'
    ? ['access_date', 'published_at', 'primeiro_periodo', 'ultimo_periodo']
    : ['periodo', 'access_date', 'published_at'];
  if (topo.includes(campo)) return typeof serie[campo] === 'string' ? serie[campo] : null;
  if (serie.eixo !== 'periodo') return null;
  const m = /^(pontos|pedidos|lacunas|corrections)\.(\d+)\.(periodo|lido_em|primeiro|ultimo|date)$/.exec(campo);
  if (!m) return null;
  const permitidos = { pontos: ['periodo'], pedidos: ['lido_em', 'primeiro', 'ultimo'], lacunas: ['periodo'], corrections: ['periodo', 'date'] };
  if (!permitidos[m[1]].includes(m[3])) return null;
  const item = Array.isArray(serie[m[1]]) ? serie[m[1]][Number(m[2])] : null;
  return item && typeof item[m[3]] === 'string' ? item[m[3]] : null;
}
const PAISES_DO_PORTAO = lerPaisesDoPortao();

/** @param {string} dir */
function paginasDe(dir) {
  /** @type {string[]} */
  const out = [];
  const anda = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) anda(f);
      else if (e.name.endsWith('.html')) out.push(f);
    }
  };
  anda(dir);
  return out.sort();
}

/**
 * O campo de uma linha que uma data pode nomear.
 *
 * São os três da regra da carta, e o índice da conferência vai no nome, como na
 * página da linha: `verifications.<n>.date`.
 *
 * @param {Linha} linha
 * @param {string} campo
 * @returns {string|null}
 */
function campoDaData(linha, campo) {
  if (campo === 'reference_date') return typeof linha.reference_date === 'string' ? linha.reference_date : null;
  if (campo === 'access_date') return typeof linha.access_date === 'string' ? linha.access_date : null;
  if (campo === 'published_at') return typeof linha.published_at === 'string' ? linha.published_at : null;
  /* AS DUAS DATAS DO ALOJAMENTO (bloco F1.4, 04.09.2026). O instantâneo do
     ficheiro alojado e o de cada ficheiro sobre que a linha foi contada. Entram
     aqui porque passaram a escrever-se na forma da casa como as outras três, e
     este portão é quem as reconfere: sem elas, uma data marcada `data-da-linha`
     caía no ramo do «a linha não tem esse campo» e fechava a construção. */
  if (campo === 'document.hosted.snapshot_date') {
    const d = /** @type {{ hosted?: { snapshot_date?: unknown } }} */ (linha.document ?? {})?.hosted
      ?.snapshot_date;
    return typeof d === 'string' ? d : null;
  }
  const f = /^document\.computed_over\.files\.(\d+)\.snapshot_date$/.exec(campo);
  if (f) {
    const co = /** @type {{ computed_over?: { files?: unknown } }} */ (linha.document ?? {})
      ?.computed_over;
    const ficheiros = Array.isArray(co?.files) ? co.files : [];
    const item = ficheiros[Number(f[1])];
    if (typeof item !== 'object' || item === null) return null;
    const d = /** @type {{ snapshot_date?: unknown }} */ (item).snapshot_date;
    return typeof d === 'string' ? d : null;
  }
  const m = /^verifications\.(\d+)\.date$/.exec(campo);
  if (!m) return null;
  const lista = Array.isArray(linha.verifications) ? linha.verifications : [];
  const v = lista[Number(m[1])];
  if (typeof v !== 'object' || v === null) return null;
  const d = /** @type {{ date?: unknown }} */ (v).date;
  return typeof d === 'string' ? d : null;
}

/** O texto de um nó, com os espaços normalizados. */
const texto = (no) => String(no.text ?? '').replace(/\s+/g, ' ').trim();

/* OS MESES POR EXTENSO, escritos aqui outra vez e não importados (bloco R1,
   23.09.2026): o cartão de um concelho escreve o período da fonte como «julho de
   2026», e a comparação com a declaração (`2026-07`) só é uma segunda conta se a
   tabela for outra. */
const MESES = {
  pt: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};
/** @param {string} periodo AAAA-MM @param {string} lang */
const periodoPorExtenso = (periodo, lang) => {
  const m = /^(\d{4})-(\d{2})$/.exec(periodo);
  if (!m) return null;
  const nome = MESES[lang === 'en' ? 'en' : 'pt'][Number(m[2]) - 1];
  return lang === 'en' ? `${nome} ${m[1]}` : `${nome} de ${m[1]}`;
};
const temAlgarismo = (s) => /\d/.test(s);

/**
 * O PERÍODO DE UM PONTO NA FORMA DA CASA, a cópia própria deste portão (bloco RP4-c, 05.10.2026, o ponto 4 do
 * mandato): o mês «agosto de 2026» / «August 2026» pela tabela dos meses acima, o trimestre «2.º trimestre de 2026» /
 * «2nd quarter of 2026», o semestre «1.º semestre de 2026» / «1st half of 2026», e o ano como está. Escrita aqui outra
 * vez, e não importada de `src/lib/datas.mjs`, para a comparação ser uma segunda conta.
 * @param {string} periodo @param {string} lang
 */
const periodoDaCasaDoPortao = (periodo, lang) => {
  const mes = periodoPorExtenso(periodo, lang);
  if (mes) return mes;
  const t = /^(\d{4})-T([1-4])$/.exec(periodo);
  if (t) return lang === 'en' ? `${t[2]}${['st', 'nd', 'rd', 'th'][Number(t[2]) - 1]} quarter of ${t[1]}` : `${t[2]}.º trimestre de ${t[1]}`;
  const sm = /^(\d{4})-S([12])$/.exec(periodo);
  if (sm) return lang === 'en' ? `${sm[2]}${['st', 'nd'][Number(sm[2]) - 1]} half of ${sm[1]}` : `${sm[2]}.º semestre de ${sm[1]}`;
  return /^\d{4}$/.test(periodo) ? periodo : null;
};

/**
 * F2 · NENHUM NÚMERO SOLTO NUM DESENHO, os algarismos de um `<svg>` de uma forma (a regra do cabeçalho; posta numa
 * função no bloco RP4-c, 05.10.2026, para as plantas a correrem em memória). Cada texto com algarismos tem de estar
 * num `[data-claim]` ou numa marca de escala (`data-nonledger="escala-de-instrumento"`, F9), ou, desde o RP4-c, ser o
 * valor ou o período de um ponto de uma série no tempo (`data-ponto`, `data-ponto-periodo`), o que a leitura de cada
 * ponto escreve no desenho das séries. ESTAS DUAS ADMITEM-SE SÓ COMPARADAS, nunca pela presença da marca: o valor tem
 * de ser o do ponto que a marca nomeia, lido do ficheiro da série pelo leitor dos portões, e o período tem de ser o
 * desse ponto, na forma da casa pela cópia deste portão. Devolve as queixas, sem o caminho da página.
 * @param {import('node-html-parser').HTMLElement} svg @param {string} nome @param {string} lang
 */
function algarismosDoDesenho(svg, nome, lang) {
  const queixas = [];
  for (const t of svg.querySelectorAll('text, tspan, title, desc')) {
    if (t.querySelector('text, tspan')) continue;
    const conteudo = texto(t);
    if (!temAlgarismo(conteudo)) continue;
    const doPonto = t.getAttribute('data-ponto') ?? t.getAttribute('data-ponto-periodo');
    if (doPonto !== undefined && t.closest?.('[data-claim]') === null) {
      const [sid, chave] = String(doPonto).split('#');
      const serie = SERIES_DO_PORTAO.get(sid);
      const ponto = serie?.eixo === 'periodo' ? (serie.pontos ?? []).find((/** @type {{periodo: string}} */ x) => x.periodo === chave) : null;
      if (!ponto) {
        queixas.push(`F2 · a forma "${nome}" desenha «${conteudo.slice(0, 60)}» do ponto «${chave}» da série «${sid}», e a série não tem esse ponto no tempo.`);
      } else if (t.getAttribute('data-ponto') !== undefined) {
        if (conteudo !== String(ponto.valor).replace(/\s+/g, ' ').trim()) queixas.push(`F2 · a forma "${nome}" desenha o valor «${conteudo}» e o ponto «${chave}» da série «${sid}» vale «${ponto.valor}»: não é o valor do ponto.`);
      } else if (conteudo !== periodoDaCasaDoPortao(String(chave), lang)) {
        queixas.push(`F2 · a forma "${nome}" desenha o período «${conteudo}» e o ponto da série «${sid}» é de «${periodoDaCasaDoPortao(String(chave), lang)}»: não é o período do ponto.`);
      }
      continue;
    }
    /* F9 · O MOTIVO CONTA, E NÃO SÓ A PRESENÇA DO ATRIBUTO (leitura a frio
       do Codex, Major 6). `data-claim` é sempre uma linha; de
       `data-nonledger`, só a marca da régua de um instrumento é a escala de
       uma forma: qualquer outro motivo (uma data, um limiar, um
       identificador técnico) não descreve o que um algarismo desenhado
       pode ser aqui, e aceitá-lo era a fresta que deixava passar um número
       escrito à mão debaixo de um motivo emprestado de outro sítio da
       página. */
    const elDeclarado = (el) =>
      el.getAttribute('data-claim') !== undefined ||
      el.getAttribute('data-nonledger') === MOTIVO_DE_ESCALA;
    const declarado =
      elDeclarado(t) ||
      t.closest?.('[data-claim]') !== null ||
      t.closest?.(`[data-nonledger="${MOTIVO_DE_ESCALA}"]`) !== null;
    if (!declarado) {
      const motivoAlheio = t.getAttribute('data-nonledger') ?? t.closest?.('[data-nonledger]')?.getAttribute('data-nonledger');
      queixas.push(
        `a forma "${nome}" desenha «${conteudo.slice(0, 60)}», que tem algarismos e ` +
          `não resolve numa linha nem numa marca de escala declarada` +
          (motivoAlheio ? ` (o motivo "${motivoAlheio}" não é escala de instrumento).\n` : '.\n') +
          `      Um número desenhado é <Claim as="text"/> ou data-nonledger="${MOTIVO_DE_ESCALA}".`,
      );
    }
  }
  return queixas;
}

/**
 * AS PLANTAS DA F2 NO DESENHO DAS SÉRIES (bloco RP4-c, 05.10.2026, o ponto 4 do mandato), em memória e nunca no
 * `dist/`: sobre um desenho construído com zonas de leitura, um valor e um período que não são os do ponto, e um
 * período de um ponto que a série não tem, têm de ser recusados pela F2, com o controlo íntegro a passar primeiro.
 * @param {import('node-html-parser').HTMLElement} svg @param {string} lang
 */
function plantasDaF2(svg, lang) {
  const controlo = algarismosDoDesenho(svg, 'serie-do-pais', lang);
  const copia = () => /** @type {import('node-html-parser').HTMLElement} */ (parse(svg.outerHTML).querySelector('svg'));
  /** @type {[string, RegExp, (s: import('node-html-parser').HTMLElement) => void][]} */
  const casos = [
    ['um valor que não é o do ponto', /não é o valor do ponto/, (s) => { const [a, b] = s.querySelectorAll('[data-ponto]'); a.set_content(b.textContent === a.textContent ? `${a.textContent}1` : b.textContent); }],
    ['um período que não é o do ponto', /não é o período do ponto/, (s) => { const [a, b] = s.querySelectorAll('[data-ponto-periodo]'); a.set_content(b.textContent); }],
    ['um período de um ponto que a série não tem', /a série não tem esse ponto/, (s) => { const a = s.querySelector('[data-ponto-periodo]'); a.setAttribute('data-ponto-periodo', `${String(a.getAttribute('data-ponto-periodo')).split('#')[0]}#1800-01`); }],
  ];
  return casos.map(([nome, mordida, muda]) => {
    const s = copia(); muda(s);
    const queixa = algarismosDoDesenho(s, 'serie-do-pais', lang).find((e) => mordida.test(e));
    return { nome, controlo: controlo.length, mordeu: !controlo.length && Boolean(queixa), queixa: queixa ?? null };
  });
}

/* ========================================================================== */
/* A varredura                                                                */
/* ========================================================================== */

/* ---------------------------------------------------------------------------
 * F5 · O CONJUNTO DAS LINHAS COM LEITURA BREVE, E AS DATAS DE CADA RECIBO
 * ---------------------------------------------------------------------------
 * A conferência é em duas metades porque atravessa páginas: a leitura breve
 * vive na página do domínio e na primeira página, e as três datas vivem no
 * recibo, que é outra página. A varredura recolhe as duas coisas; a conferência
 * faz-se no fim, quando já não falta nenhum ficheiro por ler.
 *
 * AS TRÊS DATAS DO RECIBO SÃO TRÊS CAMPOS DA LINHA, e são os mesmos três que a
 * dobra escrevia (`tresDatasDaLinha()`, em `src/lib/dominios.mjs`): o período de
 * referência, a data em que a fonte publicou ou em que foi lida, e a data da
 * última verificação. No recibo rendem-se como campos do livro-razão, com
 * `data-linha-campo`, e é por essa marca que se contam.
 */
/* O CONJUNTO DOS ALVOS LÊ-SE DO `dist/`, e não de uma declaração (achado 11 da
   leitura a frio do Codex, 16.09.2026). A primeira redação desta célula tirava
   os alvos de `MEDIDAS_DO_DOMINIO_1` e de `FIGURAS`, que é a declaração a
   medir-se a ela própria: uma leitura breve rendida a partir de outro sítio
   nunca entrava, e o HTML só dava uma contagem global de leituras. Agora cada
   leitura breve declara a SUA linha na página, com `data-leitura`, que é a marca
   que a dobra (`LeituraBreve.astro`) já usava e que a página do domínio passou a
   levar também; a varredura recolhe-a e a conferência corre sobre o que se
   rendeu.

   O QUE ISTO ALARGOU, medido a 16.09.2026: de 29 linhas e 58 recibos para 2 177
   linhas e 4 354 recibos, porque as leituras breves das 308 páginas de concelho
   e as do quadro europeu passaram a contar. Todas passam.

   AS DERIVADAS FICAM DE FORA, e a razão é da linha e não da régua: uma linha
   derivada não tem fonte nem documento, porque a proveniência dela é a das
   origens, e por isso não tem data de leitura nem verificação próprias para
   mostrar. Exigir-lhe três datas era exigir-lhe uma proveniência que o
   livro-razão não lhe dá (medido: são 308, todas do índice de dívida de um
   concelho, e todas rendem só o período de referência).

   A DECLARAÇÃO CONTINUA A SER LIDA, mas do outro lado: o que ela serve agora é
   o CONTROLO, mais abaixo, de que nenhuma medida declarada com leitura deixou
   de se render. As duas perguntas são diferentes e cada uma tem a sua fonte. */
const linhasComLeituraBreve = new Set();
const linhasDeclaradasComLeitura = new Set();
/* AS IRMÃS DE UMA MEDIDA NÃO SÃO LEITURAS: são valores que a leitura de outra
   medida mostra ao lado do seu (hoje uma só, o salário mínimo a doze meses, ao
   lado do de catorze). Não se rendem com `data-leitura` porque não são a linha
   DE uma leitura, e por isso não entram no controlo de «declarada e não
   rendida»; entram nos ALVOS na mesma, porque o recibo delas é um recibo que a
   página do domínio faz o leitor querer abrir, e era isso que a primeira
   redação desta célula já exigia. */
const linhasIrmasDeclaradas = new Set();
for (const slug of slugsDosDominios()) {
  for (const m of medidasDoDominio(slug)) {
    if (m.claim) linhasDeclaradasComLeitura.add(m.claim);
    for (const o of m.claims ?? []) if (o.id) linhasIrmasDeclaradas.add(o.id);
  }
}
for (const f of FIGURAS) {
  if (typeof f.claim === 'string') linhasDeclaradasComLeitura.add(f.claim);
}
/** @type {Map<string, Record<string, { campos: Set<string>, verificacoes: Set<string> }>>} */
const datasDoRecibo = new Map();

const contas = {
  paginas: 0,
  paginas_dos_lugares: 0,
  datas_de_linha: 0,
  datas_de_serie: 0,
  /* F19, UE1: as faixas da União e as suas plantas. */
  faixas: 0,
  faixas_nos_temas: 0,
  marcas_das_faixas: 0,
  frases_das_faixas: 0,
  empates_nas_faixas: 0,
  plantas_das_faixas: 0,
  ressalvas_nas_pontas: 0,
  ressalvas_nos_temas: 0,
  ordinais_conferidos: 0,
  marcas_com_palavras: 0,
  plantas_das_palavras: 0,
  /* F20, UE2: a secção dos países da página da União e as suas plantas. */
  seccoes_dos_paises: 0,
  faixas_dos_paises: 0,
  marcas_dos_paises: 0,
  /* UE2-b: a definição declarada por baixo do nome de cada faixa (F20g). */
  definicoes_dos_paises: 0,
  etiquetas_do_toque: 0,
  listas_dos_paises: 0,
  itens_das_listas: 0,
  ressalvas_da_uniao_nos_paises: 0,
  plantas_dos_paises: 0,
  plantas_dos_empates: 0,
  formas: 0,
  formas_por_nome: /** @type {Record<string, number>} */ ({}),
  medidas_com_leitura: 0,
  recibos_com_tres_datas: 0,
  recibos_derivados: 0,
  ausencias: 0,
  concelhos_com_ganho: /** @type {Record<string, number>} */ ({ pt: 0, en: 0 }),
  concelhos_com_populacao: /** @type {Record<string, number>} */ ({ pt: 0, en: 0 }),
  concelhos: /** @type {Record<string, number>} */ ({ pt: 0, en: 0 }),
  linhas_citadas: new Set(),
  periodos_da_fonte: 0,
  contagens_por_extenso: 0,
  paginas_com_atraso: /** @type {Record<string, number>} */ ({ pt: 0, en: 0 }),
  /* F17, bloco R1: os cartões de concelho numa série atrasada, e as frases certas. */
  frescura_esperada: /** @type {Record<string, number>} */ ({ pt: 0, en: 0 }),
  frescura_nos_cartoes: /** @type {Record<string, number>} */ ({ pt: 0, en: 0 }),
  calendarios_dos_mandatos: 0,
  pontos_no_calendario: 0,
  plantas_do_calendario: 0,
  /* RP4-c: os valores e os períodos dos pontos escritos nos desenhos das séries, que a F2 admite só comparados. */
  algarismos_de_pontos_nos_desenhos: 0,
};

/* Os rótulos das duas medidas dos 308 que a F7 conta, lidos da declaração e não
   escritos aqui: uma cópia do rótulo divergia no dia em que ele mudasse. */
const medidaDoConcelho = (chave) => {
  const m = MEDIDAS_DO_CONCELHO.find((x) => x.chave === chave);
  if (!m) throw new Error(`check:formas: a medida de concelho "${chave}" não está declarada.`);
  return m;
};
const ROTULO_GANHO = medidaDoConcelho('ganho').nome;
const ROTULO_POPULACAO = medidaDoConcelho('populacao').nome;

/* ---------------------------------------------------------------------------
 * O ATRASO: a série declarada, e as linhas que ela apanha (F13 a F15)
 * ---------------------------------------------------------------------------
 * A REGRA DE PERTENÇA ESCREVE-SE AQUI OUTRA VEZ, e é de propósito: este é o
 * segundo ponto de observação sobre o mesmo facto, como o `gate:html` faz às
 * chaves da prova. Se `src/lib/frescura.mjs` e este ficheiro se afastarem, é aqui
 * que isso aparece, em vez de os dois concordarem por serem o mesmo código.
 */
const SERIE_POR_ID = new Map(SERIES_ATRASADAS.map((s) => [s.id, s]));
const idsAtrasados = new Set(
  [...claims.values()]
    .filter((c) =>
      SERIES_ATRASADAS.some(
        (s) =>
          c.source === s.fonte &&
          /** @type {{title?: unknown}} */ (c.document ?? {}).title === s.documento &&
          c.reference_date === s.periodoDaCasa,
      ),
    )
    .map((c) => c.id),
);

for (const ficheiro of paginasDe(DIST)) {
  const caminho = '/' + path.relative(DIST, ficheiro).split(path.sep).join('/');
  const rota = matchPath(caminho.replace(/index\.html$/, ''));
  if (rota?.key === 'documento') continue;
  const html = fs.readFileSync(ficheiro, 'utf8');
  const root = parse(html);
  const rel = path.relative(RAIZ, ficheiro);
  contas.paginas++;

  /* F21 · RP4: a geometria recomposta do livro, incluindo cada marca dos eixos.
     As plantas só mexem em cadeias em memória, nunca no dist/. */
  for (const svg of root.querySelectorAll('svg[data-forma="serie-do-pais"]')) {
    desenhosRP4++;
    const lang = rota?.lang === 'en' ? 'en' : 'pt';
    for (const e of conferirSerie(svg, lang)) err(`${rel}: ${e}`);
    /* A REGRA DA PÁGINA, que mudou de forma no RP4-m (05.10.2026, o ponto 4 do mandato): o modo indexado só no
       recibo de uma série com figura declarada em `FIGURAS_INDEXADAS`, com as séries da declaração, e o gráfico de
       qualquer outro recibo só a sua série (`regraDaPagina`, em `tests/formas/serie-do-pais.mjs`, com as plantas). */
    const queixasDaPagina = regraDaPagina(svg, rota);
    for (const e of queixasDaPagina) err(`${rel}: ${e}`);
    if (rota?.key === 'serie') {
      recibosRP4.add(`${lang}:${rota.params.slug}`);
      if (!queixasDaPagina.length && lang === 'pt') {
        const slug = String(rota.params.slug);
        if (FIGURAS_INDEXADAS[slug] && !controlosDaRegra.figura) controlosDaRegra.figura = { svg: parse(svg.outerHTML).querySelector('svg'), slug };
        if (!FIGURAS_INDEXADAS[slug] && !controlosDaRegra.comum) controlosDaRegra.comum = { svg: parse(svg.outerHTML).querySelector('svg'), slug };
      }
    }
    /* As plantas correm sobre o desenho com o seu pai, onde vivem a legenda da unidade e a das linhas excluídas
       (RP4-c): sem o pai, a F21 dava a legenda da unidade por ausente no controlo. */
    const comOPai = svg.parentNode?.outerHTML ?? svg.outerHTML;
    if (!plantasRP4.some((p) => p.lang === lang)) {
      for (const p of plantasDaSerie(comOPai, lang)) { plantasRP4.push({ lang, ...p }); if (!p.mordeu) err(`${rel}: F21 · planta ${p.nome} não mordeu: ${p.queixa}`); }
    }
    /* RP4-c (os pontos 1 e 4): as plantas da leitura de cada ponto, no primeiro desenho com zonas de cada edição, e as
       da legenda da unidade, no primeiro desenho com ela. */
    if (svg.querySelector('[data-ponto-periodo]') && !plantasDaLeituraRP4C.some((p) => p.lang === lang && p.de === 'leitura')) {
      for (const p of plantasDaLeitura(comOPai, lang)) { plantasDaLeituraRP4C.push({ lang, de: 'leitura', ...p }); if (!p.mordeu) err(`${rel}: F21 · planta da leitura «${p.nome}» não mordeu: ${p.queixa}`); }
    }
    if (svg.parentNode?.querySelector('[data-serie-unidade-legenda]') && !plantasDaLeituraRP4C.some((p) => p.lang === lang && p.de === 'legenda')) {
      for (const p of plantasDaLegenda(comOPai, lang)) { plantasDaLeituraRP4C.push({ lang, de: 'legenda', ...p }); if (!p.mordeu) err(`${rel}: F21 · planta da legenda «${p.nome}» não mordeu: ${p.queixa}`); }
    }
  }

  /* F19, UE1 (29.09.2026): a faixa da União em cada cartão nacional das medidas
     com série de países, refeita dos pontos (`tests/cartao/faixa.mjs`, que a K18
     do `check:cartao` também chama). Nas duas páginas dos temas correm também as
     plantas em memória, e cada uma tem de morder. */
  if (html.includes('data-cartao-medida') || html.includes('data-faixa-ue')) {
    const lingua = rota?.lang === 'en' ? 'en' : 'pt';
    const f19 = conferirFaixas(root, lingua, caminho, { series: SERIES_DE_PAISES, paises: PAISES_DO_PORTAO });
    for (const e of f19.erros) err(`${rel}: ${e}`);
    contas.faixas += f19.contas.faixas;
    contas.marcas_das_faixas += f19.contas.marcas;
    contas.frases_das_faixas += f19.contas.frases;
    contas.empates_nas_faixas += f19.contas.empates;
    contas.ressalvas_nas_pontas += f19.contas.ressalvas;
    if (rota?.key?.startsWith('entrada')) {
      contas.faixas_nos_temas += f19.contas.faixas;
      contas.ressalvas_nos_temas += f19.contas.ressalvas;

    }
  }

  /* F20, UE2 (02.10.2026): a secção dos países da página da União, refeita dos pontos pela mesma função da faixa
     do cartão, com a lista dobrada e as etiquetas do toque (`tests/uniao/paises.mjs`); e, nas duas edições dela, as
     plantas em memória, que têm de morder. Uma faixa dos países noutra página fecha a construção. */
  if (rota?.key === 'uniaoEuropeia') {
    const lingua = rota.lang === 'en' ? 'en' : 'pt';
    const ctx = { series: SERIES_DE_PAISES, paises: PAISES_DO_PORTAO };
    const f20 = conferirSeccaoDosPaises(root, lingua, caminho, ctx);
    for (const e of f20.erros) err(`${rel}: ${e}`);
    contas.seccoes_dos_paises += f20.contas.seccoes;
    contas.faixas_dos_paises += f20.contas.faixas;
    contas.marcas_dos_paises += f20.contas.marcas;
    contas.definicoes_dos_paises += f20.contas.definicoes;
    contas.etiquetas_do_toque += f20.contas.etiquetas;
    contas.listas_dos_paises += f20.contas.listas;
    contas.itens_das_listas += f20.contas.itens;
    contas.ressalvas_da_uniao_nos_paises += f20.contas.ressalvas_da_uniao;
    if (!f20.erros.length) {
      for (const planta of plantasDaSeccao(html, lingua, caminho, ctx)) {
        contas.plantas_dos_paises++;
        if (!planta.passou) err(`F20: a planta «${planta.nome}» (${lingua}) não mordeu (${planta.porque}).`);
      }
    }
  } else if (html.includes('data-faixa-paises')) {
    err(`${rel}: F20a · uma faixa da secção dos países fora da página da União`);
  }

  /* F18, C1: o ano de cada dívida ocupa a sua posição no calendário comum.
     A célula independente relê as origens da conta e prova as lacunas com
     estragos em memória. A I77 continua a proteger o nome por verificar. */
  if (rota?.key === 'municipio' || root.querySelector('[data-instrumento="mandatos"]')) {
    const municipio = rota?.key === 'municipio'
      ? MUNICIPIOS_COM_PAGINA.find((m) => m.slug === rota.params.slug)
      : null;
    const resultado = conferirCalendario(root, municipio, rota?.lang ?? 'pt', claims);
    for (const erro of resultado.erros) err(`${rel}: ${erro}`);
    if (municipio?.tempo) {
      contas.calendarios_dos_mandatos++;
      contas.pontos_no_calendario += resultado.pontos.length;
      if (!resultado.erros.length) {
        for (const planta of plantasDoCalendario(root, municipio, rota.lang, claims)) {
          contas.plantas_do_calendario++;
          if (!planta.passou) err(`${rel}: F18: a planta ${planta.nome} não mordeu.`);
        }
      }
    }
  }

  /* ------------------------------------------------------------------ F1 --- */
  for (const el of root.querySelectorAll('[data-nonledger="data-da-linha"]')) {
    contas.datas_de_linha++;
    /* UMA DATA DE UMA LINHA DE SÉRIE (bloco UE1, 29.09.2026): o mesmo motivo, e
       em vez da linha diz a série (`data-linha-de-serie`). O campo vai-se buscar
       ao ficheiro da série, pelo leitor próprio dos portões, e recompõe-se pela
       mesma regra. */
    if (el.hasAttribute('data-linha-de-serie')) {
      const sid = el.getAttribute('data-linha-de-serie') ?? '';
      const campo = el.getAttribute('data-de-campo') ?? '';
      const serie = SERIES_DO_PORTAO.get(sid);
      const bruto = serie ? campoDeDataDaSerie(serie, campo) : null;
      if (typeof bruto !== 'string') {
        err(`${rel}: uma data diz vir do campo "${campo}" da série "${sid}", e a série não o tem.`);
        continue;
      }
      contas.datas_de_serie++;
      const esperado = dataDaCasa(bruto, rota?.lang === 'en' ? 'en' : 'pt');
      if (texto(el) !== esperado) {
        err(`${rel}: a data do campo "${campo}" da série "${sid}" não é a da série.\n      na série: ${bruto} · na forma da casa: ${esperado}\n      renderizado: ${texto(el)}`);
      }
      continue;
    }
    const id = el.getAttribute('data-de-linha') ?? '';
    const campo = el.getAttribute('data-de-campo') ?? '';
    const linha = claims.get(id);
    if (!linha) {
      err(`${rel}: uma data diz vir da linha "${id}", que não existe no livro-razão.`);
      continue;
    }
    const bruto = campoDaData(linha, campo);
    if (bruto === null) {
      err(
        `${rel}: uma data diz vir do campo "${campo}" da linha "${id}", e a linha não tem ` +
          `esse campo. Um campo que a linha não tem não se mostra.`,
      );
      continue;
    }
    const lingua = rota?.lang === 'en' ? 'en' : 'pt';
    const preposicao = preposicaoDoPeriodo(el, bruto, lingua);
    if (preposicao) err(`${rel}: ${preposicao}`);
    const esperado = dataDaCasa(bruto, lingua);
    const rendido = texto(el);
    if (rendido !== esperado) {
      err(
        `${rel}: a data do campo "${campo}" de "${id}" não é a da linha.\n` +
          `      no livro-razão: ${bruto} · na forma da casa: ${esperado}\n` +
          `      renderizado:    ${rendido}`,
      );
    }
  }

  /* ------------------------------------------------------------- F13, F15 --- */
  for (const el of root.querySelectorAll('[data-nonledger="periodo-da-fonte"]')) {
    contas.periodos_da_fonte++;
    const id = el.getAttribute('data-de-serie') ?? '';
    const serie = SERIE_POR_ID.get(id);
    if (!serie) {
      err(
        `${rel}: um período diz vir da série "${id}", que não está declarada em ` +
          `src/data/frescura.mjs. Um período sem série não tem origem nenhuma.`,
      );
      continue;
    }
    const rendido = texto(el);
    /* DUAS FORMAS, E AS DUAS RECOMPOSTAS AQUI (bloco R1, 23.09.2026): o recibo
       escreve o período como a série o declara (`2026-07`), e o cartão de um
       concelho escreve-o por extenso («julho de 2026»), pela tabela dos meses
       deste guião. Qualquer outra coisa é um período sem origem. */
    const formas = [serie.periodoDaFonte, periodoPorExtenso(serie.periodoDaFonte, rota?.lang ?? 'pt')];
    if (!formas.includes(rendido)) {
      err(
        `${rel}: o período da fonte da série "${id}" não é o que a declaração traz.\n` +
          `      em src/data/frescura.mjs: ${formas.join(' ou ')}\n` +
          `      renderizado:              ${rendido}`,
      );
    }
  }
  /* F5, a recolha dos ALVOS: as linhas que uma leitura breve RENDIDA declara.
     SÃO DUAS MARCAS, e cada uma diz a forma da sua página: `data-leitura` é o
     `<details>` que É a dobra da leitura de uma linha (o quadro europeu, a
     página de concelho), e `data-leitura-linha` é o artigo da página do domínio,
     que rende a leitura noutra forma. A segunda nasceu porque a primeira já
     prometia uma `.dobra-definicao` lá dentro ao item 8.4 do `check:lugar`, e
     usá-la aqui fechava o `verify` com seis falsas. */
  /* N1: as leituras nacionais vivem nos cartões das páginas de assunto. A
     recolha inclui a marca já conferida pelo K16, mantendo as três datas do
     recibo de cada linha. Não se reduz a lista declarada dos alvos. */
  for (const el of root.querySelectorAll('[data-leitura], [data-leitura-linha], [data-cartao-medida] [data-cartao-leitura]')) {
    const id = el.getAttribute('data-leitura') ?? el.getAttribute('data-leitura-linha') ?? el.getAttribute('data-cartao-leitura');
    /* A migração conserva os alvos anteriores do F5. As restantes leituras
       nacionais pertencem ao K16; não passam a prometer as três datas que a
       antiga página do domínio nunca lhes exigiu. */
    if (id && (!el.hasAttribute('data-cartao-leitura') || linhasDeclaradasComLeitura.has(id))) linhasComLeituraBreve.add(id);
  }

  /* F5, a recolha: que datas é que o recibo de cada linha rende, por edição. */
  if (rota?.key === 'linha') {
    const id = rota.params.slug ?? '';
    if (!datasDoRecibo.has(id)) datasDoRecibo.set(id, {});
    const porEdicao = datasDoRecibo.get(id);
    const registo = (porEdicao[rota.lang] ??= { campos: new Set(), verificacoes: new Set() });
    const campos = registo.campos;
    /* A MARCA DE UMA DATA NÃO É `data-linha-campo`, e é bem que não seja: uma
       data do livro-razão está em ISO no ficheiro e escreve-se `dd.mm.aaaa` na
       página, e uma comparação literal nunca passaria. `CampoDaLinha` delega-a a
       `DataDaLinha`, que diz de que linha e de que campo ela é
       (`data-de-campo`), e a F1 deste mesmo portão já recompõe cada uma e
       compara-a com o livro-razão. É essa marca que se conta. */
    for (const el of root.querySelectorAll('[data-nonledger="data-da-linha"]')) {
      const campo = el.getAttribute('data-de-campo') ?? '';
      if (campo === 'reference_date') campos.add('periodo');
      else if (campo === 'published_at' || campo === 'access_date') campos.add('leitura');
      else if (/^verifications\.\d+\.date$/.test(campo)) {
        campos.add('verificacao');
        /* O NOME DO CAMPO E NÃO SÓ A CLASSE: qualquer `verifications.N.date`
           satisfazia «a última verificação», e um recibo que guardasse só uma
           verificação antiga passava por mostrar a mais recente (achado 11). */
        registo.verificacoes.add(campo);
      }
    }
  }

  /* ------------------------------------------------------------------ F17 --- */
  if (rota?.key === 'municipio') {
    for (const cartao of root.querySelectorAll('[data-cartao-medida]')) {
      const id = cartao.getAttribute('data-cartao-medida') ?? '';
      const c = claims.get(id);
      const serie = c ? SERIES_ATRASADAS.find((s) =>
        c.source === s.fonte &&
        /** @type {{title?: unknown}} */ (c.document ?? {}).title === s.documento &&
        c.reference_date === s.periodoDaCasa) : null;
      const atrasada = Boolean(serie && c && serie.periodoDaFonte > String(c.reference_date));
      const frases = cartao.querySelectorAll('[data-frescura]');
      if (!atrasada) {
        if (frases.length) err(`${rel}: o cartão de "${id}" diz que a fonte já publicou um período mais recente, e a linha não está numa série atrasada (F17).`);
        continue;
      }
      contas.frescura_esperada[rota.lang]++;
      if (frases.length !== 1) {
        err(`${rel}: o cartão de "${id}" está numa série atrasada e tem ${frases.length} frase(s) da frescura; tem de ter uma (F17).`);
        continue;
      }
      const f = frases[0];
      const periodo = f.querySelector('[data-nonledger="periodo-da-fonte"]');
      const lido = f.querySelector('[data-de-serie-lida]');
      const esperadoPeriodo = periodoPorExtenso(serie.periodoDaFonte, rota.lang);
      const esperadoLido = dataDaCasa(serie.origem.lidoEm);
      if (f.getAttribute('data-frescura') !== serie.id || !periodo || texto(periodo) !== esperadoPeriodo ||
          !lido || lido.getAttribute('data-de-serie-lida') !== serie.id || texto(lido) !== esperadoLido) {
        err(
          `${rel}: a frase da frescura do cartão de "${id}" não é a da série declarada (F17).\n` +
            `      esperado: ${serie.id} · ${esperadoPeriodo} · lido a ${esperadoLido}\n` +
            `      rendido:  ${f.getAttribute('data-frescura')} · ${periodo ? texto(periodo) : '(sem período)'} · ` +
            `${lido ? texto(lido) : '(sem data)'}`,
        );
        continue;
      }
      contas.frescura_nos_cartoes[rota.lang]++;
    }
  }

  if (rota?.key === 'linha' && idsAtrasados.has(rota.params.slug ?? '')) {
    const marcas = root.querySelectorAll('[data-nonledger="periodo-da-fonte"]').length;
    if (marcas === 0) {
      err(
        `${rel}: a linha "${rota.params.slug}" está numa série atrasada e a página não diz o ` +
          `atraso. Um selo conferido ao lado de um valor de outro período promete uma frescura ` +
          `que a página não tem.`,
      );
    } else {
      contas.paginas_com_atraso[rota.lang]++;
    }
  }

  /* ---------------------------------------------------------------- F2, F3 --- */
  for (const forma of root.querySelectorAll('[data-forma]')) {
    const nome = forma.getAttribute('data-forma') ?? '';
    contas.formas++;
    contas.formas_por_nome[nome] = (contas.formas_por_nome[nome] ?? 0) + 1;
    if (!FORMAS.has(nome)) {
      err(
        `${rel}: a forma gráfica "${nome}" não é uma das ${FORMAS.size} admitidas ` +
          `(${[...FORMAS].join(', ')}). O §3 do brief da forma dos domínios e o §2 do brief do PP1 fecham a lista.`,
      );
    }
    for (const proibido of PROIBIDOS_NUM_DESENHO) {
      if (forma.querySelectorAll(proibido).length > 0) {
        err(
          `${rel}: a forma "${nome}" tem <${proibido}> lá dentro. As formas da casa são SVG ` +
            `estático, sem guião, sem biblioteca e sem animação.`,
        );
      }
    }
    const linguaDaForma = rota?.lang === 'en' ? 'en' : 'pt';
    for (const svg of (forma.rawTagName === 'svg' ? [forma] : forma.querySelectorAll('svg'))) {
      for (const e of algarismosDoDesenho(svg, nome, linguaDaForma)) err(`${rel}: ${e}`);
      /* RP4-c: as plantas da F2 correm uma vez por edição, no primeiro desenho das séries com zonas de leitura. */
      if (nome === 'serie-do-pais' && svg.querySelector('[data-ponto-periodo]') && !plantasF2.some((x) => x.lang === linguaDaForma)) {
        for (const pl of plantasDaF2(svg, linguaDaForma)) {
          plantasF2.push({ lang: linguaDaForma, ...pl });
          if (!pl.mordeu) err(`${rel}: F2 · planta «${pl.nome}» não mordeu: ${pl.queixa}`);
        }
      }
      contas.algarismos_de_pontos_nos_desenhos += svg.querySelectorAll('[data-ponto], [data-ponto-periodo]').length;
    }
  }

  /* ------------------------------------------------------- as páginas dos lugares */
  if (rota?.key === 'lugares') {
    contas.paginas_dos_lugares++;

    /* --------------------------------------------------------------- F5 ---
       A CONTAGEM DAS LEITURAS BREVES DESTA PÁGINA. A conferência das três datas
       está depois da varredura, onde os recibos já foram todos lidos; aqui só se
       conta, para que a saída do portão diga quantas leituras breves existiam
       quando ele mediu. */
    contas.medidas_com_leitura += root.querySelectorAll('[data-medida]').length;

    /* --------------------------------------------------------------- F8 --- */
    for (const ausencia of root.querySelectorAll('[data-ausencia]')) {
      contas.ausencias++;
      const chave = ausencia.getAttribute('data-ausencia') ?? '';
      if (ausencia.querySelectorAll('[data-claim]').length > 0) {
        err(
          `${rel}: o cartão de ausência "${chave}" tem um valor do livro-razão lá dentro. ` +
            `Uma ausência com um número deixa de ser uma ausência.`,
        );
      }
      /* E nenhum algarismo FORA de uma origem declarada NESTE CONTEXTO (F9,
         leitura a frio, Major 6). O código de um indicador que se procurou é
         um identificador técnico e leva o seu motivo (`identificador-tecnico`,
         `MOTIVO_DE_AUSENCIA`); um valor escrito à mão não leva nenhum motivo
         admissível AQUI, mesmo que leve um motivo válido noutro sítio do
         sítio. Só se retiram `[data-claim]`, `[data-verbatim]` e o motivo da
         ausência antes de contar: um `data-nonledger` disfarçado com outro
         motivo (um limiar, uma data) fica no texto, e `temAlgarismo()`
         apanha-o. */
      const clone = parse(ausencia.outerHTML);
      for (const marcado of clone.querySelectorAll(
        `[data-claim],[data-verbatim],[data-nonledger="${MOTIVO_DE_AUSENCIA}"]`,
      )) {
        marcado.remove();
      }
      for (const outro of clone.querySelectorAll('[data-nonledger]')) {
        if (outro.getAttribute('data-nonledger') === MOTIVO_DE_AUSENCIA) continue;
        err(
          `${rel}: o cartão de ausência "${chave}" leva data-nonledger="${outro.getAttribute('data-nonledger')}", ` +
            `e dentro de uma ausência o único motivo admissível é "${MOTIVO_DE_AUSENCIA}" ` +
            `(o identificador do indicador que se procurou).`,
        );
      }
      const corpo = texto(clone);
      if (temAlgarismo(corpo)) {
        err(
          `${rel}: o cartão de ausência "${chave}" escreve algarismos sem origem declarada ` +
            `(«${corpo.slice(0, 80)}»). A resposta é «não há número público para isto», com a ` +
            `fonte que se procurou.`,
        );
      }
    }

    /* --------------------------------------------------------------- F6 --- */
    for (const el of root.querySelectorAll('[data-claim]')) {
      const id = el.getAttribute('data-claim') ?? '';
      contas.linhas_citadas.add(id);
      if (!claims.has(id)) err(`${rel}: cita a linha "${id}", que não existe no livro-razão.`);
    }

    /* --------------------------------------------------------------- F9 ---
       O ESCOPO É A MANCHETE E A LEITURA BREVE, e não a página inteira: ver a
       nota de `MOTIVOS_DO_DOMINIO`. */
    const escopoF9 = [root.querySelector('.cabeca-h1'), root.querySelector('[data-comparacoes-concelhos]')].filter(
      (el) => el !== null,
    );
    for (const bloco of escopoF9) {
      for (const el of bloco.querySelectorAll('[data-nonledger]')) {
        const motivo = el.getAttribute('data-nonledger') ?? '';
        if (!MOTIVOS_DO_DOMINIO.has(motivo)) {
          err(
            `${rel}: data-nonledger="${motivo}" não é um dos motivos que a manchete ou a leitura ` +
              `breve usam (${[...MOTIVOS_DO_DOMINIO].join(', ')}). Um motivo novo entra na lista ` +
              `fechada do portão e em ledger/allowlist.yml, com a sua razão.`,
          );
        }
      }
    }

    /* -------------------------------------------------------------- F10 --- */
    {
      const corpo = root.querySelector('body');
      const clone = parse((corpo ?? root).outerHTML);
      for (const fora of clone.querySelectorAll('script, style')) fora.remove();
      const textoDoCorpo = texto(clone);
      /* SEM `\b` NO FIM (medido nesta segunda passagem, planta P8 de
         `tests/dominio/pagina.mjs`). `texto()` junta o texto de blocos vizinhos
         sem separador nenhum: é a mesma função que rende «…calcula.Leitura
         breve…» sem espaço entre o fim de uma secção e o início da seguinte, e
         uma data ISO à beira de um bloco vizinho que comece por letra não
         tinha fronteira de palavra nenhuma a seguir ao último algarismo: o `\b`
         da direita nunca via a planta. O que fecha o grupo dos dois algarismos
         do dia é «não vem mais um algarismo a seguir», e não «vem uma
         não-palavra»: um "L" a seguir a "01" não estende a data, e continua a
         ser a mesma data ISO. */
      const isoNoTexto = /\b\d{4}-\d{2}-\d{2}(?!\d)/.exec(textoDoCorpo);
      if (isoNoTexto) {
        err(
          `${rel}: o texto da página traz «${isoNoTexto[0]}», uma data em ISO. A regra da casa é ` +
            `uma só forma, dd.mm.aaaa: uma data ISO à vista é uma leitura que não passou por ` +
            `dataDaCasa() (src/lib/datas.mjs).`,
        );
      }
    }

    /* -------------------------------------------------------------- F11 --- */
    for (const mapaEl of root.querySelectorAll('[data-forma="mapa-por-concelho"]')) {
      /* O MESMO ELEMENTO leva `data-forma` e `data-instrumento`
         (`MapaPorConcelho.astro`: `<figure class="forma forma-mapa"
         data-instrumento={...} data-forma="mapa-por-concelho">`). */
      const instrumento = mapaEl.getAttribute('data-instrumento') ?? '';
      const chave = instrumento.startsWith('mapa-por-concelho-')
        ? instrumento.slice('mapa-por-concelho-'.length)
        : '';
      if (chave !== 'ganho' && chave !== 'indice') {
        err(`${rel}: um mapa por concelho declara o instrumento "${instrumento}", sem uma chave conhecida.`);
        continue;
      }
      const linhasDaChave = linhasPorConcelho(chave);
      for (const uso of mapaEl.querySelectorAll('use[data-concelho]')) {
        const slug = uso.getAttribute('data-concelho') ?? '';
        const id = linhasDaChave.get(slug) ?? null;
        const valor = id === null ? null : getClaim(id).value;
        const temValorNumerico = valor !== null && !eValorTextual(valor) && parsePtNumber(valor) !== null;
        const semValorNaClasse = (uso.getAttribute('class') ?? '').split(/\s+/).includes('sem-valor');
        if (temValorNumerico && semValorNaClasse) {
          err(
            `${rel}: o concelho "${slug}" tem um valor numérico em "${id}" e o mapa pinta-o ` +
              `"sem-valor". A classe e a linha discordam.`,
          );
        }
        if (!temValorNumerico && !semValorNaClasse) {
          err(
            `${rel}: o concelho "${slug}" não tem valor numérico publicado (${id ?? 'sem linha'}) ` +
              `e o mapa pinta-o com uma classe da escala em vez de "sem-valor".`,
          );
        }
      }
    }
  }

  /* ------------------------------------------------------------------ F7 --- */
  if (rota?.key === 'municipio') {
    const lang = rota.lang;
    contas.concelhos[lang]++;
    const corpo = root.querySelector('body');
    const t = texto(corpo ?? root);
    if (t.includes(ROTULO_GANHO[lang])) contas.concelhos_com_ganho[lang]++;
    if (t.includes(ROTULO_POPULACAO[lang])) contas.concelhos_com_populacao[lang]++;
  }
}

/* F18: a ausência das duas páginas não pode passar por um calendário certo. */
const calendariosEsperados = MUNICIPIOS_COM_PAGINA.filter((m) => m.tempo).length * LANGS.length;
if (contas.calendarios_dos_mandatos !== calendariosEsperados) {
  err(`F18: calendários conferidos ${contas.calendarios_dos_mandatos}; esperados ${calendariosEsperados}.`);
}

/* ========================================================================== */
/* Os conhecidos-positivos, antes de qualquer zero valer alguma coisa         */
/* ========================================================================== */

if (contas.paginas === 0) {
  err('a varredura não encontrou uma única página em dist/. A leitura está cega.');
}

/* N1: as plantas da faixa precisam do conjunto dos cartões, distribuído por assuntos. */
for (const lang of LANGS) for (const planta of plantasDaFaixa(documentoDosAssuntos(DIST, lang).outerHTML, lang, `assuntos-${lang}`, { series: SERIES_DE_PAISES, paises: PAISES_DO_PORTAO })) {
  contas.plantas_das_faixas++;
  if (!planta.passou) err(`F19: a planta «${planta.nome}» não mordeu (${planta.porque}).`);
}
/* N1d: Lugares e os controlos F1 a F3 existem mesmo sem domínios. */
const esperadas = LANGS.length;
if (contas.paginas_dos_lugares !== esperadas) {
  err(
    `há uma página dos lugares em cada uma das ${LANGS.length} edições, e a varredura ` +
      `encontrou ${contas.paginas_dos_lugares} página(s) dos lugares em vez de ${esperadas}. ` +
      `Ou a construção não as fez, ou a leitura não as vê.`,
  );
}
if (contas.datas_de_linha === 0) {
  err(
    'nenhuma data de linha foi encontrada em dist/, e os recibos e as leituras rendem três por ' +
      'medida. O conhecido-positivo da F1 falhou: a marca mudou de nome ou a leitura partiu-se.',
  );
}
if (contas.formas === 0) {
  err(
    'nenhuma forma gráfica foi encontrada em dist/, e a página dos lugares desenha ' +
      'pelo menos uma. O conhecido-positivo da F2 e da F3 falhou.',
  );
}
const dominios = slugsDosDominios();
if (dominios.length > 0) {
  /* A leitura breve de cada medida declarada tem de estar na página, nas duas
     edições: é a segunda conta da mesma coisa, feita da declaração e não do
     HTML. */
  const medidasDeclaradas = dominios.reduce((n, slug) => n + medidasDoDominio(slug).filter((m) => m.porConcelho).length, 0);
  const esperadasMedidas = medidasDeclaradas * LANGS.length;
  if (contas.medidas_com_leitura !== esperadasMedidas) {
    err(
      `as ${medidasDeclaradas} medida(s) declarada(s) nas ${LANGS.length} edições dão ` +
        `${esperadasMedidas} leituras breves, e a varredura contou ${contas.medidas_com_leitura}.`,
    );
  }
}

/* F7 · as 308 páginas de concelho, com o controlo positivo ao lado.
   O TOTAL VEM DE `MUNICIPIOS_COM_PAGINA.length`, E NUNCA DA PRÓPRIA CONTAGEM
   DESCOBERTA (leitura a frio, Major 6): comparar uma edição com a outra só
   apanha uma DIFERENÇA entre elas, e não as duas a faltarem a mesma página. O
   conhecido-positivo é o mesmo: sem uma lista declarada de municípios, este
   zero também não provava nada. */
const totalDeConcelhos = MUNICIPIOS_COM_PAGINA.length;
if (totalDeConcelhos === 0) {
  err('src/data/municipios.mjs não declara um único município. O conhecido-positivo da F7 falhou.');
}
if (totalDeConcelhos > 0) {
  for (const lang of LANGS) {
    if (contas.concelhos[lang] !== totalDeConcelhos) {
      err(
        `a edição "${lang}" tem ${contas.concelhos[lang]} páginas de concelho e ` +
          `src/data/municipios.mjs declara ${totalDeConcelhos}. As 308 páginas de cada edição ` +
          `vêm da mesma lista.`,
      );
    }
    if (contas.concelhos_com_populacao[lang] !== contas.concelhos[lang]) {
      err(
        `o CONTROLO POSITIVO falhou na edição "${lang}": «${ROTULO_POPULACAO[lang]}» aparece em ` +
          `${contas.concelhos_com_populacao[lang]} de ${contas.concelhos[lang]} páginas de concelho. ` +
          `Sem ele, a contagem do ganho médio não prova nada.`,
      );
      continue;
    }
    if (contas.concelhos_com_ganho[lang] !== contas.concelhos[lang]) {
      err(
        `«${ROTULO_GANHO[lang]}» aparece em ${contas.concelhos_com_ganho[lang]} de ` +
          `${contas.concelhos[lang]} páginas de concelho na edição "${lang}". A medida é dos 308.`,
      );
    }
  }
}

/* ---------------------------------------------------------------------------
 * F14 · a série declarada bate certo com a origem que ela nomeia
 * ---------------------------------------------------------------------------
 * O período que o sítio imprime vem de `src/data/frescura.mjs`; este bloco abre
 * o ficheiro que a série nomeia como origem, tira de lá o período por conta
 * própria, e compara. O que se lê do inventário das fontes não é prosa: é o que
 * a folha da fonte imprime no seu próprio campo, «Ano Mês: 202607», copiado para
 * o campo `ultimo_periodo` daquele registo. Um período que ali mude e aqui não
 * fecha a construção, que é o dia em que a casa se atrasa mais um mês sem dar
 * por isso.
 */
for (const serie of SERIES_ATRASADAS) {
  const caminho = path.join(RAIZ, serie.origem.ficheiro);
  if (!fs.existsSync(caminho)) {
    err(
      `a série "${serie.id}" nomeia a origem ${serie.origem.ficheiro}, que não existe. ` +
        `Um período sem origem legível é um número escrito à mão.`,
    );
    continue;
  }
  let registo = null;
  try {
    const cru = JSON.parse(fs.readFileSync(caminho, 'utf8'));
    const linhasDoInventario = Array.isArray(cru?.primeira_vaga) ? cru.primeira_vaga : [];
    registo = linhasDoInventario.find((x) => x?.id === serie.origem.registo) ?? null;
  } catch (e) {
    err(`a série "${serie.id}": ${serie.origem.ficheiro} não se lê (${String(e)}).`);
    continue;
  }
  if (!registo) {
    err(
      `a série "${serie.id}" nomeia o registo "${serie.origem.registo}" de ` +
        `${serie.origem.ficheiro}, que lá não está.`,
    );
    continue;
  }
  const campo = registo[serie.origem.campo];
  if (typeof campo !== 'string') {
    err(
      `a série "${serie.id}" nomeia o campo "${serie.origem.campo}" do registo ` +
        `"${serie.origem.registo}", e ele não é texto.`,
    );
    continue;
  }
  /* O que a folha da fonte imprime, e não a prosa à volta: «Ano Mês: 202607». */
  const m = /Ano\s*M[êe]s:\s*(\d{4})(\d{2})/.exec(campo);
  if (!m) {
    err(
      `a série "${serie.id}": o campo "${serie.origem.campo}" do registo ` +
        `"${serie.origem.registo}" já não traz o período tal como a folha da fonte o imprime ` +
        `(«Ano Mês: AAAAMM»). Sem ele não há segunda conta, e uma cópia sem conferência é um ` +
        `número escrito à mão.`,
    );
    continue;
  }
  const lido = `${m[1]}-${m[2]}`;
  if (lido !== serie.periodoDaFonte) {
    err(
      `a série "${serie.id}": o período declarado e o da origem não batem certo.\n` +
        `      src/data/frescura.mjs:        ${serie.periodoDaFonte}\n` +
        `      ${serie.origem.ficheiro} (${serie.origem.registo}.${serie.origem.campo}): ${lido}`,
    );
  }
}

/* F15 · a frase do atraso em todas as páginas das linhas atrasadas, nas duas
   edições. O total lê-se do livro-razão e não da varredura, pela razão de F7. */
if (contas.paginas > 0) {
  for (const lang of LANGS) {
    if (contas.paginas_com_atraso[lang] !== idsAtrasados.size) {
      err(
        `a edição "${lang}" tem ${contas.paginas_com_atraso[lang]} página(s) de linha com a ` +
          `frase do atraso e o livro-razão tem ${idsAtrasados.size} linha(s) em séries ` +
          `atrasadas. Uma linha atrasada sem a frase é um valor velho com um selo fresco ao lado.`,
      );
    }
  }
}

/* F17 · a conta: tantas frases certas quantos cartões de concelho numa série
   atrasada, em cada edição, e mais do que zero (o conhecido-positivo: a série
   do IEFP está atrasada, e as páginas dos concelhos do continente rendem-na). */
if (contas.paginas > 0) {
  for (const lang of LANGS) {
    if (contas.frescura_esperada[lang] === 0 || contas.frescura_nos_cartoes[lang] !== contas.frescura_esperada[lang]) {
      err(
        `F17 · a edição "${lang}" tem ${contas.frescura_esperada[lang]} cartão(ões) de concelho numa ` +
          `série atrasada e ${contas.frescura_nos_cartoes[lang]} com a frase da frescura certa.`,
      );
    }
  }
}

/* ---------------------------------------------------------------------------
 * F16 · as duas contagens por extenso, lidas da PÁGINA e não da declaração
 * ---------------------------------------------------------------------------
 * A régua dos algarismos não vê palavras, e é isso que faz esta classe escapar
 * inteira (`DECISIONS.md` §4, «As contagens em palavras da página do
 * município»).
 *
 * A PRIMEIRA REDAÇÃO DESTA RÉGUA NÃO PODIA APANHAR UM DENOMINADOR FALSO, e a
 * leitura a frio do Codex mediu-o (Major 10, 04.09.2026): ela comparava a frase
 * com o campo `palavra` da declaração, que era **o mesmo campo com que a frase
 * tinha sido construída**. Mudar os dois ao mesmo tempo passava. Duas coisas
 * mudaram: a declaração deixou de ter `palavra` e passou a ter só `numero`, e
 * esta régua deixou de ler a declaração da frase e passa a ler o `dist/`.
 *
 * O QUE ELA FAZ AGORA, e são duas contas independentes contra o texto rendido:
 *
 *   · o NUMERADOR sai de `FIGURAS_SOCIAL.length`, que é a lista das medidas do
 *     painel, passada por `numeralPorExtenso()`;
 *   · a palavra tem de estar na frase que a página europeia rende, nas duas
 *     edições, e a frase encontra-se pelo nome do painel e não por uma classe de
 *     CSS, que outro bloco pode mudar sem saber que esta régua a lê.
 *
 * O DENOMINADOR SAIU DA FRASE A 14.09.2026, e saiu daqui com ela (achado 2 da
 * leitura cruzada do inventário): a casa não tem uma página da Comissão nem do
 * Eurostat que escreva o número das medidas principais, e a decisão (5) da §1.98
 * só a deixa dizê-lo quando a tiver. A razão inteira, com as três páginas lidas
 * e o que cada uma diz, está em `src/data/figuras.mjs`, no lugar onde a
 * declaração esteve. Fica UMA conta, e continua a ser uma conta contra o texto
 * rendido: o dia em que uma medida entrar ou sair do painel sem a frase mudar,
 * esta régua fecha a construção.
 *
 * O QUE ISTO APANHA que a primeira redação não apanhava: uma medida a entrar ou
 * a sair do painel sem a frase mudar; o número da Comissão a mudar sem a frase
 * mudar; e a frase a ser reescrita à mão com outra palavra, que é o caso que o
 * leitor plantou no papel.
 */
const NOME_DO_PAINEL_SOCIAL = {
  pt: 'Painel Social Europeu',
  en: 'European Social Scoreboard',
};

/* A PÁGINA QUE RENDE A FRASE MUDOU (bloco F1.10, item 8.16, 08.09.2026). Era a
   primeira página; os 21 cartões dos dois quadros da União passaram a «Portugal
   na União Europeia», e a frase de contexto do Painel Social foi com eles. O
   que a conferência mede não muda um carácter: muda o ficheiro que ela abre. */
for (const lang of LANGS) {
  const rota = routePath('uniaoEuropeia', lang);
  const ficheiro = path.join(DIST, rota.replace(/^\//, ''), 'index.html');
  if (!fs.existsSync(ficheiro)) {
    err(
      `a página «Portugal na União Europeia» da edição "${lang}" não foi construída, e é ela ` +
        `que rende a frase do Painel Social.`,
    );
    continue;
  }
  const corpo = texto(parse(fs.readFileSync(ficheiro, 'utf8')).querySelector('body') ?? parse(''));
  const nome = NOME_DO_PAINEL_SOCIAL[lang];
  if (!corpo.includes(nome)) {
    err(
      `a página «Portugal na União Europeia» da edição "${lang}" não nomeia «${nome}». Sem o ` +
        `nome do painel não há frase para conferir, e um zero aqui seria a régua a passar por ` +
        `estar cega.`,
    );
    continue;
  }
  /* O NOME DO PAINEL APARECE MAIS DO QUE UMA VEZ na primeira página: é o
     cabeçalho do painel e é a frase de contexto, e a primeira ocorrência é o
     cabeçalho. Por isso percorrem-se TODAS, e o que se exige é que uma delas
     traga as duas palavras no que vem antes. Ler só a primeira era a régua a
     medir o sítio errado, e foi o que a primeira corrida desta conferência fez.
     A janela de 120 caracteres é a distância do numeral ao nome na frase que a
     página rende («Oito das medidas principais do Painel Social Europeu»), com
     folga. */
  const numerador = numeralPorExtenso(FIGURAS_SOCIAL.length, lang, true);
  const janelas = [];
  for (let i = corpo.indexOf(nome); i !== -1; i = corpo.indexOf(nome, i + 1)) {
    janelas.push(corpo.slice(Math.max(0, i - 120), i + nome.length));
  }
  const comNumerador = janelas.filter((j) => j.includes(numerador));
  if (comNumerador.length === 0) {
    const perto = janelas[janelas.length - 1] ?? '';
    err(
      `a frase do Painel Social na edição "${lang}" não traz a contagem por extenso.\n` +
        `      medidas rendidas: ${FIGURAS_SOCIAL.length}, por extenso «${numerador}» ` +
        `(NÃO está na página)\n` +
        `      ${janelas.length} ocorrência(s) de «${nome}»; a mais próxima diz «…${perto}»`,
    );
    continue;
  }
  contas.contagens_por_extenso++;
}

/* ---------------------------------------------------------------------------
 * F5 · a segunda metade: as três datas no recibo de cada linha com leitura breve
 * ---------------------------------------------------------------------------
 * A carta dos conteúdos, §1, regra 3, desde 16.09.2026: «Três datas por medida,
 * sempre, no recibo da linha». O que aqui se exige é isso e nada menos: para
 * cada linha que uma leitura breve cita, o recibo dela tem de render as três
 * datas, nas DUAS edições. Uma edição sozinha não chega, pela mesma razão de
 * F7 e F15: as duas podiam faltar à mesma linha e continuar a bater uma com a
 * outra.
 *
 * O CONTROLO POSITIVO ESTÁ NO CONJUNTO, e é o que impede esta conferência de
 * passar por estar cega: se a varredura não achar leitura breve nenhuma, a
 * régua fecha a construção. Um zero aqui só tem duas explicações e uma é má.
 */
if (contas.paginas > 0) {
  if (linhasComLeituraBreve.size === 0) {
    err(
      `o conjunto das linhas com leitura breve está vazio, e as medidas declaradas existem ` +
        `(a primeira página e a página do domínio rendem-nas). Sem conjunto, a F5 media zero ` +
        `recibos e passava por estar cega.`,
    );
  }
  /* E O CONJUNTO TEM DE SE VER NA PÁGINA: se nenhuma leitura breve for rendida,
     a declaração diz uma coisa e o sítio faz outra, e a conferência mede a
     declaração contra ela própria. */
  if (contas.medidas_com_leitura === 0) {
    err(
      `nenhuma página construída rende uma leitura breve («[data-medida]»), e a declaração tem ` +
        `${linhasDeclaradasComLeitura.size} linha(s) com leitura. Ou as leituras saíram do sítio, ou a ` +
        `varredura deixou de as ver.`,
    );
  }
  /* O CONTROLO NO OUTRO SENTIDO: uma medida DECLARADA com leitura que não se
     renda em página nenhuma. Os alvos vêm do `dist/`, e por isso uma leitura que
     desaparecesse levava o seu recibo com ela e a célula ficava verde a medir
     menos. Esta é a rede que o impede, e a única coisa para que a declaração
     serve aqui. */
  for (const id of [...linhasDeclaradasComLeitura].sort()) {
    if (!linhasComLeituraBreve.has(id)) {
      err(
        `a medida da linha "${id}" está declarada com leitura breve e nenhuma página construída a ` +
          `rende com «data-leitura» nem com «data-leitura-linha». Ou a leitura saiu do sítio sem a declaração o dizer, ou a marca ` +
          `mudou de nome e o conjunto dos alvos ficou mais pequeno em silêncio.`,
      );
    }
  }
  for (const id of linhasIrmasDeclaradas) linhasComLeituraBreve.add(id);
  for (const id of [...linhasComLeituraBreve].sort()) {
    /* AS DERIVADAS NÃO TÊM DATAS PRÓPRIAS, e a razão está na recolha acima. */
    const linha = getClaim(id);
    if (linha && Array.isArray(linha.derived_from) && linha.derived_from.length > 0) {
      contas.recibos_derivados++;
      continue;
    }
    const porEdicao = datasDoRecibo.get(id);
    if (!porEdicao) {
      err(
        `a linha "${id}" é citada por uma leitura breve e não tem página de recibo construída. ` +
          `As três datas de uma medida vivem no recibo, e sem recibo não vivem em lado nenhum.`,
      );
      continue;
    }
    for (const lang of LANGS) {
      const campos = porEdicao[lang];
      if (!campos) {
        err(`o recibo da linha "${id}" não foi construído na edição "${lang}".`);
        continue;
      }
      const faltam = ['periodo', 'leitura', 'verificacao'].filter((c) => !campos.campos.has(c));
      if (faltam.length > 0) {
        err(
          `o recibo da linha "${id}", na edição "${lang}", tem ${campos.campos.size} das três datas e ` +
            `falta(m) ${faltam.join(' · ')} (a carta dos conteúdos, §1, regra 3: o período de ` +
            `referência, a data de leitura ou de publicação, e a data da última verificação).`,
        );
        continue;
      }
      /* E A TERCEIRA DATA TEM DE SER A ÚLTIMA. `ultimaConferencia()` é quem
         escolhe qual é, pela DATA e não pela ordem do ficheiro, e é a mesma
         função que a dobra usava: uma segunda cópia da escolha aqui divergiria
         na primeira correção. */
      const ultima = linha ? ultimaConferencia(linha) : null;
      if (ultima && !campos.verificacoes.has(ultima.campo)) {
        err(
          `o recibo da linha "${id}", na edição "${lang}", mostra ` +
            `${[...campos.verificacoes].sort().join(' · ') || 'nenhuma verificação'} e a mais recente ` +
            `é ${ultima.campo} (${ultima.valor}). «A data da última verificação» é a da entrada mais ` +
            `recente de \`verifications\`, e um recibo que guarde só uma antiga promete uma frescura ` +
            `que a linha não tem.`,
        );
        continue;
      }
      contas.recibos_com_tres_datas++;
    }
  }
}

/* F6 · as linhas de cada medida de concelho são alcançáveis pela porta do mapa. */
if (dominios.length > 0 && contas.formas > 0) {
  const porta = routePath('livroConcelhos', 'pt');
  const ficheiro = path.join(DIST, porta.replace(/^\//, ''), 'index.html');
  if (!fs.existsSync(ficheiro)) {
    err(
      `a porta dos valores por concelho (${porta}) não foi construída, e é ela a alternativa em ` +
        `texto do mapa dos 308.`,
    );
  }
}

/* F19 · o conhecido-positivo: cada série de países tem a sua faixa nas duas
   páginas dos temas, e as plantas correram. Zero faixas com séries no livro é
   um detetor que não viu nada. */
if (SERIES_DE_PAISES.size && contas.faixas_nos_temas !== 2 * SERIES_DE_PAISES.size) {
  err(`F19: as páginas dos temas rendem ${contas.faixas_nos_temas} faixa(s) da União e há ${SERIES_DE_PAISES.size} série(s) de países; esperavam-se ${2 * SERIES_DE_PAISES.size}, uma por série e por edição.`);
}
if (SERIES_DE_PAISES.size && contas.plantas_das_faixas === 0) {
  err('F19: nenhuma planta da faixa correu: a célula não provou que morde.');
}

/* F20 · o conhecido-positivo: a secção dos países nas duas edições da página da União, com uma faixa por série de
   países em cada uma, e as plantas a correr; e a planta da tabela, uma vez por corrida e sem página. */
if (SERIES_DE_PAISES.size) {
  if (contas.seccoes_dos_paises !== 2 || contas.faixas_dos_paises !== 2 * SERIES_DE_PAISES.size) {
    err(`F20: a página da União rende ${contas.seccoes_dos_paises} secção(ões) dos países com ${contas.faixas_dos_paises} faixa(s), e há ${SERIES_DE_PAISES.size} série(s) de países; esperavam-se 2 secções e ${2 * SERIES_DE_PAISES.size} faixas, uma por série e por edição.`);
  }
  if (contas.plantas_dos_paises === 0) err('F20: nenhuma planta da secção dos países correu: a célula não provou que morde.');
  /* UE2-b: cada faixa das duas edições diz o que a medida conta, e a conta esperada sai das séries. */
  if (contas.definicoes_dos_paises !== 2 * SERIES_DE_PAISES.size) {
    err(`F20g: ${contas.definicoes_dos_paises} faixa(s) dos países dizem a definição declarada da medida, e são ${2 * SERIES_DE_PAISES.size}, uma por série e por edição.`);
  }
  const tabela = plantaDaTabela(SERIES_DE_PAISES);
  contas.plantas_dos_paises++;
  if (!tabela.passou) err(`F20: a planta «${tabela.nome}» não mordeu (${tabela.porque}).`);
}

/* F19g · F19h (UE1b, 29.09.2026): as palavras da faixa, uma vez por corrida e
   sem página (o ordinal inglês contra a tabela escrita dos 27, e as palavras de
   cada marca que um ponto leva), com as suas plantas. E o conhecido-positivo das
   ressalvas: cada ponta cujo ponto leva marca mostra-a nas duas páginas dos
   temas, e o número esperado sai das séries e não de uma contagem à mão. */
if (SERIES_DE_PAISES.size) {
  const palavrasDaFaixa = conferirPalavrasDaFaixa(SERIES_DE_PAISES);
  for (const e of palavrasDaFaixa.erros) err(`src/data/faixa-da-uniao.mjs: ${e}`);
  contas.ordinais_conferidos = palavrasDaFaixa.contas.ordinais;
  contas.marcas_com_palavras = palavrasDaFaixa.contas.marcas;
  if (!palavrasDaFaixa.erros.length) {
    for (const planta of plantasDasPalavrasDaFaixa(SERIES_DE_PAISES)) {
      contas.plantas_das_palavras++;
      if (!planta.passou) err(`F19: a planta «${planta.nome}» não mordeu (${planta.porque}).`);
    }
  }
  /* UE1c (o achado 5): os empates num extremo, feitos em memória, com a marca só
     num dos países empatados; cada planta tem de morder e o seu controlo passar. */
  for (const lingua of ['pt', 'en']) {
    for (const planta of plantasDosEmpates(SERIES_DE_PAISES, PAISES_DO_PORTAO, lingua)) {
      contas.plantas_dos_empates++;
      if (!planta.passou) err(`F19: a planta «${planta.nome}» (${lingua}) não mordeu (${planta.porque}).`);
    }
  }
  let pontasComMarca = 0;
  for (const serie of SERIES_DE_PAISES.values()) {
    try {
      const c = contaDaFaixa(serie);
      for (const geo of [c.baixo[0], c.alto[0]]) if (serie.pontos.find((p) => p.geo === geo)?.bandeira) pontasComMarca++;
    } catch {
      /* a série que não se reconta já fechou a F19 acima */
    }
  }
  if (contas.ressalvas_nos_temas !== 2 * pontasComMarca) {
    err(`F19: as páginas dos temas mostram ${contas.ressalvas_nos_temas} ressalva(s) nas pontas e as séries têm ${pontasComMarca} ponta(s) com marca; esperavam-se ${2 * pontasComMarca}, uma por ponta e por edição.`);
  }
}

/* ========================================================================== */

for (const serie of SERIES_DO_PORTAO.values()) if (serie.eixo === 'periodo') for (const lang of LANGS) {
  if (!recibosRP4.has(`${lang}:${serie.id}`)) err(`F21 · falta o gráfico do recibo de ${serie.id} (${lang})`);
}
/* As plantas da regra da página (RP4-m), uma vez, sobre os dois controlos íntegros que a corrida viu. Com uma figura
   declarada e nenhum desenho dela visto, a corrida fecha: as plantas não correriam sobre nada. */
if (Object.keys(FIGURAS_INDEXADAS).length) {
  if (!controlosDaRegra.figura || !controlosDaRegra.comum) err('F21 · a regra da página não viu a figura indexada declarada e um recibo comum, e as suas plantas não correram');
  else for (const p of plantasDaRegraDaPagina(controlosDaRegra.figura.svg, controlosDaRegra.figura.slug, controlosDaRegra.comum.svg, controlosDaRegra.comum.slug)) {
    plantasRP4.push({ lang: 'pt', regra: 'página', ...p });
    if (!p.mordeu) err(`F21 · planta da regra da página «${p.nome}» não mordeu: ${p.queixa}`);
  }
}
if (!desenhosRP4 || plantasRP4.length === 0) err('F21 · não viu desenhos ou plantas');
/* RP4-c: as plantas da leitura, da legenda e da F2 correram nas duas edições, ou a corrida fecha. */
for (const lang of LANGS) {
  if (!plantasDaLeituraRP4C.some((p) => p.lang === lang && p.de === 'leitura')) err(`F21 · as plantas da leitura de cada ponto não correram na edição ${lang}: nenhum desenho com zonas`);
  if (!plantasDaLeituraRP4C.some((p) => p.lang === lang && p.de === 'legenda')) err(`F21 · as plantas da legenda da unidade não correram na edição ${lang}: nenhum desenho com ela`);
  if (!plantasF2.some((p) => p.lang === lang)) err(`F2 · as plantas dos pontos no desenho não correram na edição ${lang}`);
}
if (!contas.algarismos_de_pontos_nos_desenhos) err('F2 · nenhum valor nem período de um ponto num desenho das séries: o conhecido-positivo da leitura de cada ponto falhou.');
console.log(`F21 · ${desenhosRP4} desenhos recompostos · ${provasRP4.length} provas do módulo · ${plantasRP4.filter((p) => p.mordeu).length} de ${plantasRP4.length} plantas em memória · RP4-c: ${plantasDaLeituraRP4C.filter((p) => p.mordeu).length} de ${plantasDaLeituraRP4C.length} plantas da leitura e da legenda`);
console.log(`F2 · RP4-c: ${contas.algarismos_de_pontos_nos_desenhos} valores e períodos de pontos nos desenhos, cada um comparado com o seu ponto · ${plantasF2.filter((p) => p.mordeu).length} de ${plantasF2.length} plantas em memória`);
const jsonRP4 = process.argv.indexOf('--json-rp4');
if (jsonRP4 !== -1) fs.writeFileSync(process.argv[jsonRP4 + 1], JSON.stringify({ desenhos: desenhosRP4, recibos: [...recibosRP4], provas: provasRP4, plantas: plantasRP4, plantas_da_leitura: plantasDaLeituraRP4C, plantas_da_f2: plantasF2, algarismos_de_pontos_nos_desenhos: contas.algarismos_de_pontos_nos_desenhos, erros }, null, 2) + '\n');

if (erros.length > 0) {
  console.error(vermelho(`\n  PORTÃO DAS FORMAS · ${erros.length} problema(s):\n`));
  for (const e of erros) console.error(`  · ${e}`);
  console.error('');
  process.exit(1);
}

const porNome = Object.entries(contas.formas_por_nome)
  .map(([k, v]) => `${k} ${v}`)
  .join(' · ');
console.log(
  verde('  formas ✓') +
    cinza(
      ` ${contas.paginas_dos_lugares} páginas dos lugares · ${contas.formas} desenhos (${porNome || 'nenhum'})` +
        ` · ${contas.datas_de_linha} datas de linha conferidas · ${contas.medidas_com_leitura} leituras breves` +
        ` · ${contas.recibos_com_tres_datas} recibo(s) com as três datas e a última verificação à vista` +
        ` (de ${linhasComLeituraBreve.size} linha(s) com leitura breve rendida, ${contas.recibos_derivados} derivada(s) sem datas próprias)` +
        ` · ${contas.ausencias} ausências · ganho médio em ${contas.concelhos_com_ganho.pt}/${contas.concelhos.pt} concelhos` +
        ` (controlo: população em ${contas.concelhos_com_populacao.pt})` +
        ` · atraso: ${SERIES_ATRASADAS.length} série(s), ${idsAtrasados.size} linha(s),` +
        ` ${contas.periodos_da_fonte} período(s) da fonte conferido(s)` +
        ` · frescura nos cartões de concelho: ${contas.frescura_nos_cartoes.pt} pt e ${contas.frescura_nos_cartoes.en} en, de ${contas.frescura_esperada.pt} e ${contas.frescura_esperada.en} cartões numa série atrasada (F17)` +
        ` · ${contas.contagens_por_extenso} frase(s) com contagem por extenso conferida(s)` +
        ` · calendário: ${contas.calendarios_dos_mandatos} páginas, ${contas.pontos_no_calendario} pontos e ${contas.plantas_do_calendario} plantas` +
        ` · faixa da União (F19): ${contas.faixas} faixa(s), ${contas.faixas_nos_temas} nos assuntos, ${contas.marcas_das_faixas} marcas refeitas do valor, ` +
        `${contas.frases_das_faixas} frases recompostas (${contas.empates_nas_faixas} com empate), ${contas.plantas_das_faixas} plantas a morder, ` +
        `${contas.ressalvas_nas_pontas} ressalva(s) nas pontas (${contas.ressalvas_nos_temas} nos assuntos), ${contas.ordinais_conferidos} ordinais e ` +
        `${contas.marcas_com_palavras} marca(s) por edição com palavras (F19g, F19h), ${contas.plantas_das_palavras} plantas das palavras a morder, ` +
        `${contas.plantas_dos_empates} plantas dos empates a morder` +
        ` · secção dos países (F20): ${contas.seccoes_dos_paises} secção(ões), ${contas.faixas_dos_paises} faixa(s), ${contas.definicoes_dos_paises} definição(ões) declarada(s), ${contas.marcas_dos_paises} marcas refeitas do valor, ` +
        `${contas.etiquetas_do_toque} etiquetas do toque, ${contas.listas_dos_paises} listas com ${contas.itens_das_listas} itens, ` +
        `${contas.ressalvas_da_uniao_nos_paises} ressalva(s) da Comissão, ${contas.plantas_dos_paises} plantas a morder` +
        ` · ${contas.datas_de_serie} data(s) de série`,
    ),
);
