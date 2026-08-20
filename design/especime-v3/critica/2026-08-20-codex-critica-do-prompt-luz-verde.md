# Crítica do prompt «luz verde» (Codex, sem contexto), 2026-08-20

*Corrida pelo lugar de direção da sessão de 20.08 a pedido da direção: Codex CLI 0.147.0, `gpt-5.6-sol`, xhigh, sem rede, com o prompt, o handoff, a constituição v3.1, o estado de main, o roteiro, a IDENTIDADE.md e a crítica do primeiro plano. 102 685 tokens como o CLI reporta. Veredicto: não aprovar como está. Relatório verbatim.*

---

The prompt is not safe to issue as a green light. It orders implementation before the project’s block-start gate and the rejected plan’s four critical defects have been resolved, relies on a superseded “Block T state,” leaves several known director decisions to the builder, and assumes raster share cards inherit HTML provenance checks when they do not. I found **14 findings: 6 critical, 7 high, and 1 medium**. Verdict: **do not approve as written**. The absent `docs/PROMPT-anterior-plano-primeiro.md` also prevents the requested direct comparison with the previous session prompt.

## Critical findings

### 1. It bypasses both the plan-approval gate and the block-start gate

- **Prompt says:** State a plan in one message and immediately “PROCEED with phase 1 without waiting” ([green-light L15–18](leitura/docs/PROMPT-green-light.md:15)).
- **Evidence says:** A block cannot start while prior defects are neither fixed nor deferred in writing ([roadmap L23–28](leitura/docs/PLANO-fases.md:23)), and §4 must be clean or written before a block starts ([roadmap L115–118](leitura/docs/PLANO-fases.md:115)). The previous plan received “do not approve as written,” with four critical findings requiring structural revision before work starts ([critique L21–34](leitura/docs/CRITICA-do-primeiro-plano.md:21), [critique L211](leitura/docs/CRITICA-do-primeiro-plano.md:211)).
- **Why it matters:** “State a plan and proceed” converts an approval gate into a status update. The build can begin with an unsafe content-invariance design, unresolved governance ordering, and open §4 debt.
- **Exact change:**

> Before any heavy implementation, produce a revised implementation plan that dispositions all 20 critique findings and carries forward every open `DECISIONS.md` §4 item. The four critical findings must have concrete resolutions. Then STOP and wait for my approval of that plan. Read-only inspection and creation of an empty branch are allowed; do not change product code, public content, governance files, or gates before approval.

### 2. “Your current Block T state” is stale and no baseline is pinned

- **Prompt says:** Reconcile the plan with “your current Block T state” ([green-light L15–16](leitura/docs/PROMPT-green-light.md:15)).
- **Evidence says:** The state note explicitly warns that the handoff describes a `main` that no longer exists ([state L3–7](leitura/docs/ESTADO-DO-MAIN.md:3)). At the recorded time, `main`, `origin/main`, and production were `9b9f477` ([state L9–15](leitura/docs/ESTADO-DO-MAIN.md:9)); Block T was already merged and live ([roadmap L115–119](leitura/docs/PLANO-fases.md:115)). The handoff does not know about later receipt, dataset, Método, and PRR changes ([state L25–58](leitura/docs/ESTADO-DO-MAIN.md:25)).
- **Why it matters:** A builder may plan against old components, omit live functionality, or use a drifting `main...branch` comparison whose baseline is not the claimed state.
- **Exact change:**

> Do not use “your Block T state” or conversational memory as the baseline. Read `ESTADO-DO-MAIN.md`, then verify the repository’s actual `main`, `origin/main`, and working-tree state. Record the exact base SHA. If it differs from the state note, inspect the intervening diff before planning; if it changes any affected surface, gate, content source, or decision, STOP with a rebaseline recommendation. Compare `<base>..HEAD`, not `main...branch`.

### 3. The prompt does not resolve whether content invariance is an advisor or a prohibited new gate

- **Prompt says:** Stop if a new gate is needed, but says nothing about the previous plan’s already-proposed failing comparison ([green-light L22–30](leitura/docs/PROMPT-green-light.md:22)).
- **Evidence says:** The previous plan made its “ruler” release-blocking, which is functionally a new gate ([critique L27–34](leitura/docs/CRITICA-do-primeiro-plano.md:27)). URL-driven runtime content also escapes a static HTML dump ([critique L36–43](leitura/docs/CRITICA-do-primeiro-plano.md:36)). Project rules permit only extensions of existing checks unless a real uncovered defect justifies a new gate, with every extension proved by a planted defect ([roadmap L25–27](leitura/docs/PLANO-fases.md:25), [identity L212–223](leitura/docs/IDENTIDADE.md:212)).
- **Why it matters:** Without an explicit classification, the session can retain the rejected mechanism under a different name or falsely treat a static dump as proof of runtime state.
- **Exact change:**

