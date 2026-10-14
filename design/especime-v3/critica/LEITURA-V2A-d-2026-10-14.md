# Leitura curta da passagem de correção V2-a-d (14.10.2026, de madrugada)

*Lançada pelo lugar de direção às 02:43 UTC sobre o pacote do sítio de `972c1f07` a `c351c12b` e do motor de `559eac97` a `80268af4` (a passagem V2-a-d do Codex `gpt-6-astra` em `high`, retomada na mesma sessão, pelo mandato `MANDATO-V2A-d-2026-10-14.md`), com os documentos alojados e os ficheiros do publicador copiados da cabeça do motor para o pacote. O leitor: o Claude Opus 5.5 (a definição `leitor`, M26), em `xhigh`, 331 237 símbolos, 91 chamadas de ferramentas, quinze minutos. As cinco plantas do lugar de direção (`PLANTAS-V2A-d-2026-10-14.json`, quatro dentro dos hunks do diff e uma numa página construída) foram as cinco mordidas: os achados 1 a 5. O achado 6 (Major) e os 7 a 12 (Minor) são reais e estão decididos no mandato `MANDATO-V2A-e-2026-10-14.md`, para a sessão seguinte; o leitor confirmou os nove cabeçalhos pela tabela do mandato, os dezoito valores, as duas contas, as plantas dos meses, da capa e do título, e os portões a zero. O texto do leitor segue como foi entregue, em inglês.*

## Blocking

1. **The PT RTP receipt says the article's amounts identify the «despesa efetiva consolidada», then gives the total consolidated amounts in the next sentence.** The EN page, the family file in the diff and the capture all say «total». The copy hashes to 9d0acd80…, not the receipt's cdb39083…. built/livro-razao/afirmacao-rtp-saude-queda-oe2027-2026-10-09/index.html:1, design/especime-v3/capturas/v2a-2026-10-12/d/capturas.json:3925, diff.patch:4805545

2. **The copied family file calls the effective 2027 row (17 803,1) «despesa total consolidada» in PT.** The diff adds «efetiva». Neither V2AC nor V2AD would refuse it, because neither tests the measure in the sentence (see 7). Only K17, run against the proved reading, would catch it. src/data/o-que-e-das-familias.mjs:3843, diff.patch:4805630, tests/cartao/leituras-provadas.json:14692

3. **The copied net road-PPP row heads its columns «2026 2028 2028», which puts 889 under 2028.** The diff, the engine ledger and both built pages print «2026 2027 2028». The copy hashes to eeb4d05d…, not the crossing record's df1286fe…. ledger/claims/oe-2027-ppp-rodoviario-encargos-liquidos-2027.yml:37, diff.patch:4804866, ledger/cruzamentos/v2a.json:85

4. **The copied engine publisher writes «nota ao quadro 4.37» into the PT locator, but PDF p. 145 is Quadro 4.38.** The diff, the EN line below it and the engine ledger all say 4.38. The copy hashes to 4e31823b…, not the listed 35305e48…. motor/publisher/v2a.py:241, motor/diff.patch:524, motor/FICHEIROS-DO-MOTOR-COPIADOS.md:61, motor/publisher/v2a_test.py:94

5. **The copied month plant expects «outubro» to read as 2026-11-09; the diff writes 2026-10-09.** On the correct parser this assertion throws. On an October/November swap, the October case would pass. scripts/afirmacoes.mjs:85, diff.patch:4805473

## Major

6. **Two-minute test: none of the three sem-PRR pages (17 291,3; 17 803,1; 3,0 %) says what PRR or RRP is.** The two effective variation pages (−1,4 % and 3,0 %) never tell a reader why the same spending falls with PRR and rises without it, which is the RTP/Amaro difference this block serves. The heading, the sentence and the ressalva each repeat «sem PRR» without explaining it. built/livro-razao/oe-2027-saude-despesa-efetiva-consolidada-sem-prr-variacao/index.html:1, built/livro-razao/oe-2027-saude-despesa-efetiva-consolidada-variacao/index.html:1, src/data/o-que-e-das-familias.mjs:3894

## Minor

7. **The new rulers check less than they claim.**
- V2AD fixes the Health heading but never the measure in the sentence, so finding 2 passes it.
- The period-token check runs only for Health; PPP headings are compared as text, so a literal «2027» passes.
- The words of the RTP account are not checked.
- 23 of the 24 HTML plants run in EN only.

