"""Prepara as provas públicas HB1 sem copiar os corpos integrais das fontes."""
import argparse,json,hashlib
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('motor',type=Path);a=p.parse_args()
b=json.loads((a.motor/'content/28 Habitacao Estudo/ledger.json').read_text())['claims'];rows={}
for r in b:
 if not (r.get('afirmacao') or r.get('unit') == 'texto' and (r['id'].startswith(('hab-imprensa-', 'hab-arrendamento-exposicao')) or r['id'] == 'hab-plataforma-reivindicacoes')):continue
 f=a.motor/r['document']['file'];receipt=json.loads(Path(str(f)+'.pedido.json').read_text())
 rows[r['id']]={'row':{k:r.get(k) for k in ['id','value','excerpt','unit','reference_date','published_at','attributed_to','attributed_to_en','afirmacao','source_url','document','document_checks']},'receipt':receipt}
 ref=r.get('document_checks',{}).get('reference_date',{})
 if ref.get('file'):
  rel=Path(ref['file'])
  if rel.is_absolute() or '..' in rel.parts or rel.parts[0]!='source':raise ValueError('HB1 referência: caminho fora de source')
  source=Path('content/23 Habitacao')/rel
  raw=(a.motor/source).read_bytes()
  rr=json.loads(Path(str(a.motor/source)+'.pedido.json').read_text())
  assert hashlib.sha256(raw).hexdigest()==ref['sha256']==rr['sha256'] and rr['estado']==200, r['id']
  rows[r['id']]['reference_source']={'file':source.as_posix(),'sha256':ref['sha256'],'receipt':rr}

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
