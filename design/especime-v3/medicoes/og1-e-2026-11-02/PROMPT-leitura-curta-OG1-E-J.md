# The short read of OG1-E's addendum J (M48), 03.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter (item 10: this addendum changes no quotation; say so in one line). Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this read covers

The previous short read (`LEITURA-CURTA-ANTERIOR.md`) found that addendum I's new voice extraction (no spaces around language marks) let a retired DGAL definition pass again, because the comparison of retired phrases is exact; that the plant for the old register entry did not run the real voice check and printed «código 1» as a literal; and that language marks could join words across block elements. Addendum J (`ADENDA-J.md`) answers them. Nothing a reader sees changes. The site diff is `diff.patch` (base `__BASE__`, head `__CABECA__`). Built pages under `built/` come from the `dist/` of `__DIST__`. `CONFERIR-TUDO.md` is the director's rebuild with the checks this diff touches.

## The four questions

1. **The retired phrases.** Does every retired phrase now bite under both the old and the new extraction, by the comparison the real voice check uses, and is the proof over all 1 238 retired lines reproducible from the package? Was any retired line removed or narrowed?
2. **The real voice path.** Do the new plants run the real `check:voz` path on a copy of the built pages and read its exit code (1 for the DGAL definition and for the old entry in both editions, 0 for the current pages)?
3. **Block boundaries.** Does the extraction keep the separator between block elements and drop it only inside inline text, with plants for both?
4. **The rulers.** Did any ruler that protects a number, a source or a person get weaker anywhere in this diff?

Then one more question: do the voice and the inventory still accept the pages as they are, both editions, with nothing a reader sees changed by this diff?

Budget: at most 30 tool calls.
