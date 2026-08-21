# Inventário das frases da casa · primeira página

*Etapa 2l, 21.08.2026. A Emenda 15 («a página do leitor não se explica») traz a
sua própria medida: «o inventário de todas as frases da casa na superfície
pública, classificadas em conteúdo, navegação e autorreferência; a terceira
classe vai a zero fora do Método, do Sobre e do recibo, e a régua imprime a
contagem para que não volte».*

*Estendido a 21.08.2026 (etapa 3, commit 3-0, decisão 1 do diretor): a régua
passa a recolher também a **descrição do `<head>`** de cada rota inventariada. A
`<meta name="description">` é superfície pública, é escrita pela casa, e a da
primeira página descrevia o método do sítio enquanto a contagem de
autorreferência do corpo estava a zero. As rotas inventariadas são uma lista
declarada em `medir-defeitos.mjs` (`ROTAS_DO_INVENTARIO`), e crescem com as
etapas: uma rota entra no commit em que a sua página é reconstruída e as suas
frases são classificadas.*

Esta lista é lida por `scripts/medir-defeitos.mjs` (medida 8). O que a régua
recolhe é mecânico e está escrito lá: todo o bloco de texto de uma rota
inventariada, nas duas edições, mais a descrição do seu `<head>`, que não seja
nem contenha uma origem declarada
(`data-claim`, `data-prova`, `data-verbatim`, `data-nonledger`, …), que não seja
o nome de uma medida nem a sua linha de unidade (`data-medida-nome`,
`data-medida-unidade`), e cujo texto não esteja todo dentro de um `<a>` ou de um
`<button>`. Um bloco que não esteja nesta lista sai na saída como **por
classificar**, que é o estado que obriga alguém a decidir.

## As três classes

- **conteúdo** — o que a coisa medida é: a medida, o valor, a unidade, o
  período, o nome da fonte, o nome do âmbito, a ausência dita em duas palavras.
  Uma frase que define uma medida ou nomeia quem a publica é conteúdo, mesmo
  quando é longa.
- **navegação** — o que leva a outro sítio, ou o que diz a quem ouve a página
  como a percorrer: o nome da publicação, os comandos, a porta das correções, o
  estado vazio de uma pesquisa, a descrição acessível de um instrumento.
- **autorreferência** — o método, a verificação, a honestidade, a cobertura ou
  as intenções do próprio sítio. **Zero na primeira página**, nas duas edições.

## As frases que ficaram, e porquê

A coluna do texto é a cadeia normalizada, tal como a régua a lê (espaços
colapsados). As duas edições partilham a mesma tabela: uma frase entra uma vez,
na língua em que é rendida.

| classe | texto |
| --- | --- |
| conteudo | A régua da convergência |
| conteudo | Ainda sem linhas para Águeda . |
| conteudo | Alentejo · region |
| conteudo | Alentejo · região |
| conteudo | Algarve · region |
| conteudo | Algarve · região |
| conteudo | As medidas do concelho, cada uma com a sua linha. |
| navegacao | As regiões publicadas na régua da convergência. |
| navegacao | At a glance |
| navegacao | Brief reading |
| conteudo | Dívida bruta das administrações públicas, no conceito do Procedimento dos Défices Excessivos. Está acima do limiar do painel europeu, e a descer. |
| navegacao | Encontrou um erro? correcoes@oestadodopais.pt · O registo de correções → |
| conteudo | Estimativa anual do INE para o concelho. |
| conteudo | European Social Scoreboard |
| navegacao | Found an error? correcoes@oestadodopais.pt · The corrections log → |
| conteudo | General government gross debt, on the Excessive Deficit Procedure concept. It is above the European scoreboard threshold, and falling. |
| conteudo | Grande Lisboa · região |
| conteudo | Greater Lisbon · region |
| navegacao | Hover over a point to read the municipality. Keyboard: Tab to the map, arrow keys to move between neighbouring municipalities, Home to return to Évora. Tap a point to choose the concelho. |
| conteudo | Inscritos no fim do mês nos serviços de emprego, ficheiro mensal por concelho. |
| conteudo | Integrated business accounts, by concelho of the registered office. |
| navegacao | Leitura breve |
| conteudo | Madeira · region |
| conteudo | Madeira · região |
| navegacao | Nenhum concelho com esse nome. |
| navegacao | No concelho by that name. |
| navegacao | O Estado do País |
| conteudo | O que o país tem a haver do exterior menos o que lhe deve: negativo quando deve mais do que tem a haver. |
| conteudo | O índice compara o PIB per capita de cada território, medido em paridades de poder de compra, com a média da UE-27. Um valor abaixo da média significa menos poder de compra por pessoa; um valor acima, mais. |
| conteudo | Painel Social Europeu |
| navegacao | Passe o cursor sobre um ponto para ler o município. Teclado: Tab até ao mapa, setas para percorrer os municípios vizinhos, Home para voltar a Évora. Toque num ponto para escolher o concelho. |
| conteudo | Península de Setúbal · região |
| conteudo | Poder de compra per capita, publicado pelo INE para todos os concelhos. |
| conteudo | Portugal breaches 4 thresholds of the Macroeconomic Imbalance Procedure and meets 9 . |
| conteudo | Portugal nos painéis europeus: os indicadores, os limiares e as fontes. |
| conteudo | Portugal on the European scoreboards: the indicators, the thresholds and the sources. |
| conteudo | Portugal ultrapassa 4 limiares do Procedimento dos Desequilíbrios Macroeconómicos e cumpre 9 . |
| conteudo | Portugal · country |
| conteudo | Portugal · país |
| conteudo | Purchasing power per capita, published for every concelho. |
| conteudo | Registered with the employment service at month end, monthly file by concelho. |
| navegacao | Relance |
| conteudo | Reportado pelo município: sai da prestação de contas do próprio, não de um agregador central. |
| conteudo | Reported by the municipality: it comes from its own accounts, not from a central aggregator. |
| conteudo | Setúbal Peninsula · region |
| conteudo | Sistema de contas integradas das empresas, por concelho da sede. |
| conteudo | Still no rows for Águeda . |
| conteudo | Série anual da Direção-Geral das Autarquias Locais, o regulador das contas municipais. |
| conteudo | The annual series of the local-government directorate, the regulator of municipal accounts. |
| conteudo | The convergence rule |
| conteudo | The index compares each territory’s GDP per capita, measured in purchasing power standards, with the EU-27 average. A value below the average means less purchasing power per person; a value above it, more. |
| conteudo | The measures of the concelho, each with its own row. |
| navegacao | The regions published on the convergence rule. |
| conteudo | The statistics institute’s annual estimate for the concelho. |
| conteudo | What the country is owed from abroad minus what it owes abroad: negative when it owes more than it is owed. |
| conteudo | no row yet |
| conteudo | sem linha ainda |
| conteudo | Águeda · municipality · district of Aveiro |
| conteudo | Águeda · município · distrito de Aveiro |
| conteudo | Évora |
| conteudo | Évora · municipality |
| conteudo | Évora · municipality · district of Évora |
| conteudo | Évora · município |
| conteudo | Évora · município · distrito de Évora |

