# Leitura a frio do Codex aos blocos F0.2b, F0.11 e F0.12 (as duas passagens, a DGAL do portátil, as dez linhas nunca relidas), 03.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, 09:08 a 09:18 UTC, sobre um pacote dos dois repositórios com cinco plantas de três classes (5 de 5 vistas; o registo está no `.plantas.json` ao lado): P1a e P1b, a variável tirada antes de decidir as passagens (o defeito que a docstring descreve), na cópia e no diff, apanhada no Blocking 1; P2a e P2b, a corrida parcial a carimbar o cabeçalho (`if False and so_o_estado`), apanhada no Blocking 2; P3, 903 linhas em vez de 930, apanhada no Minor 11. Triagem do lugar de direção: o Blocking 3 e os Major 4 a 9 são reais e consertam-se na segunda passagem; o Major 10 é do pacote (a amostra levava uma linha e não três, por engano do lugar de direção); o Minor 12 é um limite a dizer (a data da reconferência é a data UTC; a máquina fica no índice do arquivo e não na linha do sítio, como o plano pedia). O texto do leitor fica como veio.*

---

# Blocking

1. **The two-pass helper makes the decision in the wrong order.** `as_passagens()` removes `OEDP_SITE` and only then calls `passagens()` (`sitio.py:273-274`). Consequently, a named live worktree is ignored: the “live” pass may run against `ARVORE_PRINCIPAL`, or may be omitted if that tree is absent, even though the named site exists (`sitio.py:122-144`, `sitio.py:234-247`). This is exactly the defect the report says was fixed (`relatorio-motor.md:59-71`). The same defective ordering is in the patch (`diff-motor.patch:96-97`).

   The exact versioned copy is protected from being the second pass when `passagens()` sees it (`sitio.py:243-246`), but the environment-selected copy is never seen. A suite may still exit 0 with one pass; that omission is printed rather than silent (`export_agenda_test.py:667-681`), but it can print the wrong reason because the environment choice has already vanished.

2. **A partial run does stamp `CONFERENCIA`; its preservation and refusal code is unreachable.** The fresh block is constructed from the partial run (`corredor.py:1038-1049`), while preservation is guarded by `if False and so_o_estado` (`corredor.py:1050-1059`). The fresh block is then written unconditionally (`corredor.py:1061-1099`). Therefore:

   - `fontes.mjs` is created even when absent, rather than refusing.
   - Its header receives the partial run’s date, five addresses and partial row count.
   - The report nevertheless records `carimbo_do_cabecalho: false` (`corredor.py:2148-2149`).

   This contradicts both reports (`relatorio-motor.md:132-137`, `relatorio-sitio.md:112-116`). It also makes the supplied old `CONFERENCIA` block (`fontes.mjs:30-40`) impossible as the direct output of the claimed 03.09 partial run. The built-in proof would detect the changed bytes (`corredor.py:1515-1534`), so the reported `CORREDOR: PASS — 31` is incompatible with the supplied code (`relatorio-motor.md:251-271`).

   The dead-man’s switch itself is protected: it is written only when the run is not partial (`corredor.py:2214-2224`).

3. **Writes are not transactional: a run that ultimately fails can already have changed the site.** Verification entries are appended during `correr()` (`corredor.py:758-793`). Archive-index failures are caught rather than stopping immediately (`corredor.py:750-756`), and `fontes.mjs` is written before archive invariants and reader exit codes determine the final result (`corredor.py:2137-2148`, `corredor.py:2185-2224`). Thus a failed run can leave reconferences and a new site signal behind. Only the heartbeat is genuinely the last successful-run action.

# Major

4. **A transient error can mark an entire host absent.** One timeout opens the breaker immediately and synthesizes zero-cost absences for all remaining addresses (`corredor.py:609-645`). Those entries become `result: inacessivel` (`corredor.py:765-793`). Moreover, every non-2xx response, including an actual 403 or 503 response, is classified as absence (`corredor.py:446-459`, `corredor.py:931-940`). If all known addresses encounter one such run, the host enters `ANFITRIOES_SEM_RESPOSTA` (`corredor.py:975-983`). This can turn a transient timeout or a host actively returning errors into the categorical text “sem resposta”.

5. **The host-level receipt overstates both time and scope.** When different addresses failed on different dates, the code uses `min(calados)`, although the host became wholly absent only when the last still-working address failed; that date would be the maximum (`corredor.py:955-982`). The archive state stores a machine (`corredor.py:961-982`), but the receipt renders only `desde`, omitting that qualifier (`LinhaView.astro:297-310`, `LinhaView.astro:543-546`, `LinhaView.astro:1022-1033`). It therefore turns “did not answer this machine” into “Sem resposta desde”.

   The provenance seal is not suppressed or restyled according to absence: the unchanged `<Provenance>` renders first, followed by separate muted text (`LinhaView.astro:519-546`, `diff-sitio.patch:245-251`). A visually fresh seal can therefore remain beside a contradictory warning. The partial-header defect also makes the global freshness header falsely fresh.

6. **The partial selector has zero-work and stale-state paths.** A value containing only commas or whitespace becomes an empty host list (`corredor.py:493-497`); the unknown-host check then has nothing to reject (`corredor.py:547-558`). A valid host combined with `--so-devidas` can likewise select zero due addresses without failing. With `--sem-arquivo`, the new observations are not persisted (`corredor.py:750-756`), but `main()` rereads the old on-disk index to regenerate `fontes.mjs` (`corredor.py:2139-2144`), so it can publish stale absence state.

