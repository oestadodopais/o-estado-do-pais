#!/usr/bin/env python3
"""Acerta só números de linha às âncoras literais do mapa; grava cada troca para revisão."""
import json,re,unicodedata
from pathlib import Path
p=Path('design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md')
def norm(s):
 s=unicodedata.normalize('NFC',s);s=re.sub(r'[`*_]','',s);s=re.sub(r'^\s*(\*|//|#)\s?',' ',s)
 return re.sub(r'\s+',' ',s).strip().lower()
ref=re.compile(r'`((?:scripts|tests|src|design|ledger|public|registos|studies-src|api|supabase)/[^`\s:]+?\.(?:mjs|astro|json|md|py|yml|js|css|sql)|package\.json|vercel\.json|CLAUDE\.md|DECISIONS\.md)(?::(\d+))?`|`:(\d+)`')
cache={};trocas=[];linhas=p.read_text().splitlines();gate=False
for n,l in enumerate(linhas):
 if l.startswith('### '):gate='gate:html' in l and 'por dentro' in l
 if l.startswith('## '):gate=False
 node=re.search(r'`node ((?:scripts|tests)/[^\s`]+\.mjs)',l)
 fixo=node[1] if node else ('scripts/gate-html.mjs' if gate else None)
 atual=fixo;refs=[]
 for m in ref.finditer(l):
  f,ln,bare=m.groups()
  if f:atual=f
  alvo=(fixo or atual) if bare else atual
  valor=bare or ln
  if not alvo or not valor:continue
  if alvo not in cache:cache[alvo]=Path(alvo).read_text().splitlines() if Path(alvo).is_file() else []
  if cache[alvo]:refs.append((m,alvo,int(valor)))
 edits={}
 for q in re.finditer(r'«([^«»]{15,})»',l):
  a=norm(q[1])[:55]
  if any(a in ' '.join(norm(x) for x in cache[f][max(0,k-8):k+7]) for _,f,k in refs):continue
  candidatos=[]
  for m,f,k in refs:
   indices=[i+1 for i in range(len(cache[f])) if a in ' '.join(norm(x) for x in cache[f][i:i+3])]
   if indices:
    novo=min(indices,key=lambda i:abs(i-k))
    distancia=abs(q.start()-m.end())+(0 if m.end()<=q.start() else 200)
    candidatos.append((distancia,m,f,k,novo))
  if not candidatos:continue
  _,m,f,k,novo=min(candidatos,key=lambda c:c[0])
  if m.start() in edits:continue
  antigo=m.group(0);novo_ref=antigo.replace(':'+str(k)+'`',':'+str(novo)+'`')
  edits[m.start()]=(m.end(),novo_ref)
  trocas.append(dict(linha_mapa=n+1,ficheiro=f,antes=k,depois=novo,ancora=q[1]))
 for start,(end,texto) in sorted(edits.items(),reverse=True):l=l[:start]+texto+l[end:]
 linhas[n]=l
p.write_text('\n'.join(linhas)+'\n')
alvo=Path(__file__).with_name('mapa-linhas.json')
prev=json.loads(alvo.read_text()) if alvo.exists() else []
alvo.write_text(json.dumps(prev+trocas,ensure_ascii=False,indent=2)+'\n')
print(f'{len(trocas)} referências alinhadas pela citação literal.')
