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

## A correção V2-e-b

Esta secção substitui as conclusões anteriores nos pontos corrigidos. A V2E-3 estava errada: o apoio do decreto-lei é a diferença entre a atualização limitada das portagens e a contratual, não o financiamento dos regimes de descontos. A V2E-16 foi substituída pela leitura numérica do painel, conservando a cadeia original nos seus recibos. As afirmações anteriores de integração de todas as linhas já não descrevem esta cabeça.

### Decisões da correção

- **V2E-23.** Corrigido o apoio das portagens nas duas edições, incluindo conclusão, opinião e descrições dos recibos. O artigo sobre os descontos é citado para distinguir os regimes. A opinião declara a frase inteira no ficheiro dos itens, com a negociação da Beira Interior como apoio.
- **V2E-24.** O não reconhecimento conserva só a primeira frase. A negociação da Beira Interior perde a chamada de nota. Ambas as alterações têm histórico datado de correção; o texto anterior fica consultável.
- **V2E-25.** O catálogo alojado permite citar a definição de elegibilidade, a exclusão do Vitacare, o carácter provisório do último mês e a definição temporal dos acumulados. Os corpos e recibos já existiam no motor; as novas linhas documentais fazem-nos viajar no pacote. A nota do período homólogo não o apresenta como último mês.
- **V2E-26.** O nome registado da medida aparece ao lado do título do conjunto nos recibos sem rótulo literal. A ausência de nome bilingue é recusada. Os nomes distinguem todos os inscritos para cirurgia, os dois universos de utentes sem médico e as qualificações dos enfermeiros.
- **V2E-27.** As contas dos marcos e as leituras numéricas do painel são derivadas. As funções de leitura numérica, contagem de linhas e contagem por estado têm componentes explícitas, identificadores do sítio e ensaios de valores alterados, referências ausentes, repetidas e circulares. A taxa vem da linha do painel, sem a recalcular pelo quociente dos montantes arredondados.
- **V2E-28.** Os intervalos mensais renderizam meses e ano nas páginas, recibos e incorporação. A conferência exige o período completo quando a prova o declara; não salta uma linha a que se tenha retirado o campo. O reinício anual continua a ser conferido nos valores, além da definição do catálogo.
- **V2E-29.** As portas seguem as linhas impressas, citadas e as componentes transitivas das contas. A lista indiscriminada do bloco saiu. A contagem do achado não é fixada como alvo: declarar as componentes dos marcos muda quais linhas têm uso real.
- **V2E-30.** As unidades monetárias passaram para o sufixo do valor, antes do selo. A régua procura uma unidade depois do selo nas duas edições e tem plantas que repõem o defeito.
- **V2E-31.** Cada tarefa da comissão tem o selo junto das palavras correspondentes, com a alínea extraída do excerto no nome acessível. O único exemplo de marco que fica no texto é o contrato de gestão do Hospital de Lisboa Oriental, também com selo inline. As linhas do equipamento pesado permanecem componentes da contagem, sem ser apresentadas como exemplo de execução.
- **V2E-32.** Saíram dos itens a frase europeia dos enfermeiros, a espera por cuidados continuados e a citação histórica do Tribunal de Contas. As linhas permanecem no livro. A regularização é atribuída às entidades do SNS; a comparação entre bens e serviços e medicamentos já não afirma uma ligação contabilística que as fontes não demonstram.
- **V2E-33.** Dois anos necessários à prosa foram selados dos cabeçalhos dos documentos: a publicação do decreto-lei e a minuta do contrato Brisa. Assim, os anos chegam por tokens de período. A série nova é descrita como começada em julho desse ano, após o período de agosto já impresso, conservando o mesmo referente temporal sem algarismos fixos.
- **V2E-34.** A célula I241 dos apoios fica para a higiene, conforme o mandato. A auditoria existente foi regenerada com os apoios das frases corrigidas, incluindo a Beira Interior na opinião.

- **V2E-35.** O histórico de valor aceita texto documental apenas quando a prova selada o confirma. Os excertos corrigidos continuam no registo e no recibo; os consumidores que comparam números, incluindo a leitura semanal e o índice, excluem-nos dessas comparações. Plantas adulteram a marca, a unidade, o corpo e o excerto, e tentam ocultar uma linha numérica como texto.
- **V2E-36.** As correções dos dois excertos do relatório do Orçamento têm âmbito nacional declarado e conferido pela origem. As tentativas de construção que detetaram a ausência dessa declaração e a suposição numérica da leitura semanal ficam registadas abaixo.

- **V2E-37.** A célula lê também períodos trimestrais e recusa a troca pelo último dia. Os recibos derivados sem excerto conferem a ressalva calculada que efetivamente imprimem, nas duas línguas, com plantas que a trocam por uma promessa de transcrição. A exceção dos estados completos do PRR acompanha o espaço deixado pela extração do selo, sem alargar a frase nem as rotas autorizadas.

- **V2E-38.** A edição «2008», da linha nova do ano da minuta, fica explicitamente declarada sem língua. A régua da língua recusou a chave ausente; depois da declaração, passaram também as conferências do formato, da navegação e dos sinais da primeira página.

- **V2E-39.** O conjunto fechado da régua dos rótulos acompanha as linhas acrescentadas. Nos recibos do painel, confere a cadeia selada integral e recusa tanto a unidade retirada como a repetição marcada ou não marcada. A célula do índice distingue texto documental selado de mudança numérica, como a página e a leitura semanal, sem permitir ocultar uma linha numérica pela simples marca textual.

- **V2E-40.** Os recortes passam a extrair os píxeis da captura completa, com a caixa e a origem no manifesto, para permitir a comparação exata. A suspeita visual inicial de perda de algarismos no recorte inglês do PRR não se confirmou: a comparação do primeiro lote encontrou zero píxeis diferentes na caixa correspondente. Não se declara um defeito da página nem um defeito confirmado do capturador anterior. O lote de entrega exercita o capturador e cada recorte confere-se contra a página completa; a prova está em `b/recortes-prova.json`. Esta alteração do utilitário de capturas e os ficheiros de prova são posteriores à cabeça que passou os portões; não alteram o conteúdo nem os recursos construídos.

### Linhas seladas e cálculos

Seladas de novo: `pe-oe-beira-abolicao`, sem a chamada de nota colada a «negociação», e `pe-oe-riscos-nao-reconhecimento`, só até «peticionados.». O histórico preserva os excertos anteriores. As linhas `pe-dl87a-financiamento`, `pe-dl87a-apoio` e `pe-dl87a-apoio-retificado` conservaram a fonte, com descrições corrigidas nos recibos.

Novas linhas documentais: `pe-dl87a-descontos`, `sns-sem-medico-elegibilidade`, `sns-consultas-csp-descricao`, `sns-catalogo-acumulados`, `pe-brisa-minuta-ano` e `pe-dl87a-publicacao-ano`. A definição de elegibilidade foi selada verbatim, pelo que não foi necessário usar a alternativa sem citação do mandato. Os acumulados citam o catálogo nas notas e ressalvas.

As cinco derivadas são `der-prr-saude-marcos-completos`, `der-prr-saude-marcos-total`, `der-prr-saude-contratado-numerico`, `der-prr-saude-pago-numerico` e `der-prr-saude-taxa-numerico`. As componentes são identificadores do sítio, ligados nos recibos. A taxa é a leitura do painel, não o quociente dos montantes arredondados. Os estados dos marcos entram como componentes da contagem.

A frase europeia dos enfermeiros, a dos cuidados continuados e a citação do Tribunal de Contas saíram dos itens. As suas linhas ficaram no livro. O exemplo do equipamento pesado saiu; fica um exemplo PRR com selo junto das palavras, além das tarefas do Despacho com selos individuais. A célula dos apoios I241 fica para a higiene por determinação do mandato.

### As unidades antes do selo

A lista resulta do HTML anterior (`b/unidades-antes-html.json`) e das alterações dos tokens (`b/unidades-corrigidas.json`). Cada ocorrência passou a levar a unidade no sufixo.

#### PT: 15 ocorrências

| Linha | Local | Unidade deslocada para o sufixo |
|---|---|---|
| `dgo-2026-08-sns-saldo-jan-ago-2026` | `seccoes[1].conteudo[5].paragrafo` | milhões de euros |
| `eurostat-hlth-sha11-hf-a-eur_hab-tot_hf-pt-2024` | `seccoes[1].conteudo[6].paragrafo` | euros |
| `infarmed-ambulatorio-2026-07-p5-acumulado-encargo` | `seccoes[1].conteudo[8].paragrafo` | milhões de euros |
| `der-sns-divida-fornecedores-2026-07` | `seccoes[1].conteudo[8].paragrafo` | milhões de euros |
| `dgo-atraso-45-p` | `seccoes[1].conteudo[8].paragrafo` | milhões |
| `dgo-regularizacao-ae` | `seccoes[1].conteudo[8].paragrafo` | milhões |
| `der-prr-saude-por-pagar` | `seccoes[1].conteudo[9].paragrafo` | milhões de euros |
| `der-saude-variacao-total-abs` | `seccoes[2].conteudo[0].paragrafo` | milhões de euros |
| `der-saude-bens-servicos-reducao-abs` | `seccoes[2].conteudo[5].paragrafo` | milhões de euros |
| `der-saude-total-reducao-abs` | `seccoes[3].conteudo[0].paragrafo` | milhões de euros |
| `der-saude-outras-correntes-variacao-abs` | `seccoes[5].conteudo[0].paragrafo` | milhões |
| `ppp-oe2027-riscos-pedidos-rodoviarios` | `seccoes[1].conteudo[5].paragrafo` | milhões de euros |
| `ppp-oe2027-riscos-rotas-algarve-mensal` | `seccoes[1].conteudo[5].paragrafo` | milhões |
| `oe-2027-ppp-rodoviario-encargos-liquidos-2027` | `seccoes[3].conteudo[0].paragrafo` | milhões |
| `ppp-oe2027-riscos-pedidos-rodoviarios` | `seccoes[3].conteudo[0].paragrafo` | milhões |

#### EN: 15 ocorrências

| Linha | Local | Unidade deslocada para o sufixo |
|---|---|---|
| `dgo-2026-08-sns-saldo-jan-ago-2026` | `seccoes[1].conteudo[5].paragrafo` | million euros |
| `eurostat-hlth-sha11-hf-a-eur_hab-tot_hf-pt-2024` | `seccoes[1].conteudo[6].paragrafo` | euros |
| `infarmed-ambulatorio-2026-07-p5-acumulado-encargo` | `seccoes[1].conteudo[8].paragrafo` | million euros |
| `der-sns-divida-fornecedores-2026-07` | `seccoes[1].conteudo[8].paragrafo` | million euros |
| `dgo-atraso-45-p` | `seccoes[1].conteudo[8].paragrafo` | million |
| `dgo-regularizacao-ae` | `seccoes[1].conteudo[8].paragrafo` | million |
| `der-prr-saude-por-pagar` | `seccoes[1].conteudo[9].paragrafo` | million euros |
| `der-saude-variacao-total-abs` | `seccoes[2].conteudo[0].paragrafo` | million euros |
| `der-saude-bens-servicos-reducao-abs` | `seccoes[2].conteudo[5].paragrafo` | million euros |
| `der-saude-total-reducao-abs` | `seccoes[3].conteudo[0].paragrafo` | million euros |
| `der-saude-outras-correntes-variacao-abs` | `seccoes[5].conteudo[0].paragrafo` | million |
| `ppp-oe2027-riscos-pedidos-rodoviarios` | `seccoes[1].conteudo[5].paragrafo` | million euros |
| `ppp-oe2027-riscos-rotas-algarve-mensal` | `seccoes[1].conteudo[5].paragrafo` | million |
| `oe-2027-ppp-rodoviario-encargos-liquidos-2027` | `seccoes[3].conteudo[0].paragrafo` | million |
| `ppp-oe2027-riscos-pedidos-rodoviarios` | `seccoes[3].conteudo[0].paragrafo` | million |


### Provas de fecho da correção

Cabeça construída e capturada: `476ca482394909ad1bd94e530cda480a866d3547`. O motor ficou em `e2ad177c`, com `GATE: PASS` no pre-commit, confirmado no resultado do escrivão (`b/motor-prova.json`). Os commits foram pedidos ao escrivão com os caminhos explícitos; não houve push.

| Tentativa | Cabeça | build | verify | typecheck | Resultado |
|---|---|---:|---:|---:|---|
| 1 | `2ac26dba` | 1 | 125 | 0 | Recusada: faltava o âmbito nacional dos excertos corrigidos. |
| 2 | `41154bed` | 1 | 125 | 0 | Recusada: a leitura semanal tentava comparar os excertos como números. |
| 3 | `fa5e624b` | 1 | 125 | 0 | Recusada: inventário da prosa e expectativas de células por atualizar. |
| 4 | `6dbfc7e4` | 1 | 125 | 0 | Recusada: a edição anual da minuta ainda não tinha língua explicitamente declarada. |
| 5 | `67c0eb10` | 0 | 1 | 0 | Build verde; verify recusado pelas células dos rótulos e do índice. |
| 6 | `476ca482` | 0 | 0 | 0 | Os três portões passaram. |

