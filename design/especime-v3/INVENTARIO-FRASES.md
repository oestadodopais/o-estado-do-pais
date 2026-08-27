# Inventário das frases da casa · rota a rota

```
lida-contra: Emenda 18
```

*A cabeça do ficheiro, e é uma só linha: contra que emenda da voz é que esta
tabela foi lida. As emendas que mexem no §5 «Voz» de `direcao.md` marcam-se com a
cadeia «§5 «Voz» emendado», e `npm run check:voz` procura a mais alta que a leve.
Quando aparecer uma emenda da voz acima desta, a construção fecha e diz-se: o
inventário foi lido contra uma regra que já mudou. **O campo só sobe com uma
entrada nova em `critica/REVISOES-DO-INVENTARIO.md`**, porque a releitura é
trabalho de outra família sobre o inventário inteiro, e não um número que se
escreve aqui.*

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

**A tabela tem três colunas desde 26.08.2026** (G2 do bloco «A grelha da voz»):
a classe, o texto e o **bloco** que acrescentou ou reclassificou a linha. As
linhas anteriores a esse dia levam `até 2026-08-26`, que é o que elas são: um
estado herdado, sem o rasto de quem o pôs lá. Cada bloco tem de ter uma entrada
em `critica/REVISOES-DO-INVENTARIO.md`, com a leitura cruzada do seu diff, e
`npm run check:voz` fecha a construção quando não tem, ou quando a entrada nomeia
um ficheiro que não existe.

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

| classe | texto | bloco |
| --- | --- | --- |
| conteudo | A régua da convergência | até 2026-08-26 |
| navegacao | An observatory of Portugal. | até 2026-08-26 |
| conteudo | Alentejo · region | até 2026-08-26 |
| conteudo | Alentejo · região | até 2026-08-26 |
| conteudo | Algarve · region | até 2026-08-26 |
| conteudo | Algarve · região | até 2026-08-26 |
| navegacao | As regiões publicadas na régua da convergência. | até 2026-08-26 |
| navegacao | At a glance | até 2026-08-26 |
| navegacao | Brief reading | até 2026-08-26 |
| conteudo | Dívida bruta das administrações públicas, no conceito do Procedimento dos Défices Excessivos. Está acima do limiar do painel europeu, e a descer. | até 2026-08-26 |
| navegacao | Encontrou um erro? correcoes@oestadodopais.pt · O registo de correções → | até 2026-08-26 |
| conteudo | European Social Scoreboard | até 2026-08-26 |
| navegacao | Found an error? correcoes@oestadodopais.pt · The corrections log → | até 2026-08-26 |
| conteudo | General government gross debt, on the Excessive Deficit Procedure concept. It is above the European scoreboard threshold, and falling. | até 2026-08-26 |
| conteudo | Grande Lisboa · região | até 2026-08-26 |
| conteudo | Greater Lisbon · region | até 2026-08-26 |
| navegacao | Hover over a point to read the municipality. Keyboard: Tab to the map, arrow keys to move between neighbouring municipalities, Home to return to Évora. | até 2026-08-26 |
| navegacao | Leitura breve | até 2026-08-26 |
| conteudo | Madeira · region | até 2026-08-26 |
| conteudo | Madeira · região | até 2026-08-26 |
| navegacao | Nenhum concelho com esse nome. | até 2026-08-26 |
| navegacao | No municipality by that name. | até 2026-08-26 |
| navegacao | O Estado do País | até 2026-08-26 |
| conteudo | O que o país tem a haver do exterior menos o que lhe deve: negativo quando deve mais do que tem a haver. | até 2026-08-26 |
| conteudo | O índice compara o PIB per capita de cada território, medido em paridades de poder de compra, com a média da UE-27. Um valor abaixo da média significa menos poder de compra por pessoa; um valor acima, mais. | até 2026-08-26 |
| conteudo | Painel Social Europeu | até 2026-08-26 |
| navegacao | Passe o cursor sobre um ponto para ler o município. Teclado: Tab até ao mapa, setas para percorrer os municípios vizinhos, Home para voltar a Évora. | até 2026-08-26 |
| conteudo | Península de Setúbal · região | até 2026-08-26 |
| conteudo | Portugal breaches 4 thresholds of the Macroeconomic Imbalance Procedure and meets 9 . | até 2026-08-26 |
| conteudo | Portugal nos painéis europeus: os indicadores, os limiares e as fontes. | até 2026-08-26 |
| conteudo | Portugal on the European scoreboards: the indicators, the thresholds and the sources. | até 2026-08-26 |
| conteudo | Portugal ultrapassa 4 limiares do Procedimento dos Desequilíbrios Macroeconómicos e cumpre 9 . | até 2026-08-26 |
| conteudo | Portugal · country | até 2026-08-26 |
| conteudo | Portugal · país | até 2026-08-26 |
| navegacao | Relance | até 2026-08-26 |
| conteudo | Setúbal Peninsula · region | até 2026-08-26 |
| conteudo | The convergence rule | até 2026-08-26 |
| conteudo | The index compares each territory’s GDP per capita, measured in purchasing power standards, with the EU-27 average. A value below the average means less purchasing power per person; a value above it, more. | até 2026-08-26 |
| navegacao | The regions published on the convergence rule. | até 2026-08-26 |
| conteudo | What the country is owed from abroad minus what it owes abroad: negative when it owes more than it is owed. | até 2026-08-26 |

## `/livro-razao` · `/en/ledger` (etapa 3, subetapa 3b)

*As duas edições partilham a tabela, como acima: uma frase entra uma vez, na
língua em que é rendida.*

