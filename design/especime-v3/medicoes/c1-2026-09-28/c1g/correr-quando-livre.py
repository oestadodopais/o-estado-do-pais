"""Espera pelos outros portões e regista apenas o comando pedido."""
import json
from pathlib import Path
import subprocess
import sys
import time
AQUI=Path(__file__).resolve().parent
nome=sys.argv[1]
assert nome in ('build','verify','typecheck')
while True:
    r=subprocess.run([sys.executable,str(AQUI/'conferir-concorrencia.py'),str(AQUI/f'concorrencia-{nome}.json')],text=True,capture_output=True)
    if r.returncode==0:break
    if r.returncode!=1 or not json.loads(r.stdout)['processos_ativos']:raise RuntimeError('A conferência de concorrência não terminou de forma válida.')
    time.sleep(5)
print(f'{nome}: máquina livre; início do comando.',flush=True)
r=subprocess.run([sys.executable,str(AQUI.parent/'registar-c1.py'),f'portoes/c1g/{nome}','npm','run',nome])
raise SystemExit(r.returncode)
