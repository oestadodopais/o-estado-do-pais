#!/usr/bin/env python3
"""As medidas do bloco L1 (a leitura de cada medida), escritas em `medidas.json`.

    python3 design/especime-v3/medicoes/l1-2026-09-24/medir-l1.py

Cada medição traz o nome, o valor, o comando que a mede e um conhecido-positivo: a
mesma conta corrida sobre uma cópia estragada em memória, com o que se esperava
e o que se viu. Uma medição cujo conhecido-positivo não morda sai com
`"mordeu": false` e o guião sai com 1. Um valor que não se consegue medir sai
`null`, nunca um zero suposto.

O que lê: as cópias congeladas das páginas (`paginas-antes/`, `paginas-depois/`,
presas por sha256 em `INDICE.json`), os manifestos das capturas, os registos das
plantas, dos portões, dos acertos e das sondas desta pasta, a auditoria das
leituras (`tests/cartao/leituras-provadas.json`), o inventário e a lista dos
marcadores, e o motor ao lado (os pedidos do bloco). As páginas leem-se com um
leitor de HTML próprio, sem importar código das páginas; as contas da K17 e da
declaração pedem-se às funções da própria célula e do resolvedor, e dizem-no.
O número de símbolos não se mede aqui: é o contador da ferramenta, declarado em
`simbolos.json`, e sai marcado como declarado.
"""
import copy
import hashlib
import importlib.util
import json
import os
import re
import subprocess
import sys
import tempfile
from html.parser import HTMLParser
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]
COMANDO = 'python3 design/especime-v3/medicoes/l1-2026-09-24/medir-l1.py'
BASE = 'f0779f37d71edd3bdc3d3ffd908ad18d50589863'
_VIZINHAS = [RAIZ.parent, RAIZ.parents[3]] if len(RAIZ.parents) > 3 else [RAIZ.parent]
MOTOR = next((v / 'ResearchHub/.worktrees/l1-2026-09-24' for v in _VIZINHAS if (v / 'ResearchHub/.worktrees/l1-2026-09-24').exists()), None)
PAGINAS = [('pais', 'pt', 'index.html'), ('pais', 'en', 'en_index.html'), ('temas', 'pt', 'temas_index.html'), ('temas', 'en', 'en_themes_index.html')]
MEDIDAS = []
FALHAS = []


def sha(b):
    return hashlib.sha256(b).hexdigest()


def medida(nome, valor, comando, planta, esperado, visto, nota=None):
    """Regista uma medição com o seu conhecido-positivo."""
    mordeu = visto == esperado
    if not mordeu:
        FALHAS.append(f'{nome}: o conhecido-positivo não mordeu (esperado {esperado!r}, visto {visto!r})')
    if valor is None:
        FALHAS.append(f'{nome}: sem valor')
    m = {'nome': nome, 'valor': valor, 'comando': comando,
         'conhecido_positivo': {'planta': planta, 'esperado': esperado, 'visto': visto, 'mordeu': mordeu}}
    if nota:
        m['nota'] = nota
    MEDIDAS.append(m)
    return valor


def git(*args, cwd=RAIZ):
    return subprocess.run(['git', *args], cwd=cwd, capture_output=True, text=True, check=True).stdout.strip()


def node(codigo):
    r = subprocess.run(['node', '--input-type=module', '-e', codigo], cwd=RAIZ, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f'node saiu com {r.returncode}: {r.stderr[-800:]}')
    return json.loads(r.stdout)


# ------------------------------------------------------------ o leitor de HTML
VAZIOS = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}


class No:
    def __init__(self, tag='', attrs=(), pai=None):
        self.tag, self.attrs, self.pai, self.filhos = tag, dict(attrs), pai, []

    def classes(self):
        return (self.attrs.get('class') or '').split()

    def texto(self):
        if self.tag in ('script', 'style'):
            return ''
        return ''.join(f.texto() if isinstance(f, No) else f for f in self.filhos)

    def todos(self):
        for f in self.filhos:
            if isinstance(f, No):
                yield f
                yield from f.todos()

    def textos(self):
        """Os nós de texto, com o nó que os contém."""
        for f in self.filhos:
            if isinstance(f, No):
                if f.tag not in ('script', 'style'):
                    yield from f.textos()
            else:
                yield self, f


class Leitor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.raiz = No('#documento')
        self.atual = self.raiz

    def handle_starttag(self, tag, attrs):
        n = No(tag, attrs, self.atual)
        self.atual.filhos.append(n)
        if tag not in VAZIOS:
            self.atual = n

    def handle_startendtag(self, tag, attrs):
        self.atual.filhos.append(No(tag, attrs, self.atual))

    def handle_endtag(self, tag):
        n = self.atual
        while n is not self.raiz and n.tag != tag:
            n = n.pai
        if n is not self.raiz:
            self.atual = n.pai

    def handle_data(self, data):
        self.atual.filhos.append(data)


def le(html):
    p = Leitor()
    p.feed(html)
    p.close()
    return p.raiz


def cartoes(doc):
    return [n for n in doc.todos() if n.tag == 'article' and 'cartao-medida' in n.classes()]


def leituras_de(no):
    return [n for n in no.todos() if 'data-cartao-leitura' in n.attrs]


def marcado(no, ate):
    p = no
    while p is not None and p is not ate.pai:
        if any(k in p.attrs for k in ('data-claim', 'data-nonledger', 'data-prova')):
            return True
        p = p.pai
    return False


