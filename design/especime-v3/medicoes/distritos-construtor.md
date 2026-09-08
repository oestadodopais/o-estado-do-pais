# F1.1e · os distritos e as ilhas voltam ao mapa, e cada um cresce para os seus concelhos

*Construtor Claude Opus 5, 08.09.2026, ramo `distritos-2026-09-08` (tirado de
`fe6478aa`, a cabeça de `main`). Brief:
`design/observatorio/BRIEF-F1.1e-os-distritos-voltam-ao-mapa.md`. Uma passagem.
Sem travessões na prosa.*

## As nove medidas, antes e depois

*A tabela vem primeiro por decisão do lugar de direção de 07.09.2026. Cada linha
diz o que a medida era antes deste bloco, o que é depois, e o comando que a
refaz. O «antes» de cada uma é o que o F1.1d deixou, medido por ele.*

| # | a medida | antes (F1.1d) | depois | o comando |
| --- | --- | --- | --- | --- |
| U1 | o alvo de cada área, pelo maior quadrado da grelha de 2 px que contém o ponto representativo | o nível do país eram **nove regiões**: 3 de 9 aos 44 px a 390 (mediana 18 px); os concelhos tocavam-se no nível de uma região: **20 de 308** aos 44 px, mediana **16 px** | o nível do país são as **29 unidades**: **1 de 29** a 390 (mediana 20 px) e **6 de 29** a 1280 (mediana 26 px); os concelhos tocam-se no nível da sua unidade: **105 de 308** aos 44 px, mediana **36 px**, o menor 8 px. **Medida e não exigida**, como o brief a escreve | `node tests/inicio/mapa-unidades.mjs` (U1a, U1b, U1c) |
| U2 | o nome da área apontada num lugar fixo, pelos três gestos e nas duas edições | 9 de 9 regiões e 30 de 30 concelhos | **29 de 29** unidades e **30 de 30** concelhos, pelo rato, pelo teclado e pelo dedo, nas duas edições, e **16 de 16** concelhos de Lisboa numa página de distrito | `node tests/inicio/mapa-unidades.mjs` (U2a a U2d) |
| U3 | o primeiro toque nunca navega; o segundo, ou a porta, abre | o toque numa região crescia-a | o toque numa **unidade** cresce-a, nos dois motores (Évora, 14 concelhos, `/#unidade=evora`); o primeiro toque num concelho diz o nome e o segundo abre; a página da unidade abre-se **pela porta** do lugar do nome; um ficheiro que responde 404 devolve a ligação do servidor | `node tests/inicio/mapa-unidades.mjs` (U3a a U3e) |
| U4 | sem guião, o mapa continua a ser navegação | 9 ligações para as páginas de região; a gaveta fechada com 9 regiões e 29 unidades | **29 ligações** para as 29 páginas de unidade, **29 de 29 respondem 200**, a gaveta **fechada** com as **29** unidades e mais nada, **0 regiões** desenhadas ou listadas, o segundo nível com **0 nós**, `#unidade=` ignorado sem erro | `node tests/inicio/mapa-unidades.mjs` (U4) |
| U5 | a altura de `/` a 390, com guião, em repouso | **3 263 px** (a medida da P5 do F1.1d, cabeça `c9823939`) | **3 263 px**, na mesma largura e no mesmo motor: **igual**, que é o que o brief pede («igual ou menor») | `node tests/inicio/mapa-unidades.mjs` (U5) |
| U6 | o portão da geometria | **10 regras**, 24 estragos (a R8, a R9 e a R10 provavam a geometria calculada das nove regiões) | **8 regras**, **18 estragos e 18 apanhados**: as R8, R9 e R10 saem com o cálculo, e entra uma **R8 nova** que compara os 29 ficheiros servidos com os artefactos, byte a byte, dos três lados | `node scripts/check-mapa.mjs` e `node scripts/check-mapa.mjs --vermelhos` |
| U7 | a página do concelho com o nível da unidade | não existia: o cartão da página do concelho era o mapa de **308 pontos** de 7,35 px | o componente ganha o nível como parâmetro, e a régua mede-o sobre uma **página de prova** que ela própria constrói: **14 áreas** para os 14 concelhos de Évora, **0 pontos**, o concelho da página com o **anel** (traço 3 contra 1), a porta a abrir o vizinho apontado. A página do concelho fará a troca de uma linha, escrita mais abaixo | `node tests/inicio/mapa-unidades.mjs` (U7) |
| U8 | as réguas e os três portões | a régua do bloco com 27 células; `lista` 94 de 94; `mapa-distritos` 20 de 20 (M1 e M2 retiradas) | a régua do bloco com **28 células**, todas verdes; `lista` **94 de 94**; `mapa-distritos` **43 de 43** (M1 e M2 de volta); `mapa-navegacao` **9 de 9**; `build`, `verify` e `typecheck` a **0** | os comandos das quatro réguas, e `npm run build`, `npm run verify`, `npm run typecheck` |
| U9 | as plantas | 7 na régua do bloco, 24 no portão do mapa, 4 na régua dos distritos | **10 de 10** na régua do bloco (incluindo as cinco que o brief nomeia), **18 de 18** no portão do mapa, **8 de 8** na régua dos distritos, **12 de 15** na régua dos nomes (as duas do par arranjadas, três de camadas antigas ficam medidas mais abaixo) | `--vermelhos` em cada uma das quatro |

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
| `scripts/mapa-unidades.mjs` (copia e confere) | 7 172 |
| `public/dados/mapa/unidade-*.json` (29) | **394 614** |

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

