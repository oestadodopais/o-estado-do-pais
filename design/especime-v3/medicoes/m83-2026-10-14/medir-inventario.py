#!/usr/bin/env python3
"""Mede o que há de um conjunto de cadeias pessoais na história de dois repositórios, e escreve só as contagens.
As cadeias NUNCA entram neste ficheiro nem no JSON: chegam pelo ambiente, em INVENTARIO_CADEIAS, uma lista JSON de
objetos {"rotulo": "<um nome neutro>", "cadeia": "<a cadeia>"}; INVENTARIO_SITIO e INVENTARIO_MOTOR são as pastas dos
repositórios; INVENTARIO_DOMINIOS (opcional) uma lista JSON de domínios para o whois; o resultado vai para o ficheiro
dado como primeiro argumento. Para cada cadeia e repositório: os commits cujo diff a introduz ou retira (git log -S),
os nomes de ficheiro que a contêm em toda a história, as mensagens de commit que a contêm, as identidades de autor ou
committer que a contêm, e os ficheiros da cabeça atual que a contêm. uso: medir-inventario.py <saida.json>"""
import json, os, pathlib, subprocess, sys, datetime

def git(repo, *args):
    return subprocess.run(['git', '-C', repo, *args], capture_output=True, text=True, errors='replace').stdout

def contar(repo, cadeia):
    baixa = cadeia.lower()
    commits = len([l for l in git(repo, 'log', '--all', '--format=%H', '-S', cadeia).splitlines() if l])
    nomes = sum(1 for l in set(git(repo, 'log', '--all', '--name-only', '--format=').splitlines()) if baixa in l.lower())
    mensagens = sum(1 for l in git(repo, 'log', '--all', '--format=%H%x00%B%x01').split('\x01') if baixa in l.lower())
    identidades = sum(1 for l in git(repo, 'log', '--all', '--format=%an <%ae> %cn <%ce>').splitlines() if baixa in l.lower())
    cabeca = len([l for l in git(repo, 'grep', '-l', '-I', '-i', cadeia, 'HEAD', '--', '.').splitlines() if l])
    return {'commits_cujo_diff_a_traz': commits, 'nomes_de_ficheiro': nomes, 'mensagens_de_commit': mensagens, 'identidades_de_commit': identidades, 'ficheiros_na_cabeca_atual': cabeca}

def principal():
    saida = pathlib.Path(sys.argv[1])
    cadeias = json.loads(os.environ['INVENTARIO_CADEIAS'])
    repos = {'sitio': os.environ['INVENTARIO_SITIO'], 'motor': os.environ['INVENTARIO_MOTOR']}
    resultado = {'medido_em': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='minutes'), 'cadeias_medidas': len(cadeias), 'repositorios': {}}
    for nome, repo in repos.items():
        total = len([l for l in git(repo, 'log', '--all', '--format=%H').splitlines() if l])
        resultado['repositorios'][nome] = {'commits_em_todas_as_referencias': total, 'por_cadeia': {c['rotulo']: contar(repo, c['cadeia']) for c in cadeias}}
    dominios = json.loads(os.environ.get('INVENTARIO_DOMINIOS', '[]'))
    if dominios:
        resultado['dominios'] = {}
        for d in dominios:
            w = subprocess.run(['whois', d], capture_output=True, text=True, errors='replace').stdout
            linhas_titular = [l for l in w.splitlines() if l.lower().startswith('owner name:')]
            resultado['dominios'][d] = {'linhas_owner_name': len(linhas_titular), 'owner_name_vazio': all(l.split(':', 1)[1].strip() == '' for l in linhas_titular) if linhas_titular else None}
    org = os.environ.get('INVENTARIO_ORG')
    if org:
        pub = subprocess.run(['gh', 'api', f'orgs/{org}/public_members', '--jq', 'length'], capture_output=True, text=True).stdout.strip()
        resultado['organizacao'] = {'membros_publicos': int(pub) if pub.isdigit() else None}
    texto = json.dumps(resultado, ensure_ascii=False, indent=2) + '\n'
    for c in cadeias:  # a garantia: nenhuma cadeia sai no ficheiro
        assert c['cadeia'].lower() not in texto.lower(), 'uma cadeia ia sair no ficheiro'
    saida.write_text(texto, encoding='utf-8')
    print(f'inventário escrito em {saida}: {len(cadeias)} cadeias, {len(repos)} repositórios')

if __name__ == '__main__':
    principal()
