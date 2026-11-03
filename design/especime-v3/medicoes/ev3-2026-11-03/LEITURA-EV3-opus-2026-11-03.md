# The cold read of block EV3, 03.11.2026

Reader: Claude Opus 5.5 (`leitor`), xhigh, 15:13 to 15:25 UTC, 48 tool calls. Package `pacote-ev3-2026-11-03`, base f9d348650, head and `dist/` 3f02ab3bf, five plants (T1 to T5, registered by sha256 outside the package). Text as delivered by the reader, with the package's absolute path removed.

**Package check before anything else.** The package has no `motor/CORPOS-ALOJADOS.md`, no `motor/corpos-alojados.json` and no `SEM-CORPOS-ALOJADOS.md` (finding 14). All five hosted documents are present, each with its `.pedido.json` receipt. All three PDFs have a text layer: 15.pdf (OmniPage OCR, 7 pages), 22.pdf (Word-native, 1 page), 29.pdf (OCR of a Xerox scan, 9 pages).

## Blocking

1. The Portuguese document page swaps the Assembleia Municipal vote: it prints «18 votos a favor e 15 abstenções». The edital of 22.10 says «Aprovado por maioria, com 15 votos a favor (13 do PS, 1 do MCE e 1 do MICAZA) e 18 abstenções (9 da AD …, 6 da CDU e 3 do CHEGA), verificando-se 33 presenças». The ledger rows, the hosted engine HTML, the study page and both English pages say 15 and 18; only `built/estudos/…/documento/index.html` has the swap. *(Plant T1.)*
2. The same Portuguese document page gives the DECOVERDI abstention to the wrong party: «com a abstenção das vereadoras do PS». The edital of 29.10 reads «Aprovada por maioria, com a abstenção das Vereadoras da AD Évora Tem Mais Futuro». A public vote put on the wrong party is a person/party fact. *(Plant T5.)*
3. The English document page prints «the first phase had already been given 90 more days»; point 8.2 of the edital of 15.10 says «por mais 60 dias». *(Plant T2.)*
4. The copied `src/data/correcoes.mjs` files the Évora entry as `kind: 'texto'` (a correction); the diff's head files it as `'texto_atualizado'`. As copied, the update would be counted (45 would become 46) and labelled «Estudo corrigido», which §3 of the mandate forbids. The rulers would catch it (`tests/edicoes/atualizacao.mjs:14`, `historia-edicoes-conferir.mjs:20`). *(Plant T3.)*

## Major

5. The built English corrections page still prints `<p class="lede">Correcting in silence is the cheapest way of lying.</p>`, which addendum G removes in both editions; the code and the new ruler would refuse it. *(Plant T4.)*
6. «e que a reprogramação a articula com o projeto artístico da Floresta Nómada» states as done what the Câmara's notice frames as the President's statement of purpose («Com estas propostas, referiu o Presidente da Câmara, evita-se a perda de fundos alocados à empreitada e assegura-se a flexibilidade para que a reabilitação e renaturalização do Rossio de S. Brás seja efetuada de forma articulada com a realização do projeto artístico da Floresta Nómada…»), puts it under «a Câmara escreveu», and drops the first aim, not losing the funds. The English has the same problem. The wording comes from the mandate. Rule 2: a cause is told as interpretation until the source shows the mechanism.
7. The English edition prints two dates in Portuguese numeric form, «On 23/10/2026» and «the one of 11/08/2026», in passages that use «15 October 2026», against addendum A §1 and addendum B §1; the builder made `-en` sister rows for the long dates but not for `ev3-data-noticia-rossio` or `ev3-ultima-noticia`. «11/08/2026» reads as 8 November in US usage. In Portuguese, «A 23/10/2026» sits beside «a 15 de outubro de 2026» in one paragraph.
8. In English, the paragraph's two figures sit only inside untranslated Portuguese quotations («financiada a 100% pelo Fundo Ambiental», «estava prevista ser concluída até ao final de 2026»), as does the main fact («a obra não poderá ser concluída nesse prazo»); a reader without Portuguese cannot tell that the works will miss their deadline.

## Minor

9. The quoted address «… em Evora.» keeps an OCR artefact the scan may not contain (the same page's OCR gives «Évora,» a few lines below).
10. «a primeira fase já tinha recebido, a 15 de outubro, mais 60 dias» loosens the act: point 8.2 sits under «Propostas para ratificação»; on 15.10 the Câmara ratified an extension granted earlier.
11. «aprovada … com 15 votos a favor e 18 abstenções» leaves out «por maioria»; a lay reader may take more abstentions than votes in favour to mean the motion failed.
12. The study's table lists the Rossio de São Brás as a PRR intervention at 4 100 000 €; the new paragraph says its second part is «financiada a 100% pelo Fundo Ambiental»; the page does not say how the two relate.
13. Publisher names are not measured per document: «Município de Évora» for the 15.10 edital, whose text contains that name 0 times (its issuer is «Presidente da Câmara Municipal de Évora»); the news page registered as «Évora 2027» while the row says «Associação Évora 2027».
14. The package has no declaration of the hosted bodies (`motor/CORPOS-ALOJADOS.md` or `corpos-alojados.json`).
15. The corrections-page surface ruler mostly checks the page against the strings it renders; only `politicaV` is pinned literally.
16. The rule «an update is not a correction» is coded in four places, and no plant tests the shared function itself.
17. The line between update and correction rests on two hand declarations (the manifest's `natureza` and the entry's `kind`); flipping both passes; nothing checks that an update edition only adds text.
18. The builder's report numbers are not fully reconciled (30 against 20 ledes; the report checker read no JSON files).
19. «Nesta atualização» / «In this update» is an undated reference to the site's own work, in reader prose.
20. The archived English first edition («as published») now carries 4 `data-ev3-nome` spans it did not have on 01.10.

## What is fine

21 to 35: the three PDFs match the mandate's sha256; the five receipts are present (200, bytes and sha256 equal); the study page and the hosted HTML agree with the documents on the vote, the Câmara's approval with CDU abstention, the 60 days, the DECOVERDI award with AD abstention, «ratificou» and the licence under «Proposta para ratificação»; the latest of the 61 dates on the news page is 11/08/2026; between the two editions only the three places change; the previous edition is kept by fingerprint and the bands read «Edição atual, de 03.11.2026. A primeira edição é de 01.10.2026»; the register entry reads word for word as addendum A §2.4, labelled «Estudo atualizado» / «Study updated»; the counter shows 45 with the update left out; the Portuguese corrections page is G §2 plus the kept parts, no lede, no list of kinds, the meta description word for word; the front-page box holds only pieces and the register stays one tap away; no date check of the box was lost; the L1 ceiling rose by exactly the two archived pages; the five Portuguese names carry `lang="pt-PT"` in English; the new publisher «Assembleia Municipal de Évora» is measured in its document; the four quotations pass (speaker, framing, exact words; the address accent unverified).

**Editor's question:** No, not as the package has them (the plants). Even on the clean study page, the first paragraph chains three back-to-back quotations and mixes date forms, and it hardens a statement of purpose into a fact; the English carries its facts in untranslated Portuguese. The register entry and the Portuguese corrections page are printable as they stand.

## The director's decision (16:0x UTC)

Five of five plants found. Addendum H corrects 6, 7, 8, 9, 10, 11 and 19; addendum I corrects 12, 13 and 20 (at the funder's question, 15:34 and 15:37 UTC); 14 to 18 go to Friday's hygiene list (machinery and rulers with no effect for the reader, none weakened).
