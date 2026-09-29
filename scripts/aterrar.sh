#!/bin/zsh
# A ATERRAGEM DE UM RAMO VERDE EM main (DECISIONS.md §1.139, 29.09.2026).
#
# Porquê: a 29.09.2026 a verificação das permissões do Claude Code recusou duas
# vezes ao lugar de direção o guião da aterragem, que vivia no scratchpad de cada
# sessão, e o diretor correu-o à mão. O guião passa a ser do repositório, lido e
# versionado como qualquer código, para o diretor o poder autorizar uma vez nas
# definições do Claude Code, com uma regra só para ele, e as aterragens de rotina
# deixarem de precisar de uma pessoa (§1.134).
#
# O que faz, por esta ordem, e para no primeiro passo que falhar, sem nada a meio
# no ar (o sítio publicado continua publicado):
#   1. confere antes de mexer: a árvore principal está em main e sem mudanças por
#      registar; o ramo existe e a sua cabeça é a pedida; main e origin/main estão
#      dentro do ramo (a fusão é um avanço rápido); a verificação «portao» do
#      GitHub passou nessa cabeça; e, havendo ramo do motor, o master e o
#      origin/master do motor estão dentro dele;
#   2. avança main e publica-o (o push no seu próprio comando; a proteção de main
#      exige a mesma verificação verde);
#   3. avança o master do motor e publica-o, quando há ramo do motor;
#   4. vigia a Vercel, um pedido por minuto, até ver o lançamento de produção
#      pronto com esta cabeça no /version.json;
#   5. corre o npm run verify:deploy;
#   6. vigia a corrida de main no GitHub até ela acabar.
#
# Nenhum caminho desta máquina fica escrito aqui: a árvore principal lê-se do Git,
# o motor lê-se de OEDP_MOTOR ou de $HOME/Instruments/ResearchHub, e os registos
# vão para uma pasta temporária nova, que o guião diz no começo.
#
# uso: zsh scripts/aterrar.sh [--ensaio] <ramo do sítio> <cabeça curta> [<ramo do motor>|-]
#      --ensaio corre só as conferências do passo 1 e diz o que faria.

set -u
ENSAIO=0
if [ "${1:-}" = "--ensaio" ]; then ENSAIO=1; shift; fi
if [ $# -lt 2 ]; then
  echo "uso: zsh scripts/aterrar.sh [--ensaio] <ramo do sítio> <cabeça curta> [<ramo do motor>|-]" >&2
  exit 2
fi
RAMO="$1"; CAB="$2"; RAMO_MOTOR="${3:--}"
REPO=oestadodopais/o-estado-do-pais
AQUI="$(cd "$(dirname "$0")" && pwd)"
SITIO="$(git -C "$AQUI" worktree list --porcelain | awk '/^worktree /{print substr($0, 10); exit}')"
MOTOR="${OEDP_MOTOR:-$HOME/Instruments/ResearchHub}"
LOGS="$(mktemp -d "${TMPDIR:-/tmp}/oedp-aterragem.XXXXXX")"
agora() { date -u +%H:%M:%S; }
para() { echo "PAROU: $2 (código $1) · registos em $LOGS"; exit "$1"; }

# ------------------------------------------------------------ 1. as conferências
echo "== conferências às $(agora) UTC · registos em $LOGS"
[ -n "$SITIO" ] && [ -d "$SITIO" ] || para 10 "não encontrei a árvore principal do sítio"
[ "$(git -C "$SITIO" branch --show-current)" = "main" ] || para 11 "a árvore principal não está em main"
git -C "$SITIO" diff --quiet && git -C "$SITIO" diff --cached --quiet || para 12 "a árvore principal tem mudanças por registar"
git -C "$SITIO" fetch origin > "$LOGS/fetch.log" 2>&1 || para 13 "o fetch do sítio falhou"
CHEIA="$(git -C "$SITIO" rev-parse --verify --quiet "$RAMO^{commit}")" || para 14 "o ramo $RAMO não existe"
case "$CHEIA" in
  "$CAB"*) ;;
  *) para 15 "a cabeça de $RAMO é ${CHEIA:0:8}, e não $CAB" ;;
esac
git -C "$SITIO" merge-base --is-ancestor main "$CHEIA" || para 16 "main não está dentro de $RAMO: a fusão não seria um avanço rápido"
git -C "$SITIO" merge-base --is-ancestor origin/main "$CHEIA" || para 17 "origin/main não está dentro de $RAMO"
gh api "repos/$REPO/commits/$CHEIA/check-runs" > "$LOGS/portao.json" 2> "$LOGS/portao.err" \
  || para 18 "a verificação portao da cabeça ${CHEIA:0:8} não se leu no GitHub (a cabeça foi publicada num ramo?)"
