#!/bin/sh
# Conferências escolhidas, uma de cada vez, sobre o `dist/` da worktree, cada uma com o registo e o código em ficheiro,
# escrito depois de o processo acabar. Entre commits do bloco P4 correm só as que a mudança toca (§1.112).
# uso: conferencias.sh <pasta de saída> <nome=comando> ...
set -u
O="$1"; shift
mkdir -p "$O"
W="$(pwd)"
for par in "$@"; do
  nome="${par%%=*}"; comando="${par#*=}"
  inicio=$(date +%s)
  sh -c "$comando" > "$O/$nome.log.cru" 2>&1
  echo $? > "$O/$nome.codigo"
  fim=$(date +%s)
  echo $((fim - inicio)) > "$O/$nome.segundos"
  sed "s#$W#<worktree>#g; s#$HOME#<casa>#g" "$O/$nome.log.cru" > "$O/$nome.log"
  rm -f "$O/$nome.log.cru"
  echo "$nome $(cat "$O/$nome.codigo") $(cat "$O/$nome.segundos")s"
done
