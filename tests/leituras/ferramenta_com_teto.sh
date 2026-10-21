#!/bin/sh
# Ensaio de com-teto.sh: um comando dentro do teto devolve o seu código e recebe a entrada; um comando
# que passa do teto é interrompido e devolve 124 em poucos segundos.
set -u
aqui="$(cd "$(dirname "$0")" && pwd -P)"
ferramenta="$aqui/../../scripts/leituras/com-teto.sh"
falhas=0
# 1. Dentro do teto: a entrada chega inteira e o código é o do comando.
saida=$(printf 'abc\n' | sh "$ferramenta" 30 sh -c 'read l; [ "$l" = abc ] && exit 7; exit 1'); codigo=$?
[ "$codigo" -eq 7 ] || { echo "1 falhou: esperava 7, veio $codigo"; falhas=$((falhas+1)); }
# 2. Acima do teto: 124 em menos de trinta segundos.
inicio=$(date +%s)
printf '' | sh "$ferramenta" 2 sh -c 'sleep 60'; codigo=$?
dur=$(( $(date +%s) - inicio ))
[ "$codigo" -eq 124 ] || { echo "2 falhou: esperava 124, veio $codigo"; falhas=$((falhas+1)); }
[ "$dur" -lt 30 ] || { echo "2 falhou: demorou ${dur} s"; falhas=$((falhas+1)); }
# 3. Um teto que não é número recusa a 9.
printf '' | sh "$ferramenta" x true 2>/dev/null; codigo=$?
[ "$codigo" -eq 9 ] || { echo "3 falhou: esperava 9, veio $codigo"; falhas=$((falhas+1)); }
[ "$falhas" -eq 0 ] && echo "com-teto: 3 ensaios verdes" || echo "com-teto: $falhas ensaio(s) vermelho(s)"
exit "$falhas"
