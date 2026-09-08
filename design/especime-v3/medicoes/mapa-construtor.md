# F1.1d · o mapa que cresce, e o nome ao lado

*Construtor Claude Opus 5, 07 e 08.09.2026, ramo `mapa-2026-09-07` (tirado de
`7dfd36b7`, a cabeça do F1.1c depois de fundir `main`). Brief:
`design/observatorio/BRIEF-F1.1d-os-nomes-do-mapa.md`. Duas passagens: a segunda
depois da leitura a frio do Codex e da medição às cegas do Sonnet de 08.09.2026,
e está na secção «Segunda passagem» mais abaixo. Sem travessões na prosa.*

## As nove medidas, antes e depois

*A tabela vem primeiro por decisão do lugar de direção de 07.09.2026. Cada linha
diz o que a medida era antes deste bloco, o que é depois, e o comando que a
refaz. O «antes» de uma medida que não existia antes do bloco diz o que havia no
lugar dela.*

| # | a medida | antes | depois | o comando |
| --- | --- | --- | --- | --- |
| P1 | o alvo de cada área, pelo maior quadrado da grelha de 2 px que contém o ponto representativo, a 390 | **0 de 29** unidades da Carta aos 44 px (medido no F1.1 e não nesta passagem, com a mesma conta; a leitura está escrita no cabeçalho de `tests/inicio/mapa-distritos.mjs`); os 308 concelhos não estavam desenhados na primeira página | **3 de 9** regiões (mediana 18 px) e **20 de 308** concelhos (mediana 16 px). **Medida e não exigida, por decisão do lugar de direção de 08.09.2026**: o brief pede 9 de 9 e 308 de 308, e isso é geometricamente impossível (8 580 px de largura de desenho) | `node tests/inicio/mapa-regioes.mjs` (P1a, P1b, P1c) |
| P2 | o nome da área apontada num lugar fixo, pelos três gestos e nas duas edições | não havia lugar do nome: **0 áreas** diziam o seu nome em lado nenhum fixo | **9 de 9** regiões e **30 de 30** concelhos, pelo rato, pelo teclado e **pelo dedo**, nas duas edições, e **16 de 16** concelhos de Lisboa numa página de distrito | `node tests/inicio/mapa-regioes.mjs` (P2a a P2d) |
| P3 | o primeiro toque nunca navega; o segundo, ou a porta, abre | o primeiro toque numa área **navegava** (as 29 áreas eram ligações e mais nada) | o toque numa região **cresce-a**, nos dois motores; o primeiro toque num concelho diz o nome e o segundo abre; a página de uma região abre-se **pela porta** do lugar do nome (decisão de 08.09.2026); um ficheiro que responde 404 devolve a ligação do servidor | `node tests/inicio/mapa-regioes.mjs` (P3a a P3e) |
| P4 | sem guião, o mapa continua a ser navegação | 29 ligações de área para as páginas de distrito; a lista dos nomes **aberta** | **9 ligações** para as nove páginas de região, **9 de 9 respondem 200**, a gaveta **fechada** com 9 regiões e 29 unidades lá dentro, o segundo nível com **0 nós**, `#regiao=` ignorado sem erro | `node tests/inicio/mapa-regioes.mjs` (P4) |
| P5 | a altura de `/` a 390, com guião, em repouso | **3 700 px**, que é o que o F1.1c deixou (`design/especime-v3/medicoes/toque-medidas-depois.json`, chave `chromium.pt.com-guiao.repouso`, cabeça `9c34bbb0` fundida no ramo `toque-2026-09-04`) | **3 263 px**, na mesma largura e no mesmo motor: **437 px a menos** | `node tests/inicio/mapa-regioes.mjs` (P5) |
| P6 | o portão da geometria | **7 regras**, 14 estragos | **10 regras**, 24 estragos e 24 apanhados: a R8 alargada, a R9 e a **R10 nova**, que refaz os nove ficheiros do segundo nível das fontes | `node scripts/check-mapa.mjs` e `node scripts/check-mapa.mjs --vermelhos` |
| P7 | o contraste do lugar do nome e o que se mede do anúncio | não havia lugar do nome | tema claro **6,24 · 16,39 · 16,39 · 16,39**; tema escuro **9,52 · 15,38 · 15,38 · 15,38**; os oito acima de 4,5:1. O `aria-live="polite"` está declarado e a árvore de acessibilidade muda com a área apontada (é isso que se mede, e não um leitor de ecrã a anunciar) | `node tests/inicio/mapa-regioes.mjs` (P7a, P7b, P7c) |
| P8 | as réguas e os três portões | a régua nova não existia; as outras três já existiam, e as suas contagens antes deste bloco não foram medidas nesta passagem | a régua nova com **27 células**, todas verdes; `lista` **94 de 94**, `mapa-distritos` **20 de 20** (M1, M2 e cinco cliques da M6 retirados com a razão escrita), `mapa-navegacao` **9 de 9**; `build`, `verify` e `typecheck` a **0** | os comandos das quatro réguas, e `npm run build`, `npm run verify`, `npm run typecheck` |
| P9 | as plantas | 14 no portão do mapa, 8 na régua dos distritos | **7 de 7** na régua nova (todas as células que cada planta nomeia ficam vermelhas, e não uma delas), **24 de 24** no portão do mapa, **4 de 4** na régua dos distritos | `node tests/inicio/mapa-regioes.mjs --vermelhos`, `node scripts/check-mapa.mjs --vermelhos`, `node tests/inicio/mapa-distritos.mjs --vermelhos` |

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

**A união não se faz dos 308 concelhos no campo do país, e isso está medido pelo
gerador e escrito no ficheiro que ele produz.** Os concelhos de duas unidades
vizinhas não ladrilham entre si: cada unidade foi desenhada na sua grelha e a
mesma fronteira ficou arredondada de duas maneiras. As duas contas ficam em
`src/data/mapa-regioes.gerado.json`, secção `ajuste` (`npm run mapa:regioes`):

| medida | valor |
| --- | --- |
| arestas das 29 unidades de `mapa/pais.json` | **5 537**, das quais **3 781** com a gémea inversa (ladrilham) |
| arestas dos 308 concelhos no campo do país | **75 645**, das quais **44 793** com a gémea inversa (não ladrilham entre unidades) |
| distância entre as duas leituras da mesma fronteira | até **5,535 u** (`ilha-da-madeira`), **3,630 u** na mediana das 29 |

*A primeira passagem escrevia «1,4 u» em prosa, sem medida ao lado, e a leitura a
frio do Codex apanhou-o (achado 18). O número medido é maior, e a razão é que a
distância se mede entre o caminho da unidade em `mapa/pais.json`, que já vem
afinado com a tolerância do campo (3,1071 u), e a união dos caminhos dos seus
concelhos, que não vem.*

Por isso a conta é outra, e o resultado é uma fronteira exacta:

* 23 das 29 unidades estão inteiras dentro de uma região, e para essas a peça é o
  próprio caminho do artefacto;
* **6 repartem-se** por duas regiões (Aveiro, Guarda, Leiria, Lisboa, Setúbal e
  Viseu, medido), e cada uma tem **uma** linha de corte, que é a fronteira entre
  os concelhos de uma região e os da outra, exacta na grelha local;
* a linha de corte leva-se ao campo do país e as suas duas pontas projectam-se no
  caminho do artefacto (projecção máxima **1,2747 u**); a unidade parte-se em
  duas ao longo dela, e as duas pontas entram como vértices nas unidades vizinhas
  para que as arestas continuem a poder anular-se.

Feito isso, as peças de uma região anulam as fronteiras interiores umas com as
outras pela conta das arestas, e o que sobra é o contorno da região **sem uma
costura por dentro**. A tolerância da afinação é a que o manifesto do motor
declara (`erro_px` 0,25 a `coluna_px` 490), convertida para as unidades de cada
campo: **3,1071 u** no campo do país.

O ficheiro é **determinístico**: não leva data nem hora, leva o sha256 de cada
fonte lida e de cada módulo que o gerador importa (**36 entradas**, contra as 35
da primeira passagem: `src/data/regioes.mjs` faltava, e a R8 confere agora a
cobertura). `npm run mapa:regioes` escreve, `npm run mapa:regioes -- --verifica`
confere sem escrever (está na cadeia do `verify`), e uma diferença no `git status`
depois de uma construção é sempre uma fonte que mudou.

**Pesos medidos:** `src/data/mapa-regioes.gerado.json` 28 111 B (26 776 B na
primeira passagem, antes de a caixa da grelha e as medidas novas entrarem);
`public/dados/mapa/regiao-*.json` **237 116 B** nos nove ficheiros, que o guião só
pede quando o leitor abre uma região.

## As nove medidas de aceitação, em detalhe

O comando de todas as células da régua nova é o mesmo:

```
node tests/inicio/mapa-regioes.mjs             # 27 de 27 células passam
node tests/inicio/mapa-regioes.mjs --vermelhos # 7 de 7 plantas apanhadas, saída 0
```

### P1 · os alvos · **medida, não exigida (decisão do lugar de direção, 08.09.2026)**

O brief pede 9 de 9 regiões e 308 de 308 concelhos com alvo de 44 px a 390. **A
medida não se cumpre, e a razão é geométrica:** levar o menor concelho com lado
medível (São João da Madeira, 2 px no Norte) aos 44 px pediria um desenho de
**8 580 px de largura**, que são 22 telemóveis lado a lado. O lugar de direção
decidiu a 08.09.2026 que a P1 é **medida e não exigida**: a régua imprime os
números e diz no próprio nome da célula que não os exige, em vez de se declarar
verde como se a medida estivesse cumprida.

**O quadrado que esta régua mede é o maior quadrado da grelha de 2 px que
CONTÉM o ponto representativo**, e não o maior quadrado **centrado** nele. A
grelha alinha-se ao ponto (ele é sempre um nó dela) e a busca corre todos os
quadrados da grelha que o contêm. As duas definições são medidas honestas de
coisas diferentes, e a do centro é o **limite inferior estrito** da desta.

**As nove regiões, a 390** (desenho 390 × 514 px): 3 de 9 chegam aos 44 px,
mediana 18 px. A coluna do meio é a leitura às cegas do Sonnet de 08.09.2026, com
o quadrado **centrado** no ponto, servida de uma cópia própria e com código
próprio.

| região | inscrito a 390 (esta régua) | centrado a 390 (medição cega) | inscrito a 1280 |
| --- | --- | --- | --- |
| Centro | 76 px | 68 px | 104 px |
| Alentejo | 72 px | 42 px | 96 px |
| Norte | 62 px | 56 px | 84 px |
| Oeste e Vale do Tejo | 34 px | 28 px | 44 px |
| Algarve | 18 px | 12 px | 24 px |
| Grande Lisboa | 16 px | 8 px | 22 px |
| Península de Setúbal | 16 px | 12 px | 22 px |
| Madeira | 10 px | 8 px | 12 px |
| Açores | 2 px | 0 px | 2 px |

A 1280 (desenho 518 × 683 px) chegam 4 de 9 por esta régua, mediana 24 px; pela
do centro chegam 3 de 9, mediana 18 px.

**Os 308 concelhos, a 390, no nível em que se tocam:** 308 de 308 medidos, todos
com o ponto dentro da sua área, **20 chegam aos 44 px**, mediana 16 px. Pela
leitura do centro são **4 de 308**, mediana 10 px, dez deles a 0 px, o menor
Calheta de São Jorge.

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

**O que o bloco entrega é uma subida grande e não a meta:** antes deste bloco o
mapa da primeira página desenhava as 29 unidades, e **nenhuma delas chegava aos
44 px a 390** por esta conta (medido no F1.1, células M1 e M2 da régua dos
distritos, hoje retiradas; a leitura está escrita no cabeçalho de
`tests/inicio/mapa-distritos.mjs`, com a comparação contra a caixa, que dava 19
de 29 e sobrestimava). Os 308 concelhos não estavam desenhados em lado nenhum da
primeira página, e o que havia antes disso eram 308 pontos de 7,35 px (Emenda
19b). Hoje há três regiões acima dos 44 px e 20 concelhos, com a mediana dos
concelhos a 16 px.

**Quem responde pelas áreas abaixo de um dedo é a rede dos nomes**, que é a mesma
decisão da Emenda 20c e da I82, e a célula P1c **exige-a**: a lista fechada dos
nomes tem **9 regiões e 29 unidades**, e o índice dos concelhos tem **308
ligações**.

> **Para o lugar de direção.** O item 5 do brief manda a lista dos nomes ficar
> fechada, e o F1.1 tinha-a aberto por uma razão que continua a valer para seis
> das nove regiões: «fechada, ela existia para o teclado e para quem ouve e não
> existia para quem vê». Construí o que o brief manda (fechada) e deixo a medida
> aqui: a 390, seis das nove regiões estão abaixo dos 44 px, e a rede que responde
> por elas está a um toque no `<summary>`. É uma decisão de forma e é do lugar de
> direção.

### P2 · o nome no lugar, pelos três gestos e nas duas edições

`node tests/inicio/mapa-regioes.mjs` (P2a a P2d, nas duas edições). Nove de nove
regiões dizem o seu nome ao passar o rato e ao focar com o teclado, cada uma com
a porta da sua página; numa amostra de 30 concelhos (dez em cada uma das três
regiões maiores) os 30 dizem o nome da Carta e levam a porta certa; e na página de
um distrito os 16 concelhos de Lisboa fazem o mesmo, sem porta de voltar.

