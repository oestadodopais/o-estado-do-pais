# Leitura a frio do bloco RP4, o ensaio M51 · Codex `gpt-6-astra`, raciocínio `high`

*Uma das quatro leituras do ensaio M51 de 05.10.2026 (as leituras a frio por modelo e esforço), sobre o mesmo pacote que o Opus leu (de `61519cea` a `053a4077`, os cinco estragos de `LEITURA-RP4-2026-10-05.plantas.json`), em sessão nova e só de leitura, pelo `ler-ensaio.sh` (a cópia do `ler.sh` com o esforço por variável). Custo pela linha «tokens used»: 119,045 símbolos; 07:27:07 a 07:39:44 UTC. A tabela comparativa e as decisões estão na M51 do registo das melhorias e na §1.161. O texto fica como o leitor o escreveu.*

## A leitura, como o leitor a entregou

## Blocking

1. **The Portuguese inflation card plots a different first value from the English card and both homepages.** Its first coordinate is `48,45.981`; the English card has `48,44.981`, with identical dimensions and scale marks. Rescaling the homepage’s first ordinate gives `130 − (170 − 56.161) × 118/158 = 44.981`, confirming the discrepancy in the Portuguese card. The remaining coordinates agree between the two price-page charts.  
References: built/precos/index.html:5, built/en/prices/index.html:5, built/index.html:5, src/lib/formas/serie-do-pais.mjs:82

2. **The copied F21 gate silently discards coordinate errors and most other failures it promises to reject.** Line 545 reports only messages containing `marca`, whereas the diff reports every error. Coordinate mismatches, scripts, transformations, altered line classes and incorrect titles do not contain that substring. The plants call `conferirSerie()` directly, bypassing this filter: their recorded success therefore does not prove that the gate rejects those defects. Applying the filter to the recorded plant messages retains only two of fourteen.  
References: scripts/check-formas.mjs:545, diff.patch:299, tests/formas/serie-do-pais.mjs:23, tests/formas/serie-do-pais.mjs:77

3. **The copied module joins points across declared gaps instead of breaking the line.** It computes `p.quebra` but never uses it when starting segments; the diff includes the missing `|| p.quebra`. Running the copied module with import-only stubs and a synthetic annual series containing a declared intervening gap produced one continuous segment. The supplied gap test requires two segments, so its recorded green result cannot certify this copied implementation; the built poverty-line card also retains two segments that this implementation would join.  
References: src/lib/formas/serie-do-pais.mjs:65, src/lib/formas/serie-do-pais.mjs:108, diff.patch:774, tests/formas/serie-do-pais.mjs:107, built/salarios-pensoes-e-apoios/index.html:5

## Major

4. **The homepage declaration selects food inflation, contradicting the mandate, diff, report and built homepages.** The copied data selects `serie-ipc-alimentacao-variacao-homologa`; the diff and delivered HTML select `serie-ipc-variacao-homologa`. The component uses that declaration for the chart, its name and its receipt link, so rebuilding the copied source would substitute a different indicator. The homepage test explicitly requires the general inflation series and would reject that rebuilt result.  
References: src/data/primeira-pagina.mjs:78, diff.patch:535, src/components/inicio/BlocoDaPrimeiraPagina.astro:61, tests/inicio/serie-do-bloco.mjs:16, built/index.html:5, built/en/index.html:5

5. **The IPC receipts do not explain their index values in ordinary language.** On the Portuguese receipt, `103,276` is accompanied by “índice (base 2025 = 100)” without explaining what the base represents or how the value relates to it. On the English receipt, `103,276` has the same unexplained Portuguese unit, leaving an English reader without even a translated explanation. Both fail the requested novice-reading test despite providing complete tables.  
References: built/livro-razao/series/serie-ipc-indice/index.html:4, built/en/ledger/series/serie-ipc-indice/index.html:4

6. **The homepages’ “4 of 13” conclusion relies on unexplained technical concepts.** On `/`, the sentence naming the four failed references leaves “posição de investimento internacional” and “custo unitário do trabalho” undefined. On `/en/`, the equivalent sentence likewise leaves “international investment position” and “unit labour cost” unexplained, so readers cannot understand what those failures mean from the page.  
References: built/index.html:5, built/en/index.html:5

