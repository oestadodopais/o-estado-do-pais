# RP4-c · as ajudas de leitura do gráfico das séries

Construído pelo Claude Opus 5.5 (a definição `construtor`) a 05.10.2026, na worktree do sítio `rp4c-2026-10-05`, pelo brief `design/observatorio/BRIEF-RP4C-as-ajudas-de-leitura-do-grafico.md` e pelo mandato do lugar de direção. Sem `push`, e sem tocar no motor. Cada número deste relatório está num ficheiro JSON desta pasta: `medidas.json` (escrito por `medir.py`, com o comando e o conhecido-positivo de cada medida) e os registos que ele lê, `brief-reproduzido.json`, `marcas-antes.json` e `marcas-depois.json` (`medir-marcas.mjs`), `letra-dos-eixos-antes.json` e `letra-dos-eixos-depois.json` (`medir-letra.mjs`), `peso-antes.json` e `peso-depois.json` (`medir-peso.mjs`), `capturas.json` (`captar-rp4c.mjs`), `formas-rp4c.json` (o `check:formas`), `series.json` (o `check:series`), `primeira-plantas.json` (o `check:primeira`), `plantas-portoes-rp4c.json` (as plantas dos portões), `custo.json` (`custo.py`) e `limpeza.json` (`limpar-registos.py`); os códigos de cada corrida estão nas pastas `conferencias/`, `portoes/` e `provas/`.

## O ponto de partida

A worktree partiu da cabeça `983b4585`, com o `main` em `5b004ada` já fundido. O §0 do brief, reproduzido pelo seu guião antes de mexer em qualquer ficheiro, é igual ao ficheiro selado, medida a medida (`paragrafo_0_reproduzido_igual`): as 8 medidas, entre elas os 64 píxeis da regra das marcas intermédias do tempo, as 378 linhas com uma conta escrita e os 416 pontos da série da inflação. A construção de antes fez-se numa worktree destacada na mesma cabeça, para medir o peso, as marcas e a letra dos eixos sem misturar a árvore de trabalho.

## O mandato, ponto a ponto

