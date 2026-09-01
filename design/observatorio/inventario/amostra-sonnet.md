# Medição cega da amostra do inventário de fontes (01.09.2026)

Modelo: Claude Sonnet 5

## 0. Método

Para cada uma das oito linhas (E3, T3, P1, M2, S3, A1, D3, H4) abri o endereço de máquina e o endereço de leitura indicados na própria linha, com `curl` ou `python3` e o cabeçalho `User-Agent: OEstadoDoPais/medicao`, e comparei o que a fonte diz hoje com o que cada célula testável afirma. Não consultei o trabalho de quem escreveu a amostra, nem nenhum ficheiro do inventário além do brief e de `amostra-linhas.json`. Os pedidos ao INE foram feitos em série, nunca em paralelo, com pelo menos dois segundos de intervalo entre eles. Nunca recebi um código 429 do INE; recebi, várias vezes, tempo esgotado ao fim de 60 segundos ou ligação recusada, tratados com a mesma lógica prevista para o 429 (esperar e tentar mais uma vez).

O código usado está em anexo, no ficheiro `amostra-sonnet.py`, na mesma pasta. Correu duas vezes por completo: uma primeira versão, com `urllib` da biblioteca padrão do Python, falhou de forma sistemática por um problema de verificação de certificados TLS nesta máquina (ver secção 11); uma segunda versão, corrigida para usar `curl`, correu sem esse problema e confirmou, de forma independente e mecânica, quase todos os vereditos abaixo. As tabelas desta secção foram escritas por mim a partir da investigação direta (a mesma que o script reproduz); onde o script mecânico discordou de mim, investiguei a diferença antes de fechar o veredito, e explico as duas discrepâncias encontradas na secção 11.

Todas as horas abaixo são UTC. A tabela de cada linha cobre as dez células testáveis previstas no brief: publicador, definição, primeiro período da série, periodicidade, último período, data de publicação, nível geográfico mais fino, licença, excerto e valor mais recente.

## 1. Linha E3: Dívida pública (Eurostat, gov_10dd_edpt1)

Endereço de máquina aberto às 09:28:54 UTC, HTTP 200. Endereço de leitura (databrowser) aberto às 09:46, HTTP 200.

| Célula | O que a linha afirma | O que a fonte diz hoje | Veredito |
|---|---|---|---|
| Publicador | INE (notificação do PDE), como em E2 | O documento de metodologia do Eurostat (ESMS `gov_10dd_esms.htm`) descreve o mecanismo geral: os Estados-Membros reportam os dados do PDE duas vezes por ano, antes de 1 de abril e antes de 1 de outubro (Reg. 479/2009), mas não nomeia Portugal nem o INE especificamente. Uma pesquisa independente (não uma fonte primária lida por mim) indica que a notificação portuguesa é conjunta (INE, Banco de Portugal e Direção-Geral do Orçamento), com o Banco de Portugal a compilar especificamente a dívida bruta, que é o item desta linha (na_item=GD) | não testável daqui (a linha remete para E2, fora da amostra, e a nuance Banco de Portugal/dívida bruta não é confirmável nem refutável só com os endereços desta linha) |
| Definição | «The government debt is defined as the total consolidated gross debt at nominal (face) value at the end of the year in the following categories of government liabilities (as defined in ESA 2010): currency and deposits (AF.2), debt securities (AF.3) and loans (AF.4).» | Texto idêntico, verbatim, no ESMS do conjunto de dados (`gov_10dd_esms.htm`, secção de conceitos) | bate |
| Série desde | 1995 | Primeiro ano na série JSON devolvida pela API = 1995 | bate |
| Periodicidade | «Dados trimestrais, difusão semestral (abril e outubro)» | A dimensão `freq` da série vem marcada «A» = Annual (dado anual, não trimestral); a série tem um único ponto por ano. O ESMS, secção 9 «Frequency of dissemination», diz textualmente «Bi-annual», e a secção 8 confirma o reporte «before 1 April and before 1 October» | não bate (a parte «difusão semestral, abril e outubro» está correta; a parte «dados trimestrais» não está: os dados são anuais, não trimestrais) |
| Último período | 2025 | Último ano na série = 2025 | bate |
| Publicado em | 2026-04-22 | Campo `updated` da API = 2026-04-22T11:00:00+0200 | bate |
| Nível geográfico | não (sem nível abaixo de país) | Pedindo a série sem filtro de `geo`, saem 31 posições, todas país ou agregado (BE, BG, CZ, ..., EA19/EA20/EA21, EU27_2020); nenhuma começa por «PT» além do próprio «PT» | bate |
| Licença | «The copyright for the editorial content of this website, which is owned by the EU, is licensed under the Creative Commons Attribution 4.0 International licence.» / «Reuse of statistical data, metadata, publications, and other dissemination tools published on this website for commercial or non-commercial purposes is authorised provided the source is acknowledged.» | As duas frases aparecem verbatim em `ec.europa.eu/eurostat/web/main/help/copyright-notice` (a primeira tentativa, em `ec.europa.eu/info/legal-notice_en`, tinha só a primeira frase; a página certa é a do Eurostat) | bate |
| Excerto | «GD: Government consolidated gross debt» ; 2023: 96.9 ; 2024: 93.5 ; 2025: 89.7 | Valores devolvidos hoje pela API: 2023 = 96.9, 2024 = 93.5, 2025 = 89.7 | bate |
| Valor mais recente | 89,7% do PIB em 2025 | 2025 = 89.7 (unit=PC_GDP) | bate |

