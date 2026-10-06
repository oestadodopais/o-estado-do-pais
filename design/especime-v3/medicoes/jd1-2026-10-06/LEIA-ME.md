# JD1 · juros e dívida do Estado

Relatório gerado pelos livros e pelos registos reais. A leitura a frio do Opus e a conferência do lugar de direção ficam por realizar.

Comando: `RESEARCHHUB_DIR=<motor> python3 design/especime-v3/medicoes/jd1-2026-10-06/medir.py --final`. As contagens estão em `medicoes.json`; as provas em `plantas.json`; os pedidos originais e as extrações em `<motor>/indicators/out/jd1-2026-10-06/`.

O bloco acrescenta 14 linhas: 12 leituras diretas e 2 percentagens calculadas sobre operandos do livro. Tem 10 famílias novas e 0 linhas novas por confirmar na fonte.

## Cabeças do código e portões

Sítio: `e7a433e983ebdc69130d7d0c3b81c0b2539a3b83`. Motor: `f503a5b1155657d638068d478d66163de429546a`.

| Portão | Código lido do ficheiro |
|---|---:|
| build | 0 |
| verify | 0 |
| typecheck | 0 |
| motor | 0 |

Os portões do sítio correm com `RESEARCHHUB_DIR=<motor> sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/jd1-2026-10-06/portoes`, pela tranca comum. O motor corre `python3 -m core.gate`. O guião `correr.py` guarda o código real do processo e retira caminhos pessoais dos registos, sem alterar os códigos escritos pelo guião dos portões. Os ficheiros de código de saída são conservados em `portoes/`. Os commits posteriores que só guardem medições e capturas não mudam as cabeças do código.

## Linhas

O valor direto conserva a escrita da fonte. O livro apresenta separadores portugueses, sem converter unidades. Nas linhas calculadas o valor é o resultado da conta, não uma percentagem impressa pelo INE.

| Linha | Valor da fonte ou cálculo | Unidade | Documento e localizador |
|---|---:|---|---|
| `juros-das-administracoes-publicas-2024` | 5 983,4 | milhões de euros | Procedimento dos Défices Excessivos, Setembro de 2026; Quadro 9, Juros (D.41), coluna 2024, p. 12 |
| `pib-nominal-notificacao-setembro-2024` | 291 152,8 | milhões de euros | Procedimento dos Défices Excessivos, Setembro de 2026; Quadro 1, Produto Interno Bruto, a preços de mercado, coluna 2024, p. 2 |
| `juros-das-administracoes-publicas-pib-2024` | cálculo: 2.06 | % do PIB | Cálculo sobre juros-das-administracoes-publicas-2024, pib-nominal-notificacao-setembro-2024 |
| `juros-das-administracoes-publicas-2025` | 6 028,2 | milhões de euros | Procedimento dos Défices Excessivos, Setembro de 2026; Quadro 9, Juros (D.41), coluna 2025, p. 12 |
| `pib-nominal-notificacao-setembro-2025` | 308 538,2 | milhões de euros | Procedimento dos Défices Excessivos, Setembro de 2026; Quadro 1, Produto Interno Bruto, a preços de mercado, coluna 2025, p. 2 |
| `juros-das-administracoes-publicas-pib-2025` | cálculo: 1.95 | % do PIB | Cálculo sobre juros-das-administracoes-publicas-2025, pib-nominal-notificacao-setembro-2025 |
| `juros-das-administracoes-publicas-2025-ue` | 1.9 | % do PIB | Government revenue, expenditure and main aggregates, gov_10a_main; freq=A; unit=PC_GDP; sector=S13; na_item=D41PAY; geo=EU27_2020; time=2025; value[0] |
| `juros-e-outros-encargos-execucao-2025-08` | 4 727,8 | milhões de euros | Síntese da Execução Orçamental, agosto 2026; Quadro 1, Conta consolidada das Administrações Públicas, execução acumulada 2025, janeiro a agosto, folha 7 do PDF (numeração impressa: 3) |
| `juros-e-outros-encargos-execucao-2026-08` | 5 218,2 | milhões de euros | Síntese da Execução Orçamental, agosto 2026; Quadro 1, Conta consolidada das Administrações Públicas, execução acumulada 2026, janeiro a agosto, folha 7 do PDF (numeração impressa: 3) |
| `custo-do-stock-da-divida-direta-2025` | 2,1 | % | Boletim Mensal, setembro de 2026; Custo da dívida direta do Estado, Custo do stock da dívida, ponto 2025, p. 3; definição na nota 6 da folha 5 |
| `custo-da-divida-emitida-2026-08` | 3,4 | % | Boletim Mensal, setembro de 2026; Custo da dívida direta do Estado, Custo da dívida emitida, ponto 2026, p. 3; definição na nota 6 da folha 5 |
| `divida-direta-do-estado-2026-08` | 315.856 | milhões de euros | Boletim Mensal, setembro de 2026; Movimento da dívida direta do Estado, Dívida total / Total debt, saldo em 31/ago/26, p. 2 |
| `necessidades-brutas-de-financiamento-2025` | 67 601 | milhões de euros | Gestão da Tesouraria do Estado e da Dívida Pública · Relatório Anual 2025, 2025; Quadro 9, 3. NECESSIDADES BRUTAS DE FINANCIAMENTO (1. + 2.), coluna 2025, p. 45 |
| `emissoes-de-divida-fundada-2025` | 65 214 | milhões de euros | Gestão da Tesouraria do Estado e da Dívida Pública · Relatório Anual 2025, 2025; Quadro 9, p.m. EMISSÕES DE DÍVIDA NO ANO CIVIL (Dívida Fundada), coluna 2025, p. 45 |

## Excertos e frases com os apoios

### juros-das-administracoes-publicas-2024

Fonte: https://www.ine.pt/ngt_server/attachfileu.jsp?look_parentBoui=816377733&att_display=n&att_download=y. Acesso: 2026-10-06T10:45:57Z. Corpo: `jd1/ine-pde-setembro-2026.pdf`. SHA-256: `58696e3c11ed4233c7a06a8fce374043de7ce6ca57898064c52bc7b9faff673d`.

```text
     Juros                                                                                      D.41             5 983,4          6 028,2            0,7
```

Português: É a despesa em juros das administrações públicas, nas contas nacionais.

Inglês: It is interest expenditure by general government, in national accounts.

Apoios, parte a parte:

- «É a despesa em juros»: própria linha: name «Juros»; jd1-ine-despesa: excerto «O quadro 9 apresenta a despesa».
- « das administrações públicas»: jd1-ine-ambito: excerto «Administrações Públicas».
- «, nas contas nacionais»: jd1-ine-ambito: excerto «Sistema Europeu de Contas Nacionais e Regionais 2010».

### pib-nominal-notificacao-setembro-2024

Fonte: https://www.ine.pt/ngt_server/attachfileu.jsp?look_parentBoui=816377733&att_display=n&att_download=y. Acesso: 2026-10-06T10:45:57Z. Corpo: `jd1/ine-pde-setembro-2026.pdf`. SHA-256: `58696e3c11ed4233c7a06a8fce374043de7ce6ca57898064c52bc7b9faff673d`.

