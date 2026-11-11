#!/usr/bin/env python3
"""Transporta a prova documental que o registo original referencia sem incorporar."""
import hashlib,json,subprocess,sys
from pathlib import Path

def sha(b):return hashlib.sha256(b).hexdigest()
site=Path(__file__).resolve().parents[4]
motor=Path(sys.argv[1]).resolve()
slug=sys.argv[2]
pasta=Path(__file__).resolve().parent
rel='content/19 Évora 2027 Capital Europeia da Cultura/ledger.json'
commit=subprocess.check_output(['git','-C',str(motor),'rev-parse','HEAD'],text=True).strip()
raw=(motor/rel).read_bytes()
assert raw==subprocess.check_output(['git','-C',str(motor),'show',f'{commit}:{rel}'])
claims={r['id']:r for r in json.loads(raw)['claims']}
corpos={};registos={};linhas={}
def ler(n):
 if isinstance(n,list):
  for x in n:ler(x)
 elif isinstance(n,dict):
  if n.get('source_body'):
   source=n['source_body'];assert not Path(source).is_absolute() and '..' not in Path(source).parts
   row=claims[n['row']];h=row['document']['source_sha256'];assert h==n['source_sha256']
   if source not in corpos:
    relative=source if source.startswith('content/') else 'content/'+source
    b=(motor/relative).read_bytes();assert sha(b)==h
    assert b==subprocess.check_output(['git','-C',str(motor),'show',f'{commit}:{relative}'])
    corpos[source]=h
   assert corpos[source]==h
   linhas[n['row']]={'source_body':source,'source_sha256':h}
  for v in n.values():
   if isinstance(v,(dict,list)):ler(v)
for lang in ['pt','en']:
 file=site/f'registos/{slug}/{lang}.record.json';r=json.loads(file.read_bytes());ler(r)
 registos[lang]={'edition':r['edition'],'lang':r['lang'],'file':str(file.relative_to(site)),'sha256':sha(file.read_bytes()),'objeto_sha256':sha(json.dumps(r,ensure_ascii=False,separators=(',',':')).encode())}
ledger=pasta/'livro-19-julgado.json';ledger.write_bytes(raw)
prova={'estudo':slug,'commit_motor':commit,'livro':{'file':str(ledger.relative_to(site)),'sha256':sha(raw),'origin_ref':rel+' @ '+commit},'registos':registos,'corpos':corpos,'linhas':linhas}
(pasta/'provas-documentais-evb-t.json').write_text(json.dumps(prova,ensure_ascii=False,indent=2)+'\n')
print(f'{len(linhas)} linhas, {len(corpos)} corpos conferidos contra os bytes e o commit; duas edições presas por resumo.')
