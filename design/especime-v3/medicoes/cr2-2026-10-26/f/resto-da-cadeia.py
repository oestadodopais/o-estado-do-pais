"""Confere isoladamente a cauda da construção interrompida, sem reconstruir."""
import subprocess
from pathlib import Path
p=Path(__file__).resolve().parent
for alvo in ['check:nomes','check:lingua','check:formato','check:navegacao','sinais']:
 nome=alvo.replace(':','-')
 subprocess.run(['sh','scripts/leituras/curto.sh',str(p/f'{nome}.log'),'python3',str(p/'correr.py'),nome,'npm','run',alvo],check=False)
