#!/bin/sh
# Retoma uma sessão do Codex construtor na sua worktree, com o modelo e o raciocínio fixados (M35: uma sessão
# parada retoma-se pelo seu id; o C1 retomou-se seis vezes, o F2.2b quatro), com o escrivão dos commits ao lado
# e a medição dos pontos no fim, como em construir-codex.sh (M79, M80, M81, 13.10.2026, §1.190).
# uso: [CODEX_RACIOCINIO=high] retomar-codex.sh <worktree> <sessão> <prompt.md> <resposta fora do ramo> [<outra pasta com escrita>...]
# As outras pastas entram em `--add-dir`, pela razão dita em construir-codex.sh (M43). A retoma é também o ensaio
# da alavanca 3 do plano de 13.10: uma passagem de correção que retoma a sessão em vez de arrancar a frio.
set -u
worktree="$1"; sessao="$2"; prompt="$3"; resposta="$4"; shift 4
case "$worktree" in /*) ;; *) echo "a worktree passa-se em caminho absoluto (recebi: ${worktree})" >&2; exit 9;; esac
extras=""
for pasta in "$@"; do
  case "$pasta" in /*) ;; *) echo "as outras pastas passam-se em caminho absoluto (recebi: ${pasta})" >&2; exit 9;; esac
  extras="$extras --add-dir $pasta"
done
modelo="${CODEX_CONSTRUTOR:-gpt-6-astra}"
raciocinio="${CODEX_RACIOCINIO:-xhigh}"
case "$raciocinio" in low|medium|high|xhigh) ;; *) echo "CODEX_RACIOCINIO tem de ser low, medium, high ou xhigh (recebi: ${raciocinio})" >&2; exit 9;; esac
aqui="$(cd "$(dirname "$0")" && pwd -P)" || exit 9
comum="$aqui/PROMPT-construtor-comum.md"
[ -f "$comum" ] || { echo "falta o prompt comum dos construtores: $comum" >&2; exit 9; }
[ -f "$prompt" ] || { echo "falta o prompt da passagem: $prompt" >&2; exit 9; }
cd "$worktree" || exit 9
# A rede e as dependências, como em construir-codex.sh (13.10.2026): CODEX_REDE=1 liga a rede da sandbox, e a
# worktree tem de ter o seu próprio node_modules (nunca uma ligação para fora).
rede=""
if [ "${CODEX_REDE:-0}" = 1 ]; then rede="-c sandbox_workspace_write.network_access=true"; fi
if [ -L "$worktree/node_modules" ]; then echo "node_modules é uma ligação para fora da worktree; corre npm ci dentro dela antes de lançar" >&2; exit 9; fi
[ -d "$worktree/node_modules" ] || [ ! -f "$worktree/package.json" ] || { echo "falta node_modules na worktree; corre npm ci nela antes de lançar" >&2; exit 9; }
base="${resposta%.md}"
inicio="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
python3 "$aqui/pontos.py" --antes
python3 "$aqui/escrivao.py" "$worktree" "$@" > "$base.escrivao.log" 2>&1 &
escrivao=$!
trap 'kill "$escrivao" 2>/dev/null' EXIT INT TERM
sleep 1
kill -0 "$escrivao" 2>/dev/null || { echo "o escrivão não arrancou: $(tail -3 "$base.escrivao.log")" >&2; exit 9; }
echo "INICIO $inicio retoma sessão=$sessao modelo=$modelo raciocínio=$raciocinio escrivao=pid $escrivao"
# shellcheck disable=SC2086
cat "$comum" "$prompt" | codex exec -m "$modelo" -c "model_reasoning_effort=\"$raciocinio\"" -c 'approval_policy="never"' -s workspace-write $rede -C "$worktree" $extras --skip-git-repo-check --color never -o "$resposta" resume "$sessao" -
codigo=$?
fim="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
kill "$escrivao" 2>/dev/null
wait "$escrivao" 2>/dev/null
trap - EXIT INT TERM
echo "FIM exit=$codigo $fim"
sleep 2
python3 "$aqui/pontos.py" --inicio "$inicio" --fim "$fim" --worktree "$worktree" --json "$base.pontos.json"
exit "$codigo"
