# F1.1c · uma leitura de cada vez, e nenhuma em repouso

*Construtor: Claude Opus 5, 04.09.2026, ramo `toque-2026-09-04`, a partir de
`origin/main` em `69ba3abf`. Medido com `tests/inicio/*.mjs` sobre a construção
deste ramo e sobre a construção de `69ba3abf`, feita na mesma árvore antes de uma
linha mudar. Todos os números deste relatório saíram de uma corrida; nenhum foi
escrito de cabeça.*

## Segunda passagem (07.09)

*Construtor: Claude Opus 5, 07.09.2026, na mesma worktree, depois da leitura a
frio do Codex (`gpt-5.6-sol`, xhigh, 16:12 a 16:35 UTC,
`design/especime-v3/critica/2026-09-07-codex-leitura-f11c-toque.md`, cinco
plantas vistas em cinco) e da triagem do lugar de direção. Sete itens. Cada um
com o comando que o mediu, o vermelho antes e o verde depois.*

### A fusão de `origin/main`, sem conflitos

`git fetch origin && git merge origin/main`, com `origin/main` em `9c34bbb0` (o
F1.4b, as datas de publicação medidas uma vez onde a história está, e o painel
semanal de 07.09). **65 ficheiros mudaram, 2 301 linhas entraram e 239 saíram, e
não houve um conflito**: nenhum ficheiro deste ramo é tocado pelos dois lados.
A mensagem do commit de fusão foi reescrita em português com os dois trailers.

E há um número que só se soube por causa dela: a construção de `9c34bbb0` mede
**4 638 px** em `/` e **4 596 px** em `/en` a 390 com guião, que é ao píxel o
«antes» que a §1 tinha medido em `69ba3abf`. **A fusão não custou nem devolveu
um píxel à primeira página**, e as duas colunas da tabela continuam
comparáveis.

### 1 · Os 21 cartões fazem o mesmo (Blocking 2)

Três dos 21 cartões (a dívida pública, a taxa de emprego e a taxa de desemprego)
mudavam de página em vez de abrirem a sua leitura, como o F1.2b os tinha posto. A
decisão (7) da §1.99 pôs as leituras dos três inteiras na primeira página, com a
porta «Ver no domínio →» acrescentada, e o mandato deste bloco é que um toque num
cartão abre a leitura daquele cartão: com as duas coisas, o cartão que muda de
página é a promessa do bloco quebrada em três dos 21.

`destinoDoCartao()` em `src/views/HomeView.astro` passa a devolver `#m-<id>` para
os 21, e o rótulo do destino sai deles. **A porta para o domínio não se perde**:
fica dentro da leitura de cada uma das três (`portaDaLeitura()`, cuja regra não
mudou) e
na secção dos domínios a seguir ao mapa, cujos cartões continuam a levar para lá.
`check:alcance` parte da página do domínio e não do cartão, e fica verde.

As réguas mudam com a decisão citada: a A13 de `porta.mjs` (os 21 para `#m-<id>`,
a âncora local a existir, nenhum rótulo de destino, e a porta do domínio conferida
onde ela agora vive, com a âncora a existir na página de chegada); a J4, a J12 e a
J13 de `leitura.mjs`; e a célula «uma leitura abre só a sua» de `matriz.mjs`.

**Vermelho antes** (as réguas novas sobre a construção de `9c34bbb0`, que é a
primeira página sem este item):

```
OEDP_DIST=<dist de 9c34bbb0> node tests/inicio/leitura.mjs   → exit 1
  ✗ J12.pt   QUEIXAS: 3 cartão(ões) da faixa da cabeça levam para fora desta
             página (divida-publica-2025, taxa-de-emprego-2025,
             taxa-de-desemprego-2025)
  ✗ J4.pt.chromium  21 cartão(ões) tocados, 18 abriram a sua leitura aqui
             (uma de cada vez), 3 de medidas que vivem num domínio
             QUEIXAS: «divida-publica-2025» leva para fora desta página
             («/dominios/economia-e-financas-publicas#m-e3»);
             «taxa-de-emprego-2025» …; «taxa-de-desemprego-2025» …
  ✗ J13.pt.chromium  QUEIXAS: em repouso há 21 nome(s) à vista; não há linha do
             estado vazio; … o toque em «divida-publica-2025» deu «#m-e3»
  leitura ✗ 16 de 26 célula(s)
```

As dez vermelhas são a J12 nas duas edições, a J4 e a J13 nos dois motores das
duas edições. **A J3 fica verde nessa corrida**, e é uma coisa que vale a pena
dizer: a expectativa por motor que o item 4 prendeu é a mesma na construção de
antes e na deste ramo, porque é dos motores e não desta página.

**Verde depois**, e a planta nova de `porta.mjs` a morder nas duas edições:

