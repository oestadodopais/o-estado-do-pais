# A leitura a frio do C1e e do C1f (a quarta leitura das correções de confiança) · Claude Opus 5.5 (`leitor`), 28.09.2026

*O pacote: o sítio de `5c862efb` a `eec9dc69`, o motor de `1af0456` a `68318e0`, vinte páginas construídas e as provas das duas passagens; cinco estragos plantados só nas cópias, registados por sha256 em `LEITURA-c1ef-2026-09-28.plantas.json`. A leitura achou as cinco plantas (os achados 1, 2, 3, 4 e 10). A triagem está no guião da passagem C1g, `design/especime-v3/medicoes/c1-2026-09-28/prompts/PROMPT-c1g-codex.md`.*

# Cold reading of C1e and C1f (C1, the trust fixes), 28.09.2026

Read by Claude Opus 5.5 from the package only: the brief, both prompts, the report, the diff (`5c862efb` to `eec9dc69`), the copied files, the built pages and the measurement folder. Every changed region of the diff was compared line by line with its copy. The rendered text of the built pages was compared with the frozen C1d copies. The provenance guard and the snapshot plants were run in memory from the packaged sources, through stdin only.

## Blocking

1. **The packaged row `evora-prr-aprovado-2026` gives its first rebuilt access change the old value 2026-08-03. The diff, the Git evidence, the crossing registry and the entry's own reason all say 2026-08-04.**
   - The copy has `old_value: "2026-08-03"`, while the same entry's reasons two lines below say «de 2026-08-04» / «from 2026-08-04».
   - The diff adds `"2026-08-04"`, and the block's Git reading records commit `8371e097` changing `access_date` from 2026-08-04 to 2026-08-18.
   - The copy hashes to `39579ffd…`, not to the registry's `exported_row_sha256` `21b01fd9…`. Putting 2026-08-04 back reproduces the registry hash exactly. The frozen receipt, built from the real head, reads «dia da leitura: 04.08.2026 → 18.08.2026».
   - Run through the diff's own chain check, the copy gives 0 errors: `ledger:check` places no constraint on the first `old_value` of an access chain. Only the crossing hash and the block's one-off Git controller, which no gate runs, would stop this value from reaching the receipt.

   References: ledger/claims/evora-prr-aprovado-2026.yml:98, ledger/claims/evora-prr-aprovado-2026.yml:100, diff.patch:63056, design/especime-v3/medicoes/c1-2026-09-28/c1f/acessos-git.json:16, ledger/cruzamentos/evora.json:673, design/especime-v3/medicoes/c1-2026-09-28/c1f/paginas-depois/livro-razao_evora-prr-aprovado-2026_index.html:2, design/especime-v3/medicoes/c1-2026-09-28/c1f/conferir-acessos.py:66

2. **The packaged English string for a calculated row's second reading is «No second reading yet», the claim C1e item 4 removes. Every calculated receipt in English would tell readers it has had no second reading, and the two editions would disagree.**
   - The diff adds `segundaLeituraCalculada: 'Recomputed at every build from its sources'`. The copy has 'No second reading yet', while the Portuguese twin keeps the mandated sentence.
   - The receipt view renders this string for every row with `derived_from`, and the final build counts 330 such rows.
   - The gate cell expects the mandated English sentence, so this copy cannot be the one that passed `gate:html`.

   References: src/i18n/strings.mjs:3707, src/i18n/strings.mjs:2175, diff.patch:63498, src/views/LinhaView.astro:1430, scripts/verificacao-legivel.mjs:57, design/especime-v3/medicoes/c1-2026-09-28/portoes/c1f/build.log:232

