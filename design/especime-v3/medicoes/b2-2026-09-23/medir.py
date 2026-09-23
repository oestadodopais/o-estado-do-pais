#!/usr/bin/env python3
"""Medidas B2, peça 1, sobre as cópias próprias e as saídas guardadas.

    python3 design/especime-v3/medicoes/b2-2026-09-23/medir.py [--parcial]

Escreve medidas.json. As cópias do captor têm sha256 e commit de origem;
nenhuma medição lê as congeladas do brief. Os predicados de cartões, régua,
e clamp são os de BRIEF-B2.py. A marca entre valor e unidade lê também o invólucro novo. A leitura do HTML,
dos valores do livro e da contagem das câmaras não importa código das páginas.
Sem --parcial, a falta de capturas, portões ou plantas impede uma corrida verde.
Uma saída por correr é null, nunca um zero suposto. OEDP_MEDIDAS_JSON permite
às plantas escrever fora do ficheiro final do bloco. OEDP_PAGINAS_B2 lê
as cópias de uma pasta temporária para plantar danos sem tocar nas originais.
"""
import hashlib
import html
import json
import os
import re
import subprocess
import sys
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]
PARCIAL = '--parcial' in sys.argv
FALHAS, FALTAS = [], []
COMANDO = 'python3 design/especime-v3/medicoes/b2-2026-09-23/medir.py'
LARGURAS = [390, 768, 1024, 1280, 1600]
PAGINAS = [('pais', 'pt'), ('pais', 'en'), ('temas', 'pt'), ('temas', 'en'), ('europeia', 'pt'), ('europeia', 'en'), ('mourao', 'pt'), ('mourao', 'en')]


def sha(b):
    return hashlib.sha256(b).hexdigest()


def git(*args):
    return subprocess.run(['git', *args], cwd=RAIZ, capture_output=True, check=True).stdout


def ler_json(p):
    return json.loads(p.read_text(encoding='utf-8'))


def falta(msg):
    FALTAS.append(msg)
    if not PARCIAL:
        FALHAS.append(msg)


class No:
    def __init__(self, tag='', attrs=(), pai=None):
        self.tag, self.attrs, self.pai, self.filhos = tag, dict(attrs), pai, []

    def bruto(self):
        return ''.join(f.bruto() if isinstance(f, No) else f for f in self.filhos)

    def texto(self):
        return re.sub(r'\s+', ' ', self.bruto()).strip()

    def tem(self, classe):
        return classe in (self.attrs.get('class') or '').split()

    def todos(self, pred):
        return [n for f in self.filhos if isinstance(f, No) for n in ([f] if pred(f) else []) + f.todos(pred)]

    def primeiro(self, pred):
        return next(iter(self.todos(pred)), None)


class Leitor(HTMLParser):
    VAZIOS = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}

    def __init__(self, s):
        super().__init__(convert_charrefs=True)
        self.raiz = No()
        self.pilha = [self.raiz]
        self.feed(s)

    def handle_starttag(self, tag, attrs):
        no = No(tag, attrs, self.pilha[-1])
        self.pilha[-1].filhos.append(no)
        if tag not in self.VAZIOS:
            self.pilha.append(no)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.VAZIOS:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for i in range(len(self.pilha) - 1, 0, -1):
            if self.pilha[i].tag == tag:
                del self.pilha[i:]
                break

    def handle_data(self, data):
        self.pilha[-1].filhos.append(data)


def numero(s):
    if s is None:
        return None
    s = re.sub(r'[ \u202f\u00a0]', '', s)
    return float(s.replace(',', '.')) if re.fullmatch(r'-?\d+(,\d+)?', s) else None


def casas(s):
    m = re.fullmatch(r'-?[\d\u202f\u00a0 ]+(?:,(\d+))?', s.strip())
    return (len(m.group(1)) if m.group(1) else 0) if m else None


# O padrão do artigo conserva o guião do §0; a marca antiga fica como testemunha.
RE_ARTIGO = re.compile(r'<article class="cartao-medida"[^>]*>.*?</article>', re.S)
RE_MARCA_NO_MEIO = re.compile(r'cartao-medida-num">[^<]*</span><a class="src-chip".*?</a></span><span class="campo-valor cartao-medida-unidade', re.S)


def marca_no_meio(artigo):
    nos = Leitor(artigo).raiz.todos(lambda n: True)
    valores = [i for i, n in enumerate(nos) if n.tem('cartao-medida-num')]
    unidades = [i for i, n in enumerate(nos) if n.tem('cartao-medida-unidade')]
    marcas = [i for i, n in enumerate(nos) if n.tem('src-chip')]
    return any(v < m < u for v in valores for u in unidades for m in marcas)


def id_cartao(artigo):
    m = re.search(r'data-cartao-medida="([^"]+)"', artigo)
    return m.group(1) if m else 'camaras' if 'data-cartao-camaras' in artigo else '[sem identificador]'


