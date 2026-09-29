# UE1d · a resposta do construtor

*Claude Opus 5.5 (a definição `construtor`), 29.09.2026. O relatório está em `design/especime-v3/medicoes/ue1-2026-09-29/LEIA-ME.md`, na secção «UE1d · a média da União de volta ao cartão da sobrecarga no total, com a ressalva, e a definição declarada no recibo de cada série».*

**As cabeças.** O sítio: o ramo `ue1-2026-09-29`. A cabeça do código da passagem, onde os portões correram, é `99b9f73a`; a cabeça final é o commit que traz esta resposta, e só acrescenta e muda provas nesta pasta e na das capturas. O motor: o ramo `ue1-2026-09-29`, cabeça `e394307`, que a passagem não mudou (0 commits). Nada foi publicado.

**Os portões, lidos dos ficheiros** (`portoes/ue1d/*.codigo`, todos da cabeça `99b9f73a`): `npm run build` 0, `npm run verify` 0, `npm run typecheck` 0.

**Os commits da passagem.** `530d5edc` (a média da União de volta ao cartão da sobrecarga no total, com a ressalva, a K14 na forma nova), `165650cf` (a definição declarada no recibo de cada série), `de17f63e` (o mapa do repositório), `99b9f73a` (o construtor da prova do `check:cartao` sem rebentar quando a declaração não tem a ressalva) e o das provas. Antes de cada um correram as conferências que ele tocou: 10, todas a 0.

**O que se fez.** A §1.140: a declaração que calava a média da União saiu, a régua e a leitura do cartão voltam a citá-la, e a leitura acaba na comparação em palavras. A ressalva da Comissão vive numa fonte só, `src/data/ressalvas-da-uniao.mjs`, com o texto do bloco `casa` sem uma letra mudada, e sai no mesmo cartão ou recibo onde a União aparece: 6 cartões, 4 recibos e as 2 primeiras páginas, e 0 cartões com a União sem ela. A K14 exige-a agora, com a lista escrita no teste e a decisão ao lado, e a K1 só a admite nas medidas da lista. O recibo de cada uma das 10 séries diz a definição declarada da medida: 20 recibos, conferidos pelo portão de HTML e refeitos pelo guião das medidas; `definicaoDaMedida()` e a regra do corte saíram. O comando da UE1b diz «dez páginas», com o valor igual.

**O que decidi e pode mudar-se.** As palavras inglesas da ressalva no cartão são agora as do bloco `casa` («breakdown by tenure status»), e não as da leitura antiga («tenure structure»). O recibo da própria linha da União e o índice do livro-razão levam o valor da União sem Portugal ao lado, e ficam sem a ressalva. A origem da definição não se rende no recibo da série, como não se rende no cartão: o ponto 2 pedia a definição. A K17 passou a contar as origens da auditoria da primeira página, com 2 plantas novas.

**Uma planta que rebentava.** Na primeira corrida das plantas, a que tira a medida da declaração das ressalvas fechava a construção com um TypeError na prova do `check:cartao`, e não com a queixa da K14; o `99b9f73a` corrige-o, e os portões correram outra vez na cabeça nova (a primeira corrida, em `de17f63e`, deu 0, 0 e 0).

**Uma falta e um erro meu.** A construção do estado do segundo commit correu ao mesmo tempo que um build do Codex noutra worktree: o `pgrep` mostrou-o e o meu comando não esperou. E parei a primeira tentativa dos portões a julgar que esperava por si própria, quando esperava, com razão, pelo verify do Codex. Os portões correram por um guião que espera (435 segundos ao todo, pelo verify do Codex).

**As provas.** 8 plantas da passagem na cabeça final, 8 mordidas com a queixa esperada e 8 repostas pelo sha256, entre elas a do typecheck; 140 capturas nas 5 larguras, em português e em inglês, com 0 problemas; `medidas-ue1d.json` com as medidas da passagem, cada uma com o conhecido-positivo; o `conferir-relatorio.py` a 0 no relatório e nesta resposta.

**Os símbolos.** 2 349 730 na sessão ao fecho da passagem e 589 451 na passagem, lidos à mão do contador do ambiente (`custo-ue1d.json`); o total da ferramenta é o que conta.

**O que ficou por fazer.** A leitura da entrada `ue1d` do inventário das frases pelo lugar de direção antes de aterrar; a ressalva no recibo da própria linha da União e a origem da definição no recibo da série, se o lugar de direção as quiser; o `acertos-l1.py`, que é uma questão nova do lugar de direção; e, das passagens anteriores, as palavras das marcas `ep`, `d`, `b` e `u`, a ressalva na frase da faixa, `tests/` fora do typecheck e do `check:mortos`, e o brief do RP3 depois da aterragem.