Auditoria das palavras: 424 folhas, 428 partes e 5199 apoios, em `tests/discussao/palavras.json`; contagem em `b/auditoria.json`. A Beira Interior está declarada como apoio da opinião.

Os códigos foram lidos dos ficheiros escritos pelo escrivão. O código de verify nas tentativas sem build completo significa que não correu. A corrida final pelo escrivão conferiu a união da suíte inteira, incluindo os passos já pagos pelo build e os restantes em paralelo, e a imutabilidade da construção. `b/verificacao-final.json` guarda os códigos e os resumos dos registos.

Séries com o motor e cruzamento com a origem: código 0 e código 0. O cruzamento conserva o aviso de alteração do campo de construção do livro do Orçamento; nenhuma linha nem ficheiro de origem divergiu. O core.gate foi o do commit do motor, sem alterações posteriores nesse repositório.

A conferência de dados detetou 145 de 145 plantas. A célula dos itens passou com zero erros e as plantas registadas em `b/celulas-itens.json`; o HTML conferiu 72 parágrafos e 296 recibos. As ocorrências de unidade depois do selo e os erros de posição/nome dos selos inline são zero nas duas edições. Os ensaios das funções documentais, do histórico, das correções textuais, do painel e do índice estão em `b/ensaios-prova.json`.

Portas: 297 linhas usadas pelos itens; 148 linhas do bloco com porta. Das linhas do bloco, 29 ficam sem porta porque não são impressas, citadas nem componentes transitivas. As componentes dos marcos agora declaradas são uso real, pelo que a contagem não se fixa nas linhas sem uso apontadas antes dessa correção. As portas dos recibos são conferidas nas duas edições; a célula inclui também as portas dos índices e da explicação do dinheiro do Estado.

Capturas: 20 páginas completas e 60 recortes, nas duas páginas, duas edições e nas larguras declaradas no pedido. Zero erros de navegador, pedidos externos, recursos recusados ou páginas mais largas do que a janela. Cada PNG foi reconferido pelo sha256. `b/capturas-pedido.json`, `b/capturas.json` e `b/inspecao-visual.json` guardam o pedido, o manifesto e a inspeção. As imagens ficam em `<temporario>/v2eb-capturas-entrega`, fora do repositório.

Fica para o lugar de direção ler as duas edições e lançar a leitura curta sobre o diff, como o mandato pede. A célula dos apoios I241 permanece para a higiene. A correção não foi fundida nem publicada.

### Frases da correção tal como renderizam

Conferidas no HTML da cabeça `476ca482394909ad1bd94e530cda480a866d3547`: 72 parágrafos. Esta transcrição substitui, nos pontos corrigidos, a transcrição anterior do V2-e. Os selos não entram no texto corrido abaixo; a posição e o nome acessível são conferidos na célula e nas capturas.

#### PT

##### O orçamento da Saúde para 2027: 3,0 % sem PRR ou −1,5 % no total? As duas contas, o que muda por dentro e o que ficou por dizer

**Como foi dito**

«Ora, esta verba do PRR foi excecional. Se retirarmos isso, o orçamento da Saúde sobre 3%», António Leitão Amaro, ministro da Presidência, num documento publicado pela RTP, a 09.10.2026. No mesmo dia, a RTP publicou: «O orçamento para Saúde sofre um corte em 2027. Cai 1,5 por cento. Estão atribuídos 17 mil 858 milhões de euros. Menos 267,5 milhões do que este ano.» A 12.10.2026, Paula Santos · PCP disse: «O investimento sofre um corte brutal de 33,7%.»

**O que as fontes dizem**

O quadro 5.37 do relatório do Orçamento, o programa Saúde, em milhões de euros.

A despesa total consolidada passa de 18 125,9 em 2026 para 17 858,4 em 2027, uma variação de −1,5 %. A despesa efetiva consolidada passa de 18 062,4 para 17 803,1, −1,4 %. Sem o PRR, o Plano de Recuperação e Resiliência, a despesa efetiva consolidada passa de 17 291,3 para 17 803,1, 3,0 %.

Por dentro, a despesa com o pessoal passa de 7 783,1 para 8 184,3, 5,2 %; a aquisição de bens e serviços, a maior rubrica do programa, passa de 8 832,9 para 8 436,3, −4,5 %; o investimento passa de 1 022,5 para 678,3, −33,7 % com o PRR e 22,2 % sem ele; as outras despesas correntes passam de 32,4 para 303,7, e as transferências de capital de 272,9 para 0,0.

O financiamento, na comparação entre os dois orçamentos: as receitas de impostos passam de 15 116,4 para 15 452,2; as receitas próprias de 1 289,5 para 2 017,6, 56,5 %; os fundos europeus de 655,0 para 174,6. As transferências para o Serviço Nacional de Saúde passam de 14 935,8 para 15 539,2, 4,0 %.

Desde 2020, a Saúde gastou todos os anos mais do que o orçamento inicial: 11 282,2 orçamentados e 11 731,9 executados em 2020; 16 853,5 e 17 241,5 em 2025; em 2026 o orçamento inicial era 17 300,2 e a estimativa de execução do relatório é 18 125,9, 825,7 acima; a UTAO, que parte de outra base, conta 915 na despesa efetiva.

Na execução até agosto de 2026, a despesa efetiva do programa Saúde foi de 11 822,6, 19,9 % acima do mesmo período de 2025, e o Serviço Nacional de Saúde tinha nesses oito meses um saldo de −918,5 milhões de euros, com a despesa a crescer 13,2 %.

Na comparação europeia, Portugal gastou em saúde 10,20 % do PIB em 2024, a União 10,16 %; por habitante, em euros correntes e sem correção pelos preços, 2 764,83 euros contra 4 074,88 na União; só nos regimes públicos e nos regimes contributivos obrigatórios, 6,31 % do PIB contra 8,17 %. Nos médicos em exercício por cem mil habitantes, em 2024, Portugal tinha 431,35 médicos. Entre os países com valor em 2024, a Bélgica tinha 334,25 médicos por cem mil habitantes e a Grécia 626,89.

No serviço, pelos dados abertos do Serviço Nacional de Saúde: em agosto de 2026 havia 1 362 294 utentes elegíveis inscritos sem médico de família atribuído, pela série que começou em julho desse ano e conta só os utentes elegíveis («Utentes inscritos que cumprem os critérios de elegibilidade para atribuição de Médico de Família. Cálculo: utentes com registo atualizado e contacto com o SNS nos últimos cinco anos.»), que por isso não se compara com a anterior; a série anterior dava 1 672 130 em junho de 2026 contra 1 669 681 um ano antes. As consultas nos cuidados primários foram 2 577 538 em agosto de 2026, o último mês, provisório na fonte, que diz: «As consultas registadas no sistema Vitacare não entram no cálculo destas métricas. Os dados relativos a este indicador são de caráter temporário para o mês publicado mais recente.»; 7,7 % acima de agosto de 2025; as cirurgias de janeiro a julho de 2026, 520 373, −4,4 %; os inscritos para cirurgia, 284 210 em julho de 2026, 5,8 %.

Os encargos do Serviço Nacional de Saúde com medicamentos, pelo Infarmed, foram de 1 179,3 milhões de euros em ambulatório de janeiro a julho e de 1 600,9 em meio hospitalar, 6,1 % acima do mesmo período do ano anterior no conjunto; sobre as contribuições do acordo com a Associação Portuguesa da Indústria Farmacêutica (APIFARMA), o Infarmed avisa que «Os valores apresentados não refletem a totalidade das contribuições resultantes da implementação do Acordo Governo/APIFARMA e dos contratos de financiamento». A dívida das entidades do Serviço Nacional de Saúde a fornecedores externos era de 1 517,5 milhões de euros em julho de 2026; os pagamentos em atraso das unidades de saúde que são entidades públicas empresariais (EPE), 689,9 milhões em agosto de 2026, pela execução orçamental da Direção-Geral do Orçamento; e as entidades do Serviço Nacional de Saúde regularizaram 1 398,6 milhões de dívidas vencidas a fornecedores até agosto, com contrapartida em reforços de capital pelo Estado.

O PRR na saúde, à data de 14.10.2026: 2 011 milhões de euros contratados, 947 milhões pagos, uma execução financeira de 47 %; ficam por pagar 1 064 milhões de euros, 52,9 % do contratado. Dos 37 marcos e metas da componente da saúde no anexo anual de 2025, 24 estão completos, entre eles o contrato de gestão para o Hospital de Lisboa Oriental.

**A comparação**

Os números da RTP, a queda, o montante e a diferença, coincidem com a linha da despesa total consolidada: −267,5 milhões de euros, −1,5 %. O número do ministro coincide com a variação da linha da despesa efetiva consolidada sem o PRR, 3,0 %, a mesma que o relatório escreve e que a UTAO, a unidade técnica de apoio orçamental do Parlamento, confirma: «Todavia, excluído o efeito do PRR, a despesa aumentaria 3,0%.» O número do PCP sobre o investimento coincide com a linha do investimento com o PRR, −33,7 %; sem o PRR, a mesma linha sobe 22,2 %.

A descida vem toda do fim do PRR. Em 2026 o PRR valia 771,1 na despesa efetiva da Saúde; em 2027 vale zero, e a despesa efetiva é a mesma com e sem ele, 17 803,1 e 17 803,1. A despesa fora do PRR sobe 511,8, o que repõe 66,4 % do que o PRR deixa; a diferença, −259,3, é a queda da despesa efetiva.

O que sobe e o que desce não são a mesma coisa: o pessoal leva mais 401,2; a aquisição de bens e serviços leva menos 396,6; o investimento leva menos 344,2; e as outras despesas correntes passam de 32,4 para 303,7, mais 271,3. Segundo o relatório, é nesta rubrica que fica, para a Saúde, a dotação para reforçar os contratos-programa ainda por fechar, os acordos entre a Administração Central do Sistema de Saúde e as entidades do Serviço Nacional de Saúde; o próprio orçamento inscreve assim o reforço que antecipa, sem dizer quanto. O financiamento conta com receitas próprias a crescer 56,5 % e com fundos europeus a cair de 655,0 para 174,6.

A redução do PRR não é só da Saúde: em 2026 o PRR pesava 1 472,7 nas Finanças, 1 357,1 na Economia, 1 133,0 nas Infraestruturas e habitação, 823,2 no Ambiente e energia e 771,1 na Saúde. Em 2027 a despesa fora do PRR cresce 3,0 % na Saúde, 4,9 % na Educação, 8,8 % no Trabalho, solidariedade e segurança social, 20,8 % nas Infraestruturas e habitação, 18,2 % na Justiça e 13,1 % na Segurança interna; e varia −7,8 % nas Finanças, −4,9 % na Economia e −38,2 % na Coesão territorial.

O orçamento de 2027, 17 858,4, é inferior ao que o relatório estima que se gaste em 2026, 18 125,9, e superior em 3,6 % ao que se gastou em 2025, 17 241,5. A UTAO escreve, sobre a execução do Serviço Nacional de Saúde em 2027: «Existe um risco de pressão orçamental associado à execução do Serviço Nacional de Saúde (SNS).»

Posto ao lado do serviço: a compra de bens e serviços desce 396,6 milhões de euros quando os encargos com medicamentos sobem 6,1 % num ano; o investimento cai um terço quando 52,9 % do contratado no PRR na saúde está por pagar; e o pessoal, que sobe 5,2 %, é o lado de um serviço com 1 362 294 utentes elegíveis sem médico de família atribuído e uma lista de espera para cirurgia a crescer 5,8 % num ano.

**A conclusão**

As três afirmações correspondem a linhas diferentes do quadro e nenhuma apresenta as três medidas em conjunto. A Saúde tem orçamentados em 2027 menos 267,5 milhões de euros do que a estimativa de despesa de 2026 porque o PRR acaba, e a despesa fora do PRR sobe 511,8 face aos 771,1 que o PRR deixa. A despesa com pessoal sobe, enquanto a compra de bens e serviços e o investimento descem. Desde 2020 nenhum orçamento inicial da Saúde dos anos com execução concluída chegou ao fim do ano sem ser ultrapassado, e o de 2027 é inferior ao que se estima gastar em 2026. Para quem usa o Serviço Nacional de Saúde, o orçamento de 2027 é mais dinheiro para quem lá trabalha e menos para o que se compra e se constrói, numa altura em que os encargos com medicamentos são maiores do que há um ano, a lista de espera para cirurgia cresceu e cerca de metade do contratado no PRR na saúde está por pagar.

