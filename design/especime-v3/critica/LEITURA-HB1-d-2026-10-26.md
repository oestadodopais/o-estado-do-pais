# A leitura curta da aterragem HB1-d (cobre também a HB1-g) por duas famílias do Codex, 26.10.2026: o par medido Astra medium e Luna medium

*O pacote montado por `pacote.sh` do sítio `3c6ceb619` a `4d782e753` (as 98 secções que `main` trouxe, os registos de 22.10 e o painel semanal de 26.10, retiradas do diff e listadas em `RETIRADO-DO-PACOTE.md`) e do motor `7635564` a `8c0493f`: 492 ficheiros, 4 corpos alojados conferidos pelo sha256, 202 páginas construídas. Cinco plantas registadas por sha256 (`pacote-hb1d-2026-10-26.plantas.json`, fora do repositório): Z1 o valor do Porto na linha do sítio (3 846 para 3 864); Z2 a data de publicação da taxa implícita no livro do motor (21 para 22 de outubro); Z3 a contagem das capturas a 390 px no relatório (12 para 14); Z4 a frase da secção 11 na página construída em português invertida («ainda não estão nesta edição»); Z5 o predicado `paginaSoComEdicao` sem a condição do período. O prompt do bloco: `PROMPT-leitura-hb1-d.md` (fora do repositório), com o prompt comum copiado para o pacote. O Gemini 4 Argon não leu: a quota individual do Antigravity esgotou-se às 15:01 UTC nas leituras do OG1.*

**O Codex `gpt-6-astra` a `medium`** (`ler.sh`, das 15:29:39 às 15:38:00 UTC, 178 292 símbolos): **cinco plantas em cinco com as provas** (os achados 1, 2, 3, 4 e 7). Dois Major reais: o 5 (o JSON-LD das páginas do estudo sem `datePublished` e o documento sem a data) e o 6 (a frase da taxa de juro implícita na secção 6 sem dizer o que a medida é nem que subiu). Três Minor reais: o 8 (`medidas-b.json` com procuras a `null` que o relatório apresenta como medidas), o 9 (afirmações do relatório sem prova no pacote), o 10 (os recibos ingleses com vírgula decimal, «2,2 times» e «3,194 %», e o relatório a dizer «2.2»). O editor não imprimia sem a correção da planta Z4 e sem a frase da taxa explicada.

**O Codex `gpt-6-luna` a `medium`** (`ler.sh`, das 15:29:39 às 15:31:04 UTC, 91 515 símbolos): **duas plantas em cinco** (a Z5 e a Z1), sem ver a data (Z2), a contagem (Z3) nem a frase invertida (Z4); um Major real repetido (o `datePublished`) e um Minor. O guião `conferir-leitura.py` (identificadores citados contra o pacote): as duas leituras citam caminhos e linhas, nenhum identificador em crases; nenhum ficheiro inventado.

**As decisões do lugar de direção.** As cinco plantas eram do lugar de direção. O Major 5 não é desta passagem: nenhum estudo do sítio traz `datePublished` no JSON-LD nem a data no documento, e o contrato HB1-30 só exige que, se existir, bata com a data declarada; o mandato pediu-o por erro do lugar de direção; entra na higiene como melhoria do sítio inteiro (o JSON-LD dos estudos com publicação declarada ganha `datePublished`). O Major 6 é editorial e verdadeiro: a frase da secção 6 passa a dizer que a taxa subiu (os 3,2 pontos base estão no excerto da linha) e o que a medida é (a definição selada do INE), na atualização datada do estudo desta semana, com as notícias da habitação; não trava a aterragem, porque o número está certo, com o seu recibo e a definição a um toque. Os Minor 8 e 10 vão para a higiene (o `medir-b.py` lê as frases com os selos; a vírgula decimal inglesa já estava na lista); o 9 é do pacote. O Luna a medium sai da lista dos leitores deste tipo de pacote (duas plantas em cinco); o Astra a medium entra no quadro da §1.177 como leitor de passagens de edição com pacote grande: cinco em cinco, oito minutos, 178 mil símbolos.

