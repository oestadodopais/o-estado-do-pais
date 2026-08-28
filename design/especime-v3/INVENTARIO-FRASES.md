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
| conteudo | Dívida bruta das administrações públicas, no conceito do Procedimento dos Défices Excessivos. Está acima do limiar do painel europeu, e a descer. | até 2026-08-26 | viva | — |
| navegacao | Encontrou um erro? correcoes@oestadodopais.pt · O registo de correções → | até 2026-08-26 | viva | — |
| conteudo | European Social Scoreboard | até 2026-08-26 | viva | — |
| navegacao | Found an error? correcoes@oestadodopais.pt · The corrections log → | até 2026-08-26 | viva | — |
| conteudo | General government gross debt, on the Excessive Deficit Procedure concept. It is above the European scoreboard threshold, and falling. | até 2026-08-26 | viva | — |
| conteudo | Grande Lisboa · região | regioes | retirada | o bloco de cabeça de cada região saiu da primeira página com o estado `?ambito=regiao:<slug>` que o acendia (Emenda 21b, 27.08.2026); a página de uma região diz o nome como lugar e o tipo, «região NUTS II» |
| conteudo | Greater Lisbon · region | regioes | retirada | o bloco de cabeça de cada região saiu da primeira página com o estado `?ambito=regiao:<slug>` que o acendia (Emenda 21b, 27.08.2026); a página de uma região diz o nome como lugar e o tipo, «região NUTS II» |
| navegacao | Hover over a point to read the municipality. Keyboard: Tab to the map, arrow keys to move between neighbouring municipalities, Home to return to Évora. | grelha-2 | retirada | a leitura em voz alta do mapa saiu com os pontos da primeira página (Emenda 20a e 20c; bloco do mapa por distritos) |
| navegacao | Leitura breve | até 2026-08-26 | viva | — |
| conteudo | Madeira · region | regioes | retirada | o bloco de cabeça de cada região saiu da primeira página com o estado `?ambito=regiao:<slug>` que o acendia (Emenda 21b, 27.08.2026); a página de uma região diz o nome como lugar e o tipo, «região NUTS II» |
| conteudo | Madeira · região | regioes | retirada | o bloco de cabeça de cada região saiu da primeira página com o estado `?ambito=regiao:<slug>` que o acendia (Emenda 21b, 27.08.2026); a página de uma região diz o nome como lugar e o tipo, «região NUTS II» |
| navegacao | Nenhum concelho com esse nome. | até 2026-08-26 | viva | — |
| navegacao | No municipality by that name. | até 2026-08-26 | viva | — |
| navegacao | O Estado do País | até 2026-08-26 | viva | — |
| conteudo | O que o país tem a haver do exterior menos o que lhe deve: negativo quando deve mais do que tem a haver. | até 2026-08-26 | viva | — |
| conteudo | O índice compara o PIB per capita de cada território, medido em paridades de poder de compra, com a média da UE-27. Um valor abaixo da média significa menos poder de compra por pessoa; um valor acima, mais. | regioes | viva | — |
| conteudo | Painel Social Europeu | até 2026-08-26 | viva | — |
| navegacao | Passe o cursor sobre um ponto para ler o município. Teclado: Tab até ao mapa, setas para percorrer os municípios vizinhos, Home para voltar a Évora. | grelha-2 | retirada | a leitura em voz alta do mapa saiu com os pontos da primeira página (Emenda 20a e 20c; bloco do mapa por distritos) |
| conteudo | Península de Setúbal · região | regioes | retirada | o bloco de cabeça de cada região saiu da primeira página com o estado `?ambito=regiao:<slug>` que o acendia (Emenda 21b, 27.08.2026); a página de uma região diz o nome como lugar e o tipo, «região NUTS II» |
| conteudo | Portugal breaches 4 thresholds of the Macroeconomic Imbalance Procedure and meets 9 . | até 2026-08-26 | viva | — |
| conteudo | Portugal nos painéis europeus: os indicadores, os limiares e as fontes. | até 2026-08-26 | viva | — |
| conteudo | Portugal on the European scoreboards: the indicators, the thresholds and the sources. | até 2026-08-26 | viva | — |
| conteudo | Portugal ultrapassa 4 limiares do Procedimento dos Desequilíbrios Macroeconómicos e cumpre 9 . | até 2026-08-26 | viva | — |
| conteudo | Portugal · country | até 2026-08-26 | viva | — |
| conteudo | Portugal · país | até 2026-08-26 | viva | — |
| navegacao | Relance | até 2026-08-26 | viva | — |
| conteudo | Setúbal Peninsula · region | regioes | retirada | o bloco de cabeça de cada região saiu da primeira página com o estado `?ambito=regiao:<slug>` que o acendia (Emenda 21b, 27.08.2026); a página de uma região diz o nome como lugar e o tipo, «região NUTS II» |
| conteudo | The convergence rule | regioes | viva | — |
| conteudo | The index compares each territory’s GDP per capita, measured in purchasing power standards, with the EU-27 average. A value below the average means less purchasing power per person; a value above it, more. | regioes | viva | — |
| navegacao | The regions published on the convergence rule. | grelha-2 | retirada | a régua da convergência saiu da primeira página até haver a página das regiões (Emenda 18, consequência decidida a 25.08; bloco A da auditoria de UI e UX, `696b51a`) |
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

