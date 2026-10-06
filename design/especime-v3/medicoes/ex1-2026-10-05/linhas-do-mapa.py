#!/usr/bin/env python3
"""EX1 (05.10.2026): as citações do mapa que andaram com as linhas que o bloco acrescentou, postas em dia pela conta do diff.

uso (da raiz do sítio): python3 design/especime-v3/medicoes/ex1-2026-10-05/linhas-do-mapa.py <cabeça de partida> [--escrever]

Para cada referência `ficheiro:linha` do mapa (e cada `:linha` solta, com o ficheiro que o `conferir-mapa.py` lhe dá),
se o ficheiro mudou entre a cabeça de partida e a de agora, a linha nova é a velha mais o que os pedaços do
`git diff -U0` acrescentaram ou tiraram antes dela; uma linha velha dentro de um pedaço mudado vai para o começo do
pedaço novo. O guião lê as referências com as mesmas expressões do `conferir-mapa.py`. Sem `--escrever` só diz o que
mudaria. Não toca em nenhuma citação («…»): só nos números de linha.
"""
import re, subprocess, sys, os
RAIZ = os.getcwd()
MAPA = 'design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md'
BASE = sys.argv[1]
ESCREVER = '--escrever' in sys.argv
RE_FICH = re.compile(r'`((?:scripts|tests|src|design|ledger|public|registos|studies-src|api|supabase)/[^`\s:]+?\.(?:mjs|astro|json|md|py|yml|js|css|sql)|package\.json|vercel\.json|CLAUDE\.md|DECISIONS\.md)(?::(\d+))?`')
RE_NODE = re.compile(r'`node ((?:scripts|tests)/[^\s`]+\.mjs)')
RE_BARE = re.compile(r'`:(\d+)`')
pedacos = {}
def hunks(f):
    if f not in pedacos:
        r = subprocess.run(['git', 'diff', '-U0', BASE, 'HEAD', '--', f], capture_output=True, text=True, check=True)
        hs = []
        for m in re.finditer(r'^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@', r.stdout, re.M):
            a, b, c, d = int(m.group(1)), int(m.group(2) or 1), int(m.group(3)), int(m.group(4) or 1)
            hs.append((a, b, c, d))
        pedacos[f] = hs
    return pedacos[f]
def nova(f, ln):
    desvio = 0
    for a, b, c, d in hunks(f):
        if b == 0:
            # inserção depois da linha a
            if a < ln: desvio += d
            continue
        if a + b - 1 < ln: desvio += d - b
        elif a <= ln: return c if d else c  # dentro de um pedaço mudado
    return ln + desvio
linhas = open(MAPA, encoding='utf-8').read().split('\n')
mudancas = []
seccao_gate = False
for n, l in enumerate(linhas):
    if l.startswith('### '): seccao_gate = ('gate:html' in l and 'por dentro' in l)
    if l.startswith('## '): seccao_gate = False
    m = RE_NODE.search(l)
    fixo = m.group(1) if m else ('scripts/gate-html.mjs' if seccao_gate else None)
    ev = [(x.start(), 'f', x) for x in RE_FICH.finditer(l)] + [(x.start(), 'b', x) for x in RE_BARE.finditer(l)]
    ultimo = fixo
    trocas = []
    for pos, t, x in sorted(ev, key=lambda e: e[0]):
        if t == 'f':
            ultimo = x.group(1)
            if x.group(2):
                f, ln = x.group(1), int(x.group(2))
                nl = nova(f, ln)
                if nl != ln: trocas.append((x.start(2), x.end(2), str(nl), f, ln))
        else:
            f = fixo or ultimo
            if f:
                ln = int(x.group(1)); nl = nova(f, ln)
                if nl != ln: trocas.append((x.start(1), x.end(1), str(nl), f, ln))
    for s, e, novo, f, ln in sorted(trocas, reverse=True):
        l = l[:s] + novo + l[e:]
        mudancas.append((n + 1, f, ln, int(novo)))
    linhas[n] = l
for n, f, a, b in mudancas: print(f'mapa l.{n} {f}:{a} -> {b}')
print(f'{len(mudancas)} referência(s) postas em dia')
if ESCREVER: open(MAPA, 'w', encoding='utf-8').write('\n'.join(linhas))
