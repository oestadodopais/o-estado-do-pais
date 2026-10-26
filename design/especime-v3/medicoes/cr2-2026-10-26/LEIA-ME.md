# CR2-h: correções preparadas, paragem nos nomes anteriores a 26.10

**Entrega bloqueada pelo §2 do mandato.** A mudança genérica para o nome do recibo altera seis entradas de 05.10.2026 em português e cinco em inglês. Não se acrescentou uma exceção por data nem se aprovou esse resultado. As alterações preparadas ficam conservadas para decisão do lugar de direção; esta passagem não está pronta para aterragem.

Cabeça de partida: `4f5c70459`. Cabeça de chegada da implementação: `968ab154b383035db803141a0b6b00451be20ebd`. O commit seguinte contém este relatório e as provas; a sua cabeça é comunicada na resposta final. Referência da comparação: `main` em `71420a8f4`.

## O que mudou e o que impediu a entrega

O mapa e o laço das onze observações irmãs saíram de `nomes-das-medidas.mjs`. Os seis recibos da União recuperaram o lugar no título, nas duas edições. «O que mudou» usa o nome do recibo quando a escada anterior devolve um rótulo da fonte, e marca a família que o fundamenta. As quinze entradas autorizadas têm o nome do respetivo recibo, mas a regra alcança também entradas antigas, contrariando a condição de conservação do mandato.

As quinze razões de atualização e as quinze razões de acesso foram reescritas nas duas línguas. O portão da voz tinha recusado «read at the source on», «the house» e «a casa». Os novos moldes usam «comparação semanal com a fonte» e «este projeto releu a fonte». Os valores e as datas vêm dos extratos do painel; o valor intermédio do caso B vem da linha 3 do extrato de 19.10. Os valores esperados no guião são guardas, não a origem do texto. O guião confirmou, para cada linha, que só `reason` e `reason_en` das duas entradas mudaram. O excerto e os restantes campos foram conservados.

As razões anteriores do CR2-g continuam no histórico e em `g/razoes.json`. O `dist/` do CR2-g foi reescrito por `g/sincronizar-marcas.mjs`; os seus códigos 1 de `build`, `check:voz` e `check:cartao` ficaram vermelhos, sem repetição nessa passagem. Os dois guiões de marcas receberam o aviso de desuso e não correram nesta passagem. Nenhum guião desta passagem remendou `dist/`: apenas os comandos reais `npm run build` o escreveram.

## Tabelas dos nomes exportados

| Tabela | Chaves medidas | Comparação com main |
|---|---:|---|
| `NOMES_DO_PROJETO` | 1069 | Igual, chave a chave e texto a texto |
| `NOMES_DAS_LINHAS_DERIVADAS` | 28 | Igual, chave a chave e texto a texto |

`h/conferir-nomes.mjs` lê `git show 71420a8f4:src/data/nomes-das-medidas.mjs`, importa essa versão num ficheiro temporário fora do repositório e compara os objetos. Prova em `h/tabelas-nomes.json`.

## Títulos dos recibos, edição pt

| Linha | H1 de main e desta construção, iguais |
|---|---|
| `custo-unitario-do-trabalho-2025-ue` | Custo do trabalho por unidade produzida na União Europeia (custo unitário do trabalho) |
| `divida-das-empresas-2025-ue` | Dívida das empresas (não financeiras) na União Europeia |
| `fluxo-de-credito-as-familias-2025-ue` | Fluxo de crédito às famílias na União Europeia |
| `formacao-bruta-de-capital-fixo-2025-ue` | Investimento em bens duradouros para produzir na União Europeia (formação bruta de capital fixo) |
| `licencas-de-construcao-2025-ue` | Área licenciada para habitação na União Europeia |
| `pib-real-per-capita-2025-ue` | PIB real por habitante na União Europeia |

## Títulos dos recibos, edição en

| Linha | H1 de main e desta construção, iguais |
|---|---|
| `custo-unitario-do-trabalho-2025-ue` | Labour cost per unit of output in the European Union (unit labour cost) |
| `divida-das-empresas-2025-ue` | Debt of (non-financial) companies in the European Union |
| `fluxo-de-credito-as-familias-2025-ue` | Credit flow to households in the European Union |
| `formacao-bruta-de-capital-fixo-2025-ue` | Investment in durable goods used for production in the European Union (gross fixed capital formation) |
| `licencas-de-construcao-2025-ue` | Floor area licensed for housing in the European Union |
| `pib-real-per-capita-2025-ue` | Real GDP per capita in the European Union |

## Os quinze nomes em «O que mudou»

| Linha | PT, igual ao recibo | EN, igual ao recibo |
|---|---|---|
| `custo-unitario-do-trabalho-2025-ue` | Custo do trabalho por unidade produzida na União Europeia (custo unitário do trabalho) | Labour cost per unit of output in the European Union (unit labour cost) |
| `divida-das-empresas-2024` | Dívida das empresas (não financeiras) | Debt of (non-financial) companies |
| `divida-das-empresas-2025` | Dívida das empresas (não financeiras) | Debt of (non-financial) companies |
| `divida-das-empresas-2025-ue` | Dívida das empresas (não financeiras) na União Europeia | Debt of (non-financial) companies in the European Union |
| `divida-das-familias-2024` | Dívida das famílias | Household debt |
| `divida-das-familias-2025` | Dívida das famílias | Household debt |
| `divida-publica-2024` | Dívida pública | Government debt |
| `fluxo-de-credito-as-empresas-2024` | Fluxo de crédito às empresas (não financeiras) | Credit flow to (non-financial) companies |
| `fluxo-de-credito-as-empresas-2025` | Fluxo de crédito às empresas (não financeiras) | Credit flow to (non-financial) companies |
| `fluxo-de-credito-as-familias-2024` | Fluxo de crédito às famílias | Credit flow to households |
| `fluxo-de-credito-as-familias-2025` | Fluxo de crédito às famílias | Credit flow to households |
| `fluxo-de-credito-as-familias-2025-ue` | Fluxo de crédito às famílias na União Europeia | Credit flow to households in the European Union |
| `formacao-bruta-de-capital-fixo-2025-ue` | Investimento em bens duradouros para produzir na União Europeia (formação bruta de capital fixo) | Investment in durable goods used for production in the European Union (gross fixed capital formation) |
| `licencas-de-construcao-2025-ue` | Área licenciada para habitação na União Europeia | Floor area licensed for housing in the European Union |
| `pib-real-per-capita-2025-ue` | PIB real por habitante na União Europeia | Real GDP per capita in the European Union |

Os quinze nomes portugueses são os nomes portugueses declarados do recibo, sem os rótulos ingleses da fonte. As seis linhas da União conservam o lugar nos nomes. As marcas de família foram conferidas contra o resolvedor. Provas em `h/recibos.json` e `h/mudancas.json`.

## Comparação das entradas antigas com main, motivo da paragem

A referência foi extraída com `git archive 71420a8f4` para uma pasta temporária fora do repositório e construída com `npm run build`, usando as dependências já instaladas. O HTML foi produzido por Astro. Essa construção de referência terminou com código 1 em `check:datas`, porque o arquivo temporário não tem `.git`: «fatal: not a git repository (or any of the parent directories): .git». Não se apresenta como construção aprovada. O HTML comparado vem dos ficheiros dessa referência, sem reconstruir nomes pelos resolvedores.

Em cada edição há 48 entradas anteriores a 26.10 nos dois HTML. As duas outras entradas de 26.10, `edicoes-publicadas` e `estudos-publicados`, mantêm os nomes de main. As quinze atualizações desta passagem são entradas novas perante main. As diferenças de nome nas entradas antigas são todas as seguintes:

| Edição | Linha, entrada de 05.10.2026 | Nome em main | Nome nesta construção |
|---|---|---|
| pt | `custo-unitario-do-trabalho-2024` | Nominal unit labour cost per hour worked | Custo do trabalho por unidade produzida (custo unitário do trabalho) |
| pt | `despesa-em-id-2024-ue` | Gross domestic expenditure on research and development (R&D) | Despesa em investigação e desenvolvimento na União Europeia |
| pt | `formacao-bruta-de-capital-fixo-2024` | Gross fixed capital formation at current prices | Investimento em bens duradouros para produzir (formação bruta de capital fixo) |
| pt | `pib-real-per-capita-2024` | Real GDP per capita | PIB real por habitante |
| pt | `posicao-de-investimento-internacional-2024` | Net international investment position - annual data | O que o país tem no exterior menos o que deve (posição de investimento internacional) |
| pt | `saldo-da-balanca-corrente-2024` | Current account balance - 3 year average | Saldo da balança corrente |
| en | `custo-unitario-do-trabalho-2024` | Nominal unit labour cost per hour worked | Labour cost per unit of output (unit labour cost) |
| en | `despesa-em-id-2024-ue` | Gross domestic expenditure on research and development (R&D) | Spending on research and development in the European Union |
| en | `formacao-bruta-de-capital-fixo-2024` | Gross fixed capital formation at current prices | Investment in durable goods used for production (gross fixed capital formation) |
| en | `posicao-de-investimento-internacional-2024` | Net international investment position - annual data | What the country owns abroad minus what it owes (net international investment position) |
| en | `saldo-da-balanca-corrente-2024` | Current account balance - 3 year average | Current account balance |

