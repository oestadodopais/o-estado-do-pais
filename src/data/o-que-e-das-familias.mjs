/**
 * O QUE É CADA NÚMERO · as frases das famílias (bloco R4, 05.10.2026, o ponto 2 do brief
 * `design/observatorio/BRIEF-R4-as-palavras-correntes-em-cada-numero.md`).
 *
 * GERADO por `design/especime-v3/medicoes/r4-2026-10-05/compor-familias-r4.mjs` a partir da especificação
 * `familias-r4.mjs`, na mesma pasta, onde cada frase se escreve parte a parte com o apoio de cada parte. Não se edita
 * à mão: muda-se a especificação e corre-se o compositor, que reescreve este ficheiro e a auditoria
 * (`tests/cartao/leituras-provadas.json`, chave `familias`), que a K17 do `check:cartao` confere.
 *
 * `FAMILIAS_DAS_LINHAS`: por família (o identificador da linha sem o período no fim), a frase nas duas edições, ou o
 * cartão cuja metade «o que é» a família lê contra a própria linha, e o nome da família para as linhas sem nome do
 * projeto. `FAMILIAS_DOS_CONCELHOS`: as medidas dos concelhos sem cartão (o limite da dívida); as outras leem a nota
 * da medida em `src/data/concelhos.mjs`.
 */
