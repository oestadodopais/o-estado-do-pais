#!/bin/sh
# Aterragem pela regra 7, com cada recusa e código no recibo.
# Uso: aterrar.sh <worktree absoluta> <pasta de saída nova, fora das árvores>
exec python3 "$(dirname "$0")/aterrar.py" "$@"
