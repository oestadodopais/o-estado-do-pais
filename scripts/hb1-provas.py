"""Prepara as provas públicas HB1 sem copiar os corpos integrais das fontes."""
import argparse,json
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('motor',type=Path);a=p.parse_args()
b=json.loads((a.motor/'content/28 Habitacao Estudo/ledger.json').read_text())['claims'];rows={}
for r in b:
 if not r.get('afirmacao'):continue
 f=a.motor/r['document']['file'];receipt=json.loads(Path(str(f)+'.pedido.json').read_text())
 rows[r['id']]={'row':{k:r.get(k) for k in ['id','value','excerpt','unit','reference_date','published_at','attributed_to','afirmacao','source_url','document','document_checks']},'receipt':receipt}
p=Path('ledger/provas/hb1');p.mkdir(parents=True,exist_ok=True);(p/'provas.json').write_text(json.dumps({'rows':rows},ensure_ascii=False,indent=2)+'\n')
print(len(rows),'afirmações com provas e recibos, sem corpos')
import hashlib,yaml
rows={}
origin=a.motor/'content/28 Habitacao Estudo/Technical Source/series-do-sitio/ledger.json'
snapshot={r['id']:r for r in json.loads(origin.read_text())['claims']}
for id,r in snapshot.items():
 f=Path('ledger/claims')/(id+'.yml');raw=f.read_bytes();assert yaml.safe_load(raw)==r,(id,'a cópia diverge do sítio')
 rows[id]={'file':f.as_posix(),'sha256':hashlib.sha256(raw).hexdigest(),'study':r['study']}
(p/'series.json').write_text(json.dumps({'rh_study':'28 Habitacao Estudo','snapshot':'content/28 Habitacao Estudo/Technical Source/series-do-sitio/ledger.json','rows':rows},ensure_ascii=False,indent=2)+'\n')
print(len(rows),'linhas do sítio conferidas contra a cópia composta')
