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
| D1 | um índice rendido nas 8 páginas, uma entrada por título de nível 2 e 3 do registo (o nível 4 fica de fora, contado e dito na §3), cada ligação a um `id` que existe | 8 páginas com índice, **79 entradas**, só de nível 2 | 8 páginas, **136 entradas**, nível 2 e 3, todas com destino na página | sim |
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
## 11 · Segunda passagem (Claude Sonnet 5, 03.09.2026)

*Sobre a leitura a frio do Codex, `design/especime-v3/critica/2026-09-03-codex-leitura-f19-indice.md`, e a triagem do lugar de direção no seu cabeçalho: Blocking 3, Blocking 4, Major 6 a 9 e Minor 10. O Blocking 1, o Blocking 2 e o Major 5 eram plantas do próprio pacote de leitura (a triagem di-lo por extenso) e não se tocam aqui. Todos os números desta secção foram medidos hoje, com sondas próprias sobre o `dist/` construído desta árvore, e as sondas estão escritas em `tests/texto/indice.mjs` e `tests/texto/correcoes-b.mjs`, que qualquer um pode voltar a correr.*

### O resultado, em quatro linhas

Os selos do corpo transcrito fora de tabela (101 nas oito páginas) crescem para 44px pela técnica do `::after`; 87 alcançam-no sem tocar num vizinho, e os 14 que não alcançam têm uma razão medida e não uma desculpa (o rótulo quebra em duas linhas). As ligações do documento foram tentadas com a mesma técnica e a medição mostrou que ela não serve: a maioria quebra em várias linhas, e um `::after` centrado numa caixa que quebra não fica sobre nenhuma linha em particular — ficam como estavam, com a razão escrita ao lado da regra. A subida deixa de ser um comando fixo a 390 (onde tapava entre 12 e 26 caixas de linha do artigo, medido antes desta correção): fica fixa só a partir de 1024px, onde a goteira existe, e cada secção de nível 2 ganha uma porta em fluxo no seu próprio fim; a régua mede zero sobreposições nas duas formas, nas oito páginas. A indicação de progresso ganha nome acessível («Secção n de N»), verificado com `ariaSnapshot()` nos dois motores, sem mudar um carácter do título.

### 1 · Blocking 3 — os alvos de toque do corpo, medidos antes de se escrever uma regra

Antes de tocar numa linha de CSS, uma sonda própria (não commitada, a metodologia fica aqui) simulou o que cresceria e o que colidiria, nas oito páginas, para as quatro classes que o Blocking 3 nomeia: `.texto-ligacao`, `.texto-figura-porta`, `.texto-figura-porta-apos` e `a.src-chip`.

**As portas de figura ficam como estavam**, e a medição está em `src/styles/texto.css:221-245` (o comentário ao lado de `.texto-figura-porta-apos`): 2 358 portas de figura nas oito páginas (876 fora de tabela, 1 482 dentro) e 42 setas «→» destas (8 fora, 34 dentro). Crescê-las às cegas sobrepunha-se a um vizinho em cerca de 27% das de fora de tabela, 67% das de dentro, 75% e 100% das duas classes de setas. A regra da casa («uma área sobreposta não é um alvo maior, é uma porta que abre a linha do vizinho») decide sozinha: não se tenta. A régua nova (`tests/texto/indice.mjs`, célula I9b) mede a cada corrida a distância entre portas seguidas nas oito páginas e imprime a mediana, que é a prova de que a isenção continua a ter razão medida.

