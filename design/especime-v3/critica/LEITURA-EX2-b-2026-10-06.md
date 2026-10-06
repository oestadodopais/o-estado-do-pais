# A segunda leitura do EX2 (a passagem EX2-b) pelo Claude Opus 5.5, 06.10.2026, das 14:25 às 14:50 UTC

*A leitura curta que a M48 pede quando uma correção muda o que uma página diz ou um portão. O pacote (178 ficheiros, 19 MB, o diff de `167d86b8` a `b8b9e74f`, as vistas e as células inteiras, as páginas construídas da leitura da semana e do índice nas duas edições e dois recibos) levou cinco estragos plantados só nas cópias, registados por sha256 em `LEITURA-EX2-b-2026-10-06.plantas.json`: a página portuguesa a dizer «reviu para baixo» num valor que subiu (p1), a cadeia inglesa com «upward» (p2), a regra do grupo desligada na célula (p3), o índice português com 17,8 (p4) e o relatório com «2 definições com algarismos» (p5). O leitor mordeu os cinco (os achados 1, 7, 3, 2 e 4). O veredicto: «not yet» só pelas cópias plantadas; confirmadas as plantas, o ramo tem só os Minor e o que já estava adiado. As decisões do lugar de direção sobre o resto: o 5 (as referências de alto e baixo e o ano de base) fica no bloco dos recibos (EX2-3), como o relatório diz; o 6 (o editor cortaria a secção «só na forma de escrever» e a contagem de proveniência) adota-se como EX2-4 para a passagem seguinte da leitura da semana (as duas coisas passam para a página das correções, onde são registo e não leitura), e aterra-se agora porque a página é verdadeira e clara; o 8 (a regra «nunca o título da fonte» vale pelos dados de hoje e não pela célula) e o 10 (a A4 deixou de ler a bandeira `titleUnverified`; a célula passa a exigir que, com a bandeira posta, a edição inglesa mostre o título português com `lang="pt"`) ficam como EX2-5 para o bloco de higiene; o 9 (os registos das plantas da A4, da M3 e da L1 numa cabeça intermédia) fica anotado como EX2-6. Símbolos da leitura: o total reportado pela ferramenta vai no registo da aterragem.*

## Blocking

**1. The Portuguese weekly page says the source revised the unit labour cost «para baixo» while printing 17,7 → 17,9.**
The same entry carries `data-semana-palavra="subiu"`. The English page says «revised it upwards», and the builder's measurement and report both say «a fonte reviu para cima». The packaged file hashes to 468ae405…, not the c1e46967… the builder measured, so it is not the page the gates passed. W2 composes the word from its own count and would refuse it. As packaged, a reader is told the opposite of what the two numbers show.
`built/explicacoes/leitura-da-semana/index.html:3, built/en/explainers/weekly-reading/index.html:3, design/especime-v3/medicoes/ex2-2026-10-06/entrega-b.json:22, design/especime-v3/medicoes/ex2-2026-10-06/entrega-b.json:26, relatorio-construtor.md:221, src/i18n/strings.mjs:1841`

**2. The Portuguese index prints 17,8 as the new unit labour cost, a value that no record of this row holds.**
The Portuguese receipt prints 17,9. The English index, both weekly pages and the builder's measurement all read 17,7 → 17,9. The file hashes to 29a858dc…, not the measured 363aaef8…. W2 and M3 would refuse it, but as packaged the page publishes an unmeasured number.
`built/indice/index.html:4, built/livro-razao/custo-unitario-do-trabalho-2024/index.html:2, built/en/index/index.html:4, design/especime-v3/medicoes/ex2-2026-10-06/entrega-b.json:232, design/especime-v3/medicoes/ex2-2026-10-06/entrega-b.json:236, relatorio-construtor.md:289`

## Major

**3. In the copy, the group rule is switched off (`if(false && …)`): it differs from the diff, refuses the corrected pages and accepts the old repetition.**
The diff adds `if(grupos.at(-1)?.chave===chave)`. With the copy, every row is its own group: the morning's repeated 2024/2025 definitions would pass; the corrected pages fail on the three 2024 rows («o grupo tem 0 frases»), so every W4 plant loses its clean control; no group has two rows, so `repetido` is undefined and the «definição repetida/em falta no grupo» plants are silently never registered. The report's rows saying these plants bit cannot be reproduced from this copy.
`tests/explicacoes/o-que-e.mjs:21, diff.patch:59357, tests/explicacoes/o-que-e.mjs:39, tests/explicacoes/o-que-e.mjs:160, relatorio-construtor.md:61, relatorio-construtor.md:62`

