# V2-e: efeitos nas pessoas e nos serviços

Implementação concluída e conferida nas duas edições. Os resultados e as limitações estão registados abaixo.

## Medida de partida

`medir.py <motor>` lê o livro, guarda valores, períodos e unidades em `partida.json` e refaz as contas. A corrida inicial leu 156 linhas e refez 11 contas, sem divergências numéricas com o mandato. A contagem dos marcos usa as linhas do primeiro conjunto e do complemento: 37 marcos e metas, dos quais 24 completos.

A dívida a fornecedores é a soma das 53 entidades, convertida de euros para milhões e arredondada a uma casa decimal: 1 517,5. Os pagamentos em atraso das EPE são `dgo-atraso-45-p`, 689,9 milhões em agosto. A regularização acumulada é `dgo-regularizacao-ae`, 1 398,6 milhões até agosto. São três medidas distintas.

Os totais mensais dos três conjuntos hospitalares estão registados na partida. O campo metas.dcat.temporal do catálogo dos próprios conjuntos declara «valores acumulados». A definição está preservada em partida.json e conferida pelo extrator; a progressão dentro do ano e o reinício em janeiro também são verificados. O livro, as notas e as provas usam o período de janeiro ao mês de referência.

## Decisões

- **V2E-1.** Os 37 estados não estão todos no prefixo indicado no mandato. Cinco usam `prr-marcos-metas-2025-`; os restantes usam `prr-complemento-`. Os dois exemplos completos são os marcos 1.40 e 1.42.
- **V2E-2.** O montante do PRR por pagar é uma diferença financeira entre contratado e pago. Não demonstra que metade das obras fique por construir. As frases referem o contratado por pagar e não atribuem ao PRR uma conclusão física ou uma previsão para o ano seguinte.
- **V2E-3.** A eliminação de portagens e o apoio pelos descontos são matérias de diplomas diferentes. As frases apresentam ambas sem afirmar que o segundo diploma financia, por si só, a eliminação prevista no primeiro.
- **V2E-4.** O relatório não reconhece as pretensões dos parceiros privados. Isso não permite afirmar que nenhum orçamento inclui encargos relacionados com elas. A conclusão conserva apenas a distinção entre pedidos pendentes e encargos efetivos reconhecidos.
- **V2E-5.** Os encargos com medicamentos cresceram. As fontes não permitem concluir que os preços dos medicamentos cresceram na mesma proporção. As frases usam encargos, sem os substituir por preços.
- **V2E-6.** O resíduo do cabeçalho foi retirado da tarefa de Braga. A frase `pe-tc15-infracoes` já não tinha chamada de nota. O resíduo estava em `pe-tc15-futuros`, também corrigida, conservando o texto de extração anterior e a transformação conferida.
- **V2E-7.** Os valores do Infarmed são numéricos, com a unidade no campo próprio. O excerto conserva a forma impressa com M€. O painel do PRR conserva os tokens com unidades incorporadas; as contas usam leituras numéricas separadas e explicitadas.
- **V2E-8.** Os identificadores originais permanecem no motor e nos recibos de travessia. No sítio, os pontos e sublinhados tornam-se hífenes e as letras ficam minúsculas. Nenhum identificador de fonte é reconstruído.
- **V2E-9.** Os estados e excertos documentais ganham um tipo próprio, conferido contra a prova exportada. As citações só aceitam esse tipo para o excerto; a atribuição continua a exigir uma afirmação. Os períodos acumulados exigem o mês final e a correspondência com a prova. As alterações deliberadas de texto, fonte, período e conta são recusadas.
- **V2E-10.** As seis observações de profissionais apresentadas são de profissionais em exercício no mesmo ano. O conjunto dos últimos valores dos países contém outros anos e uma situação profissional diferente, pelo que a página não os transforma numa classificação homogénea nem inventa o agregado da União.
- **V2E-11.** As opiniões novas não atribuem aos intervenientes um silêncio sobre todo o debate. A conclusão fica limitada às afirmações citadas.

## Verificação anterior aos portões

A exportação comum atravessou 170 linhas com provas e recibos. A auditoria dos itens e a verificação dos dados passaram. Os 41 estragos dos efeitos foram detetados. O teste documental do motor passou com 62 conferências e mil linhas regeneradas.

Não houve publicação nem pedido de envio para o remoto.

## Decisões da verificação

- **V2E-12.** A definição de acumulado está no campo `metas.dcat.temporal`, embora não esteja na descrição geral. A partida recebeu esta confirmação sem alterar os valores lidos inicialmente. As seis linhas hospitalares guardam a definição e a prova do catálogo. Três plantas adicionais recusam uma definição temporal alterada.
- **V2E-13.** A construção revelou que a localização relativa das provas mudava no módulo compilado. A leitura usa agora a raiz do projeto e falha se o ficheiro estiver ausente.
- **V2E-14.** Um excerto longo não cabia no cartão de partilha. Os textos documentais usam no cartão o nome da família, nas duas edições, e conservam o excerto inteiro no recibo, em corpo de leitura. As guardas de tamanho dos cartões mantêm-se.

- **V2E-15.** Os nomes com códigos e períodos passam pela comparação integral com o nome bilingue da prova. As citações documentais preservam a ortografia da fonte, mantendo a conferência do valor. O teste recusa nomes alterados, códigos trocados, outra edição e falta de prova.
- **V2E-16.** Os três tokens do painel conservam a unidade incorporada, como o mandato exige. A forma impressa só passa com identificador e valor iguais aos da prova; um valor alterado ou outra identidade continuam recusados.
- **V2E-17.** As línguas dos títulos, rótulos, organismos e edições foram declaradas, e as unidades receberam tradução. A auditoria das famílias identifica explicitamente a própria linha que apoia cada frase.

