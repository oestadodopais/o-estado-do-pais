#!/bin/sh
# A direção corre com rede e conta; os ensaios locais usam --trocar e --conferir.
set -eu
W="${1:?uso: vercel-prebuilt.sh <worktree>}"
exec python3 "$(dirname "$0")/com-tranca.py" python3 "$(dirname "$0")/vercel-prebuilt.py" "$W"
