# The short read of COR-AGUA, addendum D, 08.11.2026

Reader: Claude Opus 5.5 (`leitor`, xhigh). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What changed

The cold read of COR-AGUA (`LEITURA-coragua.md` in this package, with the direction seat's decision on each finding at the top) led to one correction pass, `ADENDA-D.md`, finished under `ADENDA-E.md` (section labels) and `ADENDA-F.md` (the engine's attribution gate back to its code before the block). The diff is `diff.patch` (site, from the head the cold read saw) and `motor/diff.patch` (engine). The built pages are under `built/`, the hosted copies under `motor/`. The direction seat wrote every reader sentence in `ADENDA-D.md` and in its list `FRASES-COR-AGUA-d.json`, from the saved copies.

## The questions

1. **The sentences the pass changed.** Is each one true to its source, with the same measure, unit, population and period, in both editions? These are:
   - the ratio conclusion: what each side includes;
   - the circularity example (76 %);
   - EDIA's tiered pricing («Preço Base + 150%», «+ 400%», from the hosted tariff simulator);
   - the C-Lab credit for the Gulbenkian survey;
   - the four register entries.
   
   Do the numbers they add or change resolve to ledger rows whose excerpts are in the hosted copies?
2. **The engine rows the cold read could not check** (its finding 1), now that their copies are hosted:
   - the river basin plans' summary (263; 14 804,71; 264);
   - the APA bulletin (9 317 and 13 215, 31 October 2026);
   - the drought report of August 2026 (78; 2; 40; Fronhas 33 %; Vigia 39 %; 36; 80 %);
   - EDIA's 2025 accounts (the impairment, 2 029 018 255 €).
   
   Is each excerpt in its copy, at its locator, with the measure the page gives it? Is the impairment said as a fact or as what it indicates?
3. **The ERSAR row:** does its locator say honestly that 13,48 is a data label in the image of Figura 553? Render page 410 if you can (`pdftoppm`) and read the label.
4. **The attribution gate.** `ADENDA-F.md` returned `core/attributions.py` and `core/attributions_test.py` to their code before this block, byte for byte; `motor/diff.patch` shows the reversion. It also did two more things:
   - it removed `attributed_to` from seven engine rows whose value is a year or a single digit;
   - it set the water documents' ceilings in `core/gate_baselines.json` to the measured counts, with each `ATTRIB` and `UNDECLARED` line classified in `core/medidas-adenda-f-coragua.json`.
   
   Is any line classified as false actually a real misattribution on the page? Is dropping `attributed_to` on those seven rows honest, and does anything else now protect their source? Does the voice exception now have a test that refuses?
5. **Would a Portuguese daily's editor print the changed passages as they stand?**

Budget: at most 40 tool calls.
