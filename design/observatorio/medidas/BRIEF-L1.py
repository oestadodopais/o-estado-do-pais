#!/usr/bin/env python3
"""As medições do §0 do `BRIEF-L1-a-leitura-de-cada-medida.md`.

uso: python3 design/observatorio/medidas/BRIEF-L1.py      (na raiz do repositório)

Escreve `design/observatorio/medidas/BRIEF-L1.json` (ou o caminho de
`OEDP_MEDIDAS_JSON`, que é como o `scripts/check-briefs.py` o corre) e imprime o
mesmo JSON. Cada medição traz o nome por que o §0 a cita, o valor, o comando e um
conhecido-positivo do MESMO predicado (M5, §1.122).

CADA MEDIÇÃO É ESTÁVEL DE PROPÓSITO. As fontes leem-se na cabeça que estava no ar
na manhã de 24.09.2026, `f672bd38` (a peça 1 do B2 aterrada, §1.129), por
`git show`. As páginas construídas leem-se das cópias congeladas que a peça 1
deixou no repositório, `design/especime-v3/medicoes/b2-2026-09-23/paginas-depois-peca1/`,
construídas da cabeça `7110ca60` (o ficheiro `capturas-depois-peca1.cabeca` di-lo)
e presas pelo sha256 escrito no ficheiro. As duas cabeças rendem as mesmas
páginas, e isso mede-se aqui em vez de se supor: entre `7110ca60` e `f672bd38`
nenhum ficheiro que a construção leia mudou (o único ficheiro mudado nas pastas de
código é um prompt das leituras a frio, que a construção não lê). A CI clona com
`fetch-depth: 0`, por isso o `git show` de uma cabeça antiga corre lá como aqui.
"""
import hashlib
import json
import os
import re
import subprocess
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
CABECA = 'f672bd38'
CABECA_ANTERIOR = '97e84232'  # a cabeça de partida da peça 1, para os conhecidos-positivos do diff
PASTA_DAS_COPIAS = 'design/especime-v3/medicoes/b2-2026-09-23/paginas-depois-peca1'
COPIAS = os.path.join(RAIZ, PASTA_DAS_COPIAS)
FICHEIRO_DA_CABECA_DAS_COPIAS = os.path.join(RAIZ, 'design/especime-v3/medicoes/b2-2026-09-23/capturas-depois-peca1.cabeca')
COMANDO = 'python3 design/observatorio/medidas/BRIEF-L1.py'
PASTAS_QUE_A_CONSTRUCAO_LE = ['src', 'public', 'ledger', 'scripts', 'tests', 'package.json', 'astro.config.mjs']


def git(*args):
    r = subprocess.run(['git', *args], cwd=RAIZ, capture_output=True)
    if r.returncode != 0:
        sys.stderr.write(f'git {" ".join(args)} falhou: {r.stderr.decode("utf-8", "replace")}\n')
        sys.exit(2)
    return r.stdout.decode('utf-8')


def mostra(caminho, cabeca=CABECA):
    """O ficheiro tal como estava na cabeça que estava no ar."""
    return git('show', f'{cabeca}:{caminho}')


def existe_na_cabeca(cabeca):
    return subprocess.run(['git', 'cat-file', '-e', f'{cabeca}^{{commit}}'], cwd=RAIZ, capture_output=True).returncode == 0


def copia(nome):
    with open(os.path.join(COPIAS, nome), 'rb') as f:
        b = f.read()
    return b.decode('utf-8'), hashlib.sha256(b).hexdigest()


medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({'nome': nome, 'valor': valor, 'comando': comando,
                    'conhecido_positivo': {'o_que': o_que, 'encontrado': bool(encontrado)}})


# --- 0 · as cabeças e as cópias, presas pelo sha256
medicao('cabeca_lida', CABECA, f'git cat-file -e {CABECA}^{{commit}}', 'a cabeça existe no repositório', existe_na_cabeca(CABECA))
with open(FICHEIRO_DA_CABECA_DAS_COPIAS, encoding='utf-8') as f:
    cabeca_das_copias = f.read().strip()[:8]
