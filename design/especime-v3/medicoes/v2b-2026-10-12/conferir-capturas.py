import hashlib,json,sys,warnings
from pathlib import Path
from PIL import Image
pasta=Path(sys.argv[1]);saida=Path(sys.argv[2]);r=json.loads((pasta/'capturas.json').read_text())
erros=[];ficheiros=[];avisos=[]
for p in r['resultados']:
 if p['documento']>p['largura'] or p['corpo']>p['largura']:erros.append('largura excedida: '+p['ficheiro'])
 for c in [p,*p['recortes']]:
  f=pasta/c['ficheiro'];b=f.read_bytes()
  with warnings.catch_warnings(record=True) as ws:
   warnings.simplefilter('always');im=Image.open(f)
  avisos.extend(dict(ficheiro=f.name,mensagem=str(w.message)) for w in ws)
  if hashlib.sha256(b).hexdigest()!=c['sha256']:erros.append('sha256 diferente: '+f.name)
  ficheiros.append(dict(ficheiro=f.name,largura=im.width,altura=im.height,sha256=c['sha256']))
  im.close()
if len(sys.argv)>3:
 pedido=json.loads(Path(sys.argv[3]).read_text());esperados=set()
 for pagina in pedido['paginas']:
  for lingua in ['pt','en']:
   for largura in [390,768,1024,1280,1600]:
    prefixo=f"{pagina['nome']}-{lingua}-{largura}"
    esperados.add(prefixo+'.png')
    esperados.update(prefixo+'-'+c['nome']+'.png' for c in pagina.get('recortes',[]))
 obtidos={f['ficheiro'] for f in ficheiros}
 if esperados!=obtidos:erros.append(dict(faltam=sorted(esperados-obtidos),sobram=sorted(obtidos-esperados)))
 if pedido['cabeca']!=r['cabeca']:erros.append('cabeça diferente do pedido')
res=dict(avisos=avisos,cabeca=r['cabeca'],paginas=len(r['resultados']),png=len(ficheiros),larguras=r['larguras'],erros=r['falhas']+erros,ficheiros=ficheiros)
saida.write_text(json.dumps(res,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({**{k:v for k,v in res.items() if k not in ['ficheiros','avisos']},'avisos':len(avisos)},ensure_ascii=False))
if res['erros']:raise SystemExit(1)
