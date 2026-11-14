# Folha de correções ZER0, decidida (14.11.2026)

> **Decidida a 14.11.2026 pelo lugar de direção (Claude Fable 5.2).** A folha montada pelo Opus (`FOLHA-zer0.md`, na mesma pasta, com todos os lugares e todas as provas) fica como anexo; aqui está só o que se decidiu, com a frase de hoje, a frase nova e a prova de cada uma. Sete itens: seis da folha montada (Z1 a Z6) e um sétimo (Z7) que saiu da verificação das linhas só com recibo. Nada disto está construído.
>
> **Julgada a 14.11.2026 pelo Codex `gpt-6-astra` a `xhigh`** (13:47:27 a 13:58:51 UTC), contra as cópias das fontes, com cinco estragos plantados numa cópia desta folha: apanhou os cinco (o papel «final» no nome inglês das verbas pagas; o ano 2012 no excerto do empréstimo; a página 139 dos anexos; 4323 votos no objeto da CDU; «em alta» no rótulo da água). Refez com `openpyxl` as contagens e as somas do ficheiro do PRR (2 311 registos, 23 pares, 167 372 755,84 e 86 944 668,69 euros), a soma do mapa dos empréstimos (72 793 341,20 com o valor novo; 72 793 340,20 com o antigo) e a divisão da água (26,5 %). Os reparos que entraram aqui: «em registos de» em vez de «nas linhas de» (Z2: o juiz achou «nas linhas de» opaco e propôs nomear a coluna; este lugar não põe o nome de um campo de dados numa frase do leitor e ficou com «registos», a palavra do juiz); as duas páginas dos anexos na razão da correção (Z3); as descrições das duas linhas do PRR com nome de entidade, que diziam «contratou no concelho» (Z5); a tradução «Retail service» que a própria ERSAR dá (Z6); a razão do Z7 dita como decisão editorial. **Um reparo que não entrou:** o juiz quer «padrões de poder de compra (PPS)» em vez de «paridades de poder de compra» na primeira frase do Z1; a mesma palavra está em cinco cadeias do sítio para este índice, e a forma portuguesa oficial da unidade não está alojada; fica aberta como questão do bloco (ZER0-1), para se fechar por régua nas cinco quando a fonte portuguesa estiver guardada.

As provas citam-se pelo ficheiro em `fontes/` e pelo lugar. Os PDF leem-se com `pdftotext -layout -f N -l N ficheiro -`; a página indicada é o índice do PDF, e diz-se a impressa quando difere.

---

## Z1 · A página das regiões diz que o índice do PIB mede o poder de compra das pessoas

**Decisão.** Apaga-se a segunda frase nas duas edições. A primeira fica como está. A palavra «paridades» da primeira frase fica para uma passagem própria, quando a forma portuguesa oficial da unidade estiver alojada.

**Hoje** (`src/i18n/strings.mjs`, campo `home.instr1.significadoV`; páginas `/regioes/` e `/en/regions/`):

- PT: «O índice compara o PIB per capita de cada território, medido em paridades de poder de compra, com a média da UE-27. Um valor abaixo da média significa menos poder de compra por pessoa; um valor acima, mais.»
- EN: «The index compares each territory’s GDP per capita, measured in purchasing power standards, with the EU-27 average. A value below the average means less purchasing power per person; a value above it, more.»

**Novo:**

- PT: «O índice compara o PIB per capita de cada território, medido em paridades de poder de compra, com a média da UE-27.»
- EN: «The index compares each territory’s GDP per capita, measured in purchasing power standards, with the EU-27 average.»

**Provas.**

1. `fontes/z1/eurostat-reg_eco10_esms.htm`, secção «3.4. Statistical concepts and definitions»: «The regional gross domestic product (GDP) is used in order to measure and compare the economic activity of regions.» Secção «3.1. Data description»: «Gross domestic product (GDP) at market prices is the final result of the production activity of resident producer units.»
2. `fontes/z1/eurostat-nama_10r_2gdp-2026-11-13.json`, `dimension.unit.category.label.PPS_HAB_EU27_2020`: «Purchasing power standard (PPS, EU27 from 2020), per inhabitant in percentage of the EU27 (from 2020) average».
3. Nenhuma das duas fontes diz que o índice mede o poder de compra das pessoas que vivem na região.

---

