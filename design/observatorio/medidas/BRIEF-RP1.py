#!/usr/bin/env python3
"""As medições do §0 do `BRIEF-RP1-rendimentos-e-precos-os-cartoes.md`.

uso: python3 design/observatorio/medidas/BRIEF-RP1.py      (na raiz do repositório)

Escreve `design/observatorio/medidas/BRIEF-RP1.json` (ou o caminho de
`OEDP_MEDIDAS_JSON`, que é como o `scripts/check-briefs.py` o corre) e imprime o
mesmo JSON. Cada medição traz o nome por que o §0 a cita, o valor, o comando e um
conhecido-positivo do MESMO predicado (M5, §1.122).

CADA MEDIÇÃO É ESTÁVEL DE PROPÓSITO. As fontes leem-se na cabeça que estava no ar
a 26.09.2026 ao meio-dia, `334cc740` (o L1 e os registos de 26.09 aterrados), por
`git show`; as páginas construídas leem-se das cópias congeladas do L1,
`design/especime-v3/medicoes/l1-2026-09-24/paginas-depois/`, construídas da cabeça
`c1e155f0`, e o guião mede que entre essa cabeça e `334cc740` nenhum ficheiro que
a construção leia mudou. O motor lê-se na cabeça `1d10b3f` de `master`, pelo
`git show` do repositório do motor quando ele está nesta máquina; quando não está
(a CI do sítio), essas duas medições dizem «NÃO LIDO» com a razão e o conhecido-
positivo fica por encontrar, e o §0 não as cita com número.
"""
import hashlib
import json
import os
import re
import subprocess
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
CABECA = '334cc740'
CABECA_ANTERIOR = 'f672bd38'
PASTA_DAS_COPIAS = 'design/especime-v3/medicoes/l1-2026-09-24/paginas-depois'
COPIAS = os.path.join(RAIZ, PASTA_DAS_COPIAS)
FICHEIRO_DA_CABECA_DAS_COPIAS = os.path.join(RAIZ, 'design/especime-v3/medicoes/l1-2026-09-24/portoes/build.cabeca')
MOTOR = os.path.expanduser('~/Instruments/ResearchHub')
CABECA_DO_MOTOR = '1d10b3f'
COMANDO = 'python3 design/observatorio/medidas/BRIEF-RP1.py'
PASTAS_QUE_A_CONSTRUCAO_LE = ['src', 'public', 'ledger', 'scripts', 'tests', 'package.json', 'astro.config.mjs']


def git(*args, cwd=RAIZ):
    r = subprocess.run(['git', *args], cwd=cwd, capture_output=True)
    if r.returncode != 0:
        sys.stderr.write(f'git {" ".join(args)} falhou: {r.stderr.decode("utf-8", "replace")}\n')
        sys.exit(2)
    return r.stdout.decode('utf-8')


def mostra(caminho, cabeca=CABECA):
    return git('show', f'{cabeca}:{caminho}')


def existe_na_cabeca(cabeca, cwd=RAIZ):
    return subprocess.run(['git', 'cat-file', '-e', f'{cabeca}^{{commit}}'], cwd=cwd, capture_output=True).returncode == 0


def copia(nome):
    with open(os.path.join(COPIAS, nome), 'rb') as f:
        b = f.read()
    return b.decode('utf-8'), hashlib.sha256(b).hexdigest()


medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({'nome': nome, 'valor': valor, 'comando': comando,
                    'conhecido_positivo': {'o_que': o_que, 'encontrado': bool(encontrado)}})


# --- 0 · as cabeças e as cópias
medicao('cabeca_lida', CABECA, f'git cat-file -e {CABECA}^{{commit}}', 'a cabeça existe no repositório', existe_na_cabeca(CABECA))
with open(FICHEIRO_DA_CABECA_DAS_COPIAS, encoding='utf-8') as f:
    cabeca_das_copias = f.read().strip()[:8]
medicao('cabeca_das_copias', cabeca_das_copias, 'cat design/especime-v3/medicoes/l1-2026-09-24/portoes/build.cabeca (os 8 primeiros caracteres)',
        'a cabeça existe no repositório', existe_na_cabeca(cabeca_das_copias))


def ficheiros_mudados(de, ate):
    saida = git('diff', '--name-only', de, ate, '--', *PASTAS_QUE_A_CONSTRUCAO_LE)
    return [l for l in saida.splitlines() if l and not l.startswith('scripts/leituras/')]


