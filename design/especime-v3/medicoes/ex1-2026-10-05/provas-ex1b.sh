#!/bin/sh
# EX1-b: as provas da passagem de correção sobre a construção da cabeça do código (a dos portões finais dela), cada passo no
# seu comando e com o código escrito num ficheiro depois de o processo acabar (nunca lido atrás de um «|»). Corre-se na
# raiz do sítio, depois dos portões e com a árvore seguida limpa, pela tranca da máquina:
#
#   sh design/especime-v3/medicoes/ex1-2026-10-05/com-tranca.sh "$PWD" <registo> <código> \
#     sh design/especime-v3/medicoes/ex1-2026-10-05/provas-ex1b.sh
#
# Escreve em `ex1b/` os registos que o `medir.py` lê, e em `ex1b/provas/` a cabeça, o estado dos ficheiros seguidos e,
# por passo, um `.log` que começa pela cabeça e pelo estado dos ficheiros seguidos nesse momento, um `.codigo`, um
# `.inicio` e um `.fim`. As plantas dos portões mexem em ficheiros do `dist/` e repõem-nos, conferidos por sha256; correm
# por último, depois das capturas e das medidas, e fora da cadeia do `verify`.
set -u
A=design/especime-v3/medicoes/ex1-2026-10-05
B="$A/ex1b"
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
passo brief env OEDP_MEDIDAS_JSON=$B/brief-reproduzido.json python3 design/observatorio/medidas/BRIEF-EX1.py
passo briefs python3 scripts/check-briefs.py
passo acertos node $A/acertos-ex1.mjs --json $B/acertos.json
passo explicacao node tests/explicacoes/explicacao.mjs --prova --json $B/explicacao.json
passo semana node tests/explicacoes/semana.mjs --prova --json $B/semana.json
passo sinais node scripts/sinais-da-primeira-pagina.mjs
cp .sinais/explicacoes.json "$B/sinais-explicacoes.json"
passo frases-compostas node tests/explicacoes/frases-compostas.mjs --json $B/frases-compostas.json
passo capturas node $A/captar-ex1b.mjs --json ex1b/capturas.json
# As plantas do EX1 e as do EX1-b correm em duas corridas, uma por prefixo: com o prefixo «ex1», o bloco das do EX1-b em
# `tests/pais/portoes.mjs` não corre (a condição dele só aceita um prefixo que comece por «ex1b»).
passo plantas-dos-portoes env OEDP_MEDICOES=$B OEDP_EXIGIR_ARVORE_LIMPA=1 node tests/pais/portoes.mjs --prefixo ex1-
passo plantas-do-ex1b env OEDP_MEDICOES=$B OEDP_EXIGIR_ARVORE_LIMPA=1 node tests/pais/portoes.mjs --prefixo ex1b-
passo plantas-do-r3 env OEDP_MEDICOES=$B OEDP_EXIGIR_ARVORE_LIMPA=1 node tests/pais/portoes.mjs --lista r3-rodape-sem-a-porta-do-indice,r3-rodape-indice-da-outra-edicao
passo mapa python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md
passo mapa-a-mao python3 $A/mapa-a-mao.py 1d64052a 37b3daf9 --json $B/mapa-a-mao.json
git rev-parse HEAD > "$O/cabeca.fim"
git status --porcelain --untracked-files=no > "$O/estado.fim"
