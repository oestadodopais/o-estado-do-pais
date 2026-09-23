/** Correções que não são um campo de uma linha. Cada facto aponta para a
 * decisão pública que o regista; check:pais recusa secções em falta.
 *
 * NA LÍNGUA DO LEITOR (bloco R1, 23.09.2026, I141). Um texto daqui rende-se na
 * primeira página e no registo, e diz o que um leitor notou, e não o que a
 * máquina fez: nada de «recibo», «cartão», «livro-razão», «excerto» nem «linha»
 * no sentido do código, e a célula M4 do `check:pais` recusa-os nas duas
 * edições. Um texto pode trazer um valor, e então é uma lista de pedaços em que
 * o valor é `{ claim, sufixo }`, selado à sua linha como em qualquer frase do
 * sítio; nunca um algarismo escrito à mão. */
export const MUDANCAS_DO_PROJETO = [
  {
    id: 'nomes-ine-2026-09-21',
    data: '2026-09-21',
    decisao: '1.115',
    texto: {
      pt: 'Sete nomes de indicadores do INE deixaram de aparecer ao lado dos valores, por não estarem confirmados como a mesma medida; três deles eram de outros indicadores. Nenhum valor mudou.',
      en: 'Seven INE indicator names no longer appear beside the values, because they were not confirmed as the same measure; three of them belonged to other indicators. No value changed.',
    },
  },
  {
    id: 'grupo-etario-jovens-nem-2026-09-22',
    data: '2026-09-22',
    decisao: '1.118',
    texto: {
      pt: 'O Eurostat intitula o quadro dos jovens que não trabalham nem estudam com o grupo dos 15 aos 24 anos, e a série que publica é a dos 15 aos 29. As definições de quatro medidas passam a dizer o grupo etário que medem, nas duas edições. Nenhum valor mudou.',
      en: 'Eurostat titles its table on young people not in employment, education or training with the 15 to 24 age group, while the series it publishes is the 15 to 29 one. The definitions of four measures now state the age group they measure, in both editions. No value changed.',
    },
  },
  {
    /* A 2.ª NOTIFICAÇÃO DO INE (bloco R1, 23.09.2026, I147, decisão da §1.124).
       O valor vai selado à sua linha, e não escrito à mão. */
    id: 'notificacao-ine-divida-2026-09-23',
    data: '2026-09-23',
    decisao: '1.124',
    texto: {
      pt: [
        'O INE reviu a dívida pública de 2025 para ',
        { claim: 'divida-publica-2025-notificacao-ine-2026-09', sufixo: '\u00a0% do PIB' },
        ' na segunda notificação de 2026 do procedimento dos défices excessivos, ainda provisória; a leitura do país passou a dizer as duas leituras oficiais, a do INE e a do Eurostat, e o valor do quadro do Eurostat muda a 21.10.2026.',
      ],
      en: [
        'The INE revised public debt for 2025 to ',
        { claim: 'divida-publica-2025-notificacao-ine-2026-09', sufixo: '% of GDP' },
        ' in the second notification of 2026 under the excessive deficit procedure, still provisional; the reading of the country now gives both official readings, the INE’s and Eurostat’s, and the value in the Eurostat table changes on 21.10.2026.',
      ],
    },
  },
  {
    /* A PEÇA DAS PENALIZAÇÕES CORRIGIDA (bloco M4b, 23.09.2026, decisão da §1.125).
       Sem algarismos, porque os valores da conta não têm linha neste sítio; a
       conta inteira está na linha ch8-racio-derivado do livro do motor. */
    id: 'multiplo-penalizacoes-2026-09-23',
    data: '2026-09-23',
    decisao: '1.125',
    texto: {
      pt: 'No estudo «Penalizações por Reforma Antecipada em Portugal», a frase que explicava o múltiplo entre a penalização legal com o fator de sustentabilidade e a redução neutra fazia a conta com o valor arredondado, e essa conta não dava o múltiplo que a frase anunciava; a frase passou a fazer a conta com o valor antes de arredondar. Uma enumeração de escalões de carreira ganhou a palavra «anos» em dois deles. Nenhum valor do estudo mudou.',
      en: 'In the study “Penalizações por Reforma Antecipada em Portugal”, the sentence explaining the multiple between the legal penalty with the sustainability factor and the neutral reduction made the calculation with the rounded value, and that calculation did not give the multiple the sentence announced; the sentence now makes the calculation with the value before rounding. A list of career brackets gained the word “anos” in two of them. No value in the study changed.',
    },
  },
];
