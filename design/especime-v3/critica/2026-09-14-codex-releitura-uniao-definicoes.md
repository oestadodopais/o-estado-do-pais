# Releitura de verificação do Codex às 23 definições da página «Portugal na União Europeia», sobre a cabeça final do dia, 14.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, efémero (o modelo fixado em `ler.sh`, lido no registo de eventos), 16:41:46 a 16:56:15 UTC de 14.09.2026, 189 138 símbolos, sobre um pacote montado da cabeça `7b85bb7f` do ramo `lugar-2026-09-04` (depois da segunda passagem do dia e das três decisões de fecho), com os mesmos ficheiros da leitura da manhã e as mesmas quinze cópias das páginas de origem lidas a 14.09; o prompt diz ao leitor que é uma releitura depois de uma passagem de correção e manda-o não presumir nada corrigido. **Três plantas de três classes, 3 de 3 vistas** (o registo no `.plantas.json` ao lado): R1, o excerto de `pdm-divida-das-familias` com o limiar trocado de 55 % para 50 % (o achado 2); R2, a página inglesa a render «counted twice» no risco de pobreza onde os dados dizem «counted only once» (o achado 1, Blocking); R3, a guarda nova da data da régua 8.4 a deixar passar uma origem sem data rendida (o achado 5). O achado 7 é o efeito das plantas R1 e R2 na consistência do pacote; o achado 8 (26 chaves e não 25) é o cabeçalho do prompt, que ficou com a conta da manhã depois de a origem do «FDI» entrar; o achado 4 (a página do glossário do «FDI» fora das cópias) é o pacote, que levava as quinze páginas lidas de manhã e não a décima sexta, que a segunda passagem trouxe: o lugar de direção leu-a a seguir por `curl` (HTTP 200, o sha256 no índice das fontes) e o excerto declarado está nela carácter a carácter. **Os dois achados reais**: o 3 (as duas definições do fluxo de crédito às empresas dizem que o fluxo exclui o investimento direto estrangeiro e não dizem que o stock de dívida do denominador também o exclui, como a linha da Comissão repete depois do «t-1») e o 6 (a régua 8.4 confere o publicador, o documento e o excerto por contenção no bloco inteiro, e não por igualdade no elemento de cada campo). Os «what is fine» confirmam as outras 21 medidas e os dois painéis, definição a definição, nas duas edições.*

*Triagem do lugar de direção, pela delegação (§1.98): o achado 3 corrige-se nas duas edições (o denominador também sem o investimento direto estrangeiro, como o excerto) e o achado 6 endurece a régua (cada campo por igualdade contra o seu elemento marcado, com um positivo conhecido); as duas correções fecham-se na mesma worktree antes da aterragem, e uma leitura curta do Codex, só sobre a medida mudada, a origem do «FDI» com a sua página, e a régua, corre sobre a cabeça final antes de `main` avançar.*

---

## Blocking

1. **The English public page reverses the AROPE rule by saying that people in multiple situations are “counted twice.”**

The source says, “People are included only once even if they are in more than one of the situations mentioned above.” The data likewise says, “people are counted only once,” while the English build renders, “people are counted twice”; the Portuguese build remains correct. This changes the indicator’s aggregation rule, so the two editions are not equivalent.

src/data/figuras.mjs:1039, fontes/03.txt:133, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

## Major

2. **The declared `pdm-divida-das-familias` excerpt is absent from the fetched source, and the data disagrees with both built pages.**

The declared excerpt is, “household (incl. NPISH) consolidated debt in % of GDP with a threshold of 50%.” The fetched source says, “household (incl. NPISH) consolidated debt in % of GDP with a threshold of 55%.” Both built editions render 55%, not the 50% declared in `figuras.mjs`; the page otherwise appears to be the same document and indicator list, not a wholesale rewrite. Because the origin was dated 09.09.2026 and the copy was fetched on 14.09.2026, `[verify]` whether the threshold changed during those five days or whether 50% was transcribed incorrectly, but the packaged data and packaged public pages are definitively inconsistent.

src/data/figuras.mjs:562, fontes/15.txt:105, fontes/15.txt:125, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

3. **Both company-credit definitions drop the source’s requirement that FDI also be excluded from the preceding-period debt stock.**

The source says, “NFC (excl. FDI) consolidated credit flow in % of NFC debt stock in t-1 (excl. FDI).” The English definition says only, “excluding foreign direct investment, as a percentage of their debt stock in the previous period,” and the Portuguese construction has the same scope. The lone exclusion qualifies the credit flow; it does not state that the denominator also excludes FDI, although the source expressly repeats that qualifier after `t-1`.

src/data/figuras.mjs:569, src/data/figuras.mjs:921, fontes/15.txt:111, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

4. **The fetched-source corpus does not contain the declared `glossario-fdi` address, so its excerpt cannot be verified against its source.**

The data declares the FDI glossary and the excerpt, “Foreign direct investment, abbreviated as FDI, is an international investment within the balance of payment accounts.” The source index instead assigns file 10 to the undeclared “Non-financial corporations sector” glossary, and no indexed file represents the FDI URL. The builder report claims a 67,386-byte response and a SHA-256 value, but that response is not in this package, so the transcription and the publisher/document claims remain `[verify]`.

