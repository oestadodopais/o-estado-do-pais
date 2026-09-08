# F1.1e · os distritos e as ilhas voltam ao mapa, e cada um cresce para os seus concelhos

*Construtor Claude Opus 5, 08.09.2026, ramo `distritos-2026-09-08` (tirado de
`fe6478aa`, a cabeça de `main`). Brief:
`design/observatorio/BRIEF-F1.1e-os-distritos-voltam-ao-mapa.md`, com a **Emenda
de 08.09 (segunda passagem)** na §5 dele. **Duas passagens**: a primeira fechou
em `635e6d7f`, e a segunda corre depois da leitura a frio do Codex e da medição
às cegas do Sonnet sobre essa cabeça. A tabela das medidas e todos os números
deste relatório são os da SEGUNDA passagem; o que a primeira dizia e a segunda
corrigiu está na secção «Segunda passagem (08.09)», no fim. Sem travessões na
prosa.*

## As onze medidas, antes e depois

*A tabela vem primeiro por decisão do lugar de direção de 07.09.2026. Cada linha
diz o que a medida era antes deste bloco, o que é depois, e o comando que a
refaz. O «antes» de cada uma é o que o F1.1d deixou, medido por ele. **As nove
primeiras são as do brief; a U10 e a U11 entram com a Emenda de 08.09 (segunda
passagem)**, e o depois de todas é o da segunda passagem.*

| # | a medida | antes (F1.1d) | depois | o comando |
| --- | --- | --- | --- | --- |
| U1 | o alvo de cada área, pelo maior quadrado da grelha de 2 px que contém o ponto representativo | o nível do país eram **nove regiões**: 3 de 9 aos 44 px a 390 (mediana 18 px); os concelhos tocavam-se no nível de uma região: **20 de 308** aos 44 px, mediana **16 px** | o nível do país são as **29 unidades**: **1 de 29** a 390 (mediana 20 px) e **6 de 29** a 1280 (mediana 26 px); os concelhos tocam-se no nível da sua unidade: **105 de 308** aos 44 px, mediana **36 px**, o menor 8 px. **Medida e não exigida**, como o brief a escreve | `node tests/inicio/mapa-unidades.mjs` (U1a, U1b, U1c) |
| U2 | o nome da área apontada num lugar fixo, pelos três gestos e nas duas edições | 9 de 9 regiões e 30 de 30 concelhos | **29 de 29** unidades e **30 de 30** concelhos, pelo rato, pelo teclado e pelo dedo, nas duas edições, e **16 de 16** concelhos de Lisboa numa página de distrito | `node tests/inicio/mapa-unidades.mjs` (U2a a U2d) |
| U3 | o primeiro toque nunca navega; o segundo, ou a porta, abre | o toque numa região crescia-a | o toque numa **unidade** cresce-a, nos dois motores (Évora, 14 concelhos, `/#unidade=evora`); o primeiro toque num concelho diz o nome e o segundo abre; a página da unidade abre-se **pela porta** do lugar do nome (emenda de 08.09); um ficheiro que responde 404 devolve a ligação do servidor; e **duas respostas atrasadas com a ordem trocada** deixam o desenho e o histórico no último gesto, e o fragmento limpo a meio descarta o pedido | `node tests/inicio/mapa-unidades.mjs` (U3a a U3g) |
| U4 | sem guião, o mapa continua a ser navegação | 9 ligações para as páginas de região; a gaveta fechada com 9 regiões e 29 unidades | **29 ligações** para as 29 páginas de unidade, **29 de 29 respondem 200**, a gaveta **fechada** com as **29** unidades e mais nada, **0 regiões** desenhadas ou listadas, o segundo nível com **0 nós**, `#unidade=` ignorado sem erro | `node tests/inicio/mapa-unidades.mjs` (U4) |
| U5 | a altura de `/` a 390, com guião, em repouso | **3 263 px** (a medida da P5 do F1.1d, cabeça `c9823939`) | **3 263 px**, na mesma largura e no mesmo motor: **igual**, que é o que o brief pede («igual ou menor») | `node tests/inicio/mapa-unidades.mjs` (U5) |
| U6 | o portão da geometria | **10 regras**, 24 estragos (a R8, a R9 e a R10 provavam a geometria calculada das nove regiões) | **9 regras**, **21 estragos e 21 apanhados**: as R8, R9 e R10 saem com o cálculo; entra uma **R8 nova** que compara os 29 ficheiros servidos com os artefactos, byte a byte, dos três lados; e entra a **R9** da emenda de 08.09, que afirma as **680 páginas** que o mapa promete (58 de unidade e 616 de concelho, nas duas edições) em vez de as imprimir | `node scripts/check-mapa.mjs` e `node scripts/check-mapa.mjs --vermelhos` |
| U7 | a página do concelho com o nível da unidade | não existia: o cartão da página do concelho era o mapa de **308 pontos** de 7,35 px | o componente ganha o nível como parâmetro, e a régua mede-o sobre uma **página de prova** que ela própria constrói: **14 áreas** para os 14 concelhos de Évora, **0 pontos**, o concelho da página com o **anel** (traço 3 contra 1), a porta a abrir o vizinho apontado. A página real do concelho fará a troca de uma linha, e mede-se na aterragem do F1.10, por decisão do lugar de direção de 08.09 sobre de quem é aquele ficheiro nesse dia | `node tests/inicio/mapa-unidades.mjs` (U7) |
| U8 | as réguas e os três portões | a régua do bloco com 27 células; `lista` 94 de 94; `mapa-distritos` 20 de 20 (M1 e M2 retiradas) | a régua do bloco com **34 células**, todas verdes; `lista` **94 de 94**; `mapa-distritos` **43 de 43** (M1 e M2 de volta); `mapa-navegacao` **9 de 9** (a prova da lente da N2 reescrita, com a razão e o conhecido-positivo); `build`, `verify` e `typecheck` a **0** | `node design/especime-v3/medicoes/resumo-das-reguas.mjs`, e `npm run build`, `npm run verify`, `npm run typecheck` |
| U9 | as plantas | 7 na régua do bloco, 24 no portão do mapa, 4 na régua dos distritos | **13 de 13** na régua do bloco (as cinco que o brief nomeia e três da segunda passagem), **21 de 21** no portão do mapa, **8 de 8** na régua dos distritos, **15 de 15** na régua dos nomes (as duas do par arranjadas no F1.1e, e as três que não mordiam corrigidas na segunda passagem) | `--vermelhos` em cada uma, ou o guião do resumo |
| U10 | *(emenda de 08.09)* as duas molduras não se cruzam, e cada ilha fica dentro da sua | as caixas do artefacto cruzavam-se em **1 004 × 1 296 unidades** do campo, e no ecrã **64 × 83 px a 390** e **85 × 110 px a 1280** (medido às cegas pelo Sonnet) | **não se cruzam** a 390, a 768 nem a 1280, e os **11 polígonos** das duas parcelas com moldura ficam dentro da sua (0 fora). Os Açores por cima da Madeira, os dois à esquerda do continente | `node tests/inicio/mapa-unidades.mjs` (U10) |
| U11 | *(emenda de 08.09)* de quem é a pasta do segundo nível servido | o copiador apagava tudo o que não fosse uma das 29, e a R8 recusava qualquer outro nome | o copiador e a R8 são donos de **`unidade-*.json` e de mais nada**: um ficheiro estranho **sobrevive** ao copiador e ao portão, e um `unidade-*.json` a mais **sai com a linha a dizê-lo** | `node tests/inicio/mapa-unidades.mjs` (U11) |

## O que ficou construído

O nível do país do mapa da primeira página volta a ser **as 29 unidades da
Carta** (os 18 distritos, as duas ilhas da Madeira e as nove dos Açores), cada
uma a ligação da sua página. Ao tocar, clicar ou premir Enter numa delas o
desenho cresce e mostra **os concelhos dessa unidade**, lidos de um ficheiro que
a própria área nomeia. O **lugar do nome**, a porta «Abrir →», a porta «← Voltar
ao país», a regra do primeiro toque e o fragmento no endereço são os mesmos que o
F1.1d construiu: o que mudou foi o que cresce, e o fragmento passa de `#regiao=`
a `#unidade=`.

