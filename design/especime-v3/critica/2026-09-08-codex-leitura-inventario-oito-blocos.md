# Leitura cruzada do Codex ao inventário das frases: os oito blocos por ler, 08.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, 07:08 a 07:34 UTC de 08.09.2026, 194 576 símbolos, sobre um pacote com o inventário inteiro, o registo das revisões, os marcadores da voz, a `direcao.md` (§5 e as Emendas 15 e 18), as 147 linhas dos oito blocos por ler extraídas com a secção e o número da linha, e oito páginas construídas do `main` (`43f4b52a`: a primeira página, o índice dos domínios, a página do primeiro domínio e a de Évora, nas duas edições), com três plantas (3 de 3 vistas, todas no Blocking 1; o registo está no `.plantas.json` ao lado): V1, a classe da linha de repouso trocada para `conteudo`; V2, a gémea inglesa com «measures»; V3, a página construída a dizer «conferida pela casa». Triagem do lugar de direção, pela delegação (§1.98): o Blocking 2 (24 linhas do domínio), o Blocking 3 (as frases de contexto dos painéis), o Blocking 4 (as contagens e as glosas dos painéis), o Major 6 (cinco rótulos), o Major 7 (a frase da ausência), o Major 8 (as quatro cadeias da busca), o Minor 11 (o «sete» da cabeça) e o Minor 12 (as gémeas da descrição do domínio) passam ao bloco F1.10, que tem a voz e o vocabulário na mão, como o §9 do seu brief, com a decisão de cada um; o Blocking 5 (catorze linhas da primeira página com limiares sem marca de origem no bloco da medida) é a dívida conhecida dos limiares 60, −3 e 5 (a linha F1.2 do plano) e fica para o F3.3; o Major 9 e o Major 10 (as contagens do registo e a entrada duplicada de `inicio-lista`) corrigem-se no registo com esta leitura; o Minor 13 é o que um pacote não pode reproduzir. Os 14 a 17 confirmam as retiradas ausentes, as vivas rendidas e as gémeas certas dos outros blocos. O `mapa` do F1.1d foi lido na leitura desse bloco (`2026-09-08-codex-leitura-f11d-mapa.md`, achado 27).*

---

## Blocking

1. **The `toque` block is internally corrupted and the Portuguese built page adds prohibited self-verification.**

The Portuguese HTML contains “Toque num cartão para ler a medida, conferida pela casa.”, although the inventory records only the shorter sentence and the charter prohibits verification claims on a reader page. Its inventory class is `conteudo`, contradicting the section’s explicit `navegacao` classification. The English build uses singular “measure”, while the inventory uses plural “measures”; `linhas-por-ler.md` silently copies the singular and changes the Portuguese class, so it is not a faithful extraction of the inventory.

design/especime-v3/direcao.md:97, design/especime-v3/direcao.md:115, design/especime-v3/INVENTARIO-FRASES.md:2232, design/especime-v3/INVENTARIO-FRASES.md:2246, design/especime-v3/INVENTARIO-FRASES.md:2250, design/especime-v3/INVENTARIO-FRASES.md:2257, design/especime-v3/INVENTARIO-FRASES.md:2258, linhas-por-ler.md:151, linhas-por-ler.md:152, built/index.html:1, built/en/index.html:1

2. **Twenty-four `dominio` rows declared as content are autorreferência about coverage, rollout, verification or the site’s machinery.**

The index pairs describe which domains the site has published or verified and label its “first”, “second” and “third wave”; those are coverage and intentions, not the country’s content. The domain-page pairs describe what the page contains, what “this domain measures”, where the house searched, and when it read or checked sources. The mainland caveat says a decree “has not been read”, while the scale caption explains the house’s visual classes and what they do not claim. The section’s assertion that none of the rows is autorreferência is therefore false, and all these live sentences render on supplied reader pages.

