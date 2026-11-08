# The short read of VOZ-2A addendum H, 08.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this addendum does

The cold read of VOZ-2A found sentences rewritten in one language and not in the other. Addendum H (`ADENDA-H.md`) applies 21 new list entries (V309 to V328 and V330) and five revised ones (V171, V198, V238, V317, V325) in `design/especime-v3/medicoes/voz2a-2026-11-07/FRASES-VOZ-2A.json`; restores what a composition changed without a list entry (the short blind-spots sentence in Portuguese, the Turismo de Portugal block of the economy study, one sentence on the budget study page); widens the voice ruler (the n- forms «neste/nesta», «do not enter»/«did not enter», English negative contractions); adds two engine assertion quotes and a review; moves the date of the thirteen editions and the seven register entries from 07.11.2026 to 08.11.2026; and puts the pair check (`design/especime-v3/medicoes/voz2a-2026-11-07/conferir-pares.mjs`) into `check:voz`. The diff is `diff.patch` (base `__BASE__`, the head read before, to head `__CABECA__`); the engine diff is `motor/diff.patch`. Built pages under `built/` come from the `dist/` of `__DIST__`.

## The five questions

1. **The two languages say the same thing.** On each built document and study page in the package, does every rewritten or removed sentence have its twin rewritten or removed in the other language, saying the same fact? Is any sentence now in one edition and not the other?
2. **No fact changed, nothing outside the list changed.** Did any number, quotation, source, attribution or conclusion change? Did any sentence change that no list entry names (compare against the previous edition kept under `documento/<date>/` and `document/<date>/`)?
3. **The ruler and the pair check.** Do the widened forms bite (a plant each)? Is any rule that protects a number, a source or a person weaker? Does the pair check run in `check:voz` and would it catch a sentence changed in one language only? Is the exemption exactly the eleven VOZ-2B studies?
4. **The engine.** Are the new quotes in `so-previsionais` and `hospital-registos-sem-identidade-declarada` exactly the printed sentences, and does the review say what sustains the claim?
5. **The date.** Do the header lines, the edition bands and the register say 08.11.2026 for the new editions in both languages, with no 07.11.2026 left for them and no saved edition changed?

Budget: at most 25 tool calls.
