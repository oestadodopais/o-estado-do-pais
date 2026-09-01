# Lote 2 · População (P) e Migração (M) · 11 linhas

*Lê primeiro `BRIEF-comum.md` nesta pasta. Pasta de saída: esta. Ficheiros: `lote-2.md` e `lote-2.json`. Modelo: Claude Opus 5. As pistas abaixo são pistas de pesquisa, não afirmações: confirma cada uma na fonte e corrige o que estiver mal. INE sempre em série, com 2 segundos entre pedidos.*

## Contexto útil

O sítio publica a população residente dos 308 concelhos (linhas `~/Instruments/OEstadoDoPais/ledger/claims/<concelho>-populacao-2025.yml`; lê uma). Está aberta uma questão, I99: essas linhas citam o indicador 0012918 do INE no documento e no `source_url`, e o extrato alojado é do indicador 0012917; há dois indicadores da população residente e a linha não diz de qual saiu o valor. Na linha P1 lê a metainformação dos dois e diz em que diferem (designação, nomenclatura territorial, períodos), sem corrigir nada no sítio.

A migração é o domínio de maior procura e o que mais precisa de fonte séria. Regra da casa: um observatório (o Observatório das Migrações, hoje na AIMA, `om.aima.gov.pt`; o Observatório da Emigração, DGACCP com o CIES/ISCTE, `observatorioemigracao.pt`) é quase sempre segundo publicador; o livro-razão cita o primário; um observatório só é fonte onde for ele o compilador primário. E dizer «não há número público para isto» é conteúdo de observatório: se uma medida não existe como série oficial, regista-o com as pistas seguidas.

## As linhas

### P1 · População residente (N.º), por concelho
- Pergunta: quantos somos, e para onde vamos?
- Pista: INE, Estimativas anuais da população residente; códigos `0012918` e `0012917` (lê a metainformação dos dois: `pindicaMeta.jsp?varcd=...`). Confirma a periodicidade, o último período, a data de publicação de 2026 (as estimativas de 2025 saíram quando?), o nível geográfico, o calendário de difusão do INE para a próxima edição, e a licença.
- Comparação: o passado do concelho; o país.

### P2 · Índice de envelhecimento (N.º), por concelho
- Pergunta: envelhecemos?
- Pista: INE `0012909`, Estimativas anuais da população residente. Copia a definição do INE (idosos por 100 jovens).

### P3 · Saldo natural (N.º), por concelho
- Pergunta: nascem mais pessoas do que morrem?
- Pista: INE `0013339`, Indicadores demográficos. O mapa de cobertura de 18.08 avisa que há dois indicadores de «saldo natural» e que o mais recente devolve fragmentos por tipologia urbana e sem total: confirma qual dá o total por concelho e regista a armadilha.

### P4 · Taxa de crescimento efetivo (%), por concelho
- Pergunta: o concelho cresce ou encolhe?
- Pista: INE `0013178`, Indicadores demográficos.

### P5 · Idade mediana da população
- Pergunta: que idade tem o país?
- Pista: Eurostat `demo_pjanind` (indic_de `MEDAGEPOP`); primário INE. Comparação: os 27; o passado.

### M1 · Cidadãos estrangeiros residentes em Portugal (stock a 31 de dezembro)
- Pergunta: quantos estrangeiros residem em Portugal?
- Pista: AIMA, «Relatório de Migrações e Asilo» anual (o de 2024 em `https://aima.gov.pt/media/pages/documents/fec4d6a712-1760603125/relatorio-migracoes-e-asilo-2024.pdf`, segundo o mapa de cobertura; confirma e vê se já existe o de 2025). Copia a definição do stock (títulos de residência válidos? população residente?), o total, a data de publicação, e se o relatório desagrega por distrito ou concelho. Regista também as autorizações de residência concedidas no ano (o fluxo), se o relatório as der.
- Comparação: o passado (desde quando a AIMA/SEF publica o relatório e se a série é comparável através da transição do SEF para a AIMA).

### M2 · População estrangeira com estatuto legal de residente (N.º), por concelho
- Pergunta: a mesma, ao nível do concelho, e com a segunda contagem oficial.
- Pista: INE, a partir de dados administrativos da AIMA (antes SEF); encontra o código no catálogo do INE. O mapa de cobertura diz que a série municipal parou em 2023 na transição para a AIMA: confirma o último período disponível e o que o INE diz sobre isso. Regista a diferença entre esta contagem e a da AIMA (M1) para o mesmo ano, tal como o Observatório das Migrações a explica em `https://om.aima.gov.pt/wp-content/uploads/2025/10/Indicadores-Migratorios-em-Portugal_Analise-Comparativa-entre-a-AIMA-e-o-INE.pdf` (se o ficheiro existir; é análise, não fonte).

### M3 · Saldo migratório (N.º), por concelho; e a taxa bruta de migração líquida no país
- Pergunta: quantos entram e quantos saem?
- Pista: INE `0013179` (Indicadores demográficos, concelho) e Eurostat `demo_gind` (indic_de `CNMIGRATRT`, crude rate of net migration plus statistical adjustment). Copia as duas definições e diz o que o «ajustamento estatístico» inclui.
- Comparação: os 27 (taxa); o passado do concelho.

### M4 · Emigrantes permanentes (N.º)
- Pergunta: quantos portugueses saem?
- Pista: INE, Estimativas anuais de emigração (procura no catálogo «emigrantes permanentes» e «emigrantes temporários»; copia as definições). Regista o que o Observatório da Emigração publica (compila estatísticas dos países de destino) e de onde, como referência e não como fonte, a menos que seja o único a publicar alguma das medidas.
- Comparação: o passado (desde quando).

### M5 · Requerentes de asilo pela primeira vez
- Pergunta: quantas pessoas pedem proteção em Portugal?
- Pista: Eurostat `migr_asyappctza` (first-time asylum applicants; primário AIMA, antes SEF); o «Relatório de Migrações e Asilo» da AIMA para o número nacional. Regista se os dois coincidem para o mesmo ano.
- Comparação: os 27; o passado.

### M6 · O balanço entre contribuições e prestações dos estrangeiros na Segurança Social
- Pergunta: quanto contribuem os imigrantes para a Segurança Social, e quanto recebem?
- Isto é a linha que mais provavelmente **não existe como série primária**. Pistas: o Observatório das Migrações publica um «Relatório Estatístico Anual: Indicadores de Integração de Imigrantes» com um capítulo sobre a Segurança Social (contribuições e prestações de estrangeiros), com dados que o Instituto de Informática ou o Instituto da Segurança Social lhe fornecem; procura a edição mais recente em `om.aima.gov.pt`, copia a definição, o período, os valores e a frase em que diz de onde vêm os dados. Depois procura se o Instituto da Segurança Social, o Instituto de Informática (`seg-social.pt`, «Estatísticas») ou o IGFSS (Conta da Segurança Social) publicam eles próprios alguma série por nacionalidade. Conclui: quem é o compilador primário deste número, com que periodicidade, e o que não existe. Se o OM for o único publicador, ele é aqui a fonte, e diz-se.
- Comparação: só a que o publicador permitir (o passado da própria série).
