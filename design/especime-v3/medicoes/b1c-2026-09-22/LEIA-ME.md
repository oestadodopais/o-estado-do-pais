# B1c · «O que mudou» no seu lugar

Construtor: Claude Opus 5, 22.09.2026, na worktree `oquemudou-2026-09-22`, sobre `main` em `83e9df2d`.\
Brief: `design/observatorio/BRIEF-B1c-o-que-mudou-no-seu-lugar.md`.\
Duas passagens: a construção, e a passagem curta da tarde, depois da leitura do lugar de direção. As contagens e as capturas deste ficheiro são as da segunda; o que a primeira mediu e o que mudou entre as duas está na última secção.

## O que se mediu antes, e duas coisas que o brief diz e a medição desmente

A medição de partida foi feita sobre `main` em `83e9df2d`, com `npm run build` a 0.

| O que | Medido em `dist/`, por edição |
| --- | ---: |
| Linhas de «O que mudou» na página do país | **30** (1 mudança do projeto, 13 publicações, 16 correções) |
| Dessas 16 correções, de uma medida do país | **0** |
| Linhas de «O que mudou» na página de Évora | **10** |
| Linhas datadas em `/correcoes` | **16** (3 correções, 13 atualizações), mais 9 de proveniência |
| Definições do marcador `[a verificar]` na página do país | **1**, para 6 marcadores |

**O §0 do brief diz que `/correcoes` «tem zero linhas datadas: é o canal e a norma, não um registo». Não é o que lá está.** A página já tinha o registo, com 16 linhas datadas em dois grupos (`RegistoCorrecoes.astro`), mais a contagem das revisões de proveniência. O que lhe faltava era o que o mandato 3 pede e este bloco fez: as outras duas classes de mudança e o lugar de cada linha. A data de cada entrada rendia-se num `<span class="log-data">` e não num `<time>`, o que explica uma contagem de zero feita por elementos `<time>`.

**O §0 diz também que «cada linha de correção com marcador repete a definição do marcador por baixo». Não repete.** A definição rende-se uma vez por página desde 14.09.2026 (`src/lib/uma-vez-por-pagina.mjs`, `DefinicaoDoMarcador.astro`), e a célula §7.10 do `check:lugar` **exige** que seja uma só e que venha logo a seguir ao PRIMEIRO marcador na ordem do documento. Medido em `dist/`: a página do país tinha 6 marcadores e 1 definição, Évora 7 e 1, `/correcoes` 9 e 1. O mandato 4 pedia a contagem de definições por página; ela era 1 antes e é 1 depois, e a página do país deixou de ter marcadores porque deixou de ter linhas de correção. **Não se mexeu na definição**: pô-la «por baixo da lista» partiria a §7.10, que mede a ordem do documento, e não havia nada para corrigir.

## O que ficou feito

| # | O que | A medida |
| --- | --- | --- |
| 1 | O âmbito das três listas numa função só, `src/lib/mudancas.mjs` | as três listas contadas em `dist/`, na tabela abaixo |
| 2 | O teto de oito e a porta «Todas as mudanças» / «All changes» na página do país e nas de lugar | 1 linha na página do país e 8 em Évora, nas duas edições; uma porta por página |
| 3 | O registo em `/correcoes` e `/en/corrections`, por data, com o lugar de cada linha e a sua porta | 30 linhas por edição, 30 portas de lugar; a norma, o canal e as revisões de proveniência intactos |
| 4 | A definição do marcador uma vez por página | 1 por página, antes e depois |
| 5 | As três células novas do `check:pais` com plantas | `plantas-b1c.json`, 21 provas |
| 6 | O inventário, as listas fechadas do `check:voz` e o mapa do repositório | `check:voz` a 0 |
| 7 | Relatório, capturas e os três portões | este ficheiro, `capturas-b1c.json`, os `.codigo` |

### As contagens

| Página | Antes | Depois da construção | Depois da passagem da tarde |
| --- | ---: | ---: | ---: |
| País (`/`, `/en`) | 30 | 8 (1 mudança do projeto, 7 publicações) | **1** (a mudança do projeto de 21.09) |
| Évora (`/municipios/evora`, `/en/municipalities/evora`) | 10 | 8 | **8** |
| Registo (`/correcoes`, `/en/corrections`) | 16 linhas datadas | 30 | **30** (1 mudança do projeto, 13 publicações, 16 correções) |

As 16 correções do livro-razão inteiro, as 13 publicações do arquivo e a mudança declarada do projeto estão todas no registo, e a célula A3 fecha a construção se faltar ou sobrar uma. Nenhuma linha foi inventada e nenhuma foi apagada: o que saiu da primeira página está no registo, com a porta para o lugar a que pertence.

