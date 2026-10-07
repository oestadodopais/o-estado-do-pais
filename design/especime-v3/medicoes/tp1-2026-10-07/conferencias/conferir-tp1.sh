#!/bin/sh
# As conferências que o bloco TP1 toca, corridas na cabeça do código, com o código de cada uma em ficheiro (M50:
# cada registo diz a cabeça em que correu e a árvore limpa). uso: sh conferir-tp1.sh <worktree> <pasta de saída>
set -u
W="$1"; OUT="$2"
mkdir -p "$OUT"
cd "$W" || exit 9
cabeca=$(git rev-parse HEAD)
arvore=$(git status --porcelain --untracked-files=no | wc -l | tr -d ' ')
printf '{"cabeca": "%s", "entradas_por_registar": %s, "corrido_em": "%s"}\n' "$cabeca" "$arvore" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$OUT/cabeca.json"
for c in ledger:check gate:html check:voz check:lugar check:lingua check:palavras check:rotulos check:mortos check:privacidade check:indice-do-sitio check:nomes check:formato check:navegacao sinais; do
  n=$(echo "$c" | tr ':' '-')
  npm run "$c" > "$OUT/$n.log" 2>&1
  echo $? > "$OUT/$n.codigo"
  printf '%s %s\n' "$c" "$(cat "$OUT/$n.codigo")"
done
python3 scripts/leituras/limpar-caminhos.py "$OUT" --worktree "$W" >> "$OUT/limpar.log" 2>&1
echo "limpar-caminhos $?"
