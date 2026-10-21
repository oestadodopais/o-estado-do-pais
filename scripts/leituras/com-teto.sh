#!/bin/sh
# Corre um comando com um teto de relógio de parede (21.10.2026, a decisão do financiador sobre o custo:
# uma passagem que passa do teto pára e relata, não continua a cavar). O que vem pela entrada-padrão
# guarda-se num ficheiro temporário e passa inteiro ao comando (um processo em segundo plano num guião
# não herda a entrada-padrão). Ao chegar ao teto, o comando e os seus filhos levam TERM e, dez segundos
# depois, KILL; a saída é 124, como o `timeout` do GNU. Sem teto a saída é a do comando.
# Uso: com-teto.sh <segundos> <comando> [argumentos...]   (a entrada-padrão passa ao comando)
set -u
teto="$1"; shift
case "$teto" in ''|*[!0-9]*) echo "com-teto: o teto é um número inteiro de segundos (recebi: ${teto})" >&2; exit 9;; esac
[ "$#" -ge 1 ] || { echo 'com-teto: falta o comando' >&2; exit 9; }
entrada=$(mktemp "${TMPDIR:-/tmp}/oedp-com-teto.XXXXXX") || exit 9
cat > "$entrada"
"$@" < "$entrada" &
filho=$!
inicio=$(date +%s)
saida=0
while kill -0 "$filho" 2>/dev/null; do
  agora=$(date +%s)
  if [ $((agora - inicio)) -ge "$teto" ]; then
    echo "com-teto: passou do teto (${teto} s): a interromper o comando" >&2
    pkill -TERM -P "$filho" 2>/dev/null; kill -TERM "$filho" 2>/dev/null
    sleep 10
    pkill -KILL -P "$filho" 2>/dev/null; kill -KILL "$filho" 2>/dev/null
    saida=124
    break
  fi
  sleep 5
done
wait "$filho" 2>/dev/null; codigo=$?
rm -f "$entrada"
[ "$saida" -eq 124 ] && exit 124
exit "$codigo"
