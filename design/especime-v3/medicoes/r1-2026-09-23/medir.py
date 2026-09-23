#!/usr/bin/env python3
"""As medidas do bloco R1 (23.09.2026). Nenhum número do relatório se escreve de cabeça: sai daqui.

uso: python3 design/especime-v3/medicoes/r1-2026-09-23/medir.py      (na raiz do sítio, sem argumentos)

Escreve `medidas.json` ao lado, que é o ficheiro contra o qual o
`scripts/leituras/conferir-relatorio.py` confere o `RELATORIO.md` deste bloco.

O QUE LÊ, E SÓ ISTO. Tudo dentro do sítio: as páginas construídas congeladas em
`paginas-depois/` (conferidas pelo sha256 do seu índice antes de medir), as
cópias do antes que o lugar de direção congelou em `paginas/` e o
`design/observatorio/medidas/BRIEF-R1.json` que as mediu, os ficheiros do sítio
na cabeça (`git show HEAD:`) e na cabeça de partida (`git show cbe87016:`), as
saídas guardadas nesta pasta (plantas, capturas, pesquisa, portões, contraste) e
o `motor/motor.json` que `recolher-motor.py` escreveu a partir do ramo do motor.
Onde o brief mediu o antes com um predicado, o depois mede-se com o MESMO
predicado, copiado do `BRIEF-R1.py` e dito ao lado.

SAI COM CÓDIGO DIFERENTE DE 0 quando uma entrada falta, um resumo não bate, ou uma
conferência subordinada falha, e diz quais. As saídas dos três portões na cabeça
final entram quando existem (`portoes/`); antes disso o campo diz «por correr».
"""
import hashlib
import html as _html
import json
import re
import subprocess
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[3]
PARTIDA = 'cbe87016'
COPIAS_DEPOIS = AQUI / 'paginas-depois'
COPIAS_ANTES = AQUI / 'paginas'
FALHAS = []


def falha(o_que):
    FALHAS.append(o_que)


def git(*a):
    r = subprocess.run(['git', *a], cwd=RAIZ, capture_output=True, text=True)
    if r.returncode != 0:
        falha(f'git {" ".join(a)}: {r.stderr.strip()}')
        return ''
    return r.stdout


def mostra(ref, caminho):
    return git('show', f'{ref}:{caminho}')


def ler(caminho):
    return Path(caminho).read_text(encoding='utf-8')


def js(nome):
    p = AQUI / nome
    if not p.exists():
        falha(f'falta {nome}')
        return None
    return json.loads(p.read_text(encoding='utf-8'))


def sha(b):
    return hashlib.sha256(b).hexdigest()


M = {}

# ---------------------------------------------------------------- identidade
M['cabeca'] = git('rev-parse', 'HEAD').strip()
M['partida'] = git('rev-parse', PARTIDA).strip()
M['commits_do_ramo'] = [l for l in git('log', '--format=%h %s', f'{PARTIDA}..HEAD').splitlines()]
M['commits_do_ramo_n'] = len(M['commits_do_ramo'])
brief = json.loads(ler(RAIZ / 'design/observatorio/medidas/BRIEF-R1.json'))
ANTES = {m['nome']: m['valor'] for m in brief['medidas']}
M['brief_antes'] = ANTES

# ------------------------------------------------ as cópias do depois, conferidas
indice = js('paginas-depois/INDICE.json') or {'copias': {}}
M['paginas_depois'] = {'dist_construido_de': indice.get('dist_construido_de'), 'cabeca_da_arvore': indice.get('cabeca_da_arvore'),
                       'copias': len(indice.get('copias', {}))}
COPIA = {}
for nome, info in indice.get('copias', {}).items():
    b = (COPIAS_DEPOIS / nome).read_bytes()
    if sha(b) != info['sha256']:
        falha(f'paginas-depois/{nome}: o sha256 não é o do índice')
    COPIA[nome] = b.decode('utf-8')


def copia(nome):
    if nome not in COPIA:
        falha(f'paginas-depois/{nome} não existe')
        return ''
    return COPIA[nome]


# ------------------------------------ 1 · a pesquisa (o mesmo guião, antes e depois)
def resumo_pesquisa(nome):
    d = js(nome)
    if not d:
        return None
    return [{k: m[k] for k in ('lang', 'largura', 'vazioVisiveis', 'conhecidoVisiveis', 'mouraoVisivel', 'enterComVariosFica',
                                'nenhumVisiveis', 'fraseDoNadaVisivel', 'enterComNenhumFica', 'unicoVisiveis', 'enterComUmAbre', 'passa')}
            for m in d['medidas']]


