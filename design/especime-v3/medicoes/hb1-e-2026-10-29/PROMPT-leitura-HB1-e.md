# A leitura a frio do bloco HB1-e (a avaliação bancária de setembro de 2026 no estudo da habitação), 29.10.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter, including item 10 (the quotations table; this block adds no quotation, so say so in one line if that is what you find). Then this section.

## The block

A dated update of the study «A casa em Portugal e na Europa»: two rows sealed from the first paragraph of INE's press release of 27.10.2026 on the bank appraisal of housing for September 2026 (the median value, 2 278 euros per square metre, and its year-on-year change, 14,2 %), one new sentence in section 6 («O crédito» / «Credit»), the calendar paragraph of section 11 rewritten, and the edition dated 29.10.2026, in both editions. The mandate is `brief.md`; the builder's report is `relatorio-construtor.md`; the site diff is `diff.patch`; the engine side is under `motor/` (its diff `motor/diff.patch`, the changed engine files, the hosted INE page and PDF with `motor/corpos-alojados.json` and their declared sha256; a body that does not match is Blocking); the site head is `__CABECA_SITIO__` and the engine head is `__CABECA_MOTOR__`.

## The five questions of this block

1. **The two rows against the PDF.** Open the hosted PDF (`pdftotext -layout` on page 1) and check that `hab-ine-avaliacao-mediana` (2 278, €/m2, 2026-09, published 2026-10-27) and `hab-ine-avaliacao-homologa` (14,2, %, same period and date) are what the paragraph that starts «O valor mediano de avaliação bancária» says, that the excerpt is that paragraph word for word, that the document binding uses the inquiry's name with the cedilha («INQUÉRITO À AVALIAÇÃO BANCÁRIA NA HABITAÇÃO») and the date «27 de outubro de 2026», and that the receipt's sha256 equals the file's. Is the unit the one the study already uses for INE prices («€/m2»)?
2. **The sentences as printed.** On the built study pages, both editions, is the new sentence of section 6 exactly the mandate's §2.2 wording with the tokens rendered (2 278, setembro de 2026 / September 2026, 14,2), and is the section 11 paragraph exactly the mandate's, with the Budget sentence changed to «teve o debate e a votação na generalidade marcados para» / «had its first-reading debate and vote scheduled for» and the pointer to the Budget item? Does anything else in the study text differ from the previous edition? Does any sentence talk about the house itself?
3. **The edition and its date.** Does the study page say «publicado a 29.10.2026» in both editions; do the records (`registos/`), the manifest and the news box carry the new edition; is the previous edition kept the way the HB1-30 mechanism keeps it; do the two row pages exist in both editions with the right value, unit, period, publication date and source?
4. **The lists.** Families (`nomes-hb1.mjs` and what the generators produce), units, places, the inventory rows (section 6 and 11 sentences, both editions, block `hb1-e`), the L1 ceiling, `leituras-provadas.json`, the builders' map: present and consistent; no existing row of the housing ledger changed its value; no `ledger/claims/*.yml` of an existing row changed; no corrections entry.
5. **Nothing else moved, and the report's numbers reproduce.** The study ledger goes from 194 rows to 196; the site gains exactly two claim files; reproduce every count in the report from the package, and say which measurements the report backs with an output folder and a `.codigo` file.

Then the editor's question: would an editor of a Portuguese daily print the two sentences and the two row pages as they stand?

Budget: at most 50 tool calls. Write nothing but your report.
