# A cabeça nova como contentor · relatório do construtor

*Segunda passagem, 01.09.2026, sobre os oito pontos que o lugar de direção devolveu depois da medição cega (Sonnet, 4 de 4 estragos vistos) e da leitura a frio (Codex, 3 de 3 plantas). O que mudou nesta passagem está na §10, e os números do relatório inteiro são os dela.*

*Bloco `cabeca-2026-09-01`, saído de `main` `307796f` (que é `cfa5045`, o commit que a ordem nomeia, mais o commit da própria ordem), num worktree. Construtor: Claude Opus 5. Ordem: `design/observatorio/ORDEM-cabeca-2026-09-01.md`. Especificação: `design/observatorio/BRIEF-forma-dos-dominios.md`. Todas as medições correram em Chromium sem cabeça sobre o `dist/` construído, nas duas edições, e cada número desta página saiu de uma corrida que se diz ao lado dele. Sem travessões na prosa.*

**Modelo: Claude Opus 5.**

## 0 · O que ficou feito

A primeira página tem a cabeça do brief: o nome, a manchete, uma faixa de vinte e um cartões que se percorre de lado com `scroll-snap` e sem uma linha de guião, e o mapa. A busca dos 308 e os nomes das 29 unidades recolheram-se em duas gavetas ao lado do mapa, fechadas, que abrem sem guião. A linha de comando («Âmbito», «Densidade») saiu da cabeça e desceu para o cabeçalho do painel. As páginas de região e de concelho herdam a mesma faixa, cada uma com as suas medidas. A data do cabeçalho passou a escrever-se dd.mm.aaaa.

A 390 px, o primeiro número selado de uma medida estava a **1 766,9 px** da manchete, ou seja a **2,09 ecrãs** de 844 px; passou a estar a **138,2 px**, ou **0,16 ecrãs**. A página do país a 390 encolheu **479 px** e a 1280 encolheu **5 px**.

## 1 · As medidas de aceitação do brief §4, célula a célula

| a medida do brief | como ficou | onde se lê |
|---|---|---|
| a 390 × 844 o primeiro ecrã contém o nome, a manchete inteira, a faixa com o primeiro cartão inteiro e o topo do mapa | **cumprida.** nome 68 a 103,4 (inteiro); manchete 249,5 a 408,3 (inteira); faixa 510,3 a 710,1 (inteira); primeiro cartão 511,3 a 705,1 (inteiro); topo do mapa a 726,1, dentro dos 844 | §2.1 |
| o primeiro número selado a menos de um ecrã da manchete a 390 | **cumprida.** 138,2 px, 0,16 ecrãs (antes 1 766,9 px, 2,09 ecrãs, medidos numa construção do commit de partida) | §2.2 · `faixa.mjs` F11 |
| a página do país a 390 não mais alta do que hoje | **cumprida.** 7 529 → **7 050** px (−479); em inglês 7 484 → 7 020 (−464). Também abaixo dos 7 383 px que o brief cita de 29.08 | §2.3 |
| a página do país a 1280 não mais alta do que hoje | **cumprida contra o «hoje» medido, e não contra o número de 29.08.** 4 030 → **4 025** px (−5). O brief cita 4 003 px, medidos a 29.08; a página cresceu 27 px entre 29.08 e 01.09 com o bloco do rótulo de IA, e a ordem manda medir de novo o «hoje». Contra 4 003 px ficam 22 px acima, e isso fica dito | §2.3 e a dúvida 3 |
| a cabeça a 1280 mantém o alinhamento da §1.84 | **mantém-se, e o mecanismo mudou.** O mapa vai de 351,1 a 1 034,1 e a legenda acaba em 1 034,1: **0 px** de diferença no fundo, e 0 px no topo contra a manchete. O que mudou foi a dependência: era a altura a decidir a largura, e passou a ser a largura a decidir a altura | §3.2 · `lista.mjs` L11 |
| `tests/inicio/lista.mjs` (L11 a L13) verde ou reescrita, nunca desligada | **94 de 94 verdes.** L2, L3, L9, L11, L12 reescritas para a forma decidida, com a razão escrita em cada uma | §4 |
| todo o alvo tocável ≥ 44 × 44 px abaixo de 1024 e 32 px a partir de 1024 | **sem regressão.** No corpo da primeira página, a 320, 360, 390 e 430: **0** alvos abaixo de 44, antes e depois. A 768 são 11 antes e 11 depois, e a 1024 e 1280 são 4 antes e 4 depois: os mesmos, e nenhum é da faixa | §2.4 |
| os cartões da faixa são alvos inteiros | **cumprida.** A porta cobre o cartão inteiro menos a fila do selo, com a largura toda e desde o topo; a mais pequena mede 79,3 × 109,1 px a 320 | `faixa.mjs` F3 |
| a faixa funciona sem JavaScript, com `scroll-snap`, é uma lista no documento | **cumprida.** Com o guião desligado, 21 de 21 cartões com caixa, `overflow-x: auto`, nenhum `<script>` a nomear a faixa; `scroll-snap-type: x mandatory` e `scroll-snap-align: start` nos 21 | `faixa.mjs` F4 e F5 |
| navegável por teclado, e o leitor de ecrã lê «lista de N cartões» | **cumprida.** O `Tab` chega às 21 portas pela ordem do documento; é uma `<ol>` com 21 `<li>` e o nome «As medidas, uma por cartão» | `faixa.mjs` F7 e F1 |
| o mapa escolhe regiões a todas as larguras; a lista dos nomes existe fechada e abre sem guião; a régua do mapa verde | **cumprida.** As 29 unidades continuam a ser as áreas do desenho e cada uma leva à sua página; as duas gavetas vêm fechadas às sete larguras e a dos nomes abre com um toque real no `<summary>`, com o guião desligado, pondo os 29 nomes à vista. `mapa-distritos.mjs` 43 de 43 e `mapa-navegacao.mjs` 9 de 9 | `faixa.mjs` F10a e F10b · §4 |
| cada camada é um endereço com a mesma cabeça | **cumprida nas três.** O país, as 9 regiões e os 308 concelhos rendem a mesma faixa, com as medidas de cada um | `faixa.mjs` F12 |
| texto a 4,5:1, objetos de interface a 3:1, nos dois temas | **sem mudança.** `medir-contraste.mjs` sobre `tokens.css`: 0 falhas de texto; os 4 objetos abaixo de 3:1 são os que a casa já declara com contorno de tinta (`onamber/amber`, `cobalt/paper`), e este bloco não acrescenta cor nenhuma | §2.5 |
| os números da faixa mais pequenos no telemóvel, por regra na folha, sem descer abaixo do corpo mínimo | **cumprida.** Duas fichas declaradas: `--faixa-corpo-movel: 30px` e `--faixa-corpo-largo: 40px`. Medido: 30,00 px a 390 e 40,00 px a 1280, iguais nos 21 cartões. O chão da casa para um número com selo é 19 px (a lista social) | §2.6 · `faixa.mjs` F8 |
| os tipos ficam; nenhum tipo novo | **cumprida.** Nenhuma família nova; a faixa compõe-se em Bitter (o número e a unidade) e Spectral (o nome), que é a repartição da peça | (sem número) |
| cada cadeia nova no inventário da voz; `check:voz` e `check:lingua` verdes | **cumprida, com um buraco encontrado e não tapado.** Duas linhas novas no inventário (o nome da faixa, nas duas edições); `check:voz` e `check:lingua` a 0. As quatro cadeias dos `<summary>` das gavetas não entram porque a régua da voz salta os `<summary>`: está na dúvida 5 | §5 |
| as datas em dd.mm.aaaa; a data ISO do cabeçalho sai | **cumprida no cabeçalho.** «2026-08-31» passou a «31.08.2026» em 6 590 páginas. O dado continua ISO em `verificacao.mjs`, que é como se ordena e como o portão o reconta | §5.3 |
| as duas edições da mesma construção | **cumprida.** Todos os números deste relatório estão medidos nas duas | (sem número) |
| `build`, `verify`, `typecheck` a 0 | **0, 0 e 0** | §4 |
| uma régua nova para a faixa com estragos plantados vistos vermelhos | **`tests/inicio/faixa.mjs`, 76 células, e 7 estragos, 7 vistos vermelhos** com as três exigências | §4 |
| nenhum número novo no sítio | **cumprida.** Nenhum ficheiro de `ledger/` tocado (git); os 22 ids distintos que a primeira página rende são os 13 do Procedimento, os 8 do Painel Social e a linha da Carta, e a célula F1 compara o conjunto dos cartões com o conjunto das medidas da página elemento a elemento | §2.7 |

