# The cold read of HIG-6A, 08.11.2026

Reader: Claude Opus 5.5 (`leitor`), at high effort. Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this block does

HIG-6A is machinery that guards every later block. It adds «layer 0» to `scripts/leituras/pre-mandato.py`: a mandate that declares `Frases: <list.json>` has every listed sentence checked before the builder sees it (the voice ruler sentence by sentence; numbers removed per study and language equal across languages; the engine's quantifier vocabulary read from `core/assertions.py` with a declared `assercao` required; twin blocks in the other language paired block by block, without reusing a block; sentences the ruler catches that the list does not name). It caps builder resumes per block at two (a third needs a written decision), makes both launchers run from a copy of themselves, adds a permanent pt/en number-parity check (`check:paridade`) with a closed, dated exception list for three studies, makes the VOZ-2A pair check take any list, makes `plantar.py` keep file times, and widens the no-repository-link rule. The mandate is `brief.md` with addenda A and B (`ADENDA-A.md`, `ADENDA-B.md`). The diff is `diff.patch` (base `__BASE__`, head `__CABECA__`). Built pages under `built/` come from the `dist/` of `__DIST__`.

## The six questions

1. **Each check bites.** For every new check (each layer-0 rule, the round cap, the launcher copy, parity, pairs, the repository rule), is there a plant that fails when the check is removed or weakened, and does the real-case replay hold (the VOZ-2A list at ab948c410 refused; today's VOZ-2A list accepted; today's VOZ-2B list refused with 28 quantifiers, 15 unnamed sentences and 7 unpaired entries)?
2. **Nothing weaker.** Did any rule that protects a number, a source or a person get weaker (the voice ruler, the engine assertions, the edition and register checks, the Method checker)? Are the parity exceptions exact, closed and dated, so that any new difference fails?
3. **Fails closed.** Does layer 0 refuse when the `dist/` is from another head, when the engine is missing, when a list is malformed, and when `par: nenhum` has no reason? Can the round cap be bypassed by a new session of the same block?
4. **The chain.** Which of the new checks run in `verify` (and so in the GitHub run that gates every landing)? `check:pre-mandato`, which holds layer 0's own plants, appears not to be in `verify`: confirm, and say what that leaves unguarded.
5. **Honest limits.** Does the report state the known limit (a twin sentence left unchanged inside a block that already has a pair, the V122 case) and the parity exceptions accurately?
6. **Reading it.** No reader page should change. Is that true in the diff?

Budget: at most 30 tool calls.
