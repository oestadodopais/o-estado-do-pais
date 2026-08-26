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

## A regra, escrita uma vez (direção, 21.08.2026, tarde)

> **Uma frase sobrevive numa página do leitor se a sua remoção fizesse um leitor
> ler mal um número. Ficam as ressalvas sobre os dados (limites, bandeiras de
> provisório, definições); sai tudo o que existe para mostrar diligência.**
>
> *A sentence survives on a reader's page if removing it would make a reader read
> a number wrongly. The caveats about the data stay (limits, provisional flags,
> definitions); everything that exists to show diligence goes.*

É o teste da Emenda 15, dito em duas linhas, e é o que decide cada classificação
desta tabela a partir daqui. Uma frase sobre os LIMITES DO QUE A FONTE PUBLICA é
conteúdo, por mais longa que seja; uma frase sobre o CUIDADO DA CASA sai, por
mais curta que seja. O mesmo teste está em `direcao.md`, por baixo da Emenda 15.

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

**A frase de identidade é NAVEGAÇÃO (Emenda 18, 25.08.2026).** «Um observatório
de Portugal.» e «An observatory of Portugal.», por baixo da marca e só na
primeira página, entram na segunda classe pela razão que a emenda escreve: a
frase de identidade nomeia o que o sítio é, como o nome da publicação, e não diz
como ele trabalha nem porque se deve confiar nele. O teste da Emenda 15 continua
a valer sobre ela: não é o método, não é a verificação, não é a cobertura, não é
uma intenção. A rota `home` continua a ler autorreferência 0, e é a régua que o
imprime.

## As frases que ficaram, e porquê

A coluna do texto é a cadeia normalizada, tal como a régua a lê (espaços
colapsados). As duas edições partilham a mesma tabela: uma frase entra uma vez,
na língua em que é rendida.

**A tabela perdeu 25 das suas 65 linhas com a Emenda 19 (26.08.2026), e nenhuma
saiu por ser autorreferência.** Saíram porque a vista de escolha da primeira
página saiu inteira, e com ela os estados `?ambito=municipio:<slug>`: a primeira
página deixou de ter blocos de concelho. Contam-se assim:

* **dez deixaram de ser rendidas em rota nenhuma** e saíram do ficheiro: a
  manchete e o rótulo do bloco do concelho sem linhas («Ainda sem linhas para
  Águeda .», «Águeda · município · distrito de Aveiro» e as gémeas inglesas), a
  manchete e o rótulo do bloco de Évora («As medidas do concelho, cada uma com a
  sua linha.», «Évora · município · distrito de Évora» e as gémeas), e «Évora ·
  município» e «Évora · municipality», que eram o âmbito das peças daquele
  painel;
* **quinze mudaram de rota, e estão agora na tabela de `/municipios/evora`**: as
  notas das oito medidas do concelho nas duas edições, «Évora», e as duas
  palavras da ausência («sem linha ainda» e «no row yet»). Não saíram do sítio:
  saíram da PRIMEIRA PÁGINA, onde eram uma segunda rendição da página do
  concelho, e continuam a ler-se na página dele;
* **duas mudaram de texto**, e são a descrição acessível do mapa nas duas
  edições: perderam a terceira frase, «Toque num ponto para escolher o
  concelho.», que descrevia um gesto que a página deixou de fazer. Um ponto com
  página é uma ligação, e um destino diz-se na ligação e no seu `<title>`.

«fechar» e «trocar de concelho» não estão nesta contagem, e a razão é a
definição: um bloco cujo texto é todo ele uma ligação ou um botão não é uma frase
da casa (`textoForaDeComandos` em `scripts/medir-defeitos.mjs`), e nunca entrou
nesta tabela. «fechar» deixou de se render; «trocar de concelho» rende-se onde o
cartão localizador vive, na página do concelho, e leva ao índice dos 308.

