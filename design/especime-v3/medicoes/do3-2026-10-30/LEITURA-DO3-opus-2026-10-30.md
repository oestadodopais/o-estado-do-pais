Cold read of block DO3 (the 2027 Budget dossier as one page), package `pacote-do3-2026-10-30`, 30.10.2026, about 17:26 to 17:39 UTC. Reader: Claude Opus 5.5 (`leitor`); 51 tool calls, 184 204 tokens, 782 s (the agent's own count); no files written. Condensed by the editorial seat for the records; every finding and verdict is kept.

## Blocking
1. The diff switches on the dossier-route HTML gate with `rota?.key === 'dossie-desligado'` while the copied `scripts/gate-html.mjs` has `'dossie'`; under the diff the gate never runs (and the exemption at line 7413 would let study figures on the dossier page go unchecked). **[Plant O3.]**
2. The Portuguese dossier page prints «1 530» for the interest-on-debt figure (`der-oe2027-juros-variacao-cp`, block 3) where the study page and the English dossier print 1 350; the only differing block of 25 per edition. **[Plant O1.]**

## Major
3. The Portuguese index title prints «Nesta página», not the mandated «Neste dossiê». **[Plant O2.]**
4. The English final link reads «The full study: …», not «The rest of the study: …». **[Plant O4.]**
5. The inlined sections still say «este estudo» (five times in Portuguese), «com a porta no fim deste estudo» and «na secção das medidas», on a page that never names the study before them (the study card was removed; the first mention of the study's title is the explainer's end door). The same in English.
6. The voice and house-sentence rulers drop whole study sections from the prose surface, while `conferirLeitura` compares only the `[data-registo-bloco]` elements: the «Fontes deste parágrafo» folds (`details.texto-fontes`, 200 of 200 text nodes outside blocks per edition) and anything between blocks escape both, and no plant covers it; latent today (the folds are identical to the study page's), but a ruler that changed shape without keeping what it protects.

## Minor
7. The copied report says «102 chamadas»; the full report and the number checker say 120 (the pass's cap). **[Plant O5.]**
8. «dez páginas nas cinco larguras» is ten captures of one page (two editions × five widths); «gráficos: 0» has no `.codigo` in the package.
9. Five inherited quotations put a speaker before words that are a third party's report (`posicao-governo-csi-pensoes`, `posicao-governo-irc`: «O primeiro-ministro: «… salientou…»»; `posicao-ps-irc`, `posicao-ps-pensoes`: «O PS, por José Luís Carneiro: «Para o líder do PS, …»»; `utao-risco-emprego` introduced as «com os dados da DGAEP:»); identical on the live study page; the sealed passages are not in the package.
10. Repetitions within the page: a quotation printed twice in consecutive paragraphs of `bloco-30`; a headline in both «Em resumo» and «O que este projeto conclui»; the explainer's end doors add a second link to the study mid-page and send the reader to `/o-que-se-discute/#saude-no-orcamento` for an item printed two sections below.
11. The English Health item title keeps Portuguese decimal commas («3,0 % … −1,5 %»), inherited.

## What is fine (summary)
The two reds of the director's run agreed (K8 as far as the package shows); every other changed region of the diff matches the copied files; the order and parts follow §2.1 in both editions (10 index links, 5 `data-dossie-peca`, no duplicate ids); figures with seal per section 23/39/30/11/4/2/9 equal on dossier and study pages; section word counts reproduce; the explainer on the dossier matches its own page (81 `data-claim`, 59 seal destinations, 20 bar styles); the cutting function refuses missing, repeated or retitled ids; the gate's L1 to L4 and L6 run with the cut; the other rulers bite in their logs; `check:alvos` closed by the director's run; the §3 Portuguese link and English index title are as mandated; the index works without JavaScript; the captures are clean. Quotations: every quotation in the inlined sections is byte-identical to the study page; the speakers in the sources cannot be checked from the package (finding 9).

**Editor:** not as it stands (the 1 530, the mandated sentences, «este estudo» on a page that never names the study); once corrected, the page reads the Budget top to bottom without another page, at about 6 200 words.
