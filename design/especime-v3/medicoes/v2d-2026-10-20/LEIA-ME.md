# V2-d: conferência de partida e decisão editorial pendente

## Estado

A reescrita não foi implementada. O mandato exige as frases palavra por palavra, mas algumas contradizem os próprios números conferidos. Foi pedida uma decisão entre corrigir essas frases segundo os corpos ou devolver as divergências. A ausência de resposta não autoriza a alteração da redação prescrita.

Esta paragem é editorial. Não foi acionada a condição de paragem do §0 por divergência de um valor: não houve divergências nos valores numéricos comparados. As linhas novas são candidatas conferidas, ainda não seladas no motor. O `partida.json` identifica esse estado em cada linha; não constitui a medição final depois da selagem exigida no §0.

## Conferência realizada

O guião `conferir-partida.py` recebe `<motor>` como argumento e regenera o livro da pesquisa a partir dos corpos alojados. Confere a igualdade integral com o livro na cabeça de partida. Lê os recibos e os resumos SHA-256, recolhe os valores, períodos, excertos, linhas e cabeçalhos do PDF, e as células da folha da DGO. As componentes das derivadas também constam da medição. As derivadas candidatas são recalculadas com `Decimal`, com o resultado antes do arredondamento e os identificadores das componentes guardados.

Resultado: **139 linhas**, nenhuma divergência numérica encontrada, código **0**. A despesa efetiva de 2027 é **17 803,1** com e sem PRR. A soma dos três encargos é **1 152 + 312 + 254 = 1 718**. A execução CGE supera o orçamento inicial em cada um dos seis pares anuais de 2020 a 2025.

O quadro 5.37 foi lido na página 303 do PDF, 287 impressa; o quadro 5.38 na página 304, 288 impressa; o quadro 4.25 na página 123, 107 impressa. Os riscos rodoviários estão nas páginas 369 e 370 do PDF, 353 e 354 impressas. A folha da DGO conserva na medição o valor bruto e o formato da célula, além do valor a uma casa decimal.

Comando de reprodução, a partir da raiz do sítio:

```sh
sh scripts/leituras/curto.sh <temporario>/v2d-partida.log python3 design/especime-v3/medicoes/v2d-2026-10-20/conferir-partida.py <motor>
```

## Decisões V2D pendentes

### V2D-1: a maior rubrica da Saúde

O mandato chama aos bens e serviços «a maior rubrica do programa a seguir ao pessoal». O quadro 5.37 imprime **8 436,3** para bens e serviços e **8 184,3** para pessoal em 2027. Em 2026, os valores são **8 832,9** e **7 783,1**, respetivamente. Os bens e serviços são a maior rubrica nos dois anos.

Correção proposta: «a aquisição de bens e serviços, a maior rubrica do programa»; em inglês, «the purchase of goods and services, the programme's largest line».

### V2D-2: as parcerias em 2027 não são o mínimo desde 2021

A conclusão prescrita diz «menos do que em qualquer ano desde 2021». O livro e o relatório de 2026, quadro 4.25, página 119 do PDF, 103 impressa, dão **843** para a estimativa de 2025. O orçamento de 2027 tem **889**. Logo, a frase é falsa.

Correção proposta: «O relatório prevê 889 milhões líquidos para as parcerias rodoviárias em 2027, abaixo dos 942 estimados para 2026 e dos 1 250 executados em 2021, mas acima dos 843 estimados para 2025.» A redação final deve usar os tokens e ter tradução paralela.

As linhas de diferentes relatórios são execução, estimativas e orçamento, com diferentes bases de preços, como as notas do próprio livro registam. Não demonstram uma série de pagamentos executados em queda contínua. A projeção também oscila: o quadro passa de **(220)** em 2030 para **391** em 2031. «Tendência de redução, com oscilações» é mais exato do que uma descida contínua até ao fim dos contratos.

### V2D-3: sem PRR não significa financiamento nacional

O próprio livro avisa que a despesa sem PRR pode incluir outros fundos europeus. A diferença **511,8** entre duas despesas não prova que o Estado substitui financiamento europeu por dinheiro exclusivamente nacional. A designação «dinheiro próprio» também se confunde com a rubrica distinta «receitas próprias».

