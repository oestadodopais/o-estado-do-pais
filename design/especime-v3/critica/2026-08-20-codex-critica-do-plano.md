# Crítica cruzada do Plano do Redesenho v3 (Codex, sem contexto), 2026-08-20

*Corrida pelo lugar de direção da sessão de 20.08 (Claude Fable 5) a pedido da
direção, como segunda opinião de outra família sobre o plano escrito pela sessão
do redesenho, antes de qualquer implementação. Leitor: Codex CLI 0.147.0, modelo
`gpt-5.6-sol`, esforço xhigh, sem rede, numa pasta fora dos repositórios, com: o
texto do plano, o handoff (décimo primeiro bloco do cofre), a Constituição visual
v3.1 com as Emendas, e uma cópia do repositório do sítio sem `.git`, `node_modules`
e `dist` (para conferir cada afirmação do plano sobre ficheiros, chaves e
scripts). Tokens usados, como o CLI reporta: 404 658. Veredicto: não aprovar como
está; rever. O lugar de direção da sessão de 20.08 concorda com a maior parte e
discorda em dois pontos (a adiada distância numérica é decisão de âmbito legítima
se a fase 1 se disser parcial; a linha do Método sobre a cor é da direção, não do
plano para cancelar nem do leitor para exigir). As respostas da direção seguem
na mensagem que ela dá à sessão do redesenho. Relatório verbatim abaixo; os
caminhos `leitura/repo/...` são o repositório, `leitura/docs/...` o plano, o
handoff e a constituição.*

---

The plan’s main safety mechanism is itself unsafe: it introduces a release-blocking gate while calling it a ruler, then permits global “relocation” of content in a way that can recreate the exact scope-bleed defect the redesign was meant to remove. The plan also sequences governance records after governed changes, defers English until stages that cannot build without it, overstates what current scripts verify, and leaves several adopted constitutional requirements without acceptance tests. The design direction is recoverable, but the implementation plan needs structural revision before work starts.

**Finding count:** 20 total. Repository claims: 3; house-rule violations: 3; unsupported handoff/constitution resolutions: 3; required omissions: 5; content-invariance defects: 3; staging, scale, and unnamed risks: 3. Severity: 4 critical, 12 high, 4 medium.

## Critical

### 1. The dump “ruler” is functionally a prohibited new gate

**Class:** House-rule violation.

- **Plan:** The comparison “exits non-zero”, R0 must pass before visual work, and release depends on the final comparison ([plan L100](leitura/docs/PLANO-redesenho-v3.txt:100), [L104](leitura/docs/PLANO-redesenho-v3.txt:104), [L118](leitura/docs/PLANO-redesenho-v3.txt:118)).
- **Evidence:** The existing ruler explicitly says it is not a gate, never fails, and is outside `npm run build` ([medir-defeitos L3](leitura/repo/scripts/medir-defeitos.mjs:3)). The roadmap says to extend existing checks first and allow a new gate only after real content exposes an uncovered rule; every check needs a planted defect ([PLANO-fases L23](leitura/repo/PLANO-fases.md:23)). `IDENTIDADE.md` repeats the moratorium ([IDENTIDADE L212](leitura/repo/IDENTIDADE.md:212)).
- **Why it matters:** Naming a mandatory, failing release condition a “ruler” does not change what it is. It bypasses the decision the house rules require before a new gate exists.
- **Change:** Either keep the comparison advisory, or implement each enforceable invariant as a planted extension of an existing gate, principally `gate:html`. If a cross-build gate is genuinely necessary, record the real defect, why no existing gate can cover it, its exact contract, and the director’s decision before R0.

### 2. URL-driven content can escape both the current gates and the proposed dump

**Class:** Content-invariance defect.

