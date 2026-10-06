# A leitura a frio do M-A pelo Claude Opus 5.5 (a definição `leitor`), 06.10.2026, das 11:17 às 11:40 UTC

*O bloco foi construído pelo Codex `gpt-6-astra` (xhigh); o leitor é da outra família. O pacote (118 ficheiros, 10 MB, a cabeça `b24b08b3`) levou cinco estragos plantados só nas cópias, registados por sha256 em `LEITURA-MA-2026-10-06.plantas.json`: a célula U sem a falha «não correu aqui» (p1), o selo dos briefs sem o sha256 do guião (p2), o `aterrar.sh` a avisar em vez de parar com o check-run vermelho (p3), o relatório a dizer 326,382 s em vez de 426,382 (p4), e o `portoes.sh` a ignorar INT e TERM (p5). O leitor mordeu os cinco (os achados 1, 3, 2, 5 e 4). Os achados reais ficam para a passagem M-A-b: o 6 (as plantas de cinco dos oito pontos vivem em `tests/leituras/*.py`, que nenhuma cadeia corre), o 7 (com os briefs presos nenhum guião corre em cadeia nenhuma, e um selo escrito à mão conta como conferido), o 8 (a corrida «antes» não foi feita numa árvore limpa da cabeça do brief), o 9 (a tranca nova nunca expira e não diz quem a tem), o 10 (o limpador deixa os caminhos das pastas temporárias e troca o nome do utilizador como substring), o 11 (uma conferência tautológica no pacote), o 12 (o pacote novo deita fora registos sem avisar), o 13 (a saída antecipada do `check:pais` pela célula E1), o 14 (as partes dos tempos de uma corrida morta misturam-se), o 15 (o `custo.py` com um TypeError), o 16 (a lista da cadeia no mapa), e a secção «Code» (o veredicto: ainda não serve de fundação sem as plantas em cadeia e o código limpo onde o leitor o diz). Símbolos da leitura: o total reportado pela ferramenta vai no registo da aterragem.*

Cold read of M-A (built by Codex gpt-6-astra; read by Claude Opus 5.5). All paths are relative to the package folder.

**Short answer to the first question.** By name, no check stopped running. 50 distinct commands ran before and after, set-equal across the three `tempos.json` files; the runner executed exactly the 25 verify steps that are not build steps.

Three things run over less than before:
- `check:briefs` re-executed 0 of 35 brief scripts in the delivered state (finding 7).
- The country self-test now runs the E1 cell alone; this is disclosed and its plants still bite.
- `check:alvos` changed only its wait; its results are proven identical pass by pass.

**The plants per point.** For points 2, 4 and 5 the plants run inside the chain and bite for the stated reason. For points 1, 3, 6, 7 and 8 the plant logic is correct, but no chain runs it (finding 6).

## Blocking

1. **The copied runner turns off cell U's "not run here" check with `else if (false)`, so a check dropped from the selection no longer fails U, and the diff does not change this line.**
`scripts/verify-depois-do-build.mjs:182` reads `else if (false) falhas.push(...)`. The diff's hunks for this file jump from line 89 to line 319 (`diff.patch:26112`, `diff.patch:26120`), so by the diff, line 182 is unchanged code from the brief's head. The recorded runs carry the message only that line can produce («… não é um passo do build e não correu aqui»), so the code that ran is not this copy. With the copy, the plant at :447–448 stops biting and the runner exits 1 before running any check. The cell itself would then pass a selection with a check missing. The GitHub `portao` job runs this same file.
Refs: scripts/verify-depois-do-build.mjs:182, scripts/verify-depois-do-build.mjs:448, scripts/verify-depois-do-build.mjs:542, diff.patch:26112, diff.patch:26120, design/especime-v3/medicoes/ma-2026-10-06/plantas-runner.json:16, design/especime-v3/medicoes/ma-2026-10-06/portoes/verify.json:19, .github/workflows/portao.yml:152

2. **The copied `aterrar.sh` only warns when the head's `portao` check-run is not green, where the recorded plants stop with code 18, so a red head would be merged, pushed and deployed.**
Line 68 is `[ "$PORTAO" = "success" ] || echo "aviso: …"`. Line 78 then prints "portao verde nessa cabeça" unconditionally, and nothing stops the run before the `merge --ff-only` and `push` at :86–88. The diff touches this file only at :21–27 and :117–129. The plant record shows «PAROU … (código 18)» for both `sem-check` and `vermelho`, which this copy cannot print.
Refs: scripts/aterrar.sh:68, scripts/aterrar.sh:78, scripts/aterrar.sh:86, diff.patch:25297, diff.patch:25306, design/especime-v3/medicoes/ma-2026-10-06/plantas-aterrar.json:31, design/especime-v3/medicoes/ma-2026-10-06/plantas-aterrar.json:37, tests/leituras/aterrar.py:41

