# Leitura a frio do Codex ao bloco F1.13 («as palavras da porta e o índice dos domínios»), 15.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, efémero (o modelo fixado em `ler.sh`, lido no registo de eventos), 12:31:21 a 12:45:13 UTC de 15.09.2026, 259 976 símbolos, sobre um pacote montado por `pacote.sh` de dentro da worktree (base `bb0b4c39`, cabeça `d913b528`: o brief, o relatório do construtor, o diff de 2 134 linhas, os 27 ficheiros mudados, oito páginas construídas da cabeça nas duas edições e as oito de antes lidas do sítio no ar). **Três plantas de três classes, 3 de 3 vistas** (o registo no `.plantas.json` ao lado): W1, «All the studies» no ficheiro das cadeias contra «All studies» na página (o achado 2); W2, a página portuguesa a render «cada um com a sua fonte» (o achado 1); W3, a célula A18 sem exigir a frase antiga a zero (o achado 3). O achado 4 (as medições, o axe, os portões, as contagens e as capturas sem prova no pacote) é do pacote, que não levava as saídas das réguas nem as 40 capturas, e vale como lição repetida para os pacotes dos blocos: as saídas medidas entram. **Os reais:** o 5 (a gaveta dos nomes escondida sempre que a folha carrega, e não só quando o mapa funciona: um leitor com guião mas com o mapa falhado fica sem a lista), o 7 (as seis etiquetas das portas fora do inventário, contra o brief), o 8 (a célula A20 abre `/` e `/en` em vez de `/dominios` e `/en/domains`, achata os nomes e procura «cinco» à letra), o 9 (a L3 descarta os elementos `data-nonledger`, onde vive o rótulo visível da marca, e o chão do Método soma as duas edições; nenhuma planta mostra a L3 vermelha), o 10 (a ordem das folhas nas páginas de área trocada pelo bloco, com a geometria da coluna do valor a mudar sem decisão nem prova no pacote), o 11 (o relatório diz «o primeiro ecrã não muda» e mede 18,2 px de descida abaixo da manchete, porque a etiqueta da busca passou a duas linhas a 390) e o 12 (40 e 20 capturas ditas em sítios diferentes). O achado 6 (sem guião a gaveta está visível mas fechada) é o brief do lugar de direção que escreveu «aberta como hoje» onde «hoje» era a lista fechada com o `<summary>` à vista (a decisão do F1.1d): a gaveta fica fechada e visível sem guião, como está, e o brief emenda-se.*

*Triagem do lugar de direção, pela delegação (§1.98): os achados 5, 7, 8, 9, 10, 11 e 12 fecham-se na mesma worktree antes de aterrar (o 10 pela decisão de manter o estado novo, consistente com o índice dos números, escrito explicitamente numa regra só, para a ordem deixar de ser emergente); o 6 é uma emenda ao brief; o bloco aterra com o «sim» do diretor dado sobre as capturas. Os «what is fine» 13 a 17 confirmam as portas, as linhas dos domínios, a legenda, a gaveta e o inventário das frases novas e retiradas.*

---

## Blocking

1. **The supplied Portuguese front page fails P1 because it renders an unapproved definition sentence.** The mandate requires “cada um com a fonte,” but the built page says “cada um com a sua fonte.” The required sentence therefore occurs zero times, contradicting the report’s claimed count of one. The copied strings file contains the correct version, proving that the supplied HTML is not a build of that copied source.  
brief.md:13, relatorio-construtor.md:21, src/i18n/strings.mjs:74, built/index.html:2

2. **The diff, copied source, and English build disagree on the Studies door.** The diff and mandate specify “All studies,” while the copied strings file says “All the studies.” The built page says “All studies,” so rebuilding the copied source would introduce a visible, unapproved string absent from the diff, report, and inventory.  
brief.md:14, diff.patch:1034, src/i18n/strings.mjs:2940, built/en/index.html:2

3. **The A18 acceptance cell was weakened so the required old-definition plant cannot turn it red.** The diff requires exactly one new definition and zero old definitions, but the copied test checks only `nDefinicao >= 1` and ignores `nDefinicaoAntiga`. The plant deliberately adds the old sentence beside the new one, leaving that weakened condition true; this directly contradicts the report’s claim that both A18 cells became red. On the supplied Portuguese build the plant cannot even alter the HTML, because its expected new sentence is already absent.  
diff.patch:1949, tests/inicio/porta.mjs:1101, tests/inicio/porta.mjs:1106, tests/inicio/porta.mjs:2201, tests/inicio/porta.mjs:2214, relatorio-construtor.md:309

4. **The browser measurements, accessibility result, gate exits, full-site counts, plants, and screenshots claimed by the report have no packaged results and therefore remain unproven.** Missing evidence includes the P3 geometry and `axe` result, the 640-to-zero and 319-page P9 counts, all P5 before/after pixel measurements, the 40-of-40 cell run, and the build, verify, and typecheck exits. The screenshot directory, gate logs, exit-code files, and measurement JSON are absent; only the script that would create screenshots is present. Commands written in a report do not reproduce their claimed outputs without those outputs or a runnable complete repository.  
relatorio-construtor.md:23, relatorio-construtor.md:24, relatorio-construtor.md:26, relatorio-construtor.md:27, relatorio-construtor.md:31, relatorio-construtor.md:325, design/especime-v3/medicoes/porta-2026-09-15/capturas-porta.mjs:126

## Major

