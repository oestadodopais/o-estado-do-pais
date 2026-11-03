# The short read of the corrections to block EV3 (M48), 03.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter, including item 10 (the quotations table: give it for every quoted excerpt these corrections add or change). Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this read covers

The cold read of block EV3 (the Évora 2027 study updated with the October 2026 municipal records on the Rossio de São Brás) is `LEITURA-EV3.md` in this package. It found three real Major problems (6, 7, 8) and several Minor ones. The corrections are addendum H (`ADENDA-H.md`: findings 6, 7, 8, 9, 10, 11 and 19) and addendum I (`ADENDA-I.md`: findings 12, 13 and 20). The site diff is `diff.patch` (base `__BASE__`, the head the cold read saw; head `__CABECA__`), the engine diff `motor/diff.patch`. Built pages under `built/` come from the `dist/` of `__DIST__`; `CONFERIR-TUDO.md` is the run on that head. The hosted documents are under `motor/content/19 Évora 2027 Capital Europeia da Cultura/Technical Source/outubro-2026/raw/`, including the Câmara's tender notice that addendum I adds.

## The six questions

1. **True to the documents.** For each sentence that H and I changed or added, in both editions: does every fact, number, date and quoted excerpt say exactly what the hosted documents say? In particular: the President's statement (is it attributed to him, with both aims, and stated as purpose, not as a done fact?); «inteiramente financiada pelo Fundo Ambiental» / «fully funded» against «financiada a 100%»; «prevista para o fim do ano» against «até ao final de 2026»; the ratified 60-day extension; «por maioria»; the shortened address quote; the tender notice's «apoiada por financiamento do Plano de Recuperação e Resiliência». Does any sentence state something no document says, or count funding sources the documents do not count?
2. **The findings closed.** Is each of findings 6 to 13, 19 and 20 closed as the addenda say, without reopening anything the cold read found fine (21 to 35)?
3. **The dates and the rows.** Do the new sister rows carry the same excerpt as their parent, and does each edition print the long form of its language? Is the new row `ev3-rossio-prr` measured in the hosted copy, with its request receipt? Is the publisher of each of the six documents a name that the document itself writes? For the Câmara's edital of 15.10 the builder chose «Presidente da Câmara Municipal de Évora», the office that signs it: is that right as «Publicado por», or should the receipt name the body that issues the edital, which the same string also writes («Câmara Municipal de Évora»)? Say which a reader would expect, and why. Addendum I was finished by the director by script after the builder stopped (the engine commit `bf6b88a` with the gate deferred, the export of the records, and the `origin_ref` of the two current editions pointed at that commit): check that each `origin_ref` names a commit that holds exactly the bytes the site serves.
4. **The saved edition.** Does each saved edition of Évora 2027, in both languages, serve no `data-ev3-nome` mark, and is its text unchanged?
5. **The rulers.** Did any ruler that protects a number, a source or a person get weaker in these diffs?
6. **Reading it.** Read the first paragraph, the licence paragraph and the latest-news sentence in both editions as a reader would. Do they read whole and clear, with no sentence about the site itself?

Then the editor's question: would the editor of a Portuguese daily print these passages as they stand?

Budget: at most 40 tool calls.
