# Leitura a frio do bloco DO1 (Claude Opus 5.5, `leitor`, xhigh; 29.10.2026, 16:03 a 16:16 UTC; 52 chamadas de ferramenta; 204 445 símbolos)

*O relatório tal como o leitor o devolveu (em inglês), copiado pelo lugar de direção a 29.10.2026 às 16:20 UTC. O pacote: `_aterragens/pacote-do1-2026-10-29`, com cinco plantas só nas cópias (Z1 a Z5). As cinco apanhadas: os achados 5 (Z1), 2 (Z2), 4 (Z3), 15 (Z4) e 6 (Z5). O achado 1 (Blocking) é um erro do pacote, não do bloco: o guião de montagem tomou como base a cabeça do ramo da HB1-e (bd5fc4a4e, já com a HB1-e5) em vez da base da fusão (e4ded5155), e o diff mostrou a HB1-e5 como se o DO1 a desfizesse; a cabeça do lote (006d0dd0f) tem a definição da adenda D, conferida por guião (`git show HEAD:…` com a frase «nos três meses até», a secção «HB1-e: adenda D» e a linha «A, B, C e D» das revisões, uma ocorrência cada). O achado 3 (Blocking) é o Major conhecido da prova (os códigos dos portões fora do pacote; a I280): a corrida inteira do lote (b) correu na cabeça 23031c528 com 51 passos verdes e dois vermelhos, corrigidos na DO1-7. Os achados reais do bloco: os Major 7 a 12 e 14; os Minor 16 a 20; o Major 13 é do estudo do Orçamento, não deste bloco. As decisões estão na adenda D do DO1 e na §1.211.*

## Blocking

1. **The DO1 diff reverts the HB1-e adenda D definition of the median bank appraisal (`hab-ine-avaliacao-mediana`) to the wording that HB1-e had withdrawn, and the report does not mention it.**
In `src/data/o-que-e-das-familias.mjs` the diff removes «nos três meses até ⟦periodo⟧ (o mês de referência e os dois anteriores, como o INE apura)» and restores «em ⟦periodo⟧ quando lhes pediram crédito…». The same revert appears in the HB1 generator, the HB1 families, the proven readings `tests/cartao/leituras-provadas.json` (so `check:cartao` would not catch it), the inventory and the reviews file:
- In the inventory, the old pt/en definitions go from `retirada` back to `viva`, and the section «### HB1-e: adenda D», which cites the INE methodological note on page six of the hosted PDF, is deleted.
- The reviews file goes from «adendas A, B, C e D … com os três meses da mediana» back to «adendas A, B e C».

This changes the stated period of a published number (one month against three), which is a different definition of the measure. The mandate forbids it («nenhuma frase … muda»). The builder's report and the DO1-n ambiguities never mention it. The L1 base is `f89a8046b`, but the diff's base already contains adenda D, so DO1 was built from an HB1-e state older than the one it would land on.
Refs: diff.patch:41116, diff.patch:9, diff.patch:12, diff.patch:23, diff.patch:40683, src/data/o-que-e-das-familias.mjs:22257, src/data/o-que-e-das-familias.mjs:22268, scripts/hb1-familias.py:200, design/especime-v3/medicoes/hb1-2026-10-21/familias.mjs:6166, tests/cartao/leituras-provadas.json:50581, design/especime-v3/INVENTARIO-FRASES.md:5198, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:929, brief.md:74, relatorio-construtor.md:29

2. **The Portuguese Budget dossier's calendar line prints the date 24.11.2026 next to an excerpt ending «26 de novembro», while the English page prints the same row's excerpt ending «24 de novembro».**
Both editions render `oe-2027-calendario-final-global` through the same `CampoDaLinha` with `lingua="pt-PT"`, so the excerpt must be byte-identical. It is not: PT has «… votação final global | 26 de novembro», EN has «… | 24 de novembro». On the PT page the reader sees one date in the calendar's own date field and another in the source line. The opening sentence on the same page says the final vote is «marcada para 24.11.2026». `tests/dossies/dossies.mjs` checks tokens only inside `[data-dossie-abertura]`, never the calendar excerpt.
Refs: built/dossies/orcamento-2027/index.html:6, built/en/dossiers/orcamento-2027/index.html:6, src/views/DossieView.astro:37, src/data/dossies.mjs:18, tests/dossies/dossies.mjs:63

