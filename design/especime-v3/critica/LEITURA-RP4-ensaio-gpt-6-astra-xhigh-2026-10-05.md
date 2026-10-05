# Leitura a frio do bloco RP4, o ensaio M51 · Codex `gpt-6-astra`, raciocínio `xhigh`

*Uma das quatro leituras do ensaio M51 de 05.10.2026 (as leituras a frio por modelo e esforço), sobre o mesmo pacote que o Opus leu (de `61519cea` a `053a4077`, os cinco estragos de `LEITURA-RP4-2026-10-05.plantas.json`), em sessão nova e só de leitura, pelo `ler-ensaio.sh` (a cópia do `ler.sh` com o esforço por variável). Custo pela linha «tokens used»: 160,377 símbolos; 07:27:07 a 07:45:45 UTC. A tabela comparativa e as decisões estão na M51 do registo das melhorias e na §1.161. O texto fica como o leitor o escreveu.*

## A leitura, como o leitor a entregou

## Blocking

1. **F21 silently discards coordinate errors in the copied gate.** Line 545 forwards only complaints containing `marca`; the diff forwards every complaint. Coordinate, transformation and hidden-line errors therefore disappear from the ordinary page scan. The plants call the unfiltered helper directly, so their recorded success does not prove that the gate enforces those failures. Applying the filter to the fourteen recorded plant complaints retains only two.
   
   scripts/check-formas.mjs:545, diff.patch:299, tests/formas/serie-do-pais.mjs:78, design/especime-v3/medicoes/rp4-2026-10-04/plantas.json:2

2. **The copied module joins the line across declared gaps.** It calculates `p.quebra` but ignores it when creating segments; the diff includes `|| p.quebra`. An isolated execution with annual points in 2015 and 2017 and a declared 2016 gap returned one connected segment. The supplied gap test requires two segments, contradicting the report’s nine passing module proofs for this copied implementation.
   
   src/lib/formas/serie-do-pais.mjs:67, src/lib/formas/serie-do-pais.mjs:108, diff.patch:774, tests/formas/serie-do-pais.mjs:107, relatorio-construtor.md:17

3. **The Portuguese inflation card plots a different first point from the English card.** Both charts declare the same series, dimensions and scale, but Portuguese starts at `48,45.981` and English at `48,44.981`; the remaining coordinates agree. The homepage’s first point, rescaled from its taller plotting area, agrees with the English coordinate. The supplied pages therefore disagree about the same historical observation.
   
   built/precos/index.html:5, built/en/prices/index.html:5, built/index.html:5, src/lib/formas/serie-do-pais.mjs:84

## Major

4. **The copied homepage declaration selects food-price inflation instead of overall inflation.** It declares `serie-ipc-alimentacao-variacao-homologa`, while the diff and both built homepages use `serie-ipc-variacao-homologa`. The component renders whichever series the declaration supplies, so these pages are not reproducible from the copied declaration. The homepage cell explicitly requires overall inflation and would reject a fresh rendering of this source.
   
   src/data/primeira-pagina.mjs:78, diff.patch:535, src/components/inicio/BlocoDaPrimeiraPagina.astro:59, tests/inicio/serie-do-bloco.mjs:16, built/index.html:5, built/en/index.html:5

5. **The time axis positions its final year label differently from its intermediate year labels.** Intermediate years use January, but the final year uses the last observation’s month. In the pay receipt, the `2026` tick is at `x=342`, the second-quarter point, whereas the first-quarter point is at `x=283.2`; `2025` starts at its first quarter. F21 reproduces this inconsistency because it uses the same scale generator.
   
   src/lib/formas/serie-do-pais.mjs:24, src/lib/formas/serie-do-pais.mjs:101, built/livro-razao/series/serie-remuneracao-bruta-mensal-media/index.html:4, tests/formas/serie-do-pais.mjs:26

6. **The promised English pay page is absent, leaving bilingual card coverage unverified.** The package description promises that page, and the measurement record assigns four charts to `en/pay-pensions-and-benefits/index.html`, but that file is not supplied. I counted seven distinct chart cards across the Portuguese prices and pay pages, and only three in the supplied English prices page. This is an evidence gap, not proof that the public English page is missing.
   
   PROMPT-leitura.md:31, relatorio-construtor.md:19, design/especime-v3/medicoes/rp4-2026-10-04/geometria-e-tabelas.json:293, built/salarios-pensoes-e-apoios/index.html:5, built/en/prices/index.html:5

