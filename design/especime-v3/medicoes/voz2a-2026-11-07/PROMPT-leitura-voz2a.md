# The cold read of VOZ-2A, 07.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this block does

In seven studies about Évora (the 2027 European Capital of Culture study and its panel, promised/paid/audited, budgeted/paid/owed, the council accounts, the economy and outside money, investors), the sentences in which a study talked about itself (its method, what it does not do, "this document…") came out or were rewritten to say the fact of the source; 37 that do not talk about the project stay and are declared one by one. The internal name of the engine («Research Hub») came out of these studies. Each study gets a new edition of 07.11.2026 marked as an update (not a correction: no fact changed), with an «Estudo atualizado» / «Study updated» entry in the register; the count of published corrections stays at 46. Three sentences that carry an absolute word about the sources are backed by declared engine assertions. The mandate is `brief.md` (VOZ-2A) with addenda A to G (`ADENDA-*.md`); the prescribed sentences are in `design/especime-v3/medicoes/voz2a-2026-11-07/FRASES-VOZ-2A.json` (the `nova` fields). The site diff is `diff.patch` (base `__BASE__`, head `__CABECA__`); the engine diff is `motor/diff.patch`. Built pages under `built/` come from the `dist/` of `__DIST__`. `CONFERIR-TUDO.md` is the director's full run on that `dist/`.

## The six questions

1. **No fact changed.** In the built pages and the engine diff, did any number, any quotation, any source, any attribution or any conclusion change? Every rewritten sentence must say the same fact as before, from the same source, without adding anything. Read every rewritten sentence of Évora 2027 in both languages against the sentence it replaces.
2. **The prescribed text.** Is each `nova` applied word for word where the list says, each SAI gone, each FICA kept? Is any self-talk sentence of these seven studies still printed outside the declared FICA?
3. **The editions and the register.** Does each of the seven studies have its 07.11.2026 edition marked «atualizado a» / «updated on» in the header line, with the previous edition kept byte for byte and reachable? Is the register entry an update (not a correction), with the prescribed text, and did the correction count stay at 46?
4. **The assertions.** Are the claims about sources backed: «nenhuma das fontes afirma que são a mesma entidade» (study 04, composition 18), «none of them is an execution account» (study 14, composition 19), «nenhum dos documentos lidos lista contratos, adjudicatários ou valores» (14, 19)? Is any absolute claim about a source left without a declared assertion?
5. **The rulers.** Did any ruler that protects a number, a source or a person get weaker? Is the voice exemption narrowed exactly to the eleven VOZ-2B studies and the dated editions? Does the engine-name ruler bite?
6. **Reading it.** As a reader would, read the Évora 2027 study page and its current document in both editions. Would the editor of a Portuguese daily print them as they stand?

Budget: at most 45 tool calls.
