# As leituras do EVB (11.11.2026)

*Registo do lugar de direção (Claude Fable 5.2). O construtor foi o Codex `gpt-6-astra`; quem leu foi sempre outra família. As plantas do pacote estão ao lado, com o sha256 de cada cópia antes e depois (`leitura-evb-fria.plantas.json`); cada estrago foi posto no ficheiro e no diff do pacote, só nas cópias, e cada um contradiz uma recusa que os testes do construtor afirmam.*

## A leitura a frio do motor

Claude Opus 5.5 (`leitor`), a `xhigh`, 265 mil símbolos e 52 chamadas, sobre as três passagens do motor (o mandato e as adendas A e B), com treze corpos de fontes no pacote. **Cinco plantas em cinco:**

- V1 (a guarda das medidas fora da classe do ano): o achado 14, que dá a guarda como definida e nunca usada;
- V2 (um número que só começa pelo valor da fonte resolve): o achado 15;
- V3 (uma citação em colunas passa sem leitura na imagem): o achado 16;
- V4 (um número só do inglês passa): o achado 3, por correr o teste contra o código do pacote;
- V5 (a leitura na imagem de outra página passa): o achado 5, por correr a função com uma página trocada.

### Os achados reais e o que se decidiu

| achado | o que é | decisão |
| --- | --- | --- |
| 2 (Blocking) | a cabeça `a7e6b07` não tem um `core.gate` verde: a única corrida inteira deu código 1 e as correções posteriores mexeram na paridade que tinha falhado | adenda C, ponto 9: o portão inteiro corre no fim e tem de dar zero; a aterragem corre-o outra vez numa árvore limpa |
| 4 (Major) | a citação do estado do Convento dos Remédios estava provada com o excerto da linha da Arena de Évora; a régua das colunas não prendia o estado à obra | o lugar de direção corrigiu `CITACOES-atribuidas.json` (o excerto da linha certa, o nome da obra em `contexto`, as duas linhas nas unidades que falam de duas obras); adenda C, ponto 1 |
| 6 (Major) | o nome de uma página passava se estivesse em qualquer texto visível, até num menu | adenda C, ponto 2 |
| 7 (Major) | o extrator do HTML contava texto que o leitor da página não vê | adenda C, ponto 3 |
| 8 (Major) | na tradução de uma citação, os mesmos algarismos com outra escala passavam | adenda C, ponto 4 |
| 9 (Major) | a paridade nova só comparava os números ligados a uma linha, e a sua planta não corria a régua verdadeira | adenda C, ponto 5 |
| 10 (Major) | as linhas de quadro mais curtas do que o cabeçalho passaram a ser aceites em todos os estudos, e a planta da recusa foi trocada por outro caso | adenda C, ponto 6 |
| 13 (Major) | asserções instaladas com uma declaração que diz que não autoriza publicar | adenda C, ponto 8 |
| 19 (Minor, mas protege uma data impressa) | num intervalo de dias só se conferia o dia do início | adenda C, ponto 7 |
| 1, 11 e 12 | o pacote não trazia todos os corpos das fontes, nem os recibos ao lado dos PDF (o recibo das descargas de setembro é o registo JSON, que vinha), nem os ficheiros do contrato e da integridade | é do pacote, não do bloco: a leitura curta da adenda C leva os quarenta corpos, o registo das descargas dito no prompt, e os ficheiros do contrato |
| 14, 15, 17, 18 e 20 (Minor) | os padrões largos do classificador das ocorrências; a unidade no leitor de números; as folhas e linhas escondidas da folha de cálculo; a data de leitura presa pelo índice no registo; a razão do `ignore` conferida em prosa livre | o bloco de higiene (as questões EVB-1 a EVB-5) |

O leitor confirmou por si: os treze corpos com o resumo declarado; as 595 e as 601 ocorrências sem linha na posição dita, e uma amostra de mais de quarenta com a classe certa; vinte linhas próprias com o valor, a página e o excerto certos, três delas pelas leituras na imagem; as derivações que o texto diz; os números do relatório refeitos a partir dos ficheiros; as atribuições por posição só tiraram avisos falsos.

## A leitura curta da adenda C

Claude Opus 5.5 (`leitor`), a `xhigh`, 283 mil símbolos e 80 chamadas, sobre o diff da adenda C, com os quarenta corpos das fontes no pacote (cada um com o resumo conferido e o recibo do pedido). As plantas estão em `leitura-evb-curta.plantas.json`. **Cinco plantas em cinco**, todas dadas como Blocking e todas por correr o código do pacote contra o teste que o construtor escreveu:

