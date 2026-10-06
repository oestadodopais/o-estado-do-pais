# A revisão da maquinaria pelo Codex gpt-6-astra (xhigh), 06.10.2026, 08:31 a 08:45 UTC

*Leitura a frio, só leitura, sobre um pacote de 145 ficheiros (os guiões, o CLAUDE.md, os registos dos seis blocos de 05 e 06.10, as últimas 60 questões, as decisões da §1.160 em diante). O mandato está em `REVISAO-MAQUINARIA-mandato-2026-10-06.md`. Símbolos: 331 925 (a linha «tokens used» do registo). As referências `registos/...` apontam aos ficheiros do pacote, não ao repositório.*

## 1. Where the time goes

The machinery duplicates execution and manually maintains derived evidence. Its accounting cannot establish how much builder time goes to content versus proving and describing the work.

**M** means measured from the supplied records, including calculations from their timestamps; it does not mean independently rerun. **E** means estimated. **Unknown** means the package cannot establish it.

| Block | Recorded elapsed time, M | Identifiable repair or merge time, M | Machine `build` / `verify`, M |
|---|---:|---|---:|
| C2 | 18,272 s | Repair: 2,471 s, already included | 192 / 1,043 s |
| RP4-m | 17,418 s initial; 5,714 s repair | Separate builder windows; intervening time unallocated | 196 / 1,029 s |
| H3 | 12,156 s, incomplete window | Includes lock waits; excludes initial reading and final reporting | Unknown |
| RP4-c | 10,202 s | Repair: 2,587 s, included | 218 / 1,138 s |
| R4 | 33,948 s between commits | Repair: 56 minutes by decision timestamps | 215 / 1,091 s |
| EX1 | 35,269 s | Repairs: 7,504 and 5,469 s; merge: 5,818 s, included | 223 / 1,176 s |

Sources: `registos/c2-2026-10-05/custo-c2.json:20`, `custo-c2b.json:20`, `LEIA-ME.md:112`; `registos/rp4m-2026-10-05/custo.json:22`, `custo-rp4mb.json:22`, `LEIA-ME.md:72`; `registos/h3-2026-10-05/custo-inicio.json:6`, `custo-fim.json:2`; `registos/rp4c-2026-10-05/rp4cb-custo-da-sessao.json:22`, `rp4cb-custo.json:22`, `LEIA-ME.md:82`; `registos/r4-2026-10-05/LEIA-ME.md:69`, `:73`; `registos/ex1-2026-10-05/custo.json:22`, `ex1b-custo.json:22`, `ex1c-custo.json:22`, `fusao-custo.json:22`, `LEIA-ME.md:204`.

Cold reads took **11, 12, 12, 10, 8 and 12 minutes respectively, M**, using timestamp differences. Some rounded cost summaries disagree with those differences. Sources: `registos/DECISOES-1.160-em-diante.md:13183`, `:13195`, `:13219`, `:13231`, `:13243`, `:13255`.

These intervals overlap. They cannot be added into an end-to-end total. Coding, proof-writing, reporting, queueing and most merge work remain inseparable. Landing completion timestamps are explicitly elsewhere; the stated **65 minutes is an unverified estimate**, not a recoverable measurement here.

**Per-step verification durations are unavailable.** The supplied logs identify steps without timing them. Moreover, EX1’s packaged log names a different build from its report: `registos/ex1-2026-10-05/portoes-verify.log:1586` versus `LEIA-ME.md:200`. The table therefore reports **report timings**, not timings reconstructed from those logs.

The historical bottleneck order is `alvos`, `palavras`, `moldura`; current ranking is unmeasured (`scripts/verify-depois-do-build.mjs:101`). Earlier parallel verification fell from **473 to 201.2 seconds, M**, but that is an older benchmark (`registos/MAPA-DO-REPOSITORIO-para-construtores.md:291`).

## 2. Where the tokens go

**The proof-versus-content share cannot be calculated from these files.** They lack phase labels, and their accounting units differ:

