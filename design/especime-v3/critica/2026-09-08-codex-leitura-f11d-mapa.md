# Leitura a frio do Codex ao bloco F1.1d (o mapa que cresce, e o nome ao lado), 08.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, 06:33 a 07:08 UTC de 08.09.2026, 460 447 símbolos, sobre um pacote montado por `scripts/leituras/pacote.sh` (o brief, o relatório, o diff `7dfd36b7..abe7cabd` sem as capturas, os 33 ficheiros mudados na cabeça, as fontes da geometria, seis páginas construídas e as duas primeiras páginas de antes) com cinco plantas de três classes (5 de 5 vistas; o registo está no `.plantas.json` ao lado): M1, o gesto lido só do `pointerType` do clique, apanhada no Blocking 1; M5, a ligação dos Açores a `/regioes/azores` na página construída, apanhada no Blocking 2; M2, o tecto da R9 a 16 por cento, apanhado no Major 3; M4, os 120 concelhos aos 44 px, apanhados no Major 6; M3, a planta do primeiro toque só com a célula do Chromium, apanhada no Major 10. Triagem do lugar de direção: reais e para a segunda passagem (ramo `mapa-2026-09-07`, Claude Opus 5, no mesmo dia) o Major 4 (o portão não confere a geometria do segundo nível contra as fontes), o Major 7 (o toque só em português, numa região e num concelho, sem afirmar o nome), o Major 9 (um `fetch` falhado deixa a ligação da região morta), o Major 10 na parte real (a planta a tirar todos os `preventDefault`, e o corredor das plantas a aceitar uma célula em vez de todas), o Major 11 (a P5 sem o antes), o Major 12 (a P7 a dizer «anunciado» quando mede o atributo e a árvore), o Major 13 (`src/data/regioes.mjs` fora do manifesto de sha256), e os Minor 15 a 18 (20 estragos e não 19, o guião dos 84 de 308 sem afirmar as contagens, os códigos HTTP da P4 fora do ficheiro das medidas, o 1,4 u sem artefacto); decisões escritas sem código: o Major 5 (a P1 é medida e não exigida, por decisão, e a régua e o relatório passam a dizê-lo, com a definição do quadrado e a medida centrada do Sonnet ao lado) e o Major 8 (a página de uma região abre-se pela porta do lugar do nome, e não por um segundo toque, porque a região cresceu). Os 19 a 29 reproduzem a geometria, as contagens, os bytes, o inventário e as células retiradas com razão. A medição cega do Sonnet do mesmo dia está registada na §1.102.*

---

## Blocking

1. **On WebKit, the first tap on a municipality can navigate immediately, violating P3.** The script records the touch at `pointerdown`, but the copied click handler ignores that record and checks only the click’s `pointerType`. The report establishes that WebKit reports such a click as `mouse`, so `preventDefault()` is skipped. The diff contains the intended combined check, while the copied file does not, and the stored WebKit pass therefore cannot describe the supplied runtime.

public/js/mapa-regioes.js:302, public/js/mapa-regioes.js:316, public/js/mapa-regioes.js:353, diff.patch:1294, relatorio-construtor.md:167, relatorio-construtor.md:170, design/especime-v3/medicoes/mapa-medidas.json:59

2. **The Portuguese Açores country shape links to `/regioes/azores`, while the fallback list, English edition, measurement artifact and report use the `acores` slug.** Without JavaScript, selecting that shape follows the inconsistent destination directly. With JavaScript, the name-place door copies the same inconsistent `href`, so it remains reader-facing after the region grows. Both copied components invoke the same route builder with the same `acores` slug, making the supplied Portuguese build inconsistent with the copied changed sources.

built/index.html:1, built/en/index.html:1, src/components/inicio/MapaRespira.astro:353, src/components/inicio/MapaRespira.astro:356, src/components/inicio/ListaDosNomes.astro:147, src/components/inicio/ListaDosNomes.astro:149, public/js/mapa-regioes.js:139, public/js/mapa-regioes.js:145, design/especime-v3/medicoes/mapa-medidas.json:617, relatorio-construtor.md:183