```
node tests/inicio/porta.mjs --vermelhos   → exit 0
  ✓ A13.pt  o destino dos cartões de /: 21 cartão(ões), 21 para a leitura breve
            desta página, 0 para fora · 3 leitura(s) acrescentam a porta do
            domínio (divida-publica-2025, taxa-de-emprego-2025,
            taxa-de-desemprego-2025) · nenhum errado
  ✓ um cartão a levar à página do domínio em vez de abrir a sua leitura
            verde antes: sim · html mudou: sim · vermelho depois:
            A13.pt=vermelho, A13.en=vermelho
  porta ✓ 34 de 34 célula(s) · plantas ✓
```

A planta antiga («um cartão do domínio a apontar à linha desta página») plantava
o contrário do defeito de hoje, e foi virada: o destino certo é a âncora desta
página, e o defeito é levar para fora. A âncora do domínio lê-se de
`dominioDaLinha()` e não está escrita na régua.

### 2 · A linha do estado vazio depois do Enter (Major 4)

A J13 conferia, depois do Enter, o nome à vista e o endereço, e não conferia que
a linha «Toque num cartão para ler a medida.» tinha desaparecido: uma área com
uma leitura aberta e a instrução por cima é a página a dizer o que não é. A
exigência entra, e com ela uma planta nova, que é o conhecido-positivo:

```
node tests/inicio/leitura.mjs --vermelhos   → exit 0
  ✓ a linha do estado vazio à vista com uma leitura aberta
            verde antes: sim · html mudou: sim · vermelho depois:
            J13.pt.chromium=vermelho, J13.pt.webkit=vermelho,
            J13.en.chromium=vermelho, J13.en.webkit=vermelho
```

A planta dá à linha um `display: block !important` em linha, que ganha ao
`hidden` que o guião lhe põe: a linha fica à vista em todos os estados. A queixa
que a célula escreve nomeia o estado, e é a do Enter que este item acrescenta:

```
OEDP_DIST=<dist com a linha sempre à vista> node tests/inicio/leitura.mjs
  ✗ J13.pt.chromium  QUEIXAS: a linha do estado vazio ficou à vista com
             «divida-publica-2025» aberta; a linha do estado vazio ficou à vista
             depois do Enter em «divida-publica-2025» …
```

A outra metade do Major 4 era planta do pacote (a J13 copiada aceitava um nome à
vista depois de voltar atrás): o código de `b7afb882` exige zero, e não mudou.

### 3 · As duas plantas mordem as quatro células (Major 5)

As duas plantas do F1.1c nomeavam só as células portuguesas e devolviam o HTML
inglês intacto: podiam passar com as duas células inglesas verdes, porque nenhum
defeito inglês tinha sido plantado. Os estragos passam a aplicar-se aos dois
documentos e as quatro células têm de cair.

**Vermelho antes**, com o guião da planta como estava (a mesma régua, com o
`rota.startsWith('/en') ? h : …` reposto e as quatro células nomeadas):

```
  ✗ uma leitura fechada deixada à vista com guião
      html mudou: sim · vermelho depois: J13.pt.chromium=vermelho,
      J13.pt.webkit=vermelho, J13.en.chromium=verde, J13.en.webkit=verde
  ✗ a área de leitura sem a linha do estado vazio
      html mudou: sim · vermelho depois: J13.pt.chromium=vermelho,
      J13.pt.webkit=vermelho, J13.en.chromium=verde, J13.en.webkit=verde
```

**Verde depois**, com o estrago nas duas edições:

```
  ✓ uma leitura fechada deixada à vista com guião
      verde antes: sim · html mudou: sim · vermelho depois:
      J13.pt.chromium=vermelho, J13.pt.webkit=vermelho,
      J13.en.chromium=vermelho, J13.en.webkit=vermelho
  ✓ a área de leitura sem a linha do estado vazio
      verde antes: sim · html mudou: sim · vermelho depois:
      J13.pt.chromium=vermelho, J13.pt.webkit=vermelho,
      J13.en.chromium=vermelho, J13.en.webkit=vermelho
```

### 4 · O que cada motor faz com `#m-<id>` sem guião (Major 6)

A J3 imprimia se o motor abre o `<details>` alvo de um fragmento sem guião e não
o exigia: ficava verde qualquer que fosse a resposta. Mediu-se primeiro, e o que
se mediu ficou preso na constante `ABRE_O_ALVO_SEM_GUIAO`, com a versão de cada
motor ao lado.

**O que cada motor faz**, medido a 07.09.2026 com Playwright 1.60.0, Chromium
148.0.7778.96 e WebKit 26.4, nas duas edições, sobre a construção deste ramo:

| motor | abre o `<details>` alvo de `#m-<id>` sem guião? |
| --- | --- |
| chromium | **não** · a âncora existe, a página rola até ela, a dobra fica fechada |
| webkit | **não** · faz o mesmo que o Chromium |