## Z2 · Cinco linhas do Plano de Recuperação e Resiliência de Évora dizem «com sede em Évora»

**Decisão.** Os nomes, as aritméticas e as descrições deixam de dizer «com sede em Évora» e passam a dizer só o que o ficheiro diz: são os registos de dois papéis a que a listagem de entidades dá «Évora» na sua coluna de localização. Os valores não mudam.

**O que se mediu** (`fontes/z2/z2-xlsx-leitura.txt`, `fontes/z2/z2-medicoes.txt`, `fontes/z2/prr-entidades-com-evora-na-coluna.txt`, sobre `fontes/z2/listagem-de-entidades-prr-20260819.xlsx`): o ficheiro tem dez colunas (`cd_entidade`, `dt_referencia`, `nif_entidade`, `ds_entidade`, `papel_entidade`, `atividade_economica`, `localizacao_sede`, `valor_contratado`, `valor_pago`, `cd_projeto`); uma linha é um par entidade e projeto, com um papel. As linhas com o papel «Beneficiário Intermediário» ou «Beneficiário Direto» e «Évora» na coluna `localizacao_sede` são 2 311, em 23 pares de entidade e papel; a soma de `valor_contratado` é 167372755.84 e a de `valor_pago` é 86944668.69. As entidades são organismos nacionais (o Fundo Ambiental aparece com 305 valores diferentes nessa coluna; o IEFP, com 302). O publicador não define a coluna em lado nenhum que se tenha achado (`fontes/z2/dadosgov-prr-entidades-api.json`: `description` «Informação respeitante às entidades do PRR», `schema` nulo).

**Nomes** (`src/data/nomes-das-medidas.mjs`):

| linha | Hoje | Novo |
|---|---|---|
| `evora-prr-aprovado-2026` PT | «Verbas do Plano de Recuperação e Resiliência (PRR) contratadas por beneficiários intermediários e diretos com sede em Évora» | «Verbas do Plano de Recuperação e Resiliência (PRR) contratadas em registos de beneficiários intermediários e diretos que a listagem de entidades do PRR localiza em Évora» |
| `evora-prr-aprovado-2026` EN | «Recovery and Resilience Plan (PRR) funds contracted by intermediate and direct beneficiaries headquartered in Évora» | «Recovery and Resilience Plan (PRR) funds contracted in records of intermediate and direct beneficiaries that the PRR list of entities places in Évora» |
| `evora-prr-pago-2026` PT | «Verbas do Plano de Recuperação e Resiliência (PRR) pagas a beneficiários intermediários e diretos com sede em Évora» | «Verbas do Plano de Recuperação e Resiliência (PRR) pagas em registos de beneficiários intermediários e diretos que a listagem de entidades do PRR localiza em Évora» |
| `evora-prr-pago-2026` EN | «Recovery and Resilience Plan (PRR) funds paid to intermediate and direct beneficiaries headquartered in Évora» | «Recovery and Resilience Plan (PRR) funds paid in records of intermediate and direct beneficiaries that the PRR list of entities places in Évora» |
| `evora-prr-vencido-aprovado-2026` PT | «Verbas contratadas por beneficiários intermediários e diretos com sede em Évora, em projetos com prazo de conclusão anterior à data do instantâneo e sem conclusão registada, no instantâneo de » + data | «Verbas contratadas em registos de beneficiários intermediários e diretos que a listagem de entidades do PRR localiza em Évora, em projetos com prazo de conclusão anterior à data do instantâneo e sem conclusão registada, no instantâneo de » + data |
| `evora-prr-vencido-aprovado-2026` EN | «Funds contracted by intermediate and direct beneficiaries headquartered in Évora, in projects with a completion deadline before the snapshot date and no completion recorded, in the snapshot of » + data | «Funds contracted in records of intermediate and direct beneficiaries that the PRR list of entities places in Évora, in projects with a completion deadline before the snapshot date and no completion recorded, in the snapshot of » + data |
| `evora-prr-execucao-2026` PT | «Parte das verbas contratadas por beneficiários intermediários e diretos com sede em Évora que já foi paga» | «Parte já paga das verbas contratadas em registos de beneficiários intermediários e diretos que a listagem de entidades do PRR localiza em Évora» |
| `evora-prr-execucao-2026` EN | «Share of funds contracted by intermediate and direct beneficiaries headquartered in Évora already paid» | «Share already paid of the funds contracted in records of intermediate and direct beneficiaries that the PRR list of entities places in Évora» |

