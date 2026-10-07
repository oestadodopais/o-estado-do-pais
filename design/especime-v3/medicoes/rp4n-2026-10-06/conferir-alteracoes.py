"""Conferências tocadas pelo RP4-n, mesmo quando a cadeia integral para no HTML.
Uso: RESEARCHHUB_DIR=<motor> python3 design/especime-v3/medicoes/rp4n-2026-10-06/conferir-alteracoes.py
"""
import json
import os
from pathlib import Path
import re
import subprocess
import sys
BASE=Path(__file__).resolve().parent
SITE=BASE.parents[3]
MOTOR=Path(os.environ['RESEARCHHUB_DIR'])
PASTA=BASE/'conferencias'
PASTA.mkdir(exist_ok=True)
def limpar(texto):
 for raiz,nome in [(SITE,'<worktree>'),(MOTOR,'<motor>'),(Path.home(),'<utilizador>')]: texto=texto.replace(str(raiz),nome)
 texto=re.sub(r'/private/(?:var|tmp)/[^\s)\'"\x1b]+','<casa>',texto)
 return texto
registos=json.loads((PASTA/'registo.json').read_text()) if (PASTA/'registo.json').exists() else []
for nome,cmd in [('cartao',['npm','run','check:cartao']),('series',['npm','run','check:series']),('cruzamento',['node','scripts/check-cruzamento.mjs','--with-origin']),('privacidade',['npm','run','check:privacidade'])]:
 if sys.argv[1:] and nome not in sys.argv[1:]: continue
 registos=[r for r in registos if r['nome']!=nome]
 cabeca=subprocess.check_output(['git','rev-parse','HEAD'],cwd=SITE,text=True).strip()
 r=subprocess.run(cmd,cwd=SITE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True)
 (PASTA/(nome+'.log')).write_text(limpar(r.stdout))
 (PASTA/(nome+'.codigo')).write_text(str(r.returncode)+'\n')
 fim=subprocess.check_output(['git','rev-parse','HEAD'],cwd=SITE,text=True).strip()
 assert cabeca==fim,'A cabeça mudou durante a conferência'
 registos.append({'nome':nome,'comando':' '.join(cmd),'cabeca':cabeca,'codigo_lido':int((PASTA/(nome+'.codigo')).read_text())})
 print(nome,r.returncode,flush=True)
(PASTA/'registo.json').write_text(json.dumps(registos,ensure_ascii=False,indent=2)+'\n')
