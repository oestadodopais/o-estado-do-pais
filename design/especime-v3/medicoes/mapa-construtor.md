# F1.1d · o mapa que cresce, e o nome ao lado

*Construtor Claude Opus 5, 07 e 08.09.2026, ramo `mapa-2026-09-07` (tirado de
`7dfd36b7`, a cabeça do F1.1c depois de fundir `main`). Brief:
`design/observatorio/BRIEF-F1.1d-os-nomes-do-mapa.md`. Uma passagem. Sem
travessões na prosa.*

## O que ficou construído

O mapa da primeira página passa a ter **dois níveis**. O nível do país desenha as
**nove regiões NUTS II**, cada uma a ligação da sua página; ao tocar, clicar ou
premir Enter numa delas o desenho cresce e mostra **os concelhos dessa região**,
lidos de um ficheiro que a própria área nomeia. O **lugar do nome** é um elemento
fixo, com `aria-live="polite"`, que diz o nome da área apontada e leva a porta
«Abrir →» para a página dela; vazio diz «Toque numa região» ou «Passe o rato por
uma região», e no nível da região as duas frases dos concelhos. «Voltar ao país»
sobe um nível, e o endereço regista o nível em `#regiao=<slug>`.

As **29 unidades da Carta** saem do desenho e não do sítio: continuam a ter
página, a estar no menu e a estar na lista dos nomes, agora com as nove regiões à
frente delas e a gaveta fechada. A **página de um distrito** ganha o mesmo lugar
do nome para os seus concelhos (item 7); a de uma região não o ganha, e a razão
está medida mais abaixo.

## A geometria: de onde vem, e porque não é a união dos 308

A geometria das nove regiões é **calculada na construção e nunca escrita à mão**:
`scripts/mapa-regioes.mjs` é o primeiro passo de `npm run build`. Lê três fontes,
todas já no repositório:

| fonte | o que dá |
| --- | --- |
| `mapa/distritos/<unidade>.json` | os 308 concelhos da CAOP 2025, cada unidade na sua grelha local |
| `mapa/pais.json` | as 29 unidades no campo do desenho, com a caixa de cada uma |
| `public/dados/caop-2025-municipios-*.csv` | a coluna `nuts2` de cada concelho, tal como a Carta a escreve |

**A união não se faz dos 308 concelhos no campo do país, e isso foi medido.** Os
concelhos de duas unidades vizinhas não ladrilham entre si: cada unidade foi
desenhada na sua grelha e a mesma fronteira ficou arredondada de duas maneiras,
com um desvio até **1,4 u** no campo do país. A primeira forma deste gerador fazia
exactamente isso e o resultado está na primeira captura que tirei: as fronteiras
dos distritos ficavam desenhadas por dentro de cada região.

As **29 unidades de `mapa/pais.json` ladrilham ponto por ponto** (3 781 das 5 537
arestas têm a gémea inversa, medido), e por isso:

* 23 das 29 unidades estão inteiras dentro de uma região, e para essas a peça é o
  próprio caminho do artefacto;
* **6 repartem-se** por duas regiões (Aveiro, Guarda, Leiria, Lisboa, Setúbal e
  Viseu, medido), e cada uma tem **uma** linha de corte, que é a fronteira entre
  os concelhos de uma região e os da outra, exacta na grelha local;
* a linha de corte leva-se ao campo do país e as suas duas pontas projectam-se no
  caminho do artefacto (projecção máxima **1,275 u**); a unidade parte-se em duas
  ao longo dela, e as duas pontas entram como vértices nas unidades vizinhas para
  que as arestas continuem a poder anular-se.

Feito isso, as peças de uma região anulam as fronteiras interiores umas com as
outras pela conta das arestas, e o que sobra é o contorno da região **sem uma
costura por dentro**. A tolerância da afinação é a que o manifesto do motor
declara (`erro_px` 0,25 a `coluna_px` 490), convertida para as unidades de cada
campo: **3,1071 u** no campo do país.