> The cross-build content comparison is advisory: it reports differences, does not fail, is not part of `npm run build`, and cannot block a stage or release. Enforceable invariants must be planted extensions of existing gates. For URL-driven content, define a closed state schema and prevalidated data island; runtime code may select checked strings but may not format values or accept arbitrary display text. Test representative resulting DOM states, invalid and unknown parameters, reload, back/forward, language switching, and the no-JavaScript default.

### 4. There is no governed allowlist for relocation or duplication

- **Prompt says:** Implement the redesign broadly, but gives no rule for moving existing content between routes, scopes, components, or languages ([green-light L17–18](leitura/docs/PROMPT-green-light.md:17)).
- **Evidence says:** The rejected plan allowed content found anywhere on the old site to appear elsewhere, recreating the adopted municipality scope-bleed defect ([critique L45–52](leitura/docs/CRITICA-do-primeiro-plano.md:45)). Its protected-source manifest was also incomplete ([critique L119–126](leitura/docs/CRITICA-do-primeiro-plano.md:119)).
- **Why it matters:** An authentic number can still be false in its new context. A global “already existed” exception also permits accidental duplication.
- **Exact change:**

> No global relocation exception. Before moving or duplicating public content, add an allowlist entry naming the exact source route, destination route, component, scope, language, expected occurrence count, and governing claim/proof key. A value moves with its visible scope label, unit, period, state, and provenance as one unit. Anything outside that allowlist is a content change and triggers STOP.

### 5. Governed changes are not paired with their decisions

- **Prompt says:** Stop when an existing decision conflicts, but does not require a new decision entry to accompany a governed change ([green-light L23–25](leitura/docs/PROMPT-green-light.md:23)).
- **Evidence says:** The rejected plan scheduled decision records after the changes they governed ([critique L54–61](leitura/docs/CRITICA-do-primeiro-plano.md:54)). Project state is rendered rather than written, and changes of idea happen by decision ([roadmap L28](leitura/docs/PLANO-fases.md:28)). The remaining colour sentence in Método is expressly governed ([state L43–51](leitura/docs/ESTADO-DO-MAIN.md:43)).
- **Why it matters:** Intermediate builds can fail the decision tether, while the code appears to establish a decision that the owner never made.
- **Exact change:**

> Pair every governed public-text or constitutional change with its `DECISIONS.md` entry in the same stage and commit. Record the adopted v3 constitutional resolution before or alongside the first implementation that depends on it. Do not change Método until I have approved the exact PT and EN wording.

### 6. Share-card numbers create a provenance hole the current gates cannot see

- **Prompt says:** Include “share cards” in phase 1 without specifying their generation or verification contract ([green-light L17–18](leitura/docs/PROMPT-green-light.md:17)).
- **Evidence says:** Point 9a requires generated cards, values that age with the site, and no number without its ledger row ([handoff L27](leitura/docs/HANDOFF.md:27)). Current provenance checks inspect rendered HTML, `.src-chip`, `data-claim`, and `data-prova` ([state L60–75](leitura/docs/ESTADO-DO-MAIN.md:60), [identity L225–234](leitura/docs/IDENTIDADE.md:225)). Once a number is rasterized into PNG pixels, those checks cannot read it.
- **Why it matters:** A stale, mistyped, wrong-scope, or hand-edited image can pass every existing page gate. A headline such as “four of eight” is also a house count requiring `data-prova`, not a ledger row.
- **Exact change:**

> Share cards are public numerical content, and raster pixels are invisible to the current HTML sweep. Generate each card only from a semantic, machine-readable pre-raster source built from the same ledger rows, proof keys, and i18n strings as the page. Emit a manifest containing route, edition, dimensions, output path and digest, exact visible copy, and every numerical token classified as either a ledger claim ID, a `data-prova` key with its door, or an existing declared non-content exception. Extend an existing gate, with planted defects, to validate that manifest, the pre-raster source, the page’s `og:image`/Twitter mapping and alt text, output freshness, and both required dimensions. Regenerate deterministically on every build; no hand-edited image is an input. Plant at least: wrong value, missing claim/proof key, stale output, wrong route or language, and wrong dimensions. If this cannot be enforced by extending an existing gate, STOP before generating numerical cards.

