#!/bin/sh
# C2-b (05.10.2026): a construção da cabeça do código da passagem e as conferências sobre ela, numa só tomada da tranca
# (corre-se dentro de com-tranca.sh). O build reconstrói o dist/ com o published_at das nove (as capturas e os recibos
# leem-no); os três portões inteiros são do lugar de direção, na cabeça rebaseada.
# uso (da raiz do sítio): sh design/especime-v3/medicoes/c2-2026-10-05/passagem-c2b.sh <dist da base> <commit da base> <exportação da cabeça> <cabeça do código>
set -u
D=design/especime-v3/medicoes/c2-2026-10-05
git rev-parse HEAD > "$D/build-c2b.cabeca"
npm run build > "$D/build-c2b.log" 2>&1; echo $? > "$D/build-c2b.codigo"
echo "build=$(cat $D/build-c2b.codigo)"
[ "$(cat $D/build-c2b.codigo)" = "0" ] || exit 1
sh "$D/apos-os-portoes.sh" "$1" "$2" "$3" "$4"
