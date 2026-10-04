#!/bin/sh
# R3: as provas sobre a construção da cabeça dos portões, por esta ordem, cada uma com o seu registo e o seu código
# escritos em ficheiros desta pasta (nunca lidos atrás de um «|»): as capturas, as plantas dos portões sobre o dist/
# (que estragam cópias e repõem os bytes), a célula do índice com as plantas, e a régua das ligações pela regra da
# Vercel. Corre-se da raiz da worktree, dentro da tranca da máquina:
#   sh design/especime-v3/medicoes/r3-2026-10-04/com-tranca.sh <worktree> \
#     design/especime-v3/medicoes/r3-2026-10-04/provas-finais.log design/especime-v3/medicoes/r3-2026-10-04/provas-finais.codigo \
#     sh design/especime-v3/medicoes/r3-2026-10-04/provas-finais.sh
set -u
P=design/especime-v3/medicoes/r3-2026-10-04
node $P/captar-r3.mjs > $P/captar-r3.log 2>&1; echo $? > $P/captar-r3.codigo
OEDP_MEDICOES=$P node tests/pais/portoes.mjs --prefixo r3- > $P/plantas-portoes-r3.log 2>&1; echo $? > $P/plantas-portoes-r3.codigo
node tests/indice/indice.mjs --prova --json $P/celula-indice.json > $P/celula-indice.log 2>&1; echo $? > $P/celula-indice.codigo
node $P/ligacoes-pela-regra-da-vercel.mjs > /dev/null 2> $P/ligacoes-pela-regra-da-vercel.erros; echo $? > $P/ligacoes-pela-regra-da-vercel.codigo
echo "capturas $(cat $P/captar-r3.codigo) plantas $(cat $P/plantas-portoes-r3.codigo) celula $(cat $P/celula-indice.codigo) ligacoes $(cat $P/ligacoes-pela-regra-da-vercel.codigo)"
for c in captar-r3 plantas-portoes-r3 celula-indice ligacoes-pela-regra-da-vercel; do [ "$(cat $P/$c.codigo)" = 0 ] || exit 1; done
exit 0
