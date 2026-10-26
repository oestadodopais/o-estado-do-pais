"""Relê a correção do petróleo e a data do Eurostat nas fontes alojadas."""
import hashlib
import json
from pathlib import Path
import sys

motor = Path(sys.argv[1]).resolve()
sys.path.insert(0, str(motor))
from publisher import oe2027_generalidade as G

saida = Path(__file__).resolve().parent
specs = G.load(G.STUDY / 'extracoes.json')['rows']
ids = ['og1-utao-brent-mf-2027', 'og1-utao-brent-contratos-2027',
       'og1-utao-brent-diferenca', 'og1-eurostat-portugal-2025']
rows = [G.extract(next(s for s in specs if s['id'] == id)) for id in ids]
assert [r['value'] for r in rows[:3]] == ['86,1', '95', '11']
frase = 'a média dos contratos de 2027 era de cerca de 95 USD, 11% acima dos 86,1 USD assumidos pelo MF'
assert frase in G.norm(rows[0]['excerpt'])
assert rows[3]['period'] == '2026-10-21'
provas = []
for r in [rows[0], rows[3]]:
    s = next(s for s in specs if s['id'] == r['id'])
    text, receipt = G.surface(s)
    if r['id'] == ids[3]:
        assert '2026-10-21' in (motor / r['document']['file']).read_text()
    provas.append({'id': r['id'], 'document': r['document'], 'recibo': receipt})
manifest = G.load(motor / 'publisher/manifest.og1a.json')
selecionadas = [r['site_id'] for r in manifest['rows']]
assert len(selecionadas) == len(set(selecionadas)) == 33
assert ids[3] not in selecionadas
resultado = {
    'petroleo': {'frase_na_fonte': frase, 'valores': [r['value'] for r in rows[:3]],
                 'decisao_a6': 'Os contratos estão 11% acima do pressuposto da proposta.',
                 'codigo': 0},
    'eurostat': {'data_na_fonte': '2026-10-21', 'linha': ids[3],
                 'integra_selecao_autorizada': False,
                 'limite': 'A fonte existe; a data do item usa published_at da linha existente divida-publica-2024, conferida em data-a6.json.'},
    'provas': provas,
    'manifest_sha256': hashlib.sha256((motor / 'publisher/manifest.og1a.json').read_bytes()).hexdigest(),
    'codigo': 0,
}
(saida / 'fontes-a6.json').write_text(json.dumps(resultado, ensure_ascii=False, indent=2) + '\n')
print('Petróleo: 86,1; 95; 11. Os contratos estão acima do pressuposto, como a OG1-A6 escreve.')
print('Eurostat: data 2026-10-21 confirmada no corpo alojado; a linha está fora da seleção fechada.')
print('Duas fontes e recibos relidos; nenhuma alteração no motor ou no livro do sítio.')
