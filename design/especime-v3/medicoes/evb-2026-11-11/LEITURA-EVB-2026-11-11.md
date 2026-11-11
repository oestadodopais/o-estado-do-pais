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
