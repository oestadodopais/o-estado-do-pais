"""UE1-c-c: a prova de que as 29 razões das séries por país, no motor e no sítio, são exatamente o que o gerador escreve.
uso, na raiz do sítio: python3 design/especime-v3/medicoes/ue1c-2026-10-26/c/conferir-razoes.py <motor>
Reconstrói cada razão por comparar() do corredor, ponto a ponto, com os carimbos da série e a data da releitura, e compara
byte a byte com as escritas nos quatro ficheiros. Um conhecido-positivo (uma razão alterada em memória) tem de ser apanhado."""
import json, re, sys, pathlib
MOTOR = pathlib.Path(sys.argv[1]).resolve(); sys.path.insert(0, str(MOTOR))
from publisher import series_paises_corredor as C, series_paises as S
import yaml
paises = S.tabela_dos_paises(MOTOR / 'content/13 Dominios/source')
motor_series = json.loads((MOTOR / 'content/13 Dominios/series.json').read_text())['series']
historia = json.loads((MOTOR / 'content/13 Dominios/source/series-paises-revisoes.json').read_text())
def esperadas(serie):
    base = {k: serie[k] for k in ('id', 'name', 'unit', 'periodo', 'document', 'source_url')}
    out = {}
    for c in serie.get('corrections', []):
        a = dict(base, pontos=[{'geo': c['geo'], 'valor': c['old_value']}]); b = dict(base, pontos=[{'geo': c['geo'], 'valor': c['new_value']}])
        # os carimbos: a razão escrita diz as duas datas; reconstrói-se pelo carimbo anterior e atual da série
        m = re.search(r'de (\d{2}\.\d{2}\.\d{4}) \(a versão anterior era de (\d{2}\.\d{2}\.\d{4})\)', c['reason'])
        novo, antigo = m.group(1), m.group(2)
        iso = lambda d: '-'.join(reversed(d.split('.'))) + 'T00:00:00+00:00'
        r = C.comparar(a, b, iso(antigo), iso(novo), c['date'], paises)[0]
        out[c['geo']] = (r['reason'], r['reason_en'])
    return out
total = 0; maus = []
for s in motor_series:
    if not s.get('corrections'): continue
    esp = esperadas(s)
    fontes = {'motor series.json': {c['geo']: (c['reason'], c['reason_en']) for c in s['corrections']},
              'motor revisoes.json': {c['geo']: (c['reason'], c['reason_en']) for c in historia.get(s['id'], [])},
              'sítio yml': {c['geo']: (c['reason'], c['reason_en']) for c in yaml.safe_load(open(f"ledger/series/{s['id']}.yml"))['corrections']}}
    for nome, got in fontes.items():
        for geo, par in esp.items():
            total += 1
            if got.get(geo) != par: maus.append((s['id'], nome, geo))
print(f'razões conferidas: {total} (29 revisões em 3 fontes) · diferentes: {len(maus)}')
for m in maus: print('  DIFERE', m)
# conhecido-positivo
s = next(s for s in motor_series if s['id'] == 'divida-publica-2025-paises'); esp = esperadas(s)
assert esp['BE'][0] != esp['BE'][0].replace('108,1', '108,2'), 'o conhecido-positivo não distingue'
print('conhecido-positivo: uma razão alterada em memória é diferente da esperada: apanhado')
sys.exit(1 if maus else 0)