O nome inglês de `pib-real-per-capita-2024` continua «Real GDP per capita», pelo que essa entrada não aparece entre as cinco divergências inglesas. `h/historico-nomes.json` conserva a lista completa. A conferência termina deliberadamente com código 1 perante estas divergências. A recolha foi completada nas duas edições para documentar a paragem; não se alterou a regra de aceitação.

## Códigos reais e comandos não iniciados

| Comando | Código | Registo ou motivo |
|---|---|---|
| npm run build | 0 | `h/build-h.log` |
| npm run check:voz | Não executado isoladamente | Paragem do §2 antes de iniciar o comando |
| npm run check:cartao | Não executado isoladamente | Paragem do §2 antes de iniciar o comando |
| npm run ledger:check | Não executado isoladamente | Paragem do §2 antes de iniciar o comando |
| npm run check:registo | Não executado isoladamente | Paragem do §2 antes de iniciar o comando |
| npm run typecheck | 0 | `h/typecheck-h.log` |
| npm run check:cruzamento | Não executado isoladamente | Paragem do §2 antes de iniciar o comando |
| npm run check:palavras | Não executado isoladamente | Paragem do §2 antes de iniciar o comando |
| npm run check:rotulos | Não executado isoladamente | Paragem do §2 antes de iniciar o comando |
| Ensaio da ferramenta | 0 | `h/ferramenta-h.log` |
| Comparação das tabelas exportadas | 0 | `h/tabelas-nomes-h.log` |
| Comparação dos nomes no HTML | 1 | `h/nomes-html-h.log` |
| npm run build da referência main | 1 | `h/build-main-h.log` |

O `build` inclui conferências na sua própria cadeia; isso não se apresenta como execução isolada dos comandos da tabela. `RESEARCHHUB_DIR` apontou à worktree autorizada do motor. As duas construções já estavam em curso quando se encontrou a condição de paragem e terminaram para conservar os códigos reais. Não houve corrida inteira dos portões, capturas nem execução do gate do motor.

O primeiro ensaio de HTML falhou porque o seletor também apanhava a marca de uma data; o seletor passou a escolher só as entradas da lista. A segunda execução detetou a paragem em português. A recolha bilingue encontrou ainda duas entradas de 26.10 que já existiam em main, pelo que a seleção das quinze foi delimitada pelos identificadores autorizados e as outras duas comparadas à parte. Os quatro registos ficam em `h/`, incluindo os erros do guião, sem substituir códigos vermelhos por zeros.

## Ferramenta, inventário e limites

A planta de `published_at` volta a escolher outro dia quando o acesso coincide com o dia do carimbo. O ensaio lê e executa a função real da planta em ambos os casos, além das três recusas do ensaio anterior; código 0. A gralha «do do» foi corrigida.

No inventário dos rótulos mudaram apenas as réguas das quatro chaves nacionais de dívida das empresas e das famílias, em PT e EN: forma com provisório em Portugal a 0, forma sem essa nota a 1. Acrescentou-se `revisao_cr2h` com as quatro chaves e a razão pedida: «CR2-h, 26.10.2026: a nota de provisório do valor de Portugal de 2024 saiu com a revisão do Eurostat de 17.10.2026». A cabeça e as contagens gerais não foram alteradas. `check:rotulos` não foi iniciado devido à paragem.

Ficam para higiene os achados Minor 9 e Minor 13 do mandato: o lado «antes» das duas frases de 2024 reconstruído pelos resolvedores e a remoção da nota de provisório antes da comparação em `frases-cr2.mjs`; as vírgulas decimais na edição inglesa, I242. Continuam também as pendências históricas já declaradas: datas de próxima verificação ultrapassadas, duas releituras no mesmo dia sem distinção, sinal global dos 17 alarmes e releitura das séries por país pela UE1-c. Nenhuma escrita foi feita no motor.

## As quinze razões das atualizações, nas duas línguas

**`custo-unitario-do-trabalho-2025-ue` (caso C)**

PT: O Eurostat reviu o valor de 15,2 para 14,8 na atualização do conjunto de dados de 22.10.2026 (a versão anterior era de 16.10.2026). A comparação semanal com a fonte de 26.10.2026 encontrou a revisão e este projeto releu a fonte nesse dia; até aí publicava-se o valor da leitura anterior.

EN: Eurostat revised the value from 15.2 to 14.8 in the dataset update of 22.10.2026 (the previous version was of 16.10.2026). The weekly comparison with the source of 26.10.2026 found the revision and this project re-read the source that day; until then the value of the earlier reading was published.

**`divida-das-empresas-2024` (caso A)**

PT: O Eurostat reviu o valor de 67,1 para 66,6 na atualização do conjunto de dados de 17.10.2026 (a versão anterior era de 09.10.2026). A comparação semanal com a fonte de 19.10.2026 encontrou a revisão, a de 26.10.2026 leu o mesmo valor na versão de 24.10.2026, e este projeto releu a fonte a 26.10.2026; até aí publicava-se o valor da leitura anterior.

EN: Eurostat revised the value from 67.1 to 66.6 in the dataset update of 17.10.2026 (the previous version was of 09.10.2026). The weekly comparison with the source of 19.10.2026 found the revision, the one of 26.10.2026 read the same value in the version of 24.10.2026, and this project re-read the source on 26.10.2026; until then the value of the earlier reading was published.

**`divida-das-empresas-2025` (caso A)**

PT: O Eurostat reviu o valor de 64,9 para 65,1 na atualização do conjunto de dados de 17.10.2026 (a versão anterior era de 09.10.2026). A comparação semanal com a fonte de 19.10.2026 encontrou a revisão, a de 26.10.2026 leu o mesmo valor na versão de 24.10.2026, e este projeto releu a fonte a 26.10.2026; até aí publicava-se o valor da leitura anterior.

EN: Eurostat revised the value from 64.9 to 65.1 in the dataset update of 17.10.2026 (the previous version was of 09.10.2026). The weekly comparison with the source of 19.10.2026 found the revision, the one of 26.10.2026 read the same value in the version of 24.10.2026, and this project re-read the source on 26.10.2026; until then the value of the earlier reading was published.

**`divida-das-empresas-2025-ue` (caso B)**

PT: O Eurostat reviu o valor de 70,0 para 70,3 na atualização do conjunto de dados de 17.10.2026 (a versão anterior era de 09.10.2026) e outra vez para 70,2 na de 24.10.2026. A comparação semanal com a fonte de 19.10.2026 encontrou a primeira revisão e a de 26.10.2026 a segunda; este projeto releu a fonte a 26.10.2026 e até aí publicava 70,0.

EN: Eurostat revised the value from 70.0 to 70.3 in the dataset update of 17.10.2026 (the previous version was of 09.10.2026) and again to 70.2 in the one of 24.10.2026. The weekly comparison with the source of 19.10.2026 found the first revision and the one of 26.10.2026 the second; this project re-read the source on 26.10.2026 and until then published 70.0.

**`divida-das-familias-2024` (caso A)**

PT: O Eurostat reviu o valor de 52,6 para 52,3 na atualização do conjunto de dados de 17.10.2026 (a versão anterior era de 09.10.2026). A comparação semanal com a fonte de 19.10.2026 encontrou a revisão, a de 26.10.2026 leu o mesmo valor na versão de 24.10.2026, e este projeto releu a fonte a 26.10.2026; até aí publicava-se o valor da leitura anterior.

EN: Eurostat revised the value from 52.6 to 52.3 in the dataset update of 17.10.2026 (the previous version was of 09.10.2026). The weekly comparison with the source of 19.10.2026 found the revision, the one of 26.10.2026 read the same value in the version of 24.10.2026, and this project re-read the source on 26.10.2026; until then the value of the earlier reading was published.

**`divida-das-familias-2025` (caso A)**

PT: O Eurostat reviu o valor de 53,9 para 54,4 na atualização do conjunto de dados de 17.10.2026 (a versão anterior era de 09.10.2026). A comparação semanal com a fonte de 19.10.2026 encontrou a revisão, a de 26.10.2026 leu o mesmo valor na versão de 24.10.2026, e este projeto releu a fonte a 26.10.2026; até aí publicava-se o valor da leitura anterior.

EN: Eurostat revised the value from 53.9 to 54.4 in the dataset update of 17.10.2026 (the previous version was of 09.10.2026). The weekly comparison with the source of 19.10.2026 found the revision, the one of 26.10.2026 read the same value in the version of 24.10.2026, and this project re-read the source on 26.10.2026; until then the value of the earlier reading was published.

**`divida-publica-2024` (caso C)**

PT: O Eurostat reviu o valor de 93,5 para 93,0 na atualização do conjunto de dados de 21.10.2026 (a versão anterior era de 22.04.2026). A comparação semanal com a fonte de 26.10.2026 encontrou a revisão e este projeto releu a fonte nesse dia; até aí publicava-se o valor da leitura anterior.

EN: Eurostat revised the value from 93.5 to 93.0 in the dataset update of 21.10.2026 (the previous version was of 22.04.2026). The weekly comparison with the source of 26.10.2026 found the revision and this project re-read the source that day; until then the value of the earlier reading was published.

**`fluxo-de-credito-as-empresas-2024` (caso A)**

PT: O Eurostat reviu o valor de 2,4 para 2,2 na atualização do conjunto de dados de 17.10.2026 (a versão anterior era de 09.10.2026). A comparação semanal com a fonte de 19.10.2026 encontrou a revisão, a de 26.10.2026 leu o mesmo valor na versão de 24.10.2026, e este projeto releu a fonte a 26.10.2026; até aí publicava-se o valor da leitura anterior.

