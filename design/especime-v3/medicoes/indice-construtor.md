# F1.9a · o índice das páginas de leitura · relatório do construtor

*Ramo `indice-2026-09-03`, tirado de `origin/main` em `d447286f`. Construtor Claude Opus 5, 03.09.2026, numa worktree própria. O bloco é o F1.9a de `design/observatorio/BRIEF-F1.9a-indice-das-paginas-de-leitura.md`, que sai da linha F1.9 do plano de fiabilidade e do achado D1 da auditoria de UX de 25.08. Todos os números deste ficheiro foram medidos hoje, com a mesma sonda antes e depois, e a sonda está descrita na §1. Sem travessões na prosa.*

## 0 · O resultado, em seis linhas

O índice já existia desde 25.08 e levava só os títulos de nível 2: passa a levar também os de nível 3, e o número de entradas nas oito páginas vai de **79 para 136**. A indicação de progresso não existia: passa a haver **a posição «n/N» ao lado de cada título de nível 2** (79 títulos nas oito páginas), composta pela folha de estilos, e **uma barra fina no topo** movida pela linha do tempo do deslocamento, medida com o guião desligado nos dois motores. A subida existia e escondia-se acima de 640 px: passa a valer nas duas larguras, com alvo de 79,2 × 44 px. Os alvos abaixo de 44 px da mobília da própria página de leitura vão de **3 para 0** nas oito, a 390 e com toque.

A altura sobe **44 px** nas seis páginas portuguesas e **0 px** nas duas inglesas, contra os **46 px** de banda que o índice ocupa a 390: a medida D6 cumpre-se, e os 44 px não são do índice (a dobra está fechada e os 57 títulos novos vivem lá dentro), são da fila de 44 px que as três contagens da faixa ganharam.

**Duas coisas do brief não foram feitas, e as duas estão medidas e ditas:** os alvos do corpo transcrito não descem a zero (§4, D4), e a subida tapa texto a 390 (§4, D3). As razões, com números, estão nas §5 e §6.

## 1 · Como se mediu, e o que a medida vale

**Dois aparelhos.** Telemóvel: WebKit com `devices['iPhone 13']` (390 × 664) e apontador grosso. Computador: Chromium a 1280 × 800. As duas famílias contam.

**Antes e depois com a mesma sonda.** O «antes» não é uma memória: é uma construção de `d447286f` numa worktree separada (`antes-d447286f`, criada e removida hoje), medida com o mesmo ficheiro de sonda. Sem isso, metade dos números deste relatório seriam uma comparação entre duas réguas diferentes.

**A área de um alvo mede-se por duas vias, e as duas contam.** Ou a caixa do elemento mede 44 px nos dois eixos, que é como a folha da casa escreve a regra; ou o acerto (`elementFromPoint`) alcança 43,8 px nos dois eixos a partir do meio da primeira caixa de linha, que é a única maneira de ver a área que um `::after` posicionado acrescenta sem mudar a composição (é assim que o selo da casa tem alvo sem mudar a entrelinha). A folga de 0,2 px é do próprio acerto: o ponto que cai na aresta pertence já à caixa seguinte, e uma caixa de 44 × 44 mede 42 × 43,8 por acerto. Medido, não suposto.

**O que não é alvo.** Um elemento dentro de uma dobra fechada tem caixa e não se toca: os motores atuais dispõem o conteúdo escondido (`content-visibility: hidden`) para que a busca da página o encontre. A sonda tira-os da conta e conta-os à parte (23 na página portuguesa de amostra). A primeira versão da sonda contou-os como alvos inalcançáveis, e era a sonda que estava errada.

**Os números da auditoria de 25.08 (343 e 698) não são estes.** São de outro detetor, de outro dia e de um sítio onde a secção «As linhas deste documento» ainda não estava dobrada. Com a sonda deste bloco, as mesmas duas páginas medem hoje **349** e **691** a 390 antes de este bloco lhes tocar. Não se comparam as duas contagens como se fossem a mesma medida.

