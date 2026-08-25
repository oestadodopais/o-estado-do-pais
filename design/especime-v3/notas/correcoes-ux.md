# Nota das correções de UX · 25.08.2026

*Construtor (Claude Opus 5, `claude-opus-5[1m]`). Ramo `correcoes-ux-2026-08-25`, a partir de `main` em `cb133d5`. Contrato: `../briefs/BRIEF-correcoes-ux-A.md`, com a `AUDITORIA-UX-2026-08-25.md` por trás, e a Emenda 18 de `direcao.md` para o item A11. Sem travessões nesta prosa; o ponto médio é o separador. **Todos os números desta nota vêm de um comando que está escrito ao lado deles.***

---

## A · A primeira página e a navegação

### A.0 · Os comandos que dão os números

```
npm run build                                         (342 páginas, 41 chaves da prova)
npm run verify · npm run typecheck
node scripts/medir-defeitos.mjs
node tests/inicio/matriz.mjs
node tests/inicio/correcoes-a.mjs                     (32 réguas, sai com 0)
node tests/inicio/correcoes-a.mjs --json <ficheiro>   (as medidas desta nota)
```

As capturas estão em `../capturas/ux-2026-08-25/correcoes-a/`, em JPEG a escala 2, quatro por largura e edição (`antes-` e `depois-`, `cima` e `inteira`), mais `antes-evora-1280-pt-cima.jpg` e `depois-evora-1280-pt-cima.jpg`.

### A.1 · Os commits

| commit | o quê |
|---|---|
| `696b51a` | os dez itens e a frase de identidade, no código do sítio |
| `c6e8f03` | as réguas do bloco, a matriz sem as células cujo objecto saiu, o inventário |
| `bfcb8d1` | as três medições que rebentavam em vez de falhar com o estrago plantado |

### A.2 · O que se mediu, antes e depois

Todos os números são de `dist/`, medidos com Playwright: telemóvel em WebKit com `devices['iPhone 13']` (390 × 664) e toque a sério; computador em Chromium a 1280 × 800. As medições de pixéis correm com `deviceScaleFactor: 1`, para que um pixel da imagem seja um pixel de CSS.

| medida | antes | depois |
|---|---|---|
| altura do `<header>`, 390 | 258,7 px (39,0% do ecrã) | **200,9 px** (30,3%) |
| topo da manchete, 390 | 415,9 px (62,6%) | **249,7 px** (37,6%; o alvo é 40%, 265,6 px) |
| primeiro cartão do painel, 390 | 942,2 px | 849,9 px |
| altura da página, 390 | 6 131 px | 6 124 px |
| altura da página, 1280 | 4 900 px | 3 890 px |
| mapa a 390 | 84 × 110,6 px, 308 pontos com caixa | **0 × 0, zero pontos com caixa** |
| pesquisa a 390 | escondida (0 × 0, `hidden`) | **354 × 126,2 px, à vista, depois da lede** |
| comando de âmbito a 390 | nenhum segmento à vista | **«País · Concelho», com papel de botão** |
| destinos do telemóvel («Abrir um concelho →», «Ver uma região →») | 3 elementos | 0 |
| `#pesquisa` depois de tocar em «Concelho», 390 | topo a −130,9 px do ecrã, `visivel: false`, foco em `A.movel-destino` | **topo a 537,7 px de 664, dentro, foco em `#pesquisa-concelho`** |
| ligações dentro do `svg` do mapa, 1280 | 0 | **1**, para `/municipios/evora`, com `<title>` «Évora» e cursor `pointer` |
| raio e enchimento dos 308 pontos | um só raio, um só enchimento | **um só raio (4.5), um só enchimento (`none`)** |
| leitura do mapa ao passar o rato, 1280 | «Évoradistrito de Évora» | **«Évora · distrito de Évora»** |
| `#mapa` no âmbito região | `display: none`, `hidden=true` | **`grid`, `hidden=false`, em todos os estados** |
| `#convergencia` e a banda da região em `/` | presentes | ausentes |
| chaves da prova reconferidas pelo portão | 41 | **41** |
| texto abaixo de 12 px na rota `home`, 390 | 51 elementos (10 a 11,5 px) | **0** |
| alvos efetivos abaixo de 44 px, 390, fora da mobília | 10 | **0** |
| áreas de toque sobrepostas, 390 | 1 par (pt) · 2 pares (en), com a hipótese dos 44 px | **0** |
| maior banda de cor uniforme dentro do `<main>`, 390 | **97 px** em y = 824 | **43 px** em y = 830 |
| maior banda de cor uniforme dentro do `<main>`, 1280 | **125 px** em y = 1043 | **42 px** em y = 1067 |
| maior banda dentro do `<main>` de `/municipios/evora`, 1280 | 86 px (o ar da secção) | **45 px** |
| primeiro cartão de `/municipios/evora`, 1280 | 545..908 px (cortado a 800) | **499..846 px** (os quatro valores da primeira fila dentro do primeiro ecrã) |
| frases da casa na rota `home` | 32 distintas · conteúdo 33 · navegação 7 · autorreferência 0 | 28 distintas · conteúdo 31 · **navegação 5** · **autorreferência 0** · 0 por classificar |
| frase de identidade | não existia | **uma ocorrência em `/` e em `/en`**, Spectral 12 px, uma linha, sem porta e sem algarismo |

