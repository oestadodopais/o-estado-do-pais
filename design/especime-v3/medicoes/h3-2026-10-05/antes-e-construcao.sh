#!/bin/sh
# H3: numa só tomada da tranca, as capturas de antes sobre a construção de base que está em dist/ (a cabeça do brief)
# e, a seguir, a construção da árvore de trabalho com as mudanças do bloco. Cada código escreve-se no seu ficheiro
# depois de o processo acabar, e a cabeça e o estado da árvore de cada passo ficam ao lado (a M50).
# uso, da raiz da worktree: sh design/especime-v3/medicoes/h3-2026-10-05/antes-e-construcao.sh <rótulo da construção>
set -u
P=design/especime-v3/medicoes/h3-2026-10-05
R="$1"
git rev-parse HEAD > "$P/captar-antes.log.cabeca"
git status --porcelain --untracked-files=no > "$P/captar-antes.log.estado"
node "$P/captar-h3.mjs" antes > "$P/captar-antes.log" 2>&1
echo $? > "$P/captar-antes.codigo"
git rev-parse HEAD > "$P/construcao-$R.log.cabeca"
git status --porcelain --untracked-files=no > "$P/construcao-$R.log.estado"
inicio=$(date +%s)
npm run build > "$P/construcao-$R.log" 2>&1
echo $? > "$P/construcao-$R.codigo"
fim=$(date +%s)
echo "$((fim - inicio))" > "$P/construcao-$R.segundos"
echo "captar-antes=$(cat "$P/captar-antes.codigo") construcao-$R=$(cat "$P/construcao-$R.codigo")"