def conta_pagina(s):
    raiz = Leitor(s).raiz
    artigos = RE_ARTIGO.findall(s)
    cartoes = raiz.todos(lambda n: n.tag == 'article' and n.tem('cartao-medida'))
    if len(artigos) != len(cartoes):
        FALHAS.append('O predicado de artigos do brief difere da leitura HTML')
    sem = [id_cartao(a) for a in artigos if 'class="cartao-medida-regua"' not in a]
    definicoes = raiz.todos(lambda n: 'data-cartao-definicao' in n.attrs)
    refs = raiz.todos(lambda n: n.attrs.get('data-regua') == 'referencia')
    cores_sem = []
    formas = {}
    for n in refs:
        estado, frase = n.attrs.get('data-estado'), n.texto()
        formas[frase] = formas.get(frase, 0) + 1
        palavra = r'\bfora d[oa]s? valor(?:es)? de referência|\boutside (?:the )?reference values?' if estado == 'fora' else r'\bdentro d[oa]s? valor(?:es)? de referência|\bwithin (?:the )?reference values?'
        if estado in ('fora', 'dentro') and not re.search(palavra, frase, re.I):
            cores_sem.append(frase)
    euros = sorted({u.texto() for c in cartoes for u in c.todos(lambda n: n.tem('cartao-medida-unidade')) if re.search('euro', u.texto(), re.I)})
    euro_casas = {casas(v.texto()) for c in cartoes if any(re.search('euro', u.texto(), re.I) for u in c.todos(lambda n: n.tem('cartao-medida-unidade'))) for v in c.todos(lambda n: n.tem('cartao-medida-num'))}
    euro_casas.discard(None)
    mista = []
    for a in artigos:
        ds = [d for d in (casas(v) for v in re.findall(r'class="claim-value[^"]*"[^>]*>([^<]*)<', a)) if d is not None]
        if len(set(ds)) > 1:
            mista.append(id_cartao(a))
    veredictos = raiz.todos(lambda n: 'data-veredicto-pais' in n.attrs or 'data-pais-veredicto' in n.attrs or n.tem('pais-veredicto'))
    provas = {}
    for p in raiz.todos(lambda n: 'data-prova' in n.attrs):
        provas.setdefault(p.attrs['data-prova'], []).append(p.texto())
    habitacao = raiz.primeiro(lambda n: n.tag == 'section' and n.tem('pais-tema') and ('habitacao' in str(n.attrs.values()) or 'housing' in str(n.attrs.values())))
    if not habitacao:
        habitacao = raiz.primeiro(lambda n: n.tag == 'section' and n.tem('pais-tema') and any('sobrecarga' in c.attrs.get('data-cartao-medida', '') for c in n.todos(lambda c: c.tag == 'article')))
    faixa = raiz.todos(lambda n: n.tag == 'li' and n.tem('cartao') and 'data-estado' in n.attrs)
    faixa_sem_palavra = []
    for n in faixa:
        estado = n.attrs.get('data-estado')
        if estado not in ('fora', 'dentro'):
            continue
        palavra = n.primeiro(lambda x: x.tem('cartao-palavra'))
        frase = palavra.texto() if palavra else ''
        padrao = r'\bfora d[oa]s? valor(?:es)? de referência|\boutside (?:the )?reference values?' if estado == 'fora' else r'\bdentro d[oa]s? valor(?:es)? de referência|\bwithin (?:the )?reference values?'
        if not re.search(padrao, frase, re.I):
            faixa_sem_palavra.append({'id': n.attrs.get('data-cartao'), 'estado': estado, 'texto': frase})
    # O cartão das câmaras depois da segunda passagem de correção: o período lido
    # das linhas (achado 13), o elemento do nome (achado 17), as portas (achado 15)
    # e as dicas das contagens (achado 14).
    camaras_cartao = raiz.primeiro(lambda n: 'data-cartao-camaras' in n.attrs)
    camaras_periodo = camaras_cartao.primeiro(lambda n: n.tem('cartao-medida-periodo')) if camaras_cartao else None
    camaras_nome = camaras_cartao.primeiro(lambda n: n.tem('cartao-medida-nome')) if camaras_cartao else None
    camaras_ligacoes = camaras_cartao.todos(lambda n: n.tag == 'a' and 'href' in n.attrs) if camaras_cartao else []
    return {
        'camaras_periodo': camaras_periodo.texto() if camaras_periodo else None,
        'camaras_nome_elemento': camaras_nome.tag if camaras_nome else None,
        'camaras_ligacoes': [a.attrs['href'] for a in camaras_ligacoes],
        'camaras_portas_para_os_lugares': sum(a.attrs['href'].rstrip('/').endswith(('/lugares', '/places')) for a in camaras_ligacoes),
        'camaras_dicas': {n.attrs['data-prova']: n.attrs.get('title') for n in (camaras_cartao.todos(lambda n: 'data-prova' in n.attrs) if camaras_cartao else [])},
        'cartoes': len(artigos), 'temas_com_medidas': s.count('<section class="pais-tema"'),
        'cartoes_com_valor_de_referencia': len(re.findall(r'data-regua="referencia"', s)),
        'cartoes_com_cor_de_estado': len(re.findall(r'data-regua="referencia" data-estado="(?:fora|dentro)"', s)),
        'cartoes_com_media_da_uniao': s.count('data-regua="ue"'),
        'cartoes_com_periodo_anterior': s.count('data-regua="anterior"'),
        'cartoes_sem_regua': len(sem), 'cartoes_sem_regua_lista': sem,
        'cartoes_com_definicao': s.count('data-cartao-definicao='),
        'definicoes_com_pergunta': sum(n.texto().endswith('?') for n in definicoes),
        'definicoes': {n.attrs['data-cartao-definicao']: n.texto() for n in definicoes},
        'cartoes_com_a_marca_entre_o_valor_e_a_unidade': sum(marca_no_meio(a) for a in artigos),
        'cartoes_com_precisao_mista': len(mista), 'cartoes_com_precisao_mista_lista': mista,
        'cartoes_com_simbolo_euro': sum('€' in c.texto() for c in cartoes),
        'formas_do_euro_nos_temas': len(euros), 'unidades_com_euro': euros,
        'precisoes_do_euro_nos_temas': len(euro_casas), 'casas_decimais_do_euro': sorted(euro_casas),
        'cartao_das_camaras': len(raiz.todos(lambda n: 'data-cartao-camaras' in n.attrs)),
        'cartao_do_limite_legal': s.count('data-cartao-medida="indice-de-divida-limite-legal"'),
        'cores_sem_palavra': len(cores_sem), 'cores_sem_palavra_lista': cores_sem,
        'formas_do_veredicto': formas,
        'veredicto_do_pais': [n.texto() for n in veredictos],
        'ligacoes_do_veredicto': [a.attrs.get('href') for n in veredictos for a in n.todos(lambda a: a.tag == 'a' and 'href' in a.attrs)],
        'provas': provas,
        'habitacao_ordem': [n.attrs['data-cartao-medida'] for n in habitacao.todos(lambda n: 'data-cartao-medida' in n.attrs)] if habitacao else [],
        'faixa': {e: sum(n.attrs.get('data-estado') == e for n in faixa) for e in ('fora', 'dentro', 'sem')},
        'faixa_cores_sem_palavra': len(faixa_sem_palavra),
        'faixa_cores_sem_palavra_lista': faixa_sem_palavra,
    }