## 2. Linha T3: Ganho médio mensal (INE, indicador 0012656)

Endereço de máquina (Évora e Portugal) aberto às 09:17-09:18 UTC, HTTP 200 em ambos. Endereço de leitura (`minfo.jsp?var_cd=0012656`) aberto às 09:17, HTTP 200.

| Célula | O que a linha afirma | O que a fonte diz hoje | Veredito |
|---|---|---|---|
| Publicador | «Fonte: MTSSS/GEP, Quadros de pessoal» | Campo Fonte da página de metainformação: «MTSSS/GEP, Quadros de pessoal» | bate |
| Definição | GANHO: «Montante ilíquido em dinheiro e/ou géneros pago ao trabalhador com caráter regular (...) mas não efetuadas (férias, feriados e outras ausências pagas).» + nota «Os dados referem-se a trabalhadores por conta de outrem a tempo completo com remuneração completa.» | Texto idêntico nos Conceitos da metainformação; a nota está, também verbatim, no campo `Nota` da metainformação JSON | bate |
| Série desde | 2021 | `PrimeiroPeriodo` = 2021 | bate |
| Periodicidade | Anual | `Periodic` = Anual | bate |
| Último período | 2024 | `UltimoPeriodo` = 2024 | bate |
| Publicado em | 2026-03-27 | `DataUltimaAtualizacao` = 2026-03-27 | bate |
| Nível geográfico | sim, os 308 (1+3+9+26+308 categorias) | Dimensão «Localização geográfica»: níveis 1/3/9/26/308, exatamente | bate |
| Licença | CC BY Atribuição 4.0, texto padrão do INE | Texto idêntico em `ine.pt/xportal/xmain?xpid=INE&xpgid=ine_pufs_termos` | bate |
| Excerto | Portugal 2024: 1 576,0 € ; Évora 2024: 1 484,5 € | `ind_string`: PT = «1 576,0», Évora (1C40705) = «1 484,5» | bate |
| Valor mais recente | idem | idem | bate |

Linha totalmente confirmada, sem nenhuma célula por bater.

## 3. Linha P1: População residente (INE, indicador 0012918)

Endereço de máquina aberto às 09:18 UTC, HTTP 200. Endereço de leitura (via `xurl/indx/0012918/PT`, redireciona para a ficha do indicador) aberto às 09:47, HTTP 200.

