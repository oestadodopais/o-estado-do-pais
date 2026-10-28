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
# RH1: a máquina recebe a mesma lista privada do CI; nunca a imprime.
if [ "${PRIVACIDADE_PROIBIDOS+x}" != x ] && [ "${GITHUB_ACTIONS+x}" != x ] && [ "${CI+x}" != x ] && [ -f "$HOME/.config/oestadodopais/proibidos.txt" ]; then
  PRIVACIDADE_PROIBIDOS=$(cat "$HOME/.config/oestadodopais/proibidos.txt") || exit 9
  export PRIVACIDADE_PROIBIDOS
fi
W="$1"; O="$2"
case "$W" in /*) ;; *) echo 'portoes: a worktree tem de ser absoluta' >&2; exit 9;; esac
cd "$W" || exit 9
# M62 / JD1-c: conferir antes de criar registos dentro da própria árvore.
[ -z "$(git status --porcelain --untracked-files=all)" ] || {
  echo 'portoes: árvore suja; registe as mudanças antes de conferir a cabeça do código' >&2
  exit 9
}
if [ "${OEDP_CONFERIR_MOTOR:-0}" = 1 ]; then
  [ -n "${RESEARCHHUB_DIR:-}" ] && [ -d "$RESEARCHHUB_DIR" ] || { echo 'portoes: falta a pasta do motor' >&2; exit 9; }
  [ -z "$(git -C "$RESEARCHHUB_DIR" status --porcelain --untracked-files=all)" ] || {
    echo 'portoes: árvore do motor suja; nenhum portão correu' >&2; exit 9
  }
fi
mkdir -p "$O" || exit 9
O="$(cd "$O" && pwd)"
# A tranca vive em /tmp desde 13.10.2026 (M79, §1.190): dentro do Git comum, fora da raiz gravável da
# worktree, cada corrida do construtor pedia uma escalada à sandbox do Codex, e cada escalada custava uma
# revisão automática inteira. Continua a ser uma só por máquina: todas as worktrees partilham o mesmo /tmp.
# OEDP_TRANCA aponta-a para outro sítio só no ensaio (tests/leituras/portoes.py), que prova a recusa da
# escrita, a tranca ocupada e a tranca caducada sem tocar na tranca real da máquina.
tranca="${OEDP_TRANCA:-/tmp/oedp-construcao.lock}"
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
# V2-c e V2-d: seleções explícitas pedidas ao escrivão; a corrida completa mantém-se por omissão.
# O recibo só escolhe este perfil fechado, nunca comandos arbitrários.
portoes="build verify typecheck"
if [ -f "$O/selecao.json" ]; then
  perfil=$(python3 -c 'import json,sys; r=json.load(open(sys.argv[1])); assert r in ({"perfil":"v2c"}, {"perfil":"v2d"}, {"perfil":"fp2-base"}, {"perfil":"fp2"}, {"perfil":"fp2-contadores"}, {"perfil":"og1-b-navegador"}); print(r["perfil"])' "$O/selecao.json") || exit 9
  [ "${OEDP_CONFERIR_MOTOR:-0}" = 0 ] || exit 9
  portoes="build check:discussao check:navegacao check:primeira check:cabeca gate:html check:alvos check:css check:frases-compostas check:lugar"
  if [ "$perfil" = v2d ]; then
    portoes="build check:discussao check:palavras check:frases-compostas gate:html check:alvos check:css check:lugar check:series typecheck"
  fi
fi
# FP2: seleções fechadas, sem verify; a base usa a construção já medida pelo construtor.
if [ "${perfil:-}" = og1-b-navegador ]; then
  portoes="check:frases-compostas check:primeira"
elif [ "${perfil:-}" = fp2-base ]; then
  portoes="check:sobreposicao"
  export OEDP_SOBREPOSICAO_JSON="$O/base.json"
elif [ "${perfil:-}" = fp2-contadores ]; then
  portoes="check:sobreposicao-contadores"
elif [ "${perfil:-}" = fp2 ]; then
  portoes="build check:discussao check:primeira check:css check:frases-compostas check:lugar check:alvos check:sobreposicao check:sobreposicao-contadores check:sobreposicao-planta typecheck"
  export OEDP_SOBREPOSICAO_JSON="$O/sobreposicao.json"
fi
for g in $portoes; do
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
printf 'limpa\n' > "$O/arvore.inicio"
for g in $portoes; do
  date -u +%Y-%m-%dT%H:%M:%SZ > "$O/$g.inicio"
  if [ -n "${perfil:-}" ] && [ -f "$O/build.codigo" ] && [ "$g" != build ] && [ "$(cat "$O/build.codigo")" -ne 0 ]; then
    echo 'não correu: a construção não ficou verde' > "$O/$g.log"
    codigo=125
  elif [ "$g" = check:sobreposicao-contadores ]; then
    rotas=$(find dist/estudos dist/en/studies -name index.html -exec grep -l 'class="texto-artigo' {} + | sed 's@^dist@@;s@/index.html$@/@' | sort | paste -sd, -)
    if [ -z "$rotas" ]; then
      echo 'FP2: nenhuma página com texto-artigo' > "$O/$g.log"; codigo=2
    else
      correr "$O/$g.log" npm run check:sobreposicao -- --rotas "$rotas" --json "$O/sobreposicao-contadores.json"
      codigo=$?
    fi
  elif [ "$g" = check:sobreposicao-planta ]; then
    correr "$O/$g.log" npm run check:sobreposicao -- --planta --rotas /estudos/a-casa-em-portugal-e-na-europa,/en/studies/a-casa-em-portugal-e-na-europa --json "$O/sobreposicao-planta.json"
    codigo=$?
  elif [ "$g" = verify ]; then
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
if [ "${OEDP_CONFERIR_MOTOR:-0}" = 1 ]; then
  git -C "$RESEARCHHUB_DIR" rev-parse HEAD > "$O/motor.cabeca"
  date -u +%Y-%m-%dT%H:%M:%SZ > "$O/motor.inicio"
  cd "$RESEARCHHUB_DIR" || exit 9
  correr "$O/motor.log" python3 -m core.gate
  codigo=$?
  echo "$codigo" > "$O/motor.codigo"
  date -u +%Y-%m-%dT%H:%M:%SZ > "$O/motor.fim"
  git rev-parse HEAD > "$O/motor.cabeca.fim"
  git status --short > "$O/motor.estado.fim"
  cd "$W" || exit 9
  [ "$codigo" -le 128 ] || exit "$codigo"
fi
git rev-parse HEAD > "$O/cabeca.fim"
git status --short > "$O/estado.fim"
echo "FIM $(cut -c1-8 "$O/cabeca")"
for g in $portoes; do
  echo "$g=$(cat "$O/$g.codigo")"
done
for g in $portoes; do
  esperado=0
  [ "$g" != check:sobreposicao-planta ] || esperado=1
  [ "$(cat "$O/$g.codigo")" -eq "$esperado" ] || exit 1
done
if [ "${OEDP_CONFERIR_MOTOR:-0}" = 1 ]; then
  [ "$(cat "$O/motor.codigo")" -eq 0 ] || exit 1
fi
