"""COR3: exportar os cinco documentos e conservar a história das edições."""
import argparse, copy, hashlib, json, re, subprocess, sys
from pathlib import Path
import yaml
p=argparse.ArgumentParser();p.add_argument('motor',type=Path);a=p.parse_args()
site=Path.cwd();sys.path.insert(0,str(a.motor))
from publisher import hb1_documentos as H, eo1_documentos as E, export_records_site as R
manifest=site/'studies-src/manifest.yml';old=yaml.safe_load(subprocess.check_output(['git','show','HEAD:studies-src/manifest.yml'],text=True));head=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
slugs={'orcamento-2027-o-que-muda-e-para-quem','a-casa-em-portugal-e-na-europa','penalizacoes-por-reforma-antecipada-2026'}
history={}
for e in old['edicoes']:
 if e['slug'] not in slugs:continue
 e=copy.deepcopy(e);versions=e['edicoes'];v=versions[-1];src=site/'studies-src'/v['file'];body=subprocess.check_output(['git','show','HEAD:studies-src/'+v['file']]);assert hashlib.sha256(body).hexdigest()==v['sha256']
 if v['data']=='2026-11-13':raise ValueError('A edição COR3 já está no manifesto')
 v['file']=f"_edicoes/{e['slug']}.{e['lang']}.{v['data']}.html";(site/'studies-src'/v['file']).write_bytes(body)
 if not e.get('primeira_edicao'):e['primeira_edicao']={'date':v['data'],'sha256':v['sha256'],'file':v['file'],'commit':head}
 history[e['slug'],e['lang']]=e
manifest.write_bytes(subprocess.check_output(['git','show','HEAD:studies-src/manifest.yml']))
E.run(site);H.run(site)
H.STUDY='11 Seguranca Social';H.SLUG='penalizacoes-por-reforma-antecipada-2026'
saved=H.E.EDITIONS;H.E.EDITIONS=(*saved,{'study':H.STUDY,'lang':'pt-PT','html':'Penalizações por Reforma Antecipada em Portugal (pt-PT).html'},)
H.run(site)
H.E.EDITIONS=saved
text=manifest.read_text()
for match in reversed(list(re.finditer(r'^  - slug: ([^\n]+)\n(?:(?!^  - slug:).)*',text,re.M|re.S))):
 block=match[0];e=yaml.safe_load(block)[0];key=(e['slug'],e['lang'])
 if key not in history:continue
 previous=history[key];e['edicoes']=previous['edicoes']+[{'data':'2026-11-13','sha256':e['sha256_normalized'],'file':f"{e['slug']}/{e['lang']}.html"}];e['primeira_edicao']=previous['primeira_edicao']
 replacement=yaml.safe_dump([e],allow_unicode=True,sort_keys=False,width=120);replacement=''.join('  '+l+'\n' for l in replacement.splitlines())
 text=text[:match.start()]+replacement+text[match.end():]
manifest.write_text(text)
archive=R.estudos_do_sitio(site);R.SITE_EDITIONS={k:v for k,v in R.SITE_EDITIONS.items() if v[0] in archive}
code=R.run(a.motor,site,write=True)
# O exportador percorre o catálogo; esta passagem só publica os três estudos.
regfile=site/'registos/manifest.json';reg=json.loads(regfile.read_text());before=json.loads(subprocess.check_output(['git','show','HEAD:registos/manifest.json']))
for key,entry in before['registos'].items():
 if key.split('/')[0] in slugs:continue
 reg['registos'][key]=entry
 f='registos/'+key+'.record.json';(site/f).write_bytes(subprocess.check_output(['git','show','HEAD:'+f]))
regfile.write_text(json.dumps(reg,ensure_ascii=False,indent=2)+'\n')
raise SystemExit(code)
