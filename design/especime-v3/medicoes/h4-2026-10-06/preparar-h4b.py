#!/usr/bin/env python3
"""Guarda as provas da primeira passagem antes de voltar a construir.
Uso: python3 design/especime-v3/medicoes/h4-2026-10-06/preparar-h4b.py
"""
import hashlib
import json
from pathlib import Path
import shutil

AQUI = Path(__file__).resolve().parent
registo = AQUI / 'preservadas-h4b.json'
if registo.exists():
    raise SystemExit('As provas da primeira passagem já foram preservadas.')

preservadas = []
def preservar(nome, esperado):
    p = Path(nome)
    assert hashlib.sha256(p.read_bytes()).hexdigest() == esperado, nome
    destino = p.with_stem(p.stem + '-antes')
    assert not destino.exists(), destino
    p.rename(destino)
    preservadas.append({'antes': nome, 'agora': destino.as_posix(), 'sha256': esperado})
    return destino.as_posix()

capturas = json.loads((AQUI / 'capturas.json').read_text())
for c in capturas['capturas']:
    if c['familia'] != 'politica':
        c['ficheiro'] = preservar(c['ficheiro'], c['sha256'])
        c['recorte'] = preservar(c['recorte'], c['sha256_recorte'])
# As folhas antigas também ficam no pacote, sem depender do dist da passagem seguinte.
for p in capturas['paginas']:
    for f in p['folhas']:
        copia = AQUI / 'folhas-antes' / Path(f['ficheiro']).name
        copia.parent.mkdir(exist_ok=True)
        shutil.copyfile('dist' + f['ficheiro'], copia)
        assert hashlib.sha256(copia.read_bytes()).hexdigest() == f['sha256']
        f['copia'] = copia.relative_to(Path.cwd()).as_posix()
(AQUI / 'capturas.json').write_text(json.dumps(capturas, ensure_ascii=False, indent=2) + '\n')

menu = json.loads((AQUI / 'menu-depois.json').read_text())
for m in menu['medidas']:
    m['captura'] = preservar(m['captura'], m['sha256'])
(AQUI / 'menu-depois-antes.json').write_text(json.dumps(menu, ensure_ascii=False, indent=2) + '\n')
(AQUI / 'menu-depois.json').unlink()
relatorio = (AQUI / 'LEIA-ME.md').read_text().replace('menu-depois.json', 'menu-depois-antes.json')
for p in preservadas:
    relatorio = relatorio.replace(Path(p['antes']).name, Path(p['agora']).name)
(AQUI / 'LEIA-ME.md').write_text(relatorio)
registo.write_text(json.dumps({'comando': 'python3 design/especime-v3/medicoes/h4-2026-10-06/preparar-h4b.py',
    'preservadas': preservadas}, ensure_ascii=False, indent=2) + '\n')
print(f'{len(preservadas)} imagens preservadas, com os mesmos resumos.')
