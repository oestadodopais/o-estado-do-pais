# Cold read of OG1-E (Claude Opus 5.5, `leitor`), 02.11.2026

I read only inside the package and wrote no files. I used 49 of the 50 tool calls. Reproduced from the package:
- **Hosted documents:** all 92 changed rows are listed in `motor/corpos-alojados.json`. Every listed document is present, matches its `source_sha256`, and has its `.pedido.json` beside it. There is no `SEM-CORPOS-ALOJADOS.md`.
- **Diffs against copies (git blob hashes):** 124 of 125 site files match the diff's head blobs. All 44 of 44 engine files match.
- **Four copies disagree with the rest of the package:** the site report's plant count, one ledger row, the diff's marker list, and the two built Budget study pages. They are findings 1, 2, 3 and 5.

## Blocking

**1. The built Portuguese Budget study still puts the Prime Minister before a third party's account, with no document: «O primeiro-ministro: «Entre as medidas dirigidas às famílias, salientou …»».**
- Every other copy carries the mandate's §3.1 sentence («O primeiro-ministro, pela comunicação do Governo «Orçamento do Estado reforça valorização dos rendimentos e apoios às famílias e empresas»: «…»»): the study source, the record and the Portuguese dossier page.
- `CONFERIR-TUDO.md` reports `check:forma-citacao` 0 and `gate:html` 0 on the head these pages came from. The ruler would refuse this sentence: there is no document, headline or «, segundo» in it.
- So either the built copy is not what the gate read, or the gate did not read this page. Either way, the page a reader gets prints the exact defect the block exists to remove.
- References: built/estudos/orcamento-2027-o-que-muda-e-para-quem/index.html:4, studies-src/orcamento-2027-o-que-muda-e-para-quem/pt.html:83, registos/orcamento-2027-o-que-muda-e-para-quem/pt.record.json:5464, built/dossies/orcamento-2027/index.html:6, brief.md:30, CONFERIR-TUDO.md:5, CONFERIR-TUDO.md:12

**2. The built English Budget study drops the PS document from the `posicao-ps-pensoes` sentence and prints «… by José Luís Carneiro, on 14 October, : «Na área das pensões, o líder do PS defendeu …»».**
- The English study source, the English record and the English dossier page all carry «… on 14 October, in the party's web page «OE2027: PS leva propostas à especialidade para responder ao custo de vida»: «…»».
- The built study has a stray «, :» and no document. That is a `relato` quotation with the party as speaker, which the gate reported green on.
- References: built/en/studies/orcamento-2027-o-que-muda-e-para-quem/index.html:4, studies-src/orcamento-2027-o-que-muda-e-para-quem/en.html:83, registos/orcamento-2027-o-que-muda-e-para-quem/en.record.json:5508, built/en/dossiers/orcamento-2027/index.html:6, brief.md:34

## Major

**3. The copied ledger row `posicao-ps-irc` declares `forma_da_citacao: "palavras"`, but the diff adds `"relato"`. The copy is not the head's file.**
- The copy's git blob is 0f951cd7a. The diff's head blob is 1530742e1.
- With this copy the package counts 78 `palavras` and 14 `relato`, against 77 and 15 in the brief §0.2, `antes.json` and `motor/core/formas-das-citacoes.json`.
- The excerpt «Para o líder do PS, …» carries the marker «para o líder». The site net matches case-insensitively, so `ledger:check` would be red on this file.
- If this declaration shipped, the ruler would stop requiring the PS document for one of the five rows the block exists to fix.
- References: ledger/claims/posicao-ps-irc.yml:32, diff.patch:1131, diff.patch:1139, brief.md:10, src/lib/forma-da-citacao.mjs:5, src/lib/forma-da-citacao.mjs:11

**4. In `diff.patch`, the site's marker list has no «salientou»: its hunk header promises 29 lines but the hunk has 28 (26 markers).**
- The copy `ledger/marcadores-do-relato.json` has 27 markers, starting with «salientou», and its blob matches the diff's index line (a152039d2). The engine list is identical to that copy.
- So the diff text is the inconsistent side. A list without «salientou» would let the brief's own plant through, and the `posicao-governo-csi-pensoes` excerpt too, had that row been declared `palavras`. The site plant would catch it.
- References: diff.patch:2565, diff.patch:2566, ledger/marcadores-do-relato.json:2, motor/core/marcadores-do-relato.json:2, brief.md:23, tests/og1e/forma-da-citacao.mjs:27

