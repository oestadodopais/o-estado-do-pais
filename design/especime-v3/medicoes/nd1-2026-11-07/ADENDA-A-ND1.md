# Adenda A ao mandato ND1: a linha inglesa do inventário na forma que a régua lê (07.11.2026)

Acrescenta: nada

*Escrita pelo lugar de direção (Claude Opus 5.5) depois da paragem da ND1 às 05:19 UTC de 07.11.2026, que estava certa pelo §3. A mesma sessão e a mesma worktree. As tuas alterações por comitar estão guardadas numa patch, `_aterragens/lancador-nd1/nd1-em-curso.patch` (14 ficheiros; conferida por este lugar: aplica-se na cabeça e reproduz cada ficheiro byte a byte), e a worktree voltou ao último commit, porque o pré-voo de uma retoma recusa uma worktree com modificações.*

## §0 Medido (07.11.2026, por este lugar, em `scripts/check-voz.mjs` e no `dist/` da tua construção)

- A frase inglesa constrói-se como pede o mandato: «The source publishes «<span lang="pt-PT">N.d.</span>» instead of a value.».
- A régua da voz lê o texto de uma página juntando os nós de texto com um espaço (`textoSemOrigens`, `partes.join(' ')`): onde há um elemento dentro da frase, lê um espaço de cada lado. Lê por isso «The source publishes « N.d. » instead of a value.», e a linha do inventário, escrita sem esses espaços, não se encontra em rota nenhuma. A frase portuguesa não tem elemento dentro e encontra-se.
- A casa já tem a convenção: o inventário escreve a frase na forma que a régua lê, e não na que a página escreve (`design/especime-v3/INVENTARIO-FRASES.md`, a nota «O ESPAÇO ANTES DOS DOIS PONTOS NA FRASE DA LEI É A RÉGUA A LER, E NÃO A PÁGINA A ESCREVER», bloco `pequenas-5`, 29.08.2026).

## §1 O que fazes

0. Aplicas a patch (`git apply`) antes de mais nada.
1. A linha inglesa da ND1 no inventário passa a ter a forma que a régua lê, «The source publishes « N.d. » instead of a value.», com a razão a citar essa convenção. A página fica como está («N.d.» colado às aspas e marcado como português). A régua não muda.
2. Constróis outra vez, e corres `check:voz`, `check:lingua` e as conferências que ficaram por correr, com os códigos; `check:cabeca` fica para a corrida inteira deste lugar, fora da sandbox.
3. Comitas como o §4 do mandato diz.

## §2 Quando paras

Se a linha nessa forma não se encontrar, ou se outra régua a recusar (diz qual).

## §3 O fim

O §4 do mandato. Vinte e cinco minutos, quarenta chamadas.
