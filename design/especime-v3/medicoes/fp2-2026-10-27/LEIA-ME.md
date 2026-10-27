# FP2: conclusões na primeira página e espaço para o contador

Cada título de «O que se discute» passou a ter a data de publicação e a primeira frase da sua conclusão, nas duas edições.
O contador de cada secção passou a ter espaço reservado dentro do título e deixou de ocupar o texto anterior.

A data vem de publicado, a frase vem do primeiro parágrafo resolvido de conclusao e o corte conserva os objetos dos valores. A omissão de primeirasFrases continua a ser duas frases. A caixa das novidades, os estudos recentes, os títulos, a ordem e as 111 ligações de cada primeira página mantiveram-se. Nenhuma data ou frase foi transcrita à mão para a vista.

## Frases copiadas da construção

- **orcamento-2027-generalidade, pt, 27.10.2026:** A proposta chega ao voto com um saldo de 0,1 % do PIB que assenta numa receita de 300 milhões de euros sem a informação que a fundamente, num emprego que a UTAO tem dificuldade em conciliar com a imigração e num petróleo cujos contratos para 2027 estavam, a 16 de outubro, 11 % acima do pressuposto da proposta.
- **saude-no-orcamento, pt, 19.10.2026:** As três afirmações correspondem a linhas diferentes do quadro e nenhuma apresenta as três medidas em conjunto.
- **parcerias-rodoviarias, pt, 19.10.2026:** O relatório prevê 889 milhões líquidos para as parcerias rodoviárias em 2027, −28,9 % face à execução de 2021 mas acima da estimativa para 2025, e o quadro projeta uma tendência de redução, com oscilações, até ao fim dos contratos.
- **orcamento-2027-generalidade, en, 27.10.2026:** The proposal reaches the vote with a balance of 0,1 % of GDP that rests on 300 million euros of revenue without the information to support it, on employment the UTAO finds hard to reconcile with immigration, and on oil whose 2027 contracts were, on 16 October, 11 % above the proposal's assumption.
- **saude-no-orcamento, en, 19.10.2026:** The three claims correspond to different lines of the table and none presents all three measures together.
- **parcerias-rodoviarias, en, 19.10.2026:** The report forecasts 889 million net for the road partnerships in 2027, −28,9 % against execution in 2021, but above the estimate for 2025, and the table projects a downward trend, with fluctuations, to the end of the contracts.

## Prova de geometria

A construção limpa de base saiu com código 0. O detetor deu código 1: 15 cruzamentos, 0 erros, nas três rotas esperadas, em 6.81 segundos. base.json inclui os achados e as contagens de ligações.

Depois: 0 cruzamentos e 0 erros em 18 rotas e cinco larguras, 90 combinações no total. A régua inteira demorou 6.49 segundos, abaixo do alvo de 180 segundos. A planta voltou a dar código 1 e 10 cruzamentos na habitação PT e EN. O código 2 significaria que a planta não mordeu ou que houve erro de carregamento.

A opção escolhida foi o padding-top de 16,2 px no h2 e top: 0 no contador: os 12 px da letra e o intervalo anterior de 1,35 em ficam reservados na caixa. A letra e a cor não mudaram. A regra é global a texto-artigo; a fonte das duas classes é src/views/EstudoView.astro. O inventário por rg encontrou 21 páginas construídas e todas passaram nas cinco larguras, 105 combinações. A primeira seleção pelo escrivão saiu com código 2 porque esse ambiente não tem rg (mensagem: rg: command not found). A seleção passou a usar find e grep e repetiu-se só essa medição, pelo perfil fp2-contadores. As rotas e os resultados estão em sobreposicao-contadores.json; o código recusado também fica no histórico.

A régua lê caixas de linha do Range e estima a caixa dos pseudo-elementos pela fonte e posição calculadas. O limiar é de 3 px em cada eixo. Não é uma prova de todas as páginas ou de todos os estados interativos. O conhecido-positivo foi medido antes da correção. Na varredura original, «90 páginas por largura» deve ler-se «90 combinações no total».

## Conferências

| Conferência | Código lido do ficheiro |
| --- | ---: |
| build | 0 |
| check:alvos | 0 |
| check:css | 0 |
| check:discussao | 0 |
| check:frases-compostas | 0 |
| check:lugar | 0 |
| check:primeira | 0 |
| check:sobreposicao-contadores | 0 |
| check:sobreposicao-planta | 1 |
| check:sobreposicao | 0 |
| typecheck | 0 |