medicao('ficheiros_que_a_construcao_le_mudados_entre_as_copias_e_a_cabeca', len(ficheiros_mudados(cabeca_das_copias, CABECA)),
        f'git diff --name-only {cabeca_das_copias} {CABECA} -- {" ".join(PASTAS_QUE_A_CONSTRUCAO_LE)}, sem scripts/leituras/',
        f'o mesmo diff entre {CABECA_ANTERIOR} e {CABECA} apanha ficheiros', len(ficheiros_mudados(CABECA_ANTERIOR, CABECA)) > 0)
copias = {}
for chave, nome in (('temas', 'temas_index.html'), ('primeira', 'index.html'), ('en_temas', 'en_themes_index.html')):
    texto, sha = copia(nome)
    copias[chave] = texto
    medicao(f'sha256_{chave}', sha, f'shasum -a 256 {PASTA_DAS_COPIAS}/{nome}', 'o resumo é o do ficheiro lido agora', len(sha) == 64)
temas, primeira = copias['temas'], copias['primeira']
RE_ARTIGO = re.compile(r'<article class="cartao-medida"[^>]*>.*?</article>', re.S)
artigos = RE_ARTIGO.findall(temas)


def ident(a):
    m = re.search(r'data-cartao-medida="([^"]+)"', a)
    return m.group(1) if m else ('camaras' if 'data-cartao-camaras' in a else None)


ids = [ident(a) for a in artigos]

# --- 1 · os cartões nacionais de hoje, por tema
medicao('cartoes_nacionais_nos_temas', len(artigos), f'{COMANDO} · <article class="cartao-medida"> em {PASTA_DAS_COPIAS}/temas_index.html',
        'o mesmo contador conta pelo menos um cartão na cópia da primeira página', len(RE_ARTIGO.findall(primeira)) >= 1)
seccoes = re.findall(r'<section class="pais-tema"[^>]*>.*?</section>', temas, re.S)
por_tema = {}
for s in seccoes:
    m = re.search(r'id="tema-([^"]+)"', s) or re.search(r'data-tema="([^"]+)"', s)
    nome = m.group(1) if m else re.sub(r'<[^>]+>', '', re.search(r'<h2[^>]*>(.*?)</h2>', s, re.S).group(1)).strip()
    por_tema[nome] = len(RE_ARTIGO.findall(s))
medicao('temas_com_medidas', len(seccoes), f'{COMANDO} · <section class="pais-tema"> em temas_index.html', 'a cópia tem secções de tema', len(seccoes) >= 1)
medicao('cartoes_por_tema', por_tema, f'{COMANDO} · artigos por <section class="pais-tema">, pelo nome da secção', 'a soma por tema é o total de cartões', sum(por_tema.values()) == len(artigos))
carta = mostra('design/observatorio/CARTA-DOS-CONTEUDOS.md')
tabela = carta.split('## 2 ·', 1)[1].split('## 3 ·', 1)[0]
medicao('temas_da_carta', len(re.findall(r'^\| \d+ \| ', tabela, re.M)), f'{COMANDO} · linhas «| n |» da tabela do §2 de CARTA-DOS-CONTEUDOS.md@{CABECA}',
        'o mesmo padrão apanha a primeira linha da tabela', bool(re.search(r'^\| 1 \| Economia', tabela, re.M)))

# --- 2 · o que não existe hoje: preços no consumidor, pensões, RSI, linha de pobreza, remuneração média


def com(palavras):
    return [i for i in ids if i and any(p in i for p in palavras)]


precos = com(['inflacao', 'ipc', 'alimentacao', 'energia', 'combustiveis', 'rendas'])
medicao('cartoes_de_precos_no_consumidor', len(precos), f'{COMANDO} · artigos cujo identificador contém inflacao, ipc, alimentacao, energia, combustiveis ou rendas',
        'o mesmo predicado com «precos» apanha o índice de preços da habitação', 'precos-da-habitacao-2025' in com(['precos']))
medicao('cartoes_de_pensoes', len(com(['pensao', 'pensionista'])), f'{COMANDO} · artigos cujo identificador contém pensao ou pensionista',
        'o mesmo predicado com «pobreza» apanha o risco de pobreza', 'risco-de-pobreza-ou-exclusao-2025' in com(['pobreza']))
medicao('cartoes_do_rsi', len(com(['rsi', 'rendimento-social'])), f'{COMANDO} · artigos cujo identificador contém rsi ou rendimento-social',
        'o mesmo predicado com «rendimento» apanha o rácio S80/S20 pelo nome do cartão', any('racio-s80-s20' in i for i in ids))
