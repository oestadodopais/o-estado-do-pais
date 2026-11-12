# Folha de correções · O Orçamento de 2027: o que muda e para quem

> **Decidida a 12.11.2026.** O lugar de direção aprovou as doze correções. O Codex Astra julgou-as a `xhigh` contra as cópias das fontes, com cinco estragos plantados numa cópia desta folha, e apanhou os cinco. Dois reparos do juízo entraram aqui: na C10, a frase que diz o que o Quadro 4.4 mostra e o que não mostra da afirmação do PCP; na C12, em inglês, «the debate and vote on the details» em vez de «the committee stage». A C10 entra na linha 101, a seguir à citação do PCP.

Montada a 12.11.2026 a partir da auditoria dessa noite. Só leitura sobre o motor e o sítio. Cada frase antiga foi conferida por guião no gabarito (contagem 1 na linha) e no HTML publicado; cada excerto das provas, no documento (`pdftotext -layout -f N -l N`, espaço normalizado, contagem 1). Os tokens novos (`⟦PM:…⟧` e `⟦AN:…⟧` com estado «nova») são identificadores propostos para linhas do livro a criar.

## C01 · Em resumo (linha 12)

**O que está errado.** O resumo dá às dez linhas «(i)» do Quadro 3.2 (1 210 milhões) o peso das medidas em vigor no saldo de 2027; o relatório põe essas medidas em 5 411 milhões no Quadro A1.1, e as dez linhas são parte delas.

**Português, hoje (publicado):** O que pesa no saldo de 2027, 1 210 milhões de euros, são as dez linhas que o próprio quadro marca como «invariante» (a nota do quadro diz só isso, «Nota: (i) invariante.»; a UTAO usa a mesma palavra para um conjunto maior, na secção das medidas):

**Português, corrigido (publicado):** O que pesa no saldo de 2027 são as medidas já em vigor, 5 411 milhões de euros no quadro de políticas invariantes do relatório; dentro delas, as dez linhas que o quadro das medidas marca como «invariante» pesam 1 210 milhões (a nota do quadro diz só isso, «Nota: (i) invariante.»):

Gabarito `documento.pt.md.tmpl`, linha 12:

```
ANTES: O que pesa no saldo de 2027, ⟦PM:der-oe2027-medidas-anteriores-saldo|abs⟧ milhões de euros, são as dez linhas que o próprio quadro marca como «⟦lit:invariante⟧» (a nota do quadro diz só isso, «⟦PM:oe-2027-quadro-3-2-nota-i|excerto⟧»; a UTAO usa a mesma palavra para um conjunto maior, na secção das medidas):⟦PM:oe-2027-quadro-3-2-nota-i|cita⟧
DEPOIS: O que pesa no saldo de 2027 são as medidas já em vigor, ⟦PM:oe-2027-quadro-a1-1-impacto-saldo⟧ milhões de euros no quadro de políticas invariantes do relatório; dentro delas, as dez linhas que o quadro das medidas marca como «⟦lit:invariante⟧» pesam ⟦PM:der-oe2027-medidas-anteriores-saldo|abs⟧ milhões (a nota do quadro diz só isso, «⟦PM:oe-2027-quadro-3-2-nota-i|excerto⟧»):⟦PM:oe-2027-quadro-3-2-nota-i|cita⟧
```

**English, hoje (publicado):** What weighs on the 2027 balance, 1,210 million euros, are the ten lines the table itself marks as «invariante» (invariant; the table's note says only that, «Nota: (i) invariante.»; the UTAO uses the same word for a larger set, in the measures section):

**English, corrigido (publicado):** What weighs on the 2027 balance are the measures already in force, 5,411 million euros in the report's unchanged-policy table; within them, the ten lines the table of measures marks as «invariante» (invariant; the table's note says only that, «Nota: (i) invariante.») weigh 1,210 million:

Gabarito `documento.en.md.tmpl`, linha 12:

```
ANTES: What weighs on the 2027 balance, ⟦PM:der-oe2027-medidas-anteriores-saldo|abs⟧ million euros, are the ten lines the table itself marks as «⟦lit:invariante⟧» (invariant; the table's note says only that, «⟦PM:oe-2027-quadro-3-2-nota-i|excerto⟧»; the UTAO uses the same word for a larger set, in the measures section):⟦PM:oe-2027-quadro-3-2-nota-i|cita⟧
DEPOIS: What weighs on the 2027 balance are the measures already in force, ⟦PM:oe-2027-quadro-a1-1-impacto-saldo⟧ million euros in the report's unchanged-policy table; within them, the ten lines the table of measures marks as «⟦lit:invariante⟧» (invariant; the table's note says only that, «⟦PM:oe-2027-quadro-3-2-nota-i|excerto⟧») weigh ⟦PM:der-oe2027-medidas-anteriores-saldo|abs⟧ million:⟦PM:oe-2027-quadro-3-2-nota-i|cita⟧
```

**Provas.**

| documento | lugar | excerto | valor | para | conferido |
|---|---|---|---|---|---|
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 408 PDF | Quadro A1.1. Quadro de políticas invariantes | Quadro de políticas invariantes | o nome «quadro de políticas invariantes» | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 408 PDF | Impacto no saldo 5 411 | 5 411 | 5 411, o impacto das medidas em vigor no saldo de 2027 | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 408 PDF | Notas: Nota: sinal (+) pressão orçamental / (-) poupança orçamental. | (+) pressão orçamental | o sinal: positivo é pressão sobre o saldo | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 58 PDF | No quadro seguinte são elencadas as principais medidas de política orçamental a implementar no ano de 2027, bem como as medidas em políticas invariantes que, embora decididas em anos anteriores, ainda produzem efeitos adicionais em 2027. | (enunciado) | «dentro delas»: o relatório diz que o Quadro 3.2 lista medidas em políticas invariantes | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 59 PDF | Nota: (i) invariante. | (i) invariante | a marca (i) | sim |

**Números do livro.**

- `PM:oe-2027-quadro-a1-1-impacto-saldo`: nova: valor 5 411, milhões de euros, «Impacto no saldo (Quadro A1.1. Quadro de políticas invariantes; Impacto incremental em 2027)», período 2027
- `PM:der-oe2027-medidas-anteriores-saldo`: existente
- `PM:oe-2027-quadro-3-2-nota-i`: existente

**Arrasta.**

- src/data/leituras.mjs, cartão do estudo, «frase» pt: «As medidas novas do Orçamento de 2027 valem 79 milhões de euros a favor do saldo, as dez linhas marcadas como invariantes pesam 1 210 milhões, e os juros sobem 1 350 milhões: o que mais muda nas contas de 2027 não está no quadro das medidas.» (en: «… the ten lines the table marks as «invariante» (invariant) weigh 1,210 million …»). Verdadeiro em si, mas repete o peso que a C01 corrige; opção: «… valem 79 milhões de euros a favor do saldo, as medidas já em vigor pesam 5 411 milhões, e os juros sobem 1 350 milhões: …» (decisão da direção).
- Linha 12, frase seguinte: «E o que mais muda nas contas não está no quadro das medidas: os juros da dívida sobem …» continua verdadeira para o Quadro 3.2; o leitor pode juntá-la aos 5 411, que contam os juros (1 548 em contabilidade nacional). Sem mudança proposta.