Os três lugares que o registo nomeia, com a porta de cada um: **Portugal → `/`**, **Évora → `/municipios/evora`**, **Alentejo → `/regioes/alentejo`**.

### Duas consequências que o lugar de direção deve ler

1. **A página do país ficou sem nenhuma linha de correção.** Das 16 entradas do livro-razão, nenhuma é de uma medida de `DOMINIO_DAS_MEDIDAS` nem de uma das sete linhas que a leitura do país cita: são dez do PRR de Évora, quatro da contagem dos estudos sobre Évora e duas do PIB por habitante do Alentejo. Pelo âmbito que o brief escreve, nenhuma pertence à página do país. O que lá fica são sete publicações e a mudança declarada de 21.09 — e **três dessas sete publicações são exactamente os três estudos que a secção «Estudos recentes», logo acima, já mostra**. A repetição é a que o §0 do brief apontava nas treze publicações, reduzida de treze para sete, e o teto não a resolvia. **O lugar de direção decidiu-a nessa tarde e as publicações saíram da página do país**; a decisão e o que ela mudou estão na penúltima secção.
2. **A página do país a 1 280 px encurtou de 6 695 px (medida da segunda passagem da peça 3) para 5 166 px.** São 22 linhas a menos. Com a decisão da tarde ficou em 4 791 px.

### O lugar de uma linha

O lugar lê-se de declarações que já existiam, todas lidas e nenhuma escolhida por ordem: a região que nomeia a linha (`src/data/regioes.mjs`), o estudo que declara o objeto (`WORKS[].subject`), o concelho que a rende no seu relance (`src/data/municipios.mjs`), e a tabela das medidas do país com as sete linhas da leitura. Duas declarações que discordem fecham a construção. Medido: as 22 linhas que as regiões nomeiam e as 2 464 que os concelhos rendem não se cruzam entre si nem com `DOMINIO_DAS_MEDIDAS`, e nenhuma linha de relance é rendida por dois concelhos.

Uma linha não alcançada por nenhuma dessas declarações fecha a construção, e por isso há uma tabela para elas, `src/data/lugar-das-linhas.mjs`, com uma entrada e a razão escrita: `estudos-evora-publicados`, cujo campo `study` é `o-estado-do-pais` (uma origem interna, não um trabalho do arquivo, e por isso sem objeto declarado) e que conta os trabalhos cujo objeto é o município de Évora. É de Évora, e é uma das dezasseis que o diretor leu na página do país.

## As células, e o que cada uma protege

| Célula | Antes | Agora | Planta a morder |
| --- | --- | --- | --- |
| `check:pais` **A1** | não existia | uma linha fora do âmbito da sua página fecha a construção; o âmbito é lido das declarações, sem chamar a função que compõe a página. Desde a tarde de 22.09, uma PUBLICAÇÃO na página do país também fecha | uma linha de correção de Évora posta na lista do país: código 1. Uma publicação copiada do registo para a lista do país: código 1. A lista de Évora declarada de outro lugar: código 1 |
| `check:pais` **A2** | não existia | mais do que oito linhas numa lista, ou fora da ordem, fecham | uma linha duplicada na lista do país: código 1 |
| `check:pais` **A3** | não existia | o registo tem exactamente as entradas do livro inteiro, as publicações do arquivo e as mudanças declaradas, e cada mudança declarada uma vez | uma linha retirada do registo: código 1 |
| `check:pais` **C1** | contava as linhas de correção da primeira página contra o livro INTEIRO | a contagem contra o livro passou para a A3, no registo; a C1 continua a exigir que cada linha nasça de uma entrada inteira do livro, com o índice e a data, e a correr agora sobre **todas** as listas medidas, e não só sobre a primeira página | um índice que não existe no livro: código 1 |
| `check:pais` **M3** | as três marcas do mesmo `n` na lista do país | as mesmas marcas, do mesmo `n` e da mesma linha, sem campo repetido e sem campo que não seja do registo, com a data, o valor antigo e o valor novo entre elas; em todas as listas medidas. Eram «exactamente três» porque a lista do país só rendia três campos; o registo rende também o motivo, a natureza e o id | o valor antigo igual ao novo: código 1 |
| `check:pais` **M2** | cada mudança declarada exactamente uma vez na primeira página | a presença de todas passou para a A3, no registo, porque a primeira página tem teto; na primeira página, se estiver, coincide com a declaração e não se repete | o texto da mudança alterado: código 1 |
| `gate:html`, marcas das mudanças | só na rota `home` | nas rotas `home` e `correcoes`, com a mesma comparação contra `datas-de-publicacao.json` e `MUDANCAS_DO_PROJETO` | a marca numa terceira rota: código 1 (`B1 mudança: campo fora da página do país e do registo`) |
| `gate:html`, unidade de uma correção | só na rota `home`, que ficou sem linhas de correção | nas rotas `home` e `correcoes`, com a mesma comparação contra a linha da própria entrada | a unidade trocada no registo: código 1 |
| `design:feixe`, a peça da correção | lia a linha por `.log-linha`, a classe da tabela de quatro colunas | lê-a pela linha de correção da lista única do registo | as linhas de correção retiradas do registo: código 1 (`não encontrei ".registo-mudanca…"`) |
| `check:lugar` **§7.10** | não se tocou | não se tocou | — |

