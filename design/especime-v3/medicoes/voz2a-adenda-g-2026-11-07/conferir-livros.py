"""Diferenças autorizadas pela adenda G, contra o motor aee6017.
Uso: python3 <este guião> <motor>
"""
from pathlib import Path
import hashlib,json,subprocess,sys
motor=Path(sys.argv[1]).resolve();sys.path.insert(0,str(motor))
from core.assertions import normalised,_tight
from publisher.export_records import walk_figures
base='aee60173990d1c645719f782c47b14f65ee0fff5'
def antigo(p):return subprocess.check_output(['git','show',base+':'+p.relative_to(motor).as_posix()],cwd=motor)
def sha(b):return hashlib.sha256(b).hexdigest()
resultado=[]
for p in sorted(motor.glob('content/*/ledger.json')):
 a=json.loads(antigo(p));b=json.loads(p.read_bytes());n=p.parent.name[:2]
 campos=[k for k in a.keys()|b.keys() if a.get(k)!=b.get(k)]
 if not campos:continue
 assert n in ['04','14','18','19'],(n,campos)
 assert set(campos)==({'assertions','composto_de'} if n in ['18','19'] else {'assertions'})
 aa={x['id']:x for x in a['assertions']};bb={x['id']:x for x in b['assertions']}
 esperado='hospital-registos-sem-identidade-declarada' if n in ['04','18'] else 'so-previsionais'
 assert [k for k in aa.keys()|bb.keys() if aa.get(k)!=bb.get(k)]==[esperado]
 q='nenhuma das fontes afirma que são a mesma entidade' if n in ['04','18'] else 'none of them is an execution account'
 if n in ['04','18']:
  assert esperado not in aa and bb[esperado]['quotes']==[q]
 else:
  assert aa[esperado]['review']==bb[esperado]['review']
  assert bb[esperado]['quotes']==aa[esperado]['quotes']+[q]
 documentos=[]
 for d in p.parent.glob('*.md'):
  if _tight(q) in normalised(d):documentos.append(d.name)
 assert documentos,(n,'citação ausente')
 item={'estudo':n,'campos':sorted(campos),'asserção':{'id':esperado,'antes':aa.get(esperado),'depois':bb[esperado]},'ancorada_em':documentos,'resumos':[]}
 if 'composto_de' in campos:
  assert len(a['composto_de'])==len(b['composto_de'])
  for x,y in zip(a['composto_de'],b['composto_de']):
   if x==y:continue
   assert x.keys()==y.keys() and x['pasta']==y['pasta']
   f=motor/'content'/x['pasta']/'ledger.json'
   assert f.parent.name[:2] in ['04','14']
   assert x['ledger_sha256']==sha(antigo(f)) and y['ledger_sha256']==sha(f.read_bytes())
   item['resumos'].append({'fonte':x['pasta'],'antes':x['ledger_sha256'],'depois':y['ledger_sha256']})
 resultado.append(item)
 print(n,':',', '.join(sorted(campos)),';',esperado,'; citação na prosa:',len(documentos))
 for r in item['resumos']:print(' ',r['fonte'],r['antes'],'->',r['depois'])
for fonte,destino,id in [('04','18','hospital-registos-sem-identidade-declarada'),('14','19','so-previsionais')]:
 livros=[json.loads(next(motor.glob('content/'+n+' */ledger.json')).read_text()) for n in [fonte,destino]]
 assert next(a for a in livros[0]['assertions'] if a['id']==id)==next(a for a in livros[1]['assertions'] if a['id']==id)
refs=0
for p in motor.glob('content/*/*.record.json'):
 a=json.loads(antigo(p));b=json.loads(p.read_text());f=lambda r:[(x['row'],x['printed'],x['value']) for x,_ in walk_figures(r)]
 assert f(a)==f(b),p.name
 refs+=len(f(b))
print('Referências idênticas:',refs)
Path(__file__).with_name('livros-adenda-g.json').write_text(json.dumps({'base_motor':base,'livros':resultado,'referencias_identicas':refs},ensure_ascii=False,indent=2)+'\n')
# O livro 19 também é confrontado com a cabeça anterior à VOZ-2A inteira.
p=next(motor.glob('content/19 */ledger.json'))
a=json.loads(subprocess.check_output(['git','show','155a9f2:'+p.relative_to(motor).as_posix()],cwd=motor));b=json.loads(p.read_text())
campos=[k for k in a.keys()|b.keys() if a.get(k)!=b.get(k)]
assert set(campos)=={'ignore','assertions','composto_de'}
assert b['ignore']==[v for v in a['ignore'] if str(v)!='256']
aa={x['id']:x for x in a['assertions']};bb={x['id']:x for x in b['assertions']}
assert set(aa)-set(bb)=={'nenhum-uniformiza'} and not set(bb)-set(aa)
assert {k for k in aa.keys()&bb.keys() if aa[k]!=bb[k]}=={'base-sem-contratos','so-previsionais'}
assert aa['base-sem-contratos']['review']==bb['base-sem-contratos']['review']
assert bb['base-sem-contratos']['quotes']==['nenhum dos documentos lidos lista contratos, adjudicatários ou valores','none of the documents read lists contracts, contractors or values']
assert aa['so-previsionais']['review']==bb['so-previsionais']['review']
assert bb['so-previsionais']['quotes']==aa['so-previsionais']['quotes']+['none of them is an execution account']
resumos=[]
for x,y in zip(a['composto_de'],b['composto_de']):
 if x==y:continue
 assert x['pasta']==y['pasta']=='14 Évora 2027'
 resumos.append({'fonte':x['pasta'],'antes':x['ledger_sha256'],'depois':y['ledger_sha256']})
completo={'base':'155a9f2','campos':sorted(campos),'ignore_retirado':[v for v in a['ignore'] if v not in b['ignore']],'asserção_retirada':aa['nenhum-uniformiza'],'asserções_reancoradas':{k:{'antes':aa[k],'depois':bb[k]} for k in ['base-sem-contratos','so-previsionais']},'resumos':resumos,'linhas_identicas':len(b['claims'])}
destino=Path(__file__).with_name('livros-adenda-g.json');r=json.loads(destino.read_text());r['livro19_desde_inicio']=completo;destino.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
print('19 desde 155a9f2: ignore perde 256; sai nenhum-uniformiza; reancoram-se base-sem-contratos e so-previsionais; linhas idênticas:',len(b['claims']))
for r in resumos:print(' ',r['fonte'],r['antes'],'->',r['depois'])