As **nove regiões NUTS II** saem do desenho e da lista dos nomes. Continuam a ter
página (`/regioes/<slug>`), a régua da convergência e o menu: saíram do desenho e
não do sítio.

A decisão é do diretor, a 08.09 à tarde, e corrige a primeira leitura do lugar de
direção: «the map on the first page we had before was quite alright … we can
select Évora and we have all the municipalities … then we can select Beja or
Viseu; those ones are recognizable; the other one, a full Alentejo with all the
things, it's not easy to go about».

**E a segunda passagem juntou-lhe cinco coisas**, todas da Emenda de 08.09 ao
brief: a regra do gesto no guião (uma resposta atrasada não manda no desenho nem
no histórico), a arrumação dos dois insertos (as molduras da Madeira e dos Açores
deixam de se cruzar), a regra R9 do portão (uma página prometida em falta é
vermelho), o padrão `unidade-*.json` como fronteira da pasta servida, e as três
plantas de `lista.mjs` que não mordiam.

## O segundo nível deixa de se calcular, e por isso a prova é mais forte

O F1.1d tinha de **calcular** o segundo nível: as nove regiões NUTS II não
existem em artefacto nenhum, e os concelhos de uma região vinham de unidades
diferentes, cada uma desenhada na sua grelha local, que era preciso levar ao
campo do país e daí à grelha da região. Eram 49 310 B de gerador, um ficheiro
gerado de 28 111 B, nove ficheiros de cliente de 237 116 B e três regras de
portão (R8, R9 e R10) só para provar que a conta estava certa.

O nível da unidade não precisa de conta nenhuma: **os concelhos de um distrito ou
de uma ilha já estão desenhados juntos, na grelha daquela unidade, no ficheiro
que o motor exportou**. O segundo nível do mapa é, byte a byte, o artefacto que a
página do distrito já desenha, e a única coisa que faltava era ele estar onde o
navegador o pode pedir.

| o que sai | bytes |
| --- | --- |
| `scripts/mapa-regioes.mjs` | 49 310 |
| `src/data/mapa-regioes.gerado.json` | 28 111 |
| `src/lib/mapa-regioes.mjs` | 3 954 |
| `public/dados/mapa/regiao-*.json` (nove) | 237 116 |

| o que entra | bytes |
| --- | --- |
| `scripts/mapa-unidades.mjs` (copia e confere) | 8 533 |
| `public/dados/mapa/unidade-*.json` (29) | **394 614** |

*As duas contas de cima medem-se com `wc -c` e com a soma dos 29 ficheiros; a
primeira passagem escreveu 7 172 B para o copiador, e o ficheiro tinha 7 428 B ao
fechar (leitura a frio do Codex, Minor 13). Os comandos:*

```
wc -c scripts/mapa-unidades.mjs                     # 8 533
find public/dados/mapa -name 'unidade-*.json' | wc -l   # 29
cat public/dados/mapa/unidade-*.json | wc -c        # 394 614
```

Os 29 ficheiros pesam mais no repositório do que os nove que substituem, e
**menos por pedido**: o guião pede um por unidade aberta, e o maior é
`unidade-viseu.json` com **24 245 B** contra os 56 717 B do maior ficheiro de
região. O menor é `unidade-ilha-de-sao-jorge.json`, com 3 691 B.

**A conferência que substitui as três regras é uma comparação de bytes**, e é
mais forte do que elas: a R8 nova exige que cada `public/dados/mapa/unidade-<slug>.json`
seja **igual, byte a byte**, a `mapa/distritos/<slug>.json`, que a R1 já prende ao
seu resumo sha256 no manifesto do motor; que `dist/` seja igual a `public/`; que
não haja um ficheiro a mais dos dois lados; que os 308 concelhos apareçam uma vez
cada na geometria servida, medidos contra `slugsDaCarta()`; e que **cada área da
primeira página peça o ficheiro da sua unidade** e não o de outra. Nada disto
importa o gerador: uma conferência que chamasse o gerador confirmava-se a si
própria.

## As medidas de aceitação, em detalhe

O comando de todas as células da régua é o mesmo:

```
node tests/inicio/mapa-unidades.mjs             # 34 de 34 células passam
node tests/inicio/mapa-unidades.mjs --vermelhos # 13 de 13 plantas apanhadas, saída 0
```

### U1 · os alvos · **medida, não exigida**

O brief escreve-o na própria medida: «a medida é a subida, dita, e não os 44 px
em todos: o diretor escolheu a área que se reconhece pelo nome, e isso fica
escrito». As células U1a e U1b imprimem os números e dizem-no no nome; o que
exigem é que a medição corra sobre 29 de 29 e 308 de 308 e que nenhum ponto
representativo caia fora da sua área.

**O quadrado que esta régua mede é o maior quadrado da grelha de 2 px que CONTÉM
o ponto representativo**, e não o maior quadrado **centrado** nele. A grelha
alinha-se ao ponto (ele é sempre um nó dela) e a busca corre todos os quadrados
da grelha que o contêm. As duas definições são medidas honestas de coisas
diferentes, e a do centro é o **limite inferior estrito** da desta. É a mesma
conta e o mesmo passo do F1.1d e das células M1 e M2 de `mapa-distritos.mjs`. O
Sonnet mediu às cegas a definição do centro, e os números dele estão mais abaixo,
lado a lado com estes.

**E a mediana é a mediana** (emenda da segunda passagem, achado 15): com `n` par
é a média dos dois do meio, e não o observado de cima. Estava errada nos dois
guiões (esta régua e `mapa-alvos-nos-distritos.mjs`). Os três números do topo não
mudaram com a emenda (a mediana dos 308 continua a dar 36 px, porque os dois do
meio são iguais, e as 29 unidades são um número ímpar), mas **treze das 29
medianas por unidade mudaram**: Lisboa de 50 para 46 px, Vila Real de 44 para 40,
a Ilha Terceira de 100 para 93, as Flores de 180 para 174, e por aí. A tabela
abaixo é a da definição certa.

**As 29 unidades, no nível do país:**

| largura | desenho | chegam aos 44 px | mediana | a maior | com menos de 2 px | o ponto fora da área |
| --- | --- | --- | --- | --- | --- | --- |
| 390 | 390 × 514 px | **1 de 29** | 20 px | Beja, 46 px | 7 | 0 |
| 1280 | 518 × 683 px | **6 de 29** | 26 px | Beja, 62 px | 5 | 0 |

As sete de menos de 2 px a 390 são ilhas dos Açores e o Porto Santo: uma área
menor do que o passo da grelha àquela largura. Quem responde por elas é a rede
dos nomes, e a U1c **exige-a**.

*Pela CAIXA em vez do quadrado inscrito seriam 19 de 29 a 390 e 19 de 29 a 1280
(células M1b e M2·390b de `tests/inicio/mapa-distritos.mjs`, que voltaram neste
bloco). A caixa sobrestima, e é por isso que a casa mede o quadrado inscrito
desde a I82.*

**Os 308 concelhos, a 390, no nível da sua unidade: 308 de 308 medidos, todos com
o ponto dentro da sua área, 105 chegam aos 44 px, mediana 36 px.** Contra 20 de
308 e mediana de 16 px no nível de uma região (F1.1d), e contra os 84 de 308 e
mediana de 34 px que o F1.1d mediu nas páginas de distrito construídas (desenho
de 354 px; aqui o desenho tem 390).

