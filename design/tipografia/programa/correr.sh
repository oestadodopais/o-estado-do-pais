#!/bin/bash
# AS CINCO CONSTRUÇÕES DO ESTUDO, E A RÉGUA A CADA UMA.
#
# Cinco e não vinte. A §4 do brief pede «uma construção por combinação (prosa ×
# instrumento) que faça sentido: pelo menos as quatro famílias de prosa com a
# Bitter, e a Bitter contra a sem serifa com a Spectral». São exatamente estas:
#
#   1. spectral+bitter        o controlo, que é o sítio de hoje
#   2. newsreader+bitter      \
#   3. sourceserif4+bitter     >  as quatro prosas contra o mesmo instrumento
#   4. literata+bitter        /
#   5. spectral+publicsans    o instrumento contra a mesma prosa
#
# Com o instrumento fixo, a diferença entre 1 e 4 é só a prosa; com a prosa
# fixa, a diferença entre 1 e 5 é só o instrumento. Vinte e cinco combinações
# davam vinte e cinco construções e nenhuma comparação nova: quem quiser a
# Literata com a Public Sans lê as duas colunas.
set -e
cd "$(dirname "$0")/../../.."
for c in spectral+bitter newsreader+bitter sourceserif4+bitter literata+bitter spectral+publicsans; do
  echo "===== $c ====="
  date +%H:%M:%S
  if [ "$c" = "spectral+bitter" ]; then
    npx astro build >/dev/null 2>&1
  else
    TIPOS_ESTUDO="$c" npx astro build >/dev/null 2>&1
  fi
  echo "  construção feita"
  node design/tipografia/programa/regua.mjs "$c"
done
date +%H:%M:%S
echo "TODAS FEITAS"
