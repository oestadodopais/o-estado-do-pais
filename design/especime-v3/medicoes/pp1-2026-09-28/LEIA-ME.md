# PP1 · a primeira página de um leitor comum · o relatório do construtor

*Claude Opus 5.5, pela definição `construtor`, a 28.09.2026. Worktree `<worktree do sítio>`, ramo `pp1-2026-09-28`, cabeça de partida `1cbdb8c4`. Cada número deste relatório está num ficheiro desta pasta: `medidas.json`, escrito por `medidas.mjs` com o comando e um conhecido-positivo de cada medida, e os registos que ele lê (`capturas-*.json`, `plantas-*.json`, `l1-pp1.json`, `valor-revisto.json`, `acertos-pp1.json`, `ensaio-contra-resolvedor.json`). O `scripts/leituras/conferir-relatorio.py` confere-os. Os códigos dos três portões estão em `portoes/`, com a cabeça em que correram escrita ao lado, e não neste ficheiro, que é anterior a eles. Sem travessões.*

## 1 · O que o leitor recebe

Num telemóvel de 390 px, a primeira página abre com o rótulo de inteligência artificial e, logo a seguir, «O que se passa» e a data dos números mais recentes. Os dois primeiros blocos cabem inteiros nos dois primeiros ecrãs, cada um com o título, a frase, o desenho e a fonte: na edição portuguesa, o título acaba a 224 px, a data a 246 px, a linha da fonte do primeiro bloco a 806 px e a do segundo a 1 598 px, contra o limite de 1 688 px (2 ecrãs de 844 px); na inglesa, as duas fontes acabam a 781 e a 1 552 px. A página tinha 10 812 px de altura a 390 px e tem 6 803 (a inglesa, 10 679 e 6 748).

A primeira página tinha 23 cartões, 9 temas, a leitura do país e 4 mudanças; tem 0 de cada, e 5 blocos e 6 entradas nas duas edições. As 10 páginas das entradas estão construídas. As 84 capturas (5 larguras e 2 edições da primeira página e das 5 entradas, e o escuro a 390 e a 1 280) estão em `capturas/`, com as da cabeça de partida ao lado, e nenhuma transborda de lado.

## 2 · O mandato, ponto a ponto

| Ponto do §2 | O que se fez | A medida |
| --- | --- | --- |
| 1 · a gramática dos blocos | `src/data/primeira-pagina.mjs` é a cópia das declarações, com os acertos no cabeçalho e em `ACERTOS_DAS_PALAVRAS`; `src/lib/primeira-pagina.mjs` é o resolvedor, sem Astro; `tests/inicio/blocos.mjs` é a auditoria na forma da K17, com a célula e as plantas | `acertos-pp1.json`: 4 diferenças entre a cópia e a declaração, cada uma um acerto, e nenhuma chave nova fora das de forma. A auditoria: 81 folhas, 124 partes (72 que dizem, 24 que contam, 28 que ligam), 97 apoios, 14 algarismos, 24 origens. O ensaio a seco do lugar de direção contra o resolvedor: 44 linhas, 40 iguais e 4 diferenças esperadas (`ensaio-contra-resolvedor.json`) |
| 2 · o bloco e as quatro formas | `BlocoDaPrimeiraPagina.astro` e `DesenhoDoBloco.astro` (barras, painéis, pares e colunas, desenhados no servidor), a linha da fonte calculada, a lista dos números numa dobra; `tests/inicio/geometria.mjs` com as plantas da maqueta | `plantas-geometria.json`: 11 medições sem falha, e as 14 plantas mordidas |
| 3 · a primeira página | `HomeView.astro` pela ordem do brief; saíram a leitura do país, o resumo dos temas e a lista das mudanças, e ficaram as portas | as medidas da secção 1; o valor revisto numa cópia do livro (secção 6) |
| 4 · as cinco páginas das entradas | `EntradaView.astro` e as 10 cascas; os cartões pelo mesmo componente da página dos temas; os estudos do país pelos temas da entrada; `tests/inicio/entradas.mjs` | cada cartão da página dos temas está numa entrada, salvo o declarado (`medidas.json`, `cartoes_dos_temas_fora_das_entradas`); as plantas das entradas estão nas 36 do `plantas-primeira-pagina.json` |
| 5 · os sinais | `scripts/sinais-da-primeira-pagina.mjs` no `verify`, a escrever em `.sinais/`, fora do Git e de `dist/`; só falha abaixo de 3 blocos | `plantas-sinais.json`: as 2 plantas do brief mordidas; 5 blocos mostrados e 0 saídas nesta construção |
| 6 · as células que mudam de forma | secção 4 | secção 5 |
| 7 · o mapa, as capturas e o relatório | o mapa dos construtores posto em dia (a tabela das famílias e a secção do PP1, e as citações que tinham andado); as capturas; este relatório | o `conferir-mapa.py` sem citação nenhuma longe da linha citada |

