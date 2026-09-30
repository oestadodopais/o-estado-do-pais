#!/bin/sh
# Retoma uma sessão do Codex construtor na sua worktree, com o modelo e o raciocínio fixados (M35: uma sessão
# parada retoma-se pelo seu id; o C1 retomou-se seis vezes, o F2.2b quatro).
# uso: retomar-codex.sh <worktree> <sessão> <prompt.md> <resposta fora do ramo> [<outra pasta com escrita>...]
# As outras pastas entram em `--add-dir`, pela razão dita em construir-codex.sh (M43).
set -u
worktree="$1"; sessao="$2"; prompt="$3"; resposta="$4"; shift 4
case "$worktree" in /*) ;; *) echo "a worktree passa-se em caminho absoluto (recebi: ${worktree})" >&2; exit 9;; esac
extras=""
for pasta in "$@"; do
  case "$pasta" in /*) ;; *) echo "as outras pastas passam-se em caminho absoluto (recebi: ${pasta})" >&2; exit 9;; esac
  extras="$extras --add-dir $pasta"
done
modelo="${CODEX_CONSTRUTOR:-gpt-6-astra}"
cd "$worktree" || exit 9
echo "INICIO $(date -u +%H:%M:%S) retoma sessão=$sessao modelo=$modelo raciocínio=xhigh"
# shellcheck disable=SC2086
codex exec -m "$modelo" -c 'model_reasoning_effort="xhigh"' -C "$worktree" $extras --approve-for-me --skip-git-repo-check --color never -o "$resposta" resume "$sessao" - < "$prompt"
echo "FIM exit=$? $(date -u +%H:%M:%S)"
