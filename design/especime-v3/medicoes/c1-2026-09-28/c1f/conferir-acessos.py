"""Confere os acessos reconstituídos contra os objetos históricos do Git."""
import argparse
import copy
import json
from pathlib import Path
import re
import subprocess
import yaml

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[4]
BASE = 'cb43b2fcec9e67815894a07ceb95c2cba1b589e4'
IDS = ['evora-prr-aprovado-2026', 'evora-prr-municipio-contratado',
       'evora-prr-pago-2026', 'evora-prr-universidade-contratado',
       'evora-prr-vencido-aprovado-2026']

def git(*args):
    return subprocess.check_output(['git', *args], cwd=RAIZ, text=True).strip()

def objeto(commit, caminho):
    return yaml.safe_load(git('show', f'{commit}:{caminho}'))

def reconstruir(id):
    caminho = f'ledger/claims/{id}.yml'
    eventos = []
    for commit in git('log', '--reverse', '--format=%H', BASE, '--', caminho).splitlines():
        linha = objeto(commit, caminho)
        novo = str(linha['access_date'])
        pai = subprocess.run(['git', 'show', f'{commit}^:{caminho}'], cwd=RAIZ,
                             text=True, capture_output=True)
        antigo = str(yaml.safe_load(pai.stdout)['access_date']) if pai.returncode == 0 else None
        if antigo == novo:
            continue
        data = git('show', '-s', '--format=%cs', commit)
        evento = {'commit': commit, 'date': data, 'old_value': antigo, 'new_value': novo}
        if antigo is not None:
            mensagem = git('show', '-s', '--format=%B', commit)
            datas = set(re.findall(r'instantâneo de (\d{4}-\d{2}-\d{2})', mensagem))
            documento = {str(f['snapshot_date']) for f in linha['document']['computed_over']['files']}
            if len(datas) != 1 or datas != documento:
                raise ValueError(f'{id}: o instantâneo não ficou provado no commit {commit[:8]}.')
            evento['snapshot_date'] = datas.pop()
            diff = git('diff', commit+'^', commit, '--', caminho)
            evento['diff_access_date'] = [l for l in diff.splitlines() if re.match(r'^[+-]access_date:', l)]
            if len(evento['diff_access_date']) != 2:
                raise ValueError(f'{id}: o diff não mostra uma troca de acesso.')
        eventos.append(evento)
    if len(eventos) != 3 or eventos[0]['old_value'] is not None:
        raise ValueError(f'{id}: a história não mostra a criação e as duas mudanças decididas.')
    entradas = []
    for e in eventos[1:]:
        antigo, novo, instantaneo, commit = e['old_value'], e['new_value'], e['snapshot_date'], e['commit'][:8]
        data_casa = lambda d: '.'.join(reversed(d.split('-')))
        a, n, i = map(data_casa, (antigo, novo, instantaneo))
        entradas.append({'date': e['date'], 'kind': 'proveniencia', 'field': 'access_date',
                         'old_value': antigo, 'new_value': novo,
                         'reason': f'O acesso passou de {a} a {n} com o instantâneo do PRR de {i}; a entrada reconstitui pela história pública do repositório (o commit {commit}) a mudança que a linha não registava.',
                         'reason_en': f'The access moved from {a} to {n} with the PRR snapshot of {i}; the entry rebuilds from the public repository history (commit {commit}) the change the row had not recorded.'})
    return eventos, entradas

def conferir(id, linha, esperado):
    entradas = [c for c in linha.get('corrections', []) if c.get('kind') == 'proveniencia' and c.get('field') == 'access_date']
    erros = []
    if len(entradas) != len(esperado):
        erros.append(f'{id}: quantidade de entradas de acesso diferente das mudanças no Git.')
    for n, (a, e) in enumerate(zip(entradas, esperado)):
        for campo in e:
            if a.get(campo) != e[campo]:
                erros.append(f'{id}: entrada {n+1}, {campo} não coincide com a mudança provada pelo Git: esperado {e[campo]}; recebido {a.get(campo)}.')
    return erros

def executar(aplicar=False):
    linhas, plantas, erros = [], [], []
    for id in IDS:
        eventos, entradas = reconstruir(id)
        p = RAIZ/f'ledger/claims/{id}.yml'
        if aplicar:
            texto = p.read_text()
            linha = yaml.safe_load(texto)
            if any(c.get('field') == 'access_date' for c in linha['corrections']):
                raise ValueError(f'{id}: já tem história do acesso; não se acrescenta outra.')
            # Conserva os bytes e a ordem de todas as entradas antigas.
            bloco = ''.join('  - '+ '\n    '.join(f'{k}: {json.dumps(v, ensure_ascii=False)}' for k,v in e.items())+'\n' for e in entradas)
            pos = texto.index('\n# Reconferências.')
            p.write_text(texto[:pos].rstrip()+'\n'+bloco+texto[pos:])
        linha = yaml.safe_load(p.read_text())
        falhas = conferir(id, linha, entradas)
        erros.extend(falhas)
        linhas.append({'id': id, 'eventos_git': eventos, 'entradas': entradas, 'erros': falhas})
        for campo, errado in [('date', '2026-08-19'), ('old_value', '2026-08-05')]:
            plantada = copy.deepcopy(linha)
            alvos = [c for c in plantada['corrections'] if c.get('field') == 'access_date']
            if not alvos:
                continue
            alvos[0][campo] = errado
            falhas = conferir(id, plantada, entradas)
            mordeu = len(falhas) == 1 and f'{campo} não coincide' in falhas[0]
            plantas.append({'id': id, 'campo_trocado': campo, 'falhas': falhas, 'mordeu': mordeu})
            if not mordeu:
                erros.append(f'{id}: a planta de {campo} não mordeu pela razão exata.')
    return {'base_da_reconstituicao': BASE, 'linhas': linhas, 'plantas': plantas, 'erros': erros}

if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--aplicar', action='store_true')
    ap.add_argument('--json', type=Path)
    args = ap.parse_args()
    resultado = executar(args.aplicar)
    if args.json:
        args.json.write_text(json.dumps(resultado, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps(resultado, ensure_ascii=False, indent=2))
    raise SystemExit(bool(resultado['erros']))
