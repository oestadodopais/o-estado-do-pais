# The short read of HIG-6A addenda C to E, 08.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What changed since the cold read

The cold read of HIG-6A (`LEITURA-hig6a.md` in this package) found four Major weaknesses in layer 0. Addenda C, D and E (`ADENDA-C.md`, `ADENDA-D.md`, `ADENDA-E.md`) answer them: `check:pre-mandato` and the real-case replay now run in `verify`; a plant per layer-0 rule runs the real `conferir()`, plus an end-to-end proof that a refusing list makes `pre-mandato.py` exit non-zero; each entry's sentence must be on one of its pages (searched as the list writes it, with source chips), at least twelve characters; a declared `assercao` must exist in the engine ledgers and one of its quotes must appear in the new sentence and contain the quantifier; a misplaced `Frases:` header is refused; the layer-0 number extractor handles thousands groups. The diff is `diff.patch` (base `__BASE__`, the head the cold read saw, to head `__CABECA__`).

## The four questions

1. **Each Major closed.** For each of the four Major of the cold read (6, 7, 8, 9), is the fix in the code, and does a plant prove it bites?
2. **Nothing weaker, nothing fails open.** Did any rule, plant or exit path get weaker? Does every path that finds a problem still end with a non-zero exit?
3. **The real cases.** Does today's applied VOZ-2A list pass (with the applied-list option), and does the VOZ-2B list still refuse with 28 quantifiers, 7 unpaired and 15 unnamed, with no presence failure?
4. **The chain.** Are the new checks in `verify`, so the GitHub run that gates every landing will run them?

Budget: at most 20 tool calls.