M['pesquisa'] = {'antes': resumo_pesquisa('pesquisa-antes.json'), 'depois': resumo_pesquisa('pesquisa-depois.json')}
if M['pesquisa']['depois']:
    M['pesquisa']['depois_passagens'] = len(M['pesquisa']['depois'])
    M['pesquisa']['depois_passam'] = sum(1 for m in M['pesquisa']['depois'] if m['passa'])
    M['pesquisa']['depois_mour_a_vista'] = sorted({m['conhecidoVisiveis'] for m in M['pesquisa']['depois']})
if M['pesquisa']['antes']:
    M['pesquisa']['antes_passam'] = sum(1 for m in M['pesquisa']['antes'] if m['passa'])
    M['pesquisa']['antes_mour_a_vista'] = sorted({m['conhecidoVisiveis'] for m in M['pesquisa']['antes']})
    M['pesquisa']['antes_frase_do_nada_a_vista'] = sum(1 for m in M['pesquisa']['antes'] if m['fraseDoNadaVisivel'])
js_row = mostra('HEAD', 'public/js/municipios.js')
# A marca do ramo da fila mudou de nome com o bloco («a fila de resultados (os
# lugares e o livro-razão)»); o contador é o MESMO do BRIEF-R1.py
# (pesquisa_enter_recarrega), aplicado depois da marca.
marca = re.search(r'a fila de resultados \((?:os lugares e o )?livro-razão\)', js_row)
if marca:
    M['pesquisa']['preventDefault_no_ramo_da_fila'] = len(re.findall(r'preventDefault\(', js_row[marca.end():]))
else:
    falha('municipios.js: a marca do ramo da fila desapareceu')

# ---------------------------------------------------- 2 · a habitação e a agenda
def cartao_com_media(pagina, titulo):
    """O MESMO predicado do BRIEF-R1.py: cartões com o título que trazem «União Europeia» antes do cartão seguinte."""
    n = 0
    for m in re.finditer(re.escape(titulo), pagina):
        fim = pagina.find('<article', m.end())
        if 'União Europeia' in pagina[m.end():fim if fim > 0 else len(pagina)]:
            n += 1
    return n


TITULO_HAB = 'Sobrecarga do custo da habitação'
M['habitacao'] = {
    'cartao_com_media_europeia_primeira': cartao_com_media(copia('index.html'), TITULO_HAB),
    'cartao_com_media_europeia_temas': cartao_com_media(copia('temas_index.html'), TITULO_HAB),
    'cartoes_da_primeira_com_media_europeia': sum(1 for a in copia('index.html').split('<article')[1:] if 'União Europeia' in a),
    'antes_na_primeira': ANTES.get('cartao_da_habitacao_com_media_europeia'),
}
ue_yml = mostra('HEAD', 'ledger/claims/sobrecarga-do-custo-da-habitacao-2025-ue.yml')
ue_valor = re.search(r'^value: "([^"]+)"', ue_yml, re.M).group(1)
recibo_hab = (RAIZ / 'dist/livro-razao/sobrecarga-do-custo-da-habitacao-2025/index.html').read_text(encoding='utf-8')
texto_recibo = re.sub(r'\s+', ' ', _html.unescape(re.sub(r'<[^>]+>', ' ', recibo_hab)))
M['habitacao']['valor_da_uniao'] = ue_valor
M['habitacao']['recibo_portugues_mostra_a_uniao_no_enquadramento'] = bool(re.search(r'enquadramento.*?União Europeia\s+' + re.escape(ue_valor), texto_recibo))
agenda_depois = mostra('HEAD', 'src/data/agenda.json')
agenda_antes = mostra(PARTIDA, 'src/data/agenda.json')
M['agenda'] = {
    'a_primeira_pagina_ja_diz': {'antes': agenda_antes.count('a primeira página já diz'), 'depois': agenda_depois.count('a primeira página já diz')},
    'nao_publica_hoje_a_media': {'antes': agenda_antes.count('não publica hoje a média europeia'), 'depois': agenda_depois.count('não publica hoje a média europeia')},
    'frase_nova_da_ressalva': agenda_depois.count('Essa ressalva ainda não está nas páginas deste projeto'),
    'frase_nova_da_media': agenda_depois.count('A média europeia deste indicador deixou de se mostrar ao lado do valor português a 23.09.2026'),
    'frase_nova_na_pagina_da_agenda': copia('agenda_index.html').count('Essa ressalva ainda não está nas páginas deste projeto'),
}
cal_a = json.loads(mostra(PARTIDA, 'src/data/calendario.json') or '{}')
cal_d = json.loads(mostra('HEAD', 'src/data/calendario.json') or '{}')
ev_a = {e['id']: e for e in cal_a.get('eventos', [])}
ev_d = {e['id']: e for e in cal_d.get('eventos', [])}
novos = sorted(set(ev_d) - set(ev_a))
M['calendario_trazido'] = {
    'eventos_antes': len(ev_a), 'eventos_depois': len(ev_d), 'novos': novos,
    'mudados': sorted(k for k in set(ev_a) & set(ev_d) if ev_a[k] != ev_d[k]),
    'saidos': sorted(set(ev_a) - set(ev_d)),
    'chave_saidas_nova': 'saidas' in cal_d and 'saidas' not in cal_a,
    'excerto_do_novo_comeca_pela_marca_do_motor': [ev_d[k]['origem_da_data']['excerto'].startswith('[verify]') for k in novos],
    'marca_na_pagina_da_agenda': copia('agenda_index.html').count('[verify] no Eurostat'),
}
M['calendario_trazido']['mudados_n'] = len(M['calendario_trazido']['mudados'])

