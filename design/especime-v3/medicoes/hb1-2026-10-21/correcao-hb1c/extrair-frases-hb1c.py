"""HB1-c1: as frases desta passagem tal como as edições do sítio as imprimem, tiradas de
studies-src/a-casa-em-portugal-e-na-europa/{pt,en}.html (o HTML que a construção lê).
Uso, na raiz do sítio: python3 design/especime-v3/medicoes/hb1-2026-10-21/correcao-hb1c/extrair-frases-hb1c.py"""
import json,re,html
from pathlib import Path
INICIOS={'pt':['Descontada a inflação, os preços','E no entanto a família média','1. O problema é a subida','2. A média esconde','3. Os jovens saem de casa tarde','4. As licenças de construção','5. O que o Estado faz','6. A rua e os números','A casa absorve','A Iniciativa Liberal (a IL)','«A renda consome metade do salário»: nenhuma'],
 'en':['Net of inflation, house prices','And yet the average Portuguese','1. The problem is the rise','2. The average hides','3. The young leave home late','4. Building permits per inhabitant','5. What the State does','6. The street and the numbers','Housing absorbs','Iniciativa Liberal (IL)','«A renda consome metade do salário» (rent eats']}
CONTEM={'pt':['em português: a parte da população','o documento não diz como chegou','o relatório não define a palavra','todas vêm dos jornais citados.'],'en':['the document does not say how it reached','the report does not define the word','all come from the newspapers cited.','will not give in to the shouting']}
def paras(raw):
 out=[]
 for m in re.finditer(r'<(p|li)\b[^>]*>(.*?)</\1>',raw,re.S):
  t=html.unescape(re.sub(r'<[^>]+>','',m.group(2)));t=re.sub(r'[​‌‍⁠]','',t);out.append(re.sub(r'\s+',' ',t).strip())
 return out
res={}
for L in ['pt','en']:
 ps=paras(Path(f'studies-src/a-casa-em-portugal-e-na-europa/{L}.html').read_text())
 got=[]
 for k in INICIOS[L]:
  hit=[p for p in ps if p.startswith(k) or re.sub(r'^\d+\.\s*','',p).startswith(re.sub(r'^\d+\.\s*','',k))]
  got.append({'procura':k,'encontradas':len(hit),'texto':hit[0] if hit else None})
 for k in CONTEM[L]:
  hit=[p for p in ps if k in p];got.append({'contem':k,'encontradas':len(hit),'frase':(re.search(r'[^.]*'+re.escape(k)+r'[^.]*\.?',hit[0]).group(0).strip() if hit else None)})
 res[L]=got
Path(__file__).with_name('frases-renderizadas-hb1c.json').write_text(json.dumps(res,ensure_ascii=False,indent=1)+'\n')
falta=[(L,g.get('procura') or g.get('contem')) for L in res for g in res[L] if g['encontradas']!=1]
print('frases:',sum(len(v) for v in res.values()),'em falta ou repetidas:',falta)
raise SystemExit(1 if falta else 0)