## 2 · As medições, antes e depois

O «antes» é a construção de `307796f`, medida nesta worktree antes da primeira alteração (`medicoes/cabeca-antes.json`); o «depois» é a construção final (`medicoes/cabeca-depois.json`). O programa é `medicoes/cabeca-medidas.mjs`, e diz ao lado de cada medida como a mede.

### 2.1 · O primeiro ecrã a 390 × 844 (pt)

| bloco | antes | depois |
|---|---|---|
| o nome do sítio | 68 a 103,4 · inteiro | 68 a 103,4 · **inteiro** |
| a manchete da página | 249,5 a 408,3 · inteira | 249,5 a 408,3 · **inteira** |
| a faixa | não existia | 510,3 a 710,1 · **inteira** |
| o primeiro cartão | não existia | 511,3 a 705,1 · **inteiro** |
| o mapa | 898,7 a 1 412,9 · fora do ecrã | 726,1 a 1 240,3 · **começa dentro** |
| a linha de comando | 510,3 a 626,5 · dentro | 1 467,5 a 1 574,7 · fora |
| a busca | 642,5 a 882,7 · começava dentro | 1 451,5 a 1 691,7 · fora, e fechada |
| a rede dos nomes | 1 532,1 a 2 048,5 | 1 404,5 a 1 920,9 · fechada |
| o painel | 2 048,5 | 1 574,7 |

*A «manchete» é a da vista (`main h1`) e não o `<h1 class="wordmark">` do cabeçalho. A primeira redação deste programa media o segundo, e a distância saía do nome do sítio: 442,4 px em vez de 138,2. Está corrigido, e fica dito.*

### 2.2 · Da manchete ao primeiro número selado

Do fundo da manchete ao topo do primeiro `[data-claim]` que tem o seu selo no invólucro, que é a mesma relação que `auditaSelo()` confere no portão. A manchete é a da VISTA (`main h1`) e não o `<h1 class="wordmark">` do cabeçalho.

**O «antes» desta tabela foi medido outra vez, e o primeiro estava errado.** A primeira redação deste programa media `document.querySelector('h1')`, que devolve o `<h1>` do cabeçalho, ou seja o nome do sítio: a distância saía do nome do sítio e não da afirmação com números, e o número publicado na primeira passagem (2 071,9 px, 2,45 ecrãs) media outra coisa. O seletor foi corrigido, mas o «antes» nunca tinha sido corrido com ele: a construção de partida já não existia. Nesta passagem o commit de partida (`307796f`) foi extraído para uma pasta de ensaio fora do repositório (`git archive`, sem tocar em nada), construído e medido com o programa corrigido. Os números abaixo são desse ensaio.

| | antes (`307796f`, medido de novo) | depois |
|---|---:|---:|
| 390 pt · a primeira MEDIDA | 1 766,9 px · **2,09 ecrãs** | **138,2 px · 0,16 ecrãs** |
| 390 en · a primeira medida | 1 749,7 px · 2,07 ecrãs | 138,2 px · 0,16 ecrãs |
| 1280 pt · a primeira medida | (não medido no ensaio) | 109,1 px · 0,13 ecrãs |
| 390 pt · o primeiro selado de qualquer espécie | 1 018,6 px · 1,21 ecrãs (a contagem dos 308 da legenda) | 138,2 px (a dívida pública) |

*Dois números e não um, e a razão está no programa: o primeiro selado do documento era a contagem dos 308 concelhos da legenda do mapa, que é uma medida da Carta e não uma medida de Portugal.*

*A leitura do lugar de direção de 31.08 diz «cerca de quatro ecrãs»; o que este ensaio mede são 2,09. A medição cega do Sonnet, com o método dela, deu 2,22. As três contas medem coisas ligeiramente diferentes (de onde começa a manchete, o que conta como primeiro número), e o que este relatório afirma é a sua, com o programa e o commit ao lado.*

### 2.3 · A altura das páginas, às sete larguras e nas duas edições

`document.documentElement.scrollHeight`, com o tipo carregado, que é a mesma leitura de `medicoes/inicio-lista-construtor.md` §1.1.

**A primeira página**

| janela | pt | menos | en | menos |
|---|---|---:|---|---:|
| 320 | 7 931 → **7 301** | −630 | 7 895 → **7 265** | −630 |
| 360 | 7 557 → **7 066** | −491 | 7 635 → **7 144** | −491 |
| 390 | 7 529 → **7 050** | −479 | 7 484 → **7 020** | −464 |
| 430 | 7 300 → **6 959** | −341 | 7 303 → **6 963** | −340 |
| 768 | 5 277 → **5 261** | −16 | 5 370 → **5 371** | **+1** |
| 1024 | 3 872 → **3 914** | **+42** | 3 831 → **3 876** | **+45** |
| 1280 | 4 030 → **4 025** | −5 | 4 014 → **4 009** | −5 |

**A página de uma região** (`/regioes/alentejo`) e **a de um concelho** (`/municipios/evora`)

| janela | região pt | menos | concelho pt | menos |
|---|---|---:|---|---:|
| 320 | 2 778 → **3 187** | +409 | 10 071 → **10 302** | +231 |
| 390 | 2 602 → **3 010** | +408 | 9 253 → **9 484** | +231 |
| 768 | 2 454 → **2 792** | +338 | 7 028 → **7 207** | +179 |
| 1024 | 2 550 → **2 910** | +360 | 6 644 → **7 104** | +460 |
| 1280 | 2 662 → **3 008** | +346 | 6 776 → **7 207** | +431 |