Os dois dizem o mesmo, e por isso a frase do relatório que dizia «o motor abre-o
se souber» é uma frase sobre uma coisa que nenhum dos dois faz. O que a página
promete sem guião fica medido: as 21 leituras lá, fechadas, com o seu `id`, o
endereço a levar o leitor à leitura certa, e abrir a custar-lhe um toque no
`<summary>`.

**Vermelho antes e verde depois na própria célula**, que é o conhecido-positivo
de que ela passou a exigir o valor: com a expectativa por medir (as duas a
«sim»), as quatro células J3 caem e dizem «MUDOU»; com a medida, ficam verdes.

```
node tests/inicio/leitura.mjs   (com ABRE_O_ALVO_SEM_GUIAO = { chromium: true, webkit: true })
  ✗ J3.pt.chromium  … o motor abre o <details> alvo de um fragmento sem guião:
                    não (o <summary> está a um toque) (medido a 07.09: sim · MUDOU)
  ✗ J3.pt.webkit  ✗ J3.en.chromium  ✗ J3.en.webkit

node tests/inicio/leitura.mjs   (com { chromium: false, webkit: false })
  ✓ J3.pt.chromium  … (medido a 07.09: não), e 0 outra(s) aberta(s) ·
                    com guião abre: true (e 0 outra(s) aberta(s))
  ✓ J3.pt.webkit  ✓ J3.en.chromium  ✓ J3.en.webkit
```

A célula passou também a exigir que o motor não abra mais NENHUMA leitura à
chegada do fragmento.

### 5 · A ordem do teclado com uma leitura aberta (Major 7)

A célula da ordem do teclado da matriz mede a área em repouso, e em repouso a
primeira paragem dela é o comando da densidade: a folha tira da página as dobras
fechadas. O relatório dizia que «quando uma leitura abre, o `<summary>` dela entra
na ordem dentro da área», e isso não estava medido por célula nenhuma. Entra uma
célula com o caso, medida onde o gesto do leitor já abriu uma leitura, e a
exigência é a ordem inteira: o comando da densidade, o `<summary>` da leitura
aberta, e as portas do fim da página.

`tests/inicio/matriz.mjs` ganhou também `OEDP_DIST`, que as outras réguas de
`tests/inicio/` já tinham: sem ele um conhecido-positivo obriga a estragar a
construção boa.

**Vermelho antes**, com uma porta plantada por cima da área de leitura numa cópia
do `dist/`:

```
OEDP_DIST=<dist com uma porta antes da área> node tests/inicio/matriz.mjs
  falha  ordem do teclado com uma leitura aberta · densidade → o <summary> dela → portas
         «divida-publica-2025» aberta: true · densidade 136 · <summary> 139 ·
         portas 135 · 165 paragens
```

**Verde depois**, na construção deste ramo:

```
node tests/inicio/matriz.mjs
  passa  ordem do teclado com uma leitura aberta · densidade → o <summary> dela → portas
  3 de 85 células falham.
```

As três que falham são as mesmas de sempre, e nenhuma é deste bloco: «2l · a
linha da reconferência saiu da primeira página», «Emenda 14 · um concelho sem
estudos rende as sete peças e mais nada» e «a língua de um título citado, e a
porta da outra edição no rodapé». A matriz passou de 84 para 85 células.

### 6 · A régua e as capturas entram no repositório (Major 9)

Viviam em `.claude/` da árvore de trabalho, fora do repositório, e as medidas
existiam só como conclusões no relatório. Passam para dentro, como medidores e
não como réguas (não recusam nada, não têm células, não saem com 1):

* `scripts/medir-toque.mjs` · a altura de `/` e de `/en` a 390 × 664 nos dois
  motores, com e sem guião, e os nomes de medida à vista na área de leitura nos
  quatro estados (em repouso, depois do toque, depois de voltar atrás e depois do
  Enter). Aceita `--sobre=<a árvore medida>`, que vai para dentro do ficheiro:
  um caminho de pasta não diz que construção foi medida;
* `scripts/capturas-toque.mjs` · as duas capturas do bloco. Não entrou em
  `tests/inicio/capturas.mjs` porque o fotógrafo da primeira página tira estados
  que se pedem pelo ENDEREÇO, e estes dois pedem-se com um GESTO.

As medidas ficam guardadas, 20 em cada ficheiro:

```
node scripts/medir-toque.mjs <dist de 9c34bbb0> \
  design/especime-v3/medicoes/toque-medidas-antes.json \
  "--sobre=origin/main em 9c34bbb0, a primeira página sem o F1.1c"
node scripts/medir-toque.mjs dist \
  design/especime-v3/medicoes/toque-medidas-depois.json \
  "--sobre=toque-2026-09-04, a segunda passagem do F1.1c sobre a fusão de origin/main em 9c34bbb0"
```

