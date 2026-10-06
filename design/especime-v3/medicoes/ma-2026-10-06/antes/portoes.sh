#!/bin/sh
# Os três portões de uma cabeça, cada um no seu comando, com o código escrito num ficheiro depois de o processo
# acabar; e a tranca da máquina, que faz cumprir «uma construção de cada vez» sem procurar processos.
# uso: portoes.sh <worktree> <pasta de saída>
#
# A TRANCA É UM FICHEIRO, NÃO UMA PROCURA DE PROCESSOS (M46, 30.09.2026). Até aqui os construtores do Codex
# cumpriam a regra com `pgrep`, e cada `pgrep` pedia uma saída da caixa de areia que o revisor automático das
# aprovações avaliava numa sessão própria, cobrada à quota (no E0, 2 sessões e 156 558 símbolos, 27 % do
# bloco; a causa lia-se no pedido de aprovação: «sandbox_permissions: require_escalated» para
# `pgrep -fl 'astro build|npm run verify|npm run build'`). A tranca vive na pasta comum do Git do repositório
# (`git rev-parse --git-common-dir`), que as worktrees partilham e que o lançador do Codex dá com escrita
# (`--add-dir`), por isso tomá-la não pede aprovação a ninguém. Quem corre portões inteiros toma-a; quem a
# encontra espera. Uma tranca com mais de quarenta minutos é de um processo que morreu (os três portões levam
# cerca de quinze) e ignora-se, com aviso.
set -u
W="$1"; O="$2"
cd "$W" || exit 9
# A PASTA DE SAÍDA CRIA-SE DEPOIS DE ENTRAR NA WORKTREE (a releitura do E0b, achado 10): antes, um caminho
# relativo era criado na árvore de quem chamava, e cada redirecionamento seguinte falhava.
mkdir -p "$O"
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
# UMA INTERRUPÇÃO SOLTA A TRANCA E SAI (o mesmo achado 10): a primeira redação soltava-a e seguia para o portão
# seguinte sem ela.
trap 'rm -f "$tranca"' EXIT
trap 'rm -f "$tranca"; exit 130' INT TERM
git rev-parse HEAD > "$O/cabeca"
for g in build verify typecheck; do
  date -u +%Y-%m-%dT%H:%M:%SZ > "$O/$g.inicio"
  npm run $g > "$O/$g.log" 2>&1
  echo $? > "$O/$g.codigo"
  date -u +%Y-%m-%dT%H:%M:%SZ > "$O/$g.fim"
  # UM PORTÃO MORTO POR UM SINAL (código acima de 128) PARA A CORRIDA: a tranca solta-se na saída e os portões
  # seguintes não correm, porque o que se lia deles não seria de uma corrida inteira.
  if [ "$(cat "$O/$g.codigo")" -gt 128 ]; then echo "portão $g interrompido (código $(cat "$O/$g.codigo")); a corrida para aqui" >&2; exit "$(cat "$O/$g.codigo")"; fi
done
git rev-parse HEAD > "$O/cabeca.fim"
git status --short > "$O/estado.fim"
echo "FIM $(cut -c1-8 "$O/cabeca") build=$(cat "$O/build.codigo") verify=$(cat "$O/verify.codigo") typecheck=$(cat "$O/typecheck.codigo")"
