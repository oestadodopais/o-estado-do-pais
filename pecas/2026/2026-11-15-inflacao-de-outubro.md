+++ cabeca
id = "2026-11-15-inflacao-de-outubro"
tipo = "diario"
titulo = "Inflação sobe para {ipc_homologa_out} em outubro; medida sem a energia, sobe [menos de metade]{sem_energia_subida, ipc_homologa_dif_2c}"
entrada = "A taxa subiu {ipc_homologa_dif_2c} face a setembro. Medida sem os produtos energéticos, subiu {sem_energia_subida}. Quantos preços subiram, os números do INE não dizem."
temas = ["precos"]

[encomenda]
pergunta = "A inflação subiu em outubro de 2026: a subida vem de poucos preços ou de quase todos?"
porque_hoje = "the statistics office published October's consumer prices on 11 November 2026, the latest reading, with the annual rate higher than in September, and the news gave the rate only. It is also the first piece to go through the scripts, timed step by step: a draft for the private preview, begun four days after its release, which a daily item should not be."
largar_se = "the release does not let a reader tell a broad rise from a narrow one (no contributions by class of goods and services, no measure that leaves out energy and unprocessed food), so that the piece could only repeat the rate."
+++ corpo

[Em outubro de 2026]{ipc_homologa_out}, a inflação foi de {ipc_homologa_out}, segundo o Instituto Nacional de Estatística (INE). O número é a taxa homóloga do índice de preços no consumidor (IPC): diz quanto os preços subiram [face ao mesmo mês do ano anterior]{ipc_homologa_out}.

Com duas casas decimais, como nos quadros do INE, a taxa passou de {ipc_homologa_set} em setembro para {ipc_homologa_out_2c} em outubro. Subiu {ipc_homologa_dif_2c}. É em pontos percentuais que se mede a diferença entre duas taxas: de três para quatro por cento vai um ponto percentual.

O INE calcula a mesma taxa sem os produtos energéticos. Medida assim, a inflação de outubro é de {sem_energia_out}, e de setembro para outubro subiu {sem_energia_subida}: menos de metade do que subiu a taxa com tudo incluído. A taxa dos produtos energéticos, sozinhos, passou de {energeticos_set_2c} para {energeticos_out_2c}.

## A leitura deste projeto

Este projeto lê assim os números: o mais provável é que a maior parte da subida de outubro tenha vindo da energia. A taxa dos produtos energéticos subiu [mais de dois pontos percentuais]{energeticos_subida}; a de tudo o resto subiu {sem_energia_subida}. É uma leitura, não uma conta. Para saber quanto da subida veio da energia seria preciso o peso da energia no cabaz, e os documentos em que esta peça se apoia não o dão.

Isso não quer dizer que o resto esteja parado. A taxa sem energia está mais alta do que em janeiro, quando era de {sem_energia_jan}. A comparação com a área do euro faz-se com outro índice, o harmonizado (IHPC), e [os valores da área do euro são ainda estimativas]{area_euro_estimativa, area_euro_subjacente_out}. Com tudo incluído, Portugal fica [ligeiramente abaixo]{ihpc_vs_area}. Sem energia nem alimentos não transformados, fica acima: {ihpc_subjacente_out}, contra {area_euro_subjacente_out}.

Se subiram poucos preços ou quase todos, estes números não dizem: são médias, não contam preços. Quem olhar para a taxa de outubro e concluir que tudo está a subir mais depressa conclui mais do que eles permitem. Quem concluir que foi só a energia, também.

## O melhor argumento contra esta leitura

Uma média pode mudar pouco enquanto as suas partes mudam muito. Fora da energia há taxas que, de setembro para outubro, mudaram mais de um ponto percentual: a da classe do Lazer, recreação, desporto e cultura [subiu quase dois pontos]{classe09_dif}, e a dos Serviços de educação [desceu cerca de um ponto e meio]{classe10_dif}. A taxa do conjunto dos serviços [subiu mais do que a do total]{servicos_subida, ipc_homologa_dif_2c}. Pôr a energia à frente pode, por isso, deixar a ideia errada de que fora dela os preços estão calmos.

Este projeto aceita o argumento. O que os números mostram ao certo é só isto: medida sem a energia, a inflação subiu menos de metade do que subiu com ela. Sobre os outros preços, este projeto não afirma que estão calmos, nem que subiram poucos.

## O que acompanhar

O INE tem duas datas marcadas. A [30 de novembro]{proximas_datas} publica a próxima estimativa rápida, um primeiro valor da inflação. A [14 de dezembro]{proximas_datas} publica o próximo destaque, o documento de onde saem os números desta peça. O que interessa ver: se a taxa sem energia volta a subir, e se a taxa total volta a subir mais do que ela. Antes disso, [a 18 de novembro]{area_euro_estimativa}, sai o valor definitivo da inflação da área do euro.

+++ folha
[[fonte]]
id = "ine_ipc_out2026"
titulo = "Índice de Preços no Consumidor, outubro de 2026 (Destaque): Taxa de variação homóloga do IPC aumentou para 3,8%"
editor = "Instituto Nacional de Estatística"
url = "https://www.ine.pt/ngt_server/attachfileu.jsp?att_display=n&att_download=y&look_parentBoui=828133744"
url_final = "https://www.ine.pt/ngt_server/attachfileu.jsp?att_display=n&att_download=y&look_parentBoui=828133744"
lido_em = "2026-11-15T11:16:49Z"
http = 200
tipo_conteudo = "application/pdf"
bytes = 524278
sha256 = "e8c416fd3470013212521a611bc24a4ee1811231578b45617a9c15971b4188ef"
publicado_em = "2026-11-11"

[[fonte]]
id = "ine_ipc_out2026_quadros"
titulo = "Consumer Price Index, Reference year 2025 = 100: quadros do Destaque do IPC de outubro de 2026 (Excel; folhas TI-PT a CPI-All items-ML)"
editor = "Instituto Nacional de Estatística"
url = "https://www.ine.pt/ngt_server/attachfileu.jsp?look_parentBoui=828134643&att_display=n&att_download=y"
url_final = "https://www.ine.pt/ngt_server/attachfileu.jsp?look_parentBoui=828134643&att_display=n&att_download=y"
lido_em = "2026-11-15T11:17:14Z"
http = 200
tipo_conteudo = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
bytes = 182622
sha256 = "96d5beab5bffc2b3336d5ba837e191c77e63c35f862088de36e37d88ce65331d"
publicado_em = ""

[[linha]]
id = "ipc_homologa_out"
tipo = "valor"
fonte = "ine_ipc_out2026"
onde = "p. 1, primeiro parágrafo"
excerto = '''A variação homóloga do Índice de Preços no Consumidor (IPC) foi 3,8% em outubro de 2026, taxa superior em 0,2 pontos percentuais (p.p.) à registada no mês anterior.'''
valor = "3.8"
unidade = "%"
mede = "Taxa de variação homóloga do Índice de Preços no Consumidor (IPC): compara o índice do mês corrente com o do mesmo mês do ano anterior (p. 10)"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "3,8 %"

[[linha]]
id = "ipc_homologa_subida"
tipo = "valor"
fonte = "ine_ipc_out2026"
onde = "p. 1, primeiro parágrafo"
excerto = '''A variação homóloga do Índice de Preços no Consumidor (IPC) foi 3,8% em outubro de 2026, taxa superior em 0,2 pontos percentuais (p.p.) à registada no mês anterior.'''
valor = "0.2"
unidade = "pontos percentuais"
mede = "Diferença, dada pelo INE, entre a taxa de variação homóloga do IPC de outubro de 2026 e a do mês anterior (taxa superior em 0,2 p.p.)"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026 face a setembro de 2026 (taxas homólogas)"
provisorio = false
mostra = "0,2 pontos percentuais"

[[linha]]
id = "ipc_homologa_set"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TII-PT (quadro II, taxas de variação homóloga, no original «Annual rates (%)»), linha «Total», coluna de setembro de 2026, o penúltimo número da linha"
excerto = '''Total 2025 2.54 2.39 1.85 2.1 2.26 2.37 2.64 2.76 2.4 2.34 2.21 2.19 2026 1.92 2.1 2.71 3.35 3.27 3.22 3.04 3.3 3.61 3.8'''
valor = "3.61"
unidade = "%"
mede = "Taxa de variação homóloga do IPC total, com duas casas decimais"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "3,61 %"

[[linha]]
id = "ipc_homologa_out_2c"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TII-PT (quadro II, taxas de variação homóloga, no original «Annual rates (%)»), linha «Total», coluna de outubro de 2026, o último número da linha"
excerto = '''Total 2025 2.54 2.39 1.85 2.1 2.26 2.37 2.64 2.76 2.4 2.34 2.21 2.19 2026 1.92 2.1 2.71 3.35 3.27 3.22 3.04 3.3 3.61 3.8'''
valor = "3.8"
unidade = "%"
mede = "Taxa de variação homóloga do IPC total, com duas casas decimais (a mesma taxa que o destaque publica com uma casa, 3,8 %)"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "3,80 %"

[[linha]]
id = "ipc_homologa_dif_2c"
tipo = "derivado"
calculo = "ipc_homologa_out_2c - ipc_homologa_set"
valor = "0.19"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga do IPC total em outubro de 2026 menos a de setembro de 2026, com duas casas decimais"
periodo = "setembro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha do mesmo quadro dos quadros do destaque: a mesma medida (taxa de variação homóloga), o mesmo agregado e a mesma população (IPC total, Portugal), meses seguidos com a mesma estrutura de ponderação de 2026. Duas casas decimais, como nos quadros; a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais). O destaque, com uma casa decimal, dá 0,2 pontos percentuais."
mostra = "0,19 pontos percentuais"

[[linha]]
id = "ipc_homologa_jan"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TII-PT (quadro II, taxas de variação homóloga, no original «Annual rates (%)»), linha «Total», coluna de janeiro de 2026, o primeiro número a seguir a 2026"
excerto = '''Total 2025 2.54 2.39 1.85 2.1 2.26 2.37 2.64 2.76 2.4 2.34 2.21 2.19 2026 1.92 2.1 2.71 3.35 3.27 3.22 3.04 3.3 3.61 3.8'''
valor = "1.92"
unidade = "%"
mede = "Taxa de variação homóloga do IPC total, com duas casas decimais"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "janeiro de 2026, face a janeiro de 2025"
provisorio = false
mostra = "1,92 %"

[[linha]]
id = "ipc_homologa_out_vs_jan"
tipo = "derivado"
calculo = "ipc_homologa_out_2c - ipc_homologa_jan"
valor = "1.88"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga do IPC total em outubro de 2026 menos a de janeiro de 2026"
periodo = "janeiro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha do mesmo quadro dos quadros do destaque: a mesma medida (taxa de variação homóloga), o mesmo agregado e a mesma população, e a mesma estrutura de ponderação de 2026. Cada taxa compara o seu mês com o mesmo mês de 2025, pelo que a diferença mostra quanto a taxa homóloga se moveu entre janeiro e outubro, não quanto subiram os preços nesse período. Duas casas decimais, como nos quadros; a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "1,88 pontos percentuais"

[[linha]]
id = "ipc_mensal_out"
tipo = "valor"
fonte = "ine_ipc_out2026"
onde = "p. 1, segundo parágrafo"
excerto = '''A variação mensal do IPC foi 0,2% (1,2% no mês precedente e nula em outubro de 2025).'''
valor = "0.2"
unidade = "%"
mede = "Taxa de variação mensal do IPC: compara os índices de dois meses consecutivos; é influenciada por efeitos sazonais (p. 10)"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a setembro de 2026"
provisorio = false
mostra = "0,2 %"

