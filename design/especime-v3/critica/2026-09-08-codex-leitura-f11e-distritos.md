# Leitura a frio do Codex ao bloco F1.1e (os distritos e as ilhas voltam ao mapa), 08.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, 17:20 a 17:58 UTC de 08.09.2026, 605 030 símbolos (o maior pacote do dia: 2,5 MB, com os 29 ficheiros servidos e três páginas construídas), sobre um pacote montado por `scripts/leituras/pacote.sh` (o brief, o relatório, o diff `fe6478aa..635e6d7f`, os ficheiros mudados, `index.html`, `en/index.html` e `distritos/evora/index.html` de `dist/`) com cinco plantas de três classes (5 de 5 vistas; o registo está no `.plantas.json` ao lado): K1, o fragmento `#unidade=` sem o `[a-z0-9-]+`, apanhada no Major 5; K2, a R8 a comparar comprimentos em vez de bytes, apanhada no Blocking 3; K3, «28 de 29 respondem 200» na tabela, apanhada no Minor 13; K4, a U1a a aceitar 9 áreas, apanhada no Major 7; K5, o `aria-label` do mapa trocado entre os níveis, apanhada no Blocking 2. Triagem do lugar de direção: o Blocking 1 (a U7 na página real do concelho) fica para a aterragem do F1.10, dono do ficheiro nesse dia, e o relatório corrige o que diz do brief; o Major 4 (o segundo toque numa unidade) resolve-se por decisão (uma unidade abre-se pela porta; o segundo toque é do concelho), escrita na emenda do brief; reais e para a segunda passagem (ramo `distritos-2026-09-08`, Claude Opus 5, no mesmo dia): o Major 6 (as respostas fora de ordem), o Major 8 (o portão cala as páginas construídas em falta), o Major 9 (as molduras da Madeira e dos Açores sobrepostas, que vem do F1.1c), o Major 10 (três plantas de `lista.mjs` que não mordem), o Major 11 (o copiador dono da pasta inteira), o Major 12 (o que o pacote não reproduz), os Minor 13 a 17 (os números, as duas etiquetas `retirada` a render, a mediana, a U1c, a U2 autorreferente). O 18 (o rodapé diz «a política da casa») não é achado: é o vocabulário do sítio para si mesmo. Os 19 a 25 confirmam as 28 células, as 29 ligações e a gaveta fechada, a página de Évora, o `pointerdown`, o `data-ficheiro` fixo, o copiador byte a byte e os 394 614 B.*

---

## Blocking

1. **The block does not satisfy U7 on the real municipality page.** The brief explicitly requires the municipality page to use its unit-level map, but the report incorrectly says the brief prohibited changing `MunicipioView.astro` and admits the change remains unfinished. U7 constructs and then deletes a synthetic page, so it proves only that the component can render that level. Without the omitted prop, the component’s localizer default remains the 308-point map.  
brief.md:14, brief.md:31, relatorio-construtor.md:271, relatorio-construtor.md:293, relatorio-construtor.md:513, tests/inicio/mapa-unidades.mjs:1010, tests/inicio/mapa-unidades.mjs:1017, src/components/inicio/MapaRespira.astro:136

2. **The copied component gives the map the wrong accessible name at both levels.** At `pais`, it selects `concelhosLabel`; at `unidade`, it selects `distritosLabel`, in both languages. The diff requires the opposite, and the supplied built home pages contain the correct country label, proving that the source, diff and build do not represent the same state. U7 reads the label but omits it from the passing condition, so this regression remains green.  
src/components/inicio/MapaRespira.astro:343, src/i18n/strings.mjs:625, src/i18n/strings.mjs:685, src/i18n/strings.mjs:2238, src/i18n/strings.mjs:2252, diff.patch:4677, tests/inicio/mapa-unidades.mjs:1120, tests/inicio/mapa-unidades.mjs:1151, built/index.html:1, built/en/index.html:1