- C2 records **1,045,446 counter units, M**; its repair is a subset (`registos/c2-2026-10-05/custo-c2.json:19`, `custo-c2b.json:19`).
- H3 records **1,274,756 counter units, M**, before final reporting (`registos/h3-2026-10-05/custo-inicio.json:3`, `custo-fim.json:2`).
- RP4-m records **311.94 million cumulative input tokens, M**, across separate passes; RP4-c **169.39 million**; EX1 **433.37 million**. These repeatedly count context and cache reads, rather than unique work (`registos/rp4m-2026-10-05/custo.json:14`, `custo-rp4mb.json:14`; `registos/rp4c-2026-10-05/rp4cb-custo-da-sessao.json:14`; `registos/ex1-2026-10-05/custo.json:14`).
- Output totals explicitly undercount streamed responses. R4 supplies no comparable cost file (`registos/ex1-2026-10-05/custo.json:18`; `registos/r4-2026-10-05/LEIA-ME.md:73`).

The protocol requires commands and positives per measurement, while the cold reader must reproduce report claims. That creates repeated authoring and checking, but its percentage remains unknown (`registos/agente-construtor.md:16`; `scripts/leituras/PROMPT-comum.md:9`).

Record phase timestamps and usage deltas automatically. Keep input, cache creation, cache reads and output separate.

## 3. What protects a number, a source or a person

**P** protects numbers, sources or people; **M** protects presentation or maintenance; **P/M** mixes them. Accessibility retains protection even when its implementation changes.

Below, names omit `check:` unless another prefix appears. “Yes” means a planted refusal is reported; “unshown” means the supplied evidence does not demonstrate one. Test implementations under `tests/` are absent, so their classifications rely on logs and reports.

| Gate/checker | Class and refusal; planted evidence |
|---|---|
| `ledger:check` | **P:** corrupted provenance/value history; yes (`registos/ex1-2026-10-05/portoes-verify.log:398`). |
| `registo`; `briefs` | **P:** false governing figures; unlinked or unreproducible measurements. Registo’s controls are documented; briefs report positives (`scripts/check-registo.mjs:22`; `scripts/check-briefs.py:25`; `registos/ex1-2026-10-05/portoes-verify.log:981`). |
| `cruzamento`; `documentos` | **P:** changed exported bytes and orphaned documents. Crossing plants reported; document plants unshown (`registos/ex1-2026-10-05/portoes-verify.log:472`, `:528`; `scripts/check-documentos.mjs:17`). |
| `cadeia`; `dados`; `mapa:unidades` | **P:** unresolved provenance, incorrect downloads, changed map copies. Plants unshown in these outputs (`registos/ex1-2026-10-05/portoes-verify.log:1632`, `:1644`, `:1650`). |
| `gate:html` | **P/M:** unsourced digits, false privacy promises, disclosures and page structure; yes (`registos/ex1-2026-10-05/portoes-verify.log:997`, `:1513`). |
| `datas`; `fontes` | **P/M; P:** incorrect publication dates and missing source-failure disclosure; planted refusals unshown (`registos/ex1-2026-10-05/portoes-verify.log:1532`, `:1593`). |
| `css`; `cabeca` | **M:** missing styles, joined text and heading layout; yes (`registos/ex1-2026-10-05/portoes-verify.log:1520`, `:1586`). |
| `moldura`; `alvos` | **P/M:** document integrity, keyboard access, contrast, targets and layout. Document-byte plants and an accessibility positive reported; not every cell demonstrated (`registos/ex1-2026-10-05/portoes-verify.log:1540`, `:1545`, `:1578`). |
| `mapa`; `regioes`; `areas` | **P/M:** coverage, attribution, source links, counts and arrangement. Mutation modes exist but are not invoked by ordinary chain commands (`scripts/check-mapa.mjs:59`; `scripts/check-regioes.mjs:37`; `scripts/check-areas.mjs:46`; `package.json:24`). |
| `formas`; `alcance` | **P/M; M:** wrong plotted values/dates versus navigation depth. Forms plants yes; reachability plants unshown (`registos/ex1-2026-10-05/portoes-verify.log:1709`, `:1723`). |
| `lugares`; `pais` | **P/M:** geographical scope, debt interpretation, counts, deadlines and arrangement; yes (`registos/ex1-2026-10-05/portoes-verify.log:1732`, `:2488`). |
| `voz`; `lingua` | **P/M:** unsupported declarations, invented units and editorial conventions; yes (`registos/r4-2026-10-05/LEIA-ME.md:52`; `registos/rp4m-2026-10-05/LEIA-ME.md:42`). |
| `formato`; `lugar` | **P/M:** ambiguous number formatting, missing attribution/uncertainty explanations, duplicate destinations; yes (`registos/ex1-2026-10-05/portoes-verify.log:2570`, `:2596`; `registos/r4-2026-10-05/LEIA-ME.md:53`). |
| `provar:eyetext`; `provar:guardas` | **P:** incorrect transcription and permissive runtime guards; synthetic proofs reported (`registos/ex1-2026-10-05/portoes-verify.log:2620`, `:2646`). |
| `mortos` | **M:** unused declarations; yes (`registos/ex1-2026-10-05/portoes-verify.log:2653`). |
| `indice`; `cartao` | **P/M:** false locators, periods, definitions and comparison states; yes (`registos/ex1-2026-10-05/portoes-verify.log:2661`, `:2718`). |
| `navegacao`; `primeira` | **P/M:** missing content, wrong units/scope, incorrect branches and arrangement; yes (`registos/ex1-2026-10-05/portoes-verify.log:5245`, `:5559`). |
| `sinais`; `nomes` | **P:** silent renderer failure and unconfirmed official names; yes (`registos/ex1-2026-10-05/portoes-verify.log:5626`, `:5635`). |
| `palavras`; `design:feixe` | **M; P/M:** prohibited surface vocabulary; bundle integrity, source material and design conventions. Plants reported (`registos/ex1-2026-10-05/portoes-verify.log:5640`, `:5645`; `scripts/design-bundle.mjs:31`). |
| `privacidade`; `sugestoes` | **P:** personal information/secrets and unsafe form behaviour; yes (`scripts/check-privacidade.py:1`; `registos/ex1-2026-10-05/portoes-verify.log:5694`, `:5886`). |
| `rotulos`; `series` | **P/M; P:** wrong/missing units and labels; incorrect series points, derivations and receipts. Mutation coverage documented/reported (`scripts/inventario-rotulos.mjs:61`; `registos/ex1-2026-10-05/portoes-verify.log:5896`). |
| `indice-do-sitio`; `explicacoes` | **P/M; P:** omitted destinations/change entries; unsupported explanations and false weekly counts; yes (`registos/ex1-2026-10-05/portoes-verify.log:5904`, `:5910`). |
| `frases-compostas` | **M:** broken sentence layout and overflow; browser plants yes (`registos/ex1-2026-10-05/portoes-verify.log:5916`). |