| Célula | O que a linha afirma | O que a fonte diz hoje | Veredito |
|---|---|---|---|
| Publicador | INE, Estimativas anuais da população residente | Campo Fonte da metainformação: «INE, Estimativas anuais da população residente» | bate |
| Definição | POPULAÇÃO RESIDENTE: «Conjunto de pessoas que, independentemente de estarem presentes ou ausentes (...) por um período mínimo de um ano.» Fórmula: «Valor estimado» | Texto idêntico nos Conceitos; Fórmula = «Valor estimado» | bate |
| Série desde | 2021 | `PrimeiroPeriodo` = 2021 | bate |
| Periodicidade | Anual | `Periodic` = Anual | bate |
| Último período | 2025 | `UltimoPeriodo` = 2025 | bate |
| Publicado em | 2026-05-22 (DataUltimaAtualizacao) | `DataUltimaAtualizacao` = **2026-06-22** | **não bate** (a linha erra o mês: escreve maio, a fonte diz junho; a própria linha já se contradiz, porque cita a seguir o destaque a abrir em «22 de junho de 2026») |
| Publicado em (destaque) | destaque abre com «22 de junho de 2026 / ESTIMATIVAS DE POPULAÇÃO RESIDENTE – 2025» | O destaque do INE (`ine_destaques`, boui 770295679) tem por título «Estimativas de População Residente / População residente atinge 11,4 milhões - 2025» e a data «22 de junho de 2026»; o resumo diz: «Em 31 de dezembro de 2025, a população residente em Portugal foi estimada em 11 424 031 pessoas, o que corresponde a um aumento de 36 809 pessoas relativamente a 2024 (0,32%).» | bate (a data e o texto do resumo conferem; só a ordem título/data no papel difere da apresentação da linha, o que não muda o facto) |
| Nível geográfico | sim, os 308 (347 categorias: 1+3+9+26+308) | Dimensão geográfica: níveis 1/3/9/26/308 = 347 no total | bate |
| Licença | CC BY Atribuição 4.0 | Confirmado (mesmo texto do INE) | bate |
| Excerto | Portugal 2025: 11 424 031 ; Évora 2025: 58 567 ; idênticos nos indicadores 0012918 e 0012917 | `ind_string`: PT = «11 424 031», Évora = «58 567» em 0012918; exatamente os mesmos valores no indicador irmão 0012917 | bate |
| Valor mais recente | idem | idem | bate |

Um achado nesta linha: a data de publicação declarada (05-22) não bate com a data real (06-22).

## 4. Linha M2: População estrangeira com estatuto legal de residente (INE, indicador 0013220)

Endereço de máquina aberto às 09:24 UTC, HTTP 200. Endereço de leitura aberto às 09:48 UTC, HTTP 200 (a primeira tentativa não obteve resposta em 60 segundos; a segunda, 67 segundos depois, teve sucesso).

| Célula | O que a linha afirma | O que a fonte diz hoje | Veredito |
|---|---|---|---|
| Publicador | «Fonte: INE, População estrangeira com estatuto legal de residente» | Campo Fonte da metainformação: idêntico | bate |
| Publicador (detalhe: documento metodológico 443, entidade I000748) | Estudo estatístico do INE, doc. metodológico 443 | Não consta na metainformação (JSON nem página) consultada nesta linha; exigiria o catálogo de metodologia do INE, sem endereço nesta linha | não testável daqui |
| Definição | POPULAÇÃO ESTRANGEIRA COM ESTATUTO LEGAL DE RESIDENTE: «Conjunto de pessoas de nacionalidade não portuguesa com autorização ou cartão de residência (...) bem como os estrangeiros com situação irregular.» | Texto idêntico nos Conceitos da metainformação | bate |
| Série desde | 2021 | `PrimeiroPeriodo` = 2021 | bate |
| Periodicidade | Anual | `Periodic` = Anual | bate |
| Último período | 2023 | `UltimoPeriodo` = 2023 | bate |
| Publicado em | 2024-09-20 | `DataUltimaAtualizacao` = 2024-09-20 | bate |
| Nível geográfico | sim, os 308, para 2021 a 2023 | Dimensão geográfica com nível 5 = 308 | bate |
| Licença | CC BY Atribuição 4.0 | Confirmado | bate |
| Excerto | Portugal 2023: 1 044 238 ; Évora 2023: 3 684 | `ind_string`: PT = «1 044 238», Évora = «3 684» | bate |
| Valor mais recente | idem | idem | bate |