| classe | texto |
| --- | --- |
| conteudo | A régua da convergência |
| navegacao | An observatory of Portugal. |
| conteudo | Alentejo · region |
| conteudo | Alentejo · região |
| conteudo | Algarve · region |
| conteudo | Algarve · região |
| navegacao | As regiões publicadas na régua da convergência. |
| navegacao | At a glance |
| navegacao | Brief reading |
| conteudo | Dívida bruta das administrações públicas, no conceito do Procedimento dos Défices Excessivos. Está acima do limiar do painel europeu, e a descer. |
| navegacao | Encontrou um erro? correcoes@oestadodopais.pt · O registo de correções → |
| conteudo | European Social Scoreboard |
| navegacao | Found an error? correcoes@oestadodopais.pt · The corrections log → |
| conteudo | General government gross debt, on the Excessive Deficit Procedure concept. It is above the European scoreboard threshold, and falling. |
| conteudo | Grande Lisboa · região |
| conteudo | Greater Lisbon · region |
| navegacao | Hover over a point to read the municipality. Keyboard: Tab to the map, arrow keys to move between neighbouring municipalities, Home to return to Évora. |
| navegacao | Leitura breve |
| conteudo | Madeira · region |
| conteudo | Madeira · região |
| navegacao | Nenhum concelho com esse nome. |
| navegacao | No municipality by that name. |
| navegacao | O Estado do País |
| conteudo | O que o país tem a haver do exterior menos o que lhe deve: negativo quando deve mais do que tem a haver. |
| conteudo | O índice compara o PIB per capita de cada território, medido em paridades de poder de compra, com a média da UE-27. Um valor abaixo da média significa menos poder de compra por pessoa; um valor acima, mais. |
| conteudo | Painel Social Europeu |
| navegacao | Passe o cursor sobre um ponto para ler o município. Teclado: Tab até ao mapa, setas para percorrer os municípios vizinhos, Home para voltar a Évora. |
| conteudo | Península de Setúbal · região |
| conteudo | Portugal breaches 4 thresholds of the Macroeconomic Imbalance Procedure and meets 9 . |
| conteudo | Portugal nos painéis europeus: os indicadores, os limiares e as fontes. |
| conteudo | Portugal on the European scoreboards: the indicators, the thresholds and the sources. |
| conteudo | Portugal ultrapassa 4 limiares do Procedimento dos Desequilíbrios Macroeconómicos e cumpre 9 . |
| conteudo | Portugal · country |
| conteudo | Portugal · país |
| navegacao | Relance |
| conteudo | Setúbal Peninsula · region |
| conteudo | The convergence rule |
| conteudo | The index compares each territory’s GDP per capita, measured in purchasing power standards, with the EU-27 average. A value below the average means less purchasing power per person; a value above it, more. |
| navegacao | The regions published on the convergence rule. |
| conteudo | What the country is owed from abroad minus what it owes abroad: negative when it owes more than it is owed. |

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
| navegacao | Um observatório de Portugal. |
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
| conteudo | Every municipality in Portugal, from the official administrative map. |
| conteudo | Every municipality, from the Carta Administrativa Oficial de Portugal. |
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
| conteudo | The municipalities of Portugal |
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
| conteudo | A última prestação de contas do município |
| conteudo | Accounts of the year before last |
| navegacao | Background |
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
| conteudo | Estimativa anual do INE para o concelho. |
| conteudo | Executive installed |
| conteudo | Executivo instalado |
| conteudo | Expenditure paid |
| conteudo | Fifteen years of municipal government in Évora, across five terms. |
| conteudo | Fora do que foi lido. |
| conteudo | Fora do que foi lido: as capturas que sustentam a repartição de pelouros começam no mandato seguinte. |
| navegacao | Fundo |
| conteudo | Herdou |
| conteudo | In office. |
| conteudo | Inherited |
| conteudo | Inscritos no fim do mês nos serviços de emprego, ficheiro mensal por concelho. |
| conteudo | Left |
| conteudo | Limite de dívida |
| conteudo | Lugares |
| conteudo | Margem de endividamento |
| conteudo | Method and caveats |
| conteudo | Método e ressalvas |
| conteudo | Not established. The work on the portfolios says this term «is one line of a map, not a map»: the president of that mandate, and every other member of it, were not identified. |
| conteudo | Não estabelecido. O trabalho sobre os pelouros diz que este mandato «é uma linha de um mapa, não um mapa»: o presidente desse mandato, e todos os outros membros dele, não foram identificados. |
| conteudo | Não existe contrafactual para nenhum índice. Nada do que foi lido permite separar a parte de um executivo neles. |
| conteudo | Não existe medida de desempenho por pessoa. As contas públicas não são cortadas dessa maneira. |
| conteudo | O município publica |
| conteudo | O que as fontes publicam sobre o município de Évora: população, poder de compra, emprego, empresas, dívida e execução orçamental. |
| conteudo | O que foi orçamentado, o que foi pago e o que ficou em dívida no município de Évora. |
| conteudo | O que o município orçamentou, o que cobrou, o que pagou, e o que dizia dever no fim do ano. São números do próprio município sobre si mesmo: a prestação de contas é dele. |
| conteudo | O regulador |
| conteudo | O regulador publica |
| conteudo | O traço fino é a dívida total que o regulador publica para o concelho; a barra é a distância até ao limite legal do mesmo ano, que é o fio da direita. O índice mede uma contra o outro numa escala em que o teto é o valor permitido. |
| conteudo | On the recovery plan: the work reads the state auditor’s catalogue, not its audits; the contracts window is an upper bound on a truncated period; and no European Union figure exists for a municipality. |
| conteudo | Orçamento corrigido |
| conteudo | Os totais do plano de recuperação que aparecem na leitura desse trabalho são somas sobre o registo público, atribuídas ao concelho por esse registo. Do dinheiro contratado no concelho, a universidade tem mais do que o município, e a camada que administra o dinheiro é feita de organismos nacionais. Que daí resulte que o endereço da responsabilização não são os paços do concelho é a conclusão assinada desse trabalho, e está na página dele. |
| conteudo | Os trabalhos sobre este concelho |
| conteudo | Outside what was read. |
| conteudo | Outside what was read: the captures behind the portfolio split begin with the next term. |
| conteudo | Pelouros |
| conteudo | Poder de compra per capita, publicado pelo INE para todos os concelhos. |
| conteudo | Portfolios |
| conteudo | Provenance |
| conteudo | Proveniência |
| conteudo | Purchasing power per capita, published for every municipality. |
| conteudo | Quem administrou, e o que as contas registaram |
| conteudo | Quem responde pelo quê |
| conteudo | Quinze anos de governo municipal em Évora, ao longo de cinco mandatos. |
| conteudo | Receita cobrada |
| conteudo | Registered with the employment service at month end, monthly file by municipality. |
| conteudo | Reportado pelo município: sai da prestação de contas do próprio, não de um agregador central. |
| conteudo | Reported by the municipality: it comes from its own accounts, not from a central aggregator. |
| conteudo | Revenue collected |
| conteudo | Seats |
| conteudo | Sobre o plano de recuperação: o trabalho lê o catálogo do tribunal de contas, não as suas auditorias; a janela de contratos é um limite superior sobre um período truncado; e não existe um valor da União Europeia para um município. |
| conteudo | The debt against the legal ceiling |
| conteudo | The gap between the two accounts of the same debt |
| conteudo | The municipality publishes |
| conteudo | The municipality’s latest accounts |
| conteudo | The recovery-plan totals that appear in that work’s reading are sums over the public register, attributed to the concelho by that register. Of the money contracted in the concelho, the university holds more than the municipality, and the layer that administers the money is made of national bodies. That this makes the accountability address something other than the town hall is that work’s own signed conclusion, and it sits on its page. |
| conteudo | The regulator |
| conteudo | The regulator and the municipality publish the same year’s debt with a difference between them. The difference is small, and it is shown because it is the only place where an outside voice and the municipality’s own voice measure the same thing. |
| conteudo | The regulator publishes |
| conteudo | The statistics institute’s annual estimate for the municipality. |
| conteudo | The thin line is the total debt the regulator publishes for the concelho; the bar is the distance to the legal limit for the same year, which is the rule on the right. The index measures one against the other on a scale whose cap is the permitted value. |
| conteudo | The works about this concelho |
| conteudo | There is no counterfactual for any index. Nothing that was read allows an executive’s share of them to be separated out. |
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
| conteudo | no row yet |
| conteudo | sem linha ainda |
| conteudo | Évora |

## `/correcoes` · `/en/corrections` (etapa 4, subetapa 4a)

*A rota entra na subetapa que reconstrói a forma do registo. **Nenhum bloco desta
página é autorreferência, e a razão não é indulgência: é o objecto da página.***
A Emenda 15 tira de uma página do leitor «nenhuma frase sobre o método, a
verificação, a honestidade, a cobertura ou as intenções do próprio sítio» — e a
política de correções é o CONTEÚDO desta página, tal como a linha do livro-razão
é o conteúdo do índice. É a Emenda 17 que o diz por escrito: «a frase da política
vive em `/correcoes`.» A régua do índice já classificava assim a sua lede («Uma
linha por número publicado. Cada linha guarda o valor…»), e é a mesma leitura.*

*O que aqui seria autorreferência é uma frase sobre outra coisa que o sítio faz —
o selo, a cobertura, a verificação de uma linha — e não existe nenhuma. As duas
frases da caixa de correções são **navegação**: dizem como se usa um comando, que
é o que a lista declarada chama navegação.*

