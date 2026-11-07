# The short read of ED2 addendum B (M48), 07.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this read covers

`LEITURA-lote8.md` is the cold read of ED2 (head fbbd67ca2), with the director's classification on top. Its finding 7, made Blocking by the director after a measurement, showed that ED2 took the update date off eight pages of four studies with a single stored edition, and turned their door into «Edição tal como foi publicada» / «Edition as published» while the stored edition is the updated one. Findings 5, 11 and 12 are in the same correction. `ADENDA-B.md` is the correction; `ADENDA-A.md` removed an unused import. The site diff is `diff.patch` (base `__BASE__`, head `__CABECA__`). Built pages under `built/` come from the `dist/` of `__DIST__`. `CONFERIR-TUDO.md` is the director's targeted run on that head.

## The four questions

1. **The single-edition studies.** Do the four studies of `ADENDA-B.md` §0 now print, in both languages, exactly the header they have on the live site (`main`): the door «Edição atual» / «Current edition», «publicado a» / «published on» with the publication date, and «atualizado a» / «updated on» with the date of the stored edition? Does a single-edition study without a later edition (`onde-esta-a-agua`) stay as it was? Is the rule the same in the renderer and in the ruler, and does the ruler read it without the renderer?
2. **The proofs.** Is each plant `ADENDA-B.md` §1.2 asks for there, and red on its own: the update date removed; the door saying «as published»; a stray update date on a single-edition page; the wrong label word with the right attribute?
3. **The words of the line.** Does the renderer take the words of the line from `rotulos-b1.mjs`? Does the voice accept any line the manifest can produce (a four-edition line included) and refuse a line with another word? Can the voice now accept text that is not a line the manifest produces?
4. **Nothing else.** Did any other page, ruler or reader sentence change? Did any ruler that protects a number, a source or a person get weaker?

Budget: at most 20 tool calls.
