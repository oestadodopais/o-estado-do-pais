# Adenda A do COR3, no motor: os seis vermelhos do portão inteiro (12.11.2026)

Acrescenta: nada

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), na worktree do sítio `cor3-2026-11-12`; a outra pasta com escrita é a worktree do motor `cor3-2026-11-12`, e é nela que trabalhas. Uma correção: trinta minutos e sessenta chamadas; não lances sessões auxiliares nem corras o portão inteiro (este lugar corre-o numa árvore limpa depois da tua passagem). Um commit no motor no fim de cada ponto numerado, com `OEDP_GATE=adiado` e o assunto a começar por `COR3`. O teu relatório vai para `RELATORIO-COR3-M-A.txt`, nesta pasta, com dez linhas; os registos para `cor3-m-a-conferencias/`, só os códigos e as últimas vinte linhas, sem caminhos da máquina.*

## Porquê

A passagem do motor correu as conferências dos três estudos, e este lugar correu depois o portão inteiro numa árvore limpa: deu vermelho em seis sítios que as conferências dirigidas não tocam. O registo está em `portao-do-motor-cor3-b02cf4a.txt`, nesta pasta. Nenhum dos seis é um número errado; cada um é uma declaração que o portão exige e que falta. Entretanto este lugar decidiu as três correções que tinham parado (o relatório `RELATORIO-COR3-M.txt` di-lo no fim, e as folhas levam a decisão): não as mudes.

## O que fazes

1. **O publicador das duas linhas da notícia.** `publisher.publicadores_test` recusa `hab-imprensa-psp-ferido` («documento sem entrada»): o título das duas linhas mudou e o registo dos publicadores ainda só conhece o título antigo. O publicador é o mesmo jornal; o registo passa a conhecer o título novo, pela via que a casa usa, e uma planta prova que um título sem entrada continua a recusar.

2. **O teste do literal da sobrecarga.** `publisher.hb1_test` exige nos dois gabaritos um literal de data preso à linha da sobrecarga de Portugal na publicação principal; a frase julgada da C12 já não tem data nenhuma. O teste muda de forma e conserva o que protege: nenhuma data solta nessa frase, e os quatro valores a virem das suas quatro linhas. Uma planta: uma data escrita à mão nessa frase recusa.

3. **Os dois livros novos do estudo do Orçamento** (`Technical Source/livros-cor3/`): o portão acha dois livros sem entregável. Ou entram no sítio onde os livros desse estudo já vivem e são medidos, ou declaram-se como a casa declara um livro que só alimenta a composição de outro, com a razão verdadeira. Escolhe a via que deixa as linhas novas medidas por alguma régua, e diz qual.

4. **A afirmação nova no estudo da reforma.** `penalizacoes-2026-pt-html` tem uma afirmação por declarar a mais. Acha qual das frases instaladas a traz (as candidatas são as citações do relatório da C01 e da C03 e a declaração do Governo da C02) e declara-a no livro com o seu documento e o seu excerto. Não se sobe a base.

5. **O número novo por atribuir no outro entregável do mesmo livro.** `seguranca-social-relatorio` tem um por declarar a mais: uma das cinco linhas novas do livro apanha um valor desse documento ao pé de uma entidade. Declara na linha a quem o valor se atribui, ou dá à linha a forma que a casa usa para um valor que não é desse documento. Não se sobe a base.

6. **A prova.** Os dois testes, a medição dos dois entregáveis da reforma contra as suas bases e a conferência dos livros declarados, cada código lido de um ficheiro; `conferir-composto-cor3.py` outra vez, que tem de continuar com todos os trechos conformes.

## O que fica como está, por decisão

As frases dos três estudos e as três folhas. As bases de tolerância do portão.

## Quando paras

Se um dos seis só passar subindo uma base, tirando uma régua ou mudando uma frase julgada: paras nesse ponto, dizes qual e porquê, e fazes os outros.

## O fim

O relatório em dez linhas: os seis pontos, as plantas, os códigos.
