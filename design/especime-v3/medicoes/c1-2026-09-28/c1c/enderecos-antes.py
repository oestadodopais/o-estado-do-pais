"""Mede os endereços divergentes antes de aplicar a decisão de retoma."""
import json
from pathlib import Path
import subprocess
import yaml
AQUI=Path(__file__).resolve().parent
RAIZ=AQUI.parents[4]
BASE='e38d5f8b'
nomes=subprocess.check_output(['git','ls-tree','-r','--name-only',BASE,'--','ledger/claims'],cwd=RAIZ,text=True).splitlines()
linhas=[]
for nome in nomes:
    c=yaml.safe_load(subprocess.check_output(['git','show',f'{BASE}:{nome}'],cwd=RAIZ,text=True))
    historia=sorted([x for x in c.get('corrections',[]) if x.get('kind')=='proveniencia' and x.get('field')=='source_url'],key=lambda x:x['date'])
    entradas=[]
    for v in c.get('verifications',[]) or []:
        if v['path']==c.get('source_url'): continue
        esperado=historia[0]['old_value'] if historia else c.get('source_url')
        for x in historia:
            if x['date']<=v['date']: esperado=x['new_value']
        entradas.append({'date':v['date'],'path':v['path'],'explicado':bool(historia) and v['path']==esperado})
    if entradas: linhas.append({'id':c['id'],'source_url':c.get('source_url'),'historia_tipificada':historia,'verificacoes':entradas})
fora=[c for c in linhas if any(not v['explicado'] for v in c['verificacoes'])]
r={'cabeca':BASE,'linhas_lidas':len(nomes),'linhas_com_endereco_diferente':len(linhas),'linhas_sem_historia_explicativa':len(fora),'verificacoes_sem_historia_explicativa':sum(not v['explicado'] for c in fora for v in c['verificacoes']),'regra_aplicada':'Só as reconferências anteriores a uma mudança tipada de source_url são comparadas com o endereço em vigor nesse dia. As restantes não são obrigadas a coincidir com o endereço atual: existem pedidos de releitura diferentes sem uma mudança de proveniência registada. Esta medição não infere que tenham mudado a origem da linha.','linhas':linhas}
(AQUI/'enderecos-antes.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in r.items() if k!='linhas'},ensure_ascii=False))
