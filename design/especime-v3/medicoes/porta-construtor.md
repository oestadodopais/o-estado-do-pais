# F1.1 · a porta da frente · relatório do construtor

*Ramo `porta-2026-09-03`, tirado de `origin/main` em `d8b14a88`. Construtor Claude
Opus 5, 03.09.2026. O bloco é o F1.1 do
`design/observatorio/PLANO-fiabilidade-2026-09-02.md` §3, com o brief
`design/observatorio/BRIEF-F1.1-porta-da-frente.md`. Sem travessões na prosa.*

## 1 · O resultado, em cinco linhas

As doze medidas de aceitação de A1 a A12 estão verdes nas duas edições, medidas
por uma régua nova (`tests/inicio/porta.mjs`) que corre sobre o `dist/` servido em
local. Os cinco estragos plantados de A17 foram vistos vermelhos e depois verdes.

**A 390 × 664 o primeiro cartão acabava a 726,7 px e acaba a 653,7 px**, com a
porta do concelho pelo meio, que antes não existia. A primeira página encolheu
134 px no telemóvel (6 941 → 6 807) e os 21 valores dos dois quadros da União
passaram a aparecer **uma vez** em vez de duas.

**Nenhum número novo entrou no sítio**, e isso está medido e não presumido: os
7 234 ficheiros de `dist/` rendem os mesmos 2 916 identificadores de linha antes e
depois, nenhum só antes e nenhum só depois, e `git diff --stat -- ledger/` não
tem uma linha.

**Nove réguas da casa foram reescritas para a forma decidida**, nenhuma
desligada, e a §7 diz célula a célula o que cada uma media e o que passa a medir.

**Três coisas ficaram por fazer**, e a §9 escreve-as com a razão: as duas frases
de contexto são um rascunho da casa e esperam as palavras do diretor; a posição
«1 de 21» não se rende nas faixas da região e do concelho; e a lista dos 29 nomes
ficou numa banda por baixo do mapa e não ao lado dele.

## 2 · As medidas de aceitação, de partida e de chegada

Tudo medido com a mesma régua, `tests/inicio/porta.mjs`, sobre duas construções: a
da árvore de partida (`d8b14a88`, guardada à parte e lida com `OEDP_DIST`) e a
desta. O comando é o mesmo nas duas leituras:

```
OEDP_DIST=<a construção de partida> node tests/inicio/porta.mjs --json antes.json
node tests/inicio/porta.mjs --json depois.json
```

| # | medida | antes (`d8b14a88`) | depois | estado |
| --- | --- | --- | --- | --- |
| A1 pt | 390 × 664: nome, manchete, cartão, selo e porta do concelho sem gesto | cartão até 726,7 px, selo até 714,3 px, **porta não existe** | tudo dentro: nome 97,4 · manchete 328,3 · **porta 477,7** · cartão 653,7 · selo 641,3 | ✓ |
| A1 en | o mesmo | cartão 710,9 · selo 698,5 · porta não existe | nome 97,4 · manchete 297,0 · porta 446,3 · cartão 641,1 · selo 628,7 | ✓ |
| A2 pt | altura de `/` a 390 | **6 941 px** | **6 807 px** (menos 134) | ✓ |
| A2 en | altura de `/en` a 390 | 6 890 px | 6 759 px (menos 131) | ✓ |
| A3 pt | os 21 valores selados uma só vez | **21 de 21 a duplicar** | 0 fora da conta | ✓ |
| A3 en | o mesmo | 21 de 21 a duplicar | 0 fora da conta | ✓ |
| A4 | «Comissão Europeia» em `/` · «European Commission» em `/en` | **0 · 0** | **2 · 2** | ✓ |
| A5 pt/en | as 29 unidades com nome visível e alvo ≥ 44 px a 390 | 29 com caixa e **29 invisíveis** (dentro da gaveta fechada) | 29 visíveis, 0 abaixo do alvo | ✓ |
| A6 | «Âmbito» e «Densidade» (e «Scope» e «Density») em `/` | 1 + 1 · 1 + 1 | **0 · 0** | ✓ |
| A7 | as duas fichas de «Lagoa» com distritos distintos | «Lagoa» e «Lagoa», **um texto só** | «Lagoa distrito de Faro» e «Lagoa Ilha de São Miguel» | ✓ |
| A8 | `<form>` em `/` com destino que existe | **0 formulários** | 1, `action="/municipios"` (200), `method="get"`; `/en` → `/en/municipalities` | ✓ |
| A9 | encontrar o concelho em ≤ 2 toques e ≤ 1 ecrã a 390 × 664 | **impossível**: o campo não é alcançável (a busca está numa gaveta fechada) | **2 toques**, sem rolar, chega a `/municipios/evora` | ✓ |
| A10 | «sem limiar» nos cartões e nas peças de `/` | 0 · 0 | 0 · 0 | ✓ (já estava) |
| A11 | a mobília acima do nome a 390 | **68 px** (teto 64) | **62 px** | ✓ |
| A12 | Regiões, Distritos e Áreas no menu | **faltam as três**, nas duas edições | as três nas duas edições | ✓ |