```text
    Produto Interno Bruto, a preços de mercado                B.1*g        243 957,1       270 352,6       291 152,8     308 538,2       322 702,9
```

Português: É o produto interno bruto a preços de mercado.

Inglês: It is gross domestic product at market prices.

Apoios, parte a parte:

- «É o produto interno bruto a preços de mercado»: própria linha: name «Produto Interno Bruto, a preços de mercado».

### juros-das-administracoes-publicas-pib-2024

Dividir os juros das administrações públicas pelo produto interno bruto a preços de mercado do mesmo ano, na mesma notificação do INE, e multiplicar por cem. Arredondar a duas casas decimais, com as metades para fora de zero.

`round ( juros-das-administracoes-publicas-2024 / pib-nominal-notificacao-setembro-2024 * 100 , 2 )`

Português: São os juros das administrações públicas em percentagem do produto interno bruto do mesmo ano, calculados a partir dos dois montantes da mesma notificação do INE.

Inglês: It is general government interest expenditure as a percentage of gross domestic product for the same year, calculated from both amounts in the same INE notification.

Apoios, parte a parte:

- «São os juros das administrações públicas em percentagem do produto interno bruto do mesmo ano»: própria linha: derivation «Dividir os juros das administrações públicas pelo produto interno bruto a preços de mercado do mesmo ano»; própria linha: derivation «multiplicar por cem».
- «, calculados a partir dos dois montantes da mesma notificação do INE»: própria linha: derivation «na mesma notificação do INE».

### juros-das-administracoes-publicas-2025

Fonte: https://www.ine.pt/ngt_server/attachfileu.jsp?look_parentBoui=816377733&att_display=n&att_download=y. Acesso: 2026-10-06T10:45:57Z. Corpo: `jd1/ine-pde-setembro-2026.pdf`. SHA-256: `58696e3c11ed4233c7a06a8fce374043de7ce6ca57898064c52bc7b9faff673d`.

```text
     Juros                                                                                      D.41             5 983,4          6 028,2            0,7
```

Português: É a despesa em juros das administrações públicas, nas contas nacionais.

Inglês: It is interest expenditure by general government, in national accounts.

Apoios, parte a parte:

- «É a despesa em juros»: própria linha: name «Juros»; jd1-ine-despesa: excerto «O quadro 9 apresenta a despesa».
- « das administrações públicas»: jd1-ine-ambito: excerto «Administrações Públicas».
- «, nas contas nacionais»: jd1-ine-ambito: excerto «Sistema Europeu de Contas Nacionais e Regionais 2010».

### pib-nominal-notificacao-setembro-2025

Fonte: https://www.ine.pt/ngt_server/attachfileu.jsp?look_parentBoui=816377733&att_display=n&att_download=y. Acesso: 2026-10-06T10:45:57Z. Corpo: `jd1/ine-pde-setembro-2026.pdf`. SHA-256: `58696e3c11ed4233c7a06a8fce374043de7ce6ca57898064c52bc7b9faff673d`.

```text
    Produto Interno Bruto, a preços de mercado                B.1*g        243 957,1       270 352,6       291 152,8     308 538,2       322 702,9
```

Português: É o produto interno bruto a preços de mercado.

Inglês: It is gross domestic product at market prices.

Apoios, parte a parte:

- «É o produto interno bruto a preços de mercado»: própria linha: name «Produto Interno Bruto, a preços de mercado».

### juros-das-administracoes-publicas-pib-2025

Dividir os juros das administrações públicas pelo produto interno bruto a preços de mercado do mesmo ano, na mesma notificação do INE, e multiplicar por cem. Arredondar a duas casas decimais, com as metades para fora de zero.

`round ( juros-das-administracoes-publicas-2025 / pib-nominal-notificacao-setembro-2025 * 100 , 2 )`

Português: São os juros das administrações públicas em percentagem do produto interno bruto do mesmo ano, calculados a partir dos dois montantes da mesma notificação do INE.

Inglês: It is general government interest expenditure as a percentage of gross domestic product for the same year, calculated from both amounts in the same INE notification.

Apoios, parte a parte:

- «São os juros das administrações públicas em percentagem do produto interno bruto do mesmo ano»: própria linha: derivation «Dividir os juros das administrações públicas pelo produto interno bruto a preços de mercado do mesmo ano»; própria linha: derivation «multiplicar por cem».
- «, calculados a partir dos dois montantes da mesma notificação do INE»: própria linha: derivation «na mesma notificação do INE».

### juros-das-administracoes-publicas-2025-ue

Fonte: https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_main?lang=EN&freq=A&sector=S13&na_item=D41PAY&geo=EU27_2020&unit=PC_GDP&time=2025. Acesso: 2026-10-06T10:46:25Z. Corpo: `jd1/eurostat-juros-EU27_2020-PC_GDP-2025.json`. SHA-256: `2e5b39eccba8b3ea9fddb04a4265bae436a09fb0ccdc5491da5b147338e495f9`.

```text
{"version":"2.0","class":"dataset","label":"Government revenue, expenditure and main aggregates","source":"ESTAT","updated":"2026-07-21T11:00:00+0200","value":{"0":1.9},"id":["freq","unit","sector","na_item","geo","time"],"size":[1,1,1,1,1,1],"dimension":{"freq":{"label":"Time frequency","category":{"index":{"A":0},"label":{"A":"Annual"}}},"unit":{"label":"Unit of measure","category":{"index":{"PC_GDP":0},"label":{"PC_GDP":"Percentage of gross domestic product (GDP)"}}},"sector":{"label":"Sector","category":{"index":{"S13":0},"label":{"S13":"General government"}}},"na_item":{"label":"National accounts indicator (ESA 2010)","category":{"index":{"D41PAY":0},"label":{"D41PAY":"Interest, expenditure"}}},"geo":{"label":"Geopolitical entity (reporting)","category":{"index":{"EU27_2020":0},"label":{"EU27_2020":"European Union - 27 countries (from 2020)"}}},"time":{"label":"Time","category":{"index":{"2025":0},"label":{"2025":"2025"}}}},"extension":{"lang":"EN","id":"GOV_10A_MAIN","agencyId":"ESTAT","version":"1.0","datastructure":{"id":"GOV_10A_MAIN","agencyId":"ESTAT","version":"73.0"},"annotation":[{"type":"CREATED","date":"2014-10-21T09:58:50+0200"},{"type":"DISSEMINATION_DOI_XML","title":"<adms:identifier xmlns:adms=\"http://www.w3.org/ns/adms#\" xmlns:skos=\"http://www.w3.org/2004/02/skos/core.html\" xmlns:dct=\"http://purl.org/dc/terms/\" xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"><adms:Identifier rdf:about=\"https://doi.org/10.2908/GOV_10A_MAIN\"><skos:notation rdf:datatype=\"http://purl.org/spar/datacite/doi\">10.2908/GOV_10A_MAIN</skos:notation><dct:creator rdf:resource=\"http://publications.europa.eu/resource/authority/corporate-body/ESTAT\"/><dct:issued rdf:datatype=\"http://www.w3.org/2001/XMLSchema#date\">2023-01-23</dct:issued></adms:Identifier></adms:identifier>"},{"type":"DISSEMINATION_OBJECT_TYPE","title":"DATASET"},{"type":"DISSEMINATION_TIMESTAMP_DATA","date":"2026-07-21T11:00:00+0200"},{"type":"DISSEMINATION_TIMESTAMP_GLOBAL","date":"2026-07-21T11:00:00+0200"},{"type":"DISSEMINATION_TIMESTAMP_PLANNED","date":"2026-07-21T11:00:00+0200"},{"type":"ESMS_HTML","title":"Explanatory texts (metadata)","href":"https://ec.europa.eu/eurostat/cache/metadata/en/gov_10a_main_esms.htm"},{"type":"ESMS_SDMX","title":"Explanatory texts (metadata)","href":"https://ec.europa.eu/eurostat/api/dissemination/files?file=metadata/gov_10a_main_esms.sdmx.zip"},{"type":"OBS_COUNT","title":"1178951"},{"type":"OBS_PERIOD_OVERALL_LATEST","title":"2025"},{"type":"OBS_PERIOD_OVERALL_OLDEST","title":"1975"},{"type":"SOURCE_INSTITUTIONS","text":"Eurostat"},{"type":"UPDATE_DATA","date":"2026-07-21T11:00:00+0200"},{"type":"UPDATE_STRUCTURE","date":"2026-04-22T11:00:00+0200"}],"positions-with-no-data":{"freq":[],"unit":[],"sector":[],"na_item":[],"geo":[],"time":[]}}}
```