# --------------------------------------------------- 3 · «O que mudou» na língua do leitor
PALAVRAS = {
    'pt': re.compile(r'(?<![^\W\d_-])(recibos?|cart(?:ão|ões)|livro-razão|excertos?|linhas?)(?![^\W\d_-])', re.I),
    'en': re.compile(r'(?<![^\W\d_-])(receipts?|cards?|ledger|excerpts?|rows?|lines?)(?![^\W\d_-])', re.I),
}
PREDICADO_DO_BRIEF = re.compile(r'\brecibos?\b|\bcart(ão|ões)\b')   # o do BRIEF-R1.py, só nos textos portugueses


def mudancas(fonte):
    blocos = re.findall(r"\n  \{\n(.*?)\n  \},?", fonte, re.S)
    m4, brief_ = set(), set()
    for b in blocos:
        ident = re.search(r"id: '([^']+)'", b).group(1)
        for lang in ('pt', 'en'):
            m = re.search(rf"\n      {lang}: (\[.*?\n      \]|'(?:[^'\\]|\\.)*')", b, re.S)
            texto = ' '.join(re.findall(r"'((?:[^'\\]|\\.)*)'", m.group(1))) if m else ''
            if PALAVRAS[lang].search(texto):
                m4.add(ident)
            if lang == 'pt' and PREDICADO_DO_BRIEF.search(texto):
                brief_.add(ident)
    return {'declaradas': len(blocos), 'com_palavras_m4': len(m4), 'com_palavras_brief': len(brief_), 'quais_m4': sorted(m4)}


M['mudancas'] = {'depois': mudancas(mostra('HEAD', 'src/data/mudancas-do-projeto.mjs')),
                 'antes': mudancas(mostra(PARTIDA, 'src/data/mudancas-do-projeto.mjs')),
                 'brief_antes_declaradas': ANTES.get('mudancas_declaradas'), 'brief_antes_com_palavras': ANTES.get('mudancas_com_palavras_internas'),
                 'conhecido_positivo': bool(PALAVRAS['pt'].search('saíram dos recibos e dos cartões'))}

# ------------------------------------------------------------- 4 · a lista dos estudos
def lista_dos_estudos(pagina):
    itens = re.findall(r'<article class="arquivo-item estudo-item" data-estudo="([^"]+)".*?</article>', pagina, re.S)
    corpos = re.findall(r'(<article class="arquivo-item estudo-item".*?</article>)', pagina, re.S)
    datas = [re.search(r'<time datetime="([^"]+)"', c).group(1) for c in corpos]
    metas = [re.findall(r'<p class="estudo-meta"><span>([^<]+)</span><span>([^<]+)</span>', c) for c in corpos]
    return {
        'entradas': len(itens),
        'datas_da_mais_recente_para_a_mais_antiga': all(datas[i] >= datas[i + 1] for i in range(len(datas) - 1)),
        'mais_recente': datas[0] if datas else None,
        'mais_antiga': datas[-1] if datas else None,
        'com_lugar_e_tema': sum(1 for m in metas if m and m[0][0].strip() and m[0][1].strip()),
        'de_evora': sum(1 for m in metas if m and m[0][0] == 'Évora'),
        'seccao_por_lugar': pagina.count('id="por-lugar"'),
        'contagens_por_lugar': pagina.count('data-prova="estudos_lugar_'),
    }


M['estudos'] = {'pt': lista_dos_estudos(copia('estudos_index.html')), 'en': lista_dos_estudos(copia('en_studies_index.html')),
                'antes_seccao_por_lugar_na_vista': ANTES.get('estudos_seccao_por_lugar'),
                'depois_seccao_por_lugar_na_vista': mostra('HEAD', 'src/views/EstudosView.astro').count('id="por-lugar"')}

