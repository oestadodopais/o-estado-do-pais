#!/bin/sh
# Um comando só, com a tranca da máquina (M46), para as construções e as conferências entre commits do bloco RP3 (copiado do P4).
# A tranca é a mesma de scripts/leituras/portoes.sh: um ficheiro na pasta comum do Git, tomado por quem constrói,
# esperado por quem o encontra, e solto na saída. O código do comando escreve-se num ficheiro depois de o processo
# acabar, e nunca se lê atrás de um «|».
# uso: com-tranca.sh <worktree> <ficheiro de registo> <ficheiro do código> <comando...>
set -u
W="$1"; REG="$2"; COD="$3"; shift 3
cd "$W" || exit 9
comum="$(git rev-parse --path-format=absolute --git-common-dir 2>/dev/null || git rev-parse --git-common-dir)"
case "$comum" in /*) ;; *) comum="$W/$comum";; esac
tranca="$comum/oedp-construcao.lock"
idade() { agora=$(date +%s); m=$(stat -f %m "$1" 2>/dev/null || stat -c %Y "$1" 2>/dev/null || echo "$agora"); echo $((agora - m)); }
esperou=0
while [ -f "$tranca" ]; do
  if [ "$(idade "$tranca")" -gt 2400 ]; then echo "tranca com mais de quarenta minutos; ignora-se" >&2; break; fi
  [ "$esperou" -eq 0 ] && echo "à espera da tranca da máquina" >&2
  esperou=1; sleep 10
done
printf '%s %s pid=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "rp3-com-tranca" "$$" > "$tranca"
trap 'rm -f "$tranca"' EXIT
trap 'rm -f "$tranca"; exit 130' INT TERM
inicio=$(date +%s)
"$@" > "$REG" 2>&1
echo $? > "$COD"
fim=$(date +%s)
echo "$(cat "$COD") $((fim - inicio))s"