| unidade | concelhos | chegam | mediana | o menor |
| --- | --- | --- | --- | --- |
| Aveiro | 19 | 10 | 48 px | 12 px |
| Bragança | 12 | 9 | 48 px | 28 px |
| Guarda | 14 | 9 | 51 px | 20 px |
| Lisboa | 16 | 8 | 46 px | 18 px |
| Santarém | 21 | 7 | 36 px | 8 px |
| Vila Real | 14 | 7 | 40 px | 12 px |
| Braga | 14 | 6 | 42 px | 14 px |
| Viana do Castelo | 10 | 6 | 51 px | 28 px |
| Castelo Branco | 11 | 5 | 40 px | 18 px |
| Viseu | 24 | 5 | 33 px | 24 px |
| Beja | 14 | 4 | 38 px | 14 px |
| Portalegre | 15 | 4 | 38 px | 22 px |
| Setúbal | 13 | 4 | 28 px | 10 px |
| Évora | 14 | 3 | 35 px | 14 px |
| Faro | 16 | 2 | 23 px | 8 px |
| Ilha das Flores | 2 | 2 | 174 px | 168 px |
| Ilha Terceira | 2 | 2 | 93 px | 86 px |
| Leiria | 16 | 2 | 22 px | 12 px |
| Porto | 18 | 2 | 32 px | 16 px |
| Coimbra | 17 | 1 | 32 px | 20 px |
| Ilha da Graciosa | 1 | 1 | 182 px | 182 px |
| Ilha de Porto Santo | 1 | 1 | 116 px | 116 px |
| Ilha de Santa Maria | 1 | 1 | 144 px | 144 px |
| Ilha de São Miguel | 6 | 1 | 32 px | 22 px |
| Ilha do Corvo | 1 | 1 | 292 px | 292 px |
| Ilha do Faial | 1 | 1 | 186 px | 186 px |
| Ilha do Pico | 3 | 1 | 42 px | 40 px |
| Ilha da Madeira | 10 | 0 | 15 px | 10 px |
| Ilha de São Jorge | 2 | 0 | 33 px | 32 px |

**O que o bloco entrega é uma subida grande e não a meta:** de 20 para 105 dos
308 concelhos acima dos 44 px, e a mediana de 16 px para 36 px. O nível de cima
troca 3 de 9 áreas por 1 de 29, e é a troca que o diretor escolheu: as 29 são as
áreas que se reconhecem pelo nome, e as que não chegam a um dedo respondem-se
pela rede dos nomes, que está toda na página. **A U1c mede-a como conjunto
exacto** (emenda da segunda passagem, achado 16): as 29 da lista fechada são as
29 do artefacto, e os 308 slugs do índice dos concelhos são os 308 da Carta,
**uma ligação cada**, sem repetidos e sem nenhum a mais. A primeira forma da
célula aceitava `>= 308` e não olhava para os slugs: um concelho em falta
compensado por um repetido ficava verde.

**O menor concelho medível pediria um desenho de 2 145 px de largura** para
chegar aos 44 px, contra os 8 580 px que o F1.1d mediu no nível da região: a
segunda meta continua fora de alcance, e a resposta continua a ser a mesma, a
rede dos nomes e a busca dos 308.

### U2 · o nome no lugar, pelos três gestos e nas duas edições

`node tests/inicio/mapa-unidades.mjs` (U2a a U2d). **29 de 29** unidades dizem o
seu nome ao passar o rato e ao focar com o teclado, cada uma com a porta da sua
página; numa amostra de 30 concelhos (dez em cada uma das três unidades com mais
concelhos, contadas do artefacto: Viseu, Santarém e Aveiro) os 30 dizem o nome da
Carta e levam a porta certa; na página do distrito de Lisboa os 16 concelhos
fazem o mesmo, sem porta de voltar. **Com o dedo** (contexto com `hasTouch`, a
390): 29 de 29 e 30 de 30 em cada edição, com o nome e a porta **afirmados** e
nenhum toque a navegar.

**O nome esperado lê-se da Carta, dos dois lados** (emenda da segunda passagem,
achado 17): o de uma unidade de `mapa/pais.json` e o de um concelho do ficheiro
da sua unidade. A primeira passagem lia o esperado de uma unidade do `<title>` da
própria área, e um `<title>` errado confirmava-se a si próprio; a U2a exigia
apenas que o rato e o foco repetissem o mesmo texto não vazio.

### U3 · o primeiro toque nunca navega

`node tests/inicio/mapa-unidades.mjs` (U3a a U3g). Com o **dedo**, nos dois
motores: o toque em **Évora** cresce-a sem navegar (nível «unidade», 14
concelhos, endereço `/#unidade=evora`, nome «Évora» com a porta
`/distritos/evora`), o primeiro toque num concelho diz «Montemor-o-Novo» e deixa
o endereço em `/`, o segundo abre `/municipios/montemor-o-novo`. Com o **rato**:
«Voltar ao país» sobe e o botão de voltar do navegador desfaz o que o toque
escreveu (`#unidade=beja`). A porta do lugar do nome abre `/distritos/faro`. Numa
página de distrito, o primeiro toque diz «Sintra» e o segundo abre
`/municipios/sintra`. Com o ficheiro de Faro a responder 404, o mapa fica no
nível do país, o lugar do nome diz «O mapa desta área não abriu. A porta leva à
página dela.» e **o toque seguinte abre `/distritos/faro`** pela ligação do
servidor.

**A página de uma unidade abre-se pela porta do lugar do nome, e não por um
segundo toque na área.** É a **Emenda de 08.09 (segunda passagem)** ao brief,
escrita pelo lugar de direção depois de a leitura a frio ter apanhado que o item
2 pedia um segundo toque que o construído não dá (achado 4). A razão é de desenho
e não de código: ao primeiro toque a área cresce, o grupo do nível do país
esconde-se e o contorno dela deixa de estar no ecrã, de maneira que não há alvo
nenhum para receber um segundo toque. A regra dos dois toques vale inteira para
um **concelho**, que não cresce, e é a U3a e a U3d que a medem. A célula U3c
leva a decisão no nome, para que uma célula verde não passe por cumprimento do
brief original.

**E as respostas chegam pela ordem que a rede quiser** (emenda da segunda
passagem, achado 6). Cada gesto leva um número; a resposta de um pedido só se
aplica se for a do último gesto e se o fragmento ainda for o dela; o histórico
escreve-se pela ordem dos gestos, porque o `pushState` vive dentro da resposta
que a marca do gesto deixou passar; e limpar o fragmento com um pedido pendente
descarta a resposta. Duas células novas, as duas com `page.route` a atrasar o
ficheiro de uma unidade:

* **U3f**, com o toque em Évora (a responder em 1 200 ms) e a seguir em Beja (em
  60 ms): 2 400 ms depois o desenho está em **Beja**, com 14 concelhos e o
  primeiro «aljustrel», o endereço em `#unidade=beja`, e um passo atrás do
  navegador leva ao nível do país sem fragmento nenhum;
* **U3g**, com `#unidade=evora` a responder em 1 200 ms e o fragmento limpo
  200 ms depois: 2 400 ms depois o nível é «pais», o endereço não tem fragmento,
  o segundo nível tem **0 concelhos** e a porta de voltar está escondida.

Duas plantas: uma tira as duas condições da marca do gesto (e as duas células
ficam vermelhas), e a outra faz o número do gesto não avançar (e só a U3g fica
vermelha, que é como se vê que as duas condições não são a mesma).

A distinção entre o dedo e o rato continua a ler-se do `pointerdown` e não do
`pointerType` do clique, pela medição do F1.1d: o WebKit diz «mouse» para um
clique feito com o dedo. A célula U3a corre nos dois motores, e é a única do
bloco que o faz.

### U4 · sem guião

`node tests/inicio/mapa-unidades.mjs` (U4, nas duas edições, com
`javaScriptEnabled: false`). **29 áreas, 29 com destino em `/distritos/` (e
`/en/districts/`), 29 de 29 respondem 200**; a gaveta dos nomes **fechada** com as
29 unidades; **0 ligações para `/regioes/` no desenho ou na lista**; o lugar do
nome não se rende; o segundo nível tem zero nós; e `/#unidade=evora` abre a
primeira página sem erro nenhum.

### U5 · a altura, contra a de partida

`node tests/inicio/mapa-unidades.mjs` (U5). O **antes** é a página como o F1.1d a
deixou, e o número não se mede outra vez: lê-se do artefacto que a régua desse
bloco gravou, `design/especime-v3/medicoes/mapa-medidas.json`, chave
`medidas.altura.depois`, cabeça `c9823939`, medido a 390 × 664 em Chromium:
**3 263 px**. O **depois** é esta árvore: **3 263 px**, na mesma largura e no
mesmo motor. O brief pede «igual ou menor», e o resultado é **igual ao píxel**: a
gaveta dos nomes tem menos nove nomes e continua fechada, e o desenho tem a
mesma caixa. Na mesma construção, a gaveta aberta dá **3 794 px** (eram 3 953 com
as nove regiões à frente) e sem guião **4 048 px**.

