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
        "É a parte da água entrada no sistema que não é faturada, nas entidades gestoras em baixa de Portugal continental. A avaliação global abrange noventa e três por cento das entidades gestoras; a página apresenta também a avaliação em alta. O valor situa-se na faixa «Qualidade do serviço mediana» da ERSAR: acima de vinte e até trinta por cento, incluindo o limite superior."
      ],
      "en": [
        "It is the share of water entering the system that is not billed by retail operators in mainland Portugal. The overall assessment covers ninety-three per cent of operators; the page also presents the wholesale assessment. The value falls in ERSAR’s “medium service quality” band: above twenty and up to thirty per cent, including the upper limit."
      ]
    },
    "origens": [
      "rp4n-agua-nao-faturada",
      "rp4n-agua-ambito",
      "rp4n-agua-faixas"
    ]
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
  "amortizacoes-e-anulacoes-de-divida-fundada": {
    "nome": {
      "pt": "Amortizações e anulações de dívida fundada do Estado, contabilidade orçamental pública",
      "en": "State funded debt redemptions and cancellations, public budget accounts"
    },
    "frase": {
      "pt": [
        "É a parcela do financiamento do Estado usada para reembolsar ou extinguir dívida fundada. Dívida fundada é a que se contrai para acabar de ser paga num ano orçamental posterior ao da contratação. A contabilidade orçamental pública conta os recebimentos e pagamentos ocorridos no período."
      ],
      "en": [
        "It is the share of State financing used to repay or extinguish funded debt. Funded debt is debt contracted to be fully repaid in a budget year after the year in which it was incurred. Public budget accounts record receipts and payments during the period."
      ]
    },
    "origens": []
  },
  "avisos-pt2030-abertos": {
    "frase": {
      "pt": [
        "Por confirmar na fonte."
      ],
      "en": [
        "To be confirmed at source."
      ]
    }
  },
  "avisos-pt2030-pessoas-singulares": {
    "frase": {
      "pt": [
        "Por confirmar na fonte."
      ],
      "en": [
        "To be confirmed at source."
      ]
    }
  },
  "beneficiarios-do-rsi-por-mil": {
    "cartao": "beneficiarios-do-rsi-por-mil-2024"
  },
  "ciclo-substituicao-condutas": {
    "frase": {
      "pt": [
        "Por confirmar na fonte."
      ],
      "en": [
        "To be confirmed at source."
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
  "custo-da-divida-emitida": {
    "nome": {
      "pt": "Custo médio ponderado da dívida emitida pelo Estado",
      "en": "Weighted average cost of State debt issued"
    },
    "frase": {
      "pt": [
        "É o custo médio de o Estado pedir dinheiro emprestado no ano, através de Bilhetes do Tesouro, Obrigações do Tesouro, Obrigações do Tesouro de Rendimento Variável e Medium Term Notes. As emissões pesam nesta média de acordo com os montantes e os prazos. O valor é de dois mil e vinte e seis, até à data do boletim de setembro."
      ],
      "en": [
        "It is the average cost of the State’s borrowing during the year through Treasury bills, Treasury bonds, floating-rate Treasury bonds and Medium Term Notes. Issues are weighted in this average by their amounts and maturities. The value is for two thousand and twenty-six, as of the September bulletin."
      ]
    },
    "origens": []
  },
  "custo-do-stock-da-divida-direta": {
    "nome": {
      "pt": "Custo da dívida direta do Estado em circulação, juros em contas nacionais",
      "en": "Cost of outstanding State direct debt, interest in national accounts"
    },
    "frase": {
      "pt": [
        "Mede o custo dos juros da dívida que o Estado tem: compara os juros do subsetor Estado atribuídos ao ano pelas contas nacionais com o saldo médio da dívida direta no fim desse ano e do anterior. Os juros são registados quando o encargo é assumido, mesmo que sejam pagos noutro ano."
      ],
      "en": [
        "It measures the interest cost of the State’s outstanding debt: interest of the State subsector attributed to the year in national accounts is compared with average direct debt at the end of that year and the previous one. Interest is recorded when the cost is incurred, even if it is paid in another year."
      ]
    },
    "origens": []
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
  "divida-direta-do-estado": {
    "nome": {
      "pt": "Dívida direta do Estado no fim de agosto, valor nominal ou descontado",
      "en": "State direct debt at the end of August, nominal or discounted value"
    },
    "frase": {
      "pt": [
        "É a dívida emitida pelo Estado que ainda estava por pagar no fim de agosto. É a dívida direta do Estado em contabilidade pública, não a dívida de todas as administrações públicas na ótica de Maastricht. A dívida pública de Maastricht abrange todas as administrações públicas e retira a dívida que umas entidades públicas detêm de outras. O saldo usa o valor nominal da dívida, exceto nos instrumentos emitidos a desconto, como os Bilhetes do Tesouro, que entram pelo valor descontado. A dívida em moeda estrangeira é convertida ao câmbio do fim do período."
      ],
      "en": [
        "It is the amount still owed at the end of August on debt issued by the State. This is State direct debt in public accounts, not the Maastricht debt of all general government bodies. Maastricht public debt covers all general government bodies and removes debt held by other government bodies. The balance uses the debt’s nominal value, except for instruments issued at a discount, such as Treasury bills, which are included at discounted value. Debt in foreign currency is converted at the end-of-period exchange rate."
      ]
    },
    "origens": []
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
  "emissoes-de-divida-fundada": {
    "nome": {
      "pt": "Emissões de dívida fundada do Estado no ano civil, contabilidade orçamental pública",
      "en": "State funded debt issued during the calendar year, public budget accounts"
    },
    "frase": {
      "pt": [
        "É o dinheiro que o Estado pediu emprestado no ano civil através de dívida fundada. Dívida fundada é a que se contrai para acabar de ser paga num ano orçamental posterior ao da contratação. A contabilidade orçamental pública conta os recebimentos e pagamentos ocorridos no período."
      ],
      "en": [
        "It is the money the State borrowed during the calendar year through funded debt. Funded debt is debt contracted to be fully repaid in a budget year after the year in which it was incurred. Public budget accounts record receipts and payments during the period."
      ]
    },
    "origens": []
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
        "É a dívida do início do mandato como a apresenta um relatório de gestão posterior."
      ],
      "en": [
        "It is the debt at the start of the term as a later management report presents it."
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
        "É o número de pelouros que a página do executivo da câmara atribui a este membro do executivo."
      ],
      "en": [
        "It is the number of portfolios that the council executive’s page assigns to this member of the executive."
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
        "É o número de pelouros que a página do executivo da câmara atribui a este membro do executivo."
      ],
      "en": [
        "It is the number of portfolios that the council executive’s page assigns to this member of the executive."
      ]
    }
  },
  "evora-pelouros-2025-presidente": {
    "frase": {
      "pt": [
        "É o número de pelouros que a página do executivo da câmara atribui a este membro do executivo."
      ],
      "en": [
        "It is the number of portfolios that the council executive’s page assigns to this member of the executive."
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
        "É o número de pelouros que a página do executivo da câmara atribui a este membro do executivo."
      ],
      "en": [
        "It is the number of portfolios that the council executive’s page assigns to this member of the executive."
      ]
    }
  },
  "evora-pelouros-2025-vice-presidente": {
    "frase": {
      "pt": [
        "É o número de pelouros que a página do executivo da câmara atribui a este membro do executivo."
      ],
      "en": [
        "It is the number of portfolios that the council executive’s page assigns to this member of the executive."
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
        "São as verbas contratadas do Plano de Recuperação e Resiliência por beneficiários intermediários e diretos com sede no concelho, pela listagem de entidades do plano."
      ],
      "en": [
        "These are Recovery and Resilience Plan funds contracted by intermediate and direct beneficiaries headquartered in the municipality, from the plan’s list of entities."
      ]
    },
    "instantaneo": true
  },
  "evora-prr-execucao": {
    "frase": {
      "pt": [
        "É a parte das verbas do Plano de Recuperação e Resiliência contratadas por beneficiários intermediários e diretos com sede no concelho que já foi paga."
      ],
      "en": [
        "It is the share of Recovery and Resilience Plan funds contracted by intermediate and direct beneficiaries headquartered in the municipality that has already been paid."
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
        "São as verbas pagas do Plano de Recuperação e Resiliência a beneficiários intermediários e diretos com sede no concelho, pela listagem de entidades do plano."
      ],
      "en": [
        "These are Recovery and Resilience Plan funds paid to intermediate and direct beneficiaries headquartered in the municipality, from the plan’s list of entities."
      ]
    },
    "instantaneo": true
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
        "São as verbas contratadas por beneficiários intermediários e diretos com sede no concelho, com prazo de conclusão anterior ao instantâneo e sem conclusão registada, pela listagem de entidades do Plano de Recuperação e Resiliência."
      ],
      "en": [
        "These are funds contracted by intermediate and direct beneficiaries headquartered in the municipality, with a completion deadline before the snapshot and no completion recorded, from the Recovery and Resilience Plan’s list of entities."
      ]
    },
    "instantaneo": true
  },
  "evora-prr-vencido-quota": {
    "frase": {
      "pt": [
        "É a parte das verbas contratadas por beneficiários intermediários e diretos com sede no concelho em projetos com prazo de conclusão anterior ao instantâneo e sem conclusão registada."
      ],
      "en": [
        "It is the share of funds contracted by intermediate and direct beneficiaries headquartered in the municipality in projects with a completion deadline before the snapshot and no completion recorded."
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
        "É a despesa efetiva da administração central sem a rubrica de juros e outros encargos, a que a fonte chama despesa primária."
      ],
      "en": [
        "It is central administration’s effective expenditure excluding interest and other charges, which the source calls primary expenditure."
      ]
    }
  },
  "execucao-2026-07-diferencas-consolidacao-funcional": {
    "frase": {
      "pt": [
        "É a diferença entre os registos de despesa e de receita das verbas que passam entre entidades, depois de retirar a parte comum aos dois registos, na conta por funções da administração central."
      ],
      "en": [
        "It is the difference between expenditure and revenue records for funds passing between entities, after removing the part common to both records, in central administration’s account by function."
      ]
    }
  },
  "execucao-2026-07-receita-efetiva-administracao-central": {
    "frase": {
      "pt": [
        "É a receita efetiva da administração central: o que ela recebe sem contar os recebimentos de ativos e passivos financeiros nem os saldos de gerência, a diferença entre receita e despesa que vem do ano anterior."
      ],
      "en": [
        "It is central administration’s effective revenue: what it takes in without counting receipts from financial assets and liabilities or carry-over balances, the difference between revenue and expenditure carried forward from the previous year."
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
        "É a receita efetiva da administração central menos a sua despesa efetiva sem juros e outros encargos, a que a fonte chama saldo primário."
      ],
      "en": [
        "It is central administration’s effective revenue minus its effective expenditure excluding interest and other charges, which the source calls primary balance."
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
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem operações com ativos e passivos financeiros nem os fluxos internos ao programa."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: excluding financial asset and liability transactions and flows within the programme."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-002": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem operações com ativos e passivos financeiros nem os fluxos internos ao programa."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: excluding financial asset and liability transactions and flows within the programme."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-003": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem operações com ativos e passivos financeiros nem os fluxos internos ao programa."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: excluding financial asset and liability transactions and flows within the programme."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-004": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem operações com ativos e passivos financeiros nem os fluxos internos ao programa."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: excluding financial asset and liability transactions and flows within the programme."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-005": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem operações com ativos e passivos financeiros nem os fluxos internos ao programa."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: excluding financial asset and liability transactions and flows within the programme."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-006": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem operações com ativos e passivos financeiros nem os fluxos internos ao programa."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: excluding financial asset and liability transactions and flows within the programme."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-007": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem operações com ativos e passivos financeiros nem os fluxos internos ao programa."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: excluding financial asset and liability transactions and flows within the programme."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-008": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem operações com ativos e passivos financeiros nem os fluxos internos ao programa."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: excluding financial asset and liability transactions and flows within the programme."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-009": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem operações com ativos e passivos financeiros nem os fluxos internos ao programa."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: excluding financial asset and liability transactions and flows within the programme."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-010": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem operações com ativos e passivos financeiros nem os fluxos internos ao programa."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: excluding financial asset and liability transactions and flows within the programme."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-011": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem operações com ativos e passivos financeiros nem os fluxos internos ao programa."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: excluding financial asset and liability transactions and flows within the programme."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-012": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem operações com ativos e passivos financeiros nem os fluxos internos ao programa."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: excluding financial asset and liability transactions and flows within the programme."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-013": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem operações com ativos e passivos financeiros nem os fluxos internos ao programa."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: excluding financial asset and liability transactions and flows within the programme."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-014": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem operações com ativos e passivos financeiros nem os fluxos internos ao programa."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: excluding financial asset and liability transactions and flows within the programme."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-015": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem operações com ativos e passivos financeiros nem os fluxos internos ao programa."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: excluding financial asset and liability transactions and flows within the programme."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-016": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem operações com ativos e passivos financeiros nem os fluxos internos ao programa."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: excluding financial asset and liability transactions and flows within the programme."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-017": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem operações com ativos e passivos financeiros nem os fluxos internos ao programa."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: excluding financial asset and liability transactions and flows within the programme."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-018": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem operações com ativos e passivos financeiros nem os fluxos internos ao programa."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: excluding financial asset and liability transactions and flows within the programme."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-019": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem operações com ativos e passivos financeiros nem os fluxos internos ao programa."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: excluding financial asset and liability transactions and flows within the programme."
      ]
    }
  },
  "execucao-2026-08-despesa-programa-020": {
    "frase": {
      "pt": [
        "É o que a administração central gastou neste programa de janeiro a agosto, em despesa efetiva consolidada dentro do programa: sem operações com ativos e passivos financeiros nem os fluxos internos ao programa."
      ],
      "en": [
        "It is what central administration spent on this programme from January to August, in effective expenditure consolidated within the programme: excluding financial asset and liability transactions and flows within the programme."
      ]
    }
  },
  "execucao-2026-08-diferencas-consolidacao-programas": {
    "frase": {
      "pt": [
        "É a diferença entre os registos de despesa e de receita das verbas que passam entre entidades, depois de retirar a parte comum aos dois registos, na conta dos programas da administração central, de janeiro a agosto."
      ],
      "en": [
        "It is the difference between expenditure and revenue records for funds passing between entities, after removing the part common to both records, in the account of central administration programmes from January to August."
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
        "É o que a administração central e a segurança social receberam de novos passivos financeiros, menos o que amortizaram."
      ],
      "en": [
        "It is what central administration and social security received from new financial liabilities, less what they repaid."
      ]
    }
  },
  "execucao-2026-08-receita-efetiva-administracao-central": {
    "frase": {
      "pt": [
        "É a receita efetiva da administração central: o que ela recebe sem contar os recebimentos de ativos e passivos financeiros nem os saldos de gerência, a diferença entre receita e despesa que vem do ano anterior."
      ],
      "en": [
        "It is central administration’s effective revenue: what it takes in without counting receipts from financial assets and liabilities or carry-over balances, the difference between revenue and expenditure carried forward from the previous year."
      ]
    }
  },
  "execucao-2026-08-receita-efetiva-administracao-central-seguranca-social": {
    "frase": {
      "pt": [
        "É a receita efetiva da administração central e da segurança social: o que recebem sem contar os recebimentos de ativos e passivos financeiros nem os saldos de gerência, a diferença entre receita e despesa que vem do ano anterior."
      ],
      "en": [
        "It is the effective revenue of central administration and social security: what they take in without counting receipts from financial assets and liabilities or carry-over balances, the difference between revenue and expenditure carried forward from the previous year."
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
        "É o saldo global da administração central e da segurança social: a receita efetiva menos a despesa efetiva."
      ],
      "en": [
        "It is the overall balance of central administration and social security: effective revenue minus effective expenditure."
      ]
    }
  },
  "execucao-2026-08-subtotal-programas": {
    "frase": {
      "pt": [
        "É a soma da despesa efetiva consolidada de cada programa da administração central, de janeiro a agosto: cada programa sem os seus fluxos internos."
      ],
      "en": [
        "It is the sum of the consolidated effective expenditure of each central administration programme, from January to August: each programme excluding its internal flows."
      ]
    }
  },
  "factor-sustentabilidade": {
    "frase": {
      "pt": [
        "É o fator que multiplica o montante das pensões de velhice que começam no ano e a que ele se aplica."
      ],
      "en": [
        "It is the factor that multiplies the amount of the old-age pensions that start in the year and to which it applies."
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
        "It is how much consumer prices changed compared with the same month a year earlier, on the harmonised measure used to compare the countries of the European Union; the European Union’s value is an average of the countries, weighted by each country’s weight."
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
  "juros-das-administracoes-publicas": {
    "nome": {
      "pt": "Juros das administrações públicas, contas nacionais",
      "en": "General government interest expenditure, national accounts"
    },
    "frase": {
      "pt": [
        "É a despesa em juros das entidades classificadas nas contas nacionais como administrações públicas, segundo as contas nacionais: a despesa pertence ao ano em que o encargo é assumido, mesmo que seja pago noutro ano. Exclui entidades que entram no saldo da contabilidade pública mas não pertencem às administrações públicas nas contas nacionais."
      ],
      "en": [
        "It is interest expenditure by bodies classified as general government in the national accounts, under national accounts: expenditure belongs to the year in which the cost is incurred, even if it is paid in another year. It excludes bodies counted in the public accounting balance that do not belong to general government in the national accounts."
      ]
    },
    "origens": []
  },
  "juros-das-administracoes-publicas-pib": {
    "nome": {
      "pt": "Juros das administrações públicas em percentagem do PIB, contas nacionais",
      "en": "General government interest expenditure as a share of GDP, national accounts"
    },
    "frase": {
      "pt": [
        "Compara a despesa em juros das administrações públicas com o produto interno bruto do mesmo ano, em percentagem. O produto interno bruto mede o valor dos bens e serviços finais produzidos na economia. A conta usa os montantes da mesma notificação do INE, segundo as contas nacionais: a despesa pertence ao ano em que o encargo é assumido, mesmo que seja pago noutro ano."
      ],
      "en": [
        "It compares general government interest expenditure with gross domestic product for the same year, as a percentage. Gross domestic product measures the value of final goods and services produced in the economy. The calculation uses amounts from the same INE notification, under national accounts: expenditure belongs to the year in which the cost is incurred, even if it is paid in another year."
      ]
    },
    "origens": []
  },
  "juros-das-administracoes-publicas-ue": {
    "nome": {
      "pt": "Juros das administrações públicas na União Europeia, em percentagem do PIB, contas nacionais",
      "en": "General government interest expenditure in the European Union, as a share of GDP, national accounts"
    },
    "frase": {
      "pt": [
        "Compara a despesa em juros das administrações públicas do conjunto da União Europeia com o seu produto interno bruto, em percentagem. O produto interno bruto mede o valor dos bens e serviços finais produzidos na economia. São contas nacionais: a despesa pertence ao período em que o encargo é assumido, mesmo que seja pago noutro período."
      ],
      "en": [
        "It compares general government interest expenditure across the European Union with its gross domestic product, as a percentage. Gross domestic product measures the value of final goods and services produced in the economy. These are national accounts: expenditure belongs to the period in which the cost is incurred, even if it is paid in another period."
      ]
    },
    "origens": []
  },
  "juros-e-outros-encargos-execucao": {
    "nome": {
      "pt": "Juros e outros encargos das administrações públicas, caixa, janeiro a agosto",
      "en": "General government interest and other charges, cash basis, January to August"
    },
    "frase": {
      "pt": [
        "É o dinheiro pago pelas administrações públicas em juros e outros encargos, de janeiro a agosto. O total é consolidado: descontam-se os pagamentos entre as entidades públicas abrangidas. A contabilidade orçamental pública conta os recebimentos e pagamentos ocorridos no período."
      ],
      "en": [
        "It is money paid by general government in interest and other charges from January to August. The total is consolidated: payments between the public bodies covered are removed. Public budget accounts record receipts and payments during the period."
      ]
    },
    "origens": []
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
  "necessidades-brutas-de-financiamento": {
    "nome": {
      "pt": "Necessidades brutas de financiamento do Estado, contabilidade orçamental pública",
      "en": "Gross State financing needs, public budget accounts"
    },
    "frase": {
      "pt": [
        "É o financiamento de que o Estado precisou para cobrir o défice do orçamento e adquirir ativos financeiros, descontando os recebimentos dessas operações e excluindo privatizações, e para reembolsar ou extinguir dívida. O défice é a despesa que excede a receita. Os ativos financeiros incluem títulos, participações e empréstimos. Dívida fundada é a que se contrai para acabar de ser paga num ano orçamental posterior ao da contratação. A contabilidade orçamental pública conta os recebimentos e pagamentos ocorridos no período."
      ],
      "en": [
        "It is the financing the State needed to cover the budget deficit and acquire financial assets, net of receipts from those operations and excluding privatisations, and to repay or extinguish debt. The deficit is expenditure in excess of revenue. Financial assets include securities, equity interests and loans. Funded debt is debt contracted to be fully repaid in a budget year after the year in which it was incurred. Public budget accounts record receipts and payments during the period."
      ]
    },
    "origens": []
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
        "É o que a administração central e a segurança social puseram em ativos financeiros, descontados os reembolsos que receberam (a fonte chama-lhes ativos financeiros líquidos de reembolsos). O valor vem da coluna do Orçamento Inicial de dois mil e vinte e seis, num quadro que apresenta também a execução acumulada de janeiro a agosto."
      ],
      "en": [
        "It is what central administration and social security put into financial assets, less the repayments they received (the source calls them financial assets net of repayments). The value comes from the Initial Budget column for twenty twenty-six, in a table that also presents cumulative execution from January to August."
      ]
    }
  },
  "oe-2026-cem-euros-funcao-01": {
    "frase": {
      "pt": [
        "É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is the amount for this function out of every hundred euros of central administration’s consolidated effective expenditure planned in the Budget: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-cem-euros-funcao-02": {
    "frase": {
      "pt": [
        "É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is the amount for this function out of every hundred euros of central administration’s consolidated effective expenditure planned in the Budget: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-cem-euros-funcao-03": {
    "frase": {
      "pt": [
        "É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is the amount for this function out of every hundred euros of central administration’s consolidated effective expenditure planned in the Budget: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-cem-euros-funcao-04": {
    "frase": {
      "pt": [
        "É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is the amount for this function out of every hundred euros of central administration’s consolidated effective expenditure planned in the Budget: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-cem-euros-funcao-05": {
    "frase": {
      "pt": [
        "É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is the amount for this function out of every hundred euros of central administration’s consolidated effective expenditure planned in the Budget: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-cem-euros-funcao-06": {
    "frase": {
      "pt": [
        "É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is the amount for this function out of every hundred euros of central administration’s consolidated effective expenditure planned in the Budget: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-cem-euros-funcao-07": {
    "frase": {
      "pt": [
        "É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is the amount for this function out of every hundred euros of central administration’s consolidated effective expenditure planned in the Budget: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-cem-euros-funcao-08": {
    "frase": {
      "pt": [
        "É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is the amount for this function out of every hundred euros of central administration’s consolidated effective expenditure planned in the Budget: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-cem-euros-funcao-09": {
    "frase": {
      "pt": [
        "É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is the amount for this function out of every hundred euros of central administration’s consolidated effective expenditure planned in the Budget: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-cem-euros-funcao-10": {
    "frase": {
      "pt": [
        "É quanto vai para esta função em cada cem euros da despesa efetiva consolidada da administração central que o Orçamento prevê: a despesa sem as operações com ativos e passivos financeiros nem as transferências entre os próprios serviços."
      ],
      "en": [
        "It is the amount for this function out of every hundred euros of central administration’s consolidated effective expenditure planned in the Budget: spending without transactions in financial assets and liabilities or transfers between its own services."
      ]
    }
  },
  "oe-2026-cem-euros-ministerio-administracao-interna": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação. O mesmo mapa apresenta o total consolidado como «DESPESA TOTAL CONSOLIDADA»."
      ],
      "en": [
        "It is the amount for this ministry out of every hundred euros of “",
        {
          "termo": "DESPESA TOTAL",
          "lingua": "pt-PT"
        },
        "” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector, the total before consolidation. The same map presents the consolidated total as “",
        {"termo": "DESPESA TOTAL CONSOLIDADA", "lingua": "pt-PT"},
        "”."
      ]
    },
    "origens": [
      "rp4n-total-ministerios",
      "rp4n-mapa-ministerios",
      "rp4n-consolidada-ministerios"
    ]
  },
  "oe-2026-cem-euros-ministerio-agricultura-e-mar": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação. O mesmo mapa apresenta o total consolidado como «DESPESA TOTAL CONSOLIDADA»."
      ],
      "en": [
        "It is the amount for this ministry out of every hundred euros of “",
        {
          "termo": "DESPESA TOTAL",
          "lingua": "pt-PT"
        },
        "” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector, the total before consolidation. The same map presents the consolidated total as “",
        {"termo": "DESPESA TOTAL CONSOLIDADA", "lingua": "pt-PT"},
        "”."
      ]
    },
    "origens": [
      "rp4n-total-ministerios",
      "rp4n-mapa-ministerios",
      "rp4n-consolidada-ministerios"
    ]
  },
  "oe-2026-cem-euros-ministerio-ambiente-e-energia": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação. O mesmo mapa apresenta o total consolidado como «DESPESA TOTAL CONSOLIDADA»."
      ],
      "en": [
        "It is the amount for this ministry out of every hundred euros of “",
        {
          "termo": "DESPESA TOTAL",
          "lingua": "pt-PT"
        },
        "” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector, the total before consolidation. The same map presents the consolidated total as “",
        {"termo": "DESPESA TOTAL CONSOLIDADA", "lingua": "pt-PT"},
        "”."
      ]
    },
    "origens": [
      "rp4n-total-ministerios",
      "rp4n-mapa-ministerios",
      "rp4n-consolidada-ministerios"
    ]
  },
  "oe-2026-cem-euros-ministerio-cultura-juventude-e-desporto": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação. O mesmo mapa apresenta o total consolidado como «DESPESA TOTAL CONSOLIDADA»."
      ],
      "en": [
        "It is the amount for this ministry out of every hundred euros of “",
        {
          "termo": "DESPESA TOTAL",
          "lingua": "pt-PT"
        },
        "” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector, the total before consolidation. The same map presents the consolidated total as “",
        {"termo": "DESPESA TOTAL CONSOLIDADA", "lingua": "pt-PT"},
        "”."
      ]
    },
    "origens": [
      "rp4n-total-ministerios",
      "rp4n-mapa-ministerios",
      "rp4n-consolidada-ministerios"
    ]
  },
  "oe-2026-cem-euros-ministerio-defesa-nacional": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação. O mesmo mapa apresenta o total consolidado como «DESPESA TOTAL CONSOLIDADA»."
      ],
      "en": [
        "It is the amount for this ministry out of every hundred euros of “",
        {
          "termo": "DESPESA TOTAL",
          "lingua": "pt-PT"
        },
        "” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector, the total before consolidation. The same map presents the consolidated total as “",
        {"termo": "DESPESA TOTAL CONSOLIDADA", "lingua": "pt-PT"},
        "”."
      ]
    },
    "origens": [
      "rp4n-total-ministerios",
      "rp4n-mapa-ministerios",
      "rp4n-consolidada-ministerios"
    ]
  },
  "oe-2026-cem-euros-ministerio-economia-e-coesao-territorial": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação. O mesmo mapa apresenta o total consolidado como «DESPESA TOTAL CONSOLIDADA»."
      ],
      "en": [
        "It is the amount for this ministry out of every hundred euros of “",
        {
          "termo": "DESPESA TOTAL",
          "lingua": "pt-PT"
        },
        "” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector, the total before consolidation. The same map presents the consolidated total as “",
        {"termo": "DESPESA TOTAL CONSOLIDADA", "lingua": "pt-PT"},
        "”."
      ]
    },
    "origens": [
      "rp4n-total-ministerios",
      "rp4n-mapa-ministerios",
      "rp4n-consolidada-ministerios"
    ]
  },
  "oe-2026-cem-euros-ministerio-educacao-ciencia-e-inovacao": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação. O mesmo mapa apresenta o total consolidado como «DESPESA TOTAL CONSOLIDADA»."
      ],
      "en": [
        "It is the amount for this ministry out of every hundred euros of “",
        {
          "termo": "DESPESA TOTAL",
          "lingua": "pt-PT"
        },
        "” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector, the total before consolidation. The same map presents the consolidated total as “",
        {"termo": "DESPESA TOTAL CONSOLIDADA", "lingua": "pt-PT"},
        "”."
      ]
    },
    "origens": [
      "rp4n-total-ministerios",
      "rp4n-mapa-ministerios",
      "rp4n-consolidada-ministerios"
    ]
  },
  "oe-2026-cem-euros-ministerio-encargos-gerais-do-estado": {
    "frase": {
      "pt": [
        "É quanto vai para os encargos gerais do Estado em cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação. O mesmo mapa apresenta o total consolidado como «DESPESA TOTAL CONSOLIDADA»."
      ],
      "en": [
        "It is the amount for the general charges of the State out of every hundred euros of “",
        {
          "termo": "DESPESA TOTAL",
          "lingua": "pt-PT"
        },
        "” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector, the total before consolidation. The same map presents the consolidated total as “",
        {"termo": "DESPESA TOTAL CONSOLIDADA", "lingua": "pt-PT"},
        "”."
      ]
    },
    "origens": [
      "rp4n-total-ministerios",
      "rp4n-mapa-ministerios",
      "rp4n-consolidada-ministerios"
    ]
  },
  "oe-2026-cem-euros-ministerio-financas": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação. O mesmo mapa apresenta o total consolidado como «DESPESA TOTAL CONSOLIDADA»."
      ],
      "en": [
        "It is the amount for this ministry out of every hundred euros of “",
        {
          "termo": "DESPESA TOTAL",
          "lingua": "pt-PT"
        },
        "” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector, the total before consolidation. The same map presents the consolidated total as “",
        {"termo": "DESPESA TOTAL CONSOLIDADA", "lingua": "pt-PT"},
        "”."
      ]
    },
    "origens": [
      "rp4n-total-ministerios",
      "rp4n-mapa-ministerios",
      "rp4n-consolidada-ministerios"
    ]
  },
  "oe-2026-cem-euros-ministerio-infraestruturas-e-habitacao": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação. O mesmo mapa apresenta o total consolidado como «DESPESA TOTAL CONSOLIDADA»."
      ],
      "en": [
        "It is the amount for this ministry out of every hundred euros of “",
        {
          "termo": "DESPESA TOTAL",
          "lingua": "pt-PT"
        },
        "” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector, the total before consolidation. The same map presents the consolidated total as “",
        {"termo": "DESPESA TOTAL CONSOLIDADA", "lingua": "pt-PT"},
        "”."
      ]
    },
    "origens": [
      "rp4n-total-ministerios",
      "rp4n-mapa-ministerios",
      "rp4n-consolidada-ministerios"
    ]
  },
  "oe-2026-cem-euros-ministerio-justica": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação. O mesmo mapa apresenta o total consolidado como «DESPESA TOTAL CONSOLIDADA»."
      ],
      "en": [
        "It is the amount for this ministry out of every hundred euros of “",
        {
          "termo": "DESPESA TOTAL",
          "lingua": "pt-PT"
        },
        "” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector, the total before consolidation. The same map presents the consolidated total as “",
        {"termo": "DESPESA TOTAL CONSOLIDADA", "lingua": "pt-PT"},
        "”."
      ]
    },
    "origens": [
      "rp4n-total-ministerios",
      "rp4n-mapa-ministerios",
      "rp4n-consolidada-ministerios"
    ]
  },
  "oe-2026-cem-euros-ministerio-negocios-estrangeiros": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação. O mesmo mapa apresenta o total consolidado como «DESPESA TOTAL CONSOLIDADA»."
      ],
      "en": [
        "It is the amount for this ministry out of every hundred euros of “",
        {
          "termo": "DESPESA TOTAL",
          "lingua": "pt-PT"
        },
        "” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector, the total before consolidation. The same map presents the consolidated total as “",
        {"termo": "DESPESA TOTAL CONSOLIDADA", "lingua": "pt-PT"},
        "”."
      ]
    },
    "origens": [
      "rp4n-total-ministerios",
      "rp4n-mapa-ministerios",
      "rp4n-consolidada-ministerios"
    ]
  },
  "oe-2026-cem-euros-ministerio-presidencia-do-conselho-de-ministros": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação. O mesmo mapa apresenta o total consolidado como «DESPESA TOTAL CONSOLIDADA»."
      ],
      "en": [
        "It is the amount for this ministry out of every hundred euros of “",
        {
          "termo": "DESPESA TOTAL",
          "lingua": "pt-PT"
        },
        "” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector, the total before consolidation. The same map presents the consolidated total as “",
        {"termo": "DESPESA TOTAL CONSOLIDADA", "lingua": "pt-PT"},
        "”."
      ]
    },
    "origens": [
      "rp4n-total-ministerios",
      "rp4n-mapa-ministerios",
      "rp4n-consolidada-ministerios"
    ]
  },
  "oe-2026-cem-euros-ministerio-reforma-do-estado": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação. O mesmo mapa apresenta o total consolidado como «DESPESA TOTAL CONSOLIDADA»."
      ],
      "en": [
        "It is the amount for this ministry out of every hundred euros of “",
        {
          "termo": "DESPESA TOTAL",
          "lingua": "pt-PT"
        },
        "” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector, the total before consolidation. The same map presents the consolidated total as “",
        {"termo": "DESPESA TOTAL CONSOLIDADA", "lingua": "pt-PT"},
        "”."
      ]
    },
    "origens": [
      "rp4n-total-ministerios",
      "rp4n-mapa-ministerios",
      "rp4n-consolidada-ministerios"
    ]
  },
  "oe-2026-cem-euros-ministerio-saude": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação. O mesmo mapa apresenta o total consolidado como «DESPESA TOTAL CONSOLIDADA»."
      ],
      "en": [
        "It is the amount for this ministry out of every hundred euros of “",
        {
          "termo": "DESPESA TOTAL",
          "lingua": "pt-PT"
        },
        "” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector, the total before consolidation. The same map presents the consolidated total as “",
        {"termo": "DESPESA TOTAL CONSOLIDADA", "lingua": "pt-PT"},
        "”."
      ]
    },
    "origens": [
      "rp4n-total-ministerios",
      "rp4n-mapa-ministerios",
      "rp4n-consolidada-ministerios"
    ]
  },
  "oe-2026-cem-euros-ministerio-trabalho-solidariedade-e-seguranca-social": {
    "frase": {
      "pt": [
        "É quanto vai para este ministério em cada cem euros da «DESPESA TOTAL» do mapa relativo à classificação orgânica das despesas do subsetor da Administração Central, o total antes da consolidação. O mesmo mapa apresenta o total consolidado como «DESPESA TOTAL CONSOLIDADA»."
      ],
      "en": [
        "It is the amount for this ministry out of every hundred euros of “",
        {
          "termo": "DESPESA TOTAL",
          "lingua": "pt-PT"
        },
        "” (total expenditure) in the map of expenditure by administrative organisation for the central administration subsector, the total before consolidation. The same map presents the consolidated total as “",
        {"termo": "DESPESA TOTAL CONSOLIDADA", "lingua": "pt-PT"},
        "”."
      ]
    },
    "origens": [
      "rp4n-total-ministerios",
      "rp4n-mapa-ministerios",
      "rp4n-consolidada-ministerios"
    ]
  },
  "oe-2026-despesa-bruta-administracao-central": {
    "frase": {
      "pt": [
        "É a soma de toda a despesa dos serviços da administração central que o Orçamento prevê para o ano."
      ],
      "en": [
        "It is the sum of all the expenditure of central administration services that the Budget plans for the year."
      ]
    }
  },
  "oe-2026-despesa-consolidada-administracao-central": {
    "frase": {
      "pt": [
        "É a despesa total que o Orçamento prevê para o ano, sem os fluxos de dinheiro entre os serviços somados."
      ],
      "en": [
        "It is the total expenditure planned in the Budget for the year, excluding money flows between the services added together."
      ]
    }
  },
  "oe-2026-despesa-consolidada-seguranca-social": {
    "frase": {
      "pt": [
        "É a despesa total que o Orçamento prevê para o ano, sem os fluxos de dinheiro entre os serviços somados."
      ],
      "en": [
        "It is the total expenditure planned in the Budget for the year, excluding money flows between the services added together."
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
        "É a despesa efetiva da administração central e da segurança social, somadas sem as transferências entre os seus serviços: o que gastam sem contar as operações com ativos e passivos financeiros. O valor vem da coluna do Orçamento Inicial de dois mil e vinte e seis, num quadro que apresenta também a execução acumulada de janeiro a agosto."
      ],
      "en": [
        "It is the effective expenditure of central administration and social security, added together without the transfers between their services: what they spend without counting transactions in financial assets and liabilities. The value comes from the Initial Budget column for twenty twenty-six, in a table that also presents cumulative execution from January to August."
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
        "É o que o Orçamento prevê que este ministério gaste num ano."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year."
      ]
    }
  },
  "oe-2026-despesa-ministerio-agricultura-e-mar": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year."
      ]
    }
  },
  "oe-2026-despesa-ministerio-ambiente-e-energia": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year."
      ]
    }
  },
  "oe-2026-despesa-ministerio-cultura-juventude-e-desporto": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year."
      ]
    }
  },
  "oe-2026-despesa-ministerio-defesa-nacional": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year."
      ]
    }
  },
  "oe-2026-despesa-ministerio-economia-e-coesao-territorial": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year."
      ]
    }
  },
  "oe-2026-despesa-ministerio-educacao-ciencia-e-inovacao": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year."
      ]
    }
  },
  "oe-2026-despesa-ministerio-encargos-gerais-do-estado": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê para os encargos gerais do Estado num ano."
      ],
      "en": [
        "It is what the Budget plans for the general charges of the State in a year."
      ]
    }
  },
  "oe-2026-despesa-ministerio-financas": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year."
      ]
    }
  },
  "oe-2026-despesa-ministerio-infraestruturas-e-habitacao": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year."
      ]
    }
  },
  "oe-2026-despesa-ministerio-justica": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year."
      ]
    }
  },
  "oe-2026-despesa-ministerio-negocios-estrangeiros": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year."
      ]
    }
  },
  "oe-2026-despesa-ministerio-presidencia-do-conselho-de-ministros": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year."
      ]
    }
  },
  "oe-2026-despesa-ministerio-reforma-do-estado": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year."
      ]
    }
  },
  "oe-2026-despesa-ministerio-saude": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year."
      ]
    }
  },
  "oe-2026-despesa-ministerio-trabalho-solidariedade-e-seguranca-social": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê que este ministério gaste num ano."
      ],
      "en": [
        "It is what the Budget plans for this ministry to spend in a year."
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
        "É a despesa efetiva da administração central sem a rubrica de juros e outros encargos, a que a fonte chama despesa primária."
      ],
      "en": [
        "It is central administration’s effective expenditure excluding interest and other charges, which the source calls primary expenditure."
      ]
    }
  },
  "oe-2026-despesa-programa-001": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year."
      ]
    }
  },
  "oe-2026-despesa-programa-002": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year."
      ]
    }
  },
  "oe-2026-despesa-programa-003": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year."
      ]
    }
  },
  "oe-2026-despesa-programa-004": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year."
      ]
    }
  },
  "oe-2026-despesa-programa-005": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year."
      ]
    }
  },
  "oe-2026-despesa-programa-006": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year."
      ]
    }
  },
  "oe-2026-despesa-programa-007": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year."
      ]
    }
  },
  "oe-2026-despesa-programa-008": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year."
      ]
    }
  },
  "oe-2026-despesa-programa-009": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year."
      ]
    }
  },
  "oe-2026-despesa-programa-010": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year."
      ]
    }
  },
  "oe-2026-despesa-programa-011": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year."
      ]
    }
  },
  "oe-2026-despesa-programa-012": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year."
      ]
    }
  },
  "oe-2026-despesa-programa-013": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year."
      ]
    }
  },
  "oe-2026-despesa-programa-014": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year."
      ]
    }
  },
  "oe-2026-despesa-programa-015": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year."
      ]
    }
  },
  "oe-2026-despesa-programa-016": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year."
      ]
    }
  },
  "oe-2026-despesa-programa-017": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year."
      ]
    }
  },
  "oe-2026-despesa-programa-018": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year."
      ]
    }
  },
  "oe-2026-despesa-programa-019": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year."
      ]
    }
  },
  "oe-2026-despesa-programa-020": {
    "frase": {
      "pt": [
        "É o que o Orçamento prevê gastar neste programa da administração central num ano."
      ],
      "en": [
        "It is what the Budget plans to spend on this central administration programme in a year."
      ]
    }
  },
  "oe-2026-despesa-total": {
    "frase": {
      "pt": [
        "É a despesa total que o Orçamento prevê para o ano, sem os fluxos de dinheiro entre os serviços somados."
      ],
      "en": [
        "It is the total expenditure planned in the Budget for the year, excluding money flows between the services added together."
      ]
    }
  },
  "oe-2026-diferencas-consolidacao-funcional": {
    "frase": {
      "pt": [
        "É a diferença entre os registos de despesa e de receita das verbas que passam entre entidades, depois de retirar a parte comum aos dois registos, na conta por funções da administração central."
      ],
      "en": [
        "It is the difference between expenditure and revenue records for funds passing between entities, after removing the part common to both records, in central administration’s account by function."
      ]
    }
  },
  "oe-2026-passivos-financeiros-liquidos-administracao-central-seguranca-social": {
    "frase": {
      "pt": [
        "É o que a administração central e a segurança social receberam de novos passivos financeiros, menos o que amortizaram."
      ],
      "en": [
        "It is what central administration and social security received from new financial liabilities, less what they repaid."
      ]
    }
  },
  "oe-2026-receita-bruta-administracao-central": {
    "frase": {
      "pt": [
        "É a soma de toda a receita dos serviços da administração central que o Orçamento prevê para o ano."
      ],
      "en": [
        "It is the sum of all the revenue of central administration services that the Budget plans for the year."
      ]
    }
  },
  "oe-2026-receita-consolidada-administracao-central": {
    "frase": {
      "pt": [
        "É a receita total que o Orçamento prevê para o ano, sem os fluxos de dinheiro entre os serviços somados."
      ],
      "en": [
        "It is the total revenue planned in the Budget for the year, excluding money flows between the services added together."
      ]
    }
  },
  "oe-2026-receita-consolidada-seguranca-social": {
    "frase": {
      "pt": [
        "É a receita total que o Orçamento prevê para o ano, sem os fluxos de dinheiro entre os serviços somados."
      ],
      "en": [
        "It is the total revenue planned in the Budget for the year, excluding money flows between the services added together."
      ]
    }
  },
  "oe-2026-receita-efetiva-administracao-central": {
    "frase": {
      "pt": [
        "É a receita efetiva da administração central: o que ela recebe sem contar os recebimentos de ativos e passivos financeiros nem os saldos de gerência, a diferença entre receita e despesa que vem do ano anterior."
      ],
      "en": [
        "It is central administration’s effective revenue: what it takes in without counting receipts from financial assets and liabilities or carry-over balances, the difference between revenue and expenditure carried forward from the previous year."
      ]
    }
  },
  "oe-2026-receita-efetiva-administracao-central-seguranca-social": {
    "frase": {
      "pt": [
        "É a receita efetiva da administração central e da segurança social: o que recebem sem contar os recebimentos de ativos e passivos financeiros nem os saldos de gerência, a diferença entre receita e despesa que vem do ano anterior. O valor vem da coluna do Orçamento Inicial de dois mil e vinte e seis, num quadro que apresenta também a execução acumulada de janeiro a agosto."
      ],
      "en": [
        "It is the effective revenue of central administration and social security: what they take in without counting receipts from financial assets and liabilities or carry-over balances, the difference between revenue and expenditure carried forward from the previous year. The value comes from the Initial Budget column for twenty twenty-six, in a table that also presents cumulative execution from January to August."
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
        "É o saldo global da administração central e da segurança social: a receita efetiva menos a despesa efetiva."
      ],
      "en": [
        "It is the overall balance of central administration and social security: effective revenue minus effective expenditure."
      ]
    }
  },
  "oe-2026-saldo-primario-administracao-central": {
    "frase": {
      "pt": [
        "É a receita efetiva da administração central menos a sua despesa efetiva sem juros e outros encargos, a que a fonte chama saldo primário."
      ],
      "en": [
        "It is central administration’s effective revenue minus its effective expenditure excluding interest and other charges, which the source calls primary balance."
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
        "É a estimativa preliminar do grupo de trabalho da redução atuarialmente neutra para antecipar a reforma um ano: a redução que, nas contas do grupo, deixa a pessoa sem vantagem financeira esperada entre reformar-se já e adiar a reforma um ano, contando as contribuições que deixam de ser feitas e os direitos que deixam de ser formados. Não é a penalização legal por antecipação."
      ],
      "en": [
        "It is the working group’s preliminary estimate of the actuarially neutral reduction for retiring one year early: the reduction that, in the group’s calculations, leaves the person with no expected financial advantage between retiring now and postponing retirement by one year, including contributions no longer paid and pension rights no longer accrued. It is not the statutory early-retirement penalty."
      ]
    },
    "origens": [
      "pensao-estimativa",
      "pensao-neutralidade",
      "pensao-direitos",
      "pensao-legal"
    ],
    "compara": {
      "a": "penalizacao-legal-um-ano-antecipacao-2026",
      "b": "penalizacao-antecipacao-um-ano-neutra",
      "pt": {
        "antes": " A penalização que a lei aplica por um ano de antecipação, sem o fator de sustentabilidade, é de cerca de ",
        "menor": " e é menor do que a redução atuarialmente neutra de ",
        "maior": " e é maior do que a redução atuarialmente neutra de ",
        "igual": " e é igual à redução atuarialmente neutra de ",
        "depois": "."
      },
      "en": {
        "antes": " The statutory penalty for retiring one year early, excluding the sustainability factor, is about ",
        "menor": " and is lower than the actuarially neutral reduction of ",
        "maior": " and is higher than the actuarially neutral reduction of ",
        "igual": " and is equal to the actuarially neutral reduction of ",
        "depois": "."
      },
      "apoios": [
        {
          "origem": "pensao-legal",
          "campo": "excerto",
          "literal": "equivalente a cerca de 6% por ano"
        }
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
  "penalizacao-legal-um-ano-antecipacao": {
    "frase": {
      "pt": [
        "É a penalização legal por antecipar a reforma um ano, sem o fator de sustentabilidade, apresentada como aproximada pelo relatório do grupo de trabalho."
      ],
      "en": [
        "It is the statutory penalty for retiring one year early, excluding the sustainability factor, presented as approximate by the working group’s report."
      ]
    }
  },
  "pensao-media-anual": {
    "cartao": "pensao-media-anual-2025"
  },
  "pib-nominal-notificacao-setembro": {
    "nome": {
      "pt": "PIB de Portugal a preços de mercado, contas nacionais",
      "en": "Portugal’s GDP at market prices, national accounts"
    },
    "frase": {
      "pt": [
        "É o valor dos bens e serviços finais produzidos na economia portuguesa durante o ano, o produto interno bruto, a preços de mercado, nas contas nacionais enviadas pelo INE ao Eurostat em setembro."
      ],
      "en": [
        "It is the value of final goods and services produced in the Portuguese economy during the year, gross domestic product at market prices, in the national accounts sent by INE to Eurostat in September."
      ]
    },
    "origens": []
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

/**
 * AS LINHAS CUJA FRASE ESTÁ POR CONFIRMAR NA FONTE (passagem R4-b, 06.10.2026): uma parte da frase que nem a fonte nem a
 * conta declarada de uma linha calculada dizem (só o nome do projeto, a ressalva da casa ou a explicação de um termo). O
 * recibo dessas linhas é recusado pela K17 e pelo portão HTML. O RP4-n conserva a lista como alarme, que tem de ficar vazio.
 */
/** @type {string[]} */
export const LINHAS_POR_CONFIRMAR_NA_FONTE = [];

// V2A: declarações acrescentadas pelo compositor próprio.
Object.assign(FAMILIAS_DAS_LINHAS, {
  "afirmacao-leitao-amaro-saude-oe2027-2026-10-09": {
    "nome": {
      "pt": "Afirmação de Leitão Amaro sobre o orçamento da Saúde sem PRR",
      "en": "Leitão Amaro’s statement about the Health budget excluding the RRP"
    },
    "frase": {
      "pt": [
        "É o aumento do orçamento da Saúde retirando a verba excecional do PRR, nas palavras do ministro da Presidência transcritas pela RTP. PRR é o Plano de Recuperação e Resiliência."
      ],
      "en": [
        "It is the increase in the Health budget excluding exceptional Recovery and Resilience Plan (RRP; PRR in Portuguese) funding, in the Minister of the Presidency’s words transcribed by RTP."
      ]
    },
    "complemento": {
      "pt": [
        " O relatório «",
        {
          "apoio": {
            "origem": "v2a-prr-ciclo",
            "campo": "documento"
          }
        },
        "» (p. ",
        {
          "apoio": {
            "origem": "v2a-prr-ciclo",
            "campo": "pagina_pdf"
          }
        },
        " do PDF) descreve o fim do ciclo extraordinário de financiamento do PRR.",
        " «Consolidada» quer dizer que o quadro ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " do relatório retira os pagamentos entre as entidades do próprio programa (vendas, juros, transferências, subsídios e operações financeiras entre elas, como a nota do quadro diz), para o mesmo euro não contar duas vezes. «Efetiva» é a despesa sem as operações financeiras, as linhas de ativos e de passivos financeiros que o quadro imprime a seguir; a despesa total inclui-as.",
        " Com o PRR, a despesa efetiva consolidada passa de ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " milhões de euros na estimativa de ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " para ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        " milhões no orçamento para ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        "; sem o PRR, passa de ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026"
        },
        " para ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027"
        },
        " milhões. A diferença entre a despesa com e sem PRR é a parcela do PRR. A redução dessa parcela faz com que a despesa com PRR desça, apesar de a despesa sem PRR subir."
      ],
      "en": [
        " The ",
        {
          "apoio": {
            "origem": "v2a-prr-ciclo",
            "campo": "documento_en"
          }
        },
        " (PDF p. ",
        {
          "apoio": {
            "origem": "v2a-prr-ciclo",
            "campo": "pagina_pdf"
          }
        },
        ") describes the end of the RRP’s exceptional funding cycle.",
        " «Consolidated» means that Table ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " of the report removes payments between the programme's own entities (sales, interest, transfers, subsidies and financial operations between them, as the table's note says), so that the same euro is not counted twice. «Effective» is expenditure without financial operations, the financial assets and liabilities lines the table prints next; total expenditure includes them.",
        " With the RRP, consolidated effective expenditure goes from ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " million euros in the estimate for ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " to ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        " million in the budget for ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        "; excluding the RRP, it goes from ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026"
        },
        " to ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027"
        },
        " million. The difference between expenditure with and without the RRP is the RRP component. The reduction in that component makes expenditure with the RRP fall, even though expenditure without the RRP rises."
      ]
    },
    "origens": [
      "v2a-prr-saude",
      "v2a-prr-ciclo",
      "v2a-saude-consolidada"
    ]
  },
  "afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09": {
    "nome": {
      "pt": "Afirmação de Paulo Raimundo sobre as parcerias rodoviárias",
      "en": "Paulo Raimundo’s statement about road partnerships"
    },
    "frase": {
      "pt": [
        "Na intervenção publicada pelo PCP, Paulo Raimundo afirma: «"
      ],
      "en": [
        "In the speech published by the PCP, Paulo Raimundo states that the budget allocates "
      ]
    },
    "complemento": {
      "pt": [
        {
          "excerto": "afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09"
        },
        "». No relatório «",
        {
          "apoio": {
            "origem": "v2a-ppp-setores",
            "campo": "documento"
          }
        },
        "» (p. ",
        {
          "apoio": {
            "origem": "v2a-ppp-setores",
            "campo": "pagina_pdf"
          }
        },
        " do PDF), o quadro ",
        {
          "apoio": {
            "origem": "v2a-ppp-setores",
            "campo": "quadro"
          }
        },
        " prevê para ",
        {
          "periodo": "oe-2027-ppp-rodoviario-encargos-brutos-2027"
        },
        " encargos brutos rodoviários de ",
        {
          "claim": "oe-2027-ppp-rodoviario-encargos-brutos-2027"
        },
        " milhões de euros: o que o parceiro público (o Estado) paga às parcerias rodoviárias nesse ano, com os pagamentos pela disponibilidade das vias e pelo serviço, os gastos com a cobrança das portagens, as grandes reparações e as compensações aos parceiros privados. Os encargos líquidos são ",
        {
          "claim": "oe-2027-ppp-rodoviario-encargos-liquidos-2027"
        },
        " milhões: o que paga depois de descontar as receitas, que são as portagens cobradas nas vias portajadas (exceto onde pertencem ao parceiro privado), a partilha de benefícios ou de receitas prevista nos contratos e os pagamentos fixos das subconcessionárias (as empresas privadas que exploram as vias), entre as principais componentes que o relatório lista na p. ",
        {
          "apoio": {
            "origem": "v2a-ppp-conta",
            "campo": "pagina_pdf"
          }
        },
        " do PDF. O montante afirmado é superior tanto aos encargos brutos como aos líquidos que o quadro imprime para ",
        {
          "periodo": "oe-2027-ppp-rodoviario-encargos-liquidos-2027"
        },
        "."
      ],
      "en": [
        {
          "claim": "afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09"
        },
        " million euros to road public-private partnerships, in these words: «",
        {
          "excerto": "afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09"
        },
        "». In the ",
        {
          "apoio": {
            "origem": "v2a-ppp-setores",
            "campo": "documento_en"
          }
        },
        " (PDF p. ",
        {
          "apoio": {
            "origem": "v2a-ppp-setores",
            "campo": "pagina_pdf"
          }
        },
        "), Table ",
        {
          "apoio": {
            "origem": "v2a-ppp-setores",
            "campo": "quadro"
          }
        },
        " forecasts gross road charges of ",
        {
          "claim": "oe-2027-ppp-rodoviario-encargos-brutos-2027"
        },
        " million euros for ",
        {
          "periodo": "oe-2027-ppp-rodoviario-encargos-brutos-2027"
        },
        ": what the public partner (the State) pays to road partnerships that year, with availability and service payments, the costs of toll collection, major repairs and compensation to private partners. Net charges are ",
        {
          "claim": "oe-2027-ppp-rodoviario-encargos-liquidos-2027"
        },
        " million: what it pays after deducting revenue, which is the tolls collected on tolled roads (except where they belong to the private partner), the benefit or revenue sharing provided for in the contracts and the fixed payments by subconcessionaires (the private companies that operate the roads), among the main components the report lists on PDF p. ",
        {
          "apoio": {
            "origem": "v2a-ppp-conta",
            "campo": "pagina_pdf"
          }
        },
        ". The stated amount is higher than both the gross and net charges printed in the table for ",
        {
          "periodo": "oe-2027-ppp-rodoviario-encargos-liquidos-2027"
        },
        "."
      ]
    },
    "origens": [
      "v2a-ppp-setores",
      "v2a-ppp-conta"
    ]
  },
  "afirmacao-rtp-saude-queda-oe2027-2026-10-09": {
    "nome": {
      "pt": "Queda do orçamento da Saúde noticiada pela RTP",
      "en": "Health budget decrease reported by RTP"
    },
    "frase": {
      "pt": [
        "É a queda do orçamento da Saúde noticiada pela RTP. Os montantes da notícia identificam a despesa total consolidada do programa Saúde."
      ],
      "en": [
        "It is the Health budget decrease reported by RTP. The article’s amounts identify consolidated total expenditure for the Health programme."
      ]
    },
    "complemento": {
      "pt": [
        " A notícia é de ",
        {
          "periodo": "afirmacao-rtp-saude-queda-oe2027-2026-10-09"
        },
        " e refere-se ao orçamento para ",
        {
          "periodo": "oe-2027-saude-despesa-total-consolidada-2027"
        },
        ".",
        " «Consolidada» quer dizer que o quadro ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " do relatório retira os pagamentos entre as entidades do próprio programa (vendas, juros, transferências, subsídios e operações financeiras entre elas, como a nota do quadro diz), para o mesmo euro não contar duas vezes. «Efetiva» é a despesa sem as operações financeiras, as linhas de ativos e de passivos financeiros que o quadro imprime a seguir; a despesa total inclui-as.",
        " A variação da despesa total consolidada inclui a despesa relativa ao Plano de Recuperação e Resiliência (PRR). Na parte da Saúde, o relatório do Orçamento do Estado para ",
        {
          "periodo": "oe-2027-saude-despesa-total-consolidada-2027"
        },
        " diz que a dotação desse ano é superior à estimativa de ",
        {
          "periodo": "oe-2027-saude-despesa-total-consolidada-2026"
        },
        " expurgada do efeito do PRR."
      ],
      "en": [
        " The article is dated ",
        {
          "periodo": "afirmacao-rtp-saude-queda-oe2027-2026-10-09"
        },
        " and concerns the budget for ",
        {
          "periodo": "oe-2027-saude-despesa-total-consolidada-2027"
        },
        ".",
        " «Consolidated» means that Table ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " of the report removes payments between the programme's own entities (sales, interest, transfers, subsidies and financial operations between them, as the table's note says), so that the same euro is not counted twice. «Effective» is expenditure without financial operations, the financial assets and liabilities lines the table prints next; total expenditure includes them.",
        " The change in consolidated total expenditure includes spending under the Recovery and Resilience Plan (RRP; «PRR» in the table). In its Health section, the Budget report for ",
        {
          "periodo": "oe-2027-saude-despesa-total-consolidada-2027"
        },
        " says that the allocation for that year is higher than the estimate for ",
        {
          "periodo": "oe-2027-saude-despesa-total-consolidada-2026"
        },
        " excluding the RRP effect."
      ]
    },
    "origens": [
      "v2a-prr-saude",
      "v2a-saude-consolidada"
    ]
  },
  "oe-2027-cenario-ihpc": {
    "nome": {
      "pt": "Previsão do Ministério das Finanças para a inflação medida pelo IHPC, transcrita pelo CFP",
      "en": "Ministry of Finance forecast for HICP inflation, transcribed by the CFP"
    },
    "frase": {
      "pt": [
        "É a previsão do Ministério das Finanças para a inflação medida pelo índice harmonizado de preços no consumidor na Proposta de Orçamento do Estado analisada pelo CFP, como o CFP a transcreve. O parecer considera-a pouco provável."
      ],
      "en": [
        "It is the Ministry of Finance forecast for inflation measured by the harmonised index of consumer prices in the Draft State Budget assessed by the CFP, as transcribed by the CFP. The opinion considers it unlikely."
      ]
    },
    "complemento": {
      "pt": [
        " A previsão refere-se a ",
        {
          "periodo": "oe-2027-cenario-ihpc-2026"
        },
        "."
      ],
      "en": [
        " The forecast refers to ",
        {
          "periodo": "oe-2027-cenario-ihpc-2026"
        },
        "."
      ]
    }
  },
  "oe-2027-cenario-pib-real-crescimento": {
    "nome": {
      "pt": "Previsão do Ministério das Finanças para o crescimento real do produto interno bruto, transcrita pelo CFP",
      "en": "Ministry of Finance forecast for real gross domestic product growth, transcribed by the CFP"
    },
    "frase": {
      "pt": [
        "É a previsão do Ministério das Finanças para o crescimento real do produto interno bruto na Proposta de Orçamento do Estado analisada pelo CFP, como o CFP a transcreve. O parecer considera-a superior à de todas as instituições de referência."
      ],
      "en": [
        "It is the Ministry of Finance forecast for real gross domestic product growth in the Draft State Budget assessed by the CFP, as transcribed by the CFP. The opinion considers it higher than those of all reference institutions."
      ]
    },
    "complemento": {
      "pt": [
        " A previsão refere-se a ",
        {
          "periodo": "oe-2027-cenario-pib-real-crescimento-2027"
        },
        "."
      ],
      "en": [
        " The forecast refers to ",
        {
          "periodo": "oe-2027-cenario-pib-real-crescimento-2027"
        },
        "."
      ]
    }
  },
  "oe-2027-ppp-rodoviario-encargos-brutos": {
    "nome": {
      "pt": "Parcerias público-privadas rodoviárias, encargos brutos",
      "en": "Road public-private partnerships, gross charges"
    },
    "frase": {
      "pt": [
        "É o valor previsto para encargos brutos do setor rodoviário no quadro das parcerias público-privadas."
      ],
      "en": [
        "It is the projected value for road sector gross charges in the public-private partnership table."
      ]
    },
    "origens": [
      "v2a-ppp-conta"
    ]
  },
  "oe-2027-ppp-rodoviario-encargos-liquidos": {
    "nome": {
      "pt": "Parcerias público-privadas rodoviárias, encargos líquidos",
      "en": "Road public-private partnerships, net charges"
    },
    "frase": {
      "pt": [
        "É o valor previsto para encargos líquidos do setor rodoviário no quadro das parcerias público-privadas."
      ],
      "en": [
        "It is the projected value for road sector net charges in the public-private partnership table."
      ]
    },
    "origens": [
      "v2a-ppp-conta"
    ]
  },
  "oe-2027-ppp-rodoviario-receitas": {
    "nome": {
      "pt": "Parcerias público-privadas rodoviárias, receitas",
      "en": "Road public-private partnerships, revenue"
    },
    "frase": {
      "pt": [
        "É o valor previsto para receitas do setor rodoviário no quadro das parcerias público-privadas."
      ],
      "en": [
        "It is the projected value for road sector revenue in the public-private partnership table."
      ]
    },
    "origens": [
      "v2a-ppp-conta"
    ]
  },
  "oe-2027-ppp-total-encargos-liquidos": {
    "nome": {
      "pt": "Parcerias público-privadas, total dos encargos líquidos",
      "en": "Public-private partnerships, total net charges"
    },
    "frase": {
      "pt": [
        "É quanto o Estado prevê pagar em "
      ],
      "en": [
        "It is what the State expects to pay in "
      ]
    },
    "complemento": {
      "pt": [
        {
          "periodo": "oe-2027-ppp-total-encargos-liquidos-2027"
        },
        " ao conjunto das parcerias público-privadas, depois de descontar o que recebe delas: a linha «Total» do quadro ",
        {
          "apoio": {
            "origem": "v2a-ppp-setores",
            "campo": "quadro"
          }
        },
        " do relatório, em dinheiro que sai e que entra no ano, em euros de ",
        {
          "periodo": "oe-2027-ppp-total-encargos-liquidos-2027"
        },
        ". O quadro lista cinco setores, como os escreve: «Rodoviário» (estradas), «Ferroviário» (ferrovia), «Saúde» (hospitais), «Aeroportuário» (aeroportos) e «Oceanário». O que o parceiro público (o Estado) paga e recebe nas parcerias rodoviárias está explicado no texto do relatório (p. ",
        {
          "apoio": {
            "origem": "v2a-ppp-conta",
            "campo": "pagina_pdf"
          }
        },
        " do PDF): de um lado, os pagamentos pela disponibilidade das vias e pelo serviço, os gastos com a cobrança das portagens, as grandes reparações e as compensações; do outro, as portagens, a partilha de benefícios ou de receitas e os pagamentos fixos das subconcessionárias (as empresas privadas que exploram as vias)."
      ],
      "en": [
        {
          "periodo": "oe-2027-ppp-total-encargos-liquidos-2027"
        },
        " to all public-private partnerships, after deducting what it receives from them: the «Total» row of Table ",
        {
          "apoio": {
            "origem": "v2a-ppp-setores",
            "campo": "quadro"
          }
        },
        " of the report, in money paid and received in the year, in ",
        {
          "periodo": "oe-2027-ppp-total-encargos-liquidos-2027"
        },
        " euros. The table lists five sectors, as it writes them: «Rodoviário» (roads), «Ferroviário» (railways), «Saúde» (hospitals), «Aeroportuário» (airports) and «Oceanário» (the oceanarium). What the public partner (the State) pays and receives in the road partnerships is explained in the report's text (PDF p. ",
        {
          "apoio": {
            "origem": "v2a-ppp-conta",
            "campo": "pagina_pdf"
          }
        },
        "): on one side, availability and service payments, the costs of toll collection, major repairs and compensation; on the other, tolls, benefit or revenue sharing and the fixed payments by subconcessionaires (the private companies that operate the roads)."
      ]
    },
    "origens": [
      "v2a-ppp-setores",
      "v2a-ppp-conta"
    ]
  },
  "oe-2027-saude-despesa-efetiva-consolidada-2026": {
    "nome": {
      "pt": "Saúde, despesa efetiva consolidada",
      "en": "Health, consolidated effective expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada do quadro da Saúde, «Conta do Pograma Legado», como o quadro o escreve."
      ],
      "en": [
        "It is consolidated effective expenditure in the Health table, «Conta do Pograma Legado», as written in the table."
      ]
    },
    "complemento": {
      "pt": [
        " Refere-se à estimativa de ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        ".",
        " «Consolidada» quer dizer que o quadro ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " do relatório retira os pagamentos entre as entidades do próprio programa (vendas, juros, transferências, subsídios e operações financeiras entre elas, como a nota do quadro diz), para o mesmo euro não contar duas vezes. «Efetiva» é a despesa sem as operações financeiras, as linhas de ativos e de passivos financeiros que o quadro imprime a seguir; a despesa total inclui-as."
      ],
      "en": [
        " It refers to the estimate for ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        ".",
        " «Consolidated» means that Table ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " of the report removes payments between the programme's own entities (sales, interest, transfers, subsidies and financial operations between them, as the table's note says), so that the same euro is not counted twice. «Effective» is expenditure without financial operations, the financial assets and liabilities lines the table prints next; total expenditure includes them."
      ]
    },
    "origens": [
      "v2a-saude-consolidada"
    ]
  },
  "oe-2027-saude-despesa-efetiva-consolidada-2027": {
    "nome": {
      "pt": "Saúde, despesa efetiva consolidada",
      "en": "Health, consolidated effective expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada do quadro da Saúde, «Conta do Pograma Legado», como o quadro o escreve."
      ],
      "en": [
        "It is consolidated effective expenditure in the Health table, «Conta do Pograma Legado», as written in the table."
      ]
    },
    "complemento": {
      "pt": [
        " Refere-se ao orçamento para ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        ".",
        " «Consolidada» quer dizer que o quadro ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " do relatório retira os pagamentos entre as entidades do próprio programa (vendas, juros, transferências, subsídios e operações financeiras entre elas, como a nota do quadro diz), para o mesmo euro não contar duas vezes. «Efetiva» é a despesa sem as operações financeiras, as linhas de ativos e de passivos financeiros que o quadro imprime a seguir; a despesa total inclui-as."
      ],
      "en": [
        " It refers to the budget for ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        ".",
        " «Consolidated» means that Table ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " of the report removes payments between the programme's own entities (sales, interest, transfers, subsidies and financial operations between them, as the table's note says), so that the same euro is not counted twice. «Effective» is expenditure without financial operations, the financial assets and liabilities lines the table prints next; total expenditure includes them."
      ]
    },
    "origens": [
      "v2a-saude-consolidada"
    ]
  },
  "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026": {
    "nome": {
      "pt": "Saúde, despesa efetiva consolidada sem PRR",
      "en": "Health, consolidated effective expenditure excluding the RRP"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada sem PRR do quadro da Saúde, «Conta do Pograma Legado», como o quadro o escreve."
      ],
      "en": [
        "It is consolidated effective expenditure excluding the Recovery and Resilience Plan (RRP; «PRR» in the table) in the Health table, «Conta do Pograma Legado», as written in the table."
      ]
    },
    "complemento": {
      "pt": [
        " Refere-se à estimativa de ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026"
        },
        ".",
        " «Consolidada» quer dizer que o quadro ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " do relatório retira os pagamentos entre as entidades do próprio programa (vendas, juros, transferências, subsídios e operações financeiras entre elas, como a nota do quadro diz), para o mesmo euro não contar duas vezes. «Efetiva» é a despesa sem as operações financeiras, as linhas de ativos e de passivos financeiros que o quadro imprime a seguir; a despesa total inclui-as.",
        " PRR é o Plano de Recuperação e Resiliência. O relatório descreve o fim do seu ciclo extraordinário de financiamento.",
        " Com o PRR, a despesa efetiva consolidada passa de ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " milhões de euros na estimativa de ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " para ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        " milhões no orçamento para ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        "; sem o PRR, passa de ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026"
        },
        " para ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027"
        },
        " milhões. A diferença entre a despesa com e sem PRR é a parcela do PRR. A redução dessa parcela faz com que a despesa com PRR desça, apesar de a despesa sem PRR subir."
      ],
      "en": [
        " It refers to the estimate for ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026"
        },
        ".",
        " «Consolidated» means that Table ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " of the report removes payments between the programme's own entities (sales, interest, transfers, subsidies and financial operations between them, as the table's note says), so that the same euro is not counted twice. «Effective» is expenditure without financial operations, the financial assets and liabilities lines the table prints next; total expenditure includes them.",
        " The report describes the end of the plan’s exceptional funding cycle.",
        " With the RRP, consolidated effective expenditure goes from ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " million euros in the estimate for ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " to ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        " million in the budget for ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        "; excluding the RRP, it goes from ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026"
        },
        " to ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027"
        },
        " million. The difference between expenditure with and without the RRP is the RRP component. The reduction in that component makes expenditure with the RRP fall, even though expenditure without the RRP rises."
      ]
    },
    "origens": [
      "v2a-saude-consolidada",
      "v2a-prr-saude",
      "v2a-prr-ciclo"
    ]
  },
  "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027": {
    "nome": {
      "pt": "Saúde, despesa efetiva consolidada sem PRR",
      "en": "Health, consolidated effective expenditure excluding the RRP"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada sem PRR do quadro da Saúde, «Conta do Pograma Legado», como o quadro o escreve."
      ],
      "en": [
        "It is consolidated effective expenditure excluding the Recovery and Resilience Plan (RRP; «PRR» in the table) in the Health table, «Conta do Pograma Legado», as written in the table."
      ]
    },
    "complemento": {
      "pt": [
        " Refere-se ao orçamento para ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027"
        },
        ".",
        " «Consolidada» quer dizer que o quadro ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " do relatório retira os pagamentos entre as entidades do próprio programa (vendas, juros, transferências, subsídios e operações financeiras entre elas, como a nota do quadro diz), para o mesmo euro não contar duas vezes. «Efetiva» é a despesa sem as operações financeiras, as linhas de ativos e de passivos financeiros que o quadro imprime a seguir; a despesa total inclui-as.",
        " PRR é o Plano de Recuperação e Resiliência. O relatório descreve o fim do seu ciclo extraordinário de financiamento.",
        " Com o PRR, a despesa efetiva consolidada passa de ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " milhões de euros na estimativa de ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " para ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        " milhões no orçamento para ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        "; sem o PRR, passa de ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026"
        },
        " para ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027"
        },
        " milhões. A diferença entre a despesa com e sem PRR é a parcela do PRR. A redução dessa parcela faz com que a despesa com PRR desça, apesar de a despesa sem PRR subir."
      ],
      "en": [
        " It refers to the budget for ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027"
        },
        ".",
        " «Consolidated» means that Table ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " of the report removes payments between the programme's own entities (sales, interest, transfers, subsidies and financial operations between them, as the table's note says), so that the same euro is not counted twice. «Effective» is expenditure without financial operations, the financial assets and liabilities lines the table prints next; total expenditure includes them.",
        " The report describes the end of the plan’s exceptional funding cycle.",
        " With the RRP, consolidated effective expenditure goes from ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " million euros in the estimate for ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " to ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        " million in the budget for ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        "; excluding the RRP, it goes from ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026"
        },
        " to ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027"
        },
        " million. The difference between expenditure with and without the RRP is the RRP component. The reduction in that component makes expenditure with the RRP fall, even though expenditure without the RRP rises."
      ]
    },
    "origens": [
      "v2a-saude-consolidada",
      "v2a-prr-saude",
      "v2a-prr-ciclo"
    ]
  },
  "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-variacao": {
    "nome": {
      "pt": "Saúde, despesa efetiva consolidada sem PRR, variação publicada",
      "en": "Health, consolidated effective expenditure excluding the RRP, published change"
    },
    "frase": {
      "pt": [
        "É a variação publicada da despesa efetiva consolidada sem PRR do quadro da Saúde, «Conta do Pograma Legado», como o quadro o escreve."
      ],
      "en": [
        "It is the published change in consolidated effective expenditure excluding the Recovery and Resilience Plan (RRP; «PRR» in the table) in the Health table, «Conta do Pograma Legado», as written in the table."
      ]
    },
    "complemento": {
      "pt": [
        " Compara a estimativa de ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026"
        },
        " com o orçamento para ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-variacao"
        },
        ".",
        " «Consolidada» quer dizer que o quadro ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " do relatório retira os pagamentos entre as entidades do próprio programa (vendas, juros, transferências, subsídios e operações financeiras entre elas, como a nota do quadro diz), para o mesmo euro não contar duas vezes. «Efetiva» é a despesa sem as operações financeiras, as linhas de ativos e de passivos financeiros que o quadro imprime a seguir; a despesa total inclui-as.",
        " PRR é o Plano de Recuperação e Resiliência. O relatório descreve o fim do seu ciclo extraordinário de financiamento.",
        " Com o PRR, a despesa efetiva consolidada passa de ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " milhões de euros na estimativa de ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " para ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        " milhões no orçamento para ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        "; sem o PRR, passa de ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026"
        },
        " para ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027"
        },
        " milhões. A diferença entre a despesa com e sem PRR é a parcela do PRR. A redução dessa parcela faz com que a despesa com PRR desça, apesar de a despesa sem PRR subir."
      ],
      "en": [
        " It compares the estimate for ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026"
        },
        " with the budget for ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-variacao"
        },
        ".",
        " «Consolidated» means that Table ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " of the report removes payments between the programme's own entities (sales, interest, transfers, subsidies and financial operations between them, as the table's note says), so that the same euro is not counted twice. «Effective» is expenditure without financial operations, the financial assets and liabilities lines the table prints next; total expenditure includes them.",
        " The report describes the end of the plan’s exceptional funding cycle.",
        " With the RRP, consolidated effective expenditure goes from ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " million euros in the estimate for ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " to ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        " million in the budget for ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        "; excluding the RRP, it goes from ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026"
        },
        " to ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027"
        },
        " million. The difference between expenditure with and without the RRP is the RRP component. The reduction in that component makes expenditure with the RRP fall, even though expenditure without the RRP rises."
      ]
    },
    "origens": [
      "v2a-saude-consolidada",
      "v2a-prr-saude",
      "v2a-prr-ciclo"
    ]
  },
  "oe-2027-saude-despesa-efetiva-consolidada-variacao": {
    "nome": {
      "pt": "Saúde, despesa efetiva consolidada, variação publicada",
      "en": "Health, consolidated effective expenditure, published change"
    },
    "frase": {
      "pt": [
        "É a variação publicada da despesa efetiva consolidada do quadro da Saúde, «Conta do Pograma Legado», como o quadro o escreve."
      ],
      "en": [
        "It is the published change in consolidated effective expenditure in the Health table, «Conta do Pograma Legado», as written in the table."
      ]
    },
    "complemento": {
      "pt": [
        " Compara a estimativa de ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " com o orçamento para ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-variacao"
        },
        ".",
        " «Consolidada» quer dizer que o quadro ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " do relatório retira os pagamentos entre as entidades do próprio programa (vendas, juros, transferências, subsídios e operações financeiras entre elas, como a nota do quadro diz), para o mesmo euro não contar duas vezes. «Efetiva» é a despesa sem as operações financeiras, as linhas de ativos e de passivos financeiros que o quadro imprime a seguir; a despesa total inclui-as.",
        " PRR é o Plano de Recuperação e Resiliência. O relatório descreve o fim do seu ciclo extraordinário de financiamento.",
        " Com o PRR, a despesa efetiva consolidada passa de ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " milhões de euros na estimativa de ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " para ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        " milhões no orçamento para ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        "; sem o PRR, passa de ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026"
        },
        " para ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027"
        },
        " milhões. A diferença entre a despesa com e sem PRR é a parcela do PRR. A redução dessa parcela faz com que a despesa com PRR desça, apesar de a despesa sem PRR subir."
      ],
      "en": [
        " It compares the estimate for ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " with the budget for ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-variacao"
        },
        ".",
        " «Consolidated» means that Table ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " of the report removes payments between the programme's own entities (sales, interest, transfers, subsidies and financial operations between them, as the table's note says), so that the same euro is not counted twice. «Effective» is expenditure without financial operations, the financial assets and liabilities lines the table prints next; total expenditure includes them.",
        " The report describes the end of the exceptional funding cycle of the Recovery and Resilience Plan (RRP; «PRR» in the table).",
        " With the RRP, consolidated effective expenditure goes from ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " million euros in the estimate for ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2026"
        },
        " to ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        " million in the budget for ",
        {
          "periodo": "oe-2027-saude-despesa-efetiva-consolidada-2027"
        },
        "; excluding the RRP, it goes from ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026"
        },
        " to ",
        {
          "claim": "oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027"
        },
        " million. The difference between expenditure with and without the RRP is the RRP component. The reduction in that component makes expenditure with the RRP fall, even though expenditure without the RRP rises."
      ]
    },
    "origens": [
      "v2a-saude-consolidada",
      "v2a-prr-saude",
      "v2a-prr-ciclo"
    ]
  },
  "oe-2027-saude-despesa-total-consolidada-2026": {
    "nome": {
      "pt": "Saúde, despesa total consolidada",
      "en": "Health, consolidated total expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa total consolidada do quadro da Saúde, «Conta do Pograma Legado», como o quadro o escreve."
      ],
      "en": [
        "It is consolidated total expenditure in the Health table, «Conta do Pograma Legado», as written in the table."
      ]
    },
    "complemento": {
      "pt": [
        " Refere-se à estimativa de ",
        {
          "periodo": "oe-2027-saude-despesa-total-consolidada-2026"
        },
        ".",
        " «Consolidada» quer dizer que o quadro ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " do relatório retira os pagamentos entre as entidades do próprio programa (vendas, juros, transferências, subsídios e operações financeiras entre elas, como a nota do quadro diz), para o mesmo euro não contar duas vezes. «Efetiva» é a despesa sem as operações financeiras, as linhas de ativos e de passivos financeiros que o quadro imprime a seguir; a despesa total inclui-as."
      ],
      "en": [
        " It refers to the estimate for ",
        {
          "periodo": "oe-2027-saude-despesa-total-consolidada-2026"
        },
        ".",
        " «Consolidated» means that Table ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " of the report removes payments between the programme's own entities (sales, interest, transfers, subsidies and financial operations between them, as the table's note says), so that the same euro is not counted twice. «Effective» is expenditure without financial operations, the financial assets and liabilities lines the table prints next; total expenditure includes them."
      ]
    },
    "origens": [
      "v2a-saude-consolidada"
    ]
  },
  "oe-2027-saude-despesa-total-consolidada-2027": {
    "nome": {
      "pt": "Saúde, despesa total consolidada",
      "en": "Health, consolidated total expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa total consolidada do quadro da Saúde, «Conta do Pograma Legado», como o quadro o escreve."
      ],
      "en": [
        "It is consolidated total expenditure in the Health table, «Conta do Pograma Legado», as written in the table."
      ]
    },
    "complemento": {
      "pt": [
        " Refere-se ao orçamento para ",
        {
          "periodo": "oe-2027-saude-despesa-total-consolidada-2027"
        },
        ".",
        " «Consolidada» quer dizer que o quadro ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " do relatório retira os pagamentos entre as entidades do próprio programa (vendas, juros, transferências, subsídios e operações financeiras entre elas, como a nota do quadro diz), para o mesmo euro não contar duas vezes. «Efetiva» é a despesa sem as operações financeiras, as linhas de ativos e de passivos financeiros que o quadro imprime a seguir; a despesa total inclui-as."
      ],
      "en": [
        " It refers to the budget for ",
        {
          "periodo": "oe-2027-saude-despesa-total-consolidada-2027"
        },
        ".",
        " «Consolidated» means that Table ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " of the report removes payments between the programme's own entities (sales, interest, transfers, subsidies and financial operations between them, as the table's note says), so that the same euro is not counted twice. «Effective» is expenditure without financial operations, the financial assets and liabilities lines the table prints next; total expenditure includes them."
      ]
    },
    "origens": [
      "v2a-saude-consolidada"
    ]
  },
  "oe-2027-saude-despesa-total-consolidada-variacao": {
    "nome": {
      "pt": "Saúde, despesa total consolidada, variação publicada",
      "en": "Health, consolidated total expenditure, published change"
    },
    "frase": {
      "pt": [
        "É a variação publicada da despesa total consolidada do quadro da Saúde, «Conta do Pograma Legado», como o quadro o escreve."
      ],
      "en": [
        "It is the published change in consolidated total expenditure in the Health table, «Conta do Pograma Legado», as written in the table."
      ]
    },
    "complemento": {
      "pt": [
        " Compara a estimativa de ",
        {
          "periodo": "oe-2027-saude-despesa-total-consolidada-2026"
        },
        " com o orçamento para ",
        {
          "periodo": "oe-2027-saude-despesa-total-consolidada-variacao"
        },
        ".",
        " «Consolidada» quer dizer que o quadro ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " do relatório retira os pagamentos entre as entidades do próprio programa (vendas, juros, transferências, subsídios e operações financeiras entre elas, como a nota do quadro diz), para o mesmo euro não contar duas vezes. «Efetiva» é a despesa sem as operações financeiras, as linhas de ativos e de passivos financeiros que o quadro imprime a seguir; a despesa total inclui-as.",
        " A variação da despesa total consolidada inclui a despesa relativa ao Plano de Recuperação e Resiliência (PRR). Na parte da Saúde, o relatório do Orçamento do Estado para ",
        {
          "periodo": "oe-2027-saude-despesa-total-consolidada-2027"
        },
        " diz que a dotação desse ano é superior à estimativa de ",
        {
          "periodo": "oe-2027-saude-despesa-total-consolidada-2026"
        },
        " expurgada do efeito do PRR."
      ],
      "en": [
        " It compares the estimate for ",
        {
          "periodo": "oe-2027-saude-despesa-total-consolidada-2026"
        },
        " with the budget for ",
        {
          "periodo": "oe-2027-saude-despesa-total-consolidada-variacao"
        },
        ".",
        " «Consolidated» means that Table ",
        {
          "apoio": {
            "origem": "v2a-saude-consolidada",
            "campo": "quadro"
          }
        },
        " of the report removes payments between the programme's own entities (sales, interest, transfers, subsidies and financial operations between them, as the table's note says), so that the same euro is not counted twice. «Effective» is expenditure without financial operations, the financial assets and liabilities lines the table prints next; total expenditure includes them.",
        " The change in consolidated total expenditure includes spending under the Recovery and Resilience Plan (RRP; «PRR» in the table). In its Health section, the Budget report for ",
        {
          "periodo": "oe-2027-saude-despesa-total-consolidada-2027"
        },
        " says that the allocation for that year is higher than the estimate for ",
        {
          "periodo": "oe-2027-saude-despesa-total-consolidada-2026"
        },
        " excluding the RRP effect."
      ]
    },
    "origens": [
      "v2a-saude-consolidada",
      "v2a-prr-saude"
    ]
  }
});
