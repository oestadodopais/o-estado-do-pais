"""Reconferências finais: cada registo começa e acaba com as duas cabeças reais."""
from pathlib import Path
import os
import subprocess
import sys
site=Path.cwd();motor=Path(os.environ['RESEARCHHUB_DIR']);out=Path(sys.argv[1]);out.mkdir(parents=True,exist_ok=True)
def cabecas():
 return {nome:subprocess.check_output(['git','rev-parse','HEAD'],cwd=p,text=True).strip() for nome,p in [('sitio',site),('motor',motor)]}
for nome,cmd in [('series',['npm','run','check:series']),('cruzamento',['npm','run','check:cruzamento','--','--with-origin'])]:
 with (out/(nome+'.log')).open('w') as f:
  antes=cabecas();f.write(str(antes)+'\n');f.flush()
  r=subprocess.run(cmd,stdout=f,stderr=subprocess.STDOUT)
  depois=cabecas();f.write(str(depois)+'\n')
 codigo=r.returncode if antes==depois else 99
 (out/(nome+'.codigo')).write_text(str(codigo)+'\n')
 print(nome,codigo,flush=True)
 if codigo:sys.exit(codigo)
subprocess.run(['python3','scripts/leituras/limpar-caminhos.py',str(out.resolve()),'--worktree',str(site),'--motor',str(motor)],check=True)
