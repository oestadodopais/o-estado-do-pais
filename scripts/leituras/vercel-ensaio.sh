#!/bin/sh
# Produção preparada com a ligação do sítio e o dist conferido; não promove.
set -eu
W="${1:?uso: vercel-ensaio.sh <worktree>}"
exec python3 "$(dirname "$0")/com-tranca.py" python3 "$(dirname "$0")/vercel-prebuilt.py" "$W" --ensaio
