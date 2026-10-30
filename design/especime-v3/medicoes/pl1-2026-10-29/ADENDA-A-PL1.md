# Adenda A ao mandato PL1: a conferência que a sandbox não corre deu verde no lugar de direção (29.10.2026, 20:40 UTC)

*A mesma sessão, a mesma worktree do sítio (ramo `pl1-2026-10-29`), as alterações na worktree sem commit. Paraste bem: `check:leituras` (`tests/leituras/ferramentas.py`) precisa de um servidor local que a tua sandbox recusa (`listen EPERM 127.0.0.1`), a mesma classe da I282 (as réguas que precisam de rede ou de navegador correm no lugar de direção). O lugar de direção correu `npm run check:leituras` na tua worktree às 20:38 UTC: código 0 (`tests/leituras/ferramentas.py` e `tests/leituras/tempos.py` verdes; a pasta `_aterragens/pl1-leituras-2026-10-29` tem o registo e o código). Decisão: não corras essa conferência; conta-a como verde pelo lugar de direção no relatório, com a pasta nomeada, e segue.*

## 1 · O que fazes agora

1. As outras conferências do §4 do mandato que ainda não correste, uma de cada vez, com os códigos lidos dos ficheiros `.codigo`; as que precisarem de rede ou de navegador saltam-se e nomeiam-se no relatório como «pelo lugar de direção».
2. Os commits do §3 do mandato (um por peça, ou um só se o §3 o permitir), com a identidade do projeto e os trailers; a worktree limpa no fim.
3. O relatório do §3, atualizado: o que mudou, os códigos (com `check:leituras` 0 pelo lugar de direção), as contagens, o que ficou aberto. Sem caminhos da máquina nem da pasta temporária.

## 2 · O que fica como estava

Tudo o mais do mandato e da adenda de 29.10 à noite (os dois guiões exigidos pelo lançador, o aviso do contador «Fable only» no `uso.py`, a guarda da fusão). As mesmas condições de paragem: se outra conferência der vermelho por uma causa que não seja um erro teu, pára e diz.
