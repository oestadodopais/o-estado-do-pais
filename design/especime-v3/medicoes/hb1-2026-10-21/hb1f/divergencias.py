"""HB1-f (o Minor 9): as frases de divergencias-da-redacao.json como o dist/ as imprime hoje.

Cada frase guarda o número do bloco do registo da edição; o texto vem do registo
composto pelo motor (o mesmo que o dist/ imprime) e só se escreve se a frase,
com os espaços normalizados, estiver no HTML construído dessa edição.
Uso: python3 <este ficheiro> <motor>   (a partir da raiz do sítio, depois do build)
"""
import html,json,re,sys
from pathlib import Path
motor=Path(sys.argv[1]);slug='a-casa-em-portugal-e-na-europa'
rec={'pt':'A casa em Portugal e na Europa.record.json','en':'Housing in Portugal and in Europe.record.json'}
rota={'pt':f'dist/estudos/{slug}/index.html','en':f'dist/en/studies/{slug}/index.html'}
norm=lambda s:re.sub(r'\s+',' ',s).strip()
def texto(p):
 t=re.sub(r'<script.*?</script>|<style.*?</style>','',Path(p).read_text(),flags=re.S)
 # as marcas dos números (spans) entram sem espaço, como o leitor as lê
 # sem as etiquetas das fontes («fonte · Eurostat»), que o leitor não lê como frase
 t=re.sub(r'<a class="src-chip".*?</a>','',t,flags=re.S)
 return norm(html.unescape(re.sub(r'<[^>]+>','',t)))
blocos={l:{b['i']:b['text'] for b in json.loads((motor/'content/28 Habitacao Estudo'/f).read_text())['blocks']} for l,f in rec.items()}
dist={l:texto(p) for l,p in rota.items()}
f=Path('design/especime-v3/medicoes/hb1-2026-10-21/correcao-hb1b/divergencias-da-redacao.json');d=json.loads(f.read_text());mudou=0
for r in d['recusas']:
 for l,frases in r.get('frases',{}).items():
  for fr in frases:
   novo=norm(blocos[l][fr['bloco']])
   pedacos=[norm(html.unescape(re.sub(r'<[^>]+>|[*_`]','',x))) for x in re.split(r'(?<=[.;:])\s+',novo) if len(x)>20]
   assert pedacos and all(p in dist[l] for p in pedacos),(l,fr['bloco'],[p for p in pedacos if p not in dist[l]][:1])
   if fr['texto']!=novo:fr['texto']=novo;mudou+=1;print('mudou',r.get('decisao_anterior'),l,fr['bloco'],novo[:90])
f.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');print('frases atualizadas:',mudou)
