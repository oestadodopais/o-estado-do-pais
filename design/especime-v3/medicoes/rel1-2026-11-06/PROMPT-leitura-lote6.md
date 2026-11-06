# The cold read of batch 6 (REL1 0 and REL1), 06.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this batch does

One block in two passes, on a branch from `main` after batch 5 landed on 06.11.2026 at 14:38 UTC:

- **REL1 0 (machinery):** the mandate voice check (`scripts/leituras/voz-do-mandato.py`) exempts a mandate whose single `Página:` declaration is `linha`, beside `metodo` and `sobre`, because the site's voice inventory does not measure the receipt route. The mandate is `brief-REL1-0.md`.
- **REL1 (content):** on the receipt of each ledger row, the label of the automated file check stops saying «daily» (the check ran on two days only, 01.09 and 03.09.2026), and the state of a source that did not answer says one dated observation instead of «since», which claimed a continuity nobody observed. A new ruler in `scripts/gate-html.mjs` refuses a checker label that names a frequency the ledger's dates do not bear out. The mandate is `brief-REL1.md`; its §0 holds the measurements.

The site diff is `diff.patch` (base `__BASE__`, head `__CABECA__`). Built pages under `built/` come from the `dist/` of `__DIST__`. `CONFERIR-TUDO.md` is the director's full run of the whole list on that `dist/`. The builder's reports are `RELATORIO-*.md`. The builder found 3 476 renderings of the label per edition where the mandate's §0 says 3 472; the director's count was an incomplete sum, and 3 476 equals the ledger's entries.

## The six questions

1. **The sentences.**
   - Do the label and the no-answer state read exactly as `brief-REL1.md` §1 writes them, in both editions, wherever a page prints them, with no old form left anywhere in `built/`?
   - Is each new sentence true of what the ledger and `src/data/fontes.mjs` record? In particular, is the date printed after «Sem resposta a» / «No answer on» a day on which the check actually observed no answer?
   - Are the copies in the gate and in `tests/linha/sem-resposta.mjs` still independent copies of the text, and not imports of the production table?
2. **The frequency ruler.**
   - Does it read the dates from the ledger and the build date from `dist/version.json`, and not from anything the production code computes?
   - Does it check both the longest gap between consecutive distinct dates and the gap from the last date to the build, against twice the period?
   - Does it refuse a frequency word, in both languages and in the plural, for an author outside its table?
   - Do the three plants bite? Would the ruler pass on the real ledger today?
   - Is there a way for a label to name a frequency and pass, such as English only, a capital letter, or a word the list does not hold?
3. **The class across the site.** Is there any other sentence in `built/` in which the site describes its own checking with a frequency or a continuity («every day», «since», «weekly») that the ledger's dates do not bear out? Sentences that describe a source, such as a register that republishes daily, are outside the class.
4. **REL1 0.** Is the exemption limited to one `linha` declaration in the header, and do the existing refusals still bite: no declaration, two declarations, a page outside the list? Is any other mandate check weaker?
5. **The rulers.** Did any ruler that protects a number, a source or a person get weaker anywhere in this diff (`check:fontes`, `check:cartao`, `gate:html`, the repository map's checker)?
6. **Reading it.** As a reader would, in both editions, read the receipts in `built/`, the penalty receipt with its unanswered source and the Évora payment-time receipt with its two file checks. Is there any sentence in which the site talks about itself, says what it does not do, or apologises?

Then the editor's question: would the editor of a Portuguese daily publish these receipts as they stand? Is «Sem resposta a 01.09.2026 · à conferência automática» natural Portuguese for that reader, and «No answer on 01.09.2026 · to the automated check» natural English?

Budget: at most 40 tool calls.
