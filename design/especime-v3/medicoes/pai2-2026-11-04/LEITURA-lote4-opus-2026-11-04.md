# A leitura a frio do lote 4 (a PAI2 e a VOZ-1), 04.11.2026

*Claude Opus 5.5 (`leitor`, xhigh), sobre o pacote `pacote-lote4-2026-11-04` (base 7e879ba40, cabeça 0e4185401), entregue às 01:13 UTC. As cinco plantas (Q1 a Q5, registadas por sha256 em `pacote-lote4-2026-11-04.plantas.json`) foram apanhadas. Os achados reais estão nas adendas C da PAI2 e B da VOZ-1.*

Cold read of batch 4 (PAI2 and VOZ-1). Reader: Claude Opus 5.5 (`leitor`). Package: <caminho> (read only, nothing written). I made 52 tool calls, two over the budget of 50. All paths below are relative to the package.

Source completeness: the diff changes no ledger row. None of its 90 files is under `ledger/`, so no hosted document was owed. There is no `motor/` folder and no `SEM-CORPOS-ALOJADOS.md`.

## Blocking

**1. The Portuguese Temas page prints government debt 2025 as 88,2 % do PIB. Every other rendering of the same claim prints 89,2.**
- `built/temas/index.html` has `data-claim="divida-publica-2025" class="claim-value">88,2`.
- `built/en/themes/index.html`, `built/index.html` and `built/en/index.html` all have 89,2. That is two occurrences on each front page.
- So in Portuguese the value and the ledger row disagree, and the two editions disagree.
- `check:quadro` Q2 ("valor difere do livro") would refuse this, yet `CONFERIR-TUDO.md` reports it at 0. Either the built page in the package is not the page the run saw, or the run is wrong.

References: built/temas/index.html:6, built/en/themes/index.html:1, built/index.html:8, scripts/check-quadro.mjs:121, CONFERIR-TUDO.md:4

## Major

**2. The marker «[a verificar]» is still on the Portuguese agenda. The English edition says something else there.**
- The calendar event `ce-relatorio-conjunto-emprego-2027` prints «[a verificar] a fonte não publica data».
- The view hard-codes «sem data anunciada» for every undated event, and the English page prints «no announced date».
- The gate also expects «sem data anunciada» for `evento:*.marcador`.
- This contradicts the report's «Páginas com marcador: 34 → 0» and brief §1.6.

References: built/agenda/index.html:2, src/views/AgendaView.astro:509, scripts/gate-html.mjs:2087, RELATORIO-VOZ-1.md:4, brief-VOZ-1.md:36

**3. The Portuguese 2027 explainer still prints the exact sentence the block exists to remove: «…que só dá o nome a essa subfunção, e esta explicação não diz o que entra nela.»**
- The data file and the brief both say «…sem dizer o que entra nela.»
- The English page correctly prints «without saying what it includes».
- So the built Portuguese page matches neither its source nor the other edition. It is also exactly the kind of sentence the `CLASSE` regex is meant to fail.

References: built/explicacoes/dinheiro-do-estado-2027/index.html:4, built/en/explainers/dinheiro-do-estado-2027/index.html:4, src/data/explicacoes/dinheiro-do-estado-2027.mjs:191, brief-VOZ-1.md:26, scripts/voz-autorreferencia.mjs:14

**4. In Portuguese, the «Antes» cell of `ganho-medio-mensal-2024` shows a lone dash «—» instead of «sem anterior».**
- The cell carries `data-quadro-sem-anterior` but its text is «—».
- The English cell reads «no previous», and `QUADRO.pt.semAnterior` is 'sem anterior'.
- Addendum A forbids it explicitly: «Nenhum algarismo, nenhum traço sozinho.»
- The report says both cells show «sem anterior» / «no previous».

References: built/temas/index.html:6, src/data/quadro-do-pais.mjs:3, ADENDA-A-PAI2.md:12, RELATORIO-pai2-a.md:16, scripts/check-quadro.mjs:109-111

**5. The revision notice says «este número» and «o valor acima», but often stands under a different number, or under several.**
- **Front page, housing block:** the notice for the EU housing overburden (7,7 → 7,6) comes after the rent-reference sentence (2,56 %) and the source caption. The 7,7 in «Os números deste bloco» is below the notice, not above it.
- **Front page, study list:** the notice follows the summary of «A casa em Portugal e na Europa», which has four numbers (6,3 %, 7,7 %, 27,2 %, 28,8 anos).
- **Door cards:** each card puts the notices for its own value, its previous value and its EU value into one block. So the exports-2025 card carries two notices («…para 8,0…» and «…para 17,0…»). Both say «este número», and neither says which figure it means. The door pages are not in the package; this is read from the code.
- A reader cannot tell which figure was revised.

