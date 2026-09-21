# Brief · M4 · O estudo das penalizações por reforma antecipada entra no portão do motor

*Escrito pelo lugar de direção (Claude Fable 5.1) a 21.09.2026, a partir do relatório do bloco M2 (`content/14 Évora 2027/Technical Source/RELATORIO-portao-2026-09-21.md`, §7, no motor) e da I125. Um bloco pequeno do motor, numa worktree em `.worktrees/<ramo>`; o construtor é o Claude Opus. Sem travessões na prosa.*

## 0 · O teste de aceitação, dito antes

Feito quer dizer: `python3 -m core.gate` imprime linhas para o estudo 11 (`content/11 Seguranca Social/`) como imprime para os outros, passa, e morde com uma planta numa cópia; nenhum valor do estudo muda; o que o portão medir diferente de zero fica como dívida declarada com a razão, nunca como zero falso.

## 1 · O que o bloco M2 mediu a 21.09.2026 (a conferir antes de te apoiares nisto)

O estudo está publicado no sítio (`penalizacoes-por-reforma-antecipada-2026`, edição portuguesa, com página construída) e tem livro-razão no motor (55 linhas), mas não está em `core/gate_baselines.json`. Declará-lo hoje punha o portão em falha estrutural: `core.reconcile` e `core.attributions` saem a 2 nas duas edições com «claim value '…' contains no number», porque nove linhas têm texto no `value` e nenhuma declara `value_not_numeric` (`relatorio-titulo`, `governo-posicao`, `defice-transicao-nao-quantificado`, `ch6-taxa-contributiva-nao-fixada`, `fs-penalizacao-seletiva`, `fs-dupla-contagem`, `fs-heterogeneidade-longevidade`, `ch12-sem-base-administrativa`, `governo-xxiv-xxv`). Medido também: `core.assertions` sai a 1 com 11 asserções não declaradas na edição HTML e 9 no relatório, e `core.prose` sai a 1 com 1 e 7 adjacências; essas são dívida declarável.

## 2 · O mandato

1. Ler como os outros estudos declaram uma linha cujo valor é texto (`value_not_numeric` ou o que o motor usar; abre um exemplo no 08 ou no 09) e acertar as nove linhas do 11 pelo caminho de construção do próprio estudo, sem mudar o texto de nenhum valor. Se o caminho de construção precisar de fontes que não estão em árvore nenhuma, dizê-lo e parar nessa parte.
2. Medir as duas edições com `core.reconcile`, `core.attributions`, `core.assertions` e `core.prose`, e os pares com `core.editions`; cada contagem diferente de zero com a sua razão.
3. Declarar o 11 em `core/gate_baselines.json` com a linha de base medida; a dívida de registo prévio sobe um estudo e não se escreve registo nenhum depois da recolha.
4. A planta numa cópia fora do índice: um algarismo trocado num valor com linha faz o portão falhar; repostos os bytes, passa.
5. Um teste no portão que FALHA quando existe em `content/*/` um `ledger.json` que nenhum entregável de `gate_baselines.json` declara, com uma lista de exceções escrita e com razão (a pasta 10 tem vários livros; confere como estão declarados). É o que impede o próximo estudo de ficar de fora por esquecimento. Com uma planta.
6. O relatório ao lado do estudo, curto, em português, com as medidas.

## 3 · As regras de sempre

As do brief M2: a worktree em `.worktrees/<ramo>` com as três caches `snippets.json` copiadas da árvore principal; commits pequenos por caminhos explícitos com o trailer `Co-Authored-By`; o pre-commit corre o portão; nenhum valor muda sem correção registada; nenhum `push`; o nome não é o conteúdo; uma busca vazia não prova ausência.
