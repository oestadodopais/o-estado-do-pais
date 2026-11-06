# The cold read of batch 7 (HIG-5 A and B), 06.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this batch does

The weekly hygiene block, in two passes, on a branch from the head that landed REL1:

- **HIG-5 A (machinery):** the landing script stops refusing a third landing in a UTC day (it counts them in the receipt); it rebuilds `dist/` when `dist/version.json` names another commit; it refuses a queue that the launcher's own queue reader refuses; the mandate check refuses a count of three or more digits in a mandate's `§0` that is not in the measurements file the mandate declares; the frequency ruler of REL1 looks at a recent window, catches more frequency words, ties a word to its declared period and gets a plant at the gate's call site; `tests/metodo/construido.mjs` enters `verify`; a comment and a version tag in `portao.yml`. The mandate is `brief-HIG-5-A.md`.
- **HIG-5 B (one reader sentence):** the no-answer state on four receipts per edition reads «Sem resposta a 01.09.2026 · na conferência automática» / «No answer on 01.09.2026 · in the automated check». The mandate is `brief-HIG-5-B.md`.

The site diff is `diff.patch` (base `__BASE__`, head `__CABECA__`). Built pages under `built/` come from the `dist/` of `__DIST__`. `CONFERIR-TUDO.md` is the director's full run on that `dist/`.

## The six questions

1. **The landing.** Can the landing now land a head whose queue the launcher would refuse, or deploy a `dist/` from another commit? Is the third landing of a day still counted in the receipt? Do the tests prove each of these?
2. **The `§0` check.** Does it refuse a count outside the measurements file, a `§0` with counts and no `Medidas:` line, and an entry without a command? Does it let through dates, times, years, section and rule numbers, file-line references, quoted text and small numbers, and nothing else? Can a count slip through by its formatting (a non-breaking space, a dot as thousands separator, a decimal point)?
3. **The frequency ruler.** Is the window exactly the last four periods before the build date, with the gap from the last date to the build always checked? Does the word list catch the listed forms after normalisation, in both languages? Does an author in the table with a word of another period go red? Does the plant at the gate's call site bite? Would the ruler pass on the real ledger today?
4. **The sentence.** Does the no-answer state read exactly as `brief-HIG-5-B.md` §1 writes it, wherever a page prints it, with no old form left? Is the check's copy still an independent copy?
5. **The rulers.** Did any ruler that protects a number, a source or a person get weaker anywhere in this diff?
6. **Reading it.** As a reader would, in both editions, read the receipts in `built/`. Would the editor of a Portuguese daily print them as they stand?

Budget: at most 40 tool calls.
