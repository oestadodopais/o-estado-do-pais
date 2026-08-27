# As regiões · a nota do construtor do sítio (R2)

*Escrita a 27.08.2026 por Claude Opus 5, no ramo `regioes-2026-08-27`, a partir
de `main` em `e41a557`, e continuada a 28.08.2026 com as quatro regiões que o
motor trouxe (§3b) e com as correcções da leitura cruzada do Codex. O brief é `design/especime-v3/briefs/BRIEF-regioes.md`
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

| o quê | 27.08 | 28.08 |
|---|---|---|
| regiões declaradas na lista de dados | 5 | **9** |
| regiões com linhas publicadas | 5 | **9** |
| leituras na régua (as regiões e o país) | 6 | **10** |
| páginas de região construídas | 10 | **18** |
| peso do índice, HTML servido | 22 328 B | **29 317 B** |
| peso da página de uma região | 26 650 B (Alentejo) | **32 935 B** (Norte) |
| a caixa da régua a 1280 | 1090 × 323 px | 1090 × 323 px |
| patamares usados, de quatro | 2 | **4** (1, 1, 3 e 5 marcas) |
| a caixa de uma linha da lista, a 320 · 360 · 390 · 430 | 282 · 322 · 352 · 392 px de largura, 85 px de altura | igual |
| a barra de uma linha, às mesmas larguras | 282 · 322 · 352 · 392 × 24 px | igual |
| transbordo, às cinco larguras | 0 px | 0 px |
| rótulos cruzados ou tapados no eixo, a 1280 | 0 | 0 |
| portas da lista, altura de alvo | 44 px | 44 px |
| unidades de peça com separador solto | — | **0 de 36** |
| chaves da prova novas | 2 (`regioes_total`, `regioes_com_linha`) | 2 |
| células da régua `tests/inicio/regioes.mjs` | 29, 4 estragos | **30, 5 estragos** |
| linhas do inventário no bloco `regioes` | 20 | **36** |
| capturas | 18 | 18 |

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

## 3b · A segunda passagem, 28.08.2026: as nove regiões

**O conjunto ficou completo.** O motor confirmou na fonte que a classificação em
vigor é a NUTS 2024 e que ela tem nove regiões NUTS II para Portugal, e o lugar
de direção escreveu as oito linhas das quatro que faltavam. As quatro entradas
entraram em `src/data/regioes.mjs` pela via que já lá estava, e mais nada mudou
para elas ganharem barra, página, endereço nas duas edições e contagem: é o que a
Emenda 21e prometia.

**Cada entrada traz o `codigo` e o nome oficial em comentário**, lidos da nota
alojada no motor e nunca de memória. Os nomes seguem a convenção da casa:
encurtar onde o uso corrente encurta («Açores»), traduzir só onde existe um nome
inglês estabelecido («Azores» sim; «Norte», «Centro» e «Oeste e Vale do Tejo»
não, porque o Eurostat também não os traduz). O «(PT)» de «Centro (PT)» é o
desambiguador da classificação e fica no comentário.

**A I85 fechou-se pela medição, e contra a previsão.** A nota de 27.08 escrevia
que dez leituras pediriam um quinto patamar e mais 42 unidades de caixa. As duas
geometrias foram construídas e medidas, e deram o mesmo: dez marcas, zero rótulos
cruzados, zero tapados, quatro patamares usados — com cinco disponíveis, o quinto
ficava vazio. A geometria fica nos quatro, e a caixa no tamanho que tinha. **A
folga acabou:** os quatro patamares estão todos ocupados, e a M1b passa a
imprimir quantos o empacotador usou, para que o dia em que faltar um se veja.

**Duas correcções da leitura cruzada do Codex.** A contagem dizia «5 regiões com
linhas publicadas.» e as duas dicas da prova diziam «com linhas publicadas no
livro-razão»: é cobertura, e sai. Fica «9 regiões», e as dicas passam a nomear o
que contam. E a peça da distância rendia «pontos do índice ·» com um `<span>`
vazio a seguir, porque uma linha derivada não tem `reference_date` e o gabarito
escrevia sempre o separador; o período entra quando a linha o tem, e a célula M7
varre as 36 unidades das duas edições para que a forma não volte.

## 4 · O que fica

**A régua tem quatro patamares, e os quatro estão ocupados.** Com dez leituras —
as nove regiões e o país — o empacotador usa os quatro (1, 1, 3 e 5 marcas), e
não sobra nenhum. O conjunto NUTS II tem nove regiões e as nove têm linha, pelo
que não há crescimento por que esperar: a régua está no seu tamanho final até a
classificação mudar. Nesse dia a M1b fica vermelha, e a resposta está escrita ao
lado da constante: um patamar a mais (`262`), `eixoY` de 248 para 290 e `altura`
de 290 para 332.

**`tests/inicio/correcoes-a.mjs` rebenta em A5 e A6, e não é deste bloco.**
Procura `[data-readout]`, `.mun-porta` e `circle.mun` na primeira página, que
saíram com os 308 pontos no bloco do mapa por distritos (Emenda 20a). Ficou para
trás naquele bloco; os distritos são §3 do brief das regiões, «o que não muda», e
por isso não se corrigiu aqui.

**A leitura cruzada do bloco está por fazer**, e o portão da voz di-lo a cada
construção: o registo das revisões marca `regioes` como `por ler`.
