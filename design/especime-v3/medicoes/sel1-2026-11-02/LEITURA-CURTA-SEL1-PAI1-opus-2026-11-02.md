Short read (M48) of SEL1's addenda F to I and PAI1's addendum C, 02.11.2026. Reader: Claude Opus 5.5 (`leitor`, `xhigh`); 42 tool calls, 213 684 tokens, 698 s (about 18:45 to 18:57 UTC). Package `pacote-lote1-curta-2026-11-02`. No files written.

*Condensed by the director, every finding kept with its substance.*

## Blocking
1. The Portuguese weekly page says «90 números foram relidos», the English «91 figures»; one resolver produces both, so the PT page is not what passed the gate. (built/explicacoes/leitura-da-semana)

## Major
2. `diff.patch` and the copied `posicao-do-selo.mjs` disagree on the PT anchor of `oe-2027-saude-contrato-programa-acss` (the diff puts it on the dotação phrase).
3. `diff.patch` and the copied `check-cruzamento.mjs` disagree on `confereRotulos` (only the copy has the `origin_sha256===exported_sha256` condition); no plant tells the two apart.
4. The «dois-espacos» plant is empty (three-element tuple; asserts exit 0).
5. English «87.5 % of gross domestic product ■ (GDP)»: the parenthesis is taken only after the Portuguese complement.
6. English «1 669 681 a year ■ earlier»: the «a year» complement moved a seal into a time phrase (a cut created by addendum F).
7. The housing study still cuts: «5,2 % ■ ao ano» (PT), «3,8 ■ alojamentos por mil habitantes», «40,9 mil ■ alojamentos», «5 970 677 ■ alojamentos», «723 215 ■ alojamentos vagos».
8. English weekly page «the source now writes 17,0» with a comma.

## Minor
9. A command-line flag `--prova-projecao-hb1` makes `gate-html.mjs` and `check-cadeia.mjs` exit 0 before checking. 10. The RP4-n `origin_sha256` values rewritten without a `--with-origin` run in the package. 11. The Health conclusion «contratos-programa ■ ainda por fechar» splits a phrase. 12. Shares and counted nouns after a seal pass as prose («86,2 % ■ do total», «1 362 294 ■ utentes elegíveis»). 13. The conclusion's anchor table keyed by the paragraph path alone. 14. Report numbers without files. 15. The EU housing-overburden definition not comparable with a card in the package. 16. English decimals mixed across the site. 17. The voice normalisation also removes whitespace before «)». 18. The exports unit still reads as a share before the definition.

## What is fine (condensed)
969 of 971 post-image lines match; every seal that follows a figure opens its row (Budget study 267/267, dossier 182/182, housing 198/198, weekly 3/3, home 45, discussion 246 per edition); the named forms are whole («0,9 pontos do PIB ■», «720 euros por mês ■», «2 445 euros por metro quadrado ■», «16 de outubro ■»); `check:selos` joins inline text, judges rendered whitespace and refuses the new forms; the year rule and the padding fixed; the weekly page in order with three entries and their definitions; the RP4-n registry with plants; HB1 planted in both gates; the nine hand-placed seals supported by their excerpts; no quotation changed.

**Editor's answer:** not as they stand (PT «90», EN «17,0», «(GDP)», «a year ■ earlier», the housing cuts); printable after those.

---

## O lugar de direção (18:57 UTC)

**Quatro plantas em cinco:** T2 é o achado 1, T4 o 2, T5 o 3, T3 o 8; **a T1 (o selo dos 150 euros antes de «por mês» na página do dossiê) não foi vista**; a classe é a que `check:selos` recusa no `build`, verde na cabeça real. Reais: os Major 4, 5, 6, 7 e o Minor 9 corrigidos pelas adendas J e K da SEL1, com a planta de `confereRotulos` do achado 3; o 10 corre na aterragem (`check:cruzamento --with-origin`); o 11 fica (deixado de propósito); o 12 vai para a higiene; o 16 é a questão nova do sítio inteiro (os decimais ingleses).
