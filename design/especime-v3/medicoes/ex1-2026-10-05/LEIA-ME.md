# EX1 · o espaço das explicações e a leitura semanal · o relatório do construtor

*O construtor é o Claude Opus 5.5 (a definição `construtor`), na worktree do ramo `ex1-2026-10-05`, a partir de `3664b90d`, com o brief em `28022431`; escrito a 06.10.2026. Cada número deste relatório está num ficheiro desta pasta: `medidas.json`, escrito por `medir.py` com o comando e o conhecido-positivo de cada medida, e os JSON que as provas escreveram ao lado. Sem travessões.*

## As cabeças e os três portões

A cabeça do código é `1d64052a5bbe45e92608a997bebe17742bbcb0aa` (o commit `1d64052a`, a correção que as capturas acharam). Os três portões correram nela pela tranca da máquina, com o motor ao lado (`RESEARCHHUB_DIR`), cada um no seu comando e com o código escrito num ficheiro depois de o processo acabar (`portoes/`):

| portão | código (lido de `portoes/<portão>.codigo`) | segundos |
|---|---|---|
| `npm run build` | 0 | 209 |
| `npm run verify` | 0 | 1 131 |
| `npm run typecheck` | 0 | 0 (as horas escrevem-se ao segundo, e o portão acabou no segundo em que começou) |

A cabeça antes e depois da corrida é a mesma (`portoes/cabeca-antes-da-corrida`, `portoes/cabeca.fim`, `portoes/cabeca-depois-da-corrida`), e o estado dos ficheiros seguidos tem 0 linhas antes e 0 depois. A cabeça final é a do commit das provas, que vem a seguir à do código e só traz esta pasta e a das capturas.

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

## Onde o construtor parou, e porquê

- **A porta no rodapé.** O brief pede-a «ao lado de «Estudos»», e o rodapé não tem «Estudos»: as sete portas do rodapé contam-se pela ordem no portão de HTML (`scripts/indice-do-portao.mjs`). O rodapé ficou como estava, e as explicações entram pelo bloco da primeira página, pela secção do índice (que a porta «Índice» do rodapé abre) e pela migalha (a I211).
- **A porta para o estudo do orçamento (`oe-2026`).** O estudo não tem página nem rota (o registo `oe-2026` em `INTERNAL_SOURCES`, `src/data/studies.mjs`); a frase do brief que manda o leitor para ele e a porta não se rendem (o acerto X8, a I212).
- **A razão da fatia das Finanças.** O relatório do Orçamento do Estado de 2026 não está alojado no motor, e a razão não se leu na fonte; a frase não se rende, como o brief manda (o acerto X5, a I214).
- **A frase dos programas que mais gastaram.** Com os números de hoje é falsa: até agosto, o programa `016` gastou 17 636,8 milhões, o `015` 11 822,6, o `004` (Finanças) 5 337,6 e o `005` 5 212,7. A frase fica guardada pela sua condição (o acerto X9) e não se rende; o sinal escreve-se em cada construção (`sinais-explicacoes.json`), e a reescrita é do lugar de direção (a I213).

Nenhum portão que protege um número, uma fonte ou uma pessoa ficou mais fraco. Os que encodavam mobília mudaram de forma, cada um com a planta que prova que ainda morde: a L1 do `check:lugar` sobe para 2 716, a medida inteira das 2 páginas da explicação contra a construção da cabeça de partida (2 714 antes, 2 716 depois, 14 destinos repetidos em cada página nova, todos recibos de linhas desenhadas numa figura e citadas com o selo; 5 plantas em `l1-ex1.json`); o `check:alvos` tem as famílias novas e a prosa corrida da explicação, com a planta `explicacao-sem-classe`; o `check:cabeca` tem as três famílias; e a régua das frases tira do inventário as palavras declaradas só onde as células X e W as conferem, no `check:voz` (10 páginas conferidas).

## O que um leitor pode estranhar, e fica para decidir

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

O modelo é o Claude Opus 5.5 em todas as 475 respostas que o registo da sessão guarda (`custo.json`, lido por `custo.py` do registo da sessão do construtor, com o sha256 dos bytes lidos). Somam 219 562 285 símbolos de entrada (a nova, a escrita na cache e a lida da cache) e pelo menos 121 928 de saída (um mínimo: em 310 respostas o registo guardou a saída de um momento do fluxo e não a final), em 14 886 segundos, da primeira entrada do registo até à leitura. O total cumulativo que a ferramenta reporta lê-se do lado do lugar de direção, quando o agente acaba; a leitura daqui fica antes do último commit e da resposta final.

## O que ficou por fazer

- A leitura a frio pelo Codex Astra `xhigh`, com os cinco estragos plantados e o teste dos dois minutos sobre as três páginas: é do lugar de direção.
- As decisões das questões I210 a I216: o guião do §0 do brief (I210), uma porta no rodapé e o seu lugar (I211), a frase e a porta do estudo quando ele tiver página (I212), a reescrita da frase dos programas (I213), a razão das Finanças quando o relatório do orçamento for alojado (I214), a frase dos dois totais (I215) e a forma do valor no ramo negativo do sinal (I216).
- Uma régua que meça, nas páginas do leitor, as frases compostas dentro de um contentor flexível e os transbordos a 390 px: nenhum portão apanhou o defeito da primeira corrida, e o guião `frases-em-flex.mjs` desta pasta é o começo dela (a C2 do `check:css` lê o HTML, e o HTML estava certo; o defeito era do desenho).
- A leitura da semana muda com o dia da construção: as contagens deste relatório são as da construção dos portões, e a página no ar dirá as do dia em que aterrar.
- A worktree temporária da cabeça de partida, usada para medir a L1 e o mapa antes do bloco, removida no fim.