- W1 (o contexto deixa de escolher o item da leitura na imagem): o achado 2;
- W2 (o nome de uma página volta a passar em qualquer texto visível): o achado 4;
- W3 (a condição do menu recolhido invertida): o achado 5;
- W4 («mil» a valer como milhão na tradução): o achado 1;
- W5 (a linha curta só recusa nos estudos que declaram linhas curtas): o achado 3.

### Os achados reais e o que se decidiu

| achado | o que é | decisão |
| --- | --- | --- |
| 6 (Major) | a planta da paridade não chega à paridade: quem recusa é a igualdade com o texto julgado, e o teste aceita qualquer erro | adenda D, ponto 2 |
| 7 (Major) | a tabela das escalas da tradução trata o bilião português como `billion` e lê «mil milhões» como «mil» | adenda D, ponto 1 |
| 11 (Minor) | o contexto da citação do MADE era só a palavra «Design» | corrigido pelo lugar de direção no ficheiro das citações; adenda D, ponto 4 |
| 13, em parte (Minor) | duas asserções em revisão descritas como frases com quantificador, quando o detetor apanha o nome de um cargo | adenda D, ponto 3 |
| 8 | o pacote não trazia as leituras na imagem do motor, os gabaritos nem a origem das linhas | é do pacote; as contagens que o leitor não pôde refazer (1 426 e 465) estão nos registos do construtor |
| 9, 10, 12, 13 (o resto) e 14 (Minor) | a opacidade escrita de outras maneiras e o menu recolhido de um sítio responsivo; a unidade que se perde quando há escala; o contrato das linhas curtas que não confere que a linha é curta; a regra das asserções só nos dados; a paridade presa ao caminho deste estudo | o bloco de higiene (as questões EVB-6 a EVB-10); a EVB-10 fecha-se antes do EVC, que traz outro contrato nas duas línguas |

O leitor confirmou por si: os quarenta corpos com o resumo e o tamanho declarados e todas as referências a documentos resolvidas num corpo copiado; as sete linhas do quadro das intervenções na página nove das contas contra os sete excertos e contextos, e as duas unidades com duas linhas; a soma dos sete orçamentos igual ao total impresso; o título da página «Quem Somos»; todos os excertos em HTML a resolver uma só vez com o extrator novo; os dez intervalos de dias com o fim que a fonte imprime; as 33 asserções instaladas sem a palavra que não autorizava; as 23 diferenças linha a linha; os pares de uma só língua de volta à comparação antiga.

## A leitura curta da adenda D

Claude Opus 5.5 (`leitor`), a `xhigh`, 133 mil símbolos e 61 chamadas, sobre o diff da adenda D, com o `core/` inteiro no pacote para o código correr. As plantas estão em `leitura-evb-curta-d.plantas.json`. **Cinco plantas em cinco**, quatro por correr o código e os testes do pacote:

- X1 («mil milhões» a valer como milhão): o achado 1;
- X2 (a dispensa do detetor alargada a qualquer «único»): o achado 4;
- X3 (as aspas da primeira à última da unidade): o achado 3, com a conta dos 29 números que saíam da paridade por edição;
- X4 (o teste da paridade sem afirmar o número de diferenças): o achado 6;
- X5 (a suíte nova fora do portão): o achado 2.

Conferido por este lugar na cabeça `71df7b3` do motor, linha a linha: nenhum dos cinco estragos está no código verdadeiro.

### Os achados reais e o que se decidiu

Nenhum Blocking nem Major real. Minor, para o bloco de higiene:

| achado | o que é | decisão |
| --- | --- | --- |
| 5 | o teste que saiu com a adenda D era o único que afirmava, pela função `compare`, a recusa de uma edição construída com um número diferente do texto julgado; a recusa continua provada no conferidor do texto julgado, mas não por esse caminho | a questão EVB-11 |
| 6, a segunda parte | a contagem das diferenças confere-se por procura de texto, que aceitaria «12» por «2» | a questão EVB-12 |
| 3, a parte real | a planta «fora das aspas» escolhe um número antes da única citação da unidade; falta o caso de um número entre duas citações | a questão EVB-12 |
| 7 | a duração do portão e a contagem da integridade aparecem como números, sem o comando | a questão EVB-12 |
| 8 | o recibo do PDF das contas não vinha ao lado dele no pacote | é do pacote |

O leitor confirmou por si: a citação do MADE com o excerto contíguo e único na página nove, o contexto no mesmo item da leitura na imagem, e a recusa com o contexto de outra obra; o ficheiro das citações com o resumo que o contrato declara e as 126 citações por língua; as quatro plantas da paridade a mudar uma chave de cada vez; os perfis das duas línguas iguais (1 397 e 1 397); as duas referências julgadas com o resumo do contrato.

**As plantas de código nas três leituras do EVB no motor: quinze em quinze.**