### A.3 · A prova de cada item, vista vermelha e verde

`node tests/inicio/correcoes-a.mjs` sai com 0 quando as 32 réguas passam e com 1 quando alguma falha. Cada item foi visto **vermelho** com um estrago plantado no código, reconstruído e medido, e **verde** depois de reposto. A tabela diz o estrago e o que a régua imprimiu com ele.

| item | o estrago plantado | o que a régua disse (saída 1) |
|---|---|---|
| A1 | o foco volta ao botão premido, em vez de ir ao campo | `foco «A»`, nas duas edições |
| A2 | `.cmd-grupo:first-child { display: none }` volta ao telemóvel | `0 modos à vista` e, a seguir, `sem toque: page.tap: Timeout` |
| A3 | a secção `#convergencia` volta a ser rendida em `/` | `#convergencia true · porta do telemóvel true`, e a banda de 79 px volta ao `<main>` a 1280 |
| A4 | a tela do mapa volta a render-se abaixo de 640 | `svg 84px · 308 pontos com caixa` |
| A5 | o ponto com página deixa de ser embrulhado em `<a>` | `0 dentro de <a> · title null · cursor null`, e o teclado deixa de lá chegar |
| A6 | o separador da leitura não se acende | `lê «Évoradistrito de Évora»` |
| A7 | as goteiras da marca voltam a 34/26 px no telemóvel | `cabeça 232,9px · manchete a 281,7px · 40% = 265,6px` |
| A8 | `section { padding-top }` volta a `clamp(52px, 7vw, 86px)` | `maior banda no main: 53px` a 390, `87px` a 1280, `90px` no concelho |
| A9 | `.regua-escala` sai do chão de 12 px | `11px span.regua-fim «0» · 11px span. «60» …` |
| A10 | `a.prova-valor::after` perde o `content` | `6 alvos abaixo de 44 fora da mobília` |
| A11 | a frase de identidade sai da marca | `0 ocorrências` |
| C1 | `figura.hidden = mo === 'regiao'` volta | `?ambito=regiao:algarve: none, hidden=true` |

Dois estragos apanharam mais do que o seu item, e é o que se espera de réguas que medem a mesma página: o de A4 acendeu também A10 (os 308 pontos voltam a ser alvos), e o de A3 acendeu A8 (a secção que volta traz o ar da secção com ela).

### A.4 · O detetor de bandas, provado antes de valer

Regra 14. O detetor mede corridas de linhas horizontais de cor uniforme na captura de página inteira, e uma corrida acaba quando a cor muda: um filete de 1 px parte a banda em duas, como parte no ecrã. Conta-se a corrida que tem tinta acima **e** abaixo, que é o «entre dois blocos de conteúdo» do brief.

Corrido sobre a construção anterior a este bloco, o detetor devolveu **97 px em y = 824 a 390** e **125 px em y = 1043 a 1280**. São o vazio que o diretor fotografou e os dois números que a auditoria publicou (96 e 125). É esse o caso conhecido em que ele fechou antes de as suas leituras contarem para alguma coisa.