## C02 · O que este projeto conclui (linha 23)

**O que está errado.** A conclusão dá às dez linhas «(i)» (1 210 milhões) o peso do que já estava decidido; o Quadro A1.1 do relatório põe as medidas em vigor em 5 411 milhões, e as dez linhas são parte delas.

**Português, hoje (publicado):** as dez linhas que o quadro marca como «invariante» pesam 1 210 milhões.

**Português, corrigido (publicado):** as medidas já em vigor pesam 5 411 milhões, pelo quadro de políticas invariantes do relatório, e as dez linhas que o quadro das medidas marca como «invariante», 1 210 milhões, são parte delas.

Gabarito `documento.pt.md.tmpl`, linha 23:

```
ANTES: as dez linhas que o quadro marca como «⟦lit:invariante⟧» pesam ⟦PM:der-oe2027-medidas-anteriores-saldo|abs⟧ milhões.
DEPOIS: as medidas já em vigor pesam ⟦PM:oe-2027-quadro-a1-1-impacto-saldo⟧ milhões, pelo quadro de políticas invariantes do relatório, e as dez linhas que o quadro das medidas marca como «⟦lit:invariante⟧», ⟦PM:der-oe2027-medidas-anteriores-saldo|abs⟧ milhões, são parte delas.
```

**English, hoje (publicado):** the ten lines the table marks as «invariante» (invariant) weigh 1,210 million.

**English, corrigido (publicado):** the measures already in force weigh 5,411 million, by the report's unchanged-policy table, and the ten lines the table of measures marks as «invariante» (invariant), 1,210 million, are part of them.

Gabarito `documento.en.md.tmpl`, linha 23:

```
ANTES: the ten lines the table marks as «⟦lit:invariante⟧» (invariant) weigh ⟦PM:der-oe2027-medidas-anteriores-saldo|abs⟧ million.
DEPOIS: the measures already in force weigh ⟦PM:oe-2027-quadro-a1-1-impacto-saldo⟧ million, by the report's unchanged-policy table, and the ten lines the table of measures marks as «⟦lit:invariante⟧» (invariant), ⟦PM:der-oe2027-medidas-anteriores-saldo|abs⟧ million, are part of them.
```

**Provas.**

| documento | lugar | excerto | valor | para | conferido |
|---|---|---|---|---|---|
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 408 PDF | Quadro A1.1. Quadro de políticas invariantes | Quadro de políticas invariantes | o nome do quadro | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 408 PDF | Impacto no saldo 5 411 | 5 411 | 5 411 | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 58 PDF | No quadro seguinte são elencadas as principais medidas de política orçamental a implementar no ano de 2027, bem como as medidas em políticas invariantes que, embora decididas em anos anteriores, ainda produzem efeitos adicionais em 2027. | (enunciado) | «são parte delas» | sim |

**Números do livro.**

- `PM:oe-2027-quadro-a1-1-impacto-saldo`: nova (a mesma da C01): valor 5 411, milhões de euros, «Impacto no saldo (Quadro A1.1. Quadro de políticas invariantes; Impacto incremental em 2027)», período 2027
- `PM:der-oe2027-medidas-anteriores-saldo`: existente

**Arrasta.**

- O mesmo cartão de src/data/leituras.mjs (ver C01).

## C03 · O que este projeto conclui (linha 23)

**O que está errado.** «lê isso como uma estratégia» tira à UTAO a qualificação «Uma das justificações» e o sujeito «do Governo» (§39).

**Português, hoje (publicado):** e lê isso como uma estratégia de decidir as medidas fora do Orçamento, antes da sua apresentação.

**Português, corrigido (publicado):** e aponta, como uma das justificações, a estratégia do Governo de decidir as medidas fora do Orçamento, antes da sua apresentação.

Gabarito `documento.pt.md.tmpl`, linha 23:

```
ANTES: e lê isso como uma estratégia de decidir as medidas fora do Orçamento, antes da sua apresentação.
DEPOIS: e aponta, como uma das justificações, a estratégia do Governo de decidir as medidas fora do Orçamento, antes da sua apresentação.
```

**English, hoje (publicado):** and reads it as a strategy of deciding measures outside the Budget, before its presentation.

**English, corrigido (publicado):** and gives, as one of the reasons, the Government's strategy of deciding measures outside the Budget, before its presentation.

Gabarito `documento.en.md.tmpl`, linha 23:

```
ANTES: and reads it as a strategy of deciding measures outside the Budget, before its presentation.
DEPOIS: and gives, as one of the reasons, the Government's strategy of deciding measures outside the Budget, before its presentation.
```

**Provas.**

| documento | lugar | excerto | valor | para | conferido |
|---|---|---|---|---|---|
| Relatório UTAO n.º 17/2026, apreciação preliminar da POE/2027 (`b42daf2a3b7d…`) | p. 22 PDF | Uma das justificações prende-se com a estratégia do Governo de adotar medidas de política orçamental fora do âmbito do Orçamento do Estado e previamente à sua apresentação | (enunciado) | «uma das justificações», «do Governo» | sim |

**Números do livro.**

- `PM:utao-novas-medidas`: existente (§39, já citado no @@citar da linha 22)

## C04 · O que este projeto conclui (linha 30)

**O que está errado.** 1 132 milhões é o total do Quadro 3.2, «Principais medidas», não de «todas as medidas»; o Quadro A1.1 conta os juros (1 548) como uma das medidas em vigor, dentro dos 5 411.

**Português, hoje (publicado):** mais do que o custo de todas as medidas de 2027 para o saldo no mesmo perímetro,

**Português, corrigido (publicado):** mais do que o custo das principais medidas de 2027 para o saldo no mesmo perímetro,

Gabarito `documento.pt.md.tmpl`, linha 30:

```
ANTES: mais do que o custo de todas as medidas de 2027 para o saldo no mesmo perímetro,
DEPOIS: mais do que o custo das principais medidas de 2027 para o saldo no mesmo perímetro,
```

**English, hoje (publicado):** more than the cost of all the 2027 measures to the balance within the same perimeter,

**English, corrigido (publicado):** more than the cost of the main 2027 measures to the balance within the same perimeter,

Gabarito `documento.en.md.tmpl`, linha 30:

```
ANTES: more than the cost of all the 2027 measures to the balance within the same perimeter,
DEPOIS: more than the cost of the main 2027 measures to the balance within the same perimeter,
```

**Provas.**

| documento | lugar | excerto | valor | para | conferido |
|---|---|---|---|---|---|
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 59 PDF | Quadro 3.2. Principais medidas de política orçamental com impacto em 2027 | Principais medidas de política orçamental com impacto em 2027 | «principais medidas» | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 59 PDF | Impacto no saldo -1 132 | -1 132 | 1 132 é o total desse quadro | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 408 PDF | Juros devidos pelas Administrações Públicas 1 548 | 1 548 | os juros contados como medida em vigor no Quadro A1.1 | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 58 PDF | No seu conjunto, as medidas previstas para 2027 representam um impacto orçamental de -1132 milhões de euros | -1132 | nota: o próprio relatório chama ao total do Quadro 3.2 «as medidas previstas para 2027», «no seu conjunto» | sim |

