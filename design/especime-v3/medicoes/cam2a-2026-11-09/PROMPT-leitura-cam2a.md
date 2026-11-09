# The cold read of CAM2-A, 09.11.2026

Reader: Claude Opus 5.5 (`leitor`, xhigh). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this block does

**CAM2-A (site), the first pass of «layer 2»:** sentences that attribute, give a cause or claim something about a source get the provenance that numbers already have.

- **The detector.** A script with no model finds such sentences (attribution and cause markers, in both languages) in the reader pages: studies, items, dossiers, theme entries, explainers and the corrections register.
- **The register.** In `ledger/frases/`, each registered sentence is an entry with its Portuguese and English text and the ledger rows whose excerpts support it.
- **The coverage check.** `check:frases-afirmacao` refuses a detected sentence that is neither registered nor on the list of sentences still to register (`ledger/frases/por-registar.json`). That list may only shrink, across the whole history.
- **M83 in `ledger:check`.** Every ledger row that declares `document.source_sha256` must have its stored document, found by sha256.

The mandate is `brief.md`, with `ADENDA-A.md` and `ADENDA-B.md` on top. The final report is `relatorio-construtor.md`. The earlier reports and the measurement files are in the diff, under `design/especime-v3/medicoes/cam2a-2026-11-09/`.

The diff is `diff.patch` (f362f5ccd..f1b98c701). The two archived interim patches are left out of it; the final implementation is commit e6e7c914f inside the range. The site worktree, at <instrumentos>/OEstadoDoPais-worktrees/cam2a-2026-11-09, has a `dist/` built at f1b98c701. You may read it and run its scripts there, without network, writing only to a temporary folder outside the worktree. The engine at 9cdd232 is at <instrumentos>/ResearchHub-worktrees/coragua-2026-11-08 (read only). The stored documents of the 21 support rows are in `motor/` with their receipts.

## The questions

1. **The detector.**
   - Are the markers in both languages what the brief and addendum A ask?
   - Do the real planted sentences (`tests/leituras/frases-afirmacao-reais.json`) bite both ways?
   - Is the scope right? Is any reader page with prose left out without a stated reason?
   - The per-study table in the report shows very uneven counts between the languages for some studies. Examples: `evora-os-pelouros-quem-os-teve-o-que-fizeram`, 60 pt and 3 en; `evora-quem-governou-a-camara-2009-2025`, 42 and 1; `alentejo-algarve`, 1 and 38. Is that the detector, or a real difference between the editions' pages? Look at the pages in `dist/` and say which.
2. **The 22 register entries.**
   - Is each quotation word for word in the excerpt of one of its rows?
   - Is each row's excerpt in its stored document?
   - Is the English entry the pair of the Portuguese one, the same sentence in the other edition?
   - Name any entry whose sentence says more than its rows' excerpts. For example, the Conselho das Finanças Públicas entry ends with «onde entram as parcerias público-privadas». That is the next layer's job (the judge), but say what you see.
3. **The list only shrinks.** Can it grow without a refusal: locally, on GitHub, through a merge, a rebase, a shallow clone, a deleted and restored file, or a sentence moved between studies? Is the initial list really the measured one (the sha256)?
4. **M83 in `ledger:check`.**
   - Are all 795 rows checked by sha256 against the engine's stored documents and the site's archived editions?
   - Without the engine (the GitHub run), does the check say it did not read the documents, and does the landing read its own code with the engine?
   - Can a row with a missing document ever pass?
5. **The pages.** Does anything a reader sees change, other than the Método's check count (67 to 68, both editions)? `built/` has both Método pages.
6. **Would the next block's builder be misled?** Is the README of the ledger clear on how a new or rewritten claim sentence gets its entry?

Budget: at most 45 tool calls.