def clamp(css, seletor):
    m = re.search(re.escape(seletor) + r'\s*\{[^}]*?font-size:\s*clamp\(\s*([\d.]+)px,\s*([\d.]+)vw,\s*([\d.]+)px\)', css, re.S)
    return tuple(float(x) for x in m.groups()) if m else None


def em_largura(c, w):
    if c is None:
        return None
    lo, vw, hi = c
    return max(lo, min(hi, vw * w / 100))


def fase(estado):
    pasta = Path(os.environ.get('OEDP_PAGINAS_B2', AQUI)) / f'paginas-{estado}-peca1'
    if not (pasta / 'INDICE.json').exists():
        falta(f'faltam as cópias próprias do {estado}')
        return None
    indice = ler_json(pasta / 'INDICE.json')
    medidas = {'cabeca': indice['dist_construido_de'], 'paginas': {}, 'copias': len(indice['copias']), 'aceitacao': indice.get('aceitacao')} 
    for nome, item in indice['copias'].items():
        b = (pasta / nome).read_bytes()
        if sha(b) != item['sha256']:
            FALHAS.append(f'{pasta.name}/{nome}: sha256 diferente')
        if nome == 'site.css':
            css = b.decode('utf-8')
            medidas['folha'] = {chave: {str(w): em_largura(clamp(css, sel), w) for w in LARGURAS} for chave, sel in [('wordmark', '.wordmark'), ('h1', '\nh1'), ('wordmark_interior', 'p.wordmark'), ('wordmark_compacto', '.masthead-compact .wordmark')]}
        elif nome.endswith('.html'):
            medidas['paginas'][f"{item['familia']}_{item['lingua']}"] = conta_pagina(b.decode('utf-8'))
    esperadas = {f'{f}_{l}' for f, l in PAGINAS}
    if set(medidas['paginas']) != esperadas:
        FALHAS.append(f'{estado}: conjunto de páginas diferente do mandato')
    return medidas


