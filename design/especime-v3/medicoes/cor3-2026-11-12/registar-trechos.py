import sys,os,pathlib,json,hashlib,runpy,re,yaml
site=pathlib.Path.cwd();base=site/'design/especime-v3/medicoes/cor3-2026-11-12';m=pathlib.Path(os.environ['RESEARCHHUB_DIR']);sys.path.insert(0,str(m));from core.reconcile import visible_text;from core.documento_md import render
c=runpy.run_path(str(base/'conferir-composto-cor3.py'));cases,sheets=c['cases']();slugs={'orcamento':'orcamento-2027-o-que-muda-e-para-quem','habitacao':'a-casa-em-portugal-e-na-europa','reforma':'penalizacoes-por-reforma-antecipada-2026'};out=[];manifest=yaml.safe_load((site/'studies-src/manifest.yml').read_text())
for r in cases:
 if not r['depois']:continue
 leaf=base/('FOLHA-'+r['estudo']+'-decidida.md');assert r['depois'] in leaf.read_text()
 f='studies-src/'+slugs[r['estudo']]+'/'+r['lingua']+'.html';literal=visible_text(r['depois'] if re.search(r'</?(?:p|span|strong)\b',r['depois']) else render(r['depois']),is_html=True);literal=re.sub(r'\s+',' ',literal.replace('\u202f',' ').replace('\xa0',' ')).strip()
 previous=next(e for e in manifest['edicoes'] if e['slug']==slugs[r['estudo']] and e['lang']==r['lingua'])['edicoes'][-2]
 before=visible_text(r['antes'] if re.search(r'</?(?:p|span|strong)\b',r['antes']) else render(r['antes']),is_html=True);before=re.sub(r'\s+',' ',before.replace('\u202f',' ').replace('\xa0',' ')).strip()
 out.append(dict(antes=r['antes'],literal_antes=before,anterior='studies-src/'+previous['file'],sha256_anterior=previous['sha256'],estudo=slugs[r['estudo']],lingua=r['lingua'],correcao=r['correcao'],folha=leaf.relative_to(site).as_posix(),sha256_folha=hashlib.sha256(leaf.read_bytes()).hexdigest(),depois=r['depois'],literal=literal,documento=f,sha256_documento=hashlib.sha256((site/f).read_bytes()).hexdigest()))
(base/'TRECHOS-COR3.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(len(out),'trechos decididos, sem aprovar o restante texto')
