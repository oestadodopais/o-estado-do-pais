# 1. Os achados que os dados do projeto já sustentam hoje

Esperar pelas séries para tornar o sítio útil seria prolongar o problema. A frase do registo de direção segundo a qual nenhum desenho honesto existe sem séries é falsa: uma comparação entre Portugal e a União, uma distribuição territorial ou a diferença entre grupos podem ser mostradas com observações de um mesmo período. As séries fazem falta para descrever trajetórias. Não são condição para publicar os achados abaixo.

Este memorando distingue achados sustentados pelas linhas lidas, propostas de apresentação e trabalho que ainda exige dados. A ordem é uma escolha editorial de utilidade para o leitor, não uma classificação estatística. As avaliações fornecidas orientam o diagnóstico; os seus números não são usados como prova. Os identificadores junto dos valores remetem para os ficheiros homónimos em `~/Instruments/OEstadoDoPais/ledger/claims/`, lidos sem alteração. A consulta do livro não equivale a uma nova conferência independente de cada fonte original.

Nos esboços, os campos entre chavetas recebem os valores e os recibos indicados no respetivo achado. Os desenhos são plantas de composição, não gráficos quantitativos já renderizados. As larguras pedidas, a numeração das secções e as constantes dos métodos são especificações, não observações sobre o país. Todos os gráficos propostos têm alternativa em tabela, rótulos visíveis e acesso por teclado. Usam preto, cinzento, formas e texto; a cor fica reservada aos valores de referência publicados. Nenhuma diferença ou razão nova é impressa como número antes de ter linha derivada selada.

**A. O que está a encarecer mais nas despesas correntes?**

**Achado.** Em agosto de 2026, face ao mesmo mês do ano anterior, os combustíveis e lubrificantes para transporte pessoal subiram **23,78 %** (`ipc-combustiveis-variacao-homologa`), as rendas efetivamente pagas **5,22 %** (`ipc-rendas-variacao-homologa`), os alimentos e bebidas não alcoólicas **2,14 %** (`ipc-alimentacao-variacao-homologa`) e a energia em casa **1,36 %** (`ipc-energia-em-casa-variacao-homologa`), enquanto o IPC total subiu **3,30 %** (`ipc-variacao-homologa`).

**Comparação e significado.** As linhas usam Portugal, o mesmo mês, a mesma variação homóloga e componentes do IPC do INE. As categorias são diferentes por intenção: comparam-se ritmos de encarecimento, não preços em euros nem o consumo da mesma família. O total deve surgir separado dos componentes, porque os inclui. Para quem depende do carro, a média de todos os preços pode esconder uma pressão muito diferente.

**Desenho.** Barras horizontais com origem comum e a mesma escala. Ordenação por valor, sem encurtar a barra dos combustíveis para fazer caber as restantes.

```text
390 px
[O que está a encarecer mais?]
[Agosto | face ao mesmo mês anterior]
Combustíveis  [barra] {valor e recibo}
Rendas        [barra] {valor e recibo}
Alimentação   [barra] {valor e recibo}
Energia casa  [barra] {valor e recibo}
[separador: conjunto do cabaz]
IPC total     [barra] {valor e recibo}
[O que isto diz sobre a minha despesa?]

1 280 px
[Pergunta e frase] | [barras com nomes completos]
[Ressalva]         | [total separado, mesma escala]
[Ver dados, definição e fontes]
```

**Ressalva.** Não é a inflação de cada pessoa, não mede a contribuição de cada componente para o total e não permite calcular quanto custa encher o depósito. Uma taxa elevada também pode refletir uma base de comparação baixa. Estas linhas não identificam a causa.

**B. A média da habitação descreve quem arrenda?**

**Achado.** No inquérito de 2025, a sobrecarga da habitação em Portugal era **6,3 %** no conjunto da população (`sobrecarga-do-custo-da-habitacao-2025`), abaixo dos **7,7 %** da União (`sobrecarga-do-custo-da-habitacao-2025-ue`), mas entre os inquilinos a preço de mercado era **27,2 %** (`sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025`), acima dos **18,6 %** europeus (`sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025-ue`).

**Comparação e significado.** Há duas comparações honestas: população total portuguesa com população total europeia; inquilinos portugueses com inquilinos europeus. Não há uma comparação direta entre populações iguais quando se passa do total aos inquilinos. Por isso, apresentam-se painéis distintos, sem dividir as taxas ou subtrair grupos. O achado é a inversão da posição face à referência quando se escolhe a situação de habitação relevante para o leitor.

