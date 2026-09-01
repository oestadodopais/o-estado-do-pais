# Leitura a frio do Codex ao piloto do corredor (01.09.2026)

*Codex `gpt-5.6-sol`, 19:15 a 19:34 UTC, o pacote dos dois ramos com o índice do arquivo e duas amostras, três plantas (3 de 3 vistas; o registo no `.plantas.json` ao lado, com os ecos anotados). A triagem do lugar de direção está em §1.92: as doze decisões e a obra; a segunda passagem do construtor aplicou tudo. O texto do Codex segue tal como veio.*

---

## Blocking

1. **`ensaio` can push to the site and therefore requires an undeclared SSH key.**

   - **File:** `motor/fonte/.github/workflows/corredor.yml`
   - **Quote:** `# if: env.MODO == 'real'`
   - **Quote:** `GIT_SSH_COMMAND="ssh -i ~/.ssh/sitio -o IdentitiesOnly=yes" git push origin HEAD:main`
   - The guard on “O commit e o push no sítio” is commented out. In `ensaio`, key installation is skipped but this push still runs, so the mode both violates “push nothing” and fails because `~/.ssh/sitio` does not exist.
   - `motor/diff.patch` contains the active `if: env.MODO == 'real'`, so the patch and the delivered source copy contradict each other. Reconstructing the added files from the patches found this as the only source/patch mismatch.
   - The reports’ claims are false for the delivered workflow:
     - `motor/relatorio-motor.md`: `3 de 3 passos com if: env.MODO == 'real'`
     - Site report: `provar_fluxo.py`, `14 de 14`
   - Correct value for the source copy is **2 of 3** dangerous steps guarded, not 3 of 3. No secret value is printed, but the unguarded step assumes a secret-derived key.

2. **A manually dispatched `real` run is explicitly allowed.**

   - **File:** `motor/fonte/.github/workflows/corredor.yml`
   - **Quote:** `options: [ensaio, real]`
   - **Quote:** `MODO: ${{ github.event.inputs.modo || 'real' }}`
   - ORDEM says `real` is scheduled/default-branch only and must never be run manually. A user can select `real` in `workflow_dispatch`; no job or step checks `github.event_name == 'schedule'`.
   - Correct behavior is to remove manual `real` or reject it before credentials, writes or pushes.

3. **The runner’s non-zero exit status is swallowed, allowing gates and publication to continue after a failed conference.**

   - **File:** `motor/fonte/.github/workflows/corredor.yml`
   - **Quote:** `set -uo pipefail`
   - **Quote:** `python ... | tee "${RELATORIO}/corrida.log"`
   - **Quote:** `echo "codigo=${PIPESTATUS[0]}" >> "$GITHUB_OUTPUT"`
   - The step omits `set -e` and never exits with the captured `codigo`. Its final reporting commands succeed, so GitHub sees a green step even when `corredor.py` returns 1. The `codigo` output is never consumed.
   - Consequently the site gates and the unguarded site push can run after a failed archive or conference.
   - `corredor.py` compounds this by catching index failures as data:
     - **Quote:** `problemas_do_indice.append(str(err))`
     - It then writes claims, the site signal, reports and heartbeat, and only returns 1 at the end.
   - Correct behavior is for the conference step to propagate the Python exit status immediately, before any site write or heartbeat.

4. **Reader failures do not stop the run, and the reader does not read the archived response.**

   - **File:** `motor/fonte/indicators/corredor.py`
   - **Quote:** `painel = correr_painel(sitio, args)`
   - **Quote:** `concelhos = correr_concelhos(args)`
   - **Quote:** `return {"codigo": p.returncode, ...}`
   - The returned `codigo` is recorded but never checked. A missing concelho reader returns `{"codigo": None, ...}` and is also ignored. This violates FRESCURA’s “broken reader stops” rule.
   - `correr_painel()` launches `refresh.py`, which performs its own `urllib` requests. It does not consume the body just archived by the runner. Thus the reader can see different, unarchived bytes, and its downloads are omitted from `bytes_descarregados`.
   - The workflow always supplies `--painel --concelhos`, including on `--so-devidas` runs. Even when the main selector chooses zero URLs, `refresh.py` still makes network requests. The claimed zero-request speed is therefore not an end-to-end property.
   - The concelho reader is not included in this package, so its behavior cannot be inspected here.

