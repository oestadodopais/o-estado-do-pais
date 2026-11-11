# Adenda C ao mandato EVA-T: a fonte anterior declarada fora da linha (11.11.2026)

Acrescenta: frases

*Escrita pelo lugar de direção (Claude Fable 5.2). Paraste bem na adenda B: a régua da travessia protege os bytes da linha, e não se toca. A declaração da fonte anterior passa a viver fora da linha. O resto da adenda B fica como foi escrito: a frase da fonte anterior só se imprime onde é verdade, e as outras dezoito linhas voltam a imprimir o que imprimiam antes da adenda A. Uma correção: trinta minutos e sessenta chamadas, um commit. O teu relatório vai para `RELATORIO-EVA-T-C.txt`, nesta pasta.*

## O que mudas

1. **A declaração.** Um ficheiro novo, `ledger/fontes-anteriores.json`: uma lista, com uma entrada por linha que mudou de fonte numa correção. Cada entrada tem a linha (`linha`), a data da correção (`data_da_correcao`), o endereço da fonte que a linha tinha antes (`endereco_anterior`) e a razão (`razao`). Hoje tem uma entrada só:
   - `linha`: `evora-execucao-da-receita-2021`
   - `data_da_correcao`: `2026-11-11`
   - `endereco_anterior`: `https://www.cm-evora.pt/wp-content/uploads/2026/05/PRESTACAO_CONTAS_2025.pdf#page=112`
   - `razao`: `A correção de 11.11.2026 trocou o historial recitado na Prestação de Contas de 2025 pelo quadro do Relatório de Gestão de 2021.`

2. **A régua da declaração** (no `ledger:check`, ou ao lado dele na mesma cadeia): cada entrada nomeia uma linha que existe; a linha tem uma correção com essa data; o endereço anterior é diferente do `source_url` de hoje; pelo menos uma reconferência da linha tem esse endereço, letra por letra, com data igual ou anterior à da correção; nenhuma linha se repete. A linha do livro não muda um byte.

3. **A frase.** A frase da fonte anterior imprime-se só para uma reconferência cujo endereço seja o `endereco_anterior` declarado para a sua linha e cuja data seja igual ou anterior à `data_da_correcao`. Todas as outras reconferências imprimem exatamente o que imprimiam antes da adenda A (a tentativa, o ficheiro relido, a segunda leitura). A página (`src/views/LinhaView.astro`) e a régua da frase legível (`scripts/verificacao-legivel.mjs`) usam a mesma função.

4. **As plantas:** uma reconferência com o endereço diferente do da fonte e sem declaração imprime a frase de antes; uma declaração com o endereço da fonte de hoje recusa; uma declaração sem reconferência com esse endereço recusa; uma declaração para uma linha sem correção nessa data recusa; uma reconferência posterior à correção não leva a frase. E a medição nos recibos construídos das duas edições: só os dois recibos da linha de 2021 imprimem a frase da fonte anterior.

## A prova

O `build` da cabeça; `ledger:check`, `check:cruzamento` (com o motor), `check:registo`, `gate:html`, `typecheck`, `tests/eva/reconferencias.mjs` e o que mais a mudança tocar. No relatório: quantos recibos imprimem a frase da fonte anterior no HTML construído (têm de ser dois), e o que os recibos de `evora-divida-total-2025` e de `evora-prr-pago-2026` imprimem na linha da reconferência, nas duas edições.

## Quando paras

Não há paragem prevista: a linha não muda. Decide, anota e continua.

## O fim

Os quatro pontos num commit (o assunto a começar por `EVA`), e o relatório.