3. **The block has no green build or verify at the reviewed head, and no gate code in the package is backed by a file.**
- The report reads `build` = 1 and `verify` = 125 («não executado»), and says «Não repeti os três portões» after fixing `check:datas`. Only typecheck is 0.
- The other codes are merged rows («HTML, discussão, voz, língua, palavras, CSS, índice e L1 | 0»). One code for eight commands is not a reading of eight `.codigo` files.
- The report names no output folder. `linhas-dos-portoes.json` is `[]`. The seat's checker read 2 JSON files in `../../_aterragens/lancador-do1`, which is outside the package.
- The report's commits are `cd5f5f778` and `caca34e3b`, but the head under review is `23031c5`. Nothing in the package says what lies between them.

Refs: relatorio-construtor.md:3, relatorio-construtor.md:11, relatorio-construtor.md:12, relatorio-construtor.md:15, relatorio-construtor.md:18, linhas-dos-portoes.json:1, numeros-do-relatorio.txt:2, package.json:13

## Major

4. **The copied `src/data/dossies.mjs` disables the «piece in two dossiers» refusal (`if (false && pecas.has(chave))`), while the diff has the live check.**
I evaluated `conferirDossies` from both texts with stub source lists in `node`:
- The diff version refuses all five mandated cases: unknown study, item or explanation; a dossier without pieces; a piece in two dossiers; a malformed, accented or repeated slug. It also refuses an unknown door.
- The copy accepts a piece in two dossiers.

`dossieDaPeca` takes the first match, so a duplicated piece would silently link to one dossier only. The builders' map claims the import refuses «repetidas». The plant at `tests/dossies/dossies.mjs:19` would turn `check:dossies` red against the copy.
Refs: src/data/dossies.mjs:47, diff.patch:41110, src/lib/dossies.mjs:6, design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md:786, tests/dossies/dossies.mjs:19

5. **The copied `src/data/dossies.mjs` drops `saude-no-orcamento` from the Budget dossier's items, unlike the diff, the mandate and the built pages.**
- The copy has `itens: ['orcamento-2027-generalidade', 'parcerias-rodoviarias']`.
- The diff and brief §2.1 have three items.
- The built dossier (both editions) shows the Health item, and `/o-que-se-discute/` prints the «Dossiê» line on the Health item.

Whichever is the head, the data file and the pages disagree.
Refs: src/data/dossies.mjs:17, diff.patch:41080, brief.md:24, built/dossies/orcamento-2027/index.html:6, built/o-que-se-discute/index.html:6

6. **The English dossier index prints «One place per subject, with everything there is on it», not the mandated «One place per living subject…».**
`strings.mjs` and the page's own meta description carry «living subject». The visible paragraph on `/en/dossiers/` drops «living». The PT page is correct. `tests/dossies/dossies.mjs` never compares the index scope sentence.
Refs: built/en/dossiers/index.html:3, built/en/dossiers/index.html:1, src/i18n/strings.mjs:3206, brief.md:66, src/views/DossiesView.astro:12