src/data/figuras.mjs:645, fontes/INDICE.md:16, fontes/10.txt:1, relatorio-construtor.md:205

5. **Cell 8.4 silently accepts a rendered origin whose reading-date element is entirely missing.**

The cell sets `dataRendida` to `null` when `[data-def-lido="<key>"]` is absent. Its failure condition is `dataRendida !== null && dataRendida !== data`, so `null` bypasses the comparison. Present but incorrect dates are caught; absent dates are not, contrary to the comments and builder report.

scripts/check-lugar.mjs:1188, scripts/check-lugar.mjs:1195, scripts/check-lugar.mjs:1197, relatorio-construtor.md:135

6. **Cell 8.4 is a data-to-HTML consistency check, not a source or semantic verification, and most rendered origin fields are checked only by containment.**

It compares normalized definition text exactly, compares declared and rendered origin counts, requires an exact URL somewhere among the block’s links, and would catch the packaged AROPE and household-excerpt divergences. For publisher, document and excerpt, however, it merely asks whether the expected string occurs anywhere in the whole origin block, so a changed field can pass if the expected text appears elsewhere, and additional text is allowed. It never reads `fontes`, checks an excerpt against its address, checks publisher/document accuracy, or tests whether a definition and its translation are semantically supported; consequently it cannot catch findings 3 or 4.

scripts/check-lugar.mjs:1108, scripts/check-lugar.mjs:1132, scripts/check-lugar.mjs:1171, scripts/check-lugar.mjs:1179, scripts/check-lugar.mjs:1208

7. **The builder’s green 8.4 result cannot describe the packaged built pages under the packaged current data.**

The report claims a zero result and later reports `build · verify · typecheck` as `0 · 0 · 0`. Under the cell’s own comparisons, the English AROPE reversal would fail the exact-definition check and the two 55% household excerpts would fail the declared-excerpt containment check. `[verify]` whether the reported run used different `dist/` artifacts or whether the report became stale.

relatorio-construtor.md:148, relatorio-construtor.md:244, scripts/check-lugar.mjs:1125, scripts/check-lugar.mjs:1184, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

## Minor

8. **The package’s “25 origins” count is wrong: `ORIGENS_DAS_DEFINICOES` contains 26 unique keys.**

The 23 definitions contain 28 origin references: 26 for the 21 measures and two for the scoreboards. Each built edition accordingly renders 28 origin blocks, while the builder report still refers to 25 measure-origin blocks; the table below therefore has 26 rows despite its required heading.

src/data/figuras.mjs:503, src/data/figuras.mjs:756, relatorio-construtor.md:107, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

## «What is fine»

- **PDM scoreboard:** Both definitions are supported by the passages describing a limited set of indicators covering internal and external imbalances and their indicative thresholds, and both builds match the data. src/data/figuras.mjs:777, fontes/15.txt:87, fontes/15.txt:91, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

- **Social Scoreboard:** Both definitions preserve “participating EU countries” and accurately describe the scoreboard’s role, with matching data and builds. src/data/figuras.mjs:791, fontes/14.txt:329, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

- **Public debt:** Both definitions preserve the general-government concept and GDP denominator stated by the Commission. src/data/figuras.mjs:831, fontes/15.txt:103, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

- **International investment position:** The Banco de Portugal excerpts support the assets-minus-liabilities concept in both languages, the Commission supplies the GDP unit, and both origins are therefore necessary. src/data/figuras.mjs:836, fontes/01.html:1, fontes/15.txt:95

- **Unit labour cost:** Both definitions preserve the nominal index, per-hour basis and three-year horizon. src/data/figuras.mjs:849, fontes/15.txt:101

- **House prices:** Both definitions follow the Eurostat definition of transaction-price changes for dwellings purchased by households. src/data/figuras.mjs:861, fontes/06.txt:133

- **Export performance:** Both definitions preserve performance against advanced economies and the three-year horizon without restoring the unsupported “share” claim. src/data/figuras.mjs:870, fontes/15.txt:99

- **Company debt:** The supported NFC label, consolidation and GDP unit are retained, while the unsupported expansion is visibly marked `[a verificar]`. src/data/figuras.mjs:882, fontes/15.txt:107, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

- **Household debt:** Apart from finding 2’s threshold transcription, the definition itself is supported by the Commission’s concept and unit together with Eurostat’s NPISH expansion. src/data/figuras.mjs:902, fontes/15.txt:105, fontes/11.txt:133

- **Household credit flow:** The two origins jointly support consolidated credit flow, inclusion of NPISH, the debt-stock denominator and `t-1`, without reintroducing “end of the previous year.” src/data/figuras.mjs:933, fontes/15.txt:109, fontes/11.txt:133

- **Current-account balance:** Both definitions preserve the GDP denominator and the three-year backward moving average. src/data/figuras.mjs:949, fontes/15.txt:93

- **Activity rate:** Eurostat supports the population concept and employed/unemployed composition, while the Commission supplies the three-year horizon, so both origins are needed. src/data/figuras.mjs:963, fontes/02.txt:133, fontes/02.txt:135, fontes/15.txt:117