Português: É a despesa das administrações públicas em juros no conjunto da União Europeia, em percentagem do PIB.

Inglês: It is general government interest expenditure across the European Union, as a percentage of GDP.

Apoios, parte a parte:

- «É a despesa das administrações públicas em juros»: própria linha: excerpt «Interest, expenditure»; própria linha: excerpt «General government».
- « no conjunto da União Europeia»: própria linha: excerpt «European Union - 27 countries (from 2020)».
- «, em percentagem do PIB»: própria linha: excerpt «Percentage of gross domestic product (GDP)».

### juros-e-outros-encargos-execucao-2025-08

Fonte: https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf. Acesso: 2026-10-06T10:46:01Z. Corpo: `jd1/eo-execucao-agosto-2026.pdf`. SHA-256: `8c4fb11b5f2fc55be8ee2424a1d7bfd8d428ca4adf29c0899d033ea79c5586f5`.

```text
    Juros e outros encargos                  4 727,8        5 218,2      490,4         10,4          0,6      4 562,4      5 056,6       494,2          10,8
```

Português: É a despesa consolidada das administrações públicas com juros e outros encargos, acumulada de janeiro a agosto, na ótica dos pagamentos.

Inglês: It is consolidated general government expenditure on interest and other charges, accumulated from January to August, on a payments basis.

Apoios, parte a parte:

- «É a despesa consolidada das administrações públicas com juros e outros encargos»: própria linha: name «Juros e outros encargos»; jd1-eo-conta: excerto «Conta consolidada das Administrações Públicas»; jd1-eo-conta: excerto «Despesa corrente».
- «, acumulada de janeiro a agosto»: jd1-eo-conta: excerto «Período: janeiro a agosto».
- «, na ótica dos pagamentos»: jd1-eo-caixa: excerto «pagamentos e recebimentos ocorridos em determinado período».

### juros-e-outros-encargos-execucao-2026-08

Fonte: https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf. Acesso: 2026-10-06T10:46:01Z. Corpo: `jd1/eo-execucao-agosto-2026.pdf`. SHA-256: `8c4fb11b5f2fc55be8ee2424a1d7bfd8d428ca4adf29c0899d033ea79c5586f5`.

```text
    Juros e outros encargos                  4 727,8        5 218,2      490,4         10,4          0,6      4 562,4      5 056,6       494,2          10,8
```

Português: É a despesa consolidada das administrações públicas com juros e outros encargos, acumulada de janeiro a agosto, na ótica dos pagamentos.

Inglês: It is consolidated general government expenditure on interest and other charges, accumulated from January to August, on a payments basis.

Apoios, parte a parte:

- «É a despesa consolidada das administrações públicas com juros e outros encargos»: própria linha: name «Juros e outros encargos»; jd1-eo-conta: excerto «Conta consolidada das Administrações Públicas»; jd1-eo-conta: excerto «Despesa corrente».
- «, acumulada de janeiro a agosto»: jd1-eo-conta: excerto «Período: janeiro a agosto».
- «, na ótica dos pagamentos»: jd1-eo-caixa: excerto «pagamentos e recebimentos ocorridos em determinado período».

### custo-do-stock-da-divida-direta-2025

Fonte: https://www.igcp.pt/sites/default/files/2026-09/BM_set26.pdf. Acesso: 2026-10-06T10:46:05Z. Corpo: `jd1/igcp-boletim-setembro-2026.pdf`. SHA-256: `e327feb73d210f958b1a40b3c86d6c681b686629416f070946902e00310392cb`.

```text
    Custo e estrutura da dívida                                                                                                                                                               Cost and debt structure
Custo da dívida direta do Estado (6)                                             State direct debt cost (6)                  Custo e maturidade dos empréstimos PAEF (7)                                    Cost and maturity of EU-IMF loans (7)
[%]                                                                                                   [%]                    [ago-2026]                                                                                              [Aug-2026]

                    Custo da dívida emitida / Cost of Issuance per
6                   year                                                                                                                       Montante                           Maturidade média final                                         Maturidade média
                                                                                                                                                                Custo all-in                                             Saldo vivo /
                                                                                                                                            desembolsado /                     desde data do desembolso /                                          residual final /
                    Custo do stock da dívida / Cost of Debt                                                                     Entidade /                      estimado /                                              Outstanding
                    Outstanding                                                                                                            Amount disbursed                    Final average maturity since                                    Final average residual
                                                                                                                                  Entity                      Estimated all in                                        (EUR mil milhões /
4                                                                                                                                          (EUR mil milhões /                       disbursement date                                                 maturity
                                                                               3,5                                                                                  cost                                                 EUR billion )
         3,2                                                                               3,4         3,4       3,4                          EUR billion )                            (anos / years )                                             (anos / years )
                    3,0           2,8
          2,8                             2,5
2                   2,6                           2,2                          2,0         2,1         2,1
                                  1,8                      1,9          1,7                                                     EFSM                 24,1              2,2%                   19,1                          19,8                        5,5
                                          1,1                           1,7
                                                  0,5      0,6                                                                  EFSF                 26,0              1,9%                   20,4                          23,0                        8,1
0
        2016       2017      2018        2019     2020    2021        2022     2023      2024 2025 2026
                                                                                             Fonte/Source: IGCP                                                                                                                             Fonte/Source: IGCP
```

