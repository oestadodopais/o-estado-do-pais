# O juízo da folha de correções do ZER0 (Codex `gpt-6-astra`, `xhigh`, 14.11.2026, 13:47:27 a 13:58:51 UTC)

*A resposta do juiz, como veio. A folha que leu tinha cinco estragos plantados, que a secção final lista; os reparos que entraram estão no cabeçalho da `FOLHA-zer0-decidida.md`.*

A folha não pode seguir como está: encontrei os cinco estragos, além de problemas na fundamentação e em texto que se pretendia conservar. Os caminhos abaixo são relativos a `fontes/`.

**Z1 PT — APROVADA COM REPARO.** A primeira frase também precisa de correção: PPS é uma unidade; as paridades são os fatores de conversão. Reescrever: «O índice compara o PIB per capita de cada território, expresso em padrões de poder de compra (PPS), com a média da UE-27.» O glossário `z1/eurostat-glossario-pps-en.html` diz «an artificial currency unit» e distingue-a das «purchasing power parities». Não deve ficar «medido em paridades».

**Z1 EN — APROVADA.** A primeira frase corresponde à unidade `PPS_HAB_EU27_2020` do JSON: «per inhabitant in percentage of the EU27 […] average». Apagar a segunda elimina uma interpretação indevida: `z1/eurostat-reg_eco10_esms.htm`, §3.4, fala em «economic activity of regions», não no poder de compra dos residentes. As versões ficam equivalentes depois do reparo português.

**Z2 PT — APROVADA COM REPARO.** «Que a listagem […] localiza em Évora» é defensável enquanto descrição do ficheiro; não prova sede nem destino territorial da despesa. Não encontrei definição adicional da coluna no XLSX ou na API (`description` genérica; `schema: null`). «Nas linhas de» é opaco: escrever «Verbas do PRR registadas como contratadas para beneficiários intermediários e diretos em registos com “Évora” na coluna `localizacao_sede`»; usar «registadas como pagas» no segundo caso e conservar esse filtro nas descrições e divisões.

**Z2 EN — RECUSADA.** No nome de `evora-prr-pago-2026`, «**final** and direct beneficiaries» troca a população: o filtro é **intermediate** e direct. Reescrever: «Recovery and Resilience Plan (PRR) funds recorded as paid for intermediate and direct beneficiaries in records with “Évora” in the `localizacao_sede` column.» As restantes traduções reproduzem o português.

> Reexecutei ambos os guiões com `openpyxl`: `z2/listagem-de-entidades-prr-20260819.xlsx`, `Sheet1`, 802 450 registos, todos de 19.08.2026; filtro nas colunas E/G: **2 311 registos, 23 pares entidade/papel**. Somas H/I: **167 372 755,84 / 86 944 668,69 euros**; execução = **51,946727… → 51,95 %**. Fundo Ambiental: 305 localizações; IEFP intermediário: 302. A divisão do montante vencido publicado dá **61,315059… → 61,32 %**, mas não pude reconstruir esse numerador.

**Z3 PT — RECUSADA.** A página 99 sustenta sozinha o montante, mas desmente o excerto novo: escreve **2013**, não 2012. Excerto correto: «empréstimo PAEL, Programa de Apoio à Economia Local, contraído no ano **2013**, no valor de **32.166.373,20 €**». A razão restante está documentada; especificar «Anexos de 2016, página **68 do PDF, impressa 193**». A descrição conservada continua adequada.

**Z3 EN — RECUSADA.** Além do ano errado no excerto comum, «page **139**» não corresponde ao mapa. Substituir por «PDF page **68**, printed page **193**». Depois destes reparos, a razão inglesa equivale à portuguesa; os documentos mostram a divergência de um euro, sem estabelecer a sua causa.

> `z3/cm-evora-Relatorio_Gestao_2016.pdf`, p.84: **32.166.372,20 €**; p.99: **32.166.373,20 €**.  
> `z3/cm-evora-Anexos_Demonstracoes_Financeiras_2016.pdf`, p.68/193, «Capital Contratado»: **1 253 112 + 4 042 856 + 2 831 000 + 32 166 373,20 + 14 375 000 + 14 375 000 + 3 750 000 = 72 793 341,20**. Com o valor antigo daria **72 793 340,20**. O anexo de 2015, p.65/impressa 64, confirma o capital PAEL.

**Z4 PT — APROVADA.** Manter «Empresas não financeiras» é correto: `z4/ine-destaque-empresas-resultados-definitivos-2024.pdf`, p.3, quadro 1, associa expressamente esse nome a **1 576 606**, distinto das **1 593 415** empresas totais. Confirmei também **1 044 432 + 532 174 = 1 576 606**. `z4-soma-308.txt` declara esse mesmo total para os concelhos; não contém os 308 valores para repetir a soma.

**Z4 EN — APROVADA.** «Non-financial enterprises», observado na página inglesa de Évora, traduz corretamente o rótulo. A ausência de «não financeiras» no título do indicador 0014063 não contradiz a classificação explícita do destaque. Vale a mesma limitação quanto à soma municipal.

