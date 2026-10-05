# Leitura a frio do bloco RP4, o ensaio M51 · Codex `gpt-6.1-sol`, raciocínio `high`

*Uma das quatro leituras do ensaio M51 de 05.10.2026 (as leituras a frio por modelo e esforço), sobre o mesmo pacote que o Opus leu (de `61519cea` a `053a4077`, os cinco estragos de `LEITURA-RP4-2026-10-05.plantas.json`), em sessão nova e só de leitura, pelo `ler-ensaio.sh` (a cópia do `ler.sh` com o esforço por variável). Custo pela linha «tokens used»: 288,905 símbolos; 07:27:07 a 07:41:41 UTC. A tabela comparativa e as decisões estão na M51 do registo das melhorias e na §1.161. O texto fica como o leitor o escreveu.*

## A leitura, como o leitor a entregou

## Blocking

1. **F21 silently discards coordinate failures, and its plants bypass that weakened gate.** The copied runner reports only detector messages containing `marca`; coordinate, identity, title and static-attribute failures are discarded. The diff forwards every failure. Plants call `conferirSerie()` directly, so a displaced-point plant can “bite” without proving that the runner rejects a displaced drawing.
   
   scripts/check-formas.mjs:545, tests/formas/serie-do-pais.mjs:24, tests/formas/serie-do-pais.mjs:79, diff.patch:299

2. **The copied module connects points across declared gaps and contradicts both the diff and the built poverty chart.** It computes `p.quebra` but ignores it when assembling segments; the diff includes that condition. An isolated execution with annual points `2015=1`, `2017=3` and a declared `2016` gap returned one segment, `48,117.333 342,12`, instead of two. The built poverty card has separate segments containing seven and twenty-two points, which this copied module cannot produce. The existing gap assertion would reject the copied implementation, so the saved nine passing proofs do not establish its correctness.
   
   src/lib/formas/serie-do-pais.mjs:65, src/lib/formas/serie-do-pais.mjs:108, diff.patch:774, built/salarios-pensoes-e-apoios/index.html:5, tests/formas/serie-do-pais.mjs:110, design/especime-v3/medicoes/rp4-2026-10-04/plantas.json:116

3. **The copied first-page declaration selects food inflation instead of overall inflation.** It declares `serie-ipc-alimentacao-variacao-homologa`; the diff declares `serie-ipc-variacao-homologa`. Both built first pages still contain the overall-inflation chart and its receipt link. Rebuilding from the copied declaration would therefore change the delivered figure, and the first-page cell would reject its series identity.
   
   src/data/primeira-pagina.mjs:78, diff.patch:535, built/index.html:5, built/en/index.html:5, tests/inicio/serie-do-bloco.mjs:16

## Major

4. **The report’s complete bilingual, ledger-backed verification cannot be reproduced from this package.** The supplied HTML contains seventeen charts and five series receipts; the saved summaries describe fifty-six charts and thirty-two receipts. Their summary arithmetic is consistent, but the underlying ledger files are absent, preventing independent reproduction of the 4,131-point preservation claim, the EU row’s `Annual rate of change` excerpt, its verification status and its last-point comparison. The promised English pay page is also absent: the supplied pages demonstrate seven distinct Portuguese series cards but only three English ones. The sixty capture records can be counted, but the explicitly excluded images and inaccessible repository prevent verification of their existence or visual results. The three copied-code discrepancies above also prevent treating the historical green records as verification of these copies.
   
   relatorio-construtor.md:11, relatorio-construtor.md:18, relatorio-construtor.md:36, relatorio-construtor.md:44, src/data/unidades-dos-cartoes.mjs:249, tests/series/series.mjs:255, design/especime-v3/medicoes/rp4-2026-10-04/geometria-e-tabelas.json:3

5. **The Portuguese CPI receipt does not explain what `0,8059` or `103,276` means relative to its reference.** It supplies the term `índice (base 2025 = 100)` and the monthly values, without explaining in ordinary words how to interpret a value below or above one hundred. A reader unfamiliar with index numbers must supply that knowledge to understand the chart and table.
   
   built/livro-razao/series/serie-ipc-indice/index.html:4