## Major

3. **The copied R9 gate permits 16% area error, ten times the 1.6% ceiling stated by the report and diff.** Recalculation from the packaged geometry gives a worst deviation of about 0.80858%, consistent with the report’s rounded 0.809%. The copied condition therefore accepts errors almost twenty times the measured worst case. This is the second exact disagreement between a copied file and its changed region in the diff.

scripts/check-mapa.mjs:485, scripts/check-mapa.mjs:494, scripts/check-mapa.mjs:691, scripts/check-mapa.mjs:698, diff.patch:1453, relatorio-construtor.md:215, src/data/mapa-regioes.gerado.json:99

4. **R9 does not prove that a region is the union of the municipality geometry that readers see.** It compares the area of generated `r.d` with scalar source-area totals, then checks the generated box and representative points. It never compares the client municipality paths, boxes or field against the source, although the browser draws `c.d` using `dados.campo`. Corrupted second-level shapes or a wrong client field could therefore pass R8 and R9 unchanged; the R9 plants alter only the generated region path, box or points.

public/js/mapa-regioes.js:153, public/js/mapa-regioes.js:155, public/js/mapa-regioes.js:166, public/js/mapa-regioes.js:173, scripts/check-mapa.mjs:673, scripts/check-mapa.mjs:683, scripts/check-mapa.mjs:691, scripts/check-mapa.mjs:716, scripts/check-mapa.mjs:920, scripts/check-mapa.mjs:936

5. **The P1 ruler reports green without enforcing P1’s 44 px requirement, and it even accepts the two measured zero-sized municipality targets.** The brief requires 9 of 9 regions and 308 of 308 municipalities at or above 44 px. P1a requires only nine nonzero measurements, while P1b requires only 308 entries and representative points inside; neither requires the reported `chegam` count to equal the total. The ruler explicitly replaces the acceptance condition with the existence of a fallback name network.

brief.md:31, tests/inicio/mapa-regioes.mjs:30, tests/inicio/mapa-regioes.mjs:287, tests/inicio/mapa-regioes.mjs:337, tests/inicio/mapa-regioes.mjs:343, tests/inicio/mapa-regioes.mjs:345, design/especime-v3/medicoes/mapa-medidas.json:14

6. **The report inflates the municipality P1 result from 20 to 120 in its headline paragraph.** The nine per-region rows sum to 20, the stored measurement says 20, and the report itself returns to 20 later. Thus the central acceptance result is contradicted inside the report by a factor of six.

relatorio-construtor.md:105, relatorio-construtor.md:110, relatorio-construtor.md:118, relatorio-construtor.md:128, design/especime-v3/medicoes/mapa-medidas.json:228

7. **P2’s required touch behavior is not tested for 9 regions and 30 municipalities in both editions.** P2a uses mouse and focus, while P2b uses only mouse; neither performs touch gestures. The touch path in P3 is Portuguese-only and samples one region and one municipality, and its pass condition does not assert either the touched region name, its door, or the municipality name that its proof text prints. English touch behavior and most touch name updates can therefore fail while all cells remain green.

brief.md:32, tests/inicio/mapa-regioes.mjs:382, tests/inicio/mapa-regioes.mjs:406, tests/inicio/mapa-regioes.mjs:480, tests/inicio/mapa-regioes.mjs:509, tests/inicio/mapa-regioes.mjs:517, tests/inicio/mapa-regioes.mjs:585

8. **The required second tap on a region is neither implemented nor tested.** Every region click is always prevented and used to grow the region. The country group containing that region is then hidden, so the same region cannot receive the promised second tap to open its page. P3a performs only the first region tap, while P3c tests the separate name-place door.

brief.md:33, public/js/mapa-regioes.js:196, public/js/mapa-regioes.js:202, public/js/mapa-regioes.js:332, public/js/mapa-regioes.js:336, tests/inicio/mapa-regioes.mjs:480, tests/inicio/mapa-regioes.mjs:565