**O dedo mede-se nas duas edições, nas nove regiões e nos 30 concelhos** (P2d,
segunda passagem): 9 de 9 e 30 de 30 em cada edição, com o nome e a porta
**afirmados** e nenhum toque a navegar. O nome esperado de uma região lê-se do
`<title>` da sua área, que é o nome acessível que o servidor desenhou; o de um
concelho lê-se do ficheiro da região, que é a Carta.

### P3 · o primeiro toque nunca navega

`node tests/inicio/mapa-regioes.mjs` (P3a a P3e). Com o **dedo** (contexto com
`hasTouch`): o toque numa região cresce-a sem navegar (nível «regiao», 86
concelhos, endereço `/#regiao=norte`, nome «Norte» com a porta `/regioes/norte`),
o primeiro toque num concelho diz «Montalegre» e deixa o endereço em `/`, o
segundo abre `/municipios/montalegre`. Com o **rato**: «Voltar ao país» volta ao
nível de cima e o botão de voltar do navegador desfaz o que o toque escreveu. A
porta do lugar do nome abre `/regioes/algarve`. Numa página de distrito, o
primeiro toque diz «Sintra» e o segundo abre `/municipios/sintra`.

**A página de uma região abre-se pela porta do lugar do nome, e não por um
segundo toque na região.** É uma decisão escrita do lugar de direção de
08.09.2026, e a razão é do desenho e não do código: ao primeiro toque a região
cresce, o grupo do nível do país esconde-se e o contorno da região deixa de estar
no ecrã, de maneira que **não há alvo nenhum para receber um segundo toque**. A
porta «Abrir →» ficou no lugar do nome com o mesmo gesto que fez crescer a
região, e é a célula P3c que a mede. A regra dos dois toques vale inteira para um
**concelho**, que não cresce, e é a P3a e a P3d que a medem.

**A distinção entre o dedo e o rato é medida e não suposta, e a primeira forma
dela caía no Safari.** Com o mesmo toque de dedo, medido nos dois motores a
08.09.2026:

| motor | a sequência do toque |
| --- | --- |
| Chromium | `pointerover:touch`, `pointerdown:touch`, `touchstart`, `pointerup:touch`, `touchend`, `mouseover`, **`click:touch`** |
| WebKit | `pointerover:touch`, `pointerdown:touch`, `touchstart`, `pointerup:touch`, `touchend`, `mouseover`, **`click:mouse`** |

O `pointerType` do CLIQUE diz «mouse» no WebKit para um dedo, e a primeira forma
da regra lia-o: no Safari o primeiro toque num concelho abria a página, que é
exactamente o que a medida P3 proíbe, e no Chromium não. O gesto passa a ler-se
do `pointerdown`, que diz «touch» nos dois; o `pointerType` do clique fica como
segunda leitura e o `touchstart` como terceira. **A célula P3a corre nos dois
motores**, e é a única do bloco que o faz: foi ali que a diferença apareceu, e o
WebKit é o motor de todos os telemóveis da Apple. Com rato ou teclado o nome já
está no lugar desde que o cursor ou o Tab lá chegaram, e por isso o clique é o
segundo gesto e abre a página: pedir dois cliques a quem já viu o nome seria a
regra do dedo aplicada a quem não usa o dedo.

**Um pedido que não volta não deixa a ligação morta** (P3e, segunda passagem).
Com o ficheiro de uma região a responder 404, o mapa fica no nível do país, o
endereço fica em `/`, o lugar do nome mostra o nome «Algarve», a porta
`/regioes/algarve` e o aviso «O mapa desta região não abriu. A porta leva à
página dela.», e **o toque seguinte na mesma área abre `/regioes/algarve`** pela
ligação que o servidor escreveu.

### P4 · sem guião

`node tests/inicio/mapa-regioes.mjs` (P4, nas duas edições, com
`javaScriptEnabled: false`). Nove áreas, nove com destino em `/regioes/` (e
`/en/regions/`), **9 de 9 respondem 200** (os nove códigos ficam gravados em
`mapa-medidas.json`, e não só na prova impressa); a gaveta dos nomes fechada com
as nove regiões e as 29 unidades lá dentro; o lugar do nome não se rende; o
segundo nível tem zero nós; e `/#regiao=norte` abre a primeira página sem erro
nenhum.

### P5 · a altura, antes e depois do bloco

`node tests/inicio/mapa-regioes.mjs` (P5). O **antes** é a página como o F1.1c a
deixou, e o número não se mede outra vez: lê-se do artefacto que esse bloco
gravou, `design/especime-v3/medicoes/toque-medidas-depois.json`, chave
`chromium.pt.com-guiao.repouso`, cabeça `9c34bbb0` fundida no ramo
`toque-2026-09-04`, medido a 390 × 664 em Chromium, que é a mesma largura e o
mesmo motor desta célula: **3 700 px**. O **depois** é esta árvore: **3 263 px**,
**437 px a menos**. Na mesma construção, a gaveta dos nomes aberta dá 3 953 px e
sem guião 4 048 px, que são duas leituras da mesma página e servem para saber
quanto pesa a gaveta, não para dizer de onde a página veio.

### P6 · o portão da geometria

```
node scripts/check-mapa.mjs               # 10 regras verdes
node scripts/check-mapa.mjs --vermelhos   # 24 estragos, 24 apanhados, saída 0
```

O portão do mapa ganha **três** regras, com leitor próprio (não importa nem o
gerador nem `src/lib/mapa-regioes.mjs`):

* **R8** · as nove regiões da lista da casa com o seu código NUTS II, os 308
  concelhos uma vez cada, cada um na região que a coluna `nuts2` da Carta lhe dá
  (relida dos três CSV por este portão), o ficheiro gerado escrito das fontes
  cujo sha256 ele declara, e **o manifesto de resumos a cobrir os módulos que o
  gerador importa** (a lista dos `import` lê-se do próprio ficheiro do gerador);
* **R9** · a área de cada região igual à soma das áreas dos seus concelhos,
  recontadas dos artefactos de `mapa/`; a caixa igual ao caminho; o ponto da
  região dentro dela; e nenhum concelho com o ponto fora do desenho da sua região;
* **R10** · **os nove ficheiros do segundo nível refeitos das fontes**: os anéis
  de cada concelho vêm de `mapa/distritos/<unidade>.json`, vão ao campo do país
  pela caixa daquela unidade em `mapa/pais.json`, e daí à grelha da região;
  arredondam-se, afinam-se com a tolerância do manifesto e escrevem-se na
  codificação do artefacto. Compara-se o `slug`, o `campo` e a lista inteira dos
  concelhos (`slug`, `nome`, `d`, `caixa`, `ponto`) com o que está em disco, e
  confere-se que `dist/` é igual a `public/`, que é o que o navegador pede. A
  pertença de cada concelho vem outra vez da Carta, e não da lista do ficheiro
  que se está a conferir.