- **Plan:** A script will switch density, scope, and 307 municipal empty states; it will use “one template” and insert the selected CAOP name ([plan L56](leitura/docs/PLANO-redesenho-v3.txt:56)). The dump reads only static HTML text nodes and excludes scripts ([plan L102](leitura/docs/PLANO-redesenho-v3.txt:102)).
- **Evidence:** The public Method explicitly admits that numbers in scripts or attributes pass the sweep ([metodo.mjs L232](leitura/repo/src/data/metodo.mjs:232)). The dump helper ignores `script` and `style`, but not runtime DOM state ([medir-defeitos L49](leitura/repo/scripts/medir-defeitos.mjs:49)). Existing scripts are narrower precedents: the convergence script consumes preformatted, gate-checked data and preserves a correct server-rendered default ([convergencia.js L1](leitura/repo/public/js/convergencia.js:1)).
- **Why it matters:** “One template” necessarily means some visible text is assembled after build. The dump cannot verify the actual municipality view, density, invalid query handling, or combinations of state. It may verify the hidden union or default page while users see something else.
- **Change:** Define a closed URL-state schema and a gate-checked data island. Runtime code must only select prevalidated strings, never format figures or accept arbitrary query text. Add browser tests for every state class, invalid and unknown parameters, reload, back/forward, language switching, and the no-JavaScript default. Dump the resulting DOM for representative query states, not merely the source HTML.

### 3. Global relocation permission recreates the adopted scope-bleed defect

**Class:** Content-invariance defect.

- **Plan:** Any added text or number passes if it appeared verbatim on any route in the old site ([plan L104](leitura/docs/PLANO-redesenho-v3.txt:104)).
- **Evidence:** The adopted critique’s highest-priority defect was exactly valid Évora content appearing under a different selected municipality, allowing readers to attribute Évora figures to Beja ([critique L3](leitura/repo/design/especime-v3/critica/codex-critica.md:3)). The handoff says that finding was adopted ([handoff L11](leitura/docs/HANDOFF-eleventh-block.md:11)).
- **Why it matters:** A value can be authentic, sealed to the right row, and still be dangerously wrong in its new context. The rule also permits duplication, not just relocation, unless occurrence counts and source-to-destination mappings are defined.
- **Change:** Authorize relocations by exact source route, destination route, component, scope, language, and occurrence count. Require the visible scope label and value to move as one governed unit. No global “it existed somewhere” exception.

### 4. Decision records are scheduled after the changes they must govern

**Class:** House-rule violation.

- **Plan:** R1 writes an `IDENTIDADE.md v3 draft`; R4 touches Método; the final `DECISIONS.md §1.50` entry appears only in R7 ([plan L122](leitura/docs/PLANO-redesenho-v3.txt:122), [L134](leitura/docs/PLANO-redesenho-v3.txt:134), [L146](leitura/docs/PLANO-redesenho-v3.txt:146)).
- **Evidence:** State is rendered, never written, and changes of idea happen by decision ([PLANO-fases L28](leitura/repo/PLANO-fases.md:28)). The tether requires the latest decision governing Método to carry its current digest ([check-ledger L94](leitura/repo/scripts/check-ledger.mjs:94)); only `sobre` and `metodo` are mechanically governed ([check-ledger L131](leitura/repo/scripts/check-ledger.mjs:131)).
- **Why it matters:** If Método changes before R7, intermediate builds should fail the tether. If the plan intends to withhold the change until R7, it does not say so. The same late-entry pattern makes the constitution rewrite look decided before its governing record exists.
- **Change:** Pair every governed change with its decision entry in the same stage and commit. Hold the Método byte change until the director has approved the exact sentence. Record the adopted constitution resolution before or alongside the first implementation that depends on it.

## High

### 5. The plan improperly cancels an adopted Método change

**Class:** Unsupported conflict resolution.