| classe | texto |
| --- | --- |
| conteudo | 26 provenance revisions |
| conteudo | 26 revisões de proveniência |
| conteudo | A política |
| conteudo | A política de correções deste sítio e o registo de todas: o valor anterior à vista, datado, com o motivo, e nada apagado. |
| conteudo | An entry in the register holds the previous value, the new value, the date, the reason and the ledger row that changed. Nothing is removed: a corrected entry is added to that row’s history, it does not replace it. There are three kinds, and they are not mixed: |
| conteudo | Anyone who finds an error writes to correcoes@oestadodopais.pt . A confirmed error enters the register with credit to whoever found it, if they wish. |
| conteudo | Atualização. O valor estava certo e deixou de estar, porque aquilo que mede mudou. Não é um erro. |
| conteudo | Atualizações |
| conteudo | Correcting in silence is the cheapest way of lying. |
| conteudo | Correction. The published value was wrong. It is a confession, and it is the reason the register exists. |
| conteudo | Corrections |
| conteudo | Correção. O valor publicado estava errado. É uma confissão, e é a razão de o registo existir. |
| conteudo | Correções |
| conteudo | Corrigir em silêncio é a forma mais barata de mentir. |
| navegacao | Escreva aqui e o botão abre o seu programa de correio com o texto já dentro. Nada é enviado deste sítio: a mensagem sai de si, para si ficar com uma cópia. |
| conteudo | Escrever uma correção |
| navegacao | If the button opens nothing, your computer has no mail program set up. In that case copy the address above and write from wherever you normally write. |
| conteudo | O que foi corrigido, e o que mudou |
| conteudo | O registo |
| conteudo | O valor não mudou; mudou a maneira de lá chegar: uma fonte que muda de endereço, por exemplo. Não são erros nem atualizações, e não se listam aqui uma a uma: são muitas de cada vez e afogariam as correções. Cada linha abaixo leva à sua própria história, onde a revisão está escrita por extenso. |
| conteudo | Provenance revision. The value did not change; the route to the source did, an address for example. It is neither an error nor an update. |
| conteudo | Provenance revisions |
| conteudo | Quem encontrar um erro escreve para correcoes@oestadodopais.pt . Um erro confirmado entra no registo com crédito a quem o encontrou, se o desejar. |
| conteudo | Revisão de proveniência. O valor não mudou; mudou o caminho até à fonte, um endereço por exemplo. Não é erro nem atualização. |
| conteudo | Revisões de proveniência |
| navegacao | Se o botão não abrir nada, o seu computador não tem programa de correio configurado. Nesse caso copie o endereço acima e escreva de onde costuma escrever. |
| conteudo | The corrections policy of this site and the register of them all: the previous value in plain sight, dated, with the reason, and nothing deleted. |
| conteudo | The policy |
| conteudo | The register |
| conteudo | The value did not change; the way to find it did: a source that moves address, for example. They are neither errors nor updates, and they are not listed one by one here: they come many at a time and would drown the corrections. Each row below leads to its own history, where the revision is written out in full. |
| conteudo | Uma entrada do registo guarda o valor anterior, o valor novo, a data, o motivo e a linha do livro-razão que mudou. Nada é removido: uma entrada corrigida acresce à história daquela linha, não a substitui. São três naturezas, e não se misturam: |
| conteudo | Update. The value was right and stopped being so, because what it measures changed. It is not an error. |
| conteudo | Updates |
| conteudo | Valores que estavam certos e deixaram de estar, porque aquilo que medem mudou. Não são erros, e não contam para o número acima. |
| conteudo | Valores que estavam errados. Cada um fica com o valor anterior à vista, datado, e nenhum é removido. |
| conteudo | Values that were right and stopped being so, because what they measure changed. They are not errors, and they do not count towards the number above. |
| conteudo | Values that were wrong. Each keeps its previous value in plain sight, dated, and none is removed. |
| conteudo | What was corrected, and what changed |
| conteudo | Write a correction |
| navegacao | Write here and the button opens your own mail program with the text already in it. Nothing is sent from this site: the message leaves from you, so you keep a copy of it. |

## `/agenda` · `/en/agenda` (etapa 4, subetapa 4c)

*A rota entra na subetapa que reconstrói a página. **Seis frases saíram** e vão
listadas em `RELOCACOES.md`: a lede, a nota de origem, o parágrafo do estado
vazio de «Retirado», as duas notas da pergunta (que ficaram numa), o parágrafo do
item sem critérios e a segunda frase da lede do calendário. O que sobrou é o
nome de cada estado, o nome de cada campo do item, e três frases que dizem o que
a coisa é.*

*A frase da pergunta fica, e a razão é a regra: «O registo do motor escreve-se em
inglês: o inglês é a forma registada, palavra por palavra…». Um leitor da edição
portuguesa que a não tivesse tomaria a tradução pelo registo, e é isso que a
regra da direção chama ler mal. As duas palavras dos estados vazios («Nenhum até
hoje.», «Sem critério.») são a ausência dita como a Emenda 15 manda. «Nesta
página» é o rótulo do sumário, e é navegação: leva a outro sítio da página.*

| classe | texto |
| --- | --- |
| conteudo | A pergunta |
| conteudo | A seguir |
| conteudo | Com data publicada pela fonte |
| conteudo | Concluded |
| conteudo | Concluído |
| conteudo | Criteria |
| conteudo | Critérios |
| conteudo | Em curso |
| conteudo | Nenhum até hoje. |
| navegacao | Nesta página |
| conteudo | Next |
| conteudo | No criterion. |
| conteudo | None to date. |
| conteudo | O calendário das fontes |
| conteudo | O calendário, no tempo |
| conteudo | O que as fontes que este sítio cita publicam a seguir. |
| conteudo | O que este observatório está a medir, o que se segue, e o critério que pôs lá cada coisa. Com o calendário do que as fontes publicam a seguir. |
| conteudo | O que está em cada estado |
| conteudo | O que mudou |
| conteudo | O que se mede a seguir |
| conteudo | O registo do motor escreve-se em inglês: o inglês é a forma registada, palavra por palavra, e o português acima é a edição portuguesa dessa mesma pergunta. |
| navegacao | On this page |
| conteudo | Porquê |
| conteudo | Retirado |
| conteudo | Sem critério. |
| conteudo | Sem data, porque a fonte não publica nenhuma |
| conteudo | The calendar, in time |
| conteudo | The engine’s record is written in English: the English is the registered form, word for word, and the Portuguese edition renders that same question. |
| conteudo | The question |
| conteudo | The source calendar |
| conteudo | Under way |
| conteudo | What changed |
| conteudo | What gets measured next |
| conteudo | What is in each state |
| conteudo | What the sources this site cites publish next. |
| conteudo | What this observatory is measuring, what comes next, and the criterion that put each thing there. With the calendar of what the sources publish next. |
| conteudo | Why |
| conteudo | With a date the source publishes |
| conteudo | With no date, because the source publishes none |
| conteudo | Withdrawn |

## `/estudos` · `/en/studies` e as páginas de trabalho (etapa 4, subetapa 4e)

*Vinte e quatro rotas (o índice e onze trabalhos, nas duas edições), e **106
blocos distintos**. A esmagadora maioria é o que a coisa medida é: o nome de uma
medida, a sua unidade escrita, a descrição de um trabalho, e as ressalvas do
próprio trabalho sobre o que as suas fontes permitem estabelecer. As ressalvas
são longas e ficam todas: são limites dos dados, que é a metade da regra que
sobrevive.*