3. **The Portuguese receipt of real GDP per capita 2025 still prints «Releitura tentada a 28.09.2026, sem resposta a esse pedido», the wording C1e retired. Its English twin prints «no value read».**
   - The head's Portuguese string is «sem valor lido», and the gate cell rejects any other result text on an `inacessivel` entry, so this page is not what the green build produced.
   - Its text is identical to the frozen C1d copy of the same page. It is the only one of the 16 packaged pages with a C1d copy that lacks a C1e change it should carry (the English PIB and household-debt receipts and both Évora pages did change).
   - A Portuguese reader is told the source did not answer on 28.09, which the third reading showed to be false for this row.

   References: built/livro-razao/pib-real-per-capita-2025/index.html:2, built/en/ledger/pib-real-per-capita-2025/index.html:2, src/i18n/strings.mjs:2309, scripts/verificacao-legivel.mjs:83, design/especime-v3/medicoes/c1-2026-09-28/c1d/paginas-depois/livro-razao_pib-real-per-capita-2025_index.html:2, design/especime-v3/critica/LEITURA-c1d-2026-09-28.md:43

4. **The packaged `historiaDaProveniencia` can never refuse an entry older than the access in force. The copy guards that check with `campo === 'access_date'`, but `acessos` is only built when `campo !== 'access_date'`.**
   - The diff adds `if (acessos && String(c.date) < acessos.em(c.date))`. The copy's extra condition makes that branch dead for every field.
   - On the university row as it stood before C1f, the copy refuses none of the four entries the C1e table lists. On a synthetic excerpt entry dated before the first access it returns no error. The diff version refuses four and one.
   - The six «antes do primeiro acesso» plants for the non-access fields expect exactly that error, so `ledger:check` would throw on this copy. The C1f proof records them biting, which only the diff version produces.

   References: src/lib/historia-da-proveniencia.mjs:30, src/lib/historia-da-proveniencia.mjs:48, diff.patch:63547, tests/linha/cadeias-proveniencia.mjs:21, design/especime-v3/medicoes/c1-2026-09-28/c1f/proveniencia.json:48, relatorio-construtor.md:666

## Major

