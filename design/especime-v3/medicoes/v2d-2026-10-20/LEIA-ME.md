# V2-d: análise da Saúde e das parcerias

## A segunda correção

Esta passagem corrige os Major 6 a 9 da leitura curta V2-d-b. Os achados 1 a 5 eram plantas; o achado 10 pertence ao pacote. As restantes observações ficam fora deste mandato. Os resultados da passagem anterior permanecem em `resultados-v2db.json` e no histórico Git.

Cabeça de código do sítio construída, testada e capturada: `5721861fca78e8a942d902c305c31d99bc077387`. Motor aprovado pelo pre-commit: `68d2ad676472304fe569289f43ecf91f72f95671`. O commit posterior fecha o relatório e os recibos das verificações.

A frase das reservas passa a referir expressamente o conjunto das administrações públicas. A nova linha textual da Saúde transcreve «Reserva orçamental» do quadro 5.36, Ação 4.3, página 296 do PDF. A opinião deixa de atribuir a subida da rubrica às reservas. O recibo da explicação geral também identifica o seu âmbito.

A comparação das parcerias e os recibos dizem receitas. O parágrafo sobre a revisão da previsão conserva receitas de portagem: a página 125 do PDF atribui o acréscimo dos encargos à cobrança de portagens e à remuneração por serviço ligada ao tráfego, e descreve um decréscimo das receitas de portagem. A página 119 do relatório de 2026 foi inspecionada visualmente: a primeira coluna traz 1 234 de encargos brutos e 392 de receitas. Os nomes e excertos são regenerados com palavras inteiras, confirmadas pela extração raw do mesmo corpo.

A recomendação passa a identificar a síntese mensal da execução orçamental da Entidade Orçamental. As cinco linhas dgo-* já tinham essa entidade, nomes de rubrica sem DGO e origem em eo.gov.pt; os identificadores foram conservados.

Não foi encontrada contradição numérica nas frases pedidas. A correção adicional da opinião, necessária para retirar a mesma causalidade indevida, fica registada em V2D-38.

### Códigos observados

| Conferência | Código |
| --- | --- |
| montagem_motor | 0 |
| exportacao | 0 |
| celulas_motor | 0 |
| composicao_e_auditoria | 0 |
| check:cruzamento --with-origin | 0 |
| core.gate (pre-commit) | 0 |
| build | 0 |
| check:alvos | 0 |
| check:css | 0 |
| check:discussao | 0 |
| check:frases-compostas | 0 |
| check:lugar | 0 |
| check:palavras | 0 |
| check:series | 0 |
| gate:html | 0 |
| typecheck | 0 |
| capturas | 0 |
| conferencia_do_relatorio_e_recibos | 0 |

40 conferências do motor e 840 células Eurostat; auditoria com 305 folhas e 3194 apoios. A célula dos itens passou com 114 plantas detetadas em 114. Os 60 parágrafos do relatório coincidem com o HTML e os 8 recibos afetados foram conferidos nas duas edições. As duas primeiras corridas tiveram build=1: primeiro por frases desatualizadas no inventário, depois pela contagem anterior dos recibos. Os passos não executados nessas tentativas têm código 125. A terceira corrida passou nos dez passos.

Capturas nas duas edições e nas cinco larguras declaradas: 10 páginas e 50 recortes; 60 hashes conferidos, sem transbordo horizontal, pedidos externos, recursos recusados ou erros do navegador. Inspeção visual de seis recortes, discriminados em inspecao-visual-v2dc.json. PNG em <temporario>/v2dc-capturas.

Os códigos e as últimas linhas dos registos estão em `portoes-v2dc.json`. O manifesto das capturas está em `capturas-v2dc.json`, e a inspeção em `inspecao-visual-v2dc.json`. Os registos extensos e os PNG ficam na pasta temporária da corrida. O perfil V2-d foi executado; a corrida integral do sítio fica para o GitHub. Não foi feito push.

### Decisões

**V2D-38: Âmbito da explicação das reservas**

Antes: A explicação geral era aplicada às outras despesas correntes da Saúde, também na opinião.

