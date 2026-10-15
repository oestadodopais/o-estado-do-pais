# Leitura curta da passagem de correção V2-a-e (14.10.2026, ao fim da tarde)

*Lançada pelo lugar de direção às 16:10 UTC sobre o pacote do sítio de `dc8fe5e1` a `3521ec34` e do motor de `80268af4` a `d8410f79` (a passagem V2-a-e do Codex `gpt-6-astra` em `high`, retomada na mesma sessão, pelo mandato `MANDATO-V2A-e-2026-10-14.md`), montado por `scripts/leituras/pacote.sh` com os corpos alojados das linhas mudadas pela M83 (`motor/CORPOS-ALOJADOS.md`: sete linhas, dois documentos, os recibos e os direitos ao lado). O leitor: o Claude Opus 5.5 (a definição `leitor`, M26), em `xhigh`, 285 293 símbolos, 74 chamadas de ferramentas, treze minutos. As cinco plantas do lugar de direção (`PLANTAS-V2A-e-2026-10-14.json`, três dentro dos hunks do diff e duas em páginas construídas) foram as cinco mordidas: os achados 2 a 6. O achado 1 é do pacote (a M83 só trazia os corpos das linhas cujo YAML mudou; a passagem mudou as frases do PCP e da RTP pelos dados da família), corrigido pelo lugar de direção no guião do pacote (M83-b). Os achados 7 e 8 (Major) e 9 a 14 (Minor) são reais e estão decididos no mandato `MANDATO-V2A-f-2026-10-14.md`. O texto do leitor segue como foi entregue, em inglês.*

## Blocking

1. **The package has no hosted body for two rows whose sentences this pass rewrote: PCP (e426f05d…) and the RTP decrease (18f34245…).** The manifest lists only the seven rows whose claim files changed. This pass rewrote both pages' sentences, including the new attribution «Na intervenção publicada pelo PCP, Paulo Raimundo afirma». I did not check either row's words against a source, so the PCP attribution the mandate asks about is unverified. motor/CORPOS-ALOJADOS.md:7, src/data/o-que-e-das-familias.mjs:3774, src/data/o-que-e-das-familias.mjs:3828, built/livro-razao.json:781, built/livro-razao.json:828

2. **The EN PPP-total receipt prints the 2027 Total as «1 348» under «Transcribed from the source, word for word».** PDF p. 123, the PT page and the public export all print 1 438. built/en/ledger/oe-2027-ppp-total-encargos-liquidos-2027/index.html:8, built/livro-razao/oe-2027-ppp-total-encargos-liquidos-2027/index.html:8, built/livro-razao.json:103554

3. **The EN sem-PRR variation page says the PRR reduction «explains the rise with PRR and the fall without it».** That is the opposite of its own figures: with the PRR, 18 062,4 to 17 803,1; without it, 17 291,3 to 17 803,1. PT, `inspecao-e.json`, `frases-prr-e.md` and the e/ capture all say «fall with PRR and the rise without it». built/en/ledger/oe-2027-saude-despesa-efetiva-consolidada-sem-prr-variacao/index.html:2, design/especime-v3/medicoes/v2a-2026-10-12/inspecao-e.json:276, design/especime-v3/medicoes/v2a-2026-10-12/frases-prr-e.md:33

4. **The copied net-road row's `locator_en` says «printed 118»; the diff and PDF p. 124 say 108.** The copy hashes to babe98c7…, not the crossing record's 3dad5e30…. ledger/claims/oe-2027-ppp-rodoviario-encargos-liquidos-2027.yml:24, diff.patch:1215243, ledger/cruzamentos/v2a.json:85

5. **The copied origins file gives the road support page as 142; the diff says 124.** PDF p. 142 does not contain the passage, and K16 would refuse the copy. src/data/origens-v2a.json:56, diff.patch:1216450, tests/cartao/origens-v2a.mjs:14

6. **The copied engine publisher reads the PRR-cycle support from p. 13; the diff says 31.** p. 13 lacks the passage (p. 31, my known-positive, has it), so `apoios()` would throw. motor/publisher/v2a.py:261, motor/diff.patch:373

## Major

