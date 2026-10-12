"""Repetições na última cabeça que muda os ficheiros lidos, antes dos registos."""
from pathlib import Path
import os,json,subprocess,sys
b=Path(__file__).parent;site=Path.cwd();motor=Path(os.environ['RESEARCHHUB_DIR']);out=Path(sys.argv[1]);out.mkdir(parents=True,exist_ok=True)
def cabecas():return {nome:subprocess.check_output(['git','rev-parse','HEAD'],cwd=p,text=True).strip() for nome,p in [('sitio',site),('motor',motor)]}
antes=cabecas()
for p in [site,motor]:
 subprocess.run(['git','diff','--exit-code'],cwd=p,check=True,stdout=subprocess.DEVNULL)
 subprocess.run(['git','diff','--cached','--exit-code'],cwd=p,check=True,stdout=subprocess.DEVNULL)
r=subprocess.run([sys.executable,str(b/'reconferir-f.py'),str(out)])
depois=cabecas();assert antes==depois
(out/'cabecas.json').write_text(json.dumps(antes,indent=2)+'\n')
sys.exit(r.returncode)
