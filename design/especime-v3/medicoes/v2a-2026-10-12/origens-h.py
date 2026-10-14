"""Publica os excertos já selados e exportados pelo circuito comum."""
import json
from pathlib import Path
p=Path('src/data/origens-v2a.json')
o=json.loads(p.read_text())
for key,a in json.loads(Path('ledger/provas/v2a/provas.json').read_text())['apoios'].items():
    page=a['pagina_pdf']
    o[key]=dict(tipo='passagem',excertoAberto=key=='v2a-prr-saude',publicador='Ministério das Finanças',documento=a['documento'],documento_en=a['documento_en'],publicador_en=a['publicador_en'],url=a['pedido'].split('#')[0]+f'#page={page}',lido=a['acedido_em'][:10],lingua='pt',excerto=a['excerto'],extracao=dict(pagina=page),selo=dict(tipo='v2a',campo=f'página física {page}',motor=a['motor_path'],sha256=a['sha256'],hora=a['acedido_em'],cliente=a['cliente']))
    o[key].update(pagina_pdf=str(page),localizador=f'p. {page} do PDF ({a["pagina_impressa"]} impressa)',localizador_en=f'PDF p. {page} (printed {a["pagina_impressa"]})')
    if 'quadro' in a: o[key]['quadro']=a['quadro']
o['v2a-total-efetiva'].update(quadro='4.38',documento='Orçamento do Estado para 2027',documento_en='Budget report for 2027',pagina_pdf='145',localizador='nota ao quadro 4.38, p. 145 do PDF',localizador_en='note to Table 4.38, PDF p. 145',publicador_en='Ministry of Finance')
p.write_text(json.dumps(o,ensure_ascii=False,indent=2)+'\n')
print('Excertos e localizadores lidos das provas seladas do motor.')
