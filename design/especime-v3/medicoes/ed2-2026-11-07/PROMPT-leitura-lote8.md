# The cold read of batch 8 (ED2), 07.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this batch does

**ED2:** every edition of a study is one tap away, with the nature of each («(primeira)», «(atualização)», «(correção)», and «, atual» on the current one), in the header of the study page and in the band of each version of the document; the header says «atualizado a» for an update and «corrigido a» for a correction, both when both exist. Before ED2, four studies said «atualizado a» with the date of a correction, and the 03.11.2026 edition of Évora 2027 was reachable only from the corrections register. The mandate is `brief-ED2.md`.

ED2 was built on a branch where two other blocks (VOZ-2A and VOZ-2B) stopped before changing anything; they do not land in this batch. The diff here is ED2 alone, cherry-picked onto the head that landed HIG-5. The site diff is `diff.patch` (base `__BASE__`, head `__CABECA__`). Built pages under `built/` come from the `dist/` of `__DIST__`. `CONFERIR-TUDO.md` is the director's full run on that `dist/`.

## The six questions

1. **The line.** On every built page that shows it, does «Edições:» / «Editions:» list every edition that `studies-src/manifest.yml` (in the diff's context, and as the built pages imply) has for that study and language, in manifest order, with the right nature and «, atual» / «, current» on the current one? Is the page being read marked `aria-current="page"` and not linked, and does every other edition link to its own route?
2. **The dates.** Does the header say «atualizado a» / «updated on» only for an update and «corrigido a» / «corrected on» only for a correction, both when both exist, in date order, each with its own date? Is any page left where a correction date is called an update?
3. **What should not change.** Studies with a single edition, and the FP3 box: unchanged in behaviour?
4. **The rulers.** Do the new checks read the manifest independently of the renderer? Would a swapped nature, a correction counted as an update, a missing edition, a wrong door or a wrong label word go red? Did any ruler that protects a number, a source or a person get weaker anywhere in the diff?
5. **The 03.11.2026 edition of Évora 2027.** Is it reachable now from the study page and from the other versions, and does it link to the others?
6. **Reading it.** As a reader would, in both editions, read the header and the band of Évora 2027 and of the accounts of the Câmara de Évora in `built/`. Would the editor of a Portuguese daily print them as they stand? Say plainly if anything reads as redundant or unclear to a reader.

Budget: at most 40 tool calls.
