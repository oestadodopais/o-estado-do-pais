# A segunda leitura a frio do E1 · Codex gpt-6-astra, 01.10.2026

*O mesmo pacote e o mesmo prompt da leitura do Sol, lidos em paralelo e sem comunicação entre os dois leitores; as mesmas cinco plantas. Custo: 321 583 símbolos (a linha «tokens used»), das 04:18 às 04:36 UTC. A leitura fica como o leitor a escreveu.*

*A triagem do lugar de direção (Claude Fable 5.1), comum às duas leituras: o Sol apanhou quatro plantas em cinco (os achados 9, 10, 11 e 12 são as plantas R1, R2, R4 e R3; faltou-lhe a R5, a porta errada na nota do sucessor da página antiga do «Quinze Anos»), e a Astra apanhou as cinco (os seus achados 6 a 10). As duas acharam o mesmo defeito bloqueante, confirmado pelo lugar de direção na fonte: a linha «Total da tabela» das obras da candidatura do Évora 2027 imprime o total do financiamento público de capital da página 88 do dossiê, e não a soma das oito obras da página 108. Os achados reais, todos para a passagem E1c: o total errado (bloqueante); a ficha de Évora que atribui a dívida de 31.12.2025 ao executivo que saiu a 31.10 (Astra 2); a abertura do estudo da economia que afirma um défice de consumo e a sua causa sem os medir (Astra 3, Sol 5); a abertura do estudo de quem governou que faz a aritmética eleitoral «produzir» a rejeição das contas, e os cinco votos impressos em dois estudos (Astra 4, Sol 13); a abertura do Évora 2027 com a contagem decrescente velha e a receita de 2025 «de uma origem só» contra os 31 949,23 € do IEFP e os 3 920 000 € do Turismo de Portugal que o orçamento regista (Astra 5, Sol 3 e 4); a subtração do relatório de gestão de 2016 que não dá o que o relatório escreve, repetida sem o dizer (Sol 2, confirmada no excerto: «3.337.287,79-1.712.962,74» e «-1.984.259,21 €»); os seis concursos florestais fechados em agosto e setembro apresentados como portas abertas fora do anexo datado (Sol 6); a comparação 61,32 % vencido contra 51,95 % pago sem dizer que se sobrepõem, no índice e na ficha de Évora (Astra 12, Sol 7); as colunas «Plano 2015» e «Custo 2015» sem moeda e o «valor acrescentado bruto» sem explicação simples (Astra 11, Sol 8); a régua das reconciliações cujo conhecido-positivo passa com os estudos novos vazios (Sol 14). Os menores: o relatório diz que o livro do motor se vê nos recibos da página e o componente exclui as linhas sem id do sítio (Sol 15); os custos declarados por variáveis de ambiente e não lidos de registos (os dois); o mapa de migração só em agregados, 678 destinos contra 677 contados (os dois); a repartição 69 e 1 038 das células contra 75 e 1 032 nas páginas construídas (Sol 18). O mandato da E1c está em `design/especime-v3/medicoes/e1-2026-09-30/prompts/PROMPT-e1c-construtor.md`.*

## Blocking

1. **The culture study presents a financing total as the total cost of a different list of works.** The eight listed projects sum to €23,008,223.21, but the built table prints €39,336,001.42. That figure belongs to the preceding public capital-financing table; its receipt points to page 88, whereas the projects cite page 108. This attaches a sourced number to the wrong object.
   
   `motor/19 Évora 2027 Capital Europeia da Cultura/Évora 2027, Capital Europeia da Cultura (pt-PT).md:198`, `motor/19 Évora 2027 Capital Europeia da Cultura/Évora 2027, Capital Europeia da Cultura (pt-PT).md:209`, `motor/19 Évora 2027 Capital Europeia da Cultura/ledger.json:179`, `built/estudos/evora-2027-capital-europeia-da-cultura/index.html:2`

## Major

