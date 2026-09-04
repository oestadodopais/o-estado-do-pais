#!/bin/sh
# uso: ler.sh <pacote> <prompt.md> <saida.md>   (Codex gpt-5.6-sol, xhigh, só leitura, efémero)
set -u
pacote="$1"; prompt="$2"; saida="$3"
start=$(date -u +%H:%M:%S)
codex exec -C "$pacote" -s read-only --skip-git-repo-check --ephemeral --color never -o "$saida" - < "$prompt" > "$saida.eventos.log" 2>&1
code=$?
end=$(date -u +%H:%M:%S)
echo "codex exit=$code · $start a $end UTC · saída em $saida"
