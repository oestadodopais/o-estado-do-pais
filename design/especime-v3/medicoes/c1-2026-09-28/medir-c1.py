#!/usr/bin/env python3
"""Mede a entrega C1 a partir dos ficheiros e do Git, sem inventar resultados."""
import datetime as dt
import hashlib
import html
import json
import os
import re
from pathlib import Path
import subprocess
import tempfile
import unicodedata
from functools import lru_cache

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]
BASE = '48a5a1c181c1753036d301204884c57119bba8a5'
MOTOR_BASE = '4eb2867936dd14ad2654751722e390804e68dda3'
MOTOR = Path.home() / '<projetos>/ResearchHub/.worktrees/c1-2026-09-28'

def git(*args, cwd=RAIZ):
    return subprocess.check_output(['git', *args], cwd=cwd).decode().strip()

def ler(nome):
    return json.loads((AQUI / nome).read_text())

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

# «runner» é a conta genérica de execução do GitHub, não uma identidade pessoal.
CONTAS_GENERICAS = frozenset({'runner'})
# A raiz e os diretórios comuns de contas não identificam uma pessoa.
PASTAS_GENERICAS = frozenset(Path('/') / n for n in ('', 'Users', 'home'))

# RH1: identidades públicas, mesmo depois de reescritos os autores do Git.
IDENTIDADES_DO_PROJETO = frozenset({
    'O Estado do País', 'Corredor diário', 'o financiador',
    'correcoes@oestadodopais.pt', 'corredor@oestadodopais.pt', 'oestadodopais',
})


def carregar_proibidos_locais():
    """Só os pontos de entrada locais leem o ficheiro; importar não o lê."""
    if 'PRIVACIDADE_PROIBIDOS' not in os.environ and not em_ci():
        ficheiro = Path.home() / '.config/oestadodopais/proibidos.txt'
        if ficheiro.is_file():
            os.environ['PRIVACIDADE_PROIBIDOS'] = ficheiro.read_text(encoding='utf-8')


def em_ci():
    return 'GITHUB_ACTIONS' in os.environ or 'CI' in os.environ


@lru_cache(maxsize=16)
def _ler_proibidos(valor, ci):
    cadeias = []
    identidades = {n.casefold() for n in IDENTIDADES_DO_PROJETO}
    # Só LF separa entradas. Retiram-se os extremos, incluindo CR de CRLF,
    # mas um separador interior tem de ser recusado antes de colapsar espaços.
    for linha, texto in enumerate((valor or '').split('\n'), 1):
        texto = re.sub(r'^[\s\ufeff]+|[\s\ufeff]+$', '', texto)
        if any(unicodedata.category(c) in {'Cc', 'Cf', 'Zl', 'Zp'} and c != '\t' for c in texto):
            raise ValueError(f'PRIVACIDADE_PROIBIDOS: linha {linha} inválida (separador ou controlo interior).')
        texto = re.sub(r' +', ' ', ''.join(' ' if c == '\t' or unicodedata.category(c) == 'Zs' else c for c in texto))
        texto = unicodedata.normalize('NFC', texto)
        if not texto:
            continue
        if (len(texto) < 4 or texto.casefold() in identidades or
                any(unicodedata.category(c) in {'Cc', 'Cf', 'Zl', 'Zp'} for c in texto)):
            raise ValueError(f'PRIVACIDADE_PROIBIDOS: linha {linha} inválida (formato, curta ou identidade do projeto).')
        try:
            cadeias.append(texto.encode('utf-8'))
        except UnicodeEncodeError:
            raise ValueError(f'PRIVACIDADE_PROIBIDOS: linha {linha} inválida (UTF-8).') from None
    if ci and not cadeias:
        raise ValueError('O segredo PRIVACIDADE_PROIBIDOS tem de existir no repositório (§1.192) e não pode estar vazio.')
    return tuple(cadeias)


def ler_proibidos():
    return _ler_proibidos(os.environ.get('PRIVACIDADE_PROIBIDOS'), em_ci())


def nome_da_casa():
    nome = Path.home().name
    excluidos = CONTAS_GENERICAS | {n.casefold() for n in IDENTIDADES_DO_PROJETO}
    return nome.encode() if len(nome) >= 6 and nome.casefold() not in excluidos else b''


def cadeias_pessoais():
    return tuple(dict.fromkeys(formas_dos_nomes(ler_proibidos() + nomes_dos_autores()) +
                              ((nome_da_casa(),) if nome_da_casa() else ())))


def formas_dos_nomes(cadeias):
    """RH1-b: conserva a forma inteira e a abreviada da guarda da §1.138."""
    formas = list(cadeias)
    for cadeia in cadeias:
        partes = cadeia.decode('utf-8').split()
        if len(partes) > 2:
            curta = partes[0] + ' ' + partes[-1]
            if len(curta) >= 4 and curta.casefold() not in {n.casefold() for n in IDENTIDADES_DO_PROJETO}:
                formas.append(curta.encode('utf-8'))
    return tuple(dict.fromkeys(formas))