O tecto da R9 é medido e não escolhido: a distância entre as duas áreas vai de
**0,0082 %** (Algarve) a **0,8086 %** (Açores), com **0,116 %** na mediana, e o
tecto fica no dobro do pior (1,6 %).

O único número da conta dos nove ficheiros que não se lê das fontes é a caixa, no
campo do país, do espaço que a grelha de cada região cobre: ela junta a caixa dos
concelhos à do contorno, e o contorno é a união das peças das unidades, que é a
parte cara da conta. Passa a vir declarada no ficheiro gerado
(`caixa_da_grelha`), e a R10 prende-a pelos dois lados: tem de conter a caixa dos
concelhos daquela região e não pode sair dela por mais do que a tolerância do
campo do país. A maior folga medida é **0,67 u** (Península de Setúbal) contra
**3,1071 u** de tolerância. Que ela não se possa derivar dos concelhos está
medido: a Península de Setúbal dá 1 446 de altura de grelha com a caixa das duas
geometrias juntas e 1 444 com a dos concelhos só.

A R4 passou de «29 ligações de área» a «nove», com o estrago correspondente.

### P7 · o contraste, e o que se mede do anúncio

`node tests/inicio/mapa-regioes.mjs` (P7a, P7b e P7c). No tema claro: frase vazia
**6,24:1**, nome **16,39:1**, porta **16,39:1**, aviso **16,39:1**. No tema
escuro: **9,52:1**, **15,38:1**, **15,38:1**, **15,38:1**. Os quatro acima de
4,5:1 nos dois temas.

**O que se mede do anúncio é o atributo e a árvore, e não um leitor de ecrã.** A
P7c confere que a frase declara `aria-live="polite"`, que é o atributo por onde um
leitor de ecrã sabe que há ali algo a reler; a P7b confere que a **árvore de
acessibilidade** do lugar muda com a área apontada (`ariaSnapshot` mostra `group
"A área apontada no mapa"` com a frase vazia em repouso e com «Norte» e a ligação
«Abrir →» ao apontar). Nenhuma das duas ouve um leitor de ecrã, e dizer que um
leitor anunciou seria afirmar o que esta régua não mede.

*O tema escuro da casa não se lê do sistema: é `:root[data-theme='dark']`, posto
pelo comando do leitor. Medir com `colorScheme: 'dark'` e mais nada media o tema
claro duas vezes, e a régua põe o atributo.*

### P8 · as réguas e os três portões

| régua | comando | resultado |
| --- | --- | --- |
| a régua nova | `node tests/inicio/mapa-regioes.mjs` | 27 de 27 |
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

### P9 · as plantas

```
node tests/inicio/mapa-regioes.mjs --vermelhos   # 7 de 7, saída 0
node scripts/check-mapa.mjs --vermelhos          # 24 de 24, saída 0
node tests/inicio/mapa-distritos.mjs --vermelhos # 4 de 4, saída 0
```

As sete da régua nova, cada uma posta na resposta que o servidor dá e em mais lado
nenhum. **Todas as células que uma planta nomeia têm de ficar vermelhas**, e não
uma delas:

| planta | células que ficam vermelhas |
| --- | --- |
| uma região sem nome no lugar (o `<title>` de Centro apagado) | P2a, nas duas edições |
| o primeiro toque num concelho a navegar (o guião deixa de segurar esse clique) | P3a, nos dois motores |
| a região cujo ficheiro não veio a ficar sem destino (o guião sem a saída da falha) | P3e |
| um concelho a menos no ficheiro da geometria de uma região | P1b, e P2b nas duas edições |
| o lugar do nome retirado da página de um distrito | P2c nas duas edições, e P3d |
| a lista fechada dos nomes aberta por defeito | P4, nas duas edições |
| uma área do nível do país sem ligação, sem guião | P4, nas duas edições |

A primeira planta teve de ser reescrita a meio do bloco: apagava o `data-u` do
caminho e deixou de morder quando o guião passou a ler o `<title>` da ligação.
Uma planta que não morde é uma régua a declarar-se verde sem ter olhado, e foi
por isso que a corrida das plantas correu antes de o bloco fechar.

## As duas decisões que o brief deixou a medir

**O nível intermédio dos distritos: não entra, e o número é este.**

```
node design/especime-v3/medicoes/mapa-alvos-nos-distritos.mjs
```

Mede o alvo dos 308 concelhos nas 29 páginas de distrito construídas, a 390, com
a mesma conta do quadrado inscrito e o mesmo passo de 2 px: **84 de 308 chegam aos
44 px, mediana 34 px, o menor Câmara de Lobos com 4 px** (desenho de 354 px). O
guião **exige** as 29 unidades e os 308 concelhos (sai com 1 se faltar algum) e
grava `design/especime-v3/medicoes/mapa-alvos-nos-distritos.json`, com a conta por
unidade, para que o número se leia de um ficheiro e não de uma frase. Um nível
intermédio por distrito dentro do mapa da primeira página subiria a conta de 20
para 84 dos 308 e continuaria longe dos 308; e o desenho desse nível **já existe
como página** (`/distritos/<slug>`), alcançável pela lista dos nomes e pelo menu,
que é o que a regra do F1.10 pede («uma coisa, um lugar»). Acrescentá-lo como
terceiro nível do mapa seria um gesto a mais para 64 concelhos, com o mesmo
desenho a viver em dois sítios.

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
   descrita acima e é exacta, e as duas medidas que a sustentam estão no ficheiro
   gerado.
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
6. **O `pointerType` de um clique feito com o dedo não é o mesmo nos dois
   motores.** O Chromium diz «touch» e o WebKit diz «mouse», e a regra do
   primeiro toque, escrita sobre o clique, passava num e caía no outro. Lê-se
   agora do `pointerdown`. A tabela está na P3.
7. **O guião quebra a regra de `inicio.js`, e por isso vive noutro ficheiro.**
   `public/js/mapa-regioes.js` cria elementos e escreve texto, como `livro.js`, e
   pela mesma razão medida: ou o documento leva os 308 concelhos das nove regiões
   escondidos (237 KB), ou o guião desenha os da região que o leitor abriu. Leva
   as mesmas três amarras escritas no cabeçalho (nada composto, nenhum valor,
   nenhuma contagem) e uma quarta que o `livro.js` não tem: o ficheiro que ele lê
   é conferido pelo portão do mapa, regras R8, R9 e R10.
