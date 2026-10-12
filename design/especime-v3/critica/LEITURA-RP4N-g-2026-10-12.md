# A leitura a frio da passagem RP4-n-g pelo Claude Opus 5.5 (`xhigh`), 12.10.2026

*Lançada pelo lugar de direção às 14:40 UTC sobre o pacote do sítio de `478c8368` (a cabeça da RP4-n-f na história reescrita) a `66852410` (a cabeça do código `344081c3`) e do motor de `9293361` a `542fe4e` (a passagem RP4-n-g do Codex `gpt-6-astra` em `high`, nas duas worktrees; os 42 ficheiros alojados conferidos pelo sha256), com cinco estragos plantados nas cópias (`PLANTAS-RP4N-g-2026-10-12.json`), os registos inteiros, as exportações do livro, as oito páginas construídas e as dezasseis capturas; o total reportado pela ferramenta para o agente: 305 589 símbolos, em 13 minutos e 35 segundos, 92 chamadas de ferramentas. Os achados 1, 2, 3, 4 e 8 são as cinco plantas (todas mordidas; o leitor deu o achado 8 como Minor, e era a planta do relatório); os 5 e 6 são achados reais Major e os 7 e 9 a 16 Minor. O que o lugar de direção decidiu sobre cada um está em `design/observatorio/mandatos/MANDATO-RP4N-h-2026-10-12.md`. O texto do leitor segue como foi entregue, em inglês, só com os caminhos da cópia anonimizados.*

# Cold read: RP4-n-g (12.10.2026), Claude Opus 5.5

Package: `pacote-leitura-g`. Every path below is relative to it. Method: I applied every hunk of `diff.patch` and `motor/diff.patch` to the copied files, with a script. I recomputed the hashes, recounted the records, and read MAPA 4 p. 6, RASARP p. 106 and the pension report p. 273 with `pdftotext`.

## Blocking

1. **The water receipt (PT) misstates coverage.** `built/livro-razao/agua-nao-faturada-portugal-2024/index.html:2` says «A avaliação global abrange **noventa e cinco** por cento das entidades gestoras». The source, Quadro 49 on RASARP p. 106, prints «(para 93 % de EG)». The measured copy (`design/especime-v3/medicoes/rp4n-2026-10-06/g/recibos/agua-pt.html:2`), `g/medidas.json` and `src/data/o-que-e-das-familias.mjs:29` all say «noventa e três». The built page says something the source does not.

2. **The pension receipt (EN) states the wrong period.** `built/en/ledger/penalizacao-antecipacao-um-ano-neutra/index.html:2` says «The statutory penalty for retiring **two years** early … is about 6 %». The source, p. 273, says «0,5% por mês, equivalente a cerca de 6% por ano». The measured copy (`g/recibos/corte-en.html:2`) and the template (`src/data/o-que-e-das-familias.mjs:3126`) say «one year».

3. **Finding 6 is back in the site row.** `ledger/claims/penalizacao-antecipacao-um-ano-neutra.yml:24` has `access_date: "2026-10-12"`, the day the only access failed on TLS. The diff sets `"[a verificar]"` (`diff.patch:2354091`). So do the engine source (`motor/publisher/recortes/penalizacao-antecipacao-um-ano-neutra.yml:24`, same blob `8536cec`) and `built/livro-razao.json`. A build from this copy would print a read date that was never measured.

4. **The engine generator names a total that MAPA 4 does not print.** `motor/publisher/oe1_build.py:111` writes «pela «DESPESA EFETIVA» do MAPA 4». The diff has «DESPESA TOTAL» (`motor/diff.patch:1033`), and so does the EN line just below (`:112`). MAPA 4 p. 6 prints only «DESPESA TOTAL» (352 472 389 960) and «DESPESA TOTAL CONSOLIDADA». The next re-export would rewrite all 16 ministry derivations (`motor/content/20 Orcamento do Estado/ledger.json`) with a wrong denominator.

## Major

5. **The pass spreads «[a verificar]» seals across reader pages without saying so.** Because of RP4N-15, both pension rows now carry `access_date '[a verificar]'`.
   - Pages carrying a mark went from 28 (the f list, `relatorio-construtor.md:1354-1381`) to 38 (`g/medidas.json`, `paginas_com_marcas`). The ten new pages are both pension receipts in each edition, `/salarios-pensoes-e-apoios` and `/en/pay-pensions-and-benefits`, both Trabalho area pages, and both study indexes.
   - Incomplete rows went from 4 to 6 (`built/livro-razao.json`; `built/metodo/index.html` says «6 por confirmar»). Those rows drop out of search indexes.
   - The K2 sentence on the theme pages now carries the seal gloss mid-sentence: «é de % · um campo não confirmado contra a fonte, e não uma dúvida sobre o que está publicado : a lei falha…» (`design/especime-v3/INVENTARIO-FRASES.md:4253,4256`). Neither theme page was captured.
   - The EN receipt prints the Portuguese token: «Read at the source on [a verificar] (to verify)» (`g/recibos/corte-en.html:2`; capture `g/corte-en-1280.png`). The `selos()` plant (`tests/cartao/rp4ng.mjs:12`) only looks at `.src-chip .marcador`, so it does not see this.
   - The EN Method still promises «[a verificar] (to verify)» (`built/en/method/index.html`, section 5), while the EN area seals now say «[to verify]».
   - The report says none of this.