Depois: A comparação delimita a explicação ao conjunto das administrações públicas e cita separadamente a Reserva orçamental da Ação 4.3 do quadro 5.36. O recibo explicita o âmbito; a opinião mantém o aumento observado sem atribuir a sua causa às reservas.

O relatório não demonstra que a reserva da Saúde explique a passagem de 32,4 para 303,7. A página 296 confirma a ação, não essa relação causal.

**V2D-39: Receitas das parcerias**

Antes: A comparação e as famílias dos recibos chamavam receitas de portagem à linha receitas.

Depois: A comparação e os recibos dizem receitas nas duas edições. O parágrafo sobre a revisão da previsão conserva receitas de portagem.

O quadro 4.25 tem uma rubrica mais ampla. A página 125 do relatório de 2027 atribui expressamente o decréscimo da projeção de receita às receitas de portagem.

**V2D-40: Palavras inteiras nos nomes das linhas**

Antes: Dois rótulos de 2025 conservavam espaços introduzidos pela extração com layout.

Depois: Os nomes, localizadores e excertos são regenerados com encargos brutos e receitas. A linha inteira e o cabeçalho são confirmados pela extração raw do mesmo corpo; a seleção da coluna mantém a verificação do valor.

A leitura visual e a extração raw confirmam as palavras inteiras e os valores 1 234 e 392 na coluna 2025. As plantas trocam a coluna e alteram a confirmação raw para provar a recusa.

**V2D-41: Entidade que publica a execução mensal**

Antes: A recomendação dizia Direção-Geral do Orçamento (DGO).

Depois: A recomendação identifica a síntese mensal da execução orçamental da Entidade Orçamental nas duas edições. Os identificadores dgo-* ficam.

As cinco linhas já identificam a Entidade Orçamental, têm nomes de rubrica sem DGO e citam o corpo alojado de eo.gov.pt.

**V2D-42: Inventários após a nova linha textual**

Antes: O inventário conservava dez cadeias substituídas e a célula do Método exigia 139 recibos.

Depois: As dez cadeias são recolhidas do HTML e a célula exige 140 recibos, incluindo a reserva da Saúde. Duas plantas retiram a nova linha ou substituem-na conservando a contagem.

A primeira corrida falhou nas frases anteriores; a segunda, na contagem anterior. A travessia exportada contém 140 linhas. A verificação de cada recibo e da sua porta mantém-se.

### Frases tal como renderizam

#### Edição PT

**O orçamento da Saúde para 2027: 3,0 % sem PRR ou −1,5 % no total? As duas contas, o que muda por dentro e o que ficou por dizer**

**Como foi dito**

«Ora, esta verba do PRR foi excecional. Se retirarmos isso, o orçamento da Saúde sobre 3%», António Leitão Amaro, ministro da Presidência, num documento publicado pela RTP, a 09.10.2026. No mesmo dia, a RTP publicou: «O orçamento para Saúde sofre um corte em 2027. Cai 1,5 por cento. Estão atribuídos 17 mil 858 milhões de euros. Menos 267,5 milhões do que este ano.» A 12.10.2026, Paula Santos · PCP disse: «O investimento sofre um corte brutal de 33,7%.»

**O que as fontes dizem**

O quadro 5.37 do relatório do Orçamento, o programa Saúde, em milhões de euros.

A despesa total consolidada passa de 18 125,9 em 2026 para 17 858,4 em 2027, uma variação de −1,5 %. A despesa efetiva consolidada passa de 18 062,4 para 17 803,1, −1,4 %. Sem o PRR, o Plano de Recuperação e Resiliência, a despesa efetiva consolidada passa de 17 291,3 para 17 803,1, 3,0 %.

Por dentro, a despesa com o pessoal passa de 7 783,1 para 8 184,3, 5,2 %; a aquisição de bens e serviços, a maior rubrica do programa, passa de 8 832,9 para 8 436,3, −4,5 %; o investimento passa de 1 022,5 para 678,3, −33,7 % com o PRR e 22,2 % sem ele; as outras despesas correntes passam de 32,4 para 303,7, e as transferências de capital de 272,9 para 0,0.

