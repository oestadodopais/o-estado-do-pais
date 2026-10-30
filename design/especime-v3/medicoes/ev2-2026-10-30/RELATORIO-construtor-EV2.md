**Passagem interrompida pelo §4: a conferência R7 das fontes deu vermelho.** Resolveu 1656 abreviaturas; o teste esperava 1652. Nenhuma divergiu do respetivo resumo, mas a conferência protege fontes e obriga a parar. [Registo da falha](<temporário>).

Ficaram 18 ficheiros alterados no motor, sem commit. O sítio está intacto. Não houve travessia, alteração da data, portões nem publicação.

As três contas passaram no teste independente:

| Linha | Conta reproduzida | Resultado |
|---|---|---|
| `invest-var-2024-2025` | (5 104 307 − 4 752 427) / 4 752 427 × 100 | 7,4% |
| `receita-falta-2025` | 109 483 315 − 67 263 297 | 42 220 018 € |
| `outras-rec-correntes-quota-falta` | (19 427 778 − 155 573) / 42 220 018 × 100 | 45,6% |

O teste recusou as plantas do investimento de 2024 trocado e da receita cobrada trocada. Nenhuma linha anterior mudou. O estudo 07 ficou intacto.

As quatro passagens ficaram compostas assim, nas duas edições:

**1. Investimento na abertura, PT**

> Quando a receita desilude, é o investimento que cede. Em 2025 as despesas com pessoal executaram a 96,55%, as amortizações de empréstimos a 93,64% e o investimento a 21,13%; em valor pago, o investimento subiu 7,4% face a 2024. As duas primeiras são contratuais; a terceira é, nesta leitura, a que se adia.

**EN**

> When revenue disappoints, investment is what gives. In 2025 staff costs executed at 96.55%, loan amortisation at 93.64% and investment at 21.13%; in money paid, investment rose 7.4% on 2024. The first two are contractual; the third is, in this reading, the one that gets postponed.

**2. Distância entre orçamento e receita, PT**

> Orçamentar como receita o dinheiro de fora que já esteja comprometido, ou escrever ao lado de cada linha quanto dele está garantido: é essa distância que, nesta leitura, explica a queda da execução. Publicar as contas de 2024, ou dizer publicamente porque não existem. Publicar os anexos do plano e do orçamento em texto, e não em imagem, para que as linhas de cada projeto se possam ler. E o município e o regulador explicarem a diferença entre as duas séries da dívida de 2020 a 2023.

**EN**

> Budgeting as revenue the outside money that is already committed, or writing beside each line how much of it is secured: that gap is what, in this reading, explains the fall in execution. Publishing the 2024 accounts, or saying publicly why they do not exist. Publishing the annexes of the plan and the budget as text, not as images, so that each project's lines can be read. And the municipality and the regulator explaining the difference between the two debt series from 2020 to 2023.

**3. Outras receitas correntes, PT**

> A linha «outras receitas correntes» é onde o fosso entre orçamento e dinheiro é mais extremo: orçamentaram-se aí €19 427 778 e chegaram €155 573 — o relatório explica a linha como o lugar onde a dívida herdada teve de ser acomodada na aritmética do orçamento. Essa linha é 45,6% dos 42 220 018 euros que faltaram à receita de 2025 face ao orçamento corrigido.

**EN**

> The "other current revenue" line is where the budget-versus-money gap is most extreme: €19 427 778 was budgeted there and €155 573 arrived — the report explains the line as the place where inherited debt had to be accommodated in the budget's arithmetic. That line is 45.6% of the 42 220 018 euros that 2025 revenue fell short of the corrected budget.

**4. Investimento no corpo, PT**

> A despesa de capital foi de €10 989 664 — uma execução de 34,10% — e a sua composição é o facto mais afiado das contas: de €24 159 745 orçamentados para investimento propriamente dito, o município conseguiu pagar €5 104 307 — uma execução de 21,13%. O relatório atribui a execução a atrasos em projetos que esperavam PRR e a concursos públicos que ficaram desertos; é a explicação do próprio relatório. Entretanto saíram €4 308 783 em amortizações de empréstimos, a 93,64% dessa linha orçamental — a dívida foi servida quase exatamente como planeado enquanto o investimento correu a um quinto do seu plano, embora em valor pago tenha subido 7,4% face a 2024. A amortização de empréstimos é a única linha da despesa de capital que não pode deslizar **(inferência; o relatório imprime as duas taxas sem as comparar)**.

**EN**

> Capital spending was €10 989 664 — an execution of 34.10% — and its composition is the sharpest single fact in the accounts: of €24 159 745 budgeted for investment proper, the municipality managed to pay €5 104 307 — an execution of 21.13%. The report attributes the execution to delays in PRR-expected projects and to public tenders that attracted no bidders; that is the report's own explanation. Meanwhile €4 308 783 went out in loan repayments, at 93.64% of that budget line — the debt was serviced almost exactly as planned while investment ran at a fifth of its plan, although in money paid it rose 7.4% on 2024. Loan repayment is the one line of capital spending that cannot slip **(inference; the report prints both rates without comparing them)**.

As decisões e pendências ficam identificadas:

- **EV2-1:** o compositor precisou de suporte a derivações locais, declarado por `@@derivadas 16`, com as linhas em `ajustes.json`. A proveniência identifica esse ficheiro e campo, evitando uma dependência circular do livro gerado.
- **EV2-2:** as emendas usam `@@ troca` nos blocos 26 e 33 do estudo 07, apenas nos gabaritos do 16.
- **EV2-3:** a indicação de parar se as linhas entrarem no livro-razão do sítio prevaleceu sobre a instrução contraditória de as fazer chegar lá. A travessia ainda não correu.
- **EV2-4:** a data de 29.10.2026 ficou por aplicar. O registo do sítio conserva 01.10.2026 nas duas edições.

Verificação: `publisher.ev2_test` passou, `core.compor_test` passou e `publisher.export_records_test` falhou na R7. A conferência seguinte da travessia não chegou a correr. A recomposição, a geração HTML e a escrita dos registos terminaram com código 0.

Não existem códigos `.codigo` desta passagem, porque os portões não foram lançados. Consumo: **28 chamadas a `functions.exec`; três suites de conferência executadas; zero corridas dos portões completos.**