## 2 · D1 a D8, antes e depois

| # | medida | antes (`d447286f`) | depois | cumpre |
|---|---|---|---|---|
| D1 | um índice rendido nas 8 páginas, uma entrada por título do registo, cada ligação a um `id` que existe | 8 páginas com índice, **79 entradas**, só de nível 2 | 8 páginas, **136 entradas**, nível 2 e 3, todas com destino na página | sim |
| D2 | a indicação de progresso presente sem guião nas 8 | **não existe** (0 contadores, 0 barras) | **79 contadores** «n/N» (um por título de nível 2) e 1 barra por página, medidos com o guião desligado | sim |
| D3 | a subida com alvo ≥ 44 px, visível sem tapar texto, a 390 × 664 e a 1 280 | 79,2 × 44 px a 390 (124,2 × 44 em inglês); a 1280 `display: none` | 79,2 × 44 px nas duas larguras (124,2 × 44 em inglês) | alvo e visibilidade sim; **«sem tapar texto» só a 1280** (§6) |
| D4 | alvos abaixo de 44 px nas páginas de leitura, a descer para 0 nos selos e nas ligações do texto | mobília da página **3** por página; cabeça 6; corpo transcrito 171 a 682 | mobília da página **0**; cabeça 6 (é do F1.7); corpo transcrito **na mesma** | mobília sim; **corpo não** (§5) |
| D5 | `check:documentos` e `gate:html` verdes | verdes | verdes, com o L8 mais apertado (nível 2 e 3, e a recontagem do total das secções) | sim |
| D6 | a altura a 390 não sobe mais do que a altura do índice | banda do índice **46 px** | **+44 px** (pt) e **+0 px** (en) | sim |
| D7 | `build`, `verify`, `typecheck` a 0; `check:voz` com as cadeias novas declaradas | 0, 0, 0 | 0, 0, 0; **nenhuma cadeia nova** (§7) | sim |
| D8 | uma régua nova com plantas vermelhas e depois verdes | não existia | `tests/texto/indice.mjs`, 13 células, 3 plantas vistas vermelhas (§8) | sim |

### As oito páginas, uma a uma (390 × 664, WebKit)

| edição | altura antes | altura depois | delta | entradas do índice | alvos < 44 px antes → depois | mobília da página |
|---|---|---|---|---|---|---|
| `avaliacao-economica-regional-de-portugal-2026/pt` | 15 442 | 15 486 | +44 | 8 → 13 | 427 → 424 | 3 → 0 |
| `evora-economia-investidores-portas-abertas-2026/pt` | 16 178 | 16 222 | +44 | 8 → 10 | 180 → 177 | 3 → 0 |
| `evora-orcamentado-pago-devido-2025/pt` | 18 310 | 18 354 | +44 | 14 → 17 | 203 → 200 | 3 → 0 |
| `evora-os-pelouros-quem-os-teve-o-que-fizeram/pt` | 48 873 | 48 917 | +44 | 8 → 24 | 305 → 302 | 3 → 0 |
| `evora-prometido-pago-auditado-2026/pt` | 25 184 | 25 228 | +44 | 9 → 13 | 349 → 346 | 3 → 0 |
| `evora-quinze-anos-cinco-mandatos/pt` | 44 877 | 44 921 | +44 | 9 → 29 | 691 → 688 | 3 → 0 |
| `evora-orcamentado-pago-devido-2025/en` | 17 618 | 17 618 | 0 | 14 → 17 | 203 → 200 | 3 → 0 |
| `evora-prometido-pago-auditado-2026/en` | 23 715 | 23 715 | 0 | 9 → 13 | 349 → 346 | 3 → 0 |

A banda do índice mede 46 px a 390 e 86 px a 1280, antes e depois: a dobra continua fechada, e os 57 títulos de nível 3 que entraram não custam um píxel de página enquanto ninguém a abrir.

## 3 · O que se construiu

