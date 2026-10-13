# Leitura curta da passagem de correção V2-a-b (13.10.2026)

*Lançada pelo lugar de direção às 22:57 UTC sobre o pacote do sítio de `ef0dc7dd` a `2c24dca2` e do motor de `dfeca64d` a `b95dc75f` (a passagem V2-a-b do Codex `gpt-6-astra` em `high`, retomada na mesma sessão, pelo mandato `MANDATO-V2A-b-2026-10-13.md`); as cabeças do sítio são as da história anterior à reescrita do ramo pelo lugar de direção, feita logo a seguir para os corpos integrais das páginas de terceiros nunca terem existido em nenhum commit (a cabeça `2c24dca2` passou a `5e694b9f`, com a mesma árvore). O leitor: o Claude Opus 5.5 (a definição `leitor`, M26), em `xhigh`, 314 707 símbolos, 82 chamadas de ferramentas, catorze minutos. As cinco plantas do lugar de direção (`PLANTAS-V2A-b-2026-10-13.json`, três dentro dos hunks do diff, uma fora dos hunks declarada com a razão e uma numa página construída) foram as cinco mordidas: os achados 1 a 5. O achado 6 (Major) era do lugar de direção e estava resolvido pela reescrita do ramo quando a leitura acabou; o achado 7 (Major) é do lugar de direção, que não pôs os documentos alojados no pacote, e as palavras das frases ficam por conferir contra as fontes na leitura seguinte, com os corpos no pacote; o achado 8 (Major) e os 9 a 16 (Minor) estão decididos no mandato `MANDATO-V2A-c-2026-10-13.md`. O texto do leitor segue como foi entregue, em inglês.*

## Blocking

1. **The engine source quotes RTP as «Menos 276,5 milhões», but every exported artefact says 267,5.** Line 49 of `v2a.py` sits outside the hunks of the engine diff. The YAML, both proof files and the engine ledger all carry 267,5, which is 18 125,9 − 17 858,4. With this source, `statement()` would fail `require(quote in text)` and the engine's `v2a_test` would fail; otherwise it would export a wrong figure into an excerpt published as word for word. References: motor/publisher/v2a.py:49, motor/content/15 Orcamento do Estado 2027/ledger.json:602, ledger/provas/v2a/provas.json:347, ledger/claims/afirmacao-rtp-saude-queda-oe2027-2026-10-09.yml:33

2. **The PT GDP page prints the CFP conclusion as «XXV Conselho Constitucional», under «Transcrito da fonte, palavra por palavra».** The YAML, the EN page, the IHPC page and the proof all read «Governo». This page's sha256 (fa4bc7d8…) differs from the capture receipt (ef733ff9…). The other 35 page hashes match. References: built/livro-razao/oe-2027-cenario-pib-real-crescimento-2027/index.html:8, built/en/ledger/oe-2027-cenario-pib-real-crescimento-2027/index.html:8, ledger/claims/oe-2027-cenario-pib-real-crescimento-2027.yml:36, design/especime-v3/capturas/v2a-2026-10-12/b/capturas.json:4712

3. **The copied Leitão Amaro YAML gives the name as «…Saúde sobe 3%», while the diff, the excerpt, the export and both pages read «sobre 3%».** The `name` field must be the words as said. The file no longer hashes to its `exported_row_sha256`. References: ledger/claims/afirmacao-leitao-amaro-saude-oe2027-2026-10-09.yml:14, diff.patch:2409605, built/livro-razao.json:694, ledger/cruzamentos/v2a.json:15

4. **The copied GDP YAML places the cell on «p. 19», while the diff, `name_source_en`, the export and the pages say p. 9.** Table 1 is on p. 9; p. 19 is the commentary. The file's hash does not match the crossing record. References: ledger/claims/oe-2027-cenario-pib-real-crescimento-2027.yml:15, diff.patch:2409707, built/livro-razao.json:101599, ledger/cruzamentos/v2a.json:61

5. **The copied `afirmacoes.mjs` inverts the body test (`text.includes`); the diff has `!text.includes`.** With `RESEARCHHUB_DIR` set, the copy rejects every intact statement. Without it, `text` is null and the copy passes. The log cannot tell the two cases apart: every statement plant bites on the claim-versus-proof comparison alone, and the summary line does not say whether the bodies were read. References: scripts/afirmacoes.mjs:21, diff.patch:2410884, scripts/afirmacoes.mjs:54, design/especime-v3/medicoes/v2a-2026-10-12/b-conferencias/afirmacoes-motor.log:9

## Major

6. **Finding 7 is fixed in the tree but not in the history: the full RTP and PCP pages stay in the branch's earlier commits, and an ff-only landing would publish them to the public repository.** The report confirms the history was not rewritten. References: diff.patch:2410589, diff.patch:2410849, diff.patch:2410853, relatorio-construtor.md:166, brief.md:9

