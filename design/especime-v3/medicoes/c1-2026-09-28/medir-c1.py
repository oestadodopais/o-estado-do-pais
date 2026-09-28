#!/usr/bin/env python3
"""Mede a entrega C1 a partir dos ficheiros e do Git, sem inventar resultados."""
import datetime as dt
import hashlib
import json
import os
import re
from pathlib import Path
import subprocess
import tempfile
from functools import lru_cache

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]
BASE = '48a5a1c181c1753036d301204884c57119bba8a5'
MOTOR_BASE = '4eb2867936dd14ad2654751722e390804e68dda3'
MOTOR = Path.home() / 'Instruments/ResearchHub/.worktrees/c1-2026-09-28'

def git(*args, cwd=RAIZ):
    return subprocess.check_output(['git', *args], cwd=cwd).decode().strip()

def ler(nome):
    return json.loads((AQUI / nome).read_text())

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def proibidos():
    return [str(Path.home()).encode(), Path.home().name.lower().encode(),
            str(Path.home().parent).encode() + b'/',
            (('/private' + '/' + 'var/folders') + '/').encode(),
            (('/private' + '/tmp') + '/').encode(), ('/' + 'tmp/').encode()]

# Caminhos absolutos do sistema, também fora da pasta pessoal e do repositório.
ABSOLUTO = re.compile(rb'(?<![A-Za-z0-9:/])/(?:opt|usr|Library|Applications|System|Volumes|var|private|etc|bin|sbin|home|root|Users|tmp)/[^\s"<>`\x1b]+')

@lru_cache(maxsize=1)
def nomes_dos_autores():
    nomes = git('log', '--format=%an', f'{BASE}..HEAD').splitlines()
    # Os nomes retirados do inventário vêm do Git, nunca de uma lista pessoal.
    inventario = git('show', f'{BASE}:design/especime-v3/INVENTARIO-FRASES.md')
    nomes.extend(re.findall(r'(?:responsável editorial:|editorial responsibility:|Diretor:|Director:) ([^|·\n]+)', inventario))
    return tuple(sorted({n.strip().encode() for n in nomes if n.strip() and
                         not any(x in n.lower() for x in ('codex', 'claude', 'bot', 'openai'))}))

def tem_caminho(b):
    # Estes dois nomes de intérpretes são portáveis, não caminhos desta máquina.
    b = b.replace(('/' + 'usr/bin/env').encode(), b'<interprete portavel>').replace(('/' + 'bin/sh').encode(), b'<interprete portavel>')
    # São ligações relativas da navegação do BCE nos corpos alojados. A
    # exceção só abrange estes atributos e diretórios, não caminhos em prosa,
    # logs ou código, nem nomes pessoais dentro do atributo.
    sem_navegacao = re.sub(rb"(?:href|src)=([\"'])/" + rb"home/(?:html|shared|sitedir|data-protection|search)/[^\"']+\1", b'<ligacao relativa da origem>', b)
    anfitriao = re.search(rb'\b[a-z0-9_-]*(?:macbook|imac|mac-mini|macmini)[a-z0-9_.-]*\.local\b', b, re.I)
    return bool(anfitriao or ABSOLUTO.search(sem_navegacao)) or any(x.lower() in b.lower() for x in proibidos()+list(nomes_dos_autores()))

def medir_caminhos():
    erros, total, historia = [], 0, 0
    for rotulo, repo, base in [('sítio', RAIZ, BASE), ('motor', MOTOR, MOTOR_BASE)]:
        nomes = set(git('diff', '--name-only', base, cwd=repo).splitlines())
        nomes.update(git('ls-files', '--others', '--exclude-standard', cwd=repo).splitlines())
        if repo == RAIZ:
            nomes.update(str(p.relative_to(repo)) for p in AQUI.rglob('*') if p.is_file())
        for nome in sorted(nomes):
            p = repo / nome
            if p.is_file():
                total += 1
                if tem_caminho(p.read_bytes()): erros.append({'árvore': rotulo, 'ficheiro': nome})
        for commit in git('rev-list', f'{base}..HEAD', cwd=repo).splitlines():
            for nome in git('diff-tree', '--no-commit-id', '--name-only', '-r', commit, cwd=repo).splitlines():
                r = subprocess.run(['git', 'show', f'{commit}:{nome}'], cwd=repo, capture_output=True)
                if r.returncode == 0:
                    historia += 1
                    if tem_caminho(r.stdout): erros.append({'árvore': rotulo, 'ficheiro': nome, 'commit': commit})
    with tempfile.TemporaryDirectory(prefix='c1-positivo-') as td:
        p = Path(td) / 'positivo.txt'
        p.write_bytes(b'\n'.join(proibidos()))
        positivo = tem_caminho(p.read_bytes())
        conhecidos = [tem_caminho(x) for x in proibidos()]
    return {'ficheiros': total, 'versoes_no_historico': historia, 'achados': erros,
            'quantidade': len(erros), 'conhecido_positivo': positivo, 'classes_detetadas': conhecidos}