**A recomendação**

A pergunta útil não é se o orçamento da Saúde sobe ou desce, é se chega: a resposta dos últimos seis anos é que não chegou nenhuma vez, e a execução até agosto de 2026, 19,9 % acima de 2025, reforça o risco de nova insuficiência. Quem acompanhar a Saúde em 2027 olha para a síntese mensal da execução orçamental da Entidade Orçamental e para a eventual necessidade de reforço, não apenas para a aprovação. Também acompanha os dados mensais do Serviço Nacional de Saúde: os utentes sem médico de família, a lista de espera para cirurgia e a dívida a fornecedores dizem mais sobre 2027 do que a votação.

**A opinião do lugar de direção**

O ministro e a RTP escolheram cada um a linha que lhes convinha, e as duas são verdadeiras; a discussão sobre «sobe» ou «desce» esconde o que o quadro mostra: um orçamento que paga mais pessoal com menos compras e menos investimento, que guarda em outras despesas correntes mais 271,3 milhões, onde o relatório diz estar a dotação para reforçar contratos-programa ainda por fechar, sem dizer quanto, que conta com receitas próprias a crescer mais de metade sem que o relatório explique de onde vêm, e que, pelo que a execução de 2026 e os seis anos anteriores mostram, corre o risco de voltar a ser ultrapassado. O orçamento da Saúde para 2027 é um orçamento de transição para o fim do PRR, e a sua medida certa conhece-se na execução, não na aprovação. Dizer isto custava mais do que dizer «sobe» ou «cai», e era o que o debate devia. Com estes números, a pergunta ao Governo e aos partidos não é «sobe ou desce»: é com que dinheiro se pagam os encargos com medicamentos que aumentaram 6,1 % e como se financia o investimento depois do PRR, com 52,9 % do contratado na saúde ainda por pagar. As afirmações citadas não respondem a essa pergunta.

##### As parcerias rodoviárias: o que o Estado paga, o que vai pagar e o que não está no quadro

**Como foi dito**

«Vem com um orçamento que entrega 1 700 milhões às parcerias público-privadas rodoviárias», Paulo Raimundo · PCP, na Assembleia da República, a 09.10.2026. A 12.10.2026, Paula Santos · PCP: «Em sentido inverso cresce mais do que o previsto a despesa com as chamadas PPP – rodoviárias, ferroviárias, saúde – com o Governo a desviar mais de 1800 milhões de euros de recursos públicos para os grupos económicos privados, sem que tal se traduza em novas infraestruturas ou investimento nas existentes.» A 15.10.2026, Paulo Raimundo: «Há condições, há recursos e meios, desde logo na Segurança Social, mas há também opções que se podem e têm de fazer, e entre os mais de 1700 milhões de euros que o Governo quer pagar em PPP e o aumento dos reformados, da nossa parte não temos dúvidas da opção a tomar.»

**O que as fontes dizem**

O quadro 4.25 do relatório do Orçamento, as parcerias público-privadas, 2027, em milhões de euros.

Os encargos brutos do setor rodoviário são 1 152; as receitas, 263; os encargos líquidos, 889. As parcerias ferroviárias custam 312 e as da saúde 254, numa linha única cada, sem receitas; os encargos brutos rodoviários mais os encargos ferroviários e da saúde somam 1 718, e o total líquido impresso para todos os setores é 1 438. Previsão, não execução. As linhas setoriais do quadro não somam exatamente o total impresso; o quadro não explica a diferença. O quadro diz que os valores são de caixa e, quando aplicável, incluem o IVA.

Os encargos líquidos rodoviários, ano a ano, pelos relatórios do Orçamento: 1 250 em 2021 (execução), 1 192 em 2022, 1 105 em 2023, 1 012 em 2024, 843 em 2025, 942 em 2026 (estimativas) e 889 em 2027 (orçamento).

O relatório projeta 705 em 2028, 648 em 2029, 77 em 2035 e 17 em 2040, o último ano com encargos rodoviários; em 2030 as receitas excedem os encargos e a linha é negativa, −220.

Para 2027, o relatório do ano passado previa 774 de encargos líquidos; este prevê 889. Segundo o relatório, a diferença vem dos custos da cobrança das portagens e dos pagamentos ligados ao tráfego, que subiram, e das receitas de portagem, que desceram.

Fora do quadro, no capítulo dos riscos, o relatório conta 2 388,2 milhões de euros em pedidos de reequilíbrio financeiro e litígios das concessionárias e subconcessionárias rodoviárias, com dados do primeiro trimestre, reportados a 1.º trimestre de 2026, 1 140 acima do relatório anterior, dos quais 1 122,5 da Brisa, na negociação em curso, e 445 da ação principal da Rotas do Algarve Litoral, em que a Infraestruturas de Portugal paga, por decisão provisória, cerca de 1,3 milhões por mês, mais IVA. A UTAO distingue os pedidos dos encargos efetivos: «São pretensões dos parceiros privados, e não encargos já reconhecidos; a sua concretização, total ou parcial, oneraria o saldo orçamental de anos futuros.»

O Instituto da Mobilidade e dos Transportes (IMT) indica para a concessão da Brisa «Período da Concessão: 1972 – 2035»; a minuta do contrato de concessão de 2008 fixa o fim em 31.12.2035. A comissão de negociação, pelo despacho publicado a 27.12.2024, trata dos alargamentos de vias, dos investimentos contratualmente previstos, da reposição do equilíbrio financeiro, dos acertos de comparticipações, da Circular Sul de Braga, de novos investimentos, dos limites da concessão e da qualidade do serviço. O relatório diz que «Em todo o caso, importa sublinhar que a presente análise não implica qualquer reconhecimento ou assunção, ainda que tácita, de responsabilidades por parte dos parceiros públicos decorrentes das pretensões deduzidas pelos parceiros privados, quer quanto aos respetivos fundamentos, que, na maioria das situações, são rejeitados pelos parceiros públicos, quer quanto aos montantes peticionados.».

Desde 01.01.2025 foram eliminadas as portagens nos lanços e sublanços que a lei enumera: «São eliminadas as taxas de portagem cobradas aos utilizadores nos lanços e sublanços das seguintes autoestradas: a) A4 — Transmontana e Túnel do Marão; b) A13 e A13-1 — Pinhal Interior; c) A22 — Algarve; d) A23 — Beira Interior; e) A24 — Interior Norte; f) A25 — Beiras Litoral e Alta; g) A28 — Litoral Norte, nos troços entre Esposende e Antas, e entre Neiva e Darque.». Em 2023 o Estado limitou a atualização das portagens e paga às concessionárias a diferença para a atualização contratual, pelo decreto-lei de dezembro de 2022 na redação retificada: ««1 — O apoio é assegurado através de um pagamento do Estado, a entregar às concessionárias, em complemento do pagamento das tarifas e taxas de portagem realizado pelos utilizadores, no montante correspondente à diferença entre as tarifas e taxas de portagem que resultariam da aplicação de um coeficiente de atualização para o ano de 2023 de 1,077, equivalente a um aumento de 7,7 %, e as tarifas e taxas de portagem que resultam da aplicação do n.º 1 do artigo anterior.»»; o decreto diz que «O disposto no presente decreto-lei não prejudica a aplicação dos regimes de descontos em vigor.», e os encargos desse apoio são do Orçamento do Estado, pela Direção-Geral do Tesouro e Finanças (a DGTF): «Os encargos resultantes do apoio previsto nos artigos 3.º e 4.º são suportados diretamente pelo Orçamento do Estado, a processar pela DGTF.». O relatório do Orçamento de 2027 inclui-o agora nos encargos brutos: «Regista-se também um aparente aumento dos encargos brutos plurianuais, decorrente da inclusão dos montantes relativos ao apoio pago às concessionárias com titularidade de portagem no âmbito do Decreto-Lei nº 87-A/2022. Este apoio não constava do Relatório do Orçamento do Estado anterior, uma vez que, do ponto de vista da Infraestruturas de Portugal, tem um efeito neutro (o montante desembolsado por esta entidade corresponde ao montante que lhe é atribuído pelo Estado). Contudo, na ótica do setor público como um todo, este apoio configura um encargo efetivo com parcerias público-privadas, pelo que se passa agora a incluir no presente Relatório. Em face desta alteração, os valores relativos a este item não são diretamente comparáveis com os apresentados no Relatório anterior, sendo que a comparabilidade fica assegurada a partir dos próximos Relatórios.». E regista uma negociação ligada à eliminação das portagens: «Salienta-se ainda o desenvolvimento dos trabalhos de negociação no âmbito do contrato de concessão da Beira Interior, na sequência do pedido apresentado pela concessionária no contexto da abolição das portagens, tendo em vista verificar se estão reunidas as condições para a reposição do equilíbrio financeiro do contrato e para negociar os respetivos termos, abrangendo ainda a renegociação de outros aspetos contratuais relevantes e a avaliação de eventuais novos investimentos a realizar.».

**A comparação**

Nenhum dos valores rodoviários do quadro é igual a 1 700 milhões de euros: o número está 548 acima dos encargos brutos e 811 acima dos líquidos.

O número aproxima-se da soma dos encargos brutos rodoviários com os encargos ferroviários e da saúde, 1 718, sem que isso demonstre a conta que lhe deu origem; as rodoviárias são 61,82 % do total líquido. O próprio PCP alargou depois o universo referido às parcerias rodoviárias, ferroviárias e da saúde, a 12.10.2026 e a 15.10.2026, com 1 800 milhões de euros e 1 700 milhões de euros.

O relatório prevê para as parcerias rodoviárias 889 líquidos em 2027 contra 1 250 executados em 2021, −28,9 %; mas mais do que os 843 estimados para 2025: os encargos brutos descem de 1 234 para 1 152, e as receitas previstas descem mais, de 392 para 263. A projeção tem uma tendência de redução, com oscilações, até 17 em 2040.

O número que falta nas três afirmações citadas é o dos pedidos pendentes, 2 388,2, que não está no quadro dos encargos nem nessas afirmações, e que é maior do que os encargos rodoviários brutos e do que o número da primeira afirmação. A negociação da Brisa pode determinar que parte desses pedidos se torna encargo; a concessão termina em 31.12.2035.

**A conclusão**

O relatório prevê 889 milhões líquidos para as parcerias rodoviárias em 2027, −28,9 % face à execução de 2021 mas acima da estimativa para 2025, e o quadro projeta uma tendência de redução, com oscilações, até ao fim dos contratos. O número da primeira afirmação do PCP aproxima-se do custo bruto de todas as parcerias, não do das rodoviárias. E o que pode mudar a conta não está no quadro: 2 388,2 milhões de pedidos das concessionárias, dos quais 1 122,5 numa negociação em curso. Para quem conduz e para quem paga impostos: a lei eliminou portagens desde 01.01.2025; o Estado paga às concessionárias, desde 2023, a diferença entre a atualização limitada das portagens e a contratual, por conta do Orçamento do Estado, e esse apoio entra agora nos encargos brutos do quadro; a negociação da Brisa abrange investimentos e compensações numa concessão que termina em 31.12.2035; e os pedidos pendentes não são encargos efetivos reconhecidos.

**A recomendação**

A discussão útil em 2027 é a negociação com a Brisa e os litígios pendentes, além do valor orçamentado dos pagamentos contratados. Quem quiser vigiar as parcerias olha para o capítulo dos riscos do relatório e para o relatório anual da UTAP, a unidade técnica de acompanhamento de projetos, não só para o quadro dos encargos.

**A opinião do lugar de direção**

O PCP tem razão ao chamar a atenção para o custo das parcerias, mas erra ao atribuir às rodoviárias um número que ultrapassa os seus encargos brutos. As parcerias custam ao Estado mais de mil milhões brutos no ano orçamentado; a afirmação posterior já abrange as rodoviárias, as ferroviárias e as da saúde, mas o seu montante, 1 800 milhões de euros, também excede a soma do quadro. O Governo, por sua vez, apresenta um quadro dos pagamentos contratados e remete para um capítulo de riscos os pedidos que podem mudar a conta. Entre os dois, o leitor fica a saber os pagamentos previstos às concessionárias; fica por saber quanto dos pedidos pendentes se tornará encargo efetivo, e o que os pedidos das concessionárias ligados à eliminação das portagens, como o da Beira Interior, vão custar: é essa a conta que o Parlamento devia pedir antes de votar.

#### EN

##### The Health budget for 2027: 3,0 % without the RRP or −1,5 % in total? Both counts, what changes inside it, and what went unsaid

**As it was said**

