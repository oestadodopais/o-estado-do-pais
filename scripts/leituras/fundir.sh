#!/bin/sh
# Pede ao escrivão a fusão de main ou master nesta worktree.
# Um conflito aborta a fusão e devolve os ficheiros em conflito.
set -u
[ "$#" -eq 1 ] || { echo 'uso: fundir.sh <main|master>' >&2; exit 2; }
ramo="$1"
case "$ramo" in main|master) ;; *) echo 'fundir: só aceita main ou master' >&2; exit 2;; esac
raiz=$(cd "$(git rev-parse --show-toplevel)" && pwd -P) || exit 2
pasta=/tmp/oedp-escrivao-$(printf '%s' "$raiz" | python3 -c 'import hashlib,sys; print(hashlib.sha1(sys.stdin.read().encode()).hexdigest()[:12])')
batimento="$pasta/batimento"
idade() { python3 -c 'import os,sys,time; print(int(time.time()-os.stat(sys.argv[1]).st_mtime))' "$batimento"; }
if [ ! -f "$batimento" ] || [ "$(idade)" -gt 30 ]; then
  echo "fundir: nenhum escrivão a correr para esta worktree; o lançador arranca-o (construir-codex.sh)" >&2
  exit 3
fi
id=$(date -u +%Y%m%dT%H%M%S)-$$
pedido="$pasta/pedido-$id.json"
python3 - "$pedido" "$ramo" <<'PY'
import json, os, sys
pedido, ramo = sys.argv[1:3]
with open(pedido + '.tmp', 'w', encoding='utf-8') as f:
    json.dump({'tipo': 'fundir', 'ramo': ramo}, f, ensure_ascii=False)
os.rename(pedido + '.tmp', pedido)
PY
resultado="$pasta/pedido-$id.resultado"
i=0
while [ ! -f "$resultado" ]; do
  i=$((i + 1))
  [ "$i" -le 960 ] || { echo 'fundir: trinta e dois minutos sem resultado' >&2; exit 4; }
  if [ "$(idade)" -gt 30 ]; then echo 'fundir: o escrivão deixou de bater há mais de trinta segundos' >&2; exit 3; fi
  sleep 2
done
python3 - "$resultado" <<'PY'
import json, sys
r = json.load(open(sys.argv[1], encoding='utf-8'))
linha = f"fusão código {r['codigo']}"
if r.get('cabeca'): linha += ' · cabeça ' + r['cabeca']
if r.get('recusa'): linha += f" · recusado: {r['recusa']}"
print(linha)
for ficheiro in r.get('conflitos', []): print('conflito: ' + ficheiro)
for l in (r.get('saida') or '').strip().splitlines()[-6:]:
    print('  ' + l)
sys.exit(r['codigo'])
PY
