# Leitura curta das passagens V2-a-i e V2-a-j (14.10.2026, à noite)

*Lançada pelo lugar de direção às 21:41 UTC sobre o pacote do sítio de `d31d1c59` a `0ffbbccb` e do motor de `83b63a88` a `9e370c6d` (as passagens V2-a-i e V2-a-j do Codex `gpt-6-astra` em `high`, pelos mandatos `MANDATO-V2A-i-2026-10-14.md` e `MANDATO-V2A-j-2026-10-14.md`, as primeiras com as frases escritas pelo lugar de direção, pela regra 14), montado por `scripts/leituras/pacote.sh` com os dezoito corpos alojados. O leitor: o Claude Opus 5.5 (a definição `leitor`, M26), em `xhigh`, 279 653 símbolos, 84 chamadas de ferramentas, treze minutos. As cinco plantas do lugar de direção (`PLANTAS-V2A-j-2026-10-14.json`, três dentro dos hunks do diff, uma numa página construída e uma no relatório) foram as cinco mordidas: os achados 1 a 4 e 6. O achado 5 (Major, «subconcessionárias» por explicar) e os 7 a 10 (Minor, de redação) são reais, todos nas frases do lugar de direção, e estão emendados no mandato `MANDATO-V2A-k-2026-10-14.md`. O texto do leitor segue como foi entregue, em inglês.*

## Blocking

1. **The packaged Portuguese total page says the 1 438 million is what the State pays «antes de descontar o que recebe delas». That is the opposite of the net «Total» row and of the mandate's «depois».** The English page, `inspecao-j.json`, `frases-i.md`, the expected text and the i-pass 1280 px capture all say «depois»/«after». This file's sha256 (4c2be6dc…) differs from the one the i capture receipt records. Every other built page matches its latest receipt. The exact-text ruler would refuse this page, so it is not the one that went through the gates. built/livro-razao/oe-2027-ppp-total-encargos-liquidos-2027/index.html:2, design/especime-v3/capturas/v2a-2026-10-12/i/capturas.json:4198, design/especime-v3/medicoes/v2a-2026-10-12/inspecao-j.json:206, tests/cartao/v2ai-frases.json:7, tests/cartao/v2ah-palavras.mjs:19

## Major

2. **The copied «preços» check tests `frase.includes('em'/'in')`, which every sentence passes. The diff tests «em euros de»/«in 2027 euros».** With the copy, the plant at :182 cannot bite. The verify log shows it biting in both editions, so the diff version ran. tests/linha/v2a.mjs:139, diff.patch:3597706, tests/linha/v2a.mjs:182, design/especime-v3/medicoes/v2a-2026-10-12/portoes-j/verify.log:2754

3. **The copied engine verifier checks the table caption only on p. 123; the diff checks 123 and 303.** With the copy, `v2a-saude-consolidada` (quadro 5.37) falls into the «quadro atribuído a uma passagem» refusal, so the engine could not pass. The motor log says PASS. motor/publisher/v2a.py:292, motor/diff.patch:516, motor/publisher/v2a.py:284, design/especime-v3/medicoes/v2a-2026-10-12/i-conferencias/motor.log:97

4. **The copied `origens-v2a.json` prints the consolidation support as «p. 303 do PDF (278 impressa)».** The diff, the proofs, the PDF footer («287»), its own English field one line below and all 22 Health, Amaro and RTP page-editions say 287. The K16 check would refuse this copy. src/data/origens-v2a.json:103, diff.patch:3596835, ledger/provas/v2a/provas.json:398, tests/cartao/origens-v2a.mjs:17

5. **I150: «subconcessionárias»/«subconcessionaires» is still a word a lay reader must look up.** It sits in the sentence that gives the 889 million, on the PCP, three road and total pages in both editions. The other terms flagged last time are now in plain words. src/lib/v2a-palavras.mjs:19, tests/cartao/v2ai-frases.json:11, design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:92

## Minor

