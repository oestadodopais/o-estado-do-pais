# Leitura curta da passagem de correção V2-a-c (13.10.2026, à noite)

*Lançada pelo lugar de direção às 00:49 UTC de 14.10 sobre o pacote do sítio de `8e92f6b9` a `de3b31cc` e do motor de `b95dc75f` a `559eac97` (a passagem V2-a-c do Codex `gpt-6-astra` em `high`, retomada na mesma sessão, pelo mandato `MANDATO-V2A-c-2026-10-13.md`), com os documentos alojados e os ficheiros do publicador copiados da cabeça do motor para o pacote (a M65, depois da falta na leitura anterior). O leitor: o Claude Opus 5.5 (a definição `leitor`, M26), em `xhigh`, 257 873 símbolos, 78 chamadas de ferramentas, treze minutos. As cinco plantas do lugar de direção (`PLANTAS-V2A-c-2026-10-13.json`, quatro dentro dos hunks do diff e uma numa página construída) foram as cinco mordidas: os achados 1 a 5. Os achados 6 a 9 (Major) e 10 a 16 (Minor) são reais e estão decididos no mandato `MANDATO-V2A-d-2026-10-14.md`; o leitor confirmou contra os PDF e as páginas alojadas as dezoito células, a grafia do quadro, as variações, os oito selos e a âncora da RTP. O texto do leitor segue como foi entregue, em inglês.*

## Blocking

1. **The copied site proof anchors Leitão Amaro's words on «O ministro das Finanças», but the hosted article, the engine proof and the diff all say «ministro da Presidência».** The copy hashes to 35be12a5…, not the crossing record's 88ff33a7…. With the bodies read, the anchor check fails. ledger/provas/v2a/provas.json:313, motor/publisher/recortes/v2a/provas.json:313, motor/content/15 Orcamento do Estado 2027/source/v2a/rtp-amaro.html:1184, diff.patch:3603662, ledger/cruzamentos/v2a-provas.json:9

2. **The copied family file heads the 2026-estimate page «Estimativa de dois mil e vinte e sete», which is the exact confusion finding 8 removes.** The diff and the built page both say «vinte e seis». The V2AC year test would refuse a page built from this copy. src/data/o-que-e-das-familias.mjs:3821, diff.patch:3603898, tests/linha/v2a.mjs:34

3. **The copied site parser swaps «novembro» and «outubro», so the PCP speech would be dated 2026-11-09.** Its twelve month assertions still pass (see 9). Only the body comparison catches it, and only when RESEARCHHUB_DIR is set. scripts/afirmacoes.mjs:15, diff.patch:3603706

4. **The copied engine parser carries the same swap, and it hashes to cd16a150…, not the listed 11190a1b….** Regeneration would date the PCP row 2026-11-09. motor/publisher/v2a.py:33, motor/diff.patch:641, motor/FICHEIROS-DO-MOTOR-COPIADOS.md:61

5. **The EN page for the 2027 total heads the Health figure «Education».** It hashes to 33ea7ec1…, not the receipt's 93b5b716…, and the capture shows «Health». K17's heading comparison would refuse it; the V2AC check alone would not. built/en/ledger/oe-2027-saude-despesa-total-consolidada-2027/index.html:2, design/especime-v3/capturas/v2a-2026-10-12/c/capturas.json:4750, tests/cartao/familias.mjs:609

## Major

6. **The Health headings print «Estimativa de dois mil e vinte e seis» rather than the table's «Estimativa»/«2026» that the mandate named, and as editor I would not print them.** A Portuguese daily writes «Estimativa para 2026». Four lines of spelled-out years bury the one distinction the page exists to make. The choice follows K17's no-digit rule, but the report records it only in a table cell, not as a V2A question. src/data/o-que-e-das-familias.mjs:3905, tests/cartao/familias.mjs:234, relatorio-construtor.md:234, brief.md:7

7. **The RTP page says the article «não especifica se a despesa é total ou efetiva», but the article's own figures identify the measure.** «17 mil 858 milhões» and «Menos 267,5 milhões» match the total consolidated 17 858,4 and 18 125,9 − 17 858,4. The effective line would give 259,3 and −1,4 %. The mandate asked «de que medida fala»; as it stands, a reader cannot tell whether 1,5 % is right. built/livro-razao/afirmacao-rtp-saude-queda-oe2027-2026-10-09/index.html:2, ledger/claims/afirmacao-rtp-saude-queda-oe2027-2026-10-09.yml:34, ledger/claims/oe-2027-saude-despesa-total-consolidada-2026.yml:9, brief.md:11

