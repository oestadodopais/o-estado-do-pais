#!/bin/sh
# R4-b: as conferências que a passagem toca, cada uma no seu comando, com o código escrito num ficheiro depois de o
# processo acabar, e a cabeça e o estado da árvore seguida antes de cada uma (M50). Corre-se da raiz da worktree, com a
# construção da cabeça em dist/. Os registos ficam sem os caminhos da máquina (limpar-caminhos.py, no fim).
set -u
P=design/especime-v3/medicoes/r4-2026-10-05/r4b/conferencias
mkdir -p "$P"
corre() {
  nome="$1"; shift
  git rev-parse HEAD > "$P/$nome.cabeca"
  git status --porcelain --untracked-files=no > "$P/$nome.estado"
  date -u +%Y-%m-%dT%H:%M:%SZ > "$P/$nome.inicio"
  "$@" > "$P/$nome.log" 2>&1
  echo $? > "$P/$nome.codigo"
  date -u +%Y-%m-%dT%H:%M:%SZ > "$P/$nome.fim"
}
corre check-cartao node tests/cartao/cartao.mjs --prova
corre check-primeira node tests/inicio/primeira-pagina.mjs --prova
corre check-pais npm run check:pais
corre check-lugar npm run check:lugar
corre check-series node tests/series/series.mjs --prova
corre typecheck npm run typecheck
for f in "$P"/*.codigo; do echo "$(basename "$f" .codigo) $(cat "$f")"; done
