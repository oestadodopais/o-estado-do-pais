Cold read of block ED1 (Claude Opus 5.5, `leitor`), 02.11.2026. Package: <caminho> I wrote no files and used 34 tool calls.

The package is complete for the rows the block changes. The only ledger row in `diff.patch` is `correcoes-publicadas`. It is a derived row and declares no `source_sha256` (motor/CORPOS-ALOJADOS.md:7), so no hosted document is owed and there is no `SEM-CORPOS-ALOJADOS.md`. I compared every hunk in `diff.patch` with the copied files by script. 41 of the 43 files agree line for line; the two that do not are findings 2 and 3.

## Blocking

**1. On the Portuguese Évora study page, «Primeira edição, tal como foi publicada» opens the current document. This is exactly the defect the block exists to fix.**
In the built pt band, both doors have `href="/estudos/evora-contas-da-camara-2010-2025/documento"`: the first-edition door and «Edição atual» go to the same place. The code would render `primeira.rota` there (`/documento/2026-10-01`). The English band is correct (`/en/studies/…/document/2026-10-01`), and so is the Budget pt band. A reader of the Portuguese edition still cannot reach the 01.10 text from the study page. `scripts/edicoes-conferir.mjs` would refuse this page twice (`ED1 portas`, `ED1 rótulo`). Yet the director's full run on e06236bd4 shows `check:edicoes` green. So either `built/` is not the `dist/` that run read, or the ruler did not read this page. I cannot tell which from inside the package.
built/estudos/evora-contas-da-camara-2010-2025/index.html:4, src/components/EdicaoPublicada.astro:16, built/en/studies/evora-contas-da-camara-2010-2025/index.html:4, scripts/edicoes-conferir.mjs:40, scripts/edicoes-conferir.mjs:56, CONFERIR-TUDO.md:4

**2. The saved Portuguese first edition of Évora is not the 01.10 document. One passage carries the 30.10 text.**
`shasum -a 256` of the package file gives `0bc7ee4546dd…4fbc`, not the mandate's `619f0972…b7839`. Line 51 reads «as próprias contas mostram o padrão que, nesta leitura, explica essa queda». That is the 30.10 sentence the mandate's §0.1 names as the current text. The file has 0 matches for the 01.10 «e o mecanismo está nas próprias contas». The version `diff.patch` adds has the 01.10 sentence, and when I rebuilt it from the hunk it hashes to `619f0972…b7839`. So the copied file and the diff disagree, and the copy is the wrong one. The other three saved files match §0.2 byte for byte. The report's «Os quatro arquivos … conferem byte a byte» is contradicted by this package.
studies-src/_edicoes/evora-contas-da-camara-2010-2025.pt.2026-10-01.html:51, diff.patch:1269, brief.md:9, brief.md:10, RELATORIO-ed1-a.md:8

**3. The manifest gives the Portuguese Évora first edition a sha256 that matches neither the mandate, the diff nor the file.**
The copied `studies-src/manifest.yml` declares `619f0972f44b…c59b7838`. The diff adds `…b7839`, which is §0.2, and the file hashes to `0bc7ee…`. With this manifest, `primeiraEdicaoServida` throws («sha256 da primeira edição diverge»), so `/estudos/evora-contas-da-camara-2010-2025/documento/2026-10-01` cannot be built. The `check:edicoes` history check would also fail (`ED1 história`). The pt first-edition door, even once fixed, would lead nowhere.
studies-src/manifest.yml:315, diff.patch:1665, brief.md:10, src/lib/edicoes.mjs:30, scripts/check-edicoes.mjs:19

**4. The Portuguese corrections page prints the wrong date for the Évora correction.**
The entry shows «29.10.2026» while its `datetime` is `2026-10-30`. The data says `data: '2026-10-30'`, and the English page prints 30.10.2026. In the public corrections register, the date is the fact the entry exists to state.
built/correcoes/index.html:3, src/data/correcoes.mjs:73, built/en/corrections/index.html:3

**5. The English corrections page misstates the Évora entry: «the caveat on the 2025 value» instead of «2024».**
Addendum A's sentence and `CORRECOES_TEXTO` both say «the caveat on the 2024 value», and so does the phrase inventory. The built English page says «2025», which names a different year's value. The Portuguese page has «2024».
built/en/corrections/index.html:3, ADENDA-A.md:9, src/data/correcoes.mjs:75, design/especime-v3/INVENTARIO-FRASES.md:5371

