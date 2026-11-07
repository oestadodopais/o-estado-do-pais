# The short read of ND1 addendum B (M48), 07.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this read covers

`LEITURA-lote9.md` is the cold read of batch 9, with the director's classification on top. Its finding 6 (Blocking): the ledger row `penedono-indice-de-divida-2024` is calculated, not published by any source, yet its receipt said «A fonte publica «N.d.» em vez de um valor.». `ADENDA-B.md` is the correction (`ADENDA-A.md` is the earlier inventory fix). The site diff is `diff.patch` (base `__BASE__`, head `__CABECA__`). Built pages under `built/` come from the `dist/` of `__DIST__`. `CONFERIR-TUDO.md` is the director's targeted run on that head.

## The three questions

1. **The sentence.** Does the calculated row's receipt now say, word for word, pt «Não se calcula: a fonte publica «N.d.» nos valores de que depende.» and en «Not calculated: the source publishes «N.d.» for the values it depends on.», with «N.d.» marked Portuguese in English? Do the source rows keep the source sentence? Is the choice made from the ledger (the row's `derived_from`), not from the renderer?
2. **The ruler.** Does the plant (the source sentence on the calculated row) go red, in both languages? Is anything in the ND1 ruler weaker than before?
3. **Nothing else.** Did any other page, sentence or ruler change?

Budget: at most 15 tool calls.