- **Plan:** It concludes that no colour sentence should be added because no such sentence currently exists ([plan L28](leitura/docs/PLANO-redesenho-v3.txt:28), [L158](leitura/docs/PLANO-redesenho-v3.txt:158)).
- **Evidence:** The handoff says all recommendations were adopted, specifically “yellow becomes warning, oxblood retired — one Método line at implementation” ([handoff L12](leitura/docs/HANDOFF-eleventh-block.md:12)), and repeats it as an implementation-time task ([handoff L20](leitura/docs/HANDOFF-eleventh-block.md:20)). The repository state note explicitly carries that future governed change forward ([state note L43](leitura/repo/design/especime-v3/ESTADO-DO-MAIN-2026-08-20.md:43)).
- **Why it matters:** The absence of an old sentence disproves the handoff’s premise, not the adopted decision. It does not authorize the plan author to cancel the result.
- **Change:** Draft an accurate new line explaining the public colour semantics and process it through the governed-text path. Otherwise obtain and record an explicit director overrule.

### 6. “The constitution writes eight” is false

**Class:** Repository-claim contradiction.

- **Plan:** It resolves the missing Correções link by adding an eighth item and says “constitution v3 writes eight” ([plan L30](leitura/docs/PLANO-redesenho-v3.txt:30)).
- **Evidence:** The constitution says seven navigation items ([constitution L60](leitura/docs/Constituicao-visual-v3.1.md:60)); none of the binding amendments changes that count ([constitution L90](leitura/docs/Constituicao-visual-v3.1.md:90)). The current masthead has seven items ([Masthead L72](leitura/repo/src/components/Masthead.astro:72)), while the handoff requires fixing the missing Correções entry ([handoff L19](leitura/docs/HANDOFF-eleventh-block.md:19)).
- **Why it matters:** There is a real unresolved conflict: add an eighth destination, replace an existing one, or redesign the navigation. The plan invents constitutional support for one answer.
- **Change:** Put the navigation composition to a recorded decision and amend the constitution’s count in the same block.

### 7. Two proof keys cannot support the promised “four of eight” state

**Class:** Required-item omission.

- **Plan:** The headline and lede contain the site counts eight, four, and four, but it proposes only `painel_com_limiar` and `painel_fora_do_limiar` ([plan L44](leitura/docs/PLANO-redesenho-v3.txt:44)).
- **Evidence:** House numbers must be calculated at build, marked with a `data-prova` key, and carry a door; they are never written or recomputed casually in a template ([IDENTIDADE L364](leitura/repo/IDENTIDADE.md:364)). Existing proof keys are explicit objects; the current coverage section, for example, has separate total and subset keys ([prova.mjs L390](leitura/repo/src/lib/prova.mjs:390)).
- **Why it matters:** Rendering eight as `4 + 4` in the template creates an unregistered house calculation. Using one of the two keys for eight would be false.
- **Change:** Add `painel_total`, `painel_com_limiar`, and `painel_fora_do_limiar`, each independently recounted by the gate with its own exact door. Plant defects for total membership, threshold membership, and a threshold changing category.

### 8. English is staged too late for R2–R5 to build

**Class:** Staging risk.

- **Plan:** New home and interior strings enter in R2–R5, but all English keys are deferred to R6 ([plan L124](leitura/docs/PLANO-redesenho-v3.txt:124), [L140](leitura/docs/PLANO-redesenho-v3.txt:140)).
- **Evidence:** Every call to `t()` invokes `assertKeyParity()`, which throws when PT and EN key paths differ ([strings.mjs L1448](leitura/repo/src/i18n/strings.mjs:1448)). The handoff explicitly warns that new PT-only keys will fail the build ([handoff L22](leitura/docs/HANDOFF-eleventh-block.md:22)).
- **Why it matters:** Intermediate stages cannot truthfully claim green builds. Also, key parity checks only paths, not whether English is accurate, nonempty, or accidentally copied from Portuguese.
- **Change:** Add PT and considered EN together in every stage. Make R6 a translation and cross-language behaviour audit, not the first point at which English exists.

### 9. R4’s “identical to main” acceptance criterion contradicts its own work

**Class:** Repository-claim contradiction.