EN: Eurostat revised the value from 2.4 to 2.2 in the dataset update of 17.10.2026 (the previous version was of 09.10.2026). The weekly comparison with the source of 19.10.2026 found the revision, the one of 26.10.2026 read the same value in the version of 24.10.2026, and this project re-read the source on 26.10.2026; until then the value of the earlier reading was published.

**`fluxo-de-credito-as-empresas-2025` (caso A)**

PT: O Eurostat reviu o valor de 3,0 para 3,4 na atualização do conjunto de dados de 17.10.2026 (a versão anterior era de 09.10.2026). A comparação semanal com a fonte de 19.10.2026 encontrou a revisão, a de 26.10.2026 leu o mesmo valor na versão de 24.10.2026, e este projeto releu a fonte a 26.10.2026; até aí publicava-se o valor da leitura anterior.

EN: Eurostat revised the value from 3.0 to 3.4 in the dataset update of 17.10.2026 (the previous version was of 09.10.2026). The weekly comparison with the source of 19.10.2026 found the revision, the one of 26.10.2026 read the same value in the version of 24.10.2026, and this project re-read the source on 26.10.2026; until then the value of the earlier reading was published.

**`fluxo-de-credito-as-familias-2024` (caso A)**

PT: O Eurostat reviu o valor de 4,1 para 4,0 na atualização do conjunto de dados de 17.10.2026 (a versão anterior era de 09.10.2026). A comparação semanal com a fonte de 19.10.2026 encontrou a revisão, a de 26.10.2026 leu o mesmo valor na versão de 24.10.2026, e este projeto releu a fonte a 26.10.2026; até aí publicava-se o valor da leitura anterior.

EN: Eurostat revised the value from 4.1 to 4.0 in the dataset update of 17.10.2026 (the previous version was of 09.10.2026). The weekly comparison with the source of 19.10.2026 found the revision, the one of 26.10.2026 read the same value in the version of 24.10.2026, and this project re-read the source on 26.10.2026; until then the value of the earlier reading was published.

**`fluxo-de-credito-as-familias-2025` (caso A)**

PT: O Eurostat reviu o valor de 8,6 para 9,0 na atualização do conjunto de dados de 17.10.2026 (a versão anterior era de 09.10.2026). A comparação semanal com a fonte de 19.10.2026 encontrou a revisão, a de 26.10.2026 leu o mesmo valor na versão de 24.10.2026, e este projeto releu a fonte a 26.10.2026; até aí publicava-se o valor da leitura anterior.

EN: Eurostat revised the value from 8.6 to 9.0 in the dataset update of 17.10.2026 (the previous version was of 09.10.2026). The weekly comparison with the source of 19.10.2026 found the revision, the one of 26.10.2026 read the same value in the version of 24.10.2026, and this project re-read the source on 26.10.2026; until then the value of the earlier reading was published.

**`fluxo-de-credito-as-familias-2025-ue` (caso A)**

PT: O Eurostat reviu o valor de 2,9 para 3,0 na atualização do conjunto de dados de 17.10.2026 (a versão anterior era de 09.10.2026). A comparação semanal com a fonte de 19.10.2026 encontrou a revisão, a de 26.10.2026 leu o mesmo valor na versão de 24.10.2026, e este projeto releu a fonte a 26.10.2026; até aí publicava-se o valor da leitura anterior.

EN: Eurostat revised the value from 2.9 to 3.0 in the dataset update of 17.10.2026 (the previous version was of 09.10.2026). The weekly comparison with the source of 19.10.2026 found the revision, the one of 26.10.2026 read the same value in the version of 24.10.2026, and this project re-read the source on 26.10.2026; until then the value of the earlier reading was published.

**`formacao-bruta-de-capital-fixo-2025-ue` (caso C)**

PT: O Eurostat reviu o valor de 21,4 para 21,5 na atualização do conjunto de dados de 22.10.2026 (a versão anterior era de 15.10.2026). A comparação semanal com a fonte de 26.10.2026 encontrou a revisão e este projeto releu a fonte nesse dia; até aí publicava-se o valor da leitura anterior.

EN: Eurostat revised the value from 21.4 to 21.5 in the dataset update of 22.10.2026 (the previous version was of 15.10.2026). The weekly comparison with the source of 26.10.2026 found the revision and this project re-read the source that day; until then the value of the earlier reading was published.

**`licencas-de-construcao-2025-ue` (caso C)**

PT: O Eurostat reviu o valor de 377,5 para 377,6 na atualização do conjunto de dados de 21.10.2026 (a versão anterior era de 17.10.2026). A comparação semanal com a fonte de 26.10.2026 encontrou a revisão e este projeto releu a fonte nesse dia; até aí publicava-se o valor da leitura anterior.

EN: Eurostat revised the value from 377.5 to 377.6 in the dataset update of 21.10.2026 (the previous version was of 17.10.2026). The weekly comparison with the source of 26.10.2026 found the revision and this project re-read the source that day; until then the value of the earlier reading was published.

**`pib-real-per-capita-2025-ue` (caso C)**

PT: O Eurostat reviu o valor de 31 890 para 31 980 na atualização do conjunto de dados de 22.10.2026 (a versão anterior era de 15.10.2026). A comparação semanal com a fonte de 26.10.2026 encontrou a revisão e este projeto releu a fonte nesse dia; até aí publicava-se o valor da leitura anterior.

EN: Eurostat revised the value from 31 890 to 31 980 in the dataset update of 22.10.2026 (the previous version was of 15.10.2026). The weekly comparison with the source of 26.10.2026 found the revision and this project re-read the source that day; until then the value of the earlier reading was published.

### Exemplo da razão de proveniência

`custo-unitario-do-trabalho-2025-ue`, `access_date`:

PT: O valor novo foi lido a 26.10.2026, o dia em que este projeto releu a fonte; a leitura anterior, de 15.09.2026, é a do valor 15,2.

EN: The new value was read on 26.10.2026, the day this project re-read the source; the earlier reading, of 15.09.2026, is that of the value 15,2.

## Custo e conservação do trabalho

Medição própria em `h/custo.json`: 33 chamadas até à preparação do relatório, antes do segundo commit e da inspeção final. Duas construções iniciadas, uma da worktree e uma da referência temporária; duas conferências pedidas fora da construção (`typecheck` e ferramenta); uma comparação isolada das tabelas e quatro execuções do guião de HTML. Total de nove execuções com código guardado. A reescrita das razões executou ainda a sua conferência integral, sem código em ficheiro separado. Nenhuma corrida inteira, captura ou gate do motor. `tokens used`: não exposto.

Acrescentou-se `continuacao_cr2e` a `custo.json` com os números fornecidos pelo lançador: 2 turnos, 153 942 símbolos de entrada, 153 088 em cache, 604 de saída; semana de 5,0% a 5,0%, diferença 0,0 ponto. Medido pelo lançador, fora da passagem. O quadro histórico passa a incluir CR2-f e CR2-g com as medidas do mandato; os pontos desta passagem cabem ao lançador.

Na partida já existiam sete relatórios não versionados, `RELATORIO.md` e `RELATORIO-b.md` a `RELATORIO-g.md`. Foram preservados e excluídos dos commits. A inspeção final distingue esses ficheiros de trabalho desta passagem; não se declara uma worktree absolutamente limpa enquanto eles existirem.

---

## Histórico CR2-g, conservado

# CR2-g: datas das revisões, nomes da casa e notas de provisório

A CR2-f confundia o dia em que o painel viu a revisão com o dia da releitura pelo cliente da casa. Corrigiram-se por guião as razões das quinze atualizações de 26.10, a partir dos dois registos ALARM fornecidos pela direção. `date`, `kind`, `old_value` e `new_value` ficaram iguais; o guião confere também todos os outros campos, admitindo apenas as substituições pedidas nas razões de proveniência. A história selada passou sem alteração: quatro controlos e dezoito plantas.

## Datas e registos, linha a linha

Os carimbos seguintes são os que os registos escrevem no seu próprio fuso, apresentados na forma da casa. Nas nove linhas A, o guião confirmou que o valor novo de 19.10 é o valor novo de 26.10. Na linha B, o painel passou de 70,3 a 70,2 entre as duas leituras; o campo «valor antigo» do alarme de 26.10 continua a referir o valor publicado, 70,0, e não o último valor visto pelo painel.

