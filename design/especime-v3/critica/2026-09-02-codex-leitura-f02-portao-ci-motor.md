# Leitura a frio do Codex ao bloco F0.2 (o portão do motor reprodutível e em CI), 02.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, 06:50 a 07:03 UTC, sobre um pacote com cinco plantas de três classes (5 de 5 vistas; o registo está no `.plantas.json` ao lado): P1a e P1b, uma `OEDP_SITE` que não é um sítio a cair em silêncio na árvore principal contra a docstring da própria função, na cópia do módulo e na linha do diff, apanhada no Blocking 2; P2a e P2b, a matriz do fluxo sem o Python 3.14, apanhada no Blocking 1; P3, 94 ficheiros na cópia onde a listagem tem 104, apanhada no Minor 1. Triagem do lugar de direção: o Blocking 3 e os Major 2, 3, 4, 6, 7, 8, 9 e 11 são reais e consertam-se na segunda passagem, com os Minor 2 a 7; o Major 1 e o Major 5 são o desenho (a CI prova a cópia; o portátil prova a cópia e o sítio vivo; os dois documentos alojados entram como marcas) e ficam ditos no relatório, com a passagem dupla das outras três suites como bloco pequeno a seguir; o Major 10 é em parte o F0.7 (o lock das dependências) e em parte conserta-se já (o runner preso); o Major 12 é do pacote (o `ORIGEM.md` ficou fora por engano do lugar de direção), não da obra. O texto do leitor fica como veio.*

---

## Blocking

1. **The workflow tests only Python 3.12.** Its commentary requires both 3.12 and 3.14, but the matrix contains only `["3.12"]`. Therefore the reported 3.14 GitHub jobs cannot have been produced by the supplied workflow. The same one-version matrix is in the patch. `portao.yml:19-21`, `portao.yml:66-70`, `relatorio-construtor.md:205`, `relatorio-construtor.md:242-243`, `diff.patch:75`

2. **`OEDP_SITE` precedence is implemented contrary to the report and docstring.** An invalid explicit path is supposed to yield no live site, but `sitio_vivo()` falls through to the home tree when that tree exists. Consequently case 29 must fail on the reported development machine, because that machine has the home site, yet the report claims both passes were green there. The defect exists in both the copied file and the patch. `sitio.py:86-94`, `diff.patch:235-246`, `export_site_rows_test.py:1835-1844`, `relatorio-construtor.md:51-65`, `relatorio-construtor.md:155-160`

3. **Regeneration can destroy the last good fixture and then fail.** `Fail` claims “Nada foi escrito”, but `montar()` deletes both destinations and starts copying claims before validating the four auxiliary site files, documents, or snippet caches. A later `Fail`, JSON error, I/O error, or interruption leaves a missing or partial fixture. `refrescar_site_min.py:82-83`, `refrescar_site_min.py:162-182`, `refrescar_site_min.py:184-210`, `refrescar_site_min.py:227-245`, `refrescar_site_min.py:423-428`

## Major

1. **CI is green while proving strictly less than the local gate.** With no live site, the second exporter pass is skipped and exit status is solely the fixture result. The other three formerly site-dependent surfaces are merely retargeted to `por_omissao()`; the patch adds no equivalent dual live/fixture pass for them. The report itself concedes that CI can test an old photograph indefinitely. `export_site_rows_test.py:1924-1929`, `diff.patch:798-804`, `diff.patch:820-827`, `diff.patch:868-875`, `diff.patch:2276-2285`, `relatorio-construtor.md:463-464`

2. **`--conferir` proves only self-consistency, not provenance or freshness.** It hashes the current fixture and compares that hash with a mutable value in `ORIGEM.md`; it never compares against the recorded site commit or a live tree. A stale fixture remains green, and a fixture plus manually updated digest is also green. `refrescar_site_min.py:275-292`, `refrescar_site_min.py:378-403`, `diff.patch:1429-1442`, `relatorio-construtor.md:231`

3. **The purported live crop pass can actually test only fixture crops.** If even one of the three local caches is absent, the code selects `CONTEUDO_VERSIONADO` for the whole pass, including caches that do exist locally, then reports `corrida("o sítio vivo")`. This downgrade is announced, but the final PASS label overstates what was live and can hide drift in existing local caches. `export_site_rows_test.py:1931-1949`, `relatorio-construtor.md:179-189`

4. **An explicit `OEDP_SITE` pointing at the fixture produces two passes over the same fixture.** The fixture satisfies `e_um_sitio()`, so it becomes `vivo`; `main()` first runs it as the versioned copy and then reruns the identical path under the result label “o sítio vivo”. `sitio.py:64-68`, `sitio.py:83-94`, `export_site_rows_test.py:1916-1922`, `export_site_rows_test.py:1930-1949`

5. **A11 is weaker in CI because real documents are replaced by existence markers.** The supplied files are 458 and 457 bytes, while the recorded originals are 960,913 and 1,059,969 bytes. Because A11 only calls `exists()`, CI proves neither document content nor the continued existence of those real files. `fixture-listagem.txt:100-101`, `diff.patch:1451-1454`, `refrescar_site_min.py:194-225`

6. **“Site” validation is too weak for safe resolution.** Any directory containing an empty `ledger/claims` directory is accepted as a site; no required files, ledger contents, repository identity, or site schema are checked. The exporter’s own pointer repeats the same single-directory test. `sitio.py:32-34`, `sitio.py:64-68`, `diff.patch:946-970`