## 5. Linha S3: Pensionistas e valor médio das pensões (INE, indicadores 0014534 e 0014532)

Endereços de máquina abertos às 09:22 (pensionistas) e 09:25 (valor médio) UTC, HTTP 200 em ambos (a metainformação do 0014534 e do 0014532 falhou uma vez cada, ao fim de 60 segundos, antes de ter sucesso na repetição).

| Célula | O que a linha afirma | O que a fonte diz hoje | Veredito |
|---|---|---|---|
| Publicador | «Fonte Instituto de Informática» | Campo Fonte da metainformação (ambos os indicadores): «Instituto de Informática» | bate |
| Definição | PENSIONISTA: «Titular de uma prestação pecuniária por invalidez, velhice, doença profissional ou morte.» Fórmula do valor médio: «Valor das pensões da segurança social/ Pensionistas da segurança social». Observações: «A partir de janeiro de 2017, contabiliza-se (...) Os dados dizem respeito às pensões pagas pela Segurança Social.» | Os três textos são idênticos, verbatim, nas páginas de metainformação dos dois indicadores | bate |
| Série desde | 2017 em ambos | `PrimeiroPeriodo` = 2017 nos dois indicadores | bate |
| Periodicidade | Anual | `Periodic` = Anual nos dois | bate |
| Último período | 2025 | `UltimoPeriodo` = 2025 nos dois | bate |
| Publicado em | 28/08/2026 | `DataUltimaAtualizacao` = 2026-08-28 nos dois | bate |
| Nível geográfico | sim, os 308 (347 categorias) | Dimensão geográfica: níveis 1/3/9/26/308 = 347 | bate |
| Licença | [verify]; a página de termos (`ine_princ_termos`) devolve 200 com «O Servidor encontra-se em serviço de manutenção.» | Testei o mesmo endereço hoje: HTTP 200, corpo «O Servidor encontra-se em serviço de manutenção. Por favor, volte a tentar dentro de alguns minutos.»; confirma-se a indisponibilidade descrita (a licença em si consegui confirmá-la por outra via, na página `ine_pufs_termos`, mas essa é uma constatação minha adicional, não uma contradição do que a linha afirma) | bate |
| Excerto | pensionistas total «2 922 353»; valor médio total «8 066» | `ind_string`: pensionistas total = «2 922 353», valor médio total = «8 066» | bate |
| Valor mais recente | Pensionistas PT 2025: total 2 922 353; velhice 2 030 992; sobrevivência 724 023; invalidez 167 338. Valor médio: total 8 066; velhice 9 519; invalidez 7 043; sobrevivência 4 228 | Os oito valores devolvidos hoje pela API coincidem exatamente com os oito citados na linha | bate |

Linha totalmente confirmada.

## 6. Linha A1: Água não faturada (ERSAR, RASARP 2025)

Endereço de máquina (índice JSON) aberto às 09:28:56 UTC, HTTP 200. Os dois ficheiros .xlsx (AnexoX e AnexoVII) e o PDF do Volume 1, descarregados a partir dos endereços do próprio índice, também HTTP 200. Endereço de leitura aberto às 09:28:57 UTC, HTTP 200.

