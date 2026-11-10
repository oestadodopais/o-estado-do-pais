# As leituras do EVA no motor (10.11.2026)

*Registo do lugar de direção (Claude Fable 5.2). O construtor foi o Codex `gpt-6-astra`; quem leu foi sempre outra família. As plantas de cada pacote estão ao lado, com o sha256 de cada cópia antes e depois (`leitura-eva-fria.plantas.json`, `leitura-eva-curta.plantas.json`); cada estrago foi posto no ficheiro e no diff do pacote, só nas cópias, e conferido falso no código verdadeiro antes de entrar. O texto do estudo não foi assunto de nenhuma das duas: foi julgado antes, inteiro, em três voltas, contra as cópias das fontes.*

## A leitura a frio, depois das adendas A e B

Claude Opus 5.5 (`leitor`), a `xhigh`, 244 mil símbolos e 90 chamadas. Cinco plantas em cinco:

- E1: a forma impressa de uma derivação pode mudar o valor;
- E2: um excerto que aparece mais de uma vez na página passa;
- E3: uma data declarada sem o resumo do registo passa;
- E4: uma unidade pode trocar de linha se o número de marcadores for o mesmo;
- E5: as unidades podem compor fora de ordem.

Os achados reais são os onze pontos da adenda C. Um deles era deste lugar: a comparação «letra por letra» tirava as separadoras dos quadros, e escondia uma separadora duplicada nas duas edições.

## A leitura curta, sobre o diff das adendas C e D

Claude Opus 5.5 (`leitor`), a `xhigh`, 205 mil símbolos e 62 chamadas, entregue às 22:46 UTC. Cinco plantas em cinco (os achados 2 a 6 da leitura):

- F1: uma citação passa se só as primeiras letras estiverem no excerto;
- F2: os identificadores da cabeça (C0xx) passam nos campos dos recibos;
- F3: um título lido na imagem passa sem dizer quem leu;
- F4: uma exceção de atribuição passa com a razão vazia;
- F5: a estrutura dos quadros só compara o número de quadros.

Em quatro das cinco o leitor disse também que os testes do relatório não podiam passar com o código do pacote: é a dedução certa, porque o estrago só estava na cópia.

### Os dois achados reais acima de Minor, e o que se fez

1. **O pacote não levava os documentos alojados** (Blocking, pela regra do pacote). Este lugar tirou os PDF, o HTML e os livros compostos por tamanho, e o leitor não pôde conferir nenhum excerto na página. Feito no mesmo dia, por guião deste lugar que não usa código do motor nem do construtor (`conferir-provas-contra-os-pdf.py`, nesta pasta; lê cada página com o `pdftotext` em dois modos e com o PyMuPDF): os onze PDF com o resumo declarado; as 107 linhas próprias com o excerto na página dita e os algarismos do valor no excerto; as 36 citações com as palavras todas no excerto e o excerto na página; as 6 datas documentais com o excerto na página e as 3 de registo com a sua prova; os 10 títulos lidos na camada de texto com o título no excerto e o excerto na página; o título lido na imagem com leitor, razão, data, página e resumo. Código 0, nenhuma falha. A prova de que o guião morde: cinco estragos numa cópia (uma página trocada numa linha, um algarismo de um excerto, a página de uma data, as últimas letras de uma citação, o ano de um título), cinco recusas. A travessia para o sítio leva a sua leitura a frio com os corpos alojados no pacote.
2. **O registo do portão trazia quatro caminhos da pasta temporária da máquina** (Major; a regra 9). O ramo nunca tinha sido publicado (`git ls-remote`, com `main` como conhecido-positivo). Os quatro caminhos foram trocados por «<pasta temporária>» e o commit que os trazia foi emendado antes de qualquer `push`. A classe existe em `main` em seis ficheiros de medições antigos (medido por `git grep`): vai para o bloco de higiene, com régua (EVA-8).

### O que este lugar conferiu por si, dos achados menores

- **A data de fim das quatro empreitadas** (o achado 9): a prova selada é uma linha do plano de 2026. As quatro linhas marcadas como empreitada acabam todas a 2026/12/31 na Prestação de Contas de 2025 (páginas 220 e 221, linhas 0407, 0408, 0410 e 0411, lidas na camada de texto) e no plano de 2026 (página 119, lida por este lugar na imagem da página: as mesmas quatro linhas a 2026/12/31, e a dos equipamentos, que não é empreitada, a 2027/12/31). A frase é verdadeira nos dois documentos; o recibo da data fica por alargar às quatro linhas (EVA-1).
- **A língua do relatório do estudo 11** (o achado 12): o documento está em inglês, lido por este lugar no próprio ficheiro.

## O que fica aberto (Minor, para o bloco de higiene)

- EVA-1: o recibo da data de fim das empreitadas cita uma linha e a frase fala de quatro.
- EVA-2: o cabeçalho «Trabalhadores a 31 de dezembro» de um quadro de vários anos ficou preso à data de fim de 2025.
- EVA-3: o título do relatório de 2023 vem do rodapé corrido e não da capa; o relatório do construtor di-lo.
- EVA-4: a declaração da língua de um documento sem marca de língua não é conferida por código.
- EVA-5: a régua das citações só vê as aspas «»; a edição inglesa escreve "Debt" onde a portuguesa declara «Dívida».
- EVA-6: a glosa inglesa da citação do plano de 2026 não repete o montante, que está na citação ao lado.
- EVA-7: doze números dos relatórios do construtor não se reproduzem do pacote, por causa do que este lugar tirou dele.
- EVA-8: nenhuma régua recusa um caminho de pasta temporária num ficheiro de medições; seis ficheiros antigos em `main` têm-no.

## O portão

O `core.gate` correu duas vezes na cabeça final do motor (`5925531`): pelo construtor, na sua worktree (código 0, 1 231 segundos; `eva-d-gate.log`), e por este lugar, numa worktree limpa nessa mesma cabeça, das 22:52:33 às 23:10:42 UTC (código 0, 1 089 segundos; `eva-aterragem-gate.log`, com os caminhos da pasta temporária trocados). O motor aterrou no `master` às 23:11 UTC por `git merge --ff-only` e `git push` (de `a657e2f` para `5925531`), sem tocar nos ficheiros das outras corridas.