- **Real effective exchange rate:** Both definitions preserve the consumer-price deflator basis, 41-country comparison and three-year horizon. src/data/figuras.mjs:972, fontes/15.txt:97

- **MIP unemployment rate:** Both definitions reproduce the number-unemployed over labour-force concept. src/data/figuras.mjs:989, fontes/12.txt:143

- **Employment rate:** Both definitions reproduce employed persons as a percentage of the comparable population. src/data/figuras.mjs:994, fontes/05.txt:133

- **Social unemployment rate:** Both definitions reproduce the same supported unemployment-rate concept. src/data/figuras.mjs:999, fontes/12.txt:143

- **Long-term unemployment:** Both definitions retain being out of work, active job seeking and the minimum one-year period. src/data/figuras.mjs:1004, fontes/09.txt:133

- **Young people NEET/NEM:** Both definitions preserve percentage, age group, sex, employment status, education and training. src/data/figuras.mjs:1009, fontes/13.txt:133

- **Early leavers:** Both definitions preserve ages 18–24, at most lower-secondary education and absence from further education or training. src/data/figuras.mjs:1021, fontes/04.txt:133

- **S80/S20:** Both definitions preserve the ratio between total income of the highest- and lowest-income quintiles. src/data/figuras.mjs:1047, fontes/08.txt:133

- **Housing-cost overburden:** Both definitions preserve the population unit, 40% threshold and the housing-allowance qualification on both numerator and denominator. src/data/figuras.mjs:1056, fontes/07.txt:133

- **Marker handling:** Both NFC definitions render `[a verificar]`, and each edition displays its explanation immediately after the first occurrence as the ruler requires. src/data/figuras.mjs:882, src/data/figuras.mjs:913, scripts/check-lugar.mjs:803, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

- **Origin rendering:** Except for findings 1–4, the two builds match the declared definitions, publisher, document, URL, date and language-selected excerpt, with each reading date inside its excerpt fold. src/components/OrigemDaDefinicao.astro:78, src/components/OrigemDaDefinicao.astro:94, src/components/OrigemDaDefinicao.astro:109, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

- **Fetched-file integrity:** The byte counts and SHA-256 values of all fifteen packaged raw files reproduce the index exactly, although file 10 is the wrong address for the declared origin set. fontes/INDICE.md:5, fontes/INDICE.md:21

- **Origin fields and dates:** For every origin that has the correct fetched address, the publisher and document describe that address and every `lido` value is a plausible date on or before 14.09.2026. src/data/figuras.mjs:503, fontes/INDICE.md:5

## The 25 origins, one by one

There are 26 rows because the register contains 26 keys, as recorded in finding 8.

| Origin key | Source file `NN` | Excerpt in source | Definition supported | Findings |
|---|---:|---|---|---:|
| `painel-pdm` | 15 | yes | yes | — |
| `pdm-divida-publica` | 15 | yes | yes | — |
| `pdm-posicao-de-investimento` | 15 | yes | partly; jointly yes with `bdp-pii` | — |
| `pdm-custo-do-trabalho` | 15 | yes | yes | — |
| `pdm-exportacoes` | 15 | yes | yes | — |
| `pdm-divida-das-empresas` | 15 | yes | yes, with the unsupported expansion marked | — |
| `pdm-divida-das-familias` | 15 | partly, 50% versus 55% | partly; jointly yes with `glossario-npish` | 2 |
| `pdm-credito-as-empresas` | 15 | yes | partly; denominator qualifier omitted | 3 |
| `pdm-credito-as-familias` | 15 | yes | partly; jointly yes with `glossario-npish` | — |
| `pdm-balanca-corrente` | 15 | yes | yes | — |
| `pdm-taxa-de-actividade` | 15 | yes | partly; jointly yes with `glossario-atividade` | — |
| `pdm-cambio-efectivo-real` | 15 | yes | yes | — |
| `glossario-fdi` | missing; 10 is unrelated | no, fetched copy absent | yes against the declared excerpt; source `[verify]` | 4 |
| `glossario-npish` | 11 | yes | partly; jointly yes in both measures that use it | — |
| `pilar-social` | 14 | yes | yes | — |
| `glossario-hpi` | 06 | yes | yes | — |
| `glossario-atividade` | 02 | yes | partly; jointly yes with `pdm-taxa-de-actividade` | — |
| `glossario-emprego` | 05 | yes | yes | — |
| `glossario-desemprego` | 12 | yes | yes for both unemployment definitions | — |
| `glossario-longa-duracao` | 09 | yes | yes | — |
| `glossario-nem` | 13 | yes | yes | — |
| `glossario-abandono` | 04 | yes | yes | — |
| `glossario-arope` | 03 | yes | partly; data/PT yes, English build no | 1 |
| `glossario-s80s20` | 08 | yes | yes | — |
| `glossario-sobrecarga` | 07 | yes | yes | — |
| `bdp-pii` | 01, raw HTML | yes, both languages | partly; jointly yes with `pdm-posicao-de-investimento` | — |