| classe | texto | bloco |
| --- | --- | --- |
| conteudo | 132 afirmações · 19 calculadas | até 2026-08-26 |
| conteudo | 132 claims · 19 calculated | até 2026-08-26 |
| conteudo | A licença cobre o conjunto: a estrutura, os valores da casa, as derivações e as descrições. Os excertos transcritos das fontes continuam sob os termos de quem os publicou. | até 2026-08-26 |
| conteudo | Com campos por confirmar | até 2026-08-26 |
| conteudo | Complete provenance | até 2026-08-26 |
| navegacao | Descarregar o livro-razão: CSV · JSON | até 2026-08-26 |
| navegacao | Download the ledger: CSV · JSON | até 2026-08-26 |
| conteudo | Every row, with every published field. | até 2026-08-26 |
| conteudo | O livro-razão | até 2026-08-26 |
| conteudo | one field unconfirmed | até 2026-08-26 |
| conteudo | provenance complete | até 2026-08-26 |
| conteudo | proveniência completa | até 2026-08-26 |
| conteudo | um campo por confirmar | até 2026-08-26 |
| conteudo | Os dois estados do selo | até 2026-08-26 |
| conteudo | Proveniência completa | até 2026-08-26 |
| conteudo | The ledger | até 2026-08-26 |
| conteudo | The licence covers the dataset: its structure, the house values, the derivations and the descriptions. Excerpts transcribed from sources remain under their publishers’ terms. | até 2026-08-26 |
| conteudo | The two states of the seal | até 2026-08-26 |
| conteudo | Todas as linhas, com todos os campos publicados. | até 2026-08-26 |
| navegacao | Um observatório de Portugal. | até 2026-08-26 |
| conteudo | With fields to confirm | até 2026-08-26 |
| conteudo | [a verificar] | até 2026-08-26 |
| conteudo | [a verificar] (to verify) | até 2026-08-26 |

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

| classe | texto | bloco |
| --- | --- | --- |
| conteudo | Aveiro | até 2026-08-26 |
| conteudo | Beja | até 2026-08-26 |
| conteudo | Braga | até 2026-08-26 |
| conteudo | Bragança | até 2026-08-26 |
| conteudo | Castelo Branco | até 2026-08-26 |
| conteudo | Coimbra | até 2026-08-26 |
| conteudo | Every municipality in Portugal, from the official administrative map. | até 2026-08-26 |
| conteudo | Every municipality, from the Carta Administrativa Oficial de Portugal. | até 2026-08-26 |
| conteudo | Faro | até 2026-08-26 |
| conteudo | Guarda | até 2026-08-26 |
| conteudo | Ilha Terceira | até 2026-08-26 |
| conteudo | Ilha da Graciosa | até 2026-08-26 |
| conteudo | Ilha da Madeira | até 2026-08-26 |
| conteudo | Ilha das Flores | até 2026-08-26 |
| conteudo | Ilha de Porto Santo | até 2026-08-26 |
| conteudo | Ilha de Santa Maria | até 2026-08-26 |
| conteudo | Ilha de São Jorge | até 2026-08-26 |
| conteudo | Ilha de São Miguel | até 2026-08-26 |
| conteudo | Ilha do Corvo | até 2026-08-26 |
| conteudo | Ilha do Faial | até 2026-08-26 |
| conteudo | Ilha do Pico | até 2026-08-26 |
| conteudo | Leiria | até 2026-08-26 |
| conteudo | Lisboa | até 2026-08-26 |
| conteudo | Os concelhos de Portugal | até 2026-08-26 |
| conteudo | Portalegre | até 2026-08-26 |
| conteudo | Porto | até 2026-08-26 |
| conteudo | Santarém | até 2026-08-26 |
| conteudo | Setúbal | até 2026-08-26 |
| conteudo | The municipalities of Portugal | até 2026-08-26 |
| conteudo | Todos os concelhos de Portugal, pela Carta Administrativa Oficial. | até 2026-08-26 |
| conteudo | Todos os concelhos, pela Carta Administrativa Oficial de Portugal. | até 2026-08-26 |
| conteudo | Viana do Castelo | até 2026-08-26 |
| conteudo | Vila Real | até 2026-08-26 |
| conteudo | Viseu | até 2026-08-26 |

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