---

## A leitura do Codex gpt-6-astra (medium)

## Blocking

None established. The required new INE bodies and request receipts are present, and their SHA-256 hashes match the four source-bearing rows.

## Major

1. **The Portuguese study’s calendar falsely says the new INE figures are not in this edition (planted defect).** Section 11 prints “ainda não estão nesta edição”, although its summary and sections 1 and 6 already print the Q2 prices and September interest rate. The Portuguese document and English study correctly say the figures are already included. The Portuguese page therefore contradicts itself, its companion document, the other edition and the report.
   
   References: `built/estudos/a-casa-em-portugal-e-na-europa/index.html:3`, `built/estudos/a-casa-em-portugal-e-na-europa/documento/index.html:114`, `built/en/studies/a-casa-em-portugal-e-na-europa/index.html:3`, `relatorio-construtor.md:718`

2. **The site’s Porto row changes the source value from €3,846/m² to €3,864/m² (planted defect).** I opened `Trimestral1_N2024.csv` inside the ZIP: row 22 identifies `11A1312;Porto`, and column 3, headed `2ºT2026`, contains `3 846`. The extraction specification, engine row, YAML excerpt and both built receipts agree on 3,846; only the YAML value says 3,864. The copied YAML also contradicts the diff, which adds the correct 3,846.
   
   References: `motor/content/23 Habitacao/extracoes.json:52795`, `motor/content/23 Habitacao/ledger.json:117934`, `ledger/claims/hab-ine-preco-porto.yml:9`, `ledger/claims/hab-ine-preco-porto.yml:32`, `diff.patch:5342`, `built/en/ledger/hab-ine-preco-porto/index.html:3`

3. **The engine assigns the interest-rate release the wrong publication date, 22 October instead of 21 October (planted defect).** Page 1 of the hosted PDF and the hosted release page say 21 October 2026. The extraction specification, site YAML and both built receipts also use 21 October; the engine’s `published_at` alone says `2026-10-22`, even while its own documentary check records 21 October. The engine diff adds 21 October, so the supplied engine file also fails the diff-to-copy comparison.
   
   References: `motor/content/23 Habitacao/ledger.json:113429`, `motor/content/23 Habitacao/extracoes.json:50042`, `motor/content/23 Habitacao/source/hb1d-ine-juro-2026-09.html:700`, `ledger/claims/hab-ine-juro-implicito.yml:29`, `motor/diff.patch:506`, `built/livro-razao/hab-ine-juro-implicito/index.html:3`

4. **The supplied HB1-g predicate incorrectly accepts rows that have a data period (planted defect).** The copied implementation omits `!claim.period`, although the diff and independently recounted gate retain it. Evaluating the supplied function on the report’s three cases produces `[true, true, false]`, not `[true, false, false]`: a dated `last-edited` row with a period now qualifies for suppressing its edition and replacing its period with an edit date. The test would catch this regression at its explicit `assert(!paginaSoComEdicao(comPeriodo))`; its old-description, old-excerpt and old-JSON checks also address the previous presentation. The gate’s exact comparisons remain intact, but the stored green result cannot certify this supplied implementation.
   
   References: `src/lib/ledger.mjs:717`, `diff.patch:9423`, `scripts/incorporar-do-portao.mjs:49`, `tests/hb1/pagina-editada.mjs:84`, `tests/hb1/pagina-editada.mjs:90`, `relatorio-construtor.md:690`, `design/especime-v3/medicoes/hb1-2026-10-21/hb1g/codigos/pagina-editada.code:1`

