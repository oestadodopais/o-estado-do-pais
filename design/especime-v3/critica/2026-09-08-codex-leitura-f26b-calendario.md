# Leitura a frio do Codex ao bloco F2.6b do motor (os acontecimentos do calendário sem linhas), 08.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, 16:02 a 16:20 UTC de 08.09.2026, 246 758 símbolos, sobre um pacote montado por `scripts/leituras/pacote.sh` (o brief tal como foi dado, o relatório, o diff `483c9ea..a0aef16`, os ficheiros mudados incluindo a cópia versionada do sítio refrescada) com cinco plantas de três classes (5 de 5 vistas; o registo está no `.plantas.json` ao lado): K1, o `continue` da guarda da agenda tirado, apanhada no Blocking 1; K2, a linha `evora-divida-dgal-2014` tirada do calendário, apanhada no Blocking 2; K3, o chão a 23, apanhado no Major 6; K5, a data de saída plantada, apanhada no Major 5; K4, as «3 presas», apanhadas no Minor 14. Triagem do lugar de direção: reais e para a segunda passagem (ramo `calendario-b-2026-09-08`, Claude Opus 5, no mesmo dia): o Blocking 3 (as linhas dos vigias são edições antigas que um ficheiro novo não move: passam a ser as do último período publicado por endereço, e a etiqueta do sítio passa a «Linhas a que isto diz respeito», pedida ao construtor do F1.10), o Major 4 (o provador com uma lista fixa no lugar do invariante), a parte real do Major 5 (`decidido_em` e `saiu_em` escrito no dia da saída), o Major 7 (uma contagem à mão numa nota), o Major 8 (o cabeçalho «escrito à mão» e a idempotência por `json.load`), o Major 9 (as notas rendidas a falar da maquinaria da casa), o Major 12 (as saídas sem id ou repetidas apagadas em silêncio), o Minor 13 (o representante antigo a ficar ao lado do novo), e os Major 10 e 11 e o Minor 15 (o que o pacote não reproduz, os números sem comando, a descrição do refresco). Os 16 a 20 confirmam as contagens, a guarda dos vigias sem resolução, a exclusão dos sem data do dia, as notas nas duas línguas e os valores intactos do refresco.*

---

## Blocking

1. **The copied writer removes every decided event even when the agenda names it.** The `presos` branch records the event but does not continue, so execution immediately declares the exit and removes the event. The diff contains the missing `continue`, proving that the copied source and diff disagree. The writer’s own planted test would detect this, so the reported green `--provar` run cannot have come from the copied file.  
indicators/calendario.py:1484, indicators/calendario.py:1486, indicators/calendario.py:1488, indicators/calendario.py:1494, diff.patch:294, diff.patch:298, indicators/calendario.py:2244, indicators/calendario.py:2247

2. **The delivered calendar omits `evora-divida-dgal-2014`, contradicting the diff, the public note, and the reported total.** The diff adds four DGAL representatives, but the copied array contains only three and a blank line where this ID should be. Consequently the delivered file names 42 rows overall, not the reported 43, while its note still says four addresses. A second writer run against the claimed ledger would add this row, so the reported `linhas_novas 0` and byte-identical rerun are also incompatible with the delivered file.  
indicators/calendar.json:309, indicators/calendar.json:311, indicators/calendar.json:313, indicators/calendar.json:327, diff.patch:10, diff.patch:12, relatorio-construtor.md:16, relatorio-construtor.md:29, relatorio-construtor.md:211

3. **The new `afecta_linhas` values do not identify rows that these events move.** The DGAL event concerns the future 2025 file, while its representatives cite the 2014, 2017, 2021 and 2024 editions; its own note explicitly says the new file does not move published rows. The IEFP note likewise says a new monthly file does not move published months, yet it names old monthly rows. Because the agenda labels this field “Rows this moves,” using historical representatives merely satisfies the non-empty-field rule while publishing a false relationship.  
indicators/calendar.json:302, indicators/calendar.json:327, indicators/calendar.json:409, indicators/calendar.json:417, indicators/calendar.json:433, publisher/fixtures/site-min/ledger/claims/evora-divida-dgal-2014.yml:16, publisher/fixtures/site-min/ledger/claims/evora-divida-dgal-2017.yml:16, publisher/fixtures/site-min/ledger/claims/evora-desemprego-registado-2013.yml:16, relatorio-construtor.md:169