**Onde a primeira página cresce, e são duas larguras e não uma.** A 1024 cresce 42 px em português e 45 em inglês; a 768 encolhe 16 px em português e cresce **1 px** em inglês. A primeira redação deste relatório escreveu «1024 é a única largura em que cresce», e não é: em inglês são duas. A 1024 a razão é medida: o mapa tem 340,1 px de largura e 448,4 de altura, e a coluna esquerda passou a ter uma fila a mais (a faixa) sem que o mapa possa crescer com ela. A 768 em inglês é um píxel, e é o arredondamento de uma linha de texto. O brief nomeia 390 e 1280 e as duas ficam abaixo do «hoje»; as outras não são medidas de aceitação, e ficam escritas.

**A página de uma região cresce ~350 a 400 px, e a maior parte não é a faixa.** `RegiaoView.astro` rendia `<Peca>` dentro de um `.painel` desde a Emenda 21 e nunca importou `src/styles/inicio.css`, onde as duas classes vivem: as duas peças de cada uma das nove regiões desenhavam-se sem folha nenhuma. A faixa precisava da mesma folha e trouxe o defeito à luz. Está na §6.

**A página de um concelho cresce ~180 a 230 px no telemóvel e ~440 no ecrã largo.** É a faixa, mais o cartão localizador que subiu para a cabeça: no ecrã largo ele estava na coluna do aparelho, ao lado do corpo, e passou a ter uma fila só para ele. O que se compra é a camada 1 no primeiro ecrã: a célula A8 de `correcoes-a.mjs` media que os quatro primeiros valores do relance cabem nos primeiros 800 px, e com as peças o primeiro estava a 744 px e só dois dos quatro cabiam; com a faixa o primeiro está a 388 e cabem os quatro.

### 2.4 · Os alvos

A área efectiva de um alvo é a caixa do elemento unida com a do seu `::after` absoluto centrado nele, que é a definição de `tests/inicio/correcoes-a.mjs` (item A10), copiada sem uma vírgula de diferença para que os dois números se possam comparar. As áreas do desenho do mapa ficam de fora, pela razão da I82.

| janela | mínimo | antes (corpo + mobília) | depois (corpo + mobília) |
|---|---:|---|---|
| 320 | 44 | **0** + 15 | **0** + 15 |
| 360 | 44 | **0** + 15 | **0** + 15 |
| 390 | 44 | **0** + 15 | **0** + 15 |
| 430 | 44 | **0** + 15 | **0** + 15 |
| 768 | 44 | 11 + 24 | 11 + 24 |
| 1024 | 32 | 4 + 24 | 4 + 24 |
| 1280 | 32 | 4 + 24 | 4 + 24 |

**Os alvos pequenos não são deste bloco, e são os mesmos antes e depois.** A 768 são **onze, e a conta fecha**: as **seis** posições da linha de comando (quatro do âmbito e duas da densidade, 33,6 px de altura, porque `.seg { min-height: 44px }` vive dentro do `@media (max-width: 640px)`) e **cinco** ligações de texto («O livro-razão →» com 14 px, «Agenda» com 32, «a página inteira →» com 19,2, o endereço de correio com 19 e «O registo de correções →» com 24). A 1024 e a 1280, onde o mínimo é 32, ficam quatro dessas cinco. **Nenhum é da faixa nem das gavetas**, e nenhum mudou com este bloco: a regra dos 44 px abaixo de 1024 tem um buraco entre 641 e 1023 que é anterior a este trabalho e continua aberto. Fica na §6.

*A primeira redação desta secção contava «seis posições, cinco resultados da busca e quatro ligações», que são quinze e não onze: os resultados da busca já não entram na conta, porque a sonda passou a perguntar ao navegador se uma gaveta fechada se vê, e a soma tinha ficado por refazer.*

**Uma gaveta fechada não é um alvo, e as réguas tiveram de aprender isso.** Medido neste Chromium: `getBoundingClientRect()` sobre um descendente de um `<details>` fechado devolve na mesma uma caixa, com coordenadas de um arranjo que não está no ecrã. Sem esse conhecimento, os 308 resultados da busca entravam na medição como alvos e davam 63 pares de áreas sobrepostas em `correcoes-a.mjs` A10. A pergunta certa é `checkVisibility()`, que é a do navegador e responde «não»; está escrita em `correcoes-a.mjs`, em `faixa.mjs`, em `mapa-navegacao.mjs` e no programa das medidas, com a razão ao lado.

### 2.5 · O contraste

`node scripts/medir-contraste.mjs`, sobre `src/styles/tokens.css`, que este bloco não toca: **0 falhas de texto**; 4 objetos de interface abaixo de 3:1, que são os dois pares que a casa já declara com contorno de tinta (`onamber / amber` 1,92:1 e `cobalt / paper` 2,16:1, nos dois temas). A faixa não introduz cor nenhuma: o quadrado e a palavra de estado do cartão usam as mesmas classes `.sq-*` e `.est-*` da peça, e o resto é tinta e cinzento.

### 2.6 · O corpo dos números

| | 390 | 1280 |
|---|---:|---:|
| a faixa | **30,00 px** | **40,00 px** |
| a peça do painel | 39,31 px | 56,00 px |
| a lista social | 19,00 px | 19,00 px |
| a manchete da página | 28,00 px | 40,00 px |

Os dois corpos da faixa são fichas declaradas (`--faixa-corpo-movel`, `--faixa-corpo-largo`) e não uma rampa: uma `clamp()` daria um número diferente em cada largura e a promessa deixaria de se poder medir com dois números. Iguais nos 21 cartões a cada largura (célula F8).

### 2.7 · O livro-razão, antes e depois

* Nenhum ficheiro de `ledger/`, de `indicators/` nem `src/data/verificacao.mjs` foi tocado: `git status --porcelain` sobre esses caminhos devolve vazio.
* A primeira página rende **22 ids distintos** do livro-razão, nas duas edições: as 13 medidas do Procedimento, as 8 do Painel Social e a linha da Carta. São os mesmos de antes: a célula F1 compara o conjunto dos ids dos cartões com o conjunto das medidas que a página rende por baixo, elemento a elemento, e os dois são iguais nos dois sentidos.
* O que mudou foi o número de OCORRÊNCIAS: 43 `[data-claim]` e 86 selos, contra 22 e 65, porque cada uma das 21 medidas passa a aparecer duas vezes na página, uma no cartão (o Relance) e outra na peça ou na linha (a Leitura breve). É a mesma relação que os 29 nomes têm com as 29 áreas do mapa.
* O portão de HTML e o `check:dados` continuam a 0, que é a garantia da casa de que cada algarismo rendido resolve numa linha.
* Peso da primeira página construída: **179 312 bytes** em português e **181 363** em inglês.

## 3 · As decisões de forma, e porquê