## Major

**6. The builder's report in the package says the lot-1 merge never happened, but the built pages and the full run come from a head that has it.**
`relatorio-construtor.md` is the addendum-B report: `git merge` exited 128, «Nenhum commit». Yet `built/` and `CONFERIR-TUDO.md` come from e06236bd4, which addendum C describes as «com o lote 1 fundido». Who made that merge, and how its three predicted conflicts were resolved (`package.json`, `scripts/gate-html.mjs`, the builders' map), is in no diff and no report here. Addendum B's rule-4 check («nenhuma régua dos dois lotes fica mais fraca na fusão») is therefore unread. `diff.patch` stops at 36d48a4ce, before the merge.
relatorio-construtor.md:1, relatorio-construtor.md:8, ADENDA-B.md:8, ADENDA-B.md:9, ADENDA-C.md:5, prompt:13

**7. The head under read is red on two checks, and the fixes are not in the package.**
The full run on e06236bd4 has `check:alvos` = 1 and `check:lugar` = 1. Addendum C's fixes reshape rulers: `check:lugar` counts first editions apart, the L1 ceiling may rise by two, and words may enter the closed vocabulary. None of that is in this package, so the block cannot land on what was read here. The C diff needs its own short read.
CONFERIR-TUDO.md:1, CONFERIR-TUDO.md:19, CONFERIR-TUDO.md:36, ADENDA-C.md:7, ADENDA-C.md:8

**8. Most of the report's claims cannot be checked here: the full reports are linked to a temporary path that is not in the package.**
Both summaries end with «Relatório completo … (<temporário>)». There are no `.codigo` files, no command output and no commit list I can check. So none of these is shown here: the commits 467ae29e3 and cc85d960b, «Build final: 0. Typecheck: 0.» for 36d48a4ce, and «56 chamadas; 11 conferências». The same goes for what the mandate's §4 requires: each updated edition's band before and after, the hashes checked against §0.2, the rulers that changed shape with their plants, and what the exception pages print (§2.4). The package's number check ran only on the addendum-B report: 4 numbers with no file, exit 1. The internal arithmetic does hold: 6 saved editions, 3 entries and a count of 12 → 15, then housing removed gives 4, 2 and 14.
RELATORIO-ed1.md:3, RELATORIO-ed1.md:9, RELATORIO-ed1-a.md:10, RELATORIO-ed1-a.md:12, RELATORIO-ed1-a.md:14, numeros-do-relatorio.txt:5, numeros-do-relatorio.txt:13, brief.md:38

**9. The housing «no visible change» comes with no proof in the package.**
The report says «zero alterações nas duas línguas pela prova do texto lido» between aa2891d68 and the head. No measurement, output or command is shown. Indirect support: both housing manifest entries keep `fetched_utc` 2026-10-29, the publication day, so the hosted document was not re-fetched (inferred). But the text-read proof reads the hosted document, not the study page around it, and that page is where OG1-E's quotation form applies. Only the pt housing page is in `built/`. The data side of the rollback is done: `updated` removed, no `primeira_edicao`, no register entry.
RELATORIO-ed1-a.md:1, studies-src/manifest.yml:436, studies-src/manifest.yml:447, diff.patch:683, built/estudos/a-casa-em-portugal-e-na-europa/index.html:4

**10. Nothing in the package shows the page a reader lands on through «Primeira edição», and the code cannot mark it as the first edition.**
None of the four `/documento/<date>/` pages is in `built/`. `primeiraEdicaoServida` wraps the saved bytes with `comFaixa(…, {slug, lang})`. These are the same arguments the current document gets, with no date or edition. So whatever band the current document carries, possibly «atualizado a 30.10.2026», would sit on the 01.10 text, and nothing can say that this text was superseded or point to the current edition. `src/lib/documentos.mjs` is not in the package, so what that band prints is unverified. Question 1 can therefore be answered only at code level: the route is built from the saved file, and `gate:html` compares it with the same function.
src/lib/edicoes.mjs:33, src/pages/estudos/[slug]/documento/[date]/index.html.js:6, scripts/gate-html.mjs:1561

**11. Rule (b) of §2.4 compares an address, not a sha256, and the whole ruler starts from the hand-set `updated` field.**
§2.4(b) asks the ruler to refuse a «tal como foi publicada» label linking to a document whose sha256 is not the first publication's. For an edition without `updated`, the code accepts that label pointing at the current document and never compares that document's bytes with anything. Every ED1 check begins with `if (!d.updated) continue`. So a study whose hosted text is re-fetched and changed without anyone setting `updated` passes every ED1 check, still labelled «Edição tal como foi publicada». That is the silent correction the block was written to stop. The housing episode shows the field is set by hand, here wrongly in the other direction.
scripts/edicoes-conferir.mjs:22, scripts/edicoes-conferir.mjs:56, brief.md:23

**12. Numbers in the new correction entries are exempt from the HTML gate's numeric sweep without any ledger check.**
The new block in `gate-html.mjs` removes the four `data-texto-campo` fields from the numeric sweep once their text equals `CORRECOES_TEXTO`, which is the file the page is rendered from. The existing precedent for project changes is stricter: it passes each text through `textoDaMudancaGate(…, claims)`, so a value inside a declared sentence must be a sealed ledger value. Today the exempted fields hold only dates and the years 2024 and 2025, so nothing escapes on these pages. But the next `texto` entry with a figure would reach `/correcoes` with no ledger row. The financiador said these corrections are for the whole site, so more entries will come.
scripts/gate-html.mjs:6066, scripts/gate-html.mjs:6072, scripts/gate-html.mjs:6091, scripts/edicoes-conferir.mjs:68, scripts/edicoes-conferir.mjs:72

**13. The corrections page's own policy contradicts the new entries.**
The page still says «São três naturezas, e não se misturam» (en «There are three kinds») and that each entry holds «o valor anterior, o valor novo, a data, o motivo e a linha do livro-razão que mudou». Directly below, it lists a fourth kind, «Estudo corrigido», with no value, no row and no claim, and counts it among the corrections. A reader comparing the policy with the register sees the register break its own rule. An editor would not print the page as it stands.
built/correcoes/index.html:3, built/en/corrections/index.html:3, src/components/RegistoCorrecoes.astro:114

**14. The counts in the entry sentences («Quatro passagens», «Cinco citações», «uma frase») were never measured, and the documents needed to count them are not in the package.**
The mandate's §0 measures none of the three counts, nor what the 2025 accounts report «apresenta como leitura» (rule 14 of the house). The current documents of 30.10 (Évora) and 02.11 (Budget) are not in the package, so the passages that changed cannot be counted. Partial support: the saved Budget first edition does frame several PM and PS quotations as their own words where the quoted text is a report («O primeiro-ministro: «Referiu também…»», «O PS, por José Luís Carneiro: «Para o líder do PS…»»). It also introduces a quoted passage on public employment «com os dados da … DGAEP», which fits the DGAEP clause. That supports the kind of change, not the number five.
brief.md:7, brief.md:33, brief.md:34, ADENDA-A.md:8, src/data/correcoes.mjs:73, src/data/correcoes.mjs:77, studies-src/_edicoes/orcamento-2027-o-que-muda-e-para-quem.pt.2026-10-21.html:1

## Minor

**15. The exceptions list is right for the data, but it departs from the mandate without saying so, and changes what six pages print.**
The list has five Évora editions with `updated` 2026-08-20 plus `penalizacoes-por-reforma-antecipada-2026`/pt (2026-09-23). Those are exactly the six other editions with a non-null `updated`, and all predate 30.10.2026, so the reason holds for each. But the mandate's §0.4 counts «quatro» Évora editions and does not name penalizações, and the reports do not disclose either difference. The six bands now print «Edição atual» instead of «Edição tal como foi publicada». That includes superseded Évora works kept as dated editions. Only the builders' map says so; none of those pages is in the package.
scripts/edicoes-conferir.mjs:6, scripts/edicoes-conferir.mjs:12, src/data/studies.mjs:265, src/data/studies.mjs:297, src/data/studies.mjs:308, src/data/studies.mjs:384, src/data/studies.mjs:385, src/data/studies.mjs:583, brief.md:12, design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md:854, src/components/EdicaoPublicada.astro:17

**16. Three refusal paths of `check:edicoes` have no plant that asserts them.**
The four plants §2.4 requires are present: missing entry, door to the current document, a changed byte, and a control. There is no asserting plant for a missing or invalid `primeira_edicao` (`ED1 arquivo`), for the site-wide label check (`ED1 rótulo`), or for the git-history witness (`ED1 história`).
tests/edicoes/plantas.mjs:20, tests/edicoes/plantas.mjs:28, scripts/edicoes-conferir.mjs:28, scripts/edicoes-conferir.mjs:56, scripts/check-edicoes.mjs:19

**17. The new text-read plant does not bite on the clause it was written for.**
The synthetic `historica` entry has no `sha256_normalized`, so `bytesDoMotor` already returns false through the `typeof` clause. Removing `!e.file?.startsWith('_edicoes/')` would not turn the plant red. Real manifest entries carry `raw_file`, not `file`, so that clause never fires on real data. The scope count fixed at 18 keeps the proof from getting weaker.
scripts/provar-eyetext.mjs:89, scripts/provar-eyetext.mjs:326, scripts/provar-eyetext.mjs:330

**18. A study's second update will force the first entry out of the register.**
Rule (c) requires some edition to currently declare `updated === c.data`. When Évora is updated again (EV4 is queued), the 30.10 entry becomes an orphan and the build fails unless it is deleted. That breaks «Nada é removido» on the same page. The band also has room for only the first and the current edition.
scripts/edicoes-conferir.mjs:45, design/observatorio/FILA.md:11, built/correcoes/index.html:3, src/components/EdicaoPublicada.astro:16

**19. The history witness needs commit c2aa011f1 in the checkout, which the package cannot show for the GitHub run.**
`git show c2aa011f1:…` fails on a shallow clone and reports «ED1 história indisponível». The workflow is not in the package, so «na corrida portão» is unproven.
scripts/check-edicoes.mjs:19, brief.md:23

**20. The ledger row's arithmetic shows readers internal codes and names a register that does not exist.**
It cites «correcao» and «texto» and «o registo dos estudos» / «the study corrections log». The corrections page calls the kind «Estudo corrigido» and has one register.
ledger/claims/correcoes-publicadas.yml:23, ledger/claims/correcoes-publicadas.yml:24, built/livro-razao/correcoes-publicadas/index.html:2

**21. In the band, the two doors are separated only by a space, and the dates come after both.**
Without the stylesheet the line reads «First edition, as published Current edition · published on 01.10.2026 · updated on 30.10.2026». So «publicado a 01.10.2026» sits after «Edição atual».
src/components/EdicaoPublicada.astro:16, built/en/studies/evora-contas-da-camara-2010-2025/index.html:4

**22. The entry sentences use terms a lay reader would have to look up.**
UTAO, DGAEP and PS are not expanded. «a ressalva do valor de 2024» does not say which value. «o orçamento da comparação» does not say which comparison.
built/correcoes/index.html:3, built/en/corrections/index.html:3

**23. «14 wherever printed» is proven only on four pages.**
`prova().correcoes` also feeds the Method and other pages, which are not in `built/`. The English Budget and English housing study pages are missing too.
src/lib/prova.mjs:1051, motor/CORPOS-ALOJADOS.md:10

## «What is fine»

24. The other three saved first editions are byte-identical to the mandate: Évora en `edd49eef…0a87`, Budget pt `97fb771c…2a2a` and Budget en `eb77d5f7…3979`, by `shasum -a 256`. Their manifest entries declare the same values. studies-src/manifest.yml:331, studies-src/manifest.yml:402, studies-src/manifest.yml:418, brief.md:10

25. The diff's version of the Portuguese Évora first edition, rebuilt from the hunk, hashes to §0.2's `619f0972…b7839` and carries the 01.10 sentence. diff.patch:1218, diff.patch:1269

26. The English Évora band and the Portuguese Budget band are as the mandate asks: first door to `/document/2026-10-01` and `/documento/2026-10-21`, second door to the current document, dates unchanged. built/en/studies/evora-contas-da-camara-2010-2025/index.html:4, built/estudos/orcamento-2027-o-que-muda-e-para-quem/index.html:4

27. Three of the four register sentences match the mandate word for word when compared by script: Budget pt and en, and Évora pt as rewritten by addendum A. Both doors go to the right routes in both languages, and the kind label is «Estudo corrigido» / «Study corrected». built/correcoes/index.html:3, built/en/corrections/index.html:3, src/data/correcoes.mjs:72

28. The count of 14 is consistent everywhere it appears in the package: 12 ledger corrections plus 2 study corrections. That covers the row value, the sealed history 12 → 14, the corrections pages («12 → 14»), the ledger pages and the embed (`data-oedp-valor="14"`). ledger/claims/correcoes-publicadas.yml:7, ledger/historias-valores.json:39, built/livro-razao/correcoes-publicadas/index.html:3

29. The housing rollback is complete in the data: `updated` is removed from both editions, there is no `primeira_edicao` or saved file, the register has no entry, and the pt band prints «Edição tal como foi publicada» with no update date. diff.patch:683, built/estudos/a-casa-em-portugal-e-na-europa/index.html:4

30. `check:edicoes` as written would refuse each of findings 1 to 5: the band doors and labels, the file and history sha256, and each register field and door compared one by one. The mandate's four plants are present, plus orphan-entry and served-bytes plants. scripts/edicoes-conferir.mjs:31, scripts/edicoes-conferir.mjs:40, scripts/edicoes-conferir.mjs:72, tests/edicoes/plantas.mjs:21

31. The rule (a) date threshold is implemented more strictly than asked: every `updated` edition outside a closed list keyed by slug, language and date. A new update to an excepted work falls back under the rule. scripts/edicoes-conferir.mjs:24

32. Several rulers changed shape without getting weaker, each with a plant: `check:datas` (door to the current document refused), `check:lingua` (edition removed or orphaned), the inventory (state missing, paragraph altered), and the text-read proof (count still fixed at 18). scripts/check-datas.mjs:506, tests/edicoes/lingua.mjs:4, tests/edicoes/reguas.mjs:37, scripts/provar-eyetext.mjs:330

33. The ledger refuses a `texto` kind on a ledger row, because the ledger keeps its own list of kinds. src/lib/ledger.mjs:24, src/data/correcoes.mjs:30

34. Quotations: this block prints no quotation. The register entries and the bands contain no attributed words between marks. The Budget study page in `built/` carries OG1-E's quotations, which belong to that block's read.

## The six questions

1. **The first editions.** Three of the four saved files match §0.2. The Portuguese Évora copy does not (finding 2), and its manifest hash is wrong (finding 3). The English Évora door and the Portuguese Budget door open the saved routes. The Portuguese Évora door opens the current document (finding 1). The English Budget door is not in the package. «Edição atual» opens the current document in all three bands I can see. That a dated route serves the saved file is proven only in code; the served pages are not in the package (finding 10).
2. **The register.** Three of four sentences are word for word. The English Évora sentence says 2025 for 2024 (finding 5), and the Portuguese Évora date prints 29.10.2026 (finding 4). Both doors are right in both languages. The count is 14 on the four pages present; it is unproven elsewhere (finding 23).
3. **The housing study.** No `updated`, no entry and no saved file, in the data and on the pt page. That its visible text did not change is asserted, not shown (finding 9).
4. **The ruler.** The four required cases each have a plant that bites. Three other refusal paths have none (finding 16). Rule (b) checks an address, not a hash, and the whole ruler depends on the hand-set `updated` field (finding 11). The exceptions list is complete and correct for the data. It differs from the mandate's §0.4 (five Évora editions, not four, plus penalizações) without disclosure, and the six pages it changes are not shown (finding 15).
5. **The rulers that changed shape.** None that I can read got weaker, with one exception. The HTML gate's new exemption for the entry fields lets a future figure skip the ledger, where the existing precedent requires a sealed value (finding 12). The merge and addendum C, which reshape `gate-html.mjs` and `check:lugar`, are unread (findings 6 and 7).
6. **Reading it.** On the English Évora page, yes: two labelled doors and the two dates. On the Portuguese page, no (finding 1). The study page does not say what changed or link to the register. The register says it, in terms a lay reader partly cannot follow (finding 22), under a policy paragraph that its new entries contradict (finding 13).

**The editor's question.** No. I would not publish the Portuguese Évora band: its «Primeira edição» door goes to the current text. I would not publish the corrections page either. It prints a wrong date (pt) and a wrong year (en) for Évora, and its policy still says there are three kinds while showing a fourth. With those fixed, I would print the band. For the register I would still rewrite the policy paragraph to name «Estudo corrigido», and spell out UTAO, DGAEP and «o valor de 2024».