5. **Both editions fail the explicit publication requirements for machine-readable dates and document dating.** Both study pages display 26.10.2026 and declare `creativeWorkStatus: "Published"`, but neither Article JSON-LD contains `datePublished`. Both standalone documents contain neither the publication date nor publication JSON-LD. The report acknowledges these omissions; saying other studies also omit them does not satisfy this mandate.
   
   References: `brief.md:47`, `built/estudos/a-casa-em-portugal-e-na-europa/index.html:1`, `built/en/studies/a-casa-em-portugal-e-na-europa/index.html:1`, `built/estudos/a-casa-em-portugal-e-na-europa/documento/index.html:55`, `built/en/studies/a-casa-em-portugal-e-na-europa/document/index.html:55`, `relatorio-construtor.md:725`

6. **Neither edition is ready to print unchanged in a daily newspaper because the credit paragraph leaves its principal rate unexplained.** Section 6 gives 3.194% as an “implicit interest rate” without explaining what that measures or whether it rose or fell. The receipt supplies a definition, and the source excerpt supplies the increase, but the study paragraph supplies neither. I would rewrite that paragraph in both editions to explain the measure and movement; the Portuguese calendar also requires the factual correction in finding 1.
   
   References: `built/estudos/a-casa-em-portugal-e-na-europa/index.html:3`, `built/en/studies/a-casa-em-portugal-e-na-europa/index.html:3`, `built/estudos/a-casa-em-portugal-e-na-europa/documento/index.html:95`, `built/en/studies/a-casa-em-portugal-e-na-europa/document/index.html:95`, `ledger/claims/hab-ine-juro-implicito.yml:33`

## Minor

7. **The report claims 14 captures where the second manifest contains 12 (planted defect).** The manifest contains eight receipt captures, two chart captures and two homepage captures: twelve. The cost file independently says twelve, while the report says fourteen. The first manifest’s twenty captures and 120 crops do reproduce.
   
   References: `relatorio-construtor.md:735`, `design/especime-v3/medicoes/hb1-2026-10-21/hb1d/capturas-d-recibos.json:9`, `design/especime-v3/medicoes/hb1-2026-10-21/hb1d/capturas-d-recibos.json:256`, `design/especime-v3/medicoes/hb1-2026-10-21/custo-2026-10-22.json:210`

8. **The claimed automated verification of the ratio sentence and English receipt values contains unsuccessful searches.** `medidas-b.json` records `null` for both ratio-sentence searches and all four English INE receipt-value searches. The measuring script records missing matches without failing, and its ratio search does not account for the intervening source labels in the rendered text. Direct inspection establishes that the ratio sentence exists, but these saved measurements do not establish what the report attributes to them.
   
   References: `design/especime-v3/medicoes/hb1-2026-10-21/hb1d/medidas-b.json:74`, `design/especime-v3/medicoes/hb1-2026-10-21/hb1d/medidas-b.json:146`, `design/especime-v3/medicoes/hb1-2026-10-21/hb1d/medidas-b.json:363`, `design/especime-v3/medicoes/hb1-2026-10-21/hb1d/medir-b.py:21`, `design/especime-v3/medicoes/hb1-2026-10-21/hb1d/medir-b.py:59`, `relatorio-construtor.md:723`

9. **Several historical and publication claims cannot be independently reproduced from the supplied evidence.** The package lacks `src/data/datas-de-publicacao.json`, so the asserted Git-entry date of 20 October cannot be checked against that file. It also lacks the homepage and housing-door HTML, the HB1-g before/after builds and its two receipt pages, leaving their claimed results supported by saved measurements rather than the underlying artifacts. The tool-call totals, earlier failed-run timings and conflict-free merge likewise lack their underlying logs or Git history; these remain unverified claims, not demonstrated failures.
   
   References: `relatorio-construtor.md:690`, `relatorio-construtor.md:702`, `relatorio-construtor.md:712`, `relatorio-construtor.md:723`, `relatorio-construtor.md:727`, `relatorio-construtor.md:729`, `relatorio-construtor.md:739`

