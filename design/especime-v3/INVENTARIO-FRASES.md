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
pública, classificadas em conteúdo, navegação e autorreferência (e, desde
01.09.2026, divulgação); a terceira
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

**E cinco colunas desde 27.08.2026** (G2 do bloco «A grelha, segunda passagem»,
ISSUES I74): o **estado** e a **razão**. Cada linha diz em que estado está, e a
construção confere os dois sentidos.

* **`viva`** · a frase rende-se em pelo menos uma rota inventariada. É o estado
  de 395 das 434 linhas. Uma linha `viva` que não se rende em rota nenhuma fecha
  a construção: ou a frase mudou e a linha ficou para trás, ou a rota saiu, e nos
  dois casos a lista está a mentir sobre o sítio.
* **`retirada`** · a casa tirou aquela frase de propósito. Ela **não pode**
  render-se: se voltar, a construção fecha e diz o nome dela. A coluna da razão
  diz que bloco a tirou, e uma linha `retirada` sem razão escrita fecha a
  construção também — uma proibição sem motivo é uma linha que ninguém sabe
  levantar. São 39.

**O que isto fecha.** O ficheiro escreve, desde o bloco dos 308, que «uma frase
corrigida sai desta lista», porque repô-la passaria em silêncio. Era verdade e
não chegava: nenhuma régua conferia a saída, e a limpeza era à mão. A I74 contou
**58 declarações que já não se rendiam em página nenhuma** na construção de
26.08, e este bloco encontrou 57 na sua (a diferença é o que os blocos da voz do
livro-razão e dos documentos mexeram pelo meio). Uma linha que fica sem se render
não é uma sentinela: é uma linha morta, e a lista engorda.

**Dezoito saíram em vez de ficarem, e a razão é que não podiam ser sentinelas.**
Catorze levam uma contagem por dentro («132 afirmações · 19 calculadas», «128 de
136 linhas com proveniência completa»): uma frase com um número que se move volta
com outro número, e a linha nunca voltaria a morder. Quatro deixaram de ser
frases da casa: o nome do lugar passou a declarar-se (`data-lugar`) ou a compor-se
(`<lugar>`), e a régua deixou de as ler como prosa. Quando uma contagem voltar,
volta como bloco **por classificar**, que é o portão que a apanha — e foi assim
que a planta desta passagem se viu vermelha duas vezes, uma por cada régua.

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
- **divulgação**: o que está na página porque a lei o obriga, e sairia no dia em
  que a lei mudasse: o rótulo de IA do artigo 50.º do Regulamento (UE) 2024/1689,
  a ficha do artigo 15.º da Lei de Imprensa, e a política publicada que o rótulo
  aponta. **Entrou a 01.09.2026**, e não abre porta traseira nenhuma à Emenda 15:
  a autorreferência existe **para mostrar diligência**, a divulgação existe
  **porque alguém tem de saber quem responde**, a contagem da terceira continua a
  ir a zero em todas as rotas medidas, e uma frase de divulgação que explique
  porque se deve confiar na casa é autorreferência com outro nome. A secção do
  bloco «rotulo-ia», mais abaixo, escreve-o por extenso.

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
  palavras da ausência («sem linha ainda» e «no row yet»). Não saíram do sítio
  nesse dia: saíram da PRIMEIRA PÁGINA, onde eram uma segunda rendição da página
  do concelho, e passaram a ler-se na página dele. **As duas palavras da ausência
  saíram do sítio inteiro a 28.08.2026** (bloco `vazios`, regra 3 do diretor), e
  estão declaradas `retirada` mais abaixo, com a razão;
* **duas mudaram de texto**, e são a descrição acessível do mapa nas duas
  edições: perderam a terceira frase, «Toque num ponto para escolher o
  concelho.», que descrevia um gesto que a página deixou de fazer. Um ponto com
  página é uma ligação, e um destino diz-se na ligação e no seu `<title>`.

«fechar» e «trocar de concelho» não estão nesta contagem, e a razão é a
definição: um bloco cujo texto é todo ele uma ligação ou um botão não é uma frase
da casa (`textoForaDeComandos` em `scripts/medir-defeitos.mjs`), e nunca entrou
nesta tabela. «fechar» deixou de se render; «trocar de concelho» rende-se onde o
cartão localizador vive, na página do concelho, e leva ao índice dos 308.

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | A régua da convergência | regioes | viva | — |
| navegacao | An observatory of Portugal. | até 2026-08-26 | viva | — |
| conteudo | Alentejo · region | regioes | retirada | o bloco de cabeça de cada região saiu da primeira página com o estado `?ambito=regiao:<slug>` que o acendia (Emenda 21b, 27.08.2026); a página de uma região diz o nome como lugar e o tipo, «região NUTS II» |
| conteudo | Alentejo · região | regioes | retirada | o bloco de cabeça de cada região saiu da primeira página com o estado `?ambito=regiao:<slug>` que o acendia (Emenda 21b, 27.08.2026); a página de uma região diz o nome como lugar e o tipo, «região NUTS II» |
| conteudo | Algarve · region | regioes | retirada | o bloco de cabeça de cada região saiu da primeira página com o estado `?ambito=regiao:<slug>` que o acendia (Emenda 21b, 27.08.2026); a página de uma região diz o nome como lugar e o tipo, «região NUTS II» |
| conteudo | Algarve · região | regioes | retirada | o bloco de cabeça de cada região saiu da primeira página com o estado `?ambito=regiao:<slug>` que o acendia (Emenda 21b, 27.08.2026); a página de uma região diz o nome como lugar e o tipo, «região NUTS II» |
| navegacao | As regiões publicadas na régua da convergência. | grelha-2 | retirada | a régua da convergência saiu da primeira página até haver a página das regiões (Emenda 18, consequência decidida a 25.08; bloco A da auditoria de UI e UX, `696b51a`) |
| navegacao | At a glance | até 2026-08-26 | viva | — |
| navegacao | Brief reading | até 2026-08-26 | viva | — |
| conteudo | concelhos · CAOP | frases | viva | — |
| conteudo | Custo do trabalho por unidade produzida, por hora trabalhada. | frases | viva | — |
| conteudo | Dívida bruta das administrações públicas, no conceito do Procedimento dos Défices Excessivos. Está acima do limiar do painel europeu, e a descer. | frases | retirada | o F0.9 tirou «e a descer» a 03.09.2026: era uma tendência, e o livro-razão publica um só valor deste indicador (`grep -rl tipsgo10 ledger/claims/` devolve um ficheiro, o de 2025). Uma tendência volta em F3.1, tipada, com a linha do período anterior ao lado, e não com estas palavras |
| conteudo | Dívida bruta das administrações públicas, no conceito do Procedimento dos Défices Excessivos. Está acima do limiar do painel europeu. | leitura | viva | — |
| navegacao | Encontrou um erro? correcoes@oestadodopais.pt · O registo de correções → | até 2026-08-26 | viva | — |
| conteudo | Fora do limiar: dívida pública, posição de investimento internacional, custo unitário do trabalho e preços da habitação , em . | frases | viva | — |
| navegacao | Found an error? correcoes@oestadodopais.pt · The corrections log → | até 2026-08-26 | viva | — |
| conteudo | General government gross debt, on the Excessive Deficit Procedure concept. It is above the European scoreboard threshold, and falling. | frases | retirada | a gémea inglesa da de cima: o F0.9 tirou «and falling» a 03.09.2026, pela mesma razão e no mesmo dia. Uma linha é uma decisão editorial e leva as duas edições da mesma frase |
| conteudo | General government gross debt, on the Excessive Deficit Procedure concept. It is above the European scoreboard threshold. | leitura | viva | — |
| conteudo | Grande Lisboa · região | regioes | retirada | o bloco de cabeça de cada região saiu da primeira página com o estado `?ambito=regiao:<slug>` que o acendia (Emenda 21b, 27.08.2026); a página de uma região diz o nome como lugar e o tipo, «região NUTS II» |
| conteudo | Greater Lisbon · region | regioes | retirada | o bloco de cabeça de cada região saiu da primeira página com o estado `?ambito=regiao:<slug>` que o acendia (Emenda 21b, 27.08.2026); a página de uma região diz o nome como lugar e o tipo, «região NUTS II» |
| navegacao | Hover over a point to read the municipality. Keyboard: Tab to the map, arrow keys to move between neighbouring municipalities, Home to return to Évora. | grelha-2 | retirada | a leitura em voz alta do mapa saiu com os pontos da primeira página (Emenda 20a e 20c; bloco do mapa por distritos) |
| conteudo | Índice nominal de preços da habitação. | frases | viva | — |
| conteudo | Jovens que deixaram a escola com o secundário incompleto e não estão em formação. | frases | viva | — |
| conteudo | Labour cost per unit of output, per hour worked. | frases | viva | — |
| navegacao | Leitura breve | até 2026-08-26 | viva | — |
| conteudo | limiar % · abaixo | frases | viva | — |
| conteudo | limiar % · acima | frases | viva | — |
| conteudo | limiar − % · abaixo | frases | viva | — |
| conteudo | limiar − % · acima | frases | viva | — |
| conteudo | limiar − /+ % | frases | viva | — |
| conteudo | limiar − pp · acima | frases | viva | — |
| conteudo | Madeira · region | regioes | retirada | o bloco de cabeça de cada região saiu da primeira página com o estado `?ambito=regiao:<slug>` que o acendia (Emenda 21b, 27.08.2026); a página de uma região diz o nome como lugar e o tipo, «região NUTS II» |
| conteudo | Madeira · região | regioes | retirada | o bloco de cabeça de cada região saiu da primeira página com o estado `?ambito=regiao:<slug>` que o acendia (Emenda 21b, 27.08.2026); a página de uma região diz o nome como lugar e o tipo, «região NUTS II» |
| conteudo | municipalities · CAOP | frases | viva | — |
| navegacao | Nenhum concelho com esse nome. | até 2026-08-26 | viva | — |
| navegacao | No municipality by that name. | até 2026-08-26 | viva | — |
| conteudo | Nominal house price index. | frases | viva | — |
| navegacao | O Estado do País | até 2026-08-26 | viva | — |
| conteudo | O que o país tem a haver do exterior menos o que lhe deve: negativo quando deve mais do que tem a haver. | até 2026-08-26 | viva | — |
| conteudo | O índice compara o PIB per capita de cada território, medido em paridades de poder de compra, com a média da UE-27. Um valor abaixo da média significa menos poder de compra por pessoa; um valor acima, mais. | regioes | viva | — |
| conteudo | Outside the threshold: government debt, net international investment position, unit labour cost and house prices , in . | frases | viva | — |
| navegacao | Passe o cursor sobre um ponto para ler o município. Teclado: Tab até ao mapa, setas para percorrer os municípios vizinhos, Home para voltar a Évora. | grelha-2 | retirada | a leitura em voz alta do mapa saiu com os pontos da primeira página (Emenda 20a e 20c; bloco do mapa por distritos) |
| conteudo | Península de Setúbal · região | regioes | retirada | o bloco de cabeça de cada região saiu da primeira página com o estado `?ambito=regiao:<slug>` que o acendia (Emenda 21b, 27.08.2026); a página de uma região diz o nome como lugar e o tipo, «região NUTS II» |
| conteudo | Portugal breaches 4 thresholds of the Macroeconomic Imbalance Procedure and meets 9 . | até 2026-08-26 | viva | — |
| conteudo | Portugal nos painéis europeus: os indicadores, os limiares e as fontes. | até 2026-08-26 | viva | — |
| conteudo | Portugal on the European scoreboards: the indicators, the thresholds and the sources. | até 2026-08-26 | viva | — |
| conteudo | Portugal ultrapassa 4 limiares do Procedimento dos Desequilíbrios Macroeconómicos e cumpre 9 . | até 2026-08-26 | viva | — |
| conteudo | Portugal · country | até 2026-08-26 | retirada | o F1.1 tirou o rótulo do âmbito da cabeça do PAÍS a 03.09.2026: dizia o nome do lugar e o tipo dele por cima de uma manchete que começa pela mesma palavra («Portugal ultrapassa…»), custava uma fila do primeiro ecrã do telemóvel, e era o eco do comando de âmbito, que saiu da página no mesmo bloco. O rótulo fica onde separa alguma coisa: nas páginas de região e de concelho, onde o tipo do lugar não está na manchete |
| conteudo | Portugal · país | até 2026-08-26 | retirada | o F1.1 tirou o rótulo do âmbito da cabeça do PAÍS a 03.09.2026: dizia o nome do lugar e o tipo dele por cima de uma manchete que começa pela mesma palavra («Portugal ultrapassa…»), custava uma fila do primeiro ecrã do telemóvel, e era o eco do comando de âmbito, que saiu da página no mesmo bloco. O rótulo fica onde separa alguma coisa: nas páginas de região e de concelho, onde o tipo do lugar não está na manchete |
| conteudo | Proporção das pessoas dos aos anos com emprego. | leitura | viva | — |
| conteudo | Proporção que gasta mais de % do rendimento disponível em habitação. | frases | viva | — |
| navegacao | Relance | até 2026-08-26 | viva | — |
| conteudo | Setúbal Peninsula · region | regioes | retirada | o bloco de cabeça de cada região saiu da primeira página com o estado `?ambito=regiao:<slug>` que o acendia (Emenda 21b, 27.08.2026); a página de uma região diz o nome como lugar e o tipo, «região NUTS II» |
| conteudo | The convergence rule | regioes | viva | — |
| conteudo | The index compares each territory’s GDP per capita, measured in purchasing power standards, with the EU-27 average. A value below the average means less purchasing power per person; a value above it, more. | regioes | viva | — |
| navegacao | The regions published on the convergence rule. | grelha-2 | retirada | a régua da convergência saiu da primeira página até haver a página das regiões (Emenda 18, consequência decidida a 25.08; bloco A da auditoria de UI e UX, `696b51a`) |
| conteudo | The share of people aged to who are in employment. | leitura | viva | — |
| conteudo | The share spending more than % of disposable income on housing. | frases | viva | — |
| conteudo | threshold % · above | frases | viva | — |
| conteudo | threshold % · below | frases | viva | — |
| conteudo | threshold − % · above | frases | viva | — |
| conteudo | threshold − % · below | frases | viva | — |
| conteudo | threshold − /+ % | frases | viva | — |
| conteudo | threshold − pp · above | frases | viva | — |
| conteudo | What the country is owed from abroad minus what it owes abroad: negative when it owes more than it is owed. | até 2026-08-26 | viva | — |

## `/livro-razao` · `/en/ledger` (etapa 3, subetapa 3b)