| classe | texto | bloco | estado | razão |
| --- | --- | --- | --- | --- |
| conteudo | A Direção-Geral | até 2026-08-26 | viva | — |
| conteudo | A Direção-Geral publica | até 2026-08-26 | viva | — |
| conteudo | A série anual da Direção-Geral das Autarquias Locais ainda não chegou a este mandato. | até 2026-08-26 | viva | — |
| conteudo | Lista anual da Direção-Geral das Autarquias Locais, que publica os dados das contas dos municípios. | até 2026-08-26 | viva | — |
| conteudo | O limite é fixado no artigo 52.º da Lei n.º 73/2013: uma vez e meia a média da receita corrente líquida dos três anos anteriores. | até 2026-08-26 | viva | — |
| conteudo | O traço fino é a dívida total que a Direção-Geral das Autarquias Locais publica para o concelho; a barra é a distância até ao limite legal do mesmo ano, que é o fio da direita. O índice mede uma contra o outro numa escala em que o teto é o valor permitido. | até 2026-08-26 | viva | — |
| conteudo | Série anual da Direção-Geral das Autarquias Locais, que publica os dados das contas dos municípios. Exclui dívidas não orçamentais e exceções legais. | até 2026-08-26 | viva | — |
| conteudo | The annual list of the local-government directorate, which publishes the municipalities’ accounts data. | até 2026-08-26 | viva | — |
| conteudo | The annual series of the local-government directorate, which publishes the municipalities’ accounts data. Excludes non-budgetary debt and legal exceptions. | até 2026-08-26 | viva | — |
| conteudo | The directorate-general | até 2026-08-26 | viva | — |
| conteudo | The directorate-general publishes | até 2026-08-26 | viva | — |
| conteudo | The limit is set by article 52.º of Lei n.º 73/2013: one and a half times the three-year average of net current revenue. | até 2026-08-26 | viva | — |
| conteudo | The local-government directorate’s annual series has not yet reached this term. | até 2026-08-26 | viva | — |
| conteudo | The thin line is the total debt the local-government directorate publishes for the municipality; the bar is the distance to the legal limit for the same year, which is the rule on the right. The index measures one against the other on a scale whose cap is the permitted value. | até 2026-08-26 | viva | — |
| conteudo | Sem linhas ainda. | grelha-2 | retirada | a ausência passou a dizer-se em três palavras, «Sem linha ainda.», e a forma longa saiu (item E4 do bloco dos 308, `8b2a260`) |
| conteudo | No rows yet. | grelha-2 | retirada | a ausência passou a dizer-se em três palavras, «Sem linha ainda.», e a forma longa saiu (item E4 do bloco dos 308, `8b2a260`) |
| conteudo | A referência do estudo | até 2026-08-26 | viva | — |
| conteudo | The study’s reference | até 2026-08-26 | viva | — |
| conteudo | 2602 afirmações · 330 calculadas · 2459 linhas de concelhos | vazios | viva | — |
| conteudo | 2602 claims · 330 calculated · 2459 municipality rows | vazios | viva | — |
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
| conteudo | 2459 linhas · 308 concelhos | vazios | viva | — |
| conteudo | 2459 rows · 308 municipalities | vazios | viva | — |

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
| navegacao | engine row: <linha> | grelha-2 | viva | — |
| navegacao | linha do motor: <linha> | grelha-2 | viva | — |
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