@lru_cache(maxsize=1)
def equivalencias_unicode():
    """Índices inversos de HTML5 e casefold, calculados apenas para as cadeias."""
    entidades, dobradas = {}, {}
    for nome, valor in html.entities.html5.items():
        entidades.setdefault(valor, set()).add(nome.rstrip(';'))
    for numero in range(0x110000):
        c = chr(numero)
        if c.casefold() != c.lower():
            chave = unicodedata.normalize('NFC', c.casefold())
            dobradas.setdefault(chave, set()).add(c)
    return entidades, dobradas


@lru_cache(maxsize=64)
def formas_comparaveis(cadeias):
    """Compila as formas uma vez; nenhum corpo de ficheiro é descodificado."""
    entidades, dobradas = equivalencias_unicode()

    def alternativa(partes):
        partes = sorted(set(partes), key=lambda p: (-len(p), p))
        return partes[0] if len(partes) == 1 else b'(?:' + b'|'.join(partes) + b')'

    @lru_cache(maxsize=None)
    def basicas(caracter, codificacao):
        def literal(texto):
            return re.escape(texto.encode(codificacao).lower())

        formas = []
        try:
            formas.append(literal(caracter))
        except UnicodeEncodeError:
            pass
        for nome in entidades.get(caracter, ()):
            formas.append(literal('&' + nome) + b'(?:' + literal(';') + b')?')
        numero = ord(caracter)
        for prefixo, digitos in [('&#', str(numero)), ('&#x', format(numero, 'x'))]:
            formas.append(literal(prefixo) + b'(?:' + literal('0') + b')*' + literal(digitos) + b'(?:' + literal(';') + b')?')
        if numero <= 0xffff:
            formas.append(literal('\\u' + format(numero, '04x')))
        else:
            par = caracter.encode('utf-16-be')
            formas.append(literal(''.join('\\u' + format(int.from_bytes(par[i:i+2], 'big'), '04x') for i in (0, 2))))
        return tuple(formas)

    @lru_cache(maxsize=None)
    def representacoes(caracter, codificacao):
        valores = set(espacos_unicode()) if caracter == ' ' else {caracter} | dobradas.get(caracter, set())
        valores = {forma for c in valores for forma in (c, c.lower(), c.upper(), c.casefold())}
        valores |= {unicodedata.normalize(n, v) for v in valores for n in ('NFC', 'NFD')}
        formas = []
        for valor in valores:
            # Cada carácter pode escolher NFC, NFD, entidade ou escape sem
            # impor a mesma escolha aos outros caracteres do nome.
            resto = b''.join(alternativa(basicas(c, codificacao)) for c in valor[1:])
            formas.extend(primeira + resto for primeira in basicas(valor[0], codificacao))
        return tuple(formas)

    @lru_cache(maxsize=None)
    def atomo(caracter, codificacao):
        padrao = alternativa(representacoes(caracter, codificacao))
        return b'(?:' + padrao + b')+' if caracter == ' ' else padrao

    def opcoes(texto, i):
        yield texto[i], i + 1
        # As expansões de casefold incluem ss e as ligaturas fi, fl, ff,
        # ffi, ffl e st. O índice inverso conserva também a direção contrária.
        for tamanho in (2, 3):
            trecho = texto[i:i + tamanho]
            if len(trecho) == tamanho:
                for c in sorted(dobradas.get(trecho, ())):
                    yield c, i + tamanho

    def inserir(ramo, texto, i, codificacao):
        if i == len(texto):
            ramo[None] = {}
        else:
            for c, seguinte in opcoes(texto, i):
                inserir(ramo.setdefault(atomo(c, codificacao), {}), texto, seguinte, codificacao)

    arvore = {}
    for cadeia in cadeias:
        texto = unicodedata.normalize('NFC', ' '.join(cadeia.decode('utf-8').split()).casefold())
        if not texto:
            continue
        for codificacao in ('utf-8', 'utf-16-le', 'utf-16-be', 'latin-1'):
            for c, seguinte in opcoes(texto, 0):
                for primeira in representacoes(c, codificacao):
                    # O primeiro byte literal permite saltar os bytes que não
                    # iniciam nomes, mesmo nas representações de vários bytes.
                    tamanho = 2 if primeira.startswith(b'\\') else 1
                    ramo = arvore.setdefault(primeira[:tamanho], {})
                    if primeira[tamanho:]:
                        ramo = ramo.setdefault(primeira[tamanho:], {})
                    inserir(ramo, texto, seguinte, codificacao)

    def compilar(ramo):
        caminhos = [(atomo,) + compilar(filhos) for atomo, filhos in ramo.items() if atomo is not None]
        if None in ramo:
            caminhos.append(())
        if len(caminhos) == 1:
            return caminhos[0]
        # Duas grafias que convergem na mesma posição partilham o sufixo.
        # Sem esta fatorização, cada ss ou ligatura repetiria o resto do nome
        # e multiplicaria o trabalho do compilador da expressão regular.
        comuns = 0
        for i in range(1, min(map(len, caminhos)) + 1):
            if any(c[-i] != caminhos[0][-i] for c in caminhos[1:]):
                break
            comuns = i
        sufixo = caminhos[0][-comuns:] if comuns else ()
        prefixos = [b''.join(c[:-comuns] if comuns else c) for c in caminhos]
        return (alternativa(prefixos),) + sufixo

    return re.compile(b''.join(compilar(arvore)) if arvore else rb'(?!)')