The proofs protocol needs reshaping:

- **`conferir-relatorio.py`: P intention, weak implementation.** It matches numerals anywhere in JSON, without binding claims to measurements. A read-only synthetic test accepted an unrelated matching value. Its positive proves absent-number detection only (`scripts/leituras/conferir-relatorio.py:89`; `scripts/leituras/numeros.py:282`).
- **Map checker: M.** It reports citation drift and exits normally; it does not establish semantic correctness (`scripts/leituras/conferir-mapa.py:57`).
- **Captures and built-page mutations: P/M.** Keep them: they expose defects absent from static gates (`registos/h3-2026-10-05/LEIA-ME.md:69`; `registos/rp4c-2026-10-05/LEIA-ME.md:70`).
- **Packaging, decision extraction and mutation records: evidence infrastructure.** Preserve evidence completeness, applicable decisions and reproducible mutations (`scripts/leituras/pacote.sh:17`; `scripts/leituras/decisoes-em-vigor.py:13`; `scripts/leituras/plantar.py:9`).

## 4. The cuts, ranked

These are **E pilot targets**, not established savings. Weekly estimates assume **10 blocks** and overlap.

1. **Use the existing guarded parallel runner locally.** The current chain has **44 steps, with 20 exact command overlaps with build, M** (`package.json:13`, `:45`). CI already removes repetition; local `portoes.sh` does not (`registos/portao.yml:151`; `scripts/leituras/portoes.sh:37`). Target **450–650 seconds saved per full run**. Require successful build first, bounded concurrency and isolated mutations. Prove equivalence with missing-check, failing-check, stale-build and write-and-restore plants already implemented (`scripts/verify-depois-do-build.mjs:435`). Measure token savings rather than assuming them.

2. **Replace line-number maintenance with unique semantic anchors.** Keep a short routing map and load relevant sections on demand. Its purpose is finding responsibilities and invariants, not preserving moving coordinates (`registos/MAPA-DO-REPOSITORIO-para-construtores.md:3`, `:35`). The repair scripts demonstrate avoidable upkeep (`registos/seguir-linhas-do-mapa.py:19`). Target **15–30 minutes/block**, **40–70 thousand initial-context tokens/block**, **2.5–5 seat-hours/week**. Risk: ambiguous anchors. Plant deleted and duplicated anchors; moving intact code must pass.