**A5 estava a dar um verde falso na régua da primeira redação, e o achado fica
escrito porque ele vale para toda a casa.** Num Chromium 148 o conteúdo de um
`<details>` FECHADO continua a ter caixa: os 29 nomes davam 54,1 × 44 px com a
gaveta fechada, porque a implementação nova esconde o conteúdo por
`content-visibility` e não por `display`. Uma célula que medisse caixas dizia «29
nomes com alvo» sobre uma lista que o leitor não vê. A régua passou a perguntar
`checkVisibility({ contentVisibilityAuto: true })`, e a leitura de partida ficou
vermelha, que é o que ela devia ter estado desde o princípio. A mesma correção
entrou na `F10b` de `tests/inicio/faixa.mjs`, que media o mesmo estado da mesma
maneira.

## 3 · O que se construiu, item a item do brief §1

**1 · A frase de contexto por painel.** Duas frases, uma por painel, impressas
uma vez antes dos cartões, declaradas em `CONTEXTO_DOS_PAINEIS`
(`src/data/figuras.mjs`) na forma que o F0.9 fixou. O cabeçalho da constante
escreve, afirmação a afirmação, a origem de cada uma com o comando que a
confirma; a §5 deste relatório repete-a. Nenhuma fala da casa nem de confiança, e
nenhuma traz um algarismo.

**2 · A faixa impressa uma vez.** O valor de cada medida saiu da peça do painel
(`Peca.astro`, propriedade `valor`) e da linha do Painel Social
(`ListaSocial.astro`), e fica no cartão da faixa, que é a porta que leva o leitor
à leitura. O painel de baixo continua a ser a leitura breve: a palavra do estado,
o limiar publicado e de que lado dele o valor está, o nome, a unidade, a
definição, a régua e o recibo. `Peca.astro` recebe a propriedade e não a regra:
`MunicipioView` e `RegiaoView` não a passam e ficam como estavam, porque as suas
faixas são do F1.2.

**3 · A porta para o concelho no primeiro ecrã.** A busca dos 308 saiu da gaveta
ao lado do mapa e subiu para debaixo da manchete, por uma ranhura nova de
`Cabeca.astro` (`porta`). É o campo e não uma ligação, por uma razão medida: a
tarefa (a) da ronda tem de caber em dois toques, e uma ligação que leva ao campo
gasta o primeiro deles a chegar ao sítio onde a tarefa começa.

**4 · O mapa com os nomes ao lado, abertos.** A gaveta dos nomes chega aberta
(`Gaveta.astro`, propriedade `aberta`), com os 29 visíveis e cada um com o seu
alvo de 44 px abaixo de 1024. Continua a ser uma gaveta e continua a fechar sem
guião. **Onde ela ficou não é onde o brief a pedia**, e a §9 escreve a medição que
o obrigou.

**5 · «1 de 21» e o separador.** A posição vai em CADA cartão, na fila que a
palavra de estado já ocupava, e por isso não custa uma fila ao cartão. Vai em cada
cartão e não numa linha por cima da faixa porque uma linha única teria de mudar de
algarismo enquanto o leitor rola, e o guião desta página não compõe números:
escrita em cada cartão é sempre verdadeira, e é verdadeira sem guião nenhum. Os
dois algarismos são `data-nonledger="numeracao"`, que é o motivo do registo para a
numeração de secções e de instrumentos; o total é o comprimento da lista que a
faixa rende, contado uma vez na vista. O separador entre os dois painéis é um
`<hr class="paineis-separador">`, porque é uma separação estrutural e não
decoração.

