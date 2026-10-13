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
# A exceção é o par commit/linha, nunca um padrão liberado no ramo.
aceites={
 '5e4ccb25ef9134cbc1e6dccf031a28656535b85d':'1fc80ee96740572e6023836205049c7f3e0cb60c1d4bb79c9dd97f7e1bc75450',
 'd430d6dd1e17e4f1f23acc7273321f5e4380beff':'3994efec96432c5cc683f15428bd20176e211497d58176c747f51cbfa30bc903',
}
def conferir_excecao(commit,linha):
 if commit not in aceites:
  return ['RP4N-i: outro commit não recebe a exceção histórica']
 if aceites[commit]!=hashlib.sha256(linha.encode()).hexdigest() or casa not in linha or any(p in linha for p in pedacos if p!=casa):
  return ['RP4N-i: ocorrência nova não recebe a exceção histórica']
 return []
def excecao(commit,linha):
 return not conferir_excecao(commit,linha)
log=git('log','-p','--format=RP4NI-COMMIT:%H','b84d21a3..HEAD')
excecoes=[];restantes=[];commit=None
for linha in log.splitlines():
 if linha.startswith('RP4NI-COMMIT:'):commit=linha.split(':',1)[1]
 if not conferir_texto(linha):continue
 if excecao(commit,linha):
  excecoes.append({'commit':commit,'sha256_linha':hashlib.sha256(linha.encode()).hexdigest()})
  for nome_planta,c,l in [('prefixo novo num commit aceite',commit,linha+' nova ocorrência'),('prefixo aceite noutro commit','0'*40,linha)]:
   erros=conferir_excecao(c,l)
   assert erros and not excecao(c,l)
   plantas.append({'nome':nome_planta,'mensagem':erros[0]})
 else:restantes.append({'commit':commit,'mensagens':conferir_texto(linha)})
assert {x['commit'] for x in excecoes}==set(aceites)
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
resultado={'plantas':plantas,'legados_lidos':legados,'legados_com_nome':legados_com_nome,'codigo_procura_cabeca':head.returncode,'cabeca':git('rev-parse','HEAD').strip(),'base':'b84d21a3','historico_grep_c':contar(log,pedacos),'historico_sem_excecoes':len(restantes),'historico_novo':restantes,'RP4N-17':{'estado':'aceite','excecoes':excecoes,'razao':'Prefixo genérico sem nome de utilizador nem disposição da máquina. Exceção aprovada no mandato RP4-n-i; ramo publicado, sem reescrita. Qualquer ocorrência nova continua proibida.'},'diff_grep_c':contar(diff,pedacos),'cabeca_sem_excecoes_grep_c':len(novos),'novos':novos,'padroes':['utilizador','casa','temporario','projetos','worktrees'],'legados_ficheiros':len(set(x['ficheiro'] for x in lista)),'RP4N-14':lista}
(BASE/'privacidade.json').write_text(json.dumps(resultado,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(resultado,ensure_ascii=False,indent=2))
if any(resultado[k] for k in ['historico_sem_excecoes','diff_grep_c','cabeca_sem_excecoes_grep_c']):sys.exit(1)