3. **Generate evidence tables and report figures from named measurements.** Retain commands, raw evidence, controls and independent oracles; generate head, status, duration, capture index and acceptance tables. Humans/agents write conclusions and unresolved issues. Report-reading usage is unmeasured. Target **30–60 builder-minutes/block**, **50–100 thousand builder tokens**, **about one seat-hour/week**. Risk: circular verification. Replace numeral membership with claim-to-measurement binding; plant swapped metrics, stale heads and a disabled detector. Reuse controls per detector while proving every selector’s coverage (`scripts/check-briefs.py:29`; `registos/agente-construtor.md:16`).

4. **Shard inventories by stable identity; generate their combined views.** Use stable issue IDs, per-feature phrase approvals and audited-reading records; generate translation-key lists. Preserve independent approval of wording and source support. EX1’s merge explicitly reconciled these shared files (`registos/ex1-2026-10-05/LEIA-ME.md:200`); issue renumbering rewrites records (`registos/renumerar-issues.py:23`). Target **15–30 minutes**, **20–50 thousand tokens/block**, **2.5–5 seat-hours/week**. Plant a dropped card, wrong unit, conflicting approval and missing audit. Generated inventories must not automatically approve themselves.

5. **Verify one integrated candidate; reuse evidence only for identical inputs.** Selective checks between commits are already policy (`CLAUDE.md:31`). H3 nevertheless repeated full gates after only map changes (`registos/h3-2026-10-05/LEIA-ME.md:69`). Avoid such repetitions; retain mandatory clean CI and source-dependent checks unavailable there. Replace duplicate same-head landing work with verified artifact reuse only after proving code, data, dependencies, build date and artifact identity. Keep live deployment verification (`scripts/aterrar.sh:62`, `:105`, `:115`, `:129`). Target landing **65 → 30–45 minutes**, including cut 1; **0.5–1 seat-hour/week**. Plant a stale artifact and changed input under reused evidence.

6. **Remove fixed browser waiting, preserving coverage.** Historical accessibility tests waited for network idleness repeatedly (`registos/MAPA-DO-REPOSITORIO-para-construtores.md:293`). Use explicit font/style/readiness conditions. Conditional target: **100–180 seconds/run**; current implementation needs measurement. Plant delayed styles, clipped labels and broken keyboard access. Keep every required width and edition.

7. **Package an indexed evidence set and automate captures once.** Retain changed files, relevant dependencies, source witnesses, before/after pages and all required captures. Existing diff exclusions already preserve full site files (`scripts/leituras/pacote.py:78`). Generate contact sheets and evidence links; avoid repeatedly narrating raw logs. Target **5–15 seat-minutes/block**, **10–20 thousand reviewer tokens**, **0.8–2.5 seat-hours/week**. Risk: missing proof. Plant a report claim whose witness is omitted and require packaging failure. Historical cold-package sizes are unavailable; the supplied **1.1M/1.0M test-folder sizes, M**, are not package sizes (`registos/tests-tamanhos.txt:1`).

## 5. What not to cut

Keep independent cold reads. They found missing publication dates in C2; lost second revisions and false PASS after failed requests in RP4-m; a bilingual privacy bypass in H3; hidden uncertainty in R4; and formatting-only changes incorrectly counted as value changes in EX1. RP4-c needed no cold-read code correction. These are concrete outcomes, not ceremonial approvals (`registos/DECISOES-1.160-em-diante.md:13185`, `:13197`, `:13221`, `:13245`, `:13257`, `:13233`).

Keep independent source readers, provenance chains, uncertainty markers, privacy checks, interaction tests and meaningful mutation tests. C2’s gates refused an undeclared geographical attribution and stale provisional-label inventory (`registos/c2-2026-10-05/LEIA-ME.md:62`, `:69`). Optimize their execution and evidence handling.

## 6. The two-minute test for the owner

Today, a full local gate run costs **20–24 minutes, measured**, inside recorded builder windows of roughly **3–10 hours**, whose administrative share is unknown. Your **65-minute landing estimate** cannot be verified from this package. A reasonable pilot targets **11–16 minutes for local gates**, **30–45 minutes for landing**, and **45–90 minutes less evidence administration per block**, all estimates requiring measurement. The reader keeps the same source checks, numerical reconciliation, privacy protection, independent review and checks across screen sizes and languages. The time comes from fewer repeated runs and fewer manually maintained representations of the same evidence.