# Leitura a frio dos blocos P1 e P2 fundidos (15.09.2026, à noite)

*Leitor: Codex (`gpt-5.6-sol`, xhigh, só leitura, efémero), fixado em `scripts/leituras/ler.sh`; o `.eventos.log` diz `model: gpt-5.6-sol` na primeira linha. Pacote: `pacote-p1p2` (201 ficheiros; a base `2ab86986`, a cabeça fundida `79df7102`; os dois briefs, os dois relatórios, as duas tabelas das cadeias, a norma, o diff, os ficheiros mudados, catorze páginas construídas, as saídas das réguas; sem `antes/`, sem as capturas e sem o registo inteiro da régua do cartão, o que o leitor apontou no achado 14). Cinco plantas de três classes (o registo em `2026-09-15-codex-leitura-p1-p2.plantas.json`): W1 a linha do período anterior dos preços da habitação a 9,7 (a fonte e o diff); W2 «referencia» sem acento na fonte (a fonte); W3 a régua da porta a 51 de 52 (a régua); W4 o relatório a dizer 2 906 px (o relatório); W5 a página construída com a União a 5,7 (a página construída). **Apanhadas: 5 de 5** (W1 e W5 no achado 1, W2 no 6, W3 no 13, W4 no 16). O leitor escreve em inglês e o texto fica como veio. Prosa da casa em português, sem travessões.*

## A triagem do lugar de direção

| achado | o que é | decisão |
|---|---|---|
| 1 | as plantas W1 e W5 | apanhadas; nada a corrigir |
| 2 | o cartão novo só nas páginas de área; os domínios, «Portugal na União Europeia» e a primeira página ficaram com as famílias antigas, com rótulos de recibo à vista | **real, e é o maior**: a passagem de correção leva o cartão às três famílias |
| 3 | a régua do cartão só falha sem a linha do valor; o relatório diz «as cinco coisas em todos» com 48 sem nome, 30 de 262 com frase e 90 com régua | **real**: a régua passa a exigir o nome sempre; a frase e a régua contam-se e escrevem-se como são, no relatório e na régua; a decisão sobre os 24 sem nome nenhum fica na passagem, com a lista |
| 4 | «Toque num cartão para ler a medida.» na página da União, com guião | **real**: sai (a norma §1.4) |
| 5 | o recibo diz «Transcrito da fonte, palavra por palavra» a excertos compostos das etiquetas da resposta da API (as 32 antigas e as 59 novas) | **real, anterior ao bloco**: o recibo passa a dizer «Excerto composto a partir da resposta da fonte» quando a linha o declara na nota; o motor ganha um campo próprio num bloco seguinte |
| 6 | a planta W2 | apanhada |
| 7 | a manchete portuguesa da União diz «ultrapassa 4 valores de referência» e uma das quatro falhas é por baixo | **real**: passa a «falha 4 valores de referência» (o inglês, «breaches», já era neutro) |
| 8 | a busca sem guião leva à lista inteira sem aviso à vista | **não se corrige**: sem guião o formulário leva ao índice dos concelhos agrupado por distrito, que é a resposta certa para quem escreveu um nome; a frase fica para a tecnologia de apoio (a norma §1.4) |
| 9 e 10 | as contagens dos domínios excluem duas linhas do livro-razão sem página de conteúdo, e a linha de abertura fala do projeto | **real**: a linha de abertura sai (a norma §1.4 e §5); as contagens contam as medidas que se leem nas páginas, e é isso que o rótulo «medidas» diz; as duas linhas ficam no livro-razão até terem página |
| 11 | nada confere que a linha do período anterior é a observação anterior da mesma série e unidade | **real**: a régua passa a exigir o mesmo `document.edition` e a mesma `unit` entre a linha do período anterior e a linha principal, e o cartão não rende a régua quando não batem |
| 12 | a L1 subiu 120 com 118 explicados; o teto do cartão do sistema de desenho de 512 para 768 KiB | **real**: as duas páginas explicam-se ou a L1 desce; o teto fica no medido mais uma margem escrita, não em 768 |
| 13 | a planta W3 | apanhada |
| 14 | as capturas e o registo inteiro da régua do cartão não estão no pacote | **do pacote, não do bloco**: o pacote seguinte leva-os |
| 15 | quatro linhas da União perdem a precisão publicada («70» por «70.0») | **real**: os quatro valores passam a «70,0», «11,0», «6,0», «6,0»; o gerador do motor corrige-se num bloco XS |
| 16 | a planta W4; o relatório do P1 a dizer que o nome fica no Método (é anterior à §1.109); 86 contra 81 nomes da fonte no P2 | **real nos relatórios**: corrigem-se as duas frases |
| 17 | três cadeias que não passam o teste do jornal: a frase do Sobre, «Próxima conferência», «As áreas seguem a orgânica…» | **duas reais**: «Próxima verificação» e «As áreas são as do Governo em funções (o XXV Governo Constitucional).»; a frase do Sobre é do diretor, palavra por palavra, e fica |
| 18 a 24 | o que está bem | registado |

