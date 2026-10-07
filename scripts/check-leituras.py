#!/usr/bin/env python3
"""Corre todas as plantas de tests/leituras, sem parar na primeira vermelha.

Cada guião afirma o resultado e a mensagem esperada. A descoberta por glob
impede que uma planta nova fique fora da cadeia. Os processos sintéticos não
herdam o relógio do portão real, para não misturar medições de árvores distintas.
Uso: python3 scripts/check-leituras.py [--json ficheiro]
"""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import time

RAIZ = Path(__file__).resolve().parents[1]


def principal():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--json', type=Path)
    args = parser.parse_args()
    ambiente = {k: v for k, v in os.environ.items()
                if not k.startswith(('OEDP_TEMPOS', 'npm_'))
                and k not in ('OEDP_CADEIA', 'OEDP_MEDIDAS_JSON')}
    ambiente['PYTHONDONTWRITEBYTECODE'] = '1'
    guioes = sorted((RAIZ / 'tests/leituras').glob('*.py'))
    if not guioes:
        raise RuntimeError('check:leituras: não foi encontrado nenhum guião')
    resultados = []
    for guiao in guioes:
        inicio = time.monotonic()
        r = subprocess.run([sys.executable, str(guiao)], cwd=RAIZ, env=ambiente,
                           capture_output=True, text=True)
        resultado = {'guiao': guiao.relative_to(RAIZ).as_posix(),
                     'codigo': r.returncode, 'segundos': time.monotonic() - inicio,
                     'saida': r.stdout, 'erros': r.stderr}
        resultados.append(resultado)
        print(f'check:leituras · {resultado["guiao"]} · código {r.returncode}', flush=True)
        print(r.stdout, end='', flush=True)
        print(r.stderr, end='', file=sys.stderr, flush=True)
    saida = {'ok': all(r['codigo'] == 0 for r in resultados), 'guioes': resultados}
    if args.json:
        args.json.write_text(json.dumps(saida, ensure_ascii=False, indent=2) + '\n')
    return 0 if saida['ok'] else 1


if __name__ == '__main__':
    raise SystemExit(principal())
