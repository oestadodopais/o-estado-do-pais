# Adenda B ao mandato EVA-T: a frase da fonte anterior só onde é verdade (11.11.2026)

Acrescenta: frases

*Escrita pelo lugar de direção (Claude Fable 5.2). O erro é deste lugar, e não teu: a regra do ponto 4 da adenda A estava larga demais, e tu implementaste-a como foi escrita. Medido por este lugar no livro e no HTML construído da tua cabeça: a frase nova imprime-se nos recibos de dezanove linhas, e só numa a fonte mudou. Nas outras dezoito o ficheiro relido é o da própria fonte (em seis, o endereço só difere no fragmento da página; nas restantes, é outro endereço do mesmo ficheiro ou da mesma série), e dizer «fonte anterior» é falso. Uma correção: trinta minutos e sessenta chamadas, um commit. O teu relatório vai para `RELATORIO-EVA-T-B.txt`, nesta pasta (o da adenda A ficou na raiz do repositório, e este lugar já o trouxe para aqui).*

## O que mudas

1. **A fonte anterior passa a ser declarada, e a frase só se imprime com a declaração.** A correção de uma linha pode levar um campo novo, `previous_source_url`: o endereço da fonte que a linha tinha antes dessa correção. A frase da fonte anterior imprime-se só para uma reconferência cujo endereço seja, letra por letra, o `previous_source_url` de uma correção dessa linha com data igual ou posterior à da reconferência. Todas as outras reconferências imprimem exatamente o que imprimiam antes da adenda A, pela regra que lá estava (a tentativa, o ficheiro relido, a segunda leitura).
   - Na linha `evora-execucao-da-receita-2021`, a correção de `2026-11-11` ganha `previous_source_url: "https://www.cm-evora.pt/wp-content/uploads/2026/05/PRESTACAO_CONTAS_2025.pdf#page=112"`, que é o `source_url` que a linha tinha antes da tua passagem (confere-o no `git`).
   - A régua do livro aceita o campo só como um endereço diferente do `source_url` de hoje.
   - A régua da frase legível (`scripts/verificacao-legivel.mjs`) e a página (`src/views/LinhaView.astro`) seguem a mesma regra, por uma função só.
   - Plantas: uma reconferência com o endereço diferente do da fonte e sem declaração imprime a frase de antes (as dezoito linhas, medidas nos recibos construídos das duas edições: nenhum recibo fora dos dois da linha de 2021 imprime a frase da fonte anterior); a declaração com o endereço da fonte de hoje recusa; uma reconferência posterior à correção não leva a frase.

## A prova

O `build` da cabeça; `ledger:check`, `check:cruzamento` (com o motor), `check:registo`, `gate:html`, `typecheck`, `tests/eva/reconferencias.mjs` e o que mais a mudança tocar. No relatório: quantos recibos imprimem a frase da fonte anterior no HTML construído (têm de ser dois), e a frase que os recibos de `evora-divida-total-2025` e de `evora-prr-pago-2026` imprimem, nas duas edições.

## Quando paras

Se o `check:cruzamento` recusar o campo novo na linha, que é gerada pelo motor: pára nesse ponto e diz o que a régua pede. Para o resto: decide, anota e continua.

## O fim

O ponto, num commit (o assunto a começar por `EVA`), e o relatório.