### U6 · o portão da geometria

```
node scripts/check-mapa.mjs               # 9 regras verdes
node scripts/check-mapa.mjs --vermelhos   # 21 estragos, 21 apanhados, saída 0
```

As R8, R9 e R10 do F1.1d saem com o cálculo que provavam, e com elas saem os
seus oito estragos plantados. Entra uma **R8 nova**, com quatro estragos que
mordem: um nome mudado dentro do ficheiro servido dos dois lados, um byte a mais
só em `dist/`, um ficheiro servido a mais, e uma área da primeira página a pedir
o ficheiro de outra unidade. A **R4** volta de «nove ligações de área» a «29», e
a lista esperada passa a vir de `mapa/pais.json` e não de uma lista da casa.

**E entra uma R9 na segunda passagem** (achado 8 da leitura a frio): uma página
esperada em falta era silêncio e passa a ser vermelho. `lePagina()` devolvia
`null` e o mundo do portão só juntava as páginas que existiam, de maneira que uma
edição da primeira página em falta deixava a R4 sem nada para conferir e a linha
do fim IMPRIMIA o número de páginas de distrito construídas em vez de o afirmar.
O mundo passa a declarar o que espera, e a R9 recusa qualquer uma que falte: as
duas edições da primeira página, as 58 de unidade, as 616 de concelho, os dois
índices dos concelhos e as duas páginas da linha da Carta. **680 páginas
prometidas e construídas**, afirmadas e não impressas. Três estragos, um por
família (a primeira página inglesa, uma página de unidade e uma de concelho).

**A pasta do segundo nível servido deixa de ser deste bloco** (achado 11). A
metade «nenhum ficheiro a mais» da R8 recusava qualquer nome que não fosse uma
das 29, e o copiador apagava tudo o resto para a construção poder fechar: um
artefacto de mapa que ali viesse a viver com outro nome desaparecia em silêncio.
A regra e o copiador passam a ser donos de **`unidade-*.json` e de mais nada**;
um `unidade-*.json` fora das 29 sai com a linha a dizê-lo, e o que tiver outro
nome não se conta nem se toca. O conhecido-positivo é a célula U11, e é em disco.

### U7 · a página do concelho com o nível da unidade

**O componente do mapa ganha o nível como parâmetro** (`nivel`), com três valores
e nenhum desenho novo:

* `pais` (o defeito na postura inteira) · as 29 unidades da Carta como áreas,
  com o segundo nível vazio à espera do guião;
* `unidade` · os concelhos de uma unidade, cada um a porta da sua página, com
  `escolhido` a levar o anel;
* `pontos` (o defeito nas outras posturas) · os 308 pontos da Emenda 3.

`unidade` é o slug da unidade e **não se exige**: com `nivel="unidade"` e um
concelho escolhido, a unidade lê-se do artefacto que o contém
(`unidadeDoConcelho()`, um índice feito uma vez dos 29 ficheiros do motor), que é
a Carta e não uma segunda lista.

**A troca que a página do concelho fará, e que este bloco NÃO faz.** O item 4 do
brief manda trocar aqui («o mapa que substituiu o cartador dos pontos passa a ser
o nível da **unidade** do concelho … se o F1.10 tiver posto o nível da região,
troca-se aqui»), e a primeira passagem deste relatório escreveu o contrário: que
o brief mandava não tocar em `src/views/MunicipioView.astro`. Era falso, e a
leitura a frio do Codex de 08.09.2026 apanhou-o (Blocking 1).

**A razão de não trocar é outra, e é uma decisão do lugar de direção de
08.09.2026:** naquele dia o ficheiro é do F1.10, que corre em paralelo e mexe
nele (item 8.17 do brief dele); a troca de uma linha faz-se na aterragem do
F1.10, depois de este bloco aterrar em `main`, e é aí que a U7 se mede na página
real do concelho. O que este bloco entrega é o nível como parâmetro do
componente, medido pela U7 sobre uma página de prova. A troca é uma linha, na
chamada que já existe:

```diff
     <MapaRespira
       slot="instrumento"
       s={s}
       lang={lang}
       concelhos={concelhos()}
       postura="localizador"
+      nivel="unidade"
       escolhido={slug}
     />
```

Se o F1.10 tiver posto ali o nível da região, a troca é a mesma linha com outro
valor. Nada mais muda: `postura="localizador"` continua a governar o cartão, o
nome, o selo e a porta «trocar de concelho», e o guião do lugar do nome vem com o
componente (ver os achados).

**A célula U7 mede-o hoje, sobre uma página de prova que a própria régua
constrói.** É uma página Astro de uma linha que rende `MapaRespira` com
`nivel="unidade"` e `escolhido="evora"`, na mesma postura de localizador em que a
página do concelho o rende, com as folhas que a página `/municipios/evora`
construída declara. Constrói-se com uma configuração própria para dentro de
`dist/` em menos de dois segundos e **apaga-se no fim da corrida**, nos dois
caminhos (as células e as plantas): o sítio não ganha página nenhuma, o
repositório não ganha ficheiro nenhum, e os portões não têm uma página a mais
para varrer. Medido:

* nível `unidade`, **14 áreas** para os 14 concelhos de Évora, cada uma a ligação
  da página do seu concelho;
* **0 pontos** (`.mapa-pontos .mun`): o cartão de 308 pontos não se rende;
* o concelho da página com o **anel**: traço 3 px contra 1 px nos outros treze;
* **0 portas de voltar**, porque um nível só não sobe;
* o rótulo do desenho é «Mapa dos concelhos do distrito ou da ilha, com uma área
  por concelho.»;
* ao tocar o vizinho, o lugar do nome diz «Alandroal» e a porta leva a
  `/municipios/alandroal`, e ela abre.

A planta «o concelho da página sem o anel» põe a célula vermelha.

### U8 · as réguas e os três portões

| régua | comando | células | plantas |
| --- | --- | --- | --- |
| a régua do bloco | `node tests/inicio/mapa-unidades.mjs` | 34 de 34 | 13 de 13 |
| os nomes ao lado do mapa | `node tests/inicio/lista.mjs` | 94 de 94 | 15 de 15 |
| o mapa por distritos | `node tests/inicio/mapa-distritos.mjs` | 43 de 43 | 8 de 8 |
| o mapa é navegação | `node tests/inicio/mapa-navegacao.mjs` | 9 de 9 | sem plantas |

*Os quatro pares de números refazem-se com um comando, e ficam guardados com a
data em `design/especime-v3/medicoes/distritos-medidas.json`, chave `reguas`:*

```
node design/especime-v3/medicoes/resumo-das-reguas.mjs
```

**O que foi reescrito, e a razão de cada coisa:**

* `tests/inicio/mapa-regioes.mjs` passa a `tests/inicio/mapa-unidades.mjs`, e o
  nome mudou porque o desenho mudou: uma régua chamada «regiões» a medir unidades
  é um nome a mentir sobre o que ela lê. As células passam de P a U, que são as
  letras do brief novo, e a fonte passa do ficheiro gerado das nove regiões para
  `mapa/pais.json` e os 29 artefactos. As três células do contraste e da região
  viva (as P7 do F1.1d) ficam com o nome U8a, U8b e U8c: o lugar do nome não
  mudou neste bloco, e uma célula verde que continua a valer não se deita fora
  por causa de uma renumeração.
* `mapa-distritos.mjs`: as células **M1 e M2** voltam, com a mesma conta e o mesmo
  passo, e com elas voltam as quatro plantas que saíram com elas e o corredor que
  as chama (agora com a condição a excluir a M10, que é a única outra célula cujo
  nome começa por «M1»). A quinta planta pintava `[data-unidade="centro"]`, que
  era o slug de uma região: passa a pintar Évora.
* `lista.mjs`: o par de estado volta das nove regiões para as **29 unidades**, a
  lista passa a ter **29 nomes** e **três grupos** (as parcelas da Carta), e a
  célula L1 passa a exigir a **igualdade** entre a lista e o desenho, que é mais
  forte do que o que ela exigia com dois conjuntos diferentes.
