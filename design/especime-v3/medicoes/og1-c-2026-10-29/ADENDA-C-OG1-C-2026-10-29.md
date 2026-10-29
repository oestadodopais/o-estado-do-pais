# Adenda C ao mandato OG1-C: a correção depois da leitura a frio (29.10.2026, 08:58 UTC)

*A mesma sessão, as mesmas duas worktrees (o sítio em `og1-c-2026-10-29` na cabeça c14a57140, o motor em `og1-c-2026-10-29` na cabeça a7c378a). O leitor (Claude Opus 5.5) apanhou as cinco plantas e deixou quatro Major reais e três Minor; esta adenda corrige os quatro Major e dois Minor numa passagem, com o prefixo «OG1-C3» no motor e «OG1-C4» no sítio, pelo `comitar.sh`, com os trailers do mandato. O que não está aqui não muda.*

## 1 · O Método promete mais do que a régua faz (Major 6)

A cláusula nova diz que as verificações recusam «uma citação de uma pessoa ou de um partido sem a passagem da fonte que nomeia quem fala selada ao lado dela», mas a âncora é exigida só às 16 afirmações do item do Orçamento (`OG1.afirmacoes` no sítio; os grupos `partidos` e `governo` no motor), e a mesma página dos itens imprime citações de pessoas sem âncora (as linhas dos outros itens). O Método só diz o que é verdade: a cláusula passa a ter o seu âmbito dentro, nas duas edições, palavra por palavra, no mesmo lugar da frase:

- pt: «, uma citação de uma pessoa ou de um partido, nas afirmações do item do Orçamento de 2027, sem a passagem da fonte que nomeia quem fala selada ao lado dela»
- en: «, a quotation from a person or a party, in the statements of the 2027 Budget item, without the source passage that names the speaker sealed next to it»

A frase inteira fica: «Antes de uma mudança chegar a estas páginas, as mesmas verificações recusam, entre outras coisas, uma frase copiada de uma fonte que não seja igual à da fonte, um nome ou uma definição que a fonte não dá a essa medida, uma citação de uma pessoa ou de um partido, nas afirmações do item do Orçamento de 2027, sem a passagem da fonte que nomeia quem fala selada ao lado dela, e qualquer dado pessoal, segredo ou caminho de uma máquina.» O resto do parágrafo não muda. O texto do Método muda outra vez, por isso: o carimbo em `**Texto:** metodo …` da §1.210 do `DECISIONS.md` passa a ser o novo resumo de `src/data/metodo.mjs` (os 12 primeiros hexadecimais do sha256, como a amarra calcula), e as duas linhas do inventário das frases com a cláusula são reescritas com a frase nova (a citar «§1.210»). A extensão da âncora às outras afirmações do sítio é outra passagem, registada pelo lugar de direção; aqui não se faz.

## 2 · A régua não recusa o erro que motivou o bloco (Major 7)

A passagem liga quem fala a uma janela de até oito blocos, não à citação: a frase da IL («moderado no alívio de impostos, …», o bloco 204 de `rtp-aominuto-28.html`) atribuída ao deputado com a `frase` no bloco 205 e a `passagem` nos blocos 204 a 205 passava tudo. A regra nova, em `extract()`, nos modos `passagem` e `entrevista`: a citação começa no bloco da `frase` ou num bloco depois dele; se começar num bloco antes do bloco da `frase`, esse bloco tem de conter um alias de quem fala. Medido pelo lugar de direção: o bloco 204 não contém nenhum alias de Mário Amorim Lopes; o bloco 394 (a citação do Chega) contém «o líder do partido» e o bloco 395 (a frase) nomeia André Ventura. Por isso:

- `og1-chega-voto` ganha o segundo alias «o líder do partido» (`aliases` fica `["André Ventura", "o líder do partido"]`; `aliases[0]` continua igual a `attributed_to`). É a expressão com que a RTP, no bloco da citação, designa quem fala; o bloco seguinte nomeia-o.
- O teste do estudo ganha a recusa do caso da IL, exatamente: uma especificação igual à de `og1-il-voto` com `quote` «moderado no alívio de impostos, moderado na vontade de reformar o país, moderado na ambição para Portugal», `frase` o bloco 205 e `passagem` os blocos 204 a 205, recusada com a mensagem própria («OG1: a citação começa antes da frase num bloco que não nomeia quem fala», ou outra que diga o mesmo); e a conferência de que `og1-chega-voto` passa pela regra nova por causa do alias no bloco 394.
- A régua do sítio (`afirmacoes-og1.mjs`) não precisa de repetir a regra (relê a `atribuicao` no motor), mas o relatório diz que a releitura com o motor passa.

