# Adenda B ao mandato HB1-e: a correção depois da leitura a frio (29.10.2026, 14:05 UTC)

*A mesma sessão, as mesmas duas worktrees (o sítio na cabeça 5e34c1c9, o motor em d009180). O leitor (Claude Opus 5.5) apanhou as cinco plantas e deixou dois Major reais nas frases do lugar de direção e nas definições das famílias, mais dois Minor que se corrigem aqui. Commits «HB1-e3» no motor (se o motor mudar) e «HB1-e4» no sítio, pelo `comitar.sh`, com os trailers do mandato. O que não está aqui não muda.*

## 1 · As definições das duas famílias (Major 2)

As páginas das duas linhas novas dizem «A medida mostra valor mediano da avaliação bancária na habitação em setembro de 2026.» e «A medida mostra variação homóloga …», sem dizer o que o número é. As famílias ganham a definição pela mesma forma das outras famílias HB1 (a declaração que o compositor lê, com os tokens de período), palavra por palavra:

- `hab-ine-avaliacao-mediana`, pt: «É o valor mediano das avaliações que os bancos fizeram às casas em ⟦periodo: hab-ine-avaliacao-mediana⟧ quando lhes pediram crédito para as comprar: metade das avaliações ficou acima deste valor e metade abaixo. O INE publica-o em euros por metro quadrado.» en: «It is the median of the appraisals banks made of homes in ⟦periodo: hab-ine-avaliacao-mediana⟧ when credit was requested to buy them: half the appraisals were above this value and half below. The INE publishes it in euros per square metre.»
- `hab-ine-avaliacao-homologa`, pt: «É quanto o valor mediano da avaliação bancária das casas de ⟦periodo: hab-ine-avaliacao-homologa⟧ subiu face ao mesmo mês do ano anterior, em percentagem.» en: «It is how much the median bank appraisal of homes for ⟦periodo: hab-ine-avaliacao-homologa⟧ rose against the same month of the previous year, in percentage.»

As palavras da fonte que as sustentam estão na página 1 do PDF alojado: «realizada no âmbito de pedidos de crédito para a aquisição de habitação» e «Em comparação com setembro de 2025, o valor mediano das avaliações cresceu 14,2%»; a definição do mediano é a da palavra, em palavras comuns. O nome da linha homóloga fica «taxa de variação» (literal na fonte); a definição é o que diz com que mês compara.

## 2 · A frase da secção 6 conserva a medida (Major 3)

A frase nova da secção 6 passa a, palavra por palavra:

- pt: «O valor mediano da avaliação bancária das casas, a que os bancos fazem quando se pede crédito para as comprar, estava em ⟦HB:hab-ine-avaliacao-mediana⟧ euros por metro quadrado em ⟦HB:hab-ine-avaliacao-mediana|periodo⟧, ⟦HB:hab-ine-avaliacao-homologa⟧ % acima de um ano antes, pelo INE.»
- en: «The median bank appraisal of homes, the one banks make when credit is requested to buy them, stood at ⟦HB:hab-ine-avaliacao-mediana⟧ euros per square metre in ⟦HB:hab-ine-avaliacao-mediana|periodo⟧, ⟦HB:hab-ine-avaliacao-homologa⟧ % above a year earlier, by the INE.»

## 3 · A secção 11 fala do país, não da edição (Minor 19, decidido pelo lugar de direção)

O parágrafo da secção 11 passa a, palavra por palavra:

- pt: «A taxa de juro implícita de ⟦HB:hab-ine-juro-implicito|periodo⟧, os preços locais do ⟦HB:hab-ine-preco-mediano|periodo⟧ e a avaliação bancária de ⟦HB:hab-ine-avaliacao-mediana|periodo⟧ são as leituras mais recentes do INE nas secções «Quanto custa uma casa, e quanto subiu» e «O crédito». A reforma do arrendamento segue para a especialidade.»
- en: «The implicit interest rate for ⟦HB:hab-ine-juro-implicito|periodo⟧, the local prices for ⟦HB:hab-ine-preco-mediano|periodo⟧ and the bank appraisal for ⟦HB:hab-ine-avaliacao-mediana|periodo⟧ are the INE's most recent readings in the sections «What a home costs, and how much it rose» and «Credit». The rental reform goes to the committee stage.»

Saem desse parágrafo os tokens do calendário do INE e o do calendário do Orçamento (as linhas ficam no livro; se uma régua exigir que toda a linha exportada seja citada por um texto, para e diz) e a frase sobre o Orçamento, que o dossiê do Orçamento passa a ligar.

## 4 · O compositor das famílias volta a limpar as entradas antigas (Minor 18)

Em `scripts/compor-familias-hb1.mjs`, a atualização da auditoria volta a remover todas as entradas com uma chave HB1 antes de as reconstruir, como fazia antes da HB1-e-3, conservando a leitura da declaração JavaScript; uma planta (uma família cujas chaves mudam) prova que a entrada antiga desaparece.

## 5 · O relatório

Os códigos lidos dos ficheiros `.codigo` da pasta de saída de cada conferência, com o nome da pasta; as quatro frases como compostas nas duas edições; as duas definições como impressas nas páginas das linhas; o inventário com as frases novas (a secção 6, a secção 11, as duas definições, nas duas edições) e as antigas retiradas; a L1 se mudar; as ambiguidades «HB1-e-5», … com a razão. Nenhum número sem o comando que o mostra.

## 6 · O que não muda e o que pára

As duas linhas, os valores, as datas, o nome da família, a caixa: como estão. Paras e dizes se o compositor não aceitar tokens nas definições (diz a forma que aceita), se a saída dos tokens do calendário fizer uma régua recusar, ou se um portão que proteja um número, uma fonte ou uma pessoa der vermelho por uma causa que não seja um erro teu.
