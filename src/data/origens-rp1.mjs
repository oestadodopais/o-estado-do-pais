/** RP1: excertos e selos conferidos por origens-rp1.py. */
export const ORIGENS_RP1 = {
  "rp1-ipc-homologa": {
    "publicador": "INE",
    "documento": "INE · metainformação do índice de preços no consumidor, variação homóloga",
    "url": "https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0014663&lingua=PT",
    "lido": "2026-09-26",
    "lingua": "pt",
    "excerto": "A variação homóloga compara o nível da variável entre o mês corrente e o mesmo mês do ano anterior.",
    "selo": {
      "motor": "indicators/out/rp1-2026-09-26/011-ine-0014663-minfo.html",
      "hora": "2026-09-26T13:54:38Z",
      "cliente": "core.http.HttpClient.condicional",
      "sha256": "4362e583c944550a1572da5737dd47eb00d432c08952a42ffe848d9f1c05266b",
      "campo": "texto normalizado da página"
    }
  },
  "rp1-ipc-media": {
    "publicador": "INE",
    "documento": "INE · metainformação do índice de preços no consumidor, média dos últimos doze meses",
    "url": "https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0014666&lingua=PT",
    "lido": "2026-09-26",
    "lingua": "pt",
    "excerto": "A variação média dos últimos doze meses compara o nível do índice médio de preços dos últimos doze meses com os doze meses imediatamente anteriores. Por ser uma média móvel, esta taxa de variação é menos sensível a alterações esporádicas nos preços. O valor obtido no mês de Dezembro tem sido utilizado como referência no plano da concertação social, sendo por isso associado à taxa de inflação anual.",
    "selo": {
      "motor": "indicators/out/rp1-2026-09-26/012-ine-0014666-minfo.html",
      "hora": "2026-09-26T13:54:43Z",
      "cliente": "core.http.HttpClient.condicional",
      "sha256": "863db25b79b4cf18777dad078d5f7d37c95d7af4e6f0cb784696ff3968a0e1d0",
      "campo": "texto normalizado da página"
    }
  },
  "rp1-ipc-metodo": {
    "publicador": "INE",
    "documento": "INE · documento metodológico do índice de preços no consumidor",
    "url": "https://smi.ine.pt/UploadFile/Download/2961",
    "lido": "2026-09-26",
    "lingua": "pt",
    "excerto": "O Índice de Preços no Consumidor (IPC) é um indicador que tem por finalidade medir a evolução dos preços de um conjunto de bens e serviços considerados representativos da estrutura de despesa monetária de consumo final das famílias residentes em Portugal. O IPC não é, assim, um indicador de níveis de preços, mas sim um indicador de síntese sobre a variação dos preços no consumidor ao longo do tempo.",
    "selo": {
      "motor": "indicators/out/rp1-2026-09-26/017-ine-ipc-metodologia.pdf",
      "hora": "2026-09-26T13:56:14Z",
      "cliente": "core.http.HttpClient.condicional",
      "sha256": "b77f4bdfbbe27f960dde5194914831e4645573407799f478bc0dcc7e82e3909c",
      "campo": "texto da extração metodológica",
      "extracao": {
        "ficheiro": "indicators/out/rp1-2026-09-26/017-ine-ipc-metodologia.txt",
        "sha256": "e5e310fad5168d54ae51c682e09b3ec9d2b248dfa329086d06853313f5d9afd2",
        "ferramenta": "pdftotext version 26.03.0, modo simples"
      }
    }
  },
  "rp1-rendas-referencia": {
    "publicador": "INE",
    "documento": "INE · Índice de preços no consumidor, agosto de 2026",
    "url": "https://www.ine.pt/ngt_server/attachfileu.jsp?look_parentBoui=813834718&att_display=n&att_download=y",
    "lido": "2026-09-26",
    "lingua": "pt",
    "excerto": "variação média dos últimos doze meses do IPC sem habitação, referência para a atualização de rendas no próximo ano, fixou-se em 2,6% (2,56%) em agosto.",
    "selo": {
      "motor": "indicators/out/rp1-2026-09-26/025-ine-ipc-agosto-2026.pdf",
      "hora": "2026-09-26T14:06:13Z",
      "cliente": "core.http.HttpClient.condicional",
      "sha256": "c3444bbbc9687ffea549d88d5b436419158648030789b811c9148b66f5435199",
      "campo": "texto da extração metodológica",
      "extracao": {
        "ficheiro": "indicators/out/rp1-2026-09-26/025-ine-ipc-agosto-2026.txt",
        "sha256": "cfdfad471fd67c4c8f9b0a26c2d8eea32b94e4f6ec1a69e691bf9bd70baa5c10",
        "ferramenta": "pdftotext version 26.03.0, modo simples"
      }
    }
  },
  "rp1-remuneracao-trabalhadores": {
    "publicador": "INE",
    "documento": "INE · documento metodológico da remuneração bruta mensal média",
    "url": "https://smi.ine.pt/UploadFile/Download/2576",
    "lido": "2026-09-26",
    "lingua": "pt",
    "excerto": "A base de dados final abrange a totalidade do universo de trabalhadores por conta de outrem, sendo que aqueles com mais de um emprego são contabilizados tantas vezes quanto o número de empregos que tenham (posto de trabalho).",
    "selo": {
      "motor": "indicators/out/rp1-2026-09-26/018-ine-remuneracao-metodologia.pdf",
      "hora": "2026-09-26T13:56:15Z",
      "cliente": "core.http.HttpClient.condicional",
      "sha256": "fc9970809cc4d21fd421961a72e323b946184414d0348bce968011eee9d2cdae",
      "campo": "texto da extração metodológica",
      "extracao": {
        "ficheiro": "indicators/out/rp1-2026-09-26/018-ine-remuneracao-metodologia.txt",
        "sha256": "bf461ab0301192a42403a8491b792a949cc68a5f0ce0502968ed548d75478500",
        "ferramenta": "pdftotext version 26.03.0, modo simples"
      }
    }
  },
  "rp1-remuneracao-bruta": {
    "publicador": "INE",
    "documento": "INE · conceito de remuneração bruta",
    "url": "https://smi.ine.pt/UploadFile/Download/2576",
    "lido": "2026-09-26",
    "lingua": "pt",
    "excerto": "Remuneração ilíquida, em dinheiro ou em géneros, paga aos trabalhadores pelas horas de trabalho efetuadas ou pelo trabalho realizado no período normal e no extraordinário, incluindo o pagamento de horas remuneradas mas não efetuadas (férias, feriados e outras ausências pagas) e os subsídios de caráter regular, tais como subsídios de alimentação, função, alojamento ou",
    "selo": {
      "motor": "indicators/out/rp1-2026-09-26/018-ine-remuneracao-metodologia.pdf",
      "hora": "2026-09-26T13:56:15Z",
      "cliente": "core.http.HttpClient.condicional",
      "sha256": "fc9970809cc4d21fd421961a72e323b946184414d0348bce968011eee9d2cdae",
      "campo": "texto da extração metodológica",
      "extracao": {
        "ficheiro": "indicators/out/rp1-2026-09-26/018-ine-remuneracao-metodologia.txt",
        "sha256": "bf461ab0301192a42403a8491b792a949cc68a5f0ce0502968ed548d75478500",
        "ferramenta": "pdftotext version 26.03.0, modo simples"
      }
    }
  },
  "rp1-pensoes-formula": {
    "publicador": "INE",
    "documento": "INE · metainformação do valor médio das pensões",
    "url": "https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0014532&lingua=PT",
    "lido": "2026-09-26",
    "lingua": "pt",
    "excerto": "Valor das pensões da segurança social/ Pensionistas da segurança social",
    "selo": {
      "motor": "indicators/out/rp1-2026-09-26/013-ine-0014532-minfo.html",
      "hora": "2026-09-26T13:54:49Z",
      "cliente": "core.http.HttpClient.condicional",
      "sha256": "b974d064c0cc5a35069232a83ce9ea72fbf43460c3744335d48f9e80ceed7789",
      "campo": "texto normalizado da página"
    }
  },
  "rp1-pensoes-periodo": {
    "publicador": "INE",
    "documento": "Valor médio das pensões da segurança social (Série 2017 - €/ N.º) por Local de residência (NUTS - 2024) e Tipo de pensão; Anual - Instituto de Informática",
    "url": "https://www.ine.pt/ine/json_indicador/pindicaMeta.jsp?varcd=0014532&lang=PT",
    "lido": "2026-09-26",
    "lingua": "pt",
    "excerto": "A partir de janeiro de 2017, de acordo com a nova metodologia estabelecida pelo Instituto de Informática I.P., o valor médio anual das pensões tem em conta as pensões pagas pela Segurança Social ao longo do ano.",
    "selo": {
      "motor": "indicators/out/rp1-2026-09-26/003-ine-0014532-meta.json",
      "hora": "2026-09-26T13:53:30Z",
      "cliente": "core.http.HttpClient.condicional",
      "sha256": "d17d198a8819d671465cb9d8ae78057a4005d127e75feb42b04234ab106fab69",
      "campo": "Dimensoes.Descricao_Dim[0].nota_dsg"
    }
  },
  "rp1-rsi": {
    "publicador": "INE",
    "documento": "INE · conceito e fórmula dos beneficiários do rendimento social de inserção",
    "url": "https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0013420&lingua=PT",
    "lido": "2026-09-26",
    "lingua": "pt",
    "excerto": "RENDIMENTO SOCIAL DE INSERÇÃO : Prestação incluída no subsistema de solidariedade e num programa de inserção, de modo a conferir às pessoas e aos seus agregados familiares apoios adaptados à sua situação pessoal, que contribuam para a satisfação das suas necessidades essenciais e que favoreçam a progressiva inserção laboral, social e comunitária. PERÍODO DE REFERÊNCIA : Período a que a informação se refere e que pode ser um dia específico ou um intervalo de tempo (mês, ano fiscal, ano civil, entre outros). Fórmula (Beneficiárias/os do rendimento social de inserção, da segurança social/ População média em idade ativa)*1000",
    "selo": {
      "motor": "indicators/out/rp1-2026-09-26/014-ine-0013420-minfo.html",
      "hora": "2026-09-26T13:54:54Z",
      "cliente": "core.http.HttpClient.condicional",
      "sha256": "570b07a4e928a33ecb7c888ac590804e3737c92ab8186c4aff1cc6efca3276e8",
      "campo": "texto normalizado da página"
    }
  },
  "rp1-pobreza": {
    "publicador": "Eurostat",
    "documento": "Eurostat · Glossary: At-risk-of-poverty rate",
    "url": "https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Glossary:At-risk-of-poverty_rate",
    "lido": "2026-09-26",
    "lingua": "en",
    "excerto": "The at-risk-of-poverty rate is the share of people with an equivalised disposable income (after social transfer) below the at-risk-of-poverty threshold , which is set at 60 % of the national median equivalised disposable income after social transfers .",
    "selo": {
      "motor": "indicators/out/rp1-2026-09-26/019-eurostat-linha-pobreza.html",
      "hora": "2026-09-26T13:56:16Z",
      "cliente": "core.http.HttpClient.condicional",
      "sha256": "d061b54fef6dbdb32861a6f6808614b91b543bc5fb92b534d984d4463960f1aa",
      "campo": "texto normalizado da página"
    }
  },
  "rp1-pobreza-periodo": {
    "publicador": "Eurostat",
    "documento": "Eurostat · Income and living conditions, reference period",
    "url": "https://ec.europa.eu/eurostat/cache/metadata/en/ilc_sieusilc.htm",
    "lido": "2026-09-26",
    "lingua": "en",
    "excerto": "For all countries, the reference period for income variables in EU-SILC is the previous calendar year.",
    "selo": {
      "motor": "indicators/out/rp1-2026-09-26/026-eurostat-ilc-metadados.html",
      "hora": "2026-09-26T14:11:34Z",
      "cliente": "core.http.HttpClient.condicional",
      "sha256": "592c5e3aec0558d5dc49e26ce76a6c3be6e6f15230d448847a5065d2a4894fb3",
      "campo": "texto normalizado da página"
    }
  },
  "rp1-rendimento-equivalente": {
    "publicador": "Eurostat",
    "documento": "Statistics Explained · Glossary: Equivalised disposable income",
    "url": "https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Glossary:Equivalised_disposable_income",
    "lido": "2026-09-26",
    "lingua": "en",
    "excerto": "in order to reflect differences in a household's size and composition, the total (net) household income is divided by the number of 'equivalent adults’, using a standard (equivalence) scale: the modified OECD scale;",
    "selo": {
      "motor": "indicators/out/l1-2026-09-26/eurostat-se-glossary-equivalised-disposable-income.html",
      "campo": "o texto da página",
      "hora": "2026-09-26T08:30:13Z",
      "cliente": "core.http.HttpClient.condicional",
      "sha256": "f7f7ac15b21e6ff90fba33d8030decccb6c23941995769be186d82b424034988"
    }
  },
  "rp1-remuneracao-subsidios": {
    "publicador": "INE",
    "documento": "INE · conceito de remuneração bruta",
    "url": "https://smi.ine.pt/UploadFile/Download/2576",
    "lido": "2026-09-26",
    "lingua": "pt",
    "excerto": "Nas componentes não regulares (tais como “Prémios, bónus ou subsídios de carácter não mensal”, “Subsídio de férias” e “Subsídio de Natal”)",
    "selo": {
      "motor": "indicators/out/rp1-2026-09-26/018-ine-remuneracao-metodologia.pdf",
      "hora": "2026-09-26T13:56:15Z",
      "cliente": "core.http.HttpClient.condicional",
      "sha256": "fc9970809cc4d21fd421961a72e323b946184414d0348bce968011eee9d2cdae",
      "campo": "texto da extração metodológica",
      "extracao": {
        "ficheiro": "indicators/out/rp1-2026-09-26/018-ine-remuneracao-metodologia.txt",
        "sha256": "bf461ab0301192a42403a8491b792a949cc68a5f0ce0502968ed548d75478500",
        "ferramenta": "pdftotext version 26.03.0, modo simples"
      }
    }
  },
  "rp1-pensoes-tipos": {
    "publicador": "INE",
    "documento": "INE · metainformação do valor médio das pensões",
    "url": "https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0014532&lingua=PT",
    "lido": "2026-09-26",
    "lingua": "pt",
    "excerto": "PENSÃO : Prestação pecuniária mensal de atribuição continuada por morte (sobrevivência), invalidez, doença profissional e velhice.",
    "selo": {
      "motor": "indicators/out/rp1-2026-09-26/013-ine-0014532-minfo.html",
      "hora": "2026-09-26T13:54:49Z",
      "cliente": "core.http.HttpClient.condicional",
      "sha256": "b974d064c0cc5a35069232a83ce9ea72fbf43460c3744335d48f9e80ceed7789",
      "campo": "texto normalizado da página"
    }
  }
};
