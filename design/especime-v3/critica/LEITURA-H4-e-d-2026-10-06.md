# A leitura do diff inteiro da passagem H4-e pelo Codex `gpt-6-astra` (raciocínio `high`, `scripts/leituras/ler.sh`), 06.10.2026, das 18:51 às 18:55 UTC

*A leitura da outra família sobre a redação final do lugar de direção (as quatro voltas da H4-e), lançada com o último ponto da semana do Codex por decisão do diretor às 18:50 UTC, depois de o lugar de direção lhe pôr a escolha. O pacote (310 ficheiros, 20 MB, o diff de `0d1a9616` a `f19b242a` cortado do ramo de integração, com o bloco H4 inteiro, a entrada §1.180, as três leituras anteriores da H4-e, as provas regeneradas e as capturas de 390 px) levou cinco estragos plantados só nas cópias, registados por sha256 em `LEITURA-H4-e-d-2026-10-06.plantas.json`: a fonte inglesa da regra 9 a dar ao modelo as regras e as recusas (s5), a cópia do portão com «cala» por «diz» (s2), a página portuguesa construída com «A inteligência artificial propõe» na regra 8 (s1), a linha viva inglesa do papel da construção marcada como retirada (s3) e o relatório com dezoito plantas da política em vez de vinte (s4). O leitor mordeu os cinco (os achados 1, 2, 3, 4 e 6) e o «not yet» é só pelas cópias plantadas: os dez textos dos papéis, os títulos e a tradução estão certos (o 9), a frase da via escolhida intacta (o 10), a exceção da L3 fora (o 11), as provas na cabeça (o 12). Os achados reais: o 5 (a secção «O que se publica sem uma pessoa ler» ainda diz «com todos os portões verdes» e «um portão vermelho», palavras que a página não explica, agora que o papel da direção diz «verificações automáticas») é anterior ao bloco e já está no ar; o lugar de direção decide aterrar e corrigi-lo na primeira passagem de segunda-feira, com a sua leitura pela outra família, porque a página de hoje diz coisas falsas sobre quem dirige e quem lê e a de amanhã diz as verdadeiras; o 7 (só as capturas de 390 px no pacote) é do pacote; o 8 (a §1.180 dizia os portões a 0 em cada passagem do construtor, e a H4-b fechou com o verify a 1) corrigido na entrada. Símbolos da leitura: 136 613 (a linha «tokens used»).*

## Blocking

1. **The copied English rule 9 gives the model authority to set the rules and refusals, reversing the human responsibility stated elsewhere.** It says the model “decides what gets published and sets the rules and the refusals”. Portuguese, the diff and the built English page instead put publication decisions within rules a named person sets. The copied source therefore contradicts both editions’ chosen-way sentence and would change the English policy on rebuilding.  
`src/data/metodo.mjs:610`, `src/data/metodo.mjs:607`, `diff.patch:33547`, `src/data/politica-ia.mjs:228`, `built/en/method/index.html:1`

2. **The Portuguese gate expects uncertainty to be concealed rather than disclosed.** Its Building item ends «ou cala o que ainda está por confirmar»; the source, diff and built page say «ou diz». The exact comparison consequently rejects the supplied correct sentence and accepts that reversed obligation. The stored clean result cannot describe this gate copy.  
`scripts/lugares-ia-do-portao.mjs:12`, `scripts/lugares-ia-do-portao.mjs:38`, `src/data/politica-ia.mjs:407`, `diff.patch:33478`, `design/especime-v3/medicoes/h4-2026-10-06/plantas-politica-e.json:19`

## Major

3. **The built Portuguese page retains the superseded rule-8 wording, so the editions no longer identify the proposer equally precisely.** It says «A inteligência artificial propõe», while the source, diff, proof page and English edition specify Building. Replacing that phrase with «A construção propõe» makes the Portuguese HTML byte-identical to the proof copy: this is its only difference. The supplied page’s SHA-256 begins `1503b036`; the proof records `2c18c7f8`, so the green proofs cover another page.  
`built/metodo/index.html:1`, `src/data/metodo.mjs:551`, `built/en/method/index.html:1`, `design/especime-v3/medicoes/h4-2026-10-06/paginas-e/politica-pt.html:1`, `design/especime-v3/medicoes/h4-2026-10-06/plantas-politica-e.json:18`