**Números do livro.**

- `PM:pm-q3-2-r26-c0`: existente

## C05 · O que este projeto conclui (linha 33)

**O que está errado.** Os 590 milhões de IRS são, na Tabela 8 e no §36 da UTAO e no Quadro A1.1 do relatório, a receita do aumento de salários E pensões; não são todos receita da atualização salarial de 1 231 milhões, e os 86,2 % não se sustentam.

**Português, hoje (publicado):** de que 590 milhões voltam ao Estado em IRS e 471 milhões em contribuições, 86,2 % do total;

**Português, corrigido (publicado):** a que associa 590 milhões de receita de IRS, do aumento de salários e pensões, e 471 milhões de contribuições;

Gabarito `documento.pt.md.tmpl`, linha 33:

```
ANTES: de que ⟦PM:utao-salarios-irs⟧ milhões voltam ao Estado em IRS e ⟦PM:utao-salarios-cs⟧ milhões em contribuições, ⟦PM:der-salarios-publicos-retorno-pct⟧ % do total;
DEPOIS: a que associa ⟦PM:utao-t8-irs-salarios-pensoes⟧ milhões de receita de IRS, do aumento de salários e pensões, e ⟦PM:utao-salarios-cs⟧ milhões de contribuições;
```

**English, hoje (publicado):** of which 590 million return to the State in income tax and 471 million in contributions, 86.2 % of the total;

**English, corrigido (publicado):** with which it associates 590 million of income-tax revenue, from wage and pension increases, and 471 million in contributions;

Gabarito `documento.en.md.tmpl`, linha 33:

```
ANTES: of which ⟦PM:utao-salarios-irs⟧ million return to the State in income tax and ⟦PM:utao-salarios-cs⟧ million in contributions, ⟦PM:der-salarios-publicos-retorno-pct⟧ % of the total;
DEPOIS: with which it associates ⟦PM:utao-t8-irs-salarios-pensoes⟧ million of income-tax revenue, from wage and pension increases, and ⟦PM:utao-salarios-cs⟧ million in contributions;
```

**Provas.**

| documento | lugar | excerto | valor | para | conferido |
|---|---|---|---|---|---|
| Relatório UTAO n.º 17/2026, apreciação preliminar da POE/2027 (`b42daf2a3b7d…`) | p. 21 PDF | Tabela 8 – Medidas em vigor (cenário de políticas invariantes) com impacto orçamental adicional em 2027 | Tabela 8 | a tabela | sim |
| Relatório UTAO n.º 17/2026, apreciação preliminar da POE/2027 (`b42daf2a3b7d…`) | p. 21 PDF | QPI-LEO art.º 75 POE/2027 MF - 31 Agosto 2026 MF | a segunda coluna de valores é a POE/2027 | a coluna | sim |
| Relatório UTAO n.º 17/2026, apreciação preliminar da POE/2027 (`b42daf2a3b7d…`) | p. 21 PDF | IRS - Receita de incremento de salários e pensões Permanente 668 0,20 590 0,17 | 590 (coluna POE/2027, M€) | 590, «salários e pensões» | sim |
| Relatório UTAO n.º 17/2026, apreciação preliminar da POE/2027 (`b42daf2a3b7d…`) | p. 21 PDF | S.S, CGA, ADSE-decorrente do incremento do aumento de salários Permanente 471 0,14 471 0,14 | 471 (coluna POE/2027, M€) | 471, «aumento de salários» | sim |
| Relatório UTAO n.º 17/2026, apreciação preliminar da POE/2027 (`b42daf2a3b7d…`) | p. 22 PDF | O efeito de segunda ordem associ- ado às atualizações de salários e pensões inclui a receita de IRS (590 M€) e as contribuições sociais (471 M€). | 590; 471 | §36: o mesmo par de valores associado a «salários e pensões» | sim |
| Relatório UTAO n.º 17/2026, apreciação preliminar da POE/2027 (`b42daf2a3b7d…`) | p. 22 PDF | A atualização salarial dos funcionários das Administrações Públicas prevista para 2027 é de 1231 M€, a qual acarreta receita de IRS (590 M€) e de contribuições sociais (471 M€). | 1231; 590; 471 | §38: a frase que o estudo seguiu | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 408 PDF | IRS \| Receita decorrente do aumento de salários e pensões -590 | -590 | o Quadro A1.1 do relatório diz o mesmo | sim |

**Números do livro.**

- `PM:utao-t8-irs-salarios-pensoes`: nova: valor 590, milhões de euros, «IRS - Receita de incremento de salários e pensões (UTAO, Tabela 8, coluna POE/2027 MF)», período 2027
- `PM:utao-salarios-cs`: existente (§38, 471; a Tabela 8 confirma o valor)
- `PM:utao-salarios-valor`: existente, inalterada (1231)
- `PM:der-salarios-publicos-retorno-pct`: sai do texto; a linha derivada (86,2) fica sem uso e retira-se
- `PM:utao-salarios-irs`: sai do texto; o nome «receita de IRS da atualização salarial» contradiz a Tabela 8; retira-se ou renomeia-se

**Arrasta.**

- src/data/nomes-eo1.mjs: «utao-salarios-irs» pt «UTAO: receita de IRS da atualização salarial», en «UTAO: income tax from the wage update»; «der-salarios-publicos-retorno-pct» pt «Salários públicos: receita fiscal e contributiva sobre a atualização». Saem com as linhas.
- src/data/o-que-e-das-familias.mjs: as entradas «utao-salarios-irs» e «der-salarios-publicos-retorno-pct» (frase da família «É o resultado da conta para «Salários públicos: receita fiscal e contributiva sobre a atualização»…»). Saem com as linhas.
- ledger/claims/utao-salarios-irs.yml e ledger/claims/der-salarios-publicos-retorno-pct.yml (gerados pelo motor).
- Technical Source/decisoes.pt.json e decisoes.en.json, unidades 11 e 36 (as figuras utao-salarios-irs e der-salarios-publicos-retorno-pct); provas.*.json; origem-das-linhas.json: regeneram-se no compor.

## C06 · O que podia funcionar melhor (linha 48)

**O que está errado.** A UTAO não «pede» a base de cálculo: nota que a proposta não traz informação que a fundamente (§42, §101).

**Português, hoje (publicado):** podia vir com a base de cálculo, como a UTAO pede.

**Português, corrigido (publicado):** podia vir com a base de cálculo; a UTAO nota que a proposta não apresenta informação que permita fundamentar a estimativa.

Gabarito `documento.pt.md.tmpl`, linha 48:

```
ANTES: podia vir com a base de cálculo, como a UTAO pede.
DEPOIS: podia vir com a base de cálculo; a UTAO nota que a proposta não apresenta informação que permita fundamentar a estimativa.
```

**English, hoje (publicado):** could come with its calculation basis, as the UTAO asks.