*As duas edições partilham a tabela, como acima: uma frase entra uma vez, na
língua em que é rendida.*

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | A licença cobre o conjunto: a estrutura, os valores da casa, as derivações e as descrições. Os excertos transcritos das fontes continuam sob os termos de quem os publicou. | até 2026-08-26 | viva | — |
| conteudo | Com campos por confirmar | grelha-2 | retirada | a legenda dos dois estados do selo de proveniência saiu das páginas do leitor (`46608f4`, 25.08, e a decisão do diretor de 27.08 que tirou as contagens de proveniência dos índices, `ef8a78e`) |
| conteudo | Complete provenance | grelha-2 | retirada | a legenda dos dois estados do selo de proveniência saiu das páginas do leitor (`46608f4`, 25.08, e a decisão do diretor de 27.08 que tirou as contagens de proveniência dos índices, `ef8a78e`) |
| navegacao | Descarregar o livro-razão: CSV · JSON | até 2026-08-26 | viva | — |
| navegacao | Download the ledger: CSV · JSON | até 2026-08-26 | viva | — |
| conteudo | O livro-razão | até 2026-08-26 | viva | — |
| conteudo | one field unconfirmed | até 2026-08-26 | viva | — |
| conteudo | provenance complete | até 2026-08-26 | viva | — |
| conteudo | proveniência completa | até 2026-08-26 | viva | — |
| conteudo | um campo por confirmar | até 2026-08-26 | viva | — |
| conteudo | Os dois estados do selo | até 2026-08-26 | viva | — |
| conteudo | The ledger | até 2026-08-26 | viva | — |
| conteudo | The licence covers the dataset: its structure, the house values, the derivations and the descriptions. Excerpts transcribed from sources remain under their publishers’ terms. | até 2026-08-26 | viva | — |
| conteudo | The two states of the seal | até 2026-08-26 | viva | — |
| navegacao | Um observatório de Portugal. | até 2026-08-26 | viva | — |
| conteudo | With fields to confirm | grelha-2 | retirada | a legenda dos dois estados do selo de proveniência saiu das páginas do leitor (`46608f4`, 25.08, e a decisão do diretor de 27.08 que tirou as contagens de proveniência dos índices, `ef8a78e`) |
| conteudo | [a verificar] | até 2026-08-26 | viva | — |
| conteudo | [a verificar] (to verify) | até 2026-08-26 | viva | — |

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

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | Aveiro | até 2026-08-26 | viva | — |
| conteudo | Beja | até 2026-08-26 | viva | — |
| conteudo | Braga | até 2026-08-26 | viva | — |
| conteudo | Bragança | até 2026-08-26 | viva | — |
| conteudo | Castelo Branco | até 2026-08-26 | viva | — |
| conteudo | Coimbra | até 2026-08-26 | viva | — |
| conteudo | Every municipality in Portugal, from the official administrative map. | até 2026-08-26 | viva | — |
| conteudo | Every municipality, from the Carta Administrativa Oficial de Portugal. | até 2026-08-26 | viva | — |
| conteudo | Faro | até 2026-08-26 | viva | — |
| conteudo | Guarda | até 2026-08-26 | viva | — |
| conteudo | Ilha Terceira | até 2026-08-26 | viva | — |
| conteudo | Ilha da Graciosa | até 2026-08-26 | viva | — |
| conteudo | Ilha da Madeira | até 2026-08-26 | viva | — |
| conteudo | Ilha das Flores | até 2026-08-26 | viva | — |
| conteudo | Ilha de Porto Santo | até 2026-08-26 | viva | — |
| conteudo | Ilha de Santa Maria | até 2026-08-26 | viva | — |
| conteudo | Ilha de São Jorge | até 2026-08-26 | viva | — |
| conteudo | Ilha de São Miguel | até 2026-08-26 | viva | — |
| conteudo | Ilha do Corvo | até 2026-08-26 | viva | — |
| conteudo | Ilha do Faial | até 2026-08-26 | viva | — |
| conteudo | Ilha do Pico | até 2026-08-26 | viva | — |
| conteudo | Leiria | até 2026-08-26 | viva | — |
| conteudo | Lisboa | até 2026-08-26 | viva | — |
| conteudo | Os concelhos de Portugal | até 2026-08-26 | viva | — |
| conteudo | Portalegre | até 2026-08-26 | viva | — |
| conteudo | Porto | até 2026-08-26 | viva | — |
| conteudo | Santarém | até 2026-08-26 | viva | — |
| conteudo | Setúbal | até 2026-08-26 | viva | — |
| conteudo | The municipalities of Portugal | até 2026-08-26 | viva | — |
| conteudo | Todos os concelhos de Portugal, pela Carta Administrativa Oficial. | até 2026-08-26 | viva | — |
| conteudo | Todos os concelhos, pela Carta Administrativa Oficial de Portugal. | até 2026-08-26 | viva | — |
| conteudo | Viana do Castelo | até 2026-08-26 | viva | — |
| conteudo | Vila Real | até 2026-08-26 | viva | — |
| conteudo | Viseu | até 2026-08-26 | viva | — |

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

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | A diferença entre as duas contas da mesma dívida | até 2026-08-26 | viva | — |
| conteudo | A dívida contra o teto legal | até 2026-08-26 | viva | — |
| conteudo | A última prestação de contas do município | até 2026-08-26 | viva | — |
| conteudo | Accounts of the year before last | até 2026-08-26 | viva | — |
| navegacao | Background | até 2026-08-26 | viva | — |
| conteudo | Borrowing margin | até 2026-08-26 | viva | — |
| conteudo | Contas do penúltimo ano | até 2026-08-26 | viva | — |
| conteudo | Corrected budget | até 2026-08-26 | viva | — |
| conteudo | Debt limit | até 2026-08-26 | viva | — |
| conteudo | Decided | até 2026-08-26 | viva | — |
| conteudo | Decidiu | até 2026-08-26 | viva | — |
| conteudo | Deixou | até 2026-08-26 | viva | — |
| conteudo | Despesa paga | até 2026-08-26 | viva | — |
| conteudo | Diferença | até 2026-08-26 | viva | — |
| conteudo | Difference | até 2026-08-26 | viva | — |
| conteudo | Dívida total | até 2026-08-26 | viva | — |
| conteudo | Economia, investidores e portas abertas no município de Évora. | até 2026-08-26 | viva | — |
| conteudo | Economy, investors and open doors in the municipality of Évora. | até 2026-08-26 | viva | — |
| conteudo | Em funções. | até 2026-08-26 | viva | — |
| conteudo | Estimativa anual do INE para o concelho. | até 2026-08-26 | viva | — |
| conteudo | Executive installed | até 2026-08-26 | viva | — |
| conteudo | Executivo instalado | até 2026-08-26 | viva | — |
| conteudo | Expenditure paid | até 2026-08-26 | viva | — |
| conteudo | Fifteen years of municipal government in Évora, across five terms. | até 2026-08-26 | viva | — |
| navegacao | Fundo | até 2026-08-26 | viva | — |
| conteudo | Herdou | até 2026-08-26 | viva | — |
| conteudo | In office. | até 2026-08-26 | viva | — |
| conteudo | Inherited | até 2026-08-26 | viva | — |
| conteudo | Inscritos no fim do mês nos serviços de emprego, ficheiro mensal por concelho. | até 2026-08-26 | viva | — |
| conteudo | Left | até 2026-08-26 | viva | — |
| conteudo | Limite de dívida | até 2026-08-26 | viva | — |
| conteudo | Lugares | até 2026-08-26 | viva | — |
| conteudo | Margem de endividamento | até 2026-08-26 | viva | — |
| conteudo | O município publica | até 2026-08-26 | viva | — |
| conteudo | O que foi orçamentado, o que foi pago e o que ficou em dívida no município de Évora. | até 2026-08-26 | viva | — |
| conteudo | O que o município orçamentou, o que cobrou, o que pagou, e o que dizia dever no fim do ano. São números do próprio município sobre si mesmo: a prestação de contas é dele. | até 2026-08-26 | viva | — |
| conteudo | O regulador | grelha-2 | retirada | a Direção-Geral das Autarquias Locais deixou de ser chamada «o regulador» e passou a ter o seu nome (item E11 do bloco dos 308, `8b55bd3`; as cadeias que ele não alcançou saíram no G5 da grelha da voz, `e470212`) |
| conteudo | O regulador publica | grelha-2 | retirada | a Direção-Geral das Autarquias Locais deixou de ser chamada «o regulador» e passou a ter o seu nome (item E11 do bloco dos 308, `8b55bd3`; as cadeias que ele não alcançou saíram no G5 da grelha da voz, `e470212`) |
| conteudo | O traço fino é a dívida total que o regulador publica para o concelho; a barra é a distância até ao limite legal do mesmo ano, que é o fio da direita. O índice mede uma contra o outro numa escala em que o teto é o valor permitido. | grelha-2 | retirada | a Direção-Geral das Autarquias Locais deixou de ser chamada «o regulador» e passou a ter o seu nome (item E11 do bloco dos 308, `8b55bd3`; as cadeias que ele não alcançou saíram no G5 da grelha da voz, `e470212`) |
| conteudo | Orçamento corrigido | até 2026-08-26 | viva | — |
| conteudo | Os trabalhos sobre este concelho | até 2026-08-26 | viva | — |
| conteudo | Pelouros | até 2026-08-26 | viva | — |
| conteudo | Poder de compra per capita, publicado pelo INE para todos os concelhos. | até 2026-08-26 | viva | — |
| conteudo | Portfolios | até 2026-08-26 | viva | — |
| conteudo | Provenance | até 2026-08-26 | viva | — |
| conteudo | Proveniência | até 2026-08-26 | viva | — |
| conteudo | Purchasing power per capita, published for every municipality. | até 2026-08-26 | viva | — |
| conteudo | Quem administrou, e o que as contas registaram | até 2026-08-26 | viva | — |
| conteudo | Quem responde pelo quê | até 2026-08-26 | viva | — |
| conteudo | Quinze anos de governo municipal em Évora, ao longo de cinco mandatos. | até 2026-08-26 | viva | — |
| conteudo | Receita cobrada | até 2026-08-26 | viva | — |
| conteudo | Registered with the employment service at month end, monthly file by municipality. | até 2026-08-26 | viva | — |
| conteudo | Reportado pelo município: sai da prestação de contas do próprio, não de um agregador central. | grelha-2 | retirada | saiu com o G6 da grelha da voz, que tirou o método das páginas do leitor: as ressalvas da página do concelho com as secções que as guardavam, os rótulos que diziam como o texto foi feito, e a nota da lei do limite da dívida (`14a339d`, 27.08) |
| conteudo | Reported by the municipality: it comes from its own accounts, not from a central aggregator. | grelha-2 | retirada | saiu com o G6 da grelha da voz, que tirou o método das páginas do leitor: as ressalvas da página do concelho com as secções que as guardavam, os rótulos que diziam como o texto foi feito, e a nota da lei do limite da dívida (`14a339d`, 27.08) |
| conteudo | Revenue collected | até 2026-08-26 | viva | — |
| conteudo | Seats | até 2026-08-26 | viva | — |
| conteudo | The debt against the legal ceiling | até 2026-08-26 | viva | — |
| conteudo | The gap between the two accounts of the same debt | até 2026-08-26 | viva | — |
| conteudo | The municipality publishes | até 2026-08-26 | viva | — |
| conteudo | The municipality’s latest accounts | até 2026-08-26 | viva | — |
| conteudo | The recovery-plan totals that appear in that work’s reading are sums over the public register, attributed to the concelho by that register. Of the money contracted in the concelho, the university holds more than the municipality, and the layer that administers the money is made of national bodies. That this makes the accountability address something other than the town hall is that work’s own signed conclusion, and it sits on its page. | grelha-2 | retirada | saiu com o G6 da grelha da voz, que tirou o método das páginas do leitor: as ressalvas da página do concelho com as secções que as guardavam, os rótulos que diziam como o texto foi feito, e a nota da lei do limite da dívida (`14a339d`, 27.08) |
| conteudo | The regulator | grelha-2 | retirada | a Direção-Geral das Autarquias Locais deixou de ser chamada «o regulador» e passou a ter o seu nome (item E11 do bloco dos 308, `8b55bd3`; as cadeias que ele não alcançou saíram no G5 da grelha da voz, `e470212`) |
| conteudo | The regulator and the municipality publish the same year’s debt with a difference between them. The difference is small, and it is shown because it is the only place where an outside voice and the municipality’s own voice measure the same thing. | grelha-2 | retirada | a Direção-Geral das Autarquias Locais deixou de ser chamada «o regulador» e passou a ter o seu nome (item E11 do bloco dos 308, `8b55bd3`; as cadeias que ele não alcançou saíram no G5 da grelha da voz, `e470212`) |
| conteudo | The regulator publishes | grelha-2 | retirada | a Direção-Geral das Autarquias Locais deixou de ser chamada «o regulador» e passou a ter o seu nome (item E11 do bloco dos 308, `8b55bd3`; as cadeias que ele não alcançou saíram no G5 da grelha da voz, `e470212`) |
| conteudo | The statistics institute’s annual estimate for the municipality. | até 2026-08-26 | viva | — |
| conteudo | The thin line is the total debt the regulator publishes for the concelho; the bar is the distance to the legal limit for the same year, which is the rule on the right. The index measures one against the other on a scale whose cap is the permitted value. | grelha-2 | retirada | a Direção-Geral das Autarquias Locais deixou de ser chamada «o regulador» e passou a ter o seu nome (item E11 do bloco dos 308, `8b55bd3`; as cadeias que ele não alcançou saíram no G5 da grelha da voz, `e470212`) |
| conteudo | The works about this concelho | grelha-2 | retirada | saiu com o G6 da grelha da voz, que tirou o método das páginas do leitor: as ressalvas da página do concelho com as secções que as guardavam, os rótulos que diziam como o texto foi feito, e a nota da lei do limite da dívida (`14a339d`, 27.08) |
| conteudo | Total debt | até 2026-08-26 | viva | — |
| conteudo | What the municipality budgeted, what it collected, what it paid, and what it said it owed at year end. These are the municipality’s own figures about itself: the accounts are its own. | até 2026-08-26 | viva | — |
| conteudo | What was budgeted, what was paid and what was left owing in the municipality of Évora. | até 2026-08-26 | viva | — |
| conteudo | Who answers for what | até 2026-08-26 | viva | — |
| conteudo | Who governed, and what the accounts recorded | até 2026-08-26 | viva | — |
| conteudo | Who held each portfolio of the Câmara Municipal de Évora across five terms, how much the municipality’s own accounts spent in the areas those portfolios cover, and what the reports say those areas did. | até 2026-08-26 | viva | — |
| conteudo | no row yet | vazios | retirada | as duas palavras da ausência saíram do sítio (diretor, 28.08.2026, regra 3): depois de a execução da receita perder a peça (regra 1) e de as onze linhas que a fonte imprime «N.d.» passarem a mostrar o valor publicado (regra 2), nenhuma peça de concelho fica sem linha; e o campo «Decidiu» do mandato de 2017 a 2021 de Évora, que não tem valores nem nota, deixou de se render em vez de dizer a cadeia. A FORMA fica no código, para uma falta futura genuína (Emenda 14): a peça vazia continua escrita em `Peca.astro` e as duas cadeias continuam em `strings.mjs` |
| conteudo | sem linha ainda | vazios | retirada | as duas palavras da ausência saíram do sítio (diretor, 28.08.2026, regra 3): depois de a execução da receita perder a peça (regra 1) e de as onze linhas que a fonte imprime «N.d.» passarem a mostrar o valor publicado (regra 2), nenhuma peça de concelho fica sem linha; e o campo «Decidiu» do mandato de 2017 a 2021 de Évora, que não tem valores nem nota, deixou de se render em vez de dizer a cadeia. A FORMA fica no código, para uma falta futura genuína (Emenda 14): a peça vazia continua escrita em `Peca.astro` e as duas cadeias continuam em `strings.mjs` |
| conteudo | Évora | até 2026-08-26 | viva | — |

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

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | 26 provenance revisions | até 2026-08-26 | viva | — |
| conteudo | 26 revisões de proveniência | até 2026-08-26 | viva | — |
| conteudo | A política | até 2026-08-26 | viva | — |
| conteudo | A política de correções deste sítio e o registo de todas: o valor anterior à vista, datado, com o motivo, e nada apagado. | até 2026-08-26 | viva | — |
| conteudo | An entry in the register holds the previous value, the new value, the date, the reason and the ledger row that changed. Nothing is removed: a corrected entry is added to that row’s history, it does not replace it. There are three kinds, and they are not mixed: | até 2026-08-26 | viva | — |
| conteudo | Anyone who finds an error writes to correcoes@oestadodopais.pt . A confirmed error enters the register with credit to whoever found it, if they wish. | até 2026-08-26 | viva | — |
| conteudo | Atualização. O valor estava certo e deixou de estar, porque aquilo que mede mudou. Não é um erro. | até 2026-08-26 | viva | — |
| conteudo | Atualizações | até 2026-08-26 | viva | — |
| conteudo | Correcting in silence is the cheapest way of lying. | até 2026-08-26 | viva | — |
| conteudo | Correction. The published value was wrong. It is a confession, and it is the reason the register exists. | até 2026-08-26 | viva | — |
| conteudo | Corrections | até 2026-08-26 | viva | — |
| conteudo | Correção. O valor publicado estava errado. É uma confissão, e é a razão de o registo existir. | até 2026-08-26 | viva | — |
| conteudo | Correções | até 2026-08-26 | viva | — |
| conteudo | Corrigir em silêncio é a forma mais barata de mentir. | até 2026-08-26 | viva | — |
| navegacao | Escreva aqui e o botão abre o seu programa de correio com o texto já dentro. Nada é enviado deste sítio: a mensagem sai de si, para si ficar com uma cópia. | até 2026-08-26 | viva | — |
| conteudo | Escrever uma correção | até 2026-08-26 | viva | — |
| navegacao | If the button opens nothing, your computer has no mail program set up. In that case copy the address above and write from wherever you normally write. | até 2026-08-26 | viva | — |
| conteudo | O que foi corrigido, e o que mudou | até 2026-08-26 | viva | — |
| conteudo | O registo | até 2026-08-26 | viva | — |
| conteudo | O valor não mudou; mudou a maneira de lá chegar: uma fonte que muda de endereço, por exemplo. Não são erros nem atualizações, e não se listam aqui uma a uma: são muitas de cada vez e afogariam as correções. Cada linha abaixo leva à sua própria história, onde a revisão está escrita por extenso. | até 2026-08-26 | viva | — |
| conteudo | Provenance revision. The value did not change; the route to the source did, an address for example. It is neither an error nor an update. | até 2026-08-26 | viva | — |
| conteudo | Provenance revisions | até 2026-08-26 | viva | — |
| conteudo | Quem encontrar um erro escreve para correcoes@oestadodopais.pt . Um erro confirmado entra no registo com crédito a quem o encontrou, se o desejar. | até 2026-08-26 | viva | — |
| conteudo | Revisão de proveniência. O valor não mudou; mudou o caminho até à fonte, um endereço por exemplo. Não é erro nem atualização. | até 2026-08-26 | viva | — |
| conteudo | Revisões de proveniência | até 2026-08-26 | viva | — |
| navegacao | Se o botão não abrir nada, o seu computador não tem programa de correio configurado. Nesse caso copie o endereço acima e escreva de onde costuma escrever. | até 2026-08-26 | viva | — |
| conteudo | The corrections policy of this site and the register of them all: the previous value in plain sight, dated, with the reason, and nothing deleted. | até 2026-08-26 | viva | — |
| conteudo | The policy | até 2026-08-26 | viva | — |
| conteudo | The register | até 2026-08-26 | viva | — |
| conteudo | The value did not change; the way to find it did: a source that moves address, for example. They are neither errors nor updates, and they are not listed one by one here: they come many at a time and would drown the corrections. Each row below leads to its own history, where the revision is written out in full. | até 2026-08-26 | viva | — |
| conteudo | Uma entrada do registo guarda o valor anterior, o valor novo, a data, o motivo e a linha do livro-razão que mudou. Nada é removido: uma entrada corrigida acresce à história daquela linha, não a substitui. São três naturezas, e não se misturam: | até 2026-08-26 | viva | — |
| conteudo | Update. The value was right and stopped being so, because what it measures changed. It is not an error. | até 2026-08-26 | viva | — |
| conteudo | Updates | até 2026-08-26 | viva | — |
| conteudo | Valores que estavam certos e deixaram de estar, porque aquilo que medem mudou. Não são erros, e não contam para o número acima. | até 2026-08-26 | viva | — |
| conteudo | Valores que estavam errados. Cada um fica com o valor anterior à vista, datado, e nenhum é removido. | até 2026-08-26 | viva | — |
| conteudo | Values that were right and stopped being so, because what they measure changed. They are not errors, and they do not count towards the number above. | até 2026-08-26 | viva | — |
| conteudo | Values that were wrong. Each keeps its previous value in plain sight, dated, and none is removed. | até 2026-08-26 | viva | — |
| conteudo | What was corrected, and what changed | até 2026-08-26 | viva | — |
| conteudo | Write a correction | até 2026-08-26 | viva | — |
| navegacao | Write here and the button opens your own mail program with the text already in it. Nothing is sent from this site: the message leaves from you, so you keep a copy of it. | até 2026-08-26 | viva | — |

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

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | A pergunta | até 2026-08-26 | viva | — |
| conteudo | A seguir | até 2026-08-26 | viva | — |
| conteudo | Com data publicada pela fonte | até 2026-08-26 | viva | — |
| conteudo | Concluded | até 2026-08-26 | viva | — |
| conteudo | Concluído | até 2026-08-26 | viva | — |
| conteudo | Criteria | até 2026-08-26 | viva | — |
| conteudo | Critérios | até 2026-08-26 | viva | — |
| conteudo | Em curso | até 2026-08-26 | viva | — |
| conteudo | Nenhum até hoje. | até 2026-08-26 | viva | — |
| navegacao | Nesta página | até 2026-08-26 | viva | — |
| conteudo | Next | até 2026-08-26 | viva | — |
| conteudo | No criterion. | até 2026-08-26 | viva | — |
| conteudo | None to date. | até 2026-08-26 | viva | — |
| conteudo | O calendário das fontes | até 2026-08-26 | viva | — |
| conteudo | O calendário, no tempo | até 2026-08-26 | viva | — |
| conteudo | O que está em cada estado | até 2026-08-26 | viva | — |
| conteudo | O que mudou | até 2026-08-26 | viva | — |
| conteudo | O que se mede a seguir | até 2026-08-26 | viva | — |
| navegacao | On this page | até 2026-08-26 | viva | — |
| conteudo | Porquê | até 2026-08-26 | viva | — |
| conteudo | Retirado | até 2026-08-26 | viva | — |
| conteudo | Sem critério. | até 2026-08-26 | viva | — |
| conteudo | Sem data, porque a fonte não publica nenhuma | até 2026-08-26 | viva | — |
| conteudo | The calendar, in time | até 2026-08-26 | viva | — |
| conteudo | The question | até 2026-08-26 | viva | — |
| conteudo | The source calendar | até 2026-08-26 | viva | — |
| conteudo | Under way | até 2026-08-26 | viva | — |
| conteudo | What changed | até 2026-08-26 | viva | — |
| conteudo | What gets measured next | até 2026-08-26 | viva | — |
| conteudo | What is in each state | até 2026-08-26 | viva | — |
| conteudo | Why | até 2026-08-26 | viva | — |
| conteudo | With a date the source publishes | até 2026-08-26 | viva | — |
| conteudo | With no date, because the source publishes none | até 2026-08-26 | viva | — |
| conteudo | Withdrawn | até 2026-08-26 | viva | — |

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

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | % desse valor está nas quatro maiores empresas | até 2026-08-26 | viva | — |
| conteudo | % dez anos depois | até 2026-08-26 | viva | — |
| conteudo | % do orçamento foi de facto cobrado no último ano de contas | até 2026-08-26 | viva | — |
| conteudo | % four years earlier | até 2026-08-26 | viva | — |
| conteudo | % of that value sits with the four largest enterprises | até 2026-08-26 | viva | — |
| conteudo | % of the budget was actually collected in the latest year of accounts | até 2026-08-26 | viva | — |
| conteudo | % quatro anos antes | até 2026-08-26 | viva | — |
| conteudo | % ten years later | até 2026-08-26 | viva | — |
| conteudo | A cross-cutting reading of the municipality of Évora: the recovery-plan project register, the public-contracts register and the state auditor's catalogue. | voz-dos-documentos | viva | — |
| navegacao | A ligação sai deste domínio. | até 2026-08-26 | viva | — |
| conteudo | As contas do penúltimo ano foram rejeitadas em votação e nunca foram certificadas. | até 2026-08-26 | viva | — |
| conteudo | Avaliação económica das regiões de Portugal. | até 2026-08-26 | viva | — |
| conteudo | Datas de publicação por confirmar. | até 2026-08-26 | viva | — |
| conteudo | Description: house translation of the document’s opening sentence | grelha-2 | retirada | saiu com o G6 da grelha da voz, que tirou o método das páginas do leitor: as ressalvas da página do concelho com as secções que as guardavam, os rótulos que diziam como o texto foi feito, e a nota da lei do limite da dívida (`14a339d`, 27.08) |
| conteudo | Description: opening sentence of the document | grelha-2 | retirada | saiu com o G6 da grelha da voz, que tirou o método das páginas do leitor: as ressalvas da página do concelho com as secções que as guardavam, os rótulos que diziam como o texto foi feito, e a nota da lei do limite da dívida (`14a339d`, 27.08) |
| conteudo | Description: restatement of the title | grelha-2 | retirada | saiu com o G6 da grelha da voz, que tirou o método das páginas do leitor: as ressalvas da página do concelho com as secções que as guardavam, os rótulos que diziam como o texto foi feito, e a nota da lei do limite da dívida (`14a339d`, 27.08) |
| conteudo | Descrição: frase de abertura do documento | grelha-2 | retirada | saiu com o G6 da grelha da voz, que tirou o método das páginas do leitor: as ressalvas da página do concelho com as secções que as guardavam, os rótulos que diziam como o texto foi feito, e a nota da lei do limite da dívida (`14a339d`, 27.08) |
| conteudo | Descrição: reformulação do título | grelha-2 | retirada | saiu com o G6 da grelha da voz, que tirou o método das páginas do leitor: as ressalvas da página do concelho com as secções que as guardavam, os rótulos que diziam como o texto foi feito, e a nota da lei do limite da dívida (`14a339d`, 27.08) |
| conteudo | Descrição: tradução da casa da frase de abertura do documento | grelha-2 | retirada | saiu com o G6 da grelha da voz, que tirou o método das páginas do leitor: as ressalvas da página do concelho com as secções que as guardavam, os rótulos que diziam como o texto foi feito, e a nota da lei do limite da dívida (`14a339d`, 27.08) |
| conteudo | designations, over three people, in the next executive | até 2026-08-26 | viva | — |
| conteudo | designações, por três pessoas, no executivo seguinte | até 2026-08-26 | viva | — |
| conteudo | Economia, sociedade e estratégia no Alentejo e no Algarve. | até 2026-08-26 | viva | — |
| conteudo | Economic assessment of Portugal’s regions. | até 2026-08-26 | viva | — |
| conteudo | Economy, society and strategy in the Alentejo and the Algarve. | até 2026-08-26 | viva | — |
| conteudo | EN [a verificar] | até 2026-08-26 | viva | — |
| conteudo | EN Economic assessment of Portugal’s regions. | até 2026-08-26 | viva | — |
| conteudo | EN Economy, investors and open doors in the municipality of Évora. | até 2026-08-26 | viva | — |
| conteudo | EN Economy, society and strategy in the Alentejo and the Algarve. | até 2026-08-26 | viva | — |
| conteudo | EN Fifteen years of municipal government in Évora, across five terms. | até 2026-08-26 | viva | — |
| conteudo | EN Long series on the country’s evolution. | até 2026-08-26 | viva | — |
| conteudo | EN Non-revenue water in Portugal’s public supply systems. | até 2026-08-26 | viva | — |
| conteudo | EN Public funding in Portugal. | até 2026-08-26 | viva | — |
| conteudo | EN What was budgeted, what was paid and what was left owing in the municipality of Évora. | até 2026-08-26 | viva | — |
| conteudo | EN Who held each portfolio of the Câmara Municipal de Évora across five terms, how much the municipality’s own accounts spent in the areas those portfolios cover, and what the reports say those areas did. | até 2026-08-26 | viva | — |
| conteudo | Estudos | até 2026-08-26 | viva | — |
| conteudo | Financiamento público em Portugal. | até 2026-08-26 | viva | — |
| conteudo | Long series on the country’s evolution. | até 2026-08-26 | viva | — |
| conteudo | No subject assigned | até 2026-08-26 | viva | — |
| conteudo | Non-revenue water in Portugal’s public supply systems. | até 2026-08-26 | viva | — |
| conteudo | O arquivo de estudos publicados, com as suas edições em português e em inglês. | até 2026-08-26 | viva | — |
| conteudo | PT [a verificar] | até 2026-08-26 | viva | — |
| conteudo | PT Avaliação económica das regiões de Portugal. | até 2026-08-26 | viva | — |
| conteudo | PT Economia, investidores e portas abertas no município de Évora. | até 2026-08-26 | viva | — |
| conteudo | PT Economia, sociedade e estratégia no Alentejo e no Algarve. | até 2026-08-26 | viva | — |
| conteudo | PT Financiamento público em Portugal. | até 2026-08-26 | viva | — |
| conteudo | PT O que foi orçamentado, o que foi pago e o que ficou em dívida no município de Évora. | até 2026-08-26 | viva | — |
| conteudo | PT Quinze anos de governo municipal em Évora, ao longo de cinco mandatos. | até 2026-08-26 | viva | — |
| conteudo | PT Séries longas sobre a evolução do país. | até 2026-08-26 | viva | — |
| conteudo | PT Água não faturada nos sistemas de abastecimento em Portugal. | até 2026-08-26 | viva | — |
| conteudo | Public funding in Portugal. | até 2026-08-26 | viva | — |
| conteudo | Publication dates not yet confirmed. | até 2026-08-26 | viva | — |
| conteudo | Quem teve cada pelouro da Câmara Municipal de Évora ao longo de cinco mandatos, quanto gastaram as contas do próprio município nas áreas que esses pelouros cobrem, e o que os relatórios dizem que essas áreas fizeram. | até 2026-08-26 | viva | — |
| conteudo | Sem tema atribuído | até 2026-08-26 | viva | — |
| conteudo | Studies | até 2026-08-26 | viva | — |
| conteudo | Séries longas sobre a evolução do país. | até 2026-08-26 | viva | — |
| conteudo | The accounts of the second-to-last year were rejected in a vote and were never certified. | até 2026-08-26 | viva | — |
| conteudo | The archive of published studies, with their Portuguese and English editions. | até 2026-08-26 | viva | — |
| navegacao | The link leaves this domain. | até 2026-08-26 | viva | — |
| conteudo | Uma leitura transversal do município de Évora: o registo de projetos do plano de recuperação, o registo de contratos públicos e o catálogo do tribunal de contas do Estado. | voz-dos-documentos | viva | — |
| conteudo | Água não faturada nos sistemas de abastecimento em Portugal. | até 2026-08-26 | viva | — |
| conteudo | Young people who left school without completing secondary education and are not in training. | frases | viva | — |
| conteudo | € actually paid | até 2026-08-26 | viva | — |
| conteudo | € approved and attributed to the concelho by the recovery-plan register | grelha-2 | retirada | saiu com o G6 da grelha da voz, que tirou o método das páginas do leitor: as ressalvas da página do concelho com as secções que as guardavam, os rótulos que diziam como o texto foi feito, e a nota da lei do limite da dívida (`14a339d`, 27.08) |
| conteudo | € aprovados e atribuídos ao concelho pelo registo do plano de recuperação | até 2026-08-26 | viva | — |
| conteudo | € de valor acrescentado bruto das empresas do concelho | voz-dos-documentos | viva | — |
| conteudo | € efetivamente pagos | até 2026-08-26 | viva | — |

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

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | As linhas deste documento | até 2026-08-26 | viva | — |
| conteudo | O documento original | até 2026-08-26 | viva | — |
| conteudo | O registo de conteúdo | até 2026-08-26 | viva | — |
| conteudo | The content record | até 2026-08-26 | viva | — |
| conteudo | The original document | até 2026-08-26 | viva | — |
| conteudo | The rows of this document | até 2026-08-26 | viva | — |
| conteudo | as this document prints it | até 2026-08-26 | viva | — |
| conteudo | como este documento o imprime | até 2026-08-26 | viva | — |
| conteudo | engine row | até 2026-08-26 | viva | — |
| conteudo | linha do motor | até 2026-08-26 | viva | — |
| conteudo | o valor como a linha o guarda | até 2026-08-26 | viva | — |
| conteudo | resumo de origem | até 2026-08-26 | viva | — |
| conteudo | source digest | até 2026-08-26 | viva | — |
| conteudo | the value as the row keeps it | até 2026-08-26 | viva | — |