9. **A failed region JSON request permanently intercepts the region’s native link instead of falling back to navigation.** The click handler calls `preventDefault()` before fetching on every region click. Missing fetch support, a non-OK response, malformed data and rejection all return silently or are swallowed, with no state permitting the next click to follow the link. The comment claiming that the next touch follows the server `href` is therefore false.

public/js/mapa-regioes.js:225, public/js/mapa-regioes.js:231, public/js/mapa-regioes.js:232, public/js/mapa-regioes.js:238, public/js/mapa-regioes.js:241, public/js/mapa-regioes.js:243, public/js/mapa-regioes.js:332, public/js/mapa-regioes.js:336

10. **The first-touch plant does not distinguish the actual municipality/WebKit defect it claims to guard.** It removes every `preventDefault()` in the script, causing the initial region tap to navigate before the municipality condition is meaningfully tested. The copied plant accepts only a Chromium failure, whereas the diff and report name both engines. More generally, the plant runner uses `some`, so plants described as biting in both editions or engines are accepted when only one selected cell fails.

tests/inicio/mapa-regioes.mjs:487, tests/inicio/mapa-regioes.mjs:809, tests/inicio/mapa-regioes.mjs:811, tests/inicio/mapa-regioes.mjs:813, tests/inicio/mapa-regioes.mjs:861, diff.patch:5496, relatorio-construtor.md:299, relatorio-construtor.md:302

11. **P5 does not measure the page before and after the block as the brief requires.** It measures the current build once with the new 38-name drawer closed and once with that same drawer open. The supplied `antes` document instead contains the former 29-area map and former 29-name list, so opening the new drawer does not reconstruct the starting page. The reported 690 px reduction proves only the height of the new drawer’s contents.

brief.md:35, tests/inicio/mapa-regioes.mjs:669, tests/inicio/mapa-regioes.mjs:673, tests/inicio/mapa-regioes.mjs:678, tests/inicio/mapa-regioes.mjs:684, relatorio-construtor.md:189, antes/index.html:1, built/index.html:1

12. **P7 does not verify that a screen reader announces the live-region update.** `ariaSnapshot()` proves only that the accessible tree contains different text before and after the pointer move. The other cell independently checks the literal `aria-live="polite"` attribute; neither observes a live announcement, despite the brief and report claiming one was confirmed.

brief.md:37, tests/inicio/mapa-regioes.mjs:760, tests/inicio/mapa-regioes.mjs:766, tests/inicio/mapa-regioes.mjs:767, tests/inicio/mapa-regioes.mjs:772, tests/inicio/mapa-regioes.mjs:775, relatorio-construtor.md:223

13. **The source-hash provenance is incomplete and cannot be reproduced from this package.** Of 35 declared hashes, the 33 whose files are present match, but `mapa/manifest.json` and `src/data/concelhos.gerado.json` are declared and absent. The generator also imports the missing `src/data/regioes.mjs`, which controls region names, codes, membership lookup and ordering, but only files read through `leTexto()` enter the hash manifest. R8 imports that same untracked configuration and merely loops over whichever hash entries the generated file already declares, so it cannot detect the omitted dependency or run from this package.

src/data/mapa-regioes.gerado.json:16, src/data/mapa-regioes.gerado.json:46, src/data/mapa-regioes.gerado.json:51, scripts/mapa-regioes.mjs:80, scripts/mapa-regioes.mjs:374, scripts/mapa-regioes.mjs:381, scripts/mapa-regioes.mjs:593, scripts/mapa-regioes.mjs:617, scripts/check-mapa.mjs:65, scripts/check-mapa.mjs:657

## Minor

14. **The claimed final build, typecheck, verify and GitHub-green states are unshown and are not reproducible from the supplied package.** The report provides exit codes, times and remote run identifiers but no logs. The packaged command definitions require many omitted repository files, the new ruler requires `dist/` rather than the supplied `built/`, and the generator immediately depends on the missing region configuration. These remain claims about another environment, not measurements contained here.

relatorio-construtor.md:263, relatorio-construtor.md:267, relatorio-construtor.md:275, package.json:12, package.json:41, tests/inicio/mapa-regioes.mjs:75, tests/inicio/mapa-regioes.mjs:85, scripts/mapa-regioes.mjs:80

