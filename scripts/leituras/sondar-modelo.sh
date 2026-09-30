#!/bin/sh
# Pergunta à conta do Codex se aceita um modelo, com um pedido de uma palavra e o raciocínio no mínimo
# (decisão do diretor de 30.09.2026, §1.142: o modelo por omissão é o mais recente que a conta aceita).
# uso: sondar-modelo.sh <modelo>   · sai 0 se a conta o aceitou, 1 se o recusou, 2 se não se percebeu a resposta
# A 30.09.2026 a conta recusou o gpt-6.1-sol com «The 'gpt-6.1-sol' model is not supported when using Codex
# with a ChatGPT account», e aceitou o gpt-5.6-sol e o gpt-6-astra. Custa cerca de dez mil símbolos.
set -u
modelo="$1"
pasta="$(mktemp -d "${TMPDIR:-/tmp}/sonda-codex.XXXXXX")"
printf 'Reply with the single word ok and nothing else.\n' > "$pasta/prompt.md"
(cd "$pasta" && codex exec -m "$modelo" -c 'model_reasoning_effort="low"' -C "$pasta" -s read-only --skip-git-repo-check --ephemeral --color never -o "$pasta/resposta.md" - < "$pasta/prompt.md" > "$pasta/eventos.log" 2>&1)
codigo=$?
if grep -q "is not supported\|invalid_request_error\|not found" "$pasta/eventos.log"; then
  echo "RECUSADO $modelo: $(grep -o '"message":"[^"]*"' "$pasta/eventos.log" | head -1)"
  rm -rf "$pasta"; exit 1
fi
if [ "$codigo" -eq 0 ] && [ -s "$pasta/resposta.md" ]; then
  echo "ACEITE $modelo: respondeu «$(head -c 40 "$pasta/resposta.md" | tr -d '\n')» · $(grep -A1 'tokens used' "$pasta/eventos.log" | tail -1 | tr -d ' ') símbolos"
  rm -rf "$pasta"; exit 0
fi
echo "SEM RESPOSTA CLARA $modelo (código $codigo); o registo fica em $pasta/eventos.log"; exit 2