3. **R8 does not compare the motor artefact with `public/` byte for byte.** It compares only buffer lengths, so an equal-length alteration copied into both `public/` and `dist/` passes every comparison. The diff requires `servido.equals(doMotor)`, while the R8 plant inserts an extra character and therefore tests only length inequality, not equal-length byte corruption. Missing motor, public or dist files do produce errors, but each `continue` prevents the remaining sides from being examined.  
scripts/check-mapa.mjs:506, scripts/check-mapa.mjs:512, scripts/check-mapa.mjs:526, scripts/check-mapa.mjs:531, scripts/check-mapa.mjs:533, scripts/check-mapa.mjs:537, scripts/check-mapa.mjs:775, diff.patch:2363, relatorio-construtor.md:79, relatorio-construtor.md:243

## Major

4. **A successful unit can never be opened by the second touch required by U3.** Every unit click is prevented and starts or repeats the fetch; there is no “already touched” state for units. Once the fetch succeeds, the country group and its unit target are hidden, so a second touch is impossible. The report and ruler explicitly replace the brief’s second-touch rule with a door-only rule without authority from the brief.  
brief.md:12, brief.md:27, public/js/mapa-unidades.js:367, public/js/mapa-unidades.js:376, public/js/mapa-unidades.js:380, public/js/mapa-unidades.js:214, relatorio-construtor.md:209, tests/inicio/mapa-unidades.mjs:77, tests/inicio/mapa-unidades.mjs:789

5. **An invalid `#unidade=` fragment can throw before it is rejected.** The copied script captures every non-empty suffix and interpolates it unescaped into `querySelector`; a suffix ending in a raw backslash can make that selector syntactically invalid. The diff restricts the slug to `[a-z0-9-]+`. U4 loads only the valid `#unidade=evora` with JavaScript disabled, so the parser it claims to test never executes.  
public/js/mapa-unidades.js:282, public/js/mapa-unidades.js:285, diff.patch:1817, diff.patch:1819, tests/inicio/mapa-unidades.mjs:887, tests/inicio/mapa-unidades.mjs:893, tests/inicio/mapa-unidades.mjs:927

6. **Out-of-order fetch responses can restore the wrong unit or undo browser-back navigation.** `abre` has neither cancellation nor a check that its callback still corresponds to the current fragment or latest gesture. Rapidly selecting A then B allows A’s later response to overwrite B; clearing the fragment while A is pending allows A to reopen after the page has returned to the country. History is also written in response order rather than gesture order.  
public/js/mapa-unidades.js:255, public/js/mapa-unidades.js:264, public/js/mapa-unidades.js:269, public/js/mapa-unidades.js:288, public/js/mapa-unidades.js:297, public/js/mapa-unidades.js:380, public/js/mapa-unidades.js:382, public/js/mapa-unidades.js:414

7. **U1a can pass after twenty of the twenty-nine country areas disappear.** The copied ruler accepts `entradas.length >= 9`, despite its own commentary and the report saying the measurement must cover 29 of 29. The diff requires exact equality. The saved artifact happened to measure 29, but the current ruler no longer enforces that precondition.  
tests/inicio/mapa-unidades.mjs:49, tests/inicio/mapa-unidades.mjs:376, tests/inicio/mapa-unidades.mjs:378, diff.patch:6473, diff.patch:6474, relatorio-construtor.md:100, design/especime-v3/medicoes/distritos-medidas.json:4

8. **The map gate silently omits missing built pages instead of failing for their absence.** `lePagina` returns `null`, and `leMundo` adds a home, district, line or index page only when it exists. R3 and R4 then iterate only the surviving pages, making R4 vacuous if a home edition is absent; R2 protects Portuguese municipality coverage but not the missing English district edition. The final “district pages built” number is printed, not asserted to equal 58.  
scripts/check-mapa.mjs:116, scripts/check-mapa.mjs:135, scripts/check-mapa.mjs:139, scripts/check-mapa.mjs:142, scripts/check-mapa.mjs:230, scripts/check-mapa.mjs:257, scripts/check-mapa.mjs:279, scripts/check-mapa.mjs:848