Português: É a relação entre os juros do subsetor Estado nas contas nacionais e o saldo médio da dívida direta do Estado no final de dois anos consecutivos.

Inglês: It is the ratio of State subsector interest costs in national accounts to average State direct debt outstanding at the end of two consecutive years.

Apoios, parte a parte:

- «É a relação entre os juros do subsetor Estado nas contas nacionais»: jd1-igcp-custo: excerto «rácio entre juros do subsetor Estado na ótica de Contas Nacionais».
- « e o saldo médio da dívida direta do Estado no final de dois anos consecutivos»: jd1-igcp-custo: excerto «saldo médio da dívida direta do Estado no final dos anos t e t-1».

### custo-da-divida-emitida-2026-08

Fonte: https://www.igcp.pt/sites/default/files/2026-09/BM_set26.pdf. Acesso: 2026-10-06T10:46:05Z. Corpo: `jd1/igcp-boletim-setembro-2026.pdf`. SHA-256: `e327feb73d210f958b1a40b3c86d6c681b686629416f070946902e00310392cb`.

```text
    Custo e estrutura da dívida                                                                                                                                                               Cost and debt structure
Custo da dívida direta do Estado (6)                                             State direct debt cost (6)                  Custo e maturidade dos empréstimos PAEF (7)                                    Cost and maturity of EU-IMF loans (7)
[%]                                                                                                   [%]                    [ago-2026]                                                                                              [Aug-2026]

                    Custo da dívida emitida / Cost of Issuance per
6                   year                                                                                                                       Montante                           Maturidade média final                                         Maturidade média
                                                                                                                                                                Custo all-in                                             Saldo vivo /
                                                                                                                                            desembolsado /                     desde data do desembolso /                                          residual final /
                    Custo do stock da dívida / Cost of Debt                                                                     Entidade /                      estimado /                                              Outstanding
                    Outstanding                                                                                                            Amount disbursed                    Final average maturity since                                    Final average residual
                                                                                                                                  Entity                      Estimated all in                                        (EUR mil milhões /
4                                                                                                                                          (EUR mil milhões /                       disbursement date                                                 maturity
                                                                               3,5                                                                                  cost                                                 EUR billion )
         3,2                                                                               3,4         3,4       3,4                          EUR billion )                            (anos / years )                                             (anos / years )
                    3,0           2,8
          2,8                             2,5
2                   2,6                           2,2                          2,0         2,1         2,1
                                  1,8                      1,9          1,7                                                     EFSM                 24,1              2,2%                   19,1                          19,8                        5,5
                                          1,1                           1,7
                                                  0,5      0,6                                                                  EFSF                 26,0              1,9%                   20,4                          23,0                        8,1
0
        2016       2017      2018        2019     2020    2021        2022     2023      2024 2025 2026
                                                                                             Fonte/Source: IGCP                                                                                                                             Fonte/Source: IGCP
```

Português: É o custo médio da dívida emitida no ano, nos instrumentos BT, OT, OTRV e MTN, ponderado pelo montante e pelo prazo.

Inglês: It is the average cost of debt issued during the year through BT, OT, OTRV and MTN instruments, weighted by amount and maturity.

Apoios, parte a parte:

- «É o custo médio da dívida emitida no ano, nos instrumentos BT, OT, OTRV e MTN»: jd1-igcp-custo: excerto «custo médio dos BT, OT, OTRV e MTN emitidos no ano correspondente».
- «, ponderado pelo montante e pelo prazo»: jd1-igcp-custo: excerto «ponderado pelo montante e maturidade».

### divida-direta-do-estado-2026-08

Fonte: https://www.igcp.pt/sites/default/files/2026-09/BM_set26.pdf. Acesso: 2026-10-06T10:46:05Z. Corpo: `jd1/igcp-boletim-setembro-2026.pdf`. SHA-256: `e327feb73d210f958b1a40b3c86d6c681b686629416f070946902e00310392cb`.

```text
Dívida total / Total debt                                                                                       315.237           73.275        74.137           592          314.966             5.109       4.217                 (1)             315.856
```

Português: É o total da dívida direta do Estado no fim de agosto.

Inglês: It is total State direct debt at the end of August.

Apoios, parte a parte:

- «É o total da dívida direta do Estado»: própria linha: name «Dívida total»; jd1-igcp-divida: excerto «Dívida Direta do Estado».
- « no fim de agosto»: própria linha: document.locator «saldo em 31/ago/26».

### necessidades-brutas-de-financiamento-2025

Fonte: https://www.igcp.pt/sites/default/files/2026-08/RA2025_signed.pdf. Acesso: 2026-10-06T10:46:05Z. Corpo: `jd1/igcp-relatorio-anual-2025.pdf`. SHA-256: `f36c17f0f95b0e35c8f87323fd48f7fde0e9cc84228a5444f94058ac3f0e3f2f`.

```text
          3. NECESSIDADES BRUTAS DE FINANCIAMENTO (1. + 2.)                          57 174       67 601
```

Português: É o financiamento de que o Estado precisou, somando as necessidades líquidas às amortizações e anulações de dívida fundada, em contabilidade orçamental pública.

Inglês: It is the financing the State needed, adding net financing needs to redemptions and cancellations of funded debt, on a public budget accounting basis.

Apoios, parte a parte:

- «É o financiamento de que o Estado precisou, somando as necessidades líquidas às amortizações e anulações de dívida fundada»: própria linha: name «NECESSIDADES BRUTAS DE FINANCIAMENTO (1. + 2.)»; jd1-igcp-financiamento: excerto «1. NECESSIDADES LÍQUIDAS DE FINANCIAMENTO»; jd1-igcp-financiamento: excerto «2. AMORTIZAÇÕES E ANULAÇÕES (Dívida Fundada)».
- «, em contabilidade orçamental pública»: jd1-igcp-financiamento: excerto «contabilidade orçamental pública».

### emissoes-de-divida-fundada-2025

Fonte: https://www.igcp.pt/sites/default/files/2026-08/RA2025_signed.pdf. Acesso: 2026-10-06T10:46:05Z. Corpo: `jd1/igcp-relatorio-anual-2025.pdf`. SHA-256: `f36c17f0f95b0e35c8f87323fd48f7fde0e9cc84228a5444f94058ac3f0e3f2f`.

```text
          p.m. EMISSÕES DE DÍVIDA NO ANO CIVIL (Dívida Fundada)                      56 285       65 214
```

Português: É o montante de dívida fundada que o Estado emitiu no ano civil, em contabilidade orçamental pública.

Inglês: It is the amount of funded debt the State issued during the calendar year, on a public budget accounting basis.

Apoios, parte a parte:

- «É o montante de dívida fundada que o Estado emitiu no ano civil»: própria linha: name «EMISSÕES DE DÍVIDA NO ANO CIVIL (Dívida Fundada)»; jd1-igcp-financiamento: excerto «financiamento do Estado».
- «, em contabilidade orçamental pública»: jd1-igcp-financiamento: excerto «contabilidade orçamental pública».

## Série