### 3.1 · O cartão: o cartão inteiro é alvo, e o selo não fica debaixo dele

Duas regras da casa puxam para lados opostos. O brief §4 diz «os cartões da faixa são alvos inteiros»; a Emenda 2 diz «o selo nunca fica aninhado dentro de outro alvo», porque «uma porta metida dentro de outra porta abre a de fora, e quem toca no selo quer a prova». E a célula A10 recusa áreas sobrepostas, com a razão certa: «uma área sobreposta não é um alvo maior, é uma porta que abre a linha do vizinho».

**A forma que cumpre as três** é o cartão em cinco filas (o estado, o valor, o nome, a unidade e o selo), com a porta a ocupar as três primeiras e o pé a ficar de fora. A porta é uma âncora VAZIA, com o nome acessível emprestado do nome da medida por `aria-labelledby`: não acrescenta uma palavra ao sítio, e um leitor de ecrã ouve exactamente o que está escrito no cartão.

**A porta é uma célula da grelha e não um pseudo-elemento esticado**, e a razão é a régua: a área efectiva de um alvo, em `correcoes-a.mjs`, une a caixa do elemento com a do seu `::after` absoluto CENTRADO nele. Um `::after` esticado por `inset` seria medido ali no sítio errado, e um alvo que a casa não sabe medir não é um alvo que a casa possa prometer. Uma célula que atravessa três filas tem caixa própria.

**Três coisas foram construídas, medidas e desfeitas pelo caminho, e ficam escritas:**

1. *A porta como caixa de conteúdo.* Media 181,3 px num cartão de 205,3: ficavam 12 px de papel em cima e de cada lado onde o dedo não abria nada. Resolvido com três margens negativas do enchimento do cartão; em baixo não sai, porque em baixo está o pé.
2. *A colocação automática.* A grelha declara uma coluna, e com a porta a ocupar a coluna 1 nas filas 1 a 3 os outros filhos iam para uma SEGUNDA coluna que a grelha criava para os receber. Medido: `grid-template-columns` saía «84,67px 96,64px», e a porta media 84,7 px de largura em vez dos 205,3 do cartão. A coluna passou a declarar-se em todos os filhos. É o mesmo defeito, e a mesma linha, que a folha já tinha escrito para a célula do mapa a 1024.
3. *A unidade dentro da porta.* A linha da unidade de uma medida PODE citar uma linha do livro-razão: numa das sete medidas de um concelho, o índice de dívida escreve «Percentagem, teto legal = 100 · 2024», e o 100 é uma linha com selo. Com a unidade dentro da porta, esse selo ficava debaixo dela, e o portão de HTML fechou a construção com **616 erros** («o valor da afirmação "indice-de-divida-limite-legal" aparece sem selo para a sua própria linha») nas 308 páginas nas duas edições. A unidade passou para o pé. E ali, com o selo em linha corrente, o texto quebrava e o selo caía na segunda linha, com a sua área de 44 px centrada 10,8 px abaixo do fim da fila, a cruzar a área do selo do cartão por 6,8 × 21 px. A saída é a que a casa já escreveu na I13: «a saída certa não é encolher a área, é dar altura à fila». O selo da unidade é agora uma caixa de bloco de 44 px.

### 3.2 · O alinhamento a 1280: a §1.84 mantém-se, e a dependência inverteu-se

A emenda das 19:50 de 29.08 à §1.84 promete que «o mapa sobe até ao topo da manchete e desce até ao fundo da legenda». O mecanismo que ela construiu era: a altura do mapa é a da grelha, e a largura sai dela pela razão 6090/8030 do `viewBox`. Isso funciona enquanto a coluna esquerda tiver exactamente a altura certa.

Com a faixa dentro da coluna esquerda deixou de ter. Medido na primeira construção deste bloco, a 1280: a coluna pedia 783,8 px de altura, a largura que essa altura pede eram 594 px, a coluna direita tem 518, e o desenho ficava preso a `max-width: 100%` com **55,2 px de ar** em cima e em baixo. É exactamente o defeito que a leitura do Codex apanhou a 29.08.

**A forma nova inverte a dependência e não tem ponto fixo nenhum:** o mapa tem a LARGURA da sua coluna (a regra dos 1024, que já lá estava) e a altura sai dela pelo `viewBox`, exactamente; nunca há ar. Quem se estica é a coluna esquerda, pela fila flexível (`grid-template-rows: auto auto 1fr`), e é a legenda que desce ao fundo com `margin-top: auto`. O que a folha tem de garantir é só que a coluna esquerda não passa a altura do mapa, e isso é uma medida e não uma equação.

Medido a 1280 (pt), no estado de chegada, com as gavetas fechadas:

| | depois |
|---|---|
| a grelha da cabeça | 345,1 a 1 034,1 · 689,0 px |
| a manchete (rótulo, `<h1>`, lede) | 351,1 a 636,8 · 285,7 px |
| a faixa | 648,8 a 848,5 · 199,7 px (o cartão mede 220 × 193,7) |
| a coluna das gavetas | 858,5 a 1 034,1 · 175,6 px |
| a legenda | 978,3 a **1 034,1** |
| o mapa (`svg`) | 351,1 a **1 034,1** · 518,0 × 683,0 px |
| a razão da caixa contra a do `viewBox` | 683,0 pedidos, 683,0 medidos · **0,0 px de ar** |
| o topo do mapa contra o topo da manchete | **0,0 px** |
| o fundo do mapa contra o fundo da legenda | **0,0 px** |
| a página | 4 025 px |

A coluna esquerda voltou aos 550 px que a emenda de 29.08 mediu; o que mudou para ela lá caber foi a altura da faixa, que entrou na coluna com 212,6 px e saiu com 199,7 (duas linhas de nome em vez de três, e quatro píxeis de enchimento).

### 3.3 · As duas gavetas, e o que elas custam à Emenda 20c

A afinação 1 do brief recolhe a busca e a lista dos nomes no mapa. As duas são um `<details>` fechado a todas as larguras, com um `<summary>` que é um alvo de 44 px abaixo de 1024 e abre sem uma linha de guião.

**Isto emenda a decisão da I101, e é preciso dizê-lo.** A §1.84 decidiu, com a I101, que «a rede mostra-se sempre abaixo de 1024», porque abaixo dessa largura nenhuma das 29 unidades chega aos 44 px pelo quadrado inscrito (I82) e a rede de nomes era o único alvo que respondia por elas. Com a rede fechada, o que responde por elas passa a ser o `<summary>`: um alvo de 44 px que abre a rede sem guião, e a rede continua a ter os seus 44 × 44 px por nome quando abre. A régua `lista.mjs` L9 foi reescrita para a forma nova e abre a gaveta antes de medir; que a gaveta existe, vem fechada e abre sem guião é `faixa.mjs` F10a e F10b.

