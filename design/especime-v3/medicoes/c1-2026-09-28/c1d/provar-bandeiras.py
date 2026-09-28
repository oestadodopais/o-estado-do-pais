"""Guarda o corpo e a célula exata de cada marca, sem fazer novos pedidos."""
import argparse
import hashlib
import json
from pathlib import Path
import sys
sys.dont_write_bytecode = True
import yaml

AQUI = Path(__file__).resolve().parent
SITIO = AQUI.parents[4]
ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument('--motor', type=Path, required=True)
args = ap.parse_args()
sys.path.insert(0, str(args.motor))
from indicators.refresh import coordenadas_seladas

saida = AQUI / 'corpos-bandeiras'
saida.mkdir(exist_ok=True)
linhas = []
for registo in json.loads((AQUI.parent/'c1c/bandeiras.json').read_text())['linhas']:
    cid = registo['id']
    linha = yaml.safe_load((SITIO/'ledger/claims'/f'{cid}.yml').read_text())
    h = registo['corpo_sha256']
    corpo = (args.motor/'indicators/out/enquadramento-2026-09-28/corpos'/f'{h}.txt').read_bytes()
    assert hashlib.sha256(corpo).hexdigest() == h
    js = json.loads(corpo)
    coords, problemas = coordenadas_seladas(js, registo['url'], linha)
    assert not problemas, (cid, problemas)
    codigos = {d: c['codigo'] for d, c in coords.items()}
    codigos['time'] = linha['reference_date']
    posicao = 0
    indices = {}
    etiquetas = {}
    for d, tamanho in zip(js['id'], js['size']):
        cat = js['dimension'][d]['category']
        idx = cat['index']
        indice = idx.index(codigos[d]) if isinstance(idx, list) else idx[codigos[d]]
        indices[d] = indice
        etiquetas[d] = cat.get('label', {}).get(codigos[d], codigos[d])
        posicao = posicao * tamanho + indice
    def celula(campo):
        v = js[campo]
        return v[posicao] if isinstance(v, list) else v[str(posicao)]
    valor, marca = celula('value'), celula('status')
    assert str(marca) == linha['source_flag'] == registo['flag']
    assert float(''.join(linha['value'].split()).replace(',', '.')) == valor
    (saida/f'{h}.json').write_bytes(corpo)
    linhas.append({'id':cid, 'url':registo['url'], 'lido':registo['quando'], 'corpo':f'corpos-bandeiras/{h}.json',
        'sha256':h, 'id_dimensoes':js['id'], 'size':js['size'], 'coordenada_selada':codigos,
        'etiquetas':etiquetas, 'indices':indices, 'posicao':posicao,
        'pedaco_do_corpo':{'value':{str(posicao):valor}, 'status':{str(posicao):marca}},
        'valor_selado':linha['value'], 'marca':marca})
assert len(linhas) == 18
r = {'origem':'Corpos alojados pelo cliente da casa na C1c; cópias integrais e recortes na coordenada selada.',
     'linhas':linhas,'quantidade':len(linhas),'corpos_distintos':len({r['sha256'] for r in linhas})}
(AQUI/'bandeiras-provadas.json').write_text(json.dumps(r, ensure_ascii=False, indent=2)+'\n')
print(f"{len(linhas)} células conferidas; {r['corpos_distintos']} corpos integrais guardados.")
