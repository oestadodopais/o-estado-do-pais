# I129 · O grupo etário dos jovens que não estudam nem trabalham

*Construtor: Claude Opus 5, 22.09.2026, na worktree `jovens-nem-2026-09-22`
sobre `83e9df2d`, e no motor na árvore principal sobre `3cf1ccb`. Três passagens:
a do bloco, a que fechou o que ela deixou nomeado, e a de correção da leitura a
frio do Codex, cada uma na sua secção. O brief é
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
deixou nomeado fecha-se aqui, sobre o sítio `3b6cbf27` e o motor `f408e1c`.*

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

## A passagem de correção, 22.09.2026

*A leitura a frio do Codex (`gpt-5.6-sol`, cinco plantas em cinco) deixou sete
achados reais. Um deles é meu e é grave, e começa por ele.*

### A fixture inventada, e o que a substituiu

A primeira forma de `indicators/enquadramento_excerto_test.py` trazia uma
«resposta guardada» com o endereço e a hora no cabeçalho, como se tivesse sido
lida, e dava **6,4** para o desemprego de 2025. **O Eurostat dá 6,0**, que é o
valor que a linha publica desde sempre e que o painel de 21.09 reconferiu.
Aquele pedido nunca foi feito: os números foram escritos por mim para o teste
passar. A leitura apanhou-o pela aritmética, que é a única maneira de o apanhar
de fora: a mesma resposta não pode dar dois valores ao mesmo período. Nenhuma
linha do livro-razão foi afetada, porque a invenção estava dentro do teste e não
no caminho que escreve as linhas; o que ficou por provar foi precisamente aquilo
que o teste dizia provar.

**O que a substituiu.** Uma fixture deixa de ser uma cadeia escrita num teste. As
oito respostas aos oito pedidos que este bloco reescreveu foram pedidas ao
Eurostat pelo cliente da casa, um pedido de cada vez, e estão em
`indicators/out/i129-2026-09-22/`, byte a byte, com `pedidos.jsonl` ao lado
(endereço, hora, http, sha256, bytes, `updated`).
As mesmas oito ficam também em `indicators/fixtures/i129-2026-09-22/`, cada uma
com a proveniência dentro do próprio ficheiro, que é o que a célula nova do
portão confere (secção seguinte). `indicators/respostas_guardadas.py` é o único
caminho por onde um teste lhes toca, e **recalcula o `sha256` sobre o corpo**:
uma resposta mexida num dígito levanta `RespostaAdulterada` e fecha a suíte. Truncar uma série aos
períodos que um teste usa passa a ser código (`so_periodos()`, que recalcula os
índices a partir da resposta inteira), nunca caneta. A resposta da União é a
resposta da União, pedida ao endereço `geo=EU27_2020`, e não a de Portugal com a
etiqueta trocada, que era como a primeira forma a fabricava.

| resposta | hora UTC (22.09.2026) | http | bytes | sha256 |
|---|---|---|---|---|
| `tipslm90-PT` | 11:25:42 | 200 | 5642 | `de9b533f6c268337ccae416ce7037ecf2ac92b6b383e4caef3b3e7d3d352c6ef` |
| `tipslm90-UE` | 11:25:42 | 200 | 5696 | `c298c89280f0731290ea56ed7113c4225505050d689b71c112789b294b690434` |
| `une_rt_a-PT` | 11:25:44 | 200 | 3910 | `06c3706066bb48e0003a784c5e3c97e82c3aefbbee1b17942d458cd3e255cb23` |
| `une_rt_a-UE` | 11:25:46 | 200 | 3955 | `b952f5f274b840607b27b7e918a80f3f1276487795ae83942247994be71adc33` |
| `tipsun20-PT` | 11:25:48 | 200 | 5470 | `6f2112b6ef0177bec5ec3922267b64680571f9646a235e9726f3869f9e4bc28f` |
| `tipsun20-UE` | 11:25:50 | 200 | 5515 | `6be289537602817a6b6dfd21e7e54c32c4f015e4a040465431daa0e0cb74760e` |
| `lfsi_emp_a-PT` | 11:25:52 | 200 | 4109 | `f86eb85fdc6f6f972afd7c05ac78b5fab1f69d0d3860d2b823d0977f34d38ab6` |
| `lfsi_emp_a-UE` | 11:25:54 | 200 | 4156 | `2f136724e11943ee664c34674174e6a2aaa294c55765d259239095cbf2a16ece` |

Os valores que estas respostas dão para 2024 e 2025 são, um a um, os que as doze
linhas publicam. Conferido pelo guião, não de cabeça: 8,7 e 8,0 (jovens NEM PT),
11,0 (UE), 6,5 e 6,0 (desemprego PT), 6,0 (UE), 78,5 e 79,6 (emprego PT), 76,1
(UE).

### A célula nova do portão do motor

