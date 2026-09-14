# Leitura de verificação do Codex às 23 definições da página «Portugal na União Europeia», 14.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, efémero (o modelo fixado no guião `ler.sh` desde hoje, e lido no registo de eventos: `model: gpt-5.6-sol`), 12:54:56 a 13:11:34 UTC de 14.09.2026, 184 927 símbolos, sobre um pacote com o brief desta leitura (o 8.4 e a decisão 1 da segunda passagem), as secções do relatório do construtor que falam das definições, `src/data/figuras.mjs`, `src/data/verbatim.mjs`, `src/components/OrigemDaDefinicao.astro`, `src/components/inicio/LeituraBreve.astro`, `scripts/check-lugar.mjs`, `src/lib/ledger.mjs`, as duas páginas construídas da União na cabeça `2da5212d` do ramo `lugar-2026-09-04`, e as quinze páginas de origem lidas pelo lugar de direção a 14.09.2026 com `curl` e o nome da casa (`fontes/`, o HTML em bruto e o texto rendido, com o sha256 de cada resposta no índice; a página do BPstat rende o corpo por guião e o texto dela está nos metadados). Quem escreveu as definições e os excertos (as sessões Claude Opus 5 de 08 e 09.09) não verifica: esta leitura é a verificação. **Cinco plantas de três classes, 5 de 5 vistas** (o registo está no `.plantas.json` ao lado): P1, o excerto de `pdm-divida-publica` com o limiar trocado de 60 % para 65 % (o achado 1); P2, a definição portuguesa do custo unitário do trabalho a dizer «cinco anos» onde o excerto diz três (o achado 2); P3, a página portuguesa a render «lido na fonte a 18.09.2026» para `painel-pdm` (o achado 9); P4, a régua 8.4 a comparar só os primeiros 40 caracteres do excerto (o achado 8, que a leu e disse que deixaria passar o achado 1); P5, a cópia do texto do glossário da taxa de emprego com «people» no lugar de «persons» (o achado 21, que foi ver o HTML em bruto e encontrou a frase certa). O achado 13 (o ponto e vírgula do excerto do abandono escolar trocado por um ponto) não era planta: o lugar de direção conferiu os 25 excertos contra as cópias antes de plantar, e sabia dele.*

*Triagem do lugar de direção, pela delegação (§1.98), para a segunda passagem do mesmo dia (o encargo em `design/especime-v3/medicoes/lugar-construtor.md`, a secção da segunda passagem de 14.09): o achado 3 (a posição de investimento internacional «em percentagem do PIB» sem excerto que o diga) ganha uma segunda origem, a linha da Comissão «net international investment position as percent of GDP, with a threshold of -35%», como as medidas com duas origens; o achado 4 (os fluxos de crédito «no fim do ano anterior» onde a Comissão diz «debt stock in t-1») reescreve as definições para o que o excerto diz; o achado 5 (a sobrecarga do custo da habitação sem «líquidos de subsídios à habitação») acrescenta o qualificador nas duas edições; o achado 6 (a abreviatura «NFC» sem texto que a expanda) procura na fonte um texto que a expanda e, não o havendo, marca a expansão «[a verificar]»; o achado 7 (os jovens NEM sem «e sexo») acrescenta-o; o achado 8 (a régua 8.4 sem guarda para `origens: []`, sem contar os blocos de origem rendidos e com a data por substring) endurece a régua; o achado 11 («países participantes»), o 12 (a balança corrente em português como média móvel para trás) e o 13 (o excerto do abandono escolar carácter a carácter, com o ponto e vírgula e a frase inteira) corrigem-se; o achado 28 (nenhum positivo conhecido para «[a verificar]») ganha um; o achado 10 é o efeito das plantas P2 e P3 na consistência do pacote e não pede nada. Os «what is fine» 14 a 27 confirmam as outras definições e as duas páginas.*

---

## Blocking

1. **`pdm-divida-publica` changes the Commission’s 60% threshold to 65%, and the built pages therefore contradict the data file.** The declared excerpt is “general government sector debt in % of GDP with a threshold of 65%.” The source says “general government sector debt in % of GDP with a threshold of 60%.” Both built editions render the source-correct 60%, while `figuras.mjs` still declares 65%; the adjacent measure declaration also uses 60%, so this is a bad excerpt rather than evidence that the source was rewritten.  
src/data/figuras.mjs:124, src/data/figuras.mjs:515, src/data/figuras.mjs:520, fontes/15.txt:103, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

## Major

2. **The Portuguese unit-labour-cost definition declares a five-year horizon, while its excerpt and English definition specify three years.** The Portuguese data says “quanto ele mudou em cinco anos”; the Commission excerpt says “3-year percentage change,” and the English data says “over three years.” The Portuguese built page silently renders “três anos,” so the public artifact is source-correct but does not match `figuras.mjs`.  
src/data/figuras.mjs:785, src/data/figuras.mjs:791, src/data/figuras.mjs:794, fontes/15.txt:101, built/uniao-europeia/index.html:1