3. **The copied `check-briefs.py` builds the seal without the script's sha256, so after the next `--escrever-presos` a changed measurement script, with its brief and JSON unchanged, stays pinned and never re-runs.**
Lines 321–322 omit `'guiao_sha256': sha(guioes[0])`, which the diff has at `diff.patch:25389`. With that one line restored in memory, the file hashes to b1d1f6b5…964a, exactly the `conferidor_sha256` in `presos.json:2`, and every seal in `presos.json` carries `guiao_sha256`. So the copy differs from the sealed file at this line only. As shipped, the hash mismatch makes all 35 scripts re-run, so there is no loss yet; the loss arrives with the next re-seal.
Refs: scripts/check-briefs.py:321, scripts/check-briefs.py:323, diff.patch:25389, design/observatorio/medidas/presos.json:2, design/observatorio/medidas/presos.json:7, tests/leituras/briefs-presos.py:43

## Major

4. **The copied `portoes.sh` ignores SIGINT and SIGTERM (`trap '' INT TERM`) where the diff exits with 130, so an interrupt no longer ends the run, and the run only cleans up and releases the lock when it completes.**
Compare `portoes.sh:42` with `diff.patch:25941`. The EXIT trap at :33–41 fires only on an exit, which an ignored TERM never causes. The ignored disposition is also inherited by the `sh` children. `tests/leituras/portoes.py:44–50` sends TERM only while the script is waiting for the lock, before the trap is set, so no test covers an interrupted gate.
Refs: scripts/leituras/portoes.sh:42, scripts/leituras/portoes.sh:33, diff.patch:25941, design/especime-v3/medicoes/ma-2026-10-06/portoes-antigo.sh:35, tests/leituras/portoes.py:49

5. **The report's headline table gives the new full run as 326,382 s, a number that is in no file and contradicts the report's own line 7 and the data (426,382 s).**
`portoes/tempos.json:5` and `resumo.json:42` say 426.382, and the run's timestamps (10:13:46.743 to 10:20:53.125) give the same. `LEIA-ME.md:16` and the map at :300 print 426,382. A search finds 326.382 in no measurement file. The 281-of-281 number check ran on `LEIA-ME.md`, not on this copy. The wrong value overstates the gain by 100 s.
Refs: relatorio-construtor.md:16, relatorio-construtor.md:7, design/especime-v3/medicoes/ma-2026-10-06/portoes/tempos.json:5, design/especime-v3/medicoes/ma-2026-10-06/resumo.json:42, design/especime-v3/medicoes/ma-2026-10-06/LEIA-ME.md:16, numeros-do-relatorio.txt:1

6. **The plants for five of the eight points (timing, brief pinning, landing, packaging, shared tools) live in `tests/leituras/*.py`, which no chain runs, so a green gate run cannot tell a working pin, lock or landing from a broken one.**
`package.json`, `portao.yml` and `portoes.sh` contain no reference to `tests/leituras` (zero hits each; the known positive `tests/inicio` hits 6 times in `package.json`). The copies planted in findings 2, 3 and 4 would all pass every gate green. By contrast, the runner, wait and E1 plants do run in the chain. The report presents these tests as coverage without saying they sit outside the gates.
Refs: package.json:45, .github/workflows/portao.yml:151, scripts/leituras/portoes.sh:53, tests/leituras/briefs-presos.py:1, tests/leituras/portoes.py:1, relatorio-construtor.md:45

7. **With pinning, no brief's measurement script runs in any chain, and nothing proves that a seal came from a green run or that a script's output depends only on the three sealed files.**
The final run records «35 … presos … 0 guião(ões) reexecutado(s)» (`portoes/verify.log:2370`), and GitHub runs the same code. The only re-execution in the package is `briefs-selar.log:2`, whose head is not recorded. `check-briefs.py:482` accepts any seal once the conferidor hash matches, and :323 and :326 then treat the committed JSON, including its `encontrado: true`, as the measurement. So a hand-written `presos.json` entry, which is four sha256 values anyone can compute, makes a script that never ran count as checked. A script that reads the repository, the engine or a helper module can drift without any sealed byte changing. The report states the reuse but proves no equivalence. The docstring (:22–25) and the map's protected description (:135) still say every script runs.
Refs: design/especime-v3/medicoes/ma-2026-10-06/portoes/verify.log:2370, design/especime-v3/medicoes/ma-2026-10-06/briefs-selar.log:2, scripts/check-briefs.py:323, scripts/check-briefs.py:482, scripts/check-briefs.py:22, design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md:135, relatorio-construtor.md:40