| medida (390 × 664) | antes (`9c34bbb0`) | depois (este ramo) |
| --- | --- | --- |
| `/` com guião · chromium | 4638 px | 3700 px |
| `/` com guião · webkit | 4639 px | 3701 px |
| `/` sem guião · chromium | 4578 px | 4578 px |
| `/` sem guião · webkit | 4579 px | 4579 px |
| `/en` com guião · chromium | 4596 px | 3649 px |
| `/en` com guião · webkit | 4597 px | 3650 px |
| `/en` sem guião · chromium | 4536 px | 4536 px |
| `/en` sem guião · webkit | 4537 px | 4537 px |
| nomes à vista, com guião, em repouso | 21 | 0 |
| nomes à vista, depois do toque | 21 | 1 |
| nomes à vista, depois de voltar atrás | 21 | 0 |
| nomes à vista, depois do Enter | 21 | 1 |
| nomes à vista, sem guião | 21 | 21 |
| cartões da faixa da cabeça que levam para fora | 3 de 21 | **0 de 21** |

As duas capturas foram tiradas outra vez com o guião de dentro do repositório, e
mudaram por causa do item 1: o cartão que se toca é o primeiro da faixa, que é a
dívida pública, e a leitura que se abre é a dela, com a unidade, o limiar, a
definição, as três datas, a régua, o selo e a porta «Ver no domínio →».

### 7 · As contas do relatório (Minor 11)

Duas correções no corpo deste ficheiro: as réguas de `tests/inicio` são **treze**
(a pasta tem catorze ficheiros, e o décimo quarto é `capturas.mjs`, que fotografa
e não tem células), e a matriz mudou em **três** células e não em duas, que é o
número que o próprio parágrafo a seguir descrevia. E uma terceira, que veio do
item 4: a frase do §0 que dizia que sem guião «`#m-<id>` continua a abrir a
certa» diz agora o que se mediu.

### As réguas e os três comandos da segunda passagem

As treze réguas de `tests/inicio`, corridas sobre a construção deste ramo:

| régua | resultado |
| --- | --- |
| `app.mjs` | 39 de 39 |
| `areas.mjs` | 22 de 22 |
| `correcoes-a.mjs` | 32 de 32 |
| `faixa.mjs` | 80 de 80 |
| `leitura.mjs --vermelhos` | **26 de 26** · **8** plantas verdes (eram sete) |
| `lista.mjs` | 94 de 94 |
| `mapa-distritos.mjs` | 43 de 43 |
| `mapa-navegacao.mjs` | 9 de 9 |
| `matriz.mjs` | **82 de 85** (eram 81 de 84: a célula nova, e as mesmas três vermelhas) |
| `numeros-novos.mjs` | inventário (16 motivos distintos, 6 verbatim) |
| `porta.mjs --vermelhos` | 34 de 34 · 15 plantas verdes |
| `regioes.mjs` | 30 de 30 |
| `rotulo.mjs` | 7 de 7 |

Os três comandos, com os códigos de saída lidos de ficheiro e a hora UTC de cada
um:

| comando | código | começou (UTC) | acabou (UTC) |
| --- | --- | --- | --- |
| `npm run build` | 0 | 18:55:34 | 19:01:00 |
| `npm run verify` | 0 | 19:01:00 | 19:07:06 |
| `npm run typecheck` | 0 | 19:07:06 | 19:07:07 |

A cadeia correu QUATRO vezes sobre esta árvore ao longo da tarde de 07.09 (às
17:31, às 17:43, às 18:17 e às 18:55), e deu 0 nos três comandos das quatro
vezes; a tabela leva as horas da última. O único ficheiro que mudou depois dela é
este relatório, e nenhum dos três portões o lê: o `check:voz` lê o inventário das
frases, o `REVISOES-DO-INVENTARIO.md` e a `direcao.md`, o `check:mortos` lê os
identificadores do código (e correu verde com os dois guiões novos de `scripts/`),
e nenhum abre `medicoes/`.

O `typecheck` acaba no mesmo segundo em que começa, e por isso mediu-se se ele
pode falhar: com uma função de uma linha em `src/lib/` a devolver um número onde
a assinatura promete uma cadeia, `npm run typecheck` sai com **1** e diz
`error TS2322: Type 'number' is not assignable to type 'string'`. O ficheiro foi
apagado a seguir. (Um ficheiro cujo nome comece por ponto não entra no programa
do `tsc`, e a primeira tentativa do conhecido-positivo passou por isso: fica dito
porque é uma armadilha para quem repetir a prova.)

Dentro do `verify`, `check:alcance` diz **314 das 314** linhas da §1.90 apanhadas
a partir da página do domínio, que é a metade que o item 1 não podia partir.

