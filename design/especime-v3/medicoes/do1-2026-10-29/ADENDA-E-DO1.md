# Adenda E ao mandato DO1: a regra dos selos volta ao contexto do dossiê, e os rótulos da B1 do dossiê da casa (29.10.2026, 17:06 UTC)

*A mesma sessão, a mesma worktree do sítio (ramo `do1-2026-10-29`, cabeça 02dc6db39), nada comitado. Paraste bem, e depressa: a adenda D mandava parar se o portão exigisse selos na primeira página, e exige, mas por uma regra que a própria passagem DO1-2 escreveu («DO1: valor do resumo sem o seu selo local», em `porta-da-conclusao-discussao.mjs`, usada por `gate-html.mjs` para aceitar a proveniência no item ligado), não por uma regra anterior ao DO1. Decisão: essa regra fica só para o contexto do dossiê, que é onde os resumos ganham selos; na primeira página e em `/o-que-se-discute/` a proveniência dos resumos aceita-se como `gate:html` a aceitava na cabeça `main` 71d85e4ce (a referência é o próprio ficheiro nessa cabeça: `git show 71d85e4ce:scripts/gate-html.mjs` e `git show 71d85e4ce:scripts/porta-da-conclusao-discussao.mjs`, ou os nomes equivalentes se mudaram), sem perder o que a regra protege no dossiê (um resumo com valor leva o selo da sua linha). A segunda lista que faltava, `ROTULOS_B1` em `src/data/rotulos-b1.mjs`, tem seis entradas do dossiê da casa (`DOSSIES[1]`): saem com o dossiê, conservando as do dossiê do Orçamento, e a planta ou a contagem da B1 que as nomeie ajusta-se e o relatório diz o número antes e depois. Tudo o mais da adenda D faz-se como lá está (os §§1 a 6, 7b e 8), com o commit «DO1-8».*

## 1 · A regra dos selos, por contexto

1. `porta-da-conclusao-discussao.mjs`: a conferência «DO1: valor do resumo sem o seu selo local» corre só quando o bloco está no contexto do dossiê (o marcador `data-dossie-discussao`, ou o equivalente que o HTML construído tenha); fora dele, o caminho de `main` 71d85e4ce.
2. `gate-html.mjs`: a aceitação da proveniência no item ligado volta, para a primeira página e para `/o-que-se-discute/`, à forma de `main` 71d85e4ce; no dossiê, a forma do DO1-2.
3. A prova: `gate:html` verde com a primeira página byte a byte como em 71d85e4ce nos resumos dos itens (o `diff` que a adenda D §4 pede), e uma planta que tire o selo de um resumo no dossiê e veja o portão recusar.

## 2 · `ROTULOS_B1`

As entradas de `DOSSIES[1]` saem de `src/data/rotulos-b1.mjs`; as de `DOSSIES[0]` ficam; se o ficheiro indexar os dossiês por posição, passa a indexá-los pelo slug, para que uma lista de um dossiê só não dependa da ordem. `check:lugar` (a B1) e a sua planta correm e os códigos entram no relatório.

## 3 · O resto

Como a adenda D: os §§1 a 6 e 7b, as conferências do §8 mais `check:lugar`, o relatório com o que o §8 pede e mais os números da B1 antes e depois, e as mesmas condições de paragem.
