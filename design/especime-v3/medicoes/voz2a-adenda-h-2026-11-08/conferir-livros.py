"""Diferenças autorizadas pela adenda H, contra o motor ce0cf75.
Uso: python3 <este guião> <motor>
"""
from pathlib import Path
import hashlib,json,subprocess,sys
motor=Path(sys.argv[1]).resolve();sys.path.insert(0,str(motor))
from core.assertions import normalised,_tight
from publisher.export_records import walk_figures
base='ce0cf7506a2696c1e23f1279fe272a25778330e0'
def antigo(p):return subprocess.check_output(['git','show',base+':'+p.relative_to(motor).as_posix()],cwd=motor)
def sha(b):return hashlib.sha256(b).hexdigest()
resultado=[]
for p in sorted(motor.glob('content/*/ledger.json')):
 a=json.loads(antigo(p));b=json.loads(p.read_bytes());n=p.parent.name[:2]
 campos=[k for k in a.keys()|b.keys() if a.get(k)!=b.get(k)]
 if not campos:continue
 if n=='16':
  assert campos==['assertion_ignores'] and b['assertion_ignores']==[q for q in a['assertion_ignores'] if q!='o contexto de todos os números']
  resultado.append({'estudo':n,'campos':campos,'retirado':'o contexto de todos os números'})
  print(n,': assertion_ignores; retirada a forma antiga de V326');continue
 assert n in ['04','14','18','19'],(n,campos)
 assert set(campos)==({'assertions','composto_de'} if n in ['18','19'] else {'assertions'})
 aa={x['id']:x for x in a['assertions']};bb={x['id']:x for x in b['assertions']}
 esperado='hospital-registos-sem-identidade-declarada' if n in ['04','18'] else 'so-previsionais'
 assert [k for k in aa.keys()|bb.keys() if aa.get(k)!=bb.get(k)]==[esperado]
 q='neither source states that they are the same entity' if n in ['04','18'] else 'nenhum deles é uma conta de execução'
 assert bb[esperado]['quotes']==aa[esperado]['quotes']+[q]
 if n in ['04','18']:assert aa[esperado]['review']==bb[esperado]['review']
 else:assert 'documentos municipais' in bb[esperado]['review'] and 'um a um' in bb[esperado]['review']
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
Path(__file__).with_name('livros-adenda-h.json').write_text(json.dumps({'base_motor':base,'livros':resultado,'referencias_identicas':refs},ensure_ascii=False,indent=2)+'\n')
