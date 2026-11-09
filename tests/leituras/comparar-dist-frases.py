#!/usr/bin/env python3
"""Plantas da exceção estreita da CAM2-A; não precisam do dist privado."""
import importlib.util
import json
from pathlib import Path
import tempfile

spec = importlib.util.spec_from_file_location('comparacao_cam2a', Path(__file__).resolve().parents[2] / 'scripts/comparar-dist-frases.py')
c = importlib.util.module_from_spec(spec); spec.loader.exec_module(c)
base = b'<p><a href="/prova.json" data-prova="conferencias_da_corrida">67</a> conferencias.</p>'
novo = base.replace(b'>67<', b'>68<')
assert c.metodo_autorizado(base, novo)
for estrago in [novo.replace(b'68', b'69'), novo+b' ', novo.replace(b'/prova.json',b'/outra'), novo.replace(b'conferencias.',b'texto novo.')]:
    assert not c.metodo_autorizado(base, estrago)
assert not c.metodo_autorizado(base+base, novo+novo)
assert not c.metodo_autorizado(base.replace(b'conferencias_da_corrida',b'outra'),novo.replace(b'conferencias_da_corrida',b'outra'))
with tempfile.TemporaryDirectory(prefix='cam2a-comparacao-') as tmp:
    a,b = Path(tmp)/'base',Path(tmp)/'atual'
    for p,corpo in [(a,base),(b,novo)]:
        p.mkdir()
        for n in c.METODO:
            f=p/n;f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(corpo)
        (p/'version.json').write_text(json.dumps({'commit':c.BASE_COMMIT, 'construido_em':'2026-11-09T10:00:00Z'}))
        (p/'index.html').write_text('Pagina intacta')
        (p/'prova.json').write_text(p.name)
    assert c.comparar(a,b,'2026-11-09')['ok']
    (b/'index.html').write_text('Pagina alterada')
    assert not c.comparar(a,b,'2026-11-09')['ok']
    (b/'index.html').write_text('Pagina intacta');(b/'novo.txt').write_text('novo')
    assert not c.comparar(a,b,'2026-11-09')['ok']
    (b/'novo.txt').unlink();(b/'index.html').unlink()
    assert not c.comparar(a,b,'2026-11-09')['ok']
    try: c.comparar(a,b,'2026-11-10')
    except ValueError as e: assert 'dia UTC' in str(e)
    else: raise AssertionError('meia-noite passou')
    v=json.loads((a/'version.json').read_text());v['commit']='0'*40;(a/'version.json').write_text(json.dumps(v))
    try: c.comparar(a,b,'2026-11-09')
    except ValueError as e: assert 'base' in str(e)
    else: raise AssertionError('base errada passou')
print('comparação: controlo verde; 11 alterações ou condições inválidas recusadas; só o campo 67 para 68 passa')
