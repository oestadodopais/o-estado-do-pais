# Leitura a frio do Codex ao bloco F2.1c do motor (a retoma noutro runner do anfitrião que não respondeu) e à sonda de alcance, 08.09.2026

*Codex `gpt-5.6-sol`, xhigh, só leitura, 08:54 a 09:22 UTC de 08.09.2026, 312 030 símbolos, sobre um pacote montado por `scripts/leituras/pacote.sh` (o brief, o relatório, o diff `5db0d71..d82a58bf`, os seis ficheiros novos ou mudados, os dois fluxos de `master` como contexto, a sonda `sonda-alcance.yml` como segundo objeto da leitura, os quatro registos dos runners da sonda, o relatório da corrida 34201388960 e os dois relatórios da prova 34206296522) com cinco plantas de três classes (5 de 5 vistas; o registo está no `.plantas.json` ao lado): K5, a retoma a herdar `--simular-calado`, apanhada no Blocking 1; K1, a condição da `retoma2` invertida, apanhada no Blocking 2; K2, a classe `tempo` no silêncio simulado, apanhada no Major 6; K3, a conferência da retoma enfraquecida no provador, apanhada no Major 8; K4, o chão do fluxo a 97, apanhado no Minor 11; o Major 7 é consequência das plantas. Triagem do lugar de direção: reais e para a segunda passagem (ramo `retoma-2026-09-08`, Claude Opus 5, no mesmo dia): o Major 3 (a retoma não relê as fontes do leitor dos concelhos, e o relatório principal sobe antes de a retoma correr: a retoma passa a correr os leitores, e um trabalho final `resumo` diz a corrida inteira pelo nome), o Major 4 (uma falha num passo posterior do trabalho principal suprimia a retoma: a saída da fase 1 passa a decidir, com `always()`), o Major 5 (um relatório sem o campo fazia de conta que ninguém ficou calado: falha fechado), e os Minor 9, 10, 11, 12, 13 (as medidas por provar ditas, as provas coladas, as contagens reconciliadas, a espera presumida só para um disjuntor real, o IP validado); na sonda, os Minor 14 e 15: os tempos que a sonda imprime são o primeiro byte e não o total, e uma das doze respostas foi a 0,96 s, pelo que a I116 e o brief do F2.1c, que diziam «1,3 a 1,8 s», corrigem-se para o primeiro byte em 0,96 a 1,8 s; as caixas da sonda passam a validar-se e o cabeçalho a dizer o que «não escreve nada» quer dizer. Os 16 a 22 confirmam as contagens, a leitura da lista dos calados do relatório, as guardas do modo, a preparação partilhada, a aritmética das provas e o que os registos da sonda sustentam.*

---

## Blocking

1. **The copied retake cannot complete in any mode because it always re-applies `--simular-calado`.**

The action’s comment and the diff say the retake must make a real request, but the copied command always adds the simulation flag. In `real`, `corredor.py` refuses that flag because `CORREDOR_MODO=real`; in `ensaio`, it refuses because the retake does not pass `--sem-leitores`. The successful acceptance report, which has `simular_calado: null` and exit code 0, therefore came from the diff’s intended code, not this copied action.

.github/actions/corredor-retomar/action.yml:14, .github/actions/corredor-retomar/action.yml:117, indicators/corredor.py:3748, indicators/corredor.py:3756, diff.patch:380, contexto/prova-34206296522/retoma/corredor_report.json:9

2. **The `retoma2` condition is inverted, so the last attempt is skipped when hosts remain silent and launched when none remain.**

The copied workflow tests `anfitrioes_calados == ''`, while the diff adds `!= ''`. If the first retake still has silent hosts, the second retake is skipped; if it reached everything, `retoma2` receives an empty host list. That empty `--so-anfitrioes` selection is then explicitly rejected by the corridor.

.github/workflows/corredor.yml:781, .github/workflows/corredor.yml:809, indicators/corredor.py:602, indicators/corredor.py:605, diff.patch:900, relatorio-construtor.md:146

## Major

3. **Even the successful acceptance retake leaves the run partial and cannot satisfy the brief’s “green entire” or principal-report requirements.**

The principal job recorded that 3 of 8 `concelhos` sources were not read because the INE host was considered silent. The retake explicitly omits `--concelhos`, and its report confirms that no reader ran, so those three sources were never re-read. The principal artifact is uploaded before the dependent retake starts and is never rewritten, so it also cannot name the retake’s later result as the brief requires.

brief.md:13, brief.md:14, .github/actions/corredor-retomar/action.yml:83, contexto/prova-34206296522/principal/corredor_report.json:5109, contexto/prova-34206296522/principal/corredor_report.json:5115, contexto/prova-34206296522/retoma/corredor_report.json:1550

4. **A silent host does not trigger a retake if any later step of the principal job fails.**

