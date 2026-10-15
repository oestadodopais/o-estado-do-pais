# A leitura curta da passagem EX1-e pelo Claude Opus 5.5 (`high`), 12.10.2026

*Lançada pelo lugar de direção às 11:28 UTC sobre o pacote de `e8deccc1` a `97cec12d` (a passagem EX1-e do Codex `gpt-6-astra` em `high`), com cinco estragos plantados nas cópias (`PLANTAS-EX1-e-2026-10-12.json`), os registos inteiros, as oito capturas, as cinco linhas e as origens seladas; o total reportado pela ferramenta para o agente: 165 551 símbolos, em 6 minutos e 5 segundos, 39 chamadas de ferramentas. Os achados 1, 2, 3, 4 e 5 são as cinco plantas (todas mordidas); os 6 e 7 são achados reais Major, os 8 a 11 Minor (o 11, o `typecheck` em 0 s, é o compilador nativo do TypeScript 7, provado com um erro plantado a 12.10, M67). O que o lugar de direção decidiu está em `design/observatorio/mandatos/MANDATO-EX1-f-2026-10-12.md`. Sem travessões na prosa do cabeçalho; o corpo é a leitura tal como o leitor a escreveu, em inglês.*

# Cold read, EX1-e (Claude Opus 5.5), 12.10.2026

## Blocking

1. **The Portuguese built page says the deficit is larger than the full-year forecast. It is smaller.** The page prints «é um défice maior do que o que o Orçamento previa para o ano inteiro». |−845,8| < |−1 789,8|, so `comparaSaldos` picks `deficitMenor`. The report, the capture manifest and the 1 280 px capture all say «menor», so the page in this package is not the page that was captured. References: built/explicacoes/dinheiro-do-estado-2026/index.html:2, ledger/claims/execucao-2026-08-saldo-global-administracao-central-seguranca-social.yml:9, ledger/claims/oe-2026-saldo-global-administracao-central-seguranca-social.yml:9, design/especime-v3/medicoes/ex2-2026-10-06/capturas-ex1e.json:98, relatorio-construtor.md:452

2. **The English built page says «it is a larger deficit». Its own declaration says «smaller».** The EN `deficitMenor` branch reads «a smaller deficit», and so do the manifest and the 390 px capture. The built HTML contradicts all three. References: built/en/explainers/dinheiro-do-estado-2026/index.html:2, src/data/explicacoes/dinheiro-do-estado-2026.mjs:232, design/especime-v3/medicoes/ex2-2026-10-06/capturas-ex1e.json:109, relatorio-construtor.md:460

3. **The copied declaration's PT `deficitMenor` branch reads «é um défice maior». The diff adds «menor».** This is a false statement for the very case that selects it, and the two editions disagree (EN line 232 says «smaller»). If this copy is the head, it is what produces finding 1. References: src/data/explicacoes/dinheiro-do-estado-2026.mjs:213, diff.patch:2660, src/data/explicacoes/dinheiro-do-estado-2026.mjs:232

4. **The copied declaration restores «, que o Orçamento também prevê» in the interest sentence.** The diff, the audit and both built pages carry the short sentence. The report states that no sealed literal supports this clause, and the mandate allowed it only with support. References: src/data/explicacoes/dinheiro-do-estado-2026.mjs:282, diff.patch:2704, tests/cartao/leituras-provadas.json:16676, relatorio-construtor.md:439

## Major

5. **The report claims 28 balance scenarios. The file holds 26.** `explicacao.json` lists 26 scenarios, which is 13 cases in `saldos.mjs` times 2 languages. The report generator writes `cenarios.length`, so «28» is not what the machine wrote. References: relatorio-construtor.md:481, tests/explicacoes/saldos.mjs:17, design/especime-v3/medicoes/ex2-2026-10-06/relatar-ex1e.mjs:46

6. **No ruler ties a branch's words to the case that selects it, so a swapped branch text passes every gate.**
   - The scenarios assert only `rendido.includes(t[ramo][0])`.
   - X10 checks only that the branch keys are present.
   - The accounting rule keys branches by their text, so a text shared by a chosen and an unchosen branch is allowed.
   - The «comparação dos módulos invertida» plant edits only the rendered page.

   With the copy at line 213, both `deficitMaior` and `deficitMenor` render «maior», and all of these stay green. References: tests/explicacoes/saldos.mjs:45, tests/explicacoes/explicacao.mjs:422, tests/explicacoes/explicacao.mjs:614, tests/explicacoes/explicacao.mjs:671, tests/explicacoes/explicacao.mjs:838