# ------------------------------------------------------------------- 5 · o rótulo
def conta_rotulo(dist):
    paginas = topo_um = topo_mais = rodape = fichas = 0
    sem_topo = []
    for f in dist.rglob('*.html'):
        t = f.read_text(encoding='utf-8', errors='replace')
        paginas += 1
        n = t.count('data-rotulo-ia="topo"')
        topo_um += n == 1
        topo_mais += n > 1
        rodape += t.count('data-rotulo-ia="rodape"') > 0
        fichas += t.count('data-ficha-primeira-pagina')
        if n == 0:
            sem_topo.append(str(f.relative_to(dist)))
    # Os que ficam sem rótulo têm de ser, todos, os documentos alojados, que se
    # servem byte a byte e não passam pela Base.astro.
    alojados = [s for s in sem_topo if s.endswith(('/documento/index.html', '/document/index.html'))]
    if len(alojados) != len(sem_topo):
        falha(f'páginas sem rótulo que não são documentos alojados: {sorted(set(sem_topo) - set(alojados))[:5]}')
    return {'ficheiros_html': paginas, 'com_um_topo': topo_um, 'com_mais_de_um_topo': topo_mais, 'com_rodape': rodape, 'fichas': fichas,
            'sem_topo': len(sem_topo), 'sem_topo_que_sao_documentos_alojados': len(alojados)}


M['rotulo'] = {'no_dist': conta_rotulo(RAIZ / 'dist'),
               'vistas_com_o_rotulo_no_topo': len([l for l in git('grep', '-l', 'onde="topo"', 'HEAD', '--', 'src').splitlines() if l]),
               'antes_vistas_com_o_rotulo_no_topo': ANTES.get('vistas_com_o_rotulo_no_topo')}

# ------------------------------------------------ 6 · as duas definições, e a origem
fig = mostra('HEAD', 'src/data/figuras.mjs')
resposta = (AQUI / 'motor' / 'eurostat-tipspd30-PT-PC_GDP.json').read_bytes()
corpo = json.loads(resposta)
rotulo_da_resposta = corpo.get('label')
setor = corpo.get('dimension', {}).get('sector', {}).get('category', {}).get('label', {})
excerto = re.search(r"'eurostat-tipspd30': \{.*?excerto: '([^']+)'", fig, re.S)
pedido = json.loads((AQUI / 'motor' / 'pedidos-tipspd30.jsonl').read_text(encoding='utf-8').splitlines()[0])
M['definicoes'] = {
    'sigla_por_verificar': fig.count('por extenso da sigla permanece '),
    'antes_sigla_por_verificar': ANTES.get('definicoes_com_sigla_por_verificar'),
    'sociedades_nao_financeiras_nas_definicoes': fig.count('sociedades não financeiras'),
    'origem_excerto_igual_ao_rotulo_da_resposta': bool(excerto) and excerto.group(1) == rotulo_da_resposta,
    'rotulo_da_resposta': rotulo_da_resposta,
    'setor_da_resposta': setor,
    'resposta_sha256': sha(resposta),
    'resposta_sha256_no_pedido': pedido['sha256'],
    'resposta_bytes': len(resposta),
    'pedido_http': pedido['http'],
    'pedido_hora_utc': pedido['timestamp_utc'],
    'cliente': pedido['cliente'],
}
if M['definicoes']['resposta_sha256'] != pedido['sha256']:
    falha('a cópia da resposta do Eurostat não tem o sha256 do pedido')

# ------------------------------------------------------- 7 · o título do recibo
RE_COLADO = re.compile(r'linha-valor-num">[^<]*</span><span class="campo-valor')   # o do BRIEF-R1.py
M['titulo_do_recibo'] = {'colados_no_recibo_de_mourao': len(RE_COLADO.findall(copia('livro-razao_mourao-desemprego-registado-2025-12_index.html'))),
                         'antes': ANTES.get('recibo_valor_e_unidade_colados')}
# O MESMO padrão, em todas as páginas de linha das duas edições do dist/.
titulos = colados = 0
for pasta in ('livro-razao', 'en/ledger'):
    for f in (RAIZ / 'dist' / pasta).glob('*/index.html'):
        h1 = re.search(r'<h1 class="linha-valor[^"]*">(.*?)</h1>', f.read_text(encoding='utf-8', errors='replace'), re.S)
        if not h1:
            continue
        titulos += 1
        colados += bool(RE_COLADO.search(h1.group(1)))
M['titulo_do_recibo']['titulos_de_linha_no_dist'] = titulos
M['titulo_do_recibo']['colados_no_dist'] = colados
if titulos == 0:
    falha('nenhum título de página de linha encontrado no dist/: o padrão não viu nada')

