#!/bin/sh
# Pede ao escrivão do lançador que capture páginas fora da sandbox com o guião comum das capturas e espera
# pelo resultado (13.10.2026, §1.190): o navegador não arranca dentro da sandbox do Codex.
# uso: sh scripts/leituras/capturar-pelo-escrivao.sh <pedido.json> <pasta de saída nova>
# O pedido tem a forma que `scripts/leituras/captar.mjs` lê (a cabeça completa do `dist/` construído, as páginas
# com as duas rotas locais e os recortes); o pedido e a pasta ficam na worktree ou em /tmp; o `dist/` é o da
# worktree, construído pelos portões (corre-os primeiro). Espera até vinte minutos numa só chamada.
set -u
pedido_json="${1:?uso: capturar-pelo-escrivao.sh <pedido.json> <pasta de saída nova>}"; saida="${2:?pasta de saída}"
raiz=$(cd "$(git rev-parse --show-toplevel)" && pwd -P) || exit 2
pasta=/tmp/oedp-escrivao-$(printf '%s' "$raiz" | python3 -c 'import hashlib,sys; print(hashlib.sha1(sys.stdin.read().encode()).hexdigest()[:12])')
batimento="$pasta/batimento"
idade() { python3 -c 'import os,sys,time; print(int(time.time()-os.stat(sys.argv[1]).st_mtime))' "$batimento"; }
if [ ! -f "$batimento" ] || [ "$(idade)" -gt 30 ]; then
  echo "capturar-pelo-escrivao: nenhum escrivão a correr para esta worktree; o lançador arranca-o" >&2
  exit 3
fi
id=$(date -u +%Y%m%dT%H%M%S)-$$
pedido="$pasta/pedido-$id.json"
python3 - "$pedido" "$pedido_json" "$saida" <<'PY'
import json, os, sys
pedido, pedido_json, saida = sys.argv[1:4]
with open(pedido + '.tmp', 'w', encoding='utf-8') as f:
    json.dump({'tipo': 'capturas', 'pedido': pedido_json, 'saida': saida}, f, ensure_ascii=False)
os.rename(pedido + '.tmp', pedido)
PY
resultado="$pasta/pedido-$id.resultado"
i=0
while [ ! -f "$resultado" ]; do
  i=$((i + 1))
  [ "$i" -le 660 ] || { echo 'capturar-pelo-escrivao: vinte e dois minutos sem resultado' >&2; exit 4; }
  if [ "$(idade)" -gt 30 ]; then echo 'capturar-pelo-escrivao: o escrivão deixou de bater há mais de trinta segundos' >&2; exit 3; fi
  sleep 2
done
python3 - "$resultado" <<'PY'
import json, sys
r = json.load(open(sys.argv[1], encoding='utf-8'))
linha = f"capturas código {r['codigo']}"
if r.get('recusa'): linha += f" · recusado: {r['recusa']}"
print(linha)
for l in (r.get('saida') or '').strip().splitlines()[-8:]:
    print('  ' + l[:400])
sys.exit(r['codigo'])
PY
