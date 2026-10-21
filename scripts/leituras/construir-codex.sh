#!/bin/sh
# Lança o Codex como construtor numa worktree, com o modelo e o raciocínio fixados, com o escrivão dos commits
# ao lado, e mede a passagem no fim.
# uso: [CODEX_RACIOCINIO=high] construir-codex.sh <worktree> <prompt.md> <relatorio.md> [<outra pasta com escrita>...]
# O lugar de direção lança-o desde 23.09.2026 (§1.128), e o financiador pode continuar a lançá-lo:
# `nohup scripts/leituras/construir-codex.sh <worktree> <prompt> <relatorio> [<outra worktree>] >> <log> 2>&1 &`
# A regra de paragem do construtor vai no prompt: só um portão que protege um número, uma fonte ou uma
# pessoa o faz parar; o que encoda mobília muda de forma conservando o que protege, com uma planta.
#
# AS OUTRAS PASTAS COM ESCRITA (M43, 30.09.2026). Cada pasta passada depois do relatório entra em `--add-dir`,
# com escrita: um construtor que escreve em duas worktrees (o motor e o sítio) pedia aprovação a cada escrita
# fora da sua pasta de arranque.
#
# O ESCRIVÃO E O FIM DAS REVISÕES AUTOMÁTICAS (M79, M80, M81, 13.10.2026, §1.190). Até 12.10 o guião passava
# `--approve-for-me`, que mandava cada pedido de escalada a uma sub-sessão de revisão («guardian») que lia a
# história inteira da sessão: 23 revisões a 12.10.2026, 1,94 milhões de símbolos fora da cache, cerca de doze
# por cento dos pontos da semana. Os pedidos nasciam dos commits e da tranca dos portões, porque o Codex mantém
# `.git` só de leitura dentro da sandbox. Agora: a política de aprovação é `never` (nada escala, e o prompt comum
# diz ao construtor o que fazer quando a sandbox recusa); o construtor comita por `comitar.sh`, que pede ao
# escrivão (`escrivao.py`, lançado aqui, a correr fora da sandbox só para as pastas permitidas); a tranca de
# `portoes.sh` vive em /tmp; o prompt comum dos construtores (`PROMPT-construtor-comum.md`) vai à frente do
# prompt da passagem; e no fim o guião lê os pontos da semana antes e depois da passagem (`pontos.py`), com os
# turnos e o contexto médio, que é o custo que o quadro da §1.177 regista.
#
# A WORKTREE PASSA-SE EM CAMINHO ABSOLUTO (M29, 23.09.2026): o guião entra nela com `cd` e volta a passá-la ao
# Codex em `-C`, por isso um caminho relativo era procurado dentro de si próprio e o Codex morria no mesmo segundo
# com «No such file or directory». Recusa-se antes de lançar, com a razão.
# O MODELO É O MAIS RECENTE QUE A CONTA ACEITA (decisão do diretor de 30.09.2026, §1.142): muda-se aqui, de
# propósito e registado, depois de `sondar-modelo.sh` dizer que a conta o aceita.
# O RACIOCÍNIO VAI POR VARIÁVEL (§1.177, M57, 06.10.2026): `high` nas construções e nas passagens mecânicas,
# `xhigh` só onde o lugar de direção o pedir; por omissão fica xhigh, para uma troca ser sempre deliberada.
set -u
worktree="$1"; prompt="$2"; relatorio="$3"; shift 3
case "$worktree" in /*) ;; *) echo "a worktree passa-se em caminho absoluto (recebi: ${worktree})" >&2; exit 9;; esac
extras=""
for pasta in "$@"; do
  case "$pasta" in /*) ;; *) echo "as outras pastas passam-se em caminho absoluto (recebi: ${pasta})" >&2; exit 9;; esac
  extras="$extras --add-dir $pasta"
done
modelo="${CODEX_CONSTRUTOR:-gpt-6-astra}"
raciocinio="${CODEX_RACIOCINIO:-xhigh}"
# O TETO DE RELÓGIO DE PAREDE (21.10.2026, a decisão do financiador sobre o custo): uma passagem corre no
# máximo CODEX_TETO_SEGUNDOS (por omissão 4 500 s, setenta e cinco minutos); ao chegar, com-teto.sh interrompe o
# Codex e a saída é 124, que fica no FIM e no registo dos pontos. Uma passagem que precisa de mais do que isto
# está mal cortada: parte-se o mandato, não se sobe o teto sem decisão escrita.
teto="${CODEX_TETO_SEGUNDOS:-4500}"
case "$teto" in ''|*[!0-9]*) echo "CODEX_TETO_SEGUNDOS tem de ser um inteiro de segundos (recebi: ${teto})" >&2; exit 9;; esac
case "$raciocinio" in low|medium|high|xhigh) ;; *) echo "CODEX_RACIOCINIO tem de ser low, medium, high ou xhigh (recebi: ${raciocinio})" >&2; exit 9;; esac
aqui="$(cd "$(dirname "$0")" && pwd -P)" || exit 9
comum="$aqui/PROMPT-construtor-comum.md"
[ -f "$comum" ] || { echo "falta o prompt comum dos construtores: $comum" >&2; exit 9; }
[ -f "$prompt" ] || { echo "falta o prompt da passagem: $prompt" >&2; exit 9; }
cd "$worktree" || exit 9
# A REDE E AS DEPENDÊNCIAS (13.10.2026, a primeira passagem com a aprovação a `never`, §1.190). Sem escaladas, a
# sandbox recusa o que a aprovação automática antes absorvia: o `socket.bind` das suites do motor que abrem
# servidores locais (`core.http_test` e quatro outras) e a escrita na cache do Vite quando `node_modules` é uma
# ligação para fora da worktree. Por isso: CODEX_REDE=1 liga a rede da sandbox (obrigatório nas passagens que
# correm o portão do motor ou alojam fontes), e o guião recusa lançar se `node_modules` não for uma pasta real da
# própria worktree (o lugar de direção corre `npm ci` nela antes de lançar).
rede=""
if [ "${CODEX_REDE:-0}" = 1 ]; then rede="-c sandbox_workspace_write.network_access=true"; fi
# O PRÉ-VOO ANTES DO LANÇAMENTO (15.10.2026). Os registos do processo ficam
# fora do relatório e da worktree; não podem sujar a cabeça durante os portões.
sitio="$worktree"
motor="${RESEARCHHUB_DIR:-}"
for pasta in "$worktree" "$@"; do
  if [ -f "$pasta/core/gate.py" ]; then motor="$pasta"; fi
  if [ -f "$pasta/package.json" ]; then sitio="$pasta"; fi
done
[ -n "$motor" ] || { echo '9 pré-voo: falta a worktree do motor (RESEARCHHUB_DIR ou pasta adicional)' >&2; exit 9; }
registos=$(mktemp -d "${TMPDIR:-/tmp}/oedp-construtor.XXXXXX") || exit 9
base="$registos/RELATORIO"
OEDP_RELATORIO="$relatorio" OEDP_LANCADOR_BASE="$base" sh "$aqui/pre-voo.sh" "$sitio" "$motor" || exit 9
RESEARCHHUB_DIR="$motor"
RESEARCHHUB_LOCK_DIR="${RESEARCHHUB_LOCK_DIR:-$registos/trancas-motor}"
mkdir -p "$RESEARCHHUB_LOCK_DIR" || exit 9
export RESEARCHHUB_DIR RESEARCHHUB_LOCK_DIR
echo "registos do lançador: $base.escrivao.log e $base.pontos.json"
inicio="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
python3 "$aqui/pontos.py" --antes
python3 "$aqui/escrivao.py" "$worktree" "$@" > "$base.escrivao.log" 2>&1 &
escrivao=$!
trap 'kill "$escrivao" 2>/dev/null' EXIT INT TERM
sleep 1
kill -0 "$escrivao" 2>/dev/null || { echo "o escrivão não arrancou: $(tail -3 "$base.escrivao.log")" >&2; exit 9; }
echo "INICIO $inicio modelo=$modelo raciocínio=$raciocinio pastas_com_escrita=[$worktree$(for p in "$@"; do printf ' %s' "$p"; done)] escrivao=pid $escrivao"
# shellcheck disable=SC2086
cat "$comum" "$prompt" | sh "$aqui/com-teto.sh" "$teto" codex exec -m "$modelo" -c "model_reasoning_effort=\"$raciocinio\"" -c 'approval_policy="never"' -s workspace-write $rede -C "$worktree" $extras --skip-git-repo-check --color never -o "$relatorio" -
codigo=$?
fim="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
kill "$escrivao" 2>/dev/null
wait "$escrivao" 2>/dev/null
trap - EXIT INT TERM
[ "$codigo" -eq 124 ] && echo "TETO: a passagem passou de ${teto} s e foi interrompida"
echo "FIM exit=$codigo $fim"
sleep 2
python3 "$aqui/pontos.py" --inicio "$inicio" --fim "$fim" --worktree "$worktree" --json "$base.pontos.json"
# O FICHEIRO DE CUSTO (21.10.2026, §1.202): fica em $base.pontos.json, fora das pastas de relatórios (o pré-voo
# exige-o), e o lugar de direção comita-o como custo-<data>.json ao lado do relatório com a leitura do bloco.
exit "$codigo"
