Green light to build the redesign, phase 1, on the branch `redesenho-v3` of the site repo ~/Instruments/OEstadoDoPais. Site repo only: anything that needs the engine (~/Instruments/ResearchHub) is an ask, not a task. Nothing outward, no deploy, no merge, no publishing to the canvas, without my explicit go. Standing arrangement: Fable manages and reviews, Opus builds, Sonnet does mechanical passes and blind measurements (no sub-agents in blind prompts), Codex reads across families with planted defects; say which model ran which part in every report.

READ FIRST, IN THIS ORDER

1. `design/especime-v3/ESTADO-DO-MAIN-2026-08-20.md`: what `main` actually is today. The handoff was written for a `main` that no longer exists; «your current Block T state» is withdrawn, Block T merged on 18.08 and two blocks followed on 20.08.
2. `PLANO-fases.md`, «The rules that govern every block», and `DECISIONS.md` §4. Rule 1 binds this block.
3. The vault, ~/Obsidian/Experiments/O Estado do País.md → eleventh block, «HANDOFF FOR BLOCK T» (points 1 to 10, plus 9a share card and 10a scroll discipline) and the critique entry above it with the eight site defects; then §Twelfth block for the day of 20.08. A copy of the handoff as of 20.08 evening is in `design/especime-v3/HANDOFF-eleventh-block-2026-08-20.md`.
4. ~/Obsidian/Experiments/O Estado do País — Constituição visual v3.1.md, including «Emendas · 2026-08-20». Binding. The repo copy `design/especime-v3/direcao.md` was refreshed from it on 20.08 evening; the vault is the source.
5. The cross-family critique of the first plan: `design/especime-v3/critica/2026-08-20-codex-critica-do-plano.md` (Codex, xhigh, 20 findings, 4 critical, verdict «do not approve as written»). My answers to its four critical findings are below and they are not open.
6. The canvas, latest published: https://claude.ai/code/artifact/3ea5c63c-635b-4135-9086-3f8767389585 (page «v3» = desktop prototype, mobile 390, share-card reference; page «Páginas» = interior pages). Work from the local copies in `design/especime-v3/maquetas/` (`V3Completo.dc.html`, `V3Movel.dc.html`, the v1 boards) so you can read and diff them; the canvas is the visual cross-check. Say which boards you read.

PRECEDENCE, HIGHEST FIRST

The Emendas of 2026-08-20; then the rest of the constitution v3.1; then the state note for anything about what the repo is today; then the handoff's numbered points; then `IDENTIDADE.md` v2; then the canvas boards. Boards never win.

The Emendas beat the handoff's own points, and here is the one that matters: handoff point 5 says the map is a stamp on the home. That is the posture I overruled on 20.08. The rule is Emenda 3, the map breathes: full map with its ficha in País scope and in concelho choice, contracting to the locator card when a concelho is chosen and the reading deepens; no município highlighted by status, not the capital, not district or region capitals, all 308 points equal, the only distinction ■/□ coverage, with the legend beside the map; on mobile the map is not a point selector (coverage stamp, locator, proximity list, search as the main path). The v3 board already shows the breathing map; the handoff's point 5 is the stale text.

WHAT THE BOARDS CARRY THAT MUST NOT SHIP (seen on 20.08)

«Protótipo: um toque num bloco muda só a densidade dele»; the colophon «Maqueta v3 · protótipo · tipos substitutos»; the footer paraphrase of the Sobre and «A direção é de Nuno dos Santos» (footer is navigation only, decided 15.08); the map ficha's «Total 308 · [a verificar]» (the marker left the CAOP rows on 18.08); the mobile tile's «+29,7» distance and any computed distance without a row; «61,44%» with the unit symbol inside the value element (the gate compares the rendered string: symbol outside); «Publicação: 2026-08-12» on study rows whose archive date is null (render `[a verificar]`, never the `updated` date); the headline and lede counts written as words (they come from proof keys, three of them: total, with threshold, outside threshold, each recounted by the gate with its door); the three-density remnants. The home as drawn predates point 10a: Municípios, Estudos and Agenda become one-line doors with real counts, their full versions live on their own pages.

STAGE 0, FIRST, AND SHORT

