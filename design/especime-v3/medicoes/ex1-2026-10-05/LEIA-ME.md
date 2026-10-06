# EX1 · o espaço das explicações e a leitura semanal · o relatório do construtor

*O construtor é o Claude Opus 5.5 (a definição `construtor`), na worktree do ramo `ex1-2026-10-05`, a partir de `3664b90d`, com o brief em `28022431`; escrito a 06.10.2026. Cada número deste relatório está num ficheiro desta pasta: `medidas.json`, escrito por `medir.py` com o comando e o conhecido-positivo de cada medida, e os JSON que as provas escreveram ao lado. Sem travessões.*

O relatório tem quatro passagens: a do bloco EX1 (05 e 06.10.2026), nas secções que se seguem; a passagem de correção EX1-b (06.10.2026), com as decisões do lugar de direção sobre as questões I210 a I216 e a régua das frases compostas, na secção «EX1-b, as decisões do lugar de direção»; a passagem EX1-c (06.10.2026), com as correções da leitura a frio do Codex Astra, na secção «EX1-c, a passagem depois da leitura»; e a fusão com o main de 06.10.2026, que trouxe o R4, na secção «A fusão com o main de 06.10 (o R4)». As medidas da segunda vivem em `ex1b/`, as da terceira em `ex1c/` e as da quarta em `fusao/`, com os três portões dela em `portoes/`; as capturas da segunda e da terceira têm os prefixos `ex1b-` e `ex1c-`.

## As cabeças e os três portões (a passagem EX1)

A cabeça do código é `1d64052a5bbe45e92608a997bebe17742bbcb0aa` (o commit `1d64052a`, a correção que as capturas acharam). Os três portões correram nela pela tranca da máquina, com o motor ao lado (`RESEARCHHUB_DIR`), cada um no seu comando e com o código escrito num ficheiro depois de o processo acabar (em `portoes/`, e guardados em `entrega/portoes/` desde a fusão, para que a corrida dela escrevesse em `portoes/`):

| portão | código (lido de `entrega/portoes/<portão>.codigo`) | segundos |
|---|---|---|
| `npm run build` | 0 | 209 |
| `npm run verify` | 0 | 1 131 |
| `npm run typecheck` | 0 | 0 (as horas escrevem-se ao segundo, e o portão acabou no segundo em que começou) |

A cabeça antes e depois da corrida é a mesma (`entrega/portoes/cabeca-antes-da-corrida`, `entrega/portoes/cabeca.fim`, `entrega/portoes/cabeca-depois-da-corrida`), e o estado dos ficheiros seguidos tem 0 linhas antes e 0 depois. A cabeça final é a do commit das provas, que vem a seguir à do código e só traz esta pasta e a das capturas.

## A primeira corrida, e o que as capturas acharam

Os três portões correram primeiro na cabeça `482546471b44046b9ec4d5b7093b9ac78c2d35f1` (o commit `48254647`) e saíram a 0, 0 e 0 (`primeira-corrida/portoes/`). As capturas dessa construção acharam o que nenhum portão media: a primeira página transbordava a 390 px (536 px de documento na edição portuguesa e 546 na inglesa), e as portas do bloco «Para perceber» e da lista das explicações mostravam «em2026», com a frase da semana partida em colunas. A causa: as duas portas eram contentores flexíveis, e cada pedaço marcado da frase (o ano do título, as datas e as contagens) virava um item, com os espaços das pontas apagados e sem dobrar como prosa. O guião `frases-em-flex.mjs` mediu 12 frases compostas dentro de um contentor flexível nas páginas onde se rendem, a 390 e a 1280 px, e 14 queixas ao todo com os transbordos (`primeira-corrida/frases-em-flex.json`). As duas portas passaram a blocos de texto, com os 44 px pela altura mínima (`1d64052a`), e os portões correram outra vez na cabeça nova; na construção deles, o mesmo guião mede 0 queixas em 20 passagens e 184 pedaços marcados vistos, com a sua planta a morder (`frases-em-flex.json`). As capturas da primeira corrida foram substituídas pelas da segunda; o `primeira-corrida/capturas.json` guarda as medidas e os sha256 delas. Na mesma corrida, 2 plantas do guião das capturas não morderam: com o movimento reduzido, a folha da casa põe a duração das transições em 0,01 ms em todos os elementos, e cada propriedade mudada passava a ser uma transição medida antes de acabar; o guião espera agora dois fotogramas antes de medir.

## O §0 do brief, reproduzido

O guião do brief (`design/observatorio/medidas/BRIEF-EX1.py`, sobre `3664b90d`) correu antes do primeiro commit do bloco e outra vez nas provas: 16 das 16 medidas iguais às do brief antes de mexer (`brief-reproduzido-antes-de-mexer.json`), e 16 iguais nas provas (`brief-reproduzido.json`). Bate, com uma ressalva que não é de reprodução: a medida `portas_do_menu` diz 5, e o menu tem 6 portas, contadas no navegador a 390 px nas duas edições (`menu-a-390.json`); o guião conta as linhas do objeto `ETIQUETA_NAV` que começam por uma chave, e não as portas (a I210).

## O mandato, ponto a ponto