## O que saiu, e para onde

| frase retirada | classe | onde vive agora |
| --- | --- | --- |
| «1 de 308 concelhos · tem página» (ficha do mapa, cartão localizador, pesquisa, porta dos Municípios) | autorreferência | `/municipios`, que é a página que a conta |
| «Os pontos são todos iguais e marcam a posição de cada concelho na Carta Administrativa, e mais nada: não marcam cobertura, qualidade nem importância.» | autorreferência | retirada: diz o que não afirmamos |
| «Contagem verificada nos ficheiros» e o quadro das três parcelas | autorreferência | a contagem por parcelas vive em `/municipios` (pedido para a etapa 3) |
| «Método, ressalvas e proveniência» (camada do mapa e do Instrumento n.º 1) | autorreferência | o Método e o recibo de cada linha |
| «Painel europeu reconferido a …» (por baixo do painel) | autorreferência | a mobília do cabeçalho, que a leva em todas as páginas |
| «o recibo completo está na linha» | autorreferência | o selo, que é a porta |
| «Sem referência publicada: não há barra a desenhar.» | autorreferência | a peça diz «sem limiar», em duas palavras |
| «Nenhuma medida foi lida para <nome>. As fontes que publicam para todos os concelhos…» | autorreferência | as oito peças, cada uma com «sem linha ainda» |
| «As páginas · o resto vive a uma porta» | autorreferência | retirada: três portas de uma linha não precisam de legenda |
| «Um toque no mapa devolve os concelhos mais próximos…» | autorreferência | o nome acessível do selo do país |
| «As regiões não se desenham em pontos de concelho…» | autorreferência | o nome acessível do desenho da banda |
| «Calculado sobre duas colunas do mesmo ficheiro do regulador. A aritmética está na linha.» | autorreferência | a página de concelho (etapa 3) e a linha do livro-razão; o selo já diz «calculado ·» |
| «As diferenças em pontos que a régua desenha são calculadas…» | autorreferência | a linha de cada diferença, no livro-razão |
| «Uma linha por região posta na régua: … não é uma cópia mantida à parte.» | autorreferência | retirada; a porta do CSV fica, sem a frase |
| «Sem JavaScript, a régua mostra Portugal…» e «Sem JavaScript, este comando não muda a página inteira…» | autorreferência | retiradas: o que descreviam continua verdadeiro |
| «Esta página mede o município de Évora e mostra de onde vem cada medida. Não interpreta…» | autorreferência | a página de Évora (etapa 3); saiu da rendição na primeira página |
| «O ponto marca a posição do concelho na Carta Administrativa, e não cobertura. Quando houver linhas para <nome>…» | autorreferência | a manchete e as oito peças vazias |
| «Um erro confirmado entra no registo de correções e na própria linha, com o valor antigo à vista. Nada é apagado.» | autorreferência | `/correcoes`, que já a diz por extenso, com as três naturezas |
| «Linha do livro-razão: <estudo>» (texto oculto do selo) | autorreferência | encurtou para «fonte · <estudo>» |
| «Observatório de dados sobre Portugal. Cada número publicado tem uma linha no livro-razão, com fonte, documento e data de acesso.» (descrição do `<head>` da primeira página) | autorreferência | o Método e o recibo de cada linha; a descrição passa a nomear o que a página tem |