O nome de `evora-prr-vencido-quota-2026` não diz «sede» e fica como está.

**Aritméticas** (nascem no motor, `publisher/manifest.evora.json`, e chegam ao sítio no campo `derivation` das duas linhas):

- `evora-prr-execucao-2026`, hoje PT: «As verbas pagas a beneficiários intermediários e diretos com sede em Évora, a dividir pelas verbas contratadas pelos mesmos beneficiários no mesmo instantâneo, vezes cem.» Novo PT: «As verbas pagas em registos de beneficiários intermediários e diretos que a listagem de entidades do PRR localiza em Évora, a dividir pelas verbas contratadas nos mesmos registos, no mesmo instantâneo, vezes cem.»
- Hoje EN: «Funds paid to intermediate and direct beneficiaries headquartered in Évora, divided by funds contracted by the same beneficiaries in the same snapshot, times one hundred.» Novo EN: «Funds paid in records of intermediate and direct beneficiaries that the PRR list of entities places in Évora, divided by the funds contracted in the same records, in the same snapshot, times one hundred.»
- `evora-prr-vencido-quota-2026`, hoje PT: «As verbas contratadas por beneficiários intermediários e diretos com sede em Évora em projetos com prazo de conclusão anterior ao instantâneo e sem conclusão registada, a dividir pelo total contratado pelos mesmos beneficiários no mesmo instantâneo, vezes cem.» Novo PT: «As verbas contratadas em registos de beneficiários intermediários e diretos que a listagem de entidades do PRR localiza em Évora, em projetos com prazo de conclusão anterior ao instantâneo e sem conclusão registada, a dividir pelo total contratado em todos esses registos, no mesmo instantâneo, vezes cem.»
- Hoje EN: «Funds contracted by intermediate and direct beneficiaries headquartered in Évora in projects with a completion deadline before the snapshot and no completion recorded, divided by the total contracted by the same beneficiaries in the same snapshot, times one hundred.» Novo EN: «Funds contracted in records of intermediate and direct beneficiaries that the PRR list of entities places in Évora, in projects with a completion deadline before the snapshot and no completion recorded, divided by the total contracted in all those records, in the same snapshot, times one hundred.»

**Descrições** (`src/data/o-que-e-das-familias.mjs`, cinco entradas, as das cinco linhas): em cada uma, «por beneficiários intermediários e diretos com sede no concelho» e «a beneficiários intermediários e diretos com sede no concelho» passam a «em registos de beneficiários intermediários e diretos que a listagem de entidades do plano localiza no concelho»; em inglês, «by intermediate and direct beneficiaries headquartered in the municipality» e «to intermediate and direct beneficiaries headquartered in the municipality» passam a «in records of intermediate and direct beneficiaries that the plan’s list of entities places in the municipality». O resto de cada frase fica.

---

## Z3 · Um euro no empréstimo do Programa de Apoio à Economia Local

**Decisão.** A linha `evora-pael-emprestimo` passa a 32 166 373,20 euros e cita a página 99 do mesmo Relatório de Gestão de 2016, que imprime esse valor; a correção fica datada no recibo, com a razão. Os Anexos ao Relatório de Gestão de 2016, onde está o mapa dos empréstimos, guardam-se no motor como fonte de apoio.

**Hoje.** Valor «32 166 372,20»; localizador «Relatorio_Gestão_2016.pdf, p. 84»; excerto «do total de empréstimo no montante de 32.166.372,20 €): Quadro 18 – Evolução da Dívida à AdCA/AdLVT Sistema Multimunicipal 31-12-2013 31-12-2014 31-12-2015 31-12-2016 Águas do Centro Alentejo, S.A. (AdCA)».

**Novo.**