| Célula | O que a linha afirma | O que a fonte diz hoje | Veredito |
|---|---|---|---|
| Publicador | ERSAR, RASARP 2025, Volume 1 | Confirmado na capa do PDF | bate |
| Definição | «Pretende-se avaliar o nível de sustentabilidade da gestão do serviço em termos económico-financeiros (...) conceito a aplicar a entidades gestoras de sistemas em alta e em baixa.» | Texto idêntico, verbatim, na secção 4.1.8 do PDF do RASARP 2025 Volume 1 | bate |
| Série desde | edições anuais desde 2004 (RASARP 2004 a RASARP 2025); quadro de evolução 2020-2024 com aviso «Mudança de geração» | O índice JSON lista 69 itens, do mais recente «RASARP 2025» ao mais antigo «RASARP 2004»; os Quadros 50 e 51 do PDF (evolução 2020-2024 do indicador AA08) trazem exatamente o aviso «Mudança de geração» | bate |
| Periodicidade | anual | Confirmado pela estrutura do índice (uma edição por ano) | bate |
| Último período | ano de 2024, referenciado a 31 de dezembro | O PDF declara: «(...) no ano de 2024, referenciada a 31 de dezembro» | bate |
| Publicado em | 26 de fevereiro de 2026; ISBN 978-989-8360-49-6 | Ambos os dados constam, verbatim, na capa do PDF | bate |
| Nível geográfico | percentagem por entidade gestora (352 no ficheiro; 214 EG em baixa em 2024 com 93% de resposta; 10 EG em alta com 100%); avaliação por concelho no Anexo VII (278 concelhos distintos; nota sobre 284 no Quadro 304) | O ficheiro AnexoX tem 43 661 linhas de dados e 352 valores distintos na coluna Empresa; 214 linhas com o código AA08b (baixa) e 10 com AA08a (alta); o Anexo VII, folha «Panorama Nacional AA_BAIXA», tem 278 valores distintos na coluna Concelho; o PDF traz a nota «Em alguns municípios a prestação do serviço é repartida entre várias entidades gestoras, motivo pelo qual o número total de concelhos vertido no Quadro 304 é de 284 em vez de 278.» | bate |
| Licença | «O conteúdo integral deste sítio (...) são propriedade da ERSAR (...)» / «Os materiais que integram este sítio podem ser copiados ou distribuídos (...) Nota de direitos reservados a "© ERSAR AAAA. Todos os direitos Reservados."» | Texto idêntico, verbatim, em `ersar.pt/pt_avisos-legais.html` | bate |
| Excerto | «AA08b – Água não faturada 26,5%» (Quadro 49); «Água entrada no sistema 846 741 648 m3/ano»; «Água não faturada 224 028 933 m3/ano»; do ficheiro: linha «Águas da Batalha», indicador AA08b, «Água não faturada», valor 26, unidade %, fiabilidade *** | Todos os valores conferem exatamente com o PDF (Quadros 48 e 49) e com a linha da empresa «Águas da Batalha» no AnexoX (valor 26, unidade %, fiabilidade ***) | bate |
| Valor mais recente | 26,5% na baixa e 5,2% na alta, em 2024, Portugal continental; 224 028 933 m³/ano na baixa; 34 057 068 m³/ano na alta | Confirmado: Quadro 48 (alta) = 5,2% e 34 057 068 m³/ano; Quadro 49 (baixa) = 26,5% e 224 028 933 m³/ano | bate |

Linha totalmente confirmada: foi a mais extensamente verificada (PDF de 320 páginas e duas folhas de cálculo com dezenas de milhares de linhas) e não teve nenhum desvio.

## 7. Linha D3: Taxa bruta de pré-escolarização (INE 0012616 + Eurostat educ_uoe_enra21)

Endereço de máquina INE aberto às 09:27-09:28 UTC, HTTP 200. Endereço de máquina Eurostat aberto às 09:28:54 UTC, HTTP 200. Endereços de leitura de ambos, HTTP 200.

