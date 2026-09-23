#!/usr/bin/env python3
"""As medições do §0 do `BRIEF-B2-o-veredicto-e-as-paginas-dos-temas.md`.

uso: python3 design/observatorio/medidas/BRIEF-B2.py      (na raiz do repositório)

Escreve `design/observatorio/medidas/BRIEF-B2.json` (ou o caminho de
`OEDP_MEDIDAS_JSON`, que é como o `scripts/check-briefs.py` o corre) e imprime o
mesmo JSON. Cada medição traz o nome por que o §0 a cita, o valor, o comando e um
conhecido-positivo do MESMO predicado (M5, §1.122).

CADA MEDIÇÃO É ESTÁVEL DE PROPÓSITO. As fontes leem-se na cabeça que estava no ar
a 23.09.2026 à tarde, `4b99dea3` (o R1 aterrado), por `git show`; as páginas
construídas leem-se de cópias congeladas em
`design/especime-v3/medicoes/b2-2026-09-23/paginas/`, presas pelo sha256 escrito
no ficheiro, construídas dessa cabeça (mais o `nomes.json` do motor de 23.09, que
só muda recibos, e nenhuma destas cópias é um recibo). As duas respostas do
Eurostat ao quadro `tessi164` (a sobrecarga do custo da habitação por regime de
ocupação), pedidas a 23.09.2026 pelo cliente da casa, estão na mesma pasta e no
motor (`indicators/out/b2-2026-09-23/`). A CI clona com `fetch-depth: 0`, por
isso o `git show` de uma cabeça antiga corre lá como aqui.
"""
import hashlib
import json
import os
import re
import subprocess
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
CABECA = '4b99dea3'
COPIAS = os.path.join(RAIZ, 'design', 'especime-v3', 'medicoes', 'b2-2026-09-23', 'paginas')
COMANDO = 'python3 design/observatorio/medidas/BRIEF-B2.py'


def mostra(caminho):
    """O ficheiro tal como estava na cabeça que estava no ar."""
    r = subprocess.run(['git', 'show', f'{CABECA}:{caminho}'], cwd=RAIZ, capture_output=True)
    if r.returncode != 0:
        sys.stderr.write(f'git show {CABECA}:{caminho} falhou: {r.stderr.decode("utf-8", "replace")}\n')
        sys.exit(2)
    return r.stdout.decode('utf-8')


def git_grep_l(padrao, *pastas):
    r = subprocess.run(['git', 'grep', '-l', '-E', padrao, CABECA, '--', *pastas], cwd=RAIZ, capture_output=True)
    if r.returncode not in (0, 1):
        sys.stderr.write(f'git grep falhou: {r.stderr.decode("utf-8", "replace")}\n')
        sys.exit(2)
    return [l.split(':', 1)[1] for l in r.stdout.decode('utf-8').splitlines() if ':' in l]


def copia(nome):
    with open(os.path.join(COPIAS, nome), 'rb') as f:
        b = f.read()
    return b.decode('utf-8'), hashlib.sha256(b).hexdigest()


medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({'nome': nome, 'valor': valor, 'comando': comando,
                    'conhecido_positivo': {'o_que': o_que, 'encontrado': bool(encontrado)}})


# --- 0 · as cópias, presas pelo sha256
copias = {}
for chave, nome in (('temas', 'temas_index.html'), ('primeira', 'index.html'), ('europeia', 'uniao-europeia_index.html'),
                    ('en_temas', 'en_themes_index.html'), ('mourao', 'municipios_mourao_index.html'),
                    ('dominios', 'dominios_index.html'), ('areas', 'areas_index.html')):
    texto, sha = copia(nome)
    copias[chave] = texto
    medicao(f'sha256_{chave}', sha, f'shasum -a 256 design/especime-v3/medicoes/b2-2026-09-23/paginas/{nome}',
            'o resumo é o do ficheiro lido agora', len(sha) == 64)