5. **The names drawer is hidden whenever CSS loads, not only when the map works.** The hiding selector has no map-ready or script-success condition; it applies unconditionally to `.cabeca-nomes`. The only reversal is inside `<noscript>`, so a reader with JavaScript enabled but a missing or failed map script loses the visible names fallback despite the mandate’s “when the map works” condition. The ruler tests only a successful scripted page and cannot detect this failure mode.  
brief.md:15, src/styles/inicio.css:3032, src/styles/inicio.css:3043, src/views/HomeView.astro:422, tests/inicio/porta.mjs:935

6. **Without JavaScript the drawer is visible but remains closed, contrary to the brief’s requirement that it be open.** The inline fallback restores only the container’s CSS and does not add `open` to the `<details>`. Both built editions consequently contain a closed details element, and U4 explicitly requires `r.gaveta === false`. The report’s own 354-by-45-pixel claim describes only the visible summary, not an open list of names.  
brief.md:15, src/views/HomeView.astro:422, tests/inicio/mapa-unidades.mjs:1148, tests/inicio/mapa-unidades.mjs:1200, relatorio-construtor.md:23, built/index.html:2

7. **The six new door labels were deliberately omitted from the phrase inventory despite an explicit instruction to inventory them with reasons.** The brief says the door-label inventory treatment is the same as item 1. The report and inventory instead exclude the labels solely because they are links, so “Todos os concelhos,” “Todos os estudos,” “Toda a agenda,” and their English twins have no inventory rows. The copied source’s unapproved “All the studies” demonstrates the consequence: the inventory cannot reject that drift.  
brief.md:14, relatorio-construtor.md:62, design/especime-v3/INVENTARIO-FRASES.md:2785, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:109

8. **A20 does not test the domains-index routes it claims to protect.** It opens `ed.rota`, whose values are `/` and `/en`, rather than `/dominios` and `/en/domains`. It also flattens all band and domain-line names into global arrays, reads only the first domain status for the tail, and checks a hard-coded “five” substring rather than reproducing `total minus displayed names` per live domain. The supplied domain pages happen to be correct, but this cell does not establish that result.  
tests/inicio/porta.mjs:467, tests/inicio/porta.mjs:480, tests/inicio/porta.mjs:1638, tests/inicio/porta.mjs:1644, tests/inicio/porta.mjs:1656, tests/inicio/porta.mjs:1660

9. **The L3 “selo” gate is not an absolute reader-page check and its known-positive is not per edition.** `textoDaCasa()` discards every element marked `data-nonledger`; live source marks use that attribute, so changing their visible label back to “selo” or “seal” would be skipped. The Method control aggregates Portuguese and English occurrences and merely requires a combined minimum of two, allowing one edition to contain none while the other supplies the floor. No F1.13 plant inserts a visible occurrence to demonstrate that L3 turns red.  
scripts/check-lugar.mjs:470, scripts/check-lugar.mjs:488, scripts/check-lugar.mjs:503, scripts/check-lugar.mjs:1039, scripts/check-lugar.mjs:1715, scripts/check-lugar.mjs:1721, tests/inicio/porta.mjs:2193

10. **The block introduces an out-of-scope stylesheet cascade change on the area pages.** The brief prohibits geometry changes, yet both supplied before pages load `linha.css` before `Base.css`, while both after pages reverse that order. The report acknowledges that equal-specificity rules therefore resolve differently and claims altered value-column geometry, but its pixel evidence is not packaged. This is a public layout change caused by the block, not merely a reporting issue.  
brief.md:21, antes/areas/infraestruturas-e-habitacao/index.html:1, built/areas/infraestruturas-e-habitacao/index.html:1, relatorio-construtor.md:434, relatorio-construtor.md:447

11. **The report’s claim that the 390-pixel first screen is unchanged contradicts its own measurements.** It says the search label grows from one line to two, the stack below the headline moves down 18.2 pixels, and the deepest visible element moves from 569.4 to 587.6 pixels in Portuguese and from 564.7 to 582.8 in English. That may still fit within 664 pixels, but it is not an unchanged first screen. None of those measurements is independently shown in the package.  
relatorio-construtor.md:26, relatorio-construtor.md:291, relatorio-construtor.md:297, relatorio-construtor.md:299

## Minor

12. **The package gives contradictory screenshot totals.** The measurement table says 40 captures, 20 before and 20 after, which matches the script’s two page families, two editions, five widths, and two moments. The keys record and commit description instead say twenty captures, and no captures are present to resolve which set was actually produced.  
relatorio-construtor.md:27, relatorio-construtor.md:350, design/especime-v3/CHAVES-EN.md:1297, design/especime-v3/medicoes/porta-2026-09-15/capturas-porta.mjs:59

## «What is fine»

13. **The supplied built front pages render all six mandated destination labels once and contain neither old door label.** built/index.html:2, built/en/index.html:2

14. **The domain lines in both supplied editions match the five declared band measures in order, show ten total measures, and correctly render five remaining measures without values.** src/data/dominios.mjs:255, src/data/dominios.mjs:558, built/dominios/index.html:2, built/en/domains/index.html:2

15. **The new legend is rendered once on each supplied area page and its filled and unverified samples use the same `src-chip` drawing states as live source marks.** src/components/LegendaDaMarca.astro:49, src/components/LegendaDaMarca.astro:54, src/styles/site.css:1055, src/styles/site.css:1065, built/areas/infraestruturas-e-habitacao/index.html:2

16. **Both built front pages retain a named summary and 29 correctly editioned district-or-island links in the drawer markup.** built/index.html:2, built/en/index.html:2

17. **The new definition, map-search label, domain-line pattern, and legend sentence have bilingual live inventory entries, while the replaced definition and legend wording are retired with reasons.** design/especime-v3/INVENTARIO-FRASES.md:2821, design/especime-v3/INVENTARIO-FRASES.md:2828, design/especime-v3/INVENTARIO-FRASES.md:319