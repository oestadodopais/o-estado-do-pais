# Adenda A do EVB: as provas na forma do conferidor, e a instalação do texto julgado (11.11.2026)

Acrescenta: nada
Medidas: medidas-evb-a.json

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), com rede, na worktree do motor `evb-2026-11-11`, sobre a cabeça `e55af85`; a segunda pasta com escrita é a worktree do sítio `evb-2026-11-11`, só para esta pasta. Lê primeiro o teu `RELATORIO-EVB-1.txt` e o `LEIA-ME.md` que deixaste na pasta `evb` do estudo. Uma construção grande: cento e cinquenta minutos e duzentas e quarenta chamadas; não lances sessões auxiliares. Um commit no fim de cada ponto numerado, com o assunto a começar por `EVB`. O teu relatório vai para `RELATORIO-EVB-A.txt`, nesta pasta, curto: o que mudou, o que parou, os códigos; as listas longas ficam nos ficheiros JSON da pasta `evb`, não no relatório. As tuas medidas, para `medidas-do-construtor-evb-a.json`.*

## Porquê

A primeira passagem parou bem: não ajustou nenhum excerto para passar. As duas causas eram deste lugar. Uma frase do mandato pedia que nenhum algarismo ficasse escrito à mão, e isso pôs os anos, as páginas e os números dos diplomas na fila dos números por ligar. E as provas vinham escritas para um juiz, com excertos partidos por reticências ou sem o valor dentro. Esta adenda corrige as duas coisas e pede a instalação.

## §0 O que se mediu

1. **O que ficou por resolver.** Nos gabaritos, 641 ocorrências em português e 660 em inglês. Das portuguesas, 276 são anos e 304 têm um a três algarismos (páginas, folhas, dias, ordinais, números de diplomas e contagens pequenas); as outras 61 são valores. O gabarito português do estudo 16, instalado, tem 1232 cadeias de algarismos fora de marcadores, pela regra que o motor já tem.
2. **O que parou.** Das linhas `LN`, 33; dos números da cabeça, 36; das citações, 7 nas duas línguas; dos títulos, 3; e 11 avisos de atribuição ficaram por rever.
3. **O que este lugar entrega.** `PROVAS-complementares.json` tem 39 provas distintas e 13 datas de leitura. Em 19 das provas a camada de texto cola o símbolo ao número (o euro ou a percentagem), e o teu `numero_em_pdf` não o lê. `CITACOES-atribuidas.json` tem 126 citações por língua, 122 com documento; este lugar corrigiu 34 atribuições nas duas línguas, e todas as que têm documento conferem no teu leitor (zero por conferir). `LEITURAS-NA-IMAGEM.json` tem 7 leituras.
4. **As citações da primeira passagem.** Das 123 citações portuguesas conferidas, 15 resolveram num documento que as provas da unidade não citam (medido por este lugar, cruzando `citacoes-julgadas.json` com as provas).

## O que recebes de novo (nesta pasta)

- `PROVAS-complementares.json`: para cada linha `LN` parada e cada número da cabeça parado, a prova na forma do conferidor (o documento, o lugar, um excerto contíguo como a camada de texto o tem, o valor na fonte), ou a linha que já existe com a mesma medida; as datas de leitura à parte, com o recibo do pedido como fonte (a chave `acedido_em`). Cada excerto foi conferido com `core.documentos_alojados` nesta worktree antes de chegar aqui. Os casos em colunas trazem a leitura na imagem em `LEITURAS-NA-IMAGEM.json`.
- `CITACOES-atribuidas.json`: cada citação de cada unidade, nas duas línguas, com o documento a que a frase a atribui, o lugar e o excerto com contexto; e três classes sem documento de fonte (o título da própria edição, o nome de um ficheiro, o nome de uma página).
- `LEITURAS-NA-IMAGEM.json`, com as leituras novas.

## O que fazes

1. **A regra dos algarismos, como o motor já a tem.** Retira-se a frase do ponto 4 do mandato sobre os algarismos escritos à mão. A regra é esta: um número que mede uma coisa (um valor, uma contagem, uma percentagem, uma duração) resolve numa linha ou numa derivação, pela posição da ocorrência, como já fizeste. Uma data completa é um marcador de data com a sua fonte. Os outros algarismos entram por classe, numa lista fechada: o ano (quatro algarismos a valer de ano, também em nomes como o do evento ou o de um programa); a página ou a folha de um documento; o número de um diploma, de um artigo ou de uma pergunta; o ordinal de uma lista ou de uma linha de quadro; um identificador (um código, o nome de um ficheiro). Cada ocorrência sem linha fica num ficheiro por língua (`ocorrencias-sem-linha.json`: a unidade, a posição, o valor, a classe e o padrão do texto que a decidiu), escrito por guião a partir do contexto, nunca à mão. O valor entra em `ajustes.ignore` com a razão a dizer a classe, e uma régua nova recusa qualquer ocorrência sem linha que não esteja nesse ficheiro com uma classe da lista. Assim um valor na lista de `ignore` não deixa passar a mesma cadeia de algarismos quando ela é uma medida. Plantas: um «3 milhões» sem linha quando «3» está em `ignore` como ordinal recusa; um ano a valer de contagem recusa. O que o guião não conseguir classificar pelo contexto não se força: lista-se, e decide o lugar de direção.