10. **The English receipts retain Portuguese decimal punctuation, contrary to the report’s presentation of the ratio.** The English ratio receipt’s principal value is `2,2 times`, and the interest receipt prints `3,194 %`; the English study uses `2.2` and `3.194`. These are formatting inconsistencies, not different calculated values, but the report’s claim that the ratio receipt prints `2.2` is inaccurate.
   
   References: `built/en/ledger/der-hab-preco-lisboa-vs-portugal/index.html:3`, `built/en/ledger/hab-ine-juro-implicito/index.html:3`, `built/en/studies/a-casa-em-portugal-e-na-europa/document/index.html:83`, `built/en/studies/a-casa-em-portugal-e-na-europa/document/index.html:95`, `relatorio-construtor.md:723`

## «What is fine»

11. **The source package passes the required body-and-receipt completeness check:** all five new INE bodies have matching hashes and request receipts, including the PDFs and ZIP cited by the four changed rows. References: `motor/CORPOS-ALOJADOS.md:46`, `ledger/claims/hab-ine-preco-mediano.yml:24`, `ledger/claims/hab-ine-preco-porto.yml:24`, `ledger/claims/hab-ine-juro-implicito.yml:24`, `motor/content/23 Habitacao/source/hb1d-ine-juro-2026-09.pdf.pedido.json:4`

12. **The source reading confirms Portugal €2,445/m², Lisbon €5,299/m² and Porto €3,846/m² for Q2 2026, plus 3.194% for September 2026, and all eight built receipts preserve the corresponding source excerpts and hashes.** References: `motor/content/23 Habitacao/ledger.json:113350`, `motor/content/23 Habitacao/ledger.json:116811`, `motor/content/23 Habitacao/ledger.json:117934`, `ledger/claims/hab-ine-juro-implicito.yml:33`, `built/livro-razao/hab-ine-preco-mediano/index.html:3`, `built/en/ledger/hab-ine-preco-lisboa/index.html:3`

13. **The derived sale-price ratio reproduces as 5,299 ÷ 2,445 = 2.167280…, rounded to 2.2, in the engine, site row and both built study sentences.** References: `motor/content/23 Habitacao/ledger.json:118366`, `ledger/claims/der-hab-preco-lisboa-vs-portugal.yml:25`, `built/estudos/a-casa-em-portugal-e-na-europa/index.html:3`, `built/en/studies/a-casa-em-portugal-e-na-europa/index.html:3`

14. **Apart from the Portuguese calendar defect, the requested INE sentences carry the new values and periods, and the calendar wording claims announced dates and inclusion without inventing a publication hour.** References: `motor/content/28 Habitacao Estudo/Technical Source/documento.pt.md.tmpl:30`, `motor/content/28 Habitacao Estudo/Technical Source/documento.pt.md.tmpl:43`, `motor/content/23 Habitacao/ledger.json:117263`, `motor/content/23 Habitacao/ledger.json:117330`, `built/en/studies/a-casa-em-portugal-e-na-europa/document/index.html:114`

15. **The publication counts reproduce as 19 studies and 29 editions, versus 18 and 27 with housing returned to preparation, and each counter has one new typed update with both language reasons.** References: `src/data/studies.mjs:127`, `src/data/studies.mjs:890`, `src/data/studies.mjs:898`, `ledger/claims/edicoes-publicadas.yml:46`, `ledger/claims/estudos-publicados.yml:46`

16. **Both archive editions list the housing study with 26.10.2026, consistently with its declared publication date.** References: `src/data/studies.mjs:132`, `src/data/studies.mjs:138`, `built/estudos/index.html:3`, `built/en/studies/index.html:3`

