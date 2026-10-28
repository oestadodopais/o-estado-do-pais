#!/bin/sh
# Pede ao escrivão do lançador que corra os três portões do sítio fora da sandbox e espera pelos códigos
# (13.10.2026, §1.190, a primeira passagem com a aprovação a `never`).
# uso: sh scripts/leituras/portoes-pelo-escrivao.sh <pasta de saída nova> [motor|v2c|v2d|fp2-base|fp2|fp2-contadores|og1-b-navegador]
# Porquê: o navegador das conferências (Playwright) não arranca dentro da sandbox do Codex, e sete conferências
# do `verify` fecham por isso; o `portoes.sh` corre então pelo escrivão, na worktree, com a mesma tranca e os
# mesmos registos. A pasta de saída fica na worktree ou em /tmp. Com `motor`, corre também o `core.gate` da
# worktree do motor que o lançador deu (OEDP_CONFERIR_MOTOR=1). Espera até cinquenta minutos numa só chamada.
# Sai com o código do `portoes.sh` e imprime os códigos lidos dos ficheiros `*.codigo` da pasta de saída.
set -u
saida="${1:?uso: portoes-pelo-escrivao.sh <pasta de saída nova> [motor|v2c|v2d|fp2-base|fp2|fp2-contadores|og1-b-navegador]}"; motor="${2:-}"
case "$motor" in ""|motor|v2c|v2d|fp2-base|fp2|fp2-contadores|og1-b-navegador) ;; *) echo "portoes-pelo-escrivao: perfil desconhecido" >&2; exit 2;; esac
raiz=$(cd "$(git rev-parse --show-toplevel)" && pwd -P) || exit 2
pasta=/tmp/oedp-escrivao-$(printf '%s' "$raiz" | python3 -c 'import hashlib,sys; print(hashlib.sha1(sys.stdin.read().encode()).hexdigest()[:12])')
batimento="$pasta/batimento"
idade() { python3 -c 'import os,sys,time; print(int(time.time()-os.stat(sys.argv[1]).st_mtime))' "$batimento"; }
if [ ! -f "$batimento" ] || [ "$(idade)" -gt 30 ]; then
  echo "portoes-pelo-escrivao: nenhum escrivão a correr para esta worktree; o lançador arranca-o (construir-codex.sh)" >&2
  exit 3
fi
id=$(date -u +%Y%m%dT%H%M%S)-$$
pedido="$pasta/pedido-$id.json"
python3 - "$pedido" "$saida" "$motor" <<'PY'
import json, os, sys
pedido, saida, motor = sys.argv[1:4]
if motor in ('v2c', 'v2d', 'fp2-base', 'fp2', 'fp2-contadores', 'og1-b-navegador'):
    os.makedirs(saida, exist_ok=False)
    with open(os.path.join(saida, 'selecao.json'), 'w', encoding='utf-8') as f:
        json.dump({'perfil': motor}, f)
with open(pedido + '.tmp', 'w', encoding='utf-8') as f:
    json.dump({'tipo': 'portoes', 'saida': saida, 'motor': motor == 'motor'}, f, ensure_ascii=False)
os.rename(pedido + '.tmp', pedido)
PY
resultado="$pasta/pedido-$id.resultado"
i=0
while [ ! -f "$resultado" ]; do
  i=$((i + 1))
  [ "$i" -le 1560 ] || { echo 'portoes-pelo-escrivao: cinquenta e dois minutos sem resultado' >&2; exit 4; }
  if [ "$(idade)" -gt 30 ]; then echo 'portoes-pelo-escrivao: o escrivão deixou de bater há mais de trinta segundos' >&2; exit 3; fi
  sleep 2
done
python3 - "$resultado" <<'PY'
import json, sys
r = json.load(open(sys.argv[1], encoding='utf-8'))
linha = f"portões código {r['codigo']}"
if r.get('codigos'): linha += ' · ' + ' '.join(f'{k}={v}' for k, v in r['codigos'].items())
if r.get('recusa'): linha += f" · recusado: {r['recusa']}"
print(linha)
for l in (r.get('saida') or '').strip().splitlines()[-6:]:
    print('  ' + l)
sys.exit(r['codigo'])
PY