7. **The advertised write and worktree safety is not a global invariant.** The worktree guard rejects only one resolved hard-coded home path, not the actual branch or repository identity. `e_a_copia_versionada()` is merely an optional predicate: the patch applies it to `export_site_rows`, while also redirecting `export_records_site`, described by the gate as a site-writing exporter, to the fixture-capable default without showing an equivalent guard. `diff.patch:1004-1015`, `sitio.py:108-115`, `diff.patch:1102-1109`, `diff.patch:887-896`, `gate.py:117-125`

8. **The refresher can produce a much lighter crop copy and return 0 without treating it as a regression.** It requires only that each expected cache path exist; it never requires every named `rh_id` to occur in either `snippets` or `skipped`. An existing empty or truncated JSON file therefore yields a smaller generated file and a successful aggregate summary. `refrescar_site_min.py:227-269`, `refrescar_site_min.py:429-434`

9. **The refresher accepts unverified or dirty origins.** A non-Git directory can qualify through `ledger/claims`; failed Git commands become the literal text `[a verificar]`, and a dirty source is recorded but not refused. The generated fixture can therefore claim success without a verifiable source commit. `refrescar_site_min.py:295-305`, `refrescar_site_min.py:319-323`, `refrescar_site_min.py:405-425`

10. **Installation is not reproducible, and the no-source-network rule is not enforced.** `ubuntu-latest`, Python `3.12`, Node `22`, upgraded `pip`, and an unlocked `requirements.txt` all float. The workflow has unrestricted egress and no offline assertion, so this package cannot prove that the 24 suites avoid official-source requests; `requirements.txt` and 23 suite implementations are not supplied. `portao.yml:64-69`, `portao.yml:86-95`, `portao.yml:100-115`, `relatorio-construtor.md:467-468`, `LEIA-ME.md:3`

11. **The known-positive claim is not established.** The gate accepts any module returning zero and checks no output, check count, or planted-red evidence, so an empty/no-op suite is green. Of the included additions, case 28 only compares two current lists rather than planting a defect, and case 29 checks the helper’s self-recognition but never exercises the claimed `--write` refusal. The other 23 suites are unavailable for review. `gate.py:217-222`, `export_site_rows_test.py:1816-1827`, `export_site_rows_test.py:1829-1850`, `LEIA-ME.md:3`

12. **The package is incomplete.** `LEIA-ME.md` says it contains `ORIGEM.md`, but no standalone `ORIGEM.md` exists; only its proposed contents inside `diff.patch` can be reviewed, so its copied-file consistency cannot be checked. `LEIA-ME.md:3`, `diff.patch:1414-1419`

## Minor

1. **The standalone report was altered away from the patch and its own arithmetic.** It says 94 fixture files; the patch’s report says 104, its command output says 104, and the structure is 95 claims, four other site files, two markers, and three crop-cache files: 104. `relatorio-construtor.md:114-129`, `diff.patch:408-420`, `diff.patch:1439-1442`, `fixture-listagem.txt:1-101`

2. **The refresher’s comment has stale document counts and bytes.** It says three documents totalling 2.9 MB; the generated origin and listing contain two originals totalling 2,020,882 bytes and two markers. `refrescar_site_min.py:194-203`, `diff.patch:1451-1454`, `fixture-listagem.txt:100-101`

3. **The two-pass exit-code and control-flow descriptions are false.** The docstring says exit codes are summed, but the code uses bitwise OR, so two ordinary failures yield 1 rather than 2. The report says a red first pass prevents the second, while the driver continues after a normal nonzero return and stops only if an exception escapes. `export_site_rows_test.py:1906-1909`, `export_site_rows_test.py:1921-1949`, `relatorio-construtor.md:346`

4. **`gate.py` still documents thirteen known-positive suites while registering 24.** `gate.py:12-15`, `gate.py:50-158`

5. **The included suite’s top docstring is not exact.** It says every check plants one defect and nothing is written to disk, but several counted checks are positive paths, and case 23 writes two temporary files inside the repository before deleting them. `export_site_rows_test.py:3-13`, `export_site_rows_test.py:682-723`, `export_site_rows_test.py:1221-1227`

6. **The source comment names the wrong test case.** `ESTUDOS_COM_RECORTES` says its list is guarded by case 26; the supplied suite calls it case 28. `diff.patch:1038-1045`, `export_site_rows_test.py:1816-1820`

7. **The crop subset is not byte-for-byte “verbatim”.** The live-pass commentary calls it verbatim, but regeneration parses the source JSON, filters it, sorts keys, and serializes it with a new format. The retained values may be unchanged; the file bytes are not. `export_site_rows_test.py:1933-1936`, `refrescar_site_min.py:158-159`, `refrescar_site_min.py:248-261`

## «What is fine»

- All three action references are full 40-hex commit SHAs; permissions are read-only, `fail-fast` is disabled, and both push and pull-request triggers exist. `portao.yml:49-60`, `portao.yml:66-67`, `portao.yml:72-89`
- Absence of the live site is explicitly printed rather than silently presented as a live success. `export_site_rows_test.py:1924-1929`
- Fixture crops contain actual base64 WebP data, and the positive path requires 22 non-empty RIFF/WebP crops within the byte limit. `diff.patch:1502-1509`, `export_site_rows_test.py:1221-1246`
- The specific `export_site_rows --write` guard against the versioned fixture exists and returns 1. `diff.patch:1097-1109`

**Distinct findings: 22.**