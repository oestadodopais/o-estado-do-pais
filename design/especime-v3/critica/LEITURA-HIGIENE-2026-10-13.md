# Leitura a frio do bloco de higiene de 13.10.2026

*Lançada pelo lugar de direção às 21:16 UTC sobre o pacote do sítio de `44545189` a `100f724b` (a passagem de higiene do Codex `gpt-6-astra` em `high`, as suas três retomas na mesma sessão, e os commits do lugar de direção com os guiões do lançamento) e do motor de `2d69712` a `6bd8b70a`. O leitor: o Claude Opus 5.5 (a definição `leitor`, M26), em `high` porque o bloco é mecânico, 208 603 símbolos pelo total que a ferramenta reporta, 52 chamadas de ferramentas, sete minutos. As cinco plantas do lugar de direção (`PLANTAS-HIGIENE-2026-10-13.json`, registadas por sha256, quatro dentro dos hunks do diff e uma no relatório, pela M76) foram as cinco mordidas: os achados 1, 2, 3, 4 e 7. Os achados 5 e 6 (Major) e 8 a 11 (Minor) são reais; o 6 é do lugar de direção (o escrivão deixava de bater durante um commit) e foi corrigido pelo lugar de direção antes da passagem de correção; os outros estão decididos no mandato `MANDATO-HIGIENE-b-2026-10-13.md`. O texto do leitor segue como foi entregue, em inglês.*

## Blocking

1. **The copied `frases-jd1.mjs` turns the Portuguese comparison the wrong way round: both the `> 0` and the `< 0` branch say «menor».** The diff adds «A parcela foi maior do que a registada» for `diferenca > 0`. The copy says «menor» there. The built page prints «A parcela foi maior… na coluna de 2024», which is correct, since 56 976 > 47 402 in the excerpt. So the copy disagrees with both the diff and the page. The English branch is fine. References: src/lib/frases-jd1.mjs:18, diff.patch (frases-jd1 hunk, `+      ? diferenca > 0 ? 'A parcela foi maior…'`), built/livro-razao/amortizacoes-e-anulacoes-de-divida-fundada-2025/index.html

2. **The copied explanation's Portuguese text says the ministry count «organiza-a por função».** That is a wrong definition, and it contradicts the English edition. The diff and the built page both say «organiza-a por ministério». References: src/data/explicacoes/dinheiro-do-estado-2026.mjs:178, src/data/explicacoes/dinheiro-do-estado-2026.mjs:179, built/explicacoes/dinheiro-do-estado-2026/index.html

3. **The copied EX1-14 gate is weaker than the diff: the English «deficit of» was dropped from the regex.** The diff tests `/(?:défice de|deficit of)\s*$/i`, but the copy tests only `défice de`. With the copy, the English double negative would pass, and the English plant recorded in ex1.json would not bite. References: tests/explicacoes/explicacao.mjs:447, design/especime-v3/medicoes/higiene-2026-10-13/ex1.json

## Major

4. **The copied map invents behaviour for the clerk: it says commits take «ficheiros ou pastas explícitos».** The diff says «ficheiros explícitos». `escrivao.py` refuses folders with «é uma pasta; lista os ficheiros». References: design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md:762, scripts/leituras/escrivao.py:71-72

5. **RP4N-13 drops unconfirmed fields from `description`/`og:description` without the absence sentence the mandate asked for.** The mandate said the absence sentence goes in «onde fizer falta». Before, saldo-natural's description showed the marker on title, edition and access date. Now it reads like a complete receipt («Publicado por: PORDATA · Dados de 2025»). Yet the page itself shows five unconfirmed fields. The block also deleted the code comment that forbade composing a description «que pareça completa». References: src/lib/livro.mjs:97, src/lib/livro.mjs:109-118, design/especime-v3/medicoes/higiene-2026-10-13/metadados-antes.json:31-35, design/especime-v3/capturas/higiene-2026-10-13/entrega/saldo-natural-portugal-2025-pt-1280-conteudo.png