[[linha]]
id = "ipc_mensal_out_2c"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TIII-PT (quadro III, taxas de variação mensal, no original «Monthly rates (%)»), linha «Total», coluna de outubro de 2026, o último número da linha"
excerto = '''Total 2025 -0.45 -0.11 1.42 0.72 0.32 0.11 -0.35 -0.22 0.93 0.01 -0.29 0.09 2026 -0.71 0.07 2.02 1.35 0.25 0.06 -0.53 0.03 1.24 0.2'''
valor = "0.2"
unidade = "%"
mede = "Taxa de variação mensal do IPC total, com duas casas decimais (a mesma taxa que o destaque publica com uma casa, 0,2 %)"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a setembro de 2026"
provisorio = false
mostra = "0,20 %"

[[linha]]
id = "ipc_mensal_out25"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TIII-PT (quadro III, taxas de variação mensal, no original «Monthly rates (%)»), linha «Total», coluna de outubro de 2025, o décimo número a seguir a 2025"
excerto = '''Total 2025 -0.45 -0.11 1.42 0.72 0.32 0.11 -0.35 -0.22 0.93 0.01 -0.29 0.09 2026 -0.71 0.07 2.02 1.35 0.25 0.06 -0.53 0.03 1.24 0.2'''
valor = "0.01"
unidade = "%"
mede = "Taxa de variação mensal do IPC total em outubro de 2025, com duas casas decimais; o destaque descreve-a como nula (p. 1 e p. 4)"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2025, face a setembro de 2025"
provisorio = false
mostra = "0,01 %"

[[linha]]
id = "ipc_mensal_vs_ano_antes"
tipo = "derivado"
calculo = "ipc_mensal_out_2c - ipc_mensal_out25"
valor = "0.19"
unidade = "pontos percentuais"
mede = "Quanto a variação mensal do IPC em outubro de 2026 ficou acima da de outubro de 2025: o mês que entra na taxa homóloga de outubro face ao que dela sai"
periodo = "outubro de 2026 e outubro de 2025 (variações mensais)"
compara = "A mesma medida (taxa de variação mensal do IPC total, Portugal), na mesma linha do mesmo quadro, no mesmo mês do calendário com um ano de intervalo. O destaque (p. 10) diz que a taxa homóloga não é afetada pelas oscilações sazonais perante um padrão estável de sazonalidade; estes números não mostram se o padrão de outubro foi o mesmo nos dois anos. Duas casas decimais, como nos quadros; a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "0,19 pontos percentuais"

[[linha]]
id = "subjacente_out"
tipo = "valor"
fonte = "ine_ipc_out2026"
onde = "p. 1, primeiro parágrafo"
excerto = '''O indicador de inflação subjacente (índice total excluindo produtos alimentares não transformados e energéticos) registou uma variação homóloga de 2,8% (2,7% em setembro).'''
valor = "2.8"
unidade = "%"
mede = "Taxa de variação homóloga do indicador de inflação subjacente: o índice total excluindo produtos alimentares não transformados e energéticos (p. 10)"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "2,8 %"

[[linha]]
id = "subjacente_set"
tipo = "valor"
fonte = "ine_ipc_out2026"
onde = "p. 1, primeiro parágrafo"
excerto = '''O indicador de inflação subjacente (índice total excluindo produtos alimentares não transformados e energéticos) registou uma variação homóloga de 2,8% (2,7% em setembro).'''
valor = "2.7"
unidade = "%"
mede = "Taxa de variação homóloga do indicador de inflação subjacente: o índice total excluindo produtos alimentares não transformados e energéticos (p. 10)"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "2,7 %"

[[linha]]
id = "subjacente_out_2c"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TII-PT (quadro II, taxas de variação homóloga, no original «Annual rates (%)»), linha «Total excluding unprocessed food and energy», coluna de outubro de 2026, o último número da linha"
excerto = '''Total excluding unprocessed food and energy 2025 2.66 2.45 1.88 2.14 2.24 2.4 2.48 2.44 1.97 2.15 1.96 2.05 2026 1.8 1.94 2.01 2.2 2.19 2.5 2.57 2.64 2.72 2.79'''
valor = "2.79"
unidade = "%"
mede = "Taxa de variação homóloga do IPC excluindo produtos alimentares não transformados e energéticos (o indicador de inflação subjacente), com duas casas decimais"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "2,79 %"

[[linha]]
id = "subjacente_set_2c"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TII-PT (quadro II, taxas de variação homóloga, no original «Annual rates (%)»), linha «Total excluding unprocessed food and energy», coluna de setembro de 2026, o penúltimo número da linha"
excerto = '''Total excluding unprocessed food and energy 2025 2.66 2.45 1.88 2.14 2.24 2.4 2.48 2.44 1.97 2.15 1.96 2.05 2026 1.8 1.94 2.01 2.2 2.19 2.5 2.57 2.64 2.72 2.79'''
valor = "2.72"
unidade = "%"
mede = "Taxa de variação homóloga do IPC excluindo produtos alimentares não transformados e energéticos (o indicador de inflação subjacente), com duas casas decimais"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "2,72 %"

[[linha]]
id = "subjacente_subida"
tipo = "derivado"
calculo = "subjacente_out_2c - subjacente_set_2c"
valor = "0.07"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga do indicador de inflação subjacente em outubro de 2026 menos a de setembro de 2026, com duas casas decimais"
periodo = "setembro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha do mesmo quadro dos quadros do destaque: a mesma medida (taxa de variação homóloga do IPC excluindo produtos alimentares não transformados e energéticos), a mesma unidade e população, meses seguidos com a mesma estrutura de ponderação de 2026. Duas casas decimais, como nos quadros; a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "0,07 pontos percentuais"

[[linha]]
id = "subjacente_jan"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TII-PT (quadro II, taxas de variação homóloga, no original «Annual rates (%)»), linha «Total excluding unprocessed food and energy», coluna de janeiro de 2026, o primeiro número a seguir a 2026"
excerto = '''Total excluding unprocessed food and energy 2025 2.66 2.45 1.88 2.14 2.24 2.4 2.48 2.44 1.97 2.15 1.96 2.05 2026 1.8 1.94 2.01 2.2 2.19 2.5 2.57 2.64 2.72 2.79'''
valor = "1.8"
unidade = "%"
mede = "Taxa de variação homóloga do IPC excluindo produtos alimentares não transformados e energéticos (o indicador de inflação subjacente), com duas casas decimais"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "janeiro de 2026, face a janeiro de 2025"
provisorio = false
mostra = "1,80 %"

[[linha]]
id = "subjacente_out_vs_jan"
tipo = "derivado"
calculo = "subjacente_out_2c - subjacente_jan"
valor = "0.99"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga do indicador de inflação subjacente em outubro de 2026 menos a de janeiro de 2026"
periodo = "janeiro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha do mesmo quadro dos quadros do destaque: a mesma medida (taxa de variação homóloga), o mesmo agregado e a mesma população, e a mesma estrutura de ponderação de 2026. Cada taxa compara o seu mês com o mesmo mês de 2025, pelo que a diferença mostra quanto a taxa homóloga se moveu entre janeiro e outubro, não quanto subiram os preços nesse período. Duas casas decimais, como nos quadros; a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "0,99 pontos percentuais"

[[linha]]
id = "energeticos_out"
tipo = "valor"
fonte = "ine_ipc_out2026"
onde = "p. 1, primeiro parágrafo"
excerto = '''A variação do índice relativo aos produtos energéticos aumentou para 17,4% (15,3% no mês anterior)'''
valor = "17.4"
unidade = "%"
mede = "Taxa de variação homóloga do índice relativo aos produtos energéticos (um agregado especial do IPC, não uma classe)"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "17,4 %"

[[linha]]
id = "energeticos_set"
tipo = "valor"
fonte = "ine_ipc_out2026"
onde = "p. 1, primeiro parágrafo"
excerto = '''A variação do índice relativo aos produtos energéticos aumentou para 17,4% (15,3% no mês anterior)'''
valor = "15.3"
unidade = "%"
mede = "Taxa de variação homóloga do índice relativo aos produtos energéticos (um agregado especial do IPC, não uma classe)"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "15,3 %"

[[linha]]
id = "energeticos_out_2c"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TII-PT (quadro II, taxas de variação homóloga, no original «Annual rates (%)»), linha «Energy», coluna de outubro de 2026, o último número da linha"
excerto = '''Energy 2025 2.39 1.5 0.08 -0.1 0.11 -1.34 -1.06 -0.18 0.35 -1.23 -0.85 -2.38 2026 -2.24 -2.17 5.74 11.68 13.14 9.12 8.67 12.2 15.31 17.38'''
valor = "17.38"
unidade = "%"
mede = "Taxa de variação homóloga do índice dos produtos energéticos (um agregado especial do IPC, não uma classe), com duas casas decimais"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "17,38 %"

[[linha]]
id = "energeticos_set_2c"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TII-PT (quadro II, taxas de variação homóloga, no original «Annual rates (%)»), linha «Energy», coluna de setembro de 2026, o penúltimo número da linha"
excerto = '''Energy 2025 2.39 1.5 0.08 -0.1 0.11 -1.34 -1.06 -0.18 0.35 -1.23 -0.85 -2.38 2026 -2.24 -2.17 5.74 11.68 13.14 9.12 8.67 12.2 15.31 17.38'''
valor = "15.31"
unidade = "%"
mede = "Taxa de variação homóloga do índice dos produtos energéticos (um agregado especial do IPC, não uma classe), com duas casas decimais"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "15,31 %"

[[linha]]
id = "energeticos_subida"
tipo = "derivado"
calculo = "energeticos_out_2c - energeticos_set_2c"
valor = "2.07"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga do índice dos produtos energéticos em outubro de 2026 menos a de setembro de 2026, com duas casas decimais"
periodo = "setembro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha do mesmo quadro dos quadros do destaque: a mesma medida (taxa de variação homóloga do agregado dos produtos energéticos do IPC), a mesma unidade e população, meses seguidos com a mesma estrutura de ponderação de 2026. Duas casas decimais, como nos quadros; a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "2,07 pontos percentuais"

[[linha]]
id = "sem_energia_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TII-PT (quadro II, taxas de variação homóloga, no original «Annual rates (%)»), linha «Total excluding energy», coluna de outubro de 2026, o último número da linha"
excerto = '''Total excluding energy 2025 2.55 2.44 1.99 2.28 2.46 2.68 2.93 3 2.58 2.64 2.45 2.55 2026 2.26 2.46 2.53 2.81 2.62 2.83 2.68 2.72 2.84 2.91'''
valor = "2.91"
unidade = "%"
mede = "Taxa de variação homóloga do IPC total excluindo os produtos energéticos (no original, «Total excluding energy»), com duas casas decimais"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "2,91 %"

[[linha]]
id = "sem_energia_set"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TII-PT (quadro II, taxas de variação homóloga, no original «Annual rates (%)»), linha «Total excluding energy», coluna de setembro de 2026, o penúltimo número da linha"
excerto = '''Total excluding energy 2025 2.55 2.44 1.99 2.28 2.46 2.68 2.93 3 2.58 2.64 2.45 2.55 2026 2.26 2.46 2.53 2.81 2.62 2.83 2.68 2.72 2.84 2.91'''
valor = "2.84"
unidade = "%"
mede = "Taxa de variação homóloga do IPC total excluindo os produtos energéticos (no original, «Total excluding energy»), com duas casas decimais"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "2,84 %"

[[linha]]
id = "sem_energia_subida"
tipo = "derivado"
calculo = "sem_energia_out - sem_energia_set"
valor = "0.07"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga do IPC total excluindo os produtos energéticos em outubro de 2026 menos a de setembro de 2026"
periodo = "setembro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha do mesmo quadro dos quadros do destaque: a mesma medida (taxa de variação homóloga), o mesmo agregado (o total sem os produtos energéticos) e a mesma população, meses seguidos com a mesma estrutura de ponderação de 2026. Duas casas decimais, como nos quadros; a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "0,07 pontos percentuais"

[[linha]]
id = "alim_nt_out"
tipo = "valor"
fonte = "ine_ipc_out2026"
onde = "p. 1, primeiro parágrafo"
excerto = '''o índice referente aos produtos alimentares não transformados registou uma variação de 3,7% (valor idêntico em setembro).'''
valor = "3.7"
unidade = "%"
mede = "Taxa de variação homóloga do índice referente aos produtos alimentares não transformados (um agregado especial do IPC)"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "3,7 %"