PORTAO="$(python3 -c 'import json,sys
r=[x for x in json.load(open(sys.argv[1])).get("check_runs",[]) if x.get("name")=="portao"]
r.sort(key=lambda x: x.get("completed_at") or "")
print((r[-1].get("conclusion") or "") if r else "")' "$LOGS/portao.json")"
[ "$PORTAO" = "success" ] || para 18 "a verificação portao da cabeça ${CHEIA:0:8} não está verde (diz «${PORTAO:-nada}»)"
if [ "$RAMO_MOTOR" != "-" ]; then
  [ -d "$MOTOR" ] || para 20 "não encontrei o motor (OEDP_MOTOR ou a pasta de sempre)"
  [ "$(git -C "$MOTOR" branch --show-current)" = "master" ] || para 21 "a árvore do motor não está em master"
  git -C "$MOTOR" fetch origin > "$LOGS/motor-fetch.log" 2>&1 || para 22 "o fetch do motor falhou"
  git -C "$MOTOR" rev-parse --verify --quiet "$RAMO_MOTOR^{commit}" > /dev/null || para 23 "o ramo do motor $RAMO_MOTOR não existe"
  git -C "$MOTOR" merge-base --is-ancestor master "$RAMO_MOTOR" || para 24 "o master do motor não está dentro de $RAMO_MOTOR"
  git -C "$MOTOR" merge-base --is-ancestor origin/master "$RAMO_MOTOR" || para 25 "o origin/master do motor não está dentro de $RAMO_MOTOR"
  echo "   motor: master e origin/master dentro de $RAMO_MOTOR"
fi
echo "   sítio: main e origin/main dentro de $RAMO (${CHEIA:0:8}); portao verde nessa cabeça"
if [ $ENSAIO -eq 1 ]; then
  echo "ENSAIO: tudo conferido; não se avançou nem se publicou nada"
  exit 0
fi

# ------------------------------------------------------ 2. e 3. avançar e publicar
echo "== fusão às $(agora) UTC"
git -C "$SITIO" merge --ff-only "$CHEIA" > "$LOGS/sitio-merge.log" 2>&1 || para 30 "main não avançou"
echo "== push de main às $(agora) UTC"
git -C "$SITIO" push origin main > "$LOGS/sitio-push.log" 2>&1 || para 31 "o push de main falhou"
tail -1 "$LOGS/sitio-push.log"
if [ "$RAMO_MOTOR" != "-" ]; then
  echo "== motor às $(agora) UTC"
  git -C "$MOTOR" merge --ff-only "$RAMO_MOTOR" > "$LOGS/motor-merge.log" 2>&1 || para 32 "o master do motor não avançou"
  git -C "$MOTOR" push origin master > "$LOGS/motor-push.log" 2>&1 || para 33 "o push do motor falhou"
  tail -1 "$LOGS/motor-push.log"
fi

# ------------------------------------------------------------- 4. vigiar a Vercel
echo "== vigia da Vercel desde $(agora) UTC"
CURTA="${CHEIA:0:8}"; PRONTO=""
for i in {1..45}; do
  (cd "$SITIO" && vercel ls --yes) > "$LOGS/vercel-ls.txt" 2>&1
  LINHA="$(grep -m1 -E 'Production' "$LOGS/vercel-ls.txt")"
  echo "$(agora) pedido $i: ${LINHA:0:110}"
  if echo "$LINHA" | grep -q "Ready"; then
    NO_AR="$(curl -s https://xn--oestadodopas-2fb.pt/version.json | python3 -c 'import sys,json;print(json.load(sys.stdin).get("commit","")[:8])' 2>/dev/null)"
    echo "   version.json no ar: $NO_AR"
    if [ "$NO_AR" = "$CURTA" ]; then PRONTO=sim; break; fi
  fi
  sleep 60
done
[ "$PRONTO" = "sim" ] || para 40 "a Vercel não mostrou $CURTA pronto em 45 pedidos"

# --------------------------------------------------------- 5. o verify:deploy
echo "== verify:deploy às $(agora) UTC"
(cd "$SITIO" && npm run verify:deploy) > "$LOGS/verify-deploy.log" 2>&1
VD=$?
echo "   verify:deploy código $VD"
[ $VD -eq 0 ] || para 41 "o verify:deploy falhou"

# ------------------------------------------------------ 6. a corrida de main
echo "== corrida de main às $(agora) UTC"
ID=""
for i in {1..10}; do
  ID="$(gh run list --repo "$REPO" --branch main --limit 5 --json databaseId,headSha --jq ".[] | select(.headSha == \"$CHEIA\") | .databaseId" | head -1)"
  [ -n "$ID" ] && break
  sleep 30
done
[ -n "$ID" ] || para 42 "não apareceu a corrida de main para $CURTA"
gh run watch "$ID" --repo "$REPO" --interval 60 --exit-status > "$LOGS/corrida-main.log" 2>&1
C=$?
gh run view "$ID" --repo "$REPO" --json databaseId,status,conclusion,updatedAt --jq '"   corrida \(.databaseId) \(.status)/\(.conclusion) \(.updatedAt)"'
[ $C -eq 0 ] || para 43 "a corrida de main não acabou verde"
echo "ATERROU: $CURTA no ar, verify:deploy verde, corrida de main verde · $(agora) UTC"
