#!/bin/sh
# C2 (05.10.2026): o que corre sobre o dist/ da cabeça do código, depois dos três portões, numa só tomada da tranca
# (corre-se dentro de com-tranca.sh). Cada passo escreve o registo e o código num ficheiro desta pasta, e nenhum lê o
# código atrás de um «|».
# uso (da raiz do sítio): sh design/especime-v3/medicoes/c2-2026-10-05/apos-os-portoes.sh <exportação da base> <commit da base> <exportação da cabeça> <cabeça do código>
set -u
D=design/especime-v3/medicoes/c2-2026-10-05
BASE="$1"; CBASE="$2"; EXP="$3"; CAB="$4"
git rev-parse HEAD > "$D/apos-os-portoes.cabeca"
git status --short --untracked-files=no > "$D/apos-os-portoes.estado"
node tests/pais/pais.mjs --json "$D/plantas-pais.json" > "$D/plantas-pais.log" 2>&1; echo $? > "$D/plantas-pais.codigo"
# O executor das plantas da base (3a253f73), sobre esta mesma construção: a prova de que já rebentava na primeira prova,
# antes de qualquer planta, por não copiar o carimbo da construção. Corre de uma cópia temporária ao lado do de agora
# (os caminhos dele são relativos à pasta), que se apaga a seguir.
git show 3a253f73:tests/pais/pais.mjs > tests/pais/pais-da-base-c2.mjs
node tests/pais/pais-da-base-c2.mjs > "$D/plantas-pais-antes.log" 2>&1; echo $? > "$D/plantas-pais-antes.codigo"
rm -f tests/pais/pais-da-base-c2.mjs
node "$D/recibos-c2.mjs" dist > "$D/recibos-c2.log" 2>&1; echo $? > "$D/recibos-c2.codigo"
node "$D/captar-c2.mjs" depois dist "$CAB" > "$D/captar-depois.log" 2>&1; echo $? > "$D/captar-depois.codigo"
(cd "$EXP" && npx astro build) > "$D/build-exportacao-cabeca.log" 2>&1; echo $? > "$D/build-exportacao-cabeca.codigo"
node "$D/paginas-c2.mjs" "$BASE" "$CBASE" "$EXP/dist" "$CAB" > "$D/paginas-c2.log" 2>&1; echo $? > "$D/paginas-c2.codigo"
echo "plantas=$(cat $D/plantas-pais.codigo) plantas-da-base=$(cat $D/plantas-pais-antes.codigo) recibos=$(cat $D/recibos-c2.codigo) capturas=$(cat $D/captar-depois.codigo) exportacao=$(cat $D/build-exportacao-cabeca.codigo) paginas=$(cat $D/paginas-c2.codigo)"