| classe | texto | bloco |
| --- | --- | --- |
| conteudo | A diferença entre as duas contas da mesma dívida | até 2026-08-26 |
| conteudo | A dívida contra o teto legal | até 2026-08-26 |
| conteudo | A última prestação de contas do município | até 2026-08-26 |
| conteudo | Accounts of the year before last | até 2026-08-26 |
| navegacao | Background | até 2026-08-26 |
| conteudo | Borrowing margin | até 2026-08-26 |
| conteudo | Contas do penúltimo ano | até 2026-08-26 |
| conteudo | Corrected budget | até 2026-08-26 |
| conteudo | Debt limit | até 2026-08-26 |
| conteudo | Decided | até 2026-08-26 |
| conteudo | Decidiu | até 2026-08-26 |
| conteudo | Deixou | até 2026-08-26 |
| conteudo | Despesa paga | até 2026-08-26 |
| conteudo | Diferença | até 2026-08-26 |
| conteudo | Difference | até 2026-08-26 |
| conteudo | Dívida total | até 2026-08-26 |
| conteudo | Economia, investidores e portas abertas no município de Évora. | até 2026-08-26 |
| conteudo | Economy, investors and open doors in the municipality of Évora. | até 2026-08-26 |
| conteudo | Em funções. | até 2026-08-26 |
| conteudo | Estimativa anual do INE para o concelho. | até 2026-08-26 |
| conteudo | Executive installed | até 2026-08-26 |
| conteudo | Executivo instalado | até 2026-08-26 |
| conteudo | Expenditure paid | até 2026-08-26 |
| conteudo | Fifteen years of municipal government in Évora, across five terms. | até 2026-08-26 |
| navegacao | Fundo | até 2026-08-26 |
| conteudo | Herdou | até 2026-08-26 |
| conteudo | In office. | até 2026-08-26 |
| conteudo | Inherited | até 2026-08-26 |
| conteudo | Inscritos no fim do mês nos serviços de emprego, ficheiro mensal por concelho. | até 2026-08-26 |
| conteudo | Left | até 2026-08-26 |
| conteudo | Limite de dívida | até 2026-08-26 |
| conteudo | Lugares | até 2026-08-26 |
| conteudo | Margem de endividamento | até 2026-08-26 |
| conteudo | O município publica | até 2026-08-26 |
| conteudo | O que as fontes publicam sobre o município de Évora: população, poder de compra, emprego, empresas, dívida e execução orçamental. | até 2026-08-26 |
| conteudo | O que foi orçamentado, o que foi pago e o que ficou em dívida no município de Évora. | até 2026-08-26 |
| conteudo | O que o município orçamentou, o que cobrou, o que pagou, e o que dizia dever no fim do ano. São números do próprio município sobre si mesmo: a prestação de contas é dele. | até 2026-08-26 |
| conteudo | O regulador | até 2026-08-26 |
| conteudo | O regulador publica | até 2026-08-26 |
| conteudo | O traço fino é a dívida total que o regulador publica para o concelho; a barra é a distância até ao limite legal do mesmo ano, que é o fio da direita. O índice mede uma contra o outro numa escala em que o teto é o valor permitido. | até 2026-08-26 |
| conteudo | Orçamento corrigido | até 2026-08-26 |
| conteudo | Os trabalhos sobre este concelho | até 2026-08-26 |
| conteudo | Pelouros | até 2026-08-26 |
| conteudo | Poder de compra per capita, publicado pelo INE para todos os concelhos. | até 2026-08-26 |
| conteudo | Portfolios | até 2026-08-26 |
| conteudo | Provenance | até 2026-08-26 |
| conteudo | Proveniência | até 2026-08-26 |
| conteudo | Purchasing power per capita, published for every municipality. | até 2026-08-26 |
| conteudo | Quem administrou, e o que as contas registaram | até 2026-08-26 |
| conteudo | Quem responde pelo quê | até 2026-08-26 |
| conteudo | Quinze anos de governo municipal em Évora, ao longo de cinco mandatos. | até 2026-08-26 |
| conteudo | Receita cobrada | até 2026-08-26 |
| conteudo | Registered with the employment service at month end, monthly file by municipality. | até 2026-08-26 |
| conteudo | Reportado pelo município: sai da prestação de contas do próprio, não de um agregador central. | até 2026-08-26 |
| conteudo | Reported by the municipality: it comes from its own accounts, not from a central aggregator. | até 2026-08-26 |
| conteudo | Revenue collected | até 2026-08-26 |
| conteudo | Seats | até 2026-08-26 |
| conteudo | The debt against the legal ceiling | até 2026-08-26 |
| conteudo | The gap between the two accounts of the same debt | até 2026-08-26 |
| conteudo | The municipality publishes | até 2026-08-26 |
| conteudo | The municipality’s latest accounts | até 2026-08-26 |
| conteudo | The recovery-plan totals that appear in that work’s reading are sums over the public register, attributed to the concelho by that register. Of the money contracted in the concelho, the university holds more than the municipality, and the layer that administers the money is made of national bodies. That this makes the accountability address something other than the town hall is that work’s own signed conclusion, and it sits on its page. | até 2026-08-26 |
| conteudo | The regulator | até 2026-08-26 |
| conteudo | The regulator and the municipality publish the same year’s debt with a difference between them. The difference is small, and it is shown because it is the only place where an outside voice and the municipality’s own voice measure the same thing. | até 2026-08-26 |
| conteudo | The regulator publishes | até 2026-08-26 |
| conteudo | The statistics institute’s annual estimate for the municipality. | até 2026-08-26 |
| conteudo | The thin line is the total debt the regulator publishes for the concelho; the bar is the distance to the legal limit for the same year, which is the rule on the right. The index measures one against the other on a scale whose cap is the permitted value. | até 2026-08-26 |
| conteudo | The works about this concelho | até 2026-08-26 |
| conteudo | Total debt | até 2026-08-26 |
| conteudo | What the municipality budgeted, what it collected, what it paid, and what it said it owed at year end. These are the municipality’s own figures about itself: the accounts are its own. | até 2026-08-26 |
| conteudo | What the sources publish about the municipality of Évora: population, purchasing power, employment, enterprises, debt and budget execution. | até 2026-08-26 |
| conteudo | What was budgeted, what was paid and what was left owing in the municipality of Évora. | até 2026-08-26 |
| conteudo | Who answers for what | até 2026-08-26 |
| conteudo | Who governed, and what the accounts recorded | até 2026-08-26 |
| conteudo | Who held each portfolio of the Câmara Municipal de Évora across five terms, how much the municipality’s own accounts spent in the areas those portfolios cover, and what the reports say those areas did. | até 2026-08-26 |
| conteudo | district of Évora · Alentejo Central | até 2026-08-26 |
| conteudo | distrito de Évora · Alentejo Central | até 2026-08-26 |
| conteudo | no row yet | até 2026-08-26 |
| conteudo | sem linha ainda | até 2026-08-26 |
| conteudo | Évora | até 2026-08-26 |

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

| classe | texto | bloco |
| --- | --- | --- |
| conteudo | 26 provenance revisions | até 2026-08-26 |
| conteudo | 26 revisões de proveniência | até 2026-08-26 |
| conteudo | A política | até 2026-08-26 |
| conteudo | A política de correções deste sítio e o registo de todas: o valor anterior à vista, datado, com o motivo, e nada apagado. | até 2026-08-26 |
| conteudo | An entry in the register holds the previous value, the new value, the date, the reason and the ledger row that changed. Nothing is removed: a corrected entry is added to that row’s history, it does not replace it. There are three kinds, and they are not mixed: | até 2026-08-26 |
| conteudo | Anyone who finds an error writes to correcoes@oestadodopais.pt . A confirmed error enters the register with credit to whoever found it, if they wish. | até 2026-08-26 |
| conteudo | Atualização. O valor estava certo e deixou de estar, porque aquilo que mede mudou. Não é um erro. | até 2026-08-26 |
| conteudo | Atualizações | até 2026-08-26 |
| conteudo | Correcting in silence is the cheapest way of lying. | até 2026-08-26 |
| conteudo | Correction. The published value was wrong. It is a confession, and it is the reason the register exists. | até 2026-08-26 |
| conteudo | Corrections | até 2026-08-26 |
| conteudo | Correção. O valor publicado estava errado. É uma confissão, e é a razão de o registo existir. | até 2026-08-26 |
| conteudo | Correções | até 2026-08-26 |
| conteudo | Corrigir em silêncio é a forma mais barata de mentir. | até 2026-08-26 |
| navegacao | Escreva aqui e o botão abre o seu programa de correio com o texto já dentro. Nada é enviado deste sítio: a mensagem sai de si, para si ficar com uma cópia. | até 2026-08-26 |
| conteudo | Escrever uma correção | até 2026-08-26 |
| navegacao | If the button opens nothing, your computer has no mail program set up. In that case copy the address above and write from wherever you normally write. | até 2026-08-26 |
| conteudo | O que foi corrigido, e o que mudou | até 2026-08-26 |
| conteudo | O registo | até 2026-08-26 |
| conteudo | O valor não mudou; mudou a maneira de lá chegar: uma fonte que muda de endereço, por exemplo. Não são erros nem atualizações, e não se listam aqui uma a uma: são muitas de cada vez e afogariam as correções. Cada linha abaixo leva à sua própria história, onde a revisão está escrita por extenso. | até 2026-08-26 |
| conteudo | Provenance revision. The value did not change; the route to the source did, an address for example. It is neither an error nor an update. | até 2026-08-26 |
| conteudo | Provenance revisions | até 2026-08-26 |
| conteudo | Quem encontrar um erro escreve para correcoes@oestadodopais.pt . Um erro confirmado entra no registo com crédito a quem o encontrou, se o desejar. | até 2026-08-26 |
| conteudo | Revisão de proveniência. O valor não mudou; mudou o caminho até à fonte, um endereço por exemplo. Não é erro nem atualização. | até 2026-08-26 |
| conteudo | Revisões de proveniência | até 2026-08-26 |
| navegacao | Se o botão não abrir nada, o seu computador não tem programa de correio configurado. Nesse caso copie o endereço acima e escreva de onde costuma escrever. | até 2026-08-26 |
| conteudo | The corrections policy of this site and the register of them all: the previous value in plain sight, dated, with the reason, and nothing deleted. | até 2026-08-26 |
| conteudo | The policy | até 2026-08-26 |
| conteudo | The register | até 2026-08-26 |
| conteudo | The value did not change; the way to find it did: a source that moves address, for example. They are neither errors nor updates, and they are not listed one by one here: they come many at a time and would drown the corrections. Each row below leads to its own history, where the revision is written out in full. | até 2026-08-26 |
| conteudo | Uma entrada do registo guarda o valor anterior, o valor novo, a data, o motivo e a linha do livro-razão que mudou. Nada é removido: uma entrada corrigida acresce à história daquela linha, não a substitui. São três naturezas, e não se misturam: | até 2026-08-26 |
| conteudo | Update. The value was right and stopped being so, because what it measures changed. It is not an error. | até 2026-08-26 |
| conteudo | Updates | até 2026-08-26 |
| conteudo | Valores que estavam certos e deixaram de estar, porque aquilo que medem mudou. Não são erros, e não contam para o número acima. | até 2026-08-26 |
| conteudo | Valores que estavam errados. Cada um fica com o valor anterior à vista, datado, e nenhum é removido. | até 2026-08-26 |
| conteudo | Values that were right and stopped being so, because what they measure changed. They are not errors, and they do not count towards the number above. | até 2026-08-26 |
| conteudo | Values that were wrong. Each keeps its previous value in plain sight, dated, and none is removed. | até 2026-08-26 |
| conteudo | What was corrected, and what changed | até 2026-08-26 |
| conteudo | Write a correction | até 2026-08-26 |
| navegacao | Write here and the button opens your own mail program with the text already in it. Nothing is sent from this site: the message leaves from you, so you keep a copy of it. | até 2026-08-26 |

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

