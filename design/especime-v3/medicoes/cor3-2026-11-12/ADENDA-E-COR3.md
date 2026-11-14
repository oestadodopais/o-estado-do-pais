# Adenda E do COR3: o Major da leitura a frio e os três vermelhos da lista inteira (14.11.2026)

Acrescenta: frases
Medidas: medidas-cor3-s.json

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), na worktree do sítio `cor3-2026-11-12`; a outra pasta com escrita é a worktree do motor `cor3-2026-11-12`, que só mudas se uma causa estiver lá (o portão inteiro do motor passou na cabeça em que está; se a mudares, di-lo na primeira linha do relatório). Uma construção normal: setenta e cinco minutos e cento e vinte chamadas; não lances sessões auxiliares. Um commit por causa corrigida, com o assunto a começar por `COR3`. O teu relatório vai para `RELATORIO-COR3-E.txt`, nesta pasta, com doze linhas; os registos para `cor3-e-conferencias/`, nesta pasta, só os códigos e as últimas vinte linhas, sem caminhos da máquina. Lê primeiro `ESTADO-AO-PARAR-2026-11-13.md`, nesta pasta.*

## Porquê

O bloco parou a 13.11.2026 com o `build` a zero e quatro coisas por fechar: um achado da leitura a frio e três passos vermelhos da lista inteira. O achado já está corrigido por este lugar na cabeça de que partes; faltam as listas que essa correção faz mexer e os três passos.

## §0 O que se mediu

O que `ESTADO-AO-PARAR-2026-11-13.md` regista, da lista inteira corrida na cabeça anterior e da leitura a frio. A correção do achado, feita por este lugar: as linhas do rácio entre os preços e o rendimento em índice de ano base passaram a ter por origem uma entrada nova de `src/data/figuras.mjs`, com o mesmo documento e o mesmo selo e só a última frase do excerto selado; as linhas relativas à média de longo prazo ficam com a descrição inteira. Outras medidas da mesma coisa: nenhuma publicada.

## O que fazes

1. **O que a correção da definição faz mexer.** As listas e as provas que nomeiam a origem antiga para essas linhas (as leituras provadas do cartão, os inventários, o que mais o `build` disser) regeneram-se pela via da casa. Confere no HTML construído que o recibo de uma linha de índice de ano base mostra só a frase sobre o rendimento, e que o de uma linha relativa à média de longo prazo mostra a descrição inteira. Planta: a origem antiga reposta numa linha de índice de ano base recusa, por uma régua que diga que a definição citada tem de ser a da unidade da linha; se essa régua não existir, escreve-a pequena.

2. **`check:incorporar`.** Em `tests/incorporar/conferir.mjs`, a planta que troca o país de uma célula de um pedido com vários países deixou de fazer `lugarDaIncorporacao` recusar. A derivação do lugar das células relidas mudou neste bloco. Diz, lido no código, se a guarda ficou mais fraca; se ficou, repõe-na: uma célula cujo país não é o do lugar da linha recusa, haja ou não declaração de lugar. A planta volta a morder pelo seu motivo, sem ser reescrita para outro.

3. **`check:eo1`.** Em `tests/eo1/documento.mjs`, a conferência do nome de uma linha nova do Orçamento passa sem linhas de prova. Acha a linha e a causa; a conferência volta a recusar um nome sem prova, e a linha fica com a prova que o seu nome pede.

4. **`check:frases-reais`.** Cinco entradas não retiradas da lista VOZ-2B já não estão nas páginas declaradas, porque as correções julgadas mudaram as suas frases. Saltam com a razão (a correção do COR3 que as mudou), como a casa fez às listas históricas noutros blocos, e as contagens fixadas acompanham, cada uma com a conta dita.

5. **O `build` inteiro até ao código 0 e a lista inteira do `verify`, passo a passo,** como na adenda D: corriges cada causa na origem e repetes; no fim, cada passo tem o seu código num ficheiro. `conferir-composto-cor3.py` continua com todos os trechos conformes dos dois lados.

## O que fica como está, por decisão

As frases das três folhas e dos mandatos. As bases e os tetos, salvo o que este bloco mede de novo, com a medição dita.

## Quando paras

Numa régua que proteja um número, uma fonte ou uma pessoa e só passe enfraquecida, ou que peça uma frase nova: paras nesse ponto, dizes qual, o que recusa e a forma mais próxima que aceita, e continuas com os outros.

## O fim

O relatório: o código final do `build`; os passos da lista com código diferente de zero, se sobrar algum, com a causa; a resposta à pergunta do ponto 2; as causas corrigidas, uma por linha.
