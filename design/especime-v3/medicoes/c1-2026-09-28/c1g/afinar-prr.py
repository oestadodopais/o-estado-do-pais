"""Afina só as razões autorizadas e corrige o registo das cinco aceitações."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import yaml
AQUI=Path(__file__).resolve().parent
RAIZ=AQUI.parents[4]
p=AQUI.parent/'c1f/conferir-acessos.py'
s=importlib.util.spec_from_file_location('acessos',p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
p=RAIZ/'ledger/cruzamentos/evora.json';reg=json.loads(p.read_text())
base=json.loads(subprocess.check_output(['git','show','cb43b2fc:ledger/cruzamentos/evora.json'],cwd=RAIZ,text=True))
provas=[]
for id in m.IDS:
 p=RAIZ/f'ledger/claims/{id}.yml';texto=p.read_text();antes=yaml.safe_load(texto);depois=copy.deepcopy(antes)
 _,entradas=m.reconstruir(id)
 for c,e in zip([c for c in depois['corrections'] if c.get('field')=='access_date'],entradas):
  for campo in ('reason','reason_en'):
   texto=texto.replace(json.dumps(c[campo],ensure_ascii=False),json.dumps(e[campo],ensure_ascii=False));c[campo]=e[campo]
 assert yaml.safe_load(texto)==depois and antes['value']==depois['value']
 r=reg['rows'][id];h=hashlib.sha256(p.read_bytes()).hexdigest();assert h==r['exported_row_sha256']
 n=base['rows'][id]['corrections_at_export'];total=len(antes['corrections'])
 assert len(r['site_corrections'])==1 and total==n+2
 r['corrections_at_export']=n;r['exported_at']='2026-09-28'
 r['site_corrections'][0].update(date='2026-09-28',corrections_before=n,corrections_after=total)
 p.write_text(texto);novo=hashlib.sha256(p.read_bytes()).hexdigest()
 r['site_corrections'].append({'date':'2026-09-28','kind':'proveniencia','corrections_before':total,'corrections_after':total,'sha256_antes':h,'sha256_depois':novo,'reason':'Afinação autorizada das datas e das palavras das razões na C1g; nenhuma entrada acrescentada.'})
 r['exported_row_sha256']=novo
 provas.append({'id':id,'valor_intacto':True,'corrections_at_export':n,'corrections_after':total,'sha256_antes':h,'sha256_depois':novo})
(RAIZ/'ledger/cruzamentos/evora.json').write_text(json.dumps(reg,ensure_ascii=False,indent=2)+'\n')
(AQUI/'prr.json').write_text(json.dumps({'linhas':provas,'entradas_acrescentadas':0,'razoes_afinadas':20},ensure_ascii=False,indent=2)+'\n')
