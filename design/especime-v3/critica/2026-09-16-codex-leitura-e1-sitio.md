# Leitura a frio do bloco E1, a metade do sítio (16.09.2026)

*Leitor: Codex (`gpt-5.6-sol`, xhigh, só leitura, efémero), fixado em `scripts/leituras/ler.sh`; 244 840 símbolos pela contagem do próprio leitor. Pacote: `pacote-e1-sitio` (a base `c032cbfe`, a cabeça do P3; a cabeça `01ebdf27`; o brief, o relatório, o diff sem as edições HTML e sem os registos, os ficheiros mudados, as duas edições fixadas, os registos e os dois manifestos, as 124 linhas do livro-razão do motor, a página do estudo e a do texto nas duas edições construídas, a lista das capturas; sem `scripts/check-documentos.mjs`, sem os índices dos estudos e as primeiras páginas, que a cópia do pacote deixou cair ao falhar num caminho inglês, e sem as imagens das capturas, o que o leitor apontou nos achados 7, 11 e 12). Cinco plantas de quatro classes (o registo em `2026-09-16-codex-leitura-e1-sitio.plantas.json`): Y1 o resumo normalizado da edição portuguesa com um algarismo trocado (o manifesto dos documentos); Y2 a data da edição inglesa trocada (a declaração); Y3 um valor de uma célula da página construída trocado (a página construída); Y4 uma contagem do relatório trocada (o relatório); Y5 a contagem de blocos de uma entrada do manifesto dos registos trocada (o manifesto dos registos). **Apanhadas: 5 de 5** (Y3 no achado 1, Y1 no 2, Y5 no 3, Y2 no 4, Y4 no 14). O leitor escreve em inglês e o texto fica como veio. Prosa da casa em português, sem travessões.*

## A triagem do lugar de direção

| achado | o que é | decisão |
|---|---|---|
| 1, 2, 3, 4, 14 (o «118») | as plantas | apanhadas; nada a corrigir |
| 5 | os títulos declarados são os nomes dos ficheiros do motor e não o título que o documento imprime | **real**: `studies.mjs` e `manifest.yml` passam ao título do H1 de cada edição |
| 6 | as páginas têm guiões (o tema, o JSON-LD) | do brief: «sem guião» quer dizer que o documento se compõe sem precisar deles; o guião do tema é o do sítio inteiro |
| 7, 11, 12 | o `check-documentos.mjs`, os índices, as primeiras páginas e as imagens ausentes do pacote | do pacote |
| 8 | o comentário da proveniência diz que os bytes não mudaram depois de `c0b19d4`, e mudaram com `b99e225` | **real**: o comentário conta a refixação |
| 9 | a catraca L1 sobe de 2 284 para 2 286 | dívida declarada, como as subidas anteriores da mesma família (a faixa do projeto contra a porta de voltar, nas páginas de documento); fica na ISSUES para fechar de uma vez |
| 10 | o `origin_ref` das oito entradas antigas mudou | do brief: o exportador escreve o commit do motor de onde exportou, e é assim que a travessia regista a proveniência; o brief dizia «nada mais muda» sem contar com isso |
| 13 | os quatro caminhos sujos do motor | de outras corridas, que as regras mandam não tocar; o brief dizia «limpa no que é deste estudo» |
| 14 (o resto) | 24 capturas contra 28; «bytes» que são caracteres; «duas novas» que são quatro | **real**: o relatório corrige-se |
| 15 | os cargos em português na tabela inglesa | decisão do lugar de direção na metade do motor: a página da associação é a fonte e os cargos ficam como ela os escreve, com a frase a dizê-lo |
| 16 a 21 | o que está bem | registado |

---

## Blocking

1. **The Portuguese built text invents `748 862,62 €` where the fixed edition and record both say `748 826,62 €`.** The wrong amount is linked publicly to `plano-saldo-2027`, whose record carries the correct value. The page’s technical appendix also prints the correct value, so the page contradicts both its record and itself.  
built/estudos/evora-2027-prometido-painel-dinheiro/texto/index.html:1, studies-src/evora-2027-prometido-painel-dinheiro/pt.html:122, registos/evora-2027-prometido-painel-dinheiro/pt.record.json:3990, registos/evora-2027-prometido-painel-dinheiro/pt.record.json:3998, ledger-rows.txt:84

2. **The Portuguese normalized document hash is wrong by its final digit.** The file hashes to `…e70f6`, which agrees with `sha256_raw` and `registos/manifest.json`; `studies-src/manifest.yml` instead declares `…e70f7`. The diff expected `…e70f6`, so this mismatch is not accounted for by the diff and the claimed D5 success cannot hold for the packaged state.  
studies-src/manifest.yml:279, studies-src/manifest.yml:281, studies-src/manifest.yml:282, registos/manifest.json:51, diff.patch:1198, diff.patch:1199

