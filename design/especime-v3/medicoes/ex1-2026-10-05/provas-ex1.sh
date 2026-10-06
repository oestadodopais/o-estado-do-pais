#!/bin/sh
# EX1: as provas do bloco sobre a construção da cabeça do código (a dos portões finais), cada passo no seu comando e com o
# código escrito num ficheiro depois de o processo acabar (nunca lido atrás de um «|»). Corre-se na raiz do sítio, depois
# dos portões e com a árvore seguida limpa, pela tranca da máquina:
#
#   sh design/especime-v3/medicoes/ex1-2026-10-05/com-tranca.sh "$PWD" <registo> <código> \
#     sh design/especime-v3/medicoes/ex1-2026-10-05/provas-ex1.sh
#
# Escreve nesta pasta os registos que o `medir.py` lê, e em `provas/` a cabeça, o estado dos ficheiros seguidos e, por
# passo, um `.log` que começa pela cabeça e pelo estado dos ficheiros seguidos nesse momento, um `.codigo`, um `.inicio`
# e um `.fim`. As plantas dos portões mexem em ficheiros do `dist/` e repõem-nos, conferidos por sha256; correm por
# último, depois das capturas e das medidas, e fora da cadeia do `verify`.
set -u
A=design/especime-v3/medicoes/ex1-2026-10-05
O="$A/provas"
mkdir -p "$O"
git rev-parse HEAD > "$O/cabeca"
git status --porcelain --untracked-files=no > "$O/estado"
cp dist/version.json "$O/version.json"
passo() {
  nome="$1"; shift
  date -u +%Y-%m-%dT%H:%M:%SZ > "$O/$nome.inicio"
  { echo "cabeça: $(git rev-parse HEAD)"; echo "estado dos ficheiros seguidos: $(git status --porcelain --untracked-files=no | wc -l | tr -d ' ') linha(s)"; git status --porcelain --untracked-files=no; echo "---"; } > "$O/$nome.log"
  "$@" >> "$O/$nome.log" 2>&1
  echo $? > "$O/$nome.codigo"
  date -u +%Y-%m-%dT%H:%M:%SZ > "$O/$nome.fim"
  echo "$nome $(cat "$O/$nome.codigo")"
}
passo brief env OEDP_MEDIDAS_JSON=$A/brief-reproduzido.json python3 design/observatorio/medidas/BRIEF-EX1.py
passo acertos node $A/acertos-ex1.mjs --json $A/acertos.json
passo explicacao node tests/explicacoes/explicacao.mjs --prova --json $A/explicacao.json
passo semana node tests/explicacoes/semana.mjs --prova --json $A/semana.json
passo sinais node scripts/sinais-da-primeira-pagina.mjs
cp .sinais/explicacoes.json "$A/sinais-explicacoes.json"
passo menu node $A/menu-a-390.mjs
passo capturas node $A/captar-ex1.mjs --json capturas.json
passo frases-em-flex node $A/frases-em-flex.mjs --json $A/frases-em-flex.json
passo plantas-dos-portoes env OEDP_MEDICOES=$A OEDP_EXIGIR_ARVORE_LIMPA=1 node tests/pais/portoes.mjs --prefixo ex1-
passo mapa python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md
passo mapa-a-mao python3 $A/mapa-a-mao.py 3664b90d c885cb4c --json $A/mapa-a-mao.json
git rev-parse HEAD > "$O/cabeca.fim"
git status --porcelain --untracked-files=no > "$O/estado.fim"
