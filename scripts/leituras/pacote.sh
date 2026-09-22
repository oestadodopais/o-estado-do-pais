#!/bin/sh
# Monta o pacote de uma leitura a frio de um bloco (decisão do lugar de direção, 07.09.2026: o pacote montado por um guião).
# uso: pacote.sh <repositório> <base> <cabeça> <pacote> <brief.md> <relatório.md> [<caminho em dist/>...]
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

mkdir -p "$pacote"
mv "$numeros_tmp" "$pacote/numeros-do-relatorio.txt"
cp "$brief" "$pacote/brief.md"
cp "$relatorio" "$pacote/relatorio-construtor.md"
rel_relatorio=$(cd "$repo" && git ls-files --full-name "$relatorio" 2>/dev/null || true)
git -C "$repo" diff "$base..$cabeca" -- . ':(exclude)*.png' ':(exclude)*.jpg' ':(exclude)*.webp' ${rel_relatorio:+":(exclude)$rel_relatorio"} > "$pacote/diff.patch"
# Os caminhos leem-se linha a linha, porque há caminhos com espaços («content/12 Concelhos/…»).
lista="$pacote/.mudados"
git -C "$repo" diff --name-only "$base..$cabeca" | grep -v -E '\.(png|jpg|webp)$' > "$lista"
n=0
while IFS= read -r f; do
  [ -z "$f" ] && continue
  [ "$f" = "$rel_relatorio" ] && continue
  if git -C "$repo" cat-file -e "$cabeca:$f" 2>/dev/null; then
    mkdir -p "$pacote/$(dirname "$f")"
    git -C "$repo" show "$cabeca:$f" > "$pacote/$f"
    n=$((n+1))
  fi
done < "$lista"
rm -f "$lista"
b=0
for p in "$@"; do
  mkdir -p "$pacote/built/$(dirname "$p")"
  cp "$repo/dist/$p" "$pacote/built/$p"
  b=$((b+1))
done

echo "pacote em $pacote: diff $(wc -l < "$pacote/diff.patch" | tr -d ' ') linhas, $n ficheiros mudados copiados da cabeça $cabeca, $b páginas construídas, números do relatório conferidos (código $codigo, em numeros-do-relatorio.txt)"
