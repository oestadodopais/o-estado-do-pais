# A leitura curta da passagem TP1-c pelo Codex `gpt-6-astra` (`high`), 07.10.2026

*Lançada pelo lugar de direção às 10:44 UTC sobre o diff de `c9d7233f` a `69f2fae8`, com os registos inteiros no pacote e sem plantas; acabou às 10:46 UTC; a linha «tokens used» do `.eventos.log`: 60 830. O achado 1 (as conferências registadas sobre uma árvore suja, com as capturas e os registos antigos por registar) corrige-se na TP1-d: o guião das conferências passa a recusar uma árvore suja e uma construção de outra cabeça, e as conferências correram outra vez sobre a árvore limpa; o 2 é a convenção do projeto (a duração e os símbolos citam-se do `.eventos.log`, que fica no bloco de notas da sessão; a corrida do GitHub cita-se na aterragem). O texto do leitor fica como veio.*

## Blocking

None established.

## Major

1. **The checks were recorded against a dirty working tree, so the required clean-head verification is not established.** `cabeca.json` records 32 uncommitted entries, not zero; the report accurately repeats 32. The runner records HEAD and counts modified tracked files, but neither refuses a dirty tree nor records which files differ. Consequently, the matching head identifiers cannot establish that the checks exercised the committed code alone. References: design/especime-v3/medicoes/tp1-2026-10-07/conferencias/cabeca.json:1, design/especime-v3/medicoes/tp1-2026-10-07/conferencias/conferir-tp1.sh:8, relatorio-construtor.md:11.

## Minor

2. **The review timings, token totals and GitHub success remain unsupported measurements in this package.** The added headers repeat 10:09–10:15 and 117,337 tokens, and 10:29–10:32 and 73,911 tokens, without supplying the cited execution logs. §1.182 also states that GitHub is green without a supplied result; calling the missing evidence a project convention does not reproduce it. References: design/especime-v3/critica/LEITURA-TP1-2026-10-07.md:3, design/especime-v3/critica/LEITURA-TP1-b-2026-10-07.md:3, DECISIONS.md:13856.

## «What is fine»

3. Both corrected labels explain the displayed 2,560 as attribution rows, match the predicate’s stated meaning, and no longer claim decision-making authority: src/data/metodo.mjs:653, src/lib/prova.mjs:501, src/lib/prova.mjs:800, built/metodo/index.html:1, built/en/method/index.html:1.

4. Recomputed normalized SHA256 prefixes are `b7557b74b6d0` for Sobre and `2d1e28a38de4` for Método, exactly matching §1.182: src/data/sobre.mjs:1, src/data/metodo.mjs:1, DECISIONS.md:13846.

5. All fourteen supplied `.codigo` files contain zero, match the report’s table, and correspond to the supplied runner’s fourteen commands: relatorio-construtor.md:29, design/especime-v3/medicoes/tp1-2026-10-07/conferencias/conferir-tp1.sh:11.

6. All twenty PNG hashes and dimensions match their records, all four HTML hashes match, and captures and checks name the same head: design/especime-v3/capturas/tp1-2026-10-07/capturas.json:2, design/especime-v3/capturas/tp1-2026-10-07/capturas.json:10, design/especime-v3/capturas/tp1-2026-10-07/capturas.json:312.

7. The report reproduces exactly from its generator, distinguishes Portuguese from the changed English clause, and records TP1-6 and TP1-7: relatorio-construtor.md:7, relatorio-construtor.md:20, design/especime-v3/medicoes/tp1-2026-10-07/relatorio.py:32.

8. All ten diff hunks match the copied files exactly; changes are confined to the bilingual label and records, with no gate or ruler changes: diff.patch:1, diff.patch:109, diff.patch:144.

«not yet», the required clean-head check is contradicted by the recorded 32 uncommitted entries.