def capturas(estado, cabeca):
    p = AQUI / f'capturas-{estado}-peca1.json'
    if not p.exists():
        falta(f'falta {p.name}')
        return None
    d = ler_json(p)
    if cabeca and d['dist_construido_de'] != cabeca:
        FALHAS.append(f'{p.name}: cabeça diferente das cópias')
    rs = d['resultados']
    if estado == 'depois' and 'aceitacao' not in d:
        FALHAS.append('o manifesto das capturas depois não declara as falhas de aceitação')
    aceitacao = d.get('aceitacao', {'passou': True, 'falhas': [], 'origem': 'captor antigo do antes, que só escrevia manifesto após as asserções'})
    for f in aceitacao['falhas']:
        FALHAS.append(f'aceitação das capturas {estado}: {f}')
    if aceitacao.get('passou') is False and not aceitacao['falhas']:
        FALHAS.append(f'capturas {estado}: estado vermelho sem explicar a falha')
    vistos = [(r['familia'], r['lingua'], r['largura']) for r in rs]
    esperado = {(f, l, w) for f, l in PAGINAS for w in LARGURAS}
    if len(vistos) != len(esperado) or set(vistos) != esperado:
        FALHAS.append(f'{p.name}: não cobre cada página/edição/largura uma vez')
    for r in rs:
        imagem = AQUI / 'capturas' / r['ficheiro']
        if not imagem.exists() or sha(imagem.read_bytes()) != r['sha256']:
            FALHAS.append(f"{r['ficheiro']}: captura ausente ou resumo diferente")
    cartoes = [c for r in rs for c in r['cartoes']]
    return {'quantidade': len(rs), 'aceitacao': aceitacao, 'cabeca': d['dist_construido_de'], 'larguras': sorted({r['largura'] for r in rs}),
            'transbordos': sum(r['deslocamento'] > 0 for r in rs),
            'maior_transbordo_px': max((r['deslocamento'] for r in rs), default=None),
            'titulos_interiores_maiores': sum(r['wordmark']['tamanho'] < r['h1']['tamanho'] for r in rs if r['familia'] != 'pais'),
            'paginas_interiores': sum(r['familia'] != 'pais' for r in rs),
            'unidades_separadas_a_390': sum(c['valorEUnidadeMesmaLinha'] is False for r in rs if r['largura'] == 390 for c in r['cartoes']),
            'perguntas_antes_da_regua': sum(c['reguaAntesDaPergunta'] is False for c in cartoes),
            'perguntas_com_regua': sum(c['reguaAntesDaPergunta'] is not None for c in cartoes),
            'reguas_maiores_que_pergunta': sum(c['reguaPx'] > c['perguntaPx'] for c in cartoes if c['reguaPx'] is not None and c['perguntaPx'] is not None),
            'segundos': d['segundos'],
            'tamanhos': [{k: r[k] for k in ('familia', 'lingua', 'largura', 'wordmark', 'h1', 'altura')} for r in rs]}