2. **Both municipality editions misattribute December 2025 balances to the October handover.** The cards describe €54,379,034.55 as debt “left” by the previous executive and “inherited” by its successor, installed on 31 October. The accounts study dates that debt to 31 December and explicitly refuses to assign the annual accounts to either administration.
   
   `src/data/municipios.mjs:561`, `src/data/municipios.mjs:591`, `src/data/municipios.mjs:598`, `motor/16 Évora Contas da Câmara/As contas da Câmara de Évora, 2010 a 2025 (pt-PT).md:62`, `motor/16 Évora Contas da Câmara/As contas da Câmara de Évora, 2010 a 2025 (pt-PT).md:189`, `built/municipios/evora/index.html:3`, `built/en/municipalities/evora/index.html:3`

3. **The economy study does not establish its opening claim that Évora produces less than it consumes.** It compares business value added per worker with a purchasing-power index, without measuring municipal production and consumption on comparable terms. Its own limitations explain that business value added excludes substantial public activity and allocates companies’ activity by headquarters.
   
   `motor/18 Évora Economia e Dinheiro de Fora/A economia de Évora e o dinheiro público que chega ao concelho por fora da câmara (pt-PT).md:15`, `motor/18 Évora Economia e Dinheiro de Fora/A economia de Évora e o dinheiro público que chega ao concelho por fora da câmara (pt-PT).md:31`, `built/estudos/evora-economia-e-dinheiro-publico-de-fora-da-camara/index.html:2`

4. **The political study retains the causal explanation that the reconciliation explicitly rejects as fact.** It says the electoral arithmetic “produces” the rejection of the accounts and repeats the five opposing votes. The accounts study says the voting reasons are undocumented; the repetition detector searches only for “2 votos a favor”, missing the surviving wording.
   
   `motor/17 Évora Quem Governou/Quem governou a Câmara de Évora, 2009 a 2025 (pt-PT).md:17`, `motor/17 Évora Quem Governou/Quem governou a Câmara de Évora, 2009 a 2025 (pt-PT).md:146`, `motor/16 Évora Contas da Câmara/As contas da Câmara de Évora, 2010 a 2025 (pt-PT).md:413`, `design/especime-v3/medicoes/e1-2026-09-30/medir-e1.py:489`

5. **The culture opening contains a stale countdown and contradicts its funding table.** The October 2026 edition says 2027 is a year and a half away. It also says the association received money from only the Culture Ministry, while its table separately records €31,949.23 from IEFP.
   
   `motor/19 Évora 2027 Capital Europeia da Cultura/Évora 2027, Capital Europeia da Cultura (pt-PT).md:5`, `motor/19 Évora 2027 Capital Europeia da Cultura/Évora 2027, Capital Europeia da Cultura (pt-PT).md:341`, `built/estudos/evora-2027-capital-europeia-da-cultura/index.html:2`

6. **The old “Quinze Anos” page’s political-successor link returns readers to the old page itself.** Its label names “Quem governou”, but its `href` names “Quinze Anos”; the source mapping declares the correct destination. The successor-date checker requires only the first successor’s link, so this broken second link escapes that check.
   
   `built/estudos/evora-quinze-anos-cinco-mandatos/index.html:2`, `src/data/studies.mjs:195`, `scripts/check-datas.mjs:373`, `scripts/check-datas.mjs:380`

7. **The copied catalogue assigns “Orçamentado, Pago, Devido” the wrong successor.** It points to the economy study. Both the diff and migration map assign this material to the accounts study.
   
   `src/data/studies.mjs:230`, `diff.patch:17614`, `relatorio-construtor.md:35`

8. **The copied Portuguese manuscript gives the wrong source for the 64-day payment figure.** It attributes both 69 and 64 days to the 2025 accounts series. The receipt identifies the 2022 management report for 64 days, and the built Portuguese page correctly uses that source: manuscript and page disagree.
   
   `motor/16 Évora Contas da Câmara/As contas da Câmara de Évora, 2010 a 2025 (pt-PT).md:299`, `motor/16 Évora Contas da Câmara/ledger.json:5037`, `built/estudos/evora-contas-da-camara-2010-2025/index.html:2`