- **V2E-18.** As linhas novas têm assuntos declarados por listas fechadas: Saúde, parcerias e observações estrangeiras. Seguem a regra de integração dos recibos da discussão, sem criar cartões ministeriais.
- **V2E-19.** A palavra completo designa aqui o estado dos marcos do PRR. A exceção da voz cobre apenas a frase dos dois exemplos na discussão; as plantas mantêm a recusa fora dessa rota e perante uma afirmação acrescentada sobre o sítio.
- **V2E-20.** A conferência das datas reconhece os acumulados apenas quando o período e o mês final correspondem à prova selada. As plantas recusam outro mês inicial, outro ano e outro mês de referência.

- **V2E-21.** A corrida inteira revelou integrações em falta nos verificadores dos recibos. Os títulos e descrições dos textos documentais usam o nome curto bilingue; o cartão só declara a unidade quando a desenha. As unidades das cento e setenta linhas entram no conjunto fechado, com seis plantas de troca e retirada nas duas edições. O localizador B68 da regularização tem nove plantas de origem. A lista dos campos inclui explicitamente o tipo documental. O texto da casa chama objetivo ao compromisso assistencial, preservando a designação da fonte no campo próprio.

- **V2E-22.** A transcrição portuguesa mantém a língua declarada também no campo de cópia e no código de incorporação, tanto no texto inicial como depois de receber os dados. A conferência recusa a remoção da língua; o navegador exerce a atualização real nas duas edições.

## Linhas e frases seladas

O inventário completo de identificadores do motor e do sítio, valores, unidades, períodos, nomes, excertos, derivações e provas está em [linhas-seladas.json](linhas-seladas.json). São 170 linhas novas; todos os seus recibos remetem para o item correspondente. Os estados do PRR contam 24 completos. A comparação com o HTML está em [render-conferido.json](render-conferido.json).

A célula dos itens terminou com 0 erros, 171 de 171 plantas detetadas e 646 portas de integração conferidas.

## Portões e capturas

Cabeça do código conferida: `e045033b1927a2883dc0eeecb00cd1fbefb91243`. Cabeça do motor: `7772f6ebd1a2e38004b5f1c3eae673832feac4dd`. O commit posterior deste relatório acrescenta apenas provas da corrida.

| Conferência | Código lido |
|---|---:|
| build | 0 |
| verify | 0 |
| typecheck | 0 |
| motor_precommit | 0 |
| series | 0 |
| cruzamento_com_origem | 0 |

A corrida padrão do escrivão usa a união conferida dos passos do `build` e do `verify`: o `build` paga os passos comuns e o `verify` corre os restantes. Não se usou o perfil reduzido V2-d. Os recibos da união e os códigos estão nesta pasta. O `core.gate` correu no pre-commit do motor; `motor-precommit.json` conserva o resultado.

As quatro primeiras tentativas de construção foram recusadas: carregamento da prova, tamanho de um cartão, marcação dos nomes e transcrições documentais, e assuntos das linhas no mapa interno. O `verify` ficou por correr nessas tentativas, com código de bloqueio. A quinta tentativa construiu o sítio mas o verify recusou cinco verificadores: vocabulário, índice, guardas, acessibilidade e rótulos. A sexta tentativa confirmou essas correções, mas conservou uma falha de língua no campo de cópia de código, corrigida pela V2E-22. A sétima corrida foi invalidada durante a construção para corrigir o encaminhamento do novo teste de incorporação e bloquear nele pedidos externos. Todas as tentativas e respetivos códigos estão em tentativas.json.

A travessia com origem deu código zero e um aviso sobre o resumo global do livro do estudo vinte, cujo campo built_at muda na reconstrução. A mesma conferência confirmou todos os resumos individuais das linhas e ficheiros. Este aviso não foi tratado como divergência de valores.

Foram capturadas 30 combinações de página, edição e largura, a 390, 768, 1024, 1280, 1600 píxeis, com recortes. O manifesto [capturas/capturas.json](capturas/capturas.json) guarda dimensões e resumos SHA-256. Nenhuma combinação tem rolagem horizontal, erro de navegador, recurso em falta ou pedido externo. Os PNG ficam locais, conforme a regra do repositório. A inspeção visual está em [inspecao-visual.json](inspecao-visual.json).

## Frases tal como renderizam

Os selos não entram nesta transcrição; espaços tipográficos consecutivos são normalizados na comparação. As palavras, números e excertos foram comparados com os parágrafos do HTML.

### PT

#### O orçamento da Saúde para 2027: 3,0 % sem PRR ou −1,5 % no total? As duas contas, o que muda por dentro e o que ficou por dizer

**Como foi dito**

«Ora, esta verba do PRR foi excecional. Se retirarmos isso, o orçamento da Saúde sobre 3%», António Leitão Amaro, ministro da Presidência, num documento publicado pela RTP, a 09.10.2026. No mesmo dia, a RTP publicou: «O orçamento para Saúde sofre um corte em 2027. Cai 1,5 por cento. Estão atribuídos 17 mil 858 milhões de euros. Menos 267,5 milhões do que este ano.» A 12.10.2026, Paula Santos · PCP disse: «O investimento sofre um corte brutal de 33,7%.»

**O que as fontes dizem**

O quadro 5.37 do relatório do Orçamento, o programa Saúde, em milhões de euros.

A despesa total consolidada passa de 18 125,9 em 2026 para 17 858,4 em 2027, uma variação de −1,5 %. A despesa efetiva consolidada passa de 18 062,4 para 17 803,1, −1,4 %. Sem o PRR, o Plano de Recuperação e Resiliência, a despesa efetiva consolidada passa de 17 291,3 para 17 803,1, 3,0 %.

Por dentro, a despesa com o pessoal passa de 7 783,1 para 8 184,3, 5,2 %; a aquisição de bens e serviços, a maior rubrica do programa, passa de 8 832,9 para 8 436,3, −4,5 %; o investimento passa de 1 022,5 para 678,3, −33,7 % com o PRR e 22,2 % sem ele; as outras despesas correntes passam de 32,4 para 303,7, e as transferências de capital de 272,9 para 0,0.

