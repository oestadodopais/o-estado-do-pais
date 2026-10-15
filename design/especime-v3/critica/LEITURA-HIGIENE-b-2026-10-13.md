# Leitura curta da passagem de correção do bloco de higiene de 13.10.2026

*Lançada pelo lugar de direção às 22:24 UTC sobre o pacote do sítio de `80af5c2a` a `2dabb367` e do motor de `6bd8b70a` a `b4445499` (a passagem de correção do Codex `gpt-6-astra` em `high`, retomada na mesma sessão, pelo mandato `MANDATO-HIGIENE-b-2026-10-13.md`). O leitor: o Claude Opus 5.5 (a definição `leitor`, M26), em `high`, 126 358 símbolos, 31 chamadas de ferramentas, quatro minutos. As cinco plantas do lugar de direção (`PLANTAS-HIGIENE-b-2026-10-13.json`) foram as cinco mordidas: os achados 1 a 5. O achado 6 (Major) era real: o lugar de direção cortou a frase da EX1-12 e pediu ao mesmo leitor o veredicto sobre o corte, que segue no fim (129 072 símbolos no total do agente, dezoito segundos). Os achados 7 a 10 (Minor) ficam para a higiene seguinte, salvo o 8, que o lugar de direção corrigiu no escrivão (a saída dos processos num ficheiro e não num tubo). O texto do leitor segue como foi entregue, em inglês.*

## Blocking

1. **The copied `livro.mjs` tells Portuguese readers the opposite of the absence: «Campos da proveniência confirmados na fonte».** The diff adds `'Campos da proveniência por confirmar na fonte'`. Both built `saldo-natural` pages and `b/metadados.json` print «por confirmar». If the copy is what lands, every incomplete receipt's description in the Portuguese edition will claim its provenance was confirmed. References: src/lib/livro.mjs:122, diff.patch:1183430, built/livro-razao/saldo-natural-portugal-2025/index.html:1, design/especime-v3/medicoes/higiene-2026-10-13/b/metadados.json:16

2. **The copied explanation says «Os excertos citados explicam a diferença», and the word «não» is missing.** The diff, the audit row and the built page all say «não explicam». The copy claims an explanation exists that the page never gives. References: src/data/explicacoes/dinheiro-do-estado-2026.mjs:176, diff.patch:1183396, tests/cartao/leituras-provadas.json:16111, built/explicacoes/dinheiro-do-estado-2026/index.html

3. **The copied HIG-5 cell has its condition inverted (`if (provenienciaIncompleta(linha)) return [];`).** With this copy the cell skips exactly the rows it exists for. It would also fail every complete receipt, and the four plants could not bite. The diff has `if (!provenienciaIncompleta(linha))`, and the gate log shows the plants biting, so the log cannot come from this copy. References: tests/cartao/metadados.mjs:5, diff.patch:1183504, design/especime-v3/medicoes/higiene-2026-10-13/depois-b-2/verify.log:2459

## Major

4. **The report says the clerk captured 92 page captures; the receipt has 90.** `entrega-b/capturas.json` has 90 `resultados` (9 pages × 2 editions × 5 widths), 100 crops and 190 PNG. The measurement-folder copy of the report says 90. References: relatorio-construtor.md:318, design/especime-v3/medicoes/higiene-2026-10-13/RELATORIO.md:318, design/especime-v3/capturas/higiene-2026-10-13/entrega-b/capturas.json

5. **The copied engine lock file installs from `requirements-dev.txt`, while the diff says `requirements.txt`.** The copy also contradicts its own line 21 («os dez declarados»). References: motor/requirements.lock.txt:18, motor/diff.patch:15, motor/requirements.lock.txt:21

6. **The new EX1-12 sentence is about the project's citations, not the country, and its support cannot prove what it says.** The sentence is «Os excertos citados não explicam a diferença entre o total desta conta e o total por ministério». The page never prints either total, so a reader cannot see which difference is meant. No excerpt is visible in that paragraph either. The part is classed `leitura`, which reverses the EX1-c rule in the removed comment («nenhuma parte fica como leitura do projeto»). Its two `apoios` are positive descriptive literals, and two literals cannot support a negative. The report's claim that the execution-report glossary was checked has no file in the package. An editor would cut the sentence. References: src/data/explicacoes/dinheiro-do-estado-2026.mjs:174-177, diff.patch:1183386-1183391, tests/cartao/leituras-provadas.json:16164-16181, relatorio-construtor.md:314

## Minor

