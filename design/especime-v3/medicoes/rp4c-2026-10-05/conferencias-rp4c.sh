#!/bin/sh
# RP4-c: a construção de uma cabeça e as conferências que a mudança toca (o desenho das séries, as suas marcas, as
# zonas de leitura, a legenda da unidade, as origens novas), cada uma no seu comando e com o código escrito num ficheiro
# depois de o processo acabar (nunca lido atrás de um «|»). Não são os três portões inteiros, que correm no fim pela
# tranca com `scripts/leituras/portoes.sh`: é o que se corre entre commits. Corre-se na raiz do sítio, com a tranca da
# máquina, pelo ajudante desta pasta:
#
#   sh design/especime-v3/medicoes/rp4c-2026-10-05/com-tranca.sh "$PWD" <registo> <código> \
#     sh design/especime-v3/medicoes/rp4c-2026-10-05/conferencias-rp4c.sh <pasta de saída>
#
# Escreve na pasta de saída: a cabeça, o estado dos ficheiros seguidos fora da pasta das medições (vazio quer dizer o
# código todo junto antes da construção), e por passo um `.log`, um `.codigo`, um `.inicio` e um `.fim`. Uma construção
# que falhe para a corrida, porque nenhuma conferência sobre ela diria nada desta cabeça.
set -u
O="$1"
mkdir -p "$O"
git rev-parse HEAD > "$O/cabeca"
git status --porcelain --untracked-files=no -- . ':!design/especime-v3/medicoes/rp4c-2026-10-05' ':!design/especime-v3/capturas/rp4c-2026-10-05' > "$O/estado"
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
passo check-voz npm run check:voz
passo check-lugar npm run check:lugar
passo check-lingua npm run check:lingua
passo check-series npm run check:series
passo check-cartao npm run check:cartao
passo check-rotulos npm run check:rotulos
passo check-primeira npm run check:primeira
passo check-css npm run check:css
passo check-navegacao npm run check:navegacao
passo check-palavras npm run check:palavras
passo check-mortos npm run check:mortos
passo check-alvos npm run check:alvos
passo design-feixe npm run design:feixe
passo typecheck npm run typecheck
git rev-parse HEAD > "$O/cabeca.fim"
