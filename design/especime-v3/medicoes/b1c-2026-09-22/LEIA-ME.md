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
| 2 | O teto de oito e a porta «Todas as mudanças» / «All changes» na página do país e nas de lugar | 2 linhas na página do país e 8 em Évora, nas duas edições; uma porta por página |
| 3 | O registo em `/correcoes` e `/en/corrections`, por data, com o lugar de cada linha e a sua porta | 30 linhas por edição, 30 portas de lugar; a norma, o canal e as revisões de proveniência intactos |
| 4 | A definição do marcador uma vez por página | 1 por página, antes e depois |
| 5 | As três células novas do `check:pais` com plantas | `plantas-b1c.json`, 26 provas, mais a da catraca L1 em `plantas-portoes-lugar-marcador-de-titulo.json` |
| 6 | O inventário, as listas fechadas do `check:voz` e o mapa do repositório | `check:voz` a 0 |
| 7 | Relatório, capturas e os três portões | este ficheiro, `capturas-b1c.json`, os `.codigo` |

### As contagens

| Página | Antes | Depois da construção | Depois da passagem da tarde |
| --- | ---: | ---: | ---: |
| País (`/`, `/en`) | 30 | 8 (1 mudança do projeto, 7 publicações) | **1** (a mudança do projeto de 21.09) |
| Évora (`/municipios/evora`, `/en/municipalities/evora`) | 10 | 8 | **8** |
| Registo (`/correcoes`, `/en/corrections`) | 16 linhas datadas | 30 | **30** (1 mudança do projeto, 13 publicações, 16 correções) |

Depois do rebase sobre o `main` com a I129, que traz uma mudança declarada nova, os números do ramo são **2** na página do país, **8** em Évora e **31** no registo (2 mudanças do projeto, 13 publicações, 16 correções). A última secção diz o resto.

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
| `depois-pais-pt-390` | 6 411 px | 0 | 2 | — |
| `depois-pais-pt-1280` | 4 955 px | 0 | 2 | — |
| `depois-pais-en-390` | 6 465 px | 0 | 2 | — |
| `depois-pais-en-1280` | 5 023 px | 0 | 2 | — |
| `depois-registo-pt-390` | 10 028 px | 0 | 31 | 31 |
| `depois-registo-pt-1280` | 9 537 px | 0 | 31 | 31 |
| `depois-registo-en-390` | 10 170 px | 0 | 31 | 31 |
| `depois-registo-en-1280` | 9 432 px | 0 | 31 | 31 |

Zero deslocamentos laterais, nenhum valor ou selo partido, nenhum selo sem `nowrap`, a porta «Todas as mudanças» uma vez em cada página do país, e uma definição do marcador em cada página que tem marcador. As oito foram refeitas na cabeça rebaseada, `59c27b5b`, e é essa que o manifesto nomeia.

## Os commits

Dez, por caminhos explícitos, com os dois trailers num bloco contíguo. Os três portões inteiros correram na cabeça `dee436cf`, que é a do sétimo; o oitavo guarda os registos deles, e a passagem da tarde ficou nos dois últimos. É o lugar de direção que corre os três portões na cabeça final.

## A passagem de 22.09.2026, depois da leitura do lugar de direção

O lugar de direção leu a construção e decidiu duas coisas. As duas correções ao §0 do brief ficam registadas como erros de medição dele: contou `<time>` onde a data era um `<span>`, e leu uma definição repetida onde havia uma só.

**As publicações saem de «O que mudou» na página do país.** A secção «Estudos recentes», logo acima, é a notícia dos estudos, e a página dos estudos tem-nos todos; repeti-los como mudanças é o que o diretor apontou, reduzido de treze para sete. A página do país fica com as correções das suas linhas e as mudanças declaradas do projeto, no máximo oito, com a mesma porta «Todas as mudanças» para o registo, onde as treze publicações continuam com a sua data. Hoje dá **uma linha**, a mudança declarada de 21.09 («Sete nomes do INE…»), e amanhã duas, com a I129, que está a aterrar noutro ramo com a sua mudança declarada. É o que mudou no país, e uma linha honesta vale mais do que sete repetidas.

A célula **A1 passa a recusar uma publicação na página do país**, com planta: uma linha de publicação copiada do registo para a lista do país dá código 1. A **A3 não muda**: o registo continua a exigir as 16 entradas do livro, as 13 publicações e a mudança declarada, nem uma a mais nem uma a menos, e é a célula que garante que nada se perdeu no caminho.

