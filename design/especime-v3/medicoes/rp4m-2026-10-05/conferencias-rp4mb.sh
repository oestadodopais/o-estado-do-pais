#!/bin/sh
# RP4-m-b: a construção da cabeça do código e as conferências que a mudança da frase da conta toca, cada uma no seu
# comando e com o código escrito num ficheiro depois de o processo acabar (nunca lido atrás de um «|»), e as capturas
# do recibo do salário real. Não são os três portões inteiros, que o lugar de direção corre na cabeça final pela tranca:
# é o astro build, o carimbo, os cartões, o portão de HTML e as conferências que leem as páginas que a frase muda.
# Corre-se na raiz do sítio, com a tranca da máquina, pelo ajudante desta pasta:
#
#   RESEARCHHUB_DIR=<worktree do motor> sh design/especime-v3/medicoes/rp4m-2026-10-05/com-tranca.sh "$PWD" <registo> \
#     <código> sh design/especime-v3/medicoes/rp4m-2026-10-05/conferencias-rp4mb.sh
#
# Escreve em `rp4mb-conferencias/`, nesta pasta: a cabeça, o estado dos ficheiros seguidos fora desta pasta (vazio quer
# dizer o código todo junto antes da construção), e por passo um `.log`, um `.codigo`, um `.inicio` e um `.fim`. Uma
# construção que falhe para a corrida, porque nenhuma conferência sobre ela diria nada desta cabeça.
set -u
O=design/especime-v3/medicoes/rp4m-2026-10-05/rp4mb-conferencias
mkdir -p "$O"
git rev-parse HEAD > "$O/cabeca"
git status --porcelain --untracked-files=no -- . ':!design/especime-v3/medicoes/rp4m-2026-10-05' > "$O/estado"
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
passo check-voz npm run check:voz
passo check-lingua npm run check:lingua
passo check-rotulos npm run check:rotulos
passo check-series npm run check:series
passo capturas node design/especime-v3/medicoes/rp4m-2026-10-05/capturar.mjs --rotas salario-real --prefixo rp4mb- --json capturas-rp4mb.json