3. **The Portuguese record manifest declares 120 blocks for a 119-block record.** The record is indexed continuously from 0 through 118, while the report, diff, and English entry all declare 119. The unexplained `120` exists only in the packaged Portuguese manifest entry.  
registos/manifest.json:30, registos/manifest.json:49, registos/evora-2027-prometido-painel-dinheiro/pt.record.json:5, registos/evora-2027-prometido-painel-dinheiro/pt.record.json:5600, diff.patch:934, relatorio-construtor.md:15

4. **The English publication date is `2026-09-15` in the declaration but `2026-09-16` everywhere else.** The publication-date register, document change table, report, built page, and diff all use 16 September. A rebuild from the packaged declaration would therefore regress the public date from the supplied built page.  
src/data/studies.mjs:219, src/data/datas-de-publicacao.json:53, src/data/datas-de-publicacao.json:55, studies-src/evora-2027-prometido-painel-dinheiro/en.html:148, diff.patch:1130, relatorio-construtor.md:13, built/en/studies/evora-2027-prometido-painel-dinheiro/index.html:1

## Major

5. **The declared edition titles do not match the actual HTML and record titles.** The declaration and manifest use the abbreviated “Prometido, Painel, Dinheiro” names, while each HTML `<title>`, H1, and record `title` includes “what the panel wrote” and “money line by line.” The public study and text pages consequently present different titles for the same edition.  
src/data/studies.mjs:215, src/data/studies.mjs:219, studies-src/manifest.yml:274, studies-src/manifest.yml:285, studies-src/evora-2027-prometido-painel-dinheiro/pt.html:6, studies-src/evora-2027-prometido-painel-dinheiro/en.html:6, registos/evora-2027-prometido-painel-dinheiro/pt.record.json:6959, registos/evora-2027-prometido-painel-dinheiro/en.record.json:6959

6. **All four supplied study and text pages contain executable JavaScript despite the no-script requirement.** Each contains an inline `localStorage` theme script and loads `/js/tema.js`; the JSON-LD script elements are additional but are not needed to establish the failure. The report narrows “no script” to the `<article>`, whereas the requirement applies to the pages.  
brief.md:7, brief.md:16, relatorio-construtor.md:16, built/estudos/evora-2027-prometido-painel-dinheiro/index.html:1, built/estudos/evora-2027-prometido-painel-dinheiro/texto/index.html:1, built/en/studies/evora-2027-prometido-painel-dinheiro/index.html:1, built/en/studies/evora-2027-prometido-painel-dinheiro/text/index.html:1

7. **The required normalization implementation, `scripts/check-documentos.mjs`, is absent from the package.** The brief explicitly requires reading that script to reproduce `sha256_normalized`, and the records manifest says it performs D1 through D6. Its absence prevents reproduction of the normalization algorithm and the claimed document-gate results from the supplied evidence.  
brief.md:14, registos/manifest.json:3, registos/manifest.json:5, relatorio-construtor.md:14

8. **The declaration’s publication provenance contradicts the manifest and report.** Its comment says commit `c0b19d4…` last wrote the HTML bytes and that they never changed afterward. The manifest and report instead say commit `b99e2254…` substantively changed both stylesheets and caused the bytes to be re-fixed, invalidating the stated reason for `updated: null`.  
src/data/studies.mjs:205, src/data/studies.mjs:206, src/data/studies.mjs:208, src/data/studies.mjs:210, studies-src/manifest.yml:262, studies-src/manifest.yml:268, studies-src/manifest.yml:270, relatorio-construtor.md:7, relatorio-construtor.md:14

9. **Raising `l1_paginas` from 2,284 to 2,286 loosens a gate.** The saved composition identifies two new duplicate-destination pages, and the code raises the permitted ceiling by exactly two so they pass. Writing an exact reason does not make a higher failure allowance consistent with the report’s claim that no gate was weakened.  
scripts/check-lugar.mjs:181, scripts/check-lugar.mjs:185, scripts/check-lugar.mjs:196, scripts/check-lugar.mjs:200, design/especime-v3/medicoes/e1-2026-09-16/l1-composicao-2026-09-16.txt:1, design/especime-v3/medicoes/e1-2026-09-16/l1-composicao-2026-09-16.txt:8, relatorio-construtor.md:121, relatorio-construtor.md:126

10. **The records traversal changed provenance in all eight pre-existing manifest entries, contrary to “nothing else changes in `registos/`.”** The diff rewrites their `origin_ref` values from `05307571…` to `b99e2254…`; the report itself admits that all ten editions’ provenance changed. This is wider than adding four files and two manifest entries for the new study.  
brief.md:15, brief.md:22, relatorio-construtor.md:79, diff.patch:905, diff.patch:960, diff.patch:969, diff.patch:978, diff.patch:987, diff.patch:996, diff.patch:1005, diff.patch:1014

11. **The archive indexes and front pages required for verification are missing from `built/`.** The package supplies only the four study/text pages and one English document page, not the Portuguese or English studies indexes or front pages. The report says captures prove the front-page count, but its capture inventory contains study-index images and no front-page images.  
brief.md:17, relatorio-construtor.md:17, relatorio-construtor.md:160, relatorio-construtor.md:165, capturas.txt:17, capturas.txt:20

