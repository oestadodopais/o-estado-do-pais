# The short read of HIG-6A addendum F, 08.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What changed

The short read of addenda C to E (`LEITURA-hig6a-curta.md` here) found that layer 0 compared list text with page text in more than one way: pairs and naming used blocks without source chips, while presence searched with them, so entries whose `frase` carries a chip (V009, V121 of VOZ-2B) skipped the pair rule; and a 12-character FICA fragment could name longer ruler-caught sentences. Addendum F (`ADENDA-F.md`) makes one search function serve presence, pairs, `indicesComEntrada` and `nomeada`, makes a FICA name a caught sentence only when it is that whole sentence, and adds boundary plants (11 vs 12 characters) and the VOZ-2B counts to the real-case replay. The diff is `diff.patch` (base `__BASE__`, head `__CABECA__`).

## The three questions

1. **One search everywhere.** Do all four places now use the same function, with and without chips? Does a REESCREVE with a chip in its `frase`, in a bilingual study, get its pair checked (and refused when the twin is missing)?
2. **FICA by the whole sentence.** Can a FICA fragment still name a longer caught sentence? Can a REESCREVE or SAI still name the sentence it changes?
3. **Nothing weaker.** Did any rule, plant, exit path or `verify` entry get weaker in this diff? Do the boundary plants and the pinned VOZ-2B counts bite?

Budget: at most 15 tool calls.