A guarda do leitor-utilizador ficou escrita: acima de cerca de 50 000 px de altura a tela aceita a imagem e desenha-a vazia, e a página inteira lê-se como uma banda só. A régua devolve `telaVazia` e a célula falha em vez de dizer zero.

### A.5 · O que fica medido e não fechado

Três bandas de cor uniforme acima de 48 px ficam **fora do `<main>`**, e ficam por escrito em vez de fechadas:

| onde | 390 | 1280 |
|---|---|---|
| por cima da marca (goteira do cabeçalho) | dentro dos 48 | 68 px |
| entre a mobília e o conteúdo | dentro dos 48 | 76 px |
| entre a porta das correções e o rodapé | 69 px | 94 px |

São a composição da mobília e a separação do pé, e não bandas entre dois blocos de conteúdo: fechá-las é mudar as goteiras da marca e a distância do rodapé em todas as 342 páginas, que é uma decisão de desenho do diretor e não um efeito colateral de um bloco de correções. Ficam impressas ao lado do juízo, em cada corrida da régua.

Quatro alvos ficam com a área da sua própria linha, na **mobília do cabeçalho**: as duas leituras (`a.mob-leitura-porta`, `a.mob-leitura-k`) e as duas contagens da agenda (`a.prova-valor`). A razão está medida: as duas leituras vivem em duas linhas de 19 px a 25 px uma da outra (porque as duas cadeias medem 460 px de texto numa coluna de 354), e áreas de 44 px cruzam-se ali por 19 px na vertical; dar altura de fila às duas devolveria à cabeça os 50 px que o item A7 acabou de lhe tirar. É a mesma forma de exceção medida que `site.css` já escreve para o selo do `.brief-text`.

---

## B · os estudos, o livro-razão e as páginas de leitura

*Construtor (Claude Opus 5, `claude-opus-5[1m]`). Mesmo ramo, a partir do bloco A
em `62f70f5`. Contrato: `../briefs/BRIEF-correcoes-ux-B.md`. Sem travessões nesta
prosa; o ponto médio é o separador. **Todos os números desta secção vêm de um
comando que está escrito ao lado deles.***

### B.0 · Os comandos que dão os números

```
npm run build                                          (342 páginas, 41 chaves da prova)
npm run verify · npm run typecheck
node scripts/provar-eyetext.mjs                        (157)
node scripts/check-cadeia.mjs                          (196 e 2 405)
node scripts/medir-defeitos.mjs                        (zero blocos por classificar)
node tests/texto/leitura.mjs                           (51/51)
node tests/inicio/correcoes-a.mjs                      (32/32)
node tests/inicio/matriz.mjs                           (92/92)
node tests/texto/correcoes-b.mjs                       (19 réguas, sai com 0)
node tests/linha/correcoes-b.mjs                       (32 réguas, sai com 0)
node tests/*/correcoes-b.mjs --capturas <dir> --json <ficheiro>
```

As capturas estão em `../capturas/ux-2026-08-25/correcoes-b/`, em JPEG a escala
2, `antes-` e `depois-`, `cima` e `inteira`, a 390 e a 1280, para `/estudos`, a
página do 04, a sua leitura, `/livro-razao`, `/livro-razao/divida-publica-2025` e
`/municipios/evora`. A página de leitura não leva captura `inteira`: a 390 mede
mais de 30 000 px e a tela desenha-a vazia acima de ~50 000 (a guarda que o
bloco A escreveu).

### B.1 · O que se mediu, antes e depois

Telemóvel: WebKit com `devices['iPhone 13']` (390 × 664), `deviceScaleFactor: 1`.
Computador: Chromium a 1280 × 800.