# ------------------------------------------------------------- 8 · a cor de estado
RE_ESTADO = re.compile(r'\b(sq-fora|sq-dentro|est-fora|est-dentro|barra-fora|barra-dentro)\b')   # o do BRIEF-R1.py
M['cor_de_estado'] = {
    'primeira_pagina': len(RE_ESTADO.findall(copia('index.html'))),
    'temas': len(RE_ESTADO.findall(copia('temas_index.html'))),
    'pagina_europeia': len(RE_ESTADO.findall(copia('uniao-europeia_index.html'))),
    'antes': {'primeira_pagina': ANTES.get('cor_de_estado_na_primeira_pagina'), 'temas': ANTES.get('cor_de_estado_nos_temas'),
              'pagina_europeia': ANTES.get('cor_de_estado_na_pagina_europeia')},
    'referencias_pintadas_primeira': len(re.findall(r'data-regua="referencia" data-estado="(?:fora|dentro)"', copia('index.html'))),
    'referencias_pintadas_temas': len(re.findall(r'data-regua="referencia" data-estado="(?:fora|dentro)"', copia('temas_index.html'))),
}
# A PRIMEIRA PÁGINA NÃO TEM CARTÕES COM VALOR DE REFERÊNCIA, e é isso que o seu
# zero mede (o ponto em que o brief se engana, dito no relatório): contam-se os
# cartões de cada página, os que declaram um limiar em `figuras.mjs` (lido pelo
# próprio módulo, com o node) e os itens da referência que a régua rende.
limiares = subprocess.run(['node', '-e', "import('./src/data/figuras.mjs').then(m=>console.log(JSON.stringify(m.FIGURAS.filter(f=>f.limiar).map(f=>f.claim))))"],
                          cwd=RAIZ, capture_output=True, text=True)
com_limiar = set(json.loads(limiares.stdout)) if limiares.returncode == 0 else set()
if not com_limiar:
    falha('não consegui ler as medidas com limiar de figuras.mjs')
for chave, nome in (('primeira', 'index.html'), ('temas', 'temas_index.html')):
    pagina = copia(nome)
    main = pagina.split('<main', 1)[1] if '<main' in pagina else ''
    cartoes = re.findall(r'data-cartao-medida="([^"]+)"', main)
    M['cor_de_estado'][f'cartoes_{chave}'] = len(cartoes)
    M['cor_de_estado'][f'cartoes_{chave}_com_limiar'] = sum(1 for c in cartoes if c in com_limiar)
    M['cor_de_estado'][f'itens_da_referencia_{chave}'] = main.count('data-regua="referencia"')
    M['cor_de_estado'][f'valor_de_referencia_escrito_{chave}'] = len(re.findall(r'valor de referência', _html.unescape(re.sub(r'<[^>]+>', ' ', main))))
antes_primeira = ler(COPIAS_ANTES / 'index.html')
main_antes = antes_primeira.split('<main', 1)[1]
M['cor_de_estado']['cartoes_primeira_antes'] = len(re.findall(r'data-cartao-medida="([^"]+)"', main_antes))
M['cor_de_estado']['cartoes_primeira_antes_com_limiar'] = sum(1 for c in re.findall(r'data-cartao-medida="([^"]+)"', main_antes) if c in com_limiar)
M['cor_de_estado']['medidas_com_limiar'] = len(com_limiar)
contraste = ler(AQUI / 'contraste-depois.txt') if (AQUI / 'contraste-depois.txt').exists() else ''
m_c = re.findall(r'(\d+) falhas de texto · (\d+) objeto\(s\) de interface abaixo de 3:1', re.sub(r'\x1b\[[0-9;]*m', '', contraste))
M['cor_de_estado']['contraste'] = [{'falhas_de_texto': int(a), 'interface_abaixo_de_3': int(b)} for a, b in m_c]

# ----------------------------------------------------------------- 9 · a frescura
def frescura_no_dist(raiz):
    com = sem = 0
    for f in raiz.glob('*/index.html'):
        t = f.read_text(encoding='utf-8', errors='replace')
        if 'class="cartao-medida"' not in t:
            continue
        if 'cartao-medida-frescura' in t:
            com += 1
        else:
            sem += 1
    return {'paginas_com_a_frase': com, 'paginas_sem': sem}


def texto_da_frescura(pagina):
    m = re.search(r'<span class="cartao-medida-periodo">(.*?)</span>\s*</p>', pagina, re.S)
    blocos = re.findall(r'<span class="cartao-medida-frescura".*?</span>\)</span>', pagina, re.S)
    limpo = [re.sub(r'\s+', ' ', _html.unescape(re.sub(r'<[^>]+>', '', b))).strip() for b in blocos]
    return limpo


M['frescura'] = {'pt': frescura_no_dist(RAIZ / 'dist' / 'municipios'), 'en': frescura_no_dist(RAIZ / 'dist' / 'en' / 'municipalities'),
                 'mourao_pt': texto_da_frescura(copia('municipios_mourao_index.html')),
                 'mourao_en': texto_da_frescura(copia('en_municipalities_mourao_index.html')),
                 'cartoes_de_mourao': len(re.findall(r'<article class="cartao-medida"', copia('municipios_mourao_index.html'))),
                 'cartoes_de_mourao_antes': ANTES.get('cartoes_do_concelho')}