medicao('cabeca_das_copias', cabeca_das_copias, f'cat design/especime-v3/medicoes/b2-2026-09-23/capturas-depois-peca1.cabeca (os 8 primeiros caracteres)',
        'a cabeça existe no repositório', existe_na_cabeca(cabeca_das_copias))


def ficheiros_mudados(de, ate):
    saida = git('diff', '--name-only', de, ate, '--', *PASTAS_QUE_A_CONSTRUCAO_LE)
    return [l for l in saida.splitlines() if l and not l.startswith('scripts/leituras/')]


mudados = ficheiros_mudados(cabeca_das_copias, CABECA)
medicao('ficheiros_que_a_construcao_le_mudados_entre_as_copias_e_a_cabeca', len(mudados),
        f'git diff --name-only {cabeca_das_copias} {CABECA} -- {" ".join(PASTAS_QUE_A_CONSTRUCAO_LE)}, sem scripts/leituras/',
        f'o mesmo diff entre {CABECA_ANTERIOR} e {CABECA} apanha ficheiros', len(ficheiros_mudados(CABECA_ANTERIOR, CABECA)) > 0)

copias = {}
for chave, nome in (('temas', 'temas_index.html'), ('primeira', 'index.html'),
                    ('en_temas', 'en_themes_index.html'), ('en_primeira', 'en_index.html')):
    texto, sha = copia(nome)
    copias[chave] = texto
    medicao(f'sha256_{chave}', sha, f'shasum -a 256 {PASTA_DAS_COPIAS}/{nome}',
            'o resumo é o do ficheiro lido agora', len(sha) == 64)

temas, primeira, en_temas, en_primeira = copias['temas'], copias['primeira'], copias['en_temas'], copias['en_primeira']
RE_ARTIGO = re.compile(r'<article class="cartao-medida"[^>]*>.*?</article>', re.S)
artigos = RE_ARTIGO.findall(temas)
artigos_primeira = RE_ARTIGO.findall(primeira)
artigos_en = RE_ARTIGO.findall(en_temas)


def ident(a):
    m = re.search(r'data-cartao-medida="([^"]+)"', a)
    return m.group(1) if m else ('camaras' if 'data-cartao-camaras' in a else None)


def artigo(id_):
    return next(a for a in artigos if ident(a) == id_)


# --- 1 · os cartões nacionais da página dos temas e da primeira página
medicao('cartoes_nacionais_nos_temas', len(artigos), f'{COMANDO} · <article class="cartao-medida"> em {PASTA_DAS_COPIAS}/temas_index.html',
        'o mesmo contador conta pelo menos um cartão na cópia da primeira página', len(artigos_primeira) >= 1)
de_linha = [a for a in artigos if 'data-cartao-medida="' in a]
medicao('cartoes_de_linha_nos_temas', len(de_linha), f'{COMANDO} · artigos com data-cartao-medida= na mesma cópia',
        'a lista traz o saldo das administrações públicas', any(ident(a) == 'saldo-das-administracoes-publicas-2025' for a in de_linha))
medicao('cartoes_das_camaras_nos_temas', sum(1 for a in artigos if 'data-cartao-camaras' in a), f'{COMANDO} · artigos com data-cartao-camaras na mesma cópia',
        'o mesmo predicado encontra o cartão das câmaras na cópia da primeira página', sum(1 for a in artigos_primeira if 'data-cartao-camaras' in a) == 1)
medicao('cartoes_nacionais_na_edicao_inglesa', len(artigos_en), f'{COMANDO} · <article class="cartao-medida"> em {PASTA_DAS_COPIAS}/en_themes_index.html',
        'as duas edições rendem o mesmo número de cartões', len(artigos_en) == len(artigos))
