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

## O que a célula apanhou e este bloco não fechou

**Três medidas têm o defeito da I129 nas mesmas palavras**, e não se fecharam
aqui. A razão é do livro-razão e não de tempo: o excerto destas linhas **não
traz** a etiqueta da idade, só o endereço do pedido a traz, e o excerto de uma
linha reescreve-se pelo gerador do motor. Escrever os limites na definição sem
reescrever o excerto era publicar uma definição que a linha ao lado dela não
mostra, e o brief fechou o livro-razão em três ficheiros. Ficam na **I132**,
nomeadas na catraca, com o grupo que cada uma fixa. A catraca só encolhe.

**E uma ponta no motor.** `indicators/enquadramento.py` importa `compor_excerto`
e chama-o com cinco argumentos posicionais nos dois sítios onde escreve a linha
do período anterior e a do agregado da União. As duas linhas foram reescritas
por `--reescrever`, mas uma corrida futura de `enquadramento.py --write` volta a
compor o excerto **sem** as etiquetas e desfaz a correcção. Falta passar
`dims=dimensoes_fixadas(js)` nessas duas chamadas, e o `js` já está em mãos nas
duas. Fica dito no cabeçalho de `generate_claims.py`, onde quem lá voltar o vê.
Não se tocou em `enquadramento.py`: o brief fechou o motor no gerador e no seu
teste.

## O que não mudou, e foi conferido

Nenhum valor. Nenhum nome oficial se confirmou nem mudou. O `document.title` das
três linhas fica como o Eurostat o escreve, com «aged 15-24». Nenhum ficheiro de
outra corrida do motor entrou no commit: a árvore principal do motor continua com
`sweeps/state.json` modificado e `.maintenance-locks/`,
`publisher/recortes/manifest.regioes.json` e `sweeps/sweep-2026-09-01.md` por
registar, como estavam.

## Os portões

Os três na cabeça final, cada um no seu comando, com o código lido de um ficheiro
acabado de escrever e os `.codigo` apagados antes. Os ficheiros `.inicio`,
`.fim`, `.cabeca`, `.codigo` e `.log` de cada um ficam ao lado deste relatório.
No motor, o `python3 -m core.gate` do pre-commit: `GATE: PASS`.
