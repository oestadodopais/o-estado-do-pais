"""Regista a leitura da marca na história dos excertos, sem mudar os valores."""
from pathlib import Path
import json
import re
import subprocess
import yaml
AQUI=Path(__file__).resolve().parent
RAIZ=AQUI.parents[4]
MOTIVO='O excerto passa a levar a marca de estado que a fonte imprime na mesma observação, lida a 28.09.2026; o valor não mudou.'
MOTIVO_EN='The excerpt now carries the status mark the source prints for the same observation, read on 28.09.2026; the value has not changed.'
provas=[]
for b in json.loads((AQUI.parent/'c1c/bandeiras.json').read_text())['linhas']:
 if b['id']=='divida-das-familias-2025-ue': continue
 p=RAIZ/'ledger/claims'/f'{b["id"]}.yml'; texto=p.read_text(); d=yaml.safe_load(texto)
 antigo=yaml.safe_load(subprocess.check_output(['git','show',f'b7f352ce:ledger/claims/{b["id"]}.yml'],cwd=RAIZ,text=True))
 entrada={'date':'2026-09-28','kind':'proveniencia','field':'excerpt','old_value':antigo['excerpt'],'new_value':d['excerpt'],'reason':MOTIVO,'reason_en':MOTIVO_EN}
 assert antigo['value']==d['value'] and antigo['access_date']==d['access_date']
 assert antigo['excerpt']!=d['excerpt'] and d['source_flag']==b['flag']
 cs=d['corrections']
 if entrada not in cs:
  assert not cs, 'Uma história existente exige revisão explícita.'
  texto,n=re.subn(r'^corrections: \[\]$',yaml.safe_dump({'corrections':[entrada]},allow_unicode=True,sort_keys=False,width=110).rstrip(),texto,flags=re.M)
  assert n==1;p.write_text(texto)
 provas.append({'id':b['id'],'entrada':entrada,'value':d['value'],'access_date_conservado':d['access_date']})
assert len(provas)==17
(AQUI/'excertos.json').write_text(json.dumps({'entradas':len(provas),'linhas':provas},ensure_ascii=False,indent=2)+'\n')
print(f'{len(provas)} proveniências de excerto, sem mudar valor ou acesso.')