2. **As linhas paradas e os números da cabeça.** Usa `PROVAS-complementares.json`. Confere cada excerto no documento alojado pelo teu conferidor; o que não passar, pára nessa linha e dizes porquê. Onde o ficheiro nomeia uma linha que já existe, confere que a medida, o documento e o período são os da frase antes de ligar. As datas de leitura passam a marcadores de data com o recibo do pedido como fonte. O leitor de números passa a aceitar o símbolo do euro ou da percentagem colado ao número, antes ou depois, sem nunca cortar algarismos (plantas: um número com um algarismo a mais colado ao símbolo recusa; outro valor na mesma linha recusa).

3. **As datas que faltam.** Cada data completa impressa é um marcador com fonte. As que ficaram sem marcador na cabeça (a nota da Câmara de `23` de outubro, a abertura a `6` de fevereiro, a visita e a notícia de `25` e `27` de novembro) ligam-se ao documento que a unidade cita nas suas provas. Uma data que nenhuma prova da unidade sustente pára.

4. **As citações, pelo documento atribuído.** Uma citação só resolve no documento que `CITACOES-atribuidas.json` lhe dá, no lugar dito, com o excerto inteiro e único. Deixa de valer a procura em qualquer documento: na primeira passagem, quinze citações caíram num documento que a unidade não cita. As três classes sem documento de fonte resolvem assim: o título da própria edição tem de ser, letra por letra, um título da mesma edição; o nome de um ficheiro tem de estar no endereço do pedido, no registo das descargas; o nome de uma página tem de estar na página alojada que o ficheiro indica. Uma citação partida por uma quebra de linha com hífen na camada de texto confere com a palavra reunida, e só nesse caso. Uma citação que o ficheiro marca «pela ordem» está numa página em colunas: confere com as palavras pela ordem dentro do excerto e com a leitura na imagem dessa página, as duas coisas, como na primeira passagem. A unidade `B019.2` já não tem citação. Plantas: uma citação curta que só exista noutro documento recusa; um título que a edição não tenha recusa; uma palavra reunida que a página não parta recusa.

5. **Os títulos.** O dossiê de pré-seleção tem agora o título lido na imagem da capa. A folha de cálculo e o registo das descargas não têm título documental: citam-se por uma descrição declarada como descrição, não como título, numa classe que a régua dos títulos aceite só para ficheiros de dados (planta: um PDF com descrição em vez de título recusa).

6. **As atribuições.** Com os números todos ligados, corre a régua outra vez. Cada aviso que ficar declara-se com a identidade do caso e a razão, tirada da frase julgada (quem diz o quê está na frase). Lista-os no relatório com a frase ao lado, para este lugar os ler.

7. **A instalação.** Com as duas edições a conferir contra o texto julgado, o contrato deixa de ser candidato: o livro, os gabaritos, o HTML, o registo, o manifesto e os cortes do estudo 19 regeneram-se, e as contagens de `core/gate_baselines.json` e dos testes mudam pela medição, cada uma com a razão. Se ficarem unidades paradas, não instales uma parte: diz quantas e quais, e deixa o candidato como está.

8. **Os outros estudos não mudam,** como na primeira passagem, com os resumos.

## O que fica como está, por decisão

- O texto, os nomes e a forma dos números na edição inglesa.
- Não ajustas um excerto recebido para passar. Onde `PROVAS-complementares.json` ou `CITACOES-atribuidas.json` não baterem com o documento alojado, pára nessa unidade.

## A prova

As suites que tocares; o conferidor do texto julgado nas duas edições; o `core.gate` uma vez, no fim, com o registo nesta pasta (`evb-a-gate.log` e `.codigo`), sem caminhos da máquina nem a estrutura das pastas locais. Os registos das conferências dirigidas ficam numa pasta `evb-a-conferencias`.

## Quando paras

Como no mandato: num número, numa fonte ou numa pessoa. Para tudo o resto: decide, anota e continua.

## O fim

O relatório curto: ponto a ponto, o que ficou feito e as plantas; as unidades que pararam; as ocorrências por classificar; os avisos de atribuição com a frase; as contagens que mudaram; os códigos; se o estudo ficou instalado.