## 3 · Os acertos, cada um com a razão

**As palavras (A1 a A4).** A célula 11 do `check:voz` recusa «a casa» por expressão regular, porque é uma palavra que o sítio nunca usa para si (a norma §1.3), e não distingue o sentido. Quatro cadeias do lugar de direção diziam «casa» no sentido de habitação: o título do bloco da habitação, a frase dele, a linha da entrada da casa e o nome da primeira secção dela. O portão não se tocou, e a palavra passou a «habitação», que é a que a leitura do cartão da sobrecarga já usa para a mesma coisa, apoiada no literal do glossário do Eurostat («total housing costs»). O nome da entrada, «A minha casa», fica: é a pergunta do leitor e não morde a regra.

**A forma (F1 a F3).** Os algarismos das palavras fixas («mais de 40 %», «dos 20 aos 64 anos») passam a pedaços `{ nl }` com o motivo `escala-de-instrumento`, porque o portão de HTML fecha a construção com um algarismo sem origem; o texto rendido é o mesmo. A régua de cada escala escreve-se para a máquina ao lado das palavras do lugar de direção. O sufixo dos valores desenhados fica escrito onde a legenda não diz a unidade, como na maqueta.

**A testemunha (D1).** O salário de 2026 traz a bandeira `&` com a nota «Dado provisório», que o `<Claim>` do sítio escreve por palavras desde o RP1b; o ensaio a seco do lugar de direção só reconhece a bandeira `p`. São 2 das 4 diferenças do ensaio, nas duas edições; as outras 2 são A1 e A2.

**O marcador «o trabalho».** O título do bloco do emprego, «O trabalho: mais emprego», morde o marcador da voz que existe para a frase da casa sobre o seu próprio trabalho. Entrou uma exceção de contexto em `VOZ-MARCADORES.md`, só nas rotas `home` e `entradaTrabalho`, com a razão; e a descrição da primeira página diz «o meu trabalho», que é o nome da entrada.

**O vocabulário fechado.** A L3 do `check:lugar` mede «trabalho» como nome de um estudo, e a exceção do trabalho de quem lê cresceu com as três formas das declarações: «O meu trabalho», «O custo do trabalho» e «O trabalho: mais emprego». A palavra no sentido de um estudo, na mesma página, continua a contar (planta `pp1-trabalho-como-nome-de-estudo`).

**As cadeias que são do construtor**, e não das declarações nem do brief, e que o lugar de direção pode trocar: a descrição da primeira página, que dizia a leitura do país e os números por tema e passou a dizer o que se passa e as seis entradas pelos seus nomes (a antiga e a leitura ficaram retiradas no inventário, com a razão); o título da secção do veredicto, «Os valores de referência da Comissão Europeia» (o brief pede um título seu sem dizer as palavras); o rótulo da linha da fonte, «Fonte»; e as edições inglesas das cadeias que o brief só deu em português («All themes», «The European Commission’s reference values», «Source»). Todas estão em `src/i18n/strings.mjs` e no inventário.