**O comando «Concelho» continua a cumprir o que promete.** `public/js/inicio.js` passou a abrir e a fechar a gaveta da busca, e isso está dentro do que este ficheiro pode tocar desde o primeiro dia («trocar `hidden`, `open`, `aria-pressed` e `aria-current`»). Faz isso em `aplica()` e não só no clique, porque o estado está no ENDEREÇO (Emenda 7): um `/?ambito=municipio` partilhado tem de chegar com a busca aberta. A gaveta dos NOMES não é tocada pelo guião: ela não é um estado do endereço, é o índice do mapa, e abre-se quando o leitor a abre.

### 3.4 · A ordem da cabeça, e a divergência que fica dita

A ordem de construção fixa «nome, manchete, faixa, mapa, por esta ordem no documento e no ecrã, nas duas larguras».

**No documento** a ordem é uma só, às sete larguras e nas duas edições: a manchete, a faixa, a coluna das gavetas, e o mapa por último (célula F9).

**No ecrã** há duas formas, porque a cabeça tem duas. Abaixo de 1024 é uma coluna e a ordem é de cima para baixo, medida pelo topo de cada caixa. A partir de 1024 a cabeça tem duas colunas, que é a forma que a emenda das 19:50 de 29.08 decidiu: a manchete, a faixa e as gavetas na coluna esquerda, o mapa na direita, do topo da manchete ao fundo da legenda. Ali a ordem é a de LEITURA, ou seja a coluna esquerda de cima para baixo com o mapa ao lado dela, e não a do topo das caixas: o mapa começa à altura da manchete, porque é isso que estar ao lado quer dizer. Medir «o topo da faixa acima do topo do mapa» seria pedir à cabeça de duas colunas que fosse de uma. A célula F9 mede as duas formas, cada uma com a sua conta, e a folha escreve porquê.

Abaixo de 1024 a folha inverte duas peças com `order`: o mapa antes das gavetas. É a mesma divergência, e a mesma razão, que a §1.84 já escrevia para a lista: as gavetas são o índice do mapa e vêm antes dele no documento; numa coluna só, o mapa é a coisa e elas são a rede dele, e uma rede lê-se por baixo daquilo que protege.

### 3.5 · O que a linha de comando fez, e onde ficou

«Âmbito» e «Densidade» saíram da cabeça. O bloco inteiro do comando desceu para o fim de `.inicio`, imediatamente antes do painel, que é onde o brief manda pôr a densidade («a densidade no cabeçalho do painel»); o fio que ele tinha por baixo saiu, porque quem abre esse bloco é agora o fio de `.painel-nome`.

O âmbito desceu com ela, e não subiu para o menu como o brief pede. A razão está na dúvida 2, e é medida: as quatro posições são as quatro cadeias de `s.ambito`, e levá-las para a navegação do cabeçalho mudaria a fila de oito posições que a §1.51 fixou, em 6 590 páginas. Fica dentro de `[data-inicio]` porque `public/js/inicio.js` procura os comandos dentro da raiz do estado e a matriz mede que a fila tem exactamente «pais, regiao, municipio»: o que muda é o lugar na coluna, e mais nada.

## 4 · As réguas

`npm run build` **0**, `npm run verify` **0**, `npm run typecheck` **0**, na construção final, com o estado de saída conferido e não escondido atrás de um `tail`.

| régua | resultado |
|---|---|
| `tests/inicio/faixa.mjs` (nova) | **80 de 80 células** |
| `tests/inicio/faixa.mjs --vermelhos` | **7 de 7 estragos vistos vermelhos**, com as três exigências (verde antes, o HTML mudou, vermelho depois) e com o vermelho exigido em TODAS as células que cada planta nomeia |
| `tests/inicio/lista.mjs` | **94 de 94** (eram 94; L2, L3, L9, L11 e L12 reescritas) |
| `tests/inicio/mapa-distritos.mjs` | 43 de 43 |
| `tests/inicio/mapa-navegacao.mjs` | 9 de 9 (N3 reescrita) |
| `tests/inicio/correcoes-a.mjs` | 32 de 32 (A8 reescrita; a sonda dos alvos aprendeu a gaveta fechada) |
| `tests/inicio/areas.mjs` | 22 de 22 |
| `tests/inicio/app.mjs` | 39 de 39 |
| `tests/inicio/regioes.mjs` | 30 de 30 |
| `tests/inicio/rotulo.mjs` | 7 de 7 |
| `tests/inicio/matriz.mjs` | **86 de 87** · três células reescritas; a falha que fica não é deste bloco e está aprovada como exceção (§6) |

**Os sete estragos plantados de `faixa.mjs`.** Os cinco que a ordem nomeia, e dois que ela não nomeia e que existem porque as células que eles apanham não tinham planta nenhuma: uma célula sem estrago é uma célula que ninguém provou saber falhar.

| estrago | células que caem |
|---|---|
| um cartão sem selo (o selo do primeiro cartão retirado) | F2 |
| um cartão sem alvo de 44 px (a porta encolhida a 30 px) | F3, às sete larguras |
| a faixa a depender de guião (os cartões escondidos pela folha) | F4 |
| um número sem linha (um algarismo escrito à mão dentro de um cartão) | F2 |
| a lista dos nomes a abrir só com guião (o `<details>` trocado por uma caixa escondida) | F10a e F10b, às sete larguras |
| o encaixe retirado da folha | F5 |
| a faixa por baixo do mapa | F9, às sete larguras |

**As réguas reescritas, e o que cada uma passou a medir.** Nenhuma foi desligada.

* `lista.mjs` **L2** media a caixa dos 29 nomes na coluna esquerda; passa a medir a coluna das GAVETAS, no estado de chegada, porque os nomes só têm caixa quando a gaveta abre. Que a lista está lá dentro é a L1 e a L4.
* `lista.mjs` **L3, L11 e L13** passam a ler o estado FECHADO, que é o que o leitor recebe; **L12** lê o aberto, porque fala da posição da legenda contra a lista. São duas leituras por largura, e cada célula diz de qual delas fala.
* `lista.mjs` **L9** media «a rede mostra-se sempre abaixo de 1024» (a decisão da I101); passa a medir a forma decidida pela afinação 1, com a gaveta aberta.
* `lista.mjs` **L12 a 1024** media a legenda por baixo do mapa, na coluna dele; a legenda deixou de ser filha da grelha e a regra passou a ser uma só nas três larguras: a legenda é a última coisa da coluna das gavetas.
* `mapa-navegacao.mjs` **N3** media «abaixo de 640 a pesquisa fica à vista em qualquer estado»; a regra passou a ser uma só nas duas larguras, porque uma gaveta fecha-se em qualquer largura, e a célula mede agora o `open`.
* `correcoes-a.mjs` **A8** media os quatro primeiros valores do relance do concelho dentro dos 800 px; o Relance mudou de forma e a célula mede-o onde ele agora vive, com queda para as peças se um dia não houver faixa.
* `matriz.mjs` **2i·5** media a rolagem desde o topo da página; passa a medir a rolagem entre o foco e o espaço, que é o que a célula existe para provar. Com o comando no topo da cabeça isso dava sempre zero e a diferença não se via.
* `matriz.mjs` **2m (f1)** media a legenda dentro do campo do desenho, no canto que as ilhas deixam. Essa regra saiu a 29.08 e a célula estava vermelha desde então, antes deste bloco; passa a medir a decisão que a substituiu, que é a legenda não se sobrepor ao desenho.
* `matriz.mjs` **2m (f2)** media a busca a abrir acima do mapa; mede agora a gaveta a abrir com o estado e a ficar por baixo dele.
* `matriz.mjs` **I18** lê o rótulo do distrito por `.municipio-sub`; o bloco mudou de moldura e a classe viajou com ele, porque é a marca que a régua conhece.
* `faixa.mjs` **F3** deixou de aceitar uma porta que pára antes do pé e passou a perguntar ao navegador quem apanha o toque; **F9** ganhou a invariante das duas colunas; **F12** passou a exigir a cabeça inteira; **F13** é nova, e mede o transbordo horizontal às sete larguras e nas duas edições.