**5. The builder's report contradicts itself on the site plants: `relatorio-construtor.md` says 47, the launcher's copy says 74.**
- The package gives 74: 2 editions × 7 route keys × 4 cases = 56, plus 4 ledger plants, plus 2 × 7 in `reguas.mjs` = 74.
- The engine's 18 reproduce: 9 cases × 2 editions.
- References: relatorio-construtor.md:6, RELATORIO-og1e-a.md:6, tests/og1e/forma-da-citacao.mjs:14, tests/og1e/forma-da-citacao.mjs:17, tests/og1e/forma-da-citacao.mjs:27, tests/og1e/reguas.mjs:12, motor/core/forma_da_citacao_test.py:17

**6. Two rows declared `palavras` are the newspaper's account, not the speaker's words: `hab-imprensa-psp-ferido` and `hab-imprensa-feridos39`.**
- The hosted article reads «…que segundo contas da organização deixou 39 feridos, dois deles graves, anunciando a PSP que um polícia ficou ferido». Both excerpts are the journalist's indirect speech, not in quotation marks.
- Because they are declared `palavras`, the ruler never requires their document.
- The housing page puts the journalist's words between «» with «segundo a PSP» / «segundo a organização» (en «according to the PSP» / «according to the organisers»). That reads as the PSP's and the organisers' own words, softened only by «tudo pela imprensa».
- References: ledger/claims/hab-imprensa-psp-ferido.yml:30, ledger/claims/hab-imprensa-feridos39.yml:30, motor/content/23 Habitacao/source/imprensa-9.html:447, built/estudos/a-casa-em-portugal-e-na-europa/index.html:4, brief.md:10

**7. The HTML ruler reads only a fixed list of route keys, so «zero refusals on 9 817 pages» overstates what it covered. The 9 817 itself is not shown.**
- `conferirFormaDasCitacoes` returns `[]` for any route key outside `estudo, documento, texto, dossie, discussao, explicacao, explicacoes, leituraDaSemana, dossies`.
- The audit script still counts every page it opens.
- The list has no `linha`, `home` or `indice`, and no key I can identify as items (`src/lib/routes.mjs` is not in the package). The brief requires items.
- The site plants only use keys already in the list, so a route left out of the list can never make a plant fail.
- There is no «after» measurement file in the package: `design/especime-v3/medicoes/og1-e-2026-11-02/` holds only `antes.json`.
- References: scripts/forma-da-citacao.mjs:62, scripts/auditar-forma-da-citacao.mjs:14, scripts/auditar-forma-da-citacao.mjs:20, tests/og1e/forma-da-citacao.mjs:16, brief.md:22, relatorio-construtor.md:4

**8. Both rulers let a `relato` headline row be quoted as a person's own speech if the template uses its `documento` token.**
- Three of the fifteen `relato` excerpts are the headline itself: `posicao-governo-divida85`, `posicao-jpp-irs`, `posicao-cds-orcamento`.
- The engine only checks `excerto`/`valor` tokens.
- The site skips any excerpt occurrence that the record marks as a `documento` proof at the same position.
- So «O ministro: «⟦PM:posicao-governo-divida85|documento⟧»» passes both rulers. No plant covers it: the `reguas.mjs` plant tests the excerpt with no record.
- References: motor/core/forma_da_citacao.py:36, scripts/forma-da-citacao.mjs:41, tests/og1e/reguas.mjs:28, tests/og1e/reguas.mjs:30

**9. Addendum A, which the block prompt names as part of the mandate, is not in the package.**
- `brief.md` has no addendum. It prescribes (a) the title before the quotation.
- `RELATORIO-og1e.md` records the stop on `hab-imprensa-igai` (document after the quote) and says resuming needs an addendum.
- Both rulers now accept the document anywhere in the sentence, and the plants assert «documento depois» passes. I cannot check that wording against its authority.
- References: brief.md:22, brief.md:37, RELATORIO-og1e.md:1, scripts/forma-da-citacao.mjs:52, motor/core/forma_da_citacao.py:49, tests/og1e/forma-da-citacao.mjs:17

## Minor

**10. The housing study also gets `updated: '2026-11-02'` although none of its reader text changes in this block, and the built page does not show it.**
- The diff touches only the housing records (the added `forma_da_citacao`), not `studies-src`.
- The brief §2.6 authorises the date for both studies.
- The built housing page shows only «publicado a 29.10.2026». Data and page disagree; I cannot tell from the package whether ED1 removed the date.
- References: src/data/studies.mjs:135, src/data/studies.mjs:141, brief.md:26, built/estudos/a-casa-em-portugal-e-na-europa/index.html:4