design/especime-v3/INVENTARIO-FRASES.md:1834, design/especime-v3/INVENTARIO-FRASES.md:1855, design/especime-v3/INVENTARIO-FRASES.md:1856, design/especime-v3/INVENTARIO-FRASES.md:1859, design/especime-v3/INVENTARIO-FRASES.md:1860, design/especime-v3/INVENTARIO-FRASES.md:1861, design/especime-v3/INVENTARIO-FRASES.md:1862, design/especime-v3/INVENTARIO-FRASES.md:1863, design/especime-v3/INVENTARIO-FRASES.md:1864, design/especime-v3/INVENTARIO-FRASES.md:1865, design/especime-v3/INVENTARIO-FRASES.md:1866, design/especime-v3/INVENTARIO-FRASES.md:1867, design/especime-v3/INVENTARIO-FRASES.md:1868, design/especime-v3/INVENTARIO-FRASES.md:1871, design/especime-v3/INVENTARIO-FRASES.md:1872, design/especime-v3/INVENTARIO-FRASES.md:1873, design/especime-v3/INVENTARIO-FRASES.md:1874, design/especime-v3/INVENTARIO-FRASES.md:1901, design/especime-v3/INVENTARIO-FRASES.md:1902, design/especime-v3/INVENTARIO-FRASES.md:1903, design/especime-v3/INVENTARIO-FRASES.md:1904, design/especime-v3/INVENTARIO-FRASES.md:1960, design/especime-v3/INVENTARIO-FRASES.md:1961, design/especime-v3/INVENTARIO-FRASES.md:1962, design/especime-v3/INVENTARIO-FRASES.md:1963, built/dominios/index.html:1, built/en/domains/index.html:1, built/dominios/economia-e-financas-publicas/index.html:1, built/en/domains/economia-e-financas-publicas/index.html:1

3. **All eight `porta` rows contain verification prose misclassified as content, including the two live sentences on the front page.**

Every version says that values were “confirmed against” the European Commission, which is the house describing verification and diligence. Six versions are safely `retirada`, but the Portuguese and English live versions still render. The section expressly claims that none speaks about verification, directly contradicting its own wording.

design/especime-v3/INVENTARIO-FRASES.md:2029, design/especime-v3/INVENTARIO-FRASES.md:2030, design/especime-v3/INVENTARIO-FRASES.md:2031, design/especime-v3/INVENTARIO-FRASES.md:2059, design/especime-v3/INVENTARIO-FRASES.md:2060, design/especime-v3/INVENTARIO-FRASES.md:2061, design/especime-v3/INVENTARIO-FRASES.md:2062, design/especime-v3/INVENTARIO-FRASES.md:2063, design/especime-v3/INVENTARIO-FRASES.md:2064, design/especime-v3/INVENTARIO-FRASES.md:2065, design/especime-v3/INVENTARIO-FRASES.md:2066, built/index.html:1, built/en/index.html:1

4. **Six `inicio-lista` rows classify the site’s current panel coverage as content.**

The section says that the four panel headings count how many measures are on the page, making those counts coverage of the site rather than facts about Portugal. The two Social Scoreboard glosses are even more explicit: they count measures “the ledger holds”. All six render on the front pages; only the two threshold-definition glosses avoid the coverage claim.

design/especime-v3/INVENTARIO-FRASES.md:1618, design/especime-v3/INVENTARIO-FRASES.md:1630, design/especime-v3/INVENTARIO-FRASES.md:1631, design/especime-v3/INVENTARIO-FRASES.md:1632, design/especime-v3/INVENTARIO-FRASES.md:1644, design/especime-v3/INVENTARIO-FRASES.md:1645, design/especime-v3/INVENTARIO-FRASES.md:1646, design/especime-v3/INVENTARIO-FRASES.md:1647, design/especime-v3/INVENTARIO-FRASES.md:1648, design/especime-v3/INVENTARIO-FRASES.md:1649, built/index.html:1, built/en/index.html:1

5. **Fourteen live front-page content rows assert thresholds or comparisons without a claim, statement, row-claim, name or place origin mark in their measure block.**

The debt definitions assert that the value is above the European threshold, and the twelve threshold templates state numeric thresholds and above/below relations. Their containing `<details>` elements use structural attributes such as `data-leitura`, `data-estado` and `data-limiar`; the threshold numbers are `data-nonledger`, but there is no required claim-origin mark anywhere in those measure blocks. This differs from the supplied domain page, whose quantitative articles contain `data-claim` and `data-linha-claim`.

design/especime-v3/INVENTARIO-FRASES.md:176, design/especime-v3/INVENTARIO-FRASES.md:181, design/especime-v3/INVENTARIO-FRASES.md:189, design/especime-v3/INVENTARIO-FRASES.md:190, design/especime-v3/INVENTARIO-FRASES.md:191, design/especime-v3/INVENTARIO-FRASES.md:192, design/especime-v3/INVENTARIO-FRASES.md:193, design/especime-v3/INVENTARIO-FRASES.md:194, design/especime-v3/INVENTARIO-FRASES.md:222, design/especime-v3/INVENTARIO-FRASES.md:223, design/especime-v3/INVENTARIO-FRASES.md:224, design/especime-v3/INVENTARIO-FRASES.md:225, design/especime-v3/INVENTARIO-FRASES.md:226, design/especime-v3/INVENTARIO-FRASES.md:227, built/index.html:1, built/en/index.html:1

