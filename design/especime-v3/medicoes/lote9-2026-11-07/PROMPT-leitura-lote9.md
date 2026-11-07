# The cold read of batch 9 (ND1 and ED3), 07.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this batch does

- **ND1:** twelve ledger rows carry the value «N.d.» exactly as the Portuguese local-government directorate (DGAL) prints it in place of a number. Pages used to glue the unit to it («N.d. dias», «N.d. euros») in the page title, the description, the receipt value and the copy-to-cite snippet. Now no unit follows a source's absence mark anywhere, and the receipt says pt «A fonte publica «N.d.» em vez de um valor.», en «The source publishes «N.d.» instead of a value.». The mandate is `brief-ND1.md`, with `ADENDA-A-ND1.md`.
- **ED3:** a study with more than one stored edition used to list its editions and then repeat every date in «publicado a … · atualizado a … · corrigido a …». Now the header is one line, one element per date, each date a door to its edition: «publicado a 01.10.2026 · atualizado a 03.11.2026 · corrigido a 06.11.2026 (atual)»; the band on each version of the document is the same line, with the version being read marked and unlinked. The mandate is `brief-ED3.md`.
- The batch also carries the site records of VIG2, an engine block that landed on the engine already (the daily watch summary split into parts); no page changes from it.

The site diff is `diff.patch` (base `__BASE__`, head `__CABECA__`). Built pages under `built/` come from the `dist/` of `__DIST__`. `CONFERIR-TUDO.md` is the director's full run on that `dist/`.

## The six questions

1. **ND1, the forms.** On every built page, is any absence mark still followed by a unit, in text, title or attribute? Does every receipt of such a row carry the sentence in its language, word for word, with «N.d.» marked Portuguese in English? Is the source's own excerpt untouched? Does the ruler use a closed list of marks, so a new mark cannot slip in unnoticed?
2. **ED3, the line.** For each multi-edition study, does the header give each date once, in manifest order, with the right word for each date by its nature, «(atual)» / «(current)» on the last, and each date a door to its own edition? Is the publication date the one the page printed before? Are the separators hidden from screen readers?
3. **ED3, the bands.** Does each version's band show the same line, with the version being read marked «(esta edição)» / «(this edition)», unlinked and `aria-current="page"`? Is the old band sentence gone everywhere?
4. **What must not change.** Are the headers of single-edition studies (the four updated ones included) exactly as before? Did any value, excerpt, date or route change?
5. **The rulers.** Did any ruler that protects a number, a source, a date or a person get weaker? Does each new plant bite?
6. **Reading it.** As a reader would, in both editions, read the receipts of the Évora and Penedono rows and the headers and bands of Évora 2027 and the 2027 budget study. Would the editor of a Portuguese daily print them as they stand?

Budget: at most 40 tool calls.