temas, primeira, europeia, mourao = copias['temas'], copias['primeira'], copias['europeia'], copias['mourao']
RE_ARTIGO = re.compile(r'<article class="cartao-medida"[^>]*>.*?</article>', re.S)
artigos = RE_ARTIGO.findall(temas)
artigos_primeira = RE_ARTIGO.findall(primeira)
artigos_mourao = RE_ARTIGO.findall(mourao)

# --- 1 · os cartões nacionais da página dos temas
medicao('cartoes_nacionais_nos_temas', len(artigos), f'{COMANDO} · <article class="cartao-medida"> em paginas/temas_index.html',
        'o mesmo contador conta pelo menos um cartão na cópia da primeira página', len(artigos_primeira) >= 1)
medicao('temas_com_medidas', temas.count('<section class="pais-tema"'), f'{COMANDO} · <section class="pais-tema"> em paginas/temas_index.html',
        'o mesmo contador encontra uma secção de tema na cópia da primeira página', primeira.count('<section class="pais-tema"') >= 1)
carta = mostra('design/observatorio/CARTA-DOS-CONTEUDOS.md')
tabela = carta.split('## 2 ·', 1)[1].split('## 3 ·', 1)[0]
dominios_da_carta = len(re.findall(r'^\| \d+ \| ', tabela, re.M))
medicao('temas_da_carta', dominios_da_carta, f'{COMANDO} · linhas «| n |» da tabela do §2 de CARTA-DOS-CONTEUDOS.md@{CABECA}',
        'o mesmo padrão apanha a primeira linha da tabela («| 1 | Economia e finanças públicas»)', bool(re.search(r'^\| 1 \| Economia', tabela, re.M)))

n_ref = len(re.findall(r'data-regua="referencia"', temas))
medicao('cartoes_com_valor_de_referencia', n_ref, f'{COMANDO} · data-regua="referencia" em paginas/temas_index.html',
        'o mesmo contador encontra a referência no cartão da dívida pública', 'data-cartao-medida="divida-publica-2025"' in temas and n_ref >= 1)
medicao('cartoes_com_cor_de_estado', len(re.findall(r'data-regua="referencia" data-estado="(?:fora|dentro)"', temas)),
        f'{COMANDO} · data-regua="referencia" data-estado="fora|dentro" na mesma cópia',
        'o mesmo padrão apanha «data-estado="fora"» numa amostra de mentira', bool(re.search(r'data-regua="referencia" data-estado="(?:fora|dentro)"', '<span data-regua="referencia" data-estado="fora">')))
medicao('cartoes_com_media_da_uniao', temas.count('data-regua="ue"'), f'{COMANDO} · data-regua="ue" em paginas/temas_index.html',
        'o mesmo contador encontra a União no cartão da dívida pública', 'data-regua="ue"' in next(a for a in artigos if 'divida-publica-2025' in a))
medicao('cartoes_com_periodo_anterior', temas.count('data-regua="anterior"'), f'{COMANDO} · data-regua="anterior" em paginas/temas_index.html',
        'o mesmo contador encontra o período anterior no cartão da dívida pública', 'data-regua="anterior"' in next(a for a in artigos if 'divida-publica-2025' in a))
sem_regua = [re.search(r'data-cartao-medida="([^"]+)"', a).group(1) for a in artigos if 'class="cartao-medida-regua"' not in a]
medicao('cartoes_sem_regua', len(sem_regua), f'{COMANDO} · artigos sem class="cartao-medida-regua" em paginas/temas_index.html',
        'o mesmo predicado vê a régua no cartão da dívida pública', 'class="cartao-medida-regua"' in next(a for a in artigos if 'divida-publica-2025' in a))
medicao('cartoes_sem_regua_lista', ', '.join(sem_regua), f'{COMANDO} · os identificadores dos artigos sem régua',
        'a lista traz o cartão do limite legal', 'indice-de-divida-limite-legal' in sem_regua)
