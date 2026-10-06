#!/bin/sh
# A FUSÃO COM O MAIN DE 06.10.2026 (o R4): as conferências que a fusão toca, sobre a construção da cabeça do código, cada
# passo no seu comando e com o código escrito num ficheiro depois de o processo acabar (nunca lido atrás de um «|»).
# O mandato pede a K17 (o check:cartao), a L1 (o check:lugar, com a planta do teto), o check:voz, o check:lingua, o
# check:explicacoes, o check:frases-compostas e as plantas com os dois prefixos (as do EX1 e as do R4); juntam-se as
# leituras provadas como JSON com todas as chaves, o check:pais (a primeira página que os dois blocos mudam), as peças do
# R4 nas páginas que as células do EX1 leem, o ledger:check (a entrada §1.170) e o mapa. Corre-se na raiz do sítio,
# depois da construção e com a árvore seguida limpa, pela tranca da máquina:
#
#   sh design/especime-v3/medicoes/ex1-2026-10-05/com-tranca.sh "$PWD" <registo> <código> \
#     sh design/especime-v3/medicoes/ex1-2026-10-05/provas-fusao.sh <worktree do main, construída>
#
# Escreve em `fusao/` os registos que o `medir.py` lê, e em `fusao/provas/` a cabeça, o estado dos ficheiros seguidos e,
# por passo, um `.log` que começa pela cabeça e pelo estado dos ficheiros seguidos nesse momento, um `.codigo`, um
# `.inicio` e um `.fim`. As plantas dos portões mexem em ficheiros do `dist/` e repõem-nos, conferidos por sha256; correm
# por último.
set -u
MAIN="$1"
A=design/especime-v3/medicoes/ex1-2026-10-05
B="$A/fusao"
O="$B/provas"
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
passo leituras-provadas python3 $A/conferir-leituras-provadas.py $B/leituras-provadas.json
passo cartao npm run check:cartao
passo lugar npm run check:lugar
passo planta-teto node $A/planta-teto-l1-fusao.mjs
passo voz npm run check:voz
passo lingua npm run check:lingua
passo explicacoes npm run check:explicacoes
passo frases-compostas node tests/explicacoes/frases-compostas.mjs --json $B/frases-compostas.json
passo pais npm run check:pais
passo r4-nas-celulas node $A/r4-nas-celulas.mjs "$MAIN" $B/r4-nas-celulas.json
passo ledger npm run ledger:check
passo mapa python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md
passo plantas-ex1 env OEDP_MEDICOES=$B OEDP_EXIGIR_ARVORE_LIMPA=1 node tests/pais/portoes.mjs --prefixo ex1
passo plantas-r4 env OEDP_MEDICOES=$B OEDP_EXIGIR_ARVORE_LIMPA=1 node tests/pais/portoes.mjs --prefixo r4
git rev-parse HEAD > "$O/cabeca.fim"
git status --porcelain --untracked-files=no > "$O/estado.fim"
