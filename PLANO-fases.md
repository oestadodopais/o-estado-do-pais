# PLANO — what remains, phase by phase, and the next session

*Written 2026-08-16 (early), by Claude Fable 5 in seat, at the director's request, after the day of 2026-08-15. This is the roadmap; `DECISIONS.md` records what actually gets built, and §4 there is the defect-and-deferral register that must be clean before a block starts. Costs are rough, in subagent tokens as agents report them. Model routing: Opus builds, Sonnet does mechanical passes and blind fetches, Codex reviews across families, Fable designs and reviews in seat.*

## Where we are (2026-08-16, evening)

Live (`main` = `96feb4d`): the Évora município page and five reading pages; the index of all 308 concelhos; a correction door on every page; every value sealed to its own row; PDF proofs one click to the page; 316 pages; 132 ledger rows, 12 with provenance debt; the publisher pipe with 28 checks; the trust brief measured on the live site.

**Built, reviewed and on preview (branch `voz`, site 27 commits, engine 16; merge is the director's word):** Block V in full. Orthography AO90 PT-PT enforced (wordlist 254 pairs, reversible tool, gate check, remainder 0, no em dashes); `/sobre` (the decided text, gate-compared); `/metodo` as ten rules with mechanism and live proof (`prova.mjs`, 26 keys recomputed by the gate, `/prova.json`, the mechanism drawn); `/correcoes` (register moved, policy once, entries as doors); `/agenda` from the engine's records (5 items, 16 calendar events, four states, full change log); masthead = time signal + agenda line; footer navigation only; the door to Sobre on every page including hosted documents; `Afecta` on DECISIONS entries with the tether check and a git audit in the monthly sweep; housing pre-registered in the engine (unfrozen); source calendar and watches in the monthly agent; word cuts (frame words 31 852 → 24 858); `ABOUT.md` cut to the idea. Verified: build green, engine gate PASS, Sonnet blind re-fetch of the calendar 8/8, Codex five passes (8/8 canaries caught). Record: `DECISIONS.md` §1.38 to §1.42.

Still the director's: read `/sobre` (EN is house prose), cut `/metodo` on the built page, confirm or overrule the orthography default, read the housing question on `/agenda`; then the word to merge.

## The rules that govern every block

1. A block does not start while the previous block's found defects are neither fixed nor deferred in writing (`DECISIONS.md` §4).
2. No new gate unless real content broke a rule no gate covers; extend existing checks first. Every check is proven on a planted defect before it counts.
3. Everything public goes through: build green, cross-family review (Codex, canaried where the artifact is prose), preview, the director's word, merge, `verify:deploy`.
4. State is rendered, never written. The idea is written and changes by decision.
5. The About states the idea and stops. No em dashes. Show, don't declare.

---

## Phase 1 (remaining) — voice, closed in the next session

| Item | Owner | Done when |
|---|---|---|
| Orthography decision | applied by default (Acordo), overrulable at preview | `IDENTIDADE.md` §9; reversal is a rerun plus a hand pass on the one-way forms |
| Método cut | director, at preview | the built `/metodo` is on the preview; rules 1, 6, 9, 10 have the weakest proofs |
| Footer line | decided: navigation only | built (Block V, on preview) |
| Time signal | built: «Painel europeu reconferido a …» + «Agenda: N em curso · N a seguir» | on preview |

## Block V — the site's own voice and self-description (BUILT 2026-08-16, on preview, awaiting the director's word)

Goal: `/sobre`, `/metodo`, `/correcoes`, `/agenda` built; the self-description made unable to go stale; the orthography rule enforced; the deferred word cuts done now that the voice exists.

Deliverables:
1. **Orthography**: the rule in `IDENTIDADE.md` v2; one conversion pass over all public strings, house prose (`derivation`, notes shown, reading-page sentences, page texts), the two mixed identifiers in the ledger's kind names (`actualizacao` → the chosen form, with the migration recorded); verbatim fields untouched; a check in `gate-html.mjs` over rendered text with verbatim elements excluded, wordlist of the differing forms, baseline recorded, planted defect proven.
2. **`/sobre` · `/en/about`**: the decided two sentences and the door to Método; English mirror; footer authorship line removed everywhere (gate updated, decision recorded); the vault's counsel-brief note kept open on Art. 50 disclosure at publication level.
3. **`/metodo` · `/en/method`**: the ten points as rules with live proof; the gates emit a machine-readable summary at build time (`dist/prova.json` or similar: rows, pages, sealed values, corrections by kind, last panel check, last blind re-read when the field exists); the page renders each rule with its mechanism and last proof; the mechanism drawn as an instrument (fontes → motor → livro-razão → construção → página → leitor, with agenda, releitura, correcções feeding back) carrying today's numbers on each node; the old Método content folded in at a third of its length; `/metodo#correcoes` register moves to `/correcoes`.
4. **`/correcoes` · `/en/corrections`**: the register (correções and actualizações listed; revisões de proveniência as counts with links to rows), the policy stated once, the door.
5. **`/agenda` · `/en/agenda`**: four states (em curso · a seguir · concluído · retirado); each item: title, the question, porquê with its criterion (institutional framework linked to ledger rows / source calendar / reader request or correction), proposed-by-AI date, decided-by-director date, entered, last change, change log with reasons; seeded with what is real: housing (next study; framework flags), the DGAL 2025 file watch, the Évora 2026 accounts watch, the vanished 2024 page; the agenda is the public face of the engine's pre-registration (`core/prereg.py`, first records written); nothing leaves silently (the change log is gate-checked like corrections).
6. **Source calendar** (engine, `indicators/calendar.json`): built from the sources' own release calendars where published (INE and Eurostat certainly; DGAL, IEFP, ERSAR to verify), `watch_next_events.py` wired to the monthly agent and its three events entered; the calendar feeds the agenda's "a seguir" and, later, the freshness lines.
7. **No quiet course change**: `DECISIONS.md` entries carry `afecta: sobre|metodo|agenda|nenhum`; the check refuses a flagged entry unless the text changed in the block or the entry says why not; proven on a planted entry.
8. **The deferred word cuts**: the corrections policy off the 264 row pages (link to `/correcoes`); the no-rankings pledge to Sobre/Método and the Évora page's «Quem responde pelo quê» only; the Évora apparatus reduced to one home per caveat; the frame-phrase count and meta-commentary count recorded as the baseline `gate:identidade` will hold.
9. **Masthead**: «Edição de …» removed; the weekly panel date line; the agenda line when `/agenda` ships (same block, so both).
10. **`ABOUT.md`** cut to the idea plus pointers to the live pages; artifact republished.

Acceptance: build green with the new checks; Codex review of the diff and a canaried read of the four new pages; preview; director's word; merge; `verify:deploy`; the two-minute test re-scored (expect (a) pass, (b) partial: index exists, measures pending, (c) partial, (d) pass).

Cost: roughly 700k to 1M (Opus build in two or three agents; Codex two reviews; Sonnet for the wordlist and string pass).

## Phase 2 — design explorations (after Block V, or before it if the director prefers)

Goal: the visual direction chosen against the trust brief's acceptance tests, then `IDENTIDADE.md` v2.

1. Claude Design trial: import the current tokens and CSS; prototype the row page (the trust page), the front page, the município page, Sobre/Método, the agenda; three directions (refinement / instrument-forward / editorial-generous); live HTML the director reacts to. `[verify]` how well the import handles the Astro/CSS-token codebase; a small trial first.
2. `IDENTIDADE.md` v2: the visual rules that survive, plus the voice rules (state the idea and stop; no dashes; one home per caveat; where time is shown; the orthography), and the seal/legend conventions now written down.
3. DesignSync to keep components aligned once the direction is chosen.

Cost: mostly the director's reading time; orchestration 200k to 300k; Claude Design usage on the Max plan `[verify]`.

## Block T — the trust page (the row page becomes the receipt)

Goal: any number → the printed line in one click; every row shows when it was last read and last independently re-read; the register-sum rows leave the marker.

1. Format extensions with fail-tests: `document.page` (integer), `document.crop` (asset reference + its own sha256), `verifications[]` (date, path, result, by); the exporter carries them; the gate compares them.
2. Receipts crossing through `publisher/` as assets + manifest (never rendered output): crops for the crossed rows that have them (the engine has 168 for the Évora set; the site's 70 are not the same set, so a manifest maps what exists and the engine produces the missing ones under its own gates); the row page shows the crop under «Onde no documento» with «Abrir na página N».
3. `verifications[]` populated: the 2026-08-15 blind re-fetch on the 24 Évora rows it covered; the weekly panel refresh writing entries for the 32 baseline rows; the row page shows the last two.
4. The "computed over a hosted data file" origin: the PRR entity listing snapshot and the CAOP files hosted with sha256 where the licence allows (dados.gov.pt open data and CAOP CC BY 4.0 `[verify per source]`); the sum shown with its arithmetic; the marker leaves those rows; the PRR extraction re-run against the current snapshot under the engine's gates (values may move; typed actualizações).
5. API rows: the human page for the series shown first, the exact request second, the returned field labelled as such; `document.kind` used, the URL heuristic gone.
6. Ledger downloadable as a dataset (CSV/JSON) with its licence stated (the licence is a director's decision: CC BY 4.0 recommended); per-row JSON.
7. A real page-change model for sitemap `lastmod` (git over each page's full input set incl. shared components) or none.
8. The engine's fixed-width excerpt extractor fixed so no excerpt is cut mid-number (three known rows).

Cost: 800k to 1.2M.

## Phase 4 — the two gate exceptions

1. `gate:identidade`: seal beside every value (SVG via declared legend), the marker only in its class, palette (no colour outside the tokens), allowlist size against baseline, frame-phrase and meta-commentary counts against baseline, orthography (moved from gate-html if built there), no em dashes; each proven on planted defects.
2. The prose gate: the engine's `assertions` discipline ported to the site: quantifiers («sempre», «a maior parte», «cerca de», «muito») declared and backed by a row or refused; causal connectives flagged for review; proven on today's four cases.

Cost: 400k to 600k.

## Content — the studies and the fan-out (interleaved with the above: one study per product block)

1. **Housing** (first pre-registered study, first domain page): question fixed and sealed before collection (`core/prereg.py`); the institutional flags as its criterion (MIP threshold, Semester, IMF, OECD, F4GC) each a ledger row; blind re-derivation of headline figures; cross-family review; its agenda item public first.
2. **Water**: the director's own question (is the investment going where the loss is); the desalination side from primary sources; closes the water rows in debt; needs the APA/SNIRH session listed in the vault.
3. **The municipal fan-out**: the framework survey for municipal indicators (DGAL's legal debt limit and index, PMP and execution if DGAL publishes them for all `[verify]`, INE population and purchasing power, IEFP unemployment, SCIE enterprises); the aggregator extraction under the engine's gates; 308 pages generated with the empty state where a measure is missing; the stewardship spine per municipality as the governance data allows (the "who governed" open dataset does not exist; building it is the long project, gated on the counsel brief's cluster B).
4. **Domain pages** in the order verified material exists: public money and economy, housing, water, energy; then education and health; then justice, science, culture. Each begins with a framework survey (which institution assesses it, with which few indicators and thresholds), never with our own picks.
5. **Series**: the engine's observations store crossing to the site so evolution can be shown (the ledger holds point values).
6. **The trust ratchet for the weekly refresh**: proposed diff + report reviewed → deploy; after N clean approvals, value-only refreshes that pass all canaries auto-publish.

## Standing items

- Legal: the counsel brief (`legal/counsel-brief.md`) needs the director's §7 checklist before it goes to Portuguese media/IP counsel; cluster B (party affiliation as special-category data) gates the stewardship spine at scale; Art. 50 disclosure at publication level recorded.
- Engine housekeeping: `content/05 Fund Access Register` never committed; `core.reconcile` NBSP regex (a gate helper, under the moratorium); the seven studies' registration debt stays as debt by design.
- The director's own reads: the pt-PT edition of 04 (the recorded missing human step); the Método cut at preview.
- Review point: end of September 2026, against the two-minute test and this plan.

## The next session, in order

1. If the director has not yet given his word on Block V: read the preview (Sobre, the cut of Método, the orthography, the housing question), apply his cut on the built page (both editions), merge `voz` in both repos, `verify:deploy`, close the records (DECISIONS §4, vault note, `NEXT.md`, this plan). If Nuno overrules the orthography: rerun `scripts/ortografia.mjs --aplicar --sentido=anterior`, hand-review the listed one-way forms, flip the rule in `IDENTIDADE.md` §9, rebuild.
2. Then decide with the director whether Phase 2 (design explorations) or Block T (the trust page) comes next; the housing study's pre-registration exists (`ResearchHub/content/10 Housing/preregistration.json`, unfrozen) and its question awaits his read; sealing it is the first act of the study.
3. Standing from Block V's record (`DECISIONS.md` §4): the eight sources with no published calendar (re-check ERSAR); the reworded-correction duplication on re-export (engine V10's counterpart); calendar history; the two mechanisms for site counts (house rows vs `data-prova`); dead string keys; the five pre-Acordo forms left in the unpublished `note` field.