| medida | antes | depois |
|---|---|---|
| linhas de `/estudos` | 16 (uma por edição) | **12** (uma por trabalho), com **16 edições como portas** |
| títulos repetidos em `/estudos` | 4 pares PT/EN | **0** |
| rótulos «Descrição: …» à vista | 2 formulações, em 16 fichas | **0** |
| altura de `/estudos` a 390 | 3 761 px | 3 391 px |
| primeira porta da página do trabalho | «Ler o documento →» | **«Ler no sítio →»**, com «Ler o documento →» a seguir e o rótulo «A edição de registo, tal como foi publicada.» |
| portas da faixa da edição arquivada | 3 (marca, Sobre, voltar) | **4**, com `data-oedp-texto` para a leitura no sítio |
| altura da página de leitura do 04, 390 | 74 050 px · 111,5 ecrãs | **30 377 px · 45,7 ecrãs** |
| altura da página de leitura do 04, 1280 | 47 137 px | **23 689 px** |
| «As linhas deste documento» | secção aberta, 212 entradas, 44 131 px no fluxo | **dobra fechada por defeito**, com as mesmas 212 entradas lá dentro |
| o aparelho do registo (`origin_ref`, resumo) | 2 blocos na coluna do aparelho | **0 no aparelho, 2 dentro da dobra** |
| a porta de uma figura, a 390 e a 1280 | levava à entrada | **abre a dobra e leva à entrada**, em WebKit e em Chromium, ao clique e em carga direta do endereço com fragmento |
| índice «Nesta página» na leitura | não existia | **9 entradas para 9 títulos de nível 2**, todas com destino, fora do `<article>` |
| comando «subir ↑» | não existia | **79,2 × 44 px, `position: fixed`**, a 390; `display: none` a 1280 |
| marcadores com porta para `/a-verificar` | 0 de 420 | **354 de 420**; os outros 66 vivem dentro do selo, que é um só `<a>` (§5.4) |
| âncoras aninhadas dentro de outra âncora, nas 342 páginas | 0 | **0** |
| «concelho» na interface inglesa, fora de citação | 61 ocorrências | **0** |
| a contagem do livro-razão | «Proveniência completa» + «128» | **«128 de 136 linhas com proveniência completa»** e **«8 de 136 linhas com campos por confirmar»**, de chaves da prova, sem um algarismo escrito |
| o identificador da linha | `divida-publica-2025`, sem rótulo | **«identificador: divida-publica-2025»**, em Bitter |
| o endereço da fonte, na página da linha | Bitter, `overflow-wrap: anywhere`, 3 linhas, sem transbordo | **igual** (já estava; o que faltava era o rótulo do id) |
| peças com estado «sem limiar» e quadrado | 12 em `/`, 7 em `/municipios/evora` | **0 e 0**, com a palavra em todas |
| peças com limiar publicado e quadrado | 22 | **22** |
| o par «242,6 → 105,5», 390 | duas linhas, a seta pendurada a x = 208,1 numa coluna de 312 | **dois grupos que não quebram por dentro**, a seta a abrir o segundo |
| o par a 1024 | uma linha | **uma linha** |
| áreas dos dois selos do par | 52,6 × 10,3 px (exceção escrita na folha) | **53 × 44 px, sem sobreposição**; a exceção da folha saiu |
| rótulos do gráfico dos mandatos | 2 acima e 2 abaixo da referência, a regra só num comentário | **os mesmos 2 e 2, zero a cruzar a referência, zero sobrepostos**, com a regra escrita e medida |
| texto abaixo de 12 px | **860 elementos** nas 9 rotas, edição portuguesa (o mais pequeno a 9,5 px) | **0** nas 9 rotas × 2 edições |
| alvos efetivos abaixo de 44 px | **591** nas 9 rotas, edição portuguesa, sem classificação | **1 196** nas 18 células, **todos dentro da exceção medida e 0 fora** |
| pares de áreas sobrepostas | o instrumento mudou, e a razão está em B.3 | **0** nas 18 células |

As contagens do «antes» por rota, a 390, na edição portuguesa (alvos abaixo de 44
· texto abaixo de 12): `estudos` 15 · 39, `estudo` 14 · 34, `texto` 331 · 14,
`livro` 10 · 384, `linha` 13 · 8, `municipio` 91 · 102, `agenda` 62 · 183,
`metodo` 47 · 45, `correcoes` 8 · 51. A auditoria publicou 88 e 66 para a agenda
e 44 e 74 para o Método: os números são de instrumentos diferentes — o dela
contou a caixa do elemento e esta conta a área efetiva, com o `::after`.

### B.2 · A prova de cada item, vista vermelha e verde