5. **The content-addressed archive is presently inconsistent: index entries address files that the archive inventory does not contain.**

   - **Files:** `arquivo/indice.jsonl`, `arquivo/ficheiros.txt`, `arquivo/amostras/...`
   - Recomputed totals:
     - 148 index lines
     - 145 lines with bodies
     - 3 absence lines
     - 86 distinct URLs
     - 96 distinct non-null indexed raw SHA-256 values
     - 85 blob paths listed in `ficheiros.txt`
   - There are **12 indexed SHA-256 values absent from `ficheiros.txt`**, and one listed blob not referenced by the index.
   - Eleven missing blobs are the second INE responses. `corredor.py` indexes every 200 response’s raw SHA but calls `guardar()` only for `captura-nova` or `captura-primeira`:
     - **Quote:** `if classe in ("captura-nova", "captura-primeira")`
     - If the comparison digest is unchanged but the raw response differs, the new raw SHA is indexed without storing its bytes.
   - Correct compliant file count is **96 distinct raw blobs**, not 85.

6. **One sample capture proves a concrete wrong SHA in the index.**

   - **File:** `arquivo/indice.jsonl`, line 17
   - **Quote:** `"sha256": "14afc270190bfa09571649479d052f0c3c4c435ebd9d7268d6d681625e2f9a44"`
   - Recomputed SHA-256 of the supplied 112,990-byte sample:
     - `14afc270190b5a09571649479d052f0c3c4c435ebd9d7268d6d681625e2f9a44`
   - The indexed string contains `...190bfa...`; the actual hash and `ficheiros.txt` contain `...190b5a...`.
   - The other supplied sample is correct:
     - 3,993 bytes
     - `f6be7ba88ac3ebff31450697f5889f4fe974e1c9400029f099f2f779fb123f02`

7. **Production runs deliberately omit 304 conferences from the index.**

   - **File:** `motor/fonte/indicators/corredor.py`
   - **Quote:** `if classe != "conferido-304" or args.indexar_304:`
   - **Quote:** `p.add_argument("--indexar-304", action="store_true", ...)`
   - The workflow does not pass `--indexar-304`. The index contains **zero HTTP 304 lines**, although the reports claim 1 in run 1 and 24 in run 2.
   - FRESCURA requires a line for every conference, with no new file for a 304. The present index is silent for 25 reported conferences.
   - With those reported conferences included, the index would contain **173 lines**, not 148.
   - The prover hides the production defect by constructing test arguments with `indexar_304=True`.
   - `arquivo.medir()` would then wrongly count 304 lines as absences because it defines absence as `not l.get("sha256")`, rather than by HTTP/error state.

8. **The noon run overwrites the all-source public signal and the morning heartbeat with partial or even zero-target numbers.**

   - **File:** `motor/fonte/indicators/corredor.py`
   - **Quote:** `f"  enderecos: {relatorio['enderecos_pedidos']}"`
   - **Quote:** `f"  linhas: {relatorio['linhas_com_endereco']}"`
   - **File:** workflow
   - **Quote:** `--painel --concelhos --verboso`
   - The site state and heartbeat are written after every run. The noon workflow does not pass `--sem-carimbo-do-sitio`.
   - `enderecos` is the subset actually requested, but `linhas` is always the global 2,577 lines with addresses. A noon run can therefore publish a fresh time with, for example, zero requested addresses while claiming 2,577 lines.
   - This contradicts FRESCURA §3.5: the all-source morning run is what makes the site’s freshness statement true.
   - In this pilot, the noon run should not overwrite the all-source conference signal or morning dead-man heartbeat.