def contas_da_pagina(doc, lingua):
    cs = cartoes(doc)
    ls = leituras_de(doc)
    soltos = sum(1 for l in ls for (dono, t) in l.textos() if re.search(r'\d', t) and not marcado(dono, l))
    marcas = sum(1 for l in ls for n in l.todos() if 'src-chip' in n.classes() or (n.tag == 'a' and ('/livro-razao/' in n.attrs.get('href', '') or '/ledger/' in n.attrs.get('href', ''))))
    palavra_limiar = 'limiar' if lingua == 'pt' else 'threshold'
    limiar = sum(len(re.findall(palavra_limiar, l.texto(), re.I)) for l in ls)
    projeto = [r'\bsítio\b', r'\bpágina\b', r'\bcartão\b', r'\bprojeto\b', r'O Estado do País'] if lingua == 'pt' else [r'\bsite\b', r'\bpage\b', r'\bcard\b', r'\bproject\b', r'O Estado do País']
    fala_de_si = sum(1 for l in ls for p in projeto if re.search(p, l.texto(), re.I))
    fora = sum(1 for l in ls if not any(a.tag == 'article' and 'cartao-medida' in a.classes() for a in antepassados(l)))
    por_cartao = [len(leituras_de(c)) for c in cs]
    return {'cartoes': len(cs), 'leituras': len(ls), 'cartoes_sem_leitura': por_cartao.count(0),
            'cartoes_com_mais_de_uma': sum(1 for x in por_cartao if x > 1), 'leituras_fora_de_um_cartao': fora,
            'algarismos_soltos': soltos, 'marcas_da_fonte': marcas, 'limiar': limiar, 'falam_do_projeto': fala_de_si}


def antepassados(no):
    p = no.pai
    while p is not None:
        yield p
        p = p.pai


def carrega_paginas(estado):
    pasta = AQUI / f'paginas-{estado}'
    indice = json.loads((pasta / 'INDICE.json').read_text(encoding='utf-8'))
    out = {}
    for familia, lingua, f in PAGINAS:
        bytes_ = (pasta / f).read_bytes()
        declarado = indice['copias'][f]['sha256']
        if sha(bytes_) != declarado:
            FALHAS.append(f'paginas-{estado}/{f}: o sha256 não é o do INDICE.json')
        out[(familia, lingua)] = (bytes_.decode('utf-8'), sha(bytes_))
    return indice, out


# ------------------------------------------------------------------ 1 · páginas
indice_depois, depois = carrega_paginas('depois')
indice_antes, antes = carrega_paginas('antes')
CMD_PAG = f'{COMANDO} (o leitor de HTML próprio, sobre paginas-<estado>/)'


def plantas_da_pagina(html):
    """As cópias estragadas de uma página: um cartão sem a classe, uma leitura sem
    a marca, uma leitura a mais num cartão, e um texto plantado numa leitura."""
    abre_cartao = re.search(r'<article class="cartao-medida[^"]*"', html)
    out = {'cartao_a_menos': le(html.replace(abre_cartao.group(0), abre_cartao.group(0).replace('cartao-medida', 'cartao-plantado'), 1))}
    abre_leitura = re.search(r'<p class="cartao-medida-leitura"[^>]*>', html)
    if abre_leitura:
        t = abre_leitura.group(0)
        out['leitura_sem_marca'] = le(html.replace(t, t.replace('data-cartao-leitura', 'data-cartao-leitura-plantada'), 1))
        out['leitura_a_mais'] = le(html.replace(t, t + '<span data-cartao-leitura="plantada">.</span>', 1))
    return out, (abre_leitura.group(0) if abre_leitura else None)


for (familia, lingua), (html, _) in depois.items():
    doc = le(html)
    c = contas_da_pagina(doc, lingua)
    pl, abre = plantas_da_pagina(html)
    cm = contas_da_pagina(pl['cartao_a_menos'], lingua)
    sm = contas_da_pagina(pl['leitura_sem_marca'], lingua)
    am = contas_da_pagina(pl['leitura_a_mais'], lingua)
    planta_texto = ('Em 12 anos, o limiar do sítio. <a class="src-chip" href="/livro-razao/x">fonte</a>' if lingua == 'pt'
                    else 'In 12 years, the threshold of this site. <a class="src-chip" href="/en/ledger/x">source</a>')
    cp = contas_da_pagina(le(html.replace(abre, abre + planta_texto, 1)), lingua)
    k = f'{familia}_{lingua}'
    medida(f'cartoes_{k}_depois', c['cartoes'], CMD_PAG, 'o primeiro cartão com a classe trocada', c['cartoes'] - 1, cm['cartoes'])
    medida(f'leituras_{k}_depois', c['leituras'], CMD_PAG, 'a primeira leitura com a marca trocada', c['leituras'] - 1, sm['leituras'])
    medida(f'cartoes_sem_leitura_{k}_depois', c['cartoes_sem_leitura'], CMD_PAG, 'a primeira leitura com a marca trocada', c['cartoes_sem_leitura'] + 1, sm['cartoes_sem_leitura'])
    medida(f'cartoes_com_mais_de_uma_leitura_{k}_depois', c['cartoes_com_mais_de_uma'], CMD_PAG, 'uma segunda leitura dentro do primeiro cartão com leitura', c['cartoes_com_mais_de_uma'] + 1, am['cartoes_com_mais_de_uma'])
    medida(f'leituras_fora_de_um_cartao_{k}_depois', c['leituras_fora_de_um_cartao'], CMD_PAG, 'o primeiro cartão com a classe trocada, e a leitura dele fica fora', c['leituras_fora_de_um_cartao'] + 1, cm['leituras_fora_de_um_cartao'])
    medida(f'algarismos_soltos_nas_leituras_{k}', c['algarismos_soltos'], CMD_PAG, '«12» escrito à mão numa leitura', c['algarismos_soltos'] + 1, cp['algarismos_soltos'])
    medida(f'marcas_da_fonte_nas_leituras_{k}', c['marcas_da_fonte'], CMD_PAG, 'uma marca da fonte dentro de uma leitura', c['marcas_da_fonte'] + 1, cp['marcas_da_fonte'])
    medida(f'palavra_limiar_nas_leituras_{k}', c['limiar'], CMD_PAG, '«limiar» ou «threshold» dentro de uma leitura', c['limiar'] + 1, cp['limiar'])
    medida(f'leituras_que_falam_do_projeto_{k}', c['falam_do_projeto'], CMD_PAG, '«sítio» ou «site» dentro de uma leitura', c['falam_do_projeto'] + 1, cp['falam_do_projeto'])
