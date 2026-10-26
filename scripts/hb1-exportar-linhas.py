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
 # HB1-f: published_at_kind (last-edited no glossário e na IL) vem do motor, provado no corpo.
# HB1-c (o achado 15 da leitura da HB1-b): uma linha que nunca chegou ao sítio
# não tem correção pública. O estudo está em preparação (`date: null` em
# `src/data/datas-de-publicacao.json`), e a exportação não escreve entradas
# `kind: "correcao"`; o contrato confere-o `tests/hb1/preparacao-sem-correcoes.mjs`.
# HB1-c (a recomposição sobre as três linhas partilhadas): uma linha que outra
# travessia do sítio já prende (o estudo do Orçamento, `ledger/cruzamentos/eo1.json`)
# fica na versão dessa travessia; a do HB1 não a reescreve.
outras=set()
for f in sorted((site/'ledger/cruzamentos').glob('*.json')):
 if f.name=='hb1.json':continue
 d=json.loads(f.read_text())
 if isinstance(d.get('rows'),dict):outras|=set(d['rows'])
partilhadas=[r['site_id'] for r in b['rows'] if r['site_id'] in outras]
b['rows']=[r for r in b['rows'] if r['site_id'] not in outras]
# A guarda dos órfãos do exportador lê `hb1.json`: uma linha que outra travessia
# prende não fica órfã quando sai deste registo, porque a guarda dela continua
# no registo dessa travessia; sai daqui antes da exportação.
reg=site/'ledger/cruzamentos/hb1.json'
if reg.exists():
 d=json.loads(reg.read_text())
 if any(k in outras for k in d.get('rows',{})):
  d['rows']={k:v for k,v in d['rows'].items() if k not in outras};reg.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
if partilhadas:print('HB1: linhas prendidas por outra travessia, deixadas na versão dela: '+', '.join(sorted(partilhadas)))
cache=a.motor/'publisher/recortes/manifest.hb1.json';had_cache=cache.exists()
with tempfile.TemporaryDirectory() as tmp:
 f=Path(tmp)/'manifest.hb1.json';f.write_text(json.dumps(b,ensure_ascii=False,indent=2)+'\n')
 subprocess.run([sys.executable,'-m','publisher.export_site_rows','--manifest',str(f),'--site',str(site),'--write'],cwd=a.motor,check=True)

# O exportador comum cria também um manifesto vazio quando não há recortes.
if not had_cache and cache.exists() and json.loads(cache.read_text()).get("crops")=={}:cache.unlink()
