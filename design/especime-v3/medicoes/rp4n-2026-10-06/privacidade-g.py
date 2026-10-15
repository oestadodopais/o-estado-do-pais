"""Confere o diff inteiro do ramo e distingue os caminhos temporários herdados."""
from pathlib import Path
import getpass
import json
import subprocess
import sys
BASE = Path(sys.argv[1]) if len(sys.argv)>1 else Path('design/especime-v3/medicoes/rp4n-2026-10-06/g')
BASE.mkdir(parents=True,exist_ok=True)
nome=getpass.getuser()
tmp='/private'+'/tmp/'
casa='/'+'Users/'
pedacos=[nome,casa,tmp,'Instru'+'ments/','.claude/'+'worktrees/']
args=sum((['-e',x] for x in pedacos),[])
def git(*args):return subprocess.check_output(['git',*args],text=True)
def contar(texto,patterns):
 r=subprocess.run(['grep','-c',*sum((['-e',x] for x in patterns),[])],input=texto,text=True,capture_output=True)
 assert r.returncode in (0,1)
 return int(r.stdout)
log=git('log','-p','c0e1b3f4..HEAD')
diff=git('diff','c0e1b3f4','HEAD')
head=subprocess.run(['git','grep','-n','-F',*args,'HEAD'],capture_output=True,text=True)
lista=[];novos=[]
for linha in head.stdout.splitlines():
 _,ficheiro,numero,conteudo=linha.split(':',3)
 anterior=subprocess.run(['git','show','c0e1b3f4:'+ficheiro],capture_output=True,text=True)
 if tmp in conteudo and conteudo in anterior.stdout.splitlines() and not any(x in conteudo for x in pedacos if x!=tmp):
  lista.append({'ficheiro':ficheiro,'linha':int(numero)})
 else:novos.append({'ficheiro':ficheiro,'linha':int(numero),'padroes':[i for i,x in enumerate(pedacos) if x in conteudo]})
resultado={'cabeca':git('rev-parse','HEAD').strip(),'base':'c0e1b3f4','historico_grep_c':contar(log,pedacos),'diff_grep_c':contar(diff,pedacos),'cabeca_sem_excecoes_grep_c':len(novos),'novos':novos,'padroes':['utilizador','casa','temporario','projetos','worktrees'],'legados_ficheiros':len(set(x['ficheiro'] for x in lista)),'RP4N-14':lista}
(BASE/'privacidade.json').write_text(json.dumps(resultado,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(resultado,ensure_ascii=False,indent=2))
if any(resultado[k] for k in ['historico_grep_c','diff_grep_c','cabeca_sem_excecoes_grep_c']):sys.exit(1)
