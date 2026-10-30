# The cold read of block DO4 (the dossier row of the «O que há de novo» box in the box's three columns), 30.10.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter, including item 10 (the quotations table: this block reprints no quotation; say so in one line). Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## The block

The funder, as a reader, sent a desktop screenshot of the front page's «O que há de novo» box: every row is three columns (date, type, title), but the dossier row was one line across all three, with the label «Dossiê» under the dates, the title mid-row, the date at the end, four type styles and the fragment «, a mais recente de». This block renders the dossier row with the three children of the other rows (the most recent piece's date in the date column; «dossiê» / «dossier» in the type column; one link to the dossier with «⟦title⟧ · ⟦n⟧ peças» / «⟦title⟧ · ⟦n⟧ pieces» in the title column), the count kept as the proof key `dossie_pecas_*` but drawn in the title's type. The mandate is `brief.md`; the builder's report is `relatorio-construtor.md`. The diff is `diff.patch` (base `__BASE_SITIO__`, head `__CABECA_SITIO__`). Built pages under `built/`: the front page in both editions. `CONFERIR-TUDO-a.md` is the director's full run of the `verify` list on this head.

## The five questions

1. **The row.** In both editions of the built front page, does the dossier row have the same three children as the other rows, in the same grid columns, with the date being the most recent piece's date (and its `datetime`, `data-nonledger` and `data-data-origem` as the dossier date had before), «dossiê» / «dossier» as the type, and one link to the dossier carrying the title and the count? Are the box's order and its five entries unchanged?
2. **The count.** Is the count still a `data-prova` element with the key `dossie_pecas_<slug>`, inside the link to the dossier, recounted by the HTML gate; and does it now take the title's type, weight and colour?
3. **The sentences.** «dossiê» / «dossier» and «⟦title⟧ · ⟦n⟧ peças / pieces» (singular «1 peça» / «1 piece») word for word in both editions; the old box form («Dossiê · …, a mais recente de …») gone from the box only; the dossier lists of the doors, «Temas» and the index unchanged; no dash; no sentence about the house.
4. **The rulers.** For each ruler the block changed (the news-box test, `scripts/voz-pais.mjs`, `scripts/dossies-html.mjs`, `check:datas`, L1, the touch-target and touch-path rulers, the sentence inventory): does it read the shared function, does a plant prove it still bites, and did any ruler that protects a number, a source or a person get weaker?
5. **Reading it.** At desktop width and at phone width (look at the CSS and the built HTML): would the row now sit in the box like the others? Does the box still read in date order? Would a reader understand «dossiê» as a kind of entry next to «estudo» and «explicação»?

Then the editor's question: would an editor of a Portuguese daily publish the front page's box, in both editions, as it stands?

Budget: at most 45 tool calls.