| Ponto | Resultado | Medida e prova |
|---|---|---|
| 1 · o símbolo da unidade nas marcas | **Feito para «%»; parado para o euro.** As marcas do eixo dos valores de uma série em «%» levam o símbolo no texto da marca, depois do espaço inquebrável, e o zero fica «0»; um desenho sem símbolo nas marcas diz a unidade por extenso logo por baixo, pelo campo da série que o portão de HTML compara. O euro ficou sem símbolo: a §1.127 (decisão 4) diz que o dinheiro se escreve com a palavra, nunca com o símbolo, e a F5 do `check:formato` recusa-o também ao lado das marcas de escala; o brief pede o contrário, e a escolha é do lugar de direção (I206). | Das 346 marcas dos valores, 162 levam «%» (antes, 0) e 0 levam «€»; as 82 marcas do zero ficam sem símbolo; 34 desenhos têm a legenda da unidade (24 em euros; antes, 0). A célula do módulo prova as duas formas com uma leitura própria pela unidade da série e a planta do mandato (uma marca sem símbolo numa série em «%»), mais a de um euro com símbolo e a de um desenho sem legenda; a F21 tem a planta da marca sem símbolo e a da legenda tirada, e o formato a do «%» colado e a do euro numa marca. |
| 2 · as décadas no eixo do tempo | **Feito.** Numa série que cobre 20 anos ou mais, o eixo marca as décadas que cabem pela regra dos 64 píxeis, mais a primeira e a última marca; as séries curtas ficam com a regra de hoje. A regra conta-se da ponta de fora da etiqueta vizinha (ver «O que o brief não previa»), com a largura de um ano escrito medida no Chromium. | A primeira página e o recibo da inflação passam de «1992, 2000, 2010, 2026» a «1992, 2000, 2010, 2020, 2026»; o cartão da inflação, a 240, fica «1992, 2010, 2026», como estava. A largura de um ano é 30,25 nas 50 etiquetas de ano medidas antes (e nas 54 de depois), e uma de oito algarismos mede 60,484. As etiquetas do tempo passam de 270 a 292; o menor espaço entre duas etiquetas do tempo, em unidades do desenho, passa de 22,635 a 20,757, e no ecrã é 20,436 píxeis. A célula do módulo prova a série da inflação a 360 e a 240, com a planta de uma década fora do sítio e a de uma década que cabe e não está marcada. |
| 3 · a média como linha do livro | **Parado, pela regra de paragem.** As duas linhas (a média da inflação desde janeiro de 1992 e o objetivo do Banco Central Europeu) nascem no motor por uma travessia, e o mandato não deixava tocar no motor. O módulo não ganhou `referencias`: sem a linha, não há `Claim` que o desenho possa traçar. O que cada linha precisa está na secção seguinte, e a I207 regista-o. | O livro tem 3 195 linhas e nenhuma (0) com um `derived_from` que aponte para uma série; a regra do `ledger/README.md` recusa um `derived_from` que não seja uma afirmação. Nenhuma linha da média nem do objetivo (0). A origem do objetivo está selada (`c1c-bce-estrategia`), e o excerto e a leitura da casa dizem que ele se mede no índice harmonizado. |
| 4 · a leitura de cada ponto, sem guião | **Feito, com duas decisões escritas.** Num desenho de uma série no modo da unidade, cada ponto tem a sua zona (a faixa entre os meios dos pontos vizinhos) e, escondidos até o rato passar, a linha vertical cinzenta clara, o ponto marcado e a etiqueta com o valor (`data-ponto`) e o período (`data-ponto-periodo`, nas palavras da casa). A folha acende-os só dentro de `(hover: hover) and (pointer: fine)`. O portão de HTML admite `data-ponto-periodo` como origem, a F2 admite as duas marcas num desenho só comparadas, e a F21 recompõe as zonas, as etiquetas e a legenda. As duas decisões: a figura indexada fica sem zonas, e o caminho 2 do toque não se abre agora (as duas secções abaixo). | 26 164 zonas em 80 desenhos, e 0 nos 2 desenhos indexados; a primeira página leva 416. A F2 comparou 52 328 valores e períodos de pontos com os seus pontos, com 6 de 6 plantas; a F21 recompôs 82 desenhos, com 21 de 21 plantas e 14 de 14 plantas da leitura e da legenda, e as provas do módulo são 15. O peso está medido antes e depois (secção própria). Com o rato, 3 de 3 provas: em cada uma acende-se exatamente uma leitura, a da zona debaixo do rato; no toque, 2 de 2 provas sem nada aceso. |
| 5 · os registos | **Feito.** O mapa do repositório tem a secção do RP4-c, e as citações antigas que andaram com as linhas acrescentadas foram postas no sítio pela conta do diff; o `ISSUES.md` tem as três questões do bloco (I206 a I208); o inventário das frases e o `CHAVES-EN.md` não mudam, porque o bloco não acrescenta cadeia nenhuma (os textos novos são valores, períodos e unidades transcritas, cada um na sua marca). | O conferidor do mapa: 431 citações na linha citada, 0 longe e 0 por encontrar. As linhas mudadas em `src/i18n/strings.mjs`, no inventário das frases e no `CHAVES-EN.md`: 0. As capturas pedidas são 30 (as 3 rotas, as duas edições e as 5 larguras), mais as 3 leituras com o rato e os 2 recortes da legenda da unidade. O `medidas.json` tem 262 medidas. |

## O ponto 3: o que cada linha precisa

**A média da inflação** (`ipc-variacao-homologa-media-desde-1992`, o id do brief). É a primeira linha escalar do livro que deriva de uma série, e por isso precisa de três coisas antes de o desenho a poder traçar. No livro: a forma nova de uma linha derivada de uma série (a regra do `derived_from` aceita hoje só afirmações), e a conta refeita ponto a ponto na construção, como a S4 refaz as séries derivadas, com a conta em palavras nas duas edições (`derivation` e `derivation_en`), o `check` e o recibo. No motor: o gerador (a média aritmética das variações homólogas mensais da `serie-ipc-variacao-homologa`, de janeiro de 1992 ao último ponto, com a unidade «%» e o período de referência do último ponto), a regra das casas decimais da média (os 416 pontos da série escrevem 2), e a travessia pelo exportador com a entrada em `ledger/cruzamentos/`. E o corredor das linhas, para a pôr em dia quando a série crescer, na ordem que a decisão da I202 der às escritas do corredor. No sítio, depois disso: o módulo ganha `referencias` (a linha, a legenda em palavras e a cor de referência da paleta, que a G5 só admite na linha de referência), o componente traça a linha horizontal com o valor pelo `Claim`, e a F21 recompõe-na.