The host output is produced immediately after phase 1, but readers, gates and pushes can still fail afterward. `retoma` depends on the entire `corredor` job and its condition contains no `always()` status override, so GitHub’s implicit success condition skips it when that job finishes failed. This contradicts the stated trigger of “phase 1 left hosts in `anfitrioes_sem_resposta`.”

.github/workflows/corredor.yml:458, .github/workflows/corredor.yml:498, .github/workflows/corredor.yml:523, .github/workflows/corredor.yml:562, .github/workflows/corredor.yml:737, brief.md:11

5. **A structurally malformed but valid JSON report can silently suppress every retake.**

`calados_do_relatorio` rejects a missing file and invalid JSON, but `relatorio.get("anfitrioes_sem_resposta") or []` treats a missing field, `null`, or entries without hosts as “nobody was silent.” It then emits an empty list, `alcancou_tudo=sim`, and exits successfully. The prover covers a valid nonempty report, a valid empty report and a missing file, but never a valid JSON object missing the required field or timestamp.

indicators/corredor.py:1192, indicators/corredor.py:1202, indicators/corredor.py:1206, indicators/corredor.py:1215, indicators/provar_fluxo.py:795, indicators/provar_fluxo.py:810

6. **The copied corridor labels simulated silence as a real timeout class.**

The surrounding contract says the class must be `simulada`, but the copied entry writes `"classe": "tempo"` while retaining `simulada: True`. The Markdown table prints that class directly, so a simulated run would simultaneously announce simulation and display the real timeout class. Both the diff and the supplied acceptance artifact contain `simulada`, not the copied value.

indicators/corredor.py:431, indicators/corredor.py:488, indicators/corredor.py:4141, diff.patch:1146, contexto/prova-34206296522/principal/corredor_report.json:36

7. **The pasted green prover results cannot have been produced from the copied files.**

The flow prover requires `retoma2` to test `!= ''`, but the workflow contains `== ''`; it also requires the retake action to omit `--simular-calado`, which the copied action includes. The corridor prover requires the simulated class to equal `simulada`, while the copied source writes `tempo`. Therefore the reported `FLUXOS: PASS`, `CORREDOR: PASS`, and aggregate 177-check pass describe different bytes.

indicators/provar_fluxo.py:683, indicators/provar_fluxo.py:754, indicators/corredor.py:2579, relatorio-construtor.md:163, relatorio-construtor.md:178, relatorio-construtor.md:216

8. **The prover’s first-retake gate was weakened so far that an inverted condition would pass.**

The copied check merely looks for the text `needs.corredor.outputs.anfitrioes_calados` anywhere in the condition. It no longer requires `!= ''` or the dormant guard, although both requirements appear in the diff. A first retake conditioned on an empty host list would therefore satisfy this claimed gate.

indicators/provar_fluxo.py:675, indicators/provar_fluxo.py:680, diff.patch:1752, diff.patch:1757, diff.patch:1758

## Minor

9. **Two acceptance measures remain unmeasured after the added run.**

The package still contains no green run without silent hosts, which the builder itself leaves pending. The principal and retake reports show 146.1 and 36.4 seconds inside `corredor.py`, but those exclude checkout, installation, cloning, readers and artifact work and are not billed job minutes. They therefore do not prove the under-20-minute acceptance measure.

brief.md:21, brief.md:22, relatorio-construtor.md:223, relatorio-construtor.md:224, contexto/prova-34206296522/principal/corredor_report.json:47, contexto/prova-34206296522/retoma/corredor_report.json:34

10. **Several measurements are unsupported despite the report’s claim that every number has evidence beside it.**

The two `core.gate` zeroes have no included output or `gate-final.rc`, and the package does not contain `core.gate`. The claimed zero laptop requests is supported only by counting URL literals, which cannot measure past network activity. The 104 MB checkout figure has neither the complete `awk` command nor its output, and the master counts came from a worktree said to have been deleted.

relatorio-construtor.md:12, relatorio-construtor.md:17, relatorio-construtor.md:18, relatorio-construtor.md:88, relatorio-construtor.md:219, relatorio-construtor.md:230

11. **The block’s count documentation contradicts itself in three places.**

The report says the flow floor rose from 58 to 97, but later prints 79 and says 21 checks were added, which gives 79. The prover calls the same addition “thirteen checks,” while the report calls it 21. The preparation action says it consolidates nine steps, whereas its YAML and the report count eight.

relatorio-construtor.md:13, relatorio-construtor.md:163, relatorio-construtor.md:166, indicators/provar_fluxo.py:621, .github/actions/corredor-preparar/action.yml:8, relatorio-construtor.md:143

12. **The simulated-run Markdown invents a twelfth wait for a host with only eleven target addresses.**

The report says all 11 INE addresses were skipped without a request. Its summary nevertheless says there would have been 12 waits because the Markdown unconditionally adds one presumed initial failure per silent host. That addition is valid for a real breaker opened by a failed first request, but not for a simulation opened before any request.

contexto/prova-34206296522/principal/corredor_report.json:41, contexto/prova-34206296522/principal/corredor_report.md:56, indicators/corredor.py:4144, indicators/corredor.py:4150

