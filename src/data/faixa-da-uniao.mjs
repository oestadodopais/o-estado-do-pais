/**
 * A FAIXA DA UNIÃO · as palavras do lugar de direção (bloco UE1, 29.09.2026).
 *
 * As palavras são as do §3, ponto 5, do `BRIEF-UE1-onde-portugal-fica-entre-os-27.md`,
 * e os algarismos e os nomes vêm dos pontos da série. A gramática é a das
 * leituras (L1): cadeias fixas, sem algarismos, e pedaços que o resolvedor
 * (`src/lib/faixa-da-uniao.mjs`) enche a partir da série:
 *
 *   { conta: true }        quantos países a série tem (`data-ponto-conta`)
 *   { periodo: true }      o período da série, na forma da casa (`data-da-linha`)
 *   { valor: <papel> }     o valor de um ponto (`data-ponto`), papel «baixo», «alto»,
 *                          «uniao» ou «portugal»
 *   { paises: <papel> }    os nomes dos países de um papel, da tabela de autoridade
 *                          (`data-pais`), em lista quando são mais do que um
 *   { pais: 'PT' }         o nome de Portugal, da mesma tabela
 *   { lugar: true }        o lugar de Portugal, 1 mais o número de países com valor
 *                          maior (`data-ponto-lugar`)
 *   { aPar: true }         o ramo do empate, quando outro país tem o valor de Portugal
 *
 * OS ACERTOS, e são os únicos (o guião `acertos-ue1.py`, na pasta das medições do
 * bloco, lê as palavras do brief, aplica-lhes os de `acertos-ue1.json` e mais
 * nenhum, e compara com esta declaração nas duas línguas e nos três ramos):
 *
 *   F0 · «Entre os 27 países» passa a «Entre os {conta} países» (e «Among the 27
 *        EU countries» a «Among the {conta} EU countries»): o 27 é o número de
 *        países com valor na série, recontado dos pontos, porque um algarismo nas
 *        palavras fixas não tem origem que o portão de HTML aceite;
 *   F1 · «o valor mais baixo é o de {país} ({valor}) e o mais alto o de {país}
 *        ({valor})» passa a «o valor mais baixo é {valor} ({país}) e o mais alto
 *        {valor} ({país})». Em português de Portugal um nome de país leva quase
 *        sempre o artigo: «o de Grécia» não se diz, diz-se «o da Grécia», e «o dos
 *        Países Baixos», «o do Luxemburgo»; mas «o de Malta», «o de Chipre», «o de
 *        Portugal». A tabela de autoridade dá o nome curto e não dá o artigo, e
 *        escrever os 27 artigos à mão era escrever à mão o que os nomes não trazem.
 *        Entre parênteses o nome não pede artigo nenhum. Na edição inglesa, pela
 *        mesma forma e pela mesma razão: o nome inglês da tabela é «Netherlands»,
 *        e «Netherlands's» não se escreve;
 *   F2 · o ramo do empate («a frase acrescenta "a par de {país}"») é «, a par de
 *        outro país com o mesmo valor ({país})» ou «, a par de outros países com o
 *        mesmo valor ({países})», no fim da frase do lugar. «A par de Áustria» pedia
 *        o artigo pela razão de F1, e o brief escreve um país só: na pobreza ou
 *        exclusão de 2025 Portugal tem o mesmo valor que dois (medido na série a
 *        29.09.2026). Em inglês, «level with another country with the same value
 *        ({country})» e «level with other countries with the same value
 *        ({countries})»;
 *   F3 · um extremo repetido (dois países com o mesmo valor mais baixo ou mais
 *        alto) nomeia os dois, na mesma lista; hoje nenhuma das dez séries o tem.
 *
 * Nenhuma palavra de juízo: «do mais alto para o mais baixo» é uma ordem, e o que
 * é melhor ou pior continua na leitura do cartão (a decisão 3 do §6 do brief).
 */

/** @typedef {'baixo' | 'alto' | 'uniao' | 'portugal'} PapelDoValor */
/** @typedef {'baixo' | 'alto' | 'aPar'} PapelDosPaises */
/**
 * @typedef {string
 *   | { conta: true }
 *   | { periodo: true }
 *   | { valor: PapelDoValor }
 *   | { paises: PapelDosPaises }
 *   | { pais: 'PT' }
 *   | { lugar: true }
 *   | { aPar: true }} PedacoDaFaixa
 */

/**
 * @type {Record<Lingua, {
 *   frase: PedacoDaFaixa[],
 *   aPar: { um: PedacoDaFaixa[], varios: PedacoDaFaixa[] },
 *   lista: { entre: string, ultimo: string },
 *   uniao: string,
 *   porta: string,
 * }>}
 */
export const PALAVRAS_DA_FAIXA = {
  pt: {
    frase: [
      'Entre os ', { conta: true }, ' países da União, em ', { periodo: true },
      ', o valor mais baixo é ', { valor: 'baixo' }, ' (', { paises: 'baixo' }, ') e o mais alto ',
      { valor: 'alto' }, ' (', { paises: 'alto' }, '); a média da União é ', { valor: 'uniao' }, '. ',
      { pais: 'PT' }, ' (', { valor: 'portugal' }, ') está em ', { lugar: true },
      '.º lugar, do mais alto para o mais baixo', { aPar: true }, '.',
    ],
    aPar: {
      um: [', a par de outro país com o mesmo valor (', { paises: 'aPar' }, ')'],
      varios: [', a par de outros países com o mesmo valor (', { paises: 'aPar' }, ')'],
    },
    lista: { entre: ', ', ultimo: ' e ' },
    /* O rótulo da marca da União no desenho, e a porta para o recibo da série. */
    uniao: 'média da União',
    porta: 'Todos os países',
  },
  en: {
    frase: [
      'Among the ', { conta: true }, ' EU countries in ', { periodo: true },
      ', the lowest value is ', { valor: 'baixo' }, ' (', { paises: 'baixo' }, ') and the highest is ',
      { valor: 'alto' }, ' (', { paises: 'alto' }, '); the EU average is ', { valor: 'uniao' }, '. ',
      { pais: 'PT' }, ' (', { valor: 'portugal' }, ') ranks ', { lugar: true }, ' from the highest',
      { aPar: true }, '.',
    ],
    aPar: {
      um: [', level with another country with the same value (', { paises: 'aPar' }, ')'],
      varios: [', level with other countries with the same value (', { paises: 'aPar' }, ')'],
    },
    lista: { entre: ', ', ultimo: ' and ' },
    uniao: 'EU average',
    porta: 'All the countries',
  },
};