**As páginas de região e de distrito não ganham «O que mudou» neste bloco**, e é decisão do lugar de direção: as duas correções do PIB por habitante do Alentejo ficam no registo, com a porta para `/regioes/alentejo`, e a secção nessas páginas faz-se no B3, que as refaz pela mesma gramática.

O que a passagem mediu, em `dist/`, nas duas edições: a lista do país passou de 8 linhas para **1**; Évora ficou nas mesmas **8**; o registo ficou nas mesmas **30**. A altura da página do país a 1 280 px passou de 5 166 para **4 791 px** (en: de 5 255 para 4 880). As quatro capturas da página do país foram refeitas; as quatro do registo são byte a byte as mesmas.

**As conferências desta passagem, e só as que a mudança toca:** `npm run build` inteiro (código 0, e com ele o `check:pais` e o `check:voz` na cadeia), as **21 plantas** de `tests/pais/pais.mjs` (todas a morder, incluindo a nova da A1), e a planta `html` de `tests/pais/portoes.mjs`, que mudou de página com a marca da data de publicação e continua a morder. **Os três portões inteiros não correram nesta cabeça**: o lugar de direção acrescenta os registos da sessão e corre-os na cabeça final.

## A passagem de correção, 22.09.2026

A leitura a frio (Codex `gpt-5.6-sol`, cinco estragos plantados só nas cópias do pacote, os cinco apanhados) deixou três achados reais que este ramo consertou. Os outros são as plantas e as suas consequências, o brief antigo contra a decisão da tarde, ou o pacote; o lugar de direção triou-os.

### 1 · A proveniência de um título não se perde no registo (achado 4)

**A instrução do lugar de direção contradizia o código em dois pontos, e a medição está aqui.** (a) O registo **já** rendia cada título por `TituloDeTrabalho`, desde a construção (`RegistoCorrecoes.astro`). (b) `TituloDeTrabalho` **não levava marca nenhuma**: punha `data-nonledger="titulo-de-estudo"` e o `lang` do texto, e mais nada. Medido: `titleUnverified` aparece três vezes em `src/data/studies.mjs` (duas declarações e uma menção num comentário) e **não é lido em parte nenhuma do código**. O defeito era portanto maior do que o achado dizia: uma incerteza declarada que o sítio não mostrava em página nenhuma.

O que se fez: a marca passa a viver em `TituloDeTrabalho`, que é onde o próprio ficheiro diz que a marca e a língua vivem, atrás de uma propriedade explícita. **Não se deriva da cadeia**, e a razão está nas duas edições que a declaram: o título inglês dos dois estudos da água é, carácter a carácter, o título português, e uma marca decidida pelo texto marcaria as duas. Quem rende o título de uma edição passa `naoConfirmado={edicao.titleUnverified}`, e é o registo que o passa.

Medido em `dist/`: o registo inglês rende **2** publicações com `[a verificar]` («Água Não Faturada» e «Onde está a água?»), de 13; o português rende **0**, que é o certo, porque as edições portuguesas não estão por confirmar.

**A célula A4** confere cada linha de publicação do registo contra o arquivo: o texto do título, a marca da língua que `linguaDoTitulo()` lhe dá, e o marcador presente **se e só se** o arquivo declarar `titleUnverified`. **A planta:** o marcador retirado de uma publicação inglesa dá código 1.

**O que fica por fazer, e é uma falta dita e não uma decisão:** as outras vistas que rendem um título de edição (o arquivo, a primeira página, a página de um lugar) continuam a rendê-lo sem marca. Não se alargou aqui porque o marcador é uma PORTA para `/a-verificar`, e acrescentá-lo a 14 páginas mexe na catraca L1 do `check:lugar`, que tem teto medido e é conta do lugar de direção.

**A outra metade do achado 4 não era defeito, e o que estava errado era um comentário.** «publicado a» é, desde o bloco F1.4b de 04.09.2026 (`DECISIONS.md` §1.99), o dia em que o ficheiro da edição entrou neste repositório, lido de `src/data/datas-de-publicacao.json`, e é o mesmo dia em toda a parte. O cabeçalho de `src/data/studies.mjs` dizia só «nenhuma data de publicação está confirmada» sem dizer de onde vem a data que o leitor vê, e a nota do estudo das penalizações dizia que ele «não foi publicado» quando o sítio o publica e o data. Os dois comentários passam a dizer o que a §1.99 decidiu e onde a data vive. **Nenhuma data mudou**, e nenhum valor mudou.

