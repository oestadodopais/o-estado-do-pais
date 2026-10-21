"""Confere cópias do diploma, colunas da dívida e a seleção UTAO nos corpos locais."""
import hashlib,json,sys
from pathlib import Path
motor=Path(sys.argv[1]);out=Path(__file__).parent
load=lambda p:json.loads(p.read_text())
book=load(motor/'content/25 Orcamento 2027 Medidas/ledger.json');rows={r['id']:r for r in book['claims']}
r=rows['rmmg-2026'];body=motor/r['document']['file'];digest=hashlib.sha256(body.read_bytes()).hexdigest()
copies=[]
for p in (motor/'content/13 Dominios/source').rglob('*.pdf'):
 if hashlib.sha256(p.read_bytes()).hexdigest()==digest:copies.append(str(p.relative_to(motor)))
assert copies,'cópia anterior do diploma não encontrada'
assert Path(str(body)+'.pedido.json').exists() and (body.parent/'direitos').is_dir()
source={'diploma':{'copia_com_recibo':str(body.relative_to(motor)),'copias_iguais':copies,'sha256':digest,'recibo':True,'direitos':sorted(p.name for p in (body.parent/'direitos').iterdir() if p.is_file())},'quadro_3_6':{k:{f:rows[k].get(f) for f in ['value','period','column_label','locator','excerpt']} for k in ['pm-q3-6-r42-c1','pm-q3-6-r42-c2','pm-q3-6-r43-c2']},'juros':{k:{f:rows[k].get(f) for f in ['value','period','column_label','locator','excerpt']} for k in ['pm-q3-1-r36-c1','pm-q3-1-r36-c2','pm-q4-1-r21-c0','pm-q4-1-r21-c1']},'utao_pessoal':next(r for r in load(motor/'content/25 Orcamento 2027 Medidas/partes/eo1.json')['rows'] if r['id']=='utao-pessoal-variacao-cn')}
(out/'fontes-conferidas.json').write_text(json.dumps(source,ensure_ascii=False,indent=2)+'\n')
print('EO1-d fontes: cópias idênticas, recibo e direitos presentes; períodos do quadro e seleção UTAO registados.')
