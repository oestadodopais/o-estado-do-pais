#!/usr/bin/env python3
"""As medições do §0 do `BRIEF-R1-o-lado-do-leitor-depois-da-leitura-de-fora.md`.

uso: python3 design/observatorio/medidas/BRIEF-R1.py      (na raiz do repositório)

Escreve `design/observatorio/medidas/BRIEF-R1.json` (ou o caminho de
`OEDP_MEDIDAS_JSON`, que é como o `scripts/check-briefs.py` o corre) e imprime o
mesmo JSON. Cada medição traz o nome por que o §0 a cita, o valor, o comando e um
conhecido-positivo do MESMO predicado (M5, §1.122).

CADA MEDIÇÃO É ESTÁVEL DE PROPÓSITO. As fontes leem-se na cabeça que a leitura de
fora leu, `d3481ba9` (o que estava no ar a 23.09.2026 de manhã), por `git show`,
e por isso não mudam com o trabalho que o bloco faz; as páginas construídas
leem-se de cópias congeladas em `design/especime-v3/medicoes/r1-2026-09-23/paginas/`,
presas pelo sha256 escrito no ficheiro. A CI clona com `fetch-depth: 0`, por isso
o `git show` de uma cabeça antiga corre lá como aqui.
"""
import hashlib
import json
import os
import re
import subprocess
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
CABECA = 'd3481ba9'
COPIAS = os.path.join(RAIZ, 'design', 'especime-v3', 'medicoes', 'r1-2026-09-23', 'paginas')
COMANDO = 'python3 design/observatorio/medidas/BRIEF-R1.py'


def mostra(caminho):
    """O ficheiro tal como estava na cabeça que a leitura de fora leu."""
    r = subprocess.run(['git', 'show', f'{CABECA}:{caminho}'], cwd=RAIZ, capture_output=True)
    if r.returncode != 0:
        sys.stderr.write(f'git show {CABECA}:{caminho} falhou: {r.stderr.decode("utf-8", "replace")}\n')
        sys.exit(2)
    return r.stdout.decode('utf-8')


def grep_ficheiros(padrao, pasta):
    """Os ficheiros de `pasta` na cabeça que contêm o padrão (git grep sobre a árvore)."""
    r = subprocess.run(['git', 'grep', '-l', '-E', padrao, CABECA, '--', pasta], cwd=RAIZ, capture_output=True)
    if r.returncode not in (0, 1):
        sys.stderr.write(f'git grep falhou: {r.stderr.decode("utf-8", "replace")}\n')
        sys.exit(2)
    return [l.split(':', 1)[1] for l in r.stdout.decode('utf-8').splitlines() if ':' in l]


def copia(nome):
    caminho = os.path.join(COPIAS, nome)
    with open(caminho, 'rb') as f:
        b = f.read()
    return b.decode('utf-8'), hashlib.sha256(b).hexdigest()


medidas = []


def medicao(nome, valor, comando, o_que, encontrado):
    medidas.append({'nome': nome, 'valor': valor, 'comando': comando,
                    'conhecido_positivo': {'o_que': o_que, 'encontrado': bool(encontrado)}})


# --- 1 · a pesquisa dos lugares (public/js/municipios.js e src/views/LugaresView.astro)
js = mostra('public/js/municipios.js')
marca = 'a fila de resultados (livro-razão)'
assert marca in js
antes, depois = js.split(marca, 1)
conta_pd = lambda s: len(re.findall(r'preventDefault\(', s))
medicao('pesquisa_enter_recarrega', conta_pd(depois), f'{COMANDO} · preventDefault( no ramo da fila de municipios.js@{CABECA}',
        'o mesmo contador encontra o preventDefault( do ramo da lista agrupada, acima da marca', conta_pd(antes) == 1)