## High findings

### 7. The “STOP AND ASK” section contradicts itself

- **Prompt says:** Under a mandatory stop heading, it also says “use `[a verificar]` or cut” ([green-light L26–27](leitura/docs/PROMPT-green-light.md:26)), “fix early” ([green-light L28–29](leitura/docs/PROMPT-green-light.md:28)), and “implement the closest honest version” when a constitutional rule cannot be met ([green-light L31–32](leitura/docs/PROMPT-green-light.md:31)).
- **Evidence says:** Several known conflicts require director decisions, not fallback implementation: navigation, Método, numeric distance, and `por ler` ([critique L65–81](leitura/docs/CRITICA-do-primeiro-plano.md:65), [critique L146–153](leitura/docs/CRITICA-do-primeiro-plano.md:146), [critique L202–209](leitura/docs/CRITICA-do-primeiro-plano.md:202)).
- **Why it matters:** The builder cannot know whether “STOP” or “implement” wins.
- **Exact change:**

> STOP means: pause the affected work before making the disputed public change. Do not implement a closest version, add `[a verificar]`, cut content, or make the editorial decision until I answer. Report the exact conflict, affected routes, recommendation, and cheapest safe fallback. Continue only independent work that cannot prejudice the decision.

### 8. English still arrives too late

- **Prompt says:** Draft English and show the full list “before they ship” ([green-light L34–35](leitura/docs/PROMPT-green-light.md:34)).
- **Evidence says:** New PT-only keys fail every intermediate build because `assertKeyParity()` requires both editions together ([state L84–88](leitura/docs/ESTADO-DO-MAIN.md:84)). The critique explicitly requires PT and considered EN in each stage ([critique L92–99](leitura/docs/CRITICA-do-primeiro-plano.md:92)).
- **Why it matters:** “Before ship” permits broken intermediate builds and placeholder English that passes key parity without being a real translation.
- **Exact change:**

> Every stage that adds or changes PT copy adds the considered EN equivalent in the same change. No empty value, PT copied into EN, or temporary placeholder counts as parity. Keep the full PT→EN review list from the first stage onward and present it before the first protected preview. Do not merge new copy until I approve its voice.

### 9. A running issues list is not an inherited defect register

- **Prompt says:** Keep a running `ISSUES` list after milestones ([green-light L37–39](leitura/docs/PROMPT-green-light.md:37)).
- **Evidence says:** The redesign must start with all open §4 defects carried forward, including unsupported prose, inaccessible seals/state, written counts, missing language metadata, false dataset promises, and unsealed correction values ([critique L137–144](leitura/docs/CRITICA-do-primeiro-plano.md:137)). The current eight design defects remain mostly open ([state L90–101](leitura/docs/ESTADO-DO-MAIN.md:90)).
- **Why it matters:** A fresh list forgets inherited debt and can falsely imply that touched surfaces were comprehensively cleared.
- **Exact change:**

> In R0, copy every open `DECISIONS.md` §4 item and all eight handoff defects into a carry-forward table with current status, affected routes, stage, owner, and required exit state: `preserved`, `fixed`, or `still deferred in writing`. Do not replace this table with a new-session issues list. Keep resolved rows visible.

### 10. Phase 1 is too large and has no intermediate preview

- **Prompt says:** Proceed through home desktop/mobile, all interiors, eight defects, and cards as one phase ([green-light L15–18](leitura/docs/PROMPT-green-light.md:15)).
- **Evidence says:** The critique found the proposed stages oversized, internally conflicting in ownership, and unsafe across session cuts ([critique L155–162](leitura/docs/CRITICA-do-primeiro-plano.md:155)). The roadmap requires a preview and the director’s word before merge ([roadmap L27](leitura/docs/PLANO-fases.md:27)).
- **Why it matters:** The design can be multiplied across every route before the owner sees the real home and representative interior. End-only notes also vanish if the session is cut.
- **Exact change:**

> Split work into independently buildable stages with deliverable exit criteria, explicit file ownership and one integration owner, a commit and checkpoint note per stage, and green PT/EN builds throughout. Create the first protected preview after the complete home and one representative receipt/interior page work in both languages, before propagating the system to every page family. STOP there for my visual decision. After that approval, continue without waiting between ordinary stages until the final preview.