**Os estudos de cada entrada.** Um tema pertence à entrada que tem mais cartões dele, e a entrada mostra os estudos do país sobre os seus temas. Hoje isso dá 1 estudo a «O meu dinheiro» e 2 a «O Estado e a economia», e nenhum às outras (`medidas.json`, `estudos_da_entrada_*`).

**A lista das linhas da leitura do país** fica, porque `src/lib/mudancas.mjs` a usa para dizer que uma correção da dívida é do país (`medidas.json`, `ficheiros_que_usam_as_linhas_da_leitura_do_pais`). O componente da leitura saiu.

**Duas linhas do inventário que prendiam os dados, e que a planta do valor revisto encontrou.** A primeira corrida da planta (secção 6) fechou a construção da cabeça do bloco no `check:voz`, e não por causa dos blocos: a linha do inventário da frase do veredicto era a frase com os valores e os nomes tirados, e contava as vírgulas da lista das medidas fora do valor de referência («Fora: , , e .»). Uma revisão que tirasse uma medida da lista mudava a linha, e a construção fechava. A frase não é prosa livre, porque a V1 a recompõe inteira, carácter a carácter, das contagens e dos nomes, e corre na mesma corrida do `check:voz`: saiu do inventário na primeira página, e só lá, e o arame da voz continua a lê-la. As duas linhas dela saem do ficheiro, e não ficam como retiradas, porque o arame da voz continua a ler a frase e uma linha retirada que se lê fecha a construção. A segunda era a do rótulo da linha de referência do desenho da dívida («valor de referência»), que só se rendia enquanto o bloco da dívida estivesse na página: o rótulo passou a mobília do desenho declarado, e a célula dos blocos confere-o inteiro. As duas mudanças têm plantas (secção 4). No inventário, o bloco fica com 75 cadeias novas, 4 retiradas e 2 que saem do ficheiro.

**Uma nota de caminho.** O guia de leitura nomeava `design/especime-v3/IDENTIDADE.md`; o ficheiro está na raiz, `IDENTIDADE.md`.

## 4 · As células que mudaram de forma