E o que o lugar de direção viu nas capturas e a leitura não apontou: o espaço a mais em «( 9 %)», que a passagem fecha.

---

## Blocking

**1. The housing ruler is untrustworthy because the copied ledger, diff, built cards and receipt disagree on its values.** The diff and excerpt say the 2024 value is `9,1`, while the copied ledger’s value field says `9,7`; every supplied built page prints `9,1`. The Portuguese area card also prints the EU value as `5,7`, while the copied ledger, English card, both receipts and the report say `5,5`. The two editions therefore do not show the same ruler, and neither edition matches all copied data byte for byte.  
diff.patch:9970, ledger/claims/precos-da-habitacao-2024.yml:9, ledger/claims/precos-da-habitacao-2024.yml:24, ledger/claims/precos-da-habitacao-2025-ue.yml:9, built/areas/infraestruturas-e-habitacao/index.html:3, built/en/areas/infraestruturas-e-habitacao/index.html:3, built/livro-razao/precos-da-habitacao-2025/index.html:1, relatorio-p2.md:50

**2. P2’s card replacement was applied only to area pages, not “all pages that render a measure card.”** Only `AreaView` imports and renders `CartaoDaMedida`; the homepage, domain page and EU page retain the old `Faixa` or `dominio-medida` families. The supplied domain pages consequently still expose receipt labels such as “Publicado por”, “período de referência”, “Published by” and “reference period”. The checker selects only `[data-cartao-medida]`, so all those old card families are invisible to its claimed universal result; the report later confirms that its 131 cards per edition are specifically area-page cards.  
brief-p2.md:17, src/views/AreaView.astro:73, src/views/AreaView.astro:198, src/views/DominioView.astro:407, src/views/DominioView.astro:465, src/views/UniaoEuropeiaView.astro:199, tests/cartao/cartao.mjs:335, built/dominios/economia-e-financas-publicas/index.html:1, built/en/domains/economia-e-financas-publicas/index.html:1, relatorio-p2.md:321

**3. The card gate can pass cards missing mandatory content, and it did.** It records whether name, definition and ruler blocks exist, but only raises an error when the value line is absent. Its own reported run contains 48 nameless cards, only 30 of 262 cards with a definition and only 90 with a ruler, yet prints “the five things and only them, in all cards.” This contradicts both the brief’s 100% condition and the report’s “fulfilled” result.  
brief-p2.md:17, tests/cartao/cartao.mjs:357, tests/cartao/cartao.mjs:361, tests/cartao/cartao.mjs:822, relatorio-p2.md:64, relatorio-p2.md:195, relatorio-p2.md:211, relatorio-p2.md:112

## Major

