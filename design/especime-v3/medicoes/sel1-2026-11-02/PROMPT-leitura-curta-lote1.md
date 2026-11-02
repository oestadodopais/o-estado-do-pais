# The short read of the corrections to blocks SEL1 and PAI1 (M48), 02.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter, including item 10 (the quotations table: these corrections change no quotation; say so in one line). Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this read covers

Two cold reads earlier today (`LEITURA-SEL1.md`, `LEITURA-PAI1.md` in this package) found real problems in blocks SEL1 (the «fonte» seal after the whole measure on every page, with the ruler `check:selos`) and PAI1 (the proofs that read ledger rows, the weekly panel, and the weekly-reading page). The corrections are in `diff.patch` (base `__BASE__`, head `__CABECA__`): PAI1's addendum C (`ADENDA-C-PAI1.md`) and SEL1's addenda F to I (`ADENDA-F.md` to `ADENDA-I.md`). Built pages under `built/` come from the `dist/` of `__DIST__`. `CONFERIR-TUDO.md` is the director's full run on that head.

## The six questions

1. **PAI1's findings 6, 7, 9 and 10, and the English decimals.** Is the RP4-n link between the site's and the engine's bytes restored (both projections compared, `confereRotulos` requiring their equality again, plants for a changed label and for an engine-site difference)? Does the weekly page count lines (91) and list every pending revision including merged measures? Does each entry carry the card's existing definition? Does the counts sentence open the page? Does the English page use the decimal point in the list?
2. **SEL1's findings 5 and 6.** Is every measure whole now, including its complement («do PIB», «por mês», «por metro quadrado», «% do produto interno bruto (o PIB)») and full dates («16 de outubro»)? Count on the built Budget study, the Budget dossier, the housing study and the discussion page, in both editions. Does `check:selos` judge the text as rendered (any whitespace), refuse the new forms the addenda name («por/per» + unknown word, a month after a day, English «a» + unknown time unit), and let ordinary prose after a whole measure pass? Do its plants bite?
3. **The nine hand-placed seals.** For each (`src/lib/posicao-do-selo.mjs` and the test that fixes them), does the phrase the seal follows say what the seal's ledger row says (the excerpts are in the ledger files copied or in the builder's report)? In particular the two Health seals in the paragraph and in the conclusion of the Health item.
4. **The year and the padding.** Is the visible seal hidden only for a year inside the budget's name, and are the padding spaces gone from the dossier opening?
5. **The rulers.** Did any ruler that protects a number, a source or a person get weaker anywhere in this diff?
6. **Reading it.** Read the weekly page and two paragraphs of the Budget study with many figures, in both editions: do they read whole and in order?

Then the editor's question: would an editor publish these pages as they stand?

Budget: at most 45 tool calls.