7. **The corrections section reprints whole claim sentences («afirmações») from UTAO and the Finance Ministry report, against §5 («nenhuma página reimprime as afirmações»).**
The Budget dossier prints old→new values for `utao-ppp-contingencias-natureza-2026» («São pretensões dos parceiros privados, e não encargos já reconhecidos; …»), `utao-risco-execucao-sns-2027`, `oe-2027-saude-contrato-programa-acss` and `pe-oe-beira-abolicao`. These are full source sentences tagged «afirmação · fonte · UTAO». The only guard, «não repete afirmações», counts `[data-discussao-parte]` and cannot see this section.
Refs: built/dossies/orcamento-2027/index.html:6, built/en/dossiers/orcamento-2027/index.html:6, src/lib/dossies-conteudo.mjs:48, src/components/dossies/CorrecaoDoDossie.astro:17, tests/dossies/dossies.mjs:33, brief.md:74

8. **The dossier page talks about the project itself, against §2.2 («Nada na página fala do sítio nem do método»).**
Seven correction entries carry house prose:
- «A comparação semanal … encontrou a revisão e este projeto releu a fonte nesse dia; até aí publicava-se o valor da leitura anterior»
- «O recibo mostrava apenas o dia»

They also show raw ledger ids as «Afirmação: divida-publica-2024». The second opening paragraph («Os textos abaixo dizem…») describes the page, not the country.
Refs: built/dossies/orcamento-2027/index.html:6, src/components/dossies/CorrecaoDoDossie.astro:97, brief.md:29

9. **«A peça mais recente é de 27.10.2026» sits directly above three items each dated 28.10.2026.**
The line uses publication dates (`publicacao.declarada`, item `orcamento-2027-generalidade` published 27.10). The item blocks below print their writing dates (`escrita.declarada`, 28.10.2026). The same 27.10.2026 appears on `/dossies/`, Temas and the «Estado e economia» door. A reader sees «most recent» older than the pieces shown, with nothing saying the two dates mean different things.
Refs: built/dossies/orcamento-2027/index.html:6, built/dossies/index.html:3, src/views/DossieView.astro:33, src/components/discussao/BlocoDaDiscussao.astro:18, built/index.html:6

10. **The front page changes form beyond the dossier names in the news box: the «O que se discute» summaries gain 10 source chips and the `explicacao-p` class.**
- `BlocoDaDiscussao` switches `selos={false}` to `selos={true}` and adds `class="explicacao-p"`.
- The CSS selector narrows to `> li > a`.

Adenda B §3 assumed the front page already had these seals. The builder found it did not and added them (DO1-2), instead of stopping on a false premise. The mandate says «A primeira página não muda de forma».
Refs: src/components/discussao/BlocoDaDiscussao.astro:18, src/styles/discussao.css:12, src/styles/discussao.css:21, built/index.html:6, brief.md:39, ADENDA-B.md:15, relatorio-construtor.md:32

11. **An editor would not print «A casa em Portugal» as it stands: it holds one piece, and its opening talks about the study and the site's door, not the country.**
- «O estudo lê os preços … e cada atualização traz a sua data» and «A porta «Habitação» tem os números do país; o que se disser a seguir sobre a casa junta-se aqui» tell the reader nothing about housing in Portugal.
- «deste ano» is a relative date that will be wrong in 2027.
- The page repeats the study card already on the «Habitação» door.

Refs: built/dossies/a-casa-em-portugal/index.html:6, built/en/dossiers/a-casa-em-portugal/index.html:6, src/data/dossies.mjs:26, src/data/dossies.mjs:27, src/data/dossies.mjs:30

12. **A reader coming from the front page cannot tell in one glance what a dossier is.**
The word «Dossiê» never appears on the front page. The news box adds only a bare link with the dossier title after the type: «estudo · A casa em Portugal» right before the study link «A casa em Portugal e na Europa», and «estudo · O Orçamento de 2027» before «O Orçamento de 2027: o que muda e para quem». Two adjacent links with near-identical text go to different pages.
Refs: built/index.html:6, built/en/index.html:6, src/components/inicio/Novidades.astro:25

13. **The two-minute test fails on the Budget dossier's study card: «as dez linhas marcadas como invariantes pesam 1 210 milhões».**
A lay reader does not know what «invariantes» lines are, or whether 1 210 million is good or bad for the balance. The English «the ten lines the table marks as «invariante» (invariant)» is no clearer. The card's text predates this block but is reprinted on a new reader page.
Refs: built/dossies/orcamento-2027/index.html:6, built/en/dossiers/orcamento-2027/index.html:6

14. **The builder's reports carry a machine path with the user name (`<caminho>`) and `/tmp` paths.**
If the report is committed beside the block, as the seat commits builder reports, the repository privacy rule (no machine path, no user name) is broken.
Refs: relatorio-construtor.md:5, RELATORIO-PARAGEM-1.md:27, RELATORIO-PARAGEM-1.md:28, RELATORIO-PARAGEM-2.md:5, RELATORIO-PARAGEM-2.md:16

## Minor

15. **The report's site-index count «441 | 445» does not reproduce: the arithmetic and both stop reports give 444.**
`indiceDoSitio` adds one page (`dossies`) with two children per edition, which is 3 links. Both stop reports say 441 → 444, and the seat's number checker read line 24 as «441 | 444».
Refs: relatorio-construtor.md:24, numeros-do-relatorio.txt:10, RELATORIO-PARAGEM-1.md:20, RELATORIO-PARAGEM-2.md:21, src/lib/indice.mjs:296

16. **The dossier pages are not free of quotations, contrary to the block prompt's expectation.**
Each row below is a mention of a source's words, not a person's statement. The sealed attribution passage and the hosted copy are not in the package, so the exact words cannot be checked against any source.

| Words on page | Page | Ledger row | Speaker per page | Speaker per sealed passage / source | Framing | Exact words | Verdict |
|---|---|---|---|---|---|---|---|
| «líquidos» | PT Budget dossier (parcerias summary) | `oe-2027-ppp-rodoviario-encargos-liquidos-2027` | «O relatório do Orçamento» (chip: Ministério das Finanças) | not in package | gloss of a report term | unverifiable here | reprint identical to front page; not a statement |
| «net» | EN Budget dossier | same | same | not in package | gloss | English rendering of «líquidos», not the source's word | translated term inside guillemets |
| «invariante» | EN Budget dossier (study card) | study summary | «the table» | not in package | term mention | unverifiable here | pre-existing card |
| «Neste montante» | both Budget dossiers (correction reason) | `oe-2027-saude-contrato-programa-acss` | the Budget report | not in package | mention in the correction reason | matches the excerpt on the same page («Neste montante incluem-se…») | consistent with page; source unchecked |

«Habitação» and «Housing» are the site's door names and are excluded. The unquoted UTAO sentences are covered by finding 7.
Refs: built/dossies/orcamento-2027/index.html:6, built/en/dossiers/orcamento-2027/index.html:6

17. **The «a casa» voice exception is wider than adenda A allows.**
`voz-palavras.mjs` also exempts both housing opening paragraphs (`casa.abertura`). Adenda A limited the exception to the title, the scope and the «Dossiê: A casa em Portugal →» line. No plant covers the opening exemption.
Refs: scripts/voz-palavras.mjs:298, ADENDA-A.md:15, tests/voz/palavras-proibidas.mjs:69

18. **Some checks are vacuous on the present data.**
- `prendeNoDossie('/fora-dos-dossies')` is a map lookup that cannot fail, yet it is counted as one of the 16 plants.
- The news-box rule «no dossier link on a non-member entry» never runs: all five entries are dossier pieces, and no plant adds a stray link.
- `check:dossies` hard-codes that the housing dossier has no corrections section.
- Calendar ids are not validated at import time: my stub run accepted `calendario: ['nao-existe']`.

Refs: scripts/check-datas.mjs:489, tests/inicio/novidades.mjs:74, tests/dossies/dossies.mjs:68, src/data/dossies.mjs:44

19. **Dossier titles are inconsistent with the rest of the site.**
`<title>` and `og:title` are «O Orçamento de 2027» and «Os dossiês», without «· O Estado do País», which every other page has. The dossier meta description just repeats the title.
Refs: src/views/DossieView.astro:28, src/views/DossiesView.astro:10

20. **The calendar and corrections sections read raw.**
- The English page prints the Portuguese source line with its «|» separators and repeats the date.
- «As correções que tocaram este assunto» lists Eurostat debt «atualização» entries (2024, 2025) that are not corrections and are only loosely about the Budget.

Refs: src/views/DossieView.astro:37, src/lib/dossies-conteudo.mjs:48, built/en/dossiers/orcamento-2027/index.html:6

## «What is fine»

- **Package completeness:** no ledger row, `ITENS`, study, explanation, corrections or menu file is in the diff, so no hosted document was required and no `SEM-CORPOS-ALOJADOS.md` exists. I could not check the three tokens or the calendar excerpt against the ledger or a source, because neither is in the package (diff.patch:41058).
- **Copies against the diff:** 59 of the 60 copied files match their hunks line for line; only `src/data/dossies.mjs` differs (findings 4 and 5) (diff.patch:41063).
- **Data as in the diff:** the diff's `dossies.mjs` matches brief §2.1 (slugs, doors, pieces by layer, calendar), apart from the adenda A wording «Os textos abaixo». My stub run refused every mandated case (diff.patch:41064, brief.md:24).
- **Printed sentences:** titles, scopes, both openings and every section label match §3 verbatim in both editions. The only exception is the EN index scope (finding 6) (built/dossies/orcamento-2027/index.html:6).
- **Tokens:** the three tokens render with `data-de-linha` and `reference_date` (2027, 28.10.2026, 24.11.2026), each with a source chip (built/dossies/orcamento-2027/index.html:6).
- **Sections:** order is study, explainer, under discussion, calendar, corrections. The housing dossier omits the empty sections (built/dossies/a-casa-em-portugal/index.html:6).
- **Reused components:** the item summaries in the dossier are byte-identical to the front page's in both editions. The study cards are identical to the door cards (built/index.html:6, built/estado-e-economia/index.html:6).
- **«Dossiê: … →» lines:** present and pointing to the right dossier on the three items, both studies and the explanation, in both editions (built/o-que-se-discute/index.html:6, built/en/explainers/dinheiro-do-estado-2027/index.html:6).
- **News box:** all five entries name the right dossier, with the right link in both editions (built/en/index.html:6).
- **Doors and Temas:** «Estado e economia» and «Habitação» show «Dossiês» right before «Estudos». Temas lists the dossiers at the end. The other doors are covered by the `length > 0` condition in code, since their pages are not in the package (src/views/EntradaView.astro:58).
- **L1:** 3 456 → 3 458 reproduced from the base and DO1 measurement files; the new pages are `/dossies/orcamento-2027` and `/en/dossiers/orcamento-2027`. The ceiling file is updated (scripts/lugar-tetos-b1.json:2).
- **Inventory:** 2 478 declarations reproduced (59 `do1` rows, none duplicating an earlier sentence), so «before» is 2 419. The distinct-sentence totals (1 230 → 1 289) need the project's counter; only the +59 delta is consistent (design/especime-v3/INVENTARIO-FRASES.md:5202).
- **Plant counts:** 16 for `check:datas` (4 routes × 4) and 18 for `check:dossies` (6 + 12) match the code. `check:dossies` is in `verify` (package.json:75).
- **Other closed lists:** language strings exist in both editions (src/i18n/strings.mjs:15), and the builders' map has a DO1 section (design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md:784).
- **Interaction:** the pages are static links and chips, so there is no interactive control to type into, and nothing depends on JavaScript.
- **Measurements backed by an output folder and a `.codigo` file:** none in the package. Only `l1-base.json`, `l1-do1.json` and `selos-lado-a-lado.html` are present as files (design/especime-v3/medicoes/do1-2026-10-29/l1-do1.json:1).

**Editor's question:**
- **Budget dossier:** printable only after cutting the corrections section (house prose, raw ids, reprinted claims) and fixing the date line.
- **Housing dossier:** not printable as a page of its own.
- **Front page:** a reader does not learn what a dossier is.

Reader: Claude Opus 5.5. I ran read-only `grep`, `sed`, `diff`, `python3 -I -c` and one `node -e` evaluating `conferirDossies` in memory, and wrote no file.