| Célula | O que protege | Forma antiga | Forma nova | Planta que prova que ainda morde |
| --- | --- | --- | --- | --- |
| `gate:html`, um campo de linha fora do livro | que um campo de uma linha só entre numa página por uma porta estreita e comparado com a linha | as páginas do livro e três portas de unidade | mais a porta dos campos de um bloco (o publicador na linha da fonte, o nome de um número na lista), só na primeira página e nas entradas, e a unidade do cartão também nas entradas | `pp1-campos-de-linha-dos-blocos` e `pp1-campo-de-bloco-noutra-rota` |
| `check:pais` L1 a L3 | que a leitura cita as linhas aprovadas, com os recibos e a data da notificação | a frase com as linhas presas | a leitura sai e, se voltar, a L1 fecha; os blocos são recontados pela célula dos blocos (B1) | «número de um bloco sem recibo» e «bloco com outra data da notificação» |
| `check:pais` T | cada medida no seu tema, uma vez, todas publicadas | na primeira página e nos temas | nos temas, a T9 também nas entradas, e a T0 recusa cartões na primeira página | «cartao-de-volta-a-primeira-pagina»; a T3 plantada nos temas |
| `check:pais` C2, A1, A2, M2 | a lista das mudanças: âmbito, teto, ordem e texto | a lista da primeira página | a C2 recusa a lista de volta; a A1 e a A2 nas listas dos lugares; o texto declarado pela A3 no registo | «lista das mudanças de volta à primeira página», «publicação na lista de um lugar», «mais mudanças do que o teto», «texto da mudança alterado» |
| `pais-veredicto` V1 | onde a frase do veredicto vive | antes da leitura | depois de «O que se passa», na sua secção, com título e a porta da página europeia | «veredicto-antes-de-o-que-se-passa», «veredicto-fora-da-sua-seccao», «veredicto-sem-a-porta-europeia» |
| `voz-pais`, a lista fechada | que a prosa da primeira página seja só a declarada | a leitura comparada inteira | os blocos saem da lista só conferidos pela célula; entram as cadeias da mobília nova | «frase de um bloco alterada» |
| `check:voz`, o arame da classe | que uma frase da classe por provar não volte à primeira página | a leitura saía sem conferência; a K17 só onde havia cartões | a leitura já não sai; os blocos só saem conferidos; a K17 corre sempre que haja uma leitura, e corre nas entradas | «l1-leitura-que-a-k17-recusa» e «l1-leitura-fora-do-cartao», mudadas de sítio |
| `check:voz` e `medir-defeitos`, o inventário | que cada frase da casa esteja classificada | a primeira página e os temas | a marca dos blocos só vale na primeira página e nas entradas; os cartões das entradas leem-se como nos temas; a lista dos números sai do inventário conferida, e a célula dos blocos corre nas entradas | as de `tests/inicio/regua-das-frases.mjs` (uma frase com um valor fora dos cartões de uma entrada fica por classificar; a marca dos blocos numa página de concelho não tira nada; e os dois controlos), e «o sufixo de um número da lista trocado» e «a palavra da União tirada de um número da União» |
| `check:voz` e `medir-defeitos`, a frase do veredicto | que a frase esteja classificada e diga o que as contagens dão | uma linha do inventário, com as vírgulas da lista das medidas fora contadas | fora do inventário na primeira página, e só lá, recomposta inteira pela V1 na mesma corrida; o arame da voz continua a lê-la | «b2-voz-contagem-e-prosa», que a V1 passa a morder, e «a marca do veredicto numa página de concelho não tira nada do inventário» |
| a célula dos blocos, o rótulo da linha de referência | que o rótulo diga a palavra da casa e o valor de `referencias.json` | uma cadeia marcada `data-voz`, com uma linha do inventário que só se rendia com o bloco da dívida na página | mobília do desenho declarado, conferida inteira pela célula | «uma palavra no rótulo da linha de referência» |
| `check:datas` | cada data de publicação presa à sua edição | a primeira página e as páginas de lugar | mais as entradas, com as edições esperadas recontadas dos dados | `pp1-estudo-tirado-de-uma-entrada` |
| `check:formas` | só as formas declaradas | 4 formas | 8, com o conhecido-positivo no guião | `pp1-forma-de-bloco-desconhecida` |
| `portas-b2` | as portas obrigatórias só saem da L1 depois da V1 e da V2 | o cartão das câmaras na primeira página e nos temas | o cartão só nos temas; a primeira página com as portas do veredicto | `tests/pais/l1-b2.mjs` |
| `check:lugar` L3 e L1 | o vocabulário fechado, e as páginas com destinos repetidos | a exceção do trabalho e o teto de 2 341 | a exceção com as formas das declarações, e o teto de 2 349 pela composição medida (secção 7) | `pp1-trabalho-como-nome-de-estudo`; as plantas de portas extra do `l1-b2.mjs` |
| `check:cartao` K17 | cada leitura de cartão conferida onde se rende | a primeira página e os temas | os temas e as 10 páginas das entradas | as plantas da K17, com `--prova` |
| `check:alvos` H2, H6 e as famílias | os alvos de 44 px | a leitura como prosa corrida; as portas dos temas na I105 | as frases dos blocos como prosa corrida; as portas das entradas na I105; a família das entradas medida; o estrago das portas nas entradas | «bloco-sem-classe» e «b1», com `--so` |
| `tests/inicio/porta.mjs` P1 e G1 | a primeira página no primeiro olhar, e a grelha igual à dos temas | a leitura, o mapa e o primeiro tema no primeiro ecrã do portátil; a grelha dos temas na primeira página | a prova de aceitação a 390 × 844; a grelha das entradas contra a dos temas, com meio píxel de tolerância | «planta-dobra», «planta-largura», «planta-menu», e a reposição de cada uma |

