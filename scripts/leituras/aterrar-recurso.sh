#!/bin/sh
# Recurso explícito: construção remota preparada, depois das mesmas provas.
# Nunca ativa o domínio antes da corrida verde e do envio de main.
set -eu
OEDP_ATERRAR_RECURSO=1; export OEDP_ATERRAR_RECURSO
exec sh "$(dirname "$0")/aterrar.sh" "$@"
