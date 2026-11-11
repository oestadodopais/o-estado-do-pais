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

## A travessia para o sítio (11.11.2026)

O construtor foi o Codex `gpt-6-astra`: a passagem da travessia (nove pontos) e as adendas A, B e C. As plantas estão em `leitura-eva-t-fria.plantas.json` e `leitura-eva-t-curta.plantas.json`.

### A leitura a frio da travessia

Claude Opus 5.5 (`leitor`), a `xhigh`, 248 mil símbolos e 64 chamadas, sobre o pacote montado por `pacote.sh` com as páginas construídas e dois documentos alojados (o Relatório de Gestão de 2021, trazido pela linha mudada, e a Prestação de Contas de 2025, acrescentada por este lugar por guião com o resumo conferido, porque as linhas de 2025 não declaram o resumo do documento). Cinco plantas em cinco:

- T1: os pagamentos em atraso ditos como soma do ano e não como saldo no fecho;
- T2: a razão da correção cita um quadro que a página 60 não tem;
- T3: a declaração do texto julgado deixa de estar presa ao manifesto dos registos;
- T4: uma linha que não está em itálico passa por nome do estudo;
- T5: a comparação dos totais passa com outra unidade.

O leitor conferiu nos PDF, página a página, as duas frases que este lugar escreveu (a da leitura do estudo e a razão da correção) e a linha de 2021: verdadeiras como construídas. Os achados reais são os pontos 1 a 4 da adenda A: a régua dos títulos copiados afrouxada para todos os estudos; o teto de data a parar duas outras contas; a prova documental sem as guardas de caminho; o recibo de 2021 a dizer relido o ficheiro da fonte quando o relido era o da fonte anterior. O PDF de 2021 chegou sem recibo do pedido ao lado: este lugar conferiu no motor que o registo da recolha das contas guarda o endereço e o resumo deste PDF, com a data de 10.08.2026 que o recibo imprime.

### A corrida inteira, por guião

`conferir-tudo.sh --build` na cabeça `3437d485a`: 72 passos, um vermelho, o `check:indice` (a data de publicação refeita do `git` contra a edição única). É o ponto 5 da adenda A.

### Um erro deste lugar, e as adendas B e C

O ponto 4 da adenda A foi escrito largo demais: mandava imprimir a frase da fonte anterior sempre que o endereço de uma reconferência fosse diferente do da fonte de hoje. Medido por este lugar depois da passagem, no livro e no HTML construído: dezanove linhas, e só numa a fonte tinha mudado; os recibos das outras dezoito passavam a dizer uma coisa falsa. Nada disto chegou ao ar. A adenda B quis declarar a fonte anterior dentro da linha e parou, bem, na régua que protege os bytes da travessia; a adenda C declara-a fora da linha (`ledger/fontes-anteriores.json`), e a frase só se imprime com a declaração. Medido pelo construtor nos 8 312 recibos construídos: dois imprimem a frase, os da linha de 2021.

### A leitura curta das adendas A, B e C

Claude Opus 5.5 (`leitor`), a `xhigh`, 146 mil símbolos e 40 chamadas. Cinco plantas em cinco:

- U1: uma reconferência posterior à correção leva a frase da fonte anterior;
- U2: a declaração diz uma página que a linha nunca citou;
- U3: uma linha que não está em itálico passa por nome copiado;
- U4: uma correção com a data do próprio selo deixa de contar;
- U5: um caminho com `..` passa na prova documental.

Nenhum Blocking nem Major real fora das plantas e das suas consequências. Dois Minor reais, para a higiene: EVA-10 e EVA-9.

### A corrida inteira na cabeça final

`conferir-tudo.sh --build` na cabeça `e83b0bcea`: 72 passos, nenhum vermelho.

## O que fica aberto da travessia (Minor)

- EVA-9: as páginas inglesas do livro imprimem os valores na forma portuguesa («87,72 %»), no sítio inteiro e desde antes deste bloco; a razão da correção, em inglês, escreve «87.72%». Um bloco próprio, por régua.
- EVA-10: no recibo de 2021, a linha da reconferência da fonte anterior acaba no rótulo «conferência automática do ficheiro da fonte», e o valor antigo não leva unidade.
- EVA-11: os PDF da pasta `source/` do estudo não têm o recibo do pedido nem a pasta dos direitos ao lado; a data da recolha está no registo das contas do estudo 08.
- EVA-12: o guião do pacote só traz o corpo das linhas com o resumo do documento declarado, e não tem maneira de pedir um documento do motor por nome.