### 11. Known director decisions are hidden inside generic stop language

- **Prompt says:** Stop only when a conflict is encountered during implementation ([green-light L22–32](leitura/docs/PROMPT-green-light.md:22)).
- **Evidence says:** The conflicts are already known:
  - Constitution says seven navigation items, while Correções is missing ([constitution L44](leitura/docs/Constituicao-visual-v3.1.md:44), [state L95](leitura/docs/ESTADO-DO-MAIN.md:95)).
  - Método still needs the governed colour-semantics sentence ([handoff L24](leitura/docs/HANDOFF.md:24)).
  - The constitution requires distance in words and number; deferral would make phase 1 partial ([constitution L45](leitura/docs/Constituicao-visual-v3.1.md:45), [critique L146–153](leitura/docs/CRITICA-do-primeiro-plano.md:146)).
  - `por ler` is absent from the constitution’s closed four-state vocabulary ([constitution L33–38](leitura/docs/Constituicao-visual-v3.1.md:33), [handoff L26](leitura/docs/HANDOFF.md:26)).
  - Correction old/new values still need a provenance decision ([critique L110–117](leitura/docs/CRITICA-do-primeiro-plano.md:110)).
- **Why it matters:** The session will either rediscover these late or silently choose.
- **Exact change:**

> Put these five decisions in the plan checkpoint, each with a recommendation and consequences, and wait for my answer: navigation composition; exact PT/EN Método line; numeric-distance rows versus an explicit partial-phase deferral; whether `por ler` is an editorial coverage label or a fifth governed state; and the provenance form for correction old/new values.

### 12. Acceptance criteria do not cover the amended design or stateful behaviour

- **Prompt says:** Report screenshots and gate status, without defining what they must prove ([green-light L37–39](leitura/docs/PROMPT-green-light.md:37)).
- **Evidence says:** The amendments require threshold-only colour, marker/word/ruler agreement, no nested seals, precise map modes, real targets, labelled archipelagos, and no bar without a published reference ([constitution L74–82](leitura/docs/Constituicao-visual-v3.1.md:74)). Existing gates do not see layout, layers, or empty states ([identity L291–301](leitura/docs/IDENTIDADE.md:291)). The critique also identifies keyboard, accessible state, zoom, no-JS, query, and history gaps ([critique L164–171](leitura/docs/CRITICA-do-primeiro-plano.md:164)).
- **Why it matters:** A visually wrong or inaccessible implementation can pass every named check.
- **Exact change:**

> Add a route/state acceptance matrix in both languages and themes at 320, 390, an intermediate width, and desktop. Verify formal-threshold provenance; marker, word, and ruler agreement; no-bar cases; no nested targets; every map mode and mobile alternative; keyboard order and focus; accessible state announcements; 200–400% zoom; reduced motion; invalid queries; reload and back/forward; language switching with state preserved; and the no-JavaScript default. Use existing gate extensions with planted defects where markup can prove a rule, and browser/computed-style inspection plus screenshots for the rest.

### 13. “Interior pages” and “share cards” have no complete route inventory

- **Prompt says:** Implement “interior pages under the Emendas” and “share cards” without naming affected families or preservation obligations ([green-light L11–18](leitura/docs/PROMPT-green-light.md:11)).
- **Evidence says:** The state file lists current receipt, dataset, Método, corrections, study archive, hosted-document, footer, and time-signal surfaces absent from the old boards ([state L103–119](leitura/docs/ESTADO-DO-MAIN.md:103)). Local checked-in prototypes and critiques exist and are safer primary inputs than an unverified remote canvas version ([state L121–135](leitura/docs/ESTADO-DO-MAIN.md:121)). Point 9a says one card per page, potentially a much larger fan-out than the prompt acknowledges ([handoff L27](leitura/docs/HANDOFF.md:27)).
- **Why it matters:** “Interior pages” invites omissions, and “per page” can unexpectedly mean hundreds of routes, two editions, and two card dimensions.
- **Exact change:**

> R0 must inventory every public route and page family, both editions, its source board or current-repo source, whether it changes or is preserved, its share-card template, and its acceptance checks. Treat checked-in design artifacts as primary; the canvas is only a visual cross-check. If a remote canvas differs, report a diff and STOP rather than choosing a version. Explicitly size the card fan-out by routes × editions × formats before implementation.

## Medium finding

### 14. The previous plan-only prompt is absent

