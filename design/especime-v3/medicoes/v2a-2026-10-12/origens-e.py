"""Publica os excertos já selados e exportados pelo circuito comum."""
import json
from pathlib import Path
p=Path('src/data/origens-v2a.json')
o=json.loads(p.read_text())
for key,a in json.loads(Path('ledger/provas/v2a/provas.json').read_text())['apoios'].items():
    page=a['pagina_pdf']
    o[key]=dict(publicador='Ministério das Finanças',documento=f'Orçamento do Estado para 2027, p. {page} do PDF ({a["pagina_impressa"]} impressa)',url=a['pedido'].split('#')[0]+f'#page={page}',lido=a['acedido_em'][:10],lingua='pt',excerto=a['excerto'],extracao=dict(pagina=page),selo=dict(tipo='v2a',campo=f'página física {page}',motor=a['motor_path'],sha256=a['sha256'],hora=a['acedido_em'],cliente=a['cliente']))
p.write_text(json.dumps(o,ensure_ascii=False,indent=2)+'\n')
print('Excertos e localizadores lidos das provas seladas do motor.')