O financiamento, na comparação entre os dois orçamentos: as receitas de impostos passam de 15 116,4 para 15 452,2; as receitas próprias de 1 289,5 para 2 017,6, 56,5 %; os fundos europeus de 655,0 para 174,6. As transferências para o Serviço Nacional de Saúde passam de 14 935,8 para 15 539,2, 4,0 %.

Desde 2020, a Saúde gastou todos os anos mais do que o orçamento inicial: 11 282,2 orçamentados e 11 731,9 executados em 2020; 16 853,5 e 17 241,5 em 2025; em 2026 o orçamento inicial era 17 300,2 e a estimativa de execução do relatório é 18 125,9, 825,7 acima; a UTAO, que parte de outra base, conta 915 na despesa efetiva.

Na execução até agosto de 2026, a despesa efetiva do programa Saúde foi de 11 822,6, 19,9 % acima do mesmo período de 2025, e o Serviço Nacional de Saúde tinha nesses oito meses um saldo de −918,5 milhões de euros, com a despesa a crescer 13,2 %.

Na comparação europeia, Portugal gastou em saúde 10,20 % do PIB em 2024, a União 10,16 %; por habitante, em euros correntes e sem correção pelos preços, 2 764,83 euros contra 4 074,88 na União; só nos regimes públicos e nos regimes contributivos obrigatórios, 6,31 % do PIB contra 8,17 %.

**A comparação**

Os números da RTP, a queda, o montante e a diferença, coincidem com a linha da despesa total consolidada: −267,5 milhões de euros, −1,5 %. O número do ministro coincide com a variação da linha da despesa efetiva consolidada sem o PRR, 3,0 %, a mesma que o relatório escreve e que a UTAO, a unidade técnica de apoio orçamental do Parlamento, confirma: «Todavia, excluído o efeito do PRR, a despesa aumentaria 3,0%.» O número do PCP sobre o investimento coincide com a linha do investimento com o PRR, −33,7 %; sem o PRR, a mesma linha sobe 22,2 %.

A descida vem toda do fim do PRR. Em 2026 o PRR valia 771,1 na despesa efetiva da Saúde; em 2027 vale zero, e a despesa efetiva é a mesma com e sem ele, 17 803,1 e 17 803,1. A despesa fora do PRR sobe 511,8, o que repõe 66,4 % do que o PRR deixa; a diferença, −259,3, é a queda da despesa efetiva.

O que sobe e o que desce não são a mesma coisa: o pessoal leva mais 401,2; a aquisição de bens e serviços leva menos 396,6; o investimento leva menos 344,2; e as outras despesas correntes passam de 32,4 para 303,7. O relatório explica o crescimento desta rubrica, para o conjunto das administrações públicas, assim: «De relevar ainda o crescimento das outras despesas correntes, decorrente da constituição das reservas orçamentais a serem mobilizadas durante a execução orçamental, em linha com o aprofundamento da autonomia na gestão orçamental de cada área setorial iniciada em 2026.»; e o programa Saúde inscreve uma «Reserva orçamental» entre as suas ações. O financiamento conta com receitas próprias a crescer 56,5 % e com fundos europeus a cair de 655,0 para 174,6.

A redução do PRR não é só da Saúde: em 2026 o PRR pesava 1 472,7 nas Finanças, 1 357,1 na Economia, 1 133,0 nas Infraestruturas e habitação, 823,2 no Ambiente e energia e 771,1 na Saúde. Em 2027 a despesa fora do PRR cresce 3,0 % na Saúde, 4,9 % na Educação, 8,8 % no Trabalho, solidariedade e segurança social, 20,8 % nas Infraestruturas e habitação, 18,2 % na Justiça e 13,1 % na Segurança interna; e varia −7,8 % nas Finanças, −4,9 % na Economia e −38,2 % na Coesão territorial.

O orçamento de 2027, 17 858,4, é inferior ao que o relatório estima que se gaste em 2026, 18 125,9, e superior em 3,6 % ao que se gastou em 2025, 17 241,5. A UTAO escreve, sobre a execução do Serviço Nacional de Saúde em 2027: «Existe um risco de pressão orçamental associado à execução do Serviço Nacional de Saúde (SNS).»