`serie-obrigacoes-do-tesouro-10-anos-rendibilidade`: 488 pontos mensais, desde 1986-01 até 2026-08, com 0 lacunas declaradas. Último ponto: **3,53700 %**, período **2026-08**.

O início do pedido veio do índice de conteúdos recebido nesta corrida. A unidade foi relida na ficha de metadados: «All the yields are expressed in percentages per annum.» A série mostra a rendibilidade de obrigações no mercado secundário, antes de impostos, com maturidade residual próxima de dez anos; não é o custo da emissão do IGCP.

Excerto literal do último ponto:

```text
"2026-08":559 · "559":3.53700
```

A declaração e a identidade da série vivem em `publisher/dominios_series.py`. O corredor correu com seleção explícita desta série, relendo o corpo já recebido pelo cliente da casa, e reconstruiu e comparou as restantes. O relatório está em `<motor>/indicators/out/jd1-2026-10-06/series/corredor.json`. A exportação foi feita por `publisher/export_series.py`, com as conferências de travessia e idempotência.

Português: É a taxa de rendibilidade das obrigações do Estado português negociadas no mercado secundário, antes de impostos, com prazo restante próximo de dez anos, apresentada mês a mês.

Inglês: It is the yield on central government bonds in Portugal traded on the secondary market, before tax, with a remaining maturity of around ten years, reported monthly.

Apoios da frase da série, parte a parte:

- «É a taxa de rendibilidade das obrigações do Estado»: jd1-eurostat-obrigacoes: excerto «central government bond yields».
- « português»: própria série: document.edition «geo=PT».
- « negociadas no mercado secundário, antes de impostos»: jd1-eurostat-obrigacoes: excerto «on the secondary market, gross of tax».
- «, com prazo restante próximo de dez anos»: jd1-eurostat-obrigacoes: excerto «with a residual maturity of around 10 years».
- «, apresentada mês a mês»: própria série: name «monthly data».

## Pedidos e extrações

Pedidos efetivos: **19**, dos quais **18** responderam com HTTP 200. O registo copiado para a pasta do corredor não conta como um novo pedido. Extrações registadas: **6**, incluindo a coluna portuguesa da nota do IGCP.

| Ficheiro | Estado | HTTP | Endereço | SHA-256 |
|---|---|---:|---|---|
| `001-ine-pde-setembro-2026.pdf` | recusado | sem resposta | https://www.ine.pt/ngt_server/attachfileu.jsp?look_parentBoui=816377733&att_display=n&att_download=y | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `002-ine-pde-setembro-2026.pdf` | lido | 200 | https://www.ine.pt/ngt_server/attachfileu.jsp?look_parentBoui=816377733&att_display=n&att_download=y | `58696e3c11ed4233c7a06a8fce374043de7ce6ca57898064c52bc7b9faff673d` |
| `003-ine-pde-setembro-2026.xlsx` | lido | 200 | https://www.ine.pt/ngt_server/attachfileu.jsp?look_parentBoui=816378100&att_display=n&att_download=y | `8017c71d7257b58d551eed7bb315d8e66a721fc75450c9aec965539249f7b3a8` |
| `004-eo-execucao-agosto-2026.pdf` | lido | 200 | https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026.pdf | `8c4fb11b5f2fc55be8ee2424a1d7bfd8d428ca4adf29c0899d033ea79c5586f5` |
| `005-eo-execucao-agosto-2026.xlsx` | lido | 200 | https://www.eo.gov.pt/execucaoorcamental/SintesedaExecucaoOrcamentalMensal/2026/setembro/0926-SinteseExecucaoOrcamental_agosto2026_AnexoEstatistico_vPT_VUK.xlsx | `448789ab49c7d764afe8f4f89dfa3385f1ec22ccf2d40ef6e2f677af14c96b2c` |
| `006-igcp-boletim-setembro-2026.pdf` | lido | 200 | https://www.igcp.pt/sites/default/files/2026-09/BM_set26.pdf | `e327feb73d210f958b1a40b3c86d6c681b686629416f070946902e00310392cb` |
| `007-igcp-relatorio-anual-2025.pdf` | lido | 200 | https://www.igcp.pt/sites/default/files/2026-08/RA2025_signed.pdf | `f36c17f0f95b0e35c8f87323fd48f7fde0e9cc84228a5444f94058ac3f0e3f2f` |
| `008-igcp-financiamento-setembro-2026.pdf` | lido | 200 | https://www.igcp.pt/sites/default/files/2026-09/PF20264TPT.pdf | `dc20a2b21a0133cc7ed8f7ef750042736720ce3c7d857f4209c8fa96076ecf84` |
| `009-eurostat-metadados-obrigacoes.html` | lido | 200 | https://ec.europa.eu/eurostat/cache/metadata/en/irt_lt_mcby_esms.htm | `6ab562de6933196bf29e8ad6417fec647094f2a7824df2b2f43e5a83881433a0` |
| `010-eurostat-toc.txt` | lido | 200 | https://ec.europa.eu/eurostat/api/dissemination/catalogue/toc/txt?lang=en | `919f7c173c920dedbaadf51183bf0e2a3b717df97d0522e24a0bc97dae18abe4` |
| `011-eurostat-juros-PT-MIO_EUR-2024.json` | lido | 200 | https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_main?lang=EN&freq=A&sector=S13&na_item=D41PAY&geo=PT&unit=MIO_EUR&time=2024 | `203040dd2ccbf094a9464bfaacaaad7e8194a166b745ef792c19309c6d0a420f` |
| `012-eurostat-juros-PT-MIO_EUR-2025.json` | lido | 200 | https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_main?lang=EN&freq=A&sector=S13&na_item=D41PAY&geo=PT&unit=MIO_EUR&time=2025 | `95a79002fc19d3ab79c129210c227bda080fa0ecd0baca695ad60bb0b5249bff` |
| `013-eurostat-juros-PT-PC_GDP-2024.json` | lido | 200 | https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_main?lang=EN&freq=A&sector=S13&na_item=D41PAY&geo=PT&unit=PC_GDP&time=2024 | `06ede0d0f30602edec9983a1868fdf4d61d58948323fcfc58970c5549d624e78` |
| `014-eurostat-juros-PT-PC_GDP-2025.json` | lido | 200 | https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_main?lang=EN&freq=A&sector=S13&na_item=D41PAY&geo=PT&unit=PC_GDP&time=2025 | `732d771f682e5467b9dcb6601ddb0266220a63ed1d5e5bae567e91a717818011` |
| `015-eurostat-juros-EU27_2020-MIO_EUR-2024.json` | lido | 200 | https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_main?lang=EN&freq=A&sector=S13&na_item=D41PAY&geo=EU27_2020&unit=MIO_EUR&time=2024 | `09dcbd121ddaf7e0a971c21034872052ce7841052642c09dc6d85722023af43e` |
| `016-eurostat-juros-EU27_2020-MIO_EUR-2025.json` | lido | 200 | https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_main?lang=EN&freq=A&sector=S13&na_item=D41PAY&geo=EU27_2020&unit=MIO_EUR&time=2025 | `1d9ea7b98785881bc04139ec17578c56dc5e8a232b8281762d1780c063f5ad4a` |
| `017-eurostat-juros-EU27_2020-PC_GDP-2024.json` | lido | 200 | https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_main?lang=EN&freq=A&sector=S13&na_item=D41PAY&geo=EU27_2020&unit=PC_GDP&time=2024 | `0fd7f80c1647e6ab62e4724520302c1936bf77f4187c753fe399b03d6b413b3f` |
| `018-eurostat-juros-EU27_2020-PC_GDP-2025.json` | lido | 200 | https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/gov_10a_main?lang=EN&freq=A&sector=S13&na_item=D41PAY&geo=EU27_2020&unit=PC_GDP&time=2025 | `2e5b39eccba8b3ea9fddb04a4265bae436a09fb0ccdc5491da5b147338e495f9` |
| `019-eurostat-obrigacoes-10-anos.json` | lido | 200 | https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/irt_lt_mcby_m?format=JSON&lang=EN&int_rt=MCBY&geo=PT&sinceTimePeriod=1980-01 | `e6ba45206d0ab0ad81f99e5e7fc649458df903352658deaeef82327f1e2e4f63` |

