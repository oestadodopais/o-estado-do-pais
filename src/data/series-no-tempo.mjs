/**
 * AS SÉRIES NO TEMPO · as declarações do projeto (bloco RP3, 04.10.2026).
 *
 * Uma série no tempo (`ledger/series/<id>.yml`, `eixo: periodo`) é gerada pelo
 * motor e traz o que a fonte diz dela: o nome com que a fonte a publica, os
 * pontos, os pedidos. O que o projeto acrescenta para o recibo da série é o nome
 * do projeto, e vive aqui, num sítio só, nas duas edições:
 *
 *   · uma série cuja medida já tem cartão no sítio leva o NOME DESSE CARTÃO, pela
 *     mesma escada e com a mesma marca (`linha`, o identificador da linha do
 *     cartão): uma medida tem um nome só, e o recibo da série não lhe dá outro;
 *   · uma série sem cartão leva um nome declarado aqui (`nome`), em palavras
 *     correntes, que o recibo rende com a marca `data-nome="serie"` e o
 *     identificador da série (`data-da-serie`), e que a régua da voz confere
 *     carácter a carácter contra este ficheiro.
 *
 * As séries do índice harmonizado do Eurostat dizem «na comparação europeia»,
 * como o cartão da inflação na comparação europeia, porque são as classes desse
 * índice e não as do índice do INE que os cartões dos combustíveis, das rendas e
 * da energia em casa mostram: o mesmo nome para as duas confundia duas medidas.
 *
 * NENHUM NÚMERO SE ESCREVE AQUI, nem nos nomes.
 */

/**
 * O nome do projeto de cada série no tempo: o cartão de que é a medida, ou um
 * nome declarado nas duas edições.
 *
 * @type {Record<string, { linha: string } | { nome: { pt: string, en: string } }>}
 */
export const NOMES_DAS_SERIES = {
  'serie-ipc-variacao-homologa': { linha: 'ipc-variacao-homologa' },
  'serie-ipc-alimentacao-variacao-homologa': { linha: 'ipc-alimentacao-variacao-homologa' },
  'serie-ipc-indice': {
    nome: { pt: 'Índice de preços no consumidor', en: 'Consumer price index' },
  },
  'serie-ihpc-variacao-homologa': { linha: 'ihpc-variacao-homologa' },
  'serie-ihpc-variacao-homologa-ue': { linha: 'ihpc-variacao-homologa-ue' },
  'serie-remuneracao-bruta-mensal-media': { linha: 'remuneracao-bruta-mensal-media' },
  'serie-pensao-media-anual': { linha: 'pensao-media-anual-2025' },
  'serie-beneficiarios-do-rsi-por-mil': { linha: 'beneficiarios-do-rsi-por-mil-2024' },
  'serie-linha-de-risco-de-pobreza': { linha: 'linha-de-risco-de-pobreza-2025' },
  'serie-ihpc-combustiveis-variacao-homologa': {
    nome: {
      pt: 'Preços dos combustíveis na comparação europeia, variação num ano',
      en: 'Fuel prices in the European comparison, change over a year',
    },
  },
  'serie-ihpc-combustiveis-variacao-homologa-ue': {
    nome: {
      pt: 'Preços dos combustíveis na União Europeia, variação num ano',
      en: 'Fuel prices in the European Union, change over a year',
    },
  },
  'serie-ihpc-rendas-variacao-homologa': {
    nome: {
      pt: 'Preços das rendas na comparação europeia, variação num ano',
      en: 'Rent prices in the European comparison, change over a year',
    },
  },
  'serie-ihpc-energia-da-casa-variacao-homologa': {
    nome: {
      pt: 'Preços da energia em casa na comparação europeia, variação num ano',
      en: 'Home energy prices in the European comparison, change over a year',
    },
  },
  'serie-precos-da-habitacao-variacao-homologa': {
    nome: {
      pt: 'Preços da habitação, variação num ano, por trimestre',
      en: 'House prices, change over a year, by quarter',
    },
  },
  'serie-salario-minimo-mensal': { linha: 'retribuicao-minima-mensal-doze-meses-2026' },
  /* AS CINCO SÉRIES DO IPC DO BLOCO RP4-m (05.10.2026): cada uma é a medida de um cartão que já existe,
     e leva o nome desse cartão. */
  'serie-ipc-variacao-media-12-meses': { linha: 'ipc-variacao-media-12-meses' },
  'serie-ipc-sem-habitacao-variacao-media-12-meses': { linha: 'ipc-sem-habitacao-variacao-media-12-meses' },
  'serie-ipc-combustiveis-variacao-homologa': { linha: 'ipc-combustiveis-variacao-homologa' },
  'serie-ipc-rendas-variacao-homologa': { linha: 'ipc-rendas-variacao-homologa' },
  'serie-ipc-energia-em-casa-variacao-homologa': { linha: 'ipc-energia-em-casa-variacao-homologa' },
  /* O mês de base não entra no nome, que não tem algarismos: diz-se na conta em
     palavras e no primeiro período da série, que têm origem. */
  'serie-cem-euros-de-2015-01': {
    nome: {
      pt: 'O que cem euros compram, aos preços do primeiro mês da série',
      en: 'What one hundred euros buy, at the prices of the series’ first month',
    },
  },
};

/**
 * AS PALAVRAS DA MARCA DO INE. As marcas do Eurostat dizem-se com as palavras da
 * faixa da União (`PALAVRAS_DA_FAIXA`, em `src/data/faixa-da-uniao.mjs`); a do INE
 * é o «&» com a nota «Dado provisório» que a própria resposta escreve, e diz-se
 * com as mesmas palavras com que o cartão a mostra ao pé do valor (o RP1c: «dado
 * provisório», «provisional data»).
 *
 * @type {Record<'pt' | 'en', Record<string, string>>}
 */
export const PALAVRAS_DAS_MARCAS_DO_INE = {
  pt: { '&': 'dado provisório' },
  en: { '&': 'provisional data' },
};

/**
 * A palavra de cada periodicidade, nas duas edições. O campo da série diz a
 * periodicidade em português (`mensal`), e o recibo inglês diz a palavra inglesa;
 * o portão de HTML confere a palavra contra a sua cópia desta tabela.
 *
 * @type {Record<'pt' | 'en', Record<string, string>>}
 */
export const PALAVRAS_DA_PERIODICIDADE = {
  pt: { mensal: 'mensal', trimestral: 'trimestral', semestral: 'semestral', anual: 'anual' },
  en: { mensal: 'monthly', trimestral: 'quarterly', semestral: 'half-yearly', anual: 'annual' },
};
