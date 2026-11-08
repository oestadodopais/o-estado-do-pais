#!/usr/bin/env python3
"""Lê o vocabulário do motor por AST, sem o copiar nem executar o motor."""
import ast
import json
import os
from pathlib import Path
import re
import sys


def conferir(lista, motor):
    arvore = ast.parse((motor / 'core/assertions.py').read_text(encoding='utf-8'))
    valores = [ast.literal_eval(n.value) for n in arvore.body
               if isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and
               t.id == 'QUANTIFIER_PATTERNS' for t in n.targets)]
    if len(valores) != 1 or not valores[0] or not all(isinstance(p, str) for p in valores[0]):
        raise ValueError('QUANTIFIER_PATTERNS ausente ou inválido no motor')
    regua = re.compile('|'.join(valores[0]), re.I)
    return [{'id': f['id'], 'quantificadores': [m.group() for m in regua.finditer(f.get('nova', ''))]}
            for f in lista if regua.search(f.get('nova', '')) and
            not (isinstance(f.get('assercao'), str) and re.fullmatch(r'[\w][\w.-]*', f['assercao']))]


if __name__ == '__main__':
    try:
        motor = os.environ.get('RESEARCHHUB_DIR')
        if not motor:
            raise ValueError('falta RESEARCHHUB_DIR para ler os quantificadores')
        print(json.dumps(conferir(json.load(sys.stdin), Path(motor)), ensure_ascii=False))
    except (OSError, ValueError, SyntaxError) as e:
        print('quantificadores: ' + (str(e) if isinstance(e, ValueError) else 'régua do motor ilegível'), file=sys.stderr)
        sys.exit(9)