| Célula | O que a linha afirma | O que a fonte diz hoje | Veredito |
|---|---|---|---|
| Publicador (concelho, via INE) | «Fonte: Direção-Geral de Estatísticas e Educação e Ciência» | Campo Fonte da metainformação do INE: «Direção-Geral de Estatísticas da Educação e Ciência» | bate |
| Publicador (país/UE) | recolha conjunta UOE (UNESCO-UIS/OCDE/Eurostat) | Consistente com o domínio `educ_uoe_enra21` e com o ESMS; não fui mais longe a confirmar a autoria tripartida UOE em si | não testável daqui (afirmação genérica sobre a governação da recolha, não uma citação pontual na fonte consultada) |
| Definição (fórmula INE) | «(Crianças inscritas na educação pré-escolar/ População residente com idade entre 3 a 5 anos)*100» | Fórmula idêntica na metainformação do INE | bate |
| Definição (DGEEC) | «Designação: TAXA BRUTA DE ESCOLARIZAÇÃO. Definição: (...)» | Não consta na metainformação do INE consultada; não há endereço da DGEEC nesta linha | não testável daqui |
| Definição (Eurostat) | «Pupils from age 0, 3, 4 and 5 to the starting age of compulsory education at primary level (...) at the primary level.» | Texto idêntico, verbatim, no ESMS `educ_uoe_enr_esms.htm` | bate |
| Série desde | INE: 2014/2015. Eurostat: 2013 | `PrimeiroPeriodo` do INE = «2014 / 2015»; primeiro ano na série Eurostat = 2013 | bate |
| Periodicidade | Anual nos dois | `Periodic` do INE = Anual; dimensão `freq` do Eurostat = A (Annual) | bate |
| Último período | INE: 2024/2025. Eurostat: 2024 | `UltimoPeriodo` do INE = «2024 / 2025»; último ano Eurostat = 2024 | bate |
| Publicado em | INE: 2026-07-14. Eurostat: 2026-08-11T23:00:00+0200 | `DataUltimaAtualizacao` do INE = 2026-07-14; campo `updated` do Eurostat = 2026-08-11T23:00:00+0200 | bate |
| Nível geográfico | INE: sim, 308 municípios. Eurostat: não (38 posições sem filtro, só «PT» é português) | Dimensão geográfica do INE: nível 5 = 308; pedido ao Eurostat sem filtro `geo` para 2024 devolve 38 posições, com «PT» presente e sem nenhum código regional português | bate |
| Licença | INE: CC BY 4.0. Eurostat: «Reuse of statistical data (...) Decision of 12 December 2011.» DGEEC: [verify] | INE confirmado; Eurostat confirmado verbatim (mesma página de copyright-notice); DGEEC já vinha marcado [verify] pela própria linha | bate (INE e Eurostat); não testado (DGEEC, autoassinalado) |
| Excerto (INE) | PT 98,3; Continente 98,2; Évora 107,0 | `ind_string`: PT=«98,3», Continente(1)=«98,2», Évora=«107,0» | bate |
| Excerto (DGEEC) | tabela 1.1.6: Portugal 100,6; Continente 100,6 (2023/24) | Sem endereço DGEEC nesta linha | não testável daqui |
| Excerto (Eurostat) | label citado; PT 2024: 94.5 (marca «d»); EU27_2020 2024: 94.9 (marca «d»); «d» = «definition differs (see metadata)» | `label` idêntico; PT 2024 = 94.5 com flag «d»; EU27_2020 2024 = 94.9 com flag «d»; a string «definition differs (see metadata)» está literalmente na resposta da API | bate |
| Valor mais recente | mesmo conjunto de valores do excerto | idem | bate (INE e Eurostat); não testável daqui (DGEEC) |

## 8. Linha H4: Médicas/os por 1000 habitantes (INE, indicador 0012837)

Endereço de máquina aberto às 09:13 UTC, HTTP 200. Endereço de leitura aberto às 09:15 UTC (via redirecionamento `xurl/metax`), HTTP 200.

