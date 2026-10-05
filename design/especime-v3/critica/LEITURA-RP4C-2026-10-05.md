# Leitura a frio do bloco RP4-c (as ajudas de leitura do gráfico) · Codex `gpt-6-astra`, raciocínio `xhigh`, por `scripts/leituras/ler.sh`

*Lançada pelo lugar de direção (Claude Fable 5.1) a 05.10.2026 às 20:49 UTC sobre o pacote montado de `5b004ada` a `0d71edd0` (o código do construtor Claude Opus 5.5 em `dd2e347c`, depois da passagem do peso RP4-c-b), com cinco estragos plantados só nas cópias do pacote e registados por sha256 em `LEITURA-RP4C-2026-10-05.plantas.json`. A leitura correu das 20:56:24 às 21:06:27 UTC e gastou 213 608 símbolos (a linha «tokens used» do registo). As cinco plantas morderam. Dos restantes achados, nenhum pediu uma passagem de correção: o achado 5 (os recibos da inflação não dizem em palavras que os preços estão acima dos de há um ano) é o ponto 3 do bloco R4, já em construção; o achado 7 (duas citações do mapa fora da linha no pacote) está resolvido na fusão com o `main`, onde o mapa passou a 451 citações na linha e 0 fora; o achado 8 tem razão e fica registado: o ponto 3 do brief previa trabalho no motor para a média, e o mandato do lugar de direção restringiu o construtor ao sítio, mandando a linha para o motor num bloco próprio (o RP4-n), pelo que o relatório descreve o mandato e não o brief; o achado 6 (dois números do relatório, um deles a planta P4 e o outro os segundos do custo contados do primeiro evento guardado) fica dito aqui; o achado 13 corrige uma frase do lugar de direção: 26 982 bytes em gzip são a primeira página inteira, e as 289 zonas custam 11 229 desses. O texto do leitor segue intacto, em inglês.*

## As plantas

| id | ficheiro | o estrago | sha256 antes → depois (12) | mordida |
|---|---|---|---|---|
| P1 | `src/lib/formas/serie-do-pais.mjs` | a menor largura no ecrã das zonas passa de 354 a 254 no módulo, contra as 289 zonas construídas e o relatório | `187376537dab` → `30462e0c51bc` | sim (achado 3) |
| P2 | `built/index.html` | a leitura da última zona da inflação na primeira página construída diz «julho de 2026» onde o ponto é agosto de 2026 | `d34814e3d0ae` → `21f12d7fa2ff` | sim (achado 1) |
| P3 | `src/styles/serie-do-pais.css` | a regra do rato perde a condição do ponteiro fino: as leituras acendiam-se também no toque, contra o brief e a prova do toque | `65f03af69062` → `d8b186d9a533` | sim (achado 4) |
| P4 | `relatorio-construtor.md` | o relatório diz 72 593 bytes em gzip na página dos preços depois da passagem do peso, onde a medida diz 27 593 | `d414b4e24072` → `6609768e0df3` | sim (achado 6) |
| P5 | `built/index.html` | a marca da década de 2020 no eixo do tempo da primeira página construída diz 2021 | `21f12d7fa2ff` → `ac093693c4cd` | sim (achado 2) |

## A leitura

## Blocking

1. **The Portuguese first page presents August’s inflation value as July’s.** Its final hover label displays `3,30 %` with “julho de 2026”, although both origin attributes identify `2026-08`. The receipt table gives July as `3,04` and August as `3,30`; the English first page labels August correctly. The delivered Portuguese HTML fails its recorded SHA-256: correcting this month and finding 2’s year, only in memory, reproduces that hash exactly. The recorded green run therefore does not certify the delivered page.
   
   References: built/index.html:5, built/en/index.html:5, built/livro-razao/series/serie-ipc-variacao-homologa/index.html:4, design/especime-v3/medicoes/rp4c-2026-10-05/rp4cb/peso.json:294

## Major

2. **The Portuguese first page prints “2021” at the position of January 2020.** The label is at `x=286.034`, the recomputed coordinate for 2020; the English page and receipts correctly print 2020 there. At width 360, the decade rule admits 2000, 2010 and 2020, with the last candidate clearing the final-label test by `66.132 ≥ 64`. At width 240, only 2010 passes, matching the cards’ `1992, 2010, 2026`. F21’s text-and-position comparison should reject the delivered Portuguese label.
   
   References: built/index.html:5, built/en/index.html:5, src/lib/formas/serie-do-pais.mjs:174, tests/formas/serie-do-pais.mjs:84

3. **The copied drawing module produces 207 inflation zones, contradicting the diff, report and built pages’ 289.** The copied constant is `MENOR_LARGURA_NO_ECRA = 254`; the diff adds `354`. Recomputing the formula gives `floor(294 × 254 / 360) = 207`, versus 289 with 354, reducing the number of readable months on rebuilding. The supposedly independent zone test imports this same constant and uses it in its expected count, so that assertion cannot detect the mistaken calibration. The map also quotes 354 at the line that actually contains 254.
   
   References: src/lib/formas/serie-do-pais.mjs:64, src/lib/formas/serie-do-pais.mjs:223, diff.patch:1013, tests/formas/serie-do-pais.mjs:640, design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md:653

4. **The copied stylesheet weakens the required interaction guard by dropping `pointer: fine`.** Its operative rule is only `@media (hover: hover)`, although the adjacent comment, diff and built CSS require both conditions. This admits hover-capable coarse pointers that the mandate excludes; it does not establish a defect on ordinary non-hover touchscreens. The supplied browser tests exercise a desktop pointer and a non-hover mobile context, so those cases do not distinguish these two guards.
   
   References: src/styles/serie-do-pais.css:20, src/styles/serie-do-pais.css:28, diff.patch:1206, built/index.html:2, design/especime-v3/medicoes/rp4c-2026-10-05/captar-rp4cb.mjs:229

