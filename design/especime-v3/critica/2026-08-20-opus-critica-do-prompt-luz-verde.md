# Crítica do prompt «luz verde» (Opus), 2026-08-20

*Corrida pelo lugar de direção da sessão de 20.08 a pedido da direção: um agente `claude-opus-5` com os mesmos sete ficheiros, sem rede, sem edições. Cerca de 98 000 tokens como reporta. Veredicto: não conduz a uma construção segura como está; a sua reescrita é a base do prompt revisto `../PROMPT-luz-verde-2026-08-20.md`. Relatório verbatim.*

---

I read the seven files in the order given. No files were edited, no network used.

---

# Verdict

**As written, this prompt does not lead to a safe build.** It is not slow, it is under-specified in exactly the places where the last plan already failed. Two of its instructions are actively dangerous: handoff point 5 tells the session to build the map posture the director overruled this afternoon, and "PROCEED with phase 1 without waiting" sends a session to build a plan that has never seen the 20 findings that killed the first one, four of them structural and none resolved in any document the prompt asks it to read.

The fix is not a plan gate. It is to move the already-made decisions into the prompt so the plan cannot be written wrong, and keep exactly two waits: four named decisions, and one protected preview after the home. That preserves "no waiting where waiting buys nothing" and removes the rebuild risk.

---

# Findings, ranked

## CRITICAL

### 1. The prompt orders the map posture the director overruled today

**Prompt says:** read the handoff "points 1 to 10, including 9a and 10a" (L3-4) and implement per them; the Emendas "override the older boards AND the site's current identity rules where they conflict" (L7-8). The handoff's own points are not named in that precedence clause.

**Evidence:** HANDOFF point 5 (L22): "**Map:** stamp on the home (País); full ■/□ picker only in concelho choice ... mobile = sentence + search." Constitution Emenda 3 (L78): "o mapa RESPIRA (A2b), mapa inteiro com a sua ficha no âmbito País e na escolha de concelho ... corrigido 2026-08-20 pelo diretor". HANDOFF L16 records why: "the seat had swapped this to a stamp posture during critique adoption without a mandate, Nuno caught it against his explicit A2 choice and it was restored". Emenda 3 also carries this afternoon's neutrality clause: "nenhum município é destacado por estatuto, nem capital do país, nem capitais de distrito ou região", with the legend "o ponto aceso marca cobertura editorial, não qualidade nem importância", and the mobile clause (a ~140px coverage stamp whose whole area is the target, a proximity list on tap, search as the main path), which is not "sentence + search" either.

**Why it matters:** The handoff's numbered list was never updated after the correction. A literal reading of point 5 rebuilds the head of the home in the rejected posture. The home is the most expensive block in the phase. Worse, it is unknown from these files whether the published V3Completo prototype on canvas v27 was rebuilt after the correction or only the constitution note was: HANDOFF L16 says "Emenda 3 corrected in the constitution note", not that the board was regenerated. So the prompt points the session at a prototype that may itself carry the overruled posture, and tells it to implement the prototype (handoff point 1).

**Exact wording to add:**
> Precedence, highest first: the Emendas of 2026-08-20; the rest of the constitution v3.1; the state note for anything about what the repo is today; the handoff's numbered points; `IDENTIDADE.md` v2; the canvas boards. Boards never win. The Emendas beat the handoff's own points: point 5 says the map is a stamp on the home, and that is the posture I overruled this afternoon. The rule is Emenda 3, the map breathes: full map with its ficha in País scope and in concelho choice, contracting to the locator card when a concelho is chosen and the reading deepens; no município highlighted by status, not the capital, not district or region capitals, all 308 points equal, the only distinction ■/□ coverage, with the legend beside the map; on mobile the map is not a point selector. If the board on the canvas shows the stamp posture, say so in your first message and build the Emenda, not the board.

### 2. The cross-family critique of the first plan never reaches the session, and the prompt tells it to proceed anyway

**Prompt says:** the reading list is the handoff, the constitution, the canvas (L3-13), then "state your implementation plan and order in ONE message ... and PROCEED with phase 1 without waiting" (L15-16). The "cross-family critique entry above it (eight site defects)" in item 1 is the critique of the *prototype*, not of the plan.

**Evidence:** CRITICA-do-primeiro-plano.md, verdict line: "não aprovar como está; rever", and the closing paragraph: "I would **not approve the plan as written**. This is not a matter of polishing estimates ... the content-invariance design can certify contextually wrong pages, the supposed ruler violates the gate moratorium, and the governance and bilingual staging cannot work in the stated order." The header notes the seat's answers "seguem na mensagem que ela dá à sessão do redesenho". This prompt is that message and it carries none of them. Roadmap rule 1 (PLANO-fases L25) also binds: a block does not start while the previous block's found defects are neither fixed nor deferred in writing.

**Why it matters:** All four critical findings are architectural, not polish: whether the invariance check is a gate (finding 1), whether runtime state can escape the gates (2), how relocation is authorised (3), and whether decision entries precede governed changes (4). A session that writes plan v2 blind will make the same four choices, because they are the obvious choices. That is the rebuilt block the owner says he will not pay for.