8. **The three road-PPP pages fail the two-minute test.** Neither the heading nor the sentence gives the year. Nothing says that net = gross − revenue (889 = 1 152 − 263). The excerpt prints fourteen unlabelled yearly figures. src/data/o-que-e-das-familias.mjs:3770, built/livro-razao/oe-2027-ppp-rodoviario-encargos-brutos-2027/index.html:2

9. **The site's month plants cannot bite.** Each expected date is computed from the list's own index, and the «mês trocado» messages are hard-coded strings that no check emits. The report claims eleven swaps refuse October «em cada lado»; only the engine actually asserts it. scripts/afirmacoes.mjs:87, scripts/afirmacoes.mjs:88, motor/publisher/v2a_test.py:73, relatorio-construtor.md:241

## Minor

10. **The V2AC Health check never tests the heading's measure or programme.** A declaration that says «efetiva» on a total page would pass. tests/linha/v2a.mjs:34

11. **The total/effective definition is the note to Quadro 4.38 (Projetos), yet it is published inside the table 5.37 excerpt, and the locator says only «nota, p. 145».** The definition does hold for 5.37 by that table's own rows (18 062,4 + 5,5 + 58,0 = 18 125,9). ledger/claims/oe-2027-saude-despesa-total-consolidada-2026.yml:23, design/especime-v3/medicoes/v2a-2026-10-12/fontes-conferidas-c.json:40

12. **The PIB year test is vacuous, because the required Proposta title already contains the year; «V2AB título» has no plant.** tests/linha/v2a.mjs:38, tests/linha/v2a.mjs:21

13. **The CFP cover reader still hard-codes «outubro», though it fails closed.** motor/publisher/v2a.py:178

14. **The report gives no cost for this pass, which mandate finding 14 required.** relatorio-construtor.md:288, brief.md:21

15. **Six proof files were rewritten while the final gates were running, after a clean start.** design/especime-v3/medicoes/v2a-2026-10-12/portoes-c/estado.fim:1

16. **The PT headings leave «Conta do Pograma Legado» unquoted, so the source's typo reads as the house's own.** src/data/o-que-e-das-familias.mjs:3905

## «What is fine»

17. All 18 values and units are unchanged, and they agree across the YAML, livro-razao.json, the titles and the embeds on all 36 pages (ledger/claims/oe-2027-saude-despesa-total-consolidada-2027.yml:9).
18. The cells, the «Pograma» spelling and the variations (−1,5, −1,4, 3,0) reproduce from my pdftotext extraction of pp. 303, 123 and 9 (ledger/claims/oe-2027-saude-despesa-total-consolidada-variacao.yml:9).
19. The eight hosted documents hash to their receipts and to the report's table (relatorio-construtor.md:54).
20. All 36 pages show a body sha256 equal to the engine proof and the receipt (built/livro-razao/oe-2027-cenario-ihpc-2026/index.html:8).
21. The CFP cover reads «7 de outubro de 2026 / Parecer n.º / 05/2026», and the RTP anchor is the structured `itemprop="author"` signature, not a navigation label (design/especime-v3/medicoes/v2a-2026-10-12/fontes-conferidas-c.json:6).
22. The V2AB/V2AC checks run inside verify, and the statement checks read three bodies inside build (design/especime-v3/medicoes/v2a-2026-10-12/portoes-c/verify.log:2713, design/especime-v3/medicoes/v2a-2026-10-12/portoes-c/build.log:422).
23. The final gates read 0/0/0/0 at c5e47d04 (site) and 559eac97 (engine) from a clean tree, and the three earlier attempts' codes match the report (design/especime-v3/medicoes/v2a-2026-10-12/portoes-c/build.codigo:1).
24. All 540 capture images hash to the receipt, and the counts of 63 plants, 2 780 L1 pages and 3 211 untouched lines reproduce (design/especime-v3/medicoes/v2a-2026-10-12/plantas-c.json:1).

not yet: there are five Blocking copy defects. The Health headings, the RTP measure and the road-PPP pages (6 to 8) do not yet tell a reader what each number is, and the site's month plants (9) do not bite.
