"""Confere os achados plantados, os bytes citados, as cabeças e os trailers."""
from pathlib import Path
import os,json,subprocess,hashlib
import yaml
b=Path(__file__).parent;out=b/'i';site=Path.cwd();motor=Path(os.environ['RESEARCHHUB_DIR'])
def git(p,*args):return subprocess.check_output(['git',*args],cwd=p,text=True).strip()
def escreve(n,d):(out/n).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
linhas=[]
for repo,p,prefix in [('sitio',site,'ledger/claims'),('motor',motor,'publisher/recortes')]:
 for id in ['penalizacao-antecipacao-um-ano-neutra','penalizacao-legal-um-ano-antecipacao-2026']:
  l=yaml.safe_load((p/prefix/(id+'.yml')).read_text())
  assert l['access_date']=='2026-08-24' and l['access_date_kind']=='hosted-copy'
  linhas.append({'repositorio':repo,'id':id,'access_date':l['access_date'],'access_date_kind':l['access_date_kind']})
m=json.loads((out/'medidas.json').read_text())
assert m['recibos']['pensao-pt']['datas_rotuladas']==['Cópia alojada a 24.08.2026']*3
assert any('paragraph below Figure 8.4' in x for x in m['recibos']['legal-en']['localizadores'])
h=json.loads((b/'h/medidas.json').read_text())
assert f"| Páginas com marca | 38 | {len(h['paginas_com_marcas'])} |" in (b/'LEIA-ME.md').read_text()
escreve('plantas-da-direcao.json',{'linhas':linhas,'datas_definicoes':m['recibos']['pensao-pt']['datas_rotuladas'],'localizador_legal_en':m['recibos']['legal-en']['localizadores'],'paginas_com_marca_h':len(h['paginas_com_marcas']),'sitio':git(site,'rev-parse','HEAD'),'motor':git(motor,'rev-parse','HEAD')})
for nome,p,base in [('sitio',site,'c2630801'),('motor',motor,'e2fd95f')]:
 commits=[]
 for c in git(p,'rev-list','--reverse',base+'..HEAD').splitlines():
  msg=git(p,'show','-s','--format=%B',c)
  co='Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>'
  sess='Claude-Session: https://claude.ai/code/session_01FHYNTtspyh84DJTCarQ444'
  assert (co+'\n'+sess in msg) if nome=='sitio' else (co in msg and 'Claude-Session:' not in msg)
  commits.append({'sha':c,'titulo':git(p,'show','-s','--format=%s',c)})
 escreve('commits-'+nome+'.json',{'base':git(p,'rev-parse',base),'cabeca':git(p,'rev-parse','HEAD'),'commits':commits})
# Ficheiros de outras corridas permanecem byte a byte iguais à cabeça recebida.
proibidos=['indicators/*.json','indicators/vintages.json','.maintenance-locks/','sweeps/','publisher/recortes/manifest.regioes.json']
assert not git(motor,'diff','--name-only','e2fd95f','HEAD','--',*proibidos)
print('RP4N-i: achados plantados ausentes, trailers e âmbito conferidos.')