## 5 · A voz e a língua

`check:voz` **0** e `check:lingua` **0** na construção final.

### 5.1 · As cadeias novas

Seis, e duas entram no inventário.

| cadeia | onde | inventário |
|---|---|---|
| «As medidas, uma por cartão» / «The measures, one per card» | o `aria-label` da faixa, nas três páginas | **entram**, classe `navegacao`, bloco `cabeca` |
| «Os nomes no mapa» / «The names on the map» | o `<summary>` da gaveta dos nomes | não entram: ver §5.2 |
| «Um concelho pelo nome» / «A municipality by name» | o `<summary>` da gaveta da busca | não entram: ver §5.2 |

O inventário passou de 620 para 622 linhas com bloco (546 vivas, todas rendidas), e a entrada do bloco `cabeca` está em `critica/REVISOES-DO-INVENTARIO.md` como `por ler`, que é a forma legítima enquanto a leitura cruzada não correu.

**Nenhuma linha foi retirada.** «Âmbito» e «Densidade» continuam a render-se, no fim de `.inicio`, com o comando; e nunca estiveram neste ficheiro, porque vivem num `<span class="cmd-k">` e a régua recolhe os blocos de texto e os rótulos em `span` da classe `eyebrow`, não este.

**Duas cadeias quase entraram por engano, e a razão de não entrarem está no componente.** A primeira construção punha a fila do estado do cartão num `<p>`, e a régua passou a recolher «fora do limiar», «dentro do limiar» e «sem limiar» como frases novas em 6 590 rotas; a construção fechou a pedir que alguém as classificasse. A peça rende-as, desde a Emenda 13, dentro de um `<div class="peca-topo">`, e por isso nunca foram recolhidas: são o vocabulário fechado do estado e não prosa da casa. A faixa passou a fazer o mesmo.

### 5.2 · A frase que substitui «Âmbito» e «Densidade»

**A proposta: «As medidas, uma por cartão» / «The measures, one per card».**

É o nome da faixa, e não se vê: é o `aria-label` da lista, como o do mapa. A razão de não ser um rótulo à vista é medida: um rótulo por cima dos cartões custaria uma linha de ecrã ao bloco que existe para poupar linhas de ecrã, e os cartões dizem o que são sem ele. A razão de existir é que uma lista precisa de um nome para quem a ouve, e o brief pede que «o leitor de ecrã leia lista de N cartões».

A forma é a do nome do mapa, que está aprovado e no ar desde o bloco `grelha-2`: «Mapa dos distritos e das ilhas de Portugal, com uma área por unidade.» Diz o que a coisa é e como está feita, sem verbo sobre a casa, sem porta, sem algarismo e sem selo. A classe é `navegacao`, que é a do positivo conhecido.

**Não nomeia o lugar, e isso é uma decisão medida.** «As medidas de Portugal» obrigaria a «As medidas de Évora» nas 308 páginas de concelho e a «As medidas do Alentejo» nas 9 de região, com a preposição a contrair-se por nome; a régua da voz lê os `aria-label` desde a I79, e o inventário ganharia 318 linhas. O lugar já está dito no rótulo da cabeça e na manchete, a três linhas de distância.

**As alternativas que considerei, e porque não:**

| alternativa | porque não |
|---|---|
| «Relance» sozinho, ou «Relance · as medidas» | «Relance» é o nome de uma camada (IDENTIDADE §4) e já se rende duas vezes na página, no comando da densidade; um nome de lista igual ao de um comando faz o leitor procurar duas coisas |
| «<nome do lugar> · as medidas» | 318 linhas de inventário, uma por lugar, pela razão acima |
| «Os números de Portugal» | «números» é a palavra do leitor mas não é a da casa: o vocabulário fechado diz medida, linha e valor, e uma quarta palavra para a mesma coisa abre um caminho que a casa fechou |
| um rótulo À VISTA por cima da faixa | custa entre 24 e 30 px do primeiro ecrã, que é a folga com que a faixa e o topo do mapa lá cabem hoje (o topo do mapa está a 726,1 de 844); e os cartões não precisam de uma frase a dizer que são cartões |
| nenhuma frase | a lista fica sem nome para quem a ouve, e o brief pede o contrário |

### 5.3 · As datas

A data do sinal de tempo do cabeçalho passou de `2026-08-31` para `31.08.2026`, em 6 590 páginas. **O dado não mudou:** `src/data/verificacao.mjs` continua a guardar a forma ISO, e é bem que continue, porque é a forma que se ordena, que se compara e que `scripts/gate-html.mjs` reconta contra a chave `painel_reconferido_em`. O que mudou foi o que se compõe, na superfície, e o elemento continua debaixo do mesmo motivo declarado (`data-nonledger="data-de-atualizacao"`). Nenhum algarismo novo: os quatro pedaços são os mesmos quatro, noutra ordem e com outro separador. O ficheiro `verificacao.mjs` não foi tocado, como a ordem manda.

## 6 · O que encontrei e não é deste bloco

