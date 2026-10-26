"""Auditoria de leitura do pacote UE1-c-b, independente da escrita das razões."""
import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path

import yaml

site = Path.cwd()
motor = Path(os.environ['RESEARCHHUB_DIR']).resolve()
out = Path(__file__).resolve().parent
sys.path.insert(0, str(motor))
from publisher import series_paises as S, series_paises_corredor as C


def ler(p):
    return json.loads(p.read_text())


def original(repo, ref, rel):
    return subprocess.check_output(['git', '-C', str(repo), 'show', f'{ref}:{rel}'])


def sem_razoes(v):
    if isinstance(v, dict):
        return {k: sem_razoes(x) for k, x in v.items() if k not in ('reason', 'reason_en')}
    if isinstance(v, list):
        return [sem_razoes(x) for x in v]
    return v


doc = ler(S.SERIES)
fonte = S.SOURCE
nomes = {p['geo']: p for p in ler(site / 'src/data/paises-da-uniao.json')['paises']}
nomes['EU27_2020'] = {'pt': 'União Europeia', 'en': 'European Union'}
corrida = motor / 'indicators/out/series-paises/2026-10-26'
primeira = ler(corrida / 'primeira-releitura.json')
historia = ler(fonte / C.HISTORIA)
revisoes = 0
for s in doc['series']:
    yml = yaml.safe_load((site / 'ledger/series' / (s['id'] + '.yml')).read_text())
    assert yml == s
    antes = yaml.safe_load(original(site, '07233897d', 'ledger/series/' + s['id'] + '.yml'))
    assert sem_razoes(antes) == sem_razoes(s)
    r = next(r for r in primeira['series'] if r['serie'] == s['id'])
    assert (s.get('corrections') or []) == historia.get(s['id'], []) == r['revisoes']
    for c in r['revisoes']:
        datas = [datetime.fromisoformat(ler(fonte / r[k])['updated']).strftime('%d.%m.%Y')
                 for k in ('corpo_anterior', 'corpo_novo')]
        a, n = c['old_value'], c['new_value']
        nome = nomes[c['geo']]
        assert c['reason'] == f"O Eurostat reviu o valor de {nome['pt']} de {a} para {n} na atualização do conjunto de dados de {datas[1]} (a versão anterior era de {datas[0]}); este projeto releu a fonte a 26.10.2026."
        assert c['reason_en'] == f"Eurostat revised the value for {nome['en']} from {a.replace(',', '.')} to {n.replace(',', '.')} in the dataset update of {datas[1]} (the previous version was of {datas[0]}); this project re-read the source on 26.10.2026."
        revisoes += 1
assert revisoes == 29
for rel in ('content/13 Dominios/series.json', 'content/13 Dominios/source/' + C.HISTORIA,
            'indicators/out/series-paises/2026-10-26/primeira-releitura.json'):
    assert sem_razoes(ler(motor / rel)) == sem_razoes(json.loads(original(motor, '6c44edf', rel)))
for id_ in ('divida-publica-2025', 'divida-publica-2025-ue'):
    rel = 'ledger/claims/' + id_ + '.yml'
    antes = yaml.safe_load(original(site, '07233897d', rel))
    depois = yaml.safe_load((site / rel).read_text())
    assert sem_razoes(antes) == sem_razoes(depois)
    mudadas = []
    for a, n in zip(antes['corrections'], depois['corrections']):
        if a != n:
            assert a['date'] == '2026-10-26'
            assert {k for k in a if a[k] != n[k]} == {'reason', 'reason_en'}
            mudadas.append(n.get('field', n['kind']))
        if n.get('field') == 'access_date':
            assert n['reason'] == a['reason'].replace('no dia da reconferência que viu a revisão', 'o dia em que este projeto releu a fonte')
            assert n['reason_en'] == a['reason_en'].replace('the day of the check that caught the revision', 'the day this project re-read the source')
    assert mudadas == ['atualizacao', 'access_date']
inventario = C.conferir_manifesto(fonte)
for nome in ('FETCH.json', 'MANIFEST.sha256'):
    assert (fonte / nome).read_bytes() == original(motor, '6c44edf', 'content/13 Dominios/source/' + nome)
recibos = [json.loads(l) for l in (corrida / 'pedidos.jsonl').read_text().splitlines()]
assert len(recibos) == 10
for r in recibos:
    rel = 'indicators/out/series-paises/2026-10-26/' + r['file']
    bruto = (motor / rel).read_bytes()
    assert bruto == original(motor, '6c44edf', rel) and S.sha256(bruto) == r['sha256']
assert (motor / 'indicators/reler_linhas.py').read_bytes() == original(motor, 'master', 'indicators/reler_linhas.py')
assert '"publisher.series_paises_corredor_test"' in (motor / 'core/gate.py').read_text()
manifesto = [{'ficheiro': rel, 'sha256': sha} for rel, sha in S.manifesto(fonte).items() if rel.startswith(C.PASTA + '/')]
resultado = {'revisoes': revisoes, 'manifesto': inventario, 'corpos_canónicos': manifesto,
             'corpos_da_corrida_preservados': len(recibos), 'reler_linhas_igual_a_master': True,
             'modulo_no_core_gate': True, 'campos_alterados': ['reason', 'reason_en']}
(out / 'auditoria.json').write_text(json.dumps(resultado, ensure_ascii=False, indent=2) + '\n')
print(f"PASS: {revisoes} revisões bilingues; {inventario}; {len(recibos)} corpos da corrida intactos; só razões mudadas; reler_linhas.py igual a master; módulo no core.gate")
