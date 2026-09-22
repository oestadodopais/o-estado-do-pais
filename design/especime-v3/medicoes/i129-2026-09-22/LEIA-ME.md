# I129 · O grupo etário dos jovens que não estudam nem trabalham

*Construtor: Claude Opus 5, 22.09.2026, na worktree `jovens-nem-2026-09-22`
sobre `83e9df2d`, e no motor na árvore principal sobre `3cf1ccb`. O brief é
`design/observatorio/BRIEF-I129-o-grupo-etario-dos-jovens-nem.md`. Cada número
desta página sai de `medir-i129.mjs`, que corre sobre o `dist/` construído e
sobre o livro-razão e fica ao lado, ou da saída de um portão guardada aqui.
Nenhum foi escrito de cabeça. Sem travessões na prosa.*

## O que se leu na fonte, e quando

Pelo cliente da casa (`core.http`, com `OEstadoDoPais/gerador-das-linhas` no
pedido, um pedido de cada vez), a 22.09.2026:

| endereço | hora (UTC) | o que diz |
|---|---|---|
| `…/data/tipslm90?format=JSON&lang=EN&geo=PT&unit=PC_POP` | 09:52:35 | `age`: `Y15-29: From 15 to 29 years` · `sex`: `T: Total` · `freq`: `A: Annual` · valores 8.7 (2024) e 8.0 (2025) |
| `…/data/tipslm90?format=JSON&lang=EN&geo=EU27_2020&unit=PC_POP` | 09:52:36 | a mesma dimensão `age`, e 11.0 em 2025 |

O rótulo que as duas respostas dão ao conjunto é o do catálogo, palavra por
palavra: «Young persons (aged 15-24) neither in employment nor in education and
training - % of total population in private households in the same age group».
É o título que diz 15-24 ao lado de uma série que é dos 15 aos 29, e é ele que
fica como a fonte o escreve.

## O gerador, no motor

`compor_excerto` ganhou um sexto argumento, `dims`, e `dimensoes_fixadas()` lê
da resposta as dimensões com **uma só categoria** que não são o total e que o
excerto ainda não escreve. Ficam de fora, com a razão ao pé da lista no
ficheiro: a unidade, a geografia e o tempo, que o excerto já escreve com um nome
seu, e a frequência, que é a cadência com que a série se publica e não a
população que o número conta. Sem `dims`, o excerto é byte a byte o que sempre
foi.

As três linhas não se refizeram pelo molde: duas delas são do molde de
`indicators/enquadramento.py`, com a sua própria nota, e copiar esse molde para
um segundo ficheiro arriscava um byte diferente no valor ou no período. O que
entrou foi `--reescrever <ids>`, que compõe o excerto de novo com
`compor_excerto` sobre a resposta viva e **recusa a linha** se o que recompõe
sem as dimensões não for, byte a byte, o excerto publicado. As três passaram.
Três guardas plantadas no teste (um valor que a resposta não dá, outra
geografia, outra unidade) mordem as três.

Mais duas coisas que estavam por proteger no mesmo ficheiro e que este bloco
fechou: um `--write` por cima de uma linha **apagava** o bloco `verifications`
que `refresh.py` e `corredor.py` escrevem, e passa a levá-lo para a linha nova;
e o destino das linhas passa a aceitar `OEDP_LEDGER_DIR`, sem o qual um
construtor numa worktree escrevia na árvore principal de outra sessão.

O teste, `indicators/generate_claims_test.py`, guarda a resposta de 09:52:35 e
prova sete coisas: a etiqueta lida, o excerto composto palavra por palavra, o
controlo de uma linha sem dimensão fixada, **a planta da etiqueta trocada** («From
15 to 24 years» tem de dar outro excerto), as três guardas da reescrita, as
reconferências que sobrevivem, e a recusa de um campo duplicado. Corrido com um
`compor_excerto` que ignora as dimensões, dá 5 falhas, entre elas «A PLANTA NÃO
MORDEU»: a suíte sabe fechar.

## As três linhas

Mudaram **duas linhas por ficheiro**: o `excerpt` e a `note`. O `git diff --stat`
diz 3 ficheiros, 6 inserções, 6 eliminações, e nenhum outro ficheiro do
livro-razão mudou.

| | valor | unidade | período | `source_url` | `document.title` | reconferências |
|---|---|---|---|---|---|---|
| `jovens-nem-2024` | 8,7 | % da população | 2024 | igual | igual | 1, guardadas |
| `jovens-nem-2025` | 8 | % da população | 2025 | igual | igual | 4, guardadas |
| `jovens-nem-2025-ue` | 11,0 | % da população | 2025 | igual | igual | 1, guardadas |

O excerto novo de `jovens-nem-2025`, palavra por palavra:

> Young persons (aged 15-24) neither in employment nor in education and training
> - % of total population in private households in the same age group — Age
> class: From 15 to 29 years — Percentage of total population — Portugal — 2025:
> 8.0