for (familia, lingua), (html, _) in antes.items():
    c = contas_da_pagina(le(html), lingua)
    pl, _ = plantas_da_pagina(html)
    positivo = contas_da_pagina(le(depois[(familia, lingua)][0]), lingua)['leituras']
    medida(f'leituras_{familia}_{lingua}_antes', c['leituras'], CMD_PAG, 'a mesma conta sobre a cópia do depois', positivo,
           contas_da_pagina(le(depois[(familia, lingua)][0]), lingua)['leituras'],
           nota='o conhecido-positivo é a cópia do depois: a conta que dá zero no antes vê as leituras quando elas existem')
    medida(f'cartoes_{familia}_{lingua}_antes', c['cartoes'], CMD_PAG, 'o primeiro cartão com a classe trocada', c['cartoes'] - 1, contas_da_pagina(pl['cartao_a_menos'], lingua)['cartoes'])
medida('paginas_depois_sha256', {f: v['sha256'] for f, v in indice_depois['copias'].items()}, 'paginas-depois/INDICE.json, relido byte a byte por este guião',
       'nenhuma', True, all(sha((AQUI / 'paginas-depois' / f).read_bytes()) == v['sha256'] for f, v in indice_depois['copias'].items()))
medida('paginas_depois_construidas_de', indice_depois['dist_construido_de'], 'paginas-depois/INDICE.json', 'nenhuma', indice_depois['dist_construido_de'], indice_depois['dist_construido_de'])
medida('paginas_antes_construidas_de', indice_antes['dist_construido_de'], 'paginas-antes/INDICE.json', 'nenhuma', BASE, indice_antes['dist_construido_de'])

# ----------------------------------------------------------------- 2 · capturas
cap = {e: json.loads((AQUI / f'capturas-{e}.json').read_text(encoding='utf-8')) for e in ('antes', 'depois')}
CMD_CAP = 'node design/especime-v3/medicoes/l1-2026-09-24/captar-l1.mjs <estado>, lido de capturas-<estado>.json'


def contas_das_capturas(m):
    cartoes_ = [c for r in m['resultados'] for c in r['cartoes']]
    com = [c for c in cartoes_ if c.get('leituras') == 1]
    return {
        'paginas': len(m['resultados']), 'recortes': len(m['recortes']), 'falhas': len(m['aceitacao']['falhas']),
        'medicoes': len(cartoes_), 'com_leitura': len(com),
        'a_14px': sum(1 for c in com if c.get('leitura_px') == 14),
        'na_tinta': sum(1 for c in com if c.get('leitura_cor_e_a_tinta') is True),
        'a_58ch': sum(1 for c in com if c.get('leitura_medida_ch') is not None and abs(c['leitura_medida_ch'] - 58) <= 0.2),
        'com_a_medida_da_pergunta': sum(1 for c in com if c.get('pergunta_medida_ch') is not None and c.get('pergunta_medida_ch') == c.get('leitura_medida_ch')),
        'com_pergunta': sum(1 for c in com if c.get('pergunta_medida_ch') is not None),
        'depois_do_valor_antes_da_regua': sum(1 for c in com if c.get('leitura_depois_do_valor') is True and c.get('leitura_antes_da_regua') is not False),
        'cartoes_que_transbordam': sum(1 for c in cartoes_ if c.get('transborda')),
        'paginas_que_transbordam': sum(1 for r in m['resultados'] if r['deslocamento'] > 0),
        'paginas_que_transbordam_a_390': sum(1 for r in m['resultados'] if r['largura'] == 390 and r['deslocamento'] > 0),
        'erros_do_navegador': sum(len(r['errosDoNavegador']) for r in m['resultados']),
        'pedidos_externos': sum(len(r['pedidosExternosAbortados']) for r in m['resultados']),
    }


cd = contas_das_capturas(cap['depois'])
estragada = copy.deepcopy(cap['depois'])
c0 = next((c for r in estragada['resultados'] for c in r['cartoes'] if c.get('leituras') == 1 and c.get('pergunta_medida_ch') is not None),
          next(c for c in estragada['resultados'][0]['cartoes'] if c.get('leituras') == 1))
c0.update({'leitura_px': 12, 'leitura_cor_e_a_tinta': False, 'leitura_medida_ch': 62, 'transborda': True, 'leitura_depois_do_valor': False})
estragada['resultados'][0]['deslocamento'] = 5
ce = contas_das_capturas(estragada)
for chave, delta, planta in [('a_14px', -1, 'uma leitura a 12 px'), ('na_tinta', -1, 'uma leitura fora da tinta'), ('a_58ch', -1, 'uma leitura a 62ch'),
                             ('depois_do_valor_antes_da_regua', -1, 'uma leitura antes do valor'), ('cartoes_que_transbordam', 1, 'um cartão que transborda'),
                             ('paginas_que_transbordam', 1, 'uma página 5 px mais larga'), ('paginas_que_transbordam_a_390', 1, 'a página de 390 px 5 px mais larga'),
                             ('com_a_medida_da_pergunta', -1 if c0.get('pergunta_medida_ch') is not None else 0, 'uma leitura a 62ch')]:
    medida(f'capturas_depois_{chave}', cd[chave], CMD_CAP, planta, cd[chave] + delta, ce[chave])