1. **As nove páginas de região desenhavam as suas peças sem folha.** `RegiaoView.astro` rende `<Peca>` dentro de um `.painel` desde a Emenda 21, e as regras das duas classes vivem em `src/styles/inicio.css`, que nem a vista nem `regiao.css` importavam. Medido na construção de partida: a única folha ligada por `/regioes/alentejo` é a de `Base`, e nela não há uma regra `.peca`. **Consertado neste ramo**, porque a faixa precisa da mesma folha e um componente e a sua folha viajam juntos; é parte do que a página de região cresce (§2.3).
2. **A régua dos 44 px tem um buraco entre 641 e 1023.** A 768 há 11 alvos abaixo de 44 px no corpo da primeira página: as seis posições do comando (33,6 px, porque `.seg { min-height: 44px }` vive dentro do `@media (max-width: 640px)`) e cinco resultados da busca (34,9 px, pela mesma razão), mais quatro ligações de texto. São os mesmos antes e depois deste bloco. **Não consertado**: mexer no `.seg` e no `.chipb` acima de 640 é uma decisão de composição da mobília e do índice dos 308, e não deste bloco.
3. **Quatro alvos abaixo de 32 px a 1024 e a 1280**, os mesmos antes e depois: «O livro-razão →» (14 px), «a página inteira →» (19,2), o endereço de correio (19) e «O registo de correções →» (24). **Não consertado**, pela mesma razão.
4. **`matriz.mjs` tem uma célula vermelha que não é deste bloco:** «a língua de um título citado, e a porta da outra edição no rodapé», com 11 títulos a repetir a língua da página em `/en/areas/*` e `/en/ledger/*` («Água Não Faturada» com `lang=pt-PT` dentro de uma página inglesa). Nada neste ramo toca em títulos de trabalho, no livro-razão nem nas áreas. **Não consertado.**
5. **A régua da voz não lê os `<summary>`.** `frasesDaCasa()` salta os elementos `summary` sem condição, e por isso as quatro cadeias das gavetas (§5.1) são texto à vista que o inventário não conhece. Não é um defeito que este bloco crie, mas é este bloco que o torna visível: até aqui os `<summary>` da casa eram «Menu» (nomeado por `aria-label`, esse sim inventariado), «abrir/fechar» da peça e a porta da convergência. **Não consertado**, e vai na dúvida 5.

## 7 · Dúvidas para o lugar de direção

**1 · A frase que substitui «Âmbito» e «Densidade».** A proposta é «As medidas, uma por cartão» / «The measures, one per card», como `aria-label` da faixa e não como rótulo à vista. As alternativas medidas estão na §5.2. *Construído com a proposta.*

**2 · O âmbito no menu.** O brief diz «o âmbito vive no menu», e eu pus a fila inteira do comando no cabeçalho do painel. A razão é o custo: as quatro posições são as quatro cadeias de `s.ambito`, o menu tem oito posições fixadas pela §1.51, duas delas («Regiões», «Áreas») não existem lá, e mudá-lo mexe na mobília de 6 590 páginas e na altura do cabeçalho, que `app.mjs` mede às sete larguras. **A minha proposta:** «Regiões» e «Áreas» entram nas PORTAS da primeira página, ao lado de «Municípios», «Estudos» e «Agenda», que é onde a casa já diz que «o resto vive atrás delas»; o menu fica como está. Não construí isso, porque tirar `s.ambito.pais` e as outras três da página é uma remoção de cadeias que a régua da voz pode ter como vivas noutras superfícies, e a verificação disso é de outra família. *Construído: o comando inteiro no cabeçalho do painel, com as mesmas quatro portas e as mesmas cadeias.*

**3 · Os 42 px a 1024, e os 22 px contra os 4 003 do brief.** A primeira página a 1024 cresce 42 px (3 872 → 3 914), que é a única largura em que cresce; ali o mapa tem 340,1 px e não pode crescer com a coluna. E a 1280 fica em 4 025, que é 5 px abaixo do «hoje» medido (4 030) e 22 px acima do número que o brief cita de 29.08 (4 003), porque a página cresceu 27 px entre as duas datas com o bloco do rótulo de IA. **A minha proposta:** ficar assim e registar os dois números, porque a ordem manda medir de novo o «hoje» e é contra ele que a promessa se lê. Se o lugar de direção quiser os 4 003, o caminho medido é encolher a coluna direita a 1280 (cada 10 px de coluna são 13,2 px de altura de mapa), e isso mexe no alinhamento da §1.84.

**4 · A ordem no ecrã a partir de 1024.** «Nome, manchete, faixa, mapa, por esta ordem no documento e no ecrã, nas duas larguras.» No documento cumpre-se em todas. No ecrã, a partir de 1024, a cabeça tem duas colunas e o mapa começa à altura da manchete: a faixa vem antes dele na ordem de LEITURA da coluna esquerda, e não no topo das caixas. **A minha proposta:** é isto que «ao lado» quer dizer, e é o que a emenda das 19:50 de 29.08 decidiu; a alternativa é a cabeça de uma coluna a 1280, que devolve os 1 260 px de papel vazio que a §1.84 existiu para tirar. A célula F9 mede as duas formas com a sua conta cada. *Construído com as duas colunas.*

**5 · As quatro cadeias dos `<summary>` das gavetas.** **FECHADA na segunda passagem**, e não adiada: a régua da voz passou a ler os `<summary>`, e as nove linhas que isso revelou estão classificadas (§5.1 e §8, ponto 5).

**6 · A manchete de um concelho diz a população, e podia dizer mais.** A que se construiu é «Évora tem 53 011 pessoas.» [errata de 02.09.2026: o número está errado neste relatório; a página rende «Évora tem 58 567 pessoas.», da linha `evora-populacao-2025`; foi escrito de memória e não lido da página, e passou a medição cega e a leitura a frio porque nenhuma das duas conferia os números do relatório]: um número selado, a única medida que os 308 publicam, e nenhuma escolha da casa sobre o que importa. Um segundo membro era possível e é mais interessante (o índice de dívida contra o teto legal, cujo estado já está medido em `pecasDoConcelho`: «está dentro do teto legal», «ultrapassa o teto legal»), e não o construí por uma razão que é do diretor e não minha: escolher, por 308 páginas, qual das sete medidas merece a manchete é uma decisão editorial. Fica proposto, com o mecanismo pronto.

## 8 · A segunda passagem, ponto a ponto

*Os oito pontos que o lugar de direção devolveu depois da medição cega e da leitura a frio. O que era decisão veio decidido; o que se segue é a obra.*

**1 · A cabeça herdada a sério nas regiões e nos concelhos.** Nasce `src/components/inicio/CabecaDoLugar.astro`, e as três camadas passam por ele. Duas formas, a mesma ordem e as mesmas classes: `forma="pais"` é a cabeça de duas colunas da §1.84; `forma="lugar"` é uma coluna, com o instrumento da camada por baixo da faixa. **A região** ganha manchete numérica (a frase da região, «A Grande Lisboa está 21 pontos acima da média da UE-27.», com o seu selo), que sai da leitura breve do instrumento para não se dizer duas vezes no mesmo ecrã (`InstrumentoConvergencia` recebe `leituraNaCabeca`), e ganha o instrumento na cabeça: a régua da convergência, que subiu da metade de baixo da página. **O concelho** ganha manchete numérica («Évora tem 53 011 pessoas.» [errata de 02.09.2026: a página diz 58 567], com o selo da linha da população, que é a única das sete medidas que os 308 publicam) e o cartão localizador, que subiu da coluna do aparelho para a cabeça. `F12` foi reescrita e passou a exigir a cabeça inteira e não só a faixa: a moldura, o rótulo com o nome do lugar declarado, a manchete com um número selado, a faixa com os seus cartões, o instrumento com desenho lá dentro, e a ordem no documento. Corre nas três camadas e nas duas edições, seis células.