9. **The watchdog does not watch the morning run.**

   - **File:** `motor/fonte/.github/workflows/vigia.yml`
   - **Quote:** `--workflow corredor.yml ... --status success --limit 1`
   - It selects the latest successful run of any kind. A noon run or manually dispatched `ensaio` masks a missing morning run.
   - **Quote:** `if [ "${horas}" -gt 26 ]`
   - Because `horas` is integer-truncated and the test is `> 26`, an age just under 27 hours still passes.
   - The purported second path downloads the artifact from that same latest run. It is not independent.
   - **Quote:** `a corrida não deixou carimbo no artefacto; a leitura do registo é a que vale hoje`
   - A missing heartbeat explicitly succeeds.
   - `corredor.py` has another off-by-one:
     - **Quote:** `idade = (...).days`
     - **Quote:** `if idade > limite:`
     - With `MAX_AGE_DAYS = 2`, it fails only after three full days.
   - The watchdog must select the scheduled 06:10 run and fail on an absent, malformed or overdue heartbeat.

## Major

1. **The reported `14 de 14` workflow proof is stale and would reject the delivered workflow.**

   - **File:** `motor/fonte/indicators/provar_fluxo.py`
   - **Quote:** `len(empurram) == 3 and len(so_em_real) == 3`
   - **File:** `motor/relatorio-motor.md`
   - **Quote:** `` `python3 indicators/provar_fluxo.py` · 14 de 14 ``
   - Static inspection gives 2 of 3 guarded steps. The proof’s own first assertion would fail against `motor/fonte`.
   - I attempted to rerun it, but this read-only environment provides no writable temporary directory; it stopped before executing its assertions. That limitation does not change the static 2-of-3 result.

2. **Several “planted failure” claims test a different or weaker failure than the brief requires.**

   - **Byte-change plant**
     - **Report quote:** `um byte muda no ficheiro da fonte | captura nova, as duas versões no arquivo, 2 linhas por rever`
     - It tests archiving/classification only; it does not run the relevant reader. It therefore does not prove the brief’s byte-change-plus-reader/classification path.
   - **Broken-reader plant**
     - Site report quote: `a planta do leitor partido ... por fazer`
     - This required plant is absent.
   - **Dead-man plant**
     - **Report quote:** `o vigia falha alto (sem carimbo, e com um carimbo velho)`
     - It tests the local Python function, not a disabled/missed 06:10 workflow, the actual GitHub run selector, artifact absence or issue visibility.
   - **Zero-request plant**
     - **Report quote:** `nada devido e nada sem calendário (zero pedidos)`
     - It tests the calendar selector only, while the production command always launches the independently fetching panel reader.

3. **The “duplicate version refused” plant is a hash-collision test, not a duplicate-version test.**

   - **File:** `motor/fonte/indicators/arquivo.py`
   - **Quote:** `guardar duas vezes a mesma coisa é normal e silencioso`
   - **Quote:** `guardar(raiz, b"outros bytes\n", sha)`
   - The same content/version is accepted and deduplicated, correctly. The red plant supplies different bytes under a false preselected SHA.
   - **Report quote:** `uma versão já guardada, com outros bytes | recusado`
   - A content version cannot simultaneously have different bytes. The report misnames the property proved.

4. **The append-only test cannot detect an index rewritten before a fresh run.**

   - **File:** `motor/fonte/indicators/arquivo.py`
   - **Quote:** `antes = ler_indice(raiz) if antes is None else antes`
   - Production reads the current disk state as its baseline. If an old line was altered before the process started, the altered line becomes `antes` and passes as history.
   - The plant changes the proposed output while retaining a trusted in-memory baseline. It does not force the pre-run tampering scenario suggested by “uma linha do índice reescrita.”
   - The test later uses `escrever_indice(raiz, [l1], antes=[])` to replace a corrupted index, demonstrating that caller-supplied history can bypass the disk baseline.
   - `guardar()` also never verifies that `sha256(corpo) == sha`; it only checks path format and collisions.

5. **The archive vintage gate is not connected to the site build.**

   - **File:** site report
   - **Quote:** `não está ligada à construção do sítio`
   - FRESCURA rule 5 makes a missing referenced vintage a build failure. Here the function exists and has a local plant, but the actual build does not invoke it.
   - This is an unimplemented gate, not a proved archive rule.

