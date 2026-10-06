# A terceira leitura da passagem H4-e pelo Claude Opus 5.5 (a definição `leitor`), 06.10.2026, das 16:59 às 17:21 UTC

*A leitura da terceira volta da H4-e (a regra 8 em inglês, o papel da direção e a frase inglesa das famílias, depois da segunda leitura). Foi do Opus, da família do lugar de direção, porque o Codex estava no teto da semana; o registo di-lo. O pacote (294 ficheiros, 20 MB, o diff de `0d1a9616` a `ace7f8aa`, cortado do ramo de integração, com o bloco H4 inteiro, a entrada §1.180, o mapa acertado e as provas regeneradas; as capturas de 390 px em `capturas/`) levou cinco estragos plantados só nas cópias, registados por sha256 em `LEITURA-H4-e-c-2026-10-06.plantas.json`: a página inglesa construída com «The director decides» na regra 8 (r1), a vista a dizer que a direção lê os números novos um a um (r2), o relatório com oito capturas (r3), a linha viva do papel da direção com «depois de se publicar» (r4) e a cópia do portão em inglês com «sometimes reads it» (r5). O leitor mordeu os cinco (os achados 3, 1, 5, 4 e 2). O achado que decide é o 6: a página promete que a construção e a leitura são sempre de famílias diferentes, e o texto que o promete só teve, nas duas últimas voltas, leituras da família que o escreveu; o lugar de direção aceita-o e não aterra o bloco antes de o Codex ler o diff inteiro da H4-e, na segunda-feira, depois da reposição. O 9 (o editor: «portões» sem definição na página, «A construção constrói» e «A leitura lê», «the change» onde o português diz «a troca», a regra 8 a pôr a inteligência artificial a propor e a direção a decidir como se a direção não fosse um modelo, «cada número traz a fonte e a data» absoluto numa página que conta linhas por confirmar) entrou na quarta volta: a direção diz o que escreve e que a outra família o lê antes de se publicar; as verificações automáticas no lugar dos portões; a construção faz e a leitura confere; cada número traz a fonte e a data ou diz o que está por confirmar; «the replacement»; a regra 8 com a construção a propor. O 7 (os registos a dizer que o Codex leu a redação final) corrigido na §1.180 e no gerador da secção. O 8 (a conferência do inventário sem as voltas intermédias, o `check:voz` fora das conferências, o título sem célula) corrigido: a conferência exige que só as dez frases atuais estejam vivas, o `check:voz` entrou nas conferências da passagem, e a célula dos papéis confere o título, com a sua planta. Símbolos da leitura: 358 631 (o total reportado pela ferramenta para o agente).*

## Blocking

**1. The copied source makes the Direction item say the direction reads every new figure: «…entram pelos portões, e a direção lê-os um a um».**
The diff, the gate copy and the built Portuguese page all say «sem a direção os ler um a um». The copy contradicts two things on the same page: «A revisão é feita … por amostra, e não peça a peça» and «Publica-se · … com todos os portões verdes». The three copies are no longer identical.
`src/data/politica-ia.mjs:400`, `diff.patch:32763`, `scripts/lugares-ia-do-portao.mjs:10`, `built/metodo/index.html:1`, `src/data/politica-ia.mjs:298`

**2. The gate copy's English closing says "the model that built a change sometimes reads it".**
The source, the diff and the built page all say "never reads it". The cell compares the closing exactly, so this copy would fail the correct English page («as famílias e os lugares do fecho diferem…») and would pass a page stating the opposite rule. The stored proof records that same page as intact, with no failures.
`scripts/lugares-ia-do-portao.mjs:23`, `scripts/lugares-ia-do-portao.mjs:39`, `diff.patch:32671`, `src/data/politica-ia.mjs:428`, `design/especime-v3/medicoes/h4-2026-10-06/plantas-politica-e.json:25`