# ---------------------------------------------------------------- 10 · o Portal BASE
met = mostra('HEAD', 'src/data/metodo.mjs')
M['base'] = {
    'frase_antiga_no_metodo': met.count('Uma fonte, o Portal BASE'),
    'antes_frase_antiga': ANTES.get('metodo_frase_do_base'),
    'frase_nova_pt_na_pagina': copia('metodo_index.html').count('Nenhuma fonte é lida com a identidade de um navegador'),
    'frase_nova_en_na_pagina': copia('en_method_index.html').count('No source is read with the identity of a browser'),
    'decisao': re.search(r'^### (1\.\d+) O Portal BASE caído', mostra('HEAD', 'DECISIONS.md'), re.M).group(1),
    'amarra': re.search(r'\*\*Texto:\*\* metodo ([0-9a-f]{12})', mostra('HEAD', 'DECISIONS.md').split('### 1.126', 1)[1]).group(1),
}

# ------------------------------------------------ 11 e 12 · a notificação e a leitura
ids_ine = ['divida-publica-2025-notificacao-ine-2026-09', 'divida-publica-2024-notificacao-ine-2026-09',
           'saldo-das-administracoes-publicas-2025-notificacao-ine-2026-09']
linhas_ine = {}
for i in ids_ine:
    y = mostra('HEAD', f'ledger/claims/{i}.yml')
    campo = lambda c: (re.search(rf'^{c}: "([^"]*)"', y, re.M) or [None, None])[1]
    linhas_ine[i] = {'value': campo('value'), 'unit': campo('unit'), 'published_at': campo('published_at'),
                     'reference_date': campo('reference_date'), 'source': campo('source'),
                     'paginas_no_dist': sum((RAIZ / 'dist' / p / i / 'index.html').exists() for p in ('livro-razao', 'en/ledger'))}
M['notificacao'] = {'linhas': linhas_ine, 'linhas_n': len(linhas_ine),
                    'paginas_no_dist': sum(v['paginas_no_dist'] for v in linhas_ine.values())}
xa = json.loads(mostra(PARTIDA, 'ledger/cruzamentos/dominios.json') or '{}').get('rows', {})
xd = json.loads(mostra('HEAD', 'ledger/cruzamentos/dominios.json') or '{}').get('rows', {})
mud_x = [k for k in set(xa) & set(xd) if xa[k] != xd[k]]
campos_x = sorted({c for k in mud_x for c in set(xa[k]) | set(xd[k]) if xa[k].get(c) != xd[k].get(c)})
M['notificacao']['cruzamento'] = {'antes': len(xa), 'depois': len(xd), 'novas': sorted(set(xd) - set(xa)), 'mudadas': len(mud_x),
                                  'campos_mudados': campos_x}


def leitura(pagina):
    m = re.search(r'<p class="pais-leitura" data-leitura-pais="[a-z]+">(.*?)</p>', pagina, re.S)
    corpo_ = m.group(1) if m else ''
    ids = re.findall(r'data-claim="([^"]+)"', corpo_)
    data = re.search(r'data-de-linha="divida-publica-2025-notificacao-ine-2026-09" data-de-campo="published_at">([^<]+)<', corpo_)
    return {'linhas_seladas': ids, 'linhas_seladas_n': len(ids), 'as_duas_do_ine': sum(1 for i in ids if i.endswith('-notificacao-ine-2026-09')),
            'data_da_notificacao': data.group(1) if data else None}


M['leitura'] = {'pt': leitura(copia('index.html')), 'en': leitura(copia('en_index.html'))}
pais_mjs = mostra('HEAD', 'src/lib/pais.mjs')
lista = re.search(r'export const LINHAS_DA_LEITURA_DO_PAIS = \[(.*?)\];', pais_mjs, re.S)
M['leitura']['lista_fechada'] = len(re.findall(r"'([a-z0-9-]+)'", lista.group(1))) if lista else None
lista_a = re.search(r'export const LINHAS_DA_LEITURA_DO_PAIS = \[(.*?)\];', mostra(PARTIDA, 'src/lib/pais.mjs'), re.S)
M['leitura']['lista_fechada_antes'] = len(re.findall(r"'([a-z0-9-]+)'", lista_a.group(1))) if lista_a else None
conta_linhas = lambda ref: len([l for l in git('ls-tree', '--name-only', f'{ref}:ledger/claims').splitlines() if l.endswith('.yml')])
M['livro_razao'] = {'linhas_antes': conta_linhas(PARTIDA), 'linhas_depois': conta_linhas('HEAD')}
M['mudanca_declarada'] = {
    'na_primeira_pt': copia('index.html').count('data-mudanca-id="notificacao-ine-divida-2026-09-23"'),
    'na_primeira_en': copia('en_index.html').count('data-mudanca-id="notificacao-ine-divida-2026-09-23"'),
    'no_registo_pt': copia('correcoes_index.html').count('notificacao-ine-divida-2026-09-23'),
    'valor_selado_pt': bool(re.search(r'data-mudanca-id="notificacao-ine-divida-2026-09-23".*?data-claim="divida-publica-2025-notificacao-ine-2026-09"[^>]*>89,2<', copia('index.html'), re.S)),
}

