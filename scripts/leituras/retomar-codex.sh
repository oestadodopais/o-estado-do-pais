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
# O ESFORÇO ESCOLHE-SE POR TAREFA, NUNCA POR OMISSÃO (§1.202 regra 6; I270, 27.10.2026): este guião arrancava a xhigh
# quando ninguém dizia nada, ao contrário da regra (high nas construções; xhigh só nas leituras que toquem números).
raciocinio="${CODEX_RACIOCINIO:-}"
[ -n "$raciocinio" ] || { echo "9 CODEX_RACIOCINIO por escolher, pela tarefa: high nas construções e nas correções que toquem réguas, nomes, frases ou dist/; medium no mecânico sem nada disso (Sol 6.1) e nas leituras do Astra; xhigh só nas leituras que toquem números ou fontes; nunca max (§1.202 regra 6)"; exit 9; }
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
sitio="$worktree"
motor="${RESEARCHHUB_DIR:-}"
for pasta in "$worktree" "$@"; do
  if [ -f "$pasta/core/gate.py" ]; then motor="$pasta"; fi
  if [ -f "$pasta/package.json" ]; then sitio="$pasta"; fi
done
[ -n "$motor" ] || { echo '9 pré-voo: falta RESEARCHHUB_DIR ou pasta adicional do motor' >&2; exit 9; }
registos=$(mktemp -d "${TMPDIR:-/tmp}/oedp-retoma.XXXXXX") || exit 9
base="$registos/RELATORIO"
OEDP_RELATORIO="$resposta" OEDP_LANCADOR_BASE="$base" sh "$aqui/pre-voo.sh" "$sitio" "$motor" || exit 9
[ -n "${OEDP_BLOCO:-}" ] || { echo '9 fila: falta OEDP_BLOCO=<bloco>' >&2; exit 9; }
echo "registo do pré-mandato: $base.pre-mandato.log"
python3 "$sitio/scripts/leituras/fila.py" --lancar "$OEDP_BLOCO" > "$base.pre-mandato.log" 2>&1
codigo=$?
[ "$codigo" -eq 0 ] || { cat "$base.pre-mandato.log"; exit "$codigo"; }
python3 "$sitio/scripts/leituras/pre-mandato.py" "$sitio" "$prompt" >> "$base.pre-mandato.log" 2>&1
codigo=$?
cat "$base.pre-mandato.log"
[ "$codigo" -eq 0 ] || exit "$codigo"
RESEARCHHUB_DIR="$motor"
RESEARCHHUB_LOCK_DIR="${RESEARCHHUB_LOCK_DIR:-$registos/trancas-motor}"
mkdir -p "$RESEARCHHUB_LOCK_DIR" || exit 9
export RESEARCHHUB_DIR RESEARCHHUB_LOCK_DIR
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