medicao('cartoes_com_definicao', temas.count('data-cartao-definicao='), f'{COMANDO} · data-cartao-definicao= em paginas/temas_index.html',
        'o mesmo contador encontra a definição no cartão do rácio S80/S20', 'data-cartao-definicao=' in next(a for a in artigos if 'racio-s80-s20-2025' in a))

# --- 2 · a marca entre o valor e a unidade, e a precisão dentro do cartão
RE_MARCA_NO_MEIO = re.compile(r'cartao-medida-num">[^<]*</span><a class="src-chip".*?</a></span><span class="campo-valor cartao-medida-unidade', re.S)
n_meio = sum(1 for a in artigos if RE_MARCA_NO_MEIO.search(a))
medicao('cartoes_com_a_marca_entre_o_valor_e_a_unidade', n_meio, f'{COMANDO} · «num</span><a class="src-chip"…</a></span><span class="campo-valor cartao-medida-unidade» por artigo, em paginas/temas_index.html',
        'o mesmo padrão apanha o cartão do rácio S80/S20', bool(RE_MARCA_NO_MEIO.search(next(a for a in artigos if 'racio-s80-s20-2025' in a))))


def casas(s):
    s = s.strip()
    m = re.fullmatch(r'-?[\d   ]+(?:,(\d+))?', s)
    if not m:
        return None
    return len(m.group(1)) if m.group(1) else 0


mista = []
for a in artigos:
    valores = re.findall(r'class="claim-value[^"]*"[^>]*>([^<]*)<', a)
    ds = [d for d in (casas(v) for v in valores) if d is not None]
    if len(set(ds)) > 1:
        mista.append(re.search(r'data-cartao-medida="([^"]+)"', a).group(1))
medicao('cartoes_com_precisao_mista', len(mista), f'{COMANDO} · artigos cujos valores selados (o valor e a régua) têm casas decimais diferentes, em paginas/temas_index.html',
        'o mesmo predicado apanha o cartão do rácio S80/S20 («4,86» com «5,2»)', 'racio-s80-s20-2025' in mista)
medicao('cartoes_com_precisao_mista_lista', ', '.join(mista), f'{COMANDO} · os identificadores desses artigos', 'a lista traz o rácio S80/S20', 'racio-s80-s20-2025' in mista)

euro_unidades, euro_casas = set(), set()
for a in artigos:
    u = re.search(r'cartao-medida-unidade"[^>]*>([^<]*)<', a)
    if u and re.search(r'euro', u.group(1), re.I):
        euro_unidades.add(u.group(1).strip())
        v = re.search(r'cartao-medida-num">([^<]*)<', a)
        if v:
            euro_casas.add(casas(v.group(1)))
medicao('formas_do_euro_nos_temas', len(euro_unidades), f'{COMANDO} · unidades distintas com «euro» nos artigos de paginas/temas_index.html',
        'o conjunto traz «euros por mês»', 'euros por mês' in euro_unidades)
medicao('precisoes_do_euro_nos_temas', len(euro_casas), f'{COMANDO} · casas decimais distintas dos valores em euros nesses artigos',
        'o conjunto traz 0, 1 e 2 casas (20 600; 1 576,0; 920,00)', {0, 1, 2} <= euro_casas)

# --- 3 · o cartão do limite legal, e as câmaras contra o limite
medicao('cartao_do_limite_legal_nos_temas', temas.count('data-cartao-medida="indice-de-divida-limite-legal"'), f'{COMANDO} · data-cartao-medida="indice-de-divida-limite-legal" em paginas/temas_index.html',
        'o mesmo contador encontra o cartão na cópia da primeira página', primeira.count('data-cartao-medida="indice-de-divida-limite-legal"') >= 1)