**O objetivo do Banco Central Europeu** (`objetivo-de-inflacao-do-bce`). A origem já está selada no motor (`c1c-bce-estrategia`, em `src/data/origens-c1c.mjs`, com o endereço, a hora, o cliente e o resumo), e a linha pode nascer desse pedido, com o excerto transcrito. Mas o excerto diz que o objetivo se mede no índice harmonizado, e a leitura da casa di-lo também («O objetivo de inflação do Banco Central Europeu mede-se noutro índice, o harmonizado», em `src/data/leituras-rp1.mjs`). O desenho da primeira página e o do primeiro cartão dos preços são do índice de preços no consumidor: traçar lá o objetivo punha ao lado um número de outro índice, como se fossem a mesma medida. A referência só cabe nos desenhos do índice harmonizado (o recibo da série portuguesa e o cartão da comparação europeia, onde a leitura já diz o objetivo em prosa, com o âmbito dele: «no conjunto da zona do euro»), e a decisão é do lugar de direção quando a linha existir.

## O que o brief não previa, e o que se fez

**A regra dos 64 píxeis, contada da etiqueta.** No RP4, as duas marcas das pontas do eixo do tempo estavam encostadas às pontas do campo, e a regra media-se das pontas do campo. O RP4-m pôs a última marca em janeiro do último ano, centrada, e a regra não mudou: na primeira página, a década de 2020 fica a menos de 64 píxeis da ponta do campo e a mais de 64 da ponta de fora da etiqueta de 2026, e é a segunda distância que diz se as duas etiquetas se tocam. A regra das décadas mede-se da ponta de fora da etiqueta vizinha, que é o que ela sempre guardou (o espaço de um ano escrito por inteiro), e as séries curtas ficam com a regra de hoje, como o brief manda. Sem isto, a primeira página ficava como estava, e a década que o diretor pediu não entrava.

**A figura indexada sem zonas.** No modo indexado, o eixo diz o índice que o desenho calcula, que não tem origem; a etiqueta teria de dizer o valor publicado do ponto, noutra unidade, ao lado de um eixo que diz outra coisa. A figura do salário real fica sem zonas, e a tabela do recibo, logo por baixo, tem cada valor.

**A legenda da unidade também nos cartões.** O brief diz «a legenda diz a unidade por extenso nos outros casos»; a legenda vai em cada desenho sem símbolo nas marcas, nos cartões também, por baixo do desenho e dentro da porta para o recibo. A régua dos rótulos e a K1 leem só a linha do valor do cartão e os seus filhos de cima, e não a contam como uma unidade a mais.

**Duas plantas da S6 e duas formas de conferir.** A S6 tinha duas plantas que trocavam a primeira ocorrência de um valor no HTML do recibo; o desenho vem antes da tabela e escreve o valor de cada ponto na sua etiqueta, e as plantas passaram a trocar a etiqueta. Trocam agora o valor dentro da tabela, e mordem o mesmo que mordiam. A célula dos blocos da primeira página aceita as duas marcas do ponto só dentro do desenho da série do bloco, com a planta de um período marcado fora dele; a G5 achou o preto por omissão na linha da leitura (corrigido com `fill: none`) e ganhou a planta irmã da das guias.

## A decisão sobre o toque, em 390 píxeis

Medido a 390: o desenho da primeira página tem 354 píxeis no ecrã e 416 zonas de 0,697 píxeis no máximo, e um rato alcançaria 289 delas; os cartões têm 240 píxeis, com zonas de 0,42 píxeis no máximo na inflação e de 0,187 nos combustíveis. E 14 dos 16 desenhos medidos a 390 estão dentro de uma ligação, a porta para o recibo.

**A decisão: o caminho 2 não se abre agora.** Um dedo não segura uma zona de menos de um píxel; um guião de arrastar para ler competiria com o toque que abre o recibo e com o deslizar da página, num desenho que é uma porta; e o recibo tem a tabela com todos os pontos, a um toque do desenho. Se o lugar de direção quiser a leitura pelo toque, o sítio para ela é o desenho do recibo, que não é uma ligação.

## O peso das páginas com desenhos

As 58 páginas com desenhos (das 7 899 lidas), antes e depois, com uma zona por ponto como o brief manda:

