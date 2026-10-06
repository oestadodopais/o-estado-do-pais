# A segunda leitura da passagem H4-e pelo Claude Opus 5.5 (a definição `leitor`), 06.10.2026, das 16:27 às 16:47 UTC

*A leitura da segunda volta da H4-e (a regra 9 do Método reescrita depois do achado 4 da leitura do Codex). Foi do Opus, da mesma família do lugar de direção que escreveu a redação, porque o Codex chegou ao teto da semana (95 %) às 16:10 UTC; o registo di-lo (§1.180) e o Codex relê o diff inteiro da H4-e na segunda-feira, antes de qualquer outra aterragem. O pacote (56 ficheiros, 4 MB, o diff de `81e3de31` a `d81471b7`, cortado do ramo de integração) levou cinco estragos plantados só nas cópias: a página portuguesa do Método a voltar a dizer na regra 9 que a direção é de uma pessoa (q1), a fonte inglesa da regra 9 a dizer que é o modelo que responde (q2), a frase viva do papel da leitura marcada como retirada no inventário (q3), o relatório a dizer que a N1 fez cinco plantas (q4) e a cópia do portão sem a data em que cada número foi lido (q5). O leitor mordeu os cinco (os achados 1, 2, 9, 10 e 3). O registo das plantas por sha256 desta leitura perdeu-se quando o pacote da terceira leitura foi montado com o mesmo nome (o guião apaga o registo anterior); `LEITURA-H4-e-b-2026-10-06.plantas.json` é a reconstrução a partir dos ficheiros commitados em `12b60426` e das trocas do guião `plantar-opus.py`, com a página construída marcada como não recuperável; a lição (um nome de pacote por leitura) fica no registo das melhorias. Os achados reais: o 4 (a regra 8 do Método em inglês ainda dizia «The director decides» e «no director decision yet» onde a portuguesa diz «A direção decide»), o 5 (o papel da direção, «revê e aprova o que se publica», contradizia a revisão por amostra do parágrafo de cima) e o 14 (a frase inglesa «the model that built never reads» perdia o sentido; «erros plantados» sem dizer para que servem); os três corrigidos na terceira volta, nas duas edições. O 6, o 8 e o 12 eram do pacote e não do ramo: o pacote copiava os ficheiros da cabeça `d81471b7` do ramo h4, anterior às provas regeneradas (`52dd41d1`), à entrada §1.180 e ao mapa acertado no ramo de integração; confirmado no ramo que as provas estão na cabeça `52dd41d1` com os guiões `-e`, que a entrada existe com o carimbo e que a frase antiga saiu do mapa. O 7 é a razão da releitura pelo Codex na segunda-feira. O 11 corrigido (a linha 3 do relatório). O 13 (a alternativa morta «dirige o trabalho» na exceção da L3) e o 15 (a conferência dos números do relatório só pergunta se cada número existe nalgum ficheiro) ficam anotados como H4-8 e H4-9 para o bloco de higiene. Símbolos da leitura: 292 790 (o total reportado pela ferramenta para o agente).*

## Blocking

**1. The built Portuguese Method page still says a person directs and decides what is published: «A direção é de uma pessoa, que decide o que se publica…».**
The source and the diff say «de um modelo». The sentence contradicts «São três papéis, todos de modelos» on the same page and is the defect this pass exists to fix. No proof file records this page; the proof copy is older.
`built/metodo/index.html:1`, `src/data/metodo.mjs:607`, `diff.patch:2752`, `design/especime-v3/medicoes/h4-2026-10-06/capturas-e.json:19`

**2. The copied `metodo.mjs` makes English rule 9 say "the model answers for what is published".**
The diff and the built English page say "that person answers". The copy contradicts Portuguese rule 9, the policy sentence on the same page ("a named person … answers for it") and the decision that a named person answers.
`src/data/metodo.mjs:610`, `diff.patch:2756`, `built/en/method/index.html:1`, `src/data/politica-ia.mjs:229`

