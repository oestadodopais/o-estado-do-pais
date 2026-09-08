# Leitura a frio do Codex ao bloco I115 do motor (o vigia de rede do painel semanal), 08.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, 15:44 a 16:01 UTC de 08.09.2026, 148 064 símbolos, sobre um pacote montado por `scripts/leituras/pacote.sh` (o brief tal como foi dado ao construtor, o relatório, o diff `483c9ea..f6d80c7`, os dois ficheiros mudados) com cinco plantas de três classes (5 de 5 vistas; o registo está no `.plantas.json` ao lado): V5, a corrida sem rede a sair com 0 no lugar de `SEM_REDE`, apanhada no Blocking 3; V2, a etiqueta do observador a cair em `platform.node()`, apanhada no Blocking 2; V3, o chão do painel a 30, apanhado no Major 6; V1, a guarda do `HTTPError` desligada, apanhada no Major 7; V4, os 63, apanhados no Major 8. Triagem do lugar de direção: reais e para a segunda passagem (ramo `vigia-2026-09-08`, Claude Opus 5, no mesmo dia): o Blocking 1 (um tempo esgotado a meio da corrida continuava a ser «inacessível» com o heartbeat carimbado; a decisão: um tempo esgotado volta a perguntar ao vigia nesse momento, e é «sem rede» se ele falhar e «inacessível com a rede a funcionar» se passar), o Major 4 (uma verificação recusada por malformada ou datada no futuro contada como «repetida»: passam a alarmes), o Major 5 (`--prove-gates` a contar um portão saltado como provado), o Minor 12 (o vigia só no primeiro anfitrião: passa a cada anfitrião distinto), o Major 9 e o Minor 11 (as provas coladas com os comandos, o 25 contra 16 medido) e o Major 10 (a compatibilidade do sítio provada com o `ledger:check` e o `typecheck` sobre um ficheiro com o campo). Os 13 a 18 confirmam o vigia antes da primeira escrita, o caminho parcial sem carimbo, o `HTTPError` como resposta da fonte, a prova por sha256, o `--check-heartbeat` e a contagem de linhas do ficheiro.*

---

## Blocking

1. **A mid-run timeout is still recorded as source “inacessível”, followed by a full heartbeat and public handoff.** `falha_de_rede()` recognizes DNS failures, resets, aborts and selected routing errors, but not `socket.timeout`, `TimeoutError` or `ETIMEDOUT`. After `get()` exhausts its retries, `probe()` therefore returns an ordinary error with `sem_rede=None`; the loop writes an inaccessible verification and continues to the full-run writes. The prover contains no timeout known-positive, so this recreation of the original public-site defect can remain green.  
indicators/refresh.py:214, indicators/refresh.py:260, indicators/refresh.py:358, indicators/refresh.py:451, indicators/refresh.py:984, indicators/refresh.py:1019, indicators/refresh.py:1024, indicators/refresh.py:1038, indicators/refresh.py:1374

2. **Without `OEDP_OBSERVADOR`, the copied code publishes `platform.node()` in `verificacao.mjs`, and its no-leak check is vacuous.** `etiqueta_do_observador()` falls back to the machine hostname, `observador_publicavel()` returns it, and the handoff writes every truthy returned value. The test checks absence only when that helper is falsy; on a normally named machine it takes the `else True` branch without inspecting the handoff. The patch instead adds an empty fallback, and the report claims the opposite behavior; even that intended version would not be byte-for-byte unchanged because the patch adds a new generated comment block.  
indicators/refresh.py:238, indicators/refresh.py:243, indicators/refresh.py:1036, indicators/refresh.py:1062, indicators/refresh.py:1507, diff.patch:210, diff.patch:229, diff.patch:623, relatorio-construtor.md:93, relatorio-construtor.md:100

3. **A preflight watchdog failure returns success code `0`, not the promised dedicated code `3`.** `SEM_REDE` is defined as 3 and the patch adds `return SEM_REDE`, but the copied file has `return 0`. Both DNS and TCP known-positive checks compare this return value with `SEM_REDE`, so the packaged `--prova-vigia` cannot produce the reported PASS and the enclosing prover gate must be red. The early return still avoids file writes, but launchd and the runner receive a false success signal.  
indicators/refresh.py:200, indicators/refresh.py:952, indicators/refresh.py:955, indicators/refresh.py:1408, indicators/refresh.py:1428, diff.patch:537, diff.patch:540, relatorio-construtor.md:16, relatorio-construtor.md:202

## Major

4. **A refused verification-row write is silently counted as “already written” and can still produce a fresh heartbeat claiming every claim was checked.** `append_verification()` returns `False` not only for a same-day duplicate, but also for a malformed verification block or a row dated in the future. Its caller maps every `False` to `repetidas` without adding an alarm, then writes `claims_checked: len(claims)` and the public handoff. A row can therefore remain stale while the global reader-facing freshness signal advances.  
indicators/refresh.py:765, indicators/refresh.py:773, indicators/refresh.py:985, indicators/refresh.py:988, indicators/refresh.py:1024, indicators/refresh.py:1038, indicators/refresh.py:1075

5. **`--prove-gates` can print `15/15 gates proven` and exit successfully after explicitly skipping the fifteenth gate.** The total is incremented before checking whether the site validator exists. The missing-validator branch prints `SKIP` but does not increment `bad`; the final arithmetic consequently counts that skip as a pass. Thus the reported repair does not make a green result prove that the site rejects the malformed entry.  
indicators/refresh.py:1810, indicators/refresh.py:1817, indicators/refresh.py:1819, indicators/refresh.py:1868, relatorio-construtor.md:103, relatorio-construtor.md:246