medicao('cartoes_na_primeira_pagina', len(artigos_primeira), f'{COMANDO} · <article class="cartao-medida"> em {PASTA_DAS_COPIAS}/index.html',
        'o mesmo contador conta os artigos dos temas', len(artigos) >= 1)

# --- 2 · a pergunta, a régua, a referência e o veredicto, cartão a cartão
com_pergunta = [ident(a) for a in artigos if 'data-cartao-definicao=' in a]
sem_pergunta = [ident(a) for a in artigos if 'data-cartao-definicao=' not in a]
medicao('cartoes_com_pergunta', len(com_pergunta), f'{COMANDO} · artigos com data-cartao-definicao= em temas_index.html',
        'o mesmo predicado vê a pergunta no cartão da dívida pública', 'divida-publica-2025' in com_pergunta)
medicao('cartoes_sem_pergunta', len(sem_pergunta), f'{COMANDO} · artigos sem data-cartao-definicao= na mesma cópia',
        'a lista traz o saldo e a disparidade salarial, os dois exemplos do diretor',
        'saldo-das-administracoes-publicas-2025' in sem_pergunta and 'disparidade-salarial-entre-sexos-2024' in sem_pergunta)
medicao('cartoes_sem_pergunta_lista', ', '.join(sem_pergunta), f'{COMANDO} · os identificadores desses artigos', 'a lista traz o cartão das câmaras', 'camaras' in sem_pergunta)
com_ref = [ident(a) for a in artigos if 'data-regua="referencia"' in a]
medicao('cartoes_com_valor_de_referencia', len(com_ref), f'{COMANDO} · data-regua="referencia" por artigo em temas_index.html',
        'o mesmo predicado vê a referência no cartão da dívida pública', 'divida-publica-2025' in com_ref)
fora = [ident(a) for a in artigos if 'data-regua="referencia" data-estado="fora"' in a]
dentro = [ident(a) for a in artigos if 'data-regua="referencia" data-estado="dentro"' in a]
medicao('cartoes_fora_do_valor_de_referencia', len(fora), f'{COMANDO} · data-regua="referencia" data-estado="fora" por artigo', 'a lista traz a dívida pública', 'divida-publica-2025' in fora)
medicao('cartoes_fora_do_valor_de_referencia_lista', ', '.join(fora), f'{COMANDO} · os identificadores desses artigos', 'a lista traz os preços da habitação', 'precos-da-habitacao-2025' in fora)
medicao('cartoes_dentro_do_valor_de_referencia', len(dentro), f'{COMANDO} · data-regua="referencia" data-estado="dentro" por artigo', 'a lista traz o saldo', 'saldo-das-administracoes-publicas-2025' in dentro)
com_anterior = [ident(a) for a in artigos if 'data-regua="anterior"' in a]
com_ue = [ident(a) for a in artigos if 'data-regua="ue"' in a]
medicao('cartoes_com_periodo_anterior', len(com_anterior), f'{COMANDO} · data-regua="anterior" por artigo', 'a lista traz o saldo', 'saldo-das-administracoes-publicas-2025' in com_anterior)
medicao('cartoes_com_media_da_uniao', len(com_ue), f'{COMANDO} · data-regua="ue" por artigo', 'a lista traz a dívida pública', 'divida-publica-2025' in com_ue)
sem_regua = [ident(a) for a in de_linha if 'class="cartao-medida-regua"' not in a]
medicao('cartoes_de_linha_sem_regua', len(sem_regua), f'{COMANDO} · artigos de linha sem class="cartao-medida-regua"', 'o mesmo predicado vê a régua no saldo', 'class="cartao-medida-regua"' in artigo('saldo-das-administracoes-publicas-2025'))
medicao('cartoes_de_linha_sem_regua_lista', ', '.join(sem_regua), f'{COMANDO} · os identificadores desses artigos', 'a lista traz o ganho médio mensal', 'ganho-medio-mensal-2024' in sem_regua)
so_com_referencia = [i for i in com_ref if i not in com_anterior and i not in com_ue]
medicao('cartoes_so_com_referencia_e_sem_comparacao', len(so_com_referencia), f'{COMANDO} · artigos com referência e sem período anterior nem União',
        'o mesmo predicado vê que o saldo tem período anterior', 'saldo-das-administracoes-publicas-2025' in com_anterior)