*Duas frases saíram de dentro de blocos que ficaram, e vão listadas em
`RELOCACOES.md`: «Inventar uma frase seria pior do que mostrar a falta.» e a
inglesa, no fim da nota que explica porque é que dois selos aparecem
tracejados. O limite fica; o cuidado da casa sai. Saíram também cinco cadeias da
mobília (`RELOCACOES.md`), entre elas o rótulo «Leitura publicada», que era a
casa a dizer de si que tinha acabado o trabalho por cima de uma página onde o
trabalho está à vista.*

*«A ligação sai deste domínio.» é **navegação**: avisa que o comando ao lado leva
o leitor para fora do sítio. Os dois rótulos de estado que ficam («Rascunho · sem
conteúdo», «Documento alojado · página por escrever») são a ausência declarada,
e por isso conteúdo.*

| classe | texto |
| --- | --- |
| conteudo | % desse valor está nas quatro maiores empresas |
| conteudo | % dez anos depois |
| conteudo | % do orçamento foi de facto cobrado no último ano de contas |
| conteudo | % four years earlier |
| conteudo | % of that value sits with the four largest enterprises |
| conteudo | % of the budget was actually collected in the latest year of accounts |
| conteudo | % quatro anos antes |
| conteudo | % ten years later |
| conteudo | A correspondência entre as contas e os pelouros é deste trabalho, declarada por ele como sua e não como oficial, e o próprio trabalho diz quais das suas linhas a recusam. Nenhuma dessas linhas atravessou para o livro-razão, e por isso esta página não conta quantas são. A regra que o trabalho fixa é: descrição, nunca classificações. |
| conteudo | A cross-vertical reading of one Portuguese municipality: the recovery-plan project register, the public-contracts register and the state auditor's catalogue, all fetched live on 2026-08-04, and the recovery-plan register read again on 2026-08-20. |
| conteudo | A frase acima diz que a dívida total ficou abaixo do limite. São estes os dois valores: a dívida total no fim do ano, e o limite legal do mesmo ano, ambos da prestação de contas do município. |
| navegacao | A ligação sai deste domínio. |
| conteudo | A mesma medida de concentração, para Portugal inteiro, é a que dá escala à do concelho. |
| conteudo | A secção de auditoria lê o catálogo do tribunal de contas, não as suas auditorias. A secção de contratos é um limite superior sobre uma janela truncada. E não existe um valor da União Europeia para um município: não é que não se tenha encontrado; a granularidade não existe na fonte. |
| conteudo | A universidade tem mais dinheiro contratado neste concelho do que o município, e a camada que administra o dinheiro é feita de organismos nacionais. O trabalho conclui daí que «o endereço da responsabilização, na maior parte dos casos, não são os paços do concelho», é a leitura dele, assinada, e não uma contagem: um leitor que queira este total explicado deve dirigir as perguntas aos organismos nacionais e à universidade mais vezes do que à câmara. |
| conteudo | As contagens de financiamento são um limite superior: o filtro lê programas, não o corpo dos avisos. E a secção de oportunidades é inferência assinada pelo autor do trabalho, ancorada nos factos com fonte, não aconselhamento. |
| conteudo | As contas do penúltimo ano foram rejeitadas em votação e nunca foram certificadas. |
| conteudo | As decisões vão atribuídas a quem as tomou, com o rótulo da lista; os índices são mostrados contra as fronteiras dos mandatos e não são atribuídos a ninguém. Nada do que o trabalho leu fornece o contrafactual que recortaria a parte de um executivo neles. |
| conteudo | Avaliação económica das regiões de Portugal. |
| conteudo | Datas de publicação por confirmar. |
| conteudo | Decisions are attributed to whoever took them, with the list label; indices are displayed against the mandate boundaries and are attributed to nobody. Nothing the work read provides the counterfactual that would carve out an executive’s share of them. |
| conteudo | Description: house translation of the document’s opening sentence |
| conteudo | Description: opening sentence of the document |
| conteudo | Description: restatement of the title |
| conteudo | Descrição: frase de abertura do documento |
| conteudo | Descrição: reformulação do título |
| conteudo | Descrição: tradução da casa da frase de abertura do documento |
| conteudo | designations, over three people, in the next executive |
| conteudo | designações, por três pessoas, no executivo seguinte |
| conteudo | Document hosted · page not yet written |
| conteudo | Documento alojado · página por escrever |
| conteudo | Economia, sociedade e estratégia no Alentejo e no Algarve. |
| conteudo | Economic assessment of Portugal’s regions. |
| conteudo | Economy, society and strategy in the Alentejo and the Algarve. |
| conteudo | EN [a verificar] |
| conteudo | EN Economic assessment of Portugal’s regions. |
| conteudo | EN Economy, investors and open doors in the municipality of Évora. |
| conteudo | EN Economy, society and strategy in the Alentejo and the Algarve. |
| conteudo | EN Fifteen years of municipal government in Évora, across five terms. |
| conteudo | EN Long series on the country’s evolution. |
| conteudo | EN Non-revenue water in Portugal’s public supply systems. |
| conteudo | EN Public funding in Portugal. |
| conteudo | EN What was budgeted, what was paid and what was left owing in the municipality of Évora. |
| conteudo | EN Who held each portfolio of the Câmara Municipal de Évora across five terms, how much the municipality’s own accounts spent in the areas those portfolios cover, and what the reports say those areas did. |
| conteudo | Estes dois valores são somas sobre o registo público inteiro do plano de recuperação, não uma linha de um documento. Não há nenhuma frase para transcrever, e por isso o excerto da linha está [a verificar] e o selo aparece a tracejado. |
| conteudo | Estudos |
| conteudo | Financiamento público em Portugal. |
| conteudo | Long series on the country’s evolution. |
| conteudo | No files to download. |
| conteudo | No subject assigned |
| conteudo | Non-revenue water in Portugal’s public supply systems. |
| conteudo | Não existe PIB da cidade, e o trabalho não inventa nenhum. O que existe ao nível do concelho é o registo empresarial: as contas das empresas sediadas no concelho, que creditam toda a atividade de uma empresa ao concelho da sua sede. Não é PIB municipal, e o próprio trabalho escreve porquê nos seus limites: «não capta a administração pública, a maior parte da universidade e do hospital». |
| conteudo | O arquivo de estudos publicados, com as suas edições em português e em inglês. |
| conteudo | O arquivo do observatório: cada estudo publicado, com as suas edições, datas e estado de migração. O que ainda não vive aqui está ligado onde vive. |
| conteudo | O padrão contra o qual estas contas se comparam está um ano atrás, e o estudo completo que o publica não é público. |
| conteudo | O sistema contabilístico mudou por baixo da série, um ano de contas foi publicado em digitalizações e outro não foi publicado de todo. O trabalho marca com um asterisco os valores lidos da coluna comparativa de um relatório posterior, e com uma adaga os recuperados de uma digitalização degradada; nenhum valor marcado assim atravessou para este livro-razão. |
| conteudo | O valor aprovado em localizações cuja data prevista de conclusão já passou sem conclusão registada. |
| conteudo | O índice de poder de compra do INE é o único indicador que existe para um concelho, e é o que sustenta a primeira metade da frase acima: o concelho de um lado da média nacional, a sua região do outro. A média nacional é a base do índice. |
| conteudo | PT [a verificar] |
| conteudo | PT Avaliação económica das regiões de Portugal. |
| conteudo | PT Economia, investidores e portas abertas no município de Évora. |
| conteudo | PT Economia, sociedade e estratégia no Alentejo e no Algarve. |
| conteudo | PT Financiamento público em Portugal. |
| conteudo | PT O que foi orçamentado, o que foi pago e o que ficou em dívida no município de Évora. |
| conteudo | PT Quinze anos de governo municipal em Évora, ao longo de cinco mandatos. |
| conteudo | PT Séries longas sobre a evolução do país. |
| conteudo | PT Água não faturada nos sistemas de abastecimento em Portugal. |
| conteudo | Public funding in Portugal. |
| conteudo | Publication dates not yet confirmed. |
| conteudo | Quem teve cada pelouro da Câmara Municipal de Évora ao longo de cinco mandatos, quanto gastaram as contas do próprio município nas áreas que esses pelouros cobrem, e o que os relatórios dizem que essas áreas fizeram. |
| conteudo | Sem ficheiros para descarregar. |
| conteudo | Sem tema atribuído |
| conteudo | Studies |
| conteudo | Séries longas sobre a evolução do país. |
| conteudo | The accounting system changed underneath the series, one year of accounts was published as scans and another was not published at all. The work marks with an asterisk the figures read from a later report’s comparative column, and with a dagger those recovered from a degraded scan; no figure marked either way crossed into this ledger. |
| conteudo | The accounts of the second-to-last year were rejected in a vote and were never certified. |
| conteudo | The archive of published studies, with their Portuguese and English editions. |
| conteudo | The audit section reads the state auditor’s catalogue, not its audits. The contracts section is an upper bound on a truncated window. And there is no European Union figure for a municipality: it is not that none was found; the granularity does not exist in the source. |
| conteudo | The funding counts are an upper bound: the filter reads programmes, not the bodies of the calls. And the opportunity section is inference signed by the work’s author, grounded in sourced facts, not advice. |
| navegacao | The link leaves this domain. |
| conteudo | The mapping between the accounts and the portfolios is this work’s own, declared by it as its own and not as official, and the work itself says which of its lines refuse it. None of those lines crossed into the ledger, so this page does not count them. The rule the work sets is: description, never scores. |
| conteudo | The observatory’s archive: every published study, with its editions, dates and migration state. What does not live here yet is linked where it lives. |
| conteudo | The same concentration measure, for Portugal as a whole, is what gives the concelho figure its scale. |
| conteudo | The sentence above says total debt stayed below the limit. These are the two values: total debt at year end, and the legal limit for the same year, both from the municipality’s own accounts. |
| conteudo | The statistics institute’s purchasing-power index is the one indicator that exists for a concelho, and it is what carries the first half of the sentence above: the concelho on one side of the national average, its region on the other. The national average is the base of the index. |
| conteudo | The university holds more contracted money in this concelho than the municipality, and the layer that administers the money is made of national bodies. The work concludes from that that «the accountability address is mostly not the town hall», its own signed reading, not a count: a reader who wants this total explained should put questions to national bodies and to the university more often than to the council. |
| conteudo | The value approved at locations whose planned completion date has passed with no completion recorded. |
| conteudo | The yardstick these accounts are compared against is one year behind, and the full study that publishes it is not public. |
| conteudo | There is no GDP figure for the city, and the work invents none. What exists at concelho level is the business register: the accounts of enterprises headquartered in the concelho, which credit a firm’s whole activity to its head-office concelho. It is not municipal GDP, and the study itself writes why in its own limits: «it misses public administration, most of the university and the hospital». |
| conteudo | These two values are sums over the whole public register of the recovery plan, not a line in a document. There is no sentence to transcribe, so the row’s excerpt reads [a verificar] (to verify) and the seal shows dashed. |
| conteudo | Uma leitura transversal de um município português: o registo de projetos do plano de recuperação, o registo de contratos públicos e o catálogo do tribunal de contas do Estado, recolhidos em direto a 2026-08-04, e o registo do plano de recuperação relido a 2026-08-20. |
| conteudo | Água não faturada nos sistemas de abastecimento em Portugal. |
| conteudo | € actually paid |
| conteudo | € approved and attributed to the concelho by the recovery-plan register |
| conteudo | € aprovados e atribuídos ao concelho pelo registo do plano de recuperação |
| conteudo | € de valor acrescentado bruto das empresas sediadas no concelho |
| conteudo | € efetivamente pagos |
| conteudo | € of gross value added by enterprises headquartered in the concelho |

