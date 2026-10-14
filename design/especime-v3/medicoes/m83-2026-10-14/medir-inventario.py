#!/usr/bin/env python3
"""Mede o que há de um conjunto de cadeias pessoais na história de dois repositórios, e escreve só as contagens.
As cadeias NUNCA entram neste ficheiro nem no JSON: chegam pelo ambiente, em INVENTARIO_CADEIAS, uma lista JSON de
objetos {"rotulo": "<um nome neutro>", "cadeia": "<a cadeia>"}; INVENTARIO_SITIO e INVENTARIO_MOTOR são as pastas dos
repositórios; INVENTARIO_DOMINIOS (opcional) uma lista JSON de domínios para o whois; INVENTARIO_ORG (opcional) a
organização do GitHub (membros, membros públicos); INVENTARIO_REPO_PUBLICO (opcional) o repositório público
(forks, estrelas, pull requests). O resultado vai para o ficheiro dado como primeiro argumento. Para cada cadeia e
repositório: os commits cujo diff a introduz ou retira (git log -S), os nomes de ficheiro que a contêm em toda a
história, as mensagens de commit que a contêm, as identidades de autor ou committer que a contêm, e os ficheiros da
cabeça atual que a contêm. Um comando do Git que falhe para o guião (nunca um zero calado); o whois e o gh que falhem
ficam registados como erro no seu campo. A garantia de que nenhuma cadeia sai no ficheiro é uma verificação explícita,
não um assert (a segunda leitura da M83, achado 6). uso: medir-inventario.py <saida.json>"""
import json, os, pathlib, subprocess, sys, datetime

def git(repo, *args):
    r = subprocess.run(['git', '-C', repo, *args], capture_output=True, text=True, errors='replace')
    if r.returncode != 0:
        raise SystemExit(f'medir-inventario: git {args[0]} falhou em {repo} (código {r.returncode}); o inventário não se escreve.')
    return r.stdout

def grep_cabeca(repo, cadeia):
    r = subprocess.run(['git', '-C', repo, 'grep', '-l', '-I', '-i', '-e', cadeia, 'HEAD', '--', '.'], capture_output=True, text=True, errors='replace')
    if r.returncode not in (0, 1):  # 1 é «nenhuma ocorrência»
        raise SystemExit(f'medir-inventario: git grep falhou em {repo} (código {r.returncode}); o inventário não se escreve.')
    return len([l for l in r.stdout.splitlines() if l])

def contar(repo, cadeia):
    baixa = cadeia.lower()
    commits = len([l for l in git(repo, 'log', '--all', '--format=%H', '-S', cadeia).splitlines() if l])
    nomes = sum(1 for l in set(git(repo, 'log', '--all', '--name-only', '--format=').splitlines()) if baixa in l.lower())
    mensagens = sum(1 for l in git(repo, 'log', '--all', '--format=%H%x00%B%x01').split('\x01') if baixa in l.lower())
    identidades = sum(1 for l in git(repo, 'log', '--all', '--format=%an <%ae> %cn <%ce>').splitlines() if baixa in l.lower())
    return {'commits_cujo_diff_a_traz': commits, 'nomes_de_ficheiro': nomes, 'mensagens_de_commit': mensagens, 'identidades_de_commit': identidades, 'ficheiros_na_cabeca_atual': grep_cabeca(repo, cadeia)}

def externo(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, errors='replace')
    return (r.stdout.strip(), None) if r.returncode == 0 else (None, f'código {r.returncode}')

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
            w, erro = externo(['whois', d])
            if erro:
                resultado['dominios'][d] = {'erro': erro}
                continue
            linhas_titular = [l for l in w.splitlines() if l.lower().startswith('owner name:')]
            resultado['dominios'][d] = {'linhas_owner_name': len(linhas_titular), 'owner_name_vazio': all(l.split(':', 1)[1].strip() == '' for l in linhas_titular) if linhas_titular else None}
    org = os.environ.get('INVENTARIO_ORG')
    if org:
        pub, e1 = externo(['gh', 'api', f'orgs/{org}/public_members', '--jq', 'length'])
        todos, e2 = externo(['gh', 'api', f'orgs/{org}/members', '--jq', 'length'])
        resultado['organizacao'] = {'membros_publicos': int(pub) if pub and pub.isdigit() else None, 'membros': int(todos) if todos and todos.isdigit() else None, 'erros': [e for e in (e1, e2) if e]}
    repo_publico = os.environ.get('INVENTARIO_REPO_PUBLICO')
    if repo_publico:
        dados, e1 = externo(['gh', 'api', f'repos/{repo_publico}', '--jq', '{forks: .forks_count, estrelas: .stargazers_count}'])
        prs, e2 = externo(['gh', 'pr', 'list', '-R', repo_publico, '--state', 'all', '--limit', '500', '--json', 'number', '--jq', 'length'])
        resultado['repositorio_publico'] = {**(json.loads(dados) if dados else {}), 'pull_requests': int(prs) if prs and prs.isdigit() else None, 'erros': [e for e in (e1, e2) if e]}
    texto = json.dumps(resultado, ensure_ascii=False, indent=2) + '\n'
    fugas = [c['rotulo'] for c in cadeias if c['cadeia'].lower() in texto.lower()]
    if fugas:
        raise SystemExit(f'medir-inventario: uma cadeia ia sair no ficheiro (rótulos: {", ".join(fugas)}); o inventário não se escreve.')
    saida.write_text(texto, encoding='utf-8')
    print(f'inventário escrito em {saida}: {len(cadeias)} cadeias, {len(repos)} repositórios')

if __name__ == '__main__':
    principal()
