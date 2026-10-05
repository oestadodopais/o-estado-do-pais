#!/bin/sh
# RP4-c-b (a passagem do peso): a construção da cabeça e as conferências que a mudança toca, cada uma no seu comando e
# com o código escrito num ficheiro depois de o processo acabar (nunca lido atrás de um «|»). Os três portões inteiros
# corre-os o lugar de direção depois de fundir o `main`. Corre-se na raiz do sítio, pela tranca da máquina:
#
#   sh design/especime-v3/medicoes/rp4c-2026-10-05/com-tranca.sh "$PWD" <registo> <código> \
#     sh design/especime-v3/medicoes/rp4c-2026-10-05/conferencias-rp4cb.sh
#
# Escreve em `rp4cb/conferencias/`, nesta pasta: a cabeça, o estado dos ficheiros seguidos (vazio quer dizer a árvore
# seguida limpa) e, por passo, um `.log`, um `.codigo`, um `.inicio` e um `.fim`. Uma construção que falhe para a corrida.
set -u
O=design/especime-v3/medicoes/rp4c-2026-10-05/rp4cb/conferencias
mkdir -p "$O"
git rev-parse HEAD > "$O/cabeca"
git status --porcelain --untracked-files=no > "$O/estado"
passo() {
  nome="$1"; shift
  date -u +%Y-%m-%dT%H:%M:%SZ > "$O/$nome.inicio"
  "$@" > "$O/$nome.log" 2>&1
  echo $? > "$O/$nome.codigo"
  date -u +%Y-%m-%dT%H:%M:%SZ > "$O/$nome.fim"
  echo "$nome $(cat "$O/$nome.codigo")"
}
passo astro-build ./node_modules/.bin/astro build
[ "$(cat "$O/astro-build.codigo")" -eq 0 ] || exit 1
passo stamp-version npm run stamp:version
passo cartoes npm run cartoes
passo gate-html npm run gate:html
passo check-formas npm run check:formas
passo check-formato npm run check:formato
passo check-series npm run check:series
passo check-primeira npm run check:primeira
passo check-cartao npm run check:cartao
passo typecheck npm run typecheck
git rev-parse HEAD > "$O/cabeca.fim"
git status --porcelain --untracked-files=no > "$O/estado.fim"