**O índice, com dois andares.** `titulosDoDocumento()` passa a devolver os títulos de nível 2 e 3 com o seu nível; a vista compõe-nos numa lista aninhada, cada entrada com a marca da nona origem (`data-registo-indice`) e com a âncora do seu bloco. O nível 4 fica de fora, e é uma escolha: só uma edição os tem (dez, nos pelouros), e um índice de três andares dentro de uma dobra de telemóvel deixa de ser um índice. As entradas curtas ganharam 44 px de largura, que é a linha que o índice do Método já tinha, e foi a régua que apanhou a que faltava («2025» na edição dos pelouros).

**A posição de cada secção, sem uma linha de guião.** Ao lado de cada título de nível 2 lê-se «n/N», composto pela folha de estilos com um contador do navegador (`counter-increment: seccao`) e com o total que a vista escreve uma vez em `--seccoes` e declara em `data-seccoes`. Três coisas que isto respeita, e é por isso que é assim:

* **o corpo transcrito não muda um carácter.** O HTML do `<article>` fica byte a byte o que era: o «3/9» é da folha, como já era o glifo «→» das portas de figura (a folha escreve-o desde a parte 3, com a mesma razão escrita ao lado);
* **o algarismo não é escrito pela casa.** O numerador é do navegador e o denominador é recontado pelo L8 do portão contra o registo. Um número do próprio sítio não se escreve, verifica-se;
* **não custa um píxel de altura.** O título de nível 2 já tem 1,9 em de goma por cima (39,9 px a 390, medido), e a peça vive lá dentro, absoluta.

Onde o motor conhece a sintaxe do texto alternativo (`content: … / ''`), o nome acessível do título continua a ser o do registo e mais nada. Medido: os dois motores da casa conhecem-na (`CSS.supports("content", "counter(a) / ''")` a `true` no WebKit e no Chromium).

**A barra do progresso.** Três píxeis no topo da janela, movidos por `animation-timeline: scroll(root block)`. Só se desenha dentro de um `@supports`: uma barra parada num sítio qualquer é uma indicação falsa, e a posição «n/N» fica lá em todos os motores. Medida com o guião DESLIGADO: 0 px no topo e 390 px com o rodapé à vista numa janela de 390 (WebKit); 0 px e 1 280 px a 1280 (Chromium).

**Um defeito do próprio bloco, apanhado pela régua e escrito aqui porque a régua que o apanhou é a prova de que ela conta.** Escrita `animation: texto-progresso linear` com a linha do tempo na declaração ao lado, o minificador junta as duas numa abreviatura (`animation: linear texto-progresso scroll(root)`) que **não vale em nenhum dos dois motores**: a barra ficava a 0 px do princípio ao fim, e a folha construída parecia certa. Provado lado a lado na mesma página, com a declaração minificada e a declaração por fichas: a primeira mede 0 px no fim da página, a segunda mede a janela inteira. As fichas vão uma a uma, com a razão escrita na folha.

**A subida nas duas larguras.** A regra anterior escondia-a acima de 640 px, com a razão escrita «no computador a coluna do aparelho está sempre à vista e a página tem metade da altura». A segunda metade não é verdade: medido a 1280, as oito páginas medem entre **12 612 e 37 008 px**, e a coluna do aparelho está à vista no primeiro ecrã e em mais nenhum. A subida passa a valer nas duas, e a 1280 fica na goteira, à direita da coluna do aparelho, onde não apanha uma única caixa de linha do artigo em dez posições da página.

**As três contagens da faixa.** Mediam 15,8 × 15 px, e eram o alvo mais pequeno da mobília desta página e três portas para o corpo. Passam a fila de 44 px. A saída não podia ser a área posicionada do selo: numa faixa de três filas a 20 px de distância, três áreas de 44 px caem umas em cima das outras, e uma área sobreposta não é um alvo maior, é uma porta que abre a linha do vizinho. A fila passa a levar o ar por dentro e a peça devolve metade do que ganhou (24 px), e é por isso que a página cresce 44 px e não 68.

