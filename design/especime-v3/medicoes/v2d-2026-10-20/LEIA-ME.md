# V2-d: análise da Saúde e das parcerias

## Estado

Implementação e travessia concluídas; portões da cabeça e capturas ainda pendentes.

## Medida de partida e selagem

Conferência de 142 linhas, com 0 divergências numéricas. O guião lê o livro regenerado e compara os valores com os corpos e as componentes. `partida.json` conserva as linhas do PDF, os cabeçalhos, os seletores, as páginas, os recibos, as células e os valores brutos da folha da execução.

A despesa efetiva de 2027 coincide com e sem PRR: 17 803,1 milhões de euros. A soma dos encargos brutos é 1 152 + 312 + 254 = 1 718. Nos seis pares de 2020 a 2025, a execução supera o orçamento inicial do mesmo ano. A quebra de perímetro entre anos não altera esta comparação interna.

Foram seladas 56 linhas novas no motor: 36 documentais e 20 derivadas. As páginas dos riscos são 369 e 370 do PDF, 353 e 354 impressas. A coluna selecionada fica ligada ao cabeçalho, ao ano e à fase; a planta troca a coluna e o valor esperado e é recusada.

O exportador comum atravessou 126 linhas e as provas de 142 linhas. Os corpos permanecem no motor; os excertos, os recibos, os resumos SHA-256 e as avaliações de direitos atravessam em `ledger/provas/v2d/provas.json`.

## Integração

O inventário final contém 135 linhas com porta para os itens, das quais 119 chegaram nesta travessia. As componentes das derivadas são acessíveis pelos respetivos recibos. Os seis pares anuais também integram a guarda da frase «todos os anos». Os títulos do topo e do menu vêm do mesmo resolvedor dos itens.

## Conferências e capturas

| Conferência | Código ou resultado |
| --- | --- |
| conferência de partida | 0 |
| pesquisa documental do motor | 0, 32 conferências e 840 células Eurostat |
| travessia comum | 0 |
| teste da travessia | 0, 35 contas e plantas |
| cruzamento com origem | 0 |
| declarações dos itens | 0 |
| seleção dos portões | 0 |
| afirmações contra os corpos | 0, 9 afirmações, 9 corpos e 29 plantas |
| derivadas e série Saúde | 0, 24 fórmulas e seis pares anuais; quatro plantas |
| auditoria das palavras | 290 folhas e 2 885 apoios; declaração conferida |

Capturas ainda não executadas.

Os registos extensos ficam fora do commit. Nenhum PNG é comitado. A corrida integral do sítio fica para o portão do GitHub na aterragem.

## Decisões

As decisões V2D-1 a V2D-6 ficaram documentadas na conferência do commit 3533f7a7. O §7 do mandato aceitou as correções da maior rubrica, da comparação das parcerias com 2025 e da designação «fora do PRR», e autorizou corrigir as restantes contradições. As redações efetivamente aplicadas e as decisões de integração seguem abaixo.

### V2D-7: Título com valores assinados

Antes: O orçamento da Saúde para 2027: sobe 3 % ou cai 1,5 %? As duas contas, o que muda por dentro e o que ficou por dizer

Depois: O orçamento da Saúde para [período]: [variação sem PRR] sem PRR ou [variação total] no total? As duas contas, o que muda por dentro e o que ficou por dizer

A gramática aceita tokens no título, mas conserva o sinal e as casas do valor selado. A formulação evita escrever cai seguido de uma variação negativa e não inventa arredondamento. O ano também vem do livro. A edição inglesa é paralela.

### V2D-8: Afirmações e limites de interpretação

Antes: As três afirmações são verdadeiras na sua linha e nenhuma diz a linha.

Depois: As três afirmações correspondem a linhas diferentes do quadro e nenhuma apresenta as três medidas em conjunto.

A afirmação do PCP nomeia o investimento e Leitão Amaro menciona expressamente retirar o PRR. Nenhuma apresenta em conjunto as três medidas do quadro.

### V2D-9: Previsão e financiamento na conclusão da Saúde

Antes: A Saúde recebe em 2027 menos … do que gasta em 2026 … e o Estado repõe … O que sobe vai para o pessoal.

Depois: A Saúde tem orçamentados em [ano] menos … do que a estimativa de despesa de [ano] … e a despesa fora do PRR sobe … A despesa com pessoal sobe, enquanto a compra de bens e serviços e o investimento descem.

Distingue orçamento e estimativa de execução concluída, não atribui origem nacional a toda a despesa sem PRR e não omite os outros aumentos do quadro. Aplica V2D-3, V2D-4 e V2D-6.

### V2D-10: Risco de insuficiência

Antes: 2026 não será exceção … o reforço que virá … voltará a ser ultrapassado.

Depois: reforça o risco de nova insuficiência … a eventual necessidade de reforço … corre o risco de voltar a ser ultrapassado.

Os dados apoiam risco, não certeza sobre execução futura. A recomendação mantém execução mensal e reforço como assuntos concretos a acompanhar.

### V2D-11: Fim do PRR

Antes: um orçamento de transição para o fim do dinheiro europeu

Depois: um orçamento de transição para o fim do PRR

O próprio quadro mantém fundos europeus no orçamento seguinte. O fim do PRR não é o fim de todo o dinheiro europeu.

### V2D-12: Série das parcerias

Antes: Ao longo dos anos, o Estado paga pelas parcerias rodoviárias menos do que pagava … A projeção desce até …

Depois: O relatório prevê para as parcerias rodoviárias … contra … executados … mas mais do que os … estimados … A projeção tem uma tendência de redução, com oscilações, até …

Distingue execução, estimativas e orçamento. A projeção não tem descida contínua e a previsão final supera a estimativa de dois anos antes. Nos valores ano a ano, o plural estimativas abrange os anos intermédios.

### V2D-13: Conta do PCP e âmbito das afirmações

Antes: O número coincide, ao arredondar … O número do PCP é o custo bruto de todas as parcerias … e repeti-lo como mais de 1800 …

