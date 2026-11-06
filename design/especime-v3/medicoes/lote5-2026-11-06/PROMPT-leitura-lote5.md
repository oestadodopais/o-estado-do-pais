# The cold read of batch 5 (AT1, MET1 and EV3-p), 06.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter, including item 10 for any sentence that reports what a source or a person said. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this batch does

Three blocks stacked on one branch, rebased onto `main` after batch 4 (PAI2 and VOZ-1) landed on 06.11.2026 at 10:35 UTC:

- **AT1 (machinery):** a shorter landing. The checked `dist/` goes to Vercel as a prebuilt production deploy with no domain while the GitHub run checks the head, and it is promoted only when that run is green. Vercel no longer builds `main` on its own. The GitHub run splits the checks into parallel parts. The machine lock covers only the build, the full run, the gates and the landing. The mandate check exempts the Método and the Sobre. The mandate is `brief-AT1.md`, with addenda A to C (`ADENDA-A-AT1.md` and the others).
- **MET1 (navigation):** the Método as a page a reader uses. Four sections, no lede, a drawn path from document to page, the marks, and what happens when a number changes. The funder's sentences on funding, advertising, money from measured bodies, party rankings, journalism and personal data move word for word to the Sobre. The mandate is `brief-MET1.md`, with addenda A to C (C came after the full run: two rulers on other pages still wrote the old Método, the I7 of the site index and the Método plant of `check:incorporar`).
- **EV3-p (content):** in the Évora 2027 study, one sentence on the Rossio funding stops counting two financings that no document counts. It is a correction of the published text, with a new edition dated 06.11.2026 and an entry in the register. The mandate is `brief-EV3-p.md`, with addenda A to D.

The site diff is `diff.patch` (base `__BASE__`, head `__CABECA__`); the engine diff, if any, is under `motor/`. Built pages under `built/` come from the `dist/` of `__DIST__`. `CONFERIR-TUDO-b.md` is the director's full run of all 63 steps on 40ac30430, the head before the rebase and before addendum C: three steps red, and their causes are in `ADENDA-C-MET1.md` §0. `CONFERIR-TUDO.md` is the targeted run on the head: the build and the steps addendum C and the rebase touch. The GitHub run checks the whole list again on the head that lands. The rebase adds only what `main` gained between 5402e3f1f and a3fe1863e, net two files (`tests/explicacoes/inventario.mjs` and the cost file of VOZ-1). Check in `diff.patch` that the commits of addendum C (subjects starting `MET1 C`) touch only rulers and plants, and nothing a page prints.

## The seven questions

1. **The landing (AT1).**
   - Is the deploy built from the checked `dist/` only (the files equal by sha256), with the function's region the one `vercel.json` declares, and from a tree equal to the head?
   - Can a landing promote a deploy before the GitHub run on the same head is green, or skip `verify:deploy` after promoting?
   - Does the union of the parallel parts of the GitHub run equal the whole `verify` list, with nothing dropped?
   - Is the worktree always linked to the site's own Vercel project, and does the script refuse when it is not?
   - Do the plants for each of these bite?
2. **The lock and the mandate check (AT1).** Is any build, full run, gate run or landing left outside the lock? Is the exemption in `voz-do-mandato.py` limited to the Método and the Sobre?
3. **The Método (MET1).**
   - Do the sentences of `brief-MET1.md` §2 (and addendum A for English step 4) read exactly as written in both editions, with no lede and no prose outside the closed list?
   - Does every count come from a proof token, recounted by the gate? Does `conferencias_da_corrida` equal the number of steps the full run runs?
   - Does every field of the example receipt (the minimum wage row, addendum B) come from its ledger row, with its source's language marked?
   - Is the drawn path readable without JavaScript, and does its motion stop when the reader asks for less motion?
4. **The Sobre (MET1).** Are the moved sentences there word for word, and is every other sentence of the Sobre unchanged? Did `IDENTIDADE.md` change anything beyond the two quotations of the Método?
5. **The correction (EV3-p).**
   - Does the Rossio sentence read exactly as `brief-EV3-p.md` §1 writes it, in both editions, with the token resolving to the Câmara's own words?
   - Is the edition of 03.11.2026 kept as it was published, is the current edition dated 06.11.2026, and does the register entry read as §2 writes it, as «Estudo corrigido»?
   - Does each Câmara notice, as hosted, name what the sentence says it names?
6. **The rulers.** Did any ruler that protects a number, a source or a person get weaker anywhere in these diffs? In particular: does the new I7 still refuse a retired address with no permanent redirect to the Método, and an anchor that the built Método of that edition does not have? Does the `check:incorporar` plant still bite in both editions?
7. **Reading it.** As a reader would, in both editions, read:
   - the Método;
   - the Sobre;
   - the Évora 2027 study's Rossio paragraph and its editions;
   - the corrections page.

   Is there any sentence in which the site talks about itself, says what it does not do, or apologises?

Then the editor's question: would the editor of a Portuguese daily publish these pages as they stand?

Budget: at most 50 tool calls.