**6 · «Âmbito» e «Densidade» fora da página.** A linha de comando saiu inteira. O
âmbito vive no menu (item 11); a densidade vive no `<summary>` de cada peça, que é
o que ela abria. O estado `?densidade=leitura` continua a resolver, que é o que a
Emenda 7 exige de um endereço partilhável; o que desapareceu foi a maneira de o
escrever a partir da página. Os dois campos do reencaminhamento das regiões
desceram do comando para a raiz do estado, `[data-inicio]`, e
`public/js/inicio.js` lê-os de lá quando o comando não existe.

**7 · O distrito na ficha das duas Lagoas.** `Pesquisa.astro` escreve o distrito
só onde o nome se repete, que é a mesma regra de `coberturaDistingue()`: uma
etiqueta desenha-se quando há outra de que se distinga. A palavra é a da Carta,
pela regra da I18 que a casa já tinha (`eIlha()`), e vai marcada `data-lugar`.

**8 · «sem limiar» fora dos cartões dos concelhos.** Já estava a zero na árvore de
partida, e continua: os oito cartões do Painel Social não levam palavra de estado
porque o quadro não publica limiar nenhum, e as treze peças do Procedimento têm
todas limiar.

**9 · O selo fora da frase da manchete dos concelhos.** Nada a fazer neste bloco:
a manchete dos concelhos é da `MunicipioView`, que é do F1.2 e não se toca. **A
conferência que o brief pede está feita**: a manchete dos 308 diz a população, e o
número dela resolve numa linha do livro-razão. O portão de HTML confere as 7 234
páginas e passa a 0, e a contagem de identificadores da §6 mostra que nenhum
identificador entrou nem saiu.

**10 · A mobília reduzida a uma linha no telemóvel.** Abaixo de 641 px a mobília
mostra uma das três leituras, a data em que o painel europeu foi reconferido, que
é a que governa os números desta página. A agenda sai porque o próprio achado D6 o
pede («a contagem da agenda repete-se em dezassete sítios») e a sua página está no
menu; o sinal das fontes sai porque a regra dele vive em `/metodo#releitura`, que
o menu alcança. **Saem do telemóvel e não do sítio**: a partir de 641 px as três
voltam, com as mesmas cadeias e as mesmas portas, e nenhuma sai do documento em
largura nenhuma.

**11 · Regiões, Distritos e Áreas no menu.** A fila do menu passa de oito a onze
posições, e a §1.51 fica emendada com a razão escrita no `Masthead.astro`: a fila
era de oito porque o sítio tinha oito índices, e passou a ter onze.

**12 · A busca como `<form>` com destino.** `<form action="/municipios"
method="get">`, com um botão de submissão a sério. Sem guião, escrever e submeter
leva ao índice dos 308, que existe e é a página que responde à mesma pergunta. Com
guião, a fila de resultados acende-se e filtra, como sempre fez.

**13 · «308 ■ fonte» com substantivo.** Já estava: a legenda do mapa lê-se «308
concelhos · CAOP 2025 ■ fonte» desde a Emenda 17, e o substantivo está na cadeia
`inicio.mapa.linha`. Conferido no HTML construído e não presumido.

**14 · A coluna direita vazia a 1 280 antes do mapa.** Fechada, e medida por
`tests/inicio/lista.mjs` L11 e L13: o mapa vai do topo da manchete ao fundo da
legenda, com 0,0 px de ar vertical dentro da caixa, e a folga da grelha contra a
coluna do mapa está dentro do limite de 60 px que a régua fixa.

**15 · A régua da casa a medir também 390 × 664.** A régua nova mede A1, A9 e A11
a 390 × 664, que é o telemóvel pequeno, e as capturas incluem essa altura nas duas
edições.

## 4 · As cadeias novas, com a chave e a origem de cada facto