9. **The published-studies counter is 18 in the copied row, although the catalogue and sealed history require 17.** Counting `WORKS` gives 17. The diff adds 17, and the row’s own correction also ends at 17.
   
   `ledger/claims/estudos-publicados.yml:7`, `ledger/claims/estudos-publicados.yml:37`, `src/data/studies.mjs:95`, `ledger/historias-valores.json:157`, `diff.patch:14151`

10. **The 137-day payment row remains assigned to its retired study.** Its copied `study` field contradicts the diff’s accounts-study destination. Recounting the before-snapshot rows gives 68 migrated rows, not the reported 69; the “Orçamentado” contribution is 26 migrated rows, not 27.
    
    `ledger/claims/evora-prazo-medio-de-pagamento-2025.yml:42`, `diff.patch:15358`, `relatorio-construtor.md:51`, `relatorio-construtor.md:93`

11. **The political study’s portfolio tables do not tell an unfamiliar reader what quantities such as 2,069,888 measure.** Headers such as “Plano 2015” and “Custo 2015” provide neither currency nor scale. The introduction explains these through accounting terminology rather than supplying a plain unit and interpretation.
    
    `motor/17 Évora Quem Governou/Quem governou a Câmara de Évora, 2009 a 2025 (pt-PT).md:501`, `motor/17 Évora Quem Governou/Quem governou a Câmara de Évora, 2009 a 2025 (pt-PT).md:509`, `built/estudos/evora-quem-governou-a-camara-2009-2025/index.html:2`

12. **The index and municipality summaries misdescribe 61.32% as overdue money rather than funding attached to overdue projects.** Both languages contrast this directly with 51.95% paid, without explaining that these categories overlap. The study records €41,693,864 already paid within the overdue-project group.
    
    `src/data/leituras.mjs:569`, `motor/18 Évora Economia e Dinheiro de Fora/A economia de Évora e o dinheiro público que chega ao concelho por fora da câmara (pt-PT).md:280`, `built/estudos/index.html:2`, `built/en/studies/index.html:2`, `built/municipios/evora/index.html:3`, `built/en/municipalities/evora/index.html:3`

## Minor

13. **The two symbol-cost figures are assertions, not independently evidenced measurements.** The scripts accept their totals through environment variables rather than reading usage records. E1 supplies asserted endpoints whose subtraction works; E1b supplies no endpoints. Neither provides the underlying counter trace, although both elapsed-time calculations match their stated timestamps.
    
    `relatorio-construtor.md:165`, `relatorio-construtor.md:296`, `design/especime-v3/medicoes/e1-2026-09-30/medir-e1.py:788`, `design/especime-v3/medicoes/e1-2026-09-30/e1b/medir-e1b.py:412`

14. **The aggregate migration map does not substantiate its complete block accounting.** Its table totals 678 destinations; 673 blocks plus the two declared three-way splits account for 677. The measurement discards individual destinations and cut reasons, preventing identification of the remaining assignment from this map.
    
    `relatorio-construtor.md:29`, `relatorio-construtor.md:33`, `design/especime-v3/medicoes/e1-2026-09-30/medir-e1.py:377`

## «What is fine»

15. **All 69 before-snapshot rows retain their identifiers, values, units, sources, reference dates and source URLs**, notwithstanding the migration defect above. `antes/linhas-por-estudo.json:1`, `diff.patch:14343`

16. **Both language indexes and municipality lists contain the four current Évora studies and exclude the six retired studies.** `built/estudos/index.html:2`, `built/en/studies/index.html:2`, `built/municipios/evora/index.html:3`, `built/en/municipalities/evora/index.html:3`