from pathlib import Path
from hashlib import sha256
from PIL import Image
import json,sys
folder=Path(sys.argv[1]);dest=Path('design/especime-v3/medicoes/eo1-2026-10-20/d')
r=json.loads((folder/'capturas.json').read_text())
assert r['ok'] and not r['falhas']
assert r['cabeca']==json.loads(Path('dist/version.json').read_text())['commit']
assert r['larguras']==[390,768,1024,1280,1600]
assert len(r['resultados'])==40
n=0
for row in r['resultados']:
 assert row['documento']<=row['janela'] and row['corpo']<=row['janela'],row['ficheiro']
 assert not row['externos'] and not row['erros'] and not row['recusados']
 p=folder/row['ficheiro'];assert sha256(p.read_bytes()).hexdigest()==row['sha256']
 with Image.open(p) as full:
  for crop in row['recortes']:
   f=folder/crop['ficheiro'];assert sha256(f.read_bytes()).hexdigest()==crop['sha256']
   b=crop['caixa'];piece=full.crop((b['left'],b['top'],b['left']+b['width'],b['top']+b['height']))
   with Image.open(f) as cut:assert cut.convert('RGBA').tobytes()==piece.convert('RGBA').tobytes()
   n+=1
assert n==80
(dest/'capturas.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
proof={'cabeca':r['cabeca'],'paginas':len(r['resultados']),'recortes':n,'larguras':r['larguras'],'resumos_conferidos':True,'recortes_iguais_aos_pixeis_da_pagina':True,'excesso_de_largura':False,'pedidos_externos':False,'erros_navegador':False}
(dest/'capturas-conferencia.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(proof,ensure_ascii=False))
