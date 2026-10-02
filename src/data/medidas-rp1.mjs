/** Declarações do RP1 e RP1b. Valores exclusivamente no livro-razão. */
export const DOMINIOS_RP1 = {
  "ipc-variacao-homologa": "economia-e-financas-publicas",
  "ipc-variacao-media-12-meses": "economia-e-financas-publicas",
  "ipc-alimentacao-variacao-homologa": "economia-e-financas-publicas",
  "ipc-energia-em-casa-variacao-homologa": "economia-e-financas-publicas",
  "ipc-combustiveis-variacao-homologa": "economia-e-financas-publicas",
  "ihpc-variacao-homologa": "economia-e-financas-publicas",
  "ipc-rendas-variacao-homologa": "habitacao",
  "ipc-sem-habitacao-variacao-media-12-meses": "habitacao",
  "remuneracao-bruta-mensal-media": "trabalho",
  "pensao-media-anual-2025": "seguranca-social-e-pensoes",
  "beneficiarios-do-rsi-por-mil-2024": "seguranca-social-e-pensoes",
  "linha-de-risco-de-pobreza-2025": "seguranca-social-e-pensoes"
};
/* OS NOMES QUE DIZEM A VARIAÇÃO (bloco K2-b, 02.10.2026, a decisão do lugar de direção sobre os seis cartões que o §0
   do brief K2 não contou). O valor destes cinco cartões de preços é uma variação (a taxa de variação homóloga do índice,
   e a variação média dos últimos doze meses no da habitação, como o rótulo de cada linha diz), e o nome de nível lia-se
   como um preço. O nome diz a variação e o período, como os quatro do K2; a linha do período anterior leva o mesmo nome,
   porque é a mesma medida um mês antes. */
