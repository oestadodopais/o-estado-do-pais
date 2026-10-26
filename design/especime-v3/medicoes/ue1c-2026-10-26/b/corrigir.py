"""UE1-c-b: regenerar razões dos corpos guardados, sem mudar qualquer outro campo.

Uso, na raiz do sítio: python3 <este guião> <motor>
Os alarmes adjacentes são a transcrição do §0.3 do mandato, não uma nova medição.
"""
import copy
import json
import re
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

import yaml

SITE = Path.cwd()
MOTOR = Path(sys.argv[1]).resolve()
OUT = Path(__file__).resolve().parent
sys.path.insert(0, str(MOTOR))
from publisher import series_paises as S, series_paises_corredor as C, export_series as E


def ler(p):
    return json.loads(p.read_text())


def base(repo, rel, ref):
    return subprocess.check_output(['git', '-C', str(repo), 'show', f'{ref}:{rel}'])


def sem_razoes(valor):
    if isinstance(valor, dict):
        return {k: sem_razoes(v) for k, v in valor.items() if k not in ('reason', 'reason_en')}
    if isinstance(valor, list):
        return [sem_razoes(v) for v in valor]
    return valor


def dia(iso):
    return datetime.fromisoformat(iso).strftime('%d.%m.%Y')


fonte = S.SOURCE
pedidos = MOTOR / 'indicators/out/series-paises/2026-10-26'
primeira = ler(pedidos / 'primeira-releitura.json')
doc = ler(S.SERIES)
historia = ler(fonte / C.HISTORIA)
paises = S.tabela_dos_paises(fonte)
tabela_site = ler(SITE / 'src/data/paises-da-uniao.json')['paises']
assert [(p['geo'], p['pt'], p['en']) for p in paises] == [(p['geo'], p['pt'], p['en']) for p in tabela_site]
nomes = {p['geo']: p for p in paises} | {'EU27_2020': {'pt': 'União Europeia', 'en': 'European Union'}}
novas_series = {}
exemplos = []
total = 0
for r in primeira['series']:
    if r['estado'] != 'mudou':
        continue
    s = next(s for s in doc['series'] if s['id'] == r['serie'])
    velha = S.construir_serie(s['linha_de_portugal'], SITE, paises, fonte,
                             ficheiro=r['corpo_anterior'], conferir_gemeas=False, com_historia=False)['serie']
    nova = S.construir_serie(s['linha_de_portugal'], SITE, paises, fonte,
                            ficheiro=r['corpo_novo'], conferir_gemeas=False, com_historia=False)['serie']
    assert nova['pontos'] == s['pontos'], f"PAROU: os pontos mudaram em {s['id']}"
    stamps = [ler(fonte / r[k])['updated'] for k in ('corpo_anterior', 'corpo_novo')]
    assert stamps == [r['carimbo_anterior'], r['carimbo_novo']]
    novas = C.comparar(velha, nova, *stamps, '2026-10-26', paises)
    assert sem_razoes(novas) == sem_razoes(r['revisoes']) == sem_razoes(s['corrections']) == sem_razoes(historia.get(s['id'], []))
    for c in novas:
        nome = nomes[c['geo']]
        a, n = c['old_value'], c['new_value']
        assert c['reason'] == (f"O Eurostat reviu o valor de {nome['pt']} de {a} para {n} na atualização do conjunto de dados de {dia(stamps[1])} (a versão anterior era de {dia(stamps[0])}); este projeto releu a fonte a 26.10.2026.")
        assert c['reason_en'] == (f"Eurostat revised the value for {nome['en']} from {E.fonte_da_casa(a)} to {E.fonte_da_casa(n)} in the dataset update of {dia(stamps[1])} (the previous version was of {dia(stamps[0])}); this project re-read the source on 26.10.2026.")
    total += len(novas)
    exemplos.extend({'serie': s['id'], **c} for c in novas)
    s['corrections'] = novas
    historia[s['id']] = novas
    r['revisoes'] = novas
    novas_series[s['id']] = E.render_serie(s)
assert total == 29 and len(novas_series) == 6
for rel, valor in [('content/13 Dominios/series.json', doc),
                   ('content/13 Dominios/source/' + C.HISTORIA, historia),
                   ('indicators/out/series-paises/2026-10-26/primeira-releitura.json', primeira)]:
    assert sem_razoes(json.loads(base(MOTOR, rel, '6c44edf'))) == sem_razoes(valor), rel

# Só saem os quatro corpos sem registo indicados no mandato, confirmados nos recibos.
man = S.manifesto(fonte)
recibos = [json.loads(l) for l in (pedidos / 'pedidos.jsonl').read_text().splitlines()]
retirados = []
for p in recibos:
    rel = f"{C.PASTA}/2026-10-26/{p['sha256']}/{p['file']}"
    if rel in man:
        continue
    assert p['file'][:3] in ('001', '003', '009', '010')
    assert S.sha256((pedidos / p['file']).read_bytes()) == p['sha256']
    alvo = fonte / rel
    if alvo.exists():
        assert S.sha256(alvo.read_bytes()) == p['sha256']
        alvo.unlink()
        alvo.parent.rmdir()
    retirados.append(rel)
