# Adenda A ao mandato HB1-e: o nome literal da linha homóloga e a caixa medida (29.10.2026, 12:05 UTC)

*A mesma sessão, as mesmas duas worktrees, nada comitado. Paraste bem: a régua da habitação exige que o `name` de uma linha esteja literalmente no excerto, e «taxa de variação homóloga do valor mediano de avaliação bancária na habitação» não está. Esta adenda decide; o resto do mandato faz-se até ao fim.*

## 1 · O nome da linha homóloga

`hab-ine-avaliacao-homologa` leva `name` «taxa de variação», que é literal no excerto («Em termos homólogos, a taxa de variação fixou-se em 14,2%»), e `note` «A taxa de variação homóloga (em termos homólogos, no texto do INE) do valor mediano de avaliação bancária na habitação, setembro de 2026 face a setembro de 2025; destaque de 27 de outubro de 2026.». O nome da família no sítio (`hb1-familias.py`) fica como o mandato o escreveu («Variação homóloga da avaliação bancária na habitação» / «Year-on-year change in the bank appraisal of housing»): é o nome do projeto para a linha, não o da fonte, como nas outras famílias. A linha da mediana fica como está (o `name` «valor mediano de avaliação bancária na habitação» é literal).

## 2 · A caixa

A caixa das duas linhas é a que mediste, `[42, 243, 556, 304]`, com a razão no relatório (a caixa do mandato cortava carateres). O resto da especificação (o `start`, o `end`, o `expected`, o `pattern`, as unidades, o `document_binding` pelo rodapé com cedilha e a data) fica como o mandato diz.

## 3 · O resto

Tudo o mais do mandato faz-se como lá está: `hb1_build`, as frases das secções 6 e 11 nas duas edições, a data declarada da edição a 29.10.2026, a exportação, as listas do sítio, os commits «HB1-e1» (motor) e «HB1-e2» (sítio), o relatório com os códigos lidos dos ficheiros `.codigo`. As mesmas condições de paragem do §5 do mandato.