- Valor: «32 166 373,20».
- Localizador: «Relatorio_Gestão_2016.pdf, p. 99».
- Excerto: «empréstimo PAEL, Programa de Apoio à Economia Local, contraído no ano 2013, no valor de 32.166.373,20 €»
- A descrição («… como o relatório de gestão o apresenta.») fica como está.
- A entrada de correção, com a data da aterragem e `kind: "correcao"`, valor antigo «32 166 372,20», valor novo «32 166 373,20», e a razão:
  - PT: «A página 84 do Relatório de Gestão de 2016, que a linha citava, imprime 32.166.372,20 €; a página 99 do mesmo relatório imprime 32.166.373,20 €, um euro acima, e é esse o capital contratado que o mapa dos empréstimos do município regista (Anexos ao Relatório de Gestão de 2016, página 193, a 68.ª do ficheiro). A linha passa a esse valor e cita a página 99.»
  - EN: «Page 84 of the 2016 Management Report, which the row cited, prints €32,166,372.20; page 99 of the same report prints €32,166,373.20, one euro more, and that is the contracted capital recorded in the municipality’s statement of loans (Annexes to the 2016 Management Report, page 193, the 68th of the file). The row now carries that figure and cites page 99.»

**Provas.**

1. `fontes/z3/cm-evora-Relatorio_Gestao_2016.pdf`, página 84 (impressa e do PDF): «AdCA (19.032.187,86 € (60%) do total de empréstimo no montante de 32.166.372,20 €):». Página 99 (impressa e do PDF): «empréstimo PAEL, Programa de Apoio à Economia Local, contraído no ano 2013, no valor de» e, na linha seguinte, «32.166.373,20 €, nem serviu para apoiar a economia local, visto que a maior parte se destinou».
2. `fontes/z3/cm-evora-Anexos_Demonstracoes_Financeiras_2016.pdf`, índice do PDF 68, página impressa 193, «3.6.1 – Empréstimos», linha «028 - IGTCP», colunas «Capital Contratado» e «Utilizado»: «32.166.373,20 32.166.373,20», com a observação «PAEL». O total da coluna, «72.793.341,20», só fecha com esse valor.
3. `fontes/z3/cm-evora-anexos_demonstracao_financeira_2015.pdf`, índice do PDF 65, página impressa 64, a mesma linha: «32.166.373,20 32.166.373,20».

---

## Z4 · «não financeiras» no nome das empresas dos concelhos

**Decisão.** Não muda nada no sítio. O rótulo «Empresas não financeiras» é o nome que o INE dá a este mesmo universo.

**Provas.**

1. `fontes/z4/ine-destaque-empresas-resultados-definitivos-2024.pdf` (INE, «EMPRESAS EM PORTUGAL – RESULTADOS DEFINITIVOS 2024», 11 de dezembro de 2025), índice do PDF 3, quadro dos principais indicadores: a linha «Total das empresas» com 1 593 415 e a linha «Empresas não financeiras» com 1 576 606 (a camada de texto separa as letras: «Empres a s nã o fi na ncei ra s»).
2. `fontes/z4/z4-soma-308.txt`: a soma dos valores das 308 linhas `*-empresas-2024` do livro do sítio (o indicador 0014063 do INE, um valor por concelho) dá 1 576 606.
3. `fontes/z4/ine-minfo-0014063.html`: a designação do indicador é «Empresas (N.º) por Localização geográfica (NUTS - 2024), Atividade económica (Divisão - CAE Rev. 3) e Forma jurídica; Anual - 0014063», sem «não financeiras»; por isso o nome vem do destaque e não do indicador.

---

## Z5 · Doze linhas com um excerto que não são palavras da fonte

**Decisão.** O excerto de cada uma das dez linhas eleitorais de Évora passa a ser o objeto da fonte que traz o valor, e o localizador ganha o caminho no ficheiro. Nas duas linhas do Plano de Recuperação e Resiliência com o nome de uma entidade (`evora-prr-municipio-contratado`, `evora-prr-universidade-contratado`), cujo excerto cita uma chave que o ficheiro não tem (`contratado_neste_concelho`), o excerto passa à forma das outras somas sobre o mesmo ficheiro: sem frase para transcrever, com o ficheiro, a coluna e o filtro declarados. Os valores não mudam.