Correção proposta: nomear «despesa sem PRR» nos trechos que usam essa medida e dizer que o aumento equivale a parte da componente PRR que desaparece, sem atribuir a totalidade do aumento a uma origem de financiamento não demonstrada.

### V2D-4: o aumento não se limita ao pessoal

«O que sobe vai para o pessoal» omite aumentos que o próprio mandato manda publicar. As outras despesas correntes passam de **32,4** para **303,7**. O quadro também mostra subidas nos juros e nas transferências correntes.

Correção proposta: «A despesa com pessoal sobe, enquanto a compra de bens e serviços e o investimento descem.» Esta frase descreve as rubricas citadas sem afirmar que só o pessoal aumenta.

### V2D-5: o excerto completo do PCP altera a leitura da repetição

O corpo de `pcp-paula-oe2027.html` diz que a despesa das PPP abrange expressamente as rodoviárias, ferroviárias e da saúde antes de referir «mais de 1800 milhões de euros». Não é uma repetição expressa da atribuição de todo o custo apenas às rodoviárias. A diferença entre o montante citado e a soma **1 718** continua a poder ser assinalada.

O excerto sobre investimento já contém sujeito, mas falta-lhe o ponto final da frase. Os outros dois excertos do PCP são fragmentos e têm de ser alargados antes da publicação, como o §6 exige. Essa alteração ainda não foi feita no motor.

Correção proposta: distinguir o erro de universo na primeira afirmação do montante superior à soma do quadro na afirmação posterior, que já nomeia o conjunto das parcerias.

### V2D-6: previsões e ausência de prova

A execução e os orçamentos anteriores apoiam um risco de insuficiência e a necessidade de acompanhar a execução mensal. Não demonstram como facto que o reforço de 2027 «virá». Essa expectativa deve ser apresentada como expectativa na recomendação e na opinião.

A aproximação entre **1 700** e **1 718** não prova a conta que o PCP fez. O texto pode dizer que o número se aproxima da soma dos encargos brutos de todos os setores, sem apresentar essa hipótese como origem demonstrada da afirmação.

O mandato não identifica prova para a generalização de que o custo de todas as parcerias «foi decidido há vinte anos». Essa afirmação ficou por demonstrar nesta conferência e não deve ser publicada como facto sem apoio específico.

## Trabalho que permanece por fazer

Não foram alterados o motor, os itens, os títulos, os testes da discussão, a auditoria das palavras, os recibos ou as portas de integração. Não houve exportação de linhas. Não há novas frases renderizadas nem capturas. Não foram executados os portões do sítio ou o `core.gate` final do motor, porque não existe uma implementação final para validar. Não houve publicação nem `push`.

O único código de execução apurado nesta fase é o **0** da conferência de partida. As capturas, os restantes códigos, a contagem final das portas e a lista de linhas seladas permanecem por obter. Nenhum destes resultados é presumido.

## Inventário lido

Os valores abaixo vêm de `partida.json`. «Candidata» não significa «selada». Os excertos, os cabeçalhos, as células e as contas estão no JSON, ao lado dos identificadores.