## O que ficou de fora e questões

- **JD1-1, versões das contas:** os valores portugueses do Eurostat são anteriores à notificação de setembro. Foram recebidos e conferidos, mas não substituem os juros portugueses do INE. A linha da União conserva o campo `updated` do corpo do Eurostat no excerto. Uma comparação usa duas versões das contas e deve dizê-lo.
- **JD1-2, percentagens não impressas:** o quadro dos juros não imprime a percentagem do PIB. Entraram as linhas do PIB da mesma notificação e as contas explícitas, com os operandos no livro. Não se reproduziram como se fossem percentagens publicadas pelo INE.
- **JD1-3, realizado e previsão:** a atualização do programa de financiamento foi recebida (HTTP 200) e lida nas páginas 1, 2 da extração `008-igcp-financiamento-setembro-2026.txt`. Tem previsões e um perímetro diferente do quadro anual de necessidades brutas; ficou como fonte de investigação, sem linha nova. A publicação anual fornece os montantes realizados usados no livro.
- **JD1-4, âmbito:** não se usou o BPstat. Não se criou cartão, bloco de primeira página ou explicação. A síntese orçamental não foi confundida com as contas nacionais e a dívida direta não foi confundida com a dívida de Maastricht.
- **JD1-5, pedido inicial:** a primeira tentativa do PDF do INE ficou recusada sem resposta HTTP; a repetição trouxe o documento. O pedido falhado permanece no registo, com corpo vazio e o respetivo resumo.
- **JD1-6, tranca comum:** à entrada dos portões, o ficheiro da tranca mostrou escritas sobrepostas de outra corrida e do JD1. A leitura está em `tranca.json`, com a hora e o resumo do guião. O guião pedido foi usado sem alterações; verifica a existência antes de escrever, pelo que a entrada não é atómica e não garante exclusão entre corridas simultâneas. Os códigos e os ficheiros da construção JD1 pertencem à sua própria worktree. O guião também não mantém uma fila de chegada; as leituras durante a espera registam as trocas de titular enquanto o JD1 aguardava. A correção da tranca fica para o lugar de direção.
- **JD1-7, enquadramento corrigido:** a primeira construção associava os juros portugueses em milhões de euros à linha da União em percentagem do PIB, apenas pelo identificador. A seleção passou a exigir unidade e período iguais. Uma conferência independente lê as referências no HTML dos recibos e recusa a unidade ou o período trocados; integra o `check:cartao`. A linha europeia mantém-se no livro, com a ressalva de versão descrita acima.

## Plantas e guardas

Os guiões registam 29 provas, das quais 27 são plantas. Cada recusa afirma a mensagem esperada; os ficheiros reais conservam-se. Comandos: `python3 -m publisher.jd1_test`, no motor; `node tests/linha/enquadramento-uniao.mjs --prova --out design/especime-v3/medicoes/jd1-2026-10-06/plantas-enquadramento.json` e o guião das capturas, no sítio.

