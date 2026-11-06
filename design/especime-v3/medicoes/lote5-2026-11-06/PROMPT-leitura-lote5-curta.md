# The short read of MET1 addendum D (M48), 06.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this read covers

`LEITURA-lote5.md` is the cold read of batch 5 on the head `__BASE__`; its findings 6, 10 and 11 were real, and `ADENDA-D.md` answers them: the example receipt of the Método with the fields of its own receipt page, and the sentence of step 6 rewritten by the director. The site diff is `diff.patch` (base `__BASE__`, head `__CABECA__`). Built pages under `built/` come from the `dist/` of `__DIST__`: the Método and the receipt page of the example row, in both editions. `CONFERIR-TUDO.md` is the director's targeted run on that head. `scripts/leituras/aterrar.py` is the landing script of the head, for question 2.

## The four questions

1. **The example receipt (`ADENDA-D.md` §1.1, §1.2).** In both editions, does the field «onde está no documento» / «where it is in the document» print the row's locator exactly as the receipt page of that row prints it, from the same field and with the same language mark, with the edition gone and no reference date? Is the name above the receipt the title the receipt page prints in its `h1`, read from the ledger and not written by hand? Do the new plants bite, and does the gate now refuse the edition in place of the locator?
2. **The sentence of step 6 (`ADENDA-D.md` §1.3).** Does it read exactly as written, in both editions, with the count from the proof token? Is it true against what the landing script does before merging into `main` and against what the count counts? Did any other sentence of the Método change?
3. **The rulers.** Did any ruler that protects a number, a source or a person get weaker in this diff?
4. **Reading it.** Read the Método as a reader would, in both editions. Is anything a reader saw before this fix now missing or wrong?

Then the editor's question: would the editor of a Portuguese daily publish this page as it stands?

Budget: at most 20 tool calls.