O financiamento, na comparação entre os dois orçamentos: as receitas de impostos passam de 15 116,4 para 15 452,2; as receitas próprias de 1 289,5 para 2 017,6, 56,5 %; os fundos europeus de 655,0 para 174,6. As transferências para o Serviço Nacional de Saúde passam de 14 935,8 para 15 539,2, 4,0 %.

Desde 2020, a Saúde gastou todos os anos mais do que o orçamento inicial: 11 282,2 orçamentados e 11 731,9 executados em 2020; 16 853,5 e 17 241,5 em 2025; em 2026 o orçamento inicial era 17 300,2 e a estimativa de execução do relatório é 18 125,9, 825,7 acima; a UTAO, que parte de outra base, conta 915 na despesa efetiva.

Na execução até agosto de 2026, a despesa efetiva do programa Saúde foi de 11 822,6, 19,9 % acima do mesmo período de 2025, e o Serviço Nacional de Saúde tinha nesses oito meses um saldo de −918,5 milhões de euros, com a despesa a crescer 13,2 %.

Na comparação europeia, Portugal gastou em saúde 10,20 % do PIB em 2024, a União 10,16 %; por habitante, em euros correntes e sem correção pelos preços, 2 764,83 euros contra 4 074,88 na União; só nos regimes públicos e nos regimes contributivos obrigatórios, 6,31 % do PIB contra 8,17 %. Nos profissionais em exercício por cem mil habitantes, em 2024, Portugal tinha 431,35 médicos e 721,28 enfermeiros. Entre os vinte e sete, a Bélgica tinha 334,25 médicos por cem mil habitantes e a Grécia 626,89; nos enfermeiros, a Roménia tinha 106,04 por cem mil habitantes e o Luxemburgo 1 471,61.

No serviço, pelos dados abertos do Serviço Nacional de Saúde: em agosto de 2026 havia 1 362 294 inscritos sem médico de família atribuído, pela série que começou em julho; a série anterior dava 1 672 130 em junho de 2026 contra 1 669 681 um ano antes. As consultas nos cuidados primários foram 2 577 538 em agosto de 2026, 7,7 % acima de um ano antes; as cirurgias de janeiro a julho, 520 373, −4,4 %; os inscritos para cirurgia, 284 210, 5,8 %; os utentes à espera de vaga nos cuidados continuados, 2 482 em 19.10.2026, 11,8 %.

Os encargos do Serviço Nacional de Saúde com medicamentos, pelo Infarmed, foram de 1 179,3 milhões de euros em ambulatório de janeiro a julho e de 1 600,9 em meio hospitalar, 6,1 % acima do mesmo período do ano anterior no conjunto; o Infarmed avisa que «Os valores apresentados não refletem a totalidade das contribuições resultantes da implementação do Acordo Governo/APIFARMA e dos contratos de financiamento». A dívida das entidades do Serviço Nacional de Saúde a fornecedores externos era de 1 517,5 milhões de euros em julho de 2026; os pagamentos em atraso das unidades de saúde EPE, 689,9 milhões em agosto de 2026; e o Estado regularizou dívidas com reforços de capital de 1 398,6 milhões até agosto.

O PRR na saúde, à data de 14.10.2026: 2.011M € contratados, 947M € pagos, uma execução financeira de 47%; ficam por pagar 1 064 milhões de euros, 52,9 % do contratado. Dos 37 marcos e metas da componente da saúde no anexo anual de 2025, 24 estão completos, entre eles o contrato de gestão para o Hospital de Lisboa Oriental e a aquisição de equipamento médico pesado.

**A comparação**

Os números da RTP, a queda, o montante e a diferença, coincidem com a linha da despesa total consolidada: −267,5 milhões de euros, −1,5 %. O número do ministro coincide com a variação da linha da despesa efetiva consolidada sem o PRR, 3,0 %, a mesma que o relatório escreve e que a UTAO, a unidade técnica de apoio orçamental do Parlamento, confirma: «Todavia, excluído o efeito do PRR, a despesa aumentaria 3,0%.» O número do PCP sobre o investimento coincide com a linha do investimento com o PRR, −33,7 %; sem o PRR, a mesma linha sobe 22,2 %.

A descida vem toda do fim do PRR. Em 2026 o PRR valia 771,1 na despesa efetiva da Saúde; em 2027 vale zero, e a despesa efetiva é a mesma com e sem ele, 17 803,1 e 17 803,1. A despesa fora do PRR sobe 511,8, o que repõe 66,4 % do que o PRR deixa; a diferença, −259,3, é a queda da despesa efetiva.

O que sobe e o que desce não são a mesma coisa: o pessoal leva mais 401,2; a aquisição de bens e serviços leva menos 396,6; o investimento leva menos 344,2; e as outras despesas correntes passam de 32,4 para 303,7, mais 271,3. Segundo o relatório, é nesta rubrica que fica, para a Saúde, a dotação para reforçar os contratos-programa ainda por fechar, os acordos entre a Administração Central do Sistema de Saúde e as entidades do Serviço Nacional de Saúde; o próprio orçamento inscreve assim o reforço que antecipa, sem dizer quanto. O financiamento conta com receitas próprias a crescer 56,5 % e com fundos europeus a cair de 655,0 para 174,6.

A redução do PRR não é só da Saúde: em 2026 o PRR pesava 1 472,7 nas Finanças, 1 357,1 na Economia, 1 133,0 nas Infraestruturas e habitação, 823,2 no Ambiente e energia e 771,1 na Saúde. Em 2027 a despesa fora do PRR cresce 3,0 % na Saúde, 4,9 % na Educação, 8,8 % no Trabalho, solidariedade e segurança social, 20,8 % nas Infraestruturas e habitação, 18,2 % na Justiça e 13,1 % na Segurança interna; e varia −7,8 % nas Finanças, −4,9 % na Economia e −38,2 % na Coesão territorial.