O ficheiro é **determinístico**: não leva data nem hora, leva o sha256 de cada
fonte lida. `npm run mapa:regioes` escreve, `npm run mapa:regioes -- --verifica`
confere sem escrever (está na cadeia do `verify`), e uma diferença no `git status`
depois de uma construção é sempre uma fonte que mudou.

**Pesos medidos:** `src/data/mapa-regioes.gerado.json` 26 776 B (os nove caminhos
somam 25 KB, contra 30,6 KB dos 29 caminhos do artefacto que substituem);
`public/dados/mapa/regiao-*.json` 237 116 B nos nove ficheiros, que o guião só
pede quando o leitor abre uma região.

## As nove medidas de aceitação

O comando de todas as células da régua nova é o mesmo:

```
node tests/inicio/mapa-regioes.mjs           # 21 de 21 células passam
node tests/inicio/mapa-regioes.mjs --vermelhos   # 6 de 6 plantas apanhadas, saída 0
```

### P1 · os alvos · **NÃO CUMPRIDA, e o número está aqui**

`node tests/inicio/mapa-regioes.mjs` (células P1a, P1b e P1c). O alvo de uma área
é o **maior quadrado inscrito à volta do seu ponto representativo** (I82),
rasterizado a 2 px com `isPointInFill` no próprio navegador.

**As nove regiões, a 390** (desenho 390 × 514 px): 3 de 9 chegam aos 44 px,
mediana 18 px.

| região | inscrito a 390 | inscrito a 1280 |
| --- | --- | --- |
| Centro | 76 px | 104 px |
| Alentejo | 72 px | 96 px |
| Norte | 62 px | 84 px |
| Oeste e Vale do Tejo | 34 px | 44 px |
| Algarve | 18 px | 24 px |
| Grande Lisboa | 16 px | 22 px |
| Península de Setúbal | 16 px | 22 px |
| Madeira | 10 px | 12 px |
| Açores | 2 px | 2 px |

A 1280 (desenho 518 × 683 px) chegam 4 de 9, mediana 24 px.

**Os 308 concelhos, a 390, no nível em que se tocam:** 308 de 308 medidos, todos
com o ponto dentro da sua área, **20 chegam aos 44 px**, mediana 16 px.

| região | concelhos | chegam aos 44 px | mediana | menor |
| --- | --- | --- | --- | --- |
| Grande Lisboa | 9 | 5 | 46 px | 20 px |
| Península de Setúbal | 9 | 3 | 34 px | 16 px |
| Alentejo | 47 | 6 | 28 px | 10 px |
| Algarve | 16 | 2 | 24 px | 8 px |
| Oeste e Vale do Tejo | 34 | 2 | 20 px | 4 px |
| Centro | 77 | 2 | 16 px | 6 px |
| Madeira | 11 | 0 | 14 px | 8 px |
| Norte | 86 | 0 | 14 px | 2 px |
| Açores | 19 | 0 | 2 px | 0 px |

**A medida do brief não se cumpre, e a razão é geométrica.** Levar o menor
concelho com lado medível (São João da Madeira, 2 px no Norte) aos 44 px pediria
um desenho de **8 580 px de largura**, que são 22 telemóveis lado a lado. O que o
bloco entrega é uma subida grande e não a meta: antes deste bloco o mapa da
primeira página desenhava as 29 unidades, e **nenhuma delas chegava aos 44 px a
390** (medido no F1.1, célula M2 da régua dos distritos, hoje retirada); os 308
concelhos não estavam desenhados em lado nenhum da primeira página, e o que havia
antes disso eram 308 pontos de 7,35 px (Emenda 19b). Hoje há três regiões acima
dos 44 px e 20 concelhos, com a mediana dos concelhos a 16 px.

**Quem responde pelas áreas abaixo de um dedo é a rede dos nomes**, que é a mesma
decisão da Emenda 20c e da I82, e a célula P1c mede-a: a lista fechada dos nomes
tem **9 regiões e 29 unidades**, e o índice dos concelhos tem **308 ligações**.