Quatro cadeias visíveis novas em `src/i18n/strings.mjs`, todas nas duas edições, e
duas frases em `src/data/figuras.mjs`.

| chave | pt | en | classe | origem |
| --- | --- | --- | --- | --- |
| `nav.regioes` | Regiões | Regions | navegação | o nome da família de páginas que existe desde 28.08.2026 |
| `nav.distritos` | Distritos | Districts | navegação | o mesmo, para os distritos e ilhas da Carta |
| `ambito.pesquisaSubmeter` | Procurar | Search | navegação | o comando do formulário novo |
| `inicio.faixa.de` | « de » | « of » | (não é frase) | o separador de «1 de 21», dentro do `<div class="cartao-topo">`, que a régua da voz não recolhe, como já não recolhia a palavra de estado ao lado |
| `CONTEXTO_DOS_PAINEIS.pdm` | frase do painel do Procedimento | idem | conteúdo | ver abaixo |
| `CONTEXTO_DOS_PAINEIS.social` | frase do Painel Social | idem | conteúdo | ver abaixo |

**As três primeiras entram no inventário da voz?** Não: `nav.regioes` e
`nav.distritos` são texto de âncoras (a régua não recolhe um bloco cujo texto está
todo dentro de um `<a>`), e `pesquisaSubmeter` é o texto de um `<button>`, pela
mesma regra. As quatro cadeias das frases de contexto entram, e entraram: a secção
«Bloco `porta`» do `INVENTARIO-FRASES.md`, com a entrada correspondente em
`critica/REVISOES-DO-INVENTARIO.md`. Quatro linhas passaram a `retirada` com a
razão escrita: «Portugal · país» e «Portugal · country» (o rótulo saiu da cabeça
do país) e «Um concelho pelo nome» e «A municipality by name» (a gaveta da busca
deixou de existir).

### As duas frases, e de onde vem cada afirmação

> **pt, painel do Procedimento** · «Os indicadores do painel do Procedimento
> relativo aos Desequilíbrios Macroeconómicos, com os limiares que o Procedimento
> publica. Os valores são do Eurostat, confirmados contra a Comissão Europeia,
> SWD(2026) 222.»
>
> **pt, Painel Social** · «Os indicadores do Painel Social Europeu, que não
> publica limiares. Os valores são do Eurostat, confirmados contra a Comissão
> Europeia, SWD(2026) 222.»

| afirmação | onde está escrita | como se confere |
| --- | --- | --- |
| «do painel do Procedimento relativo aos Desequilíbrios Macroeconómicos» | o campo `note` das treze linhas | `grep -l "Limiar do Procedimento" ledger/claims/*.yml` → 13 ficheiros, que são os treze `claim` de `FIGURAS_PDM` |
| «com os limiares que o Procedimento publica» | o mesmo campo `note`, e `ledger/allowlist.yml`, motivo `limiar-do-quadro` | a nota escreve o limiar de cada uma («60%», «-35%», «-4/+6%», «-0.2pp») |
| «Os valores são do Eurostat» | o campo `source` das 21 linhas | medido: as 21 dizem `Eurostat`, e nenhuma diz outra coisa |
| «confirmados contra a Comissão Europeia, SWD(2026) 222» | o campo `note` das 21 linhas | «Valor confirmado contra a Comissão Europeia, SWD(2026) 222 (Relatório por País 2026 — Portugal): \<o valor\>», nas 21 |
| «do Painel Social Europeu» | `ResearchHub/indicators/convergence.md` §2, coluna «Social SB», e a Emenda 16 | é o registo que coloca cada uma das oito na lista, e está escrito no cabeçalho de `FIGURAS_SOCIAL` |
| «que não publica limiares» | a Emenda 16 e `convergence.md` §5 | «Thresholds: published, numeric, legally grounded (MIP) \| None fixed anywhere» |

**«SWD(2026) 222» É UMA TRANSCRIÇÃO CONFERIDA, e não uma dispensa.** O
identificador traz algarismos e não é uma medição: é a morada de um documento. Vai
por `data-verbatim="swd-2026-222"`, que é o mecanismo n.º 2 do cabeçalho de
`ledger/allowlist.yml`, e o portão compara o que a página rende com o que
`src/data/verbatim.mjs` regista, carácter a carácter. Não se acrescentou um motivo
novo à lista de exceções, e nenhum motivo existente foi alargado. `Frase.astro`
ganhou o pedaço `{ verbatim: '<chave>' }` para isto, e o texto não se escreve na
chamada: vem do registo, para que não haja duas cópias da mesma transcrição.