## Major

4. **The prover replaces the brief’s zero-rowless-event invariant with a permanent six-ID exemption list.** The brief requires zero events without `afecta_linhas`, but the delivered calendar still has six. The test subtracts a hard-coded allowlist and therefore passes all six rather than verifying that the five exits are genuinely agenda-held and the sixth has an authorised disposition. Its plant proves only that a seventh, unfamiliar ID is rejected, while the empty `saidas` loop is vacuously green.  
brief.md:5, indicators/calendario.py:2355, indicators/calendario.py:2374, indicators/calendario.py:2382, indicators/calendario.py:2387, indicators/calendario.py:2401, indicators/calendario.py:2423, indicators/calendar.json:519

5. **The exit dates are wrong both in the copied source and in the delayed-exit design, and the tests do not catch either defect.** `evora-contas-2024-pagina` is dated `2026-08-09` in the copied source, whereas the diff and report say `2026-09-08`. The table test checks only that every date parses, and the exact-date assertion checks only the first housing exit, so this valid but false date passes. Even the intended fixed constants would be written unchanged when agenda references disappear later, despite `saiu_em` being documented as the day the event actually left.  
indicators/calendario.py:1319, diff.patch:129, relatorio-construtor.md:19, indicators/calendario.py:2220, indicators/calendario.py:2228, indicators/calendario.py:2271, publisher/README.md:621, indicators/calendario.py:1289, indicators/calendario.py:1492

6. **The copied aggregate gate still sets the calendar floor to 23, not 32, making the report’s pasted output impossible and allowing all nine new checks to disappear.** The surrounding comment says the floor rose to 32, but the actual tuple remains 23 while the total floor is 192. With the report’s other observed counts, a calendar prover reduced to 23 would still total 198 and pass the aggregate floor. The aggregate prints the tuple’s floor, so it could not have printed the reported `chão 32` from this file.  
indicators/provas_test.py:121, indicators/provas_test.py:135, indicators/provas_test.py:194, indicators/provas_test.py:200, indicators/provas_test.py:210, indicators/provas_test.py:278, indicators/provas_test.py:288, relatorio-construtor.md:288, relatorio-construtor.md:294, diff.patch:740

7. **The regional-accounts note publishes “seven” `pib-pc-*` rows while the report says there are eleven.** Both language editions retain the seven-row statement. The package contains no copied `pib-pc-*` rows with which to decide which count is correct, but the contradiction itself is conclusive. The reader-facing calendar therefore contains a number the builder’s own report says is stale.  
indicators/calendar.json:460, indicators/calendar.json:461, indicators/calendar.json:462, relatorio-construtor.md:153, relatorio-construtor.md:156

8. **The claim that `calendar.json` was writer-produced and byte-idempotent is not established and is contradicted by the delivered artefacts.** The file identifies itself as “written by hand,” and its missing DGAL row cannot be emitted by the shown diff or current resolver. The report claims byte equality but says it measured only `json.load(...) == json.load(...)`, which cannot establish byte equality. No before/after files or hashes accompany that claim.  
indicators/calendar.json:3, indicators/calendar.json:309, indicators/calendar.json:311, indicators/calendario.py:1412, indicators/calendario.py:1418, relatorio-construtor.md:47, relatorio-construtor.md:211, relatorio-construtor.md:216

9. **The new reader-facing notes talk about the house’s internal machinery.** The calendar is explicitly exported for rendering, yet its new notes mention the raw study register, ledger rows, request addresses, the midday run, and internal block name `F1.5`. The Évora exit reason is also not merely copied from the brief: it adds “every day,” an internal verdict name, and address/row implementation language.  
publisher/README.md:690, indicators/calendar.json:327, indicators/calendar.json:328, indicators/calendar.json:433, indicators/calendar.json:434, indicators/calendario.py:1297, indicators/calendario.py:1321, brief.md:5, relatorio-construtor.md:50

10. **The central agenda dependency, validator result, HTML behaviour, bilingual rendering, and no-script fallback are unproven because their evidence is absent from the package.** The report asserts three live agenda items, five A8 errors and unresolved HTML marks, but neither `agenda/agenda.json`, `publisher/export_agenda.py`, `scripts/gate-html.mjs` nor the built pages is supplied. The reported 46-check fixture/live-site passes and `core.gate` pass likewise depend on omitted code and the absent live site. The pasted output is therefore a claim that cannot be reproduced here.  
relatorio-construtor.md:82, relatorio-construtor.md:94, relatorio-construtor.md:126, relatorio-construtor.md:169, relatorio-construtor.md:297, relatorio-construtor.md:308, publisher/README.md:690

