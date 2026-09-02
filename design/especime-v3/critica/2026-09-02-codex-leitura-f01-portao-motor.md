# Leitura a frio do Codex ao bloco F0.1 (o portão do motor verde), 02.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, 05:12 a 05:21 UTC, sobre um pacote com três plantas (3 de 3 vistas; o registo está no `.plantas.json` ao lado): P1, um número errado no relatório («83 checks» onde o teste imprime 93), apanhada no achado 10; P2a e P2b, o guarda dos autores desconhecidos desligado (`raise Fail` trocado por `report.append`) na cópia do ficheiro e na linha do diff, apanhada no achado 1 e, por consequência, no achado 2 (os dois achados são da planta, não da obra). Triagem do lugar de direção: os achados 3, 4, 9, 10, 11, 12 e 13 são reais e consertam-se na segunda passagem; o 5 é de palavras (o bloco reescreve-se campo a campo, não byte a byte); os 6, 7 e 8 são limites da forma actual (dois escritores no mesmo bloco) e ficam registados para o bloco F2.7, a separação de propriedade. Sem travessões na prosa desta cabeça; o texto do leitor fica como veio.*

---

## Blocking

1. **Unknown authors no longer stop the export.** The old code raised `Fail`; the replacement merely appends the same text to `report` and continues. `main()` therefore reaches dry-run `return 0`, or writes the reconstructed YAML with the unknown reading omitted under `--write`. This directly contradicts “the refusal for every OTHER author is unchanged.” [diff.patch:366-378](diff.patch:366), [export_site_rows.py:1285-1298](export_site_rows.py:1285), [export_site_rows.py:2513-2520](export_site_rows.py:2513), [export_site_rows.py:2654-2662](export_site_rows.py:2654), [relatorio-construtor.md:85](relatorio-construtor.md:85).

2. **The claimed green runs cannot have come from the supplied code.** `_run()` reports success whenever `build_rows()` does not raise; case 24d then necessarily records a failure because the unknown-author branch does not raise, and the test exits 1 when any failure exists. The report instead claims test `EXIT=0`, all 24 gate suites green, and gate `EXIT=0`. [export_site_rows_test.py:57-63](export_site_rows_test.py:57), [export_site_rows_test.py:863-874](export_site_rows_test.py:863), [export_site_rows_test.py:1607-1612](export_site_rows_test.py:1607), [relatorio-construtor.md:179-194](relatorio-construtor.md:179).

   The reported mutation totals also do not fit this baseline defect:

   - Removing house carry-forward produces the six stated 24e failures **plus** 24d, so at least 7, not 6. [export_site_rows_test.py:893-907](export_site_rows_test.py:893), [relatorio-construtor.md:110-121](relatorio-construtor.md:110).
   - Renaming `painel-semanal` produces the 24g failure plus 24d, so at least 2, not 1. [export_site_rows_test.py:956-967](export_site_rows_test.py:956), [relatorio-construtor.md:149-158](relatorio-construtor.md:149).
   - Removing preserved-entry validation produces four 24f failures plus 24d, so at least 5, not 4. [export_site_rows_test.py:918-941](export_site_rows_test.py:918), [relatorio-construtor.md:165-175](relatorio-construtor.md:165).
   - Adding `mao-alheia` still gives the reported 2, but one of those failures already exists without the mutation, so it is not a clean red/green known-positive. [export_site_rows_test.py:869-872](export_site_rows_test.py:869), [export_site_rows_test.py:959-967](export_site_rows_test.py:959).

3. **A malformed house reading with `result: diverge` and no `found` is accepted and written.** The validator permits `found` for divergence but never requires it; the renderer then emits no `found`. The supplied `refresh.py` explicitly demonstrates that the site rejects this exact shape. [export_site_rows.py:1238-1253](export_site_rows.py:1238), [export_site_rows.py:1334-1337](export_site_rows.py:1334), [refresh.py:869-905](refresh.py:869).

## Major

4. **De-duplication can silently delete or rewrite evidence.** The identity check happens before author and shape validation. Two disk entries sharing `(date, path, by)` retain only the first, even if their `result` or `found` differs; the second is neither checked nor reported. A disk entry colliding with a map-produced identity is replaced by the current map result; that latter behaviour already existed before this change, but the new house-reader duplicate-loss path did not. [export_site_rows.py:1283-1292](export_site_rows.py:1283), [export_site_rows.py:1205-1217](export_site_rows.py:1205), [diff.patch:366-378](diff.patch:366).

5. **“Verbatim” is false.** Entries are parsed through YAML, copied as dictionaries, sorted, and rendered in a fixed field order with fresh quoting. Field values usually survive, but comments, scalar style, quoting, ordering and duplicate representation do not. [export_site_rows.py:808-816](export_site_rows.py:808), [export_site_rows.py:1289-1292](export_site_rows.py:1289), [export_site_rows.py:1324-1338](export_site_rows.py:1324), [relatorio-construtor.md:85](relatorio-construtor.md:85).

6. **The guard is strictly weaker by design for any entry carrying an allowed label.** There is no proof that `painel-semanal` or `corredor-diario` wrote it; membership of `by` is the entire authorization check. The report itself admits that a manual edit with that label passes, contradicting “not weakened in a single case.” [export_site_rows.py:1070](export_site_rows.py:1070), [export_site_rows.py:1289-1294](export_site_rows.py:1289), [relatorio-construtor.md:85](relatorio-construtor.md:85), [relatorio-construtor.md:255](relatorio-construtor.md:255).

