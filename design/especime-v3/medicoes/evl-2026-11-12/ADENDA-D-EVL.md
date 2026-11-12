# Adenda D do EVL: o que resta do `check:voz`, em duas causas (12.11.2026)

Acrescenta: nada

*Escrito pelo lugar de direção (Claude Fable 5.2). O construtor é o Codex `gpt-6-astra` (`high`), com rede, na worktree do sítio `evl-2026-11-12`; a outra pasta com escrita é a worktree do motor `evl-2026-11-12`, onde não tens nada a mudar. Uma correção: trinta minutos e sessenta chamadas; não lances sessões auxiliares. Um commit no fim de cada ponto numerado, com o assunto a começar por `EVL`. O teu relatório vai para `design/especime-v3/medicoes/evl-2026-11-12/RELATORIO-EVL-D.txt`, com dez linhas; as tuas medidas e registos para a mesma pasta (`medidas-do-construtor-evl-d.json`, `evl-d-conferencias/`). O registo de uma reconstrução não se comita inteiro: só o código e as últimas vinte linhas.*

## Porquê

A adenda C fechou a língua, o EO1 e a lista fechada das medidas do cartão. O `check:voz` continua vermelho no passo `scripts/check-voz.mjs`, por coisas que a recusa anterior escondia. Este lugar leu as causas e correu, um a um, os passos da cadeia que vêm depois desse: os nove dão zero. Faltam duas causas.

## §0 O que se mediu (na cabeça da adenda C, pelo teu registo `evl-c-conferencias/check-voz.log`)

1. **Doze recusas de nome.** `textoDaVoz` (em `scripts/voz-edicoes.mjs`) junta os nós de texto com um espaço. O nome de uma linha que tenha um ano seguido de pontuação chega à comparação com um espaço antes dessa pontuação, e a régua do nome declarado (`scripts/medir-defeitos.mjs`, a comparação de `data-nome` com `data-de-linha`) recusa-o. Duas das cinco linhas novas têm essa forma, nas duas línguas (a contribuição inicial e o relato ao painel), no caminho e no título do recibo e na lista do livro. As outras três têm o ano seguido de espaço ou no fim, e passam. O HTML está certo: imprime o nome inteiro, sem espaço a mais.
2. **Oito blocos por classificar e quatro linhas vivas que já não se rendem,** em `design/especime-v3/INVENTARIO-FRASES.md`: a frase do cartão mudou (as duas linhas da frase anterior, de `evb-t-b`, ficaram vivas); os quatro nomes curtos das medidas do cartão são texto novo na página de entrada; e a contagem do livro passou a outra, porque o livro cresceu com as cinco linhas (as duas linhas vivas da contagem anterior, de `cor-agua`).

## O que fazes

1. **O nome de uma linha compara-se como o leitor o lê.** Na comparação de identidade de um `data-nome` com a sua linha, a sua série ou a sua família, o texto do elemento lê-se sem o espaço que o extrator põe entre nós, ou com esse espaço desfeito antes de pontuação, pela forma que conservar o que a régua protege: o texto marcado é, carácter a carácter, o nome declarado. Mede antes, sobre o `dist/` inteiro, que nenhum nome hoje verde passa a vermelho. Plantas, no HTML de um recibo: uma palavra do nome trocada recusa; um ano trocado recusa; a vírgula tirada recusa.

2. **O inventário das frases.** Pela forma que a casa usa: as duas linhas da frase anterior do cartão passam a retiradas, com a razão (substituída pelas duas primeiras frases da unidade `C004`); a frase nova entra nas duas línguas; os quatro nomes curtos das medidas entram; a contagem do livro fica a que o `dist/` imprime, e a anterior sai como a casa faz às contagens que mudam. Nenhum texto de página muda para caber no inventário.

3. **A prova.** `check:voz` e `check:voz-retiradas`, sobre um `dist/` reconstruído, com cada código lido de um ficheiro. O `build` inteiro, o `check:alvos` e a lista inteira corre-os este lugar.

## O que fica como está, por decisão

As frases do cartão e dos recibos, os nomes das medidas, as cinco linhas, o motor, e o extrator `textoDaVoz` para tudo o que não seja a comparação de um nome declarado.

## Quando paras

Se um nome só passar mudando o que a página imprime. Para tudo o resto: decide, anota e continua.

## O fim

O relatório em dez linhas: os dois pontos, as plantas, os códigos, o que ficou por correr.
