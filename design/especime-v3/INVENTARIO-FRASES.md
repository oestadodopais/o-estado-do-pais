# Inventário das frases da casa · rota a rota

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

## `/livro-razao` · `/en/ledger` (etapa 3, subetapa 3b)

*As duas edições partilham a tabela, como acima: uma frase entra uma vez, na
língua em que é rendida.*

| classe | texto |
| --- | --- |
| conteudo | 132 afirmações · 19 calculadas |
| conteudo | 132 claims · 19 calculated |
| conteudo | A licença cobre o conjunto: a estrutura, os valores da casa, as derivações e as descrições. Os excertos transcritos das fontes continuam sob os termos de quem os publicou. |
| conteudo | Com campos por confirmar |
| conteudo | Complete provenance |
| navegacao | Descarregar o livro-razão: CSV · JSON |
| navegacao | Download the ledger: CSV · JSON |
| conteudo | Every claim published on this site, one row each: the value exactly as published, the source, the document, the address, the access date and the excerpt. |
| conteudo | Every row, with every published field. |
| conteudo | O livro-razão |
| conteudo | one field unconfirmed |
| conteudo | provenance complete |
| conteudo | proveniência completa |
| conteudo | um campo por confirmar |
| conteudo | Os dois estados do selo |
| conteudo | One row per published figure. Each row holds the value exactly as the source published it, who produced it, the document and edition, the address, the date we read it and a textual excerpt (and, when the figure is calculated by us, the sum spelled out and re-evaluated at every build). |
| conteudo | Proveniência completa |
| conteudo | The ledger |
| conteudo | The licence covers the dataset: its structure, the house values, the derivations and the descriptions. Excerpts transcribed from sources remain under their publishers’ terms. |
| conteudo | The two states of the seal |
| conteudo | Todas as afirmações publicadas neste sítio, uma linha cada: o valor tal como foi publicado, a fonte, o documento, o endereço, a data de acesso e o excerto. |
| conteudo | Todas as linhas, com todos os campos publicados. |
| conteudo | Uma linha por número publicado. Cada linha guarda o valor tal como a fonte o publicou, quem o produziu, o documento e a edição, o endereço, a data em que o lemos e um excerto textual (e, quando o número é calculado por nós, a conta explicada e reavaliada a cada construção). |
| conteudo | With fields to confirm |
| conteudo | [a verificar] |
| conteudo | [a verificar] (to verify) |

### As quatro que ficam em autorreferência, e porquê

**São duas frases, nas duas edições, e são as duas que a `DECISIONS.md` §4 item
AB manda preservar palavra por palavra.** São as legendas dos dois grupos de
linhas:

- «Todos os campos preenchidos e conferidos contra a fonte. O selo é um quadrado
  cheio.» / «Every field filled in and checked against the source. The seal is a
  filled square.»
- «Falta pelo menos um campo de proveniência. O campo fica marcado, e nenhum foi
  preenchido com um valor plausível. O selo é um quadrado a tracejado.» / «At
  least one provenance field is missing. The field is marked as such, and none
  has been filled in with a plausible value. The seal is a dashed square.»

Cada uma tem uma parte que é conteúdo («O selo é um quadrado cheio», que nomeia
o glifo, e é por isso que o brief da etapa 3 as manda ficar «onde descrevem os
estados do selo como conteúdo») e uma parte que é a casa a falar da sua própria
verificação («conferidos contra a fonte»; «nenhum foi preenchido com um valor
plausível»). A classe de um bloco é uma só, e a régua lê o bloco inteiro.

**O conflito está escrito e não foi contornado.** A §4 item AB preserva-as
palavra por palavra e assinala-as à direção na pré-visualização n.º 2; a Emenda
15 manda a autorreferência a zero. O brief da etapa 3 §2b resolve o caso em que
as duas regras se cruzam: «when in doubt, list it in the note as an editorial
call and keep it». Ficam, e a contagem de `/livro-razao` é **2 por edição** em
vez de 0. Uma redação que separasse as duas partes é uma chamada da direção.

## `/municipios` · `/en/municipalities` (etapa 3, subetapa 3c)

*Trinta dos trinta e três blocos são **nomes de distrito e de ilha**, tal como a
Carta Administrativa os escreve, e são iguais nas duas edições: são o nome do
âmbito de cada grupo da lista, que a Emenda 15 chama conteúdo. Os 308 nomes de
concelho e as suas duas palavras de estado **não entram aqui**: levam
`data-cobertura`, que é vocabulário declarado, e a régua passou a excluí-los na
3c (a razão está escrita em `scripts/medir-defeitos.mjs`). Sem essa exclusão, esta
tabela teria 307 linhas do feitio «Abrantes sem página ainda», que é a lista dos
concelhos escrita outra vez e não um inventário de frases.*