References: built/index.html:8, built/en/index.html:1, src/components/CartaoDaMedida.astro:361, src/components/AvisoDaRevisao.astro:9, brief-PAI2.md:35

**6. The units in the Antes and União Europeia columns describe a different population, or a different unit, from the measure in the same row.**
- Employment gap: Portugal «5,4 pontos percentuais», then «5,7 % da população» (2024) and «9,6 % da população» (EU).
- Employment rate: «% das pessoas dos 20 aos 64 anos», then «% da população».
- Young people not in employment, education or training: «% das pessoas dos 15 aos 29 anos», then «% da população».
- The table takes the raw ledger unit for every column except the main one, and the ruler checks only against that same ledger unit.
- A reader takes the EU employment gap to be 9,6 % of the whole population.

References: built/temas/index.html:6, built/en/themes/index.html:1, src/components/ValorDoQuadro.astro:16, scripts/check-quadro.mjs:125

**7. The column header «Referência da Comissão» / «Commission reference» sits over two cells that name other bodies' references.**
- Government balance: «dentro do limite do Pacto de Estabilidade (acima de −3 %)».
- Net expenditure growth: «fora da trajetória da despesa aprovada pelo Conselho da UE (acima de 5 %)».
- The header assigns a Treaty limit and a Council path to the Commission.
- The wording of the header comes from the mandate.

References: built/temas/index.html:6, src/data/quadro-do-pais.mjs:3-4, brief-PAI2.md:34

**8. A fact about sources was lost from the calendar: eight sources publish no release date, which is different from ERSAR not having been read.**
- Before, the page showed «Sem data, porque a fonte não publica nenhuma» and the reason per event, `nao_publica` or `nao_lida`. The old code comment said that saying ERSAR «não publica data» would claim more than is known.
- Now all ten undated events read «sem data anunciada». The reason survives only in `calendario.json` (`motivo_sem_data`) and in an attribute.
- Brief §0 keeps «o que uma fonte não publica … dito como facto da fonte», and §4 says to stop if a page can only comply by losing a fact about a source. §2.1 of the same brief mandated the new wording, so the mandate contradicts itself.

References: src/i18n/strings.mjs:581, src/views/AgendaView.astro:508-509, src/data/calendario.json:1, brief-VOZ-1.md:15, brief-VOZ-1.md:43, brief-VOZ-1.md:59

**9. The calendar lists six releases dated 22.09 to 30.10.2026 under «O que as fontes citadas publicam a seguir». The page was built on 04.11.2026, and nothing says these dates are past.**
- With the reading state no longer printed (brief §2.1), a reader is told that past releases are upcoming.

References: built/agenda/index.html:2, src/views/AgendaView.astro:447-450

**10. The calendar shows ledger slugs, not «as páginas do sítio que atualiza», and the corrections register still prints raw identifiers.**
- Calendar: «Linhas a que isto diz respeito taxa-de-desemprego-2025 · taxa-de-emprego-2025», and so on. Brief §2.1 asks for the site pages each event updates.
- Corrections: the «Revisões de proveniência» list prints 37 raw claim ids in each edition, such as «credito-malparado-2024 fonte». This is the same class as the «Afirmação: …» identifier the brief removed.

References: built/agenda/index.html:2, src/i18n/strings.mjs:599, src/views/AgendaView.astro:483-492, built/correcoes/index.html:3, src/components/RegistoCorrecoes.astro:350, brief-VOZ-1.md:43

**11. The build guard is narrower than brief §3.2. Sentences of this class still reach reader pages that are in scope.**
- **Routes:** `medirPagina` exempts `livro` and `serie` as well as Método, Sobre, the receipts and Privacy.
- **Study page:** on the `estudo` route it strips the study's own reading text and summary (`.texto-artigo.estudo-leitura`, `.texto-sumario`, `.estudo-sumario`). The named exemption `ISENCAO_VOZ2` covers only «documentos dos estudos» and «estudo: unidades e índice».
- **Regex:** `CLASSE` misses live sentences on pages in scope:
  - «Nada é enviado deste sítio» and «Uma atualização não é um erro» on Correções;
  - «A recontagem não é uma correção adicional» in the register;
  - the agenda item «Évora, o primeiro tipo de página de município».
- **Measurement:** the ruler counted 31 sentences before the change. The director's §0 counted 387 occurrences, 304 of them in study documents, which leaves 83 outside the studies. So the guard measures a much smaller class than the mandate.