O orçamento de 2027, 17 858,4, é inferior ao que o relatório estima que se gaste em 2026, 18 125,9, e superior em 3,6 % ao que se gastou em 2025, 17 241,5. A UTAO escreve, sobre a execução do Serviço Nacional de Saúde em 2027: «Existe um risco de pressão orçamental associado à execução do Serviço Nacional de Saúde (SNS).»

Posto ao lado do serviço: a compra de bens e serviços, por onde passam os medicamentos, desce 396,6 milhões de euros quando os encargos com medicamentos sobem 6,1 % num ano; o investimento cai um terço quando 52,9 % do contratado no PRR na saúde está por pagar; e o pessoal, que sobe 5,2 %, é o lado de um serviço com 1 362 294 pessoas sem médico de família e uma lista de espera para cirurgia a crescer 5,8 % num ano.

**A conclusão**

As três afirmações correspondem a linhas diferentes do quadro e nenhuma apresenta as três medidas em conjunto. A Saúde tem orçamentados em 2027 menos 267,5 milhões de euros do que a estimativa de despesa de 2026 porque o PRR acaba, e a despesa fora do PRR sobe 511,8 face aos 771,1 que o PRR deixa. A despesa com pessoal sobe, enquanto a compra de bens e serviços e o investimento descem. Desde 2020 nenhum orçamento inicial da Saúde dos anos com execução concluída chegou ao fim do ano sem ser ultrapassado, e o de 2027 é inferior ao que se estima gastar em 2026. Para quem usa o Serviço Nacional de Saúde, o orçamento de 2027 é mais dinheiro para quem lá trabalha e menos para o que se compra e se constrói, numa altura em que os encargos com medicamentos são maiores do que há um ano, a lista de espera para cirurgia cresceu e cerca de metade do contratado no PRR na saúde está por pagar.

**A recomendação**

A pergunta útil não é se o orçamento da Saúde sobe ou desce, é se chega: a resposta dos últimos seis anos é que não chegou nenhuma vez, e a execução até agosto de 2026, 19,9 % acima de 2025, reforça o risco de nova insuficiência. Quem acompanhar a Saúde em 2027 olha para a síntese mensal da execução orçamental da Entidade Orçamental e para a eventual necessidade de reforço, não apenas para a aprovação. Também acompanha os dados mensais do Serviço Nacional de Saúde: os utentes sem médico de família, a lista de espera para cirurgia e a dívida a fornecedores dizem mais sobre 2027 do que a votação.

**A opinião do lugar de direção**

O ministro e a RTP escolheram cada um a linha que lhes convinha, e as duas são verdadeiras; a discussão sobre «sobe» ou «desce» esconde o que o quadro mostra: um orçamento que paga mais pessoal com menos compras e menos investimento, que guarda em outras despesas correntes mais 271,3 milhões, onde o relatório diz estar a dotação para reforçar contratos-programa ainda por fechar, sem dizer quanto, que conta com receitas próprias a crescer mais de metade sem que o relatório explique de onde vêm, e que, pelo que a execução de 2026 e os seis anos anteriores mostram, corre o risco de voltar a ser ultrapassado. O orçamento da Saúde para 2027 é um orçamento de transição para o fim do PRR, e a sua medida certa conhece-se na execução, não na aprovação. Dizer isto custava mais do que dizer «sobe» ou «cai», e era o que o debate devia. Com estes números, a pergunta ao Governo e aos partidos não é «sobe ou desce»: é com que dinheiro se pagam os encargos com medicamentos que aumentaram 6,1 % e como se financia o investimento depois do PRR, com 52,9 % do contratado na saúde ainda por pagar. As afirmações citadas não respondem a essa pergunta.

#### As parcerias rodoviárias: o que o Estado paga, o que vai pagar e o que não está no quadro

**Como foi dito**

«Vem com um orçamento que entrega 1 700 milhões às parcerias público-privadas rodoviárias», Paulo Raimundo · PCP, na Assembleia da República, a 09.10.2026. A 12.10.2026, Paula Santos · PCP: «Em sentido inverso cresce mais do que o previsto a despesa com as chamadas PPP – rodoviárias, ferroviárias, saúde – com o Governo a desviar mais de 1800 milhões de euros de recursos públicos para os grupos económicos privados, sem que tal se traduza em novas infraestruturas ou investimento nas existentes.» A 15.10.2026, Paulo Raimundo: «Há condições, há recursos e meios, desde logo na Segurança Social, mas há também opções que se podem e têm de fazer, e entre os mais de 1700 milhões de euros que o Governo quer pagar em PPP e o aumento dos reformados, da nossa parte não temos dúvidas da opção a tomar.»

**O que as fontes dizem**

O quadro 4.25 do relatório do Orçamento, as parcerias público-privadas, 2027, em milhões de euros.

Os encargos brutos do setor rodoviário são 1 152; as receitas, 263; os encargos líquidos, 889. As parcerias ferroviárias custam 312 e as da saúde 254, numa linha única cada, sem receitas; os encargos brutos rodoviários mais os encargos ferroviários e da saúde somam 1 718, e o total líquido impresso para todos os setores é 1 438. Previsão, não execução. As linhas setoriais do quadro não somam exatamente o total impresso; o quadro não explica a diferença. O quadro diz que os valores são de caixa e, quando aplicável, incluem o IVA.

Os encargos líquidos rodoviários, ano a ano, pelos relatórios do Orçamento: 1 250 em 2021 (execução), 1 192 em 2022, 1 105 em 2023, 1 012 em 2024, 843 em 2025, 942 em 2026 (estimativas) e 889 em 2027 (orçamento).