@lru_cache(maxsize=1)
def espacos_unicode():
    return tuple(chr(n) for n in range(0x110000) if chr(n).isspace())


def contem_cadeias(corpo, cadeias):
    if not cadeias:
        return False
    # Uma pesquisa com todas as alternativas, sobre uma única cópia em bytes
    # minúsculos. As maiúsculas não ASCII estão nas alternativas compiladas.
    return formas_comparaveis(tuple(cadeias)).search(corpo.lower()) is not None


def positivos_de_nome():
    nomes = nomes_dos_autores()
    if nomes:
        return nomes
    segredo = ler_proibidos()
    return segredo[:1] or ((nome_da_casa(),) if nome_da_casa() else ())

def proibidos(pasta=None):
    pasta = Path.home() if pasta is None else Path(pasta)
    caminhos = []
    if pasta != Path(pasta.anchor):
        caminhos.append((str(pasta).rstrip('/') + '/').encode())
    if pasta.parent not in PASTAS_GENERICAS:
        caminhos.append((str(pasta.parent).rstrip('/') + '/').encode())
    nome = pasta.name.lower()
    if len(nome) >= 6 and nome not in CONTAS_GENERICAS and nome.casefold() not in {n.casefold() for n in IDENTIDADES_DO_PROJETO}:
        caminhos.append(nome.encode())
    return caminhos + [
        (('/private' + '/' + 'var/folders') + '/').encode(),
        (('/private' + '/tmp') + '/').encode(), ('/' + 'tmp/').encode()]

# Caminhos absolutos do sistema, também fora da pasta pessoal e do repositório.
ABSOLUTO = re.compile(rb'(?<![A-Za-z0-9:/])/(?:opt|usr|Library|Applications|System|Volumes|var|private|etc|bin|sbin|home|root|Users|tmp)/[^\s"<>`\x1b]+')

def _nomes_dos_autores():
    base_existe = subprocess.run(['git', 'cat-file', '-e', BASE], cwd=RAIZ,
                                capture_output=True).returncode == 0
    nomes = git('log', '--format=%an', f'{BASE}..HEAD' if base_existe else 'HEAD').splitlines()
    # Os nomes retirados do inventário vêm do Git, nunca de uma lista pessoal.
    inventario = git('show', f'{BASE}:design/especime-v3/INVENTARIO-FRASES.md') if base_existe else ''
    nomes.extend(re.findall(r'(?:responsável editorial:|editorial responsibility:|Diretor:|Director:) ([^|·\n]+)', inventario))
    return tuple(sorted({n.strip().encode() for n in nomes if n.strip() and
                         n.strip().casefold() not in {x.casefold() for x in IDENTIDADES_DO_PROJETO} and
                         not any(x in n.lower() for x in ('codex', 'claude', 'bot', 'openai'))}))


nomes_dos_autores = lru_cache(maxsize=1)(_nomes_dos_autores)


def tem_caminho(b):
    pessoais = contem_cadeias(b, cadeias_pessoais())
    # Estes dois nomes de intérpretes são portáveis, não caminhos desta máquina.
    b = b.replace(('/' + 'usr/bin/env').encode(), b'<interprete portavel>').replace(('/' + 'bin/sh').encode(), b'<interprete portavel>')
    # São ligações relativas da navegação do BCE nos corpos alojados. A
    # exceção só abrange estes atributos e diretórios, não caminhos em prosa,
    # logs ou código, nem nomes pessoais dentro do atributo.
    sem_navegacao = re.sub(rb"(?:href|src)=([\"'])/" + rb"home/(?:html|shared|sitedir|data-protection|search)/[^\"']+\1", b'<ligacao relativa da origem>', b)
    anfitriao = re.search(rb'\b[a-z0-9_-]*(?:macbook|imac|mac-mini|macmini)[a-z0-9_.-]*\.local\b', b, re.I)
    return (bool(anfitriao or ABSOLUTO.search(sem_navegacao))
            or any(x.lower() in (sem_navegacao if x.startswith(b'/') else b).lower() for x in proibidos())
            or pessoais)

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
    carregar_proibidos_locais()
    ler_proibidos()
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
