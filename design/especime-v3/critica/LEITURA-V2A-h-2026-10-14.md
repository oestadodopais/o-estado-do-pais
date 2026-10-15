# Leitura curta da passagem de correção V2-a-h (14.10.2026, à noite)

*Lançada pelo lugar de direção às 19:57 UTC sobre o pacote do sítio de `031c12fb` a `5f766970` e do motor de `dd5f1d5f` a `83b63a88` (a passagem V2-a-h do Codex `gpt-6-astra` em `high`, retomada na mesma sessão, pelo mandato `MANDATO-V2A-h-2026-10-14.md`), montado por `scripts/leituras/pacote.sh` com os dezoito corpos alojados. O leitor: o Claude Opus 5.5 (a definição `leitor`, M26), em `xhigh`, 259 361 símbolos, 78 chamadas de ferramentas, onze minutos. As cinco plantas do lugar de direção (`PLANTAS-V2A-h-2026-10-14.json`, três dentro dos hunks do diff, uma numa página construída e uma no relatório) foram as cinco mordidas: os achados 1 a 4 e 7. Os achados 5 e 6 (Major) e 8 a 10 (Minor) são reais e estão decididos no mandato `MANDATO-V2A-i-2026-10-14.md`, com as frases escritas pelo lugar de direção, pela regra 14; o «sobretudo» do achado 5 era do mandato da V2-a-h, escrito sem ler a p. 124. O texto do leitor segue como foi entregue, em inglês.*

## Blocking

1. **The packaged Portuguese Amaro page defines «Consolidada» as spending «depois de somados os pagamentos entre as suas próprias entidades». That is the opposite of the sealed note and of every other page.** The p. 303 note says the table *excludes* flows to and from the programme's own entities. The diff, `frases-h.md`, the nine Health pages and the 1280 px capture all say «retirados». This file's sha256 differs from the one the capture receipt records for it; the other 35 built pages match. The exact-string ruler would refuse it, so this is not the page that went through the gates. built/livro-razao/afirmacao-leitao-amaro-saude-oe2027-2026-10-09/index.html:2, design/especime-v3/capturas/v2a-2026-10-12/h/capturas.json:4694, design/especime-v3/medicoes/v2a-2026-10-12/frases-h.md:19, tests/cartao/v2ah-palavras.mjs:5

## Major

2. **The copied PCP comparison uses `>=`, so a claim equal to 1 152 or 889 passes while the page prints «superior». The diff has `>`.** The three plants use 800 and 1 800 and none tests equality, so a green run cannot tell the two versions apart. tests/linha/v2a.mjs:17, diff.patch:1206603, tests/linha/v2a.mjs:161

3. **The copied `origens-v2a.json` gives the consolidation support's table as «5.73». The diff, the proofs and the p. 303 caption («Quadro 5.37.») say 5.37.** K16 would refuse this copy. src/data/origens-v2a.json:159, diff.patch:1205721, ledger/provas/v2a/provas.json:422, tests/cartao/origens-v2a.mjs:14

4. **The copied engine verifier checks table numbers only on pages 123 and 145; the diff checks 123, 145 and 303.** With this copy, `v2a-saude-consolidada` (given `quadro` 5.37 at :292) falls into the «quadro atribuído a uma passagem» refusal, so the engine build could not pass. The log still reports 44 passing checks. motor/publisher/v2a.py:300, motor/diff.patch:313, motor/publisher/v2a.py:292, design/especime-v3/medicoes/v2a-2026-10-12/h-conferencias/motor.log:40

5. **«Sobretudo das portagens» / «mainly from tolls» is not on p. 124.** The source lists tolls and «outras receitas» (benefit-sharing, fixed payments) without ranking them. It also excludes tolls owned by the private partner, which «portagens cobradas nessas estradas» leaves out. The sentence appears on five pages in both editions; the wording came from the mandate. src/lib/v2a-palavras.mjs:21, design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:14, ledger/provas/v2a/provas.json:386