def conta_classe(texto, classe):
    return len(re.findall(rf'class="{classe}"', texto))


medicao('cartoes_com_leitura', conta_classe(temas, 'cartao-medida-leitura'), f'{COMANDO} · class="cartao-medida-leitura" em temas_index.html',
        'o mesmo detetor, com a classe da pergunta, conta as perguntas', conta_classe(temas, 'cartao-medida-frase') == len(com_pergunta))
marcas = [len(re.findall(r'class="src-chip"', a)) for a in artigos]
medicao('marcas_da_fonte_por_cartao_maximo', max(marcas), f'{COMANDO} · class="src-chip" por artigo, o máximo', 'o saldo tem uma marca', len(re.findall(r'class="src-chip"', artigo('saldo-das-administracoes-publicas-2025'))) == 1)
medicao('marcas_da_fonte_por_cartao_minimo', min(marcas), f'{COMANDO} · o mesmo, o mínimo', 'o cartão das câmaras tem uma marca', len(re.findall(r'class="src-chip"', artigo('camaras'))) == 1)
valores_na_regua = sum(len(re.findall(r'data-claim="', re.search(r'<p class="cartao-medida-regua">.*?</p>', a, re.S).group(0))) for a in artigos if '<p class="cartao-medida-regua">' in a)
medicao('valores_de_linha_nas_reguas_dos_temas', valores_na_regua, f'{COMANDO} · data-claim= dentro de <p class="cartao-medida-regua"> por artigo, somados',
        'a régua do saldo tem um valor de linha', 'data-claim="saldo-das-administracoes-publicas-2024"' in artigo('saldo-das-administracoes-publicas-2025'))
perguntas_com_algarismos = sum(1 for a in artigos if (m := re.search(r'<p class="cartao-medida-frase"[^>]*>.*?</p>', a, re.S)) and re.search(r'\d', re.sub(r'<[^>]+>', '', m.group(0))))
medicao('perguntas_com_algarismos', perguntas_com_algarismos, f'{COMANDO} · perguntas cujo texto visível tem um algarismo', 'a pergunta da sobrecarga da habitação escreve 40', '40' in re.sub(r'<[^>]+>', '', re.search(r'<p class="cartao-medida-frase"[^>]*>.*?</p>', artigo('sobrecarga-do-custo-da-habitacao-inquilinos-mercado-2025'), re.S).group(0)))

# --- 3 · o inventário das 36 medidas, lido das cópias e do livro-razão na cabeça


def texto(html):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', html)).strip()


def campo_da_linha(id_, campo):
    m = re.search(rf'^{campo}: "([^"]*)"', mostra(f'ledger/claims/{id_}.yml'), re.M)
    return m.group(1) if m else None


