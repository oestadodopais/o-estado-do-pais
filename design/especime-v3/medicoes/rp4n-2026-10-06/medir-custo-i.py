"""Lê os custos fornecidos pela direção e mede as operações conservadas."""
from pathlib import Path
import json,re
b=Path(__file__).parent
mandato=Path('design/observatorio/mandatos/MANDATO-RP4N-i-2026-10-12.md').read_text()
nums=re.search(r'\((\d[\d ]+) símbolos na g e (\d[\d ]+) na h, contra os alvos de (\d[\d ]+) e (\d[\d ]+)\)',mandato).groups()
valores=[int(x.replace(' ','')) for x in nums]
r={'origem':'design/observatorio/mandatos/MANDATO-RP4N-i-2026-10-12.md','passagens':{}}
for fase,custo,alvo in zip(['g','h'],valores[:2],valores[2:]):
 tentativas=[{'pasta':str(p.relative_to(b)),'codigos':{f.stem:int(f.read_text()) for f in p.glob('*.codigo')}} for p in sorted(b.glob('portoes-'+fase+'-tentativa*'))]
 capturas=[{'ficheiro':str(p.relative_to(b)),'capturas':len(json.loads(p.read_text())['capturas'])} for p in (b/fase).glob('capturas*.json')]
 reescritas=[{'ficheiro':str(p.relative_to(b)),'pares':len(json.loads(p.read_text())['pares'])} for p in (b/fase).glob('reescrita*.json')]
 r['passagens'][fase]={'simbolos':custo,'alvo':alvo,'excesso':custo-alvo,'tentativas_recusadas':tentativas,'capturas':capturas,'reescritas':reescritas}
(b/'i/custo.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
