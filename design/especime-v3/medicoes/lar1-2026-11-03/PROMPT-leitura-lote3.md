# The cold read of batch 3 (LAR1 and FP3), 03.11.2026

Reader: Claude Opus 5.5 (`leitor`). Read `PROMPT-COMUM.md` in this package first and follow it to the letter. Then this section. You cannot write files: your whole reading goes in your final answer, in the four sections.

## What this batch does

Two blocks stacked on one branch, on top of block EV3 (live since today):

- **LAR1:** no page scrolls sideways. The mandate is `brief-LAR1.md`, with addendum A (`ADENDA-A-LAR1.md`). The director measured the problem in a browser before the change: on the corrections page, the values of the register and the publishers' names were held on one line (`white-space: nowrap`), so the page was 3 427 px wide on a 390 px screen. Sixteen study document pages, including four saved editions, had tables wider than the screen. Addendum A lets the frame CSS of a saved edition change, while the stored original file and the served text must not.
- **FP3:** the front page's «O que há de novo» box says when a study was updated, with the date of its current edition. The mandate is `brief-FP3.md`.

The site diff is `diff.patch` (base `__BASE__`, head `__CABECA__`). The built pages under `built/` come from the `dist/` of `__DIST__`. `CONFERIR-TUDO.md` is the director's full run on that head. The before measurements are in `design/especime-v3/medicoes/lar1-2026-11-03/antes/`, and the after measurements are next to them.

## The seven questions

1. **No page wider than its screen.**
   - Does `check:largura` measure what the mandate asks: every page family computed from the `dist/` itself, so that a new family enters on its own, plus every study document page, at the five widths?
   - Does its plant fail, and does the check run in the full `verify` list?
   - Is there any way a page can be wider than the screen and still pass?
2. **The saved editions.**
   - For each saved edition, is the stored original file (`studies-src/_edicoes/*.html`) byte for byte unchanged?
   - Is the served text unchanged?
   - Is the only change to the served HTML the frame CSS?
   - Does each saved edition still say at its top which edition it is?
3. **The register of corrections.**
   - Do the values and the names now wrap, on the built corrections page in both editions, without any value, name or struck-through old value changing a character?
   - Does a short pair like «15 → 45» still read as one unit?
4. **The captures.** Does `scripts/leituras/captar.mjs` now refuse a capture whose page is wider than the width asked for, and record the measured width in its manifest?
5. **The front page box.**
   - Does a study whose current edition has `natureza: atualizacao` appear with that edition's date and the type «estudo atualizado» / «study updated», and only then?
   - Does a corrected study keep its publication date and its type?
   - Is the printed date checked against the manifest with the same strength as the other dates of the box?
   - Is the closed list of the box's types extended by exactly one type?
6. **The rulers.** Did any ruler that protects a number, a source or a person get weaker anywhere in these diffs?
7. **Reading it.** Read the front page box and the corrections page in both editions at 390 px, as a reader would. Do they read whole and clear?

Then the editor's question: would the editor of a Portuguese daily publish these two pages as they stand?

Budget: at most 40 tool calls.