## 5 · As plantas

| Conjunto | Ficheiro | Corridas | Mordidas |
| --- | --- | --- | --- |
| a célula dos blocos, as entradas e a régua das frases | `plantas-primeira-pagina.json` | 36 | 36 |
| a geometria dos desenhos | `plantas-geometria.json` | 14 | 14 |
| os sinais | `plantas-sinais.json` | 2 | 2 |
| a porta da primeira página (3 plantas e a reposição de cada uma, nas 2 edições) | `plantas-porta.json` | 12 | 12 |
| o país | `plantas-pais.json` | 31 | 31 |
| o veredicto | `plantas-veredicto.json` | 16 | 16 |
| o cartão das câmaras | `plantas-camaras.json` | 35 | 35 |
| as portas da B2 na L1 | `plantas-l1-b2.json` | 8 | 8 |
| os portões mudados de forma, as que o bloco mudou de sítio e as suas | `plantas-portoes-lista.json` | 18 | 18 |
| os alvos | `medidas.json`, `plantas_dos_alvos_*` | 2 | 2 |

## 6 · O valor revisto numa cópia do livro

A planta (`valor-revisto.mjs`; o registo em `valor-revisto.json`) extrai a árvore de cada cabeça com `git archive` para uma pasta temporária fora do repositório, revê a linha `precos-da-habitacao-2025`, que a leitura do país prendia (o valor e o excerto, do mesmo modo), e corre a cadeia inteira da construção, `npm run build`. As pastas apagam-se no fim, e nada da planta entra no livro.

- **A revisão A** (17,6 passa a 12,4, que não muda nenhuma condição nem nenhuma contagem). Na cabeça de partida, a construção para no Astro, com a frase «B1 leitura do país: precos-da-habitacao-2025 mudou; parar a frase e comunicar à direção.», e o código é 1: é o conhecido-positivo. Na cabeça do bloco, a cadeia inteira passa com o código 0, a primeira página mostra os 5 blocos, e o cartão da entrada da casa mostra 12,4 com o seu recibo. **É a medida do brief: uma revisão de rotina de um valor que a primeira página prendia já não parte a construção.**
- **A revisão B** (17,6 passa a 4,9, abaixo dos 5,5 da União e do limiar da Comissão). Na cabeça do bloco, a peça dos preços das casas sai da primeira página e o sinal nomeia-a («condição falsa: precos-da-habitacao-2025 (4,9) > precos-da-habitacao-2025-ue (5,5)»), e a página fica com os 5 blocos. A construção fecha, com o código 1, no `check:voz`, e não pela primeira página: a manchete de «Portugal na União Europeia» tem, no inventário das frases, uma linha com as contagens escritas por algarismos («Portugal falha 4 valores de referência do Procedimento dos Desequilíbrios Macroeconómicos e cumpre 9 .», e a gémea inglesa, do bloco correcao-p1p2), e uma revisão que mude quantas medidas estão fora do valor de referência muda a manchete. É a mesma classe da linha da frase do veredicto que este bloco tirou do inventário na primeira página (secção 3); não se tocou, porque é outra página e outra célula, e fica dito na secção 8.

## 7 · A catraca L1

O teto das páginas com dois destinos iguais fora da mobília sobe de 2 341 para 2 349, e a razão está medida em `l1-pp1.json`, que corre a régua de cada cabeça sobre a construção dela, com a amostra aberta: entraram 8 páginas, todas das entradas, e não saiu nenhuma; nenhuma página que o bloco não refez ficou com mais destinos repetidos. A primeira página já estava na conta, com 3 destinos repetidos, e fica com 14, nas 2 edições. A razão é a do §2, ponto 2, do brief: a lista «Os números deste bloco» tem uma linha por número, com a porta do recibo, e um número que a frase ou uma peça já cita abre o mesmo recibo outra vez; nas entradas, a mesma linha pode ainda abrir o recibo no cartão dela. As plantas de portas extra do `l1-b2.mjs` continuam a subir a conta acima do teto.

