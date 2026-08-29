# Leitura cruzada (Codex) do bloco «os nomes do mapa ao lado, e os dois painéis com nome»

*29.08.2026. Leitor: OpenAI Codex `gpt-5.6-sol`, esforço xhigh, ≈197k símbolos, sobre um pacote tirado do worktree do ramo `inicio-lista-2026-08-29` em `5b4fc7f`: os doze ficheiros que o ramo muda (fonte, régua, inventário, ISSUES, relatório), as duas primeiras páginas construídas (pt e en), a folha da primeira página e duas capturas. Três plantas nas páginas construídas, registadas por sha256 antes do lançamento (`2026-08-29-codex-leitura-inicio-lista.plantas.json`, o contexto de cada alvo conferido antes e depois): P1, o item «Braga» da lista duplicado (30 ligações, 29 slugs); P2, a contagem da linha de nome do painel inglês (13 → 12) com 13 peças na página; P3, a regra do par de Beja, da área para o nome, apontada a um slug que não existe. **Apanhou as três** (bloqueantes 1, 2 e 3).*

## Triagem do lugar de direção, conferida nos ficheiros do ramo (sem plantas)

| achado | conferido | o que se faz |
|---|---|---|
| 1, 2, 3 | plantas | nada no repositório |
| 4 · os alvos do telemóvel têm 44 px de altura e não de largura (`line-height` 20 + `padding-block` 12, sem `min-width` nem `padding-inline`); a L5 só mede a altura | **real** (`src/styles/inicio.css`, `.mapa-ilhas-lista a`) | 44 × 44 no mínimo, e a L5 a medir as duas dimensões e interseções; consertado pelo construtor no mesmo ramo |
| 5 · pontos de separação pendurados no fim das linhas a 390, e o relatório a dizer que ficou resolvido | **real** (visto na captura; `li:not(:last-child)::after { content: '·' }`) | sem pontuação: os nomes separam-se por intervalo e pelo sublinhado; decisão do lugar de direção |
| 6 · a régua mede menos do que diz (L1 não compara conjuntos; L6 um par só, sem foco na área; L8 não conta peças nem linhas; L4 e L9 passam com zero grupos; L2, L3, L6, L7, L9 só em português; `--vermelhos` não exige verde antes nem HTML mudado) | **real** | a régua apertada em cada ponto; o corredor dos estragos exige verde antes, HTML mudado, vermelho depois |
| 7 · `data-alvo-abaixo-de` é inerte (ninguém o lê), mede a caixa e não o quadrado inscrito, e o relatório chama-lhe «mecanismo construído» | **real** | o atributo sai (bytes sem leitor, a disciplina da Emenda 19a); a regra passa a ser a que está: rede em linha abaixo de 1024, lista à esquerda a partir de 1024, nunca as duas; I101 fica como pergunta de construção |
| 8 · as capturas não representam o HTML do pacote | efeito das plantas | nada |
| 9 · a ordem do DOM (mapa antes da lista) contra a ordem visual acima de 1024 (lista à esquerda) | **real** (`HomeView.astro`, 231 e 263) | a lista passa a vir antes do mapa no DOM; abaixo de 1024 a folha põe o mapa antes com `order`, e a divergência fica escrita; as áreas do mapa continuam focáveis |
| notas: inventário completo (oito cadeias); I100 e I101 por conferir fora do pacote | do pacote | nada |

## O relatório, tal como veio

# Fresh-eyes report: landing-page names and panel labels

Static review of the supplied package only. I did not fetch anything. The package has no `package.json`, `fonte/dist/`, map JSON, or the other test files cited by the builder, so `fonte/tests/inicio/lista.mjs` cannot be run here and the historical measurements cannot be reproduced. I inspected both supplied HTML files, all supplied relevant source/test/design files, and both captures.

## Blocking

1. **The Portuguese built list has 30 links, not 29.** `paginas/index.html` contains Braga twice in the single `data-mapa-ilhas` block. It has 29 distinct slugs and the map has 29 distinct areas, but Braga occurs twice in the list. This violates “one link per unit, exactly once” and contradicts the builder’s L1/all-green claim. `paginas/en-index.html` has the correct 29. The source loop in `fonte/src/components/inicio/ListaDosNomes.astro` would not create this duplicate, so the supplied Portuguese build and source do not agree.

2. **The Portuguese area-to-name pairing is broken for Beja.** In the inline pairing CSS in `paginas/index.html`, the reverse selector is `[data-uni-porta="beja"] ... [data-lista-porta="beja-x"]`; no such list link exists. Hovering or keyboard-focusing the Beja map area therefore cannot mark the Beja name. The name-to-area selector is correct, so the failure is asymmetric. English and the source generator are correct. This is precisely outside L6’s coverage: `fonte/tests/inicio/lista.mjs` tests only Lisbon, with Faro as its unaffected witness, and tests keyboard focus only from name to area.