**As ligações do documento foram tentadas, medidas e revertidas**, e é o achado mais caro desta passagem, escrito em `src/styles/texto.css:170-193` (a nota ao lado de `.texto-ligacao`, linha 167). A primeira tentativa deu-lhes a técnica do selo (`::after` absoluto e centrado); uma régua com o acerto real do navegador (`elementFromPoint`, não uma soma de áreas) mediu que NENHUMA das 39 ligações (13 fora de tabela, 26 dentro) alcançava 44px sem sobrepor um vizinho. A razão, medida e não suposta: na amostra, 12 das 16 ligações fora de tabela quebram em 2 a 7 linhas (a etiqueta é o próprio endereço do documento, «283 caracteres na mais longa»), e um `::after` centrado sobre uma caixa em linha que quebra fica ancorado à caixa gerada inteira, não a uma linha em particular — o seu centro cai algures entre a primeira e a última linha, não onde o dedo vê a palavra. É a mesma técnica que funciona no selo da casa precisamente porque um selo nunca quebra; medida agora, essa condição não vale para o endereço de uma ligação. As ligações ficam com a área que já tinham.

**Os selos fora de tabela crescem**, e é o ganho real desta correção: `src/styles/texto.css:271-291` (a regra em `286-296`). Dos 196 selos do corpo (101 fora de tabela, 95 dentro), os 101 de fora ganham o `::after` de 44px; 95 dentro de tabela ficam como estavam, pela mesma razão que já prende as portas de figura em tabela (entrelinha de 13,5px/1,45, medida e não mudada). Dos 101 que crescem, **87 alcançam 44px sem tocar um vizinho e 14 não alcançam**, todos pela mesma causa medida: o rótulo («fonte · <estudo>» / «source · <estudo>») quebra em duas linhas quando o título do estudo é longo (13 das 101 instâncias), e nessa segunda linha o acerto ou não chega à área própria ou cai perto do selo da entrada seguinte. A régua nova (I9) exige que o número de selos com problema seja exatamente 14; qualquer desvio falha a construção até se reler a razão.

**O residual completo, com a contagem e a razão, é este:**

| classe | onde | quantos | porquê ficam |
|---|---|---|---|
| `.texto-figura-porta` | fora de tabela | 876 | cresce-los sobrepunha-se a um vizinho em ~27%, medido por simulação antes da regra |
| `.texto-figura-porta` | em tabela | 1 482 | idem, ~67%; a entrelinha da tabela (13,5px/1,45) não muda |
| `.texto-figura-porta-apos` | fora e em tabela | 42 (8+34) | a mesma família de encosto do selo em fluxo; ~75% e 100% |
| `.texto-ligacao` | fora e em tabela | 39 (13+26) | MEDIDO com o acerto real: 0 de 39 alcançavam 44px sem sobrepor; a etiqueta quebra em várias linhas |
| `a.src-chip` | em tabela | 95 | mesma densidade das portas de figura em tabela; não se tentou |
| `a.src-chip` | fora de tabela, com problema | 14 de 101 | o rótulo quebra em duas linhas (título de estudo longo); MEDIDO com o acerto real |

### 2 · Blocking 4 — a subida sem goteira, e a porta em fluxo

A régua da primeira passagem já tinha medido o problema e tinha-o impresso como informação («não é uma exigência: é a conta do que custa»); a leitura a frio apanhou exatamente essa frase. A 390 a coluna de leitura é a janela menos duas goteiras de 18px, e um comando fixo de 44px de lado não tem onde caber sem tapar uma linha do artigo: medido antes desta correção, entre 12 e 26 caixas de linha tapadas em 6 a 9 das dez posições de cada página.

**A saída:** o comando fixo (`.texto-subir`) passa a `display: none` por defeito e só se desenha a partir de 1024px (`src/styles/texto.css:625-660`), que é um limiar já usado na primeira página desta casa (`inicio.css`, quatro sítios) e não um número novo inventado para este bloco. Abaixo disso, cada secção de nível 2 ganha uma porta em fluxo no seu próprio fim («Subir ↑», o mesmo destino `#texto-indice`), escrita por `pecasDoCorpo()` em `src/lib/registo-html.mjs:558-676` (a lógica da secção em fluxo, `575-618`; o fecho da última secção depois do laço, `674`): fecha a secção anterior antes de abrir um novo título de nível 2, e fecha a última depois do laço. É mobília e não corpo (não leva `data-registo-bloco`), mas vive dentro do fluxo do `<article>` para que a sua caixa empurre o que vem a seguir em vez de se lhe sobrepor — a única forma que garante zero sobreposição por construção, e não por sorte.

