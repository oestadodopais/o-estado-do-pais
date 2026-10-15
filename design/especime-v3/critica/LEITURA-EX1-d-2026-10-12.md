# A leitura a frio da passagem EX1-d pelo Claude Opus 5.5 (`high`), 12.10.2026

*Lançada pelo lugar de direção às 10:49 UTC sobre o pacote de `acc8cb3a` a `e8deccc1` (a passagem EX1-d do Codex `gpt-6-astra` em `high`, construída a 11.10.2026 no ramo `ex1d-2026-10-11`), com cinco estragos plantados nas cópias (`PLANTAS-EX1-d-2026-10-12.json`), os registos inteiros, as oito capturas e as quatro linhas do livro que as frases usam; o total reportado pela ferramenta para o agente: 132 489 símbolos, em 5 minutos e 41 segundos, 39 chamadas de ferramentas. Os achados 1, 2, 3, 7 e 9 são as cinco plantas (todas mordidas; o leitor deu a 9 como anterior à passagem, e era a planta P4); os 4, 5 e 6 são achados reais Major, os 8, 10, 11 e 12 Minor. O que o lugar de direção decidiu sobre cada um está em `design/observatorio/mandatos/MANDATO-EX1-e-2026-10-12.md`. O prompt da leitura está na pasta da sessão, fora do repositório. Sem travessões na prosa do cabeçalho; o corpo é a leitura tal como o leitor a escreveu, em inglês.*

# Cold read, EX1-d (Claude Opus 5.5), 12.10.2026

## Blocking

1. **The Portuguese built page calls a negative balance a surplus.** The execution paragraph prints «−845,8 milhões de euros, um excedente (recebeu mais do que gastou)». The row value is −845,8, so the `sinal` token must choose `negativo` («um défice»). The report and the capture manifest both quote «um défice», and X6 would refuse this page, so the page in the package is not the page that was gated. References: built/explicacoes/dinheiro-do-estado-2026/index.html:2, ledger/claims/execucao-2026-08-saldo-global-administracao-central-seguranca-social.yml:9, src/data/explicacoes/dinheiro-do-estado-2026.mjs:207, design/especime-v3/medicoes/ex2-2026-10-06/capturas-ex1d.json:98, relatorio-construtor.md:383

2. **The English built page inverts the annual comparison.** It prints «the cumulative balance is below what the Budget forecast». Because −845,8 > −1 789,8, `compara` picks `maior` («above»), and the report, the manifest and the 390 px capture all say «above». So the two editions say opposite things. References: built/en/explainers/dinheiro-do-estado-2026/index.html:2, src/data/explicacoes/dinheiro-do-estado-2026.mjs:219, ledger/claims/oe-2026-saldo-global-administracao-central-seguranca-social.yml:9, design/especime-v3/medicoes/ex2-2026-10-06/capturas-ex1d.json:107

3. **The copied declaration contradicts the diff and publishes the branch that EX1-6 rejected.** The copied file reads «que entra na função das operações da dívida». `diff.patch` adds «que entra noutra classificação», and the audit and the built page say the same as the diff. EX1-6 says no sealed origin confirms that the debt-operations function counts the interest. If the copy is the real head, an unconfirmed claim goes on the page. References: src/data/explicacoes/dinheiro-do-estado-2026.mjs:260, diff.patch:1585, tests/cartao/leituras-provadas.json:16245, relatorio-construtor.md:369

## Major

4. **«Acima do que o Orçamento previa» reads the wrong way for a lay reader.** −845,8 is "above" −1 789,8 only as a signed number. A lay reader will take «acima» to mean that the deficit is bigger than planned, which is the opposite of what the numbers say. EX1-7 itself concedes that the comparison says nothing about being on track. The page would print correctly as follows. PT: «um défice que, até agosto, é menor do que o défice de 1 789,8 milhões de euros que o Orçamento previa para o ano inteiro». EN: «a deficit which, by August, is smaller than the 1 789,8 million euro deficit the Budget forecast for the full year». References: src/data/explicacoes/dinheiro-do-estado-2026.mjs:208, src/data/explicacoes/dinheiro-do-estado-2026.mjs:210, relatorio-construtor.md:370

5. **The interest sentence still contradicts the opening, and its supports do not say what it says.** The opening says the function classification "counts the interest on the debt". The new sentence says the interest "enters another classification". A reader cannot hold both, so finding 8 survives in a new form. The two literals attached to «e que entra noutra classificação», «Classificação das Funções do Governo» and «Public debt transactions», say nothing about another classification. Meanwhile the opening's «conta os juros da dívida» rests on the same «Public debt transactions» literal that EX1-6 judges does not make interest explicit. So either the opening is unsupported or the rejected wording was supported. References: tests/cartao/leituras-provadas.json:14587, tests/cartao/leituras-provadas.json:16245, tests/cartao/leituras-provadas.json:16257, src/data/explicacoes/dinheiro-do-estado-2026.mjs:99, relatorio-construtor.md:369

