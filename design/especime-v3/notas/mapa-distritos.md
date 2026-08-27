# O mapa por distritos no sítio · a nota do construtor M2

*27.08.2026, construtor do sítio (Claude Opus 5), M2 do
`briefs/BRIEF-mapa-distritos.md` (Emenda 20, ISSUES I70). Ramo
`mapa-distritos-2026-08-27`. Sem travessões na prosa deste ficheiro. Nenhum
número aqui foi escrito de memória: os do artefacto saem de `mapa/manifest.json`
e os do ecrã saem de `tests/inicio/mapa-distritos.mjs`, cuja saída está em
`medicoes/mapa-distritos-m2-2026-08-27.json`.*

## 1 · O que o sítio passou a fazer

| Onde | O que |
| --- | --- |
| `/` e `/en` | as 29 unidades da Carta como áreas, cada uma uma ligação para a sua página, nas duas larguras |
| `/distritos/<slug>` e `/en/districts/<slug>` | 29 por edição: o nome da unidade, o seu tipo, o mapa dos seus concelhos, a lista deles e a transcrição da fonte |
| `/distritos` e `/en/districts` | o índice das 29, sem mapa |
| `/municipios` | os cabeçalhos de grupo passam a ligações para a página da unidade |
| páginas de concelho | nada muda (Emenda 20d) |

O mapa de pontos não morreu: vive onde a Emenda 20d o deixa, no cartão
localizador da página do concelho, com o mesmo campo de 600 × 790 e os mesmos 308
pontos. `MapaRespira.astro` continua a ser um instrumento com três posturas, e o
que a postura decide passou a ser também qual dos dois campos se desenha, porque
os dois campos são diferentes.

## 2 · As escolhas que o brief deixou em aberto

1. **O índice `/distritos` existe.** O brief deixa-o opcional. Existe pela razão
   que o índice dos concelhos já tinha escrita (DECISIONS §1.36, item 9): sem
   ele, `/distritos` devolvia 404 por baixo de 29 páginas que existem, e o
   cabeçalho de grupo de `/municipios` levava a uma família de páginas sem porta
   comum. É uma lista, e não leva mapa.
2. **A caixa do mapa de um distrito é 490 × 560 px**, que é a página que o motor
   pressupôs para derivar a tolerância de cada um dos 29 ficheiros
   (`tolerancia.pagina_do_distrito_px` no manifesto). Nada há para rederivar: o
   erro no ecrã é o que o manifesto diz que é. A folha faz o «contém» com
   `width: 100%; max-height: 560px` sobre um `preserveAspectRatio` por omissão,
   que é a mesma conta que o motor fez, `min(490/largura, 560/altura)`.
3. **A lista de uma moldura leva os nomes de todas as ilhas dela**, e não só os
   das que não chegam aos 44 px. É o que a Emenda 20c escreve, e é o que se lê
   melhor: uma lista com sete nomes de nove deixa o leitor a adivinhar quais são
   os dois que faltam.
4. **A contagem de concelhos não se rende na página de uma unidade.** A lista
   está lá inteira, e a Ilha da Graciosa fazia a linha sair «1 concelhos». A
   chave da prova fica, e continua a ser duas contas independentes que o portão
   compara.
5. **A legenda da página de uma unidade não é a da primeira página.** «308
   concelhos · CAOP 2025 ■ fonte» é a legenda que a Emenda 17 fixa para o mapa do
   país; por baixo de dezasseis áreas, a contagem lia-se como a contagem do que
   está desenhado. Fica o nome da Carta, o ano da edição e o selo.

## 3 · O que ficou medido

**No ecrã** (Chromium sem cabeça, sobre `dist/`):

| Medida | 1280 | 390 |
| --- | --- | --- |
| a caixa do mapa das 29 | 490 × 646,1 px | 354 × 466,8 px |
| unidades com o maior lado ≥ 44 px | 19 de 29 | 19 de 29 |
| a menor que chega | Viana do Castelo, 61,6 px | Viana do Castelo, 44,5 px |
| as que não chegam | as nove ilhas dos Açores e Porto Santo | as mesmas dez |
| ligações na lista das molduras | 11, a 44 px de altura cada | 11, a 44 px |

**Numa página de distrito** (as três medidas):

