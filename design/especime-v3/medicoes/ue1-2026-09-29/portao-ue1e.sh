#!/bin/bash
# UE1e: um portão da cabeça (build, verify ou typecheck), depois de esperar que nenhuma outra construção corra.
# É o `portao-ue1d.sh` com a pasta `portoes/ue1e/`; o código é o mesmo, linha a linha.
#
# Uso, da raiz da worktree do sítio, um portão por comando:
#   bash design/especime-v3/medicoes/ue1-2026-09-29/portao-ue1e.sh build
#   bash design/especime-v3/medicoes/ue1-2026-09-29/portao-ue1e.sh verify
#   bash design/especime-v3/medicoes/ue1-2026-09-29/portao-ue1e.sh typecheck
#   bash design/especime-v3/medicoes/ue1-2026-09-29/portao-ue1e.sh --ensaio   (só diz por quem esperaria)
#
# A ESPERA. Enquanto houver um processo cuja linha de comando diga «astro build», «npm run build» ou
# «npm run verify», espera 15 s e volta a olhar. O padrão escreve uma letra de cada cadeia entre parênteses
# retos, e este guião corre como «bash <este ficheiro> <portão>», uma linha que não tem nenhuma das três
# cadeias. (O `pgrep` do macOS também não conta o próprio processo nem os seus antepassados, diz o manual,
# na opção `-a`.)
#
# O que se escreve em `portoes/ue1e/`: <portão>.cabeca (a cabeça antes de correr), .inicio, .log, .codigo
# (o código de saída do npm, escrito logo a seguir, sem pipe), .fim; e uma linha em `espera.log` com o tempo
# de espera e o género dos processos por que se esperou (só a cadeia, nunca a linha de comando, que leva
# caminhos da máquina).
set -u
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)" || exit 2
P=design/especime-v3/medicoes/ue1-2026-09-29/portoes/ue1e
PADRAO='astro [b]uild|npm run [v]erify|npm run [b]uild'

outros() {
  # Os processos que casam com o padrão, menos este guião (por segurança: a sua linha não casa).
  pgrep -f "$PADRAO" | while read -r p; do [ "$p" != "$$" ] && echo "$p"; done
}
generos() {
  for p in $1; do
    linha=$(ps -o command= -p "$p" 2>/dev/null)
    case "$linha" in
      *"npm run verify"*) echo "npm run verify" ;;
      *"npm run build"*) echo "npm run build" ;;
      *"astro build"*) echo "astro build" ;;
    esac
  done | sort | uniq -c | awk '{ n=$1; $1=""; sub(/^ /, ""); printf "%s%d × %s", (NR>1 ? ", " : ""), n, $0 }'
}

if [ "${1:-}" = "--ensaio" ]; then
  o=$(outros)
  echo "ensaio: $(echo "$o" | grep -c . ) processo(s) de construção a correr${o:+ ($(generos "$o"))}"
  exit 0
fi

portao="${1:-}"
case "$portao" in build|verify|typecheck) ;; *) echo "portão desconhecido: «$portao»" >&2; exit 2 ;; esac
mkdir -p "$P"
n=0
vistos=""
while true; do
  o=$(outros)
  [ -z "$o" ] && break
  [ -z "$vistos" ] && vistos=$(generos "$o")
  n=$((n + 1))
  sleep 15
done
echo "$portao: esperei $((n * 15)) s por outra construção${vistos:+ ($vistos)}; comecei às $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$P/espera.log"
git rev-parse HEAD > "$P/$portao.cabeca"
date -u +%Y-%m-%dT%H:%M:%SZ > "$P/$portao.inicio"
npm run "$portao" > "$P/$portao.log" 2>&1
echo $? > "$P/$portao.codigo"
date -u +%Y-%m-%dT%H:%M:%SZ > "$P/$portao.fim"
