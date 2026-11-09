# The short read of CAM2-A, addendum C, 09.11.2026

Reader: Claude Opus 5.5 (`leitor`, xhigh). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What changed

The cold read of CAM2-A (`LEITURA-cam2a.md` in this package, with the direction seat's decision on each finding) led to addendum C, which is `brief.md` here. The diff is `diff.patch` (f1b98c701..155fd74a5); the implementation is commit ad3505c52 inside it. The builder's report is `relatorio-construtor.md`. The stored documents of the 21 support rows are in `motor/`, and the Método pages and the rows' ledger pages are in `built/`.

The site worktree <instrumentos>/OEstadoDoPais-worktrees/cam2a-2026-11-09, with `dist/` built at ad3505c52 today, may be read, and its scripts run there without network. Write only to a temporary folder outside it. Do not build.

## The questions

1. **The markers.**
   - Is there one isolated plant per marker per language, real where the `dist/` has one?
   - Are the marker lists pinned by sha256, and is a change of markers without a new pin refused, including in history?
   - Do «por causa do/da», «resulta da» and «resultado de» now match, in the detector and in the AUD1 script?
   - Do the twelve new verbs match, with negatives for names such as «Mecanismo de Alerta»?
   - Are the pairs measured both ways?
2. **The scope.** Are the municipality, district, region, area and European Union pages read in both editions, with one key per collection for a repeated sentence? Is any other reader page left out?
3. **The cut.**
   - Does the detector split after `.»`, `!»` and `?»` before a capital, without changing the voice rule's cut?
   - Did the five over-long entries of the cold read become separate sentences, each registered by the seed rule or on the list to register?
   - The builder says three pairs, not five entries, were affected: check which is right.
4. **The entry of a new or rewritten sentence.**
   - Does every entry carry `origem`?
   - Is an entry without a quotation tied to its row's excerpt held at `juizo: "por julgar"`, with any other value refused?
   - Is an entry whose `origem` names a mandate refused unless that mandate's `Frases:` list holds the same entry?
   - Is the README's path clear to the next builder?
5. **The Minor fixes.**
   - Does the landing check that both commands say the documents were read?
   - Does `comitar.sh` read the staged list?
   - Does the seed keep every type of a sentence?
6. **The initial list.** It was regenerated in this pass, before landing. Is it the measured one (its pin), and do the report's counts by collection and language add up?
7. **The pages.** Does anything a reader sees change, other than the Método's check count?

Budget: at most 30 tool calls.