7. **Neither CPI receipt explains what the index value `103,276` means relative to its reference.** The Portuguese page supplies only `índice (base 2025 = 100)`, without explaining what setting the reference to one hundred means. The English page retains that Portuguese unit and likewise gives no plain-language interpretation of the value or its position above the reference.
   
   built/livro-razao/series/serie-ipc-indice/index.html:4, built/en/ledger/series/serie-ipc-indice/index.html:4

8. **Both homepages leave part of the meaning of the poverty figures unexplained.** On `/`, understanding `18,6%` and `20,9%` requires understanding “privação material e social grave” and “intensidade de trabalho muito baixa”, neither of which is defined. On `/en/`, the same figures depend on the equally unexplained “severe material and social deprivation” and “very low work intensity”; explaining median income resolves only the first of the three criteria.
   
   built/index.html:5, built/en/index.html:5

## Minor

9. **The report’s “7 of 8” K20 result contradicts its evidence.** `medidas.json` records eight successful plants out of eight, and all eight individual entries in `plantas.json` say `mordeu: true`. The report-writing script also reads that eight directly. The saved report-number check reports no unsupported numbers despite this incorrect pairing.
   
   relatorio-construtor.md:19, design/especime-v3/medicoes/rp4-2026-10-04/medidas.json:80, design/especime-v3/medicoes/rp4-2026-10-04/plantas.json:140, design/especime-v3/medicoes/rp4-2026-10-04/escrever-relatorio.py:19, design/especime-v3/medicoes/rp4-2026-10-04/conferencia-relatorio.json:12

10. **The close still lacks the required final token measurement.** Both final-token fields remain null, and the report explicitly leaves this measurement unfinished. The observed duration does reproduce: its timestamps differ by 7,060.843484 seconds, truncated by the supplied script to 7,060. Capture existence and the last commit’s proofs-only contents cannot be independently checked without the deliberately excluded captures and repository; ledger-level names, warnings, EU excerpt support and real-series indexed results likewise remain unverified here, rather than disproved.
   
   brief.md:28, relatorio-construtor.md:103, relatorio-construtor.md:109, design/especime-v3/medicoes/rp4-2026-10-04/custo.json:4, design/especime-v3/medicoes/rp4-2026-10-04/custo-e-higiene.py:29, PROMPT-leitura.md:42

## «What is fine»

11. Both supplied CPI tables contain 944 distinct point keys in 79 rows and twelve period columns, agree across editions, and reproduce all their plotted coordinates from the table values, including January 1948 `(48,169.151)`, May 1987 `(195.156,142.889)` and August 2026 `(342,61.216)`, using `x=48+294i/943` and `y=170−158v/150`; this checks table-to-chart agreement, not the absent YAML. built/livro-razao/series/serie-ipc-indice/index.html:4, built/en/ledger/series/serie-ipc-indice/index.html:4, src/lib/formas/serie-do-pais.mjs:82

12. The supplied series SVGs contain no scripts or digit-bearing titles, their digit-bearing text consists of marked scale labels, and the supplied chart cards place their receipt links immediately after the value in the page’s language. src/components/formas/SerieDoPais.astro:13, built/precos/index.html:5, built/en/prices/index.html:5, built/salarios-pensoes-e-apoios/index.html:5

13. Both price pages show the EU’s `3,2%` in the Portugal comparison card and again in the new EU card, whose reading explains the annual change through `claim`/`periodo` pieces and has an explicit audit entry. built/precos/index.html:5, built/en/prices/index.html:5, src/data/leitura-ihpc-uniao.mjs:8, tests/cartao/leituras-provadas.json:6436

14. The saved build, verify, typecheck and report-check exit files all contain zero, although those historical records do not certify the inconsistent copied implementation identified above. design/especime-v3/medicoes/rp4-2026-10-04/portoes/build.codigo:1, design/especime-v3/medicoes/rp4-2026-10-04/portoes/verify.codigo:1, design/especime-v3/medicoes/rp4-2026-10-04/portoes/typecheck.codigo:1, design/especime-v3/medicoes/rp4-2026-10-04/conferencia-relatorio.codigo:1