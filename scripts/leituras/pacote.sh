#!/bin/sh
# Monta o pacote de uma leitura a frio de um bloco (decisão do lugar de direção, 07.09.2026: o pacote montado por um guião).
# uso: pacote.sh <repositório> <base> <cabeça> <pacote> <brief.md> <relatório.md> [<caminho em dist/>...]
#   PACOTE_EXTRA="<caminho> <caminho>" copia também esses caminhos do repositório tal como estão na cabeça
#   (ficheiros ou pastas), para o que o diff não traz: as páginas congeladas de um brief entram com o brief,
#   antes do intervalo do diff, e a leitura do R1 a 23.09.2026 ficou sem elas (M25, a segunda metade).
#   PACOTE_RETIRA="<padrão> <padrão>" retira só secções do diff; os ficheiros ficam inteiros.
#   PACOTE_MOTOR="<árvore> <base> <cabeça> [<padrão>...]" junta os ficheiros e o diff do motor.
#   Padrões glob de caminhos relativos; aspas interiores protegem caminhos com espaços.
#   <pacote>/brief.md, relatorio-construtor.md, diff.patch (base..cabeça, sem binários e sem o relatório),
#   os ficheiros mudados nos seus caminhos tal como estão na cabeça, built/<caminho> copiado de
#   <repositório>/dist/, e numeros-do-relatorio.txt com a saída do conferir-relatorio.py sobre o relatório.
#   O «antes/» copia-se à mão quando a leitura compara. As plantas plantam-se depois, com plantar.py.
set -eu
repo="$1"; base="$2"; cabeca="$3"; pacote="$4"; brief="$5"; relatorio="$6"; shift 6

# OS NÚMEROS DO RELATÓRIO CONFEREM-SE ANTES DE SE COPIAR SEJA O QUE FOR (M5,
# 22.09.2026, com a correção da leitura a frio desse dia). O leitor a frio fica a
# saber à partida que números do relatório foram medidos e quais não estão em
# ficheiro nenhum, sem ter de descobrir um a um. A saída é dita, nunca engolida:
# o código 1 é «há números sem ficheiro» e entra no pacote; o 2 é «o guião não
# correu, ou o seu conhecido-positivo falhou», e nesse caso o pacote NÃO SE CRIA,
# porque um zero de um detetor calado enganaria o leitor. A primeira redação
# desta parte corria no fim, depois de o pacote já estar montado, e por isso um
# código 2 deixava um pacote meio feito com a promessa por cumprir.
guiao="$(dirname "$0")/conferir-relatorio.py"
numeros_tmp="$(mktemp)"
codigo=0
python3 "$guiao" "$relatorio" "$(dirname "$relatorio")" > "$numeros_tmp" 2>&1 || codigo=$?
echo "código de saída do conferir-relatorio.py: $codigo" >> "$numeros_tmp"
if [ "$codigo" -ge 2 ]; then
  cat "$numeros_tmp"
  rm -f "$numeros_tmp"
  echo "pacote.sh: o conferir-relatorio.py não correu, ou o seu conhecido-positivo falhou (código $codigo). O pacote não se cria." >&2
  exit 1
fi

# O Python lê os caminhos com NUL e os padrões com shlex, sem expansão pela shell.
python3 "$(dirname "$0")/pacote.py" "$repo" "$base" "$cabeca" "$pacote" "$brief" "$relatorio" "$numeros_tmp" "$@"
rm -f "$numeros_tmp"