6. **Weekly calendar refresh does not rewrite `calendar.json`.**

   - **File:** `motor/fonte/indicators/calendario.py`
   - **Quote:** `escreve as datas que encontrou, NUNCA por cima de indicators/calendar.json`
   - FRESCURA §3.5 explicitly requires the weekly run to rewrite `calendar.json`.
   - `corredor.py` only stores the refresh result in the report and writes the weekly marker. It writes that marker even when retrieval failed or found zero dates, suppressing retry for the rest of the week.
   - Correct behavior is an atomic, validated calendar update, with the marker written only after success.

7. **The report closes the machine-calendar question without evidence.**

   - **File:** `motor/relatorio-motor.md`
   - **Quote:** `os formatos de máquina não existem em nenhuma das duas páginas lidas`
   - Reading two rendered HTML responses and finding zero recognized dates proves only that those responses contained no dates matched by this parser. It does not prove that no machine feed or endpoint exists.
   - The correct conclusion is `[verify]`, as FRESCURA originally states.

8. **Conditional requests do not implement the required 429/503 backoff.**

   - **File:** `motor/fonte/core/http.py`
   - **Quote:** `backoff to walk when it answers 429 or 503`
   - **Quote:** `with self._gate(url), self._session.get(...)`
   - `condicional()` performs one request and returns. Unlike the ordinary download path, it never loops over `HOST_POLICY["backoff_s"]` or `retry_status`.
   - This contradicts both FRESCURA and the module’s own documentation.

9. **The dual digest normalizes more than the request timestamp and then fails to preserve the resulting raw versions.**

   - **File:** `motor/fonte/indicators/corredor.py`
   - **Quote:** `json.dumps(limpo, ensure_ascii=False, sort_keys=True, separators=(",", ":"))`
   - Sorting keys and canonicalizing separators/encoding removes differences in ordering and JSON representation in addition to `DataExtracao`.
   - That can classify representation changes as “same content.” This could be acceptable only if narrowly justified and every distinct raw response were still archived. The latter is currently false, producing the eleven missing INE blobs.

10. **A changed source left “for review” does not create the promised issue.**

   - **File:** workflow
   - **Quote:** `quando um portão fica vermelho OU quando a corrida encontrou alguma coisa que ficou por rever`
   - **Quote:** `if: failure()`
   - `corredor.py` normally returns 0 with non-empty `linhas_por_rever`. The reported second run had five such lines, so the issue step would not run.
   - The workflow needs an explicit output/condition for pending review.

11. **The site is pushed before the archive is committed, so archive failure can leave published claims without their evidence.**

   - **File:** workflow
   - **Quote:** `O commit e o push no sítio`
   - **Quote:** `O commit e o push no arquivo`
   - These steps run in that order. If the archive commit or push fails, the site has already been published.
   - This conflicts with “archive before read/publish” and the archive-as-gate model.

12. **The `ensaio` artifact omits the content-addressed bodies.**

   - **File:** workflow
   - **Quote:** `arquivo/indice.jsonl`
   - Only the index is uploaded; `arquivo/sha256/` is not. The comments say the ensaio archive “sobe como artefacto,” but the actual raw archive is discarded with the job.
   - A usable trial artifact must contain the index and referenced bodies.

13. **The motor report contains multiple recomputable false or internally inconsistent measurements.**

   - **Index size**
     - **Quote:** `linhas do índice | 152`
     - Correct current value: **148**. The nested copy `motor/fonte/indicators/PILOTO-CORREDOR-2026-09-01.md` correctly says 148.
   - **Run spacing**
     - **Quote:** `Duas corridas ... com cerca de uma hora entre elas`
     - Main index timestamps are approximately 18:11:31 and 18:15:18, a separation of about **3 minutes 47 seconds**, not one hour.
   - **Bodies**
     - **Quote:** `Os outros 55 mandaram corpo (54 corpos e uma ausência)`
     - The sentence contradicts itself: the reported values are **54 bodies plus one absence**, not 55 bodies. It also excludes the panel/concelho reader traffic.
   - **Per-server addresses**
     - **Quote:** `dos 91 source_url distintos`
     - The seven rows in the displayed server table sum to **88 addresses**: 16+3+5+11+37+3+13. Either three addresses are missing from the table or 91 is not the table’s total.