**Medido depois:** as caixas de linha tapadas pelo comando (fixo ou em fluxo, o que estiver ativo a cada largura) caem de 12 a 26 (oito páginas, antes) para **0 em todas as oito**, a 390 e a 1280 (`tests/texto/indice.mjs`, células I7a e I10a, agora exigências e não informação). O preço é altura: a 390 a página cresce entre 473 e 1 217px, consoante o número de secções de nível 2 (8 a 14 por página) — é o custo honesto de um alvo que não se sobrepõe, e fica medido e não escondido.

### 3 · Major 6 — os comentários da folha, com os números remedidos

Todos os comentários de `src/styles/texto.css` que descrevem estas duas correções foram reescritos com os números desta passagem (não os da simulação anterior à `::after`, que continuam lá mas identificados como simulação): ver `texto.css:170-193` (ligação), `221-245` (figura), `271-296` (selo), `587-660` (subida e porta em fluxo), `661-698` (posição acessível). Onde um número vem de uma simulação geométrica e não do acerto real do navegador, o comentário di-lo por extenso, para que ninguém o leia como a mesma prova que a I9 faz.

**Os registos de medição** ficam em `design/especime-v3/medicoes/indice-sonnet-antes.json` (a régua da primeira passagem, corrida contra `cc7e6bd2` antes de esta passagem tocar em nada) e `design/especime-v3/medicoes/indice-sonnet-depois.json` (a mesma régua, depois de todas as correções, 17 de 17 células verdes).

### 4 · Major 7 — a voz, e o que a régua automática não pode confirmar

O brief previa declarar «Subir» e a posição de cada secção no inventário; a primeira passagem não escreveu nenhuma das duas, e a leitura a frio leu a nota de 25.08 sobre «Subir ↑» (que explica porque é que a régua automática não o lê) como se fosse dispensa de a declarar. **A tentativa de a corrigir literalmente falhou a construção**, e a falha é a prova mais forte desta secção: dar a «Subir» e a «Back to top» o estado `viva` na tabela do inventário faz `npm run check:voz` fechar com «linha viva que não se rende em rota nenhuma», porque as duas medidas do portão da voz (a dos blocos de texto e o tripwire) excluem, por regra, texto que viva inteiro dentro de um `<a>` — nos dois sentidos: não o contam como bloco por classificar, e também não conseguem confirmar que uma declaração `viva` se rende. Não é uma falha desta correção: é um limite mecânico do portão, medido ao tentar contorná-lo.

**O que ficou feito:** `design/especime-v3/INVENTARIO-FRASES.md` ganha a secção «Segunda passagem do bloco F1.9a (Sonnet)», que nomeia «Subir» / «Back to top» (com a razão por que não podem ser uma linha `viva`) e o modelo «Secção {n} de {total}» / «Section {n} of {total}» (com a razão por que é origem declarada e não prosa solta, `data-registo-posicao`, verificado pelo L8), cada um com o seu par inglês e a sua origem escritos por extenso. `design/especime-v3/critica/REVISOES-DO-INVENTARIO.md` ganha a entrada `indice-sonnet` (0 linhas novas na tabela classificada, e a razão de serem 0 escrita).

**O que a régua da voz exclui, e não é desta passagem.** `medir-defeitos.mjs` não lê texto que viva inteiro dentro de um `<a>`, em nenhuma rota do sítio: é uma exclusão geral do portão, não um esquecimento deste bloco. Alargá-la é redesenhar a medida 8 e o tripwire para saberem separar «rótulo de comando, sem origem própria» de «prosa da casa dentro de uma ligação», e é exatamente a classe de trabalho que o F0.9 já deixou escrita para o F3.1 (190 cadeias em 2 118 ocorrências fora do arame, `design/especime-v3/medicoes/frases-construtor.md` §10).

### 5 · Major 8 — a indicação de progresso chega a quem não vê