| classe | texto | bloco |
| --- | --- | --- |
| conteudo | A pergunta | até 2026-08-26 |
| conteudo | A seguir | até 2026-08-26 |
| conteudo | Com data publicada pela fonte | até 2026-08-26 |
| conteudo | Concluded | até 2026-08-26 |
| conteudo | Concluído | até 2026-08-26 |
| conteudo | Criteria | até 2026-08-26 |
| conteudo | Critérios | até 2026-08-26 |
| conteudo | Em curso | até 2026-08-26 |
| conteudo | Nenhum até hoje. | até 2026-08-26 |
| navegacao | Nesta página | até 2026-08-26 |
| conteudo | Next | até 2026-08-26 |
| conteudo | No criterion. | até 2026-08-26 |
| conteudo | None to date. | até 2026-08-26 |
| conteudo | O calendário das fontes | até 2026-08-26 |
| conteudo | O calendário, no tempo | até 2026-08-26 |
| conteudo | O que está em cada estado | até 2026-08-26 |
| conteudo | O que mudou | até 2026-08-26 |
| conteudo | O que se mede a seguir | até 2026-08-26 |
| navegacao | On this page | até 2026-08-26 |
| conteudo | Porquê | até 2026-08-26 |
| conteudo | Retirado | até 2026-08-26 |
| conteudo | Sem critério. | até 2026-08-26 |
| conteudo | Sem data, porque a fonte não publica nenhuma | até 2026-08-26 |
| conteudo | The calendar, in time | até 2026-08-26 |
| conteudo | The question | até 2026-08-26 |
| conteudo | The source calendar | até 2026-08-26 |
| conteudo | Under way | até 2026-08-26 |
| conteudo | What changed | até 2026-08-26 |
| conteudo | What gets measured next | até 2026-08-26 |
| conteudo | What is in each state | até 2026-08-26 |
| conteudo | Why | até 2026-08-26 |
| conteudo | With a date the source publishes | até 2026-08-26 |
| conteudo | With no date, because the source publishes none | até 2026-08-26 |
| conteudo | Withdrawn | até 2026-08-26 |

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