3. **The international-investment-position definitions add “as a percentage of GDP,” which neither declared excerpt contains.** The definition in each language appends that unit, but both excerpts prove only the difference between residents’ financial assets and liabilities vis-à-vis the rest of the world. The address contains percentage-of-GDP material elsewhere, but the house rule requires the declared excerpt itself to support the definition; both built pages publish the addition without `[a verificar]`.  
src/data/figuras.mjs:700, src/data/figuras.mjs:705, src/data/figuras.mjs:707, src/data/figuras.mjs:776, src/data/figuras.mjs:779, src/data/figuras.mjs:782, fontes/01.html:1, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

4. **Both credit-flow definitions turn “debt stock in t-1” into debt held “at the end of the previous year,” adding timing that the excerpts do not state.** The Commission excerpts say respectively “NFC debt stock in t-1” and “household debt stock in t-1.” `t-1` identifies a previous period, but these excerpts do not say “end” or spell that period as a year; those additions appear in both languages and both built pages.  
src/data/figuras.mjs:552, src/data/figuras.mjs:558, src/data/figuras.mjs:560, src/data/figuras.mjs:566, src/data/figuras.mjs:836, src/data/figuras.mjs:841, src/data/figuras.mjs:844, src/data/figuras.mjs:847, src/data/figuras.mjs:852, src/data/figuras.mjs:855, fontes/15.txt:109, fontes/15.txt:111, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

5. **The housing-cost-overburden definitions drop the source’s “net of housing allowances” qualifier from both housing costs and disposable income.** The excerpt defines the measure using total housing costs “('net' of housing allowances)” and disposable income “('net' of housing allowances).” The Portuguese and English definitions retain the 40% threshold but omit both qualifications, changing what belongs in the numerator and denominator.  
src/data/figuras.mjs:692, src/data/figuras.mjs:698, src/data/figuras.mjs:955, src/data/figuras.mjs:958, src/data/figuras.mjs:963, fontes/07.txt:133, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

6. **`glossario-nfc` does not prove that the Commission’s abbreviation “NFC” means “non-financial corporations,” so the expansion remains unproven in two definitions.** The Commission excerpts say only “NFC consolidated debt” and “NFC … consolidated credit flow.” The Eurostat excerpt describes “The non-financial corporations sector” but never states that it is abbreviated as NFC. A second origin is needed for the builder’s intended expansion, but the selected excerpt does not perform that link; this affects corporate debt and corporate credit flow in both languages.  
src/data/figuras.mjs:538, src/data/figuras.mjs:543, src/data/figuras.mjs:552, src/data/figuras.mjs:558, src/data/figuras.mjs:594, src/data/figuras.mjs:600, src/data/figuras.mjs:818, src/data/figuras.mjs:821, src/data/figuras.mjs:836, src/data/figuras.mjs:839, fontes/10.txt:135, fontes/15.txt:107, fontes/15.txt:111

7. **The NEET definitions drop the source’s sex qualification.** Eurostat defines the indicator as a percentage of “the population of a given age group and sex”; both definitions retain the age-group condition but omit “and sex.” The omission is rendered in both editions.  
src/data/figuras.mjs:659, src/data/figuras.mjs:666, src/data/figuras.mjs:911, src/data/figuras.mjs:914, src/data/figuras.mjs:917, fontes/13.txt:133, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

8. **Ruler cell 8.4 is neither a source verifier nor a character-for-character verifier of rendered origin fields.** It compares each rendered definition exactly after whitespace normalization and requires an exact origin URL, but it checks publisher, document and excerpt merely by looking for their first 40 characters anywhere in the origin wrapper; the date is likewise only an expected substring. An empty `origens: []` passes, while a missing or empty excerpt in the data throws through `origensDaDefinicao`; a wholly missing rendered excerpt is noticed only if its first 40 characters are absent from the wrapper. Extra rendered origins are ignored, and the expected-origin count is derived from the declarations rather than the number of origin blocks actually found. It never reads `fontes`, tests excerpt-to-source identity, evaluates definition support, validates publishers/documents/dates against the address, or compares Portuguese meaning with English; consequently it would miss finding 1 because 60% and 65% occur after the first 40 characters, while it would catch findings 2 and 9 as page/data differences.  
src/data/figuras.mjs:978, src/data/figuras.mjs:990, src/data/figuras.mjs:1024, src/data/figuras.mjs:1037, scripts/check-lugar.mjs:1087, scripts/check-lugar.mjs:1098, scripts/check-lugar.mjs:1108, scripts/check-lugar.mjs:1121, scripts/check-lugar.mjs:1129, scripts/check-lugar.mjs:1134, scripts/check-lugar.mjs:1138, scripts/check-lugar.mjs:1511

