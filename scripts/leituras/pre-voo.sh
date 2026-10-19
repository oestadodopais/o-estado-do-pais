#!/bin/sh
# Confere as condições de arranque antes de lançar o construtor.
exec python3 "$(dirname "$0")/pre-voo.py" "$@"