## 4 · O que o brief pedia e não se fez pela letra: o índice tocou dois ficheiros fora da §3

A §1.1 do brief manda construir o índice dos títulos `h2` **e** `h3`; a §3 lista os ficheiros onde se constrói, e nem `scripts/gate-html.mjs` nem `src/lib/registo-html.mjs` estão nessa lista. As duas coisas não cabem uma na outra: a lista dos títulos vive em `registo-html.mjs`, e o L8 do portão fecha a construção quando o índice não tem exatamente uma entrada por título de nível 2. Um índice com os títulos de nível 3 sem tocar no portão ou não constrói, ou constrói com a comparação desligada, e a segunda hipótese é a que a casa não faz.

Seguiu-se a §1.1 e mexeu-se nos dois ficheiros, **apertando o portão e nunca alargando-o**: o L8 compara agora os dois níveis pela mesma regra e reconta o total das secções que a página declara. Os ficheiros que o construtor tinha proibidos pela coordenação (`HomeView.astro`, as peças da primeira página, `public/js/inicio.js`, `tests/inicio/*`, `src/lib/routes.mjs`, `MunicipioView.astro`, `src/lib/documentos.mjs`) não foram tocados.

## 5 · Porque é que os alvos do corpo transcrito não descem a zero, com o número que o prova

O brief (§1.4 e D4) manda que «os selos e as ligações com menos de 44 px ganhem a área de toque da casa», «a descer para 0 nos selos e nas ligações do texto». **Não desceram, e não descem sem uma decisão da direção.** O que fica no corpo transcrito de uma página de leitura, medido a 390 na edição portuguesa de amostra: 291 portas de figura, 21 setas de porta a seguir a uma ligação, 16 ligações do próprio documento e 12 selos. São **alvos dentro de uma frase**, e a casa já decidiu o que fazer com eles duas vezes, com a medição ao lado:

* `site.css`, B10 segunda ronda: `.texto-artigo a.src-chip::after` volta ao tamanho da unidade, «onde um selo ou um número do sítio vive dentro de uma frase, a área de 44 px sai da sua linha e cai em cima da porta da linha de cima»;
* `texto.css`, B10: as portas de figura ficam com a área da sua linha, «dar-lhes 44 px punha cada uma por cima da porta da linha de cima, e o que se ganhava num dedo perdia-se noutro».

**A medida que o confirma, feita hoje pela régua nova (célula I9), nas oito páginas:** entre 104 e 549 pares de portas seguidas estão a menos de 44 px umas das outras, com a mediana entre linhas nos 34,6 px na página maior. Dar 44 px a cada uma faria, nessa página, 549 pares de áreas sobrepostas.

**O caminho que levaria a zero, e o preço.** É levar a entrelinha da prosa transcrita de 30,4 px (19 px sobre 1,6) para 44 px, o que a folha da casa já escreveu que é «mudar a composição da leitura, e essa é uma decisão da direcção e não desta folha». Numa página que a auditoria já conta em 38 ecrãs a 390, é somar-lhe cerca de 45 % de altura. **Fica para o diretor ou para a direção, e não para este bloco.** A outra metade dos alvos pequenos, os 6 da cabeça (a marca a 175,2 × 36,5 px, as duas portas da agenda, os dois algarismos da manchete a 7,8 × 16,4 px), é mobília de todas as páginas do sítio e é o bloco **F1.7** que a governa: mexer-lhe daqui era mexer em 7 234 páginas a partir de um bloco que mede oito.

**A 1280 os números não mudam** (451, 204, 227, 329, 373, 715), e também não é um esquecimento: as regras de 44 px da casa vivem todas dentro de `@media (pointer: coarse)`, porque 44 px é a regra do dedo. Com rato, o que fica abaixo de 44 px é o menu do cabeçalho, o rodapé e as portas do aparelho, e nenhum deles é deste bloco.

