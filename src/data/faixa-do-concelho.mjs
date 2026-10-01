/**
 * A FAIXA DO CONCELHO · a tabela das ordens e das comparações com Portugal (bloco L2b, 01.10.2026).
 *
 * Uma entrada por medida de concelho que tem cartão na página de cada um dos 308 (a chave de
 * `MEDIDAS_DO_CONCELHO`, em `src/data/concelhos.mjs`). A faixa de cada cartão
 * (`src/components/lugar/FaixaDoConcelho.astro`, pelo resolvedor `src/lib/faixa-do-concelho.mjs`) lê daqui
 * as três coisas que o componente não decide, cada uma com a razão escrita:
 *
 *   faixa       se o cartão leva a faixa. Só as medidas que são taxas ou rácios a levam (o índice de dívida,
 *               o ganho médio mensal, o poder de compra e o prazo médio de pagamento): uma contagem não se
 *               ordena, porque o lugar de um concelho numa contagem (pessoas, empresas, euros de dívida) só
 *               diz o tamanho do concelho. É a decisão 4 da §1.143 («as posições […] nunca sobre
 *               contagens»), que o brief L2b enumerou ao contrário, e que o lugar de direção repôs na
 *               passagem L2b-b (01.10.2026). Uma medida sem faixa não tem ordem nem comparação;
 *   ordem       de que ponta se conta o lugar do concelho entre os que têm valor. «do-mais-alto» é 1 mais
 *               o número de concelhos com valor maior; «do-mais-baixo» é 1 mais o número de concelhos com
 *               valor menor. É a regra do brief L2b (§2): «1 mais o número de concelhos com valor maior, ou
 *               menor onde menor é melhor, e a direção dita no cartão». A ordem diz-se no cartão por
 *               palavras («do mais alto para o mais baixo») e nenhuma palavra diz «melhor» nem «pior»: a
 *               casa não julga o que nenhuma fonte julgou (§1.130);
 *   comparacao  com que valor de Portugal o concelho se compara. `{ linha: '<id>' }` é a linha nacional da
 *               mesma medida, que o resolvedor só usa se tiver a mesma unidade e o mesmo período da linha do
 *               concelho; `{ base: true }` é a base do índice, que a unidade de cada uma das 308 linhas
 *               escreve («índice (Portugal = 100)»), lida pela mesma função que a leitura do lugar já usa
 *               (`baseDoIndice`); `null` é a medida sem linha nacional da mesma medida e do mesmo período, e
 *               a faixa di-lo e não escolhe outro período (o brief, §5, decisão 3).
 *
 * A NONA MEDIDA COM LINHAS PARA OS 308, o limite legal da dívida de cada câmara (`limite` no ficheiro do
 * motor), não tem cartão na página de um concelho: entra no cálculo do índice de dívida e no cartão das
 * câmaras em «Lugares». Por isso não tem faixa, e não tem entrada aqui: o brief manda a faixa «nos
 * cartões que já existem na página do concelho».
 *
 * As razões são da casa, para quem lê o código e o relatório do bloco; não se rendem.
 */

/** @typedef {'do-mais-alto' | 'do-mais-baixo'} OrdemDaFaixa */
/** @typedef {{ linha: string } | { base: true } | null} ComparacaoDaFaixa */

/**
 * @type {Record<string, { faixa: boolean, porqueAFaixa: string, ordem: OrdemDaFaixa | null, porqueAOrdem: string | null, comparacao: ComparacaoDaFaixa, porqueAComparacao: string | null }>}
 */
export const FAIXA_DAS_MEDIDAS_DO_CONCELHO = {
  populacao: {
    faixa: false,
    porqueAFaixa:
      'É uma contagem de pessoas, e uma contagem não se ordena: o lugar entre os 308 só diria o tamanho do concelho (§1.143, decisão 4).',
    ordem: null,
    porqueAOrdem: null,
    comparacao: null,
    porqueAComparacao: null,
  },
  poderDeCompra: {
    faixa: true,
    porqueAFaixa: 'É um índice por habitante, face à média do país: compara concelhos de tamanhos diferentes.',
    ordem: 'do-mais-alto',
    porqueAOrdem: 'Um índice maior é mais poder de compra por pessoa, face à média do país.',
    comparacao: { base: true },
    porqueAComparacao:
      'A unidade de cada uma das 308 linhas escreve a base do índice, «índice (Portugal = 100)»: o valor de Portugal no mesmo período e na mesma medida é a base, e não há linha nacional à parte.',
  },
  desempregoRegistado: {
    faixa: false,
    porqueAFaixa:
      'É uma contagem de pessoas inscritas nos serviços de emprego, e uma contagem não se ordena: cresce com o tamanho do concelho, e o lugar só o diria (§1.143, decisão 4).',
    ordem: null,
    porqueAOrdem: null,
    comparacao: null,
    porqueAComparacao: null,
  },
  empresas: {
    faixa: false,
    porqueAFaixa:
      'É uma contagem de empresas, e uma contagem não se ordena: cresce com o tamanho do concelho, e o lugar só o diria (§1.143, decisão 4).',
    ordem: null,
    porqueAOrdem: null,
    comparacao: null,
    porqueAComparacao: null,
  },
  divida: {
    faixa: false,
    porqueAFaixa:
      'É um total em euros, que se conta como uma contagem: cresce com o tamanho da câmara, e o lugar só o diria (§1.143, decisão 4). A dívida de cada câmara ordena-se pelo índice de dívida, que a mede contra o seu limite legal.',
    ordem: null,
    porqueAOrdem: null,
    comparacao: null,
    porqueAComparacao: null,
  },
  indice: {
    faixa: true,
    porqueAFaixa: 'É um rácio, a dívida contra o limite legal de cada câmara: compara câmaras de tamanhos diferentes.',
    ordem: 'do-mais-baixo',
    porqueAOrdem:
      'Um índice maior é uma dívida mais perto do limite que a lei fixa (150 nesta escala), ou acima dele: conta-se do mais baixo.',
    comparacao: null,
    porqueAComparacao:
      'O índice mede cada câmara contra o seu próprio limite legal, e o livro-razão não tem uma linha de Portugal deste índice.',
  },
  pmp: {
    faixa: true,
    porqueAFaixa: 'É um prazo em dias, que não cresce com o tamanho da câmara: compara câmaras de tamanhos diferentes.',
    ordem: 'do-mais-baixo',
    porqueAOrdem: 'Mais dias é pagar mais tarde aos fornecedores: conta-se do mais baixo.',
    comparacao: null,
    porqueAComparacao:
      'O livro-razão não tem a linha de Portugal da lista da Direção-Geral das Autarquias Locais de dezembro de 2025.',
  },
  ganho: {
    faixa: true,
    porqueAFaixa: 'É uma média por trabalhador, em euros por mês: compara concelhos de tamanhos diferentes.',
    ordem: 'do-mais-alto',
    porqueAOrdem:
      'Um ganho maior é mais dinheiro por mês para quem trabalha por conta de outrem a tempo completo.',
    comparacao: { linha: 'ganho-medio-mensal-2024' },
    porqueAComparacao:
      'A linha de Portugal do mesmo indicador do INE (0012656), na mesma unidade e em 2024, como as 308 linhas dos concelhos.',
  },
};