7. **Several central verification claims remain recorded assertions rather than independently reproducible results within this package.** The ledger totals of 4,131 points across sixteen series, the European row’s source excerpt and its last-point equality cannot be checked against ledger files because those unchanged files are not supplied. The unit declaration cites `Annual rate of change`, and the reading audit quotes the European scope, but neither substitutes for inspecting the actual row. The full 56-chart, 32-receipt and 60-capture results can be reconciled internally in the JSON records; the underlying complete build, capture files and commit history are unavailable for independently checking coverage or the final commit’s contents. The absent loaded stylesheet assets and `/js/tema.js` also prevent a faithful browser interaction check here; static markup inspection is not such a check.  
References: relatorio-construtor.md:11, relatorio-construtor.md:18, relatorio-construtor.md:24, relatorio-construtor.md:103, src/data/unidades-dos-cartoes.mjs:249, tests/cartao/leituras-provadas.json:6457, built/precos/index.html:5

## Minor

8. **The report’s “7 of 8” K20 result contradicts its evidence files.** `medidas.json` records eight plants and eight successful detections. Counting the individual K20 entries in `plantas.json` also gives eight successes, so the report’s numerator is wrong; the supplied zero result from the report checker does not establish semantic consistency.  
References: relatorio-construtor.md:19, design/especime-v3/medicoes/rp4-2026-10-04/medidas.json:76, design/especime-v3/medicoes/rp4-2026-10-04/plantas.json:138, design/especime-v3/medicoes/rp4-2026-10-04/conferencia-relatorio.codigo:1

9. **The required final token-cost measurement remains unfinished.** The report explicitly leaves it as `[verify]`. `custo.json` contains cumulative telemetry but has null terminal-count fields, so this is an acknowledged incomplete close rather than a measured final cost.  
References: relatorio-construtor.md:109, design/especime-v3/medicoes/rp4-2026-10-04/custo.json:7

## «What is fine»

10. **The IPC tables contain 944 unique point keys in 79 annual rows with twelve period columns in each edition, and their keys and values agree between editions.** References: built/livro-razao/series/serie-ipc-indice/index.html:4, built/en/ledger/series/serie-ipc-indice/index.html:4

11. **Independent arithmetic from the printed IPC table reproduces the SVG coordinates for January 1948 (`48,169.151`), May 1987 (`195.156,142.889`) and August 2026 (`342,61.216`), using `x=48+294n/943` and `y=170−158v/150`, although this cannot replace comparison with the omitted ledger series.** References: src/lib/formas/serie-do-pais.mjs:82, built/livro-razao/series/serie-ipc-indice/index.html:4

12. **All eighteen supplied series SVGs are static, have digit-free titles, and place their numerical text under the required scale marker.** References: built/index.html:5, built/en/index.html:5, built/precos/index.html:5, built/en/prices/index.html:5, built/salarios-pensoes-e-apoios/index.html:5, built/livro-razao/series/serie-ipc-indice/index.html:4, built/en/ledger/series/serie-ipc-indice/index.html:4, built/livro-razao/series/serie-pensao-media-anual/index.html:4, built/en/ledger/series/serie-pensao-media-anual/index.html:4, built/livro-razao/series/serie-remuneracao-bruta-mensal-media/index.html:4

13. **Both prices pages show the EU’s August 2026 figure of 3,2% in Portugal’s comparison card and again in the new EU card, whose reading obtains its digits through `claim` and `periodo` pieces and has an audit entry.** References: built/precos/index.html:5, built/en/prices/index.html:5, src/data/leitura-ihpc-uniao.mjs:8, tests/cartao/leituras-provadas.json:6436

14. **The archived build, verify and typecheck codes are all zero, their matching head files identify `7c3e6672…`, and their timestamp differences reproduce 165, 992 and zero seconds respectively.** References: design/especime-v3/medicoes/rp4-2026-10-04/portoes/build.codigo:1, design/especime-v3/medicoes/rp4-2026-10-04/portoes/verify.codigo:1, design/especime-v3/medicoes/rp4-2026-10-04/portoes/typecheck.codigo:1, design/especime-v3/medicoes/rp4-2026-10-04/portoes/cabeca:1, design/especime-v3/medicoes/rp4-2026-10-04/portoes/cabeca.fim:1, design/especime-v3/medicoes/rp4-2026-10-04/medidas.json:169