/**
 * A FAIXA DO CONCELHO · o resolvedor (bloco L2b, 01.10.2026).
 *
 * `faixaDoConcelho(chave, slug, lang)` devolve o que a faixa de um cartão de concelho rende: o lugar do
 * concelho entre os concelhos com valor, a contagem deles, os empates, as marcas do desenho com a posição
 * de cada uma, e a comparação com Portugal. É a faixa da União (`src/lib/faixa-da-uniao.mjs`) aplicada aos
 * 308: lá o lugar de Portugal conta-se na vista a partir dos 28 pontos da série, aqui o lugar do concelho
 * conta-se na vista a partir das 308 linhas da medida, e as linhas são o recibo (o brief L2b, §5, decisão 1).
 * Nenhuma linha nova no livro-razão.
 *
 * SÓ AS TAXAS E OS RÁCIOS TÊM FAIXA (a passagem L2b-b, 01.10.2026, pela §1.143, decisão 4): uma medida que a
 * tabela declara sem faixa (as quatro contagens) devolve `null`, e o cartão fica como estava antes do L2b.
 *
 * AS REGRAS DA CONTA, as mesmas que os portões recontam por conta própria em `scripts/concelhos-do-portao.mjs`
 * (e não importam daqui):
 *   · as linhas da medida são as que `linhasPorConcelho()` dá para a chave, uma por concelho;
 *   · um concelho tem valor quando a sua linha é um número da casa (`parsePtNumber`); uma marca da fonte
 *     («N.d.») não tem valor e não tem lugar;
 *   · a contagem é o número de concelhos com valor;
 *   · na ordem «do-mais-alto», o lugar é 1 mais o número de concelhos com valor maior; na ordem
 *     «do-mais-baixo», 1 mais o número de concelhos com valor menor (a tabela das ordens, com a razão de
 *     cada uma, está em `src/data/faixa-do-concelho.mjs`, e não aqui);
 *   · os concelhos com o mesmo valor ficam no mesmo lugar, e a faixa diz quantos são os outros;
 *   · a posição de uma marca é (valor − mínimo) ÷ (máximo − mínimo), em percentagem com quatro casas;
 *   · a comparação com Portugal é a linha nacional declarada só se tiver a unidade e o período da linha do
 *     concelho, ou a base do índice lida da unidade da linha do concelho; sem uma nem outra, não há.
 */

import { getClaim, parsePtNumber, eValorTextual } from './ledger.mjs';
import { linhasPorConcelho } from './dominios.mjs';
import { baseDoIndice } from '../data/carta-dos-lugares.mjs';
import { FAIXA_DAS_MEDIDAS_DO_CONCELHO } from '../data/faixa-do-concelho.mjs';

/**
 * @param {number} v @param {number} min @param {number} max
 */
function posicao(v, min, max) {
  if (!(max > min)) throw new Error('faixa do concelho: o mais alto e o mais baixo são o mesmo valor, e a faixa não tem largura');
  return Number((Math.min(1, Math.max(0, (v - min) / (max - min))) * 100).toFixed(4));
}

/** Como se ancora um rótulo: pela ponta mais perto, quando está junto a uma. @param {number} p */
function ancora(p) {
  return p < 15 ? 'inicio' : p > 85 ? 'fim' : 'meio';
}

/**
 * O período de uma linha: o seu `reference_date`, ou, numa linha calculada que não o repete, o período
 * comum das linhas de que é calculada (o índice de dívida de Évora). É a regra de `periodoDasCamaras()`
 * (`src/lib/prova.mjs`), escrita para uma linha só.
 *
 * @param {string} id
 * @param {Set<string>} [vistos]
 * @returns {string|null}
 */
export function periodoDaLinha(id, vistos = new Set()) {
  if (vistos.has(id)) return null;
  const linha = getClaim(id);
  if (typeof linha.reference_date === 'string' && linha.reference_date) return linha.reference_date;
  const origens = Array.isArray(linha.derived_from) ? linha.derived_from : [];
  const periodos = [...new Set(origens.map((o) => periodoDaLinha(String(o), new Set([...vistos, id]))).filter(Boolean))];
  return periodos.length === 1 ? periodos[0] : null;
}

/**
 * A linha nacional com que a linha de um concelho se compara, quando a tabela a declara e ela tem a
 * unidade e o período da linha do concelho. É também o que o recibo da linha do concelho lista em «O
 * enquadramento», para que a marca única do cartão pague o valor de Portugal que a faixa mostra (a K10).
 *
 * @param {string} chave
 * @param {string} idDoConcelho
 * @returns {{ id: string, periodo: string } | null}
 */
export function linhaDePortugal(chave, idDoConcelho) {
  const comparacao = FAIXA_DAS_MEDIDAS_DO_CONCELHO[chave]?.comparacao ?? null;
  if (!comparacao || !('linha' in comparacao)) return null;
  const nacional = getClaim(comparacao.linha);
  const doConcelho = getClaim(idDoConcelho);
  const periodo = periodoDaLinha(comparacao.linha);
  if (nacional.unit !== doConcelho.unit || !periodo || periodo !== periodoDaLinha(idDoConcelho)) return null;
  return { id: comparacao.linha, periodo };
}

/**
 * A CONTA DE UMA MEDIDA, feita uma vez por construção e não uma vez por cartão: as 308 linhas, os
 * concelhos com valor, o período comum, o mínimo e o máximo. São as mesmas para os 308 cartões da
 * medida, e o recibo de cada linha pergunta por elas também.
 *
 * @type {Map<string, { linhas: Map<string, string>, comValor: { slug: string, id: string, n: number }[], periodo: string, min: number, max: number, ids: Set<string> }>}
 */
const CONTAS = new Map();

