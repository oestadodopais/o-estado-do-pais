"""Confere a V331 e a etiqueta da página sem autorizar outras alterações."""
from pathlib import Path
import json,subprocess,sys,hashlib
motor=Path(sys.argv[1]).resolve();sys.path.insert(0,str(motor))
from publisher.export_records import walk_figures
base='e64065a7a1cd30cc8fd723e2f0b79bf3eeeff176'
def antigo(p):return subprocess.check_output(['git','show',base+':'+p.relative_to(motor).as_posix()],cwd=motor)
folder=next(motor.glob('content/07 *'));pt=next(folder.glob('*pt-PT).md'));pth=pt.with_suffix('.html')
assert pt.read_bytes()==antigo(pt) and pth.read_bytes()==antigo(pth)
en=folder/'Évora — Budgeted, Paid, Owed 2025.md';enh=en.with_suffix('.html')
assert en.read_text()==antigo(en).decode().replace("(inference; the table is the source's,\nthe connection is ours)","(inference; the table is the source's)")
assert enh.read_text()==antigo(enh).decode().replace(', the connection is ours','')
books=0
for p in motor.glob('content/*/ledger.json'):assert p.read_bytes()==antigo(p),p.name;books+=1
refs=0;changed=[]
for p in motor.glob('content/*/*.record.json'):
 a=json.loads(antigo(p));b=json.loads(p.read_text());figs=lambda r:[(f['row'],f['printed'],f['value']) for f,_ in walk_figures(r)];assert figs(a)==figs(b),p.name;refs+=len(figs(b))
 if a['blocks']!=b['blocks']:
  assert p.parent==folder and b['lang']=='pt-PT';assert len(a['blocks'])==len(b['blocks'])
  for old,new in zip(a['blocks'],b['blocks']):
   if old==new:continue
   assert old['text'].startswith('Dez anos a pagar a dívida do resgate')
   expected=dict(old);expected['text']=old['text'].replace('(inferência; a tabela é da fonte)','(inferência)')
   for e in old.get('emphasis',[]):assert old['text'][e['start']:e['end']]=='(inferência; a tabela é da fonte)'
   expected.pop('emphasis',None);assert new==expected
   changed.append({'estudo':'07','lingua':'pt','bloco':new['i'],'antes':old['text'],'depois':new['text']})
assert len(changed)==1
for p in motor.glob('content/*/*.md'):
 if p!=en:assert p.read_bytes()==antigo(p),p.name
for p in motor.glob('content/*/*.html'):
 if p!=enh:assert p.read_bytes()==antigo(p),p.name
out={'base_motor':base,'documento_portugues_identico':True,'v331_unica_mudanca_documental':True,'livros_identicos':books,'referencias_identicas':refs,'blocos_alterados':changed}
Path(__file__).with_name('integridade.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print('Documento português idêntico; V331 é a única mudança documental; uma etiqueta de página alterada.')
print('Livros idênticos:',books,'; referências idênticas:',refs)