## A reclassificação de 21.08.2026 (direção): **limite dos dados**

| frase | era | é | razão |
| --- | --- | --- | --- |
| «Não existe contrafactual para nenhum índice. Nada do que foi lido permite separar a parte de um executivo neles.» / «There is no counterfactual for any index…» (entrada de «O que esta página não sabe», `/municipios/evora`) | autorreferência | **conteúdo** | **limite dos dados**. Não fala do cuidado da casa: diz o que as fontes lidas não permitem estabelecer. Sem ela, a banda dos mandatos ao lado de uma curva de dívida lê-se como uma atribuição, e um leitor lê mal um número. É a metade da regra que fica |

## O que saiu, e para onde

| frase retirada | classe | onde vive agora |
| --- | --- | --- | --- | --- |
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
| --- | --- | --- | --- | --- |
| conteudo | O que a lei cobra por antecipar a reforma, e o que seria atuarialmente neutro. | até 2026-08-26 | viva | — |
| conteudo | What the law charges for retiring early, and what would be actuarially neutral. | até 2026-08-26 | viva | — |
| conteudo | PT O que a lei cobra por antecipar a reforma, e o que seria atuarialmente neutro. | até 2026-08-26 | viva | — |
| conteudo | EN What the law charges for retiring early, and what would be actuarially neutral. | até 2026-08-26 | viva | — |
| conteudo | A quem cabe numa das exceções que afastam o fator de sustentabilidade, a lei corta menos do que o valor neutro. As duas medidas acima são os dois extremos da mesma decisão. | até 2026-08-26 | viva | — |
| conteudo | For those who fall within one of the exceptions that set the sustainability factor aside, the law cuts less than the neutral figure. The two measures above are the two ends of the same decision. | até 2026-08-26 | viva | — |
| conteudo | é o que a lei corta a quem não cabe numa das exceções | até 2026-08-26 | viva | — |
| conteudo | is what the law cuts from those who fall outside the exceptions | até 2026-08-26 | viva | — |
| conteudo | de redução da pensão seria atuarialmente neutro, por um ano de antecipação | até 2026-08-26 | viva | — |
| conteudo | pension reduction would be actuarially neutral, for one year of anticipation | até 2026-08-26 | viva | — |

**As frases inglesas da página de um concelho e das leituras que o item B6
mudou**, e que a régua lê como blocos novos porque o texto mudou:

| classe | frase | bloco |
| --- | --- | --- | --- | --- |
| conteudo | € approved and attributed to the municipality by the recovery-plan register | até 2026-08-26 | viva | — |
| conteudo | € of gross value added by enterprises in the municipality | voz-dos-documentos | viva | — |
| conteudo | The works about this municipality | até 2026-08-26 | viva | — |
| conteudo | The thin line is the total debt the regulator publishes for the municipality; the bar is the distance to the legal limit for the same year, which is the rule on the right. The index measures one against the other on a scale whose cap is the permitted value. | grelha-2 | retirada | a Direção-Geral das Autarquias Locais deixou de ser chamada «o regulador» e passou a ter o seu nome (item E11 do bloco dos 308, `8b55bd3`; as cadeias que ele não alcançou saíram no G5 da grelha da voz, `e470212`) |

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
| --- | --- | --- | --- | --- |
| conteudo | Com página | grelha-2 | retirada | o rótulo de cobertura «Com página» saiu com a vista que o rendia (bloco dos 308, `44ef280`) |
| conteudo | With a page | grelha-2 | retirada | o rótulo de cobertura «Com página» saiu com a vista que o rendia (bloco dos 308, `44ef280`) |

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

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | Execução da receita | até 2026-08-26 | viva | — |
| conteudo | Prazo médio de pagamento | até 2026-08-26 | viva | — |
| conteudo | Revenue execution | até 2026-08-26 | viva | — |
| conteudo | Average payment time | até 2026-08-26 | viva | — |
| conteudo | As linhas do livro-razão com as medidas que as fontes centrais publicam para o concelho de <lugar>. | até 2026-08-26 | viva | — |
| conteudo | The ledger rows with the measures central sources publish for the municipality of <lugar>. | até 2026-08-26 | viva | — |
| conteudo | Sistema de contas integradas das empresas; cada empresa conta num único concelho. | até 2026-08-26 | viva | — |
| conteudo | Integrated business accounts; each enterprise counts in a single municipality. | até 2026-08-26 | viva | — |
| conteudo | Linhas sem concelho declarado | grelha-2 | retirada | o grupo «Linhas sem concelho declarado» saiu do índice dos concelhos do livro-razão (bloco dos 308, `44ef280`) |
| conteudo | Rows with no municipality declared | grelha-2 | retirada | o grupo «Linhas sem concelho declarado» saiu do índice dos concelhos do livro-razão (bloco dos 308, `44ef280`) |
| conteudo | O que as fontes publicam sobre o município de <lugar>: população, poder de compra, emprego, empresas, dívida e execução orçamental. | até 2026-08-26 | viva | — |
| conteudo | What the sources publish about the municipality of <lugar>: population, purchasing power, employment, enterprises, debt and budget execution. | até 2026-08-26 | viva | — |
| conteudo | Concelhos: as medidas centrais | até 2026-08-26 | viva | — |
| conteudo | Municipalities: the central measures | até 2026-08-26 | viva | — |

## Bloco dos 308 concelhos · P2 (os dados), 26.08.2026

**UMA FRASE CORRIGIDA SAI DESTA LISTA.** O ficheiro guardava as duas leituras de uma contagem lado a lado, porque uma contagem volta a ser o que era no dia em que o livro-razão encolher. Uma frase que foi CORRIGIDA é outra coisa: se continuar declarada, repô-la passa em silêncio, e foi isso que se mediu ao plantar de volta a nota da sede e a que chamava «regulador» à DGAL — nenhuma das duas fechou nada. As entradas das frases que os itens E7 e E11 corrigiram saíram desta lista; repor uma delas passa a ser um bloco por classificar, e a régua fecha.

*As frases que os itens E7 a E12 mudaram: a nota das empresas, que deixou de afirmar o que a verificação das fontes não confirmou; a legenda da dívida, sem a oração em que o sítio falava de si; e as que chamavam «regulador» à Direção-Geral das Autarquias Locais. As duas últimas linhas da tabela são a frase que SAIU, declarada pelo que ela era: autorreferência. Fica declarada para que a régua a apanhe pelo nome se alguém a repuser, em vez de a apanhar como bloco por classificar.*

**O ESPAÇO ANTES DOS DOIS PONTOS NA FRASE DA LEI É A RÉGUA A LER, E NÃO A PÁGINA A ESCREVER** (bloco `pequenas-5`, 29.08.2026). A página publica «…artigo 52.º da Lei n.º 73/2013: uma vez e meia…», carácter a carácter, como publicava. O que mudou foi por dentro: o nome do diploma passou a viver num `<span lang="pt-PT">` para que um leitor de ecrã inglês não leia «Lei n.º 73/2013» com fonética inglesa (I91). A régua junta os pedaços de texto de um bloco com um espaço entre eles (`texto()` em `scripts/medir-defeitos.mjs`), e por isso lê um espaço onde o `<span>` fecha. A coluna do texto é, e sempre foi, **a cadeia normalizada tal como a régua a lê** — é a mesma razão do « ." » da manchete dos painéis europeus, que está nesta lista desde o primeiro dia.

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | A Direção-Geral | até 2026-08-26 | viva | — |
| conteudo | A Direção-Geral publica | até 2026-08-26 | viva | — |
| conteudo | A série anual da Direção-Geral das Autarquias Locais ainda não chegou a este mandato. | até 2026-08-26 | viva | — |
| conteudo | Lista anual da Direção-Geral das Autarquias Locais, que publica os dados das contas dos municípios. | até 2026-08-26 | viva | — |
| conteudo | O limite é fixado no artigo 52.º da Lei n.º 73/2013 : uma vez e meia a média da receita corrente líquida dos três anos anteriores. | pequenas-5 | viva | — |
| conteudo | O traço fino é a dívida total que a Direção-Geral das Autarquias Locais publica para o concelho; a barra é a distância até ao limite legal do mesmo ano, que é o fio da direita. O índice mede uma contra o outro numa escala em que o teto é o valor permitido. | até 2026-08-26 | viva | — |
| conteudo | Série anual da Direção-Geral das Autarquias Locais, que publica os dados das contas dos municípios. Exclui dívidas não orçamentais e exceções legais. | até 2026-08-26 | viva | — |
| conteudo | The annual list of the local-government directorate, which publishes the municipalities’ accounts data. | até 2026-08-26 | viva | — |
| conteudo | The annual series of the local-government directorate, which publishes the municipalities’ accounts data. Excludes non-budgetary debt and legal exceptions. | até 2026-08-26 | viva | — |
| conteudo | The directorate-general | até 2026-08-26 | viva | — |
| conteudo | The directorate-general publishes | até 2026-08-26 | viva | — |
| conteudo | The limit is set by article 52.º of Lei n.º 73/2013 : one and a half times the three-year average of net current revenue. | pequenas-5 | viva | — |
| conteudo | The local-government directorate’s annual series has not yet reached this term. | até 2026-08-26 | viva | — |
| conteudo | The thin line is the total debt the local-government directorate publishes for the municipality; the bar is the distance to the legal limit for the same year, which is the rule on the right. The index measures one against the other on a scale whose cap is the permitted value. | até 2026-08-26 | viva | — |
| conteudo | Sem linhas ainda. | grelha-2 | retirada | a ausência passou a dizer-se em três palavras, «Sem linha ainda.», e a forma longa saiu (item E4 do bloco dos 308, `8b2a260`) |
| conteudo | No rows yet. | grelha-2 | retirada | a ausência passou a dizer-se em três palavras, «Sem linha ainda.», e a forma longa saiu (item E4 do bloco dos 308, `8b2a260`) |
| conteudo | A referência do estudo | até 2026-08-26 | viva | — |
| conteudo | The study’s reference | até 2026-08-26 | viva | — |
| conteudo | 2916 afirmações · 330 de 2916 calculadas · 2767 de 2916 linhas de concelhos | nomes | viva | — |
| conteudo | 2916 claims · 330 of 2916 calculated · 2767 of 2916 municipality rows | nomes | viva | — |
| navegacao | Nenhuma linha do livro-razão tem essas palavras. | nomes | viva | — |
| navegacao | No row in the ledger matches those words. | nomes | viva | — |
| navegacao | Procurar por nome, identificador ou fonte | nomes | viva | — |
| navegacao | Search by name, identifier or source | nomes | viva | — |
| navegacao | Linhas que casam | nomes | viva | — |
| navegacao | Rows that match | nomes | viva | — |
| navegacao | Há mais linhas do que as que cabem aqui. Escreva mais para estreitar. | nomes | viva | — |
| navegacao | There are more rows than fit here. Type more to narrow it down. | nomes | viva | — |
| conteudo | estudo ou medida | nomes | viva | — |
| conteudo | estudos e medidas | nomes | viva | — |
| conteudo | study or measure | nomes | viva | — |
| conteudo | studies and measures | nomes | viva | — |
| conteudo | publicado a | nomes | viva | — |
| conteudo | published on | nomes | viva | — |
| autorreferencia | O limite é fixado no artigo 52.º da Lei n.º 73/2013: uma vez e meia a média da receita corrente líquida dos três anos anteriores. É a lei que o define, não este sítio. | grelha-2 | retirada | saiu com o G6 da grelha da voz, que tirou o método das páginas do leitor: as ressalvas da página do concelho com as secções que as guardavam, os rótulos que diziam como o texto foi feito, e a nota da lei do limite da dívida (`14a339d`, 27.08) |
| autorreferencia | The limit is set by article 52.º of Lei n.º 73/2013: one and a half times the three-year average of net current revenue. The law defines it, not this site. | grelha-2 | retirada | saiu com o G6 da grelha da voz, que tirou o método das páginas do leitor: as ressalvas da página do concelho com as secções que as guardavam, os rótulos que diziam como o texto foi feito, e a nota da lei do limite da dívida (`14a339d`, 27.08) |

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

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | A Direção-Geral das Autarquias Locais e o município publicam a dívida do mesmo ano com uma diferença. A diferença é pequena. | grelha-da-voz | viva | — |
| conteudo | A série anual da Direção-Geral das Autarquias Locais começa depois deste mandato. | grelha-da-voz | viva | — |
| conteudo | How far the debt exceeded the legal limit, in the first and the last year in which the report publishes it as a positive figure. After that the table turns negative, and a negative there is no longer excess but borrowing capacity. | grelha-da-voz | viva | — |
| conteudo | O que a dívida excedia o limite legal, no primeiro e no último ano em que o relatório o publica como um valor positivo. Depois disso o quadro passa a números negativos, que já não são excesso mas capacidade de endividamento. | grelha-da-voz | viva | — |

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
| conteudo | The local-government directorate and the municipality publish the same year’s debt with a difference between them. The difference is small. | grelha-da-voz | viva | — |
| conteudo | The local-government directorate’s annual series begins after this term. | grelha-da-voz | viva | — |

