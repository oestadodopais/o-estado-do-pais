"""Confere a edição nova de tespm140 e replica as linhas SITE com a data provada."""
import argparse,hashlib,json,sys,yaml
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('motor',type=Path);a=p.parse_args()
sys.path.insert(0,str(a.motor))
from publisher.habitacao import cell
body=a.motor/'content/23 Habitacao/source/eurostat/hb1b-tespm140.json'
j=json.loads(body.read_text());receipt=json.loads(body.with_suffix('.json.pedido.json').read_text())
assert hashlib.sha256(body.read_bytes()).hexdigest()==receipt['sha256']
for geo,suffix in [('PT',''),('EU27_2020','-ue')]:
 f=Path('ledger/claims/sobrecarga-do-custo-da-habitacao-2025'+suffix+'.yml');r=yaml.safe_load(f.read_text())
 coords={d:next(iter(j['dimension'][d]['category']['index'])) for d in j['id']};coords.update(geo=geo,time='2025')
 for d,v in [('sex','T'),('age','TOTAL'),('unit','PC')]:
  if d in coords:coords[d]=v
 idx,value,flag=cell(j,coords)
 assert float(str(r['value']).replace(',','.'))==float(value)
 r['published_at']=j['updated'][:10]
 r['note']=r['note'].split(' HB1-b:')[0]+' HB1-b: valor e data de atualização reconferidos no corpo tespm140 alojado em content/23 Habitacao/source/eurostat/hb1b-tespm140.json; SHA-256 '+receipt['sha256']+'.'
 f.write_text(yaml.safe_dump(r,allow_unicode=True,sort_keys=False,width=1000))
snapshot=a.motor/'content/28 Habitacao Estudo/Technical Source/series-do-sitio'
b=json.loads((snapshot/'ledger.json').read_text());orig=json.loads((snapshot/'origem.json').read_text())
for e in orig:
 f=Path(e['ficheiro']);e['sha256']=hashlib.sha256(f.read_bytes()).hexdigest()
 b['claims']=[yaml.safe_load(f.read_text()) if r['id']==f.stem else r for r in b['claims']]
(snapshot/'ledger.json').write_text(json.dumps(b,ensure_ascii=False,indent=2)+'\n')
(snapshot/'origem.json').write_text(json.dumps(orig,ensure_ascii=False,indent=2)+'\n')
print('tespm140: valores SITE iguais ao corpo novo; published_at e cópia de origem selados.')
