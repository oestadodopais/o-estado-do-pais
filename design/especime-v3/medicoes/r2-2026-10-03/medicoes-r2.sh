#!/bin/sh
# R2 (03.10.2026): as medições do bloco sobre a construção da cabeça em dist/ e sobre a da cabeça de partida (d9b168b9),
# feita numa cópia de `git archive` fora da árvore. Corre-se da raiz da worktree, com a tranca da máquina (com-tranca.sh),
# e cada passo escreve o seu registo e o seu código nesta pasta, lido de ficheiro e nunca atrás de um «|».
# uso: sh design/especime-v3/medicoes/r2-2026-10-03/medicoes-r2.sh <pasta da construção de partida>
set -u
P=design/especime-v3/medicoes/r2-2026-10-03
BASE="$1"
passo() { nome="$1"; shift; "$@" > "$P/$nome.log" 2>&1; echo $? > "$P/$nome.codigo"; echo "$nome: $(cat "$P/$nome.codigo")"; }
passo plantas-portoes-r2 env OEDP_MEDICOES=$P node tests/pais/portoes.mjs --prefixo r2-
passo plantas-portoes-k2c env OEDP_MEDICOES=$P node tests/pais/portoes.mjs --prefixo k2c-
passo plantas-portoes-p4 env OEDP_MEDICOES=$P node tests/pais/portoes.mjs --prefixo p4
passo check-navegacao node tests/inicio/navegacao.mjs --prova --json $P/check-navegacao.json
passo indice-de-divida node tests/municipio/indice-de-divida.mjs --prova --json $P/indice-de-divida.json
passo check-rotulos node scripts/inventario-rotulos.mjs --prova --json $P/check-rotulos.json
passo check-cartao node tests/cartao/cartao.mjs --prova
passo check-lingua node scripts/check-lingua.mjs
passo depois-inventario node scripts/inventario-rotulos.mjs --inventario $P/depois-inventario-r2.json
passo antes-inventario env OEDP_DIST="$BASE/dist" node scripts/inventario-rotulos.mjs --inventario $P/antes-inventario-r2.json
( cd "$BASE" && AMOSTRA=100000 node scripts/check-lugar.mjs ) > $P/l1-antes-check-lugar.txt 2>&1; echo $? > $P/l1-antes-check-lugar.codigo; echo "l1-antes: $(cat $P/l1-antes-check-lugar.codigo)"
passo l1-r2 node $P/l1-r2.mjs
passo antes-depois-r2 node $P/antes-depois-r2.mjs
passo captar-r2 node $P/captar-r2.mjs
echo FIM-MEDICOES