| Linha | Caso | Registo de 19.10: carimbo anterior → novo | Registo de 26.10: carimbo anterior → novo |
|---|---|---|---|
| `custo-unitario-do-trabalho-2025-ue` | C | Ausente | 16.10.2026 → 22.10.2026 (`painel-2026-10-26.alarmes.txt:2`) |
| `divida-das-empresas-2024` | A | 09.10.2026 → 17.10.2026 (`painel-2026-10-19.alarmes.txt:2`) | 17.10.2026 → 24.10.2026 (`painel-2026-10-26.alarmes.txt:3`) |
| `divida-das-empresas-2025` | A | 09.10.2026 → 17.10.2026 (`painel-2026-10-19.alarmes.txt:4`) | 17.10.2026 → 24.10.2026 (`painel-2026-10-26.alarmes.txt:5`) |
| `divida-das-empresas-2025-ue` | B | 09.10.2026 → 17.10.2026 (`painel-2026-10-19.alarmes.txt:3`) | 17.10.2026 → 24.10.2026 (`painel-2026-10-26.alarmes.txt:4`) |
| `divida-das-familias-2024` | A | 09.10.2026 → 17.10.2026 (`painel-2026-10-19.alarmes.txt:5`) | 17.10.2026 → 24.10.2026 (`painel-2026-10-26.alarmes.txt:6`) |
| `divida-das-familias-2025` | A | 09.10.2026 → 17.10.2026 (`painel-2026-10-19.alarmes.txt:7`) | 17.10.2026 → 24.10.2026 (`painel-2026-10-26.alarmes.txt:7`) |
| `divida-publica-2024` | C | Ausente | 22.04.2026 → 21.10.2026 (`painel-2026-10-26.alarmes.txt:8`) |
| `fluxo-de-credito-as-empresas-2024` | A | 09.10.2026 → 17.10.2026 (`painel-2026-10-19.alarmes.txt:8`) | 17.10.2026 → 24.10.2026 (`painel-2026-10-26.alarmes.txt:11`) |
| `fluxo-de-credito-as-empresas-2025` | A | 09.10.2026 → 17.10.2026 (`painel-2026-10-19.alarmes.txt:9`) | 17.10.2026 → 24.10.2026 (`painel-2026-10-26.alarmes.txt:12`) |
| `fluxo-de-credito-as-familias-2024` | A | 09.10.2026 → 17.10.2026 (`painel-2026-10-19.alarmes.txt:10`) | 17.10.2026 → 24.10.2026 (`painel-2026-10-26.alarmes.txt:13`) |
| `fluxo-de-credito-as-familias-2025` | A | 09.10.2026 → 17.10.2026 (`painel-2026-10-19.alarmes.txt:12`) | 17.10.2026 → 24.10.2026 (`painel-2026-10-26.alarmes.txt:15`) |
| `fluxo-de-credito-as-familias-2025-ue` | A | 09.10.2026 → 17.10.2026 (`painel-2026-10-19.alarmes.txt:11`) | 17.10.2026 → 24.10.2026 (`painel-2026-10-26.alarmes.txt:14`) |
| `formacao-bruta-de-capital-fixo-2025-ue` | C | Ausente | 15.10.2026 → 22.10.2026 (`painel-2026-10-26.alarmes.txt:16`) |
| `licencas-de-construcao-2025-ue` | C | Ausente | 17.10.2026 → 21.10.2026 (`painel-2026-10-26.alarmes.txt:17`) |
| `pib-real-per-capita-2025-ue` | C | Ausente | 15.10.2026 → 22.10.2026 (`painel-2026-10-26.alarmes.txt:18`) |

## As quinze razões novas, nas duas línguas

Nota CR2-h: as razões desta secção foram substituídas na passagem CR2-h; conservam-se como registo do que a CR2-g escreveu.

**`custo-unitario-do-trabalho-2025-ue` (caso C)**

PT: O Eurostat reviu o valor de 15,2 para 14,8 na atualização do conjunto de 22.10.2026 (o carimbo passou de 16.10.2026 a 22.10.2026): a reconferência semanal de 26.10.2026 viu a revisão; a linha foi relida na fonte a 26.10.2026 (a resposta alojada com recibo); o sítio publicava o valor da leitura anterior.

EN: Eurostat revised the value from 15.2 to 14.8 in the dataset update of 22.10.2026 (the dataset stamp moved from 16.10.2026 to 22.10.2026): the weekly check of 26.10.2026 caught the revision; the row was re-read at the source on 26.10.2026 (the hosted response with its receipt); the site published the value of the earlier reading.

**`divida-das-empresas-2024` (caso A)**

PT: O Eurostat reviu o valor de 67,1 para 66,6 na atualização do conjunto de 17.10.2026 (o carimbo passou de 09.10.2026 a 17.10.2026): a reconferência semanal de 19.10.2026 viu a revisão, e a de 26.10.2026 leu o mesmo valor com o carimbo de 24.10.2026; a linha foi relida na fonte a 26.10.2026 (a resposta alojada com recibo); o sítio publicava o valor da leitura anterior.

EN: Eurostat revised the value from 67.1 to 66.6 in the dataset update of 17.10.2026 (the dataset stamp moved from 09.10.2026 to 17.10.2026): the weekly check of 19.10.2026 caught the revision, and the one of 26.10.2026 read the same value with the stamp of 24.10.2026; the row was re-read at the source on 26.10.2026 (the hosted response with its receipt); the site published the value of the earlier reading.

**`divida-das-empresas-2025` (caso A)**

PT: O Eurostat reviu o valor de 64,9 para 65,1 na atualização do conjunto de 17.10.2026 (o carimbo passou de 09.10.2026 a 17.10.2026): a reconferência semanal de 19.10.2026 viu a revisão, e a de 26.10.2026 leu o mesmo valor com o carimbo de 24.10.2026; a linha foi relida na fonte a 26.10.2026 (a resposta alojada com recibo); o sítio publicava o valor da leitura anterior.

EN: Eurostat revised the value from 64.9 to 65.1 in the dataset update of 17.10.2026 (the dataset stamp moved from 09.10.2026 to 17.10.2026): the weekly check of 19.10.2026 caught the revision, and the one of 26.10.2026 read the same value with the stamp of 24.10.2026; the row was re-read at the source on 26.10.2026 (the hosted response with its receipt); the site published the value of the earlier reading.

**`divida-das-empresas-2025-ue` (caso B)**

PT: O Eurostat reviu o valor de 70,0 para 70,3 na atualização do conjunto de 17.10.2026 (o carimbo passou de 09.10.2026 a 17.10.2026) e outra vez para 70,2 na de 24.10.2026: a reconferência semanal de 19.10.2026 viu a primeira revisão e a de 26.10.2026 a segunda; a linha foi relida na fonte a 26.10.2026 (a resposta alojada com recibo); o sítio publicava 70,0.

EN: Eurostat revised the value from 70.0 to 70.3 in the dataset update of 17.10.2026 (the dataset stamp moved from 09.10.2026 to 17.10.2026) and again to 70.2 in the one of 24.10.2026: the weekly check of 19.10.2026 caught the first revision and the one of 26.10.2026 the second; the row was re-read at the source on 26.10.2026 (the hosted response with its receipt); the site published 70.0.

**`divida-das-familias-2024` (caso A)**

PT: O Eurostat reviu o valor de 52,6 para 52,3 na atualização do conjunto de 17.10.2026 (o carimbo passou de 09.10.2026 a 17.10.2026): a reconferência semanal de 19.10.2026 viu a revisão, e a de 26.10.2026 leu o mesmo valor com o carimbo de 24.10.2026; a linha foi relida na fonte a 26.10.2026 (a resposta alojada com recibo); o sítio publicava o valor da leitura anterior.

EN: Eurostat revised the value from 52.6 to 52.3 in the dataset update of 17.10.2026 (the dataset stamp moved from 09.10.2026 to 17.10.2026): the weekly check of 19.10.2026 caught the revision, and the one of 26.10.2026 read the same value with the stamp of 24.10.2026; the row was re-read at the source on 26.10.2026 (the hosted response with its receipt); the site published the value of the earlier reading.

**`divida-das-familias-2025` (caso A)**

PT: O Eurostat reviu o valor de 53,9 para 54,4 na atualização do conjunto de 17.10.2026 (o carimbo passou de 09.10.2026 a 17.10.2026): a reconferência semanal de 19.10.2026 viu a revisão, e a de 26.10.2026 leu o mesmo valor com o carimbo de 24.10.2026; a linha foi relida na fonte a 26.10.2026 (a resposta alojada com recibo); o sítio publicava o valor da leitura anterior.

EN: Eurostat revised the value from 53.9 to 54.4 in the dataset update of 17.10.2026 (the dataset stamp moved from 09.10.2026 to 17.10.2026): the weekly check of 19.10.2026 caught the revision, and the one of 26.10.2026 read the same value with the stamp of 24.10.2026; the row was re-read at the source on 26.10.2026 (the hosted response with its receipt); the site published the value of the earlier reading.

**`divida-publica-2024` (caso C)**

PT: O Eurostat reviu o valor de 93,5 para 93,0 na atualização do conjunto de 21.10.2026 (o carimbo passou de 22.04.2026 a 21.10.2026): a reconferência semanal de 26.10.2026 viu a revisão; a linha foi relida na fonte a 26.10.2026 (a resposta alojada com recibo); o sítio publicava o valor da leitura anterior.

EN: Eurostat revised the value from 93.5 to 93.0 in the dataset update of 21.10.2026 (the dataset stamp moved from 22.04.2026 to 21.10.2026): the weekly check of 26.10.2026 caught the revision; the row was re-read at the source on 26.10.2026 (the hosted response with its receipt); the site published the value of the earlier reading.

**`fluxo-de-credito-as-empresas-2024` (caso A)**

PT: O Eurostat reviu o valor de 2,4 para 2,2 na atualização do conjunto de 17.10.2026 (o carimbo passou de 09.10.2026 a 17.10.2026): a reconferência semanal de 19.10.2026 viu a revisão, e a de 26.10.2026 leu o mesmo valor com o carimbo de 24.10.2026; a linha foi relida na fonte a 26.10.2026 (a resposta alojada com recibo); o sítio publicava o valor da leitura anterior.

EN: Eurostat revised the value from 2.4 to 2.2 in the dataset update of 17.10.2026 (the dataset stamp moved from 09.10.2026 to 17.10.2026): the weekly check of 19.10.2026 caught the revision, and the one of 26.10.2026 read the same value with the stamp of 24.10.2026; the row was re-read at the source on 26.10.2026 (the hosted response with its receipt); the site published the value of the earlier reading.

