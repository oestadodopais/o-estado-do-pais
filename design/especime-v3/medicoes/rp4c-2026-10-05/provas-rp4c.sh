#!/bin/sh
# RP4-c: as provas do bloco sobre a construção da cabeça do código (a dos portões finais), cada passo no seu comando e
# com o código escrito num ficheiro depois de o processo acabar (nunca lido atrás de um «|»). Corre-se na raiz do sítio,
# depois dos portões e com a árvore seguida limpa, pela tranca da máquina:
#
#   sh design/especime-v3/medicoes/rp4c-2026-10-05/com-tranca.sh "$PWD" <registo> <código> \
#     sh design/especime-v3/medicoes/rp4c-2026-10-05/provas-rp4c.sh
#
# Escreve nesta pasta os registos que o `medir.py` lê, e em `provas/` a cabeça, o estado dos ficheiros seguidos e, por
# passo, um `.log`, um `.codigo`, um `.inicio` e um `.fim`. As plantas dos portões mexem em ficheiros do `dist/` e
# repõem-nos, conferidos por sha256; correm por último, depois das capturas, e fora da cadeia do `verify`.
set -u
A=design/especime-v3/medicoes/rp4c-2026-10-05
O="$A/provas"
mkdir -p "$O"
git rev-parse HEAD > "$O/cabeca"
git status --porcelain --untracked-files=no > "$O/estado"
cp dist/version.json "$O/version.json"
passo() {
  nome="$1"; shift
  date -u +%Y-%m-%dT%H:%M:%SZ > "$O/$nome.inicio"
  "$@" > "$O/$nome.log" 2>&1
  echo $? > "$O/$nome.codigo"
  date -u +%Y-%m-%dT%H:%M:%SZ > "$O/$nome.fim"
  echo "$nome $(cat "$O/$nome.codigo")"
}
passo marcas node $A/medir-marcas.mjs --dist dist --json $A/marcas-depois.json --rotulo "a construção dos portões finais"
passo letra node $A/medir-letra.mjs --dist dist --json $A/letra-dos-eixos-depois.json --rotulo "a construção dos portões finais"
passo peso node $A/medir-peso.mjs --dist dist --json $A/peso-depois.json
passo formas node scripts/check-formas.mjs --json-rp4 $A/formas-rp4c.json
passo series node tests/series/series.mjs --prova --json $A/series.json
passo capturas node $A/captar-rp4c.mjs --json capturas.json
passo plantas-dos-portoes env OEDP_MEDICOES=$A OEDP_EXIGIR_ARVORE_LIMPA=1 node tests/pais/portoes.mjs --prefixo rp4c-
passo mapa python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md
cp "$O/mapa.log" "$A/mapa.log"
git rev-parse HEAD > "$O/cabeca.fim"
git status --porcelain --untracked-files=no > "$O/estado.fim"
