"""Confere os corpos novos e refaz as contas sem importar o gerador das derivadas."""
import ast,hashlib,json,sys
from decimal import Decimal,ROUND_HALF_UP
from pathlib import Path
motor=Path(sys.argv[1]);sys.path.insert(0,str(motor))
from publisher import habitacao as H,habitacao_documentos as D
out=Path(__file__).parent;initial=json.loads((out/'partida.json').read_text());before={r['id'] for r in initial['livros']['HB']}
book=H.load(H.STUDY/'ledger.json');rows={r['id']:r for r in book['claims']};specs=H.load(H.STUDY/'extracoes.json');proofs=[]
for spec in specs['rows']:
 if spec['id'] in before:continue
 excerpt=D.select(spec);raw,receipt=H.source_file(spec['file'],H.SOURCE)
 assert excerpt==rows[spec['id']]['source_excerpt']
 flat=D.reading(D.surface(spec));assert excerpt in flat
 proofs.append({'id':spec['id'],'excerto':excerpt,'corpo':spec['file'],'sha256':hashlib.sha256(raw).hexdigest(),'posicao_no_texto_normalizado':flat.index(excerpt),'recibo_sha256':receipt['sha256']})
def n(rid):return Decimal(str(rows[rid]['value']).replace(' ','').replace('\u00a0','').replace(',','.'))
def calc(node):
 if isinstance(node,ast.Expression):return calc(node.body)
 if isinstance(node,ast.Constant) and isinstance(node.value,(float,int)):return Decimal(str(node.value))
 if isinstance(node,ast.UnaryOp) and isinstance(node.op,ast.USub):return -calc(node.operand)
 if isinstance(node,ast.BinOp):
  a,b=calc(node.left),calc(node.right)
  if isinstance(node.op,ast.Add):return a+b
  if isinstance(node.op,ast.Sub):return a-b
  if isinstance(node.op,ast.Mult):return a*b
  if isinstance(node.op,ast.Div):return a/b
 raise ValueError('expressão fora das quatro operações')
accounts=[]
for rid,r in rows.items():
 if not r.get('derivation'):continue
 d=r['derivation'];expr=d['formula']
 for key in sorted(d['components'],key=len,reverse=True):expr=expr.replace(key,'('+str(n(key))+')')
 value=calc(ast.parse(expr,mode='eval')).quantize(Decimal(10)**-d['rounding_places'],rounding=ROUND_HALF_UP)
 assert value==n(rid),(rid,value,n(rid))
 accounts.append({'id':rid,'componentes':{k:str(n(k)) for k in d['components']},'formula':d['formula'],'calculado':str(value),'livro':r['value'],'diferenca':str(value-n(rid))})
comparisons={'sobrecarga':{},'precos':{},'vazios':{},'feridos':[]}
for file in ['eurostat/tespm140-correcao.json','eurostat/ilc_lvho07c.json']:
 j,receipt=H.cube(file);coords={d:'PT' if d=='geo' else '2025' if d=='time' else 'TOTAL' if d in ['age','rskpovth','tenure'] else 'T' if d=='sex' else 'PC' if d=='unit' else 'A' for d in j['id']};index,value,flag=H.cell(j,coords)
 comparisons['sobrecarga'][file]={'value':value,'flag':flag,'coords':coords,'updated':j.get('updated'),'sha256':receipt['sha256']}
for rid in ['hab-ine-iphab-homologa','hab-prc-hpi-q-q-total-rch-a-pt-2026-q2']:comparisons['precos'][rid]=rows[rid]
for rid in ['hab-ine-vagos-total','hab-ps-vazias']:comparisons['vazios'][rid]=rows[rid]
for rid in ['hab-imprensa-feridos37','hab-imprensa-feridos35','hab-imprensa-feridos39','hab-imprensa-psp-ferido','hab-imprensa-assistidos','hab-imprensa-hospital']:comparisons['feridos'].append(rows[rid])
result={'codigo':0,'provas_de_excerto':proofs,'contas':accounts,'comparacoes':comparisons,'linhas_novas':[r for r in book['claims'] if r['id'] not in before],'quadro_orcamento_2027':{'pagina_pdf':243,'texto':D.pages('oe-relatorio.pdf')[242],'coluna_2026':False},'siglas':['INE','IVA','IRS','PSP','IGAI','CGTP','PS','PCP','BE','PAN','IL','PSD','CDS','FEH']}
(out/'selagem.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');initial['selagem']={'ficheiro':'selagem.json','sha256':hashlib.sha256((out/'selagem.json').read_bytes()).hexdigest(),'codigo':0};(out/'partida.json').write_text(json.dumps(initial,ensure_ascii=False,indent=2)+'\n')
print('Excertos novos:',len(proofs),'Contas refeitas:',len(accounts),'Linhas novas:',len(result['linhas_novas']),'Código: 0')