| linha | valor | excerto de hoje | excerto novo | caminho |
|---|---|---|---|---|
| `evora-camara-mandatos-ps-2009` | 3 | «cm_lists entry list='PS': votes=10357, pct=39.48, mandates=3» | `{"absoluteMajority":0,"acronym":"PS","constituenctyCounter":1,"mandates":3,"percentage":39.48,"presidents":1,"votes":10357}` | `fontes/z5/sgmai-2009-LOCAL-070500-CM.json`, `$.currentResults.resultsParty[0]` |
| `evora-camara-mandatos-cdu-2013` | 4 | «cm_lists entry list='PCP - PEV': votes=11776, pct=49.3, mandates=4» | `{"absoluteMajority":1,"acronym":"PCP - PEV","constituenctyCounter":1,"mandates":4,"percentage":49.3,"presidents":1,"validVotesPercentage":52.53,"votes":11776}` | `fontes/z5/sgmai-2013-LOCAL-070500-CM.json`, `$.currentResults.resultsParty[0]` |
| `evora-camara-mandatos-cdu-2017` | 4 | «cm_lists entry list='PCP-PEV': votes=9414, pct=40.52, mandates=4» | `{"absoluteMajority":1,"acronym":"PCP-PEV","constituenctyCounter":1,"mandates":4,"percentage":40.52,"presidents":1,"validVotesPercentage":42.83,"votes":9414}` | `fontes/z5/sgmai-2017-LOCAL-070500-CM.json`, `$.currentResults.resultsParty[0]` |
| `evora-camara-mandatos-cdu-2021` | 2 | «cm_lists entry list='PCP-PEV': votes=6413, pct=27.44, mandates=2» | `{"absoluteMajority":0,"acronym":"PCP-PEV","constituenctyCounter":1,"imageKey":"","mandates":2,"percentage":27.44,"presidents":1,"validVotesPercentage":28.55,"votes":6413}` | `fontes/z5/sgmai-2021-LOCAL-070500-CM.json`, `$.currentResults.resultsParty[0]` |
| `evora-camara-mandatos-ps-2025` e `evora-executivo-2025-ps` | 3 | «cm_lists entry list='PS': votes=8169, pct=29.83, mandates=3» e «executive_2025.seats['PS'] = 3» | `{ "id": 1758, "typeId": 1, "acronym": "PS", "votes": 8169, "percentage": 29.83, "mandates": 3, "presidents": 1, "absoluteMajority": 0 }` | `fontes/z5/sgmai-2025-territory-1267-organ-4.json`, `$.data.currentResults.resultsParty[0]` |
| `evora-executivo-2025-ad` | 2 | «executive_2025.seats['PPD/PSD.CDS-PP.PPM (AD - ÉVORA TEM MAIS FUTURO)'] = 2» | `{ "id": 2037, "typeId": 2, "acronym": "PPD/PSD.CDS-PP.PPM", "votes": 8013, "percentage": 29.26, "mandates": 2, "presidents": 0, "absoluteMajority": 0 }` | idem, `resultsParty[1]` |
| `evora-executivo-2025-cdu` | 1 | «executive_2025.seats['PCP-PEV (CDU)'] = 1» | `{ "id": 1760, "typeId": 2, "acronym": "PCP-PEV", "votes": 4332, "percentage": 15.82, "mandates": 1, "presidents": 0, "absoluteMajority": 0 }` | idem, `resultsParty[2]` |
| `evora-executivo-2025-chega` | 1 | «executive_2025.seats['CH (CHEGA)'] = 1» | `{ "id": 1762, "typeId": 1, "acronym": "CH", "votes": 3816, "percentage": 13.94, "mandates": 1, "presidents": 0, "absoluteMajority": 0 }` | idem, `resultsParty[3]` |
| `evora-camara-lugares` | 7 | «total_mandates = 7» | `"totalMandates": 7` | idem, `$.data.currentResults.totalMandates` |

**As descrições das duas linhas do PRR com nome de entidade** (`src/data/o-que-e-das-familias.mjs`, `evora-prr-municipio-contratado` e `evora-prr-universidade-contratado`). Hoje PT: «É o valor que esta entidade contratou no concelho no Plano de Recuperação e Resiliência, pela listagem de entidades do plano.» Hoje EN: «It is the amount this entity contracted in the municipality under the Recovery and Resilience Plan, from the plan’s list of entities.» Novo PT: «É a soma dos valores contratados no Plano de Recuperação e Resiliência nos registos desta entidade como beneficiário final que a listagem de entidades do plano localiza no concelho.» Novo EN: «It is the sum of the amounts contracted under the Recovery and Resilience Plan in this entity’s final-beneficiary records that the plan’s list of entities places in the municipality.» (O juiz refez as duas somas: 20 registos e 12 069 012,60 euros para o Município; 74 registos e 38 596 975,81 euros para a Universidade.)

**As linhas do executivo de 2025.** A fonte prova os lugares que cada lista obteve na eleição da Câmara; a descrição do sítio diz «o executivo da câmara saído das eleições autárquicas», que é esse mesmo sentido, e fica.

