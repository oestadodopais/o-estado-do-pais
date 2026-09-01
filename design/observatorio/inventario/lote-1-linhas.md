# Lote 1 · Economia e finanças públicas (E) e Trabalho (T) · 10 linhas

*Lê primeiro `BRIEF-comum.md` nesta pasta. Pasta de saída: esta. Ficheiros: `lote-1.md` e `lote-1.json`. Modelo: Claude Opus 5. As pistas abaixo (códigos, endereços, publicadores) são pistas de pesquisa, não afirmações: confirma cada uma na fonte e corrige o que estiver mal.*

## Contexto útil

O sítio já publica 13 medidas do Procedimento dos Desequilíbrios Macroeconómicos e 8 do Painel Social Europeu (as 32 linhas em `~/Instruments/OEstadoDoPais/ledger/claims/*-2025.yml` e `despesa-em-id-2024.yml`; cada uma tem `source_url`, `path` e `excerpt`, podes lê-las para ver o endereço exato que a casa usa), e sete medidas por concelho para os 308 concelhos (população, poder de compra, empresas, dívida total da câmara, limite legal da dívida, prazo médio de pagamentos, desemprego registado; as linhas em `ledger/claims/<concelho>-*.yml`). Onde uma linha abaixo já existe no sítio, o que falta são as colunas que o livro-razão não tem: a definição publicada, o início da série, a data de publicação, o calendário de difusão, a licença, a comparação que a fonte permite.

## As linhas

### E1 · PIB real por habitante, taxa de variação
- Pergunta da carta: quanto cresce a economia por pessoa?
- Pista: Eurostat `sdg_08_10` (real GDP per capita) ou `nama_10_pc`; a linha existente do sítio é `pib-real-per-capita-2025.yml` (lê o `source_url`). Publicador primário das contas nacionais: INE; o Eurostat redissemina.
- Comparação a confirmar: posição entre os 27; o passado do país (desde quando a série).

### E2 · Saldo das administrações públicas (capacidade/necessidade líquida de financiamento, B.9), em % do PIB
- Pergunta: as contas públicas estão em equilíbrio?
- Pista: Eurostat `gov_10dd_edpt1` (unit `PC_GDP`, sector `S13`, na_item `B9`); o primário é a notificação do Procedimento dos Défices Excessivos, que o INE publica (procura no INE «Procedimento dos Défices Excessivos», a notificação de abril e de setembro/outubro).
- Comparação a confirmar: o limiar de 3 % do PIB do Protocolo n.º 12 anexo aos Tratados (confirma a fonte do limiar; o Eurostat ou a Comissão citam-no); o passado.

### E3 · Dívida bruta das administrações públicas, em % do PIB
- Pergunta: quanto deve o Estado?
- Pista: Eurostat `gov_10dd_edpt1` (na_item `GD`); a linha existente é `divida-publica-2025.yml`. Limiar de 60 % (PDM e Protocolo n.º 12).

### E4 · Crescimento da despesa líquida contra a taxa máxima recomendada (a regra orçamental europeia)
- Pergunta: o Estado gasta dentro da regra europeia?
- Pista: Conselho das Finanças Públicas, parecer ou relatório sobre o Relatório Anual de Progresso (o mapa de cobertura de 18.08 cita `https://www.cfp.pt/uploads/publicacoes_ficheiros/cfp_parecer-2026-02-rap26.pdf`); a taxa máxima está na recomendação do Conselho da UE sobre o plano orçamental-estrutural de Portugal (procura no sítio do Conselho ou da Comissão). Regista quem publica a trajetória e quem publica a observação; se a Comissão já publicou a sua leitura de 2025, regista-a.
- Comparação: o limiar publicado (a taxa máxima).

