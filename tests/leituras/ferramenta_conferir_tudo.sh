#!/bin/sh
# Ensaio de conferir-tudo.sh, numa worktree de brincar numa pasta temporária (nunca no repositório),
# com uma tranca temporária (nunca a da máquina): três passos, o segundo vermelho, e um projeto de build falhado.
# 1. Com --build, o build escreve a cabeça certa e os três passos correm sem parar: códigos 0, 1, 0, e o
#    resumo traz as linhas do vermelho. 2. Um dist/ de outra cabeça recusa a 9 sem correr nenhum passo.
# 3. Com --sem-build, o mesmo dist/ aceita-se e os três passos correm.
# 4. (M99-b) Um projeto cujo build falha, chamado com --build e uma pasta de saída relativa: o resumo escreve-se
#    na pasta relativa ao sítio da chamada, só com o 00-build a 1 e a cauda do build, a saída é 1, sem recusa
#    do dist/ e sem nenhum passo do verify.
# 5. (M99-3) Um projeto que declara `typecheck`: o passo corre no fim da lista e um typecheck vermelho fica no
#    resumo com a sua cauda; o projeto do ensaio 1, sem `typecheck`, não ganha o passo.
set -u
aqui="$(cd "$(dirname "$0")" && pwd -P)"
ferramenta="$aqui/../../scripts/leituras/conferir-tudo.sh"
tmp=$(mktemp -d "${TMPDIR:-/tmp}/oedp-conferir-tudo.XXXXXX") || exit 9
trap 'rm -rf "$tmp"' EXIT
export OEDP_TRANCA="$tmp/tranca.lock"
w="$tmp/w"; mkdir -p "$w"
cat > "$w/package.json" <<'JSON'
{"name":"brincar","private":true,"scripts":{
 "build":"mkdir -p dist && node -e \"require('fs').writeFileSync('dist/version.json', JSON.stringify({commit: require('child_process').execSync('git rev-parse HEAD').toString().trim()}))\"",
 "a":"echo passo-a-verde",
 "b":"echo MARCA-DO-VERMELHO; exit 1",
 "check:c":"echo passo-c-verde",
 "verify":"npm run a && npm run b && npm run check:c"}}
JSON
printf 'dist/\n' > "$w/.gitignore"
git -C "$w" init -q && git -C "$w" add package.json .gitignore \
  && git -C "$w" -c user.name=ensaio -c user.email=ensaio@invalid commit -q -m ensaio || exit 9
falhas=0
codigos() { printf '%s %s %s' "$(cat "$1/01-a.code")" "$(cat "$1/02-b.code")" "$(cat "$1/03-check_c.code")"; }
# 1. --build: os três correm, 0 1 0, a cauda do vermelho no resumo, a saída 1.
sh "$ferramenta" "$w" "$tmp/s1" --build > "$tmp/s1.out" 2>&1; codigo=$?
[ "$codigo" -eq 1 ] || { echo "1 falhou: esperava 1, veio $codigo"; falhas=$((falhas+1)); }
[ "$(cat "$tmp/s1/00-build.code" 2>/dev/null)" = 0 ] || { echo '1 falhou: o build não ficou a 0'; falhas=$((falhas+1)); }
[ "$(codigos "$tmp/s1" 2>/dev/null)" = '0 1 0' ] || { echo "1 falhou: códigos $(codigos "$tmp/s1" 2>/dev/null)"; falhas=$((falhas+1)); }
python3 -c 'import json,sys; r=json.load(open(sys.argv[1])); b=[p for p in r["passos"] if p["passo"]=="b"][0]; assert r["vermelhos"]==["b"] and any("MARCA-DO-VERMELHO" in l for l in b["cauda"])' "$tmp/s1/resumo.json" 2>/dev/null \
  || { echo '1 falhou: o resumo não traz as linhas do vermelho'; falhas=$((falhas+1)); }
[ ! -e "$OEDP_TRANCA" ] || { echo '1 falhou: a tranca ficou'; falhas=$((falhas+1)); }
# 2. Um dist/ de outra cabeça: recusa a 9, nenhum código de passo.
printf '{"commit":"%s"}' 0000000000000000000000000000000000000000 > "$w/dist/version.json"
sh "$ferramenta" "$w" "$tmp/s2" > "$tmp/s2.out" 2>&1; codigo=$?
[ "$codigo" -eq 9 ] || { echo "2 falhou: esperava 9, veio $codigo"; falhas=$((falhas+1)); }
[ -z "$(ls "$tmp/s2" | grep '\.code$')" ] || { echo '2 falhou: correram passos'; falhas=$((falhas+1)); }
# 3. O mesmo dist/ com --sem-build: aceita e corre os três.
sh "$ferramenta" "$w" "$tmp/s3" --sem-build > "$tmp/s3.out" 2>&1; codigo=$?
[ "$codigo" -eq 1 ] || { echo "3 falhou: esperava 1, veio $codigo"; falhas=$((falhas+1)); }
[ "$(codigos "$tmp/s3" 2>/dev/null)" = '0 1 0' ] || { echo "3 falhou: códigos $(codigos "$tmp/s3" 2>/dev/null)"; falhas=$((falhas+1)); }
# 4. Um build falhado com --build e uma pasta relativa.
w4="$tmp/w4"; mkdir -p "$w4"
cat > "$w4/package.json" <<'JSON'
{"name":"brincar-build-falhado","private":true,"scripts":{
 "build":"echo MARCA-DO-BUILD; exit 1",
 "a":"echo passo-a-verde",
 "verify":"npm run a"}}