## `/estudos/<slug>/texto` · `/en/studies/<slug>/text` (parte 3, P2)

*Oito rotas (seis edições portuguesas e duas inglesas), e **sete blocos
distintos por edição**. É a rota mais magra do inventário, e é assim de
propósito: **o corpo desta página é um documento, não a casa**. Os 829 blocos de
prosa de estudo que ela rende não entram aqui porque não são frases da casa — a
régua aprendeu a nona origem (`data-registo`, `data-registo-unidade`,
`data-registo-linha`, `data-registo-conta`) antes de contar estas páginas, pela
mesma razão que já sabia `data-verbatim` e `data-agenda`. **Medido**: sem essa
lição, a contagem de frases de moldura do sítio saltava de 90 para 148 distintas
e de 2 530 para 3 051 ocorrências, com resumos de origem, nomes de entidades e
títulos de relatórios do Tribunal de Contas a contarem como moldura da casa; com
ela, fica em 91 e 2 542, e o único acrescento é o par de portas «Ler o documento
→ Ler no sítio →» da página do estudo.*

*As sete são rótulos: um antetítulo não entra (a régua conta blocos de texto e o
antetítulo é um `<span>`), os quatro campos de «As linhas deste documento»
nomeiam campos, e os três títulos nomeiam secções. **Autorreferência: zero**,
nas oito páginas e nas duas edições. As palavras da faixa das contagens («blocos
· algarismos · com linha do livro-razão») também não entram, e a razão é a mesma
das outras origens declaradas: a faixa está dentro de `data-registo-conta`, que o
portão reconta do registo em disco.*

| classe | texto |
| --- | --- |
| conteudo | As linhas deste documento |
| conteudo | O documento original |
| conteudo | O registo de conteúdo |
| conteudo | The content record |
| conteudo | The original document |
| conteudo | The rows of this document |
| conteudo | as this document prints it |
| conteudo | como este documento o imprime |
| conteudo | engine row |
| conteudo | linha do motor |
| conteudo | o valor como a linha o guarda |
| conteudo | resumo de origem |
| conteudo | source digest |
| conteudo | the value as the row keeps it |