O erro não foi só meu: foi possível. Uma frase num cabeçalho não é proveniência,
é uma afirmação sobre proveniência, e nada no motor distinguia as duas. O portão
(`core.gate`) passa a ter a célula **`fixtures`**, em dois sítios: um passo sobre
a árvore (`GATE  fixtures`) e uma suíte de plantas
(`GATE  proveniencia_das_fixtures_test`).

A regra: um JSON que um teste leia como resposta de uma fonte traz `endereco`,
`lido_em`, `cliente`, `sha256` e `corpo`, e o portão **recalcula o resumo sobre o
corpo**. Uma fixture sintética continua a poder existir, porque há coisas que só
se provam com um corpo que nenhuma fonte dá, mas declara `sintetica: true` e a
`razao`, e **não pode anunciar-se com as palavras de uma resposta real**
(«guardada», «resposta de <data>»), que foi exactamente a frase que o erro usou.

Onde se aplica: `indicators/fixtures/`, que é a declaração, e qualquer outro JSON
debaixo de `indicators/` que uma suíte nomeie **por caminho**. Por caminho e não
pelo nome, e isto mediu-se: `state.json` contém «te.json», e três suítes de
`core/` escrevem um `ledger.json` temporário que nada tem a ver com
`indicators/coverage/ledger.json`. Casar pelo nome dava duas queixas falsas e
nenhuma verdadeira. Fora da regra: `indicators/out/`, que é o arquivo em bruto
das corridas, e os ficheiros de outras corridas que não se tocam.

As oito respostas passaram a `indicators/fixtures/i129-2026-09-22/` com esse
cabeçalho; o arquivo em bruto e o `pedidos.jsonl` ficam onde estavam.

A saída da suíte:

```
PASS — 18 conferências: oito plantas a morder, dois controlos a passar, e as 8
fixtures do repositório com a proveniência provada pelo resumo do corpo.
```

As plantas: o `sha256` que não bate com o corpo; um ficheiro sem cabeçalho a
dizer-se «a resposta guardada de 22.09.2026»; uma sintética a anunciar-se como
real; uma sintética sem razão; uma sintética com campos de proveniência; a hora
sem fuso; o cliente vazio; o endereço que não é um pedido. Os dois controlos: uma
fixture provada e uma sintética honesta, que têm de passar. E a planta que
importa correu contra a árvore a sério: **o mesmo 6,0 para 6,4 que começou isto
fecha agora o passo do portão** (`FAIL — 1 queixa(s) em 8 fixture(s)`) e a suíte.

### Os outros achados, cada um com a sua planta

| achado | o que mudou | a planta que o prova |
|---|---|---|
| **6**, a K13 | Corre sobre **as linhas** do livro-razão e não sobre as definições, juntando-as por medida (o período anterior e o agregado leem-se debaixo da definição da âncora); compara a etiqueta do excerto com o filtro `age=` quando existem os dois; e exige o intervalo escrito **como intervalo** e não dois algarismos soltos | cinco: o limite trocado; dois algarismos soltos fora do intervalo («entre 15 concelhos e 29 freguesias»); uma medida sem definição nenhuma; a etiqueta a contradizer o filtro; duas linhas da mesma medida com grupos diferentes |
| **7**, a catraca | A asserção de que a lista em vigor está vazia saiu de dentro do `if (PROVA)` e corre em toda a corrida | uma entrada na lista em vigor fecha o `check:cartao` normal, sem `--prova` (medido: código 1) |
| **8**, a guarda | `reescrever()` confere também o `value` (pelo número, porque «11,0» e «11» são o mesmo) e a `unit` da linha contra a resposta, e não só o excerto | um `value` de 79,8 que a resposta não dá; uma `unit` trocada; e dois controlos, «8» e «8,0», que têm de passar |
| **10**, o `--write` | `escrever_linha` passa a levar as **correcções** para a linha nova, como já levava as reconferências, e recusa-se se o corpo novo não tiver onde as pôr | uma linha com uma correcção reescrita sem a perder; o controlo de uma linha sem correcções; e a recusa |
| **9**, as respostas | Resolvido pelo que está em cima: as oito respostas e o `pedidos.jsonl` | o `sha256` de cada uma, conferido à leitura |

Cada uma foi exercida ao contrário antes de se fechar: embotada a metade nova, a
suíte dá o vermelho com o nome («A PLANTA NÃO MORDEU», «A GUARDA NÃO MORDEU»,
«K13 NÃO MORDEU»), e reposta volta a verde.

### O achado 12, que não era para corrigir

A leitura diz que o relatório soma 9 + 3 e escreve 15. **No ramo ele escreve
12**, que é a conta certa, e o `pacote.plantas.json` regista a P3 como um estrago
plantado em `relatorio-construtor.md`. O achado é uma das cinco plantas, e não há
nada a corrigir. Fica dito porque o guião desta passagem pedia as duas coisas ao
mesmo tempo.

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