8. **Um clique de rato a meio de uma medida de dedo mede outro gesto** (segunda
   passagem). Ao escrever a P2d, voltar ao nível do país com `page.click` na porta
   de subir fazia 2 das 9 regiões (Alentejo e Norte) devolverem o nome de um
   CONCELHO em vez do da região: o cursor do rato fica parado sobre o mapa, e o
   navegador reavalia o que está debaixo dele quando o desenho da região nasce,
   disparando um `pointerover` de rato sobre um concelho que ninguém apontou.
   Com o fragmento (`location.hash = ''`), que é o caminho do botão de voltar do
   navegador e não envolve rato nenhum, são 9 de 9. **Num telemóvel isto não
   acontece**, porque não há cursor: a sequência de um toque acaba num `mouseover`
   simples, que este guião não escuta. **Num portátil com ecrã táctil acontece**,
   e é uma pergunta de forma para o lugar de direção: quem toca numa região com o
   dedo enquanto o cursor do rato descansa sobre o mapa vê no lugar do nome o
   concelho que está debaixo do cursor, e não a região que tocou. Não está no
   brief e não foi decidido: fica medido aqui, com o comando.

## As cadeias novas

**Sete frases, catorze linhas com as duas edições**, todas de classe `navegacao`,
no `INVENTARIO-FRASES.md` com a secção que as explica e uma entrada em
`critica/REVISOES-DO-INVENTARIO.md` (bloco `mapa`):

`Toque numa região` · `Passe o rato por uma região` · `Toque num concelho` ·
`Passe o rato por um concelho` · `As regiões` · `A área apontada no mapa` ·
`O mapa desta região não abriu. A porta leva à página dela.`, e as sete irmãs
inglesas. A sétima entrou na segunda passagem, com a saída da falha do pedido.

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

## Segunda passagem (08.09.2026)

*Depois da leitura a frio do Codex (`gpt-5.6-sol`, xhigh, cinco plantas de três
classes, 5 de 5 vistas) e da medição às cegas do Sonnet, as duas de 08.09.2026.
Cada linha diz o achado, o que se fez e onde. As decisões sobre os achados reais
são do lugar de direção e estão aplicadas como ele as escreveu.*

### Os cinco estragos plantados, que não são achados

O pacote da leitura levava a árvore da cabeça `abe7cabd` **mais cinco estragos
plantados pelo lugar de direção**. O leitor apanhou os cinco, e conferi que
nenhum existe neste ramo:

| o que o leitor viu | o que o ramo tem |
| --- | --- |
| Blocking 1 · o gesto lido só do `pointerType` do clique | `public/js/mapa-regioes.js:316` lê o `pointerdown`, e a linha 353 junta as duas leituras |
| Blocking 2 · os Açores a ligar para `/regioes/azores` | nenhuma página construída tem `/regioes/azores` nem `/en/regions/azores` (as 15 páginas construídas que nomeiam a região dos Açores usam `acores`, contadas com `grep -rl "regioes/acores" dist/`); as ocorrências de «azores» no repositório são todas o domínio `azores.gov.pt` de uma fonte estatística, e nenhuma está no mapa, no guião ou nos componentes |
| Major 3 · o tecto da R9 a 16 % | `TECTO_DA_AREA_PCT = 1.6` |
| Major 6 · 120 concelhos no parágrafo de cabeça | nenhuma ocorrência de «120» no relatório |
| Major 10 (parte) · a planta do primeiro toque só a aceitar o Chromium | a planta nomeia `P3a · Chromium` e `P3a · WebKit` |

### Os achados reais, e o que se fez a cada um

| achado | o que se fez | onde |
| --- | --- | --- |
| **Major 4** · a R9 não prova que a região é a união da geometria dos concelhos que o leitor vê | **regra R10 nova**: refaz os nove ficheiros `public/dados/mapa/regiao-*.json` das fontes, com o leitor deste portão, e compara o `slug`, o `campo` e a lista inteira dos concelhos (`slug`, `nome`, `d`, `caixa`, `ponto`); confere que `dist/` é igual a `public/`; a pertença vem outra vez da Carta. Três estragos que mordem: um concelho trocado de ficheiro, um caminho alterado, um campo errado | `scripts/check-mapa.mjs` (R10 e os três estragos); `scripts/mapa-regioes.mjs` (`caixa_da_grelha`) |
| **Major 5** · a P1 verde sem exigir os 44 px | a P1 é **medida e não exigida, por decisão do lugar de direção de 08.09.2026**: as células chamam-se «P1a · medida, não exigida (decisão de 08.09.2026)» e «P1b · …», a prova imprime «(medido, não exigido)», e o relatório escreve a definição exacta do quadrado que a régua mede e a leitura às cegas ao lado, como limite inferior estrito. Nenhuma re-medição | `tests/inicio/mapa-regioes.mjs` (cabeçalho, P1a, P1b); este relatório, P1 |
| **Major 7** · o toque só em português, numa região e num concelho, sem afirmar o nome | **P2d nova**, com `hasTouch`, nas duas edições, em 9 de 9 regiões e em 30 concelhos, a **afirmar** o nome e a porta que o lugar mostra; a P3a passa a afirmar o nome da região tocada e o do concelho | `tests/inicio/mapa-regioes.mjs` (P2d, P3a) |
| **Major 8** · o segundo toque numa região não existe | **decisão escrita, sem código**: a página de uma região abre-se pela porta do lugar do nome, e não por um segundo toque, porque a região cresceu e o seu contorno já não está no ecrã para o receber. A P3c continua a ser a prova, e di-lo no nome e na prova | `tests/inicio/mapa-regioes.mjs` (cabeçalho, P3c); este relatório, P3 |
| **Major 9** · um `fetch` falhado deixa a ligação morta | a região que falhou fica marcada e **o clique seguinte não é segurado**: segue a ligação do servidor. Sem `fetch` no navegador nem se chega a segurar o primeiro. O lugar do nome di-lo, com uma frase nova nas duas edições. **P3e nova** mede-o com uma região a responder 404, e uma planta (o guião sem a saída) põe-na vermelha | `public/js/mapa-regioes.js` (`falhou`, `abre`, o clique); `src/components/inicio/LugarDoNome.astro`; `src/i18n/strings.mjs`; `tests/inicio/mapa-regioes.mjs` (P3e e a planta) |
| **Major 10** (parte real) · a planta do primeiro toque tira todos os `preventDefault`; o corredor usa `some` | a planta tira **só a regra do toque no concelho**; o corredor exige que **todas** as células que a planta nomeia fiquem vermelhas (`every`). Isso obrigou a corrigir mais duas plantas que declaravam mais do que mordiam: a do concelho a menos tirava o último da lista, que a amostra da P2b nunca visitava, e a do lugar do nome num distrito só mexia na edição portuguesa | `tests/inicio/mapa-regioes.mjs` (as plantas e o corredor) |
| **Major 11** · a P5 não mede o antes | a P5 lê o antes do artefacto do F1.1c (`toque-medidas-depois.json`, chave `chromium.pt.com-guiao.repouso`, cabeça `9c34bbb0`), na mesma largura e no mesmo motor, e mede o depois nesta árvore: 3 700 → 3 263 px | `tests/inicio/mapa-regioes.mjs` (P5) |
| **Major 12** · a P7 a dizer «anunciado» | a P7 e o relatório dizem o que se mede: o atributo `aria-live="polite"` e a árvore de acessibilidade a mudar. Sem ferramenta nova | `tests/inicio/mapa-regioes.mjs` (cabeçalho, P7b, P7c); este relatório, P7 |
| **Major 13** · `src/data/regioes.mjs` fora do manifesto | o gerador segue os seus próprios `import` relativos e hasha-os (36 entradas, contra 35); a **R8** lê a mesma lista do ficheiro do gerador e exige que o manifesto a cubra, com uma planta que apaga a entrada | `scripts/mapa-regioes.mjs` (`hashaOsModulosImportados`); `scripts/check-mapa.mjs` (R8 e a planta) |
| **Minor 14** · o pacote não reproduz a construção nem as corridas | **é assim, e diz-se**: um pacote de leitura leva os ficheiros mudados e não a árvore inteira, e por isso não corre `npm run build` nem tem `dist/`. Os códigos de saída, as horas e os identificadores das corridas do GitHub são afirmações sobre outro ambiente, e ficam aqui como afirmações com o comando que as refaz numa árvore completa. As saídas coladas abaixo são desta árvore | este relatório, «As saídas» |
| **Minor 15** · 20 estragos e não 19 | contados: eram 20, são agora **24** (as três da R10 e a do manifesto da R8), e o número está no relatório e na tabela das medidas | este relatório, P6 e P9 |
| **Minor 16** · a medida dos 84 de 308 sem artefacto e a poder ficar parcial | o guião conta as unidades e os concelhos, **sai com 1** se não forem 29 e 308, e grava `design/especime-v3/medicoes/mapa-alvos-nos-distritos.json` com a conta por unidade | `design/especime-v3/medicoes/mapa-alvos-nos-distritos.mjs` |
| **Minor 17** · os códigos HTTP da P4 deitados fora | os nove códigos entram em `mapa-medidas.json`, e não só na prova impressa | `tests/inicio/mapa-regioes.mjs` (P4) |
| **Minor 18** · o desvio de 1,4 u só em prosa | o **gerador mede-o** e escreve-o em `ajuste`, com as contas das arestas dos dois lados. O número medido é maior do que a prosa dizia: **5,535 u** no pior caso e **3,630 u** na mediana das 29. A prosa do gerador e a deste relatório foram corrigidas | `scripts/mapa-regioes.mjs`; `src/data/mapa-regioes.gerado.json` (`ajuste`); este relatório, «A geometria» |

