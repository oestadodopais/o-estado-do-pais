# VOZ-1: relatório do construtor

As frases previstas no §1 foram aplicadas nas duas edições, sem mudar os tokens nem as condições. A agenda e o calendário mantêm os mesmos bytes. As antigas páginas do marcador foram retiradas; as duas redireções permanentes 308 apontam para o Método.

A apresentação do marcador num documento histórico é reversível: os ficheiros alojados e os seus resumos mantêm-se, e a comparação dos bytes desfaz apenas a substituição exata. O selo tracejado, o `noindex` e a exclusão do sitemap continuam exigidos.

## Medidas

| Medida | Antes | Depois |
| --- | ---: | ---: |
| Páginas HTML | 9825 | 9823 |
| Páginas com o marcador antigo | 34 (18 pt, 16 en) | 0 |
| Frases da classe detetada | 31 | 0 |
| Ledes editoriais | 30 | 28 |
| Ledes novas fora da lista fechada | não aplicável | 0 |
| Falhas nas proteções da ausência | não comparadas | 0 |

As duas ledes que saem pertenciam às páginas retiradas do marcador. A lista fechada tem 28 entradas. O âmbito exclui Método, Sobre, Privacidade e recibos, incluindo séries. A isenção dos documentos dos estudos, também nas transcrições, nos índices e nas unidades documentais dos dossiês, está nomeada e datada de 03.11.2026, até à VOZ-2.

`antes-bruto.json` guarda os blocos e as ledes observados antes das alterações. O complemento regista quatro parágrafos ainda inalterados quando a expressão passou a detetar a construção nominal sobre a autoria da conta. `normalizar-antes.mjs` aplica a segmentação em frases e o âmbito final aos blocos guardados; não reconstrói frases. `antes.json` dá as frases por página e `depois.json` dá a medição final. Esta é uma régua lexical, complementada pela pergunta de leitura a frio, não uma garantia de interpretação semântica de toda a prosa.

Para repetir a medição final: `node scripts/voz-autorreferencia.mjs --medir <temporario>/voz1.json`. Para recontar o inventário inicial: `node design/especime-v3/medicoes/voz1-2026-11-03/normalizar-antes.mjs`.

## Frases copiadas do dist

Os selos foram retirados apenas da extração textual abaixo; os valores e as palavras são os do HTML construído. O ficheiro `frases-do-dist.json` conserva a extração.

### pt

**2026: Como ler estes números**

O orçamento é uma previsão: o que se gasta de facto lê-se na execução, mês a mês, e a execução até agosto está acima. O detalhe por programa e por ministério, com a fonte de cada número, está no recibo de cada um, a um toque.

**2027: Como ler estes números**

É o mapa de uma proposta: o que o Parlamento aprovar pode ser diferente, e o que se gasta de facto lê-se depois, na execução. O mapa cobre só o subsetor da Administração Central; a Segurança Social, com as pensões, não está nele. Os valores não são consolidados, porque contam as transferências entre serviços, e por isso a despesa total do mapa é maior do que a despesa total consolidada, 259 633 860 562 euros em 2027. A conta sem as operações relacionadas com a dívida pública calcula-se a partir do mapa, que só dá o nome a essa subfunção, sem dizer o que entra nela. A despesa efetiva consolidada por função dos dados abertos, a base da leitura de 2026, ainda não está publicada para 2027.

**Leitura da semana:**

Entre 28.10.2026 e 03.11.2026, 91 números foram relidos na fonte, e nenhum mudou de valor nem de proveniência; a fonte reviu 3 deles, ainda com o valor de antes da revisão.

Os números que a fonte reviu, ainda com o valor de antes da revisão

**Campo em falta:** por confirmar na fonte

### en

**2026: How to read these figures**

The budget is a forecast: what is actually spent is read in the budget execution, month by month, and the execution to August is shown above. The detail by programme and by ministry, with the source of each figure, is in each one’s receipt, one tap away.

**2027: How to read these figures**

This is the map of a proposal: what Parliament approves may differ, and what is actually spent is read afterwards, in the budget execution. The map covers only the central administration subsector; Social Security, with pensions, is not in it. The values are unconsolidated because they count the transfers between services, and so the map’s total expenditure is larger than the consolidated total expenditure, 259 633 860 562 euros in 2027. The calculation excluding operations related to public debt is derived from the map, which only names that subfunction, without saying what it includes. Consolidated effective expenditure by function from the open data, the basis of the reading for 2026, has not yet been published for 2027.

**Leitura da semana:**

Between 28.10.2026 and 03.11.2026, 91 figures were re-read at the source, and none changed value or provenance; the source revised 3 of them, still showing the value from before the revision.

The numbers the source revised, still showing the value from before the revision

**Campo em falta:** to be confirmed at the source

A forma singular `umaRevisao` não se rende nesta construção, porque o ramo ativo é o plural. Ambas as chaves têm o texto pedido. A frase de 2026 sobre os juros conserva a condição original e não se rende nesta construção. A frase sobre a página mostrar as duas medidas está ausente nas duas edições.

A régua encontrou ainda duas formulações de autoria na explicação de 2027. O título da figura perdeu o parêntese sobre a conta ser do projeto; o parágrafo passa a começar por «A conta usa a despesa total do mapa» e por «The calculation uses the map’s total expenditure». A conta e os apoios mantêm-se. O registo das revisões também perdeu a justificação de não listar todas as entradas.

## Conferências

As conferências específicas de explicações, selos, edições, documentos, lugar, livro e tipos passaram com código 0. A conferência RP4N-h passou as 37 plantas. A régua final da VOZ-1 passou 28 plantas, e as seis plantas da agenda e do calendário passaram. O build completo e a conferência de navegador ficam por fechar neste registo intermédio.

As 28 plantas de `tests/voz/voz1.mjs` incluem a frase de 2026 reposta, a lede «Corrigir em silêncio é a forma mais barata de mentir.», o marcador reposto nas duas edições, a glosa sem classe, o tracejado retirado, o `noindex` retirado, o recibo incompleto reposto no sitemap, a alteração indevida de uma palavra histórica e o pré-mandato com «Esta explicação não diz…». Os controlos mantêm factos negativos sobre fontes. As seis plantas da agenda e do calendário recusam campos públicos apagados e campos internos repostos.

Não se correu a bateria inteira dos três portões nem se fizeram capturas. O pedido ao escrivão com o perfil apenas `build` foi recusado antes de executar, por árvore suja, código 9. A tentativa local de `check:frases-compostas` encontrou `listen EPERM: operation not permitted 127.0.0.1`. A conferência das edições tinha terminado com sucesso antes desse erro.

## Execução

A contagem intermédia do registo da sessão está em `custo-provisorio.json`. A contagem final será registada depois das conferências de navegador.

O inventário substitui os rótulos genéricos pelos rótulos completos. As declarações antigas de palavras contidas nas formas novas saem da tabela: o estado da agenda continua conferido por correspondência exata, e uma forma antiga reposta falha essa comparação.

A leitura a frio fica pendente. Não houve publicação nem alterações no motor.
