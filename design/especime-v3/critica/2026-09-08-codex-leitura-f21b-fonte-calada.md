# Leitura a frio do Codex ao bloco F2.1b do motor (a fonte calada não é uma corrida vermelha), 08.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, 06:07 a 06:33 UTC de 08.09.2026, 267 038 símbolos, sobre um pacote montado por `scripts/leituras/pacote.sh` (o brief, o relatório do construtor, o diff `8c93abd..0615ef2` do motor, os seis ficheiros mudados na cabeça, e os relatórios das corridas 33944217675 e 34083295445 como contexto) com cinco plantas de três classes (5 de 5 vistas; o registo está no `.plantas.json` ao lado): Q1, a fonte calada a voltar a `ALARME` no canário `existence`, apanhada no Blocking 1 com a diferença entre a cópia e o diff dita; Q2, a lista dos calados sem o instante, apanhada no Major 3; Q3, o conhecido-positivo da fonte calada a aceitar um alarme, apanhado no Major 8; Q4, os 41,7 s no relatório contra os 417,7 do artefacto, apanhados no Minor 11; Q5, a nota do estudo a dizer que «sem resposta» conta como alarme, apanhada no Minor 10. Triagem do lugar de direção: o Major 2 é a decisão do carimbo de 07.09 (o cabeçalho continua a carimbar com as contas ao lado) e a parte do sítio, mostrar a proporção das linhas lidas, fica agendada como emenda do sítio; reais e para a segunda passagem (ramo `leitor-2026-09-07`, Claude Opus 5, no mesmo dia): o Major 4 (um anfitrião declarado calado esconde a ausência do ficheiro hospedado), o Major 5 (uma corrida vermelha e parcial escrita como verde no markdown), o Major 6 (os contadores de «pedidos» contam alvos e rotinas, não pedidos HTTP), o Major 7 (as opções novas falham abertas), o Major 9 (as provas do relatório fora do pacote), e os Minor 12 e 13 (os chãos e a contagem de linhas do relatório em desacordo consigo próprio). Os 14 a 20 confirmam os artefactos, o caminho dos anfitriões até ao leitor, o `desapareceu`, o leitor partido, a conta das linhas e a fronteira do `fetch`.*

---

## Blocking

1. **A silent source still becomes an alarm, receives the verdict `desapareceu`, and exits 1.** The copied `canarios()` returns `ALARME` for `SEM_RESPOSTA`, whereas the diff adds `ESTADO`. `veredicto()` consequently maps the finding to `desapareceu`, and `main()` counts the alarm and returns 1 for both declared-silent hosts and ordinary timeouts. The reader’s own proof detects this wrong verdict and returns failure, so the block’s central acceptance condition is not implemented.

publisher/releitura_concelhos.py:555, publisher/releitura_concelhos.py:558, publisher/releitura_concelhos.py:616, publisher/releitura_concelhos.py:618, publisher/releitura_concelhos.py:701, publisher/releitura_concelhos.py:705, publisher/releitura_concelhos.py:851, publisher/releitura_concelhos.py:883, diff.patch:1222, diff.patch:1225

## Major

2. **A corrected silent-host run would refresh the public timestamp without any package-proven, reader-visible indication that the run was partial.** The corridor records `parcial` but still writes the site signal and sets `carimbo_do_cabecalho` whenever `mau == 0`, with no condition on silence. The builder says the site renders only `conferidoEm`, ignores all the new line counts, and still needs a separate view change to show the proportion. Because no site source or built Portuguese, English, or no-script pages are packaged, parity and truthful public presentation remain unproved.

indicators/corredor.py:3055, indicators/corredor.py:3080, indicators/corredor.py:3104, indicators/corredor.py:3105, relatorio-construtor.md:335, relatorio-construtor.md:343, relatorio-construtor.md:674, relatorio-construtor.md:680

3. **The corridor discards the measured silence timestamp, after which the reader invents a new timestamp.** `lista_dos_calados()` emits only the host, while the diff and report require `host=<instant>`. The parser therefore stores `None`; `calado_por_declaracao()` says no instant was supplied, but `canarios()` substitutes `agora()` and prints that unobserved time as “sem resposta às”. The corridor prover explicitly expects the original timestamp and therefore also fails on the copied file.

indicators/corredor.py:996, indicators/corredor.py:1004, indicators/corredor.py:2733, indicators/corredor.py:2745, indicators/corredor.py:2748, publisher/releitura_concelhos.py:251, publisher/releitura_concelhos.py:254, publisher/releitura_concelhos.py:274, publisher/releitura_concelhos.py:280, publisher/releitura_concelhos.py:557, publisher/releitura_concelhos.py:559, diff.patch:88