| # | o que | o que ficou | a medida | as plantas |
|---|---|---|---|---|
| 1 | a rota e as páginas | as três rotas (`explicacoes`, `leituraDaSemana`, `explicacao`), a lista com a leitura da semana à cabeça, a página de cada explicação, a migalha e a secção do índice. O rodapé não mudou: não tem «Estudos», ao lado do qual o brief pedia a porta (a I211). A sétima porta do menu não cabe a 390 px e fica fora dele: 435,0 px de portas numa coluna de 354 na edição portuguesa (faltam 81,0 px; a fila dobra para 2 linhas) e 424,2 na inglesa (faltam 70,2); as seis de hoje ocupam 343,7 e 341,2 | 2 páginas de explicação contadas pelo portão de HTML; o índice e a migalha nas células do `verify` a 0; o menu em `menu-a-390.json` e nas capturas `menu-*-390.png` | `ex1-indice-sem-as-explicacoes` |
| 2 | a leitura da semana | `src/lib/leitura-da-semana.mjs`: as entradas datadas das linhas nos sete dias que acabam no dia da construção, em UTC; a primeira frase pelas cadeias da casa; uma frase por valor mudado, com o nome do cartão, o período, o valor de antes e o de agora, a unidade, a palavra do lado pela conta, o dia e o selo; as frases da primeira página cujas linhas mudaram, ou que nenhuma mudou. Na construção dos portões, a janela vai de 2026-09-30 a 2026-10-06: 90 números relidos, 12 mudados de valor e 9 de proveniência, e a página rende 12 mudanças; nenhuma frase da primeira página mudou de ramo por causa delas (`semana.json`, a lista `blocos_que_mudaram` vazia), e a página di-lo | o portão de HTML recontou 30 marcas da semana na janela que acaba a 2026-10-06; a célula W na cópia do livro (`semana.json`) e nas 4 portas | as da cópia do livro (um valor mudado, uma releitura igual, uma entrada fora da janela, e uma semana sem entradas, que tem de dizer nada relido e nada mudado), todas a morder; 5 de 5 na página; e, sobre a construção, `ex1-semana-data-trocada`, `ex1-semana-contagem-trocada`, `ex1-semana-janela-de-outro-dia`, `ex1-semana-janela-de-oito-dias`, `ex1-semana-fora-da-porta`, `ex1-semana-mudanca-a-mais`, `ex1-semana-mudanca-em-falta`, `ex1-unidade-de-outra-linha`, `ex1-unidade-com-a-marca-de-outra-linha`, `ex1-voz-porta-da-semana-com-outra-frase` |
| 3 | a primeira explicação | o texto do §5, ponto 4, do brief, à letra, com os acertos X1 a X10 escritos na declaração, cada um com a razão; cada número um `claim`, cada ano um `periodo`, cada nome de função o nome declarado da linha; a palavra «excedente» ou «défice» pelo token novo `sinal` (hoje «excedente», porque o saldo de 2025 vale 0,7); as duas figuras pela forma nova `barras-do-livro`, que entra na lista fechada das formas, com a F22 | o guião dos acertos: 14 blocos, o texto do brief com os acertos igual ao da declaração (`acertos.json`); a auditoria das palavras nas leituras provadas: 65 folhas e 95 partes (48 «diz», 9 «conta», 1 «aponta», 37 «liga»), 5 origens usadas, e 2 de 2 origens das explicações lidas no motor, com o sha256 conferido; a F22 recompôs 4 figuras (as duas, nas duas edições) | 11 de 11 plantas da célula X (entre elas, o ramo do sinal trocado e as palavras de uma condição falsa rendidas); 10 de 10 da F22 em memória (uma barra fora de escala, um valor trocado entre duas barras, duas barras fora de ordem, uma barra a menos, o rótulo de outra linha, em cada edição); e, sobre a construção, `ex1-explicacao-titulo-com-outro-ano`, `ex1-explicacao-descricao-mudada`, `ex1-explicacao-numero-trocado`, `ex1-f22-barra-fora-de-escala`, `ex1-f22-valor-trocado`, `ex1-voz-frase-por-classificar`, `ex1-voz-ramo-do-sinal-trocado` |
| 4 | a primeira página | o bloco «Para perceber», declarado em `src/data/primeira-pagina.mjs`, fecha «O que se passa» com as duas portas: o título da explicação mais recente e a primeira frase da leitura da semana | a 390 px, na edição portuguesa, o bloco tem 184,5 px de altura e a porta mais baixa 44,0 px; na inglesa, 185,5 e 44,0; nas duas, depois do último bloco e dentro de «O que se passa» (`capturas.json`) | a porta curta plantada no navegador é vista; `ex1-semana-fora-da-porta` e `ex1-voz-porta-da-semana-com-outra-frase` sobre a construção |
| 5 | a edição inglesa | tudo pelas cadeias da casa: 35 chaves novas, cada uma em `CHAVES-EN.md` com o português, o inglês e a nota; o texto inglês da explicação na declaração, com a mesma forma, e na auditoria ao lado do português | o `verify` a 0, com o `check:lingua`, o `check:nomes` e a régua das frases | a sentinela da frase retirada «Language» mordeu dentro de «plain language» na primeira escrita da descrição inglesa da lista, que passou a «everyday words» |
| 6 | os registos | o mapa do repositório (as três famílias na tabela do §1, a secção do EX1, e as citações das secções antigas que andaram com as linhas do bloco); as questões I210 a I216 em `ISSUES.md`; este relatório, o `medidas.json` e as capturas | o mapa na cabeça de partida: 451 citações conferidas e 0 longe da linha; com o código do bloco e o mapa por pôr em dia, 59 longe; 195 referências postas em dia pela conta do diff (`linhas-do-mapa.log`) e 3 à mão, achadas por comparação entre 499 referências (`mapa-a-mao.json`); no fim, 484 conferidas e 0 longe. As capturas: 40 páginas inteiras (a lista, a explicação, a leitura da semana e a primeira página, nas cinco larguras e nas duas edições), mais os recortes do bloco «Para perceber», 50 ao todo, com 0 transbordos | 3 de 3 plantas no navegador (uma página mais larga do que o ecrã, uma porta do bloco com 20 px de altura, o valor de uma barra fora da figura) |

Uma ressalva sobre um campo das capturas: em `capturas.json`, o campo `linhas` de cada porta do bloco «Para perceber» conta as caixas da porta, e desde a correção a porta é um bloco, com uma caixa só; não conta as linhas do texto, e este relatório não o usa (o `medidas.json` guarda só as alturas).

## Onde o construtor parou, e porquê (decidido na passagem EX1-b)

- **A porta no rodapé.** O brief pede-a «ao lado de «Estudos»», e o rodapé não tem «Estudos»: as sete portas do rodapé contam-se pela ordem no portão de HTML (`scripts/indice-do-portao.mjs`). O rodapé ficou como estava, e as explicações entram pelo bloco da primeira página, pela secção do índice (que a porta «Índice» do rodapé abre) e pela migalha (a I211).
- **A porta para o estudo do orçamento (`oe-2026`).** O estudo não tem página nem rota (o registo `oe-2026` em `INTERNAL_SOURCES`, `src/data/studies.mjs`); a frase do brief que manda o leitor para ele e a porta não se rendem (o acerto X8, a I212).
- **A razão da fatia das Finanças.** O relatório do Orçamento do Estado de 2026 não está alojado no motor, e a razão não se leu na fonte; a frase não se rende, como o brief manda (o acerto X5, a I214).
- **A frase dos programas que mais gastaram.** Com os números de hoje é falsa: até agosto, o programa `016` gastou 17 636,8 milhões, o `015` 11 822,6, o `004` (Finanças) 5 337,6 e o `005` 5 212,7. A frase fica guardada pela sua condição (o acerto X9) e não se rende; o sinal escreve-se em cada construção (`sinais-explicacoes.json`), e a reescrita é do lugar de direção (a I213).

