# Leitura a frio do bloco RP4-m (as séries que faltavam, o corredor das séries e o salário real) · Codex `gpt-6-astra`, raciocínio `xhigh`, por `scripts/leituras/ler.sh`

*Lançada pelo lugar de direção (Claude Fable 5.1) a 05.10.2026 às 15:20 UTC sobre o pacote montado de `40f0cb58` a `4fcfdcd8` (o código do construtor Claude Opus 5.5 em `711d3802`; o motor de `38457b2` a `7461321`, a última cabeça com o commit do lugar de direção sobre o `xlrd`), com cinco estragos plantados só nas cópias do pacote e registados por sha256 em `LEITURA-RP4M-2026-10-05.plantas.json`. A leitura correu das 15:20:38 às 15:31:55 UTC e gastou 228 990 símbolos (a linha «tokens used» do registo). As cinco plantas morderam. Dos restantes achados, o lugar de direção tomou quatro para a passagem de correção RP4-m-b (o achado 4, o corredor não regista uma segunda revisão de um ponto já revisto; o achado 5, um pedido falhado não entra no veredicto do corredor, que diz PASS com a pasta antiga; o achado 9, a frase do recibo das séries derivadas dizia que a conta se refaz em cada construção do sítio, uma frase da casa sobre si própria; e o achado 14, o commit do lugar de direção que pôs o `xlrd` no ficheiro trancado ordenou os comentários por ordem alfabética, um estrago do próprio lugar de direção, que o leitor apanhou). Os achados 10, 11 e 13 são limites do pacote ou do prompt: os corpos alojados não vão no pacote, e a nota do lugar de direção dizia que o registo dos pedidos trazia o primeiro e o último ponto de cada um, o que não é verdade (esses estão nas entradas `pedidos` de cada série); a nota dizia 321 corpos alojados onde são 319 (os 319 pedidos lidos; mais 3 recusados com 414 que não têm corpo); e o prompt afirmava que nada na cadeia do `verify` escreve no `dist/`, quando o `gate:html` escreve o `dist/prova.json` por desenho, documentado no mapa (a regra da casa é sobre plantas, não sobre a prova). Os achados 7 e 8 são observações de leitor (a primeira página não explica a posição de investimento internacional nem o custo unitário do trabalho; os recibos das séries não comparam o último ponto com o do ano anterior em palavras) e entram na revisão editorial seguinte, com os achados do mesmo tipo da leitura do C2. O texto do leitor segue intacto, em inglês.*

## As plantas

| id | ficheiro | o estrago | sha256 antes → depois (12) | mordida |
|---|---|---|---|---|
| P1 | `ledger/series/serie-remuneracao-bruta-mensal-media-real.yml` | um ponto da série derivada do salário real trocado (2025: 1 375 passa a 1 357), contra a conta das origens | `7d3d9a3633cc` → `333a25662043` | sim (achado 2) |
| P2 | `built/livro-razao/series/serie-remuneracao-bruta-mensal-media-real/index.html` | a legenda da figura indexada no recibo construído diz 2016 em vez da base 2015 da regra | `4f02a3b3d6e8` → `a865ad224407` | sim (achado 1) |
| P3 | `src/lib/formas/serie-do-pais.mjs` | a marca do último ano volta a ancorar-se à direita (end) no módulo, contra o relatório e o SVG construído | `73dd32e1801e` → `d15fce8313a8` | sim (achado 6) |
| P4 | `relatorio-construtor.md` | o relatório diz 13 linhas presas em vez das 12 medidas | `0e0a80eb750b` → `abc9f3afd84c` | sim (achado 12) |
| P5 | `motor/publisher/dominios_series_corredor.py` | o corredor deixa de recusar revisões escritas por cima: o raise passa a print | `4bd4856d1904` → `a67c1d3b3ff2` | sim (achado 3) |

## A leitura

## Blocking

1. **The Portuguese real-wage receipt gives the wrong base year for its indexed chart.** It says both lines equal 100 in 2016; the English receipt says 2015. The SVG coordinates put both lines at 100 in 2015, and both exceed 100 in 2016. This changes the reader’s interpretation of growth and contradicts the declared base and S6’s explicit check.  
built/livro-razao/series/serie-remuneracao-bruta-mensal-media-real/index.html:4, built/en/ledger/series/serie-remuneracao-bruta-mensal-media-real/index.html:4, src/lib/formas/serie-do-pais.mjs:16, tests/series/series.mjs:733