* `mapa-navegacao.mjs`: a nota da célula N4, que apontava para a régua com o nome
  antigo. **E, na segunda passagem, a prova da lente da N2**, que era uma
  aproximação e passa a ser a coisa: ela dizia «nenhum nó do mapa tem
  `transform`», que era a marca que a lente do zoom deixava (um `<g data-campo>`
  com um `transform` de 1× a 4× escrito pelo guião). A arrumação dos dois
  insertos faz o SERVIDOR escrever uma translação inteira nos caminhos dos dois
  arquipélagos, e a contagem a zero deixou de ser verdade sem que lente nenhuma
  voltasse. A N2 passa a medir a lente em quatro conferências, que juntas são
  mais fortes do que a contagem: nenhuma transformação com escala, rotação ou
  inclinação; cada `translate` com argumentos inteiros; as mesmas transformações
  nos dois estados (o país e a pesquisa aberta); e as mesmas depois de cinco
  entalhes da roda com o cursor dentro do mapa, que é o gesto por onde a lente
  entrava. **Conferido com um conhecido-positivo:** com `transform="scale(2)"`
  plantado à mão no `<g data-areas>` de `dist/index.html`, as duas células da N2
  ficam vermelhas; sem ele, 9 de 9.
* `design-bundle.mjs` (que corre no `verify`): o cartão do mapa volta a ler as 29
  unidades do artefacto em vez das nove regiões do ficheiro gerado.

### U9 · as plantas

```
node tests/inicio/mapa-unidades.mjs --vermelhos   # 13 de 13, saída 0
node scripts/check-mapa.mjs --vermelhos           # 21 de 21, saída 0
node tests/inicio/mapa-distritos.mjs --vermelhos  #  8 de  8, saída 0
node tests/inicio/lista.mjs --vermelhos           # 15 de 15, saída 0
```

As treze da régua do bloco, cada uma posta na resposta que o servidor dá e em
mais lado nenhum. **Todas as células que uma planta nomeia têm de ficar
vermelhas**, e não uma delas. As **cinco que o brief nomeia** estão marcadas com
um asterisco, e as **três da segunda passagem** com um sinal de mais:

| planta | células que ficam vermelhas |
| --- | --- |
| \* uma unidade sem nome no lugar (o `<title>` de Évora apagado) | U2a, nas duas edições |
| \* um concelho na unidade errada (mudado do ficheiro de Évora para o de Beja) | U1b |
| \* o primeiro toque num concelho a navegar | U3a, nos dois motores |
| a unidade cujo ficheiro não veio a ficar sem destino | U3e |
| um concelho a menos no ficheiro da geometria de uma unidade | U1b, e U2b nas duas edições |
| o lugar do nome retirado da página de um distrito | U2c nas duas edições, e U3d |
| \* a lista fechada dos nomes aberta por defeito | U4, nas duas edições |
| uma área do nível do país sem ligação, sem guião | U4, nas duas edições |
| \* uma região a voltar ao desenho (uma área a apontar para `/regioes/`) | U4, nas duas edições |
| o concelho da página sem o anel, no nível da unidade | U7 |
| + o guião sem a marca do gesto (uma resposta atrasada volta a mandar) | U3f e U3g |
| + o número do gesto a não avançar (o fragmento limpo deixa de invalidar o pedido) | U3g |
| + a arrumação dos insertos desfeita (as molduras como o artefacto as traz) | U10, às três larguras |

**A U11 é a sua própria planta**, e por isso não está nesta lista: as plantas
desta régua vivem na resposta que o servidor dá, e a U11 corre o copiador e o
portão do mapa DE VERDADE, com dois ficheiros de verdade na pasta servida (um
estranho, que tem de sobreviver, e um `unidade-*.json` a mais, que tem de sair
com a linha a dizê-lo). O `finally` apaga os dois e a célula compara a listagem
do fim com a do princípio.

**As três plantas de `lista.mjs` que não mordiam** (L1, L12 e L9) mordem, e a
régua dos nomes sai a **15 de 15**. Cada uma foi corrigida NA PLANTA e não na
célula, porque em cada uma o que caducou foi o estrago:

| planta | o que ela plantava | o que planta agora |
| --- | --- | --- |
| L1 | trocava a coluna da legenda com a do mapa, que era onde a lista vivia antes do F1.1 | move a **banda dos nomes** para antes do mapa no documento, que é a ordem que a L1 mede |
| L12 | `order:-1` na legenda dentro da coluna, que não a pode pôr abaixo de uma banda que vive fora da grelha | move a **legenda para depois da banda dos nomes** |
| L9 | punha a rede em linha a partir de 1024, que é hoje o estado CERTO | põe **duas formas na mesma largura**: o continente em linha e os arquipélagos em coluna |

### U10 · as duas molduras não se cruzam · *emenda de 08.09 (segunda passagem)*

`node tests/inicio/mapa-unidades.mjs` (U10, às três larguras). **As duas caixas
do artefacto cruzavam-se**, e o desenho mostrava dois rectângulos um por cima do
outro: a moldura da Madeira é `[1527, 4526, 1358, 3496]` e a dos Açores é
`[260, 6096, 2271, 1296]`, e as duas partilham **1 004 por 1 296 unidades** do
campo. No ecrã são 64 por 83 px a 390 e 85 por 110 px a 1280, medidos às cegas
pelo Sonnet a 08.09.

**A culpa não é de um erro.** A moldura de uma parcela é, por construção do motor
(MAPA.md §2), a caixa dos polígonos dela, e a caixa da Madeira desce da costa
norte da ilha até às **Selvagens**, 3 496 unidades quase todas de mar. O mapa dos
308 pontos, de onde a colocação das parcelas vem por ajuste, nunca viu este
cruzamento porque as Selvagens não são concelho e não têm ponto: as duas molduras
DELE não se tocam. O cruzamento nasce quando o desenho passa a ser de ÁREAS, e é
por isso que aparece com o mapa das unidades. Vem do F1.1c e não deste bloco, e é
o bloco do mapa que o corrige.

**O que a correção faz, e o que não faz.** Não mexe numa coordenada do artefacto:
nenhum polígono muda de forma, de escala ou de vizinho, e a geometria continua a
ser byte a byte a que o motor exportou (a R1 e a R8 do portão continuam verdes
sobre os mesmos bytes). O que `arrumacaoDasMolduras()` decide é ONDE cada inserto
se coloca dentro do campo, que é uma decisão de arrumação do sítio, e devolve-a
como uma **translação inteira por parcela**, escrita no `transform` de cada
caminho e da sua moldura.

**A regra é uma só, e a arrumação que ela dá é forçada pelo desenho:** as
molduras encostam-se ao fundo do campo pela ordem em que o artefacto as traz, a
primeira fica onde está e as seguintes sobem para cima dela, com a folga de uma
linha de nome entre o fundo de uma e o topo da outra. A primeira não tem para
onde ir (a caixa da Madeira acaba a **8 unidades** do fundo do campo, 8 022 de
8 030) e a segunda não cabe ao lado (os Açores medem 2 271 de largura e a Madeira
começa em x 1 527), de maneira que a única arrumação possível é a que sai daqui:
**os Açores por cima da Madeira, os dois à esquerda do continente**, que é também
a disposição geográfica e a que o lugar de direção recomendou.

A folga é a linha do nome e não um número escolhido: o nome de um arquipélago
mede `CORPO_DO_ARQ` e fica `ACIMA_DO_ARQ` por cima do topo da sua moldura, e a
folga é a soma dos dois. No campo do país isso dá **193 unidades**, e a translação
dos Açores é de **3 059 unidades para cima**.

| largura | Madeira | Açores | cruzam-se | polígonos fora da sua moldura |
| --- | --- | --- | --- | --- |
| 390 | 87 × 224 px em y 1 009 | 145 × 83 px em y 913 | **não** | 0 de 11 |
| 768 | 63 × 161 px em y 1 127 | 105 × 60 px em y 1 058 | **não** | 0 de 11 |
| 1280 | 116 × 297 px em y 776 | 193 × 110 px em y 650 | **não** | 0 de 11 |

Os onze polígonos são as duas unidades da Madeira (com as Selvagens, que fazem a
moldura alta) e as nove ilhas dos Açores; a caixa de cada um lê-se no ecrã, e a
folga de um píxel é o traço, que não escala (`non-scaling-stroke`, 1 px). A
planta «a arrumação dos insertos desfeita» põe as três células vermelhas.

