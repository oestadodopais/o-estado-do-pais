# The cold read of block SEL1 (the «fonte» seal after the whole measure, on every page, with the ruler that keeps it there), 02.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter, including item 10 (the quotations table: this block changes no quotation; say so in one line, after checking that no quotation's words moved). Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## The block

The funder, as a reader, showed on 02.11.2026 that the seal «fonte» sat between a number and its unit («79 ■ fonte milhões de euros»), and three seals stacked at the end of one sentence, and asked that the fix hold for the whole site, now and later. The director measured it on the live pages; the builder measured it on the whole built site: 1 165 seals before a unit and 29 stacked pairs, in 9 817 pages. This block moves every seal to after the whole measure, through one shared list of units closed by class (magnitudes, currency, percentage and points, multiples, time), and adds `check:selos`, a ruler over every built page that refuses a seal before a unit and two seals in a row. It changes no word, no number and no ledger row. The mandate is `brief.md` with addenda A to D; the builder's reports are `relatorio-construtor.md` and the `RELATORIO-*.md` files. The diff is `diff.patch` (base `__BASE__`, head `__CABECA__`). Built pages under `built/` come from the `dist/` of `__DIST__`, which may be a later commit of the same branch (block PAI1, which changes only the verification stamp and the proofs of four ledger rows); say if anything in a built page could only come from PAI1. `CONFERIR-TUDO.md` is the director's full run of the `verify` list on that head.

## The six questions

1. **Every seal after the whole measure.** In the built pages (both editions), is there any seal still before a unit of the list, any two seals in a row, or any seal now after the wrong measure (after a unit that belongs to the next figure, or past a comma into the next clause)? Count yourself on at least the Budget study, the Budget dossier and the Évora study.
2. **The seal still belongs to its figure.** For a sample of at least twenty moved seals across the pages, does each seal's link (`href`, `data-*`) point to the ledger row of the figure it now follows, and does the figure keep its `data-registo` / `data-registo-row`? Does the HTML gate still refuse a seal that points to the wrong row (find the plant and say whether it bites)?
3. **No word changed.** Is the text of every document unchanged (the builder says 4 324 blocks without differences)? Check that the read-text proof and the composed-sentence rulers still compare the same text, and that moving a seal never moved a character of a document.
4. **The ruler and the list.** Does `check:selos` read the shared list, cover every built page in both editions, and run in `verify` and in the `portão` run? Do its plants bite (a seal before «milhões», a seal before «%» in English, two seals in a row) and does the control pass? Is the list closed by the five classes of addendum C, and does a word outside them stop the build rather than pass silently?
5. **The rulers that changed shape.** For each ruler the diff changes (the HTML gate, C6, the inventory, the read-text proof, the discussion title door, the touch targets): does it keep what it protects, with a plant that bites? Did any ruler that protects a number, a source or a person get weaker?
6. **Reading it.** Read the Budget dossier's opening and three paragraphs of the Budget study with many figures, in both editions: does each measure now read whole, with the seal after it? Are the dates of the dossier opening each followed by their own seal, with no seal on the year inside the budget's name?

Then the editor's question: would an editor of a Portuguese daily publish these pages, in both editions, as they stand?

Budget: at most 50 tool calls.