6. **The copied prover lowers the panel floor from the patched and reported 36 to 30, leaving the floor arithmetic internally false.** Its five floors are 18, 23, 98, 44 and 30, which sum to 213, while the comment and `CHAO_TOTAL` say 219. The total check uses actual observed counts rather than the sum of floors; using the report’s other four counts, 198 plus a shrunken panel count of 30 is still 228, so all six lost panel checks can pass. The report’s claimed output `(chão 36)` also cannot be emitted by this copied file.  
indicators/provas_test.py:208, indicators/provas_test.py:214, indicators/provas_test.py:220, indicators/provas_test.py:225, indicators/provas_test.py:293, indicators/provas_test.py:303, diff.patch:74, diff.patch:82, relatorio-construtor.md:14, relatorio-construtor.md:236

7. **The copied classifier disables the explicit `HTTPError` exclusion, and the advertised known-positives do not detect that deletion.** The patch has an unconditional `isinstance(HTTPError)` guard, while the copy changes it to `if False and ...`. The two classifier fixtures still fall through the `URLError` branch and return `None`, so they pass despite the dead guard; ordinary claim HTTP errors happen to remain protected only by the separate earlier `except HTTPError` in `probe()`. This contradicts the report’s claim that plants against both halves were caught and restored.  
indicators/refresh.py:269, indicators/refresh.py:273, indicators/refresh.py:471, indicators/refresh.py:1383, indicators/refresh.py:1391, diff.patch:241, relatorio-construtor.md:273, relatorio-construtor.md:275

8. **The report’s headline watchdog count of 63 contradicts both its own transcript and the copied prover, which contain 36 checks.** The report later prints `PASS — 36 checks`, and the floor explanation independently enumerates 36. No interpretation of the shown arithmetic makes 63 reproducible.  
relatorio-construtor.md:11, relatorio-construtor.md:230, relatorio-construtor.md:233, indicators/provas_test.py:200

9. **Most historical and execution measurements in the report are not reproducible from this package.** The 07 September incident depends on an absent `refresh.log`; the 32-host count depends on absent ledger rows; the 198/234 total depends on four absent provers; and both `core.gate` results depend on absent gate code and result files. The branch identities, public-repository date, hostname measurement and plist behavior likewise have no packaged evidence. The six-plant section contains alleged output but no mutation/restoration commands or hash values, despite the table promising an executable `sh` block.  
relatorio-construtor.md:3, relatorio-construtor.md:13, relatorio-construtor.md:19, relatorio-construtor.md:20, relatorio-construtor.md:23, relatorio-construtor.md:28, relatorio-construtor.md:45, relatorio-construtor.md:93, relatorio-construtor.md:268, relatorio-construtor.md:280, relatorio-construtor.md:319

10. **The claimed site-validator compatibility, two-edition behavior and reader fallback remain unproven because none of the cited site files or built pages is packaged.** The four-field validator claim relies entirely on external `src/lib/ledger.mjs` lines that cannot be inspected here. The report also admits that site typechecking with `observadoPor` was not run and substitutes source-reading claims about three absent consumers. There is consequently no evidence here for `/` versus `/en/`, rendered content, or no-JavaScript behavior.  
relatorio-construtor.md:84, relatorio-construtor.md:88, relatorio-construtor.md:325, relatorio-construtor.md:326, relatorio-construtor.md:330, relatorio-construtor.md:331

## Minor

11. **The reported cause of the old `--prove-gates` failure has two incompatible counts: 25 affected rows in the report and 16 in both the copied code and patch.** No ledger or validator output is packaged to determine which count is real. The count is therefore both contradictory and unmeasured here.  
relatorio-construtor.md:108, relatorio-construtor.md:110, indicators/refresh.py:1823, indicators/refresh.py:1828, diff.patch:1060, diff.patch:1064

12. **The preflight derives every request host but checks only the first, and the prover never tests that mismatch through `run()`.** `anfitrioes_a_pedir()` returns a deduplicated list including multiple claim hosts, yet `run()` calls `vigia_de_rede(anfitrioes[0])` once. The host-list test exercises two different hosts only at helper level, while every full-run fixture uses one shared host, so the “before any request” property is not protected for a mixed-host panel.  
indicators/refresh.py:290, indicators/refresh.py:300, indicators/refresh.py:941, indicators/refresh.py:952, indicators/refresh.py:1293, indicators/refresh.py:1567

## «What is fine»

13. **On the ordinary network path, claim loading is read-only and the watchdog runs before the first possible package write.** indicators/refresh.py:930, indicators/refresh.py:940, indicators/refresh.py:952, indicators/refresh.py:985

14. **For errors that `falha_de_rede()` does recognize, the failed claim is not written and the partial path returns 4 without touching heartbeat, site handoff or baseline.** indicators/refresh.py:973, indicators/refresh.py:983, indicators/refresh.py:1005, indicators/refresh.py:915, indicators/refresh.py:927

15. **Ordinary HTTP error responses are caught explicitly by `probe()` and remain source-side `inacessivel` results rather than partial-network failures.** indicators/refresh.py:471, indicators/refresh.py:472, indicators/refresh.py:984, indicators/refresh.py:989

16. **The preflight no-write fixture hashes three claim rows and five declared outputs before and after the attempted run.** indicators/refresh.py:1256, indicators/refresh.py:1293, indicators/refresh.py:1324, indicators/refresh.py:1325, indicators/refresh.py:1397, indicators/refresh.py:1406

17. **The heartbeat checker still returns 1 for both an absent heartbeat and one older than the 45-day limit.** indicators/refresh.py:168, indicators/refresh.py:1619, indicators/refresh.py:1624

18. **The report’s after-count of 1,925 lines for `indicators/refresh.py` is reproducible from the copied file.** relatorio-construtor.md:21, indicators/refresh.py:1925