**3. The gate copy cuts the Portuguese Building sentence to «cada número que publica traz a fonte.»**
The built page, the source and the diff end «… traz a fonte e a data em que foi lido.» The cell compares items exactly, so this copy fails the correct page with «os lugares não são os da redação decidida», which contradicts the stored clean result. The three copies are not identical.
`scripts/lugares-ia-do-portao.mjs:11`, `scripts/lugares-ia-do-portao.mjs:36`, `src/data/politica-ia.mjs:407`, `diff.patch:2721`, `design/especime-v3/medicoes/h4-2026-10-06/plantas-politica-e.json:19`

## Major

**4. English rule 8 still says "The director decides" and "no director decision yet", where Portuguese says «A direção decide».**
In English a director is a person. So the two editions disagree on who decides, and the English contradicts "three roles, all held by models" and "It is directed by a model" on the same page. «diretor» was taken off the public pages on 05.10.2026.
`src/data/metodo.mjs:554`, `src/data/metodo.mjs:566`, `src/data/metodo.mjs:551`, `built/en/method/index.html:1`, `src/data/politica-ia.mjs:309`

**5. The Direction item says it «revê e aprova o que se publica». The paragraph above says review is «por verificações automáticas e por amostra, e não peça a peça», and that a new value is published on green gates alone.**
A lay reader cannot tell whether anything goes out without the direction's approval. As an editor I would not print the section until the two agree.
`src/data/politica-ia.mjs:400`, `src/data/politica-ia.mjs:298`, `src/data/politica-ia.mjs:329`

**6. Every H4-e proof ran at 25499b79, before the rule-9 rewrite and the script-name fix, but the report says 52dd41d1, «a cabeça com essas duas mudanças».**
The run record, the `.cabeca` files, the policy record and the capture manifest all say 25499b79, which was built before the Codex read began. The proof pages still say «A direção é de uma pessoa, que escolhe o que se publica». The generator takes the head and the commands from those files, so lines 510, 522, 553 and 570 (52dd41d1, `provar-politica-e.mjs`, `captar-h4-e.mjs`, three commits) are not what it wrote. The records name `provar-politica.mjs` and `captar-h4.mjs`. The rule-9 change has no check, capture or plant in the package, and the name fix never ran.
`relatorio-construtor.md:510`, `relatorio-construtor.md:570`, `design/especime-v3/medicoes/h4-2026-10-06/corridas-e.json:2`, `design/especime-v3/medicoes/h4-2026-10-06/conferencias-e/gate-html.cabeca:1`, `design/especime-v3/medicoes/h4-2026-10-06/plantas-politica-e.json:2`, `design/especime-v3/medicoes/h4-2026-10-06/capturas-e.json:2`, `design/especime-v3/medicoes/h4-2026-10-06/paginas-e/politica-pt.html:1`, `design/especime-v3/medicoes/h4-2026-10-06/relatorio-h4e.py:64`

**7. This read cannot be the other-family read that the record requires for the rule-9 rewrite.**
A Claude model wrote the rewrite after the Codex read. The Codex record says the change «leva a sua leitura pela outra família antes de aterrar», and the page itself says building and reading are always done by different families.
`design/especime-v3/critica/LEITURA-H4-e-codex-2026-10-06.md:3`, `relatorio-construtor.md:508`, `src/data/politica-ia.mjs:421`

**8. The diff changes `src/data/metodo.mjs` with no new entry and no ledger check, though the package's own comments call it governed text whose sha256 is stamped in `DECISIONS.md`.**
Both comments say changing a single byte needs a new entry. The diff has none, and none of the three targeted checks covers it. No green GitHub run is shown.
`src/data/politica-ia.mjs:13`, `scripts/check-lugar.mjs:533`, `diff.patch:2743`

**9. The inventory marks the new Portuguese Reading sentence `retirada`.**
The diff has it `viva`. Only nine of the ten new sentences are live, so the checker would throw «A frase nova não tem uma linha viva única», which contradicts its stored «10 frases vivas conferidas».
`design/especime-v3/INVENTARIO-FRASES.md:4183`, `diff.patch:41`, `design/especime-v3/medicoes/h4-2026-10-06/inventario-politica-h4e.mjs:34`, `design/especime-v3/medicoes/h4-2026-10-06/inventario-e.log:1`