17. **No fabricated correction entry appears on the five reexported rows, and the supplied diff shows no other value changes beyond those five and the two counters with recorded updates.** References: `ledger/claims/hab-ine-preco-mediano.yml:51`, `ledger/claims/hab-ine-preco-lisboa.yml:51`, `ledger/claims/hab-ine-preco-porto.yml:50`, `ledger/claims/hab-ine-juro-implicito.yml:51`, `ledger/claims/der-hab-preco-lisboa-vs-portugal.yml:38`, `ledger/claims/edicoes-publicadas.yml:46`, `ledger/claims/estudos-publicados.yml:46`

18. **The saved full-run evidence consistently records 51 steps, 2,016 seconds and one failed labels check, followed by a separately recorded successful labels rerun.** References: `design/especime-v3/medicoes/hb1-2026-10-21/hb1d/conferir-tudo/resumo.md:1`, `design/especime-v3/medicoes/hb1-2026-10-21/hb1d/conferir-tudo/42-check_rotulos.code:1`, `design/especime-v3/medicoes/hb1-2026-10-21/hb1d/codigos/d-check-rotulos.code:1`

---

## A leitura do Codex gpt-6-luna (medium)

## Blocking

None. The package’s hosted-body inventory includes the source documents and request receipts needed to check the four INE rows. The hosted Q2 ZIP’s SHA-256 matches the declared hash, and its Porto CSV row is available for direct comparison.  
`motor/CORPOS-ALOJADOS.md:1`, `motor/content/23 Habitacao/source/hb1d-ine-precos-q2.zip.pedido.json:1`, `ledger/claims/hab-ine-preco-porto.yml:24`

## Major

1. **The HB1-g predicate now accepts a dated row that has a data period, weakening the old gate, and the test shown in the package would catch it.** The old predicate required `!claim.period`; the new `paginaSoComEdicao` checks only `published_at_kind` and `published_at`. The test adds a period to an edited-page row and asserts that the predicate is false, but this implementation returns true, so the test should fail before it reaches its plants. That contradicts the report’s claim that the full run passed with the test’s 20 plants.  
`diff.patch:9480`, `src/lib/ledger.mjs:716`, `tests/hb1/pagina-editada.mjs:89`, `design/especime-v3/medicoes/hb1-2026-10-21/hb1d/conferir-tudo/resumo.md:45`, `relatorio-construtor.md:731`

2. **The site’s Porto row gives the wrong value, 3 864 instead of 3 846.** The hosted CSV’s Porto row for `2ºT2026` says 3 846; the engine ledger and the built receipts use 3 846, but `ledger/claims/hab-ine-preco-porto.yml` says 3 864. This breaks the chain the brief requires, even though the study prose prints 3 846. I would not print the page while its public source row contradicts the figure in the study.  
`motor/content/23 Habitacao/source/hb1d-ine-precos-q2.zip:1`, `motor/content/23 Habitacao/ledger.json:117934`, `ledger/claims/hab-ine-preco-porto.yml:9`, `ledger/claims/hab-ine-preco-porto.yml:32`, `built/livro-razao/hab-ine-preco-porto/index.html:1`, `relatorio-construtor.md:710`

3. **The publication date is missing from both document editions, and `datePublished` is absent from both study pages’ JSON-LD.** The report itself acknowledges both omissions, while the mandate requires the built study page and document to print the date and the JSON-LD to carry `datePublished`. The study page displays the declared date and published status, but that does not satisfy the missing document and structured-data requirements.  
`relatorio-construtor.md:723`, `relatorio-construtor.md:725`, `built/estudos/a-casa-em-portugal-e-na-europa/index.html:1`, `built/estudos/a-casa-em-portugal-e-na-europa/documento/index.html:1`, `built/en/studies/a-casa-em-portugal-e-na-europa/index.html:1`, `built/en/studies/a-casa-em-portugal-e-na-europa/document/index.html:1`

## Minor