## Estado ao pausar (04.09)

*Escrito quando o diretor fechou o portátil, com a corrida do portão ainda a
correr. O que está aqui é o estado do ramo `toque-2026-09-04` nesse momento.*

**Está feito, e está commitado e empurrado.** A cabeça do ramo é
`b7afb882519d8ea16fd5c6b34aaef3a9ae5b9a89`, um commit só, com os onze ficheiros
do bloco. O bloco está inteiro: a folha esconde as dobras fechadas quando o guião
acende a área, a linha do estado vazio entra e sai com as dobras, o toque, o
Enter e o botão «voltar» fazem o que o brief manda, e sem guião nada muda.

**Não está a meio nada.** Não há trabalho por acabar neste ramo, e por isso não há
nada para desfazer: os três comandos correram sobre a árvore final e deram 0
(`npm run build`, `npm run verify`, `npm run typecheck`), as treze réguas de
`tests/inicio` correram sobre a construção final, e as sete plantas de
`tests/inicio/leitura.mjs` passaram com as três exigências cada uma.

**O que fica por saber é a corrida do portão.** `portao` arrancou no `push` da
cabeça (corrida `33860583810`,
`https://github.com/oestadodopais/o-estado-do-pais/actions/runs/33860583810`) e
estava `in_progress` quando esta secção foi escrita, aos 19 minutos. **Não foi
lida verde nem vermelha**: quem retomar lê-a com
`gh run view 33860583810`, e é a única coisa deste bloco que falta conferir.

**Como se retoma, se o portão vier vermelho.** O ramo não foi fundido em `main`.
As medidas todas estão nas secções abaixo, com o comando que as tirou; a régua
deste bloco (a que mede alturas e nomes à vista) vive fora do repositório, em
`.claude/medir-toque.mjs` da árvore de trabalho, e as duas capturas foram tiradas
por `.claude/capturas-toque.mjs` na mesma árvore. Uma árvore acabada de criar não
tem `axe-core` sem `npm ci`, e sem ele o `verify` fecha no `check:moldura`: é a
primeira coisa a conferir numa árvore nova (ver a §7).

**As medidas, em duas linhas.** Altura de `/` a 390 com guião: 4638 → 3700 px;
`/en`: 4596 → 3649 px; sem guião, igual ao píxel (4578 e 4536). Nomes de medida à
vista por baixo da faixa, com guião: 21 → 0 em repouso, 21 → 1 depois de um toque
ou de um Enter, e 0 depois do botão «voltar»; sem guião, 21 nas duas
construções. Nos dois motores e nas duas edições.

## 0 · O que se construiu, em três frases

O F1.1b tinha posto por baixo da faixa as 21 leituras breves em `<details>`
fechados, e o diretor viu no ar o que elas eram: «the cards that we can scroll on
top of the website … then are double just under the map. Now they don't have the
numbers, but the names are still there and the cards are still there». Vinte e um
nomes por baixo dos vinte e um cartões que já os dizem.

**Com guião, a área de leitura passa a mostrar uma leitura de cada vez, e nenhuma
antes de um toque**: a folha esconde as dobras fechadas e no lugar delas fica uma
linha, «Toque num cartão para ler a medida.». Um toque num cartão abre a leitura
daquele cartão e fecha a que estava aberta; o botão «voltar» do navegador, ou o
próprio `<summary>` da leitura aberta, devolvem a área ao estado vazio.

**Sem guião não muda um píxel**: as 21 leituras continuam à vista, fechadas, com
o seu `id`, e `#m-<id>` continua a levar o leitor à leitura certa, que abre a um
toque no `<summary>` (nenhum dos dois motores abre sozinho o `<details>` alvo de
um fragmento: medido na segunda passagem, item 4). A altura de `/` sem guião é a
mesma antes e depois, ao píxel, nos dois motores e nas duas edições.

## 1 · A altura, antes e depois (390 × 664)

Medido com o medidor deste bloco sobre as duas construções, em Chromium e em
WebKit sem cabeça, depois de `document.fonts.ready`. A 04.09 ele vivia em
`.claude/medir-toque.mjs`, fora do repositório; desde a segunda passagem é
`scripts/medir-toque.mjs`, e as medidas estão em
`design/especime-v3/medicoes/toque-medidas-antes.json` e `-depois.json` (a
tabela do item 6 da segunda passagem tem as de 07.09, sobre `9c34bbb0`, e são as
mesmas ao píxel).

| estado | antes (69ba3abf) | depois | diferença |
| --- | --- | --- | --- |
| `/` com guião · chromium | 4638 px | 3700 px | −938 px |
| `/` com guião · webkit | 4639 px | 3701 px | −938 px |
| `/` sem guião · chromium | 4578 px | 4578 px | 0 |
| `/` sem guião · webkit | 4579 px | 4579 px | 0 |
| `/en` com guião · chromium | 4596 px | 3649 px | −947 px |
| `/en` com guião · webkit | 4597 px | 3650 px | −947 px |
| `/en` sem guião · chromium | 4536 px | 4536 px | 0 |
| `/en` sem guião · webkit | 4537 px | 4537 px | 0 |