### U11 · de quem é a pasta do segundo nível servido · *emenda de 08.09*

`node tests/inicio/mapa-unidades.mjs` (U11). O copiador apagava, em modo de
escrita, tudo o que estivesse em `public/dados/mapa/` e não fosse uma das 29
unidades, e a R8 do portão recusava qualquer nome que não estivesse na lista. A
pasta não é deste bloco: é a pasta dos dados do mapa que o sítio serve, e um
artefacto que ali viesse a viver com outro nome desaparecia em silêncio na
construção seguinte.

A regra passa a ser **o padrão**: o copiador e a R8 são donos de `unidade-*.json`
e de mais nada. Um `unidade-*.json` que não seja de uma das 29 sai, com a linha a
dizê-lo; qualquer outro ficheiro não se toca nem se conta.

**O conhecido-positivo é em disco, porque é em disco que o defeito estava.** A
célula põe dois ficheiros na pasta servida (`leia-me-do-mapa.txt` e
`unidade-condado-portucalense.json`), corre o copiador nos dois modos e o portão
do mapa, e mede o que sobrou: o estranho **sobreviveu**, o intruso **saiu** e a
linha **disse-o**, ficaram 29 ficheiros de unidade, o copiador saiu a 0, a
conferência a 0 e o portão a 0 com o ficheiro estranho ainda na pasta. O
`finally` apaga os dois, e a célula compara a listagem do fim com a do princípio:
uma régua que deixasse lixo na pasta era pior do que o defeito que veio fechar.

## Os achados do construtor, contra o brief

1. **O segundo nível não se calcula: copia-se.** O brief deixa em aberto se os
   ficheiros do segundo nível se servem «como o F1.1d serviu as regiões, ou lidos
   de onde já está». Nem uma coisa nem outra na forma do F1.1d: `mapa/` é a pasta
   de chegada do exportador do motor e não a pasta que o Astro serve, e por isso
   há uma cópia, escrita na construção por `scripts/mapa-unidades.mjs` e
   reconferida byte a byte pelo portão. A conta e as três regras que a provavam
   saem inteiras.

2. **O gerador das regiões, as regras R8 a R10 e os ficheiros gerados saem: nada
   os lia.** O brief manda conferir e dizê-lo, e está conferido. Quem lia
   `src/data/mapa-regioes.gerado.json` eram seis sítios, todos deste bloco:
   `src/components/inicio/MapaRespira.astro`, `scripts/design-bundle.mjs`,
   `scripts/check-mapa.mjs` (R8, R9, R10) e as três réguas `tests/inicio/lista.mjs`,
   `tests/inicio/mapa-distritos.mjs` e `tests/inicio/mapa-regioes.mjs`. Nenhuma
   página de região lê geometria nenhuma, porque a **Emenda 21 (d)** decide que
   «uma região não tem mapa de pontos nem de áreas; tem a régua». Conferido com
   `grep -rn "regioesDoMapa\|mapa-regioes.gerado\|lib/mapa-regioes"` sobre
   `*.astro`, `*.mjs`, `*.js`, `*.ts` e `*.json`, fora de `node_modules` e de
   `dist/`, antes de apagar.

3. **O mapa passa a trazer o seu guião.** O guião do lugar do nome era pedido pela
   VISTA que rendia o mapa (`HomeView.astro`), e uma segunda vista que quisesse o
   mesmo mapa tinha de saber pedi-lo também: duas linhas em dois sítios para uma
   coisa só, e a segunda a esquecer-se. Passa a ser rendido por `MapaRespira`
   onde ele rende o lugar do nome, e a linha sai de `HomeView`. É o que torna a
   troca da página do concelho uma linha só, como o brief pede. A página de um
   distrito continua a pedi-lo por sua conta, porque desenha o seu mapa e não usa
   este componente.

4. **A cópia do rótulo num `data-` cegava a régua da voz, e a razão escrita na
   primeira passagem era falsa** (corrigido na segunda; leitura a frio do Codex,
   achado 14). As duas linhas do `distritosLabel` («Mapa dos distritos e das ilhas
   de Portugal, com uma área por unidade.» e a inglesa) passaram a `retirada` no
   F1.1d; o rótulo voltou com o desenho, e a primeira passagem deixou-as
   `retirada` a dizer que a régua da voz não recolhe o `aria-label` do `<svg>` da
   primeira página. **Não é verdade:** a régua lê os `aria-label` desde a I79. O
   que ela deita fora é a dica igual a um `data-` do PRÓPRIO elemento, porque essa
   é composta do livro-razão, e o `<svg>` levava um `data-rotulo-pais` com a mesma
   cadeia. A cópia saiu (o guião lê o `aria-label` que o servidor desenhou, que é
   o rótulo do país por construção), a régua vê a frase, e as duas linhas voltaram
   a `viva`. O portão di-lo: `check:voz` conta agora **708 vivas, todas rendidas;
   96 retiradas, nenhuma rendida** (eram 706 e 98).

5. **«As regiões» sai do inventário e não passa a `retirada`.** As rotas medidas
   por classe são `/` e `/en/`, e a prova do estado varre o sítio inteiro: a frase
   deixou de se render na primeira página e continua a render-se em `/regioes`.
   `viva` falharia por não render na rota do bloco, e `retirada` falharia por
   render fora dela. A linha sai do bloco `mapa`, e a razão fica escrita no
   inventário.

6. **Seis plantas declaravam-se a morder sem morderem, e nenhuma delas era deste
   bloco.** Quatro eram de `mapa-distritos.mjs` e saíram com as células M1 e M2 no
   F1.1d; voltaram com elas. Duas eram de `lista.mjs` e estavam mortas **desde o
   F1.1 de 03.09.2026**, que passou a raiz do par de estado de `.cabeca-grelha`
   para `:root`: as plantas procuravam `<style>.cabeca-grelha:has`, não encontravam
   nada, o HTML saía intacto e a corrida dizia «o HTML mudou: false». Estão
   arranjadas. **É a primeira vez que `--vermelhos` corre na régua dos nomes desde
   essa mudança**, e é o que o mostra: o F1.1d não a correu (a sua P9 lista três
   comandos e este não está lá).

7. **Três plantas de `lista.mjs` mudavam o HTML e não punham a célula vermelha, e
   não eram deste bloco.** Eram «a coluna das gavetas depois do mapa no documento»
   (célula L1), «a legenda por cima dos nomes em vez de por baixo» (L12) e «a
   forma em linha a 1024 e a 1280» (L9). As três mexiam em camadas da cabeça que
   mudaram de forma depois de as plantas terem sido escritas: a ordem do documento
   inverteu-se com o F1.1 (a lista chega aberta e vive depois do mapa, e a planta
   plantava o estado CERTO), e as outras duas eram folhas sobre uma arrumação que
   a cabeça já não tem. A primeira passagem mediu-as e deixou-as para o lugar de
   direção decidir; **a decisão veio na Emenda de 08.09, alínea (f), e as três
   estão corrigidas na segunda passagem**, cada uma na planta e não na célula. A
   régua dos nomes sai a **15 de 15**, saída 0; o que cada uma passou a plantar
   está na tabela da U9.

8. **A captura de 390 px pede um recorte e não a figura.** Abaixo de 640 o mapa
   toma a largura da JANELA e a figura tem a largura da coluna (I81): a 390 a
   figura mede 354 px a começar em x=18 e a tela mede 390 a começar em x=0. Uma
   captura do elemento da figura cortava 18 px do desenho de cada lado, e as
   capturas deste bloco recortam a UNIÃO das duas caixas, medida na página.

9. **As capturas dizem a frase do rato e não a do dedo, e é o desenho a funcionar.**
   As duas frases vazias de cada nível rendem-se as duas e é a folha que escolhe
   pelo `@media (hover: hover) and (pointer: fine)`; um contexto de captura sem
   toque mostra a do rato. Num telemóvel a frase é «Toque num distrito ou numa
   ilha», e é isso que a célula U2d mede com `hasTouch`.

## As cadeias