## 6 · A subida tapa texto a 390, e quanto

A medida D3 pede a subida «visível sem tapar texto, a 390 × 664 e a 1 280». **A 1280 cumpre-se**: zero caixas de linha do artigo debaixo do comando, em dez posições de cada uma das oito páginas, porque a 1280 ele fica na goteira à direita da coluna do aparelho. **A 390 não se cumpre**, e o número é este: em dez posições de cada página, o comando apanha entre **12 e 26 caixas de linha** (em 6 a 9 das 10 posições), e a maior sobreposição mede **67,8 × 26,6 px**.

Não é um descuido, é geometria: numa janela de 390 a coluna de leitura é a janela menos duas goteiras de 18 px, e um comando fixo de 44 px de lado não tem margem nenhuma onde caber. As saídas, todas medidas ou lidas:

* **o comando no fim de cada secção** (a primeira forma que o brief oferece) está barrado pela transcrição: a mobília não entra no `<article>`, e é a regra que faz a página valer;
* **um comando só com a seta**, 44 × 44 px em vez de 79,2 × 44, tapa 44 % menos e continua a tapar;
* **não haver comando** é voltar ao achado D1 da auditoria;
* **a coluna de leitura mais estreita a 390** para lhe abrir uma goteira encurta todas as linhas do documento.

Ficou a forma de hoje, com o número à vista. **É decisão da direção**, e a régua imprime-o a cada corrida (célula I10a) para que ninguém tenha de o descobrir outra vez.

## 7 · A voz: nenhuma cadeia nova, e porquê

O brief (§1.5) previa declarar «Índice», «Secção n de N» e «topo» nas duas línguas. **Nenhuma dessas cadeias foi escrita, e por isso o inventário não muda:**

* o índice já tinha o seu rótulo, «Nesta página» / «On this page», e ele já está no inventário (linha «navegacao | Nesta página»);
* a subida já tinha a sua palavra, «Subir ↑» / «Back to top ↑», e o inventário escreve porque é que ela não entra na tabela: «o seu texto está todo dentro de um `<a>`»;
* a posição de cada secção **não tem palavra nenhuma**: é «3/9», dois algarismos e uma barra, iguais nas duas edições. Não se escreveu «Secção» nem «Section» porque a única maneira de os pôr ao lado de um título transcrito era dentro da folha de estilos, e uma cadeia traduzida dentro de uma folha de estilos é uma frase da casa que o `check:voz` e o `check:lingua` nunca veem. Uma cadeia que os portões não veem é pior do que uma cadeia que não existe;
* a barra do progresso não leva texto e sai da árvore de acessibilidade (`aria-hidden`), porque duplica o que o contador já diz.

`npm run check:voz` corre na construção e diz, na corrida deste ramo: **714 frases distintas, autorreferência 0, nada por classificar**. `design/especime-v3/CHAVES-EN.md` também não muda: não há chaves novas em `src/i18n/strings.mjs`.

## 8 · A régua, e as três plantas vistas vermelhas

`tests/texto/indice.mjs`, treze células, sobre `dist/`, fora da construção, sai com 1 quando alguma falha. Lê o registo pelo seu próprio caminho e compara-o com o HTML construído, que é o que a distingue de um eco do portão. **13 de 13** na construção limpa.

A décima terceira célula (I10a) nasceu de uma captura. A primeira sonda media o que a subida tapava com a página no fundo, onde por baixo dela está o rodapé e nunca o artigo, e devolvia zero em toda a parte; a captura de 390 mostrou o comando por cima de uma célula de tabela. A sonda passou a varrer dez posições de cada página, e o número que ela devolve é o da §6. **Uma medida que nunca separa nada não mede nada**, e esta quase entrou no relatório como um zero.

As três plantas que o brief pede (§4, D8) foram postas no `dist/` construído, com o contexto impresso e o resumo de cada ficheiro antes e depois, e retiradas a seguir:

| # | a planta | onde | o que ficou vermelho |
|---|---|---|---|
| 1 | uma ligação do índice para um `id` que não existe (`#bloco-93` → `#bloco-931`) | `dist/estudos/evora-prometido-pago-auditado-2026/texto/index.html`, sha256 `cca1ea71…` → `ccc223d0…` | régua **I1** (saída 1) e portão **L8** (saída 1), os dois com a entrada e o bloco nomeados |
| 2 | um título do registo fora do índice (a entrada «Três limites» removida) | o mesmo ficheiro, sha256 `cca1ea71…` → `4e9108a0…` | régua **I1** e **I6** (saída 1) e portão **L8** (saída 1): «o índice tem 12 entradas e o registo tem 13 títulos de nível 2 e 3» |
| 3 | a subida com alvo de 20 px (`min-width` e `min-height` de 44 px para 20 px) | `dist/_astro/TextoView.Llv0-C0L.css`, sha256 `b8f4a6fa…` → `1b2d32f9…` | régua **I7a**, **I7b** e **I8** (saída 1): «79.2×21.2px» |

Depois de repor os dois ficheiros (resumos iguais aos de origem, conferidos), a régua volta ao verde e sai com 0. As três plantas foram postas quando a régua tinha doze células; a décima terceira entrou depois, e não muda nenhuma das três.

As outras réguas da pasta: `leitura` 51 de 51, `correcoes-b` 19 de 19 (a célula B4 passou a contar os dois níveis do índice, e a mudança está no mesmo commit que os criou), `correcoes-c` **2 de 9 a falhar, e não é deste bloco**: ver a §9.

## 9 · O que se encontrou pelo caminho e não é deste bloco

**A célula C1 de `tests/texto/correcoes-c.mjs` já estava vermelha em `d447286f`.** Ela exige que o `<h1>` do documento comece antes de 45 % do ecrã a 390 (298,8 px de 664). Medido na construção de `d447286f`, antes de este bloco lhe tocar: o `<h1>` começa a **389,8 px, 58,7 %**. Depois deste bloco: **389,8 px**, o mesmo número. O que está por cima do índice nessa página, medido: o cabeçalho do sítio 190,1 px, o antetítulo 20,8 px e **o rótulo de IA do topo 64,9 px**, que entrou a 01.09.2026 com a via B da política. A régua não corre na construção, e por isso ninguém viu. **Não se corrigiu aqui** porque a peça é de outro bloco e a decisão de onde vive o rótulo de IA numa página longa é do artigo 50.º e da direção, não desta folha.

**A distância entre as duas contagens de alvos.** A auditoria de 25.08 escreveu 343 e 698 nas duas páginas maiores; a sonda deste bloco mede 349 e 691 nas mesmas páginas antes de lhes tocar. As duas medidas não são a mesma coisa, e a §1 diz porquê. Quem comparar as duas colunas sem ler a §1 vai concluir uma coisa que os números não dizem.

## 10 · Os três comandos, e o custo

| comando | código de saída | onde se leu |
|---|---|---|
| `npm run build` | 0 | `build-4.log` |
| `npm run verify` | 0 | `verify-final.log` |
| `npm run typecheck` | 0 | `typecheck-final.log` |

Os três correm sobre a árvore de cada commit e os códigos são lidos do registo de cada corrida, nunca de um comando em segundo plano.

**Os ficheiros tocados:** `src/lib/registo-html.mjs`, `src/views/TextoView.astro`, `src/styles/texto.css`, `scripts/gate-html.mjs`, `tests/texto/correcoes-b.mjs`, `tests/texto/indice.mjs`, este relatório e as capturas. Nenhuma cor nova, nenhum tipo novo, nenhuma chave nova, nenhuma linha de JavaScript.

**As capturas** estão em `design/especime-v3/capturas/indice-2026-09-03/`, PNG a escala 2: as duas edições a 390 e a 1280, com o índice fechado e aberto, mais a banda do contador ao lado de um título a meio do documento.