A primeira passagem compôs o «n/N» só na folha de estilos, com o texto alternativo do CSS vazio de propósito para o título continuar a ser só o texto do registo (`content: … / ""`); a leitura a frio mediu a consequência: o nome acessível de um título transcrito excluía a posição.

**A técnica**, escrita em `src/lib/registo-html.mjs:516-554` (a nota) e `575-618` (o código): um irmão do título, fora dele (`<span id="posicao-bloco-N" class="vh" data-registo-posicao="…">Secção n de N</span>`), a que o título aponta com `aria-labelledby="posicao-bloco-N bloco-N"` — a própria lista inclui o id do título, que é a forma padrão de acrescentar texto a um nome acessível sem duplicar o que já lá está (o segundo id lê o texto que o título já tem). O título continua byte a byte o que era: o irmão vive FORA do `<h2>`, nunca dentro, e por isso não é lido pela unidade que o L2 do portão compara carácter a carácter. `scripts/gate-html.mjs` ganha a oitava marca da família `data-registo-posicao` (linha 5617) e uma conferência no L8 (linhas 2144-2206) que reconta a posição, o texto contra o modelo do inventário e a referência, a cada construção.

**Medido nos dois motores**, com `ariaSnapshot()` do Playwright (não uma suposição sobre a regra do `aria-labelledby`): o nome acessível de cada título de nível 2 das oito páginas é «Secção n de N <título>», confirmado em WebKit e em Chromium (`tests/texto/indice.mjs`, células I11a e I11b, 9 de 9 títulos na página de amostra, nos dois motores). A barra do progresso continua `aria-hidden`, porque a posição já chega pelos dois lados.

### 6 · Major 9 — as réguas exigem o que dizem exigir

Três buracos que a leitura a frio apanhou, e os três fechados:

* **Ids duplicados passavam.** `tests/texto/indice.mjs` usava `querySelector`, que devolve o primeiro e nunca revela um segundo com o mesmo id. A célula I1 passa a contar CADA id da página com `querySelectorAll` (não só os `#bloco-N`) e a nova célula I1b exige que todos apareçam exatamente uma vez; a comparação de destino de cada entrada do índice também passou de «existe algum» para «existe exatamente um».
* **A I9 media a razão da isenção e não provava nada sobre a correção.** Passa a exigir que os selos que crescem alcancem 44px pelo acerto real do navegador, com o resíduo (o rótulo que quebra) contado a um número exato: qualquer desvio falha a construção (§1, acima).
* **A I10a era informativa.** Passa a falhar com qualquer sobreposição, nas duas larguras, e a sonda (`SONDA_TAPA`) foi corrigida duas vezes no processo: uma vez para saltar a caixa da própria porta em fluxo (o mesmo texto não se tapa a si próprio) e outra para saltar o `.vh` da posição acessível, que é `position: absolute` sem `top`/`left` declarados e por isso cai, pela posição estática do CSS, em cima da porta que o precede — um leitor com vista não o vê, e por isso não é texto que a porta possa tapar (a mesma razão que já tira `.vh` do `textoVisivel()` do portão). As duas eram defeitos da própria sonda, não do sítio, e ficaram escritos porque são a prova de que a régua nova conta.

### 7 · Minor 10 — a afirmação qualificada

`design/especime-v3/medicoes/indice-construtor.md:29` (a linha D1 da tabela §2) dizia «uma entrada por título do registo», sem os dois níveis; o resto do relatório (§3, linha 55) já qualificava corretamente e contava o nível 4 excluído («dez, nos pelouros»). A linha da tabela passa a dizer «uma entrada por título de nível 2 e 3 do registo (o nível 4 fica de fora, contado e dito na §3)», que é o que a implementação sempre fez.

### D1 a D8, remedidos depois desta passagem

