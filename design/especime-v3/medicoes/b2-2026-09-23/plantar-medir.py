#!/usr/bin/env python3
"""Prova que medir.py recusa uma cópia alterada sem atualizar o seu sha256.
O estrago fica numa pasta temporária. Nenhuma cópia nem medida final é alterada.
"""
import hashlib
import json
import os
import shutil
import subprocess
import tempfile
from pathlib import Path

BLOCO = Path(__file__).resolve().parent
RAIZ = BLOCO.parents[3]
NOME = 'paginas-antes-peca1/temas_index.html'
ORIGINAL = BLOCO / NOME
resumo = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
antes = resumo(ORIGINAL)
with tempfile.TemporaryDirectory(prefix='b2-planta-medidor-') as t:
    temp = Path(t)
    shutil.copytree(BLOCO / 'paginas-antes-peca1', temp / 'paginas-antes-peca1')
    alvo = temp / NOME
    texto = alvo.read_text()
    novo = texto.replace('data-cartao-medida=', 'data-cartao-planta=', 1)
    if novo == texto:
        raise RuntimeError('a âncora da planta não existe')
    alvo.write_text(novo)
    env = {**os.environ, 'OEDP_PAGINAS_B2': t, 'OEDP_MEDIDAS_JSON': str(temp / 'medidas.json')}
    r = subprocess.run(['python3', str(BLOCO / 'medir.py'), '--parcial'], cwd=RAIZ, env=env, capture_output=True, text=True)
    saida = r.stdout + r.stderr
    (BLOCO / 'planta-medir-sha256.log').write_text(saida)
    reposto = resumo(ORIGINAL)
    passou = r.returncode == 1 and 'sha256 diferente' in saida and antes == reposto
    (BLOCO / 'plantas-medir.json').write_text(json.dumps([{
        'nome': 'cópia alterada sem novo sha256', 'codigo': r.returncode,
        'comando': 'python3 design/especime-v3/medicoes/b2-2026-09-23/plantar-medir.py',
        'passou': passou, 'mordida': 'sha256 diferente', 'antes': antes,
        'reposto': reposto, 'ficheiro': NOME,
        'nota': 'O estrago só existe numa pasta temporária; a cópia do bloco não foi escrita.',
    }], ensure_ascii=False, indent=2) + '\n')
    print('Planta do resumo: ' + ('mordeu' if passou else 'FALHOU'))
    raise SystemExit(0 if passou else 1)