| classe | texto | bloco |
| --- | --- | --- |
| conteudo | % desse valor está nas quatro maiores empresas | até 2026-08-26 |
| conteudo | % dez anos depois | até 2026-08-26 |
| conteudo | % do orçamento foi de facto cobrado no último ano de contas | até 2026-08-26 |
| conteudo | % four years earlier | até 2026-08-26 |
| conteudo | % of that value sits with the four largest enterprises | até 2026-08-26 |
| conteudo | % of the budget was actually collected in the latest year of accounts | até 2026-08-26 |
| conteudo | % quatro anos antes | até 2026-08-26 |
| conteudo | % ten years later | até 2026-08-26 |
| conteudo | A cross-vertical reading of one Portuguese municipality: the recovery-plan project register, the public-contracts register and the state auditor's catalogue, all fetched live on 2026-08-04, and the recovery-plan register read again on 2026-08-20. | até 2026-08-26 |
| navegacao | A ligação sai deste domínio. | até 2026-08-26 |
| conteudo | As contas do penúltimo ano foram rejeitadas em votação e nunca foram certificadas. | até 2026-08-26 |
| conteudo | Avaliação económica das regiões de Portugal. | até 2026-08-26 |
| conteudo | Datas de publicação por confirmar. | até 2026-08-26 |
| conteudo | Description: house translation of the document’s opening sentence | até 2026-08-26 |
| conteudo | Description: opening sentence of the document | até 2026-08-26 |
| conteudo | Description: restatement of the title | até 2026-08-26 |
| conteudo | Descrição: frase de abertura do documento | até 2026-08-26 |
| conteudo | Descrição: reformulação do título | até 2026-08-26 |
| conteudo | Descrição: tradução da casa da frase de abertura do documento | até 2026-08-26 |
| conteudo | designations, over three people, in the next executive | até 2026-08-26 |
| conteudo | designações, por três pessoas, no executivo seguinte | até 2026-08-26 |
| conteudo | Economia, sociedade e estratégia no Alentejo e no Algarve. | até 2026-08-26 |
| conteudo | Economic assessment of Portugal’s regions. | até 2026-08-26 |
| conteudo | Economy, society and strategy in the Alentejo and the Algarve. | até 2026-08-26 |
| conteudo | EN [a verificar] | até 2026-08-26 |
| conteudo | EN Economic assessment of Portugal’s regions. | até 2026-08-26 |
| conteudo | EN Economy, investors and open doors in the municipality of Évora. | até 2026-08-26 |
| conteudo | EN Economy, society and strategy in the Alentejo and the Algarve. | até 2026-08-26 |
| conteudo | EN Fifteen years of municipal government in Évora, across five terms. | até 2026-08-26 |
| conteudo | EN Long series on the country’s evolution. | até 2026-08-26 |
| conteudo | EN Non-revenue water in Portugal’s public supply systems. | até 2026-08-26 |
| conteudo | EN Public funding in Portugal. | até 2026-08-26 |
| conteudo | EN What was budgeted, what was paid and what was left owing in the municipality of Évora. | até 2026-08-26 |
| conteudo | EN Who held each portfolio of the Câmara Municipal de Évora across five terms, how much the municipality’s own accounts spent in the areas those portfolios cover, and what the reports say those areas did. | até 2026-08-26 |
| conteudo | Estudos | até 2026-08-26 |
| conteudo | Financiamento público em Portugal. | até 2026-08-26 |
| conteudo | Long series on the country’s evolution. | até 2026-08-26 |
| conteudo | No subject assigned | até 2026-08-26 |
| conteudo | Non-revenue water in Portugal’s public supply systems. | até 2026-08-26 |
| conteudo | O arquivo de estudos publicados, com as suas edições em português e em inglês. | até 2026-08-26 |
| conteudo | PT [a verificar] | até 2026-08-26 |
| conteudo | PT Avaliação económica das regiões de Portugal. | até 2026-08-26 |
| conteudo | PT Economia, investidores e portas abertas no município de Évora. | até 2026-08-26 |
| conteudo | PT Economia, sociedade e estratégia no Alentejo e no Algarve. | até 2026-08-26 |
| conteudo | PT Financiamento público em Portugal. | até 2026-08-26 |
| conteudo | PT O que foi orçamentado, o que foi pago e o que ficou em dívida no município de Évora. | até 2026-08-26 |
| conteudo | PT Quinze anos de governo municipal em Évora, ao longo de cinco mandatos. | até 2026-08-26 |
| conteudo | PT Séries longas sobre a evolução do país. | até 2026-08-26 |
| conteudo | PT Água não faturada nos sistemas de abastecimento em Portugal. | até 2026-08-26 |
| conteudo | Public funding in Portugal. | até 2026-08-26 |
| conteudo | Publication dates not yet confirmed. | até 2026-08-26 |
| conteudo | Quem teve cada pelouro da Câmara Municipal de Évora ao longo de cinco mandatos, quanto gastaram as contas do próprio município nas áreas que esses pelouros cobrem, e o que os relatórios dizem que essas áreas fizeram. | até 2026-08-26 |
| conteudo | Sem tema atribuído | até 2026-08-26 |
| conteudo | Studies | até 2026-08-26 |
| conteudo | Séries longas sobre a evolução do país. | até 2026-08-26 |
| conteudo | The accounts of the second-to-last year were rejected in a vote and were never certified. | até 2026-08-26 |
| conteudo | The archive of published studies, with their Portuguese and English editions. | até 2026-08-26 |
| navegacao | The link leaves this domain. | até 2026-08-26 |
| conteudo | Uma leitura transversal de um município português: o registo de projetos do plano de recuperação, o registo de contratos públicos e o catálogo do tribunal de contas do Estado, recolhidos em direto a 2026-08-04, e o registo do plano de recuperação relido a 2026-08-20. | até 2026-08-26 |
| conteudo | Água não faturada nos sistemas de abastecimento em Portugal. | até 2026-08-26 |
| conteudo | € actually paid | até 2026-08-26 |
| conteudo | € approved and attributed to the concelho by the recovery-plan register | até 2026-08-26 |
| conteudo | € aprovados e atribuídos ao concelho pelo registo do plano de recuperação | até 2026-08-26 |
| conteudo | € de valor acrescentado bruto das empresas sediadas no concelho | até 2026-08-26 |
| conteudo | € efetivamente pagos | até 2026-08-26 |
| conteudo | € of gross value added by enterprises headquartered in the concelho | até 2026-08-26 |

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

| classe | texto | bloco |
| --- | --- | --- |
| conteudo | As linhas deste documento | até 2026-08-26 |
| conteudo | O documento original | até 2026-08-26 |
| conteudo | O registo de conteúdo | até 2026-08-26 |
| conteudo | The content record | até 2026-08-26 |
| conteudo | The original document | até 2026-08-26 |
| conteudo | The rows of this document | até 2026-08-26 |
| conteudo | as this document prints it | até 2026-08-26 |
| conteudo | como este documento o imprime | até 2026-08-26 |
| conteudo | engine row | até 2026-08-26 |
| conteudo | linha do motor | até 2026-08-26 |
| conteudo | o valor como a linha o guarda | até 2026-08-26 |
| conteudo | resumo de origem | até 2026-08-26 |
| conteudo | source digest | até 2026-08-26 |
| conteudo | the value as the row keeps it | até 2026-08-26 |

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

| classe | frase | bloco |
| --- | --- | --- |
| conteudo | 136 afirmações · 19 calculadas | até 2026-08-26 |
| conteudo | 136 claims · 19 calculated | até 2026-08-26 |
| conteudo | 128 de 136 linhas com proveniência completa | até 2026-08-26 |
| conteudo | 128 of 136 rows with complete provenance | até 2026-08-26 |
| conteudo | 8 de 136 linhas com campos por confirmar | até 2026-08-26 |
| conteudo | 8 of 136 rows with fields to confirm | até 2026-08-26 |
| conteudo | O que a lei cobra por antecipar a reforma, e o que seria atuarialmente neutro. | até 2026-08-26 |
| conteudo | What the law charges for retiring early, and what would be actuarially neutral. | até 2026-08-26 |
| conteudo | PT O que a lei cobra por antecipar a reforma, e o que seria atuarialmente neutro. | até 2026-08-26 |
| conteudo | EN What the law charges for retiring early, and what would be actuarially neutral. | até 2026-08-26 |
| conteudo | A quem cabe numa das exceções que afastam o fator de sustentabilidade, a lei corta menos do que o valor neutro. As duas medidas acima são os dois extremos da mesma decisão. | até 2026-08-26 |
| conteudo | For those who fall within one of the exceptions that set the sustainability factor aside, the law cuts less than the neutral figure. The two measures above are the two ends of the same decision. | até 2026-08-26 |
| conteudo | é o que a lei corta a quem não cabe numa das exceções | até 2026-08-26 |
| conteudo | is what the law cuts from those who fall outside the exceptions | até 2026-08-26 |
| conteudo | de redução da pensão seria atuarialmente neutro, por um ano de antecipação | até 2026-08-26 |
| conteudo | pension reduction would be actuarially neutral, for one year of anticipation | até 2026-08-26 |