conta_mostra = lambda s: len(re.findall(r'(lista|pesquisaRes|resultados)\.hidden\s*=\s*false', s))
medicao('pesquisa_lista_nunca_se_mostra', conta_mostra(depois), f'{COMANDO} · «<lista>.hidden = false» no ramo da fila de municipios.js@{CABECA}',
        'o mesmo contador encontra a linha «lista.hidden = false;» numa amostra de mentira', conta_mostra('  lista.hidden = false;\n') == 1)
r_ul = subprocess.run(['git', 'grep', '-c', '-E', r'<ul class="pesquisa-res"[^>]* hidden', CABECA, '--', 'src'], cwd=RAIZ, capture_output=True)
linhas_ul = sum(int(l.rsplit(':', 1)[1]) for l in r_ul.stdout.decode('utf-8').splitlines() if ':' in l)
medicao('pesquisa_lista_nasce_escondida', linhas_ul, f'git grep -c -E \'<ul class="pesquisa-res"[^>]* hidden\' {CABECA} -- src',
        'o mesmo grep encontra a lista escondida numa vista ou componente de src/', linhas_ul >= 1)

# --- 2 · a cor de estado nas páginas construídas (cópias congeladas)
RE_ESTADO = re.compile(r'\b(sq-fora|sq-dentro|est-fora|est-dentro|barra-fora|barra-dentro)\b')
copias = {}
for chave, nome in (('primeira', 'index.html'), ('temas', 'temas_index.html'), ('europeia', 'uniao-europeia_index.html'),
                    ('mourao', 'municipios_mourao_index.html'), ('recibo', 'livro-razao_mourao-desemprego-registado-2025-12_index.html')):
    texto, sha = copia(nome)
    copias[chave] = texto
    medidas_sha = sha
    medicao(f'sha256_{chave}', sha, f'shasum -a 256 design/especime-v3/medicoes/r1-2026-09-23/paginas/{nome}',
            'o resumo é o do ficheiro lido agora', len(sha) == 64)
n_eu = len(RE_ESTADO.findall(copias['europeia']))
medicao('cor_de_estado_na_primeira_pagina', len(RE_ESTADO.findall(copias['primeira'])), f'{COMANDO} · classes de estado em paginas/index.html',
        'o mesmo contador encontra as classes na cópia da página europeia', n_eu > 0)
medicao('cor_de_estado_nos_temas', len(RE_ESTADO.findall(copias['temas'])), f'{COMANDO} · classes de estado em paginas/temas_index.html',
        'o mesmo contador encontra as classes na cópia da página europeia', n_eu > 0)
medicao('cor_de_estado_na_pagina_europeia', n_eu, f'{COMANDO} · classes de estado em paginas/uniao-europeia_index.html',
        'o mesmo contador conta pelo menos uma classe nesta cópia', n_eu > 0)

# --- 3 · a ressalva da habitação
ficheiros = grep_ficheiros('regime de propriedade|regime de ocupação|tenure', 'src')
sem_agenda = [f for f in ficheiros if not f.endswith('src/data/agenda.json')]
medicao('ficheiros_com_a_ressalva_fora_da_agenda', len(sem_agenda), f'git grep -l -E "regime de propriedade|regime de ocupação|tenure" {CABECA} -- src, sem agenda.json',
        'o mesmo grep encontra a ressalva em src/data/agenda.json', any(f.endswith('src/data/agenda.json') for f in ficheiros))
agenda = mostra('src/data/agenda.json')
medicao('agenda_diz_que_a_primeira_pagina_ja_diz', agenda.count('a primeira página já diz'), f'{COMANDO} · «a primeira página já diz» em agenda.json@{CABECA}',
        'o mesmo contador encontra a frase', agenda.count('a primeira página já diz') >= 1)
medicao('agenda_diz_que_nao_publica_a_media', agenda.count('não publica hoje a média europeia'), f'{COMANDO} · «não publica hoje a média europeia» em agenda.json@{CABECA}',
        'o mesmo contador encontra a frase', agenda.count('não publica hoje a média europeia') >= 1)
