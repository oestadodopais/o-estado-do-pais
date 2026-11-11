# Mandato EVB: o estudo de Évora 2027 passa a ser o texto julgado, no motor (11.11.2026)

Acrescenta: nada
Medidas: medidas-evb.json

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), com rede para o portão do motor, na worktree do motor `evb-2026-11-11`, sobre o `master` `247e604`. A segunda pasta com escrita é a worktree do sítio `evb-2026-11-11`, só para esta pasta do mandato (o teu relatório e os registos). Esta passagem é só do motor: a travessia para o sítio é a passagem seguinte. É o mesmo trabalho que instalou o estudo 16 a 10.11.2026; lê primeiro `content/16 Évora Contas da Câmara/Technical Source/eva/LEIA-ME.md`, que diz o que existe e como se reproduz. Uma construção grande: cento e cinquenta minutos e duzentas e quarenta chamadas, contadas com as de qualquer sessão auxiliar; não lances sessões auxiliares. Um commit no fim de cada ponto numerado, com o assunto a começar por `EVB`. O teu relatório vai para `RELATORIO-EVB-1.txt`, nesta pasta; as tuas medidas, para `medidas-do-construtor-evb-1.json`, nunca para o ficheiro das medidas deste mandato.*

## Porquê

O estudo 19 (Évora 2027, Capital Europeia da Cultura) foi auditado, reescrito à cabeça pela norma editorial e reordenado. O texto final existe fora do motor, julgado frase a frase por outra família de modelos contra as cópias das fontes, em quatro voltas com plantas, e fechado numa quinta passagem com as redações do próprio juiz. Falta pô-lo no motor de maneira que o motor o garanta, como garante o 16: cada número a resolver numa linha do livro, cada linha nova presa ao documento alojado, cada citação presa ao seu excerto, e o texto composto igual, letra por letra, ao texto julgado.

## O que recebes (nesta pasta)

- `TEXTO-FINAL-19.pt.md` e `TEXTO-FINAL-19.en.md`: o texto final nas duas línguas, com o identificador de cada unidade à frente (`[C…]` a cabeça, `[B…]` as unidades que já existiam, `[N…]` as novas), a peça, depois `<!-- anexo -->` e `<!-- rodapé -->`. Os identificadores são andaime: não se imprimem.
- `MUDANCAS.json`: para cada unidade, se é igual, mudada ou nova, o que era e porquê; e as cortadas.
- `PROVAS-do-texto.json`: as provas do texto inteiro num só ficheiro. Em `cabeca` e em `corpo_anexo_rodape`, cada unidade com número novo, frase nova ou mudada, com o documento (pelo nome da cópia em texto que o juiz leu), o lugar e o excerto. Em `linhas_novas`, cada número que precisa de linha própria: o valor impresso nas duas línguas, o valor na fonte, a medida, o documento, o lugar e o excerto, e para os derivados a conta e as parcelas. Em `citacoes`, cada citação do texto português com o documento e o lugar onde está.
- `LEITURAS-NA-IMAGEM.json`: o que o lugar de direção leu na imagem de uma página, com o documento, o resumo, a página, a data e a transcrição.
- `INDICE-das-fontes.json`: os documentos que as provas citam, cada um com o nome da cópia em texto que as provas usam, o ficheiro alojado no motor, o tipo, o tamanho, o sha256, o recibo do pedido e o endereço.

## §0 O que se mediu

1. **O texto.** Cada língua tem 464 linhas com identificador e mais 32 marcas de quadro; as duas línguas têm os mesmos identificadores pela mesma ordem. A cabeça tem 54 linhas. Fora da cabeça há 411 unidades: 60 novas, 143 mudadas e 208 iguais ao texto de antes; 221 estão no anexo.
2. **As provas.** `PROVAS-do-texto.json` traz 80 linhas novas, 16 delas derivadas, e 126 citações do texto português, todas com excerto nas cópias. Nove citações distintas só se acham na camada de texto pedaço a pedaço, porque a página está em colunas: são as do quadro das sete intervenções nas contas de `2025` da associação e as da folha `43` do dossiê de seleção. O lugar de direção leu as nove na imagem da página; `LEITURAS-NA-IMAGEM.json` tem as quatro leituras.
3. **Os documentos.** O índice tem 40 documentos: 24 PDF, 14 HTML, uma folha de cálculo e um registo JSON. Destes, 32 estão por registar na pasta `source/` do estudo, com 161 megabytes; o maior tem 44.6 megabytes (o número inteiro do Diário da República de `26.12.2023`). Os outros oito já estão no motor: seis em `Technical Source/outubro-2026/raw/`, o orçamento municipal de `2026` na pasta `source/` do estudo 16 e o registo das descargas na pasta do estudo 14.
4. **O livro.** O livro do estudo 19 tem hoje 161 linhas no motor.

Outras medidas da mesma coisa: cada número novo tem a sua prova na cópia em texto que o juiz leu; a medida do motor é a do próprio documento alojado, pela função que confere um excerto na página. Onde as duas não baterem (uma página, um excerto com outros espaços), vale o documento alojado, e dizes a diferença.

## O que fazes

