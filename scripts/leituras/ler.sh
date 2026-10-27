#!/bin/sh
# uso: ler.sh <pacote> <prompt.md> <saida.md>   (Codex gpt-6-astra, xhigh, só leitura, efémero; CODEX_MODELO e CODEX_RACIOCINIO por variável)
set -u
pacote="$1"; prompt="$2"; saida="$3"
start=$(date -u +%H:%M:%S)
# O MODELO VAI FIXADO (14.09.2026). Este guião herdava o modelo de ~/.codex/config.toml, e a 13.09.2026
# essa configuração passou de gpt-5.6-sol a gpt-6-astra sem que o lugar do leitor tivesse mudado: o lugar
# decide-se em DECISIONS.md (a política, §5) depois dos testes com estragos plantados, e não numa
# configuração pessoal. CODEX_MODELO serve para uma troca deliberada, registada.
# O MODELO É O MAIS RECENTE QUE A CONTA ACEITA (decisão do diretor de 30.09.2026, §1.142): muda-se aqui, de
# propósito e registado, depois de `sondar-modelo.sh` dizer que a conta o aceita. A 30.09 de manhã a conta recusou o
# `gpt-6.1-sol` com o Codex CLI 0.157.1; à tarde, com o CLI 0.159.2, aceitou-o (§1.146), e o leitor passou a ele.
# O RACIOCÍNIO VAI FIXADO A XHIGH aqui, como nos outros guiões, e não herdado de ~/.codex/config.toml.
# A LEITURA VEM NA ÚLTIMA MENSAGEM, que o `-o` guarda (M43): o prompt não pede ao leitor que escreva um
# ficheiro, porque uma escrita fora do pacote pedia aprovação ao revisor automático, que gasta quota.
# O LEITOR É O ASTRA XHIGH (05.10.2026, a M51 e a §1.161): medido contra o Sol no mesmo pacote com cinco estragos,
# cinco de cinco e mais achados por menos símbolos. O Sol fica para a segunda leitura dos blocos grandes (CODEX_MODELO).
# O esforço vai por variável para uma troca deliberada e registada; por omissão xhigh (o high não se usa, M51).
modelo="${CODEX_MODELO:-gpt-6-astra}"
# O ESFORÇO ESCOLHE-SE POR TAREFA, NUNCA POR OMISSÃO (§1.202 regra 6; I270, 27.10.2026): este guião arrancava a xhigh
# quando ninguém dizia nada, ao contrário da regra (high nas construções; xhigh só nas leituras que toquem números).
raciocinio="${CODEX_RACIOCINIO:-}"
[ -n "$raciocinio" ] || { echo "9 CODEX_RACIOCINIO por escolher, pela tarefa: high nas construções e nas correções que toquem réguas, nomes, frases ou dist/; medium no mecânico sem nada disso (Sol 6.1) e nas leituras do Astra; xhigh só nas leituras que toquem números ou fontes; nunca max (§1.202 regra 6)"; exit 9; }
codex exec -m "$modelo" -c "model_reasoning_effort=\"$raciocinio\"" -C "$pacote" -s read-only --skip-git-repo-check --ephemeral --color never -o "$saida" - < "$prompt" > "$saida.eventos.log" 2>&1
code=$?
end=$(date -u +%H:%M:%S)
echo "codex exit=$code · modelo $modelo · raciocínio $raciocinio · $start a $end UTC · saída em $saida"