| Planta | Mensagem exigida |
|---|---|
| Unidade do INE trocada | `JD1 INE: unidade diferente` |
| Anos da execução trocados | `JD1 EO: cabeçalho ausente ou ambíguo` |
| Corpo recebido alterado | `comprimento divergente` |
| União substituída por Portugal | `JD1 Eurostat: coordenada diferente geo` |
| PIB de outro ano na derivação | `JD1 derivação: unidades ou períodos diferentes` |
| Série desconhecida na seleção | `seleção de séries vazia ou desconhecida` |
| Unidade da taxa trocada | `a unidade não é confirmada pela ficha de metadados` |
| Referência europeia em percentagem junto dos juros em milhões | `Enquadramento da União: unidades diferentes em juros-das-administracoes-publicas-2025 e juros-das-administracoes-publicas-2025-ue` |
| Referência europeia de outro período | `Enquadramento da União: períodos diferentes em precos-da-habitacao-2025 e precos-da-habitacao-2025-ue` |
| Rótulo e endereço comprimidos na mesma fila | `O rótulo da página não fica acima do endereço.` |
| Uma porta a mais numa página anterior | `JD1 L1: uma página anterior mudou de destinos ou de multiplicidade.` |
| Um recibo novo com mais uma porta do Método | `JD1 L1: o recibo novo não conserva apenas as duas portas do Método.` |
| Uma página nova fora dos recibos declarados | `JD1 L1: as páginas novas não são exatamente os recibos declarados.` |
| Um recibo declarado em falta | `JD1 L1: as páginas novas não são exatamente os recibos declarados.` |
| O teto diverge da contagem guardada | `B1 L1: o teto tem de ser o número inteiro medido no registo.` |
| Duas portas novas na página da série | `L1 · páginas com dois destinos iguais fora da mobília: 2745, acima do teto 2744.` |
| JD1: página dos juros trocada | `ledger/claims/juros-das-administracoes-publicas-2024.yml: traz o rótulo "Juros" e o localizador "Quadro 9, Juros (D.41), coluna 2024, p. 13", que não é nenhuma das 18 formas que esta régua conhece (dimension.cofog99.category.label.GFnn · folha OE1 e célula do rótulo · Mapa1/Registos/Registo[n]/DesignacaoPrograma; Programa=P-nnn · página e código ministerial do Mapa 4 · página, rótulo e última coluna de um total dos mapas · páginas 49 e 50, rótulo e coluna da síntese de agosto · página 72, programa ou total da síntese de agosto · IndicadorDsg · label · p.<n>, linha <n>, campo <n> · <folha>, linha <n>, coluna <n> · JD1, juros no quadro 9 do INE · JD1, PIB no quadro 1 do INE · JD1, juros no quadro 1 da execução · JD1, custo da dívida no gráfico do IGCP · JD1, saldo da dívida direta do IGCP · JD1, quadro anual do financiamento do IGCP · JD1, coordenada dos juros da União). Um rótulo é o que a fonte imprime no sítio que o localizador nomeia, e um localizador que ninguém reconhece é uma cadeia a que ninguém pode voltar.` |
| JD1: ano do PIB trocado | `ledger/claims/pib-nominal-notificacao-setembro-2024.yml: traz o rótulo "Produto Interno Bruto, a preços de merca" e o localizador "Quadro 1, Produto Interno Bruto, a preços de mercado, coluna 2025, p. 2", que não é nenhuma das 18 formas que esta régua conhece (dimension.cofog99.category.label.GFnn · folha OE1 e célula do rótulo · Mapa1/Registos/Registo[n]/DesignacaoPrograma; Programa=P-nnn · página e código ministerial do Mapa 4 · página, rótulo e última coluna de um total dos mapas · páginas 49 e 50, rótulo e coluna da síntese de agosto · página 72, programa ou total da síntese de agosto · IndicadorDsg · label · p.<n>, linha <n>, campo <n> · <folha>, linha <n>, coluna <n> · JD1, juros no quadro 9 do INE · JD1, PIB no quadro 1 do INE · JD1, juros no quadro 1 da execução · JD1, custo da dívida no gráfico do IGCP · JD1, saldo da dívida direta do IGCP · JD1, quadro anual do financiamento do IGCP · JD1, coordenada dos juros da União). Um rótulo é o que a fonte imprime no sítio que o localizador nomeia, e um localizador que ninguém reconhece é uma cadeia a que ninguém pode voltar.` |
| JD1: ano da execução trocado | `ledger/claims/juros-e-outros-encargos-execucao-2025-08.yml: traz o rótulo "Juros e outros encargos" e o localizador "Quadro 1, Conta consolidada das Administrações Públicas, execução acumulada 2026, janeiro a agosto, folha 7 do PDF (numeração impressa: 3)", que não é nenhuma das 18 formas que esta régua conhece (dimension.cofog99.category.label.GFnn · folha OE1 e célula do rótulo · Mapa1/Registos/Registo[n]/DesignacaoPrograma; Programa=P-nnn · página e código ministerial do Mapa 4 · página, rótulo e última coluna de um total dos mapas · páginas 49 e 50, rótulo e coluna da síntese de agosto · página 72, programa ou total da síntese de agosto · IndicadorDsg · label · p.<n>, linha <n>, campo <n> · <folha>, linha <n>, coluna <n> · JD1, juros no quadro 9 do INE · JD1, PIB no quadro 1 do INE · JD1, juros no quadro 1 da execução · JD1, custo da dívida no gráfico do IGCP · JD1, saldo da dívida direta do IGCP · JD1, quadro anual do financiamento do IGCP · JD1, coordenada dos juros da União). Um rótulo é o que a fonte imprime no sítio que o localizador nomeia, e um localizador que ninguém reconhece é uma cadeia a que ninguém pode voltar.` |
| JD1: ano do custo do stock trocado | `ledger/claims/custo-do-stock-da-divida-direta-2025.yml: traz o rótulo "Custo do stock da dívida" e o localizador "Custo da dívida direta do Estado, Custo do stock da dívida, ponto 2026, p. 3; definição na nota 6 da folha 5", que não é nenhuma das 18 formas que esta régua conhece (dimension.cofog99.category.label.GFnn · folha OE1 e célula do rótulo · Mapa1/Registos/Registo[n]/DesignacaoPrograma; Programa=P-nnn · página e código ministerial do Mapa 4 · página, rótulo e última coluna de um total dos mapas · páginas 49 e 50, rótulo e coluna da síntese de agosto · página 72, programa ou total da síntese de agosto · IndicadorDsg · label · p.<n>, linha <n>, campo <n> · <folha>, linha <n>, coluna <n> · JD1, juros no quadro 9 do INE · JD1, PIB no quadro 1 do INE · JD1, juros no quadro 1 da execução · JD1, custo da dívida no gráfico do IGCP · JD1, saldo da dívida direta do IGCP · JD1, quadro anual do financiamento do IGCP · JD1, coordenada dos juros da União). Um rótulo é o que a fonte imprime no sítio que o localizador nomeia, e um localizador que ninguém reconhece é uma cadeia a que ninguém pode voltar.` |
| JD1: dia do saldo trocado | `ledger/claims/divida-direta-do-estado-2026-08.yml: traz o rótulo "Dívida total / Total debt" e o localizador "Movimento da dívida direta do Estado, Dívida total / Total debt, saldo em 30/ago/26, p. 2", que não é nenhuma das 18 formas que esta régua conhece (dimension.cofog99.category.label.GFnn · folha OE1 e célula do rótulo · Mapa1/Registos/Registo[n]/DesignacaoPrograma; Programa=P-nnn · página e código ministerial do Mapa 4 · página, rótulo e última coluna de um total dos mapas · páginas 49 e 50, rótulo e coluna da síntese de agosto · página 72, programa ou total da síntese de agosto · IndicadorDsg · label · p.<n>, linha <n>, campo <n> · <folha>, linha <n>, coluna <n> · JD1, juros no quadro 9 do INE · JD1, PIB no quadro 1 do INE · JD1, juros no quadro 1 da execução · JD1, custo da dívida no gráfico do IGCP · JD1, saldo da dívida direta do IGCP · JD1, quadro anual do financiamento do IGCP · JD1, coordenada dos juros da União). Um rótulo é o que a fonte imprime no sítio que o localizador nomeia, e um localizador que ninguém reconhece é uma cadeia a que ninguém pode voltar.` |
| JD1: emissões no lugar das necessidades | `ledger/claims/necessidades-brutas-de-financiamento-2025.yml: traz o rótulo "3. NECESSIDADES BRUTAS DE FINANCIAMENTO " e o localizador "Quadro 9, p.m. EMISSÕES DE DÍVIDA NO ANO CIVIL (Dívida Fundada), coluna 2025, p. 45", que não é nenhuma das 18 formas que esta régua conhece (dimension.cofog99.category.label.GFnn · folha OE1 e célula do rótulo · Mapa1/Registos/Registo[n]/DesignacaoPrograma; Programa=P-nnn · página e código ministerial do Mapa 4 · página, rótulo e última coluna de um total dos mapas · páginas 49 e 50, rótulo e coluna da síntese de agosto · página 72, programa ou total da síntese de agosto · IndicadorDsg · label · p.<n>, linha <n>, campo <n> · <folha>, linha <n>, coluna <n> · JD1, juros no quadro 9 do INE · JD1, PIB no quadro 1 do INE · JD1, juros no quadro 1 da execução · JD1, custo da dívida no gráfico do IGCP · JD1, saldo da dívida direta do IGCP · JD1, quadro anual do financiamento do IGCP · JD1, coordenada dos juros da União). Um rótulo é o que a fonte imprime no sítio que o localizador nomeia, e um localizador que ninguém reconhece é uma cadeia a que ninguém pode voltar.` |
| JD1: geografia da União trocada | `ledger/claims/juros-das-administracoes-publicas-2025-ue.yml: traz o rótulo "Interest, expenditure" e o localizador "freq=A; unit=PC_GDP; sector=S13; na_item=D41PAY; geo=PT; time=2025; value[0]", que não é nenhuma das 18 formas que esta régua conhece (dimension.cofog99.category.label.GFnn · folha OE1 e célula do rótulo · Mapa1/Registos/Registo[n]/DesignacaoPrograma; Programa=P-nnn · página e código ministerial do Mapa 4 · página, rótulo e última coluna de um total dos mapas · páginas 49 e 50, rótulo e coluna da síntese de agosto · página 72, programa ou total da síntese de agosto · IndicadorDsg · label · p.<n>, linha <n>, campo <n> · <folha>, linha <n>, coluna <n> · JD1, juros no quadro 9 do INE · JD1, PIB no quadro 1 do INE · JD1, juros no quadro 1 da execução · JD1, custo da dívida no gráfico do IGCP · JD1, saldo da dívida direta do IGCP · JD1, quadro anual do financiamento do IGCP · JD1, coordenada dos juros da União). Um rótulo é o que a fonte imprime no sítio que o localizador nomeia, e um localizador que ninguém reconhece é uma cadeia a que ninguém pode voltar.` |
| jd1-unidade-trocada-pt | `JD1-unidade · /livro-razao/juros-das-administracoes-publicas-2025 · juros-das-administracoes-publicas-2025: a unidade diz «%» e o campo unit da linha nesta edição diz «milhões de euros», com as marcas da própria linha` |
| jd1-entrada-retirada-do-indice-pt | `JD1-unidade · /livro-razao: o índice tem 13 entradas JD1 e deve ter 14` |
| jd1-unidade-trocada-en | `JD1-unidade · /en/ledger/juros-das-administracoes-publicas-2025 · juros-das-administracoes-publicas-2025: a unidade diz «%» e o campo unit da linha nesta edição diz «million euros», com as marcas da própria linha` |
| jd1-entrada-retirada-do-indice-en | `JD1-unidade · /en/ledger: o índice tem 13 entradas JD1 e deve ter 14` |