- **Plan:** R4 adds the visible `POR CONFIRMAR` watermark and potentially new Método content, then says every page’s text dump is identical to main ([plan L132](leitura/docs/PLANO-redesenho-v3.txt:132)).
- **Evidence:** The watermark is a constitutional requirement when a field is missing ([constitution L64](leitura/docs/Constituicao-visual-v3.1.md:64)). A source-tree search finds no existing `POR CONFIRMAR` string under `repo/src`, so it cannot be text-identical to main. The plan separately proposes a new Método sentence ([plan L154](leitura/docs/PLANO-redesenho-v3.txt:154)).
- **Why it matters:** An impossible exit criterion will either block R4 or force an undocumented allowlist exception.
- **Change:** Say “identical except for this enumerated change set”, then list exact strings, languages, routes, conditions, and expected occurrence counts.

### 10. The correction register’s unsealed values remain outside the plan

**Class:** House-rule violation.

- **Plan:** Correções is described only as changing from oxblood to form; R5 says the seal-per-value defect is “confirmed by the gate” ([plan L134](leitura/docs/PLANO-redesenho-v3.txt:134), [L138](leitura/docs/PLANO-redesenho-v3.txt:138)).
- **Evidence:** `DECISIONS.md` explicitly records that old and new correction values have neither seal nor door and says the rule or interface must change ([DECISIONS L8669](leitura/repo/DECISIONS.md:8669)). The component renders them as `data-correcao-*`, not `data-claim`, and supplies only a later ID link ([RegistoCorrecoes L100](leitura/repo/src/components/RegistoCorrecoes.astro:100)).
- **Why it matters:** The current `data-claim` seal rule cannot prove correction values have an adjacent source door. Restyling them does not close the debt.
- **Change:** Decide the correction-specific provenance form explicitly. Extend the existing `data-correcao` verification so each old/new pair has the required row door or a documented constitutional exception, and prove it with a planted wrong/missing door.

### 11. The source diff is incomplete and its baseline can drift

**Class:** Content-invariance defect.

- **Plan:** It protects only `ledger/`, `studies-src/`, `sobre.mjs`, and `metodo.mjs`, using `git diff main...redesenho-v3` ([plan L94](leitura/docs/PLANO-redesenho-v3.txt:94)).
- **Evidence:** Content also lives in `strings.mjs`, `figuras.mjs`, `studies.mjs`, `municipios.mjs`, agenda/calendar records, verbatim data, and other modules. The decision record itself notes that strings, titles, and descriptions are not covered by the decision tether ([DECISIONS L8681](leitura/repo/DECISIONS.md:8681)). The dump does not cover metadata, attributes, script data, or nonrendered records.
- **Why it matters:** Content can change outside both protections. Triple-dot compares against the merge base, not necessarily the explicitly claimed `71b4c65`; if `main` advances during the estimated two or three sessions, the baseline and promised fast-forward cease to match.
- **Change:** Pin the exact base SHA and compare `<base>..<branch>`. Protect a reviewed manifest of every content-bearing source and public data asset. Define whether `main` is frozen; otherwise add a rebase, rebaseline, and renewed approval procedure.

### 12. Core amended visual rules have no credible acceptance tests

**Class:** Required-item omission.

- **Plan:** Verification covers contrast, 1280/390 overflow, seal target size, and a few semantic gate extensions ([plan L162](leitura/docs/PLANO-redesenho-v3.txt:162)).
- **Evidence:** The binding amendments require formal-threshold-only colour, marker/word/ruler agreement, no nested seal, exact map modes, real map targets, labelled archipelagos, and no bar without a published reference ([constitution L90](leitura/docs/Constituicao-visual-v3.1.md:90)). `IDENTIDADE.md` says layout, layers, and empty states are not visible to the current gates, while `gate:identidade` does not exist ([IDENTIDADE L291](leitura/repo/IDENTIDADE.md:291)). The contrast ruler uses a hand-maintained `PARES` array rather than discovering actual CSS combinations ([medir-contraste L125](leitura/repo/scripts/medir-contraste.mjs:125)) and does not fail the build ([L271](leitura/repo/scripts/medir-contraste.mjs:271)).
- **Why it matters:** A builder can omit an unsafe colour pair from the ruler or render the wrong visual grammar while all named checks pass.
- **Change:** Add explicit acceptance assertions for threshold provenance, state word/marker agreement, no-bar cases, nested targets, map mode, and real targets. Use existing gate extensions where markup can prove them, with plants; add computed-style/browser inspection and a route/state screenshot matrix for the rest.