Depois: O número aproxima-se … sem que isso demonstre a conta que lhe deu origem … O número da primeira afirmação do PCP aproxima-se do custo bruto de todas as parcerias … a afirmação posterior já abrange as rodoviárias, ferroviárias e da saúde, mas o seu montante também excede a soma do quadro.

A aproximação numérica não prova a conta feita pelo autor. O excerto completo posterior já nomeia os três setores. Aplica V2D-5 e V2D-6 e usa sempre o excerto literal integral do livro.

### V2D-14: Limites da prova e pedidos pendentes

Antes: O número que falta em todos os discursos … esse custo foi decidido há mais de uma década … o leitor fica a saber o que o Estado deve às concessionárias.

Depois: O número que falta nas três afirmações citadas … [retirada a antiguidade contratual sem prova] … o leitor fica a saber os pagamentos previstos às concessionárias; fica por saber quanto dos pedidos pendentes se tornará encargo efetivo.

O universo conferido são as três afirmações citadas. Não há prova da antiguidade de todos os contratos e pedidos contingentes não são dívida reconhecida.

### V2D-15: Módulos e sustentação anual

Antes: Tokens negativos a seguir a menos; frase todos os anos apoiada apenas em exemplos extremos.

Depois: Três derivadas positivas para as reduções; inventário declarativo dos seis pares de orçamento inicial e execução da Saúde.

A gramática não remove sinais. Os identificadores são der-saude-bens-servicos-reducao-abs, der-saude-investimento-reducao-abs e der-saude-total-reducao-abs. O inventário permite conferir cada ano, incluindo os intermédios, sem inserir prosa de método na página.

### V2D-16: Afirmações qualitativas

Antes: As leituras qualitativas da UTAO tinham value e unit nulos.

Depois: O valor conserva o excerto textual inteiro, com unidade afirmação, atribuição e data de publicação.

Nenhum número foi inventado para permitir a travessia. O validador só admite esta forma quando afirmacao é true e value é exatamente excerpt.

### V2D-17: Identificadores e períodos na travessia

Antes: O sítio recusava os sublinhados das coordenadas Eurostat e períodos comparativos como 2026/2027.

Depois: Os identificadores Eurostat preservam os sublinhados; as derivadas usam o ano final como reference_date e conservam os dois períodos na conta e nota.

Preserva os identificadores prescritos e a gramática temporal do sítio. Os valores Eurostat mantêm a grafia API no motor e a vírgula decimal no sítio.

### V2D-18: Rótulos e sinais contabilísticos

Antes: A pesquisa tinha nomes sem name_source, incluindo descrições editoriais; o formatador não aceitava (220).

Depois: Só os rótulos impressos conservam name com localizador. Citações usam document.title e derivadas usam description no motor. Os parênteses contabilísticos renderizam o sinal negativo.

Não apresentar descrições como rótulos da fonte nem perder o sinal da projeção rodoviária.

### V2D-19: Portões delimitados pelo mandato

Antes: O escrivão só tinha corrida completa ou perfil V2-c.

Depois: Perfil V2-d fechado para build, discussão, palavras, frases compostas, HTML, alvos, CSS, L1, séries e typecheck.

A corrida integral do sítio fica para o GitHub, como pedido. O motor corre integralmente no pre-commit; cruzamento com origem corre à parte.

### V2D-20: Ano do seletor não é o valor

Antes: A régua das casas decimais interpretava o final Seleção: 2027 como o valor nas duas linhas setoriais das parcerias.

Depois: A régua retira apenas a linha final de metadados Seleção antes de procurar o literal do valor. O excerto publicado permanece intacto.

Uma planta confirma que o ano não substitui o valor; outra mantém a recusa de casas decimais alteradas, mesmo com o seletor no fim. A conferência da coluna e do valor continua no motor e na prova de partida.

## Valores lidos do livro selado