2. **The sealed real-wage series contains an incorrect 2025 value and disagrees with both built receipts.** Recomputing all twelve points gives eleven matches and one failure: `round(1696 × 81.062 ÷ 100, 0) = 1375`, whereas the YAML contains 1357. Both receipts and the report print 1375. The supplied data therefore cannot reproduce the supplied publication or its recorded green arithmetic check.  
ledger/series/serie-remuneracao-bruta-mensal-media-real.yml:85, ledger/series/serie-remuneracao-bruta-mensal-media-anual.yml:97, ledger/series/serie-ipc-indice-anual.yml:321, ledger/series/serie-ipc-indice-anual.yml:361, built/en/ledger/series/serie-remuneracao-bruta-mensal-media-real/index.html:4, relatorio-construtor.md:16

3. **The delivered revision writer overwrites protected history after detecting that it was rewritten.** The copied file prints the complaint and continues to `write_text`; the diff instead adds `raise Fail`. Executing the copied functions with an in-memory destination confirmed that a changed historical `old_value` was written without an exception. The existing plant expects an exception, so its reported success does not describe this delivered function.  
motor/publisher/dominios_series_corredor.py:294, motor/publisher/dominios_series_corredor.py:298, motor/diff.patch:2763, motor/publisher/dominios_series_corredor_test.py:289

## Major

4. **The corridor cannot register a second revision to an already revised point.** It first builds the newly fetched series with the old revision history, before comparing values and generating new revisions. `aplicar_revisoes` immediately rejects a point whose new value differs from the latest recorded revision. An in-memory check accepted the recorded value and rejected its next change at precisely this stage; the corridor never reaches the code that would append the next revision.  
motor/publisher/dominios_series_corredor.py:247, motor/publisher/dominios_series_corredor.py:249, motor/publisher/dominios_series.py:1234, motor/publisher/dominios_series_corredor_test.py:291

5. **Failed requests can produce a successful corridor result using old archived data.** Failed INE metadata requests are recorded and skipped; incomplete runs fall back to an older complete source folder. Request failures never enter `recusas`, which controls the final PASS verdict and write refusal. An isolated in-memory execution with a rejected metadata request and archive fallback returned no refusals, zero new points and zero revisions.  
motor/publisher/dominios_series_corredor.py:108, motor/publisher/dominios_series.py:603, motor/publisher/dominios_series_corredor.py:255, motor/publisher/dominios_series_corredor.py:324

6. **The copied plotting module right-aligns the last-year label, contradicting the diff, report and built SVG.** January is correctly positioned: for the quarterly receipt, `48 + (12/15) × 294 = 283.2`, matching the built SVG. However, the copied source selects `end`, while the patch and built page use `middle`. Running the copied module with the independent proof reproduced its alignment failure.  
src/lib/formas/serie-do-pais.mjs:113, diff.patch:1144, tests/formas/serie-do-pais.mjs:89, built/livro-razao/series/serie-remuneracao-bruta-mensal-media/index.html:4, relatorio-construtor.md:18

7. **Both homepages fail the two-minute test for the “4 of 13” reference-value summary.** On the Portuguese homepage, the four breaches include “posição de investimento internacional” and “custo unitário do trabalho” without explaining either quantity or the direction of its breach. On the English homepage, “international investment position” and “unit labour cost” remain equally unexplained, so the reader cannot understand two of the four reported problems without leaving the page.  
built/index.html:4, built/en/index.html:4

8. **Two supplied receipts leave their latest numbers without the plain-language comparison required by the reading brief.** The Portuguese rents receipt presents August 2026’s 5.22% under “variação num ano” but never states that rents are higher than in the same month a year earlier. The quarterly-pay receipt presents €1,835 per month for 2026 Q2 but never tells the reader how it compares with the €1,746 shown for 2025 Q2.  
built/livro-razao/series/serie-ipc-rendas-variacao-homologa/index.html:4, built/livro-razao/series/serie-remuneracao-bruta-mensal-media/index.html:4

9. **The new real-wage receipts publish internal construction prose despite the rule against reader-facing prose about the house.** Both editions tell readers that the project calculates the series and reruns the calculation at every site build. This is an implementation statement separate from the following explanation of purchasing power and the deflator.  
src/i18n/strings.mjs:2283, src/i18n/strings.mjs:4064, built/livro-razao/series/serie-remuneracao-bruta-mensal-media-real/index.html:4, built/en/ledger/series/serie-remuneracao-bruta-mensal-media-real/index.html:4

10. **The request log cannot substantiate the claimed source-level point checks.** Contrary to the copying note, its records contain neither first/last returned points nor their values. For rents, the first and last requests match the YAML’s URLs, hashes and timestamps, but the values at their boundaries cannot be independently checked against omitted response bodies. The official identities and metadata-derived starting periods likewise remain claims supported by copied declarations, not independently inspectable source responses.  
motor/COPIADO-A-MAO.md:3, motor/indicators/out/rp4m-2026-10-05/pedidos.jsonl:155, motor/indicators/out/rp4m-2026-10-05/pedidos.jsonl:232, ledger/series/serie-ipc-rendas-variacao-homologa.yml:30, relatorio-construtor.md:13