Nenhum portão que protege um número, uma fonte ou uma pessoa ficou mais fraco. Os que encodavam mobília mudaram de forma, cada um com a planta que prova que ainda morde: a L1 do `check:lugar` sobe para 2 716, a medida inteira das 2 páginas da explicação contra a construção da cabeça de partida (2 714 antes, 2 716 depois, 14 destinos repetidos em cada página nova, todos recibos de linhas desenhadas numa figura e citadas com o selo; 5 plantas em `l1-ex1.json`); o `check:alvos` tem as famílias novas e a prosa corrida da explicação, com a planta `explicacao-sem-classe`; o `check:cabeca` tem as três famílias; e a régua das frases tira do inventário as palavras declaradas só onde as células X e W as conferem, no `check:voz` (10 páginas conferidas).

## O que um leitor pode estranhar (decidido na passagem EX1-b, menos as barras mais curtas)

- **A mesma pergunta com duas respostas (a I215).** «Por função» divide pela despesa efetiva consolidada: a saúde leva 17,07 de cada cem euros e a educação 10,91. «Por ministério» divide pela despesa bruta, com as operações financeiras: a Saúde 13,28 e a Educação, Ciência e Inovação 4,16. As ressalvas estão nos recibos, e o texto não diz que os totais são outros.
- **O saldo negativo (a I216).** O token `sinal` escolhe a palavra, e o valor escreve-se como a linha o tem, com o sinal: um saldo negativo daria «um défice de» seguido do valor com o sinal menos.
- **As barras mais curtas.** A escala das barras é linear e começa no zero, e a maior fatia dos ministérios é a das Finanças: a 390 px, a barra mais longa tem 254,2 px e a mais curta 0,2 px, que não se vê; o valor escrito ao lado de cada barra é a leitura dela (`capturas.json`).

## As plantas sobre a construção

Correram 18 plantas `ex1-` sobre a construção dos portões (`plantas-portoes-ex1.json`, `planta-ex1-*.log`), com a árvore seguida limpa e os bytes do `dist/` repostos e conferidos por sha256: 18 passaram, cada uma com o código 1 e as queixas previstas. Correm fora do `verify`, por `tests/pais/portoes.mjs --prefixo ex1-`. O que cada uma morde:

| planta | o que estraga | quem a recusa |
|---|---|---|
| `ex1-semana-data-trocada` | uma data da primeira frase na porta da primeira página | o portão de HTML (a décima origem) |
| `ex1-semana-contagem-trocada` | a contagem das relidas na porta da edição inglesa | o portão de HTML |
| `ex1-semana-janela-de-outro-dia` | a janela da página da semana a acabar fora dos dias que o carimbo aceita | o portão de HTML, na marca e na página |
| `ex1-semana-janela-de-oito-dias` | uma janela com um dia a mais | o portão de HTML |
| `ex1-semana-fora-da-porta` | a porta da semana na primeira página a levar a outra página | o portão de HTML |
| `ex1-semana-mudanca-a-mais` | uma entrada de uma linha que não mudou | o portão de HTML, depois do varrimento |
| `ex1-semana-mudanca-em-falta` | uma mudança tirada da página inglesa | o portão de HTML, depois do varrimento |
| `ex1-unidade-de-outra-linha` | a unidade de uma mudança trocada | o portão de HTML (a comparação do campo) |
| `ex1-unidade-com-a-marca-de-outra-linha` | a marca da unidade de outra linha | o portão de HTML (a porta estreita) |
| `ex1-explicacao-titulo-com-outro-ano` | o ano no `<title>` da explicação | o portão de HTML (o `<head>` recomposto) |
| `ex1-explicacao-descricao-mudada` | a descrição inglesa da explicação | o portão de HTML |
| `ex1-explicacao-numero-trocado` | um valor no texto da explicação | o portão de HTML (o valor da linha) |
| `ex1-f22-barra-fora-de-escala` | a largura de uma barra | a F22 do `check:formas` |
| `ex1-f22-valor-trocado` | dois valores trocados entre barras | a F22 |
| `ex1-indice-sem-as-explicacoes` | a porta da lista no índice | o `check:indice-do-sitio` |
| `ex1-voz-frase-por-classificar` | uma frase nova na explicação | o `check:voz` |
| `ex1-voz-ramo-do-sinal-trocado` | «excedente» trocado por «défice» | o `check:voz`, pela célula X |
| `ex1-voz-porta-da-semana-com-outra-frase` | palavras a mais na porta da semana | o `check:voz`, pela célula W |

As plantas em memória, que correm dentro das réguas a cada corrida: 11 de 11 da célula X, as da cópia do livro (4 de 4) e 5 de 5 na página da célula W, 10 de 10 da F22, e a `explicacao-sem-classe` do `check:alvos`. Duas plantas da célula W foram reescritas no bloco depois de uma corrida as ter apanhado frágeis: a da janela de outro dia caía num dia que o portão aceita quando o carimbo da construção cai na primeira meia hora do dia (passou a cair antes do mais antigo dos dias aceites), e as que estragam uma entrada partiam numa semana sem mudanças (passaram a dizer que não se aplicam, e a da mudança a menos passa a uma mudança a mais); a do ramo do sinal troca agora o ramo que lá estiver.

## Os commits

| commit | o que traz |
|---|---|
| `28022431` | o brief e o seu §0 (do lugar de direção, já na cabeça do ramo) |
| `c6558836` | as três rotas, a primeira explicação, a leitura da semana, o bloco «Para perceber» e a secção do índice |
| `bfb97a5b` | o portão de HTML (a décima origem, o `<head>` de uma explicação, a página da semana contada) e a F22 |
| `2405f8a8` | as células X e W, a auditoria das palavras nas leituras provadas e a voz das três páginas |
| `c885cb4c` | as réguas que mudaram de forma, as plantas `ex1-` e os guiões das medições |
| `48254647` | os registos: o mapa, as chaves inglesas e as questões I210 a I216 (a cabeça da primeira corrida) |
| `1d64052a` | a correção que as capturas acharam: as duas portas em blocos de texto, o guião `frases-em-flex.mjs` e a espera das plantas das capturas (a cabeça do código) |
| o seguinte | as provas: esta pasta e a das capturas |