15. **The map gate contains 20 planted failures, not the reported 19.** The object contains five R1-R5 entries, three R6 entries, six R7 entries, two R8 entries and four R9 entries, and the runner executes every key. Both P6 and P9 repeat the incorrect 19-of-19 count.

scripts/check-mapa.mjs:781, scripts/check-mapa.mjs:812, scripts/check-mapa.mjs:846, scripts/check-mapa.mjs:899, scripts/check-mapa.mjs:920, scripts/check-mapa.mjs:936, scripts/check-mapa.mjs:952, relatorio-construtor.md:199, relatorio-construtor.md:290

16. **The 84-of-308 district-level measurement that decided against an intermediate level is not reproduced by an output artifact and can silently become a partial measurement.** Its only packaged evidence is the same result copied into comments and the builder’s report. The script skips any district whose SVG evaluation fails, never asserts 29 districts or 308 municipalities, and still prints a total and exits normally. It also requires a full `dist/`, which is not the supplied `built/` selection.

relatorio-construtor.md:315, relatorio-construtor.md:321, design/especime-v3/medicoes/mapa-alvos-nos-distritos.mjs:15, design/especime-v3/medicoes/mapa-alvos-nos-distritos.mjs:21, design/especime-v3/medicoes/mapa-alvos-nos-distritos.mjs:30, design/especime-v3/medicoes/mapa-alvos-nos-distritos.mjs:63, design/especime-v3/medicoes/mapa-alvos-nos-distritos.mjs:69, design/especime-v3/medicoes/mapa-alvos-nos-distritos.mjs:76

17. **The reported “9 of 9 respond 200” no-script result is discarded from the stored measurement artifact.** The ruler collects HTTP statuses in `codigos` and uses them to decide the cell, but saves only `r`, which contains the destinations and structural fields. Consequently the JSON reproduces nine URLs, not nine HTTP responses, and one of those stored Portuguese URLs already contradicts the supplied build.

tests/inicio/mapa-regioes.mjs:638, tests/inicio/mapa-regioes.mjs:647, tests/inicio/mapa-regioes.mjs:654, tests/inicio/mapa-regioes.mjs:664, design/especime-v3/medicoes/mapa-medidas.json:613, relatorio-construtor.md:183

18. **The 1.4-unit cross-grid deviation and the claimed twelve captures have no measurement evidence in the package.** The 1.4 value appears only as prose in the report and as a repeated source comment, not in the generated measurements. Likewise, the report names a capture directory and count, but no capture evidence is supplied.

relatorio-construtor.md:37, relatorio-construtor.md:40, scripts/mapa-regioes.mjs:440, scripts/mapa-regioes.mjs:443, relatorio-construtor.md:401, relatorio-construtor.md:403

## «What is fine»

19. **The six split units are independently reproduced by the CSV: Aveiro, Guarda, Leiria, Lisboa, Setúbal and Viseu each contain municipalities from exactly two NUTS II regions, leaving 23 of 29 whole units.** public/dados/caop-2025-municipios-continente.csv:15, public/dados/caop-2025-municipios-continente.csv:18, public/dados/caop-2025-municipios-continente.csv:132, public/dados/caop-2025-municipios-continente.csv:145, public/dados/caop-2025-municipios-continente.csv:146, public/dados/caop-2025-municipios-continente.csv:147, public/dados/caop-2025-municipios-continente.csv:162, public/dados/caop-2025-municipios-continente.csv:166, public/dados/caop-2025-municipios-continente.csv:232, public/dados/caop-2025-municipios-continente.csv:233, public/dados/caop-2025-municipios-continente.csv:269, public/dados/caop-2025-municipios-continente.csv:270, src/data/mapa-regioes.gerado.json:56

20. **The autonomous-region source names are exactly “Região Autónoma dos Açores” and “Região Autónoma da Madeira”, and both mappings are explicitly handled by generator and gate.** public/dados/caop-2025-municipios-acores.csv:16, public/dados/caop-2025-municipios-madeira.csv:15, scripts/mapa-regioes.mjs:398, scripts/check-mapa.mjs:584

