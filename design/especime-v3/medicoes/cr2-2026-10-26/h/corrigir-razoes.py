"""CR2-h: razões pelos extratos, com verificação integral antes de escrever."""
import copy
import json
import re
from collections import Counter
from decimal import Decimal
from pathlib import Path
import yaml

PASTA = Path(__file__).resolve().parent.parent
IDS = [i for i in json.loads((PASTA / 'ids.json').read_text())
       if i not in ['divida-publica-2025', 'divida-publica-2025-ue']]

def ler(dia):
    ficheiro = f'painel-2026-10-{dia}.alarmes.txt'
    texto = (PASTA / ficheiro).read_text()
    data = re.search(r'corrida semanal de (\d{4}-\d{2}-\d{2})T', texto)[1]
    linhas = {}
    for n, linha in enumerate(texto.splitlines(), 1):
        m = re.match(r'ALARM\s+(\S+):.*carimbo (\S+) -> (\S+), valor (\S+) -> (\S+)', linha)
        if m:
            assert m[1] not in linhas
            linhas[m[1]] = dict(ficheiro=ficheiro, linha=n, antiga=m[2], nova=m[3], old=m[4], new=m[5], data=data)
    return linhas

def data(s):
    return '.'.join(str(s)[:10].split('-')[::-1])

def numero(s):
    return Decimal(str(s).replace(',', '.').replace(' ', '').replace('\u00a0', '').replace('\u202f', ''))

def valor(s, en=False):
    v = numero(s)
    t = f'{v:,.1f}'.replace(',', '\u202f')
    if v == v.to_integral() and abs(v) >= 1000:
        t = t[:-2]
    return t if en else t.replace('.', ',')

