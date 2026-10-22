#!/bin/sh
# Ensaio de conferir-tudo.sh, numa worktree de brincar numa pasta temporária (nunca no repositório),
# com uma tranca temporária (nunca a da máquina): três passos, o segundo vermelho.
# 1. Com --build, o build escreve a cabeça certa e os três passos correm sem parar: códigos 0, 1, 0, e o
#    resumo traz as linhas do vermelho. 2. Um dist/ de outra cabeça recusa a 9 sem correr nenhum passo.
# 3. Com --sem-build, o mesmo dist/ aceita-se e os três passos correm.
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
[ "$falhas" -eq 0 ] && echo "conferir-tudo: 3 ensaios verdes" || { echo "conferir-tudo: $falhas falha(s)"; cat "$tmp"/s*.out; }
exit "$falhas"