4. **A declared-silent publisher masks a missing hosted source before the local alarm can be evaluated.** `estado_local()` returns an error when the registered local file is absent, but `main()` also creates the silent-host error and `canarios()` returns immediately on that live error. The later local-error branch is unreachable in this combination; under the mandated `ESTADO` severity, the missing local copy would not stop the cycle, contrary to the report’s explicit claim.

publisher/releitura_concelhos.py:341, publisher/releitura_concelhos.py:346, publisher/releitura_concelhos.py:555, publisher/releitura_concelhos.py:561, publisher/releitura_concelhos.py:566, publisher/releitura_concelhos.py:841, publisher/releitura_concelhos.py:847, relatorio-construtor.md:151, relatorio-construtor.md:153

5. **Every red run that is also partial is described in Markdown as green and alarm-free.** `main()` can increment `mau` for a reader failure and then independently populate `relatorio["parcial"]`. `markdown()` tests only whether that list is non-empty and unconditionally writes “Correu sem alarmes” and “a corrida é verde”. The report is still written before the non-zero return, so the current silent-INE path produces a red exit with green prose.

indicators/corredor.py:3038, indicators/corredor.py:3040, indicators/corredor.py:3055, indicators/corredor.py:3059, indicators/corredor.py:3109, indicators/corredor.py:3112, indicators/corredor.py:3183, indicators/corredor.py:3188

6. **Both counters presented as “requests” count something other than actual network requests.** Phase 1 sets `enderecos_pedidos` to all targets, although the breaker bypasses `cliente.condicional()`; the reported 79 targets minus 10 bypasses means 69 actual attempts on 05.09, not 79. The reader increments `pedidos` once per source routine, but the five non-INE sources perform nine HTTP calls: four for two DGAL sources, two for IEFP, one for DRQPE, and two for IEM. The reported value 5 was measured with a stub replacing whole source routines, so it cannot establish the claimed HTTP-request count.

indicators/corredor.py:657, indicators/corredor.py:665, indicators/corredor.py:671, indicators/corredor.py:675, indicators/corredor.py:933, publisher/releitura_concelhos.py:394, publisher/releitura_concelhos.py:404, publisher/releitura_concelhos.py:430, publisher/releitura_concelhos.py:443, publisher/releitura_concelhos.py:455, publisher/releitura_concelhos.py:486, publisher/releitura_concelhos.py:504, publisher/releitura_concelhos.py:848, relatorio-construtor.md:17, relatorio-construtor.md:19, relatorio-construtor.md:593, relatorio-construtor.md:598

7. **The new command-and-summary channel fails open when values or output are missing.** A valueless or misspelled `--anfitrioes-calados` is silently treated as no option, so the reader makes the requests the operator meant to suppress; a valueless `--resumo` is likewise ignored. In the corridor, a missing summary remains `None` and malformed JSON becomes non-fatal `erro_do_resumo`; neither state contributes to `mau`, so reader counts and reader-originated partiality can disappear from a green report.

publisher/releitura_concelhos.py:815, publisher/releitura_concelhos.py:824, publisher/releitura_concelhos.py:847, indicators/corredor.py:1047, indicators/corredor.py:1056, indicators/corredor.py:3038, indicators/corredor.py:3053

8. **The copied silent-source known-positive has been weakened to permit exactly one alarm.** The diff requires `alarmes_de(calada) != 0` to fail, but the copied test fails only when the count exceeds one. A case with verdict `sem resposta` and one alarm therefore reaches the success branch, which even prints “0 alarme(s)”; production still exits 1 for any non-zero alarm count. This is one of the four exact patch-to-copy mismatches.

publisher/releitura_concelhos.py:701, publisher/releitura_concelhos.py:705, publisher/releitura_concelhos.py:714, publisher/releitura_concelhos.py:883, diff.patch:1303, diff.patch:1306

9. **The claimed green gates, reversal results, generated-JavaScript validation, site-usage audit, and no-network history are not measurements available in this package.** Their evidence is held in unprovided `/tmp` logs, an external site tree, a generated module outside the package, or an abbreviated command containing `...`. The copied programs also import unprovided modules, so the stated gate commands cannot be reproduced from this package alone. These outcomes and negative assertions remain claims, and the two principal prover outcomes are contradicted statically by findings 1 and 3.

relatorio-construtor.md:39, relatorio-construtor.md:41, relatorio-construtor.md:325, relatorio-construtor.md:343, relatorio-construtor.md:460, relatorio-construtor.md:480, relatorio-construtor.md:546, relatorio-construtor.md:560, relatorio-construtor.md:631, relatorio-construtor.md:666, publisher/releitura_concelhos.py:99, publisher/releitura_concelhos.py:101, indicators/corredor.py:71, indicators/corredor.py:76

## Minor

10. **The copied `RELEITURA.md` says that `sem resposta` counts as an alarm, contradicting both its own table and the diff.** Its table says the silent `existence` state does not affect the exit code, but the explanatory paragraph says the opposite. The diff adds “não conta como alarme”; the copied file replaces it with “conta como alarme”.