`node tests/texto/correcoes-b.mjs` (19 réguas, B1 a B6) e
`node tests/linha/correcoes-b.mjs` (32 réguas, B7 a B10) saem com 0 quando todas
passam e com 1 quando alguma falha. Cada item foi visto **vermelho** com um
estrago plantado, construído e medido, e **verde** depois de reposto.

| item | o estrago plantado | o que fechou, e o que disse |
|---|---|---|
| B1 | o arquivo repete um trabalho | a régua: `13 linhas · 1 títulos repetidos · 17 edições como portas` |
| B2 | a faixa da edição arquivada perde `data-oedp-texto` | **o portão de HTML**: `a faixa do observatório não tem a porta da leitura no sítio` |
| B2 | «Ler o documento →» volta a ser a primeira porta | a régua: as portas saem por `documento`, `texto`, `document` |
| B3 | a dobra volta a abrir por defeito | a régua: `dobra fechada false · página 74 823px` |
| B4 | o índice «Nesta página» sai da página | **o portão**: `L8 …: o índice «Nesta página» tem 0 entradas e o registo tem 13 títulos de nível 2`, e a âncora `#texto-indice` sem destino |
| B5 | o marcador volta a ser um `<span>` | a régua: `246 sem porta` |
| B6 | «concelho» volta à pesquisa inglesa | a régua: `1 ocorrência · en/index.html: «Type the name of the concelho»` |
| B7 | o identificador perde o rótulo | a régua: `«null: divida-publica-2025»` |
| B7 | o denominador passa a contar outra coisa | a régua: `«128 de 19 linhas com proveniência completa» ← indexaveis + derivadas` |
| B8 | o quadrado vazio volta | a régua: `14 peça(s) com estado e sem quadrado` e `1` no concelho |
| B9 | o par deixa de ser uma fila | a régua: `pares sobrepostos: 1 · a.src-chip … × a.src-chip …` |
| B9 | os quatro rótulos vão todos para cima | a régua: `141,9 abaixo (33.6..48.5) · a cruzar a referência: 1` |
| B10 | o chão de 12 px sai da mobília compacta | a régua: `texto abaixo de 12px: 5 · 9.5px span.mob-leitura-k …` em 18 das 18 células |

Dois estragos fecharam a CONSTRUÇÃO e não a régua, e é o que se espera de uma
conferência que vive no portão: o da faixa (a conferência nova do B2) e o do
índice (o L8, a conferência nova do B4).

### B.3 · A correção do instrumento que mede as sobreposições

A régua do bloco A comparou as **caixas de delimitação** de dois alvos. Numa
ligação de uma linha isso é a área que o dedo encontra; num parágrafo, uma
ligação que quebra em três linhas tem uma caixa que cobre a largura toda e as
três linhas, e duas ligações seguidas no mesmo parágrafo aparecem sempre
sobrepostas sem que nenhum dedo as consiga tocar às duas. **Medido:** com a
caixa de delimitação, `/agenda` dava 38 pares e `/metodo` 29, e a maior parte
eram ligações em linhas diferentes.

A área que um dedo encontra é a **caixa de cada linha** do elemento
(`getClientRects()`), mais a caixa do `::after`. É isso que a régua deste bloco
compara. Provado num caso conhecido antes de valer (regra 14): o par que o item
B9 fechou, e cuja exceção a folha tinha escrita por extenso («duas áreas de 44px
a 33,8px uma da outra sobrepõem-se por 10,2»).

Três classes de par ficam contadas à parte, cada uma com a sua razão impressa em
cada corrida:

* **duas portas dentro da mesma prosa corrida** — a caixa de um elemento em
  linha mede mais do que a entrelinha da frase (21 px numa linha de 19), e por
  isso entra sempre um pouco na linha de cima. É o que uma linha de texto é;
* **um alvo a tocar a caixa de um `<summary>`** que ocupa a linha toda — a fila
  da disposição A da dobra é desenhada por cima da fila seguinte, e quem toca no
  elemento de cima acerta no elemento de cima. Pré-existente a este bloco;
* **um comando flutuante** — o «subir ↑» flutua por cima da página por
  definição, e ao rolar passa por cima de tudo. É o preço de um comando fixo, e
  está dito.

### B.4 · O que fica medido e não fechado