inventario = []
for a in artigos:
    id_ = ident(a)
    nome = texto(re.search(r'class="cartao-medida-nome"[^>]*>(.*?)</span>', a, re.S).group(1))
    if id_ == 'camaras':
        inventario.append({'id': id_, 'nome': nome, 'valor': texto(re.search(r'data-prova="camaras_acima_do_limite"[^>]*>(.*?)</span>', a, re.S).group(1)),
                           'unidade': texto(re.search(r'cartao-medida-unidade"[^>]*>(.*?)</span>', a, re.S).group(1)), 'periodo': '2024',
                           'anterior': None, 'ue': None, 'referencia': None, 'estado': None, 'pergunta': False, 'chave_da_prova': True})
        continue
    ant = re.search(r'data-regua="anterior"[^>]*>.*?data-de-linha="([^"]+)".*?data-claim="([^"]+)"[^>]*>([^<]*)<', a, re.S)
    ue = re.search(r'data-regua="ue"[^>]*>.*?data-claim="([^"]+)"[^>]*>([^<]*)<', a, re.S)
    ref = re.search(r'<span class="veredicto-referencia[^"]*"[^>]*>(.*?)</span>\s*</span>', a, re.S)
    estado = re.search(r'data-regua="referencia" data-estado="(fora|dentro)"', a)
    inventario.append({
        'id': id_, 'nome': nome,
        'valor': campo_da_linha(id_, 'value'), 'unidade': campo_da_linha(id_, 'unit'), 'periodo': campo_da_linha(id_, 'reference_date'),
        'anterior': {'id': ant.group(2), 'periodo': campo_da_linha(ant.group(2), 'reference_date'), 'valor': ant.group(3).strip()} if ant else None,
        'ue': {'id': ue.group(1), 'valor': ue.group(2).strip()} if ue else None,
        'referencia': texto(ref.group(1)) if ref else None,
        'estado': estado.group(1) if estado else None,
        'pergunta': 'data-cartao-definicao=' in a,
        'chave_da_prova': False,
    })
medicao('inventario_das_medidas', inventario, f'{COMANDO} · um registo por artigo de temas_index.html, com o valor, a unidade e o período lidos de ledger/claims/<id>.yml@{CABECA} e a régua lida do artigo',
        'o registo do saldo diz 0,7 % do PIB em 2025 e o período anterior 2024', any(r['id'] == 'saldo-das-administracoes-publicas-2025' and r['valor'] == '0,7' and r['unidade'] == '% do PIB' and r['periodo'] == '2025' and r['anterior'] and r['anterior']['periodo'] == '2024' for r in inventario))
medicao('medidas_com_valor_negativo', sum(1 for r in inventario if str(r['valor']).startswith('−') or str(r['valor']).startswith('-')), f'{COMANDO} · registos do inventário cujo valor começa por um sinal de menos',
        'a posição de investimento internacional é negativa', any(r['id'] == 'posicao-de-investimento-internacional-2025' and str(r['valor']).startswith('−') for r in inventario))
medicao('medidas_de_variacao', sum(1 for r in inventario if r['unidade'] and 'variação' in r['unidade']), f'{COMANDO} · registos cuja unidade contém «variação»',
        'os preços da habitação são uma variação', any(r['id'] == 'precos-da-habitacao-2025' and 'variação' in (r['unidade'] or '') for r in inventario))
medicao('unidades_distintas', len({r['unidade'] for r in inventario}), f'{COMANDO} · unidades distintas do inventário', 'o conjunto traz «% do PIB»', '% do PIB' in {r['unidade'] for r in inventario})
for chave, id_ in (('saldo', 'saldo-das-administracoes-publicas-2025'), ('disparidade', 'disparidade-salarial-entre-sexos-2024')):
    r = next(x for x in inventario if x['id'] == id_)
    medicao(f'{chave}_valor', r['valor'], f'git show {CABECA}:ledger/claims/{id_}.yml · value', 'o valor lê-se como número', re.fullmatch(r'−?-?[\d ]+(,\d+)?', r['valor']) is not None)
    medicao(f'{chave}_unidade', r['unidade'], f'git show {CABECA}:ledger/claims/{id_}.yml · unit', 'a unidade não está vazia', bool(r['unidade']))
    medicao(f'{chave}_periodo', r['periodo'], f'git show {CABECA}:ledger/claims/{id_}.yml · reference_date', 'o período é um ano', re.fullmatch(r'\d{4}', r['periodo'] or '') is not None)
    medicao(f'{chave}_anterior_valor', r['anterior']['valor'] if r['anterior'] else None, f'{COMANDO} · o valor do item data-regua="anterior" do artigo', 'o valor lê-se como número', r['anterior'] is not None and re.fullmatch(r'−?-?[\d ]+(,\d+)?', r['anterior']['valor']) is not None)
    medicao(f'{chave}_anterior_periodo', r['anterior']['periodo'] if r['anterior'] else None, f'{COMANDO} · o reference_date da linha do item data-regua="anterior"', 'o período é um ano', r['anterior'] is not None and re.fullmatch(r'\d{4}', r['anterior']['periodo'] or '') is not None)