**Três frases novas, seis linhas com as duas edições**, todas de classe
`navegacao`, no `INVENTARIO-FRASES.md` com a razão e uma entrada em
`critica/REVISOES-DO-INVENTARIO.md` (bloco `mapa`):

`Toque num distrito ou numa ilha` · `Passe o rato por um distrito ou por uma
ilha` · `O mapa desta área não abriu. A porta leva à página dela.`, e as três
irmãs inglesas.

**Seis linhas passaram a `retirada`** com a razão: as quatro frases que diziam
«região» nas duas edições (`Toque numa região`, `Passe o rato por uma região`, e
as duas irmãs inglesas) e as duas do aviso do pedido que não volta. **Duas linhas
saíram do ficheiro** («As regiões» e «The regions»), pela razão do achado 5.
**Duas linhas `retirada` do F1.1d voltaram a `viva`** na segunda passagem, pela
razão do achado 4. São dezasseis linhas ao todo: seis vivas novas, seis passadas
a `retirada`, duas saídas do ficheiro e duas de volta a `viva`.

*A primeira passagem escreveu «oito linhas passaram a `retirada`», por ter
contado as duas do nome do mapa que já estavam `retirada` desde o F1.1d e que só
mudaram de razão (leitura a frio do Codex, Minor 13). A conta faz-se do próprio
inventário:*

```
awk -F'|' '/^\| navegacao \|/ && $4 ~ /mapa/ && $5 ~ /retirada/' \
  design/especime-v3/INVENTARIO-FRASES.md | wc -l    # 6
awk -F'|' '/^\| navegacao \|/ && $4 ~ /mapa/ && $5 ~ /viva/' \
  design/especime-v3/INVENTARIO-FRASES.md | wc -l    # 12
```

«O mapa desta ÁREA não abriu» e não «deste distrito»: as 29 são 18 distritos e 11
ilhas, e uma frase que nomeasse o distrito estava errada em onze delas.

## As capturas

```
node design/especime-v3/medicoes/capturas-do-mapa.mjs
```

`design/especime-v3/capturas/distritos-2026-09-08/`, oito ficheiros: o nível do
país e o nível de uma unidade (Évora), a 390 × 664 e a 1280, nas duas edições.
Cada uma é o recorte da união da figura com a tela, medido na página (achado 8):
390 × 608 px e 390 × 375 px a 390; 518 × 683 px e 518 × 467 px a 1280. O recorte
de cada uma fica escrito em `design/especime-v3/medicoes/capturas-do-mapa.json`,
com a data.

**As oito foram refeitas na segunda passagem**, com a arrumação das duas molduras
(achado 9 da leitura a frio): as da primeira passagem mostravam os dois
rectângulos cruzados. O guião que as faz é novo: as da primeira passagem foram
feitas à mão, e o relatório descrevia-as sem dar o comando que as refaz.

## As saídas, desta árvore

**O portão do mapa** (`node scripts/check-mapa.mjs`):

```
  ✓ R1 · os resumos de mapa/ batem com o manifesto
  ✓ R2 · a junção: 308 concelhos, uma vez cada, com os slugs da Carta
  ✓ R3 · cada página de distrito com tantas ligações quantos concelhos
  ✓ R4 · a primeira página com 29 ligações de área
  ✓ R5 · nenhuma ligação debaixo de role="img"
  ✓ R6 · a atribuição da DGT onde o mapa está
  ✓ R7 · a colação portuguesa nos artefactos e nas listas construídas
  ✓ R8 · os 29 ficheiros do segundo nível são os artefactos
  ✓ R9 · as páginas que o mapa promete estão todas construídas

  mapa · 30 ficheiros conferidos · 29 unidades · 308 concelhos, uma vez cada · 680 páginas prometidas e construídas (58 de unidade e 616 de concelho, nas duas edições)
```

**O gerador** (`npm run mapa:unidades -- --verifica`):

```
  ✓ mapa das unidades · 29 ficheiros · 308 concelhos · 394 614 B em public/dados/mapa/ · conferidos
```

**Os três portões**, com os códigos de saída lidos dos ficheiros em que foram
escritos:

```
npm run build      · saída 0   (7 222 páginas construídas)
npm run verify     · saída 0
npm run typecheck  · saída 0
```

## O que ficou por fazer

* **A troca de uma linha na página do concelho** (`src/views/MunicipioView.astro`),
  que é do F1.10 e está escrita acima, na U7. A U7 mede o componente sobre a
  página de prova; a página do concelho mede-se quando os dois blocos aterrarem,
  por decisão do lugar de direção de 08.09.2026 sobre de quem é o ficheiro nesse
  dia. **É a única coisa que a segunda passagem deixa em aberto.**
* **A leitura a frio do Codex sobre a SEGUNDA passagem**, que é de fora desta
  árvore e corre antes da fusão.

## O que um pacote de leitura não reproduz

*Emenda de 08.09 ao brief, alínea (g), a partir do achado 12 da leitura a frio:
a primeira passagem deu resultados («94 de 94», «43 de 43», dezoito plantas, três
códigos de saída, oito capturas) sem nada em disco que os reproduzisse. Um
pacote de leitura recebe os FICHEIROS do repositório e não a árvore construída
nem os artefactos do motor, e por isso há números deste relatório que ele não
pode conferir. Esta secção diz quais são, o que é preciso ter, o comando de cada
um, e onde o resultado fica guardado.*

| o que falta ao pacote | o que ele impede de conferir | o comando | onde o resultado fica |
| --- | --- | --- | --- |
| `dist/`, a árvore construída | tudo o que as quatro réguas medem, as capturas e sete das nove regras do portão do mapa | `npm run build` | `dist/`, que o `.gitignore` não segue |
| `mapa/manifest.json` e os 30 artefactos do motor | a R1 (os resumos sha256) e, com ela, a R8, que prende o que se serve ao que o motor exportou | vêm do motor (`python3 publisher/mapa_distritos.py --write`); estão no repositório e são conferidos pela R1 | `mapa/`, no repositório |
| as corridas das quatro réguas | as células e as plantas de cada uma | `node design/especime-v3/medicoes/resumo-das-reguas.mjs` | `design/especime-v3/medicoes/distritos-medidas.json`, chave `reguas`, com a data |
| a corrida do portão do mapa | as nove regras e os 21 estragos | `node scripts/check-mapa.mjs` e `node scripts/check-mapa.mjs --vermelhos` | a saída da corrida; o número das páginas prometidas está na linha do fim |
| as oito capturas | o que o desenho mostra | `node design/especime-v3/medicoes/capturas-do-mapa.mjs` | `design/especime-v3/capturas/distritos-2026-09-08/` e `design/especime-v3/medicoes/capturas-do-mapa.json` |
| os alvos das páginas de distrito (a medida do F1.1d) | o «antes» da U1 | `node design/especime-v3/medicoes/mapa-alvos-nos-distritos.mjs` | `design/especime-v3/medicoes/mapa-alvos-nos-distritos.json` |

**O que o pacote reproduz sozinho**, e a leitura a frio confirmou-o (achados 19 a
25): o artefacto do bloco com as células e as suas contagens; as 29 âncoras e a
gaveta fechada nas duas primeiras páginas construídas; os catorze slugs de Évora
iguais na página do distrito e no ficheiro servido; a regra do primeiro toque nos
dois motores; o fragmento a não poder escolher um caminho arbitrário; a cópia
byte a byte do copiador; e a aritmética dos ficheiros servidos (394 614 B, 308
slugs, o máximo de Viseu com 24 245 B e o mínimo de São Jorge com 3 691 B).

**A medição às cegas do Sonnet** sobre a cabeça da primeira passagem (`635e6d7f`)
está em `critica/2026-09-08-sonnet-medicao-f11e-distritos.md`, que o lugar de
direção guarda na árvore principal e não neste ramo. Bate certo com este
relatório na U2 (29 de 29 e 14 de 14 nos três gestos, nas duas edições), na U3,
na U4 (29 ligações, 29 a responder 200, a gaveta fechada com 29, 0 regiões), na
U5 (3 263 px) e na U7 (a página do concelho por trocar). **Na U1 dá números mais
baixos, e a diferença é de método e não de medida:** o quadrado dele é o que
cabe com o ponto numa de nove âncoras, validado por amostragem do perímetro, e o
desta régua é o maior quadrado da grelha de 2 px que CONTÉM o ponto; o dele é um
limite inferior do desta. Mediu 29 de 29 abaixo dos 44 px a 390 (mediana 16 px),
26 de 29 a 1280 (mediana 24 px), Évora crescida a 390 com 12 de 14 (mediana 29
px), Braga 12 de 14 e Porto 17 de 18. As duas leituras ficam lado a lado, como o
brief pede.