**4. The EU page still ships a forbidden instruction sentence that the source says is shown when JavaScript is active.** The live inventory retains “Toque num cartão para ler a medida.” and “Tap a card to read the measure.” The built pages contain those strings in the controller’s empty-state node, and the view’s own comment says that, with scripting, this gesture instruction is what remains at rest. That directly contradicts the norm’s rule that content pages carry no instruction sentence.  
src/views/UniaoEuropeiaView.astro:211, src/views/UniaoEuropeiaView.astro:220, src/i18n/strings.mjs:1061, src/i18n/strings.mjs:3131, design/especime-v3/INVENTARIO-FRASES.md:2387, NORMA-como-se-escreve-se-mostra-e-se-organiza.md:28

**5. The receipts falsely describe machine-composed excerpts as verbatim source text, while the claimed API responses are not packaged.** Each new row comments that its excerpt is “word for word”, but its note says the excerpt was composed from Eurostat response labels. `LinhaView` prints “Transcrito da fonte, palavra por palavra” for every non-null excerpt, including these composed strings. The package contains endpoint URLs and assertions about their responses, but no saved response from which the 59 values and labels can be reproduced without network access.  
ledger/claims/precos-da-habitacao-2024.yml:23, ledger/claims/precos-da-habitacao-2024.yml:33, src/i18n/strings.mjs:2060, src/views/LinhaView.astro:1135, src/views/LinhaView.astro:1139, relatorio-p2.md:69

**6. A second changed region differs between the diff and copied source, and a rebuild would introduce misspelled Portuguese.** The diff adds `acima do valor de referência`, while the copied `strings.mjs` says `acima do valor de referencia`. The inventory and supplied built pages retain the accented form, showing that those pages are not a faithful build of the copied source.  
diff.patch:14710, src/i18n/strings.mjs:1181, design/especime-v3/INVENTARIO-FRASES.md:2939, built/uniao-europeia/index.html:1

**7. The Portuguese EU headline states the wrong direction for one of the four breaches.** It says Portugal “ultrapassa 4 valores de referência”, but one of those four is the net international investment position at `−50,2` against a lower reference of `−35`; the card correctly calls that case “abaixo”. The headline counts every out-of-range value as an upward exceedance, whereas the English edition uses the direction-neutral “breaches”.  
built/uniao-europeia/index.html:1, src/data/enquadramento/referencias.json:25, src/data/enquadramento/referencias.json:28, src/i18n/strings.mjs:694, src/i18n/strings.mjs:3032

**8. The sighted no-script search promises a search but knowingly returns the complete 308-name index.** The form displays “Procurar” or “Search”, accepts a municipality query and submits to the index. The saved gate confirms that its no-script submission lands on a page containing all 308 names, while the explanatory sentence is deliberately hidden visually with `.vh`. A sighted reader without JavaScript receives no warning that the entered query will not filter the result.  
src/components/inicio/CampoDeBusca.astro:81, src/components/inicio/CampoDeBusca.astro:139, src/components/inicio/Pesquisa.astro:113, src/components/inicio/Pesquisa.astro:142, reguas/p1-2026-09-15/porta.txt:20, built/index.html:2

**9. The domain totals do not count every published measure that the opening claims to count.** The mapping deliberately excludes `credito-malparado-2025` and `indice-de-percepcao-da-corrupcao-2025`, although it says both exist in the ledger and their own row pages are reader pages; it also says the charter expects the corruption measure in domain 17. The report admits the exclusion, so the displayed totals are counts of measures declared on selected content surfaces, not all numbers “este projeto já publica em cada um.”  
src/data/dominios.mjs:779, src/data/dominios.mjs:785, src/data/dominios.mjs:787, relatorio-p1.md:157, relatorio-p1.md:161, src/i18n/strings.mjs:1475, built/index.html:2

