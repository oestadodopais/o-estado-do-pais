# Adenda D ao mandato OG1-C: a decisão sobre a entrevista (29.10.2026, 09:05 UTC), e a adenda C continua

*A mesma sessão, as mesmas duas worktrees, com as alterações parciais por comitar no motor (a regra nova e o `bloco_da_citacao` em `oe2027_generalidade.py`; o modo do PS e o segundo alias do Chega em `extracoes.json`). Paraste bem: a regra do §2 da adenda C recusava `og1-il-prioridades`, uma afirmação real, e o §7 mandava parar. Esta adenda decide esse caso; tudo o resto da adenda C fica como está e faz-se até ao fim, com os commits «OG1-C3» no motor e «OG1-C4» no sítio.*

## 1 · A regra da ordem aplica-se só ao modo `passagem`

A regra do §2 da adenda C (a citação começa no bloco da `frase` ou depois dele; se começar antes, o seu bloco contém um alias) passa a aplicar-se só ao modo `passagem`. No modo `entrevista` a forma da fonte é outra: o título citado vem antes do cabeçalho que nomeia quem responde (em `il-eco.html`, a citação é o título no bloco 150 e Mariana Leitão é nomeada no bloco 152), e é isso que a nota do modo diz ao leitor («Entrevista: a fonte nomeia quem responde no seu cabeçalho»). O modo `entrevista` conserva as conferências que já tinha (a `frase` é um bloco com um alias; a `passagem` de até oito blocos contém a `frase` e a citação inteira; nenhuma outra pessoa que fala no mesmo ficheiro). O teste do estudo ganha a conferência de que `og1-il-prioridades` passa com a citação antes da frase por ser `entrevista`, e a recusa de que a mesma especificação com o modo `passagem` é recusada pela regra da ordem (a mensagem própria). A recusa do caso da IL de 28.10 (o §2 da adenda C) fica como está, em modo `passagem`.

## 2 · «Onde a fonte cita» só no modo `passagem`

O campo `bloco_da_citacao` calcula-se nos modos `passagem` e `entrevista` e vai à prova nos dois, mas a página da linha só o imprime no modo `passagem` e quando é diferente da `frase` (as quatro páginas do §4 da adenda C). No modo `entrevista` a citação é o título, que a página já mostra como excerto, e o bloco do título em `il-eco.html` traz a marca «premium» do jornal; a nota do modo diz onde a citação está. O portão de HTML e `tests/discussao/og1.mjs` conferem esta regra: o campo nas quatro páginas, a sua ausência nas outras doze nas duas edições, a planta do bloco alterado recusada.

## 3 · O resto

Tudo o mais da adenda C faz-se como lá está: o âmbito na cláusula do Método com o carimbo novo na §1.210 e as duas linhas do inventário; o PS em `documento` (a pré-validação já o confirmou no bloco 58) e a primeira ocorrência; o segundo alias do Chega; a regeneração do livro, das provas, do LEIA-ME (12 `passagem`, 3 `documento`, 1 `entrevista`) e a exportação (nenhum `ledger/claims/*.json` muda); as plantas da régua do sítio com a mensagem exata; o relatório com os códigos lidos dos ficheiros da pasta de saída. As mesmas condições de paragem do §7 da adenda C.