**Os achados 19 a 29 confirmam o que está bem**, e este relatório usa-os onde
usa esses números: as seis unidades repartidas e as 23 inteiras (19), os dois
nomes longos da Carta (20), as nove contagens que somam 308 (21), as 5 537
arestas e as 3 781 com gémea e a projecção máxima de 1,2747 u (22), os dois pesos
em bytes (23), a tabela da P1 (24), a estrutura sem guião das duas primeiras
páginas (25), o lugar do nome nas páginas de distrito e a sua ausência nas de
região (26), a mudança do inventário (27), as células e as plantas retiradas com
razão escrita (28) e a troca do atributo nos grupos de SVG (29).

### A medição às cegas, e os 28 px

A medição às cegas do Sonnet mediu **o quadrado centrado no ponto** e esta régua
mede **o maior quadrado da grelha que contém o ponto**. As duas são medidas
honestas de coisas diferentes, a do centro é o limite inferior estrito da desta, e
as duas leituras estão lado a lado na tabela da P1. A diferença explica os 2 de 9
contra os 3 de 9, os 4 de 308 contra os 20 de 308 e os Açores a 0 px contra 2 px.

**As alturas diferiam 28 px em todos os estados, e a razão está encontrada e
medida.** O Sonnet mediu 3 292 px (fechada), 3 981 (aberta) e 4 076 (sem guião);
esta régua mede 3 263, 3 953 e 4 048. A cópia servida ao medidor **não tinha as
fontes da casa**: não há um único `.woff2` em
`.../medicao-cega-f11d/sitio/`, e `dist/tipos/` tem oito. Sem elas o navegador cai
nas do sistema, e as linhas medem outra coisa. Servi `dist/` com `/tipos/` a
responder 404 e as três alturas deram **3 292, 3 981 e 4 076**, iguais às dele ao
píxel:

```
COM as fontes da casa: fechada 3263 · aberta 3953 · sem guião 4048
SEM as fontes da casa: fechada 3292 · aberta 3981 · sem guião 4076
```

*As restantes leituras dele batem certo com as desta régua: os contrastes ao
centésimo nas seis células comuns, 9 de 9 ligações sem guião nas duas edições, a
gaveta fechada com 38 nomes, o segundo nível vazio, 308 de 308 concelhos
desenhados e nenhum ponto representativo fora da sua área.*

## As saídas, desta árvore

**O portão do mapa** (`node scripts/check-mapa.mjs`):

```
  ✓ R1 · os resumos de mapa/ batem com o manifesto
  ✓ R2 · a junção: 308 concelhos, uma vez cada, com os slugs da Carta
  ✓ R3 · cada página de distrito com tantas ligações quantos concelhos
  ✓ R4 · a primeira página com nove ligações de área
  ✓ R5 · nenhuma ligação debaixo de role="img"
  ✓ R6 · a atribuição da DGT onde o mapa está
  ✓ R7 · a colação portuguesa nos artefactos e nas listas construídas
  ✓ R8 · as nove regiões, os 308 uma vez cada, na região que a Carta dá
  ✓ R9 · a união dos concelhos de cada região é a região
  ✓ R10 · os nove ficheiros do segundo nível refeitos das fontes

  mapa · 30 ficheiros conferidos · 29 unidades · 308 concelhos, uma vez cada · 58 páginas de distrito construídas
```

**Os quatro estragos novos** (`node scripts/check-mapa.mjs --vermelhos`, 24 de 24;
as vinte já existentes ficam de fora desta transcrição):

```
  vermelho ✓  R10 · o concelho "vila-franca-do-campo" mudado do ficheiro de "acores" para o de "alentejo"
              o ficheiro de "acores" tem 18 concelhos e a Carta põe-lhe 19.
  vermelho ✓  R10 (um caminho alterado) · o caminho de "angra-do-heroismo" alterado dentro do ficheiro de "acores"
              em "acores", o concelho "angra-do-heroismo" não é o que as fontes dão: d diferente(s) (o refeito é "angra-do-heroismo").
  vermelho ✓  R10 (o campo errado) · o campo de "acores" com mais 2 u de altura
              o campo de "acores" está escrito {"largura":2000,"altura":1143} e as fontes dão {"largura":2000,"altura":1141}.
  vermelho ✓  R8 (um módulo fora do manifesto) · src/data/regioes.mjs apagado do manifesto de resumos do ficheiro gerado
              o gerador importa src/data/regioes.mjs e o manifesto de resumos do ficheiro gerado não o declara (corra `npm run mapa:regioes`).
```