### A DGAL pelo nome, e a leitura da casa fora do rótulo

*O item E11 do bloco dos 308 tirou «o regulador» das notas das medidas e da
legenda da dívida, e não chegou a `src/data/leituras.mjs` nem ao rótulo do
relance da linha do tempo: a busca dele foi pelas notas das oito peças e pelas
cadeias de `strings.mjs` da página do concelho. Saem agora as três que ficaram. E
sai «legível», que é o sítio a descrever os limites da sua própria leitura: o
rótulo passa a nomear de que série são os dois números.*

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | % de índice de dívida no primeiro ano da série da Direção-Geral das Autarquias Locais | grelha-da-voz | viva | — |
| conteudo | % debt index in the first year of the local-government directorate’s series | grelha-da-voz | viva | — |
| conteudo | Antes do primeiro ano da série da Direção-Geral das Autarquias Locais. | grelha-da-voz | viva | — |
| conteudo | Before the first year of the local-government directorate’s series. | grelha-da-voz | viva | — |

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

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | As contas das empresas do concelho creditam toda a atividade de uma empresa a um único concelho, e não são um produto interno bruto municipal. A média nacional é a base do índice de poder de compra. | grelha-da-voz | viva | — |
| conteudo | The accounts of the municipality’s enterprises credit a firm’s whole activity to a single municipality, and are not a municipal gross domestic product. The national average is the base of the purchasing-power index. | grelha-da-voz | viva | — |
| conteudo | Cada contagem é a lista de pelouros que a página da câmara atribui a essa pessoa. | grelha-da-voz | viva | — |
| conteudo | Each count is the list of portfolios the council’s page attributes to that person. | grelha-da-voz | viva | — |
| conteudo | Estes dois valores são somas sobre o registo público inteiro do plano de recuperação, e não uma linha de um documento. Vencido é o valor aprovado em localizações cuja data prevista de conclusão já passou sem conclusão registada. | grelha-da-voz | viva | — |
| conteudo | These two values are sums over the whole public register of the recovery plan, and not a line in a document. Overdue is the value approved at locations whose planned completion date has passed with no completion recorded. | grelha-da-voz | viva | — |
| conteudo | O sistema contabilístico mudou por baixo da série, um ano de contas foi publicado em digitalizações e outro não foi publicado de todo. | grelha-da-voz | viva | — |
| conteudo | The accounting system changed underneath the series, one year of accounts was published as scans and another was not published at all. | grelha-da-voz | viva | — |

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

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | As contagens de pelouros são designações, não despesa. | grelha-da-voz | viva | — |
| conteudo | The portfolio counts are designations, not spending. | grelha-da-voz | viva | — |
| conteudo | Não existe contrafactual para nenhum índice, e a parte de um executivo neles não é separável. | grelha-da-voz | viva | — |
| conteudo | There is no counterfactual for any index, and an executive’s share of them is not separable. | grelha-da-voz | viva | — |

### E a ressalva diz o facto, não quem o leu

*Os marcadores deste bloco ganharam dez entradas, tiradas dos parágrafos que o
G6 retirou: «o trabalho», «este livro-razão», «atravessou», «mostra-o» e
«avaliável», com as suas gémeas inglesas. O único sítio da superfície pública em
que um deles ainda mordia era a nota do mandato sem repartição de pelouros, cujo
sujeito era o trabalho e cuja frase era a citação dele sobre os seus próprios
limites. Passa a dizer o facto.*

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | Não estabelecido: o presidente desse mandato, e todos os outros membros dele, não foram identificados. | grelha-da-voz | viva | — |
| conteudo | Not established: the president of that mandate, and every other member of it, were not identified. | grelha-da-voz | viva | — |

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

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | A pergunta está registada em inglês, palavra por palavra; o português é a edição portuguesa dessa mesma pergunta. | grelha-da-voz | viva | — |
| conteudo | The question is registered in English, word for word; the Portuguese is the Portuguese edition of that same question. | grelha-da-voz | viva | — |
| conteudo | O que está a ser medido, o que se segue, e o critério que pôs lá cada coisa. Com o calendário do que as fontes publicam a seguir. | grelha-da-voz | viva | — |
| conteudo | What is being measured, what comes next, and the criterion that put each thing there. With the calendar of what the sources publish next. | grelha-da-voz | viva | — |
| conteudo | O que as fontes citadas publicam a seguir. | grelha-da-voz | viva | — |
| conteudo | What the cited sources publish next. | grelha-da-voz | viva | — |
| conteudo | Cada estudo publicado, com as suas edições e datas. Os que estão alojados noutro sítio levam a ligação para lá. | grelha-da-voz | viva | — |
| conteudo | Every published study, with its editions and dates. Those hosted elsewhere carry the link to it. | grelha-da-voz | viva | — |
| conteudo | Documento alojado | grelha-da-voz | viva | — |
| conteudo | Document hosted | grelha-da-voz | viva | — |
| conteudo | Sem ficheiros. | grelha-da-voz | viva | — |
| conteudo | No files. | grelha-da-voz | viva | — |

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

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | Livro-razão · O Estado do País | voz-do-livro-razao | viva | — |
| conteudo | Ledger · O Estado do País | voz-do-livro-razao | viva | — |
| conteudo | 2767 linhas · 308 concelhos | vazios | viva | — |
| conteudo | 2767 rows · 308 municipalities | vazios | viva | — |

## Bloco «A voz do livro-razão» · a leitura de fora, L1 a L5 · 27.08.2026

*A leitura de fora do bloco leu as páginas construídas e não só o diff, e trouxe
cinco itens. Os que mudam cadeias desta tabela são dois. **L1:** os rótulos e as
dicas de `title` das duas páginas do livro-razão diziam a maquinaria em vez da
coisa, e um `title` é texto do leitor como outro qualquer; o bloco do conjunto de
dados dizia «Todas as linhas, com todos os campos publicados.», que é uma
afirmação de cobertura sobre o próprio ficheiro, e passa a nomear o que se
descarrega. **L2:** a descrição do `<head>` do índice dos concelhos, que sai
também no Open Graph, explicava a cobertura da página e passa a nomeá-la, como a
do índice do livro-razão.*

*As entradas antigas das quatro cadeias saíram, pela regra do bloco dos 308: uma
frase corrigida que continue declarada volta em silêncio.*

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | Todas as linhas. | voz-do-livro-razao | viva | — |
| conteudo | Every row. | voz-do-livro-razao | viva | — |
| conteudo | Livro-razão dos concelhos · O Estado do País | voz-do-livro-razao | viva | — |
| conteudo | Municipalities ledger · O Estado do País | voz-do-livro-razao | viva | — |

## Bloco «O mapa por distritos» · Emenda 20 · 27.08.2026

*As páginas novas do bloco: o índice das 29 unidades da Carta (`/distritos`,
`/en/districts`) e a página de cada uma (`/distritos/<slug>`,
`/en/districts/<slug>`). As duas rotas entram em `ROTAS_DO_INVENTARIO` no mesmo
commit em que são construídas, que é a regra desta tabela.*

*Dezasseis cadeias, oito por edição, e nenhuma é autorreferência: o título, a
lede e a descrição do `<head>` nomeiam o que a página tem; «distrito» e «ilha da
Região Autónoma» são as duas naturezas que a Carta e a Constituição dão às 29
unidades, escolhidas pelo campo `tipo` do artefacto e nunca por uma leitura do
nome; «Os concelhos» é o título da lista. A contagem das 29 leva o número de
hoje, como as outras linhas com contagem deste ficheiro.*

*O nome de cada unidade e o de cada concelho NÃO entram aqui: vão declarados
como lugar (`data-lugar`) ou dentro da sua ligação, e por isso a tabela não ganha
337 entradas com a lista da Carta escrita outra vez. A contagem de concelhos de
cada unidade não se rende (a razão está em `src/views/DistritoView.astro`), e por
isso também não tem cadeia.*

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | Os distritos e as ilhas de Portugal | mapa-distritos | viva | — |
| conteudo | The districts and islands of Portugal | mapa-distritos | viva | — |
| conteudo | Os distritos e as ilhas de Portugal, pela Carta Administrativa Oficial. | mapa-distritos | viva | — |
| conteudo | The districts and islands of Portugal, from the official administrative map. | mapa-distritos | viva | — |
| conteudo | As unidades da Carta Administrativa Oficial de Portugal, e os concelhos de cada uma. | mapa-distritos | viva | — |
| conteudo | The units of the Carta Administrativa Oficial de Portugal, and the municipalities of each. | mapa-distritos | viva | — |
| conteudo | 29 distritos e ilhas | mapa-distritos | viva | — |
| conteudo | 29 districts and islands | mapa-distritos | viva | — |
| conteudo | Os concelhos de <lugar>, pela Carta Administrativa Oficial de Portugal. | mapa-distritos | viva | — |
| conteudo | The municipalities of <lugar>, from the Carta Administrativa Oficial de Portugal. | mapa-distritos | viva | — |
| conteudo | Os concelhos | mapa-distritos | viva | — |
| conteudo | The municipalities | mapa-distritos | viva | — |
| conteudo | distrito | mapa-distritos | viva | — |
| conteudo | district | mapa-distritos | viva | — |
| conteudo | ilha da Região Autónoma | mapa-distritos | viva | — |
| conteudo | island of the Autonomous Region | mapa-distritos | viva | — |

*Nota da Emenda 20e (27.08.2026), para que a ausência fique explicada: a menção
da fonte da Carta que passou a viver ao pé dos dois mapas («Direção-Geral do
Território · Carta Administrativa Oficial de Portugal (CAOP) 2025 · CC BY 4.0») e
o rótulo do bloco que a leva na página de uma unidade («De onde vem o desenho» /
«Where the drawing comes from») **não entram nesta tabela**. A menção leva
`data-nonledger="fonte-da-carta"`, que é uma origem declarada, e o rótulo é irmão
dela dentro do mesmo bloco: a régua deixa de fora todo o bloco que contenha uma
origem declarada, e por isso não os recolhe. É a mesma disciplina, e o mesmo
resultado, do «De onde vem a lista» de `/municipios`, que também não está aqui.*

## Bloco «A grelha, segunda passagem» · as dicas e os rótulos de acessibilidade · 27.08.2026

*ISSUES I79. A régua lia os blocos de texto e a descrição do `<head>`, e não lia
os atributos: um `title` é o que o navegador mostra quando o cursor pára em cima
de um número, e um `aria-label` é o nome por que um leitor de ecrã chama um
instrumento. As duas coisas são superfície pública escritas pela casa, e a Emenda
15 não conhece a diferença entre uma frase no corpo e uma frase num atributo. A
dica «itens da agenda atravessados do motor» foi corrigida à mão a 27.08 e nada
impedia que voltasse; a partir daqui volta a vermelho, pelo nome e pelo marcador
«atravess».*

*Cinquenta cadeias distintas nas treze rotas inventariadas, e duas normalizações
que as impedem de crescer com os dados: uma dica que repete um `data-*` do
próprio elemento não entra (é o caso do selo, cujo `title` é o
`data-selo-etiqueta` com o estado da linha e o nome do trabalho que a publica, e
seriam trinta linhas a crescer com o arquivo), e o identificador que o próprio
elemento aponta sai da dica e deixa a marca `<linha>` (é o caso das portas das
figuras de uma página de leitura, e seriam uma por figura de cada documento).*

*As vinte e quatro primeiras são **navegação**: o nome dos comandos do cabeçalho
e do rodapé, a descrição acessível de um instrumento e o nome da porta que salta
para a linha de uma figura, que é o que a lista já chama navegação desde a etapa
2l. As vinte e seis seguintes são **conteúdo**: são as dicas dos valores da
prova, e cada uma nomeia o que se conta — que é o que a Emenda 15 deixa numa
página do leitor.*

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| navegacao | As páginas | grelha-2 | viva | — |
| navegacao | Debt index, from the first to the last year of the local-government directorate’s series | grelha-2 | viva | — |
| navegacao | Footer navigation | grelha-2 | viva | — |
| navegacao | Idioma | grelha-2 | viva | — |
| navegacao | Language | grelha-2 | viva | — |
| navegacao | Main navigation | grelha-2 | viva | — |
| navegacao | Mandatos, no tempo | grelha-2 | viva | — |
| navegacao | Map of the districts and islands of Portugal, one area per unit. | grelha-2 | viva | — |
| navegacao | Map of the municipalities, one area per municipality. | grelha-2 | viva | — |
| navegacao | Mapa de pontos dos municípios de Portugal. | grelha-2 | viva | — |
| navegacao | Mapa dos concelhos, com uma área por concelho. | grelha-2 | viva | — |
| navegacao | Mapa dos distritos e das ilhas de Portugal, com uma área por unidade. | grelha-2 | viva | — |
| navegacao | Menu · Main navigation | grelha-2 | viva | — |
| navegacao | Menu · Navegação principal | grelha-2 | viva | — |
| navegacao | Navegação do rodapé | grelha-2 | viva | — |
| navegacao | Navegação principal | grelha-2 | viva | — |
| navegacao | Point map of the municipalities of Portugal. | grelha-2 | viva | — |
| navegacao | Tema | grelha-2 | viva | — |
| navegacao | Terms, in time | grelha-2 | viva | — |
| navegacao | The pages | grelha-2 | viva | — |
| navegacao | Theme | grelha-2 | viva | — |
| navegacao | engine row: <linha> | pequenas-3 | retirada | o rótulo de acessibilidade da porta de uma figura nomeava a chave interna da linha do motor e não o que a porta abre (I83, 28.08.2026); a chave ficou só no `href`, o rótulo passou a «a linha desta figura» e «this figure’s row», e a normalização que punha `<linha>` no lugar do identificador saiu da régua com ela |
| navegacao | linha do motor: <linha> | pequenas-3 | retirada | o rótulo de acessibilidade da porta de uma figura nomeava a chave interna da linha do motor e não o que a porta abre (I83, 28.08.2026); a chave ficou só no `href`, o rótulo passou a «a linha desta figura» e «this figure’s row», e a normalização que punha `<linha>` no lugar do identificador saiu da régua com ela |
| navegacao | Índice de dívida, do primeiro ao último ano da série da Direção-Geral das Autarquias Locais | grelha-2 | viva | — |
| conteudo | agenda items | grelha-2 | viva | — |
| conteudo | calculated rows | grelha-2 | viva | — |
| conteudo | concelhos com pelo menos uma linha desse estudo | grelha-2 | viva | — |
| conteudo | concelhos | grelha-2 | viva | — |
| conteudo | concelhos in the coordinates file of the official administrative map | grelha-2 | viva | — |
| conteudo | concelhos no ficheiro de coordenadas da Carta Administrativa | grelha-2 | viva | — |
| conteudo | editions in the archive | grelha-2 | viva | — |
| conteudo | edições no arquivo | grelha-2 | viva | — |
| conteudo | entradas de natureza revisão de proveniência no livro-razão | grelha-2 | viva | — |
| conteudo | entries of kind provenance revision in the ledger | grelha-2 | viva | — |
| conteudo | itens da agenda | grelha-2 | viva | — |
| conteudo | ledger rows | grelha-2 | viva | — |
| conteudo | ledger rows of the municipalities study | grelha-2 | viva | — |
| conteudo | linhas calculadas | grelha-2 | viva | — |
| conteudo | linhas do livro-razão | grelha-2 | viva | — |
| conteudo | linhas do livro-razão do estudo dos concelhos | grelha-2 | viva | — |
| conteudo | medidas do painel cujo valor está dentro do limiar publicado | grelha-2 | viva | — |
| conteudo | medidas do painel cujo valor está fora do limiar publicado | grelha-2 | viva | — |
| conteudo | municipalities with at least one row of that study | grelha-2 | viva | — |
| conteudo | panel measures whose value is inside the published threshold | grelha-2 | viva | — |
| conteudo | panel measures whose value is outside the published threshold | grelha-2 | viva | — |
| conteudo | trabalhos no arquivo | grelha-2 | viva | — |
| conteudo | unidades da Carta Administrativa: os distritos e as ilhas | grelha-2 | viva | — |
| conteudo | units of the official administrative map: the districts and the islands | grelha-2 | viva | — |
| conteudo | works in the archive | grelha-2 | viva | — |

## Bloco «As regiões» · Emenda 21 · 27.08.2026

*As páginas novas do bloco: o índice das regiões (`/regioes`, `/en/regions`) e a
página de cada região com linhas (`/regioes/<slug>`, `/en/regions/<slug>`). São
páginas do leitor, e a Emenda 15 governa-as: a autorreferência delas é zero, e o
que fica é o que a coisa é.*

*Quatro linhas VOLTAM À VIDA e não são novas: «A régua da convergência», «The
convergence rule» e as duas frases do que o índice compara estavam declaradas
`retirada` desde a segunda passagem da grelha, porque a régua tinha saído da
primeira página a 25.08 «até haver a página das regiões». A página existe, e a
razão da retirada era esta. Mudam de estado e de bloco, e o texto delas não muda
uma letra: é o que a coluna do estado serve para deixar ver.*

*Duas continuam `retirada` de propósito, e não voltam com a régua: «As regiões
publicadas na régua da convergência.» e a sua inglesa eram a meta da FILA das
regiões da primeira página, o painel que o comando «Região» abria. A fila não
volta — a Emenda 21b manda a região viver na sua página, e o comando é uma
ligação para o índice.*

*O nome de cada região é `data-lugar`, como o das 29 unidades e o dos 308
concelhos: é o nome da coisa de que a página trata, transcrito da lista, e não
prosa da casa. Por isso a descrição do `<head>` de uma região conta-se UMA vez,
com o `<lugar>` no lugar do nome, e não uma por região.*

*Segunda passagem, 28.08.2026, com as quatro regiões que o motor trouxe e com a
leitura cruzada do Codex. A contagem passa de cinco a nove e a frase deixa de
falar da cobertura: «5 regiões com linhas publicadas.» era a casa a dizer o
estado da sua própria publicação, e o que fica é «9 regiões», o número e o que
ele conta. As duas dicas das chaves da prova mudam pela mesma razão. As quatro
linhas velhas ficam `retirada`, com o motivo escrito, para que a forma não volte.*