No ficheiro de 2025 as quebras de linha e o recuo reduzem-se a um espaço; nos de 2009 a 2021 o excerto é uma subcadeia exata. Os fragmentos, com as quebras, estão em `fontes/z5/z5-fragmentos.txt`.

---

## Z6 · A água não faturada na página do Ambiente sem o seu âmbito

**Decisão.** O rótulo da linha `agua-nao-faturada-portugal-2024` passa a dizer o âmbito, nas palavras da ERSAR. O valor (26,5 %, 2024) não muda. O rótulo é também o título do recibo e a migalha, e muda nos três.

- Hoje PT: «Água não faturada». Novo PT: «Água não faturada no serviço em baixa, em Portugal continental».
- Hoje EN: «Unbilled water». Novo EN: «Unbilled water in the retail service, mainland Portugal».

**Provas.** `fontes/z6/rasarp2025-volume1-p106-107.txt` (ERSAR, RASARP 2025, volume 1; as páginas 106 e 107 do PDF `rasarp2025-volume1.pdf`, que são também as impressas): «4.1.8. AA08 – Água não faturada»; «O indicador é definido como a percentagem de água entrada no sistema que não é faturada (conceito a aplicar a entidades gestoras de sistemas em alta e em baixa).»; «Avaliação em Portugal continental»; «Quadro 49. AA08 baixa – Avaliação global (para 93 % de EG)»; «AA08b – Água não faturada 26,5 %». A ERSAR traduz «Baixa» por «Retail service» no próprio volume (página 49 do PDF, «Baixa / Retail service», lido pelo juiz na cópia viva do volume), e o recibo inglês da mesma linha já diz «retail operators in mainland Portugal».

---

## Z7 · Dezoito linhas que só têm o seu recibo saem da publicação

**Decisão.** Saem da publicação, pelo campo `publication: "withdrawn"` (ficam em disco e na validação; deixam de ter recibo, índice, descarga e contagem), as dezassete linhas `coragua-*` e a linha `saldo-natural-portugal-2025`. A linha `evora-populacao-2021` fica. Nenhuma frase nova.

As dezoito: `coragua-alqueva-alta-pressao-2026`, `coragua-alqueva-baixa-pressao-2026`, `coragua-dgadr-eficiencia-2024`, `coragua-ersar-encargo-mensal-2024`, `coragua-ersar-encargo-metro-cubico-2024`, `coragua-gulbenkian-inquerito-ano`, `coragua-gulbenkian-sem-contador`, `coragua-gulbenkian-universo-hectares`, `coragua-historico-eficiencia-83`, `coragua-historico-eficiencia-85`, `coragua-historico-eficiencia-95`, `coragua-historico-inquerito-2021`, `coragua-historico-racio-maximo`, `coragua-historico-racio-minimo`, `coragua-racio-maximo-2026`, `coragua-racio-minimo-2026`, `coragua-tc-auditoria-ano`, `saldo-natural-portugal-2025`.

**Porquê** (`fontes/z7/VEREDICTOS.md`, a verificação de 14.11.2026 por um agente que não escreveu as linhas). Retiram-se as dezoito por decisão editorial; nem todas têm um valor errado, e o juiz nota que duas (`coragua-gulbenkian-inquerito-ano` e `coragua-gulbenkian-universo-hectares`) podiam ficar como estão. Nenhuma página de conteúdo imprime estas linhas; as dezassete da água são restos de dois estudos retirados a 13.11.2026. Os dois rácios (19 e 35) dizem-se limites e não o são (outras tarifas do mesmo quadro do edital dão 12, 16 e 37) e juntam um encargo de 2024 a uma tarifa de 2026. O saldo natural de 2025 imprime −34 100 sem fonte, e o INE publica −34 053. Os seis recibos históricos dizem a proveniência completa e o endereço da fonte vai dar ao índice dos estudos. Nas outras, o valor confere, mas faltam qualificações da fonte (a tarifa do Alqueva em alta pressão é o «Valor médio» de quatro, e as duas são só a componente de exploração; a eficiência da DGADR é a média das 19 eficiências reportadas num anuário de 33 aproveitamentos, e o rótulo diz Portugal continental). `evora-populacao-2021` (55 711, INE, indicador 0012918) confere, sem reparo.
