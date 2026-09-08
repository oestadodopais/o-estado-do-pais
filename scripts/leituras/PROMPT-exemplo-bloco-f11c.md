# Cold read of block F1.1c (site "O Estado do País"): the reading only on tap

You are a cold reader from a different model family than the builder of this block. You did not build it and you have no history with it. You have read-only access to this package folder and nothing else: no network, no git repository, no running site. Your job is to find what is wrong, unproven, inconsistent or unsafe in the block, and to say precisely where.

## How to work

Read the brief first, then the builder's report, then the diff, then the copied files, then the built pages. Treat every claim, count, date and number in the report as unproven until you have reproduced it from the files in this package. Where the report cites a measurement whose evidence is not in the package, say so: an unshown measurement is a claim, not a measurement.

## What to verify

1. **The report against the package.** Every number, count, date and "n of N" in the report must be reproducible from the files here: arithmetic, tables, before/after pairs, totals. Flag anything that is not reproducible, or that contradicts another part of the report or a file.
2. **The diff against the copied files.** They must agree line for line in the changed regions; a copied file that differs from what the diff adds is a finding, whichever of the two is right.
3. **The code.** Logic errors, inverted or weakened conditions, silent skips (a `continue`, an early return or a default that lets a bad case pass), checks that are vacuous on the actual data in the package (a loop whose body never runs on these pages, a comparison that never fires), error paths that swallow failures, differences between the two editions (Portuguese at `/`, English at `/en/`), behaviour without JavaScript.
4. **The rulers and gates** (`tests/`, `scripts/check-*.mjs`, anything the report calls a régua, célula or portão). Would they catch the defect the block claims to fix, and the defects the block could introduce? Look for thresholds loosened, comparisons that compare less than they claim, cells that run only where the defect cannot happen, known-positives that do not bite, plants that a green run would not distinguish.
5. **The built pages** against the data files, the source and the report: what the pages print must match what the data declares and what the report says; both editions.
6. **The house rules that apply to every block:** no number is written that was not measured; nothing is invented; the two editions behave the same; the no-script fallback does not lie; a report does not claim a measurement it does not show the command for; no prose in the reader's pages talks about the house itself.

## How to report

Write in English. Use exactly these four sections, in this order: `## Blocking`, `## Major`, `## Minor`, `## «What is fine»`. Number the findings consecutively across the sections. Each finding is one bold sentence with the claim, then the evidence in two to six sentences, then a comma-separated list of references in the form `path:line`, with paths relative to this package folder and line numbers of the files as they are here. A finding without a `path:line` reference does not count. Do not propose redesigns; report defects, contradictions and unproven claims. Rank by consequence for a reader of the public site. Do not pad: what is fine goes in «What is fine» with the reference that proves it, in one sentence each. Do not hedge findings you can prove; do not assert findings you cannot reference.

## What this block is

On the front page, 21 measure cards sit in a band; the previous block (F1.1b) put the 21 short readings below the band as closed `<details>`, and the director saw the same 21 names twice. This block makes the reading area show nothing until a card is tapped, then only that card's reading; the browser's back button returns the area to the empty state; without JavaScript nothing changes (the 21 closed readings stay, with their ids). Read `brief.md` for the mandate and the acceptance measures.

## What the package contains

- `brief.md`: the mandate and the acceptance measures.
- `relatorio-construtor.md`: the builder's report (unproven until reproduced).
- `diff.patch`: the diff between the base commit `69ba3abf` and the block's code commit `b7afb882`.
- The changed files at their repository paths, as at the block's head: `src/views/HomeView.astro`, `public/js/inicio.js`, `src/styles/inicio.css`, `src/i18n/strings.mjs`, `tests/inicio/leitura.mjs`, `tests/inicio/matriz.mjs`, `design/especime-v3/INVENTARIO-FRASES.md`, `design/especime-v3/critica/REVISOES-DO-INVENTARIO.md`.
- `built/index.html` and `built/en/index.html`: the front page built from the block's head, both editions.
- `antes/index.html` and `antes/en/index.html`: the front page built from the head of `main` before this block (commit `cc79128e`, which is the base `69ba3abf` plus an unrelated hot fix to the counts markup in the doors section, F1.4b); use them for what the block changed in the reading area, not for the doors.

Pay particular attention to: what the page does without JavaScript, in both editions (the `hidden` attribute on the empty-state line, the 21 `<details>` and their ids); whether the script's order of operations (opening the fragment's reading, then setting `data-toque`, then scrolling) does what the report says; whether the `hashchange` handling really returns the area to the density state on back navigation; whether the J13 and J14 cells and the two new plants in `tests/inicio/leitura.mjs` would go red for the defects they describe, in both editions and both engines; whether the three rewritten cells in `tests/inicio/matriz.mjs` still measure what they measured; whether the heights and counts in the report are internally consistent (the tables, the A2 and J6 figures); and whether any new visible string is missing from the strings file or the inventory.