## As nove medidas de aceitação, em detalhe

O comando de todas as células da régua é o mesmo:

```
node tests/inicio/mapa-unidades.mjs             # 28 de 28 células passam
node tests/inicio/mapa-unidades.mjs --vermelhos # 10 de 10 plantas apanhadas, saída 0
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
conta e o mesmo passo do F1.1d e das células M1 e M2 de `mapa-distritos.mjs`.

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
| Guarda | 14 | 9 | 52 px | 20 px |
| Lisboa | 16 | 8 | 50 px | 18 px |
| Santarém | 21 | 7 | 36 px | 8 px |
| Vila Real | 14 | 7 | 44 px | 12 px |
| Braga | 14 | 6 | 42 px | 14 px |
| Viana do Castelo | 10 | 6 | 54 px | 28 px |
| Castelo Branco | 11 | 5 | 40 px | 18 px |
| Viseu | 24 | 5 | 34 px | 24 px |
| Beja | 14 | 4 | 38 px | 14 px |
| Portalegre | 15 | 4 | 38 px | 22 px |
| Setúbal | 13 | 4 | 28 px | 10 px |
| Évora | 14 | 3 | 36 px | 14 px |
| Faro | 16 | 2 | 24 px | 8 px |
| Ilha das Flores | 2 | 2 | 180 px | 168 px |
| Ilha Terceira | 2 | 2 | 100 px | 86 px |
| Leiria | 16 | 2 | 24 px | 12 px |
| Porto | 18 | 2 | 32 px | 16 px |
| Coimbra | 17 | 1 | 32 px | 20 px |
| Ilha da Graciosa | 1 | 1 | 182 px | 182 px |
| Ilha de Porto Santo | 1 | 1 | 116 px | 116 px |
| Ilha de Santa Maria | 1 | 1 | 144 px | 144 px |
| Ilha de São Miguel | 6 | 1 | 34 px | 22 px |
| Ilha do Corvo | 1 | 1 | 292 px | 292 px |
| Ilha do Faial | 1 | 1 | 186 px | 186 px |
| Ilha do Pico | 3 | 1 | 42 px | 40 px |
| Ilha da Madeira | 10 | 0 | 16 px | 10 px |
| Ilha de São Jorge | 2 | 0 | 34 px | 32 px |

**O que o bloco entrega é uma subida grande e não a meta:** de 20 para 105 dos
308 concelhos acima dos 44 px, e a mediana de 16 px para 36 px. O nível de cima
troca 3 de 9 áreas por 1 de 29, e é a troca que o diretor escolheu: as 29 são as
áreas que se reconhecem pelo nome, e as que não chegam a um dedo respondem-se
pela rede dos nomes, que está toda na página (U1c: 29 unidades na lista fechada,
308 ligações no índice dos concelhos).

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

O nome esperado de uma unidade lê-se do `<title>` da sua área, que é o nome
acessível que o servidor desenhou; o de um concelho lê-se do ficheiro servido da
unidade, que é a Carta.

### U3 · o primeiro toque nunca navega

`node tests/inicio/mapa-unidades.mjs` (U3a a U3e). Com o **dedo**, nos dois
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
segundo toque na área.** É a decisão escrita do lugar de direção de 08.09.2026
para o F1.1d, e vale igual aqui pela mesma razão de desenho: ao primeiro toque a
área cresce, o grupo do nível do país esconde-se e o contorno dela deixa de estar
no ecrã, de maneira que não há alvo nenhum para receber um segundo toque.

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
node scripts/check-mapa.mjs               # 8 regras verdes
node scripts/check-mapa.mjs --vermelhos   # 18 estragos, 18 apanhados, saída 0
```

As R8, R9 e R10 do F1.1d saem com o cálculo que provavam, e com elas saem os
seus oito estragos plantados. Entra uma **R8 nova**, com quatro estragos que
mordem: um nome mudado dentro do ficheiro servido dos dois lados, um byte a mais
só em `dist/`, um ficheiro servido a mais, e uma área da primeira página a pedir
o ficheiro de outra unidade. A **R4** volta de «nove ligações de área» a «29», e
a lista esperada passa a vir de `mapa/pais.json` e não de uma lista da casa.

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

