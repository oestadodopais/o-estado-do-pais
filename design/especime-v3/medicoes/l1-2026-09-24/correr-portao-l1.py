#!/usr/bin/env python3
"""Corre um dos três portões inteiros do L1 na cabeça e guarda o código desta corrida.

    python3 design/especime-v3/medicoes/l1-2026-09-24/correr-portao-l1.py build|verify|typecheck

Adaptado de `b2-2026-09-23/correr-portao.py`. Apaga o `.codigo` antigo antes de
correr, escreve a cabeça do sítio e a do motor, a hora de início e de fim, o
registo inteiro da corrida e, no fim, o código de saída do próprio processo num
ficheiro acabado de escrever (nunca o de um `|`). O registo que entra no
repositório não leva o caminho da máquina: a raiz da árvore passa a «.», e o
JSON da corrida diz quantas vezes e o sha256 do registo antes e depois.
"""
import hashlib
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]
if len(sys.argv) != 2 or sys.argv[1] not in ('build', 'verify', 'typecheck'):
    raise SystemExit('uso: correr-portao-l1.py build|verify|typecheck')
nome = sys.argv[1]
pasta = AQUI / 'portoes'
pasta.mkdir(exist_ok=True)
codigo = pasta / f'{nome}.codigo'
codigo.unlink(missing_ok=True)
cabeca = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=RAIZ, text=True).strip()
_VIZINHAS = [RAIZ.parent, RAIZ.parents[3]] if len(RAIZ.parents) > 3 else [RAIZ.parent]
motor = next(v / 'ResearchHub/.worktrees/l1-2026-09-24' for v in _VIZINHAS if (v / 'ResearchHub/.worktrees/l1-2026-09-24').exists())
motor_cabeca = subprocess.check_output(['git', '-C', str(motor), 'rev-parse', 'HEAD'], text=True).strip()
(pasta / f'{nome}.motor-cabeca').write_text(motor_cabeca + '\n')
inicio = datetime.now(timezone.utc)
(pasta / f'{nome}.inicio').write_text(inicio.isoformat() + '\n')
(pasta / f'{nome}.cabeca').write_text(cabeca + '\n')
log = pasta / f'{nome}.log'
with log.open('w') as f:
    r = subprocess.run(['npm', 'run', nome], cwd=RAIZ, stdout=f, stderr=subprocess.STDOUT)
fim = datetime.now(timezone.utc)
(pasta / f'{nome}.fim').write_text(fim.isoformat() + '\n')
codigo.write_text(str(r.returncode) + '\n')
bruto = log.read_bytes()
raiz = (str(RAIZ) + os.sep).encode()
limpo = bruto.replace(raiz, b'./')
log.write_bytes(limpo)
resumo = {'comando': f'npm run {nome}', 'codigo': int(codigo.read_text().strip()),
          'cabeca': cabeca, 'motor_cabeca': motor_cabeca, 'inicio': inicio.isoformat(), 'fim': fim.isoformat(),
          'segundos': round((fim - inicio).total_seconds(), 1),
          'registo': {'sha256_bruto': hashlib.sha256(bruto).hexdigest(), 'sha256': hashlib.sha256(limpo).hexdigest(),
                      'caminhos_da_maquina_trocados': bruto.count(raiz)}}
(pasta / f'{nome}.json').write_text(json.dumps(resumo, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(resumo, ensure_ascii=False))
raise SystemExit(r.returncode)