*E duas linhas de contagem mudam de número sem mudar de forma: o índice do
livro-razão diz «2 560 afirmações · 329 calculadas», porque as oito linhas das
quatro regiões entraram no livro-razão. É o caso que a I74 descreve — «uma frase
com um número que se move volta com outro número» —, e a escolha da casa para
estas duas foi mantê-las declaradas: mudam de bloco, para que o rasto diga quem
lhes mexeu no número.*

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | As regiões de Portugal | regioes | viva | — |
| conteudo | The regions of Portugal | regioes | viva | — |
| conteudo | O índice de PIB per capita de cada região, em paridades de poder de compra, contra a média da UE-27. | regioes | viva | — |
| conteudo | Each region’s GDP per capita index, in purchasing power standards, against the EU-27 average. | regioes | viva | — |
| conteudo | As regiões NUTS II de <lugar>, e a distância de cada uma à média da UE-27. | regioes | viva | — |
| conteudo | The NUTS II regions of <lugar>, and how far each one is from the EU-27 average. | regioes | viva | — |
| conteudo | 5 regiões com linhas publicadas. | regioes | retirada | a frase falava da cobertura da casa e não do que conta («com linhas publicadas», «no livro-razão»), e a Emenda 15 manda a autorreferência a zero numa página do leitor; fica o número e o que ele conta (leitura cruzada do Codex, 28.08.2026) |
| conteudo | 5 regions with published rows. | regioes | retirada | a frase falava da cobertura da casa e não do que conta («com linhas publicadas», «no livro-razão»), e a Emenda 15 manda a autorreferência a zero numa página do leitor; fica o número e o que ele conta (leitura cruzada do Codex, 28.08.2026) |
| conteudo | O índice de PIB per capita de <lugar>, em paridades de poder de compra, contra a média da UE-27. | regioes | viva | — |
| conteudo | The GDP per capita index of <lugar>, in purchasing power standards, against the EU-27 average. | regioes | viva | — |
| conteudo | região NUTS II | regioes | viva | — |
| conteudo | NUTS II region | regioes | viva | — |
| conteudo | As medidas | regioes | viva | — |
| conteudo | The measures | regioes | viva | — |
| conteudo | regiões com linhas publicadas no livro-razão | regioes | retirada | a frase falava da cobertura da casa e não do que conta («com linhas publicadas», «no livro-razão»), e a Emenda 15 manda a autorreferência a zero numa página do leitor; fica o número e o que ele conta (leitura cruzada do Codex, 28.08.2026) |
| conteudo | regions with rows published in the ledger | regioes | retirada | a frase falava da cobertura da casa e não do que conta («com linhas publicadas», «no livro-razão»), e a Emenda 15 manda a autorreferência a zero numa página do leitor; fica o número e o que ele conta (leitura cruzada do Codex, 28.08.2026) |
| conteudo | 9 regiões | regioes | viva | — |
| conteudo | 9 regions | regioes | viva | — |
| conteudo | regiões desenhadas na régua da convergência | regioes | viva | — |
| conteudo | regions drawn on the convergence rule | regioes | viva | — |

## Bloco «Correções pequenas, terceira passagem» · I83 · 28.08.2026

*Uma frase por edição, e é a mesma porta com outro nome. A porta que vai a
seguir a uma ligação do documento numa página de leitura não tem texto: o que
ela diz, di-lo em `aria-label`, e o que dizia era «linha do motor:
tc-year-1-2008». Quem ouve a página ouvia o identificador de um artefacto do
motor. O rótulo passa a nomear o que a porta abre, a chave fica só no `href`, e a
classe é navegação porque é o que a porta é: uma saída para outro sítio da mesma
página.*

*As duas linhas antigas ficam `retirada` com o motivo escrito, e não saem do
ficheiro: eram 34 cadeias distintas nas duas edições, arrumadas em duas linhas
por uma normalização da régua que punha `<linha>` no lugar do identificador. A
normalização sai com elas, porque já não há identificador nenhum na dica; se uma
dica composta com uma chave voltar, volta como bloco POR CLASSIFICAR, que é o
portão que a apanha.*

*A frase de Évora da I88 não entra nesta tabela, e a razão é mecânica: o bloco
que a leva tem um `data-claim` lá dentro, e a régua deixa cair um bloco com
origem declarada. Nenhuma cadeia do inventário muda com ela.*

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| navegacao | a linha desta figura | pequenas-3 | viva | — |
| navegacao | this figure’s row | pequenas-3 | viva | — |

## Bloco «app» · o sítio no ecrã principal · 28.08.2026

*O sítio passou a poder ser posto no ecrã principal de um telemóvel, e isso
abriu uma superfície pública que não existia: o NOME e o NOME CURTO da
aplicação, que o leitor lê por baixo do ícone e na lista de aplicações
instaladas, sem estar no sítio. O `BRIEF-app.md` §5 manda classificá-los, e é o
que esta secção faz.*

*A régua alcança-os desde este bloco, e é a mesma extensão que a descrição do
`<head>` levou a 21.08.2026, pela mesma razão: são superfície pública, são
escritas pela casa, e ficavam de fora só porque a varredura era sobre o
`<body>`. A medida 8 lê agora, em cada rota inventariada, a etiqueta
`apple-mobile-web-app-title` daquela página e o `name` e o `short_name` do
manifesto que aquela página liga. Sem essa extensão, o BRIEF pedia frases
«classificadas» e o inventário ficava com linhas que nenhuma régua alcança, ou
seja declarações que ninguém confere, que é a coisa que a I74 fechou.*

**Uma linha só, e não duas.** O `name` da aplicação é «O Estado do País», que já
está declarado neste ficheiro (o nome da publicação, `navegacao`, bloco `até
2026-08-26`), porque é a mesma cadeia que o cabeçalho compõe. Declará-la outra
vez neste bloco não acrescentava nada e mudava a classe da que já existe, porque
o mapa do inventário é `texto → classe` e a última linha ganharia: o nome da
publicação passaria a `conteudo` sem ninguém decidir isso. O que é novo é o nome
curto.

**E uma tensão que fica dita, para quem ler o diff.** O BRIEF §5 escreve «classe
conteúdo» para os dois, e é o que esta tabela faz. A régua das três classes deste
ficheiro diz outra coisa sobre a mesma cadeia: «navegação — … o nome da
publicação», e foi por essa régua que a Emenda 18 classificou a frase de
identidade como navegação, «como o nome da publicação». «O Estado» é o nome da
publicação encurtado para caber numa cela de 60 pt. **Segue-se o BRIEF, que é a
instrução escrita da direção, e regista-se a divergência aqui em vez de a
resolver sozinho**: nenhuma das duas classes muda a contagem que a construção
fecha (a autorreferência continua a zero em todas as rotas), e a escolha entre
elas é da direção.

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| navegacao | O Estado | app | viva | navegação como o nome da publicação (regra do inventário); o brief dizia conteúdo e o lugar de direção corrigiu no fecho |
## Bloco «As áreas de governo» · decisão 6 da auditoria de 25.08.2026 · 28.08.2026

*As páginas novas do bloco: o índice das áreas de governo (`/areas`, `/en/areas`)
e a página de cada área com peças (`/areas/<slug>`, `/en/areas/<slug>`). São
páginas do leitor, e a Emenda 15 governa-as: a autorreferência delas é zero, e o
que fica é o que a coisa é.*

*A REGRA MUDOU A 28.08.2026, E COM ELA DUAS FRASES E A LISTA DAS ÁREAS. A área de
uma peça era a do organismo que publica o número dela; passou a ser a do
ministério cujas matérias, tal como a lei orgânica as lista, cobrem o assunto
dela. As duas descrições do `<head>` que diziam «publicados pelos organismos de»
saíram, e as que entraram dizem «cujo assunto é matéria de». A Presidência saiu
da lista de áreas com as suas quatro linhas: a população e as empresas de um
concelho eram dela por o INE ser tutelado por aquele ministro, e pela regra do
assunto ficam fora, porque «estatística» não é matéria de ministério nenhum
neste diploma. Entraram seis áreas: Finanças, Infraestruturas e Habitação,
Justiça, Educação, Ciência e Inovação, Saúde e Ambiente e Energia.*

*SEGUNDA LEITURA, 28.08.2026: O QUE ESTE BLOCO PASSOU A DECLARAR. A leitura
cruzada do Codex e o lugar de direção mandaram sete alterações, e três mexem na
voz. **Saíram vinte e quatro linhas para `retirada`**: as duas descrições do
índice, as dezoito descrições das páginas de área (todas diziam o método do sítio
na superfície pública), o título antigo do índice nas duas edições e a lede que
definia o que uma área é. **Entraram vinte e cinco**: o título novo nas duas
edições, os vinte e um rótulos de matéria e o rótulo da cabeça nas duas edições,
que estava rendido em vinte sítios e declarado em nenhum. A descrição do `<head>` de uma página
de área passou a ser o NOME da área, que já estava declarado, e a do índice o seu
título: por isso as vinte novas descrições não trazem linha nenhuma.*

*OS RÓTULOS DE MATÉRIA SÃO UMA LINHA CADA E NÃO DUAS, e a razão é o que eles são:
as palavras da lei orgânica, citadas. Uma citação de uma lei portuguesa não se
traduz, e por isso o rótulo é o mesmo carácter a carácter nas duas edições, com
`lang="pt-PT"` em ambas. Vinte e um rótulos, vinte e uma linhas. O portão das
áreas confere que o rótulo rendido é a matéria declarada, palavra por palavra, e
que leva a marca da língua: uma paráfrase da casa por cima de uma citação da lei
fecha a construção.*

*A LINHA DO ÍNDICE («Finanças · 1 peça») CONTINUA A NÃO ENTRAR NESTA TABELA, e
não é um esquecimento: a régua do inventário deixa cair um bloco cujo texto está
todo dentro de um `<a>`, e a linha inteira de cada área é uma ligação. Declará-la
aqui punha na tabela uma linha `viva` que não se rende em rota nenhuma, e a
construção fecha nesse caso. **Para a declarar era preciso partir a linha em duas**
(o nome dentro da ligação e a contagem fora dela), e isso traz de volta os dois
defeitos que a forma atual evita: o alvo de 44 px passava a ser só o nome, e a
tabela ganhava uma frase com um número por dentro, que é a I74. O nome de cada
área está declarado, e a contagem tem a sua chave da prova, com quem a reconte.*

*O RÓTULO DA CABEÇA («Áreas de governo», «Government areas») ENTROU A 28.08.2026,
e a medição cega é que o encontrou: estava rendido no índice e nas nove páginas
de área, nas duas edições, e declarado em lado nenhum. **A causa não é deste
bloco, e está medida**: a régua da voz mede elementos de bloco que não contêm
outro bloco, e o rótulo era um `<span>` dentro de uma cabeça que também tem o
`<h1>`, ou seja, nem uma coisa nem outra. A prova de que é isto e não uma
suposição está no próprio inventário: «Relance» e «At a glance» são o mesmo
rótulo, com a mesma classe, escritos num `<h2>`, e estão declarados desde sempre
como `navegacao`. Nestas páginas o `<span>` passou a `<p>`, que é um bloco, e a
classe já era `display: block` com `margin: 0`: não muda um pixel. **Dezasseis
outras vistas do sítio têm o mesmo rótulo em `<span>` e continuam por declarar**,
e isso é um bloco do inventário e não deste.*

*A PALAVRA «provisório» NÃO ENTRA, e a razão é o que ela é: a bandeira
`source_flag: "p"` de uma linha do livro-razão dita por palavras, que é a FONTE a
dizer que o número dela é provisório (o Eurostat marca assim os valores regionais
do primeiro ano de referência). Não é uma frase da casa: a régua deixa cair o
bloco inteiro que a contém, porque ele contém uma origem declarada, que é a mesma
razão por que o valor não entra. O que a guarda é uma célula da régua do
navegador deste bloco, a M8, com o seu estrago plantado.*

*O NOME DE CADA ÁREA ENTROU AQUI a 28.08.2026, uma linha por edição, e **as
dezoito linhas saíram a 29.08.2026 com a marca `data-nome`**. A razão está escrita
no bloco «Correções pequenas, quarta passagem» mais abaixo: a marca irmã de
`data-lugar` que esta nota descrevia foi feita, o nome de uma área passou a
declarar de que ficheiro de dados vem, e a régua confere que o texto rendido é o
daquele ficheiro. Com as dezasseis áreas do Governo estas seriam sessenta e
quatro linhas, que é a lista dos ministérios escrita outra vez dentro do
inventário.*

*OS DEZOITO NOMES SÃO OS QUE O GOVERNO PUBLICA, e nenhum é tradução da casa. O
brief manda dizer quando um nome inglês é nosso, e não há nenhum: os nove
portugueses estão na lista da composição do Governo e nos títulos dos artigos da
lei orgânica, e os nove ingleses foram lidos no navegador a 28.08.2026, três na
página da composição e seis na página das áreas de governo
(`/en/gc25/ministries`), esta pelo lugar de direção. `src/data/areas.mjs` diz, no
campo `nomeEnFonte` de cada área, de onde veio o nome inglês dela.*

*OS CAMPOS DAS MEDIDAS NÃO TRAZEM LINHAS NOVAS, e é a razão mais forte para
reutilizar a forma da origem. Desde 28.08.2026 cada medida de uma página de área
rende-se na linha-espécime do livro-razão, com a unidade, a data de referência, a
fonte, o documento e a data de leitura. Nenhum desses campos é prosa da casa: são
campos do livro-razão, marcados `data-linha-*`, e a régua deixa cair um bloco
inteiro que contenha uma origem declarada. Os rótulos («Fonte», «Documento»,
«Lido a», «Dados de») são os mesmos que o índice dos 308 já rendia.*

*A DICA DA CHAVE DA PROVA É A MESMA PARA AS NOVE ÁREAS, pela mesma razão: uma
frase composta com o nome de cada área punha aqui nove linhas por edição que não
diziam mais do que uma. O nome da área está na própria linha do índice, ao lado
do número.*

*«As medidas» e «The measures» não entram: já estavam declaradas pelo bloco das
regiões, e a mesma cadeia entra uma vez só.*

*A legenda dos dois estados do selo não traz linhas novas: é a mesma do
livro-razão, palavra por palavra. O que mudou foi a coluna das rotas da exceção
de `VOZ-MARCADORES.md`, onde a rota `area` entra ao lado de `livro`,
`livroConcelhos` e `livroConcelho`: «proveniência completa» é o nome do estado de
um CAMPO de uma linha, e não uma afirmação sobre o que este sítio cobre.*

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | Por área de governo | areas | viva | — |
| conteudo | By area of government | areas | viva | — |
| navegacao | Áreas de governo | areas | viva | — |
| navegacao | Government areas | areas | viva | — |
| conteudo | As áreas de governo | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): um título que anuncia «as áreas de governo» sobre uma lista de nove das dezasseis promete a lista oficial inteira, e a única correção possível era uma frase de cobertura. O título passou a nomear o eixo de navegação, «Por área de governo» |
| conteudo | The areas of government | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): um título que anuncia «as áreas de governo» sobre uma lista de nove das dezasseis promete a lista oficial inteira, e a única correção possível era uma frase de cobertura. O título passou a nomear o eixo de navegação, «Por área de governo» |
| conteudo | Uma área de governo é o conjunto de matérias de um ministério, tal como a lei orgânica do Governo o fixa. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): definia o que uma área de governo é, e uma definição do vocabulário do sítio é o sítio a explicar-se (Emenda 15) |
| conteudo | An area of government is the set of matters of one ministry, as the Government’s organic law fixes it. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): definia o que uma área de governo é, e uma definição do vocabulário do sítio é o sítio a explicar-se (Emenda 15) |
| conteudo | As áreas de governo de Portugal, e os trabalhos e as medidas cujo assunto é matéria de cada uma. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): a descrição do `<head>` dizia o método do sítio na superfície pública, e a Emenda 15 tira isso de uma página do leitor. A descrição de uma página de área passou a ser o nome da área, e a do índice o seu título |
| conteudo | The areas of government of Portugal, and the studies and measures whose subject is a matter of each one. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): a descrição do `<head>` dizia o método do sítio na superfície pública, e a Emenda 15 tira isso de uma página do leitor. A descrição de uma página de área passou a ser o nome da área, e a do índice o seu título |
| conteudo | peças na página desta área de governo | areas | viva | — |
| conteudo | pieces on this area of government’s page | areas | viva | — |
| conteudo | Os trabalhos e as medidas cujo assunto é matéria de Finanças, área de governo. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): a descrição do `<head>` dizia o método do sítio na superfície pública, e a Emenda 15 tira isso de uma página do leitor. A descrição de uma página de área passou a ser o nome da área, e a do índice o seu título |
| conteudo | The studies and measures whose subject is a matter of Finance, an area of government. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): a descrição do `<head>` dizia o método do sítio na superfície pública, e a Emenda 15 tira isso de uma página do leitor. A descrição de uma página de área passou a ser o nome da área, e a do índice o seu título |
| conteudo | Os trabalhos e as medidas cujo assunto é matéria de Economia e Coesão Territorial, área de governo. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): a descrição do `<head>` dizia o método do sítio na superfície pública, e a Emenda 15 tira isso de uma página do leitor. A descrição de uma página de área passou a ser o nome da área, e a do índice o seu título |
| conteudo | The studies and measures whose subject is a matter of Economy and of Territorial Cohesion, an area of government. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): a descrição do `<head>` dizia o método do sítio na superfície pública, e a Emenda 15 tira isso de uma página do leitor. A descrição de uma página de área passou a ser o nome da área, e a do índice o seu título |
| conteudo | Os trabalhos e as medidas cujo assunto é matéria de Infraestruturas e Habitação, área de governo. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): a descrição do `<head>` dizia o método do sítio na superfície pública, e a Emenda 15 tira isso de uma página do leitor. A descrição de uma página de área passou a ser o nome da área, e a do índice o seu título |
| conteudo | The studies and measures whose subject is a matter of Infrastructure and Housing, an area of government. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): a descrição do `<head>` dizia o método do sítio na superfície pública, e a Emenda 15 tira isso de uma página do leitor. A descrição de uma página de área passou a ser o nome da área, e a do índice o seu título |
| conteudo | Os trabalhos e as medidas cujo assunto é matéria de Justiça, área de governo. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): a descrição do `<head>` dizia o método do sítio na superfície pública, e a Emenda 15 tira isso de uma página do leitor. A descrição de uma página de área passou a ser o nome da área, e a do índice o seu título |
| conteudo | The studies and measures whose subject is a matter of Justice, an area of government. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): a descrição do `<head>` dizia o método do sítio na superfície pública, e a Emenda 15 tira isso de uma página do leitor. A descrição de uma página de área passou a ser o nome da área, e a do índice o seu título |
| conteudo | Os trabalhos e as medidas cujo assunto é matéria de Administração Interna, área de governo. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): a descrição do `<head>` dizia o método do sítio na superfície pública, e a Emenda 15 tira isso de uma página do leitor. A descrição de uma página de área passou a ser o nome da área, e a do índice o seu título |
| conteudo | The studies and measures whose subject is a matter of Home Affairs, an area of government. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): a descrição do `<head>` dizia o método do sítio na superfície pública, e a Emenda 15 tira isso de uma página do leitor. A descrição de uma página de área passou a ser o nome da área, e a do índice o seu título |
| conteudo | Os trabalhos e as medidas cujo assunto é matéria de Educação, Ciência e Inovação, área de governo. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): a descrição do `<head>` dizia o método do sítio na superfície pública, e a Emenda 15 tira isso de uma página do leitor. A descrição de uma página de área passou a ser o nome da área, e a do índice o seu título |
| conteudo | The studies and measures whose subject is a matter of Education, Science and Innovation, an area of government. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): a descrição do `<head>` dizia o método do sítio na superfície pública, e a Emenda 15 tira isso de uma página do leitor. A descrição de uma página de área passou a ser o nome da área, e a do índice o seu título |
| conteudo | Os trabalhos e as medidas cujo assunto é matéria de Saúde, área de governo. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): a descrição do `<head>` dizia o método do sítio na superfície pública, e a Emenda 15 tira isso de uma página do leitor. A descrição de uma página de área passou a ser o nome da área, e a do índice o seu título |
| conteudo | The studies and measures whose subject is a matter of Health, an area of government. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): a descrição do `<head>` dizia o método do sítio na superfície pública, e a Emenda 15 tira isso de uma página do leitor. A descrição de uma página de área passou a ser o nome da área, e a do índice o seu título |
| conteudo | Os trabalhos e as medidas cujo assunto é matéria de Trabalho, Solidariedade e Segurança Social, área de governo. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): a descrição do `<head>` dizia o método do sítio na superfície pública, e a Emenda 15 tira isso de uma página do leitor. A descrição de uma página de área passou a ser o nome da área, e a do índice o seu título |
| conteudo | The studies and measures whose subject is a matter of Labour, Solidarity and Social Security, an area of government. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): a descrição do `<head>` dizia o método do sítio na superfície pública, e a Emenda 15 tira isso de uma página do leitor. A descrição de uma página de área passou a ser o nome da área, e a do índice o seu título |
| conteudo | Os trabalhos e as medidas cujo assunto é matéria de Ambiente e Energia, área de governo. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): a descrição do `<head>` dizia o método do sítio na superfície pública, e a Emenda 15 tira isso de uma página do leitor. A descrição de uma página de área passou a ser o nome da área, e a do índice o seu título |
| conteudo | The studies and measures whose subject is a matter of Environment and Energy, an area of government. | areas | retirada | saiu com a segunda leitura do bloco `areas` (28.08.2026): a descrição do `<head>` dizia o método do sítio na superfície pública, e a Emenda 15 tira isso de uma página do leitor. A descrição de uma página de área passou a ser o nome da área, e a do índice o seu título |
| conteudo | área do XXV Governo Constitucional | areas | viva | — |
| conteudo | area of the XXV Constitutional Government | areas | viva | — |
| conteudo | Os trabalhos | areas | viva | — |
| conteudo | The studies | areas | viva | — |
| conteudo | Os estudos de dados | areas | viva | — |
| conteudo | The data studies | areas | viva | — |
| conteudo | a política financeira do Estado | areas | viva | — |
| conteudo | administração local | areas | viva | — |
| conteudo | coesão territorial | areas | viva | — |
| conteudo | crescimento da economia | areas | viva | — |
| conteudo | competitividade | areas | viva | — |
| conteudo | investimento | areas | viva | — |
| conteudo | internacionalização das empresas | areas | viva | — |
| conteudo | os programas financiados por fundos europeus, nomeadamente no âmbito da política de coesão da União Europeia e do Plano de Recuperação e Resiliência (PRR) | areas | viva | — |
| conteudo | habitação | areas | viva | — |
| conteudo | construção | areas | viva | — |
| conteudo | a política de justiça | areas | viva | — |
| conteudo | administração eleitoral | areas | viva | — |
| conteudo | o sistema educativo | areas | viva | — |
| conteudo | a ciência | areas | viva | — |
| conteudo | as orientações em matéria de competências digitais | areas | viva | — |
| conteudo | a política nacional de saúde | areas | viva | — |
| conteudo | emprego | areas | viva | — |
| conteudo | segurança social | areas | viva | — |
| conteudo | combate à pobreza e de promoção da inclusão social | areas | viva | — |
| conteudo | apoio à família, crianças | areas | viva | — |
| conteudo | relações laborais e condições de trabalho | areas | viva | — |
| conteudo | água | areas | viva | — |