# ----------------------------------------------------------------- as plantas
pp = js('plantas-pais.json') or []
M['plantas_pais'] = {'corridas': len(pp), 'passaram': sum(1 for p in pp if p['passou']),
                     'do_r1': [f"{p['celula']} · {p['nome']}" for p in pp if p['celula'] in ('M4', 'T9', 'E2', 'L2')]}
M['plantas_pais']['do_r1_n'] = len(M['plantas_pais']['do_r1'])
po = js('plantas-portoes-r1.json') or []
M['plantas_portoes_r1'] = {'corridas': len(po), 'passaram': sum(1 for p in po if p['passou']),
                           'repostas': sum(1 for p in po for f in p['ficheiros'] if f['antes'] == f['reposto']),
                           'ficheiros': sum(len(p['ficheiros']) for p in po),
                           'nomes': [p['nome'] for p in po]}
alv = {}
for nome in ('alvos-plantas-r1.json',):
    d = js(nome)
    if d:
        for p in d.get('plantas', []):
            alv[p['nome']] = {'bom': p['bom'], 'caiu': p['caiu'], 'mudou': p['mudou']}
M['plantas_alvos'] = {'plantas': alv, 'corridas': len(alv), 'boas': sum(1 for v in alv.values() if v['bom'])}
if (AQUI / 'alvos-plantas-r1.json').exists():
    d = js('alvos-plantas-r1.json')
    M['plantas_alvos']['celulas_limpas'] = {c['nome']: c['passa'] for c in d.get('celulas', [])} if isinstance(d.get('celulas'), list) else None
cp = AQUI / 'cartao-prova.txt'
if cp.exists():
    t = re.sub(r'\x1b\[[0-9;]*m', '', cp.read_text(encoding='utf-8'))
    m = re.search(r'prova: (\d+) estragos plantados, (\d+) vistos', t)
    k14 = re.search(r'cartões com a média europeia calada \(K14\)\s+(\d+)', t)
    M['plantas_cartao'] = {'estragos': int(m.group(1)) if m else None, 'vistos': int(m.group(2)) if m else None,
                           'k14_cartoes_calados': int(k14.group(1)) if k14 else None,
                           'codigo': int(re.search(r'^codigo (\d+)', t, re.M).group(1)) if re.search(r'^codigo (\d+)', t, re.M) else None}
else:
    falha('falta cartao-prova.txt')
motor = js('motor/motor.json')
M['motor'] = motor

# ----------------------------------------------------------------- as capturas
ca = js('capturas-antes.json') or {'resultados': []}
cd = js('capturas-depois.json') or {'resultados': []}
M['capturas'] = {'antes': len(ca['resultados']), 'depois': len(cd['resultados']),
                 'depois_com_deslocamento': sum(1 for r in cd['resultados'] if r['deslocamento'] > 0),
                 'depois_lugares_mour_resultados': sorted({r['resultadosVisiveis'] for r in cd['resultados'] if r['familia'] == 'lugares-mour'}),
                 'antes_lugares_mour_resultados': sorted({r['resultadosVisiveis'] for r in ca['resultados'] if r['familia'] == 'lugares-mour'}),
                 'depois_rotulo_no_topo': sorted({r['rotuloTopo'] for r in cd['resultados']}),
                 'antes_rotulo_no_topo': sorted({r['rotuloTopo'] for r in ca['resultados']}),
                 'depois_cores_de_estado_na_primeira_390': [r['coresDeEstado'] for r in cd['resultados'] if r['familia'] == 'primeira' and r['largura'] == 390 and r['lingua'] == 'pt'],
                 'larguras': cd.get('larguras')}

# ---------------------------------------------------------------------- a L1
l1 = js('l1-r1.json') or {'contagens': {}}
M['l1'] = l1.get('contagens')
M['l1']['teto'] = json.loads(ler(RAIZ / 'scripts/lugar-tetos-b1.json'))['l1_paginas']

# ------------------------------------------------------------ o inventário das frases
inv = mostra('HEAD', 'design/especime-v3/INVENTARIO-FRASES.md')
linhas_inv = [[c.strip() for c in l.strip().strip('|').split('|')] for l in inv.splitlines() if l.startswith('| ') and l.count('|') >= 6]
seccao = inv.split('## As frases do bloco R1', 1)[1] if '## As frases do bloco R1' in inv else ''
M['inventario'] = {'r1_novas_na_seccao': sum(1 for l in seccao.splitlines() if l.startswith('| conteudo |') or l.startswith('| navegacao |')),
                   'r1_vivas': sum(1 for c in linhas_inv if len(c) >= 5 and c[2] == 'r1' and c[3] == 'viva'),
                   'r1_retiradas': sum(1 for c in linhas_inv if len(c) >= 5 and c[2] == 'r1' and c[3] == 'retirada'),
                   'contagens_do_livro': [c[1] for c in linhas_inv if len(c) >= 5 and c[1].startswith('2978 ')]}