### 2 · O lugar de uma linha confere-se por duas vias (achado 6, a primeira metade)

O compositor e a régua devolviam a declaração explícita de `lugar-das-linhas.mjs` antes de tudo: uma régua que lê a mesma declaração que a página lê não é uma segunda leitura. A régua passa a **derivar** o lugar por conta própria — do estudo que a linha declara e dos segmentos do seu identificador contra os slugs da Carta — e a **comparar** com a declaração. Uma declaração que contradiga a derivação fecha a construção, e cada entrada da tabela explícita tem de derivar o lugar que declara, o que é o conhecido-positivo da comparação: sem ele, uma tabela que nunca derivasse nada passava por não haver nada com que discordar.

Medido sobre o livro inteiro: **2 863 das 2 975 linhas** derivam um lugar do identificador; as sete linhas da leitura do país e as medidas de `DOMINIO_DAS_MEDIDAS` não derivam nenhum, e por isso a comparação não as toca; há **uma** ambiguidade (`distancia-setubal-grande-lisboa-2024`, que nomeia dois lugares), que nunca chega a uma lista de mudanças e que a régua diz em vez de escolher.

A **A3** passa a conferir, linha a linha do registo, o lugar escrito e a porta dele, compostos na régua a partir da Carta e das rotas, e não lidos da vista. **As plantas:** `estudos-evora-publicados` declarado como `portugal` dá A1, código 1; uma porta do registo apontada a outro lugar dá A3, código 1.

### 3 · A nota do registo sai (achado 12)

«Todas as mudanças deste sítio…» e «Every change to this site…» descreviam a cobertura da página e o que o projeto faz, que é a classe de frase que a Emenda 15 tira de uma página do leitor. Saem de `strings.mjs` e ficam `retirada` no inventário, com a razão. O registo fica com o título, a lista e a norma das correções, que está no topo da mesma página e não se tocou.

### O que se correu nesta passagem, e só isto

`npm run build` inteiro, **código 0**, e com ele o `check:pais` («todas as conferências a 0») e o `check:voz` (verde, 598 linhas vivas todas rendidas, 546 retiradas nenhuma rendida). As **24 plantas** de `tests/pais/pais.mjs`, todas a morder, com as três novas. E o `check:lugar` isolado, **código 0**, porque a marca nova é uma porta para `/a-verificar`: a catraca **L1 ficou em 2 271, o mesmo teto**, e a célula §7.10 da definição do marcador continua verde.

**Os três portões inteiros não correram nesta cabeça**, e é por decisão do lugar de direção: o ramo vai ser rebaseado sobre o `main` depois de aterrar outro bloco, e é ele que os corre na cabeça final.

## A marca em todas as páginas, e o rebase, 22.09.2026

**A decisão do lugar de direção:** um título que o arquivo declara por confirmar leva a marca em todas as páginas onde se rende. Um leitor que a veja numa página e não noutra vê o projeto a dizer duas coisas sobre o mesmo facto.

**O que mudou no componente.** A propriedade explícita saiu: quem chama já não pode esquecer a marca, porque já não é ele que decide. `TituloDeTrabalho` recebe a edição de quem a tem (`edicao=…`) e, de quem só tem a cadeia, resolve-a pela mesma escada que o resto do sítio usa — `edicaoDoTitulo()`, em `src/data/studies.mjs`: a edição da língua da página, e na falta dela a primeira do trabalho. Uma página que liste as duas edições do mesmo trabalho tem duas respostas para a mesma cadeia, e por isso passa a edição.

**A medida, e uma correção à expectativa.** Esperavam-se as 14 páginas que eu tinha contado, mais o registo inglês. São **7 páginas e 11 marcas**, todas inglesas, e é o número certo: as 14 eram as páginas que rendem as duas CADEIAS, e sete delas são páginas portuguesas que rendem a edição PORTUGUESA, que está confirmada. A marca é da edição, não da cadeia.

| Página | Marcas |
| --- | ---: |
| `en/studies/index` | 2 |
| `en/studies/agua-nao-faturada` | 2 |
| `en/studies/onde-esta-a-agua` | 2 |
| `en/corrections` | 2 |
| `en/ledger/agua-nao-faturada-portugal-2024` | 1 |
| `en/ledger/ciclo-substituicao-condutas` | 1 |
| `en/areas/ambiente-e-energia` | 1 |

