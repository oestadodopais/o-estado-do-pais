# The cold read of batch 3 (LAR1 and FP3), 03.11.2026

Reader: Claude Opus 5.5 (`leitor`), xhigh; 33 tool calls, then 7 more after the director added `studies-src/manifest.yml` to the package and resumed the same reader. Package `pacote-lote3-2026-11-03`, base 93e366940, head and `dist/` 9056b204d, five plants (L1 to L5, registered by sha256 outside the package). A condensed record made by the director; the findings keep the reader's numbers and classes.

## Blocking

1. The stored original of the saved Évora 2027 edition (pt, 01.10.2026) hashes to `371b3fcc…`, not the `d0001684…` the manifest and the builder's records declare, and reads «e já anuncia o programa de 2027» where the served page reads «e não anuncia». The other seven originals equal the manifest. *(Plant L5.)*
2. The built Portuguese front page prints the updated study as «02.11.2026» with `datetime="2026-11-03"`; the English box and the manifest say 03.11.2026. *(Plant L4.)*

## Major

3. The copied `src/lib/novidades.mjs` treats `natureza: correcao` as an update. The manifest declares no edition as `correcao` (a correction leaves the field out), so the defect would be latent on today's data. *(Plant L3.)*
4. The copied `src/styles/leitura.css` puts `white-space: nowrap` back on the register's values. *(Plant L1.)*
5. The copied `tests/largura/largura.mjs` lets a page pass up to 64 px wider than the screen. *(Plant L2.)*
6. *(Withdrawn after the resumption.)* `studies-src/manifest.yml` was not in the package.

## Minor

7. `check:largura` samples two pages per family by design, skips pages outside `index.html` and `registos/`, and measures once at load, not after an interaction.
8. The separate plant step in `portoes.sh` counts any exit 1 as a bite, including a crash (the `--prova` path in `verify` does discriminate).
9. The frame CSS of the saved editions gains `.metodo code{overflow-wrap:anywhere}`, beyond addendum A's «only for tables».
10. A short pair like «15 → 45 correções» can split at a line end.
11. One FP3 entry recorded as a plant is a hard-coded `mordeu:true` after real assertions.
12. Latent ordering defect: an updated study inside a dossier could put the box out of date order.
13. «78 famílias» counts `/en/` twice (77 distinct).
14. Some report figures have no evidence in the package.
15. FP3's front page box had no captures at the five widths.
16. *(Rewritten after the resumption.)* `.vh` inside `.registo-mudanca` is the visually-hidden suffix of each source chip; it cannot widen the page, and the LAR1 rule removed its `white-space: nowrap`, which the visually-hidden pattern uses so screen readers do not run words together. Also, `table{display:block}` can remove table semantics in some screen readers (inferred).
17. Every register entry ends in a raw identifier («Afirmação: correcoes-publicadas»); an editor would cut it (pre-existing).

## What is fine

The other changed code files match the diff line for line. The §0 measurements reproduce; after the change nothing is wider than the screen (500 family measures and 185 document measures, 0 excesses). `check:largura` takes its families from the `dist/` itself, includes all 37 documents at five widths (128 pages, 640 measures, 0 failures, 10.4 s), is in `verify` and green, and its `--prova` plant discriminates. `captar.mjs` refuses a page wider than the width asked and records the measured width. The saved editions' served HTML equals the original plus the robots meta, the edition note with the frame style and the `<main>` wrapper; both Évora saved editions still say which edition they are. No register value changed a character. FP3's closed list gains exactly one type; its printed date is checked on `datetime` and the visible text against the current manifest edition; a corrected study keeps its publication date, type and link. The English box reads whole. No ruler weakens in the diff itself. With the manifest: seven of eight originals equal their declared sha256; Évora 2027 has 2026-11-03 with `natureza: atualizacao` in both languages; the corrected casa, contas and orçamento studies carry no `natureza` and keep their publication dates in the box.

**Editor's question:** front page, English, yes; Portuguese as built in the package, no (the plant L4); corrections page printable as a page that fits the screen, with the identifier tails an editor would cut.

## The director's decision

Five of five plants found. Finding 16 confirmed in `src/styles/site.css:80` (`.vh`: absolute, 1 px, clipped, `white-space: nowrap`): addendum B of LAR1 removed `.vh` from the rule (c9b6d2cea; 108 hidden spans per edition back to `nowrap`, both corrections pages 390 px at 390, `check:largura` green with its plant). Finding 9 ratified (frame CSS, no text change, the same aim as addendum A). Finding 15 corrected: 40 captures of the batch (four pages, two editions, five widths, each measured at the width asked). Finding 17 goes to VOZ-1. Findings 7, 8, 10 to 14 go to Friday's hygiene list.
