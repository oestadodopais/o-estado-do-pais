#!/bin/sh
# Corre um comando com a saída inteira num ficheiro e imprime só o que o construtor precisa de ver (M80,
# 13.10.2026, §1.190): o código, a duração, o número de linhas, as linhas de falha e as últimas oito.
# uso: sh scripts/leituras/curto.sh <registo> <comando> [argumentos...]
#      sh scripts/leituras/curto.sh <registo> sh -c '<um pipeline>'
# Porquê: a 12.10.2026 as saídas das ferramentas do construtor somaram 42 milhões de caracteres, que entram
# no contexto e são relidos em cada um dos 2 461 turnos do dia; os pontos da semana seguem esse volume. O
# registo inteiro fica no disco para o construtor ler por `grep` e para o pacote da leitura a frio.
set -u
[ $# -ge 2 ] || { echo 'curto: uso: curto.sh <registo> <comando> [argumentos...]' >&2; exit 2; }
registo="$1"; shift
mkdir -p "$(dirname "$registo")" || exit 2
inicio=$(date +%s)
"$@" > "$registo" 2>&1
codigo=$?
fim=$(date +%s)
linhas=$(wc -l < "$registo" | tr -d ' ')
echo "código $codigo · $((fim - inicio)) s · $linhas linhas em $registo"
falhas=$(grep -nE '✗|✘|FAIL|Error|error:|Traceback|erro|ERRO|recus|vermelh|not ok|AssertionError|npm ERR!|PAROU|RECUSAD|aviso|warning' "$registo" | head -40)
if [ -n "$falhas" ]; then
  echo "--- linhas de falha ou aviso (até quarenta) ---"
  printf '%s\n' "$falhas"
fi
echo "--- últimas oito linhas ---"
tail -n 8 "$registo"
exit "$codigo"