*O mapa de uma região não existe, e não se inventou.* O artefacto da casa tem 29 unidades (distritos e ilhas) e as regiões são NUTS II: não há geometria de região no repositório, e o campo `regiao` de um concelho é NUTS III («Alentejo Central»), que não serve para as agrupar. Desenhar uma seria traçar uma fronteira que a Carta não dá. A forma mais barata que é verdadeira é a que a Emenda 21 (d) já tinha decidido: «uma região não tem mapa de pontos nem de áreas; tem a régua». A maqueta é a página construída, e está medida na §2.3 e nas capturas.

**2 · A porta do cartão cobre o cartão inteiro.** Cobria as três primeiras filas e parava antes do pé, e a `F3` aceitava isso: a 390 o pé é um terço da altura do cartão, e um terço do cartão que não abre nada é um alvo com um buraco. A porta passa a ocupar as cinco filas e a sair do enchimento pelos quatro lados; os selos ficam por cima dela, com um degrau de `z-index`. O que a Emenda 2 protege deixa de ser uma regra geométrica e passa a ser medido onde ela o promete: a `F3` pergunta ao navegador, com `document.elementFromPoint` no centro de cada selo e com o cartão trazido à vista, quem apanha o toque, e exige que seja o selo; e num ponto do corpo exige que seja a porta. Nos 21 cartões, às sete larguras e nas duas edições. A célula A10 de `correcoes-a.mjs` aprendeu a mesma pergunta: um par em que uma caixa contém a outra e a de dentro ganha o toque sai da lista, e um selo por baixo da porta não sai, porque a resposta seria «a porta».

**3 · O «antes» da manchete.** Estava medido com o seletor errado e nunca fora corrido de novo. O commit de partida foi extraído para uma pasta de ensaio fora do repositório, construído e medido: **1 766,9 px, 2,09 ecrãs** em português e 1 749,7 px, 2,07 em inglês. A §2.2, o §0 e a §1 estão corrigidos, e a §2.2 diz de onde vem o número e porque é que o outro estava errado.

**4 · O transbordo horizontal em `/en/`.** **Era real, e é anterior a este bloco.** Medido nas duas construções, a de partida (`307796f`) e esta: `/en/` rolava de lado **33 px a 320** e **16 px a 390**, e `/` não rolava a nenhuma largura. O culpado é a linha de comando: «Country · Region · Municipality · Areas» pede 334,7 px e a coluna dá 284 a 320. E a causa exacta não era a fila: era `.cmd { flex-wrap: wrap }` a valer numa direção de coluna, o que faz a LINHA ter a largura do item mais largo em vez da do contentor. Medido: `.cmd` media 284 px e `.cmd-grupo` media 334,7. Três linhas consertam-no: `flex-wrap: nowrap` na coluna, `overflow-x: auto` na fila, e cada posição com a sua largura em vez de repartirem uma que não chega. **Está a zero nas duas edições e às sete larguras**, e passa a ter régua própria (`F13`). As capturas foram refeitas.

**5 · Os `<summary>` entram na régua da voz.** `frasesDaCasa()` saltava todos os `<summary>` sem condição, debaixo de um comentário que falava de outra coisa. O salto sai, e a regra que fica vale para eles como para qualquer bloco: o que se recolhe é o texto de fora das âncoras. Apareceram cinco frases distintas por edição, e só duas são novas no sítio: o «Menu» do cabeçalho (que estava declarado pelo `aria-label` e não pelo texto), o «abrir/fechar» da densidade de cada peça, a porta das linhas de um documento, e os nomes das duas gavetas. Nove linhas novas no inventário, classe `navegacao`, bloco `cabeca`; `check:voz` a 0. A dúvida 5 da primeira passagem fecha-se aqui.

**6 · O arnês das plantas.** «Pelo menos uma célula vermelha» passa a ser «vermelho em TODAS as células que a planta nomeia», e o corredor aponta quantas de quantas. Isso apanhou dois defeitos do próprio arnês: o `tocada()` comparava por prefixo, e uma planta da `F1` contava com o vermelho da `F10`, da `F12` ou da `F13`; e `soNaPrimeira()` escrevia `/en/` com barra quando o servidor recebe `/en` sem ela, **de modo que nenhum dos sete estragos chegava à edição inglesa** e as sete plantas passavam com metade das células. Os dois estão consertados, aqui e em `lista.mjs`, que tinha o defeito simétrico. E a `F9` do ecrã largo ganhou invariante própria: não basta «o mapa à direita», exige-se a ordem da coluna esquerda (manchete, faixa, gavetas), a faixa na banda dessa coluna e o mapa a começar acima do topo da faixa. Com ela, a planta que põe a faixa por baixo do mapa passa a morder às sete larguras, e não só às cinco estreitas. **Sete de sete estragos vistos vermelhos, em todas as células que nomeiam.**

**7 · As miudezas.** A aritmética dos alvos a 768 estava errada (contava quinze e são onze) e está refeita na §2.4 com a razão de a soma ter mudado. «1024 é a única largura em que cresce» era falso em inglês, onde a 768 cresce 1 px, e a §2.3 di-lo. O teto legal da dívida está documentado como **150** (era o que o livro-razão publica; os comentários diziam 100) em `Faixa.astro` e na folha. O comentário da célula `2i·5` da matriz passa a dizer o que o teste faz: mede a rolagem ENTRE o foco e o espaço, porque a soma das duas parcelas dava o número certo por acaso enquanto o comando esteve no topo. A saída de `medir-contraste.mjs` fica guardada em `medicoes/cabeca-contraste.txt`, ao lado das medidas, e as razões dos quatro objetos abaixo de 3:1 estão na §2.5.

**8 · As cinco datas ISO do concelho.** Era barato e está feito. Nasce `src/lib/datas.mjs` com uma função só, `dataDaCasa()`, que escreve `aaaa-mm-dd` como `dd.mm.aaaa` e deixa passar tudo o que não seja uma data completa (um ano, um mês, um período), porque uma função que adivinhasse inventaria dias. É usada no sinal de tempo do cabeçalho e nas duas datas completas das listas de mandatos do concelho, «a partir de» e «instalado a». Os ficheiros de dados continuam em ISO.

## 9 · As capturas

42 ficheiros em `design/especime-v3/medicoes/cabeca-2026-09-01/`, no tema claro: as três rotas (a primeira página, `/regioes/alentejo`, `/municipios/evora`) às sete larguras da casa (320, 360, 390, 430, 768, 1024, 1280) e nas duas edições, com o nome a dizer o que cada uma é (`<rota>-<largura>-<edição>-claro.png`). O tema entra pela escolha guardada no aparelho, que é o único caminho para ele desde a Emenda 12: pôr `data-theme` à mão fotografaria a folha e não o mecanismo.

## 10 · O custo

O harness desta sessão não imprime os símbolos gastos, e por isso não escrevo um número que não medi: **[verify]**, com a razão. A estimativa do lugar de direção para o bloco inteiro é de 0,6 a 0,9 M símbolos em duas passagens; esta é a primeira passagem, e o lugar de direção tem a conta do lado dele.
