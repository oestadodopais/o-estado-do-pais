#!/bin/sh
# As cinco réguas que só se correm à mão (o item 1 do brief P4), sobre o `dist/` da worktree, uma de cada vez, cada uma
# com o registo e o código em ficheiro, escrito depois de o processo acabar. Nenhuma está num portão; correm-se assim:
#   sh design/especime-v3/medicoes/p4-2026-10-02/reguas-a-mao.sh <pasta de saída>
# a partir da raiz da worktree, com uma construção da cabeça em `dist/` (confira-se `dist/version.json` antes).
# Os registos trocam o caminho da worktree por «<worktree>», para não levarem caminhos da máquina.
set -u
O="$1"
mkdir -p "$O"
W="$(pwd)"
for r in correcoes-a lista mapa-distritos mapa-unidades matriz; do
  inicio=$(date +%s)
  node "tests/inicio/$r.mjs" > "$O/$r.log.cru" 2>&1
  echo $? > "$O/$r.codigo"
  fim=$(date +%s)
  echo $((fim - inicio)) > "$O/$r.segundos"
  sed "s#$W#<worktree>#g; s#$HOME#<casa>#g" "$O/$r.log.cru" > "$O/$r.log"
  rm -f "$O/$r.log.cru"
  echo "$r $(cat "$O/$r.codigo") $(cat "$O/$r.segundos")s"
done