## A reclassificação de 21.08.2026 (direção): **limite dos dados**

| frase | era | é | razão |
| --- | --- | --- | --- |
| «Não existe contrafactual para nenhum índice. Nada do que foi lido permite separar a parte de um executivo neles.» / «There is no counterfactual for any index…» (entrada de «O que esta página não sabe», `/municipios/evora`) | autorreferência | **conteúdo** | **limite dos dados**. Não fala do cuidado da casa: diz o que as fontes lidas não permitem estabelecer. Sem ela, a banda dos mandatos ao lado de uma curva de dívida lê-se como uma atribuição, e um leitor lê mal um número. É a metade da regra que fica |

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
| «Nenhuma decisão deste mandato atravessou para o livro-razão com valor próprio. Um campo em branco seria diferente disto: o que falta é a linha, não a decisão.» (`decidiuNota` de um mandato de Évora) | autorreferência | o campo diz «sem linha ainda» / «no row yet», a cadeia da casa para a ausência (direção, 21.08.2026, tarde) |
| «As decisões desta página vão atribuídas a quem as tomou… Os índices … não vão atribuídos a ninguém: nada do que foi lido fornece o contrafactual…» (entrada «Um partido é dono das suas decisões, não de uma curva», secção «Método e ressalvas» de `/municipios/evora`) | autorreferência | retirada: é a nota de como a página foi feita. O limite dos dados que ela também dizia fica em «O que esta página não sabe», que é onde ele pertence |


## Bloco B das correções de UX · 25.08.2026

*As frases que este bloco criou ou mudou, com a classe e a razão. As entradas
inglesas do item B6 não são novas: são as mesmas de sempre com «concelho»
traduzido, e foram alteradas na tabela da sua rota, em vez de duplicadas aqui.*

**As três que o bloco A deixou por classificar, e que são desta rota** (a §1.66
nomeia-as): a contagem do índice do livro-razão, e as duas frases da leitura do
trabalho das penalizações. Entram aqui, que é o bloco a que pertencem.

| classe | frase |
|---|---|
| conteudo | 136 afirmações · 19 calculadas |
| conteudo | 136 claims · 19 calculated |
| conteudo | 128 de 136 linhas com proveniência completa |
| conteudo | 128 of 136 rows with complete provenance |
| conteudo | 8 de 136 linhas com campos por confirmar |
| conteudo | 8 of 136 rows with fields to confirm |
| conteudo | A edição de registo, tal como foi publicada. |
| conteudo | The record edition, as it was published. |
| conteudo | O que a lei cobra por antecipar a reforma, e o que seria atuarialmente neutro. |
| conteudo | What the law charges for retiring early, and what would be actuarially neutral. |
| conteudo | PT O que a lei cobra por antecipar a reforma, e o que seria atuarialmente neutro. |
| conteudo | EN What the law charges for retiring early, and what would be actuarially neutral. |
| conteudo | A quem cabe numa das exceções que afastam o fator de sustentabilidade, a lei corta menos do que o valor neutro. As duas medidas acima são os dois extremos da mesma decisão. |
| conteudo | For those who fall within one of the exceptions that set the sustainability factor aside, the law cuts less than the neutral figure. The two measures above are the two ends of the same decision. |
| conteudo | é o que a lei corta a quem não cabe numa das exceções |
| conteudo | is what the law cuts from those who fall outside the exceptions |
| conteudo | de redução da pensão seria atuarialmente neutro, por um ano de antecipação |
| conteudo | pension reduction would be actuarially neutral, for one year of anticipation |

**As frases inglesas da página de um concelho e das leituras que o item B6
mudou**, e que a régua lê como blocos novos porque o texto mudou:

| classe | frase |
|---|---|
| conteudo | € approved and attributed to the municipality by the recovery-plan register |
| conteudo | € of gross value added by enterprises headquartered in the municipality |
| conteudo | The works about this municipality |
| conteudo | The same concentration measure, for Portugal as a whole, is what gives the municipality figure its scale. |
| conteudo | The thin line is the total debt the regulator publishes for the municipality; the bar is the distance to the legal limit for the same year, which is the rule on the right. The index measures one against the other on a scale whose cap is the permitted value. |
| conteudo | There is no GDP figure for the city, and the work invents none. What exists at municipality level is the business register: the accounts of enterprises headquartered in the municipality, which credit a firm’s whole activity to its head-office municipality. It is not municipal GDP, and the study itself writes why in its own limits: «it misses public administration, most of the university and the hospital». |
| conteudo | The recovery-plan totals that appear in that work’s reading are sums over the public register, attributed to the municipality by that register. Of the money contracted in the municipality, the university holds more than the council, and the layer that administers the money is made of national bodies. That this makes the accountability address something other than the town hall is that work’s own signed conclusion, and it sits on its page. |
| conteudo | The university holds more contracted money in this municipality than the council, and the layer that administers the money is made of national bodies. The work concludes from that that «the accountability address is mostly not the town hall», its own signed reading, not a count: a reader who wants this total explained should put questions to national bodies and to the university more often than to the council. |
| conteudo | The statistics institute’s purchasing-power index is the one indicator that exists for a municipality, and it is what carries the first half of the sentence above: the municipality on one side of the national average, its region on the other. The national average is the base of the index. |

**O que este bloco NÃO acrescentou ao inventário, e é uma leitura e não um
esquecimento:** o índice «Nesta página» da página de leitura não entra, porque
cada entrada dele é um título transcrito do registo, com a marca
`data-registo-indice` que a régua já conta como origem declarada; e o comando
«Subir ↑» também não, porque o seu texto está todo dentro de um `<a>`.

## Passo C das correções de UX · 25.08.2026

*O passo C acrescentou **uma** frase da casa, e ela é o nome de uma secção do
índice dos concelhos (item C4, decisão 5 do diretor). As outras três correções
do passo não acrescentaram nenhuma: o item C1 moveu um índice que já estava
inventariado, o C2 mexeu numa folha de estilos, e o C3 trocou o ponto de código
de um separador dentro de um valor do livro-razão, que não é prosa da casa.*

| classe | frase |
|---|---|
| conteudo | Com página |
| conteudo | With a page |

**Porque é conteúdo.** É o nome do grupo de uma lista, como «Beja» ou «Ilha do
Faial» são o nome dos outros grupos da mesma página: diz por que critério
aquelas entradas estão juntas. As duas palavras do estado de cada entrada, «tem
página» e «sem página ainda», não mudaram e continuam a entrar pela marca
`data-cobertura`, que a régua exclui desta tabela e conta na medida 7.

**O que o passo C NÃO acrescentou, e é uma leitura e não um esquecimento:** o
rótulo da caixa de pesquisa («Escreva o nome do concelho») é um `<label>`, que
não é um bloco desta varredura; o estado vazio da pesquisa («Nenhum concelho com
esse nome.») já estava classificado como navegação pela primeira página, e a
tabela é por texto e não por rota; e os 308 resultados não entram, porque cada
um é um nome de concelho com a marca `data-cobertura` ao lado, que é a mesma
exclusão que a subetapa 3c escreveu para a lista por distritos.