O relatório projeta 705 em 2028, 648 em 2029, 77 em 2035 e 17 em 2040, o último ano com encargos rodoviários; em 2030 as receitas excedem os encargos e a linha é negativa, −220.

Para 2027, o relatório do ano passado previa 774 de encargos líquidos; este prevê 889. Segundo o relatório, a diferença vem dos custos da cobrança das portagens e dos pagamentos ligados ao tráfego, que subiram, e das receitas de portagem, que desceram.

Fora do quadro, no capítulo dos riscos, o relatório conta 2 388,2 milhões de euros em pedidos de reequilíbrio financeiro e litígios das concessionárias e subconcessionárias rodoviárias, com dados do primeiro trimestre, reportados a 31.03.2026, 1 140 acima do relatório anterior, dos quais 1 122,5 da Brisa, na negociação em curso, e 445 da ação principal da Rotas do Algarve Litoral, em que a Infraestruturas de Portugal paga, por decisão provisória, cerca de 1,3 milhões por mês, mais IVA. A UTAO distingue os pedidos dos encargos efetivos: «São pretensões dos parceiros privados, e não encargos já reconhecidos; a sua concretização, total ou parcial, oneraria o saldo orçamental de anos futuros.»

O IMT indica para a concessão da Brisa «Período da Concessão: 1972 – 2035»; a minuta fixa o fim em 31.12.2035. A comissão de negociação, pelo despacho publicado a 27.12.2024, trata dos alargamentos de vias, dos investimentos contratualmente previstos, da reposição do equilíbrio financeiro, dos acertos de comparticipações, da Circular Sul de Braga, de novos investimentos, dos limites da concessão e da qualidade do serviço. O relatório diz que «Em todo o caso, importa sublinhar que a presente análise não implica qualquer reconhecimento ou assunção, ainda que tácita, de responsabilidades por parte dos parceiros públicos decorrentes das pretensões deduzidas pelos parceiros privados, quer quanto aos respetivos fundamentos, que, na maioria das situações, são rejeitados pelos parceiros públicos, quer quanto aos montantes peticionados. Com efeito, ao longo dos últimos anos verificou-se, em diversas situações, que os pedidos formulados pelos parceiros privados vieram a ser considerados improcedentes, ou que as responsabilidades financeiras imputadas aos parceiros públicos foram inferiores aos montantes inicialmente peticionados.».

Desde 01.01.2025 foram eliminadas as portagens nos lanços e sublanços que a lei enumera: «São eliminadas as taxas de portagem cobradas aos utilizadores nos lanços e sublanços das seguintes autoestradas: a) A4 — Transmontana e Túnel do Marão; b) A13 e A13-1 — Pinhal Interior; c) A22 — Algarve; d) A23 — Beira Interior; e) A24 — Interior Norte; f) A25 — Beiras Litoral e Alta; g) A28 — Litoral Norte, nos troços entre Esposende e Antas, e entre Neiva e Darque.» O apoio do Estado às concessionárias pelos descontos nas portagens é pago pelo Orçamento do Estado: «Os encargos resultantes do apoio previsto nos artigos 3.º e 4.º são suportados diretamente pelo Orçamento do Estado, a processar pela DGTF.». Em 2012 o Tribunal de Contas escreveu sobre as compensações contingentes destas parcerias: «Neste contexto, o Tribunal vai estar atento aos eventuais pagamentos a realizar sob a forma de “compensações contingentes”, uma vez que podem, os mesmos, vir a constituir infrações financeiras.»

**A comparação**

Nenhum dos valores rodoviários do quadro é igual a 1 700 milhões de euros: o número está 548 acima dos encargos brutos e 811 acima dos líquidos.

O número aproxima-se da soma dos encargos brutos rodoviários com os encargos ferroviários e da saúde, 1 718, sem que isso demonstre a conta que lhe deu origem; as rodoviárias são 61,82 % do total líquido. O próprio PCP alargou depois o universo referido às parcerias rodoviárias, ferroviárias e da saúde, a 12.10.2026 e a 15.10.2026, com 1 800 milhões de euros e 1 700 milhões de euros.

O relatório prevê para as parcerias rodoviárias 889 líquidos em 2027 contra 1 250 executados em 2021, −28,9 %; mas mais do que os 843 estimados para 2025: os encargos brutos descem de 1 234 para 1 152, e as receitas previstas descem mais, de 392 para 263. A projeção tem uma tendência de redução, com oscilações, até 17 em 2040.

O número que falta nas três afirmações citadas é o dos pedidos pendentes, 2 388,2, que não está no quadro dos encargos nem nessas afirmações, e que é maior do que os encargos rodoviários brutos e do que o número da primeira afirmação. A negociação da Brisa pode determinar que parte desses pedidos se torna encargo; a concessão termina em 31.12.2035.

**A conclusão**

O relatório prevê 889 milhões líquidos para as parcerias rodoviárias em 2027, −28,9 % face à execução de 2021 mas acima da estimativa para 2025, e o quadro projeta uma tendência de redução, com oscilações, até ao fim dos contratos. O número da primeira afirmação do PCP aproxima-se do custo bruto de todas as parcerias, não do das rodoviárias. E o que pode mudar a conta não está no quadro: 2 388,2 milhões de pedidos das concessionárias, dos quais 1 122,5 numa negociação em curso. Para quem conduz e para quem paga impostos: a lei eliminou portagens desde 01.01.2025; o apoio às concessionárias pelos descontos nas portagens é suportado pelo Orçamento do Estado; a negociação da Brisa abrange investimentos e compensações numa concessão que termina em 31.12.2035; e os pedidos pendentes não são encargos efetivos reconhecidos.

**A recomendação**