**English, corrigido (publicado):** could come with its calculation basis; the UTAO notes that the proposal presents no information to substantiate the estimate.

Gabarito `documento.en.md.tmpl`, linha 48:

```
ANTES: could come with its calculation basis, as the UTAO asks.
DEPOIS: could come with its calculation basis; the UTAO notes that the proposal presents no information to substantiate the estimate.
```

**Provas.**

| documento | lugar | excerto | valor | para | conferido |
|---|---|---|---|---|---|
| Relatório UTAO n.º 17/2026, apreciação preliminar da POE/2027 (`b42daf2a3b7d…`) | p. 53 PDF | A POE/2027 prevê uma receita adicional de 300 M€ associada a esta medida, sem, contudo, apresentar informação que per- mita fundamentar a estimativa ou avaliar a sua exequibilidade. | 300 | §101 | sim |
| Relatório UTAO n.º 17/2026, apreciação preliminar da POE/2027 (`b42daf2a3b7d…`) | p. 23 PDF | a POE/2027 não disponibiliza informação suficientemente detalhada sobre o seu conteúdo e os mecanismos de im- plementação | (enunciado) | §42 | sim |

**Números do livro.**

- `PM:utao-risco-fraude`: existente (§101, já no @@citar da linha 47)

## C07 · As medidas: o que é novo e o que o quadro marca como invariante (linha 73)

**O que está errado.** «nem o relatório nem a UTAO o dizem» é falso: o relatório (p. 58 e Quadro A1.1) diz que o Quadro 3.2 lista medidas em políticas invariantes, e oito das dez linhas repetem-se no A1.1; e os 5 411 são do Ministério das Finanças, não um cálculo da UTAO.

**Português, hoje (publicado):** cujo impacto adicional em 2027 ela calcula em «5411 M€»: «No contexto das alterações introduzidas pelo MF no relatório da POE/2027, as medidas em vigor, incluídas no cenário de políticas invariantes, têm um impacto adicional líquido para o saldo orçamental de 2027 negativo em 5411 M€ (1,6% do PIB). Este resultado decorre, essencialmente, do acréscimo de medidas com impacto bruto no lado da despesa (5562 M€) visto que as medidas do lado da receita (Tabela 8), apesar de apresentarem valores absolutos elevados, apresentam no seu conjunto um montante significativamente inferior (151 M€).» Se as dez linhas do quadro estão dentro desse conjunto, nem o relatório nem a UTAO o dizem.

**Português, corrigido (publicado):** cujo impacto adicional em 2027 o Ministério das Finanças põe em 5 411 milhões de euros no anexo do relatório (o Quadro A1.1, «Quadro de políticas invariantes»); a UTAO: «No contexto das alterações introduzidas pelo MF no relatório da POE/2027, as medidas em vigor, incluídas no cenário de políticas invariantes, têm um impacto adicional líquido para o saldo orçamental de 2027 negativo em 5411 M€ (1,6% do PIB). Este resultado decorre, essencialmente, do acréscimo de medidas com impacto bruto no lado da despesa (5562 M€) visto que as medidas do lado da receita (Tabela 8), apesar de apresentarem valores absolutos elevados, apresentam no seu conjunto um montante significativamente inferior (151 M€).» As dez linhas do quadro estão dentro desse conjunto. O relatório apresenta o quadro assim: «No quadro seguinte são elencadas as principais medidas de política orçamental a implementar no ano de 2027, bem como as medidas em políticas invariantes que, embora decididas em anos anteriores, ainda produzem efeitos adicionais em 2027.» E oito das dez linhas estão no Quadro A1.1 com os mesmos montantes; no lugar das duas linhas da receita que o aumento dos salários traz, o Quadro A1.1 tem 590 milhões de IRS, do aumento de salários e pensões, e 471 milhões de contribuições.

Gabarito `documento.pt.md.tmpl`, linha 73:

```
ANTES: cujo impacto adicional em 2027 ela calcula em «⟦lit:5411 M€⟧»: «⟦PM:utao-politicas-saldo|excerto⟧» Se as dez linhas do quadro estão dentro desse conjunto, nem o relatório nem a UTAO o dizem.
DEPOIS: cujo impacto adicional em 2027 o Ministério das Finanças põe em ⟦PM:oe-2027-quadro-a1-1-impacto-saldo⟧ milhões de euros no anexo do relatório (o Quadro ⟦lit:A1.1⟧, «⟦lit:Quadro de políticas invariantes⟧»); a UTAO: «⟦PM:utao-politicas-saldo|excerto⟧» As dez linhas do quadro estão dentro desse conjunto. O relatório apresenta o quadro assim: «⟦PM:oe-2027-quadro-3-2-introducao|excerto⟧» E oito das dez linhas estão no Quadro ⟦lit:A1.1⟧ com os mesmos montantes; no lugar das duas linhas da receita que o aumento dos salários traz, o Quadro ⟦lit:A1.1⟧ tem ⟦PM:oe-2027-quadro-a1-1-irs-salarios-pensoes|abs⟧ milhões de IRS, do aumento de salários e pensões, e ⟦PM:oe-2027-quadro-a1-1-contribuicoes-salarios|abs⟧ milhões de contribuições.
```

**English, hoje (publicado):** whose additional impact in 2027 it puts at «5411 M€»: «No contexto das alterações introduzidas pelo MF no relatório da POE/2027, as medidas em vigor, incluídas no cenário de políticas invariantes, têm um impacto adicional líquido para o saldo orçamental de 2027 negativo em 5411 M€ (1,6% do PIB). Este resultado decorre, essencialmente, do acréscimo de medidas com impacto bruto no lado da despesa (5562 M€) visto que as medidas do lado da receita (Tabela 8), apesar de apresentarem valores absolutos elevados, apresentam no seu conjunto um montante significativamente inferior (151 M€).» Whether the table's ten lines are inside that set, neither the report nor the UTAO says.

**English, corrigido (publicado):** whose additional impact in 2027 the Ministry of Finance puts at 5,411 million euros in the report's annex (table A1.1, «Quadro de políticas invariantes»); the UTAO: «No contexto das alterações introduzidas pelo MF no relatório da POE/2027, as medidas em vigor, incluídas no cenário de políticas invariantes, têm um impacto adicional líquido para o saldo orçamental de 2027 negativo em 5411 M€ (1,6% do PIB). Este resultado decorre, essencialmente, do acréscimo de medidas com impacto bruto no lado da despesa (5562 M€) visto que as medidas do lado da receita (Tabela 8), apesar de apresentarem valores absolutos elevados, apresentam no seu conjunto um montante significativamente inferior (151 M€).» The table's ten lines are inside that set. The report introduces the table thus: «No quadro seguinte são elencadas as principais medidas de política orçamental a implementar no ano de 2027, bem como as medidas em políticas invariantes que, embora decididas em anos anteriores, ainda produzem efeitos adicionais em 2027.» And eight of the ten lines are in table A1.1 with the same amounts; in place of the two lines for the revenue that wage growth brings, table A1.1 has 590 million in income tax, from wage and pension increases, and 471 million in contributions.

Gabarito `documento.en.md.tmpl`, linha 73:

