# OG1-E, adenda J: retiradas e extração da voz

As 1 238 retiradas foram recusadas pelo portão real nas duas formas, antiga e nova. O controlo atual saiu a 0; as duas plantas integrais, a definição retirada da DGAL e as entradas antigas da habitação em português e inglês saíram a 1. Os códigos foram lidos dos processos, e a medição realmente consumida pelo portão confirmou cada número de linha exigido. As quatro páginas originais comparadas por sha256 ficaram intactas. A prova está em adenda-j-plantas.json.

Há 84 retiradas com espaços dentro de aspas: 83 têm aspas vazias e uma tem texto, a definição da DGAL da linha 3900. O inventário tem 1 238 retiradas, mas o leitor anterior só carregava 1 228. As dez restantes estavam nas tabelas suplementares de transcrições e definições. Passaram a ser lidas como retiradas, sem incorporar as transcrições vivas nas classes da voz. Nenhuma retirada saiu da lista.

A comparação conserva a procura original e acrescenta a normalização das duas partes. As dispensas continuam exatas. A extração conserva o separador entre todos os elementos de bloco pedidos, incluindo quando contêm uma marca de língua; os casos em linha mantêm o texto publicado. A suíte local passou com 43 controlos e 31 plantas. O typecheck, o registo e a língua passaram a 0; a conferência de identificadores sem uso também passou a 0.

A planta anterior que imprimia códigos fixos foi substituída por execuções reais de check-voz.mjs, que chama medir-defeitos.mjs sobre cópias do dist. O novo comando check:voz-retiradas integra o verify. Na primeira preparação, uma cadeia parametrizada com <lugar> ficou escapada na página de teste e a pré-conferência recusou a montagem. Corrigiu-se a montagem das três cadeias parametrizadas na meta descrição. Não foi uma retirada aceite pela voz. A primeira corrida integral passou com as 1 228 linhas então lidas; depois de conferidas as tabelas suplementares, repetiu-se a prova completa com as 1 238.

O build inteiro não correu. As duas corridas integrais da prova consumiram 599 e 616 segundos; o orçamento de trinta minutos não permite concluir também o build nesta passagem. Fica pendente a construção pelo escrivão e a leitura do seu build.codigo. Não se declara a passagem integralmente verde. Não houve mudança de frases do leitor nem alteração do motor.

Commits do código: 21495185c, 239ec1fd1, 6d761241c. Este relatório fica num commit próprio.

Custo medido até à escrita: 39 chamadas de ferramentas; seis corridas dirigidas com registo, uma delas recusada na preparação da planta, e doze execuções reais da voz dentro das duas corridas integrais. Os códigos observados estão em adenda-j-conferencias.json. Não houve build, verify integral, capturas ou core.gate.