medicao('cartoes_da_linha_de_pobreza', len(com(['linha-de-pobreza', 'limiar-de-pobreza'])), f'{COMANDO} · artigos cujo identificador contém linha-de-pobreza',
        'o mesmo predicado com «pobreza» apanha o risco de pobreza', 'risco-de-pobreza-ou-exclusao-2025' in com(['pobreza']))
medicao('cartoes_da_remuneracao_media', len(com(['remuneracao'])), f'{COMANDO} · artigos cujo identificador contém remuneracao',
        'o mesmo predicado com «ganho» apanha o ganho médio mensal', 'ganho-medio-mensal-2024' in com(['ganho']))
mensais = [i for i in ids if i and re.search(r'-\d{4}-\d{2}$', i)]
medicao('cartoes_nacionais_com_periodo_mensal', len(mensais), f'{COMANDO} · identificadores de cartão que acabam em -aaaa-mm', 'o mesmo padrão apanha um identificador de mentira',
        bool(re.search(r'-\d{4}-\d{2}$', 'inflacao-2026-08')))
enq = mostra('src/lib/enquadramento.mjs')
m = re.search(r"const m = (/\^\(\.\*\)-\(\\d\{4\}\)\$/)\.exec\(String\(id\)\)", enq)
medicao('regra_do_periodo_anterior_no_enquadramento', m.group(1) if m else None, f'{COMANDO} · a expressão de anoDoIdentificador() em enquadramento.mjs@{CABECA}', 'a expressão só aceita quatro algarismos no fim', m is not None and '\\d{4}' in m.group(1))
sem_regua = [ident(a) for a in artigos if 'data-cartao-medida="' in a and 'class="cartao-medida-regua"' not in a]
medicao('cartoes_de_linha_sem_regua', len(sem_regua), f'{COMANDO} · artigos de linha sem class="cartao-medida-regua"', 'a lista traz a retribuição mínima', 'retribuicao-minima-mensal-garantida-continente-2026' in sem_regua)

# --- 3 · o motor: os pedidos ao INE que já existem (lido do motor quando está nesta máquina)
if os.path.isdir(MOTOR) and existe_na_cabeca(CABECA_DO_MOTOR, cwd=MOTOR):
    fetch = git('show', f'{CABECA_DO_MOTOR}:publisher/dominios_fetch.py', cwd=MOTOR)
    pedidos_ine = len(re.findall(r'json_indicador/pindica\.jsp', fetch))
    medicao('pedidos_ao_ine_no_construtor_dos_dominios', pedidos_ine, f'git -C ~/Instruments/ResearchHub show {CABECA_DO_MOTOR}:publisher/dominios_fetch.py · «json_indicador/pindica.jsp»',
            'a lista traz o pedido do ganho médio mensal (0012656)', 'varcd=0012656' in fetch)
    leitores = git('show', f'{CABECA_DO_MOTOR}:publisher/dominios_readers.py', cwd=MOTOR)
    medicao('leitor_de_indicador_do_ine_no_motor', len(re.findall(r'^def ine_indicator\(', leitores, re.M)), f'git -C ~/Instruments/ResearchHub show {CABECA_DO_MOTOR}:publisher/dominios_readers.py · «def ine_indicator(»',
            'o ficheiro tem o leitor das séries do Eurostat', bool(re.search(r'^def eurostat_series\(', leitores, re.M)))
else:
    for nome in ('pedidos_ao_ine_no_construtor_dos_dominios', 'leitor_de_indicador_do_ine_no_motor'):
        medicao(nome, 'NÃO LIDO: o motor não está nesta máquina', 'git -C ~/Instruments/ResearchHub show …', 'o motor está nesta máquina', False)

saida = {'brief': 'design/observatorio/BRIEF-RP1-rendimentos-e-precos-os-cartoes.md',
         'guiao': 'design/observatorio/medidas/BRIEF-RP1.py',
         'cabeca_lida': CABECA, 'copias': PASTA_DAS_COPIAS + '/', 'motor': CABECA_DO_MOTOR,
         'medidas': medidas}
alvo = os.environ.get('OEDP_MEDIDAS_JSON') or os.path.join(RAIZ, 'design', 'observatorio', 'medidas', 'BRIEF-RP1.json')
with open(alvo, 'w', encoding='utf-8') as f:
    json.dump(saida, f, ensure_ascii=False, indent=2); f.write('\n')
print(json.dumps(saida, ensure_ascii=False, indent=2))