9. **The Madeira and Azores inset frames overlap in both supplied home pages.** Madeira occupies x 1527–2885 and y 4526–8022; the Azores occupy x 260–2531 and y 6096–7392. Their frames therefore intersect over 1004 by 1296 map units. The report refers to eight captures that should expose this, but those captures are not included.  
built/index.html:1, built/en/index.html:1, src/components/inicio/MapaRespira.astro:361, src/components/inicio/MapaRespira.astro:363, relatorio-construtor.md:472

10. **U9 is knowingly incomplete because three of fifteen `lista.mjs` plants do not make any cell red.** The brief requires planted defects to turn red, while the report records only 12 of 15 and names the three ineffective plants. The plant runner treats any such failure as an overall non-zero exit, so this is not merely an informational measurement.  
brief.md:33, relatorio-construtor.md:348, relatorio-construtor.md:354, relatorio-construtor.md:430, tests/inicio/lista.mjs:984, tests/inicio/lista.mjs:1052, tests/inicio/lista.mjs:1109, tests/inicio/lista.mjs:1152, tests/inicio/lista.mjs:1175

11. **The copier deletes every non-unit file in the shared `public/dados/mapa` directory.** Its output directory is the whole map-data directory, and normal write mode calls `unlinkSync` for any filename outside the current twenty-nine-unit set. This is unsafe ownership: a legitimate present or future map artefact with another name would be silently removed. R8 enforces the same directory-wide exclusivity.  
scripts/mapa-unidades.mjs:53, scripts/mapa-unidades.mjs:55, scripts/mapa-unidades.mjs:140, scripts/mapa-unidades.mjs:146, scripts/mapa-unidades.mjs:151, scripts/check-mapa.mjs:542, scripts/check-mapa.mjs:550

12. **The remaining green-run, capture and baseline claims are not reproducible from this package.** The report gives results for `94/94`, `43/43`, `9/9`, eighteen plants, 7,222 built pages, three zero exit codes and eight captures, but supplies no corresponding result artefacts. The rulers abort without `dist/`, and the map gate also aborts without the omitted motor manifest. U5 reads the omitted prior `mapa-medidas.json`, while the older district-target script says it writes another JSON result that is also absent. The report itself says the blind Sonnet measurement was still unfinished.  
relatorio-construtor.md:315, relatorio-construtor.md:348, relatorio-construtor.md:472, relatorio-construtor.md:479, relatorio-construtor.md:505, relatorio-construtor.md:518, tests/inicio/mapa-unidades.mjs:143, tests/inicio/mapa-unidades.mjs:966, scripts/check-mapa.mjs:83, scripts/check-mapa.mjs:87, design/especime-v3/medicoes/mapa-alvos-nos-distritos.mjs:35, design/especime-v3/medicoes/mapa-alvos-nos-distritos.mjs:110

## Minor

13. **Three numerical statements in the report contradict the supplied files.** The U4 summary says 28 of 29 targets respond, while its detailed section and saved result say 29 of 29. The supplied `scripts/mapa-unidades.mjs` is 7,428 bytes, not the reported 7,172. The report says eight lines changed to `retirada`, but the relevant table contains six new retired rows; the two accessible-label rows remained retired and merely received new reasons.  
relatorio-construtor.md:19, relatorio-construtor.md:71, relatorio-construtor.md:222, relatorio-construtor.md:463, scripts/mapa-unidades.mjs:1, scripts/mapa-unidades.mjs:170, design/especime-v3/medicoes/distritos-medidas.json:104, design/especime-v3/INVENTARIO-FRASES.md:1165, design/especime-v3/INVENTARIO-FRASES.md:1169, design/especime-v3/INVENTARIO-FRASES.md:2338, design/especime-v3/INVENTARIO-FRASES.md:2343

14. **The phrase inventory knowingly marks two rendered accessible labels as `retirada`, making its stated prohibition false.** The inventory defines `retirada` as a phrase that cannot render again, yet both rows explicitly say their labels have returned and remain `retirada` only because the voice ruler cannot inspect SVG `aria-label`. Both supplied home builds render those labels.  
design/especime-v3/INVENTARIO-FRASES.md:48, design/especime-v3/INVENTARIO-FRASES.md:1165, design/especime-v3/INVENTARIO-FRASES.md:1169, relatorio-construtor.md:405, built/index.html:1, built/en/index.html:1

