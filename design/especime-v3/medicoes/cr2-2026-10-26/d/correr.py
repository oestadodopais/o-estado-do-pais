"""Guarda o código e oculta os caminhos locais nos registos da passagem."""
import os,subprocess,sys
from pathlib import Path
nome,*comando=sys.argv[1:]
p=Path(__file__).resolve().parent
r=subprocess.run(comando,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True)
s=r.stdout
for valor,marca in [(str(Path.cwd()),'<worktree>'),(os.environ.get('RESEARCHHUB_DIR',''),'<motor>'),(str(Path.home()),'<utilizador>')]:
 if valor:s=s.replace(valor,marca)
(p/f'{nome}.codigo').write_text(str(r.returncode)+'\n')
print(s,end='')
sys.exit(r.returncode)
