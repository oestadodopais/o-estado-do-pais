#!/bin/sh
# Lança o Codex como construtor numa worktree, com o modelo e o raciocínio fixados, e regista o fim.
# uso: [CODEX_RACIOCINIO=high] construir-codex.sh <worktree> <prompt.md> <relatorio.md> [<outra pasta com escrita>...]
# O lugar de direção lança-o desde 23.09.2026 (§1.128), e o diretor pode continuar a lançá-lo:
# `nohup scripts/leituras/construir-codex.sh <worktree> <prompt> <relatorio> [<outra worktree>] >> <log> 2>&1 &`
# A regra de paragem do construtor vai no prompt: só um portão que protege um número, uma fonte ou uma
# pessoa o faz parar; o que encoda mobília muda de forma conservando o que protege, com uma planta.
#
# AS OUTRAS PASTAS COM ESCRITA (M43, 30.09.2026). O `--approve-for-me` manda cada pedido de aprovação a um
# modelo revisor automático («codex-auto-review»), que lê o repositório de cada vez e gasta a mesma quota
# semanal: na noite de 29 para 30.09 foram 7 sessões desse revisor e 29 % dos símbolos cobrados. Um
# construtor que escreve em duas worktrees (o motor e o sítio) pedia aprovação a cada escrita fora da sua
# pasta de arranque. Cada pasta passada depois do relatório entra em `--add-dir`, com escrita, e a
# aprovação deixa de ser pedida: provado a 30.09 com uma escrita numa pasta de fora, que sem `--add-dir`
# abriu uma sessão do revisor e com ele não abriu nenhuma. O `--approve-for-me` fica para o resto.
set -u
worktree="$1"; prompt="$2"; relatorio="$3"; shift 3
# A WORKTREE PASSA-SE EM CAMINHO ABSOLUTO (M29, 23.09.2026): o guião entra nela com `cd` e volta a passá-la ao
# Codex em `-C`, por isso um caminho relativo era procurado dentro de si próprio e o Codex morria no mesmo segundo
# com «No such file or directory». Recusa-se antes de lançar, com a razão.
case "$worktree" in /*) ;; *) echo "a worktree passa-se em caminho absoluto (recebi: ${worktree})" >&2; exit 9;; esac
extras=""
for pasta in "$@"; do
  case "$pasta" in /*) ;; *) echo "as outras pastas passam-se em caminho absoluto (recebi: ${pasta})" >&2; exit 9;; esac
  extras="$extras --add-dir $pasta"
done
# O MODELO É O MAIS RECENTE QUE A CONTA ACEITA (decisão do diretor de 30.09.2026, §1.142): muda-se aqui, de
# propósito e registado, depois de `sondar-modelo.sh` dizer que a conta o aceita. A 30.09 a conta recusou o
# `gpt-6.1-sol` («not supported when using Codex with a ChatGPT account»), e o construtor fica no `gpt-6-astra`.
modelo="${CODEX_CONSTRUTOR:-gpt-6-astra}"
# O RACIOCÍNIO VAI POR VARIÁVEL (§1.177, M57, 06.10.2026): `high` nas construções e nas passagens mecânicas,
# `xhigh` só onde o lugar de direção o pedir; por omissão fica xhigh, como até aqui, para uma troca ser sempre
# deliberada: `CODEX_RACIOCINIO=high construir-codex.sh …`. O guião imprime o nível na linha INICIO, que é o que
# o registo do bloco cita.
raciocinio="${CODEX_RACIOCINIO:-xhigh}"
case "$raciocinio" in low|medium|high|xhigh) ;; *) echo "CODEX_RACIOCINIO tem de ser low, medium, high ou xhigh (recebi: ${raciocinio})" >&2; exit 9;; esac
cd "$worktree" || exit 9
echo "INICIO $(date -u +%H:%M:%S) modelo=$modelo raciocínio=$raciocinio pastas_com_escrita=[$worktree$(for p in "$@"; do printf ' %s' "$p"; done)]"
# shellcheck disable=SC2086
codex exec -m "$modelo" -c "model_reasoning_effort=\"$raciocinio\"" -C "$worktree" $extras --approve-for-me --skip-git-repo-check --color never -o "$relatorio" - < "$prompt"
echo "FIM exit=$? $(date -u +%H:%M:%S)"
