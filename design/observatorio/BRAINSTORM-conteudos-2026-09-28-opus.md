# O Estado do País · memorando de conteúdo e de forma

Para o lugar de direção, a 28.09.2026. Escrito só com leitura: o repositório do sítio, a API de disseminação do Eurostat e páginas oficiais. Nenhum ficheiro de nenhum repositório foi mudado.

Convenções. O identificador entre parênteses é a linha do livro-razão de onde vem o número. Uma página oficial lida hoje leva o endereço e a hora em UTC (Lisboa está a UTC+1). «Derivado, por selar» marca uma conta minha sobre linhas seladas que ainda não existe como linha e tem de nascer como linha antes de entrar numa página. `[verify]` marca o que não consegui confirmar. O sítio do INE recusou a ligação às 12:42 e às 12:44 UTC, pelos dois caminhos que tenho: nenhum número do INE foi relido hoje, e os do INE vêm só das linhas.

## 1. Os achados que os dados do projeto já sustentam hoje

A ordem responde a três perguntas, por esta ordem: a quantas pessoas a pergunta toca; se o achado muda o que o leitor concluiria de um número sozinho; se é de agora (juízo meu). A base de cada achado são linhas seladas; o que vem dos 27 países ou de uma página lida hoje está marcado como acréscimo.

### 1.1 Quem arrenda paga a casa mais cara do que na Europa

**A pergunta.** A casa pesa mais no orçamento em Portugal do que no resto da União?

**O achado.** Para a população inteira, não: em 2025, 6,3 % das pessoas viviam em casas cujo custo passa de 40 % do rendimento disponível (`sobrecarga-do-custo-da-habitacao-2025`), menos do que na União, 7,7 % (`sobrecarga-do-custo-da-habitacao-2025-ue`). Para quem arrenda a preço de mercado, sim: 27,2 % (`sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025`), contra 18,6 % na União (`sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025-ue`); em 2024 eram 30,3 % (`sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2024`). Quer dizer: em cada quatro pessoas que pagam uma renda de mercado, mais de uma fica com menos de 60 % do rendimento para tudo o que não é a casa.

**As linhas.** As cinco acima e `sobrecarga-do-custo-da-habitacao-2024` (6,9 %).

**Porque é honesta.** As quatro linhas de 2025 saem do mesmo inquérito (EU-SILC), do mesmo ano, com a mesma definição e a mesma unidade, a percentagem de pessoas: custos da casa, descontados os apoios à habitação e incluindo água, eletricidade, gás e aquecimento, acima de 40 % do rendimento disponível (glossário do Eurostat, https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Glossary:Housing_cost_overburden_rate, lido às 12:53 UTC). O número geral lê-se ao contrário porque a maior parte das pessoas vive em casa própria: em 2025, 71,2 % em Portugal, e 16,3 % eram inquilinas a preço de mercado (na União, 68,5 % e 20,8 %), pela tabela ilc_lvho02 do Eurostat (https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/ilc_lvho02?format=JSON&lang=EN&hhcomp=TOTAL&rskpovth=TOTAL&tenure=RENT_MKT&tenure=OWN&time=2025, lida às 12:40 UTC). Estas quatro percentagens ainda não são linhas.

**O desenho.**

```
390 px
+====================================+
| QUEM ARRENDA · 2025                |
| Custo da casa acima de 40 % do     |
| rendimento (% de pessoas)          |
|                                    |
| Toda a população            6,3 %  |
| ###:                               |
|    : União 7,7 %                   |
| Inquilinos a preço de      27,2 %  |
| mercado                            |
| #########:#####                    |
|          : União 18,6 %            |
| Em 2024: 30,3 %                    |
|                                    |
| Mais de 1 em cada 4 fica com menos |
| de 60 % do rendimento para o resto.|
| Fonte e recibo em cada número.     |
+====================================+

1 280 px
+===========================================================+==============================+
| QUEM ARRENDA PAGA A CASA MAIS CARA · 2025                 | QUEM ARRENDA E QUEM É DONO   |
| % de pessoas com o custo da casa acima de 40 %            | (quatro valores por selar)   |
|                    (cada # = 2 %; : = a União)            | Casa própria                 |
| Toda a população   ###:                        6,3 %     |  Portugal #########  71,2 %  |
|                       : União 7,7 %                       |  União    #########  68,5 %  |
| Inquilinos,        #########:#####            27,2 %      | Renda de mercado             |
| preço de mercado            : União 18,6 %                |  Portugal ##         16,3 %  |
|                    2024: 30,3 %  >  2025: 27,2 %          |  União    ###        20,8 %  |
| Uma frase: o número geral é baixo porque a maior parte    |                              |
| das pessoas vive em casa própria.                         |                              |
+===========================================================+==============================+
```

