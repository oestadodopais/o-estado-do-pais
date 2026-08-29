# Leitura cruzada (Codex) do bloco da marca do diretor nos ícones, e das notas que a mediram

*29.08.2026. Leitor: OpenAI Codex `gpt-5.6-sol`, esforço xhigh, ≈188k símbolos, sobre um pacote de 38 ficheiros tirado de uma cópia (worktree destacado do ramo `marca-k-2026-08-29` rebaseado sobre `main` `45c5c59`): `design/marca/exportar.mjs`, `tests/inicio/app.mjs`, os seis ficheiros de `public/`, `direcoes-k/` e `derivados-k/`, `marca-k.py`, `render-k.mjs`, as folhas `FOLHA-K.png` e `CABECALHO-K.png`, a §6 quinquies das NOTAS e o relatório do construtor. Três plantas, registadas por sha256 antes do lançamento em `plantas.json` (o contexto impresso de cada alvo conferido antes e depois): P1, a percentagem da tabela da geometria (57,9 → 61,9 %); P2, o raio do círculo seguro na célula A3 (0,4 → 0,5 do lado); P3, a escala do `maskable` no exportador (0,85 → 0,9, que o comentário ao lado exclui). **Apanhou as três** (P3 e P2 como bloqueantes 1 e 2; P1 dentro do achado 6). A leitura correu depois da fusão, por instrução do diretor, porque os ficheiros não têm prosa; o que ela achou conserta-se para a frente.*

## Triagem do lugar de direção

| achado | é real? | o que se faz |
|---|---|---|
| 1, 2 (as plantas P3 e P2) | plantas | nada a corrigir no repositório |
| 3 · a célula A9 descrita no cabeçalho de `tests/inicio/app.mjs` não existe; `TINTA_CLARA`, `TINTA_ESCURA`, `TOLERANCIA_PX` são restos | **real** (verificado: o «A9» só ocorre na linha 105; as constantes nas 373 a 416 sem uso) | o construtor tira o parágrafo e os restos, ou repõe a célula com estrago plantado; ramo `marca-k-reguas-2026-08-29` |
| 4 · a A4 nunca fica vermelha pela mancha: um ícone opaco em branco passa | **real** (a condição é só 180 × 180 e zero transparentes) | um chão que a régua defenda, tirado da geometria das barras do SVG e não escrito à mão, com um estrago plantado (um ícone em branco) |
| 5 · a A5b só recolhe `<path class d/>`; um elemento a mais passava; `paginaDoSvg()` depende do literal `<svg ` em silêncio | **real** | a célula conta todos os elementos de desenho e exige que sejam os três; `paginaDoSvg()` pára com nome se não encontrar `<svg `; estragos plantados |
| 6 · «sete ficheiros SVG» nas NOTAS e na legenda da `FOLHA-K.png`; `direcoes-k/` tem seis | **real** (seis SVG e um `LEIA-ME.txt`, sete ficheiros ao todo; a frase diz sete SVG) | as NOTAS e a folha corrigidas no ramo da medição antes de entrar; a emenda à §1.79 escreve seis |
| 6 · P1 | planta | nada |
| 7 · «em todas as celas do separador a marca conta três componentes» contra a própria tabela (2 e 1 nas duas celas com campo) | **real** | a frase passa a dizer «nas celas sem campo» |
| notas: `desenhar.py`, `estado.py`, `ECRA-*.png` ausentes do pacote | do pacote, não do repositório (existem em `design/marca/`) | nada |

## O relatório, tal como veio

# Fresh-eyes report

## Blocking

1. **The exporter no longer reproduces the committed maskable icon.** In `design/marca/exportar.mjs`, `MARCAS.k.escalaDoMaskable` is `0.9`, while its adjacent derivation says `0.85`, explicitly says `0.90` is outside the safe circle, and the builder says the last pass changed the value to `0.85`. The committed `public/icon-512-maskable.png` is the 0.85 result: independently decoded, it has 46,376 signal pixels, bounds `111,123..400,388` (290 × 266), maximum pixel-corner radius 196.76 px, and 8.04 px clearance from 204.8 px. At 0.90 the geometric half-diagonal is 207.66 px, outside the required radius. The next `app` export would therefore replace a valid committed phone icon with an invalid one.