limite = re.search(r'^value: "([^"]*)"', mostra('ledger/claims/indice-de-divida-limite-legal.yml'), re.M).group(1)
medicao('limite_legal', limite, f'git show {CABECA}:ledger/claims/indice-de-divida-limite-legal.yml · value', 'o valor lê-se como número', casas(limite) is not None)
gerado = json.loads(mostra('src/data/concelhos.gerado.json'))
r = subprocess.run(['git', 'grep', '-H', '-E', '^value:', CABECA, '--', 'ledger/claims/*-indice-de-divida-2024.yml'], cwd=RAIZ, capture_output=True)
valores_indice = {}
for l in r.stdout.decode('utf-8').splitlines():
    m = re.match(rf'{CABECA}:ledger/claims/([^:]+)\.yml:value: "([^"]*)"', l)
    if m:
        valores_indice[m.group(1)] = m.group(2)


def numero(s):
    s = s.replace(' ', '').replace(' ', '').replace(' ', '')
    return float(s.replace(',', '.')) if re.fullmatch(r'-?\d+(,\d+)?', s) else None


teto = numero(limite)
acima, dentro, sem = [], 0, []
for c in gerado:
    v = valores_indice.get(c['linhas']['indice'])
    n = numero(v) if v is not None else None
    if n is None:
        sem.append(c['slug'])
    elif n > teto:
        acima.append((c['slug'], v))
    else:
        dentro += 1
medicao('concelhos_no_ficheiro', len(gerado), f'git show {CABECA}:src/data/concelhos.gerado.json · entradas', 'a lista traz Évora', any(c['slug'] == 'evora' for c in gerado))
medicao('camaras_acima_do_limite', len(acima), f'{COMANDO} · índice de dívida de 2024 de cada concelho (git grep ^value: {CABECA} -- ledger/claims/*-indice-de-divida-2024.yml) acima do limite legal',
        'o mesmo predicado apanha Vila Real de Santo António (419,5)', any(s == 'vila-real-de-santo-antonio' for s, _ in acima))
medicao('camaras_dentro_do_limite', dentro, f'{COMANDO} · o mesmo, no limite ou abaixo', 'Évora (105,5) conta como dentro', numero(valores_indice['evora-indice-de-divida-2024']) <= teto)
medicao('camaras_sem_valor', len(sem), f'{COMANDO} · o mesmo, sem valor numérico', 'a lista traz Penedono («N.d.»)', 'penedono' in sem)
medicao('camaras_acima_do_limite_lista', ', '.join(f'{s} ({v})' for s, v in sorted(acima, key=lambda x: -numero(x[1]))), f'{COMANDO} · os concelhos acima do limite, do maior índice ao menor', 'a lista começa por Vila Real de Santo António', acima and sorted(acima, key=lambda x: -numero(x[1]))[0][0] == 'vila-real-de-santo-antonio')

# --- 4 · a primeira página, a página europeia e Mourão
medicao('cartoes_na_primeira_pagina', len(artigos_primeira), f'{COMANDO} · <article class="cartao-medida"> em paginas/index.html', 'o mesmo contador conta os artigos dos temas', len(artigos) >= 1)
medicao('cartoes_com_referencia_na_primeira_pagina', primeira.count('data-regua="referencia"'), f'{COMANDO} · data-regua="referencia" em paginas/index.html', 'o mesmo contador encontra referências nos temas', n_ref >= 1)
RE_LI = re.compile(r'<li class="cartao"[^>]*data-estado="(fora|dentro|sem)"')
estados = RE_LI.findall(europeia)
medicao('medidas_na_faixa_europeia', len(estados), f'{COMANDO} · <li class="cartao" … data-estado=…> em paginas/uniao-europeia_index.html', 'o mesmo padrão apanha um cartão de mentira', bool(RE_LI.search('<li class="cartao" data-cartao="x" data-estado="fora">')))
medicao('fora_do_valor_de_referencia', estados.count('fora'), f'{COMANDO} · data-estado="fora" nesses cartões', 'há pelo menos um cartão fora', estados.count('fora') >= 1)
medicao('dentro_do_valor_de_referencia', estados.count('dentro'), f'{COMANDO} · data-estado="dentro" nesses cartões', 'há pelo menos um cartão dentro', estados.count('dentro') >= 1)
medicao('sem_valor_de_referencia', estados.count('sem'), f'{COMANDO} · data-estado="sem" nesses cartões', 'há pelo menos um cartão sem referência', estados.count('sem') >= 1)
medicao('posicao_na_faixa_europeia', europeia.count('<span data-nonledger="numeracao">1</span> de '), f'{COMANDO} · «1 de …» na faixa de paginas/uniao-europeia_index.html', 'a cópia traz a numeração', 'data-nonledger="numeracao"' in europeia)
medicao('mourao_cartoes', len(artigos_mourao), f'{COMANDO} · <article class="cartao-medida"> em paginas/municipios_mourao_index.html', 'o mesmo contador conta os artigos dos temas', len(artigos) >= 1)
medicao('mourao_cartoes_com_regua', mourao.count('class="cartao-medida-regua"'), f'{COMANDO} · class="cartao-medida-regua" na mesma cópia', 'o mesmo contador encontra a régua nos temas', temas.count('class="cartao-medida-regua"') >= 1)