**`fluxo-de-credito-as-empresas-2025` (caso A)**

PT: O Eurostat reviu o valor de 3,0 para 3,4 na atualização do conjunto de 17.10.2026 (o carimbo passou de 09.10.2026 a 17.10.2026): a reconferência semanal de 19.10.2026 viu a revisão, e a de 26.10.2026 leu o mesmo valor com o carimbo de 24.10.2026; a linha foi relida na fonte a 26.10.2026 (a resposta alojada com recibo); o sítio publicava o valor da leitura anterior.

EN: Eurostat revised the value from 3.0 to 3.4 in the dataset update of 17.10.2026 (the dataset stamp moved from 09.10.2026 to 17.10.2026): the weekly check of 19.10.2026 caught the revision, and the one of 26.10.2026 read the same value with the stamp of 24.10.2026; the row was re-read at the source on 26.10.2026 (the hosted response with its receipt); the site published the value of the earlier reading.

**`fluxo-de-credito-as-familias-2024` (caso A)**

PT: O Eurostat reviu o valor de 4,1 para 4,0 na atualização do conjunto de 17.10.2026 (o carimbo passou de 09.10.2026 a 17.10.2026): a reconferência semanal de 19.10.2026 viu a revisão, e a de 26.10.2026 leu o mesmo valor com o carimbo de 24.10.2026; a linha foi relida na fonte a 26.10.2026 (a resposta alojada com recibo); o sítio publicava o valor da leitura anterior.

EN: Eurostat revised the value from 4.1 to 4.0 in the dataset update of 17.10.2026 (the dataset stamp moved from 09.10.2026 to 17.10.2026): the weekly check of 19.10.2026 caught the revision, and the one of 26.10.2026 read the same value with the stamp of 24.10.2026; the row was re-read at the source on 26.10.2026 (the hosted response with its receipt); the site published the value of the earlier reading.

**`fluxo-de-credito-as-familias-2025` (caso A)**

PT: O Eurostat reviu o valor de 8,6 para 9,0 na atualização do conjunto de 17.10.2026 (o carimbo passou de 09.10.2026 a 17.10.2026): a reconferência semanal de 19.10.2026 viu a revisão, e a de 26.10.2026 leu o mesmo valor com o carimbo de 24.10.2026; a linha foi relida na fonte a 26.10.2026 (a resposta alojada com recibo); o sítio publicava o valor da leitura anterior.

EN: Eurostat revised the value from 8.6 to 9.0 in the dataset update of 17.10.2026 (the dataset stamp moved from 09.10.2026 to 17.10.2026): the weekly check of 19.10.2026 caught the revision, and the one of 26.10.2026 read the same value with the stamp of 24.10.2026; the row was re-read at the source on 26.10.2026 (the hosted response with its receipt); the site published the value of the earlier reading.

**`fluxo-de-credito-as-familias-2025-ue` (caso A)**

PT: O Eurostat reviu o valor de 2,9 para 3,0 na atualização do conjunto de 17.10.2026 (o carimbo passou de 09.10.2026 a 17.10.2026): a reconferência semanal de 19.10.2026 viu a revisão, e a de 26.10.2026 leu o mesmo valor com o carimbo de 24.10.2026; a linha foi relida na fonte a 26.10.2026 (a resposta alojada com recibo); o sítio publicava o valor da leitura anterior.

EN: Eurostat revised the value from 2.9 to 3.0 in the dataset update of 17.10.2026 (the dataset stamp moved from 09.10.2026 to 17.10.2026): the weekly check of 19.10.2026 caught the revision, and the one of 26.10.2026 read the same value with the stamp of 24.10.2026; the row was re-read at the source on 26.10.2026 (the hosted response with its receipt); the site published the value of the earlier reading.

**`formacao-bruta-de-capital-fixo-2025-ue` (caso C)**

PT: O Eurostat reviu o valor de 21,4 para 21,5 na atualização do conjunto de 22.10.2026 (o carimbo passou de 15.10.2026 a 22.10.2026): a reconferência semanal de 26.10.2026 viu a revisão; a linha foi relida na fonte a 26.10.2026 (a resposta alojada com recibo); o sítio publicava o valor da leitura anterior.

EN: Eurostat revised the value from 21.4 to 21.5 in the dataset update of 22.10.2026 (the dataset stamp moved from 15.10.2026 to 22.10.2026): the weekly check of 26.10.2026 caught the revision; the row was re-read at the source on 26.10.2026 (the hosted response with its receipt); the site published the value of the earlier reading.

**`licencas-de-construcao-2025-ue` (caso C)**

PT: O Eurostat reviu o valor de 377,5 para 377,6 na atualização do conjunto de 21.10.2026 (o carimbo passou de 17.10.2026 a 21.10.2026): a reconferência semanal de 26.10.2026 viu a revisão; a linha foi relida na fonte a 26.10.2026 (a resposta alojada com recibo); o sítio publicava o valor da leitura anterior.

EN: Eurostat revised the value from 377.5 to 377.6 in the dataset update of 21.10.2026 (the dataset stamp moved from 17.10.2026 to 21.10.2026): the weekly check of 26.10.2026 caught the revision; the row was re-read at the source on 26.10.2026 (the hosted response with its receipt); the site published the value of the earlier reading.

**`pib-real-per-capita-2025-ue` (caso C)**

PT: O Eurostat reviu o valor de 31 890 para 31 980 na atualização do conjunto de 22.10.2026 (o carimbo passou de 15.10.2026 a 22.10.2026): a reconferência semanal de 26.10.2026 viu a revisão; a linha foi relida na fonte a 26.10.2026 (a resposta alojada com recibo); o sítio publicava o valor da leitura anterior.

EN: Eurostat revised the value from 31 890 to 31 980 in the dataset update of 22.10.2026 (the dataset stamp moved from 15.10.2026 to 22.10.2026): the weekly check of 26.10.2026 caught the revision; the row was re-read at the source on 26.10.2026 (the hosted response with its receipt); the site published the value of the earlier reading.

## «O que mudou», como imprime no dist

As onze observações irmãs reutilizam a declaração do nome do cartão principal na escada comum dos nomes. A associação está em `src/data/nomes-das-medidas.mjs`, sem criar nomes novos. Os lugares continuam em `src/data/lugar-das-linhas.mjs`; acrescentar as irmãs à lista de cartões de Portugal seria confundir uma observação anterior ou europeia com uma medida principal. Conferiram-se no HTML trinta entradas, quinze por edição, uma atualização por linha. A prova completa, incluindo o texto do par de valores, está em `g/mudancas.json`. A primeira implementação reutilizava a marca do ficheiro do cartão principal sem uma entrada para o identificador da irmã. A construção e a voz recusaram essa marca. A declaração final regista as onze irmãs em `NOMES_DO_PROJETO`, copiando o par de nomes da medida principal, e deixa a escada comum dos nomes intacta.

| Linha | PT | EN |
|---|---|---|
| `custo-unitario-do-trabalho-2025-ue` | Custo do trabalho por unidade produzida (custo unitário do trabalho)15,2 → 14,8 variação em três anos, %fonte · Eurostat | Labour cost per unit of output (unit labour cost)15,2 → 14,8 three-year change, %source · Eurostat |
| `divida-das-empresas-2024` | Dívida das empresas (não financeiras)67,1 → 66,6 % do PIBfonte · Eurostat | Debt of (non-financial) companies67,1 → 66,6 % of GDPsource · Eurostat |
| `divida-das-empresas-2025` | Dívida das empresas (não financeiras)64,9 → 65,1 % do PIBfonte · Eurostat | Debt of (non-financial) companies64,9 → 65,1 % of GDPsource · Eurostat |
| `divida-das-empresas-2025-ue` | Dívida das empresas (não financeiras)70,0 → 70,2 % do PIBfonte · Eurostat | Debt of (non-financial) companies70,0 → 70,2 % of GDPsource · Eurostat |
| `divida-das-familias-2024` | Dívida das famílias52,6 → 52,3 % do PIBfonte · Eurostat | Household debt52,6 → 52,3 % of GDPsource · Eurostat |
| `divida-das-familias-2025` | Dívida das famílias53,9 → 54,4 % do PIBfonte · Eurostat | Household debt53,9 → 54,4 % of GDPsource · Eurostat |
| `divida-publica-2024` | Dívida pública93,5 → 93,0 % do PIBfonte · Eurostat | Government debt93,5 → 93,0 % of GDPsource · Eurostat |
| `fluxo-de-credito-as-empresas-2024` | Fluxo de crédito às empresas (não financeiras)2,4 → 2,2 % do stock no final do período anteriorfonte · Eurostat | Credit flow to (non-financial) companies2,4 → 2,2 % of the stock at the end of the previous periodsource · Eurostat |
| `fluxo-de-credito-as-empresas-2025` | Fluxo de crédito às empresas (não financeiras)3,0 → 3,4 % do stock no final do período anteriorfonte · Eurostat | Credit flow to (non-financial) companies3,0 → 3,4 % of the stock at the end of the previous periodsource · Eurostat |
| `fluxo-de-credito-as-familias-2024` | Fluxo de crédito às famílias4,1 → 4,0 % do stock no final do período anteriorfonte · Eurostat | Credit flow to households4,1 → 4,0 % of the stock at the end of the previous periodsource · Eurostat |
| `fluxo-de-credito-as-familias-2025` | Fluxo de crédito às famílias8,6 → 9,0 % do stock no final do período anteriorfonte · Eurostat | Credit flow to households8,6 → 9,0 % of the stock at the end of the previous periodsource · Eurostat |
| `fluxo-de-credito-as-familias-2025-ue` | Fluxo de crédito às famílias2,9 → 3,0 % do stock no final do período anteriorfonte · Eurostat | Credit flow to households2,9 → 3,0 % of the stock at the end of the previous periodsource · Eurostat |
| `formacao-bruta-de-capital-fixo-2025-ue` | Investimento em bens duradouros para produzir (formação bruta de capital fixo)21,4 → 21,5 % do PIBfonte · Eurostat | Investment in durable goods used for production (gross fixed capital formation)21,4 → 21,5 % of GDPsource · Eurostat |
| `licencas-de-construcao-2025-ue` | Área licenciada para habitação377,5 → 377,6 m² por 1000 habitantesfonte · Eurostat | Floor area licensed for housing377,5 → 377,6 m² per 1000 inhabitantssource · Eurostat |
| `pib-real-per-capita-2025-ue` | PIB real por habitante31 890 → 31 980 euros por habitante · volumes encadeados (2015)fonte · Eurostat | Real GDP per capita31 890 → 31 980 euro per capita · chain linked volumes (2015)source · Eurostat |