A discussão útil em 2027 é a negociação com a Brisa e os litígios pendentes, além do valor orçamentado dos pagamentos contratados. Quem quiser vigiar as parcerias olha para o capítulo dos riscos do relatório e para o relatório anual da UTAP, a unidade técnica de acompanhamento de projetos, não só para o quadro dos encargos.

**A opinião do lugar de direção**

O PCP tem razão ao chamar a atenção para o custo das parcerias, mas erra ao atribuir às rodoviárias um número que ultrapassa os seus encargos brutos. As parcerias custam ao Estado mais de mil milhões brutos no ano orçamentado; a afirmação posterior já abrange as rodoviárias, as ferroviárias e as da saúde, mas o seu montante, 1 800 milhões de euros, também excede a soma do quadro. O Governo, por sua vez, apresenta um quadro dos pagamentos contratados e remete para um capítulo de riscos os pedidos que podem mudar a conta. Entre os dois, o leitor fica a saber os pagamentos previstos às concessionárias; fica por saber quanto dos pedidos pendentes se tornará encargo efetivo, e o que o Estado vai pagar pelas portagens que deixou de cobrar: é essa a conta que o Parlamento devia pedir antes de votar.

### EN

#### The Health budget for 2027: 3,0 % without the RRP or −1,5 % in total? Both counts, what changes inside it, and what went unsaid

**As it was said**

«Ora, esta verba do PRR foi excecional. Se retirarmos isso, o orçamento da Saúde sobre 3%», António Leitão Amaro, ministro da Presidência, in a document published by RTP, on 09.10.2026. On the same day, RTP published: «O orçamento para Saúde sofre um corte em 2027. Cai 1,5 por cento. Estão atribuídos 17 mil 858 milhões de euros. Menos 267,5 milhões do que este ano.» On 12.10.2026, Paula Santos · PCP said: «O investimento sofre um corte brutal de 33,7%.»

**What the sources say**

Table 5.37 of the Budget report, the Health programme, in million euros.

Total consolidated expenditure goes from 18 125,9 in 2026 to 17 858,4 in 2027, a change of −1,5 %. Consolidated effective expenditure goes from 18 062,4 to 17 803,1, −1,4 %. Without the RRP, the Recovery and Resilience Plan, consolidated effective expenditure goes from 17 291,3 to 17 803,1, 3,0 %.

Inside it, personnel expenditure goes from 7 783,1 to 8 184,3, 5,2 %; the purchase of goods and services, the programme's largest line, goes from 8 832,9 to 8 436,3, −4,5 %; investment goes from 1 022,5 to 678,3, −33,7 % with the RRP and 22,2 % without it; other current expenditure goes from 32,4 to 303,7, and capital transfers from 272,9 to 0,0.

The financing, comparing the two budgets: tax revenue goes from 15 116,4 to 15 452,2; own revenue from 1 289,5 to 2 017,6, 56,5 %; European funds from 655,0 to 174,6. Transfers to the National Health Service go from 14 935,8 to 15 539,2, 4,0 %.

Since 2020, Health has spent more than its initial budget every year: 11 282,2 budgeted and 11 731,9 executed in 2020; 16 853,5 and 17 241,5 in 2025; in 2026 the initial budget was 17 300,2 and the report's execution estimate is 18 125,9, 825,7 above; the UTAO, starting from another base, counts 915 in effective expenditure.

In the execution to August 2026, the Health programme's effective expenditure was 11 822,6, 19,9 % above the same period of 2025, and the National Health Service had, in those eight months, a balance of −918,5 million euros, with expenditure growing 13,2 %.

In the European comparison, Portugal spent 10,20 % of GDP on health in 2024, the EU 10,16 %; per inhabitant, in current euros and without correction for price levels, 2 764,83 euros against 4 074,88 in the EU; in government schemes and compulsory contributory schemes alone, 6,31 % of GDP against 8,17 %. For practising professionals per hundred thousand inhabitants in 2024, Portugal had 431,35 physicians and 721,28 nurses. Among the twenty-seven, Belgium had 334,25 physicians per hundred thousand inhabitants and Greece 626,89; for nurses, Romania had 106,04 per hundred thousand inhabitants and Luxembourg 1 471,61.

In the service, by the National Health Service's open data: in August 2026 there were 1 362 294 registered users without an assigned family doctor, by the series that began in July; the earlier series gave 1 672 130 in June 2026 against 1 669 681 a year earlier. Primary-care consultations were 2 577 538 in August 2026, 7,7 % above a year earlier; surgeries from January to July, 520 373, −4,4 %; patients on the surgery waiting list, 284 210, 5,8 %; patients waiting for a place in continuing care, 2 482 on 19.10.2026, 11,8 %.

National Health Service expenditure on medicines, according to Infarmed, was 1 179,3 million euros in outpatient care from January to July and 1 600,9 in hospitals, 6,1 % above the same period of the previous year combined; Infarmed warns that «Os valores apresentados não refletem a totalidade das contribuições resultantes da implementação do Acordo Governo/APIFARMA e dos contratos de financiamento». National Health Service entities owed external suppliers 1 517,5 million euros in July 2026; overdue payments by public enterprise health units were 689,9 million in August 2026; and the State settled debts with capital injections of 1 398,6 million through August.

The RRP in health, as of 14.10.2026: 2.011M € contracted, 947M € paid, financial execution of 47%; 1 064 million euros remain unpaid, 52,9 % of the contracted amount. Of the 37 milestones and targets for the health component in the annual annex for 2025, 24 are complete, including the management contract for Hospital de Lisboa Oriental and the purchase of heavy medical equipment.

**The comparison**

RTP's figures, the fall, the amount and the difference, match the line for total consolidated expenditure: −267,5 million euros, −1,5 %. The minister's figure matches the change in the line for consolidated effective expenditure without the RRP, 3,0 %, the one the report writes and the UTAO, Parliament's technical budget support unit, confirms: «Todavia, excluído o efeito do PRR, a despesa aumentaria 3,0%.» The PCP's figure on investment matches the investment line with the RRP, −33,7 %; without the RRP, the same line rises 22,2 %.