6. **The new clerk loses its heartbeat during every commit, so `comitar.sh` exits 3 on engine commits.** The report quotes the message (HIG-10): «comitar: o escrivão deixou de bater há mais de trinta segundos; o pedido … fica sem resultado». The cause is that `executar` runs synchronously and writes no heartbeat. Only the gates and captures branch beats. The engine hook takes about 2.5 minutes, against a 30-second limit. References: scripts/leituras/escrivao.py:238, scripts/leituras/escrivao.py:220-223, scripts/leituras/comitar.sh:41-42, relatorio-construtor.md:112

## Minor

7. **The report says 72 page captures; there are 70.** `entrega/capturas.json` has 70 results, and 7 pages × 2 editions × 5 widths is 70. The measurement-folder copy of the report and `numeros-do-relatorio.txt` both say 70. References: relatorio-construtor.md:194, design/especime-v3/medicoes/higiene-2026-10-13/RELATORIO.md:194, design/especime-v3/capturas/higiene-2026-10-13/entrega/capturas.json, numeros-do-relatorio.txt

8. **V1-39 is marked «Corrigida», but the new measure proves nothing about finding 7.** Both real runs have DAR `novas/revisoes/iguais` all 0 and `alteradas: []`. The section headed «A aritmética do achado 7» now has no arithmetic. HIG-8 admits this, but the question table hides it. References: design/especime-v3/medicoes/v1-2026-10-07/d/novidade-dar.json:13-17, design/especime-v3/medicoes/v1-2026-10-07/LEIA-ME.md:160-162, relatorio-construtor.md:86

9. **The replacement sentence for EX1-12 tells a reader nothing they did not already know.** It reads: «a conta por ministério organiza-a por ministério». An editor would cut it. The reason the two totals differ (Finanças 60,12) is no longer given. References: src/data/explicacoes/dinheiro-do-estado-2026.mjs:178-179, built/en/explainers/dinheiro-do-estado-2026/index.html

10. **The engine's lock-file instructions were made unrunnable.** `<temporario> -m pip` replaces the venv's Python with a folder placeholder. References: motor/requirements.lock.txt:16-18

11. **The captures do not cover two JD1 receipts the package says the block touched.** There are no captures of `custo-do-stock-da-divida-direta-2025` or `juros-das-administracoes-publicas-pib-2025`. References: design/especime-v3/capturas/higiene-2026-10-13/pedido-entrega.json, built/livro-razao/custo-do-stock-da-divida-direta-2025/index.html

## «What is fine»

- Final gates are all 0 at heads `996a3889` and `6bd8b70a`, with the start and end heads equal. Reference: design/especime-v3/medicoes/higiene-2026-10-13/depois-2/build.codigo.
- The plants bite in the log: metadata ×4, labels ×6, FC 36/36, and the explanation at 42/43 (the one non-biting plant is marked as not applicable). Reference: depois-2/verify.log:2459-2469.
- The three ministry labels are distinct and are the source's own words, in both editions. Reference: built/livro-razao/oe-2026-cem-euros-ministerio-administracao-interna/index.html.
- JD1-17's «O nome na fonte» shows the source's own header «2. AMORTIZAÇÕES E ANULAÇÕES (Dívida Fundada)». Reference: built/livro-razao/amortizacoes-e-anulacoes-de-divida-fundada-2025/index.html.
- No number changed. The 3 208 ledger files are byte-identical, and every figure on the built pages matches the excerpt in both editions. Reference: livro-preservado.json.
- My own run of the path detector, which found its known-positive first, finds no machine path on any added line of the engine diff. No protected engine file was touched. The counts reconcile: 77 found = 67 altered + 10 untouched, and 12 remain. Reference: motor/diff.patch, motor-caminhos-depois.json.
- ER1-12's reasoning holds, because `recusada` is defined as `provenienciaIncompleta`. Reference: design/especime-v3/medicoes/er1-2026-10-06/medir-c.mjs:16.
- RP4N-22 holds: «Open at page 273» is whole at 390 px. Reference: entrega/penalizacao-legal-um-ano-antecipacao-2026-en-390-abrir-prova.png.

not yet: four copied files disagree with the diff (findings 1 to 4), two of them change what a page says and one weakens a gate; also the RP4N-13 absence sentence is missing and the clerk's heartbeat defect is open.
