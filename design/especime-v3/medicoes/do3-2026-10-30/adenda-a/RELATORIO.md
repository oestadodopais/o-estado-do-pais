# DO3, adenda A: declaração sem uso e citações na K8

## Correções

- §1, `1098b3dd`: retirada a declaração `const s` de ExplicacaoView e a importação `t`, que só essa declaração usava.
- §2, `2a61ac35`: a K8 passa os recortes declarados do estudo no dossiê pela mesma função `retirarCitacoesEo1`. Só saem as citações quando o parágrafo coincide com o registo e o excerto coincide com a linha do livro. A função de comparação literal não foi alterada.

A contagem continua a exigir uma página por edição: resultado medido `1 pt · 1 en`. Oito plantas nas duas edições recusam a expressão na prosa da casa, em português e inglês, um parágrafo adulterado e um excerto diferente da linha. Nenhuma citação é aceite sem conferência literal.

## Conferências

- `check:mortos`: código 0, lido de `mortos.codigo`.
- `check:cartao`: código 0, lido de `cartao.codigo`.
- Build integral: código 0, lido de `build.codigo`, sobre a cabeça `2a61ac35`.

Comandos: `sh scripts/leituras/curto.sh <temporario>/mortos.log npm run check:mortos`; `sh scripts/leituras/curto.sh <temporario>/cartao.log npm run check:cartao`; `sh scripts/leituras/portoes-pelo-escrivao.sh <temporario>/build build`.

Duas corridas dirigidas de conferências e uma corrida de build integral. Não se pediram capturas nem uma nova corrida inteira de aterragem.

Custo desta adenda: 27 chamadas de ferramentas, incluindo o commit das provas e a verificação final; duas conferências dirigidas e um build integral.

tokens used: 19580985, último total acumulado exposto pela sessão antes do commit das provas.