References: scripts/voz-autorreferencia.mjs:11, scripts/voz-autorreferencia.mjs:14, scripts/voz-autorreferencia.mjs:39, scripts/voz-autorreferencia.mjs:46, src/i18n/strings.mjs:2052, built/correcoes/index.html:3, built/agenda/index.html:2, brief-VOZ-1.md:9, brief-VOZ-1.md:51

**12. The new 2026 sentence means different things in the two editions.**
- Portuguese: «O orçamento é uma previsão: … e a execução até agosto está acima.» In a sentence about forecast against spending, this reads most naturally as «the execution to August is higher than the budget».
- English: «…is shown above», which is about where it sits on the page.
- The Portuguese is the mandate's wording. As printed, it can be read as a claim about spending that no number on the page supports.

References: src/data/explicacoes/dinheiro-do-estado-2026.mjs:592, built/explicacoes/dinheiro-do-estado-2026/index.html:1, built/en/explainers/dinheiro-do-estado-2026/index.html:1, brief-VOZ-1.md:29

## Minor

**13. The package copy of `VOZ-MARCADORES.md` differs from the diff.**
- The diff adds `| raiz | esta explicação não |` before «esta explicação mostra»; the copy has only «esta explicação mostra» at that position.
- I ran `voz-do-mandato.py` on «Esta explicação não diz…» and it still exits 1, through the `raiz` «a explicação não». The guard still bites, but the package does not show the head's table.

References: design/especime-v3/VOZ-MARCADORES.md:128, diff.patch:229, scripts/leituras/voz-do-mandato.py:24-25

**14. The English notice writes the revised value with a decimal point («7.6», «8.0», «17.0») right beside values the English edition prints with a comma («7,7», «8,2», «17,1»).**
- This follows brief §3.2, but within one cell it reads as two number styles.

References: src/components/AvisoDaRevisao.astro:9, built/en/themes/index.html:1, brief-PAI2.md:35

**15. Several report figures have no evidence in the package.**
- «54 avisos em 30 páginas»: the package has 10 notices on 4 built pages, and the door pages are absent.
- «as duas [plantas] da N1C»: `tests/inicio/blocos-unicos.mjs` is not in the package.
- «40,7 px», «70 combinações» and «474 percursos»: no evidence in the package.
- `numeros-do-relatorio.txt` confirms 10 numbers with no file behind them, and its checker exited 1.

References: RELATORIO-pai2-a.md:18, RELATORIO-pai2-a.md:35, RELATORIO-pai2-b.md:4-7, numeros-do-relatorio.txt:6, numeros-do-relatorio.txt:19

**16. The weekly line still narrates the site's own process, and reads as a contradiction to a lay reader.**
- «91 números foram relidos na fonte, e nenhum mudou de valor nem de proveniência; a fonte reviu 3 deles…»
- «Nenhum mudou» next to «a fonte reviu 3» is confusing, and the line does not say which three.

References: built/index.html:8, src/i18n/strings.mjs:1847

**17. Sentences about the site's own receipts remain in both explainers.**
- 2026: «O detalhe … está no recibo de cada um, a um toque.»
- 2027: «…o recibo de cada linha mostra a conta.»
- The latent 2026 conditional « Estes números não isolam o custo dos juros da dívida.» is a negation about the page's own figures, and `CLASSE` would not catch it if the condition turned on.

References: src/data/explicacoes/dinheiro-do-estado-2026.mjs:593, src/data/explicacoes/dinheiro-do-estado-2027.mjs:191, scripts/voz-autorreferencia.mjs:14

**18. A correction dated the same day as the diverging re-reading does not clear the notice (`k.date > v.date`).**
- The view and the ruler share this rule, so the ruler cannot catch it.

References: src/lib/revisao-da-fonte.mjs:9, scripts/check-quadro.mjs:38

**19. The substitution in the study documents only swaps the marker's words.**
- `apresentarAusencias` replaces «[a verificar]» with «por confirmar na fonte» in place, whatever the marker qualified. The gate reverses the substitution before it checks.
- Where the marker qualified a published sentence rather than an empty field, that sentence stays on the page.
- No study document is in the package, so I could not see a real case.

References: src/lib/ausencias-voz1.mjs:14, scripts/gate-html.mjs:2087, tests/voz/voz1.mjs:20

**20. The closed list of ledes locks in a project-internal reference.**
- «/areas: … um domínio é um assunto da carta dos conteúdos.»

References: scripts/voz-ledes.json:3

**21. The agenda is a page about the project's own work, and it is stale.**
- Three of its five items read «Pergunta por registar» / «Question not recorded», and all five were last changed on 16 or 18.08.2026.
- One item title is a page type, «Évora, o primeiro tipo de página de município».

References: built/agenda/index.html:2, built/en/agenda/index.html:1