4. **Only nine of the ten current role sentences have live inventory rows.** The English Building sentence is marked `retirada`, although both source and built page publish it and the diff adds it as `viva`. I reproduced the nine-row count and the missing live match. The checker explicitly requires one live entry for every current sentence, contradicting the stored successful inventory result for this copy.  
`design/especime-v3/INVENTARIO-FRASES.md:4209`, `diff.patch:137`, `built/en/method/index.html:1`, `design/especime-v3/medicoes/h4-2026-10-06/inventario-politica-h4e4.mjs:32`, `design/especime-v3/medicoes/h4-2026-10-06/inventario-e.log:1`

5. **I would not print either Method page unchanged because its publication conditions still depend on unexplained “green” and “red” gates.** Portuguese retains «todos os portões verdes» and «um portão vermelho»; English retains “every gate green” and “a red gate”. The roles paragraph now uses “automated checks”, but neither page explains that the remaining gate terminology means those checks passing or failing. These clauses need plain-language rewriting because they state when publication happens without human reading.  
`built/metodo/index.html:1`, `built/en/method/index.html:1`, `src/data/politica-ia.mjs:329`, `src/data/politica-ia.mjs:344`

## Minor

6. **The H4-e report undercounts the policy plants: the evidence contains 20, not 18.** There are ten entries per edition in both the report’s table and the saved JSON. All twenty saved results contain their required failure message, and the log says twenty succeeded. The report generator derives this count from the array length and would print 20.  
`relatorio-construtor.md:523`, `relatorio-construtor.md:527`, `design/especime-v3/medicoes/h4-2026-10-06/plantas-politica-e.json:28`, `design/especime-v3/medicoes/h4-2026-10-06/politica-e.log:1`, `design/especime-v3/medicoes/h4-2026-10-06/relatorio-h4e.py:79`

7. **The package cannot substantiate the requested visual verification at all five widths.** It supplies only the two full-page 390 px captures and their four crops, whose hashes I verified. The other eight full-page images and their crops have manifest entries but no image files here; the packaging script explicitly copies only 390 px images. Their existence and appearance therefore remain unverified in this read, rather than disproved.  
`design/observatorio/mandatos/GUIAO-montar-pacote-h4e-2026-10-06.sh.txt:23`, `design/especime-v3/medicoes/h4-2026-10-06/capturas-e.json:137`, `relatorio-construtor.md:556`

8. **The landing record incorrectly describes every constructor pass’s full gates as successful.** §1.180 says they were «a 0 na cabeça do código de cada passagem». The H4-b `verify.codigo` is 1, and the historical report explicitly records that failure. Later successful passes do not make that historical assertion true.  
`DECISIONS.md:13818`, `design/especime-v3/medicoes/h4-2026-10-06/portoes-b/verify.codigo:1`, `relatorio-construtor.md:133`

## «What is fine»

9. The ten role texts match the built pages’ source wording, their English translation preserves the responsibilities, and both titles match; the gate divergence is finding 2: `src/data/politica-ia.mjs:390`, `built/metodo/index.html:1`, `built/en/method/index.html:1`.

10. The chosen-way sentence is unchanged between source and pages; the brief’s longer version containing «detém a responsabilidade editorial» is explicitly retired in the inventory: `src/data/politica-ia.mjs:221`, `design/especime-v3/INVENTARIO-FRASES.md:1825`.

11. The H4-d vocabulary exemption and plants are absent, while the older copied-policy exception and failure/restoration requirements remain: `scripts/check-lugar.mjs:582`, `scripts/check-lugar.mjs:1400`, `tests/pais/portoes.mjs:47`.

12. Saved records support the three N1 failures with their required messages and restored hashes, four zero targeted-check codes at `89c54f34`, and no claim of a local H4-e full-gate run: `design/especime-v3/medicoes/h4-2026-10-06/n1-e/plantas-portoes-h4b.json:1`, `design/observatorio/mandatos/GUIAO-provas-h4e-2026-10-06.sh.txt:15`, `relatorio-construtor.md:510`.

13. The Union-name comment distinguishes the measured menu label from the unmeasured full page title: `src/i18n/strings.mjs:187`.

«not yet»: the supplied source, gate, Portuguese page and inventory disagree with the intended text and recorded proofs.