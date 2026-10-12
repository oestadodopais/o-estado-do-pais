# A leitura curta da passagem TP1-b pelo Codex `gpt-6-astra` (`high`), 07.10.2026

*Lançada pelo lugar de direção às 10:29 UTC sobre o diff de `07837aec` a `c9d7233f`, sem plantas (a passagem só mudou prosa e textos governados); acabou às 10:32 UTC; a linha «tokens used» do `.eventos.log`: 73 911. Os achados 1 e 3 corrigem-se na TP1-c (o rótulo da regra 10 diz a atribuição e não a decisão; o relatório distingue o português do diretor da tradução inglesa); o 2 é a forma do pacote (os códigos ficaram de fora por o relatório não citar as linhas pela forma do M-A), e os pacotes seguintes levam os registos inteiros; o 4 é a convenção do projeto (a duração e os símbolos de uma leitura citam-se do `.eventos.log`, que não entra no repositório). O texto do leitor fica como veio.*

## Blocking

None established.

## Major

1. **The new rule-10 label makes a stronger claim than the supplied counting definition proves.** Both Method pages describe 2,560 rows as naming whoever “decided the value”. The predicate counts non-empty `attributed_to` fields; its description says attribution to whoever the document names, without establishing that person’s decision-making role. Rule 10 supplies the intended narrative, but the underlying rows are absent, so that equivalence and the total cannot be verified here. The label removes unexplained “credit” terminology, but I would not print either edition’s stronger interpretation without that evidence. References: src/data/metodo.mjs:635, src/data/metodo.mjs:653, src/lib/prova.mjs:501, src/lib/prova.mjs:800, built/metodo/index.html:1, built/en/method/index.html:1.

2. **The package does not substantiate the fourteen reported exit codes, including the required final-head `check:voz` result.** The report promises `.codigo` files and `conferir-tp1.sh`, but neither is present. The supplied voice log prints a successful summary and its command; it does not record an exit code or bind itself to a head. The separate head record cannot establish that connection, and the package’s report checker itself records exit code 1. References: relatorio-construtor.md:24, relatorio-construtor.md:38, design/especime-v3/medicoes/tp1-2026-10-07/conferencias/check-voz.log:3, design/especime-v3/medicoes/tp1-2026-10-07/conferencias/cabeca.json:1, numeros-do-relatorio.txt:31.

## Minor

3. **The regenerated report incorrectly says the director’s About text is unchanged.** The English paragraph changed, as the diff and copied source demonstrate. Portuguese is unchanged; the report and its generator fail to make that distinction. References: relatorio-construtor.md:7, design/especime-v3/medicoes/tp1-2026-10-07/relatorio.py:32, diff.patch:463, src/data/sobre.mjs:66.

4. **The newly recorded review duration, token cost and GitHub success lack supporting evidence here.** §1.182 states 10:09–10:15 UTC and 117,337 tokens, but the copied review contains neither timing nor usage records. No cited `.eventos.log` or GitHub result is supplied, so these remain claims rather than reproduced measurements. References: DECISIONS.md:13854, DECISIONS.md:13856, relatorio-construtor.md:49.

## «What is fine»

5. The explanation now accompanies the first occurrence in both Method editions, the complete paragraphs match the source exactly, and all four TP1 case rows match source and rendered text character for character: src/data/politica-ia.mjs:336, design/especime-v3/INVENTARIO-FRASES.md:4223, built/metodo/index.html:1, built/en/method/index.html:1.

6. All 32 diff hunks match the copied files; changes remain within the three corrections and records, including the additional explanatory About comment: diff.patch:1, diff.patch:389, diff.patch:443.

7. Both About paragraphs match their sources, the English word-order correction renders exactly, and recomputed stamps `b7557b74b6d0` and `f87a90248f14` match §1.182’s `sobre · metodo` entry: src/data/sobre.mjs:62, built/sobre/index.html:1, built/en/about/index.html:1, DECISIONS.md:13844.

8. TP1 is registered as read, both outstanding findings remain explicitly recorded, and this package actually contains all twenty PNGs with matching hashes, alongside matching hashes for all four HTML pages: design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:682, relatorio-construtor.md:18, relatorio-construtor.md:19, design/especime-v3/capturas/tp1-2026-10-07/capturas.json:10.

«not yet», the decision-maker interpretation remains unproven and the required exit-code evidence is missing.