# --- 5 · o nome do projeto e o título das páginas, pelas folhas
css = mostra('src/styles/site.css')


def clamp(seletor):
    m = re.search(re.escape(seletor) + r'\s*\{[^}]*?font-size:\s*clamp\(\s*([\d.]+)px,\s*([\d.]+)vw,\s*([\d.]+)px\)', css, re.S)
    return tuple(float(x) for x in m.groups()) if m else None


def a(c, largura):
    lo, vw, hi = c
    v = max(lo, min(hi, vw * largura / 100))
    return int(v) if v == int(v) else v


nome, h1 = clamp('.wordmark'), clamp('\nh1')
medicao('nome_do_projeto_a_390', a(nome, 390), f'{COMANDO} · .wordmark font-size clamp() em site.css@{CABECA}, a 390 px', 'o leitor de clamp() lê a regra do .wordmark', nome is not None)
medicao('nome_do_projeto_a_1280', a(nome, 1280), f'{COMANDO} · o mesmo, a 1 280 px', 'o leitor de clamp() lê a regra do .wordmark', nome is not None)
medicao('titulo_a_390', a(h1, 390), f'{COMANDO} · h1 font-size clamp() em site.css@{CABECA}, a 390 px', 'o leitor de clamp() lê a regra do h1', h1 is not None)
medicao('titulo_a_1280', a(h1, 1280), f'{COMANDO} · o mesmo, a 1 280 px', 'o leitor de clamp() lê a regra do h1', h1 is not None)

# --- 6 · o rodapé, as páginas de domínio e de área, e quem depende das rotas
rodape = re.search(r'<footer.*?</footer>', primeira, re.S).group(0)
ligacoes = re.findall(r'href="([^"]+)"', rodape)
medicao('ligacoes_no_rodape', len(ligacoes), f'{COMANDO} · href= dentro de <footer> em paginas/index.html', 'o rodapé liga a /dominios e a /areas', '/dominios' in ligacoes and '/areas' in ligacoes)
areas = sorted(set(re.findall(r'href="(/areas/[^"#]+)"', copias['areas'])))
dominios = sorted(set(re.findall(r'href="(/dominios/[^"#]+)"', copias['dominios'])))
medicao('areas_de_governo_com_pagina', len(areas), f'{COMANDO} · ligações distintas a /areas/<slug> em paginas/areas_index.html', 'a lista traz /areas/saude', '/areas/saude' in areas)
medicao('dominios_com_pagina', len(dominios), f'{COMANDO} · ligações distintas a /dominios/<slug> em paginas/dominios_index.html', 'a lista traz o primeiro domínio', '/dominios/economia-e-financas-publicas' in dominios)
dependentes = git_grep_l(r"routePath\('dominio|routePath\('dominios|routePath\('area|routePath\('areas|/dominios/|/areas/|/domains/|/en/areas", 'src', 'scripts', 'tests')
medicao('ficheiros_que_dependem_das_rotas', len(dependentes), f'git grep -l -E "routePath\\(\'dominio|…|/en/areas" {CABECA} -- src scripts tests', 'a lista traz src/lib/routes.mjs', any(f.endswith('src/lib/routes.mjs') for f in dependentes))

