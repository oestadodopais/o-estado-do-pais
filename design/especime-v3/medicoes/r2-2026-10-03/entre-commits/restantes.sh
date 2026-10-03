#!/bin/sh
# R2 (04.10.2026): as conferências do `verify` que vêm depois do `check:cartao` (onde a corrida de 6897e365 fechou),
# cada uma no seu comando, com o código escrito num ficheiro desta pasta; corre-se da raiz da worktree, com a tranca.
set -u
E=design/especime-v3/medicoes/r2-2026-10-03/entre-commits
for s in check:cartao check:rotulos check:navegacao check:primeira sinais check:nomes check:palavras design:feixe check:privacidade; do
  n=$(echo "$s" | tr ':' '-')
  npm run "$s" > "$E/$n.log" 2>&1
  echo $? > "$E/$n.codigo"
  echo "$s: $(cat "$E/$n.codigo")"
done
echo FIM-RESTANTES