> **Para o lugar de direção.** O item 5 do brief manda a lista dos nomes ficar
> fechada, e o F1.1 tinha-a aberto por uma razão que continua a valer para seis
> das nove regiões: «fechada, ela existia para o teclado e para quem ouve e não
> existia para quem vê». Construí o que o brief manda (fechada) e deixo a medida
> aqui: a 390, seis das nove regiões estão abaixo dos 44 px, e a rede que responde
> por elas está a um toque no `<summary>`. É uma decisão de forma e é do lugar de
> direção.

### P2 · o nome no lugar

`node tests/inicio/mapa-regioes.mjs` (P2a, P2b e P2c, nas duas edições). Nove de
nove regiões dizem o seu nome ao passar o rato e ao focar com o teclado, cada uma
com a porta da sua página; numa amostra de 30 concelhos (dez em cada uma das três
regiões maiores) os 30 dizem o nome da Carta e levam a porta certa; e na página de
um distrito os 16 concelhos de Lisboa fazem o mesmo, sem porta de voltar.

### P3 · o primeiro toque nunca navega

`node tests/inicio/mapa-regioes.mjs` (P3a a P3d). Com o **dedo** (contexto com
`hasTouch`): o toque numa região cresce-a sem navegar (nível «regiao», 86
concelhos, endereço `/#regiao=norte`, nome «Norte» com a porta `/regioes/norte`),
o primeiro toque num concelho diz «Montalegre» e deixa o endereço em `/`, o
segundo abre `/municipios/montalegre`. Com o **rato**: «Voltar ao país» volta ao
nível de cima e o botão de voltar do navegador desfaz o que o toque escreveu. A
porta do lugar do nome abre `/regioes/algarve`. Numa página de distrito, o
primeiro toque diz «Sintra» e o segundo abre `/municipios/sintra`.

**A distinção entre o dedo e o rato é medida e não suposta.** No Chromium, um
toque dá `pointerover:touch`, `pointerdown:touch`, `touchstart`, `pointerup:touch`,
`touchend`, `mouseover` e `click:touch`; um clique de rato dá `pointerover:mouse`,
`mouseover`, `pointermove:mouse`, `pointerdown:mouse`, `pointerup:mouse` e
`click:mouse`. O `pointerType` do clique chega para os separar. Com rato ou
teclado o nome já está no lugar desde que o cursor ou o Tab lá chegaram, e por
isso o clique é o segundo gesto e abre a página: pedir dois cliques a quem já viu
o nome seria a regra do dedo aplicada a quem não usa o dedo.

### P4 · sem guião

`node tests/inicio/mapa-regioes.mjs` (P4, nas duas edições, com
`javaScriptEnabled: false`). Nove áreas, nove com destino em `/regioes/` (e
`/en/regions/`), **9 de 9 respondem 200**; a gaveta dos nomes fechada com as nove
regiões e as 29 unidades lá dentro; o lugar do nome não se rende; o segundo nível
tem zero nós; e `/#regiao=norte` abre a primeira página sem erro nenhum.

### P5 · a altura

`node tests/inicio/mapa-regioes.mjs` (P5). A 390, com a gaveta dos nomes aberta a
página mede **3 953 px** e fechada **3 263 px**, 690 px a menos, na mesma
construção. Sem guião mede 4 048 px. O «antes» mede-se assim, e não contra o
número de outra construção, porque comparar com 3 700 px do F1.1c mediria também
tudo o que mudou pelo meio.

### P6 · o portão da geometria

```
node scripts/check-mapa.mjs               # 9 regras verdes
node scripts/check-mapa.mjs --vermelhos   # 19 estragos, 19 apanhados, saída 0
```

O portão do mapa ganha duas regras, com leitor próprio (não importa nem o gerador
nem `src/lib/mapa-regioes.mjs`):