## 3 · A nota do PS enquadra ao contrário (Major 8, com o Minor 12)

A página do PS é o documento do próprio partido («documento do partido» é o `attribution_mode`; o item diz «na página do partido»), e a nota «A fonte nomeia quem fala na mesma passagem em que cita» diz o contrário. `og1-ps-abstencao` passa ao modo `documento`, com a mesma `frase` (o bloco 58, que é também o bloco onde a citação começa) e sem `passagem`. Para isso, a regra do modo `documento` em `extract()` passa a ser: o bloco da `frase` precede ou é o bloco onde a citação começa pela primeira vez (a primeira ocorrência, não qualquer ocorrência; é o Minor 12); a recusa «documento com a frase depois da citação» continua a morder quando a frase vem estritamente depois. O teste do estudo passa a contar 12 `passagem`, 3 `documento` e 1 `entrevista`, e o relatório do LEIA-ME também. A nota na página da linha do PS passa a ser a do modo `documento`, nas duas edições, pela mesma vista.

## 4 · Quatro páginas imprimem uma frase que não contém a citação (Major 9)

Em `og1-governo-rtp-combustiveis` (a citação no bloco 83, a frase no 82), `og1-governo-rtp-habitacao` (88 e 86), `og1-governo-eco-juros` (157 e 152) e `og1-chega-voto` (394 e 395), a frase que nomeia quem fala não contém a citação, e o leitor não vê a passagem. A `atribuicao` ganha o campo `bloco_da_citacao`: o bloco inteiro, normalizado, onde a citação começa (nos modos `passagem` e `entrevista`; em `documento` não existe), calculado por `extract()` e conferido no corpo como a `frase`; o exportador leva-o à prova; a página da linha, quando `bloco_da_citacao` existe e é diferente da `frase`, imprime a seguir à nota do modo um segundo campo, nas duas edições, com o rótulo e o bloco:

- pt: «Onde a fonte cita»
- en: «Where the source quotes»

em `[data-linha-campo="atribuicao.bloco_da_citacao"]`, com `lang="pt-PT"` na edição inglesa, como a frase. Quando o bloco é igual à frase, nada mais se imprime. O portão de HTML confere o campo contra a prova como confere a frase; `tests/discussao/og1.mjs` confere nas duas edições as páginas das quatro linhas (e a ausência do campo nas outras doze) e recusa uma planta com o bloco alterado. As duas frases novas entram no inventário (bloco `og1-c`, a citar a §1.210).

## 5 · As plantas da régua do sítio não isolam a cláusula (Minor 10)

Cada planta de `afirmacoes-og1.mjs` passa a exigir a mensagem exata da cláusula que a nomeia (como o teste do motor faz), não qualquer mensagem «OG1 âncora:»; o relatório diz as cinco mensagens.

## 6 · O relatório (Minor 11)

Desta vez o relatório traz, para cada portão e cada conferência, o nome da pasta de saída do escrivão e o código lido do ficheiro `.codigo`; as contagens antes e depois (os checks do teste do estudo e os de `tests/discussao/og1.mjs`, as 16 âncoras, os modos 12/3/1); o diff do livro resumido; o que a exportação mudou no sítio (nenhum `ledger/claims/*.json`); as ambiguidades «OG1-C-7», «OG1-C-8», … com a razão. Nenhum número sem o comando que o mostra.

## 7 · O que não muda e o que pára

Nenhuma citação, nenhum `attributed_to`, nenhum valor, nenhuma frase do item. Nenhuma linha nova do livro, nenhuma entrada no registo público das correções. Paras e dizes se a regra do §2 recusar alguma das 16 linhas além do caso plantado da IL (o relatório diz qual e porquê, e a direção decide); se a regra do §3 recusar o PS; se o exportador pedir uma `correcao` ou `atualizacao`; se um portão que proteja um número, uma fonte ou uma pessoa der vermelho por uma causa que não seja um erro teu que corriges.