Commit to the branch before any visual work:
- the base SHA from `git rev-parse origin/main`, pinned in the plan; if it is not what the state note says, say what moved. `main` is not frozen (weekly panel refresh on Mondays, monthly sweep, monthly PRR re-extraction): compare `<base>..<branch>`, rebase at every stage boundary, re-run the rulers, and report if a rebase moved a value or a count;
- a carry-forward table of every open item in `DECISIONS.md` §4 and of the eight defects (already graded against today's main in the state note §4), each with the stage that touches it and one of: preserved, fixed here, still deferred and why;
- the relocation register and the English key plan (below);
- the plan itself, as `design/especime-v3/PLANO-redesenho-v3.md`, stage by stage, with the file list each stage owns, the disposition of all 20 critique findings, and a route and page-family matrix for both editions (home, ledger index and rows, municipality index and rows, studies and reading pages, Método, Agenda, Correções, Sobre, hosted documents, masthead and footer): what changes, what is preserved. The one-message summary in chat is the summary, not the plan.

The reconciliation is item by item against the state note: its §2 (the six things the handoff does not know) and its §5 (the seven things the constitution does not cover), each with implement, flag or ask beside it. Read the gate scripts themselves, not their names; the corrections door count is a ruler measure outside the build, not a gate.

Then proceed with stage 1 without waiting for my word on the plan. The only two things that wait are the decisions listed at the end and the preview after the home.

MY ANSWERS TO THE FOUR CRITICAL FINDINGS, NOT OPEN

1. Content invariance is an advisor. It prints, it never fails a build, it lives outside `npm run build` like `medir-defeitos.mjs`. Anything that must be enforced becomes an extension of `gate:html`, `ledger:check` or `check:dados`, each proven on a planted defect. A check that must pass before a merge is a gate whatever you call it; if you conclude you need one, stop and ask with the real uncovered defect and the proposed contract.
2. Text and numbers move only by an authorised relocation, written down before the move: source route, destination route, component, scope, language, occurrence count, claim or proof key. The visible scope label and the value move as one unit. There is no «it existed somewhere on the old site» exception. This is the scope-bleed defect, the one that can put an Évora number under Beja.
3. Runtime code selects prevalidated strings and never formats a figure. Declare the closed URL state schema (scope, density, edition), resolve every query value through closed route data, never into `innerHTML`, keep a correct server-rendered default that works with JavaScript off. The dump reads text nodes and cannot see scripts or attributes, so dump the rendered DOM for a state matrix, not only the source HTML.
4. Every governed change lands in the same commit as its decision entry, with `Afecta:` and the digest, per §1.38. No governed byte changes before I have approved the exact sentence.

ENGLISH

Every stage adds PT and EN keys in the same commit. `assertKeyParity()` throws at every build, so a stage that is green only because English is missing is not green and you may not report it as green; PT copied into EN does not count. Decide the state vocabulary once, before the first stage that renders it, and send me those words alone first: fora do limiar, dentro do limiar, sem limiar, por confirmar, plus the coverage words. The full PT to EN list still comes to me for voice review before merge; voice review is not what unblocks the build, and a word I change later is one string, not a stage.

ONE GLYPH, ONE MEANING

The dashed square currently means incomplete provenance in the seal, «por confirmar» in the constitution, and «por ler» in the v3 state row, while the empty square means «sem página ainda» on the map, and the prototype adds «0 linhas · ainda». Defect 7 of the eight is precisely three phrasings for municipal coverage. Before the home ships, coverage gets one vocabulary in both editions, and the defect counts as closed when the ruler's count of distinct coverage phrasings is one, measured.

SHARE CARDS (point 9a), AND THIS IS THE CONDITION FOR THEM COUNTING AS DONE

A number rendered into an image is invisible to every check the site has. So: the card renders from ledger rows and proof keys through the same component path the page uses, never a second formatting path, never a hand-written string, never `og:` metadata typed by hand. The build writes one machine-readable record per card (route, edition, dimensions, output digest, exact visible copy, each value with its row id or proof key, unit, period), and an extension of the existing checks re-derives every value from `ledger/claims/` and the proof and compares it as a string by the same rule as `data-claim`. Prove it with plants: a wrong number, a value stale against its row, a card for the wrong route or language, a wrong dimension; show the build refusing each. Cards are build artefacts, regenerated at every build and never committed, because a committed card is written state. The state is written in words on the card as well as shown in the strip, no map dots, no colour outside the state pair, and a card carries no value its own page does not carry. Cards come after page semantics are stable, not before.

GOVERNED TEXT

There are two Método lines in this block, not one: the colour line (colour appears only where the source publishes a threshold; the yellow becomes warning, the oxblood retires) and the type line (where the letter comes from, self-hosted, and per Emenda 5 it does not claim the Gini 1938 lineage). Both are governed: draft the exact sentence in both editions, send it to me, change the byte only after I say yes, with the `DECISIONS.md` entry carrying `Afecta: metodo` in the same commit. `IDENTIDADE.md` §1 («sem tipos de rede» becomes self-hosted only, no third-party font hosts) and §2 (what the yellow and the oxblood mean) change in this block too, with their own entry, before the first stage that depends on them. Every sentence `IDENTIDADE.md` quotes from Método or Sobre is compared word for word by `ledger:check`: move a governed sentence and fix its quotation in the same commit, or the build stops. Before wiring any font, read `vercel.json` and confirm self-hosted faces load under whatever policy it sets; fonts are upstream bytes or lossless WOFF2, no subsetting (the OFL's reserved names), `OFL.txt` beside them, upstream commit and digests recorded, Bitter's `tnum` measured on the built page.

SCOPE

Phase 1 is the v3 home desktop and mobile, the interior pages under the Emendas, the eight defects, the share cards. Phase 2 stays parked, and on the home that means the catálogo and dossiê block does not ship: no block, no placeholder, no door to an address that does not exist yet, recorded in the plan as a named deviation from the approved prototype. For pages with no v3 board (correções, arquivo dos estudos, documento alojado) the rule is the Emendas plus `IDENTIDADE.md` §3: choose one of the three dispositions, do not invent a fourth, and the hosted document keeps exact bytes with no site stylesheet. Where the row page and the ledger index have doors the boards do not show (JSON per row, the archived copy inside «Calculado sobre», the dataset block and its licence), the repo wins over the board. Two constitution rules cannot be met in phase 1 and go in the plan, not carried silently: frame phrases capped at twelve distinct against seventy-seven today, and the mock-ups reusing front-page qualifying phrases that the defect register lists as claims without a door.

STAGES AND VERIFICATION

One builder owns one stage; its file list is written before it starts; shared CSS and shared components have one owner for the whole phase. Commit at every substage and write the stage note at the checkpoint, before the audit, so a session cut costs one substage. Exit criteria are deliverables, not token counts, but state a rough scale per stage and tell me if a stage passes its estimate by half.

The path out is the standing one, no exceptions: build green, cross-family read by another family with planted defects, protected preview, my word, merge, `verify:deploy`, design bundle and DesignSync. Two previews, not one. The first goes up after the home, desktop and mobile, and before the interior pages, and I read it. That is the one wait that saves money: I am not paying to rebuild ten interiors under a direction I have not seen running.

The home is stateful, so it gets an acceptance matrix, run and reported: keyboard order and focus return, state announced and not only shown, both editions, both themes, 320 / 390 / intermediate / 1280, reduced motion, back and forward, reload, language switch preserving scope and density, invalid and unknown query values, and the no-JavaScript default rendering something correct. The seal is its row's largest tap target, at least 44px, never nested. Every new colour pair goes into `medir-contraste.mjs`, light and dark, and the measurements go in the report; a pair that is not in the array is a pair nobody measured; if the boards carry no dark palette, that is an ask, not an invention. Run `medir-defeitos.mjs` before and after each stage and report the deltas.

STOP AND ASK ME, AND DO NOT IMPROVISE AROUND

While you wait, park the item. Do not build the workaround, and keep building only what my answer cannot change. Say what is parked and what you are proceeding with.

- the handoff or the constitution conflicts with repo reality, an existing gate (ledger gate, assertKeyParity, gate:html) or a standing decision: name the conflict and your recommendation;
- a mock-up implies any value, claim or copy with no ledger row or proof key: never invent, use [a verificar] or cut, and tell me;
- a fix needs an editorial call. An editorial call is anything that changes what the site says rather than how it looks: the wording of any public sentence in either edition; the wording or form of a state, a marker or an empty state; which measures the home carries and in what order; what the navigation contains; whether a value is shown as provisional, final or withheld; anything governed by §1.38. Type, spacing, grid, weight, scale and motion are yours;
- you would need a new gate. The moratorium stands, product before gates; extensions of existing checks proven on planted defects are expected and are not new gates;
- a constitution rule cannot be met as specified. If it governs what the reader is told (state vocabulary, colour meaning, seal, marker, distance in words and number, map neutrality), stop before implementing a substitute. If it governs form only, implement the closest honest version, measure it, and put the deviation in the plan and in that milestone's report, not at the end.

DECIDE WITH ME BEFORE THE STAGE THAT NEEDS THEM

- whether Correções makes the masthead an eight-item navigation, with the constitution's count of seven amended in this block, or replaces an item (my leaning: eight);
- whether «por ler» is a fifth measurement state or an editorial coverage label outside the closed vocabulary (my leaning: a coverage label);
- what provenance form the correction register's old and new values get, since restyling from oxblood to form does not close that debt;
- the front-page form for the Eurostat provisional flag, in words, with an inventory of every surface where that claim renders (the row already carries `source_flag: "p"` and the note since 13.08; the seal stays the door, the note is content);
- whether phase 1 ships the ruler without the numeric distance and is therefore described as partial (my leaning: yes, deferred to derived rows crossed from the engine).

REPORTING

At each stage boundary, not at the end of the phase: what shipped, screenshots at 1280 and 390 in both editions, gate and ruler status with deltas, the EN keys added, the relocations authorised in that stage, the contrast measurements, and a running ISSUES list including the ones you closed. Say which model ran which part and the tokens spent. Surface a blocker the moment it appears.

Start by telling me in ten lines what you read, the base SHA, which boards you read and whether they match the Emendas (the map, the densities, the colour rule), the first three conflicts you see between the handoff and the repo, and what stage 0 will commit. Then go.
