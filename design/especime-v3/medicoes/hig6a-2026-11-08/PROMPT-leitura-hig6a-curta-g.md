# The short read of HIG-6A addendum G, 08.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What changed

The HIG-6A landing stopped at the GitHub `portão` run: all six «conferir» parts failed checking out the private engine repository («Repository not found»); the repository has no read token, and a key is the funder's. Addendum G (`ADENDA-G.md`) moves the two layer-0 steps that need the real engine (`check:pre-mandato`, `check:frases-reais`) out of the GitHub parts and into the local landing (`aterrar.py`, next to `check:series` and `check:cruzamento --with-origin`, before the merge into `main`), declared in one script `verify:com-motor`; both stay in `verify`, so the local full run still runs them. The engine checkout and the `RESEARCHHUB_DIR` export leave `portao.yml`. The chain guard (`camada-cadeia.mjs`) now asserts the new arrangement, with plants. The diff is `diff.patch` (base `__BASE__`, head `__CABECA__`).

## The three questions

1. **Does it still fail closed?** Is there any path where the two steps run nowhere before `main` moves: the landing skipping them, running them after the merge, running them without the engine, or treating a red as green? Does the landing plant prove a red `verify:com-motor` stops the merge and the push?
2. **Is the exclusion exact?** Do the GitHub parts drop exactly the steps of `verify:com-motor` and nothing else, and refuse a `verify:com-motor` naming a step that is not in `verify`? Could someone widen the exclusion (move a third step out of GitHub) without a guard biting?
3. **Nothing weaker.** Did any rule, plant, exit path or `verify` entry get weaker in this diff? Does the chain guard still bite on each removal it claims to cover? Does anything left in `portao.yml` still need the engine?

Budget: at most 15 tool calls.
