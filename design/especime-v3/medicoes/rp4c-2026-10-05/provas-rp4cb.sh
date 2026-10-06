#!/bin/sh
# RP4-c-b (a passagem do peso): as provas sobre a construção da cabeça, cada passo no seu comando e com o código escrito
# num ficheiro depois de o processo acabar. Corre-se na raiz do sítio, depois das conferências e com a árvore seguida
# limpa, pela tranca da máquina:
#
#   sh design/especime-v3/medicoes/rp4c-2026-10-05/com-tranca.sh "$PWD" <registo> <código> \
#     sh design/especime-v3/medicoes/rp4c-2026-10-05/provas-rp4cb.sh
#
# Escreve os registos em `rp4cb/` e os códigos em `rp4cb/provas/`. As plantas dos portões mexem em ficheiros do `dist/` e
# repõem-nos, conferidos por sha256; correm depois das capturas, e fora da cadeia do `verify`.
set -u
A=design/especime-v3/medicoes/rp4c-2026-10-05
R="$A/rp4cb"
O="$R/provas"
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
passo marcas node $A/medir-marcas.mjs --dist dist --json $R/marcas.json --rotulo "a construção da passagem RP4-c-b"
passo peso node $A/medir-peso.mjs --dist dist --json $R/peso.json
passo formas node scripts/check-formas.mjs --json-rp4 $R/formas.json
passo series node tests/series/series.mjs --prova --json $R/series.json
passo primeira node tests/inicio/primeira-pagina.mjs --prova --json $R/primeira-plantas.json
passo capturas node $A/captar-rp4cb.mjs --json rp4cb/capturas.json --prefixo rp4cb-
passo plantas-dos-portoes env OEDP_MEDICOES=$R OEDP_EXIGIR_ARVORE_LIMPA=1 node tests/pais/portoes.mjs --prefixo rp4c
passo mapa python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md
git rev-parse HEAD > "$O/cabeca.fim"
git status --porcelain --untracked-files=no > "$O/estado.fim"