2. **A3 conceals that regression by testing the wrong circle.** `tests/inicio/app.mjs` defines `RAIO_SEGURO = 0.5`, although its comment, cell name, stored/printed proof, and requirements all say 40%. It therefore tests radius 256 px on a 512 image while printing “40 %”. The 0.90 output can pass this false gate despite failing the real 204.8 px circle. The planted corner-pixel test does not expose the error because that pixel lies outside both circles.

## Should fix

3. **A documented test cell does not exist.** The header describes A9, “EM ESCURO O «e» É PAPEL”, but there is no A9 function, invocation, or planted failure. The otherwise-unused `TINTA_CLARA`, `TINTA_ESCURA`, and `TOLERANCIA_PX` look like remnants. Thus A9 cannot fail and is absent from the reported 38 cells. I could not verify the builder’s “38 de 38” run because this package has no `dist/`, but the static count is consistent with omitting A9.

4. **A4's ink-share evidence can never turn A4 red.** Its condition is only `180×180 && transparentes === 0`; a fully opaque, completely blank field would pass while printing 0% ink. The comments admit the percentage is telemetry, but this leaves a real-phone failure ungated. A3 at least requires nonzero signal.

5. **A5b compares the three expected paths but does not prove they are the only drawing.** Its regex collects only self-closing `<path class="…" d="…"/>` in that exact attribute order. Three correct matches plus an extra unclassed `<path>`, `<circle>`, `<image>`, or `<use>` would pass and render a wrong favicon. The three collected bars and their classes are compared correctly. Similarly, exporter helper `paginaDoSvg()` silently depends on the exact literal `<svg `; changed whitespace would skip size injection without an error. Current director files do match the literal.

6. **The notes contain planted arithmetic and inventory damage.** `NOTAS-6-quinquies.md` says 197/340 is 61.9%; it is 57.94%, correctly stated later and on `FOLHA-K.png`. The same notes and scripts claim seven director SVGs, but `design/marca/direcoes-k/` contains six and its `LEIA-ME.txt` lists those same six. `FOLHA-K.png` compounds the contradiction: its subtitle says seven files, then its section says “As seis formas”. I could not determine whether a seventh source is missing or the count alone is wrong.

7. **The notes contradict their own component table.** After reporting separator cells with 2 and 1 signal islands for the field-backed icon, `NOTAS-6-quinquies.md` says every separator cell counts three connected components. That conclusion is only true for the fieldless three-bar treatments, not every row shown.

## Notes

- The other checked arithmetic is sound: 340/312 = 1.090; the 66.4%, 60.9%, 22.27%, 41.2%, 37.8%, K2–K5 dimensions/ratios/gaps, and listed WCAG contrast ratios agree with the SVG attributes and standard luminance calculations.
- `public/apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, and `icon-512-maskable.png` have IHDR dimensions 180, 192, 512, and 512; the Apple icon is RGB/opaque. All six byte sizes exactly match `RELATORIO-CONSTRUTOR.md`: 705, 738, 1,945, 2,065, 994, and 5,430 bytes. Its 8.0 px clearance and 24.9%/8,060-pixel ink claims also match. Claims that files “did not change”, commits, clean worktree, builds, and the earlier 9.5% result could not be determined from this non-Git package.
- The dark favicon colours are not typed into the K branch: `exportar.mjs` reads `marca-cheia-escuro.svg`, verifies bar geometry, and maps its colours. `public/favicon.svg` matches the director's three bars and maps `#17191B/#1F4E8C` to `#ECEEEA/#7FA6DC`, with no field.
- Exact sheet regeneration could not be determined: `marca-k.py` imports absent `desenhar.py` and `estado.py`; `render-k.mjs` needs absent site styles/fonts/reference assets. The notes also cite absent `ECRA-SEPARADORES-K.png` and `ECRA-K.png`. The included `CABECALHO-K.png` visibly agrees with its reported header measurements, but is not independent evidence because its labels and images came from the same missing measurement chain.