6. **The pages fail I150: a lay reader would have to look terms up.** «Valores de caixa a preços constantes» on the road and total pages is never put in plain words. «Partilhas de benefícios» and «pagamentos fixos das subconcessionárias» on the PCP, road and total pages are unexplained. «Sem operações financeiras» on the Health, Amaro and RTP pages is unexplained, and its excerpt is collapsed. As editor I would cut «A nota do quadro indica valores de caixa a preços constantes desse ano» from the road pages, because it repeats the sentence before it in jargon. src/lib/v2a-palavras.mjs:21, design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:61, design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:10

## Minor

7. **The report says «136 plantas», but the log's own summary and `LEIA-ME.md` say 135.** At that line, the root copy of the report differs from `LEIA-ME.md`. relatorio-construtor.md:608, design/especime-v3/medicoes/v2a-2026-10-12/LEIA-ME.md:608, design/especime-v3/medicoes/v2a-2026-10-12/h-conferencias/html.log:136

8. **Finding 11(b) is only partly met.** Twelve English Ministry of Finance pages still print «Published by Ministério das Finanças, in Orçamento do Estado para 2027». Two English sentences say «State Budget report for 2027» instead of the `documento_en` title («Budget report for 2027»). built/en/ledger/oe-2027-ppp-rodoviario-receitas-2027/index.html:2, design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:27

9. **The plain words for «efetiva» rest on the note to Table 4.38, which is about «Projetos por agrupamento económico», a different measure.** That note also excludes transfers from the State Budget to autonomous bodies. Table 5.37 itself shows the subtraction. Unlike the other supports, this support line also omits the printed page number. src/data/origens-v2a.json:25, design/especime-v3/medicoes/v2a-2026-10-12/familias.mjs:8

10. **V2A-84 asserts that the correction «foi iniciada depois» the scribe returned, and no file dates that.** The files only record motor.fim at 19:28:02Z and build.inicio at 19:29:26Z. This is the same kind of claim finding 10 asked to remove. relatorio-construtor.md:612, design/especime-v3/medicoes/v2a-2026-10-12/portoes-h-preparacao/motor.fim:1, design/especime-v3/medicoes/v2a-2026-10-12/portoes-h/build.inicio:1

## «What is fine»

11. **The package is complete.** It holds 18 bodies in five files, every sha256 matches its row, each body has its receipt and 27 rights files, and there is no `SEM-CORPOS-ALOJADOS.md`. motor/corpos-alojados.json:1
12. **No value changed.** The ledger changes touch only `definition_sources` and `note`. All 18 values and units match p. 123, p. 303, CFP p. 9 and the hosted HTML in both editions, and 1 700 is greater than both 1 152 and 889. ledger/claims/oe-2027-ppp-rodoviario-receitas-2027.yml:9
13. **The supports are right in the diff.** `quadro` appears only on 4.25 (p. 123), 4.38 (p. 145) and 5.37 (p. 303), and all three captions are confirmed in the PDF. The p. 303 and p. 145 excerpts are verbatim, including «Pograma». Titles carry no page number, the page is a separate mark, the colon label appears in both editions, English support lines print `publicador_en`, and the scenario years come from the period token. ledger/provas/v2a/provas.json:422
14. **The gates and counts reproduce.** All four codes are 0 at `4c789dcf`/`83b63a88`; start and end heads are equal and both state files are empty. L1 stays at 2 780. All 540 PNG hashes and dimensions reproduce: 180 cases, no overflow, 52 heads inspected (36 + 16). `plantas-h.json` holds 213 distinct messages, each found at its cited line. The V2-a-g cost matches the mandate, and V2A-74 is now limited to what the timestamps show. design/especime-v3/medicoes/v2a-2026-10-12/portoes-h/build.codigo:1

not yet: as packaged, the Portuguese Amaro page inverts the consolidation definition and three copied files contradict the diff. The real block also prints an unsourced «sobretudo» and fails I150 on jargon.