**O que ficou de fora das frases, e porquê.** O «porquê estes oito» que o brief
pedia não entra: a razão de estarem ali é a coluna «Social SB» de um documento do
motor, e a única coisa que ela autoriza a dizer é que o quadro os coloca lá. A
posição face à média da União também não entra, e é a mesma decisão do F0.9:
nenhuma média da União existe como linha do livro-razão, e uma comparação contra
um valor que a página não tem é a classe de afirmação que aquele bloco veio tirar.

## 5 · A tarefa (a) da ronda, toque a toque

Medida a 390 × 664, nas duas edições, pela célula A9 da régua, que faz cliques a
sério e confere que o alvo estava dentro do primeiro ecrã quando o toque
aconteceu. As capturas de cada passo estão em `capturas/porta-2026-09-03/`.

| passo | o que acontece | captura |
| --- | --- | --- |
| 0 | a página chega: o campo da busca está no primeiro ecrã, a 477,7 px do topo | `pt-tarefa-0-chegada.png` |
| 1 | **toque 1** no campo | `pt-tarefa-1-toque-no-campo.png` |
| — | escreve-se «Évora»; a fila de resultados acende-se por baixo do campo | `pt-tarefa-2-escrito.png` |
| 2 | **toque 2** no resultado, que é uma ligação | `pt-tarefa-3-chegou.png` |
| — | chega a `/municipios/evora` (e a `/en/municipalities/evora` na edição inglesa) | |

Dois toques, sem rolar. Na árvore de partida a tarefa não tinha percurso nenhum:
o campo vivia numa gaveta fechada ao lado do mapa, a 1 428 px do topo, e a régua
media «o elemento não é visível».

## 6 · A prova de que não entrou um número novo (A13)

```
git diff --stat -- ledger/                    → sem saída
```

E o inventário de valores selados do `dist/` inteiro, antes e depois, contado por
um comando próprio que percorre os ficheiros HTML e conta `data-claim`:

| | antes (`d8b14a88`) | depois |
| --- | --- | --- |
| páginas varridas | 7 234 | 7 234 |
| identificadores distintos | 2 916 | 2 916 |
| identificadores só de um lado | — | **nenhum**, nos dois sentidos |
| ocorrências totais | 26 314 | 26 272 |

As 42 ocorrências que saíram são os 21 valores dos dois quadros, cada um deixado
de render uma segunda vez, nas duas edições. Nenhum identificador entrou, nenhum
saiu.

## 7 · As réguas da casa: o que cada uma media e o que passa a medir

Nove réguas mudaram. **Nenhuma foi desligada e nenhuma foi enfraquecida sem razão
escrita ao lado da célula**; cada uma leva no código o parágrafo que diz o que
media, porque é que a coisa medida mudou, e o que fica a ser exigido no lugar.

