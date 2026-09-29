/**
 * ===========================================================================
 * AS RESSALVAS DA COMPARAÇÃO COM A UNIÃO (§1.140, a passagem UE1d, 29.09.2026)
 * ===========================================================================
 *
 * Uma medida cuja comparação com a média da União precisa de uma ressalva, e o
 * texto dela, nas duas edições. Hoje é uma: a sobrecarga do custo da habitação
 * no total, que a Comissão Europeia diz que se lê com a estrutura por regime de
 * ocupação.
 *
 * A HISTÓRIA, dita: a §1.124 (bloco R1, 23.09.2026, I138) calou a média da
 * União no cartão desta medida «até o B2 mostrar a medida por regime de
 * ocupação». Essa medida está hoje no sítio (o cartão dos inquilinos a preço de
 * mercado, com a sua linha da União), e a §1.140 do lugar de direção (29.09.2026)
 * trouxe a média da União de volta ao cartão com uma regra: NUNCA SEM A
 * RESSALVA. Em cada cartão e em cada recibo onde a medida aparece com a União
 * (a régua, a faixa, as palavras da leitura ou o recibo da série), esta ressalva
 * aparece no mesmo cartão ou recibo, nas duas edições.
 *
 * UMA FONTE SÓ. O texto é o que a primeira página já dizia no bloco `casa`
 * (`src/data/primeira-pagina.mjs`, o campo `ressalva`), trazido para aqui sem
 * mudar uma palavra, e o bloco lê-o daqui, como o cartão, o recibo da linha e o
 * recibo da série. A auditoria das palavras da primeira página
 * (`tests/inicio/blocos-provados.json`) continua a prendê-lo ao seu literal.
 *
 * QUEM CONFERE: a K14 do `check:cartao` (`tests/cartao/cartao.mjs`), com a lista
 * das medidas escrita lá e não importada daqui, exige a ressalva em cada cartão
 * e recibo dessas medidas que mostre a União, e a K1 admite o bloco da ressalva
 * num cartão só nessas medidas.
 */
export const RESSALVAS_DA_UNIAO = /** @type {const} */ ({
  'sobrecarga-do-custo-da-habitacao-2025': {
    pt: 'Este total mistura situações muito diferentes, e a Comissão Europeia diz que deve ler-se com a estrutura por regime de ocupação.',
    en: 'This total mixes very different situations, and the European Commission says it should be read together with the breakdown by tenure status.',
  },
});

/**
 * A ressalva de uma medida numa edição, ou `null`.
 * @param {string} id @param {'pt'|'en'} lang
 * @returns {string|null}
 */
export function ressalvaDaUniao(id, lang) {
  const r = /** @type {Record<string, { pt: string, en: string }>} */ (RESSALVAS_DA_UNIAO)[id];
  return r ? r[lang] : null;
}
