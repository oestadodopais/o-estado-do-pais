#!/bin/sh
# Pede ao escrivão do lançador um commit nesta worktree e espera pelo resultado (M79, 13.10.2026, §1.190).
# uso: sh scripts/leituras/comitar.sh "<mensagem com os trailers>" <ficheiro> [<ficheiro>...]
#      sh scripts/leituras/comitar.sh -F <ficheiro com a mensagem> <ficheiro> [<ficheiro>...]
# Só ficheiros (nunca pastas, nunca `.`), em caminhos relativos à raiz da worktree em que o guião corre. A
# mensagem traz `Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>` e, no sítio, a linha `Claude-Session:`
# que o prompt da passagem dá. O construtor não corre `git add` nem `git commit`: o `.git` é só de leitura na
# sandbox e cada escalada custava uma revisão automática inteira (escrivao.py diz a medida).
# Espera até trinta minutos (os hooks do motor demoram cerca de dois minutos e meio) numa só chamada, sem
# turnos de sondagem. Sai com o código do commit e imprime a cabeça nova e as últimas linhas da saída do git.
set -u
if [ "${1:-}" = "-F" ]; then
  [ -f "${2:-}" ] || { echo 'comitar: -F precisa do ficheiro da mensagem' >&2; exit 2; }
  mensagem=$(cat "$2"); shift 2
else
  mensagem="${1:-}"; shift
fi
[ $# -ge 1 ] || { echo 'comitar: lista pelo menos um ficheiro (nunca uma pasta, nunca `.`)' >&2; exit 2; }
raiz=$(cd "$(git rev-parse --show-toplevel)" && pwd -P) || exit 2
pasta=/tmp/oedp-escrivao-$(printf '%s' "$raiz" | python3 -c 'import hashlib,sys; print(hashlib.sha1(sys.stdin.read().encode()).hexdigest()[:12])')
batimento="$pasta/batimento"
if [ ! -f "$batimento" ] || [ "$(python3 -c 'import os,sys,time; print(int(time.time()-os.stat(sys.argv[1]).st_mtime))' "$batimento")" -gt 30 ]; then
  echo "comitar: nenhum escrivão a correr para esta worktree; o lançador arranca-o (construir-codex.sh), e à mão corre-se python3 scripts/leituras/escrivao.py <worktree>" >&2
  exit 3
fi
id=$(date -u +%Y%m%dT%H%M%S)-$$
pedido="$pasta/pedido-$id.json"
OEDP_MENSAGEM="$mensagem" python3 - "$pedido" "$raiz" "$@" <<'PY'
import json, os, sys
pedido, raiz, *ficheiros = sys.argv[1:]
with open(pedido + '.tmp', 'w', encoding='utf-8') as f:
    json.dump({'mensagem': os.environ['OEDP_MENSAGEM'], 'ficheiros': ficheiros, 'raiz': raiz}, f, ensure_ascii=False)
os.rename(pedido + '.tmp', pedido)
PY
resultado="$pasta/pedido-$id.resultado"
i=0
while [ ! -f "$resultado" ]; do
  i=$((i + 1))
  [ "$i" -le 900 ] || { echo 'comitar: trinta minutos sem resultado do escrivão' >&2; exit 4; }
  # um escrivão que morreu a meio não deixa o pedido à espera meia hora
  if [ "$(python3 -c 'import os,sys,time; print(int(time.time()-os.stat(sys.argv[1]).st_mtime))' "$batimento")" -gt 30 ]; then
    echo "comitar: o escrivão deixou de bater há mais de trinta segundos; o pedido $pedido fica sem resultado" >&2; exit 3
  fi
  sleep 2
done
python3 - "$resultado" <<'PY'
import json, sys
r = json.load(open(sys.argv[1], encoding='utf-8'))
linha = f"commit código {r['codigo']}"
if r.get('cabeca'): linha += f" · cabeça {r['cabeca']}"
if r.get('recusa'): linha += f" · recusado: {r['recusa']}"
print(linha)
for l in (r.get('saida') or '').strip().splitlines()[-12:]:
    print('  ' + l)
sys.exit(r['codigo'])
PY