9. **The Portuguese PDM origin displays an impossible future reading date and disagrees with both the data and English edition.** `painel-pdm.lido` is `2026-09-08`, and English renders `08.09.2026`; Portuguese renders `18.09.2026`. That displayed date is also four days after the package’s documented 14 September source fetch.  
src/data/figuras.mjs:501, src/data/figuras.mjs:505, fontes/INDICE.md:1, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

10. **The builder’s claim that 8.4 was green does not verify the supplied built pages.** The report claims the definitions and origins were rechecked and that 8.4 returned zero, but findings 2 and 9 are exact differences that the current 8.4 implementation would record. The script is explicitly written against `dist/`, whereas the audited artifacts supplied here are under `built/`; therefore the reported run cannot establish that these artifacts match the current data.  
relatorio-construtor.md:79, relatorio-construtor.md:163, relatorio-construtor.md:217, scripts/check-lugar.mjs:5, scripts/check-lugar.mjs:80, scripts/check-lugar.mjs:81, scripts/check-lugar.mjs:1098, scripts/check-lugar.mjs:1138, built/uniao-europeia/index.html:1

## Minor

11. **The Social Scoreboard definition drops the source’s restriction to “participating EU countries.”** The excerpt says it assesses “participating EU countries,” while both definitions say simply “EU countries” or “países da União.” This broadens the population stated by the source.  
src/data/figuras.mjs:611, src/data/figuras.mjs:617, src/data/figuras.mjs:735, src/data/figuras.mjs:742, src/data/figuras.mjs:745, fontes/14.txt:331

12. **The Portuguese current-account definition changes a backward three-year moving average into an average of the three previous years.** The Commission says “3-year backward moving average,” and the English definition preserves that formulation. Portuguese says “média dos três anos anteriores,” which denotes the preceding three years rather than a moving window ending at the reference observation.  
src/data/figuras.mjs:568, src/data/figuras.mjs:574, src/data/figuras.mjs:858, src/data/figuras.mjs:860, src/data/figuras.mjs:862, fontes/15.txt:93

13. **`glossario-abandono` changes the source’s semicolon to a full stop and therefore is not verbatim.** The declared excerpt ends “not involved in further education or training.” The source says “not involved in further education or training; the indicator …”, continuing the same sentence; the substantive definition is supported, but the transcription is not character-for-character.  
src/data/figuras.mjs:668, src/data/figuras.mjs:674, src/data/figuras.mjs:920, src/data/figuras.mjs:923, fontes/04.txt:133

## «What is fine»

14. **The PDM scoreboard definition preserves the limited-set, internal/external-imbalance and indicative-threshold concepts, and all three elided passages occur in order in source 15.** src/data/figuras.mjs:501, src/data/figuras.mjs:507, src/data/figuras.mjs:721, src/data/figuras.mjs:728, fontes/15.txt:87, fontes/15.txt:91

15. **The house-price-index definition is supported in both languages by the exact source description of changes in transaction prices of dwellings purchased by households.** src/data/figuras.mjs:619, src/data/figuras.mjs:625, src/data/figuras.mjs:797, src/data/figuras.mjs:800, src/data/figuras.mjs:803, fontes/06.txt:133

16. **The export-performance definitions retain the source’s advanced-economies comparison and three-year horizon without reintroducing the unsupported “share” claim.** src/data/figuras.mjs:530, src/data/figuras.mjs:536, src/data/figuras.mjs:806, src/data/figuras.mjs:812, src/data/figuras.mjs:815, fontes/15.txt:99

17. **The household-debt definition is fully supported by the Commission’s indicator line plus Eurostat’s explicit statement that NPISH abbreviates non-profit institutions serving households, so both origins are needed and adequate.** src/data/figuras.mjs:545, src/data/figuras.mjs:550, src/data/figuras.mjs:602, src/data/figuras.mjs:609, src/data/figuras.mjs:825, src/data/figuras.mjs:830, fontes/11.txt:133, fontes/15.txt:105

18. **The activity-rate definition is fully supported by the Eurostat concept excerpt and the Commission’s separate three-year-change excerpt, so both origins are needed.** src/data/figuras.mjs:576, src/data/figuras.mjs:581, src/data/figuras.mjs:627, src/data/figuras.mjs:633, src/data/figuras.mjs:865, src/data/figuras.mjs:868, fontes/02.txt:133, fontes/02.txt:135, fontes/15.txt:117

19. **The real-effective-exchange-rate definitions preserve the 41-country comparator, consumer-price deflators and three-year horizon stated by the Commission.** src/data/figuras.mjs:583, src/data/figuras.mjs:589, src/data/figuras.mjs:874, src/data/figuras.mjs:881, src/data/figuras.mjs:886, fontes/15.txt:97