7. **There is a lost-update race.** The exporter reads readings while building rows and writes the files much later; both automated readers independently perform raw read-modify-write. A reading appended after the exporter’s read but before its write is erased without the guard ever seeing it. [export_site_rows.py:1282-1285](export_site_rows.py:1282), [export_site_rows.py:2660-2662](export_site_rows.py:2660), [refresh.py:497-520](refresh.py:497), [refresh.py:544-545](refresh.py:544), [corredor.py:433-439](corredor.py:433).

8. **The other writers deliberately erase readings from site rows, without filtering by author.** When appending, `refresh.append_verification()` prunes the oldest entries until the total is four; this can remove map-produced or third-party entries as well as house entries. The archive may retain history, but the reading on disk is still dropped. [refresh.py:410-426](refresh.py:410), [refresh.py:515-520](refresh.py:515), [relatorio-construtor.md:256](relatorio-construtor.md:256).

9. **The known-positives are incomplete.**

   - **24e:** real for one parsed `corredor-diario` entry; removing carry-forward fails membership, YAML fragments and count. It cannot pass while checking literally nothing, but it does not test raw verbatim preservation, duplicate input or `painel-semanal`. [export_site_rows_test.py:885-907](export_site_rows_test.py:885).
   - **24d:** it would detect successful acceptance of an unknown author, but it can pass for the wrong reason because it accepts any failure containing “that this run does not produce”; the crop guard uses the same text. [export_site_rows_test.py:869-874](export_site_rows_test.py:869), [export_site_rows.py:1591-1595](export_site_rows.py:1591).
   - **24g:** real for exact constants and set membership, but it checks no disk reading and no preservation behaviour; code that preserves only the corridor while leaving both constants unchanged passes. [export_site_rows_test.py:943-967](export_site_rows_test.py:943).
   - **24f:** real for its four precise malformed forms and unlikely to pass through an unrelated error because it requires specific messages, but it omits the site-rejected `diverge` without `found`. [export_site_rows_test.py:918-941](export_site_rows_test.py:918), [refresh.py:889-905](refresh.py:889).
   - **Moved guard:** no known-positive exercises a no-map crossing with a reading on disk. Case 23 is the only no-map-like path and explicitly stubs the disk empty; 24d–24f use the Évora setup. [export_site_rows_test.py:648-666](export_site_rows_test.py:648), [export_site_rows_test.py:729-739](export_site_rows_test.py:729).

## Minor

10. **The package disagrees about what changed and about the check count.** The report says only two files changed and later says `git status` showed only those two, but `diff.patch` adds the report itself as a third file. The standalone report prints “83 checks” while its next paragraph says 93 and the report embedded in the diff says 93. [relatorio-construtor.md:62](relatorio-construtor.md:62), [relatorio-construtor.md:183-194](relatorio-construtor.md:183), [relatorio-construtor.md:215](relatorio-construtor.md:215), [diff.patch:1-6](diff.patch:1), [diff.patch:185-200](diff.patch:185).

11. **The live row counts are not auditable from this package.** The package explicitly contains neither site nor repository data; the supplied script is only a recipe. Also, 96 readings over 32 rows establishes an average of three, not “three in each row” without a per-row distribution check. [LEIA-ME.md:3](LEIA-ME.md:3), [relatorio-construtor.md:41-53](relatorio-construtor.md:41), [relatorio-construtor.md:219-236](relatorio-construtor.md:219).

12. **A non-mapping element inside `verifications` produces an uncaught Python exception, not a controlled refusal.** The reader blindly calls `dict(e)` for every list member, while `main()` catches only `Fail`. It should still avoid writing, but the stated diagnostic guard is absent for this malformed shape. [export_site_rows.py:808-816](export_site_rows.py:808), [export_site_rows.py:2513-2520](export_site_rows.py:2513).

13. **The guard’s name drifts between V10 and V12.** The exporter defines re-check protection as V12, while the test describes the same guard as “the V10 argument”; V10 in the exporter is correction preservation. [export_site_rows.py:59-64](export_site_rows.py:59), [export_site_rows.py:104-114](export_site_rows.py:104), [export_site_rows_test.py:849-853](export_site_rows_test.py:849).

**What is fine**

- The two configured strings do come directly from the two writer modules and currently equal `painel-semanal` and `corredor-diario`. [export_site_rows.py:178-179](export_site_rows.py:178), [refresh.py:407-408](refresh.py:407), [corredor.py:73-74](corredor.py:73).
- Structurally, the house-reading pass is now called after the optional map pass, including when no map exists. [export_site_rows.py:1151-1154](export_site_rows.py:1151), [export_site_rows.py:1316-1321](export_site_rows.py:1316).
- The changed code shown in the diff is present in the full exporter and test copies; the material package mismatch is in the report copy and claimed results, not the code post-images. [diff.patch:276-498](diff.patch:276), [export_site_rows.py:1229-1321](export_site_rows.py:1229), [export_site_rows_test.py:849-967](export_site_rows_test.py:849).

**13 distinct findings.**