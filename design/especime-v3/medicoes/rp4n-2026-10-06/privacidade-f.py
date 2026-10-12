"""Confere o diff inteiro do ramo e distingue os caminhos temporários herdados."""
from pathlib import Path
import getpass
import json
import subprocess
import sys
BASE = Path(sys.argv[1]) if len(sys.argv)>1 else Path('design/especime-v3/medicoes/rp4n-2026-10-06/f')
BASE.mkdir(parents=True,exist_ok=True)
nome=getpass.getuser()
tmp='/private'+'/tmp/'
casa='/'+'Users/'
pedacos=[nome,tmp,'Instru'+'ments/','.claude/'+'worktrees/']
args=sum((['-e',x] for x in pedacos),[])
def git(*args):return subprocess.check_output(['git',*args],text=True)
def contar(texto,patterns):
 r=subprocess.run(['grep','-c',*sum((['-e',x] for x in patterns),[])],input=texto,text=True,capture_output=True)
 assert r.returncode in (0,1)
 return int(r.stdout)
log=git('log','-p','b84d21a3..HEAD')
diff=git('diff','b84d21a3','HEAD')
head=subprocess.run(['git','grep','-n','-e',nome,'-e',casa,'HEAD'],capture_output=True,text=True)
legados=subprocess.run(['git','grep','-n','-F',tmp,'HEAD'],capture_output=True,text=True).stdout.splitlines()
lista=[]
for linha in legados:
 _,ficheiro,numero,conteudo=linha.split(':',3)
 assert tmp in git('show','b84d21a3:'+ficheiro)
 lista.append({'ficheiro':ficheiro,'linha':int(numero)})
resultado={'cabeca':git('rev-parse','HEAD').strip(),'base':'b84d21a3','historico_grep_c':contar(log,pedacos),'diff_grep_c':contar(diff,pedacos),'cabeca_nome_e_casa_grep_c':len(head.stdout.splitlines()),'legados_ficheiros':len(set(x['ficheiro'] for x in lista)),'RP4N-14':lista}
(BASE/'privacidade.json').write_text(json.dumps(resultado,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(resultado,ensure_ascii=False,indent=2))
if any(resultado[k] for k in ['historico_grep_c','diff_grep_c','cabeca_nome_e_casa_grep_c']):sys.exit(1)