E a nota ganhou, no fim da que já lá estava: «O título que o catálogo do Eurostat
dá a este quadro diz «aged 15-24» e a dimensão `age` da resposta ao endereço em
source_url diz «From 15 to 29 years»: a série é dos 15 aos 29. As duas leituras
são de 22.09.2026. O título fica como a fonte o escreve; o excerto passa a trazer
a etiqueta da idade. Nenhum valor mudou.»

## A definição, nas duas edições

Lidas do cartão rendido em `/temas/` e em `/en/themes/`:

| | |
|---|---|
| pt | A percentagem das pessoas dos 15 aos 29 anos, de ambos os sexos, que não tem emprego e não está em estudos nem em formação. |
| en | The percentage of the population aged 15 to 29, of both sexes, who is not employed and not involved in further education or training. |

Os dois limites saem da etiqueta que o excerto agora traz; o «de ambos os sexos»
sai do `sex: T: Total` da mesma resposta. Os algarismos levam marca de origem
própria (`escala-de-instrumento`), como já acontecia na definição do abandono
escolar precoce. A frase anterior dizia «de um grupo de idades e sexo» sem dizer
qual: o achado 7 de 14.09.2026 tinha trazido o sexo de volta e deixado a idade
por dizer, e agora as duas metades da condição estão preenchidas.

No inventário das frases: 2 retiradas, 2 vivas, no bloco `i129`, com a entrada
em `critica/REVISOES-DO-INVENTARIO.md`. O `check:voz` conta 602 vivas todas
rendidas e 542 retiradas nenhuma rendida.

## A célula K13 do `check:cartao`

Para cada medida com definição declarada cuja **linha** fixa um grupo de idades
(a etiqueta `Age class: From X to Y years` no excerto, ou um filtro `age=` no
`source_url`), a definição das duas edições escreve os dois limites. Não lê
`dist/`: compara a declaração com a linha, que é onde o defeito vive.

A planta troca o segundo limite por «24» na declaração e exige um vermelho por
edição; com a comparação embotada a prova dá «K13 NÃO MORDEU». A catraca tem a
sua própria planta: uma dívida declarada que aparece paga também é vermelha,
para que a lista não apodreça depois de paga.

Medido: **4 medidas** com grupo etário fixado na linha, **1 passa**, **3 na
catraca declarada**.

| medida | grupo | onde está | escreve os limites |
|---|---|---|---|
| `jovens-nem-2025` | 15-29 | o excerto | sim |
| `taxa-de-desemprego-2025` | 15-74 | o `source_url` | não |
| `taxa-de-desemprego-mip-2025` | 15-74 | o `source_url` | não |
| `taxa-de-emprego-2025` | 20-64 | o `source_url` | não |

## A segunda passagem, 22.09.2026

*A regra do diretor desse dia: nada fica para depois. O que a primeira passagem
deixou nomeado fecha-se aqui, sobre o sítio `3b6cbf27` e o motor `f408e1c`. As
duas secções seguintes ficam como foram escritas, e esta diz o que mudou nelas.*

**Nove linhas, e não seis.** Cada uma das três medidas tem, além da sua, a linha
do período anterior e a do agregado da União, pelo mesmo pedido: 3 × 3. Todas
passaram a guarda do `--reescrever`, e mudou **uma linha por ficheiro**, o
`excerpt`: 9 ficheiros, 9 inserções, 9 eliminações. Com as três da primeira
passagem são **12 linhas do livro-razão** com a etiqueta da idade no excerto,
contadas no livro. Nenhum outro ficheiro do livro-razão mudou.

**Sem nota, e a razão é da fonte.** Os títulos dos três quadros são «Unemployment
by sex and age - annual data», «Unemployment rate - annual data» e «Employment
and labour force by sex and age - annual data»: nenhum diz uma idade, logo
nenhum contradiz a série. Onde não há contradição não se escreve uma nota a
explicá-la, e o `--reescrever` ganhou `--sem-nota` para isso. As linhas
`jovens-nem-*` ficam as únicas com a nota, porque são as únicas cujo título diz
uma idade que não é a da série.

**Uma etiqueta a mais, e é da fonte.** As três linhas do emprego trazem também
`Employment indicator: Total employment (resident population concept - LFS)`: é
outra dimensão que o pedido fixa, que não é o total e que o excerto não escrevia.
A regra é a mesma e a palavra é do Eurostat; diz o que está a ser contado, e por
isso fica.

**As definições, lidas do cartão rendido:**

| medida | grupo | |
|---|---|---|
| `taxa-de-desemprego-2025` e `taxa-de-desemprego-mip-2025` | 15-74 | pt: O número de pessoas dos 15 aos 74 anos sem emprego, em percentagem da população ativa. · en: The number of unemployed people aged 15 to 74, as a percentage of the labour force. |
| `taxa-de-emprego-2025` | 20-64 | pt: A percentagem de pessoas dos 20 aos 64 anos com emprego na população comparável. · en: The percentage of employed persons aged 20 to 64 in relation to the comparable total population. |