* **R8** · as nove regiões da lista da casa com o seu código NUTS II, os 308
  concelhos uma vez cada, cada um na região que a coluna `nuts2` da Carta lhe dá
  (relida dos três CSV por este portão), e o ficheiro gerado escrito das fontes
  cujo sha256 ele declara;
* **R9** · a área de cada região igual à soma das áreas dos seus concelhos,
  recontadas dos artefactos de `mapa/`; a caixa igual ao caminho; o ponto da
  região dentro dela; e nenhum concelho com o ponto fora do desenho da sua região.

O tecto da R9 é medido e não escolhido: a distância entre as duas áreas vai de
**0,008 %** (Algarve) a **0,809 %** (Açores), com 0,116 % na mediana, e o tecto
fica no dobro do pior (1,6 %).

A R4 passou de «29 ligações de área» a «nove», com o estrago correspondente.

### P7 · o contraste e o anúncio

`node tests/inicio/mapa-regioes.mjs` (P7a, P7b e P7c). No tema claro: frase vazia
**6,24:1**, nome **16,39:1**, porta **16,39:1**. No tema escuro: **9,52:1**,
**15,38:1**, **15,38:1**. Os três acima de 4,5:1 nos dois temas. O `ariaSnapshot`
do lugar mostra `group "A área apontada no mapa"` com a frase vazia em repouso e
com «Norte» e a ligação «Abrir →» ao apontar, e a frase declara
`aria-live="polite"`.

*O tema escuro da casa não se lê do sistema: é `:root[data-theme='dark']`, posto
pelo comando do leitor. Medir com `colorScheme: 'dark'` e mais nada media o tema
claro duas vezes, e a régua põe o atributo.*

### P8 · as réguas e os três portões

| régua | comando | resultado |
| --- | --- | --- |
| a régua nova | `node tests/inicio/mapa-regioes.mjs` | 21 de 21 |
| os nomes ao lado do mapa | `node tests/inicio/lista.mjs` | 94 de 94 |
| o mapa por distritos | `node tests/inicio/mapa-distritos.mjs` | 20 de 20 |
| o mapa é navegação | `node tests/inicio/mapa-navegacao.mjs` | 9 de 9 |

**O que foi reescrito, e a razão de cada coisa:**

* `mapa-distritos.mjs`: as células **M1 e M2** (o alvo das 29 unidades no mapa da
  primeira página, a 1280 e a quatro larguras de telemóvel) ficam **retiradas**
  com a razão escrita, porque mediam um desenho que deixou de existir; o alvo do
  desenho novo mede-se na régua nova, com a mesma conta e o mesmo passo. Os cinco
  cliques da **M6** na primeira página saem pela mesma razão (ali um clique já não
  abre página nenhuma) e ficam os cinco de uma página de distrito; a **M6c** passa
  a medir o teclado numa página de distrito. Quatro plantas saíram com as células
  que mordiam. Duas correcções de medição apareceram ao fazer isto: a condição
  `startsWith('M1')` que escolhia as células a recorrer apanhava também a M10a, e
  a M10 contava zero nomes no grupo novo das regiões e dava-o por ordenado sem ter
  olhado (lia só `data-lista-porta`).
* `lista.mjs`: o par de estado passa das 29 unidades para as **nove regiões**, que
  são o que o desenho tem; a lista passa a ter **38 nomes** (as nove e as 29) e
  quatro grupos; o repouso do par lê-se numa região e não numa unidade, que dava
  `null` de um dos lados.
* `design-bundle.mjs` (que corre no `verify`): o cartão do mapa lê as nove regiões
  do ficheiro gerado em vez das 29 do artefacto.

**Os três portões, na árvore do commit `8c139bf3`** (o último de código deste
ramo; este relatório é o commit seguinte e não toca em código):