7. **The cell is not independent of the composer, despite what HIG-15 says.** It shares `provenienciaIncompleta` with `livro.mjs`. The composer drops fields by its own local regex `confirmado` (title, edition, access_date, reference_date). A row with a marked field outside the predicate's list would lose that field silently and pass both checks. `ledger.mjs` is not in the package, so this cannot be ruled out. References: src/lib/livro.mjs:110-120, tests/cartao/metadados.mjs:1, relatorio-construtor.md:310

8. **The clerk reads the commit's piped output only after the process exits.** A hook whose output fills the pipe buffer would block until the 30-minute kill. The gates branch has the same pattern. References: scripts/leituras/escrivao.py:167-179, scripts/leituras/escrivao.py:238-246

9. **Two measurements have no command shown.** The 569.256 s and code 0 come from `b/motor-commit.json`, which shows no command. `b/livro.json` gives a base but no end head. References: design/especime-v3/medicoes/higiene-2026-10-13/b/motor-commit.json:2-4, design/especime-v3/medicoes/higiene-2026-10-13/b/livro.json:2

10. **The mandate's capture proof for finding 5 cannot show the fix, because meta descriptions are invisible in a screenshot.** The real proof is the built HTML. References: brief.md:7, built/en/ledger/saldo-natural-portugal-2025/index.html:1

## «What is fine»

- All four gate codes in `depois-b-2` are 0, with start and end heads equal on both repositories (8797c798, b4445499). Reference: design/especime-v3/medicoes/higiene-2026-10-13/depois-b-2/verify.codigo:1.
- Both editions of `saldo-natural` carry the absence sentence in `description` and `og:description`; the two complete JD1 receipts do not. Reference: built/en/ledger/saldo-natural-portugal-2025/index.html:1.
- The four HIG-5 plants bite at the logged lines, and the gate runs the cell on every receipt page. References: depois-b-2/verify.log:2459-2467, scripts/gate-html.mjs:5096.
- V1-39 reads «Parcial» in the report table, with the reason, and the V1-d section says the same. References: relatorio-construtor.md:86, design/especime-v3/medicoes/v1-2026-10-07/LEIA-ME.md:162.
- The two JD1 receipts have 5 widths × 2 editions with no overflow; I read the custo-do-stock 1 280 px (EN) and juros-pib 390 px (PT) crops. Reference: entrega-b/capturas.json.
- The site diff touches no ledger file, and the numbers on the four pages are unchanged. Reference: diff.patch headers.
- The engine diff makes the lock-file instructions runnable again. Reference: motor/diff.patch:13-16.
- The dated comment is restored. Reference: src/lib/livro.mjs:97-98.

not yet: three copied files disagree with the diff in ways that change what a page says or disable a gate (findings 1 to 3), and the new EX1-12 sentence (finding 6) is a real Major for the editorial seat.

## O veredicto do mesmo leitor sobre o corte da frase (a pedido do lugar de direção, 22:44 UTC)

Verdict on the EX1-12 cut, as you described it (I did not see the diff file itself: the package folder is unchanged, so I checked your description against the package's audit file). The cut resolves finding 6. The sentence about the project's own excerpts is gone. So are the `leitura` part, which reversed the EX1-c rule, and its two positive literals, which could not support a negative. What stays is the descriptive half, and its supports in the package's audit are the two dados-gov-oe-despesa-funcional excerpt literals and the four row names (health 07, education 09, both editions). The audit entry is consistent with the rendered paragraph. I joined the two surviving `diz` parts and the final «.» with a script on the package copy of `tests/cartao/leituras-provadas.json`. They give, character by character, «A conta por função organiza a despesa da administração central por finalidade, como a saúde ou a educação.» and «The count by function organises central government expenditure by purpose, such as health or education.» These are exactly the new `pt` and `en` paragraph strings you quote. Dropping «rp4n-mapa-ministerios» from `origens` is also correct: in the package audit its only use is the removed `leitura` part's support (one use in the whole explanation, at seccoes[1].conteudo[2].paragrafo[0]), so leaving it would list an origin that nothing supports. I see nothing wrong in the diff as described. Two caveats. First, the gates have not been re-run on the new head, so the explanation audit and the build still have to pass there. Second, the page now gives no reason why the function and ministry shares differ. That is honest, because the sealed excerpts do not give one, and it is no longer a defect.

fine: the cut removes the Major, and the remaining three parts reproduce both editions exactly, but this rests on the diff as described. Re-run the gates on the new head before landing.