### 13. The existing defect register is not carried into the redesign baseline

**Class:** Required-item omission.

- **Plan:** Its risk section names only navigation width, Bitter figures, allowlist growth, and session limits ([plan L189](leitura/docs/PLANO-redesenho-v3.txt:189)).
- **Evidence:** Open defects include unsupported homepage prose, indistinguishable accessible seal names, inaccessible JavaScript reading state, written municipal counts, and missing language metadata for source excerpts ([DECISIONS L8507](leitura/repo/DECISIONS.md:8507)). Other open items include the false hosted-document `ledger.json` promise ([DECISIONS L8574](leitura/repo/DECISIONS.md:8574)) and correction values without seals ([L8669](leitura/repo/DECISIONS.md:8669)).
- **Why it matters:** The redesign touches the exact surfaces involved. A visual rewrite can obscure or duplicate these debts while the closing entry suggests the affected pages were comprehensively reviewed.
- **Change:** Create an R0 carry-forward table for every open §4 item, with current status, affected stage, owner, and explicit “preserved”, “fixed”, or “still deferred” exit result.

### 14. Deferring numeric distance means phase 1 does not fully implement the constitution

**Class:** Unsupported conflict resolution.

- **Plan:** Numeric distance is deferred to phase 2 because it lacks derived ledger rows ([plan L34](leitura/docs/PLANO-redesenho-v3.txt:34), [L152](leitura/docs/PLANO-redesenho-v3.txt:152)).
- **Evidence:** The constitution requires distance “in words and number” ([constitution L61](leitura/docs/Constituicao-visual-v3.1.md:61)). Amendment 4 changes the ruler geometry but does not repeal the numeric label ([constitution L95](leitura/docs/Constituicao-visual-v3.1.md:95)). The handoff’s phase 2 scope names catalogue/dossier, not delayed ruler values ([handoff L23](leitura/docs/HANDOFF-eleventh-block.md:23)).
- **Why it matters:** The deferral may be technically prudent, but it is a new scope decision. Calling phase 1 the v3 implementation would overstate completion.
- **Change:** Either cross the required derived rows from the engine before the relevant tiles ship, or record an explicit constitutional deferral and describe phase 1 as a partial implementation.

### 15. The stage ownership and session-cut model are internally inconsistent

**Class:** Staging and scale risk.

- **Plan:** Every stage supposedly has one builder, but R4 assigns two builders to a single 600k stage ([plan L114](leitura/docs/PLANO-redesenho-v3.txt:114), [L132](leitura/docs/PLANO-redesenho-v3.txt:132)). It says a session cut loses only one stage because notes are written “at the end” ([plan L177](leitura/docs/PLANO-redesenho-v3.txt:177)).
- **Evidence:** R4 combines every page family, global styles, shared components, English-sensitive strings, and governance-sensitive pages. The handoff itself records a prior builder being cut off at final check ([handoff L8](leitura/docs/HANDOFF-eleventh-block.md:8)).
- **Why it matters:** Two builders will collide on shared CSS/components, while an end-only note does not exist if the session ends early. R2 is similarly oversized: URL state, search, map, all scopes, densities, studies, agenda, and proof keys.
- **Change:** Split R2 and R4 into dependency-ordered, independently buildable stages with explicit file ownership, integration ownership, per-substage commits, and checkpoint notes before large audits. Use deliverable exit criteria rather than token estimates.

### 16. Functional, accessibility, and input-safety verification is materially incomplete

**Class:** Unnamed risk.