6. **The root report says the i preparation ran «193 plantas»; the log and `LEIA-ME.md` say 192.** relatorio-construtor.md:659, design/especime-v3/medicoes/v2a-2026-10-12/LEIA-ME.md:659, design/especime-v3/medicoes/v2a-2026-10-12/i-conferencias/html.log:193

7. **The road and PCP sentences say «a cargo do Estado» and «ao Estado» where p. 124 says «parceiro público».** They also render the report's «principais componentes … designadamente» as a closed list. tests/cartao/v2ai-frases.json:3, ledger/provas/v2a/provas.json:386

8. **«A despesa total é a efetiva mais os ativos e os passivos financeiros, como o quadro mostra» holds exactly for 2026 but is 0,1 off for 2027.** 17 803,1 + 3,5 + 51,7 = 17 858,3, against the printed 17 858,4. The gloss «os empréstimos que o programa concede ou paga e as participações que compra» is not on p. 303; the nearest text is the general accounting passage on PDF p. 60. tests/cartao/v2ai-frases.json:15, ledger/claims/oe-2027-saude-despesa-total-consolidada-2027.yml:9, ledger/claims/oe-2027-saude-despesa-efetiva-consolidada-2027.yml:9

9. **The Portuguese «(p. 123)» and «na p. 124» are PDF page numbers, but nothing says so.** The English says «PDF p.», and the printed pages are 107 and 108. tests/cartao/v2ai-frases.json:11, tests/cartao/v2ai-frases.json:3

10. **On the Amaro and RTP pages, «o quadro» and «a nota do quadro» point to a table the page never introduces.** built/livro-razao/afirmacao-leitao-amaro-saude-oe2027-2026-10-09/index.html:2, built/livro-razao/afirmacao-rtp-saude-queda-oe2027-2026-10-09/index.html:2, design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:8

## «What is fine»

11. **The package is complete.** It holds 18 rows over five bodies, every sha256 matches its row, each body has its receipt and the `direitos/` files, and there is no `SEM-CORPOS-ALOJADOS.md`. motor/CORPOS-ALOJADOS.md:7
12. **No value changed.** All 18 values and units agree across the export, the engine ledger and the yml. They match p. 123, p. 303, CFP p. 9 and the hosted HTML. The ledger diffs touch only `locator`, `note` and `definition_sources`. ledger/claims/oe-2027-saude-despesa-efetiva-consolidada-2026.yml:9
13. **The sentences match the mandates.** The expected-text file equals the i-mandate as amended by j, word for word. Apart from finding 1, the built text matches exactly once in all 32 page-editions, with units and «» in place. The road arithmetic holds: 1 152 − 263 = 889. tests/cartao/v2ai-frases.json:1
14. **The supports are right.** `v2a-total-efetiva` is gone from the pages, the proofs and the locators. `quadro` appears only on 4.25 and 5.37. All 13 English Ministry pages print the mandated publisher line, and «State Budget report» appears nowhere. ledger/provas/v2a/provas.json:398
15. **The rulers and gates reproduce.** The log shows 32 word-swap plants, 13 publisher plants and 3 + 2 PCP plants. `plantas-i.json` has 247 distinct messages, all at their cited lines. All eight gate codes are 0 at `68430e31` and `e7ddb83e`, with matching heads, empty state files and L1 at 2 780. Image hashes and dimensions reproduce: 480 images (160 cases) and 120 images (40 cases). design/especime-v3/medicoes/v2a-2026-10-12/portoes-j/build.codigo:1
16. **The report's other claims reproduce.** Both costs match their mandates. V2A-84 and V2A-90 state only the timestamps, 84 s apart; V2A-80's 52 s matches the G-pass files. relatorio-construtor.md:612

**As editor:** I would write «Consolidada» in angle quotes, explain «subconcessionárias» in four words, and cut «Valores de caixa … preços constantes de 2027» from the note under the number, since the paragraph above already says it plainly.

not yet: as packaged, the Portuguese total page turns net into gross, three copied files contradict the diff, and the real pages still leave «subconcessionárias» unexplained.
