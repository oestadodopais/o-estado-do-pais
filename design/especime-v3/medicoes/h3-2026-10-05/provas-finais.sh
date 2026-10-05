#!/bin/sh
# H3: as provas depois dos três portões a 0, na mesma cabeça e sobre a construção que eles fizeram: as plantas sobre a
# construção (o prefixo h3- e as três do S1 adaptadas), as capturas de depois, a medida estática dos cookies e as
# etiquetas do toque uma a uma, nas cinco larguras (a emenda que as mantém dentro do desenho). Cada
# código escreve-se no seu ficheiro depois de o processo acabar, nunca atrás de um «|», e a cabeça e o estado da árvore
# de cada passo ficam ao lado (a M50). As plantas recusam correr numa árvore seguida suja (OEDP_EXIGIR_ARVORE_LIMPA).
# uso, da raiz da worktree: sh design/especime-v3/medicoes/h3-2026-10-05/provas-finais.sh
set -u
P=design/especime-v3/medicoes/h3-2026-10-05
passo() {
  nome="$1"; shift
  git rev-parse HEAD > "$P/$nome.cabeca"
  git status --porcelain --untracked-files=no > "$P/$nome.estado"
  inicio=$(date +%s)
  "$@" > "$P/$nome.log" 2>&1
  echo $? > "$P/$nome.codigo"
  echo "$(( $(date +%s) - inicio ))" > "$P/$nome.segundos"
  echo "$nome=$(cat "$P/$nome.codigo")"
}
passo plantas-portoes-h3 env OEDP_MEDICOES="$P" OEDP_EXIGIR_ARVORE_LIMPA=1 node tests/pais/portoes.mjs --prefixo h3-
passo plantas-portoes-lista env OEDP_MEDICOES="$P" OEDP_EXIGIR_ARVORE_LIMPA=1 node tests/pais/portoes.mjs --lista s1-nota-mudada,s1-voz-nota-mudada-com-language,s1c-voz-nota-com-outra-palavra
passo captar-depois node "$P/captar-h3.mjs" depois
passo cookies-e-seguimento-depois node "$P/cookies-e-seguimento.mjs" depois
passo etiquetas-do-toque-depois-da-emenda node "$P/etiquetas-do-toque.mjs" depois-da-emenda