A célula A2 de `tests/inicio/porta.mjs`, que mede a mesma coisa por outro
caminho, diz o mesmo: `/` a 3700 px e `/en` a 3649 px, com o tecto a 6991 e 6940.
A J6 de `tests/inicio/leitura.mjs` compara com a árvore de partida do F1.1b
(6959 e 6911 px) e dá −3259 e −3262.

## 2 · Os nomes de medida à vista por baixo da faixa

A contagem é de NOMES VISÍVEIS (`[data-leitura] [data-medida-nome]` dentro da
área de leitura, com `checkVisibility()`), e não de `<details>` abertos: o que o
diretor viu foi uma lista de nomes.

| estado | antes | depois |
| --- | --- | --- |
| com guião, em repouso | 21 | **0** |
| com guião, depois de um toque num cartão | 21 | **1** (a do cartão tocado) |
| com guião, depois de Enter no mesmo cartão | 21 | **1** |
| com guião, depois do botão «voltar» | 21 | **0** |
| sem guião | 21 | 21 |

Nos dois motores e nas duas edições. A linha do estado vazio está à vista
exactamente nos dois estados em que a área não tem nada dentro, e escondida nos
outros; sem guião não se vê nunca.

## 3 · O que se construiu, ficheiro a ficheiro

### 3.1 · `src/views/HomeView.astro` (só a área de leitura)

Duas coisas. A secção `#painel` ganha `data-area-leitura`, que é a marca que o
guião acende; e, a seguir ao comando da densidade, entra a linha do estado vazio,
`<p class="dobras-nada" data-leituras-vazio hidden>`, que chega escondida do
servidor. É a mesma regra do comando da densidade logo acima: quem a acende é o
guião, porque sem guião ela seria uma instrução falsa (ali as 21 leituras estão à
vista, e mandar tocar num cartão para ver o que já está no ecrã não é uma
instrução, é ruído).

**Uma só para as duas metades da área.** O quadro do Procedimento e o Painel
Social têm as suas leituras, mas o que está vazio quando nada está aberto é a
área inteira: duas linhas iguais seriam a mesma frase duas vezes na mesma página,
que é o defeito que este bloco veio tirar. Fica no cabeçalho da área, ao pé do
comando que também governa as 21.

### 3.2 · `src/styles/inicio.css` · três regras

```
[data-area-leitura][data-toque='sim'] .dobra:not([open])            { display: none }
[data-area-leitura][data-toque='sim'] .dobras:not(:has(.dobra[open])) { border-top: 0 }
.dobras-nada { ... }
```

A primeira é o bloco todo. A segunda existe porque `.dobras` abre com o fio da
casa, e um quadro sem nenhuma leitura aberta ficava com um fio solto a meio da
área; `:has()` é o único selector que responde a «este bloco tem alguma dobra
aberta», e o lado seguro de falhar está escolhido, como a folha já faz noutros
dois sítios: num motor sem `:has()` o fio fica onde sempre esteve. A terceira
veste a linha do estado vazio com as fichas que a folha já declara (`--f-instr`,
`--muted`), na forma da linha vazia da busca (`.pesquisa-vazio`).

**Nenhuma cor nova, nenhum tipo novo, nenhuma medida nova.** As duas primeiras
regras só mudam visibilidade.

### 3.3 · `public/js/inicio.js`

Três acrescentos, os três dentro da regra do ficheiro (trocar `hidden`, `open`,
`aria-pressed`, `aria-current`, e escrever marcas de estado como o `data-ambito`
e o `data-densidade` que ele já escrevia na raiz da cabeça):

* escreve `data-toque="sim"` na área de leitura, e é a folha que esconde as
  dobras fechadas. **A marca entra DEPOIS de a leitura do fragmento estar
  aberta**, e a ordem é medida: assim que ela entra, a página encolhe, e pô-la
  antes fazia o navegador rolar para o sítio certo de uma página que ia mudar de
  altura no instante seguinte. Pela mesma razão, um endereço que chega com
  `#m-<id>` refaz o rolamento depois de a página ter a altura que vai ter;
* troca o `hidden` da linha do estado vazio, e segue as DOBRAS e não os cliques:
  um ouvinte de `toggle` em cada uma das 21. Assim a linha está certa venha a
  mudança de onde vier, incluindo do próprio `<summary>` da leitura aberta, que é
  o comando de fechar que a página já tinha;