## «What is fine»

- **Table rows:** the table has 47 rows per edition, in door order and in the order of the cards: 6, 7, 4, 7, 6, 4 and 13. The claim ids are identical across the editions. Every row links to `<porta>#m-<id>`, which is the card anchor. Ref: built/temas/index.html:6, src/components/CartaoDaMedida.astro:287.
- **Anteriors and EU values:** 45 rows have an anterior, 27 have an EU value, and only the two rows Addendum A names lack an anterior (counted from the built page). Ref: built/en/themes/index.html:1, ADENDA-A-PAI2.md:9.
- **Notices:** notices appear exactly on the three pending ids and nowhere else in the built pages. The values (8,0; 17,0; 7,6) and the date 02.11.2026 match brief §0.4, and the sentence text matches §3.2 in both editions. Ref: brief-PAI2.md:18, built/temas/index.html:6.
- **Card:** the card accepts one revision block holding one notice per revised row, and refuses a second block, a duplicate notice, another block, or a block on a card without a divergence. Ref: tests/cartao/revisao.mjs:15-18, tests/cartao/revisao.mjs:29-42.
- **`check:quadro`:** it compares each cell's value, period, unit and seal against the ledger and the card. Its plants cover a missing measure, a swapped value, a wrong «sem anterior», the notice in both directions, and a controlling pass. Ref: scripts/check-quadro.mjs:104-131, tests/quadro/plantas.mjs:13-31.
- **Retired page:** `/a-verificar/` and `/en/to-verify/` redirect with 308 to the Method page in each edition, and both page files are deleted. Ref: vercel.json:13-26, diff.patch:5562.
- **Marker ruler:** the dashed seal, `noindex` on incomplete receipts, and the sitemap exclusion are all still enforced, each with a plant. Ref: scripts/voz-autorreferencia.mjs:21-29, scripts/voz-autorreferencia.mjs:59-66, tests/voz/voz1.mjs:27-35.
- **Explainers:** the section title is «Como ler estes números» / «How to read these figures», and the old title appears 0 times. The 2026 «Esta página mostra as duas medidas…» sentence is gone in both editions. The English 2027 sentences match brief §1.2. Ref: src/i18n/strings.mjs:1824, src/i18n/strings.mjs:3859, diff.patch:5144.
- **Weekly line:** its tokens match brief §1.5 in both editions. Ref: src/i18n/strings.mjs:1847-1849, src/i18n/strings.mjs:3882-3884.
- **Corrections register:** «Afirmação:» occurs 0 times as a label, and each claim entry keeps its receipt door. Ref: src/components/RegistoCorrecoes.astro:264.
- **Engine copies:** `agenda.json` and `calendario.json` are not in the diff, and their sha256 values match the builder's record. Equality with the engine's own files cannot be checked from the package. Ref: design/especime-v3/medicoes/voz1-2026-11-03/dados-conservados.json:4, design/especime-v3/medicoes/voz1-2026-11-03/dados-conservados.json:8.
- **Before and after:** the counts 34 → 0, 31 → 0 and 30 → 28, and 9825 → 9823 pages, reproduce from the builder's own measurement files, and the list of ledes has 28 entries. Ref: ADENDA-A-VOZ1.md:5, scripts/voz-ledes.json:2-29.
- **Study exemption:** it is named and dated (2026-11-03, retired by VOZ-2). Ref: scripts/voz-autorreferencia.mjs:11.
- **Mandate check:** it refuses «Esta explicação não diz…» (I ran it; exit 1). Ref: scripts/leituras/voz-do-mandato.py:34.
- **Cold-read prompt:** it gained the fixed voice question. Ref: PROMPT-COMUM.md:23.
- **Rulers (question 7):** in the code I read, no ruler protecting a number, a source or a person was weakened. The agenda's criteria and history checks left together with the fields they checked, and the exemptions for the table only apply after `conferirQuadro` passes. Ref: scripts/check-lugar.mjs:3851, scripts/check-quadro.mjs:160-166.
- **Quotations:** the changed pages carry no new quotation. The quoted fragments already in the corrections register (for example «pelo menos») were not changed by this diff, and no sealed passage is in the package to check them against. Ref: built/correcoes/index.html:3.

**Editor's question:** I would not print these pages as they stand.
- The Portuguese Temas page has a wrong debt figure and a bare dash.
- The 2027 explainer and the agenda still carry the very sentence and the very marker this batch removes.
- The table's units and «Referência da Comissão» header mislabel several rows, and on the front page the notice points at the wrong number.
- The calendar presents past releases as upcoming and lists ledger slugs where the pages it updates should be.
- The corrections page and the agenda still talk about the site itself.
