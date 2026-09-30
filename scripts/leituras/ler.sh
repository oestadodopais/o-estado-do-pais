#!/bin/sh
# uso: ler.sh <pacote> <prompt.md> <saida.md>   (Codex gpt-5.6-sol, xhigh, só leitura, efémero)
set -u
pacote="$1"; prompt="$2"; saida="$3"
start=$(date -u +%H:%M:%S)
# O MODELO VAI FIXADO (14.09.2026). Este guião herdava o modelo de ~/.codex/config.toml, e a 13.09.2026
# essa configuração passou de gpt-5.6-sol a gpt-6-astra sem que o lugar do leitor tivesse mudado: o lugar
# decide-se em DECISIONS.md (a política, §5) depois dos testes com estragos plantados, e não numa
# configuração pessoal. CODEX_MODELO serve para uma troca deliberada, registada.
# O MODELO É O MAIS RECENTE QUE A CONTA ACEITA (decisão do diretor de 30.09.2026, §1.142): muda-se aqui, de
# propósito e registado, depois de `sondar-modelo.sh` dizer que a conta o aceita. A 30.09 a conta recusou o
# `gpt-6.1-sol`, e o leitor fica no `gpt-5.6-sol`.
# A LEITURA VEM NA ÚLTIMA MENSAGEM, que o `-o` guarda (M43): o prompt não pede ao leitor que escreva um
# ficheiro, porque uma escrita fora do pacote pedia aprovação ao revisor automático, que gasta quota.
modelo="${CODEX_MODELO:-gpt-5.6-sol}"
codex exec -m "$modelo" -C "$pacote" -s read-only --skip-git-repo-check --ephemeral --color never -o "$saida" - < "$prompt" > "$saida.eventos.log" 2>&1
code=$?
end=$(date -u +%H:%M:%S)
echo "codex exit=$code · modelo $modelo · $start a $end UTC · saída em $saida"
