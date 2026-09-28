"""Separa a prova de privacidade já emitida pelo verify, sem repetir a corrida."""
import hashlib
import json
from pathlib import Path
import re
AQUI = Path(__file__).resolve().parent
p = AQUI.parent/'portoes/c1g/verify.log'
objetos = []
texto = p.read_text()
for m in re.finditer(r'^\{', texto, re.M):
    try: r, _ = json.JSONDecoder().raw_decode(texto[m.start():])
    except ValueError: continue
    if 'ficheiros' in r and 'plantas' in r and 'passou' in r: objetos.append(r)
assert len(objetos) == 1
r = objetos[0]
r['origem'] = {'ficheiro': 'portoes/c1g/verify.log', 'sha256': hashlib.sha256(p.read_bytes()).hexdigest(), 'cabeca': p.with_suffix('.cabeca').read_text().strip(), 'codigo': int(p.with_suffix('.codigo').read_text())}
(AQUI/'privacidade-dist.json').write_text(json.dumps(r, ensure_ascii=False, indent=2)+'\n')
print('Privacidade extraída do verify, código', r['origem']['codigo'])
