"""Separa duas medições JSON já emitidas pelo portão, sem repetir a corrida."""
import hashlib
import json
from pathlib import Path
import re
AQUI = Path(__file__).resolve().parent
p = AQUI.parent/'portoes/c1f/build.log'
texto = p.read_text()
objetos = []
for m in re.finditer(r'^\{', texto, re.M):
    try: r, fim = json.JSONDecoder().raw_decode(texto[m.start():])
    except ValueError: continue
    objetos.append(r)
for nome, chave in [('proveniencia', 'erros_do_livro'), ('privacidade-dist', 'ficheiros')]:
    candidatos = [r for r in objetos if chave in r and (nome != 'privacidade-dist' or 'plantas' in r and 'passou' in r)]
    assert len(candidatos) == 1
    r = candidatos[0]
    r['origem'] = {'ficheiro': 'portoes/c1f/build.log', 'sha256': hashlib.sha256(p.read_bytes()).hexdigest(), 'cabeca': p.with_suffix('.cabeca').read_text().strip(), 'codigo': int(p.with_suffix('.codigo').read_text())}
    (AQUI/(nome+'.json')).write_text(json.dumps(r, ensure_ascii=False, indent=2)+'\n')
    print(nome, 'extraído do portão, código', r['origem']['codigo'])