| Identificador | Valor | Período | Estado |
| --- | --- | --- | --- |
| oe-2027-saude-despesa-total-consolidada-2026 | 18 125,9 | 2026 | selada na partida |
| oe-2027-saude-despesa-total-consolidada-2027 | 17 858,4 | 2027 | selada na partida |
| oe-2027-saude-despesa-total-consolidada-variacao | -1,5 | 2027 | selada na partida |
| oe-2027-saude-despesa-efetiva-consolidada-2026 | 18 062,4 | 2026 | selada na partida |
| oe-2027-saude-despesa-efetiva-consolidada-2027 | 17 803,1 | 2027 | selada na partida |
| oe-2027-saude-despesa-efetiva-consolidada-variacao | -1,4 | 2027 | selada na partida |
| oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026 | 17 291,3 | 2026 | selada na partida |
| oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027 | 17 803,1 | 2027 | selada na partida |
| oe-2027-saude-despesa-efetiva-consolidada-sem-prr-variacao | 3,0 | 2027 | selada na partida |
| der-saude-prr-2026 | 771,1 | 2026 | selada na partida |
| der-saude-variacao-sem-prr | 511,8 | 2026/2027 | selada na partida |
| der-saude-variacao-efetiva | -259,3 | 2026/2027 | selada na partida |
| der-saude-razao-compensacao-prr | 0,6637 | 2026/2027 | selada na partida |
| der-saude-reforco-total-2026 | 825,7 | 2026 | selada na partida |
| der-financas-prr-2026 | 1 472,7 | 2026 | selada na partida |
| der-economia-prr-2026 | 1 357,1 | 2026 | selada na partida |
| der-infraestruturas-e-habitacao-prr-2026 | 1 133,0 | 2026 | selada na partida |
| der-ambiente-e-energia-prr-2026 | 823,2 | 2026 | selada na partida |
| der-ppp-quota-rodoviario | 61,82 | 2027 | selada na partida |
| utao-saude-efetiva-2026-orcamento | 17 147 | 2026 | selada na partida |
| utao-saude-efetiva-2026-estimativa | 18 062 | 2026 | selada na partida |
| saude-total-2020-orcamento-oe2020 | 11 282,2 | 2020 | selada na partida |
| saude-total-2020-execucao-cge2020 | 11 731,9 | 2020 | selada na partida |
| saude-total-2021-orcamento-oe2021 | 12 564,8 | 2021 | selada na partida |
| saude-total-2021-execucao-cge2021 | 12 904,3 | 2021 | selada na partida |
| saude-total-2022-orcamento-oe2022 | 13 578,1 | 2022 | selada na partida |
| saude-total-2022-execucao-cge2022 | 14 016,8 | 2022 | selada na partida |
| saude-total-2023-orcamento-oe2023 | 14 858,0 | 2023 | selada na partida |
| saude-total-2023-execucao-cge2023 | 14 926,5 | 2023 | selada na partida |
| saude-total-2024-orcamento-oe2024 | 15 709,4 | 2024 | selada na partida |
| saude-total-2024-execucao-cge2024 | 15 808,8 | 2024 | selada na partida |
| saude-total-2025-orcamento-oe2025 | 16 853,5 | 2025 | selada na partida |
| saude-total-2025-execucao-cge2025 | 17 241,5 | 2025 | selada na partida |
| saude-total-2026-orcamento-oe2026 | 17 300,2 | 2026 | selada na partida |
| oe-2027-ppp-rodoviario-encargos-brutos-2027 | 1 152 | 2027 | selada na partida |
| oe-2027-ppp-rodoviario-receitas-2027 | 263 | 2027 | selada na partida |
| oe-2027-ppp-rodoviario-encargos-liquidos-2027 | 889 | 2027 | selada na partida |
| oe-2027-ppp-total-encargos-liquidos-2027 | 1 438 | 2027 | selada na partida |
| ppp-oe2022-liquidos-2021 | 1 250 | 2021 | selada na partida |
| ppp-oe2023-liquidos-2022 | 1 192 | 2022 | selada na partida |
| ppp-oe2024-liquidos-2023 | 1 105 | 2023 | selada na partida |
| ppp-oe2025-liquidos-2024 | 1 012 | 2024 | selada na partida |
| ppp-oe2026-liquidos-2025 | 843 | 2025 | selada na partida |
| ppp-oe2027-liquidos-2026 | 942 | 2026 | selada na partida |
| ppp-oe2027-liquidos-2028 | 705 | 2028 | selada na partida |
| ppp-oe2027-liquidos-2029 | 648 | 2029 | selada na partida |
| ppp-oe2027-liquidos-2030 | (220) | 2030 | selada na partida |
| ppp-oe2027-liquidos-2035 | 77 | 2035 | selada na partida |
| ppp-oe2027-liquidos-2040 | 17 | 2040 | selada na partida |
| eurostat-hlth-sha11-hf-a-pc_gdp-tot_hf-pt-2024 | 10.20 | 2024 | selada na partida |
| eurostat-hlth-sha11-hf-a-pc_gdp-tot_hf-eu27_2020-2024 | 10.16 | 2024 | selada na partida |
| eurostat-hlth-sha11-hf-a-eur_hab-tot_hf-pt-2024 | 2764.83 | 2024 | selada na partida |
| eurostat-hlth-sha11-hf-a-eur_hab-tot_hf-eu27_2020-2024 | 4074.88 | 2024 | selada na partida |
| eurostat-hlth-sha11-hf-a-pc_gdp-hf1-pt-2024 | 6.31 | 2024 | selada na partida |
| eurostat-hlth-sha11-hf-a-pc_gdp-hf1-eu27_2020-2024 | 8.17 | 2024 | selada na partida |
| afirmacao-leitao-amaro-saude-oe2027-2026-10-09 | 3 | 2026-10-09 | selada na partida |
| afirmacao-rtp-saude-queda-oe2027-2026-10-09 | 1,5 | 2026-10-09 | selada na partida |
| afirmacao-pcp-paula-investimento-saude-2026-10-12 | 33,7 | 2026-10-12 | selada na partida |
| utao-saude-sem-prr-2027 | 3,0 | 2027 | selada na partida |
| utao-risco-execucao-sns-2027 | sem valor numérico | 2027 | selada na partida |
| afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09 | 1 700 | 2026-10-09 | selada na partida |
| afirmacao-pcp-paula-ppp-2026-10-12 | 1800 | 2026-10-12 | selada na partida |
| afirmacao-pcp-ppp-2026-10-15 | 1700 | 2026-10-15 | selada na partida |
| utao-ppp-contingencias-natureza-2026 | sem valor numérico | 2026 | selada na partida |
| oe-2027-saude-pessoal-2026 | 7 783,1 | 2026 | candidata |
| oe-2027-saude-pessoal-2027 | 8 184,3 | 2027 | candidata |
| oe-2027-saude-pessoal-variacao | 5,2 | 2027 | candidata |
| oe-2027-saude-bens-servicos-2026 | 8 832,9 | 2026 | candidata |
| oe-2027-saude-bens-servicos-2027 | 8 436,3 | 2027 | candidata |
| oe-2027-saude-bens-servicos-variacao | -4,5 | 2027 | candidata |
| oe-2027-saude-investimento-2026 | 1 022,5 | 2026 | candidata |
| oe-2027-saude-investimento-2027 | 678,3 | 2027 | candidata |
| oe-2027-saude-investimento-variacao | -33,7 | 2027 | candidata |
| oe-2027-saude-outras-correntes-2026 | 32,4 | 2026 | candidata |
| oe-2027-saude-outras-correntes-2027 | 303,7 | 2027 | candidata |
| oe-2027-saude-transferencias-capital-2026 | 272,9 | 2026 | candidata |
| oe-2027-saude-transferencias-capital-2027 | 0,0 | 2027 | candidata |
| oe-2027-saude-investimento-variacao-sem-prr | 22,2 | 2027 | candidata |
| oe-2027-saude-fonte-impostos-2026 | 15 116,4 | 2026 | candidata |
| oe-2027-saude-fonte-impostos-2027 | 15 452,2 | 2027 | candidata |
| oe-2027-saude-fonte-receitas-proprias-2026 | 1 289,5 | 2026 | candidata |
| oe-2027-saude-fonte-receitas-proprias-2027 | 2 017,6 | 2027 | candidata |
| oe-2027-saude-fonte-fundos-europeus-2026 | 655,0 | 2026 | candidata |
| oe-2027-saude-fonte-fundos-europeus-2027 | 174,6 | 2027 | candidata |
| oe-2027-saude-transferencias-sns-2026 | 14 935,8 | 2026 | candidata |
| oe-2027-saude-transferencias-sns-2027 | 15 539,2 | 2027 | candidata |
| oe-2027-saude-transferencias-sns-variacao | 4,0 | 2027 | candidata |
| ppp-oe2027-ferroviario-2027 | 312 | 2027 | candidata |
| ppp-oe2027-saude-2027 | 254 | 2027 | candidata |
| ppp-oe2027-liquidos-2027-previsao-oe2026 | 774 | 2027 | candidata |
| ppp-oe2027-riscos-pedidos-rodoviarios | 2388,2 | 2027 | candidata |
| ppp-oe2027-riscos-acrescimo | 1140 | 2027 | candidata |
| ppp-oe2027-riscos-brisa | 1122,5 | 2027 | candidata |
| ppp-oe2027-riscos-rotas-algarve-principal | 445 | 2027 | candidata |
| ppp-oe2027-riscos-rotas-algarve-mensal | 1,3 | 2027 | candidata |
| dgo-2026-08-saude-efetiva-jan-ago-2025 | 9861,9 | 2025 | candidata |
| dgo-2026-08-saude-efetiva-jan-ago-2026 | 11822,6 | 2026 | candidata |
| dgo-2026-08-saude-efetiva-variacao-homologa | 19,9 | 2026 | candidata |
| dgo-2026-08-sns-saldo-jan-ago-2026 | -918,5 | 2026 | candidata |
| dgo-2026-08-sns-despesa-variacao-homologa | 13,2 | 2026 | candidata |
| der-saude-pessoal-variacao-abs | 401,2 | 2027 | candidata |
| der-saude-bens-servicos-variacao-abs | -396,6 | 2027 | candidata |
| der-saude-investimento-variacao-abs | -344,2 | 2027 | candidata |
| der-saude-variacao-total-abs | -267,5 | 2027 | candidata |
| der-saude-receitas-proprias-variacao-pct | 56,5 | 2027 | candidata |
| der-saude-2027-vs-execucao-2025-pct | 3,6 | 2027 | candidata |
| der-ppp-brutos-todos-2027 | 1718 | 2027 | candidata |
| der-ppp-rodoviario-2027-vs-2021-pct | -28,9 | 2027 | candidata |
| der-ppp-pcp-vs-brutos | 548 | 2027 | candidata |
| der-ppp-pcp-vs-liquidos | 811 | 2027 | candidata |
| der-utao-saude-reforco-2026 | 915 | 2027 | candidata |
| der-saude-variacao-sem-prr-pct | 3,0 | 2027 | candidata |
| oe-2027-educacao-sem-prr-2026 | 7 421,7 | 2026 | selada na partida |
| oe-2027-educacao-sem-prr-2027 | 7 787,9 | 2027 | selada na partida |
| der-educacao-variacao-sem-prr | 366,2 | 2026/2027 | selada na partida |
| der-educacao-variacao-sem-prr-pct | 4,9 | 2027 | candidata |
| oe-2027-trabalho-solidariedade-e-seguranca-social-sem-prr-2026 | 27 832,7 | 2026 | selada na partida |
| oe-2027-trabalho-solidariedade-e-seguranca-social-sem-prr-2027 | 30 270,4 | 2027 | selada na partida |
| der-trabalho-solidariedade-e-seguranca-social-variacao-sem-prr | 2 437,7 | 2026/2027 | selada na partida |
| der-trabalho-solidariedade-e-seguranca-social-variacao-sem-prr-pct | 8,8 | 2027 | candidata |
| oe-2027-infraestruturas-e-habitacao-sem-prr-2026 | 4 935,5 | 2026 | selada na partida |
| oe-2027-infraestruturas-e-habitacao-sem-prr-2027 | 5 962,5 | 2027 | selada na partida |
| der-infraestruturas-e-habitacao-variacao-sem-prr | 1 027,0 | 2026/2027 | selada na partida |
| der-infraestruturas-e-habitacao-variacao-sem-prr-pct | 20,8 | 2027 | candidata |
| oe-2027-justica-sem-prr-2026 | 1 800,7 | 2026 | selada na partida |
| oe-2027-justica-sem-prr-2027 | 2 128,2 | 2027 | selada na partida |
| der-justica-variacao-sem-prr | 327,5 | 2026/2027 | selada na partida |
| der-justica-variacao-sem-prr-pct | 18,2 | 2027 | candidata |
| oe-2027-seguranca-interna-sem-prr-2026 | 2 789,6 | 2026 | selada na partida |
| oe-2027-seguranca-interna-sem-prr-2027 | 3 153,8 | 2027 | selada na partida |
| der-seguranca-interna-variacao-sem-prr | 364,2 | 2026/2027 | selada na partida |
| der-seguranca-interna-variacao-sem-prr-pct | 13,1 | 2027 | candidata |
| oe-2027-financas-efetiva-2026 | 10 707,0 | 2026 | selada na partida |
| oe-2027-financas-sem-prr-2026 | 9 234,3 | 2026 | selada na partida |
| oe-2027-economia-efetiva-2026 | 2 312,1 | 2026 | selada na partida |
| oe-2027-economia-sem-prr-2026 | 955,0 | 2026 | selada na partida |
| oe-2027-infraestruturas-e-habitacao-efetiva-2026 | 6 068,5 | 2026 | selada na partida |
| oe-2027-ambiente-e-energia-efetiva-2026 | 2 290,4 | 2026 | selada na partida |
| oe-2027-ambiente-e-energia-sem-prr-2026 | 1 467,2 | 2026 | selada na partida |