* no `hashchange`, um fragmento que não é uma leitura desta área devolve a área ao
  estado da DENSIDADE (`repoeDensidade()`), e não «fecha tudo». É isso que faz o
  botão «voltar» devolver o ecrã vazio depois de um toque, e é isso que não
  desmente o comando «Leitura breve» quando ele está premido.

**Não escreve texto nenhum**, e a linha do estado vazio prova-o: o texto dela vem
do servidor.

### 3.4 · `src/i18n/strings.mjs` · uma cadeia nova, nas duas edições

`inicio.painel.semLeituraAberta`: «Toque num cartão para ler a medida.» e «Tap a
card to read the measure.», que são as palavras do brief do lugar de direção. Não
leva algarismo, não fala da casa, e não traz vocabulário novo.

### 3.5 · Os ficheiros da voz

Duas linhas novas no `INVENTARIO-FRASES.md`, classe `navegacao`, bloco `toque`,
estado `viva` (a cadeia nas duas edições), com a secção que diz de onde vem e
porque é `navegacao` e não `conteudo`; e a entrada do bloco em
`critica/REVISOES-DO-INVENTARIO.md`, por ler, como os outros blocos deste dia.
`npm run check:voz` fecha com **818 frases distintas, autorreferência 0, nada por
classificar**.

### 3.6 · As réguas

`tests/inicio/leitura.mjs` ganha **duas células e duas plantas**:

* **J13** · com guião, quantos nomes estão à vista por baixo da faixa: zero em
  repouso (com a linha do estado vazio à vista), um depois de um toque no cartão
  (o daquele cartão, com a linha fora e `#m-<id>` na barra), zero depois do botão
  «voltar» (`history.back()` dentro do documento, que é a travessia que dispara o
  `hashchange`), e um depois de Enter no mesmo cartão. Nas duas edições e nos dois
  motores;
* **J14** · sem guião, as 21 leituras no documento, os 21 nomes à vista, nenhuma
  aberta e a linha do estado vazio escondida;
* **planta** · «uma leitura fechada deixada à vista com guião»: um estilo em linha
  na primeira dobra ganha à folha e deixa aquela leitura à vista, fechada, por
  baixo do cartão que já diz o nome dela;
* **planta** · «a área de leitura sem a linha do estado vazio»: tira do documento
  a linha, e a área fica sem nada dentro e sem uma palavra a dizer o gesto que a
  enche.

`tests/inicio/matriz.mjs` mudou em três células, e não por gosto: duas tocavam
ou punham o foco no `<summary>` de uma leitura FECHADA, que com guião deixou de
estar na página. Está na §5.

## 4 · O que fica por fazer, e o que não se fez

**A leitura fechada deixa de ser alcançável com guião, e isso é a decisão.** Quem
lê com teclado ou com leitor de ecrã chega às leituras pelos cartões, que são
ligações para `#m-<id>` e que abrem a leitura ao serem activados (medido: Enter
num cartão faz o que o dedo faz). O que se perde é percorrer as 21 linhas
fechadas sem tocar em nada; o que a substitui é a faixa dos 21 cartões, que é a
mesma lista com o valor de cada medida. Sem guião nada disto muda.

**O endereço não se limpa quando a leitura se fecha pelo `<summary>`.** Fechar
pelo `<summary>` devolve o ecrã vazio e deixa `#m-<id>` na barra: o endereço
continua citável e uma recarga reabre a mesma leitura. Limpá-lo obrigaria a
escrever no histórico uma entrada que ninguém pediu.

**A linha do estado vazio não conta nada.** Não diz quantas medidas há por baixo
dela: essa contagem está no nome de cada painel, ao lado, com a marca que o
portão reconta.

## 5 · As réguas, antes e depois

As treze de `tests/inicio`, corridas sobre a construção de `69ba3abf` e sobre a
deste ramo, na mesma árvore. A pasta tem catorze ficheiros, e o décimo quarto é
`capturas.mjs`, que não é uma régua: fotografa, e por isso não tem células. A
tabela abaixo tem treze linhas, uma por régua.

| régua | antes | depois |
| --- | --- | --- |
| `app.mjs` | 39 de 39 | 39 de 39 |
| `areas.mjs` | 22 de 22 | 22 de 22 |
| `correcoes-a.mjs` | 32 de 32 | 32 de 32 |
| `faixa.mjs` | 80 de 80 | 80 de 80 |
| `leitura.mjs` | 18 de 18 | **26 de 26** (as duas células novas, nos dois motores e nas duas edições) |
| `lista.mjs` | 94 de 94 | 94 de 94 |
| `mapa-distritos.mjs` | 43 de 43 | 43 de 43 |
| `mapa-navegacao.mjs` | 9 de 9 | 9 de 9 |
| `matriz.mjs` | 81 de 84 | 81 de 84 (as mesmas três vermelhas) |
| `numeros-novos.mjs` | inventário | inventário |
| `porta.mjs` | 34 de 34 | 34 de 34 |
| `regioes.mjs` | 30 de 30 | 30 de 30 |
| `rotulo.mjs` | 7 de 7 | 7 de 7 |