tests/linha/v2a.mjs:39, tests/linha/v2a.mjs:40, tests/linha/v2a.mjs:58, tests/linha/v2a.mjs:74

8. **The report contradicts itself on the order of the final gates.** Row 15 says they ran after the last code-and-proof commit. Lines 335–337 say later commits (f3161ea9 onward, after b9497c1c) carry the captures and measurements. The delivery head and the cited `portoes-pelo-escrivao.sh:10` are not in the package. relatorio-construtor.md:307, relatorio-construtor.md:335, relatorio-construtor.md:337

9. **As editor I would cut repetitions on the Health pages.** The PT level sentences print «Conta do Pograma Legado» twice in a row, and they spell out the year in words under a digit heading. The variation pages repeat the comparison in the sentence and again in the ressalva. src/data/o-que-e-das-familias.mjs:3922, ledger/claims/oe-2027-saude-despesa-efetiva-consolidada-sem-prr-variacao.yml:40

10. **The PPP total page (1 438) carries the road account (1 152 − 263 = 889), which does not explain its own number.** `contaV2a` matches every `oe-2027-ppp-` id, and V2AD then requires the account on all four pages. src/lib/v2a-palavras.mjs:19, tests/linha/v2a.mjs:53, built/livro-razao/oe-2027-ppp-total-encargos-liquidos-2027/index.html:1

11. **The account «brutos menos receitas» is not in the note to table 4.25 that the mandate named.** «Encargos líquidos … 889 milhões» comes from the text on PDF p. 124, which no locator cites. No V2A question records the deviation. brief.md:22, src/lib/v2a-palavras.mjs:20, ledger/claims/oe-2027-ppp-rodoviario-encargos-liquidos-2027.yml:23

12. **The PCP page states 1 700 in the house's own voice («É o montante que o orçamento entrega…»).** The table published in this same block gives 1 152 gross and 889 net for 2027. built/livro-razao/afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09/index.html:1, design/observatorio/BRIEF-V2a-as-fontes-da-vigilancia-seladas-no-motor.md:54

## «What is fine»

13. All 18 values and units are unchanged, and the cells reproduce from my pdftotext extraction of pp. 303 and 123 (ledger/claims/oe-2027-saude-despesa-total-consolidada-2027.yml:9).
14. The nine headings match the mandate in both editions, and the years are `reference_date` tokens; on the variation pages the first token comes from the -2026 row (built/livro-razao/oe-2027-saude-despesa-total-consolidada-variacao/index.html:1).
15. PDF p. 145 is «Quadro 4.38. Projetos por agrupamento económico», and its note matches the support word for word (src/data/origens-v2a.json:8).
16. Both sums hold against the rows: 18 125,9 − 17 858,4 = 267,5 and 1 152 − 263 = 889. The hosted article prints «17 mil 858» and «Menos 267,5» (tests/linha/v2ad-dados.mjs:27).
17. The month swap is refused without and with the engine, and the cell refuses eleven months in the build (design/especime-v3/medicoes/v2a-2026-10-12/portoes-d/verify.log:2726, design/especime-v3/medicoes/v2a-2026-10-12/portoes-d/build.log:409).
18. The PIB, «V2AB título» and heading plants bite, and the CFP cover reader handles every month and refuses 31 February (design/especime-v3/medicoes/v2a-2026-10-12/portoes-d/verify.log:2705, design/especime-v3/medicoes/v2a-2026-10-12/d-conferencias/motor.log:26).
19. The final gates read 0/0/0/0 at b9497c1c and 80268af4, the heads are equal at start and end, and both `estado.fim` files are 0 bytes (design/especime-v3/medicoes/v2a-2026-10-12/portoes-d/build.codigo:1).
20. These counts reproduce: 450 images against the receipt, 79 plant messages at their cited lines, 8 sealed bodies, 3 211 untouched lines and 2 780 L1 pages (design/especime-v3/medicoes/v2a-2026-10-12/plantas-d.json:1).
21. The V-2a-c cost matches the mandate (relatorio-construtor.md:385, brief.md:26).

not yet: there are five Blocking copy defects (1–5), and the sem-PRR pages fail the two-minute test (6).