| Identificador | Valor | Período |
| --- | --- | --- |
| oe-2027-saude-despesa-total-consolidada-2026 | 18 125,9 | 2026 |
| oe-2027-saude-despesa-total-consolidada-2027 | 17 858,4 | 2027 |
| oe-2027-saude-despesa-total-consolidada-variacao | -1,5 | 2027 |
| oe-2027-saude-despesa-efetiva-consolidada-2026 | 18 062,4 | 2026 |
| oe-2027-saude-despesa-efetiva-consolidada-2027 | 17 803,1 | 2027 |
| oe-2027-saude-despesa-efetiva-consolidada-variacao | -1,4 | 2027 |
| oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2026 | 17 291,3 | 2026 |
| oe-2027-saude-despesa-efetiva-consolidada-sem-prr-2027 | 17 803,1 | 2027 |
| oe-2027-saude-despesa-efetiva-consolidada-sem-prr-variacao | 3,0 | 2027 |
| der-saude-prr-2026 | 771,1 | 2026 |
| der-saude-variacao-sem-prr | 511,8 | 2026/2027 |
| der-saude-variacao-efetiva | -259,3 | 2026/2027 |
| der-saude-razao-compensacao-prr | 0,6637 | 2026/2027 |
| der-saude-reforco-total-2026 | 825,7 | 2026 |
| der-financas-prr-2026 | 1 472,7 | 2026 |
| der-economia-prr-2026 | 1 357,1 | 2026 |
| der-infraestruturas-e-habitacao-prr-2026 | 1 133,0 | 2026 |
| der-ambiente-e-energia-prr-2026 | 823,2 | 2026 |
| der-ppp-quota-rodoviario | 61,82 | 2027 |
| utao-saude-efetiva-2026-orcamento | 17 147 | 2026 |
| utao-saude-efetiva-2026-estimativa | 18 062 | 2026 |
| saude-total-2020-orcamento-oe2020 | 11 282,2 | 2020 |
| saude-total-2020-execucao-cge2020 | 11 731,9 | 2020 |
| saude-total-2021-orcamento-oe2021 | 12 564,8 | 2021 |
| saude-total-2021-execucao-cge2021 | 12 904,3 | 2021 |
| saude-total-2022-orcamento-oe2022 | 13 578,1 | 2022 |
| saude-total-2022-execucao-cge2022 | 14 016,8 | 2022 |
| saude-total-2023-orcamento-oe2023 | 14 858,0 | 2023 |
| saude-total-2023-execucao-cge2023 | 14 926,5 | 2023 |
| saude-total-2024-orcamento-oe2024 | 15 709,4 | 2024 |
| saude-total-2024-execucao-cge2024 | 15 808,8 | 2024 |
| saude-total-2025-orcamento-oe2025 | 16 853,5 | 2025 |
| saude-total-2025-execucao-cge2025 | 17 241,5 | 2025 |
| saude-total-2026-orcamento-oe2026 | 17 300,2 | 2026 |
| oe-2027-ppp-rodoviario-encargos-brutos-2027 | 1 152 | 2027 |
| oe-2027-ppp-rodoviario-receitas-2027 | 263 | 2027 |
| oe-2027-ppp-rodoviario-encargos-liquidos-2027 | 889 | 2027 |
| oe-2027-ppp-total-encargos-liquidos-2027 | 1 438 | 2027 |
| ppp-oe2022-liquidos-2021 | 1 250 | 2021 |
| ppp-oe2023-liquidos-2022 | 1 192 | 2022 |
| ppp-oe2024-liquidos-2023 | 1 105 | 2023 |
| ppp-oe2025-liquidos-2024 | 1 012 | 2024 |
| ppp-oe2026-liquidos-2025 | 843 | 2025 |
| ppp-oe2027-liquidos-2026 | 942 | 2026 |
| ppp-oe2027-liquidos-2028 | 705 | 2028 |
| ppp-oe2027-liquidos-2029 | 648 | 2029 |
| ppp-oe2027-liquidos-2030 | (220) | 2030 |
| ppp-oe2027-liquidos-2035 | 77 | 2035 |
| ppp-oe2027-liquidos-2040 | 17 | 2040 |
| eurostat-hlth-sha11-hf-a-pc_gdp-tot_hf-pt-2024 | 10.20 | 2024 |
| eurostat-hlth-sha11-hf-a-pc_gdp-tot_hf-eu27_2020-2024 | 10.16 | 2024 |
| eurostat-hlth-sha11-hf-a-eur_hab-tot_hf-pt-2024 | 2764.83 | 2024 |
| eurostat-hlth-sha11-hf-a-eur_hab-tot_hf-eu27_2020-2024 | 4074.88 | 2024 |
| eurostat-hlth-sha11-hf-a-pc_gdp-hf1-pt-2024 | 6.31 | 2024 |
| eurostat-hlth-sha11-hf-a-pc_gdp-hf1-eu27_2020-2024 | 8.17 | 2024 |
| afirmacao-leitao-amaro-saude-oe2027-2026-10-09 | 3 | 2026-10-09 |
| afirmacao-rtp-saude-queda-oe2027-2026-10-09 | 1,5 | 2026-10-09 |
| afirmacao-pcp-paula-investimento-saude-2026-10-12 | 33,7 | 2026-10-12 |
| utao-saude-sem-prr-2027 | 3,0 | 2027 |
| utao-risco-execucao-sns-2027 | Existe um risco de pressão orçamental | 2027 |
| afirmacao-pcp-ppp-rodoviarias-oe2027-2026-10-09 | 1 700 | 2026-10-09 |
| afirmacao-pcp-paula-ppp-2026-10-12 | 1800 | 2026-10-12 |
| afirmacao-pcp-ppp-2026-10-15 | 1700 | 2026-10-15 |
| utao-ppp-contingencias-natureza-2026 | não encargos já reconhecidos | 2026 |
| oe-2027-saude-pessoal-2026 | 7 783,1 | 2026 |
| oe-2027-saude-pessoal-2027 | 8 184,3 | 2027 |
| oe-2027-saude-pessoal-variacao | 5,2 | 2027 |
| oe-2027-saude-bens-servicos-2026 | 8 832,9 | 2026 |
| oe-2027-saude-bens-servicos-2027 | 8 436,3 | 2027 |
| oe-2027-saude-bens-servicos-variacao | -4,5 | 2027 |
| oe-2027-saude-investimento-2026 | 1 022,5 | 2026 |
| oe-2027-saude-investimento-2027 | 678,3 | 2027 |
| oe-2027-saude-investimento-variacao | -33,7 | 2027 |
| oe-2027-saude-outras-correntes-2026 | 32,4 | 2026 |
| oe-2027-saude-outras-correntes-2027 | 303,7 | 2027 |
| oe-2027-saude-transferencias-capital-2026 | 272,9 | 2026 |
| oe-2027-saude-transferencias-capital-2027 | 0,0 | 2027 |
| oe-2027-saude-investimento-variacao-sem-prr | 22,2 | 2027 |
| oe-2027-saude-fonte-impostos-2026 | 15 116,4 | 2026 |
| oe-2027-saude-fonte-impostos-2027 | 15 452,2 | 2027 |
| oe-2027-saude-fonte-receitas-proprias-2026 | 1 289,5 | 2026 |
| oe-2027-saude-fonte-receitas-proprias-2027 | 2 017,6 | 2027 |
| oe-2027-saude-fonte-fundos-europeus-2026 | 655,0 | 2026 |
| oe-2027-saude-fonte-fundos-europeus-2027 | 174,6 | 2027 |
| oe-2027-saude-transferencias-sns-2026 | 14 935,8 | 2026 |
| oe-2027-saude-transferencias-sns-2027 | 15 539,2 | 2027 |
| oe-2027-saude-transferencias-sns-variacao | 4,0 | 2027 |
| ppp-oe2027-ferroviario-2027 | 312 | 2027 |
| ppp-oe2027-saude-2027 | 254 | 2027 |
| ppp-oe2027-liquidos-2027-previsao-oe2026 | 774 | 2027 |
| ppp-oe2027-riscos-pedidos-rodoviarios | 2388,2 | 2027 |
| ppp-oe2027-riscos-acrescimo | 1140 | 2027 |
| ppp-oe2027-riscos-brisa | 1122,5 | 2027 |
| ppp-oe2027-riscos-rotas-algarve-principal | 445 | 2027 |
| ppp-oe2027-riscos-rotas-algarve-mensal | 1,3 | 2027 |
| dgo-2026-08-saude-efetiva-jan-ago-2025 | 9 861,9 | 2025 |
| dgo-2026-08-saude-efetiva-jan-ago-2026 | 11 822,6 | 2026 |
| dgo-2026-08-saude-efetiva-variacao-homologa | 19,9 | 2026 |
| dgo-2026-08-sns-saldo-jan-ago-2026 | -918,5 | 2026 |
| dgo-2026-08-sns-despesa-variacao-homologa | 13,2 | 2026 |
| der-saude-pessoal-variacao-abs | 401,2 | 2027 |
| der-saude-bens-servicos-variacao-abs | -396,6 | 2027 |
| der-saude-investimento-variacao-abs | -344,2 | 2027 |
| der-saude-variacao-total-abs | -267,5 | 2027 |
| der-saude-receitas-proprias-variacao-pct | 56,5 | 2027 |
| der-saude-2027-vs-execucao-2025-pct | 3,6 | 2027 |
| der-ppp-brutos-todos-2027 | 1 718 | 2027 |
| der-ppp-rodoviario-2027-vs-2021-pct | -28,9 | 2027 |
| der-ppp-pcp-vs-brutos | 548 | 2027 |
| der-ppp-pcp-vs-liquidos | 811 | 2027 |
| der-utao-saude-reforco-2026 | 915 | 2026 |
| der-saude-variacao-sem-prr-pct | 3,0 | 2027 |
| oe-2027-educacao-sem-prr-2026 | 7 421,7 | 2026 |
| oe-2027-educacao-sem-prr-2027 | 7 787,9 | 2027 |
| der-educacao-variacao-sem-prr | 366,2 | 2026/2027 |
| der-educacao-variacao-sem-prr-pct | 4,9 | 2027 |
| oe-2027-trabalho-solidariedade-e-seguranca-social-sem-prr-2026 | 27 832,7 | 2026 |
| oe-2027-trabalho-solidariedade-e-seguranca-social-sem-prr-2027 | 30 270,4 | 2027 |
| der-trabalho-solidariedade-e-seguranca-social-variacao-sem-prr | 2 437,7 | 2026/2027 |
| der-trabalho-solidariedade-e-seguranca-social-variacao-sem-prr-pct | 8,8 | 2027 |
| oe-2027-infraestruturas-e-habitacao-sem-prr-2026 | 4 935,5 | 2026 |
| oe-2027-infraestruturas-e-habitacao-sem-prr-2027 | 5 962,5 | 2027 |
| der-infraestruturas-e-habitacao-variacao-sem-prr | 1 027,0 | 2026/2027 |
| der-infraestruturas-e-habitacao-variacao-sem-prr-pct | 20,8 | 2027 |
| oe-2027-justica-sem-prr-2026 | 1 800,7 | 2026 |
| oe-2027-justica-sem-prr-2027 | 2 128,2 | 2027 |
| der-justica-variacao-sem-prr | 327,5 | 2026/2027 |
| der-justica-variacao-sem-prr-pct | 18,2 | 2027 |
| oe-2027-seguranca-interna-sem-prr-2026 | 2 789,6 | 2026 |
| oe-2027-seguranca-interna-sem-prr-2027 | 3 153,8 | 2027 |
| der-seguranca-interna-variacao-sem-prr | 364,2 | 2026/2027 |
| der-seguranca-interna-variacao-sem-prr-pct | 13,1 | 2027 |
| oe-2027-financas-efetiva-2026 | 10 707,0 | 2026 |
| oe-2027-financas-sem-prr-2026 | 9 234,3 | 2026 |
| oe-2027-economia-efetiva-2026 | 2 312,1 | 2026 |
| oe-2027-economia-sem-prr-2026 | 955,0 | 2026 |
| oe-2027-infraestruturas-e-habitacao-efetiva-2026 | 6 068,5 | 2026 |
| oe-2027-ambiente-e-energia-efetiva-2026 | 2 290,4 | 2026 |
| oe-2027-ambiente-e-energia-sem-prr-2026 | 1 467,2 | 2026 |
| der-saude-bens-servicos-reducao-abs | 396,6 | 2027 |
| der-saude-investimento-reducao-abs | 344,2 | 2027 |
| der-saude-total-reducao-abs | 267,5 | 2027 |

