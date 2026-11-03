# The short read of OG1-E's addenda K and L (M48), 03.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter (item 10: these addenda change no quotation; say so in one line). Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this read covers

The previous short read (`LEITURA-CURTA-ANTERIOR.md`) showed that addendum I's change to the voice extraction (no spaces around language marks) let retired phrases escape, and that J's normalization covered only quotes. Addenda K and L (`ADENDA-K.md`, `ADENDA-L.md`) put the voice extraction and the live inventory lines back exactly as they were before I (at `d04ec4740`), keep only additions that widen the refusal of retired phrases, and make the real-gate proof run the voice twice. The site diff is `diff.patch` (base `__BASE__`, head `__CABECA__`). The pre-I versions of the two extraction files and of the inventory are in `ANTES-DA-I/`. Built pages under `built/` come from the `dist/` of `__DIST__`. `CONFERIR-TUDO.md` is the director's rebuild with the checks these addenda touch.

## The four questions

1. **Back to before I.** Is `scripts/voz-edicoes.mjs` identical to its pre-I version, is the inventory identical to its pre-I version, and does every remaining difference in `scripts/medir-defeitos.mjs` only add refusals (never admit a page that the pre-I code refused)?
2. **The fast proof.** Does `check:voz-retiradas` run the real voice twice (the built pages, and one copy with all the plants), read the exit codes, find each planted line in the measurement the voice itself writes, and leave the original `dist/` intact? Do the plants include the retired DGAL definition, the old housing entry in both editions and a retired line with a space before punctuation inside a language mark?
3. **The rulers.** Did any ruler that protects a number, a source or a person get weaker anywhere in this diff, compared with the head before I?
4. **The pages.** Does anything a reader sees differ between these built pages and the ones a reader would have seen before I, other than the housing hospital sentence?

Budget: at most 20 tool calls.