«Ora, esta verba do PRR foi excecional. Se retirarmos isso, o orçamento da Saúde sobre 3%», António Leitão Amaro, ministro da Presidência, in a document published by RTP, on 09.10.2026. On the same day, RTP published: «O orçamento para Saúde sofre um corte em 2027. Cai 1,5 por cento. Estão atribuídos 17 mil 858 milhões de euros. Menos 267,5 milhões do que este ano.» On 12.10.2026, Paula Santos · PCP said: «O investimento sofre um corte brutal de 33,7%.»

**What the sources say**

Table 5.37 of the Budget report, the Health programme, in million euros.

Total consolidated expenditure goes from 18 125,9 in 2026 to 17 858,4 in 2027, a change of −1,5 %. Consolidated effective expenditure goes from 18 062,4 to 17 803,1, −1,4 %. Without the RRP, the Recovery and Resilience Plan, consolidated effective expenditure goes from 17 291,3 to 17 803,1, 3,0 %.

Inside it, personnel expenditure goes from 7 783,1 to 8 184,3, 5,2 %; the purchase of goods and services, the programme's largest line, goes from 8 832,9 to 8 436,3, −4,5 %; investment goes from 1 022,5 to 678,3, −33,7 % with the RRP and 22,2 % without it; other current expenditure goes from 32,4 to 303,7, and capital transfers from 272,9 to 0,0.

The financing, comparing the two budgets: tax revenue goes from 15 116,4 to 15 452,2; own revenue from 1 289,5 to 2 017,6, 56,5 %; European funds from 655,0 to 174,6. Transfers to the National Health Service go from 14 935,8 to 15 539,2, 4,0 %.

Since 2020, Health has spent more than its initial budget every year: 11 282,2 budgeted and 11 731,9 executed in 2020; 16 853,5 and 17 241,5 in 2025; in 2026 the initial budget was 17 300,2 and the report's execution estimate is 18 125,9, 825,7 above; the UTAO, starting from another base, counts 915 in effective expenditure.

In the execution to August 2026, the Health programme's effective expenditure was 11 822,6, 19,9 % above the same period of 2025, and the National Health Service had, in those eight months, a balance of −918,5 million euros, with expenditure growing 13,2 %.

In the European comparison, Portugal spent 10,20 % of GDP on health in 2024, the EU 10,16 %; per inhabitant, in current euros and without correction for price levels, 2 764,83 euros against 4 074,88 in the EU; in government schemes and compulsory contributory schemes alone, 6,31 % of GDP against 8,17 %. For practising physicians per hundred thousand inhabitants in 2024, Portugal had 431,35 physicians. Among countries with a value in 2024, Belgium had 334,25 physicians per hundred thousand inhabitants and Greece 626,89.

In the service, by the National Health Service's open data: in August 2026 there were 1 362 294 eligible registered users without an assigned family doctor, by the series that began in July that year and counts only eligible users («Utentes inscritos que cumprem os critérios de elegibilidade para atribuição de Médico de Família. Cálculo: utentes com registo atualizado e contacto com o SNS nos últimos cinco anos.»), so it cannot be compared with the earlier series; the earlier series gave 1 672 130 in June 2026 against 1 669 681 a year earlier. Primary-care consultations were 2 577 538 in August 2026, the latest month, provisional in the source, which says: «As consultas registadas no sistema Vitacare não entram no cálculo destas métricas. Os dados relativos a este indicador são de caráter temporário para o mês publicado mais recente.»; 7,7 % above August 2025; surgeries from January to July 2026, 520 373, −4,4 %; patients on the surgery waiting list, 284 210 in July 2026, 5,8 %.

National Health Service expenditure on medicines, according to Infarmed, was 1 179,3 million euros in outpatient care from January to July and 1 600,9 in hospitals, 6,1 % above the same period of the previous year combined; on contributions under the agreement with the Portuguese Pharmaceutical Industry Association (APIFARMA), Infarmed warns that «Os valores apresentados não refletem a totalidade das contribuições resultantes da implementação do Acordo Governo/APIFARMA e dos contratos de financiamento». National Health Service entities owed external suppliers 1 517,5 million euros in July 2026; overdue payments by health units that are public enterprise entities (EPE) were 689,9 million in August 2026, according to the budget execution reported by the Directorate-General for the Budget; and the National Health Service’s entities settled 1 398,6 million of overdue debts to suppliers through August, matched by capital injections from the State.

The RRP in health, as of 14.10.2026: 2 011 million euros contracted, 947 million paid, financial execution of 47 %; 1 064 million euros remain unpaid, 52,9 % of the contracted amount. Of the 37 milestones and targets for the health component in the annual annex for 2025, 24 are complete, including the management contract for Hospital de Lisboa Oriental.

**The comparison**

RTP's figures, the fall, the amount and the difference, match the line for total consolidated expenditure: −267,5 million euros, −1,5 %. The minister's figure matches the change in the line for consolidated effective expenditure without the RRP, 3,0 %, the one the report writes and the UTAO, Parliament's technical budget support unit, confirms: «Todavia, excluído o efeito do PRR, a despesa aumentaria 3,0%.» The PCP's figure on investment matches the investment line with the RRP, −33,7 %; without the RRP, the same line rises 22,2 %.

The fall comes entirely from the end of the RRP. In 2026 the RRP accounted for 771,1 in effective Health expenditure; in 2027 it is zero, and effective expenditure is the same with and without it, 17 803,1 and 17 803,1. Expenditure outside the RRP rises 511,8, replacing 66,4 % of what the RRP leaves; the difference, −259,3, is the fall in effective expenditure.

What rises and what falls are not the same thing: personnel takes 401,2 more; the purchase of goods and services takes 396,6 less; investment takes 344,2 less; and other current expenditure goes from 32,4 to 303,7, 271,3 more. According to the report, this line is where the provision to reinforce the contract-programmes still to be closed sits for Health, the agreements between the Central Administration of the Health System and the National Health Service's entities; the budget thus books the reinforcement it anticipates, without saying how much. The financing counts on own revenue growing 56,5 % and on European funds falling from 655,0 to 174,6.

The reduction in the RRP is not confined to Health: in 2026 the RRP accounted for 1 472,7 in Finance, 1 357,1 in Economy, 1 133,0 in Infrastructure and housing, 823,2 in Environment and energy and 771,1 in Health. In 2027 expenditure outside the RRP grows 3,0 % in Health, 4,9 % in Education, 8,8 % in Labour, solidarity and social security, 20,8 % in Infrastructure and housing, 18,2 % in Justice and 13,1 % in Internal security; and changes by −7,8 % in Finance, −4,9 % in Economy and −38,2 % in Territorial cohesion.

The budget for 2027, 17 858,4, is below what the report estimates will be spent in 2026, 18 125,9, and 3,6 % above what was spent in 2025, 17 241,5. The UTAO writes, on the execution of the National Health Service in 2027: «Existe um risco de pressão orçamental associado à execução do Serviço Nacional de Saúde (SNS).»

Set beside the service: the purchase of goods and services falls 396,6 million euros while spending on medicines rises 6,1 % in a year; investment falls by a third while 52,9 % of the RRP's contracted health amount is still unpaid; and personnel, up 5,2 %, is one side of a service with 1 362 294 eligible users without an assigned family doctor and a surgery waiting list growing 5,8 % in a year.

**The conclusion**

The three claims correspond to different lines of the table and none presents all three measures together. In 2027, Health is budgeted to receive 267,5 million euros less than the expenditure estimate for 2026 because the RRP ends, and expenditure outside the RRP rises 511,8 against the 771,1 the RRP leaves. Personnel expenditure rises, while the purchase of goods and services and investment fall. Since 2020, no initial Health budget in the years with completed execution has reached the end of the year without being exceeded, and the 2027 one is below what is estimated to be spent in 2026. For those who use the National Health Service, the budget for 2027 is more money for the people who work in it and less for what is bought and built, at a time when expenditure on medicines is higher than a year ago, the surgery waiting list has grown and around half of the contracted RRP health amount is still unpaid.

**The recommendation**

The useful question is not whether the Health budget rises or falls, but whether it is enough: the answer of the last six years is that it never was, and the execution to August 2026, 19,9 % above 2025, reinforces the risk of another shortfall. Whoever follows Health in 2027 watches the Entidade Orçamental's monthly budget execution summary and the possible need for reinforcement, not just the approval. They also follow the National Health Service's monthly data: users without a family doctor, the surgery waiting list and the debt to suppliers say more about 2027 than the vote.

**The editorial seat's opinion**

The minister and RTP each chose the line that suited them, and both are true; the argument over «up» or «down» hides what the table shows: a budget that pays more staff with fewer purchases and less investment, that holds 271,3 million more in other current expenditure, where the report says the provision to reinforce contract-programmes still to be closed sits, without saying how much, that counts on own revenue growing by more than half without the report explaining where it comes from, and that, on the evidence of the 2026 execution and the six years before it, risks being exceeded again. The Health budget for 2027 is a transition budget for the end of the RRP, and its true size will be known in the execution, not at the vote. Saying this cost more than saying «up» or «down», and it was what the debate owed. With these numbers, the question to the Government and the parties is not «up or down»: it is which money pays for medicine expenditure that rose 6,1 % and how investment is financed after the RRP, with 52,9 % of the contracted health amount still unpaid. The quoted statements do not answer that question.

##### The road partnerships: what the State pays, what it will pay, and what the table leaves out

**As it was said**

«Vem com um orçamento que entrega 1 700 milhões às parcerias público-privadas rodoviárias», Paulo Raimundo · PCP, in the Assembleia da República, on 09.10.2026. On 12.10.2026, Paula Santos · PCP: «Em sentido inverso cresce mais do que o previsto a despesa com as chamadas PPP – rodoviárias, ferroviárias, saúde – com o Governo a desviar mais de 1800 milhões de euros de recursos públicos para os grupos económicos privados, sem que tal se traduza em novas infraestruturas ou investimento nas existentes.» On 15.10.2026, Paulo Raimundo: «Há condições, há recursos e meios, desde logo na Segurança Social, mas há também opções que se podem e têm de fazer, e entre os mais de 1700 milhões de euros que o Governo quer pagar em PPP e o aumento dos reformados, da nossa parte não temos dúvidas da opção a tomar.»

**What the sources say**

Table 4.25 of the Budget report, the public-private partnerships, 2027, in million euros.

Gross charges for the road sector are 1 152; revenue, 263; net charges, 889. Rail partnerships cost 312 and health ones 254, each on a single line, with no revenue; gross road charges plus rail and health charges add up to 1 718, and the printed net total for all sectors is 1 438. Forecast, not outturn. The sector rows in the table do not add up exactly to the printed total; the table does not explain the difference. The table says the values are on a cash basis and, where applicable, include VAT.

Net road charges, year by year, in the Budget reports: 1 250 in 2021 (execution), 1 192 in 2022, 1 105 in 2023, 1 012 in 2024, 843 in 2025, 942 in 2026 (estimates) and 889 in 2027 (budget).

The report projects 705 in 2028, 648 in 2029, 77 in 2035 and 17 in 2040, the last year with road charges; in 2030 revenue exceeds charges and the line is negative, −220.

For 2027, last year's report forecast 774 in net charges; this one forecasts 889. According to the report, the difference comes from toll collection costs and traffic-linked payments, which rose, and toll revenue, which fell.

Outside the table, in the risks chapter, the report counts 2 388,2 million euros in financial rebalancing claims and litigation by road concessionaires and subconcessionaires, with first-quarter data referenced to 1st quarter of 2026, 1 140 above the previous report, including 1 122,5 from Brisa, in the ongoing negotiation, and 445 in the main action by Rotas do Algarve Litoral, in which Infraestruturas de Portugal pays, by provisional decision, around 1,3 million a month, plus VAT. The UTAO distinguishes claims from actual charges: «São pretensões dos parceiros privados, e não encargos já reconhecidos; a sua concretização, total ou parcial, oneraria o saldo orçamental de anos futuros.»

The Institute for Mobility and Transport (IMT) gives the Brisa concession period as «Período da Concessão: 1972 – 2035»; the 2008 draft concession contract sets its end on 31.12.2035. Under the order published on 27.12.2024, the negotiating committee covers lane widening, contractually planned investment, restoring financial balance, contribution adjustments, the Braga southern ring road, new investment, concession boundaries and service quality. The report states that «Em todo o caso, importa sublinhar que a presente análise não implica qualquer reconhecimento ou assunção, ainda que tácita, de responsabilidades por parte dos parceiros públicos decorrentes das pretensões deduzidas pelos parceiros privados, quer quanto aos respetivos fundamentos, que, na maioria das situações, são rejeitados pelos parceiros públicos, quer quanto aos montantes peticionados.».

