#!/bin/sh
# As conferências que o bloco TP1 toca, corridas na cabeça do código, com o código de cada uma em ficheiro (M50:
# cada registo diz a cabeça em que correu e a árvore limpa). uso: sh conferir-tp1.sh <worktree> <pasta de saída>
set -u
W="$1"; OUT="$2"
mkdir -p "$OUT"
cd "$W" || exit 9
cabeca=$(git rev-parse HEAD)
sujas=$(git status --porcelain --untracked-files=no)
arvore=$(printf '%s' "$sujas" | grep -c . || true)
construida=$(python3 -c "import json;print(json.load(open('dist/version.json'))['commit'])" 2>/dev/null || echo "")
printf '{"cabeca": "%s", "construida": "%s", "entradas_por_registar": %s, "corrido_em": "%s"}\n' "$cabeca" "$construida" "$arvore" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$OUT/cabeca.json"
# A ÁRVORE TEM DE ESTAR LIMPA E A CONSTRUÇÃO TEM DE SER DA CABEÇA (M50; a terceira leitura do TP1, o achado 1): um
# registo feito sobre uma árvore suja não prova que as conferências correram sobre o código registado. Recusa-se.
if [ "$arvore" != "0" ]; then printf 'árvore suja (%s entradas); as conferências não correm:\n%s\n' "$arvore" "$sujas" | tee "$OUT/recusa.txt"; exit 2; fi
if [ "$construida" != "$cabeca" ]; then printf 'a construção em dist/ é de %s e a cabeça é %s; as conferências não correm\n' "$construida" "$cabeca" | tee "$OUT/recusa.txt"; exit 3; fi
for c in ledger:check gate:html check:voz check:lugar check:lingua check:palavras check:rotulos check:mortos check:privacidade check:indice-do-sitio check:nomes check:formato check:navegacao sinais; do
  n=$(echo "$c" | tr ':' '-')
  npm run "$c" > "$OUT/$n.log" 2>&1
  echo $? > "$OUT/$n.codigo"
  printf '%s %s\n' "$c" "$(cat "$OUT/$n.codigo")"
done
python3 scripts/leituras/limpar-caminhos.py "$OUT" --worktree "$W" >> "$OUT/limpar.log" 2>&1
echo "limpar-caminhos $?"