As duas do desemprego partilham a frase porque partilham a definição e a origem.
O glossário do Eurostat define as duas taxas **sem idade nenhuma**, e define-as
bem: são taxas de qualquer grupo. Quem fixa o grupo é o pedido de cada linha, e é
de lá que os limites vêm, pela etiqueta que o excerto passou a trazer. Nenhuma
palavra do glossário se perdeu; a ordem das palavras da inglesa mudou para
acomodar a idade sem a repetir.

**A catraca ficou vazia e fica viva.** É ela que faz a regra ser «todas as
medidas» e não «as medidas de que alguém se lembrou». Como uma lista vazia não se
pode exercer, passa a entrar por argumento, e a prova exerce as duas metades com
uma lista de mentira: uma medida declarada com a definição estragada **não** dá
vermelho, a mesma medida fora da lista dá dois (um por edição), e uma medida
declarada que passe dá o vermelho da dívida paga. A prova exige também que a
lista em vigor tenha zero entradas.

**No motor.** Os dois sítios de `indicators/enquadramento.py` que compunham o
excerto sem as dimensões (`linha_anterior` e `linha_da_uniao`) passam
`dims=dimensoes_fixadas(js)`. O `js` já estava em mãos nos dois. O cabeçalho do
gerador deixou de dizer que a armadilha existe e passa a dizer o que ela foi e
quem a prova. `indicators/enquadramento_excerto_test.py` guarda a resposta de
`une_rt_a` com `age=Y15-74` e prova as duas linhas com a etiqueta, o controlo sem
recorte, a planta que derruba as duas, e **a contagem lida no ficheiro**: o
número de chamadas a `compor_excerto` tem de ser igual ao número das que passam
`dims`, para que uma terceira chamada não entre em silêncio. Revertida uma das
duas, a suíte dá cinco falhas.

**As conferências desta passagem**, que são as que a mudança toca, cada uma no
seu comando: `ledger:check` **0**, `npm run build` **0**, `check:cartao --prova`
**0** (11 estragos plantados e 11 vistos; 4 medidas com grupo etário na linha, 0
na catraca), `check:pais` **0** (35 medidas, 2 mudanças declaradas, tudo a 0). O
`check:voz` corre dentro da construção: 602 vivas todas rendidas, 546 retiradas
nenhuma rendida. **Os três portões inteiros não correram nesta passagem**: o
lugar de direção acrescenta os registos do bloco e corre-os na cabeça final. No
motor, o `core.gate` do pre-commit: `GATE: PASS`.

## O que a célula apanhou, e que a segunda passagem fechou

**Três medidas tinham o defeito da I129 nas mesmas palavras**, e na primeira
passagem não se fecharam: o excerto das linhas delas não trazia a etiqueta da
idade, só o endereço do pedido a trazia, e escrever os limites na definição sem
reescrever o excerto era publicar uma frase que o recibo ao lado não mostra.
Ficaram na **I132**, nomeadas na catraca. **Na segunda passagem do mesmo dia
fecharam**, pela regra do diretor de que nada fica para depois: nove linhas
reescritas, as três definições com os limites, a catraca vazia. A secção «A
segunda passagem» diz as contagens.

**E a ponta no motor, que era a mesma armadilha.**
`indicators/enquadramento.py` importava `compor_excerto` e chamava-o com cinco
argumentos posicionais nos dois sítios onde escreve a linha do período anterior
e a do agregado da União: uma corrida futura dele recompunha o excerto **sem**
as etiquetas e desfazia tudo isto. Os dois passam `dims=dimensoes_fixadas(js)`
desde a segunda passagem, com um conhecido-positivo que conta as chamadas no
ficheiro para que uma terceira não entre em silêncio.

## O que não mudou, e foi conferido

Nenhum valor, em nenhuma das doze linhas. Nenhum nome oficial se confirmou nem
mudou. O `document.title` de todas fica como o Eurostat o escreve, e nas três
`jovens-nem-*` continua a dizer «aged 15-24». Nenhum ficheiro do livro-razão
além dos doze que o `--reescrever` reescreveu por esta razão. Nenhum ficheiro de
outra corrida do motor entrou em commit nenhum: a árvore principal do motor
continua com `sweeps/state.json` modificado e `.maintenance-locks/`,
`publisher/recortes/manifest.regioes.json` e `sweeps/sweep-2026-09-01.md` por
registar, como estavam. Nenhum `push`.

## Os portões

**Da primeira passagem**, os três inteiros na cabeça `60729ea3`, cada um no seu
comando, com o código lido de um ficheiro acabado de escrever e os `.codigo`
apagados antes: `build` 0, `verify` 0, `typecheck` 0. Os ficheiros `.inicio`,
`.fim`, `.cabeca`, `.codigo` e `.log` de cada um ficam ao lado deste relatório.

**Da segunda passagem**, só as conferências que a mudança toca, ditas na secção
dela. Os três portões inteiros não voltaram a correr aqui: correm na cabeça
final, depois de o lugar de direção acrescentar os registos do bloco. Os
artefactos guardados ao lado são os da primeira passagem e dizem a cabeça em que
correram, que não é a última deste ramo.

No motor, o `python3 -m core.gate` do pre-commit nos dois commits: `GATE: PASS`.