## Frases renderizadas: PT

### O orçamento da Saúde para 2027: 3,0 % sem PRR ou −1,5 % no total? As duas contas, o que muda por dentro e o que ficou por dizer

**Como foi dito**

«Ora, esta verba do PRR foi excecional. Se retirarmos isso, o orçamento da Saúde sobre 3%», António Leitão Amaro, ministro da Presidência, num documento publicado pela RTP, a 09.10.2026. No mesmo dia, a RTP publicou: «O orçamento para Saúde sofre um corte em 2027. Cai 1,5 por cento. Estão atribuídos 17 mil 858 milhões de euros. Menos 267,5 milhões do que este ano.». A 12.10.2026, Paula Santos disse: «O investimento sofre um corte brutal de 33,7%.»

**O que as fontes dizem**

O quadro 5.37 do relatório do Orçamento, o programa Saúde, em milhões de euros.

A despesa total consolidada passa de 18 125,9 em 2026 para 17 858,4 em 2027, uma variação de −1,5 %. A despesa efetiva consolidada passa de 18 062,4 para 17 803,1, −1,4 %. Sem o PRR, o Plano de Recuperação e Resiliência, a despesa efetiva consolidada passa de 17 291,3 para 17 803,1, 3,0 %.

Por dentro, a despesa com o pessoal passa de 7 783,1 para 8 184,3, 5,2 %; a aquisição de bens e serviços, a maior rubrica do programa, passa de 8 832,9 para 8 436,3, −4,5 %; o investimento passa de 1 022,5 para 678,3, −33,7 % com o PRR e 22,2 % sem ele; as outras despesas correntes passam de 32,4 para 303,7, e as transferências de capital de 272,9 para 0,0.

