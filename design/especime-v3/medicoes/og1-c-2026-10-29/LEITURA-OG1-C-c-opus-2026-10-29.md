# Leitura curta (M48) da correção OG1-C-c/d (Claude Opus 5.5, `leitor`, xhigh; 29.10.2026, 10:04 a 10:06 UTC; cerca de 37 chamadas de ferramenta)

*O relatório tal como o leitor o devolveu (em inglês), copiado pelo lugar de direção a 29.10.2026 às 10:08 UTC. O pacote: `_aterragens/pacote-og1cc-2026-10-29`, com cinco plantas só nas cópias (Y1 a Y5). As cinco apanhadas: os achados 1 (Y2), 2 (Y3), 3 (Y1), 4 (Y5) e 5 (Y4). Nenhum Blocking nem Major real; os Minor 6 a 10 vão para a higiene. O leitor assinala que a adenda D não estava no pacote (o Minor 6): a decisão sobre a entrevista está em `ADENDA-D-OG1-C-2026-10-29.md` na pasta das medições.*

Short read (M48) of correction OG1-C-c, 29.10.2026, by Claude Opus 5.5 (`leitor`)

I read only files inside the package, used about 37 tool calls and wrote no file. Every path below is relative to that folder.

**Package completeness.** All 16 OG1 rows have their hosted body in the package. Each body hashes to the row's `document.source_sha256`, each has its request receipt, and there is no `SEM-CORPOS-ALOJADOS.md`.

**One limit on what I could check.** The block partition (`oe2027_analise.html_blocks`) is not in this package. So I took the block indices from the proofs and the test, and checked the block texts directly against the bodies.

## Blocking

