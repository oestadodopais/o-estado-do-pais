"""Reconta os apoios das palavras nos corpos alojados, sem escrever caminhos locais."""
import hashlib, html, json, re, sys
from pathlib import Path
motor=Path(sys.argv[1]);out=Path(sys.argv[2])
b=motor/'content/26 Saude e Parcerias Efeitos'
book={r['id']:r for r in json.loads((b/'ledger.json').read_text())['claims']}
scut=book['pe-scut-trocos']['excerpt'];alineas=re.findall(r'(?:^|\s)([a-g])\)',scut);assert ''.join(alineas)=='abcdefg'
cube=json.loads((b/'source/saude/eurostat-prs2.json').read_text())
eu='BE BG CZ DK DE EE IE EL ES FR HR IT CY LV LT LU HU MT NL AT PL PT RO SI SK FI SE'.split()
def value(geo):
 coords=dict(freq='A',unit='P_HTHAB',wstatus='PRACT',med_spec='PHYS',geo=geo,time='2024');i=0
 for dim,size in zip(cube['id'],cube['size']):i=i*size+cube['dimension'][dim]['category']['index'][coords[dim]]
 return cube['value'].get(str(i))
values={g:value(g) for g in eu};missing=[g for g,v in values.items() if v is None];present={g:v for g,v in values.items() if v is not None}
assert missing==['SK'] and min(present,key=present.get)=='BE' and max(present,key=present.get)=='EL'
provisional=[]
for id in ['sns-consultas-csp-2026-08','sns-cirurgias-2026-07','sns-lista-cirurgia-2026-07']:
 ev=book[id]['provisional_evidence'];body=(motor/ev['file']).read_bytes();assert hashlib.sha256(body).hexdigest()==ev['sha256']
 ds=next(d for d in json.loads(body)['results'] if d['dataset_id']==ev['dataset']);desc=' '.join(html.unescape(re.sub('<[^>]+>',' ',ds['metas']['default']['description'])).split());assert ev['quote'] in desc
 assert book[id]['period'].split('/')[-1]==ev['latest'];provisional.append(dict(id=id,**ev))
rect=book['pe-dl87a-apoio-retificado'];path=motor/rect['document']['file'];receipt=json.loads(Path(str(path)+'.pedido.json').read_text());assert hashlib.sha256(path.read_bytes()).hexdigest()==rect['document']['source_sha256']==receipt['sha256'];assert (path.parent/'direitos/avaliacao.json').is_file()
definition=next(r for r in json.loads((b/'partes/base.json').read_text())['rows'] if r['id']=='dgo-atraso-45-p')['anchors']['C54'];assert definition in book['dgo-atraso-45-p']['excerpt']
r=dict(autoestradas=dict(contagem=len(alineas),alineas=alineas),medicos=dict(ano='2024',categoria='PRACT',valores=present,sem_valor=missing,minimo='BE',maximo='EL'),provisorios=provisional,retificacao=dict(ficheiro=rect['document']['file'],sha256=receipt['sha256'],recibo=True,direitos=True),definicao_dgo=definition)
out.write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print(json.dumps(dict(autoestradas=len(alineas),paises_sem_valor=len(missing),catalogos=len(provisional),retificacao=True)))