O financiamento, na comparação entre os dois orçamentos: as receitas de impostos passam de 15 116,4 para 15 452,2; as receitas próprias de 1 289,5 para 2 017,6, 56,5 %; os fundos europeus de 655,0 para 174,6. As transferências para o Serviço Nacional de Saúde passam de 14 935,8 para 15 539,2, 4,0 %.

Desde 2020, a Saúde gastou todos os anos mais do que o orçamento inicial: 11 282,2 orçamentados e 11 731,9 executados em 2020; 16 853,5 e 17 241,5 em 2025; em 2026 o orçamento inicial era 17 300,2 e a estimativa de execução do relatório é 18 125,9, 825,7 acima; a UTAO, que parte de outra base, conta 915 na despesa efetiva.

Na execução até agosto de 2026, a despesa efetiva do programa Saúde foi de 11 822,6, 19,9 % acima do mesmo período de 2025, e o Serviço Nacional de Saúde tinha nesses oito meses um saldo de −918,5 milhões de euros, com a despesa a crescer 13,2 %.

Na comparação europeia, Portugal gastou em saúde 10,20 % do PIB em 2024, a União 10,16 %; por habitante, 2 764,83 euros contra 4 074,88 na União; só nos regimes públicos e nos regimes contributivos obrigatórios, 6,31 % do PIB contra 8,17 %.

**A comparação**

Os números da RTP, a queda, o montante e a diferença, coincidem com a linha da despesa total consolidada: de 18 125,9 para 17 858,4, −267,5 milhões de euros, −1,5 %. O número do ministro coincide com a variação da linha da despesa efetiva consolidada sem o PRR, 3,0 %, a mesma que o relatório escreve e que a UTAO confirma: «a despesa aumentaria 3,0%». O número do PCP sobre o investimento coincide com a linha do investimento com o PRR, −33,7 %; sem o PRR, a mesma linha sobe 22,2 %.

A descida vem toda do fim do PRR. Em 2026 o PRR valia 771,1 na despesa efetiva da Saúde; em 2027 vale zero, e a despesa efetiva é a mesma com e sem ele, 17 803,1 e 17 803,1. A despesa fora do PRR sobe 511,8, o que repõe 0,6637 do que o PRR deixa; a diferença, −259,3, é a queda da despesa efetiva.

O que sobe e o que desce não são a mesma coisa: o pessoal leva mais 401,2; a aquisição de bens e serviços leva menos 396,6; o investimento leva menos 344,2; e as outras despesas correntes passam de 32,4 para 303,7, sem que o relatório diga o que lá entra. O financiamento conta com receitas próprias a crescer 56,5 % e com fundos europeus a cair de 655,0 para 174,6.

O fim do PRR não é só da Saúde: em 2026 o PRR pesava 1 472,7 nas Finanças, 1 357,1 na Economia, 1 133,0 nas Infraestruturas e habitação, 823,2 no Ambiente e energia e 771,1 na Saúde. Em 2027 a despesa fora do PRR cresce 3,0 % na Saúde, 4,9 % na Educação, 8,8 % no Trabalho, solidariedade e segurança social, 20,8 % nas Infraestruturas e habitação, 18,2 % na Justiça e 13,1 % na Segurança interna.

O orçamento de 2027, 17 858,4, é inferior ao que o relatório estima que se gaste em 2026, 18 125,9, e superior em 3,6 % ao que se gastou em 2025, 17 241,5. A UTAO escreve, sobre a execução do Serviço Nacional de Saúde em 2027: «Existe um risco de pressão orçamental»

**A conclusão**

As três afirmações correspondem a linhas diferentes do quadro e nenhuma apresenta as três medidas em conjunto. A Saúde tem orçamentados em 2027 menos 267,5 milhões de euros do que a estimativa de despesa de 2026 porque o PRR acaba, e a despesa fora do PRR sobe 511,8 face aos 771,1 que o PRR deixa. A despesa com pessoal sobe, enquanto a compra de bens e serviços e o investimento descem. Desde 2020 nenhum orçamento inicial da Saúde dos anos com execução concluída chegou ao fim do ano sem ser ultrapassado, e o de 2027 é inferior ao que se estima gastar em 2026.

**A recomendação**

A pergunta útil não é se o orçamento da Saúde sobe ou desce, é se chega: a resposta dos últimos seis anos é que não chegou nenhuma vez, e a execução até agosto de 2026, 19,9 % acima de 2025, reforça o risco de nova insuficiência. Quem acompanhar a Saúde em 2027 olha para a execução mensal da DGO e para a eventual necessidade de reforço, não apenas para a aprovação.

**A opinião do lugar de direção**

O ministro e a RTP escolheram cada um a linha que lhes convinha, e as duas são verdadeiras; a discussão sobre «sobe» ou «desce» esconde o que o quadro mostra: um orçamento que paga mais pessoal com menos compras e menos investimento, que conta com receitas próprias a crescer mais de metade sem o relatório dizer de onde, e que, pelo que a execução de 2026 e os seis anos anteriores mostram, corre o risco de voltar a ser ultrapassado. O orçamento da Saúde para 2027 é um orçamento de transição para o fim do PRR, e a sua medida certa conhece-se na execução, não na aprovação. Dizer isto custava mais do que dizer «sobe» ou «cai», e era o que o debate devia.

### As parcerias rodoviárias: o que o Estado paga, o que vai pagar e o que não está no quadro

**Como foi dito**

