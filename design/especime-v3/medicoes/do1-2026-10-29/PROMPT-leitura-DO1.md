# A leitura a frio do bloco DO1 (os dossiês), 29.10.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter, including item 10 (the quotations table; the dossier pages must reprint no quotation, so the table should be empty for them, and you say so). Then this section.

## The block

The editorial seat decided on 29.10.2026 that the site gains one layer, the dossier: one page per living subject gathering everything the project has on it, by layer, each piece with its first sentence and its date; the first two are «O Orçamento de 2027» and «A casa em Portugal». The mandate is `brief.md`; the builder's report is `relatorio-construtor.md`; the diff is `diff.patch`; the site head is `__CABECA_SITIO__`. There is no engine side.

## The five questions of this block

1. **The data and its guards.** Is `src/data/dossies.mjs` exactly the mandate's §2.1 (the two dossiers, their doors, their pieces by layer, the calendar row), and does its import-time check refuse a slug that does not exist in `WORKS`, `ITENS` or `EXPLICACOES`, a dossier without a piece, a piece in two dossiers, and a malformed slug? Test the refusals yourself from the copied files where you can.
2. **The pages as printed.** On the built `/dossies/`, `/dossies/orcamento-2027/`, `/dossies/a-casa-em-portugal/` and their English routes: the title, the scope sentence and the two opening sentences exactly as the mandate's §3 with the three tokens rendered from the ledger rows (`pm-q3-3-r37-c3`, `og1-votacao-generalidade`, `oe-2027-calendario-final-global`); the sections present only when they have content, in the mandate's order and with its labels; each piece shown by the existing components with its date; no number printed that is not a token; no sentence about the house itself; no quotation reprinted.
3. **The links.** Does each of the three Budget items, the Budget study, the Budget explanation and the housing study carry the «Dossiê: … →» line to the right dossier, in both editions, and do pieces outside the two dossiers carry none? Does every entry of «O que há de novo» for a piece in a dossier name the dossier with a link, and the others not? Do the doors «Estado e economia» and «Habitação» show a «Dossiês» section before their studies, the other doors none, and does «Temas» list the dossiers at the end?
4. **The closed lists.** The routes, the site index and the sitemap list the new pages (`check:indice-do-sitio` green); the language strings exist in both editions; the inventory carries the openings, scopes and labels in block `do1`; the L1 ceiling and the receipts of the two openings; the front page's news box tests; the builders' map. Reproduce each count the report gives.
5. **Nothing else moved.** No ledger row, no item sentence, no study sentence, no explanation sentence, no menu change, no change to the front page beyond the dossier names in the news box; no corrections entry. Say which measurements the report backs with an output folder and a `.codigo` file.

Then the editor's question: would an editor of a Portuguese daily publish the dossier pages as they stand, and would a reader coming from the front page understand in one glance what a dossier is?

Budget: at most 60 tool calls. Write nothing but your report.
