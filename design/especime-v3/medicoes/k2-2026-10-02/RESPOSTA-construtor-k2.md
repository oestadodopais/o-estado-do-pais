# Resposta do construtor do K2

*Claude Opus 5.5 (a definição `construtor`), 02.10.2026, ramo `k2-2026-10-02`. O relatório inteiro é `LEIA-ME.md`, na mesma pasta; os números estão em `medidas.json`. Sem travessões.*

- **Feito, pelo §3 do brief.** Cada cartão de medida lê-se a 390 px pelo nome, o valor com a unidade e a comparação, e acaba numa linha fechada que se abre sem guião, «O que é este número», com a metade da leitura que diz o que o número é e a pergunta; a faixa da página da União lê-se pelo nome, o valor, a unidade e o estado. A K19 nova lê a ordem no documento: 0 queixas em 5 248 cartões, contra 10 210 na construção de base.
- **Os quatro nomes do §0 dizem a variação**, nas duas línguas, com o veredicto a acompanhar; **a diferença de emprego** diz-se como diferença entre duas taxas em pontos percentuais, no cartão e no recibo, com a unidade do Eurostat como a fonte a escreve e uma origem nova selada; **a quota nas exportações e o PIB por habitante** explicam-se em palavras comuns; **as leituras dos estudos** dizem o que são uma designação de pelouro, uma localização de projeto vencida e o valor atuarialmente neutro, sem mudar números nem origens.
- **As duas linhas com menos casas decimais** corrigiram-se pelo mecanismo (8,0 e 3,0, cada uma com uma entrada «correcao» selada), o contador passou a 7 pela «atualizacao», e a célula nova das casas decimais fecha a construção se voltar a acontecer.
- **O formato**: a célula nova `check:formato` exige os milhares, a vírgula decimal e o sinal menos (0 desvios; 42 na base, as contagens da prova sem separador, corrigidas na formatação).
- **Parei no «%»**: o brief pede o espaço antes dele, e a §1.43, a §1.44 e a `IDENTIDADE.md` §11 escrevem-no colado. Desfiz a forma do brief, que está inteira no commit `2eab45e7`; o sítio fica como estava (701 colados e 1 845 separados), e a célula conta as duas formas até o lugar de direção decidir.
- **Parei nos nomes de seis cartões** que o §0 não contou (a quota nas exportações e cinco cartões de preços do RP1), com uma proposta de nome para cada um no relatório.
- **Decidi**: a dobra fechada em todas as larguras; o corte da leitura no primeiro pedaço que compara; o espaço inquebrável nos milhares, pela §1.66; 10 px de margem por cima da dobra, porque a área de toque do selo do valor entrava no alvo dela (a H2 do `check:alvos`).
- **A primeira página** mudou em 12 linhas de texto (o nome dos preços da habitação na lista de um bloco, o nome no veredicto e as sinopses de dois estudos), e não em blocos nem em cartões.
- **Plantas**: 3 do portão de HTML, 18 da K17, 7 da K19, 4 do formato, 6 e 2 das casas decimais, todas a morder.
- **Portões**: a corrida final corre na cabeça deste commit e os códigos entram no commit seguinte, em `portoes/`.
- **Capturas**: 40 depois, nas cinco larguras e nas duas edições, e 16 antes, sem problemas.
- **Custo**: 1 339 297 símbolos e 29 221 segundos até ao relatório, das duas leituras em ficheiro.