**A conclusão**

As três afirmações correspondem a linhas diferentes do quadro e nenhuma apresenta as três medidas em conjunto. A Saúde tem orçamentados em 2027 menos 267,5 milhões de euros do que a estimativa de despesa de 2026 porque o PRR acaba, e a despesa fora do PRR sobe 511,8 face aos 771,1 que o PRR deixa. A despesa com pessoal sobe, enquanto a compra de bens e serviços e o investimento descem. Desde 2020 nenhum orçamento inicial da Saúde dos anos com execução concluída chegou ao fim do ano sem ser ultrapassado, e o de 2027 é inferior ao que se estima gastar em 2026.

**A recomendação**

A pergunta útil não é se o orçamento da Saúde sobe ou desce, é se chega: a resposta dos últimos seis anos é que não chegou nenhuma vez, e a execução até agosto de 2026, 19,9 % acima de 2025, reforça o risco de nova insuficiência. Quem acompanhar a Saúde em 2027 olha para a síntese mensal da execução orçamental da Entidade Orçamental e para a eventual necessidade de reforço, não apenas para a aprovação.

**A opinião do lugar de direção**

O ministro e a RTP escolheram cada um a linha que lhes convinha, e as duas são verdadeiras; a discussão sobre «sobe» ou «desce» esconde o que o quadro mostra: um orçamento que paga mais pessoal com menos compras e menos investimento, que aumenta as outras despesas correntes, que conta com receitas próprias a crescer mais de metade sem que o relatório explique de onde vêm, e que, pelo que a execução de 2026 e os seis anos anteriores mostram, corre o risco de voltar a ser ultrapassado. O orçamento da Saúde para 2027 é um orçamento de transição para o fim do PRR, e a sua medida certa conhece-se na execução, não na aprovação. Dizer isto custava mais do que dizer «sobe» ou «cai», e era o que o debate devia.

**As parcerias rodoviárias: o que o Estado paga, o que vai pagar e o que não está no quadro**

**Como foi dito**

«Vem com um orçamento que entrega 1 700 milhões às parcerias público-privadas rodoviárias», Paulo Raimundo · PCP, na Assembleia da República, a 09.10.2026. A 12.10.2026, Paula Santos · PCP: «Em sentido inverso cresce mais do que o previsto a despesa com as chamadas PPP – rodoviárias, ferroviárias, saúde – com o Governo a desviar mais de 1800 milhões de euros de recursos públicos para os grupos económicos privados, sem que tal se traduza em novas infraestruturas ou investimento nas existentes.» A 15.10.2026, Paulo Raimundo: «Há condições, há recursos e meios, desde logo na Segurança Social, mas há também opções que se podem e têm de fazer, e entre os mais de 1700 milhões de euros que o Governo quer pagar em PPP e o aumento dos reformados, da nossa parte não temos dúvidas da opção a tomar.»

**O que as fontes dizem**

O quadro 4.25 do relatório do Orçamento, as parcerias público-privadas, 2027, em milhões de euros.

Os encargos brutos do setor rodoviário são 1 152; as receitas, 263; os encargos líquidos, 889. As parcerias ferroviárias custam 312 e as da saúde 254, numa linha única cada, sem receitas; os encargos brutos rodoviários mais os encargos ferroviários e da saúde somam 1 718, e o total líquido impresso para todos os setores é 1 438. Previsão, não execução. As linhas setoriais do quadro não somam exatamente o total impresso; o quadro não explica a diferença. O quadro diz que os valores são de caixa e, quando aplicável, incluem o IVA.

Os encargos líquidos rodoviários, ano a ano, pelos relatórios do Orçamento: 1 250 em 2021 (execução), 1 192 em 2022, 1 105 em 2023, 1 012 em 2024, 843 em 2025, 942 em 2026 (estimativas) e 889 em 2027 (orçamento).

O relatório projeta 705 em 2028, 648 em 2029, 77 em 2035 e 17 em 2040, o último ano com encargos rodoviários; em 2030 as receitas excedem os encargos e a linha é negativa, −220.