| # | medida | antes desta passagem (`cc7e6bd2`) | depois desta passagem | cumpre |
|---|---|---|---|---|
| D1 | índice, uma entrada por título de nível 2 e 3, destino que existe | 8 páginas, 136 entradas | igual, 136 entradas, **e agora com cada id da página confirmado único (I1b)** | sim |
| D2 | progresso sem guião | «n/N» visual, sem nome acessível | «n/N» visual **e** «Secção n de N» no nome acessível, medido com `ariaSnapshot()` nos dois motores | sim |
| D3 | subida, alvo ≥44px, sem tapar texto | tapava 12 a 26 caixas de linha em 6 a 9 das 10 posições, a 390 | **0 caixas tapadas nas oito páginas**, a 390 (porta em fluxo) e a 1280 (comando fixo) | sim |
| D4 | alvos <44px na mobília, a descer para 0 | mobília 0; corpo transcrito não tentado para ligação e selo | mobília 0; **selo fora de tabela: 87 de 101 a 44px limpo, 14 com o resíduo medido**; ligação tentada e revertida com a razão medida; figura e apos por decisão da direção (§5 do relatório original) | parcial, medido |
| D5 | `check:documentos` e `gate:html` verdes | verdes | verdes, com o L8 a conferir também `data-registo-posicao` | sim |
| D6 | altura a 390 não sobe mais do que a banda do índice | banda 46px, +44px (pt) / +0px (en) | banda do índice **continua 46px**; a altura total sobe **473 a 1217px** nas oito páginas, e a causa não é o índice — é a porta em fluxo que o Blocking 4 exige, uma por secção de nível 2 | a banda do índice cumpre; o custo novo está medido e é de outro item |
| D7 | `build`, `verify`, `typecheck` a 0 | 0, 0, 0 | 0, 0, 0 (§10) | sim |
| D8 | régua com plantas vermelhas e depois verdes | 13 células, 3 plantas | **17 células** (I1b, I9 reescrita, I11a, I11b novas), plantas desta passagem não repetidas (as da primeira continuam válidas, ver §8 do relatório original); `correcoes-b.mjs` 19 de 19 | sim |

### O que fica para a direção, sem mudar, e os três comandos

Os dois pontos que o relatório original já tinha deixado para a direção continuam exatamente onde estavam, porque nenhum item desta passagem os revisitava: a entrelinha da prosa transcrita (30,4px) não muda para dar 44px às portas de figura ou às ligações (§5 do relatório original, e agora também §1 desta secção); e a célula C1 de `tests/texto/correcoes-c.mjs`, vermelha desde antes de F1.9a por causa do rótulo de IA no topo da página (§9 do relatório original), continua vermelha, sem relação com este bloco.

| comando | código de saída | onde se leu |
|---|---|---|
| `npm run build` | 0 | `build-final.log` (local, não commitado: a mesma convenção do `build-4.log` da primeira passagem) |
| `npm run verify` | 0 | `verify-final.log` |
| `npm run typecheck` | 0 | `typecheck-final.log` |

Os três correm sobre a árvore desta correção e os códigos foram lidos do ficheiro de cada corrida, nunca de um comando em segundo plano (a régua `tests/texto/indice.mjs` e `tests/texto/correcoes-b.mjs`, que não entram no `build`, correram à parte e estão nas suas próprias secções acima).

**Os ficheiros tocados nesta passagem:** `src/lib/registo-html.mjs`, `src/views/TextoView.astro`, `src/styles/texto.css`, `src/i18n/strings.mjs`, `scripts/gate-html.mjs`, `tests/texto/indice.mjs`, `tests/texto/correcoes-b.mjs`, `design/especime-v3/INVENTARIO-FRASES.md`, `design/especime-v3/critica/REVISOES-DO-INVENTARIO.md`, este relatório, e dois ficheiros JSON de medição novos em `design/especime-v3/medicoes/` (`indice-sonnet-antes.json`, `indice-sonnet-depois.json`). Nenhuma cor nova, nenhum tipo novo, nenhuma linha de JavaScript de produção. `src/data/figuras.mjs`, que o brief original listava para declarar cadeias novas, não foi tocado: as cadeias novas vivem em `strings.mjs`, que é onde o resto da rota já as declara, e `figuras.mjs` é, medido agora, o ficheiro dos limiares do painel da primeira página e não tem nada a ver com strings da interface.