saldo = next(x for x in inventario if x['id'] == 'saldo-das-administracoes-publicas-2025')
medicao('saldo_veredicto', saldo['referencia'], f'{COMANDO} · o texto do veredicto do artigo do saldo', 'o veredicto diz «dentro»', 'dentro' in (saldo['referencia'] or ''))

# --- 4 · as declarações na cabeça: as referências, as origens, as perguntas auditadas, as palavras do estado
figuras = mostra('src/data/figuras.mjs')
referencias_mjs = mostra('src/data/referencias-das-medidas.mjs')
lista_pdm = figuras.split('const LISTA_PDM = [', 1)[1].split('\nconst LISTA_SOCIAL', 1)[0]
n_comissao = len(re.findall(r"limiarFixadoPor: 'comissao'", lista_pdm))
n_pacto = len(re.findall(r"limiarFixadoPor: 'pacto'", referencias_mjs))
n_conselho = len(re.findall(r"limiarFixadoPor: 'conselho'", referencias_mjs))
medicao('referencias_da_comissao', n_comissao, f"grep -c \"limiarFixadoPor: 'comissao'\" na LISTA_PDM de figuras.mjs@{CABECA}", 'a lista traz a dívida pública com limiar', "claim: 'divida-publica-2025'" in lista_pdm and 'nl: \'60\'' in lista_pdm)
medicao('referencias_do_pacto', n_pacto, f"grep -c \"limiarFixadoPor: 'pacto'\" em referencias-das-medidas.mjs@{CABECA}", 'a declaração é a do saldo', "'saldo-das-administracoes-publicas-2025'" in referencias_mjs)
medicao('referencias_do_conselho', n_conselho, f"grep -c \"limiarFixadoPor: 'conselho'\" em referencias-das-medidas.mjs@{CABECA}", 'a declaração é a da despesa líquida', "'crescimento-da-despesa-liquida-2025'" in referencias_mjs)
medicao('referencias_declaradas', n_comissao + n_pacto + n_conselho, f'{COMANDO} · a soma das três', 'a soma é o número de cartões com referência nas cópias', n_comissao + n_pacto + n_conselho == len(com_ref))
origens = figuras.split('export const ORIGENS_DAS_DEFINICOES', 1)[1].split('\n});', 1)[0]
chaves_das_origens = re.findall(r"^  '?([a-z][a-z0-9-]*)'?: \{", origens, re.M)
medicao('origens_das_definicoes_declaradas', len(chaves_das_origens), f'{COMANDO} · chaves de primeiro nível de ORIGENS_DAS_DEFINICOES em figuras.mjs@{CABECA}', 'a lista traz pdm-divida-publica', 'pdm-divida-publica' in chaves_das_origens)
definicoes = figuras.split('export const DEFINICOES_DAS_MEDIDAS', 1)[1].split('\n});', 1)[0]
chaves_das_definicoes = re.findall(r"^  '([a-z0-9-]+)': \{", definicoes, re.M)
medicao('definicoes_declaradas', len(chaves_das_definicoes), f'{COMANDO} · chaves de primeiro nível de DEFINICOES_DAS_MEDIDAS em figuras.mjs@{CABECA}', 'a lista traz a dívida pública', 'divida-publica-2025' in chaves_das_definicoes)
auditoria = json.loads(mostra('tests/cartao/perguntas-provadas.json'))
perguntas = auditoria['perguntas']
medicao('perguntas_auditadas', len(perguntas), f'git show {CABECA}:tests/cartao/perguntas-provadas.json · perguntas', 'a auditoria traz a dívida pública', any(p['id'] == 'divida-publica-2025' for p in perguntas))
medicao('pedacos_auditados', sum(len(p['pedacos']) for p in perguntas), f'{COMANDO} · pedacos por pergunta, somados', 'a dívida pública tem 2 pedaços', any(p['id'] == 'divida-publica-2025' and len(p['pedacos']) == 2 for p in perguntas))
medicao('apoios_auditados', sum(len(pd['apoios']) for p in perguntas for pd in p['pedacos']), f'{COMANDO} · apoios por pedaço, somados', 'cada pedaço tem pelo menos um apoio', all(len(pd['apoios']) >= 1 for p in perguntas for pd in p['pedacos']))
referencias_motor = json.loads(mostra('src/data/enquadramento/referencias.json'))
medicao('indicadores_no_ficheiro_do_motor', len(referencias_motor['indicadores']), f'git show {CABECA}:src/data/enquadramento/referencias.json · indicadores', 'a lista traz o saldo da balança corrente', any(i['id_da_linha'] == 'saldo-da-balanca-corrente-2025' for i in referencias_motor['indicadores']))
medicao('indicadores_com_limiar_no_motor', referencias_motor['com_limiar'], f'{COMANDO} · com_limiar do mesmo ficheiro', 'a chave existe e é um número', isinstance(referencias_motor['com_limiar'], int))
medicao('indicadores_sem_limiar_no_motor', referencias_motor['sem_limiar'], f'{COMANDO} · sem_limiar do mesmo ficheiro', 'as duas somam os indicadores', referencias_motor['com_limiar'] + referencias_motor['sem_limiar'] == len(referencias_motor['indicadores']))
strings = mostra('src/i18n/strings.mjs')
bloco_pt = strings[strings.index("fora: 'fora do valor de referência'"):][:800]
formas = [c for c in ('fora:', 'dentro:', 'foraBanda:', 'dentroBanda:') if c in bloco_pt]
medicao('formas_do_veredicto', len(formas), f"{COMANDO} · as chaves fora, dentro, foraBanda e dentroBanda de s.estado em strings.mjs@{CABECA}", 'a forma «fora» existe', 'fora:' in formas)

