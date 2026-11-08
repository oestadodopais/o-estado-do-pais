# The short read of VOZ-2A addendum I, 08.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this addendum does

The short read of addendum H found that the English budget-study document still says «the connection is ours» where the Portuguese dropped «a ligação é nossa», and the director found that the Portuguese budget-study page had gained «; a tabela é da fonte» in a label the English page prints as «(inference)». Addendum I (`ADENDA-I.md`) applies list entry V331 in `design/especime-v3/medicoes/voz2a-2026-11-07/FRASES-VOZ-2A.json` and restores the Portuguese page label to its earlier form; the pair check (`design/especime-v3/medicoes/voz2a-2026-11-07/conferir-pares.mjs`) now also pairs blocks that exist only in the new edition, and its outside-the-list branch, its new-block branch and its exit code have plants. The diff is `diff.patch` (base `__BASE__`, head `__CABECA__`); the engine diff, if any, is `motor/diff.patch`. Built pages under `built/` come from the `dist/` of `__DIST__`, with the previous edition of the budget document under `documento/2026-08-20/` and `document/2026-08-20/`.

## The four questions

1. **The two labels.** In the budget document and on the budget study page, does the label of the paragraph on ten years of paying down the rescue debt say the same thing in Portuguese and in English? Is «the connection is ours» or «a ligação é nossa» left anywhere on these four pages?
2. **Nothing else changed.** Did this addendum change any other sentence, number, quotation, source or attribution on these pages, or anywhere in the diff?
3. **The pair check.** Would the new version catch a sentence added to one language only, a change outside the list, and a weakened exit code? Do its plants bite?
4. **Reading it.** Would the editor of a Portuguese daily print the budget document and page as they stand, in both languages?

Budget: at most 15 tool calls.