/** @param {string} chave */
function contaDaMedida(chave) {
  const feita = CONTAS.get(chave);
  if (feita) return feita;
  const linhas = linhasPorConcelho(chave);
  const comValor = [];
  for (const [s, id] of linhas) {
    const linha = getClaim(id);
    if (eValorTextual(linha.value)) continue;
    const n = parsePtNumber(linha.value);
    if (n === null) throw new Error(`faixa do concelho: o valor de «${id}» não é um número da casa nem uma marca da fonte`);
    comValor.push({ slug: s, id, n });
  }
  /* O lugar entre os 308 só se conta entre linhas do mesmo período. */
  const periodos = new Set([...linhas.values()].map((id) => periodoDaLinha(id)));
  if (periodos.size !== 1 || periodos.has(null)) {
    throw new Error(`faixa do concelho: as linhas de «${chave}» não partilham um período (${[...periodos].join(', ')})`);
  }
  const conta = {
    linhas,
    comValor,
    periodo: /** @type {string} */ ([...periodos][0]),
    min: Math.min(...comValor.map((c) => c.n)),
    max: Math.max(...comValor.map((c) => c.n)),
    ids: new Set(linhas.values()),
  };
  CONTAS.set(chave, conta);
  return conta;
}

/**
 * A linha nacional de uma linha de concelho qualquer, procurada pelas chaves que a declaram: é o que o
 * recibo (`LinhaView.astro`) pergunta, sem saber de que medida a linha é.
 *
 * @param {string} id
 * @returns {{ id: string, periodo: string } | null}
 */
export function linhaDePortugalDaLinha(id) {
  for (const chave of Object.keys(FAIXA_DAS_MEDIDAS_DO_CONCELHO)) {
    const comparacao = FAIXA_DAS_MEDIDAS_DO_CONCELHO[chave].comparacao;
    if (!comparacao || !('linha' in comparacao)) continue;
    if (!contaDaMedida(chave).ids.has(id)) continue;
    return linhaDePortugal(chave, id);
  }
  return null;
}

/**
 * @param {string} chave  a chave da medida (`MEDIDAS_DO_CONCELHO`)
 * @param {string} slug   o concelho da página
 * @param {string} idDoConcelho  a linha que o cartão rende
 */
export function faixaDoConcelho(chave, slug, idDoConcelho) {
  const declaracao = FAIXA_DAS_MEDIDAS_DO_CONCELHO[chave];
  if (!declaracao?.faixa || !declaracao.ordem) return null;
  const { linhas, comValor, periodo, min, max } = contaDaMedida(chave);
  if (linhas.get(slug) !== idDoConcelho) {
    throw new Error(
      `faixa do concelho: o cartão «${chave}» de «${slug}» rende «${idDoConcelho}», e as 308 linhas da medida dão ` +
        `«${linhas.get(slug) ?? 'nenhuma'}» a esse concelho. A linha do cartão e a da contagem têm de ser a mesma.`,
    );
  }
  const este = comValor.find((c) => c.slug === slug) ?? null;
  const ordem = declaracao.ordem;
  const lugar = este
    ? 1 + comValor.filter((c) => (ordem === 'do-mais-baixo' ? c.n < este.n : c.n > este.n)).length
    : null;
  const aPar = este ? comValor.filter((c) => c.slug !== slug && c.n === este.n).length : 0;

  /* A comparação com Portugal: a linha nacional da mesma medida e do mesmo período, ou a base do índice. */
  /** @type {{ tipo: 'linha', id: string, n: number } | { tipo: 'base', n: number, base: string } | null} */
  let portugal = null;
  const comparacao = declaracao.comparacao;
  if (comparacao && 'linha' in comparacao) {
    const nacional = linhaDePortugal(chave, idDoConcelho);
    const n = nacional ? parsePtNumber(getClaim(nacional.id).value) : null;
    if (nacional && n !== null) portugal = { tipo: 'linha', id: nacional.id, n };
  } else if (comparacao && 'base' in comparacao) {
    const base = baseDoIndice(getClaim(idDoConcelho));
    const n = base === null ? null : parsePtNumber(base);
    /* R2 (03.10.2026, achado 22): a base escrita como a unidade da linha a escreve, para a frase da comparação. */
    if (n !== null && base !== null) portugal = { tipo: 'base', n, base: String(base) };
  }
  const lado = este && portugal ? (este.n > portugal.n ? 'acima' : este.n < portugal.n ? 'abaixo' : 'igual') : null;
  const esquerdaDoConcelho = este ? posicao(este.n, min, max) : null;
  const esquerdaDePortugal = portugal ? posicao(portugal.n, min, max) : null;

  return {
    chave,
    slug,
    claim: idDoConcelho,
    periodo,
    ordem,
    /* R2 (03.10.2026, achados 21 e 22): as palavras da medida na frase do lugar e o que é o valor de Portugal na
       comparação, declarados na tabela das ordens. */
    naFrase: declaracao.naFrase ?? null,
    ondePortugal: declaracao.ondePortugal ?? null,
    conta: comValor.length,
    lugar,
    aPar,
    /* As marcas dos concelhos com valor, do valor mais baixo ao mais alto: o desenho escreve-as num só
       caminho, e a célula refá-las a partir das linhas. */
    tiques: comValor.map((c) => posicao(c.n, min, max)).sort((a, b) => a - b),
    concelho: esquerdaDoConcelho === null ? null : { esquerda: esquerdaDoConcelho, ancora: ancora(esquerdaDoConcelho) },
    portugal:
      portugal && esquerdaDePortugal !== null
        ? { ...portugal, esquerda: esquerdaDePortugal, ancora: ancora(esquerdaDePortugal) }
        : null,
    lado,
  };
}
