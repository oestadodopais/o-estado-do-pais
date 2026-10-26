"""Corre uma vez as sete conferências e as medições do HTML, com registos separados."""
import os
import subprocess
from pathlib import Path
p=Path(__file__).resolve().parent
base=p.parent
assert Path('dist/version.json').exists(), 'Falta o carimbo da construção.'
comandos=[(nome,['npm','run',alvo]) for nome,alvo in [('ledger-check','ledger:check'),('check-registo','check:registo'),('check-cruzamento','check:cruzamento'),('check-explicacoes','check:explicacoes'),('check-discussao','check:discussao'),('check-cartao','check:cartao'),('typecheck','typecheck')]]
comandos += [('check-voz',['npm','run','check:voz']),('lugares',['node',str(p/'lugares.mjs')]),('recibos',['node',str(base/'recibos-cr2.mjs'),'dist',str(p)]),('frases',['node',str(base/'frases-cr2.mjs'),'depois',str(p)]),('leituras-depois',['node',str(base/'leituras-cr2.mjs'),'depois',str(p)]),('leituras-comparadas',['node',str(base/'leituras-cr2.mjs'),'comparar',str(p)])]
for nome,comando in comandos:
 subprocess.run(['sh','scripts/leituras/curto.sh',str(p/f'{nome}.log'),'python3',str(p/'correr.py'),nome,*comando],check=False)