**As frases inglesas da página de um concelho e das leituras que o item B6
mudou**, e que a régua lê como blocos novos porque o texto mudou:

| classe | frase | bloco |
| --- | --- | --- |
| conteudo | € approved and attributed to the municipality by the recovery-plan register | até 2026-08-26 |
| conteudo | € of gross value added by enterprises headquartered in the municipality | até 2026-08-26 |
| conteudo | The works about this municipality | até 2026-08-26 |
| conteudo | The thin line is the total debt the regulator publishes for the municipality; the bar is the distance to the legal limit for the same year, which is the rule on the right. The index measures one against the other on a scale whose cap is the permitted value. | até 2026-08-26 |

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

| classe | frase | bloco |
| --- | --- | --- |
| conteudo | Com página | até 2026-08-26 |
| conteudo | With a page | até 2026-08-26 |

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

| classe | texto | bloco |
| --- | --- | --- |
| conteudo | Execução da receita | até 2026-08-26 |
| conteudo | Prazo médio de pagamento | até 2026-08-26 |
| conteudo | Revenue execution | até 2026-08-26 |
| conteudo | Average payment time | até 2026-08-26 |
| conteudo | 136 afirmações · 19 calculadas · 0 linhas de concelhos | até 2026-08-26 |
| conteudo | 136 claims · 19 calculated · 0 municipality rows | até 2026-08-26 |
| conteudo | 2552 afirmações · 325 calculadas · 2416 linhas de concelhos | até 2026-08-26 |
| conteudo | 2552 claims · 325 calculated · 2416 municipality rows | até 2026-08-26 |
| conteudo | As linhas do livro-razão com as medidas que as fontes centrais publicam para o concelho de <lugar>. | até 2026-08-26 |
| conteudo | The ledger rows with the measures central sources publish for the municipality of <lugar>. | até 2026-08-26 |
| conteudo | Sistema de contas integradas das empresas; cada empresa conta num único concelho. | até 2026-08-26 |
| conteudo | Integrated business accounts; each enterprise counts in a single municipality. | até 2026-08-26 |
| conteudo | As linhas do livro-razão com as medidas que as fontes centrais publicam para cada concelho, uma linha cada. | até 2026-08-26 |
| conteudo | The ledger rows with the measures central sources publish for each municipality, one row each. | até 2026-08-26 |
| conteudo | Linhas sem concelho declarado | até 2026-08-26 |
| conteudo | Rows with no municipality declared | até 2026-08-26 |
| conteudo | O que as fontes publicam sobre o município de <lugar>: população, poder de compra, emprego, empresas, dívida e execução orçamental. | até 2026-08-26 |
| conteudo | What the sources publish about the municipality of <lugar>: population, purchasing power, employment, enterprises, debt and budget execution. | até 2026-08-26 |
| conteudo | Concelhos: as medidas centrais | até 2026-08-26 |
| conteudo | Municipalities: the central measures | até 2026-08-26 |

## Bloco dos 308 concelhos · P2 (os dados), 26.08.2026

**UMA FRASE CORRIGIDA SAI DESTA LISTA.** O ficheiro guardava as duas leituras de uma contagem lado a lado, porque uma contagem volta a ser o que era no dia em que o livro-razão encolher. Uma frase que foi CORRIGIDA é outra coisa: se continuar declarada, repô-la passa em silêncio, e foi isso que se mediu ao plantar de volta a nota da sede e a que chamava «regulador» à DGAL — nenhuma das duas fechou nada. As entradas das frases que os itens E7 e E11 corrigiram saíram desta lista; repor uma delas passa a ser um bloco por classificar, e a régua fecha.

*As frases que os itens E7 a E12 mudaram: a nota das empresas, que deixou de afirmar o que a verificação das fontes não confirmou; a legenda da dívida, sem a oração em que o sítio falava de si; e as que chamavam «regulador» à Direção-Geral das Autarquias Locais. As duas últimas linhas da tabela são a frase que SAIU, declarada pelo que ela era: autorreferência. Fica declarada para que a régua a apanhe pelo nome se alguém a repuser, em vez de a apanhar como bloco por classificar.*

| classe | texto | bloco |
| --- | --- | --- |
| conteudo | A Direção-Geral | até 2026-08-26 |
| conteudo | A Direção-Geral publica | até 2026-08-26 |
| conteudo | A série anual da Direção-Geral das Autarquias Locais ainda não chegou a este mandato. | até 2026-08-26 |
| conteudo | Lista anual da Direção-Geral das Autarquias Locais, que publica os dados das contas dos municípios. | até 2026-08-26 |
| conteudo | O limite é fixado no artigo 52.º da Lei n.º 73/2013: uma vez e meia a média da receita corrente líquida dos três anos anteriores. | até 2026-08-26 |
| conteudo | O traço fino é a dívida total que a Direção-Geral das Autarquias Locais publica para o concelho; a barra é a distância até ao limite legal do mesmo ano, que é o fio da direita. O índice mede uma contra o outro numa escala em que o teto é o valor permitido. | até 2026-08-26 |
| conteudo | Série anual da Direção-Geral das Autarquias Locais, que publica os dados das contas dos municípios. Exclui dívidas não orçamentais e exceções legais. | até 2026-08-26 |
| conteudo | The annual list of the local-government directorate, which publishes the municipalities’ accounts data. | até 2026-08-26 |
| conteudo | The annual series of the local-government directorate, which publishes the municipalities’ accounts data. Excludes non-budgetary debt and legal exceptions. | até 2026-08-26 |
| conteudo | The directorate-general | até 2026-08-26 |
| conteudo | The directorate-general publishes | até 2026-08-26 |
| conteudo | The limit is set by article 52.º of Lei n.º 73/2013: one and a half times the three-year average of net current revenue. | até 2026-08-26 |
| conteudo | The local-government directorate’s annual series has not yet reached this term. | até 2026-08-26 |
| conteudo | The thin line is the total debt the local-government directorate publishes for the municipality; the bar is the distance to the legal limit for the same year, which is the rule on the right. The index measures one against the other on a scale whose cap is the permitted value. | até 2026-08-26 |
| conteudo | Sem linhas ainda. | até 2026-08-26 |
| conteudo | No rows yet. | até 2026-08-26 |
| conteudo | A referência do estudo | até 2026-08-26 |
| conteudo | The study’s reference | até 2026-08-26 |
| conteudo | 2552 afirmações · 325 calculadas · 2417 linhas de concelhos | até 2026-08-26 |
| conteudo | 2552 claims · 325 calculated · 2417 municipality rows | até 2026-08-26 |
| autorreferencia | O limite é fixado no artigo 52.º da Lei n.º 73/2013: uma vez e meia a média da receita corrente líquida dos três anos anteriores. É a lei que o define, não este sítio. | até 2026-08-26 |
| autorreferencia | The limit is set by article 52.º of Lei n.º 73/2013: one and a half times the three-year average of net current revenue. The law defines it, not this site. | até 2026-08-26 |

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

