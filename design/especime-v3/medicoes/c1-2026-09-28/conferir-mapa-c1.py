#!/usr/bin/env python3
"""Guarda as contagens do conferidor existente, sem repetir a sua régua."""
import contextlib
import io
import json
from pathlib import Path
import runpy
import sys

MAPA = 'design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md'
sys.argv = ['scripts/leituras/conferir-mapa.py', MAPA]
saida = io.StringIO()
with contextlib.redirect_stdout(saida):
    resultado = runpy.run_path(sys.argv[0], run_name='__main__')
prova = {
    'mapa': MAPA,
    'conferidor': sys.argv[0],
    'citacoes_conferidas': resultado['ok'],
    'citacoes_desfasadas': len(resultado['noutra']),
    'citacoes_nao_encontradas': len(resultado['nao']),
    'referencias_fora_do_ficheiro': len(resultado['fora']),
    'saida': saida.getvalue(),
}
Path(__file__).with_name('mapa.json').write_text(
    json.dumps(prova, ensure_ascii=False, indent=2) + '\n'
)
print(saida.getvalue(), end='')
raise SystemExit(int(bool(resultado['noutra'] or resultado['nao'] or resultado['fora'])))