**3. The built English Method page says "The director decides." in rule 8, undoing a third-round correction.**
The source, the diff and the proof page the plants read all say "Direction decides." The source's sha256 (9f3b1d4aafd5…) is the §1.180 stamp. That sentence is the only difference between the package page (ba8b2747…) and the proof page (5c8140a7…). A director is a person, so the page again contradicts "three roles, all held by models" and rule 9.
`built/en/method/index.html:1`, `src/data/metodo.mjs:554`, `diff.patch:32699`, `design/especime-v3/medicoes/h4-2026-10-06/paginas-e/politica-en.html:1`, `DECISIONS.md:13810`

## Major

**4. The inventory's live row for the Portuguese Direction sentence says «revê-a depois de se publicar»; the diff and the pages say «antes».**
I checked by script: only 9 of the 10 built sentences have a live row, and this live row appears on neither page. The inventory checker would throw «A frase nova não tem uma linha viva única», which contradicts its stored log, «10 frases vivas conferidas». check:voz also requires every live row to appear on a page.
`design/especime-v3/INVENTARIO-FRASES.md:4199`, `diff.patch:127`, `design/especime-v3/medicoes/h4-2026-10-06/inventario-politica-h4e.mjs:34`, `design/especime-v3/medicoes/h4-2026-10-06/inventario-e.log:1`, `design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md:243`

**5. The report says «Foram refeitas 8 capturas»; the manifest, the table below it and the run log say 10.**
I regenerated the section with `relatorio-h4e.py` from the stored files. Every line matches except this one, where the generator writes `len(cap['capturas'])`, which is 10. No file supports the 8.
`relatorio-construtor.md:553`, `design/especime-v3/medicoes/h4-2026-10-06/capturas-e.json:49`, `design/especime-v3/medicoes/h4-2026-10-06/capturas-e-corrida.log:1`, `design/especime-v3/medicoes/h4-2026-10-06/relatorio-h4e.py:78`

**6. «A construção e a leitura são sempre de famílias de modelos diferentes» is not true of the change that publishes it.**
The direction, a Claude model, wrote this wording itself. The Direction item («decide…, encomenda cada mudança e revê-a») does not describe that role, and §1.167 also gives the direction the explanations to write. Only Claude Opus has read the rule-9 rewrite and the third-round wording (the second read and this one). §1.180 lands the block now and leaves the Codex re-read for Monday. From the day it lands, the page promises something its own text did not get.
`src/data/politica-ia.mjs:421`, `scripts/lugares-ia-do-portao.mjs:10`, `DECISIONS.md:13816`, `DECISIONS.md:13637`, `design/especime-v3/critica/LEITURA-H4-e-b-2026-10-06.md:3`

## Minor

**7. The records misstate who read the final wording.**
§1.180's title says the final wording was «lida pelo Codex». Its body says the Codex read it «duas vezes», then says the second read was by Opus. Its date line puts the proofs at 16:03, but the build they read was made at 16:51:12. The report's H4-e section says «a leitura dela é do Codex» and never mentions the Opus read or the third round. It lists commits only up to d81471b7, although its proof pages carry the third-round wording.
`DECISIONS.md:13806`, `DECISIONS.md:13812`, `DECISIONS.md:13816`, `relatorio-construtor.md:508`, `relatorio-construtor.md:570`, `design/especime-v3/medicoes/h4-2026-10-06/plantas-politica-e.json:12`

**8. The proofs leave parts of the third round unchecked.**
The runner checks the inventory with `inventario-politica-h4e.mjs`, whose base is f958bf80. That proves the H4-d rows are retired, but not the six second-version rows. No `inventario-politica-h4e2.mjs --confere` run is recorded, and the section header names only the h4d and h4e scripts. check:voz is missing from the targeted checks, although the brief names it among the rulers that read the policy and it is the one that ties inventory rows to rendered pages. All 18 plants call `conferirLugaresIA` directly, so nothing shows gate:html running it on both editions. No cell or inventory row protects the new title «Os três papéis».
`design/especime-v3/medicoes/h4-2026-10-06/correr-h4e.py:72`, `design/especime-v3/medicoes/h4-2026-10-06/inventario-politica-h4e.mjs:7`, `design/especime-v3/INVENTARIO-FRASES.md:4169`, `brief.md:24`, `scripts/gate-html.mjs:5881`, `design/especime-v3/medicoes/h4-2026-10-06/provar-politica-e.mjs:44`, `src/data/politica-ia.mjs:391`

