#!/bin/sh
# As listas fechadas que uma linha nova arrasta, enumeradas por uma linha irmã (a lição de 29.10.2026: sete paragens pela regra certa num dia).
# Imprime os ficheiros seguidos pelo git que nomeiam o id, o título do documento e o ficheiro do documento da linha irmã, fora do livro,
# das medições e das críticas (que o exportador e os registos preenchem), e as entradas de SEM_AREA cuja expressão apanha o id irmão.
# uso: listas-de-uma-linha.sh <worktree do sítio> <id da linha irmã> [<título do documento irmão>] [<ficheiro do documento irmão>]
set -u
W="$1"; ID="$2"; TITULO="${3:-}"; FICHEIRO="${4:-}"
cd "$W" || exit 9
excluir='^(ledger/|design/especime-v3/medicoes/|design/especime-v3/critica/|tests/discussao/palavras\.json$)'
echo "pelo id «$ID»:"; git grep -I -l -F -- "$ID" HEAD -- . | sed 's#^HEAD:##' | grep -v -E "$excluir" | sed 's/^/  /'
if [ -n "$TITULO" ]; then echo "pelo título «$TITULO»:"; git grep -I -l -F -- "$TITULO" HEAD -- . | sed 's#^HEAD:##' | grep -v -E "$excluir" | sed 's/^/  /'; fi
if [ -n "$FICHEIRO" ]; then echo "pelo ficheiro «$FICHEIRO»:"; git grep -I -l -F -- "$FICHEIRO" HEAD -- . | sed 's#^HEAD:##' | grep -v -E "$excluir" | sed 's/^/  /'; fi
echo "as entradas de SEM_AREA (src/data/areas.mjs) cuja expressão apanha «$ID»:"
node -e '
const fs=require("fs"); const s=fs.readFileSync("src/data/areas.mjs","utf8"); const id=process.argv[1];
const re=/id:\s*(\/(?:\\\/|[^\/\n])+\/[a-z]*)/g; let m, n=0;
while((m=re.exec(s))){ const src=m[1]; const corpo=src.slice(1,src.lastIndexOf("/")); const flags=src.slice(src.lastIndexOf("/")+1); try{ if(new RegExp(corpo,flags).test(id)){ n++; const linha=s.slice(0,m.index).split("\n").length; console.log("  linha "+linha+": "+src.slice(0,120)+(src.length>120?"…":"")); } }catch(e){} }
if(!n) console.log("  nenhuma (a linha nova precisa de uma entrada ou de um cartão de área)");
' "$ID"
echo "os marcadores da voz medem-se à parte: voz-do-mandato.py <mandato.md>"
