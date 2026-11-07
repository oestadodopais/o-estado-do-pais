# Adenda A ao mandato ED2: a importação que ficou por usar (07.11.2026)

Acrescenta: nada

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da corrida inteira na cabeça da ED2. A ED2 aterra sozinha: a VOZ-2A e a VOZ-2B não aterram neste lote. Por isso a tua passagem foi aplicada, num commit só, sobre a cabeça aterrada de `main` (2cc0806c2), numa worktree nova: `lote8-ed2-2026-11-07`, irmã da tua. Trabalhas nessa worktree e só nela; a do lote 8 fica como está.*

## §0 Medido (07.11.2026, pela corrida inteira de `conferir-tudo.sh --build` na cabeça fbbd67ca2)

- 64 passos, 63 a 0. O único vermelho é o `check:mortos`: `scripts/check-datas.mjs:3 · importação "publicacaoEd1" declarada e nunca usada no código`. A tua passagem tirou o único uso, ao trocar a conferência antiga da atualização pela `conferirMudancasDoCabecalho`.

## §1 O que fazes

1. Tiras essa importação de `scripts/check-datas.mjs`, e mais nada.
2. Corres `check:mortos`, `check:datas` e `typecheck`, cada um com o seu código.

## §2 Quando paras

Se tirar a importação fizer outra conferência dar vermelho (diz qual).

## §3 O fim

Os três códigos no relatório. Commit só com o caminho explícito, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`, e o assunto a começar por `ED2 A`. Dez minutos, quinze chamadas.
