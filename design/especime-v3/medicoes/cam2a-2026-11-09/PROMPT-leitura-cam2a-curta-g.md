# The short read of CAM2-A, addendum G, 09.11.2026

Reader: Claude Opus 5.5 (`leitor`, xhigh). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What changed

The short read of addendum F found that the closed list of text templates, which takes the weekly panel's generated lines out of the coverage of claim sentences, built its `{indicador}` and `{unidade}` alternatives from every ledger row. Statement rows and names such as «Feridos segundo o movimento, pela imprensa» were among them, so a line in the template's form with such a name left coverage although the detector typed it as attribution. It also found that addendum F's «new pins» moved the history check's base from d21c48f0b to d9a6489a9 for a change that only removed entries. Addendum G (`brief.md`) restricts the catalogue to rows in the weekly reading's scope with at least one re-reading and no statement, makes a detector-typed alternative refuse, and restores the old base and initial-list pin. The diff is `diff.patch` (cd60473fd..bd58d7f8b); the implementation is commit cfddc98b9, and bd58d7f8b only adds the report and the measures. The builder's report is `relatorio-construtor.md`. The site worktree <instrumentos>/OEstadoDoPais-worktrees/cam2a-2026-11-09, with `dist/` built at cfddc98b9, may be read and its scripts run without network. Write only to a temporary folder outside it, and do not build.

## The questions

1. **The catalogue.**
   - Does the catalogue now come only from rows in the weekly reading's scope that have at least one re-reading and are not statements? Are the counts in the report (per language: indicator names, units, periods) true?
   - Can a row that the weekly reading could list as a revision ever be missing from the catalogue (so its revision line would wrongly need registering)? Can a name, unit or period that a hand-written attribution could use still get in?
   - Does a detector-typed alternative refuse the template check, naming the row, and does a plant prove it?
   - Do the two lines from the last read (the PT «Feridos segundo o movimento, pela imprensa, …» line and the EN line ending «…, according to the CFP») now need registering on the weekly reading page?
2. **The history base.** Is the base back at d21c48f0b and the initial-list pin back at `a00ced4b…`? Does the history walk now check the lists of addenda E, F and G, and does every step only shrink? Does the README state when the base may move?
3. **Next week's panel.** On the head's `dist/`, with other dates, values and another re-read indicator revised, does coverage pass?
4. **Nothing else.** Did any reader page, any other ruler, the quotation check of addendum F, or the number of checks in the Método change in this diff? Are the report's counts and codes true?

Budget: at most 20 tool calls.
