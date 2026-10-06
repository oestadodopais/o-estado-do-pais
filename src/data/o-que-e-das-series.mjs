/**
 * O QUE É CADA SÉRIE · as frases das séries no tempo sem linha do livro-razão (bloco R4, 05.10.2026, o ponto 3 do brief
 * `design/observatorio/BRIEF-R4-as-palavras-correntes-em-cada-numero.md`).
 *
 * GERADO por `design/especime-v3/medicoes/r4-2026-10-05/compor-series-r4.mjs` a partir da especificação
 * `series-r4.mjs`, na mesma pasta, onde cada frase se escreve parte a parte com o apoio de cada parte. Não se edita à
 * mão: muda-se a especificação e corre-se o compositor, que reescreve este ficheiro e a auditoria
 * (`tests/cartao/leituras-provadas.json`, chave `series`), que a K17 do `check:cartao` confere.
 *
 * As séries com linha (a que o nome declara, ou a última presa à série) leem a frase da linha, e não estão aqui.
 */
export const FRASES_DAS_SERIES = {
  "serie-cem-euros-de-2015-01": {
    "frase": {
      "pt": [
        "É o que cem euros compram em cada mês, contados em euros do primeiro mês da série, depois de descontada a subida dos preços no consumidor (índice de preços no consumidor do INE)."
      ],
      "en": [
        "It is what one hundred euros buy each month, counted in euros of the series’ first month, net of the rise in consumer prices (the INE consumer price index)."
      ]
    }
  },
  "serie-ihpc-combustiveis-variacao-homologa": {
    "frase": {
      "pt": [
        "É quanto mudaram, em Portugal, os preços dos combustíveis face ao mesmo mês do ano anterior, na medida harmonizada que serve para comparar os países da União Europeia (índice harmonizado de preços no consumidor)."
      ],
      "en": [
        "It is how much, in Portugal, fuel prices changed compared with the same month of the previous year, in the harmonised measure used to compare the countries of the European Union (harmonised index of consumer prices)."
      ]
    }
  },
  "serie-ihpc-combustiveis-variacao-homologa-ue": {
    "frase": {
      "pt": [
        "É quanto mudaram os preços dos combustíveis face ao mesmo mês do ano anterior, na medida harmonizada que serve para comparar os países da União Europeia (índice harmonizado de preços no consumidor); o valor da União é uma média dos países, ponderada pelo peso de cada um."
      ],
      "en": [
        "It is how much fuel prices changed compared with the same month of the previous year, in the harmonised measure used to compare the countries of the European Union (harmonised index of consumer prices); the European Union’s value is an average of the countries, weighted by each country’s weight."
      ]
    }
  },
  "serie-ihpc-energia-da-casa-variacao-homologa": {
    "frase": {
      "pt": [
        "É quanto mudaram, em Portugal, os preços da energia usada em casa face ao mesmo mês do ano anterior, na medida harmonizada que serve para comparar os países da União Europeia (índice harmonizado de preços no consumidor)."
      ],
      "en": [
        "It is how much, in Portugal, the prices of energy used at home changed compared with the same month of the previous year, in the harmonised measure used to compare the countries of the European Union (harmonised index of consumer prices)."
      ]
    }
  },
  "serie-ihpc-rendas-variacao-homologa": {
    "frase": {
      "pt": [
        "É quanto mudaram, em Portugal, os preços das rendas face ao mesmo mês do ano anterior, na medida harmonizada que serve para comparar os países da União Europeia (índice harmonizado de preços no consumidor)."
      ],
      "en": [
        "It is how much, in Portugal, rent prices changed compared with the same month of the previous year, in the harmonised measure used to compare the countries of the European Union (harmonised index of consumer prices)."
      ]
    }
  },
  "serie-ipc-indice": {
    "frase": {
      "pt": [
        "Mede, mês a mês, a evolução dos preços de um conjunto de bens e serviços que representa o que as famílias residentes gastam em consumo (índice de preços no consumidor)."
      ],
      "en": [
        "It measures, month by month, the change in the prices of a set of goods and services that represents what resident households spend on consumption (consumer price index)."
      ]
    }
  },
  "serie-ipc-indice-anual": {
    "frase": {
      "pt": [
        "Mede, ano a ano, a evolução dos preços de um conjunto de bens e serviços que representa o que as famílias residentes gastam em consumo (índice de preços no consumidor)."
      ],
      "en": [
        "It measures, year by year, the change in the prices of a set of goods and services that represents what resident households spend on consumption (consumer price index)."
      ]
    }
  },
  "serie-precos-da-habitacao-variacao-homologa": {
    "frase": {
      "pt": [
        "É quanto mudaram num ano os preços de transação das casas compradas pelas famílias em Portugal, novas e usadas, em cada trimestre (índice de preços da habitação)."
      ],
      "en": [
        "It is the change over a year in the transaction prices of dwellings purchased by households in Portugal, new and existing, in each quarter (house price index)."
      ]
    }
  },
  "serie-remuneracao-bruta-mensal-media-anual": {
    "frase": {
      "pt": [
        "É o que quem trabalha por conta de outrem ganha em média por mês, antes de descontos e contando os subsídios, em cada ano, nos postos de trabalho declarados à Segurança Social e à Caixa Geral de Aposentações; cada pessoa conta tantas vezes quantos os empregos que tem (remuneração bruta mensal média)."
      ],
      "en": [
        "It is what employees earn on average per month, before deductions and including holiday and Christmas pay, in each year, in the jobs declared to Social Security and to the civil-service pension fund; each person counts as many times as the jobs they hold (average gross monthly pay)."
      ]
    }
  },
  "serie-remuneracao-bruta-mensal-media-real": {
    "frase": {
      "pt": [
        "É a remuneração média antes de descontos de cada ano contada nos euros do ano que a unidade nomeia, isto é, descontada a subida dos preços desde esse ano (remuneração em termos reais)."
      ],
      "en": [
        "It is each year’s average pay before deductions counted in euros of the year the unit names, that is, net of the rise in prices since that year (pay in real terms)."
      ]
    }
  }
};

/** As séries cuja frase está por confirmar na fonte (R4-b): o recibo leva o marcador da casa ao pé dela. */
export const SERIES_POR_CONFIRMAR_NA_FONTE = [
  "serie-ihpc-combustiveis-variacao-homologa",
  "serie-ihpc-combustiveis-variacao-homologa-ue",
  "serie-ihpc-energia-da-casa-variacao-homologa",
  "serie-ihpc-rendas-variacao-homologa",
  "serie-precos-da-habitacao-variacao-homologa",
  "serie-remuneracao-bruta-mensal-media-real"
];
