#!/bin/sh
# Os três portões da cabeça, pela tranca comum e pela mesma união conferida do CI.
# M-A: o build verde paga os passos repetidos; o verify corre os restantes em
# paralelo e prova a união, a imutabilidade e a cabeça. Um build vermelho nunca
# paga conferências. Cada processo acaba antes de se escrever o seu código.
# Uso: sh scripts/leituras/portoes.sh <worktree absoluta> <pasta de saída nova>
# RESEARCHHUB_DIR passa inteiro aos filhos. OEDP_PARALELO escolhe o número de
# processos locais (por omissão quatro, o ensaio inicial do CI1). O workflow
# portao.yml e a cadeia completa de npm run verify ficam independentes daqui.
# A criação exclusiva da tranca impede duas worktrees de a tomarem juntas.
# Se a escrita for recusada, para; uma tranca existente espera, sem a fazer
# caducar enquanto uma construção possa estar a usá-la.
set -u
W="$1"; O="$2"
case "$W" in /*) ;; *) echo 'portoes: a worktree tem de ser absoluta' >&2; exit 9;; esac
cd "$W" || exit 9
mkdir -p "$O" || exit 9
O="$(cd "$O" && pwd)"
for g in build verify typecheck; do
  [ ! -e "$O/$g.codigo" ] || { echo 'portoes: a pasta já tem códigos; escolha uma pasta nova' >&2; exit 9; }
done
comum="$(git rev-parse --path-format=absolute --git-common-dir 2>/dev/null || git rev-parse --git-common-dir)" || exit 9
case "$comum" in /*) ;; *) comum="$W/$comum";; esac
tranca="$comum/oedp-construcao.lock"
esperou=0
while ! (set -C; printf '%s %s pid=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$W" "$$" > "$tranca") 2>/dev/null; do
  [ -f "$tranca" ] || { echo 'portoes: não foi possível tomar a tranca; nenhum portão correu' >&2; exit 9; }
  [ "$esperou" -ne 0 ] || echo 'à espera da tranca da máquina' >&2
  esperou=1; sleep 10
done
trap 'rm -f "$tranca"' EXIT
trap 'exit 130' INT TERM
export OEDP_TEMPOS_DIR="$O"
export npm_config_script_shell="$W/scripts/leituras/tempos-shell.py"
git rev-parse HEAD > "$O/cabeca"
for g in build verify typecheck; do
  date -u +%Y-%m-%dT%H:%M:%SZ > "$O/$g.inicio"
  if [ "$g" = verify ]; then
    if [ "$(cat "$O/build.codigo")" -ne 0 ]; then
      echo 'verify: não correu; o build não ficou verde e não pode pagar passos da união' > "$O/verify.log"
      codigo=125
    else
      node scripts/verify-depois-do-build.mjs --paralelo "${OEDP_PARALELO:-4}" --json "$O/verify.json" > "$O/verify.log" 2>&1
      codigo=$?
    fi
  else
    npm run "$g" > "$O/$g.log" 2>&1
    codigo=$?
  fi
  echo "$codigo" > "$O/$g.codigo"
  date -u +%Y-%m-%dT%H:%M:%SZ > "$O/$g.fim"
  if [ "$codigo" -gt 128 ]; then
    node scripts/leituras/tempos.mjs fechar "$O"
    echo "portão $g interrompido; a corrida para aqui" >&2
    exit "$codigo"
  fi
done
node scripts/leituras/tempos.mjs fechar "$O"
git rev-parse HEAD > "$O/cabeca.fim"
git status --short > "$O/estado.fim"
echo "FIM $(cut -c1-8 "$O/cabeca") build=$(cat "$O/build.codigo") verify=$(cat "$O/verify.codigo") typecheck=$(cat "$O/typecheck.codigo")"
for g in build verify typecheck; do
  [ "$(cat "$O/$g.codigo")" -eq 0 ] || exit 1
done
