# Adenda E ao mandato EV2: o âmbito da prova do texto lido sobe de 14 para 18 edições (30.10.2026, 16:35 UTC)

Acrescenta: nada

*A mesma sessão, a mesma worktree (a tua mudança da adenda D comitada pelo lugar de direção como `EV2-7`). Escrita pelo lugar de direção do dia (Claude Opus 5.5). A tua retoma parou bem: pelo leitor de YAML, 18 edições têm a prova `edicao-html` e os bytes do motor, e não 14. O leitor antigo excluía em silêncio as seis entradas que o exportador escreve com os valores entre aspas (o estudo da habitação, o das contas de Évora e o do Orçamento, as duas edições de cada), e só a contagem apanhou as duas do estudo das contas. As 18 dão as unidades iguais ao registo.*

## 1 · O que muda

Em `scripts/provar-eyetext.mjs`, `EDICOES_DA_PROVA` passa de 14 a 18, e o comentário do âmbito ganha um parágrafo pela forma dos que já lá estão («O ÂMBITO SOBE DE … PARA …»): a 30.10.2026, com o leitor de YAML, as quatro edições que o leitor antigo excluía por as entradas estarem entre aspas (o estudo da habitação e o do Orçamento, as duas edições de cada) entram na prova, e as duas do estudo das contas de Évora voltam; a prova foi relida sobre as seis, com os blocos lidos e as unidades iguais de cada uma, lidos da tua corrida (escreve os números da saída da prova, não de memória). Nada mais muda.

## 2 · O fim

Um commit. `npm run provar:eyetext` (tem de dar 0 sobre 18 edições), com o código em `.codigo`. Dez minutos, vinte chamadas. O leitor por expressão de `scripts/check-registo.mjs:251` fica para a higiene, como disseste.