*Um defeito do próprio corredor das plantas apareceu ao pôr a R10 no portão, e
ficou consertado: o rótulo de um estrago escolhia a regra por `startsWith` do id,
e «R10» começa por «R1», de maneira que os três estragos da R10 corriam pela R1,
que os não apanhava e os dava por não apanhados. A escolha passa a exigir o id
inteiro, ou o id seguido de um parêntesis.*

**A régua nova** (`node tests/inicio/mapa-regioes.mjs`), 27 de 27:

```
  F1.1d · o mapa que cresce, e o nome ao lado · 27 células

  passa  P1a · medida, não exigida (decisão de 08.09.2026) · a 390, o alvo das nove regiões
         desenho 390 × 514 px · 9 áreas · 3 de 9 chegam aos 44 px (medido, não exigido) (mediana 18 px; a maior 76 px, a menor 2 px)
  passa  P1a · medida, não exigida (decisão de 08.09.2026) · a 1280, o alvo das nove regiões
         desenho 518 × 683 px · 9 áreas · 4 de 9 chegam aos 44 px (medido, não exigido) (mediana 24 px; a maior 104 px, a menor 2 px)
  passa  P1b · medida, não exigida (decisão de 08.09.2026) · a 390, o alvo dos 308 concelhos, região a região
         308 de 308 medidos em 9 regiões, todos com o ponto dentro da sua área · 20 chegam aos 44 px (medido, não exigido) · mediana 16 px (16 px sem os de lado zero) · 2 com menos de 2 px · o menor com lado medível pediria um desenho de 8580 px de largura
  passa  P1c · a rede de nomes responde pelas áreas abaixo de 44 px
         a lista dos nomes tem 9 regiões e 29 unidades da Carta · o índice dos concelhos tem 308 ligações
  passa  P2a · pt: o nome no lugar ao passar e ao focar, nas nove regiões
         9 de 9 · «Açores» … «Península de Setúbal» · cada porta na sua página
  passa  P2b · pt: o nome no lugar numa amostra de 30 concelhos, nos três níveis de região maiores
         30 de 30 · «Alfândega da Fé» … «Sousel»
  passa  P2c · pt: numa página de distrito, o lugar do nome diz o concelho apontado
         16 de 16 concelhos de Lisboa · «Alenquer» … «Vila Franca de Xira» · 0 porta(s) de voltar (uma página de distrito não tem nível de cima)
  passa  P2d · pt: com o dedo, o nome e a porta no lugar nas nove regiões
         9 de 9 · «Açores» → «/regioes/acores» … «Península de Setúbal» → «/regioes/peninsula-de-setubal» · nenhum toque navegou
  passa  P2d · pt: com o dedo, o nome e a porta no lugar numa amostra de 30 concelhos
         30 de 30 · «Alfândega da Fé» → «/municipios/alfandega-da-fe» … «Sousel» → «/municipios/sousel» · nenhum primeiro toque navegou
  passa  P2a · en: o nome no lugar ao passar e ao focar, nas nove regiões
         9 de 9 · «Azores» … «Setúbal Peninsula» · cada porta na sua página
  passa  P2b · en: o nome no lugar numa amostra de 30 concelhos, nos três níveis de região maiores
         30 de 30 · «Alfândega da Fé» … «Sousel»
  passa  P2c · en: numa página de distrito, o lugar do nome diz o concelho apontado
         16 de 16 concelhos de Lisboa · «Alenquer» … «Vila Franca de Xira» · 0 porta(s) de voltar (uma página de distrito não tem nível de cima)
  passa  P2d · en: com o dedo, o nome e a porta no lugar nas nove regiões
         9 de 9 · «Azores» → «/en/regions/acores» … «Setúbal Peninsula» → «/en/regions/peninsula-de-setubal» · nenhum toque navegou
  passa  P2d · en: com o dedo, o nome e a porta no lugar numa amostra de 30 concelhos
         30 de 30 · «Alfândega da Fé» → «/en/municipalities/alfandega-da-fe» … «Sousel» → «/en/municipalities/sousel» · nenhum primeiro toque navegou
  passa  P3a · Chromium, com o dedo: a região cresce sem navegar, o primeiro toque num concelho diz o nome, o segundo abre
         a região: nível «regiao», 86 concelhos, endereço «/#regiao=norte», nome «Norte» (esperado «Norte») com a porta «/regioes/norte» · o primeiro toque no concelho deixa o endereço em «/» e diz «Montalegre» (esperado «Montalegre») · o segundo abre «/municipios/montalegre»
  passa  P3a · WebKit, com o dedo: a região cresce sem navegar, o primeiro toque num concelho diz o nome, o segundo abre
         a região: nível «regiao», 86 concelhos, endereço «/#regiao=norte», nome «Norte» (esperado «Norte») com a porta «/regioes/norte» · o primeiro toque no concelho deixa o endereço em «/» e diz «Montalegre» (esperado «Montalegre») · o segundo abre «/municipios/montalegre»
  passa  P3b · com o rato: a porta de voltar sobe um nível, e o botão de voltar do navegador desfaz o que o toque escreveu
         clique → «#regiao=alentejo» (nível regiao) · «Voltar ao país» → «sem fragmento» (nível pais) · voltar do navegador → «#regiao=alentejo» (nível regiao)
  passa  P3c · a página de uma região abre-se pela porta do lugar do nome, e não por um segundo toque na região
         a porta diz «/regioes/algarve» e leva a «/regioes/algarve» · uma região que cresceu já não tem contorno no ecrã para receber um segundo toque, e a regra dos dois toques vale para um concelho (P3a e P3d)
  passa  P3d · numa página de distrito, o primeiro toque num concelho diz o nome e o segundo abre
         o primeiro toque deixa o endereço em «/distritos/lisboa» e diz «Sintra» · o segundo abre «/municipios/sintra»
  passa  P3e · com o ficheiro de uma região a responder 404, o mapa não cresce, o lugar do nome di-lo e o toque seguinte abre a página dela
         o primeiro toque deixa o nível em «pais» e o endereço em «/», com o nome «Algarve», a porta «/regioes/algarve» e o aviso à vista · o toque seguinte abre «/regioes/algarve»
  passa  P4 · pt: sem guião, nove ligações para as nove páginas, a lista fechada e o «#regiao=» ignorado
         9 áreas, 9 com destino em «/regioes/», 9 de 9 respondem 200 · gaveta fechada com 9 regiões e 29 unidades · o lugar do nome não se rende · o segundo nível tem 0 nós
  passa  P4 · en: sem guião, nove ligações para as nove páginas, a lista fechada e o «#regiao=» ignorado
         9 áreas, 9 com destino em «/en/regions/», 9 de 9 respondem 200 · gaveta fechada com 9 regiões e 29 unidades · o lugar do nome não se rende · o segundo nível tem 0 nós
  passa  P5 · a altura de `/` a 390 depois deste bloco é menor do que a que o F1.1c deixou
         antes 3700 px (design/especime-v3/medicoes/toque-medidas-depois.json, «chromium.pt.com-guiao.repouso», cabeça 9c34bbb0, a fusão de origin/main no ramo toque-2026-09-04) · depois 3263 px, na mesma largura e no mesmo motor (437 px a menos) · na mesma construção, a gaveta dos nomes aberta dá 3953 px e sem guião 4048 px
  passa  P7a · o lugar do nome com contraste de 4,5:1 no tema claro
         vazio 6.24:1 · nome 16.39:1 · porta 16.39:1 · aviso 16.39:1
  passa  P7a · o lugar do nome com contraste de 4,5:1 no tema escuro
         vazio 9.52:1 · nome 15.38:1 · porta 15.38:1 · aviso 15.38:1
  passa  P7b · o lugar do nome é uma região com nome acessível, e a árvore de acessibilidade dele muda com a área apontada
         em repouso: - group "A área apontada no mapa": - paragraph: Passe o rato por uma região - paragraph · ao apontar: - group "A área apontada no mapa": - paragraph: Norte - paragraph: - link "Abrir →": - /ur
  passa  P7c · a frase do lugar declara `aria-live="polite"`, que é o atributo por onde um leitor de ecrã sabe que há ali algo a reler
         aria-live="polite" · o atributo mede-se; o anúncio em voz alta é do navegador e do leitor de ecrã, e não desta régua

  27 de 27 células passam.
```