13. **The egress-IP validation accepts strings that are not IP addresses.**

The regular expression accepts any 3–45 characters drawn from hexadecimal digits, dots and colons, including values such as `bad`, `deadbeef`, or `...`. Such a value would be written to job outputs, the environment and reports as the runner IP. This contradicts the claim that non-IP responses are discarded, although a request failure itself is correctly made non-fatal.

.github/actions/corredor-preparar/action.yml:94, .github/actions/corredor-preparar/action.yml:98, .github/actions/corredor-preparar/action.yml:103, relatorio-construtor.md:71

14. **The probe does not support the reported 1.3–1.8-second request range or timed 0.1–0.8-second results on both ports.**

The workflow records `time_starttransfer`, not total request duration, and one successful request reports 0.956607 seconds. Its port-80 `nc` result contains no timing at all, so no port-80 range can be reproduced. The separate 18 ms laptop claim is also absent from the packaged logs.

brief.md:7, relatorio-construtor.md:39, .github/workflows/sonda-alcance.yml:71, .github/workflows/sonda-alcance.yml:77, contexto/sonda-34194889895/runner-101960365674.log:42, contexto/sonda-34194889895/runner-101960365674.log:48

15. **The probe’s absolute “does not write anything” statement is not enforced for its remote targets, and it deliberately exposes supplied and measured network information in logs.**

An authorized dispatcher can supply arbitrary target and control URLs, which the workflow requests with GET and prints in full. It also prints the motive, egress IP, DNS answers, remote IPs and traceroutes; newline cleaning is applied only to the motive’s first echo. Empty repository permissions prevent repository writes, but they do not constrain egress, remote side effects, or log disclosure.

.github/workflows/sonda-alcance.yml:13, .github/workflows/sonda-alcance.yml:27, .github/workflows/sonda-alcance.yml:40, .github/workflows/sonda-alcance.yml:57, .github/workflows/sonda-alcance.yml:65, .github/workflows/sonda-alcance.yml:81

## «What is fine»

16. **The YAML is syntactically valid, and the structural counts of 2→5 jobs, 21→15 principal steps, 806→934 workflow lines, eight preparation steps and seven retake steps are reproducible.**

relatorio-construtor.md:24, relatorio-construtor.md:25, relatorio-construtor.md:26, relatorio-construtor.md:27, .github/actions/corredor-preparar/action.yml:80, .github/actions/corredor-retomar/action.yml:80

17. **The first-retake host list is genuinely read from the principal JSON report, exposed through a step output and used by the current nonempty, non-dormant job condition.**

.github/workflows/corredor.yml:317, .github/workflows/corredor.yml:458, .github/workflows/corredor.yml:738

18. **The mode guards correctly keep a dormant schedule inert, reject dispatched `real`, require the armed scheduled path, and independently reject simulation in real or writing code paths.**

.github/workflows/corredor.yml:242, .github/workflows/corredor.yml:265, .github/workflows/corredor.yml:292, .github/workflows/corredor.yml:296, indicators/corredor.py:3749, indicators/corredor.py:3756

19. **Preparation is shared by all three runner jobs, deployment keys and both pushes are real-only, staging paths are explicit, and no retake push uses force.**

.github/workflows/corredor.yml:330, .github/workflows/corredor.yml:750, .github/workflows/corredor.yml:793, .github/actions/corredor-preparar/action.yml:164, .github/actions/corredor-retomar/action.yml:146, .github/actions/corredor-retomar/action.yml:166

20. **The acceptance JSON and Markdown pairs are internally arithmetically consistent: 2,916 equals 2,577 plus 339, the principal has 79 targets with 68 requests plus 11 simulated skips, and the retake has 11 targets and 11 requests from a different reported IP.**

contexto/prova-34206296522/principal/corredor_report.json:12, contexto/prova-34206296522/principal/corredor_report.json:15, contexto/prova-34206296522/principal/corredor_report.json:19, contexto/prova-34206296522/principal/corredor_report.json:20, contexto/prova-34206296522/retoma/corredor_report.json:12, contexto/prova-34206296522/retoma/corredor_report.json:20

21. **The probe logs do support the central observed split of three successful runner IPs and one timed-out runner that still reached the control host, while repository permissions are empty and no secrets are referenced.**

.github/workflows/sonda-alcance.yml:40, contexto/sonda-34194889895/runner-101960365444.log:36, contexto/sonda-34194889895/runner-101960365444.log:40, contexto/sonda-34194889895/runner-101960365444.log:106, contexto/sonda-34194889895/runner-101960365664.log:40, contexto/sonda-34194889895/runner-101960365726.log:40

22. **The diff contains only workflows, composite actions and motor/prover files, so it introduces no direct Portuguese/English page or no-script divergence, although those reader-facing behaviours are consequently not exercised here.**

diff.patch:1, diff.patch:258, diff.patch:481, diff.patch:1045, diff.patch:1536, diff.patch:1928