7. **The receipt test is neither a gate nor a reliable completeness check.** The report explicitly leaves it outside `build` and `verify` (`relatorio-sitio.md:162-174`). Missing pages are counted and skipped without adding a failure, so an empty or incomplete `dist/` can exit 0 (`diff-sitio.patch:540-548`, `diff-sitio.patch:606-612`). It checks only the Portuguese route (`diff-sitio.patch:540-541`).

   It also imports the same `dataDaCasa()` used by production, so a wrong formatter can agree with itself (`diff-sitio.patch:432-433`, `diff-sitio.patch:565-590`). It does not verify the literal label, only the class and formatted date. The exact Portuguese text and formatter implementations are absent from the package; `LinhaView` merely calls them (`LinhaView.astro:68-69`, `LinhaView.astro:543-545`).

8. **The “ten primary rows with HTTP URLs” account contradicts itself.** The motor report defines all ten as primary rows with `source_url http` (`relatorio-motor.md:196-201`), then says five already had `source_url: [a verificar]` and no address (`relatorio-motor.md:314-320`). The site report repeats that those markers already existed (`relatorio-sitio.md:140-146`). Both statements cannot describe the same starting ledger.

   The package cannot establish that those five leave the sitemap: `astro.config.mjs`, `ledger.mjs`, the five claims and the built sitemap are absent. The supplied view only shows that `noindex` follows the unavailable `provenienciaIncompleta()` result (`LinhaView.astro:91`, `LinhaView.astro:498-504`). It does reuse the house `Marcador` when a row has no reconferences (`LinhaView.astro:1037-1045`), but the five rows’ actual state is not supplied.

9. **“Conferred byte for byte” is honest only as an archive-integrity check.** The code downloads the archive URL without validators and compares its response SHA-256 with the SHA-256 declared by the row (`corredor.py:614-649`). A match writes `igual` with the archive URL as `path` (`corredor.py:777-788`). That rereads the archived copy, not the publisher’s current source, and it neither recomputes nor validates the claimed numerical value. The report’s stronger conclusion that “the number cannot have changed” is unsupported (`relatorio-motor.md:217-220`). Five rows received six archive checks because one row names two copies (`relatorio-motor.md:288-313`).

10. **The claimed real runs and bulk row contents are not auditable from this package.** The 935 claim diffs are omitted; only their one-line stat is supplied (`diff-sitio-claims.stat:1`). `LEIA-ME.md` says the sample contains three rows (`LEIA-ME.md:3`), but the sample contains one file, a PRR row rather than a DGAL row (`diff-sitio-claims-amostra.patch:1`, `diff-sitio-claims-amostra.patch:16`). There is no supplied run receipt or archive-index excerpt supporting the claimed DGAL machine, five observations or 930 individual writes. Given the two impossible claimed test outcomes above, the narrative logs cannot substitute for those artifacts.

# Minor

11. **The DGAL row and capture counts are misstated.** The five per-address row counts are `616 + 308 + 2 + 2 + 2 = 930`, not 903 (`relatorio-motor.md:159-169`). The site report also says 930 (`relatorio-sitio.md:110-115`). Calling the five new index records “capturas” is inconsistent with the motor’s own terminology: all five were `conferido-igual`, while a capture is a new or first body (`corredor.py:419-425`, `relatorio-motor.md:161-171`). The correct description is five new index observations and zero new archived files.

12. **Author is fixed, but date and machine have audit limits.** `by` is hard-coded to `corredor-diario`, and the entry path is chosen deterministically (`corredor.py:82`, `corredor.py:780-788`). The date is the first ten characters of a UTC timestamp, not necessarily Lisbon’s civil date around midnight (`corredor.py:119-120`, `corredor.py:500-505`). Machine comes from the omitted `ferramentas.onde_estamos()` implementation and is stored only in the archive record, not the site verification (`corredor.py:560-565`, `corredor.py:720-733`); its correctness cannot be certified from the package.

## What is fine

- Non-empty named hosts are filtered after the calendar, and an actually unknown host is rejected (`corredor.py:538-558`).
- Address-level state takes precedence over host state, and a later good HTTP response removes the address absence; one responding address also removes the host-wide state (`LinhaView.astro:297-310`, `corredor.py:925-941`, `corredor.py:975-983`).
- The receipt renders the state in both intended positions and reuses `var(--muted)` rather than introducing a new palette value (`LinhaView.astro:542-546`, `LinhaView.astro:1022-1033`, `diff-sitio.patch:245-251`).
- Gate-pass labels, failure aggregation and visible absence lines are present in the suites (`export_agenda_test.py:653-681`). The reported arithmetic `46 + 148 + 40 = 234`, doubled to 468, is coherent, though not proof that the reported executions occurred (`relatorio-motor.md:34-53`).
- The bulk-stat arithmetic is coherent: 936 four-line verification entries plus five first-list headers of four lines gives 3,764 insertions across 935 files (`relatorio-sitio.md:16-23`, `relatorio-sitio.md:120-125`, `diff-sitio-claims.stat:1`).
- The critical copied source and patch hunks agree; the contradictions are between both code representations and the reports (`sitio.py:273-274`, `diff-motor.patch:96-97`, `corredor.py:1050`, `diff-motor.patch:981`).

**Distinct findings: 12.**