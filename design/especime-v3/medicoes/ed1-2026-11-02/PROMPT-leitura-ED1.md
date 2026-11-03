# The cold read of block ED1 (the first edition of an updated study stays one tap away; every update enters the public corrections register, by ruler), 02.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter, including item 10 (the quotations table: this block prints no quotation; say so in one line). Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## The block

On the live Évora accounts study, updated on 30.10, the link «Edição tal como foi publicada» opened the 30.10 text, not the 01.10 one, and the correction was not in the public corrections register. This block keeps the first edition of every updated study in the repository (byte-identical to the document the manifest held before the update, with its sha256), gives it its own route, splits the edition band into «Primeira edição, tal como foi publicada» and «Edição atual», adds a nature `texto` («Estudo corrigido») to the corrections register with the entries for Évora (30.10) and the Budget study (02.11, block OG1-E), and adds `check:edicoes`, which refuses an updated edition without its saved first edition, its hash or its register entry. Addendum A rewrote the Évora entry sentence and removed a false `updated` that block OG1-E had put on the housing study, whose visible text did not change. The mandate is `brief.md` with addenda A and C (C fixes two red checks of the full run, and is being built while you read). The diff is `diff.patch` (base `__BASE__`, head `__CABECA__`). Built pages under `built/` come from the `dist/` of `__DIST__`. `CONFERIR-TUDO.md` is the director's full run on that head.

## The six questions

1. **The first editions.** Are the saved files byte-identical to the documents published on 01.10 (Évora) and 21.10 (Budget) — the mandate's §0.2 gives the four sha256 — and does each «Primeira edição, tal como foi publicada» link open that saved file, in both editions? Does «Edição atual» open the current document?
2. **The register.** Do the two `texto` entries read word for word as the mandate's §3.5 (Évora as rewritten by addendum A) in both editions, with the right dates and the two doors? Is the corrections count right (14) wherever it is printed?
3. **The housing study.** Is the housing study back to no `updated`, no entry and no saved first edition? Did its visible text really not change (the read-text proof)?
4. **The ruler.** Does `check:edicoes` refuse each case of the mandate's §2.4 with a plant that bites, and is the closed list of exceptions (the old Évora works of 20.08 and the other one) right and justified?
5. **The rulers that changed shape.** Did any ruler that protects a number, a source or a person get weaker?
6. **Reading it.** Would a reader understand, from the study page and the corrections page, what changed, when, and where to read the original?

Then the editor's question: would an editor publish the Évora study's band and the corrections page as they stand?

Budget: at most 45 tool calls.