Since 01.01.2025, tolls have been abolished on the stretches the law lists: «São eliminadas as taxas de portagem cobradas aos utilizadores nos lanços e sublanços das seguintes autoestradas: a) A4 — Transmontana e Túnel do Marão; b) A13 e A13-1 — Pinhal Interior; c) A22 — Algarve; d) A23 — Beira Interior; e) A24 — Interior Norte; f) A25 — Beiras Litoral e Alta; g) A28 — Litoral Norte, nos troços entre Esposende e Antas, e entre Neiva e Darque.». In 2023 the State capped the toll update and pays the concessionaires the difference to the contractual update, by the decree-law of December 2022 as rectified: ««1 — O apoio é assegurado através de um pagamento do Estado, a entregar às concessionárias, em complemento do pagamento das tarifas e taxas de portagem realizado pelos utilizadores, no montante correspondente à diferença entre as tarifas e taxas de portagem que resultariam da aplicação de um coeficiente de atualização para o ano de 2023 de 1,077, equivalente a um aumento de 7,7 %, e as tarifas e taxas de portagem que resultam da aplicação do n.º 1 do artigo anterior.»»; the decree says that «O disposto no presente decreto-lei não prejudica a aplicação dos regimes de descontos em vigor.», and the charges of that support fall on the State Budget, through the Directorate-General for Treasury and Finance (the DGTF): «Os encargos resultantes do apoio previsto nos artigos 3.º e 4.º são suportados diretamente pelo Orçamento do Estado, a processar pela DGTF.». The 2027 Budget report now includes it in gross charges: «Regista-se também um aparente aumento dos encargos brutos plurianuais, decorrente da inclusão dos montantes relativos ao apoio pago às concessionárias com titularidade de portagem no âmbito do Decreto-Lei nº 87-A/2022. Este apoio não constava do Relatório do Orçamento do Estado anterior, uma vez que, do ponto de vista da Infraestruturas de Portugal, tem um efeito neutro (o montante desembolsado por esta entidade corresponde ao montante que lhe é atribuído pelo Estado). Contudo, na ótica do setor público como um todo, este apoio configura um encargo efetivo com parcerias público-privadas, pelo que se passa agora a incluir no presente Relatório. Em face desta alteração, os valores relativos a este item não são diretamente comparáveis com os apresentados no Relatório anterior, sendo que a comparabilidade fica assegurada a partir dos próximos Relatórios.». And it records a negotiation linked to the toll abolition: «Salienta-se ainda o desenvolvimento dos trabalhos de negociação no âmbito do contrato de concessão da Beira Interior, na sequência do pedido apresentado pela concessionária no contexto da abolição das portagens, tendo em vista verificar se estão reunidas as condições para a reposição do equilíbrio financeiro do contrato e para negociar os respetivos termos, abrangendo ainda a renegociação de outros aspetos contratuais relevantes e a avaliação de eventuais novos investimentos a realizar.».

**The comparison**

None of the road figures in the table equals 1 700 million euros: the figure is 548 above gross charges and 811 above net charges.

The figure is close to the sum of gross road charges and rail and health charges, 1 718, without that proving the calculation behind it; road partnerships are 61,82 % of the net total. The PCP itself later widened the universe to the road, rail and health partnerships, on 12.10.2026 and on 15.10.2026, with 1 800 million euros and 1 700 million euros.

The report forecasts 889 net for the road partnerships in 2027 against 1 250 executed in 2021, −28,9 %; but more than the 843 estimated for 2025: gross charges fall from 1 234 to 1 152, and the forecast revenue falls further, from 392 to 263. The projection has a downward trend, with fluctuations, to 17 in 2040.

The figure missing from the three quoted claims is that of the pending demands, 2 388,2, which is absent from the charges table and those claims, and exceeds gross road charges and the figure in the first claim. The Brisa negotiation may determine what part of those claims becomes a charge; the concession ends on 31.12.2035.

**The conclusion**

The report forecasts 889 million net for the road partnerships in 2027, −28,9 % against execution in 2021, but above the estimate for 2025, and the table projects a downward trend, with fluctuations, to the end of the contracts. The figure in the PCP's first claim is close to the gross cost of all partnerships, not of the road ones. And what could change the bill is not in the table: 2 388,2 million in concessionaires' claims, 1 122,5 of them in a negotiation under way. For drivers and taxpayers: the law abolished tolls from 01.01.2025; since 2023 the State pays the concessionaires the difference between the capped toll update and the contractual one, charged to the State Budget, and that support now enters the table’s gross charges; the Brisa negotiation covers investment and compensation in a concession ending on 31.12.2035; and pending claims are not recognised actual charges.

**The recommendation**

The useful debate in 2027 is the Brisa negotiation and the pending lawsuits, alongside the budgeted figure for contracted payments. Whoever wants to watch the partnerships looks at the report's risks chapter and at the annual report of UTAP, the technical unit for monitoring projects, not only at the table of charges.

**The editorial seat's opinion**

The PCP is right to draw attention to the cost of partnerships, but wrong to attribute to road partnerships a figure exceeding their gross charges. Partnerships cost the State over a billion gross in the budgeted year; the later claim already covers road, rail and health partnerships, but its amount, 1 800 million euros, also exceeds the sum in the table. The Government, for its part, presents a table of contracted payments and sends the claims that could change the bill to a risks chapter. Between the two, the reader learns the payments forecast for concessionaires; how much of the pending claims will become an actual charge remains unknown, and what the concessionaires’ claims linked to the toll abolition, such as Beira Interior’s, will cost: that is the bill Parliament should ask for before voting.

## A correção V2-e-c

A passagem reduz a citação legal do parágrafo das portagens a dois excertos e põe a lista e o artigo retificado a um toque. Nos recibos, separa a cobertura descrita pelo catálogo da leitura dos valores acumulados, declara o último mês provisório nos três conjuntos e corrige períodos, definições e nomes.

### Decisões

- **V2E-41.** A diferença paga pelo Estado tem por referência a atualização do decreto. A palavra «contratual» sai dessa descrição, da conclusão e das explicações dos dois recibos do apoio.
- **V2E-42.** As portas «a lista» e «o artigo retificado» usam a gramática dos selos com texto declarado. A célula confere o texto e o destino. Os dois outros apoios do relatório conservam os selos da casa. Parênteses integram as duas portas textuais na frase, em ambas as edições.
- **V2E-43.** «Sete» conta as alíneas a) a g) do excerto da lei. O guião confere a sequência e a auditoria declara o apoio dessa palavra.
- **V2E-44.** O estado provisório vem do catálogo próprio de cada conjunto, com excerto, localização e hash na prova. A cobertura do catálogo não prova o reinício anual; esse reinício é conferido nos valores pelo extrator.
- **V2E-45.** O corpo Eurostat alojado contraria a nota pedida no mandato: no universo dos países da União Europeia, há uma ausência em 2024 para PRACT, a Eslováquia, e não quatro. A frase do mandato mantém-se no parágrafo de comparação com a União; os recibos explicitam o universo e a ausência medida. Bélgica e Grécia são os extremos desse universo.
- **V2E-46.** A variação das cirurgias usa o intervalo janeiro a julho no motor, no recibo e na incorporação. A conta apresentada termina com o sinal menos tipográfico. O ano do Infarmed chega pelo token de período.
- **V2E-47.** A definição dos pagamentos em atraso é a nota C54 do quadro alojado da DGO, aplicável desde junho de 2026. Transcreve-se a nota completa, com a data, sem substituir a definição por uma paráfrase.
- **V2E-48.** A dispensa da unidade «texto» exige a prova documental selada. As réguas continuam a recusar um valor ou uma unidade adulterados. O nome editorial da medida deixa de ser apresentado sob o rótulo exclusivo «O nome na fonte».
- **V2E-49.** As traduções dos cinco marcos pertencem ao registo editorial dos nomes. Não alteram a transcrição visual da fonte. A descrição da Beira Interior identifica a parte das negociações do capítulo das parcerias; a opinião distingue o pedido documentado dos pedidos que poderão surgir.
- **V2E-50.** A retificação já estava alojada no motor, mas não tinha seguido no pacote anterior. O recibo passa a declará-la expressamente, e cada grupo de corpos recebe a avaliação de direitos ao lado, como o empacotador existente procura. A edição dos descontos passa a 2022.
- **V2E-51.** A régua cobre as onze expressões de unidade pedidas. Cada planta retira o sufixo de um token numa cópia dos itens reais e põe a célula vermelha. A verificação do HTML continua independente.
- **V2E-52.** O corte da citação do não reconhecimento é edição, não correção de erro. Sai do registo de erros; a correção da Beira Interior fica. A contagem pública volta a onze.
- **V2E-53.** As provas anteriores não são reescritas como se fossem da cabeça entregue. Depois do último commit correm os portões, o inventário e as capturas de entrega; os seus ficheiros guardam a cabeça efetivamente verificada. Não há push nesta passagem.

- **V2E-54.** A régua dos números nas ressalvas reconhece somente os fragmentos exatos das provas auxiliares com ficheiro, hash e campo ligados ao recibo. As plantas adulteram o ano, acrescentam um número fora da citação, retiram o recibo e alteram o hash. O título selado sustenta o identificador da retificação.
- **V2E-55.** O registo selado da história acompanha a retirada editorial autorizada; as restantes entradas ficam intactas. As plantas da correção textual continuam na Beira Interior, e uma asserção exige a ausência do corte editorial no registo de erros.

- **V2E-56.** As citações portuguesas nas ressalvas inglesas são marcadas inteiras como português quando coincidem com as provas seladas do SNS ou com a definição da DGO. A concatenação conserva todos os caracteres. A célula retira essa marca em cópias dos recibos e exige a recusa.
- **V2E-57.** A célula da semana ensaia a correção documental real da Beira Interior. Nas duas línguas, exige também que o corte editorial do não reconhecimento fique fora do registo de erros.

- **V2E-58.** H9 distingue a prosa do campo literal de código incorporável. O campo só sai da leitura depois da conferência integral dos seus bytes, pela mesma regra já usada no portão da língua. Na prova da função da régua, a ocorrência indevida cai de uma para zero; adulterar o código ou retirar a marca de língua continua a ser recusado.

### Estado dos achados da leitura curta

| Achado | Estado | Razão |
|---|---|---|
| 1 | corrigido | Planta da leitura, não erro real; a célula compara o valor do PRR nas duas edições. |
| 2 | corrigido | Planta da leitura; o artigo retificado fica no recibo e sai da citação longa na página. |
| 3 | corrigido | Planta da leitura; a elegibilidade continua presa ao excerto selado. |
| 4 | corrigido | Planta da leitura; valor e excerto do catálogo conferem com o corpo. |
| 5 | corrigido | Planta da leitura; valor e excerto da elegibilidade conferem com o corpo. |
| 6 | corrigido | Atualização de referência do decreto na página, conclusão e recibos. |
| 7 | corrigido | Cobertura atribuída ao catálogo; acumulação atribuída à leitura dos valores, com o reinício anual conferido. |
| 8 | corrigido | Os três conjuntos declaram o último mês provisório; os recibos citam o catálogo próprio. |
| 9 | corrigido | Lista inteira de unidades e plantas nos dados reais dos itens. |
| 10 | corrigido | Extremos dos médicos identificados e comparação das cirurgias datada. A divergência sobre o número de países sem dados fica documentada na V2E-45. |
| 11 | corrigido | Intervalo completo na derivada e sinal menos tipográfico na conta. |
| 12 | corrigido | Artigo longo fora da página; citações restantes sem ponto dos dois lados das aspas. |
| 13 | corrigido | O rótulo distingue a medida editorial do documento na fonte. |
| 14 | corrigido | Edição 2022 no recibo dos descontos. |
| 15 | corrigido | Traduções dos cinco nomes portugueses no registo editorial. |
| 16 | corrigido | Definição DGO transcrita e datada, unidade textual retirada, período Infarmed com ano e intervalo pela forma da casa. |
| 17 | corrigido | Corte editorial fora do registo de erros e contagem pública onze. |
| 18 | corrigido | Pedido singular documentado, hipótese futura distinguida e localização da passagem corrigida. |
| 19 | em parte | Retificação, recibo e direitos conferidos; os grupos de corpos têm direitos ao lado. As citações do catálogo mantêm os endereços API dos pedidos selados. A ferramenta de consulta não conseguiu abrir as páginas humanas dos conjuntos, pelo que não se declara uma porta alternativa verificada. |
| 20 | corrigido | Portões, inventário e capturas de entrega presos à cabeça final; HTML antes e depois guardado e mostrado. As provas das corridas intermédias identificam as respetivas cabeças. |
| 21 | corrigido | As duas frases pedidas para o item 1 foram implementadas; o juízo editorial final pertence à leitura cruzada. |
| 22 | corrigido | O parágrafo das portagens fica com duas citações e a síntese pedida; o juízo editorial final pertence à leitura cruzada. |
| 23 | corrigido | Constatação positiva da leitura anterior. Corpos, recibos e direitos conferidos pelos hashes e pela prova de fontes. |
| 24 | corrigido | Constatação positiva da leitura anterior. O cruzamento com a origem confere as linhas exportadas; as novas cabeças são identificadas nas provas. |
| 25 | corrigido | Constatação positiva da leitura anterior. A célula compara todos os parágrafos com a declaração nas duas edições. |
| 26 | corrigido | Constatação positiva da leitura anterior. As somas SNS e a leitura dos acumulados voltam a ser regeneradas pelo motor. |
| 27 | corrigido | Constatação positiva da leitura anterior. As citações continuam a reproduzir os excertos selados dos corpos. |
| 28 | corrigido | Constatação positiva da leitura anterior. A régua do HTML confere a posição dos selos perante as unidades. |
| 29 | corrigido | Constatação positiva da leitura anterior. Os selos das alíneas do despacho e do exemplo PRR conservam a verificação própria. |
| 30 | corrigido | Constatação positiva da leitura anterior. As derivações PRR conservam expressão e portas para as componentes. |
| 31 | corrigido | Constatação positiva da leitura anterior. Os intervalos conferem no recibo e no código de incorporação, incluindo agora a derivada das cirurgias. |
| 32 | corrigido | Constatação positiva da leitura anterior. As frases já corrigidas na passagem anterior são preservadas, com os acertos desta passagem. |
| 33 | corrigido | Constatação positiva da leitura anterior. Os cortes editoriais anteriores mantêm-se, sem passar a contar como erros. |
| 34 | corrigido | Constatação positiva da leitura anterior. Os nomes das medidas mantêm-se; o rótulo já não os apresenta como transcrição exclusiva da fonte. |
| 35 | corrigido | Constatação positiva da leitura anterior. As portas continuam a seguir usos reais e componentes transitivas. |
| 36 | corrigido | Constatação positiva da leitura anterior. As provas continuam a recusar a perda do período e a alteração dos valores; a opinião usa o pedido documentado. |
| 37 | corrigido | Constatação positiva da leitura anterior. Os campos do painel mantêm a unidade selada; a dispensa das linhas textuais também exige a prova. |
| 38 | corrigido | Constatação positiva da leitura anterior. As funções documentais continuam sujeitas às plantas das formas inválidas. |
| 39 | corrigido | Constatação positiva da leitura anterior. As contagens novas são lidas dos resultados da passagem; as antigas não são repetidas como atuais. |

