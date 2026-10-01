#!/bin/sh
# Um comando com a tranca da máquina (passagem E1c, 01.10.2026): a mesma tranca, as mesmas regras de espera e
# de tranca velha que `scripts/leituras/portoes.sh` (M46), para as corridas parciais do bloco (uma construção
# sozinha, uma conferência sobre o dist/) não correrem ao mesmo tempo que os portões de outra worktree.
# uso: com-tranca.sh <worktree> <ficheiro de registo> <comando>...
# O código do comando escreve-se em <ficheiro de registo>.codigo depois de ele acabar.
set -u
W="$1"; L="$2"; shift 2
cd "$W" || exit 9
comum="$(git rev-parse --path-format=absolute --git-common-dir 2>/dev/null || git rev-parse --git-common-dir)"
case "$comum" in /*) ;; *) comum="$W/$comum";; esac
tranca="$comum/oedp-construcao.lock"
idade() { agora=$(date +%s); m=$(stat -f %m "$1" 2>/dev/null || stat -c %Y "$1" 2>/dev/null || echo "$agora"); echo $((agora - m)); }
esperou=0
while [ -f "$tranca" ]; do
  if [ "$(idade "$tranca")" -gt 2400 ]; then echo "tranca com mais de quarenta minutos ($(cat "$tranca")); ignora-se" >&2; break; fi
  [ "$esperou" -eq 0 ] && echo "à espera da tranca da máquina: $(cat "$tranca")" >&2
  esperou=1; sleep 10
done
printf '%s %s pid=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$W" "$$" > "$tranca"
trap 'rm -f "$tranca"' EXIT
trap 'rm -f "$tranca"; exit 130' INT TERM
"$@" > "$L" 2>&1
echo $? > "$L.codigo"
