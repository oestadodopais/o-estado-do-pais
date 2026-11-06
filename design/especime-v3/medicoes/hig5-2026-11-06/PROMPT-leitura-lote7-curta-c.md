# The short read of HIG-5 addendum C (M48), 06.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this read covers

`LEITURA-lote7.md` is the cold read of the head `__BASE__`; its finding 6 (Major) showed that the mandate check on `§0` counts let through a count at the end of a sentence, dot-grouped numbers and point decimals, and findings 7 and 8 are of the same family. `ADENDA-C.md` is the correction. The site diff is `diff.patch` (base `__BASE__`, head `__CABECA__`). `CONFERIR-TUDO.md` is the director's targeted run on that head.

## The three questions

1. **The counts.** Does `numeros_do_zero` now return, for each of the eight lines in the table of `ADENDA-C.md` §0, exactly what the table says it must? Can a count still slip through by its punctuation or its separators? Does any exception of the mandate (dates, times, years, `§` and rule numbers, backticks, «» text, numbers glued to a letter, a hyphen or an underscore) now produce a count?
2. **The frequency words.** Does the ruler catch every form `ADENDA-C.md` §1.3 lists, after the normalisation it orders, and tie «semi-annual», «semi-annually», «half-yearly» and «biannual» to 182 days? Does anything that was caught before stop being caught?
3. **Nothing else.** Did any other ruler or any reader sentence change in this diff?

Budget: at most 15 tool calls.