## Minor

8. **The "before" column is labelled as the brief's head, but that run's tree had four modified tracked files and three untracked ones, and their contents are not in the package.**
The modified files were `portoes.sh`, the runner, `alvos.mjs` and `prazo-pela-celula.mjs`. `antes/alvos.json.gz` already has the `paginas` field this block adds, so the baseline `alvos.mjs` was not the brief head's version. That the baseline still used the old fixed wait is an inference, not a shown file: 332.6 s against 181.8 s for the old runner at the code head, and no `plantas_da_espera` field.
Refs: design/especime-v3/medicoes/ma-2026-10-06/antes/estado.fim:1, diff.patch:26394, relatorio-construtor.md:10, relatorio-construtor.md:14

9. **The new lock never expires and no longer names its holder, a change the report does not mention.**
The old script ignored locks older than 2400 s and printed the lock's contents. The new loop waits forever with a bare message. A SIGKILL or a reboot leaves a lock that blocks every later run until someone deletes it.
Refs: scripts/leituras/portoes.sh:28, scripts/leituras/portoes.sh:30, design/especime-v3/medicoes/ma-2026-10-06/portoes-antigo.sh:27

10. **The path cleaner, as `portoes.sh` calls it, leaves temp-folder paths in place and replaces the login name as a raw substring anywhere in the text.**
I planted paths in memory, with file writes captured so nothing on disk changed. `/private/var/folders/…/T/oedp-verify-depois-1` and `/tmp/oedp-e1-h2c-2` survived, while the worktree path and the login were replaced. `--scratchpad` is never passed, although the brief lists `<scratchpad>`. With a login that is also an ordinary word (I used "portoes"), three logs would be rewritten. Today no machine path or login name survives in any of the 118 package files.
Refs: scripts/leituras/limpar-caminhos.py:26, scripts/leituras/limpar-caminhos.py:46, scripts/leituras/portoes.sh:37, brief.md:26

11. **The check behind "linha retirada recusa a entrega" cannot fire in the normal flow.**
`conferir_citacoes` compares the cited lines with the bytes written at :157–160 from the same in-memory value, and nothing in between touches them. Its plant deletes the file by hand and calls the function directly.
Refs: scripts/leituras/pacote.py:89, scripts/leituras/pacote.py:179, tests/leituras/pacote-portoes.py:47, relatorio-construtor.md:44

12. **The new packaging path was not used for this package, has only run on a synthetic repository, and drops every gate log the report does not cite, without a warning.**
This package has whole logs, a `RETIRADO` table and no `linhas-dos-portoes.json`, none of which the new `pacote.py` would produce. Under the new path, the before and old-runner logs I used to compare each check's output would not have reached the reader, because the report cites only seven lines of `portoes/verify.log`.
Refs: RETIRADO-DO-PACOTE.md:1, scripts/leituras/pacote.py:127, scripts/leituras/pacote.py:161, relatorio-construtor.md:106

13. **The `--celula E1` branch adds an early exit to a production gate, and prints "prazo e razão conferidos" even when the E1 call has been removed.**
The mutant with the call removed reaches this message; the self-test hides it by filtering that line out. Nothing stops `--celula E1` from being added to the `package.json` script, which would shrink `check:pais` to one cell.
Refs: scripts/check-pais.mjs:31, scripts/check-pais.mjs:35, tests/inicio/prazo-pela-celula.mjs:55

14. **Reusing an output folder can merge stale timing parts, because the guard only looks for `*.codigo` files.**
A folder left by a run killed during the build passes the guard, and `fechar` then reads every leftover `.tempos` part into the new `tempos.json`.
Refs: scripts/leituras/portoes.sh:21, scripts/leituras/tempos.mjs:29

15. **`custo.py` raises a TypeError on a null Codex counter, although its docstring says absent fields stay null.**
I reproduced this in memory. The failure is closed, but the test catches only ValueError and KeyError.
Refs: scripts/leituras/custo.py:10, scripts/leituras/custo.py:55, tests/leituras/ferramentas.py:37

