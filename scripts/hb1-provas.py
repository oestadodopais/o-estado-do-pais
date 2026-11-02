"""Prepara as provas públicas HB1 sem copiar os corpos integrais das fontes."""
import argparse,json,hashlib,subprocess
from pathlib import Path
from projecao_linha import projecao_linha

p=argparse.ArgumentParser()
p.add_argument('motor',type=Path,nargs='?')
p.add_argument('--series-main',action='store_true',help='Migra só os resumos das séries, conferindo os bytes de main contra a prova existente.')
a=p.parse_args()
if a.series_main:
 prova=Path('ledger/provas/hb1/series.json')
 dados=json.loads(prova.read_text())
 for id,r in dados['rows'].items():
  if r['file'] != f'ledger/claims/{id}.yml' or '/' in id or '..' in id:
   raise ValueError('HB1: caminho de série inválido')
  raw=subprocess.check_output(['git','show','main:'+r['file']])
  projetado=projecao_linha(raw)
  antigo=r['sha256'];novo=hashlib.sha256(projetado).hexdigest()
  if antigo not in (hashlib.sha256(raw).hexdigest(),novo):
   raise ValueError(f'{id}: main diverge da prova existente')
  if projecao_linha(Path(r['file']).read_bytes()) != projetado:
   raise ValueError(f'{id}: a worktree diverge de main fora das releituras')
  r['sha256']=novo
  print(id,antigo,'->',novo)
 prova.write_text(json.dumps(dados,ensure_ascii=False,indent=2)+'\n')
 raise SystemExit(0)
if a.motor is None:p.error('indica o motor ou --series-main')
b=json.loads((a.motor/'content/28 Habitacao Estudo/ledger.json').read_text())['claims'];rows={}
# HB1-c: uma linha que outra travessia do sítio prende (as três linhas partilhadas
# com o estudo do Orçamento) prova-se pela conferência dessa travessia, na versão
# dela; as provas HB1 ficam com as linhas que só o HB1 exporta.
outras=set()
for f in sorted(Path('ledger/cruzamentos').glob('*.json')):
 if f.name=='hb1.json':continue
 d=json.loads(f.read_text())
 if isinstance(d.get('rows'),dict):outras|=set(d['rows'])
b=[r for r in b if r['id'] not in outras]
for r in b:
 if not (r.get('afirmacao') or r.get('unit') == 'texto' and (r['id'].startswith(('hab-imprensa-', 'hab-arrendamento-exposicao')) or r['id'] == 'hab-plataforma-reivindicacoes')):continue
 f=a.motor/r['document']['file'];receipt=json.loads(Path(str(f)+'.pedido.json').read_text())
 rows[r['id']]={'row':{k:r.get(k) for k in ['id','value','excerpt','unit','reference_date','period','published_at','published_at_kind','attributed_to','attributed_to_en','afirmacao','source_url','document','document_checks']},'receipt':receipt}
 # HB1-c3: o período só segue quando é o ano dos dados ancorado no excerto; nas outras
 # linhas o motor copia a data de referência para o período, e o sítio não o publica.
 if 'period' not in (r.get('document_checks') or {}):rows[r['id']]['row'].pop('period')
 # HB1-f: o que a data de published_at é, só quando o motor o diz.
 if rows[r['id']]['row'].get('published_at_kind') is None:rows[r['id']]['row'].pop('published_at_kind')
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
 f=Path('ledger/claims')/(id+'.yml');raw=f.read_bytes()
 atual=yaml.safe_load(raw);composto=dict(r)
 atual.pop('verifications',None);composto.pop('verifications',None)
 assert atual==composto,(id,'a cópia diverge do sítio fora das releituras')
 rows[id]={'file':f.as_posix(),'sha256':hashlib.sha256(projecao_linha(raw)).hexdigest(),'study':r['study']}
(p/'series.json').write_text(json.dumps({'rh_study':'28 Habitacao Estudo','snapshot':'content/28 Habitacao Estudo/Technical Source/series-do-sitio/ledger.json','rows':rows},ensure_ascii=False,indent=2)+'\n')
print(len(rows),'linhas do sítio conferidas contra a cópia composta')
