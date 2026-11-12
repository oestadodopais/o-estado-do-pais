# As leituras do EVL (12.11.2026)

## A leitura a frio (Claude Opus 5.5, `leitor`, `xhigh`), sobre as cabeças `46979b1c1` do sítio e `a4caad8` do motor

O pacote foi montado por `pacote.sh`, com os dois diffs, dezoito páginas construídas, os dois documentos de fonte inteiros (conferidos pelo sha256 de cada linha), as páginas citadas em texto e em imagem, e o texto julgado do estudo. Cinco estragos plantados nas cópias, cada um conferido falso na fonte antes de entrar; o registo está em `leitura-evl.plantas.json`.

**As cinco plantas foram apanhadas.** O valor da linha do turismo com dois algarismos trocados; o nome da medida da cultura a atribuir o pagamento ao Fundo de Fomento Cultural; «July» na frase inglesa do cartão; «2024» na conta portuguesa da soma; e a régua nova do motor a deixar passar um número citado cuja linha não tem documento (esta por inferência, pelos registos).

Fora das plantas, o leitor classificou cinco achados como Major e dezanove como Minor. O que este lugar fez de cada um:

| O achado | A decisão |
| --- | --- |
| O cartão, lido sozinho, não diz que o relatório de progresso dos 34 milhões é da própria Évora 2027, e o selo diz «Comissão Europeia»: lê-se como dois organismos em contradição. O cartão diz cada número duas vezes. | Confirmado. Adenda E: os nomes curtos das duas medidas dizem quem diz cada número; a frase volta a ser a unidade `C005`, que não repete os números; a fonte da linha passa a ser a que a casa já usa para a Comissão e a atribuição o nome que o documento dá ao painel. |
| Dois selos no «34» levam ao recibo do relato de junho de 2025 em frases que usam os 34 milhões com outro sentido (a parte do Estado anunciada em 2023, na `C040`; «Fora dos 34 milhões», na `C007`). | Confirmado; este lugar tinha-os dado por bons na adenda B. Adenda E: o primeiro liga a uma linha própria nova na página da Câmara sobre o protocolo de 2023, o segundo à linha das contas. Ficam onze selos por língua. |
| A conta do recibo da soma imprime 1 500 000 euros da Linha do Vagar sem linha no livro do sítio, e «não são do protocolo» não está nas páginas citadas. | Confirmado; a frase era do mandato deste lugar. Sai da conta, nas duas línguas. |
| A guarda da página no exportador das linhas ficou mais larga para todas as travessias: o bloco do documento, com o resumo sha256, entrou no palheiro onde se procura o número da página. | Confirmado no código. Adenda E: a página declarada tem de ser igual à do documento da linha; com plantas. |
| Nenhum corpo alojado traz o recibo do pedido nem a pasta de direitos ao lado. | É do pacote, não do bloco: neste estudo os pedidos estão num registo único das descargas, que o guião do pacote não conhece. Fica na `GARGALOS.md`. |
| A conta inglesa da soma escreve «9.7» e o valor ao lado «9,7». | Adenda E: a vírgula, como o valor. |
| Os excertos dos dois pagamentos de 2025 começam em «contratualizados.» e não trazem quem paga; o nome da medida da cultura parafraseia o do gabinete. | Adenda E: os excertos alargam-se até ao nome da entidade (conferidos antes com o leitor do motor: inteiros, únicos, com o número), e o nome da medida passa a ter o nome que a fonte dá. |
| A mudança em `source_provenance` vale para todas as linhas e foi feita para uma que a adenda A desfez. | Adenda E: volta atrás se nada depender dela. |
| As contagens do livro contradizem-se (4 161 antes do bloco no mandato, 4 156 na página). | Não é defeito: 4 161 era a contagem dos ficheiros de linhas, 4 156 a das afirmações que a página conta; a diferença de cinco é a mesma antes e depois. O mandato devia ter dito qual contava. |
| A área de toque não estava medida no pacote. | Medida por este lugar depois da adenda C (a célula H2 verde nas três fatias) e outra vez na corrida inteira. |
| Os outros Minor (a língua de um localizador declarada pela cadeia; a exceção por prefixo em `TextoDoNome.astro`; `copias-julgadas` a saltar um controlo; as folgas da via das primeiras frases; o elo dos 2 milhões ao protocolo só na página 61; os selos desiguais numa frase e dentro de citações; o «2027» de um nome marcado como ano; as frases registadas por julgar; a régua das citações só ao nível do documento; as plantas da voz sem o cartão do concelho; a folha de cálculo fora do pacote). | As questões EVL-1 a EVL-11, para o bloco de higiene. |

