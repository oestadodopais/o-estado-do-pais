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
  "nato-cimeira-haia-2025": {
  "nome": {
    "pt": "Cimeira de Haia em que a NATO assumiu o compromisso",
    "en": "Hague Summit at which NATO made the commitment"
  },
  "frase": {
    "pt": [
      "É a cimeira de Haia em que os aliados assumiram o compromisso anual de investimento em defesa; o período indica o ano da cimeira."
    ],
    "en": [
      "It is the Hague Summit at which Allies made the annual defence investment commitment; the reference period gives the year of the summit."
    ]
  },
  "origens": []
},
  "nato-compromisso-haia-essencial-2035": {
  "nome": {
    "pt": "Compromisso da NATO para requisitos essenciais de defesa",
    "en": "NATO commitment for core defence requirements"
  },
  "frase": {
    "pt": [
      "É a percentagem mínima do PIB acordada para os requisitos essenciais de defesa e as metas de capacidades da NATO, pela definição de despesa em defesa da NATO."
    ],
    "en": [
      "It is the minimum share of GDP agreed for core defence requirements and NATO Capability Targets, under NATO’s definition of defence expenditure."
    ]
  },
  "origens": []
},
  "nato-compromisso-haia-2035": {
  "nome": {
    "pt": "Compromisso anual da NATO na cimeira de Haia",
    "en": "Annual NATO commitment at the Hague Summit"
  },
  "frase": {
    "pt": [
      "É a percentagem do PIB que os aliados se comprometeram a investir anualmente em defesa, até ao prazo indicado, na cimeira de Haia."
    ],
    "en": [
      "It is the share of GDP that Allies committed to investing annually on defence by the stated deadline at the Hague Summit."
    ]
  },
  "origens": []
},
  "nato-compromisso-gales-2014": {
  "nome": {
    "pt": "Compromisso da NATO na cimeira de Gales",
    "en": "NATO commitment at the Wales Summit"
  },
  "frase": {
    "pt": [
      "É a percentagem do PIB nacional que os aliados acordaram destinar à defesa na cimeira de Gales."
    ],
    "en": [
      "It is the share of national GDP that Allies agreed to commit to defence spending at the Wales Summit."
    ]
  },
  "origens": []
},
  "nato-defesa-portugal-pib-2024": {
  "nome": {
    "pt": "Despesa em defesa de Portugal, em percentagem do PIB, pela NATO",
    "en": "Portugal’s defence expenditure as a share of GDP, according to NATO"
  },
  "frase": {
    "pt": [
      "É o valor que a NATO publica para a despesa em defesa de Portugal, pelos pagamentos do governo nacional aliado, sem as administrações regionais e locais. A percentagem usa o PIB real, na tabela a preços constantes."
    ],
    "en": [
      "It is the value NATO publishes for Portugal’s defence expenditure, covering payments by the Allied national government, excluding regional and local authorities. The percentage uses real GDP, in the table at constant prices."
    ]
  },
  "origens": [
    "nato-definicao-despesa-defesa"
  ]
},
  "nato-defesa-portugal-eur": {
  "nome": {
    "pt": "Despesa em defesa de Portugal, em milhões de euros, pela NATO",
    "en": "Portugal’s defence expenditure in million euros, according to NATO"
  },
  "frase": {
    "pt": [
      "É a estimativa da NATO para a despesa em defesa de Portugal, pelos pagamentos do governo nacional aliado, sem as administrações regionais e locais. O montante é em milhões de euros, na tabela a preços correntes."
    ],
    "en": [
      "It is NATO’s estimate of Portugal’s defence expenditure, covering payments by the Allied national government, excluding regional and local authorities. The amount is in million euros, in the table at current prices."
    ]
  },
  "origens": [
    "nato-definicao-despesa-defesa"
  ]
},
  "nato-defesa-portugal-pib": {
  "nome": {
    "pt": "Despesa em defesa de Portugal, em percentagem do PIB, pela NATO",
    "en": "Portugal’s defence expenditure as a share of GDP, according to NATO"
  },
  "frase": {
    "pt": [
      "É a estimativa da NATO para a despesa em defesa de Portugal, pelos pagamentos do governo nacional aliado, sem as administrações regionais e locais. A percentagem usa o PIB real, na tabela a preços constantes."
    ],
    "en": [
      "It is NATO’s estimate of Portugal’s defence expenditure, covering payments by the Allied national government, excluding regional and local authorities. The percentage uses real GDP, in the table at constant prices."
    ]
  },
  "origens": [
    "nato-definicao-despesa-defesa"
  ]
},
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