JSON
git -C "$w4" init -q && git -C "$w4" add package.json \
  && git -C "$w4" -c user.name=ensaio -c user.email=ensaio@invalid commit -q -m ensaio || exit 9
(cd "$tmp" && sh "$ferramenta" "$w4" s4 --build) > "$tmp/s4.out" 2>&1; codigo=$?
[ "$codigo" -eq 1 ] || { echo "4 falhou: esperava 1, veio $codigo"; falhas=$((falhas+1)); }
[ ! -e "$w4/s4" ] || { echo '4 falhou: a pasta relativa resolveu-se dentro da worktree'; falhas=$((falhas+1)); }
[ ! -e "$tmp/s4/recusa" ] || { echo '4 falhou: caiu na recusa do dist/'; falhas=$((falhas+1)); }
[ ! -e "$tmp/s4/01-a.code" ] || { echo '4 falhou: correram passos do verify'; falhas=$((falhas+1)); }
python3 -c 'import json,sys; r=json.load(open(sys.argv[1])); b=r["passos"]; assert r["vermelhos"]==["build"] and len(b)==1 and b[0]["codigo"]==1 and any("MARCA-DO-BUILD" in l for l in b[0]["cauda"])' "$tmp/s4/resumo.json" 2>/dev/null \
  || { echo '4 falhou: o resumo não traz o build vermelho com a cauda'; falhas=$((falhas+1)); }
[ -f "$tmp/s4/resumo.md" ] || { echo '4 falhou: sem resumo.md'; falhas=$((falhas+1)); }
[ ! -e "$OEDP_TRANCA" ] || { echo '4 falhou: a tranca ficou'; falhas=$((falhas+1)); }
# 5. (M99-3) O typecheck declarado corre no fim e o vermelho fica no resumo; o projeto do ensaio 1 não o ganha.
[ ! -e "$tmp/s1/04-typecheck.code" ] || { echo '5 falhou: o projeto sem typecheck ganhou o passo'; falhas=$((falhas+1)); }
w5="$tmp/w5"; mkdir -p "$w5"
cat > "$w5/package.json" <<'JSON'
{"name":"brincar-typecheck","private":true,"scripts":{
 "build":"mkdir -p dist && node -e \"require('fs').writeFileSync('dist/version.json', JSON.stringify({commit: require('child_process').execSync('git rev-parse HEAD').toString().trim()}))\"",
 "a":"echo passo-a-verde",
 "typecheck":"echo MARCA-DO-TYPECHECK; exit 1",
 "verify":"npm run a"}}
JSON
printf 'dist/\n' > "$w5/.gitignore"
git -C "$w5" init -q && git -C "$w5" add package.json .gitignore \
  && git -C "$w5" -c user.name=ensaio -c user.email=ensaio@invalid commit -q -m ensaio || exit 9
sh "$ferramenta" "$w5" "$tmp/s5" --build > "$tmp/s5.out" 2>&1; codigo=$?
[ "$codigo" -eq 1 ] || { echo "5 falhou: esperava 1, veio $codigo"; falhas=$((falhas+1)); }
[ "$(cat "$tmp/s5/01-a.code" 2>/dev/null) $(cat "$tmp/s5/02-typecheck.code" 2>/dev/null)" = '0 1' ] || { echo "5 falhou: códigos $(cat "$tmp/s5/01-a.code" 2>/dev/null) $(cat "$tmp/s5/02-typecheck.code" 2>/dev/null)"; falhas=$((falhas+1)); }
python3 -c 'import json,sys; r=json.load(open(sys.argv[1])); b=[p for p in r["passos"] if p["passo"]=="typecheck"][0]; assert r["vermelhos"]==["typecheck"] and any("MARCA-DO-TYPECHECK" in l for l in b["cauda"])' "$tmp/s5/resumo.json" 2>/dev/null \
  || { echo '5 falhou: o resumo não traz o typecheck vermelho com a cauda'; falhas=$((falhas+1)); }
[ ! -e "$OEDP_TRANCA" ] || { echo '5 falhou: a tranca ficou'; falhas=$((falhas+1)); }
[ "$falhas" -eq 0 ] && echo "conferir-tudo: 5 ensaios verdes" || { echo "conferir-tudo: $falhas falha(s)"; cat "$tmp"/s*.out; }
exit "$falhas"
