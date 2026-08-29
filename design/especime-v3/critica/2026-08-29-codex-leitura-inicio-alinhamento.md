# Leitura cruzada (Codex) do bloco «a cabeça da primeira página alinhada»

*29.08.2026. Leitor: OpenAI Codex `gpt-5.6-sol`, esforço xhigh, ≈171k símbolos, sobre um pacote tirado do worktree do ramo `inicio-alinhamento-2026-08-29` em `17de55a`: os sete ficheiros mudados e o diff inteiro contra `main`, o brief e o relatório do construtor (o lugar de direção, desta vez), as duas primeiras páginas construídas e a sua folha, e quatro capturas (1280 antes e depois, 1024, 390). Três plantas na fonte do pacote, registadas por sha256 antes do lançamento (`2026-08-29-codex-leitura-inicio-alinhamento.plantas.json`, o contexto de cada alvo conferido antes e depois): P1, o item do mapa a ocupar duas filas em vez de três; P2, a marca `data-mapa-legenda` tirada da legenda (a R6 deixava de encontrar o selo); P3, a largura do mapa a 581 px numa coluna de 518 no relatório. **Apanhou as três** (bloqueantes 1 e 2, e o parágrafo final do achado 3). O construtor foi o lugar de direção, e por isso esta leitura é a única verificação de outra família antes da fusão.*

## Triagem do lugar de direção, conferida nos ficheiros e na construção

| achado | conferido | o que se fez |
|---|---|---|
| 1, 2 e a largura 581 do 3 | plantas | nada no repositório |
| 3 · a geometria pedida não cabe sem corte: 697 px de altura à razão do `viewBox` (6090/8030, e não 600/790 como a folha dizia) pedem 529 px de largura numa coluna de 518; o `max-width` prende a caixa e o desenho fica com uns 7 px de ar em cima e em baixo; as células L11 e L13 mediam a caixa do `svg` e não o desenho | **real** (a razão do `viewBox` confirmada na página construída; a conta refeita) | a folha usa a razão do `viewBox`; as margens entre os nomes e a legenda encolhem (20 e 6 px) até a largura pedida caber com folga; L13 passa a exigir que a caixa do `svg` tenha a razão do `viewBox` a menos de 1,5 px (sem ar), que não saia da coluna por nenhum lado e fique a menos de 8 px da largura dela |
| 4 · entre 641 e 1023 a legenda ficava antes do mapa (`order` 0 no bloco dessas larguras) | **real** (o bloco `max-width: 1023.98px` dá `order` 1 ao mapa e 2 aos nomes) | a legenda com `order` 2 e os nomes com 3 nesse bloco |
| 5 · os 32 px só a partir de 1280 e não de 1024 como o registo dizia; L5 e M1c aceitavam 44 como «não abaixo de 32» | **real** | os 32 px passam ao bloco de 1024; L5 e M1c exigem a altura declarada (32 a 34) no ecrã com rato |
| 6 · L11 a L13 mais estreitas do que os nomes (um `svg` ou uma legenda em falta só marcava a L11; L13 só media o transbordo à direita e um mínimo de altura; L12 a 1024 aceitava qualquer intervalo) | **real** | as três ficam vermelhas quando falta o `svg` ou a legenda; L13 mede os dois lados, a razão e a altura por cima; L12 a 1024 exige a legenda a menos de 16 px do mapa |
| 7 · a `<div>` perde a associação figura e legenda; no telemóvel a ordem visual e a do documento divergem | **real** em parte | a figura aponta à legenda com `aria-describedby`; a divergência no telemóvel já estava decidida e escrita na §1.84 (a lista antes do mapa no documento, o mapa antes no ecrã abaixo de 1024) |
| notas: comentários a citar `tests/inicio/alinhamento.mjs`, que não existe | **real** | corrigidos para `lista.mjs` (L5, L11 a L13) |

## O relatório, tal como veio

# Fresh-eyes report: landing-page head realignment

Verdict: **do not merge this package as supplied.** The built pages/captures show the intended three-row version, but the editable source contains two planted damages and cannot reproduce them.

## Blocking

1. **Source, diff, and built artifact disagree about the map span.** In `fonte/src/styles/inicio.css`, the wide `.cabeca-inst` has `grid-row: 1 / span 2`; `fonte/DIFF-contra-main.patch` and `paginas/inicio.css` say `span 3`. Spanning two rows limits `min-height: 100%` to headline plus names, so the map cannot reach the legend row and L11 should fail. This is a planted damage. `capturas/cabeca-1280.png` was made from the three-row build, not the supplied source.

