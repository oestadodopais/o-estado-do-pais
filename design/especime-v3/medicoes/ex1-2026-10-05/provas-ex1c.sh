#!/bin/sh
# EX1-c: as provas da passagem depois da leitura a frio, sobre a construção da cabeça do código, cada passo no seu comando
# e com o código escrito num ficheiro depois de o processo acabar (nunca lido atrás de um «|»). Correm só as conferências
# que a passagem toca (as células X e W, a F22, o check:explicacoes, o check:frases-compostas, o portão de HTML e o
# check:voz, onde as células correm, e, pela secção nova da página da semana, o check:cabeca, o check:lingua, o
# check:lugar e o check:alvos; as plantas sobre a construção e o mapa); os três portões inteiros corre-os o lugar de
# direção. Corre-se na raiz do sítio, depois da construção e com a árvore seguida limpa, pela tranca da máquina:
#
#   sh design/especime-v3/medicoes/ex1-2026-10-05/com-tranca.sh "$PWD" <registo> <código> \
#     sh design/especime-v3/medicoes/ex1-2026-10-05/provas-ex1c.sh
#
# Escreve em `ex1c/` os registos que o `medir.py` lê, e em `ex1c/provas/` a cabeça, o estado dos ficheiros seguidos e,
# por passo, um `.log` que começa pela cabeça e pelo estado dos ficheiros seguidos nesse momento, um `.codigo`, um
# `.inicio` e um `.fim`. As plantas dos portões mexem em ficheiros do `dist/` e repõem-nos, conferidos por sha256; correm
# por último, depois das capturas e das medidas.
set -u
A=design/especime-v3/medicoes/ex1-2026-10-05
B="$A/ex1c"
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
passo typecheck npm run typecheck
passo acertos node $A/acertos-ex1.mjs --json $B/acertos.json
passo explicacao node tests/explicacoes/explicacao.mjs --prova --json $B/explicacao.json
passo semana node tests/explicacoes/semana.mjs --prova --json $B/semana.json
passo check-explicacoes npm run check:explicacoes
passo formas node scripts/check-formas.mjs
passo frases-compostas node tests/explicacoes/frases-compostas.mjs --json $B/frases-compostas.json
passo gate-html node scripts/gate-html.mjs
passo voz node scripts/check-voz.mjs
passo cabeca npm run check:cabeca
passo lingua npm run check:lingua
passo lugar npm run check:lugar
passo alvos npm run check:alvos
passo sinais node scripts/sinais-da-primeira-pagina.mjs
cp .sinais/explicacoes.json "$B/sinais-explicacoes.json"
passo frases-rendidas node $A/frases-rendidas.mjs $B/frases-rendidas.json
passo capturas node $A/captar-ex1c.mjs --json ex1c/capturas.json
passo plantas-dos-portoes env OEDP_MEDICOES=$B OEDP_EXIGIR_ARVORE_LIMPA=1 node tests/pais/portoes.mjs --prefixo ex1
passo mapa python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md
git rev-parse HEAD > "$O/cabeca.fim"
git status --porcelain --untracked-files=no > "$O/estado.fim"