3. **The English threshold-panel count is false.** `paginas/en-index.html` renders 13 `article.peca` cards in `#painel`, but its `data-prova="painel_com_limiar"` says **12** and the heading reads “12 measures with a threshold”. Portuguese says 13 and renders 13; both social panels say 8 and render 8. `fonte/src/views/HomeView.astro` correctly uses `ValorDaProva`, so this is another source/build divergence. It also creates an unclassified string: the inventory declares “Macroeconomic Imbalance Procedure · 13 measures with a threshold”, not the rendered 12. The builder’s L8 claim is invalid because L8 checks only that the two expected proof keys occur and that no digit is a bare text node; it never compares either value with card/row counts.

4. **Phone targets are guaranteed to be 44 px high, not 44 × 44 px.** `fonte/src/styles/inicio.css` gives the inline anchors a 20 px line height plus 12 px vertical padding, but no `min-width` or inline padding. Short labels such as Beja and Faro are not guaranteed a 44 px inline dimension. L5 checks only `caixa.h`. Its overlap check also groups anchors only by rounded `x`, so it does not test arbitrary rectangle intersections. The stated phone target rule is therefore not proved and the CSS does not enforce it.

## Should fix

5. **The 390 px capture visibly has trailing separators at line ends.** In `paginas/captura-390-topo.png`, the first visible wrapped lines end “Castelo Branco ·” and “Lisboa ·”. The CSS in `fonte/src/styles/inicio.css` puts the suffix dot in `li::after` while making the whole `li` an unbreakable inline block. That prevents a dot at the start of the next line by forcing it to remain at the end of the previous line; it does not cure trailing punctuation. The builder report’s account of this as fixed is wrong, and no cell tests wrapping punctuation.

6. **The test suite does not measure several things its names/report say it measures.** In `fonte/tests/inicio/lista.mjs`:

   - L1 does not compare the list-slug set with the map-slug set, and does not require map slugs to be distinct. A substituted list slug can pass.
   - L2, L3, L6, L7, and L9 exercise Portuguese only; L6 exercises one of 29 pairs and omits map-area keyboard focus.
   - L4 can have zero groups and still pass if 29 visible list links exist; L5 can pass with only one visible link when considered alone.
   - L8 does not count cards or social rows, as the English planted damage demonstrates.
   - L9 uses `Math.max(b.width, b.height)`, not an inscribed square or even a requirement that both bounding-box dimensions reach 44 px. It samples only seven normal viewports, so the Madeira (1,787 px) and Azores (9,925 px) thresholds are never crossed; “both directions” is false for those groups. With zero groups L9 passes vacuously.
   - `--vermelhos` requires merely that any named-prefix cell be red. It neither verifies that a transformation changed the HTML nor that the cell was green before the mutation, so an existing failure can make a planted damage look detected.

7. **`data-alvo-abaixo-de` is inert and its meaning is overstated.** `fonte/src/lib/mapa.mjs` derives it from the *largest* side of each unit’s bounding box. `ListaDosNomes.astro` writes the number, but neither `fonte/src/styles/inicio.css` nor `paginas/inicio.css` reads it. Thus I101 is right that hiding is not wired, and the single DOM list is visible at every width. However, the builder’s “mechanism is built”/“one line to switch it on” language is not supported by the supplied code: no code turns attribute values into media queries, and the metric is not the house’s inscribed-square target metric. Leaving all groups visible avoids the immediate loss of fallback targets; wiring these numbers as claimed would not.

8. **The captures do not represent the supplied Portuguese HTML.** `paginas/captura-1280-rato-em-braga.png` does show one Braga name and a matching thick map outline, so it supports the intended name-to-area effect. It does not show the duplicated Braga now in `paginas/index.html`. The 390 capture proves an inline list exists, but is cropped before all 29 names and exposes the trailing-dot defect. The captures therefore cannot substantiate the builder’s claims about the packaged build.

9. **Responsive visual order and DOM/focus order diverge.** `fonte/src/views/HomeView.astro` places the map before the names in the DOM. At desktop CSS visually places the names in the left column and the map on the right, but screen readers and keyboard users encounter all 29 map links before all list links. At smaller widths that order matches the visual map-then-list order. The package contains no accessibility test or documented resolution of this responsive-order tradeoff. The pairing also has no non-`:has()` fallback and is tested only in headless Chromium; I could not determine broader support from this package.

## Notes

- The source structure otherwise matches the intended architecture: one `ListaDosNomes` render in `HomeView`, groups derived from `parcelasDoMapa()`, panel counts supplied through `ValorDaProva`, and a single list element whose placement changes at the 1024 px media query. No width can show two list copies because no second copy exists.
- The inventory contains all eight intended new strings: four complete panel headings and four proof-title glosses. I found no additional new house sentence apart from the damaged English 12-count heading.
- I101 accurately records that the hiding rule is absent and that the construction metric is a bounding-box surrogate. The numerical inscribed-square claims depend on `tests/inicio/mapa-distritos.mjs`, which is not supplied, so I could not determine them from this package.
- I100 cannot be verified from this package: `tests/inicio/areas.mjs`, `medir-defeitos.mjs`, the referenced commits, and the built corpus it discusses are absent. The builder report also says “20 of 22” while referring to “the red cell” in the singular; the missing test is needed to tell whether that means one test family with two edition cells.