## Ferramentas e frases que mudaram

`--published-at` recusa «a linha já tem published_at», exige que o conjunto dos campos alterados seja exatamente `{published_at}` e volta à planta do dia do acesso no lugar do carimbo. O cabeçalho explica a leitura da árvore de trabalho: a aplicação pode ainda não estar em HEAD e é conferida contra a base selada e o registo. A conferência auxiliar confirmou a inserção válida, a recusa de data existente, a recusa de nenhuma mudança, a planta do acesso e a alteração de outro campo.

O comparador conserva `.claim-provisorio` no texto lido do HTML. Reconstituiu-se a medição anterior, com notas, pela cabeça `442b284e229408018e8c97c59dadd285a526bf3c`, anterior à aplicação CR2, sem alterar o retrato histórico. A primeira medição de diagnóstico ainda só abrangia os cinquenta parágrafos dos resolvedores e encontrou zero mudanças; a medição final inclui as réguas das duas linhas que perderam «p»: cinquenta e quatro textos, quatro mudados, todos conferidos no HTML. As cinquenta frases dos resolvedores continuam iguais. Antes e depois visíveis:

| Linha | Edição | Antes | Depois |
|---|---|---|---|
| `divida-das-empresas-2024` | pt | 2024:67,1 (dado provisório) | 2024:66,6 |
| `divida-das-familias-2024` | pt | 2024:52,6 (dado provisório) | 2024:52,3 |
| `divida-das-empresas-2024` | en | 2024:67,1 (provisional data) | 2024:66,6 |
| `divida-das-familias-2024` | en | 2024:52,6 (provisional data) | 2024:52,3 |

## Corrida pela raiz, dívida pendente e higiene

A corrida pela raiz não escreveu reconferências: encontrou as 91 já escritas nesse dia, com zero novos alarmes e avisos. Os 17 «igual» de 26.10 vieram da corrida da worktree. A formulação «91 reconferências, zero alarmes» não descrevia o que a corrida pela raiz fez; foi corrigida no relatório consolidado.

As duas linhas de dívida pública de 2025 continuam adiadas porque são pontos da série por país: a regra S6 recusa valores que divirjam da série e o gerador atual não relê a fonte nem escreve a história de cada ponto (VS6). Aplicar só as linhas quebraria essa correspondência. Até à UE1-c, o leitor vê no cartão da dívida pública 2024 na leitura de outubro e 2025 na leitura de abril, sem uma leitura de outubro coerente dos dois períodos.

Minor 11 a 14 ficam declarados para a higiene, sem alteração nesta passagem: «Próxima verificação 21.10.2026» já passada nos recibos da dívida; duas releituras de 26.10 no mesmo recibo sem identificar qual é qual; `verificacao.mjs` conserva 17 alarmes até 02.11. O sinal global não foi reescrito por uma corrida delimitada.

## Códigos e custo desta passagem

- `build`: 1, registo `g/build-g.log`.
- `ledger-check`: 0, registo `g/ledger-check-g.log`.
- `check-voz`: 1, registo `g/check-voz-g.log`.
- `check-registo`: 0, registo `g/check-registo-g.log`.
- `check-cartao`: 1, registo `g/check-cartao-g.log`.
- `check-cruzamento`: 0, registo `g/check-cruzamento-g.log`.
- `typecheck`: 0, registo `g/typecheck-g.log`.

A construção deu 1 na voz pelas marcas de origem dos nomes das irmãs. A corrida isolada da voz deu 1 pelo mesmo motivo; cartões deu 1 em doze títulos de recibos, porque a primeira implementação só alterava a escada do cartão e não a declaração comum do nome. A correção final põe os nomes na declaração comum `NOMES_DO_PROJETO`, usada pelas duas escadas. Não se repetiram a construção nem as seis conferências pedidas. `sincronizar-marcas.mjs` corrigiu apenas a origem declarada dos nomes em 28 páginas do HTML já gerado, conservando o texto, e sincronizou o espaço estreito dos milhares nas duas razões do PIB. O diagnóstico final `conferir-marcas.mjs` confere todas as marcas afetadas contra a declaração e chama a conferência dos recibos K17. O resultado está em `g/marcas-conferidas.json`; o código dos comandos anteriores não é apresentado como verde. A cadeia da construção depois da voz não foi executada. Uma nova construção integral fica para a aterragem.

Uma construção e seis conferências pedidas, uma vez cada; o cruzamento incluiu `--with-origin` e a construção usou a worktree do motor por `RESEARCHHUB_DIR`. A construção inclui as conferências da sua própria cadeia. Conferências auxiliares: história do valor uma vez; ferramenta uma vez; duas reconstituições do antes e duas comparações de frases (diagnóstico e versão final); duas conferências das trinta entradas (antes e depois da correção das marcas), mais um diagnóstico final das marcas e dos recibos K17. Não se correu a corrida inteira dos portões, nem capturas, nem o gate do motor. O motor conserva `d8f0513b0713bedbd73f0c510bed875659a2f04f`.

A tabela consolidada corrige CR2-d para as 21 chamadas medidas no ficheiro de custo antes do commit e da inspeção final; CR2-e tem 17 conforme este mandato. A contagem CR2-g e os tokens medidos estão em `g/custo.json`, com o momento da medição. A cabeça e o commit finais são inspecionados depois do pedido ao escrivão e comunicados na resposta.

---

## Histórico até CR2-f

# CR2-f: lugares declarados e continuação do CR2-d

A construção única `f/build-f.log`, com código em `f/build-f.code`, deu 1. Os quinze lugares foram conferidos no HTML. Acrescentaram-se onze declarações em `src/data/lugar-das-linhas.mjs`: seis agregados da União, pela coordenada selada `EU27_2020`, seguindo a dívida das famílias da União; cinco valores de Portugal de 2024, pela única coordenada `PT`, seguindo as cinco declarações de 2024 do C2. Quatro linhas de 2025 já tinham lugar pela tabela `DOMINIO_DAS_MEDIDAS`. A mesma construção chegou depois a `check:voz` e recusou o inventário das frases: 102 revisões de proveniência no HTML contra 72 ainda declaradas. As duas frases antigas foram marcadas como retiradas, com a razão, e as duas novas classificadas como conteúdo, seguindo a forma do C2. Não se alteraram números, fontes, pessoas ou guardas. Não se repetiu a construção; o seu código 1 fica conservado. A voz e as cinco conferências seguintes que ficaram por executar na cadeia foram corridas isoladamente, com códigos próprios.

## As cinco paragens

1. Painel delimitado contra bases de 28.09: código 1; direção repetiu com bases vivas de 26.10, código 0 (nenhuma reconferência escrita: as 91 já estavam escritas nesse dia; zero novos alarmes e avisos). Prova histórica em `painel-raiz.resumo.txt`.
2. CR2-b: série S6, código 1 na construção e no livro, porque as duas dívidas de 2025 diferiam dos pontos da série. A reposição de `3a8932b67` conservou os valores publicados; ambas esperam pela UE1-c.
3. CR2-c: gerador sem releitura e sem história VS6/S8. Ensaio válido 1; invocação anterior com caminho incorreto 2. Não se alterou o motor.
4. CR2-d: selos das atualizações retiradas, códigos 1 na construção e livro. A direção repôs os selos em `c63fa86e7`; CR2-e confirmou o livro com 0.
5. CR2-e: falta de lugar declarado, código 1 na construção. CR2-f acrescenta as onze entradas em falta, sem duplicar as quatro declarações existentes. `check:pais`, incluído na construção, valida a derivação independente das coordenadas e o lugar das mudanças.

## Os lugares e as páginas medidos

`f/lugares.mjs` lê as coordenadas do livro, as réguas e entradas do `src/` e exige valores `[data-claim]` nas páginas temáticas das duas edições. `f/lugares.json` guarda por linha os ficheiros de origem, cartões, páginas, painéis da primeira página e textos encontrados no HTML. A declaração da dívida pública de 2024 também se confirma no painel `estado` da primeira página. As ausências dos outros painéis são registadas, sem atribuir a uma linha uma presença que não tem. Não houve capturas.

