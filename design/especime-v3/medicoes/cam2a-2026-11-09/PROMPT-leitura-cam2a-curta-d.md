# The short read of CAM2-A, addendum D, 09.11.2026

Reader: Claude Opus 5.5 (`leitor`, xhigh). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What changed

The short read of addendum C (`LEITURA-cam2a.md`, its last section) led to addendum D, which is `brief.md` here. The diff is `diff.patch` (155fd74a5..3d4227d16); the implementation is commit c64f32c27. The builder's report is `relatorio-construtor.md`. The site worktree <instrumentos>/OEstadoDoPais-worktrees/cam2a-2026-11-09, with `dist/` built at c64f32c27 today, may be read, and its scripts run there without network. Write only to a temporary folder outside it, and do not build.

## The questions

1. **The judgement.** Is every entry `juizo: "por julgar"`, the seed included? Is any other value refused, and is a missing field refused too? Does the README say why a tied quotation is necessary but not sufficient?
2. **Coverage by pair.**
   - Does a sentence whose pair in the other language is detected enter coverage, in both directions, with its pair's types?
   - Is it in the register or on the list?
   - Do the counts hold: 260 Portuguese and 59 English added, and no detected pair left without coverage?
3. **The negatives.**
   - Do «No que diz respeito», «No que se refere», «estado de alerta», the proper names with «Alerta» and «alerta» as a noun after an article now stay undetected?
   - Do «diz», «refere» and «alerta» as verbs still match?
   - Did the marker pin change with a reason in the same commit?
4. **The pin's history.** Is there now a test with a simulated history: a marker change without the pin, then a repair? Does the first refusal stand?
5. **The measures.** Are the report's numbers in measurement files, and is the repeated field corrected?
6. **The initial list.** Is it regenerated and pinned, do its counts add up, and is it under the 4 000 cap?
7. **The pages.** Does anything a reader sees change, other than the Método's check count?

Budget: at most 25 tool calls.