- **Plan:** It tests only desktop overflow, mobile width, and seal tap targets for the new stateful home ([plan L124](leitura/docs/PLANO-redesenho-v3.txt:124), [L128](leitura/docs/PLANO-redesenho-v3.txt:128)).
- **Evidence:** The defect register already identifies a JavaScript instrument whose visual state has no screen-reader equivalent ([DECISIONS L8516](leitura/repo/DECISIONS.md:8516)). The amended design adds more stateful controls and requires real map targets and a non-map mobile alternative ([constitution L94](leitura/docs/Constituicao-visual-v3.1.md:94)).
- **Why it matters:** Nothing tests keyboard order, focus return, accessible state announcements, invalid queries, query preservation across languages, reload/back behaviour, 200–400% zoom, reduced motion, no-JS use, or safe mapping of arbitrary query values to closed slugs.
- **Change:** Add a browser test matrix covering those cases in both languages and themes, at 320, 390, intermediate, and desktop widths. Require query parameters to resolve through closed route data, never into `innerHTML`.

## Medium

### 17. Several “verified ground truth” claims cannot be checked from the supplied files

**Class:** Repository-claim evidence gap.

- **Plan:** It claims a precise deployed SHA, local green build, saved ruler outputs, upstream font/licence facts, and repository ancestry ([plan L13](leitura/docs/PLANO-redesenho-v3.txt:13)).
- **Evidence:** The supplied `repo/` contains no `.git`, `node_modules`, or `dist`, so those claims cannot be reproduced here. The repository’s own state note names `9b9f477`, not `71b4c65`, as main at its recorded time ([state note L9](leitura/repo/design/especime-v3/ESTADO-DO-MAIN-2026-08-20.md:9)); main could have advanced later, so this is divergence, not proof that the plan is false. The font-ground-truth paragraph supplies no Bitter source, although R1 requires it ([plan L22](leitura/docs/PLANO-redesenho-v3.txt:22), [L122](leitura/docs/PLANO-redesenho-v3.txt:122)).
- **Why it matters:** These facts may be true, but this evidence package cannot establish them, and the user explicitly prohibited network verification.
- **Change:** Mark them `[verify]` in the reviewed plan unless the revised package includes Git metadata, build/ruler records with digests, and pinned local licence/source records for all three font families, including Bitter.

### 18. “Publication date” in the studies block is unsafe as written

**Class:** Required-item omission.

- **Plan:** The home studies block will show “the publication date” ([plan L64](leitura/docs/PLANO-redesenho-v3.txt:64)).
- **Evidence:** `studies.mjs` says publication dates are generally unconfirmed and must remain `[a verificar]`; `updated` must not be substituted ([studies.mjs L13](leitura/repo/src/data/studies.mjs:13)). Many editions have `date: null` ([studies.mjs L60](leitura/repo/src/data/studies.mjs:60)).
- **Why it matters:** A builder may accidentally display the republishing/update date as publication date or invent a plausible value.
- **Change:** Specify `edition.date ?? [a verificar]`, sourced directly from the archive record, never from `updated`, Git, the manifest, or filesystem timestamps. Plant a null-date case.

### 19. “The row’s note as the door” is a category error

**Class:** Required-item omission.

- **Plan:** For the provisional `82 p`, it proposes “the row’s note as the door” ([plan L60](leitura/docs/PLANO-redesenho-v3.txt:60)).
- **Evidence:** The ledger has separate `source_flag`, Portuguese note, and English note fields ([ledger row L21](leitura/repo/ledger/claims/pib-pc-portugal-2024.yml:21)). The row page renders the note as a field; that field is not itself a link. The house rule already says a source-marked provisional value must be stated in words ([metodo.mjs L262](leitura/repo/src/data/metodo.mjs:262)).
- **Why it matters:** A note is evidence content, not a door. “Wherever rendered” also lacks an inventory, so one occurrence can remain falsely final.
- **Change:** Keep the value’s seal as the door to its row, where the note is displayed. Inventory every rendering of that claim and extend the existing row/string check to verify the exact source flag and localized provisional wording at each required surface.