À pergunta do editor, o leitor respondeu que não imprimia o cartão como estava: os números ditos duas vezes, o relatório sem dono, e a abertura «No dinheiro,», que é um fragmento de um parágrafo maior. As três razões saem com a adenda E.

## A leitura curta da adenda E (Claude Opus 5.5, `leitor`, `xhigh`), sobre as cabeças `f52907061` do sítio e `c0b49c7` do motor

O pacote trouxe só os dois diffs da adenda E, as páginas construídas, as páginas das fontes (com a página da Câmara de 2023 em HTML e em texto visível) e o texto julgado. Cinco estragos plantados nas cópias; o registo está em `leitura-evl-curta.plantas.json` (tem uma entrada a mais, `EVLC-P3-desfeita`, que desfaz uma planta que este lugar pôs por engano numa linha de menos do diff, antes de a pôr na linha certa).

**As cinco plantas foram apanhadas,** e são os cinco achados Blocking da leitura: a segunda frase da `C040` religada à linha das contas no gabarito português; a guarda da página a comparar só quando a travessia não declara localizador; «5 milhões» no excerto do turismo; «ECOC Selection Panel» na atribuição; e «recebidos do Estado» no nome curto da soma. Para as duas primeiras, o leitor mostrou que o código da cópia não podia ter produzido os registos verdes que vinham ao lado.

Fora das plantas, um Major e dez Minor. O que este lugar fez de cada um:

| O achado | A decisão |
| --- | --- |
| No fim da passagem do construtor, o portão do motor tinha dado 1 e não foi repetido, e o `check:leituras` não correu na sandbox. | Corridos por este lugar na cabeça final: o portão do motor inteiro numa árvore limpa, com código 0, e a lista inteira do `verify` por guião, com o `check:leituras`. |
| Um dos onze selos está no «34» de «A diferença entre os 34 e os 9,7 milhões», onde o parágrafo já usa «os 34» com dois sentidos. | Fica: a frase compara o número do relato com o das contas, e o selo leva ao relato. Entra na questão EVL-6 (os selos desiguais numa frase). |
| `tests/evb/leitura.mjs` deixou de fixar quais são as duas linhas do cartão, e as plantas da via das primeiras frases correm sobre uma cópia fixa. | A questão EVL-12, para o bloco de higiene. O valor de cada linha continua a resolver no livro; o que a asserção fixava era a escolha das duas linhas, que só muda num bloco próprio, com leitura. |
| Duas listas cresceram por exceção (`RETIRADAS_DENTRO_DE_FRASE`; duas atribuições por proximidade na `C040`). | As atribuições declaradas são a forma da casa, com a razão lida por este lugar contra a frase. A outra, na EVL-12. |
| Uma entrada nova de `publicadores.json` sem título nem resumo; a atribuição «ECOC Expert Panel» dada também à linha do relatório de seleção, que escreve «Expert Panel»; nomes portugueses sem marca de língua dentro dos nomes de medida ingleses; «49.5 milhões» com ponto numa frase julgada do estudo; o recorte do turismo com os mesmos bytes depois de o excerto alargar. | As questões EVL-13 a EVL-16. Nenhuma muda o que um número diz. |
| Lido sozinho, o cartão não diz que os 34 milhões são a parte inteira do Estado no protocolo, e a frase não explica a distância entre os dois números. | Fica como está. O cartão põe os dois factos lado a lado, cada um com quem o diz, e o estudo explica a distância. A frase do estudo que a explica está na primeira pessoa, que a casa não usa num cartão; a próxima edição do estudo pode dar ao cartão uma frase na terceira (a questão EVL-17). |
| O construtor acrescentou uma linha `Frases:` ao cabeçalho da adenda E. | O pré-mandato pede-a quando um mandato acrescenta frases; devia ter sido este lugar a escrevê-la. |

À pergunta do editor, o leitor respondeu que imprimia os recibos como estão e o cartão com uma reescrita (dizer que os 34 milhões são a parte do Estado no protocolo de 2023).

## O fecho

A lista inteira do `verify` correu por guião duas vezes no bloco: sobre a cabeça `46979b1c1`, antes da leitura a frio (72 passos, 71 verdes; o vermelho foi de um commit deste lugar a meio da corrida, que deixou o `dist/` atrás da cabeça), e sobre a cabeça `f52907061`, depois da adenda E (72 passos, nenhum vermelho). O portão do motor correu inteiro numa árvore limpa na cabeça final do motor, com código 0. **As plantas das duas leituras: todas apanhadas.**