**4. The report says «2 definições com algarismos». Every file says 0, and the report's own line 32 says the definitions have no digits.**
`passagem-b.json` records 0 on each page, and I count 0 digits in the 22 definitions shown. Regenerating the report from `escrever-relatorio.mjs` (to stdout only) gives «0». So does the in-folder `LEIA-ME.md`, whose hash is the one `artefactos-b.json` recorded; line 39 is the only line that differs. The root number check counted this «2» as found, so it does not tie a number to its field.
`relatorio-construtor.md:39, relatorio-construtor.md:32, design/especime-v3/medicoes/ex2-2026-10-06/LEIA-ME.md:39, design/especime-v3/medicoes/ex2-2026-10-06/passagem-b.json:173, design/especime-v3/medicoes/ex2-2026-10-06/artefactos-b.json:412, numeros-do-relatorio.txt:5`

**5. Two-minute test on the weekly page: three kinds of number still say nothing about their reference.**
Unit labour cost 2024 (17,9): nothing says whether a 17,9 % rise in three years is high or low. Investment 2024/2025 (20,5 and 21,0 % of GDP) and EU R&D 2024 (2,26 %): no reference says whether these shares are high or low, and the EU figure has no Portuguese one beside it. Real GDP per head (20 520 and 20 700): «(2015)» is never explained as 2015 prices. It sits right before the colon, after the year, where it reads as a second period. The report defers these to the receipts block (EX2-3), but the page still fails the test.
`built/explicacoes/leitura-da-semana/index.html:3, built/en/explainers/weekly-reading/index.html:3, relatorio-construtor.md:206`

**6. As the editor of a Portuguese daily, I would print the nine revisions but cut the «só na forma de escrever» section and the «proveniência» count.**
That section tells a reader that 3 is now written 3,0, which says nothing about the country. «9 mudaram de proveniência» is bookkeeping a reader cannot decode. «A primeira página» also talks about the site rather than the country, but this pass's mandate requires it, so that cut is the seat's call.
`built/explicacoes/leitura-da-semana/index.html:3, built/en/explainers/weekly-reading/index.html:3`

## Minor

**7. The copied `strings.mjs` says «the source revised it upward». The diff adds «upwards», and both English pages print «upwards».**
W2 composes from the same strings, so a build from the copy would pass with the other word.
`src/i18n/strings.mjs:3889, diff.patch:58981, built/en/explainers/weekly-reading/index.html:3, built/en/index/index.html:4`

**8. «Never the source's title» holds because of today's data, not because W2 enforces it.**
W2 takes the expected name from `nomeNaSemana`, the same ladder the page renders. The lower rungs of that ladder are the source's label and the document title, rendered through `CampoDaLinha`. All nine names here happen to be house names (`data-nome` figuras/projeto/medidas). The plant «o nome da fonte em vez do nome da medida» only swaps the text on the page.
`tests/explicacoes/semana.mjs:303, src/lib/leitura-da-semana.mjs:243, src/components/NomeDaMedida.astro:44, src/components/NomeDaMedida.astro:57, src/components/NomeDaMedida.astro:98, tests/explicacoes/semana.mjs:547`

**9. The A4, M3 and L1 plant results were recorded at head c2d73ad0, which is not among the six commits of `167d86b8..HEAD`, and the gate run does not execute those plants.**
In the final verify run, `check:pais` and `check:lugar` call only their scripts, not `tests/pais/pais.mjs` or `tests/pais/portoes.mjs`. Reading the final A4 code, it would still catch the inserted marker. But the report's rows for these plants are not shown at the head that lands.
`design/especime-v3/medicoes/ex2-2026-10-06/conferencias-b/corrida-titulos-html.json:5, design/especime-v3/medicoes/ex2-2026-10-06/plantas-portoes-lugar-marcador-de-titulo.json:4, design/especime-v3/medicoes/ex2-2026-10-06/entrega-b.json:451, design/especime-v3/medicoes/ex2-2026-10-06/portoes-b/verify.log:1801, design/especime-v3/medicoes/ex2-2026-10-06/portoes-b/verify.log:2629, scripts/check-pais.mjs:561`