### Medição e auditoria

Parágrafo das portagens, PT: 2974 caracteres antes e 893 depois, medidos pelo texto do HTML sem os selos.

Parágrafo das portagens, EN: 2952 caracteres antes e 871 depois, medidos pelo texto do HTML sem os selos.

Auditoria das palavras: 427 folhas, 433 partes e 5283 apoios. As sete autoestradas, o universo dos médicos, a definição DGO e as ressalvas provisórias são recontados em `c/fontes-conferidas.json`. A palavra «sete» tem uma parte própria na auditoria.

### HTML de uma frase antes e depois

PT, antes:

```html
 Nos médicos em exercício por cem mil habitantes, em <a class="discussao-periodo" data-discussao-periodo="eurostat-pt-phys" href="/livro-razao/eurostat-pt-phys"><span class="data-da-linha" data-nonledger="data-da-linha" data-de-linha="eurostat-pt-phys" data-de-campo="reference_date">2024</span></a>, Portugal tinha <span class="claim claim-com-chip"><span data-claim="eurostat-pt-phys" class="claim-value">431,35</span><a class="src-chip" href="/livro-razao/eurostat-pt-phys" data-nonledger="proveniencia" data-selo-etiqueta="Eurostat" title="Eurostat"><span class="src-chip-texto">fonte</span><span class="vh"> · <span lang="en">Eurostat</span></span></a></span> médicos. Entre os países com valor em <a class="discussao-periodo" data-discussao-periodo="eurostat-pt-phys" href="/livro-razao/eurostat-pt-phys"><span class="data-da-linha" data-nonledger="data-da-linha" data-de-linha="eurostat-pt-phys" data-de-campo="reference_date">2024</span></a>, a Bélgica tinha <span class="claim claim-com-chip"><span data-claim="eurostat-be-phys" class="claim-value">334,25</span><a class="src-chip" href="/livro-razao/eurostat-be-phys" data-nonledger="proveniencia" data-selo-etiqueta="Eurostat" title="Eurostat"><span class="src-chip-texto">fonte</span><span class="vh"> · <span lang="en">Eurostat</span></span></a></span> médicos por cem mil habitantes e a Grécia <span class="claim claim-com-chip"><span data-claim="eurostat-el-phys" class="claim-value">626,89</span><a class="src-chip" href="/livro-razao/eurostat-el-phys" data-nonledger="proveniencia" data-selo-etiqueta="Eurostat" title="Eurostat"><span class="src-chip-texto">fonte</span><span class="vh"> · <span lang="en">Eurostat</span></span></a></span>.
```

PT, depois:

```html
 Portugal tinha <span class="claim claim-com-chip"><span data-claim="eurostat-pt-phys" class="claim-value">431,35</span><a class="src-chip" href="/livro-razao/eurostat-pt-phys" data-nonledger="proveniencia" data-selo-etiqueta="Eurostat" title="Eurostat"><span class="src-chip-texto">fonte</span><span class="vh"> · <span lang="en">Eurostat</span></span></a></span> médicos em exercício por cem mil habitantes em <a class="discussao-periodo" data-discussao-periodo="eurostat-pt-phys" href="/livro-razao/eurostat-pt-phys"><span class="data-da-linha" data-nonledger="data-da-linha" data-de-linha="eurostat-pt-phys" data-de-campo="reference_date">2024</span></a>, entre a Bélgica, com o valor mais baixo dos países com dados (<span class="claim claim-com-chip"><span data-claim="eurostat-be-phys" class="claim-value">334,25</span><a class="src-chip" href="/livro-razao/eurostat-be-phys" data-nonledger="proveniencia" data-selo-etiqueta="Eurostat" title="Eurostat"><span class="src-chip-texto">fonte</span><span class="vh"> · <span lang="en">Eurostat</span></span></a></span>), e a Grécia, com o mais alto (<span class="claim claim-com-chip"><span data-claim="eurostat-el-phys" class="claim-value">626,89</span><a class="src-chip" href="/livro-razao/eurostat-el-phys" data-nonledger="proveniencia" data-selo-etiqueta="Eurostat" title="Eurostat"><span class="src-chip-texto">fonte</span><span class="vh"> · <span lang="en">Eurostat</span></span></a></span>).
```

EN, antes:

```html
 For practising physicians per hundred thousand inhabitants in <a class="discussao-periodo" data-discussao-periodo="eurostat-pt-phys" href="/en/ledger/eurostat-pt-phys"><span class="data-da-linha" data-nonledger="data-da-linha" data-de-linha="eurostat-pt-phys" data-de-campo="reference_date">2024</span></a>, Portugal had <span class="claim claim-com-chip"><span data-claim="eurostat-pt-phys" class="claim-value">431,35</span><a class="src-chip" href="/en/ledger/eurostat-pt-phys" data-nonledger="proveniencia" data-selo-etiqueta="Eurostat" title="Eurostat"><span class="src-chip-texto">source</span><span class="vh"> · <span>Eurostat</span></span></a></span> physicians. Among countries with a value in <a class="discussao-periodo" data-discussao-periodo="eurostat-pt-phys" href="/en/ledger/eurostat-pt-phys"><span class="data-da-linha" data-nonledger="data-da-linha" data-de-linha="eurostat-pt-phys" data-de-campo="reference_date">2024</span></a>, Belgium had <span class="claim claim-com-chip"><span data-claim="eurostat-be-phys" class="claim-value">334,25</span><a class="src-chip" href="/en/ledger/eurostat-be-phys" data-nonledger="proveniencia" data-selo-etiqueta="Eurostat" title="Eurostat"><span class="src-chip-texto">source</span><span class="vh"> · <span>Eurostat</span></span></a></span> physicians per hundred thousand inhabitants and Greece <span class="claim claim-com-chip"><span data-claim="eurostat-el-phys" class="claim-value">626,89</span><a class="src-chip" href="/en/ledger/eurostat-el-phys" data-nonledger="proveniencia" data-selo-etiqueta="Eurostat" title="Eurostat"><span class="src-chip-texto">source</span><span class="vh"> · <span>Eurostat</span></span></a></span>.
```

EN, depois:

```html
 Portugal had <span class="claim claim-com-chip"><span data-claim="eurostat-pt-phys" class="claim-value">431,35</span><a class="src-chip" href="/en/ledger/eurostat-pt-phys" data-nonledger="proveniencia" data-selo-etiqueta="Eurostat" title="Eurostat"><span class="src-chip-texto">source</span><span class="vh"> · <span>Eurostat</span></span></a></span> practising physicians per hundred thousand inhabitants in <a class="discussao-periodo" data-discussao-periodo="eurostat-pt-phys" href="/en/ledger/eurostat-pt-phys"><span class="data-da-linha" data-nonledger="data-da-linha" data-de-linha="eurostat-pt-phys" data-de-campo="reference_date">2024</span></a>, between Belgium, with the lowest value among countries with data (<span class="claim claim-com-chip"><span data-claim="eurostat-be-phys" class="claim-value">334,25</span><a class="src-chip" href="/en/ledger/eurostat-be-phys" data-nonledger="proveniencia" data-selo-etiqueta="Eurostat" title="Eurostat"><span class="src-chip-texto">source</span><span class="vh"> · <span>Eurostat</span></span></a></span>), and Greece, with the highest (<span class="claim claim-com-chip"><span data-claim="eurostat-el-phys" class="claim-value">626,89</span><a class="src-chip" href="/en/ledger/eurostat-el-phys" data-nonledger="proveniencia" data-selo-etiqueta="Eurostat" title="Eurostat"><span class="src-chip-texto">source</span><span class="vh"> · <span>Eurostat</span></span></a></span>).
```

### Frases novas e mudadas tal como renderizam

Os parágrafos abaixo são extraídos do HTML e comparados pela célula com a declaração nas duas edições. Incluem o contexto das frases modificadas.

#### PT

saude-no-orcamento, `seccoes[1].conteudo[6].paragrafo`:

Na comparação europeia, Portugal gastou em saúde 10,20 % do PIB em 2024, a União 10,16 %; por habitante, em euros correntes e sem correção pelos preços, 2 764,83 euros contra 4 074,88 na União; só nos regimes públicos e nos regimes contributivos obrigatórios, 6,31 % do PIB contra 8,17 %. Portugal tinha 431,35 médicos em exercício por cem mil habitantes em 2024, entre a Bélgica, com o valor mais baixo dos países com dados (334,25), e a Grécia, com o mais alto (626,89).

saude-no-orcamento, `seccoes[1].conteudo[7].paragrafo`:

No serviço, pelos dados abertos do Serviço Nacional de Saúde: em agosto de 2026 havia 1 362 294 utentes elegíveis inscritos sem médico de família atribuído, pela série que começou em julho desse ano e conta só os utentes elegíveis («Utentes inscritos que cumprem os critérios de elegibilidade para atribuição de Médico de Família. Cálculo: utentes com registo atualizado e contacto com o SNS nos últimos cinco anos.»), que por isso não se compara com a anterior; a série anterior dava 1 672 130 em junho de 2026 contra 1 669 681 um ano antes. As consultas nos cuidados primários foram 2 577 538 em agosto de 2026, o último mês, provisório na fonte, que diz: «As consultas registadas no sistema Vitacare não entram no cálculo destas métricas. Os dados relativos a este indicador são de caráter temporário para o mês publicado mais recente.»; 7,7 % acima de agosto de 2025; as cirurgias de janeiro a julho de 2026, 520 373, −4,4 % face a janeiro a julho de 2025; os inscritos para cirurgia, 284 210 em julho de 2026, 5,8 % face a um ano antes; nos três conjuntos, o último mês é provisório na fonte.

saude-no-orcamento, `seccoes[1].conteudo[8].paragrafo`:

Os encargos do Serviço Nacional de Saúde com medicamentos, pelo Infarmed, foram de 1 179,3 milhões de euros em ambulatório de janeiro a julho de 2026 e de 1 600,9 em meio hospitalar, 6,1 % acima do mesmo período do ano anterior no conjunto; sobre as contribuições do acordo com a Associação Portuguesa da Indústria Farmacêutica (APIFARMA), o Infarmed avisa que «Os valores apresentados não refletem a totalidade das contribuições resultantes da implementação do Acordo Governo/APIFARMA e dos contratos de financiamento». A dívida das entidades do Serviço Nacional de Saúde a fornecedores externos era de 1 517,5 milhões de euros em julho de 2026; os pagamentos em atraso das unidades de saúde que são entidades públicas empresariais (EPE), 689,9 milhões em agosto de 2026, pela execução orçamental da Direção-Geral do Orçamento; e as entidades do Serviço Nacional de Saúde regularizaram 1 398,6 milhões de dívidas vencidas a fornecedores até agosto, com contrapartida em reforços de capital pelo Estado.

