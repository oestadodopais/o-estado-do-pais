#!/bin/sh
# Aterragem pela regra 7, com cada recusa e código no recibo.
# AT1: o modo preparado é escolhido pelo main desativado no vercel.json.
# Uso: aterrar.sh <worktree absoluta> <pasta de saída nova, fora das árvores>
exec python3 "$(dirname "$0")/aterrar.py" "$@"