**10. A4 no longer reads `titleUnverified`, which the archive still sets to true on the two English water editions.**
The diff removes the readers in the component and in A4, and no file in the package reads the flag now. A4 compares only the text and the language. Nothing in the package would stop an English title that the archive declares unverified from publishing unmarked, which goes against §1.172.
`diff.patch:58777, scripts/check-pais.mjs:573, design/especime-v3/medicoes/ex2-2026-10-06/passagem-b.json:121, design/especime-v3/medicoes/ex2-2026-10-06/passagem-b.json:150, src/components/TituloDeTrabalho.astro:52`

## «What is fine»

11. The English weekly page and both indexes give each change in order: the house name (the same for 2024 and 2025), the period, the unit before the colon, both values, «a fonte reviu para cima» / «the source revised it upwards», the date and the Eurostat chip. Both editions have identical tag skeletons, and both English pages hash to the builder's recorded values: `built/en/explainers/weekly-reading/index.html:3, built/indice/index.html:4, built/en/index/index.html:4, design/especime-v3/medicoes/ex2-2026-10-06/entrega-b.json:127, design/especime-v3/medicoes/ex2-2026-10-06/entrega-b.json:327`.

12. The definitions and sign sentences match what was asked: each definition appears once per consecutive group: 6/6/5/5 = 22, which matches the gate's «EX2: 22 frase(s)»; the international investment position's sign sentence follows its group on all four pages; the unit labour cost definitions (both editions) and the Portuguese investment-position definition and sign match their receipts character for character; the English sign's receipt is not in the package, and the sign matches across the two English pages. References: `built/livro-razao/posicao-de-investimento-internacional-2024/index.html:2, built/en/ledger/custo-unitario-do-trabalho-2024/index.html:2, design/especime-v3/medicoes/ex2-2026-10-06/portoes-b/verify.log:1055`.

13. On both weekly pages the counts sentence is the article's last child, and both carry the «nenhuma frase da primeira página» sentence: `built/explicacoes/leitura-da-semana/index.html:3, built/en/explainers/weekly-reading/index.html:3`.

14. In the English index, «Onde está a água?» and «Água Não Faturada» carry `lang="pt"`, with no marker and no door. The only `/en/to-verify` link is the index's own entry for the marker page: `built/en/index/index.html:4`.

15. The cells in the diff do what this pass asked: W2 composes the name and «União Europeia» from the row's data; the W audit requires the summary to sit directly inside the list, and on the index inside the index's list; W4 compares each group's definition with every receipt in the group, and the signs one by one; the index runs the same composition as the weekly page; the W plants that `passagem-b.json` names all bit at 8c3a08b9 with a clean control (99/99). References: `tests/explicacoes/semana.mjs:304, tests/explicacoes/semana.mjs:443, tests/explicacoes/o-que-e.mjs:120, tests/explicacoes/semana.mjs:390, design/especime-v3/medicoes/ex2-2026-10-06/semana-b.json:2, design/especime-v3/medicoes/ex2-2026-10-06/semana-b.json:763`.

16. The in-folder report regenerates byte for byte, and its counts reproduce from the files: 3195/3184/41/25 for the ledger, its scope, its units and those starting with a word; 164 samples, 183 lines, 0 vs 10 and 0 vs 20 for the unit trial; 12 pages in 24 passes; 40 captures in the manifest; gates at 0/0/0 on 8c3a08b9. The unit paragraph states the tie and the seat's decision (`escolha:'antes'` is a literal in the script). `pacote.json` is deleted. The two numbers the number check could not place, 2717 and 2716, are in the L1 log. References: `design/especime-v3/medicoes/ex2-2026-10-06/unidades.json:18, design/especime-v3/medicoes/ex2-2026-10-06/passagem-b.json:223, design/especime-v3/medicoes/ex2-2026-10-06/medir-unidades.mjs:27, design/especime-v3/medicoes/ex2-2026-10-06/portoes-b/cabeca:1, diff.patch:56937, design/especime-v3/medicoes/ex2-2026-10-06/planta-lugar-marcador-de-titulo.log:8`.

17. A lay reader now sees that these are the source's revisions of past years, because each entry says «a fonte reviu» with the year and the day. The sign sentence explains the minus on the investment position: `built/en/explainers/weekly-reading/index.html:3`.

**not yet**: as packaged, the Portuguese weekly page states the wrong direction of a revision, the Portuguese index publishes an unmeasured value, and the copied group rule is disabled. All of these files differ from the builder's own records. If the seat confirms that findings 1–4 and 7 are copy-only damage, the branch has only the Minor items and the EX2-3 deferrals open.