## O custo e o modelo

O custo do bloco inteiro, com as passagens EX1-b e EX1-c e a fusão com o main, lido do registo da sessão do construtor até ao fecho da fusão: o modelo é o Claude Opus 5.5 em todas as 884 respostas que o registo guarda (`custo.json`, lido por `custo.py` do registo da sessão do construtor, com o sha256 dos bytes lidos). Somam 433 366 486 símbolos de entrada (a nova, a escrita na cache e a lida da cache) e pelo menos 132 987 de saída (um mínimo: em 582 respostas o registo guardou a saída de um momento do fluxo e não a final), em 35 269 segundos, da primeira entrada do registo até à leitura. O total cumulativo que a ferramenta reporta lê-se do lado do lugar de direção, quando o agente acaba; a leitura daqui fica antes do último commit e da resposta final.

## EX1-b, as decisões do lugar de direção

A passagem de correção correu na mesma worktree e no mesmo ramo, a 06.10.2026, com as decisões do lugar de direção sobre as questões I210 a I216 e a régua das frases compostas. A cabeça do código dela é `723a451fca7df75e14b3bd953a7f4f7b1da64b44`, e os três portões correram nela pela tranca da máquina, com o motor ao lado, cada um no seu comando e com o código escrito num ficheiro (`ex1b/portoes/`):

| portão | código (lido de `ex1b/portoes/<portão>.codigo`) | segundos |
|---|---|---|
| `npm run build` | 0 | 220 |
| `npm run verify` | 0 | 1 155 |
| `npm run typecheck` | 0 | 0 (as horas escrevem-se ao segundo) |

O estado dos ficheiros seguidos tem 0 linhas antes da corrida e 1 depois: o guião das medidas desta pasta, `design/especime-v3/medicoes/ex1-2026-10-05/medir.py`, que o construtor acrescentou com as medidas do EX1-b enquanto os portões corriam. Nenhum portão o lê, e a cabeça não mudou; para as provas, o guião foi posto de lado e reposto depois, e as provas correram com o estado seguido vazio. Vai no commit das provas. As provas correram na construção desses portões (`ex1b/provas/`), cada registo com a cabeça e o estado seguido, com 0 linhas.

| questão | a decisão | o que ficou | a medida | as plantas |
|---|---|---|---|---|
| I210 | a medida das portas do menu conta as portas que o menu rende | o guião do brief conta as entradas de `ROTAS_NAV`, que o cabeçalho percorre dentro de `#nav-principal`, com esse conhecido-positivo; o §0 do brief diz 6 | 6 portas medidas; 16 medidas iguais às do ficheiro do brief; o `check-briefs.py` a 0, com 398 números do §0 ligados à sua medição em todos os briefs | o conhecido-positivo da medida |
| I211 | a porta «Explicações» / «Explainers» entra no rodapé a seguir a «Agenda» | `ROTAS_RODAPE` com a porta nova; a conferência do rodapé conta as portas da lista nova, com a contagem e a ordem em todas as páginas com rodapé | o portão de HTML conferiu 8 portas em 7 882 páginas, com 14 plantas em memória; nas capturas, o rodapé tem 8 portas nas duas edições, com a das explicações entre a da agenda e a da União | em memória, um rodapé sem a porta nova e um com uma porta a mais (`ex1b-rodape-sem-a-porta-das-explicacoes`, `ex1b-rodape-com-uma-porta-a-mais`), também sobre a construção; as do R3 que contavam as portas antigas contam as novas (`ex1b/plantas-portoes-lista.json`) |
| I212 | a porta para o estudo sai enquanto ele não tiver página, e a última frase de «O que isto não diz» aponta para os recibos e para o tema | a frase decidida, nas duas edições, e a porta da página do tema «Estado e economia» no fim, ao lado da dos recibos (o acerto X8); em `ISSUES.md`, a porta para o estudo volta quando ele tiver página | a X8 confere as portas do fim, pela ordem, com o destino e o nome, e o selo de cada valor (a frase diz «no recibo de cada um, a um toque») | `a porta do tema tirada do fim` e `o selo de um valor tirado`, em memória; `ex1b-porta-do-tema-tirada` sobre a construção; `uma porta do fim que a explicação não declara`, na auditoria |
| I213 | a frase dos programas passa a ser decidida pelos números, por um token novo, `maiores`, e a guarda sai | o token ordena os programas pelo valor em cada construção e escreve os três maiores, com os nomes declarados e os valores; com os números de hoje, Trabalho, Solidariedade e Segurança Social (17 636,8 milhões), Saúde (11 822,6) e Finanças (5 337,6), à frente de Gestão da Dívida Pública (5 212,7) | a decisão dizia «dezanove programas», e o livro tem 20, com a mesma unidade, o mesmo período e o mesmo quadro da fonte: o token lê a família inteira, e a X9 conferiu 2 tokens (um por edição) | a ordem dos programas trocada, em memória (`a ordem dos programas que mais gastaram trocada`) e sobre a construção (`ex1b-maiores-ordem-trocada`); uma linha que não é dos programas e um «n» maior do que a lista, na declaração; o valor do primeiro programa trocado, sobre a construção (`ex1b-maiores-valor-trocado`) |
| I214 | fica como estava | a frase das Finanças acaba em «de cada cem euros» e no valor em euros; a razão entra quando o relatório do Orçamento estiver alojado no motor | sem medida nova | sem planta nova |
| I215 | entra a frase dos dois totais, a seguir à figura dos ministérios, pelas leituras provadas | a frase decidida, nas duas edições (o acerto X12); na auditoria, cada parte cita a sua origem (a descrição da classificação funcional no dados.gov.pt, as derivações das linhas e os nomes das funções), e 2 partes, «seja qual for o ministério que o gasta» e «que paga também coisas de outros fins», nenhuma origem alojada as diz com estas palavras e ficam marcadas como leitura do projeto sobre a definição das duas classificações | a X2 confere cada literal no campo que cita, e que cada leitura diz sobre o que é e tem apoio | `uma leitura do projeto sem dizer sobre o que é`, na auditoria; `ex1b-frase-dos-dois-totais-mudada`, sobre a construção |
| I216 | o sinal fica com o número e a palavra vai para o fim | «com um saldo de 0,7 % do produto, um excedente.» (o acerto X13) | a X6 recompõe o parágrafo pelo ramo que o sinal do valor decide | `o ramo do sinal trocado`, em memória, e `ex1-voz-ramo-do-sinal-trocado`, sobre a construção |
| a régua | a célula das frases compostas entra no `verify` | `tests/explicacoes/frases-compostas.mjs`, por `npm run check:frases-compostas`: uma frase composta dentro de um contentor flexível ou de grelha é um erro (FC1), e um documento mais largo do que a janela a 390 px também (FC2) | no `verify`, 20 passagens em 10 páginas, 328 pedaços marcados vistos, 0 dentro de um contentor flexível e 0 transbordos | 2 de 2 plantas no navegador; e, sobre a construção, `ex1b-frases-compostas-num-contentor-flexivel` e `ex1b-transbordo-a-390` |

