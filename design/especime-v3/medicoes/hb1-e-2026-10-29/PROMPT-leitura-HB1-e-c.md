# A leitura curta (M48) da correção HB1-e-b, 29.10.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter, including item 10 (the quotations table; this block adds no quotation, so say so in one line if that is what you find). Then this section. This is a short read of a correction: the package's diff runs from the head the cold read saw (site 5e34c1c9, engine d009180) to the corrected heads (site `__CABECA_SITIO__`, engine `__CABECA_MOTOR__`); `brief.md` is the correction addendum (its §1 to §4 are the mandate of this diff), `LEITURA-ANTERIOR.md` is the cold read that produced it, `relatorio-construtor.md` the builder's report of the correction, and `RELATORIO-PARAGEM.md` and `RELATORIO-ANTERIOR.md` the earlier reports. The engine side is under `motor/`.

## The five questions of this correction

1. **The two definitions as printed.** On the built row pages of `hab-ine-avaliacao-mediana` and `hab-ine-avaliacao-homologa`, both editions, under «O que é este número» / its English label, is the text exactly the addendum's §1, with the period token rendered («setembro de 2026» / «September 2026»)? Do the words stay faithful to the INE page («realizada no âmbito de pedidos de crédito para a aquisição de habitação»; «Em comparação com setembro de 2025») and does the definition of the median say nothing the source would contradict?
2. **The section 6 sentence keeps the measure.** Both editions of the built study page print the addendum's §2 sentence word for word, with «O valor mediano da avaliação bancária das casas» / «The median bank appraisal of homes», and the tokens render 2 278, the period and 14,2.
3. **Section 11 speaks of the country.** Both editions print exactly the addendum's §3 paragraph; no «nesta edição», no «deste projeto», no Budget sentence; the calendar rows are not cited by any text any more and no gate complains; nothing else in the study text changed between the two heads.
4. **The composer prunes again.** `scripts/compor-familias-hb1.mjs` removes every audit entry carrying an HB1 key before rebuilding, keeps reading the JavaScript declaration, and has a plant (a family whose keys change) that proves the stale entry disappears; the generated files are consistent with the declaration.
5. **Nothing else moved, and the report's numbers reproduce.** No row value, period, publication date or excerpt changed; no `ledger/claims/*` file other than the inventory-driven ones; the inventory rows for the four sentences and the two definitions are present (both editions, block `hb1-e`) and the old sentences retired; the L1 unchanged or remeasured with its plant; say which measurements the report backs with an output folder and a `.codigo` file.

Then the editor's question: would an editor of a Portuguese daily print the two row pages and the two study paragraphs as they now stand?

Budget: at most 40 tool calls. Write nothing but your report.