**9. As the editor of a daily, I would print the section after rewriting the gates clause and fixing four smaller things.**
«entram pelos portões» / "enter through the gates" uses a word the page never defines. «A construção constrói» and «A leitura lê» ("Building builds", "Reading reads") are tautologies. In English, "the change is written down with its date" now reads as the site change of the sentences before it, where the Portuguese has «a troca». Rule 8 still sets «A inteligência artificial propõe» against «A direção decide», as if the direction were not a model. «cada número que publica traz a fonte e a data» is absolute, on a page that counts 8 rows with a provenance field still to confirm.
`scripts/lugares-ia-do-portao.mjs:10`, `src/data/politica-ia.mjs:407`, `src/data/politica-ia.mjs:431`, `src/data/metodo.mjs:551`, `src/data/metodo.mjs:435`, `src/data/metodo.mjs:635`

## «What is fine»

- 249 of the 252 diff hunks match the copied files line for line; the other three are findings 1, 2 and 4: `diff.patch:1`.
- In the source, rules 8 and 9, the roles section and the chosen-way sentence agree in both editions: a model decides within rules a named person sets, and that person answers for it. The chosen-way sentence is outside the diff and identical in the source and on both pages. The version the read prompt quotes, with «detém a responsabilidade editorial», is the retired one: `src/data/metodo.mjs:607`, `src/data/metodo.mjs:610`, `src/data/politica-ia.mjs:221`, `design/especime-v3/INVENTARIO-FRASES.md:1825`.
- The built Portuguese page is byte-identical to the page the plants read (a51e28ec…): `design/especime-v3/medicoes/h4-2026-10-06/plantas-politica-e.json:18`.
- Apart from the "change" in finding 9, the English of the five sentence pairs is a faithful translation: `src/data/politica-ia.mjs:393`.
- I checked by script, with a known positive, that no closed-vocabulary word and no «lugar(es)» appears in the ten sentences or in rules 8 and 9. The L3 has no «peça» skip, its only «peça» exception is the old four-phrase list, and the targeted run shows L3 at 0: `scripts/check-lugar.mjs:582`, `design/especime-v3/medicoes/h4-2026-10-06/conferencias-e/check-lugar.log:22`.
- The `h4d-l3-*` plants are gone, and the harness still requires exit 1, every expected message and a byte-for-byte restore: `tests/pais/portoes.mjs:47`.
- Every H4-d and second-version sentence is retired, and no live row keeps older wording: `design/especime-v3/INVENTARIO-FRASES.md:4173`.
- All runs were at 24bb1bb5 with an empty git status. Each of the 18 policy plants failed with its required message, and both intact pages passed clean. The three N1 plants exited 1 with both messages and restored hashes. The three targeted check codes are 0, and the section claims no local full run: `design/especime-v3/medicoes/h4-2026-10-06/corridas-e.json:1`, `design/especime-v3/medicoes/h4-2026-10-06/n1-e/plantas-portoes-h4b.json:1`, `relatorio-construtor.md:510`.
- The six 390 px captures match the manifest's sha256 values and show the third-round wording in both editions: `design/especime-v3/medicoes/h4-2026-10-06/capturas-e.json:56`.
- The comment on the Union's name separates what was measured (the door «União Europeia» with seven doors at 390 px) from what was decided. It says the page's full name was not measured, and the widths it cites match the measurement file: `src/i18n/strings.mjs:187`, `src/lib/navegacao.mjs:34`.

«not yet»: the source, the gate copy and the built English page diverge from the decided wording (the direction reads every new figure, the family rule is reversed, a director decides). The inventory and the report carry values no file supports. The page promises a family rule that its own final text has not met.
