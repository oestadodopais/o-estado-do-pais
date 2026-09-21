#!/usr/bin/env python3
"""Confere as citações do mapa do repositório contra os ficheiros que ele cita.

uso: python3 scripts/leituras/conferir-mapa.py design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md

O mapa cita os guiões e as vistas por `ficheiro:linha`, com a frase do ficheiro
entre «…». As linhas andam com cada commit; a citação é a âncora. Para cada
citação de uma linha do mapa, este guião procura-a à volta de cada linha citada
nessa mesma linha do mapa (±7), e, falhando, no ficheiro inteiro, dizendo onde
está. Diz também as linhas citadas para lá do fim de um ficheiro.

Limites, ditos: só confere citações literais com referência de linha na mesma
linha do mapa; um nome de secção ou uma paráfrase entre «…» sai como «não
encontrada» e lê-se à mão; uma referência sem citação não se confere aqui. Não
altera nada. Corre-se sempre que o mapa se emenda, e depois de um bloco que
mexa nos portões.
"""
import re, sys, os, unicodedata
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MAPA = sys.argv[1]
def norm(s):
    s = unicodedata.normalize('NFC', s)
    s = re.sub(r'[`*_]', '', s)
    s = re.sub(r'^\s*(\*|//|#)\s?', ' ', s)
    return re.sub(r'\s+', ' ', s).strip().lower()
cache = {}
def carrega(path):
    if path not in cache:
        p = os.path.join(RAIZ, path)
        cache[path] = open(p, encoding='utf-8', errors='replace').read().split('\n') if os.path.isfile(p) else None
    return cache[path]
def janela(conteudo, ln, r=7):
    return ' '.join(norm(c) for c in conteudo[max(0, ln - 1 - r): ln + r])
RE_FICH = re.compile(r'`((?:scripts|tests|src|design|ledger|public|registos|studies-src)/[^`\s:]+?\.(?:mjs|astro|json|md|py|yml|js|css)|package\.json|vercel\.json|CLAUDE\.md|DECISIONS\.md)(?::(\d+))?`')
RE_NODE = re.compile(r'`node ((?:scripts|tests)/[^\s`]+\.mjs)')
RE_BARE = re.compile(r'`:(\d+)`')
RE_QUOTE = re.compile(r'«([^«»]{15,})»')
linhas = open(MAPA, encoding='utf-8').read().split('\n')
ok = 0; noutra = []; nao = []; fora = []
seccao_gate = False
for n, l in enumerate(linhas, 1):
    if l.startswith('### '): seccao_gate = ('gate:html' in l and 'por dentro' in l)
    if l.startswith('## '): seccao_gate = False
    m = RE_NODE.search(l)
    fixo = m.group(1) if m else ('scripts/gate-html.mjs' if seccao_gate else None)
    refs = []; ultimo = fixo
    ev = [(m.start(), 'f', m.groups()) for m in RE_FICH.finditer(l)] + [(m.start(), 'b', m.group(1)) for m in RE_BARE.finditer(l)]
    for pos, t, v in sorted(ev):
        if t == 'f':
            ultimo = v[0]
            if v[1]: refs.append((v[0], int(v[1])))
        else:
            refs.append(((fixo or ultimo), int(v)))
    for f, ln in refs:
        c = carrega(f) if f else None
        if c is not None and ln > len(c): fora.append((n, f, ln, len(c)))
    for q in RE_QUOTE.findall(l):
        alvo = norm(q)[:55]
        achou = False
        ficheiros = []
        for f, ln in refs:
            c = carrega(f) if f else None
            if c is None or ln > len(c): continue
            ficheiros.append(f)
            if alvo in janela(c, ln): achou = True; break
        if achou: ok += 1; continue
        if not refs: continue  # citação sem referência de linha: fora do alcance deste guião
        onde = []
        for f in dict.fromkeys(ficheiros):
            c = carrega(f); todo = [norm(x) for x in c]
            for i in range(len(todo)):
                if alvo[:28] in ' '.join(todo[i:i + 3]):
                    onde.append(f'{f}:{i + 1}'); break
        (noutra if onde else nao).append((n, q[:60], [f'{f}:{ln}' for f, ln in refs][:4], onde))
print('citações conferidas na linha citada (±7):', ok)
print('citação está no ficheiro, mas longe da linha citada:', len(noutra))
for n, q, r, o in noutra: print(f'   mapa l.{n} «{q}» citada em {r} → está em {o}')
print('citação não encontrada em nenhum dos ficheiros citados na mesma linha:', len(nao))
for n, q, r, o in nao: print(f'   mapa l.{n} «{q}» refs {r}')
print('linha citada para lá do fim do ficheiro:', len(fora))
for x in fora: print('   mapa l.%d %s:%d (tem %d linhas)' % x)