| classe | texto |
| --- | --- |
| conteudo | Aveiro |
| conteudo | Beja |
| conteudo | Braga |
| conteudo | Bragança |
| conteudo | Castelo Branco |
| conteudo | Coimbra |
| conteudo | Every concelho in Portugal, from the official administrative map. |
| conteudo | Every concelho, from the Carta Administrativa Oficial de Portugal. |
| conteudo | Faro |
| conteudo | Guarda |
| conteudo | Ilha Terceira |
| conteudo | Ilha da Graciosa |
| conteudo | Ilha da Madeira |
| conteudo | Ilha das Flores |
| conteudo | Ilha de Porto Santo |
| conteudo | Ilha de Santa Maria |
| conteudo | Ilha de São Jorge |
| conteudo | Ilha de São Miguel |
| conteudo | Ilha do Corvo |
| conteudo | Ilha do Faial |
| conteudo | Ilha do Pico |
| conteudo | Leiria |
| conteudo | Lisboa |
| conteudo | Os concelhos de Portugal |
| conteudo | Portalegre |
| conteudo | Porto |
| conteudo | Santarém |
| conteudo | Setúbal |
| conteudo | The concelhos of Portugal |
| conteudo | Todos os concelhos de Portugal, pela Carta Administrativa Oficial. |
| conteudo | Todos os concelhos, pela Carta Administrativa Oficial de Portugal. |
| conteudo | Viana do Castelo |
| conteudo | Vila Real |
| conteudo | Viseu |

**Autorreferência: 0 nas duas edições.** Saíram, nesta subetapa, «O que este
índice não diz» e «Nada sobre o concelho. É uma lista de nomes e de estados…»,
que é a classe que a Emenda 15 nomeia por extenso, e a segunda frase da descrição
do `<head>` («Os que já têm página do observatório levam a ela; os outros dizem
que ainda não têm»), que é a cobertura do próprio sítio. A frase da contagem foi
reescrita para levar as duas chaves da prova, e por isso deixou de escrever «Um»
por extenso, que a `IDENTIDADE.md` §10 recusa.

## `/municipios/evora` · `/en/municipalities/evora` (etapa 4, commit 4-0)

*A rota entra com as decisões da direção de 21.08.2026, tarde: saíram a abertura
(«Esta página mede o município de Évora… Não interpreta: …»), as contagens por
extenso do Relance («Oito medidas. Seis vêm de organismos…»), os dois parágrafos
por baixo de «Quem responde pelo quê» — que fica só como nome da secção, por cima
da banda dos mandatos —, a sub-linha da Leitura breve, a nota dos trabalhos e a
segunda frase da descrição do `<head>`.*

***A contagem não fecha a zero, e fica escrita em vez de arredondada.*** *Três
blocos distintos por edição continuam a ser a casa a falar de si, e os três vivem
em `metodo`, `naoSabe` e nas notas de mandato de `src/data/municipios.mjs`, que
são conteúdo editorial da etapa 3 e não estão entre os itens que a decisão de
21.08 nomeou. Estão listados abaixo com a sua classe, e o pedido está em
`ISSUES.md` (I52): são uma chamada de conteúdo, não de forma, e pedem a palavra de
quem escreveu a página.*