**10. The homepage and domain index still contain prose about the house itself.** Their visible opening says “os números que este projeto já publica”, which describes the project rather than Portugal. The norm confines explanation of the project to About and its working method to Method, with none on content pages.  
NORMA-como-se-escreve-se-mostra-e-se-organiza.md:27, NORMA-como-se-escreve-se-mostra-e-se-organiza.md:28, src/i18n/strings.mjs:1472, src/i18n/strings.mjs:1476, built/index.html:2, built/dominios/index.html:2

**11. Nothing verifies that a selected “previous period” row is the previous observation of the same series and unit.** The selector takes the greatest earlier year whose identifier has the same textual root; it never compares dataset, source URL dimensions, unit or series identity. The checker’s positives prove only that selected identifiers exist, including one biennial example. Because the package omits the 32 current ledger rows needed for pairwise comparison, the report’s semantic claim cannot be reproduced here.  
src/lib/enquadramento.mjs:238, src/lib/enquadramento.mjs:254, src/lib/enquadramento.mjs:265, tests/cartao/cartao.mjs:640, tests/cartao/cartao.mjs:669, relatorio-p2.md:321

**12. Two gates were materially loosened, and one increase is not fully explained by the report’s arithmetic.** The L1 “ratchet”, documented as only descending, rose from 2,170 to 2,290; the new rows explain 118 new pages, not the full increase of 120. The design-card ceiling rose from 512 to 768 KiB merely to admit a measured 542.1 KiB card, leaving 226 KiB of new unchecked growth. A green result under these new ceilings is not comparable with the earlier gate.  
scripts/check-lugar.mjs:125, scripts/check-lugar.mjs:131, scripts/check-lugar.mjs:138, scripts/check-lugar.mjs:157, relatorio-p2.md:393, relatorio-p2.md:400, scripts/design-bundle.mjs:116, scripts/design-bundle.mjs:127, scripts/design-bundle.mjs:137

**13. P1’s report says all 52 cells were green although its saved result says 51 of 52 and the plants failed.** The saved output identifies three non-biting plants and ends with `porta ✓ 51 de 52 células · plantas ✗`. The report’s later prose acknowledges those same three failures, so the acceptance-table statement is not merely missing evidence; it contradicts it.  
relatorio-p1.md:33, relatorio-p1.md:131, reguas/p1-2026-09-15/porta.txt:74, reguas/p1-2026-09-15/porta.txt:77, reguas/p1-2026-09-15/porta.txt:79, reguas/p1-2026-09-15/porta.txt:81

**14. The claimed full P2 run and 140 captures are not reproducible from this package.** P1 claims 60 captures and P2 claims 80, but the package contains only the scripts that would create them and no `capturas` directory or images. P2’s 7,358-page/262-card output is pasted into the report but has no saved checker log; the saved portão files contain only exit code `0`, and the checker itself requires an absent full `dist/`. These are unshown claims, not packaged measurements.  
relatorio-p1.md:34, relatorio-p2.md:72, design/especime-v3/medicoes/p1-2026-09-15/capturas-p1.mjs:10, design/especime-v3/medicoes/p2-2026-09-15/capturas-cartao.mjs:14, design/especime-v3/medicoes/p2-2026-09-15/capturas-cartao.mjs:136, relatorio-p2.md:185, tests/cartao/cartao.mjs:737, design/especime-v3/medicoes/p2-2026-09-15/portoes/verify.code:1

## Minor

**15. Four EU ledger rows discard the source’s published decimal precision.** Their value fields contain `70`, `11`, `6` and `6`, while the corresponding excerpts contain `70.0`, `11.0`, `6.0` and `6.0`. The quantities are numerically equal, but they are not byte-for-byte representations of the published values as the row comments claim.  
ledger/claims/divida-das-empresas-2025-ue.yml:9, ledger/claims/divida-das-empresas-2025-ue.yml:24, ledger/claims/jovens-nem-2025-ue.yml:9, ledger/claims/jovens-nem-2025-ue.yml:24, ledger/claims/taxa-de-desemprego-2025-ue.yml:9, ledger/claims/taxa-de-desemprego-2025-ue.yml:24, ledger/claims/taxa-de-desemprego-mip-2025-ue.yml:9, ledger/claims/taxa-de-desemprego-mip-2025-ue.yml:24