A primeira explicação, depois da passagem: o guião dos acertos dá 15 blocos, com o texto do brief e os acertos X1 a X13 igual ao da declaração (`ex1b/acertos.json`); a auditoria tem 67 folhas e 109 partes (50 «diz», 2 «leitura», 9 «conta», 3 «aponta», 45 «liga»), com 5 origens; a célula X tem 18 de 18 plantas a morder; e nenhuma frase fica guardada fora da página (0 sinais, `ex1b/sinais-explicacoes.json`), porque a frase dos programas deixou de ter guarda. A L1 do `check:lugar` fica em 2 716, no teto (2 716).

As plantas sobre a construção: 26, as do EX1 e as do EX1-b, em duas corridas (`tests/pais/portoes.mjs --prefixo ex1-` e `--prefixo ex1b-`), com a árvore seguida limpa e os bytes do `dist/` repostos e conferidos por sha256; 26 passaram (`ex1b/plantas-portoes-ex1.json`, `ex1b/plantas-portoes-ex1b.json`), e as do R3 que contam o rodapé novo também (`ex1b/plantas-portoes-lista.json`). A célula das frases compostas, nas provas: 20 passagens, 328 pedaços, 0 erros, 2 de 2 plantas (`ex1b/frases-compostas.json`).

O mapa do repositório: antes de o pôr em dia, 482 citações conferidas e 2 longe da linha; 38 referências postas em dia pela conta do diff (`ex1b/linhas-do-mapa.log`) e 0 à mão, entre 543 comparadas (`ex1b/mapa-a-mao.json`); com a subsecção do EX1-b, 499 conferidas e 0 longe.

As capturas: 60 com o prefixo `ex1b-`, 40 delas páginas inteiras (a lista, a explicação, a leitura da semana e a primeira página, nas cinco larguras e nas duas edições) e 10 recortes do rodapé com a oitava porta, com 0 transbordos e 3 de 3 plantas a morder (`ex1b/capturas.json`).

Os commits da passagem:

| commit | o que traz |
|---|---|
| `20308f1b` | a I210: a medida das portas do menu e o §0 do brief |
| `f925e4b4` | a I211: a oitava porta do rodapé e a conferência que conta as portas da lista nova |
| `cbf4d03f` | as I212, I213, I215 e I216 na primeira explicação: o token `maiores`, a frase dos dois totais, o saldo, a frase e as portas do fim; a célula, a auditoria e os acertos |
| `37b3daf9` | a régua das frases compostas no `verify` e as plantas do EX1-b sobre a construção |
| `723a451f` | os registos: as questões fechadas, o mapa, as chaves inglesas e o inventário (a cabeça do código da passagem) |
| o seguinte | as provas da passagem: `ex1b/` e as capturas `ex1b-` |

O custo da passagem, lido do mesmo registo da sessão desde a primeira entrada dela (`ex1b/custo.json`): 111 respostas do Claude Opus 5.5, 65 452 822 símbolos de entrada e pelo menos 1 398 de saída, em 7 504 segundos.

## EX1-c, a passagem depois da leitura

A leitura a frio do Codex Astra (`xhigh`) voltou com as cinco plantas mordidas e dez correções, feitas nesta passagem, na mesma worktree e no mesmo ramo; os três portões inteiros corre-os o lugar de direção. As provas correram na construção da cabeça do código, `090dd5dc401b736c105b7f21972515060959ee2a` (`ex1c/provas/`), com as conferências que a passagem toca, cada uma no seu comando, com o código escrito num ficheiro e o estado dos ficheiros seguidos com 0 linhas:

| conferência | código (lido de `ex1c/provas/<passo>.codigo`) |
|---|---|
| `npm run typecheck` | 0 |
| a célula X (`tests/explicacoes/explicacao.mjs --prova`) | 0 |
| a célula W (`tests/explicacoes/semana.mjs --prova`) | 0 |
| `npm run check:explicacoes` | 0 |
| a F22 (`scripts/check-formas.mjs`) | 0 |
| `check:frases-compostas` | 0 |
| o portão de HTML | 0 |
| `check:voz`, onde as células X e W correm sobre as páginas | 0 |
| `check:cabeca`, `check:lingua`, `check:lugar` e `check:alvos`, pela secção nova da página da semana | 0, 0, 0 e 0 |
| o guião dos acertos | 0 |
| as plantas sobre a construção (`tests/pais/portoes.mjs --prefixo ex1`) | 0 |
| o mapa (`conferir-mapa.py`) | 0 |

As dez correções:

| achado | o que mudou | a medida | as plantas |
|---|---|---|---|
| 5, a contagem do que mudou de valor | uma mudança de valor é uma mudança do número; as linhas em que só o literal mudou contam-se à parte, a primeira frase nomeia-as quando há alguma, e a página diz cada uma pelo que é, numa secção própria; o resolvedor, o portão de HTML e a célula W seguem a mesma regra | na janela de 2026-09-30 a 2026-10-06: 9 mudaram de valor e 3 só na forma de escrever, as três da leitura a frio (`ex1c/semana.json`); a primeira frase rendida: «Entre 30.09.2026 e 06.10.2026, 90 números foram relidos na fonte, 9 mudaram de valor, 3 mudaram só na forma de escrever e 9 mudaram de proveniência.»; e uma das entradas: «Fluxo de crédito às empresas (não financeiras), 2025: a fonte passou a escrever 3,0, onde escrevia 3, em 02.10.2026.» (`ex1c/frases-rendidas.json`); o portão recontou 36 marcas da semana | `uma entrada só de literal dentro da janela`, na cópia do livro; `o literal de agora de uma mudança só da forma trocado`, na página; `ex1c-semana-forma-contada-como-valor` e `ex1c-semana-contagem-da-forma-trocada`, sobre a construção |
| 6, os dois denominadores | a frase dos dois totais diz o que cada conta inclui e exclui, pelos apoios que a auditoria já tinha | «As duas contas não batem porque medem coisas diferentes: a conta por função soma o que a administração central gasta com cada fim, como a saúde ou a educação, sem as operações financeiras nem as transferências entre os seus serviços; a conta por ministério é o orçamento de cada ministério, com as operações financeiras e as transferências entre serviços do Estado.»; na auditoria, cada parte que diz alguma coisa tem o seu literal, e nenhuma fica como leitura do projeto (`ex1c.auditoria.frase_dos_dois_totais` em `medidas.json`) | `ex1b-frase-dos-dois-totais-mudada`, sobre a construção |
| 7, a porta para o tema | a última frase de «O que isto não diz» acaba nos recibos, e a porta do tema sai; a nota da I212 continua a dizer que a porta para o estudo volta quando ele tiver página | «O orçamento é uma previsão: o que se gasta de facto lê-se na execução, mês a mês, e a de agosto está acima. Falta aqui o custo dos juros da dívida, que o Orçamento também prevê e que estes números não mostram. O detalhe por programa e por ministério, com a fonte de cada número, está no recibo de cada um, a um toque.» | `a porta dos números tirada do fim`, em memória; `ex1c-porta-dos-numeros-tirada`, sobre a construção |
| 9, o saldo e a dívida em palavras | a dívida diz o lado pelo token novo `compara`, da gramática da primeira página; o sinal do saldo ganha a explicação entre parênteses | «No fim de 2025, a dívida pública valia 89,7 % do que o país produz num ano, acima dos 81,7 % da média da União Europeia, e as contas públicas fecharam o ano com um saldo de 0,7 % do produto, um excedente (recebeu mais do que gastou).» | `o lado da dívida trocado`, em memória; `ex1c-lado-da-divida-trocado`, sobre a construção |
| 12, os nomes dos ministérios | os quatro nomes passam a `{ nome }`, o nome declarado da linha, nas duas edições | «Visto pelos ministérios, o maior é o Ministério das Finanças, com 60,12 de cada cem euros, 211 891 565 579 euros; seguem-se o Ministério da Saúde (13,28), o Ministério do Trabalho, Solidariedade e Segurança Social (10,69) e o Ministério da Educação, Ciência e Inovação (4,16).» | `ex1c-nome-de-um-ministerio-trocado`, sobre a construção |
| 13, a X9 | a X9 recusa a família incompleta, além do intruso | a X9 conferiu 2 tokens `maiores` | `um programa a menos no token «maiores»` e `uma linha que não é dos programas no token «maiores»`, na declaração |
| 14, as isenções do texto declarado | uma marca das palavras declaradas, ou das frases da semana, só sai do inventário sobre um elemento que a sua célula compara, e a W compara cada frase da primeira página que a página da semana cita com a que a primeira página rende; a primeira construção desta passagem achou mais um caso, o nome de cada linha na lista dos números de uma figura, que nenhuma régua comparava, e a F22 passou a compará-lo | as células X e W e o `check:voz` a 0 nas provas | `uma marca das palavras declaradas num parágrafo que a célula não compara` e `uma marca das frases compostas num parágrafo que esta célula não compara`, em memória; `a frase de um bloco citado com uma palavra trocada`; `o nome de outra linha na lista dos números`, na F22; `ex1c-marca-declarada-solta` e `ex1c-marca-da-semana-solta`, sobre a construção |
| 15, a F22 | a F22 percorre as figuras declaradas e exige cada uma na página | a F22 recompôs 4 figuras, com 14 de 14 plantas em memória (`ex1c/provas/formas.log`) | `uma figura declarada tirada da página`, em memória; `ex1c-f22-figura-em-falta`, sobre a construção |
| 16, a prosa sobre a casa | a frase dos juros deixa de falar do livro-razão do projeto | a frase está no parágrafo de «O que isto não diz», acima | a frase continua guardada pela condição de nenhuma linha dos juros |
| 17, o saldo de exatamente zero | o ramo «zero» do sinal, «um saldo nulo (recebeu o mesmo que gastou)»; a X10 exige os três ramos de cada `sinal` e de cada `compara` | a X10 conferiu 4 tokens (os dois sinais e as duas comparações) | `o ramo «zero» tirado do sinal do saldo`, na declaração |

A primeira explicação, depois da passagem: o guião dos acertos dá 15 blocos, com o texto do brief e os acertos X1 a X17 igual ao da declaração (`ex1c/acertos.json`); a auditoria tem 80 folhas e 118 partes (54 «diz», 0 «leitura», 13 «conta», 2 «aponta», 49 «liga»), com 5 origens; a célula X tem 23 de 23 plantas a morder, e a W 8 de 8 na página; nenhuma frase fica guardada fora da página (0 sinais).

As plantas sobre a construção, as do EX1, do EX1-b e do EX1-c numa corrida só (o bloco das do EX1-b corre agora também com `--prefixo ex1`): 33, com a árvore seguida limpa e os bytes do `dist/` repostos e conferidos por sha256; 33 passaram (`ex1c/plantas-portoes-ex1.json`). A célula das frases compostas: 20 passagens, 356 pedaços, 0 erros, 2 de 2 plantas. As capturas das três páginas: 30 com o prefixo `ex1c-`, nas cinco larguras e nas duas edições, com 0 transbordos e 3 de 3 plantas a morder (`ex1c/capturas.json`). O mapa: depois das edições do código, 13 citações longe da linha; 20 postas em dia pela conta do diff (`ex1c/linhas-do-mapa.log`); com a subsecção do EX1-c, 514 conferidas e 0 longe.

Três coisas que esta passagem apanhou, corrigidas antes destas provas: a primeira construção recusou no `check:voz` as marcas dos nomes na lista dos números das figuras (a regra nova das marcas fez o que devia, e a F22 passou a comparar esses nomes); a planta da frase de um bloco citado não mordia na primeira corrida das provas, porque trocava uma palavra dentro de um atributo do HTML, e passou a trocá-la no texto visível; e o relatório da passagem EX1-b dizia, na secção do §0 do brief, «15 das 16 medidas iguais» e que a medida `portas_do_menu` «diz 6», porque o guião das medidas lia o ficheiro do brief vivo, que a I210 tinha mudado. O guião passou a ler os ficheiros que uma passagem seguinte mudou como eles estavam na cabeça da passagem que os mede (`git show`), e essa secção volta a dizer o que a passagem EX1 mediu: 16 de 16, e 5.