**Z5 PT — RECUSADA.** O objeto da CDU de 2025 foi adulterado: tem **4 332 votos**, não 4 323. Os outros nove excertos eleitorais coincidem, carácter por carácter após a redução de espaços autorizada; todos os valores de mandatos conferem, incluindo **3 + 2 + 1 + 1 = 7**. A fonte prova lugares obtidos na eleição da Câmara; «executivo saído das eleições» só é equivalente nesse sentido, não como prova de pelouros ou composição atual.

**Z5 EN — RECUSADA.** O erro está no JSON comum às duas edições. Para evitar ambiguidade, usar «Seats won by [list] in the 2025 Évora municipal council election». As duas somas PRR conferem, mas conservar «contratou no concelho» continua a exceder o significado documentado da coluna: escrever «Soma dos valores contratados nos registos desta entidade como beneficiário final com “Évora” em `localizacao_sede`» / «Sum of contracted amounts in this entity’s final-beneficiary records with “Évora” in `localizacao_sede`».

> `z5/sgmai-2025-territory-1267-organ-4.json`, `$.data.currentResults.resultsParty[2]`:
> `{ "id": 1760, "typeId": 2, "acronym": "PCP-PEV", "votes": 4332, "percentage": 15.82, "mandates": 1, "presidents": 0, "absoluteMajority": 0 }`
>
> No XLSX PRR, os filtros declarados dão **20 registos / 12 069 012,60 euros** para o Município e **74 / 38 596 975,81 euros** para a Universidade. Retirar os pseudoexcertos é correto; `contratado_neste_concelho` não é uma coluna.

**Z6 PT — RECUSADA.** «Em alta» troca o âmbito. Reescrever: «Água não faturada **no serviço em baixa, em Portugal continental**». `z6/rasarp2025-volume1-p106-107.txt`, quadro 49: «AA08 baixa», avaliação para **93 % das entidades**, **26,5 %**; quadro 51 confirma **2024**. Refeito: **224 028 933 ÷ 846 741 648 × 100 = 26,457767… → 26,5 %**. Em alta são **5,2 %**.

**Z6 EN — APROVADA COM REPARO.** O rótulo inglês está correto e corresponde à **baixa**, não ao português proposto. É falsa a fundamentação de que a ERSAR não fornece tradução: `z7/corpos/ersar-rasarp2025-volume1-live.pdf`, p.49, apresenta **«Baixa / Retail service»**. Substituir essa fundamentação por: «A ERSAR traduz “Baixa” por “Retail service” no próprio volume.»

**Z7 PT — APROVADA COM REPARO.** A retirada conjunta é uma escolha editorial aceitável, não uma necessidade factual para todas: `coragua-gulbenkian-inquerito-ano` e `coragua-gulbenkian-universo-hectares` **podem ficar como estão**, com valores e excertos confirmados na p.22. Reescrever a razão: «Retiram-se as dezoito linhas por decisão editorial; nem todas contêm valores errados.» Corrigir também: «valor médio» aplica-se à tarifa **em alta pressão**; a DGADR cobre 33 aproveitamentos, mas a tabela tem **19 eficiências reportadas**, cuja média refiz: **1 438 ÷ 19 = 75,684… → 76 %**.

**Z7 EN — APROVADA COM REPARO.** Aplicam-se as mesmas reservas; os dois recibos Gulbenkian ingleses são fiéis. **`evora-populacao-2021` deve ficar nas duas línguas**, como estimativa de 2021: **26 555 + 29 156 = 55 711**. Contudo, «Dados["2021"], valor 55711» não é transcrição literal: substituir por **`"valor" : "55711"`**, localizado em `z7/corpos/ine-0012918-evora.json`, `$[0].Dados["2021"][56].valor`.

> Outras provas da retirada: EDIA, p.5, e ERSAR, p.410: **13,48/10 = 1,348**; os rácios dão **35,288 → 35** e **19,093 → 19**, mas outras tarifas dão **37,444**, **15,915** e **12,177**: não são limites e misturam 2024 com 2026. INE, `ine-destaque-estatisticas-vitais-2025.pdf`, p.1: **87 764 − 121 817 = −34 053**; a PORDATA apresenta **−34,1 milhares**, não um valor exato de −34 100 pessoas. Os corpos dos dois endereços históricos são o índice de estudos, não as passagens citadas.

**Os cinco estragos plantados encontrados:**

1. **Z2 EN:** «**final** and direct»; o XLSX e o filtro dizem **«Beneficiário Intermediário»** e «Beneficiário Direto».
2. **Z3, excerto comum PT/EN:** «ano **2012**»; relatório, p.99: **«contraído no ano 2013»**.
3. **Z3 EN:** «page **139**»; mapa dos empréstimos: página **68 do PDF**, rodapé **193**.
4. **Z5, excerto comum PT/EN:** `"votes": 4323`; objeto indicado: **`"votes": 4332`**.
5. **Z6 PT:** «serviço **em alta**»; quadro 49: **«AA08 baixa […] 26,5 %»**.

**Não consegui conferir:** a soma dos 308 concelhos, por faltarem os valores individuais; o montante PRR vencido, por faltar a listagem de projetos; e os números das edições históricas, cujos corpos arquivados não estão no pacote.