15. **The ruler does not calculate the usual median for even-sized populations.** It selects the upper middle observation at index `floor(n/2)` instead of averaging the two middle observations. The reported municipality population is 308, and several per-unit populations are also even, so the method does not by itself establish the values described as medians.  
tests/inicio/mapa-unidades.mjs:338, tests/inicio/mapa-unidades.mjs:340, design/especime-v3/medicoes/mapa-alvos-nos-distritos.mjs:106, relatorio-construtor.md:129

16. **U1c does not prove that the municipality index contains each of the 308 links once.** It accepts any count greater than or equal to 308 and never compares the link slugs with the expected municipality set. A missing municipality compensated by a duplicate, or any number of extra links, remains green.  
tests/inicio/mapa-unidades.mjs:447, tests/inicio/mapa-unidades.mjs:453, tests/inicio/mapa-unidades.mjs:459, tests/inicio/mapa-unidades.mjs:461

17. **The top-level U2 name checks are self-referential and do not prove the Carta’s names.** U2a checks only that hover and focus repeat the same non-empty rendered text, while U2d reads its expected value from the same SVG `<title>` that drives the name slot. A wrong but non-empty title copied consistently into the slot passes both checks.  
tests/inicio/mapa-unidades.mjs:478, tests/inicio/mapa-unidades.mjs:483, tests/inicio/mapa-unidades.mjs:490, tests/inicio/mapa-unidades.mjs:573, tests/inicio/mapa-unidades.mjs:584, tests/inicio/mapa-unidades.mjs:611, relatorio-construtor.md:17

18. **Both public home pages contain reader-visible prose about “the house”.** The Portuguese footer says “a política da casa” and the English footer says “the house policy”. That directly violates the stated house rule regardless of whether this block introduced the footer.  
built/index.html:1, built/en/index.html:1

## «What is fine»

19. **Taken on its own, the saved block artifact contains 28 passing cells and internally agrees with the reported current U1 totals: 29 areas, 308 municipalities, 105 reaching 44 px and a recorded median of 36 px.** design/especime-v3/medicoes/distritos-medidas.json:2, design/especime-v3/medicoes/distritos-medidas.json:143, design/especime-v3/medicoes/distritos-medidas.json:462

20. **Both supplied home builds have 29 unit anchors, 29 corresponding anchors in a closed names drawer, no region links inside that map or drawer, and a hidden dynamic name slot for the no-script state.** built/index.html:1, built/en/index.html:1

21. **The supplied Évora district page contains the same fourteen municipality slugs, order and Portuguese destinations declared by its served JSON.** built/distritos/evora/index.html:1, public/dados/mapa/unidade-evora.json:1

22. **The pointer handling correctly preserves a municipality’s first touch through Chromium and WebKit-style event sequences while allowing an ordinary mouse click or Enter to follow its link immediately.** public/js/mapa-unidades.js:337, public/js/mapa-unidades.js:351, public/js/mapa-unidades.js:354, public/js/mapa-unidades.js:388, public/js/mapa-unidades.js:395

23. **A valid fragment cannot itself choose an arbitrary fetched path because the fetch URL is read from the matched server-rendered unit anchor’s fixed `data-ficheiro`.** public/js/mapa-unidades.js:295, public/js/mapa-unidades.js:297, src/components/inicio/MapaRespira.astro:417, src/components/inicio/MapaRespira.astro:421

24. **The copier itself is byte-preserving: verification uses `Buffer.equals`, and write mode writes the original raw buffer without parsing and reserialising it.** scripts/mapa-unidades.mjs:98, scripts/mapa-unidades.mjs:123, scripts/mapa-unidades.mjs:132

25. **The served-file arithmetic is reproducible: the twenty-nine supplied JSON files total 394,614 bytes, contain 308 distinct municipality slugs, and reproduce the reported 24,245-byte Viseu maximum and 3,691-byte São Jorge minimum.** public/dados/mapa/unidade-viseu.json:1, public/dados/mapa/unidade-ilha-de-sao-jorge.json:1, design/especime-v3/medicoes/distritos-medidas.json:898, relatorio-construtor.md:72