7. **The −1,5 % total-variation page lost «incluindo PRR» from both its sentence and its ressalva.** Neither that page nor the RTP «cai 1,5 %» page now tells a reader that the figure includes PRR spending, or that the same table prints +2,9 % without it. `explica` excludes the total stem. A reader gets an unexplained cut on exactly the half of V2-b item 1 that the mandate says the PRR sentence must explain. src/data/o-que-e-das-familias.mjs:4464, ledger/claims/oe-2027-saude-despesa-total-consolidada-variacao.yml:40, design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:21

8. **The PPP-total page says the total «soma os setores» and prints the sector rows, but those rows' 2027 cells sum to 1 439, not the 1 438 shown.** From p. 123: 889 + 312 + 254 − 13 − 3 = 1 439. The page tells the reader nothing about the gap. V2A-56 says the sentence «não apresenta uma nova conta», but «soma» says the opposite. src/data/o-que-e-das-familias.mjs:3945, design/especime-v3/medicoes/v2a-2026-10-12/ppp-total-e.json:28, relatorio-construtor.md:426

## Minor

9. **The EN headings keep «excluding the RRP» while the sentences say «Recovery and Resilience Plan (PRR)», so the full name is not the first occurrence.** On the −1,4 % page, «…is the plan's full name» has no antecedent. tests/linha/v2a.mjs:34, design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:19, src/data/o-que-e-das-familias.mjs:4309

10. **As editor I would rewrite the PRR paragraph.** «a sua redução explica … a subida sem ele» credits the PRR's fall with a rise it does not cause. «as colunas» refers to columns the reader never sees. In PT, «Refere-se à estimativa de 2026» comes right after «O relatório…» and reads as being about the report. On the Leitão Amaro page, «O relatório» names no report. src/data/o-que-e-das-familias.mjs:3986, design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:13

11. **The supports are labelled «Definição de» / «definition by», though p. 31, p. 302 and the p. 123 rows define nothing.** The p. 123 support also splices non-adjacent table rows without marking the cut. src/data/origens-v2a.json:73, motor/publisher/v2a.py:274

12. **The PCP page says «No quadro das parcerias público-privadas» without naming the Budget report or table 4.25.** EN readers get the claim only in Portuguese. src/data/o-que-e-das-familias.mjs:3774

13. **The rulers have gaps.** The V2AE PRR check skips the Leitão Amaro page, which V2A-47 counts as the fifth PRR page. No plant inverts the explanation words. The locator check reads only the PT locator. tests/linha/v2a.mjs:48, tests/linha/v2a.mjs:133, tests/livro/indice.mjs:340

14. **The report still says the V2-a-d cost is «por acrescentar» at line 385, and gives it at line 404.** relatorio-construtor.md:385, relatorio-construtor.md:404

## «What is fine»

15. Both hosted bodies hash to the rows' `source_sha256` (a338bd00…, 095b231a…), and each listed row has its request receipt and 27 rights files (motor/corpos-alojados.json:9).
16. All 18 values and units match PDF pp. 303 and 123 and the previous reads, and 3 211 earlier rows are untouched (design/especime-v3/medicoes/v2a-2026-10-12/inspecao-e.json:3).
17. The p. 302, p. 31 and p. 124 excerpts are word for word in the PDF, and the 40 rendered supports equal the origins file (ledger/provas/v2a/provas.json:357).
18. The road pages keep 1 152 − 263 = 889 and cite p. 124 (printed 108) in both editions, and the total page carries no road account (src/lib/v2a-palavras.mjs:19).
19. The PCP page quotes by token, uses the 2027 tokens 1 152 and 889, and has no sentence in the house's own voice (tests/linha/v2a.mjs:88).
20. The four gate codes are 0, both `estado.fim` files are 0 bytes, and the gate head 7c945b10 equals the dist version (design/especime-v3/medicoes/v2a-2026-10-12/portoes-e/build.codigo:1).
21. The «efetiva» to «total» plant bites in both editions, and the HTML plants number 64 (design/especime-v3/medicoes/v2a-2026-10-12/portoes-e/verify.log:2704).
22. All 480 PNG hashes match, 160 cases with no overflow, and 110 plant messages sit at their cited lines (design/especime-v3/capturas/v2a-2026-10-12/e/capturas.json:1).
23. The V2-a-d cost matches the mandate, and the V2-a-e cost is left to the launcher (relatorio-construtor.md:404).

not yet: there are six Blocking findings (two package bodies missing, two built-page defects, three copy-versus-diff mismatches), and the −1,5 % / RTP pages lost their PRR qualifier.