5. **None of the receipts these passes changed tells a reader with no background what its number is (question 9). C1f also added history lines that explain a date with Git and a commit hash.**
   - `evora-prr-aprovado-2026` (167 372 755,84 euros), both editions: «PRR» is never spelled out, and the only definition is the source's column names («valor_contratado · papel_entidade ∈ {…} · localizacao_sede = Évora»). The label says «aprovadas» / «approved» over a sum of a column named «contratado», and nothing on the page reconciles the two words or says that «para Évora» means entities headquartered there.
   - `evora-prr-vencido-aprovado-2026` (102 624 703,85 euros) has the same «aprovadas» over «valor_contratado», and «fora de prazo» is defined only as «dt_prevista_conclusao anterior à data do instantâneo · dt_efetiva_conclusao vazia».
   - `evora-prr-pago-2026` (86 944 668,69 euros), `evora-prr-municipio-contratado` (12 069 012,6 euros) and `evora-prr-universidade-contratado` (38 596 975,81 euros) likewise give only column and filter names, no plain definition and no reference.
   - On all five, each rebuilt access change appears twice in two date forms: «04.08.2026 → 18.08.2026» and «de 2026-08-04 a 2026-08-18», against the house's single dd.mm.aaaa rule. It is explained by «história do Git (8371e097)» / «Git history (8371e097)».
   - The PIB 2025 receipt («20 600 … volumes encadeados (2015)») and the EU household-debt receipt («49,2 % do PIB», titled on the Portuguese page only by Eurostat's English name) remain as I170 records them. I170 does not cover the five recovery-plan receipts.

   References: design/especime-v3/medicoes/c1-2026-09-28/c1f/paginas-depois/livro-razao_evora-prr-aprovado-2026_index.html:2, design/especime-v3/medicoes/c1-2026-09-28/c1f/paginas-depois/en_ledger_evora-prr-aprovado-2026_index.html:2, design/especime-v3/medicoes/c1-2026-09-28/c1f/paginas-depois/livro-razao_evora-prr-vencido-aprovado-2026_index.html:2, design/especime-v3/medicoes/c1-2026-09-28/c1f/paginas-depois/livro-razao_evora-prr-pago-2026_index.html:2, design/especime-v3/medicoes/c1-2026-09-28/c1f/paginas-depois/livro-razao_evora-prr-municipio-contratado_index.html:2, design/especime-v3/medicoes/c1-2026-09-28/c1f/paginas-depois/livro-razao_evora-prr-universidade-contratado_index.html:2, src/views/LinhaView.astro:1414, built/livro-razao/pib-real-per-capita-2025/index.html:2, built/livro-razao/divida-das-familias-2025-ue/index.html:2, design/especime-v3/ISSUES.md:179

6. **No capture at the final head shows C1e's reader-visible changes, yet the C1f measurement declares integral acceptance.**
   - C1e's own measurement lists 337 receipts whose text changed as still to capture, in both editions and five widths: 329 calculated rows, 7 attempts without a value read, and the EU household debt. It lists the Évora band too.
   - The C1e prompt asked for captures of the receipts that changed. C1f captured only the five recovery-plan receipts, and its report says it does not present new captures of the others.
   - `c1f/medir.py` sets `aceitacao_integral` to `final and not erros`, which ignores that list, and writes `true`.
   - The one C1e-changed receipt rendered in Portuguese in this package (finding 3) shows the retired wording, which is the kind of defect those captures exist to catch.

   References: design/especime-v3/medicoes/c1-2026-09-28/c1e/medidas.json:3233, design/especime-v3/medicoes/c1-2026-09-28/c1e/medidas.json:5259, design/especime-v3/medicoes/c1-2026-09-28/c1e/medidas.json:5271, design/especime-v3/medicoes/c1-2026-09-28/prompts/PROMPT-c1e-codex.md:18, design/especime-v3/medicoes/c1-2026-09-28/c1f/capturas-depois.json:22, relatorio-construtor.md:839, design/especime-v3/medicoes/c1-2026-09-28/c1f/medir.py:123, design/especime-v3/medicoes/c1-2026-09-28/c1f/medidas.json:944

7. **The new privacy gate runs inside `npm run build`, but its verdict depends on the machine and on the Git history. The package shows it run only on the builder's machine.**
   - `check-privacidade.py` loads its detector from the block's measurement script `medir-c1.py`. That script takes author names from `git log` and `git show` against the hard-coded commit `48a5a1c1`, and the `--prova` run raises when no name comes back.
   - Its forbidden strings come from the running machine's home directory: the home's name, and its parent plus «/». For a home directly under «/», that parent string is «//», which every `https://` link contains. A home named `root` would also match the served stylesheet's `:root`.
   - The ledger README says the build runs on a remote builder without the engine. Before this block the `build` chain had no Python step: `check:briefs`, the only other one, is in `verify` only.
   - No run on the remote builder, or on a shallow checkout, is in the package.

   References: package.json:12, package.json:44, package.json:54, scripts/check-privacidade.py:9, scripts/check-privacidade.py:29, design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:15, design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:30, design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:39, design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:41, design/especime-v3/medicoes/c1-2026-09-28/medir-c1.py:54, ledger/README.md:799, design/especime-v3/medicoes/c1-2026-09-28/c1f/paginas-depois/_astro/Base.BrImN9-8.css:1

8. **The eight new «forma-encontrada» plants cannot fail. Each compares a hand-typed string with a `===` written inside the test, and none passes through the gate that checks the found value on the pages.**
   - `ver` is defined in the test as `texto === esperado`, and the plants feed it four strings per edition that differ from `esperado` by construction. They «bite» whatever the site code does.
   - The page check lives in `gate-html.mjs`, which compares the rendered found value with `valorRelidoAqui(found)`. No plant renders a page or calls that comparison.
   - The report counts these among the 127 plants that answer the third reading's finding that the found value's notation had no plant.

   References: tests/confianca/c1.mjs:90, tests/confianca/c1.mjs:91, tests/confianca/c1.mjs:93, design/especime-v3/medicoes/c1-2026-09-28/c1e/plantas-confianca.json:1024, scripts/gate-html.mjs:2748, relatorio-construtor.md:680, design/especime-v3/critica/LEITURA-c1d-2026-09-28.md:70

9. **The snapshot plant «recurso posterior à entrada» does not isolate the date condition it is named for: it still bites when that condition is deleted.**
   - The plant moves the 17.08 snapshot entry to 2026-08-16. That re-sorts it before the 18.08 entry that installs the dataset page, so it fails on «new address differs from the one in force» before its date matters.
   - The recorded failure says so: at 2026-08-16 the address in force was the API resource `…/r/896a8911…`, not the dataset page.
   - Run with `dia <= c.date` removed from `eInstantaneoDoMesmoConjunto`, the shipped plant still produces two errors. A plant kept at 2026-08-18 with a 19.08 resource passes without the condition and bites with it.
   - The report calls the snapshot plants separate and kept coherent «para não confundir as condições», and the C1e mandate asked for one plant per condition.

   References: tests/linha/cadeias-proveniencia.mjs:32, src/lib/historia-da-proveniencia.mjs:6, src/lib/historia-da-proveniencia.mjs:11, design/especime-v3/medicoes/c1-2026-09-28/c1f/proveniencia.json:163, relatorio-construtor.md:672, relatorio-construtor.md:676, design/especime-v3/medicoes/c1-2026-09-28/prompts/PROMPT-c1e-codex.md:9

10. **The packaged report says C1f added «doze entradas novas, duas por linha». Five rows times two is ten, and every other artefact says ten.**
    - The builder's `LEIA-ME.md` in the same package reads «Há dez entradas novas» on the same line, and the report copy differs from it at that line only.
    - `c1f/medidas.json` records `entradas_reconstituidas: 10`, and the builder's answer says «Dez entradas». The inventory and its review register also say «dez entradas».
    - The package's numbers check was run on the worktree's `LEIA-ME.md`, not on this copy, so it says nothing about this line.

    References: relatorio-construtor.md:779, design/especime-v3/medicoes/c1-2026-09-28/LEIA-ME.md:779, design/especime-v3/medicoes/c1-2026-09-28/c1f/medidas.json:239, design/especime-v3/medicoes/c1-2026-09-28/RESPOSTA-codex-c1f.md:3, design/especime-v3/INVENTARIO-FRASES.md:3457, design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:484, numeros-do-relatorio.txt:1

## Minor

11. **The undated start gives the whole first mandate the in-office style. The 2009-2013 segment, whose end is sealed at 18.10.2013, is drawn exactly like the mandate in office, and no capture of it exists.**
    - `.is-inicio-aberto` shares the rule of `.is-aberto`: no fill and a dashed outline on all four sides, including the right edge at the known installation.
    - On the page the two differ only by the «em funções» label, and no legend says what a dashed box means.
    - F18 checks the class, not the drawing. The report says the real capture is pending, and C1f did not take it.

    References: src/styles/site.css:3405, src/components/lugar/InstrumentoDosMandatos.astro:360, built/municipios/evora/index.html:3, built/en/municipalities/evora/index.html:3, tests/municipio/calendario.mjs:152, relatorio-construtor.md:652

12. **The calculated-row sentence is chosen by `derived_from` alone. The ledger lets a derived row without a `check` expression through, with only a warning that its arithmetic is not re-evaluated at build.**
    - The view and the gate cell both key «Recalculada em cada construção a partir das suas origens» on a non-empty `derived_from`.
    - `validateLedger` only warns «é derivada mas não traz uma expressão "check". A aritmética não é reavaliada no build.», so such a row would publish a sentence that is false for it.
    - The final build prints no such warning (330 derived rows, 334 re-evaluated checks), so the sentence is true today but not guarded.

    References: scripts/verificacao-legivel.mjs:55, src/views/LinhaView.astro:1430, src/lib/ledger.mjs:2649, src/lib/ledger.mjs:2651, design/especime-v3/medicoes/c1-2026-09-28/portoes/c1f/build.log:232

13. **The README's new paragraph on what the machine does not check leaves out that the first `old_value` of any chain is taken as given.**
    - «Cada old_value tem de ser o valor anterior» holds from the second entry on. The first entry's `old_value` seeds the chain unchecked.
    - For an access chain, that first value is exactly what C1f rebuilt, and the copy's wrong 2026-08-03 (finding 1) passes the chain with no error.
    - The paragraph names only the agreement between an entry's date and its prose as left to human reading.

    References: ledger/README.md:976, ledger/README.md:981, src/lib/historia-da-proveniencia.mjs:29, ledger/claims/evora-prr-aprovado-2026.yml:98

14. **After the five acceptances, the crossing registry no longer shows when the site-side edit happened.**
    - Each row's `site_corrections` entry is dated 2026-08-20, the historical access date, for an edit made on 28.09.2026. It lists one change where two entries were added.
    - `exported_at` stays 2026-09-04, although the README defines it as when these bytes last changed, and they changed (`8d96…` → `21b0…`).
    - `corrections_at_export` now reads 8, while the README defines it as the count when the row crossed; the acceptance log gives that count as 6.

    References: ledger/cruzamentos/evora.json:671, ledger/cruzamentos/evora.json:672, ledger/cruzamentos/evora.json:682, ledger/README.md:793, ledger/README.md:795, ledger/README.md:796, design/especime-v3/medicoes/c1-2026-09-28/c1f/aceitar-evora-prr-aprovado-2026.log:2

15. **The new issue I170 sits after a blank line, outside the issues table.**
    - Line 178 is empty between the I169 row and the I170 row, so the Markdown table ends at I169.
    - The I170 row then renders as a loose line of pipes without the table's header.

    References: design/especime-v3/ISSUES.md:3, design/especime-v3/ISSUES.md:178, design/especime-v3/ISSUES.md:179

16. **The report's C1f commit table paraphrases two subjects instead of quoting them.**
    - The table gives `9514cc6e` as «C1e: entrega das provas e da paragem, filho da cabeça de código registada acima» and `cb43b2fc` as «C1f: decisão da direção e guião da retoma pela história do Git». The measured list has «C1e: entregar as provas e registar a paragem da história do PRR» and «C1f: a decisão do lugar de direção sobre a paragem da C1e (…)».
    - The column is headed «Assunto», and the C1e table above it quotes subjects verbatim.

    References: relatorio-construtor.md:812, relatorio-construtor.md:813, design/especime-v3/medicoes/c1-2026-09-28/c1f/medidas.json:182, design/especime-v3/medicoes/c1-2026-09-28/c1f/medidas.json:186

17. **The C1e and C1f sections state no cost figure and no duration, although the brief asks for the cost in tokens and seconds.**
    - Both sections only point to their `custo.json`, which holds token deltas (14 110 212 and 7 384 283 in total) and timestamps but no seconds.
    - The earlier sections of the report state the figures.

    References: relatorio-construtor.md:721, relatorio-construtor.md:858, design/especime-v3/medicoes/c1-2026-09-28/c1e/custo.json:27, design/especime-v3/medicoes/c1-2026-09-28/c1f/custo.json:27, brief.md:32

## «What is fine»

- Apart from the three copies in findings 1, 2 and 4, all 266 other files the diff touches match their copies line for line in every changed region, and the engine's `refresh.py` hashes to the value its gate recorded (design/especime-v3/medicoes/c1-2026-09-28/c1e/motor-commit.arvore.json:8).
- For all five rows the Git reading shows the same three events: creation with 2026-08-04 in `180f136d`; 2026-08-04 → 2026-08-18 in `8371e097` on 18.08 (17.08 snapshot); 2026-08-18 → 2026-08-20 in `8b7d9157` on 20.08 (19.08 snapshot). The diff's ten entries carry exactly those dates and values and the seat's two sentences (design/especime-v3/medicoes/c1-2026-09-28/c1f/acessos-git.json:5, diff.patch:63056, design/especime-v3/medicoes/c1-2026-09-28/prompts/PROMPT-c1f-codex.md:7).
- The Git controller accepts only a creation plus exactly two changes, compares every key including both reasons, and each of its ten plants gives one failure on the swapped field (design/especime-v3/medicoes/c1-2026-09-28/c1f/conferir-acessos.py:48, design/especime-v3/medicoes/c1-2026-09-28/c1f/conferir-acessos.py:95).
- The other four recovery-plan rows hash to their registry entries, and each `corrections_at_export` rose by exactly the two entries added (ledger/cruzamentos/evora.json:703, ledger/cruzamentos/evora.json:722, ledger/cruzamentos/evora.json:741, ledger/cruzamentos/evora.json:760).
- In the diff version the guard refused exactly the 16 entries the C1e table lists and none after C1f, with 8 controls and 29 plants (design/especime-v3/medicoes/c1-2026-09-28/c1e/proveniencia.json:187, design/especime-v3/medicoes/c1-2026-09-28/c1f/proveniencia.json:187).
- The three site gates read 0 on `cd555744` from their own files, with only measurement files uncommitted at each run (design/especime-v3/medicoes/c1-2026-09-28/portoes/c1f/build.codigo:1, design/especime-v3/medicoes/c1-2026-09-28/portoes/c1f/verify.codigo:1, design/especime-v3/medicoes/c1-2026-09-28/portoes/c1f/typecheck.codigo:1).
- The engine writes `inacessivel` only when the probe returned an error or no state, so «sem valor lido» / «no value read» holds for every entry it writes (motor/indicators/refresh.py:913).
- An unclassified transport failure is retried and asks the network watch again, and 16 real-client checks pass, including a cut after the status line with three attempts and one question to the watch (motor/indicators/refresh.py:480, motor/indicators/refresh.py:659, design/especime-v3/medicoes/c1-2026-09-28/c1e/motor-rede-real.json:37).
- The attempt wording, the calculated sentence and the label of the empty case are checked by one cell that the HTML gate runs on every receipt with a row (scripts/verificacao-legivel.mjs:83, scripts/gate-html.mjs:4394).
- The English reason of the EU household-debt row now writes «49,3», and the rendered page shows it (diff.patch:63041, built/en/ledger/divida-das-familias-2025-ue/index.html:2).
- F18 ran over both built Évora pages at the final head with 14 plants, and both editions carry `is-inicio-aberto` on the first segment only (design/especime-v3/medicoes/c1-2026-09-28/portoes/c1f/verify.log:1136, built/municipios/evora/index.html:3).
- On the final build the privacy check read 12 485 files with no finding and all eight plants biting; its result was extracted from the build log whose hash it records (design/especime-v3/medicoes/c1-2026-09-28/c1f/privacidade-dist.json:2).
- No machine path or personal name appears in any text file of the package. The only `.local` host is the generic example in an engine comment, and known positives were found by the same search (motor/indicators/refresh.py:248).
- All 50 C1f captures exist with matching digests and both rebuilt reasons, and the 12 frozen copies match their index (design/especime-v3/medicoes/c1-2026-09-28/c1f/capturas-depois.json:3, design/especime-v3/medicoes/c1-2026-09-28/c1f/paginas-depois/INDICE.json:14).
- The copies of `historia-do-valor.mjs` and of the PIB 2025 row still hash to the clean values in the previous plants register (design/especime-v3/critica/LEITURA-c1d-2026-09-28.plantas.json:1).
- The token figures in both cost files reproduce as differences of the recorded cumulative counts (design/especime-v3/medicoes/c1-2026-09-28/c1e/custo.json:27, design/especime-v3/medicoes/c1-2026-09-28/c1f/custo.json:27).
- The C1e counts in the report reproduce: 16 refused entries, 8 controls and 29 plants, 97 controls and 127 plants, 16 engine checks and 337 receipts (relatorio-construtor.md:629, design/especime-v3/medicoes/c1-2026-09-28/c1e/plantas-confianca.json:4, design/especime-v3/medicoes/c1-2026-09-28/c1e/motor-rede-real.json:79, design/especime-v3/medicoes/c1-2026-09-28/c1e/medidas.json:5259).
- The EU household-debt excerpt names the same indicator, unit, area and year as its row (ledger/claims/divida-das-familias-2025-ue.yml:24).
- The first C1f build stopped at the voice gate for the missing review-register entry, as the report says (design/especime-v3/medicoes/c1-2026-09-28/c1f/primeira-corrida/build.log:11349).