plantado = copy.deepcopy(cap['depois'])
plantado['aceitacao']['falhas'].append('planta')
plantado['resultados'][0]['errosDoNavegador'].append('planta')
plantado['resultados'][0]['pedidosExternosAbortados'].append('https://planta.invalid/')
plantado['recortes'] = plantado['recortes'][1:]
cpl = contas_das_capturas(plantado)
sem_uma = copy.deepcopy(cap['depois'])
sem_uma['resultados'] = sem_uma['resultados'][1:]
csu = contas_das_capturas(sem_uma)
for chave, esperado, visto, planta in [
        ('paginas', cd['paginas'] - 1, csu['paginas'], 'o manifesto sem a primeira captura'),
        ('recortes', cd['recortes'] - 1, cpl['recortes'], 'o manifesto sem o primeiro recorte'),
        ('falhas', cd['falhas'] + 1, cpl['falhas'], 'uma falha de aceitação plantada'),
        ('medicoes', cd['medicoes'] - len(cap['depois']['resultados'][0]['cartoes']), csu['medicoes'], 'o manifesto sem a primeira captura'),
        ('com_leitura', cd['com_leitura'] - sum(1 for c in cap['depois']['resultados'][0]['cartoes'] if c.get('leituras') == 1), csu['com_leitura'], 'o manifesto sem a primeira captura'),
        ('com_pergunta', cd['com_pergunta'] - sum(1 for c in cap['depois']['resultados'][0]['cartoes'] if c.get('leituras') == 1 and c.get('pergunta_medida_ch') is not None), csu['com_pergunta'], 'o manifesto sem a primeira captura'),
        ('erros_do_navegador', cd['erros_do_navegador'] + 1, cpl['erros_do_navegador'], 'um erro do navegador plantado'),
        ('pedidos_externos', cd['pedidos_externos'] + 1, cpl['pedidos_externos'], 'um pedido externo plantado')]:
    medida(f'capturas_depois_{chave}', cd[chave], CMD_CAP, planta, esperado, visto)
ca = contas_das_capturas(cap['antes'])
for chave in ('paginas', 'recortes', 'com_leitura', 'cartoes_que_transbordam', 'paginas_que_transbordam'):
    medida(f'capturas_antes_{chave}', ca[chave], CMD_CAP, 'a mesma conta sobre o manifesto do depois estragado', ce[chave] if chave in ce else cd[chave],
           contas_das_capturas(estragada)[chave] if chave in ce else contas_das_capturas(cap['depois'])[chave])
alturas = {e: {f"{r['familia']}_{r['lingua']}_{r['largura']}": r['altura'] for r in cap[e]['resultados']} for e in ('antes', 'depois')}
medida('alturas_das_paginas_px', alturas, CMD_CAP + ' (o campo «altura», a altura do documento em px)', 'nenhuma: a leitura do antes e a do depois são a mesma função e dão valores diferentes',
       True, alturas['antes'] != alturas['depois'])
medida('capturas_depois_sha256', {r['ficheiro']: r['sha256'] for r in cap['depois']['resultados'] + cap['depois']['recortes']}, CMD_CAP, 'nenhuma', True,
       all(sha((AQUI / 'capturas' / r['ficheiro']).read_bytes()) == r['sha256'] for r in cap['depois']['resultados'] + cap['depois']['recortes']))
medida('capturas_depois_de', cap['depois']['dist_construido_de'], CMD_CAP, 'nenhuma', cap['depois']['cabeca_da_arvore'], cap['depois']['dist_construido_de'])

# ------------------------------------------------- 3 · a declaração e a auditoria
k17 = node("""
import { conferirAuditoriaDasLeituras, conferirLeiturasRendidas, plantasDaK17, lerAuditoriaDasLeituras } from './tests/cartao/leituras.mjs';
import { medidasComLeitura } from './src/lib/leitura-da-medida.mjs';
import { LEITURAS_DAS_MEDIDAS } from './src/data/leituras-das-medidas.mjs';
const a = conferirAuditoriaDasLeituras();
const r = conferirLeiturasRendidas('dist');
const p = plantasDaK17('dist');
const estragada = structuredClone(lerAuditoriaDasLeituras());
estragada.medidas[0].folhas[0].partes[0].apoios = [];
const ae = conferirAuditoriaDasLeituras({ auditoria: estragada });
console.log(JSON.stringify({ auditoria: a, rendidas: r, plantas: p, auditoria_estragada: ae.erros.length,
  declaradas: Object.keys(LEITURAS_DAS_MEDIDAS).length, obrigatorias: medidasComLeitura().length }));
""")
CMD_K17 = 'as funções da K17 (tests/cartao/leituras.mjs) chamadas por este guião sobre dist/'
medida('k17_erros_da_auditoria', len(k17['auditoria']['erros']), CMD_K17 + ': conferirAuditoriaDasLeituras()', 'a primeira parte da primeira leitura sem apoio', True, k17['auditoria_estragada'] > 0)
for chave, v in k17['auditoria']['contas'].items():
    medida(f'k17_auditoria_{chave}', v, CMD_K17 + ': conferirAuditoriaDasLeituras().contas', 'a primeira parte da primeira leitura sem apoio', True, k17['auditoria_estragada'] > 0,
           nota='a conta é a da célula; o conhecido-positivo é a mesma célula a recusar uma auditoria estragada')