def capturas(nome):
    x = ler(f'capturas-{nome}.json')
    erros_sha = []
    for r in x['resultados'] + x['recortes']:
        if sha(AQUI / 'capturas' / r['ficheiro']) != r['sha256']: erros_sha.append(r['ficheiro'])
    indice = ler(f'paginas-{nome}/INDICE.json')
    for f, r in indice['copias'].items():
        if sha(AQUI / f'paginas-{nome}' / f) != r['sha256']: erros_sha.append(f)
    return {'cabeca': x['dist_construido_de'], 'paginas': len(x['resultados']), 'recortes': len(x['recortes']),
            'larguras': x['larguras'], 'edicoes': sorted(set(r['lingua'] for r in x['resultados'])),
            'copias': len(indice['copias']), 'falhas': x['aceitacao']['falhas'],
            'valores_colados': sum(r['valores_colados_a_unidade'] for r in x['resultados']),
            'transbordos': sum(r['deslocamento'] > 0 for r in x['resultados']),
            'resumos_errados': erros_sha}

def espaco_visual():
    if not (AQUI / 'capturas-depois.json').exists(): return None
    chave = lambda r: (r['id'], r['lingua'], r['largura'])
    antes = {chave(r): r for r in ler('capturas-antes.json')['recortes']}
    comparacoes = []
    for r in ler('capturas-depois.json')['recortes']:
        a = antes[chave(r)]['medida']['separacao']['distancia_px']
        d = r['medida']['separacao']['distancia_px']
        comparacoes.append({'id': r['id'], 'lingua': r['lingua'], 'largura': r['largura'], 'antes_px': a, 'depois_px': d, 'diferenca_px': d-a})
    return {'comparacoes': comparacoes, 'quantidade':len(comparacoes), 'maior_diferenca_px':max(abs(r['diferenca_px']) for r in comparacoes)}

def linhas():
    # Cada valor e endereço selado, incluindo as linhas que esta peça não editou.
    import yaml
    mudadas = []
    ids = git('ls-tree', '-r', '--name-only', BASE, '--', 'ledger/claims').splitlines()
    for f in ids:
        antigo = yaml.safe_load(git('show', f'{BASE}:{f}'))
        atual = yaml.safe_load((RAIZ / f).read_text())
        for k in ('value', 'source_url'):
            if antigo.get(k) != atual.get(k): mudadas.append({'ficheiro': f, 'campo': k})
    novas = set(git('ls-files', 'ledger/claims').splitlines()) - set(ids)
    return {'conferidas': len(ids), 'valores_ou_fontes_alterados': mudadas, 'novas': sorted(novas)}

def commits(repo, base):
    return [{'hash': l.split(' ', 1)[0], 'assunto': l.split(' ', 1)[1]} for l in git('log', '--reverse', '--format=%H %s', f'{base}..HEAD', cwd=repo).splitlines()]

