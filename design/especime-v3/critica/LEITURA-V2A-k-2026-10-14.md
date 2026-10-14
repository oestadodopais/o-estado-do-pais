# Leitura curta da passagem V2-a-k (14.10.2026, à noite)

*Lançada pelo lugar de direção às 22:43 UTC sobre o pacote do sítio de `b1375b7c` a `9f7b19df` e do motor de `9e370c6d` a `66c9d0f3` (a passagem V2-a-k do Codex `gpt-6-astra` em `high`, pelo mandato `MANDATO-V2A-k-2026-10-14.md`, com as frases emendadas pelo lugar de direção depois da leitura da V2-a-i+j), montado por `scripts/leituras/pacote.sh` com os dezoito corpos alojados. Antes de lançar a leitura, pela emenda à regra 14, o lugar de direção leu as frases construídas nas duas edições por guião (`conferir-frases-k-direcao.py`, ao lado do relatório do bloco: trinta e duas frases, cada uma uma vez na sua página, nenhuma falha; a saída em `frases-k-direcao.txt`). O leitor: o Claude Opus 5.5 (a definição `leitor`, M26), em `xhigh`, 193 571 símbolos, 71 chamadas de ferramentas, dez minutos. As cinco plantas do lugar de direção (`PLANTAS-V2A-k-2026-10-14.json`: duas em linhas de hunks do diff, a expectativa inglesa das páginas rodoviárias sem «private» e a ressalva inglesa do total no livro do motor invertida; duas em páginas construídas, «o Estado paga» na página portuguesa dos encargos líquidos e «with financial operations» na página inglesa da despesa efetiva de 2027; uma no relatório da raiz, 470 PNG por 480) foram as cinco mordidas: os achados 1 a 5. Os achados 6 a 10 (Minor) são reais e vão para a I225; o 6 é um erro do lugar de direção pela regra 14 (a frase da ressalva citada da nota de editor da leitura anterior, que a abreviava com reticências, em vez de lida na linha: a frase retirada dizia também «incluem IVA quando aplicável, à taxa legal em vigor», que agora só a nota 1 do excerto do quadro diz); nenhum Major real, e as páginas que passaram pelos portões e foram capturadas estão certas, como o leitor diz na última linha. O texto do leitor segue como foi entregue, em inglês.*

## Blocking

1. **The packaged English Health page `oe-2027-saude-despesa-efetiva-consolidada-2027` says «Effective» is expenditure *with* financial operations, which reverses the definition.** The mandate, the expected text and PDF p. 303 all say «without»: the table prints the financial lines after effective expenditure. This file's sha256 differs from the k capture receipt, and the 1280 capture shows «without». The exact-text ruler would refuse this page, so it is not the page that passed the gates. built/en/ledger/oe-2027-saude-despesa-efetiva-consolidada-2027/index.html:2, design/especime-v3/capturas/v2a-2026-10-12/k/capturas.json:4206, brief.md:23

## Major

2. **The packaged Portuguese road net page still says «o que o Estado paga», so the amendment is undone on that page.** The other two road pages, `frases-k.md` and the mandate all say «o parceiro público (o Estado)». This file's hash also differs from the receipt. built/livro-razao/oe-2027-ppp-rodoviario-encargos-liquidos-2027/index.html:2, design/especime-v3/medicoes/v2a-2026-10-12/frases-k.md:15, design/especime-v3/capturas/v2a-2026-10-12/k/capturas.json:4192, brief.md:9

3. **The copied expected-text file drops «private» from the English road gloss.** It reads «the companies that operate the roads», while the diff and the mandate say «the private companies». Putting the word back reproduces the diff's blob `f1313f91`. With this copy, the V2AH ruler would refuse all three English road pages. tests/cartao/v2ai-frases.json:4, diff.patch:1215593, brief.md:11, tests/cartao/v2ah-palavras.mjs:19

4. **The copied engine ledger gives the total row's English ressalva as «The sector rows in the table add up exactly», the opposite of its Portuguese twin.** The diff, the manifest and the export all say «do not». The file's sha256 (1f3ab28d…) differs from the `rh_ledger_sha256` recorded for all 18 rows. Putting «do not» back reproduces 3b2362cb… and the blob `f5f0521`. motor/content/15 Orcamento do Estado 2027/ledger.json:456, motor/diff.patch:46, ledger/cruzamentos/v2a.json:113, built/livro-razao.json:103611

## Minor

5. **The report counts 470 PNG, but there are 480.** The receipt and the inspection file give 160 cases × 3 images, and all 480 hashes verify. relatorio-construtor.md:733, design/especime-v3/medicoes/v2a-2026-10-12/capturas-k-inspecao.json:4

6. **The sentence removed from the ressalva is not the one the mandate quotes.** The quoted «Valores de caixa a preços constantes de 2027.» never existed. The sentence actually removed also said «incluem IVA», which the paragraph does not restate. VAT now appears only in note 1 of the excerpt, and V2A-96 does not mention this. brief.md:13, motor/diff.patch:10, relatorio-construtor.md:716

7. **«(o Estado)» and «(as empresas privadas que exploram as vias)» are glosses that p. 124 does not carry.** Footnote 34 on that same page names Infraestruturas de Portugal as the other party to a subconcession. The second gloss also fits concessionaires. tests/cartao/v2ai-frases.json:3, src/lib/v2a-palavras.mjs:19

8. **The total page still presents the components as a closed list («de um lado …; do outro …»).** The road and PCP sentences now say «entre as principais componentes». tests/cartao/v2ai-frases.json:7

9. **I150 residue: since the gloss was cut, «operações financeiras» and «ativos e passivos financeiros» are not explained on 22 page-editions.** The number itself is still understandable. tests/cartao/v2ai-frases.json:15

10. **The crop label «página 123»/«page 123» has no «do PDF»/«PDF».** built/livro-razao/oe-2027-ppp-rodoviario-encargos-brutos-2027/index.html:2

## «What is fine»

11. The package is complete: 18 rows over five bodies, every sha256 matches its row, each body has its receipt and 27 rights files, and there is no `SEM-CORPOS-ALOJADOS.md`. motor/CORPOS-ALOJADOS.md:7
12. No value moved: the 18 values, units and excerpts agree between the export and the engine ledger, and the row diffs touch only `ressalva`. motor/diff.patch:12
13. The diff's expected text equals the mandate word for word, and the total and PCP sentences rebuild exactly from the i/j sentences plus the k swaps. 30 of the 32 page-editions match exactly once, with 4.25, 5.37 and 123 rendered and 1 152 − 263 = 889. tests/cartao/v2ai-frases.json:11
14. Against PDF pp. 123, 124 and 303, the listed components, «parceiro público», cash values in 2027 prices and the financial lines printed after effective expenditure all hold, and no sentence asserts arithmetic. ledger/provas/v2a/provas.json:386
15. The four gate codes are 0 at `17e6d819`/`66c9d0f3`, with start and end heads equal, empty state files, L1 at 2 780 and no writes during the run. The gate log shows 32 word-swap plants and 22 table plants, and the engine log shows 42 checks passing. design/especime-v3/medicoes/v2a-2026-10-12/portoes-k/verify.log:8297
16. The V2-a-j cost matches the mandate, and the other 54 copied files match their diff blobs. relatorio-construtor.md:718

not yet: two packaged pages and two copied files contradict the diff, and one of those pages reverses the meaning of «Effective». The pages that passed the gates and were captured are correct.