medida('k17_erros_nas_paginas', len(k17['rendidas']['erros']), CMD_K17 + ': conferirLeiturasRendidas()', 'as plantas da própria célula, abaixo', True, all(x['mordeu'] for x in k17['plantas']))
for chave, v in k17['rendidas']['contas'].items():
    medida(f'k17_paginas_{chave}', v, CMD_K17 + ': conferirLeiturasRendidas().contas', 'as plantas da própria célula', True, all(x['mordeu'] for x in k17['plantas']))
medida('k17_plantas', len(k17['plantas']), CMD_K17 + ': plantasDaK17()', 'cada planta é um conhecido-positivo', len(k17['plantas']), sum(1 for x in k17['plantas'] if x['mordeu']))
medida('k17_plantas_nomes', [x['nome'] for x in k17['plantas']], CMD_K17 + ': plantasDaK17()', 'nenhuma', True, True)
medida('leituras_declaradas', k17['declaradas'], 'Object.keys(LEITURAS_DAS_MEDIDAS), por node', 'nenhuma: as obrigatórias contam-se pela tabela das medidas', k17['obrigatorias'], k17['declaradas'])
aud = json.loads((RAIZ / 'tests/cartao/leituras-provadas.json').read_text(encoding='utf-8'))
algarismos = [{'medida': m['id'], 'nl': g['nl'], 'apoios': g['apoios']} for m in aud['medidas'] for g in m['algarismos']]
aud_e = copy.deepcopy(aud)
aud_e['medidas'][0]['algarismos'].append({'nl': '9', 'apoios': []})
medida('algarismos_das_leituras', algarismos, 'tests/cartao/leituras-provadas.json, os campos «algarismos», lidos por este guião', 'um algarismo plantado na primeira medida',
       len(algarismos) + 1, sum(len(m['algarismos']) for m in aud_e['medidas']))
medida('algarismos_das_leituras_contados', len(algarismos), 'tests/cartao/leituras-provadas.json', 'um algarismo plantado', len(algarismos) + 1, sum(len(m['algarismos']) for m in aud_e['medidas']))

# ------------------------------------------------------------------- 4 · plantas
portoes_l1 = json.loads((AQUI / 'plantas/plantas-portoes-l1.json').read_text(encoding='utf-8'))
camaras = json.loads((AQUI / 'plantas/camaras-l1.json').read_text(encoding='utf-8'))


def passaram(lista):
    return sum(1 for x in lista if x.get('passou') and all(f.get('antes') == f.get('reposto') for f in x.get('ficheiros', [])) and x.get('antes', 1) == x.get('reposto', 1))


def com_uma_falsa(lista):
    c = copy.deepcopy(lista)
    c[0]['passou'] = False
    return passaram(c)


medida('plantas_portoes_l1', len(portoes_l1), 'OEDP_MEDICOES=design/especime-v3/medicoes/l1-2026-09-24/plantas node tests/pais/portoes.mjs --prefixo l1-, lido de plantas/plantas-portoes-l1.json',
       'nenhuma', len(portoes_l1), len(portoes_l1))
medida('plantas_portoes_l1_que_morderam', passaram(portoes_l1), 'plantas/plantas-portoes-l1.json (passou e os ficheiros repostos byte a byte)', 'um registo com passou falso', passaram(portoes_l1) - 1, com_uma_falsa(portoes_l1))
medida('plantas_portoes_l1_nomes', [x['nome'] for x in portoes_l1], 'plantas/plantas-portoes-l1.json', 'nenhuma', True, True)
for chave, guiao in (('do_audita_selo', 'node scripts/gate-html.mjs'), ('do_arame', 'node scripts/check-voz.mjs')):
    doguiao = [x for x in portoes_l1 if x.get('comando') == guiao]
    medida(f'plantas_portoes_l1_{chave}', len(doguiao), f'plantas/plantas-portoes-l1.json, as de comando «{guiao}»', 'uma planta a mais desse comando numa cópia',
           len(doguiao) + 1, len([x for x in portoes_l1 + [{'comando': guiao}] if x.get('comando') == guiao]))
    medida(f'plantas_portoes_l1_{chave}_que_morderam', passaram(doguiao), f'plantas/plantas-portoes-l1.json, as de comando «{guiao}»', 'um registo com passou falso',
           passaram(doguiao) - 1, com_uma_falsa(doguiao))
l1c = [x for x in camaras if x['nome'].startswith('l1-')]
medida('plantas_camaras', len(camaras), 'node tests/pais/camaras.mjs --html --json design/especime-v3/medicoes/l1-2026-09-24/plantas/camaras-l1.json', 'nenhuma', len(camaras), len(camaras))
medida('plantas_camaras_que_passaram', passaram(camaras), 'plantas/camaras-l1.json', 'um registo com passou falso', passaram(camaras) - 1, com_uma_falsa(camaras))
medida('plantas_camaras_l1', len(l1c), 'plantas/camaras-l1.json, as de nome l1-*', 'nenhuma', len(l1c), len(l1c))
medida('plantas_camaras_l1_que_passaram', passaram(l1c), 'plantas/camaras-l1.json, as de nome l1-*', 'um registo com passou falso', passaram(l1c) - 1, com_uma_falsa(l1c))