| classe | texto | bloco |
| --- | --- | --- |
| conteudo | A Direção-Geral das Autarquias Locais e o município publicam a dívida do mesmo ano com uma diferença. A diferença é pequena. | grelha-da-voz |
| conteudo | A série anual da Direção-Geral das Autarquias Locais começa depois deste mandato. | grelha-da-voz |
| conteudo | How far the debt exceeded the legal limit, in the first and the last year in which the report publishes it as a positive figure. After that the table turns negative, and a negative there is no longer excess but borrowing capacity. | grelha-da-voz |
| conteudo | O que a dívida excedia o limite legal, no primeiro e no último ano em que o relatório o publica como um valor positivo. Depois disso o quadro passa a números negativos, que já não são excesso mas capacidade de endividamento. | grelha-da-voz |

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
| conteudo | The local-government directorate and the municipality publish the same year’s debt with a difference between them. The difference is small. | grelha-da-voz |
| conteudo | The local-government directorate’s annual series begins after this term. | grelha-da-voz |

### A DGAL pelo nome, e a leitura da casa fora do rótulo

*O item E11 do bloco dos 308 tirou «o regulador» das notas das medidas e da
legenda da dívida, e não chegou a `src/data/leituras.mjs` nem ao rótulo do
relance da linha do tempo: a busca dele foi pelas notas das oito peças e pelas
cadeias de `strings.mjs` da página do concelho. Saem agora as três que ficaram. E
sai «legível», que é o sítio a descrever os limites da sua própria leitura: o
rótulo passa a nomear de que série são os dois números.*

| classe | texto | bloco |
| --- | --- | --- |
| conteudo | % de índice de dívida no primeiro ano da série da Direção-Geral das Autarquias Locais | grelha-da-voz |
| conteudo | % debt index in the first year of the local-government directorate’s series | grelha-da-voz |
| conteudo | Antes do primeiro ano da série da Direção-Geral das Autarquias Locais. | grelha-da-voz |
| conteudo | Before the first year of the local-government directorate’s series. | grelha-da-voz |

## Bloco «A grelha da voz» · G6, o método sai das páginas de trabalho · 26.08.2026

*A camada «Método e ressalvas» saiu das seis páginas de trabalho, com as suas
dezanove ressalvas, e com ela o rótulo da porta que explicava o que uma edição
de registo é. Decisão do diretor de 26.08: esta classe de texto não é útil nem
simples, o método vive no Método e no recibo de cada linha, e uma ressalva só
sobrevive quando muda a leitura de um número, e então é UMA frase, com o facto
por sujeito, na nota das medidas. A tabela de todas as dezanove, com a razão de
cada uma, está em `design/especime-v3/notas/grelha-da-voz.md`.*

*Saíram do ficheiro 34 declarações: as ressalvas que se rendiam como blocos de
texto, nas duas edições, e as suas variantes mais velhas de «concelho» e
«municipality» que o item B6 corrigiu. As ressalvas com um período entre
parênteses nunca estiveram aqui, porque um `{ref}` rende um
`data-nonledger` e a régua já as excluía como origem declarada.*

| classe | texto | bloco |
| --- | --- | --- |
| conteudo | As contas das empresas do concelho creditam toda a atividade de uma empresa a um único concelho, e não são um produto interno bruto municipal. A média nacional é a base do índice de poder de compra. | grelha-da-voz |
| conteudo | The accounts of the municipality’s enterprises credit a firm’s whole activity to a single municipality, and are not a municipal gross domestic product. The national average is the base of the purchasing-power index. | grelha-da-voz |
| conteudo | Cada contagem é a lista de pelouros que a página da câmara atribui a essa pessoa. | grelha-da-voz |
| conteudo | Each count is the list of portfolios the council’s page attributes to that person. | grelha-da-voz |
| conteudo | Estes dois valores são somas sobre o registo público inteiro do plano de recuperação, e não uma linha de um documento. Vencido é o valor aprovado em localizações cuja data prevista de conclusão já passou sem conclusão registada. | grelha-da-voz |
| conteudo | These two values are sums over the whole public register of the recovery plan, and not a line in a document. Overdue is the value approved at locations whose planned completion date has passed with no completion recorded. | grelha-da-voz |
| conteudo | O sistema contabilístico mudou por baixo da série, um ano de contas foi publicado em digitalizações e outro não foi publicado de todo. | grelha-da-voz |
| conteudo | The accounting system changed underneath the series, one year of accounts was published as scans and another was not published at all. | grelha-da-voz |

### E o método sai também da página do concelho

*As secções «Método e ressalvas» e «O que esta página não sabe» saíram da página
de Évora, com os seus doze parágrafos, e com elas a dobra «Como esta linha do
tempo é feita». Três ressalvas ficaram, cada uma como UMA frase com o facto por
sujeito e no sítio onde ela muda a leitura de um número: o ano de contas sem
certificação, na nota da camada das contas; as contagens de pelouros que são
designações e o contrafactual que não existe, nas duas notas do instrumento dos
mandatos. Os dois valores do excesso sobre o teto legal ficaram, com a frase que
diz porque é que a série pára ali, fora da dobra que os escondia.*

*Saíram 18 declarações. A dobra e o seu parágrafo nunca estiveram aqui, pela
mesma razão das ressalvas de trabalho com um período entre parênteses.*