[[linha]]
id = "alim_nt_set"
tipo = "valor"
fonte = "ine_ipc_out2026"
onde = "p. 1, primeiro parágrafo"
excerto = '''o índice referente aos produtos alimentares não transformados registou uma variação de 3,7% (valor idêntico em setembro).'''
valor = "3.7"
unidade = "%"
mede = "Taxa de variação homóloga do índice referente aos produtos alimentares não transformados, que o destaque dá como valor idêntico ao de outubro"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "3,7 %"

[[linha]]
id = "alim_nt_out_2c"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TII-PT (quadro II, taxas de variação homóloga, no original «Annual rates (%)»), linha «Unprocessed food», coluna de outubro de 2026, o último número da linha"
excerto = '''Unprocessed food 2025 1.8 2.4 2.77 3.25 4.01 4.67 6.15 6.99 6.97 6.09 5.95 6.07 2026 5.81 6.66 6.39 7.45 5.68 5.12 3.69 3.42 3.66 3.71'''
valor = "3.71"
unidade = "%"
mede = "Taxa de variação homóloga do índice dos produtos alimentares não transformados (um agregado especial do IPC), com duas casas decimais"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "3,71 %"

[[linha]]
id = "alim_nt_set_2c"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TII-PT (quadro II, taxas de variação homóloga, no original «Annual rates (%)»), linha «Unprocessed food», coluna de setembro de 2026, o penúltimo número da linha"
excerto = '''Unprocessed food 2025 1.8 2.4 2.77 3.25 4.01 4.67 6.15 6.99 6.97 6.09 5.95 6.07 2026 5.81 6.66 6.39 7.45 5.68 5.12 3.69 3.42 3.66 3.71'''
valor = "3.66"
unidade = "%"
mede = "Taxa de variação homóloga do índice dos produtos alimentares não transformados (um agregado especial do IPC), com duas casas decimais"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "3,66 %"

[[linha]]
id = "alim_nt_variacao"
tipo = "derivado"
calculo = "alim_nt_out_2c - alim_nt_set_2c"
valor = "0.05"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga dos produtos alimentares não transformados em outubro de 2026 menos a de setembro de 2026, com duas casas decimais"
periodo = "setembro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha do mesmo quadro dos quadros do destaque: a mesma medida, unidade e população, meses seguidos com a mesma estrutura de ponderação de 2026. Duas casas decimais, como nos quadros; a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais). O destaque, com uma casa decimal, dá as duas como idênticas (3,7 %)."
mostra = "0,05 pontos percentuais"

