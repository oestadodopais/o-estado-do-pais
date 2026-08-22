# BRIEF · pós-fusão A2 · os selos do Instrumento n.º 1 abaixo de 44px (ISSUES I13, I14)

*For the A2 builder (Claude Opus), 22.08.2026, branch `pos-fusao-v3`, after A1's commit (rebase nothing; just start from HEAD). Managing seat: Claude Fable 5. Read first: `../ISSUES.md` rows I13 and I14; `src/styles/site.css` lines 700 to 760 (the seal's touch area and the stacking exception list at line 735, with its rationale); `src/styles/inicio.css` from line 1275 (the piece's foot-row rule: «o selo é o maior alvo da peça», 160px, the measured reason); `src/components/InstrumentoConvergencia.astro` (the `.glance`, `.brief-text` and `.brief` rows); `public/js/inicio.js` where it swaps the visible region of the instrument; `tests/inicio/matriz.mjs` §5 («o selo, alvo e aninho»: how the area and the overlapping pairs are measured, and that it measures `.peca` only); `../notas/stage-2.md` around line 497 (how I13 closed for the pieces). No em dashes in anything you write.*

## 0 · What the seat measured (22.08, headless Chromium, `dist/` of `8440781`)

`#convergencia` renders **20** seal anchors (`a.src-chip`): 6 in `.glance` (one per region; the read region visible), 8 in `.brief-text`, 6 in `.brief` (the legend row). Per state, **3 are visible**. At 1280 and 1024, in both editions:

| seal | host | box | `::after` area | why |
|---|---|---|---|---|
| glance | `.glance` | 53×14 (EN 61×14) | none (`min-width: 0; height: 100%`) | `.glance` is in the exception list of `site.css:735` |
| sentence | `.brief-text` | 53×19 (EN 61×19) | none | `.brief-text` is in the same list |
| legend | `.brief` | 53×14 | 44×44 | not in the list; fine |

At 1280 the sentence seal sits at y=4256 and the legend seal at y=4293: a 44px area centred on each would overlap by about 9px (the EN run already lists that pair as overlapping when both are given 44). At 390 the instrument is a 97px door and no seal is visible: mobile is not affected. **`.prov-vals` no longer exists on the home** (`grep -c prov-vals dist/index.html` → 0; it left at `1cac621`): I14's seven seals are gone with the row. `.prov-vals` survives only in `src/views/MunicipiosView.astro` (two rows under the map of `/municipios`, one of them a download link, not a seal) and in the exception list.

## 1 · What to do

**Give the two rows the piece grammar** (the stage-2 way: height to the row, never a smaller area): remove `.glance` and `.brief-text` from the exception list in `site.css:735`, so their seals get the default area (width of the unit, `min-width: 44px`, `height: 44px`); then give the rows the vertical room that makes **zero overlapping target pairs** inside `#convergencia` (the sentence row against the legend row is the known pair; measure every pair of `a, button, summary` inside the instrument, as the matrix does for a piece, including the region chips against the glance). Prefer padding on the row to moving anything; the instrument's fluid scale (`clamp()`, decided 21.08) must not change; no new colour, no new string. If a row cannot take 44px without breaking the composition at 1024, stop and report the measured alternative (a «measured exception» is the director's call, not yours).

**Extend the matrix, not a gate:** `tests/inicio/matriz.mjs` §5 measures `.peca` only; add the same three checks for `#convergencia` (every visible seal ≥ 44×44; no seal nested in another target; zero overlapping pairs), run for each of the six region states the instrument can show (drive it the way the matrix already drives the page's states; if the instrument's region is not in the URL schema, click the chips in the matrix and say so). Report the cell counts before and after (107 today).

**Clean the list honestly:** the exception list keeps only selectors that still exist in `dist/` (check each of the seven by `grep` on `dist/` and say which remain: `.figura`, `.brief-text`, `.prov-vals`, `.mun-campos`, `.linha-bloco .deep-v`, `.linha-verificacoes`, `.glance`); a selector with no element on any built page leaves the list with one line in the note. `.prov-vals` on `/municipios`: measure its two rows (targets, areas, pairs) and report; fix only if it is the same defect (a seal below 44 or an overlapping pair), otherwise leave it and say why.

## 2 · Records and exit

`../ISSUES.md`: I13 closed (the measurement after, both editions, 1280/1024/390, six states), I14 closed by removal (`1cac621`, the grep). `../notas/pos-fusao.md` §A2 with the before/after table and the matrix output. Five gates green (`npm run build`), `npm run typecheck`, `node scripts/ortografia.mjs --verificar` at 0. Screenshots of the instrument at 1280 and 390, PT and EN, into `../capturas/pos-fusao/` (use `tests/inicio/capturas.mjs` if it takes a selector; else a small Playwright call in the note). One commit, Portuguese message in the house's voice, trailers `Co-Authored-By: Claude Opus <noreply@anthropic.com>` and `Claude-Session: <your session URL>`. Report in at most 30 lines: the table after, the pairs count, the matrix cells before/after, the commit, model and tokens. Rough scale: 120k to 200k tokens. Stop and ask if a fix needs a new string, a colour, or a change to the instrument's scale.