12. **The report’s gate, browser, capture, contrast, commit, time, and token measurements are claims rather than packaged measurements.** It says the gate exit-code files remained in the session work directory, while the capture images are absent and `capturas.txt` contains only names and sizes. It also gives no measurement command for the document hashes, article byte count, wall time, or token count.  
relatorio-construtor.md:14, relatorio-construtor.md:16, relatorio-construtor.md:83, relatorio-construtor.md:103, relatorio-construtor.md:130, relatorio-construtor.md:138, relatorio-construtor.md:158, relatorio-construtor.md:180, relatorio-construtor.md:184, capturas.txt:1

13. **The report marks the traversal complete even though the brief required a clean motor and the report records four dirty paths.** “The same as before” establishes that this block may not have caused the dirt, but it does not establish the clean status required by the mandate. The package has no repository evidence with which to resolve the contradiction.  
brief.md:15, relatorio-construtor.md:15, relatorio-construtor.md:58, relatorio-construtor.md:79

## Minor

14. **The report contains four internally false counts.** It says there are 24 captures, while its own table and `capturas.txt` enumerate 28. Its `155,507 bytes` is the Portuguese article’s inner character count, not its byte count; the packaged inner articles measure 157,227 Portuguese bytes and 155,461 English bytes. It also describes only two new files among twenty although two editions each add a record and a cortes file, and says 118 read blocks where the script and records say 119.  
relatorio-construtor.md:16, relatorio-construtor.md:58, relatorio-construtor.md:126, relatorio-construtor.md:158, relatorio-construtor.md:160, relatorio-construtor.md:165, capturas.txt:3, capturas.txt:30, scripts/provar-eyetext.mjs:296, scripts/provar-eyetext.mjs:300, registos/manifest.json:35, registos/manifest.json:39, registos/manifest.json:54, registos/manifest.json:58

15. **The English page leaves five Portuguese office labels in ordinary table cells outside quotation marks.** The page explicitly says it is retaining the source’s Portuguese labels, but the supplied rule permits Portuguese on English pages only inside quotations. The affected labels are “Presidente” and the four “Diretor” titles.  
studies-src/evora-2027-prometido-painel-dinheiro/en.html:153, studies-src/evora-2027-prometido-painel-dinheiro/en.html:154, registos/evora-2027-prometido-painel-dinheiro/en.record.json:5527, registos/evora-2027-prometido-painel-dinheiro/en.record.json:5567, built/en/studies/evora-2027-prometido-painel-dinheiro/text/index.html:1

## «What is fine»

16. **The slug and subject are correct, and both descriptions are single plain sentences whose English meaning faithfully follows the Portuguese without explaining the project.** src/data/studies.mjs:198, src/data/studies.mjs:200, src/data/studies.mjs:226, src/data/studies.mjs:228

17. **Each fixed HTML edition and its record agree exactly on 119 ordered blocks, including eight level-two headings, eighteen level-three headings, and twenty-eight tables.** studies-src/evora-2027-prometido-painel-dinheiro/pt.html:41, studies-src/evora-2027-prometido-painel-dinheiro/pt.html:157, studies-src/evora-2027-prometido-painel-dinheiro/en.html:41, studies-src/evora-2027-prometido-painel-dinheiro/en.html:157, registos/evora-2027-prometido-painel-dinheiro/pt.record.json:5600, registos/evora-2027-prometido-painel-dinheiro/en.record.json:5600

18. **All four record and cortes file hashes match their manifest fields, both records contain 182 row references, and every referenced row id occurs in `ledger-rows.txt`.** registos/manifest.json:35, registos/manifest.json:36, registos/manifest.json:38, registos/manifest.json:39, registos/manifest.json:42, registos/manifest.json:54, registos/manifest.json:55, registos/manifest.json:57, registos/manifest.json:58, registos/manifest.json:61, ledger-rows.txt:1, ledger-rows.txt:124

19. **The raw and hosted HTML copies are byte-identical in both languages, and the English raw and normalized hash fields match the actual file.** studies-src/manifest.yml:277, studies-src/manifest.yml:279, studies-src/manifest.yml:288, studies-src/manifest.yml:290, studies-src/manifest.yml:292, studies-src/manifest.yml:293

20. **Apart from the one Portuguese amount reported above, the built text composition preserves all 119 block positions and all 880 record units in each language, with the English edition matching every unit.** built/estudos/evora-2027-prometido-painel-dinheiro/texto/index.html:1, built/en/studies/evora-2027-prometido-painel-dinheiro/text/index.html:1, registos/evora-2027-prometido-painel-dinheiro/pt.record.json:6952, registos/evora-2027-prometido-painel-dinheiro/en.record.json:6952

21. **The archive counters themselves are mechanically correct at 13 studies, 18 editions, and 6 Évora studies, and the eyetext scope correctly rises from five to seven editions.** ledger/claims/estudos-publicados.yml:7, ledger/claims/edicoes-publicadas.yml:7, ledger/claims/estudos-evora-publicados.yml:7, scripts/provar-eyetext.mjs:296, scripts/provar-eyetext.mjs:301