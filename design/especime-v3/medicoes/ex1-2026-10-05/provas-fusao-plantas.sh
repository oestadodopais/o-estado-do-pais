#!/bin/sh
# A FUSÃO, A SEGUNDA CORRIDA DAS PLANTAS SOBRE A CONSTRUÇÃO. Na primeira corrida de `provas-fusao.sh`, as conferências
# passaram todas com a árvore seguida limpa, e as plantas do EX1 pararam na 22.ª (`ex1b-maiores-valor-trocado`), com a
# queixa «a prova exige uma árvore seguida limpa»: o construtor tinha escrito no guião das medidas (um ficheiro seguido)
# enquanto elas corriam, e o executor das plantas recusou seguir, como deve. As do R4 pararam na primeira pela mesma
# razão. Este guião corre só os dois passos das plantas, com a mesma função de passo e na mesma pasta, depois de a árvore
# voltar a estar limpa, e escreve outra vez a cabeça e o estado do fim. Corre-se pela tranca da máquina:
#
#   sh design/especime-v3/medicoes/ex1-2026-10-05/com-tranca.sh "$PWD" <registo> <código> \
#     sh design/especime-v3/medicoes/ex1-2026-10-05/provas-fusao-plantas.sh
set -u
A=design/especime-v3/medicoes/ex1-2026-10-05
B="$A/fusao"
O="$B/provas"
passo() {
  nome="$1"; shift
  date -u +%Y-%m-%dT%H:%M:%SZ > "$O/$nome.inicio"
  { echo "cabeça: $(git rev-parse HEAD)"; echo "estado dos ficheiros seguidos: $(git status --porcelain --untracked-files=no | wc -l | tr -d ' ') linha(s)"; git status --porcelain --untracked-files=no; echo "---"; } > "$O/$nome.log"
  "$@" >> "$O/$nome.log" 2>&1
  echo $? > "$O/$nome.codigo"
  date -u +%Y-%m-%dT%H:%M:%SZ > "$O/$nome.fim"
  echo "$nome $(cat "$O/$nome.codigo")"
}
passo plantas-ex1 env OEDP_MEDICOES=$B OEDP_EXIGIR_ARVORE_LIMPA=1 node tests/pais/portoes.mjs --prefixo ex1
passo plantas-r4 env OEDP_MEDICOES=$B OEDP_EXIGIR_ARVORE_LIMPA=1 node tests/pais/portoes.mjs --prefixo r4
git rev-parse HEAD > "$O/cabeca.fim"
git status --porcelain --untracked-files=no > "$O/estado.fim"