21. **The nine regional municipality counts reproduce as 19, 47, 16, 77, 9, 11, 86, 34 and 9, which sum to 308 and agree with the nine client files.** src/data/mapa-regioes.gerado.json:106, src/data/mapa-regioes.gerado.json:139, src/data/mapa-regioes.gerado.json:167, src/data/mapa-regioes.gerado.json:192, src/data/mapa-regioes.gerado.json:222, src/data/mapa-regioes.gerado.json:247, src/data/mapa-regioes.gerado.json:273, src/data/mapa-regioes.gerado.json:305, src/data/mapa-regioes.gerado.json:332

22. **Parsing `mapa/pais.json` independently reproduces 5,537 edges and 3,781 inverse edges, while the generated projection maximum 1.2747 and country tolerance 3.1071 support the report’s rounded values.** mapa/pais.json:1, relatorio-construtor.md:44, relatorio-construtor.md:53, src/data/mapa-regioes.gerado.json:65, src/data/mapa-regioes.gerado.json:68

23. **The two byte totals reproduce exactly from file metadata: 26,776 bytes for the generated country geometry and 237,116 bytes across the nine client files.** relatorio-construtor.md:68, relatorio-construtor.md:70, src/data/mapa-regioes.gerado.json:1, public/dados/mapa/regiao-acores.json:1, public/dados/mapa/regiao-peninsula-de-setubal.json:1

24. **Apart from the erroneous “120”, the stored P1 table agrees with the report: 3 of 9 at 390 with median 18, 4 of 9 at 1280 with median 24, and 20 of 308 municipalities with median 16.** relatorio-construtor.md:88, relatorio-construtor.md:103, relatorio-construtor.md:108, design/especime-v3/medicoes/mapa-medidas.json:4, design/especime-v3/medicoes/mapa-medidas.json:9, design/especime-v3/medicoes/mapa-medidas.json:14, design/especime-v3/medicoes/mapa-medidas.json:228

25. **Apart from the Portuguese Açores destination, both built front pages have the intended no-script structure: nine country links, an empty hidden second-level group, and a closed drawer containing nine regions plus 29 Carta units.** built/index.html:1, built/en/index.html:1, src/components/inicio/MapaRespira.astro:352, src/components/inicio/MapaRespira.astro:376, src/components/inicio/ListaDosNomes.astro:142, src/components/inicio/ListaDosNomes.astro:147, src/components/inicio/ListaDosNomes.astro:166

26. **Both Lisboa district editions contain the municipality name-place and shared script, while both supplied Norte region editions omit them as reported.** src/views/DistritoView.astro:145, src/views/DistritoView.astro:183, src/views/DistritoView.astro:248, built/distritos/lisboa/index.html:2, built/en/districts/lisboa/index.html:2, built/regioes/norte/index.html:2, built/en/regions/norte/index.html:2

27. **The inventory change is exact: twelve new live lines, six per edition, and two superseded map labels marked `retirada`, with the revision recorded.** design/especime-v3/INVENTARIO-FRASES.md:1165, design/especime-v3/INVENTARIO-FRASES.md:1169, design/especime-v3/INVENTARIO-FRASES.md:2294, design/especime-v3/INVENTARIO-FRASES.md:2305, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:61

28. **The retired M1/M2 cells, the five removed home-page M6 clicks and the four retired plants all have explicit written reasons rather than silent deletion.** tests/inicio/mapa-distritos.mjs:399, tests/inicio/mapa-distritos.mjs:407, tests/inicio/mapa-distritos.mjs:653, tests/inicio/mapa-distritos.mjs:687, tests/inicio/mapa-distritos.mjs:923

29. **SVG group hiding is handled correctly by changing the attribute and by an explicit CSS rule for SVG elements.** public/js/mapa-regioes.js:183, public/js/mapa-regioes.js:202, src/styles/mapa.css:156, src/styles/mapa.css:160