**A ressalva.** O rendimento do inquérito de 2025 é o de 2024 («For all countries, the reference period for income variables in EU-SILC is the previous calendar year», https://ec.europa.eu/eurostat/cache/metadata/en/ilc_sieusilc.htm, lido às 12:53 UTC). É uma amostra: a descida de 30,3 para 27,2 pode caber na margem de erro, que o livro-razão não tem `[verify]`. Conta pessoas, não famílias. «Preço de mercado» deixa de fora as rendas reduzidas ou gratuitas. Não diz em que concelhos: as rendas por concelho do INE saem a 29.09.2026, pelo calendário do sítio (`src/data/calendario.json`).

### 1.2 Os preços de agosto: os combustíveis a subir, o resto devagar

**A pergunta.** O que está mais caro do que há um ano?

**O achado.** Em agosto de 2026 os preços estavam 3,30 % acima de agosto de 2025 (`ipc-variacao-homologa`; em julho, 3,04 %, `ipc-variacao-homologa-periodo-anterior`). Os combustíveis para o carro subiram 23,78 % (`ipc-combustiveis-variacao-homologa`; 16,58 % em julho, `ipc-combustiveis-variacao-homologa-periodo-anterior`), as rendas 5,22 % (`ipc-rendas-variacao-homologa`; 5,26 % em julho), a alimentação 2,14 % (`ipc-alimentacao-variacao-homologa`; 2,24 % em julho) e a eletricidade, o gás e outros combustíveis de casa 1,36 % (`ipc-energia-em-casa-variacao-homologa`; 1,12 % em julho). Quer dizer: o que custava 100 € em agosto de 2025 custava, em média, 103,30 € em agosto de 2026; no combustível, 123,78 € (derivado, por selar: 100 × (1 + taxa)).

**As linhas.** As dez linhas do IPC acima (cada medida com o seu `-periodo-anterior`) e, para a União, `ihpc-variacao-homologa` (3,6 %), `ihpc-variacao-homologa-ue` (3,2 %) e `ihpc-variacao-homologa-periodo-anterior` (3,1 %).

**Porque é honesta.** O mesmo índice (o IPC do INE, base 2025), o mesmo mês, a mesma taxa (homóloga). As componentes comparam-se entre si como taxas. Portugal e a União só se põem lado a lado pelo índice harmonizado, 3,6 contra 3,2, porque o IPC não tem par europeu.

**O desenho.**

```
390 px
+====================================+
| OS PREÇOS · agosto de 2026         |
| Subida num ano   (: = julho)       |
|                                    |
| Combustíveis  ########:### 23,78 % |
| Rendas        ##:           5,22 % |
| Total         #:            3,30 % |
| Alimentação   #:            2,14 % |
| Energia de    :#            1,36 % |
| casa                               |
|                                    |
| O que custava 100 € em agosto de   |
| 2025 custava 103,30 € em agosto de |
| 2026.                              |
+====================================+

1 280 px
+===========================================================+==============================+
| OS PREÇOS · agosto de 2026    (cada # = 1 %; : = julho)   | PORTUGAL E A UNIÃO           |
|                                                           | Índice harmonizado, agosto   |
| Combustíveis      ################:#######   23,78 %      |  Portugal ####  3,6 %        |
| Rendas            #####:                      5,22 %      |  União    ###   3,2 %        |
| Total             ###:                        3,30 %      |  Portugal em julho: 3,1 %    |
| Alimentação       ##:                         2,14 %      | O IPC e o índice harmonizado |
| Energia de casa   :#                          1,36 %      | não são o mesmo índice.      |
+===========================================================+==============================+
```

**A ressalva.** Uma taxa homóloga compara com o mesmo mês do ano anterior; não diz o nível dos preços nem que vão continuar a subir. A subida de uma componente não pesa no orçamento o mesmo que a do total: os pesos do cabaz não estão no livro-razão, e sem eles o sítio não pode dizer quanto dos 3,30 % vem dos combustíveis. O índice harmonizado conta também o que os não residentes compram no país («both resident and non-resident (i.e 'domestic concept')», metainformação do Eurostat, https://ec.europa.eu/eurostat/cache/metadata/en/prc_hicp_esms.htm, lida às 12:53 UTC): 3,30 e 3,6 são dois números certos para o mesmo mês, de dois índices diferentes.

### 1.3 A renda de 2027: a regra da lei dá 2,56 %

**A pergunta.** Quanto pode subir a minha renda no próximo ano?

**O achado.** A lei manda atualizar as rendas pela «totalidade da variação do índice de preços no consumidor, sem habitação, correspondente aos últimos 12 meses e para os quais existam valores disponíveis à data de 31 de Agosto» (Lei n.º 6/2006, artigo 24.º, n.º 1, texto original, https://files.dre.pt/1s/2006/02/041a00/15581587.pdf, lido às 12:55 UTC). Em agosto de 2026 esse valor era 2,56 % (`ipc-sem-habitacao-variacao-media-12-meses`; 2,51 % em julho, `ipc-sem-habitacao-variacao-media-12-meses-periodo-anterior`). Quer dizer: uma renda que siga a regra legal pode subir até 2,56 % em 2027, e o resultado arredonda para o euro de cima (artigo 25.º, n.º 1, no mesmo texto). Uma renda de 650 € passaria a 667 €, no máximo (derivado, por selar: 650 × 1,0256 = 666,64, arredondado para cima).

**As linhas.** As duas acima.

**Porque é honesta.** Não é uma comparação: é a aplicação da medida e do mês que a própria lei nomeia. O sítio já o escreve na leitura desta linha: «O valor de agosto serve de referência para a atualização das rendas no ano seguinte» (`src/data/leituras-rp1.mjs`).

**O desenho.**

```
390 px
+====================================+
| A RENDA DE 2027                    |
| A regra da lei dá                  |
|              2,56 %                |
|                                    |
| A minha renda hoje   [   650 ] €   |
| Em 2027, no máximo        667 €    |
| (arredonda para o euro de cima)    |
|                                    |
| O valor oficial sai no Diário da   |
| República até 30 de outubro.       |
+====================================+

1 280 px
+==========================================+===============================================+
| A RENDA DE 2027                          | A minha renda hoje   [   650 ] €              |
| A regra da lei dá 2,56 %                 | Em 2027, no máximo   667 €                     |
| Em julho dava 2,51 %                     | A conta: 650 × 1,0256 = 666,64, sobe para 667 |
| Lei n.º 6/2006, artigos 24.º e 25.º      | Aviso oficial: até 30.10.2026                 |
+==========================================+===============================================+
```

**A ressalva.** O coeficiente oficial é o que o INE apura e o aviso publica no Diário da República até 30 de outubro (artigo 24.º, n.º 2): até lá diz-se «a regra dá 2,56 %», e o aviso entra como linha própria quando sair. Li o texto original de 2006; se a regra mudou depois, ou foi limitada num ano concreto, isso está na versão consolidada, que a página do Diário da República só serve por programa e não consegui abrir `[verify]`. Um contrato com cláusula própria de atualização segue a cláusula `[verify]`. A calculadora não publica um número do sítio: aplica uma aritmética declarada a uma linha selada e a um número do leitor. É o lugar de direção que decide se isto cabe na regra 2.

### 1.4 O preço das casas subiu 17,6 %, contra 5,5 % na União

**A pergunta.** As casas encarecem mais cá do que lá fora?

**O achado.** Em 2025 o índice de preços da habitação subiu 17,6 % em Portugal (`precos-da-habitacao-2025`; 9,1 % em 2024, `precos-da-habitacao-2024`), contra 5,5 % na União (`precos-da-habitacao-2025-ue`), e acima dos 9 % que a Comissão Europeia usa como limiar de alerta («nominal house price (1-year % change), with a threshold of 9%», https://economy-finance.ec.europa.eu/economic-and-fiscal-governance/macroeconomic-imbalance-procedure/scoreboard_en, lido às 12:46 UTC). No mesmo ano, o crédito novo às famílias somou 8,6 % do que já deviam (`fluxo-de-credito-as-familias-2025`; 4,1 % em 2024; na União 2,9 %, `fluxo-de-credito-as-familias-2025-ue`), e as licenças para construir habitação chegaram a 749,7 m² por mil habitantes (`licencas-de-construcao-2025`; 654,5 em 2024; na União 377,5, `licencas-de-construcao-2025-ue`). Quer dizer: em média, as casas vendidas em 2025 custaram mais 17,6 % do que as de 2024. Acréscimo dos 27 (tabela tipsho20, lida às 12:39 UTC, sem linhas): só a Hungria teve uma subida maior, 18,3 %, valor provisório.

**As linhas.** As nove acima.

**Porque é honesta.** Cada medida compara Portugal e a União na mesma tabela e no mesmo ano. As três medidas ficam lado a lado, cada uma no seu eixo, e nenhuma se soma à outra nem se lê como causa.

**O desenho.**

```
390 px
+====================================+
| O PREÇO DAS CASAS · 2025           |
| Subida dos preços                  |
|  União     ####              5,5 % |
|  Portugal  ######|######    17,6 % |
|                  | limiar da       |
|                    Comissão: 9 %   |
| Crédito novo às famílias           |
|  Portugal 8,6 %   União 2,9 %      |
| Licenças, m² por mil habitantes    |
|  Portugal 749,7   União 377,5      |
| Três medidas, três escalas.        |
+====================================+

1 280 px
+============================+============================+==============================+
| PREÇOS DAS CASAS (%)       | CRÉDITO NOVO ÀS FAMÍLIAS   | LICENÇAS (m² / mil hab.)     |
| 2024  9,1  >  2025 17,6    | 2024 4,1  >  2025 8,6      | 2024 654,5  >  2025 749,7    |
| União 5,5                  | União 2,9                  | União 377,5                  |
| limiar da Comissão: 9      | limiar da Comissão: 14     | sem limiar, sem cor          |
| (acima do limiar: cor)     | (dentro do limiar)         |                              |
+============================+============================+==============================+
  Cada painel com o seu eixo; nenhum eixo duplo; nenhuma seta de causa entre painéis.
```

**A ressalva.** É um índice nominal: não desconta a inflação. É nacional e esconde os concelhos; os preços por concelho do INE saem a 23.10.2026, pelo calendário do sítio. Crédito e licenças acompanham os preços, não os explicam; uma licença não é uma casa acabada.

### 1.5 Trabalha-se mais do que na União, e o desemprego está na média

**A pergunta.** Há trabalho em Portugal?

**O achado.** Em 2025 tinham emprego 79,6 % das pessoas dos 20 aos 64 anos (`taxa-de-emprego-2025`; 78,5 % em 2024, `taxa-de-emprego-2024`), mais do que na União, 76,1 % (`taxa-de-emprego-2025-ue`), e acima da meta europeia para 2030, 78 % (glossário do Eurostat, https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Glossary:The_European_Pillar_of_Social_Rights_Action_Plan_(EU_2030_targets), lido às 12:46 UTC). A meta que Portugal fixou para si é 80,0 % (anexo 1 do Relatório Conjunto sobre o Emprego, COM(2025) 958, https://employment-social-affairs.ec.europa.eu/document/download/82702c6c-135c-4042-ae74-4afd6432e83f_en?filename=COM_2025_958_1_EN_annexe.pdf, lido às 12:48 UTC). O desemprego era igual ao da União, 6,0 % (`taxa-de-desemprego-2025`, `taxa-de-desemprego-2025-ue`); o de longa duração um pouco mais alto, 2,2 % contra 1,9 % (`desemprego-de-longa-duracao-2025`, `desemprego-de-longa-duracao-2025-ue`); os jovens de 15 a 29 anos sem emprego, escola ou formação eram menos, 8,0 % contra 11,0 % (`jovens-nem-2025`, `jovens-nem-2025-ue`). Quer dizer: de cada 100 pessoas dos 20 aos 64 anos, perto de 80 trabalham; de cada 100 que trabalham ou procuram trabalho, 6 não o têm.

**As linhas.** As oito acima.

**Porque é honesta.** O mesmo inquérito ao emprego, as mesmas idades, o mesmo ano em Portugal e na União. As metas são da União e de Portugal: aqui a fonte julga, e a cor é permitida.

**O desenho.**

```
390 px
+====================================+
| O TRABALHO · 2025                  |
| Com emprego, dos 20 aos 64 anos    |
| ###############:#!|     79,6 %     |
|  : União 76,1   ! meta da UE 78    |
|  | meta de Portugal 80             |
|                                    |
| Desemprego          6,0 %  UE 6,0  |
| Longa duração       2,2 %  UE 1,9  |
| Jovens sem emprego, 8,0 %  UE 11,0 |
| escola ou formação                 |
+====================================+

1 280 px
+============================================+=============================================+
| COM EMPREGO, 20 A 64 ANOS                  | DESEMPREGO                                  |
| eixo de 70 % a 85 %                        | cada # = 1 %; | = limiar da Comissão, 10 %  |
| ###############:###!#|  79,6 %             | ######:   |      6,0 %  (União 6,0)         |
| : União 76,1  ! meta UE 78  | meta PT 80   |                                             |
+============================================+=============================================+
| DESEMPREGO DE LONGA DURAÇÃO                | JOVENS SEM EMPREGO, ESCOLA OU FORMAÇÃO      |
| ##:  2,2 %  (União 1,9)                    | ########:##   8,0 %  (União 11,0)           |
+============================================+=============================================+
```

**A ressalva.** A taxa de emprego não diz nada sobre salário, contrato ou horas. O desemprego do inquérito não é o desemprego registado no IEFP, que é o que os concelhos têm. O livro-razão escreve «6» para Portugal e «6,0» para a União, e «8» nos jovens; a fonte imprime «6.0» e «8.0», e lado a lado parecem precisões diferentes (secção 6).

### 1.6 Menos pobreza do que na União, e mais distância entre o topo e a base

**A pergunta.** Há mais pobreza cá do que na Europa? E mais desigualdade?

**O achado.** Em 2025, 18,6 % das pessoas estavam em risco de pobreza ou exclusão social (`risco-de-pobreza-ou-exclusao-2025`; 19,7 % em 2024, `risco-de-pobreza-ou-exclusao-2024`), menos do que na União, 20,9 % (`risco-de-pobreza-ou-exclusao-2025-ue`). Mas os 20 % com mais rendimento tinham 4,86 vezes o rendimento dos 20 % com menos (`racio-s80-s20-2025`; 5,2 em 2024, `racio-s80-s20-2024`), mais do que na União, 4,62 (`racio-s80-s20-2025-ue`). A linha abaixo da qual se conta o risco de pobreza era de 8 679 € por ano para uma pessoa sozinha (`linha-de-risco-de-pobreza-2025`; 7 588 € no inquérito anterior, `linha-de-risco-de-pobreza-2024`), cerca de 723 € por mês (derivado, por selar: 8 679 ÷ 12). Quer dizer: há menos gente abaixo da linha do que na média europeia, mas o fosso entre quem tem mais e quem tem menos é maior.

**As linhas.** As oito acima.

**Porque é honesta.** O mesmo inquérito, o mesmo ano, as mesmas definições em Portugal e na União. São duas medidas diferentes, e o desenho dá a cada uma o seu eixo.

**O desenho.**

```
390 px
+====================================+
| POBREZA E DESIGUALDADE · 2025      |
| Em risco de pobreza ou exclusão    |
|  2024 19,7 o<····o 18,6 2025       |
|        União 20,9 :                |
| Quantas vezes o quinto de cima     |
| ganha o quinto de baixo            |
|  2024 5,2 o<····o 4,86 2025        |
|        União 4,62 :                |
| A linha de pobreza: 8 679 € por    |
| ano para uma pessoa sozinha.       |
+====================================+

1 280 px
+============================================+=============================================+
| EM RISCO DE POBREZA OU EXCLUSÃO (%)        | DISTÂNCIA ENTRE O TOPO E A BASE (vezes)     |
| 15      18      21      24                 | 4,0     4,5     5,0     5,5                 |
|        o<····o          : União 20,9       |         : União 4,62                        |
|     18,6    19,7                           |           o<····o                           |
| 2025 à esquerda, 2024 à direita            |        4,86    5,2                          |
+============================================+=============================================+
| A linha de pobreza de 2025: 8 679 € por ano, uma pessoa sozinha (rendimento de 2024).     |
+===========================================================================================+
```

**A ressalva.** A pobreza mede-se contra o rendimento do meio de cada país: a linha portuguesa não é a alemã. O rendimento é o do ano anterior. O risco de pobreza ou exclusão soma quem está em risco de pobreza, quem vive em privação material e social severa e quem vive num agregado quase sem trabalho, contando cada pessoa uma vez (glossário do Eurostat, https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Glossary:At_risk_of_poverty_or_social_exclusion_(AROPE), lido às 13:06 UTC). O rácio S80/S20 é rendimento, não riqueza. A meta de Portugal para 2030 é menos 765 mil pessoas em risco de pobreza ou exclusão (anexo 1 do COM(2025) 958, lido às 12:48 UTC), mas o livro-razão tem percentagens e não pessoas: a meta ainda não se desenha.

### 1.7 Reformar-se um ano mais cedo: 6,0 % ou 22,6 % a menos

**A pergunta.** Quanto perde quem se reforma um ano antes?

**O achado.** Pelas regras de 2026, um ano de antecipação corta a pensão em 6,0 % sem o fator de sustentabilidade (`penalizacao-antecipacao-um-ano-sem-factor-2026`) e em 22,6 % com ele (`penalizacao-antecipacao-um-ano-com-factor-2026`); o fator de 2026 é 0,8237, um corte de 17,63 % (`factor-sustentabilidade-2026`). O Grupo de Trabalho para a Reforma da Segurança Social calculou que o corte que deixaria o sistema neutro seria de 8,2 % (`penalizacao-antecipacao-um-ano-neutra`). Quer dizer: por cada 1 000 € de pensão, fica-se com 940 €, ou com 774 € quando se aplica o fator; a conta neutra do grupo daria 918 € (derivado, por selar: 1 000 × (1 − corte)).

**As linhas.** As quatro acima.

**Porque é honesta.** As quatro vêm do mesmo relatório (Grupo de Trabalho para a Reforma da Segurança Social, relatório final, junho de 2026) e das mesmas regras.

**O desenho.**

```
390 px
+====================================+
| REFORMAR-SE UM ANO ANTES · 2026    |
| Corte na pensão                    |
| Só a regra dos meses  ###    6,0 % |
| A conta neutra do     ####   8,2 % |
| grupo de trabalho                  |
| Com o fator de        ###########  |
| sustentabilidade            22,6 % |
|                                    |
| Por 1 000 € de pensão: 940 €,      |
| 918 € ou 774 €.                    |
| A quem se aplica o fator: (texto)  |
+====================================+

1 280 px
+===========================================================+==============================+
| REFORMAR-SE UM ANO ANTES · regras de 2026                 | POR 1 000 € DE PENSÃO        |
| (cada # = 1 % de corte)                                   | Regra dos meses      940 €   |
| Regra dos meses         ######               6,0 %        | Conta neutra         918 €   |
| Conta neutra do grupo   ########             8,2 %        | Com o fator          774 €   |
| Com o fator             ######################  22,6 %    | A quem se aplica o fator     |
+===========================================================+==============================+
```

**A ressalva.** O fator de sustentabilidade não se aplica a toda a antecipação, e a quem se aplica é o que o leitor precisa de saber primeiro; não está nas linhas `[verify]` no relatório e na lei. «Neutra» é o nome que o grupo dá à sua própria conta, com os seus pressupostos; a avaliação do Astra (F04) lembra que «justa» só se diz com um critério declarado. A última reconferência automática (01.09.2026) marcou o PDF como inacessível: o recibo pede uma leitura nova.

### 1.8 A dívida pública desce, e continua acima da União e dos 60 %

**A pergunta.** O Estado deve menos do que devia?

**O achado.** Em percentagem do PIB, a dívida pública desceu de 93,0 % em 2024 para 89,2 % em 2025 (`divida-publica-2024-notificacao-ine-2026-09`, `divida-publica-2025-notificacao-ine-2026-09`), com as contas do ano em excedente de 0,7 % do PIB (`saldo-das-administracoes-publicas-2025-notificacao-ine-2026-09`). Continua acima do valor de referência de 60 % (página do painel da Comissão, lida às 12:46 UTC: «general government sector debt in % of GDP with a threshold of 60%») e da União no seu conjunto: 81,7 % contra 89,7 % de Portugal, as duas pela notificação de abril (`divida-publica-2025-ue`, `divida-publica-2025`). O Conselho das Finanças Públicas apurou um crescimento da despesa líquida de 6,4 % em 2025, «superando em 1,4 p.p. a taxa de crescimento de 5% recomendada» (`crescimento-da-despesa-liquida-2025`). Quer dizer: por cada 100 € que o país produziu em 2025, o Estado devia 89,2 €.

**As linhas.** As seis acima e `divida-publica-2024` (93,5 %).

**Porque é honesta.** A descida lê-se dentro da mesma notificação do INE, a de setembro; a comparação com a União lê-se dentro da mesma notificação do Eurostat, a de abril. Nunca se põe 89,2 ao lado de 81,7.

**O desenho.**

```
390 px
+====================================+
| A DÍVIDA PÚBLICA · % do PIB        |
|  93,0 o                            |
|        ·.                          |
|          ·.                        |
|            o 89,2                  |
|  2024       2025                   |
|  .......................... 60     |
|  valor de referência da Comissão   |
| União no conjunto, abril: 81,7     |
| (Portugal na mesma data: 89,7)     |
| Despesa: +6,4 %, recomendado 5 %   |
+====================================+

1 280 px
+===========================================================+==============================+
| A DÍVIDA PÚBLICA · % do PIB · INE, setembro de 2026       | COM A UNIÃO · Eurostat, abril|
| 100 .                                                     | Portugal  ########## 89,7    |
|  90 .  93,0 o···········o 89,2                            | União     #########  81,7    |
|  80 .                                                     | referência: 60               |
|  60 ...................................... referência     |                              |
|        2024              2025                             | Excedente de 2025: 0,7 % PIB |
+===========================================================+==============================+
```

**A ressalva.** É um rácio: desce quando a dívida desce ou quando o PIB cresce mais depressa, e a dívida em euros não está no livro-razão. O ano de 2024 foi revisto de 93,5 (Eurostat, abril, `divida-publica-2024`) para 93,0 (INE, setembro): a revisão faz parte do número e mostra-se. Excedente quer dizer que no ano entrou mais do que saiu; não quer dizer que a dívida foi paga. A notificação do Eurostat de 21.10.2026 (calendário do sítio) muda `divida-publica-2025`.

### 1.9 As câmaras: dez acima do limite legal da dívida, sete a pagar a mais de 90 dias

**A pergunta.** A minha câmara deve mais do que a lei deixa? Paga a tempo?

**O achado.** Em 2024, 10 das 308 câmaras deviam mais do que o limite legal, isto é, tinham índice de dívida acima de 150 (`indice-de-divida-limite-legal`), e uma não tinha valor publicado, Penedono (`penedono-indice-de-divida-2024`, «N.d.»). É a contagem que o sítio já faz pela chave de prova `camaras_acima_do_limite`, e a que refiz hoje sobre as linhas dá o mesmo. As mais longe do limite: Vila Real de Santo António, 419,5 (`vila-real-de-santo-antonio-indice-de-divida-2024`), Fornos de Algodres, 348,9 (`fornos-de-algodres-indice-de-divida-2024`), Vila Franca do Campo, 304,4 (`vila-franca-do-campo-indice-de-divida-2024`), e Cartaxo, 274,1 (`cartaxo-indice-de-divida-2024`). A câmara do meio da lista estava em 27,3 (derivado, por selar: mediana das 307 linhas com valor). Em dezembro de 2025, 7 câmaras demoravam mais de 90 dias a pagar aos fornecedores e 21 mais de 60; Setúbal, 174 dias (`setubal-prazo-medio-de-pagamento-2025-12`); metade das câmaras com valor pagava em 15 dias ou menos; 9 não tinham valor publicado (derivado, por selar: contagens e mediana sobre as 308 linhas `<concelho>-prazo-medio-de-pagamento-2025-12`). Quer dizer: a grande maioria das câmaras deve bem menos do que a lei permite e paga em poucas semanas; um grupo pequeno está muito longe disso.

**As linhas.** As 307 linhas `<concelho>-indice-de-divida-2024` e `evora-indice-de-divida-2024` (105,5), a linha do limite, e as 308 linhas do prazo médio de dezembro de 2025.

**Porque é honesta.** O mesmo ficheiro da DGAL, a mesma coluna para todas as câmaras (a coluna (5), a dívida que a lei compara com o limite), o mesmo ano; o prazo médio vem da mesma lista, na mesma data. O limite de 150 é da lei (artigo 52.º da Lei n.º 73/2013, pelo quadro da DGAL que a linha do limite cita): aqui a fonte julga, e a cor é permitida no índice.

**O desenho.**

```
390 px
+====================================+
| AS CÂMARAS · dívida em 2024        |
| 10 de 308 acima do limite da lei   |
| 0        150        300      420   |
| oooooooooo|o o o  o   o        o   |
|           limite                   |
| [ A minha câmara ____________ ]    |
|                                    |
| Mapa pequeno, duas cores: acima do |
| limite / dentro; cinzento: sem     |
| valor.                             |
|                                    |
| PAGAR AOS FORNECEDORES · dez. 2025 |
| Metade paga em 15 dias ou menos.   |
| 7 demoram mais de 90. Sem cor.     |
+====================================+

1 280 px
+==============================+============================================================+
| MAPA · índice de dívida 2024 | 308 câmaras, cada uma um ponto                             |
| duas cores: acima de 150 /   | 0           100          200          300          400     |
| dentro; cinzento: sem valor  | oooooooooooooooooo|oo  o o    o          o             o   |
| Açores e Madeira à parte,    |                   limite da lei (150)                      |
| com a escala dita            | As dez acima, pelo nome e pelo valor, sem número de ordem  |
|                              | PRAZO DE PAGAMENTO · dez. 2025 · pontos sem cor            |
+==============================+============================================================+
```

**A ressalva.** A coluna (5) exclui dívidas que a lei deixa fora do limite. A dívida de hoje pode vir de mandatos anteriores. O limite é uma vez e meia a receita corrente média dos três anos anteriores: uma câmara pode passar o limite sem pedir dinheiro novo, só porque a receita desceu. Num concelho pequeno, um só empréstimo mexe muito o índice. Para o prazo médio não há, nas linhas, um valor de referência que se aplique à média (a lei fixa prazos para cada fatura `[verify]` no Decreto-Lei n.º 62/2013), e por isso o prazo não leva cor. Évora aparece «N.d.» na lista da DGAL de dezembro de 2025 (`evora-prazo-medio-de-pagamento-2025-12`) e com 137 dias na prestação de contas do município para 2025 (`evora-prazo-medio-de-pagamento-2025`): duas fontes, duas medições; nenhuma substitui a outra.

### 1.10 O concelho do meio fica em 79,64, com o país em 100

**A pergunta.** A minha terra é mais rica ou mais pobre do que a média do país?

**O achado.** Em 2023 só 31 dos 308 concelhos tinham poder de compra por habitante acima da média nacional, 100 (derivado, por selar: contagem sobre as 307 linhas `<concelho>-poder-de-compra-2023` e `evora-poder-de-compra-2023`). No topo, Lisboa, 181,35 (`lisboa-poder-de-compra-2023`), Porto, 162,18 (`porto-poder-de-compra-2023`), Oeiras, 150,05 (`oeiras-poder-de-compra-2023`); na base, Porto Moniz, 61,78 (`porto-moniz-poder-de-compra-2023`), Ponta do Sol, 62,47 (`ponta-do-sol-poder-de-compra-2023`), Tabuaço, 63,53 (`tabuaco-poder-de-compra-2023`). O concelho do meio da lista estava em 79,64 (derivado, por selar: mediana). Quer dizer: a média do país é puxada para cima pelos concelhos grandes, e a maior parte dos concelhos fica abaixo dela.

**As linhas.** As 308 do poder de compra de 2023.

**Porque é honesta.** Um só estudo do INE, um só ano, um só índice; o 100 é a base que o próprio INE publica.

**O desenho.**

```
390 px
+====================================+
| PODER DE COMPRA · 2023             |
| Portugal = 100                     |
| 60        100              180     |
| ooooOOOOooo:oo o o  o         o    |
|      meio 79,64   Lisboa 181,35    |
| 31 de 308 acima de 100             |
| [ O meu concelho ___________ ]     |
| O meu concelho: um ponto cheio, os |
| do mesmo tamanho: pontos claros.   |
+====================================+

1 280 px
+==============================+============================================================+
| MAPA · duas classes em tons  | 308 concelhos, cada um um ponto                            |
| neutros: acima / abaixo de   | 60          90          120          150          180      |
| 100 (a base do INE)          | ooooOOOOOOOOOooo:oooo o  o   o   o       o       o         |
|                              | meio 79,64          Portugal = 100                         |
|                              | O meu concelho e o seu grupo de tamanho, destacados        |
+==============================+============================================================+
```

**A ressalva.** É um índice que o INE constrói a partir de vários indicadores, não um rendimento medido em euros `[verify]` no método do Estudo sobre o Poder de Compra Concelhio. Mede onde as pessoas vivem. A média nacional pesa pessoas, não concelhos, e por isso o concelho do meio fica abaixo de 100 sem erro nenhum. O estudo é bienal.

### 1.11 Cinco concelhos pagam, em média, mais do que Lisboa

**A pergunta.** Onde se ganha mais por mês?

**O achado.** Em 2024 o ganho médio mensal de quem trabalha por conta de outrem a tempo completo era mais alto em Alcochete, 2 497,8 € (`alcochete-ganho-medio-mensal-2024`), Castro Verde, 2 346,4 € (`castro-verde-ganho-medio-mensal-2024`), Vila do Porto, 2 223,1 € (`vila-do-porto-ganho-medio-mensal-2024`), Oeiras, 2 214,4 € (`oeiras-ganho-medio-mensal-2024`), e Sines, 2 189,5 € (`sines-ganho-medio-mensal-2024`), do que em Lisboa, 2 120,9 € (`lisboa-ganho-medio-mensal-2024`); o mais baixo era Penedono, 1 034,1 € (`penedono-ganho-medio-mensal-2024`). O valor do país era 1 576,0 € (`ganho-medio-mensal-2024`), e só 20 concelhos ficavam acima dele (derivado, por selar). Quer dizer: o que se ganha num concelho depende muito de quem lá emprega; um concelho pequeno com um grande empregador pode pagar mais, em média, do que a capital.

**As linhas.** As 308 do ganho médio de 2024 e a nacional.

**Porque é honesta.** A mesma fonte (os Quadros de Pessoal do GEP do Ministério do Trabalho, redifundidos pelo INE), o mesmo ano, a mesma população.

**O desenho.**

```
390 px
+====================================+
| ONDE SE GANHA MAIS · 2024          |
| Ganho médio por mês, a tempo       |
| completo, no concelho onde se      |
| trabalha                           |
| Alcochete        2 497,8 €         |
| Castro Verde     2 346,4 €         |
| Vila do Porto    2 223,1 €         |
| Oeiras           2 214,4 €         |
| Sines            2 189,5 €         |
| Lisboa           2 120,9 €         |
| ...                                |
| Penedono         1 034,1 €         |
| País             1 576,0 €         |
+====================================+

1 280 px
+===========================================================+==============================+
| ONDE SE GANHA MAIS · 2024 · pelo concelho onde se trabalha| Sem mapa: um mapa desta      |
| 1 000 €     1 500 €      2 000 €      2 500 €             | medida lê-se como «onde se   |
| oooOOOOOOOOOOooo:oo o  o   o  o o o   o                   | vive melhor», e não é isso.  |
|                 país 1 576,0                              |                              |
| Os cinco de cima e os cinco de baixo, pelo nome           |                              |
+===========================================================+==============================+
```

**A ressalva.** Conta o concelho onde se trabalha, não onde se vive; por isso não se põe ao lado do poder de compra, que conta onde se vive e é de 2023. É uma média, puxada pelos salários altos; a mediana não está no livro-razão. É bruto. Deixa de fora quem trabalha a tempo parcial e os independentes; a cobertura da função pública pelos Quadros de Pessoal é `[verify]`. A causa de cada caso não está nos dados e não se escreve.

### 1.12 As regiões: 74 pontos de um lado ao outro do Tejo

**A pergunta.** Quanto falta a cada região para chegar à média europeia?

**O achado.** Em 2024, medido em poder de compra, o PIB por habitante de Portugal era 82 % do da União (`pib-pc-portugal-2024`). A Grande Lisboa estava em 129 (`pib-pc-grande-lisboa-2024`) e a Península de Setúbal, do outro lado do rio, em 55 (`pib-pc-peninsula-de-setubal-2024`): 74 pontos de distância (`distancia-setubal-grande-lisboa-2024`). Algarve 89, Madeira 88, Alentejo 77, Açores 73, Norte 71, Centro 71, Oeste e Vale do Tejo 65 (as linhas `pib-pc-<região>-2024`). O Alentejo estava em 78 em 2000 (`pib-pc-alentejo-2000`): em 24 anos, a distância à União passou de 22 para 23 pontos (`distancia-alentejo-ue27-2000`, `distancia-alentejo-ue27-2024`).

**As linhas.** As onze de 2024, as duas de 2000 e as duas de distância.

**Porque é honesta.** A mesma tabela do Eurostat, a mesma unidade (índice em paridades de poder de compra, União = 100), o mesmo ano; 2000 e 2024 vêm da mesma série, pedida com os códigos das regiões de hoje.

**O desenho.**

```
390 px
+====================================+
| AS REGIÕES · 2024 · União = 100    |
| Grande Lisboa     ############ 129 |
| Algarve           ########:     89 |
| Madeira           ########:     88 |
| Portugal          ########:     82 |
| Alentejo          #######:      77 |
| Açores            #######:      73 |
| Norte             #######:      71 |
| Centro            #######:      71 |
| Oeste e V. Tejo   ######:       65 |
| Pen. de Setúbal   #####:        55 |
|                         : 100      |
| Produção por habitante, não o que  |
| as famílias ganham.                |
+====================================+

1 280 px
+==============================+============================================================+
| MAPA DAS NOVE REGIÕES        | 50          70          90          110          130      |
| com o valor escrito em cada  |    o         oo    o o  ooo   :                   o        |
| uma; sem cor de juízo: o 100 | Setúbal 55   Norte e Centro 71 · Portugal 82 · Lisboa 129 |
| é a base, não uma meta       | : = 100 (a base) · no Alentejo, 2000 > 2024: 78 > 77       |
+==============================+============================================================+
```

**A ressalva.** O PIB conta-se onde se produz e as pessoas contam-se onde vivem: quem mora na Península de Setúbal e trabalha em Lisboa faz subir um número e descer o outro. Os 74 pontos dizem onde está a produção, não quem vive melhor. O rendimento disponível das famílias por habitante existe numa outra tabela do Eurostat, nama_10r_2hhinc, que o livro-razão ainda não tem: em 2023, em poder de compra por habitante, Península de Setúbal 17 500, Grande Lisboa 21 600, Portugal 17 900, União 21 000 (https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nama_10r_2hhinc?format=JSON&lang=EN&geo=PT1A&geo=PT1B&geo=PT&geo=EU27_2020&sinceTimePeriod=2022, lida às 13:06 UTC). Dois pontos, 2000 e 2024, não mostram o caminho entre eles; a série inteira deve estar na resposta que o motor já pediu com `sinceTimePeriod=2000` `[verify]`.

### 1.13 Creche e escola: dois números do lado certo da meta europeia

**A pergunta.** Como estamos na creche e na escola, comparados com a Europa?

**O achado.** Em 2025, 57,9 % das crianças com menos de 3 anos estavam numa creche ou noutro cuidado formal (`criancas-em-creche-2025`; 59,4 % em 2024, `criancas-em-creche-2024`), acima da União, 40,5 % (`criancas-em-creche-2025-ue`), e da meta europeia para 2030, 45 % (Recomendação do Conselho 2022/C 484/01, citada no glossário do Eurostat, https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Glossary:Children_in_formal_childcare_or_education, lido às 12:47 UTC). E 6,1 % dos jovens de 18 a 24 anos tinham saído cedo da escola (`abandono-escolar-precoce-2025`; 6,6 % em 2024, `abandono-escolar-precoce-2024`), abaixo da União, 9,1 % (`abandono-escolar-precoce-2025-ue`), e da meta de menos de 9 % («less than 9% by 2030», https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Early_leavers_from_education_and_training, lido às 12:46 UTC). Quer dizer: mais de metade das crianças pequenas tem lugar num cuidado formal, e só 6 em cada 100 jovens estão fora da escola e da formação sem terem ido além do 3.º ciclo.

**As linhas.** As seis acima.

**Porque é honesta.** As mesmas tabelas, o mesmo ano, em Portugal e na União. As metas são do Conselho e da União: aqui a fonte julga, e a cor é permitida.

**O desenho.**

```
390 px
+====================================+
| CRECHE E ESCOLA · 2025             |
| Crianças com menos de 3 anos em    |
| cuidado formal                     |
| ##########:#!###       57,9 %      |
|  : União 40,5   ! meta 45          |
| Jovens que saíram cedo da escola   |
| ######   !:             6,1 %      |
|  ! meta: menos de 9                |
|  : União 9,1                       |
+====================================+

1 280 px
+============================================+=============================================+
| CRECHE · menos de 3 anos · 2025            | SAÍDA CEDO DA ESCOLA · 18 a 24 anos · 2025  |
| (cada # = 2 %)                             | (cada # = 0,5 %)                            |
| ####################:#!#######  57,9 %     | ############      !:     6,1 %              |
| : União 40,5     ! meta 45 (cor: acima)    | ! meta: menos de 9 · : União 9,1 (cor)      |
+============================================+=============================================+
```

**A ressalva.** «Formal» conta qualquer número de horas por semana; em 2023 o Eurostat definiu outra medida, com um patamar de 25 horas, para acompanhar a meta (notícia do Eurostat, https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20250930-2, lida às 12:47 UTC). Se a meta se mede na outra medida, o desenho tem de a usar `[verify]`. A creche diz acesso, não qualidade. As duas medidas vêm de inquéritos, e a descida de 59,4 para 57,9 pode ser ruído de amostra.

## 2. A União como régua

### 2.1 Onde a média basta, e qual média

As linhas `-ue` são a União no seu conjunto (o agregado EU27_2020), em que cada país pesa pelo seu tamanho. Basta quando a pergunta é «Portugal está como a Europa no seu conjunto?» e nenhuma fonte julga: a inflação harmonizada, o investimento em percentagem do PIB, as licenças de construção, as duas medidas de perceção (corrupção e independência da justiça), e as necessidades médicas não satisfeitas se não forem um dos indicadores que o Painel Social classifica `[verify]`. Nestas diz-se «acima» ou «abaixo» da União, e mais nada.

Mas o conjunto não é o país típico, e às vezes a diferença é grande. Com os 27 valores lidos hoje (derivado, por selar: medianas minhas sobre as respostas da secção 2.3):

| Medida (2025) | A União no seu conjunto | O país do meio dos 27 | Portugal |
|---|---|---|---|
| Inquilinos a preço de mercado com a casa acima de 40 % | 18,6 | 23,2 | 27,2 |
| Dívida pública, % do PIB | 81,7 | 59,3 | 89,7 |
| Desemprego | 6,0 | 6,0 | 6,0 |
| Inflação harmonizada, agosto de 2026 | 3,2 | 3,2 | 3,6 |
| Preços das casas, subida | 5,5 | 7,3 | 17,6 |

E há uma terceira média: o Painel Social da Comissão compara cada país com a média simples dos Estados-Membros («how many standard deviations it deviates from the (unweighted) average», anexos do COM(2025) 958, lidos às 12:48 UTC). Proposta: o sítio dá-lhes três nomes e nunca as troca: «a União no seu conjunto», «a média simples dos 27», «o país do meio».

### 2.2 Onde o melhor e o pior importam, e o que «melhor» quer dizer

Há três regimes, e a regra 4 aplica-se de maneira diferente em cada um.

**A fonte fixa um valor.** Os 13 limiares do painel da Comissão, que li hoje na página oficial (às 12:46 UTC): balança corrente, +6 % e −4 %; posição de investimento internacional, −35 %; taxa de câmbio real, ±3 % na área do euro; quota nas exportações, −3 %; custo unitário do trabalho, +9 % na área do euro; dívida pública, 60 %; dívida das famílias, 55 %; dívida das empresas, 85 %; crédito às famílias, 14 %; crédito às empresas, 13 %; preços da habitação, 9 %; desemprego, 10 %; taxa de atividade, −0,2 pontos. As metas da União para 2030: emprego 78 %; menos 15 milhões de pessoas em risco de pobreza ou exclusão; abandono escolar abaixo de 9 %; creche 45 %; competências digitais básicas em 80 % dos adultos («at least 80% of all adults», https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Towards_Digital_Decade_targets_for_Europe, lido às 12:47 UTC); investigação e desenvolvimento em 3 % do PIB (https://ec.europa.eu/eurostat/statistics-explained/index.php?title=R%26D_expenditure, lido às 12:47 UTC). E as metas que Portugal fixou para si: emprego 80,0 %, formação de adultos 60,0 %, menos 765 mil pessoas em risco de pobreza ou exclusão (anexo 1 do COM(2025) 958). Aqui «melhor» quer dizer do lado certo do valor, no sentido que a fonte fixa, e diz-se com as palavras dela: «dentro do limiar da Comissão», «acima da meta europeia». Os extremos continuam a ser «o valor mais alto» e «o mais baixo»: a Finlândia com os preços das casas a descer 2,3 % não é «a melhor».

**A fonte julga por posição.** O Painel Social classifica cada país em sete classes, de «best performers» a «critical situations», pelo nível e pela mudança num ano, em desvios à média simples (anexos do COM(2025) 958). É a Comissão a julgar, e o sítio pode citar a classe de Portugal em cada indicador com o excerto do relatório; não deve calcular classes suas. A classe de Portugal em cada indicador está no relatório principal, que não li `[verify]`.

**Ninguém julga.** Inflação, PIB por habitante, investimento, salário mínimo em euros, as medidas de perceção: só «o valor mais alto», «o mais baixo», e o leitor julga.

O melhor e o pior importam quando a pergunta é «até onde pode ir?» e quando um par ajuda a ler. Proposta de desenho fixo, escolhido antes de ver os dados: mostram-se sempre, pelo nome, o valor mais alto e o mais baixo, Portugal, a União no seu conjunto e a Espanha, o vizinho, e nunca um país escolhido depois de ver onde ficou.

### 2.3 Os dados que isto pede, e o pedido de exemplo

**O pedido de exemplo.** `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/tessi164?format=JSON&lang=EN&tenure=RENT_MKT&time=2025`, feito às 12:39:10 UTC (13:39 em Lisboa). Resposta HTTP 200, 6 184 bytes, conjunto atualizado pelo Eurostat a 17.09.2026. Os 27 valores vêm todos: do mais baixo, Finlândia 12,3, ao mais alto, Roménia 56,0; Portugal 27,2, igual à linha `sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025`; a União 18,6, igual à linha `-ue`. Vêm também a área do euro com 20 e com 21 países, a Noruega, a Sérvia e a Turquia. Três valores trazem sinal: a Dinamarca e o Luxemburgo «b» (quebra de série) e a Lituânia «p» (provisório).

**Doze pedidos mais, com o ano fixo**, entre as 12:39:33 e as 12:39:36 UTC, pelo mesmo endereço base: vêm os 27 na dívida pública (tipsgo10), no desemprego (une_rt_a), na inflação harmonizada de agosto de 2026 (prc_hicp_minr), nos preços das casas (tipsho20), na creche (tepsr_sp210), no risco de pobreza ou exclusão (tipslc10), no rácio S80/S20 (tessi180), no emprego (lfsi_emp_a), no PIB real por habitante (tipsna40) e nas necessidades médicas (tespm110). Vêm 26 no abandono escolar (edat_lfse_14; falta o Luxemburgo) e 22 no salário mínimo (earn_mw_cur; faltam a Dinamarca, a Itália, a Áustria, a Finlândia e a Suécia, que «As of 1 July 2026» não tinham salário mínimo nacional, https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Minimum_wage_statistics, lido às 13:01 UTC).

**O que pede, em concreto.** Para cada uma das 29 famílias com linha da União, e para as nove do Eurostat que ainda não a têm (crédito malparado, quota nas exportações, crédito às empresas, posição de investimento internacional, balança corrente, saldo das administrações públicas, disparidade salarial, linha de pobreza, salário mínimo), um pedido por período sem filtro de país, selado como hoje se sela uma linha: os 27 valores, os agregados, os sinais e o resumo da resposta. São 1 566 valores para as 29 famílias em dois anos (derivado: 29 × 27 × 2). E quatro tabelas que tornam a régua honesta: a distribuição por regime de ocupação (ilc_lvho02), para saber o tamanho de cada grupo; o PIB e o consumo por habitante em poder de compra (prc_ppp_ind); o salário mínimo em poder de compra (earn_mw_cur com `currency=PPS`); a linha de pobreza em poder de compra (ilc_li01, na unidade PPS).

### 2.4 O desenho de «onde Portugal fica»

Uma faixa com 27 pontos num eixo, a mesma em todas as medidas. Portugal cheio e com nome; a União no seu conjunto como um traço; o país do meio como outro traço, com o nome dito; o limiar ou a meta só onde uma fonte os fixa, com o nome de quem fixou; os valores com sinal («p», «b», «u», «e») em ponto vazio, com a legenda; os países em falta escritos por baixo. Nenhum número de ordem; a frase conta: «há 6 países com valor mais alto e 20 com valor mais baixo» (derivado, por selar, para os inquilinos de 2025).

```
390 px
+====================================+
| INQUILINOS A PREÇO DE MERCADO COM  |
| A CASA ACIMA DE 40 % · 2025        |
| 12,3                        56,0   |
| Finlândia                 Roménia  |
| oo.ooo:oo:ooo●oooo.o.oo      o     |
|       :  :   Portugal 27,2         |
|  União 18,6  país do meio 23,2     |
| Espanha 26,8                       |
| 6 países acima, 20 abaixo.         |
| [ Ver os 27 ]                      |
| o vazio: provisório ou quebra      |
+====================================+

1 280 px
+===========================================================================================+
| INQUILINOS A PREÇO DE MERCADO COM A CASA ACIMA DE 40 % DO RENDIMENTO · 2025 · 27 países  |
| 10 %         20 %          30 %          40 %          50 %          60 %                 |
|  o o ooo o ooooo:oo oooo o:oo●o o   o  o  o                          o                    |
|  Finlândia 12,3  :         : Portugal 27,2                            Roménia 56,0         |
|           União 18,6   país do meio 23,2      Espanha 26,8                                 |
|  o vazio: Dinamarca e Luxemburgo (quebra de série), Lituânia (provisório)                 |
|  Na Roménia, os inquilinos a preço de mercado são 2,3 % da população.                     |
+===========================================================================================+
```

### 2.5 As armadilhas

- **O Luxemburgo e a Irlanda nas medidas do tipo PIB.** Em 2024, o PIB por habitante em poder de compra era 242 no Luxemburgo e 211 na Irlanda (União = 100), mas o consumo individual efetivo por habitante era 141 e 99; Portugal, 82 e 85, os dois estimados (prc_ppp_ind, https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_ppp_ind?format=JSON&lang=EN&na_item=VI_PPS_EU27_2020_HAB&ppp_cat=GDP&ppp_cat=A01&time=2024, lido às 12:40 UTC). O PIB diz quanto se produz; para «como vivem as pessoas» usa-se o consumo.
- **Países em falta.** Pedir com o ano fixo mostra quem falta: o Luxemburgo no abandono escolar de 2025, cinco países no salário mínimo. Nunca se preenche com o ano anterior sem o dizer.
- **Anos diferentes.** O último ano muda de família para família (a investigação vai em 2024, o inquérito às condições de vida em 2025, a inflação em agosto de 2026). Uma faixa só leva um ano.
- **Provisórios, estimados e quebras.** Hoje: «b» na Dinamarca e no Luxemburgo e «p» na Lituânia no inquérito de 2025; «u» (pouco fiável) na Croácia no abandono escolar; «d» (definição diferente) em Espanha e França no inquérito ao emprego; «p» na Hungria e em Malta e «ep» na Grécia nos preços das casas; «e» em Portugal nos valores em poder de compra de 2024. O sinal vai para a linha e para o desenho.
- **Bases que mudam.** A tabela do PIB real por habitante (tipsna40) foi atualizada hoje às 11:00 (hora de Bruxelas) e passou a trazer duas unidades: volumes encadeados de 2015 (Portugal 2025: 20 600, União 31 890, os valores das linhas) e de 2020 (Portugal 22 560, União 34 200). O endereço das linhas não filtra a unidade, e o painel semanal de hoje marcou as três linhas «inacessivel»; a coincidência sugere a causa (inferência minha). Correção proposta: acrescentar `unit=CLV15_EUR_HAB` ao endereço, ou passar as três linhas à base de 2020 com uma correção declarada.
- **Euros e poder de compra.** No segundo semestre de 2026, em euros, o salário mínimo português (1 073, igual à linha `retribuicao-minima-mensal-doze-meses-2026`) é igual ao grego e acima do romeno (825); em poder de compra, a Roménia (1 317) fica acima de Portugal (1 240) (earn_mw_cur em EUR e em PPS, lidos às 12:39 e às 12:50 UTC). A ordem muda com a unidade.
- **Grupos pequenos nos extremos.** O valor mais alto dos inquilinos, 56,0 na Roménia, diz respeito a 2,3 % da população romena (ilc_lvho02, lido às 12:40 UTC).
- **Agregados que mudam de composição.** A área do euro passou de 20 a 21 países em 2026; a régua usa só a União a 27 (EU27_2020).
- **Médias que não são a mesma.** Secção 2.1.

## 3. Os concelhos

### 3.1 As oito medidas, com a data de cada uma

População residente de 2025 (INE, estimativas anuais); poder de compra por habitante de 2023 (INE, estudo bienal); ganho médio mensal de 2024 (Quadros de Pessoal, via INE); empresas de 2024 (INE); desemprego registado em dezembro de 2025 (IEFP no continente, 278 linhas; DRQPE nos Açores, 19; IEM na Madeira, 11); dívida total e limite da dívida de 2024 (DGAL), de que sai o índice de dívida (derivado; o teto de 150 é da lei); prazo médio de pagamento a 31.12.2025 (DGAL). Em Évora, quatro destas estão nos estudos de Évora (`evora-populacao-2025`, `evora-poder-de-compra-2023`, `evora-empresas-2024`, `evora-indice-de-divida-2024`). São quatro datas diferentes, e é a primeira coisa que a página de um concelho tem de dizer.

### 3.2 O que permitem

**Por habitante, só no mesmo ano.**
- Desempregados registados em dezembro de 2025 por 100 pessoas dos 15 aos 64 anos: pede as linhas por idade da mesma tabela do INE (a população por ciclos de vida) e que a estimativa anual seja a 31 de dezembro, a mesma data da contagem do IEFP `[verify]`. Não é uma taxa de desemprego (o denominador não é a população ativa), e a página di-lo.
- Dívida por habitante e empresas por mil habitantes: pedem a população de 2024, da mesma tabela, um ano mais (308 linhas). Com a de 2025, os anos não batem: recusa-se.
- O poder de compra já é por habitante, o ganho já é por trabalhador, e o prazo médio não tem denominador.

**Entre concelhos de tamanho parecido.** Escalões fixados agora, antes de olhar para qualquer medida através deles: menos de 5 000 habitantes; 5 000 a 19 999; 20 000 a 49 999; 50 000 a 99 999; 100 000 ou mais. Com a população de 2025 ficam 50, 134, 60, 39 e 25 concelhos (derivado, por selar). O grupo de um concelho é o seu escalão; querendo, dentro da mesma região NUTS II.

**O mapa com uma medida.** Só medidas com um valor de referência publicado, e com poucas cores: o índice de dívida (a lei, 150) em duas cores e cinzento para «N.d.»; o poder de compra (a base 100 do INE) em duas classes, em tons neutros, sem uma escala que sugira juízo. As razões por habitante, quando existirem, não têm referência publicada: vão numa faixa de pontos e não num mapa colorido. Contagens (pessoas, empresas, desempregados) nunca num mapa colorido. O ganho médio nunca em mapa (é do local de trabalho).

**A posição entre pares, sem ranking.** O concelho é um ponto cheio entre os pontos do seu escalão; o valor do meio do grupo é um traço (linha derivada); a frase diz «acima do valor do meio do grupo» ou «abaixo», e nunca «12.º de 39».

**O que já está dentro dos ficheiros selados, sem recolha nova.**
- IEFP: três pares de colunas que somam o total. Em Abrantes, 555 + 603, 737 + 421 e 129 + 1 029 dão 1 158 (`abrantes-desemprego-registado-2025-12`). Pela ordem habitual do quadro, são o sexo, o tempo de inscrição (menos de um ano, um ano ou mais) e a procura de primeiro ou de novo emprego `[verify]` nos cabeçalhos. Dá, por concelho, a parte inscrita há um ano ou mais.
- DGAL, prazo médio: cinco colunas por câmara, a última a 31.12.2025 (Setúbal 137, 172, 177, 181, 174, `setubal-prazo-medio-de-pagamento-2025-12`); as quatro de antes serão os fins de trimestre anteriores `[verify]`. Uma tendência curta sem pedir nada novo.
- DGAL, dívida: a coluna com as exceções (Vila Real de Santo António, 125 209 734 contra 124 229 292 na coluna (5), `vila-real-de-santo-antonio-divida-dgal-2024`), que o sítio já decidiu não usar para o limite.

### 3.3 O que não permitem

- Tendências, fora de Évora e dos trimestres do prazo médio.
- Causas, e juízos sobre a gestão de uma câmara.
- Pôr lado a lado medidas de geografias diferentes (o ganho conta onde se trabalha, o poder de compra onde se vive) ou de anos diferentes.
- Concelhos pequenos lidos como grandes: o Corvo tem 434 residentes (`corvo-populacao-2025`), 5 desempregados registados (`corvo-desemprego-registado-2025-12`) e 89 empresas (`corvo-empresas-2024`); Barrancos tem 1 413 (`barrancos-populacao-2025`); 50 concelhos têm menos de 5 000 pessoas. Uma razão salta com uma pessoa ou com um empréstimo.
- Ler «N.d.» como zero: Penedono não tem dívida nem limite em 2024; nove câmaras não têm prazo médio em dezembro de 2025 (Aljezur, Aljustrel, Almada, Batalha, Évora, Moimenta da Beira, Pedrógão Grande, Penedono e Trancoso).
- Comparar sem dizer o desemprego registado dos Açores e da Madeira com o do continente: são três serviços diferentes, e a comparabilidade entre eles é `[verify]`.
- Dizer alguma coisa sobre as pessoas a partir do concelho (secção 6).

### 3.4 O desenho

A página de um concelho, por ordem: o nome, a população e o escalão; as medidas uma a uma, cada uma com a faixa do seu grupo; o que o concelho não tem (rendas, saúde, escolas, séries), dito numa frase; e, onde há, o estudo aprofundado.

```
390 px
+====================================+
| ÉVORA · distrito de Évora          |
| 58 567 residentes (2025)           |
| Grupo: 50 000 a 99 999 habitantes  |
|                                    |
| PODER DE COMPRA · 2023    111,47   |
| Portugal = 100                     |
|  o o oo:o o ● o   o  o             |
|  ● Évora  o o grupo  : 100         |
|                                    |
| DÍVIDA DA CÂMARA · 2024   105,5    |
| limite da lei 150                  |
|  oo o o ●o    |                    |
|                                    |
| PAGAR AOS FORNECEDORES · dez. 2025 |
|  A DGAL não publicou valor.        |
|                                    |
| (as outras medidas, uma a uma)     |
|                                    |
| O que não há aqui: rendas, saúde,  |
| escolas, evolução no tempo.        |
| Estudos sobre Évora: 6             |
+====================================+

1 280 px
+======================================================+=====================================+
| ÉVORA · 58 567 residentes (2025) · grupo 50 000 a    | MAPA pequeno: Évora e o seu distrito|
| 99 999 habitantes                                    |                                     |
| PODER DE COMPRA · 2023   o o oo:o o ● o   o   111,47 | ESTUDOS AQUI                        |
| DÍVIDA DA CÂMARA · 2024  oo o o ●o    |       105,5  | Évora 2027 · Prometido, Pago,       |
| GANHO MÉDIO · 2024 (onde se trabalha)  o o ● o  ...  | Auditado · Quinze Anos, Cinco       |
| DESEMPREGO REGISTADO · dez. 2025  (por 100 pessoas   | Mandatos (e os outros)              |
| dos 15 aos 64, quando houver as linhas)              |                                     |
| O que não há aqui: rendas, saúde, escolas, séries    | Dados: o ficheiro com as oito       |
|                                                      | medidas, datas e fontes             |
+======================================================+=====================================+
```

O número «Estudos sobre Évora: 6» é a linha `estudos-evora-publicados`.

## 4. A primeira página «O que se passa»

### 4.1 Os achados e a ordem

Quatro blocos, por esta ordem, com os dados de hoje:

1. **Os preços de agosto** (1.2). É o que muda todos os meses e toca toda a gente.
2. **A casa** (1.1 e 1.3): quem arrenda, 27,2 % contra 18,6 % na União, e a renda de 2027, que a regra da lei põe em 2,56 %, com a calculadora de uma linha. Está a tempo: o aviso oficial sai até 30.10.2026.
3. **O trabalho** (1.5): 79,6 % com emprego, contra 76,1 % na União; desemprego igual, 6,0 %.
4. **As contas do Estado** (1.8): dívida de 89,2 % do PIB, depois de 93,0 %; despesa líquida a crescer 6,4 %, acima dos 5 % recomendados. Outubro traz a notificação do Eurostat (21.10, calendário do sítio) e a proposta de Orçamento do Estado para 2027 `[verify]` a data.

Ficam fora da primeira página, e dentro das entradas: os preços das casas (A minha casa), a pobreza e a reforma antecipada (O meu dinheiro), as câmaras, os concelhos e as regiões (A minha terra), a creche e a escola. O salário médio (+5,1 % nominal num ano, derivado, por selar: (1 835 − 1 746) ÷ 1 746, com `remuneracao-bruta-mensal-media` e `remuneracao-bruta-mensal-media-periodo-anterior`) não entra ao lado dos preços: os períodos não batem (secção 6), e o leitor faria a conta errada.

### 4.2 O esboço

```
390 px
+====================================+
| O ESTADO DO PAÍS          [ Menu ] |
| O QUE SE PASSA · 28.09.2026        |
|                                    |
| 1 OS PREÇOS · agosto de 2026       |
| Subiram 3,30 % num ano; os         |
| combustíveis, 23,78 %.             |
| [ as cinco barras, marca de julho ]|
| > O meu dinheiro                   |
|                                    |
| 2 A CASA · 2025                    |
| Mais de 1 em cada 4 inquilinos a   |
| preço de mercado gasta mais de     |
| 40 % do rendimento na casa: 27,2 % |
| (União 18,6 %).                    |
| [ duas barras ]                    |
| A renda de 2027: a regra dá 2,56 % |
| [ 650 ] € > até 667 €              |
| > A minha casa                     |
|                                    |
| 3 O TRABALHO · 2025                |
| 79,6 % tem emprego (União 76,1 %). |
| [ barra com as metas ]             |
|                                    |
| 4 AS CONTAS DO ESTADO · 2025       |
| Dívida: 89,2 % do PIB (93,0 %      |
| em 2024). Referência: 60 %.        |
| [ inclinação e linha dos 60 ]      |
|                                    |
| PERGUNTAS                          |
| [O meu dinheiro] [A minha casa]    |
| [A minha saúde]  [A minha terra]   |
| [O Estado]                         |
|                                    |
| A MINHA TERRA                      |
| [ procurar concelho ___________ ]  |
| [ mapa pequeno: câmaras acima do   |
|   limite legal, 2024 ]             |
|                                    |
| NOVO ESTE MÊS (sozinho)            |
| O QUE CHEGA A SEGUIR (calendário)  |
| Mais fundo: Temas · Números e      |
| fontes · Estudos · Método          |
+====================================+

1 280 px
+===========================================================================================+
| O ESTADO DO PAÍS       Portugal · Lugares · Temas · Estudos · Sobre          [ procurar ] |
| O QUE SE PASSA · atualizado a 28.09.2026                                                  |
+=============================================================+=============================+
| 1 OS PREÇOS · agosto de 2026                                | NOVO ESTE MÊS               |
| Os preços subiram 3,30 % num ano; os combustíveis, 23,78 %. | 10.09 INE: preços de agosto |
| [ as cinco barras, marca de julho ]                         | 17.09 Eurostat: inflação    |
| [ Portugal e a União, índice harmonizado: 3,6 e 3,2 ]       |   harmonizada, linha de     |
|                                                             |   pobreza                   |
|                                                             | 23.09 INE: dívida e saldo   |
|                                                             | O QUE CHEGA A SEGUIR        |
|                                                             | 29.09 rendas por concelho   |
|                                                             | 21.10 dívida, Eurostat      |
|                                                             | 23.10 preços das casas por  |
|                                                             |   concelho                  |
+==============================+==============================+=============================+
| 2 A CASA · 2025              | 3 O TRABALHO · 2025          | 4 AS CONTAS DO ESTADO       |
| 27,2 % dos inquilinos a preço| 79,6 % com emprego           | Dívida 89,2 % do PIB        |
| de mercado acima de 40 %     | (União 76,1; meta UE 78;     | (93,0 em 2024; ref. 60)     |
| (União 18,6); todos: 6,3 %   | meta de Portugal 80)         | Despesa +6,4 % (rec. 5 %)   |
| Renda de 2027: até 2,56 %    | Desemprego 6,0 %, = União    | [ inclinação ]              |
| [ 650 ] € > até 667 €        | [ barra com as metas ]       |                             |
+==============================+==============================+=============================+
| O MEU DINHEIRO | A MINHA CASA | A MINHA SAÚDE | A MINHA TERRA | O ESTADO                   |
| em cada uma: um número de hoje e uma linha «o que ainda não há»                           |
+===========================================================================================+
| A MINHA TERRA  [ procurar concelho _________ ]    [ mapa: câmaras acima do limite, 2024 ] |
+===========================================================================================+
| Mais fundo: Temas · Números e fontes · Estudos · Método · Correções                       |
+===========================================================================================+
```

### 4.3 O que se atualiza sozinho

- **Os números, os gráficos e as datas** saem das linhas; quando uma linha muda, o bloco muda na construção seguinte.
- **Os verbos** («subiu», «desceu», «igual»; «acima da União», «abaixo»; «dentro do limiar», «fora») saem de uma regra de comparação declarada entre linhas, como já fazem as leituras do sítio (`src/data/leituras-rp1.mjs`).
- **A condição de verdade de cada bloco.** Cada bloco declara a relação que o torna verdadeiro; por exemplo, A casa: inquilinos em Portugal acima dos da União e população inteira abaixo. Se uma linha nova a quebra, o bloco sai da primeira página sozinho e espera por uma leitura escrita; nenhuma frase de interpretação é reescrita por uma máquina. É a separação entre a frescura dos dados e a frescura da leitura que a avaliação do Astra pede.
- **«Novo este mês»** sai do campo `published_at` das linhas. Hoje ele está vazio em muitas (todas as linhas do quadro institucional, por exemplo): é preciso preenchê-lo.
- **«O que chega a seguir»** sai de `src/data/calendario.json`: hoje, 29.09 rendas por concelho (INE), 21.10 notificação do Eurostat, 23.10 preços das casas por concelho (INE), 30.10 Empresas em Portugal (INE), 04.11 Estatísticas do Emprego do 3.º trimestre (INE). O calendário não tem o IPC mensal nem a inflação harmonizada, que alimentam o primeiro bloco: acrescentam-se, com as datas lidas no calendário do INE `[verify]`.
- **«O que mudou»** passa a ser sobre o país (linhas com período novo ou revisão), e o registo da manutenção do sítio vai para as correções e o método, como as duas avaliações pedem.
- **O ritmo** fica dito em cada bloco: mensal (preços), trimestral (salário, emprego trimestral quando houver as linhas), anual (inquérito às condições de vida, dívida duas vezes por ano, DGAL).

### 4.4 As entradas por pergunta da vida

| Entrada | O que pode mostrar hoje | O que ainda não pode |
|---|---|---|
| **O meu dinheiro** | Os preços de agosto e as componentes (1.2); o índice harmonizado e a União; o salário médio bruto do 2.º trimestre, 1 835 € (`remuneracao-bruta-mensal-media`, provisório), e o ganho médio de 2024, 1 576,0 €, com a diferença entre os dois explicada; o salário mínimo, 920 € (`retribuicao-minima-mensal-garantida-continente-2026`) e 1 073 € em 12 meses (`retribuicao-minima-mensal-doze-meses-2026`); a pensão média, 8 066 € por ano (`pensao-media-anual-2025`); a pobreza e a desigualdade (1.6); o RSI, 24,22 por mil pessoas em idade ativa (`beneficiarios-do-rsi-por-mil-2024`); a reforma antecipada (1.7) | O salário real ao longo do tempo (séries); quem ganha o salário mínimo; as faturas da energia e os combustíveis em euros; o salário líquido; a prestação da casa |
| **A minha casa** | Quem arrenda (1.1); a renda de 2027 (1.3); os preços das casas, o crédito e as licenças (1.4); a subida das rendas no IPC, 5,22 % | Rendas e preços por concelho (saem a 29.09 e a 23.10); a prestação da casa; quem é dono e quem arrenda (as quatro percentagens por selar) |
| **A minha saúde** | Uma medida: 2,5 % das pessoas disseram ter ficado sem cuidados médicos de que precisavam, contra 2,4 % na União (`necessidades-medicas-nao-satisfeitas-2025`, `-ue`); a página diz que é a única | Médico de família, tempos de espera, esperança de vida, mortalidade evitável, despesa em saúde; as fontes do SNS não estão na lista da regra 1, e pô-las lá é uma decisão |
| **A minha terra** | As oito medidas dos 308 concelhos (secção 3); as câmaras e a dívida (1.9); o poder de compra (1.10); o ganho (1.11); as regiões (1.12); os seis estudos de Évora | Tendências por concelho; valores por habitante (pedem a população de 2024); rendas, saúde e escolas por concelho |
| **O Estado** | A dívida, o saldo e a despesa (1.8); os 13 limiares da Comissão; as perceções da corrupção (56 contra 62 na União, `indice-de-percepcao-da-corrupcao-2025`, `-ue`) e da independência da justiça (58 contra 54, `independencia-da-justica-2025`, `-ue`), ditas como perceções; a dívida e os prazos das câmaras | Onde vai o dinheiro (despesa por função); os impostos; o Orçamento do Estado para 2027 (outubro) |

## 5. O que espera dados novos ou um estudo

### 5.1 O que pede as séries

A camada «a melhorar ou a piorar» inteira, e em particular: os preços em nível e não só em taxa (para «o que 100 € compravam»); o salário real (o salário médio dividido pelos preços, no mesmo trimestre); a pensão contra os preços; a dívida ao longo dos anos; as regiões de 2000 a 2024, cujos valores devem estar na resposta que o motor já guardou `[verify]`; os inquilinos e a pobreza desde o início do inquérito; e, nos concelhos, os cinco fins de trimestre do prazo médio (já no ficheiro selado), a dívida da DGAL de 2014 a 2024 para as 308 câmaras (os ficheiros anuais existem: Évora usa os de 2014, 2017, 2021 e 2024), a população de cada ano e o desemprego registado de cada mês. O ganho médio só tem quatro anos na nomenclatura atual, 2021 a 2024, pela nota da linha `ganho-medio-mensal-2024`.

### 5.2 O que pede os 27 países

As faixas «onde Portugal fica» (2.4) para as 29 famílias com linha da União e as nove sem ela; as quatro tabelas da régua honesta (2.3); e o salário mínimo em relação ao salário mediano, que o Eurostat publica: em 2024, o salário mínimo português era 69 % do salário bruto mediano, o valor mais alto da União («ranged from 44% (in Estonia) to 69% (in Portugal)», https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Minimum_wage_statistics, lido às 13:01 UTC). É um cálculo especial que o Eurostat diz não estar na base de dados em linha: sela-se como documento, com o excerto. A diretiva europeia sobre salários mínimos adequados traz valores de referência indicativos para este rácio `[verify]` no texto; se trouxer, é uma fonte que julga.

### 5.3 O que pede documentos

- **O salário mínimo e quem o ganha.** O decreto do valor de 2027 (Diário da República, em regra em dezembro `[verify]`); a parte dos trabalhadores que o ganha, pelos Quadros de Pessoal do GEP `[verify]` na publicação. Aviso: o Eurostat estima que, em 2022, só 3,1 % dos trabalhadores portugueses ganhavam menos de 105 % do salário mínimo, mas num âmbito restrito (empresas com 10 ou mais trabalhadores, 22 anos ou mais, sem a administração pública, sem horas extraordinárias; mesma página, lida às 13:01 UTC). O número nacional do GEP terá outro âmbito e outro valor `[verify]`: os dois nunca se põem lado a lado sem o âmbito escrito.
- **As faturas da energia.** As tarifas e o consumidor de referência da ERSE `[verify]`; a taxa do IPC para a energia de casa (1,36 %) não é uma fatura.
- **Os combustíveis em euros.** Os preços médios de venda ao público da DGEG `[verify]`, ao lado, e nunca misturados, com a taxa do IPC (23,78 %).
- **A prestação da casa.** As taxas de juro dos empréstimos novos à habitação do Banco de Portugal e a taxa de juro implícita e a prestação média do INE `[verify]`.
- **O salário líquido.** Pede as regras das contribuições e do IRS. A Autoridade Tributária não está na lista da regra 1: é uma decisão.

### 5.4 O que pede um estudo com pré-registo

Cada um com a pergunta, o método fixado antes de ver os dados e a condição de matar.

1. **Os salários acompanharam os preços?** Método: remuneração bruta média do INE, trimestral, comparada sempre com o mesmo trimestre do ano anterior (para não misturar subsídios sazonais); preços em nível (média dos três meses do IPC), nunca em taxa; salário real = salário ÷ preços, com a base na primeira data em que as duas séries existem na nomenclatura atual, regra escrita antes de ver a série; quebras desenhadas. Matar: se o INE assinalar uma quebra em qualquer das séries dentro da janela sem ponte oficial, não se publica uma linha única, só troços; se a remuneração só existir com componentes irregulares misturadas de maneira que muda de ano para ano, fica-se pela componente regular ou não se publica.
2. **Quem gasta mais de 40 % na casa?** Método: as divisões do Eurostat por regime de ocupação, rendimento (abaixo e acima da linha de pobreza), idade e tipo de agregado, para Portugal e para a União, no mesmo ano. Matar: as células de Portugal com sinal «u» não se publicam; se as que sobram não responderem à pergunta, diz-se isso.
3. **As regiões aproximam-se da União?** Método: PIB por habitante em poder de compra e rendimento disponível das famílias por habitante em poder de compra, por região, de 2000 (ou do primeiro ano comum) ao último; aproximar-se = a distância a 100 no fim menor do que no início, e a média das mudanças anuais do mesmo sinal, tudo fixado antes. Matar: se a série não estiver recalculada para as regiões de hoje em todos os anos, encurta-se a janela e diz-se; se as duas medidas disserem coisas opostas, publica-se a contradição e não uma conclusão.
4. **A dívida das câmaras desceu: o que aconteceu ao investimento?** (a relação que a avaliação do Opus propõe). Método: dívida da DGAL e despesa de capital, por câmara e por escalão de população, nos mesmos anos. Matar: a mudança de normas contabilísticas das autarquias por volta de 2020 `[verify]`; se partir a série de investimento, o estudo começa depois dela ou não começa.

**O explorador de 1981.** O estudo «Evolução de Portugal desde 1981» assenta na PORDATA, que não está na lista da regra 1, e tem uma só linha no livro-razão, com a fonte por confirmar (`saldo-natural-portugal-2025`). O «Cruzar» entra no sítio quando cada série vier da fonte primária (INE, Eurostat, Banco de Portugal); proposta: começar pelas séries que já têm par oficial conhecido (população, nascimentos, fecundidade, mortalidade infantil, emprego, desemprego, inflação, PIB por habitante).

## 6. Os riscos e as recusas

- **Períodos diferentes.** O salário médio do 2.º trimestre de 2026 contra a inflação de agosto de 2026: janelas diferentes, e a conta do salário real fica errada. A linha de pobreza «de 2025» (rendimento de 2024) contra o salário mínimo de 2026. A dívida das câmaras de 2024 dividida pela população de 2025. O poder de compra de 2023 ao lado do ganho de 2024. A taxa homóloga ao lado da média de 12 meses. As competências digitais, que o inquérito mede de dois em dois anos: o «ano anterior» de 2025 é 2023. Recusa-se tudo isto até haver o mesmo período.
- **Bruto e líquido.** O salário mínimo (920 € brutos) e o ganho médio (brutos) contra a linha de pobreza, que é rendimento disponível, líquido, por adulto equivalente. A linha do ganho já o escreve: «A fonte não permite comparar este valor com a retribuição mínima mensal garantida» (nota de `ganho-medio-mensal-2024`).
- **Média e mediana.** O ganho médio não é o que ganha a maioria: a média é puxada pelos salários altos, e a mediana não está no livro-razão. A linha de pobreza é 60 % do rendimento mediano. A média do poder de compra pesa pessoas, e o concelho do meio fica em 79,64. A «média da União» tem três sentidos (2.1).
- **O PIB lido como rendimento.** Nas regiões (Lisboa e Setúbal), no Luxemburgo e na Irlanda (2.5), e no próprio sítio: o cartão do PIB real por habitante põe 20 600 € ao lado de 31 890 € da União (`pib-real-per-capita-2025`, `pib-real-per-capita-2025-ue`, com a média europeia na leitura da medida). Volumes encadeados servem para comparar um país consigo ao longo do tempo; para comparar níveis entre países usa-se o poder de compra, em que Portugal está em 82 (juízo meu, pela natureza das duas unidades). Com duas bases desde hoje (2.5), o risco dobra.
- **A pensão média contra a linha de pobreza.** A pensão (8 066 € por ano, `pensao-media-anual-2025`) é bruta, individual, só da Segurança Social (o título do INE é «Valor médio das pensões da segurança social»), e a linha é rendimento líquido do agregado, por adulto equivalente, de outro ano. Muitos pensionistas vivem com outras pessoas e têm outros rendimentos. E há uma dúvida na própria linha: a unidade diz «€ por pensionista por ano», o título do INE diz «(€/ N.º)» de pensões; se o denominador for o número de pensões e não de pensionistas, a unidade está errada `[verify]` na metainformação do indicador 0014532 (o INE estava inacessível hoje).
- **Os concelhos pequenos.** Corvo, Barrancos, Lajes das Flores: razões que saltam com uma pessoa, índices que saltam com um empréstimo, médias de ganho feitas com poucos empregadores. Mostram-se, sempre com a população ao lado, e nunca como extremo de um mapa.
- **A falácia ecológica.** Uma relação entre concelhos (poder de compra e dívida, por exemplo) não diz nada sobre as pessoas que lá vivem. Não se desenha uma nuvem de pontos de concelhos com uma reta de tendência.
- **Dois índices de preços.** O IPC (3,30 %) e o índice harmonizado (3,6 %) são dois números certos para agosto; o IPC nunca se compara com o índice harmonizado da União.
- **Dois salários médios.** O ganho médio (1 576,0 €, Quadros de Pessoal, 2024, a tempo completo) e a remuneração bruta média (1 835 €, declarações à Segurança Social e à CGA, 2.º trimestre de 2026, todos os trabalhadores) medem coisas diferentes; lado a lado, o leitor lê uma subida que não existe.
- **Taxas, níveis e pontos.** Uma taxa homóloga que desce não quer dizer preços que descem; «pontos percentuais» não é «por cento» (a taxa de atividade da linha `taxa-de-actividade-2025` é uma mudança em pontos em três anos).
- **Posições que parecem veredictos.** «O segundo pior da União nos preços das casas» só se diz com uma fonte a julgar; a Comissão julga contra 9 %, não a ordem dos 27. Diz-se «só a Hungria teve uma subida maior».
- **Perceção lida como facto.** O índice de perceção da corrupção e a independência da justiça são perceções; o desenho e a frase dizem-no.
- **Andar junto não é causa.** O crédito e os preços das casas; as licenças e os preços; a dívida de Évora e os mandatos (a avaliação do Astra, F10, sobre as datas desalinhadas).
- **Provisórios, revistos e bases novas.** A remuneração do 2.º trimestre de 2026 é provisória (o excerto traz «Dado provisório»); a dívida das famílias da União passou hoje de 49,3 para 49,2 na fonte (painel semanal de 28.09.2026, `divida-das-familias-2025-ue`); a dívida pública de 2024 passou de 93,5 para 93,0; o PIB real por habitante ganhou hoje uma segunda base. A primeira página mostra o sinal e a data de cada valor.
- **O desemprego registado não é a taxa de desemprego.** Depende de quem se inscreve; dividido pela população não dá uma taxa.
- **Contar empresas.** A contagem do INE inclui empresas individuais `[verify]`; empresas por habitante não mede dinamismo.
- **A mesma precisão.** «6» ao lado de «6,0» (secção 1.5): o valor da linha deve escrever as casas decimais que a fonte imprime.
- **Recusas.** Um índice composto do «estado do país» (os pesos seriam uma escolha do projeto, sem fonte que a julgue, e o leitor não a pode discutir); «quantos anos de salário para comprar uma casa» (pede preço e rendimento da mesma geografia e do mesmo ano, que não existem hoje); um «salário mínimo líquido» calculado pelo sítio sem as regras oficiais seladas; e contagens do próprio sítio (estudos publicados, correções) na primeira página: são manutenção, e vão para as correções e o método.

Claude Opus 5.5 · 28.09.2026
