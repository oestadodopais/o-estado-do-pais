# As regiões · a nota do construtor do sítio (R2)

*Escrita a 27.08.2026 por Claude Opus 5, no ramo `regioes-2026-08-27`, a partir
de `main` em `e41a557`. O brief é `design/especime-v3/briefs/BRIEF-regioes.md`
§2 (R2), §3 e §4; a emenda que ele aplica é a 21 de `direcao.md`; os factos de
partida estão em `medicoes/regioes-reconhecimento-2026-08-27.md`. Sem travessões
na prosa deste ficheiro.*

## 0 · As escolhas que o brief deixou abertas, e o que se seguiu

O brief fixa a gramática e deixa a forma. Cinco escolhas, com a razão de cada uma.

**A barra desceu do eixo para a lista.** A Emenda 4 quer uma barra por leitura
(«barra = distância à referência»), e seis barras sobre o mesmo eixo sobrepõem-se
todas, porque todas partem do 100: a da Península de Setúbal vai de 55 a 100 e
cobre por inteiro as do Alentejo, da Madeira e do Algarve. Cada leitura passa a
ter a sua linha, com a sua barra. No telemóvel a lista É a régua; no computador é
a lista das portas por baixo do eixo, que é o que o brief pede a seguir à régua
(«por baixo, a lista das regiões como portas»). São a mesma lista, e não duas: um
nome repetido em duas listas fica para trás na primeira região que o motor traga.

**Portugal fica na régua e não tem página.** O campo `referencia: true` existe
desde a etapa 2i e diz exactamente isto. As contagens de regiões excluem-no, o
índice não lhe dá porta, e o portão fecha a construção se ele ganhar página.

**No índice não há camada de Relance.** A IDENTIDADE §4 pede as três camadas ou
uma declaração escrita de porque falta uma; aqui declara-se, e a razão é da
constituição: um número grande no cimo de uma régua completa é uma das leituras
posta acima das outras, que é o que a Emenda 21c proíbe. Na página de uma região
a camada existe, e é o índice daquela região. A declaração está no cabeçalho de
`InstrumentoConvergencia.astro`.

**A disposição é a C · Instrumento** nas duas páginas (IDENTIDADE §3), e está
dito nos dois ficheiros de vista. Não há coluna de rótulo nem coluna de aparelho:
o aparelho de uma régua é o selo de cada valor, e cada valor tem o seu na lista.

**«NUTS II» e não «NUTS 2» nas duas edições.** O portão de HTML fecha a
construção com o algarismo solto de «NUTS 2» — é a forma inglesa do Eurostat, e
teria de entrar por uma excepção da lista de tokens, que faz correspondência
exacta por palavra e por isso teria de aceitar «2» sozinho. O numeral romano é a
mesma nomenclatura, escreve-se em inglês, e não pede excepção nenhuma.

**O reencaminhamento lê o gabarito e a lista do documento.** A Emenda 19a manda
ler os destinos do documento «para que o cliente não saiba a rota de cada
edição». Aqui não havia onde os ler: os blocos das regiões saíram da primeira
página. O servidor escreve no comando «Região» dois campos, `data-porta-regiao`
(o gabarito `/regioes/:slug` ou `/en/regions/:slug`, saído de `routePath()`) e
`data-regioes` (a lista fechada dos slugs com página); o cliente põe um slug da
lista no lugar que o gabarito marca. Nem uma rota nem uma lista escritas no
cliente. Um slug fora da lista cai no índice, que é o `href` do próprio comando.

## 1 · O que se construiu

**RG1 · `/regioes` e `/en/regions`.** A régua da convergência completa, seis
leituras: as cinco regiões com linhas e o país. No computador o eixo, com a
referência a tinta à altura toda no 100, os traços da escala e uma marca por
leitura; no telemóvel o eixo sai por regra de folha e fica a lista. Por baixo, a
lista, que é ao mesmo tempo as portas das regiões e a legenda de selos do
instrumento (`data-legenda-selos`): é lá que cada valor desenhado dentro do `svg`
tem a porta da sua linha, pela convenção do §1.34.

**RG2 · `/regioes/<slug>` e `/en/regions/<slug>`.** Cinco regiões, dez páginas. A
cabeça leva o nome declarado como lugar e o tipo, «região NUTS II»; a régua leva
a região distinguida só pelo contorno; a camada de leitura breve leva a frase
daquele trabalho regional, com os seus selos; as peças levam o índice e a
distância, sem régua, porque a IDENTIDADE §11 diz que o desenho de distância vive
no instrumento e não nas células.