| Página | Bytes antes | Bytes depois | gzip antes | gzip depois | brotli antes | brotli depois | Zonas |
|---|---|---|---|---|---|---|---|
| as 58 páginas | 8 891 269 | 19 504 714 | 899 262 | 1 781 594 | 602 396 | 1 143 317 | 26 164 |
| a primeira página | 92 542 | 255 466 | 15 570 | 30 918 | 12 732 | 22 776 | 416 |
| a página dos preços | 99 249 | 1 494 887 | 27 402 | 142 799 | 19 129 | 76 714 | 3 410 |
| a página da habitação | 77 419 | 626 234 | 17 761 | 63 832 | 13 266 | 41 446 | 1 337 |
| o recibo da inflação | 220 507 | 383 416 | 20 646 | 35 258 | 12 889 | 22 876 | 416 |
| o recibo do índice | 449 120 | 795 696 | 37 791 | 69 572 | 21 662 | 41 851 | 944 |

O que pesa é a página dos preços: os seus 6 cartões com série têm séries de 309 a 932 pontos num campo de 174 unidades de desenho, e um rato alcança 174 zonas em cada cartão (das 416 da inflação e das 932 dos combustíveis), em qualquer largura; na primeira página alcança 294 das 416, a partir de 768. A decisão de afinar (uma zona por píxel que o rato alcança, ou zonas só nos recibos e na primeira página) é do lugar de direção, e a I208 regista-a.

## As plantas, e o que cada uma morde

| Onde | Estrago | O que morde |
|---|---|---|
| célula do módulo | uma marca sem símbolo numa série em «%» (a planta do mandato); um euro com símbolo; um desenho sem a legenda | a leitura própria do símbolo pela unidade da série |
| célula do módulo | a década de 2010 no janeiro de 2009 (a planta do mandato); a década de 2020 tirada a 360 | a leitura própria das décadas pelos pontos |
| célula do módulo | uma zona mais larga do que o meio até ao ponto seguinte; uma etiqueta do lado do ponto | a leitura própria das zonas pelo meio entre pontos |
| F21, em memória | uma zona deslocada; o valor e o período de outro ponto na etiqueta; a etiqueta acesa por um atributo; uma zona a menos; uma marca sem símbolo; a legenda tirada ou com outra unidade | a recomposição da leitura, a lista dos atributos e a da legenda: 14 de 14 |
| F2, em memória | um valor e um período que não são os do ponto; um período de um ponto que a série não tem | «não é o valor do ponto», «não é o período do ponto», «a série não tem esse ponto»: 6 de 6 |
| portão de HTML, sobre o `dist/` | um período trocado; um período de outro ponto ao lado do valor; um período em inglês na edição portuguesa; um período fora do desenho; um período sem a sua marca; um valor trocado na etiqueta | a origem nova e o laço dos pontos, com o código 1 e a queixa esperada |
| `check:formas` e formato, sobre o `dist/` | um algarismo solto num desenho; uma marca sem símbolo; a legenda tirada; o «%» colado numa marca; o euro numa marca | a F2, a F21, a F4 e a F5 |
| célula dos blocos | o período de um ponto fora do desenho da série | «o bloco escreve um algarismo sem marca de origem» |
| G5 da geometria | o preto por omissão na linha da leitura | a régua da paleta, como nas guias |
| S6 | um valor trocado na tabela; as duas edições com valores diferentes (as duas que mudaram de forma) | «a linha 1 da tabela diz» |
| capturas, no navegador | a etiqueta escondida por uma folha; a regra de mostrar fora da consulta do rato, num toque; um desenho mais largo do que o ecrã | a prova do rato, a do toque e o transbordo |

As plantas sobre o `dist/` são 11, correm fora do `verify` (`tests/pais/portoes.mjs --prefixo rp4c-`), morderam 11, e cada uma repôs os bytes do ficheiro que mexeu, conferidos por sha256, com a árvore seguida limpa. A `check:series` mordeu 24 de 24, as 2 da S6 que mudaram de forma incluídas; a `check:primeira` 62 de 62, a dos blocos incluída; as capturas 3 de 3. Nenhuma planta escreve no `dist/` dentro da cadeia do `verify`.

## Os portões, as conferências e os commits