Os commits da passagem:

| commit | o que traz |
|---|---|
| `c9a31644` | os achados 5 e 14 na semana: as mudanças só da forma de escrever, as marcas comparadas e as frases citadas da primeira página |
| `955c0a33` | os achados 6, 7, 9, 12, 13, 14, 16 e 17 na explicação: o texto, o token `compara`, a X9, a X10, as marcas comparadas, a auditoria e os acertos |
| `ac7eb110` | o achado 15: a F22 das figuras declaradas |
| `97a087bb` | as plantas `ex1c-` sobre a construção e o guião das capturas das três páginas |
| `f7a4533f` | os registos: as I212, I213, I215 e I216 em `ISSUES.md`, as chaves novas e o mapa |
| `3ed466fd` | o nome de cada linha na lista dos números, comparado pela F22 |
| `090dd5dc` | a planta da frase de um bloco citado, no texto visível (a cabeça do código) |
| o seguinte | as provas da passagem: `ex1c/` e as capturas `ex1c-` |

O custo da passagem, lido do registo da sessão desde a primeira entrada dela (`ex1c/custo.json`): 84 respostas do Claude Opus 5.5, 67 855 298 símbolos de entrada e pelo menos 1 180 de saída, em 5 469 segundos.

## A fusão com o main de 06.10 (o R4)

O lugar de direção mandou fundir no ramo, antes da aterragem, o `main` de 06.10.2026, que trouxe o R4 (`42c7ed7e`). A fusão é o commit `1cffc9b5`, com os conflitos resolvidos pelas regras do mandato: as leituras provadas com as chaves do main e a das explicações; o registo dos tetos e a régua da L1 com o número medido depois da fusão; o inventário das frases, as chaves inglesas, as revisões do inventário, a voz do país e as plantas com as do main primeiro e as do EX1 depois; as questões do R4 e as do EX1 por ordem de número; e o mapa do main inteiro com a nota e a secção do EX1. Os três portões correram na cabeça do código, `4893eb5d1a2ed07f36af774b28227a0a1bf436ae`, pela tranca da máquina e com o motor ao lado, cada um no seu comando e com o código escrito num ficheiro depois de o processo acabar (`portoes/`):

| portão | código (lido de `portoes/<portão>.codigo`) | segundos |
|---|---|---|
| `npm run build` | 0 | 223 |
| `npm run verify` | 0 | 1 176 |
| `npm run typecheck` | 0 | 0 (acabou no segundo em que começou) |

A cabeça antes e depois da corrida é a mesma (`portoes/cabeca-antes-da-corrida`, `portoes/cabeca.fim`, `portoes/cabeca-depois-da-corrida`), e o estado dos ficheiros seguidos tem 0 linhas antes e 0 depois. Os registos dos portões da entrega do EX1 passaram para `entrega/portoes/`, para que esta corrida escrevesse em `portoes/` com a árvore limpa; as medidas que os leem ficaram iguais, valor a valor.

**O teto da L1, antes e depois.** O main trouxe o teto a 2 714, o da medição da R4-b, que conta as vezes de cada destino repetido. Depois da fusão a régua conta 2 716 páginas, e o teto passa a 2 716, pelo número exato das páginas novas que não têm como não repetir. A medição (`medir-l1-fusao.mjs`, com a contagem em `fusao/l1-fusao.json`) corre a régua de cada árvore sobre a sua construção, com a amostra aberta, e conta as vezes de cada destino repetido pela cópia da regra da R4-b (`r4-2026-10-05/contar-destinos-l1.mjs`, que recusa escrever sem bater com a régua da sua árvore), na construção do main (`42c7ed7e`, numa worktree à parte, com 2 714 páginas) e na da fusão (`e0ad595d`): entraram 2 páginas e saíram 0; 0 páginas do main ficaram agravadas, destino a destino e vez a vez, 0 ficaram aliviadas e 2 714 ficaram iguais. As páginas novas são as da primeira explicação, nas duas edições, com 14 destinos repetidos na portuguesa e 14 na inglesa: os recibos das funções (10) e dos ministérios (4) que o texto cita e que as figuras desenham. Cada recibo abre-se duas vezes e só duas, pelo selo do valor no texto e pelo selo do mesmo valor na legenda do instrumento que o desenha, e as duas portas são obrigatórias pela regra do portão de HTML («onde aparece um valor, aparece o selo»: fora de um desenho, o selo vai ao pé do valor; dentro de um `<svg>`, vai na legenda do próprio instrumento). Tirar uma delas era tirar o valor do texto do lugar de direção ou o selo de um valor desenhado; por isso as páginas não se corrigiram, e o teto subiu por elas. A medição tem 7 de 7 conhecidos-positivos a morder (a omissão das vezes, uma página a mais, uma página das explicações em falta, uma página do main agravada, um destino que não é um recibo desenhado e citado, um recibo com três portas e uma entrada tirada à lista da régua), e a planta do teto, que troca em memória a contagem do registo, saiu com 1 e a queixa da régua, contra 0 sem a planta (`fusao/planta-teto-l1-fusao.json`). Na corrida do `verify`, a L1 conta 2 716 com o teto 2 716.

Há outra maneira, que fica para o lugar de direção: a R4-b descontou da L1, como porta obrigatória, o selo de um valor na explicação de um valor de referência, depois de a V1-R4 conferir a explicação inteira (`scripts/portas-b2.mjs`). O selo de um valor desenhado, na legenda de uma figura de uma explicação, é o mesmo caso, e um desconto igual, depois de a X e a F22 conferirem a página, devolveria o teto ao número do main. É uma mudança de forma de uma régua, com as suas plantas, e o mandato desta fusão não a pedia.

**As páginas do R4 que as células do EX1 leem.** As células do EX1 que leem páginas construídas (a FC, a X, a W e as marcas do EX1 no inventário do `check:voz`) leem 10 páginas. As que têm peças do R4 são as primeiras páginas das duas edições (`fusao/r4-nas-celulas.json`): 13 explicações de valores de referência por baixo do veredicto e 1 parte do sinal na portuguesa, 13 e 1 na inglesa; 0 peças do R4 caem dentro de uma marca das frases compostas do EX1. A célula das frases compostas leu essas páginas e não recusou nenhuma: 20 passagens em 10 páginas, 356 pedaços marcados vistos, 0 dentro de um contentor flexível e 0 documentos mais largos do que a janela a 390 px, com 2 de 2 plantas a morder (`fusao/frases-compostas.json`). A W lê a primeira página de cada edição para as frases citadas e para a porta, e passou. Nenhuma página do R4 mudou nesta fusão.