| portão | comando | saída | hora UTC |
| --- | --- | --- | --- |
| construção | `npm run build > /tmp/f11d-build.log 2>&1; echo "build $?"` | 0 | 08.09, 22:59:30 |
| tipos | `npm run typecheck > /tmp/f11d-typecheck.log 2>&1; echo "typecheck $?"` | 0 | 08.09, 22:59:30 |
| verificação | `npm run verify > /tmp/f11d-verify.log 2>&1; echo "verify $?"` | 0 | 08.09, 23:05:43 |

### P9 · as plantas

```
node tests/inicio/mapa-regioes.mjs --vermelhos   # 6 de 6, saída 0
node scripts/check-mapa.mjs --vermelhos          # 19 de 19, saída 0
node tests/inicio/mapa-distritos.mjs --vermelhos # 4 de 4, saída 0
```

As seis da régua nova, cada uma posta na resposta que o servidor dá e em mais lado
nenhum:

| planta | célula que fica vermelha |
| --- | --- |
| uma região sem nome no lugar (o `<title>` de Centro apagado) | P2a, nas duas edições |
| o primeiro toque a navegar (o guião sem `preventDefault`) | P3a |
| um concelho a menos no ficheiro da geometria de uma região | P1b |
| o lugar do nome retirado da página de um distrito | P2c e P3d |
| a lista fechada dos nomes aberta por defeito | P4, nas duas edições |
| uma área do nível do país sem ligação, sem guião | P4, nas duas edições |

A primeira planta teve de ser reescrita a meio do bloco: apagava o `data-u` do
caminho e deixou de morder quando o guião passou a ler o `<title>` da ligação.
Uma planta que não morde é uma régua a declarar-se verde sem ter olhado, e foi
por isso que a corrida das plantas correu antes de o bloco fechar.

## As duas decisões que o brief deixou a medir

**O nível intermédio dos distritos: não entra, e o número é este.** Medi o alvo
dos 308 concelhos nas 29 páginas de distrito construídas, a 390, com a mesma conta
do quadrado inscrito: **84 de 308 chegam aos 44 px, mediana 34 px, o menor Câmara
de Lobos com 4 px** (desenho de 354 px). Um nível intermédio por distrito dentro do
mapa da primeira página subiria a conta de 20 para 84 dos 308 e continuaria longe
dos 308; e o desenho desse nível **já existe como página** (`/distritos/<slug>`),
alcançável pela lista dos nomes e pelo menu, que é o que a regra do F1.10 pede
(«uma coisa, um lugar»). Acrescentá-lo como terceiro nível do mapa seria um gesto
a mais para 64 concelhos, com o mesmo desenho a viver em dois sítios.

**O segundo zoom para concelhos pequenos: não entra, e o número é este.** Levar o
menor concelho com lado medível aos 44 px pediria 8 580 px de largura de desenho;
mesmo o desenho de uma página de distrito, que é o zoom mais apertado que a casa
tem, deixa Câmara de Lobos em 4 px, e para o levar aos 44 pediria 3 894 px. Nenhum
número de níveis de zoom curto de uma vista por concelho chega aos 44 px para os
308. A resposta continua a ser a que a casa já decidiu: a rede dos nomes, a busca
dos 308 e a porta do lugar do nome.

**A página de uma região não ganha o lugar do nome** (item 7), e não é uma falta:
uma região não tem mapa. A Emenda 21 (d) decide que «uma região não tem mapa de
pontos nem de áreas; tem a régua», e um lugar para o nome da área apontada onde
não há áreas seria mobília a dizer que há. A página de um distrito ganha-o, e é o
que a P2c e a P3d medem.

## Os achados do construtor, contra o brief

1. **A união dos 308 no campo do país não fecha.** O brief manda «a CAOP 2025 por
   concelho agregada por NUTS II»; feito à letra, o desenho fica com as fronteiras
   dos distritos por dentro de cada região, porque os concelhos de duas unidades
   vizinhas foram arredondados em grelhas diferentes. A conta que ficou está
   descrita acima e é exacta.