1. **The report’s HB1-d account is not fully supported by the supplied files.** It attributes measurements to `medidas-a.json` and `medidas-b.json`, but those files show measurements rather than the commands or raw comparisons that reproduce every stated result. The report does provide the main composed sentences and the full-run summary, but claims such as the complete list of nine pages with no “in preparation” label remain report assertions in the inspected evidence.  
`relatorio-construtor.md:706`, `relatorio-construtor.md:723`, `design/especime-v3/medicoes/hb1-2026-10-21/hb1d/medidas-a.json:1`, `design/especime-v3/medicoes/hb1-2026-10-21/hb1d/medidas-b.json:1`

## «What is fine»

1. **The median, Lisbon and implicit-rate values, dates, periods, and excerpts agree with their hosted PDFs and the declared hashes.** The Q2 price PDF says 2 445 for Portugal and 5 299 for Lisbon in the cited paragraphs; the September rate PDF says 3,194 and carries the 21 October date. The engine ledger and site claims carry those same values and excerpts.  
`motor/content/23 Habitacao/source/hb1d-ine-precos-q2.pdf:1`, `motor/content/23 Habitacao/source/hb1d-ine-juro-2026-09.pdf:1`, `ledger/claims/hab-ine-preco-mediano.yml:24`, `ledger/claims/hab-ine-preco-mediano.yml:29`, `ledger/claims/hab-ine-preco-mediano.yml:33`, `ledger/claims/hab-ine-preco-lisboa.yml:24`, `ledger/claims/hab-ine-preco-lisboa.yml:33`, `ledger/claims/hab-ine-juro-implicito.yml:24`, `ledger/claims/hab-ine-juro-implicito.yml:29`, `ledger/claims/hab-ine-juro-implicito.yml:33`

2. **The ratio 5 299 / 2 445 rounds to 2.2, and the engine, site claim, and study prose use that result.** The ratio row records the inputs and calculation; both editions’ study text says 2.2.  
`ledger/claims/der-hab-preco-lisboa-vs-portugal.yml:9`, `ledger/claims/der-hab-preco-lisboa-vs-portugal.yml:35`, `built/estudos/a-casa-em-portugal-e-na-europa/documento/index.html:83`, `built/en/studies/a-casa-em-portugal-e-na-europa/document/index.html:83`

3. **The rewritten calendar sentence is limited to announced dates and the fact that the figures are in this edition.** It does not claim an hour or assert when publication occurred; the two editions’ documents contain the sentence.  
`built/estudos/a-casa-em-portugal-e-na-europa/documento/index.html:114`, `built/en/studies/a-casa-em-portugal-e-na-europa/document/index.html:114`

4. **The five changed rows have no fabricated correction entries, and the report says no other value changed without an entry.** The four site claims show empty correction histories; the ratio claim is derived and records its calculation. The report says these rows had not reached the public site and were therefore rewritten without corrections.  
`ledger/claims/hab-ine-preco-mediano.yml:50`, `ledger/claims/hab-ine-preco-lisboa.yml:50`, `ledger/claims/hab-ine-preco-porto.yml:49`, `ledger/claims/hab-ine-juro-implicito.yml:50`, `ledger/claims/der-hab-preco-lisboa-vs-portugal.yml:35`, `relatorio-construtor.md:710`

5. **The counter rows reproduce 29 editions and 19 studies, each with a typed 26 October update and reasons; the report says the corrections counter stays at 12.**  
`ledger/claims/edicoes-publicadas.yml:7`, `ledger/claims/edicoes-publicadas.yml:46`, `ledger/claims/edicoes-publicadas.yml:50`, `ledger/claims/estudos-publicados.yml:7`, `ledger/claims/estudos-publicados.yml:46`, `ledger/claims/estudos-publicados.yml:50`, `relatorio-construtor.md:710`

6. **The reported date change does not precede the study’s declared Git-entry date.** The study editions declare 26 October 2026; the report records their entry date as 20 October 2026.  
`src/data/studies.mjs:132`, `src/data/studies.mjs:138`, `relatorio-construtor.md:712`