6. **The English CPI receipt leaves the unit in Portuguese and does not explain `0,8059` or `103,276` relative to its reference.** Its English metadata prints `índice (base 2025 = 100)`. It provides no plain-language explanation of what the reference represents or what values above and below it mean, so the English reader faces both an untranslated unit and an unexplained numerical convention.
   
   built/en/ledger/series/serie-ipc-indice/index.html:4

## Minor

7. **The report’s “7 of 8” K20 result contradicts its evidence.** All eight card plants in `plantas.json` record `mordeu: true`. `medidas.json` likewise records eight plants and eight bites, so the report’s acceptance table misstates the result.
   
   relatorio-construtor.md:19, design/especime-v3/medicoes/rp4-2026-10-04/plantas.json:140, design/especime-v3/medicoes/rp4-2026-10-04/medidas.json:80

8. **The package’s report-check summary disagrees with both saved checker outputs.** `numeros-do-relatorio.txt` says thirteen JSON files were read and names known-positive `987654322`. The saved JSON and log say twelve files and `987654321`. The common zero exit code does not resolve those contradictory accounts.
   
   numeros-do-relatorio.txt:3, numeros-do-relatorio.txt:4, design/especime-v3/medicoes/rp4-2026-10-04/conferencia-relatorio.json:4, design/especime-v3/medicoes/rp4-2026-10-04/conferencia-relatorio.json:7, design/especime-v3/medicoes/rp4-2026-10-04/conferencia-relatorio.log:3

## «What is fine»

9. Both CPI receipts contain 944 unique point keys across seventy-nine annual rows and twelve monthly columns, with matching values between editions; recalculation from the built table gives `48,169.151` for January 1948, `195.156,142.889` for May 1987 and `342,61.216` for August 2026, matching both SVGs, although this is internal consistency rather than ledger verification. built/livro-razao/series/serie-ipc-indice/index.html:4, built/en/ledger/series/serie-ipc-indice/index.html:4, src/lib/formas/serie-do-pais.mjs:82

10. All seventeen supplied series SVGs contain no script, have digit-free titles, and place every numeric text label under `data-nonledger="escala-de-instrumento"`. built/index.html:5, built/en/index.html:5, built/precos/index.html:5, built/en/prices/index.html:5, built/salarios-pensoes-e-apoios/index.html:5, built/livro-razao/series/serie-ipc-indice/index.html:4, built/en/ledger/series/serie-ipc-indice/index.html:4, built/livro-razao/series/serie-pensao-media-anual/index.html:4, built/en/ledger/series/serie-pensao-media-anual/index.html:4, built/livro-razao/series/serie-remuneracao-bruta-mensal-media/index.html:4

11. The new EU reading obtains its period and value through structured pieces, has an audit entry, and repeats the same August 2026 figure, `3,2 %`, already shown in Portugal’s European-comparison card in both editions. src/data/leitura-ihpc-uniao.mjs:10, src/data/leitura-ihpc-uniao.mjs:16, tests/cartao/leituras-provadas.json:6436, built/precos/index.html:5, built/en/prices/index.html:5

12. Synthetic execution confirms determinism, common-base indexing, refusal of different units in `unidade` mode, and refusal of absent or zero bases. src/lib/formas/serie-do-pais.mjs:15, src/lib/formas/serie-do-pais.mjs:47, src/lib/formas/serie-do-pais.mjs:54

13. The saved build, verify and typecheck codes are zero, their recorded durations reproduce as 165, 992 and zero seconds, and the report checker’s saved code is zero. design/especime-v3/medicoes/rp4-2026-10-04/portoes/build.codigo:1, design/especime-v3/medicoes/rp4-2026-10-04/portoes/verify.codigo:1, design/especime-v3/medicoes/rp4-2026-10-04/portoes/typecheck.codigo:1, design/especime-v3/medicoes/rp4-2026-10-04/medidas.json:173, design/especime-v3/medicoes/rp4-2026-10-04/conferencia-relatorio.codigo:1