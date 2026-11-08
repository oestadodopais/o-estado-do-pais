# The cold read of COR-AGUA, 08.11.2026

Reader: Claude Opus 5.5 (`leitor`, xhigh). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What the block does

COR-AGUA corrects the two water studies («Onde está a água», «Água não faturada») in both editions, and removes the «[verify]» marker from every reader page. It was built in two passes by the Codex builder:

1. **Pass 1** (`brief.md`): layer 0 (the pre-launch check of a sentence list) now compares numbers after applying the list to both editions, instead of comparing what each edition loses; and a SAI or REESCREVE names a ruler-caught sentence when either contains the other.
2. **Pass 2** (`ADENDA-A.md`): the 126-entry list (`FRASES-COR-AGUA.json`: 94 entries that change text, 32 FICA deferring two studies' voice to a later block) applied to the pages; every number the list writes resolving to a ledger row with a verbatim excerpt, a locator, the access date and the sha256 of the hosted copy; the copies hosted in the engine with a manifest; the charts' data identical in both editions; the «[verify]» ruler extended to studies; the parity exceptions for the water studies retired; four «Estudo corrigido» register entries.

Pass 2 ran in two parts: `ADENDA-A.md` stopped (the 4212 hm³ below), `ADENDA-B.md` narrowed the ledger requirement and finished the pass (`RELATORIO-coragua-b.md`).

The direction seat wrote every reader sentence in the list and the register entries from the saved source copies; `EXCERTOS-medidos.txt` holds the excerpt lines it cut by script, with each copy's sha256. The builder wrote what the list did not: seventeen site ledger rows (`ledger/claims/coragua-*.yml`) for the numbers of the register entries, each with a «what it is» sentence in both languages (`scripts/compor-familias-coragua.mjs` → `src/data/o-que-e-das-familias.mjs`), and six of them hold values the archived edition printed. Read those sentences as reader sentences. The diff is `diff.patch` (site) and `motor/diff.patch` (engine); the built pages are under `built/`; the hosted bodies under `motor/`.

Known and decided, not findings unless you find them wrong in a way not stated here:
- The 4212 hm³ (agriculture's abstraction) is carried unchanged; it sums the technical CSV, and the eight regional copies are not saved. It goes to a provenance audit.
- The PRR chart labels in «Água não faturada» say «snapshot of 29 July 2026»; the paid totals printed are the sums of the 3 August snapshot held (`PRR-graficos-2026-08-03.json`). No 29 July snapshot can be found. The correction pass relabels both editions to 3 August and removes the «updated to the same day's snapshot» sentence.
- `CONFERIR-TUDO.md` is the full run on this head; any red step in it is known to the direction seat.

Two machinery changes the mandate did not ask for, which Q4 must judge: the engine's attribution gate (`core/attributions.py`) now reads sentence and block boundaries and skips reference numbers (codes, years in date forms), with twelve new tests; and the voice ruler accepts the self-reference in the `agua-nao-faturada` register entry («uma conta deste estudo») only while that entry stays intact (`scripts/voz-excecoes.json`, `correcao_textual`). Is either a weakening of a gate that protects a number or a source, and what would now pass that failed before?

## The questions

1. **Is every number on the corrected pages true to its source?** For each number the list writes (the ratio 19 to 35, the ERSAR charge level, the 2026 Alqueva tariffs and conservation charges, the penalty bands, the PGRH total and Quadro 16, the APA bulletin of 31 October 2026, the drought report of 31 August 2026, the Gulbenkian 71 % and 61 %, the DGADR 76 % and its range, the EDIA impairment, the Tribunal de Contas figures): does the ledger row's excerpt appear in the hosted copy, at the locator it states, with the same measure, unit, population and period the page sentence gives it? Is any number on the pages without a row, or with a row whose excerpt is a placeholder?
2. **Are attributions, quotations and causes exact?** Is every quotation the source's words (the EDIA despacho sentence, the Tribunal's «ficou comprometida», the Gulbenkian lines)? Is any reading (the impairment, the ratio) said as a fact rather than as a calculation or an interpretation?
3. **Do the two editions say the same thing?** Same numbers, same claims, same chart data, in each study; nothing one edition says that the other drops.
4. **Did anything get weaker?** Layer 0's two rule changes (pass 1), the parity guard (the permanent exception for «A casa em Portugal e na Europa»), the «[verify]» ruler and its plant, the chart-data check and its plant, the ledger and hosted-body gates, the attribution gate and the voice exception above: does each still bite, and on what?
5. **Would a Portuguese daily's editor print each corrected page as it stands?**

Budget: at most 40 tool calls.