7. **Two-minute test: the balance sentence reads as "better than the Budget", and the page cannot support that.** It compares an eight-month cumulative to a twelve-month forecast. Nothing tells a lay reader whether the year is on track. The sealed excerpt also carries the same-period figure for 2025, +1 304,5. I inferred the column meanings from the despesa row, and the arithmetic holds: 80 464,5/130 971,6 = 61,4 %, and 80 464,5/72 877,7 = +10,4 %. So January to August moved from a surplus to a deficit, and the page does not say so. References: src/data/explicacoes/dinheiro-do-estado-2026.mjs:213, ledger/claims/execucao-2026-08-saldo-global-administracao-central-seguranca-social.yml:30, ledger/claims/execucao-2026-08-despesa-efetiva-administracao-central-seguranca-social.yml:30

## Minor

8. **«É outra conta, diferente da das administrações públicas de 2025» points forward to a paragraph that calls that account «as contas públicas».** A first-time reader cannot tell which account is meant. The report concedes the order. References: src/data/explicacoes/dinheiro-do-estado-2026.mjs:260, relatorio-construtor.md:440

9. **The opening says the classification "counts the transfers between administrations". Two sections later the page says the function count is "without … the transfers between its services".** The page never says these are different transfers. References: src/data/explicacoes/dinheiro-do-estado-2026.mjs:101, src/data/explicacoes/dinheiro-do-estado-2026.mjs:176

10. **The «sinal da previsão trocado» plant writes text that no branch can render («um excedente de (»).** It proves that the equality check bites, not the sign logic. Only the scenarios prove the sign logic. References: tests/explicacoes/explicacao.mjs:844

11. **The typecheck still runs in 0 s, and its log holds only the npm header.** This was carried over. References: design/especime-v3/medicoes/ex2-2026-10-06/portoes-e/typecheck.inicio:1, design/especime-v3/medicoes/ex2-2026-10-06/portoes-e/typecheck.fim:1

## «What is fine»

12. The resolver and the cell's independent count agree on `deficitMenor` for −845,8 against −1 789,8 (src/lib/explicacoes.mjs:296, tests/explicacoes/explicacao.mjs:521).
13. In the diff, all ten branches in both languages are true for their case (diff.patch:2659, diff.patch:2684).
14. X10 requires all ten branches. The 38 isolated removals are 12 for `sinal`, 6 for `compara` and 20 for `comparaSaldos`, as recorded in explicacao.json (tests/explicacoes/explicacao.mjs:94).
15. The accounting rule has its own message and reads `main` both with and without the seals. The old per-paragraph absence loop is gone, and both coexistence controls have empty errors (tests/explicacoes/explicacao.mjs:672, diff.patch:3690).
16. The perimeter plant leaves `data-claim` and `href` untouched and bites through the X6 equality, not X8 (tests/explicacoes/explicacao.mjs:853).
17. The interest location and the promise of a later update are gone. The transfers clause cites a literal that exists in origens.mjs, and the interest sentence is a `conta` part guarded by `sem_linhas` (src/data/explicacoes/origens.mjs:64, tests/cartao/leituras-provadas.json:14587, tests/cartao/leituras-provadas.json:16684).
18. Seven gate codes are 0, and `cabeca` equals `cabeca.fim` at 5256a36b (design/especime-v3/medicoes/ex2-2026-10-06/portoes-e/cabeca:1).
19. All eight capture sha256 values, which I computed, match the manifest (design/especime-v3/medicoes/ex2-2026-10-06/capturas-ex1e.json:121).
20. There are 34 of 34 plants, 117 leaves and 165 parts, and every plant name in the report is in the JSON (design/especime-v3/medicoes/ex2-2026-10-06/portoes-e/explicacao.log:1).
21. The diff contains no machine path, and the cost line does not invent a number (relatorio-construtor.md:564).

Editor's question: I would not print the page as it is. I would rewrite the balance comparison (finding 7) and the forward reference (finding 8).

not yet: both built pages say «maior»/«larger» for a smaller deficit, and the copied declaration disagrees with the diff twice (findings 1 to 4). The gates also cannot catch a branch whose words contradict its case (finding 6).
