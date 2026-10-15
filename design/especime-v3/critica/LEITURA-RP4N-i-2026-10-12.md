# A leitura a frio da passagem RP4-n-i pelo Claude Opus 5.5 (`xhigh`), 12.10.2026

*Lançada pelo lugar de direção às 17:31 UTC sobre o pacote do sítio de `56248a5f` (a fusão de `main` feita pelo lugar de direção, com os seis conflitos resolvidos e o seu diff no pacote) a `2559e296` (a cabeça do código `e5f114a8`) e do motor de `e2fd95f` a `cc75e21` (a passagem RP4-n-i do Codex `gpt-6-astra` em `high`, nas duas worktrees; os 49 ficheiros alojados conferidos pelo sha256, agora com o PDF do MAPA 4), com cinco estragos plantados nas cópias (`PLANTAS-RP4N-i-2026-10-12.json`, pelo `plantar.py` da M76), os registos inteiros, as exportações do livro, as dez páginas construídas e as 35 capturas; o total reportado pela ferramenta para o agente: 225 045 símbolos, em 10 minutos e 51 segundos, 93 chamadas de ferramentas. Os achados B1, M1, M2, M3 e o Minor 1 são as cinco plantas (todas mordidas); o M4 é o achado real (a RP4N-18, decidida pelo lugar de direção na §1.187) e os Minor 2 a 6 vão para a higiene como RP4N-19 a RP4N-23. O texto do leitor segue como foi entregue, em inglês, só com os caminhos da cópia anonimizados.*

# Cold reading · RP4-n-i (Claude Opus 5.5, 12.10.2026)

Paths are relative to `pacote-leitura-i/`. To check each copied file against its diff, I recomputed git blob ids: 126 of 129 match the diff's `index` lines. The three that do not match are B1, M2 and M3 below.

## Blocking

**B1. The engine row calls the penalty a "bonus".** `motor/publisher/recortes/penalizacao-legal-um-ano-antecipacao-2026.yml:4` reads `name: bonificação legal`. These all say `penalização legal`: `motor/diff.patch:42`, `ledger/claims/penalizacao-legal-um-ano-antecipacao-2026.yml:4`, and the source itself, `pensoes-copia-alojada.pdf` p. 273 («a penalização legal de 0,5% por mês»). «bonifica» does not occur on that page. The file's sha256 is `b8c1b982…`, not the `origin_sha256` `6d9c0cf3…` in `ledger/cruzamentos/pensao-rp4n.json:20`; replacing the word restores `6d9c0cf3…`. The engine's own guard `conferir_legal` (`motor/diff.patch:97-98`) raises on this name. So `motor.codigo 0` and `cruzamento.codigo 0` cannot belong to this file.

## Major

**M1. The finding 6 defect is still in the built English Method.** `built/en/method/index.html:1` (col. 10605) has `<a href="/en/ledger" title="rows with at least one field marked [a verificar]">`. The seat's receipt copy `i/recibos/metodo-en.html` has `[to verify]` on the same element. The report claims every English `title` now says `[to verify]` (`relatorio-construtor.md:1429,1448`). The language check runs over every page in `dist/` (`tests/cartao/rp4nh.mjs:64-67`) and would fail on this page, so the `verify.codigo 0` recorded for it does not hold.

**M2. A map label is copied wrong in the site's origins.** `src/data/origens-rp4n.json:563` has `"fim": "DESPESA TOTAL CONSOLIDADAS\n"`. MAPA 4 p. 6 prints «DESPESA TOTAL CONSOLIDADA», and so do the engine origin (`motor/content/13 Dominios/origens-rp4n.json:563`) and `motor/publisher/recortes/rp4n-origens.json:261`. The file hash is `9695cdc5…`, not the `exported_sha256` `ac5c75ce…` at `ledger/cruzamentos/origens-rp4n.json:7`. The blob id is `0cfc7fc3`, not the diff's `9ac3f7a4`. `check:cruzamento` would fail on this file.

**M3. The guard on new privacy occurrences is inverted.** `design/especime-v3/medicoes/rp4n-2026-10-06/privacidade-i.py:41` reads `assert excecao(commit,linha+' nova ocorrência')`. The diff's version (blob `d2e55dc6`) asserts `not`. As copied, the line asserts that a new occurrence inside an accepted commit gets the exception, which is the opposite of the mandate (`brief.md:10`). The hash can never match, so the script would also crash. That means `i/privacidade.json` cannot have come from this copy.