| régua · célula | media antes | passa a medir |
| --- | --- | --- |
| `correcoes-a` A2 | um comando com «País», «Região» e «Concelho» | as quatro camadas do território no menu, um só caminho, e nenhum comando de estado na página |
| `correcoes-a` A1 | «Concelho» revela a pesquisa dentro do ecrã | a busca inteira no primeiro ecrã **sem gesto**, com o campo a receber o foco e o formulário com destino |
| `correcoes-a` A7 | a mobília com **duas** leituras | três leituras no documento e **uma à vista** a 390 (a célula estava vermelha desde 01.09, quando o corredor acrescentou a terceira; a leitura de partida mediu-a vermelha) |
| `faixa` F10a | **duas** gavetas do mapa, **fechadas** | uma gaveta, **aberta**, com os 29 e o alvo da largura, e a busca fora dela |
| `faixa` F10b | a gaveta abre com o guião desligado | chega **aberta**, fecha e volta a abrir sem guião (duas voltas), e a visibilidade pergunta-se ao navegador |
| `faixa` F12 | as três camadas com rótulo declarado | o mesmo, com o rótulo exigido só onde ele separa alguma coisa (região e concelho) |
| `lista` L1 | a lista **antes** do mapa no documento | a lista **depois** dele, com a ordem do documento igual à do ecrã |
| `lista` L2 | a coluna das duas gavetas ao lado do mapa | a legenda do mapa na banda da cabeça (a exigência «ao lado» fica a 1280 e a 1440, onde ela vale) |
| `lista` L9 | duas formas: rede em linha abaixo de 1024, coluna acima | uma forma só, a rede em linha, em todas as larguras |
| `lista` L12 | a legenda **por baixo** dos nomes | a legenda **por cima** da banda dos nomes, alinhada com ela |
| `mapa-navegacao` N3 (com guião) | «Concelho» abre a pesquisa | a busca à vista sem gesto, campo alcançável, formulário com destino |
| `mapa-navegacao` N3 (sem guião) | os comandos são ligações para páginas que existem | a busca é um formulário com destino, e o destino responde 200 |
| `areas` M6 | «Áreas» no comando e no rodapé | «Áreas» no **menu** e no rodapé |
| `matriz` ordem do teclado | comando → painel → portas | porta do concelho → painel → portas |
| `matriz` mudanças de estado | dois cliques em comandos | os estados resolvem-se pelo **endereço**, e a página não tem comando de estado nenhum |
| `matriz` densidade global | o comando global abre as treze | o endereço `?densidade=leitura` abre as treze |
| `matriz` caixa vazia | a caixa vazia mostra os concelhos com página | a caixa vazia **não mostra nada** |
| `matriz` 2i·5 | o espaço activa os comandos de âmbito e de densidade | o espaço abre a peça e não rola, e o que activa é um comando a sério (`<button>`, `<summary>`), com zero ligações a fingir de botão |
| `matriz` 2i·1 | o `href` do comando «Região» | o índice das regiões na raiz do estado e no menu |
| `matriz` 2l lista social | oito linhas com oito valores | oito linhas **sem o valor repetido**, com o selo de 44 px |
| `matriz` 2m | a gaveta da busca abre por baixo do mapa | a busca está à vista e o mapa fica onde estava |
| `ListaDosNomes` (folha) | o par de estado enraizado em `.cabeca-grelha` | enraizado em `:root`, porque a lista saiu da grelha |

**A caixa vazia, e porque é que isto é uma correção e não uma perda.** A regra de
2026-08 era «com a caixa vazia mostram-se os concelhos que têm página, hoje um,
Évora», e a nota ao lado dela, em `public/js/inicio.js`, dizia porquê: «uma
pesquisa que abre com oito nomes que ninguém pediu diz que aqueles oito são
especiais, e não são: são os primeiros da Carta». Com os 308 construídos a
condição «tem página» deixou de separar seja o que for, e a caixa vazia passou a
mostrar exactamente esses oito primeiros, que é o que a nota proibia. Com a busca
no primeiro ecrã custava também 168 px a quem não pediu nada. `/municipios` e
`/livro-razao/concelhos` ficam como estavam, e a razão está no guião: lá a fila
abre por baixo de uma lista dos 308 que já está na página.

## 8 · Os estragos plantados (A17), vermelhos e depois verdes

`node tests/inicio/porta.mjs --vermelhos`, saída **0**. Cada planta exige três
coisas, como as réguas da casa: **verde antes** (as células que ela nomeia passam
sem ela), **o HTML mudou** (a transformação dá bytes diferentes) e **vermelho
depois** (TODAS as células nomeadas caem, e não só uma).

| planta | células | verde antes | html mudou | vermelho depois |
| --- | --- | --- | --- | --- |
| um cartão sem selo | A1.pt | sim | sim | A1.pt vermelho |
| um segundo cartão com o mesmo valor (a cópia) | A3.pt | sim | sim | A3.pt vermelho |
| a frase de contexto sem «Comissão Europeia» | A4.pt, A4.en | sim | sim | as duas vermelhas |
| a busca sem `action` | A8.pt, A8.en | sim | sim | as duas vermelhas |
| uma unidade do mapa sem nome | A5.pt, A5.en | sim | sim | as duas vermelhas |

