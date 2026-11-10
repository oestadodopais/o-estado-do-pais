# Mandato EVA: o estudo das contas da Câmara de Évora passa a ser o texto julgado, no motor (10.11.2026)

Acrescenta: nada
Medidas: medidas-eva.json

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), com rede para o portão do motor, na worktree do motor `eva-2026-11-10`, sobre `master`. Esta passagem é só do motor: a travessia para o sítio é a passagem seguinte. O que entra é o texto que outra família de modelos já julgou contra as cópias das fontes, em três voltas com plantas, e que este lugar fechou; nada nele se muda aqui.*

## Porquê

O estudo 16 foi auditado, reescrito à cabeça e reordenado. O texto final existe fora do motor, julgado frase a frase, com a prova de cada número novo na página do documento. Falta pô-lo no motor de maneira que o motor o garanta: cada número a resolver numa linha do livro, cada linha nova presa à página do PDF alojado, e o texto composto igual, letra por letra, ao texto julgado. É a regra de publicação da casa: o que foi julgado é o que se publica, e um guião confere-o.

## O que recebes (na pasta deste mandato)

- `TEXTO-FINAL-16.pt.md` e `TEXTO-FINAL-16.en.md`: o texto final nas duas línguas, com o identificador de cada unidade à frente (`[C…]` a cabeça, `[B…]` as unidades que já existiam, `[N…]` as novas), a peça, depois `<!-- anexo -->` e `<!-- rodapé -->`. Os identificadores e os marcadores «Quadro [B…]» são andaime: não se imprimem.
- `MUDANCAS.json`: para cada unidade, se é nova, se mudou e o que era.
- `PROVAS-da-cabeca-v4.json` e `PROVAS-do-corpo.json`: para cada número, o valor impresso, o valor na fonte, a medida, o documento, a página e o excerto; para os derivados, a derivação e as componentes; para os que o livro já tem, a linha.
- `INDICE-das-fontes.json`: o título, o endereço e o sha256 da cópia guardada de cada documento.
- `aplicar_lista.py`: a ferramenta de um engenheiro anterior, com a ponte entre o texto composto e o gabarito (os marcadores de cada número de cada unidade de hoje). Serve-te para saber que marcador cada número de uma unidade já tem; não és obrigado a usá-la.
- `assercoes-16.json`: as asserções declaradas para o texto de antes; servem de ponto de partida, e refazem-se para o texto final.

## §0 O que se mediu

O texto final tem 502 unidades em cada língua (frases, títulos, linhas de quadro e itens). Contra o texto de antes da revisão, 227 estão iguais, 143 mudaram em pelo menos uma língua e 77 são novas; as 55 linhas da cabeça são todas novas. As provas do corpo têm 146 linhas novas, das quais 125 em uso (as outras ficaram marcadas `sem_uso` quando a sua unidade saiu). As provas da cabeça cobrem os 95 números que ela imprime, cada um com a página, uma derivação ou a linha que já o tem, e nenhum sem prova. As provas citam 20 documentos de fonte.

Outras medidas da mesma coisa: cada número novo tem a sua prova na página da cópia em texto; a medida do motor é a do próprio PDF, pela função que confere um excerto na página de um documento alojado. Onde as duas não baterem (uma página, um excerto com outros espaços), vale o PDF, e dizes a diferença.

## O que fazes

1. **Os documentos alojados.** Copia para `content/16 Évora Contas da Câmara/source/` os PDF que as provas citam. Estão na pasta das fontes que o lançador te dá com escrita (onze PDF e um `MANIFEST.sha256`; na worktree não estão, porque o motor não os segue em `raw/pdfs/`). Confere o sha256 de cada um contra o `INDICE-das-fontes.json`. As outras fontes do índice (os registos de extração em JSON) já estão no motor, nas pastas `raw/` do 07 e do 08, e não se copiam. Um PDF que não esteja lá, ou com outro resumo, não se substitui por outro: dizes qual e páras nesse documento.

