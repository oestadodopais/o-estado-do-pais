"""Nomes nas páginas citadas dos corpos alojados, sem procurar noutro localizador."""
from pathlib import Path
import hashlib,json,sys
motor=Path(sys.argv[1]);sys.path.insert(0,str(motor))
from publisher import oe2027_analise as A
rows={r['id']:r for r in json.loads((motor/'content/25 Orcamento 2027 Medidas/ledger.json').read_text())['claims']}
proof=[]
for id,expected in [('rmmg-2026','retribuição mínima mensal garantida'),('oe-2027-rmmg-2024','salário mínimo (RMMG)'),('oe-2027-rmmg-2027','salário mínimo (RMMG)')]:
 r=rows[id];d=r['document'];p=motor/d['file'];text=A.norm(A.pages(d['file'])[d['page']-1]);start=text.index(expected)
 assert r['name']==expected
 assert hashlib.sha256(p.read_bytes()).hexdigest()==d['source_sha256']
 proof.append({'id':id,'nome':r['name'],'ficheiro':d['file'],'pagina':d['page'],'localizador':d['locator'],'sha256':d['source_sha256'],'inicio':start,'excerto':text[max(0,start-30):start+len(expected)+100]})
(Path(__file__).parent/'fontes-conferidas.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n')
print('EO1-e: nomes das três linhas conferidos na página do localizador e no corpo com o resumo declarado.')
