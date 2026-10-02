#!/bin/sh
# A metade da plataforma da prova de caminho da caixa das sugestões (bloco S1, 02.10.2026, ponto 8 do brief).
# uso, da raiz da worktree:  sh design/especime-v3/medicoes/s1-2026-10-02/prova-do-caminho/prova-da-plataforma.sh <endereço da pré-visualização>
#
# Grava, nesta pasta: o que `vercel inspect` diz da implantação (o alvo, o estado e a linha da função com a região),
# e o que a pré-visualização responde a um GET e a um POST em /api/sugestoes (o estado, o anfitrião do `location` e o
# `x-vercel-id`). A pré-visualização está atrás da autenticação da Vercel: o pedido não chega à função e a resposta é o
# 302 para o início de sessão, e o `x-vercel-id` dessa resposta diz só a região da borda que a serviu, e não a da
# função. A região da função prova-se pela linha do `vercel inspect`, e no ar pelo `verify:deploy`.
#
# O nome da equipa da conta, que vai no endereço da pré-visualização, sai redigido como <equipa>; nenhum endereço IP,
# nenhum segredo e nenhuma sessão se gravam. Os pedidos não levam texto de sugestão nenhum.
U="$1"; O="$(dirname "$0")"
redige() { sed -E 's/nunos-projects[-a-z0-9]*/<equipa>/g; s#https://vercel\.com/[^ ]*#https://vercel.com/<…>#g'; }
vercel inspect "$U" > "$O/vercel-inspect.cru" 2>&1; echo $? > "$O/vercel-inspect.codigo"
grep -E '^\s*(id|target|status|url)\s|λ|api/sugestoes|\[[a-z]{3}[0-9]\]' "$O/vercel-inspect.cru" | redige > "$O/vercel-inspect.txt"
rm -f "$O/vercel-inspect.cru"
pede() {
  nome="$1"; shift
  curl -s -o /dev/null -D "$O/$nome.cabecalhos" -w "%{http_code}" "$@" > "$O/$nome.estado"
  loc="$(grep -i '^location:' "$O/$nome.cabecalhos" | tr -d '\r' | cut -d' ' -f2- | sed -E 's#^(https?://[^/?]*).*#\1#')"
  vid="$(grep -i '^x-vercel-id:' "$O/$nome.cabecalhos" | tr -d '\r' | cut -d' ' -f2-)"
  printf '%s · estado %s · anfitrião do location %s · x-vercel-id %s\n' "$nome" "$(cat "$O/$nome.estado")" "${loc:-(nenhum)}" "${vid:-(nenhum)}" | redige
  rm -f "$O/$nome.cabecalhos" "$O/$nome.estado"
}
{
  echo "pedidos à pré-visualização, $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  pede pre-get "$U/api/sugestoes"
  pede pre-post -X POST --data-urlencode "lingua=pt" "$U/api/sugestoes"
} > "$O/pre-visualizacao.txt"
cat "$O/vercel-inspect.txt" "$O/pre-visualizacao.txt"
