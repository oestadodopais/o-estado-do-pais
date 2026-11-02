OG1-E, adenda C, 02.11.2026

A régua das citações leu 9823 páginas: zero recusas fora das edições guardadas. Antes desta adenda, na cabeça 2b5a966da, eram 206 recusas em 44 rotas. As seis edições guardadas estão enumeradas em depois.json com o sha256 conferido e conservam 14 ocorrências: cinco por língua no Orçamento, duas por língua na habitação e zero nas contas de Évora. Nenhuma página fora da lista é dispensada.

Os 26 publicadores foram medidos nos documentos alojados. A RTP foi lida pelos microdados do publicador e o PAN pelo emissor dos PDFs. O registo fechado contém 58 entidades, 62 nomes incluindo aliases e 105 documentos. Os exportadores HB1, EO1 e V2D procuram o publicador pelo documento, sem o deduzir de attributed_to. A travessia alterou os 26 campos source e acrescentou a cada linha a correção de proveniência, com valor anterior, valor novo e os dois motivos ditados. As atribuições e os restantes campos ficaram conservados. O livro tem agora 132 entradas de proveniência, contadas nas linhas, antes 106.

As 29 citações da habitação saíram dos cartões nas duas línguas. Todas conservam o acesso pelo estudo na área. A seleção das áreas e o cartão recusam a unidade afirmação, e a régua do HTML recusa a sua presença num cartão. As páginas e os índices do livro conferem o publicador, o documento do relato e a atribuição como campos. O índice distingue Publicado por de Atribuído a.

As formas continuam a ser 92 afirmações, 17 relato e 75 palavras. A unidade literal afirmação foi medida em 83 linhas, não nas 121 indicadas no mandato; a regra dos cartões aplica-se ao campo declarado.

O título marcado é conferido contra WORKS na língua da edição. Só um título conferido sai da procura das frases retiradas. O primeiro build descobriu que o componente também imprime nomes de conjuntos de dados, como Concelhos: as medidas centrais. A marca foi restringida aos títulos que existem em WORKS; os outros nomes conservam a marca de origem anterior, sem esta dispensa. O HTML foi recomposto pelo compilador Astro num destino temporário e copiado sobre dist, conservando os cartões de partilha já gerados. O portão do HTML posterior conferiu também os 5504 cartões e passou. A L1 passou com 3464 páginas e a L3 com zero; a razão das duas páginas históricas adicionais está junto do teto e em l1-adenda-c.json.

O inventário foi reconciliado com a superfície lida: cinco formas acrescentadas, duas contagens substituídas e 23 declarações sem superfície removidas. As proibições foram conservadas. A leitura cruzada do diff está registada como por ler em critica/REVISOES-DO-INVENTARIO.md e fica pendente antes da fusão.

A voz não ficou verde. Restam exatamente quatro formas já associadas à ED1: Edições, Editions, publicado a · e published on ·. Portanto, não são apenas os dois rótulos Edições/Editions. Não restam títulos da habitação recusados, blocos por classificar ou declarações vivas sem superfície. A resolução das quatro formas fica para a ED1-F; nenhuma proibição foi alargada para as deixar passar.

Plantas e conferências:
- Motor: 130 controlos dos publicadores, incluindo a mudança da atribuição sem mudança do publicador e a recusa de domínio ou documento trocado. core.gate passou no commit aceite.
- Sítio, adenda C: 93 plantas e controlos. Os casos de recusa dão código 1 e os controlos código 0: pessoa como publicador, nome fora do registo, domínio trocado, relato sem título, cartão de citação, título inventado e byte alterado nas edições guardadas. A marca antiga não dispensa a frase retirada. As 29 linhas continuam no estudo da área.
- Forma: 130 plantas e controlos, mais 14 do texto lido, títulos, K8 e citação, código 0. A conferência das edições passou com seis primeiras edições; as plantas do lugar passaram com 20 recusas esperadas.
- Códigos lidos: build 1; HTML 0; auditoria 0; áreas, edições e forma 0; lugar 0; língua 0; tipos 0; plantas 0; voz 1. As cópias dos ficheiros .codigo estão nesta pasta. O livro, a travessia e o registo também passaram nas corridas dirigidas.

Execução e limites: houve um build inteiro pelo escrivão. Um pedido anterior saiu a 9 na verificação inicial da árvore suja, sem executar build nem criar build.codigo. O build inteiro saiu a 1 pela marca aplicada a nomes de conjuntos; corrigida a marca, foi recomposta a saída estática do Astro, conservando os cartões já gerados, e foram repetidas as conferências afetadas. A corrida inteira dos portões não foi repetida. Não houve verify integral, capturas ou publicação.

O motor tem um commit aceite, 6b1b38cf. O gancho correu duas vezes: a primeira passou os testes mas recusou a saída da nova suíte por não conter PASS com a contagem; corrigida a saída, a segunda deu código 0. Os commits do código do sítio são 61170e0c, ccb3485e, 3b515a3f, 3f6ccbcd, c5630d4b, f1d9fa94; este relatório e a reconciliação final do inventário ficam no commit seguinte.

Custo medido até à escrita deste registo: 98 chamadas de ferramentas; 39 corridas dirigidas de conferências com registo pelo curto.sh, incluindo as auditorias, e uma recomposição do HTML. Acrescem 2 verificações de sintaxe, um build inteiro e duas corridas do core.gate nos pedidos de commit. adenda-c-conferencias.json enumera os registos e os códigos captados, incluindo as falhas corrigidas.