As plantas cobrem a unidade, a ordem dos anos, os bytes do corpo, a geografia, o ano do denominador, a seleção do corredor, a unidade da taxa, a comparabilidade do enquadramento, os destinos repetidos, os localizadores dos nomes, as unidades e entradas do livro e a disposição da ligação ao documento.

As contagens dos testes do OE1 passaram a referir o seu manifesto, mantendo as recusas `Nomes: livro sem as linhas esperadas ou com repetição` e `Nomes: manifesto sem as linhas esperadas`. A contagem das séries passou a comparar os identificadores declarados e derivados; retirar uma série é recusado com `as séries publicadas não são exatamente as declaradas e derivadas`. As cópias de teste do corredor passaram a copiar a pasta de escrita, evitando uma ligação à fonte real; a prova confere que não acrescenta corridas à fonte real.

Ficheiros protegidos de outras corridas alterados: 0, medidos por `git diff --name-only` desde a cabeça inicial do motor e por `git status --porcelain` sobre os caminhos indicados no mandato.

## Correções da conferência dos recibos

A primeira corrida foi conservada em `portoes-iniciais/` como diagnóstico. Os seus códigos, lidos dos ficheiros: build=1, verify=1, typecheck=0. Os códigos válidos para a entrega são os da tabela inicial, em `portoes/`.

A corrida seguinte ficou em `portoes-lingua/`, também como diagnóstico: build=1, verify=1, typecheck=0. Faltava declarar a língua dos novos títulos, rótulos, organismos e edições. Essa tabela foi completada durante a verificação desta corrida; as cabeças de entrada e saída estão nos registos. A construção válida para a entrega incorpora as declarações desde o início.

A corrida conservada em `portoes-l1/` mediu build=0, verify=1, typecheck=0. A L1 recusou o crescimento do número de recibos. A medição `l1-jd1.json`, feita por `node design/especime-v3/medicoes/jd1-2026-10-06/medir-l1.mjs --write`, conta os destinos e as vezes de cada destino: {"estudos": 2744, "anteriores": 2716, "novas": 28, "antigas_alteradas": 0}. Só entram os recibos declarados no cruzamento JD1; cada um conserva as portas do Método da família. O teto aponta para esta medição e as plantas verificam a comparação, a divergência do registo e uma repetição nova no HTML da série, sem escrever no HTML real.

A conferência diagnóstica `node scripts/verify-depois-do-build.mjs --paralelo 4 --json design/especime-v3/medicoes/jd1-2026-10-06/preflight.json` terminou com código 1. Os resultados de cada passo estão no JSON. O índice não reconhecia os localizadores JD1 e a conferência de unidades confundia o estudo inteiro com o bloco OE1. O índice passou a exigir a identidade, o período e a página de cada formato novo. A unidade é conferida separadamente nos conjuntos declarados OE1 e JD1, com recusa de omissões e duplicações. As conferências focadas posteriores mediram {"indice": 0, "rotulos": 0, "tipos_guardas": 0}. Comandos: `node tests/livro/indice.mjs --navegador --prova --json design/especime-v3/medicoes/jd1-2026-10-06/indice.json`, `node scripts/inventario-rotulos.mjs --prova --json design/especime-v3/medicoes/jd1-2026-10-06/rotulos.json` e `npm run typecheck`. Cada planta nova conserva a mensagem que foi exigida.

A frase calculada deixou de chamar casa ao projeto. A nota do motor foi alinhada, sem alterar montantes, operandos ou contas. As contagens do índice foram relidas pelo guião `inventario.mjs`, que conserva a classificação da voz; os registos estão em `inventario.json` e `inventario-final.json`.

No telemóvel, a porta do documento conserva a mesma âncora e a área de toque. O rótulo da página fica acima do endereço, que já não o comprime. A planta repõe a disposição em fila numa cópia do navegador e exige a mensagem indicada na tabela.

## Capturas e entrega

Capturas: 50. Inspeção visual: 20 imagens, registadas com os seus resumos em `inspecao-visual.json`. Casos de interação conferidos: 10, com a abertura dos pedidos da série e, onde necessário, o deslocamento da tabela pelo teclado. Problemas registados pelo guião: 0. Comando: `node design/especime-v3/medicoes/jd1-2026-10-06/captar.mjs`. Ficheiros em `design/especime-v3/capturas/jd1-2026-10-06/`; dimensões, frases, resumos e cabeça da construção em `capturas.json`.

Para a leitura a frio, o diff do motor é `git diff 465d01e7853f2729fcaa4ba63160b6338ba5de1e f503a5b1155657d638068d478d66163de429546a` na worktree do motor; o do sítio é `git diff 4f49b677 e7a433e983ebdc69130d7d0c3b81c0b2539a3b83` na worktree do sítio. Os documentos e extrações estão na pasta da corrida do motor, os recibos construídos em `dist/livro-razao/` e `dist/en/ledger/`, e as imagens nas capturas desta entrega.

A entrega inclui as fontes, extrações, recibos e as plantas reproduzíveis para a leitura a frio. Não houve envio para o remoto nem alteração de `ISSUES.md`. A linha «tokens used» não foi exposta nesta sessão; custo não medido.