The fall comes entirely from the end of the RRP. In 2026 the RRP accounted for 771,1 in effective Health expenditure; in 2027 it is zero, and effective expenditure is the same with and without it, 17 803,1 and 17 803,1. Expenditure outside the RRP rises 511,8, replacing 66,4 % of what the RRP leaves; the difference, −259,3, is the fall in effective expenditure.

What rises and what falls are not the same thing: personnel takes 401,2 more; the purchase of goods and services takes 396,6 less; investment takes 344,2 less; and other current expenditure goes from 32,4 to 303,7, 271,3 more. According to the report, this line is where the provision to reinforce the contract-programmes still to be closed sits for Health, the agreements between the Central Administration of the Health System and the National Health Service's entities; the budget thus books the reinforcement it anticipates, without saying how much. The financing counts on own revenue growing 56,5 % and on European funds falling from 655,0 to 174,6.

The reduction in the RRP is not confined to Health: in 2026 the RRP accounted for 1 472,7 in Finance, 1 357,1 in Economy, 1 133,0 in Infrastructure and housing, 823,2 in Environment and energy and 771,1 in Health. In 2027 expenditure outside the RRP grows 3,0 % in Health, 4,9 % in Education, 8,8 % in Labour, solidarity and social security, 20,8 % in Infrastructure and housing, 18,2 % in Justice and 13,1 % in Internal security; and changes by −7,8 % in Finance, −4,9 % in Economy and −38,2 % in Territorial cohesion.

The budget for 2027, 17 858,4, is below what the report estimates will be spent in 2026, 18 125,9, and 3,6 % above what was spent in 2025, 17 241,5. The UTAO writes, on the execution of the National Health Service in 2027: «Existe um risco de pressão orçamental associado à execução do Serviço Nacional de Saúde (SNS).»

Set beside the service: the purchase of goods and services, through which medicines are paid, falls 396,6 million euros while spending on medicines rises 6,1 % in a year; investment falls by a third while 52,9 % of the RRP's contracted health amount is still unpaid; and personnel, up 5,2 %, is one side of a service with 1 362 294 people without a family doctor and a surgery waiting list growing 5,8 % in a year.

**The conclusion**

The three claims correspond to different lines of the table and none presents all three measures together. In 2027, Health is budgeted to receive 267,5 million euros less than the expenditure estimate for 2026 because the RRP ends, and expenditure outside the RRP rises 511,8 against the 771,1 the RRP leaves. Personnel expenditure rises, while the purchase of goods and services and investment fall. Since 2020, no initial Health budget in the years with completed execution has reached the end of the year without being exceeded, and the 2027 one is below what is estimated to be spent in 2026. For those who use the National Health Service, the budget for 2027 is more money for the people who work in it and less for what is bought and built, at a time when expenditure on medicines is higher than a year ago, the surgery waiting list has grown and around half of the contracted RRP health amount is still unpaid.

**The recommendation**

The useful question is not whether the Health budget rises or falls, but whether it is enough: the answer of the last six years is that it never was, and the execution to August 2026, 19,9 % above 2025, reinforces the risk of another shortfall. Whoever follows Health in 2027 watches the Entidade Orçamental's monthly budget execution summary and the possible need for reinforcement, not just the approval. They also follow the National Health Service's monthly data: users without a family doctor, the surgery waiting list and the debt to suppliers say more about 2027 than the vote.

**The editorial seat's opinion**

The minister and RTP each chose the line that suited them, and both are true; the argument over «up» or «down» hides what the table shows: a budget that pays more staff with fewer purchases and less investment, that holds 271,3 million more in other current expenditure, where the report says the provision to reinforce contract-programmes still to be closed sits, without saying how much, that counts on own revenue growing by more than half without the report explaining where it comes from, and that, on the evidence of the 2026 execution and the six years before it, risks being exceeded again. The Health budget for 2027 is a transition budget for the end of the RRP, and its true size will be known in the execution, not at the vote. Saying this cost more than saying «up» or «down», and it was what the debate owed. With these numbers, the question to the Government and the parties is not «up or down»: it is which money pays for medicine expenditure that rose 6,1 % and how investment is financed after the RRP, with 52,9 % of the contracted health amount still unpaid. The quoted statements do not answer that question.

#### The road partnerships: what the State pays, what it will pay, and what the table leaves out

**As it was said**

«Vem com um orçamento que entrega 1 700 milhões às parcerias público-privadas rodoviárias», Paulo Raimundo · PCP, in the Assembleia da República, on 09.10.2026. On 12.10.2026, Paula Santos · PCP: «Em sentido inverso cresce mais do que o previsto a despesa com as chamadas PPP – rodoviárias, ferroviárias, saúde – com o Governo a desviar mais de 1800 milhões de euros de recursos públicos para os grupos económicos privados, sem que tal se traduza em novas infraestruturas ou investimento nas existentes.» On 15.10.2026, Paulo Raimundo: «Há condições, há recursos e meios, desde logo na Segurança Social, mas há também opções que se podem e têm de fazer, e entre os mais de 1700 milhões de euros que o Governo quer pagar em PPP e o aumento dos reformados, da nossa parte não temos dúvidas da opção a tomar.»

**What the sources say**

Table 4.25 of the Budget report, the public-private partnerships, 2027, in million euros.

Gross charges for the road sector are 1 152; revenue, 263; net charges, 889. Rail partnerships cost 312 and health ones 254, each on a single line, with no revenue; gross road charges plus rail and health charges add up to 1 718, and the printed net total for all sectors is 1 438. Forecast, not outturn. The sector rows in the table do not add up exactly to the printed total; the table does not explain the difference. The table says the values are on a cash basis and, where applicable, include VAT.