def main():
    a, b = ler('19'), ler('26')
    provas, escritas = [], []
    for cid in IDS:
        f = Path('ledger/claims') / (cid + '.yml')
        original = f.read_text()
        antes = yaml.safe_load(original)
        esperado = copy.deepcopy(antes)
        atualizacoes = [e for e in esperado['corrections'] if str(e['date']) == '2026-10-26' and e['kind'] == 'atualizacao']
        acessos = [e for e in esperado['corrections'] if str(e['date']) == '2026-10-26' and e.get('field') == 'access_date']
        assert len(atualizacoes) == len(acessos) == 1, cid
        u, acesso = atualizacoes[0], acessos[0]
        r = b[cid]
        caso = 'B' if cid == 'divida-das-empresas-2025-ue' else 'A' if cid in a else 'C'
        assert numero(u['old_value']) == numero(r['old']), cid
        assert numero(u['new_value']) == numero(r['new']), cid
        assert str(u['date']) == r['data'] == str(antes['access_date']), cid
        if caso in ('A', 'B'):
            x = a[cid]
            assert x['data'] == '2026-10-19' and x['nova'] == r['antiga'], cid
            assert numero(x['old']) == numero(r['old']), cid
            if caso == 'A':
                assert numero(x['new']) == numero(r['new']), cid
            else:
                assert [numero(x['old']), numero(x['new']), numero(r['new'])] == list(map(Decimal, ['70.0', '70.3', '70.2'])), cid
                assert [data(x['antiga']), data(x['nova']), data(r['antiga']), data(r['nova'])] == ['09.10.2026', '17.10.2026', '17.10.2026', '24.10.2026'], cid
        for en, key in [(False, 'reason'), (True, 'reason_en')]:
            old, new, dia26 = valor(r['old'], en), valor(r['new'], en), data(r['data'])
            if caso in ('A', 'B'):
                ant, nova, n26, dia19 = data(x['antiga']), data(x['nova']), data(r['nova']), data(x['data'])
                if caso == 'A':
                    t = (f'Eurostat revised the value from {old} to {new} in the dataset update of {nova} (the previous version was of {ant}). The weekly comparison with the source of {dia19} found the revision, the one of {dia26} read the same value in the version of {n26}, and this project re-read the source on {dia26}; until then the value of the earlier reading was published.' if en else f'O Eurostat reviu o valor de {old} para {new} na atualização do conjunto de dados de {nova} (a versão anterior era de {ant}). A comparação semanal com a fonte de {dia19} encontrou a revisão, a de {dia26} leu o mesmo valor na versão de {n26}, e este projeto releu a fonte a {dia26}; até aí publicava-se o valor da leitura anterior.')
                else:
                    meio = valor(x['new'], en)
                    t = (f'Eurostat revised the value from {old} to {meio} in the dataset update of {nova} (the previous version was of {ant}) and again to {new} in the one of {n26}. The weekly comparison with the source of {dia19} found the first revision and the one of {dia26} the second; this project re-read the source on {dia26} and until then published {old}.' if en else f'O Eurostat reviu o valor de {old} para {meio} na atualização do conjunto de dados de {nova} (a versão anterior era de {ant}) e outra vez para {new} na de {n26}. A comparação semanal com a fonte de {dia19} encontrou a primeira revisão e a de {dia26} a segunda; este projeto releu a fonte a {dia26} e até aí publicava {old}.')
            else:
                ant, nova = data(r['antiga']), data(r['nova'])
                t = (f'Eurostat revised the value from {old} to {new} in the dataset update of {nova} (the previous version was of {ant}). The weekly comparison with the source of {dia26} found the revision and this project re-read the source that day; until then the value of the earlier reading was published.' if en else f'O Eurostat reviu o valor de {old} para {new} na atualização do conjunto de dados de {nova} (a versão anterior era de {ant}). A comparação semanal com a fonte de {dia26} encontrou a revisão e este projeto releu a fonte nesse dia; até aí publicava-se o valor da leitura anterior.')
            u[key] = t
        trocas = [('o dia da releitura pelo cliente da casa', 'o dia em que este projeto releu a fonte'), ('the day of the re-read by the house client', 'the day this project re-read the source')]
        for key, (antigo, novo) in zip(['reason', 'reason_en'], trocas):
            assert acesso[key].count(antigo) == 1, cid
            acesso[key] = acesso[key].replace(antigo, novo)
        partes = re.split(r'(?=^ *- date:)', original, flags=re.M)
        for n, bloco in enumerate(partes):
            m = re.match(r"( *)- date: ['\"]?2026-10-26", bloco)
            if m and re.search(r'\n +kind: atualizacao\n', bloco):
                margem = m[1] + '  '
                for key in ['reason', 'reason_en']:
                    bloco, vezes = re.subn(rf'^{margem}{key}:[^\n]*(?:\n{margem}  [^\n]*)*', lambda _: f'{margem}{key}: ' + json.dumps(u[key], ensure_ascii=False), bloco, flags=re.M)
                    assert vezes == 1, cid
                partes[n] = bloco
        novo = ''.join(partes)
        for antigo, substituto in trocas:
            assert novo.count(antigo) == 1, cid
            novo = novo.replace(antigo, substituto)
        assert yaml.safe_load(novo) == esperado, cid
        escritas.append((f, novo))
        provas.append(dict(id=cid, caso=caso, registo19=a.get(cid), registo26=r, reason=u['reason'], reason_en=u['reason_en'], proveniencia={k: acesso[k] for k in ['reason', 'reason_en']}, outros_campos_iguais=True))
    assert Counter(e['caso'] for e in provas) == {'A': 9, 'B': 1, 'C': 5}
    for f, novo in escritas:
        f.write_text(novo)
    (PASTA / 'h/razoes.json').write_text(json.dumps(provas, ensure_ascii=False, indent=2) + '\n')
    print('15 atualizações bilingues e 15 razões de acesso bilingues corrigidas; só reason e reason_en mudaram nas duas entradas de cada linha.')

if __name__ == '__main__':
    main()