Para 2027, o relatório do ano passado previa 774 de encargos líquidos; este prevê 889. Segundo o relatório, a diferença vem dos custos da cobrança das portagens e dos pagamentos ligados ao tráfego, que subiram, e das receitas de portagem, que desceram.

Fora do quadro, no capítulo dos riscos, o relatório conta 2 388,2 milhões de euros em pedidos de reequilíbrio financeiro e litígios das concessionárias e subconcessionárias rodoviárias, com dados do primeiro trimestre, reportados a 31.03.2026, 1 140 acima do relatório anterior, dos quais 1 122,5 da Brisa, na negociação em curso, e 445 da ação principal da Rotas do Algarve Litoral, em que a Infraestruturas de Portugal paga, por decisão provisória, cerca de 1,3 milhões por mês, mais IVA. A UTAO distingue os pedidos dos encargos efetivos: «São pretensões dos parceiros privados, e não encargos já reconhecidos; a sua concretização, total ou parcial, oneraria o saldo orçamental de anos futuros.»

**A comparação**

Nenhum dos valores rodoviários do quadro é igual a 1 700 milhões de euros: o número está 548 acima dos encargos brutos e 811 acima dos líquidos.

O número aproxima-se da soma dos encargos brutos rodoviários com os encargos ferroviários e da saúde, 1 718, sem que isso demonstre a conta que lhe deu origem; as rodoviárias são 61,82 % do total líquido. O próprio PCP alargou depois o universo referido às parcerias rodoviárias, ferroviárias e da saúde, a 12.10.2026 e a 15.10.2026, com 1 800 milhões de euros e 1 700 milhões de euros.

O relatório prevê para as parcerias rodoviárias 889 líquidos em 2027 contra 1 250 executados em 2021, −28,9 %; mas mais do que os 843 estimados para 2025: os encargos brutos descem de 1 234 para 1 152, e as receitas previstas descem mais, de 392 para 263. A projeção tem uma tendência de redução, com oscilações, até 17 em 2040.

O número que falta nas três afirmações citadas é o dos pedidos pendentes, 2 388,2, que não está no quadro dos encargos nem nessas afirmações, e que é maior do que os encargos rodoviários brutos e do que o número da primeira afirmação.

**A conclusão**

O relatório prevê 889 milhões líquidos para as parcerias rodoviárias em 2027, −28,9 % face à execução de 2021 mas acima da estimativa para 2025, e o quadro projeta uma tendência de redução, com oscilações, até ao fim dos contratos. O número da primeira afirmação do PCP aproxima-se do custo bruto de todas as parcerias, não do das rodoviárias. E o que pode mudar a conta não está no quadro: 2 388,2 milhões de pedidos das concessionárias, dos quais 1 122,5 numa negociação em curso.

**A recomendação**

A discussão útil em 2027 é a negociação com a Brisa e os litígios pendentes, além do valor orçamentado dos pagamentos contratados. Quem quiser vigiar as parcerias olha para o capítulo dos riscos do relatório e para o relatório anual da UTAP, a unidade técnica de acompanhamento de projetos, não só para o quadro dos encargos.

**A opinião do lugar de direção**

O PCP tem razão ao chamar a atenção para o custo das parcerias, mas erra ao atribuir às rodoviárias um número que ultrapassa os seus encargos brutos. As parcerias custam ao Estado mais de mil milhões brutos no ano orçamentado; a afirmação posterior já abrange as rodoviárias, as ferroviárias e as da saúde, mas o seu montante, 1 800 milhões de euros, também excede a soma do quadro. O Governo, por sua vez, apresenta um quadro dos pagamentos contratados e remete para um capítulo de riscos os pedidos que podem mudar a conta. Entre os dois, o leitor fica a saber os pagamentos previstos às concessionárias; fica por saber quanto dos pedidos pendentes se tornará encargo efetivo, e é essa a conta que o Parlamento devia pedir antes de votar.

#### Edição EN

**The Health budget for 2027: 3,0 % without the RRP or −1,5 % in total? Both counts, what changes inside it, and what went unsaid**

**As it was said**