| classe | texto |
| --- | --- |
| conteudo | A diferença entre as duas contas da mesma dívida |
| conteudo | A dívida contra o teto legal |
| conteudo | A execução da receita e o prazo médio de pagamento são lidos da prestação de contas do próprio município: a sua linha no livro-razão nomeia esse documento e a página onde estão. As duas vozes de fora sobre estas contas são a opinião assinada do auditor e a série anual do regulador, e as duas estão nesta página. |
| conteudo | A série anual do regulador ainda não chegou a este mandato. |
| conteudo | A série anual do regulador usada nesta página começa depois deste mandato. |
| conteudo | A última prestação de contas do município |
| conteudo | Accounts of the year before last |
| conteudo | Antes do primeiro ano de contas legível nesta janela. |
| conteudo | As contagens de pelouros desta página são designações, não despesa. A correspondência entre as contas e os pelouros existe num dos trabalhos, é declarada por ele como sua e não como oficial, e esta página não a usa para atribuir dinheiro a ninguém. Esse trabalho fixa também a regra: descrição, nunca classificações. |
| autorreferencia | As decisões desta página vão atribuídas a quem as tomou, com o rótulo da lista que ganhou. Os índices (população, emprego, poder de compra, e o próprio índice de dívida) não vão atribuídos a ninguém: nada do que foi lido fornece o contrafactual que recortaria a parte de um executivo neles. |
| navegacao | Background |
| conteudo | Before the first year of accounts readable in this window. |
| conteudo | Borrowing margin |
| conteudo | Contas do penúltimo ano |
| conteudo | Corrected budget |
| conteudo | Debt limit |
| conteudo | Decided |
| conteudo | Decidiu |
| conteudo | Deixou |
| conteudo | Despesa paga |
| conteudo | Diferença |
| conteudo | Difference |
| conteudo | Dívida total |
| conteudo | Economia, investidores e portas abertas no município de Évora. |
| conteudo | Economy, investors and open doors in the municipality of Évora. |
| conteudo | Em funções. |
| conteudo | Executive installed |
| conteudo | Executivo instalado |
| conteudo | Expenditure paid |
| conteudo | Fifteen years of municipal government in Évora, across five terms. |
| conteudo | Fora do que foi lido. |
| conteudo | Fora do que foi lido: as capturas que sustentam a repartição de pelouros começam no mandato seguinte. |
| navegacao | Fundo |
| conteudo | Herdou |
| conteudo | How far the debt exceeded the legal limit, in the first and the last year in which the report publishes it as a positive figure. After that the table turns negative, and a negative there is no longer excess but borrowing capacity, so this page stops here. |
| conteudo | In office. |
| conteudo | Inherited |
| conteudo | Left |
| conteudo | Limite de dívida |
| conteudo | Lugares |
| conteudo | Margem de endividamento |
| conteudo | Method and caveats |
| conteudo | Método e ressalvas |
| autorreferencia | Nenhuma decisão deste mandato atravessou para o livro-razão com valor próprio. Um campo em branco seria diferente disto: o que falta é a linha, não a decisão. |
| conteudo | Nenhuma fonte publica um produto interno bruto para um concelho, e esta página não fabrica nenhum. O que existe é o registo empresarial: as contas das empresas sediadas no concelho, que creditam toda a atividade de uma empresa ao concelho da sua sede. Não é PIB municipal, e o trabalho sobre a economia escreve porquê nos seus limites: «não capta a administração pública, a maior parte da universidade e do hospital». |
| autorreferencia | No decision from this term crossed into the ledger with a value of its own. A blank field would mean something else: what is missing is the row, not the decision. |
| conteudo | No source publishes a gross domestic product for a concelho, and this page manufactures none. What does exist is the business register: the accounts of enterprises headquartered in the concelho, which credit a firm’s whole activity to its head-office concelho. It is not municipal GDP, and the work on the economy writes why in its own limits: «it misses public administration, most of the university and the hospital». |
| conteudo | Not established. The work on the portfolios says this term «is one line of a map, not a map»: the president of that mandate, and every other member of it, were not identified. |
| conteudo | Não estabelecido. O trabalho sobre os pelouros diz que este mandato «é uma linha de um mapa, não um mapa»: o presidente desse mandato, e todos os outros membros dele, não foram identificados. |
| autorreferencia | Não existe contrafactual para nenhum índice. Nada do que foi lido permite separar a parte de um executivo neles. |
| conteudo | Não existe medida de desempenho por pessoa. As contas públicas não são cortadas dessa maneira. |
| conteudo | O limite é fixado no artigo 52.º da Lei n.º 73/2013: uma vez e meia a média da receita corrente líquida dos três anos anteriores. É a lei que o define, não este sítio. |
| conteudo | O município publica |
| conteudo | O que a dívida excedia o limite legal, no primeiro e no último ano em que o relatório o publica como um valor positivo. Depois disso o quadro passa a números negativos, que já não são excesso mas capacidade de endividamento, e por isso esta página para aqui. |
| conteudo | O que as fontes publicam sobre o município de Évora: população, poder de compra, emprego, empresas, dívida e execução orçamental. |
| conteudo | O que foi orçamentado, o que foi pago e o que ficou em dívida no município de Évora. |
| conteudo | O que o município orçamentou, o que cobrou, o que pagou, e o que dizia dever no fim do ano. São números do próprio município sobre si mesmo: a prestação de contas é dele. |
| conteudo | O regulador |
| conteudo | O regulador e o município publicam a dívida do mesmo ano com uma diferença. A diferença é pequena, e mostra-se porque é o único sítio onde uma voz de fora e a voz do próprio medem a mesma coisa. |
| conteudo | O regulador publica |
| conteudo | O traço fino é a dívida total que o regulador publica para o concelho; a barra é a distância até ao limite legal do mesmo ano, que é o fio da direita. O índice mede uma contra o outro numa escala em que o teto é o valor permitido. |
| conteudo | On the recovery plan: the work reads the state auditor’s catalogue, not its audits; the contracts window is an upper bound on a truncated period; and no European Union figure exists for a municipality. |
| conteudo | On this municipality’s accounts there are two voices that are not its own: the independent auditor’s signed opinion, and the regulator’s annual series, which publishes per municipality and per year the same legal debt concept the report uses, compiled from outside. Both are on this page. |
| conteudo | Orçamento corrigido |
| conteudo | Os totais do plano de recuperação que aparecem na leitura desse trabalho são somas sobre o registo público, atribuídas ao concelho por esse registo. Do dinheiro contratado no concelho, a universidade tem mais do que o município, e a camada que administra o dinheiro é feita de organismos nacionais. Que daí resulte que o endereço da responsabilização não são os paços do concelho é a conclusão assinada desse trabalho, e está na página dele. |
| conteudo | Os trabalhos sobre este concelho |
| conteudo | Outside what was read. |
| conteudo | Outside what was read: the captures behind the portfolio split begin with the next term. |
| conteudo | Pelouros |
| conteudo | Portfolios |
| conteudo | Provenance |
| conteudo | Proveniência |
| conteudo | Quem administrou, e o que as contas registaram |
| conteudo | Quem responde pelo quê |
| conteudo | Quinze anos de governo municipal em Évora, ao longo de cinco mandatos. |
| conteudo | Receita cobrada |
| conteudo | Revenue collected |
| conteudo | Revenue execution and the average payment time are read from the municipality’s own accounts: their ledger rows name that document and the page they sit on. The two outside voices on these accounts are the auditor’s signed opinion and the regulator’s annual series, and both are on this page. |
| conteudo | Seats |
| conteudo | Sobre as contas deste município existem duas vozes que não são a dele: a opinião assinada do auditor independente, e a série anual do regulador, que publica por município e por ano o mesmo conceito legal de dívida que o relatório usa, compilado do lado de fora. As duas estão nesta página. |
| conteudo | Sobre o plano de recuperação: o trabalho lê o catálogo do tribunal de contas, não as suas auditorias; a janela de contratos é um limite superior sobre um período truncado; e não existe um valor da União Europeia para um município. |
| conteudo | The debt against the legal ceiling |
| autorreferencia | The decisions on this page are attributed to whoever took them, with the label of the list that won. The indices (population, employment, purchasing power, and the debt index itself) are attributed to nobody: nothing that was read provides the counterfactual that would carve out an executive’s share of them. |
| conteudo | The gap between the two accounts of the same debt |
| conteudo | The limit is set by article 52.º of Lei n.º 73/2013: one and a half times the three-year average of net current revenue. The law defines it, not this site. |
| conteudo | The municipality publishes |
| conteudo | The municipality’s latest accounts |
| conteudo | The portfolio counts on this page are designations, not spending. The mapping between the accounts and the portfolios exists in one of the works, is declared by it as its own and not as official, and this page does not use it to attribute money to anyone. That work also sets the rule: description, never scores. |
| conteudo | The recovery-plan totals that appear in that work’s reading are sums over the public register, attributed to the concelho by that register. Of the money contracted in the concelho, the university holds more than the municipality, and the layer that administers the money is made of national bodies. That this makes the accountability address something other than the town hall is that work’s own signed conclusion, and it sits on its page. |
| conteudo | The regulator |
| conteudo | The regulator and the municipality publish the same year’s debt with a difference between them. The difference is small, and it is shown because it is the only place where an outside voice and the municipality’s own voice measure the same thing. |
| conteudo | The regulator publishes |
| conteudo | The regulator’s annual series has not yet reached this term. |
| conteudo | The regulator’s annual series used on this page begins after this term. |
| conteudo | The thin line is the total debt the regulator publishes for the concelho; the bar is the distance to the legal limit for the same year, which is the rule on the right. The index measures one against the other on a scale whose cap is the permitted value. |
| conteudo | The works about this concelho |
| autorreferencia | There is no counterfactual for any index. Nothing that was read allows an executive’s share of them to be separated out. |
| conteudo | There is no per-person performance measure. Public accounts are not cut that way. |
| conteudo | Total debt |
| conteudo | What the municipality budgeted, what it collected, what it paid, and what it said it owed at year end. These are the municipality’s own figures about itself: the accounts are its own. |
| conteudo | What the sources publish about the municipality of Évora: population, purchasing power, employment, enterprises, debt and budget execution. |
| conteudo | What was budgeted, what was paid and what was left owing in the municipality of Évora. |
| conteudo | Who answers for what |
| conteudo | Who governed, and what the accounts recorded |
| conteudo | Who held each portfolio of the Câmara Municipal de Évora across five terms, how much the municipality’s own accounts spent in the areas those portfolios cover, and what the reports say those areas did. |
| conteudo | district of Évora · Alentejo Central |
| conteudo | distrito de Évora · Alentejo Central |

