#!/bin/sh
# Lança o Codex como construtor numa worktree, com o modelo e o raciocínio fixados, e regista o fim.
# uso: construir-codex.sh <worktree> <prompt.md> <relatorio.md> [log]
# O diretor é quem o lança (o modo automático do Claude Code reserva-lhe o lançamento de um agente
# com aprovações automáticas): `nohup scripts/leituras/construir-codex.sh <worktree> <prompt> <relatorio> >> <log> 2>&1 &`
# A regra de paragem do construtor vai no prompt: só um portão que protege um número, uma fonte ou uma
# pessoa o faz parar; o que encoda mobília muda de forma conservando o que protege, com uma planta.
set -u
worktree="$1"; prompt="$2"; relatorio="$3"
# A WORKTREE PASSA-SE EM CAMINHO ABSOLUTO (M29, 23.09.2026): o guião entra nela com `cd` e volta a passá-la ao
# Codex em `-C`, por isso um caminho relativo era procurado dentro de si próprio e o Codex morria no mesmo segundo
# com «No such file or directory». Recusa-se antes de lançar, com a razão.
case "$worktree" in /*) ;; *) echo "a worktree passa-se em caminho absoluto (recebi «$worktree»)" >&2; exit 9;; esac
modelo="${CODEX_CONSTRUTOR:-gpt-6-astra}"
cd "$worktree" || exit 9
echo "INICIO $(date -u +%H:%M:%S) modelo=$modelo raciocínio=xhigh"
codex exec -m "$modelo" -c 'model_reasoning_effort="xhigh"' -C "$worktree" --approve-for-me --skip-git-repo-check --color never -o "$relatorio" - < "$prompt"
echo "FIM exit=$? $(date -u +%H:%M:%S)"