| classe | texto | bloco |
| --- | --- | --- |
| conteudo | As contagens de pelouros são designações, não despesa. | grelha-da-voz |
| conteudo | The portfolio counts are designations, not spending. | grelha-da-voz |
| conteudo | Não existe contrafactual para nenhum índice, e a parte de um executivo neles não é separável. | grelha-da-voz |
| conteudo | There is no counterfactual for any index, and an executive’s share of them is not separable. | grelha-da-voz |

### E a ressalva diz o facto, não quem o leu

*Os marcadores deste bloco ganharam dez entradas, tiradas dos parágrafos que o
G6 retirou: «o trabalho», «este livro-razão», «atravessou», «mostra-o» e
«avaliável», com as suas gémeas inglesas. O único sítio da superfície pública em
que um deles ainda mordia era a nota do mandato sem repartição de pelouros, cujo
sujeito era o trabalho e cuja frase era a citação dele sobre os seus próprios
limites. Passa a dizer o facto.*

| classe | texto | bloco |
| --- | --- | --- |
| conteudo | Não estabelecido: o presidente desse mandato, e todos os outros membros dele, não foram identificados. | grelha-da-voz |
| conteudo | Not established: the president of that mandate, and every other member of it, were not identified. | grelha-da-voz |

## A leitura de fora do bloco · V1 a V4, 27.08.2026

*A leitura cruzada deste bloco (Codex, 27.08) apanhou o que o tripwire não via e
o que ele ainda não tinha marcador para ver. Três coisas mudaram.*

*O TRIPWIRE PASSOU A VARRER O TEXTO FORA DAS ORIGENS DECLARADAS.* A medida 8
deixa cair um bloco inteiro que contenha um valor do livro-razão, e está certa:
o que ela conta são frases da casa. Mas três das quatro frases que a leitura
apanhou na página de Évora partilhavam o bloco com um valor, e por isso nunca
chegaram ao tripwire. A varredura da medida 9 passa a ser a do texto que fica
fora das origens declaradas e fora dos comandos: de 395 para 579 frases
distintas.

*A LEITURA DO CABEÇALHO PERDEU O VERBO* (V2): «Painel europeu reconferido a
<data>» passa a «Painel europeu · <data>», em todas as páginas e no cartão de
partilha. Nomes e datas ficam; o verbo da diligência sai. Nenhuma das duas
cadeias entrava nesta tabela, porque a leitura do cabeçalho vive num bloco com a
data marcada.

*E CINCO SUPERFÍCIES DEIXARAM DE DESCREVER O PROCESSO* (V3): o calendário nomeia
as fontes citadas, a lede da agenda diz o que está a ser medido em vez de quem o
mede, a nota da pergunta diz que ela está registada em inglês em vez de nomear o
registo do motor, o arquivo nomeia o que tem em vez do seu estado de migração, e
os dois estados vazios encolhem para a ausência em duas palavras.

| classe | texto | bloco |
| --- | --- | --- |
| conteudo | A pergunta está registada em inglês, palavra por palavra; o português é a edição portuguesa dessa mesma pergunta. | grelha-da-voz |
| conteudo | The question is registered in English, word for word; the Portuguese is the Portuguese edition of that same question. | grelha-da-voz |
| conteudo | O que está a ser medido, o que se segue, e o critério que pôs lá cada coisa. Com o calendário do que as fontes publicam a seguir. | grelha-da-voz |
| conteudo | What is being measured, what comes next, and the criterion that put each thing there. With the calendar of what the sources publish next. | grelha-da-voz |
| conteudo | O que as fontes citadas publicam a seguir. | grelha-da-voz |
| conteudo | What the cited sources publish next. | grelha-da-voz |
| conteudo | Cada estudo publicado, com as suas edições e datas. Os que estão alojados noutro sítio levam a ligação para lá. | grelha-da-voz |
| conteudo | Every published study, with its editions and dates. Those hosted elsewhere carry the link to it. | grelha-da-voz |
| conteudo | Documento alojado | grelha-da-voz |
| conteudo | Document hosted | grelha-da-voz |
| conteudo | Sem ficheiros. | grelha-da-voz |
| conteudo | No files. | grelha-da-voz |

## Bloco «A voz do livro-razão» · 27.08.2026

*A decisão do diretor de 27.08.2026 fechou as duas linhas que o
`PROTOCOLO-DAS-LEITURAS.md` guardava. **As ledes do livro-razão saem**: a do
índice principal, a do índice dos concelhos, a de cada página de concelho e a
descrição do `<head>` do índice principal, nas duas edições. Uma página do
livro-razão leva o seu título, as suas contagens, a sua pesquisa onde a tem e as
suas linhas; o que uma linha guarda lê-se na linha, e o método vive no Método.*

*As entradas antigas dessas frases saíram desta tabela*, pela regra que o bloco
dos 308 escreveu: uma frase corrigida que continue declarada volta em silêncio.
Saíram catorze linhas de texto e quatro de contagem.

***E as contagens de proveniência saem dos índices.*** «2544 de 2552 linhas com
proveniência completa» e «8 de 2552 linhas com campos por confirmar» eram os
títulos dos dois grupos do índice principal, e saíram com os grupos; «2417 com
proveniência completa» era a terceira parcela da linha de contagens do índice dos
concelhos, e saiu dela. É a escrituração da casa: uma linha por confirmar leva o
seu marcador ao lado do campo que falta, e todas juntas estão em `/a-verificar`.
**As chaves da prova que as contavam continuam contadas.** `indexaveis`,
`divida` e `concelhos_linhas_completas` ficam na tabela de `src/lib/prova.mjs`, e
o portão exige saber contar cada chave e não que alguma página a renda (§1.66
A3).

*As quatro cadeias novas: a descrição do `<head>` do índice do livro-razão, que
passa a nomear a página, e a linha de contagens do índice dos concelhos sem a
terceira parcela. As linhas com contagem levam o número de hoje, como as outras
deste ficheiro, e a leitura de zero ao lado, para o dia em que o livro-razão
estiver vazio.*

| classe | texto | bloco |
| --- | --- | --- |
| conteudo | Livro-razão · O Estado do País | voz-do-livro-razao |
| conteudo | Ledger · O Estado do País | voz-do-livro-razao |
| conteudo | 2417 linhas · 308 concelhos | voz-do-livro-razao |
| conteudo | 2417 rows · 308 municipalities | voz-do-livro-razao |
| conteudo | 0 linhas · 0 concelhos | voz-do-livro-razao |
| conteudo | 0 rows · 0 municipalities | voz-do-livro-razao |