**Exact wording to add:** put the critique in the reading list, and put the four answers in the prompt as non-negotiable, so nothing waits:
> Read the Codex critique of the first plan (20 findings, 4 critical, "do not approve as written"). My answers to its four critical findings are below and they are not open:
> 1. The content-invariance comparison is an advisor. It prints, it never fails a build, it lives outside `npm run build` like `medir-defeitos.mjs`. Anything that must be enforced becomes an extension of `gate:html`, `ledger:check` or `check:dados`, each proven on a planted defect. A check that must pass before a merge is a gate whatever you call it.
> 2. Text and numbers move only by an authorised relocation, written down before the move: source route, destination route, component, scope, language, occurrence count. The visible scope label and the value move as one unit. There is no "it existed somewhere on the old site" exception. This is the scope-bleed defect, and it is the one that can put an Évora number under Beja.
> 3. Runtime code selects prevalidated strings and never formats a figure. Declare the closed URL state schema (scope, density, edition), resolve every query value through closed route data, never into `innerHTML`, keep a correct server-rendered default that works with JavaScript off. The dump reads text nodes and cannot see scripts or attributes, so dump the rendered DOM for a state matrix, not just the source HTML.
> 4. Every governed change lands in the same commit as its decision entry, with `Afecta:` and the digest, per §1.38. No governed byte changes before I have approved the exact sentence.

### 3. "Reconciled with your current Block T state" points at a state two blocks old, and the note written for this session is not in the reading list

**Prompt says:** "reconciled with your current Block T state and the existing gates" (L15-16).

**Evidence:** Block T merged the night of 18.08 (`28709e1`, PLANO-fases L7, L13, L118). Two more blocks landed on 20.08: `ad86efc` (§1.48) and `510dda0` (§1.49); main = origin/main = live = **`9b9f477`**, `verify:deploy` ✓ at 14:07 UTC (ESTADO-DO-MAIN L11-15). ESTADO-DO-MAIN.md exists precisely for this: "para que a sessão que vai planear o redesenho leia factos verificados nesse dia e não reconstrua o estado do sítio a partir do handoff, que foi escrito para um `main` que já não existe" (L3-7). Its §2 lists six things the handoff does not know: the row page now has «Esta linha em JSON» on all 264 row pages and the Internet Archive door in the five PRR rows, and "a maqueta «Linha» não tem nenhuma destas portas" (L34-38); the ledger index offers CSV and JSON under CC BY 4.0 with the scope sentence, "a maqueta do livro-razão não o tem" (L39-42); Método changed three sentences on 20.08 and "a maqueta «Método» foi construída com o texto de 18.08" (L43-51); «organismos citados» is 13, not 14 (L52); PRR is on the 2026-08-19 snapshot (L54); the engine has a serial INE client and per-row vintage exists in the engine and not on the page (L56-58). Its §5 lists seven things the constitution does not cover at all. On the base SHA: CRITICA finding 11 and 17, "Pin the exact base SHA and compare `<base>..<branch>` ... Define whether `main` is frozen; otherwise add a rebase, rebaseline, and renewed approval procedure". Main is not frozen: weekly panel refresh (PLANO-fases L105), monthly sweep and the monthly PRR re-extraction (L112).

**Why it matters:** "Your current Block T state" invites the session to reconcile against a snapshot that predates every door, licence block and Método sentence the redesign has to carry. Every one of those is a mock-up-versus-repo conflict that will otherwise be discovered mid-build, in the most expensive place.

**Exact wording to change:** replace L15's parenthesis with:
> reconciled item by item against `design/especime-v3/ESTADO-DO-MAIN-2026-08-20.md`: its §2 (the six things the handoff does not know) and its §5 (the seven things the constitution does not cover), each with implement, flag, or ask beside it. Read the gate scripts themselves, not their names. Pin the base SHA you branch from with `git rev-parse origin/main` and write it in the plan; if it is not `9b9f477`, say what moved. Main is not frozen: rebase at every stage boundary, re-run the rulers, and report in the milestone note if a rebase moved a value or a count.

### 4. Share cards: numbers rendered into images are invisible to every check the site has, and the prompt gives them one word

**Prompt says:** phase 1 is "home desktop + mobile, interior pages under the Emendas, the eight defects, share cards" (L17-18). Nothing else.

**Evidence:** HANDOFF 9a (L27): "Cards are generated at build time from ledger rows, same gate as any page: no number on a card without its row. Values on cards age with the site, never independently." But the gates read HTML: `gate:html` covers "todo o algarismo das páginas com proveniência; `data-claim` comparado como cadeia; selo em todo o valor e a apontar para a sua linha" (ESTADO-DO-MAIN L69-74). CRITICA finding 2 cites the site's own Método admitting numbers in scripts or attributes pass the sweep (`metodo.mjs` L232). A PNG is neither. Roadmap rule 2 (PLANO-fases L26): "Every check is proven on a planted defect before it counts." IDENTIDADE §10: house numbers "Nunca são escritos".

**Why it matters:** 9a's own justification is that the card is the first contact for most visitors. It is therefore the one surface where "every number has a row" is both most public and least enforceable. A card is also the easiest place to end up with a stale number, because it is generated once and looks finished.