| Unidade | caixa a 1280 | áreas | abaixo de 44 px |
| --- | --- | --- | --- |
| Lisboa | 490 × 560 px | 16 | 0 |
| Aveiro | 490 × 560 px | 19 | 2 (Espinho, São João da Madeira) |
| Ilha de São Miguel | 490 × 177,9 px | 6 | 0 |

**Pesos:** a primeira página 157,7 KB de HTML, com 29,9 KB de caminhos; a maior
página de distrito, Lisboa, 33,7 KB de HTML com 21,5 KB de caminhos, sob os 25 KB
que o brief fixa.

## 4 · A folga mais curta, e o que a fecha

**Viana do Castelo mede 44,5 px a 390.** É a unidade mais pequena fora de uma
moldura, e a 390 a coluna dá ao mapa 354 px (a mancha menos as duas goteiras de
18 px). A conta é linear: abaixo de **350 px de coluna**, que é uma janela de
**386 px**, Viana do Castelo desce dos 44. O brief mede a 390 (iPhone 13) e a
1280, e nas duas passa; numa janela mais estreita do que 386 px a Emenda 20c
deixa de estar cumprida para aquela unidade, e a saída, se o diretor a quiser,
é dar ao mapa a largura da janela em vez da largura da coluna. Fica escrito
porque é a única medida deste bloco que passa por menos de um píxel.

## 5 · Os portões e as réguas

**`check:mapa`** (`scripts/check-mapa.mjs`, na cadeia do `build`): seis regras,
sete estragos plantados, todos vistos vermelhos com `--vermelhos` e verdes na
corrida limpa. As regras estão na cabeça do ficheiro; os estragos são um byte
trocado em `pais.json`, um concelho apagado de uma página de distrito, um nome a
menos numa lista, uma unidade a menos nas áreas da primeira página, o mapa
declarado `role="img"` por cima das ligações, o selo retirado da figura, e a
entidade proprietária trocada na página da linha da Carta.

**A régua** (`tests/inicio/mapa-distritos.mjs`): 22 células, quatro estragos
plantados no HTML servido e nunca em disco. Corre fora da construção e sai com
código 1 quando uma célula falha.

**Duas medições estavam erradas antes de o desenho estar, e é isso que os
estragos plantados existem para mostrar.** A espera de navegação armava-se depois
do clique em vez de antes, e dez cliques certos davam dez endereços por mudar; e
a cor de um token comparava-se com o texto do token contra a forma computada, o
que fazia a célula da neutralidade passar com uma área pintada com a cor de um
estatuto. A segunda só apareceu porque o estrago plantado não ficou vermelho.

## 6 · Três defeitos do bloco, e quem os apanhou

1. **A pertença de uma unidade à sua moldura** estava a ser decidida pela caixa
   da moldura. A caixa da Madeira é alta por causa das Selvagens e desce até
   y 8022; três ilhas dos Açores caem lá dentro por acaso, e a lista da Madeira
   saía com cinco nomes, três deles dos Açores. Apanhado pela primeira medição no
   navegador. A pertença passou a ser a parcela, com a correspondência entre
   moldura e parcela derivada e não escrita.
2. **A folha das áreas** vivia em `inicio.css`, com um comentário na folha do
   distrito a dizer que ela a herdava. Não herdava: a página de um distrito não
   importa `inicio.css`. A captura de Lisboa saiu com os dezasseis concelhos
   pintados de preto sólido, que é o enchimento por omissão de um `<path>` sem
   regra nenhuma. Passou a `src/styles/mapa.css`, importada pelas duas folhas.
3. **A legenda da página de uma unidade** era a da primeira página, com a
   contagem dos 308 por baixo de um mapa com dezasseis áreas. Apanhado na mesma
   captura.

## 7 · O que ficou por fazer

* **As réguas do mapa de pontos na primeira página.**
  `tests/inicio/mapa-navegacao.mjs` e as células do mapa em
  `tests/inicio/matriz.mjs` medem os 308 pontos numa página que já não os tem.
  Nenhuma das duas entra no `npm run build`. Ficam com uma nota na cabeça a dizer
  que células é que a Emenda 20 retirou, e a reescrita é trabalho de quem for
  dono daquelas réguas.
* **A leitura cruzada do diff do inventário** (`mapa-distritos`, `por ler` em
  `critica/REVISOES-DO-INVENTARIO.md`) e a verificação cega da §5 do brief são do
  lugar de direção, e fazem-se antes da fusão.