# --- 7 · a habitação: a linha de hoje e o quadro por regime de ocupação
for chave, ficheiro in (('sobrecarga_pt_2025', 'sobrecarga-do-custo-da-habitacao-2025'), ('sobrecarga_ue_2025', 'sobrecarga-do-custo-da-habitacao-2025-ue'), ('sobrecarga_pt_2024', 'sobrecarga-do-custo-da-habitacao-2024')):
    v = re.search(r'^value: "([^"]*)"', mostra(f'ledger/claims/{ficheiro}.yml'), re.M).group(1)
    medicao(chave, v, f'git show {CABECA}:ledger/claims/{ficheiro}.yml · value', 'o valor lê-se como número', casas(v) is not None)
figuras = mostra('src/data/figuras.mjs')
medicao('sobrecarga_sem_media_europeia_declarada', figuras.count('semMediaEuropeia'), f'{COMANDO} · «semMediaEuropeia» em figuras.mjs@{CABECA}', 'a declaração existe', 'semMediaEuropeia' in figuras)


def eurostat(nome):
    texto, sha = copia(nome)
    js = json.loads(texto)
    dims, size, val = js['id'], js['size'], js['value']
    idx = {d: js['dimension'][d]['category']['index'] for d in dims}
    ultimo = list(idx['time'])[-1]

    def pos(co):
        p = 0
        for d, s in zip(dims, size):
            p = p * s + idx[d][co[d]]
        return p
    base = {d: list(idx[d])[0] for d in dims}
    saida = {}
    for ten in idx['tenure']:
        co = dict(base); co['tenure'] = ten; co['time'] = ultimo
        saida[ten] = val.get(str(pos(co)))
    return js['label'], ultimo, saida, sha


for geo, nome in (('pt', 'tessi164_PT.json'), ('ue', 'tessi164_EU27_2020.json')):
    rotulo, ultimo, por_regime, sha = eurostat(nome)
    medicao(f'sha256_tessi164_{geo}', sha, f'shasum -a 256 design/especime-v3/medicoes/b2-2026-09-23/paginas/{nome}', 'o resumo é o do ficheiro lido agora', len(sha) == 64)
    medicao(f'tessi164_rotulo_{geo}', rotulo, f'{COMANDO} · label da resposta {nome}', 'o rótulo fala do regime de ocupação', 'tenure' in rotulo)
    medicao(f'tessi164_ultimo_periodo_{geo}', ultimo, f'{COMANDO} · último período da resposta {nome}', 'o período é um ano', re.fullmatch(r'\d{4}', ultimo) is not None)
    for ten, chave in (('RENT_MKT', 'inquilinos_a_preco_de_mercado'), ('RENT_FR', 'inquilinos_a_renda_reduzida_ou_gratuita'), ('OWN_L', 'proprietarios_com_credito'), ('OWN_NL', 'proprietarios_sem_credito')):
        v = por_regime.get(ten)
        medicao(f'{chave}_{geo}', str(v).replace('.', ','), f'{COMANDO} · value de tenure={ten}, geo da resposta, time={ultimo}, em {nome}', 'o valor existe na resposta', v is not None)

saida = {'brief': 'design/observatorio/BRIEF-B2-o-veredicto-e-as-paginas-dos-temas.md',
         'guiao': 'design/observatorio/medidas/BRIEF-B2.py',
         'cabeca_lida': CABECA, 'copias': 'design/especime-v3/medicoes/b2-2026-09-23/paginas/',
         'medidas': medidas}
alvo = os.environ.get('OEDP_MEDIDAS_JSON') or os.path.join(RAIZ, 'design', 'observatorio', 'medidas', 'BRIEF-B2.json')
with open(alvo, 'w', encoding='utf-8') as f:
    json.dump(saida, f, ensure_ascii=False, indent=2); f.write('\n')
print(json.dumps(saida, ensure_ascii=False, indent=2))
