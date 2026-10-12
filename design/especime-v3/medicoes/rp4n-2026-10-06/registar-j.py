"""Conserva as cabeças, os commits e os trailers da integração conferida."""
from pathlib import Path
import os,json,subprocess,hashlib
site=Path.cwd();motor=Path(os.environ['RESEARCHHUB_DIR']);out=Path(os.environ['RP4NJ_SAIDA']);out.mkdir(parents=True,exist_ok=True)
def git(repo,*args):return subprocess.check_output(['git',*args],cwd=repo,text=True).strip()
resultado={};trailers=[]
for nome,repo,base in [('sitio',site,'3ecc7c72'),('motor',motor,'2d32da6')]:
 assert not git(repo,'status','--porcelain'),'Árvore suja no registo final'
 commits=[]
 for h in git(repo,'rev-list','--reverse',base+'..HEAD').splitlines():
  corpo=git(repo,'show','-s','--format=%B',h)
  trailer='Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>'
  if nome=='sitio':trailer+='\nClaude-Session: https://claude.ai/code/session_01FHYNTtspyh84DJTCarQ444'
  assert trailer in corpo
  commits.append({'hash':h,'assunto':git(repo,'show','-s','--format=%s',h)})
  trailers.append({'repositorio':nome,'commit':h,'trailers_adjuntos':True})
 resultado[nome]={'base':git(repo,'rev-parse',base),'cabeca':git(repo,'rev-parse','HEAD'),'arvore':'limpa','commits':commits}
regra='tests/cartao/publicador-da-definicao.mjs';original=subprocess.check_output(['git','show','3ecc7c72:'+regra],cwd=site)
assert (site/regra).read_bytes()==original
changed=git(motor,'diff','--name-only','2d32da6','HEAD').splitlines()
proibidos=[p for p in changed if (p.startswith('indicators/') and p.count('/')==1 and p.endswith('.json')) or p.startswith(('.maintenance-locks/','sweeps/')) or p=='publisher/recortes/manifest.regioes.json']
assert not proibidos
for nome,dados in [('commits',resultado),('trailers',trailers),('ambito',{'regra_publicador_intacta':True,'regra_sha256':hashlib.sha256(original).hexdigest(),'ficheiros_motor_alterados':changed,'ficheiros_proibidos_alterados':proibidos})]:
 (out/(nome+'.json')).write_text(json.dumps(dados,ensure_ascii=False,indent=2)+'\n')
print('Cabeças limpas, commits, trailers e âmbito conferidos.')
