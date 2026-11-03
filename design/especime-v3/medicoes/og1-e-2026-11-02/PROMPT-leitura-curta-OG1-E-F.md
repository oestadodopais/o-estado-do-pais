# The short read of OG1-E's addendum F (M48), 03.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter, including item 10 (the quotations table: this addendum changes how the housing study frames press reports; give the table for every row of the chronology passage and of paragraph 6). Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this read covers

The previous short read (`LEITURA-CURTA-ANTERIOR.md`) found that the chronology passage of the housing study gave press reports as the words of the organisers, the PSP and the fire commander, that the forms ruler accepted a report with the attribution alone, that the receipt ruler passed a page with one right and one wrong publisher, that the site index called the project's own recount «a fonte reviu para cima», and that text-valued rows still rendered as measure cards. Addendum F (`ADENDA-F.md`) answers them. The site diff is `diff.patch` (base `__BASE__`, head `__CABECA__`); the engine diff is `motor/diff.patch`. Built pages under `built/` come from the `dist/` of `__DIST__`. `CONFERIR-TUDO.md` is the director's full run on that head.

## The six questions

1. **The reports.** Does every `relato` row, on every built page in the package, sit in a sentence that names the report that carries it (its own document token, or the same document named once in the same sentence)? Read the chronology and paragraph 6 of the housing study in both editions against the hosted articles (`imprensa-6`, `-7`, `-8`, `-9`): is each count and each quoted phrase given as the source gives it, with nothing a source does not say?
2. **The ruler of reports.** Does it now refuse the attribution alone, in the compositor and in the HTML gate, with the three plants of §1, and does it accept two rows of one document with the title named once?
3. **The receipt ruler.** Does it now read every element marked as the publisher and every «Publicado por» / «Published by» text, including the meta description, and refuse a page where one is wrong?
4. **Text off the grids.** Are the 21 text cards gone from the housing area page in both editions, is each of their rows still reachable from the study, and do the label inventory's changes match exactly those cards?
5. **The index and the edition.** Does the index say «recontado por este projeto» / «recounted by this project» for the project's rows only? Is the housing study's current edition dated 03.11.2026 with one register entry worded as §6 writes it, the first saved edition (29.10.2026) unchanged, and the proof of what changed between them reproducible?
6. **The rulers.** Did any ruler that protects a number, a source or a person get weaker anywhere in these diffs?

Then the editor's question: would an editor publish the housing study's chronology and paragraph 6, the register page and the area page as they stand?

Budget: at most 40 tool calls.