## Major

6. **Five `dominio` labels are content-classified even though the rule defines section and table labels as navigation.**

“Por domínio” and “By domain” are section names. “Concelho”, “Valor” and “Value” are column labels that guide the reading of a table. The existing English twin “Municipality” is already classified as `navegacao`, so “Concelho” also creates a cross-block twin-class contradiction.

design/especime-v3/INVENTARIO-FRASES.md:102, design/especime-v3/INVENTARIO-FRASES.md:103, design/especime-v3/INVENTARIO-FRASES.md:1556, design/especime-v3/INVENTARIO-FRASES.md:1857, design/especime-v3/INVENTARIO-FRASES.md:1858, design/especime-v3/INVENTARIO-FRASES.md:1964, design/especime-v3/INVENTARIO-FRASES.md:1965, design/especime-v3/INVENTARIO-FRASES.md:1966, built/dominios/index.html:1, built/en/domains/index.html:1, built/dominios/economia-e-financas-publicas/index.html:1, built/en/domains/economia-e-financas-publicas/index.html:1

7. **The two “no published figure” rows violate the charter’s two-word form for absence.**

The Portuguese sentence uses six words and the English sentence seven, followed by further prose explaining the absence. The inventory section defends them as content but does not answer the explicit two-word restriction. Both render on the supplied domain pages.

design/especime-v3/direcao.md:97, design/especime-v3/INVENTARIO-FRASES.md:1838, design/especime-v3/INVENTARIO-FRASES.md:1839, design/especime-v3/INVENTARIO-FRASES.md:1897, design/especime-v3/INVENTARIO-FRASES.md:1898, built/dominios/economia-e-financas-publicas/index.html:1, built/en/domains/economia-e-financas-publicas/index.html:1

8. **Four visible search-interface strings are house prose with no classified inventory row.**

The front pages visibly render “Escreva o nome do concelho”, “Procurar”, “Type the name of the municipality” and “Search”. They are neither inside an `<a>` nor inside an origin mark. The inventory prose itself acknowledges that its gate ignores `<label>` and `<button>` and that these strings remain outside the table.

design/especime-v3/INVENTARIO-FRASES.md:2210, design/especime-v3/INVENTARIO-FRASES.md:2214, design/especime-v3/INVENTARIO-FRASES.md:2218, design/especime-v3/INVENTARIO-FRASES.md:2222, design/especime-v3/INVENTARIO-FRASES.md:2223, design/especime-v3/INVENTARIO-FRASES.md:2224, design/especime-v3/INVENTARIO-FRASES.md:2226, design/especime-v3/INVENTARIO-FRASES.md:2229, built/index.html:1, built/en/index.html:1

9. **The register miscounts three blocks against the current inventory and the `porta` section misstates its own live/withdrawn split.**

The current inventory contains 26 `frases`, eight `porta` and four `leitura` rows, as the extraction’s own count states. The register instead records 30, four and zero. The `porta` section says “four new and four withdrawn”, but its table currently has two live and six withdrawn `porta` rows; the four Portugal/search withdrawals it discusses remain assigned to other blocks.

design/especime-v3/INVENTARIO-FRASES.md:32, design/especime-v3/INVENTARIO-FRASES.md:35, design/especime-v3/INVENTARIO-FRASES.md:2019, design/especime-v3/INVENTARIO-FRASES.md:2022, design/especime-v3/INVENTARIO-FRASES.md:2052, design/especime-v3/INVENTARIO-FRASES.md:2059, design/especime-v3/INVENTARIO-FRASES.md:2066, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:52, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:57, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:58, linhas-por-ler.md:4

10. **The register simultaneously records `inicio-lista` as completed and `por ler`.**

Both entries use the same block identifier and the same count of eight rows. The earlier entry names a Codex cross-reading and says all eight new strings were covered; the later entry says those same eight still need cross-reading. Nothing in either entry distinguishes a later revision or a different set of rows.

design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:43, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:49

## Minor

11. **The second `cabeca` section says it contains seven rows, but its table contains nine.**

