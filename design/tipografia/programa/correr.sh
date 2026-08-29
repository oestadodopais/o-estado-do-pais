#!/bin/bash
# AS CONSTRUÇÕES DO ESTUDO, E A RÉGUA A CADA UMA (segunda ronda).
#
# A §4 do brief pede «uma construção por combinação (prosa × instrumento) que
# faça sentido: pelo menos as quatro famílias de prosa com a Bitter, e a Bitter
# contra a sem serifa com a Spectral». São estas, agora seis:
#
#   1. spectral+bitter        o controlo, que é o sítio de hoje
#   2. newsreader+bitter      \
#   3. sourceserif4+bitter     >  as cinco prosas contra o mesmo instrumento
#   4. literata+bitter        /
#   5. ledger+bitter          acrescentada pelo lugar de direção depois da adenda 2
#   6. spectral+publicsans    o instrumento contra a mesma prosa
#
# Com o instrumento fixo, a diferença entre 1 e 5 é só a prosa; com a prosa
# fixa, a diferença entre 1 e 6 é só o instrumento. Trinta combinações davam
# trinta construções e nenhuma comparação nova: quem quiser a Literata com a
# Public Sans lê as duas colunas.
#
# A ORDEM DOS PASSOS É A DA ADENDA 2. As provas primeiro, e param tudo se algum
# detetor não vir o seu vermelho; a régua a cada construção; as aberturas por
# família; a agregação; a ordem ponderada; as pranchas.
set -e
cd "$(dirname "$0")/../../.."

echo "===== as provas dos detetores ====="
node design/tipografia/programa/provas.mjs

for c in spectral+bitter newsreader+bitter sourceserif4+bitter literata+bitter ledger+bitter spectral+publicsans; do
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

echo "===== as aberturas, por família ====="
node design/tipografia/programa/aberturas.mjs

echo "===== a agregação e a tabela ====="
node design/tipografia/programa/agregar.mjs

echo "===== a ordem ponderada ====="
node design/tipografia/programa/ordem.mjs

echo "===== as pranchas ====="
node design/tipografia/programa/pranchas.mjs

date +%H:%M:%S
echo "TODAS FEITAS"