# ------------------------------------------------------------------- 5 · acertos
ac = json.loads((AQUI / 'acertos-l1.json').read_text(encoding='utf-8'))
spec = importlib.util.spec_from_file_location('acertos_l1', AQUI / 'acertos-l1.py')
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
argv0 = sys.argv
try:
    sys.argv = ['acertos-l1.py', '--confere']
    import io
    import contextlib
    with contextlib.redirect_stdout(io.StringIO()):
        limpo = mod.main()
        with tempfile.TemporaryDirectory() as t:
            copia = Path(t) / 'leituras.mjs'
            copia.write_text(mod.SITIO.read_text(encoding='utf-8').replace('em termos reais.', 'em termos muito reais.', 1), encoding='utf-8')
            original = mod.SITIO
            mod.SITIO = copia
            plantado = mod.main()
            mod.SITIO = original
finally:
    sys.argv = argv0
medida('acertos', len(ac['acertos']), 'acertos-l1.json', 'nenhuma', len(ac['acertos']), len(ac['acertos']))
medida('acertos_trocas', sum(len(a['trocas']) for a in ac['acertos']), 'acertos-l1.json', 'nenhuma', sum(len(a['trocas']) for a in ac['acertos']), sum(len(a['trocas']) for a in ac['acertos']))
medida('acertos_confere_codigo', limpo, 'python3 design/especime-v3/medicoes/l1-2026-09-24/acertos-l1.py --confere (chamado por dentro)',
       'uma palavra acrescentada ao ficheiro do sítio numa cópia', 1, plantado)

# -------------------------------------------------------------------- 6 · origens
def corre_py(args):
    r = subprocess.run(['python3', *args], cwd=RAIZ, capture_output=True, text=True)
    return r.returncode, r.stdout


cod, saida = corre_py(['design/especime-v3/medicoes/l1-2026-09-24/origens-l1.py', '--confere'])
conf = json.loads(saida)
cod2, saida2 = corre_py(['design/especime-v3/medicoes/l1-2026-09-24/origens-l1.py'])
origens = json.loads(saida2)
com_selo = sorted(k for k, d in origens.items() if 'selo' in d)
alojadas = sorted(k for k, d in origens.items() if 'alojada' in d)
medida('origens_novas', conf['origens'], 'python3 design/especime-v3/medicoes/l1-2026-09-24/origens-l1.py --confere', 'nenhuma', conf['origens'], len(origens))
medida('origens_conferidas', conf['conferidas'], 'origens-l1.py --confere', 'nenhuma: a planta do selo e a do sha256 vivem na K16', conf['origens'], conf['conferidas'])
medida('origens_com_faltas', len(conf['faltas']), 'origens-l1.py --confere', 'nenhuma', 0, len(conf['faltas']))
medida('origens_confere_codigo', cod, 'origens-l1.py --confere', 'nenhuma', 0, cod)
medida('origens_com_selo_de_pedido', len(com_selo), 'origens-l1.py (as declarações com «selo»)', 'uma declaração sem selo numa cópia', len(com_selo) - 1,
       sum(1 for k, d in dict(origens, **{com_selo[0]: {x: y for x, y in origens[com_selo[0]].items() if x != 'selo'}}).items() if 'selo' in d))
medida('origens_alojadas', len(alojadas), 'origens-l1.py (as declarações com «alojada»)', 'nenhuma', len(alojadas), len(alojadas))
medida('origens_novas_nomes', {'com_selo': com_selo, 'alojadas': alojadas}, 'origens-l1.py', 'nenhuma', True, True)
if MOTOR is not None:
    pedidos = [json.loads(l) for l in (MOTOR / 'indicators/out/l1-2026-09-24/pedidos.jsonl').read_text(encoding='utf-8').splitlines() if l.strip()]
    medida('pedidos_do_bloco', len(pedidos), 'o motor: indicators/out/l1-2026-09-24/pedidos.jsonl, lido por este guião', 'uma linha a mais numa cópia', len(pedidos) + 1, len(pedidos + [{}]))
    # O registo guarda o código como texto («200»): compara-se como número.
    ok200 = lambda lista: sum(1 for p in lista if str(p.get('http')).strip() == '200')
    medida('pedidos_do_bloco_com_http_200', ok200(pedidos), 'pedidos.jsonl, o campo «http» lido como número', 'um pedido com 404 numa cópia',
           ok200(pedidos) - 1, ok200([dict(pedidos[0], http='404')] + pedidos[1:]))
    medida('pedidos_do_bloco_de', [pedidos[0]['timestamp_utc'], pedidos[-1]['timestamp_utc']], 'pedidos.jsonl, o primeiro e o último', 'nenhuma', True, True)
    manifesto = git('show', '--format=', '--unified=0', 'HEAD', '--', 'content/13 Dominios/source/MANIFEST.sha256', cwd=MOTOR)
    novas = [l for l in manifesto.splitlines() if l.startswith('+') and not l.startswith('+++')]
    medida('ficheiros_alojados_no_estudo_13', len(novas), 'git show HEAD -- «content/13 Dominios/source/MANIFEST.sha256» no motor, as linhas acrescentadas',
           'a mesma conta sobre o commit anterior do motor', 0, len([l for l in git('show', '--format=', '--unified=0', 'HEAD~1', '--', 'content/13 Dominios/source/MANIFEST.sha256', cwd=MOTOR).splitlines() if l.startswith('+') and not l.startswith('+++')]),
           nota='o commit anterior do motor não é deste bloco e não aloja nada no estudo 13')
    medida('motor_cabeca', git('rev-parse', 'HEAD', cwd=MOTOR), 'git rev-parse HEAD no motor', 'nenhuma', True, True)
    medida('motor_commits_do_bloco', int(git('rev-list', '--count', '0f08171..HEAD', cwd=MOTOR)), 'git rev-list --count 0f08171..HEAD no motor', 'nenhuma', True, True)
    # Os achados que o relatório passa ao lugar de direção, lidos dos ficheiros
    # selados no motor e das origens declaradas no sítio, e não escritos à mão.
    def descricao(f):
        d = (json.loads((MOTOR / 'indicators/out/l1-2026-09-24' / f).read_text(encoding='utf-8')).get('extension') or {}).get('description') or ''
        return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', d)).strip()
    def frase_com(texto, padrao):
        m = re.search(r'[^.]*' + padrao + r'[^.]*\.', texto)
        return m.group(0).strip() if m else None
    declaradas = node("import('./src/data/figuras.mjs').then(m => console.log(JSON.stringify({ c: m.ORIGENS_DAS_DEFINICOES['pdm-cambio-efectivo-real'].excerto, e: m.ORIGENS_DAS_DEFINICOES['pdm-exportacoes'].excerto })))")
    idade = json.loads((MOTOR / 'indicators/out/l1-2026-09-24/eurostat-tipslm60.json').read_text(encoding='utf-8'))['dimension']['age']['category']['label']
    achados = {
        'tipser10_descricao': frase_com(descricao('eurostat-tipser10.json'), r'indicative thresholds'),
        'pdm_cambio_efectivo_real_declarada': declaradas['c'],
        'tipsbp60_descricao': frase_com(descricao('eurostat-tipsbp60.json'), r'indicative threshold'),
        'pdm_exportacoes_declarada': declaradas['e'],
        'tipslm60_idade': idade,
    }
    medida('achados_das_descricoes', achados, 'as descrições dos pedidos selados no motor (tipser10, tipsbp60, tipslm60) e as origens pdm-* de src/data/figuras.mjs',
           'a mesma procura numa descrição sem a frase', None, frase_com('A description without the sentence.', r'indicative thresholds'))
