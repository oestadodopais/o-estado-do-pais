import os,sys,json
from pathlib import Path
m=Path(os.environ['RESEARCHHUB_DIR']);sys.path.insert(0,str(m))
from publisher import export_site_rows as X
book=json.loads((m/'content/11 Seguranca Social/ledger.json').read_text());by={r['id']:r for r in book['claims']};rows=[]
for id in ['flexibilizacao-idade-minima','flexibilizacao-carreira-minima','desemprego-longa-duracao-idade-referencia']:
 r=by[id];d=r.get('document') or {};doc={k:d[k] for k in ['title','page','source_sha256'] if k in d}
 if not d:doc={'title':'Reformar as Pensões em Portugal: Por um Sistema Sustentável, Adequado e Justo — um Contrato entre Gerações','page':303}
 doc.update(locator=f"p. {doc['page']} do PDF",edition='2026',kind='pdf')
 rows.append(dict(rh_study='11 Seguranca Social',rh_id=id,site_id=id,study='penalizacoes-por-reforma-antecipada-2026',unit=r.get('unit') or 'anos',reference_date=r.get('reference_date') or '2026',source='Instituto da Segurança Social, I.P.' if d else 'Grupo de Trabalho para a Reforma da Seguranca Social',document=doc,excerpt_override=r['excerpt'],value_mode='rh_value',locator_from='ledger.json'))
b={'site_ledger_dir':'ledger/claims','site_record':'ledger/cruzamentos/cor3-reforma.json','rows':rows,'excluded':[],'retired':[]};p=m/'publisher/manifest.cor3-reforma.json';p.write_text(json.dumps(b,ensure_ascii=False,indent=2)+'\n');sys.exit(X.main(['--manifest',str(p),'--site',str(Path.cwd()),'--write']))