The table spans lines 1813–1821 and the register correctly reaches eleven only by adding those nine to the two rows in the first `cabeca` section. The section’s own explanation also implies nine distinct bilingual strings: one shared “Menu” plus four Portuguese/English pairs.

design/especime-v3/INVENTARIO-FRASES.md:1748, design/especime-v3/INVENTARIO-FRASES.md:1787, design/especime-v3/INVENTARIO-FRASES.md:1798, design/especime-v3/INVENTARIO-FRASES.md:1805, design/especime-v3/INVENTARIO-FRASES.md:1813, design/especime-v3/INVENTARIO-FRASES.md:1821, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:50

12. **The domain-page metadata twins disagree over whether each measure has one date or several dates.**

Portuguese says “a data de cada uma”, singular, while English says “the dates of each one”, plural. The built `<meta name="description">` values preserve that difference character for character.

design/especime-v3/INVENTARIO-FRASES.md:1871, design/especime-v3/INVENTARIO-FRASES.md:1872, built/dominios/economia-e-financas-publicas/index.html:1, built/en/domains/economia-e-financas-publicas/index.html:1

13. **Nine supporting reports named by the register are absent from this package, so their construction and prior-reading claims cannot be checked here.**

The missing names cover the earlier `inicio-lista` reading, both `frases` reports, `corredor`, both `dominio` reports, `porta`, `leitura` and `toque`. This does not prove they are absent from the full repository, but they are unavailable under the package-only evidence boundary.

design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:43, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:52, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:53, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:54, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:55, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:57, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:58, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:60

## «What is fine»

14. **All ten target rows marked `retirada` are absent from all eight supplied built documents.**

design/especime-v3/INVENTARIO-FRASES.md:175, design/especime-v3/INVENTARIO-FRASES.md:180, design/especime-v3/INVENTARIO-FRASES.md:1813, design/especime-v3/INVENTARIO-FRASES.md:1817, design/especime-v3/INVENTARIO-FRASES.md:2059, design/especime-v3/INVENTARIO-FRASES.md:2061, design/especime-v3/INVENTARIO-FRASES.md:2062, design/especime-v3/INVENTARIO-FRASES.md:2063, design/especime-v3/INVENTARIO-FRASES.md:2065, design/especime-v3/INVENTARIO-FRASES.md:2066

15. **Apart from the two `toque` failures, the live target rows whose routes are supplied render with their inventoried text after HTML entities and declared-origin substitutions are accounted for.**

design/especime-v3/INVENTARIO-FRASES.md:1642, design/especime-v3/INVENTARIO-FRASES.md:1780, design/especime-v3/INVENTARIO-FRASES.md:1851, design/especime-v3/INVENTARIO-FRASES.md:1955, design/especime-v3/INVENTARIO-FRASES.md:2057, built/index.html:1, built/en/index.html:1, built/dominios/index.html:1, built/en/domains/index.html:1, built/dominios/economia-e-financas-publicas/index.html:1, built/en/domains/economia-e-financas-publicas/index.html:1

16. **The non-problematic `frases`, `cabeca` and `leitura` twins carry matching states and meanings, and their measure definitions are correctly content while their commands are correctly navigation.**

design/especime-v3/INVENTARIO-FRASES.md:173, design/especime-v3/INVENTARIO-FRASES.md:174, design/especime-v3/INVENTARIO-FRASES.md:181, design/especime-v3/INVENTARIO-FRASES.md:185, design/especime-v3/INVENTARIO-FRASES.md:187, design/especime-v3/INVENTARIO-FRASES.md:213, design/especime-v3/INVENTARIO-FRASES.md:220, design/especime-v3/INVENTARIO-FRASES.md:631, design/especime-v3/INVENTARIO-FRASES.md:1782, design/especime-v3/INVENTARIO-FRASES.md:1783, design/especime-v3/INVENTARIO-FRASES.md:1814, design/especime-v3/INVENTARIO-FRASES.md:1815, design/especime-v3/INVENTARIO-FRASES.md:1816, design/especime-v3/INVENTARIO-FRASES.md:1818, design/especime-v3/INVENTARIO-FRASES.md:1819

17. **Rendering cannot be judged for “As linhas deste documento →” and its English twin because no work-document route is supplied, while `corredor` has no inventory row to render and its receipt route is also outside the package.**

design/especime-v3/INVENTARIO-FRASES.md:1803, design/especime-v3/INVENTARIO-FRASES.md:1820, design/especime-v3/INVENTARIO-FRASES.md:1821, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:53