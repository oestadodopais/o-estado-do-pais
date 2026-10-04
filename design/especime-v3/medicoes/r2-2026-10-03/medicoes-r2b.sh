#!/bin/sh
# R2-b (04.10.2026): as medições da passagem de correção sobre a construção da cabeça em dist/. Corre-se da raiz da
# worktree, com a tranca da máquina (com-tranca.sh); cada passo escreve o seu registo e o seu código nesta pasta, lido
# de ficheiro e nunca atrás de um «|». A construção da entrega do R2 (6a711d3e) mediu-se antes, numa cópia de
# `git archive` fora da árvore: entrega-inventario-r2b.json, portas-entrega-r2b.json e l1-entrega-check-lugar.txt.
set -u
P=design/especime-v3/medicoes/r2-2026-10-03
passo() { nome="$1"; shift; "$@" > "$P/$nome.log" 2>&1; echo $? > "$P/$nome.codigo"; echo "$nome: $(cat "$P/$nome.codigo")"; }
for prefixo in r2b- r2- k2c- p4 rp1 ue2- l2b- l1- lugar; do
  passo "plantas-portoes-$(echo $prefixo | sed 's/-$//')" env OEDP_MEDICOES=$P node tests/pais/portoes.mjs --prefixo $prefixo
done
passo check-rotulos-r2b node scripts/inventario-rotulos.mjs --prova --json $P/check-rotulos-r2b.json
passo check-cartao-r2b npm run check:cartao
passo check-formas-r2b npm run check:formas
passo check-lingua-r2b npm run check:lingua
passo check-voz-r2b npm run check:voz
passo check-lugar-r2b npm run check:lugar
passo depois-inventario-r2b node scripts/inventario-rotulos.mjs --inventario $P/depois-inventario-r2b.json
passo portas-depois-r2b node $P/portas-das-origens-r2b.mjs $P/portas-depois-r2b.json
passo l1-r2b node $P/l1-r2b.mjs
passo antes-depois-r2b node $P/antes-depois-r2b.mjs
passo auditoria-das-perguntas-r2b-confere node $P/auditoria-das-perguntas-r2b.mjs --confere
passo inventario-frases-r2b-confere node $P/inventario-frases-r2b.mjs --confere
passo captar-r2b node $P/captar-r2b.mjs
echo FIM-MEDICOES-R2B