11. **The reported 622, 280, eleven-row/two-address and 71-commit measurements are not reproducible from this package.** The first three measurements are said to come from the full live ledger, while the supplied fixture provenance describes only a 99-row slice and contains no `pib-pc-*` files. The two commit hashes are shown, but no repository graph is present from which 71 commits can be counted. These unshown totals are nevertheless written into rendered calendar notes.  
relatorio-construtor.md:16, relatorio-construtor.md:17, relatorio-construtor.md:156, relatorio-construtor.md:158, relatorio-construtor.md:195, publisher/fixtures/ORIGEM.md:21, indicators/calendar.json:327, indicators/calendar.json:433

12. **`aplicar_saidas` can silently erase existing exit history despite promising never to do so.** It rebuilds the prior list as a dictionary, dropping every entry without a truthy ID and collapsing duplicate IDs to one entry. Its preservation test supplies only one valid, unique exit, so neither destructive case bites. This is a silent sanitisation before the rewritten calendar is validated.  
indicators/calendario.py:1476, indicators/calendario.py:1482, indicators/calendario.py:2281, indicators/calendario.py:2283, indicators/calendario.py:2286

## Minor

13. **The writer does not preserve the promised one-representative-per-address property when ledger representatives change.** Although `linhas_da_vigia` chooses one current representative per URL, `montar` unions those IDs with everything already stored. A newly earlier representative therefore joins the stale representative instead of replacing it, leaving two rows for one address while the generated note still claims one. The synthetic prover tests selection but not this merge path.  
indicators/calendario.py:1397, indicators/calendario.py:1418, indicators/calendario.py:1702, indicators/calendario.py:1710, indicators/calendario.py:1712, indicators/calendario.py:2292, indicators/calendario.py:2308

14. **The report gives two incompatible counts for agenda-held exits.** It says `presas_pela_agenda 3`, but its own pasted writer output says five, which is also the number of decided events the report says are agenda-named. The implementation counts event IDs, not agenda items.  
relatorio-construtor.md:82, relatorio-construtor.md:138, relatorio-construtor.md:143, relatorio-construtor.md:229, indicators/calendario.py:1700

15. **The fixture refresh is not accurately described as two new rows plus rolling verification windows on all 86 existing rows.** At least some existing claim diffs change only a comment, not a verification window. `evora-populacao-2021` additionally gains `name` and `name_source`, and the crossing record changes export dates, hashes and verification counts. Thus the reported description omits gate-relevant and semantic fixture changes.  
relatorio-construtor.md:203, relatorio-construtor.md:205, diff.patch:968, diff.patch:976, diff.patch:978, diff.patch:1816, diff.patch:1824, diff.patch:1827, diff.patch:2365, diff.patch:2373

## «What is fine»

16. **The delivered JSON does reproduce 17 events, six rowless events, nine dated events and an empty `saidas` list.**  
indicators/calendar.json:4, indicators/calendar.json:519, indicators/calendar.json:520

17. **The zero-resolution guard for configured undated watchers fails closed instead of writing an empty list.**  
indicators/calendario.py:1433, indicators/calendario.py:1435, indicators/calendario.py:1441, indicators/calendario.py:2332, indicators/calendario.py:2336

18. **Undated events themselves are excluded from the day and dated-calendar paths, while their addresses remain eligible through “no published calendar.”**  
indicators/calendario.py:156, indicators/calendario.py:158, indicators/calendario.py:198, indicators/calendario.py:269, indicators/calendario.py:271, indicators/calendario.py:279

19. **The five decision records and both watcher-note templates contain non-empty Portuguese and English text, with an explicit em-dash check covering events and exits.**  
indicators/calendario.py:1294, indicators/calendario.py:1335, indicators/calendario.py:1356, indicators/calendario.py:1388, indicators/calendario.py:2587

20. **The diff supports the narrow claim that no pre-existing YAML `value` field changed: its only added `value` fields belong to the two new rows, while an existing value appears unchanged as context.**  
diff.patch:860, diff.patch:921, diff.patch:1821