## Bloco «Correções pequenas, quarta passagem» · os rótulos em `<span>` · 29.08.2026

*A RÉGUA PASSOU A VER O QUE JÁ ESTAVA NA PÁGINA, e estas treze linhas são o que
ela viu. A medida 8 mede blocos de texto, e um bloco é uma etiqueta de uma lista
fechada (`p`, `li`, `h1`, `h2`, …): um `<span>` não está nela, e o elemento à
volta da cabeça de uma página é um `<div>`, que também não. O rótulo da cabeça de
dezasseis vistas do sítio vivia exactamente aí, entre as duas coisas que a régua
não olha, e passava por baixo dela sem ninguém o ver. A medição cega de 28.08 é
que o encontrou, nas páginas das áreas, com vinte rendições e nenhuma linha.*

*A ESCOLHA FOI MEXER NA RÉGUA E NÃO NAS PÁGINAS, e a razão é o que cada uma das
duas resolve. Pôr o rótulo de cada vista num `<p>`, que foi o que o bloco das
áreas fez nas suas duas, corrige as páginas de hoje e deixa a régua como estava:
o próximo rótulo escrito num `<span>` volta a passar por baixo dela. `medir-defeitos.mjs`
passa a medir os `<span>` de uma lista declarada de classes de rótulo
(`CLASSES_DE_ROTULO`, hoje só `.eyebrow`), e um rótulo em `<span>` não
inventariado é um bloco POR CLASSIFICAR como qualquer outro. Medido: o portão da
voz fechou a construção com 1 328 queixas em treze cadeias distintas, que são
estas.*

*A CLASSE É `navegacao`, e é a do positivo conhecido. «Relance» e «At a glance»
são o mesmo rótulo, com a mesma classe, escritos num `<h2>`, e estão declarados
como `navegacao` desde sempre; «Áreas de governo» e «Government areas» entraram
assim a 28.08. Um antetítulo de cabeça nomeia em que família de páginas o leitor
está, e é isso que ele faz aqui: «Município» por cima do nome de um concelho,
«Livro-razão» por cima do índice das linhas.*

*E A RÉGUA PROVA, EM CADA CONSTRUÇÃO, QUE AINDA VÊ. Uma lista de classes é uma
dependência de uma folha de estilos: renomear `.eyebrow` deixava a régua cega com
a contagem de «nada por classificar» a dizer zero, que é o defeito que ela veio
fechar. `check:voz` conta as ocorrências de cada classe declarada em `dist/` e
fecha a construção quando uma delas for a zero.*

*DUAS ROTAS TÊM O MESMO RÓTULO E NÃO ENTRAM AQUI, e não é um esquecimento: a
página de uma linha do livro-razão («Linha do livro-razão», «Ledger row», 2 602
rendições por edição) e a página do marcador («O marcador», «The marker») não
estão em `ROTAS_DO_INVENTARIO`. A régua vê-lhes o rótulo desde hoje; o que as
mantém fora da conta é a lista das rotas medidas, que é outra regra e cresce no
commit em que cada página é reconstruída. O antetítulo da obra citada
(`/estudos/<slug>/documento`) também não entra, porque a régua salta essa rota
inteira: é a obra de outrem.*

*TRÊS CADEIAS NÃO TRAZEM LINHA NOVA porque já estavam declaradas por outra
rendição, e a tabela mapeia por texto: «Correções» e «Corrections» (declaradas
desde antes de 26.08) e «Documento alojado» e «Document hosted» (do bloco da
grelha da voz).*

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| navegacao | Livro-razão | pequenas-4 | viva | — |
| navegacao | Ledger | pequenas-4 | viva | — |
| navegacao | Município | pequenas-4 | viva | — |
| navegacao | Municipality | pequenas-4 | viva | — |
| navegacao | Municípios | pequenas-4 | viva | — |
| navegacao | Municipalities | pequenas-4 | viva | — |
| navegacao | Distritos e ilhas | pequenas-4 | viva | — |
| navegacao | Districts and islands | pequenas-4 | viva | — |
| navegacao | Regiões | pequenas-4 | viva | — |
| navegacao | Regions | pequenas-4 | viva | — |
| navegacao | Agenda | pequenas-4 | viva | — |
| navegacao | Documento do estudo · texto | pequenas-4 | viva | — |
| navegacao | Study document · text | pequenas-4 | viva | — |

## Bloco «Correções pequenas, quarta passagem» · a marca `data-nome` · 29.08.2026

*A DÍVIDA DE FORMA QUE O BLOCO DAS ÁREAS NOMEOU DUAS VEZES ESTÁ PAGA. O nome de
cada área de governo custava duas linhas desta tabela, uma por edição, e a
descrição do `<head>` composta com ele custava outras duas. Com quatro áreas eram
dezasseis linhas; com nove, trinta e seis; com as dezasseis áreas do Governo
seriam sessenta e quatro. Isso não é um inventário das frases da casa: é a lista
dos ministérios escrita outra vez dentro dele.*

*A MARCA É `data-nome`, e é a irmã de `data-lugar`: diz «este texto é o nome de
uma entrada de um ficheiro de dados, e não prosa que a casa escreveu». Não podia
ser `data-lugar`, e a marca dos lugares tem escrito o que marca, o nome de um
concelho e a etiqueta que a Carta Administrativa lhe dá: uma área de governo não
é um lugar.*

*A REGRA É ESTREITA, E O VALOR DO ATRIBUTO NOMEIA A FONTE. Só o nome de uma
entrada de um ficheiro de dados com fonte declarada a pode levar, e hoje são dois:
`src/data/areas.mjs`, cujos nomes vêm das páginas do Governo lidas a 28.08.2026
(`FONTE_DOS_NOMES`, com a data), e `src/data/regioes.mjs`, cujos nomes vêm da
classificação NUTS 2024, com o código de cada região ao lado do nome.*

*E A MARCA TRAZ A SUA PRÓPRIA VERIFICAÇÃO, que é a diferença que mais importa.
`data-lugar` exclui e não confere: um nome trocado sai do inventário sem que
ninguém o veja. `check:voz` fecha a construção quando um `data-nome` nomeia uma
fonte que não é uma das duas, e quando o texto marcado não é, carácter a carácter,
um nome daquele ficheiro. Uma marca que dispensa um texto da declaração sem trazer
verificação troca uma lista por um buraco.*

*AS REGIÕES CONTINUAM EM `data-lugar`, e não é um descuido: uma região NUTS II é
um lugar, e as quatro linhas da descrição das suas páginas já se contam com
`<lugar>` lá dentro. Trocar a marca mudava o texto dessas linhas sem mudar o que
elas dizem. O ficheiro fica na lista das fontes porque a regra é sobre que
ficheiros podem sustentar a marca; a medição diz quantas vezes cada fonte se
exerce (hoje `areas 36`, `regioes 0`), para que uma fonte por exercer não fique em
silêncio.*

*DEZOITO LINHAS SAEM E UMA ENTRA. As dezoito são os nomes das nove áreas nas duas
edições, e **saem do ficheiro em vez de ficarem `retirada`**: uma linha `retirada`
diz «a casa tirou esta frase e ela não pode voltar», e estes nomes não foram
tirados de lado nenhum, e continuam na cabeça de cada página, onde sempre
estiveram. O que mudou foi quem os conta. A que entra é a descrição do `<head>`
de uma página de área, que é o nome da área e mais nada: com a substituição, ela
conta-se uma vez, com `<nome>` no lugar do nome, e não uma por área e por edição.
É a mesma forma das descrições que se contam com `<lugar>`.*

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | <nome> | pequenas-4 | viva | — |

## Bloco «Os nomes ao lado do mapa, e os dois painéis com nome» · 29.08.2026

*Oito linhas, e todas da primeira página. Duas famílias.*

**As quatro dicas dos dois valores novos.** `<ValorDaProva>` põe a glosa da chave
no `title`, e a régua lê os atributos desde a I79: cada painel ganhou um algarismo
da prova, e com ele a dica daquela chave nas duas edições. São a definição do que
se conta, escrita em `src/lib/prova.mjs`, e são conteúdo pela mesma razão que as
outras quatro dicas do painel que já estavam declaradas.

**As quatro linhas de nome dos dois painéis.** Duas saem e quatro entram. Saíam
«Painel Social Europeu» e «European Social Scoreboard», que eram o nome do painel
de baixo sozinho, e **saem do ficheiro em vez de ficarem `retirada`**: a casa não
tirou aquele nome de lado nenhum, ele continua onde estava, e o que mudou foi o
que está ao lado dele. Entram as quatro linhas inteiras, uma por painel e por
edição: o nome que a fonte dá ao painel, o ponto, e quantas medidas dele estão na
página.

*AS DUAS LINHAS DE NOME LEVAM A CONTAGEM DE HOJE (13 e 8), como «2602 afirmações
· 330 calculadas» leva a dela, e pela mesma razão: o algarismo não está escrito em
cadeia nenhuma, é um `<ValorDaProva>` que o portão reconta (`painel_com_limiar` e
`painel_social_total`), e a régua da voz lê o texto rendido. Quando uma das
contagens mudar, a linha deixa de se render e a construção fecha a dizer o nome
dela: é o portão a pedir que alguém volte a olhar para a frase, que é o que estas
linhas existem para fazer.*

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | European Social Scoreboard · 8 measures | inicio-lista | viva | — |
| conteudo | European Social Scoreboard measures the ledger holds | inicio-lista | viva | — |
| conteudo | Macroeconomic Imbalance Procedure · 13 measures with a threshold | inicio-lista | viva | — |
| conteudo | Painel Social Europeu · 8 medidas | inicio-lista | viva | — |
| conteudo | Procedimento dos Desequilíbrios Macroeconómicos · 13 medidas com limiar | inicio-lista | viva | — |
| conteudo | medidas do Painel Social Europeu que o livro-razão guarda | inicio-lista | viva | — |
| conteudo | medidas do painel cujo quadro publica um limiar | inicio-lista | viva | — |
| conteudo | panel measures whose scoreboard publishes a threshold | inicio-lista | viva | — |

## Bloco «rotulo-ia» · a divulgação pela via B · 01.09.2026

*Emendado na segunda passagem do mesmo dia, depois da leitura a frio: as quatro
linhas da primeira passagem mudam de classe e entram trinta e quatro que
faltavam.*

**Trinta e oito cadeias, e nenhuma entra por uma escolha editorial.** O artigo
50.º, n.º 4, segundo parágrafo, do Regulamento (UE) 2024/1689 manda divulgar que
um texto publicado para informar o público sobre matérias de interesse público
foi gerado por IA, e o n.º 5 manda dá-lo «de forma clara e percetível, o mais
tardar no momento da primeira interação ou exposição». A isenção do mesmo
parágrafo é para quem tem revisão humana ou controlo editorial; a casa escolheu a
via B (rotular tudo) a 30.08.2026 e não a invoca. O artigo 15.º, n.º 1 da Lei de
Imprensa acrescenta o nome do diretor e a menção de gratuitidade na primeira
página de cada edição. **A lei obriga a divulgar E obriga a que a política
divulgada exista publicada**: por isso entram as duas cadeias do rótulo, as duas
da ficha, e as trinta e quatro da secção da política que o rótulo aponta, no
Método e no Sobre.

## A classe é `divulgacao`, e é nova

A primeira passagem meteu as quatro cadeias do rótulo em `navegacao`, e era a
classificação a torcer-se para caber. **Nenhuma das três classes descrevia o que
elas são.** Conteúdo é o que a coisa medida é; navegação é o que leva a outro
sítio; autorreferência é o método, a verificação, a honestidade, a cobertura ou
as intenções do próprio sítio. Uma divulgação obrigatória não é nada disso: está
na página porque a lei a põe lá, e sairia no dia em que a lei mudasse.

**`autorreferencia` continua a ir a ZERO em todas as rotas medidas**, e a classe
nova não abre uma porta traseira à Emenda 15. A diferença entre as duas é a que a
própria emenda escreve: a autorreferência existe **para mostrar diligência**, e a
divulgação existe **porque alguém tem de saber quem responde**. Uma frase de
divulgação que comece a explicar porque se deve confiar na casa é
autorreferência com outro nome, e continua a ir a zero: quem a apanha é o mesmo
`npm run check:voz`, que conta a classe e não a intenção.

**As duas cabeças de secção ficam em `navegacao`**, e não em `divulgacao`: «A
política da casa» e «The house policy» nomeiam um lugar da página, como qualquer
outro nome de secção, e é o que a lista já chama navegação.

## Onde é que estas cadeias se rendem, e como é que a régua as vê

As trinta e quatro da secção rendem-se em `/metodo` e `/en/method`, e a frase da
política também no Sobre. **Nenhuma dessas rotas é medida**, porque a Emenda 15
isenta o Método e o Sobre da contagem: ali a autorreferência é o objecto da
página. A régua usava a mesma lista para duas perguntas diferentes, e a segunda
não é a mesma: «esta linha declarada ainda se rende em algum lado?». Ganhou uma
lista à parte (`ROTAS_QUE_PROVAM_A_RENDICAO` em `scripts/medir-defeitos.mjs`) que
serve só para responder a essa, sem entrar na contagem por classe, nos blocos por
classificar, nem na proibição das linhas retiradas.

*O texto de cada linha foi extraído das páginas construídas com a mesma
definição de bloco que a régua usa, e não datilografado.*

| divulgacao | A casa não aceita dinheiro de nenhuma entidade que mede. | rotulo-ia | viva | — |
| divulgacao | A casa não chama jornalista à IA e não se diz jornalística. | rotulo-ia | viva | — |
| divulgacao | A casa não escreve para o alcance: mede-se por citações, não por visitas. | rotulo-ia | viva | — |
| divulgacao | A casa não guarda dados pessoais dos leitores nem os põe no repositório. | rotulo-ia | viva | — |
| divulgacao | A casa não publica um número que não tenha lido na fonte, não aproxima o que não existe, e diz as ausências. | rotulo-ia | viva | — |
| divulgacao | A construção constrói o sítio, e verifica lotes na fonte. | rotulo-ia | viva | — |
| divulgacao | A direção dirige o trabalho: escreve os briefs, revê e funde. | rotulo-ia | viva | — |
| divulgacao | A leitura lê sem contexto prévio, com erros plantados que tem de encontrar. | rotulo-ia | viva | — |
| divulgacao | A medição mede numa cópia, com código próprio, sem ver a construção. | rotulo-ia | viva | — |
| navegacao | A política da casa | rotulo-ia | viva | — |
| divulgacao | AI-generated text under the house policy · editorial responsibility: Nuno dos Santos | rotulo-ia | viva | — |
| divulgacao | Building builds the site, and checks batches at the source. | rotulo-ia | viva | — |
| divulgacao | Direction directs the work: it writes the briefs, reviews and merges. | rotulo-ia | viva | — |
| divulgacao | Director: Nuno dos Santos · Free of charge | rotulo-ia | viva | — |
| divulgacao | Diretor: Nuno dos Santos · Publicação gratuita | rotulo-ia | viva | — |
| divulgacao | Escrito, conferido e atualizado por sistemas de IA sob uma política publicada; nenhum humano revê cada peça antes de sair; uma pessoa com nome detém a responsabilidade editorial, define as regras e as recusas, e responde. | rotulo-ia | viva | — |
| divulgacao | Everything the house publishes carries the AI-generated label, on every page, at the moment the page is seen. Review is done by gates and by sample, not piece by piece. | rotulo-ia | viva | — |
| divulgacao | Measurement measures on a copy, with its own code, without seeing the build. | rotulo-ia | viva | — |
| divulgacao | Não se publica, e o diretor é avisado · Uma medida nova; uma definição mudada; um ficheiro que a leitura já não reconhece; uma revisão da fonte; um portão vermelho; uma fonte que deixou de responder. | rotulo-ia | viva | — |
| divulgacao | Never without the director · Any piece that names a person; mail to third parties in the name of the house; a change of identity; money, contracts, accounts. | rotulo-ia | viva | — |
| divulgacao | Not published, and the director is told · A new measure; a changed definition; a file the reader no longer recognises; a revision at the source; a red gate; a source that has stopped answering. | rotulo-ia | viva | — |
| divulgacao | Nunca sem o diretor · Qualquer peça que nomeie uma pessoa; correio a terceiros em nome da casa; uma mudança de identidade; dinheiro, contratos, contas. | rotulo-ia | viva | — |
| divulgacao | Publica-se · Um valor novo da mesma medida, no mesmo formato, da mesma fonte, com todos os portões verdes. | rotulo-ia | viva | — |
| divulgacao | Published · A new value of the same measure, in the same format, from the same source, with every gate green. | rotulo-ia | viva | — |
| divulgacao | Reading reads with no prior context, with planted errors it has to find. | rotulo-ia | viva | — |
| divulgacao | São os modelos Claude da Anthropic, em três lugares (a direção, a construção, a medição), e o Codex da OpenAI na leitura. Um modelo novo só ocupa um lugar depois de passar os mesmos testes que o titular passou, e a troca fica escrita com a data. | rotulo-ia | viva | — |
| divulgacao | São quatro lugares, e a verificação é sempre de outra família de modelos: | rotulo-ia | viva | — |
| divulgacao | Texto gerado por IA sob a política da casa · responsável editorial: Nuno dos Santos | rotulo-ia | viva | — |
| divulgacao | The house does not call the AI a journalist and does not call itself journalism. | rotulo-ia | viva | — |
| divulgacao | The house does not write for reach: it is measured by citations, not by visits. | rotulo-ia | viva | — |
| divulgacao | The house keeps no personal data of its readers and puts none in the repository. | rotulo-ia | viva | — |
| navegacao | The house policy | rotulo-ia | viva | — |
| divulgacao | The house publishes no figure it has not read at the source, does not approximate what does not exist, and says what is missing. | rotulo-ia | viva | — |
| divulgacao | The house takes no money from any entity it measures. | rotulo-ia | viva | — |
| divulgacao | There are four places, and checking is always done by a different family of models: | rotulo-ia | viva | — |
| divulgacao | They are the Claude models from Anthropic in three of the places (direction, building, measurement), and Codex from OpenAI in the reading. A new model takes a place only after passing the same tests the incumbent passed, and the change is written down with its date. | rotulo-ia | viva | — |
| divulgacao | Tudo o que a casa publica leva o rótulo de gerado por IA, em cada página, no momento em que a página é vista. A revisão faz-se por portões e por amostra, e não peça a peça. | rotulo-ia | viva | — |
| divulgacao | Written, checked and updated by AI systems under a published policy; no human reviews each piece before it goes out; a named person holds editorial responsibility, sets the rules and the refusals, and answers for it. | rotulo-ia | viva | — |