**Exact wording to add:**
> Share cards, and this is the condition for them counting as done: the card renders from ledger rows through the same component path the page uses, never a second formatting path, never a hand-written string, never `og:` metadata typed by hand. The build writes one machine-readable record per card (route, each value, its row id, unit, period, the row's digest), and an extension of the existing checks re-derives every value from `ledger/claims/` and compares it as a string by the same rule as `data-claim`, unit symbol outside the element included. Prove it with two plants, a wrong number and a value that is stale against its row, and show the build refusing both. Cards are build artefacts, regenerated at every build and never committed, because a committed card is written state. The state is written in words on the card as well as shown in the strip, no map dots, no colour outside the state pair, and a card carries no value its own page does not carry.

### 5. English is written as a work item to be "shown before they ship", when the build throws without it

**Prompt says:** "The EN strings for all new v3 copy are a work item (point 9): draft them, but show me the full PT→EN list for voice review before they ship" (L34-35).

**Evidence:** HANDOFF point 9 (L26): "`assertKeyParity()` will fail the build until the EN set is written." ESTADO-DO-MAIN L84-88: "`assertKeyParity()` falha o build se as chaves não forem as mesmas: **todo o texto novo do v3 entra nas duas línguas ou não entra**", plus "O vocabulário de estado (fora do limiar / dentro do limiar / sem limiar / por ler) pede uma tradução pensada uma vez." CRITICA finding 8: every call to `t()` invokes `assertKeyParity()`; "Add PT and considered EN together in every stage."

**Why it matters:** "Before they ship" reads as "at the end". A stage that defers EN cannot build at all, so the session will either stall or invent throwaway English to get green, which is the worst of both: the parity check only compares key paths, not whether the English is accurate or accidentally Portuguese, so the placeholder survives into the voice review as a fait accompli.

**Exact wording to change:**
> Every stage adds PT and EN keys in the same commit. `assertKeyParity()` throws at every build, so a stage that is green only because English is missing is not green and you may not report it as green. Decide the state vocabulary once, before the first stage that renders it, and send me those words alone first: fora do limiar, dentro do limiar, sem limiar, por confirmar, plus the coverage words. The full PT to EN list still comes to me for voice review before merge; voice review is not what unblocks the build, and a word I change later is one string, not a stage.

---

## HIGH

### 6. Governed text: two Método lines, not one, and no §1.38 path in the prompt

**Prompt says:** nothing about governed text, `DECISIONS.md`, the tether, or `IDENTIDADE.md` changing. The word "Método" does not appear.

**Evidence:** HANDOFF L16 and point 7 (L24): "the one-line Método change for yellow/oxblood" is open at implementation. Constitution §2 L27 also requires a type line: "o Método passa a dizer, numa linha, de onde vem a letra", while Emenda 5 (L80) forbids the obvious content of that line: "O Método não reclama a linhagem Gini 1938." So there are two lines. ESTADO-DO-MAIN L48-51: the yellow change "é texto governado, e segue o caminho da §1.38 (entrada com `Afecta: metodo`, resumo, leitura da direção na pré-visualização)". IDENTIDADE §2 currently writes the opposite meanings ("Amarelo, marca de medição ... Oxblood, erro admitido. O registo de correções, e mais nada"), and §1 line 38 carries "Sem tipos de rede", which handoff point 2 amends. The tether: `ledger:check` requires every entry from §1.38 to declare `Afecta:` and the last entry governing a text to carry its digest, and reads `IDENTIDADE.md` requiring every quotation of a governed text to exist word for word (ESTADO-DO-MAIN L62-66; IDENTIDADE §8). CRITICA finding 5: the first plan tried to cancel the adopted Método change; "the absence of an old sentence disproves the handoff's premise, not the adopted decision".

**Why it matters:** Without this, the session either edits Método unilaterally (a governed text changed without a decision, which the tether will catch late or not at all) or drops the adopted change (the first plan's error). And IDENTIDADE §5 quotes Método's rule 5 word for word: any governed sentence that moves without its quotation moving in the same commit stops the build.

**Exact wording to add:**
> There are two Método lines in this block, not one: the colour line (yellow becomes warning, oxblood retired) and the type line (where the letter comes from, and per Emenda 5 it does not claim the Gini 1938 lineage). Both are governed text: draft the exact sentence in both editions, send it to me, change the byte only after I say yes, with the `DECISIONS.md` entry carrying `Afecta: metodo` in the same commit. `IDENTIDADE.md` §1 (sem tipos de rede) and §2 (what the yellow and the oxblood mean) change in this block too, with their own entry, before the first stage that depends on them. Every sentence `IDENTIDADE.md` quotes from Método or Sobre is compared word for word by `ledger:check`: move a governed sentence and fix its quotation in the same commit, or the build stops.

### 7. The dashed square now carries four meanings, and the v3 material widens the very defect it is meant to close

**Prompt says:** fix "the eight defects" (L18), one of which is three phrasings for municipal coverage.

**Evidence:** Constitution §3 L37: "**Por confirmar** · sem cor; a forma muda: quadrado tracejado, marcador «[a verificar]»". IDENTIDADE §5.2: filled square when provenance is complete, dashed when a field is missing. Emenda 3 L78: ■/□ as the coverage marker, «tem página» / «sem página ainda». HANDOFF L15: the home head is "headline sentence + fila de estados (state squares; **dashed = por ler**)" and the municipal empty state is "«0 linhas · ainda»". Defect 7 of the eight: "Três formulações para a cobertura municipal" (ESTADO-DO-MAIN L100). CRITICA finding 20: "'Not read by this site' and 'source/value unconfirmed' are materially different claims. Treating both as one visual state misstates provenance; adding a fifth state silently violates the closed vocabulary." IDENTIDADE §6: one marker, one class, one page, "uma segunda formulação para a mesma coisa é uma segunda língua".

**Why it matters:** At 12px, dashed square means incomplete provenance, unconfirmed value, and not-read-yet, while the empty square means no page yet. The reader cannot tell "we have not looked" from "the source is not confirmed". Shipping the home in this state closes zero of defect 7 and adds a fourth phrasing.

**Exact wording to add (also on the stop-and-ask list):**
> Before the home ships, one glyph means one thing. Tell me whether «por ler» is a fifth measurement state or an editorial coverage label outside the closed vocabulary (my read is the second: "this site has not read it" is not "the source is unconfirmed"), and then give coverage one vocabulary in both editions, replacing «0 linhas · ainda», «sem página ainda» and «por ler» with whatever survives. Defect 7 counts as closed when the ruler's count of distinct coverage phrasings is one, measured, not asserted.

### 8. The stop-and-ask list: one undefined term, one licence to deviate, one mislabelled gate, no rule for what to do while waiting, and four missing decisions

**Prompt says:** five bullets (L22-32), including "fixing a defect requires an editorial call (e.g. the Eurostat «82 p» provisional flag, fix early, and flag anything similar)" (L28-29) and "a constitution rule can't be met as specified, implement the closest honest version, measure it, and report the deviation" (L31-32).

**Evidence and problems, one by one:**
- *"Editorial call" is never defined*, and the example given contradicts the instruction in the same sentence: stop and ask, then "fix early". The Eurostat case is not purely editorial: the row already carries `source_flag: "p"`, the excerpt and the Eurostat note since 13.08; "O que falta é **como a primeira página mostra o sinal**" (ESTADO-DO-MAIN L94). CRITICA finding 19 shows the first plan answering with a category error ("the row's note as the door"; a note is evidence content, not a door).
- *Bullet 5 licenses unilateral deviation from a binding constitution and reports after the fact.* That is the pattern that produced CRITICA finding 14 (numeric distance dropped from the ruler, which constitution §4 L45 requires "escrita em palavras e número" and Emenda 4 does not repeal) and finding 6 (the invented "constitution writes eight" for the navigation).
- *Bullet 4 says stop if you need a new gate, but never says what makes a check a gate.* That is exactly the trap: the first plan built a release-blocking check and called it a ruler.
- *Bullet 1 calls the corrections door count a gate.* It is a ruler measure, outside the build: `scripts/medir-defeitos.mjs`, "porta de correções 307/307", listed under "Fora do build" (ESTADO-DO-MAIN L76-79). `gate:html` checks that internal doors resolve. Teaching the session that a ruler is a gate invites the reverse error.
- *No rule for what to do while waiting.* ESTADO-DO-MAIN §5 guarantees at least seven conflicts on day one, so the session hits bullet 1 immediately, with "PROCEED without waiting" as its only other instruction.
- *Four decisions are missing from the list.* Navigation: constitution §4 L44 says "sete itens"; the current masthead has seven and Correções is absent (ESTADO-DO-MAIN L95); adding it makes eight and no amendment changes the count (CRITICA finding 6). Correction values: `DECISIONS.md` §4 records that old and new correction values have neither seal nor door, and restyling from oxblood to form does not close it (CRITICA finding 10). Numeric distance on the ruler: defer it and phase 1 is a partial implementation and must say so (finding 14). The Eurostat front-page form, in words, before anything is built.

**Exact wording to add:**
> An editorial call is anything that changes what the site says rather than how it looks: the wording of any public sentence in either edition; the wording or the form of a state, a marker or an empty state; which measures the home carries and in what order; what the navigation contains; whether a value is shown as provisional, final or withheld; anything governed by §1.38. Type, spacing, grid, weight, scale and motion are yours.
> While you wait on an answer, park the item. Do not build the workaround, and keep building only what my answer cannot change. Say in the same message what is parked and what you are proceeding with.
> A constitution rule that cannot be met as specified: if it governs what the reader is told (state vocabulary, colour meaning, seal, marker, distance in words and number, map neutrality), stop and ask before implementing a substitute. If it governs form only, implement the closest honest version, measure it, and put the deviation in the plan file and in that milestone's report, not at the end.
> Decide with me before the stage that needs them: whether Correções makes the masthead an eight-item navigation with §4's count amended in the same block, or replaces one; what provenance form the correction register's old and new values get; whether phase 1 ships the ruler without the numeric distance and is therefore described as partial; the front-page form for the Eurostat provisional flag, in words, plus an inventory of every surface where that claim renders.

### 9. "Phase 2 stays parked" and "implement the v3 prototype" contradict each other on the home

**Prompt says:** "PROCEED with phase 1 ... Phase 2 (catálogo/dossiê) stays parked" (L16-18).

**Evidence:** HANDOFF point 1 (L18) says implement the home per `V3Completo.dc.html`, and that prototype's home contains "um **catálogo de medidas** (22 verified measures in three groups; add/remove into a composed panel...)" (L15), renamed dossiê do leitor. Emenda 8 (L83) gives the dossiê its own address and provenance line; handoff point 7 (L24) leaves those URLs open at implementation time; 10a (L28) says the home is a hub of one-line doors with real counts.

**Why it matters:** The session must either build the dossiê (blowing the park), put a door to an address that does not exist, or silently remove an approved block from the approved home. All three are improvisation on the most visible page.

**Exact wording to add:**
> Phase 2 stays parked, and on the home that means the catálogo and dossiê block does not ship: no block, no placeholder, no door to an address that does not exist yet. Record it in the plan as a named deviation from the approved prototype, so that nobody later reads the built home as the whole design.

### 10. No stage sizing, no file ownership, no checkpoint notes, and the plan lives only in a chat message

**Prompt says:** "state your implementation plan and order in ONE message" (L15).

**Evidence:** CRITICA finding 15: the first plan gave two builders one 600k stage, and claimed a session cut costs one stage because notes are written "at the end"; HANDOFF L12 records a builder "cut off by the account session limit at its final check". The critique's fix: "dependency-ordered, independently buildable stages with explicit file ownership, integration ownership, per-substage commits, and checkpoint notes before large audits. Use deliverable exit criteria rather than token estimates."

**Why it matters:** A plan that exists only in chat cannot be diffed, cross-reviewed, or inherited by the next session, and it dies with this one. The carry-forward table, the relocation register and the EN key plan do not fit in one message anyway.

**Exact wording to add:**
> The plan lives in the repo as `design/especime-v3/PLANO-redesenho-v3.md`, committed at stage 0; the one-message summary in chat is the summary, not the plan. One builder owns one stage; the file list it owns is written before it starts; shared CSS and shared components have one owner for the whole phase. Commit at every substage and write the stage note at the checkpoint, before the audit, so a session cut costs one substage and not one stage. Exit criteria are deliverables, not token counts.

### 11. No intermediate preview, and the merge path is not named

**Prompt says:** "Work on a branch; no deploy and nothing outward without my explicit go" (L20).

**Evidence:** PLANO-fases rule 3 (L27): "Everything public goes through: build green, cross-family review (Codex, canaried where the artifact is prose), preview, the director's word, merge, `verify:deploy`." Every recent block did it: Block T with 93 planted defects (L17), the design block with two context-starved auditors (HANDOFF L15), the 20.08 blocks with seven of seven and five of five plants caught (ESTADO-DO-MAIN L11-15).

**Why it matters:** "Nothing outward" covers deployment, not verification. Without naming the canaried cross-family read, the session can arrive at the end of the phase with a green build and no independent reading. And with no preview before the interior pages, the first time the colour, the type and the two densities are seen running is after ten pages have been built on them.

**Exact wording to add:**
> The path out is the standing one, no exceptions: build green, cross-family read by another family with planted defects, protected preview, my word, merge, `verify:deploy`. Two previews, not one. The first goes up after the home, desktop and mobile, and before the interior pages, and I read it. That is the one wait that saves money: I am not paying to rebuild ten interiors under a direction I have not seen running.

### 12. The open defect register is not carried forward, and roadmap rule 1 requires it

**Prompt says:** nothing about `DECISIONS.md` §4.

**Evidence:** PLANO-fases rule 1 (L25): "A block does not start while the previous block's found defects are neither fixed nor deferred in writing (`DECISIONS.md` §4)." CRITICA finding 13 names what is open: unsupported homepage prose, indistinguishable accessible seal names, inaccessible JavaScript reading state, written municipal counts, missing language metadata for source excerpts, the false hosted-document `ledger.json` promise, correction values with no seal. ESTADO-DO-MAIN L100 confirms the written municipal counts as §4.1.

**Why it matters:** The redesign rewrites exactly those surfaces. A visual rewrite can bury a debt while the closing entry reads as if the page was comprehensively reviewed.

**Exact wording to add:**
> Stage 0 produces a carry-forward table of every open item in `DECISIONS.md` §4, each with the stage that touches it and one of: preserved, fixed here, still deferred and why. A visual rewrite that quietly buries one of these is worse than the defect.

### 13. The stateful home has no functional, accessibility or no-JavaScript acceptance list

**Prompt says:** nothing. Report contents are "what shipped, screenshots, gates status, ISSUES" (L37-38).

**Evidence:** CRITICA finding 16: nothing in the first plan tested "keyboard order, focus return, accessible state announcements, invalid queries, query preservation across languages, reload/back behaviour, 200 to 400% zoom, reduced motion, no-JS use, or safe mapping of arbitrary query values to closed slugs", while the defect register already carries a JavaScript instrument whose visual state has no screen-reader equivalent. The v3 home adds scope, density, a URL-encoded default (Emenda 7 L82), search over 308 CAOP names, a picker map and a proximity list (Emenda 3 L78). IDENTIDADE §5.4 requires the seal to be a real tap target; handoff point 4 (L21) says the seal is never nested.

**Exact wording to add:**
> The home is stateful, so it gets an acceptance matrix, run and reported: keyboard order and focus return, state announced and not only shown, both editions, both themes, 320 / 390 / intermediate / 1280, reduced motion, back and forward, reload, language switch preserving scope and density, invalid and unknown query values, and the no-JavaScript default rendering something correct. The seal is its row's largest tap target, at least 44px, never nested.

---

## MEDIUM

### 14. Three interior pages have no v3 board at all, and the prompt implies they do

**Prompt says:** "interior pages under the Emendas" and "Page «Páginas» = interior pages" (L12-13, L18).

**Evidence:** ESTADO-DO-MAIN §5 (L111-113): "A **página das correções**, o **arquivo dos estudos** e a **página do documento alojado** (bytes exatos, sem a folha do sítio) fora das maquetas v3." Also outside them: the row page's 20.08 doors, the ledger index dataset block, per-row vintage and the `archived` field, the footer (nav only, decided 15.08) and the masthead time line. IDENTIDADE §3: "Um tipo de página novo escolhe **uma destas três**. Não inventa a quarta."

**Exact wording to add:**
> For pages with no v3 board (correções, arquivo dos estudos, documento alojado) the rule is the Emendas plus `IDENTIDADE.md` §3: choose one of the three existing dispositions, do not invent a fourth, and the hosted-document page keeps exact bytes with no site stylesheet. Where the row page and the ledger index have doors the boards do not show (JSON per row, the archived copy inside «Calculado sobre», the dataset block and its licence), the repo wins over the board. Where per-row vintage and `archived` should appear, if at all, is an ask.

### 15. Self-hosted fonts change the constitution and may be blocked by the deployed CSP

**Prompt says:** nothing about fonts, though handoff point 2 (L19) is a constitution change.

**Evidence:** ESTADO-DO-MAIN L116-119: the rule "Sem tipos de rede" (`IDENTIDADE.md` §1, line 38) "é mudança da constituição e da folha, com a política de segurança de conteúdo do `vercel.json` **[a verificar]**". Handoff point 2 requires self-hosting Spectral, Spectral SC and Bitter, with Bitter `tnum` verified real (HANDOFF L15).

**Why it matters:** This is the binding constraint that must be checked before the type work, not after: a CSP that forbids the font source turns the whole identity into a fallback stack on the live site, discovered at preview.

**Exact wording to add:**
> Before you wire any font: read `vercel.json`'s content security policy and confirm self-hosted faces load under it, and amend `IDENTIDADE.md` §1 from "sem tipos de rede" to "self-hosted only, no third-party font hosts" with its decision entry. Report the `tnum` check on the built page, not on a board.

### 16. Contrast and dark mode are unmeasured for the new palette, and the ruler does not fail the build

**Evidence:** Constitution §3 L31: dark mode "existe (regra do sítio), com os mesmos tokens invertidos e medidos AA". The new palette (paper `#F6F7F4`, ink `#17191B`, three greys, amber `#E0A21A`, ochre `#7A5300`, cobalt `#1F4E8C`) has no dark counterpart in any file read here. Emenda 1 (L76): amber on paper measured 2.09:1, which is why the marker gets an ink contour. CRITICA finding 12: `medir-contraste.mjs` uses a hand-maintained `PARES` array rather than discovering real CSS combinations, and does not fail the build.

**Exact wording to add:**
> Every new pair goes into `medir-contraste.mjs`'s pairs, in light and in dark, and the measurements go in the milestone report. A pair that is not in the array is a pair nobody measured. If the boards carry no dark palette, that is an ask, not an invention.

### 17. Smaller holes that still cause improvisation

- **"Milestone" is undefined** (L37). Tie it to the stages the plan names.
- **No model routing line.** PLANO-fases L3 is the house rule (Opus builds, Sonnet mechanical passes and blind fetches, Codex reviews across families). Add: "say which model ran which part in every report."
- **No scale ceiling.** Block T was estimated 800k to 1.2M; phase 1 is a bigger surface. Add: "state a rough scale per stage, and stop and tell me if a stage passes its estimate by half."
- **Canvas version mismatch.** The prompt cites v27 (L9); the handoff's closing label is "v21-adopt-all-fase-fechada" (L16). Add: "work from the local boards in `design/especime-v3/maquetas/` so you can read and diff them; say which boards you read and their labels."
- **The eight defects are already graded.** ESTADO-DO-MAIN §4 gives each one its state on today's main with the file it was verified in; point the session there so it does not re-diagnose.
- **Two constitution rules cannot be met in phase 1.** §5 L55 caps frame phrases at "≤ 12 distintas no sítio inteiro"; the ruler measures 77 distinct today (ESTADO-DO-MAIN L78). HANDOFF L31 records that "the mock-ups reuse front-page qualifying phrases that the defect register lists as claims without a door". Both must be flagged in the plan, not silently carried.
- **Engine repo.** The design session touched neither repo (HANDOFF L7). Say: site repo only; anything needing the engine is an ask.

---

# Rewritten prompt

Two things before you send it: fill in the real path of the Codex critique file where marked, and check the four "decide with me" items, since I wrote them as questions to you rather than answering them for you.

```
Green light to build the redesign, phase 1, on the branch `redesenho-v3`. Site
repo only: anything that needs the engine is an ask, not a task. Nothing outward,
no deploy, no publishing to the canvas, without my explicit go.

READ FIRST, IN THIS ORDER

1. `design/especime-v3/ESTADO-DO-MAIN-2026-08-20.md`: what main actually is
   today. The handoff was written for a main that no longer exists.
2. `PLANO-fases.md`, «The rules that govern every block», and `DECISIONS.md` §4.
   Rule 1 binds this block.
3. The vault, `Experiments/O Estado do País.md`, eleventh block «HANDOFF FOR
   BLOCK T» (points 1 to 10, plus 9a share card and 10a scroll discipline), and
   the critique entry above it with the eight site defects.
4. `Experiments/O Estado do País, Constituição visual v3.1`, including «Emendas ·
   2026-08-20». Binding.
5. The cross-family critique of the first plan: [PATH]. Codex, xhigh, 20
   findings, 4 critical, verdict «do not approve as written». My answers to its
   four critical findings are below, and they are not open.
6. The canvas, latest published: [URL]. Page «v3» is the desktop prototype, the
   mobile 390 and the share-card reference; page «Páginas» is the interior pages.
   Work from the local copies in `design/especime-v3/maquetas/` so you can read
   and diff them. Say which boards you read and their labels.

PRECEDENCE, HIGHEST FIRST

The Emendas of 2026-08-20; then the rest of the constitution v3.1; then the state
note for anything about what the repo is today; then the handoff's numbered
points; then `IDENTIDADE.md` v2; then the canvas boards. Boards never win.

The Emendas beat the handoff's own points, and here is the one that matters:
handoff point 5 says the map is a stamp on the home. That is the posture I
overruled this afternoon. The rule is Emenda 3, the map breathes: full map with
its ficha in País scope and in concelho choice, contracting to the locator card
when a concelho is chosen and the reading deepens; no município highlighted by
status, not the capital, not district or region capitals, all 308 points equal,
the only distinction ■/□ coverage, with the legend beside the map; on mobile the
map is not a point selector. If the board on the canvas still shows the stamp
posture, say so in your first message and build the Emenda, not the board.

STAGE 0, FIRST, AND SHORT

Commit to the branch before any visual work:
- the base SHA from `git rev-parse origin/main`, pinned in the plan. If it is not
  `9b9f477`, say what moved. Main is not frozen (weekly panel refresh, monthly
  sweep, PRR re-extraction): rebase at every stage boundary, re-run the rulers,
  and report if a rebase moved a value or a count.
- a carry-forward table of every open item in `DECISIONS.md` §4, each with the
  stage that touches it and one of: preserved, fixed here, still deferred and why.
- the relocation register (below) and the English key plan (below).
- the plan itself, as `design/especime-v3/PLANO-redesenho-v3.md`, stage by stage,
  with the file list each stage owns. The one-message summary in chat is the
  summary, not the plan.

The reconciliation is item by item against the state note: its §2, the six things
the handoff does not know, and its §5, the seven things the constitution does not
cover, each with implement, flag or ask beside it. Read the gate scripts
themselves, not their names. Note that the corrections door count is a ruler
measure outside the build, not a gate.

Then proceed with stage 1 without waiting for my word on the plan. The only two
things that wait are the decisions listed at the end and the preview after the
home.

MY ANSWERS TO THE FOUR CRITICAL FINDINGS, NOT OPEN

1. Content invariance is an advisor. It prints, it never fails a build, it lives
   outside `npm run build` like `medir-defeitos.mjs`. Anything that must be
   enforced becomes an extension of `gate:html`, `ledger:check` or `check:dados`,
   each proven on a planted defect. A check that must pass before a merge is a
   gate whatever you call it, and if you conclude you need one, stop and ask.
2. Text and numbers move only by an authorised relocation, written down before
   the move: source route, destination route, component, scope, language,
   occurrence count. The visible scope label and the value move as one unit.
   There is no «it existed somewhere on the old site» exception. This is the
   scope-bleed defect, the one that can put an Évora number under Beja.
3. Runtime code selects prevalidated strings and never formats a figure. Declare
   the closed URL state schema (scope, density, edition), resolve every query
   value through closed route data, never into `innerHTML`, keep a correct
   server-rendered default that works with JavaScript off. The dump reads text
   nodes and cannot see scripts or attributes, so dump the rendered DOM for a
   state matrix, not only the source HTML.
4. Every governed change lands in the same commit as its decision entry, with
   `Afecta:` and the digest, per §1.38. No governed byte changes before I have
   approved the exact sentence.

ENGLISH

Every stage adds PT and EN keys in the same commit. `assertKeyParity()` throws at
every build, so a stage that is green only because English is missing is not
green and you may not report it as green. Decide the state vocabulary once,
before the first stage that renders it, and send me those words alone first: fora
do limiar, dentro do limiar, sem limiar, por confirmar, plus the coverage words.
The full PT to EN list still comes to me for voice review before merge; voice
review is not what unblocks the build, and a word I change later is one string,
not a stage.

ONE GLYPH, ONE MEANING

The dashed square currently means incomplete provenance in the seal, «por
confirmar» in the constitution, and «por ler» in the v3 state row, while the
empty square means «sem página ainda» on the map, and the prototype adds «0
linhas · ainda». Defect 7 of the eight is precisely three phrasings for municipal
coverage. Before the home ships, coverage gets one vocabulary in both editions,
and the defect counts as closed when the ruler's count of distinct phrasings is
one, measured.

SHARE CARDS (point 9a), AND THIS IS THE CONDITION FOR THEM COUNTING AS DONE

A number rendered into an image is invisible to every check the site has. So: the
card renders from ledger rows through the same component path the page uses,
never a second formatting path, never a hand-written string, never `og:`
metadata typed by hand. The build writes one machine-readable record per card
(route, each value, its row id, unit, period, the row's digest), and an extension
of the existing checks re-derives every value from `ledger/claims/` and compares
it as a string by the same rule as `data-claim`, unit symbol outside the element
included. Prove it with two plants, a wrong number and a value stale against its
row, and show the build refusing both. Cards are build artefacts, regenerated at
every build and never committed, because a committed card is written state. The
state is written in words on the card as well as shown in the strip, no map dots,
no colour outside the state pair, and a card carries no value its own page does
not carry.

GOVERNED TEXT

There are two Método lines in this block, not one: the colour line (yellow
becomes warning, oxblood retired) and the type line (where the letter comes from,
and per Emenda 5 it does not claim the Gini 1938 lineage). Both are governed:
draft the exact sentence in both editions, send it to me, change the byte only
after I say yes, with the `DECISIONS.md` entry in the same commit. `IDENTIDADE.md`
§1 (sem tipos de rede) and §2 (what the yellow and the oxblood mean) change in
this block too, with their own entry, before the first stage that depends on
them. Every sentence `IDENTIDADE.md` quotes from Método or Sobre is compared word
for word by `ledger:check`: move a governed sentence and fix its quotation in the
same commit, or the build stops. Before wiring any font, read `vercel.json`'s
content security policy and confirm self-hosted faces load under it.

SCOPE

Phase 1 is the v3 home desktop and mobile, the interior pages under the Emendas,
the eight defects, the share cards. Phase 2 stays parked, and on the home that
means the catálogo and dossiê block does not ship: no block, no placeholder, no
door to an address that does not exist yet, recorded in the plan as a named
deviation from the approved prototype. For pages with no v3 board (correções,
arquivo dos estudos, documento alojado) the rule is the Emendas plus IDENTIDADE
§3: choose one of the three dispositions, do not invent a fourth, and the hosted
document keeps exact bytes with no site stylesheet. The eight defects are already
graded against today's main in §4 of the state note; start there instead of
re-diagnosing.

Two constitution rules cannot be met in phase 1 and I want them written in the
plan, not carried silently: frame phrases capped at twelve distinct against
seventy-seven today, and the mock-ups reusing front-page qualifying phrases that
the defect register lists as claims without a door.

STAGES AND VERIFICATION

One builder owns one stage; its file list is written before it starts; shared CSS
and shared components have one owner for the whole phase. Commit at every
substage and write the stage note at the checkpoint, before the audit, so a
session cut costs one substage. Exit criteria are deliverables, not token counts,
but state a rough scale per stage and tell me if a stage passes its estimate by
half.

The path out is the standing one, no exceptions: build green, cross-family read
by another family with planted defects, protected preview, my word, merge,
`verify:deploy`. Two previews, not one. The first goes up after the home, desktop
and mobile, and before the interior pages, and I read it. That is the one wait
that saves money: I am not paying to rebuild ten interiors under a direction I
have not seen running.

The home is stateful, so it gets an acceptance matrix, run and reported: keyboard
order and focus return, state announced and not only shown, both editions, both
themes, 320 / 390 / intermediate / 1280, reduced motion, back and forward,
reload, language switch preserving scope and density, invalid and unknown query
values, and the no-JavaScript default rendering something correct. The seal is
its row's largest tap target, at least 44px, never nested. Every new colour pair
goes into `medir-contraste.mjs`, light and dark, and the measurements go in the
report; a pair that is not in the array is a pair nobody measured. Run
`medir-defeitos.mjs` before and after each stage and report the deltas.

STOP AND ASK ME, AND DO NOT IMPROVISE AROUND

While you wait, park the item. Do not build the workaround, and keep building
only what my answer cannot change. Say what is parked and what you are proceeding
with.

- the handoff or the constitution conflicts with repo reality, an existing gate
  (ledger gate, assertKeyParity, gate:html) or a standing decision: name the
  conflict and your recommendation;
- a mock-up implies any value, claim or copy with no ledger row: never invent,
  use [a verificar] or cut, and tell me;
- a fix needs an editorial call. An editorial call is anything that changes what
  the site says rather than how it looks: the wording of any public sentence in
  either edition; the wording or form of a state, a marker or an empty state;
  which measures the home carries and in what order; what the navigation
  contains; whether a value is shown as provisional, final or withheld; anything
  governed by §1.38. Type, spacing, grid, weight, scale and motion are yours;
- you would need a new gate. The moratorium stands, product before gates, and
  extensions of existing checks proven on planted defects are expected and are
  not new gates;
- a constitution rule cannot be met as specified. If it governs what the reader
  is told (state vocabulary, colour meaning, seal, marker, distance in words and
  number, map neutrality), stop before implementing a substitute. If it governs
  form only, implement the closest honest version, measure it, and put the
  deviation in the plan and in that milestone's report, not at the end.

DECIDE WITH ME BEFORE THE STAGE THAT NEEDS THEM

- whether Correções makes the masthead an eight-item navigation, with the
  constitution's count of seven amended in this block, or replaces an item;
- whether «por ler» is a fifth measurement state or an editorial coverage label
  outside the closed vocabulary;
- what provenance form the correction register's old and new values get, since
  restyling from oxblood to form does not close that debt;
- the front-page form for the Eurostat provisional flag, in words, with an
  inventory of every surface where that claim renders; and whether phase 1 ships
  the ruler without the numeric distance and is therefore described as partial.

REPORTING

At each stage boundary, not at the end of the phase: what shipped, screenshots at
1280 and 390 in both editions, gate and ruler status with deltas, the EN keys
added, the relocations authorised in that stage, the contrast measurements, and a
running ISSUES list including the ones you closed. Say which model ran which
part. Surface a blocker the moment it appears.
```

---

**Tokens spent:** measured off the context budget counter, about 86k consumed through the end of reading (15,000,000 down to 14,914,190), plus roughly 12k for this report, so approximately 98k total for this review.