**O texto dentro dos desenhos.** Num `<svg>` com `viewBox` o corpo declarado
está em unidades de utilizador e o que se lê é `corpo × escala`: a 390 as marcas
de escala rendem-se entre **3,7 px e 6,6 px**, e são **146 elementos** nas nove
rotas (25 no concelho, 28 na agenda, 20 no Método, por edição). Pô-las a 12 px
lidos obriga a multiplicar o corpo por dois e meio dentro de cada instrumento, o
que é redesenhar as escalas do eixo da agenda, do mecanismo do Método, da banda
dos mandatos e das duas séries do concelho. É desenho, e é do diretor. A régua
conta-as em cada corrida, ao lado do juízo.

**Os alvos dentro de prosa corrida: 1 196 nas nove rotas × duas edições**, 328
deles na página de leitura do 04, que são as portas das figuras do documento
transcrito. Dar-lhes 44 px punha cada uma por cima da porta da linha de cima; é
a mesma exceção que a folha já escreve para o `.brief-text`, e é também a
isenção que a 2.5.8 das WCAG faz a um alvo dentro de uma frase. As classes estão
nomeadas na régua.

**Cinco alvos da mobília do cabeçalho por rota**, com a razão que o bloco A
mediu e escreveu.

**O ponto do mapa no telemóvel.** Na página de um concelho o mapa continua a
render-se abaixo de 640, e o ponto de Évora — que o bloco A pôs dentro de um
`<a>` para o computador — media **2,5 × 2,5 px**. A Emenda 3 diz que no
telemóvel os 308 pontos nunca são alvos: abaixo de 640 o ponto deixa de aceitar
o toque (`pointer-events: none`), e o Tab continua a chegar lá. A porta do
concelho, no telemóvel, é a da ficha do mapa, que está ao lado e é uma fila.

**Uma célula de `tests/linha/recibo.mjs` falha, e é anterior a este bloco:** a
3b espera 132 linhas do livro-razão e há 136. Nem `ledger/` nem essa expectativa
foram tocados aqui.

---

## C · o que a leitura cruzada dos blocos A e B apanhou

*Construtor (Claude Opus 5, `claude-opus-5[1m]`). Mesmo ramo, a partir do bloco B
em `5f60f9a`. Contrato: `../briefs/BRIEF-correcoes-ux-C.md`, com a leitura do
Codex e a triagem do lugar de direção por trás
(`../critica/2026-08-25-codex-leitura-correcoes.md`). Sem travessões nesta prosa;
o ponto médio é o separador. **Todos os números desta secção vêm de um comando
que está escrito ao lado deles.***

### C.0 · Os comandos que dão os números

```
npm run build                                          (342 páginas, 41 chaves da prova)
npm run verify · npm run typecheck
node tests/texto/correcoes-c.mjs                       (9 réguas, sai com 0)
node tests/municipio/correcoes-c.mjs                   (12 réguas, sai com 0)
node tests/*/correcoes-c.mjs --capturas <dir> --json <ficheiro>
node tests/inicio/correcoes-a.mjs                      (32/32)
node tests/texto/correcoes-b.mjs                       (19/19)
node tests/linha/correcoes-b.mjs                       (32/32)
node tests/inicio/matriz.mjs                           (92/92)
node tests/texto/leitura.mjs                           (51/51)
node scripts/medir-defeitos.mjs                        (zero blocos por classificar)
```

**A linha de base do item C2 é outra construção, e está escrita:** `main` em
`cb133d5`, construída numa árvore de trabalho separada, servida a par com a deste
ramo. É o estado **antes do bloco B**, que é contra o que o brief manda medir o
C2 («volta a caber dez entradas onde cabiam dez»).

As capturas estão em `../capturas/ux-2026-08-25/correcoes-c/`, em JPEG a escala
2, a 390 e a 1280. `antes-` é este ramo antes do passo C;
`antes-do-bloco-b-` é a construção de `main`, e existe só para as duas do item
C2.

### C.1 · O que se mediu, antes e depois

Telemóvel: WebKit com `devices['iPhone 13']` (390 × 664), `deviceScaleFactor: 1`.
Computador: Chromium a 1280 × 800.