## Bloco dos 308 concelhos (P2, 26.08.2026)

*As linhas com contagem levam o número de HOJE, e o ficheiro guarda as duas leituras, como já guardava «132 afirmações» ao lado de «136»: a de antes das linhas dos concelhos e a de depois. As entradas que este bloco acrescenta: os dois rótulos das medidas que desceram das peças para a camada das contas de Évora (decisão D2), a nota da dívida com a coluna que usa (D3), a nota do prazo médio lido do regulador, e a página do conjunto do livro-razão (D6) com a sua porta no índice. As duas linhas com contagem levam o número de hoje, como as outras deste ficheiro: quando as linhas dos concelhos chegarem, mudam com elas.*

| classe | texto |
| --- | --- |
| conteudo | Execução da receita |
| conteudo | Prazo médio de pagamento |
| conteudo | Revenue execution |
| conteudo | Average payment time |
| conteudo | 136 afirmações · 19 calculadas · 0 linhas de concelhos |
| conteudo | 136 claims · 19 calculated · 0 municipality rows |
| conteudo | 2552 afirmações · 325 calculadas · 2416 linhas de concelhos |
| conteudo | 2552 claims · 325 calculated · 2416 municipality rows |
| conteudo | 2544 de 2552 linhas com proveniência completa |
| conteudo | 2544 of 2552 rows with complete provenance |
| conteudo | 8 de 2552 linhas com campos por confirmar |
| conteudo | 8 of 2552 rows with fields to confirm |
| conteudo | 2416 linhas · 308 concelhos · 2416 com proveniência completa |
| conteudo | Uma linha por medida, com o valor tal como a fonte o publicou, a unidade, quem o produziu e a data em que foi lido. |
| conteudo | One row per measure, with the value as the source published it, the unit, who produced it and the date it was read. |
| conteudo | As linhas do livro-razão com as medidas que as fontes centrais publicam para o concelho de <lugar>. |
| conteudo | The ledger rows with the measures central sources publish for the municipality of <lugar>. |
| conteudo | Sistema de contas integradas das empresas; cada empresa conta num único concelho. |
| conteudo | Integrated business accounts; each enterprise counts in a single municipality. |
| conteudo | 2416 rows · 308 municipalities · 2416 with complete provenance |
| conteudo | Uma linha por medida e por concelho, com o valor tal como a fonte o publicou, a unidade, quem o produziu e a data em que foi lido. |
| conteudo | One row per measure and per municipality, with the value as the source published it, the unit, who produced it and the date it was read. |
| conteudo | As linhas do livro-razão com as medidas que as fontes centrais publicam para cada concelho, uma linha cada. |
| conteudo | The ledger rows with the measures central sources publish for each municipality, one row each. |
| conteudo | Linhas sem concelho declarado |
| conteudo | Rows with no municipality declared |
| conteudo | O que as fontes publicam sobre o município de <lugar>: população, poder de compra, emprego, empresas, dívida e execução orçamental. |
| conteudo | What the sources publish about the municipality of <lugar>: population, purchasing power, employment, enterprises, debt and budget execution. |
| conteudo | Concelhos: as medidas centrais |
| conteudo | Municipalities: the central measures |
| conteudo | 0 linhas · 0 concelhos · 0 com proveniência completa |
| conteudo | 0 rows · 0 municipalities · 0 with complete provenance |

## Bloco dos 308 concelhos · P2 (os dados), 26.08.2026

**UMA FRASE CORRIGIDA SAI DESTA LISTA.** O ficheiro guardava as duas leituras de uma contagem lado a lado, porque uma contagem volta a ser o que era no dia em que o livro-razão encolher. Uma frase que foi CORRIGIDA é outra coisa: se continuar declarada, repô-la passa em silêncio, e foi isso que se mediu ao plantar de volta a nota da sede e a que chamava «regulador» à DGAL — nenhuma das duas fechou nada. As entradas das frases que os itens E7 e E11 corrigiram saíram desta lista; repor uma delas passa a ser um bloco por classificar, e a régua fecha.

*As frases que os itens E7 a E12 mudaram: a nota das empresas, que deixou de afirmar o que a verificação das fontes não confirmou; a legenda da dívida, sem a oração em que o sítio falava de si; e as que chamavam «regulador» à Direção-Geral das Autarquias Locais. As duas últimas linhas da tabela são a frase que SAIU, declarada pelo que ela era: autorreferência. Fica declarada para que a régua a apanhe pelo nome se alguém a repuser, em vez de a apanhar como bloco por classificar.*

| classe | texto |
| --- | --- |
| conteudo | A Direção-Geral |
| conteudo | A Direção-Geral publica |
| conteudo | A série anual da Direção-Geral das Autarquias Locais ainda não chegou a este mandato. |
| conteudo | Lista anual da Direção-Geral das Autarquias Locais, que publica os dados das contas dos municípios. |
| conteudo | O limite é fixado no artigo 52.º da Lei n.º 73/2013: uma vez e meia a média da receita corrente líquida dos três anos anteriores. |
| conteudo | O traço fino é a dívida total que a Direção-Geral das Autarquias Locais publica para o concelho; a barra é a distância até ao limite legal do mesmo ano, que é o fio da direita. O índice mede uma contra o outro numa escala em que o teto é o valor permitido. |
| conteudo | Série anual da Direção-Geral das Autarquias Locais, que publica os dados das contas dos municípios. Exclui dívidas não orçamentais e exceções legais. |
| conteudo | The annual list of the local-government directorate, which publishes the municipalities’ accounts data. |
| conteudo | The annual series of the local-government directorate, which publishes the municipalities’ accounts data. Excludes non-budgetary debt and legal exceptions. |
| conteudo | The directorate-general |
| conteudo | The directorate-general publishes |
| conteudo | The limit is set by article 52.º of Lei n.º 73/2013: one and a half times the three-year average of net current revenue. |
| conteudo | The local-government directorate’s annual series has not yet reached this term. |
| conteudo | The thin line is the total debt the local-government directorate publishes for the municipality; the bar is the distance to the legal limit for the same year, which is the rule on the right. The index measures one against the other on a scale whose cap is the permitted value. |
| conteudo | Sem linhas ainda. |
| conteudo | No rows yet. |
| conteudo | A referência do estudo |
| conteudo | The study’s reference |
| conteudo | 2552 afirmações · 325 calculadas · 2417 linhas de concelhos |
| conteudo | 2552 claims · 325 calculated · 2417 municipality rows |
| conteudo | 2417 linhas · 308 concelhos · 2417 com proveniência completa |
| conteudo | 2417 rows · 308 municipalities · 2417 with complete provenance |
| autorreferencia | O limite é fixado no artigo 52.º da Lei n.º 73/2013: uma vez e meia a média da receita corrente líquida dos três anos anteriores. É a lei que o define, não este sítio. |
| autorreferencia | The limit is set by article 52.º of Lei n.º 73/2013: one and a half times the three-year average of net current revenue. The law defines it, not this site. |

