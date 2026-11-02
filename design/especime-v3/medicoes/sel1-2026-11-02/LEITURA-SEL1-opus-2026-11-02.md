Cold read of block SEL1, 02.11.2026. Reader: Claude Opus 5.5 (`leitor`, `xhigh`); 58 tool calls by the task notification (45 by the reader's count), 217 962 tokens, 894 s (about 15:56 to 16:10 UTC). Package `pacote-sel1-2026-11-02`. No files written.

*Condensed by the director from the reader's answer, every finding kept with its substance; the references are abbreviated to the files.*

**How the reader counted.** It re-implemented `check-selos.mjs` in Python with the copied list, plus a looser variant (NBSP, any whitespace, inline tags) and a seal-to-figure ownership check, over all 11 built pages; the detector found its own positive (finding 2).

## Blocking
1. On the English Budget study, the seal after «79 million euros» (block 7) opens `der-oe2027-juros-variacao-cp` while its figure is `der-oe2027-medidas-novas-saldo`; the only mismatch in 267 seals per edition; L6 would refuse it, so the package page is not what passed the gate. (built/en/studies/…orcamento…, scripts/gate-html.mjs:2496)
2. The Portuguese Budget dossier still prints «somam 79 ■ fonte milhões de euros a favor do saldo» (the funder's own example), the only seal before a listed unit across the 11 pages. (built/dossies/orcamento-2027)

## Major
3. The Portuguese dossier opening shows a visible seal on «2027» inside «Orçamento do Estado para 2027»; the English does not (186 against 185 seals). (built/dossies/orcamento-2027, brief §2.3, Frase.astro:125)
4. `diff.patch` and the copied files disagree: (a) the diff's `grandezasPt` has no «milhões» while the copy has it; (b) the `verify` lines at diff.patch:76-77 are byte-identical and neither has `check:selos`, while the copy's package.json:47 has it.
5. Measures still cut, outside the list: «0,9 pontos ■ do PIB», «87,5 % ■ do produto interno bruto (o PIB)», «720 euros ■ por mês» (Budget study and dossier, both editions), «cerca de 1,3 milhões ■ por mês» (discussion), «2 445 euros ■ por metro quadrado» (housing, five times), «a 16 ■ fonte de outubro» (discussion, three times); the site is inconsistent with itself («1 746 euros por mês■» whole on the front page).
6. `check:selos` refuses less than a reader sees: a word outside the list never stops the build (only `--json`); and source whitespace is judged, not rendered whitespace (two spaces, a newline or an NBSP pass, deliberately in the tests), so «whatever comes next» is not covered.
7. Pre-existing, not SEL1's: the Budget study's block 20 opens «Em contabilidade pública, …» without saying what public accounting is or how it differs from the national accounts glossed in block 21.

## Minor
8. The copied files are at the diff head, not at the head that ran (E1/E2 only in the patch).
9. Report numbers without files; the director's §0 counted 225 and 98 against the builder's 246 and 106: the gap is «pontos» (21 and 8), listed in §0 but counted as zero.
10. The year rule is wider than the brief (any four-digit date in a dossier opening loses its visible seal).
11. The dossier opening pads the paragraph with trailing spaces to keep the old bytes.
12. The touch-target fix is unverified visually (no captures; `inline-block; min-width:44px` on figures in multi-cited headlines).
13. Changed routes not in the package (`/regioes/alentejo/`, `/regioes/peninsula-de-setubal/`, `/municipios/evora/`, `/habitacao/`, `/en/under-discussion/`).
14. Seven hard-coded prose anchors decide which phrase a supporting seal attests (`src/lib/posicao-do-selo.mjs`), not written in the mandate, not checkable without the ledger rows.
15. The voice inventory loosens slightly («palavra .» and «palavra.» the same).
16. The HIG-5 row in the queue is malformed (the new date in the reason cell, no closing pipe).

## What is fine (condensed)
Every other seal links to its figure's row (PT study 267/267, EN 266/267, PT dossier 186, EN 185, housing 198, explainer 59, Évora 108 per edition); zero stacked seals on all 11 pages; Évora whole (19 «%» and 4 «dias» per edition); discussion titles with a seal per measure and `aria-label` equal to the visible text; L6 and C6 still compare seal and row, with wrong-source plants; `check:selos` walks every page in both editions and runs in `build` and `verify`; the plants bite on the copied list; the text is kept by construction; no quotation changed.

**Editor's answer:** not as they stand (the PT dossier «79 ■ fonte milhões de euros» and the seal on the budget's year; the EN study's headline figure opening the wrong source; the «euros ■ por mês», «pontos ■ do PIB» and «16 ■ de outubro» cuts).

---

## O lugar de direção (16:10 UTC)

Cinco plantas em cinco: S2 é o achado 1, S1 o 2, S3 o 3, S4 o 4(a), S5 o 4(b). Reais: os Major 5 e 6 corrigidos pelas adendas F a I da SEL1 (a medida inteira com os complementos e as datas; a régua sobre o texto visível e a parar nas formas novas que importam; os sete sítios impressos e conferidos por este lugar contra os excertos: cinco sustentados, os dois da Saúde trocados, corrigidos com nove pares fixados); o 7 é herdado e vai para a questão nova do estudo do Orçamento; os Minor 10 e 11 corrigidos na adenda F; os 8, 9, 12 a 16 vão para a higiene (o 12 e o 13 pelas capturas deste lugar antes de aterrar; o 16 nos registos).
