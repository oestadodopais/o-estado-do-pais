# Adenda G ao mandato VOZ-2A: os quantificadores das frases novas, e o fecho (07.11.2026)

Acrescenta: frases

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da paragem da adenda F, que estava certa: o `core.gate` recusou três frases prescritas por este lugar, cada uma com um quantificador que nenhuma asserção cobre. A mesma sessão, a worktree `voz2s-2026-11-07` (o sítio em 909e5acca e 140df7fee, com o commit desta adenda por cima) e o motor `voz2-2026-11-07` (aee6017).*

## §0 Medido (pelo teu `assercao-pendente.json` e pelo teu relatório, lidos por este lugar)

- V182 (pt; o documento do estudo 04 e a composição do 18): «nenhuma das fontes afirma que são a mesma entidade» é uma afirmação sobre as fontes (os dois registos).
- V040 (en; o documento do estudo 14 e a composição do 19): «none of them is an execution account» é uma afirmação sobre os documentos municipais lidos.
- V195 (pt; o estudo 07): «o contexto de todos os números» não afirma nada sobre uma fonte; o par inglês («the context for every number in this document»), que a régua da voz não apanhava, tem a mesma forma.
- A planta `R3(04)` de `publisher.export_records_test` pressupõe um primeiro parágrafo no estudo 04, que as retiradas autorizadas tiraram.

## §1 O que fazes

1. **V182 e V040: asserções declaradas.** Cada uma é uma afirmação sobre fontes e fica protegida como a `base-sem-contratos` da adenda D: uma asserção nova em cada livro onde a frase se publica (04 e 18 para a V182; 14 e 19 para a V040, pela importação da composição), com a citação igual à oração nova, pt «nenhuma das fontes afirma que são a mesma entidade», en «none of them is an execution account», e a `review` a dizer o que a sustenta: na V182, os dois registos lidos no estudo dão ao organismo nomes diferentes e nenhum diz que são o mesmo (relê-se nos dois); na V040, a quantificação é sobre os documentos municipais que o estudo lista como lidos, todos previsões (relê-se em cada um). Autorizado nos livros: só estas asserções e as impressões digitais em `composto_de` que mudam com elas. Se já existir uma asserção desta afirmação com a forma antiga, reancoras essa, com o mesmo `id` e a mesma `review`.
2. **V195 e V308: sem o «todos».** Na lista (o commit desta adenda), a V195 diz agora pt «Dez anos a pagar a dívida do resgate são o contexto destes números:», e o par inglês entra como V308: «Ten years of paying down the rescue debt is the context for every number in this document:» passa a «Ten years of paying down the rescue debt is the context for these numbers:», na fonte inglesa do estudo 07 e na tradução. Nenhum número muda (o guião das frases novas dá zero recusas e zero diferenças de números).
3. **A planta R3(04):** adaptas o ensaio a uma edição que tenha o primeiro parágrafo que ele adultera (outro estudo, ou uma edição sintética declarada), com a mesma proteção; dizes qual.
4. **O fecho:** o `core.gate` verde fora da sandbox; o commit do motor; a travessia; o `build` inteiro e as conferências do §4 do mandato; os commits do sítio; o relatório com a diferença dos livros campo a campo.

## §2 Quando paras

Se uma das asserções não se conseguir ancorar sem mudar a frase; se outro quantificador aparecer (diz qual); como nas adendas anteriores.

## §3 O fim

O §4 do mandato. Setenta e cinco minutos, cento e vinte chamadas.