// V2D: declarações acrescentadas pelo compositor próprio.
Object.assign(FAMILIAS_DAS_LINHAS, {
  "afirmacao-pcp-paula-investimento-saude-2026-10-12": {
    "nome": {
      "pt": "Afirmação de Paula Santos sobre o investimento na Saúde",
      "en": "Paula Santos’s statement on Health investment"
    },
    "frase": {
      "pt": [
        "É o corte no investimento na Saúde afirmado por Paula Santos."
      ],
      "en": [
        "It is the cut in Health investment stated by Paula Santos."
      ]
    }
  },
  "afirmacao-pcp-paula-ppp-2026-10-12": {
    "nome": {
      "pt": "Afirmação de Paula Santos sobre as parcerias",
      "en": "Paula Santos’s statement on partnerships"
    },
    "frase": {
      "pt": [
        "É o montante referido por Paula Santos como despesa com as parcerias rodoviárias, ferroviárias e da saúde."
      ],
      "en": [
        "It is the amount cited by Paula Santos as expenditure on road, rail and health partnerships."
      ]
    }
  },
  "afirmacao-pcp-ppp-2026-10-15": {
    "nome": {
      "pt": "Afirmação de Paulo Raimundo sobre as parcerias",
      "en": "Paulo Raimundo’s statement on partnerships"
    },
    "frase": {
      "pt": [
        "É o montante referido por Paulo Raimundo como pagamentos do Governo em parcerias público-privadas."
      ],
      "en": [
        "It is the amount cited by Paulo Raimundo as Government payments to public-private partnerships."
      ]
    }
  },
  "der-ambiente-e-energia-prr-2026": {
    "nome": {
      "pt": "Ambiente e energia, parcela do PRR",
      "en": "Environment and energy, RRP component"
    },
    "frase": {
      "pt": [
        "É a diferença entre a despesa efetiva consolidada com e sem PRR na estimativa do programa Ambiente e energia."
      ],
      "en": [
        "It is the difference between consolidated effective expenditure with and without the RRP in the estimate for the Environment and energy programme."
      ]
    }
  },
  "der-coesao-territorial-variacao-sem-prr-pct": {
    "nome": {
      "pt": "Coesão territorial, variação percentual sem PRR",
      "en": "Territorial cohesion, percentage change outside the RRP"
    },
    "frase": {
      "pt": [
        "É a variação percentual da despesa efetiva consolidada sem PRR entre a estimativa e o orçamento seguinte do programa Coesão territorial."
      ],
      "en": [
        "It is the percentage change in consolidated effective expenditure without the RRP between the estimate and the following budget for the Territorial cohesion programme."
      ]
    }
  },
  "der-economia-prr-2026": {
    "nome": {
      "pt": "Economia, parcela do PRR",
      "en": "Economy, RRP component"
    },
    "frase": {
      "pt": [
        "É a diferença entre a despesa efetiva consolidada com e sem PRR na estimativa do programa Economia."
      ],
      "en": [
        "It is the difference between consolidated effective expenditure with and without the RRP in the estimate for the Economy programme."
      ]
    }
  },
  "der-economia-variacao-sem-prr-pct": {
    "nome": {
      "pt": "Economia, variação percentual sem PRR",
      "en": "Economy, percentage change outside the RRP"
    },
    "frase": {
      "pt": [
        "É a variação percentual da despesa efetiva consolidada sem PRR entre a estimativa e o orçamento seguinte do programa Economia."
      ],
      "en": [
        "It is the percentage change in consolidated effective expenditure without the RRP between the estimate and the following budget for the Economy programme."
      ]
    }
  },
  "der-educacao-variacao-sem-prr": {
    "nome": {
      "pt": "Educação, variação absoluta sem PRR",
      "en": "Education, absolute change outside the RRP"
    },
    "frase": {
      "pt": [
        "É a variação absoluta da despesa efetiva consolidada sem PRR entre a estimativa e o orçamento seguinte do programa Educação."
      ],
      "en": [
        "It is the absolute change in consolidated effective expenditure without the RRP between the estimate and the following budget for the Education programme."
      ]
    }
  },
  "der-educacao-variacao-sem-prr-pct": {
    "nome": {
      "pt": "Educação, variação percentual sem PRR",
      "en": "Education, percentage change outside the RRP"
    },
    "frase": {
      "pt": [
        "É a variação percentual da despesa efetiva consolidada sem PRR entre a estimativa e o orçamento seguinte do programa Educação."
      ],
      "en": [
        "It is the percentage change in consolidated effective expenditure without the RRP between the estimate and the following budget for the Education programme."
      ]
    }
  },
  "der-financas-prr-2026": {
    "nome": {
      "pt": "Finanças, parcela do PRR",
      "en": "Finance, RRP component"
    },
    "frase": {
      "pt": [
        "É a diferença entre a despesa efetiva consolidada com e sem PRR na estimativa do programa Finanças."
      ],
      "en": [
        "It is the difference between consolidated effective expenditure with and without the RRP in the estimate for the Finance programme."
      ]
    }
  },
  "der-financas-variacao-sem-prr-pct": {
    "nome": {
      "pt": "Finanças, variação percentual sem PRR",
      "en": "Finance, percentage change outside the RRP"
    },
    "frase": {
      "pt": [
        "É a variação percentual da despesa efetiva consolidada sem PRR entre a estimativa e o orçamento seguinte do programa Finanças."
      ],
      "en": [
        "It is the percentage change in consolidated effective expenditure without the RRP between the estimate and the following budget for the Finance programme."
      ]
    }
  },
  "der-infraestruturas-e-habitacao-prr-2026": {
    "nome": {
      "pt": "Infraestruturas e habitação, parcela do PRR",
      "en": "Infrastructure and housing, RRP component"
    },
    "frase": {
      "pt": [
        "É a diferença entre a despesa efetiva consolidada com e sem PRR na estimativa do programa Infraestruturas e habitação."
      ],
      "en": [
        "It is the difference between consolidated effective expenditure with and without the RRP in the estimate for the Infrastructure and housing programme."
      ]
    }
  },
  "der-infraestruturas-e-habitacao-variacao-sem-prr": {
    "nome": {
      "pt": "Infraestruturas e habitação, variação absoluta sem PRR",
      "en": "Infrastructure and housing, absolute change outside the RRP"
    },
    "frase": {
      "pt": [
        "É a variação absoluta da despesa efetiva consolidada sem PRR entre a estimativa e o orçamento seguinte do programa Infraestruturas e habitação."
      ],
      "en": [
        "It is the absolute change in consolidated effective expenditure without the RRP between the estimate and the following budget for the Infrastructure and housing programme."
      ]
    }
  },
  "der-infraestruturas-e-habitacao-variacao-sem-prr-pct": {
    "nome": {
      "pt": "Infraestruturas e habitação, variação percentual sem PRR",
      "en": "Infrastructure and housing, percentage change outside the RRP"
    },
    "frase": {
      "pt": [
        "É a variação percentual da despesa efetiva consolidada sem PRR entre a estimativa e o orçamento seguinte do programa Infraestruturas e habitação."
      ],
      "en": [
        "It is the percentage change in consolidated effective expenditure without the RRP between the estimate and the following budget for the Infrastructure and housing programme."
      ]
    }
  },
  "der-justica-variacao-sem-prr": {
    "nome": {
      "pt": "Justiça, variação absoluta sem PRR",
      "en": "Justice, absolute change outside the RRP"
    },
    "frase": {
      "pt": [
        "É a variação absoluta da despesa efetiva consolidada sem PRR entre a estimativa e o orçamento seguinte do programa Justiça."
      ],
      "en": [
        "It is the absolute change in consolidated effective expenditure without the RRP between the estimate and the following budget for the Justice programme."
      ]
    }
  },
  "der-justica-variacao-sem-prr-pct": {
    "nome": {
      "pt": "Justiça, variação percentual sem PRR",
      "en": "Justice, percentage change outside the RRP"
    },
    "frase": {
      "pt": [
        "É a variação percentual da despesa efetiva consolidada sem PRR entre a estimativa e o orçamento seguinte do programa Justiça."
      ],
      "en": [
        "It is the percentage change in consolidated effective expenditure without the RRP between the estimate and the following budget for the Justice programme."
      ]
    }
  },
  "der-ppp-brutos-todos-2027": {
    "nome": {
      "pt": "Soma dos encargos brutos rodoviários e dos encargos ferroviários e da saúde",
      "en": "Sum of gross road charges and rail and health charges"
    },
    "frase": {
      "pt": [
        "É a soma dos encargos brutos rodoviários com os encargos ferroviários e da saúde."
      ],
      "en": [
        "It is the sum of gross road charges and rail and health charges."
      ]
    }
  },
  "der-ppp-pcp-vs-brutos": {
    "nome": {
      "pt": "Diferença entre a afirmação do PCP e os encargos rodoviários brutos",
      "en": "Difference between the PCP statement and gross road charges"
    },
    "frase": {
      "pt": [
        "É o montante afirmado pelo PCP menos os encargos brutos rodoviários."
      ],
      "en": [
        "It is the amount stated by the PCP minus gross road charges."
      ]
    }
  },
  "der-ppp-pcp-vs-liquidos": {
    "nome": {
      "pt": "Diferença entre a afirmação do PCP e os encargos rodoviários líquidos",
      "en": "Difference between the PCP statement and net road charges"
    },
    "frase": {
      "pt": [
        "É o montante afirmado pelo PCP menos os encargos líquidos rodoviários."
      ],
      "en": [
        "It is the amount stated by the PCP minus net road charges."
      ]
    }
  },
  "der-ppp-quota-rodoviario": {
    "nome": {
      "pt": "Peso das rodoviárias no total líquido das parcerias",
      "en": "Road share of total net partnership charges"
    },
    "frase": {
      "pt": [
        "É a razão entre os encargos líquidos rodoviários e o total líquido de todos os setores, em percentagem."
      ],
      "en": [
        "It is the ratio of net road charges to total net charges for all sectors, as a percentage."
      ]
    }
  },
  "der-ppp-rodoviario-2027-vs-2021-pct": {
    "nome": {
      "pt": "Variação dos encargos rodoviários orçamentados face à execução anterior",
      "en": "Change in budgeted road charges against earlier execution"
    },
    "frase": {
      "pt": [
        "É a variação percentual entre os encargos líquidos rodoviários orçamentados e a execução anterior identificada nas componentes."
      ],
      "en": [
        "It is the percentage change between budgeted net road charges and the earlier execution identified in the components."
      ]
    }
  },
  "der-saude-2027-vs-execucao-2025-pct": {
    "nome": {
      "pt": "Variação do orçamento da Saúde face à execução anterior",
      "en": "Change in the Health budget against earlier execution"
    },
    "frase": {
      "pt": [
        "É a variação percentual entre a despesa total consolidada orçamentada e a execução anterior identificada nas componentes."
      ],
      "en": [
        "It is the percentage change between budgeted consolidated total expenditure and the earlier execution identified in the components."
      ]
    }
  },
  "der-saude-bens-servicos-reducao-abs": {
    "nome": {
      "pt": "Redução da aquisição de bens e serviços da Saúde",
      "en": "Reduction in Health purchase of goods and services"
    },
    "frase": {
      "pt": [
        "É a estimativa de aquisição de bens e serviços da Saúde menos o orçamento seguinte."
      ],
      "en": [
        "It is estimated Health purchase of goods and services minus the following budget."
      ]
    }
  },
  "der-saude-bens-servicos-variacao-abs": {
    "nome": {
      "pt": "Variação absoluta da aquisição de bens e serviços da Saúde",
      "en": "Absolute change in Health purchase of goods and services"
    },
    "frase": {
      "pt": [
        "É o orçamento de aquisição de bens e serviços da Saúde menos a estimativa do ano anterior."
      ],
      "en": [
        "It is budgeted Health purchase of goods and services minus the preceding year’s estimate."
      ]
    }
  },
  "der-saude-investimento-reducao-abs": {
    "nome": {
      "pt": "Redução do investimento da Saúde",
      "en": "Reduction in Health investment"
    },
    "frase": {
      "pt": [
        "É a estimativa de investimento da Saúde menos o orçamento seguinte."
      ],
      "en": [
        "It is estimated Health investment minus the following budget."
      ]
    }
  },
  "der-saude-investimento-variacao-abs": {
    "nome": {
      "pt": "Variação absoluta do investimento da Saúde",
      "en": "Absolute change in Health investment"
    },
    "frase": {
      "pt": [
        "É o orçamento de investimento da Saúde menos a estimativa do ano anterior."
      ],
      "en": [
        "It is budgeted Health investment minus the preceding year’s estimate."
      ]
    }
  },
  "der-saude-outras-correntes-variacao-abs": {
    "nome": {
      "pt": "Variação absoluta das outras despesas correntes da Saúde",
      "en": "Absolute change in Health other current expenditure"
    },
    "frase": {
      "pt": [
        "É o orçamento de outras despesas correntes da Saúde menos a estimativa do ano anterior."
      ],
      "en": [
        "It is budgeted Health other current expenditure minus the preceding year’s estimate."
      ]
    }
  },
  "der-saude-pessoal-variacao-abs": {
    "nome": {
      "pt": "Variação absoluta das despesas com pessoal da Saúde",
      "en": "Absolute change in Health personnel expenditure"
    },
    "frase": {
      "pt": [
        "É o orçamento de despesas com pessoal da Saúde menos a estimativa do ano anterior."
      ],
      "en": [
        "It is budgeted Health personnel expenditure minus the preceding year’s estimate."
      ]
    }
  },
  "der-saude-prr-2026": {
    "nome": {
      "pt": "Saúde, parcela do PRR",
      "en": "Health, RRP component"
    },
    "frase": {
      "pt": [
        "É a diferença entre a despesa efetiva consolidada com e sem PRR na estimativa do programa Saúde."
      ],
      "en": [
        "It is the difference between consolidated effective expenditure with and without the RRP in the estimate for the Health programme."
      ]
    }
  },
  "der-saude-razao-compensacao-prr": {
    "nome": {
      "pt": "Razão entre o aumento sem PRR e a parcela do PRR que termina",
      "en": "Ratio of the increase outside the RRP to the ending RRP component"
    },
    "frase": {
      "pt": [
        "É o aumento da despesa efetiva sem PRR dividido pela parcela do PRR na estimativa anterior."
      ],
      "en": [
        "It is the increase in effective expenditure outside the RRP divided by the RRP component in the preceding estimate."
      ]
    }
  },
  "der-saude-razao-compensacao-prr-pct": {
    "nome": {
      "pt": "Percentagem da parcela do PRR reposta pelo aumento sem PRR",
      "en": "Percentage of the RRP component replaced by the increase outside the RRP"
    },
    "frase": {
      "pt": [
        "É o aumento da despesa efetiva sem PRR dividido pela parcela do PRR na estimativa anterior, em percentagem."
      ],
      "en": [
        "It is the increase in effective expenditure outside the RRP divided by the RRP component in the preceding estimate, as a percentage."
      ]
    }
  },
  "der-saude-receitas-proprias-variacao-pct": {
    "nome": {
      "pt": "Variação das receitas próprias da Saúde",
      "en": "Change in Health own revenue"
    },
    "frase": {
      "pt": [
        "É a variação percentual das receitas próprias entre os dois orçamentos."
      ],
      "en": [
        "It is the percentage change in own revenue between the two budgets."
      ]
    }
  },
  "der-saude-reforco-total-2026": {
    "nome": {
      "pt": "Diferença entre a estimativa e o orçamento inicial da Saúde",
      "en": "Difference between the Health estimate and initial budget"
    },
    "frase": {
      "pt": [
        "É a estimativa de despesa total consolidada da Saúde menos o orçamento inicial do mesmo ano."
      ],
      "en": [
        "It is estimated consolidated total Health expenditure minus the initial budget for the same year."
      ]
    }
  },
  "der-saude-total-reducao-abs": {
    "nome": {
      "pt": "Redução da despesa total da Saúde",
      "en": "Reduction in total Health expenditure"
    },
    "frase": {
      "pt": [
        "É a estimativa de despesa total consolidada menos o orçamento do ano seguinte."
      ],
      "en": [
        "It is the estimate of consolidated total expenditure minus the following year’s budget."
      ]
    }
  },
  "der-saude-variacao-efetiva": {
    "nome": {
      "pt": "Variação absoluta da despesa efetiva da Saúde",
      "en": "Absolute change in effective Health expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada orçamentada menos a estimativa do ano anterior."
      ],
      "en": [
        "It is budgeted consolidated effective expenditure minus the preceding year’s estimate."
      ]
    }
  },
  "der-saude-variacao-sem-prr": {
    "nome": {
      "pt": "Saúde, variação absoluta sem PRR",
      "en": "Health, absolute change outside the RRP"
    },
    "frase": {
      "pt": [
        "É a variação absoluta da despesa efetiva consolidada sem PRR entre a estimativa e o orçamento seguinte do programa Saúde."
      ],
      "en": [
        "It is the absolute change in consolidated effective expenditure without the RRP between the estimate and the following budget for the Health programme."
      ]
    }
  },
  "der-saude-variacao-sem-prr-pct": {
    "nome": {
      "pt": "Saúde, variação percentual sem PRR",
      "en": "Health, percentage change outside the RRP"
    },
    "frase": {
      "pt": [
        "É a variação percentual da despesa efetiva consolidada sem PRR entre a estimativa e o orçamento seguinte do programa Saúde."
      ],
      "en": [
        "It is the percentage change in consolidated effective expenditure without the RRP between the estimate and the following budget for the Health programme."
      ]
    }
  },
  "der-saude-variacao-total-abs": {
    "nome": {
      "pt": "Variação absoluta da despesa total da Saúde",
      "en": "Absolute change in total Health expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa total consolidada orçamentada menos a estimativa do ano anterior."
      ],
      "en": [
        "It is budgeted consolidated total expenditure minus the preceding year’s estimate."
      ]
    }
  },
  "der-seguranca-interna-variacao-sem-prr": {
    "nome": {
      "pt": "Segurança interna, variação absoluta sem PRR",
      "en": "Internal security, absolute change outside the RRP"
    },
    "frase": {
      "pt": [
        "É a variação absoluta da despesa efetiva consolidada sem PRR entre a estimativa e o orçamento seguinte do programa Segurança interna."
      ],
      "en": [
        "It is the absolute change in consolidated effective expenditure without the RRP between the estimate and the following budget for the Internal security programme."
      ]
    }
  },
  "der-seguranca-interna-variacao-sem-prr-pct": {
    "nome": {
      "pt": "Segurança interna, variação percentual sem PRR",
      "en": "Internal security, percentage change outside the RRP"
    },
    "frase": {
      "pt": [
        "É a variação percentual da despesa efetiva consolidada sem PRR entre a estimativa e o orçamento seguinte do programa Segurança interna."
      ],
      "en": [
        "It is the percentage change in consolidated effective expenditure without the RRP between the estimate and the following budget for the Internal security programme."
      ]
    }
  },
  "der-trabalho-solidariedade-e-seguranca-social-variacao-sem-prr": {
    "nome": {
      "pt": "Trabalho, solidariedade e segurança social, variação absoluta sem PRR",
      "en": "Labour, solidarity and social security, absolute change outside the RRP"
    },
    "frase": {
      "pt": [
        "É a variação absoluta da despesa efetiva consolidada sem PRR entre a estimativa e o orçamento seguinte do programa Trabalho, solidariedade e segurança social."
      ],
      "en": [
        "It is the absolute change in consolidated effective expenditure without the RRP between the estimate and the following budget for the Labour, solidarity and social security programme."
      ]
    }
  },
  "der-trabalho-solidariedade-e-seguranca-social-variacao-sem-prr-pct": {
    "nome": {
      "pt": "Trabalho, solidariedade e segurança social, variação percentual sem PRR",
      "en": "Labour, solidarity and social security, percentage change outside the RRP"
    },
    "frase": {
      "pt": [
        "É a variação percentual da despesa efetiva consolidada sem PRR entre a estimativa e o orçamento seguinte do programa Trabalho, solidariedade e segurança social."
      ],
      "en": [
        "It is the percentage change in consolidated effective expenditure without the RRP between the estimate and the following budget for the Labour, solidarity and social security programme."
      ]
    }
  },
  "der-utao-saude-reforco-2026": {
    "nome": {
      "pt": "Diferença entre a estimativa e o orçamento da Saúde na UTAO",
      "en": "Difference between the Health estimate and budget in the UTAO table"
    },
    "frase": {
      "pt": [
        "É a estimativa de despesa efetiva da Saúde menos o orçamento do mesmo ano, pelas duas linhas da UTAO."
      ],
      "en": [
        "It is estimated effective Health expenditure minus the budget for the same year, using the two UTAO rows."
      ]
    }
  },
  "dgo-2026-08-saude-efetiva-jan-ago-2025": {
    "nome": {
      "pt": "Execução da despesa efetiva da Saúde até agosto",
      "en": "Effective Health expenditure executed to August"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva do programa Saúde acumulada de janeiro a agosto do ano de referência."
      ],
      "en": [
        "It is effective Health programme expenditure accumulated from January to August of the reference year."
      ]
    }
  },
  "dgo-2026-08-saude-efetiva-jan-ago-2026": {
    "nome": {
      "pt": "Execução da despesa efetiva da Saúde até agosto",
      "en": "Effective Health expenditure executed to August"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva do programa Saúde acumulada de janeiro a agosto do ano de referência."
      ],
      "en": [
        "It is effective Health programme expenditure accumulated from January to August of the reference year."
      ]
    }
  },
  "dgo-2026-08-saude-efetiva-variacao-homologa": {
    "nome": {
      "pt": "Variação homóloga da despesa efetiva da Saúde até agosto",
      "en": "Year-on-year change in effective Health expenditure to August"
    },
    "frase": {
      "pt": [
        "É a variação percentual da despesa efetiva do programa Saúde acumulada até agosto face ao mesmo período do ano anterior."
      ],
      "en": [
        "It is the percentage change in effective Health programme expenditure accumulated to August against the same period of the preceding year."
      ]
    }
  },
  "dgo-2026-08-sns-despesa-variacao-homologa": {
    "nome": {
      "pt": "Variação homóloga da despesa do Serviço Nacional de Saúde",
      "en": "Year-on-year change in National Health Service expenditure"
    },
    "frase": {
      "pt": [
        "É a variação percentual da despesa do Serviço Nacional de Saúde acumulada até agosto face ao mesmo período do ano anterior."
      ],
      "en": [
        "It is the percentage change in National Health Service expenditure accumulated to August against the same period of the preceding year."
      ]
    }
  },
  "dgo-2026-08-sns-saldo-jan-ago-2026": {
    "nome": {
      "pt": "Saldo do Serviço Nacional de Saúde até agosto",
      "en": "National Health Service balance to August"
    },
    "frase": {
      "pt": [
        "É o saldo do Serviço Nacional de Saúde acumulado de janeiro a agosto."
      ],
      "en": [
        "It is the National Health Service balance accumulated from January to August."
      ]
    }
  },
  "eurostat-hlth-sha11-hf-a-eur_hab-tot_hf-eu27_2020-2024": {
    "nome": {
      "pt": "Despesa em saúde, União Europeia, em todos os regimes de financiamento, euros por habitante",
      "en": "Health expenditure, European Union, across all financing schemes, euros per inhabitant"
    },
    "frase": {
      "pt": [
        "É a despesa em saúde em todos os regimes de financiamento na União Europeia, expressa em euros por habitante, na série do Eurostat."
      ],
      "en": [
        "It is health expenditure across all financing schemes in the European Union, expressed in euros per inhabitant, in the Eurostat series."
      ]
    }
  },
  "eurostat-hlth-sha11-hf-a-eur_hab-tot_hf-pt-2024": {
    "nome": {
      "pt": "Despesa em saúde, Portugal, em todos os regimes de financiamento, euros por habitante",
      "en": "Health expenditure, Portugal, across all financing schemes, euros per inhabitant"
    },
    "frase": {
      "pt": [
        "É a despesa em saúde em todos os regimes de financiamento em Portugal, expressa em euros por habitante, na série do Eurostat."
      ],
      "en": [
        "It is health expenditure across all financing schemes in Portugal, expressed in euros per inhabitant, in the Eurostat series."
      ]
    }
  },
  "eurostat-hlth-sha11-hf-a-pc_gdp-hf1-eu27_2020-2024": {
    "nome": {
      "pt": "Despesa em saúde, União Europeia, nos regimes públicos e contributivos obrigatórios, percentagem do PIB",
      "en": "Health expenditure, European Union, in government and compulsory contributory schemes, percentage of GDP"
    },
    "frase": {
      "pt": [
        "É a despesa em saúde nos regimes públicos e contributivos obrigatórios na União Europeia, expressa em percentagem do PIB, na série do Eurostat."
      ],
      "en": [
        "It is health expenditure in government and compulsory contributory schemes in the European Union, expressed as a percentage of GDP, in the Eurostat series."
      ]
    }
  },
  "eurostat-hlth-sha11-hf-a-pc_gdp-hf1-pt-2024": {
    "nome": {
      "pt": "Despesa em saúde, Portugal, nos regimes públicos e contributivos obrigatórios, percentagem do PIB",
      "en": "Health expenditure, Portugal, in government and compulsory contributory schemes, percentage of GDP"
    },
    "frase": {
      "pt": [
        "É a despesa em saúde nos regimes públicos e contributivos obrigatórios em Portugal, expressa em percentagem do PIB, na série do Eurostat."
      ],
      "en": [
        "It is health expenditure in government and compulsory contributory schemes in Portugal, expressed as a percentage of GDP, in the Eurostat series."
      ]
    }
  },
  "eurostat-hlth-sha11-hf-a-pc_gdp-tot_hf-eu27_2020-2024": {
    "nome": {
      "pt": "Despesa em saúde, União Europeia, em todos os regimes de financiamento, percentagem do PIB",
      "en": "Health expenditure, European Union, across all financing schemes, percentage of GDP"
    },
    "frase": {
      "pt": [
        "É a despesa em saúde em todos os regimes de financiamento na União Europeia, expressa em percentagem do PIB, na série do Eurostat."
      ],
      "en": [
        "It is health expenditure across all financing schemes in the European Union, expressed as a percentage of GDP, in the Eurostat series."
      ]
    }
  },
  "eurostat-hlth-sha11-hf-a-pc_gdp-tot_hf-pt-2024": {
    "nome": {
      "pt": "Despesa em saúde, Portugal, em todos os regimes de financiamento, percentagem do PIB",
      "en": "Health expenditure, Portugal, across all financing schemes, percentage of GDP"
    },
    "frase": {
      "pt": [
        "É a despesa em saúde em todos os regimes de financiamento em Portugal, expressa em percentagem do PIB, na série do Eurostat."
      ],
      "en": [
        "It is health expenditure across all financing schemes in Portugal, expressed as a percentage of GDP, in the Eurostat series."
      ]
    }
  },
  "oe-2027-ambiente-e-energia-efetiva-2026": {
    "nome": {
      "pt": "Ambiente e energia, despesa efetiva consolidada",
      "en": "Environment and energy, consolidated effective expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada do programa Ambiente e energia, na coluna da estimativa."
      ],
      "en": [
        "It is consolidated effective expenditure for the Environment and energy programme, in the estimate column."
      ]
    }
  },
  "oe-2027-ambiente-e-energia-sem-prr-2026": {
    "nome": {
      "pt": "Ambiente e energia, despesa efetiva consolidada sem PRR",
      "en": "Environment and energy, consolidated effective expenditure excluding the RRP"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada sem PRR do programa Ambiente e energia, na coluna da estimativa."
      ],
      "en": [
        "It is consolidated effective expenditure excluding the RRP for the Environment and energy programme, in the estimate column."
      ]
    }
  },
  "oe-2027-coesao-territorial-sem-prr-2026": {
    "nome": {
      "pt": "Coesão territorial, despesa efetiva consolidada sem PRR",
      "en": "Territorial cohesion, consolidated effective expenditure excluding the RRP"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada sem PRR do programa Coesão territorial, na coluna da estimativa."
      ],
      "en": [
        "It is consolidated effective expenditure excluding the RRP for the Territorial cohesion programme, in the estimate column."
      ]
    }
  },
  "oe-2027-coesao-territorial-sem-prr-2027": {
    "nome": {
      "pt": "Coesão territorial, despesa efetiva consolidada sem PRR",
      "en": "Territorial cohesion, consolidated effective expenditure excluding the RRP"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada sem PRR do programa Coesão territorial, na coluna do orçamento."
      ],
      "en": [
        "It is consolidated effective expenditure excluding the RRP for the Territorial cohesion programme, in the budget column."
      ]
    }
  },
  "oe-2027-economia-efetiva-2026": {
    "nome": {
      "pt": "Economia, despesa efetiva consolidada",
      "en": "Economy, consolidated effective expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada do programa Economia, na coluna da estimativa."
      ],
      "en": [
        "It is consolidated effective expenditure for the Economy programme, in the estimate column."
      ]
    }
  },
  "oe-2027-economia-sem-prr-2026": {
    "nome": {
      "pt": "Economia, despesa efetiva consolidada sem PRR",
      "en": "Economy, consolidated effective expenditure excluding the RRP"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada sem PRR do programa Economia, na coluna da estimativa."
      ],
      "en": [
        "It is consolidated effective expenditure excluding the RRP for the Economy programme, in the estimate column."
      ]
    }
  },
  "oe-2027-economia-sem-prr-2027": {
    "nome": {
      "pt": "Economia, despesa efetiva consolidada sem PRR",
      "en": "Economy, consolidated effective expenditure excluding the RRP"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada sem PRR do programa Economia, na coluna do orçamento."
      ],
      "en": [
        "It is consolidated effective expenditure excluding the RRP for the Economy programme, in the budget column."
      ]
    }
  },
  "oe-2027-educacao-sem-prr-2026": {
    "nome": {
      "pt": "Educação, despesa efetiva consolidada sem PRR",
      "en": "Education, consolidated effective expenditure excluding the RRP"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada sem PRR do programa Educação, na coluna da estimativa."
      ],
      "en": [
        "It is consolidated effective expenditure excluding the RRP for the Education programme, in the estimate column."
      ]
    }
  },
  "oe-2027-educacao-sem-prr-2027": {
    "nome": {
      "pt": "Educação, despesa efetiva consolidada sem PRR",
      "en": "Education, consolidated effective expenditure excluding the RRP"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada sem PRR do programa Educação, na coluna do orçamento."
      ],
      "en": [
        "It is consolidated effective expenditure excluding the RRP for the Education programme, in the budget column."
      ]
    }
  },
  "oe-2027-financas-efetiva-2026": {
    "nome": {
      "pt": "Finanças, despesa efetiva consolidada",
      "en": "Finance, consolidated effective expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada do programa Finanças, na coluna da estimativa."
      ],
      "en": [
        "It is consolidated effective expenditure for the Finance programme, in the estimate column."
      ]
    }
  },
  "oe-2027-financas-sem-prr-2026": {
    "nome": {
      "pt": "Finanças, despesa efetiva consolidada sem PRR",
      "en": "Finance, consolidated effective expenditure excluding the RRP"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada sem PRR do programa Finanças, na coluna da estimativa."
      ],
      "en": [
        "It is consolidated effective expenditure excluding the RRP for the Finance programme, in the estimate column."
      ]
    }
  },
  "oe-2027-financas-sem-prr-2027": {
    "nome": {
      "pt": "Finanças, despesa efetiva consolidada sem PRR",
      "en": "Finance, consolidated effective expenditure excluding the RRP"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada sem PRR do programa Finanças, na coluna do orçamento."
      ],
      "en": [
        "It is consolidated effective expenditure excluding the RRP for the Finance programme, in the budget column."
      ]
    }
  },
  "oe-2027-infraestruturas-e-habitacao-efetiva-2026": {
    "nome": {
      "pt": "Infraestruturas e habitação, despesa efetiva consolidada",
      "en": "Infrastructure and housing, consolidated effective expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada do programa Infraestruturas e habitação, na coluna da estimativa."
      ],
      "en": [
        "It is consolidated effective expenditure for the Infrastructure and housing programme, in the estimate column."
      ]
    }
  },
  "oe-2027-infraestruturas-e-habitacao-sem-prr-2026": {
    "nome": {
      "pt": "Infraestruturas e habitação, despesa efetiva consolidada sem PRR",
      "en": "Infrastructure and housing, consolidated effective expenditure excluding the RRP"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada sem PRR do programa Infraestruturas e habitação, na coluna da estimativa."
      ],
      "en": [
        "It is consolidated effective expenditure excluding the RRP for the Infrastructure and housing programme, in the estimate column."
      ]
    }
  },
  "oe-2027-infraestruturas-e-habitacao-sem-prr-2027": {
    "nome": {
      "pt": "Infraestruturas e habitação, despesa efetiva consolidada sem PRR",
      "en": "Infrastructure and housing, consolidated effective expenditure excluding the RRP"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada sem PRR do programa Infraestruturas e habitação, na coluna do orçamento."
      ],
      "en": [
        "It is consolidated effective expenditure excluding the RRP for the Infrastructure and housing programme, in the budget column."
      ]
    }
  },
  "oe-2027-justica-sem-prr-2026": {
    "nome": {
      "pt": "Justiça, despesa efetiva consolidada sem PRR",
      "en": "Justice, consolidated effective expenditure excluding the RRP"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada sem PRR do programa Justiça, na coluna da estimativa."
      ],
      "en": [
        "It is consolidated effective expenditure excluding the RRP for the Justice programme, in the estimate column."
      ]
    }
  },
  "oe-2027-justica-sem-prr-2027": {
    "nome": {
      "pt": "Justiça, despesa efetiva consolidada sem PRR",
      "en": "Justice, consolidated effective expenditure excluding the RRP"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada sem PRR do programa Justiça, na coluna do orçamento."
      ],
      "en": [
        "It is consolidated effective expenditure excluding the RRP for the Justice programme, in the budget column."
      ]
    }
  },
  "oe-2027-outras-despesas-dotacoes-execucao": {
    "nome": {
      "pt": "Dotações a alocar durante a execução",
      "en": "Appropriations to allocate during execution"
    },
    "frase": {
      "pt": [
        "É a previsão de dotações a alocar a outras entidades durante a execução, nomeadamente na Saúde e na Defesa."
      ],
      "en": [
        "It is the provision of appropriations to allocate to other entities during execution, including Health and Defence."
      ]
    }
  },
  "oe-2027-saude-bens-servicos-2026": {
    "nome": {
      "pt": "Saúde, aquisição de bens e serviços",
      "en": "Health, purchase of goods and services"
    },
    "frase": {
      "pt": [
        "É o valor da aquisição de bens e serviços no quadro do programa Saúde."
      ],
      "en": [
        "It is the value of purchase of goods and services in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-bens-servicos-2027": {
    "nome": {
      "pt": "Saúde, aquisição de bens e serviços",
      "en": "Health, purchase of goods and services"
    },
    "frase": {
      "pt": [
        "É o valor da aquisição de bens e serviços no quadro do programa Saúde."
      ],
      "en": [
        "It is the value of purchase of goods and services in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-bens-servicos-variacao": {
    "nome": {
      "pt": "Saúde, aquisição de bens e serviços, variação publicada",
      "en": "Health, purchase of goods and services, published change"
    },
    "frase": {
      "pt": [
        "É a variação publicada da aquisição de bens e serviços no quadro do programa Saúde."
      ],
      "en": [
        "It is the published change in purchase of goods and services in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-contrato-programa-acss": {
    "nome": {
      "pt": "Contrato-programa entre a ACSS e as entidades do SNS",
      "en": "Contract-programme between ACSS and NHS entities"
    },
    "frase": {
      "pt": [
        "É o contrato-programa entre a ACSS e as entidades do SNS por onde passa o financiamento centralizado."
      ],
      "en": [
        "It is the contract-programme between ACSS and NHS entities through which centralised financing flows."
      ]
    }
  },
  "oe-2027-saude-dotacao-reforco-contratos-programa": {
    "nome": {
      "pt": "Dotação para reforço dos contratos-programa da Saúde",
      "en": "Appropriation to reinforce Health contract-programmes"
    },
    "frase": {
      "pt": [
        "É a dotação para reforço dos contratos-programa da Saúde cuja contratualização ainda decorre."
      ],
      "en": [
        "It is the appropriation to reinforce Health contract-programmes whose contracting is still under way."
      ]
    }
  },
  "oe-2027-saude-fonte-fundos-europeus-2026": {
    "nome": {
      "pt": "Saúde, fundos europeus",
      "en": "Health, European funds"
    },
    "frase": {
      "pt": [
        "É o valor dos fundos europeus no quadro do programa Saúde."
      ],
      "en": [
        "It is the value of European funds in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-fonte-fundos-europeus-2027": {
    "nome": {
      "pt": "Saúde, fundos europeus",
      "en": "Health, European funds"
    },
    "frase": {
      "pt": [
        "É o valor dos fundos europeus no quadro do programa Saúde."
      ],
      "en": [
        "It is the value of European funds in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-fonte-impostos-2026": {
    "nome": {
      "pt": "Saúde, receitas de impostos",
      "en": "Health, tax revenue"
    },
    "frase": {
      "pt": [
        "É o valor das receitas de impostos no quadro do programa Saúde."
      ],
      "en": [
        "It is the value of tax revenue in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-fonte-impostos-2027": {
    "nome": {
      "pt": "Saúde, receitas de impostos",
      "en": "Health, tax revenue"
    },
    "frase": {
      "pt": [
        "É o valor das receitas de impostos no quadro do programa Saúde."
      ],
      "en": [
        "It is the value of tax revenue in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-fonte-receitas-proprias-2026": {
    "nome": {
      "pt": "Saúde, receitas próprias",
      "en": "Health, own revenue"
    },
    "frase": {
      "pt": [
        "É o valor das receitas próprias no quadro do programa Saúde."
      ],
      "en": [
        "It is the value of own revenue in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-fonte-receitas-proprias-2027": {
    "nome": {
      "pt": "Saúde, receitas próprias",
      "en": "Health, own revenue"
    },
    "frase": {
      "pt": [
        "É o valor das receitas próprias no quadro do programa Saúde."
      ],
      "en": [
        "It is the value of own revenue in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-investimento-2026": {
    "nome": {
      "pt": "Saúde, investimento",
      "en": "Health, investment"
    },
    "frase": {
      "pt": [
        "É o valor do investimento no quadro do programa Saúde."
      ],
      "en": [
        "It is the value of investment in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-investimento-2027": {
    "nome": {
      "pt": "Saúde, investimento",
      "en": "Health, investment"
    },
    "frase": {
      "pt": [
        "É o valor do investimento no quadro do programa Saúde."
      ],
      "en": [
        "It is the value of investment in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-investimento-variacao": {
    "nome": {
      "pt": "Saúde, investimento, variação publicada",
      "en": "Health, investment, published change"
    },
    "frase": {
      "pt": [
        "É a variação publicada do investimento no quadro do programa Saúde."
      ],
      "en": [
        "It is the published change in investment in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-investimento-variacao-sem-prr": {
    "nome": {
      "pt": "Saúde, investimento, variação publicada sem PRR",
      "en": "Health, investment, published change excluding the RRP"
    },
    "frase": {
      "pt": [
        "É a variação publicada do investimento sem PRR no quadro do programa Saúde."
      ],
      "en": [
        "It is the published change in investment excluding the RRP in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-outras-correntes-2026": {
    "nome": {
      "pt": "Saúde, outras despesas correntes",
      "en": "Health, other current expenditure"
    },
    "frase": {
      "pt": [
        "É o valor das outras despesas correntes no quadro do programa Saúde."
      ],
      "en": [
        "It is the value of other current expenditure in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-outras-correntes-2027": {
    "nome": {
      "pt": "Saúde, outras despesas correntes",
      "en": "Health, other current expenditure"
    },
    "frase": {
      "pt": [
        "É o valor das outras despesas correntes no quadro do programa Saúde."
      ],
      "en": [
        "It is the value of other current expenditure in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-pessoal-2026": {
    "nome": {
      "pt": "Saúde, despesas com pessoal",
      "en": "Health, personnel expenditure"
    },
    "frase": {
      "pt": [
        "É o valor das despesas com pessoal no quadro do programa Saúde."
      ],
      "en": [
        "It is the value of personnel expenditure in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-pessoal-2027": {
    "nome": {
      "pt": "Saúde, despesas com pessoal",
      "en": "Health, personnel expenditure"
    },
    "frase": {
      "pt": [
        "É o valor das despesas com pessoal no quadro do programa Saúde."
      ],
      "en": [
        "It is the value of personnel expenditure in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-pessoal-variacao": {
    "nome": {
      "pt": "Saúde, despesas com pessoal, variação publicada",
      "en": "Health, personnel expenditure, published change"
    },
    "frase": {
      "pt": [
        "É a variação publicada das despesas com pessoal no quadro do programa Saúde."
      ],
      "en": [
        "It is the published change in personnel expenditure in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-transferencias-capital-2026": {
    "nome": {
      "pt": "Saúde, transferências de capital",
      "en": "Health, capital transfers"
    },
    "frase": {
      "pt": [
        "É o valor das transferências de capital no quadro do programa Saúde."
      ],
      "en": [
        "It is the value of capital transfers in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-transferencias-capital-2027": {
    "nome": {
      "pt": "Saúde, transferências de capital",
      "en": "Health, capital transfers"
    },
    "frase": {
      "pt": [
        "É o valor das transferências de capital no quadro do programa Saúde."
      ],
      "en": [
        "It is the value of capital transfers in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-transferencias-sns-2026": {
    "nome": {
      "pt": "Saúde, transferências para o Serviço Nacional de Saúde",
      "en": "Health, transfers to the National Health Service"
    },
    "frase": {
      "pt": [
        "É o valor das transferências para o Serviço Nacional de Saúde no quadro do programa Saúde."
      ],
      "en": [
        "It is the value of transfers to the National Health Service in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-transferencias-sns-2027": {
    "nome": {
      "pt": "Saúde, transferências para o Serviço Nacional de Saúde",
      "en": "Health, transfers to the National Health Service"
    },
    "frase": {
      "pt": [
        "É o valor das transferências para o Serviço Nacional de Saúde no quadro do programa Saúde."
      ],
      "en": [
        "It is the value of transfers to the National Health Service in the Health programme table."
      ]
    }
  },
  "oe-2027-saude-transferencias-sns-variacao": {
    "nome": {
      "pt": "Saúde, transferências para o Serviço Nacional de Saúde, variação publicada",
      "en": "Health, transfers to the National Health Service, published change"
    },
    "frase": {
      "pt": [
        "É a variação publicada das transferências para o Serviço Nacional de Saúde no quadro do programa Saúde."
      ],
      "en": [
        "It is the published change in transfers to the National Health Service in the Health programme table."
      ]
    }
  },
  "oe-2027-seguranca-interna-sem-prr-2026": {
    "nome": {
      "pt": "Segurança interna, despesa efetiva consolidada sem PRR",
      "en": "Internal security, consolidated effective expenditure excluding the RRP"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada sem PRR do programa Segurança interna, na coluna da estimativa."
      ],
      "en": [
        "It is consolidated effective expenditure excluding the RRP for the Internal security programme, in the estimate column."
      ]
    }
  },
  "oe-2027-seguranca-interna-sem-prr-2027": {
    "nome": {
      "pt": "Segurança interna, despesa efetiva consolidada sem PRR",
      "en": "Internal security, consolidated effective expenditure excluding the RRP"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada sem PRR do programa Segurança interna, na coluna do orçamento."
      ],
      "en": [
        "It is consolidated effective expenditure excluding the RRP for the Internal security programme, in the budget column."
      ]
    }
  },
  "oe-2027-trabalho-solidariedade-e-seguranca-social-sem-prr-2026": {
    "nome": {
      "pt": "Trabalho, solidariedade e segurança social, despesa efetiva consolidada sem PRR",
      "en": "Labour, solidarity and social security, consolidated effective expenditure excluding the RRP"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada sem PRR do programa Trabalho, solidariedade e segurança social, na coluna da estimativa."
      ],
      "en": [
        "It is consolidated effective expenditure excluding the RRP for the Labour, solidarity and social security programme, in the estimate column."
      ]
    }
  },
  "oe-2027-trabalho-solidariedade-e-seguranca-social-sem-prr-2027": {
    "nome": {
      "pt": "Trabalho, solidariedade e segurança social, despesa efetiva consolidada sem PRR",
      "en": "Labour, solidarity and social security, consolidated effective expenditure excluding the RRP"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva consolidada sem PRR do programa Trabalho, solidariedade e segurança social, na coluna do orçamento."
      ],
      "en": [
        "It is consolidated effective expenditure excluding the RRP for the Labour, solidarity and social security programme, in the budget column."
      ]
    }
  },
  "ppp-oe2022-liquidos-2021": {
    "nome": {
      "pt": "Parcerias, encargos líquidos rodoviários",
      "en": "Partnerships, net road charges"
    },
    "frase": {
      "pt": [
        "São os encargos líquidos rodoviários das parcerias no quadro do relatório do Orçamento."
      ],
      "en": [
        "These are net road partnership charges in the Budget report table."
      ]
    }
  },
  "ppp-oe2023-liquidos-2022": {
    "nome": {
      "pt": "Parcerias, encargos líquidos rodoviários",
      "en": "Partnerships, net road charges"
    },
    "frase": {
      "pt": [
        "São os encargos líquidos rodoviários das parcerias no quadro do relatório do Orçamento."
      ],
      "en": [
        "These are net road partnership charges in the Budget report table."
      ]
    }
  },
  "ppp-oe2024-liquidos-2023": {
    "nome": {
      "pt": "Parcerias, encargos líquidos rodoviários",
      "en": "Partnerships, net road charges"
    },
    "frase": {
      "pt": [
        "São os encargos líquidos rodoviários das parcerias no quadro do relatório do Orçamento."
      ],
      "en": [
        "These are net road partnership charges in the Budget report table."
      ]
    }
  },
  "ppp-oe2025-liquidos-2024": {
    "nome": {
      "pt": "Parcerias, encargos líquidos rodoviários",
      "en": "Partnerships, net road charges"
    },
    "frase": {
      "pt": [
        "São os encargos líquidos rodoviários das parcerias no quadro do relatório do Orçamento."
      ],
      "en": [
        "These are net road partnership charges in the Budget report table."
      ]
    }
  },
  "ppp-oe2026-brutos-2025": {
    "nome": {
      "pt": "Parcerias, encargos brutos rodoviários",
      "en": "Partnerships, gross road charges"
    },
    "frase": {
      "pt": [
        "São os encargos brutos rodoviários das parcerias no quadro do relatório do Orçamento."
      ],
      "en": [
        "These are gross road partnership charges in the Budget report table."
      ]
    }
  },
  "ppp-oe2026-liquidos-2025": {
    "nome": {
      "pt": "Parcerias, encargos líquidos rodoviários",
      "en": "Partnerships, net road charges"
    },
    "frase": {
      "pt": [
        "São os encargos líquidos rodoviários das parcerias no quadro do relatório do Orçamento."
      ],
      "en": [
        "These are net road partnership charges in the Budget report table."
      ]
    }
  },
  "ppp-oe2026-receitas-2025": {
    "nome": {
      "pt": "Parcerias rodoviárias, receitas",
      "en": "Road partnerships, revenue"
    },
    "frase": {
      "pt": [
        "São as receitas previstas para as parcerias rodoviárias no quadro do relatório do Orçamento."
      ],
      "en": [
        "These are forecast revenues for road partnerships in the Budget report table."
      ]
    }
  },
  "ppp-oe2027-brutos-2027": {
    "nome": {
      "pt": "Parcerias, encargos brutos rodoviários",
      "en": "Partnerships, gross road charges"
    },
    "frase": {
      "pt": [
        "São os encargos brutos rodoviários das parcerias no quadro do relatório do Orçamento."
      ],
      "en": [
        "These are gross road partnership charges in the Budget report table."
      ]
    }
  },
  "ppp-oe2027-ferroviario-2027": {
    "nome": {
      "pt": "Parcerias, encargos ferroviários",
      "en": "Partnerships, rail charges"
    },
    "frase": {
      "pt": [
        "São os encargos ferroviários das parcerias no quadro do relatório do Orçamento."
      ],
      "en": [
        "These are rail partnership charges in the Budget report table."
      ]
    }
  },
  "ppp-oe2027-liquidos-2026": {
    "nome": {
      "pt": "Parcerias, encargos líquidos rodoviários",
      "en": "Partnerships, net road charges"
    },
    "frase": {
      "pt": [
        "São os encargos líquidos rodoviários das parcerias no quadro do relatório do Orçamento."
      ],
      "en": [
        "These are net road partnership charges in the Budget report table."
      ]
    }
  },
  "ppp-oe2027-liquidos-2027-previsao-oe2026": {
    "nome": {
      "pt": "Previsão anterior dos encargos líquidos rodoviários",
      "en": "Previous forecast of net road charges"
    },
    "frase": {
      "pt": [
        "É a previsão do relatório anterior para os encargos líquidos rodoviários, citada pelo relatório seguinte para o mesmo ano."
      ],
      "en": [
        "It is the preceding report’s forecast of net road charges, cited by the following report for the same year."
      ]
    }
  },
  "ppp-oe2027-liquidos-2028": {
    "nome": {
      "pt": "Parcerias, encargos líquidos rodoviários",
      "en": "Partnerships, net road charges"
    },
    "frase": {
      "pt": [
        "São os encargos líquidos rodoviários das parcerias no quadro do relatório do Orçamento."
      ],
      "en": [
        "These are net road partnership charges in the Budget report table."
      ]
    }
  },
  "ppp-oe2027-liquidos-2029": {
    "nome": {
      "pt": "Parcerias, encargos líquidos rodoviários",
      "en": "Partnerships, net road charges"
    },
    "frase": {
      "pt": [
        "São os encargos líquidos rodoviários das parcerias no quadro do relatório do Orçamento."
      ],
      "en": [
        "These are net road partnership charges in the Budget report table."
      ]
    }
  },
  "ppp-oe2027-liquidos-2030": {
    "nome": {
      "pt": "Parcerias, encargos líquidos rodoviários",
      "en": "Partnerships, net road charges"
    },
    "frase": {
      "pt": [
        "São os encargos líquidos rodoviários das parcerias no quadro do relatório do Orçamento."
      ],
      "en": [
        "These are net road partnership charges in the Budget report table."
      ]
    }
  },
  "ppp-oe2027-liquidos-2035": {
    "nome": {
      "pt": "Parcerias, encargos líquidos rodoviários",
      "en": "Partnerships, net road charges"
    },
    "frase": {
      "pt": [
        "São os encargos líquidos rodoviários das parcerias no quadro do relatório do Orçamento."
      ],
      "en": [
        "These are net road partnership charges in the Budget report table."
      ]
    }
  },
  "ppp-oe2027-liquidos-2040": {
    "nome": {
      "pt": "Parcerias, encargos líquidos rodoviários",
      "en": "Partnerships, net road charges"
    },
    "frase": {
      "pt": [
        "São os encargos líquidos rodoviários das parcerias no quadro do relatório do Orçamento."
      ],
      "en": [
        "These are net road partnership charges in the Budget report table."
      ]
    }
  },
  "ppp-oe2027-receitas-2027": {
    "nome": {
      "pt": "Parcerias rodoviárias, receitas",
      "en": "Road partnerships, revenue"
    },
    "frase": {
      "pt": [
        "São as receitas previstas para as parcerias rodoviárias no quadro do relatório do Orçamento."
      ],
      "en": [
        "These are forecast revenues for road partnerships in the Budget report table."
      ]
    }
  },
  "ppp-oe2027-riscos-acrescimo": {
    "nome": {
      "pt": "Acréscimo dos pedidos rodoviários face ao relatório anterior",
      "en": "Increase in road claims against the preceding report"
    },
    "frase": {
      "pt": [
        "É o acréscimo do valor dos pedidos rodoviários face ao relatório anterior."
      ],
      "en": [
        "It is the increase in the value of road claims against the preceding report."
      ]
    }
  },
  "ppp-oe2027-riscos-brisa": {
    "nome": {
      "pt": "Pedidos e matérias em negociação com a Brisa",
      "en": "Claims and matters under negotiation with Brisa"
    },
    "frase": {
      "pt": [
        "É o montante dos pedidos ou matérias em negociação com a Brisa."
      ],
      "en": [
        "It is the amount of the claims or matters under negotiation with Brisa."
      ]
    }
  },
  "ppp-oe2027-riscos-pedidos-rodoviarios": {
    "nome": {
      "pt": "Pedidos de reequilíbrio e litígios rodoviários",
      "en": "Road financial rebalancing claims and litigation"
    },
    "frase": {
      "pt": [
        "É o valor global dos pedidos de reequilíbrio financeiro e dos pedidos nos litígios em curso das concessionárias e subconcessionárias rodoviárias."
      ],
      "en": [
        "It is the total value of financial rebalancing claims and claims in ongoing litigation by road concessionaires and subconcessionaires."
      ]
    }
  },
  "ppp-oe2027-riscos-rotas-algarve-mensal": {
    "nome": {
      "pt": "Pagamento mensal provisório à Rotas do Algarve Litoral",
      "en": "Provisional monthly payment to Rotas do Algarve Litoral"
    },
    "frase": {
      "pt": [
        "É o pagamento mensal provisório decidido pelo tribunal arbitral até à decisão da causa principal, acrescido de IVA."
      ],
      "en": [
        "It is the provisional monthly payment ordered by the arbitration tribunal until the decision in the main case, plus VAT."
      ]
    }
  },
  "ppp-oe2027-riscos-rotas-algarve-principal": {
    "nome": {
      "pt": "Ação principal da Rotas do Algarve Litoral",
      "en": "Main action by Rotas do Algarve Litoral"
    },
    "frase": {
      "pt": [
        "É o valor da ação principal arbitral pendente da Rotas do Algarve Litoral."
      ],
      "en": [
        "It is the value of the pending main arbitration action by Rotas do Algarve Litoral."
      ]
    }
  },
  "ppp-oe2027-saude-2027": {
    "nome": {
      "pt": "Parcerias, encargos da saúde",
      "en": "Partnerships, health charges"
    },
    "frase": {
      "pt": [
        "São os encargos da saúde das parcerias no quadro do relatório do Orçamento."
      ],
      "en": [
        "These are health partnership charges in the Budget report table."
      ]
    }
  },
  "saude-total-2020-execucao-cge2020": {
    "nome": {
      "pt": "Saúde, despesa total executada",
      "en": "Health, executed total expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa total executada do programa Saúde, publicada na Conta Geral do Estado."
      ],
      "en": [
        "It is executed total Health programme expenditure, published in the General State Account."
      ]
    }
  },
  "saude-total-2020-orcamento-oe2020": {
    "nome": {
      "pt": "Saúde, despesa total orçamentada",
      "en": "Health, budgeted total expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa total consolidada do programa Saúde no orçamento inicial."
      ],
      "en": [
        "It is consolidated total Health programme expenditure in the initial budget."
      ]
    }
  },
  "saude-total-2021-execucao-cge2021": {
    "nome": {
      "pt": "Saúde, despesa total executada",
      "en": "Health, executed total expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa total executada do programa Saúde, publicada na Conta Geral do Estado."
      ],
      "en": [
        "It is executed total Health programme expenditure, published in the General State Account."
      ]
    }
  },
  "saude-total-2021-orcamento-oe2021": {
    "nome": {
      "pt": "Saúde, despesa total orçamentada",
      "en": "Health, budgeted total expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa total consolidada do programa Saúde no orçamento inicial."
      ],
      "en": [
        "It is consolidated total Health programme expenditure in the initial budget."
      ]
    }
  },
  "saude-total-2022-execucao-cge2022": {
    "nome": {
      "pt": "Saúde, despesa total executada",
      "en": "Health, executed total expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa total executada do programa Saúde, publicada na Conta Geral do Estado."
      ],
      "en": [
        "It is executed total Health programme expenditure, published in the General State Account."
      ]
    }
  },
  "saude-total-2022-orcamento-oe2022": {
    "nome": {
      "pt": "Saúde, despesa total orçamentada",
      "en": "Health, budgeted total expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa total consolidada do programa Saúde no orçamento inicial."
      ],
      "en": [
        "It is consolidated total Health programme expenditure in the initial budget."
      ]
    }
  },
  "saude-total-2023-execucao-cge2023": {
    "nome": {
      "pt": "Saúde, despesa total executada",
      "en": "Health, executed total expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa total executada do programa Saúde, publicada na Conta Geral do Estado."
      ],
      "en": [
        "It is executed total Health programme expenditure, published in the General State Account."
      ]
    }
  },
  "saude-total-2023-orcamento-oe2023": {
    "nome": {
      "pt": "Saúde, despesa total orçamentada",
      "en": "Health, budgeted total expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa total consolidada do programa Saúde no orçamento inicial."
      ],
      "en": [
        "It is consolidated total Health programme expenditure in the initial budget."
      ]
    }
  },
  "saude-total-2024-execucao-cge2024": {
    "nome": {
      "pt": "Saúde, despesa total executada",
      "en": "Health, executed total expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa total executada do programa Saúde, publicada na Conta Geral do Estado."
      ],
      "en": [
        "It is executed total Health programme expenditure, published in the General State Account."
      ]
    }
  },
  "saude-total-2024-orcamento-oe2024": {
    "nome": {
      "pt": "Saúde, despesa total orçamentada",
      "en": "Health, budgeted total expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa total consolidada do programa Saúde no orçamento inicial."
      ],
      "en": [
        "It is consolidated total Health programme expenditure in the initial budget."
      ]
    }
  },
  "saude-total-2025-execucao-cge2025": {
    "nome": {
      "pt": "Saúde, despesa total executada",
      "en": "Health, executed total expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa total executada do programa Saúde, publicada na Conta Geral do Estado."
      ],
      "en": [
        "It is executed total Health programme expenditure, published in the General State Account."
      ]
    }
  },
  "saude-total-2025-orcamento-oe2025": {
    "nome": {
      "pt": "Saúde, despesa total orçamentada",
      "en": "Health, budgeted total expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa total consolidada do programa Saúde no orçamento inicial."
      ],
      "en": [
        "It is consolidated total Health programme expenditure in the initial budget."
      ]
    }
  },
  "saude-total-2026-orcamento-oe2026": {
    "nome": {
      "pt": "Saúde, despesa total orçamentada",
      "en": "Health, budgeted total expenditure"
    },
    "frase": {
      "pt": [
        "É a despesa total consolidada do programa Saúde no orçamento inicial."
      ],
      "en": [
        "It is consolidated total Health programme expenditure in the initial budget."
      ]
    }
  },
  "utao-ppp-contingencias-natureza-2026": {
    "nome": {
      "pt": "Natureza dos pedidos contingentes das parcerias",
      "en": "Nature of contingent partnership claims"
    },
    "frase": {
      "pt": [
        "É a distinção da UTAO entre pedidos contingentes e encargos já reconhecidos."
      ],
      "en": [
        "It is the UTAO’s distinction between contingent claims and charges already recognised."
      ]
    }
  },
  "utao-risco-execucao-sns-2027": {
    "nome": {
      "pt": "Risco de pressão orçamental no Serviço Nacional de Saúde",
      "en": "Risk of budget pressure in the National Health Service"
    },
    "frase": {
      "pt": [
        "É o risco de pressão orçamental identificado pela UTAO para o Serviço Nacional de Saúde."
      ],
      "en": [
        "It is the risk of budget pressure identified by the UTAO for the National Health Service."
      ]
    }
  },
  "utao-saude-efetiva-2026-estimativa": {
    "nome": {
      "pt": "Saúde, despesa efetiva estimada na UTAO",
      "en": "Health, estimated effective expenditure in the UTAO table"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva da Saúde, com consolidação dentro do programa, na coluna da estimativa da tabela da UTAO."
      ],
      "en": [
        "It is effective Health expenditure, consolidated within the programme, in the estimate column of the UTAO table."
      ]
    }
  },
  "utao-saude-efetiva-2026-orcamento": {
    "nome": {
      "pt": "Saúde, despesa efetiva orçamentada na UTAO",
      "en": "Health, budgeted effective expenditure in the UTAO table"
    },
    "frase": {
      "pt": [
        "É a despesa efetiva da Saúde, com consolidação dentro do programa, na coluna do orçamento da tabela da UTAO."
      ],
      "en": [
        "It is effective Health expenditure, consolidated within the programme, in the budget column of the UTAO table."
      ]
    }
  },
  "utao-saude-sem-prr-2027": {
    "nome": {
      "pt": "Variação da despesa da Saúde sem PRR segundo a UTAO",
      "en": "Change in Health expenditure excluding the RRP according to the UTAO"
    },
    "frase": {
      "pt": [
        "É a variação da despesa da Saúde sem PRR referida pela UTAO."
      ],
      "en": [
        "It is the change in Health expenditure excluding the RRP cited by the UTAO."
      ]
    }
  }
});

// V2E: recibos dos efeitos.
Object.assign(FAMILIAS_DAS_LINHAS, {
  "oe2027-indicador-medico": {
    "nome": {
      "pt": "Aumento do número de utentes com médico de família atribuídos",
      "en": "Increase in patients assigned a family doctor"
    },
    "frase": {
      "pt": [
        "É o indicador ou compromisso assistencial escrito no relatório do Orçamento, sem meta quantitativa nesta linha."
      ],
      "en": [
        "It is the care indicator or commitment written in the Budget report, without a numerical target in this row."
      ]
    }
  },
  "oe2027-compromisso-consultas": {
    "nome": {
      "pt": "Compromisso de aumentar consultas",
      "en": "Commitment to increase appointments"
    },
    "frase": {
      "pt": [
        "É o indicador ou compromisso assistencial escrito no relatório do Orçamento, sem meta quantitativa nesta linha."
      ],
      "en": [
        "It is the care indicator or commitment written in the Budget report, without a numerical target in this row."
      ]
    }
  },
  "oe2027-compromisso-cirurgias": {
    "nome": {
      "pt": "Compromisso de aumentar cirurgias",
      "en": "Commitment to increase surgery"
    },
    "frase": {
      "pt": [
        "É o indicador ou compromisso assistencial escrito no relatório do Orçamento, sem meta quantitativa nesta linha."
      ],
      "en": [
        "It is the care indicator or commitment written in the Budget report, without a numerical target in this row."
      ]
    }
  },
  "dgo-atraso-45-p": {
    "nome": {
      "pt": "Pagamentos em atraso das unidades de saúde EPE",
      "en": "Overdue payments by public enterprise health units"
    },
    "frase": {
      "pt": [
        "São pagamentos em atraso das unidades de saúde EPE. Não é a dívida total a fornecedores."
      ],
      "en": [
        "It is overdue payments by public enterprise health units. It is not total debt to suppliers."
      ]
    }
  },
  "dgo-regularizacao-ae": {
    "nome": {
      "pt": "Regularização de dívidas vencidas a fornecedores por parte de entidades do Serviço Nacional de Saúde, com contrapartida em reforços dos respetivos capitais pelo Estado (a)",
      "en": "Settlement of overdue NHS supplier debt backed by State capital increases"
    },
    "frase": {
      "pt": [
        "São regularizações de dívidas através de reforços de capital no período indicado."
      ],
      "en": [
        "It is debt settlement through capital injections in the indicated period."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-0": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Administração Central do Sistema de Saúde, I.P",
      "en": "Debt to external suppliers, Administração Central do Sistema de Saúde, I.P"
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-1": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Administração Regional de Saúde de Lisboa e Vale do Tejo",
      "en": "Debt to external suppliers, Administração Regional de Saúde de Lisboa e Vale do Tejo"
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-2": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Administração Regional de Saúde do Alentejo",
      "en": "Debt to external suppliers, Administração Regional de Saúde do Alentejo"
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-3": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Administração Regional de Saúde do Algarve",
      "en": "Debt to external suppliers, Administração Regional de Saúde do Algarve"
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-4": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Administração Regional de Saúde do Centro",
      "en": "Debt to external suppliers, Administração Regional de Saúde do Centro"
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-5": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Administração Regional de Saúde do Norte",
      "en": "Debt to external suppliers, Administração Regional de Saúde do Norte"
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-6": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Direção Executiva do Serviço Nacional de Saúde, I.P.",
      "en": "Debt to external suppliers, Direção Executiva do Serviço Nacional de Saúde, I.P."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-7": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Instituto Nacional de Emergência Médica",
      "en": "Debt to external suppliers, Instituto Nacional de Emergência Médica"
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-8": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Instituto Nacional Saúde Dr. Ricardo Jorge - Lisboa",
      "en": "Debt to external suppliers, Instituto Nacional Saúde Dr. Ricardo Jorge - Lisboa"
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-9": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Instituto para os Comportamentos Aditivos e as Dependências, I. P.",
      "en": "Debt to external suppliers, Instituto para os Comportamentos Aditivos e as Dependências, I. P."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-10": {
    "nome": {
      "pt": "Dívida a fornecedores externos, INSTITUTO PORTUGUES DE ONCOLOGIA DE COIMBRA, EPE",
      "en": "Debt to external suppliers, INSTITUTO PORTUGUES DE ONCOLOGIA DE COIMBRA, EPE"
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-11": {
    "nome": {
      "pt": "Dívida a fornecedores externos, INSTITUTO PORTUGUES DE ONCOLOGIA DE LISBOA, EPE",
      "en": "Debt to external suppliers, INSTITUTO PORTUGUES DE ONCOLOGIA DE LISBOA, EPE"
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-12": {
    "nome": {
      "pt": "Dívida a fornecedores externos, INSTITUTO PORTUGUES DE ONCOLOGIA DO PORTO, EPE",
      "en": "Debt to external suppliers, INSTITUTO PORTUGUES DE ONCOLOGIA DO PORTO, EPE"
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-13": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Instituto Português Do Sangue e Da Transplantação, IP",
      "en": "Debt to external suppliers, Instituto Português Do Sangue e Da Transplantação, IP"
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-14": {
    "nome": {
      "pt": "Dívida a fornecedores externos, UNIDADE LOCAL DE SAÚDE ALTO MINHO, EPE",
      "en": "Debt to external suppliers, UNIDADE LOCAL DE SAÚDE ALTO MINHO, EPE"
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-15": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde da Arrábida, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde da Arrábida, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-16": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde da Cova da Beira, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde da Cova da Beira, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-17": {
    "nome": {
      "pt": "Dívida a fornecedores externos, UNIDADE LOCAL DE SAÚDE DA GUARDA, EPE",
      "en": "Debt to external suppliers, UNIDADE LOCAL DE SAÚDE DA GUARDA, EPE"
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-18": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde da Lezíria, E. P. E",
      "en": "Debt to external suppliers, Unidade Local de Saúde da Lezíria, E. P. E"
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-19": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde da Região de Aveiro, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde da Região de Aveiro, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-20": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde da Região de Leiria, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde da Região de Leiria, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-21": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde de Almada-Seixal, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde de Almada-Seixal, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-22": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde de Amadora/Sintra, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde de Amadora/Sintra, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-23": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde de Barcelos/Esposende, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde de Barcelos/Esposende, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-24": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde de Braga, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde de Braga, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-25": {
    "nome": {
      "pt": "Dívida a fornecedores externos, UNIDADE LOCAL DE SAUDE DE CASTELO BRANCO, EPE",
      "en": "Debt to external suppliers, UNIDADE LOCAL DE SAUDE DE CASTELO BRANCO, EPE"
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-26": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde de Coimbra, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde de Coimbra, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-27": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde de Entre Douro e Vouga, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde de Entre Douro e Vouga, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-28": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde de Gaia/Espinho, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde de Gaia/Espinho, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-29": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde de Lisboa Ocidental, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde de Lisboa Ocidental, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-30": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde de Loures-Odivelas, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde de Loures-Odivelas, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-31": {
    "nome": {
      "pt": "Dívida a fornecedores externos, UNIDADE LOCAL DE SAÚDE DE MATOSINHOS, EPE",
      "en": "Debt to external suppliers, UNIDADE LOCAL DE SAÚDE DE MATOSINHOS, EPE"
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-32": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde de Santa Maria, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde de Santa Maria, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-33": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde de Santo António, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde de Santo António, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-34": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde de São João, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde de São João, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-35": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde de São José, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde de São José, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-36": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde de Trás-os-Montes e Alto Douro, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde de Trás-os-Montes e Alto Douro, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-37": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde de Viseu Dão-Lafões, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde de Viseu Dão-Lafões, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-38": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde do Alentejo Central, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde do Alentejo Central, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-39": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde do Algarve, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde do Algarve, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-40": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde do Alto Alentejo, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde do Alto Alentejo, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-41": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde do Alto Ave, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde do Alto Ave, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-42": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde do Arco Ribeirinho, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde do Arco Ribeirinho, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-43": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde do Baixo Mondego, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde do Baixo Mondego, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-44": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde do Estuário do Tejo, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde do Estuário do Tejo, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-45": {
    "nome": {
      "pt": "Dívida a fornecedores externos, UNIDADE LOCAL DE SAUDE DO LITORAL ALENTEJANO, EPE",
      "en": "Debt to external suppliers, UNIDADE LOCAL DE SAUDE DO LITORAL ALENTEJANO, EPE"
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-46": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde do Médio Ave, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde do Médio Ave, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-47": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde do Médio Tejo, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde do Médio Tejo, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-48": {
    "nome": {
      "pt": "Dívida a fornecedores externos, UNIDADE LOCAL DE SAUDE DO NORDESTE, EPE",
      "en": "Debt to external suppliers, UNIDADE LOCAL DE SAUDE DO NORDESTE, EPE"
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-49": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde do Oeste, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde do Oeste, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-50": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde do Tâmega e Sousa, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde do Tâmega e Sousa, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-51": {
    "nome": {
      "pt": "Dívida a fornecedores externos, Unidade Local de Saúde Póvoa de Varzim/Vila do Conde, E. P. E.",
      "en": "Debt to external suppliers, Unidade Local de Saúde Póvoa de Varzim/Vila do Conde, E. P. E."
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "sns-divida-2026-divida-total-fornecedores-externos-52": {
    "nome": {
      "pt": "Dívida a fornecedores externos, UNIDADE LOCAL DO BAIXO ALENTEJO, EPE",
      "en": "Debt to external suppliers, UNIDADE LOCAL DO BAIXO ALENTEJO, EPE"
    },
    "frase": {
      "pt": [
        "É a dívida a fornecedores externos da entidade identificada no nome."
      ],
      "en": [
        "It is the debt to external suppliers of the entity identified in the name."
      ]
    }
  },
  "pe-oe-brisa-negociacao": {
    "nome": {
      "pt": "Negociação da concessão da Brisa",
      "en": "Brisa concession negotiations"
    },
    "frase": {
      "pt": [
        "É o excerto do relatório do Orçamento sobre os riscos das parcerias rodoviárias."
      ],
      "en": [
        "It is the Budget report excerpt on road partnership risks."
      ]
    }
  },
  "pe-oe-brisa-pedido": {
    "nome": {
      "pt": "Pedidos quantificados pela Brisa",
      "en": "Claims quantified by Brisa"
    },
    "frase": {
      "pt": [
        "É o excerto do relatório do Orçamento sobre os riscos das parcerias rodoviárias."
      ],
      "en": [
        "It is the Budget report excerpt on road partnership risks."
      ]
    }
  },
  "pe-oe-riscos-total": {
    "nome": {
      "pt": "Pedidos e litígios rodoviários",
      "en": "Road concession claims and disputes"
    },
    "frase": {
      "pt": [
        "É o excerto do relatório do Orçamento sobre os riscos das parcerias rodoviárias."
      ],
      "en": [
        "It is the Budget report excerpt on road partnership risks."
      ]
    }
  },
  "pe-oe-riscos-nao-reconhecimento": {
    "nome": {
      "pt": "Não reconhecimento das pretensões privadas",
      "en": "No recognition of private claims"
    },
    "frase": {
      "pt": [
        "É o excerto do relatório do Orçamento sobre os riscos das parcerias rodoviárias."
      ],
      "en": [
        "It is the Budget report excerpt on road partnership risks."
      ]
    }
  },
  "pe-oe-algarve-cautelar": {
    "nome": {
      "pt": "Ação principal e pagamento cautelar à Rotas do Algarve Litoral",
      "en": "Main action and interim payment to Rotas do Algarve Litoral"
    },
    "frase": {
      "pt": [
        "É o excerto do relatório do Orçamento sobre os riscos das parcerias rodoviárias."
      ],
      "en": [
        "It is the Budget report excerpt on road partnership risks."
      ]
    }
  },
  "pe-oe-algarve-provisorio": {
    "nome": {
      "pt": "Pagamento provisório à Rotas do Algarve Litoral",
      "en": "Interim payment to Rotas do Algarve Litoral"
    },
    "frase": {
      "pt": [
        "É o excerto do relatório do Orçamento sobre os riscos das parcerias rodoviárias."
      ],
      "en": [
        "It is the Budget report excerpt on road partnership risks."
      ]
    }
  },
  "pe-oe-contingentes": {
    "nome": {
      "pt": "Compensações contingentes excluídas da previsão",
      "en": "Contingent compensation excluded from forecast"
    },
    "frase": {
      "pt": [
        "É o excerto do relatório do Orçamento sobre os riscos das parcerias rodoviárias."
      ],
      "en": [
        "It is the Budget report excerpt on road partnership risks."
      ]
    }
  },
  "pe-oe-beira-abolicao": {
    "nome": {
      "pt": "Beira Interior: pedido pela abolição de portagens",
      "en": "Beira Interior claim following toll abolition"
    },
    "frase": {
      "pt": [
        "É o excerto do relatório do Orçamento sobre os riscos das parcerias rodoviárias."
      ],
      "en": [
        "It is the Budget report excerpt on road partnership risks."
      ]
    }
  },
  "pe-oe-apoio-dl87a": {
    "nome": {
      "pt": "Apoio às portagens: alteração do perímetro de reporte",
      "en": "Toll support: change in reporting perimeter"
    },
    "frase": {
      "pt": [
        "É o excerto do relatório do Orçamento sobre os riscos das parcerias rodoviárias."
      ],
      "en": [
        "It is the Budget report excerpt on road partnership risks."
      ]
    }
  },
  "pe-despacho-alargamentos": {
    "nome": {
      "pt": "Alargamentos de vias",
      "en": "Road widening"
    },
    "frase": {
      "pt": [
        "É uma tarefa atribuída à comissão de negociação da concessão Brisa pelo despacho."
      ],
      "en": [
        "It is a task assigned by the order to the Brisa concession negotiating committee."
      ]
    }
  },
  "pe-despacho-investimentos-previstos": {
    "nome": {
      "pt": "Investimentos contratualmente previstos",
      "en": "Contractually planned investment"
    },
    "frase": {
      "pt": [
        "É uma tarefa atribuída à comissão de negociação da concessão Brisa pelo despacho."
      ],
      "en": [
        "It is a task assigned by the order to the Brisa concession negotiating committee."
      ]
    }
  },
  "pe-despacho-equilibrio": {
    "nome": {
      "pt": "Reposição do equilíbrio financeiro",
      "en": "Restoration of financial balance"
    },
    "frase": {
      "pt": [
        "É uma tarefa atribuída à comissão de negociação da concessão Brisa pelo despacho."
      ],
      "en": [
        "It is a task assigned by the order to the Brisa concession negotiating committee."
      ]
    }
  },
  "pe-despacho-comparticipacoes": {
    "nome": {
      "pt": "Acertos de comparticipações financeiras",
      "en": "Adjustment of financial contributions"
    },
    "frase": {
      "pt": [
        "É uma tarefa atribuída à comissão de negociação da concessão Brisa pelo despacho."
      ],
      "en": [
        "It is a task assigned by the order to the Brisa concession negotiating committee."
      ]
    }
  },
  "pe-despacho-braga": {
    "nome": {
      "pt": "Receitas da Circular Sul de Braga",
      "en": "Braga southern ring road toll revenue"
    },
    "frase": {
      "pt": [
        "É uma tarefa atribuída à comissão de negociação da concessão Brisa pelo despacho."
      ],
      "en": [
        "It is a task assigned by the order to the Brisa concession negotiating committee."
      ]
    }
  },
  "pe-despacho-investimentos-novos": {
    "nome": {
      "pt": "Novos investimentos",
      "en": "New investment"
    },
    "frase": {
      "pt": [
        "É uma tarefa atribuída à comissão de negociação da concessão Brisa pelo despacho."
      ],
      "en": [
        "It is a task assigned by the order to the Brisa concession negotiating committee."
      ]
    }
  },
  "pe-despacho-limites": {
    "nome": {
      "pt": "Limites da concessão",
      "en": "Concession boundaries"
    },
    "frase": {
      "pt": [
        "É uma tarefa atribuída à comissão de negociação da concessão Brisa pelo despacho."
      ],
      "en": [
        "It is a task assigned by the order to the Brisa concession negotiating committee."
      ]
    }
  },
  "pe-despacho-qualidade": {
    "nome": {
      "pt": "Monitorização da qualidade de serviço",
      "en": "Service quality monitoring"
    },
    "frase": {
      "pt": [
        "É uma tarefa atribuída à comissão de negociação da concessão Brisa pelo despacho."
      ],
      "en": [
        "It is a task assigned by the order to the Brisa concession negotiating committee."
      ]
    }
  },
  "pe-scut-trocos": {
    "nome": {
      "pt": "Autoestradas e troços com eliminação de portagens",
      "en": "Motorways and sections with toll abolition"
    },
    "frase": {
      "pt": [
        "É o excerto da lei sobre a eliminação de portagens e a sua entrada em vigor."
      ],
      "en": [
        "It is the excerpt from the law on toll abolition and its entry into force."
      ]
    }
  },
  "pe-scut-vigencia": {
    "nome": {
      "pt": "Entrada em vigor da eliminação de portagens",
      "en": "Entry into force of toll abolition"
    },
    "frase": {
      "pt": [
        "É o excerto da lei sobre a eliminação de portagens e a sua entrada em vigor."
      ],
      "en": [
        "It is the excerpt from the law on toll abolition and its entry into force."
      ]
    }
  },
  "pe-dl87a-atualizacao": {
    "nome": {
      "pt": "Atualização das portagens prevista no diploma",
      "en": "Toll rate update set by the decree"
    },
    "frase": {
      "pt": [
        "É a regra do diploma sobre o financiamento do apoio às concessionárias pelos descontos nas portagens."
      ],
      "en": [
        "It is the decree’s rule on financing support to concessionaires for toll discounts."
      ]
    }
  },
  "pe-dl87a-apoio": {
    "nome": {
      "pt": "Comparticipação do Estado nas portagens",
      "en": "State contribution to tolls"
    },
    "frase": {
      "pt": [
        "É a regra do diploma sobre o financiamento do apoio às concessionárias pelos descontos nas portagens."
      ],
      "en": [
        "It is the decree’s rule on financing support to concessionaires for toll discounts."
      ]
    }
  },
  "pe-dl87a-financiamento": {
    "nome": {
      "pt": "Financiamento do apoio pelo Orçamento",
      "en": "Budget financing of toll support"
    },
    "frase": {
      "pt": [
        "É a regra do diploma sobre o financiamento do apoio às concessionárias pelos descontos nas portagens."
      ],
      "en": [
        "It is the decree’s rule on financing support to concessionaires for toll discounts."
      ]
    }
  },
  "pe-dl87a-efeitos": {
    "nome": {
      "pt": "Produção de efeitos da atualização",
      "en": "Effective date of the update"
    },
    "frase": {
      "pt": [
        "É a regra do diploma sobre o financiamento do apoio às concessionárias pelos descontos nas portagens."
      ],
      "en": [
        "It is the decree’s rule on financing support to concessionaires for toll discounts."
      ]
    }
  },
  "pe-tc15-acordos": {
    "nome": {
      "pt": "Acordos de compensações contingentes",
      "en": "Contingent compensation agreements"
    },
    "frase": {
      "pt": [
        "É o excerto histórico do Tribunal de Contas sobre as parcerias e as compensações contingentes."
      ],
      "en": [
        "It is the historical Court of Auditors excerpt on partnerships and contingent compensation."
      ]
    }
  },
  "pe-tc15-remuneracao": {
    "nome": {
      "pt": "Remuneração não visada",
      "en": "Remuneration not cleared by the Court"
    },
    "frase": {
      "pt": [
        "É o excerto histórico do Tribunal de Contas sobre as parcerias e as compensações contingentes."
      ],
      "en": [
        "It is the historical Court of Auditors excerpt on partnerships and contingent compensation."
      ]
    }
  },
  "pe-tc15-infracoes": {
    "nome": {
      "pt": "Possíveis infrações nos pagamentos contingentes",
      "en": "Possible infringements in contingent payments"
    },
    "frase": {
      "pt": [
        "É o excerto histórico do Tribunal de Contas sobre as parcerias e as compensações contingentes."
      ],
      "en": [
        "It is the historical Court of Auditors excerpt on partnerships and contingent compensation."
      ]
    }
  },
  "pe-tc15-fundamento": {
    "nome": {
      "pt": "Fundamento contratual dos pagamentos",
      "en": "Contractual basis for payments"
    },
    "frase": {
      "pt": [
        "É o excerto histórico do Tribunal de Contas sobre as parcerias e as compensações contingentes."
      ],
      "en": [
        "It is the historical Court of Auditors excerpt on partnerships and contingent compensation."
      ]
    }
  },
  "pe-tc15-futuros": {
    "nome": {
      "pt": "Previsão histórica de encargos com as parcerias",
      "en": "Historical forecast of partnership charges"
    },
    "frase": {
      "pt": [
        "É o excerto histórico do Tribunal de Contas sobre as parcerias e as compensações contingentes."
      ],
      "en": [
        "It is the historical Court of Auditors excerpt on partnerships and contingent compensation."
      ]
    }
  },
  "pe-brisa-prazo-minuta": {
    "nome": {
      "pt": "Prazo da concessão da Brisa",
      "en": "Brisa concession expiry"
    },
    "frase": {
      "pt": [
        "É o prazo da concessão Brisa indicado no documento identificado na fonte."
      ],
      "en": [
        "It is the Brisa concession term stated in the document identified as the source."
      ]
    }
  },
  "pe-brisa-periodo-imt": {
    "nome": {
      "pt": "Período da concessão da Brisa no IMT",
      "en": "Brisa concession period reported by IMT"
    },
    "frase": {
      "pt": [
        "É o prazo da concessão Brisa indicado no documento identificado na fonte."
      ],
      "en": [
        "It is the Brisa concession term stated in the document identified as the source."
      ]
    }
  },
  "pe-brisa-vias-minuta": {
    "nome": {
      "pt": "Vias da concessão Brisa na minuta",
      "en": "Brisa concession roads in the draft contract"
    },
    "frase": {
      "pt": [
        "É o prazo da concessão Brisa indicado no documento identificado na fonte."
      ],
      "en": [
        "It is the Brisa concession term stated in the document identified as the source."
      ]
    }
  },
  "pe-dl87a-apoio-retificado": {
    "nome": {
      "pt": "Pagamento do Estado nas portagens, redação retificada",
      "en": "State toll support payment, corrected wording"
    },
    "frase": {
      "pt": [
        "É a regra do diploma sobre o financiamento do apoio às concessionárias pelos descontos nas portagens."
      ],
      "en": [
        "It is the decree’s rule on financing support to concessionaires for toll discounts."
      ]
    }
  },
  "prr-complemento-p3-1-24-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p3-1-32-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p3-1-33-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p3-1-3-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p3-1-8-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p4-1-1-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p4-1-5-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p4-1-12-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p4-1-40-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p4-1-41-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p4-1-2-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p5-1-22-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p5-1-28-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p5-1-11-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p5-1-7-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p5-1-9-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p6-1-37-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p6-1-42-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p6-1-10-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p7-1-34-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p7-1-35-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p7-1-36-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p7-1-38-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p7-1-39-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p8-1-21-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p8-1-25-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p9-1-17-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p9-1-18-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p9-1-26-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p9-1-30-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p9-1-43-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-complemento-p9-1-44-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "sns-sem-medico-serie-antiga-2025-06": {
    "nome": {
      "pt": "Utentes sem médico de família atribuído",
      "en": "Patients without an assigned family doctor"
    },
    "frase": {
      "pt": [
        "Conta os utentes inscritos sem médico de família atribuído, na série indicada."
      ],
      "en": [
        "Counts registered users without an assigned family doctor, in the indicated series."
      ]
    }
  },
  "sns-sem-medico-serie-antiga-2026-06": {
    "nome": {
      "pt": "Utentes sem médico de família atribuído",
      "en": "Patients without an assigned family doctor"
    },
    "frase": {
      "pt": [
        "Conta os utentes inscritos sem médico de família atribuído, na série indicada."
      ],
      "en": [
        "Counts registered users without an assigned family doctor, in the indicated series."
      ]
    }
  },
  "sns-sem-medico-serie-nova-2026-08": {
    "nome": {
      "pt": "Inscritos elegíveis sem médico de família atribuído",
      "en": "Eligible registered patients without an assigned family doctor"
    },
    "frase": {
      "pt": [
        "Conta os utentes inscritos sem médico de família atribuído, na série indicada."
      ],
      "en": [
        "Counts registered users without an assigned family doctor, in the indicated series."
      ]
    }
  },
  "sns-consultas-csp-2026-08": {
    "nome": {
      "pt": "Consultas médicas nos cuidados de saúde primários",
      "en": "Primary care medical consultations"
    },
    "frase": {
      "pt": [
        "Conta as consultas realizadas nos cuidados de saúde primários no mês indicado."
      ],
      "en": [
        "Counts primary-care consultations in the indicated month."
      ]
    }
  },
  "sns-consultas-csp-2025-08": {
    "nome": {
      "pt": "Consultas médicas nos cuidados de saúde primários",
      "en": "Primary care medical consultations"
    },
    "frase": {
      "pt": [
        "Conta as consultas realizadas nos cuidados de saúde primários no mês indicado."
      ],
      "en": [
        "Counts primary-care consultations in the indicated month."
      ]
    }
  },
  "sns-consultas-hospitalares-2026-07": {
    "nome": {
      "pt": "Consultas médicas hospitalares",
      "en": "Hospital medical consultations"
    },
    "frase": {
      "pt": [
        "Conta as consultas hospitalares acumuladas desde janeiro até ao mês indicado."
      ],
      "en": [
        "Counts hospital consultations accumulated from January through the indicated month."
      ]
    }
  },
  "sns-consultas-hospitalares-2025-07": {
    "nome": {
      "pt": "Consultas médicas hospitalares",
      "en": "Hospital medical consultations"
    },
    "frase": {
      "pt": [
        "Conta as consultas hospitalares acumuladas desde janeiro até ao mês indicado."
      ],
      "en": [
        "Counts hospital consultations accumulated from January through the indicated month."
      ]
    }
  },
  "sns-cirurgias-2026-07": {
    "nome": {
      "pt": "Intervenções cirúrgicas programadas e urgentes",
      "en": "Scheduled and emergency surgical interventions"
    },
    "frase": {
      "pt": [
        "Conta as intervenções cirúrgicas programadas e urgentes acumuladas desde janeiro até ao mês indicado."
      ],
      "en": [
        "Counts scheduled and emergency surgeries accumulated from January through the indicated month."
      ]
    }
  },
  "sns-cirurgias-2025-07": {
    "nome": {
      "pt": "Intervenções cirúrgicas programadas e urgentes",
      "en": "Scheduled and emergency surgical interventions"
    },
    "frase": {
      "pt": [
        "Conta as intervenções cirúrgicas programadas e urgentes acumuladas desde janeiro até ao mês indicado."
      ],
      "en": [
        "Counts scheduled and emergency surgeries accumulated from January through the indicated month."
      ]
    }
  },
  "sns-lista-cirurgia-2026-07": {
    "nome": {
      "pt": "Inscritos em lista de espera para cirurgia",
      "en": "Patients on the surgical waiting list"
    },
    "frase": {
      "pt": [
        "Conta os utentes inscritos para cirurgia no período indicado."
      ],
      "en": [
        "Counts patients on the surgery waiting list in the indicated period."
      ]
    }
  },
  "sns-lista-cirurgia-2025-07": {
    "nome": {
      "pt": "Inscritos em lista de espera para cirurgia",
      "en": "Patients on the surgical waiting list"
    },
    "frase": {
      "pt": [
        "Conta os utentes inscritos para cirurgia no período indicado."
      ],
      "en": [
        "Counts patients on the surgery waiting list in the indicated period."
      ]
    }
  },
  "sns-urgencias-2026-07": {
    "nome": {
      "pt": "Atendimentos em urgência hospitalar",
      "en": "Hospital emergency attendances"
    },
    "frase": {
      "pt": [
        "Conta os atendimentos em urgência hospitalar acumulados desde janeiro até ao mês indicado."
      ],
      "en": [
        "Counts hospital emergency attendances accumulated from January through the indicated month."
      ]
    }
  },
  "sns-urgencias-2025-07": {
    "nome": {
      "pt": "Atendimentos em urgência hospitalar",
      "en": "Hospital emergency attendances"
    },
    "frase": {
      "pt": [
        "Conta os atendimentos em urgência hospitalar acumulados desde janeiro até ao mês indicado."
      ],
      "en": [
        "Counts hospital emergency attendances accumulated from January through the indicated month."
      ]
    }
  },
  "sns-espera-rncci-2026-10-19": {
    "nome": {
      "pt": "Utentes a aguardar vaga na RNCCI",
      "en": "Patients waiting for a place in integrated long-term care"
    },
    "frase": {
      "pt": [
        "Conta os utentes à espera de vaga em cuidados continuados na data indicada."
      ],
      "en": [
        "Counts patients waiting for continuing-care places on the indicated date."
      ]
    }
  },
  "sns-espera-rncci-2025-10-19": {
    "nome": {
      "pt": "Utentes a aguardar vaga na RNCCI",
      "en": "Patients waiting for a place in integrated long-term care"
    },
    "frase": {
      "pt": [
        "Conta os utentes à espera de vaga em cuidados continuados na data indicada."
      ],
      "en": [
        "Counts patients waiting for continuing-care places on the indicated date."
      ]
    }
  },
  "eurostat-be-phys": {
    "nome": {
      "pt": "Médicos por cem mil habitantes, Bélgica",
      "en": "Physicians per hundred thousand inhabitants, Belgium"
    },
    "frase": {
      "pt": [
        "É o número de médicos por cem mil habitantes no país e período da linha."
      ],
      "en": [
        "It is the number of physicians per hundred thousand inhabitants in the country and period of the row."
      ]
    }
  },
  "eurostat-el-phys": {
    "nome": {
      "pt": "Médicos por cem mil habitantes, Grécia",
      "en": "Physicians per hundred thousand inhabitants, Greece"
    },
    "frase": {
      "pt": [
        "É o número de médicos por cem mil habitantes no país e período da linha."
      ],
      "en": [
        "It is the number of physicians per hundred thousand inhabitants in the country and period of the row."
      ]
    }
  },
  "eurostat-lu-nrs": {
    "nome": {
      "pt": "Enfermeiros por cem mil habitantes, Luxemburgo",
      "en": "Nurses per hundred thousand inhabitants, Luxembourg"
    },
    "frase": {
      "pt": [
        "É o número de enfermeiros por cem mil habitantes no país e período da linha."
      ],
      "en": [
        "It is the number of nurses per hundred thousand inhabitants in the country and period of the row."
      ]
    }
  },
  "eurostat-pt-phys": {
    "nome": {
      "pt": "Médicos por cem mil habitantes, Portugal",
      "en": "Physicians per hundred thousand inhabitants, Portugal"
    },
    "frase": {
      "pt": [
        "É o número de médicos por cem mil habitantes no país e período da linha."
      ],
      "en": [
        "It is the number of physicians per hundred thousand inhabitants in the country and period of the row."
      ]
    }
  },
  "eurostat-pt-nrs": {
    "nome": {
      "pt": "Enfermeiros por cem mil habitantes, Portugal",
      "en": "Nurses per hundred thousand inhabitants, Portugal"
    },
    "frase": {
      "pt": [
        "É o número de enfermeiros por cem mil habitantes no país e período da linha."
      ],
      "en": [
        "It is the number of nurses per hundred thousand inhabitants in the country and period of the row."
      ]
    }
  },
  "eurostat-ro-nrs": {
    "nome": {
      "pt": "Enfermeiros por cem mil habitantes, Roménia",
      "en": "Nurses per hundred thousand inhabitants, Romania"
    },
    "frase": {
      "pt": [
        "É o número de enfermeiros por cem mil habitantes no país e período da linha."
      ],
      "en": [
        "It is the number of nurses per hundred thousand inhabitants in the country and period of the row."
      ]
    }
  },
  "prr-monitorizacao-20261014-p2-c01-contratado": {
    "nome": {
      "pt": "Serviço Nacional de Saúde: Contratado PRR",
      "en": "National Health Service: Contracted RRP funding"
    },
    "frase": {
      "pt": [
        "É o montante contratado na componente Saúde do PRR, na data do painel."
      ],
      "en": [
        "It is the contracted amount in the RRP Health component, at the dashboard date."
      ]
    }
  },
  "prr-monitorizacao-20261014-p2-c01-pago": {
    "nome": {
      "pt": "Serviço Nacional de Saúde: Pago PRR",
      "en": "National Health Service: Paid RRP funding"
    },
    "frase": {
      "pt": [
        "É o montante pago na componente Saúde do PRR, na data do painel."
      ],
      "en": [
        "It is the paid amount in the RRP Health component, at the dashboard date."
      ]
    }
  },
  "prr-monitorizacao-20261014-p2-c01-taxa": {
    "nome": {
      "pt": "Serviço Nacional de Saúde: Pago a beneficiários diretos e finais (%)",
      "en": "National Health Service: Paid to direct and final beneficiaries (%)"
    },
    "frase": {
      "pt": [
        "É a taxa de execução financeira da componente Saúde publicada no painel."
      ],
      "en": [
        "It is the Health component financial execution rate published in the dashboard."
      ]
    }
  },
  "infarmed-ambulatorio-2026-07-p5-acumulado-encargo": {
    "nome": {
      "pt": "Encargos SNS com medicamentos em ambulatório",
      "en": "NHS medicines expenditure in outpatient care"
    },
    "frase": {
      "pt": [
        "São os encargos do Serviço Nacional de Saúde com medicamentos no contexto e período identificados no nome."
      ],
      "en": [
        "It is National Health Service expenditure on medicines in the setting and period identified in the name."
      ]
    }
  },
  "infarmed-ambulatorio-2026-07-p5-homologo-encargo": {
    "nome": {
      "pt": "Encargos SNS com medicamentos em ambulatório",
      "en": "NHS medicines expenditure in outpatient care"
    },
    "frase": {
      "pt": [
        "São os encargos do Serviço Nacional de Saúde com medicamentos no contexto e período identificados no nome."
      ],
      "en": [
        "It is National Health Service expenditure on medicines in the setting and period identified in the name."
      ]
    }
  },
  "infarmed-ambulatorio-limitacao": {
    "nome": {
      "pt": "Limitação dos valores Infarmed",
      "en": "Infarmed figures limitation"
    },
    "frase": {
      "pt": [
        "É a ressalva do Infarmed sobre as contribuições que os valores apresentados não refletem integralmente."
      ],
      "en": [
        "It is Infarmed’s caveat on contributions not fully reflected in the reported values."
      ]
    }
  },
  "infarmed-hospitalar-2026-07-p5-acumulado-encargo": {
    "nome": {
      "pt": "Encargos SNS com medicamentos em meio hospitalar",
      "en": "NHS medicines expenditure in hospitals"
    },
    "frase": {
      "pt": [
        "São os encargos do Serviço Nacional de Saúde com medicamentos no contexto e período identificados no nome."
      ],
      "en": [
        "It is National Health Service expenditure on medicines in the setting and period identified in the name."
      ]
    }
  },
  "infarmed-hospitalar-2026-07-p5-homologo-encargo": {
    "nome": {
      "pt": "Encargos SNS com medicamentos em meio hospitalar",
      "en": "NHS medicines expenditure in hospitals"
    },
    "frase": {
      "pt": [
        "São os encargos do Serviço Nacional de Saúde com medicamentos no contexto e período identificados no nome."
      ],
      "en": [
        "It is National Health Service expenditure on medicines in the setting and period identified in the name."
      ]
    }
  },
  "prr-marcos-metas-2025-p2-1-29-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-marcos-metas-2025-p2-1-4-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-marcos-metas-2025-p2-1-13-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-marcos-metas-2025-p2-1-20-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "prr-marcos-metas-2025-p2-1-6-estado": {
    "nome": {
      "pt": "Estado do marco ou meta da Saúde",
      "en": "Health milestone or target status"
    },
    "frase": {
      "pt": [
        "É o estado do marco ou meta identificado no nome, tal como consta do anexo anual."
      ],
      "en": [
        "It is the status of the milestone or target identified in the name, as listed in the annual annex."
      ]
    }
  },
  "der-sns-consultas-csp-variacao-pct": {
    "nome": {
      "pt": "Variação homóloga de consultas nos cuidados primários",
      "en": "Year-on-year change in primary-care consultations"
    },
    "frase": {
      "pt": [
        "É a variação percentual face ao período homólogo, refeita das componentes identificadas."
      ],
      "en": [
        "It is the percentage change against the corresponding period, recalculated from the identified components."
      ]
    }
  },
  "der-sns-cirurgias-variacao-pct": {
    "nome": {
      "pt": "Variação homóloga de cirurgias acumuladas de janeiro a julho",
      "en": "Year-on-year change in January to July surgeries"
    },
    "frase": {
      "pt": [
        "É a variação percentual face ao período homólogo, refeita das componentes identificadas."
      ],
      "en": [
        "It is the percentage change against the corresponding period, recalculated from the identified components."
      ]
    }
  },
  "der-sns-lista-cirurgia-variacao-pct": {
    "nome": {
      "pt": "Variação homóloga de inscritos para cirurgia",
      "en": "Year-on-year change in surgery waiting list"
    },
    "frase": {
      "pt": [
        "É a variação percentual face ao período homólogo, refeita das componentes identificadas."
      ],
      "en": [
        "It is the percentage change against the corresponding period, recalculated from the identified components."
      ]
    }
  },
  "der-sns-espera-rncci-variacao-pct": {
    "nome": {
      "pt": "Variação homóloga de utentes à espera de cuidados continuados",
      "en": "Year-on-year change in patients waiting for continuing care"
    },
    "frase": {
      "pt": [
        "É a variação percentual face ao período homólogo, refeita das componentes identificadas."
      ],
      "en": [
        "It is the percentage change against the corresponding period, recalculated from the identified components."
      ]
    }
  },
  "der-infarmed-total-2026-jan-jul": {
    "nome": {
      "pt": "Encargos SNS com medicamentos em ambulatório e no hospital",
      "en": "NHS expenditure on outpatient and hospital medicines"
    },
    "frase": {
      "pt": [
        "É a soma dos encargos com medicamentos em ambulatório e em meio hospitalar."
      ],
      "en": [
        "It is the sum of outpatient and hospital medicines expenditure."
      ]
    }
  },
  "der-infarmed-total-2025-jan-jul": {
    "nome": {
      "pt": "Encargos SNS com medicamentos em ambulatório e no hospital",
      "en": "NHS expenditure on outpatient and hospital medicines"
    },
    "frase": {
      "pt": [
        "É a soma dos encargos com medicamentos em ambulatório e em meio hospitalar."
      ],
      "en": [
        "It is the sum of outpatient and hospital medicines expenditure."
      ]
    }
  },
  "der-infarmed-variacao-pct": {
    "nome": {
      "pt": "Variação homóloga dos encargos SNS com medicamentos",
      "en": "Year-on-year change in NHS medicines expenditure"
    },
    "frase": {
      "pt": [
        "É a variação percentual face ao período homólogo, refeita das componentes identificadas."
      ],
      "en": [
        "It is the percentage change against the corresponding period, recalculated from the identified components."
      ]
    }
  },
  "der-prr-saude-contratado-numerico": {
    "nome": {
      "pt": "Contratado na componente Saúde do PRR, leitura em milhões",
      "en": "Contracted for RRP Health, read in millions"
    },
    "frase": {
      "pt": [
        "É a leitura numérica em milhões de euros do montante que o painel apresenta com a unidade incorporada."
      ],
      "en": [
        "It is the numerical reading in million euros of the amount the dashboard presents with its unit."
      ]
    }
  },
  "der-prr-saude-pago-numerico": {
    "nome": {
      "pt": "Pago na componente Saúde do PRR, leitura em milhões",
      "en": "Paid for RRP Health, read in millions"
    },
    "frase": {
      "pt": [
        "É a leitura numérica em milhões de euros do montante que o painel apresenta com a unidade incorporada."
      ],
      "en": [
        "It is the numerical reading in million euros of the amount the dashboard presents with its unit."
      ]
    }
  },
  "der-prr-saude-por-pagar": {
    "nome": {
      "pt": "PRR Saúde contratado por pagar",
      "en": "Contracted RRP Health amount still unpaid"
    },
    "frase": {
      "pt": [
        "É o montante contratado na componente Saúde do PRR menos o montante pago."
      ],
      "en": [
        "It is the contracted amount in the RRP Health component minus the paid amount."
      ]
    }
  },
  "der-prr-saude-por-pagar-pct": {
    "nome": {
      "pt": "Parte do contratado no PRR Saúde por pagar",
      "en": "Unpaid share of contracted RRP Health"
    },
    "frase": {
      "pt": [
        "É a parte do contratado na componente Saúde do PRR que ainda não foi paga."
      ],
      "en": [
        "It is the share of the contracted RRP Health amount that remains unpaid."
      ]
    }
  },
  "der-prr-saude-marcos-total": {
    "nome": {
      "pt": "Marcos e metas da componente Saúde no anexo anual",
      "en": "Milestones and targets of Health in the annual annex"
    },
    "frase": {
      "pt": [
        "Conta os marcos e metas da componente Saúde no anexo anual."
      ],
      "en": [
        "Counts the Health component milestones and targets in the annual annex."
      ]
    }
  },
  "der-prr-saude-marcos-completos": {
    "nome": {
      "pt": "Marcos e metas completos da componente Saúde no anexo anual",
      "en": "Completed milestones and targets of Health in the annual annex"
    },
    "frase": {
      "pt": [
        "Conta os marcos e metas da componente Saúde cujo estado no anexo anual é completo."
      ],
      "en": [
        "Counts the Health component milestones and targets whose annual annex status is complete."
      ]
    }
  },
  "der-sns-divida-fornecedores-2026-07": {
    "nome": {
      "pt": "Dívida das entidades SNS a fornecedores externos",
      "en": "NHS entities’ debt to external suppliers"
    },
    "frase": {
      "pt": [
        "É a soma das dívidas a fornecedores externos das entidades do Serviço Nacional de Saúde, em milhões de euros."
      ],
      "en": [
        "It is the sum of National Health Service entities’ debts to external suppliers, in million euros."
      ]
    }
  }
});
