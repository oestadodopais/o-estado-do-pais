"""Repete os dez recibos guardados e confere a ausência de escrita canónica."""
import json
import os
import sys
import shutil
import tempfile
from pathlib import Path

motor = Path(os.environ['RESEARCHHUB_DIR']).resolve()
sys.path.insert(0, str(motor))
from publisher import series_paises as S, series_paises_corredor as C

pasta = motor / 'indicators/out/series-paises/2026-10-26'
recibos = {p['nome']: p for p in map(json.loads, (pasta / 'pedidos.jsonl').read_text().splitlines())}

def estado():
    ficheiros = [S.SERIES, *(p for p in S.SOURCE.rglob('*') if p.is_file())]
    return {str(p.relative_to(motor)): S.sha256(p.read_bytes()) for p in ficheiros}

def guardado(pasta, nome, url):
    p = recibos[nome]
    assert p['url'] == url and p['estado'] == 'lido'
    assert S.sha256((pasta / p['file']).read_bytes()) == p['sha256']
    return p

antes = estado()
relatorio_antes = (pasta / 'corredor.json').read_bytes()
# O relatório novo terá os resumos das duas linhas com as razões emendadas.
# Uma pasta temporária conserva intacto o recibo histórico da corrida anterior.
with tempfile.TemporaryDirectory(dir=pasta) as tmp:
    copia = Path(tmp)
    for p in recibos.values():
        shutil.copyfile(pasta / p['file'], copia / p['file'])
    shutil.copyfile(pasta / 'pedidos.jsonl', copia / 'pedidos.jsonl')
    r = C.correr(Path.cwd(), copia, write=True, pedir=guardado)
assert r['recusas'] == 0 and r['series_mudadas'] == 0 and not r['escrito']
assert len(r['series']) == 10
assert estado() == antes
assert (pasta / 'corredor.json').read_bytes() == relatorio_antes
print('PASS: dez recibos guardados, zero recusas, zero séries mudadas, zero ficheiros canónicos alterados; relatório da repetição intacto.')