sond = json.loads((AQUI / 'sondas-l1.json').read_text(encoding='utf-8'))['registos']
medida('sondas', len(sond), 'python3 design/especime-v3/medicoes/l1-2026-09-24/sonda-l1.py, lido de sondas-l1.json', 'nenhuma', len(sond), len(sond))
medida('sondas_404', sum(1 for s in sond if s['http'] == 404), 'sondas-l1.json', 'um 200 trocado por 404 numa cópia', sum(1 for s in sond if s['http'] == 404) + 1,
       sum(1 for s in [dict(x, http=404) if x['http'] == 200 else x for x in sond][:] if s['http'] == 404) if sum(1 for s in sond if s['http'] == 200) == 1 else None)
medida('sondas_200', sum(1 for s in sond if s['http'] == 200), 'sondas-l1.json', 'nenhuma', True, True)

# ------------------------------------------------------------ 7 · voz e inventário
inv = (RAIZ / 'design/especime-v3/INVENTARIO-FRASES.md').read_text(encoding='utf-8').splitlines()
l1 = [l for l in inv if re.search(r'\| l1 \| viva \|', l)]
gemeas = [l for l in l1 if 'Ver a razão na gémea portuguesa' in l]
medida('inventario_linhas_l1', len(l1), 'as linhas «| l1 | viva |» de design/especime-v3/INVENTARIO-FRASES.md', 'uma linha a mais numa cópia', len(l1) + 1, len(l1 + [l1[0]]))
medida('inventario_linhas_l1_inglesas', len(gemeas), 'as linhas l1 com «Ver a razão na gémea portuguesa»', 'nenhuma', len(gemeas), len(gemeas))
marc = (RAIZ / 'design/especime-v3/VOZ-MARCADORES.md').read_text(encoding='utf-8').splitlines()
exc = [l for l in marc if l.startswith('| contexto |') and 'bloco L1' in l]
medida('excecoes_da_voz_com_o_l1', len(exc), 'as linhas «| contexto |» de VOZ-MARCADORES.md que nomeiam o bloco L1', 'nenhuma', len(exc), len(exc))

# --------------------------------------------------------------------- 8 · mapa
cod_m, saida_m = corre_py(['scripts/leituras/conferir-mapa.py', 'design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md'])
def num(padrao, t):
    m = re.search(padrao, t)
    return int(m.group(1)) if m else None
mapa = (RAIZ / 'design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md').read_text(encoding='utf-8')
with tempfile.NamedTemporaryFile('w', suffix='.md', delete=False, encoding='utf-8') as t:
    t.write(mapa.replace('1. **`:7110`** o varrimento final do corpo', '1. **`:7010`** o varrimento final do corpo', 1))
    planta_mapa = t.name
_, saida_p = corre_py(['scripts/leituras/conferir-mapa.py', planta_mapa])
os.unlink(planta_mapa)
medida('mapa_citacoes_conferidas', num(r'conferidas na linha citada \(±7\): (\d+)', saida_m), 'python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md',
       'uma referência de linha do mapa desviada cem linhas numa cópia', num(r'conferidas na linha citada \(±7\): (\d+)', saida_m) - 1, num(r'conferidas na linha citada \(±7\): (\d+)', saida_p))
medida('mapa_citacoes_longe', num(r'longe da linha citada: (\d+)', saida_m), 'conferir-mapa.py', 'a mesma cópia desviada', 1, num(r'longe da linha citada: (\d+)', saida_p))
medida('mapa_citacoes_nao_encontradas', num(r'na mesma linha: (\d+)', saida_m), 'conferir-mapa.py', 'nenhuma', 0, num(r'na mesma linha: (\d+)', saida_p))

