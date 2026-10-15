# Leitura curta da passagem de correção V2-a-f (14.10.2026, à noite)

*Lançada pelo lugar de direção às 17:27 UTC sobre o pacote do sítio de `a8f1bbf6` a `3ba2f321` e do motor de `d8410f79` a `c239badf` (a passagem V2-a-f do Codex `gpt-6-astra` em `high`, retomada na mesma sessão, pelo mandato `MANDATO-V2A-f-2026-10-14.md`), montado por `scripts/leituras/pacote.sh` com os dezoito corpos alojados pela M83-b (as páginas pedidas trazem as suas linhas: `motor/CORPOS-ALOJADOS.md`, dezoito linhas, cada uma com o recibo e os direitos ao lado). O leitor: o Claude Opus 5.5 (a definição `leitor`, M26), em `xhigh`, 258 469 símbolos, 81 chamadas de ferramentas, doze minutos. As cinco plantas do lugar de direção (`PLANTAS-V2A-f-2026-10-14.json`, três dentro dos hunks do diff, uma numa página construída e uma no relatório) foram as cinco mordidas: os achados 1 a 4 e 6. O achado 5 (Major) e os 7 a 11 (Minor) são reais e estão decididos no mandato `MANDATO-V2A-g-2026-10-14.md`. O texto do leitor segue como foi entregue, em inglês.*

## Blocking

1. **The Portuguese RTP page now says the opposite of the source: the PRR is "excluded" from the variation.** The PT sentence reads «A variação da despesa total consolidada exclui a despesa relativa ao Plano de Recuperação e Resiliência». The data, `frases-f.md`, the EN page and p. 303 (which has separate "Sem PRR" columns) all say it *includes* that spending. This page's file hashes to 2455f94b…, but the capture recorded 03209498…, so the copy was changed after it was built. Right after this sentence the page cites the report's ex-PRR comparison, so the paragraph contradicts itself. built/livro-razao/afirmacao-rtp-saude-queda-oe2027-2026-10-09/index.html:2, src/data/o-que-e-das-familias.mjs:4536, design/especime-v3/medicoes/v2a-2026-10-12/frases-f.md:19, design/especime-v3/capturas/v2a-2026-10-12/f/capturas.json:4187

2. **The copied −1,5 % ledger row says `ressalva_en: "Forecast, not outturn. Excluding RRP."`, but the diff adds "Including RRP."** The copy hashes to 82337d31…, while the crossing record says 4e7de32b…. The export and the engine both say "Including". ledger/claims/oe-2027-saude-despesa-total-consolidada-variacao.yml:41, diff.patch:1226392, ledger/cruzamentos/v2a.json:217, built/livro-razao.json:104002

3. **The copied V2AE/V2AF ruler leaves the RTP page out of `totalPrr`, but the diff includes it.** With this copy, nothing checks the RTP qualifier, its support or its open excerpt, so finding 1 would pass. The RTP plants would also fail their own assert. The gate log shows the qualifier plant biting twice, which only the diff's version produces. tests/linha/v2a.mjs:52, diff.patch:1227957, tests/linha/v2a.mjs:147, tests/linha/v2a.mjs:151, design/especime-v3/medicoes/v2a-2026-10-12/portoes-f/verify.log:2767

4. **The copied engine publisher writes «As linhas setoriais do quadro somam exatamente o total impresso».** The diff says «não somam». On p. 123, 889+312+254−13−3 = 1 439, while the printed Total is 1 438. This copy would publish a false ressalva. motor/publisher/v2a.py:228, motor/diff.patch:113, motor/content/15 Orcamento do Estado 2027/ledger.json:455

## Major

5. **Two pages fail the plain-reader test (I150).**
   - **PCP page:** «encargos brutos»/«líquidos» are never explained. The page does not say that 1 152 and 889 are 2027 figures (the 2027 token names the report instead). It does not say that the claimed 1 700 is above both.
   - **PPP-total page:** «encargos líquidos» and «valores de caixa a preços constantes» are jargon. Nowhere does the page say in plain words what 1 438 million is.

   built/livro-razao/afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09/index.html:2, built/livro-razao/oe-2027-ppp-total-encargos-liquidos-2027/index.html:2, design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:83