7. **The hosted documents are not in the package, so the source-word checks this read asks for cannot be made.** The package has no `source/v2a/`, no PDF, no HTML body and no `v2a-fontes.json`. These therefore remain unproven:
   - the words of each «o que é» sentence;
   - the RTP anchor «RTP / VER MAIS», which reads like a navigation label; its plant only deletes the string, so it cannot show the string belongs to this article;
   - the spelling «Pograma» on p. 303;
   - the edition read from the cover;
   - V2A-17.

   References: ledger/provas/v2a/provas.json:346, motor/publisher/v2a.py:66, motor/publisher/v2a_test.py:64, relatorio-construtor.md:162, relatorio-construtor.md:167

8. **The Health level pages fail the two-minute test.** The 2026-estimate page and the 2027-budget page share the same heading and the same sentence («…na estimativa ou no orçamento indicado»). Nothing in either head gives the year or says which figure it is, so 18 062,4 and 17 803,1 read as the same thing. Neither «Programa Legado» nor «efetiva» versus «total» is ever explained. References: src/data/o-que-e-das-familias.mjs:3826, src/data/o-que-e-das-familias.mjs:3882, built/livro-razao/oe-2027-saude-despesa-efetiva-consolidada-2026/index.html:2, built/livro-razao/oe-2027-saude-despesa-efetiva-consolidada-2027/index.html:2

## Minor

9. **The RTP sentence talks about the house («A notícia alojada», «The hosted article»).** References: src/data/o-que-e-das-familias.mjs:3728, built/livro-razao/afirmacao-rtp-saude-queda-oe2027-2026-10-09/index.html:2

10. **The scenario sentences leave out the year and call the Proposta «Orçamento do Estado».** The 2,9 % is the forecast for 2026, and a reader can take it for next year's. References: src/data/o-que-e-das-familias.mjs:3742, src/data/o-que-e-das-familias.mjs:3756, ledger/claims/oe-2027-cenario-ihpc-2026.yml:21

11. **«É o valor previsto para total dos encargos líquidos das parcerias público-privadas no quadro das parcerias público-privadas» is ungrammatical and circular.** References: src/data/o-que-e-das-familias.mjs:3812, built/livro-razao/oe-2027-ppp-total-encargos-liquidos-2027/index.html:2

12. **No page and no public export shows the sealed sha256 of the bodies; it is only in `provas.json`.** References: ledger/provas/v2a/provas.json:306, built/livro-razao/afirmacao-leitao-amaro-saude-oe2027-2026-10-09/index.html:2

13. **The five V2AB page checks run from a measurement script, not from build or verify.** «V2AB» never appears in the final gate logs. References: design/especime-v3/medicoes/v2a-2026-10-12/conferir-b.mjs:25, design/especime-v3/medicoes/v2a-2026-10-12/b-conferencias/html.log:6, design/especime-v3/medicoes/v2a-2026-10-12/portoes-b/verify.log:76

14. **The report leaves out this pass's own cost and the final site head, both of which the mandate requires.** References: relatorio-construtor.md:224, relatorio-construtor.md:183, brief.md:15, brief.md:23

15. **The PCP date parser still hard-codes October, in both the engine and the site.** References: motor/publisher/v2a.py:33, scripts/afirmacoes.mjs:25

16. **The pages write «conta do Programa Legado Saúde», not the table's own wording («Saúde (PL15) — Conta do Pograma Legado») that the mandate asked for.** References: src/data/o-que-e-das-familias.mjs:3821, ledger/claims/oe-2027-saude-despesa-efetiva-consolidada-2026.yml:36, relatorio-construtor.md:168

## «What is fine»

17. No value, unit, source or attribution line changes in any of the 18 claim diffs, and every new excerpt keeps its original cell line (diff.patch:2409596).
18. The published variations reproduce from the cells: −1,48 rounds to −1,5, +2,96 to 3,0 and −1,44 to −1,4 (ledger/claims/oe-2027-saude-despesa-total-consolidada-variacao.yml:36).
19. `ledger/provas/v2a/` holds only `provas.json`, with no body (the longest excerpt is about 725 characters), and it hashes to f40a01d4…, the value in the crossing record (ledger/cruzamentos/v2a-provas.json:8).
20. Findings 6, 8, 12 and 15 hold in both editions: MF and CFP in the heading, sentence and embed, the whole «endossa» sentence, the words as the name with «Título do documento», no lowercase prr/rrp, and English locators (built/livro-razao/oe-2027-cenario-ihpc-2026/index.html:2).
21. The general date rule replaces the 2026-10-09 special case, only the three statements carry full-date editions, and the calendar plants fire (design/especime-v3/medicoes/v2a-2026-10-12/portoes-b/build.log:12536).
22. The table, cover and anchor plants change the extraction inputs and bite (design/especime-v3/medicoes/v2a-2026-10-12/b-conferencias/motor-test.log:7).
23. The final gates read 0/0/0/0 at c71ff8ac (site) and b95dc75f (engine), starting from a clean tree (design/especime-v3/medicoes/v2a-2026-10-12/portoes-b/build.codigo:1).
24. All 540 capture images hash to the receipt, and the engine diff matches the engine copies line for line (design/especime-v3/capturas/v2a-2026-10-12/b/capturas.json:1).

not yet: there are five Blocking copy defects, and before landing the branch history must not carry the full third-party pages (6) and the Health pages must say which year and which figure they show (8).