20. **The PDM unemployment-rate definition correctly states unemployed people as a percentage of the labour force.** src/data/figuras.mjs:643, src/data/figuras.mjs:649, src/data/figuras.mjs:891, src/data/figuras.mjs:893, fontes/12.txt:143

21. **The employment-rate definition is supported verbatim by the raw HTML, despite `fontes/05.txt` substituting “people” for the raw page’s “persons.”** src/data/figuras.mjs:635, src/data/figuras.mjs:641, src/data/figuras.mjs:896, src/data/figuras.mjs:898, fontes/05.txt:133, fontes/05.html:501

22. **The Social Scoreboard unemployment-rate definition independently matches the same Eurostat definition.** src/data/figuras.mjs:643, src/data/figuras.mjs:649, src/data/figuras.mjs:901, src/data/figuras.mjs:903, fontes/12.txt:143

23. **The long-term-unemployment definition preserves being out of work, active job-seeking and the minimum one-year duration in both languages.** src/data/figuras.mjs:651, src/data/figuras.mjs:657, src/data/figuras.mjs:906, src/data/figuras.mjs:908, fontes/09.txt:133

24. **The AROPE definition preserves all three alternatives and the rule that a person is counted only once.** src/data/figuras.mjs:676, src/data/figuras.mjs:682, src/data/figuras.mjs:937, src/data/figuras.mjs:940, fontes/03.txt:133

25. **The S80/S20 definition correctly expresses the ratio of total income of the highest-income fifth to that of the lowest-income fifth.** src/data/figuras.mjs:684, src/data/figuras.mjs:690, src/data/figuras.mjs:946, src/data/figuras.mjs:949, fontes/08.txt:133

26. **Apart from findings 1, 2 and 9, both built editions match `figuras.mjs` for every rendered definition, origin key, publisher, document link, reading date and excerpt, including selection of `bdp-pii.excertoEn` in English.** src/data/figuras.mjs:721, src/data/figuras.mjs:770, src/data/figuras.mjs:1024, src/data/figuras.mjs:1051, src/components/OrigemDaDefinicao.astro:60, src/components/OrigemDaDefinicao.astro:92, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

27. **The declared publishers and document names identify the served Commission, Eurostat and Banco de Portugal pages, and every data-level `lido` value is a plausible past date of 8 or 9 September 2026.** src/data/figuras.mjs:500, src/data/figuras.mjs:710, fontes/INDICE.md:7, fontes/INDICE.md:21, fontes/01.txt:1, fontes/14.txt:313, fontes/15.txt:73

28. **The `[a verificar]` rule has no positive test case in this block: all 23 definitions point to at least one non-empty excerpt and neither built page renders the marker, although findings 3–7 show that a non-empty excerpt does not guarantee full support.** src/data/figuras.mjs:721, src/data/figuras.mjs:770, src/data/figuras.mjs:1037, built/uniao-europeia/index.html:1, built/en/european-union/index.html:1

## The 25 origins, one by one

| Origin key | Source file `NN` | Excerpt in source | Definition supported | Findings |
|---|---:|---|---|---:|
| `painel-pdm` | 15 | yes | yes | 9 |
| `pdm-divida-publica` | 15 | no | yes | 1 |
| `pdm-custo-do-trabalho` | 15 | yes | partly | 2 |
| `pdm-exportacoes` | 15 | yes | yes | — |
| `pdm-divida-das-empresas` | 15 | yes | partly | 6 |
| `pdm-divida-das-familias` | 15 | yes | yes | — |
| `pdm-credito-as-empresas` | 15 | yes | partly | 4, 6 |
| `pdm-credito-as-familias` | 15 | yes | partly | 4 |
| `pdm-balanca-corrente` | 15 | yes | partly | 12 |
| `pdm-taxa-de-actividade` | 15 | yes | yes | — |
| `pdm-cambio-efectivo-real` | 15 | yes | yes | — |
| `glossario-nfc` | 10 | yes | partly | 6 |
| `glossario-npish` | 11 | yes | yes | — |
| `pilar-social` | 14 | yes | partly | 11 |
| `glossario-hpi` | 06 | yes | yes | — |
| `glossario-atividade` | 02 | yes | yes | — |
| `glossario-emprego` | 05 | yes | yes | — |
| `glossario-desemprego` | 12 | yes | yes | — |
| `glossario-longa-duracao` | 09 | yes | yes | — |
| `glossario-nem` | 13 | yes | partly | 7 |
| `glossario-abandono` | 04 | partly | yes | 13 |
| `glossario-arope` | 03 | yes | yes | — |
| `glossario-s80s20` | 08 | yes | yes | — |
| `glossario-sobrecarga` | 07 | yes | partly | 5 |
| `bdp-pii` | 01 | yes | partly | 3 |