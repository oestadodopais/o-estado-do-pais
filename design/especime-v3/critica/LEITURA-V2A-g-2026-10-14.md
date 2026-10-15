# Leitura curta da passagem de correção V2-a-g (14.10.2026, à noite)

*Lançada pelo lugar de direção às 18:40 UTC sobre o pacote do sítio de `7fbcc884` a `6fb4785f` e do motor de `c239badf` a `dd5f1d5f` (a passagem V2-a-g do Codex `gpt-6-astra` em `high`, retomada na mesma sessão, pelo mandato `MANDATO-V2A-g-2026-10-14.md`), montado por `scripts/leituras/pacote.sh` com os dezoito corpos alojados. O leitor: o Claude Opus 5.5 (a definição `leitor`, M26), em `xhigh`, 240 234 símbolos, 70 chamadas de ferramentas, onze minutos. As cinco plantas do lugar de direção (`PLANTAS-V2A-g-2026-10-14.json`, três dentro dos hunks do diff, uma numa página construída e uma no relatório) foram as cinco mordidas: os achados 1 a 4 e 7. Os achados 5 e 6 (Major) e 8 a 11 (Minor) são reais e estão decididos no mandato `MANDATO-V2A-h-2026-10-14.md`; o 5 nasce de um erro do mandato da V2-a-g, que mandou pôr o número do quadro também no apoio da p. 124. O texto do leitor segue como foi entregue, em inglês.*

## Blocking

1. **The packaged Portuguese PCP page says the claim is «inferior» to both of the table's figures, which is false.** On p. 123 the 2027 figures are 1 152 (gross) and 889 (net), and the claim is 1 700. The data, `frases-g.md`, `inspecao-g.json` and the 1280 px capture of the same head all say «superior». So this HTML copy differs from what was built and captured. The ruler as copied would refuse it. built/livro-razao/afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09/index.html:2, src/data/o-que-e-das-familias.mjs:3828, design/especime-v3/medicoes/v2a-2026-10-12/frases-g.md:9, design/especime-v3/medicoes/v2a-2026-10-12/inspecao-g.json:115, tests/linha/v2a.mjs:125

## Major

2. **The copied `origens-v2a.json` gives the sectors support «(printed 117)», but the diff adds «(printed 107)».** The printed page number on p. 123 is 107. The proofs say 107, and the built English page prints 107. K16 would refuse this copy. src/data/origens-v2a.json:88, diff.patch:1227711, ledger/provas/v2a/provas.json:407, tests/cartao/origens-v2a.mjs:14

3. **In the copied ruler, the table-number check no longer requires the «quadro »/«Table » prefix.** The mark sits inside the sentence, so `frase.includes("4.25")` is always true and that clause checks nothing. The 4.26 plant bites on both versions, so it cannot tell them apart. tests/linha/v2a.mjs:107, diff.patch:1228099, tests/linha/v2a.mjs:148

4. **The copied engine code checks the table number only on page 123; the diff checks pages 123 and 124.** With this copy, `v2a-ppp-conta` (p. 124, `quadro` set at :288) falls into the «quadro atribuído a uma passagem» refusal. The engine proof could not pass, yet the log says 40 checks passed. motor/publisher/v2a.py:296, motor/diff.patch:153, design/especime-v3/medicoes/v2a-2026-10-12/g-conferencias/motor.log:50

5. **The PCP sentence places Table 4.25 at «p. 124 do PDF (108 impressa)» / «PDF p. 124 (printed 108)», in both editions.** The table and its caption are on p. 123 (printed 107), as the rows' own locators say. P. 124 is running text that refers to «o quadro anterior». The `quadro` field went on a running-text passage, which contradicts the report's «as passagens corridas não recebem número de quadro». src/data/origens-v2a.json:63, src/data/origens-v2a.json:81, motor/publisher/v2a.py:288, built/livro-razao.json:103412, relatorio-construtor.md:538

6. **On the Amaro page, a reader cannot tell what «despesa efetiva consolidada» means (I150).** The page carries no total/effective definition. On the health pages, «consolidada» is never put in plain words, and «efetiva» is explained only as «exclui operações com ativos e passivos financeiros». built/livro-razao/afirmacao-leitao-amaro-saude-oe2027-2026-10-09/index.html:2, src/data/o-que-e-das-familias.mjs:3716

