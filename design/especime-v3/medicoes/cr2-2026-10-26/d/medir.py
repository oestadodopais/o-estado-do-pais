"""Atualiza as medidas correntes sem apagar a prova das passagens anteriores."""
import json
from pathlib import Path
p=Path(__file__).resolve().parent
base=p.parent
r=json.loads((base/'medidas.json').read_text())
if 'historico_antes_cr2d' not in r:
 r={'historico_antes_cr2d':r}
partida=json.loads((p/'partida.json').read_text())
codigos={f.stem:int(f.read_text()) for f in sorted(p.glob('*.codigo'))}
atual={'partida':partida,'codigos':codigos}
for nome in ['recibos-cr2','frases-depois']:
 f=p/f'{nome}.json'
 if f.exists():
  x=json.loads(f.read_text())
  if nome=='recibos-cr2':
   atual['recibos']={k:x[k] for k in ['construcao','recibos_lidos','recibos_certos','atualizados_certos','pendentes_certos','conhecido_positivo']}
  else:
   atual['frases']={'total':len(x['comparacao']),'mudadas':[f for f in x['comparacao'] if f['mudou']],'iguais':sum(not f['mudou'] for f in x['comparacao']),'paginas':len(x['paginas']),'todas_no_html':all(f['html_confere'] for f in x['comparacao'])}
if (p/'frases-comparadas-sem-html.json').exists():
 atual['frases_sem_html']=json.loads((p/'frases-comparadas-sem-html.json').read_text())
if not (base.parents[3]/'dist/index.html').exists():
 atual['recibos']={'estado':'não conferidos: construção recusada antes de gerar dist','atualizados_esperados':30,'pendentes_esperados':4}
r.update(gerado_por='d/medir.py',estado='CR2-d: quinze revisões aplicadas; duas pendentes da UE1-c',continuacao_cr2d=atual)
(base/'medidas.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'codigos':codigos,'recibos':atual.get('recibos'),'frases':{k:v for k,v in atual.get('frases',{}).items() if k!='mudadas'}},ensure_ascii=False))