# --- 5 · a folha do cartão, na cabeça
css = mostra('src/styles/cartao-medida.css')


def tamanho(seletor):
    m = re.search(re.escape(seletor) + r'[^{]*\{[^}]*?font-size:\s*(\d+)px', css, re.S)
    return int(m.group(1)) if m else None


for chave, sel in (('numero', '.cartao-medida-num'), ('nome', '.cartao-medida-nome'), ('regua', '.cartao-medida-regua'), ('pergunta', '.cartao-medida-frase')):
    v = tamanho(sel)
    medicao(f'tamanho_{"da" if chave in ("regua", "pergunta") else "do"}_{chave}_px', v,
            f'{COMANDO} · font-size da primeira regra «{sel}» em cartao-medida.css@{CABECA}', 'o leitor da folha lê a regra', v is not None)

saida = {'brief': 'design/observatorio/BRIEF-L1-a-leitura-de-cada-medida.md',
         'guiao': 'design/observatorio/medidas/BRIEF-L1.py',
         'cabeca_lida': CABECA, 'copias': PASTA_DAS_COPIAS + '/',
         'medidas': medidas}
alvo = os.environ.get('OEDP_MEDIDAS_JSON') or os.path.join(RAIZ, 'design', 'observatorio', 'medidas', 'BRIEF-L1.json')
with open(alvo, 'w', encoding='utf-8') as f:
    json.dump(saida, f, ensure_ascii=False, indent=2); f.write('\n')
print(json.dumps(saida, ensure_ascii=False, indent=2))