def linhas(ref):
    # Uma única leitura git por cabeça; os documentos YAML não são importados
    # pelo leitor do projeto que esta conferência tem de vigiar.
    nomes = git('ls-tree', '-r', '--name-only', ref, '--', 'ledger/claims').decode().splitlines()
    saida = {}
    processo = subprocess.Popen(['git', 'cat-file', '--batch'], cwd=RAIZ, stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    for nome in nomes:
        if not nome.endswith('.yml'):
            continue
        processo.stdin.write(f'{ref}:{nome}\n'.encode()); processo.stdin.flush()
        info = processo.stdout.readline().decode().strip().split()
        b = processo.stdout.read(int(info[2])); processo.stdout.read(1)
        texto = b.decode()
        m = re.search(r'^value: (.+)$', texto, re.M)
        bruto = m.group(1) if m else None
        valor = json.loads(bruto) if bruto and bruto.startswith('"') else bruto
        saida[Path(nome).stem] = {'value': valor, 'texto': texto}
    processo.stdin.close(); processo.wait()
    return saida


def camaras(ref, livro):
    concelhos = json.loads(git('show', f'{ref}:src/data/concelhos.gerado.json'))
    teto = numero(livro['indice-de-divida-limite-legal']['value'])
    if teto is None:
        raise ValueError('A linha do limite não contém um número')
    grupos = {'acima': [], 'dentro': [], 'sem_valor': []}
    for c in concelhos:
        valor = livro.get(c['linhas']['indice'], {}).get('value')
        n = numero(valor)
        grupos['sem_valor' if n is None else 'acima' if n > teto else 'dentro'].append({'concelho': c['slug'], 'linha': c['linhas']['indice'], 'valor': valor})
    # Achado 14: a dica diz «calculado» porque cada índice é uma linha calculada,
    # e isso lê-se da linha (uma derivação escrita) e não da dica.
    calculados = sum(bool(re.search(r'^derivation: (?!null$).+', livro.get(c['linhas']['indice'], {}).get('texto', ''), re.M)) for c in concelhos)
    return {'limite_legal': teto, 'concelhos': len(concelhos), 'indices_calculados': calculados, **{f'camaras_{k}_do_limite' if k != 'sem_valor' else 'camaras_sem_valor': len(v) for k, v in grupos.items()}, 'listas': grupos}


def portao(nome, cabeca):
    pasta = AQUI / 'portoes'
    nomes = [f'{nome}.{s}' for s in ('codigo', 'inicio', 'fim', 'cabeca', 'log')]
    if any(not (pasta / n).exists() for n in nomes):
        falta(f'{nome}: falta uma saída em portoes/')
        return None
    lido = lambda ext: (pasta / f'{nome}.{ext}').read_text().strip()
    ini, fim = (datetime.fromisoformat(lido(s).replace('Z', '+00:00')) for s in ('inicio', 'fim'))
    codigo = int(lido('codigo'))
    if fim < ini:
        FALHAS.append(f'{nome}: fim anterior ao início')
    if cabeca and lido('cabeca') != cabeca:
        FALHAS.append(f'{nome}: cabeça diferente da construção medida')
    if codigo != 0:
        FALHAS.append(f'{nome}: código {codigo}')
    return {'codigo': codigo, 'cabeca': lido('cabeca'), 'motor_cabeca': lido('motor-cabeca') if (pasta / f'{nome}.motor-cabeca').exists() else None, 'inicio': ini.isoformat(), 'fim': fim.isoformat(), 'segundos': (fim - ini).total_seconds(), 'sha256_log': sha((pasta / f'{nome}.log').read_bytes())}


def plantas():
    resultado = {}
    for p in sorted(AQUI.glob('plantas*.json')):
        dados = ler_json(p)
        ps = dados if isinstance(dados, list) else dados.get('plantas', [])
        if not isinstance(ps, list):
            continue
        estragos = [x for x in ps if isinstance(x, dict) and x.get('codigo') != 0]
        limpas = [x for x in ps if isinstance(x, dict) and x.get('codigo') == 0]
        repostos = [f for x in estragos for f in (x.get('ficheiros') or [x]) if 'antes' in f and 'reposto' in f]
        bons = sum(x.get('passou', x.get('bom', False)) is True for x in estragos)
        if bons != len(estragos) or any(f['antes'] != f['reposto'] for f in repostos):
            FALHAS.append(f'{p.name}: planta sem mordida ou bytes não repostos')
        resultado[p.name] = {'estragos': len(estragos), 'morderam': bons, 'corridas_limpas': len(limpas), 'ficheiros_repostos': len(repostos), 'sha256': sha(p.read_bytes()), 'nomes': [x.get('nome') for x in estragos]}
    if not resultado or not any(r['estragos'] for r in resultado.values()):
        falta('não há estragos medidos num índice de plantas do bloco')
    return resultado


def medicao_guardada(relativo, obrigatoria=False):
    p = AQUI / relativo
    if not p.exists():
        if obrigatoria:
            falta(f'falta {relativo}')
        return None
    dados = ler_json(p)
    return {**dados, 'ficheiro_de_medicao': relativo, 'sha256_do_ficheiro': sha(p.read_bytes())}


def checks_de_trabalho():
    # Os códigos de diagnóstico não são os três portões finais. Conservam-se
    # os vermelhos tal como foram lidos; sem início e fim não se inventa uma
    # duração a partir da data do ficheiro.
    resultado = {}
    for p in sorted(AQUI.glob('*.codigo')):
        base = p.with_suffix('')
        log = next((p for p in (base.with_suffix('.log'), base.with_suffix('.txt')) if p.exists()), None)
        tempos = {}
        for campo in ('inicio', 'fim'):
            f = base.with_suffix('.' + campo)
            tempos[campo] = f.read_text().strip() if f.exists() else None
        segundos = None
        if all(tempos.values()):
            ini, fim = (datetime.fromisoformat(tempos[k].replace('Z', '+00:00')) for k in ('inicio', 'fim'))
            segundos = (fim - ini).total_seconds()
            if segundos < 0:
                FALHAS.append(f'{base.name}: fim anterior ao início no diagnóstico')
        resultado[base.name] = {
            'codigo': int(p.read_text().strip()), 'ficheiro_codigo': p.name,
            'sha256_codigo': sha(p.read_bytes()),
            'log': log.name if log else None,
            'sha256_log': sha(log.read_bytes()) if log else None,
            **tempos, 'segundos': segundos,
            'estatuto': 'diagnóstico guardado, não substitui o portão final',
        }
    return resultado


def tentativas_dos_portoes():
    # A mesma tentativa pode estar no arquivo e ainda em portoes/. Identifica-se
    # pelo comando, cabeça e início; as duas cópias não somam o tempo duas vezes.
    tentativas = {}
    pastas = sorted(p for p in AQUI.iterdir() if p.is_dir() and (p.name == 'portoes' or p.name.startswith('portoes-')))
    for pasta in pastas:
        for nome in ('build', 'verify', 'typecheck'):
            ficheiros = {ext: pasta / f'{nome}.{ext}' for ext in ('codigo', 'inicio', 'fim', 'cabeca', 'log')}
            existentes = {ext: p.read_bytes() for ext, p in ficheiros.items() if p.exists()}
            if not existentes:
                continue
            texto = lambda ext: existentes[ext].decode().strip() if ext in existentes else None
            completa = set(existentes) == set(ficheiros)
            codigo = int(texto('codigo')) if 'codigo' in existentes else None
            inicio = texto('inicio')
            # correr-portao.py apaga o código no início. Um .fim antigo que
            # ainda esteja ao lado do log em curso não pertence à nova corrida.
            fim = texto('fim') if completa else None
            segundos = None
            if completa:
                ini, term = (datetime.fromisoformat(v.replace('Z', '+00:00')) for v in (inicio, fim))
                segundos = (term - ini).total_seconds()
                if segundos < 0:
                    FALHAS.append(f'{pasta.name}/{nome}: fim anterior ao início')
            identidade = (nome, texto('cabeca'), inicio)
            origem = {'pasta': pasta.name, 'sha256_ficheiros': {ext: sha(b) for ext, b in existentes.items()}}
            item = {
                'portao': nome, 'comando': f'npm run {nome}', 'cabeca': texto('cabeca'),
                'codigo': codigo, 'inicio': inicio, 'fim': fim, 'segundos': segundos,
                'concluida': completa, 'origens': [origem],
                'sha256_log': sha(existentes['log']) if 'log' in existentes else None,
            }
            if not completa and 'fim' in existentes:
                item['fim_lido_sem_codigo_atual'] = texto('fim')
            if identidade in tentativas:
                anterior = tentativas[identidade]
                campos = ('codigo', 'fim', 'segundos', 'concluida', 'sha256_log')
                if any(anterior[c] != item[c] for c in campos):
                    FALHAS.append(f'{nome}: cópias divergentes da tentativa iniciada em {inicio}')
                anterior['origens'].append(origem)
            else:
                tentativas[identidade] = item
    lista = sorted(tentativas.values(), key=lambda x: (x['inicio'] or '', x['portao']))
    completas = [t for t in lista if t['concluida'] and t['segundos'] is not None and t['segundos'] >= 0]
    return {'tentativas': lista, 'concluidas': len(completas), 'incompletas': len(lista) - len(completas),
            'segundos_documentados': sum(t['segundos'] for t in completas) if completas else None,
            'nota': 'Cada tentativa concluída conta uma vez, mesmo quando os mesmos ficheiros estão no arquivo e na pasta atual. Uma tentativa sem código atual não fornece uma duração.'}


def tempo_documentado():
    # Só lê intervalos explícitos. Não usa mtime nem a hora desta medição como
    # se fossem o início ou o fim do trabalho do construtor.
    intervalos = {}
    def acrescenta(inicio, fim, origem):
        if not inicio or not fim:
            return
        ini, term = (datetime.fromisoformat(v.replace('Z', '+00:00')) for v in (inicio, fim))
        if term < ini:
            FALHAS.append(f'{origem}: intervalo documentado invertido')
            return
        chave = (ini.isoformat(), term.isoformat())
        if chave not in intervalos:
            intervalos[chave] = {'inicio': chave[0], 'fim': chave[1], 'segundos': (term - ini).total_seconds(), 'origens': []}
        intervalos[chave]['origens'].append(origem)

    for p in sorted(AQUI.rglob('*.inicio')):
        fim, codigo = p.with_suffix('.fim'), p.with_suffix('.codigo')
        if fim.exists() and codigo.exists():
            acrescenta(p.read_text().strip(), fim.read_text().strip(), p.relative_to(AQUI).as_posix().removesuffix('.inicio'))
    for p in sorted([*AQUI.glob('capturas-*-peca1.json'), *AQUI.glob('qa-*-trabalho*.json')]):
        d = ler_json(p)
        acrescenta(d.get('inicio'), d.get('fim'), p.name)
    lista = sorted(intervalos.values(), key=lambda x: (x['inicio'], x['fim']))
    antes = AQUI / 'capturas-antes-peca1.json'
    inicio = ler_json(antes)['inicio'] if antes.exists() else None
    ultimo = max(lista, key=lambda x: datetime.fromisoformat(x['fim'])) if lista else None
    fim = ultimo['fim'] if ultimo else None
    segundos = None
    if inicio and fim:
        segundos = (datetime.fromisoformat(fim) - datetime.fromisoformat(inicio.replace('Z', '+00:00'))).total_seconds()
    return {
        'inicio': inicio, 'origem_do_inicio': 'capturas-antes-peca1.json:inicio' if inicio else None,
        'fim': fim, 'origens_do_ultimo_fim': ultimo['origens'] if ultimo else [],
        'janela_segundos': segundos,
        'intervalos_documentados': lista, 'intervalos_total': len(lista),
        'soma_intervalos_segundos': sum(i['segundos'] for i in lista) if lista else None,
        'nota': 'A janela vai do início registado das capturas de partida ao último fim documentado. Não é o tempo total desde o pedido. A soma reúne durações registadas, sem duplicar cópias do mesmo intervalo; não se confunde com tempo de parede porque intervalos de atividades distintas podem sobrepor-se.',
    }


if '--prova-palavra' in sys.argv:
    dado = conta_pagina(json.load(sys.stdin)['html'])
    chaves = ('cores_sem_palavra', 'faixa_cores_sem_palavra', 'cartoes_com_a_marca_entre_o_valor_e_a_unidade')
    print(json.dumps({k: dado[k] for k in chaves}, ensure_ascii=False))
    sys.exit(1 if any(dado[k] for k in chaves) else 0)


M = {'comando': COMANDO, 'cabeca_da_corrida': git('rev-parse', 'HEAD').decode().strip(), 'parcial': PARCIAL}
M['conhecidos_positivos'] = {
    'marca_no_meio_novo': marca_no_meio('<span class="cartao-medida-quantidade"><span class="cartao-medida-num"><span data-claim="planta">1</span></span><a class="src-chip">fonte</a><span class="campo-valor cartao-medida-unidade">%</span></span>'),
    'marca_depois_novo': not marca_no_meio('<span class="cartao-medida-quantidade"><span class="cartao-medida-num">1</span><span class="campo-valor cartao-medida-unidade">%</span></span><a class="src-chip">fonte</a>'),
    'marca_no_meio': marca_no_meio('<span class="cartao-medida-num">1</span><a class="src-chip">fonte</a></span><span class="campo-valor cartao-medida-unidade">%</span>'),
    'cartao_sem_regua': conta_pagina('<article class="cartao-medida" data-cartao-medida="amostra"></article>')['cartoes_sem_regua'] == 1,
    'numero_indisponivel': numero('N.d.') is None,
    'numero_com_virgula': numero('150,1') > numero('150'),
    'clamp': em_largura(clamp('.amostra {font-size: clamp(20px, 4vw, 60px)}', '.amostra'), 1000) == 40,
}
if not all(M['conhecidos_positivos'].values()):
    FALHAS.append('um conhecido-positivo não foi encontrado')
for estado in ('antes', 'depois'):
    M[estado] = fase(estado)
M['capturas'] = {estado: capturas(estado, M[estado]['cabeca'] if M[estado] else None) for estado in ('antes', 'depois')}
livros = {estado: linhas(M[estado]['cabeca']) for estado in ('antes', 'depois') if M[estado]}
M['camaras'] = {estado: camaras(M[estado]['cabeca'], livro) for estado, livro in livros.items()}
if M['antes'] and M['depois']:
    a, d = M['antes']['cabeca'], M['depois']['cabeca']
    antes, depois = livros['antes'], livros['depois']
    mudaram = [k for k, v in antes.items() if k in depois and v['value'] != depois[k]['value']]
    sairam = sorted(set(antes) - set(depois))
    novas = sorted(set(depois) - set(antes))
    M['linhas'] = {'antes': len(antes), 'depois': len(depois), 'valores_alterados': len(mudaram), 'alteradas': mudaram, 'retiradas': sairam, 'novas': {k: depois[k]['value'] for k in novas}, 'novas_n': len(novas)}
    if mudaram or sairam:
        FALHAS.append('linhas anteriores alteradas ou retiradas')
    for estado in ('antes', 'depois'):
        for pg in M[estado]['paginas'].values():
            for chave in ('camaras_acima_do_limite', 'camaras_dentro_do_limite', 'camaras_sem_valor'):
                esperado = M['camaras'][estado][chave]
                if any(numero(v) != esperado for v in pg['provas'].get(chave, [])):
                    FALHAS.append(f'{estado}: {chave} não coincide com a contagem independente')
    M['commits'] = git('log', '--format=%h %s', f'{a}..{d}').decode().splitlines()
    M['commits_n'] = len(M['commits'])
M['plantas'] = plantas()
M['plantas_total'] = sum(p['estragos'] for p in M['plantas'].values())
M['plantas_morderam'] = sum(p['morderam'] for p in M['plantas'].values())
M['motor'] = medicao_guardada('motor/medidas-motor.json', obrigatoria=True)
M['caso_portao_ue'] = medicao_guardada('caso-portao-ue.json')
M['correcao'] = medicao_guardada('correcao/resumo.json', obrigatoria=True)
M['hierarquia'] = medicao_guardada('plantas-titulos-b2.json', obrigatoria=True)
if M['hierarquia']:
    h = M['hierarquia']
    esperado = {(f, l, w) for f in ('temas', 'europeia', 'lugares', 'concelho', 'estudos', 'estudo', 'sobre', 'metodo', 'correcoes', 'agenda', 'recibo') for l in ('pt', 'en') for w in LARGURAS}
    vistos = [(r['familia'], r['lingua'], r['largura']) for r in h['limpas']]
    if len(vistos) != len(esperado) or set(vistos) != esperado or any(r['falhas'] for r in h['limpas'] + h['repostas']):
        FALHAS.append('hierarquia: cobertura incompleta ou medida limpa com falhas')
    M['hierarquia_resumo'] = {
        'cabeca': h['cabeca'], 'cabecas_medidas': len(h['limpas']), 'familias': len({r['familia'] for r in h['limpas']}),
        'mordidas': sum(len(p['casos']) for p in h['plantas']), 'plantas_passaram': all(p['passou'] for p in h['plantas']),
    }
    if M['depois'] and h['cabeca'] != M['depois']['cabeca']:
        FALHAS.append('hierarquia: medida noutra construção')
# A segunda passagem de correção: a K16 e os selos (achado 8), e a prova do CFP
# (achado 6). As duas têm de ser da construção medida, e verdes.
M['perguntas'] = medicao_guardada('perguntas.json', obrigatoria=True)
if M['perguntas'] and (M['perguntas']['falhas_total'] or M['depois'] and M['perguntas']['dist_construido_de'] != M['depois']['cabeca']):
    FALHAS.append('perguntas.json: com falhas, ou de outra construção')
M['fonte_cfp'] = medicao_guardada('correcao-2/fonte-cfp.json', obrigatoria=True)
if M['fonte_cfp'] and not all(x['passou'] and x['codigo'] == 1 for x in M['fonte_cfp']['plantas']):
    FALHAS.append('fonte-cfp.json: uma planta do CFP não mordeu')
M['plantas_desbloqueadas'] = medicao_guardada('plantas-bloqueadas.json', obrigatoria=True)
if not all(x.get('executada') and x.get('mordida_provada') for x in M['plantas_desbloqueadas']['casos']):
    FALHAS.append('restam plantas bloqueadas sem execução e mordida')
M['correcao_captor'] = medicao_guardada('correcao-captor.json')
M['qa_recibo'] = medicao_guardada('qa-recibo-inquilinos-390.json')
M['checks_de_trabalho'] = checks_de_trabalho()
M['l1'] = {k: medicao_guardada(v) for k, v in (
    ('diagnostico_inicial', 'l1-diagnostico-inicial/l1-b2-trabalho.json'),
    ('trabalho', 'l1-b2-trabalho.json'), ('final', 'l1-b2.json'))}
M['qa_de_trabalho'] = {p.name: medicao_guardada(p.name) for p in sorted(AQUI.glob('qa-*-trabalho*.json'))}
for qa in M['qa_de_trabalho'].values():
    qa['paginas_total'] = len(qa.get('resultados', []))
    qa['cartoes_total'] = sum(len(r.get('cartoes', [])) for r in qa.get('resultados', []))
    qa['falhas_total'] = len(qa.get('falhas', []))
M['portoes'] = {n: portao(n, M['depois']['cabeca'] if M['depois'] else None) for n in ('build', 'verify', 'typecheck')}
portoes_medidos = [p for p in M['portoes'].values() if p]
M['portoes_etapas_cronometradas'] = len(portoes_medidos)
M['portoes_segundos_registados'] = sum(p['segundos'] for p in portoes_medidos) if portoes_medidos else None
M['portoes_segundos'] = M['portoes_segundos_registados'] if len(portoes_medidos) == len(M['portoes']) else None
M['portoes_tentativas'] = tentativas_dos_portoes()
M['tempo_documentado'] = tempo_documentado()
M['capturas_total'] = sum(c['quantidade'] for c in M['capturas'].values() if c)
M['faltas'], M['falhas'] = FALTAS, FALHAS
M['faltas_total'], M['falhas_total'] = len(FALTAS), len(FALHAS)
saida = Path(os.environ.get('OEDP_MEDIDAS_JSON', AQUI / 'medidas.json'))
saida.write_text(json.dumps(M, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'{saida}: {len(FALHAS)} falhas; {len(FALTAS)} entradas por completar; {M["capturas_total"]} capturas verificadas; {M["plantas_total"]} plantas medidas.')
for f in FALHAS:
    print(f'FALHA: {f}', file=sys.stderr)
sys.exit(1 if FALHAS else 0)