## 8 · O que ficou por fazer, dito

- **A manchete de «Portugal na União Europeia» ainda prende as contagens do veredicto** no inventário das frases (secção 6, a revisão B): uma revisão que mude quantas medidas estão fora do valor de referência fecha a construção no `check:voz`. A saída que este bloco deu à frase do veredicto na primeira página (sair do inventário onde uma conferência a recompõe inteira) serve se houver uma conferência assim da manchete; o bloco não a procurou nem a tocou, porque a página não é deste bloco.
- **A leitura a frio** é de outra família, e é do lugar de direção lançá-la. As linhas novas do inventário ficam «por ler» no registo das revisões.
- **As capturas e as páginas congeladas** são da construção da cabeça `b4d92902`; os commits a seguir mudaram tipos JSDoc, as plantas, o inventário, a régua das frases e, na página, só os atributos do rótulo da linha de referência do desenho da dívida (sai `data-voz`, entra `data-rotulo-da-referencia`), que não mudam o que se vê.
- **O custo.** O modelo é o Claude Opus 5.5. O total de símbolos que a ferramenta reporta para este agente chega ao lugar de direção com a resposta; o construtor não o lê de dentro e não o escreve aqui.
- **A prova de toque de todas as plantas da régua dos alvos** corre por estrago; o bloco correu as duas que mudou («b1») ou acrescentou («bloco-sem-classe»), e não as outras, que não tocou.

## 9 · Os commits

Os do ramo até este relatório, por ordem (a mensagem inteira de cada um diz o que ele faz e porquê):

- `db58de3e` PP1: as declarações dos blocos e das entradas no sítio, o resolvedor sem Astro, a auditoria das palavras e a comparação com a testemunha
- `30b663ff` PP1: a primeira página de um leitor comum e as cinco páginas das entradas
- `3585635a` PP1: o captor do bloco e as capturas antes, da construção da cabeça de partida 1cbdb8c4
- `b47a12d7` PP1: a lista dos números de cada bloco com a marca das palavras conferidas, a língua do publicador na linha da fonte, a descrição da primeira página pelos nomes das entradas e a porta do veredicto com 44 px
- `30158571` PP1: a célula dos blocos e das entradas, a geometria dos desenhos, os sinais e as plantas da régua das frases
- `238bd172` PP1: o inventário das frases e as exceções da voz com a primeira página nova e as cinco entradas
- `4d733a89` PP1: os portões que mudam de forma com a primeira página e as cinco entradas, cada um a conservar o que protege
- `d04d63b6` PP1: as plantas dos portões que mudaram de forma, no sítio onde as coisas vivem agora
- `b4d92902` PP1: os guiões das medidas do relatório, do valor revisto numa cópia do livro e das capturas depois
- `15342ef6` PP1: os tipos do resolvedor e das declarações, que o typecheck pedia
- `ae895190` PP1: a planta do valor trocado no portão de HTML aponta ao primeiro valor da frase de um bloco que tem valores
- `bd1f46df` PP1: a frase do veredicto e o rótulo da linha de referência deixam de prender os dados no inventário das frases
- `931873d1` PP1: a planta do valor revisto constrói as duas cabeças pela cadeia inteira e guarda a cauda da saída sem caminhos da máquina, e as medidas leem as páginas congeladas

A seguir vêm o commit que traz este relatório, as medições e o mapa, e o último, com os códigos dos portões e a resposta curta.

## 10 · Os portões

Os três correm na cabeça que traz este relatório, cada um no seu comando, com o código lido de um ficheiro acabado de escrever: `portoes/build.codigo`, `portoes/verify.codigo` e `portoes/typecheck.codigo`, com a cabeça em `portoes/*.cabeca` e as horas em `portoes/*.inicio` e `portoes/*.fim`. O último commit do ramo traz esses ficheiros e a resposta curta (`RESPOSTA-construtor-pp1.md`), que diz os códigos.
