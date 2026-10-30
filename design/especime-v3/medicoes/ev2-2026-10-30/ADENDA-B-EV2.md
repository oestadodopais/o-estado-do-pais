# Adenda B ao mandato EV2: a segunda contagem que cresce com o conteúdo, e o fim (30.10.2026, 14:37 UTC)

Acrescenta: nada

*A mesma sessão, as mesmas worktrees (o sítio em ae7720fe2, limpo; o motor com a R7 em 1656 comitada pelo lugar de direção como `EV2-1b`, para a retoma passar o pré-voo). Escrita pelo lugar de direção do dia (Claude Opus 5.5). A tua retoma parou bem pela adenda A: o gancho do commit do motor correu o `core.gate` e `publisher.voz_test` recusou (`refs_antes` 8350 e `refs_depois` 8342 contra 8342 e 8334). Pela M99, o lugar de direção correu um a um os 65 módulos de `TEST_MODULES` nesta worktree (com a R7 em 1656): só `publisher.voz_test` está vermelho.*

## 1 · O que o lugar de direção mediu

Nos dois gabaritos do estudo 16, contra `master`: mais quatro tokens por edição, `⟦16:invest-var-2024-2025⟧` duas vezes, `⟦16:receita-falta-2025⟧` e `⟦16:outras-rec-correntes-quota-falta⟧` uma vez cada, e nenhum tirado. São as oito referências a mais, nas duas contagens, e nenhum bloco mudou: o conteúdo da EV2.

## 2 · O que muda

Em `publisher/voz_test.py`, as referências dos estudos compostos em `esperado` passam de `2868` a `2876` (nas duas chaves, `refs_antes` e `refs_depois`), e o comentário ganha uma frase: a EV2 (30.10.2026) acrescentou ao estudo 16 oito referências, quatro em cada edição (a variação do investimento duas vezes, a receita em falta e a parte das outras receitas correntes uma vez cada), sem blocos novos. Nada mais muda no teste.

## 3 · Os commits e o fim

Comitas no motor esta mudança, o commit com `OEDP_GATE=adiado` no ambiente (o `core.gate` corre uma vez no fim, não em cada commit). Depois, uma vez: os três portões do sítio e o `core.gate` pelo escrivão com o perfil `motor` (a tranca pode estar ocupada pela corrida inteira de outro bloco: o escrivão espera por ela). O relatório diz os commits dos dois lados e os códigos lidos dos `.codigo`. Trinta minutos de trabalho e cinquenta chamadas, sem contar a espera pela tranca. Paras e dizes só se outro módulo do motor ou um portão do sítio der vermelho.
