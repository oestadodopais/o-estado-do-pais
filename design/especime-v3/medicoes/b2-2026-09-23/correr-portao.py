#!/usr/bin/env python3
"""Executa um portão final e guarda apenas o código desta corrida."""
import hashlib
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]
if len(sys.argv) != 2 or sys.argv[1] not in ('build', 'verify', 'typecheck'):
    raise SystemExit('uso: correr-portao.py build|verify|typecheck')
nome = sys.argv[1]
pasta = AQUI / 'portoes'
pasta.mkdir(exist_ok=True)
codigo = pasta / f'{nome}.codigo'
codigo.unlink(missing_ok=True)
cabeca = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=RAIZ, text=True).strip()
inicio = datetime.now(timezone.utc)
(pasta / f'{nome}.inicio').write_text(inicio.isoformat() + '\n')
(pasta / f'{nome}.cabeca').write_text(cabeca + '\n')
log = pasta / f'{nome}.log'
with log.open('w') as f:
    r = subprocess.run(['npm', 'run', nome], cwd=RAIZ, stdout=f, stderr=subprocess.STDOUT)
fim = datetime.now(timezone.utc)
(pasta / f'{nome}.fim').write_text(fim.isoformat() + '\n')
codigo.write_text(str(r.returncode) + '\n')
print(json.dumps({'comando': f'npm run {nome}', 'codigo': r.returncode,
                  'cabeca': cabeca, 'inicio': inicio.isoformat(), 'fim': fim.isoformat(),
                  'segundos': (fim - inicio).total_seconds(),
                  'sha256_log': hashlib.sha256(log.read_bytes()).hexdigest()}, ensure_ascii=False))
raise SystemExit(r.returncode)
