"""Confere o diff inteiro do ramo e distingue os caminhos temporários herdados."""
from pathlib import Path
import getpass
import hashlib
import json
import subprocess
import sys
BASE = Path(sys.argv[1]) if len(sys.argv)>1 else Path('design/especime-v3/medicoes/rp4n-2026-10-06/i')
BASE.mkdir(parents=True,exist_ok=True)
nome=getpass.getuser()
tmp='/private'+'/tmp/'
casa='/'+'Users/'
pedacos=[nome,casa,tmp,'Instru'+'ments/','.claude/'+'worktrees/']
args=sum((['-e',x] for x in pedacos),[])
def git(*args):return subprocess.check_output(['git',*args],text=True)
def contar(texto,patterns):
 return sum(bool(conferir_texto(linha)) for linha in texto.splitlines())
def conferir_texto(texto):
 return ['RP4N-i: caminho ou identificador local ('+nome+')' for nome,padrao in zip(['utilizador','casa','temporario','projetos','worktrees'],pedacos) if padrao in texto]
plantas=[]
assert not conferir_texto('registo relativo ao repositório')
for i,nome_planta in enumerate(['utilizador','casa','temporario','projetos','worktrees']):
 erros=conferir_texto('conhecido-positivo '+pedacos[i]+' fim')
 mensagem='RP4N-i: caminho ou identificador local ('+nome_planta+')'
 assert mensagem in erros
 plantas.append({'nome':nome_planta,'mensagem':mensagem})
log=git('log' ,'-p','b84d21a3..HEAD')
diff=git('diff','b84d21a3','HEAD')
def procurar(padroes,ref='HEAD'):
 r=subprocess.run(['git','grep','-n','-F',*sum((['-e',x] for x in padroes),[]),ref],capture_output=True,text=True)
 if r.returncode not in (0,1):raise RuntimeError('RP4N-i: erro na procura da cabeça, código '+str(r.returncode))
 return r
positivo=procurar(['privacidade-i.py'])
assert positivo.returncode==0 and positivo.stdout.strip(), 'A procura não encontra o conhecido-positivo na cabeça'
plantas.append({'nome':'procura real na cabeça','mensagem':'RP4N-i: a procura da cabeça encontrou o conhecido-positivo','codigo':positivo.returncode})
ausente=procurar(['rp4ni-inexistente-'+hashlib.sha256(log.encode()).hexdigest()])
assert ausente.returncode==1 and not ausente.stdout
plantas.append({'nome':'procura sem ocorrência','mensagem':'RP4N-i: ausência distinguida do erro','codigo':ausente.returncode})
try:procurar(['privacidade-i.py'],'refs/rp4ni-ref-inexistente')
except RuntimeError as e:plantas.append({'nome':'erro real do git grep','mensagem':str(e)})
else:raise AssertionError('O erro da procura passou')
head=procurar(pedacos)
lista=[];novos=[]
for linha in head.stdout.splitlines():
 _,ficheiro,numero,conteudo=linha.split(':',3)
 anterior=subprocess.run(['git','show','b84d21a3:'+ficheiro],capture_output=True,text=True)
 if tmp in conteudo and conteudo in anterior.stdout.splitlines() and not any(x in conteudo for x in pedacos if x!=tmp):
  lista.append({'ficheiro':ficheiro,'linha':int(numero)})
 else:novos.append({'ficheiro':ficheiro,'linha':int(numero),'mensagens':conferir_texto(conteudo)})
legados=sorted(set(x['ficheiro'] for x in lista))
legados_com_nome=[f for f in legados if nome in git('show','HEAD:'+f)]
assert not legados_com_nome
resultado={'plantas':plantas,'legados_lidos':legados,'legados_com_nome':legados_com_nome,'codigo_procura_cabeca':head.returncode,'cabeca':git('rev-parse','HEAD').strip(),'base':'b84d21a3','historico_grep_c':contar(log,pedacos),'diff_grep_c':contar(diff,pedacos),'cabeca_sem_excecoes_grep_c':len(novos),'novos':novos,'padroes':['utilizador','casa','temporario','projetos','worktrees'],'legados_ficheiros':len(set(x['ficheiro'] for x in lista)),'RP4N-14':lista}
(BASE/'privacidade.json').write_text(json.dumps(resultado,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(resultado,ensure_ascii=False,indent=2))
if any(resultado[k] for k in ['historico_grep_c','diff_grep_c','cabeca_sem_excecoes_grep_c']):sys.exit(1)