## Minor

7. **The report contradicts itself on the HTML plant count.** Line 553 says 141. Line 577, `verify.log:2851` and `LEIA-ME.md:553` say 114. relatorio-construtor.md:553, design/especime-v3/medicoes/v2a-2026-10-12/portoes-g/verify.log:2851, design/especime-v3/medicoes/v2a-2026-10-12/LEIA-ME.md:553

8. **«O que recebe delas» is looser than p. 124.** There, road revenue is mainly tolls charged on the partnership roads, plus benefit-sharing and fixed payments by subconcessionaires. A reader may take the 263 million as paid back by the companies. src/lib/v2a-palavras.mjs:20, src/data/o-que-e-das-familias.mjs:4025

9. **Two rulers check less than they appear to.** The «superior» comparison is matched as a literal string, never computed from 1 700, 1 152 and 889. No page ruler checks that English pages print `publicador_en`; only the data-equality check in K16 covers it. tests/linha/v2a.mjs:125, tests/cartao/origens-v2a.mjs:14

10. **V2A-74's claim that the L10 fix was written only after the first run ended is unproven.** The first run ended at 18:11:23Z and the final build started at 18:12:15Z. That leaves 52 s to edit two files, add four plants and commit. relatorio-construtor.md:559, design/especime-v3/medicoes/v2a-2026-10-12/portoes-g-preparacao/motor.fim:1, design/especime-v3/medicoes/v2a-2026-10-12/portoes-g/build.inicio:1

11. **As an editor I would rewrite four things.**
   - The PCP and Amaro sentences put a PDF page number inside a quoted title: «No relatório «Orçamento do Estado para 2027, p. 124 do PDF…»» and «The report «Budget report for 2027…»». The English one also puts the project's own translation in quotation marks as if it were the document's title.
   - The same English page also names the document «Orçamento do Estado para 2027» by «Ministério das Finanças».
   - «Passagem de Ministério» should read «do Ministério».
   - The scenario pages spell years out («dois mil e vinte e seis»), and the ruler enforces it. That is the same problem as finding 8 of the previous read (the table number spelled out in words).

   src/data/o-que-e-das-familias.mjs:3802, src/data/o-que-e-das-familias.mjs:3708, src/i18n/strings.mjs:319, tests/linha/v2a.mjs:33

## «What is fine»

12. The package is complete. It holds 18 bodies (five distinct files), each matching its row's `source_sha256`, each with its receipt and 27 rights files, and there is no `SEM-CORPOS-ALOJADOS.md` (motor/corpos-alojados.json:1).
13. Rows and source: no value, unit or excerpt changed; the PCP row only gained `definition_sources` (V2A-71); the PCP quote and attribution are in the hosted page; p. 123 prints 1 152, 263, 889 and 1 438, and its notes 1 to 3 support «caixa» and «preços constantes de 2027»; p. 128 supports «hospitais» (ledger/claims/afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09.yml:37).
14. Support fields: the table-number mark equals the `quadro` field and the caption «Quadro 4.25.»; the document marks equal `documento`/`documento_en`; all 23 English support lines are in English with `lang="en"`; the Amaro English sentence says «RRP; PRR in Portuguese»; the `quadro` value 4.38 on `v2a-total-efetiva` matches the p. 145 caption (src/data/origens-v2a.json:9).
15. Gates: all four codes are 0 at `fe7e6fdb`/`dd5f1d5f`, with the same heads at start and end and empty `estado.fim`; the `dist` version equals the capture head; the V2AG and L10 plants bite in both editions (design/especime-v3/medicoes/v2a-2026-10-12/portoes-g/verify.log:2739).
16. Captures and counts: all 480 PNG hashes and dimensions reproduce, 160 cases, 16 pages, 44 inspected captures (32 + 12); `plantas-g.json` holds 194 messages (157 + 35 + 2), each at its cited line, and `plantas-f.json` holds 165; the V2-a-f cost matches the mandate, and the V2-a-e cost appears once; the L1 comparison is identical (design/especime-v3/capturas/v2a-2026-10-12/g/capturas.json:1).

not yet: as packaged, the PT PCP page inverts the comparison and three copied files contradict the diff; separately, the real PCP sentence puts Table 4.25 on the wrong page, and the Amaro page fails I150.