14. **The head signal explicitly rejects a governing acceptance requirement.**

   - **File:** `sitio/fonte/src/components/SinalDasFontes.astro`
   - **Quote:** `Não diz nem quantas linhas se conferiram nem quantos valores novos entraram, e isso é deliberado contra a letra do brief`
   - ORDEM and BRIEF require a real conference signal with numbers. A report-level voice argument cannot silently override the governing brief.
   - The component renders only `Fontes · <date>` or `Fontes em atraso · <date>`.

15. **The head claims a written timezone but displays none.**

   - **File:** `SinalDasFontes.astro`
   - **Quote:** `o sítio imprime a hora de Lisboa com o fuso escrito`
   - The formatter uses `timeZone: 'Europe/Lisbon'` internally, but the rendered text contains no `WEST`, `WET`, `Europe/Lisbon` or equivalent. Naming a timezone in code is not writing it for the reader.

16. **The “three dates” receipt is scaffolding without the missing publication date.**

   - **File:** site report
   - **Quote:** `Novo campo opcional, published_at`
   - **Quote:** `published_at escrito nas linhas: ver §2.4`
   - The same report acknowledges that no current line has the field. The motor never extracts or writes it. Therefore the package does not demonstrate a receipt containing all three required dates.
   - The claim that HTTP `Last-Modified` is publication time is also unsupported:
     - **File:** `sitio/fonte/ledger/README.md`
     - **Quote:** `quando é que o publicador o pôs lá`
   - `Last-Modified` describes the HTTP representation’s modification time; it is not generally evidence of dataset publication.

17. **New reader-visible strings bypass the mandatory voice inventory.**

   - **File:** site report
   - **Quote:** `a rota linha ... não é uma rota inventariada`
   - **Quote:** `check:voz passa com 706 frases distintas`
   - New strings include `Fontes`, `Fontes em atraso`, `Publicado pela fonte a`, and `Sem resposta desde`. The report explains why the gate misses them, but ORDEM requires every new string to enter the voice inventory.
   - A passing gate with a known coverage hole is not compliance.

18. **The crossing gate proves an allowed author label, not that a program authored the change.**

   - **File:** `sitio/fonte/scripts/check-cruzamento.mjs`
   - **Quote:** `const AUTORES_DE_MAQUINA = new Set([... 'corredor-diario'])`
   - **Quote:** `uma reconferência com autor escrito à mão`
   - The red plant uses `by: 'o-nuno'`. A hand edit using `by: 'corredor-diario'` passes because authorship is inferred solely from a self-declared string.
   - The claimed property “only a program can append” is therefore unsupported.

## Minor

1. **The seed order does not match “the seven captures are the first lines.”**

   - **File:** `motor/fonte/indicators/semear_arquivo.py`
   - **Quote:** `as sete capturas ... como primeiras linhas do índice`
   - The seeder appends the retroactive 403 first, then interleaves each current request with its retroactive line. In the actual index the seven retroactive captures are at lines 3, 5, 7, 9, 11, 13 and 15, not the first seven lines.

2. **The example and reported head time are wrong.**

   - **File:** `SinalDasFontes.astro`
   - **Quote:** `Fontes · 01.09.2026 19:22`
   - **File:** `sitio/fonte/src/data/fontes.mjs`
   - **Quote:** `conferidoEm: '2026-09-01T18:15:18+00:00'`
   - On 1 September Lisbon is UTC+1, so the corresponding time is **19:15**, not 19:22.
   - Running the exact formatter locally produced `01/09/2026, 19:15`, then `01/09/2026 19:15` after the replacement. It does not produce the documented dotted `01.09.2026`.