**A troca que a página do concelho fará, e que este bloco NÃO faz.** O brief
manda que este bloco não toque em `src/views/MunicipioView.astro`, porque o F1.10
corre em paralelo e é ele quem lá mexe (item 8.17). A troca é uma linha, na
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

| régua | comando | resultado |
| --- | --- | --- |
| a régua do bloco | `node tests/inicio/mapa-unidades.mjs` | 28 de 28 |
| os nomes ao lado do mapa | `node tests/inicio/lista.mjs` | 94 de 94 |
| o mapa por distritos | `node tests/inicio/mapa-distritos.mjs` | 43 de 43 |
| o mapa é navegação | `node tests/inicio/mapa-navegacao.mjs` | 9 de 9 |

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
  antigo.
* `design-bundle.mjs` (que corre no `verify`): o cartão do mapa volta a ler as 29
  unidades do artefacto em vez das nove regiões do ficheiro gerado.

### U9 · as plantas

```
node tests/inicio/mapa-unidades.mjs --vermelhos   # 10 de 10, saída 0
node scripts/check-mapa.mjs --vermelhos           # 18 de 18, saída 0
node tests/inicio/mapa-distritos.mjs --vermelhos  #  8 de  8, saída 0
node tests/inicio/lista.mjs --vermelhos           # 12 de 15 (três de camadas antigas, abaixo)
```

As dez da régua do bloco, cada uma posta na resposta que o servidor dá e em mais
lado nenhum. **Todas as células que uma planta nomeia têm de ficar vermelhas**, e
não uma delas. As **cinco que o brief nomeia** estão marcadas com um asterisco:

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

4. **A régua da voz não recolhe o nome acessível do desenho da primeira página, e
   isso obriga a uma linha `retirada` que voltou a render-se.** As duas linhas do
   `distritosLabel` («Mapa dos distritos e das ilhas de Portugal, com uma área por
   unidade.» e a inglesa) passaram a `retirada` no F1.1d; o rótulo voltou com o
   desenho, mas a régua não o vê (vê o de uma página de distrito, que é outra
   cadeia). Uma linha `viva` que a régua não vê fecha a construção. As duas ficam
   `retirada` com a razão reescrita, que diz exactamente isto.

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

7. **Três plantas de `lista.mjs` mudam o HTML e não põem a célula vermelha, e não
   são deste bloco.** São «a coluna das gavetas depois do mapa no documento»
   (célula L1), «a legenda por cima dos nomes em vez de por baixo» (L12) e «a
   forma em linha a 1024 e a 1280» (L9). As três mexem em camadas da cabeça que
   mudaram de forma depois de as plantas terem sido escritas: a ordem do documento
   inverteu-se com o F1.1 (a lista chega aberta e vive depois do mapa, e a planta
   planta hoje o estado CERTO), e as outras duas são folhas sobre uma arrumação
   que a cabeça já não tem. Este bloco não lhes toca porque não lhes mexeu:
   **fica medido aqui para o lugar de direção decidir**, com o comando que o
   reproduz (`node tests/inicio/lista.mjs --vermelhos`).

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

**Oito linhas passaram a `retirada`** com a razão: as quatro frases que diziam
«região» nas duas edições (`Toque numa região`, `Passe o rato por uma região`, e
o aviso do pedido que não volta). **Duas linhas saíram do ficheiro** («As
regiões» e «The regions»), pela razão do achado 5. **Duas linhas `retirada` do
F1.1d ganharam razão nova**, pela razão do achado 4.

«O mapa desta ÁREA não abriu» e não «deste distrito»: as 29 são 18 distritos e 11
ilhas, e uma frase que nomeasse o distrito estava errada em onze delas.

## As capturas

`design/especime-v3/capturas/distritos-2026-09-08/`, oito ficheiros: o nível do
país e o nível de uma unidade (Évora), a 390 × 664 e a 1280, nas duas edições.
Cada uma é o recorte da união da figura com a tela, medido na página (achado 8):
390 × 608 px e 390 × 375 px a 390; 518 × 683 px e 518 × 467 px a 1280.

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

  mapa · 30 ficheiros conferidos · 29 unidades · 308 concelhos, uma vez cada · 58 páginas de distrito construídas
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
  página de prova; a página do concelho mede-se quando os dois blocos aterrarem.
* **As três plantas de `lista.mjs` que não mordem** (achado 7), que são de camadas
  anteriores a este bloco.
* **A leitura a frio do Codex e a medição às cegas do Sonnet**, que são de fora
  desta árvore e correm antes da fusão.
