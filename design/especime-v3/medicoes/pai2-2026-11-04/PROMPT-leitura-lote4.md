# The cold read of batch 4 (PAI2 and VOZ-1), 03.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter, including item 10 for any sentence that reports what a source or a person said. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this batch does

Two blocks stacked on one branch, on top of batch 3 (LAR1 and FP3, landing at 00:00 UTC of 04.11):

- **PAI2:** the country in one table per theme on the Temas page, every measure of the seven doors with Portugal, the year, the previous value, the Union and the Commission's reference, linked to its card. Where the source has revised a figure that is not yet applied, the measure says so. The mandate is `brief-PAI2.md` (02.11.2026, with a note of 03.11.2026), plus addenda A (`ADENDA-A-PAI2.md`, a measure with no earlier period) and B (`ADENDA-B-PAI2.md`, the three browser checks).
- **VOZ-1:** reader pages stop talking about themselves. The mandate is `brief-VOZ-1.md`. It covers:
  - the two explainers of public money (the section «Como ler estes números»);
  - the front page's weekly re-reading line;
  - the «[a verificar]» marker, which becomes «por confirmar na fonte»;
  - what the agenda, the source calendar and the corrections register show;
  - three guards: in the mandate, in the build and in the reading.

The site diff is `diff.patch` (base `__BASE__`, head `__CABECA__`). Built pages under `built/` come from the `dist/` of `__DIST__`. `CONFERIR-TUDO.md` is the director's full run on that head.

## The eight questions

1. **The table of the country (PAI2).**
   - Is every measure of the seven doors in the table exactly once, in both editions, with the same value, previous value, Union value and reference as its card and its ledger row?
   - Does «sem anterior» / «no previous» appear only where the ledger has no earlier period?
   - Does each row link to its card?
2. **The revision notice (PAI2).**
   - Does a measure with a pending revision say so, with the source's new value and the date of the re-reading, on every page that shows that measure, and only there?
   - Does the card accept exactly one notice, and only when one is due?
3. **The pages that stop talking about themselves (VOZ-1).**
   - Do the sentences of `brief-VOZ-1.md` §1 read in both editions exactly as written, with the same tokens and the same conditions?
   - Is every fact about a source that the old text carried still there? Name any that was lost.
4. **The marker.**
   - Is «[a verificar]» gone from every page, replaced by «por confirmar na fonte» / «to be confirmed at the source»?
   - Does the ruler the marker protected still bite: the dashed seal, and the page out of search engines until its receipt is complete?
   - Does `/a-verificar/` redirect?
5. **The agenda, the calendar and the register.**
   - Do they show only what `brief-VOZ-1.md` §2 lists?
   - Are the engine's copies (`src/data/agenda.json`, `src/data/calendario.json`) byte for byte unchanged?
   - Does every corrections entry still lead to its receipt?
6. **The three guards.**
   - Does the mandate check refuse a sentence where the site or the piece talks about itself?
   - Does the build fail on one, on every reader page outside Método, Sobre, the receipts and Privacy, and on a new subtitle?
   - Is the exemption for the study documents named and dated?
   - Do the plants bite?
   - Is there any way such a sentence can still reach a reader page?
7. **The rulers.** Did any ruler that protects a number, a source or a person get weaker anywhere in these diffs?
8. **Reading it.** As a reader would, in both editions, read:
   - the Temas page;
   - the two explainers' «Como ler estes números»;
   - the front page;
   - the calendar page;
   - the corrections page.

   Is there any sentence left in which the site or the piece talks about itself, says what it does not do, or apologises?

Then the editor's question: would the editor of a Portuguese daily publish these pages as they stand?

Budget: at most 50 tool calls.