«Ora, esta verba do PRR foi excecional. Se retirarmos isso, o orçamento da Saúde sobre 3%», António Leitão Amaro, ministro da Presidência, in a document published by RTP, on 09.10.2026. On the same day, RTP published: «O orçamento para Saúde sofre um corte em 2027. Cai 1,5 por cento. Estão atribuídos 17 mil 858 milhões de euros. Menos 267,5 milhões do que este ano.» On 12.10.2026, Paula Santos · PCP said: «O investimento sofre um corte brutal de 33,7%.»

**What the sources say**

Table 5.37 of the Budget report, the Health programme, in million euros.

Total consolidated expenditure goes from 18 125,9 in 2026 to 17 858,4 in 2027, a change of −1,5 %. Consolidated effective expenditure goes from 18 062,4 to 17 803,1, −1,4 %. Without the RRP, the Recovery and Resilience Plan, consolidated effective expenditure goes from 17 291,3 to 17 803,1, 3,0 %.

Inside it, personnel expenditure goes from 7 783,1 to 8 184,3, 5,2 %; the purchase of goods and services, the programme's largest line, goes from 8 832,9 to 8 436,3, −4,5 %; investment goes from 1 022,5 to 678,3, −33,7 % with the RRP and 22,2 % without it; other current expenditure goes from 32,4 to 303,7, and capital transfers from 272,9 to 0,0.

The financing, comparing the two budgets: tax revenue goes from 15 116,4 to 15 452,2; own revenue from 1 289,5 to 2 017,6, 56,5 %; European funds from 655,0 to 174,6. Transfers to the National Health Service go from 14 935,8 to 15 539,2, 4,0 %.

Since 2020, Health has spent more than its initial budget every year: 11 282,2 budgeted and 11 731,9 executed in 2020; 16 853,5 and 17 241,5 in 2025; in 2026 the initial budget was 17 300,2 and the report's execution estimate is 18 125,9, 825,7 above; the UTAO, starting from another base, counts 915 in effective expenditure.

In the execution to August 2026, the Health programme's effective expenditure was 11 822,6, 19,9 % above the same period of 2025, and the National Health Service had, in those eight months, a balance of −918,5 million euros, with expenditure growing 13,2 %.

In the European comparison, Portugal spent 10,20 % of GDP on health in 2024, the EU 10,16 %; per inhabitant, in current euros and without correction for price levels, 2 764,83 euros against 4 074,88 in the EU; in government schemes and compulsory contributory schemes alone, 6,31 % of GDP against 8,17 %.

**The comparison**

RTP's figures, the fall, the amount and the difference, match the line for total consolidated expenditure: −267,5 million euros, −1,5 %. The minister's figure matches the change in the line for consolidated effective expenditure without the RRP, 3,0 %, the one the report writes and the UTAO, Parliament's technical budget support unit, confirms: «Todavia, excluído o efeito do PRR, a despesa aumentaria 3,0%.» The PCP's figure on investment matches the investment line with the RRP, −33,7 %; without the RRP, the same line rises 22,2 %.

The fall comes entirely from the end of the RRP. In 2026 the RRP accounted for 771,1 in effective Health expenditure; in 2027 it is zero, and effective expenditure is the same with and without it, 17 803,1 and 17 803,1. Expenditure outside the RRP rises 511,8, replacing 66,4 % of what the RRP leaves; the difference, −259,3, is the fall in effective expenditure.

What rises and what falls are not the same thing: personnel takes 401,2 more; the purchase of goods and services takes 396,6 less; investment takes 344,2 less; and other current expenditure goes from 32,4 to 303,7. The report explains the growth of this line, for general government as a whole, thus: «De relevar ainda o crescimento das outras despesas correntes, decorrente da constituição das reservas orçamentais a serem mobilizadas durante a execução orçamental, em linha com o aprofundamento da autonomia na gestão orçamental de cada área setorial iniciada em 2026.»; and the Health programme lists a «Reserva orçamental» among its actions. The financing counts on own revenue growing 56,5 % and on European funds falling from 655,0 to 174,6.