primeira = copias['primeira']
def cartao_com_media(pagina, titulo):
    """Quantos cartões com este título trazem «União Europeia» antes do cartão seguinte."""
    n = 0
    for m in re.finditer(re.escape(titulo), pagina):
        fim = pagina.find('<article', m.end())
        if 'União Europeia' in pagina[m.end():fim if fim > 0 else len(pagina)]:
            n += 1
    return n
artigos_com_media = sum(1 for a in primeira.split('<article')[1:] if 'União Europeia' in a)
medicao('cartao_da_habitacao_com_media_europeia', cartao_com_media(primeira, 'Sobrecarga do custo da habitação'), f'{COMANDO} · o cartão da sobrecarga com «União Europeia» antes do cartão seguinte, em paginas/index.html',
        'o mesmo predicado encontra a média noutros cartões da mesma cópia (mais do que um artigo com «União Europeia»)', artigos_com_media >= 2)

# --- 4 · «O que mudou» com palavras internas
mud = mostra('src/data/mudancas-do-projeto.mjs')
entradas = re.findall(r"pt:\s*'((?:[^'\\]|\\.)*)'", mud)
internas = [e for e in entradas if re.search(r'\brecibos?\b|\bcart(ão|ões)\b', e)]
medicao('mudancas_declaradas', len(entradas), f'{COMANDO} · entradas «pt:» em mudancas-do-projeto.mjs@{CABECA}', 'o mesmo leitor conta pelo menos uma entrada', len(entradas) >= 1)
medicao('mudancas_com_palavras_internas', len(internas), f'{COMANDO} · entradas com «recibos» ou «cartões»', 'o mesmo predicado apanha «saíram dos recibos» numa entrada', bool(re.search(r'\brecibos?\b', 'saíram dos recibos e dos cartões')))

# --- 5 · a lista dos estudos
estudos = mostra('src/views/EstudosView.astro')
medicao('estudos_seccao_por_lugar', estudos.count('id="por-lugar"'), f'{COMANDO} · id="por-lugar" em EstudosView.astro@{CABECA}', 'o mesmo contador encontra a secção', estudos.count('id="por-lugar"') >= 1)

# --- 6 · as definições com a sigla por verificar
figuras = mostra('src/data/figuras.mjs')
n_nfc = figuras.count('por extenso da sigla permanece ')
medicao('definicoes_com_sigla_por_verificar', n_nfc, f'{COMANDO} · «por extenso da sigla permanece » em figuras.mjs@{CABECA}', 'o mesmo contador encontra a frase', n_nfc >= 1)

# --- 7 · o rótulo de IA no topo
usos = grep_ficheiros('onde="topo"', 'src')
medicao('vistas_com_o_rotulo_no_topo', len(usos), f'git grep -l onde="topo" {CABECA} -- src', 'o mesmo grep encontra EstudoView.astro', any(f.endswith('EstudoView.astro') for f in usos))

# --- 8 · o recibo: o valor e a unidade colados no H1
recibo = copias['recibo']
RE_COLADO = re.compile(r'linha-valor-num">[^<]*</span><span class="campo-valor')
medicao('recibo_valor_e_unidade_colados', len(RE_COLADO.findall(recibo)), f'{COMANDO} · «</span><span class="campo-valor» sem espaço, em paginas/livro-razao_…_index.html', 'o mesmo padrão encontra o par colado na cópia', len(RE_COLADO.findall(recibo)) >= 1)

# --- 9 · os cartões do concelho sem régua
mourao = copias['mourao']
n_cartoes = len(re.findall(r'<article class="cartao-medida"', mourao))
n_reguas = len(re.findall(r'class="cartao-medida-regua"', mourao))
medicao('cartoes_do_concelho', n_cartoes, f'{COMANDO} · <article class="cartao-medida"> em paginas/municipios_mourao_index.html', 'o mesmo contador conta pelo menos um cartão', n_cartoes >= 1)
medicao('cartoes_do_concelho_com_regua', n_reguas, f'{COMANDO} · class="cartao-medida-regua" na mesma cópia', 'o mesmo contador encontra a régua do índice de dívida', n_reguas >= 1)