export const NOMES_RP1 = {
  "ipc-variacao-homologa": {
    "pt": "Inflação",
    "en": "Inflation"
  },
  "ipc-variacao-homologa-periodo-anterior": {
    "pt": "Inflação",
    "en": "Inflation"
  },
  "ipc-variacao-media-12-meses": {
    "pt": "Inflação média de um ano",
    "en": "Average inflation over a year"
  },
  "ipc-variacao-media-12-meses-periodo-anterior": {
    "pt": "Inflação média de um ano",
    "en": "Average inflation over a year"
  },
  "ipc-alimentacao-variacao-homologa": {
    "pt": "Preços dos alimentos e das bebidas não alcoólicas, variação num ano",
    "en": "Prices of food and non-alcoholic beverages, change over a year"
  },
  "ipc-alimentacao-variacao-homologa-periodo-anterior": {
    "pt": "Preços dos alimentos e das bebidas não alcoólicas, variação num ano",
    "en": "Prices of food and non-alcoholic beverages, change over a year"
  },
  "ipc-sem-habitacao-variacao-media-12-meses": {
    "pt": "Preços sem a habitação, variação média em doze meses",
    "en": "Prices excluding housing, twelve-month average change"
  },
  "ipc-sem-habitacao-variacao-media-12-meses-periodo-anterior": {
    "pt": "Preços sem a habitação, variação média em doze meses",
    "en": "Prices excluding housing, twelve-month average change"
  },
  "remuneracao-bruta-mensal-media": {
    "pt": "Remuneração média antes de descontos",
    "en": "Average pay before deductions"
  },
  "remuneracao-bruta-mensal-media-periodo-anterior": {
    "pt": "Remuneração média antes de descontos",
    "en": "Average pay before deductions"
  },
  "pensao-media-anual-2025": {
    "pt": "Pensão média anual",
    "en": "Average annual pension"
  },
  "pensao-media-anual-2024": {
    "pt": "Pensão média anual",
    "en": "Average annual pension"
  },
  "beneficiarios-do-rsi-por-mil-2024": {
    "pt": "Pessoas que recebem o rendimento social de inserção",
    "en": "People receiving social insertion income"
  },
  "beneficiarios-do-rsi-por-mil-2023": {
    "pt": "Pessoas que recebem o rendimento social de inserção",
    "en": "People receiving social insertion income"
  },
  "linha-de-risco-de-pobreza-2025": {
    "pt": "Linha de risco de pobreza",
    "en": "At-risk-of-poverty line"
  },
  "linha-de-risco-de-pobreza-2024": {
    "pt": "Linha de risco de pobreza",
    "en": "At-risk-of-poverty line"
  },
  "ipc-energia-em-casa-variacao-homologa": {
    "pt": "Preços da energia em casa, variação num ano",
    "en": "Home energy prices, change over a year"
  },
  "ipc-energia-em-casa-variacao-homologa-periodo-anterior": {
    "pt": "Preços da energia em casa, variação num ano",
    "en": "Home energy prices, change over a year"
  },
  "ipc-combustiveis-variacao-homologa": {
    "pt": "Preços dos combustíveis, variação num ano",
    "en": "Fuel prices, change over a year"
  },
  "ipc-combustiveis-variacao-homologa-periodo-anterior": {
    "pt": "Preços dos combustíveis, variação num ano",
    "en": "Fuel prices, change over a year"
  },
  "ihpc-variacao-homologa": {
    "pt": "Inflação na comparação europeia",
    "en": "Inflation in the European comparison"
  },
  "ihpc-variacao-homologa-periodo-anterior": {
    "pt": "Inflação na comparação europeia",
    "en": "Inflation in the European comparison"
  },
  "ipc-rendas-variacao-homologa": {
    "pt": "Preços das rendas, variação num ano",
    "en": "Rent prices, change over a year"
  },
  "ipc-rendas-variacao-homologa-periodo-anterior": {
    "pt": "Preços das rendas, variação num ano",
    "en": "Rent prices, change over a year"
  },
  "ihpc-variacao-homologa-ue": {
    "pt": "Inflação na União Europeia",
    "en": "Inflation in the European Union"
  }
};
export const PERGUNTAS_RP1 = {
  "ipc-variacao-homologa": {
    "origens": [
      "rp1-ipc-homologa"
    ],
    "pt": [
      "Quanto mudaram os preços no consumidor face ao mesmo mês do ano anterior?"
    ],
    "en": [
      "How much have consumer prices changed since the same month a year earlier?"
    ]
  },
  "ipc-variacao-media-12-meses": {
    "origens": [
      "rp1-ipc-media"
    ],
    "pt": [
      "Quanto mudou o nível médio dos preços no consumidor nos últimos doze meses face aos doze meses anteriores?"
    ],
    "en": [
      "How much has the average level of consumer prices changed over the last twelve months compared with the previous twelve months?"
    ]
  },
  "ipc-alimentacao-variacao-homologa": {
    "origens": [
      "rp1-ipc-homologa"
    ],
    "pt": [
      "Quanto mudaram os preços dos alimentos e das bebidas não alcoólicas face ao mesmo mês do ano anterior?"
    ],
    "en": [
      "How much have food and non-alcoholic beverage prices changed since the same month a year earlier?"
    ]
  },
  "ipc-sem-habitacao-variacao-media-12-meses": {
    "origens": [
      "rp1-ipc-media"
    ],
    "pt": [
      "Quanto mudou o nível médio dos preços no consumidor sem a habitação nos últimos doze meses?"
    ],
    "en": [
      "How much has the average level of consumer prices excluding housing changed over the last twelve months?"
    ]
  },
  "remuneracao-bruta-mensal-media": {
    "origens": [
      "rp1-remuneracao-trabalhadores",
      "rp1-remuneracao-bruta"
    ],
    "pt": [
      "Quanto recebe por mês, em média e antes de descontos, quem trabalha por conta de outrem?"
    ],
    "en": [
      "How much do employees receive per month, on average and before deductions?"
    ]
  },
  "pensao-media-anual-2025": {
    "origens": [
      "rp1-pensoes-formula",
      "rp1-pensoes-periodo"
    ],
    "pt": [
      "Qual é o valor anual médio das pensões pagas pela Segurança Social por pensionista?"
    ],
    "en": [
      "What is the average annual amount of pensions paid by Social Security per pensioner?"
    ]
  },
  "beneficiarios-do-rsi-por-mil-2024": {
    "origens": [
      "rp1-rsi"
    ],
    "pt": [
      "Quantas pessoas recebem o rendimento social de inserção por cada mil pessoas em idade ativa?"
    ],
    "en": [
      "How many people receive social insertion income for every thousand people of working age?"
    ]
  },
  "linha-de-risco-de-pobreza-2025": {
    "origens": [
      "rp1-pobreza"
    ],
    "pt": [
      "Abaixo de que rendimento anual fica em risco de pobreza uma pessoa que vive sozinha?"
    ],
    "en": [
      "Below what annual income is a person living alone at risk of poverty?"
    ]
  },
  "ipc-energia-em-casa-variacao-homologa": {
    "origens": [
      "rp1-ipc-classes-homologa",
      "rp1-ipc-habitacao"
    ],
    "pt": [
      "Quanto mudaram os preços da eletricidade, do gás e dos outros combustíveis usados em casa face ao mesmo mês do ano anterior?"
    ],
    "en": [
      "How much have the prices of electricity, gas and other fuels used at home changed since the same month a year earlier?"
    ]
  },
  "ipc-combustiveis-variacao-homologa": {
    "origens": [
      "rp1-ipc-classes-homologa"
    ],
    "pt": [
      "Quanto mudaram os preços dos combustíveis e dos lubrificantes para os veículos face ao mesmo mês do ano anterior?"
    ],
    "en": [
      "How much have fuel and lubricant prices for vehicles changed since the same month a year earlier?"
    ]
  },
  "ipc-rendas-variacao-homologa": {
    "origens": [
      "rp1-ipc-classes-homologa"
    ],
    "pt": [
      "Quanto mudaram as rendas efetivamente pagas pela habitação face ao mesmo mês do ano anterior?"
    ],
    "en": [
      "How much have rents actually paid for housing changed since the same month a year earlier?"
    ]
  },
  "ihpc-variacao-homologa": {
    "origens": [
      "rp1-ihpc-comparavel",
      "rp1-ihpc-homologa"
    ],
    "pt": [
      "Quanto mudaram os preços no consumidor em Portugal face ao mesmo mês do ano anterior, na medida harmonizada que permite comparar os países da União Europeia?"
    ],
    "en": [
      "How much have consumer prices in Portugal changed since the same month a year earlier, on the harmonised measure used to compare European Union countries?"
    ],
    /* A FORMA DO RECIBO DA SÉRIE (a §1.140 do lugar de direção; a passagem UE1e, 30.09.2026). O recibo
       da série é a tabela dos 27 países, e a pergunta do cartão diz «em Portugal»: por cima da tabela, o
       número de cada outro país lia-se como se fosse sobre Portugal. Esta forma é a pergunta do cartão sem
       o lugar, sem mais nenhuma palavra mudada, com as mesmas origens. O `SerieView.astro` usa-a onde ela
       existe, e a do cartão onde não existe; o portão de HTML confere que ela é a do cartão sem o lugar, e
       que a definição de nenhum recibo de série nomeia Portugal. */
    "serie": {
      "pt": [
        "Quanto mudaram os preços no consumidor face ao mesmo mês do ano anterior, na medida harmonizada que permite comparar os países da União Europeia?"
      ],
      "en": [
        "How much have consumer prices changed since the same month a year earlier, on the harmonised measure used to compare European Union countries?"
      ]
    }
  }
};