2. **The new legend has lost the marker that R6 depends on.** `fonte/src/components/inicio/LegendaDoMapa.astro` renders only `data-mapa-ficha`; the diff and both built HTML files also contain `data-mapa-legenda`. After rebuilding, `fonte/scripts/check-mapa.mjs` will not find the landing-page legend, while the figure no longer contains the CAOP seal, so R6 must fail. This is the second planted source damage. `data-mapa-ficha` itself remains in the intended location.

3. **The claimed wide geometry is arithmetically impossible without clamping or letterboxing.** The reported map height is 697 px (423–1120). At `600 / 790`, that asks for 529.4 px of width; the real SVG viewBox, `6090 / 8030`, asks for 528.7 px. The column is 518 px. `max-width: 100%` can make it fit, but then height, ratio, and width cannot all remain as claimed. If the 518 × 697 SVG viewport survives, the SVG’s default aspect preservation leaves about 7 px of vertical air at each end; if the ratio wins, the box is about 683 px high and misses the bottom. L11/L13 inspect the SVG rectangle, not the painted field or its ratio, so they do not prove “fills the side.” The builder table is also internally impossible: it says **581 px** of SVG width in a **518 px** column, despite claiming L13 green. The 1280 capture is 1092 × 703 and visually supports a 518 px right column, not 581.

## Should fix

4. **There is a new 641–1023 px ordering regression.** Under `max-width: 1023.98px`, `.cabeca-inst` gets `order: 1` and `.mapa-ilhas` gets `order: 2`, but the new `.mapa-legenda` retains order 0. In the one-column grid this produces headline, **legend, map, names**. The explicit map, legend, names order exists only at `max-width: 640px`. This violates “below 1024 nothing changes”; no supplied capture covers the affected range.

5. **The stated 32/44 split is not implemented or measured as stated.** CSS changes name rows to 32 px only inside `min-width: 1280px`; from 1024 through 1279 they remain 44 px. Both L5 in `fonte/tests/inicio/lista.mjs` and M1c in `fonte/tests/inicio/mapa-distritos.mjs` test only “not below 32”, so a 44 px row passes. M1c runs at 1280 only. Thus the report’s “32 px from 1024” claim is a false green; `capturas/cabeca-1024.png` also shows the tall form.

6. **L11–L13 are narrower than their names.** A missing SVG or legend makes the run fail, so it is not globally vacuous, but every such failure is labelled L11 and L12/L13 are skipped. L13 checks only right overflow and a lower height bound; it permits left overflow and arbitrary excess height, and never checks aspect ratio. L12 at 1024 permits any gap after the map. The three named mutation plants are real damages—removing stretch, moving the legend to column 2, and forcing a 900 px map—and they exercise those narrow predicates, not the full claims. The R6 plant correctly removes seals from both possible landing-page homes. District pages are not weakened: for them R6 still searches only their figure.

7. **The visual and accessibility orders diverge.** Making the sibling a `<div>` is valid HTML, but removes the semantic figure-caption association; an `aria-describedby` link would restore it. On phones the visual order is map, legend, names, while DOM/focus order remains names, map, legend. Keyboard focus therefore jumps down to the names, back up through map links, then to the source link.

## Notes

- With the intended three-row span, `height: 0` does appear to suppress the map's intrinsic grid contribution and `min-height: 100%` then stretches its box in the supplied Chromium capture. The package provides no cross-engine evidence; with the planted two-row span it stretches the wrong area.
- From 1024–1279, the percentage margin’s containing block is the legend’s grid area, whose width is the same column width used by the 100%-wide map. The technique is therefore basically sound, but not “exact”: `790 / 600` differs from the SVG’s `8030 / 6090`, producing roughly 0.6–0.9 px error across 340–490 px.
- At 1200 the pre-1280 form remains: legend in the right column below a width-sized map and 44 px name rows. At 1300 the wide rule applies. Exact 1200/1300 boxes could not be independently measured because the package omits the base stylesheet and runnable `dist/`; there are no 1200, 1300, 1440, or English captures.
- The older `.mapa-tela`/`.mapa-svg` sizes are overridden by the more specific wide rules; phone rules are disjoint. The old corner rule was removed. The source comments incorrectly cite nonexistent `tests/inicio/alinhamento.mjs`; the cells live in `fonte/tests/inicio/lista.mjs`.
- The supplied captures support the reported head heights (737 before, 703 after, about 660 at 1024) and the 390 visual order only. The claimed test/build results could not be rerun from this partial package.