## Bloco «A grelha da voz» · 26.08.2026

*As frases que o G5 mudou, com a decisão do diretor de 26.08: **as orações em
que a página fala de si saem, e a ressalva factual fica**. Saíram «e esta página
não fabrica nenhum», «a sua linha no livro-razão nomeia esse documento e a página
onde estão», «As duas estão nesta página» (nas duas entradas em que aparecia),
«mostra-se porque é o único sítio onde…», «e esta página não a usa para atribuir
dinheiro a ninguém», «e por isso esta página para aqui» e «usada nesta página». As
citações do trabalho 06 ficaram como citações, que é o que a decisão manda.*

*Saiu também o rótulo da camada da leitura breve, «Leitura breve · prosa da casa,
assente numa frase do trabalho»: a página a dizer de que género é o texto que traz
e em que assenta. A chave `leituraBreveRotulo` saiu de `src/i18n/strings.mjs` nas
duas edições e o gabarito passou a ler `leituraBreveK`, que já existia e não se
rendia; «Leitura breve» e «Brief reading» já estavam declaradas, e por isso não há
linha nova para elas.*

***As entradas antigas destas frases saíram do ficheiro***, e a razão é a que o
bloco dos 308 escreveu: uma frase CORRIGIDA que continue declarada volta em
silêncio. Saíram com elas nove entradas mais velhas das MESMAS frases, que os itens
E7, E10 e E11 daquele bloco corrigiram e deixaram para trás.

| classe | texto |
| --- | --- |
| conteudo | A Direção-Geral das Autarquias Locais e o município publicam a dívida do mesmo ano com uma diferença. A diferença é pequena. |
| conteudo | A execução da receita e o prazo médio de pagamento são lidos da prestação de contas do próprio município. As duas vozes de fora sobre estas contas são a opinião assinada do auditor e a série anual da Direção-Geral das Autarquias Locais. |
| conteudo | A série anual da Direção-Geral das Autarquias Locais começa depois deste mandato. |
| conteudo | As contagens de pelouros são designações, não despesa. A correspondência entre as contas e os pelouros existe num dos trabalhos, e é declarada por ele como sua e não como oficial. Esse trabalho fixa também a regra: descrição, nunca classificações. |
| conteudo | How far the debt exceeded the legal limit, in the first and the last year in which the report publishes it as a positive figure. After that the table turns negative, and a negative there is no longer excess but borrowing capacity. |
| conteudo | Nenhuma fonte publica um produto interno bruto para um concelho. O que existe é o registo empresarial: as contas das empresas do concelho, que creditam toda a atividade de uma empresa a um único concelho. Não é PIB municipal, e o trabalho sobre a economia escreve porquê nos seus limites: «não capta a administração pública, a maior parte da universidade e do hospital». |
| conteudo | No source publishes a gross domestic product for a municipality. What does exist is the business register: the accounts of the municipality’s enterprises, which credit a firm’s whole activity to a single municipality. It is not municipal GDP, and the work on the economy writes why in its own limits: «it misses public administration, most of the university and the hospital». |
| conteudo | O que a dívida excedia o limite legal, no primeiro e no último ano em que o relatório o publica como um valor positivo. Depois disso o quadro passa a números negativos, que já não são excesso mas capacidade de endividamento. |

### A frase da outra edição sai da página do trabalho

*A página de um trabalho imprimia, por baixo da leitura breve, a MESMA frase na
outra edição, com o rótulo «A mesma frase na outra edição». Era o sítio a provar
ao leitor que as duas edições dizem o mesmo, numa página do leitor: a classe que
a Emenda 15 tira de lá. As duas declarações do rótulo saem desta lista; a frase
da outra edição nunca esteve aqui, porque leva afirmações e a régua já a excluía
como origem declarada.*

*A prova muda de sítio e não se perde. `scripts/gate-html.mjs` passou a conferir,
em 39 peças das páginas de leitura, que as duas edições citam as mesmas
afirmações pela mesma ordem, e fecha a construção quando não citam. E a folga que
existia por causa daquele bloco saiu com ele: o selo de um valor tinha de abrir a
linha em QUALQUER uma das duas edições, e passa a ter de abrir a da própria
página.*
| conteudo | On this municipality’s accounts there are two voices that are not its own: the independent auditor’s signed opinion, and the local-government directorate’s annual series, which publishes per municipality and per year the same legal debt concept the report uses, compiled from outside. |
| conteudo | Revenue execution and the average payment time are read from the municipality’s own accounts. The two outside voices on these accounts are the auditor’s signed opinion and the local-government directorate’s annual series. |
| conteudo | Sobre as contas deste município existem duas vozes que não são a dele: a opinião assinada do auditor independente, e a série anual da Direção-Geral das Autarquias Locais, que publica por município e por ano o mesmo conceito legal de dívida que o relatório usa, compilada do lado de fora. |
| conteudo | The local-government directorate and the municipality publish the same year’s debt with a difference between them. The difference is small. |
| conteudo | The local-government directorate’s annual series begins after this term. |
| conteudo | The portfolio counts are designations, not spending. The mapping between the accounts and the portfolios exists in one of the works, and is declared by it as its own and not as official. That work also sets the rule: description, never scores. |

### A DGAL pelo nome, e a leitura da casa fora do rótulo

*O item E11 do bloco dos 308 tirou «o regulador» das notas das medidas e da
legenda da dívida, e não chegou a `src/data/leituras.mjs` nem ao rótulo do
relance da linha do tempo: a busca dele foi pelas notas das oito peças e pelas
cadeias de `strings.mjs` da página do concelho. Saem agora as três que ficaram. E
sai «legível», que é o sítio a descrever os limites da sua própria leitura: o
rótulo passa a nomear de que série são os dois números.*

| classe | texto |
| --- | --- |
| conteudo | % de índice de dívida no primeiro ano da série da Direção-Geral das Autarquias Locais |
| conteudo | % debt index in the first year of the local-government directorate’s series |
| conteudo | Antes do primeiro ano da série da Direção-Geral das Autarquias Locais. |
| conteudo | Before the first year of the local-government directorate’s series. |
| conteudo | As medidas deste trabalho vêm da prestação de contas do próprio município: o relato da gestão sobre o seu próprio ano. As duas vozes de fora são a opinião assinada do auditor independente e a série anual da Direção-Geral das Autarquias Locais, que publica por município e por ano o mesmo conceito legal de dívida, compilada do lado de fora. As duas estão nesta página. |
| conteudo | This work’s measures come from the municipality’s own accounts: management reporting on its own year. The two outside voices are the independent auditor’s signed opinion and the local-government directorate’s annual series, which publishes per municipality and per year the same legal debt concept, compiled from outside. Both are on this page. |