2. **As linhas próprias.** Cada número das duas provas que o livro ainda não tem passa a linha própria do estudo (`linhas_proprias` em `ajustes.json`), com o documento, a página e o excerto conferidos pelo motor no PDF alojado, e a forma impressa por língua. Um número derivado entra como derivação, com as componentes como linhas. Um número que o livro do 16, do 07 ou do 08 já tem com a mesma medida, unidade, população e período usa a linha que existe, e não ganha outra. Onde a prova e o PDF não baterem, não ajustes o excerto para passar: diz a unidade, o que a prova diz e o que o PDF mostra.

3. **Os dois gabaritos, na ordem do texto final.** Gera `documento.pt.md.tmpl` e `documento.en.md.tmpl` a partir do texto final, por guião: uma unidade igual à de hoje leva os marcadores que já tem; uma unidade mudada ou nova leva os marcadores das suas linhas; nenhum algarismo fica escrito à mão, salvo os que o compositor já aceita (anos, datas ISO, as referências sem linha com a sua âncora). As linhas do livro que deixam de ter um número impresso saem do estudo pela regra que o compositor já tem. A cabeça nova substitui o que hoje vem antes do corpo.

4. **O que foi julgado é o que se compõe.** Um guião novo, guardado nos testes do motor com um estudo de teste pequeno, compara o texto composto de cada edição com o texto final sem os identificadores, letra por letra (os espaços e a forma do Markdown que o compositor normaliza dizem-se numa lista fechada, curta). Plantas: uma letra trocada numa frase, um número com outra linha do mesmo valor impresso, uma unidade fora de ordem, uma frase a mais no gabarito. Cada uma recusa pelo seu motivo.

5. **As asserções.** Corre o `core.assertions` nas duas edições sobre o texto final e declara o que faltar, na forma que o motor já usa: uma comparação que se pode contar é um `check` com as suas linhas; o resto é `review` com o que se mediu. Nenhum quantificador fica por declarar e nenhuma asserção passa por se ter tirado a frase do alcance do detetor.

6. **O resto da cadeia do estudo:** o HTML, o registo, o manifesto, os cortes, as contagens de `core/gate_baselines.json` e dos testes que as fixam, com a razão de cada número que muda dita no relatório.

7. **Os outros estudos não mudam.** Os livros e os textos do 07, do 08, do 17, do 18 e do 19 ficam byte a byte; di-lo com os resumos.

## O que fica como está, por decisão

- O texto. Uma frase que não consigas compor como está (um número sem linha possível, uma forma que o compositor recusa) não se reescreve: fica na lista do que parou, com a razão, e o resto segue.
- Os valores com adaga: foram conferidos por este lugar na imagem das páginas 108, 118, 119 e 121 do plano de 2026; a adaga fica onde o texto a tem.
- As linhas do 08 que este estudo usa: não se corrigem aqui.

## A prova

As suites que tocas, pelos seus comandos; o guião do ponto 4 nas duas edições com as plantas; o `core.gate` uma vez, no fim. O relatório cita o código e as últimas linhas do portão, copiadas do registo.

## O relatório

Curto, em `RELATORIO-EVA-1.txt` na pasta do mandato: ponto a ponto, o que ficou feito, a planta e o que deu; as linhas novas por documento; as unidades que pararam e porquê; as diferenças entre as provas e os PDF; as contagens que mudaram. Os commits com o assunto a começar por `EVA`.

## Quando paras

Num número, numa fonte ou numa pessoa: um excerto que o PDF não tem na página dita; um valor impresso que não é o da fonte; uma frase que só componha mudando o que diz. Páras nessa unidade, dizes qual, e fazes as outras. Para tudo o resto: deixa, diz e continua. O teto da passagem, num commit são; o que faltar fica para uma adenda.

## O fim

A prova acima e o relatório. Setenta e cinco minutos, cento e vinte chamadas. Se o tamanho não couber numa passagem, a ordem é: os pontos 1 e 2 inteiros, depois o 3 e o 4 para a edição portuguesa, depois a inglesa, depois o 5 e o 6.
