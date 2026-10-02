#!/bin/sh
# A prova de caminho da função das sugestões numa pré-visualização da Vercel. uso: sh prova-do-caminho.sh <url-base> <pasta-de-saída>
# Grava, por pedido, o estado, o `location`, o `x-vercel-id` e o corpo (cortado), sem nenhum endereço IP.
B="$1"; O="$2"; mkdir -p "$O"; H=$(date -u +%H:%M:%S)
req() { nome="$1"; shift; curl -s -o "$O/$nome.corpo" -D "$O/$nome.cabecalhos" -w "%{http_code}" "$@" > "$O/$nome.estado"; printf '%s · estado %s · location %s · x-vercel-id %s\n' "$nome" "$(cat "$O/$nome.estado")" "$(grep -i '^location:' "$O/$nome.cabecalhos" | tr -d '\r' | cut -d' ' -f2-)" "$(grep -i '^x-vercel-id:' "$O/$nome.cabecalhos" | tr -d '\r' | cut -d' ' -f2-)"; }
req 01-get "$B/api/sugestoes"
req 02-armadilha -X POST --data-urlencode "lingua=pt" --data-urlencode "sitio=robot" --data-urlencode "procurou=ensaio armadilha $H" "$B/api/sugestoes"
req 03-vazia -X POST --data-urlencode "lingua=pt" --data-urlencode "procurou=   " "$B/api/sugestoes"
req 04-boa-pt -X POST -H "Referer: $B/sugestoes/?de=%2Flugares%2Fevora%2F" --data-urlencode "lingua=pt" --data-urlencode "procurou=ensaio do lugar de direção S1 $H" --data-urlencode "estudo=" --data-urlencode "outro=" --data-urlencode "contacto=" "$B/api/sugestoes"
req 05-boa-en -X POST -H "Referer: $B/en/suggestions/?de=%2Fen%2F" --data-urlencode "lingua=en" --data-urlencode "estudo=S1 rehearsal (English) $H" "$B/api/sugestoes"
for i in 1 2 3 4 5 6; do req "06-limite-$i" -X POST --data-urlencode "lingua=pt" --data-urlencode "outro=ensaio do limite $i $H" "$B/api/sugestoes"; done
req 07-pagina-sugestoes "$B/sugestoes/"