**E duas medidas dele entram na correção do achado 9:** as duas molduras
sobrepunham-se **64 por 83 px a 390 e 85 por 110 px a 1280**, e o centro da caixa
da Madeira cai fora do preenchimento por causa das Selvagens (um `hover` do
Playwright ao centro da caixa falha, e o medidor teve de apontar ao `ponto` do
artefacto, que é a mesma lição que a célula M6 tem escrita desde 26.08).

## Segunda passagem (08.09)

*A leitura a frio do Codex (`gpt-5.6-sol`, xhigh) sobre a cabeça da primeira
passagem, `635e6d7f`, deu 25 pontos: três Blocking, nove Major, cinco Minor e
sete confirmações. **Cinco deles eram estragos plantados pelo lugar de direção no
pacote e não achados**, e o construtor conferiu no ramo que cada um tem o
contrário do que o pacote mostrava: o Blocking 2 (o `aria-label` trocado entre os
níveis; no ramo é `nivel === 'pais' ? distritosLabel : concelhosLabel`), o
Blocking 3 (a R8 a comparar comprimentos; no ramo é `servido.equals(doMotor)`), o
Major 5 (o fragmento sem o `[a-z0-9-]+`; no ramo o padrão é
`/^#unidade=([a-z0-9-]+)$/`), o Major 7 (a U1a a aceitar nove áreas; no ramo é
`entradas.length === 29`) e a parte do Minor 13 que dizia «28 de 29» (a cadeia
não existe no relatório). Os restantes vinte estão nesta tabela.*

*Na coluna do número, `B` é Blocking, `M` é Major e `m` é Minor, com o número
que a leitura lhes deu.*

| # | o achado | o que se fez |
| --- | --- | --- |
| B1 | a U7 não se mede na página real do concelho, e o relatório dava ao brief a razão de não trocar | **Corrigido o relatório**, e não o código. O item 4 do brief manda trocar aqui; a razão de não trocar é a decisão do lugar de direção de 08.09 de o ficheiro `src/views/MunicipioView.astro` ser do F1.10 nesse dia. A troca de uma linha faz-se na aterragem do F1.10, e a U7 real mede-se aí |
| M4 | não há segundo toque numa unidade, e o brief pedia-o | **Decisão do lugar de direção, escrita**: uma unidade abre-se pela porta, e o segundo toque não existe porque a área deixou de estar no desenho; «o segundo toque, ou a porta, abre» vale para o concelho. Fica na §5 do brief (Emenda de 08.09), no nome e no comentário da célula U3c, e aqui |
| M6 | respostas fora de ordem podiam mandar no desenho e no histórico | **Corrigido o guião**: cada gesto leva um número, uma resposta só se aplica se for a do último gesto e se o fragmento ainda for o dela, o histórico escreve-se pela ordem dos gestos, e limpar o fragmento descarta o pedido pendente. Duas células novas (U3f e U3g) com duas plantas |
| M8 | o portão do mapa calava uma página construída em falta | **Regra R9 nova**: as duas edições da primeira página, as 58 de unidade, as 616 de concelho, os dois índices e as duas páginas da linha. 680 páginas afirmadas e não impressas, com três plantas (uma por família) |
| M9 | as molduras da Madeira e dos Açores sobrepunham-se | **Corrigido o desenho**: `arrumacaoDasMolduras()` coloca os insertos sem se cruzarem (os Açores por cima da Madeira, os dois à esquerda do continente). Célula U10 às três larguras, com planta; as oito capturas refeitas |
| M10 | três plantas de `lista.mjs` não mordiam | **Corrigidas as três plantas** (L1, L12 e L9), cada uma na planta e não na célula, com a razão escrita. `lista.mjs --vermelhos` sai a **15 de 15**, saída 0 |
| M11 | o copiador apagava tudo o que não fosse unidade na pasta servida | **Corrigidos o copiador e a R8**: são donos de `unidade-*.json` e de mais nada; um `unidade-*.json` a mais sai com a linha a dizê-lo. Célula U11, que é o conhecido-positivo em disco |
| M12 | os resultados não eram reproduzíveis a partir do pacote | **Secção nova** («O que um pacote de leitura não reproduz») com o comando de cada número, e dois guiões novos: `resumo-das-reguas.mjs` (que guarda as quatro réguas em `distritos-medidas.json`, chave `reguas`, com a data) e `capturas-do-mapa.mjs` |
| m13 | três números do relatório não batiam com os ficheiros | **Corrigidos e medidos**: o copiador tem **8 533 B** (`wc -c`), e as linhas do bloco no inventário são **seis** `retirada` e **doze** `viva`, contadas do próprio ficheiro. A terceira parte («28 de 29») era uma planta |
| m14 | duas etiquetas `aria-label` marcadas `retirada` rendiam-se | **Corrigido o desenho**, que é a mudança pequena: saiu o `data-rotulo-pais`, que era uma cópia do `aria-label` no mesmo elemento e fazia a régua da voz tratar a frase como composta do livro-razão. O guião lê o `aria-label` que o servidor desenhou, e as duas linhas voltaram a `viva`. `check:voz` conta agora 708 vivas e 96 retiradas (eram 706 e 98) |
| m15 | a mediana não era a mediana com `n` par | **Corrigida nos dois guiões** (a régua do bloco e `mapa-alvos-nos-distritos.mjs`): média dos dois do meio. Os números da U1 não mudaram (com 308 valores, os dois do meio são iguais), e a definição passou a ser a certa |
| m16 | a U1c aceitava `>= 308` e não comparava os slugs | **Corrigida a célula**: os 308 slugs do índice contra os 308 da Carta, como conjunto exacto, **uma ligação cada**, e as 29 da lista fechada do mesmo modo |
| m17 | a U2 lia o nome esperado do próprio `<title>` | **Corrigidas a U2a, a U2d e a U3a**: o nome esperado de uma unidade lê-se de `mapa/pais.json`, que é a Carta, e nunca do desenho que está a ser conferido |
| 18 | «a política da casa» no rodapé | **Não é achado**: «a casa» é o vocabulário do sítio para si mesmo (`VISAO.md`), e a regra da Emenda 15 é sobre a maquinaria (os blocos, o livro-razão, o corredor). O rodapé não se toca |
| 19 a 25 | as sete confirmações | **Citadas** na secção «O que um pacote de leitura não reproduz», que diz o que o pacote reproduz sozinho |

**E uma régua foi reescrita por causa da correção do M9, com a razão escrita.** A
N2 de `mapa-navegacao.mjs` provava que o mapa não tem lente contando os nós com
`transform` e exigindo zero, que era a marca que a lente do zoom deixava. A
arrumação dos insertos faz o servidor escrever uma translação inteira nos
caminhos dos dois arquipélagos, e a contagem deixou de ser verdade sem que lente
nenhuma voltasse. A N2 passa a medir a lente: nenhuma transformação com escala,
rotação ou inclinação; cada `translate` com argumentos inteiros; as mesmas
transformações nos dois estados; e as mesmas depois de cinco entalhes da roda com
o cursor dentro do mapa. **Não é uma regra enfraquecida, e o conhecido-positivo
di-lo:** com `transform="scale(2)"` plantado no `<g data-areas>` da primeira
página construída, as duas células da N2 ficam vermelhas.

**E duas medições da régua mudaram de matriz.** As unidades dos dois
arquipélagos levam a translação, e um ponto do campo levado ao ecrã pela matriz
do `svg` cai onde a ilha ESTAVA: `noEcra()` da régua do bloco e a conversão de
`lista.mjs` passam a usar a matriz do PRÓPRIO caminho, que traz as
transformações dos seus antepassados e a dele. Sem esta emenda a L6b ficava
vermelha nas nove ilhas dos Açores, e foi a corrida que o mostrou.
