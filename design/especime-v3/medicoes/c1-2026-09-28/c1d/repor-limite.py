"""Repõe a linha cruzada e a entrada do cruzamento exatamente como decidido."""
from pathlib import Path
import subprocess,json,hashlib,yaml
AQUI=Path(__file__).resolve().parent;RAIZ=AQUI.parents[4]
id='indice-de-divida-limite-legal';nome=f'ledger/claims/{id}.yml'
ler=lambda p:subprocess.check_output(['git','show',f'a677770f:{p}'],cwd=RAIZ)
antes=(RAIZ/nome).read_bytes();antiga=ler(nome)
assert yaml.safe_load(antes)['value']==yaml.safe_load(antiga)['value']=='150'
regpath=RAIZ/'ledger/cruzamentos/evora.json';reg=json.loads(regpath.read_text());origem=json.loads(ler('ledger/cruzamentos/evora.json'))['rows'][id]
assert origem['exported_row_sha256']==hashlib.sha256(antiga).hexdigest()
(RAIZ/nome).write_bytes(antiga);reg['rows'][id]=origem;regpath.write_text(json.dumps(reg,ensure_ascii=False,indent=2)+'\n')
(AQUI/'limite-reposto.json').write_text(json.dumps({'id':id,'origem':'a677770f','linha_sha256':hashlib.sha256(antiga).hexdigest(),'valor_conservado':'150','acesso':yaml.safe_load(antiga)['access_date'],'verifications':yaml.safe_load(antiga)['verifications'],'corrections':yaml.safe_load(antiga)['corrections'],'cruzamento':origem},ensure_ascii=False,indent=2)+'\n')
print('Linha e entrada do cruzamento repostas; valor 150 conservado.')