**A catraca L1 não se mexeu: 2 271 antes, 2 271 depois.** O desconto é o mesmo mecanismo que já descontava o marcador da definição conferida de um cartão — a classe `marcador-de-titulo` e o destino exato do marcador — e a planta prova que é ele que segura o teto: tiradas as classes das duas marcas do arquivo inglês, a catraca sobe acima do teto e o `check:lugar` fecha.

**A A4** passou a correr sobre cada elemento que declara a edição que rende, em vez de só sobre o registo: os artigos das três listas de estudos (`[data-estudo][data-estudo-edicao]`) e as linhas de publicação do registo. Mede **56 títulos de edição** por construção, e exige a marca onde o arquivo a declara e em mais lado nenhum. As duas listas fechadas do `check:voz` passam a admitir a cadeia exacta do marcador, que é declarada em `src/data/marcador.mjs` e não é prosa da casa; qualquer outra prosa continua a fechar a construção.

**As plantas novas:** o marcador retirado de uma publicação do registo (**A4**); uma edição que a primeira página rende declarada por confirmar sem a página a ter (**A4**); a marca retirada da lista dos estudos (**A4**); e a classe do desconto tirada às marcas do arquivo inglês (**L1 acima do teto**).

### O rebase

`git rebase main`, sobre `95655124` (o bloco I129). **Um conflito**, em `design/especime-v3/critica/REVISOES-DO-INVENTARIO.md`: os dois lados acrescentam uma secção no fim do ficheiro. Resolvido ficando com os dois, por ordem de data, com a I129 primeiro por ter aterrado primeiro. O `INVENTARIO-FRASES.md` e o `MAPA-DO-REPOSITORIO-para-construtores.md` fundiram-se sozinhos.

**As contagens novas**, medidas em `dist/` nas duas edições: a página do país passa de 1 para **2** linhas, que são as duas mudanças declaradas do projeto (os nomes do INE, de 21.09, e o grupo etário dos jovens NEM, de 22.09); Évora fica nas mesmas **8**; o registo passa de 30 para **31**. A altura da página do país a 1 280 px passa de 4 791 para 4 955 px (en: de 4 880 para 5 023).

### O que se correu nesta passagem, e só isto

`npm run build` inteiro, **código 0**, na cabeça rebaseada (e com ele o `check:pais`, «todas as conferências a 0», e o `check:voz`, verde). As **26 plantas** de `tests/pais/pais.mjs`, todas a morder. O `check:lugar` isolado, **código 0**, com a L1 em 2 271. O `check:cartao --prova`, **código 0**, porque a I129 mexeu na célula K13 e nas figuras. E a planta da L1 em `tests/pais/portoes.mjs`, a morder.

**Os três portões inteiros não correram nesta cabeça**, e a tabela da secção seguinte é de antes do rebase: as cabeças que ela nomeia já não existem neste ramo. É o lugar de direção que acrescenta os registos da sessão e corre os três na cabeça final.

## Conferência final

Os três comandos completos, cada um no seu comando, na mesma cabeça `dee436cf`, com o código lido de um ficheiro acabado de escrever. Os `.codigo` foram apagados antes da corrida, e cada comando guarda também `.log`, `.inicio`, `.fim` e `.cabeca`, em [portoes/](portoes/). Horas em UTC.

| Comando completo | Código lido do ficheiro | Início | Fim | Cabeça medida |
| --- | ---: | --- | --- | --- |
| `npm run build` | 0 | 2026-09-22T11:06:54Z | 2026-09-22T11:11:37Z | `dee436cf` |
| `npm run verify` | 0 | 2026-09-22T11:11:37Z | 2026-09-22T11:19:18Z | `dee436cf` |
| `npm run typecheck` | 0 | 2026-09-22T11:19:18Z | 2026-09-22T11:19:18Z | `dee436cf` |

Houve uma corrida anterior, na cabeça `820ed629`, com `build` a 0 e `verify` a **1**: o `design:feixe`, o último passo da cadeia, lia a peça da correção por `.log-linha`, a classe da tabela que saiu com as duas listas do registo. A correção e a sua planta ficaram em `dee436cf`, e as três cadeias correram inteiras outra vez nessa cabeça. Fica dito em vez de escondido.

Não se esperou por nenhuma outra construção desta máquina: as três corridas encontraram a máquina livre. Nenhum `push`, nenhum `checkout` noutra árvore, nenhum `git add -A`.
