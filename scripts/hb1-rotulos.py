"""Fixa os rótulos HB1 e os seus localizadores contra a travessia e o motor."""
import argparse,json,hashlib,yaml
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('motor',type=Path);a=p.parse_args()
sha=lambda b:hashlib.sha256(b).hexdigest()
cruzamento=json.loads(Path('ledger/cruzamentos/hb1.json').read_text());livros={};rows={}
for id,c in cruzamento['rows'].items():
 f=Path('ledger/claims')/(id+'.yml');raw=f.read_bytes();assert sha(raw)==c['exported_row_sha256'],id
 r=yaml.safe_load(raw)
 if not r.get('name'):continue
 estudo=c['rh_study']
 if estudo not in livros:livros[estudo]={r['id']:r for r in json.loads((a.motor/'content'/estudo/'ledger.json').read_text())['claims']}
 origem=livros[estudo][c['rh_id']]
 assert sha(json.dumps(origem,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())==c['origin_row_sha256'],id
 assert origem['name']==r['name'] and origem['name_source']==r['name_source'],id
 rows[id]={'linha':{k:r.get(k) for k in ['id','study','name','name_source','document','excerpt','reference_date']},'origem':{k:c[k] for k in ['rh_study','rh_id','origin_row_sha256','exported_row_sha256']}}
Path('ledger/provas/hb1/rotulos.json').write_text(json.dumps({'rows':rows},ensure_ascii=False,indent=2)+'\n')
print(len(rows),'rótulos e localizadores conferidos contra as linhas do motor e a travessia')
