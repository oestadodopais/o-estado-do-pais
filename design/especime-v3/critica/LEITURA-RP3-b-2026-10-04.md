# Segunda leitura a frio do RP3, só sobre a passagem RP3-b · Codex `gpt-6.1-sol`, xhigh · 04.10.2026

*Pacote montado pelo lugar de direção do intervalo `f15d6761..b2fbdd28` do ramo `rp3-2026-10-04-b` (a passagem de emendas da primeira leitura, rebaseada sobre `main` `7af90731`) e do intervalo `f97e66e..47f12e1` do motor, com cinco estragos plantados só nas cópias do pacote e registados por sha256 em `LEITURA-RP3-b-2026-10-04.plantas.json`. A leitura correu das 09:59:18 às 10:09:19 UTC, 158 090 símbolos («tokens used» do registo). As cinco plantas foram mordidas (os achados 1, 2, 3, 4 e 6). O único achado real é o 5, menor (a isenção nova de «indicador» dentro do endereço da API do INE isenta o bloco inteiro e não só a ocorrência dentro de `json_indicador`), registado como questão I193 para a passagem de higiene seguinte; o bloco aterrou com ele. A triagem está em `DECISIONS.md` §1.156. O texto do leitor segue tal como veio, em inglês.*

## Blocking

None established.

## Major

1. **The copied S13 still accepts contradictory corrections with the same latest date.** Its guard tests `ultimas.length < 1`, whereas the patch requires `!== 1`. Executing the copied S13 block with two same-date corrections returned zero errors when the point matched the first correction, despite the second naming another value. The supplied same-date plant therefore cannot obtain its expected rejection from this implementation.

src/lib/series.mjs:959, diff.patch:681, scripts/check-ledger.mjs:695

2. **Removing `data-da-serie` still bypasses the copied series-name identity check.** The missing-attribute guard catches only an empty string; an absent attribute returning `undefined` or `null` escapes it. The identity comparison remains conditional on a truthy attribute, allowing another declared series name through the general membership check. The patch uses `!daSerie`, and the former control is correctly relabelled as a plant, but its recorded bite does not establish the copied implementation’s protection.

scripts/medir-defeitos.mjs:1317, scripts/medir-defeitos.mjs:1326, scripts/medir-defeitos.mjs:1369, diff.patch:580, design/especime-v3/medicoes/rp3-2026-10-04/plantas-rp3.mjs:117

3. **Correction explanations remain exempt from the voice surface, contrary to finding 8’s fix.** The copied list classifies both `corrections.*.reason` and `reason_en` as `transcrito`; the patch classifies them as `da-casa`. Consequently, `superficieDe` removes them, hiding the Portuguese and English planted phrases. The fixed selector used by `check:lugar` retains those explanations, so the purported single list disagrees with its selector and should fail the agreement autotest.

scripts/campos-da-serie.mjs:42, diff.patch:323, scripts/voz-palavras.mjs:297, scripts/campos-da-serie.mjs:64, scripts/check-lugar.mjs:2149, tests/voz/palavras-proibidas.mjs:233

4. **The copied engine VP1 accepts empty correction values and explanations.** Its seven-field validator checks string type but omits the patch’s `.strip()` condition. Executing that function accepted empty and whitespace-only `old_value`, `new_value`, `reason` and `reason_en`. VP6 correctly rejects incomplete or empty corrections when an existing point changes, but that conditional protection does not establish VP1’s promised non-empty form for every correction.

motor/publisher/export_series.py:329, motor/diff.patch:204, motor/publisher/export_series.py:633, motor/publisher/export_series.py:638, relatorio-construtor.md:179

## Minor

5. **The new INE URL exception also exempts project-authored “indicador” elsewhere in the same block.** The pattern identifies a block containing the API path, then discards that block’s entire word count. In-memory evaluation of “Este indicador subiu.” followed by the INE URL counted two occurrences and exempted both. This weakens L3 beyond exempting the occurrence inside `json_indicador`.

scripts/check-lugar.mjs:588, scripts/check-lugar.mjs:597, scripts/check-lugar.mjs:1374, scripts/check-lugar.mjs:1379

6. **The report’s “19 of 20” plant count contradicts its measurements.** Counting the JSON entries gives twenty plants, all with `mordeu: true`. The corresponding log says twenty of twenty, and its code file contains zero. The report introduces an unmeasured failure.

relatorio-construtor.md:186, design/especime-v3/medicoes/rp3-2026-10-04/rp3b/plantas-series-rp3b.json:24, design/especime-v3/medicoes/rp3-2026-10-04/rp3b/series-com-motor.log:1, design/especime-v3/medicoes/rp3-2026-10-04/rp3b/series-com-motor.codigo:1

## «What is fine»

7. **Both Eurostat cell readers implement the substantive VP2 correction.** They reconstruct the flat index from the edition coordinates, dimension order and sizes, independently compare value and status, and require the exact fragments inside their respective objects. Executing both copied readers accepted a valid cube with non-singleton geography and rejected the annotation-only value and omitted genuine flag. The engine’s new plants name those same rejection reasons.

motor/publisher/export_series.py:470, motor/publisher/export_series.py:517, motor/publisher/export_series.py:534, tests/series/series.mjs:359, tests/series/series.mjs:392, motor/publisher/dominios_series_test.py:288, motor/publisher/dominios_series_test.py:300

8. **Chronological selection, null-value rejection, VP6 completeness and finding 11’s relabelling are supported.** The copied S13 rejects a newer correction followed by an older one and a null old value for the named reasons. VP6 rejects the incomplete pair, contradictory newest correction and latest-date tie, while accepting the complete control. The S14 plant now names its value mutation, and the README assigns staleness to S5, whose separate plant adds a newer point.

src/lib/series.mjs:948, src/lib/series.mjs:957, motor/publisher/export_series.py:637, scripts/check-ledger.mjs:700, ledger/series/README.md:124, tests/series/series.mjs:703

9. **The supplied rebase surfaces retain the required gates and R2 documentation.** `verify` contains forty-one unique steps, ending with suggestions, labels and series. Both R2 sections precede RP3; the patch’s R2 removals replace citation line numbers without deleting their substance. No view, component, stylesheet or rendered data file appears among its changed files. This supports the unchanged-output claim, but the recorded 7,509-page comparison cannot be independently repeated without both build trees, nor can every `main` step be compared without its package file.

package.json:44, design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md:489, diff.patch:229, diff.patch:238, design/especime-v3/medicoes/rp3-2026-10-04/rp3b/paginas-rp3b-passagem.json:18

10. **The remaining measurement arithmetic and copied-reading checksum reconcile with the records.** Gate-code files contain zero, and timestamps reproduce 141, 920 and 279 seconds, with typecheck within one recorded second. Counter subtraction reproduces 439,340 symbols; elapsed time rounds to 5,540 seconds. Other reported totals reconcile with saved records, although their original collection requires unavailable builds, images or session logs. Both reading copies have identical SHA256 matching the measurement; no machine paths or usernames were found, and newly added Portuguese prose contains no em dashes.

design/especime-v3/medicoes/rp3-2026-10-04/rp3b/medidas-rp3b.json:184, design/especime-v3/medicoes/rp3-2026-10-04/custo-rp3b.json:11, design/especime-v3/medicoes/rp3-2026-10-04/rp3b/medidas-rp3b.json:1072, LEITURA-RP3-2026-10-04.md:1, design/especime-v3/critica/LEITURA-RP3-2026-10-04.md:1