16. **The map's verify-chain list now also lacks `check:pais:auto-teste`, and the brief forbade fixing it.**
Refs: design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md:122, package.json:45, brief.md:30

## Code

- `scripts/leituras/portoes.sh`: compact and readable. Restore `trap 'exit 130' INT TERM`, bound the lock wait or print the holder, and rename `fechar`, which collides with the function of the same name in `tempos.mjs`.
- `scripts/verify-depois-do-build.mjs`: sound apart from line 182. The I194 case has a duplicated `falhas` key (:492 and :494; the second silently wins).
- `scripts/check-briefs.py`: clear logic. Restore `guiao_sha256`, update docstring points 2–3, and say on the output when seals are ignored.
- `scripts/aterrar.sh`: the new step 6 is clean; line 68 must be `|| para 18`.
- `scripts/leituras/pacote.py` and `pacote.sh`: correct but dense. The gate-log rule (any build, verify or typecheck log with a sibling `.codigo`) is implicit, and `conferir_citacoes` is a tautology.
- `tests/acessibilidade/alvos.mjs`: the new wait and plants are sound. `plantasDaEspera` mutates three globals and relies on restoring them, which is fragile.
- `tests/inicio/prazo-pela-celula.mjs` and `scripts/check-pais.mjs`: sound. The comment at :24–26 describes HTML copies that no longer exist, and the timing code sits between the imports.
- `scripts/leituras/tempos-shell.py` and `tempos.mjs`: small and sound.
- `scripts/leituras/limpar-caminhos.py` and `custo.py`: semicolon-packed one-liners that are hard to review.
- `scripts/leituras/captar.mjs`: sound, and fails closed.
- `tests/leituras/*.py`: good plants, wired to nothing.
- Verdict: not yet acceptable as the foundation. It needs the four diverging lines restored to the diff's versions and `tests/leituras` run inside a chain.

## «What is fine»

17. By name, every old check ran: 50 names, set-equal across the three runs, matching all 50 rows of the report's table; the 24 build steps ran in `package.json` order; U reports 45/20/25. Refs: design/especime-v3/medicoes/ma-2026-10-06/portoes/verify.json:307, relatorio-construtor.md:53
18. Each check's output, normalised for timings, heads and paths, is identical between the before run and the new run; the only exceptions are the new alvos plants, the new briefs line, `check:mortos` reading 371 files instead of 370, and the E1 lines moving out of `check:pais`. Refs: design/especime-v3/medicoes/ma-2026-10-06/antes/verify.log:2523, design/especime-v3/medicoes/ma-2026-10-06/portoes/verify.log:2877
19. The alvos results are identical in every field except `quando` and `plantas_da_espera` across all four result files: 360 passes (72 routes × 5 widths), with the pages hash reproduced. Refs: design/especime-v3/medicoes/ma-2026-10-06/comparacao-alvos.json:12
20. Axe runs after load, fonts and one paint frame, the only navigation call is the new wait function, and the delayed-sheet plant asserts the sheet was served before H16 fails. Refs: tests/acessibilidade/alvos.mjs:1658, tests/acessibilidade/alvos.mjs:1685, tests/acessibilidade/alvos.mjs:2230
21. The E1 plants bite with the expected messages and the mutant without the call passes; the self-test runs once, in verify. Refs: design/especime-v3/medicoes/ma-2026-10-06/e1-h2c.json:11, package.json:67
22. `RESEARCHHUB_DIR` reached `check:series` (32 of 32 plants), and the run without the engine declares the missing half. Refs: design/especime-v3/medicoes/ma-2026-10-06/portoes/verify.log:3183, design/especime-v3/medicoes/ma-2026-10-06/series-sem-motor.log:5
23. Gate codes are written after each process ends and read back from files, and a red build pays for no verify steps. Refs: scripts/leituras/portoes.sh:49, scripts/leituras/portoes.sh:60
24. Every cell of the time table except row 16, the codes table and all 68 plant rows reproduce from the files. Refs: relatorio-construtor.md:17, relatorio-construtor.md:120
25. `brief.md` is byte-identical to the brief sealed in `presos.json`, and the workflow is not in the diff. Refs: design/observatorio/medidas/presos.json:106, .github/workflows/portao.yml:152
26. No `src/`, `public/` or `ledger/` file changed, so prompt items 6, 8 and 9 have nothing to apply to. Refs: relatorio-construtor.md:34