11. **Several other reported measurements remain unshown rather than independently reproducible.** The session log behind the token/model counts, the checker and target files behind the 397 map citations, and commit history proving that the final commit contains only evidence are absent. The 70 capture records can be counted, but their screenshots and built stylesheets are absent, preventing independent visual confirmation of the dashed line, overflow and measured lettering. The pages load `/js/tema.js`, which is also absent, so the theme buttons were not interaction-verified; neither the English annual-index receipt nor the named phrase/key inventories is supplied.  
relatorio-construtor.md:20, relatorio-construtor.md:88, relatorio-construtor.md:92, design/especime-v3/medicoes/rp4m-2026-10-05/custo.py:27, design/especime-v3/medicoes/rp4m-2026-10-05/medir.py:263, built/en/ledger/series/serie-ipc-indice/index.html:4

## Minor

12. **Two delivery counts contradict their supporting records.** The report says 13 linked rows, but its later summary, `medidas.json` and the engine declaration say 12; seven existing plus five added also equals twelve. The copying note says 321 hosted bodies, whereas the manifest contains 319 RP4-m entries and the request log contains 319 successful requests plus three refusals. The zero in the report-number checker does not establish the correctness of these quantities.  
relatorio-construtor.md:13, relatorio-construtor.md:76, design/especime-v3/medicoes/rp4m-2026-10-05/medidas.json:420, motor/publisher/dominios_series.py:483, motor/COPIADO-A-MAO.md:3, numeros-do-relatorio.txt:10

13. **The requested assertion that nothing in the verify chain writes to `dist/` is false.** The recorded chain includes `gate:html`, whose output explicitly reports writing `/prova.json`. The repository map identifies this as `dist/prova.json`; this is an existing documented write, distinct from the new plants’ in-memory mutations.  
design/especime-v3/medicoes/rp4m-2026-10-05/portoes/verify.log:3, design/especime-v3/medicoes/rp4m-2026-10-05/portoes/verify.log:1492, design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md:323

14. **The lockfile update scrambled its regeneration instructions.** Its comments now put `pip freeze` before dependency installation and environment creation, with the surrounding explanation alphabetically fragmented. The dependency pin itself is present, but these instructions no longer describe an executable sequence.  
motor/requirements.lock.txt:9, motor/requirements.lock.txt:19, motor/requirements.lock.txt:87

## «What is fine»

15. The five IPC series contain 405, 405, 932, 932 and 932 points with the reported boundaries, and all five copied claims match their series’ last value, period and coordinates.  
ledger/series/serie-ipc-variacao-media-12-meses.yml:314, ledger/series/serie-ipc-sem-habitacao-variacao-media-12-meses.yml:314, ledger/series/serie-ipc-combustiveis-variacao-homologa.yml:658, ledger/series/serie-ipc-rendas-variacao-homologa.yml:658, ledger/series/serie-ipc-energia-em-casa-variacao-homologa.yml:658

16. Both editions contain the five requested card charts inside ordinary receipt links, with their values and explanations already present in static HTML.  
built/precos/index.html:4, built/en/prices/index.html:4, built/habitacao/index.html:4, built/en/housing/index.html:4

17. Annual-average CPI is the appropriate cadence for the annual-average wage calculation, and both derivation texts explicitly identify that choice.  
ledger/series/serie-remuneracao-bruta-mensal-media-real.yml:91, ledger/series/serie-remuneracao-bruta-mensal-media-real.yml:92

18. The isolated F21 page rule accepts the declared indexed receipt and rejects all five specified plants.  
tests/formas/serie-do-pais.mjs:109, tests/formas/serie-do-pais.mjs:140

19. I202’s stop is supported by the four recorded failing checks, and both prices pages retain an August-to-August comparison of Portugal’s 3.6% with the Union’s 3.2%.  
design/especime-v3/medicoes/rp4m-2026-10-05/item2.json:31, built/precos/index.html:4, built/en/prices/index.html:4

20. The trial files consistently report 21/24 series, 16/18 requests and zero additions or revisions, while the README explicitly says the corridor runs manually.  
motor/indicators/out/rp4m-2026-10-05/ensaio-do-corredor-das-series/corredor.json:396, motor/indicators/out/rp4m-2026-10-05/ensaio-do-corredor-das-series-24/corredor.json:446, motor/publisher/README.md:282

21. The I201 numeric parser correctly handles all four supplied thousands-space examples when executed in isolation.  
motor/core/reconcile.py:165, motor/core/reconcile_test.py:294
