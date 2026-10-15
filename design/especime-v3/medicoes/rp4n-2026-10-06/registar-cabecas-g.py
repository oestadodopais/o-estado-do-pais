"""Cabeças e commits lidos do Git, com um ficheiro por commit."""
from pathlib import Path
import json
import os
import sys
import subprocess
BASE=Path(sys.argv[1]) if len(sys.argv)>1 else Path('design/especime-v3/medicoes/rp4n-2026-10-06/g')
BASE.mkdir(parents=True,exist_ok=True)
repos={'sitio':(Path.cwd(),'ed7a9e19'),'motor':(Path(os.environ['RESEARCHHUB_DIR']),'9293361')}
resultado={}
for nome,(pasta,base) in repos.items():
 def git(*a):return subprocess.check_output(['git',*a],cwd=pasta,text=True).strip()
 commits=[]
 for linha in git('log','--reverse','--format=%H %s',base+'..HEAD').splitlines():
  sha,titulo=linha.split(' ',1)
  destino=BASE/'commits'/nome/(sha+'.txt');destino.parent.mkdir(parents=True,exist_ok=True)
  destino.write_text(git('show','--no-patch','--format=%H%n%s%n%b',sha)+'\n')
  commits.append({'sha':sha,'titulo':titulo,'ficheiro':str(destino)})
 resultado[nome]={'cabeca':git('rev-parse','HEAD'),'base':base,'commits':commits}
(BASE/'cabecas-e-commits.json').write_text(json.dumps(resultado,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v['cabeca'] for k,v in resultado.items()}))