## Bloco «A cabeça nova como contentor» · 01.09.2026

*Duas linhas, e são a mesma frase nas duas edições: o nome da faixa de cartões
que passou a viver entre a manchete e o mapa.*

**É a frase que substitui «Âmbito» e «Densidade» na cabeça do telemóvel.** As
duas palavras eram os rótulos dos dois grupos da linha de comando, e a linha
desceu para o cabeçalho do painel; o que fica no lugar delas é a faixa, e uma
lista precisa de um nome para quem a ouve. Nenhuma das duas palavras estava neste
ficheiro — vivem em `<span class="cmd-k">`, e a régua recolhe os blocos de texto e
os rótulos em `span` da classe `eyebrow`, não este —, e por isso não há aqui uma
linha a retirar: elas continuam a render-se, no fim de `.inicio`, com o comando.

**A CLASSE É `navegacao`, e é a do positivo conhecido.** O nome do mapa da
primeira página («Mapa dos distritos e das ilhas de Portugal, com uma área por
unidade.») está classificado assim desde o bloco `grelha-2`, e é a mesma coisa
feita da mesma maneira: um `aria-label` que diz o que um instrumento de navegação
é e como está feito, sem verbo sobre a casa, sem porta, sem algarismo e sem selo.

**NÃO NOMEIA O LUGAR, e isso é a razão de ser uma linha e não trezentas e
dezoito.** «As medidas de Portugal» obrigaria a «As medidas de Évora» nas 308
páginas de concelho e a «As medidas do Alentejo» nas 9 de região, com a
preposição a contrair-se por nome; a régua lê os `aria-label` desde a I79, e o
inventário ganharia uma linha por lugar. O lugar está dito no rótulo da cabeça e
na manchete, a três linhas de distância.

**AS TRÊS PALAVRAS DE ESTADO NÃO ENTRAM, e a razão está no componente.** A
primeira construção deste bloco punha a fila do estado do cartão num `<p>`, e a
régua passou a recolher «fora do limiar», «dentro do limiar» e «sem limiar» como
frases novas em 6 590 rotas. A peça rende-as, desde a Emenda 13, dentro de um
`<div class="peca-topo">`, e por isso nunca foram recolhidas: são o vocabulário
fechado do estado e não prosa da casa. A faixa passou a fazer o mesmo. A mesma
palavra, no mesmo sítio da mesma casa, lê-se da mesma maneira nos dois sítios.

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| navegacao | As medidas, uma por cartão | cabeca | viva | — |
| navegacao | The measures, one per card | cabeca | viva | — |

## Bloco «A cabeça nova» · segunda passagem · os `<summary>` entram na régua · 01.09.2026

*Sete linhas, e nenhuma delas é uma frase nova no sítio: são frases que já lá
estavam e que a régua da voz não via.*

**O QUE ESTAVA ABERTO.** `frasesDaCasa()` em `scripts/medir-defeitos.mjs` saltava
todos os `<summary>` sem condição, debaixo de um comentário que falava de outra
coisa («uma ligação inteira não é uma frase: é um destino», que é a regra do
texto fora das âncoras e vale para todos os blocos). Um `<summary>` é texto à
vista, escrito pela casa, e é a palavra que o leitor lê antes de decidir se abre.
O bloco da cabeça nova acrescentou dois e encontrou o buraco; a primeira passagem
registou-o como dúvida e esta fecha-o.

**O QUE APARECEU quando a régua passou a ver.** Cinco frases distintas por
edição, e só duas delas são novas no sítio: o «Menu» do cabeçalho, que já estava
declarado pelo `aria-label` («Menu · Navegação principal») e não pelo texto; o
«abrir/fechar» da densidade de cada peça, cujas duas palavras já estavam
declaradas em separado mas não como o par que o `<summary>` mostra; a porta das
linhas de um documento, no fim de cada página de texto de um trabalho; e os nomes
das duas gavetas do mapa, que são deste bloco. As duas edições escrevem «Menu»
com a mesma palavra, e por isso é uma linha e não duas.

**A CLASSE É `navegacao` nas sete**, e é a do positivo conhecido: são nomes de
comandos e de portas, não conteúdo. «Relance», «Leitura breve», «Menu ·
Navegação principal» e «Áreas de governo» estão classificadas assim desde sempre.

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| navegacao | A municipality by name | cabeca | retirada | o F1.1 tirou a gaveta da busca a 03.09.2026: a busca dos 308 saiu de ao lado do mapa e subiu para debaixo da manchete como `<form>` com destino, sem gaveta nenhuma, porque é a porta para o concelho no primeiro ecrã (itens 3 e 12 do brief). O nome da gaveta ficou sem superfície |
| navegacao | Menu | cabeca | viva | — |
| navegacao | Os nomes no mapa | cabeca | viva | — |
| navegacao | The names on the map | cabeca | viva | — |
| navegacao | Um concelho pelo nome | cabeca | retirada | o F1.1 tirou a gaveta da busca a 03.09.2026: a busca dos 308 saiu de ao lado do mapa e subiu para debaixo da manchete como `<form>` com destino, sem gaveta nenhuma, porque é a porta para o concelho no primeiro ecrã (itens 3 e 12 do brief). O nome da gaveta ficou sem superfície |
| navegacao | abrir fechar | cabeca | viva | — |
| navegacao | open close | cabeca | viva | — |
| navegacao | As linhas deste documento → | cabeca | viva | — |
| navegacao | The rows of this document → | cabeca | viva | — |

## As frases da página do primeiro domínio (bloco F1.2, 03.09.2026)

**Duas rotas novas, e as duas entram no inventário no commit em que nascem**, que
é a regra desta lista («uma rota entra no commit em que a sua página é
reconstruída e as suas frases são classificadas»). Entram também em
`ROTAS_COM_ORIGEM_LIDA`, e essa é a diferença que faz o número: a régua lê o
bloco com as marcas de origem retiradas, e por isso vê o aparelho de cada leitura
breve («período · lido · conferido», «fonte · ·», «limiar % · fora do limiar»)
que nas rotas ainda não migradas fica escondido. Nenhuma das linhas abaixo é uma
cadeia que já se rendesse noutro lado: são todas deste bloco.

**Três classes de linha, e nenhuma é autorreferência.** As perguntas são as da
`CARTA-DOS-CONTEUDOS.md` §3, palavra por palavra: são o conteúdo do domínio, e
não a casa a falar de si. A frase da fronteira é o que o
`BRIEF-forma-dos-dominios.md` §2 chama «o que este domínio mede e o que não
mede», e as suas palavras vêm da carta. A ausência é conteúdo por decisão da
carta (§1, regra 6): «não há número público para isto» é a resposta, e não uma
falha.

**O que NÃO está aqui, e porquê.** Os nomes dos dezoito domínios levam
`data-nome="dominios"` e a régua confere-os contra `src/data/dominios.mjs`; os
nomes de lugar da barra do concelho contra o país («Évora», «Portugal») levam
`data-lugar`, como o nome de um concelho na sua página; o nome da camada
(«Leitura breve», «Brief reading») é o da densidade e já estava declarado desde
26.08.2026; e os intervalos das classes do mapa («1 200 a 1 400») são marcas de
régua inteiras, e não palavras da casa com números pelo meio, exactamente para
que a régua não passasse a ter uma linha cujo texto é a letra «a».

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| navegacao | Domínios | dominio | viva | — |
| navegacao | Domains | dominio | viva | — |
| conteudo | As áreas da vida do país com medidas publicadas, e as que ainda não têm medidas conferidas. | dominio | viva | — |
| conteudo | The areas of the country’s life with published measures, and the ones with no verified measures yet. | dominio | viva | — |
| conteudo | Por domínio | dominio | viva | — |
| conteudo | By domain | dominio | viva | — |
| conteudo | no ar primeira vaga | dominio | viva | — |
| conteudo | live first wave | dominio | viva | — |
| conteudo | as medidas estão em primeira vaga | dominio | viva | — |
| conteudo | the measures are in first wave | dominio | viva | — |
| conteudo | ainda sem medidas conferidas primeira vaga | dominio | viva | — |
| conteudo | ainda sem medidas conferidas segunda vaga | dominio | viva | — |
| conteudo | ainda sem medidas conferidas terceira vaga | dominio | viva | — |
| conteudo | no verified measures yet first wave | dominio | viva | — |
| conteudo | no verified measures yet second wave | dominio | viva | — |
| conteudo | no verified measures yet third wave | dominio | viva | — |
| conteudo | A dívida pública é % do PIB, fora do limiar de %; o saldo das administrações públicas é % do PIB, dentro do limiar de − %. | dominio | viva | — |
| conteudo | Government debt is % of GDP, outside the threshold of %; the general government balance is % of GDP, within the threshold of − %. | dominio | viva | — |
| conteudo | As medidas de <nome>, com a fonte, o período e a data de cada uma. | dominio | viva | — |
| conteudo | The measures of <nome>, with the source, the period and the dates of each one. | dominio | viva | — |
| conteudo | Este domínio mede as contas do Estado, o que a economia produz por pessoa, a dívida dos municípios e o que se ganha e se trabalha em Portugal; não mede a produtividade, que é pergunta de estudo, nem o produto abaixo das regiões, nem a disparidade salarial entre sexos ao nível do concelho, que nenhum publicador oficial calcula. | dominio | viva | — |
| conteudo | This domain measures the State’s accounts, what the economy produces per person, municipal debt, and what is earned and worked in Portugal; it does not measure productivity, which is a question for a study, nor output below the regions, nor the gender pay gap at municipal level, which no official publisher computes. | dominio | viva | — |
| conteudo | Quanto cresce a economia por pessoa? | dominio | viva | — |
| conteudo | As contas públicas estão em equilíbrio? | dominio | viva | — |
| conteudo | Quanto deve o Estado? | dominio | viva | — |
| conteudo | O Estado gasta dentro da regra europeia? | dominio | viva | — |
| conteudo | Quanto deve a minha câmara, e qual é o limite? | dominio | viva | — |
| conteudo | Quantas pessoas trabalham? | dominio | viva | — |
| conteudo | Quantas procuram trabalho e não encontram? | dominio | viva | — |
| conteudo | Quanto se ganha? | dominio | viva | — |
| conteudo | As mulheres ganham o mesmo? | dominio | viva | — |
| conteudo | Qual é o salário mínimo em vigor? | dominio | viva | — |
| conteudo | As mulheres ganham o mesmo, no meu concelho? | dominio | viva | — |
| conteudo | How much does the economy grow per person? | dominio | viva | — |
| conteudo | Are the public accounts in balance? | dominio | viva | — |
| conteudo | How much does the State owe? | dominio | viva | — |
| conteudo | Does the State spend within the European rule? | dominio | viva | — |
| conteudo | How much does my municipality owe, and what is the cap? | dominio | viva | — |
| conteudo | How many people work? | dominio | viva | — |
| conteudo | How many are looking for work and not finding it? | dominio | viva | — |
| conteudo | How much do people earn? | dominio | viva | — |
| conteudo | Do women earn the same? | dominio | viva | — |
| conteudo | What is the minimum wage in force? | dominio | viva | — |
| conteudo | Do women earn the same, in my municipality? | dominio | viva | — |
| conteudo | Não há número público para isto. | dominio | viva | — |
| conteudo | There is no published figure for this. | dominio | viva | — |
| conteudo | O indicador que o publicador dá por concelho é um coeficiente de variação do ganho, e não a disparidade entre sexos. | dominio | viva | — |
| conteudo | The indicator the publisher gives by municipality is a coefficient of variation of earnings, not the gap between sexes. | dominio | viva | — |
| conteudo | procurado em INE, Quadros de Pessoal do MTSSS/GEP, indicador | dominio | viva | — |
| conteudo | looked for in Statistics Portugal, MTSSS/GEP staff records, indicator | dominio | viva | — |
| conteudo | período · lido · conferido | dominio | viva | — |
| conteudo | period · read · checked | dominio | viva | — |
| conteudo | fonte · · | dominio | viva | — |
| conteudo | source · · | dominio | viva | — |
| conteudo | limiar % · fora do limiar | dominio | viva | — |
| conteudo | limiar − % · dentro do limiar | dominio | viva | — |
| conteudo | threshold % · outside the threshold | dominio | viva | — |
| conteudo | threshold − % · within the threshold | dominio | viva | — |
| conteudo | dentro do limiar | dominio | viva | — |
| conteudo | fora do limiar | dominio | viva | — |
| conteudo | within the threshold | dominio | viva | — |
| conteudo | outside the threshold | dominio | viva | — |
| conteudo | o limite legal | dominio | viva | — |
| conteudo | the legal cap | dominio | viva | — |
| conteudo | em doze meses, na base do Eurostat | dominio | viva | — |
| conteudo | over twelve months, on the Eurostat basis | dominio | viva | — |
| conteudo | provisório | dominio | viva | — |
| conteudo | provisional | dominio | viva | — |
| conteudo | menos de | dominio | viva | — |
| conteudo | less than | dominio | viva | — |
| conteudo | ou mais | dominio | viva | — |
| conteudo | or more | dominio | viva | — |
| conteudo | sem valor publicado | dominio | viva | — |
| conteudo | no published value | dominio | viva | — |
| conteudo | Quadros de Pessoal do Gabinete de Estratégia e Planeamento do Ministério do Trabalho; trabalhadores por conta de outrem a tempo completo com remuneração completa. | dominio | viva | — |
| conteudo | Staff records of the labour ministry’s strategy and planning office; full-time employees on full pay. | dominio | viva | — |

## As frases da segunda passagem (bloco F1.2, Claude Sonnet 5, 03.09.2026)

**Sete cadeias novas, todas dentro da manchete, da leitura breve ou do mapa por
concelho.** A leitura a frio do Codex (Blocking 2, 3, 4; Major 7, 13) pediu a
barra do ganho contra o país nas 308 páginas de concelho, a ressalva visível de
T1 e de T5, a nota da escala do mapa do ganho, e a tabela dos 308 valores dentro
da própria página. As duas primeiras entram porque a rota `dominio` já está em
`ROTAS_COM_ORIGEM_LIDA` (F0.9): a régua conta agora o texto de um bloco com as
marcas de origem retiradas, e não deita fora o bloco inteiro por ter uma marca
lá dentro.

**A ressalva de T1 e de T5 leva o marcador da casa por extenso**, porque o
bloco que a contém não tem NENHUMA outra marca de origem lá dentro (nem
`data-claim`, nem `data-lugar`, nem `data-medida-nome`): é o `<a class="marcador">`
sozinho, e por isso a régua lê o parágrafo inteiro, marcador incluído, como
lê qualquer parágrafo sem marca (a mesma regra que já vale para «Bragança
… `[a verificar]` … 2013» na página de Évora).

**A frase da barra do ganho reduz-se a pontuação, e é a mesma classe de
`fonte · ·` e `limiar % · fora do limiar` ali em cima**: os dois nomes de
lugar (`data-lugar`), os dois valores (`data-claim`, dentro de `<Claim
chip={true}/>`) e as duas unidades (`data-medida-unidade`) saem antes de contar,
e o que sobra é a pontuação que os liga. Não é um número solto: é o molde da
frase, sem os números.

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | : ; : . | dominio | viva | o molde da frase da barra do ganho contra o país (`BarraConcelhoPais.astro`), sem os dois nomes de lugar, os dois valores e as duas unidades, que saem por `data-lugar`, `data-claim` e `data-medida-unidade` |
| conteudo | A meta desta medida é da União Europeia no seu conjunto e não de Portugal; uma meta nacional própria permanece [a verificar] . | dominio | viva | a ressalva de T1 (Blocking 4): a meta de 2030 do Plano de Ação do Pilar Europeu é da União e não de Portugal, e a carta di-lo; a meta nacional própria não está pesquisada |
| conteudo | This measure’s target belongs to the European Union as a whole, not to Portugal; a national target of its own remains [a verificar] (to verify) . | dominio | viva | — |
| conteudo | Este valor é o do território continental. Os Açores e a Madeira fixam o seu por diploma regional próprio, que não foi lido: [a verificar] . | dominio | viva | a ressalva de T5 (Blocking 4): paráfrase do artigo 2.º do diploma, «Âmbito territorial», citado ao carácter em `document.locator` da linha `retribuicao-minima-mensal-garantida-continente-2026` |
| conteudo | This value is for mainland Portugal. The Azores and Madeira set their own value by separate regional decree, which has not been read: [a verificar] (to verify) . | dominio | viva | — |
| conteudo | As classes são marcas redondas da escala, e não um limite oficial. | dominio | viva | a nota do mapa do ganho médio (Blocking 3): distingue a sua paleta `escala` da paleta `limiar` do mapa do índice de dívida, ao lado |
| conteudo | The classes are round scale marks, not an official limit. | dominio | viva | — |
| conteudo | Concelho | dominio | viva | o cabeçalho da coluna do nome, na tabela dos 308 valores (Major 7) |
| conteudo | Valor | dominio | viva | o cabeçalho da coluna do valor, na mesma tabela |
| conteudo | Value | dominio | viva | — |
| navegacao | Os valores, concelho a concelho | dominio | viva | o rótulo do `<details>` que abre a tabela dos 308 valores: a alternativa em texto do mapa, na própria página (Major 7) |
| navegacao | The values, municipality by municipality | dominio | viva | — |

## Segunda passagem do bloco F1.9a (Sonnet) · 03.09.2026

*A leitura a frio do Codex sobre a primeira passagem (guardada na árvore
principal como `design/especime-v3/critica/2026-09-03-codex-leitura-f19-indice.md`,
e não citada aqui entre plicas pela mesma razão que já vale para a leitura do
`rotulo-ia`, acima: a conferência do portão exige que um ficheiro nomeado
assim exista NESTE ramo, e este vive só no principal) apontou, no Major 7,
que os rótulos novos ficavam sem entrada nomeada com origem. Nenhum dos dois
GANHA uma linha na tabela, e as duas razões são diferentes uma da outra e
estão escritas por extenso, porque confundi-las seria esconder um limite
mecânico atrás de uma escolha editorial.*

**«Subir» / «Back to top» NÃO PODE ser uma linha `viva`, e não é falta de
tentar: `npm run check:voz` fecha a construção se o for.** A medida 8 (os
blocos de texto da casa) e a medida 9 (o tripwire, que varre o texto fora das
origens declaradas) EXCLUEM as duas, por regra, o texto que vive dentro de um
`<a>` ou de um `<button>` — é a mesma exclusão que já tirava «Subir ↑» da
contagem de blocos por classificar, e ela corre nos dois sentidos: também
impede a régua de confirmar que uma linha `viva` SE RENDE. Uma frase cujo
texto inteiro é sempre a etiqueta de uma ligação não tem como entrar na
tabela deste ficheiro enquanto a régua não souber ler dentro de `<a>` — é o
que a nota de 25.08 já dizia, com a razão certa; o que faltava era dizê-lo
sem soar a esquecimento. «Subir» / «Back to top» é a palavra de duas portas
desde esta passagem (o comando fixo do computador, a partir de 1024px onde a
goteira existe, e a porta em fluxo no fim de cada secção de nível 2, abaixo
disso, Blocking 4 da mesma leitura), sempre para o mesmo destino
(`#texto-indice`), declarada em `src/i18n/strings.mjs` (`estudos.textoSubir`)
nas duas línguas, e nomeada aqui por essa razão.

