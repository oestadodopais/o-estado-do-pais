# Adenda E ao mandato EV3: a única vermelha do build (03.11.2026)

Acrescenta: nada

*A mesma sessão. Este lugar leu o registo do teu último `build` (`check:pais` vermelho) e achou a causa; uma passagem só (a M99).*

## §1 A causa

`check:pais` corre `tests/inicio/linhas-da-casa.mjs`, que dá «E0 contagem: o contador não coincide com as correções do livro». Na linha 31, a recontagem soma as entradas `correcao` do livro com `CORRECOES_TEXTO.length`, e a lista passou a ter a entrada `texto_atualizado` da EV3. O contador está certo: `src/lib/ledger.mjs`, na linha 1549, conta só `CORRECOES_TEXTO.filter(e => e.kind === 'texto')`, como o §3 do mandato pede (uma atualização não é uma correção). A recontagem do teste passa a contar da mesma maneira, por uma só função partilhada entre os dois sítios, para que não voltem a divergir. Planta: uma entrada `texto_atualizado` contada como correção é recusada.

## §2 O fim

O `build` inteiro pelo escrivão, verde; um commit; o relatório. Vinte minutos, trinta chamadas. Paras e dizes só se o `build` sair vermelho por outra causa (diz qual, com a linha do registo).