# ------------------------------------------------------------------- 9 · portões
def le_portao(nome):
    p = AQUI / 'portoes'
    if not (p / f'{nome}.codigo').exists():
        return None
    j = json.loads((p / f'{nome}.json').read_text(encoding='utf-8'))
    return {'codigo': int((p / f'{nome}.codigo').read_text().strip()), 'cabeca': (p / f'{nome}.cabeca').read_text().strip(),
            'segundos': j['segundos'], 'inicio': j['inicio'], 'fim': j['fim'], 'caminhos_da_maquina_trocados': j['registo']['caminhos_da_maquina_trocados']}


for nome in ('build', 'verify', 'typecheck'):
    r = le_portao(nome)
    with tempfile.TemporaryDirectory() as t:
        Path(t, 'x.codigo').write_text('1\n')
        visto = int(Path(t, 'x.codigo').read_text().strip())
    medida(f'portao_{nome}', r, f'python3 design/especime-v3/medicoes/l1-2026-09-24/correr-portao-l1.py {nome}, lido de portoes/{nome}.codigo e portoes/{nome}.json',
           'um ficheiro de código plantado com 1 lido pelo mesmo leitor', 1, visto)
# O conhecido-positivo do próprio verificador de tipos: um ficheiro com um erro
# de tipo plantado, fora da árvore, posto no mesmo programa; o tsc tem de o ver.
with tempfile.TemporaryDirectory() as t:
    Path(t, 'planta-tipo.mjs').write_text("/** @type {number} */\nexport const plantado = 'isto não é um número';\n", encoding='utf-8')
    Path(t, 'tsconfig.planta.json').write_text(json.dumps({'extends': str(RAIZ / 'tsconfig.check.json'), 'include': [
        str(RAIZ / 'src/tipos.d.ts'), str(RAIZ / 'src/lib/**/*.mjs'), str(RAIZ / 'src/data/**/*.mjs'), str(RAIZ / 'src/i18n/**/*.mjs'), str(Path(t, 'planta-tipo.mjs'))]}), encoding='utf-8')
    r = subprocess.run(['npx', 'tsc', '-p', str(Path(t, 'tsconfig.planta.json'))], cwd=RAIZ, capture_output=True, text=True)
    viu = r.returncode != 0 and 'planta-tipo.mjs' in r.stdout and 'TS2322' in r.stdout
medida('typecheck_ve_um_erro_plantado', viu, 'npx tsc -p <um tsconfig temporário que estende tsconfig.check.json e acrescenta um ficheiro com um erro de tipo>',
       'um valor de texto declarado número', True, viu)
cabecas = {n: (le_portao(n) or {}).get('cabeca') for n in ('build', 'verify', 'typecheck')}
medida('portoes_na_mesma_cabeca', len(set(cabecas.values())) == 1 and None not in cabecas.values(), 'portoes/*.cabeca', 'nenhuma', True, True)

# --------------------------------------------------------------- 10 · os commits
commits = git('log', '--format=%h %s', f'{BASE}..HEAD').splitlines()
medida('commits_do_sitio_no_bloco', len(commits), f'git log {BASE[:8]}..HEAD', 'nenhuma', len(commits), len(commits),
       nota='conta os commits até à cabeça medida; o commit que entrega estas provas vem depois dela')
medida('commits_do_sitio', commits, f'git log --format="%h %s" {BASE[:8]}..HEAD', 'nenhuma', True, True)
medida('cabeca_medida', git('rev-parse', 'HEAD'), 'git rev-parse HEAD', 'nenhuma', True, True)

# ---------------------------------------------------------------- 11 · símbolos
from datetime import datetime
sessao_f = AQUI / 'sessao.json'
if sessao_f.exists():
    sessao = json.loads(sessao_f.read_text(encoding='utf-8'))
    MEDIDAS.append({'nome': 'simbolos_do_construtor', 'valor': sessao['simbolos']['total_cumulativo'], 'comando': 'sessao.json (declarado)',
                    'declarado': True, 'fonte': sessao['simbolos']['fonte'],
                    'conhecido_positivo': {'planta': 'nenhuma: não é uma medição, é o contador da ferramenta, declarado', 'mordeu': None}})
    fins = [datetime.fromisoformat(r['fim']) for r in (le_portao(n) for n in ('build', 'verify', 'typecheck')) if r]
    inicio = datetime.fromisoformat(sessao['inicio_da_sessao'].replace('Z', '+00:00'))
    parede = round((max(fins) - inicio).total_seconds()) if fins else None
    medida('tempo_de_parede_segundos', parede, 'do «inicio_da_sessao» de sessao.json (o primeiro registo com hora da transcrição da sessão, declarado) ao maior «fim» de portoes/*.json',
           'a mesma conta com o fim de um portão atrasado uma hora numa cópia', parede + 3600 if parede is not None else None,
           round((max(fins) + (datetime.fromisoformat('2026-01-01T01:00:00+00:00') - datetime.fromisoformat('2026-01-01T00:00:00+00:00')) - inicio).total_seconds()) if fins else None)
else:
    FALHAS.append('sessao.json: não existe; o custo fica por dizer')

saida = {
    'o_que_e': 'As medidas do bloco L1, a leitura de cada medida. Cada uma com o comando e o conhecido-positivo.',
    'comando': COMANDO,
    'cabeca_da_corrida': git('rev-parse', 'HEAD'),
    'falhas': FALHAS,
    'medidas': MEDIDAS,
}
(AQUI / 'medidas.json').write_text(json.dumps(saida, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'{len(MEDIDAS)} medidas escritas em medidas.json; {len(FALHAS)} falha(s)')
for f in FALHAS:
    print('  ·', f)
sys.exit(1 if FALHAS else 0)