| Célula | O que a linha afirma | O que a fonte diz hoje | Veredito |
|---|---|---|---|
| Publicador | «Fonte: INE, Estatísticas do pessoal de saúde»; a Ordem dos Médicos como fornecedora do ficheiro de inscritos fica [verify] | Campo Fonte da metainformação: «INE, Estatísticas do pessoal de saúde»; a metainformação de facto não nomeia hoje a Ordem dos Médicos como fornecedora do ficheiro, só a cita como entidade licenciadora na definição; consistente com o [verify] da própria linha | bate |
| Definição | «Pessoa com pelo menos um diploma básico de medicina (...) Fonte: Estatuto da Ordem dos Médicos, arts. 1.º e 8.º» Fórmula: «(Número total de médicas/os inscritos no final do ano/ População residente estimada para o final do ano)*1000» | Ambos os textos idênticos, verbatim, na metainformação | bate |
| Série desde | 2021 (série de cinco anos) | `PrimeiroPeriodo` = 2021; `UltimoPeriodo` = 2025 (2021-2025 = cinco anos) | bate |
| Periodicidade | Anual | `Periodic` = Anual | bate |
| Último período | 2025 | `UltimoPeriodo` = 2025 | bate |
| Publicado em | 2026-07-28 | `DataUltimaAtualizacao` = 2026-07-28 | bate |
| Nível geográfico | sim, os 308 (1+3+9+26+308) | Dimensão geográfica: níveis 1/3/9/26/308 | bate |
| Licença | CC BY Atribuição 4.0 | Confirmado | bate |
| Excerto | PT «5,7»; Évora «8,3» | `ind_string`: PT = «5,7», Évora (1C40705) = «8,3» | bate |
| Valor mais recente | Portugal 5,7; **Évora 8,8** | `ind_string` de Évora hoje = **«8,3»**, não «8,8» | **não bate** (Portugal confere; Évora não confere: a própria linha já cita «8,3» no excerto, duas linhas acima, e depois escreve «8,8» no valor mais recente) |

## 9. Células que não batem

1. **E3 / periodicidade**: a linha afirma «Dados trimestrais, difusão semestral (abril e outubro)»; a fonte (Eurostat, `gov_10dd_edpt1`) tem frequência `A` = Annual (dados anuais, não trimestrais); só a parte da difusão semestral (abril/outubro) está correta.
2. **P1 / publicado em**: a linha afirma que a `DataUltimaAtualizacao` é 2026-05-22; a fonte (INE, metainformação do indicador 0012918) diz 2026-06-22.
3. **H4 / valor mais recente**: a linha afirma que o valor de Évora em 2025 é 8,8; a fonte (INE, indicador 0012837) diz 8,3, o mesmo valor que a própria linha já tinha citado no excerto.

Nenhuma outra célula, entre as testáveis das oito linhas, deixou de bater. O script `amostra-sonnet.py` (segunda versão, com `curl`) assinalou mais duas células como não batendo, mas ao investigar diretamente confirmei que são falsos positivos do próprio script, não erros de conteúdo; ver secção 11.

## 10. Células não testáveis daqui

- E3 / publicador (a linha remete para a linha E2, fora desta amostra).
- M2 / publicador, no detalhe do documento metodológico 443 e da entidade I000748 (não consta nas páginas de metainformação consultadas).
- D3 / publicador, na parte sobre a governação tripartida UOE (afirmação genérica, não uma citação pontual verificável nos endereços desta linha).
- D3 / definição, excerto e valor mais recente, na parte atribuída à DGEEC (tabela 1.1.6, Portugal 100,6%, Continente 100,6%); a linha não dá nenhum endereço da DGEEC.
- D3 / licença, na parte da DGEEC: a própria linha já a marca como [verify].

## 11. Pedidos que falharam

Nenhum pedido ao INE, ao Eurostat ou à ERSAR devolveu HTTP 429 hoje, nem na investigação interativa nem nas duas corridas do script. O padrão de falha observado foi outro: tempo esgotado ao fim de 60 segundos, ou ligação recusada, sempre e só contra o INE, sempre recuperado numa segunda tentativa. Na investigação interativa isto aconteceu cinco vezes:

- `minfo.jsp?var_cd=0013220` (M2): sem resposta ao fim de 60 s; sucesso 71 s depois de repetir.
- `pindica.jsp` do indicador 0013220 (M2, dados): sem resposta ao fim de 60 s; sucesso imediato ao repetir.
- `pindicaMeta.jsp?varcd=0014534` (S3, pensionistas): sem resposta ao fim de 60 s; sucesso imediato ao repetir.
- `xportal/xmain?...xpgid=ine_pufs_termos` (página de licença do INE): ligação recusada; sucesso ao repetir 30 segundos depois.
- `xurl/indx/0013220/PT` (M2, endereço de leitura): sem resposta ao fim de 60 s; sucesso 67 s depois de repetir.

Na corrida final e completa do script (a versão com `curl`, 12,2 minutos, ver abaixo), o mesmo padrão repetiu-se mais nove vezes, sempre contra endereços do INE (indicadores 0012656, 0012918, 0012917, 0013220, 0014534, 0014532, 0012837), sempre recuperado na única repetição prevista. Em nenhum destes catorze casos, ao todo, foi preciso mais do que uma repetição.

Dois achados adicionais, sobre a própria ferramenta e não sobre as fontes:

Primeiro, a primeira versão do script (`amostra-sonnet.py`, com `urllib` da biblioteca padrão do Python) falhou a validação do certificado TLS em praticamente todos os pedidos aos três sítios (INE, Eurostat, ERSAR) nesta máquina: «self-signed certificate in certificate chain» para o INE e «unable to get local issuer certificate» para o Eurostat e a ERSAR. O `curl` desta mesma máquina, usado em toda a investigação interativa e na segunda versão do script, nunca falhou por esta razão. A causa provável é o ficheiro de certificados por omissão desta instalação do Python (`/Library/Frameworks/Python.framework/.../etc/openssl/cert.pem`), diferente do chaveiro do sistema que o `curl` usa. Reescrevi o script para usar `curl` via subprocesso, o que resolveu o problema por completo.

Segundo, a corrida final do script (com `curl`) assinalou duas células como não batendo que, ao investigar, se confirmaram como bem batidas: a definição de PENSIONISTA na linha S3 (o script comparava com dois espaços depois dos dois pontos, onde a fonte, já normalizada, tem um só) e a licença do Eurostat na linha D3 (a conversão de HTML para texto simples introduz um espaço a mais antes do ponto final, «2011 .» em vez de «2011.», que o script não previa). Corrigi as duas comparações no ficheiro `amostra-sonnet.py` e confirmei em separado, com um pedido novo a cada uma das duas páginas, que ambas batem depois da correção. Isto não muda nenhum dos três achados da secção 9: são artefactos de comparação de texto no meu próprio código, não erros nas linhas da amostra.

## 12. Tempo gasto

A investigação interativa que produziu os vereditos das tabelas acima (pedidos a cada fonte, leitura de páginas e da definição, do PDF de 320 páginas e das duas folhas de cálculo com dezenas de milhares de linhas da ERSAR) ocupou cerca de 50 minutos, a maior parte deles pedidos ao INE em série com o intervalo mínimo de dois segundos, mais várias esperas de 30 a 90 segundos por falhas de rede. Nenhuma linha, isoladamente, excedeu os oito minutos de trabalho efetivo de verificação previstos no brief. A escrita do script `amostra-sonnet.py`, a sua correção depois do problema de TLS, as duas corridas completas (a primeira, falhada, em menos de dois minutos; a segunda, completa, em 12,2 minutos, sobretudo à espera do INE) e a redação e revisão deste relatório ocuparam mais cerca de 25 minutos. Ao todo, entre o início da leitura do brief e o fecho deste relatório, passou pouco mais de uma hora.

## Anexo: código

O código usado está no ficheiro `amostra-sonnet.py`, na mesma pasta deste relatório. Esse script, quando corrido, refaz os mesmos pedidos e escreve um relatório mecânico equivalente (mais telegráfico, em formato de tabela simples, sem prosa); o texto acima foi escrito por mim a partir da mesma investigação, para ficar em prosa legível, e revisto contra a corrida final do script.