«Vem com um orçamento que entrega 1 700 milhões às parcerias público-privadas rodoviárias», Paulo Raimundo · PCP, na Assembleia da República, a 09.10.2026. A 12.10.2026, Paula Santos: «Em sentido inverso cresce mais do que o previsto a despesa com as chamadas PPP – rodoviárias, ferroviárias, saúde – com o Governo a desviar mais de 1800 milhões de euros de recursos públicos para os grupos económicos privados, sem que tal se traduza em novas infraestruturas ou investimento nas existentes.». A 15.10.2026, Paulo Raimundo: «Há condições, há recursos e meios, desde logo na Segurança Social, mas há também opções que se podem e têm de fazer, e entre os mais de 1700 milhões de euros que o Governo quer pagar em PPP e o aumento dos reformados, da nossa parte não temos dúvidas da opção a tomar.»

**O que as fontes dizem**

O quadro 4.25 do relatório do Orçamento, as parcerias público-privadas, 2027, em milhões de euros.

Os encargos brutos do setor rodoviário são 1 152; as receitas, 263; os encargos líquidos, 889. As parcerias ferroviárias custam 312 e as da saúde 254, numa linha única cada, sem receitas; os encargos brutos rodoviários mais os encargos ferroviários e da saúde somam 1 718, e o total líquido impresso para todos os setores é 1 438. Previsão, não execução. As linhas setoriais do quadro não somam exatamente o total impresso; o quadro não explica a diferença. O quadro diz que os valores são de caixa e, quando aplicável, incluem o IVA.

Os encargos líquidos rodoviários, ano a ano, pelos relatórios do Orçamento: 1 250 em 2021 (execução), 1 192 em 2022, 1 105 em 2023, 1 012 em 2024, 843 em 2025, 942 em 2026 (estimativas) e 889 em 2027 (orçamento).

O relatório projeta 705 em 2028, 648 em 2029, 77 em 2035 e 17 em 2040, o último ano com encargos rodoviários; em 2030 as receitas excedem os encargos e a linha é negativa, −220.

Para 2027, o relatório do ano passado previa 774 de encargos líquidos; este prevê 889. Segundo o relatório, a diferença vem dos custos da cobrança das portagens e dos pagamentos ligados ao tráfego, que subiram, e das receitas de portagem, que desceram.

Fora do quadro, no capítulo dos riscos, o relatório conta 2 388,2 milhões de euros em pedidos de reequilíbrio financeiro e litígios das concessionárias e subconcessionárias rodoviárias, 1 140 acima do relatório anterior, dos quais 1 122,5 da Brisa, na negociação em curso, e 445 da ação principal da Rotas do Algarve Litoral, em que o Estado já paga 1,3 milhões por mês a título provisório. A UTAO escreve que estes valores são «não encargos já reconhecidos»

**A comparação**

Nenhum dos valores rodoviários do quadro é igual a 1 700 milhões de euros: o número está 548 acima dos encargos brutos e 811 acima dos líquidos.

O número aproxima-se da soma dos encargos brutos rodoviários com os encargos ferroviários e da saúde, 1 718, sem que isso demonstre a conta que lhe deu origem; as rodoviárias são 61,82 % do total líquido. O próprio PCP alargou depois o universo referido: «Em sentido inverso cresce mais do que o previsto a despesa com as chamadas PPP – rodoviárias, ferroviárias, saúde – com o Governo a desviar mais de 1800 milhões de euros de recursos públicos para os grupos económicos privados, sem que tal se traduza em novas infraestruturas ou investimento nas existentes.» a 12.10.2026, e «Há condições, há recursos e meios, desde logo na Segurança Social, mas há também opções que se podem e têm de fazer, e entre os mais de 1700 milhões de euros que o Governo quer pagar em PPP e o aumento dos reformados, da nossa parte não temos dúvidas da opção a tomar.» a 15.10.2026.

O relatório prevê para as parcerias rodoviárias 889 líquidos em 2027 contra 1 250 executados em 2021, −28,9 %; mas mais do que os 843 estimados para 2025, porque os encargos brutos voltaram a subir, e o relatório diz que passou a contar neles o apoio pago às concessionárias pelos descontos nas portagens, que o relatório anterior não contava. A projeção tem uma tendência de redução, com oscilações, até 17 em 2040.

O número que falta nas três afirmações citadas é o dos pedidos pendentes, 2 388,2, que não está no quadro dos encargos nem nessas afirmações, e que é maior do que os encargos rodoviários brutos e do que o número da primeira afirmação.

**A conclusão**

O relatório prevê 889 milhões líquidos para as parcerias rodoviárias em 2027, −28,9 % face à execução de 2021 mas acima da estimativa para 2025, e o quadro projeta uma tendência de redução, com oscilações, até ao fim dos contratos. O número da primeira afirmação do PCP aproxima-se do custo bruto de todas as parcerias, não do das rodoviárias. E o que pode mudar a conta não está no quadro: 2 388,2 milhões de pedidos das concessionárias, dos quais 1 122,5 numa negociação em curso.

**A recomendação**

A discussão útil em 2027 é a negociação com a Brisa e os litígios pendentes, além do valor orçamentado dos pagamentos contratados. Quem quiser vigiar as parcerias olha para o capítulo dos riscos do relatório e para o relatório anual da UTAP, não só para o quadro dos encargos.

**A opinião do lugar de direção**

O PCP tem razão ao chamar a atenção para o custo das parcerias, mas erra ao atribuir às rodoviárias um número que ultrapassa os seus encargos brutos. As parcerias custam ao Estado mais de mil milhões brutos no ano orçamentado; a afirmação posterior já abrange as rodoviárias, ferroviárias e da saúde, mas o seu montante também excede a soma do quadro: «Em sentido inverso cresce mais do que o previsto a despesa com as chamadas PPP – rodoviárias, ferroviárias, saúde – com o Governo a desviar mais de 1800 milhões de euros de recursos públicos para os grupos económicos privados, sem que tal se traduza em novas infraestruturas ou investimento nas existentes.» O Governo, por sua vez, apresenta um quadro dos pagamentos contratados e remete para um capítulo de riscos os pedidos que podem mudar a conta. Entre os dois, o leitor fica a saber os pagamentos previstos às concessionárias; fica por saber quanto dos pedidos pendentes se tornará encargo efetivo, e é essa a conta que o Parlamento devia pedir antes de votar.