**RG3 · a primeira página.** Os cinco estados `?ambito=regiao:<slug>` saem, e com
eles os cinco blocos de cabeça e os cinco painéis. `data-so-pais` sai do documento
e do script. «Região» volta ao comando nas duas larguras, como ligação a
`/regioes`, e não como estado: o script não lhe põe papel de botão e não lhe
intercepta o clique.

**RG4 · os portões e as réguas.** `check:regioes` na cadeia do `build`, cinco
regras e cinco estragos plantados; `tests/inicio/regioes.mjs`, 29 células e quatro
estragos.

**RG5 · os registos.** `DECISIONS.md` §1.75; esta nota; `CHAVES-EN.md`; o
inventário com o bloco `regioes`; o registo das revisões com `por ler`.

## 2 · Os números

| o quê | quanto |
|---|---|
| regiões declaradas na lista de dados | 5 |
| regiões com linhas publicadas | 5 |
| leituras na régua (as cinco e o país) | 6 |
| páginas construídas | 12 (2 índices, 10 de região) |
| peso do índice, HTML servido | 22 328 B |
| peso da página de uma região (Alentejo) | 26 650 B |
| a caixa da régua a 1280 | 1090 × 323 px |
| a caixa de uma linha da lista, a 320 · 360 · 390 · 430 | 282 · 322 · 352 · 392 px de largura, 85 px de altura |
| a barra de uma linha, às mesmas larguras | 282 · 322 · 352 · 392 × 24 px |
| transbordo, às cinco larguras | 0 px |
| rótulos cruzados ou tapados no eixo, a 1280 | 0 |
| portas da lista, altura de alvo | 44 px |
| chaves da prova novas | 2 (`regioes_total`, `regioes_com_linha`) |
| linhas do inventário no bloco `regioes` | 20 (16 novas, 4 que voltam à vida) |
| linhas do inventário que passam a `retirada` | 10 |
| capturas | 18 |

## 3 · Os dois defeitos do próprio bloco, apanhados pela sua régua

Escritos aqui porque a régua que os apanhou é a prova de que ela conta.

**As portas da lista mediam 39 px e não 44.** `padding: 10px 0` sobre uma
entrelinha de 19 px dá 39. O alvo passa a ser DECLARADO (`min-height: 44px`) em
vez de calculado a partir de uma entrelinha que muda com o tipo.

**A 1280, uma chapa tapava o rótulo do vizinho.** A chapa de papel de um rótulo
vai de `y-37` a `y+4`, 41 unidades; os patamares estavam a 30 unidades uns dos
outros, e por isso duas chapas de patamares vizinhos cruzavam-se sempre em 11
unidades. Enquanto a régua desenhava uma leitura isso não tinha consequência; com
a régua completa tem, e a régua mediu-a: a chapa de Portugal tapava o rótulo do
Alentejo, a do Algarve tapava o da Madeira, e os rótulos da Madeira e do Algarve
cruzavam-se. O empacotador separa os rótulos em X dentro de um patamar; nada os
separava em Y entre patamares. Os patamares passam a 42 unidades, `eixoY` desce
42 e a caixa cresce 28: a garantia passa a ser das duas dimensões. A medição da
subetapa 2g fica intacta, porque ela mediu o nome contra o valor DENTRO de uma
chapa, e essa distância não muda.

## 4 · O que fica

**A régua tem quatro patamares, e com seis leituras isso chega.** Não chega por
definição: o empacotador põe no último patamar o que já não cabe em nenhum, e com
o Norte, o Centro e os Açores na régua dois rótulos podem voltar a cruzar-se. A
célula M1b vê-o, e a resposta desse dia é um patamar a mais em `GEOMETRIA` e mais
42 unidades de caixa. Está escrito no ficheiro para que a resposta não seja
procurada outra vez.

**`tests/inicio/correcoes-a.mjs` rebenta em A5 e A6, e não é deste bloco.**
Procura `[data-readout]`, `.mun-porta` e `circle.mun` na primeira página, que
saíram com os 308 pontos no bloco do mapa por distritos (Emenda 20a). Ficou para
trás naquele bloco; os distritos são §3 do brief das regiões, «o que não muda», e
por isso não se corrigiu aqui.

**A leitura cruzada do bloco está por fazer**, e o portão da voz di-lo a cada
construção: o registo das revisões marca `regioes` como `por ler`.