Reposta a construção, as 24 células voltam a verde: `porta ✓ 24 de 24 célula(s) ·
plantas ✓`.

## 9 · O que ficou por fazer, e porquê

**1 · As duas frases de contexto são um rascunho da casa.** O plano §7 dá-as como
texto do diretor; ele não as escreveu e mandou não perguntar. Ficam escritas só
com factos que uma linha do livro-razão ou uma decisão registada já contém (§4). O
«porquê estes oito» não entra em nenhuma das duas, e a razão está na §4.

**A linha dos pendentes não foi escrita por este ramo, e é de propósito.**
`design/especime-v3/PENDENTES-DO-DIRETOR.md` não está na lista de ficheiros do
bloco (brief §3) e é do lugar de direção, que o tem aberto na árvore principal:
duas mãos no mesmo ficheiro dariam um conflito por uma linha. A linha a escrever é
esta, e fica aqui para quem funde a copiar:

> **As duas frases de contexto dos painéis da primeira página.** O F1.1 escreveu
> um rascunho da casa, só com factos que as linhas do livro-razão e a Emenda 16 já
> contêm (`CONTEXTO_DOS_PAINEIS` em `src/data/figuras.mjs`, com a origem de cada
> afirmação no cabeçalho). O plano §7 dá-as como texto do diretor. Destrava:
> substituí-las pelas palavras dele, e dizer se o «porquê estes oito» pode ser
> dito e com que palavras.

**2 · «1 de 21» não se rende nas faixas da região e do concelho.** A faixa serve
três páginas e a posição é do bloco da porta da frente, que é o da primeira. Uma
região tem outra lista e outro número, e escrever ali «de 21» seria um algarismo
certo noutra página e errado naquela. As páginas de região e de concelho são do
F1.2, que corre em paralelo e é dono delas.

**3 · A lista dos 29 nomes ficou por baixo do mapa, e não ao lado dele.** O item 4
do brief pede «o mapa com os nomes ao lado, abertos». Aberta e dentro da coluna
esquerda da cabeça, a lista media, a 1280: **coluna esquerda 1 005,6 px contra uma
coluna do mapa de 689,0 px, e 316,6 px de papel liso na metade direita, por baixo
do desenho**. É o mesmo vazio que o achado D7 nomeia, mudado de sítio, e a régua
`correcoes-a` (item A8) apanha-o. Não há arranjo de duas colunas em que 600 px de
lista aberta não criem um vazio numa das duas: a lista passa a uma banda de
largura inteira logo por baixo da cabeça, fora da grelha. Com isso o alinhamento
da §1.84 fica intacto (o mapa vai do topo da manchete ao fundo da legenda, medido
pela L11 e pela L13), os 29 nomes ficam à vista com o seu alvo a todas as
larguras, e a página não cresce com o vazio. **A forma nova é decisão do diretor**
pelo `BRIEF-forma-dos-dominios.md` §4, que escreve «a cabeça a 1280 mantém o
alinhamento da §1.84 ou o diretor decide a forma nova»; fica registada aqui com a
medição que a obrigou, e a régua foi reescrita para ela e não desligada.

**4 · O item 9 do brief (o selo fora da frase da manchete dos concelhos) não se
constrói neste bloco**, porque a manchete dos concelhos vive em
`src/views/MunicipioView.astro`, que é do F1.2. A conferência que o brief pede
está feita e está na §3.

**5 · Duas células de outras réguas continuam vermelhas, e eram-no antes deste
bloco.** `tests/linha/correcoes-b.mjs` (item B10, texto abaixo de 12 px e alvos
pequenos nas páginas de linha e de concelho) e `tests/texto/correcoes-c.mjs` (item
C1, o título do documento a 390) falham na árvore de partida e nesta, e nenhuma
das duas corre sobre uma rota que este bloco toca. Conferido correndo as duas
sobre a construção de partida. Na `matriz`, as duas células vermelhas que ficam
são as mesmas de antes: «a linha da reconferência» e «a língua de um título
citado» (a exceção aprovada da §1.91, decisão 6). Uma célula que estava vermelha
na partida passou a verde sem este bloco a procurar: «2l · Emenda 15 · zero frases
de autorreferência em todas as rotas medidas».