## Frases renderizadas: EN

### The Health budget for 2027: 3,0 % without the RRP or −1,5 % in total? Both counts, what changes inside it, and what went unsaid

**As it was said**

«Ora, esta verba do PRR foi excecional. Se retirarmos isso, o orçamento da Saúde sobre 3%», António Leitão Amaro, ministro da Presidência, in a document published by RTP, on 09.10.2026. On the same day, RTP published: «O orçamento para Saúde sofre um corte em 2027. Cai 1,5 por cento. Estão atribuídos 17 mil 858 milhões de euros. Menos 267,5 milhões do que este ano.». On 12.10.2026, Paula Santos said: «O investimento sofre um corte brutal de 33,7%.»

**What the sources say**

Table 5.37 of the Budget report, the Health programme, in million euros.

Total consolidated expenditure goes from 18 125,9 in 2026 to 17 858,4 in 2027, a change of −1,5 %. Consolidated effective expenditure goes from 18 062,4 to 17 803,1, −1,4 %. Without the RRP, the Recovery and Resilience Plan, consolidated effective expenditure goes from 17 291,3 to 17 803,1, 3,0 %.

Inside it, personnel expenditure goes from 7 783,1 to 8 184,3, 5,2 %; the purchase of goods and services, the programme's largest line, goes from 8 832,9 to 8 436,3, −4,5 %; investment goes from 1 022,5 to 678,3, −33,7 % with the RRP and 22,2 % without it; other current expenditure goes from 32,4 to 303,7, and capital transfers from 272,9 to 0,0.

The financing, comparing the two budgets: tax revenue goes from 15 116,4 to 15 452,2; own revenue from 1 289,5 to 2 017,6, 56,5 %; European funds from 655,0 to 174,6. Transfers to the National Health Service go from 14 935,8 to 15 539,2, 4,0 %.

Since 2020, Health has spent more than its initial budget every year: 11 282,2 budgeted and 11 731,9 executed in 2020; 16 853,5 and 17 241,5 in 2025; in 2026 the initial budget was 17 300,2 and the report's execution estimate is 18 125,9, 825,7 above; the UTAO, starting from another base, counts 915 in effective expenditure.

In the execution to August 2026, the Health programme's effective expenditure was 11 822,6, 19,9 % above the same period of 2025, and the National Health Service had, in those eight months, a balance of −918,5 million euros, with expenditure growing 13,2 %.

In the European comparison, Portugal spent 10,20 % of GDP on health in 2024, the EU 10,16 %; per inhabitant, 2 764,83 euros against 4 074,88 in the EU; in government schemes and compulsory contributory schemes alone, 6,31 % of GDP against 8,17 %.

**The comparison**

RTP's figures, the fall, the amount and the difference, match the line for total consolidated expenditure: from 18 125,9 to 17 858,4, −267,5 million euros, −1,5 %. The minister's figure matches the change in the line for consolidated effective expenditure without the RRP, 3,0 %, the same one the report gives and the UTAO confirms: «a despesa aumentaria 3,0%». The PCP figure on investment matches the investment line with the RRP, −33,7 %; without the RRP, the same line rises 22,2 %.

The fall comes entirely from the end of the RRP. In 2026 the RRP accounted for 771,1 in effective Health expenditure; in 2027 it is zero, and effective expenditure is the same with and without it, 17 803,1 and 17 803,1. Expenditure outside the RRP rises 511,8, replacing 0,6637 of what the RRP leaves; the difference, −259,3, is the fall in effective expenditure.

What rises and what falls are not the same thing: personnel gets 401,2 more; the purchase of goods and services gets 396,6 less; investment gets 344,2 less; and other current expenditure goes from 32,4 to 303,7, without the report saying what it includes. The financing counts on own revenue growing 56,5 % and European funds falling from 655,0 to 174,6.

The end of the RRP is not confined to Health: in 2026 the RRP accounted for 1 472,7 in Finance, 1 357,1 in Economy, 1 133,0 in Infrastructure and housing, 823,2 in Environment and energy and 771,1 in Health. In 2027 expenditure outside the RRP grows 3,0 % in Health, 4,9 % in Education, 8,8 % in Labour, solidarity and social security, 20,8 % in Infrastructure and housing, 18,2 % in Justice and 13,1 % in Internal security.

The budget for 2027, 17 858,4, is below what the report estimates will be spent in 2026, 18 125,9, and 3,6 % above what was spent in 2025, 17 241,5. The UTAO writes, on the execution of the National Health Service in 2027: «Existe um risco de pressão orçamental»

**The conclusion**

The three claims correspond to different lines of the table and none presents all three measures together. In 2027, Health is budgeted to receive 267,5 million euros less than the expenditure estimate for 2026 because the RRP ends, and expenditure outside the RRP rises 511,8 against the 771,1 the RRP leaves. Personnel expenditure rises, while the purchase of goods and services and investment fall. Since 2020, no initial Health budget in the years with completed execution has reached the end of the year without being exceeded, and the 2027 one is below what is estimated to be spent in 2026.

**The recommendation**

The useful question is not whether the Health budget rises or falls, but whether it is enough: the answer of the last six years is that it never was, and the execution to August 2026, 19,9 % above 2025, reinforces the risk of another shortfall. Whoever follows Health in 2027 watches the DGO's monthly execution and the possible need for reinforcement, not just the approval.

**The editorial seat's opinion**

The minister and RTP each chose the line that suited them, and both are true; the argument over «up» or «down» hides what the table shows: a budget that pays more staff with fewer purchases and less investment, that counts on own revenue growing by more than half without the report saying from where, and that, on the evidence of the 2026 execution and the six years before it, risks being exceeded again. The Health budget for 2027 is a transition budget for the end of the RRP, and its true size will be known in the execution, not at the vote. Saying this cost more than saying «up» or «down», and it was what the debate owed.

### The road partnerships: what the State pays, what it will pay, and what the table leaves out

**As it was said**

