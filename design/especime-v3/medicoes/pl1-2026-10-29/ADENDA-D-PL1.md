# Adenda D ao mandato PL1: os buracos que a leitura curta deixou (29.10.2026, 22:10 UTC)

*A mesma sessão, a mesma worktree (ramo `pl1-2026-10-29`, cabeça a71e272fe, limpa). A leitura curta do Opus (22:01 a 22:07 UTC) apanhou as cinco plantas e não deixou Blocking nem Major; deixou quatro Minor que fecham antes de aterrar, porque tocam o que o bloco existe para fazer. Uma passagem, commit «PL1-3». As conferências de `tests/leituras/` com os códigos lidos dos ficheiros `.codigo`, copiados para a pasta das medições `design/especime-v3/medicoes/pl1-2026-10-29/` (o achado 5: os códigos ficam no repositório, não só no relatório); `check:leituras` pelo lugar de direção. Nenhuma página do leitor muda.*

## 1 · Uma aterragem só de registos muda só registos (o achado 10)

Uma aterragem só de registos (o prefixo `<bloco>-r`, nenhum bloco declarado) é aceite só se todos os ficheiros que o ramo muda face a `main` estiverem em `design/`, `scripts/leituras/` ou `DECISIONS.md`; um ficheiro fora disso (`src/`, `ledger/`, `tests/`, `public/`, `scripts/` fora de `leituras/`, `package.json`) recusa a aterragem com a lista dos ficheiros. Uma planta com um ramo `-r` que toca `src/`.

## 2 · A decisão do financiador leva a data (o achado 11)

`ATERRAR_DECISAO` só vale se trouxer uma data na forma `DD.MM.AAAA` e pelo menos vinte carateres além dela; o recibo guarda-a; numa retoma, a decisão guardada só se reutiliza se a variável a repetir igual. Plantas: sem data recusada; com data aceite; a retoma sem a variável recusada.

## 3 · A sexta-feira volta a ser a exceção que a regra diz (o achado 6)

Na sexta-feira, um bloco de maquinaria passa à frente de um bloco de conteúdo pronto, como a fila diz («um bloco de maquinaria só fica à frente de um de conteúdo quando o de conteúdo o declara como condição, ou à sexta-feira»); a planta `test_sexta_nao_dispensa_ordem` inverte-se (na sexta passa) e o relatório diz que a ambiguidade PL1-1 se resolveu assim.

## 4 · O `ARRANQUE.md` diz o cabeçalho (o achado 12)

A linha 5 do `ARRANQUE.md` diz que o lançador lê a fila (`OEDP_BLOCO`) e que um mandato declara `Acrescenta:` (linhas, frases ou nada) e os guiões de listas e voz correm quando há linhas ou frases; dentro dos 2 500 bytes (conta-os e diz).

## 5 · O que fica para a higiene e para a sexta-feira

Os achados 7 (as plantas com nomes reais de ramos de registos), 8 (a escada do orçamento: 10 agora, 5 depois, decidido na revisão de sexta-feira e escrito no custo de cada bloco), 9 (o custo da PL1 com a passagem PL1-2 e esta por completar pelos `.pontos.json`; o 0,0 do contador) e 13 (o pacote de uma leitura de maquinaria leva os guiões que os testes chamam).

## 6 · O relatório e o que pára

O relatório diz cada correção com o ficheiro e a planta, os códigos lidos dos `.codigo` e a pasta onde ficam, os bytes do `ARRANQUE.md`, o commit. Para e diz se uma planta precisar de rede ou de navegador.