**As conferências entre commits**, na cabeça do commit do código (`6e0c94f2`), pela tranca, com a árvore seguida limpa (`conferencias/`): 20 passos, 20 com o código 0, da construção ao `typecheck`, com a `check:alvos`, o feixe do desenho e as conferências que leem os desenhos.

**Os três portões inteiros**, pela tranca da máquina, com `sh scripts/leituras/portoes.sh <worktree> design/especime-v3/medicoes/rp4c-2026-10-05/portoes`, na cabeça do código `9277c7f9` (a mesma no princípio e no fim, e a árvore seguida limpa antes e depois). Os códigos foram lidos dos ficheiros, depois de cada processo acabar:

| Portão | Código lido | Segundos |
|---|---|---|
| `build` | 0 | 218 |
| `verify` | 0 | 1 138 |
| `typecheck` | 0 | 0 |

**As provas**, sobre a construção desses portões e pela tranca (`provas/`): 9 passos com o código 0 (as marcas, a letra e o peso de depois, a F21 e a F2 com o seu registo, a `check:series`, as capturas, as plantas dos portões, o mapa e a célula da primeira página com as suas plantas), e a cópia do `version.json` diz a mesma cabeça. As capturas correram uma segunda vez, sozinhas e pela tranca, depois das plantas, para acrescentar os 2 recortes da legenda da unidade, e o registo delas em `provas/` é o dessa corrida (com a cabeça e a árvore seguida limpa ao lado); a célula da primeira página correu também à parte, para escrever o registo das suas plantas.

Commits, no ramo `rp4c-2026-10-05`:

- `6e0c94f2` · os pontos 1, 2 e 4: o módulo, o componente, a folha e o `PontoDaSerie`, com as conferências que mudaram de forma e as plantas
- `9277c7f9` · os registos: a secção do RP4-c no mapa, com as citações postas em dia, e as I206 a I208
- o commit seguinte guarda só esta pasta e a das capturas; a sua cabeça vai na resposta de entrega

## As capturas

Em `design/especime-v3/capturas/rp4c-2026-10-05/`, da construção dos portões: a primeira página, a página dos preços e o recibo da inflação, nas duas edições e nas larguras 390, 768, 1 024, 1 280 e 1 600 (30 capturas); as 3 leituras com o rato, a 1 280 (o meio da série na primeira página, nas duas edições, e o último ponto do cartão da inflação), cada uma com o recorte do desenho e o ecrã (`rato-*`); e os 2 recortes do primeiro cartão com a legenda da unidade por extenso, na página dos salários e pensões (`legenda-*`), porque as rotas pedidas só têm séries em «%». Erros do guião: 0; páginas a transbordar: 0; etiquetas do tempo fora do desenho: 0; a letra dos eixos entre 11,8 e 12 píxeis no ecrã. As leituras com o rato dizem «−1,17 %» com «maio de 2009» (e «May 2009» na edição inglesa) e «3,30 %» com «agosto de 2026».

## Custo e modelo

Modelo: Claude Opus 5.5 em todas as respostas do registo da sessão (`custo.json`, escrito por `custo.py` sobre o registo da sessão do construtor, com o sha256 dos bytes lidos). 6 843 segundos da primeira entrada do registo até à leitura, 240 respostas do modelo, 118 469 075 símbolos de entrada (a nova, a escrita na cache e a lida da cache). A saída registada, 48 118 símbolos, é um mínimo e não a saída: em 178 respostas o registo guardou a saída de um momento do fluxo e não a final. A sessão continuou depois da leitura (este relatório, a conferência dos números e o último commit), e o total cumulativo que a ferramenta reporta ao lugar de direção quando o agente acaba lê-se do lado de quem lançou.

## O que fica

- **O euro nas marcas** (I206): manter a §1.127 nas marcas de escala, ou abrir-lhes uma exceção com a F5 a mudar de forma. A decisão é do lugar de direção.
- **A média e o objetivo do Banco Central Europeu** (I207): um bloco do motor para as duas linhas e para a forma nova de uma linha derivada de uma série, e depois o sítio (as `referencias` do módulo, a F21 e a legenda); o objetivo só nos desenhos do índice harmonizado.
- **O peso das zonas** (I208): afinar, ou não, a leitura nos desenhos densos.
- **O caminho 2 do toque**: não agora; se vier, no desenho do recibo.
- A leitura a frio do pacote, por outra família.