1. **Os documentos alojados.** Os originais que as provas citam estão em `content/19 Évora 2027 Capital Europeia da Cultura/source/`, por registar; os seis de outubro já estão em `Technical Source/outubro-2026/raw/`, com o recibo do pedido; o PDF do orçamento municipal de 2026 já está alojado em `content/16 Évora Contas da Câmara/source/`, com o mesmo resumo, e não se guarda duas vezes. Confere o sha256 de cada um contra o `INDICE-das-fontes.json`, escreve o `MANIFEST.sha256` da pasta `source/` e regista-a. Um documento em falta ou com outro resumo não se substitui por outro: dizes qual e paras nesse documento. Se o motor ou o GitHub recusarem um ficheiro pelo tamanho, não o partas nem o troques: diz qual e segue; decide o lugar de direção.

2. **Os três tipos de documento.** A função que confere um excerto num documento alojado só conhece o PDF, pela página. Este estudo cita também páginas HTML guardadas e uma folha de cálculo. Passa a aceitar os três, cada um com a sua extração determinista e o seu lugar: o PDF, a página; o HTML, o texto visível do ficheiro guardado («página única»); o XLSX, a folha e a linha. Em todos, o excerto tem de estar inteiro e uma só vez no lugar dito, no documento com o resumo declarado. Plantas para os dois tipos novos: um excerto ausente, um excerto que aparece duas vezes, outro ficheiro com o mesmo nome e outro resumo, a folha errada.

3. **As linhas próprias e as derivações.** Cada número novo das duas provas passa a linha própria do estudo, com o documento, o lugar e o excerto conferidos no documento alojado, e a forma impressa por língua (a edição inglesa deste estudo escreve os números como a portuguesa; as formas são as do texto julgado). Um número derivado (uma soma, uma diferença, uma razão, um número de dias entre duas datas) entra como derivação, com as parcelas como linhas. Um número que o livro do 19 já tem com a mesma medida, unidade, população e período usa a linha que existe. Onde a prova e o documento não baterem, não ajustes o excerto para passar: diz a unidade, o que a prova diz e o que o documento mostra.

4. **Os dois gabaritos e o contrato do texto julgado.** Os gabaritos das duas línguas geram-se do texto final, por guião, e o estudo ganha o contrato que o `core.texto_julgado` confere (as unidades, a ordem, a identidade dos marcadores, a estrutura dos quadros, as duas línguas). Nenhum algarismo fica escrito à mão.

5. **As citações, as datas, os títulos e as atribuições,** pelas réguas que já existem: cada citação entre «» resolve num excerto guardado no documento alojado (a tradução entre parênteses que acompanha uma citação não é citação). Uma citação que a camada de texto só tem pedaço a pedaço, porque a página está em colunas, resolve por duas coisas juntas: os pedaços, inteiros e pela ordem, na página dita do documento alojado, e a leitura na imagem que `LEITURAS-NA-IMAGEM.json` regista para essa página, presa ao resumo do documento. Sem as duas, não passa. Plantas: uma palavra trocada num pedaço; a leitura na imagem de outra página; cada data impressa é um marcador com a sua fonte; cada documento tem o título provado na camada de texto ou lido na imagem; cada aviso de atribuição fica declarado com a identidade do caso e a razão. Onde o título de um documento não se ler na camada de texto, não o escrevas de memória: lista os documentos que pedem leitura na imagem, e o lugar de direção lê-os.

6. **As adagas.** O valor com † (os 1 000 euros da linha da associação no plano plurianual de 2026 do município) fica com a adaga, presa à identidade desse PDF, e com a leitura na imagem que `LEITURAS-NA-IMAGEM.json` regista.

7. **As asserções.** Corre o `core.assertions` nas duas edições e declara o que faltar, na forma que o motor usa.

8. **O resto da cadeia do estudo:** o HTML, o registo, o manifesto, os cortes, as contagens de `core/gate_baselines.json` e dos testes que as fixam, com a razão de cada número que muda dita no relatório.

9. **Os outros estudos não mudam** (o 14, de onde este nasceu, e todos os outros): os livros e os textos ficam byte a byte, salvo o que a régua dos três tipos de documento obrigar a tocar em código comum; di-lo com os resumos.

## O que fica como está, por decisão

- Uma mudança do lugar de direção depois do último juízo, já no texto que recebes: a unidade `B019.2` deixou de pôr entre aspas angulares o nome que dava às respostas 404, que não era citação de fonte nenhuma. As quatro cópias dessas respostas trazem `resposta HTTP: 404`.

- O texto. Uma frase que não consigas compor como está não se reescreve: fica na lista do que parou, com a razão, e o resto segue.
- As pessoas: os nomes que o texto traz ficam como estão, ao pé dos atos que o texto diz.
- A forma dos números na edição inglesa: a do texto julgado.

## A prova

As suites que tocares, pelos seus comandos; o conferidor do texto julgado nas duas edições, com as plantas; o `core.gate` uma vez, no fim, com o registo nesta pasta (`evb-1-gate.log` e `.codigo` ao lado), sem caminhos da máquina nem a estrutura das pastas locais (troca-os antes de comitar). O relatório cita o código e as últimas linhas do portão, copiadas do registo.

## Quando paras

Num número, numa fonte ou numa pessoa: um excerto que o documento alojado não tem no lugar dito; um valor impresso que não é o da fonte; uma frase que só componha mudando o que diz; um nome de pessoa que só passe com uma regra nova. Paras nessa unidade, dizes qual, e fazes as outras. Para tudo o resto: decide, anota e continua.

## O fim

A prova acima e o relatório: ponto a ponto, o que ficou feito, a planta e o que deu; as linhas novas por documento; os documentos por tipo; as unidades que pararam e porquê; as diferenças entre as provas e os documentos; os títulos por ler na imagem; as contagens que mudaram; os códigos. Se o tempo não chegar, a ordem é a dos números.