| medida | antes | depois |
|---|---|---|
| topo do `<h1>` do documento, leitura do 04, 390 | 734,1 px · **110,6 %** de um ecrã de 664 | **293,3 px · 44,2 %** (o alvo é 45 %, 298,8 px) |
| a banda do índice, 390 | 468,8 px, aberta, por cima do título | **46 px**, dobra fechada, por cima do título |
| o índice a 1280 | na coluna do corpo, em x = 94 | **na coluna do aparelho, em x = 689,2**, com o aparelho 22 px abaixo dele |
| o `<h1>` a 1280 | a 637,3 px, debaixo do índice | **a 301,5 px, no topo do corpo** (12 px abaixo dele) |
| a porta da dobra do índice, 390 | não existia | **354 × 44 px** |
| índice do Método, 390 · altura | 349,5 px antes do bloco B · **586 px** depois dele | **338 px** (en: 360,5) |
| índice do Método, 390 · entradas no primeiro ecrã | 10 antes do bloco B · **7** depois dele | **11 de 11** |
| índice da agenda, 390 · altura | 190 px antes do bloco B · **299,8 px** depois dele | **199,8 px** |
| índice da agenda, 390 · entradas no primeiro ecrã | 5 · 5 | **5 de 5** |
| alvos do índice abaixo de 44 px, 390, nas duas edições | 0 | **0** (o menor mede 62,3 × 44,0) |
| pares de áreas sobrepostas dentro do índice | 0 | **0** |
| separador dos milhares num `[data-claim]`, nas 342 páginas | **274 valores com U+202F**, 0 com U+00A0 | **274 com U+00A0**, 0 com U+202F |
| largura do separador, «167 372 755,84», WebKit a 28 px | **1,64 px** (um algarismo mede 16,65) | **4,25 px** |
| largura do separador, Chromium a 40 px | 6,53 px (um algarismo mede 23,80) | 6,06 px |
| campo de pesquisa em `/municipios`, 390 | não existia | **a 421,5 px de 664, 340 × 44 px, dentro do primeiro ecrã** (en: 454,5) |
| resultados da pesquisa em `/municipios` | nenhum | **308**, 1 com página à vista e 307 escondidos |
| «evora» escrito na caixa | (não havia caixa) | **1 resultado: Évora [tem página] → `/municipios/evora`** |
| «beja» escrito na caixa | (não havia caixa) | **1 resultado: Beja [sem página ainda], sem porta** |
| a primeira secção da lista dos concelhos | «Aveiro» | **«Com página»**, com «Aveiro» a seguir |
| altura de `/municipios`, 390 | 13 234 px | 13 489 px |
| chaves da prova reconferidas pelo portão | 41 | **41** |
| páginas construídas | 342 | **342** |

### C.2 · A prova de cada item, vista vermelha e verde

`node tests/texto/correcoes-c.mjs` (9 réguas, C1 e C3) e
`node tests/municipio/correcoes-c.mjs` (12 réguas, C2 e C4) saem com 0 quando
todas passam e com 1 quando alguma falha. Cada item foi visto **vermelho** com um
estrago plantado, construído e medido, e **verde** depois de reposto da cópia.

| item | o estrago plantado | o que a régua disse (saída 1) |
|---|---|---|
| C1 | a dobra do índice volta a abrir por defeito | `h1 a 718,3px de 664 (108,2%) · dobra fechada false` |
| C1 | a colocação na grelha sai da folha | `índice em x=94 · corpo em x=689,2 · aparelho em x=94 y=38510,8 · à direita do corpo false · aparelho a 38135,2px do fim do índice` |
| C2 | a lista volta a uma coluna no telemóvel | `7 de 11 entradas dentro dos 664px · índice 586px` |
| C2 | a forma (a) do brief: área por pseudo-elemento, sem altura de fila | `11 de 11 entradas · índice 349,5px · pares sobrepostos: 10 · As fontes × O motor [56×16]` |
| C2 | a entrada do índice perde os 44 px | `alvos abaixo de 44px: 8 (o menor mede 62,3×22,5)` |
| C3 | o separador volta a U+202F | `0 com U+00A0 · 274 com U+202F` e, a 390, `U+00A0 = 4,25px · U+202F = 1,64px` |
| C4 | a pesquisa perde a função do destino | `«evora» → Évora [com-pagina] → sem porta · «beja» → Beja [null] → sem porta` |
| C4 | a pesquisa e a secção vão para o fim da página | `campo a 12 856,5px de 664, dentro false` e `a primeira é «Aveiro»` |
| C4 | o bloco da pesquisa perde o `hidden` | `bloco com hidden: false` |