parcerias-rodoviarias, `seccoes[1].conteudo[6].paragrafo`:

O Instituto da Mobilidade e dos Transportes (IMT) indica para a concessão da Brisa «Período da Concessão: 1972 – 2035»; a minuta do contrato de concessão de 2008 fixa o fim em 31.12.2035. A comissão de negociação, pelo despacho publicado a 27.12.2024, trata dos alargamentos de vias, dos investimentos contratualmente previstos, da reposição do equilíbrio financeiro, dos acertos de comparticipações, da Circular Sul de Braga, de novos investimentos, dos limites da concessão e da qualidade do serviço. O relatório diz que «Em todo o caso, importa sublinhar que a presente análise não implica qualquer reconhecimento ou assunção, ainda que tácita, de responsabilidades por parte dos parceiros públicos decorrentes das pretensões deduzidas pelos parceiros privados, quer quanto aos respetivos fundamentos, que, na maioria das situações, são rejeitados pelos parceiros públicos, quer quanto aos montantes peticionados.»

parcerias-rodoviarias, `seccoes[1].conteudo[7].paragrafo`:

Desde 01.01.2025 a lei eliminou as portagens em lanços e sublanços de sete autoestradas, que enumera (a lista). Em 2023 o Estado limitou a atualização das portagens e paga às concessionárias, por conta do Orçamento do Estado, a diferença para a atualização que o decreto-lei de dezembro de 2022 toma como referência (o artigo retificado); o decreto diz que «O disposto no presente decreto-lei não prejudica a aplicação dos regimes de descontos em vigor.», e os encargos são do Orçamento do Estado, pela Direção-Geral do Tesouro e Finanças (a DGTF): «Os encargos resultantes do apoio previsto nos artigos 3.º e 4.º são suportados diretamente pelo Orçamento do Estado, a processar pela DGTF.» O relatório do Orçamento de 2027 inclui agora esse apoio nos encargos brutos, e regista uma negociação com a concessionária da Beira Interior na sequência de um pedido ligado à eliminação das portagens.

parcerias-rodoviarias, `seccoes[3].conteudo[0].paragrafo`:

O relatório prevê 889 milhões líquidos para as parcerias rodoviárias em 2027, −28,9 % face à execução de 2021 mas acima da estimativa para 2025, e o quadro projeta uma tendência de redução, com oscilações, até ao fim dos contratos. O número da primeira afirmação do PCP aproxima-se do custo bruto de todas as parcerias, não do das rodoviárias. E o que pode mudar a conta não está no quadro: 2 388,2 milhões de pedidos das concessionárias, dos quais 1 122,5 numa negociação em curso. Para quem conduz e para quem paga impostos: a lei eliminou portagens desde 01.01.2025; o Estado paga às concessionárias, desde 2023, a diferença entre a atualização limitada das portagens e a de referência do decreto, por conta do Orçamento do Estado, e esse apoio entra agora nos encargos brutos do quadro; a negociação da Brisa abrange investimentos e compensações numa concessão que termina em 31.12.2035; e os pedidos pendentes não são encargos efetivos reconhecidos.

parcerias-rodoviarias, `seccoes[5].conteudo[0].paragrafo`:

O PCP tem razão ao chamar a atenção para o custo das parcerias, mas erra ao atribuir às rodoviárias um número que ultrapassa os seus encargos brutos. As parcerias custam ao Estado mais de mil milhões brutos no ano orçamentado; a afirmação posterior já abrange as rodoviárias, as ferroviárias e as da saúde, mas o seu montante, 1 800 milhões de euros, também excede a soma do quadro. O Governo, por sua vez, apresenta um quadro dos pagamentos contratados e remete para um capítulo de riscos os pedidos que podem mudar a conta. Entre os dois, o leitor fica a saber os pagamentos previstos às concessionárias; fica por saber quanto dos pedidos pendentes se tornará encargo efetivo, e o que o pedido da concessionária da Beira Interior ligado à eliminação das portagens, e os que vierem, vão custar: é essa a conta que o Parlamento devia pedir antes de votar.

#### EN

saude-no-orcamento, `seccoes[1].conteudo[6].paragrafo`:

In the European comparison, Portugal spent 10,20 % of GDP on health in 2024, the EU 10,16 %; per inhabitant, in current euros and without correction for price levels, 2 764,83 euros against 4 074,88 in the EU; in government schemes and compulsory contributory schemes alone, 6,31 % of GDP against 8,17 %. Portugal had 431,35 practising physicians per hundred thousand inhabitants in 2024, between Belgium, with the lowest value among countries with data (334,25), and Greece, with the highest (626,89).

saude-no-orcamento, `seccoes[1].conteudo[7].paragrafo`:

In the service, by the National Health Service's open data: in August 2026 there were 1 362 294 eligible registered users without an assigned family doctor, by the series that began in July that year and counts only eligible users («Utentes inscritos que cumprem os critérios de elegibilidade para atribuição de Médico de Família. Cálculo: utentes com registo atualizado e contacto com o SNS nos últimos cinco anos.»), so it cannot be compared with the earlier series; the earlier series gave 1 672 130 in June 2026 against 1 669 681 a year earlier. Primary-care consultations were 2 577 538 in August 2026, the latest month, provisional in the source, which says: «As consultas registadas no sistema Vitacare não entram no cálculo destas métricas. Os dados relativos a este indicador são de caráter temporário para o mês publicado mais recente.»; 7,7 % above August 2025; surgeries from January to July 2026, 520 373, −4,4 % against January to July 2025; patients on the surgery waiting list, 284 210 in July 2026, 5,8 % against a year earlier; in all three datasets, the latest month is provisional at the source.

saude-no-orcamento, `seccoes[1].conteudo[8].paragrafo`:

National Health Service expenditure on medicines, according to Infarmed, was 1 179,3 million euros in outpatient care from January to July 2026 and 1 600,9 in hospitals, 6,1 % above the same period of the previous year combined; on contributions under the agreement with the Portuguese Pharmaceutical Industry Association (APIFARMA), Infarmed warns that «Os valores apresentados não refletem a totalidade das contribuições resultantes da implementação do Acordo Governo/APIFARMA e dos contratos de financiamento». National Health Service entities owed external suppliers 1 517,5 million euros in July 2026; overdue payments by health units that are public enterprise entities (EPE) were 689,9 million in August 2026, according to the budget execution reported by the Directorate-General for the Budget; and the National Health Service's entities settled 1 398,6 million of overdue debts to suppliers through August, matched by capital injections from the State.

parcerias-rodoviarias, `seccoes[1].conteudo[6].paragrafo`:

The Institute for Mobility and Transport (IMT) gives the Brisa concession period as «Período da Concessão: 1972 – 2035»; the 2008 draft concession contract sets its end on 31.12.2035. Under the order published on 27.12.2024, the negotiating committee covers lane widening, contractually planned investment, restoring financial balance, contribution adjustments, the Braga southern ring road, new investment, concession boundaries and service quality. The report states that «Em todo o caso, importa sublinhar que a presente análise não implica qualquer reconhecimento ou assunção, ainda que tácita, de responsabilidades por parte dos parceiros públicos decorrentes das pretensões deduzidas pelos parceiros privados, quer quanto aos respetivos fundamentos, que, na maioria das situações, são rejeitados pelos parceiros públicos, quer quanto aos montantes peticionados.»

parcerias-rodoviarias, `seccoes[1].conteudo[7].paragrafo`:

Since 01.01.2025 the law has abolished tolls on stretches of seven motorways, which it lists (the list). In 2023 the State capped the toll update and pays the concessionaires, charged to the State Budget, the difference to the update that the decree-law of December 2022 takes as its reference (the rectified article); the decree says that «O disposto no presente decreto-lei não prejudica a aplicação dos regimes de descontos em vigor.», and the charges fall on the State Budget, through the Directorate-General for Treasury and Finance (the DGTF): «Os encargos resultantes do apoio previsto nos artigos 3.º e 4.º são suportados diretamente pelo Orçamento do Estado, a processar pela DGTF.» The 2027 Budget report now includes that support in gross charges, and records a negotiation with the Beira Interior concessionaire following a claim linked to the toll abolition.

parcerias-rodoviarias, `seccoes[3].conteudo[0].paragrafo`:

The report forecasts 889 million net for the road partnerships in 2027, −28,9 % against execution in 2021, but above the estimate for 2025, and the table projects a downward trend, with fluctuations, to the end of the contracts. The figure in the PCP's first claim is close to the gross cost of all partnerships, not of the road ones. And what could change the bill is not in the table: 2 388,2 million in concessionaires' claims, 1 122,5 of them in a negotiation under way. For drivers and taxpayers: the law abolished tolls from 01.01.2025; since 2023 the State pays the concessionaires the difference between the capped toll update and the decree's reference update, charged to the State Budget, and that support now enters the table's gross charges; the Brisa negotiation covers investment and compensation in a concession ending on 31.12.2035; and pending claims are not recognised actual charges.

parcerias-rodoviarias, `seccoes[5].conteudo[0].paragrafo`:

The PCP is right to draw attention to the cost of partnerships, but wrong to attribute to road partnerships a figure exceeding their gross charges. Partnerships cost the State over a billion gross in the budgeted year; the later claim already covers road, rail and health partnerships, but its amount, 1 800 million euros, also exceeds the sum in the table. The Government, for its part, presents a table of contracted payments and sends the claims that could change the bill to a risks chapter. Between the two, the reader learns the payments forecast for concessionaires; how much of the pending claims will become an actual charge remains unknown, and what the Beira Interior concessionaire's claim linked to the toll abolition, and those that may follow, will cost: that is the bill Parliament should ask for before voting.

### Nomes e ressalvas dos recibos, tal como renderizam

As repetições literais agrupam-se pelos identificadores. O ficheiro `c/recibos-conferidos.json` conserva cada recibo nas duas edições.

#### PT

`der-sns-cirurgias-variacao-pct`, `sns-cirurgias-2026-07`:

O catálogo do SNS descreve a cobertura do conjunto como «De janeiro de 2013 ao mês n-2 anterior ao atual (valores acumulados)»; a leitura de acumulado de janeiro ao mês vem dos próprios valores, que repõem a zero em janeiro (conferido nos corpos pelo guião do bloco). Último mês provisório. O catálogo do SNS, intervencoes-cirurgicas, diz: «Os dados relativos ao mês n-2, publicados até ao último dia útil do mês n, têm caráter provisório, sujeitos a eventuais atualizações.»

`dgo-atraso-45-p`:

Definição da DGO, aplicável desde junho de 2026, na nota do quadro de agosto de 2026: «A partir de junho de 2026, na sequência alteração da Lei dos Compromissos e Pagamentos em Atraso (LCPA) pela Lei n.º 24/2026, de 1 de junho, os pagamentos em atraso passaram a corresponder às contas a pagar não liquidadas para além dos prazos legalmente aplicáveis de 30 dias, em regra para entidades públicas, ou de 60 dias para as entidades que integram o Serviço Nacional de Saúde e outros casos legalmente previstos. A redação anterior da LCPA estabelecia que constituíam pagamentos em atraso as contas a pagar que permanecessem nessa situação mais de 90 dias após a data acordada.»

`eurostat-be-phys`, `eurostat-el-phys`, `eurostat-pt-phys`:

A comparação entre os países da União Europeia usa médicos em exercício em 2024. Na União Europeia, a Eslováquia não tem valor para esta categoria e ano; não se substituem por médicos profissionalmente ativos ou habilitados.

`infarmed-ambulatorio-2026-07-p5-acumulado-encargo`:

Encargos SNS com medicamentos em ambulatório, janeiro a julho de 2026

`infarmed-ambulatorio-2026-07-p5-homologo-encargo`:

Encargos SNS com medicamentos em ambulatório, janeiro a julho de 2025

`infarmed-hospitalar-2026-07-p5-acumulado-encargo`:

Encargos SNS com medicamentos em meio hospitalar, janeiro a julho de 2026

`infarmed-hospitalar-2026-07-p5-homologo-encargo`:

Encargos SNS com medicamentos em meio hospitalar, janeiro a julho de 2025

`pe-dl87a-apoio-retificado`:

Redação da Declaração de Retificação n.º 2/2023, alojada com recibo e avaliação de direitos.

`prr-marcos-metas-2025-p2-1-13-estado`:

Marco ou meta 1.13: Entrada em vigor dos novos termos para a referenciação de episódios de urgência avaliados como brancos, azuis ou verdes nos serviços de urgência hospitalar para outros tipos de serviços de saúde, incluindo cuidados de saúde primários: Estado

`prr-marcos-metas-2025-p2-1-20-estado`:

Marco ou meta 1.20: Entrada em vigor do regulamento relativo à atribuição de apoios financeiros pelas Administrações Regionais de Saúde: Estado

`prr-marcos-metas-2025-p2-1-29-estado`:

Marco ou meta 1.29: Implantação do sistema de classificação, do perfil funcional e do sistema de referenciação dos utentes para o modelo regional de cuidados continuados integrados da Madeira: Estado

`prr-marcos-metas-2025-p2-1-4-estado`:

Marco ou meta 1.4: Entrada em vigor do novo Decreto-Lei de Saúde Mental, que estabelecerá os princípios para a organização dos cuidados de saúde mental: Estado

`prr-marcos-metas-2025-p2-1-6-estado`:

Marco ou meta 1.6: Entrada em vigor do novo modelo de contratos de gestão: Estado

`sns-cirurgias-2025-07`:

O catálogo do SNS descreve a cobertura do conjunto como «De janeiro de 2013 ao mês n-2 anterior ao atual (valores acumulados)»; a leitura de acumulado de janeiro ao mês vem dos próprios valores, que repõem a zero em janeiro (conferido nos corpos pelo guião do bloco). Não é o último mês publicado. O catálogo do SNS, intervencoes-cirurgicas, diz: «Os dados relativos ao mês n-2, publicados até ao último dia útil do mês n, têm caráter provisório, sujeitos a eventuais atualizações.»

`sns-consultas-csp-2026-08`:

Último mês provisório. O catálogo do SNS, evolucao-das-consultas-medicas-nos-csp, diz: «Os dados relativos a este indicador são de caráter temporário para o mês publicado mais recente.»

`sns-consultas-hospitalares-2025-07`, `sns-consultas-hospitalares-2026-07`, `sns-urgencias-2025-07`, `sns-urgencias-2026-07`:

O catálogo do SNS descreve a cobertura do conjunto como «De janeiro de 2013 ao mês n-2 anterior ao atual (valores acumulados)»; a leitura de acumulado de janeiro ao mês vem dos próprios valores, que repõem a zero em janeiro (conferido nos corpos pelo guião do bloco).

`sns-lista-cirurgia-2026-07`:

Último mês provisório. O catálogo do SNS, inscritos-em-lic-dentro-do-tmrg-180-dias, diz: «Os dados relativos ao mês n-2, publicados até ao último dia útil do mês n, têm caráter provisório, sujeitos a eventuais atualizações.»

#### EN

`der-sns-cirurgias-variacao-pct`, `sns-cirurgias-2026-07`:

The NHS catalogue describes the dataset coverage as «De janeiro de 2013 ao mês n-2 anterior ao atual (valores acumulados)»; the reading as accumulated from January through the month comes from the values themselves, which reset to zero in January (checked in the bodies by the block script). Latest month provisional. The NHS catalogue, intervencoes-cirurgicas, says: «Os dados relativos ao mês n-2, publicados até ao último dia útil do mês n, têm caráter provisório, sujeitos a eventuais atualizações.»

`dgo-atraso-45-p`:

DGO definition, applicable since June 2026, in the August 2026 table note: «A partir de junho de 2026, na sequência alteração da Lei dos Compromissos e Pagamentos em Atraso (LCPA) pela Lei n.º 24/2026, de 1 de junho, os pagamentos em atraso passaram a corresponder às contas a pagar não liquidadas para além dos prazos legalmente aplicáveis de 30 dias, em regra para entidades públicas, ou de 60 dias para as entidades que integram o Serviço Nacional de Saúde e outros casos legalmente previstos. A redação anterior da LCPA estabelecia que constituíam pagamentos em atraso as contas a pagar que permanecessem nessa situação mais de 90 dias após a data acordada.»

`eurostat-be-phys`, `eurostat-el-phys`, `eurostat-pt-phys`:

The comparison between European Union countries uses practising physicians in 2024. In the European Union, Slovakia has no value for this category and year; professionally active or licensed physicians do not replace them.

`infarmed-ambulatorio-2026-07-p5-acumulado-encargo`:

NHS medicines expenditure in outpatient care, January to July 2026

`infarmed-ambulatorio-2026-07-p5-homologo-encargo`:

NHS medicines expenditure in outpatient care, January to July 2025

`infarmed-hospitalar-2026-07-p5-acumulado-encargo`:

NHS medicines expenditure in hospitals, January to July 2026

`infarmed-hospitalar-2026-07-p5-homologo-encargo`:

NHS medicines expenditure in hospitals, January to July 2025

`pe-dl87a-apoio-retificado`:

Wording of Rectification Declaration No. 2/2023, preserved with its request receipt and rights assessment.

`prr-marcos-metas-2025-p2-1-13-estado`:

Milestone or target 1.13: Entry into force of new terms for referring emergency episodes triaged as white, blue or green in hospital emergency departments to other types of health services, including primary care: Status

`prr-marcos-metas-2025-p2-1-20-estado`:

Milestone or target 1.20: Entry into force of the regulation on financial support awarded by Regional Health Administrations: Status

`prr-marcos-metas-2025-p2-1-29-estado`:

Milestone or target 1.29: Implementation of the classification system, functional profile and user referral system for Madeira's regional integrated continuing care model: Status

`prr-marcos-metas-2025-p2-1-4-estado`:

Milestone or target 1.4: Entry into force of the new Mental Health Decree-Law establishing the principles for the organisation of mental health care: Status

`prr-marcos-metas-2025-p2-1-6-estado`:

Milestone or target 1.6: Entry into force of the new management contract model: Status

`sns-cirurgias-2025-07`:

The NHS catalogue describes the dataset coverage as «De janeiro de 2013 ao mês n-2 anterior ao atual (valores acumulados)»; the reading as accumulated from January through the month comes from the values themselves, which reset to zero in January (checked in the bodies by the block script). Not the latest published month. The NHS catalogue, intervencoes-cirurgicas, says: «Os dados relativos ao mês n-2, publicados até ao último dia útil do mês n, têm caráter provisório, sujeitos a eventuais atualizações.»

`sns-consultas-csp-2026-08`:

Latest month provisional. The NHS catalogue, evolucao-das-consultas-medicas-nos-csp, says: «Os dados relativos a este indicador são de caráter temporário para o mês publicado mais recente.»

`sns-consultas-hospitalares-2025-07`, `sns-consultas-hospitalares-2026-07`, `sns-urgencias-2025-07`, `sns-urgencias-2026-07`:

The NHS catalogue describes the dataset coverage as «De janeiro de 2013 ao mês n-2 anterior ao atual (valores acumulados)»; the reading as accumulated from January through the month comes from the values themselves, which reset to zero in January (checked in the bodies by the block script).

`sns-lista-cirurgia-2026-07`:

Latest month provisional. The NHS catalogue, inscritos-em-lic-dentro-do-tmrg-180-dias, says: «Os dados relativos ao mês n-2, publicados até ao último dia útil do mês n, têm caráter provisório, sujeitos a eventuais atualizações.»

### Verificação e entrega

Cabeça desta corrida: `5fc6c0e738b483483ceb7bccf8d89e8269adb686`. Motor: `d4d0442323cfbd9bcbd79bcfcac7d169c5903c2e`.

Códigos lidos dos ficheiros dos portões: `build=0`, `verify=1`, `typecheck=0`.

A corrida intermédia acima foi recusada por H9 (marca de língua na ressalva inglesa da DGO) e W1 (plantas ainda presas à correção editorial retirada). Depois dos acertos, os ensaios locais passaram: 684 plantas dos itens em 684, 19 plantas da semana em 19 e typecheck com código 0. A medição e a leitura visual desta corrida estão identificadas pela sua cabeça, sem serem apresentadas como a entrega final.

O corte da citação do não reconhecimento foi uma edição de extensão, sem erro factual na citação anterior. A retirada da chamada de nota colada a «negociação» na passagem da Beira Interior continua registada como correção.

As provas locais iniciais dizem expressamente que não são a cabeça entregue. O fecho da entrega corre depois do último commit e guarda a cabeça real, os códigos, o inventário e as capturas em `<temporario>/v2ec-entrega/`; os registos dos portões ficam em `<temporario>/v2ec-portoes-entrega-2/`. O relatório de fecho dessa pasta cita os códigos dessa cabeça, sem criar um commit posterior que voltasse a tornar a prova antiga.

As capturas intermédias são vinte páginas completas e noventa recortes; vinte e quatro recortes foram lidos visualmente. As vinte páginas não têm transbordo horizontal. O inventário dessa cabeça tem zero frases sem classe e zero declarações vivas ausentes. O cruzamento com a origem saiu com código 0. O motor passou o core.gate completo no commit d4d0442323cfbd9bcbd79bcfcac7d169c5903c2e, que permanece sem alterações. As provas estão em c/capturas.json, c/inspecao-visual.json, c/inventario.json e c/motor-prova.json.

A primeira tentativa de commit do motor foi recusada pela divergência entre o relatório gerado e o livro regenerado; o relatório foi regenerado, e a suíte específica passou. A primeira tentativa dos portões não correu porque havia guiões de prova ainda por registar. A corrida seguinte recusou a história selada ainda desatualizada e os números das citações auxiliares que a régua ainda não reconhecia. Ambas as causas foram corrigidas com plantas. As recusas e as corridas seguintes conservam os seus resultados, sem serem apresentadas como verificações verdes.

Fica para o lugar de direção a leitura curta sobre este diff e a decisão de aterragem. Não houve fusão nem push.

A corrida de `1c84445a5e86039f16a6ee94cd10a8722a935a85` saiu com `build=0`, `verify=1`, `typecheck=0`: restava H9, que contava o nome da lei dentro do código literal. A correção V2E-58 foi ensaiada na função da própria régua antes de entrar. `c/h9-recusa.json` conserva os códigos e a ocorrência; `c/h9-conferido.json` conserva o controlo e as duas adulterações recusadas. O fecho final volta a correr sobre o commit que contém este acerto.

## A correção V2-e-d

### Decisões

- **V2E-59.** A frase dos médicos identifica os vinte e sete Estados-membros como o grupo da comparação, nas duas edições. A nota dos três recibos distingue esse grupo do conjunto alojado, que inclui outros países, e conserva a ausência de valor da Eslováquia. «Com dados» seleciona os membros com valor; não afirma que todos os membros tenham valor.
- **V2E-60.** A planta da régua `unidadesDepoisDoSelo` altera uma cópia dos itens antes da construção: retira `sufixo` de um token de valor e insere a unidade nas palavras seguintes. O Astro constrói o parágrafo pelo componente real `FraseDaExplicacao`; só depois a régua lê o HTML. Os controlos conservam a unidade no sufixo. A planta passa a fazer parte de `check:discussao`.
- **V2E-61.** A corrida completa, o cruzamento com a origem, as séries, o inventário e as capturas de entrega ficam em `d/`, dentro desta pasta. A cabeça verificada é o último commit que altera código ou dados. O commit posterior incorpora apenas o relatório e as provas dessa cabeça; não se atribui retroativamente o seu identificador à corrida. A identidade do código entregue é verificável pela ausência de diferenças fora desta pasta entre a cabeça dos portões e o commit de incorporação das provas.

### Provas da preparação

A planta construída deu 22 casos vermelhos e 22 controlos verdes: [planta-selos.json](d/planta-selos.json), [HTML construído](d/planta-selos.html) e [registo](d/planta-selos.log). O guião está em `tests/discussao/planta-selos.mjs` e a cópia dos itens é construída em `tests/discussao/planta-selos/pages/index.astro`.

A primeira exportação foi recusada por `ModuleNotFoundError: No module named 'publisher'`; a repetição pelo módulo Python passou. Os registos estão em [exportacao.log](d/exportacao.log) e [exportacao-repetida.log](d/exportacao-repetida.log).

- **V2E-62.** A primeira corrida do sítio recusou as duas declarações antigas do inventário da prosa. As declarações vivas passam a coincidir com as duas frases construídas. A tentativa recusada conserva `build=1`, `verify=125` (não executado) e `typecheck=0` em `d/portoes/`; não é uma prova verde.
- **V2E-63.** O ensaio pela entrada habitual dos itens revelou uma importação circular na primeira ligação da planta (`Detected unsettled top-level await`, código 13). A célula passa a entregar diretamente a função da régua à planta construída. A repetição pela entrada habitual deu código 0, com 706 plantas em 706; o inventário reposto deu zero frases sem classe e zero declarações vivas ausentes. São ensaios de preparação, anteriores à nova cabeça e à repetição dos portões.

- **V2E-64.** A segunda corrida recusou a falta de registo de revisão do bloco `v2e-d`. A entrada é acrescentada com estado «por ler», sem declarar uma leitura cruzada que não ocorreu. Os códigos recusados ficam em `d/portoes-inventario/` e as medições dessa cabeça em `d/ensaio-inventario/`.
