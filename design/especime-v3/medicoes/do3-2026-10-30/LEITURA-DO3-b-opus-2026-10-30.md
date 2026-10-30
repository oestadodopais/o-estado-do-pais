Short read (M48) of the DO3 corrections (addenda A and B), package `pacote-do3b-2026-10-30`, 30.10.2026, about 18:09 to 18:18 UTC. Reader: Claude Opus 5.5 (`leitor`); 37 tool calls, 141 788 tokens, 521 s (the agent's own count); no files written. Condensed by the editorial seat for the records; every finding and verdict kept.

## Blocking
1. On the Portuguese dossier, the «Do estudo: …» heading names the Budget study but links to `/estudos/a-casa-em-portugal-e-na-europa`; the builder's structure file, the view (`estudo.rota`) and `conferirLeitura` all say the Budget study, so the packaged page is not the one the green checks saw. **[Plant B3.]**

## Major
2. The English heading reads «From this study: …» instead of «From the study: …». **[Plant B2.]**
3. The diff passes `portas={true}` to the explainer on the dossier; the copied `DossieView.astro` and the built pages have `portas={false}` (0 `data-explicacao-portas`). **[Plant B4.]**
4. The diff inverts the K8 dossier condition (`!== 'dossie'`); the copied `cartao.mjs` and the cartao log match `=== 'dossie'`. **[Plant B1.]**

## Minor
5. The copied report says «94 chamadas»; the number checker and the full report say 49. **[Plant B5.]**
6. The new whole-section comparison collapses all whitespace, including no-break spaces (`\s` matches U+00A0 and U+202F); a swapped no-break space would pass this ruler (figure values are still checked by the HTML gate on the dossier route).
7. Nothing in the package shows that the voice ruler's own surface drops only what the comparison checked (`scripts/dossies-superficie.mjs` and `scripts/voz-palavras.mjs` not in the package); in practice a changed fold is still refused by `conferirLeitura` in `check:dossies` and in the HTML gate.
8. The K8 evidence comes from addendum A's head; nothing in the package shows K8 at the final head except a build code. (Closed by the editorial seat: `npm run check:cartao` on the final built pages, b12e68515, code 0, with the dossier plants biting.)
9. More doors were removed than the two the brief names: on the dossier the explainer's three end doors («Números e fontes →», the study, «Para onde vai o dinheiro do Estado em 2026 →») and the Saúde section's discussion door are all gone; the report does not say so.
10. «com a porta no fim deste estudo» now refers to the named study, but on this page points at a door that is not there; inherited text the brief chose to keep.
11. Inherited: the English dossier still prints decimal commas («0,1 %», «3,0 % … −1,5 %»).

## What is fine (summary)
Package complete; the diff matches the copied files except the two planted lines; K8 still requires exactly 1 per edition and strips on the dossier only through `retirarCitacoesEo1` per declared section, its four dossier plants biting in both editions; the unused `s` gone and `check:mortos` green; the study named from data, equal to the study page's h1 in both editions, first in the index, the seven sections as h3 with no duplicate ids; the whole-section comparison reproduced by the reader (7 sections equal in both editions, folds 3/7/3/2/1/1/1); the three new plants in both rulers, counts reproduced (20 and 36); no ruler protecting a number, a source or a person weaker, the discussion ruler stricter; the explainer on the dossier equals its page minus the doors, which the explainer page keeps; the HTML gate runs `conferirLeitura` and its plants on the dossier route; all 30 rows of the measurement table reproduced from the built HTML; the captures clean; no new quotation.

**Editor:** not as packaged (the planted heading link and wording); once those are fixed and the diff and copies agree, the page reads the Budget from top to bottom, the study's seven sections clearly under a named, linked study, the doubled doors gone. The inherited English decimal commas and «porta no fim deste estudo» are what the reader would still rewrite.