**O estrago do C3 não fecha o PORTÃO, e é essa a razão de ser da sua régua.** A
`formaDoValor()` da §1.47 (T4) leva U+202F, U+00A0 e U+2009 ao mesmo U+0020: com
o separador antigo a construção continua verde nas 342 páginas, e a única coisa
que muda é o que se lê. Um item cuja correção o portão não distingue precisa de
uma régua que a distinga, e é a que mede a largura do carácter no navegador.

**Uma régua anterior mudou de expectativa.** A célula «a 1280 a página é a
disposição B» de `tests/texto/leitura.mjs` perguntava se o aparelho começava à
mesma altura do corpo. Com o índice por cima dele, começa 108 px mais abaixo.
A pergunta passa a ser a que define a disposição B, a segunda coluna ao lado do
corpo e não por baixo dele, e foi vista vermelha com o mesmo estrago que fechou
o C1 a 1280: `o corpo acaba em x=989 e o aparelho começa em x=94`.

### C.3 · A dobra que não se abre por folha de estilo, e a medição que mentiu

A forma bonita do C1 seria uma dobra fechada no telemóvel e aberta no computador.
Ela não existe, e a maneira como isso se soube é a lição.

A primeira sonda escreveu um `<details>` fechado com
`details:not([open]) > .conteudo { display: grid }` e leu
`getBoundingClientRect()`: **60 px de altura, `display: grid`, `visibility:
visible`**, nos dois motores. Parecia funcionar. A segunda sonda pintou o
conteúdo de preto, pôs um controlo preto ao lado e tirou uma captura: **uma banda
só**, nos dois motores. O conteúdo tem caixa e não tem tinta.

É a regra 15 apanhada em direto, a caixa não é o píxel, e é a razão pela qual a
dobra do índice é fechada nas duas larguras, com a razão escrita na folha e no
gabarito em vez de ficar por dizer.

### C.4 · O que fica medido e não fechado

**O índice do Método em inglês mede 360,5 px, contra 338 na edição portuguesa**,
porque duas entradas quebram em duas linhas dentro da sua coluna de 170 px. As
onze cabem no primeiro ecrã nas duas edições, e o tecto que a régua impõe, que é a
altura de antes do bloco B mais uma fila, dá-lhe 39 px de folga. Uma linha que
quebra dentro de uma célula de índice não é um defeito medido; se vier a ser,
a saída é o corpo da entrada e não a coluna, e isso é desenho.

**O índice da agenda mede 199,8 px, contra 190 antes do bloco B.** São 9,8 px a
mais, e são o preço dos 44 px de alvo em três filas em vez de cinco. As cinco
entradas cabem no primeiro ecrã, que é o que o brief manda medir.

**A dobra do índice da leitura é fechada também no computador**, onde a coluna do
aparelho tinha espaço para a mostrar aberta. É o preço de não haver maneira de
abrir um `<details>` por folha de estilo, e está medido na C.3. A saída, se a
direção a quiser, é uma linha de JavaScript, e esta rota não tem nenhuma.

**A pesquisa de `/municipios` não existe sem script.** É a regra que a peça já
escrevia («uma caixa de pesquisa que não pesquisa é pior do que nenhuma»), e o
custo é que quem chega sem JavaScript vê a página que já existia: a lista dos 308
por distritos, inteira, com a secção «Com página» à cabeça. A secção e a lista são
servidor puro, e por isso a correção do índice morto vale nas duas condições.

**`tests/texto/leitura.mjs` não sai com 1 quando uma célula falha:** imprime
`50/51` e sai com 0. É anterior a este passo e não foi tocado aqui; fica escrito
porque uma régua que não muda o código de saída não trava nada.

**A célula 3b de `tests/linha/recibo.mjs` continua a falhar**, e é anterior ao
bloco B: espera 132 linhas do livro-razão e há 136. Nem `ledger/` nem essa
expectativa foram tocados aqui.