assert len(retirados) == 4
inventario = C.conferir_manifesto(fonte)
for nome in ('FETCH.json', 'MANIFEST.sha256'):
    assert (fonte / nome).read_bytes() == base(MOTOR, 'content/13 Dominios/source/' + nome, '6c44edf')

# O ALARM fixa datas e valores; qualquer outra forma ou conteúdo para o guião.
linhas = []
for alarme in (OUT / 'alarmes.txt').read_text().splitlines():
    m = re.fullmatch(r'ALARM   (divida-publica-2025(?:-ue)?): value — revisão da fonte: carimbo (\S+) -> (\S+), valor ([\d.]+) -> ([\d.]+)  kind=atualizacao \(a fonte foi revista\)', alarme)
    assert m, 'PAROU: ALARM diferente'
    id_, a, n, va, vn = m.groups()
    assert (a, n) == ('2026-04-22T11:00:00+0200', '2026-10-21T11:00:00+0200')
    assert (va, vn) == {'divida-publica-2025': ('89.7', '89.2'), 'divida-publica-2025-ue': ('81.7', '81.5')}[id_]
    alvo = SITE / 'ledger/claims' / (id_ + '.yml')
    texto = base(SITE, str(alvo.relative_to(SITE)), '07233897d').decode()
    antes = yaml.safe_load(texto)
    depois = copy.deepcopy(antes)
    c = next(c for c in depois['corrections'] if c['date'] == '2026-10-26' and c['kind'] == 'atualizacao')
    assert (c['old_value'], c['new_value']) == (va.replace('.', ','), vn.replace('.', ','))
    c['reason'] = f"O Eurostat reviu o valor de {c['old_value']} para {c['new_value']} na atualização do conjunto de dados de {dia(n)} (a versão anterior era de {dia(a)}). A comparação semanal com a fonte de 26.10.2026 encontrou a revisão e este projeto releu a fonte nesse dia; até aí publicava-se o valor da leitura anterior."
    c['reason_en'] = f"Eurostat revised the value from {va} to {vn} in the dataset update of {dia(n)} (the previous version was of {dia(a)}). The weekly comparison with the source of 26.10.2026 found the revision and this project re-read the source that day; until then the value of the earlier reading was published."
    prov = next(c for c in depois['corrections'] if c.get('field') == 'access_date' and c['date'] == '2026-10-26')
    prov['reason'] = prov['reason'].replace('no dia da reconferência que viu a revisão', 'o dia em que este projeto releu a fonte')
    prov['reason_en'] = prov['reason_en'].replace('the day of the check that caught the revision', 'the day this project re-read the source')
    assert sem_razoes(antes) == sem_razoes(depois)
    for x, y in zip(antes['corrections'], depois['corrections']):
        if x != y:
            assert y['kind'] == 'atualizacao' or y.get('field') == 'access_date'
    # Trocar apenas os nós das razões conserva byte a byte o resto do YAML.
    arvore = yaml.compose(texto)
    correcoes = next(v for k, v in arvore.value if k.value == 'corrections')
    trocas = []
    for i, node in enumerate(correcoes.value):
        for chave, valor in node.value:
            k = chave.value
            if k in ('reason', 'reason_en') and antes['corrections'][i][k] != depois['corrections'][i][k]:
                trocas.append((valor.start_mark.index, valor.end_mark.index, json.dumps(depois['corrections'][i][k], ensure_ascii=False)))
    for inicio, fim, novo in sorted(trocas, reverse=True):
        texto = texto[:inicio] + novo + texto[fim:]
    assert yaml.safe_load(texto) == depois
    linhas.append((alvo, texto))
assert len(linhas) == 2

C.escrever_json(S.SERIES, doc)
C.escrever_json(fonte / C.HISTORIA, historia)
C.escrever_json(pedidos / 'primeira-releitura.json', primeira)
# A emenda autorizada é renderizada pelo exportador antes da travessia integral.
# A VS6 continua intacta: a conferência acima só permite alterar as duas razões.
for sid, texto in novas_series.items():
    alvo = SITE / 'ledger/series' / (sid + '.yml')
    assert sem_razoes(yaml.safe_load(alvo.read_text())) == sem_razoes(yaml.safe_load(texto))
    alvo.write_text(texto)
for alvo, texto in linhas:
    alvo.write_text(texto)
C.escrever_json(OUT / 'correcao.json', {'revisoes': total, 'series_reexportadas': sorted(novas_series),
    'manifesto': inventario, 'retirados': retirados, 'razoes': exemplos,
    'autoridade': 'publisher.series_paises.tabela_dos_paises, conferida contra src/data/paises-da-uniao.json'})
print(f"PASS: {total} revisões, {len(novas_series)} séries, {len(retirados)} corpos retirados; manifesto {inventario}; duas linhas só com razões alteradas")