### 20. `por ler` is translated without being reconciled with the closed state vocabulary

**Class:** Unsupported conflict resolution.

- **Plan:** R6 chooses “not yet read” for `por ler` without defining its state semantics ([plan L142](leitura/docs/PLANO-redesenho-v3.txt:142)).
- **Evidence:** The constitution calls its state vocabulary closed and lists `por confirmar`, not `por ler` ([constitution L49](leitura/docs/Constituicao-visual-v3.1.md:49)). The handoff does require a considered translation for `por ler` ([handoff L22](leitura/docs/HANDOFF-eleventh-block.md:22)), while the adopted critique warns against making unread municipal coverage look like six unconfirmed measurements ([critique L15](leitura/repo/design/especime-v3/critica/codex-critica.md:15)).
- **Why it matters:** “Not read by this site” and “source/value unconfirmed” are materially different claims. Treating both as one visual state misstates provenance; adding a fifth state silently violates the closed vocabulary.
- **Change:** Decide whether `por ler` is an editorial coverage label outside the measurement-state system or a fifth governed state. Define its form, permissible contexts, PT/EN wording, and relationship to `[a verificar]`; amend the constitution if it is a state.

I would **not approve the plan as written**. This is not a matter of polishing estimates or adding a few tests: the content-invariance design can certify contextually wrong pages, the supposed ruler violates the gate moratorium, and the governance and bilingual staging cannot work in the stated order. I would ask for a revised plan that closes the four critical findings, resolves the navigation, Método, distance, and `por ler` decisions explicitly, carries forward the open defect register, and replaces token-sized stages with independently buildable acceptance units. No files were edited.

---

## O prompt, verbatim

```
You are reviewing an implementation plan for the redesign of a bilingual statistical website, before any implementation starts. You have no other context and should not assume any. Work only from the files in this directory. There is no network.

Files: docs/PLANO-redesenho-v3.txt (the plan under review, text extracted from its published page); docs/HANDOFF-eleventh-block.md (the design handoff the plan claims to reconcile: ten numbered points and, above them, a critique entry with eight site defects); docs/Constituicao-visual-v3.1.md (the visual constitution the plan must implement, whose «Emendas · 2026-08-20» take precedence over everything older); repo/ (the site's repository as it stands, without node_modules and build output: src/ is the Astro site, scripts/ are the gates and rulers, ledger/claims/ the evidence rows, IDENTIDADE.md the current design constitution, DECISIONS.md the decision record, PLANO-fases.md the roadmap, design/especime-v3/ the design session's boards and its state note ESTADO-DO-MAIN-2026-08-20.md).

Your task is adversarial: try to find where the plan is wrong, under-specified or unsafe. In particular: (1) claims the plan makes about the repository that the files contradict (check them: does the sentence exist, does the key exist, does the script do what the plan says); (2) violations of the house's own rules as written in PLANO-fases.md «The rules that govern every block», IDENTIDADE.md §8 and DECISIONS.md (no new gate, only extensions proven on planted defects; state rendered never written; governed texts change only through a decision entry; every number with a ledger row; seal per value); (3) places where the plan resolves a conflict between the handoff and the repository in a way the handoff or the constitution does not support; (4) anything the constitution or the handoff requires that the plan omits; (5) the content-invariance method (the dump ruler and its allowlist): can it be fooled, what does it not cover; (6) the staging and scale: what is missing from the stages, what is optimistic, what would a session cut break; (7) risks the plan does not name. For each finding: where in the plan, what it says, what the evidence says (file and line), why it matters, and what you would change. Rank by severity. Also say, in one paragraph at the end, whether you would approve the plan as written, with amendments, or not, and why. Do not edit any file. If something cannot be checked from the files given, say so rather than guessing. Report in Markdown in English, beginning with a one-paragraph summary and a count of findings by class.
```