**As conferências que a fusão toca**, na construção da cabeça do código (`fusao/provas/`), cada uma no seu comando e com o código num ficheiro, com o estado dos ficheiros seguidos com 0 linhas:

| conferência | código (lido de `fusao/provas/<passo>.codigo`) |
|---|---|
| as leituras provadas, um JSON com todas as chaves: as do main com os mesmos valores (7 de 7) e a das explicações do ramo antes da fusão (`conferir-leituras-provadas.py`) | 0 |
| a K17 (`npm run check:cartao`) | 0 |
| a L1 (`npm run check:lugar`) e a planta do teto | 0 e 0 |
| `npm run check:voz` | 0 |
| `npm run check:lingua` | 0 |
| `npm run check:explicacoes` | 0 |
| `check:frases-compostas` | 0 |
| `npm run check:pais`, pela primeira página que os dois blocos mudam | 0 |
| as peças do R4 nas páginas das células do EX1 (`r4-nas-celulas.mjs`) | 0 |
| `npm run ledger:check`, com a §1.170 | 0 |
| o mapa (`conferir-mapa.py`) | 0 |
| as plantas do EX1, do EX1-b e do EX1-c sobre a construção (`tests/pais/portoes.mjs --prefixo ex1`) | 0, com 33 de 33 |
| as plantas do R4 e da R4-b (`--prefixo r4`) | 0, com 8 de 8 |

As plantas correram duas vezes. Na primeira corrida das provas, as do EX1 pararam com 21 a passar, e as do R4 com 0, com a queixa «a prova exige uma árvore seguida limpa»: o construtor escreveu no guião das medidas, um ficheiro seguido, enquanto elas corriam, e o executor das plantas recusou seguir, como deve. Os dois passos correram outra vez com a árvore limpa (`provas-fusao-plantas.sh`), e os registos da primeira corrida ficam em `fusao/primeira-corrida-das-plantas/`.

**O registo das decisões e o mapa.** A §1.170 do lugar de direção entrou inteira no fim do `DECISIONS.md`, depois da §1.171 do R4, com 1 linha em branco entre as duas (o ficheiro difere do do main por 11 linhas acrescentadas e 0 tiradas), e o ficheiro dela saiu do repositório; o `ledger:check` confere 134 entradas desde a §1.38. Duas notas sobre a §1.170, que entrou como veio: diz que a leitura da semana está em `/explicacoes/o-que-mudou-esta-semana`, e a rota é `/explicacoes/leitura-da-semana` (`/en/explainers/weekly-reading`); e diz que a explicação aponta para o tema «Estado e economia», a porta que a passagem EX1-c tirou, como a mesma entrada diz mais abaixo. Os dois ficheiros da leitura a frio entraram como o lugar de direção os deixou (o sha256 de cada um em `fusao.critica.sha256`, no `medidas.json`). O mapa é o do main inteiro com a nota e a secção do EX1: 202 citações das secções do main postas em dia pela conta do diff contra a cabeça do main, e 11 da secção do EX1 contra a do ramo antes da fusão; ficaram 3 longe, cuja linha citada no main ficava antes da frase, com as inserções do EX1 entre as duas, e foram acertadas à linha da frase, como na passagem EX1 (0 longe depois); o comentário novo da L1 deslocou 37 citações do `check:lugar`, postas em dia pela mesma conta. No fim: 549 conferidas, 0 longe e 0 por encontrar.

Os commits da fusão:

| commit | o que traz |
|---|---|
| `1cffc9b5` | a fusão do main, com os conflitos resolvidos |
| `e0ad595d` | os registos: o mapa, a §1.170, a leitura a frio e as suas plantas |
| `819be89f` | a L1: o teto medido depois da fusão, com a medição e a planta do teto |
| `9a60ee6d` | os registos dos portões da entrega do EX1 em `entrega/portoes/` |
| `4893eb5d` | o mapa depois do teto (a cabeça do código) |
| o seguinte | as provas da fusão: `fusao/`, `portoes/` e esta secção |

Os registos levavam caminhos da máquina, e o guião da limpeza tirou-os: 13 trocas em 8 ficheiros (`limpeza-fusao.json`). Uma delas foi numa expressão do guião `medir-l1-fusao.mjs`, que trazia escrita a pasta temporária e se partiu com a troca; o guião voltou ao do commit, a expressão compõe-se agora por partes, e uma segunda limpeza trocou 0 (`limpeza-fusao-segunda.json`).

O custo da fusão, lido do registo da sessão desde a mensagem do lugar de direção (`fusao/custo.json`): 170 respostas do Claude Opus 5.5, 49 736 480 símbolos de entrada e pelo menos 2 679 de saída, em 5 818 segundos.

## O que ficou por fazer

- A publicação e a aterragem: são do lugar de direção. Os três portões da cabeça do código da fusão estão na secção dela.
- A célula das frases compostas lê as frases das explicações e da leitura da semana; as outras frases compostas da casa (os blocos da primeira página, as leituras dos cartões) não estão nela, e alargá-la é uma decisão do lugar de direção.
- As barras mais curtas da figura dos ministérios continuam sem se ver a 390 px; o valor escrito ao lado é a leitura delas.
- Nas capturas da explicação a 390 px, o parêntese que abre antes de um valor com selo fica às vezes no fim da linha, e o valor desce para a seguinte («Segurança Social (» e, na linha de baixo, o valor); é da quebra de linha do navegador antes da caixa do valor, e não muda nenhum número nem nenhuma palavra.
- A leitura da semana muda com o dia da construção: as contagens deste relatório são as das construções das provas, e a página no ar dirá as do dia em que aterrar.
- O teto da L1 sobe pelas duas páginas da explicação; o desconto do selo de um valor desenhado, como a R4-b fez para a explicação de um valor de referência, é uma decisão do lugar de direção (a secção da fusão diz como).
- As duas notas sobre a §1.170 (a rota da leitura da semana e a porta do tema) são do lugar de direção, que escreveu a entrada.
