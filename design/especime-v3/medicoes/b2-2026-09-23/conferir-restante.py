#!/usr/bin/env python3
"""Conferências das partes alteradas que o verify não alcançou após a paragem."""
import hashlib
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]
TODOS = ('check:pais', 'check:areas', 'check:formas', 'check:css', 'check:lingua',
         'check:nomes', 'check:alvos', 'check:datas', 'check:cadeia', 'check:dados',
         'check:lugares', 'check:palavras')
NOMES = tuple(sys.argv[1:]) or TODOS
if any(nome not in TODOS for nome in NOMES):
    raise SystemExit('Conferência não prevista')
resultados = []
for nome in NOMES:
    base = AQUI / (nome.replace(':', '-') + '-final')
    codigo = base.with_suffix('.codigo')
    codigo.unlink(missing_ok=True)
    cabeca = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=RAIZ, text=True).strip()
    base.with_suffix('.cabeca').write_text(cabeca + '\n')
    inicio = datetime.now(timezone.utc)
    base.with_suffix('.inicio').write_text(inicio.isoformat() + '\n')
    log = base.with_suffix('.log')
    with log.open('w') as f:
        r = subprocess.run(['npm', 'run', nome], cwd=RAIZ, stdout=f, stderr=subprocess.STDOUT)
    fim = datetime.now(timezone.utc)
    base.with_suffix('.fim').write_text(fim.isoformat() + '\n')
    codigo.write_text(str(r.returncode) + '\n')
    item = {'comando': 'npm run ' + nome, 'codigo': r.returncode, 'cabeca': cabeca,
            'inicio': inicio.isoformat(), 'fim': fim.isoformat(),
            'segundos': (fim-inicio).total_seconds(), 'sha256_log': hashlib.sha256(log.read_bytes()).hexdigest()}
    resultados.append(item)
    print(json.dumps(item, ensure_ascii=False), flush=True)
(AQUI / ('conferencias-restantes-seletiva.json' if sys.argv[1:] else 'conferencias-restantes.json')).write_text(json.dumps(resultados, ensure_ascii=False, indent=2) + '\n')
raise SystemExit(int(any(r['codigo'] for r in resultados)))