5. **Neither inflation receipt explains its percentages sufficiently for the two-minute test.** On the Portuguese receipt, `3,30 %` is accompanied by the technical expression “Taxa de variação homóloga” and a monthly frequency, without plainly saying that prices are higher than in the same month a year earlier. On the English receipt, `3,30 %` has the same untranslated Portuguese source definition and likewise lacks that explanation. Neither explains that a negative reading such as `−0,54 %` means prices below the corresponding month a year earlier; the prices cards do provide the missing comparison.
   
   References: built/livro-razao/series/serie-ipc-variacao-homologa/index.html:4, built/en/ledger/series/serie-ipc-variacao-homologa/index.html:4, built/precos/index.html:5

## Minor

6. **The delivered report contains numerical contradictions despite its zero-error number-check record.** The final prices-page gzip entry says `72,593`; its measurement says `27,593`, which I reproduced with Node’s default gzip on the supplied HTML. The cost paragraph calls `2,587` seconds the interval from `20:07:55` to the reading, but the recorded reading at `20:51:33` makes that interval `2,618` seconds. The reported duration instead starts at the first retained event, `20:08:25.976`.
   
   References: relatorio-construtor.md:134, relatorio-construtor.md:177, numeros-do-relatorio.txt:7, design/especime-v3/medicoes/rp4c-2026-10-05/rp4cb/peso.json:521, design/especime-v3/medicoes/rp4c-2026-10-05/rp4cb/custo.json:19

7. **The map’s “zero distant citations” result does not hold for the delivered files.** Its citation to `gate-html.mjs:4588` points to an anchor actually at line 4765. Another points to line 6613 for an anchor at 6627. Both exceed even the checker’s recorded ±7-line allowance, independently of the incorrect constant citation in finding 3.
   
   References: design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md:406, design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md:547, scripts/gate-html.mjs:4765, scripts/gate-html.mjs:6627, design/especime-v3/medicoes/rp4c-2026-10-05/rp4cb/provas/mapa.log:1

8. **The report’s stated prohibition on engine work contradicts the supplied brief.** The report says the mandate did not allow touching the engine. Brief item 3 explicitly commissions engine generation, export and updating of the average, while its exclusion protects only unconfirmed engine files. The later decision to defer the work to RP4-n is recorded, but it does not make that account of the original mandate accurate.
   
   References: relatorio-construtor.md:15, brief.md:23, brief.md:29, design/especime-v3/ISSUES.md:215

9. **Several historical claims cannot be independently reproduced from this package.** The ledger counts, session response/token totals and claim that the final commit changes only proofs lack their underlying ledger, session log or commit history. The inflation YAML is absent, so point checks below use the receipt table; exporter warnings and external-name verification status cannot be audited from that substitute. The full §1.127 and ledger README are also absent, limiting verification of the cited rules to their quotations and recorded F5 rejection. Capture JSON records the mouse/touch results, but absent images and browser assets prevent independent visual replay here; the referenced theme script is also missing. These are evidence limits, not findings that the omitted unchanged files are defective.
   
   References: relatorio-construtor.md:7, relatorio-construtor.md:15, relatorio-construtor.md:100, relatorio-construtor.md:173, design/especime-v3/medicoes/rp4c-2026-10-05/rp4cb/capturas.json:13, built/index.html:5

## «What is fine»

10. The supplied drawings have the expected zone counts and geometry: 289 on both first pages and inflation receipts, nine on the pension receipt, six on the quarterly pay receipt, and none on cards or the indexed figure, with no scripts inside the drawings; built/index.html:5, built/precos/index.html:5, built/livro-razao/series/serie-pensao-media-anual/index.html:4, built/livro-razao/series/serie-remuneracao-bruta-mensal-media/index.html:4, built/livro-razao/series/serie-remuneracao-bruta-mensal-media-real/index.html:4.

11. Against the receipt’s 416-point table, inflation zone values match throughout, including January 1992 `9,41`, September 2000 `3,38`, April 2009 `−0,54`, December 2017 `1,47` and August 2026 `3,30`, with the Portuguese final-period exception already reported; built/livro-razao/series/serie-ipc-variacao-homologa/index.html:4, built/en/index.html:5, built/index.html:5.

12. Percentage ticks carry `%` except zero, money ticks omit the currency symbol and have written-out units, and the recorded F5 plant rejects `500 €`; built/precos/index.html:5, built/livro-razao/series/serie-pensao-media-anual/index.html:4, design/especime-v3/medicoes/rp4c-2026-10-05/rp4cb/planta-rp4c-formato-euro-numa-marca.log:2.

13. The weight records consistently cover the same 58 paths and their totals reconcile, while `26,982` is the recorded whole first-page gzip size, not the zones’ cost: removing its 289 groups from the hash-matching version in memory saves `11,229` gzip bytes; design/especime-v3/medicoes/rp4c-2026-10-05/medir-peso.mjs:38, design/especime-v3/medicoes/rp4c-2026-10-05/rp4cb/peso.json:294.

14. The stored gate codes support the historical green runs, and the fault records support F2’s 6/6, F21’s 21/21 plus 20/20 reading/legend plants, and 13 external plants with restored hashes, including card zones and missing receipt zones; design/especime-v3/medicoes/rp4c-2026-10-05/portoes/verify.codigo:1, design/especime-v3/medicoes/rp4c-2026-10-05/rp4cb/conferencias/check-formas.codigo:1, design/especime-v3/medicoes/rp4c-2026-10-05/rp4cb/provas/formas.log:2, design/especime-v3/medicoes/rp4c-2026-10-05/rp4cb/plantas-portoes-rp4c.json:1.