content/12 Concelhos/RELEITURA.md:64, content/12 Concelhos/RELEITURA.md:86, content/12 Concelhos/RELEITURA.md:92, diff.patch:44, diff.patch:45

11. **The report’s 41.7-second reader duration is false by a factor of ten.** The same report later says 417.7 seconds, and the packaged 05.09 JSON records 417.7. No packaged evidence supports 41.7.

relatorio-construtor.md:24, relatorio-construtor.md:29, contexto/corrida-33944217675/corredor_report.json:15707

12. **The report gives three incompatible floor changes and two incompatible counts of new stamp checks.** It first says 24 to 29 and 101 to 106, later says 24 to 30 and 101 to 107, and finally says 24 to 27 and 101 to 104. The copied gate contains 30 and 107. The file summary also says two new stamp positives, while the later accounting correctly says three, including 20b.

relatorio-construtor.md:115, relatorio-construtor.md:119, relatorio-construtor.md:542, relatorio-construtor.md:549, relatorio-construtor.md:631, relatorio-construtor.md:636, indicators/provas_test.py:103, indicators/provas_test.py:109

13. **The unqualified `indicators/corredor.py (+265 lines)` count does not describe the packaged head diff.** That file’s patch contains 554 additions and 41 deletions, which is 513 net lines or 595 changed lines, neither of which is 265. No command or definition is supplied that makes 265 reproducible.

relatorio-construtor.md:80, diff.patch:53, diff.patch:840

## «What is fine»

14. **The 05.09 artifact reproduces 79 targets, 12 absences, the INE breaker’s 90.348 seconds, 10 skipped addresses and 931 lines, 277.3 seconds for phase 1, reader exit 1 after 417.7 seconds with three alarms, 1,242 deferred verifications, and no header stamp.** contexto/corrida-33944217675/corredor_report.json:15, contexto/corrida-33944217675/corredor_report.json:21, contexto/corrida-33944217675/corredor_report.json:34, contexto/corrida-33944217675/corredor_report.json:36, contexto/corrida-33944217675/corredor_report.json:41, contexto/corrida-33944217675/corredor_report.json:15706, contexto/corrida-33944217675/corredor_report.json:15709, contexto/corrida-33944217675/corredor_report.json:16979, contexto/corrida-33944217675/corredor_report.json:16981

15. **The 07.09 artifact reproduces 78 first captures, one DGCP `SSLError` absence lasting 1.038 seconds, 102.9 seconds for phase 1, reader exit 0 after 25.2 seconds, four written `inacessivel` verifications, and a header stamp.** contexto/corrida-34083295445/corredor_report.json:20, contexto/corrida-34083295445/corredor_report.json:21, contexto/corrida-34083295445/corredor_report.json:29, contexto/corrida-34083295445/corredor_report.json:33, contexto/corrida-34083295445/corredor_report.json:4516, contexto/corrida-34083295445/corredor_report.json:4517, contexto/corrida-34083295445/corredor_report.json:5283, contexto/corrida-34083295445/corredor_report.json:5791

16. **The host records from phase 1 do reach `correr_concelhos()` in both the single-process path and `--so-leitores`; only their timestamps are lost afterward.** indicators/corredor.py:904, indicators/corredor.py:1041, indicators/corredor.py:1046, indicators/corredor.py:2967, indicators/corredor.py:2972

17. **An index or file-shape failure still becomes `desapareceu`, carries `ALARME`, and contributes to exit 1.** publisher/releitura_concelhos.py:534, publisher/releitura_concelhos.py:560, publisher/releitura_concelhos.py:616, publisher/releitura_concelhos.py:618, publisher/releitura_concelhos.py:851, publisher/releitura_concelhos.py:883

18. **A reader returning code 3 still increments `mau`, prevents site writes, and makes the corridor return 1, with a known-positive covering the path.** indicators/corredor.py:1723, indicators/corredor.py:1735, indicators/corredor.py:3038, indicators/corredor.py:3040, indicators/corredor.py:3066, indicators/corredor.py:3137

19. **The new line accounting separates read, silent, and HTTP-error lines, checks their sum against `linhas_conferidas`, and writes all four values plus the silent-host metadata into `CONFERENCIA`.** indicators/corredor.py:1277, indicators/corredor.py:1294, indicators/corredor.py:1346, indicators/corredor.py:1373, indicators/corredor.py:2800, indicators/corredor.py:2828

20. **The fetch boundary keeps non-200 responses and 200-without-body cases as `Fail`, while only client-reported transport errors become `SemResposta`, before the later severity defect.** publisher/concelhos_fetch.py:330, publisher/concelhos_fetch.py:340, publisher/releitura_concelhos.py:530, publisher/releitura_concelhos.py:538