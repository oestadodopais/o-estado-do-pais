# Adenda C ao mandato PL1: os campos dos custos existentes (29.10.2026, 21:12 UTC)

*A mesma sessão, a mesma worktree (ramo `pl1-2026-10-29`, cabeça 4ead33a8d), nada comitado. Paraste bem, pela condição do §7 da adenda B: os custos existentes não têm todos os campos que a guarda nova lê (`pl1-2026-10-29/custo-2026-10-29.json` sem `orcamento.pontos_codex_por_bloco` e com `pontos_do_bloco` a `null`; `og1-c-2026-10-29/custo-2026-10-29.json` sem `pontos_do_bloco`; o do DO1 com ambos). Decisão: a guarda lê os custos como eles são, pela ordem abaixo, e só o custo da PL1 se completa agora.*

## 1 · O que a guarda lê, por ordem

1. Os pontos do bloco: `pontos_do_bloco` se existir e não for `null`; senão a soma de `passagens_codex[].pontos` (os valores não nulos), que é como os custos de 28.10 e da manhã de 29.10 registam; se não houver nenhum dos dois, o bloco está por medir e recusa-se (salvo a aterragem só de registos).
2. O orçamento: `orcamento.pontos_codex_por_bloco` se existir (o primeiro inteiro do texto); senão o orçamento da escada em vigor, 10 pontos (a §1.202, «menos de 10 nos dois primeiros blocos depois de 27.10.2026»), escrito no recibo como `orcamento_por_omissao: 10`.
3. A recusa: pontos iguais ou superiores ao orçamento, salvo `ATERRAR_DECISAO`, como na adenda B.

As plantas da adenda B ajustam-se a estas três leituras (um custo só com `passagens_codex` e 12 pontos recusado; um custo sem orçamento declarado aceite com o orçamento por omissão no recibo; um custo sem pontos nem passagens recusado).

## 2 · O custo da PL1

`design/especime-v3/medicoes/pl1-2026-10-29/custo-2026-10-29.json` ganha `orcamento.pontos_codex_por_bloco` («menos de 10 (a escada da §1.202)») e `passagens_codex` com as passagens desta PL1 lidas dos ficheiros `*.pontos.json` do lançador em `_aterragens/lancador-pl1/` (o nome de cada passagem, o início, o fim, os pontos antes e depois, a diferença como `pontos`, os turnos e os símbolos), e `pontos_do_bloco` igual à soma; se a soma for 0,0 porque o contador do Codex não mediu nenhuma passagem, fica 0,0 com a nota «o contador não mediu nenhuma das passagens», que é um valor medido e não um `null`. A passagem desta adenda entra também, pelo seu `.pontos.json`, quando o lançador o escrever (o relatório diz que fica para a sessão seguinte completar se o ficheiro só existir depois do commit).

## 3 · O resto

Como a adenda B (os §§2 a 7): as correções, as plantas, o `ARRANQUE.md` dentro dos 2 500 bytes, `check:leituras` pelo lugar de direção, o commit «PL1-2». As mesmas condições de paragem.