**M4. The privacy check is still red (RP4N-18).** `i/privacidade.codigo` is `1`, and `historico_sem_excecoes` is 98. Two of those history lines contain the username (commits `da2c8047` and `ca08fb63`, per `i/privacidade.json`). The acceptance for finding 8 ("0 with the exception declared") is not met. The builder did not widen the exception and escalated the case (`relatorio-construtor.md:1582`), which is the right call. The head and the diff are clean: `diff_grep_c 0`, `cabeca_sem_excecoes 0`. My own grep found 38 hits in `diff.patch`, all on removed lines (e.g. `diff.patch:133`). This needs the seat's decision before landing.

## Minor

1. **Cost arithmetic.** `relatorio-construtor.md:1688` says «excesso de 152 340». 552 340 − 300 000 = 252 340, and `i/custo.json:7` says `252340`.
2. **Two plant messages are not observed.** `privacidade-i.py:45-48` appends the messages for «prefixo novo num commit aceite» and «prefixo aceite noutro commit» as fixed strings; no check prints them. The report still lists them under «Plantas e mensagens reais» (`relatorio-construtor.md:1633-1634`). The real proof is the asserts at :41-42, and the report should say so.
3. **The phrase inventory is out of date.** `design/especime-v3/INVENTARIO-FRASES.md:3414-3417` still says every row without a re-reading keeps «ainda nenhuma»/«none yet». The new receipt strings (`src/i18n/strings.mjs:2482-2483, 4320-4321`) are not recorded there, unlike the C1d/C1e precedent.
4. **Editor's eye, ministries receipt.** Three identical captions are stacked: «definition by Entidade Orçamental · MAPA 4, page 6 ▸ Excerpt» (`capturas/rp4n-2026-10-06/i/ministerios-en-390.png`; `i/recibos/ministerios-en.html:1`). Nothing tells the reader which one is the consolidated total.
5. **Editor's eye, 390 px.** The proof link breaks mid-word: «Ope/n at/page/273» and «págin/a 273» (`legal-en-390.png`, `legal-pt-390.png`). `i/inspecao-visual.json:29` records no problem. This is probably older than this pass.
6. **Cost of this pass.** The target was 150 000 (`brief.md:18`) and the seat measured 405 094. The report gives no reason for this pass (`relatorio-construtor.md:1692`), although two attempts were refused (`portoes-i-tentativa1/2`).

## What is fine (reproduced)

- **Hosted files.** The inventory lists 49 files across 79 sentences, and all 49 are present. Each sha256 I recomputed matches `i/fontes-por-frase.json`, the report table (`relatorio-construtor.md:1494-1542`) and `motor/FICHEIROS-ALOJADOS-POR-FRASE.md`. The original manifest hashes to `4b9bc26f…`, and the pension PDF (`555936bd…`) matches both manifests.
- **Ministries sentence.** MAPA 4 p. 6 prints both labels and the consolidation note. The sentence is identical in all 16 rows and in both editions (`src/data/o-que-e-das-familias.mjs`, `tests/cartao/leituras-provadas.json`). It uses only the map's two labels.
- **Legal row.** «penalização legal» is the measure's own name in the paragraph below Figure 8.4 on p. 273. In both editions «O que foi conferido» says «Cópia alojada a 24.08.2026» and «Não há leitura na fonte registada…», with no `.linha-sem-resposta` or `.linha-selo-estado`. `built/livro-razao.{json,csv}` agree.
- **Pension rows.** Unchanged: `2026-08-24`, `hosted-copy`, and the row's own verification still shows.
- **Gates.** Build, verify, typecheck and engine all return 0 at `e5f114a8`/`cc75e21`. `cabeca` equals `cabeca.fim` and the status files are empty. Series and cruzamento return 0 at the same heads (`i/reconferencia-codigo/cabecas.json`).
- **Plants.** The attribute and copy plants bite in `portoes-i/verify.log:2481-2504`. The legal-name plant bites in `i/plantas-motor.log:1`. The attempt codes (125/1/1 and 0/1/0) match the files.
- **Captures.** All 35 sha256 values I recomputed match the report and `i/capturas-i.json`.
- **Merge.** `scripts/gate-html.mjs` keeps `conferirCaminhoFinal`, `tirarCodigoConferido`, `lerPaginaComCodigo`, `livroInteiro` and `ER1_RECIBOS` (`FUSAO-DE-MAIN-seis-ficheiros.patch:396-421`). The `ACERTOS` list keeps X18 to X25 and RP4N-9 (`:699-710`).
- **Engine scope.** The engine diff touches five files, none of them belonging to other runs.
- **Local paths.** No added line in `diff.patch`, `motor/diff.patch` or the merge patch has a local path or the username. A known positive was found first, so the search works.

**not yet**: the engine row and the site's origins differ from what the gates checked (B1, M2), the English Method still carries the Portuguese seal (M1), and the privacy check is red until the seat rules on RP4N-18 (M4).
