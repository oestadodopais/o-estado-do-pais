"""Localiza as quantificações recusadas, sem modificar livros nem réguas."""
from pathlib import Path
import json,sys
motor=Path(sys.argv[1]).resolve();sys.path.insert(0,str(motor))
from core.assertions import normalised,_spans,_tight,_QUANT_RE
pasta=Path(__file__).resolve().parent
frases=json.loads((pasta.parent/'voz2a-2026-11-07/FRASES-VOZ-2A.json').read_text())
alvos=['evora-money-audit-2026-pt','evora-accounts-2025-pt','evora-2027-en','evora-economia-dinheiro-de-fora-pt','evora-2027-capital-europeia-da-cultura-en']
manifesto=json.loads((motor/'core/gate_baselines.json').read_text());resultado=[]
for d in manifesto['deliverables']:
 if d['name'] not in alvos:continue
 livro=json.loads((motor/d['ledger']).read_text());texto=normalised(motor/d['document'])
 cobertos=[s for a in livro.get('assertions',[]) for q in a['quotes'] for s in _spans(texto,_tight(q))]+[s for q in livro.get('assertion_ignores',[]) for s in _spans(texto,_tight(q))]
 for hit in _QUANT_RE.finditer(texto):
  if any(a<=hit.start() and hit.end()<=b for a,b in cobertos):continue
  novas=[]
  for f in frases:
   if not f.get('nova'):continue
   if any(a<=hit.start() and hit.end()<=b for a,b in _spans(texto,_tight(f['nova']))):novas.append({'id':f['id'],'nova':f['nova']})
  item={'entregavel':d['name'],'documento':d['document'],'livro':d['ledger'],'quantificador':hit.group(),'contexto':texto[max(0,hit.start()-100):hit.end()+180],'frases_prescritas':novas};resultado.append(item)
  print(json.dumps(item,ensure_ascii=False))
(pasta/'assercao-pendente.json').write_text(json.dumps(resultado,ensure_ascii=False,indent=2)+'\n')
assert len(resultado)==5
print('Cinco superfícies Markdown recusadas, repetidas nas cinco superfícies HTML; nenhum livro alterado.')
