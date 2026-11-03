# The cold read of block OG1-E (who said the words of each quotation, by ruler, on the whole site), 02.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter, including item 10 (the quotations table: this block is about quotations; list every quotation whose lead-in changed, with its source document and whether the words and the attribution match). Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## The block

On the live Budget study and Budget dossier, five quotations put a person or a party before words that are a third party's account (rule 5: a person's statement as said, in its document). This block adds a mandatory ledger field `forma_da_citacao` (`palavras` | `relato`) to all 92 quotation rows (15 `relato`, as the director classified them), a ruler in the engine's composer and in the site's HTML gate on every route (a `relato` quotation passes only if its sentence names its document, before or after the quote, or says «pelo título da notícia», or ends «, segundo …»), a closed list of third-person reporting markers that refuses a `palavras` row carrying one, the mandate's six sentences (§3), and the recomposed studies. The mandate is `brief.md` with addendum A; the builder's reports are `relatorio-construtor.md` and the `RELATORIO-*.md` files. The site diff is `diff.patch` (base `__BASE__`, head `__CABECA__`); the engine diff and files are under `motor/`. Built pages under `built/` come from the `dist/` of `__DIST__` (a later head of the same branch: block ED1 on top, and block lote 1 merged); say if anything you see could only come from those. `CONFERIR-TUDO.md` is the director's full run on that head (two reds, both from ED1 and the merge, being fixed).

## The six questions

1. **The classification.** For each of the 15 `relato` rows and a sample of at least 15 `palavras` rows, read the excerpt (and the hosted document where it is in the package): is the declaration right? Is any `palavras` row actually a third party's account, or any `relato` row the person's own words?
2. **The five fixed lead-ins and the UTAO sentence**, word for word against the mandate's §3, in both editions, in the templates, the composed files, the records and the built pages (the Budget study and the Budget dossier). Does each now name the right document, and does the document title rendered match the ledger row's `document.title`?
3. **The other ten `relato` rows** (the Budget study and the housing study): does each sentence name its document as the ruler requires (addendum A), on the built pages?
4. **The ruler.** In the composer and in the HTML gate, on every route (studies, items, dossiers, explainers): does it refuse a `relato` quotation with the person or party as speaker and no document in the sentence? Do its plants bite (18 in the engine, 74 on the site)? Does the reporting-marker net refuse a `palavras` row with «salientou» and similar? Is the field mandatory for every quotation row (ledger check and export)?
5. **The dated update.** The Budget study now carries `updated` 02.11.2026 (block ED1 adds the first edition and the corrections entry): is the first publication date kept? Did any other study get an `updated` it should not have?
6. **The rulers that changed shape.** Did any ruler that protects a number, a source or a person get weaker?

Then the editor's question: would an editor of a Portuguese daily publish the Budget study and the Budget dossier, in both editions, with these quotations as they now read?

Budget: at most 50 tool calls.