**11. The «before» count (40 = 8 routes × 5 rows, which I reproduced) was measured at head 59abbb9cb, which is neither `main` 46ee13d18 nor the base aa2891d68.** It was also measured by reading documents «before the crossing», not by the gate on `dist/`. References: design/especime-v3/medicoes/og1-e-2026-11-02/antes.json:2, design/especime-v3/medicoes/og1-e-2026-11-02/antes.json:3, brief.md:41

**12. The new guard `CAMPOS/forma-retirada` can never be true.** It removes `forma_da_citacao` from the list and then asks whether the list includes it, so it proves nothing. References: scripts/provar-guardas.mjs:872

**13. The engine's «dossie» plant is the same text as the «pessoa» plant, run through the same study composer.** It is not a dossier, and the site's dossier plant is a synthetic `<p>` only. References: motor/core/forma_da_citacao_test.py:17, tests/og1e/forma-da-citacao.mjs:18

**14. The sentence ruler is wired only into `compor_livros.compose`.** `core/compor.py`, which the brief names, defines the function, but its own composition path calls only the per-row check. References: motor/core/compor_livros.py:181, motor/core/compor.py:356, motor/core/compor.py:143, brief.md:22

**15. The HTML ruler reads only leaf `p, li, blockquote, h1–h4, td` elements.** Quotations in `figcaption`, `dd`, `h5`/`h6`, `summary` or bare `div` text, and the text of an `li` that also holds a `p`, are not read. References: scripts/forma-da-citacao.mjs:64, scripts/forma-da-citacao.mjs:65

**16. The site's literal-date gate was widened without a mention in the report or in the brief §2.6 list.**
- A «13 de outubro» literal can now be supported by an ISO date in `locator` or `excerpt`.
- This mirrors the engine's `literal_supported`, and there are three refusal plants.
- References: scripts/literais-eo1-do-portao.mjs:9, motor/core/compor_livros.py:99, motor/core/compor_livros.py:106, brief.md:26

**17. `hab-imprensa-igai` is declared `relato`, but its excerpt is a verbatim fragment of the IGAI's own statement, which the article quotes («"A IGAI informa que, … a IGAI abriu um processo administrativo, com solicitação de informações à PSP …"»).** The error is in the safe direction and the page names the article. References: ledger/claims/hab-imprensa-igai.yml:30, motor/content/23 Habitacao/source/imprensa-5.html:1185, motor/CORPOS-ALOJADOS.md:29

**18. The hosted UTAO document for `utao-risco-emprego` is not in the package, so its words cannot be checked.**
- The new lead-in «E sobre o emprego público:» leaves the UTAO as the speaker, carried over from the previous sentence.
- The excerpt itself contains «Segundo dados provisórios da DGAEP». The row is not a statement row, so the net does not read it.
- References: brief.md:35, built/estudos/orcamento-2027-o-que-muda-e-para-quem/index.html:4

**19. The builder's own full run was red (`verify.codigo = 1`) and was not repeated.**
- The director's run on e06236bd4 has two reds (`check:alvos`, `check:lugar`). The package cannot attribute them to ED1 or the merge.
- Several engine bodies have no `direitos/` folder beside them; every request receipt is present.
- References: relatorio-construtor.md:7, CONFERIR-TUDO.md:19, CONFERIR-TUDO.md:36, motor/CORPOS-ALOJADOS.md:92

## «What is fine»

- **Package complete:** 92 rows, 92 hosted documents, all sha256 match, 92 request receipts present (motor/CORPOS-ALOJADOS.md:7).
- **Engine forms map:** 92 rows, 77 `palavras`, 15 `relato`, the same fifteen as the brief (motor/core/formas-das-citacoes.json:1, brief.md:10).
- **The twelve §3 sentences:** each appears word for word, once, in the engine templates (motor/diff.patch:1596, motor/diff.patch:1610, motor/diff.patch:1619, motor/diff.patch:1632, motor/diff.patch:1646, motor/diff.patch:1655). They also reach the study sources (studies-src/orcamento-2027-o-que-muda-e-para-quem/pt.html:83) and both dossier editions (built/dossies/orcamento-2027/index.html:6, built/en/dossiers/orcamento-2027/index.html:6).
- **Document titles:** the titles rendered equal each row's `document.title`, and the PS title equals the hosted page `<title>` (ledger/claims/posicao-ps-irc.yml:22, ledger/claims/posicao-governo-irs.yml:22).
- **Marker list:** the site copy equals the engine's and the brief's 27 entries. The net is case-insensitive and normalises to NFC (src/lib/forma-da-citacao.mjs:5, motor/core/forma_da_citacao.py:10).
- **Mandatory field:** required by `ledger:check` (src/lib/ledger.mjs:1630) and by the export (motor/publisher/export_site_rows.py:2644). The site check is first in `verify` (package.json:48).
- **Budget dates:** the first publication is kept at 21.10.2026 with `updated` 02.11.2026 (src/data/studies.mjs:102, src/data/studies.mjs:103). The built Portuguese page prints «publicado a 21.10.2026 · atualizado a 02.11.2026». The «First edition, as published / Current edition» labels can only come from ED1.
- **Ledger row pages** name the document before the excerpt (built/livro-razao/posicao-governo-irc/index.html:4).

