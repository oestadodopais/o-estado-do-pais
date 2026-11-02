# The cold read of block PAI1 (the proofs that read ledger rows stop breaking on the weekly re-read; the panel of 02.11 goes in), 02.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter, including item 10 (the quotations table: this block reprints no quotation; say so in one line). Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## The block

The weekly panel re-reads 91 ledger rows at their source every Monday and appends one entry to each row's `verifications`; it never changes a value. On 02.11.2026 its commit made the build fail: the HB1 proof (`ledger/provas/hb1/series.json`) stored the sha256 of four ledger files in full, so the appended re-read changed the hash. This block makes every proof that hashes a ledger row use one shared projection (the row without its `verifications` block), in JavaScript and Python with the same result, rewrites the HB1 proof with the new hashes, adds plants, and then applies the panel commit of 02.11 (91 rows re-read: 88 equal, 3 diverging, all Eurostat revisions of 29.10.2026, and the verification stamp). The mandate is `brief.md`; the builder's reports are `relatorio-construtor.md` and the `RELATORIO-*.md` files. The diff is `diff.patch` (base `__BASE__`, head `__CABECA__`). `CONFERIR-TUDO.md` is the director's full run of the `verify` list on `__DIST__`.

Addendum B (`ADENDA-B.md`) then fixed a false sentence the panel would have published: «A leitura da semana» said «90 números foram relidos na fonte, e nenhum mudou de valor nem de proveniência» while the source had revised three of them. The page now adds «; a fonte reviu 3 deles, que aqui ainda têm o valor anterior» and a section listing each one, with a ruler that recounts from the ledger. Built pages under `built/` include that page in both editions.

## The six questions

1. **What the proof still protects.** Does the projection keep every field of a row except `verifications` (value, unit, source, source URL, excerpt, dates, document, attribution)? Do the plants prove that a changed value and a changed source are still refused, and that an appended re-read passes? Is the projection cut exactly at the `verifications` block, with no way for a field written after it to escape the hash?
2. **One projection, two languages.** Do the JavaScript and Python projections give the same bytes on the four HB1 rows (find the test), and does every reader of `series.json` (`cruzamento.mjs`, `gate-html.mjs`, `check-cadeia.mjs`) use the shared one? Did the builder find other proofs hashing ledger files in full, and are they all converted or named?
3. **The new hashes.** Were the four sha256 in `series.json` recomputed from the rows of `main` by the script (not by hand), and do they match the projection of the rows as they are at the head?
4. **The panel.** Is the panel commit the same as `7b743d896` (91 rows, `result` and `found` as the panel wrote them, the stamp `verificadoEm: '2026-11-02'`, `alarmes: 3`)? Are the three divergences recorded as `diverge` with the source's new values (17.0, 8.0, 7.6) while the published values stay as sealed?
5. **The weekly reading.** In both editions, are the counts in the opening sentence and the list right against the ledger's `verifications` in the window (re-read, changed by correction, diverging and not yet applied)? Is each listed entry right (name, period, published value with its unit, the source's new value as the source writes it, the date), with the seal after the whole measure? Does the ruler recount independently, and do its plants bite? Is «90» right when the panel re-read 91 rows (the builder says two rows are one merged measure)? Does the page read in a sensible order (the sentence and the list)?
6. **The rulers.** Did any ruler that protects a number, a source or a person get weaker?

Then the editor's question, for the pages this block changes (the verification stamp): would an editor publish them as they stand?

Budget: at most 45 tool calls.