The reduction in the RRP is not confined to Health: in 2026 the RRP accounted for 1 472,7 in Finance, 1 357,1 in Economy, 1 133,0 in Infrastructure and housing, 823,2 in Environment and energy and 771,1 in Health. In 2027 expenditure outside the RRP grows 3,0 % in Health, 4,9 % in Education, 8,8 % in Labour, solidarity and social security, 20,8 % in Infrastructure and housing, 18,2 % in Justice and 13,1 % in Internal security; and changes by −7,8 % in Finance, −4,9 % in Economy and −38,2 % in Territorial cohesion.

The budget for 2027, 17 858,4, is below what the report estimates will be spent in 2026, 18 125,9, and 3,6 % above what was spent in 2025, 17 241,5. The UTAO writes, on the execution of the National Health Service in 2027: «Existe um risco de pressão orçamental associado à execução do Serviço Nacional de Saúde (SNS).»

**The conclusion**

The three claims correspond to different lines of the table and none presents all three measures together. In 2027, Health is budgeted to receive 267,5 million euros less than the expenditure estimate for 2026 because the RRP ends, and expenditure outside the RRP rises 511,8 against the 771,1 the RRP leaves. Personnel expenditure rises, while the purchase of goods and services and investment fall. Since 2020, no initial Health budget in the years with completed execution has reached the end of the year without being exceeded, and the 2027 one is below what is estimated to be spent in 2026.

**The recommendation**

The useful question is not whether the Health budget rises or falls, but whether it is enough: the answer of the last six years is that it never was, and the execution to August 2026, 19,9 % above 2025, reinforces the risk of another shortfall. Whoever follows Health in 2027 watches the Entidade Orçamental's monthly budget execution summary and the possible need for reinforcement, not just the approval.

**The editorial seat's opinion**

The minister and RTP each chose the line that suited them, and both are true; the argument over «up» or «down» hides what the table shows: a budget that pays more staff with fewer purchases and less investment, that increases other current expenditure, that counts on own revenue growing by more than half without the report explaining where it comes from, and that, on the evidence of the 2026 execution and the six years before it, risks being exceeded again. The Health budget for 2027 is a transition budget for the end of the RRP, and its true size will be known in the execution, not at the vote. Saying this cost more than saying «up» or «down», and it was what the debate owed.

**The road partnerships: what the State pays, what it will pay, and what the table leaves out**

**As it was said**

«Vem com um orçamento que entrega 1 700 milhões às parcerias público-privadas rodoviárias», Paulo Raimundo · PCP, in the Assembleia da República, on 09.10.2026. On 12.10.2026, Paula Santos · PCP: «Em sentido inverso cresce mais do que o previsto a despesa com as chamadas PPP – rodoviárias, ferroviárias, saúde – com o Governo a desviar mais de 1800 milhões de euros de recursos públicos para os grupos económicos privados, sem que tal se traduza em novas infraestruturas ou investimento nas existentes.» On 15.10.2026, Paulo Raimundo: «Há condições, há recursos e meios, desde logo na Segurança Social, mas há também opções que se podem e têm de fazer, e entre os mais de 1700 milhões de euros que o Governo quer pagar em PPP e o aumento dos reformados, da nossa parte não temos dúvidas da opção a tomar.»

**What the sources say**

Table 4.25 of the Budget report, the public-private partnerships, 2027, in million euros.

Gross charges for the road sector are 1 152; revenue, 263; net charges, 889. Rail partnerships cost 312 and health ones 254, each on a single line, with no revenue; gross road charges plus rail and health charges add up to 1 718, and the printed net total for all sectors is 1 438. Forecast, not outturn. The sector rows in the table do not add up exactly to the printed total; the table does not explain the difference. The table says the values are on a cash basis and, where applicable, include VAT.

Net road charges, year by year, in the Budget reports: 1 250 in 2021 (execution), 1 192 in 2022, 1 105 in 2023, 1 012 in 2024, 843 in 2025, 942 in 2026 (estimates) and 889 in 2027 (budget).

The report projects 705 in 2028, 648 in 2029, 77 in 2035 and 17 in 2040, the last year with road charges; in 2030 revenue exceeds charges and the line is negative, −220.