**16. The reports contain further unreconciled numerical and current-state contradictions.** P1 gives the final 390-pixel Portuguese page height as `2 906 px`, while its saved ruler and later table say `3 006 px`. P1 also says the personal name remains on two Method pages, whereas the copied merged Rule 9 uses “uma pessoa” and “one person”. P2 says 86 source-language names per edition, while its table says 81 source names per edition and its checker output uses 86 for the combined `lang`-marked total.  
relatorio-p1.md:126, relatorio-p1.md:184, reguas/p1-2026-09-15/blocos-a-390.txt:3, relatorio-p1.md:25, src/data/metodo.mjs:597, src/data/metodo.mjs:600, relatorio-p2.md:67, relatorio-p2.md:118, relatorio-p2.md:203

**17. Three further new Portuguese strings fail the norm’s newspaper-language test.** “Explora a possibilidade de um observatório sobre o país feito com inteligência artificial” follows the English syntax almost word for word and leaves the attachment of “feito” opaque. “Próxima conferência” is presented as the translation of “Next check”, but ordinarily denotes a conference rather than a scheduled data check. “As áreas seguem a orgânica do Governo em funções, o XXV Governo Constitucional” repeats the English appositional structure and reads as administrative translation, not newspaper Portuguese.  
NORMA-como-se-escreve-se-mostra-e-se-organiza.md:25, src/data/politica-ia.mjs:257, src/data/politica-ia.mjs:260, src/i18n/strings.mjs:2150, src/i18n/strings.mjs:3569, cadeias-p2.md:25

## «What is fine»

**18. Mechanically, both About pages open with the mandated sentence and both footer labels are correct, with “Publicação gratuita” or “Free of charge” present only on the supplied home pages.** built/sobre/index.html:1, built/en/about/index.html:1, built/index.html:2, built/en/index.html:2

**19. The copied Method Rule 9 removes the personal name consistently in Portuguese and English.** src/data/metodo.mjs:597, src/data/metodo.mjs:600

**20. The homepage map starts at “Portugal · 308 concelhos/municipalities” with its source mark, and the three final doors are whole links with the requested short labels.** built/index.html:2, built/en/index.html:2

**21. Apart from the housing discrepancies in finding 1, the other four ruler values on the supplied area page match their copied ledger value fields byte for byte.** built/areas/infraestruturas-e-habitacao/index.html:3, ledger/claims/sobrecarga-do-custo-da-habitacao-2024.yml:9, ledger/claims/sobrecarga-do-custo-da-habitacao-2025-ue.yml:9, ledger/claims/licencas-de-construcao-2024.yml:9, ledger/claims/licencas-de-construcao-2025-ue.yml:9

**22. Individual EU cards correctly call the `−50,2` value “below” its `−35` reference and the `17,6` value “above” its `+9` reference.** built/uniao-europeia/index.html:1, src/data/enquadramento/referencias.json:28, src/data/enquadramento/referencias.json:127

**23. P1’s total of 7,240 built pages and its 3,624 Portuguese/3,616 English split are backed by the saved counter output.** reguas/p1-2026-09-15/contagens-depois.txt:3, reguas/p1-2026-09-15/contagens-depois.txt:5, reguas/p1-2026-09-15/contagens-depois.txt:6

**24. P2’s saved layout JSON supports the reported reduction from a 38.4-pixel maximum spread to 17.6 pixels and records the band as non-scrolling from 768 pixels upward.** design/especime-v3/medicoes/p2-2026-09-15/gabarito-antes.json:7, design/especime-v3/medicoes/p2-2026-09-15/gabarito-depois.json:7, design/especime-v3/medicoes/p2-2026-09-15/gabarito-depois.json:21