3. **The stale marker activates a day later than its declared two-day limit.**

   - **File:** `sitio/fonte/src/lib/prova.mjs`
   - **Quote:** `PRAZO_DAS_FONTES_DIAS = 2`
   - **Quote:** `vencida: dias > PRAZO_DAS_FONTES_DIAS`
   - It becomes stale on day 3. If the intended maximum is two days, the comparison must turn true at two days.
   - More importantly, this is statically rendered. If the daily runner stops and no deployment occurs, the displayed stale state never changes at all.

4. **`published_at` validates shape, not an actual calendar date.**

   - **File:** `sitio/fonte/src/lib/ledger.mjs`
   - **Quote:** `if (!/^\d{4}-\d{2}-\d{2}$/.test(v))`
   - Values such as `2026-02-31` satisfy the regex and can pass the subsequent lexical checks.

5. **The requested site report path does not exist.**

   - **Requested:** `sitio/relatorio-sitio.md`
   - The supplied report is `sitio/fonte/design/especime-v3/medicoes/corredor-construtor.md`. This is a packaging/documentation mismatch.

6. **The claims sample carries a misleading writer comment.**

   - **File:** `sitio/claims-amostra.diff`
   - **Quote:** `# Reconferências. Escritas por indicators/refresh.py, nunca à mão.`
   - The sample contains this newly added comment 26 times, while the entries say `by: corredor-diario`. The daily runner is `corredor.py`, even if it calls a helper imported from `refresh.py`.

7. **`tamanhos.txt` mixes an unlabeled filesystem-allocation measurement with logical byte totals.**

   - **File:** `arquivo/tamanhos.txt`
   - **Quote:** `185784 ./sha256`
   - This appears to be a `du`-style allocation count, not a byte count. The report’s `190 071 557` is a different logical-size measure. The units and derivation need to be explicit.

## Notes

- The mass `ledger/claims` reconference is **within the stated functional scope**. FRESCURA step 5 requires writing verification entries for confirmed lines, and the supplied sample changes verification history rather than published values. However, only 27 file diffs/400 lines are supplied, so the report’s full-branch claims of 2,572 files and 17,845 insertions cannot be independently verified from this package.

- Absences are not silent in the supplied index. I found exactly **three** absence lines: one HTTP 403 and two entries with null HTTP/error outcomes. IDs are unique, JSON keys are consistent, redirect fields are arrays, and the observable `sha256_anterior` chains are internally consistent. The missing conference records are the 304s, not the three failures.

- All five action uses are syntactically pinned to 40-character lowercase hexadecimal commit IDs, representing four distinct action references. With no network, I could not verify that the adjacent version comments correspond to those commits. Declared permissions are proportionate:
  - runner: `contents: read`, `issues: write`
  - watchdog: `contents: read`, `actions: read`, `issues: write`

- I found no command that directly prints `CHAVE_SITIO` or `CHAVE_ARQUIVO`. The secret defect is the unguarded ensaio push’s dependency on `~/.ssh/sitio`, not an observed secret disclosure.

- `verify:deploy`’s “never more than one request per minute” behavior cannot be established from this folder. The workflow only proves `sleep 120` before delegating to an absent package script.

- Claims that require the complete repositories or GitHub state remain unverified: successful build/typecheck/verification totals, 706 voice strings, 2,850 crossing records, branch protection, repository visibility, successful deployments, issue creation, commit hashes, and whether any push occurred.

- Checks performed:
  - Read `LEIA-PRIMEIRO.md` first, then only files in this folder; no network was used.
  - Inventoried all files, including hidden workflow files.
  - Read the specified governing sections, all supplied source copies, workflows, reports, patches and samples.
  - Parsed all 148 JSONL records and recomputed status, URL, ID and SHA counts.
  - Compared every indexed SHA against `arquivo/ficheiros.txt`.
  - Recomputed both supplied sample SHA-256 digests and byte sizes.
  - Compared the outer and nested motor reports.
  - Reconstructed added files from both patches in memory and compared them with the supplied source copies.
  - Statically parsed the supplied Python and YAML and syntax-checked the modified JavaScript modules.
  - Inspected action pins, permissions, guards, step ordering, heartbeat selection and artifact paths.
  - No files were changed.