**As plantas da régua** (`node tests/inicio/mapa-regioes.mjs --vermelhos`), 7 de 7,
com todas as células de cada uma vermelhas:

```
  vermelho ✓  uma região sem nome no lugar (o `<title>` de Centro apagado)
              falha ✓ P2a · pt: o nome no lugar ao passar e ao focar, nas nove regiões
              falha ✓ P2a · en: o nome no lugar ao passar e ao focar, nas nove regiões
  vermelho ✓  o primeiro toque num concelho a navegar (o guião deixa de segurar esse clique)
              falha ✓ P3a · Chromium, com o dedo: a região cresce sem navegar, o primeiro toque num concelho diz o nome, o segundo abre
              falha ✓ P3a · WebKit, com o dedo: a região cresce sem navegar, o primeiro toque num concelho diz o nome, o segundo abre
  vermelho ✓  a região cujo ficheiro não veio a ficar sem destino (o guião sem a saída da falha)
              falha ✓ P3e · com o ficheiro de uma região a responder 404, o mapa não cresce, o lugar do nome di-lo e o toque seguinte abre a página dela
  vermelho ✓  um concelho a menos no ficheiro da geometria de uma região
              falha ✓ P1b · medida, não exigida (decisão de 08.09.2026) · a 390, o alvo dos 308 concelhos, região a região
              falha ✓ P2b · pt: o nome no lugar numa amostra de 30 concelhos, nos três níveis de região maiores
              falha ✓ P2b · en: o nome no lugar numa amostra de 30 concelhos, nos três níveis de região maiores
  vermelho ✓  o lugar do nome retirado da página de um distrito
              falha ✓ P2c · pt: numa página de distrito, o lugar do nome diz o concelho apontado
              falha ✓ P2c · en: numa página de distrito, o lugar do nome diz o concelho apontado
              falha ✓ P3d · numa página de distrito, o primeiro toque num concelho diz o nome e o segundo abre
  vermelho ✓  a lista fechada dos nomes aberta por defeito
              falha ✓ P4 · pt: sem guião, nove ligações para as nove páginas, a lista fechada e o «#regiao=» ignorado
              falha ✓ P4 · en: sem guião, nove ligações para as nove páginas, a lista fechada e o «#regiao=» ignorado
  vermelho ✓  uma área do nível do país sem ligação, sem guião
              falha ✓ P4 · pt: sem guião, nove ligações para as nove páginas, a lista fechada e o «#regiao=» ignorado
              falha ✓ P4 · en: sem guião, nove ligações para as nove páginas, a lista fechada e o «#regiao=» ignorado
```

**Os três portões, na árvore desta passagem:**

| portão | comando | saída |
| --- | --- | --- |
| construção | `npm run build > /tmp/f11d-build3.log 2>&1; echo "build $?"` | 0 |
| tipos | `npm run typecheck > /tmp/f11d-typecheck2.log 2>&1; echo "typecheck $?"` | 0 |
| verificação | `npm run verify > /tmp/f11d-verify2.log 2>&1; echo "verify $?"` | 0 |

**As outras três réguas do bloco:**

```
node tests/inicio/lista.mjs             # 94 células, todas verdes
node tests/inicio/mapa-distritos.mjs    # 20 células, todas verdes
node tests/inicio/mapa-navegacao.mjs    # 9 de 9 réguas passam
node tests/inicio/mapa-distritos.mjs --vermelhos  # 4 de 4, saída 0
```

**A medida do nível intermédio** (`node design/especime-v3/medicoes/mapa-alvos-nos-distritos.mjs`):

```
TOTAL nas páginas de distrito a 390: 84 de 308 com 44 px · mediana 34 px · pior camara-de-lobos 4 px
escrito design/especime-v3/medicoes/mapa-alvos-nos-distritos.json · 29 unidades, 308 concelhos
```

**As corridas do portão do GitHub**, uma por empurrão, todas em
`oestadodopais/o-estado-do-pais`, ramo `mapa-2026-09-07`:

| corrida | commit | estado |
| --- | --- | --- |
| 34158597653 | `4f48283d` a geometria | verde |
| 34165392815 | `a4283021` os dois níveis | verde |
| 34167777812 | `08788742` o lugar do nome no distrito | verde |
| 34169496408 | `53fcda09` o relatório | cancelada pelo empurrão seguinte |
| 34170522631 | `21834314` o conserto do WebKit | verde |
| 34171768865 | `2e1b1b52` a medida do nível intermédio | verde |
| 34174012744 | `abe7cabd` as horas dos portões | verde |
| 34202581197 | `b0154ce6` a segunda passagem (o portão, o guião e a régua) | verde |
| a última | o commit deste relatório | a correr ao fechar o bloco |

## O que fica por fazer

* **A decisão da lista dos nomes** (aberta ou fechada), com a medida do P1 em
  cima da mesa.
* **O nome de um concelho debaixo do cursor num portátil com ecrã táctil**
  (achado 8 do construtor, segunda passagem): medido, não decidido.
* **Os Açores no nível da região**: as nove ilhas herdam a escala do encaixe do
  nível do país (0,378 da escala do continente), e por isso o alvo de um concelho
  açoriano é de 2 px na mediana. Uma grelha própria para o arquipélago, sem o
  encaixe, é a resposta óbvia e não está no brief: fica escrita aqui com o número.