## 10 · O contraste das peças novas (A16)

Medido no navegador, sobre as cores computadas, nos dois temas. O teto é 4,5:1
para texto e 3:1 para objetos de interface.

| peça | corpo | claro | escuro |
| --- | --- | --- | --- |
| `.painel-contexto` (a frase de contexto) | 15 px | 16,39:1 | 15,38:1 |
| `.cartao-posicao` («1 de 21») | 12 px | 6,24:1 | 9,52:1 |
| `.pesquisa-distrito` (o distrito das Lagoas) | 12 px | 6,24:1 | 9,52:1 |
| `.pesquisa-submeter` (o botão «Procurar») | 14 px | 16,39:1 | 15,38:1 |
| `.pesquisa-rotulo` (o rótulo da busca) | 13 px | 6,24:1 | 9,52:1 |
| `.paineis-separador` (o fio entre os painéis) | objeto | 3,47:1 | 5,80:1 |

**Nenhuma cadeia nova entrou abaixo de 12 px.** A primeira redação pôs «1 de 21» a
11,5 px, copiando a palavra de estado ao lado, e a régua `correcoes-a` (item A9)
apanhou-a: o achado D4 conta texto abaixo de 12 px como defeito, e uma cadeia nova
não entra abaixo do chão que a casa está a subir. Subiu para 12 px. E o pré-
existente também desapareceu do telemóvel: as duas cadeias de 11 px que a régua
via na árvore de partida eram o sinal das fontes, que abaixo de 641 px deixou de
se render.

## 11 · Os alvos de toque, e um defeito que a régua apanhou

A primeira redação rendeu o total de «1 de 21» com `<ValorDaProva>`, que é uma
ligação, dentro da fila do estado do cartão. O cartão inteiro já é um alvo
(`.cartao-porta` cobre as três primeiras filas), e a régua `correcoes-a` (item
A10) contou **41 pares de áreas sobrepostas** a 390. Um alvo sobreposto não é um
alvo maior: é uma porta que abre a coisa do lado.

A saída foi tirar a ligação e deixar os dois algarismos como numeração declarada,
que é o que eles são. Com isso caiu também a chave da prova `faixa_cartoes`, que a
primeira redação tinha acrescentado a `src/lib/prova.mjs` e a
`scripts/gate-html.mjs`: uma chave da prova rende-se dentro da sua porta, e a
porta desta seria a própria faixa, dentro do cartão. Os dois ficheiros ficaram
como estavam.

## 12 · Os portões e as réguas, com os códigos de saída lidos dos registos

Cada comando escreveu o seu código de saída num ficheiro à parte, lido a seguir.

```
npm run build      → 0
npm run verify     → 0
npm run typecheck  → 0
```

E as doze réguas de `tests/inicio/`, todas a 0:

```
app 0 · areas 0 · capturas 0 · correcoes-a 0 · faixa 0 · lista 0
mapa-distritos 0 · mapa-navegacao 0 · matriz 0 · regioes 0 · rotulo 0 · porta 0
```

`tests/inicio/mapa-distritos.mjs` estava a **1** na árvore de partida (células M7 e
M8, «medir-defeitos: nada por classificar» e «check:voz verde») e está a 0 nesta.

## 13 · Onde estão as capturas

`design/especime-v3/capturas/porta-2026-09-03/`, 32 ficheiros, só PNG, sem dados
pessoais: as seis larguras do brief (390 × 664, 390 × 844, 768, 1024, 1280, 1440)
nas duas edições, cada uma em página inteira e em primeiro ecrã, mais os quatro
passos da tarefa (a) da ronda em cada edição.

## 14 · O diff

Os ficheiros do sítio, das réguas e do registo, sem este relatório e sem as
capturas:

```
git diff --stat d8b14a88 -- src/ public/ tests/ design/especime-v3/INVENTARIO-FRASES.md \
  design/especime-v3/critica/REVISOES-DO-INVENTARIO.md
```

Ao todo, com o relatório e as capturas, 57 ficheiros, 1 554 linhas acrescentadas e
258 tiradas.
