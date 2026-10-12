# Brief · I129 · O grupo etário dos jovens que não estudam nem trabalham: a linha diz o que a série é

*Escrito pelo lugar de direção (Claude Fable 5.1) a 22.09.2026, a partir da I129 e da §1.118. Um bloco pequeno com uma parte no motor (`~/Instruments/ResearchHub`, o gerador das linhas) e uma parte no sítio. O construtor é o Claude Opus, numa worktree do sítio (`.claude/worktrees/jovens-nem-2026-09-22`) e, para o motor, na árvore principal dele só nos ficheiros que o brief nomeia; a leitura a frio é do Codex. Sem travessões na prosa.*

## 0 · O que se mediu (22.09.2026)

O quadro `tipslm90` do Eurostat intitula-se, no catálogo e na resposta, «Young persons (aged 15-24) neither in employment nor in education and training - % of total population in private households in the same age group», e é esse o `document.title` e o começo do `excerpt` das linhas `jovens-nem-2024`, `jovens-nem-2025` e `jovens-nem-2025-ue`. A resposta do Eurostat ao pedido da linha (`source_url`, `tipslm90?…&geo=PT&unit=PC_POP`) declara a dimensão `age` com uma única categoria, `Y15-29: From 15 to 29 years`, e os valores 8,7 (2024) e 8,0 (2025). No quadro `edat_lfse_20`, lido às 01:01 UTC de 22.09, os 15 aos 24 dão 6,9 em 2025 e os 15 aos 29 dão 8,0. O motor já o sabia (`indicators/convergence.md:73`: «15-29 since 2024, old 15-24 refs are stale»). O sítio não o diz em lado nenhum: a definição da medida em `src/data/figuras.mjs` (`'jovens-nem-2025'`) fala de «um grupo de idades e sexo» sem os dizer, o excerto não traz a etiqueta da idade, e o recibo mostra ao leitor o título com «aged 15-24» ao lado de um valor dos 15 aos 29. Nenhum valor está errado. O `excerpt` compõe-se em `indicators/generate_claims.py` (`compor_excerto(label, unit_raw, geo_label, period, value)`) a partir das etiquetas da própria resposta, e as linhas escrevem-se em `~/Instruments/OEstadoDoPais/ledger/claims/` a partir de `indicators/availability.json`, que é um ficheiro de outra corrida e não se toca.

## 1 · O teste de aceitação, dito antes

Feito quer dizer: (1) o excerto de uma linha cujo pedido fixa uma dimensão que não é o total (a idade, o sexo, o setor) traz a etiqueta dessa dimensão tal como a resposta a escreve («Age class: From 15 to 29 years»), composto por `compor_excerto` e por mais ninguém, e as três linhas `jovens-nem-*` são reescritas pelo gerador (`--write` só para elas) com o excerto novo, o valor inalterado, e uma `note` datada a dizer que o título do catálogo diz «aged 15-24» e a dimensão da resposta diz «From 15 to 29 years»; (2) a definição da medida no sítio escreve o grupo etário nas duas edições («dos 15 aos 29 anos»; «aged 15 to 29»), lido do excerto e não de memória; (3) uma célula nova do `check:cartao` (K13): para cada medida cuja linha traz uma etiqueta de idade no excerto ou um filtro `age=` no `source_url`, a definição nas duas edições escreve os dois limites desse grupo; planta: «dos 15 aos 24 anos» na definição; (4) a mudança declara-se em `src/data/mudancas-do-projeto.mjs` (I124) com a data, o texto e as três linhas, e aparece em «O que mudou» na página do país; (5) os três portões a 0 na cabeça final; (6) o motor com o gerador emendado, o `core.gate` verde e o commit feito só com `Co-Authored-By`, sem `push`; a árvore principal do motor não ganha nenhum ficheiro além do gerador e do seu teste.

## 2 · O mandato

| # | o que | a medida |
|---|---|---|
| 1 | `compor_excerto` ganha as etiquetas das dimensões fixadas que não são o total, lidas da resposta que o gerador já pede (ou pede para este efeito, pelo cliente da casa, um pedido de cada vez); as linhas sem dimensão fixada não mudam | um teste do gerador com uma resposta guardada, e a planta (a etiqueta trocada) |
| 2 | As três linhas reescritas pelo gerador com o excerto novo e a `note` datada; nenhum outro ficheiro do livro-razão muda; o valor, a unidade, o período e o `source_url` iguais byte a byte | o `git diff --stat` do sítio com três ficheiros em `ledger/claims/`, e o `ledger:check` a 0 |
| 3 | A definição nas duas edições com o grupo etário, e a K13 com a planta | a saída do `check:cartao --prova` |
| 4 | A mudança declarada e rendida em «O que mudou» | a linha na página do país, nas duas edições |
| 5 | A questão I129 fechada em `ISSUES.md`, com os números medidos | lido no diff |
| 6 | Relatório curto em `design/especime-v3/medicoes/i129-2026-09-22/LEIA-ME.md`; os três portões a 0 na cabeça final, cada um no seu comando com o código lido de um ficheiro acabado de escrever (apaga os `.codigo` antes de correr) | os ficheiros `.codigo` ao lado do relatório |

## 3 · O que não se faz

Nenhum valor muda. O `document.title` fica como o Eurostat o escreve: o que se copia de uma fonte fica como a fonte o escreveu, e é a `note` e o excerto que dizem o resto. Não se toca em `indicators/availability.json` nem em nenhum outro ficheiro de outras corridas do motor. Não se confirma nem se muda nenhum nome oficial (o da PORDATA para `tipslm90` fica por decidir até o motor reler a linha corrigida). Nenhum `push`.

## 4 · As regras de sempre

No sítio, commits pequenos por caminhos explícitos com os dois trailers contíguos (`Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` e `Claude-Session: https://claude.ai/code/session_016dojDrtR3Thizhpckp9ENd`); no motor só o `Co-Authored-By`, e o pre-commit corre `python3 -m core.gate`. Prosa nova em português sem travessões. A regra de paragem: só um portão que proteja um número, uma fonte ou uma pessoa faz parar; se o brief contradisser o código ou os dados, para nesse ponto e di-lo com a medida.