Net road charges, year by year, in the Budget reports: 1 250 in 2021 (execution), 1 192 in 2022, 1 105 in 2023, 1 012 in 2024, 843 in 2025, 942 in 2026 (estimates) and 889 in 2027 (budget).

The report projects 705 in 2028, 648 in 2029, 77 in 2035 and 17 in 2040, the last year with road charges; in 2030 revenue exceeds charges and the line is negative, −220.

For 2027, last year's report forecast 774 in net charges; this one forecasts 889. According to the report, the difference comes from toll collection costs and traffic-linked payments, which rose, and toll revenue, which fell.

Outside the table, in the risks chapter, the report counts 2 388,2 million euros in financial rebalancing claims and litigation by road concessionaires and subconcessionaires, with first-quarter data referenced to 31.03.2026, 1 140 above the previous report, including 1 122,5 from Brisa, in the ongoing negotiation, and 445 in the main action by Rotas do Algarve Litoral, in which Infraestruturas de Portugal pays, by provisional decision, around 1,3 million a month, plus VAT. The UTAO distinguishes claims from actual charges: «São pretensões dos parceiros privados, e não encargos já reconhecidos; a sua concretização, total ou parcial, oneraria o saldo orçamental de anos futuros.»

The IMT gives the Brisa concession period as «Período da Concessão: 1972 – 2035»; the draft contract sets its end on 31.12.2035. Under the order published on 27.12.2024, the negotiating committee covers lane widening, contractually planned investment, restoring financial balance, contribution adjustments, the Braga southern ring road, new investment, concession boundaries and service quality. The report states that «Em todo o caso, importa sublinhar que a presente análise não implica qualquer reconhecimento ou assunção, ainda que tácita, de responsabilidades por parte dos parceiros públicos decorrentes das pretensões deduzidas pelos parceiros privados, quer quanto aos respetivos fundamentos, que, na maioria das situações, são rejeitados pelos parceiros públicos, quer quanto aos montantes peticionados. Com efeito, ao longo dos últimos anos verificou-se, em diversas situações, que os pedidos formulados pelos parceiros privados vieram a ser considerados improcedentes, ou que as responsabilidades financeiras imputadas aos parceiros públicos foram inferiores aos montantes inicialmente peticionados.».

Since 01.01.2025, tolls have been abolished on the stretches listed in the law: «São eliminadas as taxas de portagem cobradas aos utilizadores nos lanços e sublanços das seguintes autoestradas: a) A4 — Transmontana e Túnel do Marão; b) A13 e A13-1 — Pinhal Interior; c) A22 — Algarve; d) A23 — Beira Interior; e) A24 — Interior Norte; f) A25 — Beiras Litoral e Alta; g) A28 — Litoral Norte, nos troços entre Esposende e Antas, e entre Neiva e Darque.» State support to concessionaires for toll discounts is paid by the State Budget: «Os encargos resultantes do apoio previsto nos artigos 3.º e 4.º são suportados diretamente pelo Orçamento do Estado, a processar pela DGTF.». In 2012, the Court of Auditors wrote about contingent compensation in these partnerships: «Neste contexto, o Tribunal vai estar atento aos eventuais pagamentos a realizar sob a forma de “compensações contingentes”, uma vez que podem, os mesmos, vir a constituir infrações financeiras.»

**The comparison**

None of the road figures in the table equals 1 700 million euros: the figure is 548 above gross charges and 811 above net charges.

The figure is close to the sum of gross road charges and rail and health charges, 1 718, without that proving the calculation behind it; road partnerships are 61,82 % of the net total. The PCP itself later widened the universe to the road, rail and health partnerships, on 12.10.2026 and on 15.10.2026, with 1 800 million euros and 1 700 million euros.

The report forecasts 889 net for the road partnerships in 2027 against 1 250 executed in 2021, −28,9 %; but more than the 843 estimated for 2025: gross charges fall from 1 234 to 1 152, and the forecast revenue falls further, from 392 to 263. The projection has a downward trend, with fluctuations, to 17 in 2040.

The figure missing from the three quoted claims is that of the pending demands, 2 388,2, which is absent from the charges table and those claims, and exceeds gross road charges and the figure in the first claim. The Brisa negotiation may determine what part of those claims becomes a charge; the concession ends on 31.12.2035.

**The conclusion**

The report forecasts 889 million net for the road partnerships in 2027, −28,9 % against execution in 2021, but above the estimate for 2025, and the table projects a downward trend, with fluctuations, to the end of the contracts. The figure in the PCP's first claim is close to the gross cost of all partnerships, not of the road ones. And what could change the bill is not in the table: 2 388,2 million in concessionaires' claims, 1 122,5 of them in a negotiation under way. For drivers and taxpayers: the law abolished tolls from 01.01.2025; support to concessionaires for toll discounts is borne by the State Budget; the Brisa negotiation covers investment and compensation in a concession ending on 31.12.2035; and pending claims are not recognised actual charges.

**The recommendation**

The useful debate in 2027 is the Brisa negotiation and the pending lawsuits, alongside the budgeted figure for contracted payments. Whoever wants to watch the partnerships looks at the report's risks chapter and at the annual report of UTAP, the technical unit for monitoring projects, not only at the table of charges.

**The editorial seat's opinion**

The PCP is right to draw attention to the cost of partnerships, but wrong to attribute to road partnerships a figure exceeding their gross charges. Partnerships cost the State over a billion gross in the budgeted year; the later claim already covers road, rail and health partnerships, but its amount, 1 800 million euros, also exceeds the sum in the table. The Government, for its part, presents a table of contracted payments and sends the claims that could change the bill to a risks chapter. Between the two, the reader learns the payments forecast for concessionaires; how much of the pending claims will become an actual charge remains unknown, and what the State will pay for the tolls it stopped collecting: that is the bill Parliament should ask for before voting.