## Minor

6. **The report says the PCP page names «o quadro quatro ponto vinte e seis».** The pages, the data and the ruler all say «vinte e cinco» (table 4.25). relatorio-construtor.md:465, design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:83, tests/linha/v2a.mjs:96

7. **The report's counts and costs do not agree with each other.**
   - Plant messages: line 493 says 164 and line 507 says 165. `plantas-f.json` holds 165, each at its cited line.
   - V2-a-e cost: line 451 still says it «continua por medir», while line 487 gives it. This is the same defect achado 14 removed for V2-a-d.

   relatorio-construtor.md:493, relatorio-construtor.md:507, relatorio-construtor.md:451, relatorio-construtor.md:487

8. **As an editor I would not print «quadro quatro ponto vinte e cinco» / «Table four point twenty-five».** I would write «quadro 4.25» / «Table 4.25», as the report prints it, carried by a token. The spelled-out form reads like a number, not a table name. design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:46, design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:83

9. **The English edition has two Portuguese-side slips.**
   - Every EN support line prints «p. 302 do PDF (286 impressa)».
   - The EN Leitão Amaro sentence says «"PRR" in the table» on a page that shows no table.

   built/en/ledger/oe-2027-saude-despesa-total-consolidada-variacao/index.html:2, src/data/origens-v2a.json:14, design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:77

10. **The PCP and Amaro sentences use a row's `reference_date` token to give the report's year.** That token is the data period, not the document's edition. design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:79, design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:83

11. **Nothing checks the table number on the PPP-total page.** The check at line 67 only tests the «Total» wording, so a wrong table number would pass. tests/linha/v2a.mjs:67

## «What is fine»

12. The package holds bodies for all 18 rows. Each body matches the row's sha256 and has its request receipt and 27 rights files (motor/corpos-alojados.json:1).
13. No value or unit changed in the 18 rows. The engine ledger hashes to the crossing record's d6ae6a56…, and its values match the public export (design/especime-v3/medicoes/v2a-2026-10-12/inspecao-f.json:3).
14. The p. 302, p. 31 and p. 124 passages are word for word in the PDF. The p. 123 sector excerpt is a contiguous block of the table. «Passagem de»/«Passage from» appears on exactly the four supports, and «Definição de» only on v2a-total-efetiva (src/components/OrigemDaDefinicao.astro:97).
15. The PCP quote and its attribution match the hosted speech (motor/content/15 Orcamento do Estado 2027/source/v2a/pcp-afirmacao.html:439).
16. The PRR paragraph is true to p. 303: with the PRR, 18 062,4 → 17 803,1; without it, 17 291,3 → 17 803,1. The PRR share in 2027 is zero, and the text does not credit the rise to the share's fall (design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:13).
17. The four gate codes are 0, and both `estado.fim` files are empty. Head b36a7925 is the same at start and end, and equals the dist version and the capture head (design/especime-v3/medicoes/v2a-2026-10-12/portoes-f/build.codigo:1).
18. All 480 PNG hashes and dimensions reproduce: 160 cases, no overflow, and 44 inspected captures, 32 + 12 (design/especime-v3/capturas/v2a-2026-10-12/f/capturas.json:1).
19. In the diff's version of the rulers, the inversion plants bite on the −1,4 % page and the Amaro page, and the locator plants bite on both fields of all 36 locators (design/especime-v3/medicoes/v2a-2026-10-12/portoes-f/verify.log:2769).
20. The V2-a-d cost appears once and the V2-a-e cost is given as the mandate states (relatorio-construtor.md:404, relatorio-construtor.md:487).

not yet: as packaged, the PT RTP page inverts the PRR qualifier, and three copied files contradict the diff (ledger row, ruler, engine ressalva).