Nenhum portão desceu no que protege. A C1, a M3 e a M2 passaram a medir mais superfície do que mediam: a C1 e a M3 corriam sobre uma lista e correm agora sobre quatro (o país nas duas edições e Évora nas duas) mais os dois registos.

### As provas

`node tests/pais/pais.mjs --json design/especime-v3/medicoes/b1c-2026-09-22/plantas-b1c.json`: **21 provas, todas a morder** ([plantas-b1c.json](plantas-b1c.json)). Uma delas é o positivo conhecido («páginas sem estrago», código 0); as outras vinte fecham a construção com a célula esperada. As quatro rotas que o ficheiro copiava passaram a oito: sem o registo e sem uma página de lugar, a régua não media nenhuma das listas novas.

`OEDP_MEDICOES=… node tests/pais/portoes.mjs --only html`, `--only html-mudanca-fora-de-rota` e `--only feixe-correcao`: as três a morder ([plantas-portoes-html.json](plantas-portoes-html.json), [plantas-portoes-html-mudanca-fora-de-rota.json](plantas-portoes-html-mudanca-fora-de-rota.json), [plantas-portoes-feixe-correcao.json](plantas-portoes-feixe-correcao.json)), com os sha256 de cada ficheiro antes e depois da reposição iguais.

O `check:pais` traz dois positivos conhecidos novos, para que zero nunca seja verde: uma corrida sem nenhuma lista de mudanças medida falha, e uma que não encontre exactamente dois registos falha.

## As cadeias e o inventário

O inventário ganha quatro linhas (o título e a nota da lista única do registo, nas duas edições) e perde seis. Quatro ficam `retirada` com a razão escrita: as duas notas dos grupos antigos, nas duas edições. Duas **saem do ficheiro**, pela mesma regra que a peça 3 aplicou a «Tema» e a «· concelhos»: «Atualizações» e «Updates» deixaram de ser um bloco seu, mas continuam dentro da nota das revisões de proveniência, que está viva na mesma página, e uma palavra não se proíbe por causa da frase que a contém. «Correções» e «Corrections» ficam vivas porque o rodapé as rende.

A lista fechada do `check:voz` ganha o rótulo novo e a porta composta (`Todas as mudanças →`, `All changes →`), nas duas réguas (`voz-pais.mjs` e `voz-b1.mjs`). O rasto da revisão fica em `design/especime-v3/critica/REVISOES-DO-INVENTARIO.md`, no bloco `b1c`, com a leitura `por ler`.

Saíram de `strings.mjs`, com a tabela de quatro colunas que os pedia: os quatro cabeçalhos de coluna, os dois títulos de grupo, as duas notas de grupo, a frase do registo vazio e os dois prefixos que só um leitor de ecrã ouvia. Os dois prefixos existiam porque os dois valores viviam em células separadas, sem nada entre eles; na lista única a seta está no texto e não é `aria-hidden`, e a ordem ouve-se, como já se ouvia na primeira página desde 21.09.

## As capturas

Oito, em [capturas/b1c-2026-09-22](../../capturas/b1c-2026-09-22/): a primeira página e o registo, a 390 e a 1 280, nas duas edições. Guião: [captar-b1c.mjs](captar-b1c.mjs); manifesto com os sha256: [capturas-b1c.json](capturas-b1c.json).

| Captura | Altura | Deslocamento lateral | Linhas | Portas de lugar |
| --- | ---: | ---: | ---: | ---: |
| `depois-pais-pt-390` | 6 197 px | 0 | 1 | — |
| `depois-pais-pt-1280` | 4 791 px | 0 | 1 | — |
| `depois-pais-en-390` | 6 250 px | 0 | 1 | — |
| `depois-pais-en-1280` | 4 880 px | 0 | 1 | — |
| `depois-registo-pt-390` | 9 966 px | 0 | 30 | 30 |
| `depois-registo-pt-1280` | 9 375 px | 0 | 30 | 30 |
| `depois-registo-en-390` | 10 061 px | 0 | 30 | 30 |
| `depois-registo-en-1280` | 9 270 px | 0 | 30 | 30 |

