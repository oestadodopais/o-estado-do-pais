# Adenda B ao mandato EV3-p: a caixa das novidades depois de uma correção (06.11.2026)

Acrescenta: nada

*A mesma sessão e as mesmas worktrees: o sítio sobre 776fd03d5 (a tua adenda A tal como a deixaste, comitada por este lugar sem mudança); o motor em 983b19e, que fica.*

## §0 Medido por este lugar

- `src/lib/novidades.mjs:23` decide se um estudo é «estudo atualizado» pela natureza da edição atual (`atual?.natureza === 'atualizacao'`). A edição atual de Évora 2027 passa a ser a correção de 06.11.2026, e o estudo sai da caixa como atualização, embora a sua última atualização (03.11.2026) continue a ser a mais recente do sítio.
- A prova da FP3 (`tests/inicio/novidades.mjs:184`) exige pelo menos uma atualização real na caixa, e três plantas usam-na; as plantas copiam a última edição (`.edicoes.at(-1)`).
- A decisão da FP3 (§1.219): a caixa diz «estudo atualizado» quando um estudo é atualizado; uma correção vai ao registo das correções e não à caixa.

## §1 O que fazes

1. Um estudo é «estudo atualizado» na caixa pela sua última edição de natureza «atualização», com a data dessa edição, mesmo quando uma correção veio depois; a correção fica só no registo. Évora 2027 volta à caixa como «estudo atualizado», 03.11.2026.
2. As plantas da FP3 usam essa edição, e não a última. Num dia em que a caixa não tenha nenhuma atualização real, a prova põe uma por planta e as três plantas mordem sobre ela; com uma real, usam a real. Nenhuma asserção sai.
3. O rótulo «Estudo atualizado» / «Study updated» volta a render-se e a voz acompanha.
4. O `build` inteiro verde e o commit do sítio; o motor fica em 983b19e.

## §2 Quando paras

Se alguma destas só passar enfraquecendo uma régua (diz qual e porquê).

## §3 O fim

O `build` inteiro verde; `check:primeira`, `check:voz`, `check:edicoes` e `gate:html` com os códigos e as plantas; a caixa das novidades copiada do `dist/` nas duas edições, no relatório. Commits só com caminhos explícitos, com os trailers da casa e `Claude-Session: https://claude.ai/code/session_0136Xaq9XbD9LZ4SvUR4oz6L`, e o assunto a começar por `EV3-p`. Vinte e cinco minutos, trinta chamadas.