# ------------------------------------------------------- os três portões na cabeça final
def portao(nome):
    p = AQUI / 'portoes'
    if not (p / f'{nome}.codigo').exists():
        return 'por correr'
    lido = lambda s: (p / f'{nome}.{s}').read_text(encoding='utf-8').strip()
    from datetime import datetime
    ini, fim = lido('inicio'), lido('fim')
    seg = int((datetime.fromisoformat(fim.replace('Z', '+00:00')) - datetime.fromisoformat(ini.replace('Z', '+00:00'))).total_seconds())
    return {'codigo': int(lido('codigo')), 'inicio': ini, 'fim': fim, 'segundos': seg, 'minutos': seg // 60, 'resto_segundos': seg % 60,
            'cabeca': lido('cabeca')}


M['portoes'] = {n: portao(n) for n in ('build', 'verify', 'typecheck')}
g = AQUI / 'portoes' / 'build.log'
if g.exists():
    t = re.sub(r'\x1b\[[0-9;]*m', '', g.read_text(encoding='utf-8'))
    r = re.search(r'rótulo de IA · (\d+) no topo \(de (\d+) páginas fora dos documentos alojados\) · (\d+) no rodapé · (\d+) ficha', t)
    ti = re.search(r'(\d+) páginas de linha · (\d+) títulos de linha com o valor e a unidade separados', t)
    pg = re.search(r'portão de HTML · (\d+) páginas', t)
    fr = re.search(r'F17[^\n]*?(\d+) cart', t)
    M['portoes']['gate_html'] = {
        'rotulo_topo': int(r.group(1)) if r else None, 'paginas_fora_dos_documentos': int(r.group(2)) if r else None,
        'rotulo_rodape': int(r.group(3)) if r else None, 'fichas': int(r.group(4)) if r else None,
        'paginas_de_linha': int(ti.group(1)) if ti else None, 'titulos_separados': int(ti.group(2)) if ti else None,
        'paginas': int(pg.group(1)) if pg else None,
    }
    for rx, chave in ((r'T9: (\d+) cartões com valor de referência na primeira página e nos temas, (\d+) fora e (\d+) dentro', 't9'),
                      (r'E2[^\n]*?(\d+) estudos', 'e2')):
        m = re.search(rx, t)
        if m:
            M['portoes'][chave] = [int(x) for x in m.groups()]
    m = re.search(r'voz ✓ .*?(\d+) linhas do inventário com bloco \((\d+) vivas, todas rendidas; (\d+) retiradas', t)
    if m:
        M['portoes']['voz_inventario'] = [int(x) for x in m.groups()]
v = AQUI / 'portoes' / 'verify.log'
if v.exists():
    t = re.sub(r'\x1b\[[0-9;]*m', '', v.read_text(encoding='utf-8'))
    m = re.search(r'H14\s+(\d+) passagens de todas as famílias com o rótulo de IA no topo: (\d+) sem linha única', t)
    h15 = re.search(r'H15\s+pt@390: vazio (\d+) · «mour» (\d+) à vista', t)
    l1v = re.search(r'L1 · páginas com dois destinos iguais fora da mobília\s+(\d+)\s+\(teto (\d+)\)', t)
    k14 = re.search(r'cartões com a média europeia calada \(K14\)\s+(\d+)', t)
    M['portoes']['verify_celulas'] = {
        'h14': [int(x) for x in m.groups()] if m else None,
        'h15_pt_390': [int(x) for x in h15.groups()] if h15 else None,
        'l1': [int(x) for x in l1v.groups()] if l1v else None,
        'k14': int(k14.group(1)) if k14 else None,
    }

mapa = ler(AQUI / 'conferir-mapa.txt') if (AQUI / 'conferir-mapa.txt').exists() else ''
m_perto = re.search(r'citações conferidas na linha citada \(±7\): (\d+)', mapa)
m_longe = re.search(r'citação está no ficheiro, mas longe da linha citada: (\d+)', mapa)
M['mapa'] = {'citacoes_no_sitio': int(m_perto.group(1)) if m_perto else None, 'citacoes_que_andaram': int(m_longe.group(1)) if m_longe else None}
if not m_perto or not m_longe:
    falha('conferir-mapa.txt: não li as contagens')

M['falhas'] = FALHAS
(AQUI / 'medidas.json').write_text(json.dumps(M, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'medidas.json escrito: {len(M)} secções; {len(FALHAS)} falha(s).')
for f in FALHAS:
    print('  FALHA', f)
sys.exit(1 if FALHAS else 0)
