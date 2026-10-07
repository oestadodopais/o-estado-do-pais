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
# Se a escrita for recusada, para; se já existe uma tranca, espera e diz o dono.
# Pela M46, uma tranca com mais de quarenta minutos caduca.
# No fim, mesmo vermelho, agrega os tempos, retira as partes temporárias e
# limpa caminhos locais. Só depois solta a tranca. Uma falha da limpeza sai a 9.
set -u
W="$1"; O="$2"
case "$W" in /*) ;; *) echo 'portoes: a worktree tem de ser absoluta' >&2; exit 9;; esac
cd "$W" || exit 9
mkdir -p "$O" || exit 9
O="$(cd "$O" && pwd)"
comum="$(git rev-parse --path-format=absolute --git-common-dir 2>/dev/null || git rev-parse --git-common-dir)" || exit 9
case "$comum" in /*) ;; *) comum="$W/$comum";; esac
tranca="$comum/oedp-construcao.lock"
idade() {
  python3 -c 'import os,sys,time; print(int(time.time()-os.stat(sys.argv[1]).st_mtime))' "$tranca"
}
esperou=0
while ! (set -C; printf '%s %s pid=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$W" "$$" > "$tranca") 2>/dev/null; do
  [ -f "$tranca" ] || { echo 'portoes: não foi possível tomar a tranca; nenhum portão correu' >&2; exit 9; }
  if [ "$(idade)" -gt 2400 ]; then
    python3 "$W/scripts/leituras/tranca.py" "$tranca" || exit 9
    continue
  fi
  [ "$esperou" -ne 0 ] || echo "à espera da tranca da máquina: $(cat "$tranca")" >&2
  esperou=1; sleep 10
done
dono="$(cat "$tranca")"
filho=""
mediu=0
soltar_a_tranca() {
  resultado=$?
  # A limpeza não pode ser cortada a meio, deixando a tranca órfã.
  trap '' INT TERM
  trap - EXIT
  if [ "$mediu" -eq 1 ]; then
    node "$W/scripts/leituras/tempos.mjs" arrumar "$O" || resultado=9
    python3 "$W/scripts/leituras/limpar-caminhos.py" "$O" --worktree "$W" \
      --motor "${RESEARCHHUB_DIR:-}" --scratchpad "${OEDP_SCRATCHPAD:-}" \
      --temporario "${TMPDIR:-/tmp}" > "$O/limpeza.json" || resultado=9
  fi
  # Uma corrida que exceda a validade não pode soltar a tranca de outra.
  if [ -f "$tranca" ] && [ "$(cat "$tranca")" = "$dono" ]; then
    rm -f "$tranca"
  fi
  exit "$resultado"
}
trap soltar_a_tranca EXIT
interromper() {
  trap '' INT TERM
  if [ -n "$filho" ]; then
    kill -TERM "$filho" 2>/dev/null || :
    wait "$filho" 2>/dev/null || :
  fi
  echo 'portoes: corrida interrompida; os portões seguintes não correm' >&2
  exit 130
}
trap interromper INT TERM
correr() {
  registo="$1"; shift
  python3 "$W/scripts/leituras/processo.py" "$@" > "$registo" 2>&1 &
  filho=$!
  wait "$filho"
  codigo=$?
  filho=""
  return "$codigo"
}
usada=0
for g in build verify typecheck; do
  [ ! -e "$O/$g.codigo" ] || usada=1
done
# As partes denunciam também uma corrida morta antes do primeiro código.
# Retiram-se antes de qualquer novo relógio, mesmo quando a guarda recusa.
if [ -e "$O/.tempos" ]; then
  [ -z "$(find "$O/.tempos" -type f -print -quit)" ] || usada=1
  rm -rf "$O/.tempos" || exit 9
fi
[ "$usada" -eq 0 ] || { echo 'portoes: a pasta já tem códigos ou partes .tempos; escolha uma pasta nova' >&2; exit 9; }
mediu=1
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
      correr "$O/verify.log" node scripts/verify-depois-do-build.mjs --paralelo "${OEDP_PARALELO:-4}" --json "$O/verify.json"
      codigo=$?
    fi
  else
    correr "$O/$g.log" npm run "$g"
    codigo=$?
  fi
  echo "$codigo" > "$O/$g.codigo"
  date -u +%Y-%m-%dT%H:%M:%SZ > "$O/$g.fim"
  if [ "$codigo" -gt 128 ]; then
    echo "portão $g interrompido; a corrida para aqui" >&2
    exit "$codigo"
  fi
done
git rev-parse HEAD > "$O/cabeca.fim"
git status --short > "$O/estado.fim"
echo "FIM $(cut -c1-8 "$O/cabeca") build=$(cat "$O/build.codigo") verify=$(cat "$O/verify.codigo") typecheck=$(cat "$O/typecheck.codigo")"
for g in build verify typecheck; do
  [ "$(cat "$O/$g.codigo")" -eq 0 ] || exit 1
done
