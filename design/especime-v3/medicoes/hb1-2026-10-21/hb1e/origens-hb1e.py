"""HB1-e: as origens das definições do INE, do Banco de Portugal e do Orçamento, lidas dos corpos
alojados no motor (texto exato, espaços normalizados), com o selo do recibo conferido pelo sha256.
Uso: python3 origens-hb1e.py <motor> <saída.json>"""
import json,re,html,hashlib,subprocess,sys
from pathlib import Path
M=Path(sys.argv[1]);B='content/23 Habitacao/source/'
norm=lambda s:re.sub(r'\s+',' ',s).strip()
def texto(f,campo):
    p=M/B/f
    if f.endswith('.pdf'):return norm(subprocess.run(['pdftotext','-layout',str(p),'-'],capture_output=True,text=True,check=True).stdout)
    if f.endswith('.json'):
        v=json.loads(p.read_text())
        for k in campo.split('.'):v=v[int(k)] if isinstance(v,list) else v[k]
        return norm(v)
    t=p.read_text(encoding='utf-8');t=re.sub(r'(?is)<(head|script|style)\b.*?</\1>','',t)
    return norm(html.unescape(re.sub(r'<[^>]+>',' ',t)))
O={}
def add(k,pub,f,doc,campo,a,b=None):
    t=texto(f,campo);i=t.index(a);j=(t.index(b,i)+len(b)) if b else i+len(a)
    rec=json.loads((M/B/(f+'.pedido.json')).read_text());raw=(M/B/f).read_bytes()
    assert hashlib.sha256(raw).hexdigest()==rec['sha256'],f
    O[k]=dict(publicador=pub,documento=doc,url=rec['endereco_final'],lido=rec['acedido_em'][:10],excerto=t[i:j],
              selo=dict(motor=B+f,campo=campo,hora=rec['acedido_em'][:19]+'Z',cliente=rec['cliente'],sha256=rec['sha256']))
BP='Banco de Portugal';D='0.description'
add('hb1e-bpstat-12533724',BP,'metainformacao/hb1e-bpstat-serie-12533724.json','BPstat, série 12533724: Montante de novas operações de empréstimos à habitação',D,'Novas operações de empréstimos (inclui','valores mensais em milhões de euros')
add('hb1e-bpstat-12533735',BP,'metainformacao/hb1e-bpstat-serie-12533735.json','BPstat, série 12533735: Taxa de juro (TAA) de novas operações de empréstimos à habitação',D,'Taxa de juro acordada anualizada','taxa mensal em percentagem')
add('hb1e-bpstat-12557378',BP,'metainformacao/hb1e-bpstat-serie-12557378.json','BPstat, série 12557378: Empréstimos-Particulares-PRT-Habitação-M€ (OIFM)',D,'Balanço das IFM','Valor em fim do período')
add('hb1e-ine-juro-implicito','INE','ine-retoma-pt-35-2.pdf','Taxas de Juro Implícitas no Crédito à Habitação, agosto de 2026 (destaque)','Nota metodológica, «Taxa de juro implícita»','A taxa de juro implícita no crédito à habitação reflete','(antes de amortização).')
add('hb1e-ine-preco-mediano','INE','ine-retoma-pt-32-2.pdf','Estatísticas de Preços da Habitação ao Nível Local, 1.º trimestre de 2026 (destaque)','Nota metodológica, definição do valor mediano das vendas','Valor mediano das vendas por m² de alojamentos familiares: Valor mediano','maior ou igual a 20 m².')
add('hb1e-ine-preco-fonte','INE','ine-retoma-pt-32-2.pdf','Estatísticas de Preços da Habitação ao Nível Local, 1.º trimestre de 2026 (destaque)','Nota metodológica, as fontes administrativas','As Estatísticas de Preços da Habitação ao nível local resultam','(IMI).')
add('hb1e-ine-renda-mediana','INE','ine-retoma-pt-30-2.pdf','Estatísticas de Rendas da Habitação ao Nível Local, 2.º trimestre de 2026 (destaque)','Nota metodológica, definição do valor mediano da renda','Valor mediano da renda por m² de novos contratos de arrendamento em alojamentos familiares: Valor','€.')
add('hb1e-ine-renda-fonte','INE','ine-retoma-pt-30-2.pdf','Estatísticas de Rendas da Habitação ao Nível Local, 2.º trimestre de 2026 (destaque)','Nota metodológica, as fontes administrativas','As Estatísticas de Rendas da Habitação ao nível local resultam','(IMI).')
add('hb1e-ine-alojamento-classico','INE','metainformacao/hb1e-ine-smi-conceito-6511.html','SMI do INE, conceito 1486: Alojamento familiar clássico','Definição','Alojamento familiar constituído por uma divisão','entre outros).')
add('hb1e-ine-alojamento-vago','INE','metainformacao/hb1e-ine-smi-conceito-6669.html','SMI do INE, conceito 1491: Alojamento familiar vago','Definição','Alojamento familiar desocupado','no momento de referência.')
add('hb1e-oe-quadro-medidas','Governo','oe-relatorio.pdf','Relatório do Orçamento do Estado para 2027','Título do Quadro 3.2 (página impressa 43)','Quadro 3.2. Principais medidas de política orçamental com impacto em 2027')
add('hb1e-oe-quadro-missao','Governo','oe-relatorio.pdf','Relatório do Orçamento do Estado para 2027','Título do Quadro 5.24 (página impressa 227)','Quadro 5.24. Objetivos e indicadores da Missão de Base Orgânica Infraestruturas e Habitação')
for k,v in O.items():print(k,'|',v['excerto'][:400])
Path(sys.argv[2]).write_text(json.dumps(O,ensure_ascii=False,indent=2)+'\n')