**Quotation table (rows whose lead-in changed, plus the other ten `relato` rows).** The «Verdict» column covers only the pages that pass; the defects are findings 1, 2 and 9. Abbreviations: «gov. comms.» is the communication «Orçamento do Estado reforça…» on portugal.gov.pt; «PS page» is «OE2027: PS leva propostas…» on the party's site; «pela notícia» means «by the news report».

| id | Speaker on the page | Speaker in the source | How the source frames it / how the page frames it | Words exact? | Verdict |
|---|---|---|---|---|---|
| posicao-governo-csi-pensoes | PM | gov. comms., third person | gov. comms. / «pela comunicação do Governo «T»» | yes | pass, except the PT study (finding 1) |
| posicao-governo-irc | PM | gov. comms. | same / same | yes | pass |
| posicao-governo-irs | PM | gov. comms. | same / same, «de 9 de outubro» | yes | pass |
| posicao-ps-irc | PS, by José Luís Carneiro | PS page, third person | PS page / «pela página do partido «T»» | yes | pass |
| posicao-ps-pensoes | PS, by José Luís Carneiro | PS page | same / same | yes | pass, except the EN study (finding 2) |
| utao-risco-emprego | UTAO, implied by the previous sentence | UTAO | own report / no frame | not checkable (finding 18) | — |
| posicao-be-rendimentos | BE | Lusa | report / «pela notícia sobre o OE «T»» | yes | pass |
| posicao-cds-orcamento | CDS | RTP headline | headline / «pelo título da notícia» | yes | pass |
| posicao-chega-habitacao | Chega | Folha Nacional | report / «pela notícia «T»» | yes | pass |
| posicao-governo-divida85 | Finance minister | Observador headline | headline / «pela notícia «T»» | yes | pass |
| posicao-jpp-irs | JPP | DN headline | headline / «pelo título da notícia» | yes | pass |
| posicao-livre-iva | Livre | DN | report / «pela notícia «T»» | yes | pass |
| posicao-psd-impostos | Hugo Soares (PSD) | Notícias ao Minuto | report / «pela notícia … «T»» | yes | pass |
| hab-imprensa-amorim | Amorim | Lusa/DNotícias | report / «pela notícia «T»» | yes | pass |
| hab-imprensa-assistidos | Luís Silva | RTP | report / «, segundo Luís Silva…» | yes | pass |
| hab-imprensa-igai | IGAI | the IGAI statement, quoted by the press | quoted statement / «…», pela notícia «T» (document after the quote) | yes | passes only under the missing addendum (finding 9) |

## The six questions

1. **Classification:** 13 of the 15 `relato` rows are right. `posicao-ps-irc` is right in the diff but `palavras` in the copy (finding 3). `hab-imprensa-igai` is arguably the IGAI's own words (finding 17). Of 24 sampled `palavras` rows, 22 are right and two are the newspaper's account (finding 6).
2. **Fixed lead-ins and the UTAO sentence:** word for word in the templates, composed files, records and both dossier editions. The built studies fail: the Portuguese study keeps the old `csi-pensoes` form and the English study drops the PS title (findings 1 and 2). Titles match `document.title`.
3. **The other ten `relato` rows:** each names its document, gives the headline, or uses «, segundo» on the built pages. `igai` passes only through the «document after» rule, whose addendum is absent (finding 9).
4. **The ruler:** it refuses the bare form, and the plants bite: 18 in the engine, 74 on the site, not 47. It has a route list (finding 7) and a hole for headline rows (finding 8). The marker net refuses «salientou», though only that one marker is planted. The field is mandatory in `ledger:check` and in the export.
5. **The dated update:** the Budget study keeps 21.10.2026 as first publication. The housing study also got `updated` without a text change, and its built page does not show it (finding 10).
6. **Rulers that changed shape:** no protective gate was loosened in threshold. The literal-date gate was widened without a report (finding 16), and one new guard is vacuous (finding 12).

**The editor's question.** I would print both dossier pages, in both editions. I would not print the Budget study as packaged:
- **Portuguese edition:** it still makes the Prime Minister the speaker of the Government's third-person account.
- **English edition:** it prints «on 14 October, : «» with the party's document missing.

Fix those two pages and the study reads correctly in both editions.