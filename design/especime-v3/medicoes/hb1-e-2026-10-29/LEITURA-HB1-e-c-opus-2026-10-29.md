# Leitura curta (M48) da correção HB1-e-b/c (Claude Opus 5.5, `leitor`, xhigh; 29.10.2026, 15:32 a 15:39 UTC; 39 chamadas de ferramenta)

*O relatório tal como o leitor o devolveu (em inglês), copiado pelo lugar de direção a 29.10.2026 às 15:45 UTC. O pacote: `_aterragens/pacote-hb1ec-2026-10-29`, com cinco plantas só nas cópias (Y1 a Y5). As cinco apanhadas: os achados 1 (Y1), 2 (Y2), 4 (Y3), 5 (Y5) e 6 (Y4). Os achados reais: Major 3 e 7; Minor 8 a 11. O leitor leu a adenda C como mandato da secção 11, por ela substituir o §3 da adenda B.*

Package completeness: complete. Both changed rows cite the hosted PDF (sha256 666bcd2f…); two copies of the PDF hash to that value; the request receipt and the `direitos/` folder are present; no `ledger/claims/*` file in either diff; no `SEM-CORPOS-ALOJADOS.md`.

## Blocking

1. (Planted.) The built Portuguese row page of `hab-ine-avaliacao-mediana` defines the median as the value with "one third of appraisals above and two thirds below", which is false. References: built/livro-razao/hab-ine-avaliacao-mediana/index.html:3, src/data/o-que-e-das-familias.mjs:22268, scripts/hb1-familias.py:200, ADENDA-B.md:9

2. (Planted.) The built English study page calls the 2,278 €/m² figure "the average bank appraisal", but INE publishes a median; every upstream file says «The median bank appraisal of homes»; 51 of 52 English blocks match the record and this is the only mismatch. References: built/en/studies/a-casa-em-portugal-e-na-europa/index.html:3, registos/a-casa-em-portugal-e-na-europa/en.record.json:4249, motor/diff.patch:389, ADENDA-B.md:19

## Major

3. **The new median definition says the figure is the median of appraisals made "in September 2026", but the INE methodology says the monthly result covers the reference month and the two months before it.** The methodology note in the hosted PDF: «Os resultados divulgados mensalmente têm por base as avaliações bancárias efetuadas no mês de referência e nos dois meses anteriores … refletem um comportamento associado aos dados de um trimestre»; for September «foram consideradas 32 597 avaliações». The definition prints «as avaliações que os bancos fizeram às casas em setembro de 2026» / «the appraisals banks made of homes in September 2026», misstating the population and period in both editions. The wording is the mandate's; the builder implemented it faithfully. The homologous definition is unaffected. References: ADENDA-B.md:9, scripts/hb1-familias.py:200, :201, src/data/o-que-e-das-familias.mjs:22257, :22260, built/en/ledger/hab-ine-avaliacao-mediana/index.html:3, motor/fonte/hb1e-ine-avaliacao-2026-09.pdf (Nota metodológica)

4. (Planted.) The copied Portuguese engine template says the bank appraisal came out "before" the two INE releases, while the diff adds "after"; the ledger dates make «antes» wrong (27.10 after 21.10 and 23.10). References: motor/content/28 Habitacao Estudo/Technical Source/documento.pt.md.tmpl:63, motor/diff.patch:417

5. (Planted.) The copied composer prunes with `every` where the diff adds `some`, so an audit entry mixing HB1 and non-HB1 keys would survive, and the plant cannot tell the two apart. References: scripts/compor-familias-hb1.mjs:37, diff.patch:741, ADENDA-B.md:32

6. (Planted.) The builder's report gives the traverse count as 189 where its own detailed report, the seat's extraction and the addendum say 191. References: relatorio-construtor.md:7, numeros-do-relatorio.txt:9, brief.md:10

7. **No gate code or measurement in the report is backed by a file in the package, and no full gate run exists for these heads.** The report names a temporary folder with 25 `.codigo` files; none is in the package; `registos-dos-portoes.json` lists nothing and `linhas-dos-portoes.json` is `[]`; 5 of 6 report numbers have no file. References: design/especime-v3/medicoes/hb1-e-2026-10-29/adendas-b-c.md:63, :17, :102, registos-dos-portoes.json:1, numeros-do-relatorio.txt:7, relatorio-construtor.md:11

## Minor

8. **Even with `some`, the composer does not remove the audit entry of a family whose key was actually renamed, and the plant does not test that case** (`keys` built only from the current `FAMILIAS_HB1`; the plant models merged keys). On the current data there is no stale entry (1127 → 1127). References: scripts/compor-familias-hb1.mjs:16, :36, :41, ADENDA-B.md:32

9. **The factual half of each new definition is not checked against any source**: the composer checks only `partes[].apoios` (the literals in the excerpt); the `complemento` text carries the claims (credit to buy, half above and below, €/m², same month a year earlier) with no support and no assertion. References: scripts/hb1-familias.py:213, scripts/compor-familias-hb1.mjs:21, :25, design/especime-v3/INVENTARIO-FRASES.md:5183

10. The inventory count «2419: 1231 vivas, 1186 retiradas, duas condicionais» does not reproduce (1231, 1172 and 2 counted, 2405). References: design/especime-v3/medicoes/hb1-e-2026-10-29/adendas-b-c.md:16, design/especime-v3/INVENTARIO-FRASES.md:5178

11. **An editor would not print the section 11 Budget clause as it stands**: on a page dated 29.10.2026, «teve o debate e a votação na generalidade marcados para 27 e 28 de outubro» tells only that a vote was scheduled, and nothing on the page links to the result. References: brief.md:7, :8, registos/a-casa-em-portugal-e-na-europa/pt.record.json:6144

Editor's verdict: the Portuguese median page not until finding 1 (planted) is undone; the other three row pages once the «em setembro» period of finding 3 is corrected; section 6 in Portuguese as it stands and in English once finding 2 (planted) is undone; section 11 in both editions after rewriting the Budget clause.

## «What is fine»

The hosted body matches byte for byte, with the receipt and five rights files. Every line the diff adds exists in its copied file except the two planted ones (16 site files, 13 engine files). The site records equal the engine records; every value and period token slices its `inicio`/`fim` exactly (531 PT, 536 EN); the manifests' hashes match. Section 6 in Portuguese and section 11 in both editions are word for word addendum B §2 and addendum C §1; the tokens render 2 278, setembro de 2026, 14,2, 21.10.2026 and 23.10.2026. The section 11 facts reproduce from the ledger (published 2026-10-21 and 2026-10-23, equal to the calendar values; the appraisal followed on 2026-10-27; «most recent INE readings» holds). Nothing else in the study text changed. Three of the four built row pages print addendum B §1 exactly; the source words are on page 1 of the PDF. The audit file reproduces the report's claim (1127 entries, 194 families, only the two avaliação entries changed). The inventory carries the four sentences and four definitions as «viva» and the old ones as «retirada», 16 in total. The block adds no quotation attributed to a person, party or institution.