6. **The reshaped X6 absence check never fires on its own, and the page-wide refusal is gone.** Each rendered paragraph must already equal the recomposed text character for character (line 612), so an unchosen branch inside its own paragraph always trips that equality first. The new per-paragraph loop can therefore never fire by itself. Unchosen or guarded text placed in `main` outside a declared paragraph, and without the declared mark, is no longer refused. Every EX1-d plant bites on `/X6 ·/`, which matches the equality message, so no plant shows the new loop working. References: tests/explicacoes/explicacao.mjs:612, tests/explicacoes/explicacao.mjs:617, tests/explicacoes/explicacao.mjs:619, tests/explicacoes/explicacao.mjs:741

7. **The report's perimeter table gives the execution balance as −854,8, while the row is −845,8.** 79 618,7 − 80 464,5 = −845,8, so the identity the report claims beside the table fails for the figure it prints. «854,8» appears in no other file in the package, yet `numeros-do-relatorio.txt` flags only 2717 and 2716. References: relatorio-construtor.md:361, ledger/claims/execucao-2026-08-saldo-global-administracao-central-seguranca-social.yml:9, numeros-do-relatorio.txt:6

## Minor

8. **The perimeter plant bites on the seal alone.** It rewrites `data-claim` without the seal's `href` and accepts an `X8` complaint (line 754), so it bites even if X6 misses a wrong-perimeter value. The row it uses, `…-administracao-central`, is not in the package. References: tests/explicacoes/explicacao.mjs:750, tests/explicacoes/explicacao.mjs:754

9. **X10 requires only `maior` and `menor` for `compara`, not three branches.** Only the renderer requires `igual`. This predates the pass. References: tests/explicacoes/explicacao.mjs:414, src/lib/explicacoes.mjs:278

10. **The interest sentence brings back house-talk that X17 removed for that reason.** «quando as linhas dos juros existirem no livro-razão, esta explicação diz quanto são», like «esta explicação mostra acima», talks about the project, not the country. The mandate asked for it. References: src/data/explicacoes/dinheiro-do-estado-2026.mjs:298, diff.patch:1585

11. **Editor's read of the section.**
    - Two paragraphs in a row open «Até agosto de 2026».
    - «fecharam» / «closed» implies a final result for a cumulative to August.
    - The 2025 general-government surplus sits next to the central-government-and-social-security deficit without saying they are different accounts. The row's own note says they are not comparable.

    References: src/data/explicacoes/dinheiro-do-estado-2026.mjs:205, ledger/claims/execucao-2026-08-saldo-global-administracao-central-seguranca-social.yml:45

12. **Some claims cannot be checked from the package.**
    - The sealed origins file (`src/data/explicacoes/origens.mjs`) is not in the package, so the literals cannot be checked against the excerpts here.
    - The typecheck ran in 0,19 s, and its log holds only the npm header.

    References: tests/explicacoes/explicacao.mjs:65, design/especime-v3/medicoes/ex2-2026-10-06/portoes-d/tempos.json:432

## «What is fine»

13. All four rows come from the same p. 49 table and the same document, and the execution rows share one unit. Revenue minus spending equals the balance exactly, −845,8 (ledger/claims/execucao-2026-08-saldo-global-administracao-central-seguranca-social.yml:22, ledger/claims/execucao-2026-08-receita-efetiva-administracao-central-seguranca-social.yml:9).
14. Every number in the new paragraph is a token, with no figure written by hand, and the seals point at the right rows in both editions (src/data/explicacoes/dinheiro-do-estado-2026.mjs:205, built/en/explainers/dinheiro-do-estado-2026/index.html:2).
15. I computed the sha256 of all 8 captures and each matches the manifest; the captures show «défice»/«deficit» and «acima»/«above» (design/especime-v3/medicoes/ex2-2026-10-06/capturas-ex1d.json:117).
16. All five gate codes are 0, and `cabeca` equals `cabeca.fim` at 4a18402f (design/especime-v3/medicoes/ex2-2026-10-06/portoes-d/cabeca:1).
17. The X cell reports 94 leaves, 139 parts, 2 pages and 29 of 29 plants, as the report says (design/especime-v3/medicoes/ex2-2026-10-06/portoes-d/explicacao.log:1).
18. Apart from finding 3, the copied files agree with the diff line for line, and the cost line does not invent a count (relatorio-construtor.md:424).

Editor's question: I would not print the page as it is. I would rewrite the comparison (finding 4) and the interest sentence (finding 5).

not yet: the built pages contradict the sign and the comparison (findings 1 and 2), the copied declaration carries the unconfirmed interest wording (finding 3), and the comparison and the interest sentence mislead a lay reader.
