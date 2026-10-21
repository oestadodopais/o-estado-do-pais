"""Adapta a notação dos períodos ao sítio e usa o exportador comum."""
import argparse,json,subprocess,sys,tempfile,yaml
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('motor',type=Path);a=p.parse_args();site=Path.cwd()
b=json.loads((a.motor/'publisher/manifest.hb1.json').read_text())
for r in b['rows']:
 period=r.get('reference_date')
 if period and '-Q' in period:r['reference_date']=period.replace('-Q','-T')
 elif period and '/' in period:
  r['reference_date']=period.rsplit('/',1)[1];r['note_extra']='Período completo da fonte: '+period+'.'
 elif not period:r['reference_date']='[a verificar]'
 if r.get('document') is not None and not r['document'].get('edition'):r['document']['edition']='[a verificar]'
# HB1-b: os excertos ampliados são valores textuais. A correção conserva o
# valor anteriormente exportado, sem o copiar à mão para o manifesto.
book={r['id']:r for r in json.loads((a.motor/'content/28 Habitacao Estudo/ledger.json').read_text())['claims']}
for spec in b['rows']:
 f=site/'ledger/claims'/(spec['site_id']+'.yml')
 if not f.exists():continue
 old=yaml.safe_load(f.read_text());new=book[spec['rh_id']]
 reason='HB1-b: excerto ampliado às orações contíguas do corpo alojado, com o rótulo e a coluna quando se trata de um quadro.'
 if old.get('unit') in ['texto','afirmação'] and (old['value']!=new['value'] or any(c.get('reason')==reason for c in old.get('corrections',[]))):
  spec['corrections']=[dict(date='2026-10-21',kind='correcao',old_value='__valor_anterior__',new_value='__valor__',reason=reason,reason_en='HB1-b: excerpt extended to contiguous clauses of the hosted body, including the label and column for a table.')]
cache=a.motor/'publisher/recortes/manifest.hb1.json';had_cache=cache.exists()
with tempfile.TemporaryDirectory() as tmp:
 f=Path(tmp)/'manifest.hb1.json';f.write_text(json.dumps(b,ensure_ascii=False,indent=2)+'\n')
 subprocess.run([sys.executable,'-m','publisher.export_site_rows','--manifest',str(f),'--site',str(site),'--write'],cwd=a.motor,check=True)

# O exportador comum cria também um manifesto vazio quando não há recortes.
if not had_cache and cache.exists() and json.loads(cache.read_text()).get("crops")=={}:cache.unlink()