O Eurostat define sobrecarga como despesas de habitação superiores a **40 %** do rendimento disponível, descontando os apoios à habitação de ambos os lados da conta. Não significa gastar essa percentagem apenas em renda. [Comissão Europeia, definição do indicador Eurostat `tespm140`, consultada em 28.09.2026](https://employment-social-affairs.ec.europa.eu/document/download/a424524e-40a5-4036-9f13-85160612b902_en?filename=SWD%282025%2995_0.pdf).

```text
390 px
[A média descreve quem arrenda?]
TODAS AS SITUAÇÕES
Portugal [barra] {valor e recibo}
União    [barra] {valor e recibo}
INQUILINOS A PREÇO DE MERCADO
Portugal [barra] {valor e recibo}
União    [barra] {valor e recibo}
[O segundo grupo está dentro do total]

1 280 px
[Pergunta e frase sobre a inversão]
[Todas as situações: PT / UE] | [Inquilinos: PT / UE]
[mesma escala; denominador escrito em cada painel]
[Definição | ressalva | recibos]
```

**Ressalva.** Não compara inquilinos com proprietários, pois não há aqui uma linha isolada destes últimos. A composição dos regimes de ocupação varia entre países. O ano do EU-SILC identifica o inquérito; o rendimento reporta ao ano anterior, segundo os [metadados do Eurostat, consultados em 28.09.2026](https://ec.europa.eu/eurostat/cache/metadata/en/ilc_sieusilc.htm). Não se deve ler o painel como uma medição deste mês.

**C. O salário médio subiu? E isso chega para comprar mais?**

**Achado.** A remuneração bruta mensal média passou de **1 746 €** no segundo trimestre de 2025 (`remuneracao-bruta-mensal-media-periodo-anterior`) para **1 835 €**, provisórios, no segundo trimestre de 2026 (`remuneracao-bruta-mensal-media`), mas estas linhas não demonstram uma subida do poder de compra.

**Comparação e significado.** Mesmo indicador do INE, mesmos filtros totais, mesmo trimestre do calendário em anos consecutivos, mesma unidade. A periodicidade trimestral foi também confirmada nos [metadados oficiais, consultados em 28.09.2026](https://www.ine.pt/ine/json_indicador/pindicaMeta.jsp?varcd=0014751&lang=PT), embora as categorias temporais da API usem nomes de meses. A comparação nominal é válida. Não se junta a inflação de agosto a uma remuneração trimestral. A pessoa fica a saber que a média antes de descontos aumentou, e também porque isso não responde ainda à pergunta sobre o que pode comprar.

```text
390 px
[O salário médio subiu em euros]
Trimestre homólogo anterior
[barra] {valor e recibo}
Trimestre mais recente, provisório
[barra] {valor e recibo}
[Compra mais? Ainda não apurado]

1 280 px
[Pergunta e resposta nominal] | [barras com origem comum]
[Média, antes de descontos]   | [períodos completos]
[O que falta: preços do mesmo trimestre]
```

**Ressalva.** Não é salário líquido, mediana nem aumento recebido por quem manteve o mesmo emprego. A entrada e saída de trabalhadores e a composição dos empregos podem alterar a média. Não se calcula uma diferença monetária ou taxa de crescimento nova neste memorando.

**D. Os preços de compra das casas subiram ao ritmo europeu?**

**Achado.** Em 2025, a variação anual média dos preços da habitação foi **17,6 %** em Portugal (`precos-da-habitacao-2025`) e **5,5 %** na União (`precos-da-habitacao-2025-ue`); a observação portuguesa do ano anterior era **9,1 %** (`precos-da-habitacao-2024`).

**Comparação e significado.** Mesmo conjunto `tipsho20`, unidade `RCH_A_AVG`, preços nominais e ano comum para Portugal e União. O ano anterior é um segundo contraste temporal, explicitamente separado. Os preços de compra aumentaram a um ritmo superior ao agregado europeu. Isto interessa a quem procura comprar, mas ainda não mede acessibilidade em relação ao rendimento.

```text
390 px
[Comprar casa: como mudaram os preços?]
ANO COMUM
Portugal [barra] {valor e recibo}
União    [barra] {valor e recibo}
[Portugal no ano anterior: observação]
[Não é o preço de uma casa concreta]

1 280 px
[Frase principal] | [PT e UE, barras na mesma escala]
[Contexto]        | [ano anterior num painel separado]
[Definição da variação | dados | recibos]
```

**Ressalva.** Não é uma mediana de preços, um valor por área, uma renda, nem a valorização de todas as casas. Não se desenha uma curva com as observações disponíveis. A leitura de um limiar macroeconómico exige manter a definição oficial, tratada na secção seguinte.

**E. Há pessoas que precisam de cuidados médicos e não os conseguem obter?**

**Achado.** A percentagem publicada de necessidades médicas por satisfazer foi **2,5 %** em Portugal em 2025 (`necessidades-medicas-nao-satisfeitas-2025`), o mesmo valor arredondado de **2,5 %** no ano anterior (`necessidades-medicas-nao-satisfeitas-2024`), perante **2,4 %** na União (`necessidades-medicas-nao-satisfeitas-2025-ue`).

**Comparação e significado.** Mesmo indicador `tespm110`, ambos os sexos e ano comum no contraste europeu. Trata-se de pessoas que declaram não ter obtido cuidados por custo, espera ou distância. A população abrange quem tem **16 anos ou mais**, residente em agregados privados; o período perguntado são os **doze meses anteriores**. [Comissão Europeia, definição de `tespm110`, anexo sobre indicadores sociais, consultado em 28.09.2026](https://employment-social-affairs.ec.europa.eu/document/download/a424524e-40a5-4036-9f13-85160612b902_en?filename=SWD%282025%2995_0.pdf).

```text
390 px
[Precisou de cuidados e não os obteve]
Portugal, ano comum [barra] {valor}
União, ano comum   [barra] {valor}
[Portugal anterior: mesmo valor publicado]
[O que conta: custo, espera, distância]
[recibos | o que fica de fora]

1 280 px
[Pergunta e leitura] | [PT / UE, escala com origem zero]
[Limite da medida]   | [anterior separado e identificado]
[Não permite avaliar todo o sistema de saúde]
```

**Ressalva.** A pequena diferença publicada não prova uma diferença estatisticamente significativa. A igualdade após arredondamento não prova imobilidade. Não mede pessoas sem médico de família, todas as listas de espera ou cuidados dentários. As expectativas e os questionários podem afetar comparações internacionais, como adverte o [Eurostat, consultado em 28.09.2026](https://ec.europa.eu/eurostat/cache/metadata/en/sdg_03_60_esmsip2.htm).

**F. Menos risco de pobreza significa também menos desigualdade?**

**Achado.** Em 2025, Portugal tinha **18,6 %** de população em risco de pobreza ou exclusão (`risco-de-pobreza-ou-exclusao-2025`), abaixo dos **20,9 %** da União (`risco-de-pobreza-ou-exclusao-2025-ue`), mas o rácio de rendimento entre o quinto com mais e o quinto com menos rendimento era **4,86** (`racio-s80-s20-2025`), acima dos **4,62** europeus (`racio-s80-s20-2025-ue`).

**Comparação e significado.** Cada medida é comparada apenas com a sua equivalente europeia. Uma é uma percentagem de pessoas em situações de risco; a outra é uma relação entre rendimentos. Não se somam, não partilham eixo e não compõem uma pontuação. A posição abaixo da União numa medida não garante a mesma posição na outra.

```text
390 px
[Pobreza e desigualdade não são a mesma coisa]
RISCO DE POBREZA OU EXCLUSÃO
[PT / UE: barras e percentagens]
DESIGUALDADE DE RENDIMENTO
[PT / UE: pontos e rácio]
[O que cada medida permite dizer]

1 280 px
[Frase sobre as posições diferentes]
[Risco: PT / UE, %] | [Desigualdade: PT / UE, rácio]
[Escalas distintas, unidades grandes, recibos]
```

**Ressalva.** Os limiares de pobreza dependem do rendimento de cada país, pelo que não medem um mesmo nível de vida material em euros. A desigualdade refere-se ao rendimento disponível ajustado à composição do agregado, não a salários individuais. O ano do rendimento e o do inquérito não são o mesmo. [Eurostat, definição do rácio, consultada em 28.09.2026](https://ec.europa.eu/eurostat/cache/metadata/en/sdg_10_41_esmsip2.htm).

**G. Uma subida mais lenta das rendas quer dizer que as rendas baixaram?**

**Achado.** As rendas efetivamente pagas apresentavam uma subida homóloga de **5,22 %** em agosto de 2026 (`ipc-rendas-variacao-homologa`), depois de **5,26 %** em julho (`ipc-rendas-variacao-homologa-periodo-anterior`): o ritmo homólogo abrandou, mas ambas as observações dizem preços acima do respetivo mês do ano anterior.

**Comparação e significado.** Mesmo indicador, componente, território e unidade; mudam os meses e, com eles, os meses de comparação. É uma comparação entre taxas homólogas. Não é a variação de agosto relativamente a julho. O achado ensina a ler uma notícia económica sem confundir abrandamento com descida.

```text
390 px
[As rendas baixaram? Não é isso que a taxa diz]
Julho:  [barra] {taxa e recibo}
Agosto: [barra] {taxa e recibo}
[Ambas face ao respetivo mês do ano anterior]

1 280 px
[Pergunta e resposta] | [barras quase iguais, mesma escala]
[Como ler a taxa]    | [rótulos exatos, sem ampliar a diferença]
```

**Ressalva.** Não representa apenas novos contratos, anúncios de arrendamento ou a atualização legal da renda de um contrato. Também não permite concluir que o encargo de uma família diminuiu.

**H. Estar na média do desemprego significa ter o mesmo problema?**

**Achado.** Em 2025, a taxa de desemprego portuguesa de **6 %** (`taxa-de-desemprego-2025`) coincidia com os **6,0 %** da União (`taxa-de-desemprego-2025-ue`), mas a taxa de desemprego de longa duração era **2,2 %** em Portugal (`desemprego-de-longa-duracao-2025`) e **1,9 %** na União (`desemprego-de-longa-duracao-2025-ue`).

**Comparação e significado.** O contraste total usa o mesmo recorte etário e a mesma percentagem da população ativa; o contraste de longa duração usa a mesma série `tesem130` nos dois territórios. Publicam-se comparações dentro de cada indicador. Não se calcula a quota de longa duração dentro do desemprego total sem confirmar todos os recortes e criar uma linha derivada. A igualdade do total não elimina diferenças na persistência do desemprego.

```text
390 px
[O mesmo desemprego, a mesma situação?]
TOTAL: [PT / UE, valores alinhados]
LONGA DURAÇÃO: [PT / UE, valores alinhados]
[Cada taxa usa população ativa]
[definições e recibos]

1 280 px
[Pergunta] | [Total: PT / UE] | [Longa duração: PT / UE]
[Não empilhar: o segundo fenómeno integra o primeiro]
```

**Ressalva.** Não são taxas sobre toda a população nem sobre inscritos nos centros de emprego. Estes agregados não acompanham as mesmas pessoas ao longo do tempo. «Mais persistente» como diagnóstico causal ou de duração individual exigiria outro desenho; aqui só se descrevem as taxas publicadas.

**I. A participação em creches está acima da europeia e continua a subir?**

**Achado.** A participação em cuidados formais de crianças com menos de três anos foi **57,9 %** em Portugal em 2025 (`criancas-em-creche-2025`), acima dos **40,5 %** europeus (`criancas-em-creche-2025-ue`), mas abaixo dos **59,4 %** portugueses do ano anterior (`criancas-em-creche-2024`).

**Comparação e significado.** Mesmo indicador `tepsr_sp210` e população etária, comparando primeiro o ano comum e depois a observação portuguesa anterior. A posição face à União e a mudança face ao passado respondem a perguntas diferentes. Para uma família, este é um retrato da utilização observada, não uma promessa de vaga.

```text
390 px
[Acima da União, abaixo do ano anterior]
ANO COMUM: [Portugal / União]
PORTUGAL:  [anterior / atual]
[barras, valores, recibos]
[Participação não é disponibilidade de vagas]

1 280 px
[Pergunta] | [Comparação europeia] | [Comparação temporal]
[mesma unidade e escala; períodos explícitos]
```

**Ressalva.** A medida abrange cuidados formais, não apenas estabelecimentos chamados creches. Não informa sobre horários, custo, qualidade, pedidos recusados ou procura não satisfeita. A descida da estimativa não prova que tenham fechado vagas.

**J. A dívida pública diminuiu ou mudou apenas o número publicado?**

**Achado.** Na notificação provisória do INE de setembro, a dívida pública passou de **93,0 % do PIB** em 2024 (`divida-publica-2024-notificacao-ine-2026-09`) para **89,2 %** em 2025 (`divida-publica-2025-notificacao-ine-2026-09`); no quadro anterior do Eurostat, Portugal tinha **89,7 %** em 2025 (`divida-publica-2025`), perante **81,7 %** na União (`divida-publica-2025-ue`).

**Comparação e significado.** A comparação temporal usa os dois anos da mesma notificação do INE. A comparação europeia usa as linhas do quadro Eurostat. São painéis de edições diferentes, identificadas como tal. Assim o leitor distingue a descida entre anos da revisão de uma observação sobre o mesmo ano.

```text
390 px
[Dívida: evolução e revisão são coisas diferentes]
INE, NOTIFICAÇÃO PROVISÓRIA
[ano anterior / ano seguinte, % do PIB]
EUROSTAT, QUADRO ANTERIOR
[Portugal / União, mesmo ano]
[datas de edição e recibos]

1 280 px
[Evolução na edição INE] | [PT / UE na edição Eurostat]
[Separador visível: não misturar as edições]
```

**Ressalva.** A queda do rácio não demonstra uma redução da dívida em euros, dos juros pagos ou dos impostos futuros. Um PIB maior também altera o rácio. Não ligar graficamente o valor Eurostat ao valor INE como se fossem momentos sucessivos da economia.

**K. Um ganho médio nacional descreve o trabalho em qualquer concelho?**

**Achado.** Em 2024, o ganho médio mensal publicado era **1 385,5 €** em Bragança (`braganca-ganho-medio-mensal-2024`), **2 120,9 €** em Lisboa (`lisboa-ganho-medio-mensal-2024`) e **1 576,0 €** no país (`ganho-medio-mensal-2024`).

**Comparação e significado.** As linhas vêm do mesmo indicador do INE, com origem nos Quadros de Pessoal do GEP, e referem-se a trabalhadores por conta de outrem a tempo completo com remuneração completa. Mesmo ano e unidade. O exemplo demonstra variação territorial; não apresenta estes concelhos como pares nem como extremos nacionais.

```text
390 px
[O ganho médio varia entre lugares]
Bragança [barra] {valor e recibo}
Lisboa   [barra] {valor e recibo}
Portugal [referência e recibo]
[Quem entra nesta média?]

1 280 px
[Pergunta e limites] | [barras e referência nacional]
[Escolher concelho]  | [definição do universo coberto]
```

**Ressalva.** Não é o rendimento de todos os residentes, nem o salário que uma pessoa encontrará ao mudar de concelho. Setores, profissões e horários extraordinários afetam a média. A definição geográfica por estabelecimento ou residência precisa de confirmação específica nos metadados antes de escrever uma explicação sobre deslocações pendulares: `[verify]`. Não usar a remuneração trimestral do achado C como continuação desta medida anual.

**L. Regiões vizinhas produzem o mesmo por habitante?**

**Achado.** Em 2024, o índice do PIB por habitante em paridades de poder de compra era **129** na Grande Lisboa (`pib-pc-grande-lisboa-2024`) e **55** na Península de Setúbal (`pib-pc-peninsula-de-setubal-2024`), na escala **UE = 100** publicada nessas linhas, com uma distância selada de **74 pontos de índice** (`distancia-setubal-grande-lisboa-2024`).

**Comparação e significado.** Mesmo conjunto `nama_10r_2gdp`, ano, nível territorial, classificação e unidade `PPS_HAB_EU27_2020`. A distância já tem aritmética declarada no livro: subtrai a linha de Setúbal à da Grande Lisboa. Não se cria aqui uma nova conta. O desenho torna visível uma diferença na localização da produção por habitante.

```text
390 px
[Regiões vizinhas, produção diferente]
[Península de Setúbal: ponto e valor]
[referência europeia publicada]
[Grande Lisboa: ponto e valor]
[distância: valor derivado e recibo]
[Ambos provisórios]

1 280 px
[Pergunta] | [régua horizontal com regiões e UE]
[O que mede o PIB] | [distância entre pontos, fonte]
[Sem mapa de riqueza dos residentes]
```

**Ressalva.** Ambos os valores são provisórios. PIB é produção localizada, não rendimento disponível dos residentes. Deslocações para trabalhar podem contribuir para a diferença, mas estas linhas não medem essa contribuição. O retrato de um ano não demonstra convergência ou divergência regional.

# 2. A União como régua

O agregado europeu é uma referência, não uma meta. A sua posição no meio de um desenho não o transforma no valor desejável. Também não se deve obter a «média da União» fazendo a média simples dos países: usar `EU27_2020`, com a agregação própria de cada indicador. Uma mediana entre países responderia a outra pergunta e exigiria uma derivação selada.

**Quando a média basta e quando abrir a distribuição.**

| Pergunta | Primeira leitura | O que acrescentam os extremos e os restantes países | O que pode significar «melhor» |
|---|---|---|---|
| Os preços aumentam mais depressa cá? | Portugal e União no mesmo IHPC e mês. | Mostram se Portugal está perto do conjunto ou num extremo da distribuição. | Não chamar «melhor» à inflação mais baixa sem critério oficial aplicável; deflação também não é um prémio. |
| A pressão da habitação é invulgar? | Portugal e União, dentro do mesmo regime de ocupação. | São essenciais para distinguir uma posição muito afastada de uma diferença comum. | Menor incidência da sobrecarga definida pela fonte, sem transformar isso em «melhor mercado de habitação». Usar «mais baixa» e «mais alta». |
| Conseguimos obter cuidados médicos? | Portugal, União e leitura da definição. | Mostram a amplitude das taxas reportadas e suscitam perguntas sobre sistemas diferentes. | Menos necessidades por satisfazer é coerente com o objetivo oficial de acesso; o menor valor reportado não certifica o melhor sistema de saúde. |
| Como estão emprego, pobreza e desigualdade? | Média europeia em cada indicador, sem pontuação conjunta. | Revelam dispersão e permitem escolher países com interesse concreto para o leitor. | Cada indicador exige um critério próprio; não há um vencedor social universal. |
| Há sinal de desequilíbrio macroeconómico? | Valor português e limiar publicado; União como contexto secundário. | Localizam outros países perante o mesmo limiar, quando este se aplica de modo igual. | «Dentro» ou «fora do valor de referência». Estar mais longe do limiar na direção oposta não implica ser melhor. |
| Onde se situa a produção por habitante? | Referência em paridades de poder de compra. | Expõem a dispersão e os casos que distorcem uma leitura ingénua. | Maior produção por habitante; nunca «país mais rico para o cidadão» apenas com PIB. |

O [quadro da Comissão, consultado em 28.09.2026](https://economy-finance.ec.europa.eu/economic-governance-framework/macroeconomic-imbalance-procedure/scoreboard_en) publica, por exemplo, referências de **60 % do PIB** para dívida pública e **9 %** para a variação nominal anual dos preços da habitação. São limites indicativos de vigilância, não notas globais de desempenho. É aqui que a cor pode identificar a relação com uma referência, acompanhada por palavras. Nos indicadores sem referência aplicável, não há semáforo. Um intervalo aceitável também não pode ser reduzido à ideia de que o mínimo é sempre melhor.

**Dados a pedir, reutilizando os conjuntos já existentes.** Em cada caso, copiar os filtros da linha portuguesa, fixar o período comum e expandir a geografia. Confirmar as dimensões efetivamente devolvidas, porque alguns conjuntos sintéticos ocultam recortes no próprio nome. Os códigos abaixo foram lidos no inventário e nas linhas; não são nomes propostos para novas fontes.

| Conteúdo prioritário | Conjuntos do projeto | Recortes que não podem variar no pedido |
|---|---|---|
| Preços de consumo | `prc_hicp_minr` | `freq=M`, `unit=RCH_A`, `coicop18=TOTAL`, mês comum. Usar IHPC em ambos os lados, não IPC português contra IHPC europeu. |
| Sobrecarga da habitação | `tessi164`, `tespm140` | `tenure=RENT_MKT` no primeiro; total de sexos e população total no segundo; percentagem, mesmo ano de inquérito. |
| Compra e construção de habitação | `tipsho20`, `tipsho50` | Variação anual média nominal no primeiro; área licenciada por população no segundo. Não confundir licenças com casas concluídas. |
| Trabalho | `une_rt_a`, `tesem130`, `lfsi_emp_a`, `tipslm90`, `earn_gr_gpgr2` | Idades, sexo, unidade, conceito de emprego e universo empresarial. As taxas de emprego e desemprego não usam o mesmo denominador. |
| Rendimento e condições de vida | `tipslc10`, `tessi180`, `ilc_li01` | Definição de risco, total de sexos, rendimento equivalente e composição do agregado. O limiar de pobreza em euros não é um ranking de bem-estar. |
| Saúde e educação | `tespm110`, `tepsr_sp210`, `edat_lfse_14`, `tepsr_sp410` | População etária, sexo, participação e período, preservando a frequência própria das competências digitais. |
| Dívida e investimento | `tipsgo10`, `gov_10dd_edpt1`, `tipspd22`, `tipspd30`, `tipsna20`, `tipsst10` | Setor institucional, consolidação, percentagem do PIB, ano e edição de contas. |
| Produção regional e nacional | `nama_10r_2gdp`, `tipsna40` | Não trocar o índice em paridades de poder de compra do primeiro pelos euros em volumes encadeados do segundo. A extração nacional tem de selecionar países, sem misturar regiões. |
| Salário mínimo | `earn_mw_cur` | Semestre, moeda ou poder de compra, montante bruto e convenção de pagamentos. A existência de um código de país não garante um salário mínimo nacional observado. |

**Pedido realmente executado.** Em **28.09.2026, às 12:35:48 UTC**, fiz o seguinte pedido de disseminação do Eurostat, com os países explicitamente enumerados e o agregado europeu separado. A resposta foi HTTP **200**, com **27 países pedidos e 27 valores numéricos presentes**, sem país em falta, além do agregado. Trata-se de cobertura observada nesta resposta, não de uma promessa sobre os restantes conjuntos. [Resposta oficial do pedido][api27].

```text
https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/tessi164?format=JSON&lang=EN&freq=A&unit=PC&tenure=RENT_MKT&time=2025&geo=BE&geo=BG&geo=CZ&geo=DK&geo=DE&geo=EE&geo=IE&geo=EL&geo=ES&geo=FR&geo=HR&geo=IT&geo=CY&geo=LV&geo=LT&geo=LU&geo=HU&geo=MT&geo=NL&geo=AT&geo=PL&geo=PT&geo=RO&geo=SI&geo=SK&geo=FI&geo=SE&geo=EU27_2020
```

O controlo percorreu `dimension.geo.category.index` e procurou uma célula numérica em `value` para cada código pedido. Não confundiu a presença de uma etiqueta geográfica com a existência de uma observação. A resposta declara as dimensões `freq, unit, tenure, geo, time`, um único ano e regime de ocupação, e atualização do conjunto em `2026-09-17T23:00:00+0200`. Recibo técnico da leitura, SHA-256 do corpo recebido: `17819b74e16af9558d4b83fa2a46eeaf6f2dd17bce0f2a1344408a02a3ed9b9c`. O corpo não foi gravado fora desta pasta nem convertido em linhas do livro.

O pedido confirma **27,2 %** para Portugal (`sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025`) e **18,6 %** para a União (`sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025-ue`). Entre os países recebidos, a taxa mais baixa é a da Finlândia, **12,3 %** ([pedido oficial, 28.09.2026][api27]), e a mais alta é a da Roménia, **56,0 %** ([mesmo pedido e data][api27]). São extremos de uma medida sobre inquilinos a preço de mercado, não «o melhor» e «o pior país para viver».

O campo `status` traz `b` para Dinamarca e Luxemburgo e `p` para Lituânia. Preservar estas marcas de quebra de série e provisoriedade, conforme a [legenda oficial do Eurostat, lida em 28.09.2026](https://ec.europa.eu/eurostat/web/main/data/database?language=pt), verificar as notas nacionais antes de interpretar a comparação e não desenhar continuidade temporal através de uma quebra. A presença dos valores não elimina esta obrigação.

Para tornar a verificação de cobertura inspecionável dentro deste único ficheiro, ficam as células nacionais lidas. Todas são percentagens para o ano e regime do [pedido oficial acima, de 28.09.2026][api27]. Ainda não são novas linhas seladas do projeto.

| País | Valor e origem | País | Valor e origem | País | Valor e origem |
|---|---|---|---|---|---|
| Bélgica | [25,4 %][api27] | Bulgária | [31,7 %][api27] | Chéquia | [26,0 %][api27] |
| Dinamarca | [23,6 %][api27], `b` | Alemanha | [13,2 %][api27] | Estónia | [37,0 %][api27] |
| Irlanda | [24,0 %][api27] | Grécia | [26,0 %][api27] | Espanha | [26,8 %][api27] |
| França | [18,7 %][api27] | Croácia | [19,8 %][api27] | Itália | [22,3 %][api27] |
| Chipre | [13,4 %][api27] | Letónia | [18,1 %][api27] | Lituânia | [27,4 %][api27], `p` |
| Luxemburgo | [23,2 %][api27], `b` | Hungria | [38,4 %][api27] | Malta | [21,5 %][api27] |
| Países Baixos | [39,5 %][api27] | Áustria | [14,5 %][api27] | Polónia | [14,4 %][api27] |
| Portugal | [27,2 %][api27] | Roménia | [56,0 %][api27] | Eslovénia | [19,7 %][api27] |
| Eslováquia | [16,8 %][api27] | Finlândia | [12,3 %][api27] | Suécia | [18,4 %][api27] |

**Desenho de «onde Portugal fica».** Após selar as novas linhas, usar uma faixa de pontos com posição proporcional ao valor, todos os países visíveis, Portugal distinguido por forma e nome, União por um traço de referência. A União não é mais um país na distribuição. Empates ocupam a mesma posição horizontal, separados verticalmente, sem sugerir diferenças inexistentes. Extremos recebem nomes; os restantes abrem valor, definição, bandeiras e recibo ao toque ou por teclado. A ordem de um ranking não substitui a distância quantitativa.

```text
390 px
[Quanto pesa a casa para quem arrenda?]
[ano | regime | unidade]
[faixa de pontos com todos os países]
[Portugal: marcador com rótulo fixo]
[União: traço distinto e rótulo]
[Mais baixo: Finlândia | valor e fonte]
[Mais alto: Roménia    | valor e fonte]
[Mostrar tabela | notas de comparabilidade]

1 280 px
[Pergunta e conclusão]
[faixa larga, escala contínua, países distribuídos]
[rótulos fixos: extremo baixo | UE | PT | extremo alto]
[tabela por país ao lado, sem coluna de classificação]
[bandeiras e recibo da seleção]
```

**Armadilhas que ficam à vista.**

- **Luxemburgo e Irlanda.** No PIB, trabalhadores transfronteiriços podem produzir num território sem entrarem na população residente usada no denominador; multinacionais podem localizar produção e ativos sem que todo o rendimento fique com os residentes. O Eurostat assinala estes problemas. Não excluir os casos incómodos da escala, nem os chamar modelos de rendimento familiar. [Eurostat, nota sobre PIB regional, consultada em 28.09.2026](https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20250211-2).
- **Países em falta.** Escrever «países com dados neste período», com cobertura e nomes em falta. Não transportar o último valor de outro ano. Se se escolher um ano anterior comum, isso tem de mudar visivelmente o título de todo o painel.
- **Definições e anos.** Congelar uma observação comparável por país, incluindo frequência, idade, sexo, setor, unidade e classificação. O ano de inquérito não se transforma silenciosamente em ano de rendimento. Uma atualização nacional não substitui isoladamente uma célula de uma edição europeia anterior.
- **Provisoriedade e incerteza.** Mostrar as marcas ao lado do valor. Não inferir diferenças relevantes a partir de casas decimais nem diferenças significativas sem informação de precisão. A ausência de bandeira não certifica certeza.
- **Extremos e seleção.** Publicar todos os países elegíveis, não apenas Portugal e vizinhos escolhidos depois de visto o resultado. Um extremo pode refletir população pequena, estrutura económica ou cobertura, além do fenómeno em análise.

[api27]: https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/tessi164?format=JSON&lang=EN&freq=A&unit=PC&tenure=RENT_MKT&time=2025&geo=BE&geo=BG&geo=CZ&geo=DK&geo=DE&geo=EE&geo=IE&geo=EL&geo=ES&geo=FR&geo=HR&geo=IT&geo=CY&geo=LV&geo=LT&geo=LU&geo=HU&geo=MT&geo=NL&geo=AT&geo=PL&geo=PT&geo=RO&geo=SI&geo=SK&geo=FI&geo=SE&geo=EU27_2020

# 3. Os concelhos

Ter uma página para cada concelho não equivale a ter um retrato completo da vida local. As medidas atuais descrevem dimensões económicas, demográficas e financeiras; não sustentam um índice de qualidade de vida, uma taxa municipal de desemprego ou uma avaliação do presidente da câmara.

**O que cada medida permite.** As datas seguintes são as das linhas exemplificadas, não a data em que o leitor abre a página.

| Medida | Exemplo conferido no livro | Uso honesto e limite |
|---|---|---|
| População residente | Bragança, **38 309 pessoas**, 2025 (`braganca-populacao-2025`) | Mostrar a dimensão do lugar e selecionar pares. Usar como denominador apenas quando a data e o território correspondem ao numerador. Uma observação não permite dizer que o concelho ganha ou perde população. |
| Poder de compra por habitante | **94,90**, 2023, índice com **Portugal = 100** (`braganca-poder-de-compra-2023`) | Comparar o mesmo índice no mesmo ano. Já é uma medida relativa por habitante; não voltar a dividir pela população nem converter em rendimento mensal. |
| Ganho médio mensal | **1 385,5 €**, 2024 (`braganca-ganho-medio-mensal-2024`) | Comparar com a mesma medida noutros concelhos e com a linha nacional do achado K. Não confundir trabalhadores cobertos com todos os residentes. |
| Empresas | **7 052**, 2024 (`braganca-empresas-2024`) | Mostrar dimensão do tecido empresarial coberto. Por habitante exige população do mesmo ano e definição da localização das empresas. Não mede postos de trabalho nem estabelecimentos abertos ao público. |
| Desemprego registado | **1 335 pessoas**, dezembro de 2025 (`braganca-desemprego-registado-2025-12`) | Mostrar procura de emprego registada. Uma divisão por residentes seria densidade de inscrições, não taxa de desemprego. Verificar equivalência das fontes regionais antes de juntar continente e ilhas. |
| Dívida municipal | **2 692 465 €**, 2024 (`braganca-divida-dgal-2024`) | Comparar montantes apenas com contexto de dimensão e perímetro contabilístico. Não apresentar como dívida pessoal dos habitantes. |
| Índice de dívida | **7,5 %**, 2024 (`braganca-indice-de-divida-2024`) | Já é derivado e tem uma referência legal na sua definição. A fórmula usa a dívida, o limite DGAL (`braganca-limite-divida-dgal-2024`) e `indice-de-divida-limite-legal`. Não é uma percentagem de dívida sobre população. |
| Prazo médio de pagamento | **9 dias**, dezembro de 2025 (`braganca-prazo-medio-de-pagamento-2025-12`) | Comparar com o mesmo período DGAL e explicar que é uma medida agregada de pagamentos. Não promete que qualquer fatura seja paga nesse prazo. |

**Por habitante, sem fingir que o denominador já existe.** Para dívida e empresas, as linhas exemplificadas usam um ano anterior ao da população disponível. Não publicar o quociente desses anos misturados, mesmo que seja fácil calculá-lo. Recolher a população do ano e território compatíveis, definir se se usa população média ou de fim de ano de acordo com a medida e a fonte, e só depois criar as linhas derivadas:

```text
dívida por habitante = dívida municipal / população compatível
empresas por mil habitantes = empresas / população compatível × 1 000
inscritos por mil residentes = inscritos / população compatível × 1 000
```

O fator de escala destas fórmulas é uma convenção de apresentação. Não há aqui resultados calculados. Para inscrições em dezembro e população anual, a proximidade dos rótulos do ano não basta: confirmar a data de observação populacional e a residência dos inscritos antes de autorizar a conta, `[verify]`. O INE fornece a série populacional e adverte sobre mudanças metodológicas e geográficas nos [metadados consultados em 28.09.2026](https://www.ine.pt/ine/json_indicador/pindicaMeta.jsp?varcd=0012917&lang=PT).

**Pares, sem campeonato.** Proponho uma regra editorial fixa: concelhos cuja população esteja entre metade e o dobro da população do concelho escolhido, usando o mesmo ano populacional. A regra aparece no ecrã e é definida antes de olhar para o indicador a comparar. É uma escolha de método, não uma classe oficial. Permitir também ver todos os concelhos; não mudar automaticamente a regra até o resultado parecer interessante. Se houver poucos pares, dizê-lo.

O grupo por dimensão não controla turismo, dispersão territorial, estrutura etária, emprego público ou indústria. Por isso, o texto diz «concelhos de dimensão populacional próxima», não «concelhos equivalentes». Para medidas de outro ano, esta seleção é apenas contexto de dimensão recente, claramente datado; a comparação estatística dos valores continua a exigir um ano comum entre os concelhos. Uma análise histórica por pares exige também população histórica.

Mostrar pontos por valor, sem números de posição, pódios ou percentis por calcular. O concelho escolhido tem um marcador distinto; cada ponto dos pares abre o respetivo recibo. Se se desejar uma mediana ou um intervalo interquartil dos pares, esses resultados passam primeiro por linhas derivadas, com a lista de entradas e a regra de seleção. Uma média simples de ganhos municipais não substitui o ganho nacional, que exige os pesos corretos.

**O mapa deve transportar uma medida.** Começaria pelo índice de dívida, que dispõe de uma referência publicada, com estados escritos de posição perante o limite e uma textura própria para ausência. Para ganho, população ou empresas, usar símbolos proporcionais ou tons neutros com legenda quantitativa, sem juízos de qualidade. Nunca pintar montantes absolutos como se fossem intensidade. A área de um concelho não é a sua população; lista e pesquisa têm de acompanhar o mapa, incluindo as ilhas.

A linha `indice-de-divida-limite-legal` contém **150 %**, mas a sua fonte imediata é um anuário académico e profissional. Isso não satisfaz, sozinho, a regra de fonte oficial deste pedido. A [DGAL, consultada em 28.09.2026](https://portalautarquico.dgal.gov.pt/pt-PT/financas-locais/endividamento/municipios/limites/), publica a regra de **1,5 vezes** a média da receita corrente líquida dos **três exercícios anteriores**. Antes de reutilizar o índice como juízo legal, amarrar o parâmetro a essa fonte oficial e confirmar as exclusões e o perímetro usados na dívida DGAL. Isto é uma correção concreta de proveniência, não motivo para redesenhar toda a maquinaria.

```text
390 px
[Qual é o meu concelho? pesquisa]
[nome | população e ano]
[medida escolhida | ano | unidade]
[valor local e recibo]
[posição na faixa dos pares]
[Pares: regra e ano da população]
[Mapa de uma medida, com abrir/fechar]
[O que não sabemos sobre este lugar]
[Todas as medidas, cada uma com a sua data]

1 280 px
[pesquisa | medida | período | pares/todos]
[mapa com legenda] | [valor e interpretação do concelho]
                   | [faixa de pares, nomes ao selecionar]
                   | [definição | limites | recibos]
[tabela acessível das medidas e das ausências]
```

**A ausência também é conteúdo.** A DGAL apresenta «N.d.» para Évora em dezembro (`evora-prazo-medio-de-pagamento-2025-12`), enquanto outra linha, de publicação municipal anual, apresenta **137 dias** (`evora-prazo-medio-de-pagamento-2025`). Não preencher o buraco da série DGAL com a outra linha como se fossem a mesma observação. Sem conciliação de período e método, manter a ausência e oferecer acesso à informação municipal identificada como tal. Não assumir que as páginas têm todas as medidas só porque o modelo de página as prevê.

# 4. A primeira página «O que se passa»

**Abertura proposta para os dados disponíveis em 28.09.2026.** Usaria cinco achados, nesta ordem. A ordem é editorial e não muda automaticamente para premiar a maior variação percentual.

1. **«Os combustíveis encareceram muito mais do que o conjunto dos preços.»** Achado A. É a entrada mais próxima de uma despesa frequente e usa o período mais recente deste conjunto de exemplos. O gráfico compara as componentes e o total sem prometer uma fatura pessoal.
2. **«Na habitação, o total esconde a situação de quem arrenda.»** Achado B. Mostra porque escolher a população certa muda a leitura do país. É a demonstração mais clara do valor editorial que falta ao sítio.
3. **«A remuneração média subiu em euros. Falta apurar quanto compra.»** Achado C. Responde à parte já demonstrável da pergunta sobre dinheiro e abre diretamente o trabalho sobre preços do mesmo período.
4. **«O valor publicado de necessidades médicas por satisfazer ficou igual.»** Achado E. Dá presença à saúde sem fabricar uma avaliação do SNS ou dramatizar a diferença europeia.
5. **«Pobreza e desigualdade colocam Portugal em posições diferentes face à União.»** Achado F. Impede que o leitor interprete uma comparação favorável numa medida como retrato completo do rendimento.

Cada bloco herda exatamente as linhas, unidades, períodos, provisoriedade e ressalvas da secção inicial. Não repetir manualmente os números no título, no texto e no desenho. A primeira frase deve responder; a seguinte deve dizer porque interessa à pessoa; a ressalva decisiva fica visível. Definições extensas, tabela e recibos abrem por escolha do leitor. O número é uma ligação discreta ao recibo, não uma sequência de emblemas a interromper a leitura.

```text
390 px
[O ESTADO DO PAÍS | menu | PT / EN]
[O que se passa]
[Leitura de hoje | períodos de cada achado abaixo]

[COMBUSTÍVEIS E DESPESAS]
[frase com números ligados aos recibos]
[barras horizontais]
[o que significa | ressalva curta]

[HABITAÇÃO: TOTAL E INQUILINOS]
[painéis PT / UE empilhados]
[SALÁRIO: EUROS E PODER DE COMPRA]
[comparação dos trimestres]
[SAÚDE: O QUE A MEDIDA SABE]
[POBREZA E DESIGUALDADE]

[O meu dinheiro] [A minha casa]
[A minha saúde]  [A minha terra]
[O Estado]
[Procurar o meu concelho]
[Explorar temas, estudos e dados]
[Método e correções]

1 280 px
[marca | Portugal | Lugares | Temas | Estudos | pesquisa | PT / EN]
[O que se passa | data da leitura]
[Combustíveis: frase e barras, área principal] | [Habitação: PT / UE]
[Salário e limite da conclusão] | [Saúde] | [Pobreza e desigualdade]
[O meu dinheiro | A minha casa | A minha saúde | A minha terra | O Estado]
[Encontrar concelho] | [Mapa de uma medida, legenda, período]
[Estudos com pergunta e achado | Temas e dados]
[Método | Autoria | Correções | Datas das fontes]
```

No telefone, a frase e o desenho do primeiro achado têm prioridade sobre o mapa. Não reduzir a tipografia para acomodar a versão de secretária. A edição inglesa usa as mesmas dependências e escolhas de dados, com títulos, unidades, datas e ressalvas traduzidos em conjunto.

**O que se atualiza sozinho.** Cada achado declara as linhas de que depende, o contrato de comparação, a regra verbal e as situações em que deixa de poder ser publicado. Uma alteração validada pode atualizar o número, a geometria, a tabela, o recibo e uma frase com ramos previamente revistos, por exemplo «acima», «abaixo» ou «igual ao valor publicado». Uma nova conta só entra quando existir como linha derivada; o desenho não faz contas escondidas.

O contrato impede trocar apenas o mês de uma componente do IPC ou apenas o ano português num contraste europeu. O painel conserva o último período comum válido, dizendo que já existe informação mais recente ainda sem par, ou retira a comparação. Se mudar a definição, o universo, a bandeira de qualidade ou a conclusão central, a interpretação fica a aguardar revisão. Não manter uma manchete antiga por cima de valores novos.

No achado B, a frase sobre a inversão só se mantém enquanto ambas as comparações a sustentarem. Se deixarem de apontar em sentidos diferentes, o bloco perde essa manchete. Em C, a chegada de uma inflação mensal não autoriza responder à pergunta sobre poder de compra trimestral. Em E, não transformar automaticamente a mudança de uma casa decimal em «o acesso à saúde piorou».

Separar **período observado**, **publicação da fonte**, **última consulta** e **revisão da leitura**. Um pedido que devolve o mesmo corpo não é uma mudança no país. Uma falha de recolha não é estabilidade. Uma revisão de valor mantém a história da versão anterior e diz que houve revisão. «Atualiza com as fontes» é uma promessa sustentável; «Portugal em direto» seria enganador para estes dados.

**Entradas por pergunta da vida.**

| Entrada | Perguntas e conteúdo que pode mostrar hoje | O que ainda não pode responder |
|---|---|---|
| **O meu dinheiro** | Onde encareceram as despesas, remuneração média antes de descontos, pensão anual média, RSI, desigualdade e diferença entre salário mínimo legal e apresentação Eurostat. Usar A, C, F e G, com períodos visíveis. | Se o leitor ganhou poder de compra, quanto recebe líquido, inflação do seu cabaz, proporção atual de trabalhadores no mínimo e rendimento mediano local. |
| **A minha casa** | Pressão da habitação por regime de ocupação, variação dos preços de compra, rendas efetivamente pagas e área licenciada. Usar B, D e G. | Preço da casa do leitor, renda de um novo contrato no seu concelho, prestação hipotecária pessoal ou efeito das licenças na oferta efetivamente concluída. |
| **A minha saúde** | Necessidades médicas por satisfazer, comparação europeia limitada e explicação dos motivos abrangidos. Usar E. | Médico de família, tempos locais de consulta ou cirurgia, lotação, resultados clínicos, despesa e eficiência. Não desenhar um painel de saúde preenchido com substitutos económicos. |
| **A minha terra** | Procurar o concelho, medidas datadas, pares, referência nacional onde comparável e estudos locais identificados como aprofundamentos desiguais. Usar K e a secção dos concelhos. | Ranking de melhores sítios para viver, êxodo com uma só população observada, desemprego municipal em taxa, qualidade do governo local ou a experiência individual de um residente. |
| **O Estado** | Dívida e saldo públicos com edições separadas, despesa líquida, investimento, limites oficiais e finanças municipais. Usar J e ligar os estudos pertinentes. | Onde foi gasto cada euro dos impostos do leitor, relação causal entre despesa e qualidade de serviços, sustentabilidade integral ou uma nota global de Portugal. |

As perguntas sobre creches, escola e trabalho podem ter ligações contextuais nestas entradas e acesso direto em Temas. Não precisam de ficar escondidas por não coincidirem exatamente com os nomes do menu. O explorador «Evolução de Portugal desde 1981» deve ser uma entrada visível em Estudos, com uma pergunta guiada e os seus limites, não apenas uma ligação depois de uma página vazia.

# 5. O que espera dados novos ou um estudo

**O que pede séries.**

- **«Os salários acompanharam os preços?»** Recolher níveis de preços e remunerações com frequência compatível. Para uma comparação trimestral, usar o índice de preços médio dos meses do trimestre segundo método declarado, não a taxa homóloga do último mês. Deflacionar o nível nominal, em vez de subtrair mecanicamente uma taxa de inflação de uma variação salarial. A fórmula proposta do índice real é `100 × (salário_t / salário_base) / (IPC_t / IPC_base)`. Todos os seus pontos seriam linhas derivadas sobre observações seladas. A constante da base não é um resultado observado.
- **«As casas se afastaram dos rendimentos?»** Exige uma série compatível de preços de compra e uma série de rendimento apropriada à população que se pretende descrever. O salário médio de trabalhadores e o rendimento disponível de famílias não são intercambiáveis. Um índice relativo mostra evolução, não quantos anos uma família precisa para comprar uma casa.
- **«A dívida pesa menos porque desceu a dívida ou porque cresceu a economia?»** Exige montantes de dívida, PIB nominal e, para falar do encargo, juros pagos, com edições conciliadas. O rácio isolado não faz esta decomposição.
- **«A região aproxima-se da União?»** Exige observações temporais sob fronteiras e classificações comparáveis, com Portugal e União na mesma base. Não ligar geografias anteriores e atuais só porque o nome coincide.
- **«O meu concelho está a mudar?»** Exige população, empresas, ganhos e finanças em séries próprias, sem transformar revisões administrativas em mudanças reais.

O ano de base deve resultar de uma regra fixada antes de ver a forma das curvas, por exemplo o primeiro período comum de um intervalo comparável previamente definido. Não escolher a base que produz a narrativa mais forte. Mostrar pontos observados em posição temporal real, lacunas sem interpolação e quebras assinaladas. Uma média anual não é uma medição constante de cada mês; se aparecer como degrau, o rótulo tem de explicar que representa o período anual.

**O ativo escondido do estudo histórico.** O explorador já descrito nas avaliações serve como protótipo de interação: escolher indicadores, alinhar uma base, consultar falhas e aprender porque certas relações enganam. Os pontos espaçados não autorizam uma curva anual contínua. A fonte PORDATA não passa a ser fonte oficial por ser fiável ou conveniente: sob a regra deste pedido, cada indicador promovido a achado precisa da respetiva fonte oficial original, definição, licença aplicável e recibo. A linha `saldo-natural-portugal-2025` tem `source_url` e `excerpt` por confirmar. Portanto, nenhum valor dessa linha entra aqui como achado confirmado. Proveniência necessária: `[verify]`. Aproveitar o desenho do explorador, sem herdar automaticamente a elegibilidade dos dados para a primeira página.

**O que pede os países da União.** O teste da secção europeia prova disponibilidade para o caso consultado. Ainda faltam recolha sistemática, linhas por país, notas de comparabilidade, tratamento de ausências e propagação de revisões. Isso desbloqueia a faixa de posição de Portugal, extremos identificados, comparação escolhida pelo leitor e estabilidade da posição ao longo do tempo. Não desbloqueia sozinho uma explicação causal das diferenças. Para preços de energia, os conjuntos de preços de consumo já presentes não substituem preços em euros por unidade de energia: estes seriam dados novos, com bandas de consumo, impostos e período comuns.

**O que pede documentos e tabelas adicionais.**

| Pergunta | O que já existe | O que falta e como apresentar quando existir |
|---|---|---|
| Qual é o salário mínimo e quem o recebe? | O valor legal continental de **920,00 € por mês** (`retribuicao-minima-mensal-garantida-continente-2026`) e a apresentação Eurostat de **1 073 €** (`retribuicao-minima-mensal-doze-meses-2026`). | Série de diplomas, efeitos, âmbito territorial e regimes; incidência publicada pelo GEP com universo e período; valores regionais em linhas próprias. O Eurostat ajusta pagamentos anuais à convenção mensal, pelo que os dois valores não são concorrentes. Explicação oficial: [metadados, lidos em 28.09.2026](https://ec.europa.eu/eurostat/cache/metadata/en/earn_minw_esms.htm). Desenho: valor legal, convenção estatística e distribuição de quem o recebe, em blocos separados. |
| Quanto custa uma fatura de energia? | Variação de preços de energia no IPC. | Perfis e faturas de referência publicados pela ERSE, consumo, potência, componente fixa, impostos, descontos e datas de vigência. Mostrar a decomposição de uma fatura de referência publicada. Sem perfil oficial, não inventar uma «família típica». Tarifa não é fatura. |
| Quanto custa abastecer? | Variação do IPC para combustíveis e lubrificantes. | Preços DGEG em euros por litro, produto, cobertura territorial, data e método de média; separar preços anunciados, médios praticados e informação fiscal. Mostrar séries por produto quando seladas. Converter para custo de um abastecimento exige quantidade declarada e resultado derivado, não uma despesa familiar estimada. |
| Quanto pesa a prestação da casa? | Preços da habitação e indicadores de sobrecarga. | Dados publicados por INE ou Banco de Portugal sobre contratos, capital, prazo, taxas e prestação; documentos que distingam crédito existente de novos contratos. Uma taxa média não determina uma prestação média. Mostrar observações oficiais em painéis separados. Uma simulação com capital e prazo escolhidos seria outro produto, fora da regra atual de não estimar. |
| Quanto recebem os pensionistas? | Média anual da Segurança Social nas linhas `pensao-media-anual-2024` e `pensao-media-anual-2025`. | Distribuição por montante e tipo, universo de pensionistas, cumulações e informação da CGA em separado, a partir de Segurança Social, GEP/DGCP e CGA. Não fundir sistemas com coberturas diferentes. Desenho: distribuição publicada, com média e mediana apenas se disponíveis e comparáveis. |

**O que pede pré-registo.** A procura editorial de contrastes não pode transformar uma associação encontrada depois de muitas tentativas numa hipótese confirmada. Proponho os estudos abaixo; os métodos são propostas a fixar antes de recolher e examinar os resultados novos, não estudos já executados.

| Pergunta a fixar | Método pré-registado | Condição de matar |
|---|---|---|
| A remuneração bruta média acompanhou o IPC no intervalo comparável? | Definir população, remuneração incluída, frequência trimestral, intervalo, regra do primeiro período comum, índice de preços, tratamento de pagamentos e quebras. Selar o índice real e mostrar separadamente média nominal e preços. Publicar subida, descida ou ausência de mudança segundo a conta, sem escolher o resultado desejado. | Não conseguir uma série de remuneração e preços com período e definição conciliáveis. Também matar a conclusão sobre «todos os trabalhadores» se só existir média agregada. Um resultado sem ganho real não mata o estudo. |
| A posição de Portugal na sobrecarga mantém-se quando se compara o mesmo regime de habitação? | Fixar todos os regimes disponíveis, países, ano comum, população, tratamento de bandeiras e medidas a apresentar. Comparar Portugal e União dentro de cada regime. Não decompor a diferença agregada sem os pesos e os dados necessários. | Faltar definição equivalente, cobertura suficiente do regime ou informação indispensável para a decomposição pretendida. Publicar os painéis descritivos válidos, mas matar a explicação sobre a composição se os pesos faltarem. |
| Nos concelhos, a descida do endividamento acompanhou menor investimento? | Recolher séries DGAL com o mesmo perímetro, investimento executado, receita e população compatíveis; definir previamente anos e pares; examinar mudanças dentro de cada concelho. Tratar mandatos apenas como contexto. O resultado inicial é associação descritiva, com hipóteses alternativas sobre fundos e receitas. | Ausência de investimento comparável ou alteração contabilística que impeça seguir o mesmo universo. Matar qualquer alegação de efeito causal de um executivo se não houver desenho que o identifique. Não continuar apenas porque é possível desenhar duas linhas. |

Em todos os casos, «condição de matar» significa parar a pergunta ou a conclusão que os dados não conseguem responder, explicar a razão e conservar a parte descritiva válida. Não significa esconder um resultado nulo ou contrário à expectativa.

# 6. Os riscos e as recusas

| Relação sedutora | Porque não é honesta com os dados atuais | Recusa ou alternativa |
|---|---|---|
| Remuneração trimestral contra inflação do mês mais recente | Os períodos não coincidem; uma taxa homóloga mensal não é o deflator do trimestre. | Publicar o aumento nominal e aguardar índices do período compatível. |
| Dívida ou empresas de um ano divididas por população do seguinte | O denominador não corresponde ao período do numerador. Em territórios em mudança, pode alterar a leitura. | Recolher população compatível e criar a derivação. Não corrigir a falta com a etiqueta vaga «dados mais recentes». |
| Remuneração bruta contra rendimento líquido | Impostos, contribuições, prestações e composição do agregado mudam o que a pessoa pode gastar. | Manter as medidas separadas até existir rendimento disponível compatível. |
| Média como retrato da pessoa habitual | Valores elevados e mudanças na composição podem deslocar a média. A mediana responde a outra pergunta. | Escrever «em média» e procurar a distribuição; nunca reconstruir a mediana a partir da média. |
| Ganho mensal dos Quadros de Pessoal como continuação da remuneração média trimestral | Coberturas, componentes e frequência diferem, mesmo quando ambas as unidades são euros por mês. | Séries distintas, com definições próprias. |
| PIB por habitante como dinheiro dos residentes | A produção pode pertencer a não residentes e concentrar-se onde se trabalha, não onde se vive. | Usar «produção por habitante» e procurar rendimento disponível para perguntas de bolso. |
| Pensão média anual contra linha de pobreza | A pensão é uma componente do rendimento de um pensionista; a linha de pobreza usa rendimento disponível equivalente de um agregado. Acresce o desfasamento entre ano do inquérito e ano do rendimento. | Não concluir que «o pensionista médio é pobre». Pedir distribuição de rendimento dos agregados de pensionistas e períodos compatíveis. |
| Salário mínimo legal contra montante mensal Eurostat | Convenções de pagamentos distintas; o valor continental também não prova o valor aplicável nas regiões autónomas. | Explicar convenções e território, sem calcular uma diferença como se houvesse discrepância salarial. |
| Índice de preços de combustíveis como euros por litro | Taxa de variação e preço são grandezas diferentes; o agregado inclui lubrificantes. | Procurar DGEG para níveis de preço por produto. |
| Inflação a abrandar como preços a baixar | Uma taxa homóloga menor pode continuar positiva; também compara bases distintas. | Escrever «a subida homóloga abrandou» e reservar «baixou» para a comparação que o demonstre. |
| IPC português contra IHPC europeu | Os universos e métodos não são idênticos. | Usar as linhas IHPC portuguesa e europeia do mesmo período. |
| Sobrecarga total contra inquilinos como grupos independentes | Os inquilinos estão dentro do total; composição e denominadores diferem. | Painéis separados, cada um com a sua referência europeia. Não somar nem calcular risco individual relativo. |
| Licenças de construção como casas disponíveis | Autorizar área não demonstra construção, conclusão, ocupação ou acessibilidade. | Dizer o que foi autorizado e pedir as etapas seguintes para estudar oferta. |
| Inscritos nos centros de emprego como taxa de desemprego municipal | Faltam população ativa e equivalência com o conceito do inquérito ao emprego; nem todos os desempregados estão inscritos. | Publicar contagem ou densidade de inscrições, se a derivação for autorizada. Não a chamar taxa de desemprego. |
| Corvo ou outro concelho pequeno no topo de uma variação | Poucas pessoas ou entidades podem mover muito um rácio; a aparência de precisão não corresponde à estabilidade. | Mostrar numerador, denominador, ausência e contexto. Não inventar intervalos de confiança nem fundir lugares sem dados para o fazer. |
| Dois indicadores municipais associados como explicação da vida de uma pessoa | Uma associação entre territórios não identifica a relação entre indivíduos. | Recusar a inferência individual e explicitar a falácia ecológica. |
| Dívida menor como melhor governo local | Pode haver mudanças de receita, perímetro, investimento, transferências e obrigações herdadas. | Comparar a medida com o limite aplicável; estudar decisões e resultados antes de atribuir mérito. |
| Mandato alinhado no tempo com um resultado como prova de autoria | Coincidência temporal não identifica a decisão responsável ou o contrafactual. | Eixo de calendário comum, documentos e método causal adequado; sem isso, apenas cronologia. |
| União como «o país do meio» ou média simples dos países | O agregado usa pesos e regras próprios. Não tem de coincidir com a mediana. | Nomear o agregado e criar outra medida apenas com derivação declarada. |
| Extremo europeu como melhor ou pior país | Valor alto ou baixo pode ter vários significados e não elimina diferenças de população, cobertura ou estrutura. | Reservar juízo normativo a critério oficial identificado; usar extremos descritivos nos restantes casos. |
| Quadro de limiares como nota global do país | Um quadro de vigilância macroeconómica não cobre toda a vida social, e os seus indicadores não têm o mesmo significado. | Apresentá-lo como instrumento específico, abaixo dos achados de leitura geral. |
| Ausência como zero ou prova de incumprimento | Um dado pode estar em falta, não publicado ou não encontrado no âmbito da busca. | Dizer qual dessas situações ocorreu, onde se procurou e até quando. |
| Um selo como prova automática de comparação honesta | O selo permite rastrear uma afirmação; não resolve uma escolha errada de população, período ou definição. | Rever o contrato de comparação e a frase que o leitor efetivamente lê. |

Há ainda duas recusas editoriais decisivas. Não prometer atualização em tempo real quando as fontes descrevem períodos passados. Não transformar a exigência de confiança em mais uma ronda de infraestrutura antes de publicar os contrastes já sustentados. A próxima peça deve permitir ao leitor explicar um achado e a sua principal ressalva; a facilidade de rastrear o número continua disponível na camada seguinte.

Assinado: **GPT-6 (Codex)**. **28.09.2026**.