```
ANTES: whose additional impact in 2027 it puts at «⟦lit:5411 M€⟧»: «⟦PM:utao-politicas-saldo|excerto⟧» Whether the table's ten lines are inside that set, neither the report nor the UTAO says.
DEPOIS: whose additional impact in 2027 the Ministry of Finance puts at ⟦PM:oe-2027-quadro-a1-1-impacto-saldo⟧ million euros in the report's annex (table ⟦lit:A1.1⟧, «⟦lit:Quadro de políticas invariantes⟧»); the UTAO: «⟦PM:utao-politicas-saldo|excerto⟧» The table's ten lines are inside that set. The report introduces the table thus: «⟦PM:oe-2027-quadro-3-2-introducao|excerto⟧» And eight of the ten lines are in table ⟦lit:A1.1⟧ with the same amounts; in place of the two lines for the revenue that wage growth brings, table ⟦lit:A1.1⟧ has ⟦PM:oe-2027-quadro-a1-1-irs-salarios-pensoes|abs⟧ million in income tax, from wage and pension increases, and ⟦PM:oe-2027-quadro-a1-1-contribuicoes-salarios|abs⟧ million in contributions.
```

**Provas.**

| documento | lugar | excerto | valor | para | conferido |
|---|---|---|---|---|---|
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 408 PDF | Quadro A1.1. Quadro de políticas invariantes | Quadro de políticas invariantes | nome e número do quadro | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 408 PDF | Impacto no saldo 5 411 | 5 411 | 5 411 | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 408 PDF | Fonte: Ministério das Finanças. | Ministério das Finanças | o Ministério das Finanças é a fonte do quadro | sim |
| Relatório UTAO n.º 17/2026, apreciação preliminar da POE/2027 (`b42daf2a3b7d…`) | p. 21 PDF | O relatório da POE/2027 divulgou um quadro de políticas invariantes revisto face ao apresentado em final de agosto. Com efeito, o impacto orçamental das políticas invariantes passou de 4783 M€ para 5411 M€. | 5411 | §34: a própria UTAO atribui os 5411 ao relatório do MF | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 58 PDF | No quadro seguinte são elencadas as principais medidas de política orçamental a implementar no ano de 2027, bem como as medidas em políticas invariantes que, embora decididas em anos anteriores, ainda produzem efeitos adicionais em 2027. | (enunciado) | a frase citada | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 59 PDF | Habitação - redução IVA construção de 23% para 6% (i) -94 | 94 | linha «(i)» do Quadro 3.2 | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 408 PDF | IVA \| Habitação: redução IVA construção de 23% para 6% 94 | 94 | a mesma linha no Quadro A1.1, mesmo montante | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 59 PDF | Habitação - redução IRS rendas moderadas de 25% para 10% (i) -209 | 209 | linha «(i)» do Quadro 3.2 | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 408 PDF | IRS \| Habitação: redução IRS rendas moderadas de 25% para 10% 209 | 209 | a mesma linha no Quadro A1.1, mesmo montante | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 59 PDF | Atualização dedução específica e escalões (i) -431 | 431 | linha «(i)» do Quadro 3.2 | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 408 PDF | IRS \| Atualização dedução específica e escalões 431 | 431 | a mesma linha no Quadro A1.1, mesmo montante | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 59 PDF | Redução taxa em 1 p.p. (i) -300 | 300 | linha «(i)» do Quadro 3.2 | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 408 PDF | IRC \| Redução taxa em 1 p.p. 300 | 300 | a mesma linha no Quadro A1.1, mesmo montante | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 59 PDF | SIFIDE indireto (reversão) (i) 124 | 124 | linha «(i)» do Quadro 3.2 | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 408 PDF | IRC \| SIFIDE Indireto (reversão) -124 | 124 | a mesma linha no Quadro A1.1, mesmo montante | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 59 PDF | Aumento acordo de rendimentos (i) 587 | 587 | linha «(i)» do Quadro 3.2 | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 408 PDF | Aumento acordo rendimentos 587 | 587 | a mesma linha no Quadro A1.1, mesmo montante | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 59 PDF | Aumento RMMG (i) 116 | 116 | linha «(i)» do Quadro 3.2 | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 408 PDF | Aumento RMMG 116 | 116 | a mesma linha no Quadro A1.1, mesmo montante | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 59 PDF | Acordos salariais (i) 244 | 244 | linha «(i)» do Quadro 3.2 | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 408 PDF | Acordos salariais 244 | 244 | a mesma linha no Quadro A1.1, mesmo montante | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 59 PDF | Receita decorrente do aumento de salários (i) 284 | 284 no Quadro 3.2; −590 no Quadro A1.1 | linha «(i)» do Quadro 3.2 | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 408 PDF | IRS \| Receita decorrente do aumento de salários e pensões -590 | 284 no Quadro 3.2; −590 no Quadro A1.1 | a linha que o Quadro A1.1 tem no seu lugar | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 59 PDF | Receita decorrente do aumento de salários (i) 363 | 363 no Quadro 3.2; −471 no Quadro A1.1 | linha «(i)» do Quadro 3.2 | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 408 PDF | Contribuições sociais \| Receita decorrente do aumento de salários -471 | 363 no Quadro 3.2; −471 no Quadro A1.1 | a linha que o Quadro A1.1 tem no seu lugar | sim |

**Números do livro.**

- `PM:oe-2027-quadro-a1-1-impacto-saldo`: nova (a mesma da C01): valor 5 411, milhões de euros, «Impacto no saldo (Quadro A1.1. Quadro de políticas invariantes; Impacto incremental em 2027)», período 2027
- `PM:oe-2027-quadro-3-2-introducao`: nova (excerto): valor (excerto), texto, «Introdução do Quadro 3.2», período 2027
- `PM:oe-2027-quadro-a1-1-irs-salarios-pensoes`: nova: valor -590, milhões de euros, «IRS | Receita decorrente do aumento de salários e pensões (Quadro A1.1)», período 2027
- `PM:oe-2027-quadro-a1-1-contribuicoes-salarios`: nova: valor -471, milhões de euros, «Contribuições sociais | Receita decorrente do aumento de salários (Quadro A1.1)», período 2027
- `PM:utao-politicas-saldo`: existente, inalterada

## C08 · O que muda para quem ganha o salário mínimo e para quem trabalha para o Estado (linha 88)

**O que está errado.** O mesmo erro da C05 no corpo: os 590 milhões não «voltam» todos da atualização salarial (são IRS de salários e pensões), e os 86,2 % caem.

**Português, hoje (publicado):** Ou seja, de 1 231 milhões de euros de atualização, 590 milhões voltam em IRS e 471 milhões em contribuições, 86,2 % do total.

**Português, corrigido (publicado):** Ou seja, de 1 231 milhões de euros de atualização, 471 milhões voltam em contribuições; os 590 milhões de IRS são, na Tabela 8 da mesma apreciação, a «Receita de incremento de salários e pensões».

Gabarito `documento.pt.md.tmpl`, linha 88:

```
ANTES: Ou seja, de ⟦PM:utao-salarios-valor⟧ milhões de euros de atualização, ⟦PM:utao-salarios-irs⟧ milhões voltam em IRS e ⟦PM:utao-salarios-cs⟧ milhões em contribuições, ⟦PM:der-salarios-publicos-retorno-pct⟧ % do total.
DEPOIS: Ou seja, de ⟦PM:utao-salarios-valor⟧ milhões de euros de atualização, ⟦PM:utao-salarios-cs⟧ milhões voltam em contribuições; os ⟦PM:utao-t8-irs-salarios-pensoes⟧ milhões de IRS são, na Tabela ⟦lit:8⟧ da mesma apreciação, a «⟦lit:Receita de incremento de salários e pensões⟧».
```

**English, hoje (publicado):** That is, of 1,231 million euros of update, 590 million come back in income tax and 471 million in contributions, 86.2 % of the total.

**English, corrigido (publicado):** That is, of 1,231 million euros of update, 471 million come back in contributions; the 590 million of income tax are, in the same appraisal's Tabela 8, the «Receita de incremento de salários e pensões» (revenue from wage and pension increases).

Gabarito `documento.en.md.tmpl`, linha 88:

```
ANTES: That is, of ⟦PM:utao-salarios-valor⟧ million euros of update, ⟦PM:utao-salarios-irs⟧ million come back in income tax and ⟦PM:utao-salarios-cs⟧ million in contributions, ⟦PM:der-salarios-publicos-retorno-pct⟧ % of the total.
DEPOIS: That is, of ⟦PM:utao-salarios-valor⟧ million euros of update, ⟦PM:utao-salarios-cs⟧ million come back in contributions; the ⟦PM:utao-t8-irs-salarios-pensoes⟧ million of income tax are, in the same appraisal's Tabela ⟦lit:8⟧, the «⟦lit:Receita de incremento de salários e pensões⟧» (revenue from wage and pension increases).
```

**Provas.**

| documento | lugar | excerto | valor | para | conferido |
|---|---|---|---|---|---|
| Relatório UTAO n.º 17/2026, apreciação preliminar da POE/2027 (`b42daf2a3b7d…`) | p. 21 PDF | Tabela 8 – Medidas em vigor (cenário de políticas invariantes) com impacto orçamental adicional em 2027 | Tabela 8 | «Tabela 8» | sim |
| Relatório UTAO n.º 17/2026, apreciação preliminar da POE/2027 (`b42daf2a3b7d…`) | p. 21 PDF | QPI-LEO art.º 75 POE/2027 MF - 31 Agosto 2026 MF | a segunda coluna de valores é a POE/2027 | a coluna POE/2027 | sim |
| Relatório UTAO n.º 17/2026, apreciação preliminar da POE/2027 (`b42daf2a3b7d…`) | p. 21 PDF | IRS - Receita de incremento de salários e pensões Permanente 668 0,20 590 0,17 | 590 (coluna POE/2027, M€) | 590 e o nome da linha | sim |
| Relatório UTAO n.º 17/2026, apreciação preliminar da POE/2027 (`b42daf2a3b7d…`) | p. 21 PDF | S.S, CGA, ADSE-decorrente do incremento do aumento de salários Permanente 471 0,14 471 0,14 | 471 (coluna POE/2027, M€) | 471, do aumento de salários | sim |
| Relatório UTAO n.º 17/2026, apreciação preliminar da POE/2027 (`b42daf2a3b7d…`) | p. 22 PDF | A atualização salarial dos funcionários das Administrações Públicas prevista para 2027 é de 1231 M€, a qual acarreta receita de IRS (590 M€) e de contribuições sociais (471 M€). | 1231; 590; 471 | 1231 e 471 (§38) | sim |

**Números do livro.**

- `PM:utao-t8-irs-salarios-pensoes`: nova (a mesma da C05): valor 590, milhões de euros, «IRS - Receita de incremento de salários e pensões (UTAO, Tabela 8, coluna POE/2027 MF)», período 2027
- `PM:utao-salarios-cs`: existente
- `PM:utao-salarios-valor`: existente

**Arrasta.**

- Os mesmos ficheiros da C05.

## C09 · A dívida: o que desce e porquê (linha 109)

**O que está errado.** Os saldos da União (0,7 %, −3,1 %, Roménia −7,9 %, Chipre 3,4 %) vêm do ficheiro do Eurostat atualizado a 21.07.2026 (gov_10a_main), não da atualização de abril que o parágrafo nomeia para a dívida (22.04.2026).

**Português, hoje (publicado):** No saldo, Portugal teve

**Português, corrigido (publicado):** No saldo, pela atualização de julho de 2026 do Eurostat, Portugal teve

Gabarito `documento.pt.md.tmpl`, linha 109:

```
ANTES: No saldo, Portugal teve
DEPOIS: No saldo, pela atualização de julho de 2026 do Eurostat, Portugal teve
```

**English, hoje (publicado):** On the balance, Portugal had

**English, corrigido (publicado):** On the balance, by Eurostat's July 2026 update, Portugal had

Gabarito `documento.en.md.tmpl`, linha 109:

```
ANTES: On the balance, Portugal had
DEPOIS: On the balance, by Eurostat's July 2026 update, Portugal had
```

**Provas.**