Zero deslocamentos laterais, nenhum valor ou selo partido, nenhum selo sem `nowrap`, a porta «Todas as mudanças» uma vez em cada página do país, e uma definição do marcador em cada página que tem marcador. As quatro da página do país foram refeitas na passagem da tarde; as quatro do registo são os mesmos bytes, conferidos por sha256 contra o manifesto anterior.

## Os commits

Dez, por caminhos explícitos, com os dois trailers num bloco contíguo. Os três portões inteiros correram na cabeça `dee436cf`, que é a do sétimo; o oitavo guarda os registos deles, e a passagem da tarde ficou nos dois últimos. É o lugar de direção que corre os três portões na cabeça final.

## A passagem de 22.09.2026, depois da leitura do lugar de direção

O lugar de direção leu a construção e decidiu duas coisas. As duas correções ao §0 do brief ficam registadas como erros de medição dele: contou `<time>` onde a data era um `<span>`, e leu uma definição repetida onde havia uma só.

**As publicações saem de «O que mudou» na página do país.** A secção «Estudos recentes», logo acima, é a notícia dos estudos, e a página dos estudos tem-nos todos; repeti-los como mudanças é o que o diretor apontou, reduzido de treze para sete. A página do país fica com as correções das suas linhas e as mudanças declaradas do projeto, no máximo oito, com a mesma porta «Todas as mudanças» para o registo, onde as treze publicações continuam com a sua data. Hoje dá **uma linha**, a mudança declarada de 21.09 («Sete nomes do INE…»), e amanhã duas, com a I129, que está a aterrar noutro ramo com a sua mudança declarada. É o que mudou no país, e uma linha honesta vale mais do que sete repetidas.

A célula **A1 passa a recusar uma publicação na página do país**, com planta: uma linha de publicação copiada do registo para a lista do país dá código 1. A **A3 não muda**: o registo continua a exigir as 16 entradas do livro, as 13 publicações e a mudança declarada, nem uma a mais nem uma a menos, e é a célula que garante que nada se perdeu no caminho.

**As páginas de região e de distrito não ganham «O que mudou» neste bloco**, e é decisão do lugar de direção: as duas correções do PIB por habitante do Alentejo ficam no registo, com a porta para `/regioes/alentejo`, e a secção nessas páginas faz-se no B3, que as refaz pela mesma gramática.

O que a passagem mediu, em `dist/`, nas duas edições: a lista do país passou de 8 linhas para **1**; Évora ficou nas mesmas **8**; o registo ficou nas mesmas **30**. A altura da página do país a 1 280 px passou de 5 166 para **4 791 px** (en: de 5 255 para 4 880). As quatro capturas da página do país foram refeitas; as quatro do registo são byte a byte as mesmas.

**As conferências desta passagem, e só as que a mudança toca:** `npm run build` inteiro (código 0, e com ele o `check:pais` e o `check:voz` na cadeia), as **21 plantas** de `tests/pais/pais.mjs` (todas a morder, incluindo a nova da A1), e a planta `html` de `tests/pais/portoes.mjs`, que mudou de página com a marca da data de publicação e continua a morder. **Os três portões inteiros não correram nesta cabeça**: o lugar de direção acrescenta os registos da sessão e corre-os na cabeça final.

## Conferência final

Os três comandos completos, cada um no seu comando, na mesma cabeça `dee436cf`, com o código lido de um ficheiro acabado de escrever. Os `.codigo` foram apagados antes da corrida, e cada comando guarda também `.log`, `.inicio`, `.fim` e `.cabeca`, em [portoes/](portoes/). Horas em UTC.

| Comando completo | Código lido do ficheiro | Início | Fim | Cabeça medida |
| --- | ---: | --- | --- | --- |
| `npm run build` | 0 | 2026-09-22T11:06:54Z | 2026-09-22T11:11:37Z | `dee436cf` |
| `npm run verify` | 0 | 2026-09-22T11:11:37Z | 2026-09-22T11:19:18Z | `dee436cf` |
| `npm run typecheck` | 0 | 2026-09-22T11:19:18Z | 2026-09-22T11:19:18Z | `dee436cf` |

Houve uma corrida anterior, na cabeça `820ed629`, com `build` a 0 e `verify` a **1**: o `design:feixe`, o último passo da cadeia, lia a peça da correção por `.log-linha`, a classe da tabela que saiu com as duas listas do registo. A correção e a sua planta ficaram em `dee436cf`, e as três cadeias correram inteiras outra vez nessa cabeça. Fica dito em vez de escondido.

Não se esperou por nenhuma outra construção desta máquina: as três corridas encontraram a máquina livre. Nenhum `push`, nenhum `checkout` noutra árvore, nenhum `git add -A`.