## O que saiu, e para onde

| frase retirada | classe | onde vive agora |
| --- | --- | --- |
| «Todos os campos preenchidos e conferidos contra a fonte. O selo é um quadrado cheio.» e «Falta pelo menos um campo de proveniência… O selo é um quadrado a tracejado.» (`livro.grupoCompletasV`, `livro.grupoPorConfirmarV`) | autorreferência | retiradas: o nome do grupo é o estado, e a contagem por baixo dele diz quantas linhas o têm (direção, 21.08.2026, tarde) |
| «Quadrado cheio: a proveniência está completa.» e «Quadrado a tracejado: falta pelo menos um campo, e a linha di-lo.» (a legenda do selo, `/livro-razao`) | conteúdo | encolheram para os nomes dos dois estados, «proveniência completa» e «um campo por confirmar», ao lado dos quadrados que já estavam desenhados |
| «Oito medidas. Seis vêm de organismos que publicam para todos os concelhos do país; duas só existem porque o próprio município as publica…» (`municipio.relanceSub`) | autorreferência | retirada: contagens por extenso (IDENTIDADE.md §10) e cobertura explicada; cada medida do próprio município di-lo na sua linha |
| «Uma frase por medida. Todos os números são citações do livro-razão.» (`municipio.breveSub`) | autorreferência | retirada: a segunda metade é o trabalho do selo |
| «Cinco administrações, contadas como foram instaladas e não como foram eleitas…» e «Uma administração responde pelas decisões que tomou. Não responde por um índice… Não há aqui nenhuma tabela classificativa de partidos, e não vai haver.» (`municipio.tempoBreve`, `municipio.tempoAtribuicaoV`) | autorreferência | retiradas; «Quem responde pelo quê» fica como nome da secção, por cima da banda dos mandatos |
| «Cada um tem a sua página, com a medida que o faz valer a pena, a frase do que concluiu, o método e o documento original quando está alojado aqui.» (`municipio.estudosV`) | autorreferência | retirada: cada cartão leva o título do trabalho, a sua frase e a porta |
| «Cada valor tem linha no livro-razão, com fonte, documento e data de acesso.» (segunda frase da descrição do `<head>` de um concelho) | autorreferência | o Método e o recibo de cada linha; a descrição passa a nomear o que a página tem |
| «Mapa de pontos dos municípios de Portugal. **Use as setas para percorrer os municípios.**» (`inicio.mapa.svgLabel`) | autorreferência | a instrução fica só em `tecladoHint`, dentro de `#mapa-descricao`, que só se constrói onde o script que a torna verdadeira está carregado |
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
| «O selo de proveniência junto a cada número é a porta para a sua linha. É este o índice dessas portas.» (`livro.lede2`, a segunda lede do índice) | autorreferência | o selo, que é a porta; a chave saiu de `strings.mjs` nas duas edições |
| «É o único marcador de incerteza deste sítio. Aparece onde um campo não foi confirmado contra a fonte. Não é um valor por defeito nem uma estimativa: é a ausência declarada.» (`livro.marcadorV`) | autorreferência | `/a-verificar`, que é a página do marcador; a marca e a porta ficam no índice |
| «O que este índice não diz» e «Só estão aqui os números que este sítio publica…» (`livro.naoDizK`, `livro.naoDizV`) | autorreferência | retiradas: é a classe que a Emenda 15 nomeia por extenso, «nunca o que não afirmamos» |
| «Observatório de dados sobre Portugal. Cada número publicado tem uma linha no livro-razão, com fonte, documento e data de acesso.» (descrição do `<head>` da primeira página) | autorreferência | o Método e o recibo de cada linha; a descrição passa a nomear o que a página tem |
