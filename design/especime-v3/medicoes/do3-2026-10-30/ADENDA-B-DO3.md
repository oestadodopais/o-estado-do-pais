# Adenda B ao mandato DO3: o estudo nomeado antes das suas secções, as dobras das fontes conferidas, e as portas da explicação (30.10.2026, 17:40 UTC)

Acrescenta: frases

*A mesma sessão, a mesma worktree (cabeça 2db3e181d, limpa, com a adenda A). Escrita pelo lugar de direção do dia (Claude Opus 5.5). A leitura a frio do Opus (17:26 a 17:39 UTC) apanhou as cinco plantas e deixou dois achados Major e um Minor que esta adenda corrige; o resto vai para a higiene ou para a sessão seguinte.*

## 1 · O estudo nomeado antes das suas secções (o Major 5 da leitura)

As secções do estudo dizem «este estudo» (cinco vezes em português), «com a porta no fim deste estudo» e «na secção das medidas», e nada antes delas diz de que estudo se trata. Antes da secção `bloco-2` imprime-se um título de secção (`h2`, ligado ao estudo e com entrada no índice «Neste dossiê»), com o título do estudo lido dos dados do estudo, nunca escrito à mão:

- pt: «Do estudo: ⟦título do estudo⟧»
- en: «From the study: ⟦title of the study⟧»

As secções do estudo passam a ser subsecções desse título (`h3`, sem mudar o texto delas). O texto das secções não muda: «este estudo» e «a secção das medidas» ficam ditos do estudo nomeado e ligado acima.

## 2 · As dobras das fontes conferidas (o Major 6)

`conferirLeitura` (`tests/dossies/leitura.mjs`) compara só os `[data-registo-bloco]` de cada secção, e as réguas da voz e das frases da casa tiram a secção inteira da superfície: as dobras "Fontes deste parágrafo" (`details.texto-fontes`) e o que estiver entre blocos escapam às duas. A comparação passa a cobrir a secção inteira tal como se imprime na página do estudo (os blocos e as dobras, pela mesma normalização), e as réguas só tiram da superfície o que essa comparação conferiu. As plantas: uma frase da casa posta numa dobra é recusada; uma ligação de uma dobra trocada é recusada; um nó de texto entre dois blocos é recusado.

## 3 · As portas do fim da explicação na página do dossiê (o Minor 10)

No dossiê, a explicação imprime-se sem as suas portas do fim (a do estudo, que o título do §1 já liga, e a de "O que se discute sobre isto", cujo item está mais abaixo no próprio dossiê). Na página da explicação ficam como estão.

## 4 · O fim

Um commit por secção. As conferências que a mudança toca, o `npm run build` inteiro pelo escrivão (perfil `build`, tem de dar 0), e as capturas da página do dossiê nas cinco larguras e nas duas edições. Quarenta e cinco minutos, setenta chamadas. Paras e dizes só se uma régua que protege um número, uma fonte ou uma pessoa tiver de enfraquecer, ou se a frase do §1 for apanhada por um marcador da voz.