| Linha | Lugar | Declaração | Página temática PT |
|---|---|---|---|
| `custo-unitario-do-trabalho-2025-ue` | uniao-europeia | lugar-das-linhas | `dist/emprego/index.html` |
| `divida-das-empresas-2024` | portugal | lugar-das-linhas | `dist/estado-e-economia/index.html` |
| `divida-das-empresas-2025` | portugal | DOMINIO_DAS_MEDIDAS | `dist/estado-e-economia/index.html` |
| `divida-das-empresas-2025-ue` | uniao-europeia | lugar-das-linhas | `dist/estado-e-economia/index.html` |
| `divida-das-familias-2024` | portugal | lugar-das-linhas | `dist/pobreza-e-desigualdade/index.html` |
| `divida-das-familias-2025` | portugal | DOMINIO_DAS_MEDIDAS | `dist/pobreza-e-desigualdade/index.html` |
| `divida-publica-2024` | portugal | lugar-das-linhas | `dist/estado-e-economia/index.html` |
| `fluxo-de-credito-as-empresas-2024` | portugal | lugar-das-linhas | `dist/estado-e-economia/index.html` |
| `fluxo-de-credito-as-empresas-2025` | portugal | DOMINIO_DAS_MEDIDAS | `dist/estado-e-economia/index.html` |
| `fluxo-de-credito-as-familias-2024` | portugal | lugar-das-linhas | `dist/pobreza-e-desigualdade/index.html` |
| `fluxo-de-credito-as-familias-2025` | portugal | DOMINIO_DAS_MEDIDAS | `dist/pobreza-e-desigualdade/index.html` |
| `fluxo-de-credito-as-familias-2025-ue` | uniao-europeia | lugar-das-linhas | `dist/pobreza-e-desigualdade/index.html` |
| `formacao-bruta-de-capital-fixo-2025-ue` | uniao-europeia | lugar-das-linhas | `dist/estado-e-economia/index.html` |
| `licencas-de-construcao-2025-ue` | uniao-europeia | lugar-das-linhas | `dist/habitacao/index.html` |
| `pib-real-per-capita-2025-ue` | uniao-europeia | lugar-das-linhas | `dist/estado-e-economia/index.html` |

## Recibos, frases e comparações

`f/partida.json`: 15 linhas atualizadas, 45 entradas de 26.10 (uma atualização e duas proveniências por linha), duas pendentes; as 17 conservam «diverge» de 26.10. `recibos-cr2.mjs` leu 34 recibos: 34 certos, 30 atualizados e 4 pendentes. A planta do recibo adulterado foi detetada. Os quatro recibos das duas dívidas conservam 89,7 e 81,7 e a divergência, sem atualização de 26.10; mostram o aviso do valor em uso e não mostram data de publicação, porque as linhas pendentes não a declaram. A primeira medição procurava o valor em h1, mas a página põe o nome no título e o valor em .linha-valor; o guião foi corrigido, com uma planta adicional que adultera o valor. As falhas intermédias e os códigos ficam preservados.

`frases-cr2.mjs depois`, medição histórica incompleta que a CR2-g corrige abaixo: 50 frases, 50 iguais à partida, 0 alteradas; todas conferidas no HTML: sim. Inventário de 84 páginas que citam uma das 17 linhas, em `f/frases-depois.json` (inclui recibos e registos, não é uma comparação de páginas antes/depois). `leituras-cr2.mjs`: 18 leituras de 9 cartões, 0 textos alterados e 0 inversões em 50 ramos. A planta do comparador foi detetada. Os guiões de leituras passaram a aceitar uma pasta de saída, preservando os resultados anteriores. O comparador de frases foi corrigido para ler o parágrafo das caixas sem incluir o título e comparar o texto sem notas de estatuto nas duas representações; guarda as notas de estimativa e de provisório separadamente, verificadas pelas conferências de explicações e cartões. As três recusas intermédias do guião ficam nos registos. A entrada cr2 no registo de revisões do inventário fica por ler, para a leitura cruzada antes da fusão. O comando sinais deu 0 e registou uma frase de naoDiz da explicação dinheiro-do-estado-2026 guardada fora da página; não é uma frase nova nem foi alterada nesta passagem.

## Códigos lidos dos ficheiros

| Corrida | Código |
|---|---|
| `build-f` | 1 |
| `check-cartao` | 0 |
| `check-cruzamento` | 0 |
| `check-discussao` | 0 |
| `check-explicacoes` | 0 |
| `check-formato` | 0 |
| `check-lingua` | 0 |
| `check-navegacao` | 0 |
| `check-nomes` | 0 |
| `check-registo` | 0 |
| `check-voz-final` | 0 |
| `check-voz` | 1 |
| `frases-conferidas` | 1 |
| `frases-final` | 1 |
| `frases-html` | 0 |
| `frases` | 1 |
| `ledger-check` | 0 |
| `leituras-comparadas` | 0 |
| `leituras-depois` | 0 |
| `lugares` | 0 |
| `partida` | 0 |
| `recibos-conferidos` | 0 |
| `recibos-final` | 1 |
| `recibos` | 1 |
| `sinais` | 0 |
| `typecheck` | 0 |

Uma construção e sete conferências pedidas, uma vez cada, por `curto.sh`; sete corridas adicionais em seis conferências (voz duas vezes; nomes, língua, formato, navegação e sinais uma vez cada), para completar a cadeia interrompida; onze corridas em seis medições auxiliares (partida e lugares uma vez cada, recibos três vezes, frases quatro vezes, leituras e comparação uma vez cada). Os registos estão em `f/`, com caminhos locais substituídos por marcas. A construção inclui as suas próprias conferências encadeadas, identificadas no registo; não se executou a corrida inteira dos três portões. Não houve navegador, capturas, publicação ou gate do motor. O motor ficou em `d8f0513b0713bedbd73f0c510bed875659a2f04f`, sem alterações. `medidas.json` mantém as continuações anteriores e acrescenta `continuacao_cr2f`.

## O que continua aberto

A UE1-c deve reler as séries por país e conservar os recibos e a história de cada ponto para aplicar as duas revisões de dívida pública de 2025. A leitura a frio, corrida inteira, capturas e aterragem ficam com a direção. `src/data/verificacao.mjs` conserva os 17 alarmes semanais; esta passagem não corre o painel nem reescreve esse sinal.

Custo medido antes do commit: 47 chamadas de ferramentas. tokens used: 3413645 (total acumulado observado no registo, incluindo entrada em cache). O custo desta passagem está em `f/custo.json` e na continuação CR2-f de `custo.json`, com o momento da medição. A configuração declarada no mandato é Sol 6.1 medium; não se inventa identificador interno. Os valores antigos e novos das quinze linhas e as provas das passagens anteriores seguem no histórico do LEIA-ME.md.

---

## Histórico até CR2-e (estado anterior, conservado como prova)

# CR2: quinze das dezassete revisões do Eurostat postas no sítio; as duas da dívida pública de 2025 esperam pela ferramenta das séries por país

A CR2-e ultrapassou a quarta paragem: a direção repôs os selos das duas dívidas em `c63fa86e7`, e `ledger:check` deu 0. Não foi necessário repor nem voltar a selar outro artefacto.

A construção única deu 1 por uma quinta paragem, agora numa das quinze linhas: `custo-unitario-do-trabalho-2025-ue` mudou, mas nenhuma declaração lhe atribui um lugar. `src/lib/mudancas.mjs` recusa renderizar `/correcoes/` e pede uma declaração fundamentada em `src/data/lugar-das-linhas.mjs`. A condição expressa do CR2-e manda parar quando a recusa incide numa das quinze linhas. Não se alterou essa declaração nem se repetiu a construção. O `dist/` é parcial, sem `index.html`, `version.json` ou os recibos conferidos: esta entrega não está pronta.

As provas novas estão em `e/`, preservando as anteriores em `d/`. Não houve corrida inteira, capturas, publicação ou alterações do motor.

## Ponto de partida conferido por guião

`d/partida.mjs`, com saída em `e/partida.json`: 15 linhas atualizadas, uma `atualizacao` e duas `proveniencia` por linha, 45 entradas de 26.10; duas linhas pendentes, sem correções dessa data; as 17 conservam a reconferência «diverge» de 26.10. Os valores e correções das duas pendentes foram comparados com `main`. Código 0. A história do valor passou também isoladamente: 4 controlos e 18 plantas, código 0.

A cabeça inicial do sítio é `c63fa86e7`. O mandato indica o motor em `e4628c17`, mas a cabeça observada foi `d8f0513b0713bedbd73f0c510bed875659a2f04f`, uma fusão posterior que contém aquele commit. A árvore estava limpa; foi esta worktree que `RESEARCHHUB_DIR` indicou na construção e no cruzamento com origem. Não foi alterada.

## As quatro paragens anteriores

