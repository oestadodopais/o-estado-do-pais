# V2-e: efeitos nas pessoas e nos serviços

Implementação em verificação. Os portões completos e as capturas ainda não estão concluídos.

## Medida de partida

`medir.py <motor>` lê o livro, guarda valores, períodos e unidades em `partida.json` e refaz as contas. A corrida inicial leu 156 linhas e refez 11 contas, sem divergências numéricas com o mandato. A contagem dos marcos usa as linhas do primeiro conjunto e do complemento: 37 marcos e metas, dos quais 24 completos.

A dívida a fornecedores é a soma das 53 entidades, convertida de euros para milhões e arredondada a uma casa decimal: 1 517,5. Os pagamentos em atraso das EPE são `dgo-atraso-45-p`, 689,9 milhões em agosto. A regularização acumulada é `dgo-regularizacao-ae`, 1 398,6 milhões até agosto. São três medidas distintas.

Os totais mensais dos três conjuntos hospitalares estão registados na partida. A progressão dentro do ano e o reinício em janeiro sustentam a leitura como acumulados. A descrição dos conjuntos não define expressamente essa natureza. O livro, as notas e as provas preservam esta distinção e usam o período de janeiro ao mês de referência.

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

A exportação comum atravessou 170 linhas com provas e recibos. A auditoria dos itens e a verificação dos dados passaram. Os 27 estragos dos efeitos foram detetados. O teste documental do motor passou com 59 conferências e mil linhas regeneradas.

Os resultados completos, as frases conferidas no HTML e as capturas serão registados depois dos portões. Não houve publicação nem pedido de envio para o remoto.
