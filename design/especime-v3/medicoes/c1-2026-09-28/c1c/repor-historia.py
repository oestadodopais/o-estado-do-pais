"""Repõe a reconferência da DGAL e repete a aceitação sobre a história completa."""
import hashlib
import json
from pathlib import Path
import subprocess
import yaml
AQUI=Path(__file__).resolve().parent
RAIZ=AQUI.parents[4]
ID='indice-de-divida-limite-legal'
def git(p):
    return subprocess.check_output(['git','show',f'a677770f:{p}'],cwd=RAIZ,text=True)
p=RAIZ/f'ledger/claims/{ID}.yml'
antes=yaml.safe_load(git(p.relative_to(RAIZ)))
atual=yaml.safe_load(p.read_text())
assert atual['value']==antes['value']
assert atual['verifications'] in ([],antes['verifications'])
if not atual['verifications']:
    bloco='verifications:\n'+''.join('  - date: '+json.dumps(v['date'])+'\n'+''.join('    '+k+': '+json.dumps(v[k],ensure_ascii=False)+'\n' for k in ('path','result','by')) for v in antes['verifications'])
    p.write_text(p.read_text().replace('verifications: []\n',bloco))
reg=RAIZ/'ledger/cruzamentos/evora.json'
r=json.loads(reg.read_text())
original=json.loads(git('ledger/cruzamentos/evora.json'))['rows'][ID]
errado=r['rows'][ID]
if errado['exported_row_sha256']!=hashlib.sha256(p.read_bytes()).hexdigest():
    # A aceitação anterior selou a lista truncada. Repete-se a mesma revisão
    # sobre o registo anterior, conservando a aceitação errada nesta prova.
    for k,v in original.items():
        if k not in ('corrections_at_export','exported_row_sha256','site_corrections'):
            assert errado[k]==v
    assert errado['verifications_at_export']==len(antes['verifications'])
    (AQUI/'travessia-repetida.json').write_text(json.dumps({'origem':'a677770f','razao':'A aceitação anterior selou uma linha cuja lista tinha encolhido. Repete-se a revisão de proveniência sobre a lista completa, por decisão da retoma. A contagem de reconferências não muda.','aceitacao_anterior_errada':errado,'antes_da_proveniencia':original},ensure_ascii=False,indent=2)+'\n')
    r['rows'][ID]=original
    reg.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
    subprocess.run(['node','scripts/check-cruzamento.mjs','--accept-correction',ID],cwd=RAIZ,check=True)
prova=json.loads((AQUI/'dgal-proveniencia.json').read_text())
prova['depois']=yaml.safe_load(p.read_text())
prova['reconferencia_reposta_de']='a677770f'
prova['depois_sha256']=hashlib.sha256(p.read_bytes()).hexdigest()
(AQUI/'dgal-proveniencia.json').write_text(json.dumps(prova,ensure_ascii=False,indent=2)+'\n')
print('Reconferência reposta; revisão de proveniência aceite sobre a história completa.')
