# The short read of CAM2-A, addendum F, 09.11.2026

Reader: Claude Opus 5.5 (`leitor`, xhigh). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What changed

The short read of addendum E found two Major problems in the coverage check of claim sentences. First, with the masked key, a page that printed a quotation with another number than the register and the excerpt (9,0 against 8,0) passed. Second, the weekly panel's generated lines (the revision line of the week's reading and the panel line in the Método, both languages) were typed as attribution and sat on the pending list, so next week's panel would be refused as soon as Eurostat revised a different indicator. Addendum F (`brief.md`) checks quotations unmasked against the printed sentence, takes whole-matching lines of a closed, pinned list of text templates out of coverage, and adds a plant for the word right after a number. The diff is `diff.patch` (d9a6489a9..cd60473fd); the implementation is commit c745e7345, and cd60473fd only adds the report and the measures. The builder's report is `relatorio-construtor.md`. The site worktree <instrumentos>/OEstadoDoPais-worktrees/cam2a-2026-11-09, with `dist/` built at c745e7345, may be read and its scripts run without network. Write only to a temporary folder outside it, and do not build.

## The questions

1. **The quotations.** For each register entry, in both languages, is the printed sentence (found by its masked key) checked to carry exactly the register's quotations, numbers and letters included? Does a changed number inside a quotation, on the page or in the register, now refuse? Can a printed sentence with an extra or a missing quotation pass?
2. **The templates.**
   - Is the list closed and pinned (sha256, date, reason), and does adding a template without the new pin refuse?
   - Is each template's regex literal outside its variable parts, and are the variable parts only the indicator's name, values, units and dates? Could a free part accept a hand-written sentence, an extra clause, or an attribution («segundo X», «according to X») that should need registering?
   - Does a stale template (no longer in the file that generates it) refuse?
   - Does next week's panel, with other dates, values and another revised indicator, pass on the head's `dist/`?
3. **The word after a number.** Does a change of the word right after a number («8 pessoas» to «8 crianças», «8 mil» to «8 milhões») change the key, and does a plant prove it?
4. **The list and the seed.**
   - Were they regenerated on the head's `dist/` with the new pins, and are the counts before and after in the report true?
   - Did the pending list only shrink? Is every key in the new list also in the list at d9a6489a9?
   - The history check's base moved from d21c48f0b to d9a6489a9, and the initial-list pin (`SEMENTE_SHA256`) was re-pinned to the new list. Is the new pin exactly the list the detector measures on the head's `dist/`? Does moving the base let anything grow that the old base would have refused? Was the move needed at all, for a change that only removes entries?
   - The report says the regenerated seed is byte-identical, yet `PINO_SEMENTE` and `frases-semente-pino.json` changed. What changed in them, and why?
5. **Nothing else.** Did any reader page, any other ruler or the number of checks in the Método change in this diff?

Budget: at most 22 tool calls.