2. **O brief não diz de onde vem a região de cada concelho.** Vem da coluna
   `nuts2` dos três ficheiros `public/dados/caop-2025-municipios-*.csv`, que já
   estavam no repositório com o zip de origem e o seu sha256 no cabeçalho, e que
   dão as nove regiões da NUTS 2024 com os mesmos nomes da lista da casa (duas
   delas por extenso: «Região Autónoma dos Açores» e «Região Autónoma da
   Madeira»). Nenhum pedido à rede.
3. **O lugar do nome ao lado do mapa custou o mapa.** A primeira forma fazia da
   figura uma grelha de duas colunas, e a tela caiu de 550 para 368 px de largura
   a 1280. O lugar passou a flutuar no canto vazio do campo (o rectângulo
   x<2 880, y<4 400 não tem um traço), que é a mesma decisão que a legenda já leva
   desde a etapa 2m, e só no nível do país: no nível da região o desenho enche a
   caixa e o nome ficava escrito por cima dos concelhos.
4. **O nome apagava-se debaixo do rato.** Com o `pointerleave` a limpar o lugar, o
   cursor a sair do mapa para clicar «Abrir →» fazia a porta desaparecer. O lugar
   do nome é fixo: fica com a última área apontada até outra ser apontada ou o
   nível mudar.
5. **`hidden` não é uma propriedade de um elemento de SVG.** `el.hidden = false`
   num `<g>` põe uma propriedade nova no objecto e deixa o atributo onde estava.
   Nos dois grupos do mapa troca-se o atributo.
6. **O guião quebra a regra de `inicio.js`, e por isso vive noutro ficheiro.**
   `public/js/mapa-regioes.js` cria elementos e escreve texto, como `livro.js`, e
   pela mesma razão medida: ou o documento leva os 308 concelhos das nove regiões
   escondidos (237 KB), ou o guião desenha os da região que o leitor abriu. Leva
   as mesmas três amarras escritas no cabeçalho (nada composto, nenhum valor,
   nenhuma contagem) e uma quarta que o `livro.js` não tem: o ficheiro que ele lê
   é conferido pelo portão do mapa, regras R8 e R9.

## As cadeias novas

Seis frases, doze linhas com as duas edições, todas de classe `navegacao`, no
`INVENTARIO-FRASES.md` com a secção que as explica e uma entrada em
`critica/REVISOES-DO-INVENTARIO.md` (bloco `mapa`, por ler):

`Toque numa região` · `Passe o rato por uma região` · `Toque num concelho` ·
`Passe o rato por um concelho` · `As regiões` · `A área apontada no mapa`, e as
seis irmãs inglesas.

**Duas linhas passaram a `retirada`:** o nome acessível do desenho da primeira
página («Mapa dos distritos e das ilhas de Portugal, com uma área por unidade.» e
a inglesa), porque o nível do país passou a ser as nove regiões.

**As duas portas não entram** («Abrir →» e «← Voltar ao país»): vivem inteiras
dentro de um `<a>`, e as medidas 8 e 9 da régua excluem esses blocos nos dois
sentidos.

## As capturas

`design/especime-v3/capturas/mapa-2026-09-07/`, doze ficheiros: o nível do país e
o nível da região (Norte), a 390 × 664 e a 1280, nas duas edições; e a página do
distrito de Lisboa com o lugar do nome aceso, às mesmas duas larguras e nas duas
edições.

## O que fica por fazer

* **A leitura a frio do Codex**, com as plantas, como manda a regra 3 do plano: o
  bloco não foi lido por outra família.
* **A medição cega do Sonnet**, se o lugar de direção a quiser para este bloco.
* **A decisão da lista dos nomes** (aberta ou fechada), com a medida do P1 em
  cima da mesa.
* **Os Açores no nível da região**: as nove ilhas herdam a escala do encaixe do
  nível do país (0,378 da escala do continente), e por isso o alvo de um concelho
  açoriano é de 2 px na mediana. Uma grelha própria para o arquipélago, sem o
  encaixe, é a resposta óbvia e não está no brief: fica escrita aqui com o número.
