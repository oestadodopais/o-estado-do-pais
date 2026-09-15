#!/bin/bash
# Descarrega um endereço e regista: código HTTP, tamanho, data de leitura (UTC), sha256.
# Uso: baixar.sh <url> <nome-do-ficheiro>
BASE="/private/tmp/claude-501/-Users-nunosantos-Instruments-OEstadoDoPais/acc3ef93-a6d6-4c30-b8d4-b7a5132dcfe5/scratchpad/evora-2027"
DEST="$BASE/fontes"
REG="$BASE/registo-descargas.tsv"
URL="$1"; NOME="$2"
if [ ! -f "$REG" ]; then
  printf 'nome\turl\thttp\ttipo\ttamanho_bytes\tlido_em_utc\tsha256\turl_final\n' > "$REG"
fi
LIDO=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
OUT=$(curl -sSL -A 'OEstadoDoPais/leitura (lugar de direção)' \
   -w '%{http_code}\t%{content_type}\t%{size_download}\t%{url_effective}' \
   -o "$DEST/$NOME" "$URL" 2>"$DEST/$NOME.err")
CODE=$(printf '%s' "$OUT" | cut -f1)
TIPO=$(printf '%s' "$OUT" | cut -f2)
TAM=$(printf '%s' "$OUT" | cut -f3)
FINAL=$(printf '%s' "$OUT" | cut -f4)
if [ -f "$DEST/$NOME" ]; then SHA=$(shasum -a 256 "$DEST/$NOME" | cut -d' ' -f1); else SHA="(sem ficheiro)"; fi
printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$NOME" "$URL" "$CODE" "$TIPO" "$TAM" "$LIDO" "$SHA" "$FINAL" >> "$REG"
printf 'nome=%s\nhttp=%s\ntipo=%s\ntamanho=%s\nlido_em=%s\nsha256=%s\nurl_final=%s\n' "$NOME" "$CODE" "$TIPO" "$TAM" "$LIDO" "$SHA" "$FINAL"
if [ -s "$DEST/$NOME.err" ]; then echo "--- erro:"; cat "$DEST/$NOME.err"; else rm -f "$DEST/$NOME.err"; fi