**Esta tabela é a da primeira passagem.** A segunda mudou três destes números, e
estão no item 5 e no item 1 lá em cima: `leitura.mjs` tem hoje as mesmas 26
células e **oito** plantas (as duas do F1.1c mordem as quatro células, e entrou a
da linha do estado vazio à vista); `matriz.mjs` passou de 84 para 85 células, com
3 vermelhas; `porta.mjs` continua em 34 de 34, com a planta da A13 virada.

**As três vermelhas da matriz são as mesmas antes e depois**, e nenhuma é deste
bloco: «2l · a linha da reconferência saiu da primeira página, e a porta abre o
painel», «Emenda 14 · um concelho sem estudos rende as sete peças e mais nada» e
«a língua de um título citado, e a porta da outra edição no rodapé». Estão
registadas desde o F1.1b.

**As três células da matriz que este bloco reescreveu.** A primeira corrida
depois da mudança não deu uma célula vermelha: deu um ERRO, e a régua parou com
código 1. `page.click('[data-leituras] .dobra:first-child .dobra-abrir')` esperou
30 segundos por um elemento que a folha tinha tirado da página. Duas células
mediam o gesto no `<summary>` de uma leitura fechada, e esse gesto deixou de
existir com guião; a terceira caiu na corrida seguinte, por ser a mesma coisa
vista pela ordem do teclado:

* «uma leitura abre só a sua» passa a dar o gesto que o leitor dá hoje: um toque
  no CARTÃO da primeira medida que abre aqui (três dos 21 levam à página do
  domínio), e exige o mesmo que sempre exigiu — uma leitura aberta, e uma só;
* «2i·5 · o espaço age na leitura e não rola a página» abre as 21 pelo endereço
  `?densidade=leitura`, que é o que o comando «Leitura breve» faz e a porta que a
  célula do selo já usava desde o F1.1b, põe o foco no `<summary>` da primeira e
  exige que o espaço a FECHE (20 de 21 abertas) sem rolar a página. A promessa
  medida é a mesma: a tecla age no comando nativo, e a página não se mexe;
* «ordem do teclado · porta do concelho → painel → portas» procurava a primeira
  paragem dentro de `[data-leituras]`, e em repouso deixou de haver nenhuma:
  `findIndex` devolvia −1 e a célula ficava vermelha. O marco passa a ser a ÁREA
  de leitura (`[data-area-leitura]`), cuja primeira paragem é o comando da
  densidade, no mesmo sítio da página; quando uma leitura abre, o `<summary>`
  dela entra na ordem dentro da área. A célula mede o que sempre mediu: a ordem
  desce a página, sem saltos para trás.

`tests/inicio/matriz.mjs` não estava na lista de ficheiros do brief deste bloco.
Fica dito: sem estas três células a régua não corria, ou corria a acusar o
desenho novo de um defeito que ele não tem, e uma régua que rebenta não mede
nada.

## 6 · As capturas

Duas, a 390 × 664, em português e no tema claro, em
`design/especime-v3/capturas/toque-2026-09-04/`:

* `inicio-390x664-repouso-pt.png` · a página em repouso: os cartões, o mapa, os
  domínios, e a área de leitura com o nome de cada painel, o comando da
  densidade, a linha «Toque num cartão para ler a medida.» e mais nada;
* `inicio-390x664-uma-leitura-pt.png` · a mesma página depois de um toque no
  primeiro cartão da faixa: uma leitura aberta, com a unidade, o limiar, a
  definição, as três datas, a régua e o selo. **Tirada outra vez a 07.09**, com o
  guião que passou para `scripts/capturas-toque.mjs`: o cartão tocado deixou de
  ser o da posição de investimento internacional e passou a ser o da dívida
  pública, que é o primeiro da faixa e que desde o item 1 abre a leitura aqui
  como os outros vinte, com a porta «Ver no domínio →» no fim dela.

## 7 · Os três comandos

Sobre a construção deste ramo, com os códigos de saída lidos de ficheiro:

| comando | código |
| --- | --- |
| `npm run build` | 0 |
| `npm run verify` | 0 |
| `npm run typecheck` | 0 |

`npm run verify` falhou uma vez com código 2 antes de qualquer medição, e a
razão não era do bloco: `node_modules/axe-core` não existia nesta árvore (nem na
árvore principal), e `check:moldura` fecha sem ele. Instalou-se a versão que o
`package.json` fixa (4.13.0) e a corrida seguinte foi verde. **Fica dito para a
direção**: uma árvore acabada de criar não tem `axe-core` sem `npm ci`, e o
`verify` depende dele.
