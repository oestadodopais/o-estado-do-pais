**Parei pela condição do §7:** os custos existentes não têm todos os campos exigidos pela nova guarda.

| Custo | Problema confirmado |
|---|---|
| `pl1-2026-10-29/custo-2026-10-29.json` | Falta `orcamento.pontos_codex_por_bloco`; `pontos_do_bloco` está a `null`. |
| `og1-c-2026-10-29/custo-2026-10-29.json` | Falta `pontos_do_bloco`. |

O custo do DO1 tem ambos os campos, portanto os formatos diferem.

Não alterei ficheiros nem criei o commit `PL1-2`. A worktree continua limpa em `4ead33a8d`. O `ARRANQUE.md` mantém **2432 bytes**.

Fica por definir o tratamento dos campos ausentes antes de aplicar as correções. `check:leituras` permanece reservado ao lugar de direção.

Nesta passagem: **2 chamadas de ferramentas, nenhuma corrida de conferências**. Não foram gerados `.codigo`; «tokens used» não foi exposto.