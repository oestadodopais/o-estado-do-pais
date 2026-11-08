# Adenda D ao mandato HIG-6A: a cobertura da asserção na forma do motor, e o resto da adenda C (08.11.2026)

Acrescenta: nada

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da tua paragem pelo §2 da adenda C (c0c99631d), que estava certa: a regra do §1.4 deste lugar pedia mais do que o motor pede. Quarta retoma, por decisão escrita. A mesma sessão e a mesma worktree.*

## §0 Medido (pelo teu relatório da paragem)

- A asserção da V188 existe nos livros do motor; a sua citação acaba em «da Évora» e a oração da `nova` acaba em «da Évora 2027». As outras sete declarações passam a regra como estava escrita.
- O motor (`core/assertions.py`) pede que a citação esteja no texto e cubra o quantificador, não que contenha a oração inteira.

## §1 O que fazes

1. **A cobertura na forma do motor:** uma `assercao` declarada passa quando existe nos livros do motor do estudo da entrada (ou das composições que o importam) e uma das suas citações aparece na `nova` e contém a ocorrência do quantificador que a camada 0 achou. Uma planta: a citação que não contém o quantificador recusa-se; uma citação que não aparece na `nova` recusa-se; a V188 passa.
2. **O resto da adenda C, inteiro:** a cadeia (`check:pre-mandato` e a repetição nos casos reais no `verify`; as plantas da régua do repositório num guião com nome); a ligação provada (uma planta por regra a correr o `conferir()` verdadeiro, e a prova ponta a ponta do código de saída do `pre-mandato.py` sem substitutos); as entradas na página (no pré-mandato, a `frase` de cada entrada numa das suas páginas, e doze carateres no mínimo; a opção explícita para uma lista já aplicada); os menores (o `Frases:` fora do cabeçalho recusado; o extrator de números da camada 0 com os grupos de milhares, com a planta).
3. **O fecho:** como no §1.6 da adenda C.

## §2 Quando paras

Se outra declaração da VOZ-2A falhar a regra na forma do motor; se a regra das entradas na página recusar a VOZ-2B por frases que lá estão; como no mandato para o resto.

## §3 O fim

O §1, ponto 3. Setenta e cinco minutos, cento e vinte chamadas.