- **Prompt/package claim:** The requested comparison file is `docs/PROMPT-anterior-plano-primeiro.md`.
- **Evidence:** That path does not exist in `docs/`. The directory contains only the seven other supplied files. The text embedded at the end of the critique is the adversarial review prompt, not the earlier plan-only session prompt ([critique L215–223](leitura/docs/CRITICA-do-primeiro-plano.md:215)).
- **Why it matters:** I cannot verify whether the green-light prompt removed, retained, or contradicted an earlier explicit “plan first, stop before heavy work” instruction.
- **Exact change:**

> Also read `docs/PROMPT-anterior-plano-primeiro.md`. If it is absent, say so and construct the revised plan from the critique and governing documents; do not claim that you reconciled the previous prompt.

## Rewritten prompt

> Green light for the redesign session, but not yet for heavy implementation. First close the rejected plan and baseline gaps. Move fast after the decisions are real; do not wait between routine stages where waiting buys nothing.
>
> Read first, in this order:
>
> 1. `docs/ESTADO-DO-MAIN.md`, then verify the repository’s actual `main`, `origin/main`, working tree, and current build. Record the exact base SHA. The phrase “your current Block T state” is withdrawn: Block T is merged and the handoff predates later changes.
> 2. `docs/PLANO-fases.md`, especially “The rules that govern every block,” “The next session,” and the requirement that `DECISIONS.md` §4 be clean or deferred in writing before a block starts.
> 3. `DECISIONS.md` §1.43 onward and all of §4.
> 4. `docs/CRITICA-do-primeiro-plano.md`, all 20 findings. Its verdict stands until a revised plan closes it.
> 5. `docs/PROMPT-anterior-plano-primeiro.md`, if present. If absent, report that and do not claim comparison.
> 6. `docs/HANDOFF.md`, points 1–10 including 9a and 10a, plus the adopted eight site defects.
> 7. `docs/Constituicao-visual-v3.1.md`, including the 2026-08-20 Emendas.
> 8. `docs/IDENTIDADE.md`. The v3 constitution and amendments replace it only where they conflict. Its provenance, content, voice, governance, and existing-gate rules continue elsewhere.
> 9. The checked-in `design/especime-v3/` artifacts named by the state file. They are the implementation source. Use the canvas only as a visual cross-check; do not treat “v27” or another remote label as verified fact. If it differs from the checked-in artifacts, STOP with a diff and recommendation.
>
> Before heavy implementation, send me one revised-plan message and STOP for approval. Read-only inspection and creation of an empty branch are allowed before that approval; do not change product code, public content, governance files, or gates.
>
> That revised plan must contain:
>
> - The verified base SHA and a policy for `main` advancing. Compare `<base>..HEAD`, not `main...branch`.
> - A disposition for all 20 critique findings. The four critical findings need concrete resolutions, not acknowledgements.
> - A carry-forward table for every open `DECISIONS.md` §4 item and all eight handoff defects: current state, affected routes, stage, owner, and exit result (`preserved`, `fixed`, or `still deferred in writing`). Resolved entries stay visible.
> - A complete route/page-family matrix for both editions, including the home, ledger index and rows, municipality index and rows, studies/archive/reading pages, Método, Agenda, Correções, Sobre, hosted documents, footer and masthead surfaces. Say what changes and what must be preserved.
> - Independently buildable stages with deliverable exit criteria, explicit file ownership and one integration owner, a commit and checkpoint note per stage, and PT/EN green at every stage. Do not size stages by token estimates.
> - A first protected preview after the complete home and one representative receipt/interior page work in both languages, before multiplying the design across the other families. STOP there for my visual decision. This prompt authorizes that protected preview; it does not authorize public deployment.
> - The final protected preview and the project’s required sequence: green build, cross-family review with planted defects where applicable, preview, my word, merge, and `verify:deploy`. Do not merge, publish, or deploy without a later explicit go.
>
> Put these five known decisions in that plan message, each with your recommendation and consequences, and wait for my answer:
>
> 1. Correções versus the constitution’s seven-item navigation: add an eighth item, replace an item, or redesign the composition.
> 2. The exact PT and EN Método sentence for yellow becoming warning and oxblood retiring.
> 3. Numeric distance: cross the necessary derived rows before affected rulers ship, or record an explicit constitutional deferral and call phase 1 partial.
> 4. Whether `por ler` is an editorial coverage label outside the closed measurement states or a fifth governed state, with its PT/EN wording and relationship to `[a verificar]`.
> 5. The provenance form for old/new correction values and the existing-check extension that proves it.
>
> After I approve the revised plan, create the implementation branch from the verified base and proceed without waiting between ordinary stages, except at the intermediate preview, the final preview, and the STOP conditions below. Phase 1 is home desktop/mobile, the explicitly inventoried interior families under the Emendas, the eight defects, and share cards after page semantics are stable. Phase 2 remains catálogo/dossiê only. Do not move other constitutional work into phase 2 silently.
>
> Content invariance:
>
> - The cross-build comparison is advisory. It reports differences, does not fail, is not part of `npm run build`, and cannot block a stage or release.
> - Enforceable invariants must extend an existing gate and be proved with a planted defect. If a genuinely new gate is necessary, STOP before writing it with the real uncovered defect, why no existing gate can cover it, and the proposed contract.
> - No global relocation exception. Every moved or duplicated public item needs an allowlist entry naming exact source route, destination route, component, scope, language, expected occurrence count, and claim/proof key. Move value, scope label, unit, period, state, and provenance together.
> - URL-driven state uses a closed schema and prevalidated data. Runtime code may select checked strings but may not format figures or accept arbitrary display text. Preserve a correct server-rendered/no-JavaScript default. Test invalid and unknown parameters, reload, back/forward, language switching, and representative resulting DOM states.
>
> English:
>
> - Every stage that adds or changes PT copy adds considered EN in the same change. No blank value, PT copied into EN, or temporary placeholder counts.
> - Maintain the full PT→EN review list from the first stage and show it before the intermediate preview. Do not merge new copy until I approve its voice.
>
> Governed changes:
>
> - Pair every governed public-text or constitutional change with its `DECISIONS.md` entry in the same stage and commit.
> - Record the v3 constitutional resolution before or alongside the first implementation that depends on it.
> - Do not change Método until I approve the exact PT and EN wording.
>
> Share cards, point 9a:
>
> - Cards are public numerical content. Raster pixels are invisible to the present HTML provenance sweep.
> - Generate every card only from a semantic pre-raster source using the same ledger claims, proof keys, and i18n strings as its page. No hand-edited PNG is an input.
> - Emit a manifest with route, edition, dimensions, output path and digest, exact visible copy, and every numerical token classified as a ledger claim ID, a `data-prova` key with its door, or an existing declared non-content exception.
> - Extend an existing gate, with planted defects, to validate the manifest, pre-raster source, deterministic output freshness, page metadata and alt text, route/language mapping, and both 1200×630 and 1200×600 outputs. Plant wrong-value, missing-row/proof-key, stale-output, wrong-route/language, and wrong-dimension cases.
> - If that cannot be done by extending an existing gate, STOP before generating numerical cards.
>
> Acceptance must cover both editions and themes at 320, 390, an intermediate width, and desktop: formal-threshold-only colour; marker/word/ruler agreement; no bar without a published reference; no nested seal; correct map modes, real targets and labelled archipelagos; mobile non-map path; keyboard order and focus; accessible state announcements; 200–400% zoom; reduced motion; invalid URL state; reload and history; language switching with state preserved; and no JavaScript. Use existing gate extensions with plants where markup can prove a rule, and browser/computed-style inspection plus screenshots for the rest.
>
> STOP means pause the affected work before making the disputed public change. Do not implement a closest version, add `[a verificar]`, cut content, or make an editorial decision until I answer. Continue only independent work that cannot prejudice the decision.
>
> STOP AND ASK when:
>
> - the actual base differs materially from the recorded state, or `main` advances across affected files;
> - `DECISIONS.md` §4 is not clean or explicitly deferred for this block;
> - any of the five known director decisions above remains unresolved when its stage would begin;
> - the handoff, constitution, current repository, existing gate, or standing decision conflicts;
> - a public value, claim, headline count, period, or copy has no ledger row, proof key, or approved existing exception;
> - a relocation or duplication is absent from the exact allowlist;
> - a governed change lacks its paired decision entry;
> - a new gate would be required;
> - a constitutional rule cannot be implemented as written;
> - a protected preview beyond the two authorized checkpoints, a merge, a public deployment, or another outward action would be required.
>
> Do not stop for ordinary reversible implementation choices inside the approved plan.
>
> After each stage, report what is complete on the branch, not “shipped”: commit, routes and states covered, PT/EN status, screenshots, build and gate results, planted-defect results, content allowlist diff, decision entries, and the complete inherited/running issues table. Surface a blocker immediately rather than saving it for the wrap-up.