«Vem com um orçamento que entrega 1 700 milhões às parcerias público-privadas rodoviárias», Paulo Raimundo · PCP, in the Assembleia da República, on 09.10.2026. On 12.10.2026, Paula Santos: «Em sentido inverso cresce mais do que o previsto a despesa com as chamadas PPP – rodoviárias, ferroviárias, saúde – com o Governo a desviar mais de 1800 milhões de euros de recursos públicos para os grupos económicos privados, sem que tal se traduza em novas infraestruturas ou investimento nas existentes.». On 15.10.2026, Paulo Raimundo: «Há condições, há recursos e meios, desde logo na Segurança Social, mas há também opções que se podem e têm de fazer, e entre os mais de 1700 milhões de euros que o Governo quer pagar em PPP e o aumento dos reformados, da nossa parte não temos dúvidas da opção a tomar.»

**What the sources say**

Table 4.25 of the Budget report, the public-private partnerships, 2027, in million euros.

Gross charges for the road sector are 1 152; revenue, 263; net charges, 889. Rail partnerships cost 312 and health ones 254, each on a single line, with no revenue; gross road charges plus rail and health charges add up to 1 718, and the printed net total for all sectors is 1 438. Forecast, not outturn. The sector rows in the table do not add up exactly to the printed total; the table does not explain the difference. The table says the values are on a cash basis and, where applicable, include VAT.

Net road charges, year by year, in the Budget reports: 1 250 in 2021 (execution), 1 192 in 2022, 1 105 in 2023, 1 012 in 2024, 843 in 2025, 942 in 2026 (estimates) and 889 in 2027 (budget).

The report projects 705 in 2028, 648 in 2029, 77 in 2035 and 17 in 2040, the last year with road charges; in 2030 revenue exceeds charges and the line is negative, −220.

For 2027, last year's report forecast 774 in net charges; this one forecasts 889. According to the report, the difference comes from toll collection costs and traffic-linked payments, which rose, and toll revenue, which fell.

Outside the table, in the risks chapter, the report counts 2 388,2 million euros in financial rebalancing claims and litigation by road concessionaires and subconcessionaires, 1 140 above the previous report, including 1 122,5 from Brisa, in the ongoing negotiation, and 445 in the main action by Rotas do Algarve Litoral, in which the State already pays 1,3 million a month provisionally. The UTAO writes that these amounts are «não encargos já reconhecidos»

**The comparison**

None of the road figures in the table equals 1 700 million euros: the figure is 548 above gross charges and 811 above net charges.

The figure is close to the sum of gross road charges and rail and health charges, 1 718, without that proving the calculation behind it; road partnerships are 61,82 % of the net total. The PCP itself later broadened the scope it referred to: «Em sentido inverso cresce mais do que o previsto a despesa com as chamadas PPP – rodoviárias, ferroviárias, saúde – com o Governo a desviar mais de 1800 milhões de euros de recursos públicos para os grupos económicos privados, sem que tal se traduza em novas infraestruturas ou investimento nas existentes.» on 12.10.2026, and «Há condições, há recursos e meios, desde logo na Segurança Social, mas há também opções que se podem e têm de fazer, e entre os mais de 1700 milhões de euros que o Governo quer pagar em PPP e o aumento dos reformados, da nossa parte não temos dúvidas da opção a tomar.» on 15.10.2026.

The report forecasts net road partnership charges of 889 in 2027 against 1 250 executed in 2021, −28,9 %; but more than the 843 estimated for 2025, because gross charges rose again, and the report says it began counting the support paid to concessionaires for toll discounts, which the previous report did not count. The projection trends downwards, with fluctuations, to 17 in 2040.

The figure missing from the three quoted claims is that of the pending demands, 2 388,2, which is absent from the charges table and those claims, and exceeds gross road charges and the figure in the first claim.

**The conclusion**

The report forecasts 889 million net for the road partnerships in 2027, −28,9 % against execution in 2021, but above the estimate for 2025, and the table projects a downward trend, with fluctuations, to the end of the contracts. The figure in the PCP's first claim is close to the gross cost of all partnerships, not of the road ones. And what could change the bill is not in the table: 2 388,2 million in concessionaires' claims, 1 122,5 of them in a negotiation under way.

**The recommendation**

The useful debate in 2027 is the Brisa negotiation and the pending lawsuits, alongside the budgeted figure for contracted payments. Whoever wants to watch the partnerships looks at the report's risks chapter and at UTAP's annual report, not only at the table of charges.

**The editorial seat's opinion**

The PCP is right to draw attention to the cost of partnerships, but wrong to attribute to road partnerships a figure exceeding their gross charges. Partnerships cost the State over a billion gross in the budgeted year; the later claim already covers road, rail and health partnerships, but its amount also exceeds the sum in the table: «Em sentido inverso cresce mais do que o previsto a despesa com as chamadas PPP – rodoviárias, ferroviárias, saúde – com o Governo a desviar mais de 1800 milhões de euros de recursos públicos para os grupos económicos privados, sem que tal se traduza em novas infraestruturas ou investimento nas existentes.» The Government, for its part, presents a table of contracted payments and sends the claims that could change the bill to a risks chapter. Between the two, the reader learns the payments forecast for concessionaires; how much of the pending claims will become an actual charge remains unknown, and that is the bill Parliament should ask for before voting.

## Reprodução

Na raiz do sítio, passar `<motor>` ao guião `conferir-partida.py`, correr `medir-final.mjs` e depois `gerar-relatorio.py`, todos nesta pasta. No motor, `python3 -m publisher.v2d_export` prepara o manifesto e as provas; `python3 -m publisher.export_site_rows --manifest publisher/manifest.v2d.json --site <worktree> --write` atravessa pelo exportador comum.

Os portões correm por `sh scripts/leituras/portoes-pelo-escrivao.sh <temporario> v2d`; as capturas usam `pedido-capturas.json` pelo guião do escrivão. `check:cruzamento --with-origin` recebe o motor em `RESEARCHHUB_DIR`. O motor inteiro corre pelo pre-commit do escrivão.