For 2027, last year's report forecast 774 in net charges; this one forecasts 889. According to the report, the difference comes from toll collection costs and traffic-linked payments, which rose, and toll revenue, which fell.

Outside the table, in the risks chapter, the report counts 2 388,2 million euros in financial rebalancing claims and litigation by road concessionaires and subconcessionaires, with first-quarter data referenced to 31.03.2026, 1 140 above the previous report, including 1 122,5 from Brisa, in the ongoing negotiation, and 445 in the main action by Rotas do Algarve Litoral, in which Infraestruturas de Portugal pays, by provisional decision, around 1,3 million a month, plus VAT. The UTAO distinguishes claims from actual charges: «São pretensões dos parceiros privados, e não encargos já reconhecidos; a sua concretização, total ou parcial, oneraria o saldo orçamental de anos futuros.»

**The comparison**

None of the road figures in the table equals 1 700 million euros: the figure is 548 above gross charges and 811 above net charges.

The figure is close to the sum of gross road charges and rail and health charges, 1 718, without that proving the calculation behind it; road partnerships are 61,82 % of the net total. The PCP itself later widened the universe to the road, rail and health partnerships, on 12.10.2026 and on 15.10.2026, with 1 800 million euros and 1 700 million euros.

The report forecasts 889 net for the road partnerships in 2027 against 1 250 executed in 2021, −28,9 %; but more than the 843 estimated for 2025: gross charges fall from 1 234 to 1 152, and the forecast revenue falls further, from 392 to 263. The projection has a downward trend, with fluctuations, to 17 in 2040.

The figure missing from the three quoted claims is that of the pending demands, 2 388,2, which is absent from the charges table and those claims, and exceeds gross road charges and the figure in the first claim.

**The conclusion**

The report forecasts 889 million net for the road partnerships in 2027, −28,9 % against execution in 2021, but above the estimate for 2025, and the table projects a downward trend, with fluctuations, to the end of the contracts. The figure in the PCP's first claim is close to the gross cost of all partnerships, not of the road ones. And what could change the bill is not in the table: 2 388,2 million in concessionaires' claims, 1 122,5 of them in a negotiation under way.

**The recommendation**

The useful debate in 2027 is the Brisa negotiation and the pending lawsuits, alongside the budgeted figure for contracted payments. Whoever wants to watch the partnerships looks at the report's risks chapter and at the annual report of UTAP, the technical unit for monitoring projects, not only at the table of charges.

**The editorial seat's opinion**

The PCP is right to draw attention to the cost of partnerships, but wrong to attribute to road partnerships a figure exceeding their gross charges. Partnerships cost the State over a billion gross in the budgeted year; the later claim already covers road, rail and health partnerships, but its amount, 1 800 million euros, also exceeds the sum in the table. The Government, for its part, presents a table of contracted payments and sends the claims that could change the bill to a risks chapter. Between the two, the reader learns the payments forecast for concessionaires; how much of the pending claims will become an actual charge remains unknown, and that is the bill Parliament should ask for before voting.

## Reprodução

No motor, `python3 -m publisher.oe2027_analise_report --assemble --report`, `python3 -m publisher.v2d_export` e `python3 -m publisher.export_site_rows --manifest publisher/manifest.v2d.json --site <worktree> --write`. As células correm por `python3 -m publisher.oe2027_analise_test --write-proof`; o pre-commit do escrivão executa `core.gate`.

No sítio, `scripts/compor-familias-v2d.mjs` e, nesta pasta, `auditar-palavras.mjs`, `medir-final.mjs` e `gerar-relatorio.py` reproduzem as declarações, as frases e o relatório. `check:cruzamento --with-origin` recebe o motor em `RESEARCHHUB_DIR`. Os comandos de saída extensa correm por `scripts/leituras/curto.sh`.

Portões: `sh scripts/leituras/portoes-pelo-escrivao.sh <temporario> v2d`. Capturas: `sh scripts/leituras/capturar-pelo-escrivao.sh <pedido.json> <temporario>`, depois da construção, nas duas edições e cinco larguras.