def main():
    portoes = {}
    for nome in ['build', 'verify', 'typecheck']:
        p = AQUI / 'portoes' / nome
        if Path(str(p) + '.codigo').exists():
            portoes[nome] = {k: Path(str(p) + '.' + k).read_text().strip() for k in ['codigo', 'cabeca', 'inicio', 'fim']}
            portoes[nome]['codigo'] = int(portoes[nome]['codigo'])
            portoes[nome]['segundos'] = (dt.datetime.fromisoformat(portoes[nome]['fim']) - dt.datetime.fromisoformat(portoes[nome]['inicio'])).total_seconds()
    provas = {}
    for nome in ['acertos-provados', 'plantas-confianca', 'dados-concelhos', 'calendario', 'circuito-divida', 'custo-c1']:
        if (AQUI / (nome + '.json')).exists(): provas[nome] = ler(nome + '.json')
    m = {'gerado_em': dt.datetime.now(dt.timezone.utc).isoformat(), 'base_sitio': BASE,
         'cabeca_sitio': git('rev-parse', 'HEAD'), 'base_motor': MOTOR_BASE,
         'cabeca_motor': git('rev-parse', 'HEAD', cwd=MOTOR),
         'commits': {'sitio': commits(RAIZ, BASE), 'motor': commits(MOTOR, MOTOR_BASE)},
         'portoes': portoes, 'espaco_visual': espaco_visual(), 'linhas': linhas(), 'provas': provas,
         'caminhos': medir_caminhos(),
         'capturas': {n: capturas(n) for n in ['antes', 'depois'] if (AQUI / f'capturas-{n}.json').exists()},
         'pib': ler('pib/conferencia.json'),
         'protegidos_motor_alterados': [f for f in git('diff', '--name-only', MOTOR_BASE, cwd=MOTOR).splitlines() if (f.startswith('indicators/') and f.endswith('.json')) or f.startswith(('.maintenance-locks/', 'sweeps/')) or f == 'publisher/recortes/manifest.regioes.json']}
    erros = []
    if m['linhas']['valores_ou_fontes_alterados'] or m['linhas']['novas']: erros.append('Valores ou fontes mudaram fora do mandato executado.')
    if m['caminhos']['quantidade'] or not m['caminhos']['conhecido_positivo'] or not all(m['caminhos']['classes_detetadas']): erros.append('Caminhos locais ou detetor calado.')
    if m['protegidos_motor_alterados']: erros.append('Ficheiros protegidos do motor mudaram.')
    for n,r in m['capturas'].items():
        if r['resumos_errados'] or r['falhas']: erros.append(f'Capturas {n} com falhas.')
    for n,r in portoes.items():
        if r['codigo']: erros.append(f'Portão {n} não passou.')
    if '--final' in os.sys.argv or '--verifica' in os.sys.argv:
        for nome in ['acertos-provados', 'plantas-confianca', 'dados-concelhos', 'calendario', 'circuito-divida', 'custo-c1']:
            if nome not in provas: erros.append(f'Falta a prova {nome}.')
        conf = provas.get('plantas-confianca', {})
        if not conf.get('controlos') or not conf.get('plantas') or not all(p['passou'] for p in conf.get('controlos', []) + conf.get('plantas', [])): erros.append('Controlos ou plantas de confiança em falta ou recusados.')
        csv = provas.get('dados-concelhos', {})
        if csv.get('erros') or csv.get('linhas') != 2464 or len(csv.get('plantas', [])) != 4 or not all(p['passou'] and p['codigo'] == 1 and p['codigo_reposicao'] == 0 and p['antes'] == p['reposto'] for p in csv.get('plantas', [])): erros.append('O CSV ou as suas plantas não ficaram provados.')
        cal = provas.get('calendario', {}).get('paginas', [])
        if len(cal) != 2 or any(p['erros'] or len(p['pontos']) != 4 or len(p['plantas']) != 4 or not all(x['passou'] for x in p['plantas']) for p in cal): erros.append('O calendário ou as suas plantas não ficaram provados.')
        acertos = provas.get('acertos-provados', {})
        if acertos.get('diferencas_fora_dos_acertos') != 0 or acertos.get('k17', {}).get('erros'): erros.append('A quarta redação ou a K17 não ficaram provadas.')
        if m['pib']['iguais'] != 3 or m['pib']['divergentes'] or m['pib']['ambiguidades']: erros.append('A releitura do PIB não ficou resolvida.')
        for fase in ['antes','depois']:
            if fase not in m['capturas']: continue
            cru = ler(f'capturas-{fase}.json')
            matriz = {(r['familia'], r['lingua'], r['largura']) for r in cru['resultados']}
            esperado = {(f,l,w) for f in ['pais','temas','lugares','evora','recibo-inflacao','recibo-divida-familias-ue','recibo-pib-real'] for l in ['pt','en'] for w in [390,768,1024,1280,1600]}
            recortes = {(r['nome'],r['lingua'],r['largura']) for r in cru['recortes']}
            esperados = {(f,l,w) for f in ['inflacao','ihpc','rendas','pensao','alimentos','divida-familias'] for l in ['pt','en'] for w in [390,768,1024,1280,1600]}
            if matriz != esperado or len(cru['resultados']) != len(esperado) or recortes != esperados or len(cru['recortes']) != len(esperados): erros.append(f'A matriz de capturas {fase} está incompleta ou repetida.')
        if (m.get('espaco_visual') or {}).get('maior_diferenca_px') != 0: erros.append('A distância visual entre valor e unidade mudou.')
        if len(portoes) != 3 or len(m['capturas']) != 2: erros.append('Faltam portões ou capturas finais.')
        cabecas = set(r['cabeca'] for r in portoes.values()) | {m['capturas'].get('depois', {}).get('cabeca')}
        if len(cabecas) != 1: erros.append('Portões e capturas mediram cabeças diferentes.')
        if cabecas and m['cabeca_sitio'] not in cabecas:
            if git('rev-parse', 'HEAD^') not in cabecas: erros.append('A entrega não é filha da cabeça medida.')
            if any(not f.startswith(str(AQUI.relative_to(RAIZ)) + '/') for f in git('diff', '--name-only', 'HEAD^', 'HEAD').splitlines()): erros.append('O commit de entrega mudou código.')
    m['validacao'] = {'erros': erros, 'ponto_3': 'parado por divergência entre o brief e o circuito real'}
    if '--verifica' not in os.sys.argv:
        (AQUI / 'medidas.json').write_text(json.dumps(m, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'erros': erros, 'caminhos': m['caminhos'], 'linhas': m['linhas'], 'portoes': portoes}, ensure_ascii=False, indent=2))
    return int(bool(erros))

if __name__ == '__main__':
    raise SystemExit(main())