**10. The report says «a N1 fez 5»; every file says 3.**
The table under that sentence has three rows, the log three lines and the record three entries, and the generator writes `len(n1)`. The section claims two N1 plants that never ran.
`relatorio-construtor.md:522`, `relatorio-construtor.md:547`, `design/especime-v3/medicoes/h4-2026-10-06/n1-e.log:1`, `design/especime-v3/medicoes/h4-2026-10-06/n1-e/plantas-portoes-h4b.json:1`, `design/especime-v3/medicoes/h4-2026-10-06/relatorio-h4e.py:70`

## Minor

**11. The report's opening still names «A passagem H4-d» as the current delivery.**
H4-e is now the last section. Line 5 already calls the H4-e wording final, so the two status lines disagree.
`relatorio-construtor.md:3`, `relatorio-construtor.md:5`, `relatorio-construtor.md:506`

**12. The map still quotes «H4 (06.10.2026): o nome inteiro da União cabe com as sete portas» at `strings.mjs:189`, a comment this diff removed.**
The string no longer exists in `strings.mjs`. The map says `conferir-mapa.py` checks each quotation against its cited line.
`design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md:479`, `design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md:9`, `src/i18n/strings.mjs:189`, `diff.patch:2855`

**13. The L3 «trabalho» exception still exempts «dirige o trabalho», which no longer appears on either Method page.**
The phrase went out with the H4-d wording. Use is counted per exception, not per alternative, so the dead alternative stays open.
`scripts/check-lugar.mjs:607`, `scripts/check-lugar.mjs:596`, `diff.patch:2717`

**14. The English "the model that built never reads" loses the sense of «nunca é o que lê». Read literally it is false, since the same paragraph says Claude and Codex both build and read.**
The Portuguese says the builder never reads what it built. «erros plantados» / "planted errors" is house jargon, and the reader is never told what it is for.
`src/data/politica-ia.mjs:428`, `src/data/politica-ia.mjs:421`, `src/data/politica-ia.mjs:414`

**15. The report-number check passed 653 of 653 numbers, yet it cannot catch line 522's "5".**
Judging by its own output, it only asks whether each number appears in some file. A 5 appears somewhere, so a wrong count passes.
`numeros-do-relatorio.txt:5`, `relatorio-construtor.md:522`

## «What is fine»

- 44 of the 47 diff hunks match the copies; the other three are findings 2, 3 and 9: `diff.patch:1`.
- Page and source agree on all ten role sentences and on the other 30 paragraphs in each edition, and the English gate copy matches too: `built/en/method/index.html:1`, `src/data/politica-ia.mjs:393`.
- The chosen-way sentence is untouched and identical in the source and both pages. The «detém a responsabilidade editorial» clause quoted in the read prompt is the retired version: `src/data/politica-ia.mjs:221`, `design/especime-v3/INVENTARIO-FRASES.md:1825`.
- The new wording and rule 9 contain no L3 word and no «lugar(es)», checked by script with a known positive: `scripts/check-lugar.mjs:470`.
- The H4-6 skip and the four `h4d-l3-*` plants are gone (no match, while the same pattern finds 22 lines in the diff), and the harness still requires exit 1, every bite and a byte-for-byte restore: `tests/pais/portoes.mjs:47`.
- All ten H4-d sentences are retired, and no live row keeps the old wording: `design/especime-v3/INVENTARIO-FRASES.md:4170`.
- At 25499b79, each of the 18 policy plants failed with its required message while the intact pages stayed clean, and the three N1 plants exited 1 with both messages and restored hashes: `design/especime-v3/medicoes/h4-2026-10-06/plantas-politica-e.json:14`, `design/especime-v3/medicoes/h4-2026-10-06/n1-e/plantas-portoes-h4b.json:1`.
- The six 390 px captures match the manifest. It lists five widths per edition, no errors, two menu lines and three roles: `design/especime-v3/medicoes/h4-2026-10-06/capturas-e.json:1`.
- The targeted codes are 0 as stated, and the section claims no local full run: `design/especime-v3/medicoes/h4-2026-10-06/conferencias-e/gate-html.codigo:1`, `relatorio-construtor.md:510`.
- The Union comment keeps what was decided apart from what was measured, and claims no measurement of the full page name: `src/i18n/strings.mjs:187`.

«not yet»: two copies of rule 9 and the gate copy contradict the decided wording, the proofs ran before the rule-9 rewrite, English rule 8 still gives the decision to a director, and the rewrite has not had its other-family read.
