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
 *        alto) nomeia os dois, na mesma lista; hoje nenhuma das dez séries o tem;
 *   F4 · (a passagem UE1b, 29.09.2026, pelo lugar de direção) na edição inglesa o
 *        lugar diz-se com o ordinal: «ranks {n} from the highest» passa a «ranks
 *        {n}{ordinal} from the highest», e «ranks 15 from the highest» lê-se «ranks
 *        15th from the highest». Os sufixos são palavras declaradas (`ordinal`,
 *        abaixo), e a regra que escolhe um é a do inglês: `st`, `nd` e `rd` para
 *        os números acabados em 1, 2 e 3, `th` para os outros e para os acabados
 *        em 11, 12 e 13. O resolvedor aplica-a, e a F19 e a K18 aplicam a sua,
 *        escrita do lado dos portões, e conferem-na contra a tabela literal dos 27
 *        ordinais possíveis. O português já dizia «15.º lugar».
 *
 * AS RESSALVAS DA FONTE (a passagem UE1b, 29.09.2026). Um ponto com marca da
 * fonte mostra-a, na ponta da faixa, na forma que o sítio usa para o provisório
 * e o estimado nos cartões (`<Claim>` e `src/lib/bandeira-da-fonte.mjs`): o
 * valor, e a seguir as palavras entre parênteses, e não a letra crua. As palavras
 * de `p` e de `e` são as do sítio («dado provisório», «provisional data»; «valor
 * estimado», «estimated value», a nota da linha estimada do Eurostat no
 * livro-razão); as das outras marcas que as dez séries trazem dizem em palavras
 * da casa a definição que a própria resposta do Eurostat dá, e o recibo de cada
 * série mostra essa definição tal como a resposta a escreve, ao lado da tabela.
 * Uma marca que um ponto leve e que não esteja aqui fecha a construção (o
 * resolvedor e a F19): nenhuma letra crua chega a uma página.
 *
 * Nenhuma palavra de juízo: «do mais alto para o mais baixo» é uma ordem, e o que
 * é melhor ou pior continua na leitura do cartão (a decisão 3 do §6 do brief).
 */

/**
 * AS MEDIDAS COM SÉRIE QUE OS DOIS QUADROS NÃO TÊM, E O LUGAR DELAS NA SECÇÃO DOS PAÍSES (bloco UE2,
 * 02.10.2026).
 *
 * A secção «Os 27 países» da página da União mostra uma faixa por série de países, pela ordem dos dois
 * quadros (o §3, item 1, do `BRIEF-UE2-a-pagina-dos-paises.md`). Das dez séries, oito são de medidas dos
 * quadros e duas não são, e o brief não lhes dá lugar: a sobrecarga do custo da habitação dos inquilinos a
 * preço de mercado e a variação homóloga do índice harmonizado de preços no consumidor. Esta tabela dá-lho,
 * e é a única: uma série nova que não seja de uma medida dos quadros nem esteja aqui fecha a construção (o
 * resolvedor, `faixasDaPaginaDaUniao()`), e a célula F20 do `check:formas` tem a sua própria cópia da regra.
 *
 *   `depoisDe` · a medida dos quadros a seguir à qual a faixa entra; `null` põe-na no fim, pela ordem desta
 *                tabela.
 *
 * @type {Record<string, { depoisDe: string | null, razao: string }>}
 */
export const MEDIDAS_FORA_DOS_QUADROS = {
  'sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025': {
    depoisDe: 'sobrecarga-do-custo-da-habitacao-2025',
    razao:
      'é a mesma medida num regime de ocupação, e a Comissão Europeia diz que o total se lê com a estrutura ' +
      'por regime de ocupação (a ressalva da §1.140): as duas faixas leem-se uma por baixo da outra',
  },
  'ihpc-variacao-homologa': {
    depoisDe: null,
    razao: 'não é uma medida dos quadros nem a repartição de uma delas, e entra no fim',
  },
};

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
 *   | { ordinal: true }
 *   | { aPar: true }} PedacoDaFaixa
 */

/**
 * @type {Record<Lingua, {
 *   frase: PedacoDaFaixa[],
 *   aPar: { um: PedacoDaFaixa[], varios: PedacoDaFaixa[] },
 *   lista: { entre: string, ultimo: string },
 *   ordinal?: { st: string, nd: string, rd: string, th: string },
 *   ressalvas: Record<string, string>,
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
    /* As ressalvas da fonte, pela marca que a resposta do Eurostat põe ao ponto
       (UE1b). `p` e `e` são as palavras do sítio; as outras dizem a definição da
       resposta: «estimated, provisional», «definition differs (see metadata)»,
       «break in time series» e «low reliability». */
    ressalvas: {
      p: 'dado provisório',
      e: 'valor estimado',
      ep: 'valor estimado e provisório',
      d: 'definição diferente',
      b: 'quebra de série',
      u: 'fiabilidade reduzida',
    },
    /* O rótulo da marca da União no desenho, e a porta para o recibo da série. */
    uniao: 'média da União',
    porta: 'Todos os países',
  },
  en: {
    frase: [
      'Among the ', { conta: true }, ' EU countries in ', { periodo: true },
      ', the lowest value is ', { valor: 'baixo' }, ' (', { paises: 'baixo' }, ') and the highest is ',
      { valor: 'alto' }, ' (', { paises: 'alto' }, '); the EU average is ', { valor: 'uniao' }, '. ',
      { pais: 'PT' }, ' (', { valor: 'portugal' }, ') ranks ', { lugar: true }, { ordinal: true },
      ' from the highest', { aPar: true }, '.',
    ],
    aPar: {
      um: [', level with another country with the same value (', { paises: 'aPar' }, ')'],
      varios: [', level with other countries with the same value (', { paises: 'aPar' }, ')'],
    },
    lista: { entre: ', ', ultimo: ' and ' },
    /* Os sufixos do ordinal inglês (F4): o resolvedor escolhe um pela regra do
       inglês, e a F19 e a K18 conferem a escolha contra os 27 ordinais escritos. */
    ordinal: { st: 'st', nd: 'nd', rd: 'rd', th: 'th' },
    ressalvas: {
      p: 'provisional data',
      e: 'estimated value',
      ep: 'estimated and provisional value',
      d: 'definition differs',
      b: 'break in time series',
      u: 'low reliability',
    },
    uniao: 'EU average',
    porta: 'All the countries',
  },
};