# --- 10 · as frases do Método
metodo = mostra('src/data/metodo.mjs')
medicao('metodo_frase_da_cor', metodo.count('âmbar quando o valor está fora dele'), f'{COMANDO} · «âmbar quando o valor está fora dele» em metodo.mjs@{CABECA}', 'o mesmo contador encontra a frase', metodo.count('âmbar quando o valor está fora dele') >= 1)
medicao('metodo_frase_do_base', metodo.count('Uma fonte, o Portal BASE'), f'{COMANDO} · «Uma fonte, o Portal BASE» em metodo.mjs@{CABECA}', 'o mesmo contador encontra a frase', metodo.count('Uma fonte, o Portal BASE') >= 1)

# --- 11 · a 2.ª notificação do Procedimento dos Défices Excessivos (INE, 23.09.2026), na cópia do destaque
ine_html, ine_sha = copia('ine_destaque-pde-771939216.html')
medicao('sha256_ine', ine_sha, 'shasum -a 256 design/especime-v3/medicoes/r1-2026-09-23/paginas/ine_destaque-pde-771939216.html', 'o resumo é o do ficheiro lido agora', len(ine_sha) == 64)
import html as _html
ine_txt = re.sub(r'\s+', ' ', _html.unescape(re.sub(r'<[^>]+>', ' ', ine_html)))
def apanha(padrao, texto):
    m = re.search(padrao, texto)
    return m.group(1) if m else None
divida_2025 = apanha(r'dívida bruta das AP terá diminuído para (\d+,\d)% do PIB', ine_txt)
divida_2024 = apanha(r'dívida bruta das AP terá diminuído para \d+,\d% do PIB \((\d+,\d)% no ano anterior\)', ine_txt)
saldo_2025 = apanha(r'o que correspondeu a (\d+,\d)% do PIB', ine_txt)
medicao('ine_divida_2025', divida_2025, f'{COMANDO} · «terá diminuído para N% do PIB» no destaque do INE copiado', 'o mesmo padrão apanha «89,2» numa frase de mentira com essa forma', apanha(r'dívida bruta das AP terá diminuído para (\d+,\d)% do PIB', 'A dívida bruta das AP terá diminuído para 89,2% do PIB (93,0% no ano anterior).') == '89,2')
medicao('ine_divida_2024', divida_2024, f'{COMANDO} · «(N% no ano anterior)» na mesma frase', 'o mesmo padrão apanha «93,0» na frase de mentira', apanha(r'dívida bruta das AP terá diminuído para \d+,\d% do PIB \((\d+,\d)% no ano anterior\)', 'A dívida bruta das AP terá diminuído para 89,2% do PIB (93,0% no ano anterior).') == '93,0')
medicao('ine_saldo_2025', saldo_2025, f'{COMANDO} · «o que correspondeu a N% do PIB» no destaque copiado', 'o mesmo padrão apanha «0,7» na frase de mentira', apanha(r'o que correspondeu a (\d+,\d)% do PIB', 'saldo positivo de 2 045,4 milhões de euros em 2025, o que correspondeu a 0,7% do PIB (0,7% em 2024)') == '0,7')

saida = {'brief': 'design/observatorio/BRIEF-R1-o-lado-do-leitor-depois-da-leitura-de-fora.md',
         'guiao': 'design/observatorio/medidas/BRIEF-R1.py',
         'cabeca_lida': CABECA, 'copias': 'design/especime-v3/medicoes/r1-2026-09-23/paginas/',
         'medidas': medidas}
alvo = os.environ.get('OEDP_MEDIDAS_JSON') or os.path.join(RAIZ, 'design', 'observatorio', 'medidas', 'BRIEF-R1.json')
with open(alvo, 'w', encoding='utf-8') as f:
    json.dump(saida, f, ensure_ascii=False, indent=2); f.write('\n')
print(json.dumps(saida, ensure_ascii=False, indent=2))