**1. The Portuguese row page of `og1-chega-voto` prints, under «Onde a fonte cita», a source block that the source does not contain.** The PT page prints «…na generalidade, anunciou hoje o presidente do partido, argumentando…». The proof, the English page and the hosted RTP body all say «o líder do partido». «presidente do partido» occurs nowhere in `rtp-aominuto-28.html`. This is the very phrase the new §2 rule depends on (Chega's second alias). Both `conferirAncora` («bloco da citação diferente da prova») and the HTML gate's character comparison would refuse this page. So this `dist/` is not one that passed `discussao-d.codigo = 0` and `verify = 0`, as the report claims. The quotation table for item 10 is below, because not every row passes. Every quotation's words are exact in the hosted body and on both row pages, and every quotation appears on both item pages. References: built/livro-razao/og1-chega-voto/index.html:3, built/en/ledger/og1-chega-voto/index.html:3, provas-og1a.json:3831, motor/content/30 Orcamento 2027 Generalidade/source/rtp-aominuto-28.html:12145, tests/discussao/og1.mjs:81, scripts/gate-html.mjs:6870, relatorio-construtor.md:20, relatorio-construtor.md:42

| id | Speaker on the page | Speaker in the sealed passage / source | Source framing / page framing | Words exact | Verdict |
|---|---|---|---|---|---|
| og1-ps-abstencao | Comissão Política Nacional do PS | same, block 58 (frase = quotation block) | party's own page / «na página do partido» + documento note (now right) | yes | pass |
| og1-pcp-comite | Comité Central do PCP | same, block 110 | own communiqué / «no comunicado» + documento note | yes | pass |
| og1-pcp-raimundo | Paulo Raimundo | same, block 109 | own speech / «numa intervenção publicada na página do PCP» + documento note | yes | pass |
| og1-be-voto | José Manuel Pureza | «afirmou José Manuel Pureza», block 37 | reported / «segundo o Diário de Notícias» | yes | pass |
| og1-il-prioridades | Mariana Leitão | lede block 152; quotation is the title, block 150 | interview / «no título de uma entrevista ao ECO» + entrevista note | yes | pass |
| og1-livre-posicao | Isabel Mendes Lopes | block 102 | reported / «segundo o Correio da Manhã» | yes | pass |
| og1-governo-rtp-combustiveis | Joaquim Miranda Sarmento | named in block 82, quotation block 83, printed | reported / «segundo a RTP» | yes | pass |
| og1-governo-rtp-previsoes | Joaquim Miranda Sarmento | «o ministro das Finanças», block 79 | reported / «segundo a RTP» | yes | pass |
| og1-governo-rtp-habitacao | Joaquim Miranda Sarmento | named in block 86, quotation block 88, printed | reported / «segundo a RTP» | yes | pass |
| og1-governo-eco-juros | Joaquim Miranda Sarmento | named in block 152, quotation block 157, printed | reported / «segundo o ECO» | yes | pass (see 7) |
| og1-governo-observador-saldo | Joaquim Miranda Sarmento | block 124 | reported / «segundo o Observador» | yes | pass |
| og1-livre-voto | Jorge Pinto | block 455 | reported / «segundo a RTP» | yes | pass |
| og1-pan-abstencao | Inês Sousa Real | block 259 | reported / «segundo a RTP» | yes | pass |
| og1-jpp-abstencao | Filipe Sousa | block 267 | reported / «segundo a RTP» | yes | pass |
| og1-chega-voto | André Ventura | block 394 «o líder do partido», block 395 names Ventura | reported / «segundo a RTP» | quotation yes | FAIL: the PT page alters the printed source block (this finding) |
| og1-il-voto | Mário Amorim Lopes | «segundo Mário Amorim Lopes», block 205 | reported / «segundo a RTP» | yes | pass |

## Major

**2. The package's copy of the engine rule reads `q>=f-1` where the diff adds `q>=f`, and with the copy the rule lets through the exact misattribution it was written to refuse.** With `f-1`, a quotation starting one block before the frase passes without an alias. The IL plant (quotation in block 204, frase in block 205) gives 204 ≥ 204, so it passes. «Chega: sem o alias no bloco anterior» (394 ≥ 394) also passes. `refuse_attribution` would then raise «Alteração não detetada», so the engine test could not be the green 201 the report claims. A dry-run reverse apply of `motor/diff.patch` fails this hunk. References: motor/publisher/oe2027_generalidade.py:81, motor/diff.patch:261, motor/publisher/oe2027_generalidade_test.py:97, :101, relatorio-construtor.md:18

**3. The two copies of `extracoes.json` disagree on the PS mode.** The content copy still has `"modo": "passagem"` for `og1-ps-abstencao`; the diff, `motor/extracoes.json`, the ledger and the proofs all say `documento`. Under the content copy the row has `passagem` mode with no `passagem` key; `extract()` would refuse it, and the counts 12/3/1 would fail. References: motor/content/30 Orcamento 2027 Generalidade/extracoes.json:1865, motor/extracoes.json:1865, motor/diff.patch:44, motor/publisher/oe2027_generalidade.py:58, motor/publisher/oe2027_generalidade_test.py:118

**4. The built English Método page says «the 2027 Budget items» (plural), and it should say «item».** `metodo.mjs`, the addendum's §1 wording and the inventory row all say «Budget item». The plural reopens the over-promise that Major 6 of the cold read was about. The inventory gate would refuse this sentence. The PT built page matches the addendum exactly. References: built/en/method/index.html:2, src/data/metodo.mjs:279, brief.md:10, design/especime-v3/INVENTARIO-FRASES.md:5153, relatorio-construtor.md:9, :26

**5. The report gives the anchors as 13 passagem, 2 documento and 1 entrevista. The data says 12/3/1, and the numbers script read a different text.** The proofs count 12/3/1, and so do the LEIA-ME table and the test. `numeros-do-relatorio.txt` quotes the report's line 53 as «12 `passagem`, 3 `documento`». References: relatorio-construtor.md:53, numeros-do-relatorio.txt:18, motor/content/30 Orcamento 2027 Generalidade/LEIA-ME.md:23, motor/publisher/oe2027_generalidade_test.py:118, provas-og1a.json:1481

## Minor

**6. The engine exempts `entrevista` from the order rule entirely, against the addendum's §2. The «adenda D» that the report says authorised this is not in the package.** §2 applies the rule in «passagem e entrevista»; §4's printing rule would print a fifth page, `og1-il-prioridades`. The stop report shows the §2 rule refusing that row. The block prompt's «exactly four pages» is consistent with the exemption. The decision itself is not readable here. References: motor/publisher/oe2027_generalidade.py:81, brief.md:16, brief.md:28, RELATORIO-PARAGEM.md:1, relatorio-construtor.md:67, provas-og1a.json:1856

**7. Editor's question on `og1-governo-eco-juros`: the «Onde a fonte cita» block prints «( COFAP )», «( OE2027 )» and «risco de país . Quando», in both editions.** The ECO markup renders «(COFAP)»: the source has `(</span>COFAP<span…>)`. The spaces come from the block normalisation, not from the source. The words are the source's, but an editor would fix the spacing before printing a field presented as the source's text. References: built/livro-razao/og1-governo-eco-juros/index.html:3, built/en/ledger/og1-governo-eco-juros/index.html:3, provas-og1a.json:2289, motor/content/30 Orcamento 2027 Generalidade/source/eco-juros.html:2782

**8. Only 5 of the 14 site-ruler plants now require an exact message.** The six field plants and the three CFP/path plants still accept any first message. §5 says «Cada planta»; Minor 10 concerned only the five anchor plants, so the narrower scope may be intended. References: scripts/afirmacoes-og1.mjs:62, :74, :90, brief.md:37

**9. None of the output folders or `.codigo` files the report cites are in the package, so every gate code is a claim here.** What I could reproduce statically: engine +23 checks (178 → 201), site +51 checks (786 → 837), 14 plants, 57 proofs, 9 `speaker_label`, 112 rows, 14 changed rows. With no folder behind them: the 66 calls, the 26 982 899 tokens, and the OG1-C-9 claim about `ARRANQUE.md`. References: relatorio-construtor.md:13, :38, :69, :73, linhas-dos-portoes.json:1, numeros-do-relatorio.txt:7, :24

**10. The HTML gate's new field check and presence rule have no plant of their own.** The only altered-block plant is in `tests/discussao/og1.mjs`, on combustíveis. References: scripts/gate-html.mjs:2781, :3034, :6714, tests/discussao/og1.mjs:123

## «What is fine»

11. Site copies match the diff: the site diff reverse-applies cleanly to all ten copied files; on the engine side only the two hunks in findings 2 and 3 fail. 12. Método source and stamp: `metodo.mjs` carries exactly the addendum's §1 clause, in place, in both editions, with nothing else in the paragraph changed; the year is a `{ ref: '2027' }` token. 13. Stamp and inventory: sha256(`src/data/metodo.mjs`)[:12] = `78272841cbd7`, the §1.210 stamp; the two inventory rows are rewritten and cite §1.210. 14. Q2 arithmetic: only two of the 16 rows have the quotation block before the frase block: Chega (394 → 395; block 394 contains «o líder do partido», once in the body) and IL prioridades (150 → 152; no alias; passes only by the entrevista exemption); block 204 names no alias of Mário Amorim Lopes, and `aliases[0]` is still «André Ventura». 15. Q2 rule and tests in the diff: the diff's rule is exactly the addendum's §2; the test refuses the IL case with «OG1: a citação começa antes da frase num bloco que não nomeia quem fala» and confirms that Chega passes because of the alias. 16. Q3, the PS row: `documento`, same frase, no `passagem`, `blocos` 58; the rule uses the first occurrence and accepts frase block = quotation block; the strict-after refusal and a new repeated-quotation plant both bite; the PS page prints the documento note in both editions. 17. Q4: exactly combustíveis, habitação, eco-juros and chega print the field, in both editions, right after the mode note, with `lang="pt-PT"` in English; the other twelve print none; every printed block equals the proof except the planted PT Chega page; each block is in the hosted body and contains the quotation. 18. Q5: the engine ledger diff touches only `atribuicao` (13 `bloco_da_citacao` additions, the PS mode, Chega's alias); 112 rows; 14 `origin_row_sha256` changed and all 57 `rh_ledger_sha256` equal the ledger's sha256; the three proof copies byte-identical; no `ledger/claims/*` file and no corrections entry. 19. The five anchor plants each require their own clause's message. 20. Editor's verdict: print the twelve pages without the field, and combustíveis, habitação and English Chega as they stand; eco-juros only after fixing the spacing (7); PT Chega not until the block reads «o líder do partido» (the plant); the Método in Portuguese yes, in English not until «items» becomes «item» (the plant).