export const FAMILIAS_DAS_LINHAS = {
  "abandono-escolar-precoce": {
    "cartao": "abandono-escolar-precoce-2025"
  },
  "abandono-escolar-precoce-ue": {
    "cartao": "abandono-escolar-precoce-2025",
    "nome": {
      "pt": "Abandono escolar precoce na União Europeia",
      "en": "Early school leaving in the European Union"
    }
  },
  "agua-nao-faturada-portugal": {
    "frase": {
      "pt": [
        "É a parte da água que não é faturada, pelo relatório anual dos serviços de águas e resíduos."
      ],
      "en": [
        "It is the share of water that is not billed, from the annual report on water and waste services."
      ]
    }
  },
  "alentejo-central-poder-de-compra": {
    "frase": {
      "pt": [
        "Índice do poder de compra por pessoa na sub-região, em que Portugal vale cem: acima de cem, o poder de compra por pessoa é maior do que a média do país."
      ],
      "en": [
        "Index of purchasing power per person in the subregion, where Portugal is one hundred: above one hundred, purchasing power per person is higher than the country average."
      ]
    }
  },
  "avisos-pt2030-abertos": {
    "frase": {
      "pt": [
        "É o número de avisos de candidatura que estavam abertos."
      ],
      "en": [
        "It is the number of calls for applications that were open."
      ]
    }
  },
  "avisos-pt2030-pessoas-singulares": {
    "frase": {
      "pt": [
        "É o número de avisos de candidatura abertos a pessoas singulares."
      ],
      "en": [
        "It is the number of calls for applications open to individuals."
      ]
    }
  },
  "beneficiarios-do-rsi-por-mil": {
    "cartao": "beneficiarios-do-rsi-por-mil-2024"
  },
  "ciclo-substituicao-condutas": {
    "frase": {
      "pt": [
        "É o ciclo de substituição das condutas de água, em anos."
      ],
      "en": [
        "It is the replacement cycle of the water mains, in years."
      ]
    }
  },
  "competencias-digitais": {
    "cartao": "competencias-digitais-2025"
  },
  "competencias-digitais-ue": {
    "cartao": "competencias-digitais-2025",
    "nome": {
      "pt": "Pessoas com competências digitais básicas ou superiores na União Europeia",
      "en": "People with basic or above basic digital skills in the European Union"
    }
  },
  "correcoes-publicadas": {
    "frase": {
      "pt": [
        "É o número de entradas do registo de correções que são correções, em todas as linhas do livro-razão; as atualizações não contam, porque uma atualização não é um erro admitido."
      ],
      "en": [
        "It is the number of entries in the corrections log that are corrections, across all the ledger rows; updates do not count, because an update is not an admitted error."
      ]
    }
  },
  "credito-malparado": {
    "nome": {
      "pt": "Crédito malparado",
      "en": "Non-performing loans"
    },
    "frase": {
      "pt": [
        "É o crédito malparado, os empréstimos que não estão a ser pagos como combinado, em percentagem de todos os empréstimos, contando as entidades nacionais e as estrangeiras."
      ],
      "en": [
        "It is non-performing loans, the loans that are not being repaid as agreed, as a percentage of all loans, counting domestic and foreign entities."
      ]
    }
  },
  "crescimento-da-despesa-liquida": {
    "frase": {
      "pt": [
        "É quanto cresceu num ano a despesa pública líquida: a que não conta os juros da dívida, a despesa financiada por fundos europeus nem a que sobe e desce com o desemprego, apurada pelo Conselho das Finanças Públicas."
      ],
      "en": [
        "It is how much net public expenditure grew in a year: the expenditure that leaves out interest on the debt, spending financed by European funds and the spending that rises and falls with unemployment, as computed by the Public Finance Council."
      ]
    }
  },
  "criancas-em-creche": {
    "cartao": "criancas-em-creche-2025"
  },
  "criancas-em-creche-ue": {
    "cartao": "criancas-em-creche-2025",
    "nome": {
      "pt": "Crianças com menos de três anos em creche ou outros cuidados formais na União Europeia",
      "en": "Children under three in formal childcare in the European Union"
    }
  },
  "custo-unitario-do-trabalho": {
    "cartao": "custo-unitario-do-trabalho-2025"
  },
  "custo-unitario-do-trabalho-ue": {
    "cartao": "custo-unitario-do-trabalho-2025",
    "nome": {
      "pt": "Custo do trabalho por unidade produzida na União Europeia (custo unitário do trabalho)",
      "en": "Labour cost per unit of output in the European Union (unit labour cost)"
    }
  },
  "desempenho-das-exportacoes": {
    "cartao": "desempenho-das-exportacoes-2025"
  },
  "desemprego-de-longa-duracao": {
    "cartao": "desemprego-de-longa-duracao-2025"
  },
  "desemprego-de-longa-duracao-ue": {
    "cartao": "desemprego-de-longa-duracao-2025",
    "nome": {
      "pt": "Desemprego de longa duração na União Europeia",
      "en": "Long-term unemployment in the European Union"
    }
  },
  "despesa-em-id": {
    "cartao": "despesa-em-id-2024"
  },
  "despesa-em-id-ue": {
    "nome": {
      "pt": "Despesa em investigação e desenvolvimento na União Europeia",
      "en": "Spending on research and development in the European Union"
    },
    "frase": {
      "pt": [
        "É o que se gastou em investigação e desenvolvimento num ano, pelas empresas, pelas administrações públicas, pelo ensino superior e pelas instituições sem fins lucrativos, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what was spent on research and development in a year, by companies, government, higher education and non-profit institutions, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf01-es": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf01-pt": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf01-ue": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf02-es": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf02-pt": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf02-ue": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf03-es": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf03-pt": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf03-ue": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf04-es": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf04-pt": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf04-ue": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf05-es": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf05-pt": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf05-ue": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf06-es": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf06-pt": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf06-ue": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf07-es": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf07-pt": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf07-ue": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf08-es": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf08-pt": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf08-ue": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf09-es": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf09-pt": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf09-ue": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf10-es": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf10-pt": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "despesa-por-funcao-2024-gf10-ue": {
    "frase": {
      "pt": [
        "É o que as administrações públicas, com as regionais e as locais, gastaram num ano nesta função do Estado, pela classificação das funções que o Eurostat usa, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what general government, including regional and local government, spent in a year on this function of government, under the classification of functions that Eurostat uses, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "disparidade-de-emprego-entre-sexos": {
    "cartao": "disparidade-de-emprego-entre-sexos-2025"
  },
  "disparidade-de-emprego-entre-sexos-ue": {
    "cartao": "disparidade-de-emprego-entre-sexos-2025",
    "nome": {
      "pt": "Diferença de emprego entre homens e mulheres na União Europeia",
      "en": "Employment gap between men and women in the European Union"
    }
  },
  "disparidade-salarial-entre-sexos": {
    "cartao": "disparidade-salarial-entre-sexos-2024"
  },
  "distancia-acores-ue27": {
    "frase": {
      "pt": [
        "É a distância, em pontos, entre o valor de tudo o que a região produz por habitante e a média da União Europeia, que vale cem: a diferença entre os dois índices."
      ],
      "en": [
        "It is the distance, in points, between the value of everything the region produces per inhabitant and the European Union average, which is one hundred: the difference between the two indices."
      ]
    }
  },
  "distancia-alentejo-ue27": {
    "frase": {
      "pt": [
        "É a distância, em pontos, entre o valor de tudo o que a região produz por habitante e a média da União Europeia, que vale cem: a diferença entre os dois índices."
      ],
      "en": [
        "It is the distance, in points, between the value of everything the region produces per inhabitant and the European Union average, which is one hundred: the difference between the two indices."
      ]
    }
  },
  "distancia-algarve-ue27": {
    "frase": {
      "pt": [
        "É a distância, em pontos, entre o valor de tudo o que a região produz por habitante e a média da União Europeia, que vale cem: a diferença entre os dois índices."
      ],
      "en": [
        "It is the distance, in points, between the value of everything the region produces per inhabitant and the European Union average, which is one hundred: the difference between the two indices."
      ]
    }
  },
  "distancia-centro-ue27": {
    "frase": {
      "pt": [
        "É a distância, em pontos, entre o valor de tudo o que a região produz por habitante e a média da União Europeia, que vale cem: a diferença entre os dois índices."
      ],
      "en": [
        "It is the distance, in points, between the value of everything the region produces per inhabitant and the European Union average, which is one hundred: the difference between the two indices."
      ]
    }
  },
  "distancia-grande-lisboa-ue27": {
    "frase": {
      "pt": [
        "É a distância, em pontos, entre o valor de tudo o que a região produz por habitante e a média da União Europeia, que vale cem: a diferença entre os dois índices."
      ],
      "en": [
        "It is the distance, in points, between the value of everything the region produces per inhabitant and the European Union average, which is one hundred: the difference between the two indices."
      ]
    }
  },
  "distancia-madeira-ue27": {
    "frase": {
      "pt": [
        "É a distância, em pontos, entre o valor de tudo o que a região produz por habitante e a média da União Europeia, que vale cem: a diferença entre os dois índices."
      ],
      "en": [
        "It is the distance, in points, between the value of everything the region produces per inhabitant and the European Union average, which is one hundred: the difference between the two indices."
      ]
    }
  },
  "distancia-norte-ue27": {
    "frase": {
      "pt": [
        "É a distância, em pontos, entre o valor de tudo o que a região produz por habitante e a média da União Europeia, que vale cem: a diferença entre os dois índices."
      ],
      "en": [
        "It is the distance, in points, between the value of everything the region produces per inhabitant and the European Union average, which is one hundred: the difference between the two indices."
      ]
    }
  },
  "distancia-oeste-e-vale-do-tejo-ue27": {
    "frase": {
      "pt": [
        "É a distância, em pontos, entre o valor de tudo o que a região produz por habitante e a média da União Europeia, que vale cem: a diferença entre os dois índices."
      ],
      "en": [
        "It is the distance, in points, between the value of everything the region produces per inhabitant and the European Union average, which is one hundred: the difference between the two indices."
      ]
    }
  },
  "distancia-peninsula-de-setubal-ue27": {
    "frase": {
      "pt": [
        "É a distância, em pontos, entre o valor de tudo o que a região produz por habitante e a média da União Europeia, que vale cem: a diferença entre os dois índices."
      ],
      "en": [
        "It is the distance, in points, between the value of everything the region produces per inhabitant and the European Union average, which is one hundred: the difference between the two indices."
      ]
    }
  },
  "distancia-portugal-ue27": {
    "frase": {
      "pt": [
        "É a distância, em pontos, entre o valor de tudo o que o país produz por habitante e a média da União Europeia, que vale cem: a diferença entre os dois índices."
      ],
      "en": [
        "It is the distance, in points, between the value of everything the country produces per inhabitant and the European Union average, which is one hundred: the difference between the two indices."
      ]
    }
  },
  "distancia-setubal-grande-lisboa": {
    "frase": {
      "pt": [
        "É a distância, em pontos, entre a Grande Lisboa e a Península de Setúbal, duas regiões vizinhas, no índice do valor de tudo o que cada uma produz por habitante, em que a média da União Europeia vale cem."
      ],
      "en": [
        "It is the distance, in points, between Greater Lisbon and the Setúbal Peninsula, two neighbouring regions, on the index of the value of everything each produces per inhabitant, where the European Union average is one hundred."
      ]
    }
  },
  "divida-das-empresas": {
    "cartao": "divida-das-empresas-2025"
  },
  "divida-das-empresas-ue": {
    "nome": {
      "pt": "Dívida das empresas (não financeiras) na União Europeia",
      "en": "Debt of (non-financial) companies in the European Union"
    },
    "frase": {
      "pt": [
        "É o que as empresas devem em empréstimos e títulos de dívida, fora as financeiras, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what companies owe in loans and debt securities, excluding financial companies, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "divida-das-familias": {
    "cartao": "divida-das-familias-2025"
  },
  "divida-das-familias-ue": {
    "frase": {
      "pt": [
        "É o que as famílias e as instituições sem fim lucrativo ao seu serviço devem em empréstimos e títulos de dívida, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what households and non-profit institutions serving them owe in loans and debt securities, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "divida-publica": {
    "cartao": "divida-publica-2025"
  },
  "divida-publica-2024-notificacao-ine": {
    "nome": {
      "pt": "Dívida pública na notificação do INE",
      "en": "Government debt in the INE’s notification"
    },
    "frase": {
      "pt": [
        "É tudo o que as administrações públicas devem, em percentagem do PIB, como o INE a apura na notificação do procedimento dos défices excessivos."
      ],
      "en": [
        "It is everything general government owes, as a percentage of GDP, as the INE calculates it in its notification under the excessive deficit procedure."
      ]
    }
  },
  "divida-publica-2025-notificacao-ine": {
    "nome": {
      "pt": "Dívida pública na notificação do INE",
      "en": "Government debt in the INE’s notification"
    },
    "frase": {
      "pt": [
        "É tudo o que as administrações públicas devem, em percentagem do PIB, como o INE a apura na notificação do procedimento dos défices excessivos."
      ],
      "en": [
        "It is everything general government owes, as a percentage of GDP, as the INE calculates it in its notification under the excessive deficit procedure."
      ]
    }
  },
  "divida-publica-ue": {
    "nome": {
      "pt": "Dívida pública na União Europeia",
      "en": "Government debt in the European Union"
    },
    "frase": {
      "pt": [
        "É tudo o que as administrações públicas devem, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is everything general government owes, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "edicoes-publicadas": {
    "frase": {
      "pt": [
        "É o número de edições dos estudos publicados; a edição portuguesa e a inglesa do mesmo estudo contam em separado."
      ],
      "en": [
        "It is the number of editions of the studies published; the Portuguese and English editions of the same study count separately."
      ]
    }
  },
  "estudos-evora-publicados": {
    "frase": {
      "pt": [
        "É o número de estudos publicados cujo objeto é o concelho de Évora e a que nenhum outro estudo sucedeu."
      ],
      "en": [
        "It is the number of studies published whose subject is the municipality of Évora and that no other study has succeeded."
      ]
    }
  },
  "estudos-publicados": {
    "frase": {
      "pt": [
        "É o número de estudos distintos publicados; as traduções não contam como estudos novos."
      ],
      "en": [
        "It is the number of distinct studies published; translations do not count as new studies."
      ]
    }
  },
  "evora-camara-lugares": {
    "frase": {
      "pt": [
        "É o número de mandatos da câmara municipal: os lugares que as eleições autárquicas distribuem pelas listas."
      ],
      "en": [
        "It is the number of seats on the municipal council: the places that the local elections share out among the lists."
      ]
    }
  },
  "evora-camara-mandatos-cdu": {
    "frase": {
      "pt": [
        "É o número de mandatos da câmara municipal que a lista ganhou nas eleições autárquicas desse ano, pelos resultados oficiais."
      ],
      "en": [
        "It is the number of seats on the municipal council that the list won in that year’s local elections, from the official results."
      ]
    }
  },
  "evora-camara-mandatos-ps": {
    "frase": {
      "pt": [
        "É o número de mandatos da câmara municipal que a lista ganhou nas eleições autárquicas desse ano, pelos resultados oficiais."
      ],
      "en": [
        "It is the number of seats on the municipal council that the list won in that year’s local elections, from the official results."
      ]
    }
  },
  "evora-concentracao-vab4": {
    "frase": {
      "pt": [
        "É a parte do valor acrescentado bruto das empresas que cabe às quatro maiores; o valor acrescentado bruto é o valor do que se produz menos o valor dos bens e serviços consumidos para o produzir."
      ],
      "en": [
        "It is the share of companies’ gross value added that goes to the four largest; gross value added is the value of what is produced minus the value of the goods and services used up in producing it."
      ]
    }
  },
  "evora-contas-2024-votos-contra": {
    "frase": {
      "pt": [
        "É o número de votos na votação em que as contas da câmara foram rejeitadas, como a certificação legal das contas o relata."
      ],
      "en": [
        "It is the number of votes in the vote in which the council’s accounts were rejected, as the statutory audit of the accounts reports it."
      ]
    }
  },
  "evora-contas-2024-votos-favor": {
    "frase": {
      "pt": [
        "É o número de votos na votação em que as contas da câmara foram rejeitadas, como a certificação legal das contas o relata."
      ],
      "en": [
        "It is the number of votes in the vote in which the council’s accounts were rejected, as the statutory audit of the accounts reports it."
      ]
    }
  },
  "evora-desemprego-registado": {
    "frase": {
      "pt": [
        "Conta as pessoas desempregadas inscritas nos serviços de emprego em dezembro (desemprego registado)."
      ],
      "en": [
        "Counts the unemployed people registered with the employment service in December (registered unemployment)."
      ]
    }
  },
  "evora-despesa-paga": {
    "frase": {
      "pt": [
        "É a despesa que a câmara pagou no ano, a corrente e a de capital, pela prestação de contas."
      ],
      "en": [
        "It is the spending the council paid in the year, current and capital, from its annual accounts."
      ]
    }
  },
  "evora-divergencia-municipio-dgal": {
    "frase": {
      "pt": [
        "É a diferença entre a dívida da câmara que o regulador publica e a que a própria câmara publica para o mesmo ano, arredondada ao euro."
      ],
      "en": [
        "It is the difference between the council’s debt as the regulator publishes it and as the council itself publishes it for the same year, rounded to the euro."
      ]
    }
  },
  "evora-divida-31-10": {
    "frase": {
      "pt": [
        "É a dívida que a câmara tinha registada no início do mandato, como o relatório de gestão a apresenta."
      ],
      "en": [
        "It is the debt the council had on its books at the start of the term, as the management report presents it."
      ]
    }
  },
  "evora-divida-dgal": {
    "frase": {
      "pt": [
        "A dívida da câmara que conta para o limite legal no fim do ano, pela conta da Direção-Geral das Autarquias Locais: a dívida total sem o que a lei não conta para o limite, como as dívidas não orçamentais e a contribuição para o Fundo de Apoio Municipal."
      ],
      "en": [
        "The council’s debt that counts towards the legal limit at year end, as the Directorate-General for Local Authorities counts it: total debt without what the law does not count towards the limit, such as non-budget debts and the contribution to the municipal support fund."
      ]
    }
  },
  "evora-divida-inicio-mandato-reexpressa": {
    "frase": {
      "pt": [
        "É a dívida do início do mandato como a apresenta um relatório de gestão posterior: reexpressa quer dizer apresentada de novo mais tarde."
      ],
      "en": [
        "It is the debt at the start of the term as a later management report presents it: restated means presented again later."
      ]
    }
  },
  "evora-divida-total": {
    "frase": {
      "pt": [
        "É a dívida total de operações orçamentais da câmara no fim do ano, pelas contas da própria câmara."
      ],
      "en": [
        "It is the council’s total debt from budget operations at year end, from the council’s own accounts."
      ]
    }
  },
  "evora-excesso-endividamento": {
    "frase": {
      "pt": [
        "É o montante em que a dívida da câmara passava do limite legal, pelas contas da própria câmara."
      ],
      "en": [
        "It is the amount by which the council’s debt exceeded the legal limit, from the council’s own accounts."
      ]
    }
  },
  "evora-execucao-da-receita": {
    "frase": {
      "pt": [
        "É a receita que a câmara cobrou no ano em percentagem da que o orçamento previa, pela prestação de contas."
      ],
      "en": [
        "It is the revenue the council collected in the year as a percentage of what the budget foresaw, from its annual accounts."
      ]
    }
  },
  "evora-executivo-2025-ad": {
    "frase": {
      "pt": [
        "É o número de lugares que a lista tem no executivo da câmara saído das eleições autárquicas, pelos resultados oficiais."
      ],
      "en": [
        "It is the number of seats the list holds on the council executive that came out of the local elections, from the official results."
      ]
    }
  },
  "evora-executivo-2025-cdu": {
    "frase": {
      "pt": [
        "É o número de lugares que a lista tem no executivo da câmara saído das eleições autárquicas, pelos resultados oficiais."
      ],
      "en": [
        "It is the number of seats the list holds on the council executive that came out of the local elections, from the official results."
      ]
    }
  },
  "evora-executivo-2025-chega": {
    "frase": {
      "pt": [
        "É o número de lugares que a lista tem no executivo da câmara saído das eleições autárquicas, pelos resultados oficiais."
      ],
      "en": [
        "It is the number of seats the list holds on the council executive that came out of the local elections, from the official results."
      ]
    }
  },
  "evora-executivo-2025-ps": {
    "frase": {
      "pt": [
        "É o número de lugares que a lista tem no executivo da câmara saído das eleições autárquicas, pelos resultados oficiais."
      ],
      "en": [
        "It is the number of seats the list holds on the council executive that came out of the local elections, from the official results."
      ]
    }
  },
  "evora-indice-de-divida": {
    "frase": {
      "pt": [
        "A dívida em percentagem da média da receita corrente líquida cobrada nos três anos anteriores; a lei permite uma vez e meia essa média."
      ],
      "en": [
        "Debt as a percentage of the average net current revenue collected in the previous three years; the law allows one and a half times that average."
      ]
    }
  },
  "evora-limite-divida": {
    "frase": {
      "pt": [
        "É o máximo de dívida que a lei deixa a câmara ter no fim do ano: uma vez e meia a média da receita corrente líquida dos três anos anteriores, pelas contas da própria câmara."
      ],
      "en": [
        "It is the most debt the law lets the council have at year end: one and a half times the average net current revenue of the previous three years, from the council’s own accounts."
      ]
    }
  },
  "evora-limite-divida-dgal": {
    "frase": {
      "pt": [
        "É o máximo de dívida que a lei deixa a câmara ter no fim do ano: uma vez e meia a média da receita corrente líquida cobrada nos três anos anteriores, pela conta da Direção-Geral das Autarquias Locais."
      ],
      "en": [
        "It is the most debt the law lets the council have at year end: one and a half times the average net current revenue collected in the previous three years, as the Directorate-General for Local Authorities counts it."
      ]
    }
  },
  "evora-margem-endividamento": {
    "frase": {
      "pt": [
        "É quanto a câmara ainda podia dever até chegar ao limite legal da dívida, no fim do ano, pela prestação de contas."
      ],
      "en": [
        "It is how much more the council could still owe before reaching the legal debt limit, at year end, from its annual accounts."
      ]
    }
  },
  "evora-orcamento": {
    "frase": {
      "pt": [
        "É o orçamento da câmara para o ano, como a prestação de contas o apresenta."
      ],
      "en": [
        "It is the council’s budget for the year, as its annual accounts present it."
      ]
    }
  },
  "evora-pael-emprestimo": {
    "frase": {
      "pt": [
        "É o montante do empréstimo que a câmara contraiu no programa de apoio à economia local, como o relatório de gestão o apresenta."
      ],
      "en": [
        "It is the amount of the loan the council took out under the local economy support programme, as the management report presents it."
      ]
    }
  },
  "evora-pagamentos-em-atraso": {
    "frase": {
      "pt": [
        "São os pagamentos em atraso com que a câmara fechou o ano, pela prestação de contas."
      ],
      "en": [
        "They are the payments in arrears with which the council closed the year, from its annual accounts."
      ]
    }
  },
  "evora-pelouros-2021-presidente": {
    "frase": {
      "pt": [
        "É o número de pelouros que a página do executivo da câmara atribui a este membro do executivo: cada pelouro é uma área da câmara a seu cargo."
      ],
      "en": [
        "It is the number of portfolios that the council executive’s page assigns to this member of the executive: each portfolio is an area of the council in their charge."
      ]
    }
  },
  "evora-pelouros-2021-total": {
    "frase": {
      "pt": [
        "É a soma dos pelouros atribuídos aos membros do executivo da câmara no mandato."
      ],
      "en": [
        "It is the sum of the portfolios assigned to the members of the council executive in the term."
      ]
    }
  },
  "evora-pelouros-2021-vice-presidente": {
    "frase": {
      "pt": [
        "É o número de pelouros que a página do executivo da câmara atribui a este membro do executivo: cada pelouro é uma área da câmara a seu cargo."
      ],
      "en": [
        "It is the number of portfolios that the council executive’s page assigns to this member of the executive: each portfolio is an area of the council in their charge."
      ]
    }
  },
  "evora-pelouros-2025-presidente": {
    "frase": {
      "pt": [
        "É o número de pelouros que a página do executivo da câmara atribui a este membro do executivo: cada pelouro é uma área da câmara a seu cargo."
      ],
      "en": [
        "It is the number of portfolios that the council executive’s page assigns to this member of the executive: each portfolio is an area of the council in their charge."
      ]
    }
  },
  "evora-pelouros-2025-total": {
    "frase": {
      "pt": [
        "É a soma dos pelouros atribuídos aos membros do executivo da câmara no mandato."
      ],
      "en": [
        "It is the sum of the portfolios assigned to the members of the council executive in the term."
      ]
    }
  },
  "evora-pelouros-2025-vereadora": {
    "frase": {
      "pt": [
        "É o número de pelouros que a página do executivo da câmara atribui a este membro do executivo: cada pelouro é uma área da câmara a seu cargo."
      ],
      "en": [
        "It is the number of portfolios that the council executive’s page assigns to this member of the executive: each portfolio is an area of the council in their charge."
      ]
    }
  },
  "evora-pelouros-2025-vice-presidente": {
    "frase": {
      "pt": [
        "É o número de pelouros que a página do executivo da câmara atribui a este membro do executivo: cada pelouro é uma área da câmara a seu cargo."
      ],
      "en": [
        "It is the number of portfolios that the council executive’s page assigns to this member of the executive: each portfolio is an area of the council in their charge."
      ]
    }
  },
  "evora-populacao": {
    "nome": {
      "pt": "População residente em Évora",
      "en": "Resident population of Évora"
    },
    "frase": {
      "pt": [
        "Estima quantas pessoas vivem no concelho (população residente), pela estimativa anual do INE."
      ],
      "en": [
        "Estimates how many people have their home in the municipality (resident population), from the statistics institute’s annual estimate."
      ]
    }
  },
  "evora-prazo-medio-de-pagamento": {
    "frase": {
      "pt": [
        "O número médio de dias que a câmara demora a pagar aos fornecedores (prazo médio de pagamento), pelas contas da própria câmara."
      ],
      "en": [
        "The average number of days the council takes to pay its suppliers (average payment period), from the council’s own accounts."
      ]
    }
  },
  "evora-prr-aprovado": {
    "frase": {
      "pt": [
        "São as verbas do Plano de Recuperação e Resiliência aprovadas para projetos no concelho, pela listagem de entidades do plano."
      ],
      "en": [
        "They are the Recovery and Resilience Plan funds approved for projects in the municipality, from the plan’s list of entities."
      ]
    }
  },
  "evora-prr-execucao": {
    "frase": {
      "pt": [
        "É a parte das verbas do Plano de Recuperação e Resiliência aprovadas para o concelho que já foi paga."
      ],
      "en": [
        "It is the share of the Recovery and Resilience Plan funds approved for the municipality that has already been paid."
      ]
    }
  },
  "evora-prr-municipio-contratado": {
    "frase": {
      "pt": [
        "É o valor que esta entidade contratou no concelho no Plano de Recuperação e Resiliência, pela listagem de entidades do plano."
      ],
      "en": [
        "It is the amount this entity contracted in the municipality under the Recovery and Resilience Plan, from the plan’s list of entities."
      ]
    }
  },
  "evora-prr-pago": {
    "frase": {
      "pt": [
        "São as verbas do Plano de Recuperação e Resiliência já pagas a projetos no concelho, pela listagem de entidades do plano."
      ],
      "en": [
        "They are the Recovery and Resilience Plan funds already paid to projects in the municipality, from the plan’s list of entities."
      ]
    }
  },
  "evora-prr-universidade-contratado": {
    "frase": {
      "pt": [
        "É o valor que esta entidade contratou no concelho no Plano de Recuperação e Resiliência, pela listagem de entidades do plano."
      ],
      "en": [
        "It is the amount this entity contracted in the municipality under the Recovery and Resilience Plan, from the plan’s list of entities."
      ]
    }
  },
  "evora-prr-vencido-aprovado": {
    "frase": {
      "pt": [
        "São as verbas aprovadas em projetos no concelho cujo prazo de conclusão já passou, pela listagem de entidades do Plano de Recuperação e Resiliência."
      ],
      "en": [
        "They are the funds approved for projects in the municipality whose completion deadline has passed, from the Recovery and Resilience Plan’s list of entities."
      ]
    }
  },
  "evora-prr-vencido-quota": {
    "frase": {
      "pt": [
        "É a parte das verbas aprovadas para o concelho que está em projetos cuja data prevista de conclusão já passou sem conclusão registada."
      ],
      "en": [
        "It is the share of the funds approved for the municipality that sits in projects whose planned completion date has passed with no completion recorded."
      ]
    }
  },
  "evora-receita-cobrada": {
    "frase": {
      "pt": [
        "É a receita que a câmara cobrou no ano, pela prestação de contas."
      ],
      "en": [
        "It is the revenue the council collected in the year, from its annual accounts."
      ]
    }
  },
  "evora-saneamento-financeiro": {
    "frase": {
      "pt": [
        "É o montante do empréstimo de saneamento financeiro que a câmara contraiu, como o relatório de gestão o apresenta."
      ],
      "en": [
        "It is the amount of the financial recovery loan the council took out, as the management report presents it."
      ]
    }
  },
  "evora-vab-empresarial": {
    "frase": {
      "pt": [
        "É o valor acrescentado bruto das empresas do concelho, somado sobre todas as atividades: o valor do que produzem menos o valor dos bens e serviços consumidos para o produzir."
      ],
      "en": [
        "It is the gross value added of the municipality’s companies, added up over all activities: the value of what they produce minus the value of the goods and services used up in producing it."
      ]
    }
  },
  "execucao-2026-07-ativos-e-passivos-da-despesa-administracao-central": {
    "frase": {
      "pt": [
        "É a parte da despesa orçamental da administração central feita em operações com ativos e passivos financeiros, que a despesa efetiva não conta."
      ],
      "en": [
        "It is the part of central administration’s budget expenditure made in transactions in financial assets and liabilities, which effective expenditure does not count."
      ]
    }
  },
  "execucao-2026-07-ativos-e-passivos-da-receita-administracao-central": {
    "frase": {
      "pt": [
        "É a parte da receita orçamental da administração central que vem de operações com ativos e passivos financeiros, que a receita efetiva não conta."
      ],
      "en": [
        "It is the part of central administration’s budget revenue that comes from transactions in financial assets and liabilities, which effective revenue does not count."
      ]
    }
  },
  "execucao-2026-07-cem-euros-funcao-01": {
    "frase": {
      "pt": [
        "É quanto foi para esta função em cada cem euros da despesa efetiva consolidada que a administração central gastou de janeiro a julho: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is how much of every hundred euros of consolidated effective expenditure that central administration spent went to this function from January to July: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "execucao-2026-07-cem-euros-funcao-02": {
    "frase": {
      "pt": [
        "É quanto foi para esta função em cada cem euros da despesa efetiva consolidada que a administração central gastou de janeiro a julho: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is how much of every hundred euros of consolidated effective expenditure that central administration spent went to this function from January to July: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "execucao-2026-07-cem-euros-funcao-03": {
    "frase": {
      "pt": [
        "É quanto foi para esta função em cada cem euros da despesa efetiva consolidada que a administração central gastou de janeiro a julho: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is how much of every hundred euros of consolidated effective expenditure that central administration spent went to this function from January to July: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "execucao-2026-07-cem-euros-funcao-04": {
    "frase": {
      "pt": [
        "É quanto foi para esta função em cada cem euros da despesa efetiva consolidada que a administração central gastou de janeiro a julho: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is how much of every hundred euros of consolidated effective expenditure that central administration spent went to this function from January to July: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "execucao-2026-07-cem-euros-funcao-05": {
    "frase": {
      "pt": [
        "É quanto foi para esta função em cada cem euros da despesa efetiva consolidada que a administração central gastou de janeiro a julho: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is how much of every hundred euros of consolidated effective expenditure that central administration spent went to this function from January to July: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "execucao-2026-07-cem-euros-funcao-06": {
    "frase": {
      "pt": [
        "É quanto foi para esta função em cada cem euros da despesa efetiva consolidada que a administração central gastou de janeiro a julho: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is how much of every hundred euros of consolidated effective expenditure that central administration spent went to this function from January to July: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "execucao-2026-07-cem-euros-funcao-07": {
    "frase": {
      "pt": [
        "É quanto foi para esta função em cada cem euros da despesa efetiva consolidada que a administração central gastou de janeiro a julho: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is how much of every hundred euros of consolidated effective expenditure that central administration spent went to this function from January to July: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "execucao-2026-07-cem-euros-funcao-08": {
    "frase": {
      "pt": [
        "É quanto foi para esta função em cada cem euros da despesa efetiva consolidada que a administração central gastou de janeiro a julho: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is how much of every hundred euros of consolidated effective expenditure that central administration spent went to this function from January to July: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "execucao-2026-07-cem-euros-funcao-09": {
    "frase": {
      "pt": [
        "É quanto foi para esta função em cada cem euros da despesa efetiva consolidada que a administração central gastou de janeiro a julho: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is how much of every hundred euros of consolidated effective expenditure that central administration spent went to this function from January to July: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "execucao-2026-07-cem-euros-funcao-10": {
    "frase": {
      "pt": [
        "É quanto foi para esta função em cada cem euros da despesa efetiva consolidada que a administração central gastou de janeiro a julho: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is how much of every hundred euros of consolidated effective expenditure that central administration spent went to this function from January to July: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "execucao-2026-07-despesa-efetiva-administracao-central": {
    "frase": {
      "pt": [
        "É a despesa efetiva da administração central: o que ela gasta sem contar as operações com ativos e passivos financeiros."
      ],
      "en": [
        "It is central administration’s effective expenditure: what it spends without counting transactions in financial assets and liabilities."
      ]
    }
  },
  "execucao-2026-07-despesa-funcao-01": {
    "frase": {
      "pt": [
        "É o que a administração central gastou nesta função de janeiro a julho, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is what central administration spent on this function from January to July, under the classification of expenditure by function, in consolidated effective expenditure: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "execucao-2026-07-despesa-funcao-02": {
    "frase": {
      "pt": [
        "É o que a administração central gastou nesta função de janeiro a julho, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is what central administration spent on this function from January to July, under the classification of expenditure by function, in consolidated effective expenditure: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "execucao-2026-07-despesa-funcao-03": {
    "frase": {
      "pt": [
        "É o que a administração central gastou nesta função de janeiro a julho, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is what central administration spent on this function from January to July, under the classification of expenditure by function, in consolidated effective expenditure: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "execucao-2026-07-despesa-funcao-04": {
    "frase": {
      "pt": [
        "É o que a administração central gastou nesta função de janeiro a julho, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is what central administration spent on this function from January to July, under the classification of expenditure by function, in consolidated effective expenditure: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "execucao-2026-07-despesa-funcao-05": {
    "frase": {
      "pt": [
        "É o que a administração central gastou nesta função de janeiro a julho, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is what central administration spent on this function from January to July, under the classification of expenditure by function, in consolidated effective expenditure: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "execucao-2026-07-despesa-funcao-06": {
    "frase": {
      "pt": [
        "É o que a administração central gastou nesta função de janeiro a julho, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is what central administration spent on this function from January to July, under the classification of expenditure by function, in consolidated effective expenditure: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "execucao-2026-07-despesa-funcao-07": {
    "frase": {
      "pt": [
        "É o que a administração central gastou nesta função de janeiro a julho, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is what central administration spent on this function from January to July, under the classification of expenditure by function, in consolidated effective expenditure: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "execucao-2026-07-despesa-funcao-08": {
    "frase": {
      "pt": [
        "É o que a administração central gastou nesta função de janeiro a julho, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is what central administration spent on this function from January to July, under the classification of expenditure by function, in consolidated effective expenditure: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "execucao-2026-07-despesa-funcao-09": {
    "frase": {
      "pt": [
        "É o que a administração central gastou nesta função de janeiro a julho, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is what central administration spent on this function from January to July, under the classification of expenditure by function, in consolidated effective expenditure: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "execucao-2026-07-despesa-funcao-10": {
    "frase": {
      "pt": [
        "É o que a administração central gastou nesta função de janeiro a julho, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is what central administration spent on this function from January to July, under the classification of expenditure by function, in consolidated effective expenditure: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "execucao-2026-07-despesa-orcamental-administracao-central": {
    "frase": {
      "pt": [
        "É toda a despesa orçamental da administração central, incluindo as operações com ativos e passivos financeiros, que a despesa efetiva não conta."
      ],
      "en": [
        "It is all of central administration’s budget expenditure, including transactions in financial assets and liabilities, which effective expenditure does not count."
      ]
    }
  },
  "execucao-2026-07-despesa-primaria-administracao-central": {
    "frase": {
      "pt": [
        "É a despesa da administração central sem os juros da dívida, a que a fonte chama despesa primária."
      ],
      "en": [
        "It is central administration’s expenditure without the interest on the debt, which the source calls primary expenditure."
      ]
    }
  },
  "execucao-2026-07-diferencas-consolidacao-funcional": {
    "frase": {
      "pt": [
        "É a diferença de consolidação da despesa por funções da administração central: o acerto que se soma às funções para chegar ao total da despesa efetiva consolidada, e não uma função."
      ],
      "en": [
        "It is the consolidation difference in central administration’s expenditure by function: the adjustment added to the functions to reach total consolidated effective expenditure, and not a function."
      ]
    }
  },
  "execucao-2026-07-receita-efetiva-administracao-central": {
    "frase": {
      "pt": [
        "É a receita efetiva da administração central: o que ela recebe sem contar os recebimentos de ativos e passivos financeiros."
      ],
      "en": [
        "It is central administration’s effective revenue: what it takes in without counting receipts from financial assets and liabilities."
      ]
    }
  },
  "execucao-2026-07-receita-orcamental-administracao-central": {
    "frase": {
      "pt": [
        "É toda a receita orçamental da administração central, incluindo os recebimentos de ativos e passivos financeiros, que a receita efetiva não conta."
      ],
      "en": [
        "It is all of central administration’s budget revenue, including receipts from financial assets and liabilities, which effective revenue does not count."
      ]
    }
  },
  "execucao-2026-07-saldo-global-administracao-central": {
    "frase": {
      "pt": [
        "É o saldo global da administração central: a diferença entre o que ela recebe e o que gasta, sem contar as operações com ativos e passivos financeiros; negativo quer dizer que gastou mais do que recebeu."
      ],
      "en": [
        "It is central administration’s overall balance: the difference between what it takes in and what it spends, without counting transactions in financial assets and liabilities; negative means it spent more than it took in."
      ]
    }
  },
  "execucao-2026-07-saldo-global-administracoes-publicas-contabilidade-publica": {
    "frase": {
      "pt": [
        "É o saldo global de todas as administrações públicas, contado em contabilidade pública: a diferença entre o que recebem e o que gastam."
      ],
      "en": [
        "It is the overall balance of all general government, counted in public accounting: the difference between what they take in and what they spend."
      ]
    }
  },
  "execucao-2026-07-saldo-primario-administracao-central": {
    "frase": {
      "pt": [
        "É o saldo da administração central sem os juros da dívida, a que a fonte chama saldo primário."
      ],
      "en": [
        "It is central administration’s balance without the interest on the debt, which the source calls primary balance."
      ]
    }
  },
  "execucao-2026-08-ativos-financeiros-liquidos-administracao-central-seguranca-social": {
    "frase": {
      "pt": [
        "É o que a administração central e a segurança social puseram em ativos financeiros, descontados os reembolsos que receberam (a fonte chama-lhes ativos financeiros líquidos de reembolsos)."
      ],
      "en": [
        "It is what central administration and social security put into financial assets, less the repayments they received (the source calls them financial assets net of repayments)."
      ]
    }
  },
  "execucao-2026-08-despesa-efetiva-administracao-central": {
    "frase": {
      "pt": [
        "É a despesa efetiva da administração central: o que ela gasta sem contar as operações com ativos e passivos financeiros."
      ],
      "en": [
        "It is central administration’s effective expenditure: what it spends without counting transactions in financial assets and liabilities."
      ]
    }
  },
  "execucao-2026-08-despesa-efetiva-administracao-central-seguranca-social": {
    "frase": {
      "pt": [
        "É a despesa efetiva da administração central e da segurança social, somadas sem as transferências entre os seus serviços: o que gastam sem contar as operações com ativos e passivos financeiros."
      ],
      "en": [
        "It is the effective expenditure of central administration and social security, added together without the transfers between their services: what they spend without counting transactions in financial assets and liabilities."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-001": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: without transactions in financial assets and liabilities or transfers between the programme’s services; transfers to other programmes still count."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-002": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: without transactions in financial assets and liabilities or transfers between the programme’s services; transfers to other programmes still count."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-003": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: without transactions in financial assets and liabilities or transfers between the programme’s services; transfers to other programmes still count."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-004": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: without transactions in financial assets and liabilities or transfers between the programme’s services; transfers to other programmes still count."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-005": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: without transactions in financial assets and liabilities or transfers between the programme’s services; transfers to other programmes still count."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-006": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: without transactions in financial assets and liabilities or transfers between the programme’s services; transfers to other programmes still count."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-007": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: without transactions in financial assets and liabilities or transfers between the programme’s services; transfers to other programmes still count."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-008": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: without transactions in financial assets and liabilities or transfers between the programme’s services; transfers to other programmes still count."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-009": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: without transactions in financial assets and liabilities or transfers between the programme’s services; transfers to other programmes still count."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-010": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: without transactions in financial assets and liabilities or transfers between the programme’s services; transfers to other programmes still count."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-011": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: without transactions in financial assets and liabilities or transfers between the programme’s services; transfers to other programmes still count."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-012": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: without transactions in financial assets and liabilities or transfers between the programme’s services; transfers to other programmes still count."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-013": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: without transactions in financial assets and liabilities or transfers between the programme’s services; transfers to other programmes still count."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-014": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: without transactions in financial assets and liabilities or transfers between the programme’s services; transfers to other programmes still count."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-015": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: without transactions in financial assets and liabilities or transfers between the programme’s services; transfers to other programmes still count."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-016": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: without transactions in financial assets and liabilities or transfers between the programme’s services; transfers to other programmes still count."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-017": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: without transactions in financial assets and liabilities or transfers between the programme’s services; transfers to other programmes still count."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-018": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: without transactions in financial assets and liabilities or transfers between the programme’s services; transfers to other programmes still count."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-019": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: without transactions in financial assets and liabilities or transfers between the programme’s services; transfers to other programmes still count."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-020": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem as operações com ativos e passivos financeiros nem as transferências entre os serviços do programa; as transferências para outros programas ainda contam."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: without transactions in financial assets and liabilities or transfers between the programme’s services; transfers to other programmes still count."
      ]
    }
  },
  "execucao-2026-08-diferencas-consolidacao-programas": {
    "frase": {
      "pt": [
        "São as diferenças de consolidação da despesa entre os programas da administração central, de janeiro a agosto."
      ],
      "en": [
        "They are the consolidation differences in expenditure between central administration programmes, from January to August."
      ]
    }
  },
  "execucao-2026-08-fluxos-entre-programas": {
    "frase": {
      "pt": [
        "São as transferências de cada programa da administração central para outros programas, de janeiro a agosto (a fonte chama-lhes fluxos para outros programas orçamentais)."
      ],
      "en": [
        "They are the transfers from each central administration programme to other programmes, from January to August (the source calls them flows to other budget programmes)."
      ]
    }
  },
  "execucao-2026-08-passivos-financeiros-liquidos-administracao-central-seguranca-social": {
    "frase": {
      "pt": [
        "É o que a administração central e a segurança social receberam de novos passivos financeiros, menos o que amortizaram; não é a parte da despesa paga com dívida."
      ],
      "en": [
        "It is what central administration and social security received from new financial liabilities, less what they repaid; it is not the part of spending paid for with debt."
      ]
    }
  },
  "execucao-2026-08-receita-efetiva-administracao-central": {
    "frase": {
      "pt": [
        "É a receita efetiva da administração central: o que ela recebe sem contar os recebimentos de ativos e passivos financeiros."
      ],
      "en": [
        "It is central administration’s effective revenue: what it takes in without counting receipts from financial assets and liabilities."
      ]
    }
  },
  "execucao-2026-08-receita-efetiva-administracao-central-seguranca-social": {
    "frase": {
      "pt": [
        "É a receita efetiva da administração central e da segurança social: o que recebem sem contar os recebimentos de ativos e passivos financeiros."
      ],
      "en": [
        "It is the effective revenue of central administration and social security: what they take in without counting receipts from financial assets and liabilities."
      ]
    }
  },
  "execucao-2026-08-saldo-global-administracao-central": {
    "frase": {
      "pt": [
        "É o saldo global da administração central: a diferença entre o que ela recebe e o que gasta, sem contar as operações com ativos e passivos financeiros; negativo quer dizer que gastou mais do que recebeu."
      ],
      "en": [
        "It is central administration’s overall balance: the difference between what it takes in and what it spends, without counting transactions in financial assets and liabilities; negative means it spent more than it took in."
      ]
    }
  },
  "execucao-2026-08-saldo-global-administracao-central-seguranca-social": {
    "frase": {
      "pt": [
        "É o saldo global da administração central e da segurança social: a receita efetiva menos a despesa efetiva; não é a dívida que se emitiu."
      ],
      "en": [
        "It is the overall balance of central administration and social security: effective revenue minus effective expenditure; it is not the debt that was issued."
      ]
    }
  },
  "execucao-2026-08-subtotal-programas": {
    "frase": {
      "pt": [
        "É a soma da despesa efetiva consolidada de cada programa da administração central, de janeiro a agosto: cada programa sem as suas transferências internas, mas com as transferências entre programas ainda por tirar."
      ],
      "en": [
        "It is the sum of the consolidated effective expenditure of each central administration programme, from January to August: each programme without its internal transfers, but with the transfers between programmes still to be removed."
      ]
    }
  },
  "factor-sustentabilidade": {
    "frase": {
      "pt": [
        "É o fator que multiplica o montante das pensões de velhice que começam no ano e a que ele se aplica: abaixo de um, a pensão baixa, e o que falta para chegar a um é a parte que se corta."
      ],
      "en": [
        "It is the factor that multiplies the amount of the old-age pensions that start in the year and to which it applies: below one, the pension falls, and the gap to one is the share that is cut."
      ]
    }
  },
  "fluxo-de-credito-as-empresas": {
    "cartao": "fluxo-de-credito-as-empresas-2025"
  },
  "fluxo-de-credito-as-familias": {
    "cartao": "fluxo-de-credito-as-familias-2025"
  },
  "fluxo-de-credito-as-familias-ue": {
    "cartao": "fluxo-de-credito-as-familias-2025",
    "nome": {
      "pt": "Fluxo de crédito às famílias na União Europeia",
      "en": "Credit flow to households in the European Union"
    }
  },
  "formacao-bruta-de-capital-fixo": {
    "cartao": "formacao-bruta-de-capital-fixo-2025"
  },
  "formacao-bruta-de-capital-fixo-ue": {
    "nome": {
      "pt": "Investimento em bens duradouros para produzir na União Europeia (formação bruta de capital fixo)",
      "en": "Investment in durable goods used for production in the European Union (gross fixed capital formation)"
    },
    "frase": {
      "pt": [
        "É o que as empresas, as administrações públicas, as famílias e as instituições sem fim lucrativo residentes compraram num ano, descontado o que venderam, em bens que duram mais de um ano, como edifícios, máquinas e programas informáticos, em percentagem do PIB, o valor de tudo o que a economia produz num ano."
      ],
      "en": [
        "It is what companies, government, households and non-profit institutions that are resident acquired in a year, less what they disposed of, in assets that last more than a year, such as buildings, machinery and software, as a percentage of GDP, the value of everything the economy produces in a year."
      ]
    }
  },
  "ihpc-variacao-homologa-periodo-anterior": {
    "cartao": "ihpc-variacao-homologa"
  },
  "ihpc-variacao-homologa-ue": {
    "frase": {
      "pt": [
        "É quanto mudaram os preços no consumidor face ao mesmo mês do ano anterior, na medida harmonizada que serve para comparar os países da União Europeia; o valor da União é uma média dos países, ponderada pelo peso de cada um."
      ],
      "en": [
        "It is how much consumer prices changed compared with the same month a year earlier, on the harmonised measure used to compare the countries of the European Union; the European Union’s value is an average of the countries, weighted by the weight of each."
      ]
    }
  },
  "independencia-da-justica": {
    "cartao": "independencia-da-justica-2025"
  },
  "independencia-da-justica-ue": {
    "cartao": "independencia-da-justica-2025",
    "nome": {
      "pt": "Perceção de independência da justiça na União Europeia",
      "en": "Perceived independence of the justice system in the European Union"
    }
  },
  "indice-de-divida-limite-legal": {
    "frase": {
      "pt": [
        "É o teto que a lei fixa ao índice de dívida das câmaras: a dívida não pode passar de uma vez e meia a média da receita corrente líquida cobrada nos três anos anteriores."
      ],
      "en": [
        "It is the ceiling that the law sets on the councils’ debt index: debt may not exceed one and a half times the average net current revenue collected in the previous three years."
      ]
    }
  },
  "indice-de-percepcao-da-corrupcao": {
    "nome": {
      "pt": "Índice de perceção da corrupção",
      "en": "Corruption Perceptions Index"
    },
    "frase": {
      "pt": [
        "É a pontuação no índice de perceção da corrupção, como o Eurostat a publica."
      ],
      "en": [
        "It is the score in the corruption perceptions index, as Eurostat publishes it."
      ]
    }
  },
  "indice-de-percepcao-da-corrupcao-ue": {
    "nome": {
      "pt": "Índice de perceção da corrupção na União Europeia",
      "en": "Corruption Perceptions Index in the European Union"
    },
    "frase": {
      "pt": [
        "É a pontuação no índice de perceção da corrupção, como o Eurostat a publica."
      ],
      "en": [
        "It is the score in the corruption perceptions index, as Eurostat publishes it."
      ]
    }
  },
  "ipc-alimentacao-variacao-homologa-periodo-anterior": {
    "cartao": "ipc-alimentacao-variacao-homologa"
  },
  "ipc-combustiveis-variacao-homologa-periodo-anterior": {
    "cartao": "ipc-combustiveis-variacao-homologa"
  },
  "ipc-energia-em-casa-variacao-homologa-periodo-anterior": {
    "cartao": "ipc-energia-em-casa-variacao-homologa"
  },
  "ipc-rendas-variacao-homologa-periodo-anterior": {
    "cartao": "ipc-rendas-variacao-homologa"
  },
  "ipc-sem-habitacao-variacao-media-12-meses-periodo-anterior": {
    "cartao": "ipc-sem-habitacao-variacao-media-12-meses"
  },
  "ipc-variacao-homologa-periodo-anterior": {
    "cartao": "ipc-variacao-homologa"
  },
  "ipc-variacao-media-12-meses-periodo-anterior": {
    "cartao": "ipc-variacao-media-12-meses"
  },
  "jovens-nem": {
    "cartao": "jovens-nem-2025"
  },
  "jovens-nem-ue": {
    "cartao": "jovens-nem-2025",
    "nome": {
      "pt": "Jovens sem emprego, escola ou formação na União Europeia",
      "en": "Young people not in employment, education or training in the European Union"
    }
  },
  "licencas-de-construcao": {
    "cartao": "licencas-de-construcao-2025"
  },
  "licencas-de-construcao-ue": {
    "cartao": "licencas-de-construcao-2025",
    "nome": {
      "pt": "Área licenciada para habitação na União Europeia",
      "en": "Floor area licensed for housing in the European Union"
    }
  },
  "linha-de-risco-de-pobreza": {
    "cartao": "linha-de-risco-de-pobreza-2025"
  },
  "municipios-acores-caop": {
    "frase": {
      "pt": [
        "É o número de concelhos desta região na carta administrativa oficial, contados linha a linha no ficheiro que a Direção-Geral do Território publica."
      ],
      "en": [
        "It is the number of municipalities of this region in the official administrative map, counted row by row in the file that the Directorate-General for the Territory publishes."
      ]
    }
  },
  "municipios-com-estudo-aprofundado": {
    "nome": {
      "pt": "Concelhos com estudo aprofundado",
      "en": "Municipalities with an in-depth study"
    },
    "frase": {
      "pt": [
        "É o número de concelhos com pelo menos um estudo aprofundado publicado."
      ],
      "en": [
        "It is the number of municipalities with at least one in-depth study published."
      ]
    }
  },
  "municipios-continente-caop": {
    "frase": {
      "pt": [
        "É o número de concelhos desta região na carta administrativa oficial, contados linha a linha no ficheiro que a Direção-Geral do Território publica."
      ],
      "en": [
        "It is the number of municipalities of this region in the official administrative map, counted row by row in the file that the Directorate-General for the Territory publishes."
      ]
    }
  },
  "municipios-madeira-caop": {
    "frase": {
      "pt": [
        "É o número de concelhos desta região na carta administrativa oficial, contados linha a linha no ficheiro que a Direção-Geral do Território publica."
      ],
      "en": [
        "It is the number of municipalities of this region in the official administrative map, counted row by row in the file that the Directorate-General for the Territory publishes."
      ]
    }
  },
  "municipios-portugal-caop": {
    "frase": {
      "pt": [
        "É o número de concelhos de Portugal na carta administrativa oficial: a soma dos três ficheiros que a Direção-Geral do Território publica, um por região."
      ],
      "en": [
        "It is the number of municipalities of Portugal in the official administrative map: the sum of the three files that the Directorate-General for the Territory publishes, one per region."
      ]
    }
  },
  "municipios-sem-estudo-aprofundado": {
    "nome": {
      "pt": "Concelhos sem estudo aprofundado",
      "en": "Municipalities without an in-depth study"
    },
    "frase": {
      "pt": [
        "É o número de concelhos que ainda não têm estudo aprofundado publicado: o total dos concelhos menos os que já o têm."
      ],
      "en": [
        "It is the number of municipalities that do not yet have an in-depth study published: all municipalities minus those that already have one."
      ]
    }
  },
  "necessidades-medicas-nao-satisfeitas": {
    "cartao": "necessidades-medicas-nao-satisfeitas-2025"
  },
  "necessidades-medicas-nao-satisfeitas-ue": {
    "cartao": "necessidades-medicas-nao-satisfeitas-2025",
    "nome": {
      "pt": "Necessidades de cuidados médicos por satisfazer na União Europeia",
      "en": "Unmet need for medical care in the European Union"
    }
  },
  "oe-2026-ativos-e-passivos-da-despesa-administracao-central": {
    "frase": {
      "pt": [
        "É a parte da despesa orçamental da administração central feita em operações com ativos e passivos financeiros, que a despesa efetiva não conta."
      ],
      "en": [
        "It is the part of central administration’s budget expenditure made in transactions in financial assets and liabilities, which effective expenditure does not count."
      ]
    }
  },
  "oe-2026-ativos-e-passivos-da-receita-administracao-central": {
    "frase": {
      "pt": [
        "É a parte da receita orçamental da administração central que vem de operações com ativos e passivos financeiros, que a receita efetiva não conta."
      ],
      "en": [
        "It is the part of central administration’s budget revenue that comes from transactions in financial assets and liabilities, which effective revenue does not count."
      ]
    }
  },
  "oe-2026-ativos-financeiros-liquidos-administracao-central-seguranca-social": {
    "frase": {
      "pt": [
        "É o que a administração central e a segurança social puseram em ativos financeiros, descontados os reembolsos que receberam (a fonte chama-lhes ativos financeiros líquidos de reembolsos)."
      ],
      "en": [
        "It is what central administration and social security put into financial assets, less the repayments they received (the source calls them financial assets net of repayments)."
      ]
    }
  },
  "oe-2026-cem-euros-funcao-01": {
    "frase": {
      "pt": [
        "É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s consolidated effective expenditure goes to this function that the Budget plans: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-cem-euros-funcao-02": {
    "frase": {
      "pt": [
        "É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s consolidated effective expenditure goes to this function that the Budget plans: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-cem-euros-funcao-03": {
    "frase": {
      "pt": [
        "É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s consolidated effective expenditure goes to this function that the Budget plans: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-cem-euros-funcao-04": {
    "frase": {
      "pt": [
        "É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s consolidated effective expenditure goes to this function that the Budget plans: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-cem-euros-funcao-05": {
    "frase": {
      "pt": [
        "É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s consolidated effective expenditure goes to this function that the Budget plans: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-cem-euros-funcao-06": {
    "frase": {
      "pt": [
        "É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s consolidated effective expenditure goes to this function that the Budget plans: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-cem-euros-funcao-07": {
    "frase": {
      "pt": [
        "É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s consolidated effective expenditure goes to this function that the Budget plans: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-cem-euros-funcao-08": {
    "frase": {
      "pt": [
        "É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s consolidated effective expenditure goes to this function that the Budget plans: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-cem-euros-funcao-09": {
    "frase": {
      "pt": [
        "É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s consolidated effective expenditure goes to this function that the Budget plans: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-cem-euros-funcao-10": {
    "frase": {
      "pt": [
        "É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s consolidated effective expenditure goes to this function that the Budget plans: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-cem-euros-ministerio-administracao-interna": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da despesa bruta da administração central que o Orçamento prevê; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s gross expenditure goes to this ministry that the Budget plans; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-cem-euros-ministerio-agricultura-e-mar": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da despesa bruta da administração central que o Orçamento prevê; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s gross expenditure goes to this ministry that the Budget plans; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-cem-euros-ministerio-ambiente-e-energia": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da despesa bruta da administração central que o Orçamento prevê; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s gross expenditure goes to this ministry that the Budget plans; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-cem-euros-ministerio-cultura-juventude-e-desporto": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da despesa bruta da administração central que o Orçamento prevê; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s gross expenditure goes to this ministry that the Budget plans; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-cem-euros-ministerio-defesa-nacional": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da despesa bruta da administração central que o Orçamento prevê; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s gross expenditure goes to this ministry that the Budget plans; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-cem-euros-ministerio-economia-e-coesao-territorial": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da despesa bruta da administração central que o Orçamento prevê; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s gross expenditure goes to this ministry that the Budget plans; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-cem-euros-ministerio-educacao-ciencia-e-inovacao": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da despesa bruta da administração central que o Orçamento prevê; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s gross expenditure goes to this ministry that the Budget plans; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-cem-euros-ministerio-encargos-gerais-do-estado": {
    "frase": {
      "pt": [
        "É quanto vai para os encargos gerais do Estado em cada cem euros da despesa bruta da administração central que o Orçamento prevê; no mapa, estes encargos são iguais à despesa do programa dos órgãos de soberania; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s gross expenditure goes to the general charges of the State that the Budget plans; in the map, these charges are equal to the expenditure of the programme for the sovereign bodies; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-cem-euros-ministerio-financas": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da despesa bruta da administração central que o Orçamento prevê; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s gross expenditure goes to this ministry that the Budget plans; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-cem-euros-ministerio-infraestruturas-e-habitacao": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da despesa bruta da administração central que o Orçamento prevê; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s gross expenditure goes to this ministry that the Budget plans; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-cem-euros-ministerio-justica": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da despesa bruta da administração central que o Orçamento prevê; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s gross expenditure goes to this ministry that the Budget plans; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-cem-euros-ministerio-negocios-estrangeiros": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da despesa bruta da administração central que o Orçamento prevê; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s gross expenditure goes to this ministry that the Budget plans; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-cem-euros-ministerio-presidencia-do-conselho-de-ministros": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da despesa bruta da administração central que o Orçamento prevê; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s gross expenditure goes to this ministry that the Budget plans; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-cem-euros-ministerio-reforma-do-estado": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da despesa bruta da administração central que o Orçamento prevê; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s gross expenditure goes to this ministry that the Budget plans; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-cem-euros-ministerio-saude": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da despesa bruta da administração central que o Orçamento prevê; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s gross expenditure goes to this ministry that the Budget plans; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-cem-euros-ministerio-trabalho-solidariedade-e-seguranca-social": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da despesa bruta da administração central que o Orçamento prevê; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is how much of every hundred euros of central administration’s gross expenditure goes to this ministry that the Budget plans; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-bruta-administracao-central": {
    "frase": {
      "pt": [
        "É a soma de toda a despesa dos serviços da administração central que o Orçamento prevê para o ano, em bruto; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is the sum of all the expenditure of central administration services that the Budget plans for the year, in gross terms; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-consolidada-administracao-central": {
    "frase": {
      "pt": [
        "É a despesa total que o Orçamento prevê para o ano, consolidada: sem as transferências entre os serviços de que é feita, mas com as operações financeiras."
      ],
      "en": [
        "It is the total expenditure that the Budget plans for the year, consolidated: without the transfers between the services it is made of, but with financial transactions."
      ]
    }
  },
  "oe-2026-despesa-consolidada-seguranca-social": {
    "frase": {
      "pt": [
        "É a despesa total que o Orçamento prevê para o ano, consolidada: sem as transferências entre os serviços de que é feita, mas com as operações financeiras."
      ],
      "en": [
        "It is the total expenditure that the Budget plans for the year, consolidated: without the transfers between the services it is made of, but with financial transactions."
      ]
    }
  },
  "oe-2026-despesa-efetiva-administracao-central": {
    "frase": {
      "pt": [
        "É a despesa efetiva da administração central: o que ela gasta sem contar as operações com ativos e passivos financeiros."
      ],
      "en": [
        "It is central administration’s effective expenditure: what it spends without counting transactions in financial assets and liabilities."
      ]
    }
  },
  "oe-2026-despesa-efetiva-administracao-central-seguranca-social": {
    "frase": {
      "pt": [
        "É a despesa efetiva da administração central e da segurança social, somadas sem as transferências entre os seus serviços: o que gastam sem contar as operações com ativos e passivos financeiros."
      ],
      "en": [
        "It is the effective expenditure of central administration and social security, added together without the transfers between their services: what they spend without counting transactions in financial assets and liabilities."
      ]
    }
  },
  "oe-2026-despesa-funcao-01": {
    "frase": {
      "pt": [
        "É o que a administração central prevê gastar nesta função num ano, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is what central administration plans to spend on this function in a year, under the classification of expenditure by function, in consolidated effective expenditure: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-despesa-funcao-02": {
    "frase": {
      "pt": [
        "É o que a administração central prevê gastar nesta função num ano, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is what central administration plans to spend on this function in a year, under the classification of expenditure by function, in consolidated effective expenditure: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-despesa-funcao-03": {
    "frase": {
      "pt": [
        "É o que a administração central prevê gastar nesta função num ano, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is what central administration plans to spend on this function in a year, under the classification of expenditure by function, in consolidated effective expenditure: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-despesa-funcao-04": {
    "frase": {
      "pt": [
        "É o que a administração central prevê gastar nesta função num ano, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is what central administration plans to spend on this function in a year, under the classification of expenditure by function, in consolidated effective expenditure: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-despesa-funcao-05": {
    "frase": {
      "pt": [
        "É o que a administração central prevê gastar nesta função num ano, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is what central administration plans to spend on this function in a year, under the classification of expenditure by function, in consolidated effective expenditure: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-despesa-funcao-06": {
    "frase": {
      "pt": [
        "É o que a administração central prevê gastar nesta função num ano, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is what central administration plans to spend on this function in a year, under the classification of expenditure by function, in consolidated effective expenditure: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-despesa-funcao-07": {
    "frase": {
      "pt": [
        "É o que a administração central prevê gastar nesta função num ano, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is what central administration plans to spend on this function in a year, under the classification of expenditure by function, in consolidated effective expenditure: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-despesa-funcao-08": {
    "frase": {
      "pt": [
        "É o que a administração central prevê gastar nesta função num ano, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is what central administration plans to spend on this function in a year, under the classification of expenditure by function, in consolidated effective expenditure: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-despesa-funcao-09": {
    "frase": {
      "pt": [
        "É o que a administração central prevê gastar nesta função num ano, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is what central administration plans to spend on this function in a year, under the classification of expenditure by function, in consolidated effective expenditure: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-despesa-funcao-10": {
    "frase": {
      "pt": [
        "É o que a administração central prevê gastar nesta função num ano, pela classificação das despesas por funções, em despesa efetiva consolidada: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is what central administration plans to spend on this function in a year, under the classification of expenditure by function, in consolidated effective expenditure: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-despesa-ministerio-administracao-interna": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-ministerio-agricultura-e-mar": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-ministerio-ambiente-e-energia": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-ministerio-cultura-juventude-e-desporto": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-ministerio-defesa-nacional": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-ministerio-economia-e-coesao-territorial": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-ministerio-educacao-ciencia-e-inovacao": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-ministerio-encargos-gerais-do-estado": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê para os encargos gerais do Estado num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans for the general charges of the State in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-ministerio-financas": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-ministerio-infraestruturas-e-habitacao": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-ministerio-justica": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-ministerio-negocios-estrangeiros": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-ministerio-presidencia-do-conselho-de-ministros": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-ministerio-reforma-do-estado": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-ministerio-saude": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-ministerio-trabalho-solidariedade-e-seguranca-social": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-orcamental-administracao-central": {
    "frase": {
      "pt": [
        "É toda a despesa orçamental da administração central, incluindo as operações com ativos e passivos financeiros, que a despesa efetiva não conta."
      ],
      "en": [
        "It is all of central administration’s budget expenditure, including transactions in financial assets and liabilities, which effective expenditure does not count."
      ]
    }
  },
  "oe-2026-despesa-primaria-administracao-central": {
    "frase": {
      "pt": [
        "É a despesa da administração central sem os juros da dívida, a que a fonte chama despesa primária."
      ],
      "en": [
        "It is central administration’s expenditure without the interest on the debt, which the source calls primary expenditure."
      ]
    }
  },
  "oe-2026-despesa-programa-001": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-programa-002": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-programa-003": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-programa-004": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-programa-005": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-programa-006": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-programa-007": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-programa-008": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-programa-009": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-programa-010": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-programa-011": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-programa-012": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-programa-013": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-programa-014": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-programa-015": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-programa-016": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-programa-017": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-programa-018": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-programa-019": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-programa-020": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano, em despesa bruta; a despesa bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year, in gross expenditure; gross expenditure counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-despesa-total": {
    "frase": {
      "pt": [
        "É a despesa total que o Orçamento prevê para o ano, consolidada: sem as transferências entre os serviços de que é feita, mas com as operações financeiras."
      ],
      "en": [
        "It is the total expenditure that the Budget plans for the year, consolidated: without the transfers between the services it is made of, but with financial transactions."
      ]
    }
  },
  "oe-2026-diferencas-consolidacao-funcional": {
    "frase": {
      "pt": [
        "É a diferença de consolidação da despesa por funções da administração central: o acerto que se soma às funções para chegar ao total da despesa efetiva consolidada, e não uma função."
      ],
      "en": [
        "It is the consolidation difference in central administration’s expenditure by function: the adjustment added to the functions to reach total consolidated effective expenditure, and not a function."
      ]
    }
  },
  "oe-2026-passivos-financeiros-liquidos-administracao-central-seguranca-social": {
    "frase": {
      "pt": [
        "É o que a administração central e a segurança social receberam de novos passivos financeiros, menos o que amortizaram; não é a parte da despesa paga com dívida."
      ],
      "en": [
        "It is what central administration and social security received from new financial liabilities, less what they repaid; it is not the part of spending paid for with debt."
      ]
    }
  },
  "oe-2026-receita-bruta-administracao-central": {
    "frase": {
      "pt": [
        "É a soma de toda a receita dos serviços da administração central que o Orçamento prevê para o ano, em bruto; a receita bruta conta as operações financeiras e as transferências entre serviços do Estado, como o mapa as soma."
      ],
      "en": [
        "It is the sum of all the revenue of central administration services that the Budget plans for the year, in gross terms; gross revenue counts financial transactions and transfers between State services, as the budget map adds them up."
      ]
    }
  },
  "oe-2026-receita-consolidada-administracao-central": {
    "frase": {
      "pt": [
        "É a receita total que o Orçamento prevê para o ano, consolidada: sem as transferências entre os serviços de que é feita, mas com as operações financeiras."
      ],
      "en": [
        "It is the total revenue that the Budget plans for the year, consolidated: without the transfers between the services it is made of, but with financial transactions."
      ]
    }
  },
  "oe-2026-receita-consolidada-seguranca-social": {
    "frase": {
      "pt": [
        "É a receita total que o Orçamento prevê para o ano, consolidada: sem as transferências entre os serviços de que é feita, mas com as operações financeiras."
      ],
      "en": [
        "It is the total revenue that the Budget plans for the year, consolidated: without the transfers between the services it is made of, but with financial transactions."
      ]
    }
  },
  "oe-2026-receita-efetiva-administracao-central": {
    "frase": {
      "pt": [
        "É a receita efetiva da administração central: o que ela recebe sem contar os recebimentos de ativos e passivos financeiros."
      ],
      "en": [
        "It is central administration’s effective revenue: what it takes in without counting receipts from financial assets and liabilities."
      ]
    }
  },
  "oe-2026-receita-efetiva-administracao-central-seguranca-social": {
    "frase": {
      "pt": [
        "É a receita efetiva da administração central e da segurança social: o que recebem sem contar os recebimentos de ativos e passivos financeiros."
      ],
      "en": [
        "It is the effective revenue of central administration and social security: what they take in without counting receipts from financial assets and liabilities."
      ]
    }
  },
  "oe-2026-receita-orcamental-administracao-central": {
    "frase": {
      "pt": [
        "É toda a receita orçamental da administração central, incluindo os recebimentos de ativos e passivos financeiros, que a receita efetiva não conta."
      ],
      "en": [
        "It is all of central administration’s budget revenue, including receipts from financial assets and liabilities, which effective revenue does not count."
      ]
    }
  },
  "oe-2026-saldo-global-administracao-central": {
    "frase": {
      "pt": [
        "É o saldo global da administração central: a diferença entre o que ela recebe e o que gasta, sem contar as operações com ativos e passivos financeiros; negativo quer dizer que gastou mais do que recebeu."
      ],
      "en": [
        "It is central administration’s overall balance: the difference between what it takes in and what it spends, without counting transactions in financial assets and liabilities; negative means it spent more than it took in."
      ]
    }
  },
  "oe-2026-saldo-global-administracao-central-seguranca-social": {
    "frase": {
      "pt": [
        "É o saldo global da administração central e da segurança social: a receita efetiva menos a despesa efetiva; não é a dívida que se emitiu."
      ],
      "en": [
        "It is the overall balance of central administration and social security: effective revenue minus effective expenditure; it is not the debt that was issued."
      ]
    }
  },
  "oe-2026-saldo-primario-administracao-central": {
    "frase": {
      "pt": [
        "É o saldo da administração central sem os juros da dívida, a que a fonte chama saldo primário."
      ],
      "en": [
        "It is central administration’s balance without the interest on the debt, which the source calls primary balance."
      ]
    }
  },
  "penalizacao-antecipacao-um-ano-com-factor": {
    "frase": {
      "pt": [
        "É quanto a pensão baixa quando a reforma se antecipa um ano, somando o corte por cada mês de antecipação e o fator de sustentabilidade, pelas contas do relatório final sobre a reforma da segurança social."
      ],
      "en": [
        "It is how much the pension falls when retirement is brought forward by one year, adding the cut for each month brought forward and the sustainability factor, from the calculations of the final report on social security reform."
      ]
    }
  },
  "penalizacao-antecipacao-um-ano-neutra": {
    "frase": {
      "pt": [
        "É o corte na pensão por um ano de antecipação da reforma que deixaria o sistema de pensões sem ganhar nem perder, contando o que se deixa de descontar e os direitos que se acrescentam, pelas contas do relatório final sobre a reforma da segurança social."
      ],
      "en": [
        "It is the pension cut for retiring one year early that would leave the pension system neither gaining nor losing, counting the contributions no longer paid and the rights that are added, from the calculations of the final report on social security reform."
      ]
    }
  },
  "penalizacao-antecipacao-um-ano-sem-factor": {
    "frase": {
      "pt": [
        "É quanto a pensão baixa quando a reforma se antecipa um ano, só pelo corte por cada mês de antecipação, sem o fator de sustentabilidade, pelas contas do relatório final sobre a reforma da segurança social."
      ],
      "en": [
        "It is how much the pension falls when retirement is brought forward by one year, only from the cut for each month brought forward, without the sustainability factor, from the calculations of the final report on social security reform."
      ]
    }
  },
  "pensao-media-anual": {
    "cartao": "pensao-media-anual-2025"
  },
  "pib-pc-acores": {
    "frase": {
      "pt": [
        "É o valor de tudo o que a região produz num ano, por habitante, em relação à média da União Europeia, que vale cem; a comparação faz-se em paridades do poder de compra, que tiram as diferenças de preços entre países."
      ],
      "en": [
        "It is the value of everything the region produces in a year, per inhabitant, relative to the European Union average, which is one hundred; the comparison is made in purchasing power parities, which remove price differences between countries."
      ]
    }
  },
  "pib-pc-alentejo": {
    "frase": {
      "pt": [
        "É o valor de tudo o que a região produz num ano, por habitante, em relação à média da União Europeia, que vale cem; a comparação faz-se em paridades do poder de compra, que tiram as diferenças de preços entre países."
      ],
      "en": [
        "It is the value of everything the region produces in a year, per inhabitant, relative to the European Union average, which is one hundred; the comparison is made in purchasing power parities, which remove price differences between countries."
      ]
    }
  },
  "pib-pc-algarve": {
    "frase": {
      "pt": [
        "É o valor de tudo o que a região produz num ano, por habitante, em relação à média da União Europeia, que vale cem; a comparação faz-se em paridades do poder de compra, que tiram as diferenças de preços entre países."
      ],
      "en": [
        "It is the value of everything the region produces in a year, per inhabitant, relative to the European Union average, which is one hundred; the comparison is made in purchasing power parities, which remove price differences between countries."
      ]
    }
  },
  "pib-pc-centro": {
    "frase": {
      "pt": [
        "É o valor de tudo o que a região produz num ano, por habitante, em relação à média da União Europeia, que vale cem; a comparação faz-se em paridades do poder de compra, que tiram as diferenças de preços entre países."
      ],
      "en": [
        "It is the value of everything the region produces in a year, per inhabitant, relative to the European Union average, which is one hundred; the comparison is made in purchasing power parities, which remove price differences between countries."
      ]
    }
  },
  "pib-pc-grande-lisboa": {
    "frase": {
      "pt": [
        "É o valor de tudo o que a região produz num ano, por habitante, em relação à média da União Europeia, que vale cem; a comparação faz-se em paridades do poder de compra, que tiram as diferenças de preços entre países."
      ],
      "en": [
        "It is the value of everything the region produces in a year, per inhabitant, relative to the European Union average, which is one hundred; the comparison is made in purchasing power parities, which remove price differences between countries."
      ]
    }
  },
  "pib-pc-madeira": {
    "frase": {
      "pt": [
        "É o valor de tudo o que a região produz num ano, por habitante, em relação à média da União Europeia, que vale cem; a comparação faz-se em paridades do poder de compra, que tiram as diferenças de preços entre países."
      ],
      "en": [
        "It is the value of everything the region produces in a year, per inhabitant, relative to the European Union average, which is one hundred; the comparison is made in purchasing power parities, which remove price differences between countries."
      ]
    }
  },
  "pib-pc-norte": {
    "frase": {
      "pt": [
        "É o valor de tudo o que a região produz num ano, por habitante, em relação à média da União Europeia, que vale cem; a comparação faz-se em paridades do poder de compra, que tiram as diferenças de preços entre países."
      ],
      "en": [
        "It is the value of everything the region produces in a year, per inhabitant, relative to the European Union average, which is one hundred; the comparison is made in purchasing power parities, which remove price differences between countries."
      ]
    }
  },
  "pib-pc-oeste-e-vale-do-tejo": {
    "frase": {
      "pt": [
        "É o valor de tudo o que a região produz num ano, por habitante, em relação à média da União Europeia, que vale cem; a comparação faz-se em paridades do poder de compra, que tiram as diferenças de preços entre países."
      ],
      "en": [
        "It is the value of everything the region produces in a year, per inhabitant, relative to the European Union average, which is one hundred; the comparison is made in purchasing power parities, which remove price differences between countries."
      ]
    }
  },
  "pib-pc-peninsula-de-setubal": {
    "frase": {
      "pt": [
        "É o valor de tudo o que a região produz num ano, por habitante, em relação à média da União Europeia, que vale cem; a comparação faz-se em paridades do poder de compra, que tiram as diferenças de preços entre países."
      ],
      "en": [
        "It is the value of everything the region produces in a year, per inhabitant, relative to the European Union average, which is one hundred; the comparison is made in purchasing power parities, which remove price differences between countries."
      ]
    }
  },
  "pib-pc-portugal": {
    "frase": {
      "pt": [
        "É o valor de tudo o que o país produz num ano, por habitante, em relação à média da União Europeia, que vale cem; a comparação faz-se em paridades do poder de compra, que tiram as diferenças de preços entre países."
      ],
      "en": [
        "It is the value of everything the country produces in a year, per inhabitant, relative to the European Union average, which is one hundred; the comparison is made in purchasing power parities, which remove price differences between countries."
      ]
    }
  },
  "pib-real-per-capita": {
    "cartao": "pib-real-per-capita-2025"
  },
  "pib-real-per-capita-ue": {
    "nome": {
      "pt": "PIB real por habitante na União Europeia",
      "en": "Real GDP per capita in the European Union"
    },
    "frase": {
      "pt": [
        "É o valor de tudo o que a economia produziu no ano, por habitante, descontada a subida dos preços, a que a fonte chama volumes encadeados."
      ],
      "en": [
        "It is the value of everything the economy produced in the year, per inhabitant, excluding the rise in prices, which the source calls chain linked volumes."
      ]
    }
  },
  "portugal-concentracao-vab4": {
    "frase": {
      "pt": [
        "É a parte do valor acrescentado bruto das empresas que cabe às quatro maiores; o valor acrescentado bruto é o valor do que se produz menos o valor dos bens e serviços consumidos para o produzir."
      ],
      "en": [
        "It is the share of companies’ gross value added that goes to the four largest; gross value added is the value of what is produced minus the value of the goods and services used up in producing it."
      ]
    }
  },
  "posicao-de-investimento-internacional": {
    "cartao": "posicao-de-investimento-internacional-2025"
  },
  "precos-da-habitacao": {
    "cartao": "precos-da-habitacao-2025"
  },
  "precos-da-habitacao-ue": {
    "cartao": "precos-da-habitacao-2025",
    "nome": {
      "pt": "Preços da habitação na União Europeia, variação anual",
      "en": "House prices in the European Union, annual change"
    }
  },
  "racio-s80-s20": {
    "cartao": "racio-s80-s20-2025"
  },
  "racio-s80-s20-ue": {
    "cartao": "racio-s80-s20-2025",
    "nome": {
      "pt": "Rendimento do quinto mais rico face ao quinto mais pobre na União Europeia",
      "en": "Income of the richest fifth compared with the poorest fifth in the European Union"
    }
  },
  "remuneracao-bruta-mensal-media-periodo-anterior": {
    "cartao": "remuneracao-bruta-mensal-media"
  },
  "retribuicao-minima-mensal-doze-meses": {
    "frase": {
      "pt": [
        "É o salário mínimo mensal na série que o Eurostat publica duas vezes por ano, em euros por mês."
      ],
      "en": [
        "It is the monthly minimum wage in the series that Eurostat publishes twice a year, in euros a month."
      ]
    }
  },
  "risco-de-pobreza-ou-exclusao": {
    "cartao": "risco-de-pobreza-ou-exclusao-2025"
  },
  "risco-de-pobreza-ou-exclusao-ue": {
    "nome": {
      "pt": "Risco de pobreza ou exclusão social na União Europeia",
      "en": "At risk of poverty or social exclusion in the European Union"
    },
    "frase": {
      "pt": [
        "É a parte da população que está em pelo menos uma de três situações: rendimento abaixo da linha de pobreza do seu país, privação material e social grave, ou viver num agregado onde quase ninguém trabalha; cada pessoa conta uma só vez."
      ],
      "en": [
        "It is the share of the population in at least one of three situations: income below their country’s poverty line, severe material and social deprivation, or living in a household where almost no one works; each person counts only once."
      ]
    }
  },
  "saldo-da-balanca-corrente": {
    "cartao": "saldo-da-balanca-corrente-2025"
  },
  "saldo-das-administracoes-publicas": {
    "cartao": "saldo-das-administracoes-publicas-2025"
  },
  "saldo-das-administracoes-publicas-2025-notificacao-ine": {
    "nome": {
      "pt": "Saldo das contas públicas na notificação do INE",
      "en": "Government balance in the INE’s notification"
    },
    "frase": {
      "pt": [
        "É a diferença entre o que as administrações públicas receberam e o que gastaram num ano, em percentagem do PIB, como o INE a apura na notificação do procedimento dos défices excessivos; positivo quer dizer que receberam mais do que gastaram."
      ],
      "en": [
        "It is the difference between what general government took in and what it spent in a year, as a percentage of GDP, as the INE calculates it in its notification under the excessive deficit procedure; positive means it took in more than it spent."
      ]
    }
  },
  "saldo-natural-portugal": {
    "nome": {
      "pt": "Saldo natural da população",
      "en": "Natural balance of the population"
    },
    "frase": {
      "pt": [
        "É o saldo natural da população de Portugal num ano, em pessoas, como a PORDATA o publica."
      ],
      "en": [
        "It is the natural balance of the population of Portugal in a year, in people, as PORDATA publishes it."
      ]
    }
  },
  "sobrecarga-do-custo-da-habitacao": {
    "cartao": "sobrecarga-do-custo-da-habitacao-2025"
  },
  "sobrecarga-do-custo-da-habitacao-inquilinos-mercado": {
    "cartao": "sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025"
  },
  "sobrecarga-do-custo-da-habitacao-inquilinos-mercado-ue": {
    "cartao": "sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025"
  },
  "sobrecarga-do-custo-da-habitacao-ue": {
    "cartao": "sobrecarga-do-custo-da-habitacao-2025",
    "nome": {
      "pt": "Sobrecarga do custo da habitação na União Europeia",
      "en": "Housing cost overburden in the European Union"
    }
  },
  "taxa-de-actividade": {
    "cartao": "taxa-de-actividade-2025"
  },
  "taxa-de-actividade-ue": {
    "cartao": "taxa-de-actividade-2025",
    "nome": {
      "pt": "Pessoas que trabalham ou procuram trabalho na União Europeia (taxa de atividade)",
      "en": "People who work or are looking for work in the European Union (activity rate)"
    }
  },
  "taxa-de-cambio-efectiva-real": {
    "cartao": "taxa-de-cambio-efectiva-real-2025"
  },
  "taxa-de-cambio-efectiva-real-ue": {
    "nome": {
      "pt": "Preços face aos parceiros comerciais, com o câmbio, na União Europeia (taxa de câmbio efetiva real)",
      "en": "Prices compared with trading partners, including the exchange rate, in the European Union (real effective exchange rate)"
    },
    "frase": {
      "pt": [
        "Mede a competitividade dos preços face aos principais concorrentes, contando a inflação e as taxas de câmbio, em três anos. Uma subida é uma apreciação: os preços sobem face aos dos parceiros e perde-se competitividade de preços."
      ],
      "en": [
        "It measures price competitiveness against the main competitors, allowing for inflation and exchange rates, over three years. A rise is an appreciation: prices increase relative to those of the partners and price competitiveness falls."
      ]
    }
  },
  "taxa-de-desemprego": {
    "cartao": "taxa-de-desemprego-2025"
  },
  "taxa-de-desemprego-mip": {
    "cartao": "taxa-de-desemprego-mip-2025"
  },
  "taxa-de-desemprego-mip-ue": {
    "cartao": "taxa-de-desemprego-mip-2025",
    "nome": {
      "pt": "Taxa de desemprego na União Europeia",
      "en": "Unemployment rate in the European Union"
    }
  },
  "taxa-de-desemprego-ue": {
    "cartao": "taxa-de-desemprego-2025",
    "nome": {
      "pt": "Taxa de desemprego na União Europeia",
      "en": "Unemployment rate in the European Union"
    }
  },
  "taxa-de-emprego": {
    "cartao": "taxa-de-emprego-2025"
  },
  "taxa-de-emprego-ue": {
    "cartao": "taxa-de-emprego-2025",
    "nome": {
      "pt": "Taxa de emprego na União Europeia",
      "en": "Employment rate in the European Union"
    }
  }
};

export const FAMILIAS_DOS_CONCELHOS = {
  "limite": {
    "nome": {
      "pt": "Limite legal da dívida da câmara",
      "en": "Legal debt limit of the council"
    },
    "frase": {
      "pt": [
        "É o máximo de dívida que a lei deixa a câmara ter no fim do ano: uma vez e meia a média da receita corrente líquida cobrada nos três anos anteriores, pela conta da Direção-Geral das Autarquias Locais."
      ],
      "en": [
        "It is the most debt the law lets the council have at year end: one and a half times the average net current revenue collected in the previous three years, as the Directorate-General for Local Authorities counts it."
      ]
    }
  }
};