| documento | lugar | excerto | valor | para | conferido |
|---|---|---|---|---|---|
| Eurostat gov_10a_main (B9, % do PIB) (`9de28176be04…`) | json: chave updated | "updated":"2026-07-21T11:00:00+0200" | 2026-07-21 | a data da atualização dos saldos | sim |
| Eurostat gov_10a_main (B9, % do PIB) (`9de28176be04…`) | json: extension.id | "extension":{"lang":"EN","id":"GOV_10A_MAIN" | GOV_10A_MAIN | o conjunto de dados dos saldos | sim |
| Eurostat gov_10dd_edpt1 (GD, % do PIB) (`93840cb5e232…`) | json: chave updated | "updated":"2026-04-22T11:00:00+0200" | 2026-04-22 | a atualização de abril é a da dívida, e fica | sim |

**Números do livro.**

- `PM:europa-saldo-pt-2025`: existente (0.7)
- `PM:europa-saldo-eu27_2020-2025`: existente (-3.1)
- `PM:europa-saldo-ro-2025`: existente (-7.9)
- `PM:europa-saldo-cy-2025`: existente (3.4)

## C10 · O que as afirmações deixam de fora → O que muda para as empresas (linha 122)

**O que está errado.** A frase do PCP fala de receita; o estudo responde-lhe com o impacto das medidas (IRC −176, IRS −477) e com os impostos diretos da conta. No Quadro 4.4 (receita fiscal do Estado, 2026 → 2027) o IRC é a única linha que desce e todas as outras sobem: a afirmação não deixa nada de fora desse quadro, e muda-se para junto da citação do PCP na secção das empresas (linha 101).

**Português, hoje (publicado):** «O único imposto cuja receita diminuiu foi o IRC»: no quadro das medidas, o IRC perde 176 milhões em 2027 e o IRS 477 milhões; na conta, os impostos diretos no seu conjunto crescem 1,7 %. 

**Português, corrigido (publicado):** (a frase sai desta secção)

Gabarito `documento.pt.md.tmpl`, linha 122:

```
ANTES: «O único imposto cuja receita diminuiu foi o IRC»: no quadro das medidas, o IRC perde ⟦PM:pm-q3-2-r14-c0|abs⟧ milhões em 2027 e o IRS ⟦PM:pm-q3-2-r9-c0|abs⟧ milhões; na conta, os impostos diretos no seu conjunto crescem ⟦PM:pm-q4-1-r11-c2⟧ %. 
DEPOIS: (apagar)
```

**English, hoje (publicado):** «O único imposto cuja receita diminuiu foi o IRC»: in the table of measures, corporate income tax loses 176 million in 2027 and personal income tax 477 million; in the accounts, direct taxes as a whole grow 1.7 %. 

**English, corrigido (publicado):** (a frase sai desta secção)

Gabarito `documento.en.md.tmpl`, linha 122:

```
ANTES: «O único imposto cuja receita diminuiu foi o IRC»: in the table of measures, corporate income tax loses ⟦PM:pm-q3-2-r14-c0|abs⟧ million in 2027 and personal income tax ⟦PM:pm-q3-2-r9-c0|abs⟧ million; in the accounts, direct taxes as a whole grow ⟦PM:pm-q4-1-r11-c2⟧ %. 
DEPOIS: (apagar)
```

**Inserção na linha 101, por decisão do lugar de direção** (o texto entra logo a seguir à âncora, antes de « O CDS-Partido Popular» (pt) e de « CDS-Partido Popular» (en)):

- pt: Na receita fiscal do Estado que o relatório prevê para 2027 (o Quadro 4.4), o IRC é o único imposto que desce face à estimativa de 2026, de 9 704 para 9 605 milhões de euros, 1,0 %; o IRS sobe de 19 706 para 20 385 milhões, 3,4 %, e todas as outras linhas de impostos do quadro sobem. O quadro compara 2027 com 2026: mostra a descida que a frase anuncia para o próximo ano e não mostra a descida passada de que ela também fala.
- en: In the State tax revenue the report forecasts for 2027 (table 4.4), corporate income tax is the only tax that falls against the 2026 estimate, from 9,704 to 9,605 million euros, 1.0 %; personal income tax rises from 19,706 to 20,385 million, 3.4 %, and every other tax line in the table rises. The table compares 2027 with 2026: it shows the fall the sentence announces for next year and does not show the past fall it also speaks of.

```
pt, depois de «O PCP: «⟦PM:posicao-pcp-irc|excerto⟧»»: Na receita fiscal do Estado que o relatório prevê para 2027 (o Quadro ⟦lit:4.4⟧), o IRC é o único imposto que desce face à estimativa de 2026, de ⟦PM:pm-q4-4-irc-2026⟧ para ⟦PM:pm-q4-4-irc-2027⟧ milhões de euros, ⟦PM:pm-q4-4-irc-variacao|abs⟧ %; o IRS sobe de ⟦PM:pm-q4-4-irs-2026⟧ para ⟦PM:pm-q4-4-irs-2027⟧ milhões, ⟦PM:pm-q4-4-irs-variacao⟧ %, e todas as outras linhas de impostos do quadro sobem. O quadro compara 2027 com 2026: mostra a descida que a frase anuncia para o próximo ano e não mostra a descida passada de que ela também fala.
en, depois de «The PCP: «⟦PM:posicao-pcp-irc|excerto⟧»»: In the State tax revenue the report forecasts for 2027 (table ⟦lit:4.4⟧), corporate income tax is the only tax that falls against the 2026 estimate, from ⟦PM:pm-q4-4-irc-2026⟧ to ⟦PM:pm-q4-4-irc-2027⟧ million euros, ⟦PM:pm-q4-4-irc-variacao|abs⟧ %; personal income tax rises from ⟦PM:pm-q4-4-irs-2026⟧ to ⟦PM:pm-q4-4-irs-2027⟧ million, ⟦PM:pm-q4-4-irs-variacao⟧ %, and every other tax line in the table rises. The table compares 2027 with 2026: it shows the fall the sentence announces for next year and does not show the past fall it also speaks of.
```

**Provas.**

| documento | lugar | excerto | valor | para | conferido |
|---|---|---|---|---|---|
| PCP, declaração de Paula Santos sobre o OE2027 (`395be82a9d8b…`) | html | O Governo fala em descida de impostos, mas a realidade é esta: o único imposto cuja receita diminuiu foi o IRC (imposto que incide sobre os rendimentos de capital), no próximo ano – com uma taxa de 18% - voltará a descer | (afirmação) | a afirmação: fala de receita; não nomeia o ano de «diminuiu» | sim |
| PCP, declaração de Paula Santos sobre o OE2027 (`395be82a9d8b…`) | html | Declaração de Paula Santos, Presidente do Grupo Parlamentar do PCP | (autoria) | quem diz | sim |
| PCP, declaração de Paula Santos sobre o OE2027 (`395be82a9d8b…`) | html | 12 Outubro 2026, Assembleia da República | 12 Outubro 2026 | quando: depois da entrega da proposta a 8 de outubro; «no próximo ano» é 2027 | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 72 PDF | Quadro 4.4. Receita fiscal do Estado | Receita fiscal do Estado | o quadro | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 72 PDF | 2026 2027 Variação (%) | colunas 2026, 2027, variação | as colunas | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 72 PDF | - IRS 19 706 20 385 3,4 | 19 706; 20 385; 3,4 | IRS | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 72 PDF | - IRC 9 704 9 605 -1,0 | 9 704; 9 605; -1,0 | IRC, a única linha que desce | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 72 PDF | - Outros (i ncl ui CESE+AIMI+CSB+CST) 263 434 65,2 | 65,2 | sobe | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 72 PDF | - ISP 3 610 3 796 5,2 | 5,2 | sobe | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 72 PDF | - IVA 28 757 30 283 5,3 | 5,3 | sobe | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 72 PDF | - Impos tos s obre veícul os 464 486 4,7 | 4,7 | sobe | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 72 PDF | - Impos to s obre o ta ba co 1 725 1 864 8,1 | 8,1 | sobe | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 72 PDF | - IABA 365 392 7,5 | 7,5 | sobe | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 72 PDF | - Impos to do s el o 2 343 2 485 6,1 | 6,1 | sobe | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 72 PDF | - Impos to úni co de ci rcul a çã o 588 611 3,9 | 3,9 | sobe | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 72 PDF | - Outros (i ncl ui CEIF + CEFID + CAV) 284 331 16,3 | 16,3 | sobe | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 72 PDF | Receita Fiscal do Estado 67 808 70 672 4,2 | 4,2 | o total | sim |

**Números do livro.**

- `PM:pm-q4-4-irc-2026`: nova: valor 9 704, milhões de euros, «IRC (Quadro 4.4. Receita fiscal do Estado), 2026», período 2026 (estimativa)
- `PM:pm-q4-4-irc-2027`: nova: valor 9 605, milhões de euros, «IRC (Quadro 4.4. Receita fiscal do Estado), 2027», período 2027 (orçamento)
- `PM:pm-q4-4-irc-variacao`: nova: valor -1,0, %, «IRC (Quadro 4.4), Variação (%)», período 2027/2026
- `PM:pm-q4-4-irs-2026`: nova: valor 19 706, milhões de euros, «IRS (Quadro 4.4. Receita fiscal do Estado), 2026», período 2026 (estimativa)
- `PM:pm-q4-4-irs-2027`: nova: valor 20 385, milhões de euros, «IRS (Quadro 4.4. Receita fiscal do Estado), 2027», período 2027 (orçamento)
- `PM:pm-q4-4-irs-variacao`: nova: valor 3,4, %, «IRS (Quadro 4.4), Variação (%)», período 2027/2026
- `PM:posicao-pcp-irc`: existente
- `PM:pm-q3-2-r14-c0, PM:pm-q3-2-r9-c0, PM:pm-q4-1-r11-c2`: saem desta frase; continuam usadas noutras frases (linhas 55, 67, 80, 101, 122)

**Arrasta.**

- Nenhuma outra página repete a frase do PCP com estes números. A citação integral do PCP fica na linha 101.

## C11 · O que as afirmações deixam de fora (linha 122)

**O que está errado.** O mesmo da C04: «todas as medidas juntas» são as principais medidas do Quadro 3.2 (1 132); o Quadro A1.1 conta os próprios juros como medida em vigor.

**Português, hoje (publicado):** mais do que todas as medidas juntas custam ao saldo no mesmo perímetro.

**Português, corrigido (publicado):** mais do que as principais medidas do relatório juntas custam ao saldo no mesmo perímetro.

Gabarito `documento.pt.md.tmpl`, linha 122:

```
ANTES: mais do que todas as medidas juntas custam ao saldo no mesmo perímetro.
DEPOIS: mais do que as principais medidas do relatório juntas custam ao saldo no mesmo perímetro.
```

**English, hoje (publicado):** more than all the measures together cost the balance within the same perimeter.

**English, corrigido (publicado):** more than the report's main measures together cost the balance within the same perimeter.

Gabarito `documento.en.md.tmpl`, linha 122:

```
ANTES: more than all the measures together cost the balance within the same perimeter.
DEPOIS: more than the report's main measures together cost the balance within the same perimeter.
```

**Provas.**

| documento | lugar | excerto | valor | para | conferido |
|---|---|---|---|---|---|
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 59 PDF | Quadro 3.2. Principais medidas de política orçamental com impacto em 2027 | Principais medidas de política orçamental com impacto em 2027 | «principais medidas» | sim |
| Relatório do Orçamento do Estado para 2027 (Ministério das Finanças) (`a338bd0084cc…`) | p. 408 PDF | Juros devidos pelas Administrações Públicas 1 548 | 1 548 | os juros como medida em vigor | sim |

**Números do livro.**


## C12 · O calendário (linha 126)

**O que está errado.** O Parlamento mudou o calendário depois da cópia de 19.10.2026: a especialidade é de 18 a 20 de novembro e continua a 23 e 24 com a votação final global; «18 a 23» já não está na página. A votação final global continua a 24 de novembro.

**Português, hoje (publicado):** a especialidade de 18 a 23 de novembro; a votação final global a 24 de novembro.

**Português, corrigido (publicado):** a especialidade de 18 a 20 de novembro e a 23 e 24 de novembro; a votação final global a 24 de novembro.

Gabarito `documento.pt.md.tmpl`, linha 126:

```
ANTES: a especialidade de ⟦AN:oe-2027-calendario-especialidade⟧; a votação final global a ⟦AN:oe-2027-calendario-final-global⟧.
DEPOIS: a especialidade de ⟦AN:oe-2027-calendario-especialidade⟧ e a ⟦AN:oe-2027-calendario-especialidade-final⟧; a votação final global a ⟦AN:oe-2027-calendario-final-global⟧.
```

**English, hoje (publicado):** the committee stage from 18 to 23 November; the final global vote on 24 November.

**English, corrigido (publicado):** the debate and vote on the details from 18 to 20 November and on 23 and 24 November; the final global vote on 24 November.

Gabarito `documento.en.md.tmpl`, linha 126:

```
ANTES: the committee stage from ⟦AN:oe-2027-calendario-especialidade⟧; the final global vote on ⟦AN:oe-2027-calendario-final-global⟧.
DEPOIS: the debate and vote on the details from ⟦AN:oe-2027-calendario-especialidade⟧ and on ⟦AN:oe-2027-calendario-especialidade-final⟧; the final global vote on ⟦AN:oe-2027-calendario-final-global⟧.
```

**Provas.**

| documento | lugar | excerto | valor | para | conferido |
|---|---|---|---|---|---|
| Parlamento, página do OE2027, obtida pela auditoria a 12.11.2026 20:34 UTC (`1566eed756bb…`) | html | Orçamento do Estado 2027 \| Debate e votação na especialidade \| 18 a 20 de novembro | 18 a 20 de novembro | a especialidade, hoje | sim |
| Parlamento, página do OE2027, obtida pela auditoria a 12.11.2026 20:34 UTC (`1566eed756bb…`) | html | Orçamento do Estado 2027 \| Debate, votação na especialidad[ZWSP]e e votação final global \| 23 e 24 de novembro | 23 e 24 de novembro | especialidade e votação final global, hoje | sim |
| Parlamento, página do OE2027, obtida pela auditoria a 12.11.2026 20:34 UTC (`1566eed756bb…`) | html | Este ato marca o início do processo orçamental no Parlamento, que culmina com a votação final global da iniciativa a 24 de novembro. | 24 de novembro | a votação final global, hoje | sim |
| Parlamento, página do OE2027, cópia alojada a 19.10.2026 (a que o estudo usou) (`0d8ea877b233…`) | html | Orçamento do Estado 2027 \| Debate e votação na especialidade \| 18 a 23 de novembro | 18 a 23 de novembro | o que a cópia de 19.10 dizia (o estudo estava certo nessa data) | sim |

**Números do livro.**

- `AN:oe-2027-calendario-especialidade`: existente, a voltar a selar: valor «18 a 20 de novembro», documento novo (sha256 1566eed7…), período 2026-11-18/2026-11-20
- `AN:oe-2027-calendario-especialidade-final`: nova: valor 23 e 24 de novembro, data, «Debate, votação na especialidade e votação final global», período 2026-11-23/2026-11-24
- `AN:oe-2027-calendario-final-global`: existente, a voltar a selar: o valor fica «24 de novembro»; o excerto antigo («… votação final global | 24 de novembro») já não está na página; novo excerto: a frase «… culmina com a votação final global da iniciativa a 24 de novembro.»

**Arrasta.**

- src/data/dossies.mjs: «… até à votação final global, marcada para 24 de novembro.» (token oe-2027-calendario-final-global): o valor fica certo; a linha volta a selar-se contra a página nova.
- src/data/nomes-eo1.mjs e src/data/o-que-e-das-familias.mjs: entradas oe-2027-calendario-especialidade e -final-global; ledger/claims/oe-2027-calendario-*.yml.