[[linha]]
id = "classe01_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Food and non-alcoholic beverages», 2026, coluna Oct"
excerto = '''Table II Annual rates (%) ECOICOP 2 (1) Index Divisions Year Month Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec Food and non-alcoholic beverages 2025 1.44 1.55 1.63 1.6 2.55 3.07 3.76 3.97 3.97 3.5 3.51 3.47 2026 3.2 3.56 3.65 4.41 3.25 2.95 2.24 2.14 2.38 2.45'''
valor = "2.45"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 01 da ECOICOP 2, «Produtos alimentares e bebidas não alcoólicas» (assim no Quadro 2 do destaque, p. 11; no quadro: «Food and non-alcoholic beverages», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "2,45 %"

[[linha]]
id = "classe01_set"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Food and non-alcoholic beverages», 2026, coluna Sep"
excerto = '''Table II Annual rates (%) ECOICOP 2 (1) Index Divisions Year Month Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec Food and non-alcoholic beverages 2025 1.44 1.55 1.63 1.6 2.55 3.07 3.76 3.97 3.97 3.5 3.51 3.47 2026 3.2 3.56 3.65 4.41 3.25 2.95 2.24 2.14 2.38 2.45'''
valor = "2.38"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 01 da ECOICOP 2, «Produtos alimentares e bebidas não alcoólicas» (assim no Quadro 2 do destaque, p. 11; no quadro: «Food and non-alcoholic beverages», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "2,38 %"

[[linha]]
id = "classe01_dif"
tipo = "derivado"
calculo = "classe01_out - classe01_set"
valor = "0.07"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga da classe 01 («Produtos alimentares e bebidas não alcoólicas») em outubro de 2026 menos a de setembro de 2026: positiva quando a taxa subiu, negativa quando desceu"
periodo = "setembro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha da mesma folha (TII-PT) dos quadros do INE: a mesma medida (taxa de variação homóloga, Annual rates (%)), a mesma unidade, a mesma classe da ECOICOP 2 e a mesma população (IPC, Portugal, base 2025=100), meses seguidos com a mesma estrutura de ponderação de 2026. Publicadas com duas casas decimais, a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "0,07 pontos percentuais"

[[linha]]
id = "classe02_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Alcoholic beverages and tobacco», 2026, coluna Oct"
excerto = '''Alcoholic beverages and tobacco 2025 2.8 3.42 2.45 -0.13 1.53 1.27 1.73 0.87 1.64 1.96 1.82 1.56 2026 1.95 2.17 2.93 4.96 3.13 2.94 2.6 2.87 1.54 2.17'''
valor = "2.17"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 02 da ECOICOP 2, «Bebidas alcoólicas e tabaco» (assim no Quadro 2 do destaque, p. 11; no quadro: «Alcoholic beverages and tobacco», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "2,17 %"

[[linha]]
id = "classe02_set"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Alcoholic beverages and tobacco», 2026, coluna Sep"
excerto = '''Alcoholic beverages and tobacco 2025 2.8 3.42 2.45 -0.13 1.53 1.27 1.73 0.87 1.64 1.96 1.82 1.56 2026 1.95 2.17 2.93 4.96 3.13 2.94 2.6 2.87 1.54 2.17'''
valor = "1.54"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 02 da ECOICOP 2, «Bebidas alcoólicas e tabaco» (assim no Quadro 2 do destaque, p. 11; no quadro: «Alcoholic beverages and tobacco», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "1,54 %"

[[linha]]
id = "classe02_dif"
tipo = "derivado"
calculo = "classe02_out - classe02_set"
valor = "0.63"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga da classe 02 («Bebidas alcoólicas e tabaco») em outubro de 2026 menos a de setembro de 2026: positiva quando a taxa subiu, negativa quando desceu"
periodo = "setembro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha da mesma folha (TII-PT) dos quadros do INE: a mesma medida (taxa de variação homóloga, Annual rates (%)), a mesma unidade, a mesma classe da ECOICOP 2 e a mesma população (IPC, Portugal, base 2025=100), meses seguidos com a mesma estrutura de ponderação de 2026. Publicadas com duas casas decimais, a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "0,63 pontos percentuais"

[[linha]]
id = "classe03_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Clothing and footwear», 2026, coluna Oct"
excerto = '''Clothing and footwear 2025 0.55 2.45 -1.06 -1.98 -1.73 -1.01 -2.01 -1.42 -1.42 -1.27 -1.76 -1.68 2026 -1.76 -1.89 -1.98 -1.15 -0.57 -2.12 -1.2 -1.16 -1.96 -3.18'''
valor = "-3.18"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 03 da ECOICOP 2, «Vestuário e calçado» (assim no Quadro 2 do destaque, p. 11; no quadro: «Clothing and footwear», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "-3,18 %"

[[linha]]
id = "classe03_set"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Clothing and footwear», 2026, coluna Sep"
excerto = '''Clothing and footwear 2025 0.55 2.45 -1.06 -1.98 -1.73 -1.01 -2.01 -1.42 -1.42 -1.27 -1.76 -1.68 2026 -1.76 -1.89 -1.98 -1.15 -0.57 -2.12 -1.2 -1.16 -1.96 -3.18'''
valor = "-1.96"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 03 da ECOICOP 2, «Vestuário e calçado» (assim no Quadro 2 do destaque, p. 11; no quadro: «Clothing and footwear», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "-1,96 %"

[[linha]]
id = "classe03_dif"
tipo = "derivado"
calculo = "classe03_out - classe03_set"
valor = "-1.22"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga da classe 03 («Vestuário e calçado») em outubro de 2026 menos a de setembro de 2026: positiva quando a taxa subiu, negativa quando desceu"
periodo = "setembro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha da mesma folha (TII-PT) dos quadros do INE: a mesma medida (taxa de variação homóloga, Annual rates (%)), a mesma unidade, a mesma classe da ECOICOP 2 e a mesma população (IPC, Portugal, base 2025=100), meses seguidos com a mesma estrutura de ponderação de 2026. Publicadas com duas casas decimais, a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "-1,22 pontos percentuais"

[[linha]]
id = "classe04_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Housing, water, electricity, gas and other fuels», 2026, coluna Oct"
excerto = '''Housing, water, electricity, gas and other fuels 2025 3.48 3.65 3.5 4.44 4.16 2.12 2.23 2.23 2.17 1.89 1.5 1.47 2026 2.86 2.53 2.6 2.89 3.55 3.59 3.19 3.28 3.37 4.02'''
valor = "4.02"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 04 da ECOICOP 2, «Habitação, água, eletricidade, gás e outros combustíveis» (assim no Quadro 2 do destaque, p. 11; no quadro: «Housing, water, electricity, gas and other fuels», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "4,02 %"

[[linha]]
id = "classe04_set"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Housing, water, electricity, gas and other fuels», 2026, coluna Sep"
excerto = '''Housing, water, electricity, gas and other fuels 2025 3.48 3.65 3.5 4.44 4.16 2.12 2.23 2.23 2.17 1.89 1.5 1.47 2026 2.86 2.53 2.6 2.89 3.55 3.59 3.19 3.28 3.37 4.02'''
valor = "3.37"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 04 da ECOICOP 2, «Habitação, água, eletricidade, gás e outros combustíveis» (assim no Quadro 2 do destaque, p. 11; no quadro: «Housing, water, electricity, gas and other fuels», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "3,37 %"

[[linha]]
id = "classe04_dif"
tipo = "derivado"
calculo = "classe04_out - classe04_set"
valor = "0.65"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga da classe 04 da ECOICOP 2 em outubro de 2026 menos a de setembro de 2026: positiva quando a taxa subiu, negativa quando desceu. A classe chama-se, no destaque, «Habitação, água, eletricidade, gás e outros combustíveis»: é a classe inteira, não só as rendas nem só a habitação"
periodo = "setembro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha da mesma folha (TII-PT) dos quadros do INE: a mesma medida (taxa de variação homóloga, Annual rates (%)), a mesma unidade, a mesma classe da ECOICOP 2 e a mesma população (IPC, Portugal, base 2025=100), meses seguidos com a mesma estrutura de ponderação de 2026. Publicadas com duas casas decimais, a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "0,65 pontos percentuais"

[[linha]]
id = "classe05_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Furnishings, household equipment and routine household maintenance», 2026, coluna Oct"
excerto = '''Furnishings, household equipment and routine household maintenance 2025 -0.93 -0.84 -0.61 -0.6 0.18 -0.17 0.05 0.18 0.2 0.36 0.13 0.14 2026 0.47 0.5 0.85 1.55 1.24 1.82 1.87 1.69 1.91 2.02'''
valor = "2.02"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 05 da ECOICOP 2, «Acessórios para o lar, equipamento doméstico e manutenção corrente da habitação» (assim no Quadro 2 do destaque, p. 11; no quadro: «Furnishings, household equipment and routine household maintenance», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "2,02 %"

[[linha]]
id = "classe05_set"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Furnishings, household equipment and routine household maintenance», 2026, coluna Sep"
excerto = '''Furnishings, household equipment and routine household maintenance 2025 -0.93 -0.84 -0.61 -0.6 0.18 -0.17 0.05 0.18 0.2 0.36 0.13 0.14 2026 0.47 0.5 0.85 1.55 1.24 1.82 1.87 1.69 1.91 2.02'''
valor = "1.91"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 05 da ECOICOP 2, «Acessórios para o lar, equipamento doméstico e manutenção corrente da habitação» (assim no Quadro 2 do destaque, p. 11; no quadro: «Furnishings, household equipment and routine household maintenance», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "1,91 %"

[[linha]]
id = "classe05_dif"
tipo = "derivado"
calculo = "classe05_out - classe05_set"
valor = "0.11"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga da classe 05 («Acessórios para o lar, equipamento doméstico e manutenção corrente da habitação») em outubro de 2026 menos a de setembro de 2026: positiva quando a taxa subiu, negativa quando desceu"
periodo = "setembro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha da mesma folha (TII-PT) dos quadros do INE: a mesma medida (taxa de variação homóloga, Annual rates (%)), a mesma unidade, a mesma classe da ECOICOP 2 e a mesma população (IPC, Portugal, base 2025=100), meses seguidos com a mesma estrutura de ponderação de 2026. Publicadas com duas casas decimais, a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "0,11 pontos percentuais"

[[linha]]
id = "classe06_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Health», 2026, coluna Oct"
excerto = '''Health 2025 3.29 3.31 3.44 3.49 3.53 3.22 3.18 3.07 3.03 2.96 2.93 2.81 2026 2.63 2.52 2.34 2.45 2.44 2.51 2.57 2.9 2.92 2.9'''
valor = "2.9"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 06 da ECOICOP 2, «Saúde» (assim no Quadro 2 do destaque, p. 11; no quadro: «Health», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "2,90 %"

[[linha]]
id = "classe06_set"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Health», 2026, coluna Sep"
excerto = '''Health 2025 3.29 3.31 3.44 3.49 3.53 3.22 3.18 3.07 3.03 2.96 2.93 2.81 2026 2.63 2.52 2.34 2.45 2.44 2.51 2.57 2.9 2.92 2.9'''
valor = "2.92"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 06 da ECOICOP 2, «Saúde» (assim no Quadro 2 do destaque, p. 11; no quadro: «Health», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "2,92 %"

[[linha]]
id = "classe06_dif"
tipo = "derivado"
calculo = "classe06_out - classe06_set"
valor = "-0.02"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga da classe 06 («Saúde») em outubro de 2026 menos a de setembro de 2026: positiva quando a taxa subiu, negativa quando desceu"
periodo = "setembro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha da mesma folha (TII-PT) dos quadros do INE: a mesma medida (taxa de variação homóloga, Annual rates (%)), a mesma unidade, a mesma classe da ECOICOP 2 e a mesma população (IPC, Portugal, base 2025=100), meses seguidos com a mesma estrutura de ponderação de 2026. Publicadas com duas casas decimais, a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "-0,02 pontos percentuais"

[[linha]]
id = "classe07_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Transport», 2026, coluna Oct"
excerto = '''Transport 2025 2.44 1.28 0.14 1.28 0.99 1.78 1.77 2.12 1.94 1.96 2.03 0.93 2026 0.04 0.58 3.78 4.8 5.96 5.49 4.92 6.42 8.22 8.34'''
valor = "8.34"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 07 da ECOICOP 2, «Transportes» (assim no Quadro 2 do destaque, p. 11; no quadro: «Transport», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "8,34 %"

[[linha]]
id = "classe07_set"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Transport», 2026, coluna Sep"
excerto = '''Transport 2025 2.44 1.28 0.14 1.28 0.99 1.78 1.77 2.12 1.94 1.96 2.03 0.93 2026 0.04 0.58 3.78 4.8 5.96 5.49 4.92 6.42 8.22 8.34'''
valor = "8.22"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 07 da ECOICOP 2, «Transportes» (assim no Quadro 2 do destaque, p. 11; no quadro: «Transport», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "8,22 %"

[[linha]]
id = "classe07_dif"
tipo = "derivado"
calculo = "classe07_out - classe07_set"
valor = "0.12"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga da classe 07 («Transportes») em outubro de 2026 menos a de setembro de 2026: positiva quando a taxa subiu, negativa quando desceu"
periodo = "setembro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha da mesma folha (TII-PT) dos quadros do INE: a mesma medida (taxa de variação homóloga, Annual rates (%)), a mesma unidade, a mesma classe da ECOICOP 2 e a mesma população (IPC, Portugal, base 2025=100), meses seguidos com a mesma estrutura de ponderação de 2026. Publicadas com duas casas decimais, a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "0,12 pontos percentuais"

[[linha]]
id = "classe08_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Information and communication», 2026, coluna Oct"
excerto = '''Information and communication 2025 3.69 -0.18 -1.01 -1.77 -1.59 -1.51 -1.4 -1.07 -2.04 -3.66 -4.01 -3.06 2026 -2.32 -2.51 -2.34 -2.07 -2.44 -2.77 -3.35 -3.88 -2.14 -0.03'''
valor = "-0.03"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 08 da ECOICOP 2, «Informação e comunicação» (assim no Quadro 2 do destaque, p. 11; no quadro: «Information and communication», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "-0,03 %"

[[linha]]
id = "classe08_set"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Information and communication», 2026, coluna Sep"
excerto = '''Information and communication 2025 3.69 -0.18 -1.01 -1.77 -1.59 -1.51 -1.4 -1.07 -2.04 -3.66 -4.01 -3.06 2026 -2.32 -2.51 -2.34 -2.07 -2.44 -2.77 -3.35 -3.88 -2.14 -0.03'''
valor = "-2.14"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 08 da ECOICOP 2, «Informação e comunicação» (assim no Quadro 2 do destaque, p. 11; no quadro: «Information and communication», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "-2,14 %"

[[linha]]
id = "classe08_dif"
tipo = "derivado"
calculo = "classe08_out - classe08_set"
valor = "2.11"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga da classe 08 («Informação e comunicação») em outubro de 2026 menos a de setembro de 2026: positiva quando a taxa subiu, negativa quando desceu"
periodo = "setembro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha da mesma folha (TII-PT) dos quadros do INE: a mesma medida (taxa de variação homóloga, Annual rates (%)), a mesma unidade, a mesma classe da ECOICOP 2 e a mesma população (IPC, Portugal, base 2025=100), meses seguidos com a mesma estrutura de ponderação de 2026. Publicadas com duas casas decimais, a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "2,11 pontos percentuais"

[[linha]]
id = "classe09_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Recreation, sport and culture», 2026, coluna Oct"
excerto = '''Recreation, sport and culture 2025 4.98 4.6 3.14 4.58 4.64 3.71 3.61 3.48 1.45 1.88 1.84 2.06 2026 -0.02 0.1 0.43 -0.55 0.15 1.45 2.41 1.46 0.71 2.64'''
valor = "2.64"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 09 da ECOICOP 2, «Lazer, recreação, desporto e cultura» (assim no Quadro 2 do destaque, p. 11; no quadro: «Recreation, sport and culture», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "2,64 %"

[[linha]]
id = "classe09_set"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Recreation, sport and culture», 2026, coluna Sep"
excerto = '''Recreation, sport and culture 2025 4.98 4.6 3.14 4.58 4.64 3.71 3.61 3.48 1.45 1.88 1.84 2.06 2026 -0.02 0.1 0.43 -0.55 0.15 1.45 2.41 1.46 0.71 2.64'''
valor = "0.71"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 09 da ECOICOP 2, «Lazer, recreação, desporto e cultura» (assim no Quadro 2 do destaque, p. 11; no quadro: «Recreation, sport and culture», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "0,71 %"

[[linha]]
id = "classe09_dif"
tipo = "derivado"
calculo = "classe09_out - classe09_set"
valor = "1.93"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga da classe 09 («Lazer, recreação, desporto e cultura») em outubro de 2026 menos a de setembro de 2026: positiva quando a taxa subiu, negativa quando desceu"
periodo = "setembro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha da mesma folha (TII-PT) dos quadros do INE: a mesma medida (taxa de variação homóloga, Annual rates (%)), a mesma unidade, a mesma classe da ECOICOP 2 e a mesma população (IPC, Portugal, base 2025=100), meses seguidos com a mesma estrutura de ponderação de 2026. Publicadas com duas casas decimais, a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "1,93 pontos percentuais"

[[linha]]
id = "classe10_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Education services», 2026, coluna Oct"
excerto = '''Education services 2025 3.37 3.44 3.47 3.47 3.41 3.42 3.4 3.42 3.36 4.26 4.27 4.24 2026 4.15 4.16 4.22 4.33 4.35 4.34 4.4 4.47 4.6 3.07'''
valor = "3.07"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 10 da ECOICOP 2, «Serviços de educação» (assim no Quadro 2 do destaque, p. 11; no quadro: «Education services», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "3,07 %"

[[linha]]
id = "classe10_set"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Education services», 2026, coluna Sep"
excerto = '''Education services 2025 3.37 3.44 3.47 3.47 3.41 3.42 3.4 3.42 3.36 4.26 4.27 4.24 2026 4.15 4.16 4.22 4.33 4.35 4.34 4.4 4.47 4.6 3.07'''
valor = "4.6"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 10 da ECOICOP 2, «Serviços de educação» (assim no Quadro 2 do destaque, p. 11; no quadro: «Education services», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "4,60 %"

[[linha]]
id = "classe10_dif"
tipo = "derivado"
calculo = "classe10_out - classe10_set"
valor = "-1.53"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga da classe 10 («Serviços de educação») em outubro de 2026 menos a de setembro de 2026: positiva quando a taxa subiu, negativa quando desceu"
periodo = "setembro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha da mesma folha (TII-PT) dos quadros do INE: a mesma medida (taxa de variação homóloga, Annual rates (%)), a mesma unidade, a mesma classe da ECOICOP 2 e a mesma população (IPC, Portugal, base 2025=100), meses seguidos com a mesma estrutura de ponderação de 2026. Publicadas com duas casas decimais, a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "-1,53 pontos percentuais"

[[linha]]
id = "classe11_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Restaurants and accommodation services», 2026, coluna Oct"
excerto = '''Restaurants and accommodation services 2025 5.6 5.13 5.24 6.7 6.14 6.8 7.52 7.67 6.19 5.74 5.31 5.99 2026 4.31 4.76 5.05 5.71 5.13 6.23 5.99 6.23 7.25 7.91'''
valor = "7.91"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 11 da ECOICOP 2, «Restaurantes e serviços de alojamento» (assim no Quadro 2 do destaque, p. 11; no quadro: «Restaurants and accommodation services», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "7,91 %"

[[linha]]
id = "classe11_set"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Restaurants and accommodation services», 2026, coluna Sep"
excerto = '''Restaurants and accommodation services 2025 5.6 5.13 5.24 6.7 6.14 6.8 7.52 7.67 6.19 5.74 5.31 5.99 2026 4.31 4.76 5.05 5.71 5.13 6.23 5.99 6.23 7.25 7.91'''
valor = "7.25"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 11 da ECOICOP 2, «Restaurantes e serviços de alojamento» (assim no Quadro 2 do destaque, p. 11; no quadro: «Restaurants and accommodation services», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "7,25 %"

[[linha]]
id = "classe11_dif"
tipo = "derivado"
calculo = "classe11_out - classe11_set"
valor = "0.66"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga da classe 11 («Restaurantes e serviços de alojamento») em outubro de 2026 menos a de setembro de 2026: positiva quando a taxa subiu, negativa quando desceu"
periodo = "setembro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha da mesma folha (TII-PT) dos quadros do INE: a mesma medida (taxa de variação homóloga, Annual rates (%)), a mesma unidade, a mesma classe da ECOICOP 2 e a mesma população (IPC, Portugal, base 2025=100), meses seguidos com a mesma estrutura de ponderação de 2026. Publicadas com duas casas decimais, a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "0,66 pontos percentuais"

[[linha]]
id = "classe12_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Insurance and financial services», 2026, coluna Oct"
excerto = '''Insurance and financial services 2025 3.12 3.77 4.21 4.2 2.83 4.31 3.93 3.4 3.85 3.53 2.09 2.76 2026 1.91 1.74 1.59 2.59 2.94 1.96 2.59 3.07 2.8 2.91'''
valor = "2.91"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 12 da ECOICOP 2, «Serviços financeiros e de seguros» (assim no Quadro 2 do destaque, p. 11; no quadro: «Insurance and financial services», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "2,91 %"

[[linha]]
id = "classe12_set"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Insurance and financial services», 2026, coluna Sep"
excerto = '''Insurance and financial services 2025 3.12 3.77 4.21 4.2 2.83 4.31 3.93 3.4 3.85 3.53 2.09 2.76 2026 1.91 1.74 1.59 2.59 2.94 1.96 2.59 3.07 2.8 2.91'''
valor = "2.8"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 12 da ECOICOP 2, «Serviços financeiros e de seguros» (assim no Quadro 2 do destaque, p. 11; no quadro: «Insurance and financial services», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "2,80 %"

[[linha]]
id = "classe12_dif"
tipo = "derivado"
calculo = "classe12_out - classe12_set"
valor = "0.11"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga da classe 12 («Serviços financeiros e de seguros») em outubro de 2026 menos a de setembro de 2026: positiva quando a taxa subiu, negativa quando desceu"
periodo = "setembro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha da mesma folha (TII-PT) dos quadros do INE: a mesma medida (taxa de variação homóloga, Annual rates (%)), a mesma unidade, a mesma classe da ECOICOP 2 e a mesma população (IPC, Portugal, base 2025=100), meses seguidos com a mesma estrutura de ponderação de 2026. Publicadas com duas casas decimais, a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "0,11 pontos percentuais"

[[linha]]
id = "classe13_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Personal care, social protection and miscellaneous goods and services», 2026, coluna Oct"
excerto = '''Personal care, social protection and miscellaneous goods and services 2025 1.38 1.81 1.61 1.18 1.31 1.28 1.4 1.35 1.45 3.1 3.13 3.25 2026 3.87 3.91 4.27 4.57 4.43 4.18 4.09 4.46 4.25 3.51'''
valor = "3.51"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 13 da ECOICOP 2, «Serviços de higiene e cuidados pessoais, proteção social e bens e serv. diversos» (assim no Quadro 2 do destaque, p. 11; no quadro: «Personal care, social protection and miscellaneous goods and services», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "3,51 %"

[[linha]]
id = "classe13_set"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Personal care, social protection and miscellaneous goods and services», 2026, coluna Sep"
excerto = '''Personal care, social protection and miscellaneous goods and services 2025 1.38 1.81 1.61 1.18 1.31 1.28 1.4 1.35 1.45 3.1 3.13 3.25 2026 3.87 3.91 4.27 4.57 4.43 4.18 4.09 4.46 4.25 3.51'''
valor = "4.25"
unidade = "%"
mede = "Taxa de variação homóloga do IPC da classe 13 da ECOICOP 2, «Serviços de higiene e cuidados pessoais, proteção social e bens e serv. diversos» (assim no Quadro 2 do destaque, p. 11; no quadro: «Personal care, social protection and miscellaneous goods and services», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "4,25 %"

[[linha]]
id = "classe13_dif"
tipo = "derivado"
calculo = "classe13_out - classe13_set"
valor = "-0.74"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga da classe 13 («Serviços de higiene e cuidados pessoais, proteção social e bens e serv. diversos») em outubro de 2026 menos a de setembro de 2026: positiva quando a taxa subiu, negativa quando desceu"
periodo = "setembro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha da mesma folha (TII-PT) dos quadros do INE: a mesma medida (taxa de variação homóloga, Annual rates (%)), a mesma unidade, a mesma classe da ECOICOP 2 e a mesma população (IPC, Portugal, base 2025=100), meses seguidos com a mesma estrutura de ponderação de 2026. Publicadas com duas casas decimais, a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "-0,74 pontos percentuais"

[[linha]]
id = "peso_classe01"
tipo = "valor"
fonte = "ine_ipc_out2026"
onde = "p. 11, Quadro 2 (ponderadores do IPC e do IHPC em 2026), linha da classe 01, coluna do IPC: o primeiro dos dois números da linha (o segundo é o do IHPC)"
excerto = '''01 Produtos alimentares e bebidas não alcoólicas 224,0 207,4'''
valor = "224.0"
unidade = "‰"
mede = "Ponderador da classe 01 da ECOICOP 2, «Produtos alimentares e bebidas não alcoólicas», no IPC: a parte da classe na estrutura de ponderação do índice, em permilagem (o total do quadro é 1 000)"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "2026 (a estrutura de ponderação dos índices de 2026)"
provisorio = false
mostra = "224,0 ‰"

[[linha]]
id = "peso_classe04"
tipo = "valor"
fonte = "ine_ipc_out2026"
onde = "p. 11, Quadro 2 (ponderadores do IPC e do IHPC em 2026), linha da classe 04, coluna do IPC: o primeiro dos dois números da linha (o segundo é o do IHPC)"
excerto = '''04 Habitação, água, eletricidade, gás e outros combustíveis 93,6 82,5'''
valor = "93.6"
unidade = "‰"
mede = "Ponderador da classe 04 da ECOICOP 2, «Habitação, água, eletricidade, gás e outros combustíveis», no IPC: a parte da classe na estrutura de ponderação do índice, em permilagem (o total do quadro é 1 000)"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "2026 (a estrutura de ponderação dos índices de 2026)"
provisorio = false
mostra = "93,6 ‰"

[[linha]]
id = "peso_classe07"
tipo = "valor"
fonte = "ine_ipc_out2026"
onde = "p. 11, Quadro 2 (ponderadores do IPC e do IHPC em 2026), linha da classe 07, coluna do IPC: o primeiro dos dois números da linha (o segundo é o do IHPC)"
excerto = '''07 Transportes 151,3 149,0'''
valor = "151.3"
unidade = "‰"
mede = "Ponderador da classe 07 da ECOICOP 2, «Transportes», no IPC: a parte da classe na estrutura de ponderação do índice, em permilagem (o total do quadro é 1 000)"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "2026 (a estrutura de ponderação dos índices de 2026)"
provisorio = false
mostra = "151,3 ‰"

[[linha]]
id = "peso_classe08"
tipo = "valor"
fonte = "ine_ipc_out2026"
onde = "p. 11, Quadro 2 (ponderadores do IPC e do IHPC em 2026), linha da classe 08, coluna do IPC: o primeiro dos dois números da linha (o segundo é o do IHPC)"
excerto = '''08 Informação e comunicação 30,8 27,5'''
valor = "30.8"
unidade = "‰"
mede = "Ponderador da classe 08 da ECOICOP 2, «Informação e comunicação», no IPC: a parte da classe na estrutura de ponderação do índice, em permilagem (o total do quadro é 1 000)"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "2026 (a estrutura de ponderação dos índices de 2026)"
provisorio = false
mostra = "30,8 ‰"

[[linha]]
id = "peso_classe09"
tipo = "valor"
fonte = "ine_ipc_out2026"
onde = "p. 11, Quadro 2 (ponderadores do IPC e do IHPC em 2026), linha da classe 09, coluna do IPC: o primeiro dos dois números da linha (o segundo é o do IHPC)"
excerto = '''09 Lazer, recreação, desporto e cultura 58,8 55,6'''
valor = "58.8"
unidade = "‰"
mede = "Ponderador da classe 09 da ECOICOP 2, «Lazer, recreação, desporto e cultura», no IPC: a parte da classe na estrutura de ponderação do índice, em permilagem (o total do quadro é 1 000)"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "2026 (a estrutura de ponderação dos índices de 2026)"
provisorio = false
mostra = "58,8 ‰"

[[linha]]
id = "peso_classe11"
tipo = "valor"
fonte = "ine_ipc_out2026"
onde = "p. 11, Quadro 2 (ponderadores do IPC e do IHPC em 2026), linha da classe 11, coluna do IPC: o primeiro dos dois números da linha (o segundo é o do IHPC)"
excerto = '''11 Restaurantes e serviços de alojamento 105,4 167,0'''
valor = "105.4"
unidade = "‰"
mede = "Ponderador da classe 11 da ECOICOP 2, «Restaurantes e serviços de alojamento», no IPC: a parte da classe na estrutura de ponderação do índice, em permilagem (o total do quadro é 1 000)"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "2026 (a estrutura de ponderação dos índices de 2026)"
provisorio = false
mostra = "105,4 ‰"

[[linha]]
id = "classe08_mensal_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TIII-PT (Table III, Monthly rates (%), PORTUGAL), linha «Information and communication», 2026, coluna Oct"
excerto = '''Information and communication 2025 -0.21 0.22 -0.04 -0.97 0.27 -0.28 -0.12 0.39 -1.04 -1.6 -0.39 0.68 2026 0.56 0.02 0.13 -0.69 -0.11 -0.61 -0.72 -0.16 0.75 0.52'''
valor = "0.52"
unidade = "%"
mede = "Taxa de variação mensal do IPC da classe 08 da ECOICOP 2, «Informação e comunicação» (no quadro: «Information and communication», Monthly rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a setembro de 2026"
provisorio = false
mostra = "0,52 %"

[[linha]]
id = "classe08_mensal_out25"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TIII-PT (Table III, Monthly rates (%), PORTUGAL), linha «Information and communication», 2025, coluna Oct"
excerto = '''Information and communication 2025 -0.21 0.22 -0.04 -0.97 0.27 -0.28 -0.12 0.39 -1.04 -1.6 -0.39 0.68 2026 0.56 0.02 0.13 -0.69 -0.11 -0.61 -0.72 -0.16 0.75 0.52'''
valor = "-1.6"
unidade = "%"
mede = "Taxa de variação mensal do IPC da classe 08 da ECOICOP 2, «Informação e comunicação» (no quadro: «Information and communication», Monthly rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2025, face a setembro de 2025"
provisorio = false
mostra = "-1,60 %"

[[linha]]
id = "classe08_mensal_vs_ano_antes"
tipo = "derivado"
calculo = "classe08_mensal_out - classe08_mensal_out25"
valor = "2.12"
unidade = "pontos percentuais"
mede = "Variação mensal da classe 08 («Informação e comunicação») em outubro de 2026 menos a de outubro de 2025: o mês que entra na taxa homóloga de outubro face ao que dela sai"
periodo = "outubro de 2026 e outubro de 2025 (variações mensais)"
compara = "As duas taxas estão na mesma linha da mesma folha (TIII-PT) dos quadros do INE: a mesma medida (taxa de variação mensal), a mesma classe e população (IPC, Portugal, base 2025=100), no mesmo mês do calendário com um ano de intervalo. O destaque (p. 10) diz que a taxa homóloga não é afetada pelas oscilações sazonais perante um padrão estável de sazonalidade; estes números não mostram se o padrão de outubro foi o mesmo nos dois anos. Duas casas decimais, como nos quadros; a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "2,12 pontos percentuais"

[[linha]]
id = "classe09_mensal_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TIII-PT (Table III, Monthly rates (%), PORTUGAL), linha «Recreation, sport and culture», 2026, coluna Oct"
excerto = '''Recreation, sport and culture 2025 1.28 0.6 -0.57 1.43 -0.09 -0.69 0.26 0.72 -1.99 -1.07 0.7 1.53 2026 -0.78 0.71 -0.23 0.44 0.62 0.59 1.21 -0.21 -2.71 0.82'''
valor = "0.82"
unidade = "%"
mede = "Taxa de variação mensal do IPC da classe 09 da ECOICOP 2, «Lazer, recreação, desporto e cultura» (no quadro: «Recreation, sport and culture», Monthly rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a setembro de 2026"
provisorio = false
mostra = "0,82 %"

[[linha]]
id = "classe09_mensal_out25"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TIII-PT (Table III, Monthly rates (%), PORTUGAL), linha «Recreation, sport and culture», 2025, coluna Oct"
excerto = '''Recreation, sport and culture 2025 1.28 0.6 -0.57 1.43 -0.09 -0.69 0.26 0.72 -1.99 -1.07 0.7 1.53 2026 -0.78 0.71 -0.23 0.44 0.62 0.59 1.21 -0.21 -2.71 0.82'''
valor = "-1.07"
unidade = "%"
mede = "Taxa de variação mensal do IPC da classe 09 da ECOICOP 2, «Lazer, recreação, desporto e cultura» (no quadro: «Recreation, sport and culture», Monthly rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2025, face a setembro de 2025"
provisorio = false
mostra = "-1,07 %"

[[linha]]
id = "classe09_mensal_vs_ano_antes"
tipo = "derivado"
calculo = "classe09_mensal_out - classe09_mensal_out25"
valor = "1.89"
unidade = "pontos percentuais"
mede = "Variação mensal da classe 09 («Lazer, recreação, desporto e cultura») em outubro de 2026 menos a de outubro de 2025: o mês que entra na taxa homóloga de outubro face ao que dela sai"
periodo = "outubro de 2026 e outubro de 2025 (variações mensais)"
compara = "As duas taxas estão na mesma linha da mesma folha (TIII-PT) dos quadros do INE: a mesma medida (taxa de variação mensal), a mesma classe e população (IPC, Portugal, base 2025=100), no mesmo mês do calendário com um ano de intervalo. O destaque (p. 10) diz que a taxa homóloga não é afetada pelas oscilações sazonais perante um padrão estável de sazonalidade; estes números não mostram se o padrão de outubro foi o mesmo nos dois anos. Duas casas decimais, como nos quadros; a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "1,89 pontos percentuais"

[[linha]]
id = "classe10_mensal_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TIII-PT (quadro III, taxas de variação mensal, no original «Monthly rates (%)»), linha «Education services», coluna de outubro de 2026, o último número da linha"
excerto = '''Education services 2025 0.04 0.05 0.03 0 0.01 0.01 -0.01 0.02 0.1 3.88 0.08 0.02 2026 -0.04 0.05 0.09 0.1 0.03 0 0.05 0.09 0.22 2.36'''
valor = "2.36"
unidade = "%"
mede = "Taxa de variação mensal do IPC da classe 10 da ECOICOP 2, «Serviços de educação» (no original, «Education services»), com duas casas decimais"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a setembro de 2026"
provisorio = false
mostra = "2,36 %"

[[linha]]
id = "classe10_mensal_out25"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TIII-PT (quadro III, taxas de variação mensal, no original «Monthly rates (%)»), linha «Education services», coluna de outubro de 2025, o décimo número a seguir a 2025"
excerto = '''Education services 2025 0.04 0.05 0.03 0 0.01 0.01 -0.01 0.02 0.1 3.88 0.08 0.02 2026 -0.04 0.05 0.09 0.1 0.03 0 0.05 0.09 0.22 2.36'''
valor = "3.88"
unidade = "%"
mede = "Taxa de variação mensal do IPC da classe 10 da ECOICOP 2, «Serviços de educação» (no original, «Education services»), com duas casas decimais"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2025, face a setembro de 2025"
provisorio = false
mostra = "3,88 %"

[[linha]]
id = "classe10_mensal_vs_ano_antes"
tipo = "derivado"
calculo = "classe10_mensal_out - classe10_mensal_out25"
valor = "-1.52"
unidade = "pontos percentuais"
mede = "Variação mensal da classe 10 («Serviços de educação») em outubro de 2026 menos a de outubro de 2025: o mês que entra na taxa homóloga de outubro face ao que dela sai; negativa quando o mês que entra subiu menos do que o que sai"
periodo = "outubro de 2026 e outubro de 2025 (variações mensais)"
compara = "As duas taxas estão na mesma linha da mesma folha (TIII-PT) dos quadros do INE: a mesma medida (taxa de variação mensal), a mesma classe e população (IPC, Portugal, base 2025=100), no mesmo mês do calendário com um ano de intervalo. O destaque (p. 10) diz que a taxa homóloga não é afetada pelas oscilações sazonais perante um padrão estável de sazonalidade; estes números não mostram se o padrão de outubro foi o mesmo nos dois anos. Duas casas decimais, como nos quadros; a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "-1,52 pontos percentuais"

[[linha]]
id = "classe13_mensal_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TIII-PT (quadro III, taxas de variação mensal, no original «Monthly rates (%)»), linha «Personal care, social protection and miscellaneous goods and services», coluna de outubro de 2026, o último número da linha"
excerto = '''Personal care, social protection and miscellaneous goods and services 2025 0.43 0.6 0.04 0.08 -0.06 0.13 -0.03 0.03 0.32 1.34 0.07 0.25 2026 1.03 0.64 0.39 0.36 -0.19 -0.11 -0.11 0.38 0.12 0.62'''
valor = "0.62"
unidade = "%"
mede = "Taxa de variação mensal do IPC da classe 13 da ECOICOP 2, «Serviços de higiene e cuidados pessoais, proteção social e bens e serv. diversos» (no original, «Personal care, social protection and miscellaneous goods and services»), com duas casas decimais"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a setembro de 2026"
provisorio = false
mostra = "0,62 %"

[[linha]]
id = "classe13_mensal_out25"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TIII-PT (quadro III, taxas de variação mensal, no original «Monthly rates (%)»), linha «Personal care, social protection and miscellaneous goods and services», coluna de outubro de 2025, o décimo número a seguir a 2025"
excerto = '''Personal care, social protection and miscellaneous goods and services 2025 0.43 0.6 0.04 0.08 -0.06 0.13 -0.03 0.03 0.32 1.34 0.07 0.25 2026 1.03 0.64 0.39 0.36 -0.19 -0.11 -0.11 0.38 0.12 0.62'''
valor = "1.34"
unidade = "%"
mede = "Taxa de variação mensal do IPC da classe 13 da ECOICOP 2, «Serviços de higiene e cuidados pessoais, proteção social e bens e serv. diversos» (no original, «Personal care, social protection and miscellaneous goods and services»), com duas casas decimais"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2025, face a setembro de 2025"
provisorio = false
mostra = "1,34 %"

[[linha]]
id = "classe13_mensal_vs_ano_antes"
tipo = "derivado"
calculo = "classe13_mensal_out - classe13_mensal_out25"
valor = "-0.72"
unidade = "pontos percentuais"
mede = "Variação mensal da classe 13 («Serviços de higiene e cuidados pessoais, proteção social e bens e serv. diversos») em outubro de 2026 menos a de outubro de 2025: o mês que entra na taxa homóloga de outubro face ao que dela sai; negativa quando o mês que entra subiu menos do que o que sai"
periodo = "outubro de 2026 e outubro de 2025 (variações mensais)"
compara = "As duas taxas estão na mesma linha da mesma folha (TIII-PT) dos quadros do INE: a mesma medida (taxa de variação mensal), a mesma classe e população (IPC, Portugal, base 2025=100), no mesmo mês do calendário com um ano de intervalo. O destaque (p. 10) diz que a taxa homóloga não é afetada pelas oscilações sazonais perante um padrão estável de sazonalidade; estes números não mostram se o padrão de outubro foi o mesmo nos dois anos. Duas casas decimais, como nos quadros; a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "-0,72 pontos percentuais"

[[linha]]
id = "classe03_mensal_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TIII-PT (quadro III, taxas de variação mensal, no original «Monthly rates (%)»), linha «Clothing and footwear», coluna de outubro de 2026, o último número da linha"
excerto = '''Clothing and footwear 2025 -14.23 -4.94 21.78 0.82 0.02 -0.71 -13.63 -6.45 22.5 1.8 -0.07 -1.78 2026 -14.29 -5.07 21.67 1.67 0.61 -2.26 -12.82 -6.41 21.51 0.53'''
valor = "0.53"
unidade = "%"
mede = "Taxa de variação mensal do IPC da classe 03 da ECOICOP 2, «Vestuário e calçado» (no original, «Clothing and footwear»), com duas casas decimais"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a setembro de 2026"
provisorio = false
mostra = "0,53 %"

[[linha]]
id = "classe03_mensal_out25"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TIII-PT (quadro III, taxas de variação mensal, no original «Monthly rates (%)»), linha «Clothing and footwear», coluna de outubro de 2025, o décimo número a seguir a 2025"
excerto = '''Clothing and footwear 2025 -14.23 -4.94 21.78 0.82 0.02 -0.71 -13.63 -6.45 22.5 1.8 -0.07 -1.78 2026 -14.29 -5.07 21.67 1.67 0.61 -2.26 -12.82 -6.41 21.51 0.53'''
valor = "1.8"
unidade = "%"
mede = "Taxa de variação mensal do IPC da classe 03 da ECOICOP 2, «Vestuário e calçado» (no original, «Clothing and footwear»), com duas casas decimais"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2025, face a setembro de 2025"
provisorio = false
mostra = "1,80 %"

[[linha]]
id = "classe03_mensal_vs_ano_antes"
tipo = "derivado"
calculo = "classe03_mensal_out - classe03_mensal_out25"
valor = "-1.27"
unidade = "pontos percentuais"
mede = "Variação mensal da classe 03 («Vestuário e calçado») em outubro de 2026 menos a de outubro de 2025: o mês que entra na taxa homóloga de outubro face ao que dela sai; negativa quando o mês que entra subiu menos do que o que sai"
periodo = "outubro de 2026 e outubro de 2025 (variações mensais)"
compara = "As duas taxas estão na mesma linha da mesma folha (TIII-PT) dos quadros do INE: a mesma medida (taxa de variação mensal), a mesma classe e população (IPC, Portugal, base 2025=100), no mesmo mês do calendário com um ano de intervalo. O destaque (p. 10) diz que a taxa homóloga não é afetada pelas oscilações sazonais perante um padrão estável de sazonalidade; estes números não mostram se o padrão de outubro foi o mesmo nos dois anos. Duas casas decimais, como nos quadros; a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "-1,27 pontos percentuais"

[[linha]]
id = "bens_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Goods», 2026, coluna Oct"
excerto = '''Goods 2025 1.13 1.4 0.74 0.4 1.01 1.04 1.37 1.57 1.55 1.28 1.23 0.98 2026 0.99 1.11 2.21 3.49 3.13 2.43 2.18 2.65 2.96 3.1'''
valor = "3.1"
unidade = "%"
mede = "Taxa de variação homóloga do IPC do agregado especial dos bens (no quadro: «Goods», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "3,10 %"

[[linha]]
id = "bens_set"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Goods», 2026, coluna Sep"
excerto = '''Goods 2025 1.13 1.4 0.74 0.4 1.01 1.04 1.37 1.57 1.55 1.28 1.23 0.98 2026 0.99 1.11 2.21 3.49 3.13 2.43 2.18 2.65 2.96 3.1'''
valor = "2.96"
unidade = "%"
mede = "Taxa de variação homóloga do IPC do agregado especial dos bens (no quadro: «Goods», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "2,96 %"

[[linha]]
id = "bens_subida"
tipo = "derivado"
calculo = "bens_out - bens_set"
valor = "0.14"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga dos bens em outubro de 2026 menos a de setembro de 2026"
periodo = "setembro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha da mesma folha (TII-PT) dos quadros do INE: a mesma medida (taxa de variação homóloga), o mesmo agregado e população (IPC, Portugal, base 2025=100), meses seguidos com a mesma estrutura de ponderação de 2026; duas casas decimais, a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "0,14 pontos percentuais"

[[linha]]
id = "servicos_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Services», 2026, coluna Oct"
excerto = '''Services 2025 4.51 3.77 3.4 4.47 3.98 4.22 4.38 4.38 3.56 3.82 3.57 3.86 2026 3.15 3.38 3.41 3.16 3.42 4.19 4.03 3.95 4.4 4.69'''
valor = "4.69"
unidade = "%"
mede = "Taxa de variação homóloga do IPC do agregado especial dos serviços (no quadro: «Services», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "4,69 %"

[[linha]]
id = "servicos_set"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "folha TII-PT (Table II, Annual rates (%), PORTUGAL), linha «Services», 2026, coluna Sep"
excerto = '''Services 2025 4.51 3.77 3.4 4.47 3.98 4.22 4.38 4.38 3.56 3.82 3.57 3.86 2026 3.15 3.38 3.41 3.16 3.42 4.19 4.03 3.95 4.4 4.69'''
valor = "4.4"
unidade = "%"
mede = "Taxa de variação homóloga do IPC do agregado especial dos serviços (no quadro: «Services», Annual rates (%))"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "setembro de 2026, face a setembro de 2025"
provisorio = false
mostra = "4,40 %"

[[linha]]
id = "servicos_subida"
tipo = "derivado"
calculo = "servicos_out - servicos_set"
valor = "0.29"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga dos serviços em outubro de 2026 menos a de setembro de 2026"
periodo = "setembro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha da mesma folha (TII-PT) dos quadros do INE: a mesma medida (taxa de variação homóloga), o mesmo agregado e população (IPC, Portugal, base 2025=100), meses seguidos com a mesma estrutura de ponderação de 2026; duas casas decimais, a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "0,29 pontos percentuais"

[[linha]]
id = "servicos_jan"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TII-PT (quadro II, taxas de variação homóloga, no original «Annual rates (%)»), linha «Services», coluna de janeiro de 2026, o primeiro número a seguir a 2026"
excerto = '''Services 2025 4.51 3.77 3.4 4.47 3.98 4.22 4.38 4.38 3.56 3.82 3.57 3.86 2026 3.15 3.38 3.41 3.16 3.42 4.19 4.03 3.95 4.4 4.69'''
valor = "3.15"
unidade = "%"
mede = "Taxa de variação homóloga do IPC do agregado especial dos serviços (no original, «Services»), com duas casas decimais"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "janeiro de 2026, face a janeiro de 2025"
provisorio = false
mostra = "3,15 %"

[[linha]]
id = "servicos_out_vs_jan"
tipo = "derivado"
calculo = "servicos_out - servicos_jan"
valor = "1.54"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga dos serviços em outubro de 2026 menos a de janeiro de 2026"
periodo = "janeiro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha do mesmo quadro dos quadros do destaque: a mesma medida (taxa de variação homóloga), o mesmo agregado e a mesma população, e a mesma estrutura de ponderação de 2026. Cada taxa compara o seu mês com o mesmo mês de 2025, pelo que a diferença mostra quanto a taxa homóloga se moveu entre janeiro e outubro, não quanto subiram os preços nesse período. Duas casas decimais, como nos quadros; a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "1,54 pontos percentuais"

[[linha]]
id = "servicos_mensal_out"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TIII-PT (quadro III, taxas de variação mensal, no original «Monthly rates (%)»), linha «Services», coluna de outubro de 2026, o último número da linha"
excerto = '''Services 2025 0.47 0.27 0.85 1.76 0.42 0.14 0.41 0.6 -0.56 -0.38 -0.87 0.71 2026 -0.22 0.5 0.88 1.51 0.68 0.88 0.26 0.53 -0.13 -0.11'''
valor = "-0.11"
unidade = "%"
mede = "Taxa de variação mensal do IPC do agregado especial dos serviços (no original, «Services»), com duas casas decimais"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2026, face a setembro de 2026"
provisorio = false
mostra = "-0,11 %"

[[linha]]
id = "servicos_mensal_out25"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TIII-PT (quadro III, taxas de variação mensal, no original «Monthly rates (%)»), linha «Services», coluna de outubro de 2025, o décimo número a seguir a 2025"
excerto = '''Services 2025 0.47 0.27 0.85 1.76 0.42 0.14 0.41 0.6 -0.56 -0.38 -0.87 0.71 2026 -0.22 0.5 0.88 1.51 0.68 0.88 0.26 0.53 -0.13 -0.11'''
valor = "-0.38"
unidade = "%"
mede = "Taxa de variação mensal do IPC do agregado especial dos serviços (no original, «Services»), com duas casas decimais"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "outubro de 2025, face a setembro de 2025"
provisorio = false
mostra = "-0,38 %"

[[linha]]
id = "servicos_mensal_vs_ano_antes"
tipo = "derivado"
calculo = "servicos_mensal_out - servicos_mensal_out25"
valor = "0.27"
unidade = "pontos percentuais"
mede = "Variação mensal dos serviços em outubro de 2026 menos a de outubro de 2025: o mês que entra na taxa homóloga de outubro face ao que dela sai; os preços dos serviços desceram nos dois meses, menos em 2026"
periodo = "outubro de 2026 e outubro de 2025 (variações mensais)"
compara = "As duas taxas estão na mesma linha do mesmo quadro dos quadros do destaque: a mesma medida (taxa de variação mensal), o mesmo agregado e a mesma população (IPC, Portugal), no mesmo mês do calendário com um ano de intervalo. O destaque (p. 10) diz que a taxa homóloga não é afetada pelas oscilações sazonais perante um padrão estável de sazonalidade; estes números não mostram se o padrão de outubro foi o mesmo nos dois anos. Duas casas decimais, como nos quadros; a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "0,27 pontos percentuais"

[[linha]]
id = "contribuicoes_maiores"
tipo = "ato"
fonte = "ine_ipc_out2026"
onde = "p. 3, primeiro parágrafo (sobre a Figura 3)"
excerto = '''Em outubro, nas classes com maiores contribuições positivas para a variação homóloga do IPC (ver figura 3), destacam-se a dos Transportes (classe 7) e dos Restaurantes e serviços de alojamento (classe 11). Em sentido contrário, apenas se registou uma contribuição negativa, na classe do Vestuário e calçado (classe 3).'''
diz = "O INE destaca os Transportes (classe 7) e os Restaurantes e serviços de alojamento (classe 11) entre as classes com maiores contribuições positivas para a taxa de variação homóloga do IPC de outubro de 2026, isto é, para o nível dessa taxa e não para a sua variação face a setembro; e escreve que só o Vestuário e calçado (classe 3) teve contribuição negativa."
quem = ""
quando = "2026-11-11"

[[linha]]
id = "contribuicoes_variacao"
tipo = "ato"
fonte = "ine_ipc_out2026"
onde = "p. 3, segundo parágrafo (sobre a Figura 4)"
excerto = '''Comparando com o mês precedente, destaca-se o aumento da contribuição para a variação homóloga do IPC da classe do Lazer, recreação, desporto e cultura (classe 9), da Informação e comunicação (classe 8) e da Habitação, água, eletricidade, gás e outros combustíveis (classe 4). Em sentido contrário, destacam-se as classes do Vestuário e calçado (classe 3) e dos Serviços de higiene e cuidados pessoais, proteção social e bens e serviços diversos (classe 13).'''
diz = "Comparando com setembro de 2026, o INE destaca o aumento da contribuição para a variação homóloga do IPC das classes 9 (Lazer, recreação, desporto e cultura), 8 (Informação e comunicação) e 4 (Habitação, água, eletricidade, gás e outros combustíveis) e, em sentido contrário, as classes 3 (Vestuário e calçado) e 13 (Serviços de higiene e cuidados pessoais, proteção social e bens e serviços diversos). Não diz em quanto."
quem = ""
quando = "2026-11-11"

[[linha]]
id = "ipc_o_que_mede"
tipo = "ato"
fonte = "ine_ipc_out2026"
onde = "p. 10, Notas explicativas, primeiro parágrafo"
excerto = '''O índice de Preços no Consumidor (IPC) mede a evolução temporal dos preços de um conjunto de bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal. É importante ter presente que o IPC não é um indicador do nível de preços, mas antes um indicador da respetiva variação. A estrutura de ponderação do IPC é determinada a partir da componente de despesa monetária de consumo privado das Contas Nacionais e complementada pelos resultados do Inquérito às Despesas das Famílias (IDF) realizado em 2022/2023'''
diz = "O INE define o IPC como um indicador da variação dos preços de um cabaz representativo da despesa de consumo da população residente em Portugal, não do nível de preços, com ponderações tiradas da despesa monetária de consumo privado das Contas Nacionais, complementada pelo Inquérito às Despesas das Famílias de 2022/2023."
quem = ""
quando = "2026-11-11"

[[linha]]
id = "ihpc_homologa_out"
tipo = "valor"
fonte = "ine_ipc_out2026"
onde = "p. 6, primeiro parágrafo"
excerto = '''Em outubro de 2026, o IHPC português registou uma variação homóloga de 3,9%, 3,6% no mês anterior.'''
valor = "3.9"
unidade = "%"
mede = "Taxa de variação homóloga do Índice Harmonizado de Preços no Consumidor (IHPC) português, o índice utilizado na comparação entre os países da União Europeia (p. 6 e p. 11)"
populacao = "IHPC, Portugal: inclui na estrutura de ponderação a despesa realizada pelos não residentes, excluída do âmbito do IPC"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "3,9 %"

[[linha]]
id = "area_euro_out"
tipo = "valor"
fonte = "ine_ipc_out2026"
onde = "p. 7, Figura 7 (Variação homóloga nos países da área do Euro), linha da média"
excerto = '''Média da Área do Euro: 4,0%'''
valor = "4.0"
unidade = "%"
mede = "Taxa de variação homóloga do IHPC da área do euro (Média da Área do Euro, na Figura 7), estimativa do Eurostat divulgada a 4 de novembro de 2026 (p. 6, nota 2); o destaque dá o IHPC português 0,1 p.p. abaixo dela (p. 1 e p. 6)"
populacao = "IHPC, área do euro"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = true
mostra = "4,0 %"

[[linha]]
id = "ihpc_vs_area"
tipo = "derivado"
calculo = "ihpc_homologa_out - area_euro_out"
valor = "-0.1"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga do IHPC português menos a estimativa da área do euro: negativa quando a de Portugal é mais baixa"
periodo = "outubro de 2026, face a outubro de 2025"
compara = "As duas taxas são do mesmo índice harmonizado (IHPC), que o INE apresenta como o indicador mais apropriado para comparações entre países da União Europeia (p. 11), a mesma medida e o mesmo mês; a da área do euro é uma estimativa do Eurostat (p. 6, nota 2), e o destaque dá a mesma diferença (inferior em 0,1 p.p., p. 1 e p. 6)."
mostra = "-0,1 pontos percentuais"

[[linha]]
id = "area_euro_estimativa"
tipo = "ato"
fonte = "ine_ipc_out2026"
onde = "p. 6, notas 2 e 3"
excerto = '''Estimativa para a taxa de variação homóloga da área do Euro, divulgada a 4 de novembro de 2026. 3 Valor definitivo para a inflação da área Euro, divulgado a 18 de novembro de 2026.'''
diz = "O destaque indica que o valor da área do euro é a estimativa do Eurostat divulgada a 4 de novembro de 2026 e que o valor definitivo da inflação da área do euro é divulgado a 18 de novembro de 2026."
quem = ""
quando = "2026-11-04"

[[linha]]
id = "ihpc_nao_residentes"
tipo = "ato"
fonte = "ine_ipc_out2026"
onde = "p. 6, primeiro parágrafo"
excerto = '''Refira-se que o IHPC, que é utilizado na comparação entre os diversos países da União Europeia, diferencia-se do IPC devido à inclusão, na estrutura de ponderação do IHPC, da despesa realizada pelos não residentes, parcela esta excluída do âmbito do IPC.'''
diz = "O INE explica que o IHPC, usado na comparação entre países da União Europeia, se distingue do IPC por incluir na sua estrutura de ponderação a despesa dos não residentes, que o IPC exclui."
quem = ""
quando = "2026-11-11"

[[linha]]
id = "estimativa_rapida"
tipo = "ato"
fonte = "ine_ipc_out2026"
onde = "p. 2, primeiro parágrafo"
excerto = '''Com arredondamento a uma casa decimal, esta taxa coincide com o valor da estimativa rápida divulgada a 30 de outubro (mais informações sobre valores estimados e definitivos são apresentadas nos Quadros 3 e 4 no final deste destaque).'''
diz = "O INE indica que a taxa de variação homóloga de outubro de 2026 que agora publica coincide, com arredondamento a uma casa decimal, com a da estimativa rápida divulgada a 30 de outubro de 2026."
quem = ""
quando = "2026-10-30"

[[linha]]
id = "proximas_datas"
tipo = "ato"
fonte = "ine_ipc_out2026"
onde = "p. 12, junto aos Quadros 3 e 4"
excerto = '''Data da próxima estimativa rápida – 30 de novembro de 2026 Data do próximo destaque – 14 de dezembro de 2026'''
diz = "O INE anuncia a próxima estimativa rápida do IPC para 30 de novembro de 2026 e o próximo destaque para 14 de dezembro de 2026."
quem = ""
quando = "2026-11-11"

[[linha]]
id = "ihpc_subjacente_out"
tipo = "valor"
fonte = "ine_ipc_out2026"
onde = "p. 1, quarto parágrafo"
excerto = '''Excluindo produtos alimentares não transformados e energéticos, o IHPC em Portugal atingiu uma variação homóloga de 2,9% em outubro (2,7% em setembro), taxa superior à da área do Euro (estimada em 2,2%).'''
valor = "2.9"
unidade = "%"
mede = "Taxa de variação homóloga do IHPC português excluindo produtos alimentares não transformados e energéticos"
populacao = "IHPC, Portugal: inclui na estrutura de ponderação a despesa realizada pelos não residentes, excluída do âmbito do IPC"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = false
mostra = "2,9 %"

[[linha]]
id = "area_euro_subjacente_out"
tipo = "valor"
fonte = "ine_ipc_out2026"
onde = "p. 1, quarto parágrafo"
excerto = '''Excluindo produtos alimentares não transformados e energéticos, o IHPC em Portugal atingiu uma variação homóloga de 2,9% em outubro (2,7% em setembro), taxa superior à da área do Euro (estimada em 2,2%).'''
valor = "2.2"
unidade = "%"
mede = "Taxa de variação homóloga do IHPC da área do euro excluindo produtos alimentares não transformados e energéticos, estimada (o destaque escreve estimada em 2,2%)"
populacao = "IHPC, área do euro"
periodo = "outubro de 2026, face a outubro de 2025"
provisorio = true
mostra = "2,2 %"

[[linha]]
id = "sem_energia_jan"
tipo = "valor"
fonte = "ine_ipc_out2026_quadros"
onde = "Quadros do destaque, folha TII-PT (quadro II, taxas de variação homóloga, no original «Annual rates (%)»), linha «Total excluding energy», coluna de janeiro de 2026, o primeiro número a seguir a 2026"
excerto = '''Total excluding energy 2025 2.55 2.44 1.99 2.28 2.46 2.68 2.93 3 2.58 2.64 2.45 2.55 2026 2.26 2.46 2.53 2.81 2.62 2.83 2.68 2.72 2.84 2.91'''
valor = "2.26"
unidade = "%"
mede = "Taxa de variação homóloga do IPC total excluindo os produtos energéticos (no original, «Total excluding energy»), com duas casas decimais"
populacao = "IPC, Portugal: bens e serviços representativos da estrutura de despesa de consumo da população residente em Portugal"
periodo = "janeiro de 2026, face a janeiro de 2025"
provisorio = false
mostra = "2,26 %"

[[linha]]
id = "sem_energia_out_vs_jan"
tipo = "derivado"
calculo = "sem_energia_out - sem_energia_jan"
valor = "0.65"
unidade = "pontos percentuais"
mede = "Taxa de variação homóloga do IPC total excluindo os produtos energéticos em outubro de 2026 menos a de janeiro de 2026"
periodo = "janeiro e outubro de 2026 (taxas homólogas)"
compara = "As duas taxas estão na mesma linha do mesmo quadro dos quadros do destaque: a mesma medida (taxa de variação homóloga), o mesmo agregado e a mesma população, e a mesma estrutura de ponderação de 2026. Cada taxa compara o seu mês com o mesmo mês de 2025, pelo que a diferença mostra quanto a taxa homóloga se moveu entre janeiro e outubro, não quanto subiram os preços nesse período. Duas casas decimais, como nos quadros; a diferença herda o arredondamento de ambas (até 0,01 pontos percentuais)."
mostra = "0,65 pontos percentuais"

+++ registo

[[passo]]
nome = "encomenda"
lugar = "direcao"
familia = "anthropic"
modelo = "claude-fable-5-2"
inicio = "2026-11-15T11:05:47Z"
fim = "2026-11-15T11:05:47Z"

[[passo]]
nome = "nota"
lugar = "especialista"
familia = "anthropic"
modelo = "claude-opus-5-5"
inicio = "2026-11-15T11:06:15Z"
fim = "2026-11-15T11:15:10Z"

[[passo]]
nome = "reportagem"
lugar = "reporter"
familia = "anthropic"
modelo = "claude-opus-5-5"
inicio = "2026-11-15T11:16:25Z"
fim = "2026-11-15T11:31:04Z"

[[leitura]]
lugar = "oposto"
familia = "openai"
modelo = "gpt-6-astra"
inicio = "2026-11-15T11:32:37Z"
fim = "2026-11-15T11:37:34Z"
impressao = "b362c09489a75622523cc0a857414847784d1e16b12c2f76f27aaccee1ea0890"
plantas_postas = 0
plantas_apanhadas = 0
achados = 12
adotados = 10
veredicto = "passa"

[[leitura]]
lugar = "especialista"
familia = "anthropic"
modelo = "claude-opus-5-5"
inicio = "2026-11-15T11:32:41Z"
fim = "2026-11-15T11:41:32Z"
impressao = "b362c09489a75622523cc0a857414847784d1e16b12c2f76f27aaccee1ea0890"
plantas_postas = 0
plantas_apanhadas = 0
achados = 18
adotados = 16
veredicto = "levanta"

[[passo]]
nome = "reportagem"
lugar = "reporter"
familia = "anthropic"
modelo = "claude-opus-5-5"
inicio = "2026-11-15T11:43:10Z"
fim = "2026-11-15T11:49:03Z"

[[leitura]]
lugar = "numeros"
familia = "openai"
modelo = "gpt-6-astra"
inicio = "2026-11-15T11:53:46Z"
fim = "2026-11-15T11:59:55Z"
impressao = "8f4b0e7588fa52afad4ae0cbfbe1169fc21d3d7cd08beea31980fd80dff1365b"
plantas_postas = 3
plantas_apanhadas = 3
achados = 6
adotados = 3
veredicto = "nao_passa"

[[passo]]
nome = "edicao"
lugar = "direcao"
familia = "anthropic"
modelo = "claude-fable-5-2"
inicio = "2026-11-15T12:01:37Z"
fim = "2026-11-15T12:01:37Z"

[[leitura]]
lugar = "numeros"
familia = "openai"
modelo = "gpt-6-astra"
inicio = "2026-11-15T12:07:19Z"
fim = "2026-11-15T12:11:41Z"
impressao = "aaada62656d02ad6163cd7883d8487459d379a14c5f69cb0e84943fdc2a7fdc9"
plantas_postas = 3
plantas_apanhadas = 3
achados = 0
adotados = 0
veredicto = "passa"

[[passo]]
nome = "escrita"
lugar = "redator"
familia = "anthropic"
modelo = "claude-opus-5-5"
inicio = "2026-11-15T12:12:29Z"
fim = "2026-11-15T12:29:46Z"

[[passo]]
nome = "edicao"
lugar = "direcao"
familia = "anthropic"
modelo = "claude-fable-5-2"
inicio = "2026-11-15T12:30:56Z"
fim = "2026-11-15T12:32:28Z"

[[leitura]]
lugar = "oposto"
familia = "openai"
modelo = "gpt-6-astra"
inicio = "2026-11-15T12:33:01Z"
fim = "2026-11-15T12:39:23Z"
impressao = "956f8d25ba7d7dfb2adce2e2c40634f3d9d8cf0c9dde0dafce89824eebd43342"
plantas_postas = 0
plantas_apanhadas = 0
achados = 3
adotados = 3
veredicto = "nao_passa"

[[leitura]]
lugar = "especialista"
familia = "anthropic"
modelo = "claude-opus-5-5"
inicio = "2026-11-15T12:33:03Z"
fim = "2026-11-15T12:43:21Z"
impressao = "956f8d25ba7d7dfb2adce2e2c40634f3d9d8cf0c9dde0dafce89824eebd43342"
plantas_postas = 0
plantas_apanhadas = 0
achados = 6
adotados = 6
veredicto = "levanta"

[[leitura]]
lugar = "leitor"
familia = "anthropic"
modelo = "claude-sonnet-5-5"
inicio = "2026-11-15T12:33:03Z"
fim = "2026-11-15T12:35:02Z"
impressao = "956f8d25ba7d7dfb2adce2e2c40634f3d9d8cf0c9dde0dafce89824eebd43342"
plantas_postas = 0
plantas_apanhadas = 0
achados = 14
adotados = 11
veredicto = "levanta"

[[leitura]]
lugar = "desenhador"
familia = "anthropic"
modelo = "claude-opus-5-5"
inicio = "2026-11-15T12:33:43Z"
fim = "2026-11-15T12:41:24Z"
impressao = "956f8d25ba7d7dfb2adce2e2c40634f3d9d8cf0c9dde0dafce89824eebd43342"
plantas_postas = 0
plantas_apanhadas = 0
achados = 9
adotados = 9
veredicto = "levanta"

[[passo]]
nome = "reportagem"
lugar = "reporter"
familia = "anthropic"
modelo = "claude-opus-5-5"
inicio = "2026-11-15T12:45:42Z"
fim = "2026-11-15T12:49:03Z"

[[passo]]
nome = "edicao"
lugar = "direcao"
familia = "anthropic"
modelo = "claude-fable-5-2"
inicio = "2026-11-15T12:49:42Z"
fim = "2026-11-15T12:49:42Z"

[[passo]]
nome = "edicao"
lugar = "direcao"
familia = "anthropic"
modelo = "claude-fable-5-2"
inicio = "2026-11-15T12:58:54Z"
fim = "2026-11-15T13:04:00Z"

[[leitura]]
lugar = "leitor"
familia = "anthropic"
modelo = "claude-sonnet-5-5"
inicio = "2026-11-15T12:55:23Z"
fim = "2026-11-15T12:58:07Z"
impressao = "0ea3c6492663b5fe8e05e2b7d9cc34cda5b427c3906e3e03be335587ae8e6f27"
plantas_postas = 0
plantas_apanhadas = 0
achados = 25
adotados = 22
veredicto = "levanta"

[[leitura]]
lugar = "numeros"
familia = "openai"
modelo = "gpt-6-astra"
inicio = "2026-11-15T13:03:44Z"
fim = "2026-11-15T13:12:03Z"
impressao = "223d6654c7539e51762f0882110ecec97b420d8917c9a44df65ae65a1b50cb6c"
plantas_postas = 3
plantas_apanhadas = 3
achados = 4
adotados = 2
veredicto = "nao_passa"

[[passo]]
nome = "edicao"
lugar = "direcao"
familia = "anthropic"
modelo = "claude-fable-5-2"
inicio = "2026-11-15T13:07:33Z"
fim = "2026-11-15T13:14:54Z"

[[leitura]]
lugar = "leitor"
familia = "anthropic"
modelo = "claude-sonnet-5-5"
inicio = "2026-11-15T13:05:24Z"
fim = "2026-11-15T13:09:28Z"
impressao = "16165979efb230e499b85a270afc40efc2b62b38b71a0af68d6f7aeca578249e"
plantas_postas = 0
plantas_apanhadas = 0
achados = 26
adotados = 23
veredicto = "levanta"

[[leitura]]
lugar = "leitor"
familia = "anthropic"
modelo = "claude-sonnet-5-5"
inicio = "2026-11-15T13:16:04Z"
fim = "2026-11-15T13:18:55Z"
impressao = "4308a731348fecef6517ace9f91d6fa6021c759dbb7b063b042415fd5e959ddc"
plantas_postas = 0
plantas_apanhadas = 0
achados = 20
adotados = 17
veredicto = "levanta"