As corridas usaram os perfis fechados fp2-base e fp2 acrescentados ao escrivão. O primeiro mede o dist já construído; o segundo corre apenas as conferências afetadas. Não se correu o verify completo. A régua nova entra no verify imediatamente depois de check:moldura e não entra no build.

A primeira construção corrigida parou no inventário genérico da voz, com os seis parágrafos por classificar; os portões de HTML e de dados tinham passado. conferirInicio já aceitava as frases nas duas edições. O inventário em medir-defeitos passou a consultar essa validação antes de dispensar os resumos. A conferência isolada check:voz passou antes da construção final. A primeira tentativa isolada ainda usou o código anterior porque a edição foi interrompida por uma asserção do guião; esse insucesso fica no histórico. Não se alteraram as palavras.

O primeiro typecheck detetou uma inferência demasiado estreita no uso genérico de primeirasFrases. A anotação do tipo da entrada existente foi preservada e o typecheck seguinte passou. Os testes dos perfis, corridos três vezes durante a implementação, também provaram a lista exata de comandos e a recusa de uma planta sem mordida.

Os portões de datas, valores e fragmentos passaram a admitir apenas este contexto comprovado: data declarada do item, primeira frase integral, valores com os mesmos IDs e textos, prefixo da conclusão construída e fontes no destino do título. Não há dispensa geral por marca de HTML. As plantas adicionais trocam a linha de um valor e o trecho de uma fonte; ambas são recusadas. A FC1 inclui o parágrafo e a frase novos, com plantas de flex e de largura.

## Plantas em memória

- pt: FP2: data diferente de publicado, mordeu.
- pt: FP2: duas frases em vez de uma, mordeu.
- pt: FP2: frase de outro item, mordeu.
- pt: FP2: valor trocado na frase, mordeu.
- pt: FP2: parágrafo em falta, mordeu.
- pt: FP2: selo recusa linha trocada, mordeu.
- pt: FP2: fragmento recusa trecho trocado, mordeu.
- en: FP2: data diferente de publicado, mordeu.
- en: FP2: duas frases em vez de uma, mordeu.
- en: FP2: frase de outro item, mordeu.
- en: FP2: valor trocado na frase, mordeu.
- en: FP2: parágrafo em falta, mordeu.
- en: FP2: selo recusa linha trocada, mordeu.
- en: FP2: fragmento recusa trecho trocado, mordeu.

## Capturas

40 capturas de página e 40 recortes, nas cinco larguras e nas duas edições. As rotas inglesas de Évora e do Orçamento existem. O seletor da primeira página é section.pp-discussao; nos três estudos é article.texto-artigo.estudo-leitura, que contém o parágrafo de abertura e o primeiro h2 com o contador. Os PNG ficaram fora do repositório, em <temporario>/fp2-capturas. A inspeção visual amostrou os 16 recortes a 390 e 1280 px, nas duas edições: as datas e conclusões aparecem em texto corrido e os contadores da habitação e do Orçamento estão separados da abertura e da linha de fontes; Évora mantém o contador acima do título. O manifesto capturas.json prende os ficheiros, recursos e recortes à construção 09211a4030d7ca9a250b5993e5b987cf45b387d2.

## Custo e paragem

Foram registadas 85 chamadas de ferramenta nesta sessão até ao fecho deste recibo. tokens used: 11323884, no último registo disponível, incluindo 11122816 tokens de entrada em cache. A contagem final do lançador pode incluir a resposta de fecho. Foram 22 execuções principais de conferências com código em ficheiro, incluindo a base, as tentativas recusadas, as três provas dos perfis e as conferências finais; não conta cada subcomando interno do build nem os autotestes pontuais de sintaxe, corte e guardas. Os códigos 125 são passos não executados. As seleções do escrivão foram uma de base, duas de conferências afetadas, a primeira interrompida no build, e uma retoma só da seleção de contadores; corridas completas de verify: zero.

O trabalho parou depois das conferências e capturas previstas. A corrida completa de conferir-tudo.sh e a leitura a frio ficam para o lugar de direção, como pedido. Não houve publicação nem push.
