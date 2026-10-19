#!/bin/sh
# As duas conferências que precisam do motor ao lado (a regra 7 do CLAUDE.md), na cabeça do código, só em leitura do
# motor: o check:series com RESEARCHHUB_DIR (confere cada excerto no corpo alojado) e o check:cruzamento --with-origin.
# Cada código escreve-se num ficheiro depois de o processo acabar. uso: sh motor.sh <worktree> <motor> <pasta de saída>
set -u
W="$1"; MOTOR="$2"; O="$3"
mkdir -p "$O"
cd "$W" || exit 9
git -C "$MOTOR" rev-parse HEAD > "$O/motor.cabeca"
git rev-parse HEAD > "$O/cabeca"
RESEARCHHUB_DIR="$MOTOR" npm run check:series > "$O/check-series.log" 2>&1
echo $? > "$O/check-series.codigo"
RESEARCHHUB_DIR="$MOTOR" npm run check:cruzamento -- --with-origin > "$O/check-cruzamento.log" 2>&1
echo $? > "$O/check-cruzamento.codigo"
git -C "$MOTOR" status --porcelain --untracked-files=no > "$O/motor.estado"
echo "check:series $(cat "$O/check-series.codigo") · check:cruzamento --with-origin $(cat "$O/check-cruzamento.codigo")"
