# A leitura curta da passagem de correção do ME1 pelo Codex `gpt-6-astra` (`xhigh`), 15.10.2026, 08:07 a 08:19 UTC (a M48)

*Pacote montado por `scripts/leituras/pacote.sh` (a base `770f3230`, a cabeça que a leitura a frio leu; a cabeça `52a9857b`; 125 ficheiros mudados, 239 extra, as duas páginas do Método construídas; o motor em leitura na cabeça traduzida `3d024fa0`), com cinco plantas só nas cópias do pacote, registadas por sha256 em `PLANTAS-ME1-correcao-2026-10-15.json`: os achados 1 («pelo INE» na escala), 2 (o resumo do Método na §1.196), 3 («two of them»), 5 (`noscript-ignorado` na régua dos nomes) e 8 («por ler» no registo das revisões) são as plantas, cinco em cinco. Os achados 4, 6, 7 e 9 são reais, decididos na §1.196 (o ponto 15). O texto abaixo é a última mensagem do leitor, sem edição.*

## Blocking

1. **The Portuguese page falsely attributes the map scale choices to INE.** It prints «números redondos escolhidos pelo INE», while the mandate, copied data and English page say the project chose them. This gives an editorial choice unsupported official authority and breaks agreement between editions. The supplied Portuguese page consequently counts 1,726 words, including 113 in the closing section, rather than the report’s 1,727 and 114.

   built/metodo/index.html:2, built/en/method/index.html:2, brief.md:165, src/data/metodo.mjs:136, relatorio-construtor.md:278, relatorio-construtor.md:284

2. **The decision anchor does not approve the copied Method file’s actual digest.** Normalising line endings and recomputing SHA-256 gives `fcb1354596d4`; §1.196 instead records `fcb1354596d5`. The diff and report both specify the correct `…d4`, so the copied decision contradicts both. Reconstructing the earlier file from the patch reproduces `893a8b5e47d9`, confirming that the Method digest changed as required but its new anchor is wrong.

   DECISIONS.md:14026, diff.patch:10, src/data/metodo.mjs:1, relatorio-construtor.md:382

## Major

3. **The English page says two Évora studies have Portuguese-only openings where the mandate requires one.** Its changed paragraph prints “two of them have that opening”, while the copied data, report and mandate say “one of them has”. The supplied headings record also identifies only one English Évora study without the opening. I would not print this paragraph with the incorrect count.

   built/en/method/index.html:2, src/data/metodo.mjs:395, brief.md:152, relatorio-construtor.md:200, design/especime-v3/medicoes/me1-2026-10-15/estudos-aberturas.json:185

4. **The sentence ruler still overlooks additional visible paragraphs carrying the exempt `regra-portas` class.** It excludes every such paragraph, then checks only its links, leaving ordinary prose inside it unchecked. Using independent HTML extraction and the supplied comparison functions, an added `<p class="regra-portas">Additional prose for readers.</p>` produced no additional difference in either edition; the same paragraph without that class triggered the count check. The parser also retains `noscript: false`, despite the new comment promising to count its paragraphs.

   design/especime-v3/medicoes/me1-2026-10-15/conferir-frases.mjs:19, design/especime-v3/medicoes/me1-2026-10-15/conferir-frases.mjs:86, design/especime-v3/medicoes/me1-2026-10-15/conferir-frases.mjs:98, design/especime-v3/medicoes/me1-2026-10-15/conferir-frases.mjs:105

5. **The copied model-name ruler differs from the diff precisely at its new `noscript` branch.** The patch tests `tag === 'noscript'`; the copied file tests `tag === 'noscript-ignorado'`, so that reparsing branch never handles an actual `<noscript>` element. The twelfth case still plants ordinary `<noscript>`. The package supplies no `node-html-parser` dependency, so I cannot certify that case by executing the complete ruler here; the proven finding is the code mismatch, not a reproduced plant failure.

   scripts/lugares-ia-do-portao.mjs:24, scripts/lugares-ia-do-portao.mjs:67, scripts/lugares-ia-do-portao.mjs:154, diff.patch:13198

6. **The added weekly-panel measurement cannot be reproduced from the package’s underlying records.** The JSON lists 21 September, 28 September, 5 October and 12 October, and their three seven-day intervals reproduce correctly. However, the extraction requires ledger records and Git history for `src/data/verificacao.mjs`, neither supplied here. The command and aggregate results are present, but the occurrence of those checks remains an unverified claim in this package.

   design/especime-v3/medicoes/me1-2026-10-15/medidas.json:821, design/especime-v3/medicoes/me1-2026-10-15/medidas.json:949, design/especime-v3/medicoes/me1-2026-10-15/medir-me1.mjs:328, design/especime-v3/medicoes/me1-2026-10-15/medir-me1.mjs:338, relatorio-construtor.md:159

7. **I would still rewrite the scale sentence in both editions because “classes da escala” and “scale classes” remain unexplained.** Adding “On the maps” identifies the setting but does not explain what a class represents. Neither closing section supplies an example or definition that lets a first-time reader understand that term; this remains unresolved even in the English sentence that matches the mandate.

   built/metodo/index.html:2, built/en/method/index.html:2, brief.md:165

## Minor

8. **The inventory revision register still marks ME1 as unread.** Its status is `por ler`, whereas the diff adds the completed Codex and editorial readings. The report explicitly claims that this status was updated, so the copied register contradicts both the patch and the report.

   design/especime-v3/critica/REVISOES-DO-INVENTARIO.md:760, diff.patch:545, relatorio-construtor.md:191

9. **The report still claims that the entire closing section is unchanged character for character.** Its own correction account and quoted scale sentence establish that the scale wording changed in both editions. This is a stale summary claim, independent of the incorrect Portuguese built wording.

   relatorio-construtor.md:234, relatorio-construtor.md:179, relatorio-construtor.md:201, src/data/metodo.mjs:136

## «What is fine»

10. **The correction diff changes no ledger row requiring a hosted document, and the engine diff contains no changes.** diff.patch:13315, motor/diff.patch:1

11. **All five refusals remain unchanged in both built editions, and the policy file reproduces the required digest `62e42b67cf86`.** src/data/politica-ia.mjs:355, built/metodo/index.html:2, built/en/method/index.html:2, DECISIONS.md:14026

12. **Both corrected checking paragraphs match the mandate word for word in both editions, including the simpler limitation sentence and removal of the repeated review clause.** brief.md:115, brief.md:118, built/metodo/index.html:2, built/en/method/index.html:2

13. **The inventory regenerates exactly from its supplied inputs, with both old scale sentences retired with reasons and both approved replacements living.** design/especime-v3/medicoes/me1-2026-10-15/inventario-me1.py:197, design/especime-v3/INVENTARIO-FRASES.md:2046, design/especime-v3/INVENTARIO-FRASES.md:4508, design/especime-v3/INVENTARIO-FRASES.md:4540