**«Secção {n} de {total}» / «Section {n} of {total}» também não ganha linha,
e a razão é outra: é origem declarada, não prosa solta.** O modelo vive em
`src/i18n/strings.mjs` (`estudos.textoPosicaoSeccaoModelo`); a vista substitui
os dois números em cada título de nível 2 (Major 8 da mesma leitura: a
indicação de progresso ganha nome acessível), e a instância rendida leva
`data-registo-posicao`, que o L8 do portão de `scripts/gate-html.mjs` confere
a cada construção — a contagem, o texto contra este modelo e a referência do
título. É a mesma classe do `{ref}` que a grelha da voz já tira da tabela
(«A grelha da voz» · G6, acima) e do índice «Nesta página», que entra pela
marca `data-registo-indice`: um número do próprio sítio não se escreve à
mão, verifica-se, e o que se verifica assim não é uma frase da casa para
classificar.

**O que isto deixa por resolver, e é do F3.1 e não desta passagem.** A régua
da voz não lê texto dentro de `<a>` em nenhuma rota do sítio, não só nesta: é
uma exclusão geral, e alargá-la é redesenhar `medir-defeitos.mjs` para saber
distinguir «rótulo de comando, sem origem própria» de «prosa da casa dentro
de uma ligação» — o mesmo problema que o F0.9 mediu do lado de fora do
arame (190 cadeias em 2 118 ocorrências) e deixou escrito para aquele bloco.

## Bloco «porta» · a porta da frente · 03.09.2026

*O bloco F1.1 do `design/observatorio/PLANO-fiabilidade-2026-09-02.md` §3, com o
brief `design/observatorio/BRIEF-F1.1-porta-da-frente.md`. Quatro cadeias novas e
quatro retiradas.*

**AS QUATRO PRIMEIRAS SÃO AS FRASES DE CONTEXTO DOS DOIS PAINÉIS**, nas duas
edições, e são a resposta ao achado C6 da auditoria de UX de 25.08 («não se
percebe porque estão ali treze indicadores… "Procedimento dos Desequilíbrios
Macroeconómicos" nunca explicado, "limiar 60% · acima" sem dizer quem o fixou»).
A classe é **conteúdo**, pelo teste da Emenda 15: sem elas o leitor lê «limiar
60% · acima» como uma avaliação da casa, que é ler mal o número. Nenhuma fala do
método, da verificação, da cobertura ou das intenções da casa; dizem o que o
painel é, quem publica as medidas e quem publica os limiares, e a origem de cada
afirmação está escrita, afirmação a afirmação, no cabeçalho de
`CONTEXTO_DOS_PAINEIS` em `src/data/figuras.mjs`, com o comando que a confirma
no livro-razão.

**O TEXTO DECLARADO ACABA NUMA VÍRGULA E NUM PONTO**, e não é um erro de
transcrição: o identificador do documento da Comissão é uma citação transcrita
(`data-verbatim="swd-2026-222"`, conferida carácter a carácter contra
`src/data/verbatim.mjs`), e a régua da voz conta o bloco com as origens
declaradas retiradas, como faz a todas as outras. É a mesma forma das linhas do
limiar, que declaram «limiar % · acima» sem o algarismo.

**«1 de 21» NÃO TRAZ CADEIA NENHUMA PARA ESTA TABELA**, e a razão está medida no
relatório do bloco: os dois algarismos são numeração declarada
(`data-nonledger="numeracao"`), o separador « de » é uma cadeia de
`strings.mjs`, e a fila onde eles vivem é um `<div>` e não um bloco de texto,
como a fila da palavra de estado que já lá estava. A régua da voz não recolhe
`<div>`, e a primeira passagem deste bloco chegou a declarar a dica de uma chave
da prova que entretanto saiu.

**AS QUATRO RETIRADAS** estão nas secções onde viviam, com a razão em cada
linha: o rótulo «Portugal · país» e a sua gémea inglesa, que saíram da cabeça do
país, e o nome da gaveta da busca nas duas edições, que ficou sem superfície
quando a busca subiu para debaixo da manchete.

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | Os indicadores do painel do Procedimento relativo aos Desequilíbrios Macroeconómicos, com os limiares que o Procedimento publica. Os valores são do Eurostat, confirmados contra a Comissão Europeia, . | porta | retirada | a segunda passagem do F1.1 apertou os verbos a 03.09.2026, depois do Blocking 6 da leitura a frio do Codex: «com os limiares que o Procedimento publica» e «que não publica limiares» são dois verbos que as linhas não sustentam. Uma nota do livro-razão diz que o limiar É do Procedimento, não que ele o publica; e a Emenda 16 diz que o Painel Social «não tem limiares», que é outra coisa de «não publica limiares». A frase que ficou diz o que a nota e a emenda dizem, palavra por palavra, e nomeia o documento contra o qual os valores foram confirmados, que a primeira redação deixava por dizer |
| conteudo | Os indicadores do painel do Procedimento relativo aos Desequilíbrios Macroeconómicos, cada um com o limiar do Procedimento. Os valores são do Eurostat, confirmados contra o da Comissão Europeia, . | porta | viva | — |
| conteudo | Os indicadores do Painel Social Europeu, que não publica limiares. Os valores são do Eurostat, confirmados contra a Comissão Europeia, . | porta | retirada | a segunda passagem do F1.1 apertou os verbos a 03.09.2026, depois do Blocking 6 da leitura a frio do Codex: «com os limiares que o Procedimento publica» e «que não publica limiares» são dois verbos que as linhas não sustentam. Uma nota do livro-razão diz que o limiar É do Procedimento, não que ele o publica; e a Emenda 16 diz que o Painel Social «não tem limiares», que é outra coisa de «não publica limiares». A frase que ficou diz o que a nota e a emenda dizem, palavra por palavra, e nomeia o documento contra o qual os valores foram confirmados, que a primeira redação deixava por dizer |
| conteudo | Os indicadores que o livro-razão guarda e cujo registo nomeia o Painel Social Europeu, sem cor porque não tem limiares. Os valores são do Eurostat, confirmados contra o da Comissão Europeia, . | porta | retirada | o bloco F1.6 pôs a seleção à cabeça da frase (decisão (5) da §1.98, cumprida a 04.09.2026): a frase passou a abrir por «Oito das dezassete medidas principais do Painel Social Europeu», com o numerador composto de `FIGURAS_SOCIAL.length` e o denominador declarado com a origem da Comissão. Esta redação não pode voltar: sem a seleção, o leitor lê oito cartões e não sabe que são oito de dezassete |
| conteudo | The indicators of the Macroeconomic Imbalance Procedure scoreboard, with the thresholds the Procedure publishes. The values are from Eurostat, confirmed against the European Commission, . | porta | retirada | a segunda passagem do F1.1 apertou os verbos a 03.09.2026, depois do Blocking 6 da leitura a frio do Codex: «com os limiares que o Procedimento publica» e «que não publica limiares» são dois verbos que as linhas não sustentam. Uma nota do livro-razão diz que o limiar É do Procedimento, não que ele o publica; e a Emenda 16 diz que o Painel Social «não tem limiares», que é outra coisa de «não publica limiares». A frase que ficou diz o que a nota e a emenda dizem, palavra por palavra, e nomeia o documento contra o qual os valores foram confirmados, que a primeira redação deixava por dizer |
| conteudo | The indicators of the Macroeconomic Imbalance Procedure scoreboard, each with the threshold of the Procedure. The values are from Eurostat, confirmed against the European Commission’s country report, . | porta | viva | — |
| conteudo | The indicators of the European Social Scoreboard, which publishes no thresholds. The values are from Eurostat, confirmed against the European Commission, . | porta | retirada | a segunda passagem do F1.1 apertou os verbos a 03.09.2026, depois do Blocking 6 da leitura a frio do Codex: «com os limiares que o Procedimento publica» e «que não publica limiares» são dois verbos que as linhas não sustentam. Uma nota do livro-razão diz que o limiar É do Procedimento, não que ele o publica; e a Emenda 16 diz que o Painel Social «não tem limiares», que é outra coisa de «não publica limiares». A frase que ficou diz o que a nota e a emenda dizem, palavra por palavra, e nomeia o documento contra o qual os valores foram confirmados, que a primeira redação deixava por dizer |
| conteudo | The indicators the ledger holds whose record names the European Social Scoreboard, with no colour because it has no thresholds. The values are from Eurostat, confirmed against the European Commission’s country report, . | porta | retirada | o bloco F1.6 pôs a seleção à cabeça da frase (decisão (5) da §1.98, cumprida a 04.09.2026): a frase passou a abrir por «Oito das dezassete medidas principais do Painel Social Europeu», com o numerador composto de `FIGURAS_SOCIAL.length` e o denominador declarado com a origem da Comissão. Esta redação não pode voltar: sem a seleção, o leitor lê oito cartões e não sabe que são oito de dezassete |

## Bloco F1.6 · o atraso do IEFP e a seleção do Painel Social · 04.09.2026

*O bloco escreveu três frases novas e reescreveu uma. **O atraso de uma série**
diz-se com três rótulos e três valores lidos, na página de cada linha atrasada e
no cartão dela na página do concelho: «Último período publicado pela fonte:
2026-07; a casa publica 2025-12 desde 26.08.2026». **O contador** do cabeçalho
diz quantas séries estão nesse estado e quantas linhas do livro-razão elas
apanham. **A frase do Painel Social** passou a abrir pela seleção.*

*AS CADEIAS DOS RÓTULOS SÃO MARCADAS `data-voz`, e é a única maneira de elas
poderem estar aqui: a régua salta um bloco com uma marca de origem lá dentro em
qualquer rota fora de `ROTAS_COM_ORIGEM_LIDA` (e `municipio` não está nessa
lista), e o rótulo do contador vive dentro de uma âncora, que é um destino e não
uma frase. A marca só alarga a peneira e não dispensa nada: ver a razão ao lado
de `VOZ_DECLARADA` em `scripts/medir-defeitos.mjs`.*

*AS DUAS DICAS DAS CHAVES DA PROVA entram como as outras: um `title` é
superfície pública desde a I79, e a frase que diz COMO um número é obtido é
prosa da casa.*

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | Séries atrasadas: | frescura | viva | — |
| conteudo | Series behind: | frescura | viva | — |
| conteudo | séries que a casa publica atrás do último período da fonte | frescura | viva | — |
| conteudo | series the house publishes behind the source’s latest period | frescura | viva | — |
| conteudo | linhas do livro-razão dessas séries | frescura | viva | — |
| conteudo | ledger rows in those series | frescura | viva | — |
| conteudo | Último período publicado pela fonte: | frescura | viva | — |
| conteudo | Latest period published by the source: | frescura | viva | — |
| conteudo | a casa publica | frescura | viva | — |
| conteudo | the house publishes | frescura | viva | — |
| conteudo | desde | frescura | viva | — |
| conteudo | since | frescura | viva | — |
| conteudo | Oito das dezassete medidas principais do Painel Social Europeu: as que o livro-razão guarda e cujo registo nomeia esse painel, sem cor porque não tem limiares. Os valores são do Eurostat, confirmados contra o da Comissão Europeia, . | frescura | viva | — |
| conteudo | Eight of the seventeen headline indicators of the European Social Scoreboard: the ones the ledger holds whose record names that scoreboard, with no colour because it has no thresholds. The values are from Eurostat, confirmed against the European Commission’s country report, . | frescura | viva | — |

*AS DUAS ÚLTIMAS LINHAS LEVAM UMA CONTAGEM POR EXTENSO, e o inventário já disse
uma vez que uma frase com um número que se move não pode ser sentinela. A
diferença está medida e não afirmada: nenhum dos dois números é escrito na
frase. O numerador compõe-se de `FIGURAS_SOCIAL.length` no próprio ficheiro de
dados, pelo que a frase muda sozinha se uma medida entrar ou sair do painel, e
nesse dia esta linha deixa de se render e a construção fecha com o nome dela,
que é a régua a funcionar e não a falhar. O denominador é da Comissão, declarado
em `MEDIDAS_PRINCIPAIS_DO_PAINEL_SOCIAL` com o documento, o endereço e a data em
que foi lido, e o `check:formas` (F16) exige que a frase continue a dizê-lo.*

## As frases da área de leitura da primeira página (bloco F1.1b, 04.09.2026)

**Nenhuma linha nova, e isso mediu-se antes de se escrever.** O bloco tirou os dois
painéis da primeira página e pôs no lugar deles a área de leitura: 21 `<details>`
fechados, com o nome da medida como `<summary>`. Todo o texto que ela mostra já
estava declarado ou já tem origem declarada:

* o **nome** e a **unidade** de cada medida levam `data-medida-nome` e
  `data-medida-unidade`, que são marcas de origem: a régua não as recolhe, e o
  texto vem de `src/data/figuras.mjs`;
* a **definição** de cada medida (a frase que a peça do painel imprimia) é, linha
  a linha, a que já estava classificada nesta tabela, e continua a render-se: a
  segunda passagem de 04.09 repô-la nas três leituras que a primeira tinha
  reduzido a uma porta (ver mais abaixo);
* a linha do **limiar** («limiar 60% · acima») é, carácter a carácter, a que a
  peça do painel imprimia, e já estava classificada;
* a linha das **três datas** («período · lido · conferido») é a mesma que a página
  do domínio imprime desde o F1.2, e já está na tabela deste ficheiro. O que o
  bloco acrescentou foi a rota `home` à exceção da raiz «confer» em
  `VOZ-MARCADORES.md`, que já existia para a rota `dominio` e pela mesma razão: é
  o nome de um CAMPO da linha, e `npm run check:formas` recompõe-o do livro-razão
  e compara-o carácter a carácter;
* a **frase de contexto** de cada um dos dois quadros e o **nome** de cada um deles
  ficam onde estavam, uma vez cada, e nenhuma mudou uma palavra.

**«Ver no domínio →» / «See it in the domain →» NÃO PODE ser uma linha `viva`, e
não é falta de tentar: `npm run check:voz` fecha a construção se o for.** É a
porta que fecha a leitura breve de uma medida que vive num domínio, e leva à
leitura dela em `/dominios/<slug>#m-<chave>`; está declarada em
`src/i18n/strings.mjs` (`dominios.verNoDominio`) nas duas línguas, e nomeada aqui
por essa razão. A medida 8 (os blocos de texto da casa) e a medida 9 (o tripwire)
excluem, por regra, o texto que vive dentro de um `<a>` ou de um `<button>`, e a
exclusão corre nos dois sentidos: também impede a régua de confirmar que uma linha
`viva` SE RENDE. Uma frase cujo texto inteiro é sempre a etiqueta de uma ligação
não tem como entrar na tabela deste ficheiro enquanto a régua não souber ler
dentro de `<a>`. É a mesma razão, palavra por palavra, que a segunda passagem do
F1.9a escreveu para «Subir» / «Back to top», acima. **A cadeia diz o que a coisa é
e para onde leva, não fala da casa, e usa as palavras do vocabulário fechado da
§1.98 («domínio»).**

**O que isto deixa por resolver é do F3.1**, e não deste bloco: a régua da voz não
lê texto dentro de `<a>` em nenhuma rota do sítio, e alargá-la é redesenhar
`medir-defeitos.mjs` para distinguir «rótulo de comando, sem origem própria» de
«prosa da casa dentro de uma ligação». Está escrito na secção do F1.9a com o
tamanho do buraco (190 cadeias em 2 118 ocorrências, medidas pelo F0.9).

**Nenhuma frase saiu do sítio com este bloco.** A primeira passagem passou quatro
linhas a «retirada» (a definição da dívida pública e a da taxa de emprego, nas
duas edições), porque a leitura dessas medidas na primeira página tinha sido
reduzida a uma linha com a porta. A leitura a frio do Codex mediu o custo dessa
instrução (Blocking 3: a primeira página passava de 7 para 5 definições, de 13
para 12 limiares e réguas, e de 21 para 18 selos de fonte), o lugar de direção
corrigiu a decisão no mesmo dia, e as quatro linhas voltaram a «viva»: as 21
leituras têm a mesma forma, e as três do domínio acrescentam a porta.

## Bloco F1.7 · acessibilidade e alvos · 04.09.2026

*O bloco não escreveu uma palavra nova: tudo o que ele mudou à vista é
estrutura, folha e marcas de língua. Duas cadeias mudam de superfície, e é por
isso que entram aqui.*

**«PROCURAR» E «SEARCH» PASSAM A VER-SE EM `/municipios`.** A cadeia é
`ambito.pesquisaSubmeter` de `src/i18n/strings.mjs`, e não é nova: é o botão do
formulário de busca que a primeira página já rende desde o F1.1 (item 12 do
brief da porta da frente, a busca como `<form>` com destino). O que muda é a
superfície. Até 04.09 o índice dos 308 rendia a peça `Pesquisa` sem formulário e
com a fila de 308 resultados; com a fila fora (uma lista só, item 13 do brief
F1.7), o campo passa a ser um `<form>` `GET` para a própria página, e o botão
que o submete passa a ver-se ali. **Origem: a mesma chave, a mesma palavra, uma
segunda superfície.**

**«UM CONCELHO PELO NOME» E «SEARCH FOR A MUNICIPALITY» continuam a ver-se**, e
são o rótulo do campo (`ambito.pesquisaRotulo`), que o índice já rendia antes
deste bloco: não mudam de estado nem de superfície, e ficam onde já estavam.

**NADA MAIS ENTROU.** Os nomes que este bloco pôs em `aria-label` e em
`aria-labelledby` (as caixas que se deslocam de lado, item 2) não são cadeias
novas: cada um aponta, pelo `id`, para texto que a página já rendia — o `<title>`
do próprio desenho, o rótulo por cima do eixo da agenda, o título da secção onde
uma tabela vive. E o título do sumário do Método, que estava vazio, passou a
render `leitura.sumarioK`, que é a mesma cadeia que a Agenda e as páginas de
leitura já imprimem para o mesmo sumário.

**E ESTA DECLARAÇÃO NÃO É UMA LINHA DA TABELA, porque a tabela é a leitura da
régua e a régua não lê botões.** Medido a 04.09.2026: `frasesDaCasa()` recolhe
`p, li, dd, dt, h1, h2, h3, h4, figcaption, summary, blockquote, td, th,
caption` e os rótulos que vivem num `<span>` sozinho
(`scripts/medir-defeitos.mjs`, `BLOCOS` e `ROTULOS_EM_SPAN`). Um `<button>` e um
`<label>` não estão nessa lista, e nunca estiveram: uma linha «viva» para
«Procurar» fecha a construção com «linha viva que não se rende em rota nenhuma»,
não porque a cadeia não se veja, mas porque a régua não olha para onde ela está.

**O buraco fica medido e nomeado, e é maior do que esta cadeia.** Nas nove rotas
inventariadas há **doze textos distintos de `<button>` e de `<label>`** fora da
leitura da régua: «claro» e «escuro» (e «light» e «dark») do controlo do tema,
«Relance» e «Leitura breve» (e «At a glance» e «Brief reading») da porta do
telemóvel, «Procurar» e «Search», e «Escreva o nome do concelho» e «Type the
name of the municipality», que é o rótulo do campo. Quatro deles já têm linha
nesta tabela por serem lidos noutra superfície; os outros oito não têm.

Alargar `BLOCOS_DA_VOZ` a `button` e a `label` é a correção certa, e não se faz
aqui: mexe na régua de que dependem os blocos que correm em paralelo, e pede as
oito linhas novas e a entrada em `critica/REVISOES-DO-INVENTARIO.md` que uma
leitura cruzada do inventário obriga. **Fica para a direção**, com a contagem
feita.