6. **The RP4N-15 search skipped the place the row itself names.** The row header says the PDF is mirrored «byte a byte em ResearchHub, content/11 Seguranca Social/source/, com o resumo SHA-256 555936bd…» (`ledger/claims/penalizacao-antecipacao-um-ano-neutra.yml:3-6`). The search (`g/pensao-pedidos.json`; `relatorio-construtor.md:1469-1477`) lists only receipts under `content/13 Dominios/source/rp4n/`. The previous date, `2026-08-24` (`diff.patch:2354090`), was dropped without looking there. The mandate asked for the date of the request that hosted the copy (`brief.md:8`).

## Minor

7. **A runner record was written by hand.** The legal-penalty row was created on 12.10, but it gained a hand-written `verifications: 2026-09-01 … by: corredor-diario` entry (`motor/diff.patch:1124-1128`; `ledger/claims/penalizacao-legal-um-ano-antecipacao-2026.yml:50-54`). The ledger's own rule says these entries are «escritas pelo motor…, nunca à mão» (`ledger/claims/penalizacao-antecipacao-um-ano-neutra.yml:39-40`). The receipt then shows «Releitura tentada a 01.09.2026» for a row that did not exist on that day. The mandate asked for the display, not for this record.

8. **The report miscounts the rewrite pairs.** `relatorio-construtor.md:1440` says «A prova comparou 44 pares». `g/reescrita.json` has 45 pairs, the report's own map has 45 rows (`:1664-1708`), and `relatar-g.py:16` prints `len(r['pares'])`. 45 + 24 new commits = 69, which matches `g/trailers-codigo.json`.

9. **The privacy check has no plant.** I found no known-positive for the user name, the home prefix, the instruments folder name or the worktrees folder path (`privacidade-g.py:12-29`), and none of the plant records includes one. Only the temporary folder prefix is exercised, through the legacy list. That the 16 legacy lines carry no user name is inferred from `privacidade-g.py:26`, because the files are not in the package.

10. **One plant message is invented.** «glosa alterada na sinopse» stores a message the test wrote itself (`tests/cartao/rp4ng.mjs:99`), yet the report lists it under «mensagens reais» (`relatorio-construtor.md:1606-1607`).

11. **Portuguese project words appear on the EN receipt.** «Where in the file: p. 273, Figura 8.4, rótulo da redução cumulativa» (`ledger/claims/penalizacao-antecipacao-um-ano-neutra.yml:13`, rendered in `g/recibos/corte-en.html:2`).

12. **A machine path is in the package.** `motor/publisher/manifest.evora.json:11` contains a home-relative path to the site's ledger folder. The line is pre-existing, outside the diff, and in the private engine, but it trips the package criterion.

13. **The ministries' sentence leaves a lay reader to misread «DESPESA TOTAL».** The sentence uses the map's words but never says what DESPESA TOTAL counts. The note on the same page of MAPA 4 says DESPESA TOTAL CONSOLIDADA (245 121 564 003) excludes intra-sector flows, so «Finanças 60,12 %» reads as 60 % of the budget. That note could say it in the source's own words.

14. **The reruns carry the code head, not the delivery head.** `check:series` and `check:cruzamento` record head `344081c3` (`g/reconferencia-codigo/series.log:1`, `cruzamento.log:1`), not `66852410`. The rerun on the final head is promised only «na resposta» (`relatorio-construtor.md:1561`).

15. **The cost overrun is not explained.** The report gives no cost (`relatorio-construtor.md:1751-1753`). The seat's figure of 552 340 exceeds the 300 000 target, and the mandate requires a reason (`brief.md:24`).

16. **For the seat: the prompt and the mandate disagree about the area seals.** Item 4 of the prompt expects no seal, but `brief.md:13` keeps them. Both area pages still carry 3 seals (`g/recibos/area-pt.html`, `area-en.html`), now in each edition's language. The builder followed the mandate.

## What is fine (reproduced)

- **Copies against diffs:** 232 of 235 site files and 14 of 15 engine files agree hunk by hunk. The exceptions are items 3 and 4, plus the two `alvos.json` files the seat removed.
- **Hashes:** all 16 captures match `g/capturas.json`, `g-antes/capturas.json` and the report table. All 42 hosted files match `motor/FICHEIROS-ALOJADOS-POR-FRASE.md`. 27 of 27 entries in `MANIFEST.sha256` match. `mapa4-g.pdf` matches its 200 receipt (sha256 `9e800562…`, 17 949 bytes).
- **Rewrite and trailers:** the map in `reescrita.json` matches the report; 9 commits are unchanged and trees are identical. Each of the 24 site commit files has the two trailers adjacent, and the 6 engine commits have only `Co-Authored-By`. The commit list matches `cabecas-e-commits.json`. `trailers-codigo.log` has 69 non-empty entries for 69 commits.
- **Privacy:** no file contains the user name, `/Users/`, the worktrees folder path or the temporary folder prefix (checked against a known positive). the instruments folder name appears only in item 12.
- **Gates:** `portoes-g` build, verify, typecheck and motor all read 0, on heads `344081c3` and `542fe4ee`. The verify log ends with C ✓ on that head. series and cruzamento read 0. The attempt table matches the files.
- **Ministries:** all 16 shares recompute to the cent against 352 472 389 960, which equals the sum of the ministries.
- **Water:** 26,5 falls in «]20,0; 30,0]» «Qualidade do serviço mediana» (Quadro 47). The pension label «dcum x : cumulative reduction» and 91.8 % are on p. 273.
- **Mandate items:** `livro-razao.csv` and `livro-razao.json` agree. The engine diff touches no file of another run. The unit and deadline wording (12, 18), «page» (16), the study listing and absence text (17), the absence branch with its positive case (14), and the breadcrumb plant on two HTML files are all present.

**not yet:** four Blocking defects, two false sentences on built receipts and two copies that disagree with their diffs, plus the undeclared spread of seals (item 5) and the incomplete RP4N-15 search (item 6).
