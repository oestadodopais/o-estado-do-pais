# Adenda C do EVB: as correções da leitura a frio no motor (11.11.2026)

Acrescenta: nada

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), com rede, na worktree do motor `evb-2026-11-11`, sobre a cabeça `a7e6b07`; a segunda pasta com escrita é a worktree do sítio `evb-2026-11-11`, só para esta pasta. Uma construção normal: setenta e cinco minutos e cento e vinte chamadas; não lances sessões auxiliares. Um commit no fim de cada ponto numerado, com o assunto a começar por `EVB`. O teu relatório vai para `RELATORIO-EVB-C.txt`, nesta pasta, curto; as tuas medidas, para `medidas-do-construtor-evb-c.json`.*

## Porquê

O Claude Opus 5.5 leu a frio as três passagens e apanhou as cinco plantas. Os achados reais são sobre réguas que ficaram mais largas do que deviam, e sobre a prova de uma citação presa à linha errada de um quadro. O texto julgado não muda. E a cabeça não tem um portão verde: a única corrida inteira deu código um, e as correções que vieram depois mexeram na régua que tinha falhado.

## §0 O que se mediu

1. A leitura a frio, com cinco plantas em cinco, está em `LEITURA-EVB-2026-11-11.md`, nesta pasta: os achados com o ficheiro e a linha.
2. No quadro das sete intervenções, a unidade `B097.R4` (o Convento dos Remédios) tinha como prova o excerto da linha da Arena de Évora. Este lugar corrigiu `CITACOES-atribuidas.json`: cada citação desse quadro leva agora o nome da sua obra em `contexto`, a dos Remédios tem o excerto da sua linha, e as unidades `C009` e `C035`, que falam de duas obras, levam as duas linhas em `excertos`, com `contextos`. Cada excerto foi conferido no teu leitor, inteiro e único na página.
3. Este lugar correu o `core.gate` na cabeça `a7e6b07`, nesta worktree: código um, com duas falhas, as duas da paridade nova. Os pares do Markdown com o HTML de cada edição do estudo falham com a mensagem `edições por posição: o par tem de conter as duas línguas`: a régua por posição foi aplicada a pares que só têm uma língua. O registo está em `evb-gate-direcao-a7e6b07.log`, nesta pasta.

## O que fazes

1. **A citação em colunas presa à sua linha.** Uma citação com `contexto` só passa se as palavras do contexto estiverem no excerto e se, na leitura na imagem, a citação estiver no mesmo item que o contexto (os itens da transcrição separam-se por ponto e vírgula). Com `excertos` e `contextos`, vale para cada par. Planta: o estado de uma obra provado com a linha de outra recusa; a citação presente na leitura mas noutro item recusa. Reinstala o ficheiro corrigido, com o resumo novo no contrato.

2. **O nome de uma página.** A classe do nome de uma página só passa se o nome estiver no título do documento HTML ou num título de primeiro nível da página alojada, não em qualquer texto visível. Um nome que só esteja num menu recusa (planta). Se o nome que o texto cita não estiver no título nem num título de primeiro nível da página que `CITACOES-atribuidas.json` indica, pára nessa unidade e diz o que a página tem.

3. **O texto que o leitor de uma página HTML vê.** O extrator deixa de contar o que um leitor não vê: os elementos só para leitores de ecrã (as classes `sr-only` e `visually-hidden`), os menus recolhidos (`collapse` sem `show`), um `dialog` fechado, o conteúdo de um `details` fechado fora do seu `summary`, e a opacidade zero em linha. Uma planta por caso. Corre outra vez as provas e as datas que resolvem em HTML: uma que só resolvia em texto escondido pára, e dizes qual.

4. **A tradução de uma citação.** Além dos algarismos, a palavra de escala ou a unidade logo a seguir ao número tem de corresponder à da citação: milhões com `million`, mil com `thousand`, a percentagem com a percentagem, nenhuma com nenhuma. Plantas: os mesmos algarismos com outra escala recusam; uma percentagem traduzida por uma contagem recusa.

5. **A paridade das duas edições.** A régua volta a comparar todos os números de cada unidade nas duas línguas, e não só os ligados a uma linha: em cada unidade, os valores impressos são os mesmos e as mesmas vezes, fora os que estão dentro de uma citação ou da sua tradução, que se contam à parte pela regra do ponto 4. A planta corre a régua verdadeira sobre um par de edições com um número mudado numa língua: um número ligado a uma linha, um ano e uma página, um de cada vez, e os três recusam. Diz, linha a linha, o que eram as vinte e três diferenças que o portão antigo apontou. Os pares de uma só língua (o Markdown com o HTML) voltam à comparação que tinham antes deste bloco.

6. **As linhas curtas de um quadro.** A recusa de uma linha com menos células do que o cabeçalho volta para todos os estudos, com o teste antigo de volta. Só passa uma linha curta que o contrato do texto julgado do estudo declare, pela unidade, com a razão. As linhas da cronologia deste estudo que juntam o documento e a página declaram-se assim.

7. **O fim de um intervalo de dias.** Num intervalo, a régua das datas confere o dia do fim como confere o do início. Planta: outro dia do fim recusa.

8. **As asserções.** Nenhuma declaração do livro instalado pode dizer que não autoriza publicar. Cada asserção em revisão diz o que é e quem a conferiu: uma frase com quantificador sobre o corpo fechado dos documentos do estudo, julgada frase a frase por outra família de modelos contra as cópias das fontes, em quatro voltas com plantas, com o fecho a onze de novembro. As que se possam contar por um predicado sobre linhas do livro passam a contar-se. Lista as que ficam em revisão, com a frase.

9. **O portão inteiro, na cabeça final.** Corre o `core.gate` uma vez, no fim, depois de tudo: tem de dar zero. O registo vai para esta pasta (`evb-c-gate.log` e `.codigo`), sem caminhos da máquina nem a estrutura das pastas locais; os registos dirigidos em `evb-c-conferencias`. Se der código um, corrige a causa e corre-o outra vez; não entregas com o portão vermelho sem dizer o quê e porquê.

## O que fica como está, por decisão

O texto, os nomes, a forma dos números na edição inglesa. Os outros estudos byte a byte, salvo a recusa das linhas curtas, que volta ao que era. Os achados menores da leitura (os padrões largos do classificador, a unidade no leitor de números, as folhas escondidas, a data de leitura presa pelo índice, a razão em prosa livre) ficam para o bloco de higiene: não lhes toques.

## Quando paras

Num número, numa fonte ou numa pessoa: uma prova que deixe de resolver com a régua mais apertada pára nessa unidade, e dizes qual. Para tudo o resto: decide, anota e continua.

## O fim

O relatório curto: ponto a ponto, as plantas, o que parou, as asserções que ficam em revisão, as vinte e três diferenças, os códigos, e o código do portão inteiro.
