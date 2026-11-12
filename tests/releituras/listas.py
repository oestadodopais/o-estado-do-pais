"""CR3: os fechos conservam o histórico e recusam coordenadas contraditórias."""
import importlib.util
import json
from pathlib import Path

spec = importlib.util.spec_from_file_location('aplicar', Path(__file__).resolve().parents[2] / 'scripts/aplicar-releituras.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
raiz = Path(__file__).resolve().parents[2]
reg = json.loads((raiz / 'design/especime-v3/medicoes/cr3-2026-11-12/aplicacao.json').read_text())
modelo = 'export const LUGAR_DECLARADO_DAS_LINHAS = {\n};\n'
plantas = 0
for geo, lugar in [('PT', 'portugal'), ('EU27_2020', 'uniao-europeia')]:
    r = {'id': 'ensaio-cr3', 'url': f'https://fonte.invalid/?geo={geo}', 'coordenadas': {'geo': geo}}
    assert m.lugar_do_pedido(r) == lugar
    texto = m.com_lugar(modelo, r['id'], lugar)
    assert m.com_lugar(texto, r['id'], lugar) == texto
    for p in m.plantas_lugar(r, modelo):
        assert p['mordeu']; plantas += 1
    for url in ('https://fonte.invalid/', f'https://fonte.invalid/?geo={geo}&geo={geo}'):
        try:
            m.lugar_do_pedido({**r, 'url': url})
        except SystemExit as e:
            assert 'geografia desconhecida' in str(e); plantas += 1
        else:
            raise AssertionError('geografia ausente ou repetida aceite')
for linha in reg['linhas']:
    cid = linha['id']
    antes = {'corrections': []}
    depois = {'corrections': linha['entradas_novas']}
    assinatura = {k: depois['corrections'][0][k] for k in ('date', 'kind', 'old_value', 'new_value')}
    fechado = m.com_historia({'outra': []}, cid, antes, depois)
    assert fechado == {'outra': [], cid: [assinatura]}
    assert m.com_historia(fechado, cid, antes, depois) == fechado
    assert m.planta_historia(fechado, cid, antes, depois)['mordeu']; plantas += 1
    # Uma entrada posterior não pode apagar a primeira nem reescrever o seu valor.
    seguinte = {'corrections': [*depois['corrections'], {**assinatura, 'old_value': assinatura['new_value']}]}
    conservado = m.com_historia(fechado, cid, depois, seguinte)
    assert conservado[cid][0] == assinatura and len(conservado[cid]) == 2
print(f'CR3 listas: Portugal e União; idempotência; história conservada; {plantas} recusas.')
