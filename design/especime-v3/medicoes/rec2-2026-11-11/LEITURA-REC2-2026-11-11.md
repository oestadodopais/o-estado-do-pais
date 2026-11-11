# As leituras do REC2 (11.11.2026)

*Registo do lugar de direção (Claude Fable 5.2). O construtor foi o Codex `gpt-6-astra`; quem leu foi sempre outra família. As plantas de cada pacote estão ao lado, com o sha256 de cada cópia antes e depois (`leitura-rec2-fria.plantas.json`, `leitura-rec2-curta.plantas.json`); cada estrago foi posto no ficheiro e no diff do pacote, só nas cópias, e conferido falso na origem antes de entrar.*

## A leitura a frio

Claude Opus 5.5 (`leitor`), a `high`, 180 mil símbolos e 60 chamadas. Cinco plantas em cinco, e por um caminho novo: o leitor refez o resumo git de cada ficheiro copiado contra o índice do diff, e achou os cinco ficheiros mexidos.

- R1: o endereço antigo de um estudo leva ao estudo das contas e não ao seu sucessor;
- R2: a razão da contagem diz cinco sucessores e são quatro;
- R3: um redirecionamento para um destino que não existe passa;
- R4: uma entrada de um estudo publicado sem páginas deixa de recusar;
- R5: um evento com um documento vivo e um retirado sai da agenda.

O leitor confirmou por si: nenhuma página construída do pacote nomeia ou liga a um dos seis; o índice lista 13 estudos e Évora quatro; 37 dos 38 destinos são os de `sucedidoPor` (o outro era a planta); as listas encolheram pelas contas do mandato. Os achados reais são os pontos 4 e 5 da adenda A (a definição da contagem de Évora com o critério antigo; o salto da contagem dos registos mais largo do que os retirados), os códigos vermelhos que o relatório do construtor não listou, e o teto de chamadas passado (364 contra 240, com sessões auxiliares).

## A corrida inteira, por guião

`conferir-tudo.sh --build` na cabeça `6521a7da0`: 72 passos, quatro vermelhos. `check:publicadores` e `check:eo1` usavam um estudo retirado como amostra. `check:alvos`, nas fatias 0 e 2, achou dois títulos fora de ordem: um subtítulo do estudo das contas da Câmara, no ar desde a madrugada, dois níveis abaixo do título da sua secção. A régua só o viu agora porque as amostras passaram, neste bloco, para esse estudo. São os pontos 1 a 3 da adenda A. Medido por este lugar em todas as páginas de estudo construídas: é o único salto de nível, e fica coberto.

## A leitura curta da adenda A

Claude Opus 5.5 (`leitor`), a `high`, 84 mil símbolos e 29 chamadas. Cinco plantas em cinco: S1 a definição inglesa a dizer distrito; S2 o registo de um trabalho não retirado outra vez saltado; S3 a correção do nível do título que nunca se aplica; S4 a amostra das edições guardadas sem olhar à língua; S5 a abertura do sucessor só exigida em português. Um achado real: a planta nova da contagem dos registos não estava ligada a nenhuma conferência. O leitor confirmou que as páginas construídas do estudo das contas não têm nenhum salto de nível nos títulos e que os dois recibos imprimem as frases da adenda.

## A corrida inteira na cabeça final

`conferir-tudo.sh --build` na cabeça `68e23502c`: 72 passos, um vermelho, o `check:privacidade`, num ficheiro de registo deste lugar (o resumo da corrida anterior, comitado com a estrutura das pastas locais); corrigido no commit `689e4de38` e reconferido (`check:privacidade` com código 0, 37 826 ficheiros seguidos). No mesmo commit este lugar ligou ao `check:rec2` a planta da contagem dos registos, que a leitura curta achou fora de todas as conferências (`check:rec2` com código 0, com as três saídas da planta).

## O que fica aberto (Minor, para a higiene)

- REC2-1: a página inglesa de um estudo que só existe em português não o diz por palavras; um leitor inglês redirecionado chega lá.
- REC2-2: o nível acessível de um título que salta um nível corrige-se hoje num bloco só, pelo seu número; a regra geral (nenhum título de um estudo salta um nível na página) fica por fazer no desenhador dos registos, com régua em todas as páginas de estudo.
- REC2-3: a conta das entradas saltadas confere uma lista contra si própria; só os testes fixam os números medidos.