### E5 · Dívida total dos municípios e limite legal (artigo 52.º da Lei n.º 73/2013), por concelho
- Pergunta: quanto deve a minha câmara, e qual é o limite?
- Pista: DGAL, Portal Autárquico, ficheiro anual «Endividamento» (o sítio já publica as 308 linhas; lê uma, por exemplo `ledger/claims/evora-divida-*.yml`, para o endereço). Confirma a página do publicador, a periodicidade real (um ficheiro por ano, publicado quando?), se há calendário (provavelmente «sem calendário publicado»), a licença ou termos do Portal Autárquico, e a definição impressa das colunas.
- Comparação: o limite legal por município (limiar publicado); o passado do concelho (desde quando há ficheiros); o país (a contagem do CFP de municípios acima do limite, `https://www.cfp.pt/uploads/publicacoes_ficheiros/sumario-executivo-06-2026.pdf` ou o relatório anual da administração local).

### T1 · Taxa de emprego dos 20 aos 64 anos
- Pergunta: quantas pessoas trabalham?
- Pista: Eurostat `lfsi_emp_a` ou `tesem010`; a linha existente `taxa-de-emprego-2025.yml`. Primário: INE, Inquérito ao Emprego.
- Comparação: a meta de 78 % em 2030 do Plano de Ação do Pilar Europeu dos Direitos Sociais (confirma o texto e o endereço da Comissão); os 27; o passado.

### T2 · Taxa de desemprego (15 a 74 anos) no país, e desemprego registado por concelho
- Pergunta: quantas pessoas procuram trabalho e não encontram?
- Duas medidas na mesma linha, diz as duas: (a) Eurostat `une_rt_a` (a linha existente `taxa-de-desemprego-2025.yml`; primário INE, Inquérito ao Emprego); (b) IEFP, «Estatísticas mensais por concelhos» (ficheiro ODS/XLS mensal, continente, 278 concelhos; `https://www.iefp.pt/estatisticas`), e para as ilhas a DRQPE (Açores, `emprego.azores.gov.pt`, índice atrás do Cloudflare) e o IEM (Madeira). Confirma o dia do mês em que o IEFP publica (há calendário?), a definição de «desemprego registado» nos «Conceitos e Definições» do IEFP, a licença do IEFP, e que os dois números (inquérito e registo) não são a mesma coisa (regista a advertência como o publicador a escreve, se a escrever).
- Comparação: os 27 (taxa); o passado; por concelho contra o país e contra o passado do concelho (desde quando há ficheiros mensais).

### T3 · Ganho médio mensal dos trabalhadores por conta de outrem (€), por concelho
- Pergunta: quanto se ganha?
- Pista: INE, a partir dos Quadros de Pessoal (GEP/MTSSS); código provável `0012656` (confirma na metainformação e no catálogo). Ano de referência t publicado quando? Nível concelho?
- Comparação: o país; o passado do concelho; a retribuição mínima (T5) como referência publicada.

### T4 · Disparidade no ganho médio mensal entre sexos (%), por concelho; e a disparidade salarial não ajustada entre homens e mulheres no país
- Pergunta: as mulheres ganham o mesmo?
- Pista: INE `0012661` (Quadros de Pessoal, concelho) e Eurostat `earn_gr_gpgr2` (gender pay gap in unadjusted form, primário INE ou o Eurostat a partir do Inquérito aos Ganhos). Regista que são medidas diferentes (base, população) e copia as definições das duas. A casa já publica a disparidade de EMPREGO entre sexos (`disparidade-de-emprego-entre-sexos-2025.yml`), que é outra coisa; diz a diferença.

### T5 · Retribuição mínima mensal garantida (RMMG)
- Pergunta: qual é o salário mínimo em vigor?
- Pista: o decreto-lei anual que a fixa, lido no Diário da República (para 2026, procura o decreto-lei publicado em dezembro de 2025; o mapa de cobertura cita o Decreto-Lei n.º 139/2025 e 920,00 €: confirma no texto do diploma, artigo e valor); a página da DGERT; o Eurostat `earn_mw_cur` para a comparação europeia (regista que o Eurostat converte para doze meses).
- Comparação: os 27 (na base do Eurostat); o passado (a série dos diplomas).