1. **CR2, painel delimitado e linhas de base vivas.** A corrida na worktree deu código 1, com quatro alarmes, porque comparou com as bases comitadas de 28.09. A repetição pelo lugar de direção na árvore principal, com bases vivas de 26.10, deu código 0 sem escrever reconferências: 91 já estavam escritas nesse dia; zero novos alarmes e zero avisos. Os 17 «igual» de 26.10 vieram da corrida da worktree, não da corrida pela raiz. Prova conservada em `painel-raiz.resumo.txt`. O sinal global não é escrito por esta corrida delimitada.
2. **CR2-b, série S6.** Construção e livro-razão deram 1: a série por país conservava PT 89,7 e UE 81,7, enquanto as linhas tinham 89,2 e 81,5. Registo, cruzamento com origem e typecheck deram 0; explicações, discussão e cartões deram 1 por falta de `dist/`.
3. **CR2-c, gerador sem releitura nem VS6.** O ensaio válido deu 1; uma invocação anterior com caminho incorreto deu 2. O gerador lê apenas corpos alojados em `source/ue1/` e escreve `corrections: []`; não relê a fonte. VS6 exige história por `geo`, com valores antigo e novo, para cada ponto publicado alterado. S8 exige também data, natureza e motivo nas duas línguas. A passagem parou sem escrita, construção ou conferências, conforme o mandato. Provas em `c/resultado.json` e nos códigos de `c/`.

4. **CR2-d, história selada das duas linhas.** A reposição das linhas em `3a8932b67` conservou indevidamente os selos das atualizações retiradas. Construção e livro-razão deram 1: «uma entrada selada foi retirada ou alterada» e «a lista tem 0 entradas e o registo sela 1». Registo, cruzamento com origem e typecheck deram 0; explicações, discussão e cartões deram 1 por falta de HTML. A direção repôs os dois selos ao estado de `main` em `c63fa86e7`; a CR2-e confirmou `ledger:check` a 0. As quinze histórias restantes foram conservadas.

## As quinze linhas que seguem

Os valores anteriores e novos vêm da releitura medida na CR2, conservada em `medidas.json`; esta passagem confere o estado do livro, sem novas chamadas ao Eurostat.

| Linha | Antes | Novo |
|---|---|---|
| `custo-unitario-do-trabalho-2025-ue` | 15,2 | 14,8 |
| `divida-das-empresas-2024` | 67,1 | 66,6 |
| `divida-das-empresas-2025` | 64,9 | 65,1 |
| `divida-das-empresas-2025-ue` | 70,0 | 70,2 |
| `divida-das-familias-2024` | 52,6 | 52,3 |
| `divida-das-familias-2025` | 53,9 | 54,4 |
| `divida-publica-2024` | 93,5 | 93,0 |
| `fluxo-de-credito-as-empresas-2024` | 2,4 | 2,2 |
| `fluxo-de-credito-as-empresas-2025` | 3,0 | 3,4 |
| `fluxo-de-credito-as-familias-2024` | 4,1 | 4,0 |
| `fluxo-de-credito-as-familias-2025` | 8,6 | 9,0 |
| `fluxo-de-credito-as-familias-2025-ue` | 2,9 | 3,0 |
| `formacao-bruta-de-capital-fixo-2025-ue` | 21,4 | 21,5 |
| `licencas-de-construcao-2025-ue` | 377,5 | 377,6 |
| `pib-real-per-capita-2025-ue` | 31 890 | 31 980 |

## As duas linhas que esperam

| Linha | Valor publicado conservado | Revisão lida na CR2, ainda não aplicada |
|---|---|---|
| `divida-publica-2025` | 89,7 | 89,2 |
| `divida-publica-2025-ue` | 81,7 | 81,5 |

São pontos da série `divida-publica-2025-paises`. Esperam pela UE1-c, que deve reler as fontes e conservar recibos e história de cada ponto. O livro conserva a «diverge» de 26.10 e o valor publicado. É isso que os quatro recibos devem mostrar; na CR2-e também não foi possível inspecioná-los no HTML. Não se afirma que o leitor já os vê numa construção nova.

## Frases e recibos

`frases-cr2.mjs resolvedores` e `e/frases-comparadas-sem-html.json` comparam as 50 frases nas duas edições com `frases-antes.json`: **50 iguais, zero textos alterados**, em 21 ficheiros de origem. Esta é uma medida atual dos resolvedores, sem validação do HTML. A comparação histórica das leituras dos nove cartões tinha 18 textos iguais e 50 ramos sem inversões; não foi repetida nesta passagem nem apresentada como medida atual do HTML.

Os modos que leem o `dist/` não correram: faltam `version.json`, os recibos e páginas de leitura, conforme `e/dist-parcial.json`. Não há lista atual completa das páginas, comparação de frases e ramos no HTML nem validação dos 34 recibos. Os guiões agora aceitam uma pasta de saída opcional, para preservar as provas anteriores.

## Códigos CR2-d, lidos dos ficheiros

Os códigos estão em `d/*.codigo`, com registos de saída em `d/*.log`.

| Corrida | Código |
|---|---|
| `build` | 1 |
| `check-cartao` | 1 |
| `check-cruzamento` | 0 |
| `check-discussao` | 1 |
| `check-explicacoes` | 1 |
| `check-registo` | 0 |
| `frases-resolvedores` | 0 |
| `ledger-check` | 1 |
| `typecheck` | 0 |

A construção correu uma vez com `RESEARCHHUB_DIR` na worktree do motor, por `curto.sh`. As sete conferências pedidas correram uma vez cada. O cruzamento com origem passou com dois avisos de `built_at` em outros livros do motor, sem linhas divergentes. Não se executou nenhum navegador nem se pediram portões ao escrivão.

`medidas.json` conserva a medição anterior sob `historico_antes_cr2d` e acrescenta `continuacao_cr2d`, com a partida, códigos e ausências desta passagem. Os resultados históricos de 17 atualizações não representam o estado atual de 15.

## Códigos CR2-e, lidos dos ficheiros

| Corrida | Código |
|---|---|
| `build` | 1 |
| `ledger-check` | 0 |
| `check-registo` | 0 |
| `check-cruzamento` com origem | 0 |
| `check-explicacoes` | 1 |
| `check-discussao` | 1 |
| `check-cartao` | 1 |
| `typecheck` | 0 |
| `partida` | 0 |
| `historia-do-valor` | 0 |
| `frases-resolvedores` | 0 |

Uma construção por `curto.sh`, sete conferências pedidas (livro-razão e as seis do ponto 4), uma corrida de cada. Explicações e cartões falham por ficheiros HTML ausentes; discussão aponta páginas e recibos ausentes no `dist/` parcial. O cruzamento com origem passa com dois avisos de `built_at` nos mesmos dois livros do motor, sem linhas divergentes. Nenhuma falha foi corrigida por contornar a condição de paragem.

`e/medir.py` atualiza `medidas.json` com `continuacao_cr2e`, sem apagar a prova das passagens anteriores. Os resultados históricos de 17 atualizações não representam o estado atual de 15. Os modos HTML dos guiões não foram contabilizados como conferências executadas.

## Custo das passagens

Configuração indicada pelos mandatos: CR2 no Astra; CR2-b, CR2-c, CR2-d e CR2-e no Sol 6.1 medium. Isto regista a configuração declarada, sem inventar um identificador interno do modelo.

| Passagem | Chamadas de ferramentas | Construções | Conferências pedidas |
|---|---|---|---|
| CR2 | 53, segundo o relatório final; custo.json mediu 51 antes do commit e da inspeção | 0 | 0 |
| CR2-b | 20, segundo o relatório final; custo.json mediu 16 antes do commit e da inspeção | 1 | 7 |
| CR2-c | 10 | 0 | 0 |
| CR2-d | 21 na medição de custo.json, antes do commit e da inspeção final | 1 | 7 |
| CR2-e | 17, conforme o mandato CR2-g | 1 | 7 |
| CR2-f | 47 chamadas; 110 402 símbolos pelo lançador | 1 | 7 |
| CR2-g | 54 chamadas na medição do construtor; lançador: 58 turnos, 5 427 291 de entrada, 5 325 056 em cache, 27 679 de saída, 1,0 ponto | 1 | 6 |
| CR2-h | 33 chamadas na medição de h/custo.json | 2, incluindo referência main | 2 fora da construção; paragem do §2 |

A contagem CR2-e conta as chamadas `functions.exec`; os comandos internos são contados à parte. Além das sete conferências pedidas, correram partida, história do valor e frases nos resolvedores, uma vez cada. Sem corrida inteira, capturas ou gate do motor nesta passagem. `tokens used`: não exposto.

## Commits

Histórico do sítio: `8bb4d1018` aplicou as releituras; `13450306a` guardou provas e relatório da CR2; `0558afed2` documentou a S6; `6c62ece05` documentou a falta da ferramenta por país; `3a8932b67` repôs as duas dívidas. `7088d2e2e` guardou a prova da quarta paragem; `c63fa86e7` repôs os selos. O commit CR2-e guarda a prova da quinta paragem, os códigos e o relatório atualizado. A cabeça final é inspecionada e comunicada na resposta final.

## O que ficou aberto

- Resolver pela direção a quinta paragem: o lugar da linha `custo-unitario-do-trabalho-2025-ue`, com fundamento, e autorizar nova construção. Não se completou esta entrega.
- Conferir os 34 recibos e as páginas, frases e ramos no `dist/`, depois de uma construção bem-sucedida.
- A leitura a frio, a corrida inteira, as capturas e a aterragem, a cargo do lugar de direção.
- UE1-c: releitura das séries por país com recibos e história dos pontos.
- `src/data/verificacao.mjs`: conserva os 17 alarmes semanais; a corrida semanal de 02.11 reconfere e reescreve o sinal.

Custo CR2-g medido antes do commit: 54 chamadas de ferramentas. tokens used: 4809748 (total acumulado observado, incluindo entrada em cache). A medição exclui o pedido de commit e a inspeção final.
